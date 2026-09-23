import test from 'node:test';
import assert from 'node:assert/strict';
import { computeTreeLayout, routeFamilyConnectors, TREE_PAD_TOP, TREE_ROW_GAP } from '../src/explorer/treeLayout.js';
import { computeParentGroups } from '../src/explorer/relationshipGraph.js';

const people = [
  { id: 'P', nombre: 'Parent', conyuge: 'Q' }, { id: 'Q', nombre: 'Partner', conyuge: 'P' },
  { id: 'E', nombre: 'Older child', padre: 'P', madre: 'Q' },
  { id: 'C', nombre: 'Child', padre: 'P', madre: 'Q' }, { id: 'S', nombre: 'Sibling', padre: 'P', madre: 'Q' },
  { id: 'G', nombre: 'Grandchild', padre: 'C' },
];
const byId = Object.fromEntries(people.map(person => [person.id, person]));
const children = { P: ['E', 'C', 'S'], Q: ['E', 'C', 'S'], C: ['G'] };
const sparse = Array.from({ length: 40 }, () => []);
sparse[5] = [['P', 'Q']]; sparse[12] = [['E']]; sparse[19] = [['C'], ['S']]; sparse[25] = [['G']];
const dense = sparse.filter(row => row.length);
const gen = { P: 5, Q: 5, E: 12, C: 19, S: 19, G: 25 };

test('una selección no reserva espacio para las generaciones ocultas ni altera parejas o hermanos', () => {
  const filtered = computeTreeLayout(sparse, byId, children);
  const compact = computeTreeLayout(dense, byId, children);
  assert.equal(filtered.height, compact.height);
  assert.ok(filtered.height < 1200, 'seis personas caben en sus cuatro filas visibles');
  assert.equal(filtered.positions.P.y, TREE_PAD_TOP);
  for (const person of people) {
    const actual = filtered.positions[person.id], expected = compact.positions[person.id];
    for (const coordinate of ['x', 'y', 'w', 'h']) assert.equal(actual[coordinate], expected[coordinate], `${person.id}.${coordinate}`);
    assert.equal(actual.row, gen[person.id], 'el índice genealógico original se conserva');
  }
  assert.equal(filtered.positions.C.y, filtered.positions.S.y);
  assert.equal(filtered.positions.P.x + filtered.positions.P.w, filtered.positions.Q.x);
  assert.equal(filtered.positions.E.y - filtered.rowBands[5][1], TREE_ROW_GAP);
  assert.deepEqual(filtered.pairContacts['P|Q'].parentIds, compact.pairContacts['P|Q'].parentIds);
  assert.deepEqual(filtered.pairContacts['P|Q'].points, compact.pairContacts['P|Q'].points);
  assert.equal(filtered.rowBands.length, sparse.length);
});

test('los conectores atraviesan generaciones ocultas y terminan en los hijos correctos sin invadir sus cajas', () => {
  const layout = computeTreeLayout(sparse, byId, children);
  const routing = routeFamilyConnectors({ groupsByRow: computeParentGroups(people, gen), positions: layout.positions,
    pairContacts: layout.pairContacts, gen, rows: sparse, rowBands: layout.rowBands, canvasWidth: layout.width });
  assert.equal(routing.families.length, 3);
  assert.deepEqual(routing.families.flatMap(family => family.childIds).sort(), ['C', 'E', 'G', 'S']);
  assert.equal(routing.diagnostics.sharedMultiRowFamilies, 1);
  const siblingGroups = routing.families.filter(family => family.parentIds.length === 2);
  assert.equal(siblingGroups.filter(family => family.trunkD).length, 1, 'hermanos en distintas filas comparten un único tronco');
  for (const family of routing.families) {
    const parentBottom = Math.max(...family.parentIds.map(id => layout.positions[id].y + layout.positions[id].h));
    for (const branch of family.branches) {
      assert.doesNotMatch(branch.d, /NaN|Infinity/);
      const numbers = branch.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
      const child = layout.positions[branch.childId];
      assert.deepEqual(numbers.slice(-2), [child.x + child.w / 2, child.y]);
      for (let index = 1; index < numbers.length; index += 2) {
        assert.ok(numbers[index] > parentBottom, 'la barra del hijo sale por debajo de sus padres');
        assert.ok(numbers[index] <= child.y, 'el conector entra por el borde superior de la ficha');
        assert.ok(numbers[index] < layout.height);
      }
    }
  }
});

test('una selección vacía o una persona al final de la base conserva un canvas utilizable', () => {
  const empty = computeTreeLayout(Array.from({ length: 40 }, () => []), byId, children);
  assert.equal(empty.height, 700);
  assert.deepEqual(empty.positions, {});
  const last = Array.from({ length: 40 }, () => []); last[39] = [['G']];
  const single = computeTreeLayout(last, byId, children);
  assert.equal(single.positions.G.y, TREE_PAD_TOP);
  assert.equal(single.positions.G.row, 39);
  assert.equal(single.height, 700);
});
