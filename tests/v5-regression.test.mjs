import test from 'node:test';
import assert from 'node:assert/strict';
import {readJson} from '../scripts/schema/read-contract-data.mjs';
import {personSnapshot, mosaicSnapshot, personalSnapshot, snapshotDifferences, semanticValue} from '../scripts/schema/regression-snapshot.mjs';
import {canonicalJson, digest} from '../scripts/schema/canonical.mjs';

test('la base cubre todos los años y protege rutas y fichas publicadas', async () => {
  const baseline = await readJson('tests/baselines/v5-regression.json');
  assert.equal(baseline.schema, 1);
  assert.deepEqual(Object.keys(baseline.data.years), Array.from({length: 601}, (_, index) => String(1200 + index)));
  assert.equal(Object.keys(baseline.data.people).length, baseline.data.counts.people);
  assert.equal(Object.keys(baseline.public.pages).length, Object.values(baseline.public.counts).reduce((sum, count) => sum + count, 0));
  assert.equal(baseline.public.counts.persona, baseline.data.counts.people);
  assert(baseline.public.paths.includes('/es/persona/carlos-v'));
  assert(baseline.public.paths.includes('/en/person/charles-v'));
  for (const year of Object.values(baseline.data.years)) {
    assert.match(year.mosaic, /^[a-f0-9]{64}$/); assert.match(year.personal, /^[a-f0-9]{64}$/);
  }
});

test('ordenar propiedades y migrar disputas no provoca un cambio histórico', () => {
  assert.equal(digest({a: 1, b: 2}), digest({b: 2, a: 1}));
  const person = {id: 'A', nombre: 'Ana', conyuges: ['B'], reinos: ['Reino'], gobiernos: [
    {territorio: 'Reino', desde: 1300, hasta: 1320, titulo: 'Reina', controlDisputado: {desde: 1305, hasta: 1306}},
  ]};
  const migrated = structuredClone(person);
  migrated.gobiernos[0].controlDisputado = [migrated.gobiernos[0].controlDisputado];
  assert.equal(personSnapshot(person), personSnapshot(migrated));
  migrated.gobiernos[0].controlDisputado[0].hasta++;
  assert.notEqual(personSnapshot(person), personSnapshot(migrated));
});

const mosaic = () => {
  const layer = {entityId: 'Reino', key: 'Reino', displayName: 'Reino', mosaicColor: '#123456', ids: ['Celda'],
    sources: [{url: 'https://example.org/original', title: 'Archivo', locator: 'p. 3'}]};
  return {layers: [layer], byLocation: new Map([['Celda', [layer]]])};
};
test('cambiar dueño, fuente o naturaleza se detecta aunque no cambie el número de celdas', () => {
  const original = mosaicSnapshot(mosaic());
  for (const mutate of [
    value => {value.layers[0].entityId = 'Otro reino';},
    value => {value.layers[0].sources[0].url = 'https://example.org/otra';},
    value => {value.layers[0].approximate = true;},
    value => {value.layers[0].authorityCondition = 'ocupación';},
    value => {value.layers[0].ids = ['OtraCelda'];},
  ]) {const value = mosaic(); mutate(value); assert.notEqual(mosaicSnapshot(value), original);}
});

test('la prioridad de dos atribuciones solapadas queda protegida', () => {
  const value = mosaic(), first = value.layers[0], second = {...first, key: 'Rival', entityId: 'Rival'};
  value.layers.push(second); value.byLocation.set('Celda', [first, second]);
  const before = mosaicSnapshot(value); value.byLocation.set('Celda', [second, first]);
  assert.notEqual(mosaicSnapshot(value), before);
});

test('el mapa personal protege gobernador, soberano, título y control', () => {
  const entry = {person: {id: 'A'}, territory: 'Reino', kind: 'delegated', paint: true, ids: ['Celda'],
    government: {territorio: 'Reino', soberano: 'B', titulo: 'Gobernadora'},
    mapSources: [{url: 'https://example.org', locator: 'Mandato'}]};
  const before = personalSnapshot([entry]);
  for (const mutate of [
    value => {value.kind = 'sovereign';}, value => {value.government.soberano = 'C';},
    value => {value.paint = false;}, value => {value.person.id = 'D';},
  ]) {const value = structuredClone(entry); mutate(value); assert.notEqual(personalSnapshot([value]), before);}
});

test('el comparador identifica cambios concretos, incluidas altas y bajas', () => {
  assert.deepEqual(snapshotDifferences({people: {A: 'hash'}, years: {1400: {personal: 'a'}}},
    {people: {B: 'hash'}, years: {1400: {personal: 'b'}}}), ['people.A', 'people.B', 'years.1400.personal']);
  assert.equal(canonicalJson(semanticValue({controlDisputado: {desde: 1, hasta: 2}})),
    canonicalJson(semanticValue({controlDisputado: [{desde: 1, hasta: 2}]})));
});
