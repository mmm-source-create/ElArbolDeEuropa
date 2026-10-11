import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {conyugesDe, gobiernosDe, territoriosDe, intervalosDisputadosDe} from '../src/data/personAccessors.js';
import {PERSONAS} from '../src/personas.jsx';
import {readPersonLiteral} from '../scripts/schema/read-contract-data.mjs';
import {personClaims} from '../src/evidence/claims.js';
import {authorityKind, mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {familyIndex, familyIds} from '../src/explorer/progressiveAtlas.js';
import {reinadosEfectivos} from '../src/desafio/desafioGovernments.js';
import {parentescoRegistrado} from '../src/data/successionHistory.js';
import {listaReinados} from '../src/Territorios.jsx';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import BioDiscovery from '../src/components/BioDiscovery.jsx';

const source = readPersonLiteral(readFileSync(new URL('../src/personas.jsx', import.meta.url), 'utf8'));

test('las lecturas opcionales no añaden campos ni convierten ausencia en un dato histórico', () => {
  const person = Object.freeze({id: 'A', documentacion: {ausencias: {padres: 'unknown'}}});
  for (const input of [undefined, null, person]) {
    assert.deepEqual(conyugesDe(input), []);
    assert.deepEqual(gobiernosDe(input), []);
    assert.deepEqual(territoriosDe(input), []);
    assert.deepEqual(intervalosDisputadosDe(input), []);
  }
  assert.equal(Object.hasOwn(person, 'conyuges'), false);
  assert.equal(Object.hasOwn(person, 'gobiernos'), false);
  assert.equal(person.documentacion.ausencias.padres, 'unknown');
});

test('las listas conyugales se leen como IDs únicos en el orden registrado', () => {
  const person = Object.freeze({conyuges: Object.freeze(['B', 'D', 'C'])});
  assert.deepEqual(conyugesDe(person), ['B', 'D', 'C']);
  assert.deepEqual(person.conyuges, ['B', 'D', 'C']);
});

test('las fichas públicas priorizan los IDs declarados sobre las tarjetas expandidas', () => {
  const publicPerson = {conyugesIds: ['C', 'B', 'C'], conyuges: [{id: 'B'}, {id: 'D'}]};
  assert.deepEqual(conyugesDe(publicPerson), ['C', 'B']);
  // Preserve V5.0's fallback for public cards with no explicit spouse IDs.
  assert.deepEqual(conyugesDe({...publicPerson, conyugesIds: []}), ['B', 'D']);
  assert.deepEqual(conyugesDe({conyuges: [{id: 'C'}, {id: 'B'}]}), ['C', 'B']);
});

test('los vínculos inversos pertenecen al índice familiar y los amantes no se vuelven cónyuges', () => {
  const people = [{id: 'A', conyuges: ['B'], amantes: ['C']}, {id: 'B'}, {id: 'C'}];
  assert.deepEqual(conyugesDe(people[1]), []);
  assert.deepEqual(familyIds(familyIndex(people), 'B'), ['B', 'A']);
  assert.deepEqual(familyIds(familyIndex(people), 'C'), ['C']);
});

test('los mandatos conservan referencias sin recurrir al alias retirado', () => {
  const government = Object.freeze({territorio: 'Austria', desde: 1500, hasta: 1510});
  const governments = Object.freeze([government]);
  assert.strictEqual(gobiernosDe({gobiernos: governments}), governments);
  assert.deepEqual(gobiernosDe({reinados: governments}), []);
  assert.deepEqual(listaReinados({reinado: [1500, 1510], reinos: ['Austria']}), []);
  assert.deepEqual(conyugesDe({conyuge: 'B', conyuge2: 'C'}), []);
  assert.deepEqual(gobiernosDe({gobiernos: [], reinados: governments}), []);
});

test('territorios asociados no producen mandatos, ni los mandatos amplían asociaciones', () => {
  const associations = Object.freeze(['Francia', 'Castilla']);
  const person = Object.freeze({reinos: associations});
  assert.strictEqual(territoriosDe(person), associations);
  assert.deepEqual(gobiernosDe(person), []);
  assert.deepEqual(territoriosDe({gobiernos: [{territorio: 'Austria'}]}), []);
});

test('las listas de disputa conservan notas, orden y objetos originales', () => {
  const first = Object.freeze({desde: 1619, hasta: 1620, nota: 'Disputa documentada'});
  const second = Object.freeze({desde: 1625, hasta: 1626});
  const periods = Object.freeze([second, first]);
  assert.strictEqual(intervalosDisputadosDe({controlDisputado: periods}), periods);
  assert.equal(intervalosDisputadosDe({controlDisputado: periods})[1].nota, first.nota);
});

test('los contenedores mal tipados no se aceptan como listas vacías', () => {
  for (const invoke of [
    () => gobiernosDe({gobiernos: {}}),
    () => territoriosDe({reinos: 'Francia'}),
    () => conyugesDe({conyuges: 'A'}),
    () => conyugesDe({conyugesIds: 'A'}),
    () => conyugesDe({conyuges: [{}]}),
    () => intervalosDisputadosDe({controlDisputado: '1619'}),
    () => intervalosDisputadosDe({controlDisputado: {desde: 1619, hasta: 1620}}),
  ]) assert.throws(invoke, TypeError);
});

test('la autoridad conserva los límites inclusivos y la diferencia entre soberanía y disputa', () => {
  const period = {desde: 1619, hasta: 1620};
  const government = {controlDisputado: [period], condicion: 'efectivo', titulo: 'Rey'};
  for (const [year, expected] of [[1618, 'sovereign'], [1619, 'disputed'], [1620, 'disputed'], [1621, 'sovereign']]) {
    assert.equal(authorityKind(government, year), expected);
  }
  assert.equal(authorityKind({...government, condicion: 'titular'}, 1619), 'titular');
  assert.equal(authorityKind({condicion: 'gobierno delegado', titulo: 'Gobernadora'}, 1619), 'delegated');
});

test('toda la fuente literal mantiene cónyuges, asociaciones y objetos de mandato sin necesitar el alias', () => {
  const before = JSON.stringify(source);
  for (const person of source) {
    assert.equal(Object.hasOwn(person, 'reinados'), false);
    assert.deepEqual(conyugesDe(person), person.conyuges || [], person.id);
    assert.deepEqual(territoriosDe(person), person.reinos || [], person.id);
    assert.deepEqual(gobiernosDe(person), person.gobiernos || [], person.id);
    for (const government of gobiernosDe(person)) {
      assert.strictEqual(listaReinados(person).find(g => g === government), government);
      assert.strictEqual(personClaims(person).find(c => c.field === 'Gobierno' && c.value === government)?.value, government);
    }
  }
  assert.equal(JSON.stringify(source), before);
});

test('el módulo publicado es idéntico al literal y no añade propiedades heredadas', () => {
  assert.deepEqual(PERSONAS, source);
  for (const person of PERSONAS) for (const field of ['reinados', 'reinado', 'conyuge', 'conyuge2']) {
    assert.equal(Object.hasOwn(person, field), false, `${person.id}.${field}`);
  }
  assert.deepEqual(parentescoRegistrado('CARLOS5', 'ISABPORTEMP', PERSONAS), {texto: 'Cónyuges', via: ['CARLOS5', 'ISABPORTEMP']});
});

test('el mapa y el desafío consumen gobiernos canónicos y públicos con la misma evidencia', () => {
  const person = source.find(p => p.id === 'MARGPARMA');
  const publicPerson = JSON.parse(JSON.stringify(person));
  const canonicalMap = mapAuthoritiesForPerson(person, 1560);
  const publicMap = mapAuthoritiesForPerson(publicPerson, 1560);
  assert(canonicalMap.length > 0);
  assert.deepEqual(publicMap.map(({person, ...entry}) => entry), canonicalMap.map(({person, ...entry}) => entry));
  for (const entry of publicMap) {
    assert.equal(entry.kind, 'delegated');
    assert.strictEqual(entry.claim.value, entry.government);
    assert(publicPerson.gobiernos.includes(entry.government));
    assert(entry.claim.sources.length > 0);
  }
  assert.deepEqual(reinadosEfectivos(publicPerson), reinadosEfectivos(person));
});

test('las sugerencias de la biografía usan asociaciones y admiten personas sin territorio', () => {
  const subject = {id: 'A', nombre: 'Sujeto', nac: 1300, muer: 1360, reinos: ['Francia']};
  const people = [subject,
    {id: 'B', nombre: 'Asociado', nac: 1305, muer: 1355, reinos: ['Francia']},
    {id: 'C', nombre: 'Soberano', titulo: 'Emperador', nac: 1305, muer: 1355, reinos: ['Italia'], gobiernos: [{territorio: 'Francia'}]},
    {id: 'D', nombre: 'Sin territorio', nac: 1340, muer: 1370},
  ];
  const html = renderToStaticMarkup(createElement(BioDiscovery, {
    persona: subject, personas: people, hijosPorId: {}, historias: [],
    getSpouses: conyugesDe, getReigns: gobiernosDe, hrefPersona: p => `/persona/${p.id}`,
  }));
  assert(html.includes('También puede interesarte'));
  assert(html.indexOf('/persona/B') < html.indexOf('/persona/C'));
  assert(html.includes('/persona/D'));
  assert(!html.includes('/persona/A'));
});
