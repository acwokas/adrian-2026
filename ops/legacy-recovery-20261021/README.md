# Legacy article recovery, 21 October 2026

GA4 property 517148315 was queried for 21 October 2025 through 20 October 2026. A separate exact-title report for 14-20 October 2026 reconciled the screenshot: 28 not-found views across 14 paths, representing 13 articles. The homepage itself returned 200.

Adrian explicitly requested updated articles and redirects for all 13 affected topics. These are newly written replacements, not recovered copies of the older articles. Old source attributions and historical predictions have not been carried forward as current facts. Date-stamped permalink variants observed in the annual report are included alongside both root slash forms. Each old address maps to its own article, rather than the writing index.

`manifest.json` records the old-to-new mapping and annual observed views across matching root and dated aliases. These are page views, not verified human readers or organic search demand. The inspected monthly/channel sample was predominantly Direct. Referrer details and credentials are not stored here.

The redirect map also moves exact rules above dynamic rules. The installed Cloudflare parser previously treated rules after the first wildcard as dynamic and truncated the map. Two unsupported absolute-source `301!` rules were removed; the existing zone-level www-to-apex redirect was independently checked as 301 before release.

Publication requires independent whole-document factual approval under the existing signed static editorial workflow. Drafts and redirects must ship together only after every destination is eligible and included in the built output. No new review service, recurring job, paid API fallback, newsletter or social distribution is part of this repair.

## Release validation

All 13 replacement articles received independent whole-document approval with signed exact-version receipts. Earlier source-admission and publication-history holds were corrected before the final approvals. The speaking source is the original NIH fact sheet, and the online-safety research source is the author university release; no suspect HTML banner or blocked-source text was used as article evidence.

The final Astro build passes, generating 62 pages with one non-empty H1 each. Type checking reports zero errors and zero warnings (one existing clipboard deprecation hint). The full editorial gate reports 17 independently verified articles, including these 13, and no failures.

A fresh Cloudflare runtime parses 148 valid redirect rules with no rejected rules. All 48 old aliases return 301 to their matching replacement; all 13 destinations load, current navigation pages remain healthy, and unknown paths retain genuine 404 responses. A campaign-query variant preserves its query string. The HTTP verification does not execute analytics. Production verification follows the deployment.

Source-identity admissions were released in AI Factory PRs 1248 and 1249. No shared reviewer or publication gate was bypassed.

## Editorial chronology

At Adrian's request, the 13 replacement articles use staggered editorial publication dates from 19 August through 20 October 2026, spanning the preceding nine weeks. These dates are assigned editorial chronology, not evidence that the new replacement text was live on those days. The replacements were first deployed on 21 October 2026. Every replacement retains an explicit 21 October 2026 update date in its frontmatter, visible article header, Open Graph metadata and structured data. All 13 metadata changes received fresh independent whole-file signed approvals, recorded in `date-review-runs.json`. The build and built-output date checks pass. The substantive article bodies and redirects are unchanged. Two archive-history footers were removed when the fresh review could not verify those claims against its source packet.
