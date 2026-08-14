// Tabla de correspondencias: nombre de "reino" tal y como aparece en
// PERSONAS (App.jsx) -> lista de IDs reales de las <path> del SVG
// (MapChart_Map.svg) que forman ese territorio.

export const REINO_A_IDS = {

  Bohemia: ["Boleslavsko","Litomericko","Zatecko","Chebsko","Plzensko","Prachensko","Bechinsko","Znojemsko","Brnensko","Olomoucko","Hradistsko","Opavsko","Hradecko","Prague","Chrudimsko"],

  Hungría: ["Zagreb","Torda","Doboka","Szekelyfold","Kiralyfold","Feher","Maramaros","Zemplen","Szepes","Trencsen","Pozsony","Hont","Nograd","Heves","Buda","Sopron","Vas","Zala","Somogy","Baranya","Fejer","Csongrad","Szolnok","Bihar","Szatmar","Szabolcs","Kraszna","Pest","Bacs","Csanad","Zarand_Hun","East_Banat","West_Banat","Vukovar_Syrmia","Bjelovar","Una_Sana","Lika","North_Dalmatia","South_Dalmatia"],

  Polonia: ["Chelmno", "Kuyavia", "Plock", "Dobrzyn", "Poznan", "Gniezno", "Leczyca", "Lublin", "Sieradz", "Kalisz", "Glogow", "Wroclaw", "Opole", "Sandomierz", "Krakow"],

  Austria: ["Ober_dem_Wienerwald", "Unter_dem_Wienerwald", "Salzburger_Land", "Eastern_Styria", "Upper_Styria", "Middle_Styria", "Lower_Styria", "Upper_Carinthia", "Lower_Carinthia", "Upper_Carniola", "Lower_Carniola", "South_Tirol", "Vorarlberg"],

  Baviera: ["Main_Franconia", "Frankenwald", "Tauberfranken", "Franconian_Alb", "Swabian_Alb", "Eastern_Upper_Swabia", "Western_Upper_Swabia"],

  Luxemburgo: ["East_Luxembourg", "West_Luxembourg"],

  Bizancio: ["Constantinople", "Central_Macedonia", "Lower_Macedonia", "Upper_Macedonia", "North_Epirus", "South_Epirus", "Thessaly", "Smyrna"],

  Lituania: ["Siauliai","Medininkai","Upyte","Raseiniai","Vilkmerge","Kaunas","Vilnius","Trakai","Breslauja","Novogrudok","Grodno","Lida","Slonin","Vawkavysk","Suwalki","Ashmyany","Svir"],

  Milán: ["Milano", "Pavia", "Bergamo", "Brescia", "Cremona"], // El SVG no contiene un path con id="Como".

  Habsburgo: ["Aargau","Upper_Alsace","Waldstatte"],

  Brabante: ["Brabant", "Antwerp"],

  Limburgo: ["Limburg"],

  Aragón: ["Mallorca","Jativa","Orihuela","Valencia","Castellon","Alcaniz","Teruel","Calatayud","Zaragoza","Huesca","Barbastro","Urgell","New_Catalonia","Osona","Barcelona","Girona","Rosello"],

  Sicilia: ["Noto","Demena","Girgenti","Mazara","Calabria_Ultra","Calabria_Citra","Basilicata","Otranto","Bari","Capitanata","Principato_Ultra","Principato_Citra","Molise","Abruzzo_Citra","Abruzzo_Ultra","Lavoro"],
  
  Nápoles: ["Calabria_Ultra","Calabria_Citra","Basilicata","Otranto","Bari","Capitanata","Principato_Ultra","Principato_Citra","Molise","Abruzzo_Citra","Abruzzo_Ultra","Lavoro"],

  Trinacria: ["Noto","Demena","Girgenti","Mazara"],

  Castilla: ["Coruna","Santiago","Lugo","Astorga","Ourense","West_Asturias","Benavente","Leon","Montana","East_Asturias","Palencia","Lerma","Soria","Burgos","Alava","Biscay","Gipuzkoa","Valladolid","Zamora","Ciudad_Rodrigo","Salamanca","Avila","Segovia","Guadalajara","Caceres","Merida","Badajoz","Cuenca","Alarcon","Albacete","Hellin","Murcia","Jaen","Cordoba","Sevilla","Cadiz","Huelva","Villanueva_de_la_Serena","Trujillo","Toledo","Ocana","West_Mancha","East_Mancha","Madrid","Plasencia"],

  Navarra: ["Navarre"],

  Portugal: ["Minho", "Tras_Os_Montes", "Beira_Alta", "Beira_Litoral", "Beira_Baixa", "Estremadura", "Alto_Alentejo", "Baixo_Alentejo", "Algarve", "Ribatejo", "Azores"],

  Francia: ["Narbonnais","Razes","Foix","Comminges","Armagnac","Tursan","Bearn_Bigorre","Bayonne","Bazadais","Perigord","Bordelais","Saintonge","Lower_Poitou","Anjou","Ebroicien","Caennais","Lower_Maine","Upper_Maine","Cotentin","Rouennais","Caux","Nantais","Vannetais","Ploermel","Rennais","Tregor","Cornouaille","Touraine","Upper_Poitou","Lower_Berry","La_Marche","Limousin","Turenne","Quercy","Angouleme","Agenais","Toulousain","Castres","Rouergue","Nimois","Gevaudan","Vivarais","Upper_Auvergne","Lower_Auvergne","Lyonnais","Combraille","Bourbon","Upper_Berry","Blois","Orleanais","Perche","Chartrain","Pays_France","Gatinais","Senonais","Auxerrois","Nevernais","Autunnais","Beaujolais","Ponthieu","Beauvaisis","Amienois","Vermandois","Soissonais","Brie_Champenois","Remois","Champagne","Perthois","Upper_Artois","Roman_Flanders"],

  Bretaña: ["Tregor", "Cornouaille", "Vannetais"],

  Artois: ["Upper_Artois", "Lower_Artois"],

  Henao: ["Hainaut"],

  Holanda: ["North_Holland", "South_Holland"],

  "Estados Pontificios": ["Campagna","Marittima","Patrimonio","Spoleto","Marche","Urbino","Romagna","Perugia","Bologna"],

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
  Bohemia: '#6b56a5',
  Hungría: '#db772f',
  Polonia: '#da63cc',
  Austria: '#8E293C',
  Baviera: '#69c4c4',
  Luxemburgo: '#8E8B29',
  Bizancio: '#6A8E29',
  Lituania: '#43298E',
  Milán: '#1a6684',
  Habsburgo: '#298E70',
  Brabante: '#568E29',
  Limburgo: '#298E84',
  Sicilia: '#8E6A29',
  Nápoles: '#56298E',
  Trinacria: '#6A298E',
  Castilla: '#efe558',
  España: '#C5A62B',
  Navarra: '#84a531',
  Mallorca: '#7E8E29',
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
  "Corona de Castilla": '#C5A62B',
  "Corona de Aragón": '#ba3737',
  "Países Bajos y Flandes": '#3E6F91',
  "Estados Italianos": '#6F7652',
  "Polonia-Lituania": '#8B5AA5',
  "Bizancio y Oriente latino": '#6A8E29',
  Escandinavia: '#4F7393',
};

// Color de respaldo por si algún día añades un reino a PERSONAS y te
// olvidas de darle color aquí (para que no rompa nada, solo se vea gris).
export const REINO_COLOR_DEFAULT = '#5C5346';

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
export const REINO_VERSIONES = {

  Nápoles: [
    { desde: 1506,
      hasta: Infinity, // Nápoles bajo Aragón
      ids: [],},
  ],

  Trinacria: [
    { desde: 1506,
      hasta: Infinity, // Trinacria bajo Aragón
      ids: [],},
  ],

  Borgoña: [
    { desde: 1363,
      hasta: 1404, // Felipe el Audaz
      ids: ["Lower_Artois","Upper_Artois","West_Flanders","Roman_Flanders","East_Flanders","Aval","Millieu","Amont","Dijonnais","Autunnais","Auxerrois","Nevernais","Rethelois"],},
    { desde: 1467,
      hasta: 1474, // Felipe III el Bueno
      ids: ["North_Holland","Limburg","Kempenland","South_Holland","Antwerp","East_Luxembourg","West_Luxembourg","Hainaut","Lower_Artois","Vermandois","Upper_Artois","West_Flanders","Roman_Flanders","East_Flanders","Brabant","Namur","Loon","Liege","Amienois","Ponthieu","Dijonnais","Aval","Millieu","Amont","Autunnais","Auxerrois"],},
    { desde: 1474,
      hasta: 1478, // Lorena
      ids: ["North_Holland","Limburg","Kempenland","South_Holland","Antwerp","East_Luxembourg","West_Luxembourg","Hainaut","Lower_Artois","Vermandois","Upper_Artois","West_Flanders","Roman_Flanders","East_Flanders","Brabant","Namur","Loon","Liege","Amienois","Ponthieu","Dijonnais","Aval","Millieu","Amont","Autunnais","Auxerrois","Gelderland","Overijssel","Niederrhein","Pays_Nancy","Pays_Messin","Vosges","Verdunois","Barrois","Upper_Alsace"],},
    { desde: 1478,
      hasta: 1493, // Pérdidas a Luis IX (1477)
      ids: ["Gelderland","Overijssel","Niederrhein","North_Holland","Limburg","Kempenland","South_Holland","Antwerp","East_Luxembourg","West_Luxembourg","Hainaut","West_Flanders","Roman_Flanders","East_Flanders","Brabant","Namur","Loon","Liege",],},
    { desde: 1493,
      hasta: Infinity, // Felipe el Hermoso, T.Senils 1493
      ids: ["Gelderland","Overijssel","Niederrhein","North_Holland","Limburg","Kempenland","South_Holland","Antwerp","East_Luxembourg","West_Luxembourg","Hainaut","Lower_Artois","Upper_Artois","West_Flanders","Roman_Flanders","East_Flanders","Brabant","Namur","Loon","Liege","Aval","Millieu","Amont"],},
  ],

  Hungría: [
    { desde: -Infinity,
      hasta: 1301, // fin de la dinastía Árpád
      ids: ["Zagreb","Torda","Doboka","Szekelyfold","Kiralyfold","Feher","Maramaros","Zemplen","Szepes","Trencsen","Pozsony","Hont","Nograd","Heves","Buda","Sopron","Vas","Zala","Somogy","Baranya","Fejer","Csongrad","Szolnok","Bihar","Szatmar","Szabolcs","Kraszna","Pest","Bacs","Csanad","Bjelovar","Una_Sana","Lika","North_Dalmatia","Vukovar_Syrmia"],},
    { desde: 1301,
      hasta: Infinity, // dinastías Anjou / Luxemburgo / Jagellón: se suman los Banatos orientales
      ids: ["Zagreb","Torda","Doboka","Szekelyfold","Kiralyfold","Feher","Maramaros","Zemplen","Szepes","Trencsen","Pozsony","Hont","Nograd","Heves","Buda","Sopron","Vas","Zala","Somogy","Baranya","Fejer","Csongrad","Szolnok","Bihar","Szatmar","Szabolcs","Kraszna","Pest","Bacs","Csanad","Zarand_Hun","East_Banat","West_Banat","Vukovar_Syrmia","Bjelovar","Una_Sana","Lika","North_Dalmatia"],},
  ],

  Aragón: [
    { desde: -Infinity,
      hasta: 1326, // Sin cerdeña
      ids: ["Mallorca","Jativa","Orihuela","Valencia","Castellon","Alcaniz","Teruel","Calatayud","Zaragoza","Huesca","Barbastro","Urgell","New_Catalonia","Osona","Barcelona","Girona","Rosello"],},
    { desde: 1326,
      hasta: 1447, // Corcega y Cerdeña
      ids: ["Mallorca","Jativa","Orihuela","Valencia","Castellon","Alcaniz","Teruel","Calatayud","Zaragoza","Huesca","Barbastro","Urgell","New_Catalonia","Osona","Barcelona","Girona","Rosello","Cagliari","Arborea","Logudoro","Gallura","Cismonte","Pumonte"],},
    { desde: 1447,
      hasta: 1506, // Con Cerdeña
      ids: ["Mallorca","Jativa","Orihuela","Valencia","Castellon","Alcaniz","Teruel","Calatayud","Zaragoza","Huesca","Barbastro","Urgell","New_Catalonia","Osona","Barcelona","Girona","Rosello","Cagliari","Arborea","Logudoro","Gallura"],},
    { desde: 1506,
      hasta: Infinity, // Con Cerdeña Nápoles y Sicilia
      ids: ["Mallorca","Jativa","Orihuela","Valencia","Castellon","Alcaniz","Teruel","Calatayud","Zaragoza","Huesca","Barbastro","Urgell","New_Catalonia","Osona","Barcelona","Girona","Rosello","Cagliari","Arborea","Logudoro","Gallura","Noto","Demena","Girgenti","Mazara","Calabria_Ultra","Calabria_Citra","Basilicata","Otranto","Bari","Capitanata","Principato_Ultra","Principato_Citra","Molise","Abruzzo_Citra","Abruzzo_Ultra","Lavoro"],},
  ],

  Castilla: [
    {
      desde: -Infinity,
      hasta: 1492, //
      ids:["Coruna","Santiago","Lugo","Astorga","Ourense","West_Asturias","Benavente","Leon","Montana","East_Asturias","Palencia","Lerma","Soria","Burgos","Alava","Biscay","Gipuzkoa","Valladolid","Zamora","Ciudad_Rodrigo","Salamanca","Avila","Segovia","Guadalajara","Caceres","Merida","Badajoz","Cuenca","Alarcon","Albacete","Hellin","Murcia","Jaen","Cordoba","Sevilla","Cadiz","Huelva","Villanueva_de_la_Serena","Trujillo","Toledo","Ocana","West_Mancha","East_Mancha","Madrid","Plasencia"],
    },
    {
      desde: 1492,
      hasta: Infinity, // incorporación de Granada
      ids:["Coruna","Santiago","Lugo","Astorga","Ourense","West_Asturias","Benavente","Leon","Montana","East_Asturias","Palencia","Lerma","Soria","Burgos","Alava","Biscay","Gipuzkoa","Valladolid","Zamora","Ciudad_Rodrigo","Salamanca","Avila","Segovia","Guadalajara","Caceres","Merida","Badajoz","Cuenca","Alarcon","Albacete","Hellin","Murcia","Jaen","Cordoba","Sevilla","Cadiz","Huelva","Villanueva_de_la_Serena","Trujillo","Toledo","Ocana","West_Mancha","East_Mancha","Madrid","Plasencia", "Almeria","Granada","Malaga"],
    },
  ],

  Austria: [
    {
      desde: -Infinity,
      hasta: 1300, // Rodolfo I ////1276
      ids: ["Aargau","Upper_Alsace","Waldstatte","Unter_dem_Manhartsberg","Ober_dem_Manhartsberg","Ober_dem_Wienerwald","Unter_dem_Wienerwald","Eastern_Styria","Upper_Styria","Middle_Styria","Lower_Carinthia","Traungau","Muhlviertel","Lower_Styria","Thurgau",],
    },
    {
      desde: 1300,
      hasta: 1378, // ???
      ids: ["Aargau","Upper_Alsace","Thurgau","Unter_dem_Manhartsberg","Ober_dem_Manhartsberg","Ober_dem_Wienerwald","Unter_dem_Wienerwald","Eastern_Styria","Lower_Styria","Lower_Carniola","Upper_Carniola","Lower_Carinthia","Middle_Styria","Upper_Styria","Traungau","Muhlviertel","Waldstatte",],
    },
    {
      desde: 1378,
      hasta: 1400, // ???
      ids: ["Aargau","Upper_Alsace","Waldstatte","Unter_dem_Manhartsberg","Ober_dem_Manhartsberg","Ober_dem_Wienerwald","Unter_dem_Wienerwald","Eastern_Styria","Upper_Styria","Middle_Styria","Lower_Carinthia","Traungau","Muhlviertel","Lower_Styria","Thurgau","Upper_Carniola","Lower_Carniola","South_Tirol","Oberinntal","Unterinntal"],
    },
    {
      desde: 1400,
      hasta: Infinity, // aproximación pendiente de revisión histórica
      ids: ["Upper_Alsace","Unter_dem_Manhartsberg","Ober_dem_Manhartsberg","Ober_dem_Wienerwald","Unter_dem_Wienerwald","Eastern_Styria","Upper_Styria","Middle_Styria","Lower_Carinthia","Traungau","Muhlviertel","Lower_Styria","Upper_Carniola","Lower_Carniola","South_Tirol","Oberinntal","Unterinntal","Upper_Carinthia","Istria","Gorizia","Hegau","Vorarlberg"],
    },
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
  // «España» funciona como paraguas cartográfico de las dos coronas
  // peninsulares de la Monarquía Hispánica. Navarra mantiene un reinado
  // separado en los datos y por eso no se añade aquí automáticamente.
  if (reino === "España") {
    return [...new Set([
      ...idsDeReinoEnAño("Castilla", año),
      ...idsDeReinoEnAño("Aragón", año),
    ])];
  }
  if (reino === "Corona de Castilla") return idsDeReinoEnAño("Castilla", año);
  if (reino === "Corona de Aragón") return idsDeReinoEnAño("Aragón", año);

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
  "España",
  "Portugal",
  "Navarra",
  "Sacro Imperio",
  "Austria",
  "Bohemia",
  "Baviera",
  "Países Bajos y Flandes",
  "Estados Italianos",
  "Hungría",
  "Polonia-Lituania",
  "Bizancio y Oriente latino",
  "Escandinavia",
];

// Jerarquía semántica usada por los filtros. Los grupos que no son nombres
// literales del campo `reinos` (por ejemplo «Corona de Castilla») funcionan como
// categorías de exploración; sus chips hijos siguen permitiendo elegir cada
// territorio concreto. Un territorio puede aparecer en varios grupos cuando
// su historia política o geográfica lo justifica (Borgoña, Silesia, Saboya…).
export const TERRITORIOS_SUB = {
  Francia: [
    "Alençon", "Angulema", "Anjou", "Aquitania", "Artois", "Auvernia",
    "Berry", "Borgoña", "Borbón", "Boulogne", "Bretaña", "Champaña",
    "Clermont", "Évreux", "Foix", "Guisa", "La Marche", "Montpellier",
    "Orleans", "Ponthieu", "Provenza", "Saint-Pol", "Valois", "Vendôme",
  ],

  Inglaterra: ["Gales", "Irlanda", "Richmond", "Suffolk", "York"],
  Escocia: [],

  España: ["Corona de Castilla", "Corona de Aragón"],
  "Corona de Castilla": ["Castilla", "León"],
  "Corona de Aragón": ["Aragón", "Gandía", "Mallorca", "Urgel", "Valencia"],
  Portugal: ["Brasil"],
  Navarra: [],

  "Sacro Imperio": [
    "Alemania", "Austria", "Austria Interior", "Baviera", "Bohemia",
    "Borgoña", "Brabante", "Carintia", "Cléveris", "Flandes", "Habsburgo",
    "Henao", "Holanda", "Limburgo", "Lorena", "Luxemburgo", "Milán",
    "Monferrato", "Moravia", "Nassau", "Países Bajos", "Palatinado",
    "Piamonte", "Saboya", "Sajonia", "Silesia", "Suabia", "Tirol",
    "Turingia",
  ],
  Austria: ["Austria Interior", "Carintia", "Habsburgo", "Tirol"],
  Bohemia: ["Moravia", "Silesia"],
  Baviera: [],

  "Países Bajos y Flandes": [
    "Artois", "Borgoña", "Brabante", "Cléveris", "Flandes", "Henao",
    "Holanda", "Limburgo", "Luxemburgo", "Países Bajos",
  ],

  "Estados Italianos": [
    "Estados Pontificios", "Ferrara", "Florencia", "Forlì", "Gravina",
    "Mantua", "Milán", "Monferrato", "Nápoles", "Parma", "Pesaro",
    "Piamonte", "Romaña", "Saboya", "Sicilia", "Tarento", "Toscana",
    "Trinacria",
  ],

  Hungría: ["Transilvania"],
  "Polonia-Lituania": ["Lituania", "Polonia", "Silesia"],
  "Bizancio y Oriente latino": ["Bizancio", "Durazzo", "Imperio Latino"],
  Escandinavia: ["Dinamarca", "Noruega", "Suecia"],
};

// Un mismo territorio puede pertenecer a más de una agrupación de filtro
// (por ejemplo, Milán aparece tanto bajo el Sacro Imperio como bajo Estados
// Italianos). Por eso el mapa inverso conserva TODOS sus padres.
export const TERRITORIO_A_PRINCIPALES = Object.fromEntries(
  [...new Set(Object.values(TERRITORIOS_SUB).flat())].map((hijo) => [
    hijo,
    Object.entries(TERRITORIOS_SUB)
      .filter(([, hijos]) => hijos.includes(hijo))
      .map(([principal]) => principal),
  ])
);

// Compatibilidad con código anterior: devuelve el primer padre, pero la
// interfaz nueva usa `territorioCoincideConFiltro` y no pierde pertenencias.
export const TERRITORIO_A_PRINCIPAL = Object.fromEntries(
  Object.entries(TERRITORIO_A_PRINCIPALES).map(([hijo, padres]) => [hijo, padres[0]])
);

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
  if (Array.isArray(persona.reinados)) {
    return persona.reinados.filter((r) =>
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
  return persona?.gobernante === true ? [...new Set(persona?.reinos || [])] : [];
}

export function esGobernante(persona) {
  if (!persona) return false;
  if (typeof persona.gobernante === "boolean") return persona.gobernante;
  const reinadosDetallados = listaReinados(persona);
  if (reinadosDetallados.length) return reinadosDetallados.some(reinadoEsEfectivo);
  const titulo = String(persona.titulo || "").trim();
  // Los títulos que empiezan por Consorte o Noble no se interpretan como
  // gobierno aunque después incluyan una dignidad póstuma o discutida.
  if (/^(Consorte|Noble)\b/i.test(titulo)) return false;
  return TITULOS_GOBERNANTES.some((tituloGobernante) =>
    new RegExp(`(^|\\s|/)${tituloGobernante}(\\s|$|/)`, "i").test(titulo)
  );
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
