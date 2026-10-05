// Refresh a curated Balkan layer without recomputing unchanged geometric
// crosswalks. The full Python builder produces the same merge.
import fs from 'node:fs';
const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url)));
const data = read('corridor-locations.json');
const balkans = read('hungary-balkans-locations.json');
const canonical = read('corridor-overrides.json');
const names = new Set(balkans.territories.map(t => t.name));
const key = o => [o.territory,o.id,o.action,o.from,o.through].join('|');
const canonicalKeys = new Set(canonical.map(key));
data.additionalTerritories = balkans.territories;
data.overrides = [
  ...canonical,
  ...data.overrides.filter(o => !names.has(o.territory) && !canonicalKeys.has(key(o))),
  ...balkans.evidence.flatMap(e => e.ids.map(id => ({territory:e.territory, id,
    action:'add', from:e.from, through:e.through, reason:e.reason, source:e.source}))),
];
fs.writeFileSync(new URL('corridor-locations.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${balkans.territories.length} Balkan layers with ${balkans.evidence.length} sourced groups`);
