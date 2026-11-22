import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ENGLISH_SLUGS_618} from '../src/data/englishSlugs618.js';
import {TRANSLATED_PEOPLE, TRANSLATED_DYNASTIES, TRANSLATED_TERRITORIES} from '../src/features/english/routes.js';
import {ENGLISH_DYNASTIES, ENGLISH_TERRITORIES} from '../src/features/english/entityTranslations.js';
import {ENGLISH_UNION_TEXTS} from '../src/features/english/territoryUnions618.js';
import {REVIEWS_617} from '../src/evidence/reviews617.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('English URLs built from mistranslated names use the reviewed name, and the old ones redirect', () => {
  const dynasty = es => TRANSLATED_DYNASTIES.find(item => item.es === es)?.en;
  const territory = es => TRANSLATED_TERRITORIES.find(item => item.es === es)?.en;
  assert.equal(dynasty('luna'), 'luna');
  assert.equal(territory('guastalla'), 'guastalla');
  for (const bad of ['moon', 'stress', 'beer', 'i-went-away', 'they-ll-know', 'the-rod']) assert.ok(!TRANSLATED_DYNASTIES.some(item => item.en === bad), bad);
  for (const bad of ['united-states-of-america', 'republic-of-latvia', 'gawk', 'swaziland']) assert.ok(!TRANSLATED_TERRITORIES.some(item => item.en === bad), bad);
  assert.ok(!TRANSLATED_PEOPLE.some(item => /(^|-)w-adys-aw|stanis-aw/.test(item.en)));
  // The entity pages and the route table agree.
  for (const [routes, entities] of [[TRANSLATED_DYNASTIES, ENGLISH_DYNASTIES], [TRANSLATED_TERRITORIES, ENGLISH_TERRITORIES]]) {
    const byEs = new Map(entities.map(entity => [entity.es, entity.en]));
    for (const route of routes) if (byEs.has(route.es)) assert.equal(byEs.get(route.es), route.en, route.es);
    assert.equal(new Set(routes.map(route => route.en)).size, routes.length);
  }
  const redirects = new Map(JSON.parse(read('routes.json')).redirects.map(rule => [rule.source, rule.destination]));
  const segment = {people: 'person', dynasties: 'dynasty', territories: 'territory'};
  for (const [kind, map] of Object.entries(ENGLISH_SLUGS_618)) for (const {en, enBefore} of Object.values(map)) assert.equal(redirects.get(`/en/${segment[kind]}/${enBefore}`), `/en/${segment[kind]}/${en}`);
  assert.match(read('AGENTS.md'), /traducción errónea o de un nombre roto/);
});

test('historical unions of territories have hand-made English texts shown on the English pages', () => {
  assert.equal(ENGLISH_UNION_TEXTS['Castilla y Aragón: una monarquía compuesta'], 'Castile and Aragon: a composite monarchy');
  assert.equal(Object.keys(ENGLISH_UNION_TEXTS).length, 94);
  assert.match(read('src/features/english/EnglishEntity.jsx'), /Unions and separations/);
});

test('Medieval Lands also identifies people with one sure year through a parent’s children list', () => {
  assert.ok(Object.values(REVIEWS_617).filter(review => review.sources[0].url.startsWith('https://fmg.ac/')).length >= 776);
});
