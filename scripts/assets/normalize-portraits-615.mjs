// 6.0.15: tidies the credits that select-portraits-615.mjs reads from Commons:
// readable dates (upload dates are dropped), placeholder authors, the
// photographer of a CC-licensed photo moved to the licence credit, and kinds
// the file name could not tell.
// Usage: node scripts/assets/normalize-portraits-615.mjs
import fs from 'node:fs';

const FILE = 'scripts/assets/sources/portraits-615.json';
const meta = JSON.parse(fs.readFileSync(FILE, 'utf8'));
// Kinds checked on the contact sheet of the 100 images.
const SEAL = ['Sello', 'Seal'], SCULPTURE = ['Escultura', 'Sculpture'], MINIATURE = ['Miniatura', 'Miniature'], PRINT = ['Grabado', 'Engraving'];
const KIND_FIXES = {SALADIN: ['Moneda', 'Coin'], LUIS6FRA: MINIATURE, LUIS7FRA: MINIATURE, ALEXANDER2SCOT: SEAL, HAAKON4NOR: SEAL,
  GIORGI5GEO: SCULPTURE, SANCHO4: SCULPTURE, SANCHO1MALL: SCULPTURE, ARTOGKAVANAGH: MINIATURE, ALEXANDER3SCOT: MINIATURE,
  CONRADO4HOH: PRINT, MINDAUGASLIT: PRINT, TEOB1NAV: PRINT, ROSTOMKARTLI: ['Dibujo', 'Drawing'], ROBERT1BRUCE: SCULPTURE};
// Commons user names given as authors of public-domain files.
const USERNAMES = new Set(['ILoveHirasawaYui', 'le_serbe', 'Surprizi', 'ClintMalpaso']);
// Haakon IV: a 1924 drawing of his seal; the 1247 date belongs to the seal.
const DROP_DATE = new Set(['HAAKON4NOR']);
const PLACEHOLDER = /^(old|various|unknown|anonymous|public domain|this image|original:|\d{4}-\d{4} artist|digitized)/i;
const roman = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'][n];
// Already tidied values are kept as they are, so the script can run again.
const TIDY = /^(siglo |c\. |después de |época |Baja Edad Media|\d{3,4}(–\d{3,4})?$)/;
function dates(raw, english) {
  if (/undefined/.test(String(raw || ''))) raw = '20 th century';
  else if (TIDY.test(String(raw || '')) && !(Number(String(raw).slice(0, 4)) >= 1900)) return {es: raw, en: english || raw};
  let text = String(raw || '').replace(/Original work of art:\s*/i, '').replace(/\.$/, '').trim();
  if (!text || /^unknown/i.test(text) || /^x\s/.test(text)) return null;
  // Upload or photograph dates say nothing about the work.
  const iso = text.match(/^(\d{4})-\d{2}(-\d{2})?/);
  if (iso && Number(iso[1]) >= 1900) return null;
  if (iso) text = iso[1];
  const century = text.match(/^(?:probably\s+)?(\d{1,2})\s*th[- ]century/i);
  if (century) return {es: `siglo ${roman(Number(century[1]))}`, en: `${century[1]}th century`};
  if (/^late byzantine/i.test(text)) return {es: 'época bizantina tardía', en: 'late Byzantine period'};
  if (/^late medieval/i.test(text)) return {es: 'Baja Edad Media', en: 'late Middle Ages'};
  const between = text.match(/^between (?:circa )?(\d{3,4}) and (?:circa )?(\d{3,4})/i);
  if (between) return {es: `c. ${between[1]}–${between[2]}`, en: `c. ${between[1]}–${between[2]}`};
  const circa = text.match(/^(?:circa|c\.|ca\.)\s*(\d{3,4})/i);
  if (circa) return {es: `c. ${circa[1]}`, en: `c. ${circa[1]}`};
  const after = text.match(/^after (\d{4})/i);
  if (after) return {es: `después de ${after[1]}`, en: `after ${after[1]}`};
  const year = text.match(/^(\d{3,4})(?:[–-](\d{3,4}))?\b/);
  // A year from 1900 on is the date of a photograph or a later drawing.
  if (year && Number(year[1]) >= 1900) return null;
  if (year) return year[2] ? {es: `${year[1]}–${year[2]}`, en: `${year[1]}–${year[2]}`} : {es: year[1], en: year[1]};
  return null;
}
for (const [id, entry] of Object.entries(meta)) {
  const when = DROP_DATE.has(id) ? null : dates(entry.es.fecha, entry.en.fecha);
  if (when) { entry.es.fecha = when.es; entry.en.fecha = when.en; } else { delete entry.es.fecha; delete entry.en.fecha; }
  let author = entry.es.autor.replace(/^(User|Creator):/, '').replace(/^(Painter|Drawing by)\s+/, '').trim();
  // Uploaders' user names, links and notes are not the author of the work.
  if (PLACEHOLDER.test(author) || /uploader|https?:|^\W*$/.test(author) || (!entry.derechos && USERNAMES.has(author))) author = 'Autor desconocido';
  // A CC-licensed photograph credits its photographer in the licence line.
  if (entry.derechos && author !== 'Autor desconocido') {
    entry.derechos = `${entry.derechos.replace(/ · .*$/, '')} · ${author}`;
    if (!when) author = 'Autor desconocido';
  }
  // «After X» marks a copy after a painter: «Según X» in Spanish.
  entry.es.autor = author.replace(/^(After|Según) /, 'Según ');
  entry.en.autor = author === 'Autor desconocido' ? 'Unknown author' : author.replace(/^(After|Según) /, 'After ');
  if (KIND_FIXES[id]) [entry.es.tipo, entry.en.tipo] = KIND_FIXES[id];
}
fs.writeFileSync(FILE, `${JSON.stringify(meta, null, 2)}\n`);
console.log(`Normalizados ${Object.keys(meta).length}`);

// Work titles: Commons markup («label QS:…») removed and long catalogue
// descriptions cut at the first sentence or bracket.
export const cleanWork = text => {
  let out = String(text || '').replace(/\s*label QS:.*$/i, '').replace(/[\s.]+$/, '').trim();
  if (out.length > 80) out = out.split(/(?<=\w)\.\s|\s\(/)[0].trim();
  if (out.length > 80) out = `${out.slice(0, 77).replace(/\s+\S*$/, '')}…`;
  return out;
};
const works = JSON.parse(fs.readFileSync(FILE, 'utf8'));
for (const entry of Object.values(works)) { entry.es.obra = cleanWork(entry.es.obra); entry.en.obra = cleanWork(entry.en.obra); }
fs.writeFileSync(FILE, `${JSON.stringify(works, null, 2)}\n`);
for (const generated of ['src/data/imagenesPersonas615.js', 'src/features/english/portraits615.js']) {
  if (!fs.existsSync(generated)) continue;
  const source = fs.readFileSync(generated, 'utf8');
  fs.writeFileSync(generated, source.replace(/"obra": "((?:[^"\\]|\\.)*)"/g, (_, value) => `"obra": ${JSON.stringify(cleanWork(JSON.parse(`"${value}"`)))}`));
}
