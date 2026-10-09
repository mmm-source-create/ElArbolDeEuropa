import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {staticHeadersFile} from '../cloudflare/routing.js';

// Solo para CI o recompilación local después de un build auditado completo.
const args = ['run', 'build'];
if (process.argv.includes('--reuse-generated')) args.push('--ignore-scripts');
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
  stdio: 'inherit', env: {...process.env, VITE_HOSTING_PROVIDER: 'cloudflare'}
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

await fs.writeFile('dist/_headers', staticHeadersFile());
// El informe y el manifiesto son de revisión, no recursos para visitantes.
await fs.writeFile('dist/.assetsignore', '.vite/\nssg-report.json\n');
console.log('Build Cloudflare: rutas compatibles, cabeceras de seguridad y medición de Vercel desactivada.');
