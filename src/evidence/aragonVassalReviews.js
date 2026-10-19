// V5.31 · Afirmaciones de los vasallos de la Corona de Aragón, cada una con su
// entrada de la Gran Enciclopèdia Catalana. Generado con la incorporación de
// estas personas; los gobiernos de varios años conservan la resolución anual.
const SOURCES = Object.freeze({
 "athens": {
  "title": "Gran Enciclopèdia Catalana · Ducat d’Atenes",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/ducat-datenes",
  "locator": "Sucesión de los duques catalanes: Manfredo (1312-17), Guillermo II (1317-38), Juan de Randazzo (1338-48), Federico I (1348-55) y Federico III de Sicilia desde 1355; vicarios generales."
 },
 "manfred": {
  "title": "Gran Enciclopèdia Catalana · Manfred I d’Atenes",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/manfred-i-datenes",
  "locator": "Cabecera: duque de Atenas (1312-17), hijo de Federico II de Sicilia y de Leonor de Nápoles; nacido hacia 1307, muerto en Trapani en 1317."
 },
 "neopatria": {
  "title": "Gran Enciclopèdia Catalana · Ducat de Neopàtria",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/ducat-de-neopatria",
  "locator": "Ducado formado en 1319 por Alfonso Fadrique con la Tesalia meridional y unido al de Atenas."
 },
 "fadrique": {
  "title": "Gran Enciclopèdia Catalana · Frederic d’Aragó",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/frederic-darago",
  "locator": "Familia de los condes de Salona, rama ilegítima del casal de Barcelona: Alfonso, Pedro (muerto en 1355), Jaime, Luis y María."
 },
 "salona": {
  "title": "Gran Enciclopèdia Catalana · Comtat de Salona",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-salona",
  "locator": "Conquista catalana de 1311; Alfonso Fadrique y sus descendientes hasta María, última condesa, cuando los turcos tomaron el castillo en 1394."
 },
 "luis": {
  "title": "Gran Enciclopèdia Catalana · Senyoria de Citó",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/senyoria-de-cito",
  "locator": "Luis Fadrique, cuarto conde de Salona (1365-1382), vicario general por nombramiento del rey de Sicilia en 1375 y confirmado por Pedro IV en los capítulos de Atenas (1380)."
 },
 "pallars": {
  "title": "Gran Enciclopèdia Catalana · Comtat de Pallars Sobirà",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-pallars-sobira",
  "locator": "Relación de condes con sus años de gobierno, desde Guillerma I hasta Hugo Roger III."
 },
 "hugroger3": {
  "title": "Gran Enciclopèdia Catalana · Hug Roger III de Pallars",
  "url": "https://www.enciclopedia.cat/ec-gec-0033173.xml",
  "locator": "Cabecera: hacia 1430 — Xàtiva, 26 de noviembre de 1508; conde de Pallars Sobirà (1451-91)."
 },
 "urgell": {
  "title": "Gran Enciclopèdia Catalana · Comtat d’Urgell",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-durgell",
  "locator": "Condes de las dinastías de Cabrera y de Barcelona; desposesión de Jaime II por Fernando I en 1413."
 },
 "ermengol": {
  "title": "Gran Enciclopèdia Catalana · Ermengol X d’Urgell",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/ermengol-x-durgell",
  "locator": "Conde de Urgel (1267-1314); testamento en favor de su sobrina Teresa de Entenza."
 },
 "altUrgell": {
  "title": "Gran Enciclopèdia Catalana · L’Alt Urgell",
  "url": "https://www.enciclopedia.cat/comarques-de-catalunya/lalt-urgell",
  "locator": "Titulares del condado en el casal de Barcelona: Jaime I (1336-47) y Pedro II (1347-1408)."
 },
 "jaume2": {
  "title": "Gran Enciclopèdia Catalana · Jaume II d’Urgell",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/jaume-ii-durgell",
  "locator": "Cabecera: Balaguer?, 1378/80 — Xàtiva, 1433; conde de Urgel (1408-13)."
 },
 "tolosa6": {
  "title": "Gran Enciclopèdia Catalana · Ramon VI de Tolosa",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/ramon-vi-de-tolosa",
  "locator": "Cabecera: 27 de octubre de 1156 — 2 de agosto de 1222; conde de Tolosa (1194-1222)."
 },
 "tolosa7": {
  "title": "Gran Enciclopèdia Catalana · Ramon VII de Tolosa",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/ramon-vii-de-tolosa",
  "locator": "Cabecera: 1197 — Millau, 1249; conde de Tolosa (1222-49), hijo de Ramon VI y de Juana de Inglaterra."
 },
 "pere1": {
  "title": "Gran Enciclopèdia Catalana · Pere I de Catalunya-Aragó",
  "url": "https://www.enciclopedia.cat/ec-gec-0050109.xml",
  "locator": "En 1213 recibe en Toulouse el juramento de fidelidad de Ramón VI y de su hijo, y el homenaje de Foix y Bearne; muere en Muret."
 },
 "foix": {
  "title": "Gran Enciclopèdia Catalana · Comtat de Foix",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-foix",
  "locator": "Raimundo Roger (muerto en 1223) combatió en Muret junto a Pedro I; matrimonio de Roger Bernardo II con Ermesenda en 1208."
 },
 "rogerBernat2": {
  "title": "Gran Enciclopèdia Catalana · Roger Bernat II de Foix",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/roger-bernat-ii-de-foix",
  "locator": "Conde de Foix (1223-41), hijo y sucesor de Ramon Roger I."
 },
 "carcassona": {
  "title": "Gran Enciclopèdia Catalana · Comtat de Carcassona",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-carcassona",
  "locator": "Reconocimientos de soberanía de 1157 y 1167, desposesión de Ramon Roger en 1209 y breve recuperación de su hijo entre 1224 y 1227."
 },
 "trencavel1": {
  "title": "Gran Enciclopèdia Catalana · Ramon Trencavell I de Carcassona-Rasès",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/ramon-trencavell-i-de-carcassona-rases",
  "locator": "Vizconde de Carcasona y Razès, asesinado por los burgueses de Béziers en 1167."
 },
 "croada": {
  "title": "Gran Enciclopèdia Catalana · Croada albigesa",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/croada-albigesa",
  "locator": "Ramon Roger Trencavel, vizconde de Carcasona, Razès, Béziers y Albi (1194-1209), apresado en el asedio de 1209."
 },
 "maria1Bearn": {
  "title": "Gran Enciclopèdia Catalana · Maria I de Bearn",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/maria-i-de-bearn",
  "locator": "Cabecera: hacia 1145 — 1173; vizcondesa de Bearne (hacia 1170-73), casada en 1170 con Guillermo de Moncada; hijos Gastón VI y Guillermo Ramón."
 },
 "bearn": {
  "title": "Gran Enciclopèdia Catalana · Bearn",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/bearn-0",
  "locator": "Vasallaje del vizcondado respecto del rey de Aragón; sucesión de los Moncada."
 },
 "guillem2Bearn": {
  "title": "Gran Enciclopèdia Catalana · Guillem II de Bearn",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/guillem-ii-de-bearn",
  "locator": "Vizconde de Bearne, muerto en la conquista de Mallorca (1229)."
 },
 "peronella": {
  "title": "Gran Enciclopèdia Catalana · Peronella I de Bigorra",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/peronella-i-de-bigorra",
  "locator": "Cabecera: después de 1175 — L’Escaladieu, 1251; condesa de Bigorra (1190-1251); matrimonios con Gastón VI (1196), Nuño de Rosellón (1215), Guy de Montfort (1216), Aimar de Rancon y Bosón de Matha."
 },
 "provenca": {
  "title": "Gran Enciclopèdia Catalana · Regne, marquesat i comtat de Provença",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/regne-marquesat-i-comtat-de-provenca",
  "locator": "Alfonso I pone en el gobierno a su hijo Alfonso II en 1185, que le sucede en 1196; matrimonio de 1193 con Garsenda de Sabran."
 },
 "montpeller": {
  "title": "Gran Enciclopèdia Catalana · Senyoria de Montpeller",
  "url": "https://www.enciclopedia.cat/gran-enciclopedia-catalana/senyoria-de-montpeller",
  "locator": "Muerte de Guillermo VIII (1202), matrimonio de María con Pedro I (1204), señores del casal de Barcelona y de Mallorca hasta la venta de 1349."
 }
});
const review = (source, note, extra = {}) => ({certainty: 'documented', sources: [SOURCES[source]], note,
  reviewedAt: '2026-10-19', editor: 'El Árbol de Europa', ...extra});
export const ARAGON_VASSAL_REVIEWS = Object.freeze({
  "person:MANFREDOATENAS:government:Atenas:1312:1317:Duque": review("manfred", "Primer duque catalán, nombrado niño a petición de la Compañía. No salió de Sicilia: gobernaron vicarios generales."),
  "person:GUILLERMOATENAS:government:Atenas:1317:1338:Duque": review("athens", "Sucedió a su hermano Manfredo. Gobernó el ducado su hermanastro Alfonso Fadrique como vicario general."),
  "person:GUILLERMOATENAS:government:Ducado de Neopatria:1319:1338:Duque": review("neopatria", "Ducado formado en 1319 con las conquistas de Alfonso Fadrique en Tesalia."),
  "person:JUANRANDAZZO:government:Atenas:1338:1348:Duque": review("athens", "Sucedió a su hermano Guillermo."),
  "person:JUANRANDAZZO:government:Ducado de Neopatria:1338:1348:Duque": review("athens", ""),
  "person:FEDERICORANDAZZO:government:Atenas:1348:1355:Duque": review("athens", "A su muerte los ducados pasaron a su primo Federico III de Sicilia."),
  "person:FEDERICORANDAZZO:government:Ducado de Neopatria:1348:1355:Duque": review("athens", ""),
  "person:ALFONSOFADRIQUE:government:Atenas:1317:1330:Vicario general": review("athens", "Hijo natural del rey de Sicilia, gobernó el ducado en nombre de su hermanastro Guillermo."),
  "person:ALFONSOFADRIQUE:government:Ducado de Neopatria:1319:1330:Vicario general": review("neopatria", "Conquistó Siderocastro y la Tesalia meridional y formó el ducado en 1319."),
  "person:ALFONSOFADRIQUE:government:Condado de Salona:1318:1338:Conde": review("salona", "Parece que obtuvo Salona después de la conquista catalana de 1311; con él se convirtió en condado. El año de adquisición es aproximado."),
  "person:PEDROFADRIQUE:government:Condado de Salona:1338:1355:Conde": review("fadrique", "Sucedió a su padre en Salona y en sus señorías de Egina y Tesalia. Murió sin hijos legítimos."),
  "person:JAIMEFADRIQUE:government:Condado de Salona:1355:1365:Conde": review("salona", "Sucedió a su hermano Pedro; le siguió su hijo Luis en 1365."),
  "person:LUISFADRIQUE:government:Condado de Salona:1365:1382:Conde": review("luis", ""),
  "person:LUISFADRIQUE:government:Atenas:1375:1377:Vicario general": review("luis", "Nombrado por su primo Federico III de Sicilia."),
  "person:LUISFADRIQUE:government:Ducado de Neopatria:1375:1377:Vicario general": review("luis", "Nombrado por su primo Federico III de Sicilia."),
  "person:LUISFADRIQUE:government:Atenas:1380:1381:Vicario general": review("luis", "Confirmado por Pedro IV en los capítulos de Atenas, al unir los ducados a la Corona."),
  "person:LUISFADRIQUE:government:Ducado de Neopatria:1380:1381:Vicario general": review("luis", "Confirmado por Pedro IV en los capítulos de Atenas."),
  "person:MARIAFADRIQUE:government:Condado de Salona:1382:1394:Condesa": review("salona", "Última condesa: Bayaceto I ocupó Salona en 1394."),
  "person:GUILLERMA1PALLARS:government:Pallars Sobirà:1199:1229:Condesa": review("pallars", "Gobernó al principio su madre. Vendió el condado a su segundo marido entre 1229 y 1231."),
  "person:ROGER1PALLARS:government:Pallars Sobirà:1229:1234:Conde": review("pallars", "Compró el condado a su esposa entre 1229 y 1231."),
  "person:ROGER2PALLARS:government:Pallars Sobirà:1234:1256:Conde": review("pallars", ""),
  "person:ARNAUROGER1PALLARS:government:Pallars Sobirà:1256:1288:Conde": review("pallars", ""),
  "person:RAMONROGER1PALLARS:government:Pallars Sobirà:1288:1294:Conde": review("pallars", ""),
  "person:SIBILA1PALLARS:government:Pallars Sobirà:1295:1330:Condesa": review("pallars", ""),
  "person:HUGO1PALLARS:government:Pallars Sobirà:1297:1328:Conde": review("pallars", "Por su matrimonio con la condesa Sibila en 1297."),
  "person:ARNAUROGER2PALLARS:government:Pallars Sobirà:1328:1343:Conde": review("pallars", "Compartió el gobierno con su madre hasta 1330."),
  "person:RAMONROGER2PALLARS:government:Pallars Sobirà:1343:1350:Conde": review("pallars", ""),
  "person:HUGOROGER1PALLARS:government:Pallars Sobirà:1350:1366:Conde": review("pallars", ""),
  "person:ARNAUROGER3PALLARS:government:Pallars Sobirà:1366:1369:Conde": review("pallars", ""),
  "person:HUGOROGER2PALLARS:government:Pallars Sobirà:1369:1416:Conde": review("pallars", ""),
  "person:ROGERBERNARDO1PALLARS:government:Pallars Sobirà:1416:1424:Conde": review("pallars", ""),
  "person:ARNAUROGER4PALLARS:government:Pallars Sobirà:1424:1451:Conde": review("pallars", ""),
  "person:HUGOROGER3PALLARS:government:Pallars Sobirà:1451:1487:Conde": review("hugroger3", "Conde hasta la guerra con Fernando II; la sentencia de confiscación es de 1488 y el condado pasó a los Cardona en 1491."),
  "person:RAMON6TOLOSA:government:Toulouse:1194:1222:Conde": review("tolosa6", "En 1213 juró fidelidad a Pedro II de Aragón. El concilio de Letrán lo desposeyó en 1215 en favor de Simón de Montfort; recuperó Toulouse en 1217."),
  "person:RAMON7TOLOSA:government:Toulouse:1222:1249:Conde": review("tolosa7", "Por el tratado de París (1229) el condado quedó destinado a su hija Juana y a su yerno Alfonso de Poitiers."),
  "person:RAMONROGERFOIX:government:Foix:1188:1223:Conde": review("foix", "En 1213 rindió homenaje a Pedro II de Aragón por sus castillos y combatió a su lado en Muret."),
  "person:ROGERBERNARDO2FOIX:government:Foix:1223:1241:Conde": review("rogerBernat2", ""),
  "person:TRENCAVEL1:government:Vizcondado de Carcasona:1150:1167:Vizconde": review("carcassona", "En 1157 reconoció la soberanía de Ramón Berenguer IV de Barcelona."),
  "person:ROGER2TRENCAVEL:government:Vizcondado de Carcasona:1167:1194:Vizconde": review("carcassona", "En 1167 reconoció la soberanía de Alfonso II de Aragón."),
  "person:RAMONROGERTRENCAVEL:government:Vizcondado de Carcasona:1194:1209:Vizconde": review("croada", "Apresado en el asedio de Carcasona de 1209; sus tierras pasaron a Simón de Montfort."),
  "person:TRENCAVEL2:government:Vizcondado de Carcasona:1224:1227:Vizconde": review("carcassona", "Recuperó brevemente los dominios de su padre."),
  "person:MARIABEARNE:government:Bearne:1170:1173:Vizcondesa": review("maria1Bearn", "Se declaró vasalla de Alfonso II de Aragón, bajo cuya tutela se estableció la dinastía de los Moncada en Bearne."),
  "person:GASTON6BEARN:government:Bearne:1173:1215:Vizconde": review("bearn", "En 1213 rindió homenaje a Pedro II de Aragón por sus castillos."),
  "person:GASTON6BEARN:government:Condado de Bigorra:1196:1215:Conde": review("peronella", "Por su matrimonio con la condesa Petronila en 1196."),
  "person:GUILLERMORAMONBEARN:government:Bearne:1215:1224:Vizconde": review("bearn", "Sucedió a su hermano Gastón VI."),
  "person:GUILLERMO2BEARN:government:Bearne:1224:1229:Vizconde": review("guillem2Bearn", ""),
  "person:PETRONILABIGORRA:government:Condado de Bigorra:1190:1251:Condesa": review("peronella", "Sucedió a su madre, la condesa Beatriz III."),
  "person:ALF2PROVENZA:government:Provenza:1185:1195:Procurador": review("provenca", "Gobernó el condado en nombre de su padre."),
  "person:ALF2PROVENZA:government:Provenza:1196:1209:Conde": review("provenca", "Por su matrimonio con Garsenda de Sabran (1193) se unió Forcalquier a Provenza."),
  "person:GUILLERMO8MONTP:government:Montpellier:1172:1202:Señor": review("montpeller", ""),
  "person:ERMENGOL10URGEL:government:Urgel:1267:1314:Conde": review("ermengol", "Dejó el condado a su sobrina Teresa de Entenza."),
  "person:JAIME1URGEL:government:Urgel:1336:1347:Conde": review("altUrgell", ""),
  "person:JAIME2URGEL:government:Urgel:1408:1413:Conde": review("jaume2", "Fernando I lo desposeyó en 1413 tras su revuelta."),
  "person:MARIAMONT:government:Montpellier:1204:1213:Señora": review("montpeller", "Heredera de Guillermo VIII tras la destitución de su medio hermano en 1204."),
  "person:PEDRO2AR:government:Montpellier:1204:1213:Señor": review("montpeller", "Por su matrimonio con María de Montpellier en 1204. La ciudad seguía dentro del reino de Francia."),
  "person:JAIME1AR:government:Montpellier:1213:1276:Señor": review("montpeller", "Heredó el señorío de su madre en 1213."),
  "person:JAIME2MAL:government:Montpellier:1276:1311:Señor": review("montpeller", "Señorío de los reyes de Mallorca dentro del reino de Francia."),
  "person:SANCHO1MALL:government:Montpellier:1311:1324:Señor": review("montpeller", ""),
  "person:JAIME3MALL:government:Montpellier:1324:1349:Señor": review("montpeller", "Vendió Montpellier al rey de Francia el 13 de abril de 1349."),
  "person:TERESAENTENZA:government:Urgel:1314:1327:Condesa": review("ermengol", "Heredera de su tío Ermengol X."),
  "person:MANFREDOATENAS:birth": review("manfred", "Nacimiento hacia 1307.", {"precision":"circa","timeLabel":"c. 1307"}),
  "person:MANFREDOATENAS:death": review("manfred", "Muerte en Trapani en 1317, al caer del caballo."),
  "person:PEDROFADRIQUE:death": review("fadrique", "Muerte en 1355."),
  "person:HUGOROGER3PALLARS:birth": review("hugroger3", "Nacimiento hacia 1430.", {"precision":"circa","timeLabel":"c. 1430"}),
  "person:HUGOROGER3PALLARS:death": review("hugroger3", "Muerte en el castillo de Xàtiva el 26 de noviembre de 1508.", {"exactDate":"1508-11-26"}),
  "person:RAMON6TOLOSA:birth": review("tolosa6", "Nacimiento el 27 de octubre de 1156.", {"exactDate":"1156-10-27"}),
  "person:RAMON6TOLOSA:death": review("tolosa6", "Muerte el 2 de agosto de 1222.", {"exactDate":"1222-08-02"}),
  "person:RAMON7TOLOSA:birth": review("tolosa7", "Nacimiento en 1197."),
  "person:RAMON7TOLOSA:death": review("tolosa7", "Muerte en Millau en 1249."),
  "person:RAMONROGERFOIX:death": review("foix", "Muerte en 1223."),
  "person:MARIABEARNE:birth": review("maria1Bearn", "Nacimiento hacia 1145.", {"precision":"circa","timeLabel":"c. 1145"}),
  "person:MARIABEARNE:death": review("maria1Bearn", "Muerte en 1173."),
  "person:PETRONILABIGORRA:death": review("peronella", "Muerte en 1251 en la abadía de L’Escaladieu."),
  "person:GUILLERMO2BEARN:death": review("guillem2Bearn", "Muerte en la batalla de Portopí, en la conquista de Mallorca, en 1229."),
  "person:JAIME2URGEL:birth": review("jaume2", "La cabecera da 1378/80; se muestra 1380 como año aproximado.", {"precision":"circa","timeLabel":"c. 1378–1380"}),
  "person:JAIME2URGEL:death": review("jaume2", "Muerte en Xàtiva en 1433."),
  "person:ERMENGOL10URGEL:death": review("ermengol", "Muerte en 1314."),
});
