import fs from 'node:fs/promises';
import { PERSONAS } from './src/personas.jsx';
import { TERRITORIOS, gobiernoEfectivo } from './src/data/territorios.js';
import {atlasLocationIds} from './src/data/locationMapAudit.js';
import {mapAuthoritiesForPerson} from './src/data/mapAuthorities.js';

const svg = await fs.readFile(new URL('./prototypes/euv-locations/euv-locations-crop.svg', import.meta.url), 'utf8');
const pathIds = atlasLocationIds(svg);
const mapData = JSON.parse(await fs.readFile(new URL('./prototypes/euv-locations/corridor-locations.json', import.meta.url), 'utf8'));
mapData.burgundy = JSON.parse(await fs.readFile(new URL('./prototypes/euv-locations/burgundian-locations.json', import.meta.url), 'utf8'));
const usedTerritories = new Set(PERSONAS.flatMap(persona => (persona.gobiernos || [])
  .filter(gobiernoEfectivo).map(gobierno => gobierno.territorio)));
const mappedTerritories = new Set();
const missing = new Map();
for (const person of PERSONAS) for (const g of person.gobiernos || []) {
  if (!gobiernoEfectivo(g)) continue;
  const start = Math.max(g.desde, mapData.from), end = Math.min(g.hasta, mapData.through);
  if (start > end) continue;
  // Probe all geometry change dates within each mandate, as well as its start.
  const years = new Set([start, end, ...[...mapData.territories, ...mapData.additionalTerritories]
    .flatMap(layer => [layer,...(layer.temporalExtensions || [])].flatMap(entry => entry.versions.map(v => v.from))).filter(y => y >= start && y <= end),
    ...mapData.overrides.flatMap(o => [o.from, o.through + 1]).filter(y => y >= start && y <= end)]);
  for (const year of years) for (const entry of mapAuthoritiesForPerson(person, year, mapData)) {
    if (entry.ids.some(id => pathIds.has(id))) mappedTerritories.add(entry.territory);
    for (const id of entry.ids.filter(id => !pathIds.has(id))) missing.set(`${entry.territory}:${id}`, {territory: entry.territory, id});
  }
}
const withoutGeometry = [...usedTerritories].filter(name => TERRITORIOS[name]?.naturaleza !== 'agrupacion'
  && !mappedTerritories.has(name)).sort((a,b) => a.localeCompare(b,'es'));
const missingPathIds = [...missing.values()];

const doges = PERSONAS.flatMap(persona => (persona.gobiernos || [])
  .filter(g => g.territorio === 'Venecia' && g.titulo === 'Dogo' && gobiernoEfectivo(g))
  .map(g => ({ id: persona.id, name: persona.nombre, from: g.desde, to: g.hasta })));
const dogeGaps = [];
for (let year = 1400; year <= 1605; year += 1) {
  if (!doges.some(doge => doge.from <= year && year <= doge.to)) dogeGaps.push(year);
}
const dogeOverlaps = doges.flatMap((a, index) => doges.slice(index + 1)
  .filter(b => Math.min(a.to, b.to) - Math.max(a.from, b.from) >= 2)
  .map(b => ({ a: a.name, b: b.name, from: Math.max(a.from, b.from), to: Math.min(a.to, b.to) })));

const report = {
  generatedAt: new Date().toISOString(),
  scope: `EU V Locations, ${mapData.from}–${mapData.through}. Geometría de gobiernos y continuidad de cargos; las advertencias requieren revisión histórica individual.`,
  totals: { pathIds: pathIds.size, activeGovernmentTerritories: usedTerritories.size, doges: doges.length },
  withoutGeometry,
  missingPathIds,
  venetianDogado: { from: 1400, to: 1605, gaps: dogeGaps, overlapsLongerThanTransitionYear: dogeOverlaps },
};
await fs.writeFile(new URL('./audit-political-map-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(`Mapa político: ${pathIds.size} regiones SVG · ${withoutGeometry.length} gobiernos sin geometría · ${missingPathIds.length} etiquetas inexistentes · ${dogeGaps.length} años sin dogo (1400–1605)`);
if (process.argv.includes('--fail-on-errors') && (missingPathIds.length || dogeGaps.length || dogeOverlaps.length)) process.exitCode = 1;
