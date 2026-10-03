import { gobiernoEfectivo } from "./data/territorios.js";

// Tabla de correspondencias: nombre de "reino" tal y como aparece en
// PERSONAS (App.jsx) -> lista de IDs reales de las <path> del SVG
// (MapChart_Map.svg) que forman ese territorio.

export const REINO_A_IDS = {

  Bohemia: ["Boleslavsko","Litomericko","Zatecko","Chebsko","Plzensko","Prachensko","Bechinsko","Znojemsko","Brnensko","Olomoucko","Hradistsko","Opavsko","Hradecko","Prague","Chrudimsko"],

  Hungría: ["Zagreb","Torda","Doboka","Szekelyfold","Kiralyfold","Feher","Maramaros","Zemplen","Szepes","Trencsen","Pozsony","Hont","Nograd","Heves","Buda","Sopron","Vas","Zala","Somogy","Baranya","Fejer","Csongrad","Szolnok","Bihar","Szatmar","Szabolcs","Kraszna","Pest","Bacs","Csanad","Zarand_Hun","East_Banat","West_Banat","Vukovar_Syrmia","Bjelovar","Una_Sana","Lika","North_Dalmatia","South_Dalmatia"],

  Polonia: ["Chelmno", "Kuyavia", "Plock", "Dobrzyn", "Poznan", "Gniezno", "Leczyca", "Lublin", "Sieradz", "Kalisz", "Glogow", "Wroclaw", "Opole", "Sandomierz", "Krakow"],

  // Núcleo de la Prusia ducal; Warmia y Prusia Real siguieron otra trayectoria.
  Prusia: ["Lower_Prussia", "Upper_Prussia", "Masuria"],

  // El ducado/archiducado en sentido estricto: Austria sobre y bajo el Enns.
  // Estiria, Carintia, Carniola y Tirol son gobiernos separados, aunque una
  // misma rama de la casa de Habsburgo llegase a reunirlos.
  Austria: ["Unter_dem_Manhartsberg", "Ober_dem_Manhartsberg", "Ober_dem_Wienerwald", "Unter_dem_Wienerwald", "Traungau", "Muhlviertel"],
  "Austria Interior": ["Eastern_Styria", "Upper_Styria", "Middle_Styria", "Lower_Styria", "Upper_Carinthia", "Lower_Carinthia", "Upper_Carniola", "Lower_Carniola"],
  Carintia: ["Upper_Carinthia", "Lower_Carinthia"],
  Tirol: ["Oberinntal", "Unterinntal", "South_Tirol"],

  Baviera: ["Main_Franconia", "Frankenwald", "Tauberfranken", "Franconian_Alb", "Swabian_Alb", "Eastern_Upper_Swabia", "Western_Upper_Swabia"],

  Luxemburgo: ["East_Luxembourg", "West_Luxembourg"],

  Bizancio: ["Constantinople", "Central_Macedonia", "Lower_Macedonia", "Upper_Macedonia", "North_Epirus", "South_Epirus", "Thessaly", "Smyrna"],

  Lituania: ["Siauliai","Medininkai","Upyte","Raseiniai","Vilkmerge","Kaunas","Vilnius","Trakai","Breslauja","Novogrudok","Grodno","Lida","Slonin","Vawkavysk","Suwalki","Ashmyany","Svir"],

  // Monza aproxima el norte del Milanese; el SVG no separa Lodi, Como,
  // Tortona ni Vigevano. Novara y Alessandria salen del Estado en el XVIII.
  Milán: ["Milano", "Monza", "Pavia", "Cremona", "Novara", "Alessandria"],
  Venecia: ["Venice"],
  Saboya: ["Savoy", "Aosta", "Bresse", "Nice"],
  Piamonte: ["Torino", "Mondovi"],

  Habsburgo: ["Aargau","Upper_Alsace","Waldstatte"],

  // Kempenland pertenece a la Meierij de 's-Hertogenbosch (Brabante).
  Brabante: ["Brabant", "Antwerp", "Kempenland"],

  Limburgo: ["Limburg"],

  // Cada entrada representa la entidad indicada, no todos los reinos de su monarca.
  Aragón: ["Alcaniz","Teruel","Calatayud","Zaragoza","Huesca","Barbastro"],
  "Condado de Barcelona": ["New_Catalonia","Osona","Barcelona","Girona"],
  Valencia: ["Jativa","Valencia","Castellon"],
  Mallorca: ["Mallorca"],
  Cerdeña: ["Cagliari","Arborea","Logudoro","Gallura"],

  Sicilia: ["Noto","Demena","Girgenti","Mazara","Calabria_Ultra","Calabria_Citra","Basilicata","Otranto","Bari","Capitanata","Principato_Ultra","Principato_Citra","Molise","Abruzzo_Citra","Abruzzo_Ultra","Lavoro"],
  
  Nápoles: ["Calabria_Ultra","Calabria_Citra","Basilicata","Otranto","Bari","Capitanata","Principato_Ultra","Principato_Citra","Molise","Abruzzo_Citra","Abruzzo_Ultra","Lavoro"],

  Trinacria: ["Noto","Demena","Girgenti","Mazara"],

  // Castilla y León conservan gobiernos separados después de 1230. La
  // representación del soberano común reúne las dos series, sin duplicarlas.
  Castilla: ["Montana","Palencia","Lerma","Soria","Burgos","Alava","Biscay","Gipuzkoa","Valladolid","Avila","Segovia","Guadalajara","Cuenca","Alarcon","Toledo","Madrid","Ocana","Plasencia"],
  León: ["Coruna","Santiago","Lugo","Astorga","Ourense","West_Asturias","Benavente","Leon","East_Asturias","Zamora","Ciudad_Rodrigo","Salamanca"],

  Navarra: ["Navarre"],
  Granada: ["Granada","Malaga","Almeria"],

  Portugal: ["Minho", "Tras_Os_Montes", "Beira_Alta", "Beira_Litoral", "Beira_Baixa", "Estremadura", "Alto_Alentejo", "Baixo_Alentejo", "Algarve", "Ribatejo"],

  Francia: ["Narbonnais","Razes","Foix","Comminges","Armagnac","Tursan","Bearn_Bigorre","Bayonne","Bazadais","Perigord","Bordelais","Saintonge","Lower_Poitou","Anjou","Ebroicien","Caennais","Lower_Maine","Upper_Maine","Cotentin","Rouennais","Caux","Nantais","Vannetais","Ploermel","Rennais","Tregor","Cornouaille","Touraine","Upper_Poitou","Lower_Berry","La_Marche","Limousin","Turenne","Quercy","Angouleme","Agenais","Toulousain","Castres","Rouergue","Nimois","Gevaudan","Vivarais","Upper_Auvergne","Lower_Auvergne","Lyonnais","Combraille","Bourbon","Upper_Berry","Blois","Orleanais","Perche","Chartrain","Pays_France","Gatinais","Senonais","Auxerrois","Nevernais","Autunnais","Beaujolais","Ponthieu","Beauvaisis","Amienois","Vermandois","Soissonais","Brie_Champenois","Remois","Champagne","Perthois","Upper_Artois","Roman_Flanders"],

  Bretaña: ["Tregor", "Cornouaille", "Vannetais"],

  Artois: ["Upper_Artois", "Lower_Artois"],

  Henao: ["Hainaut"],

  Holanda: ["North_Holland", "South_Holland"],

  // Un título territorial nunca equivale a todo el Estado borgoñón.
  // El ducado francés, el condado imperial y los demás feudos se pintan
  // únicamente cuando la persona tiene el gobierno fechado correspondiente.
  Borgoña: ["Dijonnais", "Autunnais"],
  "Condado de Borgoña": ["Aval", "Millieu", "Amont"],
  Nevers: ["Nevernais"],
  Rethel: ["Rethelois"],
  Auxerre: ["Auxerrois"],
  Flandes: ["West_Flanders", "East_Flanders", "Roman_Flanders"],
  Namur: ["Namur"],
  "Güeldres": ["Gelderland"],
  Frisia: ["Friesland"],
  Overijssel: ["Overijssel"],
  Drente: ["Drenthe"],
  Groninga: ["Ommelanden"],
  // El SVG no desglosa Zelanda ni Utrecht. "Zealand" es la isla danesa:
  // usarla aquí pintaría Copenhague como posesión de Carlos V.
  Zelanda: [],
  Utrecht: [],

  // Las unidades del SVG son una aproximación regional, no deslindes de
  // señoríos o condados modernos. Véase docs/CARTOGRAFIA_IRLANDA.md.
  Irlanda: [],
  Connacht: ["Roscommon", "Mayo", "Galway"],
  Leinster: ["Wexford", "Kilkenny", "Kildare"],
  "Tír Eoghain": ["Tyrone"],
  "Tír Chonaill": ["Donegal"],
  "Condado de Tyrone": ["Tyrone"],
  "Condado de Tyrconnell": ["Donegal"],
  Thomond: ["Clare"],
  "Condado de Thomond": ["Clare"],
  Desmond: ["Desmond"],
  "Condado de Desmond": ["Limerick"],
  "Condado de Clancare": ["Desmond"],
  "Condado de Ulster": ["Antrim", "Down"],
  Kildare: ["Kildare"],
  Ormond: ["Tipperary"],
  Clanricarde: ["Galway"],
  "Vizcondado de Mayo": ["Mayo"],

  "Estados Pontificios": ["Campagna","Marittima","Patrimonio","Spoleto","Marche"],
  Ferrara: ["Ferrara"],
  Florencia: ["Florence","Arezzo","Pisa"],
  Mantua: ["Mantua"],
  Módena: ["Modena","Reggioem"],
  Monferrato: ["Monferrato"],
  Saluzzo: ["Saluzzo"],
  Parma: ["Parma","Piacenza"],
  Urbino: ["Urbino"],
  Toscana: ["Florence","Arezzo","Pisa","Siena","Grosseto"],
  // El SVG no distingue los señoríos urbanos de estos dominios mayores.
  Pesaro: [],
  Forlì: [],
  Romaña: [],

  "Imperio Latino": ["Constantinople", "Achaea", "Corinthia", "Ilia", "Arcadia", "Argolis", "Messenia", "Laconia"],

  Provenza: ["Avignonnais", "Nice"],

  Alemania: [],
  "Sacro Imperio": []
};

// Un color propio y fácil de distinguir para cada reino, para que dos
// reinos vecinos en el mapa nunca se confundan. Tonos apagados tipo "atlas
// histórico" para que peguen con el fondo pergamino de la interfaz.
// Puedes cambiar cualquier valor libremente (es solo un hex de toda la vida).

export const REINO_COLOR = {
  Aragón: '#ba3737',
  "Condado de Barcelona": '#ba3737',
  Valencia: '#ba3737',
  Cerdeña: '#ba3737',
  Bohemia: '#6b56a5',
  Hungría: '#db772f',
  Polonia: '#da63cc',
  Prusia: '#303C59',
  Austria: '#8E293C',
  "Austria Interior": '#A64D5A',
  Carintia: '#A64D5A',
  Tirol: '#996342',
  Baviera: '#69c4c4',
  Luxemburgo: '#8E8B29',
  Bizancio: '#6A8E29',
  Lituania: '#43298E',
  Milán: '#1a6684',
  Venecia: '#278477',
  Saboya: '#596e9b',
  Piamonte: '#596e9b',
  Habsburgo: '#298E70',
  Brabante: '#568E29',
  Limburgo: '#298E84',
  Sicilia: '#8E6A29',
  Nápoles: '#56298E',
  Trinacria: '#6A298E',
  Castilla: '#efe558',
  León: '#efe558',
  España: '#C5A62B',
  Navarra: '#84a531',
  Mallorca: '#a34b43',
  Portugal: '#298e47',
  Francia: '#295D8E',
  Inglaterra: '#7A4F3B',
  Escocia: '#4B6C83',
  Bretaña: '#298E36',
  Artois: '#8E6329',
  Henao: '#29708E',
  Holanda: '#8E5029',
  "Estados Pontificios": '#8E3C29',
  "Imperio Latino": '#62298e',
  Provenza: '#298E49',
  Alemania: '#8E7729',
  "Sacro Imperio": '#2F8E29',
  Borgoña: '#8E295C',
  "Condado de Borgoña": '#8E295C',
  Nevers: '#8E295C',
  Rethel: '#8E295C',
  Auxerre: '#8E295C',
  Flandes: '#8E295C',
  Namur: '#8E295C',
  "Güeldres": '#8E295C',
  Frisia: '#8E295C',
  Overijssel: '#8E295C',
  Drente: '#8E295C',
  Groninga: '#8E295C',
  Zelanda: '#8E295C',
  Utrecht: '#8E295C',
  Irlanda: '#45705D',
  Connacht: '#497B69',
  Leinster: '#4D7D72',
  "Tír Eoghain": '#407466',
  "Tír Chonaill": '#407466',
  "Condado de Tyrone": '#407466',
  "Condado de Tyrconnell": '#407466',
  Thomond: '#7A667F',
  "Condado de Thomond": '#7A667F',
  Desmond: '#7A667F',
  "Condado de Desmond": '#7A667F',
  "Condado de Clancare": '#7A667F',
  "Condado de Ulster": '#497B69',
  Kildare: '#5A786C',
  Ormond: '#5A786C',
  Clanricarde: '#5A786C',
  "Vizcondado de Mayo": '#5A786C',
  "Corona de Castilla": '#C5A62B',
  "Corona de Aragón": '#ba3737',
  "Países Bajos y Flandes": '#8E295C',
  "Borgoña y Países Bajos": '#8E295C',
  "Borgoña y Franco Condado": '#8E295C',
  "Incorporaciones del siglo XVI": '#8E295C',
  "Estados Italianos": '#6F7652',
  "Polonia-Lituania": '#8B5AA5',
  "Bizancio y Oriente latino": '#6A8E29',
  Escandinavia: '#4F7393',
  Balcanes: '#6F5B7D',
  Bulgaria: '#7E6542',
  Serbia: '#76504A',
  Bosnia: '#57705F',
  Valaquia: '#6C5E85',
  Moldavia: '#7B6D45',
  Croacia: '#8B5D4C',
  Granada: '#4F7C68',
  Württemberg: '#8A684C',
  Pomerania: '#557486',
  Jülich: '#756489',
  Berg: '#567863',
  "Hesse-Kassel": '#6C7854',
  "Hesse-Darmstadt": '#80634D',
  Baden: '#7B5968',
  Brunswick: '#536F7E',
  Mecklemburgo: '#6D7151',
  Módena: '#7E5E42',
  Alençon: '#5D7090',
  Foix: '#6F7650',
  Armagnac: '#7C5960',
  Annandale: '#6B7581',
  York: '#6B7F4B',
  Suabia: '#756B4E',
  Urbino: '#718665',
  Pesaro: '#667A73',
  Ansbach: '#7C6752',
  Kulmbach: '#596E7C',
};

// Color de respaldo por si algún día añades un reino a PERSONAS y te
// olvidas de darle color aquí (para que no rompa nada, solo se vea gris).
export const REINO_COLOR_DEFAULT = '#5C5346';

// Una sola familia cromática para los feudos reunidos por los Valois de
// Borgoña y sus herederos. Fuera de estas personas cada territorio conserva
// su color propio; la pertenencia nunca se deduce del color.
const PERSONAS_HERENCIA_BORGONONA = new Set([
  'MARGFRAFLA', 'LUIS2FLA', 'MARGFLAN', 'FEL2BORG', 'JUAN1BORG',
  'FEL3BORG', 'CAR1BORG', 'MARIABORG', 'FEL1CAST', 'CARLOS5', 'FEL2ESP',
]);
const FEUDOS_HERENCIA_BORGONONA = new Set([
  'Borgoña', 'Condado de Borgoña', 'Artois', 'Flandes', 'Nevers', 'Rethel',
  'Auxerre', 'Ponthieu', 'Namur', 'Brabante', 'Limburgo', 'Henao', 'Holanda',
  'Zelanda', 'Luxemburgo', 'Güeldres', 'Frisia', 'Utrecht', 'Overijssel',
  'Drente', 'Groninga',
]);
const CORONA_ARAGONESA = new Set([
  'Aragón', 'Condado de Barcelona', 'Valencia', 'Mallorca', 'Cerdeña',
  'Nápoles', 'Sicilia', 'Trinacria',
]);
const MONARQUIA_HISPANICA = new Set([
  'Castilla', 'León', 'Aragón', 'Condado de Barcelona', 'Valencia',
  'Mallorca', 'Cerdeña', 'Nápoles', 'Trinacria', 'Milán', 'Navarra',
]);
const ESTADOS_SABOYANOS = new Set(['Saboya', 'Piamonte', 'Cerdeña']);
const TIERRAS_AUSTRIACAS = new Set(['Austria', 'Austria Interior', 'Tirol', 'Carintia']);
const ADMINISTRACION_AUSTRO_BOHEMIA = new Set(['Austria', 'Austria Interior', 'Tirol', 'Carintia', 'Bohemia']);

// La pertenencia a un conjunto se evalúa por territorio y fecha; compartir
// dinastía o soberano nunca basta para colorear todos sus títulos por igual.
const AGRUPACIONES_POLITICAS = [
  {
    id: 'monarquia-hispanica', nombre: 'Monarquía Hispánica', territorios: MONARQUIA_HISPANICA,
    color: REINO_COLOR.España, desde: 1516,
    aplica: (activos) => activos.has('Castilla') && activos.has('Aragón'),
    nota: 'Conjunto de coronas y dominios de la monarquía. Portugal conservó una administración propia durante la unión dinástica de 1580–1640.',
    fuente: 'https://www.cambridge.org/core/journals/social-science-history/article/turning-points-in-leadership-ship-size-in-the-portuguese-and-dutch-merchant-empires/05AA8EAB13D75D6DE5BCBDD02B8739A2',
  },
  {
    id: 'corona-aragon', nombre: 'Corona de Aragón', territorios: CORONA_ARAGONESA,
    color: REINO_COLOR.Aragón, desde: -Infinity,
    aplica: (activos) => activos.has('Aragón'),
    nota: 'Los reinos y territorios de la Corona mantenían instituciones propias.',
    fuente: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/corona-catalanoaragonesa',
  },
  {
    id: 'castilla-leon', nombre: 'Coronas de Castilla y León', territorios: new Set(['Castilla', 'León']),
    color: REINO_COLOR.Castilla, desde: 1230,
    aplica: (activos) => activos.has('Castilla') && activos.has('León'),
    nota: 'Coronas reunidas bajo un soberano común; el mapa conserva las denominaciones históricas.',
  },
  {
    id: 'austro-bohemia', nombre: 'Administración austro-bohemia', territorios: ADMINISTRACION_AUSTRO_BOHEMIA,
    color: REINO_COLOR.Austria, desde: 1749,
    aplica: (activos) => activos.has('Austria') && activos.has('Bohemia'),
    nota: 'Las reformas de 1749 centralizaron la administración de las tierras austríacas y bohemias; Hungría quedó fuera de esa integración.',
    fuente: 'https://www.habsburger.net/de/kapitel/die-maria-theresianischen-reformen',
  },
  {
    id: 'tierras-austriacas', nombre: 'Tierras austríacas reunidas', territorios: TIERRAS_AUSTRIACAS,
    color: REINO_COLOR.Austria, desde: -Infinity,
    aplica: (activos) => [...TIERRAS_AUSTRIACAS].filter(territorio => activos.has(territorio)).length > 1,
    nota: 'El tono común solo agrupa las tierras austríacas que esta persona gobernó a la vez; no incluye automáticamente Bohemia, Hungría ni los demás estados del Imperio.',
    fuente: 'https://www.habsburger.net/en/chapter/tripartite-division-austrian-inheritance',
  },
  {
    id: 'saboya', nombre: 'Estados saboyanos', territorios: ESTADOS_SABOYANOS,
    color: REINO_COLOR.Saboya, desde: -Infinity,
    aplica: (activos) => activos.has('Saboya') || activos.has('Piamonte'),
    nota: 'Conjunto de territorios gobernados por la casa de Saboya, solo cuando su gobierno está fechado y activo.',
  },
  {
    id: 'herencia-borgonona', nombre: 'Estados borgoñones', territorios: FEUDOS_HERENCIA_BORGONONA,
    color: REINO_COLOR.Borgoña, desde: -Infinity,
    aplica: (_activos, persona) => PERSONAS_HERENCIA_BORGONONA.has(persona?.id),
    nota: 'Agrupación patrimonial de los feudos borgoñones; no incluye otros reinos del mismo soberano.',
  },
];

export function agrupacionesPoliticasEnMapa(persona, año) {
  const activos = new Set(reinadosActivos(persona, año, { soloEfectivos: true }).map(r => r.territorio));
  const cubiertos = new Set();
  return AGRUPACIONES_POLITICAS.filter(grupo => {
    if (año < grupo.desde || !grupo.aplica(activos, persona)) return false;
    const propios = [...grupo.territorios].filter(territorio => activos.has(territorio) && !cubiertos.has(territorio));
    propios.forEach(territorio => cubiertos.add(territorio));
    return propios.length > 0;
  });
}
export function colorTerritorioEnMapa(persona, territorio, año) {
  // Una unión personal no convierte todos los títulos en un mismo estado.
  // El color compartido se limita a los miembros explícitos de cada conjunto;
  // Inglaterra, Borgoña, Hungría, Bohemia o Polonia conservan su identidad.
  const activos = new Set(reinadosActivos(persona, año, { soloEfectivos: true }).map(r => r.territorio));
  if (!activos.has(territorio)) return REINO_COLOR[territorio] || REINO_COLOR_DEFAULT;
  const agrupacion = agrupacionesPoliticasEnMapa(persona, año).find(grupo => grupo.territorios.has(territorio));
  if (agrupacion) return agrupacion.color;
  return REINO_COLOR[territorio] || REINO_COLOR_DEFAULT;
}

// ---------------------------------------------------------------------------
// Versiones territoriales por fecha: los límites de un reino no fueron los
// mismos en 1250 que en 1400. En vez de mantener varios mapas SVG distintos,
// versionamos el propio REINO_A_IDS: cada reino puede tener una lista de
// "versiones" con un rango de fechas [desde, hasta) y los IDs del SVG que le
// corresponden en ese periodo. Un reino que no aparezca aquí simplemente usa
// los IDs fijos de REINO_A_IDS de siempre (sin versionar).
//
// EJEMPLO ilustrativo con dos reinos (Hungría y Polonia) para que veas el
// patrón: los rangos de fecha y la composición territorial exacta son una
// primera aproximación razonable, no una fuente histórica verificada —
// revísalos y ajústalos como hiciste con REINO_A_IDS. Para versionar un
// nuevo reino, añade una entrada aquí con el mismo formato; no hace falta
// tocar nada más.
const REINO_VERSIONES_CASTILLA_1262 = [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha","Cordoba","Murcia","Albacete","Hellin","Jaen","Sevilla","Cadiz","Huelva"];

export const REINO_VERSIONES = {

Inglaterra: [
  {
    desde: -Infinity,
    hasta: 1284, // Antes del Estatuto de Rhuddlan
    ids: ["Northumberland","Cumberland","Durham","Somerset","Devon","Cornwall","Dorset","Hampshire","Sussex","Surrey","Kent","Essex","Suffolk","Norfolk","Cambridgeshire","Hertfordshire","Berkshire","Wiltshire","Oxfordshire","Buckinghamshire","Middlesex","Gloucestershire","Northamptonshire","Leicestershire","Nottinghamshire","Lincolnshire","East_Riding","North_Riding","West_Riding","Derbyshire","Warwickshire","Bedfordshire","Worcestershire","Herefordshire","Staffordshire","Shropshire","Cheshire","Lancashire","Westmorland"
    ],
  },

  {
    desde: 1284,
    hasta: 1535, // Principado de Gales bajo la Corona inglesa
    ids: [
      "Northumberland","Cumberland","Durham",
      "Somerset","Devon","Cornwall","Dorset",
      "Hampshire","Sussex","Surrey","Kent",
      "Essex","Suffolk","Norfolk",
      "Cambridgeshire","Hertfordshire",
      "Berkshire","Wiltshire","Oxfordshire",
      "Buckinghamshire","Middlesex",
      "Gloucestershire","Northamptonshire",
      "Leicestershire","Nottinghamshire",
      "Lincolnshire","East_Riding",
      "North_Riding","West_Riding",
      "Derbyshire","Warwickshire",
      "Bedfordshire","Worcestershire",
      "Herefordshire","Staffordshire",
      "Shropshire","Cheshire",
      "Lancashire","Westmorland",

      // Gales conquistado
      "Gwynedd","Powys","Brecon",
      "Deheubarth","Glamorgan"
    ],
  },

  {
    desde: 1535,
    hasta: 1707, // Leyes de Gales
    ids: [
      "Northumberland","Cumberland","Durham","Somerset","Devon","Cornwall","Dorset",
      "Hampshire","Sussex","Surrey","Kent",
      "Essex","Suffolk","Norfolk",
      "Cambridgeshire","Hertfordshire",
      "Berkshire","Wiltshire","Oxfordshire",
      "Buckinghamshire","Middlesex",
      "Gloucestershire","Northamptonshire",
      "Leicestershire","Nottinghamshire",
      "Lincolnshire","East_Riding",
      "North_Riding","West_Riding",
      "Derbyshire","Warwickshire","Bedfordshire","Worcestershire","Herefordshire","Staffordshire","Shropshire","Cheshire","Lancashire","Westmorland",

      // Gales plenamente integrado
      "Gwynedd","Powys","Brecon",
      "Deheubarth","Glamorgan"
    ],
  },

  {
    desde: 1707,
    hasta: Infinity, // Reino de Gran Bretaña
    ids: [
      "Northumberland","Cumberland","Durham",
      "Somerset","Devon","Cornwall","Dorset",
      "Hampshire","Sussex","Surrey","Kent",
      "Essex","Suffolk","Norfolk",
      "Cambridgeshire","Hertfordshire",
      "Berkshire","Wiltshire","Oxfordshire",
      "Buckinghamshire","Middlesex",
      "Gloucestershire","Northamptonshire",
      "Leicestershire","Nottinghamshire",
      "Lincolnshire","East_Riding",
      "North_Riding","West_Riding",
      "Derbyshire","Warwickshire",
      "Bedfordshire","Worcestershire",
      "Herefordshire","Staffordshire",
      "Shropshire","Cheshire",
      "Lancashire","Westmorland",

      "Gwynedd","Powys","Brecon",
      "Deheubarth","Glamorgan",

      // Escocia tras las Actas de Unión
      "Galloway","Strathclyde","Teviotdale",
      "Lothian","Angus","Aberdeenshire",
      "Sutherland","Ross","Moray",
      "Perthshire","Fife","Argyll",
      "Inner_Hebrides","Outer_Hebrides",
      "Northern_Isles"
    ],
  },
],
  
  // Nápoles y Trinacria conservan gobiernos e instituciones propios bajo un
  // mismo monarca. Nunca se vacían sus polígonos por una unión dinástica.
  Sicilia: [
    { desde: 1282, hasta: Infinity, ids: REINO_A_IDS.Trinacria },
  ],
  Granada: [
    { desde: -Infinity, hasta: 1487, ids: REINO_A_IDS.Granada },
    { desde: 1487, hasta: 1489, ids: ["Granada","Almeria"] },
    { desde: 1489, hasta: 1492, ids: ["Granada"] },
    { desde: 1492, hasta: Infinity, ids: [] },
  ],
  Francia: [
    { desde: -Infinity, hasta: 1462, ids: REINO_A_IDS.Francia },
    { desde: 1462, hasta: 1493, ids: [...REINO_A_IDS.Francia,"Rosello"] },
    { desde: 1493, hasta: 1659, ids: REINO_A_IDS.Francia },
    { desde: 1659, hasta: Infinity, ids: [...REINO_A_IDS.Francia,"Rosello"] },
  ],
  Milán: [
    { desde: -Infinity, hasta: 1428, ids: [...REINO_A_IDS.Milán,"Bergamo","Brescia"] },
    { desde: 1428, hasta: 1499, ids: REINO_A_IDS.Milán },
    { desde: 1499, hasta: 1509, ids: REINO_A_IDS.Milán.filter(id => id !== 'Cremona') },
    { desde: 1509, hasta: 1713, ids: REINO_A_IDS.Milán },
    { desde: 1713, hasta: 1738, ids: REINO_A_IDS.Milán.filter(id => id !== 'Alessandria') },
    { desde: 1738, hasta: Infinity, ids: REINO_A_IDS.Milán.filter(id => !['Alessandria', 'Novara'].includes(id)) },
  ],
  Venecia: [
    { desde: -Infinity, hasta: 1211, ids: REINO_A_IDS.Venecia },
    { desde: 1211, hasta: 1404, ids: [...REINO_A_IDS.Venecia, 'Crete'] },
    { desde: 1404, hasta: 1405, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Belluno'] },
    { desde: 1405, hasta: 1411, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno'] },
    { desde: 1411, hasta: 1420, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona'] },
    { desde: 1420, hasta: 1428, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli'] },
    { desde: 1428, hasta: 1489, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli', 'Bergamo', 'Brescia'] },
    { desde: 1489, hasta: 1499, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli', 'Bergamo', 'Brescia', 'Cyprus'] },
    { desde: 1499, hasta: 1509, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli', 'Bergamo', 'Brescia', 'Cyprus', 'Cremona'] },
    // La Liga de Cambrai arrebató buena parte de Terraferma; Padua volvió
    // en 1509, mientras Brescia y Verona no se recuperaron hasta 1516.
    { desde: 1509, hasta: 1516, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Padua', 'Cyprus'] },
    { desde: 1516, hasta: 1571, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli', 'Bergamo', 'Brescia', 'Cyprus'] },
    { desde: 1571, hasta: 1669, ids: [...REINO_A_IDS.Venecia, 'Crete', 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli', 'Bergamo', 'Brescia'] },
    { desde: 1669, hasta: 1797, ids: [...REINO_A_IDS.Venecia, 'Vicenza', 'Padua', 'Verona', 'Belluno', 'Friuli', 'Bergamo', 'Brescia'] },
    { desde: 1797, hasta: Infinity, ids: [] },
  ],
  Saboya: [
    { desde: -Infinity, hasta: 1388, ids: REINO_A_IDS.Saboya.filter(id => id !== 'Nice') },
    { desde: 1388, hasta: 1601, ids: REINO_A_IDS.Saboya },
    { desde: 1601, hasta: Infinity, ids: REINO_A_IDS.Saboya.filter(id => id !== 'Bresse') },
  ],
  Piamonte: [
    { desde: -Infinity, hasta: 1601, ids: REINO_A_IDS.Piamonte },
    { desde: 1601, hasta: 1708, ids: [...REINO_A_IDS.Piamonte, 'Saluzzo'] },
    { desde: 1708, hasta: 1713, ids: [...REINO_A_IDS.Piamonte, 'Saluzzo', 'Monferrato'] },
    { desde: 1713, hasta: 1738, ids: [...REINO_A_IDS.Piamonte, 'Saluzzo', 'Monferrato', 'Alessandria'] },
    { desde: 1738, hasta: Infinity, ids: [...REINO_A_IDS.Piamonte, 'Saluzzo', 'Monferrato', 'Alessandria', 'Novara'] },
  ],
  Valencia: [
    { desde: -Infinity, hasta: 1305, ids: REINO_A_IDS.Valencia },
    { desde: 1305, hasta: Infinity, ids: [...REINO_A_IDS.Valencia,"Orihuela"] },
  ],
  Mallorca: [
    { desde: -Infinity, hasta: 1276, ids: REINO_A_IDS.Mallorca },
    { desde: 1276, hasta: 1343, ids: [...REINO_A_IDS.Mallorca,"Rosello"] },
    { desde: 1343, hasta: Infinity, ids: REINO_A_IDS.Mallorca },
  ],
  "Condado de Barcelona": [
    { desde: -Infinity, hasta: 1276, ids: [...REINO_A_IDS["Condado de Barcelona"],"Rosello"] },
    { desde: 1276, hasta: 1343, ids: REINO_A_IDS["Condado de Barcelona"] },
    { desde: 1343, hasta: 1413, ids: [...REINO_A_IDS["Condado de Barcelona"],"Rosello"] },
    { desde: 1413, hasta: 1462, ids: [...REINO_A_IDS["Condado de Barcelona"],"Urgell","Rosello"] },
    { desde: 1462, hasta: 1493, ids: [...REINO_A_IDS["Condado de Barcelona"],"Urgell"] },
    { desde: 1493, hasta: 1659, ids: [...REINO_A_IDS["Condado de Barcelona"],"Urgell","Rosello"] },
    { desde: 1659, hasta: Infinity, ids: [...REINO_A_IDS["Condado de Barcelona"],"Urgell"] },
  ],
  Cerdeña: [
    { desde: -Infinity, hasta: 1323, ids: [] },
    // La conquista de 1323–1326 no sometió el juzgado de Arborea.
    { desde: 1323, hasta: 1420, ids: ["Cagliari","Logudoro","Gallura"] },
    { desde: 1420, hasta: Infinity, ids: REINO_A_IDS.Cerdeña },
  ],
  Portugal: [
    { desde: -Infinity, hasta: 1249, ids: REINO_A_IDS.Portugal.filter(id => id !== "Algarve") },
    { desde: 1249, hasta: 1425, ids: REINO_A_IDS.Portugal },
    { desde: 1425, hasta: 1452, ids: [...REINO_A_IDS.Portugal,"Madeira"] },
    { desde: 1452, hasta: Infinity, ids: [...REINO_A_IDS.Portugal,"Madeira","Azores"] },
  ],
  Florencia: [
    { desde: -Infinity, hasta: 1406, ids: ["Florence","Arezzo"] },
    { desde: 1406, hasta: Infinity, ids: REINO_A_IDS.Florencia },
  ],
  "Estados Pontificios": [
    { desde: -Infinity, hasta: 1506, ids: REINO_A_IDS["Estados Pontificios"] },
    { desde: 1506, hasta: 1512, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna"] },
    { desde: 1512, hasta: 1515, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna", 'Parma', 'Piacenza'] },
    { desde: 1515, hasta: 1521, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna"] },
    { desde: 1521, hasta: 1540, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna", 'Parma', 'Piacenza'] },
    { desde: 1540, hasta: 1545, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna","Perugia", 'Parma', 'Piacenza'] },
    { desde: 1545, hasta: 1598, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna","Perugia"] },
    { desde: 1540, hasta: 1598, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna","Perugia"] },
    { desde: 1598, hasta: 1631, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna","Perugia","Ferrara"] },
    { desde: 1631, hasta: Infinity, ids: [...REINO_A_IDS["Estados Pontificios"],"Bologna","Romagna","Perugia","Ferrara","Urbino"] },
  ],

  Irlanda: [
    // La alta realeza medieval y el nuevo título de 1542 no prueban dominio
    // directo de toda la isla. Se evita pintarla completa antes de 1603.
    { desde: -Infinity, hasta: 1542, ids: [] },
    { desde: 1542, hasta: 1603, ids: ["Dublin", "Meath", "Kildare"] },
    { desde: 1603, hasta: Infinity, ids: ["Donegal", "Antrim", "Derry", "Tyrone", "Down", "Breifne", "Oriel", "Roscommon", "Mayo", "Meath", "Galway", "Dublin", "Kildare", "Tipperary", "Kilkenny", "Clare", "Wexford", "Limerick", "Waterford", "Cork", "Desmond"] },
  ],

  Hungría: [
    { desde: -Infinity,
      hasta: 1301, // fin de la dinastía Árpád
      ids: ["Zagreb","Torda","Doboka","Szekelyfold","Kiralyfold","Feher","Maramaros","Zemplen","Szepes","Trencsen","Pozsony","Hont","Nograd","Heves","Buda","Sopron","Vas","Zala","Somogy","Baranya","Fejer","Csongrad","Szolnok","Bihar","Szatmar","Szabolcs","Kraszna","Pest","Bacs","Csanad","Bjelovar","Una_Sana","Lika","North_Dalmatia","Vukovar_Syrmia"],},
    { desde: 1301,
      hasta: Infinity, // dinastías Anjou / Luxemburgo / Jagellón: se suman los Banatos orientales
      ids: ["Zagreb","Torda","Doboka","Szekelyfold","Kiralyfold","Feher","Maramaros","Zemplen","Szepes","Trencsen","Pozsony","Hont","Nograd","Heves","Buda","Sopron","Vas","Zala","Somogy","Baranya","Fejer","Csongrad","Szolnok","Bihar","Szatmar","Szabolcs","Kraszna","Pest","Bacs","Csanad","Zarand_Hun","East_Banat","West_Banat","Vukovar_Syrmia","Bjelovar","Una_Sana","Lika","North_Dalmatia"],},
  ],

  Castilla: [
    { desde: -Infinity, hasta: 1230, ids: REINO_A_IDS.Castilla },
    { desde: 1230, hasta: 1236, ids: [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha"] },
    { desde: 1236, hasta: 1243, ids: [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha","Cordoba"] },
    { desde: 1243, hasta: 1246, ids: [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha","Cordoba","Murcia","Albacete","Hellin"] },
    { desde: 1246, hasta: 1248, ids: [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha","Cordoba","Murcia","Albacete","Hellin","Jaen"] },
    { desde: 1248, hasta: 1262, ids: [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha","Cordoba","Murcia","Albacete","Hellin","Jaen","Sevilla"] },
    { desde: 1262, hasta: 1487, ids: [...REINO_A_IDS.Castilla,"West_Mancha","East_Mancha","Cordoba","Murcia","Albacete","Hellin","Jaen","Sevilla","Cadiz","Huelva"] },
    { desde: 1487, hasta: 1489, ids: [...REINO_VERSIONES_CASTILLA_1262,"Malaga"] },
    { desde: 1489, hasta: 1492, ids: [...REINO_VERSIONES_CASTILLA_1262,"Malaga","Almeria"] },
    { desde: 1492, hasta: 1496, ids: [...REINO_VERSIONES_CASTILLA_1262,...REINO_A_IDS.Granada] },
    { desde: 1496, hasta: Infinity, ids: [...REINO_VERSIONES_CASTILLA_1262,...REINO_A_IDS.Granada,"Canary_Islands"] },
  ],
  León: [
    { desde: -Infinity, hasta: 1229, ids: REINO_A_IDS.León },
    { desde: 1229, hasta: 1230, ids: [...REINO_A_IDS.León,"Caceres"] },
    { desde: 1230, hasta: 1233, ids: [...REINO_A_IDS.León,"Caceres","Merida","Badajoz"] },
    { desde: 1233, hasta: 1234, ids: [...REINO_A_IDS.León,"Caceres","Merida","Badajoz","Trujillo"] },
    { desde: 1234, hasta: Infinity, ids: [...REINO_A_IDS.León,"Caceres","Merida","Badajoz","Trujillo","Villanueva_de_la_Serena"] },
  ],

  Austria: [{ desde: -Infinity, hasta: Infinity, ids: REINO_A_IDS.Austria }],
  "Austria Interior": [
    { desde: -Infinity, hasta: 1500, ids: REINO_A_IDS["Austria Interior"] },
    { desde: 1500, hasta: Infinity, ids: [...REINO_A_IDS["Austria Interior"], "Gorizia"] },
  ],

  Baviera: [
    {
      desde: -Infinity,
      hasta: 1400, // ANTES DE LA PARTICIÓN
      ids: ["Munchner_Schotterebene","Donau_Moos","Oberpfalzer_Wald","Bayerischer_Wald","Gauboden","Chiemgau","Alpenvorland","Franconian_Alb","Schaunberg"],
    },
    {
      desde: 1400,
      hasta: Infinity, // FALTA POR HACER
      ids: REINO_A_IDS.Baviera, // aproximación neutra hasta completar la partición histórica
    },
  ],

  Polonia: [
    {
      desde: -Infinity,
      hasta: 1297, // Premislao II
      ids: ["Danzig","Stolp","Naklo","Tuchola","Pyzdry","Poznan","Kalisz","Gniezno","Znin","Konin","Wielun","Koscian"],
    },
    {
      desde: 1297,
      hasta: 1334, // Ladislao I
      ids: ["Lublin","Sandomierz","Krakow","Pilzno","Czestochowa","Wielun","Kalisz","Poznan","Gniezno","Pyzdry","Koscian","Naklo","Radom","Checiny","Sieradz","Znin","Konin","Leczyca","Nowy_Sacz","Szczyrzyc"],
    },
    {
      desde: 1334,
      hasta: 1386, // Casimiro III
      ids: ["Lublin","Sandomierz","Krakow","Pilzno","Czestochowa","Wielun","Kalisz","Poznan","Gniezno","Pyzdry","Koscian","Naklo","Radom","Checiny","Sieradz","Znin","Konin","Leczyca","Nowy_Sacz","Szczyrzyc","Arnskrone","Kuyavia","Plock","Dobrzyn","Czersk","Warsaw","Lomza","Ciechanow","Rawa","Chelm","Volodymyr","Belz","Lviv","Przemysl","Sanok","Drohobych","Zhydachiv","Pocutia","Halych","Eastern_Podolia","Western_Podolia","Terebovlia","Kremenets"],
    },
    {
      desde: 1386,
      hasta: Infinity, // Ladislao II Jaguellón
      ids: ["Lublin","Sandomierz","Krakow","Pilzno","Czestochowa","Wielun","Kalisz","Poznan","Gniezno","Pyzdry","Koscian","Naklo","Radom","Checiny","Sieradz","Znin","Konin","Leczyca","Nowy_Sacz","Szczyrzyc","Arnskrone","Kuyavia","Plock","Dobrzyn","Czersk","Warsaw","Lomza","Ciechanow","Rawa","Chelm","Volodymyr","Belz","Lviv","Przemysl","Sanok","Drohobych","Zhydachiv","Pocutia","Halych","Eastern_Podolia","Western_Podolia","Terebovlia","Kremenets","Stolp","Koslin","Basarabia","Barlad","Bacau","Orhei","Iasi","Balti_Moldova","Dorohei","Suceava"],
    },
  ],
  Lituania: [
    {
      desde: 1386,
      hasta: Infinity, // Ladislao II Jagellón
      ids: ["Khadjibey","Boh","Yelanets","Oleshia","Kodaky","Medininkai","Siauliai","Upyte","Vilnius","Vilkmerge","Raseiniai","Kaunas","Suwalki","Trakai","Podlasie","Bresta","Kobryn","Vawkavysk","Slonin","Grodno","Lida","Dzisna","Toropets","Smolensk","Verzhavsk","Vitebsk","Breslauja","Svir","Polotsk","Lahoysk","Barysaw","Ashmyany","Minsk","Novogrudok","Kursk","Karlivka","Izium","Donetsk","Belgorod","Bryansk","Trubchevsk","Karachev","Kozelsk","Masalsk","Dorogobuzh","Vyazma","Kozlov","Bely","Orsha","Mogilev","Mstsislaw","Starodub_Siverskyi","Nizhyn","Sumy","Ichnia","Poltava","Chernihiv","Novhorod_Siverskyi","Roslavl","Gomel","Rechytsa","Slutsk","Kletsk","Pinsk","Lutsk","Rivne","Zviahel","Zhytomyr","Porossia","Vinnytsia","Torgovytsia","Bratslav","Cherkasy","Lubny","Pereiaslav","Kyiv","Chornobyl","Mazyr","Ovruch","Olevsk","Turov"],
    },
  ],
};

// Devuelve los IDs del SVG que corresponden a un reino en un año concreto.
// Si el reino no está versionado en REINO_VERSIONES, cae directamente en
// REINO_A_IDS. Si falta un tramo temporal, usa la última versión ya vigente;
// para años anteriores a la primera versión prefiere el mapa base.
export function idsDeReinoEnAño(reino, año) {
  // Las agrupaciones y coronas compuestas sirven para consultar; solo un
  // gobierno fechado de una entidad constituyente puede colorear el mapa.
  if (["España","Corona de Castilla","Corona de Aragón"].includes(reino)) return [];

  const base = REINO_A_IDS[reino] ?? [];
  const versiones = REINO_VERSIONES[reino];
  if (!versiones || !versiones.length) return base;
  if (typeof año !== "number" || Number.isNaN(año)) return base.length ? base : versiones[versiones.length - 1].ids;

  const ordenadas = [...versiones].sort((a, b) => a.desde - b.desde);
  const encontrada = ordenadas.find((version) => año >= version.desde && año < version.hasta);
  if (encontrada) return encontrada.ids;

  // Si las versiones empiezan después del año consultado, el mapa base es
  // una aproximación más prudente que aplicar fronteras futuras.
  if (año < ordenadas[0].desde) return base.length ? base : ordenadas[0].ids;

  // En un hueco temporal incompleto usamos la última versión ya vigente,
  // no la versión futura más reciente de toda la serie.
  const anterior = [...ordenadas].reverse().find((version) => version.desde <= año);
  return anterior?.ids ?? base;
}

// ---------------------------------------------------------------------------
// Jerarquía de territorios: qué territorios están "dentro" de otro más
// amplio (p. ej. Baviera, Austria o Bohemia formaban parte del Sacro
// Imperio; Artois o Bretaña eran feudos dentro de Francia). Se agrupan
// bajo su territorio "padre" y se despliegan como filtros propios dentro
// del filtro del territorio madre, exactamente igual que las ramas
// menores de las dinastías en App.jsx.
//
// Edítalo libremente: añade o quita entradas sin tocar el resto del
// código. Un territorio que no aparezca aquí como "hijo" se sigue
// mostrando como chip normal de primer nivel.
export const TERRITORIOS_DESTACADOS = [
  "Francia",
  "Inglaterra",
  "Escocia",
  "Irlanda",
  "Georgia y Cáucaso",
  "España",
  "Portugal",
  "Sacro Imperio",
  "Borgoña y Países Bajos",
  "Estados Italianos",
  "Hungría",
  "Polonia-Lituania",
  "Bizancio y Oriente latino",
  "Balcanes",
  "Escandinavia",
];

// Jerarquía semántica usada por los filtros. Los grupos que no son nombres
// literales del campo `reinos` (por ejemplo «Corona de Castilla») funcionan como
// categorías de exploración; sus chips hijos siguen permitiendo elegir cada
// territorio concreto. Un territorio puede aparecer en varios grupos cuando
// su historia política o geográfica lo justifica (Borgoña, Silesia, Saboya…).
export const TERRITORIOS_SUB = {
  Francia: [
    "Albret", "Dreux", "Alençon", "Angulema", "Anjou", "Aquitania", "Artois", "Auxerre", "Auvernia",
    "Berry", "Borgoña", "Borbón", "Boulogne", "Bretaña", "Champaña",
    "Clermont", "Évreux", "Foix", "Armagnac", "Guisa", "La Marche", "Montpellier", "Nevers",
    "Orleans", "Ponthieu", "Provenza", "Rethel", "Saint-Pol", "Valois", "Vendôme", "Bearne",
  ],

  Bretaña: ["Penthièvre"],
  Foix: ["Castellbó"],
  Inglaterra: ["Gales", "Richmond", "Suffolk", "York", "Huntingdon", "Northumbria"],
  Escocia: ["Annandale", "Carrick", "Galloway"],
  Irlanda: ["Connacht","Leinster","Thomond","Desmond","Tír Eoghain","Tír Chonaill","Condado de Tyrone","Condado de Tyrconnell","Condado de Thomond","Condado de Desmond","Condado de Clancare","Condado de Ulster","Kildare","Ormond","Clanricarde","Vizcondado de Mayo","Lucan"],
  Armenia: ["Armenia cilicia"],
  "Georgia y Cáucaso": ["Georgia", "Imericia", "Samtsje", "Kartli", "Kajetia", "Kartli-Kajetia"],

  España: ["Corona de Castilla", "Corona de Aragón", "Navarra", "Granada"],
  "Corona de Castilla": ["Castilla", "León"],
  "Corona de Aragón": ["Aragón", "Condado de Barcelona", "Valencia", "Mallorca", "Cerdeña", "Trinacria", "Nápoles", "Gandía", "Urgel"],
  Portugal: ["Brasil"],
  Navarra: [],

  "Sacro Imperio": [
    "Alemania", "Austria", "Austria Interior", "Baviera", "Bohemia",
    "Condado de Borgoña", "Brabante", "Carintia", "Cléveris", "Flandes", "Habsburgo",
    "Henao", "Holanda", "Zelanda", "Limburgo", "Lorena", "Luxemburgo", "Milán",
    "Monferrato", "Saluzzo", "Moravia", "Nassau", "Países Bajos", "Palatinado",
    "Piamonte", "Saboya", "Sajonia", "Silesia", "Suabia", "Tirol",
    "Turingia", "Württemberg", "Pomerania", "Jülich", "Berg",
    "Hesse-Kassel", "Hesse-Darmstadt", "Baden", "Brunswick", "Mecklemburgo", "Oldemburgo", "Mark",
    "Ansbach", "Kulmbach", "Anhalt", "Brandeburgo", "Ginebra", "Güeldres",
    "Hannover", "Hesse", "Hohenberg", "Holstein", "Kyburg", "Meißen",
    "Montbéliard", "Namur", "Núremberg", "Pfirt", "Sajonia-Lauenburgo",
  ],
  Austria: ["Austria Interior", "Carintia", "Habsburgo", "Tirol"],
  Bohemia: ["Moravia", "Silesia"],
  Baviera: [],

  // Agrupación de navegación: no afirma que estos feudos formasen un Estado
  // unitario. Las incorporaciones de Carlos V se distinguen de la herencia.
  "Borgoña y Países Bajos": ["Borgoña y Franco Condado", "Países Bajos y Flandes", "Incorporaciones del siglo XVI"],
  "Borgoña y Franco Condado": ["Borgoña", "Condado de Borgoña", "Nevers", "Rethel", "Auxerre", "Ponthieu"],
  "Países Bajos y Flandes": ["Países Bajos", "Artois", "Flandes", "Brabante", "Limburgo", "Henao", "Holanda", "Zelanda", "Luxemburgo", "Namur"],
  "Incorporaciones del siglo XVI": ["Güeldres", "Frisia", "Utrecht", "Overijssel", "Drente", "Groninga"],

  "Estados Italianos": [
    "Estados Pontificios", "Venecia", "Génova", "Ferrara", "Florencia", "Forlì", "Gravina",
    "Mantua", "Módena", "Milán", "Monferrato", "Saluzzo", "Nápoles", "Parma", "Pesaro", "Urbino",
    "Piamonte", "Romaña", "Saboya", "Sicilia", "Tarento", "Toscana",
    "Trinacria", "Anagni", "Bisceglie", "Brescia", "Camerino", "Cerdeña",
    "Cervia", "Cesena", "Como", "Fano", "Imola", "Ischia", "Lacio",
    "Liguria", "Perugia", "Roma", "Rímini", "Siena", "Squillace",
  ],

  Hungría: ["Transilvania", "Croacia", "Sirmia"],
  "Polonia-Lituania": ["Lituania", "Polonia", "Silesia", "Curlandia", "Mazovia"],
  "Bizancio y Oriente latino": [
    "Bizancio", "Durazzo", "Imperio Latino", "Antioquía", "Armenia", "Chipre",
    "Edesa", "Epiro", "Ibelin", "Jerusalén", "Morea", "Nablus", "Torón",
    "Transjordania", "Trípoli", "Trebisonda",
  ],
  Balcanes: ["Bulgaria", "Serbia", "Bosnia", "Herzegovina", "Valaquia", "Moldavia", "Croacia", "Sirmia", "Epiro"],
  Escandinavia: ["Dinamarca", "Noruega", "Suecia", "Holstein", "Schleswig"],
  Rusia: ["Beloózero", "Moscú", "Pólotsk", "Rus de Kiev", "Vladímir"],
};

const SUBTERRITORIOS_CACHE = new Map();

export function subterritoriosDeFiltro(filtro) {
  if (SUBTERRITORIOS_CACHE.has(filtro)) return SUBTERRITORIOS_CACHE.get(filtro);
  const encontrados = new Set();
  const visitar = (actual) => {
    (TERRITORIOS_SUB[actual] || []).forEach((hijo) => {
      if (encontrados.has(hijo)) return;
      encontrados.add(hijo);
      visitar(hijo);
    });
  };
  visitar(filtro);
  const resultado = [...encontrados];
  SUBTERRITORIOS_CACHE.set(filtro, resultado);
  return resultado;
}

export function territorioCoincideConFiltro(territorio, filtro) {
  if (!territorio || !filtro) return false;
  return territorio === filtro || subterritoriosDeFiltro(filtro).includes(territorio);
}

// ---------------------------------------------------------------------------
// ¿Gobernaba de verdad, o solo estaba vinculado al territorio (consorte,
// noble de corte, hijo con título honorífico...)? Solo quien gobierna debe
// iluminar el mapa; el resto sigue apareciendo en el filtro de territorios
// y en su biografía con normalidad, simplemente no pinta nada en el mapa.
//
// Por defecto se infiere del campo `titulo` con la lista de abajo. Como el
// título por sí solo no siempre basta (un "Duque" puede ser el titular
// reinante o un segundón sin poder real), cualquier persona en PERSONAS
// puede llevar un campo explícito `gobernante: true` o `gobernante: false`
// que sobreescribe la heurística para ese caso puntual — no hace falta
// tocar el resto del dataset.
export const TITULOS_GOBERNANTES = ["Papa", "Emperador", "Emperatriz", "Rey", "Reina", "Duque", "Gran Duque", "Archiduque", "Conde", "Condesa", "Marqués", "Señor", "Señora", "Soberano", "Soberana"];

const TIPOS_REINADO_NO_EFECTIVOS = new Set(["titular", "pretensión"]);

// Modelo normalizado de gobierno. La base nueva usa `reinados`, con un
// intervalo independiente por territorio. Se conserva la lectura del antiguo
// `reinado:[desde,hasta]` para que un dato todavía no migrado no rompa nada.
export function listaReinados(persona) {
  if (!persona) return [];
  if (Array.isArray(persona.gobiernos || persona.reinados)) {
    return (persona.gobiernos || persona.reinados).filter((r) =>
      r && typeof r.territorio === "string"
      && Number.isFinite(r.desde) && Number.isFinite(r.hasta)
    );
  }
  if (Array.isArray(persona.reinado) && persona.reinado.length === 2) {
    const [desde, hasta] = persona.reinado;
    if (Number.isFinite(desde) && Number.isFinite(hasta)) {
      return [{ territorio: (persona.reinos || [])[0] || "Gobierno", desde, hasta }];
    }
  }
  return [];
}

export function reinadoEsEfectivo(reinado) {
  if (!reinado) return false;
  if (reinado.condicion) return gobiernoEfectivo(reinado);
  if (typeof reinado.efectivo === "boolean") return reinado.efectivo;
  return !TIPOS_REINADO_NO_EFECTIVOS.has(String(reinado.tipo || "").toLowerCase());
}

// Los años del dataset son inclusivos. Esto permite representar también
// reinados de pocos meses dentro de un mismo año, como Juan I de Francia.
export function reinadosActivos(persona, año, { soloEfectivos = false } = {}) {
  if (!Number.isFinite(año)) return [];
  return listaReinados(persona).filter((r) =>
    (!soloEfectivos || reinadoEsEfectivo(r))
    && año >= r.desde && año <= r.hasta
  );
}

export function territoriosGobernadosEnAño(persona, año) {
  const detallados = listaReinados(persona);
  if (detallados.length) {
    const vigentes = Number.isFinite(año)
      ? reinadosActivos(persona, año, { soloEfectivos: true })
      : detallados.filter(reinadoEsEfectivo);
    return [...new Set(vigentes.map((r) => r.territorio).filter(Boolean))];
  }
  // Sin un intervalo de gobierno no inferimos dominio territorial a partir
  // de `reinos`: ese campo también expresa procedencia, matrimonio o vínculo
  // dinástico. Solo se permite el fallback cuando la ficha ha sido certificada
  // manualmente con `gobernante: true`.
  return [];
}

export function esGobernante(persona) {
  if (!persona) return false;
  if (typeof persona.gobernante === "boolean") return persona.gobernante;
  const reinadosDetallados = listaReinados(persona);
  if (reinadosDetallados.length) return reinadosDetallados.some(reinadoEsEfectivo);
  return false;
}

// Año usado para escoger la versión cartográfica de UN territorio concreto.
// Cuando existe el nuevo modelo se toma el último intervalo efectivo de ese
// territorio. Como REINO_VERSIONES usa rangos [desde,hasta), se emplea el
// penúltimo límite anual en reinados de más de un año para no saltar a las
// fronteras del sucesor en el mismo año de terminación.
export function añoReferenciaTerritorial(persona, territorio = null) {
  if (!persona) return null;
  const reinados = listaReinados(persona)
    .filter(reinadoEsEfectivo)
    .filter((r) => !territorio || r.territorio === territorio)
    .sort((a, b) => a.hasta - b.hasta || a.desde - b.desde);
  if (reinados.length) {
    const ultimo = reinados[reinados.length - 1];
    return ultimo.hasta > ultimo.desde ? ultimo.hasta - 1 : ultimo.desde;
  }
  if (typeof persona.muer === "number") return persona.muer;
  return typeof persona.nac === "number" ? persona.nac : null;
}
