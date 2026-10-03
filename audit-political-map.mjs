import fs from 'node:fs/promises';
import { PERSONAS } from './src/personas.jsx';
import { REINO_A_IDS } from './src/Territorios.jsx';
import { TERRITORIOS, gobiernoEfectivo } from './src/data/territorios.js';

const svg = await fs.readFile(new URL('./src/MapChart_Map.svg', import.meta.url), 'utf8');
const pathIds = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
const usedTerritories = new Set(PERSONAS.flatMap(persona => (persona.gobiernos || [])
  .filter(gobiernoEfectivo).map(gobierno => gobierno.territorio)));
const withoutGeometry = [...usedTerritories]
  .filter(name => TERRITORIOS[name]?.naturaleza !== 'agrupacion' && !(REINO_A_IDS[name] || []).some(id => pathIds.has(id)))
  .sort((a, b) => a.localeCompare(b, 'es'));
const missingPathIds = Object.entries(REINO_A_IDS).flatMap(([territory, ids]) =>
  ids.filter(id => !pathIds.has(id)).map(id => ({ territory, id })));

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
  scope: 'Revisión automática de geometría y continuidad de cargos; las advertencias requieren comprobación histórica individual.',
  totals: { pathIds: pathIds.size, activeGovernmentTerritories: usedTerritories.size, doges: doges.length },
  withoutGeometry,
  missingPathIds,
  venetianDogado: { from: 1400, to: 1605, gaps: dogeGaps, overlapsLongerThanTransitionYear: dogeOverlaps },
};
await fs.writeFile(new URL('./audit-political-map-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(`Mapa político: ${pathIds.size} regiones SVG · ${withoutGeometry.length} gobiernos sin geometría · ${missingPathIds.length} etiquetas inexistentes · ${dogeGaps.length} años sin dogo (1400–1605)`);
if (process.argv.includes('--fail-on-errors') && (dogeGaps.length || dogeOverlaps.length)) process.exitCode = 1;
