#!/usr/bin/env bash
# One-shot publisher for Friday Frame 2026-05-22.
# The content file is already on disk at:
#   src/content/friday-frame/the-search-box-wasnt-the-product.md
#
# Run from the repo root:
#   cd /Users/adrian/adrian-2026
#   bash publish-friday-frame.sh

set -euo pipefail

REPO_ROOT="/Users/adrian/adrian-2026"
SLUG="the-search-box-wasnt-the-product"
NEW_FILE="src/content/friday-frame/${SLUG}.md"
LIVE_URL="https://adrianwatkins.com/writing/friday-frame/${SLUG}"
COMMIT_MSG="Friday Frame 2026-05-22: The search box wasn't the product"
KEYFILE="$HOME/.aiia/callmebot-keys"

cd "$REPO_ROOT"

echo "==> Confirming new file is present"
test -f "$NEW_FILE" || { echo "MISSING: $NEW_FILE"; exit 1; }
ls -la "$NEW_FILE"

echo "==> Clearing stale git locks and aborting the in-flight rebase"
rm -f .git/index.lock .git/HEAD.lock || true
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then
  git rebase --abort 2>/dev/null || true
  rm -rf .git/rebase-merge .git/rebase-apply
fi

echo "==> Fetching origin"
git fetch origin astro-rebuild

echo "==> Resetting astro-rebuild to origin/astro-rebuild (you OK'd losing the stale local commit)"
git checkout astro-rebuild 2>/dev/null || git checkout -B astro-rebuild origin/astro-rebuild
git reset --hard origin/astro-rebuild

echo "==> Re-confirming new file survived reset (it was untracked, so it should)"
test -f "$NEW_FILE" || { echo "FILE LOST: $NEW_FILE - re-create before pushing"; exit 1; }

echo "==> Staging, committing, pushing"
git add "$NEW_FILE"
git commit -m "$COMMIT_MSG"
COMMIT_HASH=$(git rev-parse HEAD)
git push origin astro-rebuild
echo "    commit: $COMMIT_HASH"

echo "==> Triggering Cloudflare Pages deploy"
# If apex auto-deploys from astro-rebuild via Cloudflare Pages git integration,
# the push above already kicked it. Also fire the preview build for safety.
if npm run | grep -q '^  deploy:preview'; then
  echo "    (running npm run deploy:preview as a parallel preview build)"
  npm run deploy:preview || echo "    preview build failed - apex auto-deploy from git push should still proceed"
fi

echo "==> Waiting 90s for Cloudflare Pages to build and propagate"
sleep 90

echo "==> Verifying live URL"
for i in 1 2 3 4 5 6; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -I "$LIVE_URL" || echo "000")
  echo "    attempt $i: HTTP $CODE"
  if [ "$CODE" = "200" ] || [ "$CODE" = "308" ]; then break; fi
  sleep 30
done

if [ "$CODE" != "200" ] && [ "$CODE" != "308" ]; then
  echo "WARN: $LIVE_URL not yet returning 200/308 (last: $CODE). Cloudflare may still be building."
  echo "      Re-run: curl -I '$LIVE_URL'"
fi

echo "==> Firing WhatsApp notification via CallMeBot"
if [ -f "$KEYFILE" ]; then
  # shellcheck disable=SC1090
  source "$KEYFILE"
  MSG="Friday Frame published: ${LIVE_URL}"
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
echo "    Commit:    $COMMIT_HASH"
echo "    Live URL:  $LIVE_URL"
echo "    Last HTTP: $CODE"
