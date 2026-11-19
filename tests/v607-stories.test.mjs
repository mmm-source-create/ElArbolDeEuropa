import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIAS} from '../src/data/historias.js';
import {STORY_DRAFTS_607,STORIES_607_EN} from '../src/data/historias607.js';
import {ENGLISH_STORIES} from '../src/features/english/content.js';
import {TRANSLATED_STORIES,translatedEquivalent} from '../src/features/english/routes.js';
import {slugPublico} from '../src/domain/people/personPresentation.js';
import {storyEditorialIssues} from '../src/content/storyEditorialPolicy.js';

test('the Kościuszko and Gustavus Adolphus stories are complete in both editions',()=>{
 assert.deepEqual(STORY_DRAFTS_607.map(s=>s.id),['kosciuszko-polonia-ocupada','gustavo-adolfo']);
 const ids=new Set(PERSONAS.map(p=>p.id));
 for(const draft of STORY_DRAFTS_607){
  const es=HISTORIAS.find(s=>s.id===draft.id),en=STORIES_607_EN[draft.id].content,route=TRANSLATED_STORIES.find(r=>r.id===draft.id);
  assert(es.disponible&&en.disponible);assert.equal(es.pasos.length,9);assert.equal(en.pasos.length,9);
  assert.equal(route.chapters,9);assert.equal(route.es,slugPublico(es.titulo));assert.equal(route.en,draft.enSlug);
  assert(es.fuentes.length>=3&&es.fuentes.every(s=>s.url.startsWith('https:')&&s.localizador));
  for(const [i,step] of es.pasos.entries()){
   assert(step.texto.split(/\s+/).length>=60,`${draft.id}/${i+1} es`);assert(en.pasos[i].texto.split(/\s+/).length>=60,`${draft.id}/${i+1} en`);
   assert.deepEqual(en.pasos[i].personas,step.personas);assert(step.fuentes.length&&step.fuentes.every(Boolean));
   for(const id of step.personas)assert(ids.has(id),`${draft.id}/${i+1}: ${id}`);
   assert.equal(translatedEquivalent(`/es/historia/${route.es}/capitulo/${i+1}`,'en'),`/en/story/${route.en}/chapter/${i+1}`);
  }
  for(const id of draft.related)assert(HISTORIAS.some(s=>s.id===id&&s.disponible),id);
 }
 assert.deepEqual(storyEditorialIssues(HISTORIAS.filter(s=>STORY_DRAFTS_607.some(d=>d.id===s.id)),ENGLISH_STORIES),[]);
});

test('the protagonists lead the opening chapters',()=>{
 assert.equal(HISTORIAS.find(s=>s.id==='kosciuszko-polonia-ocupada').pasos[0].persona,'TADEUSZKOSCIUSZKO');
 assert.equal(HISTORIAS.find(s=>s.id==='gustavo-adolfo').pasos[0].persona,'GUSTAV2ADOLFO');
});
