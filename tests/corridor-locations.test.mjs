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
  assert.equal(data.territories.length, 77);
  for (let year = data.from; year <= data.through; year++) {
    for (const corridor of ['Iberia', 'Italia', 'Centroeuropa', 'Polonia–Lituania', 'Francia e islas británicas']) {
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

test('Burgundian jurisdictions stay distinct while their ownership changes', () => {
  assert(ids('Borgoña', 1476).has('Dijon'));
  assert(!ids('Borgoña', 1477).has('Dijon'));
  assert(ids('Francia', 1477).has('Dijon'));
  assert(ids('Condado de Borgoña', 1476).has('Dole'));
  assert(!ids('Condado de Borgoña', 1477).has('Dole'));
  assert(ids('Condado de Borgoña', 1493).has('Dole'));
  assert(!ids('Utrecht', 1527).has('Utrecht'));
  assert(ids('Utrecht', 1528).has('Utrecht'));
  assert(ids('Señorío de Cuijk', 1509).has('Cuijk'));
  assert(!ids('Brabante', 1509).has('Cuijk'));
  for (const year of [1419, 1476, 1477, 1493, 1548]) {
    const owner = new Map();
    for (const territory of data.territories.filter(item => item.corridor === 'Borgoña e Imperio'
      && item.name !== 'Marco jurídico del Sacro Imperio')) {
      for (const id of ids(territory.name, year)) {
        assert(pathIds.has(id));
        assert(!owner.has(id), `${id} overlaps ${owner.get(id)} and ${territory.name} in ${year}`);
        owner.set(id, territory.name);
      }
    }
  }
});

test('imperial legal reference changes at Westphalia without becoming an emperor possession', () => {
  const frame = data.territories.find(item => item.name === 'Marco jurídico del Sacro Imperio');
  assert(frame?.note.includes('no un Estado unificado'));
  assert.equal(ids(frame.name, 1511).size, 0);
  for (const id of ['Aachen', 'Vienna', 'Prague', 'Milano', 'Brussels']) {
    assert(ids(frame.name, 1512).has(id));
    assert(pathIds.has(id));
  }
  for (const id of ['Dijon', 'Calais', 'London', 'Venice', 'Bordeaux']) {
    assert(!ids(frame.name, 1512).has(id));
  }
  assert(ids(frame.name, 1647).has('Amsterdam'));
  assert(!ids(frame.name, 1648).has('Amsterdam'));
  assert(ids(frame.name, 1647).has('Bern'));
  assert(!ids(frame.name, 1648).has('Bern'));
  assert(ids(frame.name, 1648).has('Brussels'));
});

test('western corridor respects French incorporations and English continental withdrawals', () => {
  assert.equal(ids('Francia', 1452).size, 0, 'the Hundred Years War frontier remains unaudited');
  assert(ids('Bretaña', 1531).has('Rennes'));
  assert(!ids('Francia', 1531).has('Rennes'));
  assert(ids('Francia', 1532).has('Rennes'));
  assert.equal(ids('Bretaña', 1532).size, 0);
  assert(ids('Provenza', 1485).has('Aix_En_Provence'));
  assert(ids('Francia', 1486).has('Aix_En_Provence'));
  assert(!ids('Provenza', 1486).has('Aix_En_Provence'));
  for (const name of ['Francia', 'Provenza']) assert(!ids(name, 1500).has('Barcelonnette'));
  assert(ids('Saboya', 1500).has('Barcelonnette'));
  assert(ids('Bailiazgo de Jersey', 1460).has('Jersey'));
  assert(ids('Francia', 1461).has('Jersey'));
  assert(!ids('Bailiazgo de Jersey', 1461).has('Jersey'));
  assert(ids('Bailiazgo de Jersey', 1468).has('Jersey'));
  assert(!ids('Francia', 1468).has('Jersey'));
  assert(ids('Plaza inglesa de Calais', 1557).has('Calais'));
  assert(!ids('Francia', 1557).has('Calais'));
  assert(ids('Francia', 1558).has('Calais'));
  assert.equal(ids('Plaza inglesa de Calais', 1558).size, 0);
  assert(ids('Plazas inglesas de Guyena', 1450).has('Bordeaux'));
  assert(!ids('Plazas inglesas de Guyena', 1451).has('Bordeaux'));
  assert(ids('Plazas inglesas de Guyena', 1452).has('Bordeaux'));
  assert.equal(ids('Plazas inglesas de Guyena', 1453).size, 0);
});

test('British and Irish locations do not follow a shared monarch into the wrong kingdom', () => {
  assert(ids('Escocia', 1603).has('Edinburgh'));
  assert(!ids('Inglaterra', 1603).has('Edinburgh'));
  assert(!ids('Escocia', 1400).has('Orkney'));
  assert(!ids('Escocia', 1468).has('Shetland'));
  for (const id of ['Orkney', 'Shetland']) assert(ids('Escocia', 1469).has(id));
  assert(!ids('Escocia', 1500).has('Torshavn'));
  assert(!ids('Escocia', 1500).has('Mann'));
  assert(ids('Señorío de Man', 1406).has('Mann'));
  assert(ids('Inglaterra', 1460).has('Berwick'));
  assert(ids('Escocia', 1461).has('Berwick'));
  assert(!ids('Inglaterra', 1481).has('Berwick'));
  assert(ids('Inglaterra', 1482).has('Berwick'));
  assert(!ids('Escocia', 1482).has('Berwick'));
  const pale = ids('Núcleo inglés en Irlanda', 1500);
  for (const id of ['Dublin', 'Trim', 'Drogheda', 'Dundalk']) assert(pale.has(id));
  for (const id of ['Galway', 'Longford', 'Wicklow_Mountains']) assert(!pale.has(id));
  assert.notEqual(data.territories.find(t => t.name === 'Núcleo inglés en Irlanda').color,
    data.territories.find(t => t.name === 'Inglaterra').color,
    'the Irish jurisdiction retains its own color under the same monarch');
});

test('Polish-Lithuanian corridor separates incorporation, fief and the 1569 union', () => {
  assert(ids('Ducado de Mazovia', 1461).has('Rawa'));
  assert(ids('Corona de Polonia', 1462).has('Rawa'));
  assert(ids('Ducado de Mazovia', 1475).has('Sochaczew'));
  assert(ids('Corona de Polonia', 1476).has('Sochaczew'));
  assert(ids('Ducado de Mazovia', 1494).has('Plock'));
  assert(ids('Corona de Polonia', 1495).has('Plock'));
  assert(ids('Ducado de Mazovia', 1525).has('Warsaw'));
  assert(ids('Corona de Polonia', 1526).has('Warsaw'));

  for (const id of ['Malbork', 'Elblag', 'Dzierzgon']) {
    assert(ids('Prusia de la Orden', 1400).has(id));
    assert(!ids('Prusia de la Orden', 1466).has(id));
    assert(ids('Prusia Real', 1466).has(id));
    assert(!ids('Prusia ducal', 1525).has(id));
  }
  assert(ids('Prusia de la Orden', 1524).has('Konigsberg'));
  assert(ids('Prusia ducal', 1525).has('Konigsberg'));
  assert(!ids('Corona de Polonia', 1525).has('Konigsberg'));

  assert(ids('Gran Ducado de Lituania', 1568).has('Kyiv'));
  assert(!ids('Corona de Polonia', 1568).has('Kyiv'));
  assert(ids('Corona de Polonia', 1569).has('Kyiv'));
  assert(!ids('Gran Ducado de Lituania', 1569).has('Kyiv'));
  assert(ids('Gran Ducado de Lituania', 1569).has('Vilnius'));
  for (const id of ['Suceava', 'Iasi', 'Slupsk']) assert(!ids('Corona de Polonia', 1500).has(id));
  assert.equal(ids('Corona de Polonia', 1570).size, 0, 'later changes need their own audit');
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
  assert(ids('Principado episcopal de Brixen', 1500).has('Brixen'));
  assert(ids('Principado episcopal de Brixen', 1500).has('Bruneck'));
  assert(ids('Principado episcopal de Trento', 1500).has('Cavalese'));
  assert(ids('Arzobispado principesco de Salzburgo', 1500).has('Muhldorf'));
  assert(ids('Arzobispado principesco de Salzburgo', 1500).has('Laufen'));
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
