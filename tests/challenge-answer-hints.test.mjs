import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {PreguntaOpciones,PreguntaOrden} from '../src/features/desafio/Question.jsx';

const byId={a:{id:'a',nombre:'Gaston',titulo:'Conde',dinastia:'Foix'},b:{id:'b',nombre:'Roger',titulo:'Conde',dinastia:'Foix'},c:{id:'c',nombre:'Charles',titulo:'Rey',dinastia:'Valois'}};
const pregunta={tipo:'sobra',pregunta:'Dos pertenecen a Foix. ¿Quién sobra?',correctaId:'c',opciones:Object.values(byId).map(p=>({id:p.id,label:p.nombre}))};
test('options reveal title and dynasty only after answering, including saved or shared questions',()=>{
 for(const respondida of [false,true]){
  const dom=new JSDOM(renderToStaticMarkup(React.createElement(PreguntaOpciones,{pregunta,byId,seleccion:respondida?'c':null,respondida,onSelect:()=>{}})));
  const options=dom.window.document.querySelectorAll('.desafio-option');
  assert.equal(options.length,3);
  assert.equal([...options].some(el=>el.textContent.includes('Foix')),respondida);
  assert.equal([...options].some(el=>el.textContent.includes('Valois')),respondida);
  assert.equal([...options].some(el=>el.textContent.includes('Conde')),respondida);
  dom.window.close();
 }
});
test('chronology options do not expose a fallback dynasty as a clue',()=>{
 const props={pregunta,byId,orden:[],onPick:()=>{}};
 const before=renderToStaticMarkup(React.createElement(PreguntaOrden,{...props,respondida:false}));
 assert.ok(!before.includes('Conde')&&!before.includes('Foix'));
 const after=renderToStaticMarkup(React.createElement(PreguntaOrden,{...props,respondida:true}));
 assert.ok(after.includes('Conde'));
});
