import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import path from 'node:path';

// Importaciones estáticas relativas (las dinámicas con import() no cuentan: crean su propio chunk).
const IMPORT = /(?:import|export)\s*(?:[^'"`;]*?\bfrom\s*)?['"](\.{1,2}\/[^'"?]+)(?:\?[^'"]*)?['"]/g;
const reach = entry => {
  assert.ok(existsSync(entry), `No existe ${entry}`);
  const seen = new Set(), stack = [path.normalize(entry)];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    if (/\.(m?js|jsx)$/.test(file)) for (const [, spec] of readFileSync(file, 'utf8').matchAll(IMPORT)) stack.push(path.normalize(path.join(path.dirname(file), spec)));
  }
  return seen;
};
const heavy = files => [...files].filter(f => /locationMapPilot\.js$|cartography\/regions\/.*(Routes\.js|RouteData\.json)$/.test(f));

test('la portada y App no cargan las fichas, el Atlas ni las evidencias al arrancar', () => {
  for (const entry of ['src/app/App.jsx', 'src/features/public/HomePage.jsx']) {
    const files = reach(entry);
    for (const module of ['src/features/public/PublicSite.jsx', 'src/features/atlas/Explorer.jsx', 'src/evidence/claims.js'])
      assert.ok(!files.has(module), `${entry} alcanza ${module}`);
    assert.deepEqual(heavy(files), [], `${entry} alcanza cartografía pesada`);
  }
});

test('las fichas ligeras no cargan evidencias ni cartografía', () => {
  for (const page of ['public/DynastyPage', 'public/TerritoryPage', 'stories/StoryPage']) {
    const files = reach(`src/features/${page}.jsx`);
    assert.ok(!files.has('src/evidence/claims.js'), `${page} alcanza las evidencias`);
    assert.ok(!files.has('src/features/public/PublicSite.jsx'), `${page} alcanza PublicSite`);
    assert.deepEqual(heavy(files), [], `${page} alcanza cartografía pesada`);
  }
});

test('la ficha de persona no carga el piloto del mapa ni las rutas regionales', () => {
  assert.deepEqual(heavy(reach('src/features/public/PublicSite.jsx')), []);
});
