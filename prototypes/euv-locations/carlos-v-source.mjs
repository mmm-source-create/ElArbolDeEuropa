// Derive the dated jurisdictions from the Atlas rather than copying a static
// list of Carlos V's titles into the cartographic experiment.
import fs from 'node:fs';
import { PERSONAS } from '../../src/personas.jsx';
import { idsDeReinoEnAño } from '../../src/Territorios.jsx';

const person = PERSONAS.find(({ id }) => id === 'CARLOS5');
if (!person) throw new Error('CARLOS5 is absent from the Atlas');

const groups = {
  burgundian: new Set(['Flandes', 'Condado de Borgoña', 'Brabante', 'Limburgo', 'Holanda', 'Henao', 'Zelanda', 'Artois', 'Namur', 'Luxemburgo', 'Frisia', 'Utrecht', 'Overijssel', 'Drente', 'Groninga', 'Güeldres']),
  spanish: new Set(['Castilla', 'León', 'Aragón', 'Condado de Barcelona', 'Valencia', 'Mallorca', 'Cerdeña', 'Nápoles', 'Trinacria', 'Navarra', 'Milán']),
  austrian: new Set(['Austria', 'Austria Interior', 'Tirol']),
};
const excluded = new Set(['Borgoña', 'Alemania', 'Sacro Imperio']);
const reigns = person.gobiernos.flatMap(g => {
  if (excluded.has(g.territorio)) return [];
  if (!['efectivo', 'rama'].includes(g.condicion)) return [];
  const group = Object.entries(groups).find(([, territories]) => territories.has(g.territorio))?.[0];
  if (!group) throw new Error(`Unclassified jurisdiction: ${g.territorio}`);
  const versions = [];
  for (let year = g.desde; year <= Math.min(g.hasta, 1555); year++) {
    const ids = idsDeReinoEnAño(g.territorio, year);
    if (!versions.length || JSON.stringify(ids) !== JSON.stringify(versions.at(-1).oldIds)) {
      versions.push({ from: year, oldIds: ids });
    }
  }
  return [{ territory: g.territorio, group, from: g.desde, through: g.hasta,
    condition: g.condicion, scope: g.ambito || null, versions }];
});
// The Atlas has not yet modelled these two Low Countries jurisdictions as
// separate governments. Keep them explicit here instead of mislabelling
// Tournai as Flanders or Mechelen as Brabant.
reigns.push(
  { territory: 'Tournaisis', group: 'burgundian', from: 1521, through: 1555,
    condition: 'efectivo', scope: 'Tournai adquirida en 1521', versions: [{ from: 1521, oldIds: [] }] },
  { territory: 'Señorío de Malinas', group: 'burgundian', from: 1506, through: 1555,
    condition: 'efectivo', scope: 'Señorío distinto de Brabante', versions: [{ from: 1506, oldIds: [] }] },
);
const out = new URL('./carlos-v-source.json', import.meta.url);
fs.writeFileSync(out, `${JSON.stringify({ person: person.nombre, personId: person.id, reigns }, null, 2)}\n`);
console.log(`Wrote ${reigns.length} dated jurisdictions to ${out.pathname}`);
