// Curated EU V locations for the post-Mohács frontier. These are documented
// nuclei and conservative regional candidates, not closed modern borders.
// Keep political units separate even when they answer to the same monarch.
import fs from 'node:fs';

const FROM = 1400;
const THROUGH = 1650;
const ENC = 'https://www.enciklopedija.hr/clanak/';
const sources = {
  mohacs: `${ENC}mohacka-bitka`,
  osijek: 'https://hrcak.srce.hr/en/107130',
  vukovarFrontier: 'https://unis.asbu.edu.tr/yayin-detay/2_CZCuCpC_87/beyond-conquest-continuity-and-change-on-the-ottoman-western-frontier-from-the-late-15th-to-mid-16th-century/pdf%3D1',
  ferdinand: 'https://www.habsburger.net/en/chapter/ferdinand-i-new-crowns-habsburgs',
  croatia: `${ENC}hrvatska`,
  cetin: `${ENC}cetinski-sabor`,
  transylvania: `${ENC}transilvanija`,
  transylvaniaInterlude: 'https://gams.uni-graz.at/o:vrancic.introduction/sdef:TEI/get?locale=en&mode=view:transl',
  ottomans: `${ENC}osmansko-carstvo`,
  hungary: `${ENC}madjarska`,
  temesvar: `${ENC}temisvar`,
  bosnia: `${ENC}bosna-i-hercegovina`,
  herzegovina: `${ENC}hercegovacki-sandzak`,
  serbia: `${ENC}srbija`,
  dalmatia: `${ENC}dalmacija`,
  ragusa: `${ENC}dubrovacka-republika`,
  bihac: `${ENC}bihac-grad`,
  wallachia: 'https://enciklopedija.hr/clanak/65082',
  moldavia: 'https://enciklopedija.hr/clanak/moldavija-drzava',
  bender: `${ENC}bender`,
};

const layers = [
  {
    name: 'Núcleo oriental de Zápolya', color: '#756598', active: { from: 1527, through: 1540 },
    note: 'Localidades atribuidas con cautela al partido de Juan Zápolya y su hijo, no toda la Hungría histórica. Su rivalidad con Fernando fue dinástica y militar; Buda cambió de manos antes de la ocupación otomana de 1541.',
    groups: [
      { from: 1527, ids: [
        'Cluj','Turda','Sibiu','Sighisoara','Brasov','Bistrita','Medias','Deva','Hunedoara',
        'Fagaras','Targu_Mures','Reghin','Gheorgheni','Odorhei','Miercurea_Cluc',
        'Sfantu_Gheorghe','Covasna','Cincu','Sebes','Felvint','Sic','Huedin','Dabaca',
        'Gurghiu','Cristuru_Secuiesc','Debrecen','Oradea','Szatmar','Baia_Mare',
        'Nagykallo','Nagyboszormeny','Satoraljaujhely','Zemplin','Miskolc','Hodod',
      ], reason: 'The Zápolya party held Transylvania and eastern Hungarian counties; only a conservative eastern nucleus is colored.', source: sources.transylvania },
      { from: 1529, through: 1540, ids: ['Buda','Pest'], reason: 'Buda returned to John Zápolya after Süleyman’s 1529 campaign and remained his royal seat until the Ottoman occupation in 1541.', source: sources.ottomans },
    ],
  },
  {
    name: 'Hungría real', color: '#bd7b39', active: { from: 1527 },
    note: 'Núcleos estables del reino de Hungría bajo los Habsburgo. No comprende toda la antigua Corona de San Esteban ni implica soberanía efectiva sobre Transilvania o la Hungría otomana. Las franjas disputadas quedan grises.',
    groups: [
      { from: 1527, ids: [
        'Bratislava','Trnava','Nitra','Holic','Hlohovec','Samorin','Magyarovar','Komarom',
        'Gyor','Sopron','Kapuvar','Trencin','Povazska_Bystrica','Zilina',
        'Turciansky_Svaty_Martin','Oravsky_Podzamok','Liptovsky_Mikulas',
        'Banska_Bystrica','Zvolen','Kremnica','Prievidza','Stary_Tekov',
        'Hont','Nograd','Balassagyarmat','Salgotarjan','Gemer','Roznava',
        'Szombathely','Vasvar','Kormend','Zalaegerszeg','Zalavar',
      ], reason: 'Conservative west and northwest/northern Hungarian core after the rival elections.', source: sources.ferdinand },
      { from: 1527, through: 1542, ids: ['Esztergom'], reason: 'Esztergom fell after Buda, in 1543; its previous attribution is limited to the Habsburg side of this pilot.', source: sources.ferdinand },
      { from: 1527, through: 1595, ids: ['Eger'], reason: 'Eger remains a royal stronghold through the 1552 siege and falls to the Ottomans in 1596.', source: `${ENC}eger` },
      { from: 1527, through: 1599, ids: ['Nagykanizsa'], reason: 'Kanizsa was taken by the Ottomans in 1600.', source: `${ENC}budimski-pasaluk` },
    ],
  },
  {
    name: 'Croacia habsbúrgica', color: '#a6664c', active: { from: 1527 },
    note: 'Resto croata bajo la Corona elegida en Cetin en 1527, no un apéndice geográfico de Austria ni la costa dálmata veneciana. Se representan centros y fortalezas conservadores; la Frontera Militar y el área disputada necesitan una capa propia.',
    groups: [
      { from: 1527, ids: ['Zagreb','Varazdin','Koprivnica','Sisak','Otocac','Senj','Slunj'], reason: 'Conservative nuclei of the Croatian crown and frontier after the 1527 election.', source: sources.croatia },
      { from: 1527, through: 1591, ids: ['Bihac'], reason: 'Bihać remained a major Croatian frontier fortress until its Ottoman capture in 1592.', source: `${ENC}bihac` },
      { from: 1579, ids: ['Karlovac'], reason: 'Karlovac was founded as a Habsburg frontier fortress in 1579.', source: `${ENC}karlovac` },
    ],
  },
  {
    name: 'Transilvania', color: '#756598', active: { from: 1541 },
    periods: [{ from: 1541, through: 1550 }, { from: 1556, through: 1650 }],
    note: 'Núcleo del voivodato y luego principado transilvano, distinto del gobierno directo otomano. Después de 1541 los Zápolya lo conservaron bajo soberanía otomana; la ocupación habsbúrgica de 1551–1556 y las crisis posteriores afectan al titular, no convierten al país en una provincia otomana. El título principesco formal se fijó en 1570.',
    groups: [
      { from: 1541, through: 1550, ids: [
        'Alba_Iulia','Aiud','Cluj','Turda','Sibiu','Sighisoara','Brasov','Bistrita',
        'Medias','Deva','Hunedoara','Fagaras','Targu_Mures','Reghin','Gheorgheni',
        'Odorhei','Miercurea_Cluc','Sfantu_Gheorghe','Covasna','Cincu','Sebes',
        'Felvint','Sic','Huedin','Dabaca','Gurghiu','Cristuru_Secuiesc',
      ], reason: 'Conservative Transylvanian heartland before Ferdinand I’s occupation; the Partium and Banat frontier are left for a separate audit.', source: sources.transylvania },
      { from: 1556, ids: [
        'Alba_Iulia','Aiud','Cluj','Turda','Sibiu','Sighisoara','Brasov','Bistrita',
        'Medias','Deva','Hunedoara','Fagaras','Targu_Mures','Reghin','Gheorgheni',
        'Odorhei','Miercurea_Cluc','Sfantu_Gheorghe','Covasna','Cincu','Sebes',
        'Felvint','Sic','Huedin','Dabaca','Gurghiu','Cristuru_Secuiesc',
      ], reason: 'Isabella and John Sigismund returned in 1556 after the Habsburg occupation; the same conservative heartland is shown again.', source: sources.transylvaniaInterlude },
    ],
  },
  {
    name: 'Ocupación habsbúrgica de Transilvania', color: '#bd7b39', active: { from: 1551, through: 1555 },
    periods: [{ from: 1551, through: 1555 }],
    note: 'Administración militar habsbúrgica de Transilvania durante la ocupación de 1551–1555. Es una etapa distinta de Hungría real y del principado de los Zápolya; la serie vuelve a separar Transilvania desde 1556.',
    groups: [
      { from: 1551, through: 1555, ids: [
        'Alba_Iulia','Aiud','Cluj','Turda','Sibiu','Sighisoara','Brasov','Bistrita',
        'Medias','Deva','Hunedoara','Fagaras','Targu_Mures','Reghin','Gheorgheni',
        'Odorhei','Miercurea_Cluc','Sfantu_Gheorghe','Covasna','Cincu','Sebes',
        'Felvint','Sic','Huedin','Dabaca','Gurghiu','Cristuru_Secuiesc',
      ], reason: 'Fernando I’s forces occupied Transylvania in 1551; the layer is limited to the documented occupation period before Isabella and John Sigismund returned in 1556.', source: sources.transylvaniaInterlude },
    ],
  },
  {
    name: 'Hungría otomana', color: '#4d7765', active: { from: 1526 },
    note: 'Conquistas y administración otomana directa en el antiguo reino; la victoria de Mohács no hizo otomana toda Hungría. Buda entra en 1541, Temesvár en 1552 y Eger en 1596. No incluye la Transilvania tributaria.',
    groups: [
      { from: 1526, ids: ['Ilok','Vukovar'], reason: 'Both towns fell to Süleyman’s army during the 1526 campaign; these are city locations, not a claim that all eastern Slavonia was yet a uniformly administered province.', source: sources.vukovarFrontier },
      { from: 1529, ids: ['Osijek'], reason: 'The town was attacked in 1526, but the specialist study of Ottoman records dates its sustained Ottoman-era development from 1529; the map starts the durable layer there.', source: sources.osijek },
      { from: 1541, ids: ['Buda','Pest','Mohacs','Kalocsa'], reason: 'Buda became the center of direct Ottoman administration in 1541; the neighboring central-Hungarian locations are cautious area candidates.', source: sources.hungary },
      { from: 1543, ids: ['Esztergom','Fehervar','Pecs','Szeged'], reason: 'The 1543 campaign took Esztergom and Székesfehérvár; southern central locations follow the Ottoman administrative core.', source: sources.ferdinand },
      { from: 1552, ids: ['Timisoara','Lipova','Arad'], reason: 'Temesvár was taken in 1552; the added Banat locations are regional candidates, not a surveyed frontier.', source: sources.temesvar },
      { from: 1596, ids: ['Eger'], reason: 'Ottoman capture of Eger in 1596.', source: `${ENC}eger` },
      { from: 1600, ids: ['Nagykanizsa'], reason: 'Ottoman capture of Kanizsa in 1600.', source: `${ENC}budimski-pasaluk` },
    ],
  },
  {
    name: 'Bosnia y Herzegovina otomanas', color: '#4d7765', active: { from: 1463 },
    note: 'Sectores de los sanjacados bosnio y herzegovino y sus avances fronterizos, no una restauración del reino de Bosnia. Jajce, Knin y Bihać cambian solo en sus años documentados. La costa veneciana y la República de Ragusa quedan aparte.',
    groups: [
      { from: 1463, ids: ['Vrhbosna','Zenica','Olovo','Foca','Visegrad','Kljuc','Livno','Doboj','Glamoc'], reason: 'Núcleo del sanjacado bosnio tras la caída del reino en 1463; no representa toda la conquista de una sola vez.', source: sources.bosnia },
      { from: 1482, ids: ['Mostar','Trebinje','Nevesinje','Gacko','Pljevlja','Drijeva','Konjic','Ustikolina','Borac','Ravno'], reason: 'La incorporación de Herzegovina se completa hacia 1482; las localidades marcan su núcleo interior y sus valles principales.', source: sources.herzegovina },
      { from: 1499, ids: ['Makarska'], reason: 'Makarska passed into Ottoman control at the end of the fifteenth century.', source: sources.herzegovina },
      { from: 1512, ids: ['Srebrenica','Srebrenik','Teocak','Soli'], reason: 'La expansión del sanjacado de Zvornik incorporó Srebrenica y las fortalezas del noreste bosnio; se fechan aquí y no en la conquista inicial de 1463.', source: sources.bosnia },
      { from: 1522, ids: ['Knin'], reason: 'Knin fell to the Ottoman Bosnian governor in 1522.', source: `${ENC}knin` },
      { from: 1527, ids: ['Jajce'], reason: 'Jajce cayó en diciembre de 1527; se representa el estado al cierre del año.', source: `${ENC}jajce` },
      { from: 1513, ids: ['Sinj'], reason: 'Sinj entered Ottoman rule in 1513; it remains separate from Venetian coastal towns.', source: `${ENC}cetinska-krajina` },
      { from: 1592, ids: ['Bihac'], reason: 'Bihać was captured by Ottoman forces in 1592.', source: `${ENC}bihac` },
    ],
  },
  {
    name: 'Balcanes meridionales otomanos', color: '#4d7765', active: { from: 1400 },
    note: 'Capa de dominio otomano directo, reconstruida con celdas contiguas de Bulgaria, Macedonia, Tracia, Serbia, Albania y Grecia. No existió un único «reino balcánico». Valaquia y Moldavia conservaron gobiernos principescos bajo una soberanía tributaria; Ragusa y los puertos venecianos también quedan separados. La selección regional sigue siendo aproximada donde la frontera local no está documentada.',
    groups: [
      { from: 1400, ids: [
        'Edirne','Sredets','Plovdiv','Tarnovo','Vidin','Nis','Skopje','Bitola','Ohrid','Serres','Veles',
        'Archar','Kutlovitsa','Lom','Vratsa','Oryahovo','Gigen','Pleven','Nikopol','Cherven','Ruse',
        'Razgrad','Tutrakan','Drastar','Shumen','Veliki_Preslav','Targoviste_Bul','Lardeja','Lyaskovets',
        'Tryavna','Hotalich','Lovech','Svoge','Bozhenitsa','Kran','Ktenia','Ovech','Karvuna','Kaliakra',
        'Pangalia','Varna','Constantia_Bul','Kladentsi','Babadag','Enisala','Harsova','Tulcea','Isaccea','Cernavoda',
        'Stipon','Kozelj',
        'Dupnitsa','Samokov','Kostenets','Bansko','Nevrokop','Melnik','Krupnik','Tsepina','Strelcha',
        'Stanimaka','Smolyan','Beden','Perperek','Haskovo','Boruy','Ormenio','Bukelon','Shtip','Kratovo',
        'Kocani','Strumica','Kumanovo','Tetovo','Kicevo','Prilep','Prosek','Kilkis','Gynaikokastro',
        'Rentina','Drama','Kavala','Xanthia','Komotini','Kesan','Demotica','Hayrabolu','Malgara',
        'Rodoscuk','Vize','Corlu','Silivri','Catalca','Kirklareli','Luleburgaz','Kiyikoy','Ahtopol',
        'Burgas','Sozopol','Aytos','Rusokastro','Elhovo'
      ], reason: 'Bulgaria fue incorporada en la década de 1390; Tracia y Macedonia quedaron bajo dominio otomano antes de 1400. Se amplía la mancha con celdas interiores del mapa y se mantienen fuera Valaquia y Moldavia, que conservaron príncipes propios. La frontera regional no equivale a un deslinde catastral.', source: sources.ottomans },
      { from: 1430, ids: ['Thessaloniki'], reason: 'Tesalónica fue conquistada en 1430 y quedó bajo gobierno otomano; la celdilla se incorpora desde esa fecha.', source: `${ENC}solun` },
      { from: 1456, ids: ['Athens','Thebes'], reason: 'Atenas y Tebas pasaron al control otomano en la década de 1450, antes de la conquista de Morea.', source: sources.ottomans },
      { from: 1458, ids: ['Corinth'], reason: 'Corinto fue ocupada en la campaña otomana de 1458; se fecha aparte de la conquista de Morea.', source: sources.ottomans },
      { from: 1459, ids: [
        'Smederevo','Krusevac','Uzice','Valjevo','Vranje','Pristina','Prizren','Novo_Brdo','Krupanj',
        'Debrc','Branicevo','Kucevo','Rudnik','Jagodina','Stalac','Svrljig','Zica','Arilje','Brvenik',
        'Gradac','Soko_Grad','Sjenica','Trgoviste_Ser','Medveda','Prokuplje','Glubocica','Tsaribrod',
        'Pirot'
      ], reason: 'Tras la caída de Smederevo en 1459, el Despotado serbio fue anexionado. Estas celdas cubren el núcleo interior; Belgrado se añade solo desde 1521.', source: sources.serbia },
      { from: 1460, ids: [
        'Mystras','Andravida','Andritsaina','Kyparissia','Vostitsa','Patras','Karytaina','Kalavryta',
        'Kalamata','Tripolitsa','Xylokastro','Veligosti','Leuktron','Oitylo',
        'Astros','Megara','Livadeia','Atalanti','Gravia','Salona','Loidoriki','Neopatras','Zetounion',
        'Bodonitsa'
      ], reason: 'La conquista de Morea en 1460 incorporó el interior del Peloponeso y otros centros griegos. Se excluyen las plazas e islas venecianas; algunos límites locales siguen sin precisión suficiente.', source: sources.ottomans },
      { from: 1540, ids: ['Monemvasia'], reason: 'Monemvasía fue veneciana desde 1463 hasta su entrega a los otomanos en 1540; no se incorpora con Morea en 1460.', source: 'https://monemvasia.gr/2017/05/history/' },
      { from: 1463, ids: ['Argos'], reason: 'Argos siguió siendo una plaza veneciana después de 1460; su conquista otomana se fecha en 1463. La celda no reconstruye las operaciones dentro del año.', source: `${ENC}argos` },
      { from: 1439, through: 1443, ids: ['Branicevo','Kucevo','Debrc','Valjevo','Krupanj','Rudnik','Jagodina','Krusevac','Uzice','Zica','Arilje','Brvenik','Gradac','Smederevo'], reason: 'Núcleo ocupado tras la caída de Smederevo en agosto de 1439, antes de la restitución de agosto de 1444; no incluye Belgrado ni adjudica toda la frontera serbia.', source: 'https://islamansiklopedisi.org.tr/semendire' },
      { from: 1479, ids: ['Shkoder','Kruje','Elbasan','Berat','Koman','Lezha','Avlonya','Argyrokastro','Kleisoura_Epirus'], reason: 'Tras la guerra otomano-veneciana de 1463–1479, el tratado transfirió territorios albaneses al sultán. Durres permanece fuera hasta 1501 y las celdas de montaña no se interpretan como frontera política.', source: sources.ottomans },
      { from: 1501, ids: ['Durres'], reason: 'Durres se incorpora tras el fin de la guerra otomano-veneciana y el cambio de control de 1501.', source: sources.ottomans },
      { from: 1484, ids: ['Cetatea_Alba','Chilia'], reason: 'La campaña de Bayezid II tomó las fortalezas de Chilia y Cetatea Albă en 1484; no se transfiere por ello toda Moldavia al gobierno directo otomano.', source: sources.ottomans },
      { from: 1521, ids: ['Belgrad'], reason: 'Belgrado cayó en 1521, no con la anexión del Despotado serbio en 1459.', source: sources.serbia },
      { from: 1538, ids: ['Tighina'], reason: 'La campaña de 1538 tomó Tighina y la renombró Bender; el principado moldavo siguió existiendo bajo soberanía otomana.', source: sources.bender },
      { from: 1453, ids: ['Constantinople'], reason: 'Constantinopla fue conquistada en 1453.', source: sources.ottomans },
    ],
  },
  {
    name: 'República de Ragusa', color: '#b28d58', active: { from: 1400 },
    note: 'Dubrovnik/Ragusa conservó su gobierno republicano y autonomía incluso al pagar tributo al sultán; no se colorea como provincia otomana ni como dominio veneciano.',
    groups: [
      { from: 1400, ids: ['Dubrovnik','Slano'], reason: 'Urban core and adjacent Ragusan coast; the exact republic boundary remains only approximately represented by two locations.', source: sources.ragusa },
    ],
  },
  {
    name: 'Despotado de Serbia', color: '#756598', active: { from: 1402, through: 1458 },
    periods: [{from: 1402, through: 1438}, {from: 1444, through: 1458}],
    note: 'Estado serbio restaurado tras la batalla de Ankara; su relación tributaria con los otomanos y su frontera fluctuaron. Se muestran celdas conservadoras del núcleo septentrional. Belgrado pasa a Hungría en 1427; La ocupación otomana de 1439–1443 se representa aparte; el despotado fue restituido en agosto de 1444. Smederevo fue la capital hasta la conquista otomana de 1459.',
    groups: [
      { from: 1402, through: 1426, ids: ['Belgrad','Branicevo','Kucevo','Debrc','Valjevo','Krupanj','Rudnik','Jagodina','Krusevac','Uzice','Zica','Arilje','Brvenik','Gradac','Smederevo'], reason: 'Núcleo norte del Despotado durante el gobierno de Esteban Lazarević; Belgrado fue su capital desde 1403 hasta la devolución a Hungría en 1427.', source: sources.serbia },
      { from: 1427, through: 1458, ids: ['Branicevo','Kucevo','Debrc','Valjevo','Krupanj','Rudnik','Jagodina','Krusevac','Uzice','Zica','Arilje','Brvenik','Gradac','Smederevo'], reason: 'Tras 1427, Smederevo sustituyó a Belgrado como capital. La capa termina en 1458, el último año completo antes de la caída del Despotado.', source: sources.serbia },
    ],
  },
  {
    name: 'Reino de Bosnia', color: '#b28d58', active: { from: 1400, through: 1462 },
    note: 'Núcleo del reino de Bosnia antes de la conquista de 1463. La entidad comprendía territorios cambiantes y señoríos fronterizos; las localizaciones coloreadas no pretenden fijar una frontera moderna exacta.',
    groups: [
      { from: 1400, through: 1462, ids: ['Jajce','Kljuc','Zenica','Olovo','Vrhbosna','Foca','Visegrad','Doboj','Srebrenik','Soli','Teocak','Livno','Glamoc','Ravno','Konjic','Ustikolina','Borac'], reason: 'Celdas del núcleo bosnio y de sus principales fortalezas, separadas de las posesiones venecianas y del Despotado serbio. El reino cayó en 1463.', source: sources.bosnia },
    ],
  },
  {
    name: 'Principado de Valaquia', color: '#58738f', active: { from: 1400 },
    note: 'Principado al norte del Danubio con voivodas propios. La soberanía otomana fue tributaria e intermitente; no fue una provincia del Imperio. Se dejan fuera los puertos y fortalezas de la ribera danubiana que tuvieron administración otomana directa.',
    groups: [
      { from: 1400, ids: [
        'Arges','Campulung_Muscel','Cozia','Poenari','Targu_Jiu','Targu_Bengai','Ramnicu_Valcea','Slanic',
        'Valenii_de_Munte','Bukov','Buzau','Parscov','Ramnicu_Sarat','Ploesti','Bucharest','Targoviste',
        'Pitesti','Craiova','Caracal','Dragasani','Slatina','Glavacioc','Rusii_de_Vede','Gratia',
        'Gaiseni','Comana','Slobozia','Meteleu','Lichiresti','Cegani','Orasul_de_Floci','Viziru',
        'Plenita','Strehaia','Stramba','Calafat'
      ], reason: 'Celdas interiores al norte del Danubio que representan el principado y su núcleo valaco. Giurgiu, Turnu, Brăila y otros puertos fronterizos quedan fuera cuando corresponden a administración otomana directa.', source: sources.wallachia },
    ],
  },
  {
    name: 'Principado de Moldavia', color: '#8a6f9d', active: { from: 1400 },
    note: 'Principado con voivodas e instituciones propias, sometido a tributo y soberanía otomana desde mediados del siglo XV. La subordinación no equivale a anexión. Chilia y Cetatea Albă pasan al gobierno otomano directo en 1484; Tighina en 1538.',
    groups: [
      { from: 1400, through: 1483, ids: ['Suceava','Harlau','Campulung_Moldovenesc','Targu_Neamt','Piatra_Lui_Craciun','Roman','Cotnari','Iasi','Dorohoi','Stefanesti','Siret','Putna','Bacau','Vaslui','Husi','Tecuci','Focsani','Crasna','Orhei','Chisinau','Balti','Soroca','Hotin','Tighina','Cetatea_Alba','Chilia'], reason: 'Celdas del principado moldavo al este de los Cárpatos. El tributo aceptado en 1455–1456 no convirtió el principado en provincia otomana; las fortalezas portuarias se separan en 1484.', source: sources.moldavia },
      { from: 1484, through: 1537, ids: ['Suceava','Harlau','Campulung_Moldovenesc','Targu_Neamt','Piatra_Lui_Craciun','Roman','Cotnari','Iasi','Dorohoi','Stefanesti','Siret','Putna','Bacau','Vaslui','Husi','Tecuci','Focsani','Crasna','Orhei','Chisinau','Balti','Soroca','Hotin','Tighina'], reason: 'Tras la pérdida de Chilia y Cetatea Albă en 1484, el resto del principado conserva gobierno propio bajo soberanía tributaria; Tighina permanece moldava hasta 1538.', source: sources.moldavia },
      { from: 1538, ids: ['Suceava','Harlau','Campulung_Moldovenesc','Targu_Neamt','Piatra_Lui_Craciun','Roman','Cotnari','Iasi','Dorohoi','Stefanesti','Siret','Putna','Bacau','Vaslui','Husi','Tecuci','Focsani','Crasna','Orhei','Chisinau','Balti','Soroca','Hotin'], reason: 'La campaña otomana de 1538 incrementó la subordinación y tomó Tighina, sin abolir el principado moldavo.', source: sources.moldavia },
    ],
  },
];

const svg = fs.readFileSync(new URL('./euv-locations-crop.svg', import.meta.url), 'utf8');
const mapIds = new Set([...svg.matchAll(/<path\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]));
const territories = layers.map(layer => {
  for (const group of layer.groups) {
    if (!group.source || !group.reason || !group.ids.length) throw new Error(`Unsourced group: ${layer.name}`);
    if (new Set(group.ids).size !== group.ids.length) throw new Error(`Duplicate map ID in group: ${layer.name}/${group.from}`);
    for (const id of group.ids) if (!mapIds.has(id)) throw new Error(`Missing EU V location: ${layer.name}/${id}`);
    for (const id of group.ids) if (/(mountain|alps|carpathian)/i.test(id)) throw new Error(`Physical feature used as territory: ${layer.name}/${id}`);
  }
  const versions = [];
  for (let year = FROM; year <= THROUGH; year++) {
    const periods = layer.periods || [layer.active];
    const isActive = periods.some(period => period.from <= year && year <= (period.through ?? THROUGH));
  const ids = [...new Set((isActive ? layer.groups : []).filter(group => group.from <= year && year <= (group.through ?? THROUGH))
      .flatMap(group => group.ids))].sort();
    if (!versions.length || JSON.stringify(ids) !== JSON.stringify(versions.at(-1).ids)) {
      versions.push({ from: year, oldIds: [], ids, borderline: [] });
    }
  }
  return { corridor: 'Hungría y Balcanes', name: layer.name, color: layer.color,
    active: layer.active, ...(layer.periods ? { periods: layer.periods } : {}), note: layer.note, versions };
});

for (let year = FROM; year <= THROUGH; year++) {
  const owners = new Map();
  for (const territory of territories) {
    const version = [...territory.versions].reverse().find(candidate => candidate.from <= year);
    for (const id of version?.ids || []) {
      if (owners.has(id)) throw new Error(`Overlapping Balkan claim in ${year}: ${id} / ${owners.get(id)} / ${territory.name}`);
      owners.set(id, territory.name);
    }
  }
}

const output = { from: FROM, through: THROUGH, territories,
  evidence: layers.flatMap(layer => layer.groups.map(group => ({
    territory: layer.name, from: group.from, through: group.through ?? THROUGH,
    ids: group.ids, reason: group.reason, source: group.source,
  }))) };
fs.writeFileSync(new URL('./hungary-balkans-locations.json', import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote Hungary/Balkans pilot: ${territories.length} layers, ${output.evidence.length} sourced groups`);
