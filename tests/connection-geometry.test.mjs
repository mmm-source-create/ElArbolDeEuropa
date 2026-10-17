import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/personas.jsx';
import {buildGraph} from '../src/explorer/relationshipGraph.js';
import {connectionTree} from '../src/connections/connectionTree.js';
import {selectionLayout} from '../src/connections/selectionLayout.js';
import {treeSvg} from '../src/connections/treeExport.js';

// Geometry of the trees drawn by Conectar and by the export. The same layout
// serves both, so the rules are checked on the layout and on the SVG output.
const BY = Object.fromEntries(PERSONAS.map(p => [p.id, p]));
const graph = buildGraph(PERSONAS);
const CASES = [
  ['CARLOS5', 'LUIS14FRA', 'ENRIQ8ING', 'FRAN1FRA'],
  ['AMEDEO8SAB', 'TOMAS1SAL', 'MARGPALEO', 'EMANUELFILIBERTOCAR', 'VIOLANTEMONBYZ'],
  ['ISAB1CAST', 'FEL2ESP'],
  ['FEL2ESP', 'MARIA1ING', 'ISABELVALOISESP'],
].map(ids => ({ids, result: connectionTree(graph, ids)}));
const isParent = (parent, child) => BY[child]?.padre === parent || BY[child]?.madre === parent;

test('Conectar: cada hijo queda una fila por debajo de su padre o madre y las parejas comparten fila', () => {
  for (const {ids, result} of CASES) {
    const {positions} = selectionLayout(result.ids, {}, BY, result.edges);
    for (const edge of result.edges) {
      const a = positions[edge.from], b = positions[edge.to];
      if (edge.type === 'sangre') {
        const [parent, child] = isParent(edge.from, edge.to) ? [a, b] : [b, a];
        assert.equal(child.row - parent.row, 1, `${ids.join('+')}: ${edge.from}→${edge.to}`);
      } else assert.equal(a.row, b.row, `${ids.join('+')}: pareja ${edge.from}–${edge.to}`);
    }
  }
});

test('Conectar: contemporáneos en la misma generación, sin solapes ni cruces entre padres e hijos', () => {
  const {result} = CASES[0];
  const {positions} = selectionLayout(result.ids, {}, BY, result.edges);
  assert.equal(positions.ENRIQ8ING.row, positions.CARLOS5.row, 'Enrique VIII y Carlos V son de la misma generación');
  assert.equal(positions.MARIA1ING.row, positions.FEL2ESP.row, 'María I y Felipe II, casados, comparten fila');
  for (const {result: r} of CASES) {
    const layout = selectionLayout(r.ids, {}, BY, r.edges), boxes = Object.values(layout.positions);
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++)
      if (boxes[i].row === boxes[j].row) assert.ok(Math.abs(boxes[i].x - boxes[j].x) >= boxes[i].w, 'tarjetas solapadas');
    const links = r.edges.filter(e => e.type === 'sangre').map(e => {
      let a = layout.positions[e.from], b = layout.positions[e.to];
      if (a.row > b.row) [a, b] = [b, a];
      return [a.row, a.x, b.x];
    });
    let crossings = 0;
    for (let i = 0; i < links.length; i++) for (let j = i + 1; j < links.length; j++)
      if (links[i][0] === links[j][0] && (links[i][1] - links[j][1]) * (links[i][2] - links[j][2]) < 0) crossings++;
    assert.equal(crossings, 0, `cruces en ${r.terminals.join('+')}`);
  }
});

test('Conectar: las parejas quedan juntas en su fila', () => {
  const {result} = CASES[0];
  const {positions} = selectionLayout(result.ids, {}, BY, result.edges);
  const row = Object.entries(positions).filter(([, p]) => p.row === positions.FEL2ESP.row).sort((a, b) => a[1].x - b[1].x).map(([id]) => id);
  const felipe = row.indexOf('FEL2ESP');
  for (const wife of ['MARIA1ING', 'ISABELVALOISESP']) assert.equal(Math.abs(row.indexOf(wife) - felipe), 1, `${wife} junto a Felipe II`);
});

test('Exportar: el SVG reproduce las filas y columnas de la pantalla y nada sale del lienzo', () => {
  for (const {result} of CASES) {
    const people = result.ids.map(id => BY[id]);
    const scene = treeSvg({people, edges: result.edges, gen: {}, terminals: result.terminals, margin: 12});
    const doc = new JSDOM(scene.svg, {contentType: 'image/svg+xml'}).window.document;
    assert.equal(doc.querySelector('parsererror'), null);
    const [, , width, height] = doc.documentElement.getAttribute('viewBox').split(' ').map(Number);
    assert.equal(width, scene.width); assert.equal(height, scene.height);
    const pad = 12, screen = selectionLayout(result.ids, {}, BY, result.edges).positions;
    const cards = [...doc.querySelectorAll('g > g > rect')];
    assert.equal(cards.length, people.length);
    const byName = new Map(people.map(p => [p.nombre, p.id]));
    const rowOfY = new Map();
    for (const rect of cards) {
      const x = +rect.getAttribute('x'), y = +rect.getAttribute('y'), w = +rect.getAttribute('width'), h = +rect.getAttribute('height');
      assert.ok(x + pad >= 0 && y + pad >= 0 && x + w + pad <= width && y + h + pad <= height, 'tarjeta fuera del lienzo');
      const id = byName.get(rect.parentNode.querySelector('title').textContent.split(' · ')[0]);
      assert.equal(x, screen[id].x, `${id}: misma columna que en pantalla`);
      if (!rowOfY.has(screen[id].row)) rowOfY.set(screen[id].row, y);
      assert.equal(y, rowOfY.get(screen[id].row), `${id}: misma fila que en pantalla`);
    }
    for (const text of doc.querySelectorAll('text')) {
      const x = +text.getAttribute('x'), y = +text.getAttribute('y');
      assert.ok(x + pad >= 0 && x + pad < width && y + pad > 0 && y + pad <= height, `texto fuera del lienzo: ${text.textContent}`);
    }
    for (const path of doc.querySelectorAll('path')) assert.doesNotMatch(path.getAttribute('d'), /NaN|undefined/);
  }
});
