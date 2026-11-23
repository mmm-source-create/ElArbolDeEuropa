import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {STORY_DRAFTS_612, STORIES_612_EN} from '../src/data/historias612.js';
import {collectionGroups} from '../src/features/stories/storyThemes.js';
import {ENGLISH_STORIES} from '../src/features/english/content.js';
import {storyEditorialIssues} from '../src/content/storyEditorialPolicy.js';
import {contenidoPersona} from '../src/content/personas/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {V6_PEOPLE} from '../src/features/english/v6/index.js';
import {ARMS_EN_612} from '../src/features/english/armsTranslations612.js';
import {staticHeadersFile} from '../cloudflare/routing.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));

test('the ten dynasty stories are published in both languages as the «Dinastías» collection', () => {
  assert.equal(STORY_DRAFTS_612.length, 10);
  const ids = new Set(PERSONAS.map(p => p.id));
  for (const draft of STORY_DRAFTS_612) {
    const es = HISTORIAS.find(s => s.id === draft.id), en = STORIES_612_EN[draft.id].content;
    assert.ok(es?.disponible && en.disponible, draft.id);
    assert.equal(es.pasos.length, en.pasos.length);
    assert.ok(es.pasos.length >= 6, draft.id);
    for (const [i, step] of es.pasos.entries()) {
      assert.ok(step.texto.split(/\s+/).length >= 50, `${draft.id}/${i + 1}`);
      assert.ok(en.pasos[i].texto.split(/\s+/).length >= 45, `${draft.id}/${i + 1} en`);
      for (const id of step.personas) assert.ok(ids.has(id), `${draft.id}: ${id}`);
      assert.ok(step.fuentes.every(f => /^https:/.test(f.url)));
    }
    for (const id of draft.related) assert.ok(HISTORIAS.some(s => s.id === id && s.disponible), id);
  }
  const group = collectionGroups(HISTORIAS.filter(s => s.disponible)).find(c => c.id === 'dinastias');
  assert.equal(group.en, 'Dynasties');
  assert.equal(group.stories.length, 10);
  assert.deepEqual(storyEditorialIssues(HISTORIAS.filter(s => STORY_DRAFTS_612.some(d => d.id === s.id)), ENGLISH_STORIES), []);
  assert.ok(fs.existsSync(new URL('../public/english-meta/story-the-angevins-of-hungary.json', import.meta.url)));
});

test('the reserve biographies replace one-line summaries and keep the English names', () => {
  const ids = ['MICHAEL8PALA', 'LUIS7FRA', 'SALADIN', 'HAAKON4NOR', 'MAGNUS4SUE', 'ERICOPOMERANIA', 'CRISTIAN1NORD', 'CHRISTIAN3DEN', 'WILLIAM1SCOT', 'EREKLE2GEO'];
  for (const id of ids) {
    const content = contenidoPersona(id);
    assert.ok(content.resumen.length > 100 && content.biografia.length > 900, id);
    const profile = COMPLETE_ENGLISH_PROFILES[id];
    assert.equal(profile.sections.length, 3, id);
    assert.ok(profile.role && profile.biography?.length > 900, id);
    if (V6_PEOPLE[id]) assert.equal(profile.name, V6_PEOPLE[id].name, id);
  }
});

test('the kings of Bohemia who ruled Moravia directly carry the title', () => {
  const people = new Map(PERSONAS.map(p => [p.id, p]));
  for (const [id, from, to] of [['WEN2', 1283, 1305], ['WEN3', 1305, 1306], ['ROD3HAB', 1306, 1307], ['JUAN1B', 1311, 1334]]) {
    const g = people.get(id).gobiernos.find(x => x.territorio === 'Moravia');
    assert.deepEqual([g?.desde, g?.hasta, g?.titulo], [from, to, 'Margrave'], id);
  }
  const years = PERSONAS.flatMap(p => (p.gobiernos || []).filter(g => g.territorio === 'Moravia' && g.desde < 1350).map(g => [g.desde, g.hasta])).sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < years.length; i++) assert.ok(years[i][0] >= years[i - 1][1] - 1 || years[i][0] === 1283, JSON.stringify(years[i]));
});

test('English dynasty and territory pages match the Spanish hero: arms, counts, rank and actions', () => {
  let arms = 0;
  for (const file of fs.readdirSync(new URL('../public/english-meta/', import.meta.url)).filter(f => f.startsWith('dynasty-'))) {
    const d = json(`public/english-meta/${file}`);
    if (d.arms) { arms++; assert.ok(d.arms.blazon, file); }
  }
  assert.equal(arms, 168);
  assert.equal(json('public/english-meta/dynasty-montfort-of-brittany.json').arms.blazon, ARMS_EN_612['Montfort-Bretaña'][0]);
  assert.equal(json('public/english-meta/territory-dreux.json').clase, 'condado');
  assert.match(read('src/features/english/EnglishEntity.jsx'), /condado:'County'/);
  const page = read('src/features/english/EnglishEntity.jsx');
  for (const text of ['Explore this house in the Atlas', 'Open in the Atlas', 'Explore succession', 'branch or connection', 'History of the house']) assert.ok(page.includes(text), text);
});

test('home: typing does not resize the search box or the map, and the year button keeps its width', () => {
  assert.match(read('src/features/public/HomeSearch.jsx'), /hidden=\{!query\}/);
  const search = read('src/features/public/home-search.css');
  assert.match(search, /\.home-search\.is-active \.home-search-hint\{visibility:hidden\}/);
  assert.doesNotMatch(search, /is-active \.home-search-hint\{visibility:hidden;height:0/);
  const atlas = read('src/features/public/home-atlas.css');
  assert.match(atlas, /\/auto 800px no-repeat/);
  assert.match(atlas, /\.home-atlas-open,[^{]*\{font-variant-numeric:tabular-nums\}/);
});

test('low-priority SEO: HSTS, an English 404 and footer touch targets', () => {
  assert.match(staticHeadersFile(), /Strict-Transport-Security: max-age=31536000; includeSubDomains/);
  assert.match(read('cloudflare/worker.js'), /'\/404-en'/);
  assert.match(read('scripts/generate/prerender-ssg.mjs'), /renderNotFound\('en',siteUrl\)/);
  assert.match(read('src/styles/theme.css'), /\.site-footer-links a \{[^}]*min-height: 24px/);
  assert.match(read('docs/NEXT_UPDATES.md'), /### Completado en 6\.1\.3/);
});
