// The pilot follows three generations around the succession of Castile.
// A source here supports only the claim and passage named in each review.
export const PILOT_PERSON_IDS = Object.freeze([
  'JUAN2CAST', 'ISABPORT3', 'JUAN2ARAG', 'JUANAENR',
  'ISAB1CAST', 'FERN2ARAG', 'ENRIQ4CAST', 'JUANA1CAST',
  'MAXIM1', 'MARIABORG', 'FEL1CAST', 'CARLOS5', 'ISABPORTEMP',
]);

const rah = (title, path, locator) => ({
  title: `Real Academia de la Historia · ${title}`,
  url: `https://historia-hispanica.rah.es/biografias/${path}`,
  locator,
});
const dated = (source, exactDate, note = '') => ({
  certainty: 'documented', sources: [source], exactDate, note,
  reviewedAt: '2026-09-30', editor: 'El Árbol de Europa',
});
const related = (source, note = '') => ({
  certainty: 'documented', sources: [source], note,
  reviewedAt: '2026-09-30', editor: 'El Árbol de Europa',
});

const isabelHeader = rah('Isabel I', '24039-isabel-i', 'Cabecera biográfica');
const isabelFamily = rah('Isabel I', '24039-isabel-i', 'Biografía, párrafo 1');
const fernandoHeader = rah('Fernando II de Aragón y V de Castilla', '16453-fernando-ii-de-aragon-y-v-de-castilla', 'Cabecera biográfica');
const fernandoFamily = rah('Fernando II de Aragón y V de Castilla', '16453-fernando-ii-de-aragon-y-v-de-castilla', 'Biografía, párrafo 2');
const juanaHeader = rah('Juana I', '24922-juana-i', 'Cabecera biográfica');
const juanaFamily = rah('Juana I', '24922-juana-i', 'Biografía, párrafo 1');
const felipeHeader = rah('Felipe I', '15711-felipe-i', 'Cabecera biográfica');
const felipeFamily = rah('Felipe I', '15711-felipe-i', 'Biografía, párrafo 1');
const carlosHeader = rah('Carlos I y V', '9664-carlos-i-de-espana-y-v-de-alemania', 'Cabecera biográfica');
const carlosFamily = rah('Carlos I y V', '9664-carlos-i-de-espana-y-v-de-alemania', 'Biografía, párrafo 1');
const juanCastHeader = rah('Juan II de Castilla', '25005-juan-ii-de-castilla', 'Cabecera biográfica');
const juanCastReign = rah('Juan II de Castilla', '25005-juan-ii-de-castilla', 'Biografía, párrafo 2');
const isabelPortHeader = rah('Isabel de Portugal, reina de Castilla', '24121-isabel-de-portugal', 'Cabecera biográfica');
const isabelPortBirth = rah('Isabel de Portugal, reina de Castilla', '24121-isabel-de-portugal', 'Biografía, párrafo 1');
const juanAragHeader = rah('Juan II de Aragón y de Navarra', '25004-juan-ii-de-aragon-y-de-navarra', 'Cabecera biográfica');
const isabelEmpHeader = rah('Isabel de Portugal, emperatriz', '24120-isabel-de-portugal', 'Cabecera biográfica');
const isabelEmpFamily = rah('Isabel de Portugal, emperatriz', '24120-isabel-de-portugal', 'Biografía, párrafo 1');
const dibGerald = {title:'Dictionary of Irish Biography · Gerald FitzGerald (Gearóid Mór)',url:'https://www.dib.ie/index.php/biography/fitzgerald-gerald-gearoid-mor-a3148'};
const pares = (title, id, locator) => ({title:`PARES · ${title}`,url:`https://pares.cultura.gob.es/ParesBusquedas20/catalogo/autoridad/${id}`,locator});
const paresIsabelReign=pares('Isabel I',46207,'Historia → Fechas de reinado');
const paresIsabelMarriage=pares('Isabel I',46207,'Historia → matrimonio de 1469');
const paresFernandoBirth=pares('Fernando II',46340,'Identificación → Fechas de existencia; Historia, párrafo 1');
const paresFernandoRegency=pares('Fernando II',46340,'Historia → segunda regencia de Castilla');
const paresJuanaReign=pares('Juana I',46503,'Historia → Fechas de reinado');
const paresJuanaHistory=pares('Juana I',46503,'Historia → poder efectivo y regencias');
const paresJuanaMarriage=pares('Juana I',46503,'Historia → matrimonio con Felipe I');
const paresCarlosReign=pares('Carlos I',46080,'Historia → Fechas de reinado');
const paresCarlosInheritance=pares('Carlos I',46080,'Historia, párrafo 2 → herencia de Castilla y Aragón');
const paresCarlosMarriage=pares('Carlos I',46080,'Historia → matrimonio de 1526');
const dispute = (sources,note,alternatives,timeLabel=null) => ({
  certainty:'disputed',sources,note,alternatives,timeLabel,
  reviewedAt:'2026-09-30',editor:'El Árbol de Europa',
});

export const CLAIM_REVIEWS = Object.freeze({
  'person:GERALD8KILDARE:birth':{certainty:'approximate',sources:[dibGerald],note:'El repertorio fecha el nacimiento en 1456 o 1457; el año del Atlas es orientativo.',reviewedAt:'2026-09-28',editor:'El Árbol de Europa'},
  'person:GERALD8KILDARE:death':{certainty:'documented',sources:[dibGerald],note:'El repertorio registra el fallecimiento el 3 de septiembre de 1513.',reviewedAt:'2026-09-28',editor:'El Árbol de Europa'},
  'person:GERALD8KILDARE:father':{certainty:'documented',sources:[dibGerald],note:'Identificado como hijo de Thomas FitzGerald, VII conde de Kildare.',reviewedAt:'2026-09-28',editor:'El Árbol de Europa'},
  'person:ISAB1CAST:birth': dated(isabelHeader, '1451-04-22'),
  'person:ISAB1CAST:death': dated(isabelHeader, '1504-11-26'),
  'person:ISAB1CAST:father': related(isabelFamily),
  'person:ISAB1CAST:mother': related(isabelFamily),
  'person:ISAB1CAST:spouse:FERN2ARAG': related(paresIsabelMarriage),
  'person:ISAB1CAST:government:Castilla:1474:1504:Reina': related(paresIsabelReign),
  'person:FERN2ARAG:birth': dispute([fernandoHeader,paresFernandoBirth],'La RAH fecha el nacimiento el 10 de marzo de 1452; PARES indica el 10 de mayo. El año coincide, pero el día y el mes requieren cotejo.', ['1452-03-10 · RAH','1452-05-10 · PARES'],'1452 · día discutido'),
  'person:FERN2ARAG:death': dated(fernandoHeader, '1516-01-23'),
  'person:FERN2ARAG:father': related(fernandoFamily),
  'person:FERN2ARAG:mother': related(fernandoFamily),
  'person:FERN2ARAG:spouse:ISAB1CAST': related(paresIsabelMarriage),
  'person:FERN2ARAG:government:Castilla:1507:1516:Regente': related(paresFernandoRegency),
  'person:JUANA1CAST:birth': dated(juanaHeader, '1479-11-06'),
  'person:JUANA1CAST:death': dated(juanaHeader, '1555-04-12'),
  'person:JUANA1CAST:father': related(juanaFamily, 'La biografía la identifica como hija de los Reyes Católicos.'),
  'person:JUANA1CAST:mother': related(juanaFamily, 'La biografía la identifica como hija de los Reyes Católicos.'),
  'person:JUANA1CAST:spouse:FEL1CAST': related(paresJuanaMarriage),
  'person:JUANA1CAST:government:Castilla:1504:1555:Reina': related(paresJuanaReign,'Título conservado; PARES señala que no ejerció poder efectivo desde 1506.'),
  'person:JUANA1CAST:government:Aragón:1516:1555:Reina': related(paresJuanaReign,'Título conservado; PARES distingue la titularidad del ejercicio efectivo.'),
  'person:JUANA1CAST:government:Navarra:1516:1555:Reina': dispute([paresJuanaHistory,paresJuanaReign],'El mismo registro de PARES dice «desde 1516» en la narración y «1515–1555» en la lista de reinados. El Atlas conserva provisionalmente 1516.',['1515–1555 · PARES, Fechas de reinado','1516–1555 · PARES, Historia']),
  'person:JUANA1CAST:government:Nápoles:1516:1555:Reina': dispute([paresJuanaReign],'PARES termina este título en 1554; el Atlas registra 1555. Se necesita contrastar el final de la titularidad.',['1516–1554 · PARES, Fechas de reinado','1516–1555 · Atlas, pendiente']),
  'person:FEL1CAST:birth': dated(felipeHeader, '1478-06-22'),
  'person:FEL1CAST:death': dated(felipeHeader, '1506-09-25'),
  'person:FEL1CAST:father': related(felipeFamily),
  'person:FEL1CAST:mother': related(felipeFamily),
  'person:FEL1CAST:spouse:JUANA1CAST': related(paresJuanaMarriage),
  'person:CARLOS5:birth': dated(carlosHeader, '1500-02-24'),
  'person:CARLOS5:death': dated(carlosHeader, '1558-09-21'),
  'person:CARLOS5:father': related(carlosFamily),
  'person:CARLOS5:mother': related(carlosFamily),
  'person:CARLOS5:spouse:ISABPORTEMP': related(paresCarlosMarriage),
  'person:CARLOS5:government:Castilla:1516:1556:Rey': {certainty:'inferred',sources:[paresCarlosReign,paresCarlosInheritance],note:'PARES da 1516–1556 para el conjunto de reinos hispanos y menciona Castilla entre las herencias; el Atlas desglosa Castilla. Falta cotejo territorial específico.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Aragón:1516:1556:Rey': {certainty:'inferred',sources:[paresCarlosReign,paresCarlosInheritance],note:'PARES da 1516–1556 para el conjunto de reinos hispanos y menciona Aragón entre las herencias; el Atlas desglosa Aragón. Falta cotejo territorial específico.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Sacro Imperio:1519:1556:Emperador': dispute([paresCarlosReign],'PARES enumera 1520–1558 para el título imperial, mientras el Atlas representa 1519–1556 como ejercicio. Hay que separar elección, coronación, abdicación y titularidad antes de cambiar el intervalo.',['1519–1556 · Atlas, ejercicio','1520–1558 · PARES, título']),
  'person:JUAN2CAST:birth': dated(juanCastHeader, '1405-03-06'),
  'person:JUAN2CAST:death': dated(juanCastHeader, '1454-07-21'),
  'person:JUAN2CAST:government:Castilla:1406:1454:Rey': {...related(juanCastReign, 'La biografía sitúa el inicio del reinado en la muerte de Enrique III en 1406; la cabecera fecha la muerte de Juan II en 1454.'),sources:[juanCastReign,juanCastHeader]},
  'person:ISABPORT3:birth': {
    certainty: 'approximate', precision: 'circa', timeLabel: '¿1428?',
    sources: [isabelPortBirth], note: 'La Academia indica que no se conoce con precisión ni el lugar ni el año de nacimiento; algunas fuentes proponen 1428.',
    reviewedAt: '2026-09-30', editor: 'El Árbol de Europa',
  },
  'person:ISABPORT3:death': dated(isabelPortHeader, '1496-08-15'),
  'person:ISABPORT3:father': related(isabelPortBirth),
  'person:ISABPORT3:mother': related(isabelPortBirth),
  'person:JUAN2ARAG:birth': dated(juanAragHeader, '1398-06-29'),
  'person:JUAN2ARAG:death': dated(juanAragHeader, '1479-01-19'),
  'person:JUAN2ARAG:government:Aragón:1458:1479:Rey': related(juanAragHeader),
  'person:ISABPORTEMP:birth': dated(isabelEmpHeader, '1503-10-24'),
  'person:ISABPORTEMP:death': dated(isabelEmpHeader, '1539-05-01'),
  'person:ISABPORTEMP:father': related(isabelEmpFamily),
  'person:ISABPORTEMP:mother': related(isabelEmpFamily),
  'person:ISABPORTEMP:spouse:CARLOS5': related(paresCarlosMarriage),
});

export const EDITORIAL_HISTORY = Object.freeze([
  {id:'v4-evidence-schema',scope:'all',date:'2026-09-28',editor:'El Árbol de Europa',change:'Registro de afirmaciones añadido; datos históricos existentes conservados.',reason:'Hacer visible qué afirmaciones aún necesitan una fuente específica.'},
  {id:'v4-gerald-review',scope:'GERALD8KILDARE',date:'2026-09-28',editor:'El Árbol de Europa',change:'Se añadió una referencia específica a nacimiento, muerte y filiación paterna.',reason:'La entrada biográfica precisa esos datos y aclara que el nacimiento es aproximado.'},
  {id:'v41-rah-pilot',scope:'pilot',date:'2026-09-30',editor:'El Árbol de Europa',change:'Revisión de fechas y filiación en el corredor Isabel I–Juana I–Carlos V; se registra el pasaje de cada fuente.',reason:'Permitir contrastar cada afirmación sin extrapolar la fuente biográfica a gobiernos o vínculos no verificados.'},
  {id:'v41-isabel-portugal-birth',scope:'ISABPORT3',date:'2026-09-30',editor:'El Árbol de Europa',change:'El nacimiento de 1428 pasa a mostrarse como aproximado.',reason:'La RAH indica «¿1428?» y declara desconocidos el año y el lugar exactos.',changeEn:'The 1428 birth year is now shown as approximate.',reasonEn:'The RAH marks 1428 with a question and says the exact year and place are unknown.'},
  {id:'v41-fernando-birth-conflict',scope:'FERN2ARAG',date:'2026-09-30',editor:'El Árbol de Europa',change:'El día de nacimiento pasa a discutido; el año registrado no cambia.',reason:'La RAH indica 10 de marzo y PARES 10 de mayo de 1452.',changeEn:'The birth day is marked as disputed; the recorded year is unchanged.',reasonEn:'The RAH gives 10 March and PARES gives 10 May 1452.'},
  {id:'v41-juana-mandates',scope:'JUANA1CAST',date:'2026-09-30',editor:'El Árbol de Europa',change:'Navarra y Nápoles pasan a discutidos; Castilla y Aragón distinguen titularidad de poder efectivo.',reason:'El registro de PARES contiene intervalos divergentes y explica las regencias.',changeEn:'Navarre and Naples are marked as disputed; Castile and Aragon distinguish title from effective rule.',reasonEn:'The PARES authority record has divergent intervals and describes the regencies.'},
  {id:'v41-carlos-mandates',scope:'CARLOS5',date:'2026-09-30',editor:'El Árbol de Europa',change:'Los mandatos peninsulares desglosados se marcan como inferidos y el imperial como discutido.',reason:'PARES agrupa los reinos hispanos y usa otra cronología para el título imperial.',changeEn:'Separate Iberian mandates are marked as inferred and the imperial interval as disputed.',reasonEn:'PARES groups the Iberian realms and gives a different chronology for the imperial title.'},
]);
