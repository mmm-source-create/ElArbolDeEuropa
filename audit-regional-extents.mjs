import fs from 'node:fs';
import {reviewedLayerLocations, reviewedMapLayers} from './src/data/locationMapPilot.js';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const data = read('./prototypes/euv-locations/corridor-locations.json');
const review = read('./prototypes/euv-locations/regional-extent-review.json');
const inventory = read('./prototypes/euv-locations/regional-extent-cells.json');
const original = read('./prototypes/euv-locations/extended-corridors-locations.json');
const areas = new Map(inventory.cells.map(cell => [cell.id, cell.area]));
const layers = new Map(reviewedMapLayers(data).map(layer => [layer.name, layer]));
const metrics = ids => ({cells: ids.length, svgArea: +ids.reduce((sum, id) => sum + (areas.get(id) || 0), 0).toFixed(5),
  unmeasured: ids.filter(id => !areas.has(id))});
const corrected = (name, year) => metrics(reviewedLayerLocations(data, layers.get(name), year));
const rows = review.replacements.map(replacement => {
  const old = original.temporalExtensions.find(layer => layer.name === replacement.name);
  const oldVersion = old?.versions.filter(version => version.from <= 1651).at(-1);
  return {name: replacement.name, previous1651: metrics(oldVersion?.ids || []),
    corrected1651: corrected(replacement.name, 1651), sources: replacement.sources};
});
const report = {reviewedAt: review.reviewedAt, units: inventory.units,
  measuredCells: inventory.cells.length, series: rows,
  regionalLayers: review.territories.map(layer => ({name: layer.name, coverage: layer.coverage,
    cuts: layer.versions.map(version => ({year: version.from, ...corrected(layer.name, version.from), event: version.event})),
    sources: layer.sources})), limitations: review.limitations};
fs.writeFileSync(new URL('./audit-regional-extents-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
for (const row of rows.filter(row => row.corrected1651.cells))
  console.log(`${row.name}: ${row.previous1651.cells} → ${row.corrected1651.cells} celdas; superficie SVG ${row.previous1651.svgArea} → ${row.corrected1651.svgArea}`);
const failures = [...rows.map(row => row.corrected1651), ...report.regionalLayers.flatMap(layer => layer.cuts)]
  .flatMap(row => row.unmeasured);
if (failures.length) throw new Error(`Missing spatial measurements: ${[...new Set(failures)].join(', ')}`);
