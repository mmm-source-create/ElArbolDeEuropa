import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {STORY_DRAFTS_606,STORIES_606_EN} from '../src/data/historias606.js';
import {ENGLISH_STORIES} from '../src/features/english/content.js';
import {TRANSLATED_STORIES,translatedEquivalent} from '../src/features/english/routes.js';
import {slugPublico} from '../src/domain/people/personPresentation.js';
import {storyEditorialIssues} from '../src/content/storyEditorialPolicy.js';
const ledger=JSON.parse(fs.readFileSync(new URL('../docs/editorial/historias-6.0.6.json',import.meta.url),'utf8'));

test('all nine planned stories are complete in both editions, with live chapter switches and known cast',()=>{
 assert.equal(STORY_DRAFTS_606.length,9);assert.equal(HISTORIAS.length,42);
 assert(!HISTORIAS.some(h=>!h.disponible||!h.pasos?.length));
 const ids=new Set(PERSONAS.map(p=>p.id));let count=0;
 for(const draft of STORY_DRAFTS_606){
  const es=HISTORIAS.find(s=>s.id===draft.id),en=STORIES_606_EN[draft.id].content,route=TRANSLATED_STORIES.find(r=>r.id===draft.id);
  assert(es.disponible&&en.disponible);assert(es.pasos.length>=6);assert.equal(es.pasos.length,en.pasos.length);assert.equal(route.chapters,es.pasos.length);assert.equal(route.es,slugPublico(es.titulo));
  assert(es.fuentes.length>=3);assert(es.fuentes.every(s=>s.url.startsWith('https:')&&s.localizador));
  for(const [i,step]of es.pasos.entries()){
   const translated=en.pasos[i];assert(step.texto.split(/\s+/).length>=60);assert(translated.texto.split(/\s+/).length>=60);
   assert.deepEqual(translated.personas,step.personas);assert.equal(translated.anio,step.anio);assert(step.fuentes.length);assert(step.fuentes.every(Boolean));
   for(const id of step.personas)assert(ids.has(id),`${draft.id}/${i+1}: ${id}`);
   assert.equal(translatedEquivalent(`/es/historia/${route.es}/capitulo/${i+1}`,'en'),`/en/story/${route.en}/chapter/${i+1}`);
  }
  for(const id of draft.related)assert(HISTORIAS.some(s=>s.id===id&&s.disponible));
  count+=es.pasos.length;
 }
 assert.equal(count,66);
});

test('the complete editorial ledger is applied in Spanish and English',()=>{
 assert(ledger.length>=100);
 for(const row of ledger){
  const es=HISTORIAS.find(s=>s.id===row.id),en=ENGLISH_STORIES[row.id];
  assert.equal(row.chapter?es.pasos[row.chapter-1][row.field]:es[row.field],row.es.after,`${row.id}/${row.chapter}/es`);
  assert.equal(row.chapter?en.chapters[row.chapter-1][row.field==='titulo'?0:1]:en[{titulo:'title',subtitulo:'subtitle',descripcion:'description'}[row.field]],row.en.after,`${row.id}/${row.chapter}/en`);
 }
 assert.deepEqual(storyEditorialIssues(HISTORIAS,ENGLISH_STORIES),[]);
});

test('editorial checks flag author instructions without rejecting historical negation or attributed analysis',()=>{
 const sample=text=>[{id:'sample',disponible:true,pasos:[{titulo:'Un episodio',texto:text}]}];
 const en={sample:{chapters:[['An episode','The king died without surviving children.']]}};
 assert(storyEditorialIssues(sample('Para leer sus títulos hay que distinguir varias autoridades.'),en).length);
 assert(storyEditorialIssues(sample('Nuestro recorrido termina aquí; la segunda conquista no debe colorearse retroactivamente.'),en).length);
 assert.deepEqual(storyEditorialIssues(sample('El rey murió sin descendencia. Las crónicas difieren sobre la fecha. Maquiavelo estudia las fortalezas en El príncipe.'),en),[]);
});
