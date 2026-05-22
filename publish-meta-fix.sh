#!/usr/bin/env bash
# One-shot publisher for the LinkedIn/X social-preview meta-tag fix.
#
# What this changes:
#   - astro.config.mjs default site is now https://adrianwatkins.com (was preview).
#   - src/layouts/BaseLayout.astro now supports og:type=article, article:* tags,
#     and a per-post ogImage / ogImageAlt.
#   - src/pages/writing/friday-frame/[slug].astro and src/pages/writing/[slug].astro
#     pass ogType=article + publishedTime + author + article tags.
#   - src/pages/writing/friday-frame/index.astro uses /og/friday-frame-default.png.
#   - New default OG images: public/og/site-default.png, public/og/friday-frame-default.png.
#
# Run from the repo root:
#   cd /Users/adrian/adrian-2026
#   bash publish-meta-fix.sh

set -euo pipefail

REPO_ROOT="/Users/adrian/adrian-2026"
LIVE_FF_POST="https://adrianwatkins.com/writing/friday-frame/the-search-box-wasnt-the-product"
LIVE_FF_INDEX="https://adrianwatkins.com/writing/friday-frame"
LIVE_HOME="https://adrianwatkins.com/"
COMMIT_MSG="Fix LinkedIn/X social previews: apex canonical, og:type=article, FF default OG image"
KEYFILE="$HOME/.aiia/callmebot-keys"

cd "$REPO_ROOT"

echo "==> Confirming changed files are on disk"
for f in \
  astro.config.mjs \
  src/layouts/BaseLayout.astro \
  src/pages/writing/friday-frame/[slug].astro \
  src/pages/writing/friday-frame/index.astro \
  src/pages/writing/[slug].astro \
  public/og/site-default.png \
  public/og/friday-frame-default.png \
  scripts/make-og-images.py
do
  test -e "$f" || { echo "MISSING: $f"; exit 1; }
done
ls -la public/og/

echo "==> Clearing stale git locks and aborting any in-flight rebase"
rm -f .git/index.lock .git/HEAD.lock || true
if [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then
  git rebase --abort 2>/dev/null || true
  rm -rf .git/rebase-merge .git/rebase-apply
fi

echo "==> Fetching origin"
git fetch origin astro-rebuild

echo "==> Checking out astro-rebuild"
git checkout astro-rebuild 2>/dev/null || git checkout -B astro-rebuild origin/astro-rebuild

echo "==> Staging meta-fix files"
git add \
  astro.config.mjs \
  src/layouts/BaseLayout.astro \
  src/pages/writing/friday-frame/[slug].astro \
  src/pages/writing/friday-frame/index.astro \
  src/pages/writing/[slug].astro \
  public/og/site-default.png \
  public/og/friday-frame-default.png \
  scripts/make-og-images.py \
  publish-meta-fix.sh

git diff --cached --stat

git commit -m "$COMMIT_MSG"
COMMIT_HASH=$(git rev-parse HEAD)
echo "    commit: $COMMIT_HASH"

echo "==> Pushing to origin/astro-rebuild"
git push origin astro-rebuild

echo "==> Building locally with SITE_URL=https://adrianwatkins.com"
# This guarantees the manual wrangler deploy below has the right canonical even
# if the Cloudflare Pages project env var SITE_URL is still unset.
SITE_URL="https://adrianwatkins.com" npm run build

echo "==> Sanity-checking built HTML for apex URLs"
BUILT_HTML="dist/writing/friday-frame/the-search-box-wasnt-the-product.html"
if [ ! -f "$BUILT_HTML" ]; then
  # Astro with build.format=file may emit a different path
  BUILT_HTML=$(find dist -name "the-search-box-wasnt-the-product*.html" | head -1)
fi
echo "    inspecting: $BUILT_HTML"
grep -oE 'property="og:(url|image|type)" content="[^"]+"' "$BUILT_HTML" || true
grep -oE 'property="article:[a-z_]+" content="[^"]+"' "$BUILT_HTML" || true
grep -oE 'rel="canonical" href="[^"]+"' "$BUILT_HTML" || true

# Hard-fail if the preview domain leaked in.
if grep -q "adrianwatkins-com-preview.pages.dev" "$BUILT_HTML"; then
  echo "FAIL: preview domain still present in built HTML. Aborting deploy."
  exit 1
fi

echo "==> Deploying built dist/ to Cloudflare Pages"
npx wrangler pages deploy dist \
  --project-name adrianwatkins-com-preview \
  --branch astro-rebuild \
  --commit-dirty=true

echo "==> Waiting 60s for Cloudflare Pages edge cache to update"
sleep 60

echo "==> Verifying live URLs"
for url in "$LIVE_FF_POST" "$LIVE_FF_INDEX" "$LIVE_HOME"; do
  echo ""
  echo "--- $url ---"
  curl -sL "$url" | grep -oE '(<link rel="canonical" href="[^"]+"|<meta property="og:(url|type|image|image:width|locale)" content="[^"]+"|<meta property="article:[a-z_]+" content="[^"]+"|<meta name="twitter:(card|image)" content="[^"]+")' | head -25
done

echo ""
echo "==> Asking LinkedIn Post Inspector to re-crawl the FF post"
LI_INSPECT_URL="https://www.linkedin.com/post-inspector/inspect/${LIVE_FF_POST}"
echo "    LinkedIn will refresh on next manual paste at:"
echo "    https://www.linkedin.com/post-inspector/?url=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$LIVE_FF_POST")"

echo ""
echo "==> Firing WhatsApp notification via CallMeBot"
if [ -f "$KEYFILE" ]; then
  # shellcheck disable=SC1090
  source "$KEYFILE"
  MSG="Social previews fixed. Commit ${COMMIT_HASH:0:7}. Re-share ${LIVE_FF_POST} on LinkedIn (force refresh: https://www.linkedin.com/post-inspector/)."
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
echo "    Live URL:  $LIVE_FF_POST"
echo ""
echo "Next: paste $LIVE_FF_POST into https://www.linkedin.com/post-inspector/ to force"
echo "      LinkedIn to refresh its preview cache. X picks up the new meta on next share."
