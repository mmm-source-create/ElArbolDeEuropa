// Specific passage locators: authority dates do not certify entire biographies.
import fs from 'node:fs';
import {PERSONAS} from '../../../src/data/personas.js';
const content=Object.assign({},...['farnese','bonaparte','irish'].map(n=>JSON.parse(fs.readFileSync(`src/content/v622/${n}.json`))));
const authority=JSON.parse(fs.readFileSync('src/content/v622/authority.json'));
const out={};
const add=(id,suffix,sources,certainty='documented',note='',noteEn='')=>out[`person:${id}:${suffix}`]={reviewedAt:'2026-11-25',editor:'El Árbol de Europa',certainty,sources,note,noteEn};
const source=(ref,locator,locatorEn)=>({title:ref.titulo,url:ref.url,locator,locatorEn});
const dbi=content.RANUCCIO2FARN.refs[0];
const specialVitals={
 TERESAFARNESIO:[content.TERESAFARNESIO.refs.at(-1),'Personenregister: Parma, Teresa Farnese von; 1665–1702.','Person register: Parma, Teresa Farnese von; 1665–1702.'],
 MARGMARIAFARNESIO:[content.MARGMARIAFARNESIO.refs[1],'Entrada FARNESE MARGHERITA MARIA: 1664–1718.','FARNESE MARGHERITA MARIA entry: 1664–1718.'],
 ISABELLAFARNESIO1668:[content.FRANCISCOFARNESIO.refs[1],'Entrada FARNESE ISABELLA FRANCESCA MARIA: 1668–1718.','FARNESE ISABELLA FRANCESCA MARIA entry: 1668–1718.'],
 MARIAESTEFARN:[content.MARIAESTEFARN.refs.at(-1),'Catálogo de 2024, n.º 14: cuaderno manuscrito de Maria d’Este (1644–1684).','2024 catalogue, no. 14: manuscript notebook of Maria d’Este (1644–1684).'],
 ISABELLAESTEFARN:[content.ISABELLAESTEFARN.refs[1],'Capítulo 4.A, hijos de Francesco I y Maria Caterina Farnese: Isabella (1635–1666).','Chapter 4.A, children of Francesco I and Maria Caterina Farnese: Isabella (1635–1666).'],
 FRANCOISCLARY:[content.FRANCOISCLARY.refs[0],'Apartado Julia Clary: padres, nacimiento de François en 1725 y muerte en 1794.','Julia Clary section: parents, François’s birth in 1725 and death in 1794.'],
 HUGHALBERTODONNELL:[content.HUGHALBERTODONNELL.refs[1],'Artículo sobre los irlandeses en el ejército español: Hugh Albert O’Donnell (1606–1642).','Article on the Irish in the Spanish army: Hugh Albert O’Donnell (1606–1642).'],
 AMBROSIOOHIGGINS:[content.AMBROSIOOHIGGINS.refs[2],'Sección Ambrosio O’Higgins: origen irlandés, nacimiento hacia 1720 y muerte en 1801.','Ambrosio O’Higgins section: Irish origin, birth around 1720 and death in 1801.'],
};
for(const id of Object.keys(content)){
 const p=PERSONAS.find(p=>p.id===id),a=authority[id]||{};
 for(const [suffix,field,rawField]of [['birth','birth','nac'],['death','death','muer']]){
  const val=a.gndRecord?.[field];let sources=[];
  if(val)sources=[source({titulo:`Deutsche Nationalbibliothek · GND · ${a.gndRecord.name}`,url:`https://d-nb.info/gnd/${a.gnd}`},`Datos vitales: ${field==='birth'?'nacimiento':'fallecimiento'} ${val}.`,`Vital data: ${field} ${val}.`)];
  else if(specialVitals[id])sources=[source(...specialVitals[id])];
  if(!sources.length)continue;
  const discrepancy=id==='MARGALDOBRANDINIFARN'&&suffix==='birth';
  const approximate=Boolean(p[rawField+'Aprox']);
  add(id,suffix,sources,discrepancy?'disputed':approximate?'approximate':'documented',
   discrepancy?'El nacimiento se fecha en 1588; la ficha GND lo sitúa en 1585.':approximate?'Año de nacimiento aproximado.':'Año contrastado; esta revisión no fija el día ni el mes.',
   discrepancy?'The birth is dated to 1588; the GND record places it in 1585.':approximate?'Approximate birth year.':'Year checked; this review does not establish the day or month.');
  if(discrepancy)out[`person:${id}:${suffix}`].alternatives=['1585 (GND)','1588'];
 }
}
// Direct parent/spouse statements, separated from vital-data reviews.
const family={};
function bind(ids,ref,loc,en){for(const id of ids.split(','))family[id]=source(ref,loc,en);}
bind('FRANCISCOFARNESIO',content.FRANCISCOFARNESIO.refs[0],'Párrafos iniciales: hijo de Ranuccio II y Maria d’Este; matrimonio con Dorotea Sofía en 1696.','Opening paragraphs: son of Ranuccio II and Maria d’Este; marriage to Dorothea Sophie in 1696.');
bind('ANTONIOFARNESIO',dbi,'Párrafo final sobre las tres esposas y los seis hijos que llegaron a adultos.','Final paragraph on the three wives and six children who reached adulthood.');
bind('RANUCCIO2FARN,MARGARITAMEDICIFARN,MARIAESTEFARN,ISABELLAESTEFARN,MARGVIOLANTESAVOIA,MARGMARIAFARNESIO,TERESAFARNESIO,ISABELLAFARNESIO1668,ODOARDO2PRINCEFARN',dbi,'Familia: nacimiento de Ranuccio, matrimonios y descendencia de las tres esposas; enlaces con Saboya y Este.','Family: Ranuccio’s birth, marriages and children of his three wives; Savoy and Este connections.');
bind('MARGALDOBRANDINIFARN',content.MARGALDOBRANDINIFARN.refs[0],'Matrimonio de Ranuccio I con Margherita Aldobrandini en 1600.','Ranuccio I’s marriage to Margherita Aldobrandini in 1600.');
bind('MARIAFARNESIOESTE,VITTORIAFARNESIOESTE',dbi,'Enlaces con los Este: las hijas de Ranuccio I, Maria y Vittoria, esposas sucesivas de Francesco I.','Este marriages: Ranuccio I’s daughters Maria and Vittoria, successive wives of Francesco I.');
bind('ALFONSO4ESTE',content.ALFONSO4ESTE.refs[0],'Primer párrafo: padres Francesco I y Maria Farnese.','First paragraph: parents Francesco I and Maria Farnese.');
bind('FRANCESCO2ESTE',content.FRANCESCO2ESTE.refs[0],'Primer párrafo: hijo de Alfonso IV; últimos párrafos: matrimonio con Margherita Maria Farnese.','First paragraph: son of Alfonso IV; final paragraphs: marriage to Margherita Maria Farnese.');
bind('ELISABETHAMALIAPAL',content.ELISABETHAMALIAPAL.refs[0],'Información biográfica: hija de Georg II y esposa de Philipp Wilhelm desde 1653.','Biographical information: daughter of Georg II and wife of Philipp Wilhelm from 1653.');
bind('DOROTHEASOPHIEFARN,MARIANANEOBURG',content.DOROTHEASOPHIEFARN.refs[0],'Entrada NEUBURG DOROTEA SOFIA: padres, hermanas y dos matrimonios Farnesio.','NEUBURG DOROTEA SOFIA entry: parents, sisters and two Farnese marriages.');
const napoleonFamily=content.CARLOBONAPARTE.refs[0];
bind('CARLOBONAPARTE,LETIZIARAMOLINO,JOSEBONAPARTE,LUCIENBONAPARTE,ELISABONAPARTE,LUISBONAPARTE,PAULINABONAPARTE,CAROLINABONAPARTE,JERONIMOBONAPARTE',napoleonFamily,'Cronología 1769: matrimonio de los padres y lista de los ocho hijos supervivientes.','1769 timeline entry: parents’ marriage and list of their eight surviving children.');
bind('JULIECLARY',content.JULIECLARY.refs.at(-1),'Apartado Julia Clary: François Clary, padre; matrimonio con José Bonaparte en 1794.','Julia Clary section: father François Clary; marriage to Joseph Bonaparte in 1794.');
bind('JOSEFINABEAUHARNAIS,HORTENSEBEAUHARNAIS',content.JOSEFINABEAUHARNAIS.refs[0],'Párrafos de 1783 y 1796: nacimiento de Hortense y matrimonio de Joséphine con Bonaparte.','Paragraphs on 1783 and 1796: Hortense’s birth and Joséphine’s marriage to Bonaparte.');
bind('MARIALUISAAUSTRIAPARMA',content.MARIALUISAAUSTRIAPARMA.refs[0],'Comienzo: hija del emperador Francisco; matrimonio con Napoleón en 1810.','Opening: daughter of Emperor Francis; marriage to Napoleon in 1810.');
bind('CATALINAWURTTBONAPARTE',content.CATALINAWURTTBONAPARTE.refs[0],'Matrimonio de Jérôme con Catherine, hija del rey de Wurtemberg, en 1807.','Jérôme’s marriage to Catherine, daughter of the king of Württemberg, in 1807.');
bind('FREDERIC1WURTTKING',content.FREDERIC1WURTTKING.refs[0],'Genealogía: padre Friedrich Eugen, duque de Wurtemberg.','Genealogy: father Friedrich Eugen, duke of Württemberg.');
bind('HUGHALBERTODONNELL',content.HUGHALBERTODONNELL.refs[0],'Historia del exilio: hijo de Rory O’Donnell, criado en Flandes, muerto sin descendencia en 1642.','History of the exile: Rory O’Donnell’s son, raised in Flanders, died childless in 1642.');
bind('BERNARDOOHIGGINS',content.BERNARDOOHIGGINS.refs[2],'Nacimiento en Chillán y filiación: Ambrosio O’Higgins e Isabel Riquelme.','Birth at Chillán and parentage: Ambrosio O’Higgins and Isabel Riquelme.');
for(const p of PERSONAS.filter(p=>Object.hasOwn(content,p.id))){
 const f=family[p.id];if(!f)continue;
 for(const key of ['padre','madre'])if(p[key]){
  // Maria and Isabella d’Este are daughters of Maria Farnese, as shown in the archive family tree.
  const sourceOverride=['MARIAESTEFARN','ISABELLAESTEFARN'].includes(p.id)?source(content[p.id].refs[1],'Capítulo 4.A, descendencia de Francesco I y su primera esposa, Maria Caterina Farnese.','Chapter 4.A, children of Francesco I and his first wife, Maria Caterina Farnese.'):null;
  if(p.id==='MARGARITAMEDICIFARN'){add(p.id,key==='padre'?'father':'mother',[source(content[p.id].refs[0],'Primer párrafo: hija de Cosimo II y Maria Maddalena de Austria.','First paragraph: daughter of Cosimo II and Maria Maddalena of Austria.')]);continue;}
  add(p.id,key==='padre'?'father':'mother',[sourceOverride||f]);
 }
 for(const spouse of p.conyuges||[]){
  // The family timeline supports the parents' marriage only; use individual biographies for adult children.
  let marriage=f;
  if(['JOSEBONAPARTE','LUISBONAPARTE','CAROLINABONAPARTE','JERONIMOBONAPARTE'].includes(p.id))marriage=source(content[p.id].refs[0],'Biografía: matrimonio y cónyuge.','Biography: marriage and spouse.');
  if(p.id==='HORTENSEBEAUHARNAIS')marriage=source(content.LUISBONAPARTE.refs[0],'Matrimonio con Hortense de Beauharnais.','Marriage to Hortense de Beauharnais.');
  add(p.id,'spouse:'+spouse,[marriage]);add(spouse,'spouse:'+p.id,[marriage]);
 }
}
// Government intervals supported in the named reign passages.
for(const id of ['FRANCISCOFARNESIO','ANTONIOFARNESIO','ALFONSO4ESTE','FRANCESCO2ESTE','FREDERIC1WURTTKING']){
 const p=PERSONAS.find(p=>p.id===id);for(const g of p.gobiernos||[])add(id,'government:'+ [g.territorio,g.desde,g.hasta,g.titulo].join(':'),[source(content[id].refs[0],`Reinado: ${g.desde}–${g.hasta}.`,`Reign: ${g.desde}–${g.hasta}.`)]);
}
out['person:MARIAFARNESIOESTE:death'].certainty='disputed';
out['person:MARIAFARNESIOESTE:death'].alternatives=['1646 (GND, MedLands)','1645 (Dizionario biografico parmigiano)'];
out['person:MARIAFARNESIOESTE:death'].note='La ficha GND y MedLands sitúan la muerte en 1646; el diccionario biográfico de Parma da 1645.';
out['person:MARIAFARNESIOESTE:death'].noteEn='The GND record and MedLands date her death to 1646; Parma’s biographical dictionary gives 1645.';
out['person:MARIAFARNESIOESTE:death'].sources.push(source(content.FRANCISCOFARNESIO.refs[1],'Entrada FARNESE MARIA: muerte en 1645.','FARNESE MARIA entry: death in 1645.'));
fs.writeFileSync('src/evidence/release622Reviews.js' ,'// 6.2.2: claim-specific source passages; year precision is deliberate.\nexport const RELEASE_622_REVIEWS='+JSON.stringify(out,null,2)+';\n');console.log(Object.keys(out).length,'specific reviews');
