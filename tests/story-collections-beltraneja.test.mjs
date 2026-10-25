import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import StoryCatalog from '../src/features/stories/StoryCatalog.jsx';
import DynastyArms from '../src/components/DynastyArms.jsx';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {completeEnglishProfile} from '../scripts/generate/complete-english-profile.mjs';
import {personClaims} from '../src/evidence/claims.js';
import {biografiaExtensaPersona} from '../src/content/biografias-extensas.js';

test('las colecciones se abren de una en una, comparten relatos y Todas no duplica', async () => {
  const dom = new JSDOM('<div id="root"></div>', {url:'https://example.org/es/historias'});
  const previous = {window:global.window, document:global.document, IS_REACT_ACT_ENVIRONMENT:global.IS_REACT_ACT_ENVIRONMENT};
  global.window=dom.window;global.document=dom.window.document;global.IS_REACT_ACT_ENVIRONMENT=true;
  const root=createRoot(document.getElementById('root'));
  const items=HISTORIAS.map(s=>({...s,slug:s.id}));
  try {
    await act(()=>root.render(React.createElement(StoryCatalog,{items})));
    const tabs=[...document.querySelectorAll('[role=tab]')];
    assert.deepEqual(tabs.map(t=>t.textContent),['Todas','Colecciones']);
    assert.equal(document.querySelectorAll('.public-story-card').length,21);
    assert.equal(document.querySelectorAll('.story-review-note').length,4);
    await act(()=>tabs[0].dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));
    assert.equal(document.activeElement,tabs[1]);assert.equal(tabs[1].getAttribute('aria-selected'),'true');
    const buttons=[...document.querySelectorAll('[aria-expanded]')];
    assert.equal(buttons.length,3);assert.ok(buttons.every(b=>b.getAttribute('aria-expanded')==='false'));
    await act(()=>buttons[0].click());
    assert.equal(buttons[0].getAttribute('aria-expanded'),'true');
    assert.equal(document.querySelectorAll('.story-collection-card .public-story-card').length,6);
    assert.equal([...document.querySelectorAll('h3')].filter(h=>h.textContent==='El Reino de los Cielos').length,1);
    await act(()=>buttons[1].click());
    assert.equal(buttons[0].getAttribute('aria-expanded'),'false');assert.equal(buttons[1].getAttribute('aria-expanded'),'true');
    assert.equal(document.querySelectorAll('.story-collection-card .public-story-card').length,5);
    assert.equal([...document.querySelectorAll('h3')].filter(h=>h.textContent==='El Reino de los Cielos').length,1);
    await act(()=>buttons[1].click());assert.ok(buttons.every(b=>b.getAttribute('aria-expanded')==='false'));
    await act(()=>buttons[2].click());assert.equal(buttons[2].getAttribute('aria-expanded'),'true');assert.equal(document.querySelectorAll('.story-collection-card .public-story-card').length,3);assert.equal(document.querySelectorAll('.story-collection-card .story-coming-list li').length,0);
    await act(()=>tabs[0].click());assert.equal(document.querySelectorAll('.public-story-card').length,21);
    await act(()=>root.render(React.createElement(StoryCatalog,{items:[{id:'gioconda',nombre:'Mona Lisa',pasos:11,path:'/en/story/mona-lisa'}],locale:'en'})));
    await act(()=>document.querySelectorAll('[role=tab]')[1].click());
    assert.equal(document.querySelectorAll('[aria-expanded]')[1].textContent,'Popular Culture1 story');
  } finally {
    await act(()=>root.unmount());dom.window.close();Object.assign(global,previous);
  }
});

test('la Beltraneja tiene filiación, matrimonio recíproco y traducción completa sin posesión territorial', () => {
  const p=PERSONAS.find(p=>p.id==='JUANABELTRANEJA');
  assert.equal(p.padre,'ENRIQ4CAST');assert.equal(p.madre,'JUANAPORTCAST');
  assert.ok(PERSONAS.find(p=>p.id==='ALF5PORT').conyuges.includes(p.id));
  assert.deepEqual(p.gobiernos.map(g=>[g.territorio,g.condicion]),[['Castilla','titular'],['León','titular']]);
  const mapData=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url),'utf8'));
  assert.equal(mapAuthoritiesForPerson(p,1476,mapData).filter(e=>e.paint).length,0);
  assert.ok(mapAuthoritiesForPerson(PERSONAS.find(p=>p.id==='ISAB1CAST'),1476,mapData).some(e=>e.paint));
  const en=completeEnglishProfile({...p,biografiaExtensa:biografiaExtensaPersona(p),padres:[],conyuges:[],hijos:[],relacionadosDinastia:[],contemporaneos:[],historias:[]});
  const claims=personClaims(p);assert.ok(claims.every(c=>c.sources.length));assert.equal(claims.find(c=>c.field==='Padre').certainty,'disputed');
  assert.ok(en.localizedClaims.every(c=>c.sources.length&&c.note!==claims.find(s=>s.id===c.id).note));
  assert.equal(en.translationComplete,true);assert.equal(en.sobrenombre,'la Beltraneja');
  assert.equal(en.biografiaExtensa.length,3);assert.equal(COMPLETE_ENGLISH_PROFILES[p.id].name,'Joanna of Castile');
});

test('Osmanlí identifica la tuğra de Orhan sin inventar armas de Osman; Báthory conserva procedencia', () => {
  const emblem=escudoDe('Osmanlí');assert.equal(emblem.tipo,'tughra');assert.match(emblem.nota,/no se conoce una de Osman I/);
  const html=renderToStaticMarkup(React.createElement(DynastyArms,{dinastia:'Osmanlí',drawn:true}));
  assert.match(html,/Tuğra de Orhan/);assert.doesNotMatch(html,/alt="Armas/);assert.doesNotMatch(html,/<svg/);
  assert.equal(escudoDe('Báthory').imagen.procedencia,'WappenWiki');
  assert.match(escudoDe('Báthory').imagen.archivo,/bathory.svg$/);
});
