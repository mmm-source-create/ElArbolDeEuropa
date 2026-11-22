// Boundary evidence is tied to one named mandate, not every crown of a person.
const source = (title, url, locator, locatorEn) => ({title, url, locator, locatorEn});
const tutor = (page, name) => source('Historic Royal Palaces · Tower of London: ESOL Guide',
  'https://www.hrp.org.uk/media/3348/cas-esol-entry-level-guide.pdf',
  `p. ${page}, ${name}: acceso y fallecimiento`, `p. ${page}, ${name}: accession and death`);
const jane = source('The Royal Family · Lady Jane Grey', 'https://www.royal.uk/lady-jane-grey',
  'Reconocimiento del Consejo: 10 de julio; deposición: 19 de julio de 1553',
  'Council recognition: 10 July; deposition: 19 July 1553');
const elizabeth = source('Historic Royal Palaces · The Elizabethan era: a golden age?',
  'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/the-elizabethan-era-a-golden-age/',
  'Introducción: acceso el 17 de noviembre de 1558 y muerte el 24 de marzo de 1603',
  'Introduction: accession on 17 November 1558 and death on 24 March 1603');
const stuarts = source('Historic Royal Palaces · Kings and Queens of England and Britain',
  'https://www.hrp.org.uk/kings-and-queens-of-england-and-britain/',
  'James I and VI / Charles I: muerte de Jacobo, sucesión de Carlos y ejecución',
  'James I and VI / Charles I: James’s death, Charles’s succession and execution');
const jamesAccession = source('Historic Royal Palaces · The death and succession of Elizabeth I',
  'https://www.hrp.org.uk/blog/the-death-and-succession-of-elizabeth-i/',
  'Introducción: muerte de Isabel y proclamación de Jacobo el 24 de marzo de 1603',
  'Introduction: Elizabeth’s death and James’s proclamation on 24 March 1603');
const louisAccession = source('Château de Versailles · Louis XIV: chronologie',
  'https://www.chateauversailles.fr/resources/pdf/fr/presse/dp_louisxiv.pdf',
  'p. 31, 14 de mayo de 1643: muerte de Luis XIII y acceso de Luis XIV',
  'p. 31, 14 May 1643: Louis XIII’s death and Louis XIV’s accession');
const louisDeath = source('Château de Versailles · La mort de Louis XIV',
  'https://www.chateauversailles.fr/decouvrir/histoire/les-grandes-dates/mort-louis-xiv',
  'Introducción: 1 de septiembre de 1715, fin del reinado de Luis XIV e inicio del de Luis XV',
  'Introduction: 1 September 1715, end of Louis XIV’s reign and start of Louis XV’s');
const louisXVDeath = source('Château de Versailles · L’histoire',
  'https://www.chateauversailles.fr/decouvrir/histoire',
  'Le règne de Louis XV: fallecimiento el 10 de mayo de 1774',
  'Le règne de Louis XV: death on 10 May 1774');
const abdication = source('Ministerio de Cultura · Censo-Guía de Archivos · Carlos I',
  'https://censoarchivos.cultura.gob.es/CensoGuia/productordetail.htm?id=46080',
  'Historia: renuncia de Castilla y Aragón en Felipe el 16 de enero de 1556',
  'History: transfer of Castile and Aragon to Philip on 16 January 1556');
const abdicationLetter = source('PARES · Audiencia de Guadalajara · Carta de 1556',
  'https://pares.cultura.gob.es/ParesBusquedas20/catalogo/description/12729665',
  'Alcance y contenido: recepción de la cédula de Bruselas del 16 de enero de 1556',
  'Scope and content: receipt of the Brussels decree of 16 January 1556');

export const SUCCESSION_DATES_619 = [
  {person:'ENRIQ7ING',territorio:'Inglaterra',desde:1485,hasta:1509,titulo:'Rey',calendar:'juliano',
    dates:{desdeFecha:'1485-08-22',hastaFecha:'1509-04-21'},sources:[tutor(29,'Henry VII')],
    note:'Enrique VII reinó desde la victoria de Bosworth hasta su muerte.',noteEn:'Henry VII reigned from the victory at Bosworth until his death.'},
  {person:'ENRIQ8ING',territorio:'Inglaterra',desde:1509,hasta:1547,titulo:'Rey',calendar:'juliano',
    dates:{hastaFecha:'1547-01-28'},sources:[tutor(29,'Henry VIII'),source('British Numismatic Society · The Coinages of Henry VIII',
      'https://www.britnumsoc.org/publications/Digital%20BNJ/pdfs/1949_BNJ_26_6.pdf',
      'p. 66: cómputo del acceso el 22 de abril de 1509', 'p. 66: accession reckoned from 22 April 1509')],
    note:'Enrique VIII murió el 28 de enero de 1547. Historic Royal Palaces fecha el acceso el 21 de abril de 1509; el estudio numismático lo computa desde el 22.',
    noteEn:'Henry VIII died on 28 January 1547. Historic Royal Palaces dates his accession to 21 April 1509; the numismatic study reckons it from 22 April.',
    alternatives:['1509-04-21','1509-04-22']},
  {person:'EDUARDO6ING',territorio:'Inglaterra',desde:1547,hasta:1553,titulo:'Rey',calendar:'juliano',
    dates:{desdeFecha:'1547-01-28',hastaFecha:'1553-07-06'},sources:[tutor(29,'Edward VI')],
    note:'Eduardo VI sucedió a su padre y reinó hasta su muerte.',noteEn:'Edward VI succeeded his father and reigned until his death.'},
  {person:'JUANAGREY',territorio:'Inglaterra',desde:1553,hasta:1553,titulo:'Reina',calendar:'juliano',
    dates:{desdeFecha:'1553-07-10',hastaFecha:'1553-07-19'},sources:[jane],certainty:'disputed',
    note:'El Consejo reconoció a Juana el 10 de julio de 1553. Fue depuesta el 19 de julio ante el apoyo a María Tudor.',
    noteEn:'The Council recognised Jane on 10 July 1553. She was deposed on 19 July as support gathered for Mary Tudor.'},
  {person:'MARIA1ING',territorio:'Inglaterra',desde:1553,hasta:1558,titulo:'Reina',calendar:'juliano',
    dates:{desdeFecha:'1553-07-19',hastaFecha:'1558-11-17'},sources:[tutor(30,'Mary I')],
    note:'María fue proclamada tras la caída de Juana Grey y reinó hasta su muerte.',noteEn:'Mary was proclaimed after Jane Grey’s fall and reigned until her death.'},
  {person:'ISABEL1ING',territorio:'Inglaterra',desde:1558,hasta:1603,titulo:'Reina',calendar:'juliano',
    dates:{desdeFecha:'1558-11-17',hastaFecha:'1603-03-24'},sources:[elizabeth],
    note:'Isabel sucedió a María y reinó hasta su muerte.',noteEn:'Elizabeth succeeded Mary and reigned until her death.'},
  {person:'JACOBO1ING',territorio:'Inglaterra',desde:1603,hasta:1625,titulo:'Rey',calendar:'juliano',
    dates:{desdeFecha:'1603-03-24',hastaFecha:'1625-03-27'},sources:[jamesAccession,stuarts],
    note:'Jacobo fue proclamado el día de la muerte de Isabel. Le sucedió Carlos en marzo de 1625.',
    noteEn:'James was proclaimed on the day Elizabeth died. Charles succeeded him in March 1625.'},
  {person:'CARLOS1ING',territorio:'Inglaterra',desde:1625,hasta:1649,titulo:'Rey',calendar:'juliano',
    dates:{desdeFecha:'1625-03-27',hastaFecha:'1649-01-30'},sources:[stuarts],
    note:'Carlos sucedió a Jacobo y fue ejecutado ante Banqueting House el 30 de enero de 1649.',
    noteEn:'Charles succeeded James and was executed outside Banqueting House on 30 January 1649.'},
  {person:'LUIS14FRA',territorio:'Francia',desde:1643,hasta:1715,titulo:'Rey',calendar:'gregoriano',
    dates:{desdeFecha:'1643-05-14',hastaFecha:'1715-09-01'},sources:[louisAccession,louisDeath],
    note:'Luis XIV heredó la corona al morir Luis XIII; durante su minoría gobernó la regente Ana de Austria.',
    noteEn:'Louis XIV inherited the crown on Louis XIII’s death; Anne of Austria governed as regent during his minority.'},
  {person:'LUIS15FRA',territorio:'Francia',desde:1715,hasta:1774,titulo:'Rey',calendar:'gregoriano',
    dates:{desdeFecha:'1715-09-01',hastaFecha:'1774-05-10'},sources:[louisDeath,louisXVDeath],
    note:'Luis XV sucedió a su bisabuelo Luis XIV y reinó hasta su muerte.',noteEn:'Louis XV succeeded his great-grandfather Louis XIV and reigned until his death.'},
  ...['Castilla','Aragón'].flatMap(territorio => [
    {person:'CARLOS5',territorio,desde:1516,hasta:1556,titulo:'Rey',calendar:'juliano',dates:{hastaFecha:'1556-01-16'},
      sources:territorio==='Castilla'?[abdication,abdicationLetter]:[abdication],
      note:`Carlos cedió la corona de ${territorio} a Felipe el 16 de enero de 1556.`,
      noteEn:`Charles transferred the crown of ${territorio==='Castilla'?'Castile':'Aragon'} to Philip on 16 January 1556.`},
    {person:'FEL2ESP',territorio,desde:1556,hasta:1598,titulo:'Rey',calendar:'juliano',dates:{desdeFecha:'1556-01-16'},
      sources:territorio==='Castilla'?[abdication,abdicationLetter]:[abdication],
      note:`Felipe recibió la corona de ${territorio} por la abdicación de Carlos el 16 de enero de 1556.`,
      noteEn:`Philip received the crown of ${territorio==='Castilla'?'Castile':'Aragon'} through Charles’s abdication on 16 January 1556.`},
  ]),
];

export const datedGovernmentClaimId = record => `person:${record.person}:government:${record.territorio}:${record.desde}:${record.hasta}:${record.titulo}`;

const henryParents = source('Westminster Abbey · Henry VII and Elizabeth of York',
  'https://www.westminster-abbey.org/abbey-commemorations/royals/henry-vii-and-elizabeth-of-york',
  'Who is Henry VII?, primer párrafo: hijo único de Edmund Tudor y Margaret Beaufort',
  'Who is Henry VII?, opening paragraph: only child of Edmund Tudor and Margaret Beaufort');
export const RELATIONSHIP_REVIEWS_619 = {
  'person:ENRIQ7ING:father': {sources:[henryParents],note:'Edmundo Tudor fue el padre de Enrique VII.',noteEn:'Edmund Tudor was Henry VII’s father.'},
  'person:ENRIQ7ING:mother': {sources:[henryParents],note:'Margarita Beaufort fue la madre de Enrique VII.',noteEn:'Margaret Beaufort was Henry VII’s mother.'},
  'person:ENRIQ8ING:spouse:CATARAG': {sources:[source('Historic Royal Palaces · Katherine of Aragon',
    'https://www.hrp.org.uk/hampton-court-palace/history-and-stories/katherine-of-aragon/',
    'Marriage and coronation: boda en Greenwich, 11 de junio de 1509',
    'Marriage and coronation: wedding at Greenwich, 11 June 1509')],
    note:'Enrique VIII y Catalina de Aragón se casaron en Greenwich el 11 de junio de 1509.',
    noteEn:'Henry VIII and Katherine of Aragon married at Greenwich on 11 June 1509.'},
  'person:JACOBO1ING:spouse:ANADINAMARCA': {sources:[source(stuarts.title,stuarts.url,
    'James I and VI, At a glance: esposa Ana de Dinamarca, matrimonio en 1589',
    'James I and VI, At a glance: spouse Anne of Denmark, married in 1589')],
    note:'Jacobo y Ana de Dinamarca se casaron en 1589.',noteEn:'James and Anne of Denmark married in 1589.'},
};

export const SUCCESSION_SOURCES_619 = (() => {
  const byUrl = new Map();
  const add = (reference, person) => {
    if (!byUrl.has(reference.url)) byUrl.set(reference.url, {titulo:reference.title,url:reference.url,
      grupo:'Historia cultural y política',territorios:[],personas:[]});
    const people = byUrl.get(reference.url).personas;
    if (!people.includes(person)) people.push(person);
  };
  for (const record of SUCCESSION_DATES_619) for (const reference of record.sources) add(reference, record.person);
  for (const [id, review] of Object.entries(RELATIONSHIP_REVIEWS_619)) for (const reference of review.sources) add(reference,id.split(':')[1]);
  return [...byUrl.values()];
})();

export function withSuccessionDates619(reviews) {
  const result = {...reviews};
  for (const [id, review] of Object.entries(RELATIONSHIP_REVIEWS_619)) result[id] = {
    ...review,certainty:'documented',reviewedAt:'2026-11-22',editor:'El Árbol de Europa',
  };
  for (const record of SUCCESSION_DATES_619) {
    const id = datedGovernmentClaimId(record), previous = result[id] || {};
    const sources = [...(previous.sources || []), ...record.sources];
    result[id] = {...previous, certainty:record.certainty || previous.certainty || 'documented',
      sources:sources.filter((source, i) => sources.findIndex(s => s.url === source.url && s.locator === source.locator) === i),
      note:record.note,noteEn:record.noteEn,alternatives:record.alternatives || previous.alternatives || [],
      dateSources:Object.fromEntries(Object.keys(record.dates).map(field => [field,record.sources])),
      reviewedAt:'2026-11-22',editor:'El Árbol de Europa'};
  }
  return result;
}
