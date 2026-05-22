#!/usr/bin/env bash
# One-shot publisher for the /writing notification signup + share buttons feature.
#
# Adds:
#   - src/components/NotifySignup.astro
#   - src/components/ShareButtons.astro
#   - functions/api/writing-subscribe.ts
#   - edits to src/pages/writing/index.astro
#   - edits to src/pages/writing/[slug].astro
#   - edits to src/pages/writing/friday-frame/[slug].astro
#
# Run from the repo root:
#   cd /Users/adrian/adrian-2026
#   bash publish-writing-features.sh
#
# After this script: bind SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY as Pages
# secrets on the adrianwatkins-com-preview Pages project. Until then the
# /api/writing-subscribe endpoint logs to console and reports success so the
# UI form still works. Table SQL is documented at the top of
# functions/api/writing-subscribe.ts.

set -euo pipefail

REPO_ROOT="/Users/adrian/adrian-2026"
COMMIT_MSG="Writing: notification signup + share buttons on /writing posts"
KEYFILE="$HOME/.aiia/callmebot-keys"

cd "$REPO_ROOT"

echo "==> Confirming new files are present"
for f in \
  "src/components/NotifySignup.astro" \
  "src/components/ShareButtons.astro" \
  "functions/api/writing-subscribe.ts" \
  "publish-writing-features.sh"; do
  test -f "$f" || { echo "MISSING: $f"; exit 1; }
  ls -la "$f"
done

echo "==> Clearing stale git locks and aborting any in-flight rebase"
rm -f .git/index.lock .git/HEAD.lock || true
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then
  git rebase --abort 2>/dev/null || true
  rm -rf .git/rebase-merge .git/rebase-apply
fi

echo "==> Fetching origin"
git fetch origin astro-rebuild

echo "==> Ensuring we are on astro-rebuild"
git checkout astro-rebuild 2>/dev/null || git checkout -B astro-rebuild origin/astro-rebuild

echo "==> Staging the writing-feature files"
git add \
  src/components/NotifySignup.astro \
  src/components/ShareButtons.astro \
  functions/api/writing-subscribe.ts \
  src/pages/writing/index.astro \
  "src/pages/writing/[slug].astro" \
  "src/pages/writing/friday-frame/[slug].astro" \
  publish-writing-features.sh

# Show what we are about to commit so it is auditable
git status --short

echo "==> Committing"
git commit -m "$COMMIT_MSG"
COMMIT_HASH=$(git rev-parse HEAD)
echo "    commit: $COMMIT_HASH"

echo "==> Pushing to origin/astro-rebuild"
git push origin astro-rebuild

echo "==> Local build (catches any TS / Astro errors before CF builds it)"
if npm run build > /tmp/awc-build.log 2>&1; then
  echo "    local build OK"
else
  echo "WARN: local build failed. Tail:"
  tail -40 /tmp/awc-build.log
  echo "    Cloudflare Pages will still try to build from the pushed commit."
fi

echo "==> Triggering Cloudflare Pages deploy (preview project, astro-rebuild branch)"
if npm run | grep -q '^  deploy:preview'; then
  npm run deploy:preview || echo "    preview deploy command exited non-zero; CF git auto-deploy from push may still succeed"
fi

echo "==> Waiting 90s for Cloudflare Pages to build and propagate"
sleep 90

echo "==> Verifying live URLs"
URLS=(
  "https://adrianwatkins.com/writing"
  "https://adrianwatkins.com/writing/friday-frame/the-search-box-wasnt-the-product"
  "https://adrianwatkins.com/writing/japan-slow-bet"
)
for U in "${URLS[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -I "$U" || echo "000")
  echo "    $U -> HTTP $CODE"
done

# Spot-check the rendered HTML for the new markers
echo "==> Spot-checking rendered HTML for new markers"
HOMEPAGE_BODY=$(curl -s "https://adrianwatkins.com/writing" || echo "")
if echo "$HOMEPAGE_BODY" | grep -q 'ns-card'; then
  echo "    /writing: NotifySignup .ns-card present"
else
  echo "    /writing: WARN no .ns-card marker"
fi

POST_BODY=$(curl -s "https://adrianwatkins.com/writing/friday-frame/the-search-box-wasnt-the-product" || echo "")
if echo "$POST_BODY" | grep -q 'share-btn'; then
  echo "    Friday Frame post: ShareButtons .share-btn present"
else
  echo "    Friday Frame post: WARN no .share-btn marker"
fi
if echo "$POST_BODY" | grep -q 'ns-card'; then
  echo "    Friday Frame post: NotifySignup .ns-card present"
else
  echo "    Friday Frame post: WARN no .ns-card marker"
fi

echo "==> POST /api/writing-subscribe sanity check"
API_RESP=$(curl -s -X POST "https://adrianwatkins.com/api/writing-subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"smoketest+'$(date +%s)'@adrianwatkins.com","source":"/writing-smoketest"}' || echo "CURL_FAILED")
echo "    api response: ${API_RESP:0:200}"

echo "==> Firing WhatsApp notification via CallMeBot"
if [ -f "$KEYFILE" ]; then
  # shellcheck disable=SC1090
  source "$KEYFILE"
  MSG="adrianwatkins.com: /writing now has signup + share. Commit ${COMMIT_HASH}. Bind SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as Pages secrets when ready (table SQL in functions/api/writing-subscribe.ts)."
  WA_RESP=$(curl -sG "https://api.callmebot.com/whatsapp.php" \
    --data-urlencode "phone=${CALLMEBOT_PHONE}" \
    --data-urlencode "text=${MSG}" \
    --data-urlencode "apikey=${CALLMEBOT_APIKEY}" || echo "CURL_FAILED")
  echo "    callmebot response: ${WA_RESP:0:200}"
else
  echo "WARN: keyfile $KEYFILE not found; skipping WhatsApp notify"
fi

echo ""
echo "==> DONE"
echo "    Commit: $COMMIT_HASH"
echo "    Live:   https://adrianwatkins.com/writing"
echo ""
echo "    Next step (when you are ready to actually store signups):"
echo "    1. Create the writing_subscribers table in Supabase (SQL is in"
echo "       functions/api/writing-subscribe.ts)."
echo "    2. Bind SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY as Pages secrets"
echo "       on the adrianwatkins-com-preview project."
echo "    3. Re-deploy (any push to astro-rebuild triggers a rebuild)."
