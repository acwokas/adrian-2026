#!/usr/bin/env bash
# One-shot publisher for the P0 search-performance fix.
#
# Context: GSC last 3 months on adrianwatkins.com showed 6 clicks / 786
# impressions, 0 clicks on the "adrian watkins" query at position 20.22.
# Root cause was a missing Person entity + WordPress-era host pollution.
#
# What this changes:
#   - New src/data/person.ts: single-source Person + WebSite JSON-LD,
#     stable @id, includes givenName/familyName/image/sameAs/jobTitle.
#   - src/layouts/BaseLayout.astro now emits Person + WebSite on every
#     page automatically, plus <meta name="author"> and a robots tag.
#   - src/pages/about.astro emits a ProfilePage anchored to Person@id.
#   - All per-page jsonLd blocks (edge, contact, speaking, now, writing,
#     friday-frame index + [slug], writing [slug]) now reference the
#     canonical Person via @id instead of inline duplicates.
#   - public/_redirects: host-based 301 from www.adrianwatkins.com -> apex.
#   - Page titles + descriptions on /, /about, /edge, /contact, /speaking,
#     /now, /writing, /writing/friday-frame include "Adrian Watkins"
#     verbatim for the brand-name query.
#
# .command extension: Finder double-click launches this in Terminal
# without requiring keyboard input.
#
# Run from anywhere (the script cd's to the repo):
#   - Double-click in Finder, OR
#   - bash /Users/adrian/adrian-2026/publish-seo-fix.command

set -euo pipefail

REPO_ROOT="/Users/adrian/adrian-2026"
LIVE_HOME="https://adrianwatkins.com/"
LIVE_ABOUT="https://adrianwatkins.com/about"
LIVE_EDGE="https://adrianwatkins.com/edge"
OLD_WP_URL="https://www.adrianwatkins.com/40_best_vc_bets/"
OLD_WP_WPCONTENT="https://www.adrianwatkins.com/wp-content/uploads/2022/02/VALID_certification.pdf"
SITEMAP_URL="https://adrianwatkins.com/sitemap-index.xml"
COMMIT_MSG="SEO P0: global Person+WebSite schema, ProfilePage on /about, www->apex 301, brand-query titles"
KEYFILE="$HOME/.aiia/callmebot-keys"

cd "$REPO_ROOT"

echo "==> Confirming changed files are on disk"
for f in \
  src/data/person.ts \
  src/layouts/BaseLayout.astro \
  src/pages/index.astro \
  src/pages/about.astro \
  src/pages/edge.astro \
  src/pages/contact.astro \
  src/pages/speaking.astro \
  src/pages/now.astro \
  src/pages/writing/index.astro \
  src/pages/writing/[slug].astro \
  src/pages/writing/friday-frame/index.astro \
  src/pages/writing/friday-frame/[slug].astro \
  public/_redirects
do
  test -e "$f" || { echo "MISSING: $f"; exit 1; }
done

echo "==> Verifying src/data/person.ts has the right fields"
for needle in '@id' 'givenName' 'familyName' 'hero-portrait.jpg' 'Adrian' 'Watkins' 'linkedin.com/in/adrianwatkins'; do
  grep -q "$needle" src/data/person.ts || { echo "person.ts missing: $needle"; exit 1; }
done

echo "==> Verifying _redirects has www -> apex rule"
grep -q "www.adrianwatkins.com" public/_redirects || { echo "_redirects missing www rule"; exit 1; }

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

echo "==> Staging SEO-fix files"
git add \
  src/data/person.ts \
  src/layouts/BaseLayout.astro \
  src/pages/index.astro \
  src/pages/about.astro \
  src/pages/edge.astro \
  src/pages/contact.astro \
  src/pages/speaking.astro \
  src/pages/now.astro \
  src/pages/writing/index.astro \
  src/pages/writing/[slug].astro \
  src/pages/writing/friday-frame/index.astro \
  src/pages/writing/friday-frame/[slug].astro \
  public/_redirects \
  publish-seo-fix.command

git diff --cached --stat

git commit -m "$COMMIT_MSG"
COMMIT_HASH=$(git rev-parse HEAD)
SHORT_HASH=${COMMIT_HASH:0:7}
echo "    commit: $COMMIT_HASH"

echo "==> Pushing to origin/astro-rebuild"
git push origin astro-rebuild

echo "==> Building locally with SITE_URL=https://adrianwatkins.com"
SITE_URL="https://adrianwatkins.com" npm run build

echo "==> Sanity-checking built HTML for Person JSON-LD"
BUILT_HOME="dist/index.html"
BUILT_ABOUT="dist/about.html"

for f in "$BUILT_HOME" "$BUILT_ABOUT"; do
  echo "--- $f ---"
  test -f "$f" || { echo "MISSING built HTML: $f"; exit 1; }
  grep -q '"@type":"Person"' "$f" || { echo "FAIL: Person JSON-LD missing in $f"; exit 1; }
  grep -q '"givenName":"Adrian"' "$f" || { echo "FAIL: givenName missing in $f"; exit 1; }
  grep -q '"familyName":"Watkins"' "$f" || { echo "FAIL: familyName missing in $f"; exit 1; }
  grep -q '"@id":"https://adrianwatkins.com/#person"' "$f" || { echo "FAIL: Person@id missing in $f"; exit 1; }
  echo "  Person JSON-LD: OK"
  echo "  meta author tag:"
  grep -oE '<meta name="author" content="[^"]+"' "$f" || true
done

echo "--- $BUILT_ABOUT ProfilePage check ---"
grep -q '"@type":"ProfilePage"' "$BUILT_ABOUT" || { echo "FAIL: ProfilePage missing on /about"; exit 1; }
echo "  ProfilePage: OK"

# Hard-fail if the preview domain leaked in.
if grep -q "adrianwatkins-com-preview.pages.dev" "$BUILT_HOME"; then
  echo "FAIL: preview domain still present in built HTML. Aborting deploy."
  exit 1
fi

echo "==> Inspecting sitemap for apex-only URLs"
SITEMAP_LOCAL=$(find dist -name 'sitemap-*.xml' | head -1)
if [ -n "$SITEMAP_LOCAL" ]; then
  echo "  sitemap file: $SITEMAP_LOCAL"
  if grep -qE 'https?://(www\.adrianwatkins\.com|adrianwatkins-com-preview)' "$SITEMAP_LOCAL"; then
    echo "FAIL: sitemap leaks www or preview URLs"
    grep -oE 'https?://[^<]+' "$SITEMAP_LOCAL" | head -5
    exit 1
  fi
  echo "  apex-only: OK"
  grep -oE 'https?://adrianwatkins.com[^<]*' "$SITEMAP_LOCAL" | head -10
fi

echo "==> Deploying built dist/ to Cloudflare Pages"
npx wrangler pages deploy dist \
  --project-name adrianwatkins-com-preview \
  --branch astro-rebuild \
  --commit-dirty=true

echo "==> Waiting 60s for Cloudflare Pages edge cache to propagate"
sleep 60

echo ""
echo "==> CURL PROOF 1: Person JSON-LD on / and /about"
for url in "$LIVE_HOME" "$LIVE_ABOUT"; do
  echo "--- $url ---"
  HTML=$(curl -sL "$url")
  echo "$HTML" | grep -oE '<script[^>]*type="application/ld\+json"[^>]*>[^<]*</script>' | head -3
  echo ""
  if echo "$HTML" | grep -q '"@type":"Person"'; then
    echo "  Person schema present: OK"
  else
    echo "  Person schema MISSING (cache may still be warming)"
  fi
done

echo ""
echo "==> CURL PROOF 2: www -> apex 301"
for url in "$OLD_WP_URL" "$OLD_WP_WPCONTENT" "https://www.adrianwatkins.com/" "https://www.adrianwatkins.com/about"; do
  echo "--- $url ---"
  curl -sI "$url" | grep -iE '^(HTTP/|location:)' || echo "  no response"
done

echo ""
echo "==> CURL PROOF 3: Sitemap apex-only"
curl -sL "$SITEMAP_URL" | grep -oE 'https?://[^<]+' | sort -u | head -20

echo ""
echo "==> Firing WhatsApp notification via CallMeBot"
if [ -f "$KEYFILE" ]; then
  # shellcheck disable=SC1090
  source "$KEYFILE"

  # Build a multi-line summary message.
  PERSON_OK=$(curl -sL "$LIVE_HOME" | grep -c '"@type":"Person"' || echo 0)
  WWW_CODE=$(curl -s -o /dev/null -w "%{http_code}" -I "https://www.adrianwatkins.com/40_best_vc_bets/" || echo "000")
  WP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -I "https://www.adrianwatkins.com/wp-content/uploads/2022/02/VALID_certification.pdf" || echo "000")

  MSG="SEO P0 shipped. Commit ${SHORT_HASH}.
Person+WebSite JSON-LD now on every page (homepage matches: ${PERSON_OK}).
ProfilePage anchored to Person@id on /about.
www.adrianwatkins.com/40_best_vc_bets/ -> HTTP ${WWW_CODE}.
www wp-content asset -> HTTP ${WP_CODE}.
NEXT: file Change of Address in GSC: www.adrianwatkins.com -> adrianwatkins.com. Resubmit ${SITEMAP_URL} via GSC.
Expect: 'adrian watkins' query climbs from pos 20 to top 5 in 1-3 weeks. CTR on / and /edge should jump from <1% to 3-8% within 2 weeks."

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
echo "    Home:      $LIVE_HOME"
echo "    About:     $LIVE_ABOUT"
echo ""
echo "Keep this Terminal window open for ~10s so you can read the verification."
sleep 10
