// Bibliographic review against authority records (V5.25). Needs network access.
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/authority-review/run.mjs
// Intermediate files are cached in .cache/authority-review; delete it to start over.
//  1. wikipedia-titles  Spanish Wikipedia titles → Wikidata items
//  2. entities          item claims; a match is kept only if birth/death years agree (±2)
//  3. sparql-names      SPARQL: exact Spanish/English names and aliases; accepted on dates or relatives
//  4. wikidata-search   Wikidata search for the rest, same acceptance rules
//  5. matched-claims    claims for items matched by SPARQL
//  6. gnd               GND authority records from lobid.org
//  7. build             claim reviews: same year, same linked person or same office and years
//  8. emit              src/evidence/authorityReviews.js and the discrepancy list
// Shared helpers live in http.mjs; government-keywords.mjs maps territories to GND wording.
import fs from 'node:fs';
const cache = new URL('../../../.cache/authority-review/', import.meta.url);
fs.mkdirSync(cache, {recursive: true});
process.chdir(cache.pathname);
for (const step of ['wikipedia-titles', 'entities', 'sparql-names', 'wikidata-search', 'matched-claims', 'gnd', 'build', 'emit']) {
  console.log(`— ${step}`);
  await import(new URL(`./${step}.mjs`, import.meta.url));
}
