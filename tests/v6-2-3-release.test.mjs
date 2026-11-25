import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Workers Builds regenerates the data without repeating the CI audits', () => {
  const build = read('scripts/build-cloudflare.mjs');
  assert.match(build, /SKIP_AUDITS=process\.env\.WORKERS_CI==='1'/);
  // On Workers Builds: the English runtime and generate, never audit:build.
  assert.match(build, /if\(SKIP_AUDITS\)\{run\(process\.execPath,\['scripts\/generate\/generate-english-v6-runtime\.mjs'\]\);run\(npm,\['run','generate'\]\);\}/);
  assert.match(build, /else run\(npm,\['run','prebuild'\]\);/);
  // Everywhere else prebuild still runs the audits, and GitHub CI runs prebuild through npm run build.
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.scripts.prebuild, /npm run audit:build/);
  assert.match(pkg.scripts.prebuild, /npm run generate$/);
  assert.match(read('.github/workflows/ci.yml'), /- run: npm run build\n/);
  // The checks on the built pages stay in the Cloudflare build.
  assert.match(build, /scripts\/audits\/audit-ssg\.mjs/);
  assert.match(build, /audit-story-editorial\.mjs','--built'/);
});
