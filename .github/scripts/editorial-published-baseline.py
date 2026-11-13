#!/usr/bin/env python3
"""Resolve a successful production build that predates this editorial check."""
import datetime
import json
import os
import re
import subprocess
import urllib.request

REPO = 'acwokas/adrian-2026'


def select_baseline(runs, current, candidate):
    cutoff = datetime.datetime.fromisoformat(current['created_at'].replace('Z', '+00:00'))
    eligible = []
    for run in runs:
        if (run.get('head_branch') != 'astro-rebuild'
                or run.get('status') != 'completed' or run.get('conclusion') != 'success'
                or run.get('event') not in ('push', 'workflow_dispatch')
                or run.get('path') != '.github/workflows/deploy.yml'
                or run.get('head_sha') == candidate):
            continue
        sha = run.get('head_sha', '')
        if not re.fullmatch(r'[a-f0-9]{40}', sha):
            continue
        started = datetime.datetime.fromisoformat(run['created_at'].replace('Z', '+00:00'))
        finished = datetime.datetime.fromisoformat(run['updated_at'].replace('Z', '+00:00'))
        # A concurrent deployment cannot establish prior publication.
        if started < cutoff and finished < cutoff:
            eligible.append((started, sha, run['id']))
    if not eligible:
        raise ValueError('No prior successful production deployment baseline')
    _, sha, run_id = max(eligible)
    return sha, run_id


def main():
    if os.environ.get('GITHUB_REPOSITORY') != REPO:
        raise ValueError('Unexpected repository')
    token = os.environ['GH_TOKEN']
    def api(path):
        req = urllib.request.Request('https://api.github.com/repos/' + REPO + path,
            headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json',
                     'X-GitHub-Api-Version': '2022-11-28'})
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response)
    current = api('/actions/runs/' + os.environ['GITHUB_RUN_ID'])
    event = json.load(open(os.environ['GITHUB_EVENT_PATH']))
    candidate = event.get('pull_request', {}).get('head', {}).get('sha', os.environ['GITHUB_SHA'])
    runs = api('/actions/workflows/deploy.yml/runs?branch=astro-rebuild&status=success&per_page=100')
    sha, run_id = select_baseline(runs['workflow_runs'], current, candidate)
    subprocess.run(['git', 'fetch', '--no-tags', '--depth=1', 'origin', sha], check=True)
    subprocess.run(['git', 'cat-file', '-e', sha + '^{commit}'], check=True)
    with open(os.environ['GITHUB_ENV'], 'a') as output:
        output.write('EDITORIAL_PUBLISHED_REF=' + sha + '\n')
    print('Editorial publication baseline:', sha, 'from successful deploy run', run_id)


if __name__ == '__main__':
    main()
