import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {STATIC_SCHEMA, staticRoute, validatePage, initialPageForLocation} from '../src/features/public/staticData.js';
import {publicMeta, entityMeta, canonicalPath} from '../src/features/public/publicMeta.js';
import {personTitle, personDescription, lifeDates, clip, DESCRIPTION_LIMIT} from '../src/features/public/seoText.js';
import {personJsonLd, entityJsonLd} from '../src/features/public/structuredData.js';
import {groupByLetter} from '../src/features/public/peopleIndex.js';
import {condicionTexto} from '../src/features/public/governmentLabels.js';
import {PROFILE_LABELS, PROFILE_NOTES} from '../src/features/english/profileVocabulary.js';
import {PERSON_NAMES_607} from '../src/features/english/personNameReview607.js';

const SITE = 'https://www.treeofeurope.eu';

test('the Spanish home, catalogues and A–Z indexes are static pages', () => {
  const home = {schema: STATIC_SCHEMA, ...staticRoute('/es/'), data: {nombre: 'El Árbol de Europa', slug: 'inicio', stats: {personas: 1}}};
  assert.equal(home.path, '/es');
  assert.equal(validatePage(home), true);
  assert.equal(initialPageForLocation(home, '/es', ''), home);
  assert.equal(initialPageForLocation(home, '/es/', '?ref=x'), home);
  // The SPA keeps the Atlas, its panels and legacy ?persona= links.
  for (const search of ['?atlas=1', '?panel=desafio', '?persona=CARLOS5']) assert.equal(initialPageForLocation(home, '/es', search), null);
  const index = {schema: STATIC_SCHEMA, ...staticRoute('/en/people/a-z'), data: {nombre: 'People index', slug: 'index-en', items: [{n: 'Charles V', p: '/en/person/charles-v'}]}};
  assert.equal(validatePage(index), true);
  assert.equal(validatePage({...index, data: {...index.data, items: []}}), false);
});

test('home URLs are canonical without the trailing slash', () => {
  assert.equal(canonicalPath('/es/'), '/es');
  assert.equal(canonicalPath('/en/'), '/en');
  assert.equal(canonicalPath('/es/personas'), '/es/personas');
  const meta = publicMeta({title: 't', description: 'd', path: '/es/'}, SITE);
  assert.equal(meta.canonical, `${SITE}/es`);
  assert.deepEqual(meta.alternates.map(a => a.href), [`${SITE}/es`, `${SITE}/en`, `${SITE}/es`]);
  const sitemap = fs.readFileSync(new URL('../scripts/generate/generate-sitemap.mjs', import.meta.url), 'utf8');
  assert.match(sitemap, /"\/es",\n/);
  assert.doesNotMatch(sitemap, /"\/es\/",\n/);
});

const federico = {
  id: 'FED2HOH', nombre: 'Federico II Hohenstaufen', sobrenombre: 'Stupor Mundi', titulo: 'Emperador', dinastia: 'Hohenstaufen', nac: 1194, muer: 1250,
  padres: [{nombre: 'Enrique VI', slug: 'enrique-vi'}, {nombre: 'Constanza I de Sicilia', slug: 'constanza-i-de-sicilia'}],
  conyuges: [{nombre: 'Constanza de Aragón', slug: 'constanza-de-aragon'}], hijos: [{nombre: 'Manfredo I de Sicilia', slug: 'manfredo-i-de-sicilia'}],
  gobiernos: [{territorio: 'Sicilia', titulo: 'Rey'}, {territorio: 'Alemania', titulo: 'Rey de Romanos'}],
  resumen: 'Emperador Hohenstaufen, rey de Sicilia y de Jerusalén.', aliases: ['Federico II'], ogImage: '/og/persona/federico-ii.jpg',
};

test('person titles and descriptions carry dates, family and governments', () => {
  assert.equal(personTitle(federico), 'Federico II Hohenstaufen (1194–1250): familia y linaje | El Árbol de Europa');
  assert.equal(personTitle({nombre: 'Matilde de Lancaster'}), 'Matilde de Lancaster: familia y linaje | El Árbol de Europa');
  const description = personDescription(federico);
  assert.ok(description.length <= DESCRIPTION_LIMIT, description);
  assert.match(description, /^Federico II Hohenstaufen, Stupor Mundi \(1194–1250\): Emperador de la casa Hohenstaufen\. Gobernó Sicilia y Alemania\. Padres: Enrique VI y Constanza I de Sicilia\./);
  assert.equal(lifeDates({nac: 1339, nacAprox: true, muer: 1362}), 'c. 1339–1362');
  assert.equal(lifeDates({muer: 1362}), '† 1362');
  assert.equal(lifeDates({nac: 1339}, 'en'), 'b. 1339');
  assert.equal(clip('a '.repeat(200)).length <= DESCRIPTION_LIMIT, true);
  // Generic houses are not presented as a dynasty.
  assert.doesNotMatch(personDescription({nombre: 'Juana de Arco', titulo: 'Militar', dinastia: 'Sin casa identificada'}), /casa/);
  const english = entityMeta('english', {type: 'person', nombre: 'Frederick II', role: 'Emperor', nac: 1194, muer: 1250, englishLabels: {Sicilia: 'Sicily'}, gobiernos: [{territorio: 'Sicilia'}], summary: 'A Hohenstaufen emperor.', path: '/en/person/frederick-ii'});
  assert.equal(english.title, 'Frederick II (1194–1250): family and lineage | The Tree of Europe');
  assert.match(english.description, /^Frederick II \(1194–1250\): Emperor\. Ruled Sicily\. A Hohenstaufen emperor\.$/);
});

test('person JSON-LD links parents, spouses and children', () => {
  const data = personJsonLd(federico, {path: '/es/persona/federico-ii-hohenstaufen', description: 'd', siteUrl: SITE});
  const [person, , crumbs] = data['@graph'];
  assert.equal(data['@context'], 'https://schema.org');
  assert.equal(person['@type'], 'Person');
  assert.equal(person.birthDate, '1194');
  assert.equal(person.deathDate, '1250');
  assert.deepEqual(person.parent.map(p => p.url), [`${SITE}/es/persona/enrique-vi`, `${SITE}/es/persona/constanza-i-de-sicilia`]);
  assert.equal(person.spouse[0].name, 'Constanza de Aragón');
  assert.equal(person.children[0].url, `${SITE}/es/persona/manfredo-i-de-sicilia`);
  assert.equal(person.image, `${SITE}/og/persona/federico-ii.jpg`);
  assert.deepEqual(person.hasOccupation.map(o => o.name), ['Rey · Sicilia', 'Rey de Romanos · Alemania']);
  assert.deepEqual(crumbs.itemListElement.map(i => i.item), [`${SITE}/es`, `${SITE}/es/personas`, `${SITE}/es/persona/federico-ii-hohenstaufen`]);
  // Approximate years are not presented as exact dates.
  assert.equal(personJsonLd({...federico, nacAprox: true}, {path: '/es/persona/x', siteUrl: SITE})['@graph'][0].birthDate, undefined);
  assert.equal(entityJsonLd('dinastia', {nombre: 'Habsburgo'}, {path: '/es/dinastia/habsburgo', siteUrl: SITE})['@graph'].find(n => n['@type'] === 'BreadcrumbList').itemListElement[2].name, 'Casa de Habsburgo');
});

test('the A–Z index groups people by initial, accents included', () => {
  const groups = groupByLetter([{n: 'Óscar'}, {n: 'Ana'}, {n: '1066'}, {n: 'Otón'}]);
  assert.deepEqual(groups.map(([letter, items]) => [letter, items.length]), [['A', 1], ['O', 2], ['#', 1]]);
});

test('Spanish house pages label each government like the English edition', () => {
  assert.equal(condicionTexto('efectivo'), 'Gobierno efectivo');
  assert.equal(condicionTexto('titular'), 'Título nominal');
  assert.equal(condicionTexto('gobierno delegado'), 'Gobierno delegado');
  const page = fs.readFileSync(new URL('../src/features/public/DynastyPage.jsx', import.meta.url), 'utf8');
  assert.match(page, /<section className="public-content-card dynasty-governments"><h2>Gobiernos registrados de los miembros<\/h2>/);
  assert.match(page, /<th>Persona<\/th><th>Territorio y título<\/th><th>Periodo<\/th><th>Condición<\/th>/);
});

test('machine translations of place names, titles and sources are gone', () => {
  for (const [key, value] of Object.entries({Squillace: 'Squillace', Bisceglie: 'Bisceglie', Anhalt: 'Anhalt', Lacio: 'Lazio', Vidin: 'Vidin', 'Duque pretendiente': 'Claimant duke', 'Cara de Fuego': 'Fiery Face', 'señorío': 'Lordship', zarato: 'Tsardom', Valido: 'Royal favourite', 'Condesa de Pallars Sobirà': 'Countess of Pallars Sobirà', 'Treccani · Manuel Filiberto de Saboya': 'Treccani · Emmanuel Philibert of Savoy'})) {
    assert.equal(PROFILE_LABELS[key], value, key);
  }
  for (const key of ['el Doliente', 'el Taciturno', 'Sin Tierra']) assert.equal(PROFILE_NOTES[key], PROFILE_LABELS[key], key);
  const garbage = ["It 's squirting", 'Other articles of heading', 'I saw it.', 'Prosecuting Duke', 'Fur of Fire', 'Isabel de Trol', 'Louis V of the Palatinate of Torres', 'tipoctipride', 'whispering', 'large_ducted', 'Your Honor.', 'Deutsche NationalBibliothek'];
  const root = new URL('../src/features/english/v6/', import.meta.url);
  for (const batch of fs.readdirSync(root).filter(name => name.startsWith('batch-'))) {
    for (const file of fs.readdirSync(new URL(`${batch}/`, root))) {
      const text = fs.readFileSync(new URL(`${batch}/${file}`, root), 'utf8');
      for (const bad of garbage) assert.equal(text.includes(bad), false, `${batch}/${file}: ${bad}`);
    }
  }
});

test('the fifth review fixes English names and titles', () => {
  assert.equal(PERSON_NAMES_607.ROB1COUR.name, 'Robert of Courtenay');
  assert.equal(PERSON_NAMES_607.MIHAIBRAVE.name, 'Michael the Brave');
  assert.equal(PERSON_NAMES_607.PAPA_INOCENCIO9.name, 'Innocent IX');
  assert.equal(PERSON_NAMES_607.RAMONROGER1PALLARS.role, 'Count of Pallars Sobirà');
  assert.equal(PERSON_NAMES_607.GERALD8KILDARE.role, 'Earl');
  assert.equal(PERSON_NAMES_607.SIBYLLACLEVES.name, 'Sibylle of Cleves');
});

test('the person of the day is the same for a given date and comes from a painted, documented pool', async () => {
  const {dailyIndex, pickOfTheDay, todayKey} = await import('../src/features/public/dailyPick.js');
  assert.equal(dailyIndex('2026-11-20', 95), dailyIndex('2026-11-20', 95));
  assert.notEqual(dailyIndex('2026-11-20', 95), dailyIndex('2026-11-21', 95));
  assert.equal(pickOfTheDay([], '2026-11-20'), null);
  assert.match(todayKey(new Date('2026-11-20T23:30:00Z')), /^2026-11-21$/); // Madrid time
  const pool = JSON.parse(fs.readFileSync(new URL('../public/catalogos/recomendaciones.json', import.meta.url))).items;
  const {IMAGENES_PERSONAS} = await import('../src/data/imagenesPersonas.js');
  assert.ok(pool.length >= 30);
  for (const person of pool) {
    assert.match(IMAGENES_PERSONAS[person.id].tipo, /^(Retrato|Copia de un retrato|Autorretrato|Miniatura|Representación)/, person.id);
    for (const text of [person.es, person.en]) { assert.ok(text.texto.length > 80, person.id); assert.match(text.path, /^\/(es\/persona|en\/person)\//); }
  }
  const home = JSON.parse(fs.readFileSync(new URL('../src/generated/home.json', import.meta.url)));
  assert.equal(home.gobernantesAnio.anio, 1500);
  assert.equal(home.dinastiasCarrusel.length, 12);
  assert.ok(home.historiasCarrusel.length >= 6);
});
