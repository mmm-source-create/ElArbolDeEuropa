// Generate the dated succession from the Atlas, keeping the geographic
// crosswalk separate from the historical claim that a person held a title.
import fs from 'node:fs';
import { PERSONAS } from '../../src/personas.jsx';
import { idsDeReinoEnAño } from '../../src/Territorios.jsx';

const succession = [
  { id: 'FEL3BORG', from: 1419, through: 1466 },
  { id: 'CAR1BORG', from: 1467, through: 1476 },
  { id: 'MARIABORG', from: 1477, through: 1481 },
  { id: 'FEL1CAST', from: 1482, through: 1505 },
  { id: 'CARLOS5', from: 1506, through: 1555 },
];
const territories = new Set([
  'Borgoña', 'Flandes', 'Brabante', 'Limburgo', 'Holanda', 'Henao',
  'Zelanda', 'Namur', 'Luxemburgo', 'Artois', 'Condado de Borgoña',
  'Auxerre', 'Ponthieu', 'Güeldres', 'Frisia', 'Utrecht', 'Overijssel',
  'Drente', 'Groninga',
]);

const people = succession.map(({ id, from, through }) => {
  const person = PERSONAS.find(item => item.id === id);
  if (!person) throw new Error(`Missing Atlas person ${id}`);
  const governments = (person.gobiernos || []).flatMap(government => {
    if (!territories.has(government.territorio) ||
        !['efectivo', 'rama', 'regencia'].includes(government.condicion) ||
        government.hasta < from || government.desde > through) return [];
    const start = Math.max(government.desde, from);
    const end = Math.min(government.hasta, through);
    const versions = [];
    for (let year = start; year <= end; year++) {
      // Ponthieu has a polygon in the old SVG but is omitted from REINO_A_IDS.
      const oldIds = government.territorio === 'Ponthieu'
        ? ['Ponthieu'] : idsDeReinoEnAño(government.territorio, year);
      if (!versions.length || JSON.stringify(oldIds) !== JSON.stringify(versions.at(-1).oldIds)) {
        versions.push({ from: year, oldIds });
      }
    }
    return [{ territory: government.territorio, from: start, through: end,
      condition: government.condicion, versions }];
  });
  // The person data use the same calendar year for the end of a regency and
  // the beginning of personal rule. A year-end map must choose one state.
  for (const government of governments) {
    const next = governments.find(other => other !== government &&
      other.territory === government.territory && other.from > government.from);
    if (next && government.through >= next.from) government.through = next.from - 1;
  }
  // The current person records do not represent these two jurisdictions as
  // separate offices. Both are labelled as local additions, with sources.
  governments.push({ territory: 'Señorío de Malinas', from, through,
    condition: 'local-supplement', versions: [{ from, oldIds: [] }] });
  if (id === 'FEL3BORG' || id === 'CAR1BORG') {
    governments.push({ territory: 'Condado de Charolais', from, through,
      condition: 'local-supplement', versions: [{ from, oldIds: [] }] });
    governments.push({ territory: 'Condado de Mâcon', from: Math.max(from, 1435), through,
      condition: 'local-supplement', versions: [{ from: Math.max(from, 1435), oldIds: [] }] });
  }
  if (id === 'FEL1CAST' || id === 'CARLOS5') {
    governments.push({ territory: 'Condado de Charolais', from: Math.max(from, 1493), through,
      condition: 'local-supplement', versions: [{ from: Math.max(from, 1493), oldIds: [] }] });
  }
  if (id === 'CARLOS5') governments.push({ territory: 'Tournaisis', from: 1521,
    through, condition: 'local-supplement', versions: [{ from: 1521, oldIds: [] }] });
  if (id === 'CARLOS5') governments.push({ territory: 'Señorío de Cuijk', from: 1509,
    through, condition: 'señorío superior; empeñado a los Egmond desde 1517 hasta 1549',
    versions: [{ from: 1509, oldIds: [] }] });
  return { id, name: person.nombre, from, through, governments,
    status: id === 'FEL1CAST' ? [
      { from: 1482, through: 1493, label: 'Heredero menor; gobierno ejercido mediante regencias' },
      { from: 1494, through: 1505, label: 'Gobierno personal' },
    ] : [] };
});

const output = new URL('./burgundian-source.json', import.meta.url);
fs.writeFileSync(output, `${JSON.stringify({ basis: 'Atlas PERSONAS + year-end succession rule', people }, null, 2)}\n`);
console.log(`Wrote ${people.length} people to ${output.pathname}`);
