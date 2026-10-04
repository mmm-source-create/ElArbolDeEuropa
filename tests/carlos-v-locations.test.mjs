import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const lab = path.join(root, 'prototypes/euv-locations');
const data = JSON.parse(fs.readFileSync(path.join(lab, 'carlos-v-locations.json'), 'utf8'));
const svg = fs.readFileSync(path.join(lab, 'euv-locations-crop.svg'), 'utf8');
const locations = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));

function at(year) {
  const assignments = new Map();
  for (const territory of data.territories) {
    if (year < territory.from || year > territory.through) continue;
    const version = [...territory.versions].reverse().find(item => item.from <= year);
    for (const id of version.ids) {
      assert(locations.has(id), `Missing location ${id}`);
      const groups = assignments.get(id) || new Set();
      groups.add(territory.group);
      assignments.set(id, groups);
    }
  }
  for (const [id, groups] of assignments) assert.equal(groups.size, 1, `Conflicting political colours for ${id} in ${year}`);
  return id => [...(assignments.get(id) || [])][0] || null;
}

test('dated inheritances and acquisitions change the right locations', () => {
  assert.equal(at(1506)('Middelburg'), 'burgundian');
  assert.equal(at(1517)('Tournai'), null);
  assert.equal(at(1521)('Tournai'), 'burgundian');
  assert.equal(at(1520)('Vienna'), 'austrian');
  assert.equal(at(1523)('Vienna'), null);
  assert.equal(at(1527)('Utrecht'), null);
  assert.equal(at(1528)('Utrecht'), 'burgundian');
  assert.equal(at(1529)('Malta'), 'spanish');
  assert.equal(at(1530)('Malta'), null);
  assert.equal(at(1534)('Milano'), null);
  assert.equal(at(1535)('Milano'), 'spanish');
  assert.equal(at(1542)('Venlo'), null);
  assert.equal(at(1543)('Venlo'), 'burgundian');
});

test('office, title and neighboring states do not become direct domains', () => {
  for (const year of [1517, 1520, 1535, 1548]) {
    const group = at(year);
    for (const id of ['London', 'Lisbon', 'Paris', 'Dijon', 'Copenhagen', 'Prague', 'Budapest', 'Venice', 'Rome', 'Andorra_la_Vella', 'Benevento', 'Biella', 'Vercelli', 'Cambrai']) {
      if (locations.has(id)) assert.equal(group(id), null, `${id} should not be Carlos V's direct domain in ${year}`);
    }
  }
  assert.deepEqual(data.audit.crossGroupConflicts, []);
  assert.deepEqual(data.audit.userTags.mappedNotInSuppliedList, []);
});
