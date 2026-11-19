import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORIAS} from '../src/data/historias.js';
import {STORY_FOCUS_607} from '../src/data/storyFocus607.js';

test('each refocused chapter centres a person already named in that chapter',()=>{
 for(const [id,chapters] of Object.entries(STORY_FOCUS_607)) {
  const story=HISTORIAS.find(h=>h.id===id);assert(story?.pasos,id);
  for(const [chapter,person] of Object.entries(chapters)) {
   assert(Number(chapter)>1,`${id}: the opening chapter keeps its focus`);
   const step=story.pasos[chapter-1];
   assert.equal(step.persona,person,`${id}/${chapter}`);
   assert.equal(step.personas[0],person,`${id}/${chapter}`);
  }
 }
});

test('the Archduke Charles leads the settlement chapter of the Spanish succession',()=>{
 const story=HISTORIAS.find(h=>h.id==='ultimo-austria');
 const foci=new Set(story.pasos.map(s=>s.persona));
 for(const id of ['CARLOS2ESP','FEL5ESP','CARLOS6HRE','LUIS14FRA','MARIANAAUSTESP'])assert(foci.has(id),id);
 assert.equal(story.pasos.at(-1).persona,'CARLOS6HRE');
});
