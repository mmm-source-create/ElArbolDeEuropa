// 6.0.22 · Writes docs/versiones/6.0.22-fechas.md from the date cross-check (.cache/dates622.json), the
// DBE discrepancies (.cache/rah/discrepancies.json) and the five corrections of src/evidence/reviews622.js.
import fs from 'node:fs';
const root = new URL('../../.cache/', import.meta.url);
const {corrections: candidates, conflicts} = JSON.parse(fs.readFileSync(new URL('dates622.json', root)));
const rah = JSON.parse(fs.readFileSync(new URL('rah/discrepancies.json', root)));
const {DATE_CORRECTIONS_622} = await import('../../src/evidence/reviews622.js');
const {PERSONAS} = await import('../../src/data/personas.js');
const name = id => PERSONAS.find(p => p.id === id)?.nombre || id;
const word = k => k === 'birth' ? 'Nacimiento' : 'Fallecimiento';
// Candidates read one by one and not applied: a major reference work, not among the downloaded sources,
// keeps the Atlas year, or scholarship gives both years.
const DECLINED = {
  'JAIME1MARCH:death': 'Murió de las heridas de Brignais (6 de abril de 1362); la BnF da 1361.',
  'INGEBORGDIN:death': 'La historiografía da 1237 o 1238; la GND y la LoC, 1236. Queda pendiente.',
  'ENRIQ5ING:birth': 'El Oxford Dictionary of National Biography da 1386; la GND y la BnF, 1387.',
  'PEDRO2AR:birth': 'La historiografía aragonesa da 1178 (Huesca); la GND y la BnF, 1174.',
  'JUANASEYMOUR:birth': 'El año es incierto (1508 o 1509) en la historiografía inglesa.',
  'STEFANFIRSTSER:death': 'La historiografía serbia da 1228; la GND y la LoC, 1227.',
  'BAYEZID2OSM:birth': 'Las fuentes otomanas dan diciembre de 1447; la GND y la BnF, 1448.',
  'ARTHUR2BRET:birth': 'Medieval Lands sigue una crónica (1262); otras obras dan el 2 de julio de 1261.',
  'ROB3FLAND:birth': 'La historiografía flamenca da 1249; la GND y la BnF, 1246.',
};
const lines = ['# 6.0.22 · Fechas comprobadas con varias fuentes', '',
  'Se compararon los años de nacimiento y muerte del Atlas con todas las fuentes descargadas:',
  '- Medieval Lands;',
  '- las fichas de la GND, la BnF y la Library of Congress;',
  '- el Diccionario Biográfico Español de la Real Academia de la Historia.', '',
  'Solo cuentan los años que la fuente da sin duda.', '',
  '**Regla.** Comprobada la identidad de la persona (el otro año de vida o un progenitor coinciden), se corrige la fecha del Atlas cuando se cumplen tres condiciones:',
  '- ninguna fuente da el año del Atlas;',
  '- todas las fuentes que dan el año coinciden en otro;',
  '- ese otro año lo dan dos fuentes independientes, o una que da la fecha completa.', '',
  '## Fechas corregidas', '', '| Persona | Dato | Antes | Ahora |', '|---|---|---:|---:|'];
for (const [id, c] of Object.entries(DATE_CORRECTIONS_622)) { const [, p, k] = id.split(':'); lines.push(`| ${name(p)} (\`${p}\`) | ${word(k)} | ${c.from} | ${c.to} |`); }
lines.push('', 'Cada corrección cita sus fuentes en la ficha. Cuando otra obra da un año distinto, figura como alternativa.', '',
  '## Candidatas leídas y no aplicadas', '', '| Persona | Dato | Atlas | Fuentes | Motivo |', '|---|---|---:|---|---|');
for (const c of candidates) { const reason = DECLINED[`${c.id}:${c.kind}`]; if (!reason) continue; lines.push(`| ${name(c.id)} (\`${c.id}\`) | ${word(c.kind)} | ${c.atlas} | ${c.year}: ${Object.keys(c.sources).join(', ')} | ${reason} |`); }
lines.push('', '## Fuentes que se contradicen entre sí', '', 'En estos casos las fuentes no coinciden, o una de ellas da el año del Atlas. No se cambia nada; quedan para revisión editorial.', '', '| Persona | Dato | Atlas | Años en las fuentes |', '|---|---|---:|---|');
for (const c of conflicts) lines.push(`| ${name(c.id)} (\`${c.id}\`) | ${word(c.kind)} | ${c.atlas} | ${Object.entries(c.years).map(([y, s]) => `${y}: ${s.join(', ')}`).join(' · ')}${c.documentedBy ? ` · el Atlas ya cita ${c.documentedBy}` : ''} |`);
lines.push('', '## Diccionario Biográfico Español frente al Atlas', '', 'Años del DBE distintos de los del Atlas, en biografías cuya identidad está comprobada. Varios son fechas que otra fuente ya documenta con el año del Atlas, y algunos parecen erratas del propio DBE: por ejemplo, Dionisio I de Portugal nacido en 1269 en lugar de 1261.', '', '| Persona | Dato | Atlas | DBE |', '|---|---|---:|---|');
for (const d of rah) lines.push(`| ${d.name} (\`${d.id}\`) | ${word(d.kind)} | ${d.atlas} | ${d.text} |`);
fs.writeFileSync(new URL('../../docs/versiones/6.0.22-fechas.md', import.meta.url), lines.join('\n') + '\n');
console.log('written', candidates.length, conflicts.length, rah.length);
