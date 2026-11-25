// 6.2.4 · Historial de direcciones publicadas.
// Cada ficha o historia que ha tenido una URL pública debe seguir respondiendo:
// con su página o con una redirección permanente (routes.json) a una página
// publicada. Así un cambio de slug no deja enlaces ni resultados de Google en 404.
//   node scripts/audits/audit-url-history.mjs          comprueba dist/ssg-report.json
//   node scripts/audits/audit-url-history.mjs --write  añade las URL publicadas ahora
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {resolveHostingRoute} from '../../cloudflare/routing.js';

export const HISTORY_FILE = 'tests/baselines/published-urls.txt';
export const RECORD_URL = /^\/(?:es|en)\/(?:persona|person|dinastia|dynasty|territorio|territory|historia|story)\/[a-z0-9-]+(?:\/(?:capitulo|chapter)\/\d+)?$/;

export function urlHistoryIssues(history, live) {
  const issues = [];
  for (const url of history) {
    if (live.has(url)) continue;
    const route = resolveHostingRoute(new URL(url, 'https://www.treeofeurope.eu'));
    if (!route.redirect) issues.push(`${url}: sin página ni redirección`);
    else if (!route.status || ![301, 308].includes(route.status)) issues.push(`${url}: redirección no permanente`);
    else if (!live.has(new URL(route.redirect, 'https://www.treeofeurope.eu').pathname)) issues.push(`${url}: redirige a ${route.redirect}, que no está publicada`);
  }
  return issues;
}

const readLines = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean) : [];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = JSON.parse(fs.readFileSync('dist/ssg-report.json', 'utf8'));
  if (report.mode !== 'full') throw new Error('El historial de URL requiere un build completo');
  const live = new Set(report.pages.map(page => page.path));
  const history = readLines(HISTORY_FILE);
  const issues = urlHistoryIssues(history, live);
  if (issues.length) {
    console.error(`Historial de URL: ${issues.length} direcciones publicadas dejarían de responder:\n${issues.slice(0, 40).join('\n')}`);
    process.exit(1);
  }
  if (process.argv.includes('--write')) {
    const next = [...new Set([...history, ...[...live].filter(url => RECORD_URL.test(url))])].sort();
    fs.writeFileSync(HISTORY_FILE, `${next.join('\n')}\n`);
    console.log(`Historial de URL: ${next.length} direcciones (${next.length - history.length} nuevas).`);
  } else console.log(`Historial de URL: ${history.length} direcciones publicadas siguen respondiendo.`);
}
