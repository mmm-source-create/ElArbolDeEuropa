import fs from 'node:fs/promises';
import {V6_DYNASTIES,V6_PEOPLE,V6_READY,V6_STATUSES,V6_STORIES,V6_TERRITORIES} from '../../src/features/english/v6/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';
import {ENGLISH_DYNASTIES,ENGLISH_TERRITORIES} from '../../src/features/english/entityTranslations.js';
import {TRANSLATED_STORIES,englishPaths} from '../../src/features/english/routes.js';

const manifest=JSON.parse(await fs.readFile(new URL('../../docs/v6/manifest.json',import.meta.url),'utf8'));
const errors=[];
const same=(actual,expected,label)=>{
  const a=[...actual].sort(),e=[...expected].sort();
  if(a.length!==e.length||a.some((value,index)=>value!==e[index])){
    const missing=e.filter(value=>!a.includes(value));
    const extra=a.filter(value=>!e.includes(value));
    errors.push(`${label}: expected ${e.length}, received ${a.length}; missing ${missing.slice(0,8).join(', ')||'none'}; extra ${extra.slice(0,8).join(', ')||'none'}`);
  }
};
const nonempty=(value,label)=>{if(typeof value!=='string'||!value.trim())errors.push(`${label}: missing English text`);};
const itemKey=item=>item?.es;
const BROKEN_ENGLISH=[
  /without a seed/i,/\bhappened to (?:his|her|their)\b/i,/\bvasalage\b/i,/\bduchies agreed\b/i,
  /\bcondom house\b/i,/\bherdress\b/i,/\bHabsburgese\b/i,/\bJacuba\b/i,/\bnew headline\b/i,
  /principals from the Netherlands/i,/\bstatuder\b/i,/\bTitleus\b/i,/\boutlying secret\b/i,
  /\bKilling of Kalmar\b/i,/\bviscision\b/i,/\bconnal\b/i,/\bindivise\b/i,/\bcourtian\b/i,
  /\bsignage\b/i,/without confusion/i,/offspring were an unoffspring/i,/pounding his way/i,
  /have been interviewing with/i,/\bpatron saint of the Renaissance\b/i,
];
const SPANISH_PROSE=/\b(?:el|la|los|las|que|fue|murió|nació|reino|rey|reina|duque|duquesa|conde|condesa|hijo|hija|señor|señora|casó|sucesión|gobierno|territorio)\b/giu;
const auditEnglishText=(value,label)=>{
  if(typeof value==='string'){
    for(const pattern of BROKEN_ENGLISH)if(pattern.test(value)){errors.push(`${label}: known degraded-English pattern ${pattern}`);break;}
    if(value.length>=80&&(value.match(SPANISH_PROSE)||[]).length>=5)errors.push(`${label}: likely untranslated Spanish prose`);
    return;
  }
  if(Array.isArray(value)){value.forEach((item,index)=>auditEnglishText(item,`${label}[${index}]`));return;}
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))auditEnglishText(item,`${label}.${key}`);
};

for(const batch of manifest.batches){
  const root=new URL(`../../src/features/english/v6/batch-${batch.batch}/`,import.meta.url);
  const read=async name=>JSON.parse(await fs.readFile(new URL(`${name}.json`,root),'utf8'));
  const [people,names,labels,notes,portraits,dynasties,territories,stories,status]=await Promise.all(['people','names','labels','notes','portraits','dynasties','territories','stories','status'].map(read));
  if(status.ready!==true)errors.push(`batch ${batch.batch}: status is not ready`);
  if(status.batch!==batch.batch)errors.push(`batch ${batch.batch}: status.batch is ${status.batch}`);
  if(status.missing?.length)errors.push(`batch ${batch.batch}: ${status.missing.length} missing items reported`);
  same(Object.keys(people),batch.people,`batch ${batch.batch} people`);
  same(dynasties.map(itemKey),batch.dynasties,`batch ${batch.batch} dynasties`);
  same(territories.map(itemKey),batch.territories,`batch ${batch.batch} territories`);
  same(Object.keys(stories),[...batch.stories,...batch.plannedStories],`batch ${batch.batch} stories`);
  for(const id of batch.people){const profile=people[id];if(!profile)continue;nonempty(profile.name,`${id}.name`);nonempty(profile.role,`${id}.role`);nonempty(profile.summary,`${id}.summary`);if(profile.sections&&!Array.isArray(profile.sections))errors.push(`${id}.sections: expected array`);}
  for(const entity of dynasties){nonempty(entity.en,`${entity.key}.en`);nonempty(entity.name,`${entity.key}.name`);if(!entity.translatedSource||typeof entity.translatedSource!=='object')errors.push(`${entity.key}: missing translatedSource`);}
  for(const entity of territories){nonempty(entity.en,`${entity.key}.en`);nonempty(entity.name,`${entity.key}.name`);if(!entity.translatedSource||typeof entity.translatedSource!=='object')errors.push(`${entity.key}: missing translatedSource`);}
  for(const id of batch.stories){const story=stories[id];if(!story?.content?.pasos?.length)errors.push(`${id}: complete story has no translated chapters`);nonempty(story?.enSlug,`${id}.enSlug`);}
  for(const id of batch.plannedStories){const story=stories[id];if(!story)continue;if(story.content?.pasos?.length)errors.push(`${id}: planned story unexpectedly has chapters`);nonempty(story.enSlug,`${id}.enSlug`);}
  auditEnglishText({people,names,labels,notes,portraits,dynasties,territories,stories},`batch ${batch.batch}`);
}

const unique=(values,label)=>{const seen=new Set();for(const value of values){if(!value)errors.push(`${label}: empty value`);else if(seen.has(value))errors.push(`${label}: duplicate ${value}`);else seen.add(value);}};
if(!V6_READY)errors.push('central V6 readiness is false');
if(Object.keys(V6_PEOPLE).length!==2096)errors.push(`pending people total: ${Object.keys(V6_PEOPLE).length}/2096`);
if(V6_DYNASTIES.length!==493)errors.push(`pending dynasties total: ${V6_DYNASTIES.length}/493`);
if(V6_TERRITORIES.length!==1040)errors.push(`pending territories total: ${V6_TERRITORIES.length}/1040`);
if(Object.keys(V6_STORIES).length!==38)errors.push(`pending story entries total: ${Object.keys(V6_STORIES).length}/38`);
if(Object.keys(COMPLETE_ENGLISH_PROFILES).length!==2777)errors.push(`complete people total: ${Object.keys(COMPLETE_ENGLISH_PROFILES).length}/2777`);
if(ENGLISH_DYNASTIES.length!==521)errors.push(`complete dynasties total: ${ENGLISH_DYNASTIES.length}/521`);
if(ENGLISH_TERRITORIES.length!==1041)errors.push(`complete territories total: ${ENGLISH_TERRITORIES.length}/1041`);
if(TRANSLATED_STORIES.filter(story=>story.chapters>0).length!==33)errors.push(`complete stories total: ${TRANSLATED_STORIES.filter(story=>story.chapters>0).length}/33`);
if(TRANSLATED_STORIES.filter(story=>story.chapters===0).length!==9)errors.push(`planned story cards total: ${TRANSLATED_STORIES.filter(story=>story.chapters===0).length}/9`);
unique(V6_DYNASTIES.map(item=>item.en),'dynasty slugs');
unique(V6_TERRITORIES.map(item=>item.en),'territory slugs');
unique(Object.values(V6_STORIES).map(item=>item.enSlug),'story slugs');
unique(englishPaths(),'English paths');

const summary={ready:V6_READY,batches:V6_STATUSES.map(status=>({batch:status.batch,ready:status.ready,missing:status.missing?.length||0})),people:Object.keys(COMPLETE_ENGLISH_PROFILES).length,dynasties:ENGLISH_DYNASTIES.length,territories:ENGLISH_TERRITORIES.length,completeStories:TRANSLATED_STORIES.filter(story=>story.chapters>0).length,plannedStories:TRANSLATED_STORIES.filter(story=>story.chapters===0).length,paths:englishPaths().length,errors:errors.length};
console.log(JSON.stringify(summary,null,2));
if(errors.length){for(const error of errors)console.error(`- ${error}`);process.exitCode=1;}
