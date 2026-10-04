import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const lab = path.resolve(import.meta.dirname, '../prototypes/euv-locations');
const data = JSON.parse(fs.readFileSync(path.join(lab, 'corridor-locations.json'), 'utf8'));
const carlos = JSON.parse(fs.readFileSync(path.join(lab, 'carlos-v-locations.json'), 'utf8'));
const burgundy = JSON.parse(fs.readFileSync(path.join(lab, 'burgundian-locations.json'), 'utf8'));
const svg = fs.readFileSync(path.join(lab, 'euv-locations-crop.svg'), 'utf8');
const pathIds = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));

function ids(name, year) {
  const territory = data.territories.find(item => item.name === name);
  assert(territory, `Unknown jurisdiction ${name}`);
  return new Set([...territory.versions].reverse().find(version => version.from <= year).ids);
}

test('territorial crosswalk uses only SVG IDs and never assigns one ID twice within a corridor', () => {
  assert.equal(data.territories.length, 33);
  for (let year = data.from; year <= data.through; year++) {
    for (const corridor of ['Iberia', 'Italia', 'Centroeuropa']) {
      const owner = new Map();
      for (const territory of data.territories.filter(item => item.corridor === corridor)) {
        for (const id of ids(territory.name, year)) {
          assert(pathIds.has(id), `${id} is absent from the cropped map`);
          assert(!owner.has(id), `${id} is claimed by ${owner.get(id)} and ${territory.name} in ${year}`);
          owner.set(id, territory.name);
        }
      }
    }
  }
});

test('Central European jurisdictions respect dated transfers and separate imperial estates', () => {
  assert(ids('Austria Interior', 1400).has('Trieste'));
  assert(!ids('Austria Interior', 1465).has('Rijeka'));
  assert(ids('Austria Interior', 1466).has('Rijeka'));
  assert(!ids('Austria Interior', 1499).has('Lienz'));
  assert(!ids('Tirol', 1499).has('Lienz'));
  assert(ids('Tirol', 1500).has('Lienz'));
  for (const id of ['Kufstein', 'Kitzbuhel']) {
    assert(!ids('Tirol', 1503).has(id));
    assert(ids('Tirol', 1504).has(id));
  }
  for (const id of ['Brixen', 'Bruneck', 'Cavalese']) assert(!ids('Tirol', 1500).has(id));
  assert.equal(ids('Baviera', 1504).size, 0);
  assert(ids('Baviera', 1505).has('Munich'));
  for (const id of ['Freising', 'Garmisch', 'Passau', 'Regensburg', 'Muhldorf', 'Laufen', 'Neuburg_an_der_Donau']) {
    assert(!ids('Baviera', 1505).has(id));
  }
  assert(ids('Palatinado', 1627).has('Amberg'));
  assert(!ids('Palatinado', 1628).has('Amberg'));
  assert(ids('Baviera', 1628).has('Amberg'));
  assert(!ids('Baviera', 1628).has('Leuchtenberg'));
  for (const id of ['Leiningen', 'Leuchtenberg', 'Speyer', 'Landau_Rhineland', 'Pirmasens']) {
    assert(!ids('Palatinado', 1500).has(id));
  }
  assert(ids('Palatinado', 1409).has('Zweibrucken'));
  assert(!ids('Palatinado', 1410).has('Zweibrucken'));
});

test('Hungarian-Croatian aggregate stops at Mohács and does not reclaim Venetian Dalmatia', () => {
  assert(ids('Hungría', 1525).has('Buda'));
  assert.equal(ids('Hungría', 1526).size, 0);
  assert.equal(ids('Hungría', 1650).size, 0);
  assert(ids('Hungría', 1408).has('Zadar'));
  assert(!ids('Hungría', 1409).has('Zadar'));
  assert(ids('Venecia', 1409).has('Zadar'));
  assert(ids('Hungría', 1419).has('Sibenik'));
  assert(!ids('Hungría', 1420).has('Sibenik'));
  assert(ids('Venecia', 1420).has('Sibenik'));
  assert(data.territories.find(t => t.name === 'Bohemia').note.includes('Moravia'));
});

test('dated Iberian transfers move individual locations rather than an entire old province', () => {
  for (const [id, year] of [['Antequera', 1410], ['Gibraltar', 1462], ['Ronda', 1485], ['Loja', 1486]]) {
    assert(ids('Granada', year - 1).has(id), `${id} should precede the Castilian transfer`);
    assert(!ids('Castilla', year - 1).has(id));
    assert(!ids('Granada', year).has(id));
    assert(ids('Castilla', year).has(id));
  }
  assert(ids('Trinacria', 1529).has('Malta'));
  assert(!ids('Trinacria', 1530).has('Malta'));
});

test('Italian enclaves, transfers and successor states remain separate', () => {
  assert(!ids('Nápoles', 1500).has('Benevento'));
  assert(ids('Estados Pontificios', 1500).has('Benevento'));
  assert(ids('Milán', 1426).has('Vercelli'));
  assert(ids('Piamonte', 1427).has('Vercelli'));
  assert(!ids('Milán', 1427).has('Vercelli'));
  assert(ids('Ferrara', 1483).has('Rovigo'));
  assert(ids('Venecia', 1484).has('Rovigo'));
  assert(!ids('Ferrara', 1484).has('Rovigo'));
  assert(ids('Ferrara', 1510).has('Rovigo'));
  assert(ids('Venecia', 1516).has('Rovigo'));
  assert(!ids('Estados Pontificios', 1598).has('Rovigo'));
  for (const id of ['Pola', 'Rovinj']) assert(ids('Venecia', 1400).has(id));
  assert(!ids('Venecia', 1408).has('Zadar'));
  assert(ids('Venecia', 1409).has('Zadar'));
  for (const id of ['Sibenik', 'Split', 'Brac', 'Kotor']) {
    assert(!ids('Venecia', 1419).has(id));
    assert(ids('Venecia', 1420).has(id));
  }
  assert(!ids('Venecia', 1500).has('Zara'), 'Zara is a different EU V location');
  assert(!ids('Venecia', 1500).has('Dubrovnik'), 'The Republic of Ragusa was not Venice');
  assert(!ids('Parma', 1544).has('Parma'));
  assert(ids('Parma', 1545).has('Parma'));
  for (const year of [1569, 1650]) assert(!ids('Toscana', year).has('Piombino'));
  for (const id of ['Mirandola', 'Guastalla']) assert(!ids('Módena', 1500).has(id));
});

test('Cuijk is a separate Charles V lordship, not Brabant, in both pilots', () => {
  const territory = carlos.territories.find(item => item.territory === 'Señorío de Cuijk');
  assert(territory);
  assert.equal(territory.from, 1509);
  assert.equal(territory.through, 1555);
  assert(territory.versions[0].ids.includes('Cuijk'));
  const charles = burgundy.people.find(person => person.id === 'CARLOS5');
  const lordship = charles.governments.find(item => item.territory === 'Señorío de Cuijk');
  assert(lordship);
  assert(lordship.condition.includes('empeñado'));
  assert(!charles.governments.find(item => item.territory === 'Brabante').versions[0].ids.includes('Cuijk'));
});
