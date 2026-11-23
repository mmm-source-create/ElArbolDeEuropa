import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {REVIEWS_622, DATE_CORRECTIONS_622} from '../src/evidence/reviews622.js';
import {coverageReport, personClaims} from '../src/evidence/claims.js';
import {ENGLISH_TERRITORY_NOTES} from '../src/features/english/territoryNotes616.js';
import {ENGLISH_TERRITORY_NOTES_622} from '../src/features/english/territoryNotes622.js';
import {compatible, nameParts} from '../scripts/research/fmg/names.mjs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const people = new Map(PERSONAS.map(p => [p.id, p]));
const claim = id => personClaims(people.get(id.split(':')[1])).find(c => c.id === id);

test('the Diccionario Biográfico Español and the Scandinavian national biographies document pending claims with a quoted passage', () => {
  const reviews = Object.entries(REVIEWS_622).filter(([id]) => !DATE_CORRECTIONS_622[id]);
  assert.ok(reviews.length > 250, String(reviews.length));
  const hosts = /^https:\/\/(historia-hispanica\.rah\.es\/biografias\/|sok\.riksarkivet\.se\/sbl\/|nbl\.snl\.no\/|biografiskleksikon\.lex\.dk\/)/;
  for (const [id, review] of reviews) {
    assert.equal(review.certainty, 'documented', id);
    const [source] = review.sources;
    assert.match(source.url, hosts, id);
    assert.ok(source.locator.includes('«') && source.locatorEn.includes('“'), id);
    assert.ok(review.note && review.noteEn, id);
  }
  assert.match(REVIEWS_622['person:SANCHO7NAV:mother'].sources[0].locator, /Sancho VI el Sabio y de Sancha de Castilla/);
  assert.match(REVIEWS_622['person:ERIK14SUE:father'].sources[0].locator, /konung Gustav I/);
  const {totals} = coverageReport(PERSONAS);
  assert.ok(totals.documented / Object.values(totals).reduce((a, b) => a + b, 0) >= 0.62, String(totals.documented));
});

test('dates that a checked source gives differently are corrected, with the source and the previous value', () => {
  const expected = {'person:ENRIQ7:birth': 1274, 'person:RENEAFRA:death': 1575, 'person:ISABFRA:birth': 1242, 'person:EDUV1:birth': 1373, 'person:MARGABRAB1323:death': 1368};
  for (const [id, year] of Object.entries(expected)) {
    const c = claim(id);
    assert.equal(c.value, year, id);
    assert.equal(DATE_CORRECTIONS_622[id].to, year, id);
    // 6.1.3: St Hedwig's birth is disputed among historians (1373 or 1374).
    if (id === 'person:EDUV1:birth') { assert.equal(c.certainty, 'disputed'); continue; }
    assert.equal(c.certainty, 'documented', id);
    assert.match(REVIEWS_622[id].note, new RegExp(`Se corrige ${DATE_CORRECTIONS_622[id].from} por ${year}`), id);
  }
  // A source that disagrees with another specific source does not change the date.
  assert.equal(people.get('ROB1NAP').muer, 1343);
  assert.equal(people.get('PEDRO2AR').nac, 1178);
  assert.ok(fs.existsSync(new URL('../docs/versiones/6.0.22-fechas.md', import.meta.url)));
});

test('a biography whose dates belong to someone else is not used', () => {
  // The DBE article «Muhammad XII» (1437–1494) is not Boabdil (1460–1533).
  assert.ok(!Object.keys(REVIEWS_622).some(id => id.startsWith('person:MUHAMMAD12BOABDIL:')));
  // Christopher and Christian, or Constance and Constantine, are different names.
  assert.equal(compatible(nameParts('Christoffer'), nameParts('Christian')), false);
  assert.equal(compatible(nameParts('Kristina'), nameParts('Cristina')), true);
});

test('English territory pages show every territory note and the rank of the territory', () => {
  for (const file of fs.readdirSync(new URL('../public/territorios-meta/', import.meta.url))) {
    const t = JSON.parse(fs.readFileSync(new URL(`../public/territorios-meta/${file}`, import.meta.url)));
    if (t.nota) assert.ok(ENGLISH_TERRITORY_NOTES[t.nota] || ENGLISH_TERRITORY_NOTES_622[t.nota], t.nota);
  }
  assert.match(read('src/features/english/EnglishEntity.jsx'), /Rank of the territory/);
  assert.match(read('scripts/generate/generate-english.mjs'), /fuentes:source\.fuentes/);
});
