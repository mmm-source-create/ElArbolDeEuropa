import fs from 'node:fs/promises';
import path from 'node:path';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {projectRoot, readJson} from './schema/read-contract-data.mjs';
import {canonical} from './schema/canonical.mjs';
import {dataSnapshot, publicSnapshot, snapshotDifferences} from './schema/regression-snapshot.mjs';

const file = path.join(projectRoot, 'tests/baselines/v5-regression.json');
const args = process.argv.slice(2);
const write = args.includes('--write');
const publicOnly = args.includes('--public');
const reason = args[args.indexOf('--reason') + 1];
if (write && (!args.includes('--reason') || !reason?.trim() || reason.startsWith('--'))) throw new Error('Actualizar la base exige --reason con una explicación que se revise en la PR');
if (write && publicOnly) throw new Error('La actualización debe comprobar datos y páginas juntos');
const actual = {};
if (!publicOnly) actual.data = await dataSnapshot({people: PERSONAS, territories: TERRITORIOS,
  mapData: await readJson('prototypes/euv-locations/corridor-locations.json'), root: projectRoot,
  onProgress: year => console.log(`Regresión V5: comprobado ${year}`)});
if (publicOnly || write) actual.public = await publicSnapshot(projectRoot);
if (write) {
  await fs.writeFile(file, JSON.stringify(canonical({schema: 1,
    origin: 'ef6b5cf47ed6d9bd4fa7c3653fac0be7dc0ad3c6', reason: reason.trim(), ...actual}), null, 2) + '\n');
  console.log('Base actualizada. Revisar su diff y justificar los cambios históricos o funcionales en la PR.');
} else {
  const baseline = JSON.parse(await fs.readFile(file, 'utf8'));
  if (baseline.schema !== 1) throw new Error('Versión de base de regresión no admitida');
  const differences = Object.keys(actual).flatMap(key => snapshotDifferences(baseline[key], actual[key], key));
  for (const difference of differences.slice(0, 50)) console.error(`Cambio frente a V5: ${difference}`);
  if (differences.length > 50) console.error(`… y ${differences.length - 50} diferencias adicionales`);
  console.log(publicOnly ? `Regresión pública V5: ${Object.keys(actual.public.pages).length} fichas; ${differences.length} diferencias.`
    : `Regresión de datos V5: 601 años, mapas completos y personales; ${differences.length} diferencias.`);
  if (differences.length) process.exitCode = 1;
}
