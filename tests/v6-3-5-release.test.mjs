import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {territorialIdentity} from '../src/cartography/territorialIdentity.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {DISTINCT_TERRITORY_NAMES, territoryNameKey} from '../src/data/territoryNameCollisions.js';

const read = name => JSON.parse(fs.readFileSync(`data/cartography/${name}.json`, 'utf8'));
const data = read('corridor-locations');
data.burgundy = read('burgundian-locations');
const mosaics = new Map();
const at = (year, id) => {
  if (!mosaics.has(year)) mosaics.set(year, europeMosaicAt(data, year, PERSONAS));
  const layers = mosaics.get(year).byLocation.get(id) || [];
  return {
    rulers: [...new Set(layers.flatMap(layer => (layer.candidates || []).filter(c => c.ids.has(id)).map(c => c.personId)))].sort(),
    english: layers.some(layer => layer.english.size > 0),
    fief: layers.map(layer => layer.crownRelation?.type).find(Boolean) || null,
    colors: [...new Set(layers.map(layer => layer.mosaicColor))],
  };
};

test('Aquitania es una sola entidad y la corona francesa la sigue tratando igual', () => {
  assert.equal(TERRITORIOS['Ducado de Aquitania'], undefined);
  assert.equal(territorialIdentity('Ducado de Aquitania'), 'Aquitania');
  assert.deepEqual(TERRITORIOS.Aquitania.etapas.map(e => [e.clase, e.desde, e.hasta]), [['principado', 1362, 1372]]);
  // Bajo los Plantagenet: feudo del rey de Francia, tierras de la corona inglesa, un solo color.
  for (const id of ['Bordeaux', 'Bayonne', 'Mauleon', 'Tosse']) {
    const plantagenet = at(1250, id);
    assert.deepEqual(plantagenet.rulers, ['ENRIQ3ING'], id);
    assert.ok(plantagenet.english, `${id}: tierras de la corona inglesa`);
    assert.equal(plantagenet.fief, 'feudo', `${id}: feudo del rey de Francia`);
    assert.equal(plantagenet.colors.length, 1, `${id}: una sola capa`);
  }
  // Brétigny (1360) cede Bigorra en plena soberanía; la Guyena es francesa desde 1453.
  assert.ok(at(1365, 'Tarbes').english);
  assert.ok(!at(1460, 'Bordeaux').english);
});

test('cambios de rango de una misma entidad: una ficha con etapas y redirecciones', () => {
  const routes = JSON.parse(fs.readFileSync('routes.json', 'utf8')).redirects;
  for (const [gone, main, es, en, esMain, enMain] of [
    ['Ducado de Aquitania', 'Aquitania', 'ducado-de-aquitania', 'duchy-of-aquitaine', 'aquitania', 'aquitaine'],
    ['Obispado de Riga', 'Arzobispado de Riga', 'obispado-de-riga', 'bishopric-of-riga', 'arzobispado-de-riga', 'archbishopric-of-riga'],
    ['Principado de Leiningen', 'Condado de Leiningen', 'principado-de-leiningen', 'principality-of-leiningen', 'condado-de-leiningen', 'county-of-leiningen'],
    ['Señorío de Ioannina', 'Despotado de Ioannina', 'senorio-de-ioannina', 'lordship-of-ioannina', 'despotado-de-ioannina', 'despotate-of-ioannina'],
  ]) {
    assert.equal(TERRITORIOS[gone], undefined, gone);
    assert.ok(TERRITORIOS[main], main);
    assert.equal(territorialIdentity(gone), main);
    assert.ok(routes.some(r => r.source === `/es/territorio/${es}` && r.destination === `/es/territorio/${esMain}` && r.permanent), es);
    assert.ok(routes.some(r => r.source === `/en/territory/${en}` && r.destination === `/en/territory/${enMain}` && r.permanent), en);
  }
  assert.deepEqual(TERRITORIOS['Arzobispado de Riga'].etapas.map(e => [e.desde, e.hasta]), [[1201, 1254]]);
  assert.deepEqual(TERRITORIOS['Condado de Leiningen'].etapas.map(e => [e.clase, e.desde, e.hasta]), [['principado', 1779, 1793]]);
  // El color de Riga ya no cambia en 1255: la misma identidad antes y después.
  assert.deepEqual(at(1240, 'Riga').colors, at(1300, 'Riga').colors);
});

test('ninguna ficha nueva coincide con otra sin una razón histórica documentada', () => {
  const groups = new Map();
  for (const name of Object.keys(TERRITORIOS)) {
    const key = territoryNameKey(name);
    groups.set(key, [...(groups.get(key) || []), name]);
  }
  const documented = new Map(DISTINCT_TERRITORY_NAMES.map(entry => [territoryNameKey(entry.names[0]), entry]));
  for (const [key, names] of groups) {
    if (names.length < 2) continue;
    const entry = documented.get(key);
    assert.ok(entry, `Fichas que coinciden sin justificar: ${names.join(' | ')}. Fusiónalas con etapas o documenta por qué son entidades distintas.`);
    assert.ok(!entry.merged, `${names.join(' | ')} figura como fusionada`);
    for (const name of names) assert.ok(entry.names.includes(name), `${name} no está en su grupo documentado`);
    assert.ok(entry.reason.length > 40, `${names.join(' | ')}: razón demasiado breve`);
  }
  for (const entry of DISTINCT_TERRITORY_NAMES.filter(e => e.merged)) {
    assert.equal(entry.names.filter(name => TERRITORIOS[name]).length, 1, `${entry.names.join(' | ')}: debe quedar una sola ficha`);
  }
});
