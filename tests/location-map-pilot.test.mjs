import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { mapLocationsForGovernment, pilotBurgundianGovernmentsFor, pilotImperialFrameFor, pilotLocationContext, pilotLocationsFor } from '../src/data/locationMapPilot.js';

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
  const polishCrown = pilotLocationsFor(data, 'Polonia', 1570);
  assert(polishCrown.includes('Kyiv'), 'the Crown retains its post-Lublin territories');
  assert(!polishCrown.includes('Vilnius'), 'the Lithuanian core remains politically distinct');
  const commonwealth = pilotLocationsFor(data, 'Polonia-Lituania', 1570);
  assert(commonwealth.includes('Kyiv') && commonwealth.includes('Vilnius'));
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

test('Balkan country views follow each polity and do not absorb tributary principalities', () => {
  assert(pilotLocationsFor(data, 'Serbia', 1426).includes('Belgrad'));
  assert(!pilotLocationsFor(data, 'Serbia', 1427).includes('Belgrad'));
  assert(pilotLocationsFor(data, 'Bosnia', 1462).includes('Vrhbosna'));
  assert(pilotLocationsFor(data, 'Bosnia', 1463).includes('Vrhbosna'));
  assert(pilotLocationsFor(data, 'Valaquia', 1500).includes('Bucharest'));
  assert(pilotLocationsFor(data, 'Moldavia', 1500).includes('Suceava'));
  assert(!pilotLocationsFor(data, 'Imperio otomano', 1500).includes('Bucharest'));
  assert(!pilotLocationsFor(data, 'Imperio otomano', 1500).includes('Suceava'));
  assert(pilotLocationsFor(data, 'Moldavia', 1537).includes('Tighina'));
  assert(!pilotLocationsFor(data, 'Moldavia', 1538).includes('Tighina'));
  assert(pilotLocationsFor(data, 'Imperio otomano', 1538).includes('Tighina'));
});

test('an inspected location reports its distinct political context and sourced correction', () => {
  const [malbork] = pilotLocationContext(data, 'Malbork', 1500);
  assert.equal(malbork.name, 'Prusia Real');
  assert(malbork.correction?.source);
  assert(pilotLocationContext(data, 'Brixen', 1500).some(item => item.name === 'Principado episcopal de Brixen'));
  const buda = pilotLocationContext(data, 'Buda', 1700);
  assert.deepEqual(buda.map(layer => layer.name), ['Hungría real']);
  assert(buda[0].source && buda[0].note.includes('Corona húngara'));
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

test('the emperor receives a legal backdrop without claiming that he governs each estate', () => {
  assert(pilotImperialFrameFor(data, 1548).includes('Aachen'));
  assert(pilotImperialFrameFor(data, 1548).includes('Brussels'));
  assert(!pilotImperialFrameFor(data, 1548).includes('Dijon'));
  assert.deepEqual(pilotLocationsFor(data, 'Sacro Imperio', 1548), []);
  assert(pilotLocationContext(data, 'Utrecht', 1548).some(item => item.name === 'Utrecht'));
});

test('the Atlas uses reviewed layers first and the all-territory crosswalk for unmigrated jurisdictions', () => {
  const lithuania = mapLocationsForGovernment(data, {territorio:'Lituania'}, 1570, 'SIG3POL', ['Vilnius']);
  const lithuaniaAfterPilotRange = mapLocationsForGovernment(data, {territorio:'Lituania'}, 1700, 'AUG2POL', ['Vilnius']);
  const unreviewed = mapLocationsForGovernment(data, {territorio:'Habsburgo'}, 1500, 'MAX1HAB', ['Aargau','Upper_Alsace']);
  const earlyFrance = mapLocationsForGovernment(data, {territorio:'Francia'}, 1400, 'CAR6FRA', ['Paris']);

  assert(lithuania.includes('Vilnius'));
  assert(lithuaniaAfterPilotRange.includes('Vilnius'), 'the Atlas keeps older dated coverage outside the pilot timeline');
  assert(unreviewed.length > 0, 'legacy territories with no named corridor layer use the measured geometry bridge');
  assert(earlyFrance.includes('Paris'), 'the reviewed medieval series replaces the old 1453-only cutoff');
  assert(!earlyFrance.includes('Bordeaux'));
  assert(!earlyFrance.includes('Perpignan'));
  assert(!earlyFrance.includes('Calais'));
});
