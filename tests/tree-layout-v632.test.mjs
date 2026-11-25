import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectionGenerations, crossRowPartners, layoutSelection} from '../src/domain/genealogy/selectionTree.js';
import {buildRows, computeTreeLayout, createFanBlueprint, TREE_FAN_MIN, TREE_SIBLING_GAP, TREE_FAMILY_GAP} from '../src/domain/genealogy/treeLayout.js';
import {PERSONAS} from '../src/data/personas.js';
import {dynastyColumns, inferSex} from '../src/domain/genealogy/dynastyColumns.js';
import {BY_ID, HIJOS_POR_ID} from '../src/domain/genealogy/relations.js';

const make = list => Object.fromEntries(list.map(person => [person.id, person]));

test('6.3.3: el matrimonio comparte siempre fila, aunque separe a dos hermanos', () => {
  // Manuel se casa con una tía (M) y con su sobrina (L): las dos comparten su
  // fila y no hay uniones entre filas.
  const people = [
    {id: 'IS', conyuges: ['FE']}, {id: 'FE', conyuges: ['IS']},
    {id: 'M', padre: 'FE', madre: 'IS', conyuges: ['MA']}, {id: 'J', padre: 'FE', madre: 'IS', conyuges: ['F']},
    {id: 'F', conyuges: ['J']}, {id: 'MA', conyuges: ['M', 'L']},
    {id: 'C', padre: 'F', madre: 'J', conyuges: ['IP']}, {id: 'L', padre: 'F', madre: 'J', conyuges: ['MA']},
    {id: 'IP', padre: 'MA', madre: 'M', conyuges: ['C']},
  ];
  const gen = selectionGenerations(people, make(people));
  assert.equal(gen.MA, gen.M);
  assert.equal(gen.MA, gen.L);
  assert.equal(gen.IP, gen.C);
  assert.ok(gen.C > gen.IP - 1 && gen.IP > gen.M);
  assert.deepEqual(crossRowPartners(people, gen), []);
});

test('6.3.3: la cabeza de una línea sin padres va a la fila de su época', () => {
  const people = [
    {id: 'A', nac: 1400}, {id: 'B', padre: 'A', nac: 1430}, {id: 'C', padre: 'B', nac: 1460}, {id: 'D', padre: 'C', nac: 1490},
    {id: 'R', nac: 1455}, {id: 'S', padre: 'R', nac: 1488, conyuges: ['D']}, {id: 'N'}, {id: 'O', padre: 'N', nac: 1490},
  ];
  people.find(p => p.id === 'D').conyuges = ['S'];
  const gen = selectionGenerations(people, make(people));
  assert.equal(gen.S, gen.D);
  assert.equal(gen.R, gen.S - 1, 'R no queda arriba del todo');
  assert.equal(gen.N, gen.O - 1, 'una cabeza sin fecha baja hasta su hijo');
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

test('Carlos V, a dos grados: cada matrimonio en su fila y nadie por encima de sus padres', () => {
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
  // Carlos V comparte fila con su mujer; su hermana Leonor, con Manuel I.
  assert.equal(gen.CARLOS5, gen.ISABPORTEMP);
  assert.equal(gen.MAN1PORT, gen.LEONAUST);
  assert.equal(gen.MAN1PORT, gen.MARIAARAGINF);
  for (const person of people) for (const parentId of [person.padre, person.madre]) {
    if (ids.has(parentId)) assert.ok(gen[person.id] > gen[parentId]);
  }
  assert.deepEqual(layout.crossPartners, [], 'sin uniones entre filas');
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

test('6.3.3: el árbol completo usa el mismo cálculo, con columnas por dinastía', () => {
  const base = JSON.parse(fs.readFileSync('src/generated/treeBase.json', 'utf8'));
  assert.equal(Object.keys(base.columns).length, PERSONAS.length);
  assert.deepEqual(base.layout.crossPartners, []);
  for (const person of PERSONAS) for (const partner of [...(person.conyuges || [])]) {
    if (base.gen[partner] !== undefined) assert.equal(base.gen[partner], base.gen[person.id], `${person.id} y ${partner}`);
  }
  const generator = fs.readFileSync('scripts/generate/generate-tree-base.mjs', 'utf8');
  assert.match(generator, /layoutSelection\(PERSONAS, BY_ID, HIJOS_POR_ID, \{swapLimit: Infinity\}\)/);
  assert.doesNotMatch(generator, /function computeTreeLayout/);
  const explorer = fs.readFileSync('src/features/atlas/Explorer.jsx', 'utf8');
  assert.match(explorer, /visiblePeople\.length === PERSONAS\.length \|\| visiblePeople\.length > SELECTION_TREE_LIMIT/);
  assert.match(explorer, /columnOf: baseColumns/);
});

test('6.3.3: las casas forman columnas y la mujer va a la de su marido', () => {
  const people = [
    {id: 'A1', dinastia: 'Habsburgo', titulo: 'Rey', conyuges: ['B2']}, {id: 'A2', dinastia: 'Habsburgo', titulo: 'Rey', padre: 'A1', madre: 'B2'},
    {id: 'B1', dinastia: 'Valois', titulo: 'Rey'}, {id: 'B2', dinastia: 'Valois', titulo: 'Reina', padre: 'B1', conyuges: ['A1']},
    {id: 'B3', dinastia: 'Valois', titulo: 'Rey', padre: 'B1'},
  ];
  const gen = selectionGenerations(people, make(people));
  const columns = dynastyColumns(people, gen);
  assert.equal(columns.get('B2'), columns.get('A1'), 'la reina va a la columna de su marido');
  assert.notEqual(columns.get('B3'), columns.get('A1'));
  assert.equal(inferSex(people).get('B2'), 'f');
});
