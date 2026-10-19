import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {TRIBUTARY_RELATIONS, tributaryLayerRelation} from '../src/cartography/tributaryRelations.js';
import {aragonCrownRelation} from '../src/cartography/aragonCrownRelations.js';
import {REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {ESCUDOS, escudoDe, CREDITOS_ESCUDOS} from '../src/content/dinastias/escudos.js';
import {OG_FREE_LICENCE, ogArmsCreditFile} from '../src/features/public/ogImages.js';
import {personClaims} from '../src/evidence/claims.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const data = JSON.parse(read('data/cartography/corridor-locations.json'));
data.burgundy = JSON.parse(read('data/cartography/burgundian-locations.json'));
const mosaics = new Map();
const layersAt = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  return mosaics.get(year).byLocation.get(id) || [];
};
const relationAt = (year, id) => layersAt(year, id).map(l => l.tributaryRelation?.id).find(Boolean) || null;
const colorAt = (year, id) => layersAt(year, id)[0]?.mosaicColor;
const person = id => PERSONAS.find(p => p.id === id);

test('el panorama marca los tributarios otomanos solo en los años documentados', () => {
  assert.equal(relationAt(1560, 'Bucharest'), 'wallachia-ottoman');
  assert.equal(relationAt(1560, 'Iasi'), 'moldavia-ottoman');
  assert.equal(relationAt(1560, 'Cluj'), 'transylvania-ottoman');
  assert.equal(relationAt(1395, 'Bucharest'), null);
  // Michael the Brave's revolt and the Habsburg advance break the dependency.
  for (const id of ['Bucharest', 'Iasi', 'Cluj']) assert.equal(relationAt(1600, id), null, id);
  assert.equal(relationAt(1700, 'Cluj'), null);
  const tints = new Set(['Bucharest', 'Iasi', 'Cluj'].map(id => colorAt(1560, id)));
  assert.equal(tints.size, 3);
  assert.ok(!tints.has(REINO_COLOR['Imperio otomano']));
  assert.ok(layersAt(1560, 'Bucharest').every(l => l.tributaryRelation && !l.crownRelation));
});

test('la Prusia de la Orden, la Prusia ducal y Curlandia dependen de Polonia', () => {
  assert.equal(relationAt(1480, 'Konigsberg'), 'prussia-order-poland');
  assert.equal(relationAt(1510, 'Konigsberg'), null);
  assert.equal(relationAt(1600, 'Konigsberg'), 'prussia-poland');
  assert.equal(relationAt(1660, 'Konigsberg'), null);
  assert.equal(relationAt(1600, 'Jelgava'), 'courland-commonwealth');
  assert.notEqual(colorAt(1600, 'Konigsberg'), colorAt(1600, 'Elblag'));
  const king = mapAuthoritiesForPerson(person('SEGIS1JAG'), 1530, data, {includeDependencies: true});
  const prussia = king.find(e => e.territory === 'Prusia');
  assert.equal(prussia?.kind, 'fief');
  assert.equal(prussia.color, colorAt(1530, 'Konigsberg'));
});

test('la Bretaña angevina es un feudo de los reyes de Inglaterra entre 1166 y 1201', () => {
  assert.equal(relationAt(1170, 'Rennes'), 'brittany-angevin');
  assert.equal(relationAt(1198, 'Rennes'), null);
  assert.equal(relationAt(1201, 'Rennes'), 'brittany-angevin');
  assert.equal(relationAt(1210, 'Rennes'), null);
  assert.equal(tributaryLayerRelation('Bretaña · 1200–1531 · revisión Francia 47', 1350), null);
  const henry = mapAuthoritiesForPerson(person('HENRY2ING'), 1170, data, {includeDependencies: true});
  const brittany = henry.find(e => e.territory === 'Bretaña');
  assert.equal(brittany?.kind, 'fief');
  assert.equal(brittany.relationship.overlordLabel, 'los reyes angevinos de Inglaterra');
  const sultan = mapAuthoritiesForPerson(person('SULEIMAN1OSM'), 1560, data, {includeDependencies: true});
  for (const t of ['Principado de Valaquia', 'Principado de Moldavia', 'Transilvania'])
    assert.equal(sultan.find(e => e.territory === t)?.kind, 'tributary', t);
  for (const r of TRIBUTARY_RELATIONS) assert.ok(r.sources.length && r.note, r.id);
});

test('los reyes que fueron duques de Atenas y Neopatria gobiernan los ducados', () => {
  const dukes = {FEDERICO3SIC: [1355, 1377], PEDRO4ARAG: [1380, 1387], JUAN1ARAG: [1387, 1387]};
  for (const [id, [from, through]] of Object.entries(dukes)) {
    const p = person(id);
    const athens = p.gobiernos.find(g => g.territorio === 'Atenas' && g.condicion === 'efectivo');
    assert.deepEqual([athens.desde, athens.hasta, athens.titulo], [from, through, 'Duque'], id);
    const claims = personClaims(p).filter(c => c.field === 'Gobierno' && /Atenas|Neopatria/.test(c.value.territorio));
    assert.ok(claims.length >= 2 && claims.every(c => c.sources.some(s => s.url.includes('enciclopedia.cat'))), id);
  }
  assert.equal(person('JUAN1ARAG').gobiernos.find(g => g.territorio === 'Ducado de Neopatria').hasta, 1389);
  // Under Frederick III the duchies share Sicily's colour; from 1380 the Crown's.
  assert.equal(colorAt(1360, 'Athens'), REINO_COLOR.Trinacria);
  assert.equal(colorAt(1385, 'Athens'), REINO_COLOR['Corona de Aragón']);
  assert.ok(layersAt(1385, 'Athens').every(l => !l.crownRelation));
  assert.equal(aragonCrownRelation('Ática y Beocia · 1311–1387 · Atenas', 1378)?.type, 'sucesion');
  assert.equal(aragonCrownRelation('Ática y Beocia · 1311–1387 · Atenas', 1340)?.overlord, 'Trinacria');
  const peter = mapAuthoritiesForPerson(person('PEDRO4ARAG'), 1385, data);
  assert.ok(peter.some(e => e.territory === 'Atenas' && e.kind === 'sovereign' && e.ids.length));
  assert.ok(!peter.some(e => e.kind === 'vassal' && e.territory === 'Atenas'));
  assert.ok(peter.some(e => e.kind === 'vassal' && e.territory === 'Condado de Salona'));
});

test('los escudos propuestos se usan con su crédito y sus archivos', () => {
  const expected = {
    Luxemburgo: 'Arms of the Counts of Luxembourg.svg', Anjou: 'Arms of Jean dAnjou.svg',
    Visconti: 'Arms of the House of Visconti (1277).svg', 'Avís': 'Brasão de armas do reino de Portugal (1385).svg',
    'Álvarez de Toledo': 'Arms of the House of Álvarez de Toledo (Template).svg', Estridsen: 'Coat of arms of Danish shield (14c).svg',
    'Árpád': 'Arms of Hungary (ancient).svg', Hesse: 'Arms of the house of Hesse (1200-1450).svg',
    Welf: 'Coat of Arms of Brunswick-Lüneburg.svg', 'Ivrea-Borgoña': 'Royal Coat of Arms of the Crown of Castile (1284-1390).svg',
    'Trastámara': 'Arms of the Catholic Monarchs (1474-1492).svg',
  };
  for (const [house, title] of Object.entries(expected)) assert.equal(escudoDe(house)?.imagen?.titulo, title, house);
  assert.equal(Object.keys(ESCUDOS).length, 40);
  assert.equal(CREDITOS_ESCUDOS.length, 40);
  assert.ok(escudoDe('Trastámara').imagen.archivo.endsWith('.png'));
  const files = new Set(fs.readdirSync(new URL('../public/escudos/', import.meta.url)));
  for (const c of CREDITOS_ESCUDOS) {
    assert.ok(files.has(c.archivo.replace('/escudos/', '')), c.dinastia);
    if (!OG_FREE_LICENCE.test(c.licencia)) assert.ok(fs.existsSync(new URL(`../${ogArmsCreditFile(c.archivo)}`, import.meta.url)), c.dinastia);
  }
  assert.equal(files.size, new Set(CREDITOS_ESCUDOS.map(c => c.archivo)).size);
});
