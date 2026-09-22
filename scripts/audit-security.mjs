import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {SECURITY_HEADERS, MAIN_FRAME_SOURCE, EMBED_SOURCES, EMBED_CSP} from './security-policy.mjs';

// Complemento local a Secret Scanning de GitHub. Nunca muestra el valor hallado.
const secretPatterns = [
  ['clave privada', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['token de GitHub', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/g],
  ['clave de AWS', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['clave de Google', /\bAIza[A-Za-z0-9_-]{30,}\b/g],
  ['token de Slack', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
];
export function secretFindings(text) {
  return secretPatterns.flatMap(([kind, pattern]) => [...text.matchAll(pattern)].map(match => ({
    kind, line: text.slice(0, match.index).split('\n').length,
  })));
}
export function activeSvgContent(svg) {
  return /<\s*(?:script|foreignObject)\b|\bon\w+\s*=|javascript\s*:/i.test(svg);
}
export async function auditSecurity() {
  const issues = [];
  const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
  const headers = [...(config.headers?.find(rule => rule.source === '/(.*)')?.headers || []), ...(config.headers?.find(rule => rule.source === MAIN_FRAME_SOURCE)?.headers || [])];
  for (const expected of SECURITY_HEADERS) {
    if (!headers?.some(h => h.key.toLowerCase() === expected.key.toLowerCase() && h.value === expected.value)) issues.push(`Cabecera ausente o desactualizada: ${expected.key}`);
  }
  for (const source of EMBED_SOURCES) {
    const hs=config.headers?.find(rule=>rule.source===source)?.headers||[];
    if(!hs.some(h=>h.key==='Content-Security-Policy'&&h.value===EMBED_CSP)||hs.some(h=>h.key==='X-Frame-Options'))issues.push(`Política de inserción incorrecta: ${source}`);
  }
  if (activeSvgContent(await fs.readFile('src/MapChart_Map.svg', 'utf8'))) issues.push('El SVG del mapa contiene contenido activo no permitido.');
  const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {encoding: 'utf8'}).split('\0').filter(Boolean);
  for (const file of new Set(files)) {
    if (/(^|\/)(\.env(?:\..*)?|id_rsa|id_ed25519)$|\.(pem|key)$/i.test(file)) issues.push(`Archivo sensible versionable: ${file}`);
    if (/\.(png|jpe?g|webp|woff2?)$/i.test(file)) continue;
    let text;
    try { text = await fs.readFile(file, 'utf8'); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    for (const found of secretFindings(text)) issues.push(`${file}:${found.line}: posible ${found.kind}`);
  }
  if (issues.length) throw new Error(issues.join('\n'));
  console.log('Seguridad del repositorio: cabeceras, SVG y patrones de secretos; 0 incidencias.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await auditSecurity();
