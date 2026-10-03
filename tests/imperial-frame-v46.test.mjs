import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { imperialFrameIds } from '../src/data/imperialFrame.js';
import { idsDeReinoEnAño, colorTerritorioEnMapa, REINO_COLOR } from '../src/Territorios.jsx';
import { PERSONAS } from '../src/personas.jsx';

const people = Object.fromEntries(PERSONAS.map(person => [person.id, person]));
const svgIds = new Set([...readFileSync(new URL('../src/MapChart_Map.svg', import.meta.url), 'utf8')
  .matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));

test('el marco imperial tiene una geometría real y excluye coronas exteriores', () => {
  for (const year of [1512, 1600, 1647, 1648, 1792]) {
    const ids = imperialFrameIds(year);
    assert.ok(ids.length > 140);
    assert.deepEqual(ids.filter(id => !svgIds.has(id)), []);
    for (const id of ['Slesvig', 'Zealand', 'Lower_Prussia', 'Buda', 'Venice', 'Florence']) {
      assert.ok(!ids.includes(id), `${id} no debe pintarse como feudo imperial`);
    }
  }
  assert.deepEqual(imperialFrameIds(1450), []);
  assert.deepEqual(imperialFrameIds(1800), []);
});

test('1648 retira las provincias septentrionales y la Confederación suiza, no los Países Bajos meridionales', () => {
  assert.ok(imperialFrameIds(1647).includes('Friesland'));
  assert.ok(imperialFrameIds(1647).includes('Aargau'));
  assert.ok(!imperialFrameIds(1648).includes('Friesland'));
  assert.ok(!imperialFrameIds(1648).includes('Aargau'));
  assert.ok(imperialFrameIds(1648).includes('Brabant'));
  assert.ok(imperialFrameIds(1648).includes('Prague'));
});

test('el Franco Condado imperial sale del marco tras su cesión de 1678', () => {
  assert.ok(imperialFrameIds(1677).includes('Amont'));
  assert.ok(imperialFrameIds(1677).includes('Millieu'));
  assert.ok(imperialFrameIds(1677).includes('Aval'));
  assert.ok(!imperialFrameIds(1678).includes('Amont'));
  assert.ok(!imperialFrameIds(1515).includes('Dijonnais'));
});

test('Austria, Austria Interior y Tirol se cartografían como tierras distintas', () => {
  const austria = idsDeReinoEnAño('Austria', 1500);
  const inner = idsDeReinoEnAño('Austria Interior', 1500);
  const tyrol = idsDeReinoEnAño('Tirol', 1500);
  assert.ok(austria.includes('Ober_dem_Wienerwald'));
  assert.ok(!austria.includes('Salzburger_Land'));
  assert.ok(!austria.includes('South_Tirol'));
  assert.ok(inner.includes('Gorizia'));
  assert.ok(!inner.includes('Ober_dem_Wienerwald'));
  assert.ok(tyrol.includes('Oberinntal'));
  assert.ok(!tyrol.includes('Upper_Styria'));
});

test('la partición de 1564 y la reunión parcial de 1619 siguen gobiernos, no solo parentescos', () => {
  assert.ok(people.FERN1EMP.gobiernos.some(g => g.territorio === 'Tirol' && g.desde === 1522));
  assert.ok(people.MAXIM2.gobiernos.some(g => g.territorio === 'Austria' && g.desde === 1564));
  assert.ok(people.CARLOS2ESTIRIA.gobiernos.some(g => g.territorio === 'Austria Interior' && g.desde === 1564));
  assert.ok(people.FERN2TIROL.gobiernos.some(g => g.territorio === 'Tirol' && g.desde === 1564));
  assert.ok(people.FERN2EMP.gobiernos.some(g => g.territorio === 'Austria' && g.desde === 1619));
  assert.equal(colorTerritorioEnMapa(people.FERN1EMP, 'Austria Interior', 1540), REINO_COLOR.Austria);
  assert.equal(colorTerritorioEnMapa(people.CARLOS2ESTIRIA, 'Austria Interior', 1570), REINO_COLOR['Austria Interior']);
});
