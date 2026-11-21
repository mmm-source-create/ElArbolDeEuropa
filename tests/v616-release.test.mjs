import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {SOURCES} from '../src/content/sources.js';
import {V607_REFERENCES} from '../src/content/v607People.js';
import {HISTORIA_DINASTIAS} from '../src/content/dinastias/index.js';
import {CASAS_V615} from '../src/content/dinastias/casas-v615.js';
import {EDITORIAL_HISTORY} from '../src/evidence/reviewRecords.js';
import {AUTHORITY_REVIEWS_616} from '../src/evidence/authorityReviews616.js';
import {coverageReport, personClaims} from '../src/evidence/claims.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {englishSourceTitle} from '../src/features/english/v535Vocabulary.js';
import {ENGLISH_SLUGS_616} from '../src/data/englishSlugs616.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const WIKIPEDIA = /wikipedia\.org\/wiki\//;

test('no fact or reference cites Wikipedia; former citations point to reference works', () => {
  assert.deepEqual(SOURCES.filter(source => WIKIPEDIA.test(source.url)).map(source => source.url), []);
  assert.deepEqual(Object.values(V607_REFERENCES).flat().filter(ref => WIKIPEDIA.test(ref.url)).map(ref => ref.url), []);
  assert.ok(Object.values(V607_REFERENCES).every(refs => refs.length > 0));
  for (const house of Object.keys(CASAS_V615)) assert.ok(HISTORIA_DINASTIAS[house].fuentes.every(url => !WIKIPEDIA.test(url)), house);
  for (const file of ['src/data/stories607/gustavusAdolphus.js', 'src/data/stories607/kosciuszko.js', 'src/cartography/regions/franceLowCountriesRouteData.json']) assert.doesNotMatch(read(file), WIKIPEDIA, file);
  assert.equal(new Set(SOURCES.map(source => source.url)).size, SOURCES.length);
  assert.deepEqual(V607_REFERENCES.MURAD1OSM.map(ref => ref.url), ['https://islamansiklopedisi.org.tr/murad-i']);
  // Claims are never documented by Wikipedia alone.
  for (const person of PERSONAS) for (const claim of personClaims(person)) if (claim.certainty === 'documented') assert.ok(claim.sources.some(source => !WIKIPEDIA.test(source.url)), claim.id);
});

test('the second authority review documents pending claims from GND, BnF, NDB and the Library of Congress', () => {
  const reviews = Object.entries(AUTHORITY_REVIEWS_616);
  assert.ok(reviews.length > 500, String(reviews.length));
  const hosts = /^https:\/\/(d-nb\.info\/gnd\/|catalogue\.bnf\.fr\/ark:\/12148\/cb|id\.loc\.gov\/authorities\/names\/|www\.deutsche-biographie\.de\/sfz)/;
  for (const [id, review] of reviews) {
    assert.equal(review.certainty, 'documented', id);
    assert.ok(review.sources.length && review.sources.every(source => hosts.test(source.url) && source.locator && source.locatorEn), id);
    assert.ok(review.note && review.noteEn, id);
  }
  const report = coverageReport(PERSONAS);
  assert.ok(report.totals.documented > 5248 + 500, String(report.totals.documented));
  assert.ok(fs.existsSync(new URL('../docs/versiones/6.0.16-discrepancias.md', import.meta.url)));
});

test('English pages no longer mistranslate history entries, source titles or names', () => {
  assert.ok(EDITORIAL_HISTORY.every(entry => entry.changeEn && entry.reasonEn));
  assert.doesNotMatch(read('src/components/EvidencePanel.jsx'), /Claim registry added; existing historical data kept\. Specific sourcing/);
  assert.equal(englishSourceTitle('IEG-MAPS · Alemania en 1378'), 'IEG-MAPS · Germany in 1378');
  assert.equal(englishSourceTitle('Deutsche Nationalbibliothek · Ficha de autoridad GND · Luther, Martin'), 'Deutsche Nationalbibliothek · GND authority record · Luther, Martin');
  const batches = [1, 2, 3, 4, 5, 6].flatMap(n => ['people', 'dynasties', 'territories', 'stories', 'notes', 'labels', 'names', 'portraits'].map(kind => read(`src/features/english/v6/batch-${n}/${kind}.json`))).join('\n');
  for (const bad of ['Lion X', 'Lion I of Armenia', 'of Castle', 'Berenfuela', 'Two Potas', 'Dogo of', 'Dignity was elective', 'will be sober', 'House Paleologist', 'The pontificate of his father']) assert.ok(!batches.includes(bad), bad);
});

test('English URLs built from machine-translated names move, and the old ones redirect', () => {
  const route = id => TRANSLATED_PEOPLE.find(item => item.id === id).en;
  assert.equal(route('JAMES3SCOT'), 'james-iii-of-scotland');
  assert.equal(route('VIOLP'), 'yolanda-of-poland');
  assert.equal(route('PAPA_JULIO3'), 'julius-iii');
  assert.equal(new Set(TRANSLATED_PEOPLE.map(item => item.en)).size, TRANSLATED_PEOPLE.length);
  const redirects = JSON.parse(read('routes.json')).redirects;
  for (const {en, enBefore} of Object.values(ENGLISH_SLUGS_616)) {
    assert.equal(redirects.find(rule => rule.source === `/en/person/${enBefore}`)?.destination, `/en/person/${en}`, enBefore);
  }
  assert.ok(!redirects.some(rule => Object.values(ENGLISH_SLUGS_616).some(({enBefore}) => rule.destination === `/en/person/${enBefore}`)));
});
