import test from 'node:test';
import assert from 'node:assert/strict';
import { atlasSearch } from '../src/explorer/atlasSearch.js';

const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const sources = {
  people: [{ id: '1', nombre: 'Carlos V', titulo: 'Emperador', dinastia: 'Habsburgo', reinos: ['Castilla'] }],
  dynasties: ['Habsburgo', 'Borbón'],
  territories: ['Castilla', 'Francia'],
  stories: [{ id: 's1', titulo: 'La corona de Castilla', disponible: true }, { id: 's2', titulo: 'Castilla futura', disponible: false }],
  events: [{ id: 'e1', titulo: 'Unión de Castilla', anio: 1474 }],
  normalize,
};

test('la búsqueda del Atlas distingue fichas, casas, lugares, historias y acontecimientos', () => {
  const results = atlasSearch('castilla', sources);
  assert.deepEqual(results.people.map(item => item.id), ['1']);
  assert.deepEqual(results.territories, ['Castilla']);
  assert.deepEqual(results.stories.map(item => item.id), ['s1']);
  assert.deepEqual(results.events.map(item => item.id), ['e1']);
  assert.equal(results.total, 4);
  assert.deepEqual(atlasSearch('castilla futura', sources).stories, []);
});

test('la búsqueda respeta tildes y prioriza el nombre exacto', () => {
  const results = atlasSearch('borbon', { ...sources, dynasties: ['Borbón-Anjou', 'Borbón'] });
  assert.deepEqual(results.dynasties, ['Borbón', 'Borbón-Anjou']);
  assert.equal(atlasSearch('', sources).total, 0);
});
