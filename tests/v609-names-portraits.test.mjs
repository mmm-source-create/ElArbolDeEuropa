import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {TITLE_NAMES_609} from '../src/data/titleNames609.js';
import {TITLE_NAME_SLUGS_609} from '../src/data/titleNameSlugs609.js';
import {PERSONA_SLUG_POR_ID, slugPersonaPorLocale} from '../src/features/atlas/atlasRoutes.js';
import {resolveHostingRoute} from '../cloudflare/routing.js';
import {ENGLISH_DYNASTIES, ENGLISH_TERRITORIES} from '../src/features/english/entityTranslations.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';

const byId = new Map(PERSONAS.map(p => [p.id, p]));
const served = archivo => (IMAGE_VARIANTS[archivo]?.variants.map(v => v.src) || [archivo])
  .every(src => fs.existsSync(new URL(`../public${src}`, import.meta.url)));

test('public names do not carry the title, which stays searchable', () => {
  for (const [id, es, en] of TITLE_NAMES_609) {
    const p = byId.get(id), slugs = TITLE_NAME_SLUGS_609[id];
    if (es) {
      assert.equal(p.nombre, es, id);
      assert(p.aliases.includes(slugs.nombreBefore), `${id}: old name searchable`);
    }
    if (en) {
      assert.equal(COMPLETE_ENGLISH_PROFILES[id].name, en, id);
      assert(COMPLETE_ENGLISH_PROFILES[id].aliases.includes(slugs.nameBefore), `${id}: old English name searchable`);
    }
  }
  for (const id of ['MARIAANAGOV','ALEJFARNESIOPR','VILLAHERMOSA','FERNCARDINFANTE','GASTANAGA','FRANCISCOMOURA','MANUELMOURA','INIGOMELCHORVELASCO','ISIDOROCUEVA','MONTERREY','CARACENA','RICHARDTALBOT']) assert(!/, /.test(byId.get(id).nombre), id);
  assert.equal(byId.get('FERNCARDINFANTE').sobrenombre, 'el Cardenal-Infante');
  // Ordinal titles that identify a line of homonyms are kept on purpose.
  assert.equal(byId.get('GERALD8KILDARE').nombre, 'Gerald FitzGerald, VIII conde de Kildare');
  assert.equal(COMPLETE_ENGLISH_PROFILES.GERALD8KILDARE.name, 'Gerald FitzGerald, 8th Earl of Kildare');
});

test('the published URLs of renamed people redirect permanently to the new ones', () => {
  let redirects = 0;
  for (const [id, slugs] of Object.entries(TITLE_NAME_SLUGS_609)) {
    const p = byId.get(id);
    if (slugs.es) {
      assert.equal(PERSONA_SLUG_POR_ID[id], slugs.es, id);
      if (slugs.esBefore !== slugs.es) {
        assert.deepEqual(resolveHostingRoute(new URL(`https://example.test/es/persona/${slugs.esBefore}`)), {redirect: `/es/persona/${slugs.es}`, status: 308}, id);
        redirects++;
      }
    }
    if (slugs.en) {
      assert.equal(slugPersonaPorLocale(p, 'en'), slugs.en, id);
      if (slugs.enBefore !== slugs.en) {
        assert.deepEqual(resolveHostingRoute(new URL(`https://example.test/en/person/${slugs.enBefore}`)), {redirect: `/en/person/${slugs.en}`, status: 308}, id);
        redirects++;
      }
    }
  }
  assert(redirects > 150);
  // A homonym that was not renamed keeps its address.
  assert.equal(PERSONA_SLUG_POR_ID.ALEJFARNESIO, 'alejandro-farnesio');
  assert.equal(PERSONA_SLUG_POR_ID.MARIAANAPORT, 'maria-ana-de-austria-mariaanaport');
  assert.equal(PERSONA_SLUG_POR_ID.MARIAANAGOV, 'maria-ana-de-austria-mariaanagov');
});

test('the 6.0.9 portraits are served with their credits', () => {
  const ids = Object.keys(JSON.parse(fs.readFileSync(new URL('../scripts/assets/sources/portraits-609.json', import.meta.url))));
  assert.deepEqual(ids.sort(), ['ALF11','CARLOS2NAP','HENRY2CYPRUS','JAMES2CYPRUS','MARIAANAAUTMAXBAV','MARIAANAPORT','PEDRO1CAST']);
  for (const id of ids) {
    const portrait = IMAGENES_PERSONAS[id];
    assert.equal(portrait?.archivo, `/personas-img/${id}_609.webp`, id);
    assert(served(portrait.archivo), id);
    assert(portrait.derechos && portrait.fuenteUrl.startsWith('https://commons.wikimedia.org/wiki/File:'), id);
  }
  // Every María Ana de Austria now has a portrait.
  for (const p of PERSONAS.filter(p => p.nombre === 'María Ana de Austria')) assert(IMAGENES_PERSONAS[p.id], p.id);
});

test('the fourth review of English names removes machine translations and Spanish leftovers', () => {
  const house = key => ENGLISH_DYNASTIES.find(d => d.key === key)?.name;
  const territory = key => ENGLISH_TERRITORIES.find(t => t.key === key)?.name;
  for (const [key, name] of [['Correr','Correr'],['Estrées','Estrées'],['Hudí','Hudid'],['La Cerda','La Cerda'],['Lencastre','Lencastre'],['Quiñones','Quiñones'],['Cicogna','Cicogna']]) assert.equal(house(key), name, key);
  for (const [key, name] of [['Rávena','Ravenna'],['Pomerelia','Pomerelia'],['Estados Belgas Unidos','United Belgian States'],['República Ligur','Ligurian Republic'],['Beloózero','Beloozero'],['Rus de Kiev','Kievan Rus’'],['Delfinado','Dauphiné'],['Groninga','Groningen']]) assert.equal(territory(key), name, key);
  for (const t of ENGLISH_TERRITORIES) assert(!/\b(de|del)\b/.test(t.name.replace('Pays de Vaud', '')), t.key);
  assert.equal(COMPLETE_ENGLISH_PROFILES.ALEXIOS4TREB.name, 'Alexios IV of Trebizond');
  assert.equal(COMPLETE_ENGLISH_PROFILES.SOPHIAPALHAN.name, 'Sophia of the Palatinate');
  assert.equal(COMPLETE_ENGLISH_PROFILES.MAX1BAV.nickname, 'the Great');
  for (const [id, p] of Object.entries(COMPLETE_ENGLISH_PROFILES)) assert(!/^(el|la|los|las) /.test(p.nickname || '') || id === 'JUANABELTRANEJA', `${id}: Spanish nickname`);
});
