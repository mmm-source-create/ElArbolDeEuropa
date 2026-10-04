import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { pilotBurgundianGovernmentsFor, pilotLocationContext, pilotLocationsFor } from '../src/data/locationMapPilot.js';

const data = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname,
  '../prototypes/euv-locations/corridor-locations.json'), 'utf8'));
data.burgundy = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname,
  '../prototypes/euv-locations/burgundian-locations.json'), 'utf8'));

test('the Atlas trial paints only audited dated jurisdictions, not every possession of a person', () => {
  const crown = pilotLocationsFor(data, 'Polonia', 1500);
  assert(crown.includes('Malbork'), 'Royal Prussia is attached to the Polish Crown');
  assert(!crown.includes('Konigsberg'), 'the Teutonic state is not a Crown province');
  assert(!pilotLocationsFor(data, 'Prusia', 1524).includes('Malbork'));
  assert(pilotLocationsFor(data, 'Prusia', 1525).includes('Konigsberg'));
  assert(!pilotLocationsFor(data, 'Prusia', 1525).includes('Malbork'));
  assert(!pilotLocationsFor(data, 'Hungría', 1541).includes('Buda'),
    'post-Mohács Hungary remains unassigned pending a successor-state audit');
  assert.deepEqual(pilotLocationsFor(data, 'Polonia', 1570), []);
});

test('western Atlas aliases preserve the separate kingdoms and dated French annexations', () => {
  assert(pilotLocationsFor(data, 'Inglaterra', 1500).includes('Calais'));
  assert(!pilotLocationsFor(data, 'Inglaterra', 1558).includes('Calais'));
  assert(pilotLocationsFor(data, 'Francia', 1532).includes('Rennes'));
  assert(!pilotLocationsFor(data, 'Francia', 1531).includes('Rennes'));
  assert(pilotLocationsFor(data, 'Escocia', 1603).includes('Edinburgh'));
  assert(!pilotLocationsFor(data, 'Inglaterra', 1603).includes('Edinburgh'));
  assert(pilotLocationsFor(data, 'Irlanda', 1500).includes('Dublin'));
  assert(!pilotLocationsFor(data, 'Irlanda', 1500).includes('Galway'));
});

test('an inspected location reports its distinct political context and sourced correction', () => {
  const [malbork] = pilotLocationContext(data, 'Malbork', 1500);
  assert.equal(malbork.name, 'Prusia Real');
  assert(malbork.correction?.source);
  assert(pilotLocationContext(data, 'Brixen', 1500).some(item => item.name === 'Principado episcopal de Brixen'));
  assert.deepEqual(pilotLocationContext(data, 'Buda', 1700), []);
});

test('the Atlas trial reuses the dated Burgundian succession without painting the French duchy for Charles V', () => {
  const charles = pilotBurgundianGovernmentsFor(data, 'CARLOS5', 1548);
  assert(charles.find(item => item.territory === 'Utrecht')?.ids.includes('Utrecht'));
  assert(charles.find(item => item.territory === 'Señorío de Cuijk')?.ids.includes('Cuijk'));
  assert(!charles.some(item => item.territory === 'Borgoña'));
  assert(pilotLocationContext(data, 'Cuijk', 1548, 'CARLOS5')
    .some(item => item.name === 'Señorío de Cuijk'));
  assert(!pilotBurgundianGovernmentsFor(data, 'CARLOS5', 1500).length);
});
