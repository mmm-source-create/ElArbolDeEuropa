// 6.0.17 · Claim reviews from Medieval Lands (Foundation for Medieval Genealogy).
// A person is identified with an entry only when both life years agree (at least one stated without
// doubt in Medieval Lands) and the given name and regnal number agree across languages. Then:
//  · birth or death: the entry gives that year without doubt;
//  · father or mother: the entry names the parent («son of X & his wife Y») with a compatible name, or the
//    entry sits in the children list of the parent's own identified entry;
//  · spouse: a marriage of the entry names the spouse with a compatible name and no contradicting years
//    (and at least one agreeing year when Medieval Lands gives any).
// Only pending claims are reviewed. Usage: node --import ./tests/jsx-loader.mjs scripts/research/fmg/build617.mjs
import fs from 'node:fs';
import {nameParts, compatible} from './names.mjs';
const root = new URL('../../../.cache/fmg/', import.meta.url);
const {PERSONAS} = await import('../../../src/data/personas.js');
const {personClaims} = await import('../../../src/evidence/claims.js');
const {REVIEWS_617} = await import('../../../src/evidence/reviews617.js');
// A claim documented by an earlier run of this review is reviewed again (it would no longer look pending).
const open = claim => claim.certainty === 'pending' || REVIEWS_617[claim.id]?.sources[0].url.startsWith('https://fmg.ac/');
const {COMPLETE_ENGLISH_PROFILES} = await import('../../../src/features/english/fullProfiles.js');
const {conyugesDe} = await import('../../../src/domain/genealogy/personAccessors.js');
const entries = JSON.parse(fs.readFileSync(new URL('entries.json', root)));
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const namesOf = p => [p.nombre, COMPLETE_ENGLISH_PROFILES[p.id]?.name, ...(p.aliases || [])].filter(Boolean).map(nameParts).filter(Boolean);
const fits = (p, fmgName) => { const f = nameParts(fmgName); return f && namesOf(p).some(n => compatible(n, f)); };
const exactYears = p => Number.isInteger(p?.nac) && Number.isInteger(p?.muer) && !p.nacAprox && !p.muerAprox;
const byYears = new Map();
for (const e of entries) if (e.birth && e.death) { const k = `${e.birth.year}-${e.death.year}`; if (!byYears.has(k)) byYears.set(k, []); byYears.get(k).push(e); }
// Entries of one person (a short entry in a children list and a full entry may both exist).
const identify = p => {
  if (!exactYears(p)) return [];
  return (byYears.get(`${p.nac}-${p.muer}`) || []).filter(e => (e.birth.certain || e.death.certain) && fits(p, e.name));
};
const identified = new Map();
for (const p of PERSONAS) { const found = identify(p); if (found.length) identified.set(p.id, found); }
// 6.0.18: people with only one sure year (or none) are identified through the children list of a parent
// already identified: same given name and regnal number, and no sure year that contradicts the Atlas.
const contradicts = (p, e) => [[p.nac, p.nacAprox, e.birth], [p.muer, p.muerAprox, e.death]].some(([y, approx, d]) => Number.isInteger(y) && !approx && d?.certain && d.year !== y);
for (let round = 0; round < 3; round++) {
  for (const p of PERSONAS) {
    if (identified.has(p.id)) continue;
    const parents = [p.padre, p.madre].map(id => identified.get(id)).filter(Boolean).flat().map(e => e.index);
    if (!parents.length) continue;
    const children = entries.filter(e => e.parentEntry !== null && parents.includes(e.parentEntry) && fits(p, e.name) && !contradicts(p, e));
    if (!children.length || new Set(children.map(e => `${e.name}|${e.birth?.year}|${e.death?.year}`)).size > 1) continue;
    // At least one year must agree when the Atlas gives a sure one, so that same-named siblings are not confused.
    const sure = [[p.nac, p.nacAprox, 'birth'], [p.muer, p.muerAprox, 'death']].filter(([y, approx]) => Number.isInteger(y) && !approx);
    if (sure.length && !sure.some(([y, , k]) => children[0][k]?.year === y)) continue;
    identified.set(p.id, children);
  }
}
const pageTitle = page => page.replace(/\.htm$/, '').replace(/%20/g, ' ');
const source = (e, locator, locatorEn) => ({title: `Foundation for Medieval Genealogy · Medieval Lands · ${pageTitle(e.page)}`,
  url: `https://fmg.ac/Projects/MedLands/${encodeURIComponent(e.page).replace(/%2C/g, ',')}${e.anchor ? `#${e.anchor}` : ''}`, locator, locatorEn});
const quote = e => e.text.replace(/[⟦⟧]/g, '').slice(0, 170);
const out = {}, stats = {};
const add = (id, sources, note, noteEn, kind) => { out[id] = {certainty: 'documented', sources, note, noteEn, reviewedAt: '2026-11-22', editor: 'El Árbol de Europa'}; stats[kind] = (stats[kind] || 0) + 1; };
const yearsAgree = (p, dates) => {
  if (!dates) return null;
  const checks = [[p.nac, p.nacAprox, dates.birth], [p.muer, p.muerAprox, dates.death]].filter(([y, approx, d]) => Number.isInteger(y) && !approx && d);
  if (checks.some(([y, , d]) => d.certain && d.year !== y)) return false;
  return checks.some(([y, , d]) => d.year === y && d.certain) ? true : null;
};
for (const p of PERSONAS) {
  const mine = identified.get(p.id);
  if (!mine) continue;
  for (const claim of personClaims(p)) {
    if (!open(claim)) continue;
    const kind = claim.id.split(':')[2];
    if (kind === 'birth' || kind === 'death') {
      const e = mine.find(x => x[kind]?.certain && x[kind].year === claim.value);
      if (e) add(claim.id, [source(e, `Entrada: «${quote(e)}»`, `Entry: “${quote(e)}”`)], `Medieval Lands registra el ${kind === 'birth' ? 'nacimiento' : 'fallecimiento'} en ${claim.value}.`, `Medieval Lands gives the ${kind} as ${claim.value}.`, kind);
    } else if (kind === 'father' || kind === 'mother') {
      const parent = byId.get(claim.value);
      if (!parent) continue;
      const explicit = mine.find(e => e[kind] && e[kind] !== '---' && fits(parent, e[kind]));
      const listed = mine.find(e => e.parentEntry !== null && (identified.get(parent.id) || []).some(x => x.index === e.parentEntry));
      const e = explicit || listed;
      if (!e) continue;
      const word = kind === 'father' ? ['padre', 'father'] : ['madre', 'mother'];
      const locator = explicit ? [`Entrada: «${quote(e)}»`, `Entry: “${quote(e)}”`] : [`Lista de hijos de ${parent.nombre}: «${quote(e)}»`, `Children of ${COMPLETE_ENGLISH_PROFILES[parent.id]?.name || parent.nombre}: “${quote(e)}”`];
      add(claim.id, [source(e, ...locator)], `Medieval Lands confirma el vínculo (${word[0]}).`, `Medieval Lands confirms the relationship (${word[1]}).`, kind);
    } else if (kind === 'spouse') {
      const spouse = byId.get(claim.value);
      if (!spouse) continue;
      let hit = null;
      for (const e of mine) for (const m of e.marriages) {
        if (!fits(spouse, m.name)) continue;
        const agree = yearsAgree(spouse, m.dates);
        if (agree === false) continue;
        if (m.dates && agree !== true) continue;
        if (!m.dates && !(identified.get(spouse.id) || []).some(x => x.marriages.some(mm => fits(p, mm.name)))) continue;
        hit = {e, m}; break;
      }
      if (!hit) continue;
      add(claim.id, [source(hit.e, `Matrimonio: «${hit.m.clause.slice(0, 170)}»`, `Marriage: “${hit.m.clause.slice(0, 170)}”`)], 'Medieval Lands confirma el matrimonio.', 'Medieval Lands confirms the marriage.', 'spouse');
    }
  }
}
fs.writeFileSync(new URL('reviews617.json', root), JSON.stringify(out));
console.log('identified', identified.size, stats, 'total', Object.keys(out).length);
