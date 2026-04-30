#!/usr/bin/env bash
set -euo pipefail

echo "🔍 KidsTune Smoke Test"
echo "======================"

# Check that frontend builds
echo "→ Checking frontend build..."
npm run build -w frontend 2>&1 | tail -1

# Check that functions compile
echo "→ Checking functions build..."
npm run build -w functions 2>&1 | tail -1

# Check firebase.json is valid JSON
echo "→ Validating firebase.json..."
node -e "JSON.parse(require('fs').readFileSync('firebase.json','utf8'))"
echo "  ✓ firebase.json is valid"

echo ""
echo "✅ All smoke checks passed!"
