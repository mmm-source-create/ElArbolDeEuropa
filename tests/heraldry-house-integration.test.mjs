import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {canonicalDynasty,canonicalDynastySlug} from '../src/data/dynastyAliases.js';
import {textoBusquedaPersona} from '../src/domain/people/personLabels.js';
import {buildDynastyPages,auditDynasties} from '../src/domain/genealogy/dynastyModel.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {ArmsCredit} from '../src/components/DynastyArms.jsx';

// CI runs unit tests before site metadata is generated. Only the unrelated
// cache version is a fixture; the dynasty data and page component remain real.
registerHooks({resolve(specifier,context,nextResolve){
  if(specifier.endsWith('/generated/siteMeta.json'))return {
    url:'data:text/javascript,export default {buildVersion:"house-test"};',shortCircuit:true,
  };
  return nextResolve(specifier,context);
}});
const {default:DynastyPage}=await import('../src/features/public/DynastyPage.jsx');

const by=new Map(PERSONAS.map(p=>[p.id,p]));
const pages=buildDynastyPages(PERSONAS);
const house=name=>pages.find(p=>p.nombre===name);

test('the nine Montfort records form the Breton Dreux branch; the earlier homonymous family is not invented',()=>{
  const p=house('Montfort-Bretaña');
  assert.equal(p.total,9);
  assert.deepEqual(p.casasOrigen.map(h=>h.nombre),['Dreux']);
  assert(!house('Montfort'));
  assert.equal(by.get('JOHNMONTPRET').padre,'ARTHUR2BRET');
  assert.equal(by.get('JOHNMONTPRET').madre,'YOLANDEDREUXSCOT');
  for(const member of p.miembros){
    let id=member.id;const visited=new Set();
    while(id!=='JOHNMONTPRET'&&by.get(id)?.padre&&!visited.has(id)){
      visited.add(id);id=by.get(id).padre;
    }
    assert.equal(id,'JOHNMONTPRET',member.id);
  }
  assert.match(p.origen,/Montfort-l’Amaury/);
  assert.equal(escudoDe(p.nombre).blason,'De armiño.');
});

test('the Portuguese first dynasty is distinct from both ducal Burgundy and the Ivrea house, and connects to Avís',()=>{
  const p=house('Borgoña-Portugal');
  assert.equal(p.total,14);
  assert(p.editorial&&p.origen&&p.trayectoria&&p.legado&&p.fuentes.length);
  assert.deepEqual(p.casasOrigen.map(h=>h.nombre),['Borgoña']);
  assert(p.casasDerivadas.some(h=>h.nombre==='Avís'));
  assert(house('Avís').casasOrigen.some(h=>h.nombre===p.nombre));
  for(const id of ['ALF3POR','DION1','ALF4POR','PED1PORT','FERN1PORT'])assert.equal(by.get(id).dinastia,p.nombre);
  assert.equal(by.get('ALF10').dinastia,'Ivrea-Borgoña');
  assert.equal(by.get('HUG4BORG').dinastia,'Borgoña');
  assert.deepEqual(auditDynasties(PERSONAS),[]);
});

test('previous house names still resolve in routes, arms and public searches',()=>{
  for(const [old,name,slug,id] of [['Alfonsina','Borgoña-Portugal','borgona-portugal','DION1'],['Montfort','Montfort-Bretaña','montfort-bretana','ANABRET']]){
    assert.equal(canonicalDynasty(old),name);
    assert.equal(canonicalDynastySlug(old.toLowerCase()),slug);
    assert(house(name).aliases.includes(old));
    assert.equal(escudoDe(old),escudoDe(name));
    assert(textoBusquedaPersona(by.get(id)).includes(old));
  }
  const redirects=JSON.parse(fs.readFileSync('vercel.json')).redirects;
  for(const [old,target] of [['montfort','montfort-bretana'],['alfonsina','borgona-portugal']])
    assert(redirects.some(r=>r.source===`/es/dinastia/${old}`&&r.destination===`/es/dinastia/${target}`&&r.permanent));
});

test('all documented branches appear once inside the unified section, attached to the appropriate house',()=>{
  for(const p of pages.filter(p=>p.ramas.length)){
    const dom=new JSDOM(renderToStaticMarkup(React.createElement(DynastyPage,{slug:p.slug,initialData:p})));
    const doc=dom.window.document;
    assert.equal(doc.querySelectorAll('a[href="#casas"]').length,1,p.nombre);
    assert.equal(doc.querySelectorAll('a[href="#ramas"]').length,0,p.nombre);
    for(const r of p.ramas){
      const nodes=doc.querySelectorAll(`[id="${r.id}"]`);
      assert.equal(nodes.length,1,`${p.nombre}: ${r.id}`);
      assert(nodes[0].closest('#casas'));
      assert.match(nodes[0].textContent,/Ver la conexión en el árbol/);
      if(r.origen!==r.destino)assert(nodes[0].closest('.public-entity-card'));
    }
    const expected=[...p.casasOrigen,...p.casasDerivadas,...p.casasConectadas].map(h=>h.nombre);
    const actual=[...doc.querySelectorAll('#casas .public-entity-card .public-entity-heading h3')].map(h=>h.textContent);
    assert.equal(new Set(actual).size,actual.length,p.nombre);
    assert.deepEqual(actual.sort(),expected.sort(),p.nombre);
    dom.window.close();
  }
  const foix=house('Foix');
  assert(foix.casasConectadas.some(h=>h.nombre==='Grailly'));
  assert(!foix.casasOrigen.some(h=>h.nombre==='Grailly'));
});

test('the requested drawings keep their authors, modifications and distinct licences',()=>{
  const names=['Piast','Nassau','Brabante','Barberini','Loyola','Borgoña','Artois','Bjälbo','Châtillon','Grailly','Piccolomini','Colleoni','Borgoña-Portugal','Montfort-Bretaña','Zrinski','Saluzzo','Kosača','Carafa','Babenberg'];
  for(const name of names){const image=escudoDe(name)?.imagen;assert(image?.autor&&image.licencia&&image.fuente,name);assert(fs.existsSync(`public${image.archivo}`),name);}
  for(const name of ['Avesnes','Saluzzo','Kosača','Carafa','Babenberg']){
    const image=escudoDe(name).imagen;
    assert.equal(image.autor,'Manuel Muriel Cagigal');
    assert.equal(image.procedencia,'Aportación del autor');
    assert(!image.licencia.startsWith('CC'));
    assert.match(image.fuente,/^https:\/\/heraldicon.org\/arms\//);
  }
  const zrinski=escudoDe('Zrinski').imagen;
  assert.equal(zrinski.procedencia,'WappenWiki');
  assert.equal(zrinski.licencia,'CC BY-NC-SA 3.0');
  const credit=renderToStaticMarkup(React.createElement(ArmsCredit,{dinastia:'Nassau'}));
  assert.match(credit,/Wapen_Nassauw/);assert.match(credit,/Nassau-Saarbr/);assert.match(credit,/MostEpic/);
});
