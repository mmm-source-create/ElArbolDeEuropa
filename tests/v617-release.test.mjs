import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {REVIEWS_617} from '../src/evidence/reviews617.js';
import {AUTHORITY_REVIEWS_616} from '../src/evidence/authorityReviews616.js';
import {coverageReport} from '../src/evidence/claims.js';
import {ENGLISH_TERRITORY_EVOLUTION} from '../src/features/english/territoryEvolution617.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {repairEnglishPresentation} from '../src/features/english/nameCorrections.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Medieval Lands and the DBI document pending claims with a located passage', () => {
  const reviews = Object.entries(REVIEWS_617);
  assert.ok(reviews.length > 300, String(reviews.length));
  for (const [id, review] of reviews) {
    assert.equal(review.certainty, 'documented', id);
    const [source] = review.sources;
    assert.match(source.url, /^https:\/\/(fmg\.ac\/Projects\/MedLands\/|www\.treccani\.it\/enciclopedia\/[^/]+_\(Dizionario-Biografico\)\/)/, id);
    assert.ok(source.locator.includes('«') && source.locatorEn.includes('“'), id);
    assert.ok(review.note && review.noteEn, id);
  }
  // One well-known case of each kind.
  assert.match(REVIEWS_617['person:BELA4:mother']?.sources[0].locator || '', /Gertrud/);
  const report = coverageReport(PERSONAS);
  assert.ok(report.totals.documented > 5977 + 300, String(report.totals.documented));
});

test('the NDB is cited by the name of the article, not the website', () => {
  assert.doesNotMatch(read('src/evidence/authorityReviews616.js'), /Deutsche Biographie - /);
  assert.ok(Object.values(AUTHORITY_REVIEWS_616).some(review => review.sources.some(source => /^Neue Deutsche Biographie · Rudolf I\./.test(source.title))));
});

test('every political-evolution line of a territory has a hand-made English version', () => {
  const lines = new Set();
  for (const file of fs.readdirSync(new URL('../public/territorios-meta/', import.meta.url))) {
    for (const entry of JSON.parse(fs.readFileSync(new URL(`../public/territorios-meta/${file}`, import.meta.url))).evolucion || []) lines.add(entry.texto);
  }
  for (const line of lines) assert.ok(ENGLISH_TERRITORY_EVOLUTION[line], line);
  assert.equal(ENGLISH_TERRITORY_EVOLUTION['Fernando III accede a Castilla'], 'Ferdinand III accedes in Castile');
  assert.match(read('src/features/english/EnglishEntity.jsx'), /Political evolution/);
});

test('machine-translated English names are repaired, with their URLs', () => {
  const name = id => repairEnglishPresentation(COMPLETE_ENGLISH_PROFILES[id]).name;
  assert.equal(name('CRISTOFORO_MORO_DOGE'), 'Cristoforo Moro');
  assert.equal(name('EDUVIGJAGBAV'), 'Hedwig Jagiellon');
  const route = id => TRANSLATED_PEOPLE.find(item => item.id === id).en;
  assert.equal(route('CRISTOFORO_MORO_DOGE'), 'cristoforo-moro');
  const redirects = JSON.parse(read('routes.json')).redirects;
  assert.equal(redirects.find(rule => rule.source === '/en/person/moro-christopor')?.destination, '/en/person/cristoforo-moro');
  const batches = [1, 2, 3, 4, 5, 6].map(n => read(`src/features/english/v6/batch-${n}/people.json`)).join('\n');
  assert.ok(!batches.includes('Inés de Beaujeu'));
});
