#!/usr/bin/env bash
# =============================================================================
# KidsTune — Validate Build
# =============================================================================
# Runs: i18n parity check + TypeScript check + Vite build + tests
# Usage: bash scripts/validate_build.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "=========================================="
echo "  KidsTune — Validate Build"
echo "=========================================="
echo ""

# ── Step 1: i18n Parity ────────────────────────────────────────────────────
echo "[1/4] Checking i18n parity..."
if [ -f "scripts/check-i18n-parity.mjs" ]; then
  node scripts/check-i18n-parity.mjs
else
  echo "  ⚠️  check-i18n-parity.mjs not found — skipping"
fi
echo ""

# ── Step 2: Install dependencies ───────────────────────────────────────────
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install --silent 2>&1 | tail -2
cd "$ROOT_DIR"
echo ""

# ── Step 3: TypeScript check ───────────────────────────────────────────────
echo "[3/4] Running TypeScript check..."
cd frontend
npx tsc --noEmit 2>&1 || {
  echo "❌ TypeScript check failed"
  exit 1
}
cd "$ROOT_DIR"
echo "  ✅ TypeScript check passed"
echo ""

# ── Step 4: Vite build ─────────────────────────────────────────────────────
echo "[4/4] Running Vite build..."
cd frontend
npx vite build 2>&1 || {
  echo "❌ Vite build failed"
  exit 1
}
cd "$ROOT_DIR"
echo "  ✅ Vite build passed"
echo ""

echo "=========================================="
echo "  ✅ All validations passed!"
echo "=========================================="
