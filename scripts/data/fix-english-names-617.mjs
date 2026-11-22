// 6.0.17 one-off: English texts of the v6 batches still quoted people by their Spanish name
// («Inés de Beaujeu», «Theobaldo I», «Beatriz de Núremberg»). Each Spanish name of a person with a
// different English name is replaced by that English name. Keys, slugs, aliases and Spanish names stay.
// Usage: node --import ./tests/jsx-loader.mjs scripts/data/fix-english-names-617.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
const {PERSONAS} = await import('../../src/data/personas.js');
const {COMPLETE_ENGLISH_PROFILES} = await import('../../src/features/english/fullProfiles.js');
const {repairEnglishPresentation} = await import('../../src/features/english/nameCorrections.js');
const root = new URL('../../src/features/english/v6/', import.meta.url).pathname;
const DRY = process.argv.includes('--dry');
const map = new Map();
const ambiguous = new Set();
for (const p of PERSONAS) {
  const english = repairEnglishPresentation(COMPLETE_ENGLISH_PROFILES[p.id] || {})?.name;
  if (!english) continue;
  for (const spanish of new Set([p.nombre, p.nombre.replace(/ de /, ' of ')])) {
    if (spanish === english || spanish.split(' ').length < 2 || spanish.length < 8) continue;
    if (map.has(spanish) && map.get(spanish) !== english) ambiguous.add(spanish);
    map.set(spanish, english);
  }
}
for (const name of ambiguous) map.delete(name);
// An English name already used for a different person cannot be the target of a namesake's Spanish form.
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const names = [...map.keys()].sort((a, b) => b.length - a.length);
const pattern = new RegExp(`(?<![\\p{L}’'-])(${names.map(esc).join('|')})(?![\\p{L}’'-])`, 'gu');
const SKIP = new Set(['es', 'key', 'slug', 'aliases', 'searchAliases', 'sourceFile', 'nombre', 'url', 'en', 'id', 'assigned', 'slugName', 'esPath', 'path', 'archivo', 'titulo_es']);
let changes = 0; const samples = [];
const fix = text => text.replace(pattern, name => map.get(name));
const walk = (value, key) => {
  if (typeof value === 'string') { if (SKIP.has(key)) return value; const out = fix(value); if (out !== value) { changes++; if (samples.length < 30) samples.push(`${value.slice(0, 100)}\n   → ${out.slice(0, 100)}`); } return out; }
  if (Array.isArray(value)) return value.map(item => walk(item, key));
  if (value && typeof value === 'object') { for (const k of Object.keys(value)) if (!SKIP.has(k)) value[k] = walk(value[k], k); return value; }
  return value;
};
for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-'))) {
  for (const file of ['notes.json', 'labels.json', 'people.json', 'dynasties.json', 'territories.json', 'stories.json', 'portraits.json']) {
    const full = path.join(root, batch, file);
    if (!fs.existsSync(full)) continue;
    const before = fs.readFileSync(full, 'utf8');
    const data = JSON.parse(before);
    if (['notes.json', 'labels.json'].includes(file)) { for (const k of Object.keys(data)) if (typeof data[k] === 'string') data[k] = walk(data[k], 'value'); }
    else {
      if (file === 'people.json') for (const profile of Object.values(data)) if (profile?.name && !profile.slugName && fix(profile.name) !== profile.name) profile.slugName = profile.name;
      walk(data, 'root');
    }
    const after = `${JSON.stringify(data, null, 2)}\n`;
    if (!DRY && after !== before) fs.writeFileSync(full, after);
  }
}
console.log(samples.join('\n'));
console.log(`${DRY ? 'Would change' : 'Changed'} ${changes} English texts (${map.size} names).`);
