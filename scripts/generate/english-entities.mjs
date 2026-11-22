import {englishCredit} from '../../src/features/english/imageCredits.js';
import {ROSES_CONNECTIONS,ROSES_RELATED_HOUSES} from '../../src/features/english/rosesHouseTranslations.js';
import {englishSourceTitle} from '../../src/features/english/v535Vocabulary.js';
import {HISTORIAS} from '../../src/data/historias.js';
import {slugPublico} from '../../src/domain/people/personPresentation.js';
import {ENGLISH_STORY_LABELS} from '../../src/features/english/storyLabels.js';
import {translatedEquivalent} from '../../src/features/english/routes.js';
import fs from 'node:fs/promises';
import {ENGLISH_DYNASTIES,ENGLISH_TERRITORIES} from '../../src/features/english/entityTranslations.js';
import {ENGLISH_NAMES,PROFILE_LABELS,translatedProfileText} from '../../src/features/english/profileVocabulary.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';
import {escudoDe} from '../../src/content/dinastias/escudos.js';
import {V6_STORIES} from '../../src/features/english/v6/index.js';
import {ENGLISH_TERRITORY_NOTES} from '../../src/features/english/territoryNotes616.js';
import {ENGLISH_TERRITORY_NOTES_622} from '../../src/features/english/territoryNotes622.js';
import {ENGLISH_TERRITORY_EVOLUTION} from '../../src/features/english/territoryEvolution617.js';
import {ENGLISH_UNION_TEXTS} from '../../src/features/english/territoryUnions618.js';
import {ENGLISH_SUCCESSION_TEXTS as SUCC,ENGLISH_SUCCESSION_MOTIVES,ENGLISH_SUCCESSION_DATE_TYPES} from '../../src/features/english/territorySuccession621.js';
// 6.0.21: explained successions, succession crises and linked events, translated by hand. A territory
// shows them only when every text has its English version.
const RANKS={reino:'kingdom',ducado:'duchy',principado:'principality',condado:'county','señorío':'lordship',archiducado:'archduchy',banato:'banate',imperio:'empire',gobierno:'government',electorado:'electorate',reinado:'kingdom',marquesado:'marquisate',gran_principado:'grand principality',zarato:'tsardom',voivodato:'voivodeship'};
const personLink=p=>({id:p.id,nombre:names[p.id]||p.nombre,path:translatedEquivalent(`/es/persona/${p.slug}`,'en')||`/es/persona/${p.slug}`});
const succession=(s,sources)=>{
 if(!s)return null;
 const texts=[...(s.relevos||[]).flatMap(r=>[r.explicacion,r.parentesco?.texto,...(r.fechas||[]).map(f=>f.nota)]),...(s.crisis||[]).flatMap(c=>[c.periodo,c.titulo,c.resumen,c.desenlace,...c.candidatos.flatMap(k=>[k.fundamento,k.resultado])])].filter(Boolean);
 if(!texts.every(t=>SUCC[t]))return null;
 return {
  relevos:(s.relevos||[]).map(r=>({id:r.id,territorio:r.territorio,crisis:r.crisis||null,motivos:r.motivos.map(m=>ENGLISH_SUCCESSION_MOTIVES[m]||m),explicacion:SUCC[r.explicacion],
   predecesor:{...r.predecesor,persona:personLink(r.predecesor.persona)},sucesor:{...r.sucesor,persona:personLink(r.sucesor.persona)},
   parentesco:{texto:SUCC[r.parentesco.texto],via:(r.parentesco.via||[]).map(personLink)},
   fechas:(r.fechas||[]).map(f=>({tipo:ENGLISH_SUCCESSION_DATE_TYPES[f.tipo]||f.tipo,anio:f.anio,nota:SUCC[f.nota]})),fuentes:sources(r.fuentes)})),
  crisis:(s.crisis||[]).map(c=>({id:c.id,periodo:SUCC[c.periodo],titulo:SUCC[c.titulo],resumen:SUCC[c.resumen],desenlace:SUCC[c.desenlace],fuentes:sources(c.fuentes),
   candidatos:c.candidatos.map(k=>({persona:personLink(k.persona),fundamento:SUCC[k.fundamento],resultado:SUCC[k.resultado],ascendencia:(k.ascendencia||[]).map(personLink)}))})),
 };
};
const entityName=t=>['Perche','Las dos Borgoñas','Borgoña y Países Bajos'].includes(t.key)?PROFILE_LABELS[t.key]:t.name;
const names={...ENGLISH_NAMES,...Object.fromEntries(Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,p])=>[id,p.name]))};
const term=t=>{if(!PROFILE_LABELS[t])throw Error(`Missing entity term: ${t}`);return PROFILE_LABELS[t];};
const card=(p,people)=>{if(!names[p.id])throw Error(`Missing entity person: ${p.id}`);const translated=people.find(t=>t.id===p.id);return {...p,nombre:names[p.id],role:translated?.role||(p.titulo?term(p.titulo):'Historical profile'),path:translated?.path||`/es/persona/${p.slug}`,sobrenombre:translated?.sobrenombre||'',aliases:translated?.aliases||[]};};
const government=(g,people,notes={})=>({...g,persona:card(g.persona,people),englishDynasty:PROFILE_LABELS[g.persona.dinastia]||null,englishTitle:term(g.titulo),englishTerritory:term(g.territorio),englishCondition:term(g.condicion),englishNote:g.nota?(notes[g.nota]||people.find(p=>p.id===g.persona.id)?.englishNotes?.[g.nota]||translatedProfileText(g.nota,names)):null});
export function englishEntityStory(h) {
 const story=HISTORIAS.find(s=>slugPublico(s.titulo)===h.slug);
 const title=story&&(ENGLISH_STORY_LABELS[story.id]?.[0]||V6_STORIES[story.id]?.content?.titulo);
 if(!title)throw Error(`Missing territory story translation: ${h.slug}`);
 const esPath=`/es/historia/${h.slug}`;
 return {...h,titulo:title,path:translatedEquivalent(esPath,'en')||esPath};
}
// Commons credits list contributors; only the connecting words were Spanish.
const englishArmsAuthor=author=>author&&author.replace(/ y colaboradores de Wikimedia Commons/,' and Wikimedia Commons contributors').replace(/, a partir de /g,', after ').replace(/\(versión de (\d{4}), restaurada en (\d{4})\)/,'(version of $1, restored in $2)').replace(/ y /g,' and ');
const sources=items=>(items||[]).map(f=>({...f,titulo:englishSourceTitle(f.titulo)}));
export async function englishEntityPages(people){
 const pages=[];
 for(const t of ENGLISH_DYNASTIES){
  const source=JSON.parse(await fs.readFile(`public/dinastias-meta/${t.es}.json`));
  const translatedSource=t.translatedSource||{};
  const arms=escudoDe(source.nombre);
  const branch=r=>{const sourceTranslation=(translatedSource.ramas||[]).find(item=>item.id===r.id)||{};const translation=t.connections?.[r.id]||ROSES_CONNECTIONS[r.id]||sourceTranslation;if(!Object.keys(translation).length)throw Error(`Translate new house connection: ${r.id}`);return ({...r,...sourceTranslation,...translation,fuentes:sources(r.fuentes),fundador:card(r.fundador,people),personas:r.personas.map(p=>card(p,people))});};
  const house=(h,field)=>{const sourceTranslation=(translatedSource[field]||[]).find(item=>item.nombre===h.nombre||item.key===h.nombre||item.slug===h.slug)||{};const summary=t.houses?.[h.nombre]??ROSES_RELATED_HOUSES[h.nombre]??sourceTranslation.resumen;if(summary===undefined)throw Error(`Translate related house: ${h.nombre}`);return ({...h,...sourceTranslation,key:h.nombre,nombre:term(h.nombre),resumen:summary,miembros:h.miembros.map(p=>card(p,people)),path:translatedEquivalent(`/es/dinastia/${h.slug}`,'en')||`/es/dinastia/${h.slug}`});};
  pages.push({...source,...translatedSource,type:'dynasty',path:`/en/dynasty/${t.en}`,esPath:`/es/dinastia/${t.es}`,key:source.nombre,fuentes:sources(source.fuentes),nombre:entityName(t),description:t.summary,resumen:t.summary,origen:t.origin,trayectoria:t.history,legado:t.legacy,editorial:true,
   miembros:source.miembros.map(p=>card(p,people)),protagonistas:source.protagonistas.map(p=>card(p,people)),gobiernos:source.gobiernos.map(g=>government(g,people)),territorios:source.territorios.map(key=>({key,name:term(key)})),ramas:source.ramas.map(branch),casasOrigen:source.casasOrigen.map(h=>house(h,'casasOrigen')),casasDerivadas:source.casasDerivadas.map(h=>house(h,'casasDerivadas')),casasConectadas:source.casasConectadas.map(h=>house(h,'casasConectadas')),
   arms:arms?.imagen?{tipo:arms.tipo,...arms.imagen,licencia:englishCredit(arms.imagen.licencia),autor:arms.imagen.en?.autor||englishArmsAuthor(arms.imagen.autor)||t.armsAuthor,blazon:arms.en?.blazon||t.blazon,note:arms.en?.note||t.armsNote,modifications:arms.imagen.en?.modifications||t.armsModifications||'A viewBox was added for responsive scaling; the drawing is unchanged.'}:null,
  });
 }
 for(const t of ENGLISH_TERRITORIES){
  const source=JSON.parse(await fs.readFile(`public/territorios-meta/${t.es}.json`));
  const translatedSource=t.translatedSource||{};
  for(const field of ['evolucion','uniones','eventos'])if(source[field]?.length&&!translatedSource[field]?.length)throw Error(`Translate new territory section: ${t.key}/${field}`);
  if((source.sucesiones?.relevos?.length||source.sucesiones?.crisis?.length)&&!translatedSource.sucesiones)throw Error(`Translate new succession: ${t.key}`);
  pages.push({...source,...translatedSource,type:'territory',path:`/en/territory/${t.en}`,esPath:`/es/territorio/${t.es}`,key:t.key,fuentes:sources(source.fuentes),nombre:entityName(t),description:t.summary,resumen:t.summary,
   gobiernos:source.gobiernos.map(g=>government(g,people,t.notes)),personas:source.personas.map(p=>{const translated=people.find(t=>t.id===p.id),summary=translated?.summary||t.people[p.id];if(p.resumen&&!summary)throw Error(`Missing territory biography: ${p.id}`);return {...card(p,people),resumen:summary};}),
   historias:(source.historias||[]).map(englishEntityStory),
   dinastias:source.dinastias.map(key=>({key,name:term(key)})),relacionados:source.relacionados.map(r=>({...r,nombre:term(r.nombre)})),
   // 6.0.16: reviewed notes, parent entities and components, as on the Spanish page.
   nota:ENGLISH_TERRITORY_NOTES[source.nota]||ENGLISH_TERRITORY_NOTES_622[source.nota]||null,naturaleza:source.naturaleza,
   // 6.0.17: hand-translated political evolution (all lines must be translated, or none is shown).
   // 6.0.18: hand-translated historical unions, shown only when every text has its English version.
   uniones:(source.uniones||[]).filter(u=>[u.titulo,u.resumen,u.instituciones,...u.etapas.flatMap(e=>[e.titulo,e.texto])].filter(Boolean).every(text=>ENGLISH_UNION_TEXTS[text])).map(u=>({id:u.id,desde:u.desde,hasta:u.hasta,
    titulo:ENGLISH_UNION_TEXTS[u.titulo],resumen:ENGLISH_UNION_TEXTS[u.resumen],instituciones:ENGLISH_UNION_TEXTS[u.instituciones],
    territorios:u.territorios.map(key=>({key,name:PROFILE_LABELS[key]||key})),fuentes:sources(u.fuentes),
    etapas:u.etapas.map(e=>({anio:e.anio,titulo:ENGLISH_UNION_TEXTS[e.titulo],texto:ENGLISH_UNION_TEXTS[e.texto],personas:(e.personas||[]).filter(p=>names[p.id]).map(p=>({id:p.id,nombre:names[p.id],path:translatedEquivalent(`/es/persona/${p.slug}`,'en')||`/es/persona/${p.slug}`}))}))})),
   evolucion:(source.evolucion||[]).every(e=>ENGLISH_TERRITORY_EVOLUTION[e.texto])?(source.evolucion||[]).map(e=>({anio:e.anio,texto:ENGLISH_TERRITORY_EVOLUTION[e.texto]})):[],
   pertenencias:(source.pertenencias||[]).filter(v=>PROFILE_LABELS[v.territorio]).map(v=>({key:v.territorio,name:PROFILE_LABELS[v.territorio],desde:v.desde})),
   componentes:(source.componentes||[]).filter(key=>PROFILE_LABELS[key]).map(key=>({key,name:PROFILE_LABELS[key]})),
   sucesiones:succession(source.sucesiones,sources),
   // 6.0.22: the rank of the territory over time, as on the Spanish page.
   etapas:(source.etapas||[]).map(e=>({desde:e.desde,clase:RANKS[e.clase]||(()=>{throw Error(`Missing rank: ${e.clase}`);})()})),
   eventos:(source.eventos||[]).every(e=>SUCC[e.titulo||e.nombre])?(source.eventos||[]).map(e=>({id:e.id,anio:e.anio||e.desde||e.fecha,titulo:SUCC[e.titulo||e.nombre]})):[],
  });
 }
 return pages;
}
