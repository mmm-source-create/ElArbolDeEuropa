import test from 'node:test';
import assert from 'node:assert/strict';
import { PERSONAS } from '../src/personas.jsx';
import { BY_ID, HIJOS_POR_ID } from '../src/explorer/model.js';
import { computeGenerations, buildRows, computeTreeLayout } from '../src/explorer/treeLayout.js';
import { buildScene, hitTest, relatedIds, screenToWorld, visibleBoxes } from '../src/lab/scene.js';

const gen = computeGenerations(PERSONAS);
const rows = buildRows(PERSONAS, gen);
const base = { gen, rows, layout: computeTreeLayout(rows, BY_ID, HIJOS_POR_ID) };

test('el laboratorio reutiliza posiciones y conexiones reales para ambos renderizadores', () => {
  const ids = relatedIds(PERSONAS, 14);
  assert.equal(ids.length, 14);
  assert.equal(new Set(ids).size, 14);
  assert.ok(ids.includes('CARLOS5'));
  const scene = buildScene(base, PERSONAS, ids, HIJOS_POR_ID);
  assert.equal(scene.boxes.length, 14);
  assert.ok(scene.paths.length > 0);
  assert.ok(scene.paths.every(path => typeof path === 'string' && !/NaN|Infinity/.test(path)));
  const carlos = scene.boxes.find(box => box.id === 'CARLOS5');
  assert.ok(carlos);
  assert.equal(hitTest(scene.boxes, carlos.x + carlos.w / 2, carlos.y + carlos.h / 2)?.id, 'CARLOS5');
  assert.equal(hitTest(scene.boxes, -1, -1), null);
  const camera = { x: carlos.x, y: carlos.y, zoom: 2 };
  assert.equal(screenToWorld(100, 100, { left: 0, top: 0 }, camera).x, carlos.x + 50);
  assert.ok(visibleBoxes(scene.boxes, camera, 400, 300).some(box => box.id === 'CARLOS5'));
});

test('la escena completa usa las posiciones precalculadas sin perder tarjetas', () => {
  const scene = buildScene(base, PERSONAS, relatedIds(PERSONAS, PERSONAS.length), HIJOS_POR_ID);
  assert.equal(scene.boxes.length, PERSONAS.length);
  assert.ok(scene.paths.length > PERSONAS.length);
  assert.deepEqual(scene.boxes.find(box => box.id === 'CARLOS5').x, base.layout.positions.CARLOS5.x);
});
