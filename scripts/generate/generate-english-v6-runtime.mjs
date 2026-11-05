import fs from 'node:fs/promises';
import {V6_DYNASTIES,V6_LABELS,V6_NAMES,V6_NOTES,V6_PEOPLE,V6_PORTRAITS,V6_STORIES,V6_TERRITORIES} from '../../src/features/english/v6/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';

const profiles=Object.fromEntries(Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,profile])=>[id,{
 name:profile.name,
 role:profile.role,
 nickname:profile.nickname,
 aliases:profile.aliases,
 summary:profile.summary,
 governmentNotes:profile.governmentNotes,
}]));
const dynasties=V6_DYNASTIES.map(({key,es,en,name})=>({key,es,en,name}));
const territories=V6_TERRITORIES.map(({key,es,en,name})=>({key,es,en,name}));
const storyRoutes=Object.fromEntries(Object.entries(V6_STORIES).map(([id,entry])=>[id,{enSlug:entry.enSlug,esSlug:entry.content?.slug,esTitle:entry.content?.titulo,chapters:(entry.content?.pasos||[]).length}]));
const runtime={v6People:Object.fromEntries(Object.entries(V6_PEOPLE).map(([id,profile])=>[id,profile.name])),dynasties,territories,storyRoutes};
await Promise.all([
 fs.writeFile(new URL('../../src/generated/englishV6Runtime.json',import.meta.url),JSON.stringify(runtime)),
 fs.writeFile(new URL('../../src/generated/englishProfilesRuntime.json',import.meta.url),JSON.stringify({profiles})),
 fs.writeFile(new URL('../../src/generated/englishVocabularyRuntime.json',import.meta.url),JSON.stringify({names:V6_NAMES,labels:V6_LABELS,notes:V6_NOTES,portraits:V6_PORTRAITS})),
 fs.writeFile(new URL('../../src/generated/englishStoriesRuntime.json',import.meta.url),JSON.stringify({stories:V6_STORIES})),
]);
console.log(`English V6 runtime: ${Object.keys(profiles).length} complete people (${Object.keys(V6_PEOPLE).length} V6), ${dynasties.length} V6 dynasties, ${territories.length} V6 territories, ${Object.keys(V6_STORIES).length} V6 story entries.`);
