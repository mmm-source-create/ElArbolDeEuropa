import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {sourcesForPerson} from '../src/content/sources.js';
import {biografiaExtensaPersona} from '../src/content/biografias-extensas.js';
import {resumenCortoPersona} from '../src/domain/people/personPresentation.js';
const ids=['RICHELIEU','MAZARINO','JANHUS','JANZIZKA','JANZAMOYSKI','GUTENBERG','CHRISTINEPIZAN'];
test('all seven explicitly confirmed people have sourced editorial profiles and separate professional roles',()=>{
 for(const id of ids){
  const p=PERSONAS.find(p=>p.id===id);assert(p,id);assert(p.aliases.length);assert(sourcesForPerson(id).length>=2,id);
  const bio=biografiaExtensaPersona(id);assert.equal(bio.length,2,id);assert(bio.every(s=>s.texto.length>100&&s.fuentes.length>=2),id);
  assert(resumenCortoPersona(p).length>100,id);assert.equal(p.gobiernos,undefined,id+' is not given sovereign government through professional service');
 }
 for(const id of ['JANHUS','JANZIZKA','GUTENBERG','CHRISTINEPIZAN'])assert(PERSONAS.find(p=>p.id===id).nacAprox,id);
 assert(PERSONAS.find(p=>p.id==='CHRISTINEPIZAN').muerAprox);
});
