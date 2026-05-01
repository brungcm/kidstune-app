#!/usr/bin/env node
/**
 * i18n Parity Checker — KidsTune
 *
 * Verifies that en-US.json and pt-BR.json have the exact same keys.
 * Exits with code 0 if parity passes, 1 if keys are missing.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function loadLocale(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

console.log('🔍 Checking i18n parity between en-US.json and pt-BR.json...\n');

const enPath = resolve(ROOT, 'frontend', 'src', 'locales', 'en-US.json');
const ptPath = resolve(ROOT, 'frontend', 'src', 'locales', 'pt-BR.json');

const en = loadLocale(enPath);
const pt = loadLocale(ptPath);

const enKeys = new Set(flattenKeys(en));
const ptKeys = new Set(flattenKeys(pt));

const missingInPT = [...enKeys].filter(k => !ptKeys.has(k));
const missingInEN = [...ptKeys].filter(k => !enKeys.has(k));

let exitCode = 0;

if (missingInPT.length > 0) {
  console.log('❌ Keys present in en-US.json but MISSING in pt-BR.json:');
  missingInPT.forEach(k => console.log(`   - ${k}`));
  exitCode = 1;
}

if (missingInEN.length > 0) {
  console.log('❌ Keys present in pt-BR.json but MISSING in en-US.json:');
  missingInEN.forEach(k => console.log(`   - ${k}`));
  exitCode = 1;
}

if (exitCode === 0) {
  console.log(`✅ Parity check passed! Both files have ${enKeys.size} keys.`);
} else {
  console.log(`\n⚠️  Parity check FAILED.`);
}

process.exit(exitCode);
