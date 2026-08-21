#!/usr/bin/env bash
# Post-deploy smoke test for adrianwatkins.com.
#
# This site is a static Astro build on Cloudflare Pages. It is NOT one of the
# ad-funded news properties, so the ai-factory smoke test does not describe it:
# running that one here reports false reds for a missing service worker, a
# 600-word AdSense thin-content floor, and a daily-news homepage shape. None of
# those are true of this site. The Friday Frame is a 200 to 500 word format by
# design, there is no service worker, and the homepage publishes weekly.
#
# What this checks instead:
#   1. Core routes return 200 (home, /writing, the frame archive, the newest
#      frame, /now, /speaking, /about, /edge).
#   2. Every /_astro/*.css and /_astro/*.js referenced by those pages returns
#      200 with the right content-type.
#   3. Every URL in the sitemap returns 2xx or 3xx.
#   4. The newest frame carries a correct canonical, the shared Friday Frame OG
#      card, and the rest of the OG/article tags, and the OG image loads.
#   5. Every external anchor in served HTML carries target="_blank" and
#      rel="noopener noreferrer".
#   6. The archive index actually lists the newest frame. A silent
#      content-collection failure builds a page that renders but lists nothing,
#      which no status-code check would ever catch.
#   7. No published page leaks private working-notes markers. Drafts arrive as
#      one file with the copy on top and Adrian's notes below a rule; the notes
#      never publish. This turns that check from a manual read into a gate.
#
# The newest frame is DERIVED from src/content/friday-frame (highest date, not
# draft), never typed in here, so it cannot go stale. If the script is run from
# outside a checkout it falls back to the newest frame listed in the sitemap.
#
# Usage:
#   bash scripts/smoke-test.sh                        # defaults to production
#   bash scripts/smoke-test.sh https://adrianwatkins.com
#   bash scripts/smoke-test.sh https://astro-rebuild.adrianwatkins-com-preview.pages.dev

set -u

DOMAIN="${1:-https://adrianwatkins.com}"
DOMAIN="${DOMAIN%/}"
HOST="${DOMAIN#https://}"; HOST="${HOST#http://}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRAME_DIR="$REPO_ROOT/src/content/friday-frame"

PASS=0; FAIL=0; WARN=0
CACHE="$(mktemp -d)"
trap 'rm -rf "$CACHE"' EXIT

if [ -t 1 ]; then R=$'\033[31m'; G=$'\033[32m'; Y=$'\033[33m'; B=$'\033[1m'; N=$'\033[0m'
else R=""; G=""; Y=""; B=""; N=""; fi

ok()      { PASS=$((PASS+1)); printf '  %sok  %s %s\n' "$G" "$N" "$1"; }
fail()    { FAIL=$((FAIL+1)); printf '  %sFAIL%s %s\n' "$R" "$N" "$1"; }
warn()    { WARN=$((WARN+1)); printf '  %swarn%s %s\n' "$Y" "$N" "$1"; }
section() { printf '\n%s=== %s ===%s\n' "$B" "$1" "$N"; }

# Fetch a URL once and cache the body. Echoes the cache path, or nothing on a
# non-200. Follows redirects so the trailing-slash 308 is not a false red.
fetch() {
  local url="$1"
  local key; key="$(printf '%s' "$url" | tr -c 'A-Za-z0-9' '_')"
  local body="$CACHE/$key.body"
  if [ ! -f "$body" ]; then
    curl -sS -L --max-time 20 -o "$body" -w '%{http_code}' "$url" > "$CACHE/$key.code" 2>/dev/null || echo "000" > "$CACHE/$key.code"
  fi
  [ "$(cat "$CACHE/$key.code")" = "200" ] && printf '%s' "$body"
}

# --------------------------------------------------------------------------
# Work out which frame is newest, from the content directory rather than a
# hardcoded slug.
# --------------------------------------------------------------------------
NEWEST_SLUG=""
if [ -d "$FRAME_DIR" ]; then
  NEWEST_SLUG="$(
    for f in "$FRAME_DIR"/*.md; do
      [ -e "$f" ] || continue
      grep -qE '^draft:[[:space:]]*true' "$f" && continue
      d="$(grep -m1 -E '^date:' "$f" | sed -E 's/^date:[[:space:]]*//; s/[[:space:]]*$//')"
      [ -n "$d" ] && printf '%s\t%s\n' "$d" "$(basename "$f" .md)"
    done | sort -r | head -1 | cut -f2
  )"
fi
if [ -z "$NEWEST_SLUG" ]; then
  NEWEST_SLUG="$(curl -sS --max-time 20 "$DOMAIN/sitemap-0.xml" 2>/dev/null \
    | grep -o '/writing/friday-frame/[0-9][^<]*' | sed 's|.*/||' | sort -r | head -1)"
  [ -n "$NEWEST_SLUG" ] && warn "no local content dir, newest frame taken from the sitemap instead"
fi
if [ -z "$NEWEST_SLUG" ]; then
  printf '%sFAIL%s could not determine the newest Friday Frame from content or sitemap\n' "$R" "$N"
  exit 1
fi

NEWEST_PATH="/writing/friday-frame/$NEWEST_SLUG"
NEWEST_URL="$DOMAIN$NEWEST_PATH"
printf '%ssmoke: %s%s\n' "$B" "$DOMAIN" "$N"
printf 'newest frame: %s\n' "$NEWEST_SLUG"

# --------------------------------------------------------------------------
# 1. Core routes.  trailingSlash is 'never' and build.format is 'file', so the
#    canonical form carries no trailing slash and the slashed form 308s to it.
# --------------------------------------------------------------------------
section "core routes return 200"
ROUTES=( "/" "/writing" "/writing/friday-frame" "$NEWEST_PATH" "/now" "/speaking" "/about" "/edge" )
for path in "${ROUTES[@]}"; do
  code="$(curl -sS -o /dev/null -L --max-time 20 -w '%{http_code}' "$DOMAIN$path" 2>/dev/null || echo 000)"
  if [ "$code" = "200" ]; then ok "$path"; else fail "$path returned HTTP $code (expected 200)"; fi
done

code="$(curl -sS -o /dev/null --max-time 20 -w '%{http_code}' "$DOMAIN/writing/friday-frame/" 2>/dev/null || echo 000)"
case "$code" in
  30*) ok "/writing/friday-frame/ redirects ($code) to the no-slash form, as trailingSlash:'never' intends" ;;
  200) ok "/writing/friday-frame/ serves 200" ;;
  *)   fail "/writing/friday-frame/ returned HTTP $code (expected 200 or a 3xx redirect)" ;;
esac

# --------------------------------------------------------------------------
# 2. Assets referenced by those pages.
# --------------------------------------------------------------------------
section "referenced /_astro assets return 200 with the right MIME"
ASSETS="$CACHE/assets.txt"; : > "$ASSETS"
for path in "${ROUTES[@]}"; do
  body="$(fetch "$DOMAIN$path")" || true
  [ -n "$body" ] || continue
  grep -o '/_astro/[A-Za-z0-9._-]*\.\(css\|js\)' "$body" >> "$ASSETS" 2>/dev/null || true
done
sort -u "$ASSETS" -o "$ASSETS"
if [ ! -s "$ASSETS" ]; then
  fail "no /_astro/*.css or *.js references found on any core route (the build may not have shipped its assets)"
else
  while read -r asset; do
    [ -n "$asset" ] || continue
    meta="$(curl -sS -o /dev/null -L --max-time 20 -w '%{http_code}|%{content_type}' "$DOMAIN$asset" 2>/dev/null || echo '000|')"
    acode="${meta%%|*}"; ctype="${meta#*|}"
    case "$asset" in
      *.css) expect="text/css" ;;
      *.js)  expect="javascript" ;;
    esac
    if [ "$acode" != "200" ]; then
      fail "$asset returned HTTP $acode"
    elif ! printf '%s' "$ctype" | grep -qi "$expect"; then
      fail "$asset served as '$ctype' (expected $expect)"
    else
      ok "$asset ($ctype)"
    fi
  done < "$ASSETS"
fi

# --------------------------------------------------------------------------
# 3. Sitemap URLs.
# --------------------------------------------------------------------------
section "every sitemap URL is 2xx or 3xx"
SITEMAP_URLS="$CACHE/sitemap-urls.txt"; : > "$SITEMAP_URLS"
index="$(curl -sS --max-time 20 "$DOMAIN/sitemap-index.xml" 2>/dev/null || true)"
if [ -z "$index" ]; then
  fail "/sitemap-index.xml is empty or unreachable"
else
  # Two sed expressions rather than one <\/\?loc>: BSD sed (macOS) does not
  # support \? in a basic regex, so the one-expression form silently strips
  # nothing and every child sitemap URL comes back wrapped in its own tags.
  for child in $(printf '%s' "$index" | grep -o '<loc>[^<]*</loc>' | sed 's|<loc>||g; s|</loc>||g'); do
    curl -sS --max-time 20 "$child" 2>/dev/null | grep -o '<loc>[^<]*</loc>' | sed 's|<loc>||g; s|</loc>||g' >> "$SITEMAP_URLS"
  done
  sort -u "$SITEMAP_URLS" -o "$SITEMAP_URLS"
  total="$(wc -l < "$SITEMAP_URLS" | tr -d ' ')"
  if [ "$total" = "0" ]; then
    fail "sitemap index resolved to zero URLs"
  else
    bad=0
    while read -r u; do
      [ -n "$u" ] || continue
      c="$(curl -sS -o /dev/null --max-time 20 -w '%{http_code}' "$u" 2>/dev/null || echo 000)"
      case "$c" in 2*|3*) ;; *) fail "sitemap URL $u returned HTTP $c"; bad=$((bad+1)) ;; esac
    done < "$SITEMAP_URLS"
    [ "$bad" = "0" ] && ok "$total sitemap URLs, all 2xx/3xx"
  fi
fi

# --------------------------------------------------------------------------
# 4. Canonical and OG tags on the newest frame.
# --------------------------------------------------------------------------
section "canonical and OG tags on the newest frame"
POST="$(fetch "$NEWEST_URL")" || true
if [ -z "$POST" ]; then
  fail "could not fetch $NEWEST_URL, skipping tag checks"
else
  canon="$(grep -o 'rel="canonical" href="[^"]*"' "$POST" | head -1 | sed 's/.*href="//; s/"$//')"
  if [ "$canon" = "https://adrianwatkins.com$NEWEST_PATH" ]; then
    ok "canonical is https://adrianwatkins.com$NEWEST_PATH"
  else
    fail "canonical is '${canon:-missing}', expected https://adrianwatkins.com$NEWEST_PATH"
  fi

  ogimg="$(grep -o 'property="og:image" content="[^"]*"' "$POST" | head -1 | sed 's/.*content="//; s/"$//')"
  if [ "$ogimg" = "https://adrianwatkins.com/og/friday-frame-default.png" ]; then
    ok "og:image is the shared Friday Frame card"
  else
    fail "og:image is '${ogimg:-missing}', expected the shared card https://adrianwatkins.com/og/friday-frame-default.png"
  fi
  if [ -n "$ogimg" ]; then
    meta="$(curl -sS -o /dev/null -L --max-time 20 -w '%{http_code}|%{content_type}' "$ogimg" 2>/dev/null || echo '000|')"
    if [ "${meta%%|*}" = "200" ] && printf '%s' "${meta#*|}" | grep -qi '^image/'; then
      ok "og:image loads (${meta#*|})"
    else
      fail "og:image did not load as an image: HTTP ${meta%%|*}, type ${meta#*|}"
    fi
  fi

  for tag in 'property="og:title"' 'property="og:description"' 'property="og:type" content="article"' 'property="og:url"'; do
    if grep -q "$tag" "$POST"; then ok "present: $tag"; else fail "missing: $tag"; fi
  done
fi

# --------------------------------------------------------------------------
# 5. External anchors open in a new window, with the rel that makes that safe.
# --------------------------------------------------------------------------
section "external links carry target=_blank and rel=noopener noreferrer"
extbad=0; extseen=0
for path in "${ROUTES[@]}"; do
  body="$(fetch "$DOMAIN$path")" || true
  [ -n "$body" ] || continue
  while IFS= read -r tag; do
    href="$(printf '%s' "$tag" | sed -n 's/.*href="\([^"]*\)".*/\1/p')"
    case "$href" in
      http://$HOST/*|https://$HOST/*|http://$HOST|https://$HOST) continue ;;
      http*://*) ;;
      *) continue ;;
    esac
    extseen=$((extseen+1))
    miss=""
    printf '%s' "$tag" | grep -q 'target="_blank"' || miss="$miss target=_blank"
    printf '%s' "$tag" | grep -q 'rel="[^"]*noopener' || miss="$miss rel=noopener"
    printf '%s' "$tag" | grep -q 'rel="[^"]*noreferrer' || miss="$miss rel=noreferrer"
    if [ -n "$miss" ]; then
      fail "$path -> $href is missing:$miss"
      extbad=$((extbad+1))
    fi
  done < <(grep -o '<a [^>]*>' "$body" 2>/dev/null || true)
done
if [ "$extseen" = "0" ]; then
  warn "no external anchors found on the core routes, nothing to assert"
elif [ "$extbad" = "0" ]; then
  ok "$extseen external anchors, all carry target=_blank and rel=\"noopener noreferrer\""
fi

# --------------------------------------------------------------------------
# 6. The archive index lists the newest frame.
# --------------------------------------------------------------------------
section "the archive index lists the newest frame"
ARCHIVE="$(fetch "$DOMAIN/writing/friday-frame")" || true
if [ -z "$ARCHIVE" ]; then
  fail "could not fetch $DOMAIN/writing/friday-frame"
elif grep -q "$NEWEST_SLUG" "$ARCHIVE"; then
  ok "/writing/friday-frame links to $NEWEST_SLUG"
else
  fail "/writing/friday-frame renders but does NOT link to $NEWEST_SLUG. The page is up and the content collection is not, which no status check would catch."
fi

HOME="$(fetch "$DOMAIN/")" || true
if [ -n "$HOME" ] && grep -q 'friday-frame' "$HOME"; then
  ok "homepage references the Friday Frame series"
elif [ -n "$HOME" ]; then
  warn "homepage carries no /writing/friday-frame reference"
fi

# --------------------------------------------------------------------------
# 7. Private working-notes leak gate.
#
# Drafts arrive as one file: the copy, a rule, then Adrian's notes. Everything
# below the rule is private, so a mis-cut publishes his open editorial
# questions, his source list, and third-party detail. "not for posting" and
# "Sources for the factual" are distinctive enough to match on their own.
# "Still open" and "Expected pushback" are matched only when they are a whole
# rendered element (the notes render both as bold), because the bare phrases
# are ordinary English and would red-flag honest prose otherwise: "that
# question is still open", "I expected pushback from the board". Both of those
# false positives were caught while building this gate, which is why the
# tag-bounding is here. Do not loosen it back.
# --------------------------------------------------------------------------
section "no private working-notes markers on any published page"
MARKERS='not for posting|Sources for the factual|>[[:space:]]*(Still open|Expected pushback)[[:space:]]*<'
leaks=0; scanned=0
if [ -s "$SITEMAP_URLS" ]; then SCAN_LIST="$SITEMAP_URLS"; else SCAN_LIST="$CACHE/fallback.txt"; printf '%s\n' "$DOMAIN/" "$NEWEST_URL" > "$SCAN_LIST"; fi
while read -r u; do
  [ -n "$u" ] || continue
  case "$u" in *.xml|*.png|*.jpg|*.svg|*.ico|*.pdf) continue ;; esac
  page="$(curl -sS -L --max-time 20 "$u" 2>/dev/null || true)"
  [ -n "$page" ] || continue
  scanned=$((scanned+1))
  hit="$(printf '%s' "$page" | grep -o -iE "$MARKERS" | head -1 || true)"
  if [ -n "$hit" ]; then
    fail "PRIVATE NOTES LEAK on $u, matched: '$hit'"
    leaks=$((leaks+1))
  fi
done < "$SCAN_LIST"
if [ "$leaks" = "0" ] && [ "$scanned" -gt 0 ]; then
  ok "$scanned pages scanned, no notes markers found"
elif [ "$scanned" = "0" ]; then
  fail "scanned zero pages for notes markers"
fi

# --------------------------------------------------------------------------
section "summary"
printf '  %s%d passed%s, %s%d failed%s, %s%d warnings%s\n' "$G" "$PASS" "$N" "$R" "$FAIL" "$N" "$Y" "$WARN" "$N"
if [ "$FAIL" -gt 0 ]; then
  printf '\n%sSMOKE TEST FAILED%s for %s. See the FAIL lines above.\n' "$R" "$N" "$DOMAIN"
  exit 1
fi
printf '\n%sSMOKE TEST PASSED%s for %s.\n' "$G" "$N" "$DOMAIN"
exit 0
