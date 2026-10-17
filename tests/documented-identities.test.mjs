import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims, EDITORIAL_HISTORY} from '../src/evidence/claims.js';

const byId = new Map(PERSONAS.map(person => [person.id, person]));
const claim = (id, suffix) => personClaims(byId.get(id)).find(item => item.id === `person:${id}:${suffix}`);

test('la maternidad probable de los Piccinino conserva identidad y reserva en su afirmación localizada', () => {
  for (const id of ['FRANCPICC', 'JACOPICC']) {
    const maternity = claim(id, 'mother');
    assert.equal(maternity.value, 'GABRIELLASESTIO');
    assert.equal(maternity.certainty, 'inferred');
    assert.equal(new URL(maternity.sources[0].url).hostname, 'www.treccani.it');
    assert.match(maternity.sources[0].locator, /Primer párrafo/);
    assert(maternity.note && maternity.reviewedAt);
    // Sourcing maternity does not silently certify another relationship.
    assert.equal(claim(id, 'father').certainty, 'pending');
    assert.deepEqual(claim(id, 'father').sources, []);
    assert(!Object.hasOwn(byId.get(id), 'madreAprox'));
  }
  assert.equal(claim('FRANCPICC', 'birth').certainty, 'approximate');
  assert.equal(claim('FRANCPICC', 'birth').timeLabel, 'c. 1407');
});

test('el reconocimiento de Matthew no confirma su paternidad biológica ni añade un segundo padre', () => {
  const person = byId.get('MATTHEWONEILL');
  const father = claim(person.id, 'father');
  assert.equal(person.padre, 'CONNBACACH');
  assert.equal(father.certainty, 'disputed');
  assert.equal(new URL(father.sources[0].url).hostname, 'www.dib.ie');
  assert(father.alternatives.some(item => item.includes('John Kelly')));
  assert.match(father.note, /reconocimiento no resuelve/);
  assert.equal(personClaims(person).filter(item => item.field === 'Padre').length, 1);
  assert.equal(claim(person.id, 'birth').value, 1510);
  assert.equal(claim(person.id, 'birth').certainty, 'approximate');
  assert.equal(claim(person.id, 'birth').timeLabel, 'c. 1510');
  assert(!Object.hasOwn(person, 'padreAprox'));
});

test('las madres sin nombre mantienen sus vínculos y no generan fechas ni fuentes ficticias', () => {
  for (const [id, child] of [['MUJERX1', 'CONSTENRIQ'], ['MUJERX2', 'ISABPORT2'], ['MUJERX3', 'LEONSANCH']]) {
    const person = byId.get(id);
    assert(person.identidadDesconocida);
    assert(!Object.hasOwn(person, 'nac') && !Object.hasOwn(person, 'muer'));
    assert(!personClaims(person).some(item => ['Nacimiento', 'Fallecimiento'].includes(item.field)));
    assert.equal(byId.get(child).madre, id);
    assert.equal(claim(child, 'mother').certainty, 'pending');
    assert.deepEqual(claim(child, 'mother').sources, []);
    assert(person.documentacion.notas.some(item => item.campo === 'Fechas'));
    assert(EDITORIAL_HISTORY.some(item => item.scope === id && item.date === '2026-10-11' && item.reason));
  }
});
