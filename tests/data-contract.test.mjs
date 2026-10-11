import test from 'node:test';
import assert from 'node:assert/strict';
import {legacyFormats, legacyMapFormats, legacyMapEvidence, validateContracts} from '../scripts/schema/data-contract.mjs';
import {readContractData, readJson, readPersonLiteral} from '../scripts/schema/read-contract-data.mjs';

const fixtures = () => ({
  people: [{id: 'A', nombre: 'Ana', titulo: 'Reina', reinos: ['Reino'], conyuges: ['B'],
    gobiernos: [{territorio: 'Reino', desde: 1300, hasta: 1320, titulo: 'Reina', clase: 'reinado', condicion: 'efectivo',
      controlDisputado: [{desde: 1305, hasta: 1306}]}]},
  {id: 'B', nombre: 'Bernardo', titulo: 'Consorte', reinos: ['Reino'], conyuges: ['A']}],
  territories: {Reino: {clase: 'reino', naturaleza: 'entidad', componentes: []}},
  mapData: {from: 1200, through: 1800, territories: [{name: 'Reino', corridor: 'Prueba', color: '#123456',
    coverage: {from: 1200, through: 1800}, versions: [{from: 1200, ids: ['Celda']}],
    sources: [{title: 'Archivo', url: 'https://example.org/documento', locator: 'Página 3'}]}]},
  locationIds: new Set(['Celda']),
  legacy: {groups: {}},
});
const codes = data => validateContracts(data).map(issue => issue.code);
const record = data => {
  data.legacy.groups = Object.fromEntries(Object.entries({...legacyFormats(data.people),
    mapVersionOrder: legacyMapFormats(data.mapData), mapEvidence: legacyMapEvidence(data.mapData)})
    .map(([group, entries]) => [group, {entries: structuredClone(entries)}]));
};

test('el contrato valida la fuente publicada antes del alias reinados, sin modificarla', async () => {
  const data = await readContractData();
  data.legacy = await readJson('tests/baselines/v5-legacy-formats.json');
  const before = JSON.stringify(data.people);
  assert(data.people.length > 0);
  assert(data.people.every(person => !Object.hasOwn(person, 'reinados')));
  assert.deepEqual(validateContracts(data), []);
  assert.equal(JSON.stringify(data.people), before);
});

test('tipos, campos y vocabulario nuevos no se convierten silenciosamente', () => {
  assert.deepEqual(codes(fixtures()), []);
  for (const [field, value, code] of [['nac', '1300', 'TYPE'], ['nac', 1300.5, 'TYPE'], ['nacAprox', 'false', 'TYPE'], ['campoInventado', true, 'UNKNOWN_FIELD']]) {
    const data = fixtures(); data.people[0][field] = value;
    assert(codes(data).includes(code), field);
  }
  const data = fixtures(); data.people[0].gobiernos[0].condicion = 'tributo = provincia';
  assert(codes(data).includes('ENUM'));
  data.people[0].gobiernos = {};
  assert(codes(data).includes('TYPE'));
});

test('las excepciones heredadas son exactas y no admiten nuevos casos', () => {
  const data = fixtures();
  data.people[0].conyuge = 'B'; delete data.people[0].conyuges;
  data.people[0].gobiernos[0].controlDisputado = {desde: 1305, hasta: 1306};
  record(data);
  assert.deepEqual(codes(data), []);
  data.people[1].conyuge = 'A';
  assert(codes(data).includes('NEW_LEGACY_FORMAT'));
  delete data.people[1].conyuge;
  data.people[0].gobiernos[0].controlDisputado.hasta = 1307;
  assert(codes(data).includes('NEW_LEGACY_FORMAT'));
});

test('retirar formatos antiguos conserva la validez sin exigir más excepciones', () => {
  const data = fixtures(); data.people[0].conyuge = 'B'; record(data);
  delete data.people[0].conyuge;
  assert.deepEqual(codes(data), []);
});

test('referencias y disputas requieren entidades existentes e intervalos válidos', () => {
  for (const mutate of [
    data => {data.people[0].madre = 'AUSENTE';},
    data => {data.people[0].gobiernos[0].soberano = 'AUSENTE';},
    data => {data.people[0].gobiernos[0].desde = 1330;},
    data => {data.people[0].gobiernos[0].controlDisputado[0].hasta = 1400;},
    data => {data.people[0].gobiernos[0].territorio = 'Ausente';},
  ]) {const data = fixtures(); mutate(data); assert(codes(data).length > 0);}
});

test('un gobierno delegado conserva su soberano y no se confunde con una pretensión', () => {
  const data = fixtures(), government = data.people[0].gobiernos[0];
  government.condicion = 'gobierno delegado'; government.soberano = 'B';
  assert.deepEqual(codes(data), []);
  government.condicion = 'titular'; delete government.soberano;
  assert.deepEqual(codes(data), []);
});

test('la cartografía comprueba el SVG, fuentes, fechas y versiones duplicadas', () => {
  const data = fixtures(), layer = data.mapData.territories[0];
  layer.versions[0].ids = ['CeldaInexistente'];
  assert(codes(data).includes('MISSING_LOCATION'));
  layer.versions[0].ids = ['Celda'];
  layer.versions.push({...layer.versions[0]});
  assert(codes(data).includes('VERSION_ORDER'));
  record(data); assert.deepEqual(codes(data), []);
  layer.versions[1].ids = [];
  assert(codes(data).includes('VERSION_ORDER'), 'una deuda registrada no admite modificaciones');
  layer.versions.pop(); layer.sources = [];
  assert(codes(data).includes('MAP_EVIDENCE'));
  record(data); assert.deepEqual(codes(data), []);
  layer.versions[0].ids = [];
  assert(codes(data).includes('MAP_EVIDENCE'));
});

test('las extensiones temporales no heredan automáticamente la evidencia del período base', () => {
  const data = fixtures(), layer = data.mapData.territories[0];
  layer.temporalExtensions = [{name: 'Reino', periods: [{from: 1200, through: 1300}],
    precision: 'regional_approximation', limitedCore: false, versions: [{from: 1200, ids: ['Celda']}],
    note: 'Extensión anterior', sources: []}];
  assert(codes(data).includes('MAP_EVIDENCE'));
  layer.temporalExtensions[0].sources = structuredClone(layer.sources);
  assert.deepEqual(codes(data), []);
});

test('identidad desconocida y fecha aproximada son conceptos independientes', () => {
  const data = fixtures(); data.people[0].identidadDesconocida = true;
  data.people[0].documentacion = {fechas: {nac: {tipo: 'intervalo', desde: 1250, hasta: 1252, nota: 'Intervalo documentado'}}};
  assert.deepEqual(codes(data), []);
  data.people[0].documentacion.fechas.nac.hasta = 1249;
  assert(codes(data).includes('REVERSED_INTERVAL'));
});

test('las etapas territoriales solo admiten inicio abierto en la primera etapa', () => {
  const data = fixtures(); data.territories.Reino.etapas = [{desde: null, clase: 'condado'}, {desde: 1250, clase: 'reino'}];
  assert.deepEqual(codes(data), []);
  data.territories.Reino.etapas[1].desde = null;
  assert(codes(data).includes('UNBOUNDED_STAGE'));
});

test('la lectura literal rechaza una fuente mal formada y no ejecuta código adjunto', () => {
  assert.throws(() => readPersonLiteral('export const PERSONAS = crearPersonas();'));
  assert.throws(() => readPersonLiteral('export const PERSONAS = [\n {id: "A"},\n];'));
  assert.deepEqual(readPersonLiteral('export const PERSONAS = [\n {"id":"A"},\n];\nthrow new Error("No ejecutar");'), [{id: 'A'}]);
});
