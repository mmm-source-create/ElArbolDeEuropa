import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TRIBUTARY_RELATIONS, tributaryLayerRelation} from '../src/cartography/tributaryRelations.js';
import {tributaryColor} from '../src/cartography/mapColors.js';
import {mosaicAuthorityKind} from '../src/cartography/mosaicAuthorityKind.js';
import {englishNote, englishLabel} from '../src/features/english/v6/atlasPresentation.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the Sharifate of Mecca is a dependency under Mamluk and then Ottoman sovereignty, not a tributary', () => {
  const name = year => `Jerifato de La Meca · ${year < 1517 ? '1200–1516' : '1517–1800'} · revisión Oriente Medio ${year < 1517 ? 117 : 118}`;
  assert.equal(tributaryLayerRelation(name(1250), 1250), null);
  const mamluk = tributaryLayerRelation(name(1400), 1400), ottoman = tributaryLayerRelation(name(1600), 1600);
  assert.equal(mamluk.id, 'hejaz-mamluk');
  assert.equal(ottoman.id, 'hejaz-ottoman');
  for (const relation of [mamluk, ottoman]) {
    // Vertical lines (own government under a suzerain), never the tributary dots.
    assert.equal(relation.type, 'feudo');
    assert.equal(mosaicAuthorityKind([{tributaryRelation: relation}]), 'apanage');
    assert.match(relation.sources[0].url, /islamansiklopedisi\.org\.tr\/mekke$/);
    assert.notEqual(englishNote(relation.note), relation.note, relation.id);
    assert.notEqual(englishLabel(relation.subjectLabel), relation.subjectLabel, relation.id);
  }
  assert.equal(ottoman.from, 1517);
  assert.match(ottoman.note, /no pagan tributo/);
  assert.notEqual(tributaryColor(ottoman, 1600), tributaryColor(mamluk, 1400));
  // The layer no longer calls the sharifs' autonomy tributary.
  const layer = JSON.parse(read('data/cartography/corridor-locations.json')).additionalTerritories.find(t => t.name.startsWith('Jerifato de La Meca · 1517'));
  assert.equal(layer.authorityCondition, 'autoridad regional');
  assert.ok(TRIBUTARY_RELATIONS.filter(r => r.subject === 'Jerifato de La Meca').every(r => r.type === 'feudo'));
});

test('SEO II: the portrait is fetched first and the hydration code waits for the page', () => {
  assert.match(read('src/features/public/PersonPage.jsx'), /decoding="async" fetchPriority="high"/);
  assert.doesNotMatch(read('scripts/lib/ssg-utils.mjs'), /rel=\\?"modulepreload\\?"/);
  const main = read('src/app/main.jsx');
  assert.match(main, /const afterPaint=\(\)=>nextFrame\(\(\)=>setTimeout\(hydrate,0\)\);\s*if\(document\.readyState==='complete'\)afterPaint\(\);\s*else window\.addEventListener\('load',afterPaint,\{once:true\}\);/);
  // The entry point loads no page data module up front: staticData.js reaches the
  // English routes (about 800 KB compressed) and now comes with the page code.
  assert.doesNotMatch(main, /^import .*staticData\.js/m);
  assert.match(main, /import\('\.\.\/features\/public\/staticData\.js'\)/);
  assert.match(main, /params\.get\('atlas'\)!=='1'/);
  assert.doesNotMatch(main, /^import .*pageTransport\.js/m);
});
