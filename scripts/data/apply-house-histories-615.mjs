// 6.0.15: writes the English histories of src/content/dinastias/casas-v615.js
// into the v6 batch files: summary, origin, history, legacy and sources, and the
// same English text in translatedSource, which holds the translated edition.
// Usage: node scripts/data/apply-house-histories-615.mjs
import fs from 'node:fs';
import {CASAS_V615_EN} from '../../src/content/dinastias/casas-v615.js';

let updated = 0;
for (let batch = 1; batch <= 6; batch++) {
  const file = `src/features/english/v6/batch-${batch}/dynasties.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  for (const entry of Object.values(data)) {
    const en = CASAS_V615_EN[entry.key];
    if (!en) continue;
    Object.assign(entry, {summary: en.summary, origin: en.origin, history: en.history, legacy: en.legacy, editorial: true, sources: en.sources});
    Object.assign(entry.translatedSource, {editorial: true, resumen: en.summary, origen: en.origin, trayectoria: en.history, legado: en.legacy, fuentes: en.sources.map(source => source.url)});
    changed = true; updated++;
  }
  if (changed) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}
console.log(`Historias de casas en inglés: ${updated}/${Object.keys(CASAS_V615_EN).length}`);
if (updated !== Object.keys(CASAS_V615_EN).length) process.exitCode = 1;
