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
const lombardyMilan={title:'Lombardia Beni Culturali · Stato di Milano',url:'https://www.lombardiabeniculturali.it/istituzioni/schede/8000356/',locator:'Stato di Milano 1535–1749, primer párrafo'};
const lombardyMilanHistory={title:'Lombardia Beni Culturali · Lo Stato di Milano nella dominazione spagnola',url:'https://www.lombardiabeniculturali.it/istituzioni/storia/?unita=03.05',locator:'Dominación española, párrafo sobre la abdicación de 1556'};
const lombardyDukes={title:'Lombardia Beni Culturali · Duchi di Milano',url:'https://www.lombardiabeniculturali.it/istituzioni/cronologie/cariche/6/',locator:'Cronología de duques, entradas de Carlos V y Felipe II'};
const catalanCrown={title:'Enciclopèdia Catalana · Corona catalanoaragonesa',url:'https://www.enciclopedia.cat/gran-enciclopedia-catalana/corona-catalanoaragonesa',locator:'Composición de la Corona y sus instituciones propias'};
const austrianItaly={title:'Treccani · Carlos VI',url:'https://www.treccani.it/enciclopedia/carlo-vi-imperatore-del-sacro-romano-impero_%28Dizionario-di-Storia%29/',locator:'Paz de 1714, Sicilia en 1720 y pérdidas de 1734'};
const milan1706={title:'Lombardia Beni Culturali · Dominación española de Milán',url:'https://www.lombardiabeniculturali.it/istituzioni/storia/?unita=03.05',locator:'Último párrafo: comienzo del dominio austríaco en 1706'};
const milanOccupation={title:'Lombardia Beni Culturali · Ocupación franco-sarda',url:'https://www.lombardiabeniculturali.it/istituzioni/storia/?unita=03.06',locator:'Ocupación de 1733–1736 y retorno a Austria'};
const naples1707={title:'Treccani · Nápoles',url:'https://www.treccani.it/enciclopedia/napoli/',locator:'Dominio austríaco desde 1707, Carlos de Borbón desde 1734 y relevo de 1759'};
const sardiniaSuccession={title:'Treccani · Cerdeña',url:'https://www.treccani.it/enciclopedia/sardegna_%28Dizionario-di-Storia%29/',locator:'Guerra de Sucesión, ocupación austríaca y tratado de Utrecht'};
const sardinia1717={title:'Treccani · Víctor Amadeo II de Saboya',url:'https://www.treccani.it/enciclopedia/savoia_%28Enciclopedia-Italiana%29/',locator:'Ocupación española de 1717 y transferencia a Saboya en 1720'};
const charlesNaples={title:'Treccani · Carlos de Borbón, rey de Nápoles y Sicilia',url:'https://www.treccani.it/enciclopedia/carlo-di-borbone-re-di-napoli-e-di-sicilia_%28Dizionario-Biografico%29/',locator:'Conquista de 1734, coronación de 1735 y cesión a Fernando en 1759'};
const ferdinandNaples={title:'Treccani · Fernando I de Borbón',url:'https://www.treccani.it/enciclopedia/ferdinando-i-di-borbone-re-delle-delle-due-sicilie_%28Enciclopedia-Italiana%29/',locator:'Nacimiento, filiación y sucesión de 1759'};
const paresJuanaSardinia=pares('Juana I',46503,'Fechas de reinado → Aragón, Mallorca, Sicilia, Cerdeña y Valencia');
const paresCarlosSardinia=pares('Carlos I',46080,'Identificación → rey de España, Nápoles, Sicilia y Cerdeña');
const paresFelipe3Sardinia=pares('Felipe III',46877,'Fechas de reinado → España, Portugal, Nápoles, Sicilia y Cerdeña');
const paresFelipe4Sardinia=pares('Felipe IV',46878,'Fechas de reinado → España, Nápoles, Sicilia y Cerdeña');
const paresCarlos2Italy=pares('Carlos II',46849,'Identificación y fechas de reinado → Nápoles, Sicilia, Cerdeña y Milán');
const ccbaeFelipe2={title:'Catálogo Colectivo de Bibliotecas de Archivos Estatales · Felipe II',url:'https://www.mcu.es/ccbae/es/consulta_aut/registro.do?control=BAA20170154457',locator:'Formas alternativas del nombre → rey de Cerdeña y duque de Milán'};
const habsburgFerdinand={title:'Die Welt der Habsburger · Ferdinand I: new crowns for the Habsburgs',url:'https://www.habsburger.net/en/chapter/ferdinand-i-new-crowns-habsburgs',locator:'Sección sobre Hungría tras Mohács y Juan Zápolya'};
const habsburgFerdinand4={title:'Die Welt der Habsburger · Ferdinand IV',url:'https://www.habsburger.net/en/persons/habsburg/ferdinand-iv',locator:'Ficha biográfica, cabecera y párrafo biográfico'};
const senlis={title:'BnF, CCFr · Tratado de Senlis',url:'https://ccfr.bnf.fr/portailccfr/ark:/16871/004a80306914',locator:'Ms 1022, folio 230: condados de Borgoña y Artois, 1493'};
const netherlandsArms={title:'Rijksmuseum · Alegoría de la abdicación de Carlos V',url:'https://www.rijksmuseum.nl/en/collection/object/Allegory-on-the-Abdication-of-Emperor-Charles-v-in-Brussels--2cb744f2469fe62413bb6aab920d4e03',locator:'Descripción de las armas del estandarte verde: provincias de los Países Bajos en 1555'};
const luxembourgHistory={title:'Gobierno de Luxemburgo · Historia del Gran Ducado',url:'https://luxembourg.public.lu/dam-assets/publications/tout-savoir-sur-le-grand-duche-de-luxembourg/tout-savoir-sur-le-grand-duche-de-luxembourg-en.pdf',locator:'Historia: adquisición borgoñona de Luxemburgo en 1443'};
const namurHistory={title:'Citadelle de Namur · Historia de Namur',url:'https://citadelle.namur.be/sites/default/files/uploads/la%20citadelle%20de%20Namur.pdf',locator:'Venta del condado a Felipe el Bueno en 1421'};
const charlesNetherlands={title:'Canon van Nederland · Karel de Vijfde',url:'https://www.canonvannederland.nl/nl/karelv',locator:'Países Bajos: incorporación de Frisia, Utrecht, Drente, Overijssel y Güeldres'};
const frisiaTreaty={title:'DBNL · Friesland in den eersten tijd van den Tachtigjarigen Oorlog',url:'https://www.dbnl.org/tekst/_gid001193001_01/_gid001193001_01_0055.php',locator:'p. 412: derechos de 1515 y acuerdo general de 1524'};
const overijsselCanon={title:'Canon van Overijssel · Het Oversticht',url:'https://www.canonvannederland.nl/nl/overijssel/overijssel/oversticht',locator:'Reconocimiento de Carlos V en 1528'};
const drentheCanon={title:'Canon van Drenthe · Kinkhorst',url:'https://www.canonvannederland.nl/nl/page/99041/kinkhorst',locator:'Cesión de Drente a Carlos V en 1536'};
const utrechtArchive={title:'Het Utrechts Archief · Utrecht en Carlos V',url:'https://www.archieven.nl/nl/zoeken?miadt=39&miaet=14&micode=BIBLIO_BOEK&minr=40665930&mivast=0&miview=ldt&mizig=307',locator:'Poder temporal de Utrecht, 21 de octubre de 1528'};
const groningenCanon={title:'Canon van Groningen · Fin de la independencia',url:'https://www.canonvannederland.nl/nl/groningen/groningen/habsburgs-gezag',locator:'Reconocimiento de Carlos V en 1536'};
const gueldersWars={title:'Rijksmuseum · Gelderse oorlogen',url:'https://www.rijksmuseum.nl/en/collection/node/Gelderse%2Boorlogen--e8ad752027a7c20d0e2cbf9568e18ca8',locator:'Tratado de Venlo de 1543'};
const bnfMarguerite={title:'BnF · Marguerite III de Flandre',url:'https://catalogue.bnf.fr/ark:/12148/cb16161030k',locator:'Títulos de condesa de Flandes, Artois, Borgoña, Nevers y Rethel'};
const sigillaJeanNevers={title:'Sigilla/IRHT · Jean Ier de Bourgogne',url:'https://sigilla.irht.cnrs.fr/A.php/41813',locator:'Títulos: conde de Nevers 1384–1404; Flandes, Artois y Borgoña desde 1404'};
const sigillaPhilippeNevers={title:'Sigilla/IRHT · Philippe de Bourgogne',url:'https://sigilla.irht.cnrs.fr/44802',locator:'Títulos: Nevers 1404–1415 y Rethel 1406–1415'};
const uliegeRethel={title:'Université de Liège · Trulla et cartae',url:'https://orbi.uliege.be/bitstream/2268/247248/1/Trulla%20et%20Cartae.pdf',locator:'Artículo sobre Antonio de Borgoña: Rethel cedido por sus padres en 1393'};
const wallonieNamur={title:'Connaître la Wallonie · Namur en 1429',url:'https://connaitrelawallonie.wallonie.be/histoire/timeline/13-mars-1429-entree-de-philippe-de-bourgogne-namur',locator:'Juan III fallece y Felipe el Bueno toma posesión en 1429'};
const luxembourg1443={title:'Gobierno de Luxemburgo · Ducado de Luxemburgo',url:'https://luxembourg.public.lu/en/society-and-culture/history/helm-holy-roman-empire.html',locator:'Venta de derechos en 1441 y toma de la ciudad en 1443'};
const biblissimaPhilippe={title:'Biblissima/BnF · Philippe le Bon',url:'https://portail.biblissima.fr/fr/ark:/43093/pdata71295e340f36a2c35285ffc09fff863e1dd66edb',locator:'Títulos de Brabante y Limburgo desde 1430 y Luxemburgo desde 1444'};
const canonJacoba={title:'Canon van Nederland · Jacoba van Beieren',url:'https://www.canonvannederland.nl/nl/page/439262/jacoba-van-beieren',locator:'Acuerdo de Delft de 1428 y renuncia de 1433'};
const regionalInheritance=(source,note)=>({certainty:'inferred',sources:[source,netherlandsArms],note,reviewedAt:'2026-09-30',editor:'El Árbol de Europa'});
const regionalAccession=(source,note)=>({certainty:'inferred',sources:[source,netherlandsArms],note,reviewedAt:'2026-09-30',editor:'El Árbol de Europa'});
const burgundianInheritance=(note)=>({certainty:'inferred',sources:[senlis],note,reviewedAt:'2026-09-30',editor:'El Árbol de Europa'});
const dispute = (sources,note,alternatives,timeLabel=null) => ({
  certainty:'disputed',sources,note,alternatives,timeLabel,
  reviewedAt:'2026-09-30',editor:'El Árbol de Europa',
});

export const CLAIM_REVIEWS = Object.freeze({
  'person:MARGFLAN:government:Nevers:1384:1405:Condesa': {...related(bnfMarguerite,'La BnF registra el título; la administración se entregó en apanage a Juan. Titularidad no equivale a gobierno efectivo.'),sources:[bnfMarguerite,sigillaJeanNevers]},
  'person:MARGFLAN:government:Rethel:1384:1405:Condesa': {...related(bnfMarguerite,'La BnF registra el título; sus padres cedieron el gobierno a Antonio en 1393.'),sources:[bnfMarguerite,uliegeRethel]},
  'person:JUAN1BORG:government:Nevers:1384:1404:Conde': related(sigillaJeanNevers),
  'person:JUAN1BORG:government:Flandes:1404:1419:Conde': related(sigillaJeanNevers,'Margarita III retuvo sus derechos hasta 1405; los títulos se solapan.'),
  'person:JUAN1BORG:government:Artois:1404:1419:Conde': related(sigillaJeanNevers,'Margarita III retuvo sus derechos hasta 1405; los títulos se solapan.'),
  'person:JUAN1BORG:government:Condado de Borgoña:1404:1419:Conde': related(sigillaJeanNevers,'Margarita III retuvo sus derechos hasta 1405; los títulos se solapan.'),
  'person:ANTONBRAB:government:Rethel:1393:1406:Conde': related(uliegeRethel),
  'person:PHIL2NEVERS:government:Nevers:1404:1415:Conde': related(sigillaPhilippeNevers),
  'person:PHIL2NEVERS:government:Rethel:1406:1415:Conde': related(sigillaPhilippeNevers),
  'person:JUAN3NAMUR:government:Namur:1418:1429:Conde': {certainty:'inferred',sources:[wallonieNamur],note:'La fuente confirma la muerte de Juan III y la entrada de Felipe en 1429; el comienzo personal en 1418 requiere un registro sucesorio independiente.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:FEL3BORG:government:Namur:1429:1467:Conde': {certainty:'inferred',sources:[wallonieNamur],note:'La toma de posesión de 1429 está documentada; el final corresponde a la muerte del duque y necesita una fuente condal específica.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:FEL3BORG:government:Luxemburgo:1443:1467:Duque': dispute([luxembourg1443,biblissimaPhilippe],'La ciudad fue tomada en 1443; Biblissima fecha el título ducal en 1444. El mapa usa 1443 para el control de la ciudad, no para afirmar una investidura formal en ese año.',['1443 · toma de la ciudad','1444 · título ducal en Biblissima']),
  'person:FEL3BORG:government:Holanda:1428:1433:Regente': related(canonJacoba,'El acuerdo de Delft establece la regencia; el título condal llega con la renuncia de Jacoba en 1433.'),
  'person:FEL3BORG:government:Holanda:1433:1467:Conde': {certainty:'inferred',sources:[canonJacoba],note:'El acceso por renuncia de Jacoba en 1433 está documentado; el final se deduce de la muerte de Felipe en 1467.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
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
  'person:FERN2ARAG:government:Condado de Barcelona:1479:1516:Conde': {certainty:'inferred',sources:[catalanCrown,fernandoHeader],note:'La asociación del título condal con el rey de Aragón está documentada; los extremos anuales se infieren del reinado de Fernando.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FERN2ARAG:government:Valencia:1479:1516:Rey': {certainty:'inferred',sources:[catalanCrown,fernandoHeader],note:'El reino conservó entidad propia en la Corona; el intervalo personal sigue la sucesión aragonesa.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FERN2ARAG:government:Mallorca:1479:1516:Rey': {certainty:'inferred',sources:[catalanCrown,fernandoHeader],note:'Mallorca era un reino separado de Aragón; el intervalo personal sigue la sucesión general.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:JUANA1CAST:birth': dated(juanaHeader, '1479-11-06'),
  'person:JUANA1CAST:death': dated(juanaHeader, '1555-04-12'),
  'person:JUANA1CAST:father': related(juanaFamily, 'La biografía la identifica como hija de los Reyes Católicos.'),
  'person:JUANA1CAST:mother': related(juanaFamily, 'La biografía la identifica como hija de los Reyes Católicos.'),
  'person:JUANA1CAST:spouse:FEL1CAST': related(paresJuanaMarriage),
  'person:JUANA1CAST:government:Castilla:1504:1555:Reina': related(paresJuanaReign,'Título conservado; PARES señala que no ejerció poder efectivo desde 1506.'),
  'person:JUANA1CAST:government:Aragón:1516:1555:Reina': related(paresJuanaReign,'Título conservado; PARES distingue la titularidad del ejercicio efectivo.'),
  'person:JUANA1CAST:government:Navarra:1516:1555:Reina': dispute([paresJuanaHistory,paresJuanaReign],'El mismo registro de PARES dice «desde 1516» en la narración y «1515–1555» en la lista de reinados. El Atlas conserva provisionalmente 1516.',['1515–1555 · PARES, Fechas de reinado','1516–1555 · PARES, Historia']),
  'person:JUANA1CAST:government:Nápoles:1516:1555:Reina': dispute([paresJuanaReign],'PARES termina este título en 1554; el Atlas registra 1555. Se necesita contrastar el final de la titularidad.',['1516–1554 · PARES, Fechas de reinado','1516–1555 · Atlas, pendiente']),
  'person:JUANA1CAST:government:Cerdeña:1516:1555:Reina': related(paresJuanaSardinia,'PARES registra el título compartido con Carlos I; no implica ejercicio personal del gobierno.'),
  'person:FEL1CAST:birth': dated(felipeHeader, '1478-06-22'),
  'person:FEL1CAST:death': dated(felipeHeader, '1506-09-25'),
  'person:FEL1CAST:father': related(felipeFamily),
  'person:FEL1CAST:mother': related(felipeFamily),
  'person:FEL1CAST:spouse:JUANA1CAST': related(paresJuanaMarriage),
  'person:FEL1CAST:government:Condado de Borgoña:1493:1506:Conde': burgundianInheritance('Senlis documenta la restitución del condado a la casa de Austria en 1493. La atribución personal a Felipe y el final en 1506 se infieren de la sucesión; requieren cotejo con documentación condal.'),
  'person:FEL1CAST:government:Artois:1493:1506:Conde': burgundianInheritance('Senlis documenta la restitución de Artois a la casa de Austria en 1493. Las fechas personales se infieren de la sucesión.'),
  'person:CARLOS5:birth': dated(carlosHeader, '1500-02-24'),
  'person:CARLOS5:death': dated(carlosHeader, '1558-09-21'),
  'person:CARLOS5:father': related(carlosFamily),
  'person:CARLOS5:mother': related(carlosFamily),
  'person:CARLOS5:spouse:ISABPORTEMP': related(paresCarlosMarriage),
  'person:CARLOS5:government:Condado de Borgoña:1506:1555:Conde': burgundianInheritance('Senlis establece la restitución de 1493. El inicio de 1506 y el relevo de 1555 se infieren de las sucesiones de Felipe I y Carlos V; falta una fuente condal específica para ambos extremos.'),
  'person:CARLOS5:government:Artois:1506:1555:Conde': burgundianInheritance('Artois figura entre los condados restituidos en Senlis. El intervalo personal procede de la cronología sucesoria y queda pendiente de cotejo local.'),
  'person:CARLOS5:government:Namur:1506:1555:Conde': regionalInheritance(namurHistory,'La incorporación de Namur al patrimonio borgoñón está documentada; el intervalo personal deriva de la herencia de Felipe I y el relevo de 1555.'),
  'person:CARLOS5:government:Luxemburgo:1506:1555:Duque': regionalInheritance(luxembourgHistory,'La incorporación de Luxemburgo al patrimonio borgoñón está documentada; el intervalo personal deriva de la herencia de Felipe I y el relevo de 1555.'),
  'person:CARLOS5:government:Frisia:1524:1555:Señor': regionalAccession(frisiaTreaty,'La fuente distingue derechos adquiridos en 1515 y sumisión general en 1524; el extremo de 1555 sigue el relevo general de los Países Bajos.'),
  'person:CARLOS5:government:Utrecht:1528:1555:Señor': regionalAccession(utrechtArchive,'El archivo fecha la cesión temporal en 1528; el extremo de 1555 sigue el relevo general de los Países Bajos.'),
  'person:CARLOS5:government:Overijssel:1528:1555:Señor': regionalAccession(overijsselCanon,'La fuente fecha el reconocimiento de 1528; el relevo de 1555 procede de la sucesión general de los Países Bajos.'),
  'person:CARLOS5:government:Drente:1536:1555:Señor': regionalAccession(drentheCanon,'La fuente fecha la incorporación en 1536; el relevo de 1555 procede de la sucesión general de los Países Bajos.'),
  'person:CARLOS5:government:Groninga:1536:1555:Señor': regionalAccession(groningenCanon,'La fuente fecha la incorporación en 1536; el mapa aproxima la ciudad y su entorno mediante Ommelanden.'),
  'person:CARLOS5:government:Güeldres:1543:1555:Duque': regionalAccession(gueldersWars,'El tratado de Venlo documenta el acceso en 1543; el extremo de 1555 sigue la transferencia general de los Países Bajos.'),
  'person:FEL2ESP:government:Artois:1555:1598:Conde': burgundianInheritance('Continuidad de Artois en la herencia borgoñona. Los extremos personales requieren cotejo con una fuente territorial específica.'),
  'person:CARLOS5:government:Castilla:1516:1556:Rey': {certainty:'inferred',sources:[paresCarlosReign,paresCarlosInheritance],note:'PARES da 1516–1556 para el conjunto de reinos hispanos y menciona Castilla entre las herencias; el Atlas desglosa Castilla. Falta cotejo territorial específico.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Aragón:1516:1556:Rey': {certainty:'inferred',sources:[paresCarlosReign,paresCarlosInheritance],note:'PARES da 1516–1556 para el conjunto de reinos hispanos y menciona Aragón entre las herencias; el Atlas desglosa Aragón. Falta cotejo territorial específico.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Condado de Barcelona:1516:1556:Conde': {certainty:'inferred',sources:[catalanCrown,paresCarlosInheritance],note:'La composición de la Corona está documentada; el intervalo de Carlos se infiere de su sucesión aragonesa.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Valencia:1516:1556:Rey': {certainty:'inferred',sources:[catalanCrown,paresCarlosInheritance],note:'Valencia figura como reino propio; los extremos se infieren de la sucesión de Carlos.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Mallorca:1516:1556:Rey': {certainty:'inferred',sources:[catalanCrown,paresCarlosInheritance],note:'Mallorca figura como reino propio; los extremos se infieren de la sucesión de Carlos.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FEL5ESP:government:Milán:1700:1706:Duque': {certainty:'inferred',sources:[milan1706],note:'La fuente documenta el cambio de control en 1706; la titularidad personal inicial sigue la sucesión de 1700.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FEL5ESP:government:Nápoles:1700:1707:Rey': {certainty:'inferred',sources:[naples1707],note:'El cambio de control a Austria se fecha en 1707; el inicio sigue la herencia de Carlos II.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FEL5ESP:government:Cerdeña:1700:1708:Rey': {certainty:'inferred',sources:[sardiniaSuccession],note:'El año final es el de la rendición de Cagliari a las fuerzas austracistas.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FEL5ESP:government:Cerdeña:1717:1720:Rey': {certainty:'inferred',sources:[sardinia1717],note:'Reconquista española de 1717 y evacuación de 1720; los años de transición se solapan a escala anual.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS6HRE:government:Milán:1706:1733:Duque': {certainty:'documented',sources:[milan1706,milanOccupation],note:'Primer tramo austríaco; la interrupción comenzó en 1733.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS6HRE:government:Milán:1736:1740:Duque': {certainty:'documented',sources:[milanOccupation],note:'Austria recuperó la administración en 1736. Los años de relevo se superponen porque el Atlas representa intervalos anuales.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOSEMANUEL3SAB:government:Milán:1733:1736:Gobernante': {certainty:'documented',sources:[milanOccupation],note:'Control de hecho durante la ocupación franco-sarda; no se le atribuye el título de duque de Milán.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS6HRE:government:Nápoles:1707:1734:Rey': {certainty:'inferred',sources:[naples1707,austrianItaly],note:'El control austríaco comienza en 1707 y termina con la conquista borbónica de 1734.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS6HRE:government:Cerdeña:1708:1717:Rey': {certainty:'inferred',sources:[sardiniaSuccession,sardinia1717],note:'Dominio austracista desde 1708 hasta la expedición española de 1717.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS6HRE:government:Trinacria:1720:1734:Rey': {certainty:'inferred',sources:[austrianItaly,charlesNaples],note:'Intercambio de 1720 y conquista borbónica en 1734; la coronación de Carlos de Borbón fue en 1735.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:CARLOS3ESP:government:Nápoles:1734:1759:Rey': related(charlesNaples,'Conquistó el reino en 1734 y lo cedió a su hijo Fernando en 1759.'),
  'person:CARLOS3ESP:government:Trinacria:1734:1759:Rey': related(charlesNaples,'La conquista siciliana fue en 1734; la coronación formal se celebró en 1735.'),
  'person:FERN4NAP:birth': {certainty:'documented',sources:[ferdinandNaples],exactDate:'1751-01-12',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FERN4NAP:death': {certainty:'documented',sources:[ferdinandNaples],exactDate:'1825-01-04',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FERN4NAP:father': related(ferdinandNaples),
  'person:FERN4NAP:mother': related(ferdinandNaples),
  'person:FERN4NAP:government:Nápoles:1759:1805:Rey': {certainty:'approximate',sources:[naples1707,ferdinandNaples],note:'La república de 1799 interrumpió el control efectivo durante meses; el mapa anual no puede reflejar ese episodio.',reviewedAt:'2026-10-03',editor:'El Árbol de Europa'},
  'person:FERN4NAP:government:Trinacria:1759:1816:Rey': related(ferdinandNaples,'Sicilia conservó gobierno propio hasta la unión formal de las Dos Sicilias en 1816.'),
  'person:CARLOS5:government:Sacro Imperio:1519:1556:Emperador': dispute([paresCarlosReign],'PARES enumera 1520–1558 para el título imperial, mientras el Atlas representa 1519–1556 como ejercicio. Hay que separar elección, coronación, abdicación y titularidad antes de cambiar el intervalo.',['1519–1556 · Atlas, ejercicio','1520–1558 · PARES, título']),
  'person:CARLOS5:government:Cerdeña:1516:1556:Rey': {certainty:'inferred',sources:[paresCarlosSardinia,paresJuanaSardinia],note:'PARES confirma el título de rey de Cerdeña y la titularidad compartida con Juana desde 1516; 1556 sigue el relevo general de Carlos y no un acto local identificado.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:CARLOS5:government:Milán:1535:1555:Duque': {certainty:'inferred',sources:[lombardyMilan,lombardyMilanHistory],note:'La fuente documenta control directo desde 1535 y actividad imperial hasta 1555. El año final, anterior a la toma de posesión de Felipe en 1556, es una delimitación anual del Atlas; no confirma que Carlos conservase el título ducal tras la investidura del hijo.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:FEL2ESP:government:Milán:1546:1555:Duque': dispute([lombardyMilan,lombardyDukes],'La ficha histórica lombarda fecha la investidura en 1546; su cronología de duques la inicia en 1540. 1555 delimita la etapa anterior a la posesión de 1556, sin precisar día.',['1540 · cronología de duques','1546 · ficha histórica']),
  'person:FEL2ESP:government:Milán:1556:1598:Duque': related(lombardyMilanHistory,'La narración sitúa la toma de posesión en 1556; el final sigue el fallecimiento de Felipe II.'),
  'person:FEL2ESP:government:Cerdeña:1556:1598:Rey': {certainty:'inferred',sources:[ccbaeFelipe2],note:'El catálogo identifica a Felipe II como rey de Cerdeña; los límites siguen su reinado general y requieren una referencia territorial cronológica.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:FEL3ESP:government:Cerdeña:1598:1621:Rey': related(paresFelipe3Sardinia),
  'person:FEL4ESP:government:Cerdeña:1621:1665:Rey': related(paresFelipe4Sardinia),
  'person:CARLOS2ESP:government:Cerdeña:1665:1700:Rey': related(paresCarlos2Italy,'La titularidad comienza durante la regencia de Mariana de Austria.'),
  'person:CARLOS2ESP:government:Nápoles:1665:1700:Rey': related(paresCarlos2Italy,'La titularidad comienza durante la regencia de Mariana de Austria.'),
  'person:CARLOS2ESP:government:Trinacria:1665:1700:Rey': related(paresCarlos2Italy,'PARES denomina Sicilia a este reino; el Atlas conserva su nombre de entidad «Trinacria».'),
  'person:CARLOS2ESP:government:Milán:1665:1700:Duque': {certainty:'inferred',sources:[paresCarlos2Italy,lombardyMilan],note:'PARES confirma el título y la fuente lombarda el dominio milanés de la monarquía; el intervalo anual 1665–1700 se infiere del reinado de Carlos II y necesita cotejo local específico.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:FERN1EMP:government:Hungría:1526:1564:Rey': {certainty:'inferred',sources:[habsburgFerdinand],note:'La fuente documenta una elección disputada por Juan Zápolya y control inicial del noroeste, con otras partes del reino fuera de la autoridad de Fernando. «Rama» señala ese ámbito limitado; el intervalo completo aún necesita fuentes por periodos.',reviewedAt:'2026-09-30',editor:'El Árbol de Europa'},
  'person:FERN4BOH:birth': dated(habsburgFerdinand4, '1633-09-08'),
  'person:FERN4BOH:death': dated(habsburgFerdinand4, '1654-07-09'),
  'person:FERN4BOH:father': related(habsburgFerdinand4, 'La ficha identifica a Fernando III como su padre.'),
  'person:FERN4BOH:mother': related(habsburgFerdinand4, 'La ficha identifica a María de España como su madre.'),
  'person:FERN4BOH:government:Bohemia:1646:1654:Rey': related(habsburgFerdinand4, 'Fue coronado en vida de Fernando III; se trata de un título compartido, no de sucesión imperial.'),
  'person:FERN4BOH:government:Hungría:1647:1654:Rey': related(habsburgFerdinand4, 'Fue coronado en vida de Fernando III; no implica control exclusivo del reino.'),
  'person:FERN4BOH:government:Alemania:1653:1654:Rey de Romanos': related(habsburgFerdinand4, 'Rey de Romanos designado sucesor del emperador; murió antes que su padre y nunca llegó a emperador.'),
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
  {id:'v43-burgundy-dated-fiefs',scope:'all',date:'2026-09-30',editor:'El Árbol de Europa',change:'El mapa del ducado se limita a Dijon y Autun; el Franco Condado, Artois y los demás feudos se incorporan solo desde los gobiernos de cada persona. Se añaden Juan III de Namur y la rama de Nevers/Rethel.',reason:'La figura anterior sumaba condados futuros, territorios de Lorena y Lieja, y áreas ajenas a la herencia como si el ducado los incluyera desde 1363.',changeEn:'The duchy is limited to Dijon and Autun; each other fief now enters the map only under its dated ruler. John III of Namur and the Nevers/Rethel branch were added.',reasonEn:'The previous shape combined later counties and unrelated lands as if all belonged to the duchy from 1363.'},
  {id:'v43-nevers-rethel-appanages',scope:'MARGFLAN',date:'2026-09-30',editor:'El Árbol de Europa',change:'Nevers y Rethel quedan como títulos de Margarita; el ejercicio se muestra en Juan, Antonio y Felipe de Nevers según los apanages de 1384, 1393, 1404 y 1406.',reason:'Los repertorios de sellos y un estudio universitario permiten separar título hereditario y gobierno territorial.',changeEn:'Margaret retains the titles, while the territorial governments follow the appanages to John, Anthony and Philip of Nevers.',reasonEn:'Seal registers and a university study distinguish hereditary title from territorial government.'},
  {id:'v42-burgundy-map-correction',scope:'CARLOS5',date:'2026-09-30',editor:'El Árbol de Europa',change:'Se retira el polígono danés Zealand de Zelanda y se incorporan Namur, Luxemburgo y territorios neerlandeses adquiridos por Carlos V con sus fechas de acceso.',reason:'Una correspondencia de nombres coloreaba Copenhague y la ficha omitía regiones de los Países Bajos. Zelanda y Utrecht quedan sin color hasta disponer de polígonos propios.',changeEn:'The Danish Zealand polygon was removed from Zeeland, while Namur, Luxembourg and Charles V’s later Netherlandish territories were added with accession dates.',reasonEn:'A name match wrongly coloured Copenhagen, and several Low Countries regions were missing. Zeeland and Utrecht remain uncoloured until accurate geometry is available.'},
  {id:'v4-evidence-schema',scope:'all',date:'2026-09-28',editor:'El Árbol de Europa',change:'Registro de afirmaciones añadido; datos históricos existentes conservados.',reason:'Hacer visible qué afirmaciones aún necesitan una fuente específica.'},
  {id:'v4-gerald-review',scope:'GERALD8KILDARE',date:'2026-09-28',editor:'El Árbol de Europa',change:'Se añadió una referencia específica a nacimiento, muerte y filiación paterna.',reason:'La entrada biográfica precisa esos datos y aclara que el nacimiento es aproximado.'},
  {id:'v41-rah-pilot',scope:'pilot',date:'2026-09-30',editor:'El Árbol de Europa',change:'Revisión de fechas y filiación en el corredor Isabel I–Juana I–Carlos V; se registra el pasaje de cada fuente.',reason:'Permitir contrastar cada afirmación sin extrapolar la fuente biográfica a gobiernos o vínculos no verificados.'},
  {id:'v41-isabel-portugal-birth',scope:'ISABPORT3',date:'2026-09-30',editor:'El Árbol de Europa',change:'El nacimiento de 1428 pasa a mostrarse como aproximado.',reason:'La RAH indica «¿1428?» y declara desconocidos el año y el lugar exactos.',changeEn:'The 1428 birth year is now shown as approximate.',reasonEn:'The RAH marks 1428 with a question and says the exact year and place are unknown.'},
  {id:'v41-fernando-birth-conflict',scope:'FERN2ARAG',date:'2026-09-30',editor:'El Árbol de Europa',change:'El día de nacimiento pasa a discutido; el año registrado no cambia.',reason:'La RAH indica 10 de marzo y PARES 10 de mayo de 1452.',changeEn:'The birth day is marked as disputed; the recorded year is unchanged.',reasonEn:'The RAH gives 10 March and PARES gives 10 May 1452.'},
  {id:'v41-juana-mandates',scope:'JUANA1CAST',date:'2026-09-30',editor:'El Árbol de Europa',change:'Navarra y Nápoles pasan a discutidos; Castilla y Aragón distinguen titularidad de poder efectivo.',reason:'El registro de PARES contiene intervalos divergentes y explica las regencias.',changeEn:'Navarre and Naples are marked as disputed; Castile and Aragon distinguish title from effective rule.',reasonEn:'The PARES authority record has divergent intervals and describes the regencies.'},
  {id:'v41-carlos-mandates',scope:'CARLOS5',date:'2026-09-30',editor:'El Árbol de Europa',change:'Los mandatos peninsulares desglosados se marcan como inferidos y el imperial como discutido.',reason:'PARES agrupa los reinos hispanos y usa otra cronología para el título imperial.',changeEn:'Separate Iberian mandates are marked as inferred and the imperial interval as disputed.',reasonEn:'PARES groups the Iberian realms and gives a different chronology for the imperial title.'},
  {id:'v41-carlos-milan-sardinia',scope:'CARLOS5',date:'2026-09-30',editor:'El Árbol de Europa',change:'Se añaden Milán desde 1535 y Cerdeña; se delimita la diferencia entre administración imperial y título de Felipe.',reason:'Lombardia Beni Culturali documenta el control de Milán tras los Sforza; PARES enumera Cerdeña.',changeEn:'Milan from 1535 and Sardinia are added; imperial administration is distinguished from Philip’s title.',reasonEn:'Lombardy heritage records Charles’s rule after the Sforza; PARES lists Sardinia.'},
  {id:'v41-juana-sardinia',scope:'JUANA1CAST',date:'2026-09-30',editor:'El Árbol de Europa',change:'Se añade su título nominal de reina de Cerdeña junto a Carlos I.',reason:'PARES lo registra expresamente entre 1516 y 1555.',changeEn:'Her nominal title as Queen of Sardinia alongside Charles I is added.',reasonEn:'PARES expressly records it from 1516 to 1555.'},
  {id:'v41-felipe-milan',scope:'FEL2ESP',date:'2026-09-30',editor:'El Árbol de Europa',change:'El título milanés se separa de la posesión de 1556 y la fecha de investidura queda discutida; se añade Cerdeña.',reason:'Dos recursos lombardos discrepan entre 1540 y 1546; la historia institucional sitúa la posesión en 1556.',changeEn:'The Milanese title is separated from possession in 1556, the investiture date is disputed, and Sardinia is added.',reasonEn:'Two Lombard resources differ between 1540 and 1546; the institutional history dates possession to 1556.'},
  {id:'v41-spanish-habsburgs-italy',scope:'CARLOS2ESP',date:'2026-09-30',editor:'El Árbol de Europa',change:'Se añaden a Carlos II Milán, Nápoles, Sicilia y Cerdeña, y Cerdeña a Felipe III y Felipe IV.',reason:'PARES documenta los títulos italianos; Milán conserva un intervalo inferido donde falta la comprobación local.',changeEn:'Milan, Naples, Sicily and Sardinia are added for Charles II, and Sardinia for Philip III and IV.',reasonEn:'PARES records the Italian titles; Milan retains an inferred interval pending local verification.'},
  {id:'v41-ferdinand-hungary',scope:'FERN1EMP',date:'2026-09-30',editor:'El Árbol de Europa',change:'El gobierno de Hungría deja de presentarse como control efectivo de todo el reino histórico.',reason:'La Casa de Habsburgo describe la elección rival de Juan Zápolya y el control inicial de Fernando en el noroeste.',changeEn:'Rule in Hungary no longer implies effective control over the entire historical kingdom.',reasonEn:'The House of Habsburg describes John Zápolya’s rival election and Ferdinand’s initial control in the northwest.'},
  {id:'v41-ferdinand-iv-crowns',scope:'FERN4BOH',date:'2026-09-30',editor:'El Árbol de Europa',change:'Se completan sus títulos de rey de Hungría y rey de Romanos, además de documentar su coronación bohemia, filiación y fechas.',reason:'La Casa de Habsburgo fecha las coronaciones y la elección; Fernando murió antes que su padre, por lo que no fue emperador.',changeEn:'His Hungarian and Roman kingships, Bohemian coronation, family links and dates are documented.',reasonEn:'The House of Habsburg dates the coronations and election; he died before his father and was never emperor.'},
]);
