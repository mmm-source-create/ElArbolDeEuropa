import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectionGenerations, crossRowPartners, layoutSelection} from '../src/domain/genealogy/selectionTree.js';
import {buildRows, computeTreeLayout, createFanBlueprint, TREE_FAN_MIN, TREE_SIBLING_GAP, TREE_FAMILY_GAP} from '../src/domain/genealogy/treeLayout.js';
import {PERSONAS} from '../src/data/personas.js';
import {BY_ID, HIJOS_POR_ID} from '../src/domain/genealogy/relations.js';

const make = list => Object.fromEntries(list.map(person => [person.id, person]));

test('una selección pone a los hermanos en la misma fila y une entre filas a la pareja que no cabe', () => {
  // Manuel se casa con una tía (M) y con su sobrina (L): no pueden compartir
  // fila con las dos sin separar a L de su hermano C.
  const people = [
    {id: 'IS', conyuges: ['FE']}, {id: 'FE', conyuges: ['IS']},
    {id: 'M', padre: 'FE', madre: 'IS', conyuges: ['MA']}, {id: 'J', padre: 'FE', madre: 'IS', conyuges: ['F']},
    {id: 'F', conyuges: ['J']}, {id: 'MA', conyuges: ['M', 'L']},
    {id: 'C', padre: 'F', madre: 'J', conyuges: ['IP']}, {id: 'L', padre: 'F', madre: 'J', conyuges: ['MA']},
    {id: 'IP', padre: 'MA', madre: 'M', conyuges: ['C']},
  ];
  const gen = selectionGenerations(people, make(people));
  assert.equal(gen.C, gen.L, 'hermanos en la misma fila');
  assert.equal(gen.C, gen.J + 1, 'un hijo, justo debajo de sus padres');
  assert.equal(gen.IP, gen.C, 'Isabel comparte fila con su marido');
  assert.equal(gen.MA, gen.M);
  assert.deepEqual(crossRowPartners(people, gen).map(pair => pair.key), ['L|MA']);
});

test('las ramas sin parentesco visible se colocan por fecha y nadie queda por encima de sus padres', () => {
  const people = [
    {id: 'A', nac: 1400}, {id: 'B', padre: 'A', nac: 1430}, {id: 'C', padre: 'B', nac: 1460},
    {id: 'X', nac: 1462}, {id: 'Y', padre: 'X', nac: 1490},
  ];
  const gen = selectionGenerations(people, make(people));
  assert.equal(gen.X, gen.C);
  assert.equal(gen.Y, gen.X + 1);
  assert.equal(Math.min(...Object.values(gen)), 0);
});

test('Carlos V, a dos grados: sus hermanos en su fila y ninguna generación vacía entre padres e hijos', () => {
  const ids = new Set(['CARLOS5']);
  let front = ['CARLOS5'];
  for (let depth = 0; depth < 2; depth += 1) {
    front = front.flatMap(id => {
      const person = BY_ID[id];
      return [person.padre, person.madre, ...(HIJOS_POR_ID[id] || []), ...(person.conyuges || [])].filter(other => other && BY_ID[other] && !ids.has(other));
    });
    front.forEach(id => ids.add(id));
  }
  const people = [...ids].map(id => BY_ID[id]);
  const {gen, layout} = layoutSelection(people, BY_ID, HIJOS_POR_ID);
  const siblings = people.filter(person => person.padre === BY_ID.CARLOS5.padre && person.madre === BY_ID.CARLOS5.madre);
  assert.ok(siblings.length >= 5);
  siblings.forEach(person => assert.equal(gen[person.id], gen.CARLOS5, person.nombre));
  for (const person of people) for (const parentId of [person.padre, person.madre]) {
    if (ids.has(parentId)) assert.ok(gen[person.id] > gen[parentId]);
  }
  assert.ok(layout.crossPartners.some(pair => pair.key.includes('MAN1PORT')), 'Manuel I se une a una de sus esposas entre filas');
  assert.ok(Object.keys(layout.positions).length === people.length);
});

test('hermanos más juntos que familias ajenas y grupos grandes en dos líneas al tresbolillo', () => {
  const people = [{id: 'P'}, ...Array.from({length: TREE_FAN_MIN}, (_, index) => ({id: `H${index}`, padre: 'P'})), {id: 'Z', padre: 'Q'}, {id: 'Q'}];
  const byId = make(people);
  const children = {P: people.filter(person => person.padre === 'P').map(person => person.id), Q: ['Z']};
  const fan = computeTreeLayout([[['P'], ['Q']], [...children.P.map(id => [id]), ['Z']]], byId, children);
  const fanUnit = fan.rowUnits[1].find(unit => unit.fan);
  assert.ok(fanUnit, 'los ocho hermanos forman un abanico');
  const lines = [...new Set(children.P.map(id => fan.positions[id].y))];
  assert.equal(lines.length, 2);
  const [first, second] = [children.P.slice(0, 4), children.P.slice(4)].map(group => group.map(id => fan.positions[id]));
  second.forEach(box => {
    const center = box.x + box.w / 2;
    assert.ok(first.every(upper => center <= upper.x || center >= upper.x + upper.w), 'el conector de la segunda línea baja por un hueco');
  });
  const pair = computeTreeLayout([[['P'], ['Q']], [['H0'], ['H1'], ['Z']]], byId, {P: ['H0', 'H1'], Q: ['Z']});
  const [h0, h1, z] = ['H0', 'H1', 'Z'].map(id => pair.positions[id]);
  assert.equal(h1.x - (h0.x + h0.w), TREE_SIBLING_GAP);
  assert.ok(z.x - (h1.x + h1.w) >= TREE_FAMILY_GAP);
  assert.equal(createFanBlueprint(['a', 'b', 'c']).boxes.filter(box => box.y > 0).length, 1);
});

test('el árbol completo conserva su base precalculada', () => {
  const base = JSON.parse(fs.readFileSync('src/generated/treeBase.json', 'utf8'));
  assert.deepEqual(buildRows(PERSONAS, base.gen), base.rows);
  const explorer = fs.readFileSync('src/features/atlas/Explorer.jsx', 'utf8');
  assert.match(explorer, /visiblePeople\.length === PERSONAS\.length \|\| visiblePeople\.length > SELECTION_TREE_LIMIT/);
  assert.match(explorer, /family-connector-partners/);
});
