import {atlasPoliticalMosaicAt} from '../src/data/atlasMosaic.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {pilotLocationsFor, reviewedMapLayers, reviewedLayerLocations} from '../src/data/locationMapPilot.js';
import {politicalMosaicAt} from '../src/data/locationMosaic.js';
import {applyRegionalExtents} from '../scripts/cartography/apply-regional-extents.mjs';
import {REGIONAL_EXTENT_REVIEWS} from '../src/evidence/regionalExtentReviewData.js';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const data = read('../prototypes/euv-locations/corridor-locations.json');
const review = read('../prototypes/euv-locations/regional-extent-review.json');
const inventory = read('../prototypes/euv-locations/regional-extent-cells.json');
const layers = new Map(reviewedMapLayers(data).map(layer => [layer.name, layer]));
const people = new Map(PERSONAS.map(person => [person.id, person]));
const westernGovernments = new Set(read('../prototypes/euv-locations/iberia-italy-full-review.json').assignments.flatMap(phase => phase.governmentTerritories));
const cells = (name, year) => westernGovernments.has(name) ? pilotLocationsFor(data, name, year) : reviewedLayerLocations(data, layers.get(name), year);
const authority = (person, year) => mapAuthoritiesForPerson(people.get(person), year, data).filter(entry => entry.paint);
const personal = (person, year) => new Set(authority(person, year).flatMap(entry => entry.ids));
const areaById = new Map(inventory.cells.map(cell => [cell.id, cell.area]));
const area = ids => ids.reduce((sum, id) => sum + (areaById.get(id) || 0), 0);

test('regional selections reference measurable actual SVG surfaces and dated evidence', () => {
  const svg = fs.readFileSync(new URL('../prototypes/euv-locations/euv-locations-crop.svg', import.meta.url), 'utf8');
  const pathIds = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
  for (const layer of [...review.replacements, ...review.territories]) {
    assert(layer.sources.length && layer.sources.every(source => source.locator && new URL(source.url).protocol === 'https:'), layer.name);
    for (const version of layer.versions) for (const id of version.ids) {
      assert(pathIds.has(id), id); assert(areaById.get(id) > 0, id);
    }
  }
  const copy = structuredClone(data);
  applyRegionalExtents(copy, review);
  const once = JSON.stringify(copy);
  applyRegionalExtents(copy, review);
  assert.equal(JSON.stringify(copy), once, 'regenerating must not accumulate layers or corrections');
});

test('1651 retains whole established regions and islands instead of reverting to city cores', () => {
  for (const name of ['Castilla', 'León', 'Portugal', 'Aragón', 'Valencia', 'Mallorca', 'Nápoles', 'Trinacria', 'Austria', 'Austria Interior', 'Tirol']) {
    const before = cells(name, 1650), after = cells(name, 1651);
    assert(after.length >= before.length, name);
    assert(area(after) >= area(before) * .99, name);
  }
  for (const id of ['Funchal', 'Porto_Santo', 'Angra', 'Ponta_Delgada', 'Santa_Maria']) assert(cells('Portugal', 1700).includes(id), id);
  assert(cells('Nápoles', 1700).length >= 70);
  assert(personal('FED2HOH', 1240).has('Naples'));
  assert(personal('FED2HOH', 1240).has('Palermo'));
  assert(personal('FED2HOH', 1240).size >= 99);
});

test('Silesian sovereignty covers the duchies without absorbing Greater Poland or Lusatia', () => {
  const full = cells('Silesia · soberanía de la Corona', 1530);
  assert.equal(full.length, 46);
  assert(!cells('Silesia · soberanía de la Corona', 1380).includes('Swidnica'));
  assert(cells('Silesia · soberanía de la Corona', 1392).includes('Swidnica'));
  for (const id of ['Wschowa', 'Rawicz', 'Ostrzeszow', 'Zary', 'Klodzko', 'Siewierz']) assert(!full.includes(id), id);
  for (const id of full) assert(personal('FERN1EMP', 1530).has(id), id);
  assert(!personal('CARLOS5', 1530).has('Legnica'), 'holding the imperial office is not Silesian government');
  assert.equal(politicalMosaicAt(data, 1530).byLocation.get('Legnica').length, 1);
});

test('the 1742 partition separates Austrian and Prussian surfaces and keeps 1741 partial', () => {
  const prussia = cells('Silesia · parte prusiana', 1750), austria = cells('Silesia · remanente austríaco', 1750);
  assert.equal(prussia.length, 42); assert.equal(austria.length, 5);
  assert(!prussia.some(id => austria.includes(id)));
  assert(prussia.includes('Klodzko'));
  const occupation = cells('Silesia · ocupación prusiana', 1741);
  assert(!occupation.includes('Opole') && !occupation.includes('Klodzko'));
  for (const id of austria) {
    assert(personal('MARIATERESAHAB', 1750).has(id), id);
    assert(!personal('FRED2PRUSSIA', 1750).has(id), id);
  }
  assert(authority('FRED2PRUSSIA', 1741).some(entry => entry.kind === 'disputed' && entry.ids.includes('Legnica')));
});

test('Austrian provinces require their own mandates and retain treaty changes', () => {
  for (const id of ['Graz', 'Klagenfurt', 'Ljubljana']) assert(personal('RUD4AUS', 1360).has(id), id);
  assert(!personal('RUD4AUS', 1362).has('Innsbruck'));
  assert(personal('RUD4AUS', 1363).has('Innsbruck'));
  assert.equal(authority('RUD4AUS', 1360).find(entry => entry.territory.includes('Carniola')).government.titulo, 'Señor');
  assert.equal(authority('RUD4AUS', 1364).find(entry => entry.territory.includes('Carniola')).government.titulo, 'Duque');
  assert(authority('FRED2BAB', 1237).some(entry => entry.kind === 'disputed'));
  assert(!cells('Austria', 1778).includes('Braunau'));
  assert(cells('Austria', 1779).includes('Braunau'));
  assert(!cells('Austria', 1800).includes('Salzburg'));
  assert(personal('CARLOS6HRE', 1720).has('Belgrad'));
  assert(!personal('CARLOS6HRE', 1740).has('Belgrad'));
  assert(personal('CARLOS6HRE', 1720).has('Craiova'));
  assert(!personal('CARLOS6HRE', 1740).has('Craiova'));
  for (const key of Object.keys(REGIONAL_EXTENT_REVIEWS)) {
    const claim = personClaims(people.get(key.split(':')[1])).find(claim => claim.id === key);
    assert(claim?.sources?.length, key);
  }
});

test('Iberian borders distinguish conquest, loss, and the 1659 Catalan partition', () => {
  assert(!cells('Castilla', 1291).includes('Tarifa'));
  assert(cells('Castilla', 1292).includes('Tarifa'));
  assert(!cells('Castilla', 1343).includes('Algeciras'));
  assert(cells('Castilla', 1344).includes('Algeciras'));
  assert(!cells('Castilla', 1369).includes('Algeciras'));
  assert(cells('Granada', 1369).includes('Algeciras'));
  assert(!cells('Castilla', 1704).includes('Gibraltar'));
  for (const year of [1530, 1660, 1700]) {
    assert(cells('Condado de Barcelona', year).includes('Puigcerda'));
    assert(!cells('Condado de Barcelona', year).includes('Andorra_la_Vella'));
  }
  assert(!cells('Condado de Barcelona', 1660).includes('Perpignan'));
  assert(!cells('Mallorca', 1750).includes('Ciudadela_de_Menorca'));
  assert(cells('Mallorca', 1782).includes('Ciudadela_de_Menorca'));
});

test('Milanese cessions appear in Piedmont rather than disappearing or being painted twice', () => {
  for (const [year, ids] of [[1713, ['Alessandria', 'Novi', 'Lomello', 'Varallo']],
    [1738, ['Novara', 'Tortona']], [1743, ['Voghera', 'Arona', 'Domodossola']]]) {
    for (const id of ids) {
      assert(!cells('Milán', year).includes(id), `${id} ${year}`);
      assert(cells('Piamonte', year).includes(id), `${id} ${year}`);
    }
  }
  // The whole Val Trebbia cell includes Genoese jurisdictions and imperial
  // feuds; Bobbio's cession does not give Saboya all of Rovegno.
  const rovegno = atlasPoliticalMosaicAt(data, 1743).byLocation.get('Rovegno');
  assert(rovegno.some(layer => layer.entityId === 'Génova'));
  assert(!cells('Milán', 1743).includes('Rovegno'));
  assert(cells('Piamonte', 1743).includes('Rovegno'));
  assert(rovegno.every(layer => layer.scopes.some(scope => scope.ids.includes('Rovegno') && scope.condition === 'composición geográfica')));
});

test('Ottoman geography respects the interregnum and the eastern campaign chronology', () => {
  const west = 'Imperio otomano';
  const direct=(year)=>pilotLocationsFor(data,west,year);
  assert(direct(1391).includes('Manisa'));
  assert(!direct(1402).includes('Manisa'));
  assert(direct(1427).includes('Manisa'));
  assert(!direct(1362).includes('Mitilene'));
  assert(direct(1462).includes('Mitilene'));
  assert(!direct(1481).includes('Erzurum'));
  assert(!direct(1536).includes('Van'));
  assert(direct(1548).includes('Van'));
  assert(!direct(1552).includes('Ercis'));
  assert(direct(1555).includes('Ercis'));
  assert(!direct(1565).includes('Kars'));
  assert(direct(1578).includes('Kars'));
  const soliman = personal('SULEIMAN1OSM', 1555);
  for (const id of ['Manisa', 'Konya', 'Erzurum', 'Van', 'Trebizond']) assert(soliman.has(id), id);
  for (const id of ['Yerevan', 'Maku', 'Khoy', 'Bucharest', 'Suceava']) assert(!soliman.has(id), id);
  assert(!pilotLocationsFor(data, 'Imperio otomano', 1700).includes('Patras'));
  assert(pilotLocationsFor(data, 'Imperio otomano', 1720).includes('Patras'));
});
