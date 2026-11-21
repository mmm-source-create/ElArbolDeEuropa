// 6.0.11 one-off: the generic English summaries of the v6 batches («Consort of
// the X dynasty. Her life was connected with Y, Z.») kept Spanish names and
// machine translations of houses and places. Only those two phrases change.
// Run once, then `npm run prebuild`.
import fs from 'node:fs';
import path from 'node:path';

const root = new URL('../../src/features/english/v6/', import.meta.url).pathname;
export const NAMES_611 = {
  Saboya: 'Savoy', 'Saboya-Carignano': 'Savoy-Carignano', Borgoña: 'Burgundy', 'Ivrea-Borgoña': 'Ivrea-Burgundy', 'Borgoña-Portugal': 'Burgundy-Portugal',
  Habsburgo: 'Habsburg', Capeto: 'Capet', Lorena: 'Lorraine', Brabante: 'Brabant', Luxemburgo: 'Luxembourg', Oldemburgo: 'Oldenburg',
  Hannover: 'Hanover', Prusia: 'Prussia', Núremberg: 'Nuremberg', Farnesio: 'Farnese', Médici: 'Medici', Borja: 'Borgia', Comneno: 'Komnenos',
  'Gedimínida': 'Gediminid', 'Jagellón': 'Jagiellon', 'Anjou-Hungría': 'Anjou-Hungary', Avís: 'Aviz', Borbon: 'Bourbon', Borbón: 'Bourbon',
  'Casa de Aragón': 'Aragon', 'Plantagenet-Lancaster': 'Lancaster', 'Plantagenet-York': 'York', 'Paleologa-Monferrato': 'Palaiologos-Montferrat',
  Pólotsk: 'Polotsk', Vladímir: 'Vladimir', 'Rus de Kiev': "Kievan Rus'", Tarento: 'Taranto', Urgel: 'Urgell', Orleans: 'Orléans',
  // Machine translations.
  'Holy Empire': 'the Holy Roman Empire', 'Pontifical States': 'the Papal States', Bisseglie: 'Bisceglie', Cléneris: 'Cleves',
  ArMagnac: 'Armagnac', Cléveris: 'Cleves', Clébéris: 'Cleves', Gandía: 'Gandia', Beloózero: 'Beloozero', Champaña: 'Champagne', Sandeverino: 'Sanseverino', "They'll know": 'Sabran', Angulem: 'Angoulême', Moldova: 'Moldavia',
};
// Garbled words fixed wherever they appear, and label values by key.
export const TEXT_611 = [
  ["They'll know.", 'Sabran'], ["They'll know", 'Sabran'], ['Sandeverino', 'Sanseverino'], ['Cléneris', 'Cleves'], ['Holy Empire', 'Holy Roman Empire'],
  ['Stretar dynasty - Naples', 'Trastámara-Naples dynasty'], ['Statamara', 'Trastámara'], ['Riary', 'Riario'], ['Great Chism', 'Great Schism'],
  ['Miguel Ángel, Rafael', 'Michelangelo, Raphael'], ['Thirty-Year War', "Thirty Years' War"], ['As July II', 'As Julius II'], ['Ali Bajá', 'Ali Pasha'], ['Ali Baja', 'Ali Pasha'],
];
const fixList = list => list.split(/(, | and )/).map(part => NAMES_611[part.trim()] ?? part).join('');
let changes = 0;
function fixText(text) {
  let out = text;
  for (const [bad, good] of TEXT_611) out = out.split(bad).join(good);
  out = out
    // «X, your/his trajectory is linked to Y.» → «X. Associated with Y.» The
    // Spanish «Su trayectoria» is neutral; the English gender was often wrong.
    .replace(/^Fraile, /, 'Friar. ')
    .replace(/(?:,? |^)(?:[Hh]is|[Hh]er|[Tt]heir|[Yy]our|[Ii]ts) (?:trajectory|career|life|path|track record) (?:is|was) (?:linked to|connected with) ([^.]+)\./g, (_, list) => `. Associated with ${fixList(list)}.`)
    .replace(/^\. /, '').replace(/\.\. Associated/g, '. Associated')
    // English names in the lists of places and in «of the X dynasty».
    .replace(/((?:connected|Associated) with )([^.]+)(\.)/g, (_, a, list, z) => a + fixList(list) + z)
    .replace(/( of the )([^.]+?)( dynasty\.)/g, (_, a, house, z) => a + (NAMES_611[house] ?? house) + z);
  if (out !== text) changes++;
  return out;
}
const walk = node => Array.isArray(node) ? node.map(walk) : node && typeof node === 'object'
  ? Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)])) : typeof node === 'string' ? fixText(node) : node;

for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-')).sort()) {
  for (const file of fs.readdirSync(path.join(root, batch)).filter(name => name.endsWith('.json'))) {
    const full = path.join(root, batch, file), text = fs.readFileSync(full, 'utf8');
    const indent = text.startsWith('{\n') || text.startsWith('[\n') ? 2 : undefined;
    const data = JSON.parse(text);
    if (`${JSON.stringify(data, null, indent)}\n` !== text) throw new Error(`Formato inesperado: ${batch}/${file}`);
    const out = `${JSON.stringify(walk(data), null, indent)}\n`;
    if (out !== text) fs.writeFileSync(full, out);
  }
}
console.log(`${changes} textos corregidos`);
