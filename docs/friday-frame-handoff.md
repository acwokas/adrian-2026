# Friday Frame approval and publishing handoff

The 25 September 2026 miss occurred because approved copy remained only in conversation. The publisher requires a dated source file on astro-rebuild.

1. Preserve final approved copy exactly. Record content approval separately from publication permission.
2. Before declaring a piece queued, create its dated Markdown file with draft: true, validate the build, commit and push to astro-rebuild, then read the remote file back. A local file or chat approval alone is not a queue receipt. Complete this in the interactive approval turn when staging is authorized.
3. When publication is explicitly requested now, use draft: false, deploy through the existing deployment path and verify the live article and archive. Do not also dispatch the weekly publisher.
4. Record the slug, approval reference, remote commit and state (approved, staged or live) in the website automation health record. Report any unfinished step explicitly.
5. Thursday evening and Friday morning monitoring must compare the remote queue with the approved selection. Flag missing content before Friday 10:00 Singapore publication. Monitoring does not grant permission to publish.
6. Provide LinkedIn copy and hashtags for manual posting. Never post or send through another channel without explicit authorization.

A workflow success alone is insufficient. Verify the live article title, body, archive link and draft status. The normal Friday publisher should see an already-live article and complete without duplicate publication after an early manual release.

## Review expiry and existing publications

The seven-day window applies to new publication and edited copy, including draft promotion. It must not block an unrelated release because an unchanged published article is older.

Deployment resolves the exact commit of the most recent successful `deploy.yml` run on `astro-rebuild`. The whole-site gate may retain an expired receipt only when the current file is byte-for-byte identical to a non-draft file at that commit. Signature, repository, path, complete-document digest and valid review timing are still checked. Missing deployment history fails closed. Explicit `--file` publication checks always require a current receipt, even for unchanged files.

Local builds use the fetched `origin/astro-rebuild` baseline. CI uses the successful-deployment commit, never the incoming branch head or a failed deployment. Retained receipts are reported as `published_review_retained`, not a fresh factual review. Any factual correction or updated source requires a new review.
