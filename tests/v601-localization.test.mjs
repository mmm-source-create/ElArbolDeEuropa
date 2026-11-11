import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {applyEnglishPersonPresentation} from '../src/features/english/v6/atlasPresentation.js';
import {PROFILE_NOTES} from '../src/features/english/profileVocabulary.js';
import {englishLabel} from '../src/features/english/presentationLabels.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../src/features/english/profilePortraits.js';
import {englishCredit,localizedPortrait} from '../src/features/english/imageCredits.js';
import {CATEGORIAS_TITULO,FILTROS_RELACION} from '../src/features/atlas/atlasModel.js';
import {FILTER_REGIONS} from '../src/domain/filters/filterRegions.js';
import {challengeText} from '../src/features/desafio/challengeI18n.js';
import {homeSearchResults} from '../src/features/public/homeSearch.js';

test('Atlas presentation shares documentary vocabulary and retains original names for search only',()=>{
 const people=[{id:'CARLOS5',nombre:'Carlos V',aliases:['Carlos I de España']},{id:'ISAB1CAST',nombre:'Isabel I de Castilla'}];
 applyEnglishPersonPresentation(people);
 assert.equal(people[0].nombre,'Charles V');
 assert(people[0].searchAliases.includes('Carlos V'));
 assert(!people[0].aliases.includes('Carlos V'));
 for(const person of people){assert.equal(Object.getPrototypeOf(person.englishNotes)===PROFILE_NOTES||person.englishNotes===PROFILE_NOTES,true);const notes=person.englishNotes;applyEnglishPersonPresentation(people);assert.equal(person.englishNotes,notes);}
});
test('all filter role, relationship, region and catalogue labels have English presentation',()=>{
 const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url)));
 const people=read('../public/english-meta/people.json').people;
 const labels=[...CATEGORIAS_TITULO,...FILTROS_RELACION].map(item=>item.label).concat(FILTER_REGIONS,people.map(p=>p.papel));
 for(const value of new Set(labels))assert.notEqual(englishLabel(value),value,value);
});
test('English credits require a real image, preserve attribution uncertainty, and translate rights',()=>{
 assert.equal(localizedPortrait('missing',undefined,{}),null);
 assert.equal(localizedPortrait('missing',{},{}),null);
 for(const [id,image]of Object.entries(IMAGENES_PERSONAS)){
  const portrait=localizedPortrait(id,image,ENGLISH_PROFILE_PORTRAITS);
  assert.equal(portrait.archivo,image.archivo);
  for(const field of ['tipo','autor','fecha','derechos'])assert.doesNotMatch(portrait[field]||'',/\b(?:Dominio público|siglo|Anónimo|Taller de|Atribuido a|Autor desconocido)\b/i,`${id}/${field}`);
 }
 assert.equal(englishCredit('Identificación y autoría discutidas'),'Disputed identification and attribution');
});
test('English catalogues preserve Spanish filter data, counts, member links and editorial state',()=>{
 const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url)));
 const spanish=read('../public/catalogos/personas.json').items,english=read('../public/english-meta/people.json').people;
 assert.equal(english.length,spanish.length);
 const byId=new Map(spanish.map(p=>[p.id,p]));
 for(const p of english){const source=byId.get(p.id);for(const field of ['siglo','papel','region','relevancia'])assert.equal(p[field],source[field],`${p.id}/${field}`);assert(p.path.startsWith('/en/'));}
 for(const [es,en]of [['dinastias','dynasties'],['territorios','territories']]){
  const source=read(`../public/catalogos/${es}.json`).items,items=read(`../public/english-meta/${en}.json`)[en];
  assert.equal(items.length,source.length);
  for(const p of items){const original=source.find(item=>item.slug===p.slug);assert(original,p.nombre);assert.equal(p.total,original.total);assert.equal(p.editorial,original.editorial??false);assert(p.path.startsWith('/en/'));for(const member of p.miembros)assert(member.path.startsWith('/en/'));}
 }
 assert(readFileSync(new URL('../public/english-meta/home.json',import.meta.url)).length<60_000);
});
test('search preserves native name variants and difficulty levels are translated',()=>{
 const item={name:'John of Bohemia',path:'/en/person/john-of-bohemia',searchAliases:['Juan de Bohemia']};
 assert.equal(homeSearchResults([item],'Juan')[0],item);
 for(const level of ['Fácil','Intermedio','Difícil','Experto'])assert.notEqual(challengeText(level,'en'),level);
});

test('all timeline events have English titles and descriptions, with unchanged historical IDs',async()=>{
 const {EVENTOS_HISTORICOS}=await import('../src/data/historias.js');
 const {TIMELINE_TITLES}=await import('../src/features/english/timelineTranslations.js');
 const {englishNote}=await import('../src/features/english/v6/atlasPresentation.js');
 for(const event of EVENTOS_HISTORICOS){assert.equal(englishLabel(event.titulo),TIMELINE_TITLES[event.id]);if(event.descripcion)assert.notEqual(englishNote(event.descripcion),event.descripcion,event.id);}
});
test('display repairs preserve every published route and native search variant',async()=>{
 const {repairEnglishPresentation,englishNameText}=await import('../src/features/english/nameCorrections.js');
 assert.equal(englishNameText('Mindaugas'),'Mindaugas');
 const input={nombre:'Section 3',path:'/en/person/section-3',slug:'person-section-3',esPath:'/es/persona/jacobo-iii-de-escocia',searchAliases:['Jacobo III de Escocia']};
 const output=repairEnglishPresentation(input);
 assert.equal(output.nombre,'James III of Scotland');
 for(const key of ['path','slug','esPath','searchAliases'])assert.deepEqual(output[key],input[key]);
});
