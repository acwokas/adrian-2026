## Signup scope update, 23 October 2026

Adrian subsequently requested one explicit signup for book updates, Friday Frame and occasional writing updates, with unsubscribe wording. The current v2 form reflects that approval. Earlier book-only v1 consent is preserved. See combined-signup.sql for the atomic server-only transaction. This supersedes book-only release wording below, which records the original preview.

# Heir Presumptive local preview, 23 October 2026

Status: APPROVED FOR PUBLICATION on 23 October 2026. Adrian approved the unchanged extract, retained source notes, live signup activation, reading measurement and homepage feature. Database table activated with RLS and no public read access. Deployment and live checks are recorded separately.

Preview: http://127.0.0.1:4346/writing/heir-presumptive
Writing introduction: http://127.0.0.1:4346/writing

## Text integrity

The extract is taken verbatim from the supplied text, from “Zeus had been warned.” through the Roman-heir continuation paragraph. Stored in src/data/books/heir-presumptive-extract.json. The integrity receipt and regression test compare the exact character string by SHA-256. Intro, outline placement, source notes and CTAs are outside that extract. No PDF or full-manuscript download is created.

## Factual review

The ten expandable source notes contain the evidence links and qualifications. This review is not a claim of independent editorial certification.

Supported: Hesiod’s core sequence and quoted translation; Detienne/Vernant 1974 publication; scholarly Kumarbi comparison including Forrer 1936; DeepSeek January 20 release (official log) and benchmark comparison (paper); approximate Nvidia loss (Reuters); $725bn forecast (FT report syndicated by Irish Times April 30); Alibaba increased spending (Reuters September 24); OpenAI charter wording; Pile composition/scale; Books3 takedown; R.U.R. and Josef attribution; limited findings of Berglund/Palisade; Roman universal succession with period-specific qualifications.

Interpretation or overstatement, retained unchanged for Adrian’s review:

- “about gods and nothing else” cannot be established for all Hesiodic listeners.
- “closer to point out” is not an uncontested correction. Smyth explicitly gives consider/devise for the Greek middle voice. Athena fully armed also draws on the Homeric Hymn tradition.
- “all of them”, “whole shelf”, and inferred reading by particular models are broader than dataset evidence supports. PG-19 is a subset, not the whole Gutenberg catalogue.
- “most people working in the field”, “only with documents written for the purpose”, and “By 2026 no one had shown” are broad consensus/absence claims not proven by the cited studies. Research found here supports narrow laboratory findings, not a comprehensive absence finding.
- “Chinese firms spend less, partly because” is a causal comparative claim without a defined sample or spending basis. Export-control constraints alone do not establish that comparison. No quantitative support was located for “millions ... at once”.
- A free download as the sole market cause is narrative compression; Roman heirs’ liability varied and could be limited under Justinian.

These are disclosed in notes or here rather than silently rewriting the extract. Obtain a decision on material overstatements before publication. Author testimony in the shortened introduction is supported broadly by existing About/Work pages; the original precise 26-year and three-year claims are not repeated outside the extract.

## Signup isolation and release prerequisites

Dedicated /api/book-subscribe writes ONLY to heir_presumptive_subscribers, never writing_subscribers. Explicit unchecked consent is required by the form and endpoint. Stores email, timestamps, source and exact consent version, no IP/browser/country fields. Existing general-writing signup is unchanged. Privacy page explains the separate purpose. No book mail dispatcher or schedule has been enabled.

The local dev form deliberately does not call a live service. Tests use mocked fetch; no real emails or subscriber records are created. Prepared schema SQL in this directory was applied after publication approval, and RLS/server-only privileges were verified. It enables RLS and denies anon/authenticated access, with service-role-only access. Before release, apply to the intended site storage project, verify grants/RLS and REST insert/update behavior, verify the deployed form with an authorised test address, and record the result. Never claim live signup acceptance based on mock tests. Honor unsubscribe requests before any manually approved mailing; filter unsubscribed_at IS NULL. An explicit re-signup refreshes consent and clears an unsubscribe timestamp.

## Validation

Production build: 65 pages, one H1 per page. Nine regression tests cover unchanged extract, explicit consent, malformed emails, wrong origin, absent configuration, storage failure, network failure, separate table and bot trap. Local browser form shows preview-only confirmation and makes no subscription request. Type-check and visual checks are recorded in the task response.

The subsequent explicit publication instruction supersedes the preview-only hold. Historical review observations above remain disclosed; no extract edits were made.
