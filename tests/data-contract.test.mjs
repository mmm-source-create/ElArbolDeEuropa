import test from 'node:test';
import assert from 'node:assert/strict';
import {legacyFormats, legacyMapFormats, legacyMapEvidence, validateContracts} from '../scripts/schema/data-contract.mjs';
import {CLAIM_REVIEWS} from '../src/evidence/reviewRecords.js';
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
  assert.deepEqual(validateContracts({...data, claimReviews: CLAIM_REVIEWS}), []);
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

test('los indicadores parentales retirados se rechazan incluso con una excepción antigua', () => {
  for (const field of ['madreAprox', 'padreAprox']) {
    const data = fixtures(); data.people[0][field] = true;
    assert(codes(data).includes('NEW_LEGACY_FORMAT'));
    record(data);
    assert(validateContracts(data).some(issue => issue.code === 'UNKNOWN_FIELD' && issue.path.endsWith('.' + field)));
  }
});

test('los campos conyugales retirados se rechazan incluso con una excepción antigua', () => {
  for (const field of ['conyuge', 'conyuge2']) {
    const data = fixtures(); data.people[0][field] = 'B';
    assert(codes(data).includes('NEW_LEGACY_FORMAT'));
    record(data);
    const issues = validateContracts(data);
    assert(issues.some(issue => issue.code === 'UNKNOWN_FIELD' && issue.path.endsWith('.' + field)));
    assert(!issues.some(issue => issue.code === 'NEW_LEGACY_FORMAT'));
  }
});

test('las listas conyugales exigen referencias únicas existentes sin ampliar relaciones', () => {
  const data = fixtures();
  delete data.people[1].conyuges;
  data.people[0].amantes = ['B'];
  const before = structuredClone(data.people);
  assert.deepEqual(codes(data), []);
  assert.deepEqual(data.people, before, 'validar no añade reciprocidad ni mezcla amantes');
  data.people[0].conyuges.push('B');
  assert(codes(data).includes('DUPLICATE'));
  data.people[0].conyuges[1] = 'AUSENTE';
  assert(codes(data).includes('MISSING_PERSON'));
  data.people[0].conyuges = 'B';
  assert(codes(data).includes('TYPE'));
});

test('las disputas individuales se rechazan en la fuente incluso con una excepción antigua', () => {
  const data = fixtures();
  data.people[0].gobiernos[0].controlDisputado = {desde: 1305, hasta: 1306};
  assert(codes(data).includes('TYPE'));
  assert(codes(data).includes('NEW_LEGACY_FORMAT'));
  record(data);
  const issues = validateContracts(data);
  assert(issues.some(issue => issue.code === 'TYPE' && issue.path.endsWith('.controlDisputado')));
  assert(!issues.some(issue => issue.code === 'NEW_LEGACY_FORMAT'));
});

test('varias disputas conservan su orden y se validan todos sus límites', () => {
  const data = fixtures();
  const periods = [{desde: 1315, hasta: 1316}, {desde: 1305, hasta: 1306}];
  data.people[0].gobiernos[0].controlDisputado = periods;
  const before = structuredClone(data.people);
  assert.deepEqual(codes(data), []);
  assert.deepEqual(data.people, before);
  periods[1].hasta = 1321;
  assert(codes(data).includes('DISPUTE_OUTSIDE_GOVERNMENT'));
  periods[1].hasta = 1304;
  assert(codes(data).includes('REVERSED_INTERVAL'));
  periods[1].hasta = '1306';
  assert(codes(data).includes('TYPE'));
});

test('retirar formatos antiguos conserva la validez sin exigir más excepciones', () => {
  const data = fixtures(); delete data.mapData.territories[0].sources; record(data);
  data.mapData.territories[0].sources = [{title: 'Archivo', url: 'https://example.org/documento', locator: 'Página 3'}];
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

test('un nombre desconocido admite fechas justificadas, pero rechaza años sin evidencia propia', () => {
  const data = fixtures(); const person = data.people[0];
  person.identidadDesconocida = true;
  person.nac = 1250; person.muer = 1325;
  person.nacAprox = true;
  person.documentacion = {fechas: {nac: {tipo: 'aproximada', valor: 1250, nota: 'Estimación'}}};
  assert.equal(codes(data).filter(code => code === 'UNKNOWN_IDENTITY_DATE').length, 2);
  const source = {title: 'Archivo', url: 'https://example.org/documento', locator: 'Folio 3'};
  data.claimReviews = {
    'person:A:birth': {certainty: 'approximate', note: 'Nacimiento estimado por el testimonio', sources: [source]},
    'person:A:death': {certainty: 'documented', note: 'Año registrado en el obituario', sources: [source]},
  };
  assert.deepEqual(codes(data), []);
  data.claimReviews['person:A:death'].certainty = 'pending';
  assert(codes(data).includes('UNKNOWN_IDENTITY_DATE'));
  data.claimReviews['person:A:death'].certainty = 'documented';
  data.claimReviews['person:A:death'].sources[0] = {...source, locator: ''};
  assert(codes(data).includes('UNKNOWN_IDENTITY_DATE'));
  delete person.identidadDesconocida;
  assert.deepEqual(codes(data), []);
});
