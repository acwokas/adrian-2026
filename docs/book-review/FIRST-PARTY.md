# Heir first-party measurement (prepared, not deployed)

## Scope and architecture

Keep GTM and GA4 unchanged. Add a book-only browser observer on `/writing/heir-presumptive`, POST to the same-origin Cloudflare Pages Function `/api/book-analytics`, and insert validated events into the new private `heir_analytics_events` table in the site's existing Supabase project `ukacqljogssreycumocn`. This project is named AI in Asia v2 and is already used by this site's book subscriptions. Do not use or modify its shared `analytics_events` table, subscriber data or UDO's database.

Reuse existing server-side `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` bindings; never put keys in the browser or generate another credential for this feature. The currently connected Supabase read route can query the project. Verify binding target in deployment without exposing the value of any secret. RLS is enabled on the new table, with no anon/authenticated/public access. Only trusted server writes and authorised private reporting are intended.

`src/scripts/book-first-party.js` emits one `page_view` per page load. Existing `awTrack` continues its GA dispatch and mirrors only allowlisted book events when the book observer is present. `book_view` is not another page view in reports. `book_signup` remains a browser-observed successful form response, not an independently verified conversion: use the private subscription database for aggregate confirmed signup counts, without joining emails to visitor IDs.

## Privacy and exclusions

- Random site-local browser ID expires after 365 days of inactivity. It is pseudonymous, not a person/cross-device identity. When storage is unavailable it lasts only this page. No fingerprint fallback.
- Only exact production hosts and the book path are accepted. Server records hostname from request URL, not client payload. It checks same-origin request headers.
- Localhost, preview hosts, recognised bot/automation browsers, GPC, DNT and saved first-party opt-out do not send events. Server repeats supported checks.
- For manual QA, set `analytics_test=1` in the book URL or `localStorage.aw_analytics_test='1'`. QA-like UTM labels are also excluded. These suppress browser requests entirely. The endpoint also accepts strictly boolean `test_traffic=true` synthetic QA events and independently flags QA-like campaign tags, storing them as `flagged_test`; reporting excludes both. This does not alter existing GA4 test filtering. Untagged ordinary-browser tests cannot be recognised reliably.
- No raw IP, email, form value, free text, complete URL query or referrer path is stored. Referrers are host-only, excluding IP literals, single-label hosts and common private hostname suffixes; campaign tags have a narrow token allowlist. Reading metadata is numeric and bounded.
- Public endpoint events are observations, not tamper-proof human evidence. Automation detection can miss bots; IDs can rotate or be shared. The per-isolate visitor rate limiter is bounded and defensive, not a global anti-abuse guarantee.
- Event IDs deduplicate repeated deliveries. There is no automatic ambiguous-delivery retry. Storage failure returns503 and never blocks the book or claims data was stored.
- Do not silently delete raw events: cumulative distinct browser counts require retaining the reporting range. Decide/document a retention policy before any future pruning; report only the surviving reliable range. This change adds no retention job or broader tracking/mailing authority.

## Reporting

Run `first-party-report.sql` through the existing authorised connector. All ranges use Asia/Singapore midnight boundaries. Count distinct visitor IDs over the full cumulative range, never sum daily unique counts. Filter exact production hostname, site, path and page_view; explicitly exclude test records. Provide referrer view counts separately from acquisition attribution. Start cumulative range at the first observed page view; do not label it launch date or recreate historical visits.

Missing table/access, missing ingestion, delayed data or unverified deployment means unavailable/partial, not zero. A measured zero requires verified healthy collection across the reporting interval. This is first-party data, not GA4; do not combine the two as one metric.

## Release and verification gates

1. Obtain production approval for the new private table and website deployment. The `astro-rebuild` branch automatically deploys on push; do not push it merely to publish a draft.
2. Apply `first-party-schema.sql` to the verified existing project after approval, inspect table policies/grants, and verify no public read/write access. No schema has been applied by preparation.
3. Deploy tested code and privacy wording using the repository's existing workflow. Do not change bindings unless a separate required approval is satisfied.
4. Run a marked QA browser visit: assert no first-party request/row. Test GPC/DNT/opt-out/preview suppression, wrong origin, malformed payload and failure behaviour with mocks before deployment.
5. To prove end-to-end ingestion without contaminating real totals, use an explicitly approved validation procedure: a separate test table/deployment or an approved synthetic production event marked for exclusion. The endpoint accepts explicitly flagged synthetic events. Verify their exact event IDs in the private table and verify that reporting excludes them. This proves endpoint ingestion, not ordinary browser delivery; inspect the first real visitor event for the latter. A no-op QA browser visit alone does not prove DB writes. Do not silently send unmarked production tests.
6. Verify expected release commit live and query actual rows before calling collection ready. The first full report is the first full SGT day after verified release. Record partial initial day honestly.

## Rollback

Remove the observer import and optional mirror call (GA stays unchanged). Disable the new endpoint via code rollback. Leave historical private data intact pending an explicit retention decision; no destructive rollback SQL is supplied.

These are unflagged-browser observations, not verified humans or audited billing counts. A deliberate client can forge origin, user-agent and identifiers; per-isolate limits are not a global abuse defence.
