import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {atlasPoliticalMosaicAt, atlasMosaicPalette} from '../../src/data/atlasMosaic.js';
import {auditReportPath} from '../lib/project-paths.mjs';
import {territorialIdentity} from '../../src/data/territorialIdentity.js';

// A region needs coverage for every cell in every year, including cells that
// receive color elsewhere in time. The global never-colored list cannot prove it.
export function auditRegionalContinuity(data, inventory, review) {
  const {scope} = review;
  const visible = new Set(inventory.cells.filter(cell => cell.visible).map(cell => cell.id));
  const palette = atlasMosaicPalette(data);
  const missingGeometry = scope.ids.filter(id => !visible.has(id));
  const rows = new Map(scope.ids.map(id => [id, {id, coloredYears: 0, gaps: [],
    mixedYears: 0, unexplainedOverlaps: [], missingEvidence: [], changes: []}]));
  let missingCellYears = 0, unexplainedCellYears = 0, missingEvidenceYears = 0;
  for (let year = scope.from; year <= scope.through; year++) {
    const mosaic = atlasPoliticalMosaicAt(data, year, palette);
    for (const [id, row] of rows) {
      const layers = mosaic.byLocation.get(id) || [];
      const identities = layers.map(layer => layer.entityId).sort();
      const previous = row.changes.at(-1);
      if (!previous || JSON.stringify(previous.identities) !== JSON.stringify(identities))
        row.changes.push({from: year, identities});
      if (!layers.length) {row.gaps.push(year); missingCellYears++; continue;}
      row.coloredYears++;
      if (layers.length > 1) {
        row.mixedYears++;
        const explanation = review.allowedMixedCells.find(item => item.id === id
          && item.from <= year && year <= item.through
          && identities.every(identity => item.identities.map(territorialIdentity).includes(identity))
          && item.note && item.sourceKeys.every(key => review.sources[key]?.locator));
        if (!explanation) {row.unexplainedOverlaps.push(year); unexplainedCellYears++;}
      }
      // Inspect sources for this cell, not sources inherited from another
      // constituent province after territorial identity coalescing.
      for (const layer of layers) {
        const local = (layer.scopes || []).filter(item => item.ids.includes(id));
        if (!local.length || local.some(item => !item.note || !item.sources.length
          || item.sources.some(source => !source.url?.startsWith('https://') || !source.locator))) {
          row.missingEvidence.push(year); missingEvidenceYears++; break;
        }
      }
    }
  }
  return {reviewedAt: review.reviewedAt, scope, method: 'Every scoped SVG cell in every annual laboratory mosaic, after dated exclusions, regional precedence and identity coalescing; local evidence and explicitly documented mixed cells checked separately.',
    summary: {cells: scope.ids.length, years: scope.through - scope.from + 1,
      cellYears: scope.ids.length * (scope.through - scope.from + 1),
      missingCellYears, unexplainedCellYears, missingEvidenceYears, missingGeometry},
    cells: [...rows.values()], neighborFindings: review.neighborFindings, limitations: review.limitations};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
  for (const [reviewFile, output] of [
    ['bosnia-hum-review.json', 'audit-regional-continuity-report.json'],
    ['posavina-ragusa-review.json', 'audit-posavina-ragusa-report.json'],
  ]) {
    const report = auditRegionalContinuity(read('../../prototypes/euv-locations/corridor-locations.json'),
      read('../../prototypes/euv-locations/location-inventory.json'), read('../../prototypes/euv-locations/' + reviewFile));
    fs.writeFileSync(auditReportPath(output), JSON.stringify(report, null, 2) + '\n');
    console.log(report.scope.name + ': ' + JSON.stringify(report.summary));
    if (report.summary.missingCellYears || report.summary.unexplainedCellYears
      || report.summary.missingEvidenceYears || report.summary.missingGeometry.length)
      throw new Error('Incomplete regional continuity or undocumented attribution');
  }
}
