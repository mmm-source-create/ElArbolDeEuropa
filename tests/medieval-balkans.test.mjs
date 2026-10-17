import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {reviewedMapLayers, reviewedLayerLocations} from '../src/data/locationMapPilot.js';
import {territorialIdentity, territorialLabel, territorialColor} from '../src/data/territorialIdentity.js';
import {atlasPoliticalMosaicAt} from '../src/data/atlasMosaic.js';
import {mergeMapExpansions} from '../scripts/cartography/merge-map-expansions.mjs';
import {applyMedievalBalkans} from '../scripts/cartography/apply-medieval-balkans.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const data = read('../prototypes/euv-locations/corridor-locations.json');
const review = read('../prototypes/euv-locations/medieval-balkans-review.json');
const people = new Map(PERSONAS.map(person => [person.id, person]));
const cells = (name, year) => new Set(atlasPoliticalMosaicAt(data, year).layers
  .find(layer => layer.entityId === territorialIdentity(name))?.ids || []);
const authority = (id, year, territory) => mapAuthoritiesForPerson(people.get(id), year, data)
  .find(entry => entry.territory === territory);

test('every recorded medieval Balkan mandate has personal geometry matching its dated laboratory layer', () => {
  let checked = 0;
  for (const person of PERSONAS) for (const government of person.gobiernos || []) {
    if (!['Bosnia', 'Valaquia', 'Moldavia'].includes(government.territorio) || government.desde >= 1400 || ['titular', 'pretensión'].includes(government.condicion)) continue;
    const claim = personClaims(person).find(entry => entry.value === government);
    for (let year = Math.max(1200, government.desde); year <= Math.min(1399, government.hasta); year++) {
      const entry = mapAuthoritiesForPerson(person, year, data).find(entry => entry.government === government);
      assert(entry?.paint && entry.ids.length, `${person.id}, ${year}`);
      const lab = new Set(reviewedMapLayers(data)
        .filter(layer => territorialIdentity(layer.name) === territorialIdentity(government.territorio)
          || government.territorio === 'Bosnia' && territorialIdentity(layer.name) === 'Hum')
        .flatMap(layer => reviewedLayerLocations(data, layer, year)));
      assert(entry.ids.every(id => lab.has(id)), `${person.id}, ${year}`);
      assert(entry.mapSources.length, `${person.id}, ${year}: map evidence`);
      assert.deepEqual(entry.claim, claim);
      assert.equal(entry.claim.value, government);
      checked++;
    }
  }
  assert(checked >= 197, `${checked} annual mandate checks`);
});

test('Bosnian expansion does not backdate Usora, Soli, Livno or the Drina acquisitions', () => {
  assert(cells('Reino de Bosnia', 1200).has('Vrhbosna'));
  for (const id of ['Doboj', 'Soli', 'Srebrenik', 'Teocak', 'Glamoc']) {
    assert(!cells('Reino de Bosnia', 1254).has(id), id);
    assert(!cells('Reino de Bosnia', 1323).has(id), id);
    assert(cells('Reino de Bosnia', 1324).has(id), id);
  }
  assert(!cells('Reino de Bosnia', 1325).has('Livno'));
  assert(cells('Reino de Bosnia', 1326).has('Livno'));
  for (const id of ['Ustikolina', 'Visegrad']) {
    assert(!cells('Reino de Bosnia', 1372).has(id), id);
    assert(cells('Reino de Bosnia', 1373).has(id), id);
  }
  for (const year of [1200, 1254, 1324, 1373, 1399])
    for (const id of ['Foca', 'Ravno', 'Dubrovnik', 'Kotor'])
      assert(!cells('Reino de Bosnia', year).has(id), `${id}, ${year}`);
  assert.equal(territorialLabel('Reino de Bosnia', 1376), 'Banato de Bosnia');
  assert.equal(territorialLabel('Reino de Bosnia', 1377), 'Reino de Bosnia');
});

test('Vuk has a bounded disputed eastern scope rather than Tvrtko’s entire banate', () => {
  for (const year of [1366, 1367]) {
    const vuk = authority('VUKBOS', year, 'Bosnia');
    assert.equal(vuk.kind, 'disputed');
    assert.deepEqual(vuk.ids, ['Olovo']);
    assert.match(vuk.mapNote, /Bobovac/);
    assert(vuk.mapSources.some(source => source.locator.includes('febrero')));
    assert.equal(authority('TVRTKO1BOS', year, 'Bosnia').kind, 'disputed');
  }
  assert.equal(authority('VUKBOS', 1368, 'Bosnia'), undefined);
  assert.equal(authority('TVRTKO1BOS', 1368, 'Bosnia').kind, 'sovereign');
});

test('Wallachian rivalry retains princely authority without annexing ports or Severin', () => {
  for (const year of [1310, 1352, 1395, 1396, 1399]) {
    const ids = cells('Principado de Valaquia', year);
    assert(ids.has('Craiova') && ids.has('Bucharest') && ids.has('Giurgiu'), year);
    for (const id of ['Fagaras', 'Silistra']) assert(!ids.has(id), id);
  }
  assert(!cells('Principado de Valaquia', 1421).has('Giurgiu'));
  assert(cells('Principado de Valaquia', 1352).has('Severin'));
  assert(!cells('Principado de Valaquia', 1360).has('Severin'));
  for (const year of [1395, 1396]) {
    const vlad = authority('VLAD1WAL', year, 'Valaquia');
    assert.equal(vlad.kind, 'disputed');
    assert(vlad.ids.includes('Bucharest'));
    assert(!vlad.ids.includes('Silistra'));
    assert(vlad.claim.sources.some(source => source.locator.includes('1394–1397')));
  }
  assert(authority('MIRCEA1WAL', 1397, 'Valaquia').ids.includes('Bucharest'));
});

test('Moldavian initial valleys and later unification do not imply retrospective port ownership', () => {
  const initial = cells('Principado de Moldavia', 1359);
  assert(initial.has('Suceava') && initial.has('Siret'));
  assert(!initial.has('Chisinau') && !initial.has('Roman'));
  assert(cells('Principado de Moldavia', 1375).has('Roman'));
  assert(cells('Principado de Moldavia',1386).has('Chisinau'));
  assert(cells('Horda de Oro',1386).has('Chisinau')); // Explicit uncertainty before the 1387 unification.
  assert(cells('Principado de Moldavia', 1387).has('Chisinau'));
  for(const year of [1359,1375,1387,1399])assert(!cells('Principado de Moldavia',year).has('Crasna'));
  for(const id of ['Chilia','Cetatea_Alba']){
    assert(!cells('Principado de Moldavia',1386).has(id),id);
    assert(cells('Principado de Moldavia',1387).has(id),id);
    assert(!cells('Principado de Moldavia',1484).has(id),id);
  }
  assert(!cells('Principado de Moldavia',1372).has('Hotin'));
  assert(cells('Principado de Moldavia',1373).has('Hotin'));
  assert(!cells('Principado de Moldavia',1359).has('Focsani'));
  assert(cells('Principado de Moldavia',1387).has('Focsani'));
  assert(authority('STEFAN1MOLD', 1398, 'Moldavia').ids.includes('Roman'));
  assert(authority('IUGAMOLD', 1399, 'Moldavia').ids.includes('Suceava'));
});

test('reviewed interiors persist through 1400 with one identity and the existing palette', () => {
  for (const territory of ['Bosnia', 'Valaquia', 'Moldavia']) {
    const identity = territorialIdentity(territory);
    const before = atlasPoliticalMosaicAt(data, 1399).layers.find(layer => layer.entityId === identity);
    const after = atlasPoliticalMosaicAt(data, 1400).layers.find(layer => layer.entityId === identity);
    assert(before && after, territory);
    assert(before.ids.every(id => after.ids.includes(id)), territory);
    assert.equal(before.mosaicColor, after.mosaicColor);
    assert.equal(before.mosaicColor, territorialColor(identity));
  }
  for (const id of ['Dinaric_Alps2', 'Dinaric_Alps3']) {
    assert(authority('PRIJEZDA1BOS', 1254, 'Bosnia').ids.includes(id));
    assert(authority('OSTOJABOS', 1400, 'Bosnia').ids.includes(id));
  }
});

test('new rulers have cited offices without invented life dates or uncertain genealogy', () => {
  for (const id of ['KULINBOS', 'NINOSLAVBOS', 'PRIJEZDA1BOS', 'VUKBOS', 'VLAD1WAL', 'STEFAN1MOLD', 'IUGAMOLD']) {
    const person = people.get(id);
    assert(person, id);
    assert.equal(person.nac, undefined, id);
    assert.equal(person.muer, undefined, id);
    const claim = personClaims(person).find(entry => entry.field === 'Gobierno');
    assert(claim.sources.every(source => source.url.startsWith('https://') && source.locator), id);
    assert(claim.sources.length && claim.certainty !== 'pending', id);
    if (id !== 'VUKBOS') {
      assert.equal(person.padre, undefined, id);
      assert.equal(person.madre, undefined, id);
    }
  }
  for (const field of ['Padre', 'Madre']) {
    const claim = personClaims(people.get('VUKBOS')).find(entry => entry.field === field);
    assert.equal(claim.certainty, 'documented');
    assert(claim.sources.length);
  }
});

test('medieval selections regenerate identically and reject overlap with the accepted modern survey', () => {
  assert.deepEqual(mergeMapExpansions(structuredClone(data)), data);
  const measured = new Set(read('../prototypes/euv-locations/regional-extent-cells.json').cells.map(cell => cell.id));
  for (const layer of [...review.temporalExtensions, ...review.territories])
    for (const version of layer.versions) for (const id of version.ids) assert(measured.has(id), id);
  const invalid = structuredClone(review);
  invalid.temporalExtensions[0].periods[0].through = 1400;
  assert.throws(() => applyMedievalBalkans(structuredClone(data), invalid), /Invalid independent/);
});
