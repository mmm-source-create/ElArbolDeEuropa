// 6.0.22 · Claim reviews from the Diccionario Biográfico Español (Real Academia de la Historia).
// Only pending claims are reviewed; years that differ are written to .cache/rah/discrepancies.json.
//  · birth and death: the heading of the article gives the year (not «c.», «?», «ant.» or «post.»);
//  · father and mother: a filiation sentence near the start («Era hijo de Pedro II de Aragón y de María
//    de Montpellier») names the parent with the same given name and a distinctive part or regnal number;
//  · spouse: a sentence on the marriage itself (casó, contrajo matrimonio, bodas…) names the spouse;
//  · government: an accession sentence names the territory and the first year; the last year is the
//    death year of the heading or appears in a sentence on abdication, deposition or renunciation.
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/rah/run.mjs
import fs from 'node:fs';
import {nameParts, compatible} from '../fmg/names.mjs';
const cache = new URL('../../../.cache/rah/', import.meta.url);
const bios = JSON.parse(fs.readFileSync(new URL('bios.json', cache)));
const {PERSONAS} = await import('../../../src/data/personas.js');
const {personClaims} = await import('../../../src/evidence/claims.js');
const {conyugesDe} = await import('../../../src/domain/genealogy/personAccessors.js');
const REVIEWS = fs.existsSync(new URL('../../../src/evidence/reviews622.js', import.meta.url)) ? (await import('../../../src/evidence/reviews622.js')).REVIEWS_622 : {};
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const fold = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const STOP = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'e', 'rey', 'reina', 'duque', 'duquesa', 'conde', 'condesa', 'infante', 'infanta', 'principe', 'princesa', 'señor', 'senor', 'casa']);
const words = text => text.split(/[\s,;:.()'’«»"]+/).filter(Boolean);
const names = (person, sentence) => {
  const list = words(sentence);
  for (const n of [person.nombre, ...(person.aliases || [])]) {
    const ours = nameParts(n);
    if (!ours) continue;
    const distinct = n.split(/[\s,()'’-]+/).filter(w => w.length >= 4 && !STOP.has(fold(w)) && !/^[IVX]+$/.test(w)).slice(1).map(w => fold(w).slice(0, 6));
    for (let i = 0; i < list.length; i++) {
      if (!/^\p{Lu}/u.test(list[i]) || !compatible(ours, {given: nameParts(list[i])?.given || '', numeral: null})) continue;
      const window = list.slice(i + 1, i + 8);
      const numeral = window.slice(0, 2).find(w => /^[IVX]+$/.test(w));
      if (ours.numeral && numeral) { if (numeral === ours.numeral) return true; continue; }
      if (!ours.numeral && distinct.length && window.some(w => w.length >= 4 && distinct.includes(fold(w).slice(0, 6)))) return true;
    }
  }
  return false;
};
const sentences = text => text.split(/(?<=[a-z0-9)\]»"])\.\s+(?=[A-ZÁÉÍÓÚÑ«"])/);
const hasYear = (text, y) => new RegExp(`(?<![\\d/.])${y}(?![\\d/])`).test(text);
const yearOf = t => { if (!t || /\b(?:c\.|h\.|ca\.|ant\.|post\.|ss?\.|hacia|circa|sup\.|pos\.)|\?|\[|\d\s*-\s*\d/i.test(t)) return null; const m = String(t).match(/(\d{3,4})(?!.*\d{3,4})/); return m ? +m[1] : null; };
const DOUBT = /quizá|quiza|probablemente|posiblemente|al parecer|se ha dicho|según algunos|hipótesis|dudos|incierto|discutid|supuest/i;
const out = {}, stats = {}, discrepancies = [], unidentified = [];
const quote = s => s.replace(/\s+/g, ' ').trim().slice(0, 220);
const add = (id, bio, locator, note, noteEn, kind) => {
  out[id] = {nid: bio.nid, slug: bio.slug, title: bio.title, author: bio.author, locator: quote(locator), note, noteEn};
  stats[kind] = (stats[kind] || 0) + 1;
};
// Passages read and rejected: they imply the marriage without stating it.
const REJECTED = new Set(['person:LEONOR1NAV:spouse:GASTON4FOIX']);
const open = claim => !REJECTED.has(claim.id) && (claim.certainty === 'pending' || Object.hasOwn(REVIEWS, claim.id));
for (const p of PERSONAS) {
  const bio = bios[p.id];
  if (!bio) continue;
  const all = sentences(bio.text || '');
  const head = all.slice(0, 6);
  const birth = yearOf(bio.birth), death = yearOf(bio.death);
  // Identity: one life year agrees with the Atlas, or the opening names a parent recorded in the Atlas.
  const parents = [p.padre, p.madre].map(x => byId.get(x)).filter(Boolean);
  const identified = (birth !== null && birth === p.nac) || (death !== null && death === p.muer) || parents.some(par => head.some(x => /\b(?:hij[oa]|primogénit[oa]|segundogénit[oa])\b/i.test(x) && names(par, x)));
  if (!identified) { unidentified.push({id: p.id, name: p.nombre, atlas: [p.nac, p.muer], rah: [bio.birth, bio.death], title: bio.title, nid: bio.nid}); continue; }
  for (const claim of personClaims(p)) {
    const kind = claim.id.split(':')[2];
    if ((kind === 'birth' || kind === 'death') && Number.isInteger(claim.value)) {
      const y = kind === 'birth' ? birth : death;
      if (y && y !== claim.value) discrepancies.push({id: p.id, name: p.nombre, kind, atlas: claim.value, rah: y, text: kind === 'birth' ? bio.birth : bio.death, nid: bio.nid, slug: bio.slug, certainty: claim.certainty});
      if (!open(claim) || y !== claim.value) continue;
      add(claim.id, bio, `${bio.label}`, `El Diccionario Biográfico Español da el año de ${kind === 'birth' ? 'nacimiento' : 'fallecimiento'}.`, `The Diccionario Biográfico Español gives the year of ${kind}.`, kind);
    }
    if (!open(claim)) continue;
    if (kind === 'father' || kind === 'mother') {
      const parent = byId.get(claim.value);
      if (!parent) continue;
      const s = head.find(x => /\b(?:hij[oa]|primogénit[oa]|segundogénit[oa]|nació del matrimonio|fruto del matrimonio|sus padres|su padre|su madre)\b/i.test(x) && !DOUBT.test(x) && names(parent, x));
      if (s) add(claim.id, bio, s, `El Diccionario Biográfico Español confirma el vínculo (${kind === 'father' ? 'padre' : 'madre'}).`, `The Diccionario Biográfico Español confirms the relationship (${kind}).`, kind);
    } else if (kind === 'spouse') {
      const spouse = byId.get(claim.value);
      if (!spouse) continue;
      // The marriage word must stand next to the spouse's name (within 80 characters), and the sentence
      // must state the marriage, not a plan or an alliance.
      const MARRIAGE = /\b(?:casó|casado|casada|contrajo matrimonio|contrajo nupcias|matrimonio con|bodas? con|su esposa|su esposo|su marido|viud[oa] de|se desposó)\b/i;
      const near = x => { const given = spouse.nombre.split(' ')[0]; let i = x.indexOf(given); while (i >= 0) { if (MARRIAGE.test(x.slice(Math.max(0, i - 80), i + given.length + 80))) return true; i = x.indexOf(given, i + 1); } return false; };
      const s = all.find(x => MARRIAGE.test(x) && near(x) && !/negoci|proyect|candidat|no llegó|frustr|fracas|intent|pretend|propuest|comprometid|prometid|promes|esponsales|posible|casaría|alianza|elegida para|acuerdo de/i.test(x) && !DOUBT.test(x) && names(spouse, x));
      if (s) add(claim.id, bio, s, 'El Diccionario Biográfico Español confirma el matrimonio.', 'The Diccionario Biográfico Español confirms the marriage.', 'spouse');
    } else if (kind === 'government') {
      const g = claim.value;
      if (!Number.isInteger(g.desde) || !Number.isInteger(g.hasta) || !g.territorio) continue;
      const ter = new RegExp(`\\b${fold(g.territorio).replace(/^(?:condado|reino|ducado|marquesado|corona) de /, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      const start = all.find(x => ter.test(fold(x)) && hasYear(x, g.desde) && /\b(?:sucedi|hered|accedi|proclamad|coronad|jurad|subi[oó] al trono|ocup[oó] el trono|reconocid|investid|nombrad|elegid|tom[oó] posesi|asumi)/i.test(fold(x)) && !DOUBT.test(x) && !/regenc|regente/i.test(x) === !/regen/i.test(g.titulo || ''));
      if (!start) continue;
      const end = g.hasta === death ? `${bio.label}` : all.find(x => x !== start && ter.test(fold(x)) && hasYear(x, g.hasta) && /\b(?:abdic|depuest|renunci|destronad|cedi[oó])/i.test(fold(x)));
      if (!end) continue;
      add(claim.id, bio, `${start} … ${end}`, `El Diccionario Biográfico Español registra el gobierno (${g.territorio}, ${g.desde}–${g.hasta}).`, `The Diccionario Biográfico Español records the government (${g.desde}–${g.hasta}).`, 'government');
    }
  }
}
fs.writeFileSync(new URL('reviews.json', cache), JSON.stringify(out));
fs.writeFileSync(new URL('discrepancies.json', cache), JSON.stringify(discrepancies, null, 1));
fs.writeFileSync(new URL('unidentified.json', cache), JSON.stringify(unidentified, null, 1));
console.log(stats, 'total', Object.keys(out).length, 'discrepancies', discrepancies.length, 'unidentified', unidentified.length);
