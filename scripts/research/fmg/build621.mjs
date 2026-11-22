// 6.0.21 (from build617.mjs) · Claim reviews from Medieval Lands (Foundation for Medieval Genealogy).
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
const {REVIEWS_621} = await import('../../../src/evidence/reviews621.js');
const open = claim => claim.certainty === 'pending' || [REVIEWS_617, REVIEWS_621].some(r => r[claim.id]?.sources[0].url.startsWith('https://fmg.ac/'));
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
// 6.0.21: a person whose life years do not both agree is identified when the given name agrees, at least
// one year agrees without doubt, no sure year contradicts the Atlas, and the entry also names a parent
// or a spouse with a compatible name. The match must be unique.
// 6.0.21: the paragraph that opens a children list («King Henry II & his wife had eight children:») names
// the parent; the wife is the marriage paragraph of that order just before it.
const TITLES = /^(?:King|Queen|Emperor|Empress|Tsar|Duke|Duchess|Count|Countess|Prince|Princess|Margrave|Landgrave|Lord|Lady|Sir|Earl|Marquis|Grand|Despot|Doge|Infante|Infanta)\s+/;
const headerParent = (e, kind) => {
  const h = e.listHeader;
  if (!h || !h.subject) return null;
  const subject = h.subject.replace(TITLES, '').replace(TITLES, '');
  const female = /&\s+her\b/.test(h.text);
  if (kind === 'father') return female ? null : subject;
  if (female) return subject;
  return !h.illegitimate && h.wife ? h.wife.name : null;
};
const relAnchor = (p, e) => {
  const father = byId.get(p.padre), mother = byId.get(p.madre);
  if (father && headerParent(e, 'father') && fits(father, headerParent(e, 'father'))) return true;
  if (mother && headerParent(e, 'mother') && fits(mother, headerParent(e, 'mother'))) return true;
  if (father && e.father && e.father !== '---' && fits(father, e.father)) return true;
  if (mother && e.mother && e.mother !== '---' && fits(mother, e.mother)) return true;
  if (e.parentEntry !== null && [p.padre, p.madre].some(id => (identified.get(id) || []).some(x => x.index === e.parentEntry))) return true;
  return conyugesDe(p).map(id => byId.get(id)).filter(Boolean).some(s => e.marriages.some(m => fits(s, m.name)));
};
const anchors = (p, e) => {
  const father = byId.get(p.padre), mother = byId.get(p.madre);
  const f = father && [e.father, headerParent(e, 'father')].some(n => n && n !== '---' && fits(father, n));
  const m = mother && [e.mother, headerParent(e, 'mother')].some(n => n && n !== '---' && fits(mother, n));
  const s = conyugesDe(p).map(id => byId.get(id)).filter(Boolean).some(sp => e.marriages.some(mm => fits(sp, mm.name)));
  return [f, m, s].filter(Boolean).length;
};
const sureAgree = (p, e) => [[p.nac, p.nacAprox, e.birth], [p.muer, p.muerAprox, e.death]].some(([y, approx, d]) => Number.isInteger(y) && !approx && d?.certain && d.year === y);
const byGiven = new Map();
for (const e of entries) { const n = nameParts(e.name); if (!n) continue; if (!byGiven.has(n.given)) byGiven.set(n.given, []); byGiven.get(n.given).push(e); }
const extra = new Set(), discrepancies = [];
for (let round = 0; round < 3; round++) for (const p of PERSONAS) {
  if (identified.has(p.id)) continue;
  const givens = new Set(namesOf(p).map(n => n.given));
  const pool = [...givens].flatMap(g => byGiven.get(g) || []);
  // A year that contradicts the Atlas is tolerated only when the entry also names both parents (or a
  // parent and a spouse) compatibly; the contradicted date itself is never documented.
  const found = pool.filter(e => fits(p, e.name) && sureAgree(p, e) && (contradicts(p, e) ? anchors(p, e) >= 2 : relAnchor(p, e)));
  if (!found.length || new Set(found.map(e => `${e.name}|${e.birth?.year}|${e.death?.year}`)).size > 1) continue;
  identified.set(p.id, found); extra.add(p.id);
  if (found.some(e => contradicts(p, e))) discrepancies.push({id: p.id, name: p.nombre, atlas: [p.nac, p.muer], fmg: [found[0].birth?.year, found[0].death?.year], page: found[0].page, anchor: found[0].anchor});
}
console.log('extra identified', extra.size);
// 6.0.21 · Governments. An office sentence of the identified entry («He succeeded his father in 1285 as
// PHILIPPE IV King of France») must name the territory and the first year; the last year must be the
// death year that Medieval Lands gives without doubt, or appear in a sentence on the same territory.
const {ENGLISH_TERRITORIES} = await import('../../../src/features/english/entityTranslations.js');
const {KW} = await import('../authority-review/government-keywords.mjs');
const fold = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const EN_NAME = new Map(ENGLISH_TERRITORIES.map(t => [t.key, t.name]));
const EXTRA = {'Henao': 'hainaut|hennegau', 'Holanda': 'holland', 'Zelanda': 'zeeland|zelande', 'Güeldres': 'gelder|gueldre', 'Cléveris': 'kleve|cleve', 'Valaquia': 'wallach|valach', 'Moldavia': 'moldav|moldau', 'Bearne': 'bearn', 'Imericia': 'imeret', 'Kajetia': 'kakhet', 'Trinacria': 'sicil|trinacria', 'Estados Pontificios': 'pope|papa |pontif', 'Sacro Imperio': 'emperor|kaiser|king of germany|king of the romans|roman king', 'Alemania': 'king of germany|king of the romans|roman king', 'Bizancio': 'emperor', 'Imperio otomano': 'sultan', 'Armenia cilicia': 'armenia', 'Condado de Barcelona': 'barcelona', 'Condado de Borgoña': 'franche|palatine of burgundy|comte de bourgogne|count of burgundy', 'Austria Interior': 'styria|steiermark|carinthia|karnten|carniola', 'Pallars Sobirà': 'pallars', 'Rusia': 'russia|tsar|moscow', 'Jerusalén': 'jerusalem', 'Mallorca': 'majorca|mallorca', 'Lituania': 'lithuan|litau', 'Silesia': 'silesi|schles', 'Bohemia': 'bohem|bohm', 'Hungría': 'hungar|ungarn|hongr', 'Baviera': 'bavaria|bayern|baviere', 'Polonia': 'poland|polen|pologne', 'Dinamarca': 'denmark|danemark|danmark', 'Suecia': 'sweden|suede|schweden', 'Noruega': 'norway|norvege|norwegen', 'Escocia': 'scotland|scots', 'Inglaterra': 'england|english', 'Francia': 'king of france|roi de france|french', 'Navarra': 'navarr', 'Nápoles': 'naples|napoli|sicily', 'Saboya': 'savoy|savoie|savoia', 'Bretaña': 'brittany|bretagne', 'Flandes': 'flanders|flandre', 'Brabante': 'brabant', 'Luxemburgo': 'luxemb', 'Limburgo': 'limbur', 'Namur': 'namur', 'Artois': 'artois', 'Foix': 'foix', 'Monferrato': 'montferrat|monferrato', 'Chipre': 'cyprus|chypre', 'Georgia': 'georgia', 'Kartli': 'kartli|karthli', 'Turingia': 'thuring', 'Mecklemburgo': 'mecklenb', 'Württemberg': 'wurttemberg|wirtemberg', 'Palatinado': 'palatin|pfalz', 'Sajonia': 'saxony|sachsen|saxe', 'Austria': 'austria|osterreich|autriche', 'Tirol': 'tirol|tyrol', 'Milán': 'milan|milano', 'Venecia': 'doge|venice|venezia', 'Castilla': 'castil', 'León': 'leon', 'Aragón': 'aragon', 'Portugal': 'portug', 'Valencia': 'valencia', 'Cerdeña': 'sardinia|sardegna|sardaigne', 'Irlanda': 'ireland', 'Aquitania': 'aquitaine|aquitania|guyenne', 'Granada': 'granada', 'Bosnia': 'bosnia', 'Serbia': 'serbia|serbs|rascia', 'Bulgaria': 'bulgar', 'Transilvania': 'transylvan|siebenb', 'Croacia': 'croatia|kroat', 'Moravia': 'moravia|mahren', 'Brandeburgo': 'brandenb', 'Prusia': 'prussia|preussen', 'Nassau': 'nassau', 'Países Bajos': 'netherlands|low countries|nederland'};
const stemOf = territory => {
  const parts = [EXTRA[territory], fold(territory).slice(0, 6), fold(EN_NAME.get(territory)).slice(0, 6)].filter(Boolean);
  return new RegExp(`(?:${parts.map(x => x.replace(/[.*+?^${}()[\]\\]/g, m => m === '|' ? m : `\\${m}`)).join('|')})`, 'i');
};
const hasYear = (text, y) => new RegExp(`(?<![\\d/])${y}(?![\\d/])`).test(text);
// The 6.0.20 review found another reference work giving different limits for these terms (NDB: Lower
// Bavaria from 1294; Kungahuset: a different office); they stay pending until the sources are weighed.
const CONTESTED = new Set(['ESTEBAN1BAV:Baviera', 'LUIS3BAV:Baviera', 'ENRIQ14BAV:Baviera', 'CARLOS1:Croacia', 'BIRGERJARL:Suecia', 'MARGARITA1NORD:Suecia']);
const governmentEvidence = (entries, g, person) => {
  if (!Number.isInteger(g.desde) || !Number.isInteger(g.hasta) || !g.territorio || CONTESTED.has(`${person.id}:${g.territorio}`)) return null;
  const regentTitle = /regen/i.test(g.titulo || '');
  const stem = stemOf(g.territorio);
  for (const e of entries) {
    const acts = (e.acts || []).map(a => ({a, f: fold(a)}));
    // A sentence about the successor («She was succeeded by Philippe … Regent of Holland 1428-1433») is not
    // about this person.
    const start = acts.find(x => stem.test(x.f) && hasYear(x.a, g.desde) && !/was succeeded by|in favour of|in succession to/.test(x.f) && /succeed|became|elected|crowned|proclaimed|installed|invested|inherited|regent|recogni|enfeoffed|granted|ruled|reigned/.test(x.f));
    if (!start) continue;
    // A regency in the source does not document a reign (and the reverse).
    if (/\bregent\b|\bregency\b/.test(start.f) !== regentTitle) continue;
    if (g.hasta !== g.desde && new RegExp(`(?<![\\d/])${g.desde}\\s*[-–]\\s*${g.hasta}(?![\\d/])|until (?:\\d{1,2} \\w+ )?${g.hasta}(?![\\d/])`).test(start.a)) return {e, quote: start.a};
    if (e.death?.certain && e.death.year === g.hasta) return {e, quote: start.a, death: true};
    const end = acts.find(x => x !== start && stem.test(x.f) && hasYear(x.a, g.hasta) && /deposed|abdicated|resigned|renounced|ceded|expelled/.test(x.f));
    if (end) return {e, quote: `${start.a} … ${end.a}`};
  }
  return null;
};
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
      const headed = mine.find(e => headerParent(e, kind) && fits(parent, headerParent(e, kind)) && !(kind === 'mother' && e.listHeader.wife?.dates && yearsAgree(parent, e.listHeader.wife.dates) === false));
      const e = explicit || listed || headed;
      if (!e) continue;
      const word = kind === 'father' ? ['padre', 'father'] : ['madre', 'mother'];
      const head = e === headed && !explicit && !listed;
      const wifeNote = head && kind === 'mother' && !/&\s+her\b/.test(e.listHeader.text) ? ` — ${e.listHeader.wife.clause.slice(0, 90)}` : '';
      const locator = explicit ? [`Entrada: «${quote(e)}»`, `Entry: “${quote(e)}”`]
        : head ? [`Lista de hijos: «${e.listHeader.text} … ${quote(e).slice(0, 110)}»${wifeNote ? ` · Matrimonio: «${wifeNote.slice(3)}»` : ''}`, `Children list: “${e.listHeader.text} … ${quote(e).slice(0, 110)}”${wifeNote ? ` · Marriage: “${wifeNote.slice(3)}”` : ''}`]
        : [`Lista de hijos de ${parent.nombre}: «${quote(e)}»`, `Children of ${COMPLETE_ENGLISH_PROFILES[parent.id]?.name || parent.nombre}: “${quote(e)}”`];
      add(claim.id, [source(e, ...locator)], `Medieval Lands confirma el vínculo (${word[0]}).`, `Medieval Lands confirms the relationship (${word[1]}).`, kind);
    } else if (kind === 'government') {
      const hit = governmentEvidence(mine, claim.value, p);
      if (!hit) continue;
      const tail = hit.death ? [` · Fallecimiento: ${hit.e.death.year}`, ` · Death: ${hit.e.death.year}`] : ['', ''];
      const q = hit.quote.split(/\s+m (?:firstly|secondly|thirdly|\()/)[0].trim().slice(0, 300);
      add(claim.id, [source(hit.e, `Entrada: «${q}»${tail[0]}`, `Entry: “${q}”${tail[1]}`)], `Medieval Lands registra el gobierno (${claim.value.territorio}, ${claim.value.desde}–${claim.value.hasta}).`, `Medieval Lands records the government (${claim.value.desde}–${claim.value.hasta}).`, 'government');
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
// 6.0.21: a marriage is one fact with two claims. When the spouse's identified entry names this person
// (compatible name, no contradicting years, and agreeing years when the clause gives any), the same
// passage documents the reverse claim, even if this person has no entry of their own.
for (const p of PERSONAS) {
  for (const claim of personClaims(p)) {
    if (!open(claim) || out[claim.id] || claim.id.split(':')[2] !== 'spouse') continue;
    const spouse = byId.get(claim.value);
    const theirs = spouse && identified.get(spouse.id);
    if (!theirs) continue;
    let hit = null;
    for (const e of theirs) for (const m of e.marriages) {
      if (hit || !fits(p, m.name)) continue;
      const agree = yearsAgree(p, m.dates);
      if (agree === false || (m.dates && agree !== true)) continue;
      if (!m.dates) continue;
      hit = {e, m};
    }
    if (!hit) continue;
    add(claim.id, [source(hit.e, `Matrimonio: «${hit.m.clause.slice(0, 170)}»`, `Marriage: “${hit.m.clause.slice(0, 170)}”`)], 'Medieval Lands confirma el matrimonio.', 'Medieval Lands confirms the marriage.', 'spouse');
  }
}
fs.writeFileSync(new URL('reviews621.json', root), JSON.stringify(out));
fs.writeFileSync(new URL('discrepancies621.json', root), JSON.stringify(discrepancies, null, 1));
console.log('discrepancies', discrepancies.length);
console.log('identified', identified.size, stats, 'total', Object.keys(out).length);
