import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {HOMONYM_YEARS} from '../src/data/homonyms.js';
import {homonymYears} from '../src/domain/genealogy/homonyms.js';
import {personClaims} from '../src/evidence/claims.js';
import {ENGLISH_DYNASTIES, ENGLISH_TERRITORIES} from '../src/features/english/entityTranslations.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {englishNameText} from '../src/features/english/nameCorrections.js';
import {PROFILE_NOTES} from '../src/features/english/profileVocabulary.js';

const byId = new Map(PERSONAS.map(p => [p.id, p]));
const served = archivo => (IMAGE_VARIANTS[archivo]?.variants.map(v => v.src) || [archivo])
  .every(src => fs.existsSync(new URL(`../public${src}`, import.meta.url)));

test('Albert VII is the son of Maximilian II and Maria of Austria', () => {
  const albert = byId.get('ALB7AUST');
  assert.equal(albert.padre, 'MAXIM2');
  assert.equal(albert.madre, 'MARIAAUSTESP');
  assert(PERSONAS.some(p => p.padre === 'MAXIM2' && p.id === 'ALB7AUST'));
});

test('the missing grandchildren of Joanna I and Christina of Denmark’s husbands are complete in both languages', () => {
  const added = ['CRISTINADIN','DOROTEADIN','JUANDIN1518','MARIAPORTVISEU','MAGDALENAAUST','MARGARITAAUST1536','HELENAAUST','FRANCESCO2SFORZA','FRANCISCO1LORENA'];
  for (const id of added) {
    const person = byId.get(id);
    assert(person, id);
    assert(COMPLETE_ENGLISH_PROFILES[id]?.name, `${id}: English profile`);
    assert(TRANSLATED_PEOPLE.some(p => p.id === id), `${id}: English route`);
    assert(IMAGENES_PERSONAS[id]?.archivo && served(IMAGENES_PERSONAS[id].archivo), `${id}: portrait`);
    for (const g of person.gobiernos || []) if (g.nota) assert(PROFILE_NOTES[g.nota], `${id}: untranslated note`);
  }
  assert.equal(byId.get('CARLOS3LOR').madre, 'CRISTINADIN');
  assert.equal(byId.get('CARLOS3LOR').padre, 'FRANCISCO1LORENA');
  assert(byId.get('FRED2PAL').conyuges.includes('DOROTEADIN'));
  const milan = PERSONAS.flatMap(p => (p.gobiernos || []).filter(g => g.territorio === 'Milán').map(g => [g.desde, g.hasta]));
  assert(milan.some(([from, to]) => from <= 1521 && to >= 1535), 'Francesco II Sforza fills Milan 1521–1535');
});

test('governor-general mandates cite an admitted source; five are inferred and marked unconfirmed', () => {
  const inferred = [];
  for (const person of PERSONAS) for (const claim of personClaims(person)) {
    if (claim.field !== 'Gobierno' || claim.value.territorio !== 'Países Bajos' || claim.value.clase !== 'gobierno') continue;
    if (person.id === 'WILLIAM1NETHERLANDS') continue;
    assert(['documented','inferred'].includes(claim.certainty), claim.id);
    assert(claim.sources.every(s => s.url && s.locator), claim.id);
    if (claim.certainty === 'inferred') { inferred.push(person.id); assert(claim.note.startsWith('Sin confirmar.'), claim.id); }
  }
  assert.deepEqual([...new Set(inferred)].sort(), ['FRANCISCOMOURA','GRANA','INIGOMELCHORVELASCO','MONTERREY']);
  assert.equal(byId.get('GUILLERMOCROY').gobiernos[0].desde, 1506);
});

test('the 6.0.8 portraits are served with their responsive variants', () => {
  const ids = Object.keys(JSON.parse(fs.readFileSync(new URL('../scripts/assets/sources/portraits-608.json', import.meta.url))));
  assert(ids.length >= 60);
  for (const id of ids) {
    const portrait = IMAGENES_PERSONAS[id];
    assert.equal(portrait?.archivo, `/personas-img/${id}_608.webp`, id);
    assert(served(portrait.archivo), id);
    assert(portrait.derechos && portrait.fuenteUrl.startsWith('https://commons.wikimedia.org/wiki/File:'), id);
  }
  for (const id of ['FERNCARDINFANTE','LEOPGUILLERMO','JUANJOSEAUST','CHARLESALEXLOR','MARIACRISTINATESCHEN','ALBERTTESCHEN','CARLOSTESCHEN']) assert(IMAGENES_PERSONAS[id], id);
});

test('the third review of English names corrects houses 201–300, territories 101–200 and people 201–300', () => {
  const house = key => ENGLISH_DYNASTIES.find(d => d.key === key)?.name;
  const territory = key => ENGLISH_TERRITORIES.find(t => t.key === key)?.name;
  for (const [key, name] of [['Luna','Luna'],['Aquino','Aquino'],['Rubénida','Rubenid'],['Lazarević','Lazarević'],['Casa de Flandes','Flanders'],['Ayubí','Ayyubid']]) assert.equal(house(key), name, key);
  for (const [key, name] of [['Suabia','Swabia'],['Gandía','Gandia'],['Samtsje','Samtskhe'],['Clanricarde','Clanricarde'],['Banato de Temes','Banat of Temes'],['La Marche','La Marche'],['Señorío de Malinas','Lordship of Mechelen']]) assert.equal(territory(key), name, key);
  assert.equal(COMPLETE_ENGLISH_PROFILES.ROD3HAB.name, 'Rudolf III of Habsburg');
  assert.equal(COMPLETE_ENGLISH_PROFILES.FEDERICO2SIC.name, 'Frederick III of Sicily');
  assert.equal(COMPLETE_ENGLISH_PROFILES.STEFANDUSAN.nickname, 'the Mighty');
  for (const [bad, good] of [['Count of The March, 1362–1393.','Count of La Marche, 1362–1393.'],['Mara Lazareć','Mara Lazarević']]) assert.equal(englishNameText(bad), good);
});

test('people who share a name show their years, and the generated list is current', () => {
  assert.deepEqual(HOMONYM_YEARS, homonymYears(PERSONAS, id => COMPLETE_ENGLISH_PROFILES[id]?.name));
  assert.equal(HOMONYM_YEARS.MARIAAUSTESP, '1528–1603');
  assert.equal(HOMONYM_YEARS.MARIAAUST, '1505–1558');
  assert.equal(HOMONYM_YEARS.CARLOS5, undefined);
});
