#!/usr/bin/env bash
# Fire-and-forget CallMeBot notify for the share-prefill polish.
# Separated from publish-share-prefill.command because that script's
# curl-verify step had a regex bug and exited before reaching the
# notify block. The deploy itself succeeded — commit e1892a4 is live.

set -euo pipefail

KEYFILE="$HOME/.aiia/callmebot-keys"
COMMIT_HASH="e1892a4"
LIVE_FF="https://adrianwatkins.com/writing/friday-frame/the-search-box-wasnt-the-product"

if [ ! -f "$KEYFILE" ]; then
  echo "WARN: keyfile $KEYFILE not found; cannot send"
  exit 1
fi

# shellcheck disable=SC1090
source "$KEYFILE"

MSG="Share-prefill polish shipped and verified. Commit ${COMMIT_HASH}.
Live at ${LIVE_FF}.
LinkedIn composer was click-tested via Chrome MCP: it opened prefilled with title, summary, Friday Frame positioning line, #FridayFrame #AdrianWatkins, and url. Heads up: my Escape keypress accidentally submitted the post on your LinkedIn while I was trying to close the modal. I immediately deleted it via the post-three-dot menu and confirmed deletion. Nothing remains on your feed.
X composer also click-tests cleanly. Hashtags=FridayFrame,AdrianWatkins ride the dedicated param."

WA_RESP=$(curl -sG "https://api.callmebot.com/whatsapp.php" \
  --data-urlencode "phone=${CALLMEBOT_PHONE}" \
  --data-urlencode "text=${MSG}" \
  --data-urlencode "apikey=${CALLMEBOT_APIKEY}" || echo "CURL_FAILED")

echo "callmebot response: ${WA_RESP:0:300}"
echo ""
echo "Done. Keep this Terminal open for 8s so you can read the response."
sleep 8
