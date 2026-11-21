// 6.0.16 · Claim reviews against three national authority files: GND (Deutsche Nationalbibliothek),
// BnF (Bibliothèque nationale de France) and the Library of Congress Name Authority File.
// Only claims that are still pending are reviewed; editorial and earlier reviews are never replaced.
//  · Dates: a record gives the same year (approximate dates are skipped).
//  · Parents and spouses: the GND record links the same person, or the BnF note names the relative
//    in a filiation or marriage clause together with that relative's exact years of birth and death.
//  · Governments: a record clause names the same kind of office and territory with the same span of years.
// Disagreements on dates are listed for an editor and never applied.
import fs from 'node:fs';
import {TERRITORY_KEYWORDS, TITLE_WORDS} from './territory-keywords-616.mjs';
const {PERSONAS} = await import('../../../src/data/personas.js');
const {personClaims} = await import('../../../src/evidence/claims.js');
const read = f => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : {};
const qids = read('qids.json'), ent = read('entities.json'), status = read('status.json'), gnd = read('gnd.json'), bnf = read('bnf.json'), loc = read('loc.json'), ndb = read('ndb.json');
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const entity = id => status[id] === 'ok' ? ent[qids[id]?.qid] : null;
const gndOf = id => (entity(id)?.gnd || []).find(g => gnd[g] && !gnd[g].missing) || null;
const bnfOf = id => (entity(id)?.bnf || []).find(b => bnf[b] && !bnf[b].missing) || null;
const locOf = id => (entity(id)?.loc || []).find(l => loc[l] && !loc[l].missing) || null;
const yearOf = s => { const m = String(s ?? '').match(/^(-?)(\d{3,4})/); return m ? (m[1] ? -1 : 1) * +m[2] : null; };
const exactOf = s => /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
// BnF coded dates (UNIMARC 103) are YYYYMMDD with dots or question marks for unknown digits.
const bnfDate = s => { const m = String(s || '').trim().match(/^(\d{4})(\d{2})?(\d{2})?$/); if (!m) return null; return m[2] && m[3] && m[2] !== '00' && m[3] !== '00' ? `${m[1]}-${m[2]}-${m[3]}` : m[1]; };
const locDate = s => /^-?\d{4}(-\d{2}(-\d{2})?)?$/.test(s) ? s : null;
const out = {}, mismatches = [], stats = {};
const count = key => { stats[key] = (stats[key] || 0) + 1; };
const segmentAfter = (text, re) => { const m = text.match(re); if (!m) return ''; const rest = text.slice(m.index + m[0].length); const stop = rest.search(/\b(?:père|mère|frère|sœur|soeur|oncle|tante|neveu|nièce|cousine?|petit-fils|petite-fille|grand-père|grand-mère|beau-père|belle-mère|beau-frère|belle-sœur|gendre|bru)\b|\. /); return stop < 0 ? rest : rest.slice(0, stop); };
const lifeSpan = p => Number.isInteger(p?.nac) && Number.isInteger(p?.muer) && !p.nacAprox && !p.muerAprox ? new RegExp(`\\(([^()]*[;,]\\s*)?(?:ca\\s*)?${p.nac}\\??\\s*-\\s*${p.muer}\\??\\s*\\)`) : null;
const sourceFor = {
  gnd: (g, locator, locatorEn) => ({title: `Deutsche Nationalbibliothek · Ficha de autoridad GND · ${gnd[g].name}`, url: `https://d-nb.info/gnd/${g}`, locator, locatorEn}),
  bnf: (b, locator, locatorEn) => ({title: `Bibliothèque nationale de France · Notice d’autorité · ${bnf[b].name}`, url: `https://catalogue.bnf.fr/ark:/12148/cb${b}`, locator, locatorEn}),
  ndb: (g, locator, locatorEn) => ({title: `Neue Deutsche Biographie · ${ndb[g].title}`, url: `https://www.deutsche-biographie.de/${ndb[g].sfz}.html#ndbcontent_genealogie`, locator, locatorEn}),
  loc: (l, locator, locatorEn) => ({title: `Library of Congress · Name Authority File · ${loc[l].name}`, url: `https://id.loc.gov/authorities/names/${l}.html`, locator, locatorEn}),
};

// NDB genealogy lines: «V [sfz…]Albrecht II., Hzg. v. Österr. (1298–1358), S d. …». The relative is the
// first person of the line; a match needs the same NDB article, the same years of life, or the same
// given name in the GND form plus a distinctive part of the name, with no contradicting years.
const STOP = new Set(['de', 'del', 'la', 'von', 'van', 'of', 'the', 'and', 'y', 'und', 'der', 'die', 'das', 'duque', 'conde', 'rey', 'reina']);
const firstYears = line => { const m = line.match(/\((?:[^()]*?\b)?(\d{3,4})\s*[–-]\s*(\d{2,4})\b/); if (!m) return null; const a = +m[1]; let b = +m[2]; if (m[2].length < m[1].length) { b = +String(a).slice(0, m[1].length - m[2].length) * 10 ** m[2].length + b; if (b < a) b += 10 ** m[2].length; } return [a, b]; };
const ndbLine = (N, kind, other, og) => {
  const rel = kind === 'father' ? /^Vater$/ : kind === 'mother' ? /^Mutter$/ : /verheiratet/;
  // A marriage line may list several marriages («⚭ 1) …, 2) …»): each one is checked, and quoted, on its own.
  const pieces = N.lines.filter(line => rel.test(line.rel)).flatMap(line => kind === 'spouse' ? line.text.split(/(?=\b[2-9]\)\s)/) : [line.text]);
  for (const text of pieces) {
    const firstSfz = (text.match(/\[(sfz\d+)\]/) || [])[1];
    const theirs = og && ndb[og] && !ndb[og].missing ? ndb[og].sfz : null;
    if (firstSfz && theirs && firstSfz === theirs) return text;
    const years = firstYears(text), ours = Number.isInteger(other.nac) && Number.isInteger(other.muer) && !other.nacAprox && !other.muerAprox ? [other.nac, other.muer] : null;
    if (years && ours && years[0] === ours[0] && years[1] === ours[1]) return text;
    if (years && ours && (years[0] !== ours[0] || years[1] !== ours[1])) continue;
    const given = og && gnd[og]?.name ? gnd[og].name.split(/[ ,]/)[0] : null;
    const body = text.replace(/\[sfz\d+\]/g, '');
    const tokens = `${other.nombre} ${(other.aliases || []).join(' ')}`.split(/[\s,()'’-]+/).filter(t => t.length >= 4 && !STOP.has(t.toLowerCase()) && !/^[IVX]+$/.test(t));
    if (given && given.length >= 3 && new RegExp(`\\b${given}\\b`).test(body) && tokens.slice(1).some(t => body.includes(t))) return text;
  }
  return null;
};
const REVIEWED_AT = '2026-11-21', EDITOR = 'El Árbol de Europa';
const record = (id, sources, note, noteEn, extra = {}) => { out[id] = {certainty: 'documented', sources, note, noteEn, reviewedAt: REVIEWED_AT, editor: EDITOR, ...extra}; };
const words = {birth: ['nacimiento', 'birth'], death: ['fallecimiento', 'death']};
for (const p of PERSONAS) {
  const g = gndOf(p.id), b = bnfOf(p.id), l = locOf(p.id);
  if (!g && !b && !l) continue;
  const G = g && gnd[g], B = b && bnf[b], L = l && loc[l];
  const clauses = (G?.info || []).flatMap(s => s.split(/[;|]/));
  const notes = B?.note || [];
  const segments = notes.flatMap(n => n.split(/;|\.\s|\s-\s/));
  for (const claim of personClaims(p)) {
    if (claim.certainty !== 'pending') continue;
    const kind = claim.id.split(':')[2];
    if (kind === 'birth' || kind === 'death') {
      if (kind === 'birth' ? p.nacAprox : p.muerAprox) continue;
      const candidates = [];
      if (G) for (const d of (kind === 'birth' ? G.birth : G.death)) candidates.push(['gnd', d]);
      if (B) { const d = bnfDate(kind === 'birth' ? B.birth : B.death); if (d) candidates.push(['bnf', d]); }
      if (L) for (const d of (kind === 'birth' ? L.birth : L.death).map(locDate).filter(Boolean)) candidates.push(['loc', d]);
      if (!candidates.length) continue;
      const hits = candidates.filter(([, d]) => yearOf(d) === claim.value);
      if (!hits.length) { mismatches.push({id: p.id, kind, ours: claim.value, theirs: candidates.map(([s, d]) => `${s.toUpperCase()} ${d}`).join('; ')}); continue; }
      const sources = [...new Set(hits.map(([s]) => s))].map(s => sourceFor[s](s === 'gnd' ? g : s === 'bnf' ? b : l,
        s === 'bnf' ? `Notice d’autorité: dates (zone 103)` : `Datos vitales: fecha de ${words[kind][0]}`,
        s === 'bnf' ? `Authority record: dates (field 103)` : `Vital data: date of ${words[kind][1]}`));
      const exact = hits.map(([, d]) => exactOf(d)).find(Boolean);
      const shown = exact || claim.value, list = sources.map(s => s.url.includes('d-nb') ? 'GND' : s.url.includes('bnf') ? 'BnF' : 'Library of Congress').join(', ');
      record(claim.id, sources, `Las fichas de autoridad (${list}) registran el ${words[kind][0]} en ${shown}.`, `The authority records (${list}) give the ${words[kind][1]} as ${shown}.`, exact ? {exactDate: exact} : {});
      count(kind);
    } else if (kind === 'father' || kind === 'mother' || kind === 'spouse') {
      const other = byId.get(claim.value); if (!other) continue;
      const relation = kind === 'spouse' ? ['cónyuge', 'spouse'] : kind === 'father' ? ['padre', 'father'] : ['madre', 'mother'];
      const sources = [];
      const og = gndOf(other.id);
      if (G && og) {
        const linked = kind === 'spouse' ? (G.spouses.includes(og) || gnd[og].spouses?.includes(g)) : (G.parents.includes(og) || gnd[og].children?.includes(g));
        if (linked) sources.push(sourceFor.gnd(g, `Relaciones con personas: ${relation[0]} → GND ${og}`, `Related persons: ${relation[1]} → GND ${og}`));
      }
      const span = lifeSpan(other);
      if (B && span) {
        const re = kind === 'spouse' ? /\b(?:épouse|époux|femme|mari|veuve|veuf|mariée?)\b(?: en \d{4})?(?: (?:de|du|d’|d'))?/ : /\b(?:fils|fille)\b[^()]*?\b(?:de|du|d’|d')\b/;
        const hit = notes.find(n => span.test(segmentAfter(n, re)));
        if (hit) sources.push(sourceFor.bnf(b, `Note biographique: «${hit.slice(0, 180)}»`, `Biographical note: “${hit.slice(0, 180)}”`));
      }
      const N = g && ndb[g] && !ndb[g].missing && ndb[g].lines?.length && ndb[g].sfz ? ndb[g] : null;
      const line = N && ndbLine(N, kind, other, og);
      if (line) sources.push(sourceFor.ndb(g, `Genealogía: «${line.slice(0, 180)}»`, `Genealogy: “${line.slice(0, 180)}”`));
      if (!sources.length) continue;
      const name = other.nombre;
      record(claim.id, sources, `La ficha de autoridad identifica a ${name} como ${relation[0]}.`, `The authority record identifies this person’s ${relation[1]}.`);
      count(kind);
    } else if (claim.field === 'Gobierno') {
      const m = claim.value, kw = TERRITORY_KEYWORDS[m.territorio], tw = TITLE_WORDS[m.titulo];
      if (!kw || !Number.isInteger(m.desde) || !Number.isInteger(m.hasta)) continue;
      const span = new RegExp(`\\b(?:de\\s+)?${m.desde}\\s*(?:-|–|bis|à)\\s*${m.hasta}\\b`);
      const sources = [];
      const gc = clauses.find(c => span.test(c) && kw.test(c) && (!tw || tw.test(c) || !/König|Herzog|Graf|Fürst|Kaiser|Papst/.test(c)));
      if (gc) sources.push(sourceFor.gnd(g, `Datos biográficos: «${gc.trim().slice(0, 160)}»`, `Biographical data: “${gc.trim().slice(0, 160)}”`));
      const bc = segments.find(c => span.test(c) && kw.test(c) && tw && tw.test(c));
      if (bc) sources.push(sourceFor.bnf(b, `Note biographique: «${bc.trim().slice(0, 160)}»`, `Biographical note: “${bc.trim().slice(0, 160)}”`));
      if (!sources.length) continue;
      record(claim.id, sources, `La ficha de autoridad fecha este cargo en ${m.desde}–${m.hasta}.`, `The authority record dates this office to ${m.desde}–${m.hasta}.`);
      count('government');
    }
  }
}
fs.writeFileSync('reviews616.json', JSON.stringify(out));
fs.writeFileSync('mismatches616.json', JSON.stringify(mismatches));
console.log(stats, 'total', Object.keys(out).length, 'date disagreements', mismatches.length);
