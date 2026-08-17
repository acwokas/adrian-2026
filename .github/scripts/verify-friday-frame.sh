#!/usr/bin/env bash
#
# Post-publish verification for the Friday Frame.
#
# Belongs at .github/scripts/verify-friday-frame.sh in the adrian-2026 repo.
#
# Every assertion below is a hard failure. The one that matters most is
# assertion 5: the archive item count must have moved by exactly the expected
# delta. On 2026-08-14 the pipeline produced nothing, and "nothing" looked like
# a clean run because no step ever asserted that the archive had grown. A run
# that publishes zero frames must not be able to exit green.
#
# Usage: verify-friday-frame.sh <slug> <expected-title> <baseline-count>
#
# EXPECT_DELTA (env, default 1)
#   1 = a real publish; the archive must have grown by exactly one.
#   0 = dry-run rehearsal against an already-live slug; the archive must be
#       unchanged. This lets workflow_dispatch exercise assertions 1-5 for real
#       without publishing anything, so the pipeline is never armed on cron
#       having never had a green run.

set -euo pipefail

SLUG="${1:?slug required}"
EXPECTED_TITLE="${2:?expected title required}"
BASELINE="${3:?baseline count required}"

SITE_BASE="${SITE_BASE:-https://adrianwatkins.com}"
ARCHIVE_PATH="${ARCHIVE_PATH:-/writing/friday-frame}"
WRITING_PATH="${WRITING_PATH:-/writing}"
EXPECT_DELTA="${EXPECT_DELTA:-1}"

POST_URL="${SITE_BASE}${ARCHIVE_PATH}/${SLUG}"
ARCHIVE_URL="${SITE_BASE}${ARCHIVE_PATH}"
WRITING_URL="${SITE_BASE}${WRITING_PATH}"

ATTEMPTS="${VERIFY_ATTEMPTS:-6}"
SLEEP="${VERIFY_SLEEP:-20}"

fail() { echo "::error::VERIFY FAILED: $*"; exit 1; }
ok()   { echo "  ok  $*"; }

count_archive() {
  curl -sS --max-time 30 "$ARCHIVE_URL" \
    | grep -oE 'href="(https://adrianwatkins\.com)?/writing/friday-frame/[a-z0-9-]+"' \
    | sort -u | wc -l | tr -d ' '
}

echo "Verifying ${SLUG} (expected delta ${EXPECT_DELTA}, baseline ${BASELINE})"

# 1. Deploys are not instant. Poll the post URL until it is live, then run the
#    remaining assertions once against a settled site.
echo "Waiting for ${POST_URL} to go live (max $((ATTEMPTS * SLEEP))s)..."
LIVE=0
for i in $(seq 1 "$ATTEMPTS"); do
  CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$POST_URL" || echo 000)"
  if [ "$CODE" = "200" ]; then LIVE=1; echo "  live after $((i * SLEEP))s (attempt $i)"; break; fi
  echo "  attempt $i: HTTP $CODE, retrying in ${SLEEP}s"
  sleep "$SLEEP"
done
[ "$LIVE" = "1" ] || fail "1/5 ${POST_URL} never returned 200 within the window."
ok "1/5 live URL returns 200"

HTML="$(curl -sS --max-time 30 "$POST_URL")"

# 2. Rendered <title> must contain the frontmatter title. The site template
#    appends the series suffix ("Friday Frame. Adrian Watkins."), so this is a
#    containment check, not equality.
# `sed -n '1p'` rather than `head -1` throughout: head exits on its first line
# and closes the pipe, which under `set -o pipefail` is the same false-failure
# race documented at assertion 4 below. sed reads to EOF, so nothing upstream
# ever takes SIGPIPE. Same output, no race.
PAGE_TITLE="$(printf '%s' "$HTML" | grep -oE '<title>[^<]*</title>' | sed -n '1p' | sed 's/<\/\?title>//g')"
[ -n "$PAGE_TITLE" ] || fail "2/5 no <title> found on the published page."
case "$PAGE_TITLE" in
  *"$EXPECTED_TITLE"*) ok "2/5 title matches frontmatter: ${PAGE_TITLE}" ;;
  *) fail "2/5 title mismatch. Expected to contain: '${EXPECTED_TITLE}'. Got: '${PAGE_TITLE}'." ;;
esac

# 3. OG image must resolve. Friday Frames use the shared series card
#    (og/friday-frame-default.png) rather than a per-post hero, so this checks
#    whatever og:image the page actually declares. Relative URLs are resolved
#    against SITE_BASE.
OG_IMAGE="$(printf '%s' "$HTML" | grep -oE '<meta[^>]+property="og:image"[^>]+content="[^"]+"' | sed -n '1p' | grep -oE 'content="[^"]+"' | cut -d'"' -f2)"
[ -n "$OG_IMAGE" ] || fail "3/5 page declares no og:image."
case "$OG_IMAGE" in
  http*) OG_URL="$OG_IMAGE" ;;
  *)     OG_URL="${SITE_BASE}${OG_IMAGE}" ;;
esac
IMG_CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 "$OG_URL" || echo 000)"
[ "$IMG_CODE" = "200" ] || fail "3/5 og:image ${OG_URL} returned HTTP ${IMG_CODE}."
ok "3/5 og image resolves 200: ${OG_URL}"

# 4. The slug must appear in BOTH listings. Two independent queries, because on
#    2026-08-14 both were checked by hand and both were empty.
#    Fetch to a file BEFORE grepping. Piping curl straight into `grep -q` is a
#    race, not a style nit: grep exits on its first match and closes the pipe,
#    curl then dies writing the remainder with exit 23, and `set -o pipefail`
#    turns that into a false "NOT listed" hard failure on a page that is in
#    fact perfectly correct. Measured at 5 failures in 12 runs against
#    /writing (65KB) on 2026-08-15. The archive page is small enough to almost
#    always win the race, which is why this hid for so long. A flaky verifier
#    that cries "published but not surfaced" is the same loss of trust as a
#    silent no-op, approached from the other side.
for pair in "archive:${ARCHIVE_URL}" "writing:${WRITING_URL}"; do
  NAME="${pair%%:*}"; URL="${pair#*:}"
  LISTING="$(mktemp)"
  if ! curl -sS --max-time 30 "$URL" > "$LISTING"; then
    rm -f "$LISTING"
    fail "4/5 could not fetch ${NAME} listing at ${URL}."
  fi
  if grep -qE "href=\"(https://adrianwatkins\.com)?${ARCHIVE_PATH}/${SLUG}\"" "$LISTING"; then
    rm -f "$LISTING"
    ok "4/5 slug present in ${NAME} listing"
  else
    rm -f "$LISTING"
    fail "4/5 slug '${SLUG}' is NOT listed at ${URL}. Published but not surfaced."
  fi
done

# 5. HARD ASSERTION. The archive count must have moved by exactly EXPECT_DELTA.
#    This is the check whose absence let the 2026-08-14 silent no-op pass.
AFTER="$(count_archive)"
EXPECTED=$((BASELINE + EXPECT_DELTA))
if [ "$AFTER" -ne "$EXPECTED" ]; then
  fail "5/5 archive count is ${AFTER}, expected ${EXPECTED} (baseline ${BASELINE} + delta ${EXPECT_DELTA}). A run that adds no frame must never exit green."
fi
ok "5/5 archive count ${BASELINE} -> ${AFTER} (delta ${EXPECT_DELTA} as expected)"

echo
echo "All 5 assertions passed. ${POST_URL} is live and listed."
