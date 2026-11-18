import {spawnSync} from 'node:child_process';

// Excepciones temporales y documentadas: el aviso no tiene versión corregida.
// picomatch (ReDoS con extglobs) llega solo mediante Vite/tinyglobby y se usa en
// compilación con patrones propios. Retirar al publicarse un parche.
export const ACCEPTED_ADVISORIES = new Map([
  ['GHSA-fc5q-39xc-vjpf', 'acordado el 2026-11-18; sin parche publicado; solo compilación'],
]);

export function blockingVulnerabilities(report, accepted = ACCEPTED_ADVISORIES) {
  const blocking = [];
  for (const [name, vuln] of Object.entries(report.vulnerabilities || {})) {
    if (!['high', 'critical'].includes(vuln.severity)) continue;
    const direct = (vuln.via || []).filter(item => typeof item === 'object');
    // Un paquete que solo hereda avisos aceptados no bloquea.
    if (direct.length && direct.every(item => accepted.has(String(item.url || '').split('/').pop()))) continue;
    if (!direct.length && (vuln.via || []).every(via => typeof via === 'string')) continue; // la causa se evalúa en su origen
    blocking.push(`${name} (${vuln.severity})`);
  }
  return blocking;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['audit', '--json'], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  const report = JSON.parse(result.stdout || '{}');
  if (report.error) throw new Error(`npm audit no pudo ejecutarse: ${report.error.summary || report.error.code}`);
  const blocking = blockingVulnerabilities(report);
  if (blocking.length) {
    console.error(`Dependencias con avisos high/critical sin excepción:\n${blocking.join('\n')}`);
    process.exit(1);
  }
  console.log(`Dependencias: sin avisos high/critical fuera de las excepciones (${[...ACCEPTED_ADVISORIES.keys()].join(', ')}).`);
}
