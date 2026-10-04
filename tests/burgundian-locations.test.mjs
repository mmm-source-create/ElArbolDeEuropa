import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const lab = path.resolve(import.meta.dirname, '../prototypes/euv-locations');
const data = JSON.parse(fs.readFileSync(path.join(lab, 'burgundian-locations.json'), 'utf8'));
const carlos = JSON.parse(fs.readFileSync(path.join(lab, 'carlos-v-locations.json'), 'utf8'));
const svg = fs.readFileSync(path.join(lab, 'euv-locations-crop.svg'), 'utf8');
const paths = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));

function snapshot(year) {
  const persons = data.people.filter(person => person.from <= year && year <= person.through);
  assert.equal(persons.length, 1, `Expected one successor at the close of ${year}`);
  const person = persons[0];
  const assignments = new Map();
  for (const government of person.governments) {
    if (year < government.from || year > government.through) continue;
    const version = [...government.versions].reverse().find(item => item.from <= year);
    assert(version, `${government.territory} lacks a version in ${year}`);
    for (const id of version.ids) {
      assert(paths.has(id), `${id} is absent from the cropped SVG`);
      assert(!assignments.has(id), `${id} has two jurisdictions in ${year}`);
      assignments.set(id, government.territory);
    }
  }
  return {person, owner: id => assignments.get(id) || null};
}

test('year-end succession has no double owner or overlapping jurisdictions', () => {
  for (let year = 1419; year <= 1555; year++) snapshot(year);
  assert.deepEqual(data.audit.yearOwnershipConflicts, []);
});

test('Burgundian gains and losses follow the dated political record', () => {
  assert.equal(snapshot(1419).owner('Dijon'), 'Borgoña');
  assert.equal(snapshot(1419).owner('Macon'), null);
  assert.equal(snapshot(1435).owner('Macon'), 'Condado de Mâcon');
  assert.equal(snapshot(1473).owner('Venlo'), 'Güeldres');
  assert.equal(snapshot(1476).owner('Charolles'), 'Condado de Charolais');
  assert.equal(snapshot(1477).person.id, 'MARIABORG');
  for (const id of ['Dijon', 'Arras', 'Besancon', 'Abbeville', 'Charolles', 'Venlo']) {
    assert.equal(snapshot(1477).owner(id), null, `${id} should not be painted for Mary in 1477`);
  }
  assert.equal(snapshot(1482).person.id, 'FEL1CAST');
  assert.equal(snapshot(1492).owner('Charolles'), null);
  assert.equal(snapshot(1493).owner('Charolles'), 'Condado de Charolais');
  assert.equal(snapshot(1493).owner('Arras'), 'Artois');
  assert.equal(snapshot(1506).person.id, 'CARLOS5');
  assert.equal(snapshot(1506).owner('Dijon'), null);
  assert.equal(snapshot(1520).owner('Tournai'), null);
  assert.equal(snapshot(1521).owner('Tournai'), 'Tournaisis');
  assert.equal(snapshot(1527).owner('Utrecht'), null);
  assert.equal(snapshot(1528).owner('Utrecht'), 'Utrecht');
  assert.equal(snapshot(1542).owner('Venlo'), null);
  assert.equal(snapshot(1543).owner('Venlo'), 'Güeldres');
  for (const year of [1419, 1435, 1476, 1477, 1493, 1548]) {
    assert.equal(snapshot(year).owner('Calais'), null, `Calais must remain English in ${year}`);
  }
});

test('the Burgundian slice of Carlos V is consistent with the earlier pilot', () => {
  const year = 1548;
  const burgundian = snapshot(year);
  for (const territory of carlos.territories.filter(item => item.group === 'burgundian')) {
    const earlierVersion = [...territory.versions].reverse().find(version => version.from <= year);
    const current = data.people.find(person => person.id === 'CARLOS5').governments.find(item => item.territory === territory.territory);
    assert(current, `Missing ${territory.territory} in succession pilot`);
    const currentVersion = [...current.versions].reverse().find(version => version.from <= year);
    assert.deepEqual(currentVersion.ids, earlierVersion.ids, `${territory.territory} drifted from Carlos V pilot`);
    for (const id of currentVersion.ids) assert.equal(burgundian.owner(id), territory.territory);
  }
});
