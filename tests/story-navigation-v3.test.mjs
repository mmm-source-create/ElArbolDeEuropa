import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveStoryNavigation, writeStoryNavigation } from '../src/explorer/storyNavigation.js';
import { resolverRuta } from '../src/routing.js';

const story = { id: 'borgona', titulo: 'Borgoña, el reino que no fue', disponible: true,
  pasos: [{ anio: 1400, personas: ['A', 'B'] }, { anio: 1410, personas: ['C', 'A'] }, { anio: 1420, persona: 'D' }] };
const other = { id: 'other', titulo: 'Otra historia', pasos: [{ anio: 1500, personas: ['X'] }] };
const unavailable = { id: 'soon', titulo: 'Próximamente', disponible: false, pasos: [{ personas: ['Y'] }] };
const stories = [story, other, unavailable];

test('el Atlas resuelve capítulos nuevos y enlaces antiguos sin perder la historia completa', () => {
  for (const [path, search, index] of [
    ['/es/', '?atlas=1&historia=borgona&paso=2', 1],
    ['/es/historia/borgona-el-reino-que-no-fue', '?atlas=1', 0],
    ['/historia/borgona', '?atlas=1', 0],
    ['/es/historia/borgona-el-reino-que-no-fue/capitulo/3/', '?atlas=1', 2],
    ['/es/', '?atlas=1&regreso=/es/historia/borgona-el-reino-que-no-fue/capitulo/2', 1],
  ]) {
    const context = resolveStoryNavigation(path, search, stories);
    assert.equal(context.story, story);
    assert.equal(context.index, index);
    assert.deepEqual(context.ids, ['A', 'B', 'C', 'D']);
    assert.equal(context.returnPath, `/es/historia/borgona-el-reino-que-no-fue/capitulo/${index + 1}`);
    const reading = new URL(context.returnPath, 'https://example.test');
    assert.equal(resolverRuta(reading.pathname, reading.search).view, 'story', 'al salir vuelve al lector, también desde un enlace antiguo con atlas=1');
    assert.equal(reading.search, '');
  }
});

test('las URLs inglesas regresan al capítulo equivalente y no aceptan destinos ajenos', () => {
  const english = '/en/story/burgundy-the-kingdom-that-never-was/chapter/2';
  assert.equal(resolveStoryNavigation(english, '', stories).returnPath, english);
  const context = resolveStoryNavigation('/es/', `?historia=borgona&paso=3&regreso=${english}`, stories);
  assert.equal(context.returnPath, '/en/story/burgundy-the-kingdom-that-never-was/chapter/3');
  for (const path of ['https://evil.test/es/historia/other/capitulo/1', '//evil.test', '/es/historia/otra-historia/capitulo/1', '/es/historia/borgona-el-reino-que-no-fue/capitulo/1?outside=1']) {
    const query = new URLSearchParams({ historia: 'borgona', paso: '2', regreso: path });
    assert.equal(resolveStoryNavigation('/es/', query, stories).returnPath, '/es/historia/borgona-el-reino-que-no-fue/capitulo/2');
  }
});

test('los pasos inválidos se acotan y una historia desconocida no abre otra por accidente', () => {
  for (const [step, index] of [['0', 0], ['-1', 0], ['wrong', 0], ['2.5', 0], ['999999999999999999999999', 2], ['3', 2]]) {
    assert.equal(resolveStoryNavigation('/es/', `?historia=borgona&paso=${step}`, stories).index, index);
  }
  for (const id of ['unknown', 'soon', '']) assert.equal(resolveStoryNavigation('/es/', `?historia=${id}&regreso=/es/historia/borgona/capitulo/1`, stories), null);
  assert.equal(resolveStoryNavigation('/es/', '?atlas=1', stories), null);
  assert.equal(resolveStoryNavigation('/es/historia/no-existe', '?atlas=1', stories), null);
});

test('avanzar, recargar y volver atrás conservan alcance y restauran el capítulo de cada URL', () => {
  const url = new URL('https://example.test/es/persona/a?atlas=1&familia=A&continuar=1&resaltar=OLD&conectar=Z&vinculos=sangre&persona=B');
  const returnPath = '/en/story/burgundy-the-kingdom-that-never-was/chapter/1';
  const history = [];
  for (const index of [0, 1, 2]) {
    writeStoryNavigation(url, story, index, returnPath);
    history.push(url.href);
    assert.equal(url.pathname, '/es/');
    assert.deepEqual(url.searchParams.getAll('seleccion'), ['A', 'B', 'C', 'D']);
    assert.deepEqual(url.searchParams.getAll('resaltar'), index === 0 ? ['A', 'B'] : index === 1 ? ['C', 'A'] : ['D']);
    assert.equal(url.searchParams.get('persona'), 'B');
    for (const key of ['familia', 'continuar', 'conectar', 'vinculos']) assert.equal(url.searchParams.has(key), false);
  }
  for (const index of [2, 1, 0, 1]) {
    const restored = new URL(history[index]);
    const context = resolveStoryNavigation(restored.pathname, restored.search, stories);
    assert.equal(context.index, index);
    assert.equal(context.returnPath, `/en/story/burgundy-the-kingdom-that-never-was/chapter/${index + 1}`);
    assert.deepEqual(context.ids, ['A', 'B', 'C', 'D']);
  }
});

test('una persona ajena se sustituye por la del paso y los IDs conocidos pueden filtrarse antes de escribir', () => {
  const url = new URL('https://example.test/es/?persona=OUTSIDE');
  writeStoryNavigation(url, story, 1, null, ['A', 'B', 'C']);
  assert.equal(url.searchParams.get('persona'), 'C');
  assert.deepEqual(url.searchParams.getAll('seleccion'), ['A', 'B', 'C']);
  writeStoryNavigation(url, story, 2, null, []);
  assert.deepEqual(url.searchParams.getAll('seleccion'), ['']);
  assert.equal(url.searchParams.has('persona'), false);
});
