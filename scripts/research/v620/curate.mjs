// Explicitly reviewed facts. Source matching never promotes other claims.
import fs from 'node:fs/promises';
import {PERSONAS} from '../../../src/data/personas.js';
import {personClaims,CLAIM_REVIEWS} from '../../../src/evidence/claims.js';
const previous={...CLAIM_REVIEWS};
try { for(const id of Object.keys(JSON.parse(await fs.readFile('src/evidence/reviews620.json','utf8'))))delete previous[id]; } catch {}
const people=new Map(PERSONAS.map(p=>[p.id,p]));const reviews={};const values={};
const source=(title,url,locator,locatorEn)=>({title,url,locator,locatorEn});
function add(id,src,note,noteEn,certainty='documented'){
 const p=people.get(id.split(':')[1]);const c=personClaims(p,previous).find(c=>c.id===id);
 if(!c)throw Error(`Unknown claim ${id}`);if(c.certainty!=='pending')throw Error(`Already reviewed ${id}: ${c.certainty}`);
 if(reviews[id])throw Error(`Repeated ${id}`);
 reviews[id]={certainty,sources:[src],note,noteEn,reviewedAt:'2026-11-22',editor:'El Árbol de Europa'};values[id]=c.value;
}
const gov=(id,territory,from,to,title='Rey')=>`person:${id}:government:${territory}:${from}:${to}:${title}`;
const vatican='https://www.vatican.va/content/vatican/en/holy-father.html';
// Vatican roster: the beginning may list election and consecration separately.
// The reviewed claims retain year precision and describe the pontificate.
const popes=[['GREG10','Gregory X',184,1271,1276],['PAPA_CELESTINO4','Celestine IV',179,1241,1241],['PAPA_INOCENCIO4','Innocent IV',180,1243,1254],['PAPA_ALEJANDRO4','Alexander IV',181,1254,1261],['PAPA_URBANO4','Urban IV',182,1261,1264],['PAPA_INOCENCIO5','Innocent V',185,1276,1276],['PAPA_ADRIANO5','Adrian V',186,1276,1276],['PAPA_NICOLAS3','Nicholas III',188,1277,1280],['PAPA_MARTIN4','Martin IV',189,1281,1285],['PAPA_CELESTINO5','Celestine V',192,1294,1294],['PAPA_BONIFACIO8','Boniface VIII',193,1294,1303],['PAPA_BENEDICTO11','Benedict XI',194,1303,1304],['PAPA_BENEDICTO12','Benedict XII',197,1334,1342],['PAPA_URBANO5','Urban V',200,1362,1370],['PAPA_GREGORIO11','Gregory XI',201,1370,1378],['PAPA_BONIFACIO9','Boniface IX',203,1389,1404],['PAPA_GREGORIO12','Gregory XII',205,1406,1415],['PAPA_INOCENCIO8','Innocent VIII',213,1484,1492],['PAPA_PIO3','Pius III',215,1503,1503],['PAPA_JULIO3','Julius III',221,1550,1555],['PAPA_MARCELO2','Marcellus II',222,1555,1555],['PAPA_GREGORIO13','Gregory XIII',226,1572,1585],['PAPA_URBANO7','Urban VII',228,1590,1590],['PAPA_INOCENCIO9','Innocent IX',230,1591,1591],['PAPA_LEON11','Leo XI',232,1605,1605],['PAPA_PAULO5','Paul V',233,1605,1621],['PAPA_CLEMENTE9','Clement IX',238,1667,1669],['PAPA_INOCENCIO12','Innocent XII',242,1691,1700],['PAPA_BENEDICTO13','Benedict XIII',245,1724,1730]];
for(const [id,name,row,from,to]of popes)add(gov(id,'Estados Pontificios',from,to,'Papa'),source(`Vatican · The Popes`,vatican,`Tabla «The Popes», fila ${row} (${name}); columnas de inicio y fin del pontificado`,`“The Popes” table, row ${row} (${name}); beginning and end of pontificate`),`Pontificado: ${from}–${to}.`,`Pontificate: ${from}–${to}.`);
const sweden='https://www.kungahuset.se/sveriges-monarki/monarkins-historia';
// Excludes approximate early dates and rows that do not establish co-rulership.
for(const [id,name,from,to,title]of [
 ['KNUT2SUE','Knut Långe',1229,1234],['VALDEMARSUE','Valdemar',1250,1275],['MAGNUS3SUE','Magnus Ladulås',1275,1290],['ALBERTOSUE','Albrekt d.y. av Mecklenburg',1364,1389],['CRISTOBALBAVSUE','Kristoffer av Bayern',1441,1448],['CRISTIAN1NORD','Kristian I',1457,1464],['ESTENSTUREVIEJO','Sten Sture den äldre',1470,1497,'Regente'],['ESTENSTUREVIEJO','Sten Sture den äldre',1501,1503,'Regente'],['ESTENSTUREJOVEN','Sten Sture den yngre',1512,1520,'Regente'],['ERIK14SUE','Erik XIV',1560,1568],['CARLOS9SUE','Karl IX',1604,1611],['ULRICALEONORASUE','Ulrika Eleonora',1719,1720,'Reina'],['CARLOS13SUE','Karl XIII',1809,1818],['OSCAR1SUE','Oskar I',1844,1859]
])add(gov(id,'Suecia',from,to,title),source('Kungahuset · Monarkins historia',sweden,`Tabla de soberanos, fila «${name}»: ${from}–${to}${title==='Regente'?'; riksföreståndare':''}`,`Monarchs table, “${name}” row: ${from}–${to}${title==='Regente'?'; riksföreståndare':''}`),`${title==='Regente'?'Regencia':'Reinado'} en Suecia: ${from}–${to}.`,`${title==='Regente'?'Regency':'Reign'} in Sweden: ${from}–${to}.`);
const hr=(slug,name,loc,locEn)=>source(`Hrvatska enciklopedija · ${name}`,`https://www.enciklopedija.hr/clanak/${slug}`,loc,locEn);
const croatian=[['BELA3HUN','bela-iii-arpadovic','Bela III.',1172,1196],['EMERICOHUN','emerik-arpadovic','Emerik',1196,1204],['LADISLAO3HUN','ladislav-iii-arpadovic','Ladislav III.',1204,1205],['ANDRES2HUN','andrija-ii-arpadovic','Andrija II.',1205,1235],['BELA4','bela-iv-arpadovic','Bela IV.',1235,1270],['ESTEBV','stjepan-v-arpadovic','Stjepan V.',1270,1272],['LADI4','ladislav-iv-kumanac','Ladislav IV.',1272,1290],['ANDRES3','andrija-iii-arpadovic','Andrija III.',1290,1301],['LUIS1','ludovik-i-anzuvinac','Ludovik I.',1342,1382]];
for(const [id,slug,name,from,to]of croatian){const src=hr(slug,name,'Cabecera biográfica y párrafo sobre el acceso al trono croata-húngaro', 'Biographical heading and paragraph on accession to the Croatian-Hungarian throne');add(gov(id,'Croacia',from,to),src,`Reinado croata-húngaro: ${from}–${to}.`,`Croatian-Hungarian reign: ${from}–${to}.`);if(['EMERICOHUN','LADISLAO3HUN','ANDRES2HUN','LADI4'].includes(id))add(gov(id,'Hungría',from,to),src,`Reinado croata-húngaro: ${from}–${to}.`,`Croatian-Hungarian reign: ${from}–${to}.`);}
add('person:EMERICOHUN:father',hr('emerik-arpadovic','Emerik','Inicio, filiación: hijo de Bela III.','Opening genealogy: son of Béla III.'),'Emerico era hijo de Bela III.','Emeric was a son of Béla III.');
// Anna of Châtillon is the source’s name for Agnes of Antioch.
add('person:EMERICOHUN:mother',hr('emerik-arpadovic','Emerik','Inicio, filiación: reina Anna Châtillon','Opening genealogy: Queen Anna Châtillon'),'Su madre fue Inés de Antioquía, llamada Ana de Châtillon en esta fuente.','His mother was Agnes of Antioch, called Anna of Châtillon in this source.');
for(const [field,parent,es,en]of [['father','ESTEBV','Esteban V','Stephen V'],['mother','ISABELC','Isabel de Cumania','Elizabeth the Cuman']])add(`person:LADI4:${field}`,hr('ladislav-iv-kumanac','Ladislav IV.','Primer párrafo: hijo de Stjepan V. y de la princesa kumana Elizabeta','Opening paragraph: son of Stjepan V. and the Cuman princess Elizabeta'),`${es} fue ${field==='father'?'el padre':'la madre'} de Ladislao IV.`,`${en} was Ladislaus IV’s ${field==='father'?'father':'mother'}.`);
add('person:ESTEBV:spouse:ISABELC',hr('stjepan-v-arpadovic','Stjepan V.','Párrafo sobre el rapto de Ladislao en 1272: esposa Elizabeta','Paragraph on Ladislaus’s abduction in 1272: wife Elizabeta'),'Esteban V estuvo casado con Isabel de Cumania.','Stephen V was married to Elizabeth the Cuman.');
add('person:ANDRES2HUN:spouse:YOLCOURHUN',hr('andrija-ii-arpadovic','Andrija II.','Pasaje sobre la cruzada: matrimonio con Jolanta Courtenay desde 1215','Crusade passage: married to Jolanta Courtenay from 1215'),'Andrés II se casó con Yolanda de Courtenay en 1215.','Andrew II married Yolanda of Courtenay in 1215.');
add('person:CARLOS1:mother',hr('karlo-i-robert','Karlo I. Robert','Inicio: hijo de Karlo Martel y Klementina Habsburška','Opening: son of Karlo Martel and Klementina Habsburška'),'Clemencia de Habsburgo fue la madre de Carlos I.','Clemence of Habsburg was Charles I’s mother.');
const jag=hr('jagelovici','Jagelovići','Último párrafo: accesos de 1440, 1471 y 1490, sucesión de 1516 y muerte de Luis en 1526','Final paragraph: accessions in 1440, 1471 and 1490, succession in 1516 and Louis’s death in 1526');
for(const [id,t,from,to]of [['LADI3','Croacia',1440,1444],['LADISLAO7HUN','Bohemia',1471,1516],['LADISLAO7HUN','Hungría',1490,1516],['LADISLAO7HUN','Croacia',1490,1516],['LUIS2HUN','Bohemia',1516,1526],['LUIS2HUN','Hungría',1516,1526],['LUIS2HUN','Croacia',1516,1526]])add(gov(id,t,from,to),jag,`Reinado en ${t}: ${from}–${to}.`,`Reign in ${{Croacia:'Croatia',Hungría:'Hungary',Bohemia:'Bohemia'}[t]}: ${from}–${to}.`);
// Additional fact-specific sources are appended below.
const {V6_NAMES}=await import('../../../src/features/english/v6/index.js');
function family(id,field,relative,src){
 const key=`person:${id}:${field}${field==='spouse'?':'+relative:''}`;const p=people.get(id),r=people.get(relative);if(!p||!r)throw Error(`Missing family ${id} ${relative}`);
 const claim=personClaims(p,previous).find(c=>c.id===key);if(!claim||claim.value!==relative)throw Error(`Family differs ${key}`);if(claim.certainty!=='pending')return;
 const names={AGNESGLO:'Agnes of Głogów',JUDITASWIBAV:'Judith of Świdnica-Jawor',JOHNBALLIOLFATHER:'John de Balliol, 5th Baron Balliol'};
 const pe=names[id]||V6_NAMES[id]||p.nombre,re=names[relative]||V6_NAMES[relative]||r.nombre;
 add(key,src,field==='spouse'?`${p.nombre} y ${r.nombre} estuvieron casados.`:`${r.nombre} fue ${field==='father'?'el padre':'la madre'} de ${p.nombre}.`,field==='spouse'?`${pe} and ${re} were married.`:`${re} was ${pe}’s ${field==='father'?'father':'mother'}.`);
}
function marriage(a,b,src){family(a,'spouse',b,src);family(b,'spouse',a,src);}
const royal=(slug,name,loc,locEn)=>source(`The Royal Family · ${name}`,`https://www.royal.uk/${slug}`,loc,locEn);
const alex2=royal('alexander-ii-r1214-1249','Alexander II','Primer párrafo: Guillermo y Ermengarda; párrafos segundo y tercero: bodas con Juana y María','Opening paragraph: William and Ermengarde; second and third paragraphs: marriages to Joan and Marie');
family('ALEXANDER2SCOT','mother','ERMENGARDESCOT',alex2);
marriage('WILLIAM1SCOT','ERMENGARDESCOT',alex2);
marriage('ALEXANDER2SCOT','JOANENGLANDSCOT',alex2);marriage('ALEXANDER2SCOT','MARIECOUCY',alex2);
add(gov('ALEXANDER2SCOT','Escocia',1214,1249),royal('alexander-ii-r1214-1249','Alexander II','Título: reinado 1214–1249; primer y último párrafo: sucesión y muerte','Heading: reign 1214–1249; opening and final paragraphs: succession and death'),'Alejandro II reinó en Escocia entre 1214 y 1249.','Alexander II reigned in Scotland from 1214 to 1249.');
const alex3=royal('alexander-iii-r-1249-1286','Alexander III','Primer párrafo: Alejandro II y María de Coucy; segundo: boda de 1251; párrafo sobre la boda de 1285 con Yolanda','Opening paragraph: Alexander II and Marie de Coucy; second paragraph: marriage in 1251; paragraph on the 1285 marriage to Yolande');
family('ALEXANDER3SCOT','father','ALEXANDER2SCOT',alex3);family('ALEXANDER3SCOT','mother','MARIECOUCY',alex3);marriage('ALEXANDER3SCOT','MARGARETENGLANDSCOT',alex3);marriage('ALEXANDER3SCOT','YOLANDEDREUXSCOT',alex3);
add(gov('ALEXANDER3SCOT','Escocia',1249,1286),royal('alexander-iii-r-1249-1286','Alexander III','Título: reinado 1249–1286; muerte en el párrafo final','Heading: reign 1249–1286; death in the final paragraph'),'Alejandro III reinó en Escocia entre 1249 y 1286.','Alexander III reigned in Scotland from 1249 to 1286.');
const balliol=royal('john-balliol-r-1292-1296','John Balliol','Primer párrafo: John, barón de Balliol, y su esposa Devorgilla','Opening paragraph: John, Baron de Balliol, and his wife Devorgilla');
family('JOHN1BALLIOL','father','JOHNBALLIOLFATHER',balliol);family('JOHN1BALLIOL','mother','DERVORGUILLA',balliol);marriage('JOHNBALLIOLFATHER','DERVORGUILLA',balliol);
add(gov('JOHN1BALLIOL','Escocia',1292,1296),royal('john-balliol-r-1292-1296','John Balliol','Título y párrafos sobre la adjudicación de la corona en 1292 y la rendición de 1296','Heading and paragraphs on the award of the crown in 1292 and surrender in 1296'),'Juan Balliol reinó entre 1292 y su rendición en 1296.','John Balliol reigned from 1292 until his surrender in 1296.');
const david=royal('david-ii-r-1329-1371','David II','Primer párrafo: padres Roberto I e Isabel de Burgh y matrimonio con Juana de Inglaterra','Opening paragraph: parents Robert I and Elizabeth de Burgh and marriage to Joanna of England');
family('DAVID2SCOT','mother','ELIZABETHBURGHSCOT',david);marriage('DAVID2SCOT','JOANTOWERSCOT',david);
const robert3=royal('robert-iii-r-1390-1406','Robert III','Primer párrafo: sucesión del hijo de Roberto II; párrafo sobre la muerte tras el cautiverio de Jacobo','Opening paragraph: succession by Robert II’s son; paragraph on death following James’s capture');
family('ROBERT3SCOT','father','ROBERT2SCOT',robert3);family('JAMES1SCOT','father','ROBERT3SCOT',robert3);
add('person:ROBERT3SCOT:death',robert3,'Roberto III murió en 1406.','Robert III died in 1406.');
add(gov('ROBERT3SCOT','Escocia',1390,1406),robert3,'Roberto III reinó en Escocia entre 1390 y 1406.','Robert III reigned in Scotland from 1390 to 1406.');
marriage('JAMES1SCOT','JOANBEAUFORTSCOT',royal('james-i-r-1406-1437','James I','Párrafos sobre Juana Beaufort y la boda en febrero de 1424','Paragraphs on Joan Beaufort and the marriage in February 1424'));
marriage('JAMES2SCOT','MARYGUELDERS',royal('james-ii-r-1437-1460','James II','Párrafo sobre la boda con María de Güeldres en julio de 1449','Paragraph on the marriage to Mary of Gueldres in July 1449'));
marriage('JAMES3SCOT','MARGDINESCOCIA',royal('james-iii-r-1460-1488','James III','Párrafos iniciales: boda con Margarita de Dinamarca y dote de Cristián I','Opening paragraphs: marriage to Margaret of Denmark and Christian I’s dowry'));
family('ROBERT2SCOT','father','WALTERSTEWART6',royal('robert-ii-r1371-1390','Robert II','Primer párrafo: padres Marjorie y Walter el Senescal','Opening paragraph: parents Marjorie and Walter the Steward'));
const ndb=(article,name,loc='Genealogie: V (padre), M (madre) y matrimonios',locEn='Genealogie: V (father), M (mother) and marriages')=>source(`Neue Deutsche Biographie · ${name}`,`https://www.deutsche-biographie.de/${article}.html#ndbcontent`,loc,locEn);
const henry13=ndb('sfz70055','Heinrich XIII.');marriage('ENRIQUE13','ISABELH',henry13);
const otto3=ndb('sfz74103','Otto III.');family('OTON3','mother','ISABELH',otto3);marriage('OTON3','CATHAB',otto3);marriage('OTON3','AGNESGLO',otto3);
family('LUIS3BAV','father','ENRIQUE13',otto3);family('LUIS3BAV','mother','ISABELH',henry13);
const louis2=ndb('sfz70569','Ludwig II.');family('LUIS2BAV','father','OTTO2BAV',louis2);family('LUIS2BAV','mother','AGNESPALBAV',louis2);marriage('LUIS2BAV','MATHAB',louis2);marriage('LUIS2BAV','MARIABRABBAV',louis2);family('LUIS4','mother','MATHAB',louis2);family('ROD1BAV','mother','MATHAB',louis2);
marriage('OTTO2BAV','AGNESPALBAV',ndb('sfz74101','Otto II.'));
const stephen=ndb('sfz74894','Stephan I.');family('ESTEBAN1BAV','mother','ISABELH',stephen);marriage('ESTEBAN1BAV','JUDITASWIBAV',stephen);family('ENRIQ14BAV','mother','JUDITASWIBAV',stephen);family('OTTO4BAV','mother','JUDITASWIBAV',stephen);
family('ENRIQ15','mother','AGNESGLO',ndb('sfz70056','Heinrich XV.'));
const louis4=ndb('sfz70567','Ludwig der Bayer','Genealogie: descendencia de las bodas con Beatrix y Margarete','Genealogie: children of the marriages to Beatrix and Margarete');
for(const id of ['ALB1BAV','OTTO7BAV']){family(id,'father','LUIS4',louis4);family(id,'mother','MARG2HEN',louis4);}
const partitions=source('Historisches Lexikon Bayerns · Bayerische Teilungen','https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_45122','Die erste Landesteilung 1255: intervalos de Luis II, Enrique XIII y Rodolfo I; Die zweite Landesteilung 1349/1353: Esteban II y Alberto I; Die dritte Landesteilung 1392: Meinhard','Die erste Landesteilung 1255: tenures of Ludwig II, Heinrich XIII and Rudolf I; Die zweite Landesteilung 1349/1353: Stephan II and Albrecht I; Die dritte Landesteilung 1392: Meinhard');
for(const [id,from,to]of [['ENRIQUE13',1253,1290],['LUIS2BAV',1253,1294],['ROD1BAV',1294,1317],['ESTEBAN2BAV',1347,1375],['ALB1BAV',1347,1404],['MEINHARDBAV',1361,1363]])add(gov(id,'Baviera',from,to,'Duque'),partitions,`Gobierno ducal en una rama de Baviera: ${from}–${to}.`,`Ducal tenure in a Bavarian branch: ${from}–${to}.`);
add(gov('OTON3','Baviera',1290,1312,'Duque'),ndb('sfz74103','Otto III.','Cabecera y Biographie: gobierno de Baja Baviera desde 1290, muerte en 1312','Heading and Biographie: rule of Lower Bavaria from 1290, death in 1312'),'Otón III gobernó Baja Baviera desde 1290 hasta 1312.','Otto III ruled Lower Bavaria from 1290 to 1312.');
add(gov('ENRIQ15','Baviera',1312,1333,'Duque'),ndb('sfz70056','Heinrich XV.','Cabecera: duque desde 1312; muerte el 18 de junio de 1333; Biographie: minoría y reparto de 1331','Heading: duke from 1312; death on 18 June 1333; Biographie: minority and partition in 1331'),'Enrique XV fue duque de Baja Baviera desde 1312 hasta 1333, inicialmente bajo tutela.','Henry XV was Duke of Lower Bavaria from 1312 to 1333, initially under guardianship.');
const albert1=ndb('sfz69312','Albrecht I.','Genealogie: primera boda con Margarita de Brieg y descendencia marcada «aus 1»','Genealogie: first marriage to Margaret of Brieg and children marked “aus 1”');
marriage('ALB1BAV','MARGBRIEGBAV',albert1);
for(const id of ['MARGBAV','ALB2BAV','GUILLERMO2BAV','JUAN3BAV','JOHANNASOPHIABAV']){family(id,'father','ALB1BAV',albert1);family(id,'mother','MARGBRIEGBAV',albert1);}
marriage('GUILLERMO2BAV','MARGBORGBAV',albert1);
const allSources=new Map();for(const [id,review]of Object.entries(reviews))for(const s of review.sources){if(!allSources.has(s.url))allSources.set(s.url,{titulo:s.title,url:s.url,grupo:'Historia cultural y política',territorios:[],personas:[]});const ref=allSources.get(s.url);const person=id.split(':')[1];if(!ref.personas.includes(person))ref.personas.push(person);}
await fs.writeFile('src/evidence/reviews620.json',JSON.stringify(reviews,null,2)+'\n');
await fs.writeFile('src/evidence/reviewValues620.json',JSON.stringify(values,null,2)+'\n');
await fs.writeFile('src/evidence/sources620.json',JSON.stringify([...allSources.values()],null,2)+'\n');
console.log(JSON.stringify({claims:Object.keys(reviews).length,people:new Set(Object.keys(reviews).map(id=>id.split(':')[1])).size,sources:allSources.size,byField:Object.keys(reviews).reduce((r,id)=>{const field=id.split(':')[2];r[field]=(r[field]||0)+1;return r;},{})}));
