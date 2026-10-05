import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolverRuta} from '../src/routing.js';
import {applyPreferences,clearLocalData,cleanPreferences,readPreferences,savePreferences,PREFERENCES_KEY,FAVORITES_KEY,STORY_PROGRESS_KEY,CHALLENGE_KEYS} from '../src/settings/preferences.js';

function memoryStorage() {
 const values=new Map();
 return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}

test('los ajustes inválidos vuelven a valores seguros y el modo sistema sigue al navegador',()=>{
 const storage=memoryStorage();storage.setItem(PREFERENCES_KEY,'{broken');
 assert.deepEqual(readPreferences(storage),{theme:'system',textSize:'normal',motion:'system',treeView:'visual'});
 assert.deepEqual(cleanPreferences({theme:'unknown',textSize:'large',motion:'reduce'}),{theme:'system',textSize:'large',motion:'reduce',treeView:'visual'});
 savePreferences(storage,{theme:'dark',textSize:'larger',motion:'reduce',treeView:'list'});
 assert.deepEqual(readPreferences(storage),{theme:'dark',textSize:'larger',motion:'reduce',treeView:'list'});
 const doc={documentElement:{dataset:{}}},win={matchMedia:()=>({matches:false})};
 applyPreferences(readPreferences(storage),doc,win);
 assert.deepEqual(doc.documentElement.dataset,{eadeTheme:'dark',eadeTextSize:'larger',eadeMotion:'reduce',eadeTreeView:'list'});
 applyPreferences({theme:'system'},doc,{matchMedia:()=>({matches:true})});
 assert.equal(doc.documentElement.dataset.eadeTheme,'dark');
 applyPreferences({theme:'light',motion:'system'},doc,{matchMedia:query=>({matches:query.includes('reduced-motion')})});
 assert.equal(doc.documentElement.dataset.eadeMotion,'reduce');
 applyPreferences({theme:'light',motion:'system'},doc,{matchMedia:()=>({matches:false})});
 assert.equal(doc.documentElement.dataset.eadeMotion,'normal');
});

test('las preferencias iniciales aplican tema y movimiento antes del primer dibujo',()=>{
 const source=readFileSync(new URL('../public/preferences-bootstrap.js',import.meta.url),'utf8');
 const htmlRoot={dataset:{}};
 runInNewContext(source,{
  document:{documentElement:htmlRoot},
  localStorage:{getItem:()=>JSON.stringify({theme:'system',textSize:'larger',motion:'system',treeView:'list'})},
  window:{matchMedia:query=>({matches:query.includes('color-scheme')||query.includes('reduced-motion')})},
 });
 assert.deepEqual(htmlRoot.dataset,{eadeTheme:'dark',eadeTextSize:'larger',eadeMotion:'reduce',eadeTreeView:'list'});

 const invalidRoot={dataset:{}};
 runInNewContext(source,{
  document:{documentElement:invalidRoot},
  localStorage:{getItem:()=>JSON.stringify({theme:'invalid',motion:'invalid'})},
  window:{matchMedia:query=>({matches:query.includes('color-scheme')||query.includes('reduced-motion')})},
 });
 assert.deepEqual(invalidRoot.dataset,{eadeTheme:'dark',eadeTextSize:'normal',eadeMotion:'reduce',eadeTreeView:'visual'});
});

test('borrar progreso y favoritos no borra ajustes ni datos ajenos',()=>{
 const storage=memoryStorage();
 for(const key of [PREFERENCES_KEY,FAVORITES_KEY,STORY_PROGRESS_KEY,...CHALLENGE_KEYS,'unrelated'])storage.setItem(key,'1');
 assert.equal(clearLocalData(storage,'favorites'),1);
 assert.equal(storage.getItem(FAVORITES_KEY),null);
 assert.equal(storage.getItem(STORY_PROGRESS_KEY),'1');
 assert.equal(clearLocalData(storage,'progress'),1+CHALLENGE_KEYS.length);
 assert.equal(storage.getItem(STORY_PROGRESS_KEY),null);
 assert.equal(storage.getItem(PREFERENCES_KEY),'1');
 assert.equal(storage.getItem('unrelated'),'1');
});

test('la página de privacidad tiene rutas propias en los dos idiomas',()=>{
 assert.deepEqual(resolverRuta('/es/privacidad'),{locale:'es',view:'privacy'});
 assert.deepEqual(resolverRuta('/en/privacy'),{locale:'en',view:'privacy'});
});
