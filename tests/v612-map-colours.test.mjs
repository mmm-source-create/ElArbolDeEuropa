import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {governmentGroupsAt} from '../src/domain/government/governmentPresentation.js';
import {harmonizeMapColor} from '../src/cartography/mapColors.js';
import {PALETTE_612, COLOR_612} from '../src/cartography/paletteReview612.js';
import {deltaE} from '../scripts/lib/colorDistance.mjs';

const person = id => PERSONAS.find(p => p.id === id);

test('on the common map one sovereign is one colour, except the Empire', () => {
  const groups = governmentGroupsAt(person('CARLOS5'), 1520, {view: 'panorama'});
  const spain = groups.find(g => g.id === 'monarquia-hispanica-exterior');
  const austria = groups.find(g => g.id === 'tierras-austriacas');
  const empire = groups.find(g => g.id === 'sacro-imperio');
  assert.equal(austria.color, spain.color);
  assert.equal(austria.sharedSovereign, spain.id);
  assert.notEqual(empire.color, spain.color);
  // A kingdom outranks a county when choosing the main realm.
  const theobald = governmentGroupsAt(person('TEOB1NAV'), 1250, {view: 'panorama'});
  assert.equal(new Set(theobald.map(g => g.color)).size, 1);
  assert.equal(theobald.find(g => g.sharedSovereign)?.sharedSovereign, 'Navarra');
  // Each ruler's own map keeps one colour per realm.
  const personal = governmentGroupsAt(person('CARLOS5'), 1520).filter(g => g.kind === 'sovereign' && g.id !== 'sacro-imperio');
  assert.ok(new Set(personal.map(g => g.color)).size > 1);
  assert.ok(personal.every(g => !g.sharedSovereign));
});

test('common-map colours are harmonised and reviewed colours keep away from their old ones', () => {
  assert.equal(harmonizeMapColor('#ff0000'), 'hsl(0.0 48.0% 50.0%)');
  assert.equal(harmonizeMapColor('hsl(120 30% 45%)'), 'hsl(120 30% 45%)');
  assert.equal(harmonizeMapColor('url(#pattern)'), 'url(#pattern)');
  assert.ok(Object.keys(PALETTE_612).length >= 50);
  for (const [territory, {from, to}] of Object.entries(PALETTE_612)) {
    assert.equal(COLOR_612[from.toLowerCase()], to, territory);
    assert.ok(deltaE(from, to) > 0, territory);
  }
  // The clashes that prompted the review: one side of each pair changed.
  for (const pair of [['Principado de Rostov', 'Principado de Tver'], ['Kanato de Kazán', 'Tierra de Viatka'], ['Lituania', 'Prusia de la Orden']]) {
    assert.ok(pair.some(name => PALETTE_612[name]), pair.join(' / '));
  }
});
