import fs from 'node:fs/promises';
import {ENGLISH_DYNASTIES,ENGLISH_TERRITORIES} from '../../src/features/english/entityTranslations.js';
import {ENGLISH_NAMES,PROFILE_LABELS,translatedProfileText} from '../../src/features/english/profileVocabulary.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';
import {escudoDe} from '../../src/content/dinastias/escudos.js';
const names={...ENGLISH_NAMES,...Object.fromEntries(Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,p])=>[id,p.name]))};
const term=t=>{if(!PROFILE_LABELS[t])throw Error(`Missing entity term: ${t}`);return PROFILE_LABELS[t];};
const card=(p,people)=>{if(!names[p.id])throw Error(`Missing entity person: ${p.id}`);const translated=people.find(t=>t.id===p.id);return {...p,nombre:names[p.id],role:translated?.role||(p.titulo?term(p.titulo):'Historical profile'),path:translated?.path||`/es/persona/${p.slug}`,sobrenombre:translated?.sobrenombre||'',aliases:translated?.aliases||[]};};
const government=(g,people,notes={})=>({...g,persona:card(g.persona,people),englishTitle:term(g.titulo),englishTerritory:term(g.territorio),englishCondition:term(g.condicion),englishNote:g.nota?(notes[g.nota]||people.find(p=>p.id===g.persona.id)?.englishNotes?.[g.nota]||translatedProfileText(g.nota,names)):null});
export async function englishEntityPages(people){
 const pages=[];
 for(const t of ENGLISH_DYNASTIES){
  const source=JSON.parse(await fs.readFile(`public/dinastias-meta/${t.es}.json`));
  const arms=escudoDe(t.key);
  const branch=r=>{if(r.id!=='anjou-hungria-capeta')throw Error(`Translate new house connection: ${r.id}`);return ({...r,etiqueta:'Cadet branch',periodo:t.branchPeriod,texto:t.branchText,fundador:card(r.fundador,people),personas:r.personas.map(p=>card(p,people))});};
  const house=h=>({...h,nombre:term(h.nombre),resumen:t.parentSummary,miembros:h.miembros.map(p=>card(p,people)),path:`/es/dinastia/${h.slug}`});
  pages.push({...source,type:'dynasty',path:`/en/dynasty/${t.en}`,esPath:`/es/dinastia/${t.es}`,key:t.key,nombre:t.name,description:t.summary,resumen:t.summary,origen:t.origin,trayectoria:t.history,legado:t.legacy,editorial:true,
   miembros:source.miembros.map(p=>card(p,people)),protagonistas:source.protagonistas.map(p=>card(p,people)),gobiernos:source.gobiernos.map(g=>government(g,people)),territorios:source.territorios.map(key=>({key,name:term(key)})),ramas:source.ramas.map(branch),casasOrigen:source.casasOrigen.map(house),casasDerivadas:source.casasDerivadas.map(house),casasConectadas:source.casasConectadas.map(house),
   arms:{...arms.imagen,autor:t.armsAuthor,blazon:t.blazon,note:t.armsNote,modifications:'A viewBox was added for responsive scaling; the drawing is unchanged.'},
  });
 }
 for(const t of ENGLISH_TERRITORIES){
  const source=JSON.parse(await fs.readFile(`public/territorios-meta/${t.es}.json`));
  // An untranslated new editorial section must not disappear silently.
  for(const field of ['evolucion','uniones','eventos','historias'])if(source[field]?.length)throw Error(`Translate new territory section: ${t.key}/${field}`);
  if(source.sucesiones?.relevos?.length||source.sucesiones?.crisis?.length)throw Error(`Translate new succession: ${t.key}`);
  pages.push({...source,type:'territory',path:`/en/territory/${t.en}`,esPath:`/es/territorio/${t.es}`,key:t.key,nombre:t.name,description:t.summary,resumen:t.summary,
   gobiernos:source.gobiernos.map(g=>government(g,people,t.notes)),personas:source.personas.map(p=>{const translated=people.find(t=>t.id===p.id),summary=translated?.summary||t.people[p.id];if(p.resumen&&!summary)throw Error(`Missing territory biography: ${p.id}`);return {...card(p,people),resumen:summary};}),
   dinastias:source.dinastias.map(key=>({key,name:term(key)})),relacionados:source.relacionados.map(r=>({...r,nombre:term(r.nombre)})),
  });
 }
 return pages;
}
