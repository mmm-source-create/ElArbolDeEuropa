import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import DynastyArms,{ArmsCredit} from '../src/components/DynastyArms.jsx';
import {escudoDe,nombreEmblema} from '../src/content/dinastias/escudos.js';
import {buildDynastyPages} from '../src/domain/genealogy/dynastyModel.js';
import {PERSONAS} from '../src/data/personas.js';

test('emblemas y estandartes conservan su imagen y etiqueta incluso al solicitar dibujo',()=>{
  for(const [house,type,es,en] of [['Paleólogo','emblema','Emblema dinástico','Dynastic emblem'],['Gran Comneno','estandarte','Estandarte','Banner']]){
    const emblem=escudoDe(house);
    assert.equal(emblem.tipo,type);
    for(const locale of ['es','en']){
      const markup=renderToStaticMarkup(React.createElement(DynastyArms,{dinastia:house,locale,drawn:true}));
      assert.match(markup,/^<img/);
      assert.ok(markup.includes(emblem.imagen.archivo));
      assert.ok(markup.includes(emblem.alt[locale]));
      assert.equal(nombreEmblema(emblem,locale),locale==='es'?es:en);
    }
    assert.ok(renderToStaticMarkup(React.createElement(ArmsCredit,{dinastia:house})).includes(es+':'));
  }
});

test('las nuevas alianzas se navegan sin convertir a los cónyuges en casas de origen',()=>{
  const pages=Object.fromEntries(buildDynastyPages(PERSONAS).map(p=>[p.nombre,p]));
  for(const [a,b] of [['Frankopan','Zrinski'],['Báthory','Rákóczi'],['Nemanjić','Kotromanić'],['Paleólogo','Gran Comneno']]){
    assert.ok(pages[a].casasConectadas.some(c=>c.nombre===b));
    assert.ok(pages[b].casasConectadas.some(c=>c.nombre===a));
    assert.ok(!pages[b].casasOrigen.some(c=>c.nombre===a));
  }
  assert.deepEqual(pages.Zrinski.casasOrigen.map(c=>c.nombre),['Šubić']);
  assert.ok(pages.Braganza.casasOrigen.some(c=>c.nombre==='Avís'));
});
