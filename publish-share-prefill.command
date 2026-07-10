#!/usr/bin/env bash
# One-shot publisher for the share-button prefill polish.
#
# Context: P1 polish on top of commit 6379c67 (OG fix). The LinkedIn
# composer was empty on share; this commit makes the LinkedIn and X
# buttons prefill the composer with title + excerpt + hashtags + url.
#
# The commit itself was made by Claude in the background sandbox
# (cannot reach GitHub from there). This .command file finishes the
# pipeline: push, rebuild dist, deploy to Cloudflare, verify, notify.
#
# Run from anywhere (the script cd's to the repo):
#   - Double-click in Finder, OR
#   - bash /Users/adrian/adrian-2026/publish-share-prefill.command

set -euo pipefail

REPO_ROOT="/Users/adrian/adrian-2026"
LIVE_FF="https://adrianwatkins.com/writing/friday-frame/the-search-box-wasnt-the-product"
LIVE_WRITING="https://adrianwatkins.com/writing/tech-translators"
KEYFILE="$HOME/.aiia/callmebot-keys"

cd "$REPO_ROOT"

echo "==> Clearing any stale git locks left by the sandbox session"
rm -f .git/index.lock .git/HEAD.lock || true
find .git/objects -name 'tmp_obj_*' -delete 2>/dev/null || true

echo "==> Confirming commit is in place"
LATEST=$(git log -1 --format='%H %s')
echo "    HEAD: $LATEST"
if ! git log -1 --format='%s' | grep -q 'Prefill LinkedIn and X share composers'; then
  echo "FAIL: latest commit is not the share-prefill commit"
  exit 1
fi
COMMIT_HASH=$(git rev-parse HEAD)
SHORT_HASH=${COMMIT_HASH:0:7}

echo "==> Pushing to origin/astro-rebuild"
git push origin astro-rebuild

echo "==> Rebuilding dist on this Mac (cleanly, no sandbox artefacts)"
SITE_URL="https://adrianwatkins.com" npm run build

echo "==> Sanity-checking built HTML for prefill content"
BUILT_FF="dist/writing/friday-frame/the-search-box-wasnt-the-product.html"
BUILT_WR="dist/writing/tech-translators.html"

test -f "$BUILT_FF" || { echo "MISSING built HTML: $BUILT_FF"; exit 1; }
test -f "$BUILT_WR" || { echo "MISSING built HTML: $BUILT_WR"; exit 1; }

grep -q 'linkedin.com/feed/?shareActive=true' "$BUILT_FF" || { echo "FAIL: FF share URL not using shareActive prefill"; exit 1; }
grep -q '%23FridayFrame' "$BUILT_FF" || { echo "FAIL: FF post missing FridayFrame hashtag"; exit 1; }
grep -q '%23AdrianWatkins' "$BUILT_FF" || { echo "FAIL: FF post missing AdrianWatkins hashtag"; exit 1; }
grep -q 'hashtags=FridayFrame%2CAdrianWatkins' "$BUILT_FF" || { echo "FAIL: FF X intent missing hashtags param"; exit 1; }
echo "    Friday Frame prefill content: OK"

grep -q 'linkedin.com/feed/?shareActive=true' "$BUILT_WR" || { echo "FAIL: writing share URL not using shareActive prefill"; exit 1; }
grep -q '%23AdrianWatkins' "$BUILT_WR" || { echo "FAIL: writing post missing AdrianWatkins hashtag"; exit 1; }
echo "    Writing prefill content: OK"

echo "==> Deploying built dist/ to Cloudflare Pages"
npx wrangler pages deploy dist \
  --project-name adrianwatkins-com-preview \
  --branch astro-rebuild \
  --commit-dirty=true

echo "==> Waiting 45s for Cloudflare Pages edge cache to propagate"
sleep 45

echo ""
echo "==> CURL PROOF: LinkedIn share href on live Friday Frame post"
LIVE_HTML=$(curl -sL "$LIVE_FF")
echo "    LinkedIn href (truncated):"
echo "$LIVE_HTML" | grep -oE 'href="https://www\.linkedin\.com/feed/\?shareActive=true&text=[^"]{0,400}' | head -1 | head -c 400
echo ""
echo ""
echo "    X intent href (truncated):"
echo "$LIVE_HTML" | grep -oE 'href="https://twitter\.com/intent/tweet\?[^"]+' | head -1 | head -c 400
echo ""

LI_OK=$(echo "$LIVE_HTML" | grep -c 'linkedin.com/feed/?shareActive=true' || echo 0)
X_OK=$(echo "$LIVE_HTML" | grep -c 'hashtags=FridayFrame%2CAdrianWatkins' || echo 0)

echo ""
echo "    LinkedIn shareActive href present: ${LI_OK}"
echo "    X hashtags param present:         ${X_OK}"

if [ "$LI_OK" -lt 1 ] || [ "$X_OK" -lt 1 ]; then
  echo "WARN: live HTML does not yet show new pattern. Edge cache may still be warming."
fi

echo ""
echo "==> Firing WhatsApp notification via CallMeBot"
if [ -f "$KEYFILE" ]; then
  # shellcheck disable=SC1090
  source "$KEYFILE"

  MSG="Share-prefill polish shipped. Commit ${SHORT_HASH}.
LinkedIn composer now prefills: title in quotes, summary, FridayFrame positioning line, #FridayFrame #AdrianWatkins, url.
X composer prefills: title, url, hashtags=FridayFrame,AdrianWatkins.
Writing posts (non-FF) prefill the same shape minus the FridayFrame line.
Live: ${LIVE_FF}
Open the post, click LinkedIn, the composer should be pre-populated."

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
echo "    Live FF:   $LIVE_FF"
echo ""
echo "Keep this Terminal window open for ~10s so you can read the verification."
sleep 10
