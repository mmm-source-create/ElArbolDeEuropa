import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../src/features/english/profilePortraits.js';
import {HISTORIAS} from '../src/data/historias.js';
import {HISTORIAS_TEMATICAS} from '../src/data/historiasTematicas.js';
import {collectionGroups, storyCollections} from '../src/features/stories/storyThemes.js';
import StoryCatalog from '../src/features/stories/StoryCatalog.jsx';
import {storyAtlasUrl} from '../src/features/stories/storyModel.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {englishEntityStory} from '../scripts/generate/english-entities.mjs';
const people = new Map(PERSONAS.map(p => [p.id,p]));
test('todos los reyes portugueses registrados tienen retrato y crédito inglés', () => {
  const kings = PERSONAS.filter(p => p.gobiernos?.some(g => g.territorio === 'Portugal' && /^Re(y|ina)/.test(g.titulo)));
  assert.equal(kings.length,28);
  for (const p of kings) {
    const image = IMAGENES_PERSONAS[p.id];assert.ok(image,p.id);
    const files = IMAGE_VARIANTS[image.archivo]?.variants.map(v=>v.src) || [image.archivo];
    for (const file of files)assert.ok(fs.existsSync(new URL('../public'+file,import.meta.url)),p.id);
    assert.ok(image.autor && image.fuenteUrl && image.derechos,p.id);
    assert.ok(ENGLISH_PROFILE_PORTRAITS[p.id],p.id);
  }
  assert.match(IMAGENES_PERSONAS.JUAN2PORT.tipo,/discutida/);
  assert.match(IMAGENES_PERSONAS.MAN1PORT.derechos,/CC BY-SA 4.0/);
});
test('las colecciones son opcionales y admiten historias compartidas', () => {
  const groups = collectionGroups(HISTORIAS);
  assert.deepEqual(groups.map(c=>c.id),['cruzadas','cultura-popular','herencias-conflictivas']);
  assert.equal(groups[0].stories.length,6);assert.equal(groups[1].stories.length,5);
  assert.deepEqual(storyCollections('balduino-saladino'),['cruzadas','cultura-popular']);
  assert.deepEqual(storyCollections('borgona'),['herencias-conflictivas']);
  assert.deepEqual(groups[2].stories.map(s=>s.id).sort(),['borgona','corona-demasiado-grande','dos-coronas-dos-hijas']);
  assert.ok(groups[2].stories.every(s=>s.disponible&&s.pasos?.length));
  assert.equal(HISTORIAS.filter(s=>s.disponible).length,21);
  assert.equal(HISTORIAS.filter(s=>s.titulo==='El Reino de los Cielos').length,1);
  assert.equal(HISTORIAS.some(s=>s.id==='reino-de-los-cielos'),false);
  assert.deepEqual(HISTORIAS.filter(s=>s.revisionPendiente),[]);
});
test('Normandía conserva los relatos nuevos con títulos ingleses y destino explícito', () => {
  const film=englishEntityStory({slug:'el-reino-de-los-cielos',titulo:'El Reino de los Cielos'});
  assert.equal(film.titulo,'Kingdom of Heaven');assert.equal(film.path,'/es/historia/el-reino-de-los-cielos');
  const translated=englishEntityStory({slug:'en-busca-de-la-gioconda'});
  assert.equal(translated.titulo,'In search of the Mona Lisa');assert.equal(translated.path,'/en/story/in-search-of-the-mona-lisa');
  assert.throws(()=>englishEntityStory({slug:'nueva-historia-sin-traduccion'}),/Missing territory story translation/);
});
test('los seis relatos conservados tienen capítulos, fuentes y enlaces al Atlas con personas válidas', () => {
  assert.equal(HISTORIAS_TEMATICAS.length,6);
  for (const story of HISTORIAS_TEMATICAS) {
    assert.ok(story.fuentes.length >= 2,story.id);assert.ok(story.pasos.length >= 6,story.id);
    for (const [i,p] of story.pasos.entries()) {
      assert.ok(p.texto.length > 250,`${story.id}/${i}`);
      for (const id of p.personas)assert.ok(people.has(id),id);
      const url = new URL(storyAtlasUrl({...story,slug:'test'},i+1),'https://example.org');
      assert.equal(url.searchParams.get('anio'),String(p.anio));
      assert.deepEqual(url.searchParams.getAll('resaltar'),p.personas);
      assert.ok(p.anio <= 1800,'las fechas de las películas y novelas no se convierten en años del Atlas');
    }
  }
});
test('el catálogo muestra cada relato una vez, conserva progreso y localiza su interfaz', () => {
  const items=HISTORIAS.map(s=>({...s,slug:s.id}));
  const doc=new JSDOM(renderToString(React.createElement(StoryCatalog,{items,progress:{'braveheart-detras-del-mito':{last:3,read:[1,2]}}}))).window.document;
  assert.equal(doc.querySelectorAll('.public-story-card').length,21);
  assert.equal(doc.querySelectorAll('.story-coming-list li').length,10);
  assert.ok(doc.querySelector('button[aria-selected="true"]').textContent.includes('Todas'));
  assert.ok(doc.querySelector('a[href="/es/historia/braveheart-detras-del-mito/capitulo/3"]'));
  const en=new JSDOM(renderToString(React.createElement(StoryCatalog,{items:[{id:'gioconda',nombre:'Mona Lisa',path:'/en/story/mona-lisa',pasos:11}],locale:'en'}))).window.document;
  assert.ok(en.querySelector('[role=tablist]').textContent.includes('Collections'));
  assert.equal(en.querySelector('a.public-secondary').getAttribute('href'),'/en/story/mona-lisa');
  assert.equal(new URL(en.querySelector('a.public-primary').getAttribute('href'),'https://example.test').searchParams.get('historia'),'gioconda');
});
test('Évreux se registra antes de la corona navarra y la confiscación no pinta posesión', () => {
  const philip=people.get('FELIPEVREUX'),charles=people.get('CARLOS2NAV');
  const mapData=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url),'utf8'));
  assert.ok(philip.gobiernos.some(g=>g.territorio==='Évreux'&&g.desde===1319&&g.hasta===1343));
  assert.ok(mapAuthoritiesForPerson(charles,1350,mapData).some(e=>e.territory==='Évreux'&&e.paint&&e.ids.includes('Evreux')));
  assert.ok(!mapAuthoritiesForPerson(charles,1378,mapData).some(e=>e.territory==='Évreux'&&e.paint));
});
test('los escudos conservan su crédito y Paleólogo muestra el emblema revisado', () => {
  for(const house of ['Barcelona-Urgel','Della Scala','Paleólogo'])assert.ok(escudoDe(house).imagen.fuente);
  const svg=fs.readFileSync(new URL('../public/escudos/palaiologos-device.svg',import.meta.url),'utf8');
  const doc=new JSDOM(svg,{contentType:'image/svg+xml'}).window.document;
  assert.ok(doc.querySelector('use[xlink\\:href="#wing"]'));
  assert.equal(doc.querySelectorAll('image,script,foreignObject').length,0);
  assert.equal(escudoDe('Paleólogo').tipo,'emblema');
  assert.match(escudoDe('Paleólogo').imagen.fuente,/Device_of_the_Palaiologos_Dynasty/);
});
