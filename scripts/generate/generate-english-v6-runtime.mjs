import {V603_PROFILES} from '../../src/content/v603People.js';
import {V602_PROFILES} from '../../src/features/english/v602Profiles.js';
import {TIMELINE_TITLES,TIMELINE_DESCRIPTIONS} from '../../src/features/english/timelineTranslations.js';
import {slugPublico} from '../../src/domain/people/personLabels.js';
import {HISTORIAS,EVENTOS_HISTORICOS} from '../../src/data/historias.js';
import {repairEnglishPresentation,englishNameText} from '../../src/features/english/nameCorrections.js';
import {englishAliases} from '../../src/features/english/aliasTranslations.js';
import fs from 'node:fs/promises';
import {V6_DYNASTIES,V6_LABELS,V6_NAMES,V6_NOTES,V6_PEOPLE,V6_PORTRAITS,V6_STORIES,V6_TERRITORIES} from '../../src/features/english/v6/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';

const profiles=Object.fromEntries(Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,profile])=>[id,{
 name:englishNameText(profile.name),
 slugName:profile.name,
 role:profile.role,
 nickname:profile.nickname,
 aliases:englishAliases(profile.aliases).map(englishNameText),
 summary:englishNameText(profile.summary),
 governmentNotes:profile.governmentNotes,
}]));
const dynasties=V6_DYNASTIES.map(({key,es,en,name})=>({key,es,en,name}));
const territories=V6_TERRITORIES.map(({key,es,en,name})=>({key,es,en,name}));
const storyRoutes=Object.fromEntries(Object.entries(V6_STORIES).map(([id,entry])=>[id,{enSlug:entry.enSlug,esSlug:slugPublico(HISTORIAS.find(story=>story.id===id)?.titulo||entry.content?.slug||id),esTitle:HISTORIAS.find(story=>story.id===id)?.titulo,chapters:(entry.content?.pasos||[]).length}]));
const timelineLabels=Object.fromEntries(EVENTOS_HISTORICOS.map(event=>{if(!TIMELINE_TITLES[event.id])throw Error(`Missing English event title: ${event.id}`);return [event.titulo,TIMELINE_TITLES[event.id]];}));
const timelineNotes=Object.fromEntries(EVENTOS_HISTORICOS.filter(event=>TIMELINE_DESCRIPTIONS[event.id]).map(event=>[event.descripcion,TIMELINE_DESCRIPTIONS[event.id]]));
const runtime={additionalPeople:Object.fromEntries(Object.entries({...V602_PROFILES,...Object.fromEntries(['FRANCESCOSALVIATIARC','RODRIGOCALDERON','CRISTOBALSANDOVALUCEDA'].map(id=>[id,V603_PROFILES[id]]))}).filter(([id])=>!Object.hasOwn(V6_PEOPLE,id)).map(([id,p])=>[id,p.name])),v6People:Object.fromEntries(Object.entries(V6_PEOPLE).map(([id,profile])=>[id,profile.name])),dynasties,territories,storyRoutes};
await fs.mkdir(new URL('../../src/generated/',import.meta.url),{recursive:true});
await Promise.all([
 fs.writeFile(new URL('../../src/generated/englishV6Runtime.json',import.meta.url),JSON.stringify(runtime)),
 fs.writeFile(new URL('../../src/generated/englishProfilesRuntime.json',import.meta.url),JSON.stringify({profiles})),
 fs.writeFile(new URL('../../src/generated/englishVocabularyRuntime.json',import.meta.url),JSON.stringify({names:V6_NAMES,labels:V6_LABELS,notes:V6_NOTES,portraits:V6_PORTRAITS,timelineLabels,timelineNotes})),
 fs.writeFile(new URL('../../src/generated/englishStoriesRuntime.json',import.meta.url),JSON.stringify({stories:V6_STORIES})),
]);
console.log(`English V6 runtime: ${Object.keys(profiles).length} complete people (${Object.keys(V6_PEOPLE).length} V6), ${dynasties.length} V6 dynasties, ${territories.length} V6 territories, ${Object.keys(V6_STORIES).length} V6 story entries.`);

// Keep label-only consumers independent of profiles, notes and image credits.
const {PROFILE_LABELS}=await import('../../src/features/english/profileVocabulary.js');
await fs.writeFile(new URL('../../src/generated/englishLabelsRuntime.json',import.meta.url),JSON.stringify(PROFILE_LABELS));

const {ENGLISH_STORIES}=await import('../../src/features/english/content.js');
await fs.writeFile(new URL('../../src/generated/englishStoryContentRuntime.json',import.meta.url),JSON.stringify({stories:repairEnglishPresentation(ENGLISH_STORIES)}));
