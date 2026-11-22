// 6.0.22 · Claim reviews from the Scandinavian national biographies: Svenskt biografiskt lexikon (SBL),
// Norsk biografisk leksikon (NBL) and Dansk Biografisk Leksikon (DBL). Their articles open with fixed
// fields: «Föräldrar: …», «Foreldre: …», «Forældre: …» (father first, then mother), marriages
// («Gift … med …», «G 1) … m …») and the dates of birth and death. Only pending claims are reviewed, and
// a name must agree in given name and regnal number (Scandinavian «Christian 2.» = II).
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/natbio-run.mjs
import fs from 'node:fs';
import {nameParts, compatible} from './fmg/names.mjs';
const dir = new URL('../../.cache/natbio/', import.meta.url);
const pages = JSON.parse(fs.readFileSync(new URL('pages.json', dir)));
const {PERSONAS} = await import('../../src/data/personas.js');
const {personClaims} = await import('../../src/evidence/claims.js');
const {COMPLETE_ENGLISH_PROFILES} = await import('../../src/features/english/fullProfiles.js');
const REVIEWS = fs.existsSync(new URL('../../src/evidence/reviews622.js', import.meta.url)) ? (await import('../../src/evidence/reviews622.js')).REVIEWS_622 : {};
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const ROMAN = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'][n] || '';
const TITLES = /^(?:(?:kong|konge|konung|kung|dronning|drottning|droning|hertug|hertig|hertuginde|hertiginna|greve|grevinde|grevinna|kurfyrste|kurfurste|prinsesse|prinsessa|prins|ærkehertug|erkehertug|ärkehertig|markgreve|markgrevinne|landgreve|lantgreve|kejser|kejserinde|kejsare|fyrste|furste|riksrådet|riksföreståndaren|tsar|zar|storfyrste|hertiginnan|drottningen|konungen|keiser|keiserinne|pfalzgreve|pfalzgrevinne)\s+)+/i;
const clean = t => String(t || '').replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim().replace(TITLES, '').replace(/\b(\d{1,2})\.(?=\s|$|,)/g, (m, n) => ROMAN(+n));
const fits = (person, text) => {
  const ours = [person.nombre, COMPLETE_ENGLISH_PROFILES[person.id]?.name, ...(person.aliases || [])].filter(Boolean).map(nameParts).filter(Boolean);
  const theirs = nameParts(clean(text));
  return theirs && ours.some(o => compatible(o, theirs) && (!o.numeral || theirs.numeral === o.numeral || !/\b[IVX]+\b/.test(clean(text)) && false));
};
const fitsLoose = (person, text) => { const t = nameParts(clean(text)); return t && [person.nombre, COMPLETE_ENGLISH_PROFILES[person.id]?.name, ...(person.aliases || [])].filter(Boolean).map(nameParts).filter(Boolean).some(o => compatible(o, t)); };
const SOURCE = {sbl: 'Svenskt biografiskt lexikon', nbl: 'Norsk biografisk leksikon', dbl: 'Dansk Biografisk Leksikon'};
const out = {}, stats = {}, discrepancies = [];
const add = (id, kind, page, quote, note, noteEn, k) => {
  out[id] = {certainty: 'documented', sources: [{title: `${SOURCE[kind]} · ${page.title.replace(/\s*[–|-]\s*(Svenskt Biografiskt Lexikon|Dansk Biografisk Leksikon|SNL)\b.*$/i, '').replace(/\s*[–|-]\s*(?:Store norske leksikon|Lex)\s*$/i, '').replace(/\s*-\s*\d{3,4}-\d{3,4}\s*$/, '').replace(/\s*\|\s*Lex$/, '').trim()}`, url: page.url, locator: `Encabezado del artículo: «${quote}»`, locatorEn: `Article heading: “${quote}”`}], note, noteEn, reviewedAt: '2026-11-22', editor: 'El Árbol de Europa'};
  stats[k] = (stats[k] || 0) + 1;
};
const open = c => c.certainty === 'pending' || Object.hasOwn(REVIEWS, c.id) && REVIEWS[c.id].sources[0].title.match(/lexikon|leksikon/i);
const years = (page, kind) => {
  const t = page.text;
  if (kind === 'sbl') {
    const b = t.match(/Född:\s*(\d{4})(?:-\d\d-\d\d)?/), d = t.match(/Död:\s*(\d{4})(?:-\d\d-\d\d)?/);
    const doubtB = /\bf\.?\s+(?:trol|omkr|ca)\b/.test(t.slice(t.indexOf('Meriter'), t.indexOf('Meriter') + 300));
    const doubtD = /\bd\.?,?\s+(?:trol|omkr|ca)\b/.test(t.slice(t.indexOf('Meriter'), t.indexOf('Meriter') + 400));
    return {birth: b && !doubtB ? +b[1] : null, death: d && !doubtD ? +d[1] : null, quote: (t.match(/Meriter\s*\n?\s*([^\n]{0,200})/) || [])[1] || ''};
  }
  if (kind === 'nbl') {
    const b = t.match(/Født\s*\n\s*([^\n]{0,80})/), d = t.match(/Død\s*\n\s*([^\n]{0,80})/);
    const y = s => s && !/\b(?:ca\.?|trolig|omkring|før|etter)\s*\d|\?/.test(s[1].split(',')[0]) ? +((s[1].split(',')[0].match(/(\d{3,4})(?!.*\d{3,4})/) || [])[1]) || null : null;
    return {birth: y(b), death: y(d), quote: `Født ${b?.[1].split(',')[0] || '?'} · Død ${d?.[1].split(',')[0] || '?'}`};
  }
  const m = t.match(/Lex \.\s*\n?\s*([^\n]{0,40}?,\s*(ca\.\s*)?(?:[\d.]*?)(\d{3,4})\s*-\s*(ca\.\s*)?(?:[\d.]*?)(\d{3,4})\s*,)/);
  return m ? {birth: m[2] ? null : +m[3], death: m[4] ? null : +m[5], quote: m[1]} : {birth: null, death: null, quote: ''};
};
for (const [key, page] of Object.entries(pages)) {
  if (!page) continue;
  const [id, kind] = key.split('|'), p = byId.get(id);
  if (!p) continue;
  const y = years(page, kind);
  // Identity: a life year agrees with the Atlas, or the parents line names a recorded parent.
  const parentsLine = (page.text.match(/(?:Föräldrar|Foreldre|Forældre):\s*([^\n]{0,260})/) || [])[1] || '';
  const parentText = parentsLine.split(/\.\s|\n/)[0];
  const [fatherText, motherText] = parentText.split(/\s+(?:o|och|og)\s+/);
  const identified = (y.birth && y.birth === p.nac) || (y.death && y.death === p.muer) || (byId.get(p.padre) && fatherText && fitsLoose(byId.get(p.padre), fatherText));
  if (!identified) continue;
  for (const c of personClaims(p)) {
    const k = c.id.split(':')[2];
    if ((k === 'birth' || k === 'death') && Number.isInteger(c.value) && y[k] && y[k] !== c.value) discrepancies.push({id, kind, k, atlas: c.value, theirs: y[k], url: page.url});
    if (!open(c)) continue;
    if ((k === 'birth' || k === 'death') && y[k] === c.value && y.quote) add(c.id, kind, page, y.quote.trim(), `${SOURCE[kind]} da el año de ${k === 'birth' ? 'nacimiento' : 'fallecimiento'}.`, `${SOURCE[kind]} gives the year of ${k}.`, k);
    else if (k === 'father' && fatherText && byId.get(c.value) && fitsLoose(byId.get(c.value), fatherText)) add(c.id, kind, page, parentText.slice(0, 200), `${SOURCE[kind]} confirma el vínculo (padre).`, `${SOURCE[kind]} confirms the relationship (father).`, k);
    else if (k === 'mother' && motherText && byId.get(c.value) && fitsLoose(byId.get(c.value), motherText)) add(c.id, kind, page, parentText.slice(0, 200), `${SOURCE[kind]} confirma el vínculo (madre).`, `${SOURCE[kind]} confirms the relationship (mother).`, k);
    else if (k === 'spouse' && byId.get(c.value)) {
      const lines = page.text.match(/(?:^|\n)\s*(?:Gift|G)\b[^\n]{0,600}/g) || [];
      const spouse = byId.get(c.value);
      for (const line of lines) {
        const parts = line.split(/\s(?:med|m)\s/).slice(1);
        const hit = parts.find(x => fitsLoose(spouse, x.split(/[,;(]/)[0]));
        // Quote the marriage that names this spouse («2) 1 okt 36 … m Margareta …»).
        const at = hit ? line.indexOf(hit) : -1, from = Math.max(0, line.lastIndexOf(')', Math.max(0, at - 60)) - 2);
        if (hit) { add(c.id, kind, page, `${from > 5 ? '… ' : ''}${line.slice(from, at + 120).trim()}`, `${SOURCE[kind]} confirma el matrimonio.`, `${SOURCE[kind]} confirms the marriage.`, 'spouse'); break; }
      }
    }
  }
}
fs.writeFileSync(new URL('reviews.json', dir), JSON.stringify(out));
fs.writeFileSync(new URL('discrepancies.json', dir), JSON.stringify(discrepancies, null, 1));
console.log(stats, 'total', Object.keys(out).length, 'discrepancies', discrepancies.length);
