import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {projectRoot} from '../lib/project-paths.mjs';

const catalogue = JSON.parse(fs.readFileSync(path.join(projectRoot, 'docs/artifact-catalog.json'), 'utf8'));
if (catalogue.schema !== 1) throw new Error('Versión del catálogo de archivos no admitida');
const listed = new Set();
for (const file of catalogue.files) {
  if (listed.has(file.path)) throw new Error(`Archivo duplicado: ${file.path}`);
  listed.add(file.path);
  if (!catalogue.kinds.includes(file.kind)) throw new Error(`Clase desconocida: ${file.path}`);
  if (!fs.statSync(path.join(projectRoot, file.path)).isFile()) throw new Error(`Falta archivo: ${file.path}`);
  if (file.producer && !fs.existsSync(path.join(projectRoot, file.producer))) throw new Error(`Falta generador: ${file.producer}`);
}
const candidates = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--',
  'data/cartography', 'labs/cartography', 'docs/reports/reviewed'], {cwd: projectRoot, encoding: 'utf8'}).split('\0').filter(Boolean);
for (const file of new Set(candidates)) {
  // During a move, Git can still list the removed original until it is staged.
  if (!fs.existsSync(path.join(projectRoot, file))) continue;
  if (!listed.has(file)) throw new Error(`Archivo sin clasificar: ${file}`);
}
console.log(`Archivos cartográficos y resultados revisados: ${listed.size} clasificados; 0 ausencias.`);
