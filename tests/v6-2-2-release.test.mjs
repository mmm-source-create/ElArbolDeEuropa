import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
import {PERSONAS} from '../src/data/personas.js';
import {V622_RECORDS} from '../src/content/v622/index.js';
import {contenidoPersona} from '../src/content/personas/index.js';
import {COMPLETE_ENGLISH_PROFILES} from '../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE,TRANSLATED_DYNASTIES} from '../src/features/english/routes.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {PORTRAITS_622_EN} from '../src/features/english/portraits622.js';
import {personClaims} from '../src/evidence/claims.js';
import {HISTORIA_DINASTIAS} from '../src/content/dinastias/index.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {ENGLISH_DYNASTIES} from '../src/features/english/entityTranslations.js';
import {governmentGroupsAt} from '../src/domain/government/governmentPresentation.js';
import {REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {swissConfederationAt,SWISS_CONFEDERATION_COLOR} from '../src/cartography/swissConfederation622.js';
import {englishSourceTitle} from '../src/features/english/v535Vocabulary.js';
import {mosaicAuthorityKind} from '../src/cartography/mosaicAuthorityKind.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const published=read('src/content/v622/manifest.json').newIds;

test('6.2.2 adds 39 people and expands three existing profiles in both languages',()=>{
 assert.equal(published.length,39);assert.equal(Object.keys(V622_RECORDS).length,42);
 for(const [id,r] of Object.entries(V622_RECORDS)){
  assert(people.has(id),id);assert.equal(r.parts.length,3,id);
  const es=contenidoPersona(id),en=COMPLETE_ENGLISH_PROFILES[id];
  assert(es.resumen.length>80&&es.biografia.length>900,id+' Spanish');
  assert(en.summary.length>80&&en.biography.length>900&&en.sections.length===3,id+' English');
  assert(r.refs.length>=1&&r.refs.every(f=>f.url.startsWith('https:')),id);
  assert(TRANSLATED_PEOPLE.some(p=>p.id===id),id);
  for(const field of ['Nacimiento','Fallecimiento'])assert(personClaims(people.get(id)).some(c=>c.field===field&&c.sources.length),id+' '+field);
 }
});
test('the six adult Farnese children use the correct mothers and reciprocal marriages',()=>{
 const second=['MARGMARIAFARNESIO','TERESAFARNESIO','ODOARDO2PRINCEFARN'],third=['ISABELLAFARNESIO1668','FRANCISCOFARNESIO','ANTONIOFARNESIO'];
 for(const id of [...second,...third])assert.equal(people.get(id).padre,'RANUCCIO2FARN');
 for(const id of second)assert.equal(people.get(id).madre,'ISABELLAESTEFARN');
 for(const id of third)assert.equal(people.get(id).madre,'MARIAESTEFARN');
 assert.deepEqual(people.get('RANUCCIO2FARN').conyuges,['MARGVIOLANTESAVOIA','ISABELLAESTEFARN','MARIAESTEFARN']);
 for(const id of published)for(const spouse of people.get(id).conyuges||[])assert(people.get(spouse).conyuges.includes(id),id+' '+spouse);
 assert(people.get('RANU1FARNESIO').nombre.startsWith('Ranuccio'));
 assert(people.get('RANUCCIO2FARN').nombre.startsWith('Ranuccio'));
 assert.equal(people.get('ISABELFARNESIO').nac,1692);assert.equal(people.get('ISABELLAFARNESIO1668').nac,1668);
});
test('the Bonaparte siblings connect through their parents and the Clary and Württemberg marriages',()=>{
 for(const id of ['NAPOLEON1','JOSEBONAPARTE','LUCIENBONAPARTE','ELISABONAPARTE','LUISBONAPARTE','PAULINABONAPARTE','CAROLINABONAPARTE','JERONIMOBONAPARTE']){
  assert.equal(people.get(id).padre,'CARLOBONAPARTE');assert.equal(people.get(id).madre,'LETIZIARAMOLINO');assert.equal(people.get(id).dinastia,'Bonaparte');
 }
 assert.equal(people.get('JULIECLARY').padre,people.get('DESIREECLARY').padre);
 assert.equal(people.get('CATALINAWURTTBONAPARTE').padre,'FREDERIC1WURTTKING');
 assert.equal(TRANSLATED_PEOPLE.find(p=>p.id==='FREDERIC1WURTTKING').en,'frederick-i-king-of-wurttemberg');
 assert.equal(people.get('FREDERIC1WURTTKING').nac,1754);assert.notEqual(people.get('FRED1WURTT').nac,1754);
 assert.equal(people.get('HUGHALBERTODONNELL').padre,'RORYODONNELL');
 assert(!people.get('LEOPOLDOODONNELL').padre,'No unsupported genealogy between the O’Donnell branches');
 assert.equal(people.get('BERNARDOOHIGGINS').padre,'AMBROSIOOHIGGINS');
});
test('portraits keep two approved exceptions and explicit attributions, without misidentified sitters',()=>{
 assert.deepEqual(Object.keys(V622_RECORDS).filter(id=>!IMAGENES_PERSONAS[id]).sort(),['MARGMARIAFARNESIO','TERESAFARNESIO']);
 for(const id of Object.keys(V622_RECORDS).filter(id=>IMAGENES_PERSONAS[id])){
  const image=IMAGENES_PERSONAS[id];assert(image.autor&&image.derechos&&image.fuenteUrl,id);assert(PORTRAITS_622_EN[id]?.autor,id);
  assert(fs.existsSync(new URL('../public'+image.archivo,import.meta.url)),id);
 }
 assert.match(IMAGENES_PERSONAS.RANUCCIO2FARN.autor,/Atribuido a Jacob Denys/);
 assert.match(IMAGENES_PERSONAS.HUGHALBERTODONNELL.autor,/Probablemente taller/);
 assert.match(IMAGENES_PERSONAS.ISABELLAFARNESIO1668.fuenteUrl,/complessopilotta/);
});
test('Bonaparte has complete bilingual history, a public route and credited imperial arms',()=>{
 const es=HISTORIA_DINASTIAS.Bonaparte,en=ENGLISH_DYNASTIES.find(d=>d.key==='Bonaparte');
 for(const key of ['resumen','origen','trayectoria','legado'])assert(es[key].length>100,key);
 for(const key of ['summary','origin','history','legacy'])assert(en[key].length>100,key);
 assert(TRANSLATED_DYNASTIES.some(d=>d.es==='bonaparte'&&d.en==='bonaparte'));
 const arms=escudoDe('Bonaparte');assert.match(arms.nota,/1804/);assert.equal(arms.imagen.autor,'Sodacan');assert.equal(arms.imagen.licencia,'CC BY-SA 3.0');
});
test('uncertain birth years and competing dates remain qualified at year precision',()=>{
 for(const id of ['HUGHALBERTODONNELL','ALEJANDROOREILLY','AMBROSIOOHIGGINS'])assert(people.get(id).nacAprox,id);
 for(const [id,field] of [['MARGALDOBRANDINIFARN','Nacimiento'],['MARIAFARNESIOESTE','Fallecimiento']]){
  const claim=personClaims(people.get(id)).find(c=>c.field===field);assert.equal(claim.certainty,'disputed');assert(claim.alternatives.length>=2);assert.equal(claim.exactDate,null);
 }
});
test('conquered Upper Navarre is Castilian yellow during Ferdinand’s last years; Aragon keeps its colour',()=>{
 for(const year of [1512,1515,1516]){
  const groups=governmentGroupsAt(people.get('FERN2ARAG'),year,{view:'panorama'});
  assert.equal(groups.find(g=>g.mandates.some(m=>m.territorio==='Navarra')).color,REINO_COLOR.Castilla);
  assert.notEqual(groups.find(g=>g.mandates.some(m=>m.territorio==='Aragón')).color,REINO_COLOR.Castilla);
 }
});
test('Swiss membership is dated and excludes associates and the bishopric of Basel',()=>{
 for(const [id,year]of [['Lucerna',1332],['Berna',1353],['Friburgo',1481],['Basilea',1501],['Appenzell',1513]]){
  assert.equal(swissConfederationAt(id,year-1),null,id);assert.equal(swissConfederationAt(id,year).color,SWISS_CONFEDERATION_COLOR,id);
 }
 for(const id of ['Valais','Tres Ligas','San Galo','Obispado de Basilea'])assert.equal(swissConfederationAt(id,1655),null,id);
 assert.equal(swissConfederationAt('Zúrich',1445),null);assert(swissConfederationAt('Zúrich',1450));
 assert.equal(swissConfederationAt('Berna',1798),null);
});
test('common-map tributary dots agree with the legend; fiefs and disputed control stay distinct',()=>{
 for(const type of ['tributario','vasallaje','protectorado'])assert.equal(mosaicAuthorityKind([{tributaryRelation:{type}}]),'tributary');
 assert.equal(mosaicAuthorityKind([{tributaryRelation:{type:'feudo'}}]),'apanage');assert.equal(mosaicAuthorityKind([{crownRelation:{}}]),'apanage');
 assert.equal(mosaicAuthorityKind([{tributaryRelation:{type:'tributario'}}],true),'disputed');
 assert.equal(mosaicAuthorityKind([{}]),'sovereign');
});
test('1655 mosaic groups actual Swiss cells while retaining the independent bishopric',()=>{
 const data=read('data/cartography/corridor-locations.json');data.burgundy=read('data/cartography/burgundian-locations.json');
 const m=europeMosaicAt(data,1655,PERSONAS),layers=[...m.byLocation.values()].flat();
 for(const id of ['Comunidad de Uri','Basilea','Berna','Condado de Baden suizo']){
  const selected=layers.filter(l=>l.entityId===id);assert(selected.length,id);assert(selected.every(l=>l.politicalGroup==='confederacion-suiza'&&l.mosaicColor===SWISS_CONFEDERATION_COLOR),id);
 }
 assert(layers.filter(l=>l.entityId==='Obispado de Basilea').every(l=>l.politicalGroup!=='confederacion-suiza'));
});
test('both generic share cards remain 1200×630 and their generator uses the 1655 map',async()=>{
 for(const lang of ['es','en']){const m=await sharp(new URL(`../public/brand/og-${lang}.jpg`,import.meta.url).pathname).metadata();assert.equal(m.width,1200);assert.equal(m.height,630);}
 const code=fs.readFileSync(new URL('../scripts/assets/og-card.mjs',import.meta.url),'utf8');assert(code.includes('mapa-1655-claro.webp'));assert(!code.includes('mapa-1500-claro.webp'));
});

test('new source descriptions are available in English alongside their documentary locators',()=>{
 assert.equal(englishSourceTitle('Treccani · Ranuccio II, hija Teresa'),'Treccani · Ranuccio II Farnese');
 assert.equal(englishSourceTitle('Real Academia Matritense de Heráldica y Genealogía · Descendencia de José Bonaparte'),'Royal Matritense Academy of Heraldry and Genealogy · Descendants of Joseph Bonaparte');
});

test('the 1515 common map joins Pamplona to Castile, retaining Aragon and Lower Navarre separately',()=>{
 const data=read('data/cartography/corridor-locations.json');data.burgundy=read('data/cartography/burgundian-locations.json');
 const m=europeMosaicAt(data,1515,PERSONAS),colour=id=>m.byLocation.get(id)?.[0].mosaicColor;
 assert(colour('Madrid'));assert.equal(colour('Pamplona'),colour('Madrid'));assert.notEqual(colour('Barcelona'),colour('Madrid'));assert.notEqual(colour('Saint_Jean_Pied_de_Port'),colour('Madrid'));
});
