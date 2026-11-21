// 6.0.16 · Second authority review: GND, BnF and Library of Congress records. Needs network access.
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/authority-review/run616.mjs [step...]
// Matching reuses the V5.25 steps; the cache lives in .cache/sources-616.
import fs from 'node:fs';
const cache = new URL('../../../.cache/sources-616/', import.meta.url);
fs.mkdirSync(cache, {recursive: true});
process.chdir(cache.pathname);
const steps = process.argv.slice(2).length ? process.argv.slice(2)
  : ['wikipedia-titles', 'entities', 'sparql-names', 'wikidata-search', 'matched-claims', 'gnd', 'bnf', 'loc', 'build616', 'emit616'];
for (const step of steps) {
  console.log(`— ${step}`);
  await import(new URL(`./${step}.mjs`, import.meta.url));
}
