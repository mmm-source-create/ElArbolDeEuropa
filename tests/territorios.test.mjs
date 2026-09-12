import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TERRITORIOS,componentesDe,gobiernoEfectivo} from '../src/data/territorios.js';
import {auditarTerritorios} from '../src/data/auditTerritorios.js';
import {sucesionDe} from '../src/data/sucesion.js';
import {etiquetaClaseGobierno,slugPublico,textoBusquedaPersona,normalizarBusquedaPublica} from '../src/utils/personPresentation.js';
import {PERSONA_CONTENT} from '../src/content/personas/index.js';
import {FRONTERAS_V28} from '../src/content/personas/fronteras-v28.js';
const {PERSONAS}=await import('data:text/javascript;base64,'+fs.readFileSync(new URL('../src/personas.jsx',import.meta.url)).toString('base64'));
const by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
const gov=(territorio='Castilla',extra={})=>({territorio,titulo:'Rey',clase:'reinado',condicion:'efectivo',desde:1200,hasta:1250,...extra});
const sample=g=>[{id:'TEST',nombre:'Prueba',reinos:[g.territorio],gobiernos:[g]}];
const codes=rows=>auditarTerritorios(rows).map(i=>i.code);
test('cada gobierno migrado es explícito; el título personal no determina la clase',()=>{
 assert.equal(auditarTerritorios(PERSONAS).filter(i=>i.severity==='ERROR').length,0);
 assert.equal(etiquetaClaseGobierno({titulo:'Rey'},gov('Austria',{clase:'ducado',titulo:'Duque'})),'Ducado');
 assert.deepEqual(by.ENRIQCAR.gobiernos.map(g=>[g.territorio,g.titulo]),[['Carintia','Duque'],['Tirol','Conde'],['Bohemia','Rey'],['Bohemia','Rey']]);
 assert.equal(by.CARLOS5.gobiernos.find(g=>g.territorio==='Flandes').titulo,'Conde');
});
test('agrupaciones, títulos incompatibles y campos ausentes se rechazan',()=>{
 assert.ok(codes(sample(gov('España'))).includes('GROUP_GOVERNMENT'));
 assert.ok(codes(sample(gov('Carintia',{clase:'condado',titulo:'Conde'}))).includes('TERRITORY_CLASS_MISMATCH'));
 assert.ok(codes(sample(gov('Castilla',{titulo:'Duque'}))).includes('TITLE_CLASS_MISMATCH'));
 for(const f of ['titulo','clase','condicion','territorio'])assert.ok(codes(sample(gov('Castilla',{[f]:null}))).some(c=>c.endsWith('_MISSING')));
});
test('intervalos, duplicados y condiciones incompatibles se rechazan',()=>{
 assert.ok(codes(sample(gov('Castilla',{desde:1300,hasta:1200}))).includes('GOV_DATES'));
 assert.ok(codes([{...sample(gov())[0],gobiernos:[gov(),gov()]}]).includes('DUPLICATE_GOVERNMENT'));
 assert.ok(codes(sample(gov('Castilla',{condicion:'titular',efectivo:true}))).includes('CONDITION_CONTRADICTION'));
});
test('componentes desconocidos y ciclos se detectan sin recursión infinita',()=>{
 const c={A:{clase:'corona_compuesta',naturaleza:'compuesta',componentes:['B']},B:{clase:'reino',naturaleza:'entidad',componentes:['A','Missing']}};
 const issues=auditarTerritorios([],c);assert.ok(issues.some(i=>i.code==='COMPONENT_CYCLE'));assert.ok(issues.some(i=>i.code==='COMPONENT_UNKNOWN'));
 assert.ok(componentesDe('España').includes('León'));assert.ok(componentesDe('España').includes('Navarra'));
});
test('un solapamiento de soberanos no marcado produce advertencia; el año de relevo no',()=>{
 const p=[...sample(gov()),{id:'OTRO',nombre:'Otro',gobiernos:[gov('Castilla',{desde:1240,hasta:1260})]}];
 assert.ok(codes(p).includes('SUCCESSION_OVERLAP'));
 p[1].gobiernos[0].desde=1250;assert.ok(!codes(p).includes('SUCCESSION_OVERLAP'));
});
test('Sucesión mantiene mandatos separados y no presenta agrupaciones como reinos',()=>{
 const s=sucesionDe(PERSONAS,'Bohemia',{disputas:true}).filter(f=>f.persona.id==='ENRIQCAR');assert.equal(s.length,2);
 assert.ok(sucesionDe(PERSONAS,'España').every(f=>f.gobierno.territorio!=='España'));
 assert.equal(sucesionDe(PERSONAS,'Venecia').length,0);
 assert.ok(sucesionDe(PERSONAS,'Castilla',{disputas:true}).some(f=>f.persona.id==='JUANA1CAST'));
 assert.ok(!sucesionDe(PERSONAS,'Castilla').some(f=>f.persona.id==='JUANA1CAST'));
 for(const condicion of ['titular','pretensión','rival','disputado'])assert.equal(gobiernoEfectivo(gov('Castilla',{condicion})),false);
});
test('Castilla y León comparten monarca desde 1230 sin anticipar la unión',()=>{
 const fer=by.FERN3;assert.ok(fer);
 assert.equal(fer.gobiernos.find(g=>g.territorio==='Castilla').desde,1217);
 assert.equal(fer.gobiernos.find(g=>g.territorio==='León').desde,1230);
 assert.equal(TERRITORIOS['Corona de Castilla'].desde,1230);
});
test('biografías editoriales corresponden a personas reales de la base y alcanzan el objetivo',()=>{
 const ids=Object.keys(PERSONA_CONTENT);assert.ok(ids.length>=469);
 assert.deepEqual(ids.filter(id=>!by[id]),[]);
});
test('el catálogo tiene slugs únicos',()=>{
 const names=Object.keys(TERRITORIOS);assert.equal(new Set(names.map(slugPublico)).size,names.length);
});
test('Georgia distingue la unión oriental y sus ramas medievales',()=>{
 assert.equal(TERRITORIOS['Georgia y Cáucaso'].naturaleza,'agrupacion');
 assert.deepEqual(TERRITORIOS['Kartli-Kajetia'].componentes,['Kartli','Kajetia']);
 assert.equal(TERRITORIOS['Kartli-Kajetia'].desde,1762);
 assert.equal(by.DAVID6GEO.madre,'RUSUDANGEO');
 assert.equal(by.GIORGI5GEO.madre,'NATELAJAKELI');
 assert.equal(by.EUDOKIAPALEOTREB.padre,by.ANDRO2.padre);
 assert.ok(codes(sample(gov('Kartli-Kajetia',{desde:1700,hasta:1750}))).includes('GOV_BEFORE_ENTITY'));
 const series=sucesionDe(PERSONAS,'Kartli-Kajetia');
 assert.ok(series.some(f=>f.persona.id==='EREKLE2GEO'));
 assert.ok(series.every(f=>f.contextoDesde>=1762));
});
test('el condado de Tyrone y el señorío gaélico mantienen títulos distintos',()=>{
 const g=by.HUGHONEILL.gobiernos;
 assert.equal(g.find(r=>r.territorio==='Tír Eoghain').titulo,'Señor');
 assert.equal(g.find(r=>r.territorio==='Condado de Tyrone').titulo,'Conde');
 assert.equal(by.ISABELCLAREMAR.madre,'AOIFELEIN');
 assert.equal(by.ISABELLACLAREBRUS.madre,'ISABELMARSHAL');
});
test('las caídas cruzadas no prolongan una soberanía territorial efectiva',()=>{
 assert.ok(!sucesionDe(PERSONAS,'Antioquía').some(f=>f.gobierno.hasta>1268));
 assert.ok(sucesionDe(PERSONAS,'Antioquía',{disputas:true}).some(f=>f.gobierno.hasta>1268));
 assert.equal(by.HENRYANTIOCH.padre,'BOHEMOND4ANT');
 assert.equal(by.HUGH3CYPRUS.padre,'HENRYANTIOCH');
 assert.equal(by.GUYLUSIGNANJER.gobiernos.find(g=>g.territorio==='Chipre').titulo,'Señor');
});
test('voivodas, príncipes y gobernadores transilvanos no se confunden',()=>{
 const zap=by.JUAN1ZAPOLYA.gobiernos.find(g=>g.territorio==='Transilvania');
 assert.equal(zap.clase,'voivodato');assert.equal(zap.hasta,1526);
 assert.equal(by.CATHERINEBRANDTRANS.gobiernos[0].clase,'principado');
 assert.equal(by.MIHAIBRAVE.gobiernos.find(g=>g.territorio==='Transilvania').clase,'gobierno');
 const coexistencia=auditarTerritorios([by.ESTEBANBATHORY,by.CHRISTOPHERBATH]);
 assert.ok(!coexistencia.some(i=>i.code==='SUCCESSION_OVERLAP'));
});
test('las historias conservadas tienen referencias válidas y se retiran las cuatro rutas descartadas',async()=>{
 const {HISTORIAS,EVENTOS_HISTORICOS}=await import('data:text/javascript;base64,'+fs.readFileSync(new URL('../src/historiaData.jsx',import.meta.url)).toString('base64'));
 for(const list of [HISTORIAS,EVENTOS_HISTORICOS]){
  assert.ok(list.every(x=>x?.id));assert.equal(new Set(list.map(x=>x.id)).size,list.length);
 }
 const events=new Set(EVENTOS_HISTORICOS.map(e=>e.id));
 for(const id of ['georgia-entre-imperios','irlanda-coronas-linajes','antioquia-tripoli-chipre','transilvania-entre-coronas']){
  assert.ok(!HISTORIAS.some(h=>h.id===id));
 }
 for (const h of HISTORIAS) for (const p of h.pasos || []) { if(p.persona) assert.ok(by[p.persona]); if(p.eventoId) assert.ok(events.has(p.eventoId)); }
 assert.ok(HISTORIAS.find(h=>h.id==='reino-partido-dos').pasos.filter(p=>p.anio>=1300&&p.anio<1400).length>=6);
});
test('cada biografía tiene una sola definición editorial y no repite el mismo párrafo',async()=>{
 const dir=new URL('../src/content/personas/',import.meta.url),seen=new Set();
 for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.js')&&n!=='index.js')){
  const mod=await import(new URL(name,dir));
  for(const obj of Object.values(mod))for(const [id,c] of Object.entries(obj)){
   assert.ok(!seen.has(id),`Biografía duplicada: ${id}`);seen.add(id);
   assert.ok(!c.biografia||c.biografia!==c.resumen,`Párrafo repetido: ${id}`);
  }
 }
 assert.equal(seen.size,Object.keys(PERSONA_CONTENT).length);
});

test('la ampliación V2.8 incorpora personas distintas con biografía y parentescos existentes',()=>{
 assert.equal(new Set(PERSONAS.map(p=>p.id)).size,PERSONAS.length);
 assert.equal(Object.keys(FRONTERAS_V28).length,152);
 for(const [id,content] of Object.entries(FRONTERAS_V28)) {
  const p=by[id];assert.ok(p,id);assert.ok(content.biografia.length>120,id);
  for(const relative of [p.padre,p.madre,p.conyuge,p.conyuge2,...(p.conyuges||[])].filter(Boolean))assert.ok(by[relative],`${id}: ${relative}`);
 }
 assert.equal(by.ANACIPROSAB.padre,'JANUSCYPRUS');
 assert.equal(by.RITAARMENIA.padre,'LEO2CILICIA');
 assert.equal(by.JOANFITZDESMOND.padre,'JAMES11DESMOND');
});

test('los alias encuentran una ficha única sin convertir variantes de nombres en personas',()=>{
 for(const [query,id] of [['Giorgi XII','GIORGI12GEO'],['Caterina Cornaro','CATERINACORNARO'],['Zabel','ISABELLAARMQUEEN'],['Granuaile','GRACEOMALLEY'],['Owen Roe ONeill','OWENROEONEILL']]) {
  assert.ok(normalizarBusquedaPublica(textoBusquedaPersona(by[id])).includes(normalizarBusquedaPublica(query)),`${query} → ${id}`);
 }
 assert.equal(normalizarBusquedaPublica("O’Neill"),normalizarBusquedaPublica("O'Neill"));
 assert.equal(normalizarBusquedaPublica("O'Neill"),normalizarBusquedaPublica('ONeill'));
});

test('Armenia histórica, el reino cilicio y las pretensiones posteriores se distinguen',()=>{
 assert.equal(TERRITORIOS.Armenia.naturaleza,'agrupacion');
 assert.deepEqual(componentesDe('Armenia'),['Armenia cilicia']);
 assert.ok(codes(sample(gov('Armenia'))).includes('GROUP_GOVERNMENT'));
 assert.equal(by.LEO1CILICIA.gobiernos[0].clase,'principado');
 assert.equal(by.LEO1CILICIA.gobiernos[1].desde,1198);
 assert.ok(sucesionDe(PERSONAS,'Armenia cilicia').every(f=>f.gobierno.hasta<=1375));
 assert.ok(sucesionDe(PERSONAS,'Armenia cilicia',{disputas:true}).some(f=>f.persona.id==='JAMES1CYPRUS'&&f.gobierno.condicion==='titular'));
 assert.ok(!auditarTerritorios(PERSONAS).some(i=>i.severity==='ERROR'||i.severity==='WARN'));
});

test('Chipre conserva las restauraciones y la regencia final; Irlanda distingue señoríos y condados',()=>{
 const reigns=by.HENRY2CYPRUS.gobiernos.filter(g=>g.territorio==='Chipre');
 assert.deepEqual(reigns.map(g=>[g.desde,g.hasta,g.condicion]),[[1285,1306,'efectivo'],[1306,1310,'titular'],[1310,1324,'efectivo']]);
 assert.deepEqual(by.CATERINACORNARO.gobiernos.map(g=>g.clase),['regencia','reinado']);
 assert.equal(TERRITORIOS.Thomond.clase,'reino');
 assert.equal(TERRITORIOS['Condado de Thomond'].clase,'condado');
 assert.equal(TERRITORIOS['Vizcondado de Mayo'].clase,'vizcondado');
 assert.equal(by.OWENROEONEILL.padre,'ARTONEILL');
});
