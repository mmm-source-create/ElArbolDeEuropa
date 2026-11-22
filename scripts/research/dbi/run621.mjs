// 6.0.21 · Dates, marriages and governments from the full articles of the Dizionario Biografico degli
// Italiani (.cache/dbi/articles621.json). Only pending claims are reviewed.
//  · birth: the opening sentence («nacque il 14 genn. 1444 a Fermo») gives the Atlas year, without doubt words;
//  · death: a sentence that begins with the death of the subject («Morì a Milano il 26 dic. 1476») gives it;
//  · spouse: a marriage sentence (sposò, nozze, matrimonio…) names the spouse with a compatible given name
//    and another distinctive part of the name (or the same regnal number);
//  · government: a sentence on accession (succedette, eletto, investito…) names the territory and the
//    first year, and the last year is the death year documented above or a sentence on deposition or
//    abdication names it.
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/dbi/run621.mjs
import fs from 'node:fs';
import {nameParts, compatible} from '../fmg/names.mjs';
const cacheDir = new URL('../../../.cache/dbi/', import.meta.url);
const authority = new URL('../../../.cache/sources-616/', import.meta.url);
const read = f => JSON.parse(fs.readFileSync(new URL(f, authority)));
const qids = read('qids.json'), ent = read('entities.json'), status = read('status.json');
const articles = JSON.parse(fs.readFileSync(new URL('articles621.json', cacheDir)));
const fmg = JSON.parse(fs.readFileSync(new URL('../../../.cache/fmg/reviews621.json', import.meta.url)));
const {PERSONAS} = await import('../../../src/data/personas.js');
const {personClaims} = await import('../../../src/evidence/claims.js');
const {conyugesDe} = await import('../../../src/domain/genealogy/personAccessors.js');
const {COMPLETE_ENGLISH_PROFILES} = await import('../../../src/features/english/fullProfiles.js');
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const fold = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const STOP = new Set(['de', 'di', 'da', 'del', 'della', 'dei', 'of', 'the', 'y', 'e', 're', 'regina', 'duca', 'conte', 'marchese', 'signore', 'principe', 'duque', 'conde', 'rey', 'reina', 'king', 'queen', 'duke', 'count', 'house']);
const stem = w => fold(w).slice(0, 6);
const namesOf = p => [p.nombre, COMPLETE_ENGLISH_PROFILES[p.id]?.name, ...(p.aliases || [])].filter(Boolean);
const words = text => text.split(/[\s,;:.()'’]+/).filter(Boolean);
const names = (person, sentence) => {
  const list = words(sentence);
  for (const n of namesOf(person)) {
    const ours = nameParts(n);
    if (!ours) continue;
    const distinct = n.split(/[\s,()'’-]+/).filter(w => w.length >= 4 && !STOP.has(w.toLowerCase()) && !/^[IVX]+$/.test(w)).slice(1).map(stem);
    for (let i = 0; i < list.length; i++) {
      if (!/^\p{Lu}/u.test(list[i]) || !compatible(ours, {given: nameParts(list[i]).given, numeral: null})) continue;
      const window = list.slice(i + 1, i + 9);
      const numeral = window.slice(0, 2).find(w => /^[IVX]+$/.test(w));
      if (ours.numeral && numeral) { if (numeral === ours.numeral) return true; continue; }
      if (window.some(w => w.length >= 4 && distinct.includes(stem(w)))) return true;
    }
  }
  return false;
};
const DOUBT = /forse|probabil|circa|incert|ipotes|tradizion|discuss|controvers|dubbi|secondo alcuni|non è noto|ignota/i;
const sentences = text => text.split(/(?<=[a-z0-9)\]»"])[.;]\s+(?=[A-Z«"])/);
const hasYear = (text, y) => new RegExp(`(?<![\\d/])${y}(?![\\d/])`).test(text);
const IT = {'Milán': 'milan', 'Mantua': 'mantov', 'Ferrara': 'ferrar', 'Módena': 'moden', 'Nápoles': 'napol|regno di sicilia', 'Sicilia': 'sicili', 'Trinacria': 'sicili|trinacri', 'Saboya': 'savoi', 'Piamonte': 'piemont|savoi', 'Monferrato': 'monferrat', 'Toscana': 'toscan', 'Florencia': 'firenz|fiorent', 'Urbino': 'urbin', 'Venecia': 'doge|venezi', 'Génova': 'doge|genov', 'Parma': 'parm', 'Plasencia': 'piacenz', 'Estados Pontificios': 'papa|pontific|pontefic', 'Hungría': 'ungheri', 'Aragón': 'aragon', 'Castilla': 'castigli', 'Cerdeña': 'sardegn', 'Chipre': 'cipro', 'Jerusalén': 'gerusalem', 'Acaya': 'acaia', 'Mallorca': 'maiorc', 'Navarra': 'navarr', 'Francia': 'francia', 'Sacro Imperio': 'imperator', 'Bolonia': 'bologn', 'Rímini': 'rimin', 'Verona': 'veron', 'Padua': 'padov', 'Lucca': 'lucc', 'Siena': 'sien', 'Pisa': 'pisa', 'Saluzzo': 'saluzz', 'Massa': 'massa', 'Guastalla': 'guastall', 'Mirandola': 'mirandol', 'Carrara': 'carrar', 'Pesaro': 'pesar', 'Forlì': 'forli', 'Imola': 'imol', 'Camerino': 'camerin', 'Montefeltro': 'montefeltr|urbin', 'Albania': 'albani', 'Taranto': 'tarant', 'Durazzo': 'durazz', 'Atenas': 'atene', 'Epiro': 'epir', 'Corinto': 'corint', 'Bizancio': 'impero|imperator', 'Austria': 'austri', 'Baviera': 'bavier', 'Provenza': 'provenz', 'Anjou': 'angi'};
const STARTS = /succedett|successe|divenne|eletto|eletta|investit|assunse|proclamat|incoronat|nuovo duca|nuovo signore|salì|ottenne il|signore di|signoria di|ebbe il governo|governò|regnò|vicario/;
const out = {}, stats = {};
const add = (id, slug, title, quote, note, noteEn, kind) => {
  out[id] = {certainty: 'documented', sources: [{title: `Treccani · Dizionario Biografico degli Italiani · ${title}`, url: `https://www.treccani.it/enciclopedia/${slug}_(Dizionario-Biografico)/`, locator: `Artículo: «${quote}»`, locatorEn: `Article: “${quote}”`}],
    note, noteEn, reviewedAt: '2026-11-22', editor: 'El Árbol de Europa'};
  stats[kind] = (stats[kind] || 0) + 1;
};
// Marriage passages were read one by one: only these state the marriage itself (others concerned
// negotiations, a contract without a wedding, or the bibliography). Governments were not reliable enough.
const SPOUSES_READ = new Set(['MARGABR:ENRIQ7', 'BEATCONST:PEDRO3AR', 'ROB1NAP:VIOLARAGSIC', 'ALFONSO2ESTE:BARBAUSTRIA', 'FABRCOLONNA:AGNESEMONTEFELTRO', 'JUANA1NAP:LUISTARANTONAP', 'GOFFREDOBORJA:SANCIABORGIA', 'TOMASFRANCISCOSAB:MARIABORBONSOISSONS']);
const {REVIEWS_621} = await import('../../../src/evidence/reviews621.js');
const open = claim => (claim.certainty === 'pending' || REVIEWS_621[claim.id]?.sources[0].url.includes('treccani')) && !fmg[claim.id];
for (const p of PERSONAS) {
  if (status[p.id] !== 'ok') continue;
  const slug = ent[qids[p.id].qid]?.dbi, art = slug && articles[slug];
  if (!art) continue;
  const all = sentences(art.text);
  const first = all[0] || '';
  // The subject's death: a sentence that starts with it.
  const deathSentence = Number.isInteger(p.muer) && !p.muerAprox ? all.find(s => /^.{0,25}\b(?:Morì|morì|Moriva|moriva)\b/.test(s.trim()) && !/^.{0,25}\b(?:padre|madre|moglie|marito|figli[oa]|fratello|sorella|zio|zia)\b/.test(s.trim()) && hasYear(s, p.muer) && !DOUBT.test(s)) : null;
  for (const claim of personClaims(p)) {
    if (!open(claim)) continue;
    const kind = claim.id.split(':')[2];
    if (kind === 'birth' && !p.nacAprox && hasYear(first.slice(0, 220), p.nac) && /^(?:[A-Z]\.\s+)?[Nn]acque\b|^[Nn]at[oa]\b/.test(first.trim()) && !DOUBT.test(first.slice(0, 220))) {
      add(claim.id, slug, art.title, first.slice(0, 200), 'El Dizionario Biografico degli Italiani registra el año de nacimiento.', 'The Dizionario Biografico degli Italiani records the year of birth.', 'birth');
    } else if (kind === 'death' && deathSentence) {
      add(claim.id, slug, art.title, deathSentence.slice(0, 200), 'El Dizionario Biografico degli Italiani registra el año de fallecimiento.', 'The Dizionario Biografico degli Italiani records the year of death.', 'death');
    } else if (kind === 'spouse') {
      const spouse = byId.get(claim.value);
      if (!spouse) continue;
      // The sentence must state the marriage itself, not negotiations, proposals or betrothals.
      const s = all.find(x => /\b(?:sposò|sposato|sposata|nozze|unì in matrimonio|celebrato il matrimonio|si celebrò il matrimonio|furono celebrate)\b/.test(x) && !/trattativ|propost|progett|promess|candidat|pretendent|voleva|negozi|fidanz|disegno|ipotesi/i.test(x) && !DOUBT.test(x) && names(spouse, x));
      if (s && SPOUSES_READ.has(`${p.id}:${spouse.id}`)) add(claim.id, slug, art.title, s.slice(0, 220), 'El Dizionario Biografico degli Italiani confirma el matrimonio.', 'The Dizionario Biografico degli Italiani confirms the marriage.', 'spouse');
    } else if (kind === 'government' && false) {
      const g = claim.value;
      if (!Number.isInteger(g.desde) || !Number.isInteger(g.hasta)) continue;
      const ter = IT[g.territorio] || fold(g.territorio).slice(0, 6);
      const re = new RegExp(ter, 'i');
      const start = all.find(x => re.test(fold(x)) && hasYear(x, g.desde) && STARTS.test(fold(x)) && !DOUBT.test(x));
      if (!start) continue;
      const end = g.hasta === p.muer && deathSentence ? deathSentence : all.find(x => x !== start && re.test(fold(x)) && hasYear(x, g.hasta) && /depost|abdic|rinunci|cedett|perse il|cacciat/.test(fold(x)));
      if (!end) continue;
      add(claim.id, slug, art.title, `${start.slice(0, 180)} … ${end.slice(0, 120)}`, `El Dizionario Biografico degli Italiani registra el gobierno (${g.territorio}, ${g.desde}–${g.hasta}).`, `The Dizionario Biografico degli Italiani records the government (${g.desde}–${g.hasta}).`, 'government');
    }
  }
}
fs.writeFileSync(new URL('reviews621.json', cacheDir), JSON.stringify(out));
console.log(stats, 'total', Object.keys(out).length);
