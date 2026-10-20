import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {governmentTableAt} from '../src/cartography/europePanorama.js';
import {personClaims, CLAIM_REVIEWS} from '../src/evidence/claims.js';
import {AUTHORITY_REVIEWS, authorityReferences} from '../src/evidence/authorityReviews.js';
import {sourcesForPerson} from '../src/content/sources.js';
import {gobiernosDe} from '../src/domain/genealogy/personAccessors.js';

const by = Object.fromEntries(PERSONAS.map(person => [person.id, person]));

test('la Corona de San Wenceslao agrupa Bohemia desde 1348, como la de San Esteban agrupa Hungría', () => {
  for (const year of [1350, 1500]) {
    const labels = governmentTableAt(PERSONAS, year).map(row => row.label);
    assert.ok(labels.includes('Corona de San Wenceslao'), String(year));
    assert.ok(labels.includes('Corona de San Esteban'), String(year));
    assert.ok(!labels.includes('Corona de Bohemia'), String(year));
  }
  assert.ok(governmentTableAt(PERSONAS,1700).some(row=>row.id==='monarquia-austriaca-exterior'&&row.governments.some(g=>g.mandates.some(m=>m.territorio==='Bohemia'))));
  assert.ok(!governmentTableAt(PERSONAS, 1340).some(row => row.label === 'Corona de San Wenceslao'));
});

test('Eugenio de Saboya enlaza con la casa de Saboya y conserva sus gobiernos delegados', () => {
  const eugene = by.EUGENIOSABOYA;
  assert.equal(by[by[eugene.padre].padre].padre, 'CARLOSEMANUEL1SAB');
  assert.equal(eugene.madre, 'OLIMPIAMANCINI');
  const governments = gobiernosDe(eugene);
  assert.deepEqual(governments.map(g => [g.territorio, g.desde, g.hasta]), [['Milán', 1706, 1716], ['Países Bajos', 1716, 1724]]);
  assert.ok(governments.every(g => g.condicion === 'gobierno delegado' && g.soberano === 'CARLOS6HRE'));
});

test('Juana de Évreux figura como reina consorte, con fecha aproximada y sus hijas', () => {
  const juana = by.JUANAEVREUX;
  assert.match(juana.titulo, /Reina consorte de Francia y Navarra/);
  assert.equal(juana.nacAprox, true);
  const daughters = PERSONAS.filter(person => person.madre === 'JUANAEVREUX').map(person => person.id).sort();
  assert.deepEqual(daughters, ['BLANCAFRANCIAORLEANS', 'MARIAFRANCIA1327']);
  assert.ok(by.BLANCAFRANCIAORLEANS.conyuges.includes('FELIPEORLEANS1336'));
});

test('Isabel I aparece como reina de Castilla y León y consorte en Aragón', () => {
  const isabel = by.ISAB1CAST;
  assert.match(isabel.titulo, /Reina consorte de Aragón/);
  assert.ok(!gobiernosDe(isabel).some(g => g.territorio === 'Aragón'));
  assert.match(isabel.documentacion.notas[0].texto, /no fue reina titular de Aragón/);
});

test('los Visconti duplicados se fusionan en un único registro con familia y gobiernos', () => {
  assert.equal(by.MATTEO1VISC, undefined);
  assert.equal(by.GALEAZZO2VISC, undefined);
  assert.ok(gobiernosDe(by.MAT1VISC).some(g => g.territorio === 'Milán' && g.desde === 1310));
  assert.ok(gobiernosDe(by.GAL2VISC).some(g => g.territorio === 'Milán' && g.desde === 1354));
  assert.ok(by.GAL2VISC.padre && by.MAT1VISC.padre);
});

test('los títulos añadidos figuran entre los territorios de cada persona', () => {
  for (const id of ['ENRIQLEON', 'MEINHARD2GOR', 'WEN1LUX', 'ROBERTO2TAR', 'GIROLAMORIARIO', 'ADOLF1CLEV', 'EUGENIOMAURICIOSAB']) {
    const person = by[id];
    assert.ok(gobiernosDe(person).length, id);
    for (const government of gobiernosDe(person)) assert.ok(person.reinos.includes(government.territorio), `${id}: ${government.territorio}`);
  }
});

test('las revisiones con fichas GND apuntan a afirmaciones reales y ceden ante las revisiones específicas', () => {
  const claimsById = new Map(PERSONAS.flatMap(person => personClaims(person)).map(claim => [claim.id, claim]));
  for (const [id, review] of Object.entries(AUTHORITY_REVIEWS)) {
    const claim = claimsById.get(id);
    assert.ok(claim, `No existe la afirmación ${id}`);
    assert.equal(review.certainty, 'documented');
    assert.match(review.sources[0].url, /^https:\/\/d-nb\.info\/gnd\/[0-9X-]+$/);
    assert.ok(review.sources[0].locator);
    if (review.exactDate) assert.equal(Number(review.exactDate.slice(0, 4)), claim.value);
  }
  // A specific editorial source wins over the authority record.
  assert.match(CLAIM_REVIEWS['person:ISAB1CAST:birth'].sources[0].url, /rah\.es/);
  // Fathers and mothers are verified through both linked records.
  const carlos = personClaims(by.CARLOS5).find(claim => claim.field === 'Padre');
  assert.ok(carlos.sources.length);
});

test('las sucesiones citan su artículo concreto; las portadas y repertorios generales no documentan', () => {
  const successions = PERSONAS.flatMap(person => personClaims(person)).filter(claim => claim.field === 'Sucesión');
  assert.ok(successions.filter(claim => claim.certainty === 'documented').length > 50);
  for (const claim of successions) for (const source of claim.sources) {
    assert.notEqual(new URL(source.url).pathname, '/');
    assert.notEqual(source.url, 'https://fmg.ac/Projects/MedLands/index.htm');
  }
});

test('cada ficha suma la ficha de autoridad y los diccionarios biográficos sin duplicar enlaces', () => {
  const refs = authorityReferences('CARLOS5');
  assert.ok(refs.some(ref => ref.url.startsWith('https://d-nb.info/gnd/')));
  const all = sourcesForPerson('CARLOS5');
  assert.equal(new Set(all.map(ref => ref.url)).size, all.length);
});
