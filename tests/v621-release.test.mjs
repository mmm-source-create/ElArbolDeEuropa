import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {REVIEWS_621} from '../src/evidence/reviews621.js';
import {REVIEWS_617} from '../src/evidence/reviews617.js';
import {coverageReport, personClaims} from '../src/evidence/claims.js';
import {ENGLISH_SUCCESSION_TEXTS} from '../src/features/english/territorySuccession621.js';
import {translatedProfileText} from '../src/features/english/profileVocabulary.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const people = new Map(PERSONAS.map(p => [p.id, p]));

test('the third Medieval Lands pass and the DBI articles document more than 900 pending claims with a quoted passage', () => {
  const reviews = Object.entries(REVIEWS_621);
  assert.ok(reviews.length > 900, String(reviews.length));
  for (const [id, review] of reviews) {
    assert.ok(!REVIEWS_617[id], id);
    assert.equal(review.certainty, 'documented', id);
    const [source] = review.sources;
    assert.match(source.url, /^https:\/\/(fmg\.ac\/Projects\/MedLands\/|www\.treccani\.it\/enciclopedia\/[^/]+_\(Dizionario-Biografico\)\/)/, id);
    assert.ok(source.locator.includes('«') && source.locatorEn.includes('“') && !/[«»]/.test(source.locatorEn), id);
    assert.ok(review.note && review.noteEn, id);
  }
  const {totals} = coverageReport(PERSONAS);
  const all = Object.values(totals).reduce((a, b) => a + b, 0);
  assert.equal(all, 13507); // 6.3.4: 82 crown and occupation titles // 6.1.3: dates and governments of 51 new people // 6.1.2: four Moravian governments added
  // 6.0.20 left 6 994 documented claims (53.3 %); this release must add at least six points.
  assert.ok(totals.documented / all >= 0.593, `${totals.documented} / ${all}`);
});

test('children lists opened by their own paragraph, office sentences and both sides of a marriage are used', () => {
  assert.match(REVIEWS_621['person:RICARDO1ING:father'].sources[0].locator, /^Lista de hijos: «King Henry II & his wife had eight children: … 4\. RICHARD/);
  assert.match(REVIEWS_621['person:LUIS10FRA:mother'].sources[0].locator, /Matrimonio: «JUANA I Queen of Navarre/);
  assert.match(REVIEWS_621['person:JUAN1BORG:government:Borgoña:1404:1419:Duque'].sources[0].locator, /succeeded his father in 1404 as JEAN "Sans Peur" Duke of Burgundy.*Fallecimiento: 1419/);
  assert.ok(REVIEWS_621['person:BIRGERJARL:spouse:INGEBORGSWE'] || Object.keys(REVIEWS_621).some(id => /^person:BIRGERJARL:spouse:/.test(id)));
});

test('terms that another reference work dates differently, and regencies, are not documented by Medieval Lands', () => {
  for (const [id, territory] of [['ESTEBAN1BAV', 'Baviera'], ['LUIS3BAV', 'Baviera'], ['MARGARITA1NORD', 'Suecia']]) {
    assert.ok(!Object.keys(REVIEWS_621).some(key => key.startsWith(`person:${id}:government:${territory}:`)), id);
  }
  assert.ok(!REVIEWS_621['person:MARGARITA1NORD:government:Noruega:1388:1412:Reina']);
  const juana = personClaims(people.get('JUANAGREY')).find(c => c.field === 'Gobierno');
  assert.equal(juana.certainty, 'disputed');
});

test('English territory pages show the succession, its crises and the linked events, translated by hand', () => {
  for (const file of fs.readdirSync(new URL('../public/territorios-meta/', import.meta.url))) {
    const t = JSON.parse(fs.readFileSync(new URL(`../public/territorios-meta/${file}`, import.meta.url)));
    for (const r of t.sucesiones?.relevos || []) for (const text of [r.explicacion, r.parentesco?.texto, ...(r.fechas || []).map(f => f.nota)].filter(Boolean)) assert.ok(ENGLISH_SUCCESSION_TEXTS[text], text);
    for (const c of t.sucesiones?.crisis || []) for (const text of [c.periodo, c.titulo, c.resumen, c.desenlace, ...c.candidatos.flatMap(k => [k.fundamento, k.resultado])]) assert.ok(ENGLISH_SUCCESSION_TEXTS[text], text);
    for (const e of t.eventos || []) assert.ok(ENGLISH_SUCCESSION_TEXTS[e.titulo || e.nombre], e.titulo || e.nombre);
  }
  assert.match(read('src/features/english/EnglishEntity.jsx'), /<EnglishSuccession territory=\{d\}\/>/);
  assert.match(read('src/features/english/EnglishEntity.jsx'), /Events linked to its people/);
  assert.equal(ENGLISH_SUCCESSION_TEXTS['Felipe el Atrevido recibe Borgoña'], 'Philip the Bold receives Burgundy');
});

test('frequent evidence notes and locators have a hand translation instead of a generic sentence', () => {
  assert.equal(translatedProfileText('Parentesco; no prueba control territorial.'), 'Kinship; it does not prove territorial control.');
  assert.match(translatedProfileText('p. 56, anexo 2: Petru III, tres mandatos'), /appendix 2: Petru III, three reigns/);
});
