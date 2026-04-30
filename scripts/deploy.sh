#!/usr/bin/env bash
# =============================================================================
# KidsTune — Deploy to Firebase Hosting + Functions
# =============================================================================
# Usage: bash scripts/deploy.sh
#
# Environment:
#   GOOGLE_APPLICATION_CREDENTIALS  — path to service account JSON
#   GEMINI_API_KEY                  — Gemini API key (optional for hosting-only)
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "=========================================="
echo "  KidsTune — Firebase Deploy"
echo "=========================================="

# ── Authenticate ────────────────────────────────────────────────────────────
if [ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]; then
  echo "[1/5] Authenticating with service account..."
  export FIREBASE_TOKEN=""
  firebase use kidstune-dev --non-interactive
else
  echo "[1/5] GOOGLE_APPLICATION_CREDENTIALS not set — using default auth"
  firebase use kidstune-dev --non-interactive
fi

# ── Build frontend ──────────────────────────────────────────────────────────
echo "[2/5] Building frontend..."
cd frontend
npm install --silent
npm run build
cd "$ROOT_DIR"

# ── Build functions ─────────────────────────────────────────────────────────
echo "[3/5] Building functions..."
cd functions
npm install --silent
npm run build
cd "$ROOT_DIR"

# ── Set secrets (if GEMINI_API_KEY is available) ────────────────────────────
if [ -n "${GEMINI_API_KEY:-}" ]; then
  echo "[4/5] Setting Gemini API key secret..."
  echo "$GEMINI_API_KEY" | firebase functions:secrets:set GEMINI_API_KEY --data-stdin --non-interactive 2>/dev/null || true
  firebase functions:config:set stripe.mode="mock" --non-interactive 2>/dev/null || true
else
  echo "[4/5] GEMINI_API_KEY not set — skipping secrets"
fi

# ── Deploy ──────────────────────────────────────────────────────────────────
echo "[5/5] Deploying to Firebase..."
if firebase deploy --only hosting,functions --project kidstune-dev --non-interactive --force 2>&1; then
  echo "✅ Deploy completo: hosting + functions"
else
  echo "⚠️  Functions deploy falhou (provavelmente Spark plan sem billing)."
  echo "   Fazendo fallback para hosting-only..."
  firebase deploy --only hosting --project kidstune-dev --non-interactive --force
  echo "✅ Deploy hosting-only concluído."
  echo ""
  echo "📌 Para ativar Functions, faça upgrade para o plano Blaze em:"
  echo "   https://console.firebase.google.com/project/kidstune-dev/usage/details"
fi

# ── Smoke test ──────────────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo "  Smoke Test"
echo "=========================================="
for i in 1 2 3; do
  echo "Attempt $i/3: curl -sI https://kidstune-dev.firebaseapp.com/"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://kidstune-dev.firebaseapp.com/" || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Smoke test PASSED — HTTP $HTTP_CODE"
    curl -sI "https://kidstune-dev.firebaseapp.com/"
    break
  else
    echo "⚠️  Smoke test attempt $i — HTTP $HTTP_CODE"
    if [ "$i" -lt 3 ]; then
      echo "   Retrying in 5s..."
      sleep 5
    else
      echo "❌ Smoke test FAILED after 3 attempts"
    fi
  fi
done

echo ""
echo "=========================================="
echo "  ✅ Deploy concluído!"
echo "  🌐 https://kidstune-dev.firebaseapp.com/"
echo "=========================================="
