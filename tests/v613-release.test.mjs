import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {V613_RECORDS} from '../src/content/v613/index.js';
import {contenidoPersona} from '../src/content/personas/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {STORY_DRAFTS_613, STORIES_613_EN} from '../src/data/historias613.js';
import {collectionGroups} from '../src/features/stories/storyThemes.js';
import {personClaims} from '../src/evidence/claims.js';
import {REVIEWS_613} from '../src/evidence/reviews613.js';
import {ENGLISH_STORIES} from '../src/features/english/content.js';
import {storyEditorialIssues} from '../src/content/storyEditorialPolicy.js';

const people = new Map(PERSONAS.map(p => [p.id, p]));
const read = path => JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const NEW = read('scripts/research/people613/people.json').map(p => p.id);
const EXISTING = ['SANTOTOMAS', 'ERASMOROT', 'GUTENBERG', 'DOMINGOSOTO', 'JANHUS'];

test('the expansion adds 51 people of culture, science, Salamanca, revolutions and exploration', () => {
  assert.equal(NEW.length, 51);
  for (const id of ['COPERNICO', 'GALILEO', 'NEWTON', 'SHAKESPEARE', 'SORJUANA', 'JSBACH', 'MOZART', 'BEETHOVEN', 'FVITORIA', 'FSUAREZ', 'WATTYLER', 'NAPOLEON1', 'MARCOPOLO', 'COLON', 'ELCANO', 'HUMBOLDT']) assert.ok(people.has(id), id);
  assert.deepEqual(people.get('OLIVERCROMWELL').gobiernos.map(g => [g.territorio, g.titulo, g.desde, g.hasta]), [['Inglaterra', 'Lord Protector', 1653, 1658]]);
  assert.deepEqual(people.get('NAPOLEON1').gobiernos.map(g => [g.titulo, g.desde]), [['Primer cónsul', 1799]]);
  assert.equal(people.get('JANHUS').nac, 1369);
});

test('every new or completed person has a biography, a short summary and an English page', () => {
  for (const id of [...NEW, ...EXISTING]) {
    const record = V613_RECORDS[id];
    assert.ok(record, id);
    assert.equal(record.parts.length, 3, id);
    assert.ok(record.refs.length >= 1, id);
    const es = contenidoPersona(id);
    assert.ok(es.resumen.length > 80 && es.biografia.length > 900, id);
    const en = COMPLETE_ENGLISH_PROFILES[id];
    assert.ok(en.summary && en.role && en.sections.length === 3 && en.biography.length > 900, id);
  }
  assert.equal(COMPLETE_ENGLISH_PROFILES.ERASMOROT.name, 'Erasmus of Rotterdam');
});

test('portraits: 53 of the 56 have a public-domain or freely licensed image with its credit', () => {
  const missing = [...NEW, ...EXISTING].filter(id => !IMAGENES_PERSONAS[id]);
  // No portrait survives of Cabeza de Vaca or Orellana; Commons only has tiny modern images.
  assert.deepEqual(missing.sort(), ['CABEZADEVACA', 'ORELLANA']);
  for (const id of NEW.filter(id => IMAGENES_PERSONAS[id])) {
    const image = IMAGENES_PERSONAS[id];
    assert.match(image.fuenteUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, id);
    assert.ok(image.autor && image.derechos, id);
    assert.ok(fs.existsSync(new URL(`../public${image.archivo}`, import.meta.url)), id);
  }
});

test('dates are checked against GND records; disagreements stay disputed', () => {
  const claim = id => personClaims(people.get(id.split(':')[1])).find(c => c.id === id);
  assert.equal(claim('person:GALILEO:birth').certainty, 'documented');
  assert.equal(claim('person:GALILEO:birth').exactDate, '1564-02-15');
  assert.match(REVIEWS_613['person:NEWTON:birth'].note, /25 de diciembre de 1642/);
  for (const id of ['SORJUANA', 'ELCANO', 'FPIZARRO', 'AZPILCUETA']) assert.equal(claim(`person:${id}:birth`).certainty, 'disputed', id);
  assert.equal(claim('person:MARAT:death').certainty, 'documented');
  // St Hedwig: historians disagree between 1373 and 1374.
  const hedwig = claim('person:EDUV1:birth');
  assert.equal(hedwig.certainty, 'disputed');
  assert.ok(hedwig.alternatives.some(a => /1374/.test(a)));
});

test('six new stories in both languages; the free companies form their own collection', () => {
  const ids = new Set(PERSONAS.map(p => p.id));
  assert.equal(STORY_DRAFTS_613.length, 6);
  for (const draft of STORY_DRAFTS_613) {
    const es = HISTORIAS.find(s => s.id === draft.id), en = STORIES_613_EN[draft.id].content;
    assert.ok(es?.disponible && en.disponible, draft.id);
    assert.ok(es.pasos.length >= 6, draft.id);
    for (const [i, step] of es.pasos.entries()) {
      assert.ok(step.texto.split(/\s+/).length >= 55 && en.pasos[i].texto.split(/\s+/).length >= 55, `${draft.id}/${i + 1}`);
      for (const id of step.personas) assert.ok(ids.has(id), `${draft.id}: ${id}`);
      assert.ok(step.fuentes.length && step.fuentes.every(f => /^https:/.test(f.url)));
    }
    for (const id of draft.related) assert.ok(HISTORIAS.some(s => s.id === id && s.disponible), id);
  }
  const groups = collectionGroups(HISTORIAS.filter(s => s.disponible));
  assert.deepEqual(groups.find(g => g.id === 'companias-libres').stories.map(s => s.id).sort(), ['compania-blanca', 'compania-catalana', 'condotieros', 'grandes-companias']);
  assert.ok(groups.find(g => g.id === 'herencias-conflictivas').stories.some(s => s.id === 'mohacs-caida-buda'));
  assert.deepEqual(storyEditorialIssues(HISTORIAS.filter(s => STORY_DRAFTS_613.some(d => d.id === s.id)), ENGLISH_STORIES), []);
});
