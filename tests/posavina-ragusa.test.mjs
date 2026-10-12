import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {atlasPoliticalMosaicAt} from '../prototypes/euv-locations/atlas-mosaic.js';
import {auditRegionalContinuity} from '../scripts/audits/audit-regional-continuity.mjs';

const read = name => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), 'utf8'));
const data = read('../prototypes/euv-locations/corridor-locations.json');
const review = read('../prototypes/euv-locations/posavina-ragusa-review.json');
const inventory = read('../prototypes/euv-locations/location-inventory.json');
const owners = (id, year) => (atlasPoliticalMosaicAt(data, year).byLocation.get(id) || [])
  .map(layer => layer.entityId).sort();

test('every coastal subdivision and full northern cell has 601 documented annual states', () => {
  const result = auditRegionalContinuity(data, inventory, review);
  assert.equal(result.summary.cellYears, 6010);
  assert.equal(result.summary.missingCellYears, 0);
  assert.equal(result.summary.unexplainedCellYears, 0);
  assert.equal(result.summary.missingEvidenceYears, 0);
  assert.deepEqual(result.summary.missingGeometry, []);
  const broken = structuredClone(data);
  broken.additionalTerritories.find(layer => layer.name === 'Mljet · incorporación definitiva').coverage.from = 1411;
  assert.equal(auditRegionalContinuity(broken, inventory, review).summary.missingCellYears, 1);
});

test('one composite Slano cell no longer gives all its islands to Ragusa', () => {
  assert.deepEqual(owners('Slano_Peljesac', 1350), ['República de Ragusa']);
  assert.deepEqual(owners('Slano', 1350), ['Reino de Bosnia']);
  assert.deepEqual(owners('Slano_Korcula', 1350), ['Dalmacia veneciana']);
  assert.deepEqual(owners('Slano_Mljet', 1350), ['Comuna de Mljet', 'República de Ragusa']);
  assert.deepEqual(owners('Slano_Mljet', 1410), ['República de Ragusa']);
  assert.deepEqual(owners('Slano_Korcula', 1415), ['Croacia']);
  assert.deepEqual(owners('Slano_Korcula', 1420), ['Dalmacia veneciana']);
  assert.deepEqual(owners('Slano_Korcula', 1797), ['Dalmacia austríaca']);
});

test('partial acquisitions and the Lastovo occupation have independent dates', () => {
  assert.deepEqual(owners('Dubrovnik_Konavle', 1418), ['Reino de Bosnia']);
  assert.deepEqual(owners('Dubrovnik_Konavle', 1420), ['Reino de Bosnia', 'República de Ragusa']);
  assert.deepEqual(owners('Dubrovnik_Konavle', 1426), ['República de Ragusa']);
  assert.deepEqual(owners('Lastovo_Island_Wasteland', 1603), ['Dalmacia veneciana']);
  assert.deepEqual(owners('Lastovo_Island_Wasteland', 1606), ['República de Ragusa']);
  assert.deepEqual(owners('Dubrovnik', 1700), ['República de Ragusa']);
});

test('a dated countship maps its own fief, with evidence and no invented death year', () => {
  for (const [id, year, territory, ids] of [
    ['HRVATINSTJEPANIC', 1301, 'Donji Kraji', ['Kljuc']],
    ['DRAGISAVUKCIC', 1395, 'Glaž', ['Glaz']],
    ['HRVOJEHUM', 1405, 'Donji Kraji', ['Kljuc', 'Kozara']],
  ]) {
    const person = PERSONAS.find(person => person.id === id);
    const mapped = mapAuthoritiesForPerson(person, year, data).find(entry => entry.territory === territory);
    assert.deepEqual(mapped.ids.sort(), ids.sort());
    assert(mapped.mapSources.every(source => source.locator));
    const claim = personClaims(person).find(claim => claim.value === mapped.government);
    assert(claim.sources.length);
  }
  assert.equal(PERSONAS.find(person => person.id === 'HRVATINSTJEPANIC').muer, undefined);
  assert.equal(PERSONAS.find(person => person.id === 'DRAGISAVUKCIC').muer, undefined);
  assert.equal(mapAuthoritiesForPerson(PERSONAS.find(person => person.id === 'DRAGISAVUKCIC'), 1402, data).length, 0);
});

test('the relief and mobile northern frontier stay visible without a fictitious conquest date', () => {
  for (const id of ['Glaz', 'Kozara']) {
    assert.deepEqual(owners(id, 1400), ['Reino de Bosnia']);
    assert.deepEqual(owners(id, 1500), ['Banato húngaro de Jajce', 'Bosnia y Herzegovina otomanas']);
    assert.deepEqual(owners(id, 1530), ['Bosnia y Herzegovina otomanas', 'Croacia']);
    assert.deepEqual(owners(id, 1536), ['Bosnia y Herzegovina otomanas']);
  }
});
