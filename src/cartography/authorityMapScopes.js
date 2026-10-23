import {germanSwissScope} from './regions/germanSwissRoutes.js';
import {easternEuropeScope} from './regions/easternEuropeRoutes.js';
import {franceLowCountriesScope} from './regions/franceLowCountriesRoutes.js';
import {iberiaItalyScope} from './regions/iberiaItalyRoutes.js';
import {medievalBalkanScope} from './regions/medievalBalkanRoutes.js';
import {bosniaHumScope} from './regions/bosniaHumRoutes.js';
import {posavinaRagusaScope} from './regions/posavinaRagusaRoutes.js';
import {balkansFullScope} from './regions/balkansFullRoutes.js';
import {netherlandsGovernorScope} from './netherlandsGovernorScopes.js';
// Dated regional scopes shared by painting, inspection and the coverage audit.
// Each ID remains an approximate map cell; sources document authority and named sites.
const AUTHORITY_MAP_SCOPES = Object.freeze([
  {
    personId:'CARLOS3NAP',territory:'Nápoles',from:1381,through:1381,
    excludedIds:['Corfu'],
    source:{title:'Spyros N. Asonitis · Mentalities and Behaviours of the Feudal Class of Corfu',url:'https://ojs.lib.uom.gr/index.php/BalkanStudies/article/download/3187/3211',locator:'pp. 206–208: guarniciones de Jacques de Baux en 1381, expulsadas por los partidarios de Carlos en 1382.'},
    note:'La conquista de Nápoles en 1381 no adelanta el dominio de Corfú, recuperado en 1382.'
  },
  {
    "personId": "SULEYMANCELEBI",
    "territory": "Imperio otomano",
    "from": 1402,
    "through": 1411,
    "layer": "Balcanes meridionales otomanos",
    "ids": [
      "Constantia_Bul",
      "Archar",
      "Aytos",
      "Bansko",
      "Beden",
      "Bitola",
      "Boruy",
      "Bozhenitsa",
      "Bukelon",
      "Cherven",
      "Demotica",
      "Drama",
      "Dupnitsa",
      "Edirne",
      "Elhovo",
      "Gigen",
      "Haskovo",
      "Hayrabolu",
      "Hotalich",
      "Kavala",
      "Kesan",
      "Kicevo",
      "Kirklareli",
      "Kocani",
      "Komotini",
      "Kostenets",
      "Kozelj",
      "Kran",
      "Kratovo",
      "Krupnik",
      "Ktenia",
      "Kumanovo",
      "Kutlovitsa",
      "Lardeja",
      "Lom",
      "Lovech",
      "Luleburgaz",
      "Lyaskovets",
      "Malgara",
      "Melnik",
      "Nevrokop",
      "Nikopol",
      "Nis",
      "Ohrid",
      "Ormenio",
      "Oryahovo",
      "Ovech",
      "Perperek",
      "Pleven",
      "Plovdiv",
      "Prilep",
      "Prosek",
      "Razgrad",
      "Ruse",
      "Rusokastro",
      "Samokov",
      "Serres",
      "Shtip",
      "Shumen",
      "Skopje",
      "Smolyan",
      "Sredets",
      "Stanimaka",
      "Stipon",
      "Strelcha",
      "Strumica",
      "Svoge",
      "Targoviste_Bul",
      "Tarnovo",
      "Tetovo",
      "Tryavna",
      "Tsepina",
      "Veles",
      "Veliki_Preslav",
      "Vidin",
      "Vratsa",
      "Xanthia"
    ],
    "source": {
      "title": "Levent Kayapınar · TDV İslâm Ansiklopedisi · Süleyman Çelebi, Emîr",
      "url": "https://islamansiklopedisi.org.tr/suleyman-celebi-emir",
      "locator": "Tratado de 1403 y cesiones a Bizancio; recuperación de territorios danubianos por Mircea después de Ankara"
    },
    "additionalSources": [
      {"title":"Machiel Kiel · TDV · Niš","url":"https://islamansiklopedisi.org.tr/nis","locator":"Gobierno otomano de Niš hasta su entrega a Stefan en 1413; recuperación en 1428, devolución en 1444 y conquista definitiva en 1456."},
      {"title":"Museo de Knjaževac · Koželj","url":"https://muzejknjazevac.org.rs/en/knjazevac-and-its-surroundings/","locator":"Koželj medieval y dominio turco regional desde 1396; no documenta cada campaña ni una frontera exacta."},
      {
        "title": "Machiel Kiel · TDV İslâm Ansiklopedisi · Balçık",
        "url": "https://islamansiklopedisi.org.tr/balcik",
        "locator": "Párrafos históricos de 1389–1419: Mircea recuperó Dobruja y castillos costeros tras Ankara; dominio hasta su muerte en 1418 y conquista otomana de 1419"
      }
    ],
    "note": "Núcleo interior conservador de Rumelia durante el interregno. Se excluyen las costas cedidas o de límites inciertos y Dobruja, recuperada por Mircea. No representa una frontera exacta ni un imperio reunificado."
  },
  {
    "personId": "MUSACELEBI",
    "territory": "Imperio otomano",
    "from": 1410,
    "through": 1410,
    "layer": "Balcanes meridionales otomanos",
    "ids": [
      "Edirne"
    ],
    "source": {
      "title": "Fahameddin Başar · TDV İslâm Ansiklopedisi · Mûsâ Çelebi",
      "url": "https://islamansiklopedisi.org.tr/musa-celebi",
      "locator": "Campañas de 1410 y poder regional 1411–1413; ataques a Bizancio y Serbia no equivalen a un territorio conquistado estable"
    },
    "note": "Control regional rival. En 1410 solo se representa la ocupación temporal de Edirne; desde 1411 se conserva un núcleo interior de Rumelia y se reservan la costa bizantina y Dobruja."
  },
  {
    "personId": "MUSACELEBI",
    "territory": "Imperio otomano",
    "from": 1411,
    "through": 1413,
    "layer": "Balcanes meridionales otomanos",
    "ids": [
      "Constantia_Bul",
      "Archar",
      "Aytos",
      "Bansko",
      "Beden",
      "Bitola",
      "Boruy",
      "Bozhenitsa",
      "Bukelon",
      "Cherven",
      "Demotica",
      "Drama",
      "Dupnitsa",
      "Edirne",
      "Elhovo",
      "Gigen",
      "Haskovo",
      "Hayrabolu",
      "Hotalich",
      "Kavala",
      "Kesan",
      "Kicevo",
      "Kirklareli",
      "Kocani",
      "Komotini",
      "Kostenets",
      "Kozelj",
      "Kran",
      "Kratovo",
      "Krupnik",
      "Ktenia",
      "Kumanovo",
      "Kutlovitsa",
      "Lardeja",
      "Lom",
      "Lovech",
      "Luleburgaz",
      "Lyaskovets",
      "Malgara",
      "Melnik",
      "Nevrokop",
      "Nikopol",
      "Nis",
      "Ohrid",
      "Ormenio",
      "Oryahovo",
      "Ovech",
      "Perperek",
      "Pleven",
      "Plovdiv",
      "Prilep",
      "Prosek",
      "Razgrad",
      "Ruse",
      "Rusokastro",
      "Samokov",
      "Serres",
      "Shtip",
      "Shumen",
      "Skopje",
      "Smolyan",
      "Sredets",
      "Stanimaka",
      "Stipon",
      "Strelcha",
      "Strumica",
      "Svoge",
      "Targoviste_Bul",
      "Tarnovo",
      "Tetovo",
      "Tryavna",
      "Tsepina",
      "Veles",
      "Veliki_Preslav",
      "Vidin",
      "Vratsa",
      "Xanthia"
    ],
    "source": {
      "title": "Fahameddin Başar · TDV İslâm Ansiklopedisi · Mûsâ Çelebi",
      "url": "https://islamansiklopedisi.org.tr/musa-celebi",
      "locator": "Campañas de 1410 y poder regional 1411–1413; ataques a Bizancio y Serbia no equivalen a un territorio conquistado estable"
    },
    "additionalSources": [
      {"title":"Machiel Kiel · TDV · Niš","url":"https://islamansiklopedisi.org.tr/nis","locator":"Gobierno otomano de Niš hasta su entrega a Stefan en 1413; recuperación en 1428, devolución en 1444 y conquista definitiva en 1456."},
      {"title":"Museo de Knjaževac · Koželj","url":"https://muzejknjazevac.org.rs/en/knjazevac-and-its-surroundings/","locator":"Koželj medieval y dominio turco regional desde 1396; no documenta cada campaña ni una frontera exacta."},
      {
        "title": "Machiel Kiel · TDV İslâm Ansiklopedisi · Balçık",
        "url": "https://islamansiklopedisi.org.tr/balcik",
        "locator": "Párrafos históricos de 1389–1419: Mircea recuperó Dobruja y castillos costeros tras Ankara; dominio hasta su muerte en 1418 y conquista otomana de 1419"
      }
    ],
    "note": "Control regional rival. En 1410 solo se representa la ocupación temporal de Edirne; desde 1411 se conserva un núcleo interior de Rumelia y se reservan la costa bizantina y Dobruja."
  },
  {
    "personId": "MOSESSZEKELY",
    "territory": "Transilvania",
    "from": 1603,
    "through": 1603,
    "layer": "Transilvania",
    "ids": [
      "Alba_Iulia",
      "Cluj",
      "Odorhei",
      "Targu_Mures",
      "Felvint",
      "Cristuru_Secuiesc"
    ],
    "evidenceGroups": [
      {
        "ids": [
          "Alba_Iulia"
        ],
        "source": {
          "title": "Ildikó Hankó · Királyaink tömegsírban",
          "url": "https://mek.oszk.hu/04000/04092/html/",
          "locator": "Historia de la catedral de Gyulafehérvár: entrega de la ciudad a las tropas de Moisés Székely el 9 de mayo de 1603"
        }
      },
      {
        "ids": [
          "Cluj"
        ],
        "source": {
          "title": "György Gaal · Kincses Kolozsvár",
          "url": "https://mek.oszk.hu/07500/07523/html/01.htm",
          "locator": "Apartado sobre1603: Kolozsvár aceptó las condiciones de Moisés Székely; la guarnición pudo salir acompañada por el príncipe"
        }
      },
      {
        "ids": [
          "Odorhei",
          "Targu_Mures",
          "Felvint",
          "Cristuru_Secuiesc"
        ],
        "source": {
          "title": "Judit Balogh · La formación de la nobleza székely",
          "url": "https://mek.oszk.hu/03100/03187/03187.htm",
          "locator": "Elección de Moisés Székely y apoyos de Udvarhelyszék,Marosszék,Aranyosszék; lealtad imperial de Csík,Gyergyó,Kászon,Háromszék"
        }
      }
    ],
    "note": "Seis núcleos que apoyaron al príncipe o fueron tomados en 1603. Las sedes orientales fieles al emperador y el espacio sajón quedan fuera. La escala anual reúne los cambios de primavera y julio."
  },
  {
    "personId": "GIORGIOBASTA",
    "territory": "Transilvania",
    "from": 1602,
    "through": 1604,
    "layer": "Transilvania",
    "ids": [
      "Aiud",
      "Alba_Iulia",
      "Bistrita",
      "Brasov",
      "Cincu",
      "Cluj",
      "Covasna",
      "Cristuru_Secuiesc",
      "Dabaca",
      "Deva",
      "Fagaras",
      "Felvint",
      "Gheorgheni",
      "Gurghiu",
      "Huedin",
      "Hunedoara",
      "Medias",
      "Miercurea_Cluc",
      "Odorhei",
      "Reghin",
      "Sebes",
      "Sfantu_Gheorghe",
      "Sibiu",
      "Sic",
      "Sighisoara",
      "Targu_Mures",
      "Turda"
    ],
    "source": {
      "title": "Academia de Ciencias de Hungría · History of Transylvania",
      "url": "https://mek.oszk.hu/03400/03407/html/118.html",
      "locator": "pp.756–757: Basta yMoisés Székely; ocupación militar con cambios de control en1602–1604"
    },
    "note": "Ámbito de la administración militar imperial, con control disputado en 1602–1603. El cargo terminó en abril de 1604; el mapa anual no reconstruye cada guarnición ni atribuye todo el año al gobernador."
  },
  {
    "personId": "RODOLFO2HRE",
    "territory": "Transilvania",
    "from": 1602,
    "through": 1604,
    "layer": "Transilvania",
    "ids": [
      "Aiud",
      "Alba_Iulia",
      "Bistrita",
      "Brasov",
      "Cincu",
      "Cluj",
      "Covasna",
      "Cristuru_Secuiesc",
      "Dabaca",
      "Deva",
      "Fagaras",
      "Felvint",
      "Gheorgheni",
      "Gurghiu",
      "Huedin",
      "Hunedoara",
      "Medias",
      "Miercurea_Cluc",
      "Odorhei",
      "Reghin",
      "Sebes",
      "Sfantu_Gheorghe",
      "Sibiu",
      "Sic",
      "Sighisoara",
      "Targu_Mures",
      "Turda"
    ],
    "source": {
      "title": "Academia de Ciencias de Hungría · History of Transylvania",
      "url": "https://mek.oszk.hu/03400/03407/html/118.html",
      "locator": "pp.756–757: Basta yMoisés Székely; ocupación militar con cambios de control en1602–1604"
    },
    "additionalSources": [
      {
        "title": "Academia de Ciencias de Hungría · History of Transylvania",
        "url": "https://mek.oszk.hu/03400/03407/html/119.html",
        "locator": "pp.758–764: comisarios imperiales en Transilvania a fines de 1604; elección de Bocskai en 1605"
      }
    ],
    "note": "Ámbito de ocupación imperial, distinguido del cargo del gobernador. Tras abril de 1604 continuó la autoridad mediante comisarios."
  }
]);

export function composeRegionalAuthorityScopes(scopes) {
  const selected = scopes.filter(Boolean);
  if (!selected.length) return null;
  const first = selected[0];
  // A later geographic survey replaces authority only inside its footprint.
  // An explicit exclusion there must win; outside it, earlier evidence survives.
  if (!first.coverageIds || selected.length === 1) return first;
  const covered = new Set(first.coverageIds), ids = new Set(first.ids);
  const disputed = new Set(first.disputedIds || []), sources = [...(first.additionalSources || [])];
  const notes = new Set([first.note]);
  for (const scope of selected.slice(1)) {
    const retained = scope.ids.filter(id => !covered.has(id));
    if (retained.length) {
      retained.forEach(id => ids.add(id));
      (scope.disputedIds || []).filter(id => retained.includes(id)).forEach(id => disputed.add(id));
      sources.push(scope.source, ...(scope.additionalSources || []));
      notes.add(scope.note);
    }
    // A scope without a geographic footprint is a full replacement, as before.
    (scope.coverageIds || scope.ids).forEach(id => covered.add(id));
  }
  if (ids.size === first.ids.length) return first;
  return {...first, ids:[...ids], disputedIds:[...disputed],
    additionalSources:[...new Map(sources.filter(Boolean).map(s => [s.url+'|'+s.locator,s])).values()],
    note:[...notes].filter(Boolean).join(' ')};
}

export function authorityMapScope(personId, territory, year) {
  if(['ALB6BAV','MAXPHILBAV'].includes(personId)&&territory==='Baviera') {
    // The cadet line held the landgraviate, not the electorate: as in the
    // legacy map, its «Baviera» record must not duplicate the elector's cells.
    return {ids:[],source:{title:'Historisches Lexikon Bayerns · Leuchtenberg',
      url:'https://www.historisches-lexikon-bayerns.de/Lexikon/Leuchtenberg%2C_Herz%C3%B6ge_von',
      locator:'La landgraviatura pasa a los Wittelsbach en 1646 y se concede a la rama de Alberto VI.'},
      note:'Rama de Baviera-Leuchtenberg: su título no comprende el electorado de Baviera, que conserva su elector.'};
  }
  if(personId==='FED3HAB'&&territory==='Austria'&&year>=1457&&year<=1493) {
    // A newly assigned legal title must not erase the partition with Albrecht
    // or turn occupied Vienna into Frederick's direct government.
    const lower=['Ganserndorf','Hollabrunn','Korneuburg','Mistelbach','Horn','Krems',
      'Waidhofen_an_der_Thaya','Zwettl','Amstetten','Lilienfeld','Melk','Scheibbs',
      'St_Polten','Tulln','Waidhofen','Austria_Baden','Bruck_Leitha','Vienna'];
    const upper=['Bad_Ischl','Gmunden','Kirchdorf','Steyr','Wels','Freistadt','Perg','Rohrbach'];
    const ids=year<=1461?lower:year<=1463?[]:year>=1485&&year<=1490?upper:[...lower,...upper];
    return {ids,source:{title:'Die Welt der Habsburger · Fraternal strife',
      url:'https://www.habsburger.net/en/chapter/fraternal-strife-emperor-frederick-iii-versus-duke-albrecht-vi',
      locator:'Partición con Alberto VI, pérdida de Viena en 1462 y reunión tras la muerte de Alberto en 1463.'},
      additionalSources:[{title:'Die Welt der Habsburger · Frederick V: from deepest humiliation to late triumph',
        url:'https://www.habsburger.net/en/chapter/frederick-v-deepest-humiliation-late-triumph',
        locator:'Ocupación de Viena por Matías en 1485; residencia de Federico en Linz y muerte de Matías en 1490.'}],
      note:'Ámbito conservador de gobierno efectivo: Austria bajo el Enns antes de 1462; sin superficie personal resuelta en 1462–1463; durante la ocupación húngara de 1485–1490 solo el núcleo conservador de Austria sobre el Enns. La atribución regional de la celda Linz no se fuerza desde el nombre de la ciudad. El título no acredita control de Viena ni absorbe Tirol o Austria Interior.'};
  }
  const germanSwiss = germanSwissScope(personId, territory, year);
  if(territory==='Anhalt-Zerbst'&&['CHRISTIANANHALTZERBST','FRIEDRICHAUGUSTANHALT','JOHANNAELISAHOLST'].includes(personId)
    &&year>=1742&&year<=1793)return {ids:['Zerbst','Jever'],
      source:{title:'Förderverein Schloss Zerbst · Geschichte',url:'https://www.schloss-zerbst.de/html/geschichte.htm'},
      note:'Solo los núcleos de Zerbst y la herencia de Jever que tengan capa activa en este año; no todas las particiones de Anhalt. La celda de Zerbst es una aproximación local, no la frontera del principado.'};
  if(territory==='Anhalt-Dessau')return {ids:[],source:{title:'Deutsche Biographie · Johann Georg II.',url:'https://www.deutsche-biographie.de/sfz53314.html'},
    note:'El gobierno está documentado, pero la capa conjunta de Anhalt no separa Dessau de Bernburg y Zerbst. No se convierte esa capa conjunta en posesión exclusiva del príncipe de Dessau.'};
  if (germanSwiss) return germanSwiss;
  const regional = composeRegionalAuthorityScopes([
    easternEuropeScope(personId, territory, year),
    franceLowCountriesScope(personId, territory, year), iberiaItalyScope(personId, territory, year),
    balkansFullScope(personId, territory, year), medievalBalkanScope(personId, territory, year),
    posavinaRagusaScope(personId, territory, year), bosniaHumScope(personId, territory, year),
  ]);
  if (regional) return regional;
  const governor = netherlandsGovernorScope(personId, territory, year);
  if (governor) return governor;
  if (personId === 'VLADHENMOR' && territory === 'Moravia' && year >= 1197 && year <= 1211)
    return {ids:['Brno','Hodonin','Pernstejn','Vyskov','Bitov','Dacice','Jihlava','Znojmo'],
      source:{title:'Moravské zemské muzeum · Stříbrný poklad ze Střelic',
        url:'https://www.mzm.cz/uploads/tx_aimeos/1.d/files/1/d/1d98ad7e_Stribrny_poklad_ukazka.pdf',
        locator:'p.10: Brno y Znojmo antes de 1212; Olomouc bajo Otakar I.'},
      note:'Gobierno del margrave en Brno y Znojmo; no se le atribuye Olomouc antes de 1212.'};
  return AUTHORITY_MAP_SCOPES.find(scope => scope.personId === personId
    && scope.territory === territory && scope.from <= year && year <= scope.through) || null;
}
