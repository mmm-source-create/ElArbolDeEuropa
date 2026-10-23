import {PERSON_NAMING_POLICY} from './personNamingPolicy.js';
import {LOUIS_HUNGARY_SOURCES} from './sources-louis-hungary.js';
import {DURAZZO_SOURCES} from './sources-durazzo.js';
import {AMPLIACION_EDITORIAL_SOURCES} from './sources-ampliacion-editorial.js';
import {ROYAL_COVERAGE_SOURCES} from './sources-royal-coverage.js';
import {DYNASTY_MAP_SOURCES} from './sources-dynasty-map.js';
import {HERALDRY_HOUSE_SOURCES} from './sources-heraldica-casas.js';
import {GERMAN_PRINCES_SOURCES} from './sources-german-princes.js';
import {GERMANY_COMPLETION_SOURCES} from './sources-germany-completion.js';
import {GERMAN_SWISS_SOURCES} from './sources-german-swiss.js';
import {authorityReferences} from '../evidence/authorityReviews.js';
import {ADRIATICO_SOURCES} from "./sources-adriatico-v214.js";
import {ALPES_SOURCES} from './sources-alpes-v213.js';
import {V534_SOURCES} from './sources-v534.js';
import {V538_SOURCES} from './sources-v538.js';
const DOGES_1400_1605 = [
  'MICHELE_STENO_DOGE','PASQUALE_MALIPIERO_DOGE','CRISTOFORO_MORO_DOGE',
  'NICOLO_TRON_DOGE','NICOLO_MARCELLO_DOGE','PIETRO_MOCENIGO_DOGE',
  'ANDREA_VENDRAMIN_DOGE','GIOVANNI_MOCENIGO_DOGE','MARCO_BARBARIGO_DOGE',
  'ANTONIO_GRIMANI_DOGE','PIETRO_LANDO_DOGE','FRANCESCO_DONA_DOGE',
  'MARCANTONIO_TREVISAN_DOGE','FRANCESCO_VENIER_DOGE','LORENZO_PRIULI_DOGE',
  'GIROLAMO_PRIULI_DOGE','PIETRO_LOREDAN_DOGE','ALVISE_MOCENIGO_I_DOGE',
  'SEBASTIANOVENIER','NICOLO_DA_PONTE_DOGE','PASQUALE_CICOGNA_DOGE',
];
// Bibliography shared by the public site, Atlas and generated entity pages.
// A territorial reference supplies context; only explicit person IDs assign a biography.
export const SOURCES = [
  ...LOUIS_HUNGARY_SOURCES,
  ...DURAZZO_SOURCES,
  {"titulo": "Larousse · Anjou", "url": "https://www.larousse.fr/encyclopedie/autre-region/Anjou/105538", "grupo": "Casas y filiaciones", "territorios": [], "personas": [], "nota": "Revisión de las casas, las ramas y sus conexiones: se distingue genealogía, continuidad patrimonial y ejercicio del gobierno."},
  {"titulo": "Medieval Lands · Jerusalem", "url": "https://fmg.ac/Projects/MedLands/JERUSALEM.htm", "grupo": "Casas y filiaciones", "territorios": [], "personas": [], "nota": "Revisión de las casas, las ramas y sus conexiones: se distingue genealogía, continuidad patrimonial y ejercicio del gobierno."},
  {"titulo": "Queens’ College · Record 2004", "url": "https://history.queens.cam.ac.uk/sites/default/files/downloads/record-2004.pdf", "grupo": "Casas y filiaciones", "territorios": [], "personas": [], "nota": "Revisión de las casas, las ramas y sus conexiones: se distingue genealogía, continuidad patrimonial y ejercicio del gobierno."},
  {"titulo": "Larousse · Courtenay", "url": "https://www.larousse.fr/encyclopedie/groupe-personnage/maison_de_Courtenay/114979", "grupo": "Casas y filiaciones", "territorios": [], "personas": [], "nota": "Revisión de las casas, las ramas y sus conexiones: se distingue genealogía, continuidad patrimonial y ejercicio del gobierno."},
  {"titulo": "Larousse · Maisons d’Orléans", "url": "https://www.larousse.fr/encyclopedie/groupe-homonymes/maisons_d_Orléans/136334", "grupo": "Casas y filiaciones", "territorios": [], "personas": [], "nota": "Revisión de las casas, las ramas y sus conexiones: se distingue genealogía, continuidad patrimonial y ejercicio del gobierno."},
  {"titulo": "Treccani · Baldassarre Castiglione", "url": "https://www.treccani.it/enciclopedia/baldassarre-castiglione_(Dizionario-Biografico)/", "grupo": "Casas y filiaciones", "territorios": [], "personas": ["BALDASSARECASTIGLIONE", "CRISTOFOROCASTIGLIONE", "LUIGIAGONZAGACASTIGLIONE", "IPPOLITATORELLI"], "nota": "Revisión de las casas, las ramas y sus conexiones: se distingue genealogía, continuidad patrimonial y ejercicio del gobierno."},

  ...AMPLIACION_EDITORIAL_SOURCES,
  ...HERALDRY_HOUSE_SOURCES,
  ...DYNASTY_MAP_SOURCES,
  ...ROYAL_COVERAGE_SOURCES,
  ...GERMAN_PRINCES_SOURCES,
  {"titulo":"William R. Shepherd · The Growth of Russia, detalle de Azov","url":"https://commons.wikimedia.org/wiki/File:Shepherd-c-138-139.jpg","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Frontera de Azov, reinados de Pedro I y Ana y expansión del XVIII. Las fases 1696–1711 y 1739 se separan de la incorporación general de los cosacos del Don."},
  {"titulo":"Biblioteca Nacional de Lituania · VLE, Rusijos istorija","url":"https://www.vle.lt/straipsnis/rusijos-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Secciones de fragmentación de la Rus, conquista mongola, Moscovia y expansión del zarato. Los principados tributarios conservaron sus gobiernos; se distinguen de las tierras de administración directa de la Horda."},
  {"titulo":"VLE · Ivanas III","url":"https://www.vle.lt/straipsnis/ivanas-iii/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Yaroslavl 1463, Rostov 1474, Nóvgorod 1478, Tver 1485; fin del tributo 1480. La influencia sobre Pskov y Riazán no equivale a anexión."},
  {"titulo":"VLE · Naugardo respublika","url":"https://www.vle.lt/straipsnis/naugardo-respublika/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"República desde 1136, extensión septentrional y tributo a la Horda; Pskov y anexión por Iván III en 1478. El príncipe invitado ejercía funciones militares y judiciales, no soberanía patrimonial absoluta."},
  {"titulo":"VLE · Daumantas de Pskov","url":"https://www.vle.lt/straipsnis/pskovo-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["DAUMANTASPSKOV"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Tverės kunigaikštystė","url":"https://www.vle.lt/straipsnis/tveres-kunigaikstyste/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Principado surgido de Vladímir, rivalidad con Moscú y superioridad mongola; la independencia termina en 1485."},
  {"titulo":"University of Cambridge · Tamga: a fiscal form in post-Mongol Moscow","url":"https://api.repository.cam.ac.uk/server/api/core/bitstreams/bd22b5c1-ef78-48ff-bfd4-124639c072e0/content","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Discusión de cartas de exención de Beloózero y Vólogda, derechos de príncipes locales y anexión de 1486. La subordinación anterior no extingue todos los derechos provinciales."},
  {"titulo":"Universidad Vytautas Magnus · Baltarusija–Lietuva: chrestomatija","url":"https://hmf.vdu.lt/wp-content/uploads/2023/10/2023-BALTARUSIJA-LIETUVA-INTERNRT_.pdf","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Unificación de los principados: Pskov 1510 y Riazán 1521. No se adelanta esta última incorporación al reinado de Iván III."},
  {"titulo":"VLE · Kazanės chanatas","url":"https://www.vle.lt/straipsnis/kazanes-chanatas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Kanato 1438–1552 en el Volga medio, con maríes, chuvasios y udmurtos; subordinación intermitente a Moscú anterior a la conquista no equivale a anexión."},
  {"titulo":"VLE · Mordovijos istorija","url":"https://www.vle.lt/straipsnis/mordovijos-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Tierras mordvinas, superioridad de la Horda, vinculación con Kazán y conquista rusa de 1552."},
  {"titulo":"VLE · Ivanas IV Rūstusis","url":"https://www.vle.lt/straipsnis/ivanas-iv-rustusis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Conquistas de Kazán en 1552 y Astracán en 1556; relaciones de dependencia con Siberia y Nogái separadas del control directo."},
  {"titulo":"VLE · Karelijos istorija","url":"https://www.vle.lt/straipsnis/karelijos-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Carelia vinculada con Nóvgorod; Viborg desde 1293, partición de 1323, transferencia de 1617 y Nystad 1721. La ocupación de 1710 se distingue del reconocimiento por tratado."},
  {"titulo":"Enciclopedia Nacional de Letonia · Livonija","url":"https://enciklopedija.lv/skirklis/150531-Livonija","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Estados territoriales de Livonia: Orden, arzobispado y obispados; no se identifica todo el país con el dominio directo del maestre."},
  {"titulo":"Enciclopedia Nacional de Letonia · Vācu ordenis Livonijā","url":"https://enciklopedija.lv/skirklis/178554-V%C4%81cu-ordenis-Livonij%C4%81","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Rama livonia desde 1237, sucesora de los Hermanos de la Espada; conquistas y autonomía institucional."},
  {"titulo":"Enciclopedia Nacional de Letonia · Zemgale","url":"https://enciklopedija.lv/skirklis/201592-Zemgale","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"División medieval de Semigalia; conquista gradual y ducado de Curlandia y Semigalia desde 1561/1562."},
  {"titulo":"Enciclopedia Nacional de Letonia · Kurzemes un Zemgales hercogiste","url":"https://enciklopedija.lv/skirklis/20830-Kurzemes-un-","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Ducado 1561/1562–1795, feudo con instituciones propias. La dependencia de Polonia-Lituania no lo convierte en provincia de administración directa."},
  {"titulo":"VLE · Latvijos istorija","url":"https://www.vle.lt/straipsnis/latvijos-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Obispados y Orden; secularización de Livonia, Riga, Latgalia, etapa sueca y conquista rusa."},
  {"titulo":"VLE · Livonijos karas","url":"https://www.vle.lt/straipsnis/livonijos-karas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Narva y Tartu 1558, Viljandi y Alūksne 1560, Estonia sueca 1561, ocupaciones de 1572–1577, recuperación de 1578–1582 y tregua de 1583. No se colorea toda Livonia por una sola conquista."},
  {"titulo":"Enciclopedia Nacional de Letonia · zviedru laiks Vidzemē un Inflantija","url":"https://enciklopedija.lv/skirklis/22229-zviedru-laiks-Vidzem%C4%93-un-Inflantija","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Riga conquistada en 1621, Livonia sueca consolidada en 1629 y capitulaciones de 1710; reconocimiento ruso en Nystad 1721. Latgalia no sigue a Riga."},
  {"titulo":"VLE · Piltenės sritis","url":"https://www.vle.lt/straipsnis/piltenes-sritis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Venta a Dinamarca en 1560, compra por la Mancomunidad en 1585, autonomía y unión personal con Curlandia 1661–1717; incorporación rusa en 1795."},
  {"titulo":"Enciclopedia Nacional de Letonia · Piltene","url":"https://enciklopedija.lv/skirklis/98902-Piltene","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Obispado de Curlandia en 1234 y tierras episcopales divididas en 1253; la celda comarcal no acredita cada posesión del obispo."},
  {"titulo":"Canadian Institute of Ukrainian Studies · Zaporizhia, The","url":"https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CZ%5CA%5CZaporizhiaThe.htm","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Ámbito de las Libertades del Ejército Zaporogo, fronteras por Boh, Tiasmyn, Orel y Donets; Sich desde mediados del XVI y supresión en 1775."},
  {"titulo":"Canadian Institute of Ukrainian Studies · Land / Slobidska Ukraine","url":"https://www.encyclopediaofukraine.com/Land.asp","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Regimientos de Sumy, Okhtyrka, Kharkiv, Izium y Ostrohozke; colonización desde los siglos XVI–XVII, separada del Hetmanato y del Kanato de Crimea."},
  {"titulo":"Canadian Institute of Ukrainian Studies · Cossack-Polish War","url":"https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CC%5CO%5CCossack6PolishWar.htm","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Rebelión de 1648, pactos y protectorado de 1654 con autonomía; no anexión uniforme de toda Ucrania."},
  {"titulo":"VLE · Kalmukijos istorija","url":"https://www.vle.lt/straipsnis/kalmukijos-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Estepas cumanas, Horda y Astracán; migración oirata en el XVII, kanato bajo protección rusa y supresión en 1771."},
  {"titulo":"VLE · žemaičių sukilimai","url":"https://www.vle.lt/straipsnis/zemaiciu-sukilimai/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Cesión de 1398, establecimiento efectivo en 1400, rebelión de 1401, nueva cesión 1404 y restauración lituana de 1409; el litoral con Memel no siguió a Samogitia."},
  {"titulo":"VLE · Vytautas Didysis","url":"https://www.vle.lt/straipsnis/vytautas-didysis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["VYTAUTASLIT"],"nota":"Cabecera y filiación: hijo de Kęstutis."},
  {"titulo":"VLE · Švitrigaila","url":"https://www.vle.lt/straipsnis/svitrigaila/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["SVITRIGAILALIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Segismundo Kęstutaitis","url":"https://www.vle.lt/straipsnis/zygimantas-kestutaitis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["ZYGIMANTASLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Lietuvos Didžiosios Kunigaikštystės–Maskvos karas","url":"https://www.vle.lt/straipsnis/lietuvos-didziosios-kunigaikstystes-maskvos-karas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Principados del alto Oká y expansión lituana; los ataques y alianzas no son anexiones de Moscovia ni de Nóvgorod."},
  {"titulo":"VLE · Rusijos santykiai su Lietuva","url":"https://www.vle.lt/straipsnis/rusijos-santykiai-su-lietuva/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Andrúsovo 1667: Smolensk, Severia y Kyiv; Polotsk y Vitebsk permanecen en la Mancomunidad."},
  {"titulo":"VLE · Livonija","url":"https://www.vle.lt/straipsnis/livonija-1/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Orden de Livonia, Estonia danesa y estados episcopales; la subordinación eclesiástica a Riga no implica dominio temporal del arzobispo."},
  {"titulo":"Yücel Öztürk · TDV, Kefe","url":"https://islamansiklopedisi.org.tr/kefe","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Génova hacia 1266 bajo autorización de la Horda; conquista otomana de 1475 y franja costera administrada directamente, distinta del kanato tributario."},
  {"titulo":"Eesti Entsüklopeedia · Pärnu","url":"https://www.entsyklopeedia.ee/artikkel/p%C3%A4rnu3","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Dominio sueco 1562–1565, ruso 1575–1582, polaco posterior, ocupaciones de 1600–1609 y establecimiento sueco en 1617."},
  {"titulo":"Museo de Viljandi · Historia de la ciudad","url":"https://muuseum.viljandimaa.ee/vana/indexbf72.html?id=52&op=body","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Conquista rusa en 1560, dominio polaco en 1582 y sueco desde 1620 hasta 1710."},
  {"titulo":"Museo de Viljandi · Põltsamaa kihelkond","url":"https://muuseum.viljandimaa.ee/vana/aastaraamat/2006/pihlak.pdf","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Põltsamaa fue capital del reino nominal de Magnus y permaneció en la Mancomunidad entre 1582 y 1621; no pertenece al obispado de Dorpat."},
  {"titulo":"P. A. Korchagin · Archivo Estatal de Historia Sociopolítica de Perm","url":"https://www.permgaspi.ru/deyatelnost/izdaniya/istoriya-mestnogo-upravleniya-i-samoupravleniya-v-permskom-krae/book-istoriya-mestnogo-upravleniya-i-samoupravleniya-v-permskom-krae/upravlenie-permskimi-zemlyami-do-vhozhdeniya-v-sostav-russkogo-gosudarstva-v-xv-veke-p-a-korchagin.html","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Campaña de 1472 y persistencia de príncipes locales; la conquista no convierte toda la región moderna de Perm en una provincia uniforme."},
  {"titulo":"VLE · Suomijos istorija","url":"https://www.vle.lt/straipsnis/suomijos-istorija/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Fronteras de Nöteborg 1323, Stolbovo 1617, Nystad 1721 y Åbo 1743; Finlandia occidental continúa sueca hasta 1809."},
  {"titulo":"Halil İnalcık · TDV, Kırım","url":"https://islamansiklopedisi.org.tr/kirim","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Kanato giray, superioridad otomana, independencia de 1774 y anexión rusa de 1783. Las colonias y el eyalato costero no se confunden con el interior del kanato."},
  {"titulo":"VLE · Dono kazokai","url":"https://www.vle.lt/straipsnis/dono-kazokai/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Ejército del Don, relación con los zares y limitación del autogobierno tras Bulavin. No equivale al dominio otomano de Azov."},
  {"titulo":"Canadian Institute of Ukrainian Studies · Southern Ukraine","url":"https://www.encyclopediaofukraine.com/display.asp?linkpath=pages%5CS%5CO%5CSouthernUkraine.htm","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Estepas del sur: fronteras del Kanato de Crimea, Libertades zaporogas y adquisiciones rusas de 1774, 1783 y 1792."},
  {"titulo":"Perm University Herald · Присоединение Перми к Русскому государству","url":"https://press.psu.ru/index.php/history/article/view/10259","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Distinción historiográfica entre campaña de 1472 y anexión administrativa de 1505, cuando desaparece la dinastía local."},
  {"titulo":"Archivo de Komi-Perm · Actas, Kudymkar 2019","url":"https://www.komi-permarchiv.ru/uploads/sbornik.pdf","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Carta de Iván IV a Grigori Stroganov, 4 abril 1558: tierras del Kama por debajo de Gran Perm, hasta Chusovaya, expresamente fuera de la Gran Perm medieval."},
  {"titulo":"Dartmouth College · Encyclopaedia Arctica, Yamalo-Nenets","url":"https://collections.dartmouth.edu/arctica-beta/html/EA10-22.html","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Puestos y redes del bajo Obi; Obdorsk a fines del XVI y comunidades indígenas. No demuestra colonización integral de Yamal."},
  {"titulo":"Lex · Murom","url":"https://lex.dk/Murom","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Principado separado, incorporado a Moscú en 1392; no forma parte de Nizhni Nóvgorod desde 1341."},
  {"titulo":"S. G. Bocharov · Ancient Economic and Social Concepts in the Genoese Gasaria Region","url":"https://www.um.edu.mt/library/oar/bitstream/123456789/34589/1/Ancient_Economic_and_Social_Concepts_in_the_Genoese_Gasaria_Region_2017.pdf","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"p. 201: señorío de Simone Ghisolfi en Matrega desde 1419; enclave vinculado a Caffa, distinto de toda la península."},
  {"titulo":"VLE · Trakų kunigaikštystė","url":"https://www.vle.lt/straipsnis/traku-kunigaikstyste/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":[],"nota":"Trakai, Grodno, tierras yotvingias y Podlasia hasta Brest; influencia sobre Samogitia. Kęstutis hasta 1382; Skirgaila 1382–1392; reunión en el dominio del gran duque en 1392."},
  {"titulo":"VLE · Švarnas","url":"https://www.vle.lt/straipsnis/svarnas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["SVARNASLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Mindaugas","url":"https://www.vle.lt/straipsnis/mindaugas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["MINDAUGASLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Treniota","url":"https://www.vle.lt/straipsnis/treniota/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["TRENIOTALIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Vaišelga","url":"https://www.vle.lt/straipsnis/vaiselga/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["VAISELGALIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Traidenis","url":"https://www.vle.lt/straipsnis/traidenis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["TRAIDENISLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Vytenis","url":"https://www.vle.lt/straipsnis/vytenis-2/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["VYTENISLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Gediminas","url":"https://www.vle.lt/straipsnis/gediminas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["GEDIMINASLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Jaunutis","url":"https://www.vle.lt/straipsnis/jaunutis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["JAUNUTISLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Algirdas","url":"https://www.vle.lt/straipsnis/algirdas/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["ALGIRDASLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Kęstutis","url":"https://www.vle.lt/straipsnis/kestutis/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["KESTUTISLIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Skirgaila","url":"https://www.vle.lt/straipsnis/skirgaila/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["SKIRGAILALIT"],"nota":"Cabecera biográfica y apartados sobre filiación y ejercicio del gobierno; las aproximaciones se conservan en cada afirmación."},
  {"titulo":"VLE · Jogaila","url":"https://www.vle.lt/straipsnis/jogaila/","grupo":"Europa oriental y Báltico","territorios":["Lituania","Rusia","Polonia-Lituania"],"personas":["LADI2"],"nota":"Filiación de Algirdas, reinados lituanos y polacos, gobierno de Vitautas y autoridad superior desde 1392."},

  {titulo:'Service public de Wallonie · Tournai y Tournaisis',url:'https://connaitrelawallonie.wallonie.be/histoire-et-symboles/histoire/atlas-historique/tournai-et-le-tournaisis-sous-influence-anglaise',grupo:'Archivos e instituciones',territorios:['Tournai'],personas:['CARLOS5','FEL2ESP']},
  {"titulo": "Hrvatska enciklopedija · Hum", "url": "https://www.enciklopedija.hr/clanak/hum-podrucje", "grupo": "Archivos e instituciones", "personas": [], "territorios": ["Hum"]},
  {"titulo": "Hrvatska enciklopedija · Sandalj Hranić Kosača", "url": "https://www.enciklopedija.hr/clanak/kosaca-sandalj-hranic", "grupo": "Archivos e instituciones", "personas": ["SANDALJKOS"], "territorios": ["Hum"]},
  {"titulo": "Hrvatska enciklopedija · Pavao I Bribirski", "url": "https://enciklopedija.hr/clanak/bribirski-pavao-i", "grupo": "Archivos e instituciones", "personas": ["PAVAO1SUBIC"], "territorios": ["Hum"]},
  {"titulo": "Hrvatski biografski leksikon · Bribirski knezovi", "url": "https://hbl.lzmk.hr/Clanak/bribirski-knezovi?handler=ButtonSnimi", "grupo": "Archivos e instituciones", "personas": ["MLADEN1SUBIC", "MLADEN2SUBIC"], "territorios": ["Hum"]},
  {"titulo": "Ante Milošević · Stupac iz Donje Zgošće (2021)", "url": "https://hrcak.srce.hr/en/file/381365", "grupo": "Archivos e instituciones", "personas": ["PRIJEZDA2BOS"], "territorios": []},
  {"titulo": "Hrvatska enciklopedija · Drijeva", "url": "https://www.enciklopedija.hr/clanak/drijeva", "grupo": "Archivos e instituciones", "personas": ["HRVOJEHUM"], "territorios": ["Hum"]},
  {"titulo": "Hrvatska enciklopedija · Usora", "url": "https://www.enciklopedija.hr/clanak/usora-podrucje", "grupo": "Archivos e instituciones", "personas": [], "territorios": ["Usora y Soli"]},
  {"titulo": "Hrvatska enciklopedija · Soli", "url": "https://www.enciklopedija.hr/clanak/soli-podrucje", "grupo": "Archivos e instituciones", "personas": [], "territorios": ["Usora y Soli"]},
  {"titulo": "Hrvatska enciklopedija · Srebrenička banovina", "url": "https://www.enciklopedija.hr/clanak/srebrenicka-banovina", "grupo": "Archivos e instituciones", "personas": [], "territorios": ["Srebrenik"]},
  {"titulo": "Hrvatska enciklopedija · Trebinje", "url": "https://www.enciklopedija.hr/clanak/trebinje", "grupo": "Archivos e instituciones", "personas": [], "territorios": ["Travunia"]},

  {"titulo":"Proleksis · Kulin","url":"https://proleksis.lzmk.hr/33125/","grupo":"Archivos e instituciones","personas":["KULINBOS"],"territorios":["Bosnia"]},
  {"titulo":"Institutul de Istorie Nicolae Iorga · Ctitorii Mușatine (1976)","url":"https://biblioteca-digitala.ro/reviste/carte/iini/Adam_Ctitorii-Musatine_1976.pdf","grupo":"Archivos e instituciones","personas":["IUGAMOLD"],"territorios":["Moldavia"]},
  {"titulo":"Muzeul Național de Istorie a României · Lucia Bieltz, MOLDER-LANT (1996)","url":"https://cercetarinumismatice.ro/?articol=61997-molder-lant-o-legenda-inedita-pe-monedele-emise-de-stefan-i-1394-1399-molder-lant-a-new-legend-on-the-coins-issued-by-stephen-i-prince-of-moldavia-1389-1399","grupo":"Archivos e instituciones","personas":["STEFAN1MOLD"],"territorios":["Moldavia"]},
  {"titulo":"Hrvatski biografski leksikon · Kotromanići","url":"https://hbl.lzmk.hr/Clanak/kotromanici?handler=ButtonSnimi","grupo":"Archivos e instituciones","personas":["NINOSLAVBOS","PRIJEZDA1BOS","VUKBOS","TVRTKO1BOS","STEPHEN2BOS"],"territorios":["Bosnia"]},
  {"titulo":"Institutul Național al Patrimoniului · Monede medievale şi moderne","url":"https://www.patrimoniu.ro/ro/profiles/monede-medievale-si-moderne","grupo":"Archivos e instituciones","personas":["VLAD1WAL","VLADISLAV1WAL","RADU1WAL","DAN1WAL","MIRCEA1WAL"],"territorios":["Valaquia","Moldavia"]},

  {titulo:'Historisches Lexikon Bayerns · Pfalz-Neuburg: historia política',url:'https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_45317',grupo:'Archivos e instituciones',territorios:['Palatinado-Neoburgo'],personas:['CARLOS5']},
  {titulo:"Die Welt der Habsburger · Cesión de las tierras austríacas a Fernando I",url:"https://www.habsburger.net/en/chapter/ferdinand-i-overshadowed-his-elder-brother",grupo:"Archivos e instituciones",territorios:["Austria","Austria Interior","Tirol"],personas:["CARLOS5","FERN1EMP"]},
  {titulo:"Die Welt der Habsburger · Partición de 1564",url:"https://www.habsburger.net/en/chapter/tripartite-division-austrian-inheritance",grupo:"Archivos e instituciones",territorios:["Austria","Austria Interior","Tirol"],personas:["MAXIM2","FERN2TIROL","CARLOS2ESTIRIA","FERN2EMP"]},
  {titulo:"Tiroler Landesarchiv · Inventario de la cancillería tirolesa",url:"https://www.tirol.gv.at/fileadmin/themen/kunst-kultur/landesarchiv/downloads/TGQ47.pdf",grupo:"Archivos e instituciones",territorios:["Tirol"],personas:["MAXIM3TIROL","LEOP5TIROL"]},
  {titulo:"Die Welt der Habsburger · Leopoldo V",url:"https://www.habsburger.net/en/persons/habsburg/leopold-v",grupo:"Archivos e instituciones",territorios:["Tirol"],personas:["LEOP5TIROL","CLAUDIA_MEDICI","FERNKARLTIROL","SIGFRANZTIROL"]},
  {titulo:"Universität Innsbruck · Claudia de Médici",url:"https://www.uibk.ac.at/archive/ipoint/buch_der_woche/1126.html",grupo:"Archivos e instituciones",territorios:["Tirol"],personas:["CLAUDIA_MEDICI","FERNKARLTIROL"]},
  {titulo:"Die Welt der Habsburger · Fernando Carlos de Tirol",url:"https://www.habsburger.net/en/persons/habsburg/ferdinand-karl",grupo:"Archivos e instituciones",territorios:["Tirol"],personas:["FERNKARLTIROL","SIGFRANZTIROL"]},
  {titulo:"Die Welt der Habsburger · Segismundo Francisco",url:"https://www.habsburger.net/en/persons/habsburg/sigismund-franz",grupo:"Archivos e instituciones",territorios:["Tirol"],personas:["SIGFRANZTIROL","LEOP1HRE"]},
  {titulo:"Lombardia Beni Culturali · Cronología de los dux de Venecia",url:"https://www.lombardiabeniculturali.it/istituzioni/cronologie/cariche/3/",grupo:"Archivos e instituciones",territorios:["Venecia"],personas:DOGES_1400_1605},
  {titulo:"Treccani · Inocencio XII y la rama de Cerchiara",url:"https://www.treccani.it/enciclopedia/innocenzo-xii_%28Enciclopedia-dei-Papi%29/",grupo:"Repertorios principales",territorios:["Estados Pontificios"],personas:["PAPA_INOCENCIO12","FRANCESCO_PIGN_SPINAZZOLA","PORZIA_CARAFA","FABRIZIO_CARAFA_PORZIA"]},
  {titulo:"Treccani · Francesco Pignatelli y su familia",url:"https://www.treccani.it/enciclopedia/francesco-pignatelli_%28Dizionario-Biografico%29/",grupo:"Repertorios principales",territorios:["Estados Pontificios","Nápoles"],personas:["CARD_FRANCESCO_PIGN","GIULIO_PIGN_CERCHIARA","BEATRICE_CARAFA_NOJA","NICOLA_PIGN_VICERE"]},
  {titulo:"Treccani · Venecia y la expansión en Terraferma",url:"https://www.treccani.it/enciclopedia/venezia-e-l-entroterra_%28Storia-di-Venezia%29/",grupo:"Repertorios principales",territorios:["Venecia","Milán"],personas:["TOMMOCENIGODOGE","FRANFOSCARIDOGE"]},
  {titulo:"Treccani · Creta bajo Venecia",url:"https://www.treccani.it/enciclopedia/la-romania-veneziana_%28Storia-di-Venezia%29/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["TOMMOCENIGODOGE"]},
  {titulo:"Treccani · Chipre entre Venecia y el Imperio otomano",url:"https://www.treccani.it/enciclopedia/cipro/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["AGOBAREDOGE","LEOLOREDANDOGE","ANDGRITTIDOGE"]},
  {titulo:"Treccani · Dogado de Tommaso Mocenigo",url:"https://www.treccani.it/enciclopedia/tommaso-mocenigo/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["TOMMOCENIGODOGE"]},
  {titulo:"Treccani · Dogado de Francesco Foscari",url:"https://www.treccani.it/enciclopedia/francesco-foscari_%28Dizionario-di-Storia%29/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["FRANFOSCARIDOGE"]},
  {titulo:"Treccani · Dogado de Agostino Barbarigo",url:"https://www.treccani.it/enciclopedia/agostino-barbarigo_%28Dizionario-Biografico%29/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["AGOBAREDOGE"]},
  {titulo:"Treccani · Dogado de Leonardo Loredan",url:"https://www.treccani.it/enciclopedia/leonardo-loredan_%28Enciclopedia-Italiana%29/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["LEOLOREDANDOGE"]},
  {titulo:"Treccani · Dogado de Andrea Gritti",url:"https://www.treccani.it/enciclopedia/andrea-gritti_%28Dizionario-Biografico%29/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["ANDGRITTIDOGE"]},
  {titulo:"Treccani · Dogado de Marino Grimani",url:"https://www.treccani.it/enciclopedia/marino-grimani/",grupo:"Repertorios principales",territorios:["Venecia"],personas:["MARGRIMANIDOGE"]},
  {titulo:"Treccani · Parma y los Estados Pontificios",url:"https://www.treccani.it/enciclopedia/parma_%28Dizionario-di-Storia%29/",grupo:"Repertorios principales",territorios:["Parma","Estados Pontificios"],personas:[]},
  {titulo:"Enciclopèdia Catalana · Corona catalanoaragonesa y sus reinos",url:"https://www.enciclopedia.cat/gran-enciclopedia-catalana/corona-catalanoaragonesa",grupo:"Repertorios principales",territorios:["Aragón","Condado de Barcelona","Valencia","Mallorca","Cerdeña"],personas:["FERN2ARAG","CARLOS5"]},
  {titulo:"Treccani · Carlos VI y los cambios italianos de 1706–1734",url:"https://www.treccani.it/enciclopedia/carlo-vi-imperatore-del-sacro-romano-impero_%28Dizionario-di-Storia%29/",grupo:"Repertorios principales",territorios:["Milán","Nápoles","Trinacria","Cerdeña"],personas:["CARLOS6HRE","FEL5ESP"]},
  {titulo:"Treccani · Carlos de Borbón, rey de Nápoles y Sicilia",url:"https://www.treccani.it/enciclopedia/carlo-di-borbone-re-di-napoli-e-di-sicilia_%28Dizionario-Biografico%29/",grupo:"Repertorios principales",territorios:["Nápoles","Trinacria"],personas:["CARLOS3ESP","FERN4NAP"]},
  {titulo:"Treccani · Fernando IV de Nápoles / III de Sicilia",url:"https://www.treccani.it/enciclopedia/ferdinando-i-di-borbone-re-delle-delle-due-sicilie_%28Enciclopedia-Italiana%29/",grupo:"Repertorios principales",territorios:["Nápoles","Trinacria"],personas:["FERN4NAP"]},
  {titulo:"Treccani · Nápoles y las sucesiones de 1707, 1734 y 1759",url:"https://www.treccani.it/enciclopedia/napoli/",grupo:"Repertorios principales",territorios:["Nápoles"],personas:["CARLOS6HRE","CARLOS3ESP","FERN4NAP"]},
  {titulo:"Treccani · Cerdeña durante la Guerra de Sucesión",url:"https://www.treccani.it/enciclopedia/sardegna_%28Dizionario-di-Storia%29/",grupo:"Repertorios principales",territorios:["Cerdeña"],personas:["FEL5ESP","CARLOS6HRE"]},
  {titulo:"Treccani · Saboya y el intercambio de 1720",url:"https://www.treccani.it/enciclopedia/savoia_%28Enciclopedia-Italiana%29/",grupo:"Repertorios principales",territorios:["Cerdeña","Sicilia"],personas:["FEL5ESP","CARLOS6HRE","VICTORAMADEO2SAB"]},
  {titulo:"BnF · Margarita III de Flandes y sus cinco condados",url:"https://catalogue.bnf.fr/ark:/12148/cb16161030k",grupo:"Archivos e instituciones",territorios:["Flandes","Artois","Condado de Borgoña","Nevers","Rethel"],personas:["MARGFLAN","FEL2BORG","JUAN1BORG"]},
  {titulo:"Biblissima/BnF · Luis de Male y la herencia de 1382–1384",url:"https://portail.biblissima.fr/ark:/43093/pdata72015d9dbbe4171cc1369eb56e627ee49a8ef9de",grupo:"Archivos e instituciones",territorios:["Flandes","Artois","Condado de Borgoña","Nevers","Rethel"],personas:["MARGFRAFLA","LUIS2FLA","MARGFLAN"]},
  {titulo:"Metropolitan Museum · Formación de los Países Bajos borgoñones",url:"https://www.metmuseum.org/fr/essays/burgundian-netherlands-court-life-and-patronage",grupo:"Repertorios principales",territorios:["Borgoña","Flandes","Artois","Condado de Borgoña"],personas:["FEL2BORG","JUAN1BORG","FEL3BORG","CAR1BORG","MARIABORG"]},
  {titulo:"Biblissima/BnF · Títulos de Felipe el Bueno",url:"https://portail.biblissima.fr/fr/ark:/43093/pdata71295e340f36a2c35285ffc09fff863e1dd66edb",grupo:"Archivos e instituciones",territorios:["Borgoña","Artois","Condado de Borgoña","Brabante","Limburgo","Holanda","Henao","Zelanda","Luxemburgo","Namur"],personas:["FEL3BORG","CAR1BORG"]},
  {titulo:"Canon van Nederland · Jacoba de Baviera y la sucesión de 1433",url:"https://www.canonvannederland.nl/nl/page/439262/jacoba-van-beieren",grupo:"Archivos e instituciones",territorios:["Holanda","Henao","Zelanda"],personas:["JACOBA","FEL3BORG"]},
  {titulo:"Connaître la Wallonie · Entrada de Felipe el Bueno en Namur",url:"https://connaitrelawallonie.wallonie.be/histoire/timeline/13-mars-1429-entree-de-philippe-de-bourgogne-namur",grupo:"Archivos e instituciones",territorios:["Namur"],personas:["JUAN3NAMUR","FEL3BORG"]},
  {titulo:"Gobierno de Luxemburgo · Adquisición y toma de 1443",url:"https://luxembourg.public.lu/en/society-and-culture/history/helm-holy-roman-empire.html",grupo:"Archivos e instituciones",territorios:["Luxemburgo"],personas:["ISABELGORLITZ","FEL3BORG"]},
  {titulo:"Cambridge University Press · Ponthieu y las ciudades del Somme",url:"https://www.cambridge.org/core/books/abs/war-and-government-in-the-french-provinces/return-to-allegiance-picardy-and-the-francoburgundian-wars-147093/C99410404ADED4EF0ABA86A39803BC3C",grupo:"Repertorios principales",territorios:["Ponthieu","Artois"],personas:["FEL3BORG","CAR1BORG"]},
  {titulo:"BnF Gallica · El condado de Auxerre cedido en 1435",url:"https://gallica.bnf.fr/ark:/12148/bpt6k947101.pdf",grupo:"Archivos e instituciones",territorios:["Auxerre"],personas:["FEL3BORG","CAR1BORG"]},
  {titulo:"Library of Congress · Mapa histórico del ducado de Brabante",url:"https://www.loc.gov/resource/gdcwdl.wdl_01102/",grupo:"Cartografía",territorios:["Brabante"],personas:["ANTONBRAB","JOHN4BRAB","PHILSTPOL","FEL3BORG"]},
  {titulo:"Biblissima · Carlos de Nevers y Rethel",url:"https://portail.biblissima.fr/fr/ark:/43093/pdata8ddd5493a80916491d6eb6a23bd52ecc916100d4",grupo:"Archivos e instituciones",territorios:["Nevers","Rethel"],personas:["PHIL2NEVERS","CAR1NEVERS","JUAN2NEVERS"]},
  {titulo:"Sigilla/IRHT · Juan sin Miedo, conde de Nevers (1384–1404)",url:"https://sigilla.irht.cnrs.fr/A.php/41813",grupo:"Archivos e instituciones",territorios:["Nevers"],personas:["JUAN1BORG","PHIL2NEVERS"]},
  {titulo:"Sigilla/IRHT · Felipe de Nevers y Rethel",url:"https://sigilla.irht.cnrs.fr/44802",grupo:"Archivos e instituciones",territorios:["Nevers","Rethel"],personas:["PHIL2NEVERS","CAR1NEVERS","JUAN2NEVERS"]},
  {titulo:"Université de Liège · Cesión de Rethel a Antonio en 1393",url:"https://orbi.uliege.be/bitstream/2268/247248/1/Trulla%20et%20Cartae.pdf",grupo:"Repertorios principales",territorios:["Rethel"],personas:["MARGFLAN","FEL2BORG","ANTONBRAB"]},
  {titulo:"Rijksmuseum · Alegoría de la abdicación de Carlos V",url:"https://www.rijksmuseum.nl/en/collection/object/Allegory-on-the-Abdication-of-Emperor-Charles-v-in-Brussels--2cb744f2469fe62413bb6aab920d4e03",grupo:"Archivos e instituciones",territorios:["Brabante","Limburgo","Luxemburgo","Güeldres","Flandes","Artois","Henao","Holanda","Zelanda","Namur","Frisia","Utrecht","Overijssel","Groninga"],personas:["CARLOS5","FEL2ESP"]},
  {titulo:"Luxemburgo · El ducado en la herencia borgoñona",url:"https://luxembourg.public.lu/dam-assets/publications/tout-savoir-sur-le-grand-duche-de-luxembourg/tout-savoir-sur-le-grand-duche-de-luxembourg-en.pdf",grupo:"Archivos e instituciones",territorios:["Luxemburgo"],personas:["CAR1BORG","MARIABORG","FEL1CAST","CARLOS5"]},
  {titulo:"Citadelle de Namur · El condado de Namur y Felipe el Bueno",url:"https://citadelle.namur.be/sites/default/files/uploads/la%20citadelle%20de%20Namur.pdf",grupo:"Archivos e instituciones",territorios:["Namur"],personas:["CAR1BORG","MARIABORG","FEL1CAST","CARLOS5"]},
  {titulo:"Canon van Nederland · Carlos V y los Países Bajos",url:"https://www.canonvannederland.nl/nl/karelv",grupo:"Archivos e instituciones",territorios:["Frisia","Utrecht","Overijssel","Drente","Groninga","Güeldres"],personas:["CARLOS5"]},
  {titulo:"DBNL · Acuerdo de Frisia con Carlos V en 1524",url:"https://www.dbnl.org/tekst/_gid001193001_01/_gid001193001_01_0055.php",grupo:"Repertorios principales",territorios:["Frisia"],personas:["CARLOS5"]},
  {titulo:"Canon van Overijssel · El Oversticht en 1528",url:"https://www.canonvannederland.nl/nl/overijssel/overijssel/oversticht",grupo:"Archivos e instituciones",territorios:["Overijssel"],personas:["CARLOS5"]},
  {titulo:"Canon van Drenthe · El poder de Carlos V en 1536",url:"https://www.canonvannederland.nl/nl/page/99041/kinkhorst",grupo:"Archivos e instituciones",territorios:["Drente"],personas:["CARLOS5"]},
  {titulo:"Het Utrechts Archief · Utrecht en Carlos V, 1528",url:"https://www.archieven.nl/nl/zoeken?miadt=39&miaet=14&micode=BIBLIO_BOEK&minr=40665930&mivast=0&miview=ldt&mizig=307",grupo:"Archivos e instituciones",territorios:["Utrecht"],personas:["CARLOS5"]},
  {titulo:"Canon van Groningen · Stadt en Lande, 1536",url:"https://www.canonvannederland.nl/nl/groningen/groningen/habsburgs-gezag",grupo:"Archivos e instituciones",territorios:["Groninga"],personas:["CARLOS5"]},
  {titulo:"Rijksmuseum · Guerras de Güeldres y tratado de Venlo",url:"https://www.rijksmuseum.nl/en/collection/node/Gelderse%2Boorlogen--e8ad752027a7c20d0e2cbf9568e18ca8",grupo:"Archivos e instituciones",territorios:["Güeldres"],personas:["CARLOS5"]},
  {titulo:"BnF · Felipe II y la conquista de Normandía",url:"https://catalogue.bnf.fr/ark:/12148/cb11958988j",grupo:"Archivos e instituciones",territorios:["Francia"],personas:["FEL2FRA"]},
  {titulo:"FranceArchives · Felipe IV y la sucesión navarra",url:"https://francearchives.gouv.fr/fr/facomponent/99021b3b7153c3d2ac6535e7392a4a520f017001",grupo:"Archivos e instituciones",territorios:["Francia","Navarra"],personas:["FEL4FRA","FEL5FRA","CARLOS4FRA","JUANA2NAV"]},
  {titulo:"BnF, CCFr · Tratado de Senlis de 1493",url:"https://ccfr.bnf.fr/portailccfr/ark:/16871/004a80306914",grupo:"Archivos e instituciones",territorios:["Borgoña","Condado de Borgoña","Artois"],personas:["MARIABORG","FEL1CAST","CARLOS5","FEL2ESP"]},
  {titulo:"Cambridge University Press · Irlanda hacia 1530 (mapa)",url:"https://assets.cambridge.org/97805210/89272/frontmatter/9780521089272_frontmatter.pdf",grupo:"Cartografía",territorios:["Irlanda","Tír Eoghain","Tír Chonaill","Thomond","Desmond","Condado de Desmond","Ormond","Kildare"],personas:[]},
  {titulo:"Lombardia Beni Culturali · Stato di Milano (1535–1749)",url:"https://www.lombardiabeniculturali.it/istituzioni/schede/8000356/",grupo:"Archivos e instituciones",territorios:["Milán","Piamonte"],personas:["CARLOS5","FEL2ESP","FEL3ESP","FEL4ESP","CARLOS2ESP","VICTORAMADEO2SAB"]},
  {titulo:"Lombardia Beni Culturali · Milano bajo la dominación española",url:"https://www.lombardiabeniculturali.it/istituzioni/storia/?unita=03.05",grupo:"Archivos e instituciones",territorios:["Milán"],personas:["CARLOS5","FEL2ESP"]},
  {titulo:"Lombardia Beni Culturali · Milano durante la ocupación franco-sarda",url:"https://www.lombardiabeniculturali.it/istituzioni/storia/?unita=03.06",grupo:"Archivos e instituciones",territorios:["Milán"],personas:["CARLOS6HRE","CARLOSEMANUEL3SAB"]},
  {titulo:"PARES · Carlos I",url:"https://pares.cultura.gob.es/ParesBusquedas20/catalogo/autoridad/46080",grupo:"Archivos e instituciones",territorios:["Cerdeña"],personas:["CARLOS5"]},
  {titulo:"PARES · Juana I",url:"https://pares.cultura.gob.es/ParesBusquedas20/catalogo/autoridad/46503",grupo:"Archivos e instituciones",territorios:["Cerdeña"],personas:["JUANA1CAST"]},
  {titulo:"PARES · Felipe III",url:"https://pares.cultura.gob.es/ParesBusquedas20/catalogo/autoridad/46877",grupo:"Archivos e instituciones",territorios:["Cerdeña"],personas:["FEL3ESP"]},
  {titulo:"PARES · Felipe IV",url:"https://pares.cultura.gob.es/ParesBusquedas20/catalogo/autoridad/46878",grupo:"Archivos e instituciones",territorios:["Cerdeña"],personas:["FEL4ESP"]},
  {titulo:"PARES · Carlos II",url:"https://pares.cultura.gob.es/ParesBusquedas20/catalogo/autoridad/46849",grupo:"Archivos e instituciones",territorios:["Cerdeña","Milán","Nápoles","Trinacria"],personas:["CARLOS2ESP"]},
  {titulo:"Die Welt der Habsburger · Ferdinand I: new crowns for the Habsburgs",url:"https://www.habsburger.net/en/chapter/ferdinand-i-new-crowns-habsburgs",grupo:"Archivos e instituciones",territorios:["Hungría"],personas:["FERN1EMP"]},
  {titulo:"Die Welt der Habsburger · Fernando IV",url:"https://www.habsburger.net/en/persons/habsburg/ferdinand-iv",grupo:"Archivos e instituciones",territorios:["Bohemia","Hungría","Alemania"],personas:["FERN4BOH"]},
  ...ALPES_SOURCES,
  ...ADRIATICO_SOURCES,
  ...V534_SOURCES,
  ...V538_SOURCES,
  {
    "titulo": "Foundation for Medieval Genealogy · MedLands",
    "url": "https://fmg.ac/Projects/MedLands/index.htm",
    "grupo": "Repertorios principales",
    "territorios": [
      "Navarra",
      "Foix",
      "Bearne",
      "Albret",
      "Bretaña",
      "Dreux",
      "Penthièvre",
      "Castellbó",
      "Flandes",
      "Henao",
      "Holanda",
      "Zelanda",
      "Brabante",
      "Limburgo",
      "Güeldres",
      "Dinamarca",
      "Noruega",
      "Suecia",
      "Pomerania",
      "Mecklemburgo"
    ],
    "personas": [
      "LUIS6FRA",
      "LUIS7FRA",
      "ROBERT1DREUX",
      "ROBERT2DREUX",
      "PIERRE1BRET",
      "ALIXTHOUARS",
      "ARTHUR2BRET",
      "MARIELIMOGES",
      "JOHN3BRET",
      "GUYPENTHIEVRE",
      "JEANNEAVAUGOUR",
      "JEANNEPENTHIEVRE",
      "CHARLESBLOIS",
      "JOHNMONTPRET",
      "JEANNEFLANDERSBRET",
      "JOHN4BRET",
      "JOANNAVBRET",
      "FRANCOIS1BRET",
      "PIERRE2BRET",
      "RICHARDETAMPES",
      "MARGORLEANSBRET",
      "FRANCOIS2BRET",
      "MARGFOIXBRET",
      "ROGER4FOIX",
      "ROGERBERNARD3FOIX",
      "GASTON7BEARN",
      "MARGUERITEBEARN",
      "GASTON1FOIX",
      "GASTON2FOIX",
      "ALIENORCOMMINGES",
      "AGNESNAVFOIX",
      "GASTONFOIXHEIR",
      "ROGERBERNARD1CASTEL",
      "ROGERBERNARD2CASTEL",
      "MATTHIEUFOIX",
      "ISABELLEFOIX",
      "ARCHAMBAUDGRAILLY",
      "JEANNEALBRETFOIX",
      "ARNAUDALBRET",
      "MARGBOURBONALBRET",
      "CHARLES2ALBRET",
      "JEANTARTAS",
      "JEANFOIXETAMPES",
      "MARIEORLEANSFOIX",
      "GASTONNEMOURS",
      "BLANCA2NAV",
      "VIOLDREUX",
      "BEATCHAMP",
      "BLANCHAMP",
      "JUAN1BRET",
      "ESCLARFOIX",
      "BLANBRET",
      "MARIANAVARRA",
      "LUISEVREUX",
      "JUANAEVREUX",
      "JUAN2BRET",
      "ANAFOIX",
      "GERMANAFOIX",
      "JUAN6BRET",
      "BLANCANAV",
      "GASTONVIANA",
      "JUAN3ALBRET",
      "SANCHO6NAV",
      "BLANCANAVCHAMP",
      "TEOB3CHAMP",
      "ALAINALBRET",
      "FRANCOISECHATILLON",
      "CARLOTAALBRET",
      "ARTURO3BRET",
      "CHARLESDALBRET",
      "YOLANDEDREUXSCOT",
      "HENRY2CHAMPJER",
      "ALICECHAMPJER",
      "GASTON3FEBUS",
      "JOHN1FOIX",
      "MARG2FLANDES",
      "BOUCHARDAVES",
      "GUIL2DAMP",
      "JOHN1AVES",
      "ADELAHOLAVES",
      "JOHN2AVES",
      "PHILIPPALUXAVES",
      "ROB3FLAND",
      "LOUISNEVERS",
      "FLORIS5HOL",
      "BEATFLAHOL",
      "JOHN1HOL",
      "ENRIQ4BRAB",
      "JUAN2BRAB",
      "MARGENGBRAB",
      "JUAN3BRAB",
      "MARIEEVREUXBRAB",
      "ANTONBRAB",
      "JEANNELUXBRAB",
      "JOHN4BRAB",
      "PHILSTPOL",
      "GUIL4HOL",
      "JACOBA",
      "REIN2GUELD",
      "REIN3GUELD",
      "EDUARDGUELD",
      "MARIAGUELDJUL",
      "MATILDEGUELD1371",
      "WILHELM2JUL",
      "GUIL1GUELD",
      "REIN4GUELD",
      "JOHANNJULARKEL",
      "MARIAARKEL",
      "ARNOLDEGMOND",
      "ADOLF1CLEV",
      "MARIABORGCLEV",
      "CATHCLEVEGUELD",
      "ADOLFEGMOND",
      "CHARLESEGMOND",
      "HAAKON4NOR",
      "MARGRETESKULE",
      "MAGNUS6NOR",
      "ERIK4DEN",
      "INGEBORGERIKNOR",
      "HAAKON5NOR",
      "EUFEMIARUGENNOR",
      "OLAF2NORD",
      "INGEBORGVALDEMAR",
      "HENRY3MECK",
      "MARIAMECKPOM",
      "WARTISLAW7POM",
      "CATHPOMNEUMARK",
      "JOHNPALNEUMARK",
      "PHILIPPAENGLAND",
      "ERIKJOHVASA",
      "CECILIAMANSDOTTER",
      "INGEBORGTOTTSTURE",
      "CHRISTINAGYLLEN",
      "INGEBORGNORUEGA",
      "ERICMAGNUSSONSUE",
      "MAGNUS4SUE",
      "BLANCANAMUR",
      "EUPHEMIASUE",
      "HAAKON6NOR",
      "VALDEMAR4DIN",
      "ERICOPOMERANIA",
      "CRISTOBALBAVSUE",
      "CARLOS8SUE",
      "CRISTIAN1NORD",
      "DOROTHEABRAND",
      "JUAN2NORD",
      "CRISTINASAJDIN",
      "ESTENSTUREVIEJO",
      "SVANTENILSSON",
      "ESTENSTUREJOVEN",
      "FRED1DEN",
      "ERIK2NORWAY"
    ],
    "nota": "Reconstrucciones genealógicas y referencias documentales, especialmente útiles para la Edad Media y las ramas dinásticas complejas.",
    "general": true
  },
  {titulo:'Deutsche Nationalbibliothek · Fichas de autoridad (GND)',url:'https://www.dnb.de/gnd',grupo:'Repertorios principales',territorios:[],personas:[],nota:'Fichas normalizadas de personas con fechas vitales, relaciones familiares y cargos. Desde la V5.25 se usan para verificar afirmaciones concretas: solo se marca como documentado lo que la ficha registra igual.',general:true},
  {titulo:'Real Academia de la Historia · Diccionario Biográfico español',url:'https://dbe.rah.es/',grupo:'Repertorios principales',territorios:[],personas:[],nota:'Biografías de referencia para el ámbito hispánico; cada ficha enlaza su artículo cuando existe.',general:true},
  {titulo:'Oxford Dictionary of National Biography',url:'https://www.oxforddnb.com/',grupo:'Repertorios principales',territorios:[],personas:[],nota:'Biografías de referencia para las Islas Británicas; cada ficha enlaza su artículo cuando existe.',general:true},
  {
    "titulo": "Deutsche Biographie",
    "url": "https://www.deutsche-biographie.de/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Biografías y datos de referencia para personajes y casas del ámbito germánico, centroeuropeo y báltico.",
    "general": true
  },
  {
    "titulo": "Treccani",
    "url": "https://www.treccani.it/",
    "grupo": "Repertorios principales",
    "territorios": ["Saboya","Piamonte","Monferrato","Saluzzo"],
    "personas": [],
    "nota": "Apoyo biográfico y contextual para casas italianas, especialmente Médici, Saboya y figuras políticas o culturales del Renacimiento.",
    "general": true
  },
  {
    "titulo": "Encyclopaedia Britannica",
    "url": "https://www.britannica.com/",
    "grupo": "Repertorios principales",
    "territorios": [
      "Flandes",
      "Henao",
      "Holanda",
      "Zelanda",
      "Brabante",
      "Limburgo",
      "Güeldres",
      "Dinamarca",
      "Noruega",
      "Suecia",
      "Pomerania",
      "Mecklemburgo"
    ],
    "personas": [
      "MARG2FLANDES",
      "BOUCHARDAVES",
      "GUIL2DAMP",
      "JOHN1AVES",
      "ADELAHOLAVES",
      "JOHN2AVES",
      "PHILIPPALUXAVES",
      "ROB3FLAND",
      "LOUISNEVERS",
      "FLORIS5HOL",
      "BEATFLAHOL",
      "JOHN1HOL",
      "ENRIQ4BRAB",
      "JUAN2BRAB",
      "MARGENGBRAB",
      "JUAN3BRAB",
      "MARIEEVREUXBRAB",
      "ANTONBRAB",
      "JEANNELUXBRAB",
      "JOHN4BRAB",
      "PHILSTPOL",
      "GUIL4HOL",
      "JACOBA",
      "REIN2GUELD",
      "REIN3GUELD",
      "EDUARDGUELD",
      "MARIAGUELDJUL",
      "MATILDEGUELD1371",
      "WILHELM2JUL",
      "GUIL1GUELD",
      "REIN4GUELD",
      "JOHANNJULARKEL",
      "MARIAARKEL",
      "ARNOLDEGMOND",
      "ADOLF1CLEV",
      "MARIABORGCLEV",
      "CATHCLEVEGUELD",
      "ADOLFEGMOND",
      "CHARLESEGMOND",
      "HAAKON4NOR",
      "MARGRETESKULE",
      "MAGNUS6NOR",
      "ERIK4DEN",
      "INGEBORGERIKNOR",
      "HAAKON5NOR",
      "EUFEMIARUGENNOR",
      "OLAF2NORD",
      "INGEBORGVALDEMAR",
      "HENRY3MECK",
      "MARIAMECKPOM",
      "WARTISLAW7POM",
      "CATHPOMNEUMARK",
      "JOHNPALNEUMARK",
      "PHILIPPAENGLAND",
      "ERIKJOHVASA",
      "CECILIAMANSDOTTER",
      "INGEBORGTOTTSTURE",
      "CHRISTINAGYLLEN",
      "SVANTESTURE",
      "INGEBORGNORUEGA",
      "ERICMAGNUSSONSUE",
      "MAGNUS4SUE",
      "BLANCANAMUR",
      "EUPHEMIASUE",
      "HAAKON6NOR",
      "VALDEMAR4DIN",
      "ERICOPOMERANIA",
      "CRISTOBALBAVSUE",
      "CARLOS8SUE",
      "CRISTIAN1NORD",
      "DOROTHEABRAND",
      "JUAN2NORD",
      "CRISTINASAJDIN",
      "ESTENSTUREVIEJO",
      "SVANTENILSSON",
      "ESTENSTUREJOVEN",
      "ISABAUST",
      "FRED1DEN",
      "CHRISTIAN3DEN",
      "ERIK2NORWAY",
      "CATALINAJAG",
      "CARLOS9SUE",
      "CATALINASUEVASA",
      "CARLOS13SUE",
      "CARLOS14JUAN",
      "FRED6DEN"
    ],
    "nota": "Consulta biográfica e histórica de contraste, útil sobre todo para grandes figuras europeas y marcos dinásticos generales.",
    "general": true
  },
  {
    "titulo": "Wikipedia",
    "url": "https://en.wikipedia.org/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Herramienta auxiliar de localización, cronología y orientación bibliográfica. Los datos sensibles o dudosos se contrastan siempre que es posible con fuentes más especializadas.",
    "general": true
  },
  {
    "titulo": "Historia Hispánica · Real Academia de la Historia",
    "url": "https://historia-hispanica.rah.es/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Apoyo biográfico para personajes y linajes del ámbito hispánico.",
    "general": true
  },
  {
    "titulo": "PARES · Portal de Archivos Españoles",
    "url": "https://pares.mcu.es/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Documentación archivística y descripciones de fondos, muy útil para confirmar filiaciones, cargos y cronologías.",
    "general": true
  },
  {
    "titulo": "Biblioteca Digital · Real Academia de la Historia",
    "url": "https://bibliotecadigital.rah.es/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Genealogías, nobiliarios y repertorios históricos digitalizados empleados en comprobaciones concretas.",
    "general": true
  },
  {
    "titulo": "Kungahuset · Casa Real de Suecia",
    "url": "https://www.kungahuset.se/english/the-monarchy-of-sweden",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Secuencias dinásticas y contexto institucional de la monarquía sueca.",
    "general": true
  },
  {
    "titulo": "Kongehuset · Casa Real de Dinamarca",
    "url": "https://www.kongehuset.dk/en",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Sucesión y marco histórico de la línea danesa, especialmente para Oldemburgo y ramas conectadas.",
    "general": true
  },
  {
    "titulo": "Royal House of the Netherlands",
    "url": "https://www.royal-house.nl/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Información institucional sobre Orange-Nassau y la continuidad dinástica neerlandesa.",
    "general": true
  },
  {
    "titulo": "Burg Hohenzollern",
    "url": "https://burg-hohenzollern.com/en/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Historia de la casa de Hohenzollern y apoyo para la evolución de Brandeburgo y Prusia.",
    "general": true
  },
  {
    "titulo": "MuseoTorino",
    "url": "https://www.museotorino.it/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Material útil para comprobar sucesiones y genealogías ligadas a la casa de Saboya.",
    "general": true
  },
  {
    "titulo": "Stanford Encyclopedia of Philosophy",
    "url": "https://plato.stanford.edu/",
    "grupo": "Historia cultural y política",
    "territorios": [],
    "personas": [],
    "nota": "Especialmente útil para contextualizar autores y obras políticas o filosóficas, como Maquiavelo.",
    "general": true
  },
  {
    "titulo": "Musée du Louvre",
    "url": "https://www.louvre.fr/en",
    "grupo": "Historia cultural y política",
    "territorios": [],
    "personas": [],
    "nota": "Apoyo institucional para episodios concretos de historia cultural y artística, como la trayectoria de la Gioconda.",
    "general": true
  },
  {
    "titulo": "Polish History",
    "url": "https://polishhistory.pl/",
    "grupo": "Historia cultural y política",
    "territorios": [],
    "personas": [],
    "nota": "Contexto histórico para la monarquía electiva, la Unión de Lublin y la República de las Dos Naciones.",
    "general": true
  },
  {
    "titulo": "MapChart",
    "url": "https://www.mapchart.net/",
    "grupo": "Cartografía",
    "territorios": [],
    "personas": [],
    "nota": "Base cartográfica sobre la que se ha construido la representación territorial interactiva.",
    "general": true
  },
  {
    "titulo": "Dictionary of Irish Biography",
    "url": "https://www.dib.ie/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Repertorio biográfico de referencia para personajes y familias de la historia de Irlanda.",
    "general": true
  },
  {
    "titulo": "Encyclopaedia Iranica",
    "url": "https://www.iranicaonline.org/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Enciclopedia de referencia para el ámbito iranio y sus relaciones históricas con Georgia y el Cáucaso.",
    "general": true
  },
  {
    "titulo": "Enciclopedia Georgiana",
    "url": "https://georgianencyclopedia.ge/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Entradas biográficas e históricas para las casas y territorios georgianos.",
    "general": true
  },
  {
    "titulo": "Biographisches Lexikon zur Geschichte Südosteuropas · Leibniz-Institut",
    "url": "https://www.biolex.ios-regensburg.de/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Repertorio biográfico para la historia del sureste de Europa.",
    "general": true
  },
  {
    "titulo": "Encyclopédie Larousse",
    "url": "https://www.larousse.fr/encyclopedie",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Consulta enciclopédica de apoyo para personajes y acontecimientos históricos.",
    "general": true
  },
  {
    "titulo": "World History Encyclopedia",
    "url": "https://www.worldhistory.org/",
    "grupo": "Repertorios principales",
    "territorios": [],
    "personas": [],
    "nota": "Artículos de divulgación histórica con bibliografía para orientar y contextualizar las consultas.",
    "general": true
  },
  {
    "titulo": "National Library of Ireland · Sources",
    "url": "https://sources.nli.ie/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Catálogo de fuentes y documentos para la historia de Irlanda.",
    "general": true
  },
  {
    "titulo": "Archivos Nacionales de Georgia",
    "url": "https://archive.gov.ge/en",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Documentación y recursos institucionales sobre la historia de Georgia.",
    "general": true
  },
  {
    "titulo": "Ministerio de Cultura · Tesauros del Patrimonio Cultural de España",
    "url": "https://tesauros.cultura.gob.es/tesauros/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Terminología y contexto histórico para entidades, territorios y periodos.",
    "general": true
  },
  {
    "titulo": "British Museum",
    "url": "https://www.britishmuseum.org/",
    "grupo": "Archivos e instituciones",
    "territorios": [],
    "personas": [],
    "nota": "Colecciones y registros de personas como apoyo documental y contextual.",
    "general": true
  },
  {
    "titulo": "Cambridge Core · Cambridge University Press",
    "url": "https://www.cambridge.org/core/",
    "grupo": "Historia cultural y política",
    "territorios": [],
    "personas": [],
    "nota": "Libros y estudios académicos, entre ellos A History of Cyprus para la historia de Chipre.",
    "general": true
  },
  {
    "titulo": "Monarquía cilicia: cronología y bibliografía",
    "url": "https://en.wikipedia.org/wiki/List_of_monarchs_of_the_Armenian_Kingdom_of_Cilicia",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Armenia cilicia"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Cambridge: A History of Cyprus — Pedro I",
    "url": "https://www.cambridge.org/core/books/abs/history-of-cyprus/peter-i-135969/433D1C9C6EFE77BAB71F18F7E850A3D5",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre",
      "Jerusalén"
    ],
    "personas": [
      "PETER1CYPRUS"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: Gerald FitzGerald",
    "url": "https://www.dib.ie/index.php/biography/fitzgerald-gerald-gearoid-mor-a3148",
    "grupo": "Irlanda",
    "territorios": [
      "Kildare",
      "Irlanda"
    ],
    "personas": [
      "GERALD8KILDARE"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: James Butler",
    "url": "https://www.dib.ie/biography/butler-james-a1259",
    "grupo": "Irlanda",
    "territorios": [
      "Ormond",
      "Irlanda"
    ],
    "personas": [
      "JAMES1DUKEORMOND"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: Patrick Sarsfield",
    "url": "https://www.dib.ie/index.php/biography/sarsfield-patrick-a7924",
    "grupo": "Irlanda",
    "territorios": [
      "Lucan",
      "Irlanda"
    ],
    "personas": [
      "PATRICKSARSFIELD"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: Donal MacCarthy Mór",
    "url": "https://www.dib.ie/index.php/biography/maccarthy-mor-donal-a5138",
    "grupo": "Irlanda",
    "territorios": [
      "Condado de Clancare",
      "Irlanda",
      "Desmond"
    ],
    "personas": [
      "DONALMACCARTHYMOR"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: Grace O’Malley",
    "url": "https://www.dib.ie/biography/omalley-grainne-grace-granuaile-a6886",
    "grupo": "Irlanda",
    "territorios": [
      "Vizcondado de Mayo",
      "Irlanda",
      "Connacht"
    ],
    "personas": [
      "GRACEOMALLEY"
    ]
  },
  {
    "titulo": "Encyclopaedia Iranica: relaciones entre Georgia e Irán",
    "url": "https://www.iranicaonline.org/articles/georgia-ii-history/",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": []
  },
  {
    "titulo": "Encyclopaedia Iranica: Heraclio II",
    "url": "https://www.iranicaonline.org/articles/erekle-ii/",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kartli-Kajetia",
      "Kajetia",
      "Kartli"
    ],
    "personas": [
      "EREKLE2GEO"
    ]
  },
  {
    "titulo": "Encyclopaedia Iranica: Kartli",
    "url": "https://www.iranicaonline.org/articles/kartli/",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kartli"
    ],
    "personas": []
  },
  {
    "titulo": "Dictionary of Irish Biography: Ruaidrí Ua Conchobair",
    "url": "https://www.dib.ie/biography/ua-conchobair-ruaidri-a8725",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Connacht"
    ],
    "personas": [
      "RUAIDRICONN"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: Hugh O’Neill",
    "url": "https://www.dib.ie/index.php/biography/oneill-hugh-a6962",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Tír Eoghain",
      "Condado de Tyrone"
    ],
    "personas": [
      "HUGHONEILL"
    ]
  },
  {
    "titulo": "Dictionary of Irish Biography: Diarmait Mac Murchada",
    "url": "https://www.dib.ie/biography/mac-murchada-diarmait-macmurrough-dermot-a5075",
    "grupo": "Irlanda",
    "territorios": [
      "Leinster",
      "Irlanda"
    ],
    "personas": [
      "DIARMAITLEIN"
    ]
  },
  {
    "titulo": "Treccani: Federico de Aragón, rey de Sicilia",
    "url": "https://www.treccani.it/enciclopedia/federico-iii-d-aragona-re-di-sicilia_(Dizionario-Biografico)/",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Trinacria"
    ],
    "personas": [
      "FEDERICO2SIC"
    ]
  },
  {
    "titulo": "Leibniz-Institut: Gábor Bethlen",
    "url": "https://www.biolex.ios-regensburg.de/BioLexViewview.php?start=186",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Transilvania"
    ],
    "personas": []
  },
  {
    "titulo": "Ministerio de Cultura: Corona de Castilla",
    "url": "https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Castilla",
      "León",
      "Corona de Castilla"
    ],
    "personas": []
  },
  {
    "titulo": "Treccani: Enrico, conte del Tirolo e duca di Carinzia",
    "url": "https://www.treccani.it/enciclopedia/enrico-conte-del-tirolo-e-duca-di-carinzia_(Enciclopedia-Italiana)/",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Carintia",
      "Bohemia",
      "Tirol"
    ],
    "personas": [
      "ENRIQCAR"
    ]
  },
  {
    "titulo": "British Museum: Maurice, Elector of Saxony",
    "url": "https://www.britishmuseum.org/collection/term/BIOG152590",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Sajonia"
    ],
    "personas": []
  },
  {
    "titulo": "Ministerio de Cultura: Juana I y Felipe I",
    "url": "https://tesauros.cultura.gob.es/tesauros/contextosculturales/1009943.html",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [],
    "personas": []
  },
  {
    "titulo": "Larousse: Maurice",
    "url": "https://www.larousse.fr/encyclopedie/personnage/Maurice/132359",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [],
    "personas": []
  },
  {
    "titulo": "Estado borgoñón",
    "url": "https://es.wikipedia.org/wiki/Estado_borgo%C3%B1%C3%B3n",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Isabella Clara Eugenia",
    "url": "https://en.wikipedia.org/wiki/Isabella_Clara_Eugenia",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Enciclopedia Georgiana: Teimuraz II",
    "url": "https://georgianencyclopedia.ge/en/form_eng/921",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kartli",
      "Kajetia"
    ],
    "personas": [
      "TEIMURAZ2GEO"
    ]
  },
  {
    "titulo": "Vajtang VI",
    "url": "https://georgianencyclopedia.ge/en/form_eng/809",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kartli"
    ],
    "personas": [
      "VAKHTANG6KARTLI"
    ]
  },
  {
    "titulo": "Archivos Nacionales de Georgia: Vajtang VI",
    "url": "https://archive.gov.ge/en/news/erovnul-arqivshi-gamofena-vaxtang-vi-gaixsna",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Kartli"
    ],
    "personas": [
      "VAKHTANG6KARTLI"
    ]
  },
  {
    "titulo": "World History Encyclopedia: Tamar",
    "url": "https://www.worldhistory.org/Queen_Tamar/",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": [
      "TAMARGEO"
    ]
  },
  {
    "titulo": "Jorge V",
    "url": "https://en.wikipedia.org/wiki/George_V_of_Georgia",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": [
      "GIORGI5GEO"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Demetrio II",
    "url": "https://en.wikipedia.org/wiki/Demetrius_II_of_Georgia",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": [
      "DEMETRIO2GEO"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Beka I",
    "url": "https://en.wikipedia.org/wiki/Beka_I_Jaqeli",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Samtsje",
      "Georgia"
    ],
    "personas": [
      "BEKA1JAKELI"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Juan II de Trebisonda",
    "url": "https://en.wikipedia.org/wiki/John_II_of_Trebizond",
    "grupo": "Georgia y Cáucaso",
    "territorios": [],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Alejo II",
    "url": "https://en.wikipedia.org/wiki/Alexios_II_of_Trebizond",
    "grupo": "Georgia y Cáucaso",
    "territorios": [],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Cathal Crobderg",
    "url": "https://www.dib.ie/biography/ua-conchobair-cathal-mor-crobderg-a8721",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Connacht"
    ],
    "personas": [
      "CATHALCONN"
    ]
  },
  {
    "titulo": "Red Hugh O’Donnell",
    "url": "https://www.dib.ie/index.php/biography/odonnell-red-hugh-o-domhnaill-aodh-ruadh-a6343",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Tír Chonaill",
      "España"
    ],
    "personas": [
      "REDHUGHODONNELL"
    ]
  },
  {
    "titulo": "Hugh Mac Manus O’Donnell",
    "url": "https://www.dib.ie/biography/odonnell-o-domhnaill-sir-aodh-mac-maghnusa-a6332",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Tír Chonaill"
    ],
    "personas": [
      "HUGHMACMANUS"
    ]
  },
  {
    "titulo": "Ladislao de Anjou-Durazzo",
    "url": "https://www.treccani.it/enciclopedia/ladislao-d-angio-durazzo-re-di-sicilia_(Dizionario-Biografico)/",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [],
    "personas": []
  },
  {
    "titulo": "Bohemundo IV",
    "url": "https://en.wikipedia.org/wiki/Bohemond_IV_of_Antioch",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Antioquía",
      "Trípoli"
    ],
    "personas": [
      "BOHEMOND4ANT"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Bohemundo V",
    "url": "https://en.wikipedia.org/wiki/Bohemond_V_of_Antioch",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Antioquía",
      "Trípoli"
    ],
    "personas": [
      "BOHEMOND5ANT"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Bohemundo VI",
    "url": "https://en.wikipedia.org/wiki/Bohemond_VI_of_Antioch",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [
      "Antioquía",
      "Trípoli",
      "Armenia cilicia"
    ],
    "personas": [
      "BOHEMOND6ANT"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "lista de príncipes de Transilvania",
    "url": "https://en.wikipedia.org/wiki/List_of_princes_of_Transylvania",
    "grupo": "Otras comprobaciones históricas",
    "territorios": [],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Ketevan",
    "url": "https://www.georgianencyclopedia.ge/ka/form_eng/177",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kajetia",
      "Kartli"
    ],
    "personas": [
      "KETEVANMARTYR"
    ]
  },
  {
    "titulo": "Bagrationi",
    "url": "https://georgianencyclopedia.ge/ka/form_eng/207",
    "grupo": "Georgia y Cáucaso",
    "territorios": [],
    "personas": []
  },
  {
    "titulo": "Hugo IV de Chipre",
    "url": "https://en.wikipedia.org/wiki/Hugh_IV_of_Cyprus",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre",
      "Jerusalén"
    ],
    "personas": [
      "HUGH4CYPRUS"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Carlota de Chipre",
    "url": "https://en.wikipedia.org/wiki/Charlotte,_Queen_of_Cyprus",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre"
    ],
    "personas": [
      "CHARLOTTECYPRUS"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Isabel de Armenia",
    "url": "https://en.wikipedia.org/wiki/Isabella,_Queen_of_Armenia",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Armenia cilicia"
    ],
    "personas": [
      "ISABELLAARMQUEEN"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "León V",
    "url": "https://en.wikipedia.org/wiki/Leo_V,_King_of_Armenia",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Armenia cilicia"
    ],
    "personas": [
      "LEO5CILICIA"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Owen Roe O’Neill",
    "url": "https://www.dib.ie/biography/oneill-owen-roe-o-neill-eoghan-rua-a6936",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Tír Eoghain"
    ],
    "personas": [
      "OWENROEONEILL"
    ]
  },
  {
    "titulo": "Elizabeth Preston",
    "url": "https://www.dib.ie/biography/butler-elizabeth-a1245",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Ormond"
    ],
    "personas": [
      "ELIZABETHPRESTON"
    ]
  },
  {
    "titulo": "Joan FitzGerald",
    "url": "https://www.dib.ie/biography/fitzgerald-joan-a10361",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Condado de Desmond",
      "Ormond"
    ],
    "personas": [
      "JOANFITZDESMOND"
    ]
  },
  {
    "titulo": "Florence MacCarthy",
    "url": "https://www.dib.ie/biography/maccarthy-reagh-florence-finian-finghin-a5139",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Desmond"
    ],
    "personas": [
      "FLORENCEMACCARTHY"
    ]
  },
  {
    "titulo": "Gerald FitzGerald de Desmond",
    "url": "https://www.dib.ie/biography/fitzgerald-gerald-fitz-james-a3149",
    "grupo": "Irlanda",
    "territorios": [
      "Irlanda",
      "Condado de Desmond"
    ],
    "personas": [
      "GERALD15DESMOND"
    ]
  },
  {
    "titulo": "Bagrationi: monarcas de Georgia",
    "url": "https://en.wikipedia.org/wiki/List_of_monarchs_of_Georgia",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Bagrat VI de Georgia",
    "url": "https://en.wikipedia.org/wiki/Bagrat_VI_of_Georgia",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Jorge, hijo de Constantino I",
    "url": "https://en.wikipedia.org/wiki/George_(son_of_Constantine_I_of_Georgia)",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Georgia"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Vajtang V de Kartli",
    "url": "https://en.wikipedia.org/wiki/Vakhtang_V",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kartli"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Rostom de Kartli",
    "url": "https://en.wikipedia.org/wiki/Rostom_of_Kartli",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kartli"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Teimuraz I de Kajetia",
    "url": "https://en.wikipedia.org/wiki/Teimuraz_I_of_Kakheti",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kajetia"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Monarcas de Kajetia",
    "url": "https://en.wikipedia.org/wiki/List_of_monarchs_of_Kakheti",
    "grupo": "Georgia y Cáucaso",
    "territorios": [
      "Kajetia"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Helvis de Brunswick-Grubenhagen",
    "url": "https://en.wikipedia.org/wiki/Helvis_of_Brunswick-Grubenhagen",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre"
    ],
    "personas": [
      "HELVISBRUNSCYP"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Pedro II de Chipre",
    "url": "https://en.wikipedia.org/wiki/Peter_II_of_Cyprus",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre",
      "Jerusalén"
    ],
    "personas": [
      "PETER2CYPRUS"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Jano de Chipre",
    "url": "https://en.wikipedia.org/wiki/Janus_of_Cyprus",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre",
      "Jerusalén",
      "Armenia cilicia"
    ],
    "personas": [
      "JANUSCYPRUS"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Reino de Chipre",
    "url": "https://en.wikipedia.org/wiki/Kingdom_of_Cyprus",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Chipre"
    ],
    "personas": [],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Constantino II de Armenia",
    "url": "https://en.wikipedia.org/wiki/Constantine_II,_King_of_Armenia",
    "grupo": "Chipre y Armenia cilicia",
    "territorios": [
      "Armenia cilicia"
    ],
    "personas": [
      "CONST2ARM"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Gerald FitzGerald, IX conde de Kildare",
    "url": "https://www.dib.ie/biography/fitzgerald-gerald-gearoid-og-garrett-mcalison-a3152",
    "grupo": "Irlanda",
    "territorios": [
      "Kildare",
      "Irlanda"
    ],
    "personas": [
      "GERALD9KILDARE"
    ]
  },
  {
    "titulo": "Walter Butler",
    "url": "https://www.dib.ie/biography/butler-walter-a1300",
    "grupo": "Irlanda",
    "territorios": [
      "Ormond",
      "Irlanda"
    ],
    "personas": [
      "WALTER11ORMOND"
    ]
  },
  {
    "titulo": "Domnall Mór MacCarthy",
    "url": "https://www.dib.ie/biography/maccarthy-mor-mac-carthaigh-domhnall-donal-a5007",
    "grupo": "Irlanda",
    "territorios": [
      "Desmond",
      "Irlanda"
    ],
    "personas": [
      "DOMNALLMORMAC"
    ]
  },
  {
    "titulo": "National Library of Ireland: FitzGerald",
    "url": "https://sources.nli.ie/Record/MS_UR_020173",
    "grupo": "Irlanda",
    "territorios": [
      "Kildare"
    ],
    "personas": []
  },
  {
    "titulo": "Richard Talbot",
    "url": "https://en.wikipedia.org/wiki/Richard_Talbot,_1st_Earl_of_Tyrconnell",
    "grupo": "Irlanda",
    "territorios": [
      "Condado de Tyrconnell",
      "Irlanda"
    ],
    "personas": [
      "RICHARDTALBOT"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  },
  {
    "titulo": "Richard de Burgh",
    "url": "https://en.wikipedia.org/wiki/Richard_%C3%93g_de_Burgh,_2nd_Earl_of_Ulster",
    "grupo": "Irlanda",
    "territorios": [
      "Condado de Ulster",
      "Irlanda",
      "Connacht"
    ],
    "personas": [
      "RICHARDBURGHULSTER"
    ],
    "nota": "Referencia auxiliar: cronología y orientación bibliográfica."
  }
];
// General bibliography lists each publication once; entity pages retain the individual references.
// Reuse a bibliography entry when its URL already exists, preserving its
// person associations and adding only the newly reviewed territories.
for (const source of [...GERMAN_SWISS_SOURCES,...GERMANY_COMPLETION_SOURCES]) {
  const previous = SOURCES.find(entry => entry.url === source.url);
  if (previous) previous.territorios = [...new Set([...previous.territorios,...source.territorios])];
  else SOURCES.push(source);
}

export const SOURCE_PUBLICATIONS = SOURCES.filter(source => source.general);
export const SOURCE_GROUPS = [...new Set(SOURCE_PUBLICATIONS.map(source => source.grupo))].map(title => ({
  title, sources: SOURCE_PUBLICATIONS.filter(source => source.grupo === title),
}));
export const SOURCE_METHOD = [
  'La bibliografía general reúne las obras, bases de datos e instituciones consultadas. Las referencias a artículos y biografías concretos se recogen en las fichas correspondientes.',
  'La base es una síntesis en desarrollo: una referencia contextual no verifica por sí sola todos los datos de una ficha.',
  'Las fechas se expresan normalmente por año; «c.» identifica las fechas aproximadas registradas como tales.',
  'Cuando se conoce un intervalo o un límite, la ficha lo muestra como tal y añade una explicación documental. El filtro por año incluye los años compatibles con esos límites; las fechas aproximadas conservan su año convencional sin inventar un margen de error.',
  'Las fichas dinásticas distinguen las ramas cadetes de las transmisiones por matrimonio o herencia. La coincidencia del nombre de una casa no demuestra por sí sola una filiación entre todos sus miembros.',
  'Desde la V5.25, fechas, filiaciones, matrimonios y algunos cargos se contrastan con las fichas de autoridad de la Deutsche Nationalbibliothek (GND). Wikidata solo sirve para localizar la ficha correcta y no se cita. Una afirmación pasa a «Documentado» únicamente si la ficha registra el mismo año, enlaza a la misma persona o fecha el mismo cargo y territorio con los mismos años; las discrepancias siguen pendientes de revisión.',
  'Wikipedia se utiliza como orientación bibliográfica auxiliar. Las filiaciones y cronologías discutidas requieren contraste con referencias especializadas.',
  'Los gobiernos distinguen territorio, título, clase y condición; una pretensión o un título nominal no equivale a gobierno efectivo.',
  'Las sucesiones explicadas son una selección editorial: una fila posterior no prueba por sí sola un relevo directo. Las crisis muestran reclamaciones históricas; el parentesco se limita a las filiaciones registradas. Acceso al título, coronación y gobierno efectivo se distinguen cuando existe información específica.',
  'Las etapas de títulos reúnen mandatos por año y distinguen gobierno efectivo, regencia y títulos nominales. Una coincidencia anual no demuestra simultaneidad diaria. Las uniones pueden contener rupturas y no suponen instituciones uniformes. Europa en este año resume solo los datos cargados compatibles con la selección; no prolonga vidas sin límites documentales suficientes.',
  'La cartografía es una representación histórica simplificada. La ausencia de una relación significa que no está registrada en esta base.',
];
export const SOURCE_SECTIONS = [
  ...SOURCE_GROUPS.map(group => ({title: group.title, links: group.sources.map(source => [source.titulo, source.url])})),
  { title: 'Criterios de trabajo', paragraphs: SOURCE_METHOD },
  PERSON_NAMING_POLICY.es,
];
export const FUENTES_TERRITORIOS = Object.fromEntries([...new Set(SOURCES.flatMap(source => source.territorios))].map(territorio => [
  territorio, SOURCES.filter(source => source.territorios.includes(territorio)).map(({titulo, url}) => ({titulo, url})),
]));
export function sourcesForPerson(id) {
  const specific = SOURCES.filter(source => source.personas.includes(id)).map(({titulo, url}) => ({titulo, url}));
  const urls = new Set(specific.map(source => source.url));
  return [...specific, ...authorityReferences(id).filter(source => !urls.has(source.url))];
}
