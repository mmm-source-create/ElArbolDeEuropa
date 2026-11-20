// 6.0.8: sources for the governor-general mandates added in 6.0.7. Each claim
// cites one admitted repertory (Deutsche Biographie, Real Academia de la
// Historia or the Dizionario Biografico degli Italiani) and the passage used.
// Where a repertory gives other years, the note says so; the Atlas keeps the
// years of the succession of governors.
const db = (sfz, title, ref, locator) => ({title:`Deutsche Biographie · ${title} (${ref})`,url:`https://www.deutsche-biographie.de/${sfz}.html`,locator});
const rah = (path, title, locator) => ({title:`Real Academia de la Historia · ${title}`,url:`https://historia-hispanica.rah.es/biografias/${path}`,locator});
const S = Object.freeze({
  engelbert: db('sfz13287','Engelbert II. von Nassau','ADB 6, 1877, p. 128','Biografía: «wiederholt Lieutenant des pays de par deça»; muerte en 1504'),
  croy: db('sfz11130','Croÿ, Wilhelm von','ADB 4, 1876, pp. 620-621','Biografía: nombrado en 1506, poco antes del viaje de Felipe el Hermoso a España, «Generalstatthalter sämmtlicher Niederlande»'),
  margarethe: db('sfz58204','Margarethe, Erzherzogin von Österreich','NDB 16, 1990, pp. 159-161','Cabecera: «Statthalterin der Niederlande (seit 1507)»; † 30.11.1530 Malinas'),
  maria: db('sfz58384','Maria, Königin von Ungarn','NDB 16, 1990, pp. 207-209','Cabecera: «Statthalterin der Niederlande»'),
  emanuele: {title:'Treccani · Dizionario Biografico degli Italiani · Emanuele Filiberto, duca di Savoia',url:'https://www.treccani.it/enciclopedia/emanuele-filiberto-duca-di-savoia_(Dizionario-Biografico)/',locator:'Biografía: nombramiento como «governatore generale dei Paesi Bassi» tras la abdicación de Carlos V y la salida de María de Hungría (1555)'},
  mansfeld: db('sfz57866','Mansfeld, Peter Ernst I. Fürst von','NDB 16, 1990, p. 79','Biografía: «übernahm er 1592 die Verwaltung der Statthalterschaft bis 1594»'),
  ernst: db('sfz56867','Ernst, Erzherzog von Österreich','NDB 4, 1959, p. 617','Cabecera: «Statthalter der Niederlande»; † 1595 Bruselas'),
  fuentes: rah('15354-pedro-enriquez-de-guzman-de-acevedo-y-toledo','Pedro Enríquez de Guzmán de Acevedo y Toledo','Cabecera biográfica: «Gobernador, ra de los Países Bajos»; Zamora, c. 1525 – Milán, 22.VII.1610'),
  albrecht: db('sfz56559','Albrecht VII., Erzherzog von Österreich','NDB 1, 1953, p. 170','Biografía: «1596 wurde er Statthalter der Niederlande und übernahm hier, nachdem er … sich vermählt hatte, die Regierung selbständig»'),
  isabella: db('sfz36483','Isabella Clara Eugenia','ADB 14, 1881, pp. 610-611','Biografía: Alberto recibió con su mano «die Niederlande als Brautschatz»; muerte de la «Statthalterin» en diciembre de 1633'),
  fernando: rah('5212-fernando-de-austria','Fernando de Austria, el Cardenal Infante','Cabecera biográfica: «Infante de España, cardenal y gobernador de los Países Bajos españoles»; † Bruselas, 9.XI.1641'),
  melo: rah('30346-francisco-de-braganza-melo','Francisco de Braganza Melo','Cabecera biográfica: «Gobernador, ra de los Países Bajos»'),
  moura: rah('32384-manuel-de-moura-y-corte-real','Manuel de Moura y Corte Real','Cabecera biográfica: «teniente de gobernador y capitán general de los Países Bajos»; Madrid, 17.VIII.1592 – 26.I.1651'),
  leopold: db('sfz50452','Leopold Wilhelm, Erzherzog von Österreich','NDB 14, 1985, pp. 296-298','Cabecera: «Statthalter der Spanischen Niederlande (1646–56)»; biografía: Felipe IV le confió la gobernación en 1646'),
  juanjose: rah('5243-juan-jose-de-austria','Juan José de Austria','Cabecera biográfica: «virrey de Flandes»; «Gobernador, ra de los Países Bajos»'),
  caracena: rah('5787-luis-de-benavides-carrillo-de-toledo','Luis de Benavides Carrillo de Toledo, marqués de Caracena','Cabecera biográfica: «Gobernador y capitán general del Milanesado y de los Países Bajos»'),
  villahermosa: rah('3105-carlos-aragon-gurrea-y-borja','Carlos Aragón Gurrea y Borja, duque de Villahermosa','Biografía: «la gobernación de los Países Bajos, donde había permanecido entre 1675 y 1678»'),
  farnesio: rah('15939-alejandro-farnesio','Alejandro Farnesio, príncipe de Parma','Cabecera biográfica: «Gobernador de los Países Bajos, consejero de Estado, virrey de Navarra y de Cataluña»'),
  gastanaga: rah('1494-francisco-antonio-agurto-y-salcedo','Francisco Antonio Agurto y Salcedo, marqués de Gastañaga','Biografía: «fue nombrado gobernador general de los Países Bajos del Sur en 1685, desempeñando su cargo hasta 1692»'),
  maxemanuel: db('sfz59368','Maximilian II. Emanuel, Kurfürst von Bayern','NDB 16, 1990, pp. 480-485','Cabecera: «Generalstatthalter der Spanische Niederlande (1691–1714)»'),
  bedmar: rah('12840-isidro-melchor-de-la-cueva-y-benavides','Isidro Melchor de la Cueva y Benavides, marqués de Bedmar','Cabecera biográfica: «gobernador de Flandes»; «Gobernador, ra de los Países Bajos»'),
  eugen: db('sfz52925','Eugen, Prinz von Savoyen','NDB 4, 1959, pp. 673-678; ADB 6, 1877, pp. 406-421','NDB: recibió la gobernación de los Países Bajos austríacos, ejercida por su vicario Prié; ADB: «Im November 1724 verzichtete er auf diesen Posten»'),
  daun: db('sfz27628','Daun, Wirich Philipp Graf von','ADB 5, 1877, p. 115','Biografía: «1725 Gouverneur der spanischen Niederlande»'),
  harrach: db('sfz26107','Harrach, Friedrich Graf von','NDB 7, 1966, p. 700','Biografía: tras la muerte de la gobernadora María Isabel, «dort Interims-Statthalter»'),
  karl: db('sfz70325','Karl, Prinz von Lothringen und Bar','NDB 11, 1977, p. 237','Biografía: «1744 übernahm K. gemeinsam mit seiner Frau die Statthalterschaft in den österreichischen Niederlanden»; † 1780 Tervuren'),
  christine: db('sfz58361','Maria Christine, Erzherzogin von Österreich','NDB 16, 1990, p. 200','Cabecera: «Statthalterin der Österreichischen Niederlande»; biografía: expulsión en la revolución de 1789 y regreso en 1791'),
  albert: db('sfz56539','Albert Kasimir, Herzog von Sachsen-Teschen','NDB 1, 1953, p. 131','Biografía: «1780-92 Generalgouverneur der Niederlande»'),
  karlTeschen: db('sfz57317','Karl, Erzherzog von Österreich','NDB 11, 1977, p. 242','Biografía: «1793/94 Generalgouverneur daselbst»'),
});
const review = (source, note) => ({certainty:'documented',sources:[source],note,reviewedAt:'2026-11-20',editor:'El Árbol de Europa'});
const inferred = (sources, note) => ({certainty:'inferred',sources,note,reviewedAt:'2026-11-20',editor:'El Árbol de Europa'});
const UNCONFIRMED_MOURA = 'Sin confirmar. Ningún repertorio admitido consultado documenta su gobierno; la RAH lo presenta como presidente del Consejo de Flandes. El mandato se deduce de la sucesión de gobernadores entre Caracena y Villahermosa.';
const k = (id, from, to, title) => `person:${id}:government:Países Bajos:${from}:${to}:${title}`;
const OFFICE = 'La fuente confirma el cargo; los años siguen la sucesión documentada de gobernadores generales.';
export const NETHERLANDS_GOVERNOR_REVIEWS_608 = Object.freeze({
  [k('ENGELBERT2NASSAU',1501,1504,'Gobernador')]:review(S.engelbert,'La ADB lo da como lugarteniente de los Países Bajos en las ausencias del príncipe hasta su muerte en 1504.'),
  [k('GUILLERMOCROY',1506,1506,'Gobernador')]:review(S.croy,'Nombrado en 1506, antes de la partida de Felipe el Hermoso a Castilla.'),
  [k('GUILLERMOCROY',1507,1507,'Gobernador')]:review(S.croy,'Siguió al frente del gobierno tras la muerte de Felipe el Hermoso hasta la llegada de Margarita de Austria en 1507.'),
  [k('MARGAUST',1507,1530,'Gobernadora')]:review(S.margarethe,'Gobernadora desde 1507 hasta su muerte en Malinas en 1530.'),
  [k('MARIAAUST',1531,1555,'Gobernadora')]:review(S.maria,OFFICE),
  [k('EMANUELFILIBERTOSAB',1555,1559,'Gobernador')]:review(S.emanuele,'Gobernación general de Felipe II tras la abdicación de Carlos V; el DBI la vincula a su nombramiento previo como capitán general.'),
  [k('MANSFELDPETER',1592,1594,'Gobernador')]:review(S.mansfeld,'Gobierno interino tras la muerte de Alejandro Farnesio, hasta la llegada del archiduque Ernesto.'),
  [k('ERNESTOAUST',1594,1595,'Gobernador')]:review(S.ernst,'Llegó a Bruselas en 1594 y murió allí en febrero de 1595.'),
  [k('FUENTESCONDE',1595,1596,'Gobernador')]:review(S.fuentes,OFFICE),
  [k('ALB7AUST',1596,1598,'Gobernador')]:review(S.albrecht,'Gobernador general por Felipe II desde 1596.'),
  [k('ALB7AUST',1598,1621,'Soberano')]:review(S.albrecht,'Tras su matrimonio con Isabel Clara Eugenia gobernó los Países Bajos como soberano junto a ella.'),
  [k('ISABCLARAEUG',1598,1621,'Soberana')]:review(S.isabella,'Los Países Bajos fueron la dote de su matrimonio con Alberto; desde 1621 gobernó como gobernadora de Felipe IV.'),
  [k('FERNCARDINFANTE',1634,1641,'Gobernador')]:review(S.fernando,'Gobernador desde su llegada a Bruselas en 1634 hasta su muerte allí en 1641.'),
  [k('FRANCISCOMELO',1641,1644,'Gobernador')]:review(S.melo,OFFICE),
  [k('MANUELMOURA',1644,1647,'Gobernador')]:review(S.moura,'La RAH lo llama «teniente de gobernador y capitán general»: gobernó de forma interina hasta la llegada del archiduque Leopoldo Guillermo.'),
  [k('LEOPGUILLERMO',1647,1656,'Gobernador')]:review(S.leopold,'La NDB fecha el nombramiento en 1646; llegó a Bruselas en 1647.'),
  [k('JUANJOSEAUST',1656,1659,'Gobernador')]:review(S.juanjose,OFFICE),
  [k('CARACENA',1659,1664,'Gobernador')]:review(S.caracena,OFFICE),
  [k('VILLAHERMOSA',1675,1677,'Gobernador')]:review(S.villahermosa,'La RAH sitúa su gobierno entre 1675 y 1678; su sucesor Alejandro Farnesio tomó posesión en 1678.'),
  [k('ALEJFARNESIOPR',1678,1682,'Gobernador')]:review(S.farnesio,OFFICE+' La RAH fecha su muerte en 1687; otras fuentes, en 1689.'),
  [k('GASTANAGA',1685,1692,'Gobernador')]:review(S.gastanaga,'Gobernador general desde 1685 hasta 1692.'),
  [k('MAX2EMANBAV',1692,1700,'Gobernador')]:review(S.maxemanuel,'La NDB cuenta el cargo desde su nombramiento en 1691; tomó posesión en 1692.'),
  [k('MAX2EMANBAV',1701,1706,'Gobernador')]:review(S.maxemanuel,'Tras Ramillies (1706) perdió la mayor parte del país; conservó el título hasta 1714.'),
  [k('ISIDOROCUEVA',1701,1704,'Gobernador')]:review(S.bedmar,OFFICE),
  [k('EUGENIOSABOYA',1716,1724,'Gobernador')]:review(S.eugen,'Gobernó por medio de su vicario, el marqués de Prié. La ADB data la renuncia en noviembre de 1724; la NDB, en 1725.'),
  [k('DAUNWIRICH',1725,1725,'Gobernador')]:review(S.daun,'Gobierno interino en 1725, antes de la llegada de la archiduquesa María Isabel.'),
  [k('HARRACH',1741,1744,'Gobernador')]:review(S.harrach,'Gobernador interino tras la muerte de María Isabel en 1741.'),
  [k('MARIAANAGOV',1744,1744,'Gobernadora')]:review(S.karl,'Asumió la gobernación con su marido en 1744 y murió en Bruselas ese mismo año.'),
  [k('CHARLESALEXLOR',1744,1780,'Gobernador')]:review(S.karl,'Gobernador desde 1744 hasta su muerte en Tervuren en 1780; la ocupación francesa de 1745–1748 interrumpió su gobierno efectivo.'),
  [k('MARIACRISTINATESCHEN',1781,1789,'Gobernadora')]:review(S.christine,'Expulsada por la revolución brabanzona de 1789.'),
  [k('MARIACRISTINATESCHEN',1790,1791,'Gobernadora')]:review(S.christine,'Regreso a Bruselas en 1791, tras la restauración austríaca.'),
  [k('MARIACRISTINATESCHEN',1792,1793,'Gobernadora')]:review(S.christine,OFFICE),
  [k('ALBERTTESCHEN',1781,1789,'Gobernador')]:review(S.albert,'La NDB da 1780–1792; la pareja tomó posesión en Bruselas en 1781.'),
  [k('ALBERTTESCHEN',1790,1791,'Gobernador')]:review(S.albert,'La NDB da 1780–1792 sin detallar la interrupción revolucionaria.'),
  [k('ALBERTTESCHEN',1792,1793,'Gobernador')]:review(S.albert,'La NDB cierra el cargo en 1792; el Atlas lo prolonga hasta el relevo por el archiduque Carlos en 1793.'),
  [k('CARLOSTESCHEN',1793,1794,'Gobernador')]:review(S.karlTeschen,'Último gobernador general, hasta la retirada austríaca de 1794.'),
  // 6.0.9: no admitted repertory documents these five mandates. They are kept
  // as inferred from the documented succession and the note says so.
  [k('FRANCISCOMOURA',1664,1665,'Gobernador')]:inferred([S.caracena,S.villahermosa],UNCONFIRMED_MOURA),
  [k('FRANCISCOMOURA',1666,1668,'Gobernador')]:inferred([S.caracena,S.villahermosa],UNCONFIRMED_MOURA),
  [k('INIGOMELCHORVELASCO',1668,1670,'Gobernador')]:inferred([S.caracena,S.villahermosa],'Sin confirmar. Ningún repertorio admitido consultado documenta su gobierno; la RAH lo presenta como presidente del Consejo de Flandes. El mandato se deduce de la sucesión de gobernadores entre Caracena y Villahermosa.'),
  [k('MONTERREY',1670,1675,'Gobernador')]:inferred([S.caracena,S.villahermosa],'Sin confirmar. Ningún repertorio admitido consultado documenta su gobierno. El mandato se deduce de la sucesión de gobernadores hasta la llegada de Villahermosa, que la RAH sitúa en 1675.'),
  [k('GRANA',1682,1685,'Gobernador')]:inferred([S.farnesio,S.gastanaga],'Sin confirmar. Ningún repertorio admitido consultado documenta su gobierno; la Deutsche Biographie solo tiene su ficha de autoridad (1639–1685). El mandato se deduce del hueco entre Alejandro Farnesio y el nombramiento de Gastañaga en 1685.'),
});
