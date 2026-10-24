// V5.34 · Historias de siete casas más. Contexto editorial: cada fecha o
// parentesco individual se verifica en su ficha. Las fuentes figuran en el
// registro general (src/content/sources-v534.js).
const MEDLANDS = 'https://fmg.ac/Projects/MedLands/index.htm';
const GEC = slug => `https://www.enciclopedia.cat/gran-enciclopedia-catalana/${slug}`;
const TRECCANI = slug => `https://www.treccani.it/enciclopedia/${slug}/`;

export const CASAS_V534 = {
  'Wettin': {
    resumen: 'Linaje que gobernó Misnia, Turingia y Sajonia desde el siglo XII hasta 1918. En 1485 se dividió en las ramas ernestina y albertina; los albertinos fueron electores de Sajonia y, en el siglo XVIII, reyes de Polonia.',
    origen: 'El linaje toma el nombre del castillo de Wettin, junto al Saale. Conrado el Grande reunió en el siglo XII la Marca Oriental, la Baja Lusacia y Misnia, y sus sucesores fueron margraves de Misnia. En 1264 Enrique el Ilustre recibió el landgraviato de Turingia.',
    trayectoria: 'En 1423 el rey Segismundo concedió a Federico IV de Misnia el electorado y el ducado de Sajonia-Wittenberg, y desde entonces fue Federico I de Sajonia. Sus nietos Ernesto y Alberto se repartieron los dominios en 1485. El elector ernestino Federico el Sabio protegió a Lutero; su sobrino Juan Federico, derrotado en Mühlberg (1547), perdió el electorado, que Carlos V dio a su primo albertino Mauricio.',
    legado: 'Los electores albertinos gobernaron Sajonia hasta el fin del Imperio. Federico Augusto I fue elegido rey de Polonia en 1697 como Augusto II, y su hijo Augusto III reinó en la Mancomunidad hasta 1763. Las ramas ernestinas formaron los ducados sajones de Turingia, y la casa reinó en Sajonia hasta 1918.',
    territorios: ['Meißen', 'Turingia', 'Sajonia', 'Polonia', 'Lituania'],
    protagonistas: ['DIETRICHMEISSEN', 'HEINRICH3MEISSEN', 'FRED1MEISSEN', 'FRED1SAX', 'ERNSTSAX', 'ALBERTSAX', 'FRED3SAX', 'JUANFED1SAX', 'MORITZSAX', 'AUGUSTSAX', 'AUGUST2SAXPOL', 'AUGUST3SAXPOL'],
    fuentes: [GEC('wettin-0'), MEDLANDS],
  },
  'Nassau': {
    resumen: 'Condes renanos que en 1255 se dividieron en dos ramas: la walramiana, que dio un rey de romanos y los grandes duques de Luxemburgo, y la otoniana, que heredó tierras en los Países Bajos y el principado de Orange.',
    origen: 'Los condes de Laurenburg construyeron en el siglo XII el castillo de Nassau, junto al Lahn, y tomaron su nombre. En 1255 los hijos de Enrique el Rico se repartieron el condado: Walram fundó la línea walramiana y Otón la otoniana.',
    trayectoria: 'Adolfo de Nassau, de la rama walramiana, fue rey de romanos entre 1292 y 1298. En la rama otoniana, Engelberto I heredó en el siglo XV señoríos en los Países Bajos, y los Nassau-Dillenburg sirvieron a los duques de Borgoña y a los Habsburgo. En 1544 Guillermo, hijo de Guillermo el Rico, heredó de su primo René de Chalon el principado de Orange.',
    legado: 'Guillermo de Orange encabezó la revuelta de los Países Bajos contra Felipe II, y sus descendientes fueron estatúderes de las Provincias Unidas; Guillermo III fue además rey de Inglaterra, Escocia e Irlanda desde 1689. La rama de Nassau-Dietz heredó la jefatura de la casa, y Guillermo I recibió en 1813 el trono de los Países Bajos, con el gran ducado de Luxemburgo.',
    territorios: ['Nassau', 'Orange', 'Países Bajos', 'Inglaterra', 'Escocia', 'Irlanda', 'Luxemburgo'],
    protagonistas: ['HENRY2NASSAU', 'ADOLFN', 'OTTO1NASSAU', 'ENGELBERT1NASSAU', 'JOHN5NASSAU', 'WILLIAMRICHNASSAU', 'WILLIAMSILENT', 'MAURICEORANGE', 'FREDERICKHENRYORANGE', 'WILLIAM3ORANGE', 'WILLIAM4ORANGE', 'WILLIAM5ORANGE', 'WILLIAM1NETHERLANDS'],
    fuentes: [TRECCANI('nassau_(Dizionario-di-Storia)'), MEDLANDS],
  },
  'Lusignan': {
    resumen: 'Señores de Poitou que, al hilo de las cruzadas, reinaron en Jerusalén, en Chipre durante casi tres siglos y en la Armenia cilicia en el siglo XIV.',
    origen: 'El linaje tomó el nombre del castillo de Lusignan, en Poitou. Sus señores fueron condes de La Marche y, por el matrimonio de Hugo X con Isabel de Angulema, viuda de Juan sin Tierra, también de Angulema.',
    trayectoria: 'Guido de Lusignan se casó con Sibila, heredera de Jerusalén, y fue rey desde 1186. Tras perder el reino ante Saladino compró Chipre a los templarios. Su hermano Amalarico recibió la corona chipriota del emperador Enrique VI y fue también rey de Jerusalén por su matrimonio con Isabel. Hugo III volvió a reunir las dos coronas en 1269.',
    legado: 'Una rama reinó en la Armenia cilicia desde 1342 hasta la caída de Sis en 1375. Jacobo II, el último rey varón, se casó con la veneciana Caterina Cornaro. Tras la muerte de su hijo Jacobo III, Caterina gobernó bajo la tutela de Venecia, a la que cedió la isla en 1489.',
    territorios: ['Chipre', 'Jerusalén', 'Armenia cilicia'],
    protagonistas: ['GUYLUSIGNANJER', 'AIMERYLUSIGNANJER', 'HUGH1CYPRUS', 'HENRY1CYPRUS', 'HUGH3CYPRUS', 'HENRY2CYPRUS', 'HUGH4CYPRUS', 'PETER1CYPRUS', 'JANUSCYPRUS', 'JOHN2CYPRUS', 'CHARLOTTECYPRUS', 'JAMES2CYPRUS', 'JAMES3CYPRUS', 'CONST2ARM', 'LEO5CILICIA'],
    fuentes: [TRECCANI('lusignano_(Enciclopedia-Italiana)'), MEDLANDS],
  },
  'Visconti': {
    resumen: 'Familia milanesa que convirtió la señoría de la ciudad en un ducado hereditario (1395) y dominó buena parte de Lombardía hasta la muerte de Felipe María en 1447. Su herencia pasó a los Sforza.',
    origen: 'El arzobispo Ottone Visconti venció a los Torriani en Desio (1277) y fue aceptado como señor de Milán. En 1287 hizo nombrar capitán del pueblo a su sobrino nieto Mateo, que obtuvo el vicariato imperial en 1294.',
    trayectoria: 'Mateo I, exiliado entre 1302 y 1310, recuperó Milán con el emperador Enrique VII. Sus descendientes extendieron el dominio por Lombardía, y Galeazzo II y Bernabé se repartieron el estado. Gian Galeazzo apresó a su tío Bernabé en 1385, gobernó en solitario y en 1395 recibió del emperador Venceslao el título de duque de Milán.',
    legado: 'Felipe María, hermano de Gian María (asesinado en 1412), restauró el estado y combatió a Florencia y Venecia. Su única hija, Blanca María, se casó en 1441 con Francesco Sforza, a quien los milaneses reconocieron como duque en 1450. Valentina Visconti, casada con Luis de Orleans, transmitió a su descendencia unos derechos sobre Milán que Luis XII hizo valer en 1499.',
    territorios: ['Milán'],
    protagonistas: ['MAT1VISC', 'STEFVISC', 'LUCHINOVISC', 'GIOVANNIARCHVISC', 'GAL2VISC', 'BERNVISC', 'GIANGAL1', 'VALVISC', 'FELMARVISC', 'BLANMARVISC'],
    fuentes: [TRECCANI('visconti_(Enciclopedia-Italiana)'), MEDLANDS],
  },
  'Braganza': {
    resumen: 'Rama bastarda de la casa de Avís que, desde el ducado creado en 1442, fue la mayor casa nobiliaria de Portugal. Reinó en Portugal desde 1640 y en Brasil desde 1822.',
    origen: 'Alfonso, hijo natural del rey Juan I, se casó con la hija del condestable Nuno Álvares Pereira, heredera de sus grandes señoríos, y en 1442 recibió de su sobrino Alfonso V el ducado de Braganza.',
    trayectoria: 'El duque Fernando II fue ejecutado en 1483 por conspirar contra Juan II, y la casa recuperó sus bienes con Manuel I. En 1580 la duquesa Catalina, nieta de Manuel I, fue una de las aspirantes al trono que ocupó Felipe II. En 1640 el duque Juan fue aclamado rey como Juan IV y restauró la independencia de Portugal.',
    legado: 'Los Braganza reinaron en Portugal hasta 1910. Ante la invasión francesa la corte se trasladó a Brasil (1807–1808), y en 1822 Pedro, hijo de Juan VI, proclamó el Imperio del Brasil, que su casa gobernó hasta 1889. Catalina de Braganza fue reina de Inglaterra por su matrimonio con Carlos II (1662).',
    territorios: ['Portugal', 'Brasil'],
    protagonistas: ['ALF1BRAG', 'FERN2BRAG', 'JAIME1BRAG', 'TEOD2BRAG', 'JUAN4PORT', 'PEDRO2PORT', 'JUAN5PORT', 'JOSE1PORT', 'MARIA1PORT', 'JUAN6PORT', 'PEDRO4PORT'],
    fuentes: [TRECCANI('braganza_(Enciclopedia-Italiana)'), MEDLANDS],
  },
  'Árpád': {
    resumen: 'La dinastía nacional húngara. Descendía de Árpád, caudillo de la conquista magiar, y reinó en Hungría desde la coronación de Esteban I hasta la muerte de Andrés III en 1301.',
    origen: 'Árpád dirigió a los magiares en la ocupación de la cuenca de los Cárpatos a finales del siglo IX. Su descendiente Esteban I recibió la corona real con la aprobación del papa Silvestre II y organizó el reino según el modelo franco.',
    trayectoria: 'Los Árpád unieron Croacia a la corona húngara a comienzos del siglo XII. Andrés II concedió a la nobleza la Bula de Oro (1222), y su hijo Bela IV reconstruyó el reino tras la invasión mongola de 1241–1242. La casa emparentó con las grandes dinastías europeas: Violante, hija de Andrés II, fue reina de Aragón como esposa de Jaime I.',
    legado: 'Andrés III, el último varón de la dinastía, murió en 1301. El papado impulsó entonces a Carlos Roberto de Anjou, descendiente de los Árpád por línea femenina, que reinó desde 1308. La corona de san Esteban siguió siendo el símbolo de la legitimidad del reino.',
    territorios: ['Hungría', 'Croacia'],
    protagonistas: ['BELA3HUN', 'EMERICOHUN', 'LADISLAO3HUN', 'ANDRES2HUN', 'BELA4', 'ESTEBV', 'LADI4', 'ANDRES3', 'ISABELH', 'VIOLHUN'],
    fuentes: [GEC('arpad'), GEC('hongria')],
  },
  'Ivrea-Borgoña': {
    resumen: 'La rama de la casa condal de Borgoña, de origen anscárida (casa de Ivrea), que reinó en Castilla y León desde Alfonso VII (1126) hasta Pedro I (1369). Otra rama de la misma casa gobernó el condado de Borgoña.',
    origen: 'Raimundo de Borgoña, hijo del conde Guillermo I de Borgoña, se casó en 1090 con Urraca, hija de Alfonso VI. Su hijo Alfonso VII sucedió a su madre en 1126 y dio comienzo a la llamada dinastía borgoñona de Castilla.',
    trayectoria: 'Alfonso VII volvió a repartir Castilla y León entre sus hijos. Alfonso VIII venció en las Navas de Tolosa (1212). Fernando III, hijo de Berenguela y de Alfonso IX, reunió definitivamente las dos coronas en 1230 y conquistó Córdoba y Sevilla. Le sucedieron Alfonso X el Sabio, Sancho IV, Fernando IV y Alfonso XI.',
    legado: 'Pedro I murió en Montiel en 1369 a manos de su hermanastro Enrique, hijo de Alfonso XI y fundador de la casa de Trastámara. En el condado de Borgoña, Otón IV y sus hijas Juana II y Blanca, de la rama de los condes de Chalon, llevaron la herencia condal a los reyes de Francia. La historiografía denomina a la rama castellana casa de Borgoña o de Ivrea.',
    territorios: ['Castilla', 'León', 'Condado de Borgoña'],
    protagonistas: ['ALF8CAST', 'BERENGCAST', 'ALF9LEON', 'FERN3', 'ALF10', 'SANCHO4', 'FERN4', 'ALF11', 'PEDRO1CAST', 'OTON4BORG', 'JUANA2BORG'],
    fuentes: [GEC('ramon-de-borgonya'), GEC('regne-de-castella'), MEDLANDS],
  },
};
