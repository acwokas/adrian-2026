"""Select one exact child run from a bounded metadata snapshot, without effects."""
import json
import os
import sys


def select(runs, sha, title, branch):
    matches = [run for run in runs if
               run.get('displayTitle') == title and
               run.get('headSha') == sha and
               run.get('headBranch') == branch and
               run.get('event') == 'workflow_dispatch']
    if len(matches) > 1:
        raise ValueError('Ambiguous child deployment identity; reconcile without dispatching again')
    return str(matches[0]['databaseId']) if matches else ''


if __name__ == '__main__':
    print(select(json.load(sys.stdin), os.environ['PUBLICATION_SHA'],
                 os.environ['DEPLOY_TITLE'], os.environ['DEPLOY_BRANCH']))
