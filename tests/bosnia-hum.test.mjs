import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {personClaims} from '../src/evidence/claims.js';
import {auditarTerritorios} from '../scripts/audits/lib/auditTerritorios.js';
import {atlasPoliticalMosaicAt} from '../src/data/atlasMosaic.js';
import {auditRegionalContinuity} from '../scripts/audits/audit-regional-continuity.mjs';
import {mergeMapExpansions} from '../scripts/cartography/merge-map-expansions.mjs';
import {applyRegionalReview} from '../scripts/cartography/apply-regional-review.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const data = read('../prototypes/euv-locations/corridor-locations.json');
const review = read('../prototypes/euv-locations/bosnia-hum-review.json');
const inventory = read('../prototypes/euv-locations/location-inventory.json');
const people = new Map(PERSONAS.map(person => [person.id, person]));
const owners = (id, year) => (atlasPoliticalMosaicAt(data, year).byLocation.get(id) || []).map(layer => layer.entityId).sort();
const authority = (id, year, territory) => mapAuthoritiesForPerson(people.get(id), year, data, {includeClaims: true})
  .find(entry => entry.territory === territory);

test('the full regional pass checks every scoped cell through all 601 years', () => {
  const report = auditRegionalContinuity(data, inventory, review);
  assert.equal(report.summary.cells, 31);
  assert.equal(report.summary.cellYears, 18631);
  assert.equal(report.summary.missingCellYears, 0);
  assert.equal(report.summary.unexplainedCellYears, 0);
  assert.equal(report.summary.missingEvidenceYears, 0);
  assert.deepEqual(report.summary.missingGeometry, []);
  for (const cell of report.cells) assert.equal(cell.coloredYears, 601, cell.id);
  // Not merely cells on the never-colored list: internal temporal holes count.
  const missing = structuredClone(data);
  for (const layer of missing.additionalTerritories)
    if (layer.name === 'Bosnia · Vrhbosna') layer.coverage.through = 1433;
  assert.equal(auditRegionalContinuity(missing, inventory, review).summary.missingCellYears, 1);
});

test('Usora survives Dragutin and Srebrenik differs from the mining city Srebrenica', () => {
  assert.deepEqual(owners('Srebrenik', 1316), ['Sirmia']);
  assert.deepEqual(owners('Srebrenik', 1317), ['Usora y Soli']);
  assert.deepEqual(owners('Srebrenik', 1324), ['Reino de Bosnia']);
  assert.deepEqual(owners('Srebrenik', 1500), ['Srebrenik']);
  assert.deepEqual(owners('Srebrenik', 1512), ['Imperio otomano']);
  assert.deepEqual(owners('Teocak', 1438), ['Serbia']);
  assert.deepEqual(owners('Teocak', 1439), ['Imperio otomano']);
  assert.deepEqual(owners('Teocak', 1443), ['Reino de Bosnia']);
  assert.deepEqual(owners('Srebrenica', 1410), ['Hungría']);
  assert.deepEqual(owners('Srebrenica', 1411), ['Serbia']);
  assert.deepEqual(owners('Srebrenica', 1439), ['Imperio otomano']);
  assert.deepEqual(owners('Srebrenica', 1444), ['Serbia']);
  assert.deepEqual(owners('Srebrenica', 1500), ['Imperio otomano']);
});

test('local conquest dates and recoveries supersede generic Ottoman anchors', () => {
  const king = authority('STEPHENTOMASEVICBOS', 1463, 'Bosnia');
  assert.equal(king.kind, 'disputed');
  assert(king.ids.includes('Olovo') && king.ids.includes('Jajce'));
  assert(!king.ids.includes('Vrhbosna') && !king.ids.includes('Mostar'));
  assert.equal(authority('STEPHENTOMASEVICBOS', 1464, 'Bosnia'), undefined);
  assert.deepEqual(owners('Vrhbosna', 1434), ['Reino de Bosnia']);
  assert.deepEqual(owners('Vrhbosna', 1435), ['Imperio otomano']);
  assert.deepEqual(owners('Mostar', 1465), ['Herzegovina']);
  assert.deepEqual(owners('Mostar', 1466), ['Imperio otomano']);
  assert.deepEqual(owners('Jajce', 1526), ['Banato húngaro de Jajce']);
  assert.deepEqual(owners('Jajce', 1527), ['Imperio otomano']);
  assert.deepEqual(owners('Trebinje', 1694), ['Dalmacia veneciana']);
  assert.deepEqual(owners('Trebinje', 1699), ['Imperio otomano']);
  assert.deepEqual(owners('Pljevlja', 1372), ['Serbia']);
  assert.deepEqual(owners('Pljevlja', 1373), ['Reino de Bosnia']);
  assert.deepEqual(owners('Pljevlja', 1465), ['Imperio otomano']);
});

test('whole ridges follow the regional pass and the mixed Imotski/Gabela cell is explicit', () => {
  for (const id of ['Dinaric_Alps2', 'Dinaric_Alps3', 'Dinaric_Alps4', 'Dinaric_Alps5', 'Dinaric_Alps6'])
    for (const year of [1200, 1290, 1400, 1465, 1500, 1800]) assert(owners(id, year).length, `${id}, ${year}`);
  assert.deepEqual(owners('Drijeva', 1700), ['Dalmacia veneciana']);
  assert.deepEqual(owners('Drijeva', 1750), ['Dalmacia veneciana', 'Imperio otomano']);
  assert.deepEqual(owners('Metkovic', 1700), ['Dalmacia veneciana']);
  assert.deepEqual(owners('Metkovic', 1800), ['Dalmacia austríaca']);
  assert(review.allowedMixedCells.some(row => row.id === 'Drijeva' && row.sourceKeys.includes('imotski')));
  assert(!review.scope.ids.includes('Foca'));
  assert(!review.scope.ids.includes('Ravno'));
  assert(!review.scope.ids.includes('Slano'));
});

test('Bosnia has mapped authority throughout 1288–1321 without painting an exiled title', () => {
  for (let year = 1288; year <= 1321; year++) {
    const active = PERSONAS.flatMap(person => mapAuthoritiesForPerson(person, year, data))
      .filter(entry => entry.territory === 'Bosnia' && entry.paint && entry.ids.length);
    assert(active.length, `${year}`);
  }
  assert.equal(authority('STEPHEN2BOS', 1316, 'Bosnia').paint, false);
  const returned = authority('STEPHEN2BOS', 1319, 'Bosnia');
  assert.equal(returned.kind, 'delegated');
  assert.equal(returned.government.soberano, 'MLADEN2SUBIC');
  const superior = authority('MLADEN2SUBIC', 1319, 'Bosnia');
  assert(returned.ids.every(id => superior.ids.includes(id)));
  assert.deepEqual(authority('STJEPAN1BOS', 1307, 'Bosnia').ids, ['Borac']);
  assert(!authority('PAVAO1SUBIC', 1307, 'Bosnia').ids.includes('Borac'));
  assert.equal(authority('MLADEN2SUBIC', 1307, 'Bosnia').kind, 'delegated');
  assert.equal(authority('MLADEN2SUBIC', 1315, 'Bosnia').kind, 'sovereign');
});

test('offices and parentage have specific evidence without invented life dates', () => {
  const existingIds = new Set(inventory.cells.map(cell => cell.id));
  for (const scope of review.authorityScopes) {
    assert(people.has(scope.personId), scope.personId);
    for (let year = scope.from; year <= scope.through; year++)
      assert(people.get(scope.personId).gobiernos.some(g => g.territorio === scope.territory
        && g.desde <= year && year <= g.hasta), `${scope.personId}, ${year}`);
    for (const id of scope.ids) assert(existingIds.has(id), `${scope.personId}: ${id}`);
  }
  for (const id of ['PRIJEZDA2BOS', 'PAVAO1SUBIC', 'MLADEN1SUBIC', 'MLADEN2SUBIC', 'SANDALJKOS', 'HRVOJEHUM']) {
    const person = people.get(id);
    assert(person, id);
    for (const government of person.gobiernos) {
      const claim = personClaims(person).find(claim => claim.value === government);
      assert(claim.sources.length && claim.sources.every(source => source.locator), id);
    }
  }
  assert.equal(people.get('PRIJEZDA2BOS').muer, undefined);
  assert.equal(people.get('MLADEN2SUBIC').muer, undefined);
  assert.equal(people.get('STJEPAN1BOS').muer, undefined);
  assert.equal(people.get('STJEPAN1BOS').documentacion.fechas.muer.desde, 1302);
});

test('a documented superior office does not change Bosnia’s territorial class', () => {
  const pavao = people.get('PAVAO1SUBIC');
  assert.equal(pavao.gobiernos.find(g => g.territorio === 'Bosnia').titulo, 'Señor');
  assert.equal(auditarTerritorios([pavao]).filter(issue => issue.severity === 'ERROR').length, 0);
  const invalid = structuredClone(pavao);
  invalid.gobiernos.find(g => g.territorio === 'Bosnia').titulo = 'Emperador';
  assert(auditarTerritorios([invalid]).some(issue => issue.code === 'TITLE_CLASS_MISMATCH'));
});

test('regional precedence is reproducible and rejects missing evidence or a foreign cell', () => {
  assert.deepEqual(mergeMapExpansions(structuredClone(data)), data);
  const invalid = structuredClone(review);
  invalid.assignments[0].ids.push('Foca');
  assert.throws(() => applyRegionalReview(structuredClone(data), invalid, 'bosniaHumReview', 'Bosnia y Hum · revisión regional'), /Invalid regional phase/);
  const absent = structuredClone(review);
  delete absent.sources.mostar;
  assert.throws(() => applyRegionalReview(structuredClone(data), absent, 'bosniaHumReview', 'Bosnia y Hum · revisión regional'), /Missing regional evidence/);
});
