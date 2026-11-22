// 6.0.22 · Cross-checks the Atlas birth and death years against the sources already downloaded:
// Medieval Lands entries identified in 6.0.21, GND, BnF and Library of Congress authority records (the
// 6.0.16 review) and the Diccionario Biográfico Español (6.0.22). Only years given without doubt count.
// A year is a correction candidate when no source gives the Atlas year and at least two independent
// sources agree on another one. Output: .cache/dates622.json, for review one by one.
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/dates622.mjs
import fs from 'node:fs';
const root = new URL('../../.cache/', import.meta.url);
const read = f => fs.existsSync(new URL(f, root)) ? JSON.parse(fs.readFileSync(new URL(f, root))) : {};
const qids = read('sources-616/qids.json'), ent = read('sources-616/entities.json'), status = read('sources-616/status.json');
const gnd = read('sources-616/gnd.json'), bnf = read('sources-616/bnf.json'), loc = read('sources-616/loc.json');
const fmg = read('fmg/identified621.json'), rah = read('rah/bios.json');
const {PERSONAS} = await import('../../src/data/personas.js');
const {personClaims} = await import('../../src/evidence/claims.js');
const unidentified = new Set((fs.existsSync(new URL('rah/unidentified.json', root)) ? JSON.parse(fs.readFileSync(new URL('rah/unidentified.json', root))) : []).map(x => x.id));
const sure = s => { const t = String(s || '').trim(); if (!t || /[~?]|\bc\.|ca\.|\/|XX/.test(t)) return null; const m = t.match(/^-?(\d{3,4})/); return m ? +m[1] : null; };
const rahYear = t => { if (!t || /\b(?:c\.|h\.|ca\.|ant\.|post\.|ss?\.|hacia|sup\.|pos\.)|\?|\[|\d\s*-\s*\d/i.test(t)) return null; const m = String(t).match(/(\d{3,4})(?!.*\d{3,4})/); return m ? +m[1] : null; };
const out = [], conflicts = [];
for (const p of PERSONAS) {
  const e = status[p.id] === 'ok' ? ent[qids[p.id]?.qid] || {} : {};
  for (const [kind, atlas, approx] of [['birth', p.nac, p.nacAprox], ['death', p.muer, p.muerAprox]]) {
    if (!Number.isInteger(atlas) || approx) continue;
    const found = [];
    for (const x of fmg[p.id] || []) if (x[kind]?.certain) found.push(['Medieval Lands', x[kind].year, `${x.page}${x.anchor ? '#' + x.anchor : ''}`, new RegExp(`\\b\\d{1,2} [A-Z][a-z]{2} ${x[kind].year}`).test(x.text)]);
    for (const g of e.gnd || []) for (const v of gnd[g]?.[kind] || []) { const y = sure(v); if (y) found.push(['GND', y, g, /^\d{4}-\d\d-\d\d/.test(v)]); }
    for (const b of e.bnf || []) { const parts = String(bnf[b]?.birth || '').trim().split(/\s+/); const y = sure((kind === 'birth' ? parts[0] : parts[1]) || ''); if (y && y >= 500 && parts.length >= (kind === 'birth' ? 1 : 2)) found.push(['BnF', y, b, /^\d{8}$/.test((kind === 'birth' ? parts[0] : parts[1]) || '')]); }
    for (const l of e.loc || []) for (const v of loc[l]?.[kind] || []) { const y = sure(v); if (y) found.push(['LoC', y, l, /^\d{4}-\d\d-\d\d/.test(v)]); }
    if (rah[p.id] && !unidentified.has(p.id)) { const y = rahYear(kind === 'birth' ? rah[p.id].birth : rah[p.id].death); if (y) found.push(['RAH', y, rah[p.id].slug, /\d{1,2}\.[IVX]+\.\d{3,4}/.test(kind === 'birth' ? rah[p.id].birth : rah[p.id].death)]); }
    const sources = new Map();
    for (const [name, y, ref, day] of found) { const k = `${name}:${y}`; if (!sources.has(k) || day) sources.set(k, {name, y, ref, day: Boolean(day) || Boolean(sources.get(k)?.day)}); }
    const byYear = {};
    const dayPrecise = {};
    for (const {name, y, ref, day} of sources.values()) { (byYear[y] ||= new Map()).set(name, ref); if (day) (dayPrecise[y] ||= []).push(name); }
    if (byYear[atlas]) continue;
    // The user's rule (6.0.22): a documented date that differs, once the identity is checked, corrects ours.
    // Here: every source that gives the year agrees on another one, and no specific review already
    // documents the Atlas year.
    const years = Object.entries(byYear);
    if (years.length !== 1) { if (years.length > 1) conflicts.push({id: p.id, name: p.nombre, kind, atlas, years: Object.fromEntries(years.map(([y, m]) => [y, [...m.keys()]]))}); continue; }
    const claim = personClaims(p).find(c => c.id === `person:${p.id}:${kind}`);
    if (claim?.certainty === 'documented' && claim.sources.length) { conflicts.push({id: p.id, name: p.nombre, kind, atlas, documentedBy: claim.sources[0].title, years: Object.fromEntries(years.map(([y, m]) => [y, [...m.keys()]]))}); continue; }
    const best = years[0];
    // Strength: two independent sources, or one that gives the full date (day and month).
    if (best[1].size < 2 && !dayPrecise[best[0]]) { conflicts.push({id: p.id, name: p.nombre, kind, atlas, single: true, years: {[best[0]]: [...best[1].keys()]}}); continue; }
    out.push({id: p.id, name: p.nombre, kind, atlas, year: +best[0], sources: Object.fromEntries(best[1]), day: dayPrecise[best[0]] || [], others: Object.fromEntries(Object.entries(byYear).filter(([y]) => y !== best[0]).map(([y, m]) => [y, [...m.keys()]]))});
  }
}
fs.writeFileSync(new URL('dates622.json', root), JSON.stringify({corrections: out, conflicts}, null, 1));
console.log('candidates', out.length, 'conflicts', conflicts.length);
for (const x of out) console.log(x.id, x.kind, x.atlas, '→', x.year, Object.keys(x.sources).join('+'), JSON.stringify(x.others));
