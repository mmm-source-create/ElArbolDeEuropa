import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import path from 'node:path';
import {TRANSLATED_STORIES} from '../../src/features/english/routes.js';
import {repairEnglishPresentation} from '../../src/features/english/nameCorrections.js';
import fs from 'node:fs/promises';
import {HISTORIAS} from '../../src/data/historias.js';
import {STORY_DRAFTS_606} from '../../src/data/historias606.js';
import {ENGLISH_STORIES} from '../../src/features/english/content.js';
import {storyEditorialIssues} from '../../src/content/storyEditorialPolicy.js';
const ledger=JSON.parse(await fs.readFile('docs/editorial/historias-6.0.6.json','utf8'));
const errors=storyEditorialIssues(HISTORIAS,ENGLISH_STORIES);
for(const row of ledger){
 const es=HISTORIAS.find(s=>s.id===row.id),en=ENGLISH_STORIES[row.id];
 const a=row.chapter?es.pasos[row.chapter-1][row.field]:es[row.field];
 const b=row.chapter?en.chapters[row.chapter-1][row.field==='titulo'?0:1]:en[{titulo:'title',subtitulo:'subtitle',descripcion:'description'}[row.field]];
 if(a!==row.es.after||b!==row.en.after)errors.push({id:row.id,chapter:row.chapter,field:row.field,code:'review-not-applied'});
}
let builtPages=0;
if(process.argv.includes('--built')){
 for(const story of HISTORIAS.filter(s=>s.disponible)){
  const route=TRANSLATED_STORIES.find(r=>r.id===story.id),translation=repairEnglishPresentation(ENGLISH_STORIES[story.id]);
  for(const locale of ['es','en']){
   const root=locale==='es'?`/es/historia/${route.es}`:`/en/story/${route.en}`;
   for(let chapter=0;chapter<=story.pasos.length;chapter++){
    const suffix=chapter?`/${locale==='es'?'capitulo':'chapter'}/${chapter}`:'';
    const title=chapter?(locale==='es'?story.pasos[chapter-1].titulo:translation.chapters[chapter-1][0]):locale==='es'?story.titulo:translation.title;
    const page=root+suffix;
    try{
     const html=await fs.readFile(path.join('dist',page,'index.html'),'utf8');builtPages++;
     if(!html.includes(renderToStaticMarkup(React.createElement('h1',null,title))))errors.push({id:story.id,locale,chapter,code:'built-title-mismatch'});
     if(chapter){const text=locale==='es'?story.pasos[chapter-1].texto:translation.chapters[chapter-1][1];if(!html.includes(renderToStaticMarkup(React.createElement('p',{className:'story-text'},text))))errors.push({id:story.id,locale,chapter,code:'built-text-mismatch'});}
    }catch(error){errors.push({id:story.id,locale,chapter,code:'missing-built-page',message:error.message});}
   }
  }
 }
}
const report={version:'6.0.6',stories:HISTORIAS.length,completeStories:HISTORIAS.filter(s=>s.disponible&&s.pasos?.length).length,plannedStories:HISTORIAS.filter(s=>!s.disponible||!s.pasos?.length).length,chapters:HISTORIAS.reduce((n,s)=>n+(s.pasos?.length||0),0),newStories:STORY_DRAFTS_606.length,newChapters:STORY_DRAFTS_606.reduce((n,s)=>n+s.chapters.length,0),reviewedLocations:ledger.length,...(builtPages?{builtPages}:{}),localizedChanges:ledger.reduce((n,r)=>n+['es','en'].filter(lang=>r[lang].before!==r[lang].after).length,0),errors};
if(process.argv.includes('--publish'))await fs.writeFile('docs/editorial/historias-6.0.6-verificacion.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
