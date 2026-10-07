import test from 'node:test';
import assert from 'node:assert/strict';
import {auditAtlasCoverage, summarizeContinuityLayers} from '../audit-atlas-coverage.mjs';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';

const government = (territory, from, through, condition = 'efectivo', extra = {}) => ({
  territorio: territory, desde: from, hasta: through, titulo: 'Señor', condicion: condition, ...extra,
});
const person = (id, governments) => ({id: `COVERAGE_TEST_${id}`, nombre: id,
  reinos: [...new Set(governments.map(item => item.territorio))], gobiernos: governments});
const catalogue = (...names) => Object.fromEntries(names.map(name => [name, {naturaleza: 'entidad'}]));
const data = (name, activeFrom, through, from = 1400, id = 'Test_cell') => ({
  from, through, territories: [{name, active: {from: activeFrom, through},
    versions: [{from: activeFrom, ids: [id]}], note: 'Geometría sintética fechada.'}],
  additionalTerritories: [], overrides: [],
});

test('one painted mandate does not hide a completely unmapped predecessor', () => {
  const territory = 'Señorío de prueba';
  const map = data(territory, 1405, 1410);
  const predecessor = person('PREDECESSOR', [government(territory, 1400, 1404)]);
  const successor = person('SUCCESSOR', [government(territory, 1405, 1410)]);
  const report = auditAtlasCoverage([predecessor, successor], map,
    new Set(['Test_cell']), catalogue(territory));
  assert.equal(report.counts.unrepresentedEntities, 0);
  assert.equal(report.counts.representedEntities, 1);
  const partial = report.partiallyRepresented.find(row => row.territory === territory);
  assert.deepEqual(partial.missingGeometryIntervals, [{from: 1400, through: 1404}]);
  assert.equal(partial.counts.mandatesEntirelyWithoutGeometry, 1);
  const missing = partial.governments.find(row => row.personId === predecessor.id);
  assert.equal(missing.yearsWithGeometry, 0);
  assert.deepEqual(missing.missingGeometryIntervals, [{from: 1400, through: 1404}]);
  assert.equal(partial.governments.find(row => row.personId === successor.id).yearsWithGeometry, 6);
});

test('an unmapped mandate remains visible even when another contemporary paints the entity', () => {
  const territory = 'Austria';
  const map = data(territory, 1400, 1402, 1400);
  // The scope has no Interior Austria layer in this synthetic data. Another
  // mandate for the same territory does have a usable regional correspondence.
  const excludedBranch = person('UNMAPPED_BRANCH', [government(territory, 1400, 1402,
    'efectivo', {ambito: ['Austria Interior']})]);
  const visible = person('VISIBLE', [government(territory, 1400, 1402)]);
  const report = auditAtlasCoverage([excludedBranch, visible], map,
    new Set(['Test_cell']), catalogue(territory));
  assert.equal(report.counts.representedEntities, 1);
  assert.equal(report.counts.unrepresentedEntities, 0);
  const partial = report.partiallyRepresented.find(row => row.territory === territory);
  assert.equal(partial.counts.mandatesEntirelyWithoutGeometry, 1);
  assert.equal(partial.hasMandateGeometryGaps, true);
  assert.equal(partial.hasEntireTerritoryYearGaps, false);
  assert.deepEqual(partial.missingGeometryIntervals, []);
  assert.deepEqual(partial.governments.find(row => row.personId === excludedBranch.id)
    .missingGeometryIntervals, [{from: 1400, through: 1402}]);
});

test('governments before the layer activation are audited without painting the 1505 geometry early', () => {
  const map = data('Baviera', 1505, 1506);
  const duke = person('BAVARIA', [government('Baviera', 1400, 1506)]);
  const report = auditAtlasCoverage([duke], map, new Set(['Test_cell']), catalogue('Baviera'));
  const row = report.partiallyRepresented.find(item => item.territory === 'Baviera');
  assert.equal(row.counts.yearsWithoutGeometry, 105);
  assert.deepEqual(row.missingGeometryIntervals, [{from: 1400, through: 1504}]);
  assert.equal(row.counts.yearsWithGeometry, 2);
  assert.equal(mapAuthoritiesForPerson(duke, 1504, map).length, 0);
  assert(mapAuthoritiesForPerson(duke, 1505, map).some(entry => entry.ids.includes('Test_cell')));
  const oldDuke = person('BAVARIA_EARLY_ONLY', [government('Baviera', 1400, 1504)]);
  const oldReport = auditAtlasCoverage([oldDuke], map, new Set(['Test_cell']), catalogue('Baviera'));
  assert.equal(oldReport.counts.unrepresentedEntities, 1);
  assert.equal(oldReport.unrepresentedEntities[0].counts.locations, 0);
});

test('titular offices and imperial legal offices do not inflate missing territorial fills', () => {
  const map = data('Jerusalén', 1400, 1402);
  const titleHolder = person('TITULAR', [government('Jerusalén', 1400, 1402, 'titular')]);
  const claimant = person('CLAIMANT', [government('Pretensión de prueba', 1400, 1402, 'pretensión')]);
  const denied = person('DENIED', [government('Sin control de prueba', 1400, 1402, 'efectivo', {efectivo: false})]);
  const king = person('ROMAN_KING', [government('Alemania', 1400, 1402)]);
  const emperor = person('EMPEROR', [government('Sacro Imperio', 1400, 1402)]);
  const report = auditAtlasCoverage([titleHolder, claimant, denied, king, emperor], map,
    new Set(['Test_cell']), catalogue('Jerusalén', 'Pretensión de prueba',
      'Sin control de prueba', 'Alemania', 'Sacro Imperio'));
  assert.equal(report.counts.unrepresentedEntities, 0);
  assert.equal(report.counts.imperialLegalFrameExclusions, 2);
  assert.deepEqual(report.exclusions.imperialLegalFrame.map(row => row.territory), ['Alemania', 'Sacro Imperio']);
  assert.equal(report.counts.titlesOnlyInsidePeriod, 3);
  assert.equal(report.counts.nonpaintingMandatesInsidePeriod, 3);
  assert.equal(mapAuthoritiesForPerson(titleHolder, 1401, map).length, 0);
});

test('delegated government and occupation are effective, while a rival title is excluded', () => {
  const territory = 'Oficios de prueba';
  const map = data(territory, 1400, 1402);
  const delegate = person('DELEGATE', [government(territory, 1400, 1402,
    'gobierno delegado', {titulo: 'Gobernador'})]);
  const occupier = person('OCCUPIER', [government(territory, 1400, 1402, 'ocupación')]);
  const rival = person('RIVAL', [government(territory, 1400, 1402, 'rival')]);
  const report = auditAtlasCoverage([delegate, occupier, rival], map,
    new Set(['Test_cell']), catalogue(territory));
  const row = report.nonpaintingTitles.find(item => item.territory === territory);
  assert.equal(row.nonpaintingMandatesInScope, 1);
  assert.equal(row.governments[0].personId, rival.id);
  assert.equal(report.counts.unrepresentedEntities, 0);
  assert.equal(report.counts.representedEntities, 1);
  assert.equal(report.counts.partialMandateGeometry, 0);
  assert.equal(mapAuthoritiesForPerson(delegate, 1401, map)[0].kind, 'delegated');
  assert.equal(mapAuthoritiesForPerson(occupier, 1401, map)[0].kind, 'disputed');
});

test('a nonexistent SVG reference cannot count as a represented entity', () => {
  const territory = 'Referencia inexistente';
  const report = auditAtlasCoverage([person('INVALID_PATH', [government(territory, 1400, 1402)])],
    data(territory, 1400, 1402), new Set(['Different_cell']), catalogue(territory));
  assert.equal(report.counts.unrepresentedEntities, 1);
  assert.equal(report.counts.representedEntities, 0);
  assert.equal(report.unrepresentedEntities[0].counts.locations, 0);
});

test('continuity counts layers and location years independently of Atlas entities', () => {
  const summary = summarizeContinuityLayers({
    authorityGaps: [{regionId: 'Shared_cell', from: 1400, through: 1401,
      jurisdictions: ['Capa A', 'Capa B']}],
    reviewTasks: [{from: 1400, through: 1401, jurisdictions: ['Capa A', 'Capa B'],
      regions: ['Shared_cell']}],
  });
  assert.equal(summary.counts.layersWithAuthorityGaps, 2);
  assert.equal(summary.counts.uniqueLocationsWithAuthorityGaps, 1);
  assert.equal(summary.counts.locationYearsWithoutAuthority, 2);
  assert.deepEqual(summary.layers[0].intervals[0].sharedWith, ['Capa B']);
  assert.equal(summary.counts.unrepresentedEntities, undefined);
});
