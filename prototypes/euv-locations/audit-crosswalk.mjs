// Run from the repository root:
// node --import ./tests/jsx-loader.mjs prototypes/euv-locations/audit-crosswalk.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { REINO_A_IDS, REINO_VERSIONES } from '../../src/Territorios.jsx';

const here = new URL('./', import.meta.url);
const svg = readFileSync(new URL('euv-locations-crop.svg', here), 'utf8');
const locationIds = new Set([...svg.matchAll(/<path\s+id="([^"]+)"/g)].map(match => match[1]));
const provinces = new Set(Object.values(REINO_A_IDS).flat());
for (const versions of Object.values(REINO_VERSIONES)) {
  for (const version of versions) for (const id of version.ids || []) provinces.add(id);
}

const report = {
  note: 'An identical ID is a toponymic candidate, not a validated one-to-one polygon or jurisdiction.',
  legacyIds: provinces.size,
  exactIdCandidates: [...provinces].filter(id => locationIds.has(id)).length,
  missingIdCandidates: [...provinces].filter(id => !locationIds.has(id)).sort(),
  realms: Object.fromEntries(Object.entries(REINO_A_IDS).map(([realm, ids]) => [realm, {
    provinceIds: ids.length,
    exactIdCandidates: ids.filter(id => locationIds.has(id)),
    missingIds: ids.filter(id => !locationIds.has(id)),
  }])),
};
const output = fileURLToPath(new URL('crosswalk-report.json', here));
writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(`${report.exactIdCandidates}/${report.legacyIds} legacy IDs have an identically named location within the crop; ${report.missingIdCandidates.length} need a geographic crosswalk.`);
