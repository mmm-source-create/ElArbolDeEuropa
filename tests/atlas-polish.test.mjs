import test from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import StoryAtlasGuide from '../src/features/atlas/StoryAtlasGuide.jsx';
import {HISTORIAS} from '../src/data/historias.js';
import {ENGLISH_STORIES} from '../src/features/english/content.js';
import {useAtlasLayout} from '../src/features/atlas/useAtlasLayout.js';
import {PANELES_STORAGE_KEY} from '../src/features/atlas/atlasModel.js';

test('chapter arrows precede headings of any length and text is always available',()=>{
 for(const index of [0,3,12,16]){
  const story=HISTORIAS.find(s=>s.id==='borgona');
  const dom=new JSDOM(renderToStaticMarkup(React.createElement(StoryAtlasGuide,{story,index,returnPath:'/es/historia/borgona',count:10})));
  const doc=dom.window.document,nav=doc.querySelector('.story-atlas-chapter nav'),heading=doc.querySelector('#story-atlas-heading');
  assert.ok(nav.compareDocumentPosition(heading)&4);
  assert.equal(doc.querySelector('.story-atlas-reading').hasAttribute('hidden'),false);
  assert.ok(!doc.body.textContent.includes('Ocultar texto'));
  dom.window.close();
 }
});
test('Burgundy explains Poitiers, revenge and the three defeats in both languages',()=>{
 const story=HISTORIAS.find(s=>s.id==='borgona');
 assert.match(story.pasos[0].texto,/Poitiers/);assert.match(story.pasos[0].texto,/recompensa/);
 assert.match(story.pasos[3].texto,/Vengarlo/);
 assert.match(story.pasos[5].texto,/reparación/);
 assert.match(story.pasos.find(p=>p.titulo.startsWith('Nancy:')).texto,/Gut.*Mut.*Blut/);
 assert.match(ENGLISH_STORIES.borgona.chapters[13][1],/Gut.*Mut.*Blut/);
});
test('the latest saved panel preference takes priority over an older session and survives remounting',async()=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test'});
 const previous={window:global.window,document:global.document,IS_REACT_ACT_ENVIRONMENT:global.IS_REACT_ACT_ENVIRONMENT};
 global.window=dom.window;global.document=dom.window.document;global.IS_REACT_ACT_ENVIRONMENT=true;
 let root;
 function Harness(){const state=useAtlasLayout({panelesVisibles:{filtros:false,biografia:true,cronologia:true}},null);return React.createElement('button',{onClick:()=>state.alternarPanelAuxiliar('filtros')},String(state.panelesVisibles.filtros));}
 try{
  window.localStorage.setItem(PANELES_STORAGE_KEY,JSON.stringify({filtros:true,biografia:true,cronologia:false}));
  root=createRoot(document.getElementById('root'));await act(()=>root.render(React.createElement(Harness)));
  assert.equal(document.querySelector('button').textContent,'true');
  await act(()=>document.querySelector('button').click());
  assert.equal(JSON.parse(window.localStorage.getItem(PANELES_STORAGE_KEY)).filtros,false);
  await act(()=>root.unmount());root=createRoot(document.getElementById('root'));await act(()=>root.render(React.createElement(Harness)));
  assert.equal(document.querySelector('button').textContent,'false');
 }finally{if(root)await act(()=>root.unmount());dom.window.close();Object.assign(global,previous);}
});
