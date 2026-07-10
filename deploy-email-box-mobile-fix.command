#!/usr/bin/env bash
# Deploy the staged email-box mobile fix:
#   1) src/components/NotifySignup.astro  - mobile media query override on .ns-input
#   2) src/pages/writing/friday-frame/[slug].astro - move NotifySignup under Read every Friday Frame CTA
#
# Self-contained. Run by double-clicking this .command file in Finder.
# Writes a structured log to /Users/adrian/adrian-2026/deploy-email-box-mobile-fix.log
# so the calling Claude session can read the outcome back from the workspace mount.

set -uo pipefail

REPO_ROOT="/Users/adrian/adrian-2026"
BRANCH="astro-rebuild"
SLUG="the-search-box-wasnt-the-product"
LIVE_URL="https://adrianwatkins.com/writing/friday-frame/${SLUG}"
COMMIT_MSG="Fix mobile email input height; move signup under Read every Friday Frame CTA"
KEYFILE="$HOME/.aiia/callmebot-keys"
LOGFILE="${REPO_ROOT}/deploy-email-box-mobile-fix.log"
RESULTFILE="${REPO_ROOT}/deploy-email-box-mobile-fix.result"

exec > >(tee "$LOGFILE") 2>&1

echo "=== Deploy started: $(date -u +%FT%TZ) ==="
cd "$REPO_ROOT" || { echo "FAIL: cd $REPO_ROOT"; echo "STATUS=FAIL_CD" > "$RESULTFILE"; exit 1; }

echo "==> Clearing any stale git locks"
rm -f .git/index.lock .git/HEAD.lock .git/test_write .git/objects/*/tmp_obj_* 2>/dev/null || true
find .git -name 'tmp_obj_*' -delete 2>/dev/null || true

echo "==> Confirming staged files exist on disk"
test -f src/components/NotifySignup.astro || { echo "MISSING NotifySignup.astro"; echo "STATUS=FAIL_MISSING_FILE" > "$RESULTFILE"; exit 1; }
test -f "src/pages/writing/friday-frame/[slug].astro" || { echo "MISSING [slug].astro"; echo "STATUS=FAIL_MISSING_FILE" > "$RESULTFILE"; exit 1; }

echo "==> git status (pre)"
git status --short

echo "==> Staging ONLY the two intended files"
git add src/components/NotifySignup.astro "src/pages/writing/friday-frame/[slug].astro"

echo "==> Verifying only those two files are staged"
STAGED=$(git diff --cached --name-only | sort)
EXPECTED=$(printf "src/components/NotifySignup.astro\nsrc/pages/writing/friday-frame/[slug].astro\n" | sort)
if [ "$STAGED" != "$EXPECTED" ]; then
  echo "FAIL: staged set does not match expected set."
  echo "STAGED:"; echo "$STAGED"
  echo "EXPECTED:"; echo "$EXPECTED"
  echo "STATUS=FAIL_STAGED_MISMATCH" > "$RESULTFILE"
  exit 1
fi
echo "    OK: staged set matches."

echo "==> Committing"
git commit -m "$COMMIT_MSG"
COMMIT_HASH=$(git rev-parse HEAD)
SHORT_HASH=$(git rev-parse --short HEAD)
echo "    commit: $COMMIT_HASH"

echo "==> Pushing to origin/$BRANCH"
if ! git push origin "$BRANCH"; then
  echo "    push failed, attempting pull --rebase then retry"
  git pull --rebase origin "$BRANCH" || { echo "FAIL: rebase failed"; echo "STATUS=FAIL_REBASE COMMIT=$COMMIT_HASH" > "$RESULTFILE"; exit 1; }
  git push origin "$BRANCH" || { echo "FAIL: push failed after rebase"; echo "STATUS=FAIL_PUSH COMMIT=$COMMIT_HASH" > "$RESULTFILE"; exit 1; }
fi

echo "==> Building"
npm run build || { echo "FAIL: build"; echo "STATUS=FAIL_BUILD COMMIT=$COMMIT_HASH" > "$RESULTFILE"; exit 1; }

echo "==> Deploying via wrangler pages"
DEPLOY_OUT=$(npx wrangler pages deploy dist --project-name adrianwatkins-com-preview --branch "$BRANCH" --commit-dirty=true 2>&1 | tee /dev/stderr)
DEPLOY_URL=$(echo "$DEPLOY_OUT" | grep -oE 'https://[a-z0-9-]+\.adrianwatkins-com-preview\.pages\.dev' | head -1)
DEPLOY_ID=$(echo "$DEPLOY_OUT" | grep -oE 'Deployment [a-zA-Z0-9-]+' | head -1 | awk '{print $2}')
[ -z "$DEPLOY_URL" ] && DEPLOY_URL=$(echo "$DEPLOY_OUT" | grep -oE 'https://[a-z0-9.-]+\.pages\.dev' | head -1)
echo "    deploy URL: $DEPLOY_URL"
echo "    deploy ID:  $DEPLOY_ID"

echo "==> Waiting 30s for Cloudflare to propagate"
sleep 30

echo "==> Verifying live URL (apex)"
LIVE_HTML=$(curl -fsSL -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" "$LIVE_URL" || echo "")
if [ -z "$LIVE_HTML" ]; then
  echo "WARN: apex returned empty body, will try preview URL"
  LIVE_HTML=$(curl -fsSL -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15" "${DEPLOY_URL}/writing/friday-frame/${SLUG}" || echo "")
fi

VERIFY_INPUT_FIX="MISSING"
VERIFY_SIGNUP_POSITION="UNKNOWN"
if echo "$LIVE_HTML" | grep -q 'flex: 0 1 auto; height: auto; min-height: 0'; then
  VERIFY_INPUT_FIX="OK"
fi

# Check that the Read every Friday Frame anchor appears before the NotifySignup component markup
READ_POS=$(echo "$LIVE_HTML" | grep -boE 'Read every Friday Frame' | head -1 | cut -d: -f1)
NS_POS=$(echo "$LIVE_HTML" | grep -boE 'ns-form|ns-input|NotifySignup' | head -1 | cut -d: -f1)
if [ -n "$READ_POS" ] && [ -n "$NS_POS" ]; then
  if [ "$READ_POS" -lt "$NS_POS" ]; then
    VERIFY_SIGNUP_POSITION="OK_AFTER_CTA (read@${READ_POS} signup@${NS_POS})"
  else
    VERIFY_SIGNUP_POSITION="FAIL_BEFORE_CTA (read@${READ_POS} signup@${NS_POS})"
  fi
else
  VERIFY_SIGNUP_POSITION="MISSING_MARKERS (read=$READ_POS signup=$NS_POS)"
fi

echo "    input fix:        $VERIFY_INPUT_FIX"
echo "    signup position:  $VERIFY_SIGNUP_POSITION"

echo "==> Firing WhatsApp via CallMeBot"
WA_RESP="SKIPPED"
if [ -f "$KEYFILE" ]; then
  # shellcheck disable=SC1090
  source "$KEYFILE"
  WA_MSG="Email-box mobile fix deployed.
Commit ${SHORT_HASH}
Live: ${LIVE_URL}
Preview: ${DEPLOY_URL}
Input height fix: ${VERIFY_INPUT_FIX}
Signup position: ${VERIFY_SIGNUP_POSITION}"
  WA_RESP=$(curl -sG "https://api.callmebot.com/whatsapp.php" \
    --data-urlencode "phone=${CALLMEBOT_PHONE}" \
    --data-urlencode "text=${WA_MSG}" \
    --data-urlencode "apikey=${CALLMEBOT_APIKEY}" || echo "CURL_FAILED")
  echo "    callmebot response: ${WA_RESP:0:300}"
else
  echo "WARN: keyfile $KEYFILE not found; skipping WhatsApp"
fi

echo ""
echo "=== DONE ==="
echo "COMMIT=$COMMIT_HASH"
echo "SHORT=$SHORT_HASH"
echo "DEPLOY_URL=$DEPLOY_URL"
echo "DEPLOY_ID=$DEPLOY_ID"
echo "INPUT_FIX=$VERIFY_INPUT_FIX"
echo "SIGNUP_POSITION=$VERIFY_SIGNUP_POSITION"

cat > "$RESULTFILE" <<EOF
STATUS=OK
COMMIT=$COMMIT_HASH
SHORT=$SHORT_HASH
DEPLOY_URL=$DEPLOY_URL
DEPLOY_ID=$DEPLOY_ID
INPUT_FIX=$VERIFY_INPUT_FIX
SIGNUP_POSITION=$VERIFY_SIGNUP_POSITION
WA_RESP=${WA_RESP:0:300}
EOF

echo ""
echo "Keep this Terminal open. Will close in 10s."
sleep 10
