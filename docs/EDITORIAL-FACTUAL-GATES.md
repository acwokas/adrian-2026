# Autonomous factual review and publication

Every new or changed published Markdown article in writing and Friday Frame needs a
current independent whole-file proof. `npm run build` enforces this before Astro
renders. The Friday publisher also verifies its chosen draft before changing the
publication flag. A green formatting or delivery check is not factual approval.

The reviewer runs in acwokas/ai-factory, through
`static-editorial-factual-review.yml`. Supply this repository, the complete content
path, an immutable public commit and the canonical document digest. The workflow
fetches the file without executing this repository's code, retrieves admitted
primary evidence, independently reviews every passage through the existing Claude
subscription, then validates and signs the result in a separate credential boundary.
There is no paid model fallback and no automatic retry after uncertain execution.

The detached receipt goes in ops/editorial/approvals/<SHA256 of content path>.json.
The public key and verifier here cannot mint approvals. The entire file is bound,
including title, titleHtml, summary, dates and body. Only the draft boolean can flip.
A seven-day expiry requires fresh evidence and review, not a copied timestamp.
Keep sources in the article and private run/report receipts in the audit ledger.

The initial legacy-unreviewed.json contains only the exact bytes of 32 already
published files at ff2c9f8. It is explicitly unreviewed archive debt. Never add new
files or edited versions to this allowance. The incorrect August AI Act frame was
excluded. As older articles are independently reviewed, remove their allowance and
add their signed receipt. Unchanged archive allowance is not a completed fact sweep.

The ongoing Codex estate sweep researches held claims, revises privately, requests
reviews and installs valid receipts autonomously. Routine human fact checking is not
required. The weekly cloud publisher enforces approval but currently does not itself
request reviews across the private central repository. The ongoing sweep owns that
preparation. A first successful reviewed deployment does not prove the entire weekly
scheduled cycle has run unattended.

When evidence is missing, investigate the original source and exact claim. Narrow or
remove an unsupported assertion, or hold the article. Do not remove useful safety
advice merely to avoid researching it. Manufacturer statements establish what that
manufacturer says; they do not independently establish market-wide outcomes.
Opinion can be clearly expressed, but its factual premises need evidence too.
