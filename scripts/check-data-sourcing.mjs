#!/usr/bin/env node
// Fails the build if a speaking card or reading name is hardcoded into a
// page's markup instead of coming from src/data/speaking.ts or
// src/data/reading.ts. Those two files exist so speaking.astro, now.astro,
// and the homepage excerpts can never say different things about the same
// entry; this script is what actually stops that from happening again.
//
// It runs against SOURCE files, not the built dist/ output: once rendered,
// a hardcoded card and a data-driven card produce identical HTML, so the
// only place provenance is still visible is the .astro source.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

const failures = [];

function read(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8');
}

function countOccurrences(text, literal) {
  return text.split(literal).length - 1;
}

// --- 1. Speaking cards: every literal <div class="speak-card"> in a page's
// source must come from the single .map() block driven by src/data/speaking.ts.
// Each page has exactly two such blocks (Upcoming, Recent), so the literal
// count in source is fixed at 2 regardless of how many entries exist in the
// data module. A third occurrence means someone pasted a card by hand.
const SPEAK_CARD_FILES = [
  { file: 'src/pages/speaking.astro', expectedCards: 2, expectedImport: "from '../data/speaking'" },
  { file: 'src/pages/index.astro', expectedCards: 2, expectedImport: "from '../data/speaking'" },
];

for (const { file, expectedCards, expectedImport } of SPEAK_CARD_FILES) {
  const text = read(file);

  if (!text.includes(expectedImport)) {
    failures.push(
      `${file}: does not import from '../data/speaking' — speaking entries must render from src/data/speaking.ts`,
    );
  }

  const cardCount = countOccurrences(text, '<div class="speak-card">');
  if (cardCount !== expectedCards) {
    failures.push(
      `${file}: found ${cardCount} literal <div class="speak-card"> occurrences in source, expected exactly ${expectedCards} ` +
        `(one per data-driven .map() block: Upcoming and Recent). A hardcoded card was likely added outside src/data/speaking.ts.`,
    );
  }
}

// --- 2. Reading names: these strings may only appear in src/data/reading.ts.
// If any shows up elsewhere in src/**/*.astro or src/**/*.ts, it was typed
// by hand instead of read from the data module.
const READING_TERMS = ['Heffernan', 'Levinson', 'Slouka', 'Tett', 'McGilchrist', 'Sutherland', 'EU AI Act'];
const READING_SOURCE = 'src/data/reading.ts';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (name.endsWith('.astro') || name.endsWith('.ts')) {
      out.push(full);
    }
  }
  return out;
}

for (const absPath of walk(SRC)) {
  const relPath = relative(ROOT, absPath);
  if (relPath === READING_SOURCE) continue;

  const text = readFileSync(absPath, 'utf8');
  for (const term of READING_TERMS) {
    const re = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`);
    if (re.test(text)) {
      failures.push(
        `${relPath}: contains "${term}" outside ${READING_SOURCE} — reading names must render from the shared data module, not be typed directly into a page.`,
      );
    }
  }
}

// --- 3. The three reading surfaces must actually import from the data module
// (guards against someone hardcoding a paraphrase that dodges the term list
// above while still bypassing readingItems).
const READING_IMPORT_FILES = ['src/pages/now.astro', 'src/pages/index.astro', 'src/data/now.ts'];
for (const file of READING_IMPORT_FILES) {
  const text = read(file);
  if (!text.includes("from '../data/reading'") && !text.includes("from './reading'")) {
    failures.push(`${file}: does not import from the reading data module — expected a Reading section or teaser to render from src/data/reading.ts.`);
  }
}

if (failures.length) {
  console.error('Data-sourcing check failed:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log('Data-sourcing check passed (speaking cards and reading names all trace to src/data/).');
