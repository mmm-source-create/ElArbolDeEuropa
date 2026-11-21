// 6.0.10 one-off: corrects machine translations left in the English batches
// (src/features/english/v6/batch-*). Place names translated as common words,
// source titles reduced to «Reg.», and garbled government classes. Run once,
// then `npm run prebuild`. Prints what it changed.
import fs from 'node:fs';
import path from 'node:path';
import {PERSONAS} from '../../src/data/personas.js';

const root = new URL('../../src/features/english/v6/', import.meta.url).pathname;

// Label maps: key → correct English value, applied wherever the key appears.
export const KEY_FIXES = {
  Anhalt: 'Anhalt', 'Beloózero': 'Beloozero', 'Chobánidas': 'Chobanids', Lacio: 'Latium', Samtsje: 'Samtskhe', Sirmia: 'Syrmia', Tesalia: 'Thessaly',
  Vidin: 'Vidin', Squillace: 'Squillace', Bisceglie: 'Bisceglie',
  margraviato: 'Margraviate', variantes: 'Variants',
  gran_ducado: 'Grand duchy', 'señorío': 'Lordship', landgraviato: 'Landgraviate', zarato: 'Tsardom',
  'Cara de Fuego': 'Fiery Face',
  'Judicado de Torres': 'Judicate of Torres',
  'Duque pretendiente': 'Claimant duke',
  'La reina niña': 'The child queen',
  'Los reyes cruzados': 'The crusader kings',
  'Heredera de Breda': 'Heiress of Breda',
  'Mariscal / Defensor de Viena': 'Marshal / Defender of Vienna',
  'Treccani · Manuel Filiberto de Saboya': 'Treccani · Emmanuel Philibert of Savoy',
  'Treccani · Luis de Saboya': 'Treccani · Louis of Savoy',
  'Treccani · Guillermo VIII de Monferrato': 'Treccani · William VIII of Montferrat',
  'Treccani · Pedro II de Saboya': 'Treccani · Peter II of Savoy',
  'Treccani · Irene de Monferrato': 'Treccani · Irene of Montferrat',
  'Treccani · Beatriz de Saboya': 'Treccani · Beatrice of Savoy',
  'Treccani · Tomás I de Saboya': 'Treccani · Thomas I of Savoy',
  'Treccani · Tomás II de Saboya': 'Treccani · Thomas II of Savoy',
  'Treccani · Fernando IV de Nápoles / III de Sicilia': 'Treccani · Ferdinand IV of Naples / III of Sicily',
  'Ernesto de Baviera-Múnich': 'Ernest of Bavaria-Munich',
  'Esteban II de Baviera': 'Stephen II of Bavaria',
  'Alberto VI de Baviera-Leuchtenberg': 'Albert VI of Bavaria-Leuchtenberg',
  'Auñamendi · Blanca de Artois': 'Auñamendi · Blanche of Artois',
  'Neue Deutsche Biographie · Isabel de Tirol': 'Neue Deutsche Biographie · Elisabeth of Carinthia',
  'Archives départementales de l’Eure · Domaine d’Évreux': 'Archives départementales de l’Eure · Domaine d’Évreux',
  'Juez de Judicado de Torres, 1218–1232. Juez.': 'Judge of Torres, 1218–1232.',
  'Juez de Judicado de Torres, 1232–1236. Juez.': 'Judge of Torres, 1232–1236.',
};
// Substrings inside any English text.
export const TEXT_FIXES = [
  ["It 's squirting .", 'Squillace'],
  ['Other articles of heading No.', 'Bisceglie'],
  ['I saw it.', 'Vidin'],
  ['Louis V of the Palatinate of Torres', 'Judicate of Torres'],
  ['Judge of Reg of Torres, 1218-1232. Judge.', 'Judge of Torres, 1218–1232.'],
  ['Judge at Reg., 1232-1236. Judge.', 'Judge of Torres, 1232–1236.'],
  ['Fur of Fire', 'Fiery Face'],
  ['Prosecuting Duke', 'Claimant duke'],
  ['The cross kings', 'The crusader kings'],
  ['The Queen girl', 'The child queen'],
  ["Breda's heir", 'Heiress of Breda'],
  ['Isabel de Trol', 'Elisabeth of Carinthia'],
  ['Ernesto de Bavaria - Munich', 'Ernest of Bavaria-Munich'],
  ['Esteban II de Bavaria', 'Stephen II of Bavaria'],
  ['Alberto VI de Bavaria-Leuchtenberg', 'Albert VI of Bavaria-Leuchtenberg'],
  ['Añamendi', 'Auñamendi'],
  ['Treccani · Beatriz de Savoy', 'Treccani · Beatrice of Savoy'],
  ['Treccani · Tomas I de Savoy', 'Treccani · Thomas I of Savoy'],
  ['Treccani · Tomas II de Savoy', 'Treccani · Thomas II of Savoy'],
  ['The following are the following:', 'Archives départementales de l’Eure · Domaine d’Évreux'],
  ['Deutsche NationalBibliothek', 'Deutsche Nationalbibliothek'],
];
// «Treccani · Dogado de X» became «Domado de X», «X Dogado» or «Dogado by X».
const DOGESHIP = /^Treccani · Dogado de (.+)$/;
// Government classes: Spanish class → English label.
export const CLASS_EN = {reinado: 'Kingship', ducado: 'Duchy', condado: 'County', gobierno: 'Government', principado: 'Principality', 'señorío': 'Lordship', zarato: 'Tsardom', gran_ducado: 'Grand duchy', landgraviato: 'Landgraviate', margraviato: 'Margraviate', vizcondado: 'Viscounty', estatuderato: 'Stadtholderate', banato: 'Banate', marquesado: 'Marquisate', voivodato: 'Voivodeship', electorado: 'Electorate', imperio: 'Empire', pontificado: 'Pontificate', regencia: 'Regency', sultanato: 'Sultanate', emirato: 'Emirate', despotado: 'Despotate'};
const GARBLED_CLASSES = {ducat: 'ducado', Duct: 'ducado', 'great _ ducado': 'gran_ducado', large_ducted: 'gran_ducado', 'Your Honor.': 'señorío', 'Your honor.': 'señorío', 'Your honor': 'señorío', 'My lord': 'señorío', whispering: 'zarato', zarate: 'zarato', tipoctipride: 'landgraviato', Statuderate: 'estatuderato', Viscounted: 'vizcondado', Other: 'margraviato'};
const governments = new Map();
for (const p of PERSONAS) for (const g of p.gobiernos || []) {
  const key = `${p.id}|${g.desde}|${g.hasta}`;
  governments.set(key, governments.has(key) ? null : g);
}

const changes = new Map();
const count = label => changes.set(label, (changes.get(label) || 0) + 1);
function fixText(value) {
  let out = value;
  for (const [bad, good] of TEXT_FIXES) if (out.includes(bad)) { out = out.split(bad).join(good); count(`${bad} → ${good}`); }
  // Summaries «connected with Other» name Latium (Farnese) or Beloozero (Rurikids).
  if (out.includes('Farnesio dynasty') && out.includes('connected with Other.')) { out = out.replace('connected with Other.', 'connected with Latium.'); count('Other → Latium'); }
  if (out.includes('connected with Other, Moscow.')) { out = out.replace('connected with Other, Moscow.', 'connected with Beloozero, Moscow.'); count('Other → Beloozero'); }
  return out;
}
function walk(node, parentKey) {
  if (Array.isArray(node)) return node.map(item => walk(item, parentKey));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string' && Object.hasOwn(KEY_FIXES, key) && value !== KEY_FIXES[key]) { out[key] = KEY_FIXES[key]; count(`${key}: ${value} → ${KEY_FIXES[key]}`); continue; }
      if (typeof value === 'string' && DOGESHIP.test(key)) { const fixed = `Treccani · The dogeship of ${key.match(DOGESHIP)[1]}`; if (value !== fixed) count('Treccani dogeship'); out[key] = fixed; continue; }
      if (key === 'clase' && Object.hasOwn(GARBLED_CLASSES, value)) {
        const match = node.persona?.id && governments.get(`${node.persona.id}|${node.desde}|${node.hasta}`);
        out[key] = CLASS_EN[match?.clase] || CLASS_EN[GARBLED_CLASSES[value]];
        count(`clase ${value} → ${out[key]}`);
        continue;
      }
      out[key] = typeof value === 'string' ? fixText(value) : walk(value, key);
    }
    // Titles reduced to «Reg.»: Starhemberg's office and a Treccani entry.
    if (out.titulo === 'Reg.' && out.id === 'STARHEMBERG') { out.titulo = 'Marshal / Defender of Vienna'; count('Starhemberg title'); }
    if (out.titulo === 'Reg.' && /treccani\.it\/enciclopedia\/ferdinan/.test(out.url || '')) { out.titulo = 'Treccani · Ferdinand IV of Naples / III of Sicily'; count('Treccani Ferdinand'); }
    return out;
  }
  return typeof node === 'string' ? fixText(node) : node;
}

for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-')).sort()) {
  for (const file of fs.readdirSync(path.join(root, batch)).filter(name => name.endsWith('.json'))) {
    const full = path.join(root, batch, file), text = fs.readFileSync(full, 'utf8');
    const data = JSON.parse(text);
    const indent = text.startsWith('{\n') || text.startsWith('[\n') ? 2 : undefined;
    if (`${JSON.stringify(data, null, indent)}\n` !== text) throw new Error(`Formato inesperado: ${batch}/${file}`);
    const fixed = walk(data);
    const out = `${JSON.stringify(fixed, null, indent)}\n`;
    if (out !== text) fs.writeFileSync(full, out);
  }
}
for (const [label, n] of [...changes].sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(4), label);
