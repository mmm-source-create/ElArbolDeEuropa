// 6.0.13: the German completion audit fingerprints the whole common map every
// year. Later regional reviews that colour other parts of Europe change that
// fingerprint, so this script recomputes it from the map before the review,
// leaving out only the cells the review changes, and the audit compares the
// rest. Every other cell stays protected.
// Usage: node scripts/cartography/build-germany-preservation-exclusions.mjs <commit>
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {atlasPoliticalMosaicAt, atlasMosaicPalette} from '../../src/cartography/atlasMosaic.js';
import {mapDataFile, projectRoot} from '../lib/project-paths.mjs';
import {originalPreservationMap, preservationHash} from '../audits/audit-germany-completion.mjs';

const commit = process.argv[2];
if (!/^[0-9a-f]{40}$/.test(commit || '')) throw Error('Pass the full commit before the review');
const read = name => JSON.parse(fs.readFileSync(mapDataFile(name), 'utf8'));
const before = JSON.parse(execFileSync('git', ['show', `${commit}:data/cartography/corridor-locations.json`], {cwd: projectRoot, maxBuffer: 1 << 30}).toString());
const geography = read('germany-completion-baseline.json');
// Later reviews that colour other parts of Europe (6.0.13 North Atlantic,
// 6.0.14 Middle East and Central Asia).
const REVIEWS = {northAtlanticReview: 'north-atlantic-review.json', middleEastReview: 'middle-east-review.json'};
const ids = [...new Set(Object.values(REVIEWS).flatMap(file => read(file).scope.ids))].sort();
const excluded = new Set(ids);
const palette = atlasMosaicPalette(before);
const annualPreservation = {};
for (let year = 1200; year <= 1800; year++) {
  const retained = new Map(atlasPoliticalMosaicAt(before, year, palette).byLocation);
  for (const cell of geography.cells) if (cell.gaps.some(gap => gap.from <= year && year <= gap.through)) retained.delete(cell.id);
  const original = originalPreservationMap(retained, year);
  for (const id of excluded) original.delete(id);
  annualPreservation[year] = preservationHash(original);
}
fs.writeFileSync(mapDataFile('germany-completion-later-reviews.json'), `${JSON.stringify({
  schema: 1, commit, reviews: Object.keys(REVIEWS), ids,
  reason: 'Revisiones del Atlántico norte (6.0.13) y de Oriente Medio y Asia central (6.0.14), fuera del inventario alemán: colorean o reasignan solo sus celdas, que se excluyen de la huella global; el resto del mapa debe coincidir con el anterior a ambas revisiones.',
  annualPreservation,
}, null, 2)}\n`);
console.log(`Huellas recalculadas sin ${ids.length} celdas`);
