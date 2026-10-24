// V5.21 · Historias de grandes casas que aún no tenían ficha desarrollada.
// Contexto editorial: cada fecha o parentesco individual se verifica en su ficha.
// Las fuentes deben figurar en el registro general (src/content/sources.js).
const MEDLANDS='https://fmg.ac/Projects/MedLands/index.htm';
const RAH='https://historia-hispanica.rah.es/';
const BRITANNICA='https://www.britannica.com/';
const HABSBURGER_DIVISION='https://www.habsburger.net/en/chapter/tripartite-division-austrian-inheritance';
const HABSBURGER_CROWNS='https://www.habsburger.net/en/chapter/ferdinand-i-new-crowns-habsburgs';

export const CASAS_V521 = {
  'Habsburgo': {
    resumen:'De un linaje condal suabo a la casa que reunió el Imperio, Austria, Bohemia, Hungría, la monarquía hispánica y los Países Bajos, dividida desde 1556 en una rama austríaca y otra española.',
    origen:'Los Habsburgo toman su nombre del castillo de Habsburg, en la actual Argovia suiza. Rodolfo I, elegido rey de romanos en 1273, venció a Otakar II de Bohemia y en 1282 entregó a sus hijos Austria y Estiria, base patrimonial de la casa durante siglos. Alberto I también fue rey de romanos. Desde el siglo XV la familia conservó casi de forma continua la dignidad imperial.',
    trayectoria:'Desde la elección de Alberto II como rey de romanos en 1438 y la de Federico III en 1440, la dignidad regia y después imperial recayó casi sin interrupción en la casa. Federico III casó a su hijo Maximiliano con María de Borgoña en 1477. Los enlaces de Felipe el Hermoso con Juana de Castilla y de los nietos de Maximiliano con los Jagellón llevaron a Carlos V y Fernando I a reunir Castilla, Aragón, Italia, los Países Bajos, Austria, Bohemia y Hungría. Con las abdicaciones de Carlos V en 1555–1556, Felipe II recibió la monarquía hispánica y Fernando I quedó al frente de los dominios centroeuropeos; fue reconocido emperador en 1558.',
    legado:'La rama española se extinguió con Carlos II en 1700 y su herencia desencadenó la guerra de Sucesión. La austríaca terminó en línea masculina con Carlos VI (1740); su hija María Teresa, casada con Francisco Esteban de Lorena, dio origen a la casa de Habsburgo-Lorena. Los matrimonios dentro de la familia, frecuentes en ambas ramas, explican parte de sus crisis sucesorias.',
    territorios:['Austria','Sacro Imperio','España','Bohemia','Hungría','Países Bajos'],
    protagonistas:['ROD1HAB','ALB1HAB','ALB2HABS','FED3HAB','MAXIM1','FEL1CAST','CARLOS5','FERN1EMP','FEL2ESP','RODOLFO2HRE','FEL4ESP','LEOP1HRE','CARLOS2ESP','CARLOS6HRE','MARIATERESAHAB'],
    fuentes:[HABSBURGER_DIVISION,HABSBURGER_CROWNS,MEDLANDS,RAH,BRITANNICA],
  },
  'Trastámara': {
    resumen:'Una rama bastarda de la casa de Borgoña-Ivrea que se impuso en Castilla en 1369 y llegó a reinar en Aragón, Navarra, Nápoles y Sicilia, hasta confluir en los Reyes Católicos.',
    origen:'Enrique, conde de Trastámara, era hijo natural de Alfonso XI de Castilla y de Leonor de Guzmán. Enfrentado a su medio hermano Pedro I, la guerra civil castellana se cruzó con la de los Cien Años: Enrique contó con apoyo francés y Pedro con el inglés. La muerte de Pedro en Montiel (1369) dio el trono a Enrique II.',
    trayectoria:'Juan I y Enrique III consolidaron la dinastía en Castilla. En 1412 el Compromiso de Caspe eligió rey de Aragón a Fernando de Antequera, hijo de Juan I, y la rama aragonesa se extendió con Alfonso V a Nápoles. Juan II de Aragón fue también rey de Navarra por su matrimonio con Blanca I. La rama napolitana de Ferrante continuó como dinastía propia hasta 1501.',
    legado:'El matrimonio de Isabel de Castilla y Fernando de Aragón (1469) reunió las dos ramas principales en las mismas personas, sin fundir sus reinos. La muerte de sus herederos llevó la sucesión a su hija Juana y, por ella, a los Habsburgo. La casa deja así el paso de las coronas medievales a la monarquía hispánica compuesta.',
    territorios:['Castilla','Aragón','Navarra','Nápoles','Sicilia'],
    protagonistas:['ENRIQ2CAST','JUAN1CAST','ENRIQ3CAST','FERN1ARAG','ALF5ARAG','JUAN2ARAG','JUAN2CAST','ENRIQ4CAST','FERN1NAP','ISAB1CAST','FERN2ARAG','JUANA1CAST'],
    fuentes:[RAH,MEDLANDS,BRITANNICA],
  },
  'Médici': {
    resumen:'Banqueros florentinos que gobernaron la república de manera informal, dieron tres papas (León X, Clemente VII y León XI) y, desde 1569, fueron grandes duques de Toscana hasta extinguirse en 1737.',
    origen:'La fortuna familiar procede del banco fundado por Giovanni di Bicci a finales del siglo XIV, con sucursales en Roma, Venecia, Brujas y Londres. Su hijo Cosme el Viejo regresó del exilio en 1434 y desde entonces dirigió Florencia sin ocupar un cargo de príncipe, mediante redes de clientes y el control de las magistraturas.',
    trayectoria:'Lorenzo el Magnífico mantuvo ese poder informal y el prestigio del mecenazgo. Expulsados en 1494 y de nuevo en 1527, los Médici regresaron con el apoyo de sus papas, León X y Clemente VII, y de Carlos V. Alejandro fue el primer duque (1532). Cosme I, de la rama de los Popolani, conquistó Siena y en 1569 recibió del papa el título de gran duque de Toscana.',
    legado:'Los grandes duques gobernaron un estado regional con corte, administración y colecciones que están en el origen de los Uffizi. Catalina y María de Médici fueron reinas de Francia. Con Gian Gastone, muerto sin hijos en 1737, la Toscana pasó a Francisco Esteban de Lorena; su hermana Ana María Luisa legó las colecciones familiares a Florencia.',
    territorios:['Florencia','Toscana','Estados Italianos'],
    protagonistas:['COSIMOILVECCHIO','PIEROILGOTTOSO','LORENZOMEDICI','PAPA_LEON10','PAPA_CLEMENTE7','PAPA_LEON11','ALESSANDROMEDICI','COSIMO1TOSC','FRANCISCO1TOSC','FERN1TOSC','COSIMO3TOSC','GIANGASTONETOSC'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Wittelsbach': {
    resumen:'Duques de Baviera desde 1180 y condes palatinos del Rin, la casa dio emperadores, electores, reyes de Suecia y una red de ramas que llega hasta el siglo XVIII.',
    origen:'Otón de Wittelsbach recibió el ducado de Baviera en 1180 tras la caída de Enrique el León. Su nieto Otón II sumó el Palatinado del Rin por matrimonio. En 1329 el tratado de Pavía separó la línea bávara de la palatina, que conservaría la dignidad electoral reconocida por la Bula de Oro de 1356.',
    trayectoria:'Luis IV de Baviera fue rey de romanos y emperador, enfrentado al papado de Aviñón; Ruperto del Palatinado fue rey de romanos entre 1400 y 1410. Las particiones bávaras (Landshut, Múnich, Ingolstadt, Straubing) se reunificaron con Alberto IV en 1505. En la guerra de los Treinta Años, Federico V del Palatinado perdió Bohemia y su electorado, que pasó a Maximiliano I de Baviera.',
    legado:'La rama de Zweibrücken dio los reyes de Suecia Carlos X Gustavo, Carlos XI y Carlos XII. Carlos Alberto de Baviera fue emperador como Carlos VII (1742–1745) frente a María Teresa. En 1777 Carlos Teodoro, del Palatinado, heredó también Baviera y reunió de nuevo las dos líneas.',
    territorios:['Baviera','Palatinado','Sacro Imperio','Bohemia','Holanda'],
    protagonistas:['OTTO1BAV','OTTO2BAV','LUIS4','RUPERTOHRE','ALB4BAV','MAX1BAV','FED5PALBOH','CARLOS10GUSTAVO','CARLOS12SUE','CARLOS7HRE','CARLOSTEODOROPAL'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Luxemburgo': {
    resumen:'Una casa condal del Mosela que en el siglo XIV reunió el Imperio, Bohemia y Hungría, y se extinguió en línea masculina con Segismundo en 1437.',
    origen:'Enrique VII, conde de Luxemburgo, fue elegido rey de romanos en 1308 y coronado emperador en Roma en 1312, el primero desde Federico II. Su hijo Juan el Ciego obtuvo Bohemia por su matrimonio con Isabel, heredera de los Přemysl, y murió en Crécy (1346).',
    trayectoria:'Carlos IV, hijo de Juan, hizo de Praga la capital del Imperio, fundó su universidad (1348) y promulgó la Bula de Oro (1356), que fijó la elección imperial por siete príncipes. Su hijo Wenceslao IV fue depuesto como rey de romanos en 1400. Segismundo, rey de Hungría por su matrimonio con María, presidió el concilio de Constanza (1414–1418), que puso fin al Cisma.',
    legado:'Segismundo fue también rey de Bohemia y emperador, pero sin hijo varón. Su hija Isabel se casó con Alberto II de Habsburgo, que heredó Hungría, Bohemia y la dignidad de rey de romanos en 1438. La herencia luxemburguesa es así uno de los cimientos del poder Habsburgo en Europa central.',
    territorios:['Luxemburgo','Bohemia','Hungría','Sacro Imperio'],
    protagonistas:['ENRIQ7','JUAN1B','CARLOS4','WEN4LUX','JOBSTMOR','SEGIS1'],
    fuentes:[MEDLANDS,BRITANNICA],
  },
  'Barcelona': {
    resumen:'Los condes de Barcelona que, por el matrimonio de Ramón Berenguer IV con Petronila, reinaron en Aragón y construyeron la Corona de Aragón hasta extinguirse con Martín I en 1410.',
    origen:'La casa condal procede de Guifré el Pilós, en el siglo IX. El matrimonio de Ramón Berenguer IV con Petronila de Aragón (pactado en 1137) unió el condado de Barcelona y el reino de Aragón en sus descendientes. Su hijo Alfonso II fue el primero en reunir ambos títulos desde 1164.',
    trayectoria:'Pedro II murió en Muret (1213) defendiendo a sus aliados occitanos. Jaime I conquistó Mallorca y Valencia. Pedro III ganó Sicilia tras las Vísperas (1282) y Jaime II incorporó Cerdeña. Pedro IV el Ceremonioso reforzó la administración real y reintegró Mallorca a la Corona.',
    legado:'Juan I y Martín I murieron sin descendencia masculina superviviente; Martín el Joven, rey de Sicilia, falleció en 1409. El interregno terminó con el Compromiso de Caspe (1412), que eligió a Fernando de Antequera, de los Trastámara. La Corona conservó sus instituciones, cortes y fueros propios.',
    territorios:['Condado de Barcelona','Aragón','Corona de Aragón','Valencia','Mallorca','Sicilia'],
    protagonistas:['ALF2AR','PEDRO2AR','JAIME1AR','PEDRO3AR','ALF3ARAG','JAIME2AR','ALF4ARAG','PEDRO4ARAG','JUAN1ARAG','MARTIN1ARAG','MARTINJOVENSIC'],
    fuentes:[RAH,MEDLANDS,BRITANNICA],
  },
};
