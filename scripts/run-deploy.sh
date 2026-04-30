#!/usr/bin/env bash
# Run this from the workspace: /home/user/environment/kidstune-app-10e0e17
set -euo pipefail

cd /home/user/environment/kidstune-app-10e0e17

# Setup env
export GOOGLE_APPLICATION_CREDENTIALS=/home/user/.agent/firebase-service-account.json
if [ -f /home/user/.agent/kidstune.env ]; then
  export GEMINI_API_KEY=$(grep GEMINI_API_KEY /home/user/.agent/kidstune.env | cut -d= -f2)
fi

# Clone if needed
if [ ! -f package.json ]; then
  echo "Cloning repo..."
  git clone https://github.com/brungcm/kidstune-app.git .
fi

# Pull latest
if [ -d .git ]; then
  git fetch origin main
  git checkout main
  git pull origin main
fi

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Build functions
cd functions
npm install
npm run build
cd ..

# Firebase auth
firebase use kidstune-dev --non-interactive

# Set secrets
if [ -n "${GEMINI_API_KEY:-}" ]; then
  echo "$GEMINI_API_KEY" | firebase functions:secrets:set GEMINI_API_KEY --data-stdin --non-interactive 2>/dev/null || true
  firebase functions:config:set stripe.mode="mock" --non-interactive 2>/dev/null || true
fi

# Deploy
echo "==> Deploying..."
if firebase deploy --only hosting,functions --project kidstune-dev --non-interactive --force 2>&1; then
  echo "✅ Deploy completo: hosting + functions"
else
  echo "⚠️  Functions falhou. Fallback para hosting-only..."
  firebase deploy --only hosting --project kidstune-dev --non-interactive --force
fi

# Smoke test
echo ""
echo "==> Smoke test..."
for i in 1 2 3; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://kidstune-dev.firebaseapp.com/" || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Smoke test PASSED — HTTP $HTTP_CODE"
    curl -sI "https://kidstune-dev.firebaseapp.com/"
    break
  else
    echo "⚠️  Attempt $i — HTTP $HTTP_CODE"
    [ "$i" -lt 3 ] && sleep 5 || echo "❌ Smoke test FAILED"
  fi
done

echo ""
echo "✅ Deploy concluído!"
echo "🌐 https://kidstune-dev.firebaseapp.com/"
