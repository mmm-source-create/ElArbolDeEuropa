import test from 'node:test';
import assert from 'node:assert/strict';
import {englishPaths,englishRoute,translatedEquivalent,TRANSLATED_STORIES} from '../src/english/routes.js';
import {ENGLISH_STORIES} from '../src/english/content.js';
import {publicMeta} from '../src/public/publicMeta.js';
import {safeStoryReturn} from '../src/stories/storyModel.js';
import {staticRoute} from '../src/public/staticData.js';

test('todas las rutas traducidas mantienen la equivalencia de página y capítulo',()=>{
 const paths=englishPaths();assert.equal(paths.length,34);assert.equal(new Set(paths).size,34);
 for(const path of paths){assert.equal(englishRoute(path)?.path,path);assert.equal(staticRoute(path)?.kind,'english');assert.equal(translatedEquivalent(translatedEquivalent(path,'es'),'en'),path);}
 for(const story of TRANSLATED_STORIES)assert.equal(ENGLISH_STORIES[story.id].chapters.length,11);
 assert.equal(translatedEquivalent('/es/historia/las-familias-papales','en'),null);
 assert.equal(englishRoute('/en/person/charles-v/chapter/1'),null);
});
test('solo se anuncian versiones inglesas existentes en metadatos',()=>{
 const en='/en/story/in-search-of-the-mona-lisa/chapter/3',es=translatedEquivalent(en,'es');
 for(const path of [en,es]){const meta=publicMeta({title:'Story',description:'Text',path});assert.equal(meta.lang,path===en?'en':'es');assert.ok(meta.alternates.some(a=>a.hreflang==='en'&&a.href.endsWith(en)));assert.ok(meta.alternates.some(a=>a.hreflang==='es'&&a.href.endsWith(es)));}
 assert.ok(!publicMeta({path:'/es/persona/sin-traduccion'}).alternates.some(a=>a.hreflang==='en'));
});
test('el Atlas devuelve al capítulo inglés y rechaza destinos externos o malformados',()=>{
 const path='/en/story/in-search-of-the-mona-lisa/chapter/3';assert.equal(safeStoryReturn('?'+new URLSearchParams({regreso:path})),path);
 for(const bad of ['https://example.org','//example.org',path+'?redirect=x','/en/story/a/capitulo/3','/en/story/a/chapter/0'])assert.equal(safeStoryReturn('?'+new URLSearchParams({regreso:bad})),null);
});
