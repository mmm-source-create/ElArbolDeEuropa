export const EVENTOS_HISTORICOS = [
  // `timeline` controla la visibilidad en la cronología general:
  // - principal: título visible siempre en modo "Ambos".
  // - secundario (valor por defecto): hito visible de forma compacta; el título aparece al ampliar.
  // - historia: hito narrativo oculto salvo cuando es el paso activo de una Historia.
  {
    id: "MAGNA_CARTA",
    timeline: "principal",
    anio: 1215,
    titulo: "Magna Carta",
    categoria: "politica",
    descripcion: "Juan de Inglaterra acepta la Magna Carta, un hito en la limitación pactada del poder regio."
  },
  {
    id: "CONSTANTINOPLA_1261",
    timeline: "principal",
    anio: 1261,
    titulo: "Restauración bizantina de Constantinopla",
    categoria: "politica",
    descripcion: "Miguel VIII Paleólogo recupera Constantinopla y restaura el Imperio bizantino bajo la dinastía Paleólogo."
  },
  {
    id: "VISPERAS_SICILIANAS",
    timeline: "principal",
    anio: 1282,
    titulo: "Vísperas Sicilianas",
    categoria: "guerra",
    descripcion: "La rebelión siciliana rompe el dominio angevino de la isla y abre una larga disputa mediterránea con la Corona de Aragón."
  },
  {
    id: "AVINON",
    timeline: "principal",
    desde: 1309,
    hasta: 1377,
    titulo: "Papado de Aviñón",
    categoria: "religion",
    descripcion: "La residencia pontificia se establece en Aviñón durante gran parte del siglo XIV."
  },
  {
    id: "CRISIS_CAPETA_1328",
    anio: 1328,
    titulo: "Crisis sucesoria de Francia",
    categoria: "dinastia",
    personas: ["FEL6FRA", "EDUARDO3ING", "ISABFRAING"],
    descripcion: "La extinción de la línea capeta directa abre una disputa sucesoria: Felipe de Valois es coronado como Felipe VI, mientras Eduardo III conserva una reclamación dinástica por su madre Isabel de Francia."
  },
  {
    id: "CRECY_1346",
    anio: 1346,
    titulo: "Batalla de Crécy",
    categoria: "guerra",
    personas: ["EDUARDO3ING", "EDUNEGRO", "FEL6FRA"],
    descripcion: "La victoria inglesa de Crécy confirma la eficacia de sus ejércitos combinados y da a Eduardo III una posición dominante en la primera fase de la guerra."
  },
  {
    id: "POITIERS_1356",
    anio: 1356,
    titulo: "Batalla de Poitiers",
    categoria: "guerra",
    personas: ["EDUNEGRO", "JUANCHANDOS", "JUAN2FRA"],
    descripcion: "El ejército del Príncipe Negro derrota a Juan II de Francia y captura al rey, llevando la monarquía francesa a una crisis política y financiera."
  },
  {
    id: "BRETIGNY_1360",
    anio: 1360,
    titulo: "Tratado de Brétigny",
    categoria: "politica",
    personas: ["EDUARDO3ING", "JUAN2FRA", "EDUNEGRO"],
    descripcion: "El acuerdo reconoce una enorme expansión de los dominios ingleses en Francia a cambio de importantes concesiones dinásticas."
  },
  {
    id: "RECONQUISTA_CARLOS5_1369",
    desde: 1369,
    hasta: 1380,
    titulo: "La recuperación de Carlos V",
    categoria: "guerra",
    personas: ["CARLOS5FRA", "BERTRANDGUESCLIN", "EDUNEGRO"],
    descripcion: "Carlos V y Bertrand du Guesclin evitan las grandes batallas campales y recuperan gran parte de los territorios perdidos por Francia."
  },
  {
    id: "CIEN_ANOS",
    timeline: "principal",
    desde: 1337,
    hasta: 1453,
    titulo: "Guerra de los Cien Años",
    categoria: "guerra",
    descripcion: "Conflicto dinástico y territorial prolongado entre las coronas de Inglaterra y Francia."
  },
  {
    id: "PESTE_NEGRA",
    timeline: "principal",
    desde: 1347,
    hasta: 1351,
    titulo: "Peste Negra en Europa",
    categoria: "sociedad",
    descripcion: "La gran epidemia de peste transforma profundamente la demografía, la economía y la sociedad europeas."
  },
  {
    id: "BULA_ORO",
    timeline: "principal",
    anio: 1356,
    titulo: "Bula de Oro",
    categoria: "politica",
    descripcion: "Carlos IV fija principios duraderos para la elección del rey de Romanos dentro del Sacro Imperio."
  },
  {
    id: "BORGO_1363",
    anio: 1363,
    titulo: "Felipe el Atrevido recibe Borgoña",
    categoria: "dinastia",
    personas: ["FEL2BORG", "JUAN2FRA"],
    descripcion: "Juan II de Francia entrega el ducado de Borgoña a su hijo Felipe, origen de la rama Valois-Borgoña."
  },
  {
    id: "BORGO_1369",
    anio: 1369,
    titulo: "Matrimonio de Felipe y Margarita de Flandes",
    categoria: "dinastia",
    personas: ["FEL2BORG", "MARGFLAN"],
    descripcion: "El matrimonio con Margarita de Flandes prepara la unión de Borgoña con ricos territorios flamencos y borgoñones."
  },
  {
    id: "CISMA_OCCIDENTE",
    timeline: "principal",
    desde: 1378,
    hasta: 1417,
    titulo: "Cisma de Occidente",
    categoria: "religion",
    descripcion: "Distintos obediencias papales compiten por la legitimidad de la Iglesia latina."
  },
  {
    id: "ALJUBARROTA",
    timeline: "principal",
    anio: 1385,
    titulo: "Batalla de Aljubarrota",
    categoria: "guerra",
    descripcion: "La victoria portuguesa consolida la dinastía de Avís y la independencia del reino frente a Castilla."
  },
  {
    id: "NICOPOLIS",
    timeline: "principal",
    anio: 1396,
    titulo: "Batalla de Nicópolis",
    categoria: "guerra",
    descripcion: "Una gran cruzada europea es derrotada por el Imperio otomano en los Balcanes."
  },
  {
    id: "AGINCOURT",
    timeline: "principal",
    anio: 1415,
    titulo: "Batalla de Agincourt",
    categoria: "guerra",
    descripcion: "Enrique V de Inglaterra obtiene una gran victoria sobre el ejército francés durante la Guerra de los Cien Años."
  },
  {
    id: "MONTEREAU",
    anio: 1419,
    titulo: "Asesinato de Juan Sin Miedo",
    categoria: "dinastia",
    personas: ["JUAN1BORG", "FEL3BORG"],
    descripcion: "Juan Sin Miedo es asesinado en Montereau. Felipe el Bueno hereda Borgoña y se acerca al bando inglés."
  },
  {
    id: "TROYES",
    anio: 1420,
    titulo: "Tratado de Troyes",
    categoria: "politica",
    descripcion: "El tratado reconoce a Enrique V y a sus herederos como sucesores de Carlos VI de Francia."
  },
  {
    id: "ORLEANS",
    anio: 1429,
    titulo: "Liberación de Orleans",
    categoria: "guerra",
    descripcion: "La intervención de Juana de Arco contribuye al giro de la guerra a favor de Carlos VII de Francia."
  },
  {
    id: "REIMS_1429",
    anio: 1429,
    titulo: "Coronación de Carlos VII en Reims",
    categoria: "dinastia",
    personas: ["CARLOS7FRA", "JUANAARCO"],
    descripcion: "Tras la campaña del Loira, Carlos VII alcanza Reims y es coronado, reforzando decisivamente su legitimidad frente a la monarquía anglo-francesa de Enrique VI."
  },
  {
    id: "CAPTURA_JUANA_1430",
    anio: 1430,
    titulo: "Captura de Juana de Arco",
    categoria: "guerra",
    personas: ["JUANAARCO", "FEL3BORG"],
    descripcion: "Juana es capturada por fuerzas borgoñonas cerca de Compiègne y termina en manos inglesas; será ejecutada en Rouen en 1431."
  },
  {
    id: "TOISON_ORO",
    anio: 1430,
    titulo: "Fundación de la Orden del Toisón de Oro",
    categoria: "dinastia",
    personas: ["FEL3BORG", "ISABPORTBORG"],
    descripcion: "Felipe el Bueno funda la Orden del Toisón de Oro en el contexto de su matrimonio con Isabel de Portugal."
  },
  {
    id: "ARRAS_1435",
    anio: 1435,
    titulo: "Tratado de Arras",
    categoria: "politica",
    personas: ["FEL3BORG", "CARLOS7FRA"],
    descripcion: "Felipe el Bueno se reconcilia con Carlos VII y rompe su alianza con Inglaterra."
  },
  {
    id: "FORMIGNY_1450",
    anio: 1450,
    titulo: "Batalla de Formigny",
    categoria: "guerra",
    personas: ["ARTURO3BRET", "CARLOS7FRA"],
    descripcion: "La victoria francesa en Normandía acelera la expulsión inglesa del norte de Francia y muestra una monarquía francesa militarmente reorganizada."
  },
  {
    id: "CASTILLON_1453",
    anio: 1453,
    titulo: "Batalla de Castillon",
    categoria: "guerra",
    personas: ["JUANTALBOT", "JEANBUREAU", "CARLOS7FRA"],
    descripcion: "La artillería francesa derrota al ejército de John Talbot en Castillon. La pérdida de Guyena cierra convencionalmente la Guerra de los Cien Años."
  },
  {
    id: "VARNA",
    anio: 1444,
    titulo: "Batalla de Varna",
    categoria: "guerra",
    descripcion: "La cruzada de Varna termina con una victoria otomana y la muerte del rey Vladislao III."
  },
  {
    id: "CONSTANTINOPLA_1453",
    timeline: "principal",
    anio: 1453,
    titulo: "Caída de Constantinopla",
    categoria: "guerra",
    descripcion: "Mehmed II conquista Constantinopla y pone fin al Imperio bizantino."
  },
  {
    id: "ROSAS",
    timeline: "principal",
    desde: 1455,
    hasta: 1487,
    titulo: "Guerra de las Dos Rosas",
    categoria: "guerra",
    descripcion: "Las ramas de Lancaster y York disputan la corona inglesa en una larga sucesión de conflictos dinásticos."
  },
  {
    id: "BORGO_1467",
    anio: 1467,
    titulo: "Carlos el Temerario hereda Borgoña",
    categoria: "dinastia",
    personas: ["CAR1BORG", "FEL3BORG"],
    descripcion: "Carlos el Temerario sucede a Felipe el Bueno e intenta consolidar un bloque territorial borgoñón entre Francia y el Imperio."
  },
  {
    id: "REYES_CATOLICOS",
    timeline: "principal",
    anio: 1469,
    titulo: "Matrimonio de Isabel de Castilla y Fernando de Aragón",
    categoria: "dinastia",
    personas: ["ISAB1CAST", "FERN2ARAG"],
    descripcion: "La unión matrimonial enlaza las dos principales coronas de la península ibérica sin fusionarlas jurídicamente en un único reino."
  },
  {
    id: "NANCY_1477",
    anio: 1477,
    titulo: "Batalla de Nancy y muerte de Carlos el Temerario",
    categoria: "guerra",
    personas: ["CAR1BORG", "MARIABORG"],
    descripcion: "Carlos muere sin heredero varón. Su hija María recibe una herencia disputada inmediatamente por Luis XI de Francia."
  },
  {
    id: "BODA_MARIA_MAX",
    anio: 1477,
    titulo: "María de Borgoña se casa con Maximiliano",
    categoria: "dinastia",
    personas: ["MARIABORG", "MAXIM1"],
    descripcion: "El matrimonio vincula la herencia borgoñona con los Habsburgo y cambia el equilibrio político de Europa occidental."
  },
  {
    id: "BOSWORTH",
    timeline: "principal",
    anio: 1485,
    titulo: "Batalla de Bosworth",
    categoria: "guerra",
    descripcion: "La derrota y muerte de Ricardo III abre el camino al reinado de Enrique VII Tudor."
  },
  {
    id: "GRANADA_1492",
    timeline: "principal",
    anio: 1492,
    titulo: "Conquista de Granada",
    categoria: "guerra",
    descripcion: "La toma de Granada pone fin al último reino islámico peninsular de la Edad Media."
  },
  {
    id: "SENLIS_1493",
    anio: 1493,
    titulo: "Tratado de Senlis",
    categoria: "politica",
    personas: ["MAXIM1", "FEL1CAST"],
    descripcion: "El acuerdo devuelve Artois y el Franco Condado a la herencia de María de Borgoña, mientras el ducado de Borgoña permanece en manos francesas."
  },
  {
    id: "GUERRAS_ITALIA",
    timeline: "principal",
    desde: 1494,
    hasta: 1559,
    titulo: "Guerras Italianas",
    categoria: "guerra",
    descripcion: "Francia, España, el Imperio y numerosos estados italianos compiten por el control político de la península."
  },
  {
    id: "LUTERO_1517",
    timeline: "principal",
    anio: 1517,
    titulo: "Inicio simbólico de la Reforma luterana",
    categoria: "religion",
    personas: ["LUTERO", "TETZEL", "PAPA_LEON10", "FRED3SAX"],
    descripcion: "La controversia sobre las indulgencias convierte a Martín Lutero en el centro de una disputa que pronto desborda el debate académico y cuestiona autoridad, doctrina y obediencia."
  },
  {
    id: "WORMS_1521",
    timeline: "principal",
    anio: 1521,
    titulo: "Dieta de Worms",
    categoria: "religion",
    personas: ["CARLOS5", "LUTERO", "FRED3SAX"],
    descripcion: "Carlos V exige a Lutero que se retracte. La negativa del reformador y la protección política de Federico el Sabio transforman una disputa teológica en un problema constitucional del Imperio."
  },
  {
    id: "PAVIA_1525",
    timeline: "principal",
    anio: 1525,
    titulo: "Batalla de Pavía",
    categoria: "guerra",
    personas: ["CARLOS5"],
    descripcion: "Las fuerzas imperiales derrotan al ejército francés y capturan al rey Francisco I."
  },
  {
    id: "SACO_ROMA_1527",
    timeline: "principal",
    anio: 1527,
    titulo: "Saco de Roma",
    categoria: "guerra",
    personas: ["CARLOS5"],
    descripcion: "Tropas imperiales amotinadas saquean Roma durante las Guerras Italianas."
  },
  {
    id: "AUGSBURGO_1555",
    timeline: "principal",
    anio: 1555,
    titulo: "Paz de Augsburgo",
    categoria: "religion",
    personas: ["CARLOS5", "FERN1EMP", "JUANFED1SAX", "FELIPEHESSE"],
    descripcion: "El acuerdo acepta jurídicamente la coexistencia de territorios católicos y luteranos dentro del Imperio y reconoce que la unidad religiosa ya no puede restaurarse por simple imposición imperial."
  },
  {
    id: "ABDICACION_CARLOS",
    desde: 1555,
    hasta: 1556,
    titulo: "Abdicaciones de Carlos V",
    categoria: "dinastia",
    personas: ["CARLOS5", "FEL2ESP"],
    descripcion: "Carlos V reparte progresivamente sus dominios entre la rama española y la rama austríaca de los Habsburgo."
  },
  {
    id: "LEPANTO",
    timeline: "principal",
    anio: 1571,
    titulo: "Batalla de Lepanto",
    categoria: "guerra",
    personas: ["DONJUANAUST", "MARCANTONIO2COL", "SEBASTIANOVENIER", "GIANANDREADORIA", "AGOSTINOBARBARIGO", "ALVAROBAZAN", "ALIPASHALEPANTO", "ULUCALI", "SELIM2OSM", "CERVANTES"],
    descripcion: "La flota de la Liga Santa, dirigida por don Juan de Austria y compuesta principalmente por fuerzas de la Monarquía Hispánica, Venecia y los Estados Pontificios, derrota a la armada otomana de Alí Bajá tras horas de combate de galera contra galera. El centro otomano se derrumba, Uluç Alí consigue salvar parte de su ala y miles de combatientes quedan muertos, heridos o cautivos. La victoria no expulsa al Imperio otomano del Mediterráneo, pero destruye gran parte de su flota de combate y se convierte en un enorme triunfo político y simbólico de la coalición."
  },
  {
    id: "ARMADA_1588",
    timeline: "principal",
    anio: 1588,
    titulo: "Armada de 1588",
    categoria: "guerra",
    personas: ["FEL2ESP"],
    descripcion: "La expedición naval de Felipe II contra Inglaterra fracasa tras combates, problemas logísticos y temporales adversos."
  },
  {
    id: "TREINTA_ANOS",
    timeline: "principal",
    desde: 1618,
    hasta: 1648,
    titulo: "Guerra de los Treinta Años",
    categoria: "guerra",
    descripcion: "Una guerra inicialmente imperial y confesional se convierte en un conflicto europeo de gran escala."
  },
  {
    id: "WESTFALIA",
    timeline: "principal",
    anio: 1648,
    titulo: "Paz de Westfalia",
    categoria: "politica",
    descripcion: "Los tratados de 1648 ponen fin a la Guerra de los Treinta Años y reordenan múltiples relaciones políticas europeas."
  },
  {
    id: "COMPANIA_BLANCA_1363",
    anio: 1363,
    titulo: "La Compañía Blanca entra en la política italiana",
    categoria: "guerra",
    personas: ["HAWKWOOD"],
    descripcion: "Compañías de veteranos de la Guerra de los Cien Años, entre ellas la asociada a John Hawkwood, convierten la condotta mercenaria en una fuerza decisiva de la política italiana."
  },
  {
    id: "BARBIANO_1379",
    anio: 1379,
    titulo: "Alberico da Barbiano y la Compañía de San Jorge",
    categoria: "guerra",
    personas: ["ALBERICOBARB"],
    descripcion: "Alberico da Barbiano simboliza la consolidación de compañías de armas dirigidas por capitanes italianos, capaces de competir con las grandes compañías extranjeras."
  },
  {
    id: "LAQUILA_1424",
    anio: 1424,
    titulo: "L'Aquila: caída de Braccio da Montone",
    categoria: "guerra",
    personas: ["BRACCIOMONT", "FRAN1SFOR", "NICCPICC", "MUZIOSFOR"],
    descripcion: "La guerra de L'Aquila destruye el poder de Braccio da Montone y acelera el ascenso de una nueva generación de capitanes, entre ellos Francesco Sforza y Niccolò Piccinino."
  },
  {
    id: "CARMAGNOLA_1432",
    anio: 1432,
    titulo: "Venecia ejecuta a Carmagnola",
    categoria: "politica",
    personas: ["CARMAGNOLA"],
    descripcion: "La ejecución de Carmagnola muestra la tensión esencial del sistema: los estados necesitaban grandes capitanes, pero temían que sus intereses privados acabasen imponiéndose a los del empleador."
  },
  {
    id: "BODA_SFORZA_VISCONTI_1441",
    anio: 1441,
    titulo: "Francesco Sforza se casa con Bianca Maria Visconti",
    categoria: "dinastia",
    personas: ["FRAN1SFOR", "BLANMARVISC", "FELMARVISC"],
    descripcion: "El matrimonio introduce a un condotiero en la sucesión del ducado de Milán y demuestra hasta qué punto la fuerza militar podía transformarse en legitimidad dinástica."
  },
  {
    id: "SFORZA_DUQUE_1450",
    anio: 1450,
    titulo: "Francesco Sforza, duque de Milán",
    categoria: "dinastia",
    personas: ["FRAN1SFOR", "BLANMARVISC"],
    descripcion: "Francesco Sforza culmina la trayectoria más extraordinaria de un condotiero: de capitán mercenario a fundador de una dinastía ducal."
  },
  {
    id: "LODI_1454",
    anio: 1454,
    titulo: "Paz de Lodi",
    categoria: "politica",
    personas: ["FRAN1SFOR"],
    descripcion: "La paz entre Milán y Venecia inaugura un equilibrio italiano que reduce el espacio político para los grandes capitanes independientes y favorece ejércitos más controlados por los estados."
  },
  {
    id: "SENIGALLIA_1502",
    anio: 1502,
    titulo: "La trampa de Senigallia",
    categoria: "politica",
    personas: ["CESARBORJA", "VITELLOZZO", "NICCOLOMACHIAVELLI"],
    descripcion: "César Borja elimina en Senigallia a varios capitanes que se habían rebelado contra él. El episodio, observado por Maquiavelo, resume el conflicto entre el príncipe territorial y los condotieros autónomos."
  },
  {
    id: "AGNADELLO_1509",
    anio: 1509,
    titulo: "Batalla de Agnadello",
    categoria: "guerra",
    personas: ["BARTALVIANO", "TRIVULZIO"],
    descripcion: "La derrota veneciana de Agnadello muestra a los condotieros dentro de guerras ya dominadas por grandes coaliciones internacionales y ejércitos de escala mucho mayor."
  },
  {
    id: "BANDENERE_1526",
    anio: 1526,
    titulo: "Muere Giovanni dalle Bande Nere",
    categoria: "guerra",
    personas: ["GIOVBANDENERE"],
    descripcion: "La muerte de Giovanni de' Medici tras ser herido por artillería se convirtió en un símbolo tardío del mundo de los grandes capitanes de ventura frente a una guerra cada vez más transformada por las armas de fuego."
  },
  {
    id: "LEONARDO_MILAN_1482",
    timeline: "historia",
    anio: 1482,
    titulo: "Leonardo entra al servicio de los Sforza",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "LUDOVSFOR"],
    descripcion: "Leonardo se instala en Milán y desarrolla durante años una carrera al servicio de la corte de Ludovico Sforza."
  },
  {
    id: "DAMA_ARMINO_1490",
    timeline: "historia",
    anio: 1490,
    titulo: "La Dama del armiño",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "CECIGALL", "LUDOVSFOR"],
    descripcion: "Leonardo retrata a Cecilia Gallerani, amante de Ludovico Sforza. En 1491 Cecilia dará a Ludovico un hijo, Cesare."
  },
  {
    id: "BIANCA_SFORZA_1496",
    timeline: "historia",
    anio: 1496,
    titulo: "Bianca Giovanna Sforza",
    categoria: "dinastia",
    personas: ["BIANSFOR", "LUDOVSFOR", "BERNACORR"],
    descripcion: "Bianca Giovanna Sforza pertenece al círculo milanés en el que se formó la primera gran etapa cortesana de Leonardo. Una hipótesis moderna y minoritaria la ha propuesto como modelo de la Gioconda."
  },
  {
    id: "LEONARDO_BORJA_1502",
    timeline: "historia",
    anio: 1502,
    titulo: "Leonardo al servicio de César Borja",
    categoria: "politica",
    personas: ["LEONARDODAVINCI", "CESARBORJA"],
    descripcion: "Leonardo trabaja como ingeniero militar para César Borja durante sus campañas en Italia central."
  },
  {
    id: "GIOCONDA_1503",
    timeline: "historia",
    anio: 1503,
    titulo: "Comienza la historia de la Gioconda",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "LISAGHERARDINI", "FRANCESCOGIOCONDO"],
    descripcion: "La identificación tradicional y hoy dominante relaciona el retrato con Lisa Gherardini, esposa del mercader florentino Francesco del Giocondo."
  },
  {
    id: "LEONARDO_MILAN_1506",
    timeline: "historia",
    anio: 1506,
    titulo: "Leonardo regresa a Milán",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "CHARLES2AMBOISE"],
    descripcion: "Leonardo vuelve a Milán bajo la protección del gobernador francés Charles II d'Amboise."
  },
  {
    id: "LEONARDO_ROMA_1513",
    timeline: "historia",
    anio: 1513,
    titulo: "Leonardo en la Roma de los Médici",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "GIULIANOMEDICI", "PAPA_LEON10"],
    descripcion: "Leonardo se instala en Roma bajo la protección de Giuliano de' Medici durante el pontificado de León X."
  },
  {
    id: "LEONARDO_FRANCIA_1516",
    timeline: "historia",
    anio: 1516,
    titulo: "Francisco I llama a Leonardo a Francia",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "FRAN1FRA", "FRANCESCOMELZI"],
    descripcion: "Leonardo se traslada a Francia acompañado por Francesco Melzi y entra en la órbita de Francisco I."
  },
  {
    id: "LEONARDO_MUERTE_1519",
    timeline: "historia",
    anio: 1519,
    titulo: "Muere Leonardo",
    categoria: "cultura",
    personas: ["LEONARDODAVINCI", "FRAN1FRA", "FRANCESCOMELZI"],
    descripcion: "Leonardo muere en Francia. La Gioconda permaneció con él hasta sus últimos años y acabó incorporándose a la colección real francesa."
  },
  {
    id: "INTERREGNO_IMPERIAL_1250",
    desde: 1250,
    hasta: 1273,
    titulo: "El Gran Interregno imperial",
    categoria: "politica",
    personas: ["FED2HOH", "CONRADO4HOH", "GUILLERMOHOLANDA", "RICARDOCORNUALLES", "ALF10"],
    descripcion: "Tras el derrumbe de la autoridad Hohenstaufen, varios reyes rivales disputan una corona imperial cuya capacidad de imponer obediencia se debilita profundamente."
  },
  {
    id: "RODOLFO_1273",
    anio: 1273,
    titulo: "Rodolfo de Habsburgo es elegido rey de Romanos",
    categoria: "dinastia",
    personas: ["ROD1HAB", "OTAK2"],
    descripcion: "La elección de Rodolfo I cierra el Gran Interregno y coloca por primera vez a los Habsburgo en el centro de la política imperial."
  },
  {
    id: "MARCHFELD_1278",
    anio: 1278,
    titulo: "Marchfeld y la base austríaca de los Habsburgo",
    categoria: "guerra",
    personas: ["ROD1HAB", "OTAK2"],
    descripcion: "La derrota y muerte de Otakar II permite consolidar la apropiación habsbúrgica de Austria y Estiria, base territorial de una dinastía que aún tardará generaciones en monopolizar la corona imperial."
  },
  {
    id: "HABSBURGO_1452",
    anio: 1452,
    titulo: "Federico III, emperador Habsburgo",
    categoria: "dinastia",
    personas: ["FED3HAB"],
    descripcion: "La coronación de Federico III inaugura una continuidad dinástica extraordinaria: salvo una breve interrupción en el siglo XVIII, la dignidad imperial permanecerá ligada a los Habsburgo y luego a los Habsburgo-Lorena."
  },
  {
    id: "REFORMA_IMPERIAL_1495",
    anio: 1495,
    titulo: "Reforma imperial de Maximiliano I",
    categoria: "politica",
    personas: ["MAXIM1"],
    descripcion: "La Dieta de Worms impulsa mecanismos comunes de justicia, paz pública y organización política que intentan hacer gobernable un Imperio compuesto por centenares de poderes territoriales."
  },
  {
    id: "ELECCION_CARLOS5_1519",
    anio: 1519,
    titulo: "Carlos V es elegido rey de Romanos",
    categoria: "dinastia",
    personas: ["CARLOS5", "MAXIM1", "FRED3SAX"],
    descripcion: "La sucesión de Maximiliano I convierte la elección imperial en una competición europea. Carlos reúne la corona imperial con una herencia dinástica que se extiende desde los Países Bajos hasta España y América."
  },
  {
    id: "PRAGMATICA_1713",
    anio: 1713,
    titulo: "Pragmática Sanción de Carlos VI",
    categoria: "dinastia",
    personas: ["CARLOS6HRE", "MARIATERESAHAB"],
    descripcion: "Ante la ausencia de un heredero varón, Carlos VI intenta asegurar la indivisibilidad de los dominios Habsburgo y la sucesión de su futura hija María Teresa."
  },
  {
    id: "CARLOS7_1742",
    anio: 1742,
    titulo: "Carlos VII rompe la continuidad Habsburgo",
    categoria: "dinastia",
    personas: ["CARLOS7HRE", "MARIAAMALIAHAB1701", "MARIATERESAHAB"],
    descripcion: "En plena Guerra de Sucesión Austríaca, el elector Wittelsbach Carlos Alberto obtiene la corona imperial y demuestra que la dignidad sigue siendo electiva, incluso tras siglos de predominio Habsburgo."
  },
  {
    id: "FRANCISCO1_1745",
    anio: 1745,
    titulo: "Francisco I inaugura la casa Habsburgo-Lorena",
    categoria: "dinastia",
    personas: ["FRAN1HRE", "MARIATERESAHAB"],
    descripcion: "La elección de Francisco Esteban devuelve la corona al entorno dinástico de María Teresa y crea la línea Habsburgo-Lorena."
  },
  {
    id: "JOSE2_1765",
    anio: 1765,
    titulo: "José II, emperador reformista",
    categoria: "politica",
    personas: ["JOSE2HRE", "MARIATERESAHAB", "FRAN1HRE"],
    descripcion: "José II sucede a su padre como emperador y, tras 1780, intenta reformar con rapidez los dominios Habsburgo, chocando repetidamente con privilegios territoriales y corporativos."
  },
  {
    id: "REVOLUCION_FRANCESA_1789",
    timeline: "principal",
    anio: 1789,
    titulo: "Revolución francesa",
    categoria: "politica",
    personas: ["MARIAANTONIETA", "JOSE2HRE", "LEOP2HRE"],
    descripcion: "La revolución en Francia altera el equilibrio político europeo y convierte la suerte de María Antonieta, hermana de José II y Leopoldo II, en un problema dinástico internacional."
  },
  {
    id: "FRANCISCO2_1792",
    anio: 1792,
    titulo: "Francisco II ante la Europa revolucionaria",
    categoria: "dinastia",
    personas: ["FRAN2HRE", "LEOP2HRE"],
    descripcion: "Francisco II hereda la corona imperial en plena guerra revolucionaria. Al llegar 1800, el viejo Imperio sigue existiendo, pero se enfrenta a una transformación que culminará pocos años después."
  },
  {
    id: "ERASMO_1516",
    anio: 1516,
    titulo: "Erasmo publica su Nuevo Testamento",
    categoria: "religion",
    personas: ["ERASMOROT"],
    descripcion: "La edición griega y latina de Erasmo representa el programa humanista de volver a las fuentes y someter los textos a examen filológico, un clima intelectual decisivo para las controversias religiosas del siglo XVI."
  },
  {
    id: "LEIPZIG_1519",
    anio: 1519,
    titulo: "Disputa de Leipzig",
    categoria: "religion",
    personas: ["LUTERO", "JOHANNECK"],
    descripcion: "El enfrentamiento con Johann Eck empuja a Lutero más allá de la cuestión de las indulgencias: la discusión alcanza la autoridad papal, los concilios y la primacía de la Escritura."
  },
  {
    id: "ZURICH_1523",
    anio: 1523,
    titulo: "La Reforma se consolida en Zúrich",
    categoria: "religion",
    personas: ["ZWINGLI"],
    descripcion: "Las disputas públicas de Zúrich respaldan el programa de Ulrico Zuinglio. La Reforma deja de ser únicamente un fenómeno sajón y adopta una trayectoria suiza propia."
  },
  {
    id: "SPEYER_1529",
    anio: 1529,
    titulo: "La Protesta de Espira",
    categoria: "religion",
    personas: ["JUANSAX", "FELIPEHESSE"],
    descripcion: "Príncipes y ciudades reformistas protestan contra la reversión de concesiones religiosas. De esta protesta política nace el nombre que acabará identificando a las iglesias protestantes."
  },
  {
    id: "CONFESION_AUGSBURGO_1530",
    timeline: "principal",
    anio: 1530,
    titulo: "Confesión de Augsburgo",
    categoria: "religion",
    personas: ["MELANCHTHON", "CARLOS5", "JUANSAX", "FELIPEHESSE"],
    descripcion: "Felipe Melanchthon presenta ante Carlos V una exposición sistemática de la fe luterana, respaldada por varios príncipes y ciudades del Imperio."
  },
  {
    id: "SUPREMACIA_1534",
    timeline: "principal",
    anio: 1534,
    titulo: "Enrique VIII rompe jurídicamente con Roma",
    categoria: "religion",
    personas: ["ENRIQ8ING", "THOMASCROMWELL", "THOMASCRANMER", "TOMASMORO", "ANABOLENA"],
    descripcion: "La supremacía real sobre la Iglesia de Inglaterra convierte una crisis matrimonial y política en una ruptura eclesiástica de consecuencias duraderas."
  },
  {
    id: "CALVINO_1536",
    anio: 1536,
    titulo: "Calvino publica la primera Institución",
    categoria: "religion",
    personas: ["CALVINO"],
    descripcion: "Juan Calvino sistematiza una teología reformada que tendrá enorme influencia en Suiza, Francia, los Países Bajos, Escocia y otros espacios europeos."
  },
  {
    id: "JESUITAS_1540",
    anio: 1540,
    titulo: "Paulo III aprueba la Compañía de Jesús",
    categoria: "religion",
    personas: ["IGNACIOLOYOLA", "DIEGOLAIN", "PAPA_PAULO3"],
    descripcion: "La aprobación de la Compañía de Jesús da forma institucional a una de las fuerzas más dinámicas de la renovación católica, activa en educación, misiones y controversia teológica."
  },
  {
    id: "TRENTO_1545",
    timeline: "principal",
    desde: 1545,
    hasta: 1563,
    titulo: "Concilio de Trento",
    categoria: "religion",
    personas: ["PAPA_PAULO3", "PAPA_JULIO3", "PAPA_PIO4", "SERIPANDO", "DOMINGOSOTO", "DIEGOLAIN", "ALFONSOSALMERON", "GIOVANNIMORONE"],
    descripcion: "El concilio clarifica doctrina católica y aprueba reformas disciplinares en tres grandes fases, bajo tres pontificados, mientras la división confesional de Europa se vuelve permanente."
  },
  {
    id: "MUHLBERG_1547",
    anio: 1547,
    titulo: "Batalla de Mühlberg",
    categoria: "guerra",
    personas: ["CARLOS5", "JUANFED1SAX", "FELIPEHESSE"],
    descripcion: "Carlos V derrota a la Liga de Esmalcalda y captura a sus dos grandes dirigentes, pero la victoria militar no consigue restaurar la unidad religiosa del Imperio."
  },
  {
    id: "ELIZABETH_SETTLEMENT_1559",
    timeline: "principal",
    anio: 1559,
    titulo: "Acuerdo religioso isabelino",
    categoria: "religion",
    personas: ["ISABEL1ING", "THOMASCRANMER", "MARIA1ING"],
    descripcion: "Tras los giros confesionales de Enrique VIII, Eduardo VI y María I, Isabel I consolida una Iglesia de Inglaterra separada de Roma con una identidad protestante propia."
  },
  {
    id: "TRENTO_CIERRE_1563",
    anio: 1563,
    titulo: "Trento concluye",
    categoria: "religion",
    personas: ["PAPA_PIO4", "GIOVANNIMORONE", "DIEGOLAIN", "ALFONSOSALMERON", "SERIPANDO"],
    descripcion: "La última fase del Concilio culmina un programa de definición doctrinal y reforma eclesiástica que dará forma al catolicismo de la Edad Moderna."
  },
  {
    id: "PAPA_ORSINI_1277",
    anio: 1277,
    titulo: "Nicolás III y el ascenso de los Orsini",
    categoria: "dinastia",
    personas: ["PAPA_NICOLAS3", "MATTEOROSSOCARD"],
    descripcion: "La elección de Giovanni Gaetano Orsini como Nicolás III sitúa a una de las grandes familias baroniales romanas en el centro del gobierno pontificio y favorece una amplia red de parientes y clientes."
  },
  {
    id: "CAETANI_COLONNA_1297",
    anio: 1297,
    titulo: "Bonifacio VIII contra los Colonna",
    categoria: "politica",
    personas: ["PAPA_BONIFACIO8", "PIETROCOLONNACARD", "SCIARRACOLONNA"],
    descripcion: "El conflicto entre Bonifacio VIII y los Colonna convierte una rivalidad de familias romanas en una crisis política y eclesiástica de alcance europeo."
  },
  {
    id: "MARTIN5_1417",
    anio: 1417,
    titulo: "Martín V y el regreso de los Colonna",
    categoria: "religion",
    personas: ["PAPA_MARTIN5"],
    descripcion: "El Concilio de Constanza elige a Oddone Colonna como Martín V, cerrando el Cisma de Occidente y devolviendo a Roma una cabeza pontificia reconocida."
  },
  {
    id: "SIXTO4_1471",
    anio: 1471,
    titulo: "Sixto IV y la red Della Rovere-Riario",
    categoria: "dinastia",
    personas: ["PAPA_SIXTO4", "PIETRORIARIO", "GIROLAMORIARIO", "PAPA_JULIO2"],
    descripcion: "Sixto IV convierte a sobrinos Della Rovere y Riario en cardenales, gobernantes y piezas de una nueva política familiar dentro de los Estados Pontificios."
  },
  {
    id: "ALEJANDRO6_1492",
    anio: 1492,
    titulo: "Alejandro VI y los Borgia",
    categoria: "dinastia",
    personas: ["RODRIGOBORJA", "CESARBORJA", "LUCRECIABORJA", "JUANBORJACATT", "GOFFREDOBORJA"],
    descripcion: "Rodrigo Borja asciende al pontificado como Alejandro VI y la carrera de sus hijos convierte a la familia Borgia en una potencia política italiana."
  },
  {
    id: "JULIO2_1503",
    anio: 1503,
    titulo: "Julio II y la restauración Della Rovere",
    categoria: "politica",
    personas: ["PAPA_JULIO2", "GIOVANNIDELLAROVERE", "FRANCESCOROVEREURBINO"],
    descripcion: "Giuliano della Rovere se convierte en Julio II y combina la recuperación territorial del papado con una red familiar vinculada a Senigallia y Urbino."
  },
  {
    id: "MEDICI_PAPAS_1513",
    anio: 1513,
    titulo: "Los Médici llegan al papado",
    categoria: "dinastia",
    personas: ["PAPA_LEON10", "LORENZOMEDICI", "PAPA_CLEMENTE7"],
    descripcion: "León X lleva la casa Médici al trono pontificio; una década después su primo Giulio de’ Medici será Clemente VII."
  },
  {
    id: "FARNESE_1534",
    anio: 1534,
    titulo: "Paulo III y la construcción de una dinastía Farnese",
    categoria: "dinastia",
    personas: ["PAPA_PAULO3", "PIERLUIGIFARNESE_DUCA", "OCTFARNESIO", "GIULIAFARNESE"],
    descripcion: "El pontificado de Paulo III combina reforma católica con una política dinástica que prepara el ascenso territorial de sus descendientes en Parma y Piacenza."
  },
  {
    id: "BORGHESE_1605",
    anio: 1605,
    titulo: "Paulo V y el ascenso de los Borghese",
    categoria: "dinastia",
    personas: ["PAPA_PAULO5", "SCIPIONEBORGHESE"],
    descripcion: "La elección de Camillo Borghese como Paulo V convierte al cardenal-nepote Scipione en uno de los grandes beneficiarios políticos, patrimoniales y artísticos de la Roma barroca."
  },
  {
    id: "BARBERINI_1623",
    anio: 1623,
    titulo: "Urbano VIII y los Barberini",
    categoria: "dinastia",
    personas: ["PAPA_URBANO8", "FRANCESCOBARBERINI", "TADDEOBARBERINI", "ANTONIOBARBERINI", "ANNACOLONNA"],
    descripcion: "Urbano VIII eleva a sus sobrinos Francesco y Antonio al cardenalato y a Taddeo a la jefatura secular de la familia, enlazada además con los Colonna."
  },
  {
    id: "PAMPHILJ_1644",
    anio: 1644,
    titulo: "Inocencio X, los Pamphilj y Donna Olimpia",
    categoria: "dinastia",
    personas: ["PAPA_INOCENCIO10", "OLIMPIAMAIDALCHINI", "CAMILLOPAMPHILJ", "OLIMPIAALDOBRANDINI"],
    descripcion: "El pontificado de Inocencio X sitúa a Olimpia Maidalchini en el centro de la corte y enlaza el patrimonio Pamphilj con la herencia Aldobrandini."
  },
  {
    id: "CHIGI_1655",
    anio: 1655,
    titulo: "Alejandro VII y los Chigi",
    categoria: "dinastia",
    personas: ["PAPA_ALEJANDRO7", "FLAVIOCHIGI_CARD"],
    descripcion: "Fabio Chigi se convierte en Alejandro VII y llama a Roma a su familia; su sobrino Flavio ocupa el lugar tradicional del cardenal-nepote."
  },
  {
    id: "ODESCALCHI_1676",
    anio: 1676,
    titulo: "Inocencio XI: un papa contra el modelo nepotista",
    categoria: "religion",
    personas: ["PAPA_INOCENCIO11", "LIVIOODESCALCHI"],
    descripcion: "Inocencio XI evita conceder a su sobrino Livio el cardenalato y limita conscientemente los privilegios familiares que habían marcado tantos pontificados anteriores."
  },
  {
    id: "ROMANUM_DECET_1692",
    anio: 1692,
    titulo: "Romanum decet Pontificem",
    categoria: "religion",
    personas: ["PAPA_INOCENCIO12"],
    descripcion: "Inocencio XII promulga la constitución Romanum decet Pontificem, que restringe formalmente el nepotismo papal y cierra una larga etapa de gobierno familiar de la corte romana."
  },
  {
    id: "MACHIAVELLI_FORLI_1499",
    timeline: "historia",
    anio: 1499,
    titulo: "Maquiavelo ante Caterina Sforza",
    categoria: "politica",
    personas: ["NICCOLOMACHIAVELLI", "CATASFOR"],
    descripcion: "La joven cancillería florentina envía a Nicolás Maquiavelo a negociar con Caterina Sforza en Forlì. La misión lo sitúa ante una gobernante cuya resistencia y caída reaparecerán después en sus reflexiones sobre fortalezas, apoyo popular y poder."
  },
  {
    id: "PRINCIPE_DEDICACION_1516",
    timeline: "historia",
    anio: 1516,
    titulo: "El príncipe llega a Lorenzo de’ Medici",
    categoria: "cultura",
    personas: ["NICCOLOMACHIAVELLI", "GIULIANOMEDICI", "LORENZO2MEDICI"],
    descripcion: "El tratado redactado por Maquiavelo tras la caída de la república florentina queda dedicado finalmente a Lorenzo de’ Medici el Joven, duque de Urbino y señor de Florencia."
  },
  {
    id: "LUBLIN_1569",
    timeline: "principal",
    anio: 1569,
    titulo: "La Unión de Lublin crea la Mancomunidad",
    categoria: "politica",
    personas: ["SEGIS2JAG", "ANAJAG"],
    descripcion: "Polonia y Lituania pasan de una unión dinástica a una comunidad política más estrecha. La nueva estructura sobrevivirá a la extinción masculina de los Jagellón y hará posible una monarquía electiva común."
  },
  {
    id: "ELECCION_1573",
    anio: 1573,
    titulo: "La primera elección libre",
    categoria: "politica",
    personas: ["ENRIQ3FRA", "ANAJAG"],
    descripcion: "Tras la muerte sin herederos de Segismundo II Augusto, la nobleza elige a Enrique de Valois y fija límites permanentes al poder real mediante los Artículos Henricianos."
  },
  {
    id: "BATHORY_1576",
    anio: 1576,
    titulo: "Ana Jagellón y Esteban Báthory comparten la corona",
    categoria: "dinastia",
    personas: ["ANAJAG", "ESTEBANBATHORY"],
    descripcion: "La elección de Esteban Báthory junto a Ana Jagellón muestra que la legitimidad dinástica sigue importando, pero ya no basta por sí sola: la corona depende de la elección de la nobleza."
  },
  {
    id: "VASA_POLONIA_1587",
    anio: 1587,
    titulo: "Un Vasa es elegido rey de Polonia",
    categoria: "dinastia",
    personas: ["SEGIS3VASA", "CATALINAJAG", "JUAN3SUECIA"],
    descripcion: "Segismundo III Vasa llega a la corona polaco-lituana como nieto de Segismundo I y príncipe sueco. La elección abre una etapa en la que la Mancomunidad se cruza directamente con las luchas dinásticas del Báltico."
  },
  {
    id: "ABDICACION_1668",
    anio: 1668,
    titulo: "Juan II Casimiro abdica",
    categoria: "politica",
    personas: ["JUAN2CASIVASA", "MIGUELKORYBUT"],
    descripcion: "Tras décadas de guerras y crisis, Juan II Casimiro abandona el trono. La nobleza puede volver a elegir desde cero y se inclina por un candidato nacido dentro de la propia Mancomunidad."
  },
  {
    id: "VIENA_1683",
    timeline: "principal",
    anio: 1683,
    titulo: "Socorro y batalla de Viena",
    categoria: "guerra",
    personas: ["JUAN3SOBIESKI", "LEOP1HRE", "CHARLES5LOR", "STARHEMBERG", "MAX2EMANBAV", "JOHANNGEORG3SAX", "KARAMUSTAFA", "MEHMED4OSM"],
    descripcion: "El ejército de socorro dirigido por Juan III Sobieski, con fuerzas polacas, habsbúrgicas y del Sacro Imperio, rompe el sitio otomano de Viena el 12 de septiembre de 1683. La victoria abre una nueva fase de la guerra en Hungría y refuerza el ascenso de la monarquía de los Habsburgo en Europa central."
  },
  {
    id: "WETTIN_POLONIA_1697",
    anio: 1697,
    titulo: "Augusto el Fuerte consigue la corona",
    categoria: "dinastia",
    personas: ["AUGUST2SAXPOL"],
    descripcion: "El elector de Sajonia se convierte al catolicismo y logra ser elegido rey. Polonia-Lituania queda unida personalmente a Sajonia y su elección vuelve a convertir la corona en una cuestión europea."
  },
  {
    id: "DOBLE_ELECCION_1733",
    anio: 1733,
    titulo: "Dos elecciones para una sola corona",
    categoria: "politica",
    personas: ["STAN1LESZ", "AUGUST3SAXPOL"],
    descripcion: "Estanislao Leszczyński y Augusto III son proclamados por facciones rivales. La disputa desemboca en una guerra europea y muestra hasta qué punto las potencias vecinas pueden condicionar la libertad electoral."
  },
  {
    id: "PONIATOWSKI_1764",
    anio: 1764,
    titulo: "El último rey de la República",
    categoria: "politica",
    personas: ["STAN2PONIAT"],
    descripcion: "Estanislao Augusto Poniatowski es elegido rey con un programa reformista, pero bajo la sombra decisiva de Rusia. La tensión entre libertad nobiliaria, reforma e intervención exterior entra en su fase final."
  },
  {
    id: "CONSTITUCION_1791",
    timeline: "principal",
    anio: 1791,
    titulo: "La Constitución del 3 de Mayo intenta cambiar el sistema",
    categoria: "politica",
    personas: ["STAN2PONIAT", "FREDAUGUST3SAX"],
    descripcion: "La nueva constitución elimina el liberum veto y sustituye la monarquía electiva por una sucesión hereditaria prevista en la casa de Sajonia. Es el intento más ambicioso de reformar la República desde dentro."
  },
  {
    id: "FIN_POLONIA_1795",
    timeline: "principal",
    anio: 1795,
    titulo: "La tercera partición termina con la Mancomunidad",
    categoria: "politica",
    personas: ["STAN2PONIAT", "FREDWIL2PRU", "CATHERINE2RUS"],
    descripcion: "La tercera partición borra del mapa político a la Mancomunidad polaco-lituana y obliga a Estanislao Augusto a abdicar. El experimento de la corona elegida concluye bajo la presión de las monarquías vecinas."
  },

  {
    id: "MUERTE_ENRIQUE2_1559",
    anio: 1559,
    titulo: "Muere Enrique II de Francia",
    categoria: "dinastia",
    personas: ["ENRIQ2FRA", "FRANC2FRA", "CATAMEDICI", "FRAN1GUISA"],
    descripcion: "La muerte accidental de Enrique II deja la corona a Francisco II. La juventud del nuevo rey eleva la influencia de los Guisa y sitúa a Catalina de Médici ante una crisis dinástica y confesional creciente."
  },
  {
    id: "REGENCIA_CATALINA_1560",
    anio: 1560,
    titulo: "Catalina de Médici dirige la monarquía",
    categoria: "politica",
    personas: ["CATAMEDICI", "CARLOS9FRA", "LUIS1CONDE", "FRAN1GUISA"],
    descripcion: "Tras la muerte de Francisco II, Carlos IX sube al trono siendo menor de edad. Catalina intenta sostener la autoridad real entre el partido católico de los Guisa y una nobleza protestante cada vez más organizada."
  },
  {
    id: "WASSY_1562",
    anio: 1562,
    titulo: "Wassy: comienza la guerra abierta",
    categoria: "guerra",
    personas: ["FRAN1GUISA", "LUIS1CONDE", "CATAMEDICI"],
    descripcion: "La matanza de protestantes en Wassy por hombres del duque de Guisa acelera el levantamiento encabezado por Luis de Condé y abre la primera de las Guerras de Religión francesas."
  },
  {
    id: "JARNAC_1569",
    anio: 1569,
    titulo: "Jarnac: muere Condé",
    categoria: "guerra",
    personas: ["LUIS1CONDE", "GASPARD2COLIGNY", "ENRIQ3FRA"],
    descripcion: "Luis de Condé muere tras la batalla de Jarnac. Gaspar de Coligny queda como el principal jefe militar hugonote mientras el duque de Anjou, futuro Enrique III, gana prestigio en el campo católico."
  },
  {
    id: "SAN_BARTOLOME_1572",
    timeline: "principal",
    anio: 1572,
    titulo: "La noche de San Bartolomé",
    categoria: "religion",
    personas: ["CATAMEDICI", "CARLOS9FRA", "GASPARD2COLIGNY", "ENRIQ4FRA", "MARGVALOIS"],
    descripcion: "Pocos días después de la boda de Margarita de Valois y Enrique de Navarra, el intento de asesinato de Coligny desemboca en la matanza de dirigentes hugonotes en París y en una nueva oleada de violencia por el reino."
  },
  {
    id: "LIGA_CATOLICA_1585",
    anio: 1585,
    titulo: "La Liga Católica desafía la sucesión",
    categoria: "politica",
    personas: ["ENRIQ3FRA", "HENRI1GUISE", "ENRIQ4FRA", "FEL2ESP", "CHARLESMAYENNE"],
    descripcion: "La muerte de Francisco de Anjou convierte a Enrique de Navarra en heredero presunto. Enrique de Guisa reorganiza la Liga Católica, respaldada desde España, para impedir que un protestante herede la corona francesa."
  },
  {
    id: "BARRICADAS_1588",
    anio: 1588,
    titulo: "París se levanta por la Liga",
    categoria: "politica",
    personas: ["ENRIQ3FRA", "HENRI1GUISE"],
    descripcion: "La Jornada de las Barricadas obliga a Enrique III a abandonar París y demuestra que la Liga y Enrique de Guisa pueden desafiar directamente al rey en su propia capital."
  },
  {
    id: "ASESINATO_GUISA_1588",
    anio: 1588,
    titulo: "Enrique III hace matar al duque de Guisa",
    categoria: "politica",
    personas: ["ENRIQ3FRA", "HENRI1GUISE", "CHARLESMAYENNE"],
    descripcion: "Temiendo perder el control de la monarquía, Enrique III ordena la muerte de Enrique de Guisa en Blois. Carlos de Mayenne recoge la jefatura militar de la Liga y la guerra entra en su fase final."
  },
  {
    id: "ASESINATO_ENRIQUE3_1589",
    anio: 1589,
    titulo: "Muere el último Valois",
    categoria: "dinastia",
    personas: ["ENRIQ3FRA", "ENRIQ4FRA", "CHARLESMAYENNE"],
    descripcion: "Enrique III es asesinado después de haberse aliado con Enrique de Navarra contra la Liga. Con su muerte se extingue la línea Valois-Angulema en el trono y Enrique de Navarra reclama la corona como Enrique IV."
  },
  {
    id: "CONVERSION_ENRIQUE4_1593",
    anio: 1593,
    titulo: "Enrique IV abraza el catolicismo",
    categoria: "religion",
    personas: ["ENRIQ4FRA", "CHARLESMAYENNE", "MARGVALOIS"],
    descripcion: "La conversión de Enrique IV elimina uno de los mayores obstáculos a su aceptación como rey. La Liga pierde progresivamente apoyos y la guerra deja de ser una simple alternativa entre un rey católico y uno protestante."
  },
  {
    id: "EDICTO_NANTES_1598",
    timeline: "principal",
    anio: 1598,
    titulo: "Edicto de Nantes",
    categoria: "religion",
    personas: ["ENRIQ4FRA"],
    descripcion: "Enrique IV promulga el Edicto de Nantes y concede a los protestantes derechos civiles y un marco limitado de culto y seguridad. La monarquía borbónica cierra la gran fase de las Guerras de Religión sin imponer una uniformidad confesional completa."
  },

  {
    id: "MUERTE_FED2_SICILIA_1250",
    timeline: "historia",
    anio: 1250,
    titulo: "Muere Federico II",
    categoria: "dinastia",
    personas: ["FED2HOH", "CONRADO4HOH", "MANFSIC"],
    descripcion: "La muerte de Federico II deja su reino de Sicilia en manos de una dinastía Hohenstaufen enfrentada al papado. Conrado IV hereda la corona, mientras Manfredo mantiene la posición familiar en Italia."
  },
  {
    id: "BENEVENTO_1266",
    anio: 1266,
    titulo: "Benevento: los Anjou toman el reino",
    categoria: "guerra",
    personas: ["MANFSIC", "CARLOS1ANJ", "PAPA_CLEMENTE4"],
    descripcion: "Carlos de Anjou, respaldado por el papado, derrota y mata a Manfredo en Benevento. La monarquía Hohenstaufen pierde el control efectivo de Sicilia y Nápoles."
  },
  {
    id: "TAGLIACOZZO_1268",
    timeline: "historia",
    anio: 1268,
    titulo: "Conradino: el último intento Hohenstaufen",
    categoria: "guerra",
    personas: ["CONRADINOHOH", "CARLOS1ANJ"],
    descripcion: "Conradino invade Italia para recuperar la herencia de su familia, pero es derrotado en Tagliacozzo y ejecutado en Nápoles. Carlos de Anjou queda como dueño del antiguo reino Hohenstaufen."
  },
  {
    id: "FEDERICO_SICILIA_1296",
    timeline: "historia",
    anio: 1296,
    titulo: "Sicilia elige a Federico",
    categoria: "dinastia",
    personas: ["FEDERICO2SIC", "PEDRO3AR", "BEATCONST", "CARLOS2NAP"],
    descripcion: "Tras años de guerra, los sicilianos sostienen a Federico, hijo de Pedro III y Constanza de Hohenstaufen. La isla desarrolla una línea política propia frente al Nápoles angevino."
  },
  {
    id: "CALTABELLOTTA_1302",
    anio: 1302,
    titulo: "Caltabellotta reconoce dos Sicilias",
    categoria: "politica",
    personas: ["FEDERICO2SIC", "CARLOS2NAP"],
    descripcion: "La paz de Caltabellotta reconoce a Federico en la isla y a los Anjou en el territorio continental. La vieja monarquía siciliana queda políticamente partida entre Trinacria y el reino que la historiografía llamará Nápoles."
  },
  {
    id: "ALFONSO_NAPOLES_1442",
    anio: 1442,
    titulo: "Alfonso V conquista Nápoles",
    categoria: "guerra",
    personas: ["ALF5ARAG", "RENATOANJOU"],
    descripcion: "Alfonso V de Aragón derrota la resistencia angevina y entra en Nápoles. Por primera vez desde las Vísperas, un mismo monarca controla Aragón, Trinacria y el reino continental, aunque las coronas conservan identidades separadas."
  },
  {
    id: "SUCESION_NAPOLES_1458",
    timeline: "historia",
    anio: 1458,
    titulo: "La herencia de Alfonso vuelve a separarse",
    categoria: "dinastia",
    personas: ["ALF5ARAG", "FERN1NAP", "JUAN2ARAG"],
    descripcion: "A la muerte de Alfonso V, Aragón y Trinacria pasan a su hermano Juan II, mientras Nápoles queda para su hijo Fernando. La unión personal no se convierte en una fusión estable de las coronas."
  },
  {
    id: "TRATADO_GRANADA_1500",
    anio: 1500,
    titulo: "Francia y Aragón se reparten Nápoles",
    categoria: "politica",
    personas: ["LUIS12FRA", "FERN2ARAG", "FED1NAP"],
    descripcion: "Luis XII y Fernando el Católico acuerdan repartirse el reino de Federico I. La cooperación dura poco: las disputas sobre los límites de la partición convierten a los antiguos aliados en enemigos."
  },
  {
    id: "CERIGNOLA_1503",
    anio: 1503,
    titulo: "Cerignola: el Gran Capitán cambia la guerra",
    categoria: "guerra",
    personas: ["GRANCAPITAN", "FERN2ARAG", "LUIS12FRA"],
    descripcion: "Las fuerzas de Gonzalo Fernández de Córdoba derrotan a los franceses en Cerignola. El empleo combinado de infantería, fortificación de campaña y armas de fuego consolida la posición aragonesa en el sur de Italia."
  },
  {
    id: "GARIGLIANO_1503",
    anio: 1503,
    titulo: "El Garigliano decide Nápoles",
    categoria: "guerra",
    personas: ["GRANCAPITAN", "FERN2ARAG", "LUIS12FRA"],
    descripcion: "Una segunda gran victoria del Gran Capitán obliga a las fuerzas francesas a retirarse. El equilibrio nacido del reparto de 1500 se rompe definitivamente a favor de Fernando."
  },
  {
    id: "NAPOLES_FERNANDO_1504",
    timeline: "historia",
    anio: 1504,
    titulo: "Fernando reúne Nápoles y Trinacria bajo su corona",
    categoria: "dinastia",
    personas: ["FERN2ARAG", "GRANCAPITAN", "LUIS12FRA"],
    descripcion: "La derrota francesa deja a Fernando el Católico como rey de Nápoles además de Trinacria. Las dos partes de la antigua monarquía siciliana vuelven a compartir soberano, aunque seguirán administrándose como reinos distintos."
  },

  {
    id: "SOLIMAN_1520",
    anio: 1520,
    titulo: "Solimán y el gran avance otomano",
    categoria: "guerra",
    personas: ["SULEIMAN1OSM"],
    descripcion: "El largo reinado de Solimán I lleva el poder otomano a una de sus mayores expansiones. El Mediterráneo oriental y Europa central quedan convertidos en frentes permanentes de competencia con las potencias cristianas."
  },
  {
    id: "SELIM2_1566",
    timeline: "historia",
    anio: 1566,
    titulo: "Selim II hereda el Imperio otomano",
    categoria: "dinastia",
    personas: ["SULEIMAN1OSM", "SELIM2OSM"],
    descripcion: "La muerte de Solimán lleva al trono a Selim II. El nuevo reinado mantiene la presión sobre los dominios venecianos y españoles del Mediterráneo."
  },
  {
    id: "CHIPRE_1570",
    anio: 1570,
    titulo: "La invasión de Chipre fuerza a Venecia a buscar aliados",
    categoria: "guerra",
    personas: ["SELIM2OSM", "SEBASTIANOVENIER", "ALIPASHALEPANTO"],
    descripcion: "La ofensiva otomana contra Chipre amenaza una de las grandes posesiones venecianas del Levante. Venecia necesita convertir su guerra particular en una coalición más amplia."
  },
  {
    id: "LIGA_SANTA_1571",
    anio: 1571,
    titulo: "Pío V consigue la Liga Santa",
    categoria: "politica",
    personas: ["PAPA_PIO5", "FEL2ESP", "DONJUANAUST", "MARCANTONIO2COL", "SEBASTIANOVENIER"],
    descripcion: "Pío V logra un acuerdo entre la Monarquía Hispánica, Venecia y los Estados Pontificios. Felipe II aporta una parte esencial de los recursos y su hermanastro don Juan de Austria recibe el mando supremo de la flota aliada."
  },
  {
    id: "MESINA_1571",
    timeline: "historia",
    anio: 1571,
    titulo: "Una flota hecha de rivales",
    categoria: "guerra",
    personas: ["DONJUANAUST", "SEBASTIANOVENIER", "MARCANTONIO2COL", "GIANANDREADORIA", "AGOSTINOBARBARIGO", "ALVAROBAZAN"],
    descripcion: "En Mesina se concentra una armada heterogénea de españoles, venecianos, pontificios, genoveses y otros contingentes italianos. Coordinar intereses distintos es casi tan importante como reunir los barcos."
  },
  {
    id: "PIOV_ROGATIVAS_1571",
    timeline: "historia",
    anio: 1571,
    titulo: "Roma reza por la expedición",
    categoria: "religion",
    personas: ["PAPA_PIO5", "DONJUANAUST"],
    descripcion: "Pío V acompaña la coalición con rogativas públicas, bendice la empresa y envía a don Juan un estandarte pontificio. La memoria católica asociará después la victoria a las oraciones y al Rosario; la tradición de que el papa conoció el triunfo antes de recibir la noticia pertenece a la tradición devocional, no a un hecho demostrable por sí solo."
  },
  {
    id: "FORMACION_LEPANTO_1571",
    timeline: "historia",
    anio: 1571,
    titulo: "Dos flotas forman sus líneas",
    categoria: "guerra",
    personas: ["DONJUANAUST", "MARCANTONIO2COL", "AGOSTINOBARBARIGO", "GIANANDREADORIA", "ALVAROBAZAN", "ALIPASHALEPANTO", "ULUCALI"],
    descripcion: "La Liga dispone a Barbarigo en el ala izquierda, a don Juan y Colonna en el centro, a Gianandrea Doria en la derecha y a Álvaro de Bazán al frente de la reserva. Frente a ellos, Alí Bajá dirige el centro otomano y Uluç Alí manda el ala que se enfrenta a Doria."
  },
  {
    id: "CENTRO_LEPANTO_1571",
    timeline: "historia",
    anio: 1571,
    titulo: "La Real contra la Sultana",
    categoria: "guerra",
    personas: ["DONJUANAUST", "ALIPASHALEPANTO", "MARCANTONIO2COL", "SEBASTIANOVENIER"],
    descripcion: "En el centro, la galera Real de don Juan y la Sultana de Alí Bajá quedan trabadas en una lucha de abordajes, arcabuces y refuerzos sucesivos. La caída de Alí Bajá y la toma de su nave desorganizan el centro otomano y convierten el combate central en el núcleo simbólico de la victoria."
  },
  {
    id: "ALAS_LEPANTO_1571",
    timeline: "historia",
    anio: 1571,
    titulo: "Las alas casi cambian el resultado",
    categoria: "guerra",
    personas: ["AGOSTINOBARBARIGO", "GIANANDREADORIA", "ALVAROBAZAN", "ULUCALI"],
    descripcion: "Barbarigo resulta mortalmente herido en el ala izquierda cristiana. En el extremo opuesto, Uluç Alí aprovecha el espacio abierto durante la maniobra de Doria y golpea varias galeras de la Liga. La reserva de Álvaro de Bazán acude a cerrar la brecha, mientras Uluç Alí consigue retirarse con parte de sus barcos."
  },
  {
    id: "CERVANTES_LEPANTO_1571",
    timeline: "historia",
    anio: 1571,
    titulo: "Cervantes combate en Lepanto",
    categoria: "guerra",
    personas: ["CERVANTES", "DONJUANAUST"],
    descripcion: "Miguel de Cervantes combate como soldado en la galera Marquesa. Resulta herido durante la jornada y pierde el uso de la mano izquierda, experiencia que recordará durante toda su vida como una de las grandes ocasiones de su tiempo."
  },
  {
    id: "RECONSTRUCCION_OTOMANA_1572",
    anio: 1572,
    titulo: "Uluç Alí reconstruye la armada otomana",
    categoria: "guerra",
    personas: ["ULUCALI", "SELIM2OSM"],
    descripcion: "Uluç Alí, uno de los pocos grandes comandantes otomanos que logra salvar su escuadra en Lepanto, es elevado al mando naval. Los arsenales imperiales reconstruyen con enorme rapidez una flota capaz de volver al Mediterráneo al año siguiente."
  },

  {
    id: "PAZ_VENECIA_1573",
    anio: 1573,
    titulo: "La victoria no devuelve Chipre",
    categoria: "politica",
    personas: ["SELIM2OSM", "SEBASTIANOVENIER"],
    descripcion: "Venecia firma la paz con el Imperio otomano y renuncia a Chipre. Lepanto ha sido una victoria naval extraordinaria, pero no una expulsión otomana del Mediterráneo: el equilibrio estratégico continúa."
  },

  {
    id: "THOKOLY_1682",
    anio: 1682,
    titulo: "La rebelión húngara abre una puerta al sultán",
    categoria: "politica",
    personas: ["IMRETHOKOLY", "LEOP1HRE", "MEHMED4OSM", "KARAMUSTAFA"],
    descripcion: "Imre Thököly encabeza una oposición húngara a los Habsburgo y busca apoyo otomano. El conflicto interno de la monarquía de Leopoldo I se mezcla con la rivalidad imperial en Europa central."
  },
  {
    id: "ALIANZA_VIENA_1683",
    anio: 1683,
    titulo: "Leopoldo y Sobieski pactan el socorro mutuo",
    categoria: "politica",
    personas: ["LEOP1HRE", "JUAN3SOBIESKI", "PAPA_INOCENCIO11"],
    descripcion: "Con mediación papal, Leopoldo I y Juan III Sobieski acuerdan una alianza defensiva. Si Viena o Cracovia son atacadas, el otro soberano deberá acudir en ayuda del aliado."
  },
  {
    id: "SITIO_VIENA_1683",
    anio: 1683,
    titulo: "Kara Mustafa cerca Viena",
    categoria: "guerra",
    personas: ["KARAMUSTAFA", "MEHMED4OSM", "LEOP1HRE", "STARHEMBERG"],
    descripcion: "El gran visir Kara Mustafa conduce el ejército otomano hasta Viena. Leopoldo abandona la capital y Ernst Rüdiger von Starhemberg organiza la defensa mientras las fortificaciones sufren semanas de asedio y trabajos de mina."
  },
  {
    id: "EJERCITO_SOCORRO_1683",
    timeline: "historia",
    anio: 1683,
    titulo: "Polacos, imperiales y príncipes alemanes se reúnen",
    categoria: "guerra",
    personas: ["JUAN3SOBIESKI", "CHARLES5LOR", "MAX2EMANBAV", "JOHANNGEORG3SAX", "LEOP1HRE"],
    descripcion: "Carlos V de Lorena coordina las fuerzas imperiales y se unen contingentes de Baviera, Sajonia y otros territorios del Imperio. Sobieski llega con el ejército polaco y asume el mando de la operación de socorro."
  },
  {
    id: "LIGA_SANTA_1684",
    anio: 1684,
    titulo: "De salvar Viena a pasar a la ofensiva",
    categoria: "politica",
    personas: ["LEOP1HRE", "JUAN3SOBIESKI", "PAPA_INOCENCIO11", "CHARLES5LOR"],
    descripcion: "Tras la victoria se forma una nueva Liga Santa. Los Habsburgo, Polonia y Venecia transforman una defensa de emergencia en una guerra prolongada contra el Imperio otomano."
  },
  {
    id: "BUDA_1686",
    anio: 1686,
    titulo: "Buda cae ante la coalición",
    categoria: "guerra",
    personas: ["LEOP1HRE", "CHARLES5LOR", "MAX2EMANBAV", "MEHMED4OSM"],
    descripcion: "La conquista de Buda muestra que Viena no fue un episodio aislado. La guerra iniciada en 1683 se convierte en una expansión habsbúrgica por Hungría y altera de forma duradera el equilibrio de Europa central."
  },
];

export const HISTORIAS = [
  {
    id: "borgona",
    titulo: "Borgoña: el reino que no fue",
    disponible: true,
    subtitulo: "De apanage francés a herencia Habsburgo",
    descripcion: "Un recorrido por cuatro generaciones Valois-Borgoña y el matrimonio que trasladó gran parte de su herencia a los Habsburgo.",
    pasos: [
      {
        anio: 1363,
        persona: "FEL2BORG",
        personas: ["FEL2BORG", "JUAN2FRA"],
        eventoId: "BORGO_1363",
        titulo: "Una nueva Borgoña Valois",
        texto: "Juan II de Francia confía el ducado de Borgoña a su hijo Felipe el Atrevido. Nace así una rama menor de los Valois que, en pocas generaciones, llegará a competir en poder con la propia monarquía francesa."
      },
      {
        anio: 1369,
        persona: "MARGFLAN",
        personas: ["FEL2BORG", "MARGFLAN"],
        eventoId: "BORGO_1369",
        titulo: "La expansión empieza con un matrimonio",
        texto: "Felipe se casa con Margarita de Flandes. La alianza matrimonial abre la vía hacia Flandes, Artois y el Franco Condado: territorios ricos y estratégicos que convierten a los duques borgoñones en mucho más que señores de Dijon."
      },
      {
        anio: 1404,
        persona: "JUAN1BORG",
        personas: ["JUAN1BORG", "FEL2BORG", "MARGFLAN"],
        titulo: "Juan Sin Miedo hereda el proyecto",
        texto: "A la muerte de Felipe el Atrevido, Juan Sin Miedo recibe un conglomerado territorial ya poderoso. Su política se entrelaza con la crisis interna francesa y con la rivalidad entre borgoñones y armagnacs."
      },
      {
        anio: 1419,
        persona: "FEL3BORG",
        personas: ["JUAN1BORG", "FEL3BORG"],
        eventoId: "MONTEREAU",
        titulo: "Montereau cambia el equilibrio",
        texto: "Juan Sin Miedo es asesinado durante una negociación en Montereau. Su hijo Felipe el Bueno hereda el ducado y se aproxima al bando inglés, convirtiendo la enemistad con los Valois franceses en uno de los ejes de la Guerra de los Cien Años."
      },
      {
        anio: 1430,
        persona: "FEL3BORG",
        personas: ["FEL3BORG", "ISABPORTBORG"],
        eventoId: "TOISON_ORO",
        titulo: "Una corte que quiere parecer una monarquía",
        texto: "Felipe el Bueno funda la Orden del Toisón de Oro. La corte borgoñona desarrolla una cultura política y ceremonial extraordinariamente ambiciosa, acorde con un estado que une territorios dispersos desde Borgoña hasta los Países Bajos."
      },
      {
        anio: 1435,
        persona: "FEL3BORG",
        personas: ["FEL3BORG", "CARLOS7FRA"],
        eventoId: "ARRAS_1435",
        titulo: "Borgoña cambia de aliado",
        texto: "El Tratado de Arras reconcilia a Felipe el Bueno con Carlos VII. Borgoña abandona la alianza inglesa y obtiene importantes concesiones, mientras la monarquía francesa recupera margen para terminar la Guerra de los Cien Años."
      },
      {
        anio: 1467,
        persona: "CAR1BORG",
        personas: ["CAR1BORG", "FEL3BORG"],
        eventoId: "BORGO_1467",
        titulo: "Carlos el Temerario y la obsesión territorial",
        texto: "Carlos el Temerario hereda uno de los estados más ricos de Europa. Su gran problema es geográfico: sus posesiones forman dos grandes bloques separados. Su política intenta unirlos y elevar su rango hasta crear, de hecho o de derecho, un reino borgoñón independiente."
      },
      {
        anio: 1477,
        persona: "CAR1BORG",
        personas: ["CAR1BORG", "MARIABORG", "LUIS11FRA"],
        eventoId: "NANCY_1477",
        titulo: "Nancy: el proyecto se rompe",
        texto: "Carlos muere en la batalla de Nancy sin heredero varón. Luis XI ocupa el ducado de Borgoña y otros territorios franceses, mientras María, hija única de Carlos, debe defender el resto de la herencia de su padre."
      },
      {
        anio: 1477,
        persona: "MARIABORG",
        personas: ["MARIABORG", "MAXIM1"],
        eventoId: "BODA_MARIA_MAX",
        titulo: "La herencia cambia de dinastía",
        texto: "María de Borgoña se casa con Maximiliano de Habsburgo. El matrimonio salva buena parte de los Países Bajos borgoñones y convierte una crisis sucesoria en el punto de partida de la gran rivalidad entre Francia y los Habsburgo."
      },
      {
        anio: 1493,
        persona: "MAXIM1",
        personas: ["MAXIM1", "FEL1CAST"],
        eventoId: "SENLIS_1493",
        titulo: "Lo que queda de Borgoña",
        texto: "El Tratado de Senlis devuelve Artois y el Franco Condado a la herencia borgoñona de los Habsburgo. El antiguo ducado de Borgoña, sin embargo, permanece en Francia. El sueño territorial de Carlos ya no puede reconstruirse en su forma original."
      },
      {
        anio: 1506,
        persona: "CARLOS5",
        personas: ["FEL1CAST", "CARLOS5"],
        titulo: "De Borgoña a Carlos V",
        texto: "Felipe el Hermoso transmite la herencia borgoñona a su hijo Carlos. Para Carlos V, los Países Bajos y la tradición cortesana borgoñona serán una parte esencial de su identidad política. El reino que Carlos el Temerario no consiguió fundar termina convertido en una de las bases del poder Habsburgo."
      }
    ]
  },
  {
    id: "emperadores",
    titulo: "Emperadores",
    subtitulo: "De los Hohenstaufen a la Europa revolucionaria",
    disponible: true,
    descripcion: "Un recorrido por la corona electiva del Sacro Imperio: del poder universal de Federico II al Interregno, la Bula de Oro, el ascenso Habsburgo y la casa Habsburgo-Lorena que llega hasta el umbral de 1800.",
    pasos: [
      {
        anio: 1220,
        persona: "FED2HOH",
        personas: ["FED2HOH", "OTTO4HRE"],
        titulo: "Federico II: un emperador que aún piensa en términos universales",
        texto: "Al comenzar nuestro periodo, el título imperial todavía conserva una ambición casi universal. Federico II gobierna Alemania, Sicilia e Italia y mantiene un conflicto permanente con el papado. Su poder parece enorme, pero depende de una red de príncipes, ciudades y derechos que ningún emperador controla por completo."
      },
      {
        anio: 1254,
        persona: "CONRADO4HOH",
        personas: ["FED2HOH", "CONRADO4HOH", "GUILLERMOHOLANDA", "RICARDOCORNUALLES", "ALF10"],
        eventoId: "INTERREGNO_IMPERIAL_1250",
        titulo: "Cuando falta una dinastía, aparece la naturaleza real del Imperio",
        texto: "La caída de los Hohenstaufen abre décadas de elecciones rivales. Guillermo de Holanda, Ricardo de Cornualles y Alfonso X de Castilla muestran que la corona no es una herencia alemana automática: los príncipes pueden buscar candidatos dentro y fuera del Imperio. El Gran Interregno hace visible la debilidad del poder central."
      },
      {
        anio: 1273,
        persona: "ROD1HAB",
        personas: ["ROD1HAB", "OTAK2"],
        eventoId: "RODOLFO_1273",
        titulo: "Rodolfo I: los Habsburgo entran en escena",
        texto: "Los electores escogen a Rodolfo de Habsburgo, un conde mucho menos amenazador que los grandes reyes vecinos. El cálculo sale regular: Rodolfo derrota a Otakar II de Bohemia y coloca Austria y Estiria en manos de su familia. Todavía no ha nacido una hegemonía, pero sí su base territorial."
      },
      {
        anio: 1312,
        persona: "ENRIQ7",
        personas: ["ENRIQ7", "LUIS4"],
        titulo: "Luxemburgos y Wittelsbach: el trono sigue abierto",
        texto: "Enrique VII de Luxemburgo logra la coronación imperial; tras su muerte, Luis IV de Baviera vuelve a demostrar que ninguna casa posee el título por derecho propio. La dignidad imperial es electiva y la rivalidad entre dinastías forma parte del sistema, no una anomalía."
      },
      {
        anio: 1356,
        persona: "CARLOS4",
        personas: ["CARLOS4", "WEN4LUX", "SEGIS1"],
        eventoId: "BULA_ORO",
        titulo: "Carlos IV convierte la elección en una constitución",
        texto: "La Bula de Oro fija quiénes son los siete grandes electores y cómo debe producirse la elección del rey de Romanos. El emperador no elimina el poder de los príncipes: lo reconoce y lo ordena. Esa decisión dará al Imperio una estructura extraordinariamente duradera."
      },
      {
        anio: 1433,
        persona: "SEGIS1",
        personas: ["SEGIS1", "ALB2HABS"],
        titulo: "Segismundo: el último gran emperador Luxemburgo",
        texto: "Segismundo combina las coronas de Hungría, Bohemia y Alemania y alcanza la dignidad imperial. Pero su sucesión pasa por su hija a Alberto II de Habsburgo. El centro dinástico del Imperio empieza a desplazarse definitivamente."
      },
      {
        anio: 1452,
        persona: "FED3HAB",
        personas: ["FED3HAB", "MAXIM1"],
        eventoId: "HABSBURGO_1452",
        titulo: "Federico III: la paciencia Habsburgo",
        texto: "Federico III no parece el emperador más espectacular de la historia, pero su reinado cambia la larga duración. Desde su coronación, la corona queda prácticamente unida a los Habsburgo. Su gran arma no será conquistar toda Europa, sino sobrevivir, heredar y casar mejor que sus rivales."
      },
      {
        anio: 1495,
        persona: "MAXIM1",
        personas: ["MAXIM1", "MARIABORG"],
        eventoId: "REFORMA_IMPERIAL_1495",
        titulo: "Maximiliano I: reformar el Imperio y multiplicar herencias",
        texto: "Maximiliano impulsa reformas institucionales mientras su matrimonio con María de Borgoña coloca los Países Bajos y la herencia borgoñona dentro de la red Habsburgo. El emperador sigue sin ser un monarca absoluto, pero su dinastía empieza a jugar en una escala continental."
      },
      {
        anio: 1519,
        persona: "CARLOS5",
        personas: ["CARLOS5", "MAXIM1", "FRED3SAX"],
        eventoId: "ELECCION_CARLOS5_1519",
        titulo: "Carlos V: la elección que parece crear una monarquía universal",
        texto: "Nieto de Maximiliano y heredero de Castilla, Aragón y Borgoña, Carlos compite por la corona imperial y vence. Nunca antes un solo príncipe de nuestro recorrido había reunido tantos territorios. Pero esa acumulación de coronas hará también imposible gobernar cada problema europeo como si fuera uno solo."
      },
      {
        anio: 1556,
        persona: "FERN1EMP",
        personas: ["CARLOS5", "FERN1EMP", "FEL2ESP"],
        eventoId: "ABDICACION_CARLOS",
        titulo: "La herencia de Carlos se divide",
        texto: "Carlos entrega los reinos españoles y borgoñones a Felipe II, mientras Fernando I recibe la rama austríaca y la continuidad imperial. Desde este momento, hablar de 'los Habsburgo' exige distinguir dos redes emparentadas: Madrid y Viena."
      },
      {
        anio: 1619,
        persona: "FERN2EMP",
        personas: ["FERN2EMP", "FED5PALBOH"],
        eventoId: "TREINTA_ANOS",
        titulo: "Fernando II intenta reforzar corona y confesión",
        texto: "La rebelión bohemia y la elección rival de Federico V del Palatinado desencadenan una guerra que pronto supera el conflicto religioso inicial. Fernando II vence en Bohemia, pero el intento de recomponer la autoridad imperial acaba atrayendo a media Europa al campo de batalla."
      },
      {
        anio: 1648,
        persona: "FERN3HRE",
        personas: ["FERN3HRE", "LEOP1HRE"],
        eventoId: "WESTFALIA",
        titulo: "Westfalia: el emperador sigue, pero el Imperio cambia",
        texto: "La Paz de Westfalia no destruye el Sacro Imperio. Lo hace más explícitamente plural: sus estados conservan amplias competencias y la política imperial depende todavía más de negociación, derecho y equilibrio entre príncipes. La casa Habsburgo sigue siendo poderosa, pero no puede convertir el Imperio en Austria."
      },
      {
        anio: 1711,
        persona: "CARLOS6HRE",
        personas: ["LEOP1HRE", "JOSE1HRE", "CARLOS6HRE"],
        titulo: "Dos hermanos y un problema: la sucesión",
        texto: "Leopoldo I deja dos hijos varones que alcanzan el trono. José I muere en 1711 sin heredero masculino y la corona pasa a Carlos VI. La misma dinastía que parecía haber resuelto la sucesión imperial descubre que su propia continuidad biológica vuelve a ser una cuestión europea."
      },
      {
        anio: 1713,
        persona: "CARLOS6HRE",
        personas: ["CARLOS6HRE", "MARIATERESAHAB"],
        eventoId: "PRAGMATICA_1713",
        titulo: "Carlos VI prepara una heredera que no puede ser emperador",
        texto: "La Pragmática Sanción intenta garantizar que una mujer pueda heredar los dominios Habsburgo. María Teresa podrá gobernar Austria, Bohemia y Hungría, pero la corona imperial sigue reservada a un varón elegido. Esa diferencia abrirá una crisis enorme en 1740."
      },
      {
        anio: 1742,
        persona: "CARLOS7HRE",
        personas: ["CARLOS7HRE", "MARIAAMALIAHAB1701", "MARIATERESAHAB"],
        eventoId: "CARLOS7_1742",
        titulo: "Carlos VII demuestra que el Imperio no es propiedad Habsburgo",
        texto: "Carlos Alberto de Baviera, casado además con una hija de José I, aprovecha la crisis sucesoria para obtener la corona imperial. Durante tres años un Wittelsbach ocupa el trono. Es la gran prueba de que la hegemonía Habsburgo es política y dinástica, nunca jurídicamente automática."
      },
      {
        anio: 1745,
        persona: "FRAN1HRE",
        personas: ["FRAN1HRE", "MARIATERESAHAB", "CARLOS7HRE"],
        eventoId: "FRANCISCO1_1745",
        titulo: "Habsburgo-Lorena: una dinastía nueva con un nombre antiguo",
        texto: "Tras la muerte de Carlos VII, Francisco Esteban de Lorena, esposo de María Teresa, es elegido emperador. La herencia Habsburgo continúa por vía femenina mientras la dignidad imperial pasa al marido: de esa combinación nace la casa Habsburgo-Lorena."
      },
      {
        anio: 1765,
        persona: "JOSE2HRE",
        personas: ["JOSE2HRE", "MARIATERESAHAB", "FRAN1HRE"],
        eventoId: "JOSE2_1765",
        titulo: "José II quiere gobernar más deprisa que el Imperio",
        texto: "José II hereda la dignidad imperial y después los dominios de su madre. Su programa reformista busca uniformidad administrativa, tolerancia religiosa y subordinación de corporaciones eclesiásticas. Sus dificultades recuerdan una constante del recorrido: incluso un emperador Habsburgo gobierna una constelación de territorios con derechos propios."
      },
      {
        anio: 1790,
        persona: "LEOP2HRE",
        personas: ["JOSE2HRE", "LEOP2HRE", "MARIAANTONIETA"],
        eventoId: "REVOLUCION_FRANCESA_1789",
        titulo: "Leopoldo II hereda un Imperio frente a la Revolución",
        texto: "Leopoldo sucede a su hermano justo cuando la Revolución francesa amenaza el orden dinástico europeo y su hermana María Antonieta se encuentra atrapada en París. El problema imperial ya no es únicamente equilibrar príncipes alemanes: es responder a una nueva idea de soberanía."
      },
      {
        anio: 1792,
        persona: "FRAN2HRE",
        personas: ["FRAN2HRE", "LEOP2HRE", "MARIAANTONIETA"],
        eventoId: "FRANCISCO2_1792",
        titulo: "Francisco II: llegamos a 1800 con el viejo Imperio aún en pie",
        texto: "Francisco II asciende al trono en 1792 y entra inmediatamente en la era de las guerras revolucionarias. Nuestro recorrido se detiene en 1800: el Sacro Imperio todavía existe, pero las fuerzas que acabarán con él ya están actuando. Seis siglos después de Federico II, el título imperial sigue siendo reconocible y, al mismo tiempo, significa algo completamente distinto."
      }
    ]
  },
  {
    id: "habsburgo-capetos",
    titulo: "Habsburgo y Capetos",
    subtitulo: "Dos redes dinásticas que moldearon Europa",
    disponible: false
  },
  {
    id: "iberia",
    titulo: "España y Portugal",
    subtitulo: "Castilla, Aragón, Portugal y sus uniones",
    disponible: false
  },
  {
    id: "papales",
    titulo: "Las familias papales",
    subtitulo: "Orsini, Colonna, Borgia, Della Rovere, Médici y la Roma de los cardenales-nepotes",
    disponible: true,
    descripcion: "Un recorrido por las familias que convirtieron el pontificado en una palanca de poder político, territorial y social: de los barones romanos medievales a la gran aristocracia del Barroco, hasta el intento de poner fin al nepotismo institucional.",
    pasos: [
      {
        anio: 1277,
        persona: "PAPA_NICOLAS3",
        personas: ["PAPA_NICOLAS3", "MATTEOROSSOORS_GRANDE", "MATTEOROSSOCARD"],
        eventoId: "PAPA_ORSINI_1277",
        titulo: "Nicolás III: gobernar Roma con una familia detrás",
        texto: "Giovanni Gaetano Orsini llega al papado desde una de las grandes casas baroniales de Roma. Su familia ya tiene senadores, castillos y cardenales. Como pontífice refuerza esa red: el problema del nepotismo medieval no es solo “dar cargos a los tuyos”, sino que un papa electivo, sin una dinastía propia que herede el poder, necesita apoyarse en parientes capaces de mantener una política después del próximo cónclave."
      },
      {
        anio: 1297,
        persona: "PAPA_BONIFACIO8",
        personas: ["PAPA_BONIFACIO8", "PIETROCOLONNACARD", "SCIARRACOLONNA"],
        eventoId: "CAETANI_COLONNA_1297",
        titulo: "Caetani contra Colonna: cuando una pelea familiar se convierte en guerra papal",
        texto: "Bonifacio VIII utiliza el pontificado para consolidar a los Caetani; los Colonna, una de las familias rivales de Roma, se resisten. Dos cardenales Colonna pierden la púrpura y los feudos familiares son atacados. La rivalidad alcanza su imagen más dramática en 1303, cuando Sciarra Colonna participa en la acción de Anagni contra el propio papa. Roma no es todavía una corte separada de sus clanes: el papado gobierna dentro de ellos."
      },
      {
        anio: 1417,
        persona: "PAPA_MARTIN5",
        personas: ["PAPA_MARTIN5", "AGAPITOCOLONNA", "CATERINACONTI"],
        eventoId: "MARTIN5_1417",
        titulo: "Martín V Colonna: una familia romana cierra el Cisma",
        texto: "Después de décadas con obediencias rivales, el Concilio de Constanza elige a Oddone Colonna. Martín V consigue algo mucho mayor que una victoria familiar: restaura una autoridad pontificia reconocida en Occidente y devuelve progresivamente el centro de gobierno a Roma. Pero su apellido importa: los Colonna regresan de la persecución de Bonifacio VIII al punto más alto de la Iglesia."
      },
      {
        anio: 1458,
        persona: "PAPA_PIO2",
        personas: ["PAPA_PIO2", "PAPA_PIO3", "LAUDOMIAPICCOLOMINI"],
        titulo: "Piccolomini: el apellido que también se hereda en la Curia",
        texto: "Enea Silvio Piccolomini, humanista y diplomático, se convierte en Pío II. Su sobrino Francesco Todeschini adopta el apellido Piccolomini, es promovido dentro de la Iglesia y terminará siendo Pío III. Su pontificado será brevísimo, pero la secuencia muestra una constante: una elección papal puede transformar el capital social de una familia durante generaciones."
      },
      {
        anio: 1455,
        persona: "ALFONSOBORJA",
        personas: ["ALFONSOBORJA", "RODRIGOBORJA", "ISABBORJA"],
        titulo: "Calixto III abre la puerta de Roma a los Borja",
        texto: "Alfonso de Borja llega a Roma desde la Corona de Aragón y, ya como Calixto III, eleva a dos sobrinos al cardenalato. Uno de ellos es Rodrigo Borja. El primer papa Borja no crea todavía el espectáculo político asociado después al apellido, pero instala la red que hará posible el segundo."
      },
      {
        anio: 1471,
        persona: "PAPA_SIXTO4",
        personas: ["PAPA_SIXTO4", "PIETRORIARIO", "GIROLAMORIARIO", "PAPA_JULIO2"],
        eventoId: "SIXTO4_1471",
        titulo: "Sixto IV: cardenales, señoríos y una generación entera de sobrinos",
        texto: "Francesco della Rovere convierte a sus sobrinos en instrumentos de gobierno. Pietro Riario y Giuliano della Rovere reciben la púrpura; Girolamo Riario entra en la política territorial de Romaña. El mismo pontificado que transforma la Roma renacentista demuestra hasta qué punto el parentesco puede funcionar como una auténtica administración paralela."
      },
      {
        anio: 1492,
        persona: "RODRIGOBORJA",
        personas: ["RODRIGOBORJA", "CESARBORJA", "LUCRECIABORJA", "JUANBORJACATT", "GOFFREDOBORJA", "GIULIAFARNESE"],
        eventoId: "ALEJANDRO6_1492",
        titulo: "Alejandro VI: la familia ya no está detrás del papa, está en el escenario",
        texto: "Rodrigo Borja se convierte en Alejandro VI y sus hijos dejan de ser un secreto periférico. César pasa del cardenalato a la guerra y al proyecto territorial; Lucrecia es una pieza matrimonial de primer orden; Juan recibe Gandía; Jofré enlaza con Nápoles. La relación de Alejandro con Giulia Farnese, hermana del futuro Paulo III, conecta además dos de las grandes casas papales del Renacimiento."
      },
      {
        anio: 1503,
        persona: "PAPA_JULIO2",
        personas: ["PAPA_JULIO2", "GIOVANNIDELLAROVERE", "GIOVANNAMONTEFELTRO", "FRANCESCOROVEREURBINO"],
        eventoId: "JULIO2_1503",
        titulo: "Julio II: el sobrino de Sixto IV vuelve convertido en “papa guerrero”",
        texto: "Giuliano della Rovere había aprendido la política de Roma dentro de la red de Sixto IV. Como Julio II utiliza la guerra, la diplomacia y el mecenazgo para reforzar los Estados Pontificios. Su familia se enlaza con los Montefeltro y hereda Urbino a través de Giovanni della Rovere y Giovanna da Montefeltro: la frontera entre familia papal y dinastía territorial vuelve a hacerse muy fina."
      },
      {
        anio: 1513,
        persona: "PAPA_LEON10",
        personas: ["PAPA_LEON10", "LORENZOMEDICI", "CLARICEORSINI", "PAPA_CLEMENTE7", "GIULIANOMEDICI1453"],
        eventoId: "MEDICI_PAPAS_1513",
        titulo: "León X y Clemente VII: dos papas dentro de la misma familia Médici",
        texto: "León X es hijo de Lorenzo el Magnífico y Clarice Orsini. Su primo Giulio, hijo de Giuliano de’ Medici, llegará después como Clemente VII. La casa que domina Florencia ocupa también el papado y utiliza ambos espacios de poder de forma inseparable. Aquí ya no hablamos de una familia que prospera gracias a Roma: hablamos de una potencia italiana que incorpora Roma a su propia estrategia."
      },
      {
        anio: 1527,
        persona: "PAPA_CLEMENTE7",
        personas: ["PAPA_CLEMENTE7", "CARLOS5"],
        eventoId: "SACO_ROMA_1527",
        titulo: "1527: una familia poderosa no puede proteger a Roma de Europa",
        texto: "Clemente VII intenta maniobrar entre Francia y Carlos V y termina atrapado en una catástrofe: el Saco de Roma. La escena marca un límite brutal al poder dinástico de los Médici. El papa puede ser miembro de una de las familias más sofisticadas de Italia y, aun así, quedar a merced de ejércitos que ya operan a escala continental."
      },
      {
        anio: 1534,
        persona: "PAPA_PAULO3",
        personas: ["PAPA_PAULO3", "GIULIAFARNESE", "PIERLUIGIFARNESE_DUCA", "OCTFARNESIO", "MARGPARMA"],
        eventoId: "FARNESE_1534",
        titulo: "Paulo III: del parentesco Borgia al ducado de Parma",
        texto: "Alessandro Farnese asciende como Paulo III después de una carrera favorecida, entre otras cosas, por el ascenso de su hermana Giulia en la Roma de Alejandro VI. Ya papa, legitima y promociona a sus descendientes. Su hijo Pier Luigi recibe Parma y Piacenza; su nieto Ottavio se casa con Margarita de Austria, hija de Carlos V. En una generación, una familia papal se convierte en una dinastía europea."
      },
      {
        anio: 1592,
        persona: "PAPA_CLEMENTE8",
        personas: ["PAPA_CLEMENTE8", "PIETROALDOBRANDINI_CARD"],
        titulo: "Clemente VIII: el cardenal-nepote como oficina de gobierno",
        texto: "Con los Aldobrandini el nepotismo se vuelve cada vez más institucional. Pietro Aldobrandini, sobrino del papa, acumula misiones, rentas y responsabilidades diplomáticas. El “cardenal-nepote” ya no es una excentricidad: es una pieza reconocible del funcionamiento de la corte romana."
      },
      {
        anio: 1605,
        persona: "PAPA_PAULO5",
        personas: ["PAPA_PAULO5", "SCIPIONEBORGHESE", "ORTENSIABORGHESE"],
        eventoId: "BORGHESE_1605",
        titulo: "Paulo V y Scipione: poder, riqueza y una colección que sobrevivirá al pontificado",
        texto: "Paulo V eleva rápidamente a su sobrino Scipione Caffarelli, que adopta el apellido Borghese. Scipione concentra cargos y patrimonio, pero también utiliza esa fortuna para construir una de las grandes colecciones artísticas de Roma. El favor papal se convierte en capital político, inmobiliario y cultural duradero."
      },
      {
        anio: 1623,
        persona: "PAPA_URBANO8",
        personas: ["PAPA_URBANO8", "CARLOBARBERINI", "FRANCESCOBARBERINI", "TADDEOBARBERINI", "ANTONIOBARBERINI", "ANNACOLONNA"],
        eventoId: "BARBERINI_1623",
        titulo: "Urbano VIII: los Barberini ocupan todas las casillas",
        texto: "Urbano VIII promociona a su hermano Carlo y a los tres hijos de este. Francesco y Antonio son cardenales; Taddeo concentra las funciones seculares y se casa con Anna Colonna. La boda enlaza dos casas que siglos antes competían por las calles de Roma. En el Barroco, el parentesco papal ya produce príncipes, palacios, ejércitos y alianzas aristocráticas."
      },
      {
        anio: 1644,
        persona: "PAPA_INOCENCIO10",
        personas: ["PAPA_INOCENCIO10", "OLIMPIAMAIDALCHINI", "PAMPHILIOPAMPHILJ", "CAMILLOPAMPHILJ", "OLIMPIAALDOBRANDINI"],
        eventoId: "PAMPHILJ_1644",
        titulo: "Inocencio X: Donna Olimpia y la fusión Pamphilj-Aldobrandini",
        texto: "Olimpia Maidalchini, cuñada de Inocencio X, ejerce una influencia extraordinaria en la corte. Su hijo Camillo es creado cardenal-nepote, pero abandona la púrpura para casarse con Olimpia Aldobrandini. La unión traslada a los Pamphilj una enorme herencia y demuestra otra vez que los patrimonios de familias papales pueden sobrevivir y mezclarse mucho después de la muerte del pontífice."
      },
      {
        anio: 1655,
        persona: "PAPA_ALEJANDRO7",
        personas: ["PAPA_ALEJANDRO7", "MARIOCHIGI", "FLAVIOCHIGI_CARD"],
        eventoId: "CHIGI_1655",
        titulo: "Alejandro VII: los Chigi llegan a Roma",
        texto: "Fabio Chigi había construido una carrera diplomática antes de ser papa. Tras la elección llama a Roma a su hermano Mario y a sus sobrinos. Flavio Chigi se convierte en cardenal-nepote. La familia, hasta entonces esencialmente sienesa, se instala entre la gran aristocracia romana y conserva esa posición después del pontificado."
      },
      {
        anio: 1676,
        persona: "PAPA_INOCENCIO11",
        personas: ["PAPA_INOCENCIO11", "CARLOODESCALCHI", "LIVIOODESCALCHI"],
        eventoId: "ODESCALCHI_1676",
        titulo: "Inocencio XI: ¿qué pasa si el papa decide no fabricar un cardenal-nepote?",
        texto: "Benedetto Odescalchi representa un giro. Cede a su sobrino Livio el patrimonio privado de la familia, pero se niega a darle el cardenalato y limita los favores curiales. El apellido Odescalchi prospera, pero el papa intenta separar de forma más clara la fortuna familiar de los recursos institucionales de la Iglesia."
      },
      {
        anio: 1692,
        persona: "PAPA_INOCENCIO12",
        personas: ["PAPA_INOCENCIO12", "PAPA_INOCENCIO11", "PAPA_URBANO8", "PAPA_INOCENCIO10"],
        eventoId: "ROMANUM_DECET_1692",
        titulo: "Inocencio XII: el sistema intenta cerrarse sobre sí mismo",
        texto: "La constitución Romanum decet Pontificem restringe formalmente el nepotismo papal y limita el viejo modelo del cardenal-nepote. No borra siglos de familias creadas por el papado —Orsini, Colonna, Della Rovere, Farnese, Borghese, Barberini, Pamphilj, Chigi—, pero marca el final simbólico de una época en la que una elección podía reconstruir de golpe la fortuna política de todo un linaje."
      }
    ]
  },
  {
    id: "condotieros",
    titulo: "Los condotieros",
    subtitulo: "De las compañías de ventura al ducado de Milán",
    disponible: true,
    descripcion: "Un recorrido por los capitanes de fortuna que convirtieron la guerra en una profesión, negociaron con repúblicas y príncipes y, en el caso de los Sforza, transformaron el mando militar en poder dinástico.",
    pasos: [
      {
        anio: 1363,
        persona: "HAWKWOOD",
        personas: ["HAWKWOOD"],
        eventoId: "COMPANIA_BLANCA_1363",
        titulo: "La guerra se convierte en un mercado",
        texto: "Tras las grandes campañas de la Guerra de los Cien Años, compañías de veteranos cruzan los Alpes y venden su experiencia a ciudades y príncipes italianos. John Hawkwood, conocido en Italia como Giovanni Acuto, se convierte en uno de los capitanes extranjeros más célebres y en un modelo de condotiero político además de militar."
      },
      {
        anio: 1379,
        persona: "ALBERICOBARB",
        personas: ["ALBERICOBARB", "HAWKWOOD"],
        eventoId: "BARBIANO_1379",
        titulo: "Los italianos aprenden el oficio",
        texto: "Alberico da Barbiano representa una nueva generación de capitanes italianos. La condotta ya no es solo la contratación de una compañía extranjera: empieza a surgir un sistema de escuelas militares, clientelas y lealtades personales alrededor de grandes jefes de armas."
      },
      {
        anio: 1416,
        persona: "BRACCIOMONT",
        personas: ["BRACCIOMONT", "MUZIOSFOR"],
        titulo: "Bracceschi contra Sforzeschi",
        texto: "Braccio da Montone y Muzio Attendolo Sforza encarnan dos redes rivales de capitanes. Sus hombres no son simples soldados: aprenden tácticas, heredan contactos y forman auténticas genealogías profesionales que seguirán enfrentándose bajo sus discípulos."
      },
      {
        anio: 1424,
        persona: "BRACCIOMONT",
        personas: ["BRACCIOMONT", "MUZIOSFOR", "FRAN1SFOR", "NICCPICC"],
        eventoId: "LAQUILA_1424",
        titulo: "1424: cambia una generación",
        texto: "Muzio Attendolo muere ahogado durante la campaña y Braccio cae en la guerra de L'Aquila. El relevo pasa a hombres como Francesco Sforza y Niccolò Piccinino. El sistema sobrevive a sus fundadores porque sus compañías, discípulos y alianzas ya forman parte estable de la política italiana."
      },
      {
        anio: 1432,
        persona: "CARMAGNOLA",
        personas: ["CARMAGNOLA", "FELMARVISC"],
        eventoId: "CARMAGNOLA_1432",
        titulo: "El empleador también teme a su general",
        texto: "Carmagnola sirve primero a Milán y después a Venecia. Su carrera muestra la gran contradicción de la condotta: un capitán debía ser lo bastante poderoso para ganar guerras, pero cuanto más poderoso era, más peligroso resultaba para quien lo contrataba. Venecia acabó acusándolo de traición y lo ejecutó."
      },
      {
        anio: 1438,
        persona: "NICCPICC",
        personas: ["NICCPICC", "FRAN1SFOR"],
        titulo: "Piccinino y Sforza: la guerra como carrera",
        texto: "Niccolò Piccinino, heredero militar de Braccio, y Francesco Sforza compiten al servicio de potencias que cambian de aliados con rapidez. La guerra lombarda convierte sus reputaciones, tropas y contratos en recursos políticos tan importantes como un título nobiliario."
      },
      {
        anio: 1441,
        persona: "FRAN1SFOR",
        personas: ["FRAN1SFOR", "BLANMARVISC", "FELMARVISC"],
        eventoId: "BODA_SFORZA_VISCONTI_1441",
        titulo: "Una boda vale más que una victoria",
        texto: "Francesco Sforza se casa con Bianca Maria Visconti, hija de Filippo Maria. De pronto el capitán de fortuna posee algo que los contratos militares no podían darle por sí solos: una vía dinástica hacia Milán."
      },
      {
        anio: 1450,
        persona: "FRAN1SFOR",
        personas: ["FRAN1SFOR", "BLANMARVISC"],
        eventoId: "SFORZA_DUQUE_1450",
        titulo: "El condotiero que se convierte en príncipe",
        texto: "En 1450 Francesco Sforza entra en Milán como duque. Es el triunfo máximo de la lógica condotiera: fuerza militar, negociación y matrimonio se combinan para fundar una dinastía que gobernará una de las principales potencias italianas."
      },
      {
        anio: 1454,
        persona: "FRAN1SFOR",
        personas: ["FRAN1SFOR", "BARTCOLLEONI", "GATTAMELATA"],
        eventoId: "LODI_1454",
        titulo: "El éxito de Sforza cambia las reglas",
        texto: "La Paz de Lodi estabiliza el equilibrio entre los grandes estados italianos. Paradójicamente, el triunfo de Sforza sirve de advertencia: repúblicas y príncipes tienen ahora más razones para impedir que otro general mercenario acumule suficiente poder como para convertirse en soberano."
      },
      {
        anio: 1474,
        persona: "FEDMONTE",
        personas: ["FEDMONTE", "SIGISMALAT", "BATTISTASFORZA"],
        titulo: "El condotiero renacentista",
        texto: "Federico da Montefeltro combina la profesión militar con el gobierno de Urbino y un mecenazgo cultural extraordinario. Su rivalidad con Sigismondo Pandolfo Malatesta recuerda que el condotiero podía ser simultáneamente general, príncipe, diplomático y constructor de una imagen pública cuidadosamente elaborada."
      },
      {
        anio: 1502,
        persona: "CESARBORJA",
        personas: ["CESARBORJA", "VITELLOZZO"],
        eventoId: "SENIGALLIA_1502",
        titulo: "Senigallia: el príncipe contra sus capitanes",
        texto: "Vitellozzo Vitelli y otros condotieros temen que César Borja los absorba uno a uno y se rebelan. Borja aparenta reconciliarse con ellos, los atrae a Senigallia y elimina a sus dirigentes. El episodio muestra hasta qué punto el estado territorial busca ya domesticar o destruir la autonomía de los capitanes."
      },
      {
        anio: 1509,
        persona: "BARTALVIANO",
        personas: ["BARTALVIANO", "TRIVULZIO"],
        eventoId: "AGNADELLO_1509",
        titulo: "Las Guerras Italianas cambian la escala",
        texto: "En Agnadello, Bartolomeo d'Alviano combate al servicio de Venecia frente a un ejército francés en el que también actúan capitanes italianos como Gian Giacomo Trivulzio. Desde 1494 la península es escenario de monarquías extranjeras, grandes contingentes de infantería y artillería: el viejo mercado militar italiano ya no domina por sí solo la guerra."
      },
      {
        anio: 1526,
        persona: "GIOVBANDENERE",
        personas: ["GIOVBANDENERE", "CATASFOR", "GIOVPOPOLANO"],
        eventoId: "BANDENERE_1526",
        titulo: "Giovanni dalle Bande Nere: un final simbólico",
        texto: "Giovanni de' Medici, hijo de Caterina Sforza y Giovanni il Popolano, conserva el prestigio personal del gran capitán de ventura. Muere en 1526 después de ser herido por artillería. Su figura sirve como cierre simbólico de una época en la que el nombre de un capitán podía pesar casi tanto como el del estado que lo contrataba."
      },
      {
        anio: 1535,
        persona: "FERRANTEGONZAGA",
        personas: ["FERRANTEGONZAGA", "FRAN2GONZAGA", "GIOVBANDENERE"],
        titulo: "Del capitán de ventura al servidor de una monarquía",
        texto: "Ferrante Gonzaga pertenece todavía al mundo de los grandes comandantes italianos, pero su carrera dentro de la estructura imperial de Carlos V señala otra dirección: el prestigio militar continúa, aunque cada vez más integrado en estados dinásticos, gobernaciones y ejércitos permanentes. El condotiero clásico deja paso al general de una potencia europea."
      }
    ]
  },
  {
    id: "cien-anos",
    titulo: "La Guerra de los Cien Años",
    subtitulo: "Una disputa dinástica que transformó Francia e Inglaterra",
    disponible: true,
    descripcion: "Un recorrido desde la crisis sucesoria de 1328 hasta Castillon en 1453: reclamaciones de sangre, grandes victorias inglesas, recuperación francesa, guerra civil, Borgoña y el giro de Juana de Arco.",
    pasos: [
      {
        anio: 1328,
        persona: "FEL6FRA",
        personas: ["CARLOS4FRA", "FEL6FRA", "ISABFRAING", "EDUARDO3ING"],
        eventoId: "CRISIS_CAPETA_1328",
        titulo: "1328: una corona sin heredero varón",
        texto: "Carlos IV muere sin un hijo varón superviviente y se extingue la línea directa de los Capetos. La corona pasa a Felipe de Valois, Felipe VI. Pero Eduardo III de Inglaterra es nieto de Felipe IV a través de su madre, Isabel de Francia. La guerra todavía no ha comenzado: primero nace una pregunta genealógica sobre quién puede transmitir un derecho a la corona."
      },
      {
        anio: 1337,
        persona: "EDUARDO3ING",
        personas: ["EDUARDO3ING", "FEL6FRA"],
        eventoId: "CIEN_ANOS",
        titulo: "1337: la disputa dinástica se convierte en guerra",
        texto: "Aquitania, los homenajes feudales y la política entre Francia, Inglaterra y Escocia convierten la rivalidad sucesoria en un conflicto abierto. Eduardo III eleva su reclamación a la corona francesa y el choque deja de ser una discusión de parentesco: dos monarquías movilizan recursos durante generaciones."
      },
      {
        anio: 1346,
        persona: "EDUNEGRO",
        personas: ["EDUARDO3ING", "EDUNEGRO", "FEL6FRA"],
        eventoId: "CRECY_1346",
        titulo: "Crécy: el gran golpe inglés",
        texto: "Eduardo III y su hijo Eduardo de Woodstock, el Príncipe Negro, obtienen en Crécy una victoria que altera el prestigio militar de ambos reinos. Calais caerá poco después y se convertirá en una cabeza de puente inglesa duradera en el continente."
      },
      {
        anio: 1356,
        persona: "JUAN2FRA",
        personas: ["JUAN2FRA", "EDUNEGRO", "JUANCHANDOS"],
        eventoId: "POITIERS_1356",
        titulo: "Poitiers: un rey de Francia prisionero",
        texto: "El Príncipe Negro y John Chandos derrotan al ejército de Juan II. El propio rey francés es capturado. La derrota es militar, pero también dinástica y fiscal: el reino debe gobernar mientras su monarca está en manos inglesas y negociar un rescate gigantesco."
      },
      {
        anio: 1360,
        persona: "EDUARDO3ING",
        personas: ["EDUARDO3ING", "EDUNEGRO", "JUAN2FRA"],
        eventoId: "BRETIGNY_1360",
        titulo: "Brétigny: Inglaterra parece haber ganado",
        texto: "El tratado concede a Eduardo III una posición territorial extraordinaria en Francia. Pero no será un final. La guerra demuestra aquí una de sus claves: ningún acuerdo consigue resolver a la vez la soberanía territorial, la relación feudal y la reclamación dinástica."
      },
      {
        anio: 1370,
        persona: "CARLOS5FRA",
        personas: ["CARLOS5FRA", "BERTRANDGUESCLIN", "EDUNEGRO"],
        eventoId: "RECONQUISTA_CARLOS5_1369",
        titulo: "Carlos V cambia la guerra",
        texto: "Carlos V de Francia y su condestable Bertrand du Guesclin evitan repetir las grandes batallas que habían favorecido a los ingleses. Con campañas más pacientes, asedios y desgaste recuperan gran parte de las pérdidas francesas. Cuando Carlos V muere en 1380, el mapa se parece muy poco al de 1360."
      },
      {
        anio: 1407,
        persona: "CARLOS6FRA",
        personas: ["CARLOS6FRA", "JUAN1BORG", "LUISORLEANS", "FEL3BORG"],
        titulo: "Francia se rompe por dentro",
        texto: "La enfermedad de Carlos VI abre una lucha por controlar el gobierno. Borgoñones y Armagnacs convierten la corte francesa en una guerra civil. El asesinato de Luis de Orleans en 1407 y, más tarde, el de Juan Sin Miedo en 1419 harán posible algo decisivo: que el rey de Inglaterra vuelva a intervenir en una Francia dividida."
      },
      {
        anio: 1415,
        persona: "ENRIQ5ING",
        personas: ["ENRIQ5ING", "CHARLESDALBRET", "BOUCICAUT", "CARLOS6FRA"],
        eventoId: "AGINCOURT",
        titulo: "Agincourt: Enrique V vuelve a poner Francia contra las cuerdas",
        texto: "Enrique V invade Francia y obtiene en Agincourt una de las victorias más famosas de la guerra. Entre los mandos franceses están el condestable Carlos d'Albret y el mariscal Boucicaut. La derrota llega cuando la monarquía francesa sigue desgarrada por su conflicto interno."
      },
      {
        anio: 1419,
        persona: "FEL3BORG",
        personas: ["JUAN1BORG", "FEL3BORG", "CARLOS7FRA", "ENRIQ5ING"],
        eventoId: "MONTEREAU",
        titulo: "Montereau: Borgoña se inclina hacia Inglaterra",
        texto: "Juan Sin Miedo es asesinado durante una entrevista con el entorno del delfín Carlos. Su hijo Felipe el Bueno hereda Borgoña y se acerca a Enrique V. La Guerra de los Cien Años deja de ser comprensible si se mira solo como Inglaterra contra Francia: la alianza borgoñona es ahora una pieza central."
      },
      {
        anio: 1420,
        persona: "ENRIQ5ING",
        personas: ["ENRIQ5ING", "CATALINAVAL", "CARLOS6FRA", "CARLOS7FRA", "FEL3BORG"],
        eventoId: "TROYES",
        titulo: "Troyes: un Plantagenet heredará Francia",
        texto: "El Tratado de Troyes reconoce a Enrique V como heredero de Carlos VI y sella su matrimonio con Catalina de Valois. El delfín Carlos queda desplazado. Durante un instante parece posible una unión dinástica de Inglaterra y Francia bajo los descendientes de Enrique."
      },
      {
        anio: 1422,
        persona: "ENRIQ6ING",
        personas: ["ENRIQ6ING", "JUANBEDFORD", "CARLOS7FRA", "FEL3BORG"],
        titulo: "1422: dos reyes para una Francia dividida",
        texto: "Enrique V y Carlos VI mueren con pocas semanas de diferencia. El bebé Enrique VI es proclamado rey en el sistema anglo-francés y su tío Bedford gobierna como regente en Francia. Al sur del Loira, el delfín se mantiene como Carlos VII. La disputa sucesoria de 1328 ha producido ahora dos legitimidades rivales."
      },
      {
        anio: 1429,
        persona: "JUANAARCO",
        personas: ["JUANAARCO", "CARLOS7FRA", "JEANDUNOIS", "LAHIRE", "JUANBEDFORD"],
        eventoId: "ORLEANS",
        titulo: "Orleans: aparece Juana de Arco",
        texto: "Con Orleans sitiada, Juana de Arco llega al campo de Carlos VII. Junto a comandantes como Jean de Dunois y La Hire participa en el levantamiento del sitio y en una rápida campaña por el Loira. El efecto político es tan importante como el militar: la iniciativa cambia de manos."
      },
      {
        anio: 1429,
        persona: "CARLOS7FRA",
        personas: ["CARLOS7FRA", "JUANAARCO"],
        eventoId: "REIMS_1429",
        titulo: "Reims: la guerra vuelve a ser una cuestión de legitimidad",
        texto: "Juana insiste en conducir a Carlos VII a Reims, el lugar tradicional de coronación de los reyes franceses. La ceremonia convierte al antiguo 'delfín de Bourges' en un rey ungido y visible. La guerra no está ganada, pero la legitimidad de Carlos deja de parecer provisional."
      },
      {
        anio: 1431,
        persona: "JUANAARCO",
        personas: ["JUANAARCO", "FEL3BORG", "JUANBEDFORD", "CARLOS7FRA"],
        eventoId: "CAPTURA_JUANA_1430",
        titulo: "La muerte de Juana no detiene el cambio",
        texto: "Juana es capturada por los borgoñones en 1430, entregada a los ingleses y ejecutada en Rouen en 1431. Su muerte no revierte el giro político que ayudó a acelerar. Carlos VII dispone ahora de una legitimidad reforzada y de una monarquía que empieza a reconstruir sus recursos."
      },
      {
        anio: 1435,
        persona: "FEL3BORG",
        personas: ["FEL3BORG", "CARLOS7FRA", "JUANBEDFORD"],
        eventoId: "ARRAS_1435",
        titulo: "Arras: Inglaterra pierde a Borgoña",
        texto: "Felipe el Bueno se reconcilia con Carlos VII. La ruptura de la alianza anglo-borgoñona es un golpe estratégico enorme para Inglaterra. Poco después muere Bedford, el hombre que había sostenido con más eficacia el régimen inglés en Francia."
      },
      {
        anio: 1450,
        persona: "ARTURO3BRET",
        personas: ["CARLOS7FRA", "ARTURO3BRET", "JEANBUREAU"],
        eventoId: "FORMIGNY_1450",
        titulo: "Una monarquía francesa distinta recupera Normandía",
        texto: "Francia ya no depende únicamente de la nobleza convocada para una campaña. Reformas fiscales, compañías permanentes y una artillería cada vez más importante permiten a Carlos VII sostener la guerra de otra manera. Formigny acelera la recuperación de Normandía."
      },
      {
        anio: 1453,
        persona: "JUANTALBOT",
        personas: ["JUANTALBOT", "JEANBUREAU", "CARLOS7FRA", "ENRIQ6ING"],
        eventoId: "CASTILLON_1453",
        titulo: "Castillon: el final convencional de 116 años de guerra",
        texto: "John Talbot intenta recuperar la situación inglesa en Guyena y muere en Castillon frente a un ejército francés apoyado por una poderosa artillería organizada por los hermanos Bureau. Inglaterra conserva Calais, pero pierde casi todas sus posesiones francesas. La guerra que empezó por feudos y derechos dinásticos termina dejando una monarquía francesa mucho más fuerte y una Inglaterra que pronto se hundirá en la Guerra de las Dos Rosas."
      }
    ]
  },
  {
    id: "dos-rosas",
    titulo: "La Guerra de las Dos Rosas",
    subtitulo: "Lancaster, York y el ascenso Tudor",
    disponible: false
  },
  {
    id: "gioconda",
    titulo: "En busca de la Gioconda",
    subtitulo: "Un viaje por la vida de Leonardo y las mujeres detrás del enigma",
    disponible: true,
    descripcion: "Seguimos a Leonardo desde la corte de los Sforza hasta Francia. En el camino aparecen retratos femeninos seguros, mujeres que realmente conoció y varias identidades propuestas para la Gioconda, hasta llegar a la identificación aceptada por el Louvre.",
    pasos: [
      {
        anio: 1482,
        persona: "LEONARDODAVINCI",
        personas: ["LEONARDODAVINCI", "LUDOVSFOR"],
        eventoId: "LEONARDO_MILAN_1482",
        titulo: "Milán: Leonardo entra en una corte de imágenes y poder",
        texto: "Leonardo deja Florencia y entra en la órbita de Ludovico Sforza. En Milán no es solo pintor: diseña máquinas, fiestas, fortificaciones y proyectos monumentales. Pero también aprende a convertir el retrato cortesano en algo mucho más vivo. Aquí comienza la pista que nos llevará hacia la Gioconda."
      },
      {
        anio: 1490,
        persona: "CECIGALL",
        personas: ["LEONARDODAVINCI", "CECIGALL", "LUDOVSFOR"],
        eventoId: "DAMA_ARMINO_1490",
        titulo: "La Dama del armiño: un misterio que sí resolvemos",
        texto: "Cecilia Gallerani, joven culta de la corte y amante de Ludovico Sforza, posa para Leonardo hacia 1490. Su identificación como la Dama del armiño está sólidamente establecida. El retrato es una parada esencial: años antes de la Gioconda, Leonardo ya hace que una mujer parezca sorprendida en medio de un gesto y de una conversación invisible."
      },
      {
        anio: 1499,
        persona: "ISABELLAESTE",
        personas: ["LEONARDODAVINCI", "ISABELLAESTE", "LUDOVSFOR"],
        titulo: "Mantua: Isabella d'Este quiere un Leonardo",
        texto: "Cuando los franceses derriban el poder de Ludovico, Leonardo abandona Milán. En Mantua retrata sobre papel a Isabella d'Este. El dibujo se conserva y demuestra una relación artística directa entre ambos. Precisamente por esa cercanía y por su enorme prestigio, Isabella ha aparecido en algunas teorías sobre la Gioconda, aunque el retrato del Louvre apunta en otra dirección."
      },
      {
        anio: 1500,
        persona: "CATASFOR",
        personas: ["LEONARDODAVINCI", "CATASFOR", "CESARBORJA"],
        titulo: "La Italia de Caterina Sforza",
        texto: "Leonardo recorre una Italia convulsa en la que las mismas familias aparecen una y otra vez alrededor del arte y de la guerra. Caterina Sforza, señora de Forlì e hija de Galeazzo Maria, también ha sido propuesta como identidad del retrato. Es una hipótesis sugerente por el entorno histórico, pero no posee la cadena documental que acabaremos encontrando en Florencia."
      },
      {
        anio: 1502,
        persona: "CESARBORJA",
        personas: ["LEONARDODAVINCI", "CESARBORJA"],
        eventoId: "LEONARDO_BORJA_1502",
        titulo: "Con César Borja: Leonardo dibuja territorios, no rostros",
        texto: "Durante unos meses Leonardo trabaja para César Borja como ingeniero militar. Recorre fortalezas y ciudades, estudia ríos, caminos y defensas y produce algunos de sus mapas más extraordinarios. El episodio recuerda que el hombre que pintará el rostro más famoso de Europa observa con la misma obsesión una cara, una máquina o un paisaje."
      },
      {
        anio: 1503,
        persona: "LISAGHERARDINI",
        personas: ["LEONARDODAVINCI", "LISAGHERARDINI", "FRANCESCOGIOCONDO"],
        eventoId: "GIOCONDA_1503",
        titulo: "Florencia: aquí aparece la pista decisiva",
        texto: "De regreso en Florencia llegamos a Lisa Gherardini, esposa del mercader Francesco del Giocondo. El nombre de la familia explica 'Gioconda'; la tradición textual y la documentación conocida encajan con el inicio del retrato hacia 1503. Esta es la identificación que hoy mantiene el Louvre y el consenso historiográfico dominante: la mujer del cuadro es Lisa Gherardini."
      },
      {
        anio: 1504,
        persona: "ISABNAP",
        personas: ["ISABNAP", "COSTANZADAVALOS", "BIANSFOR", "CATASFOR", "ISABELLAESTE", "LISAGHERARDINI"],
        titulo: "¿Entonces por qué existen tantas candidatas?",
        texto: "Porque Leonardo trabajó durante décadas entre cortes llenas de mujeres poderosas y porque dejó obras, dibujos y noticias difíciles de encajar. Isabella de Aragón, Costanza d'Avalos, Bianca Giovanna Sforza, Caterina Sforza e Isabella d'Este han aparecido en distintas propuestas. Algunas conectan bien con una etapa de su vida; ninguna reúne, a día de hoy, el conjunto de indicios que favorece a Lisa Gherardini."
      },
      {
        anio: 1506,
        persona: "CHARLES2AMBOISE",
        personas: ["LEONARDODAVINCI", "CHARLES2AMBOISE"],
        eventoId: "LEONARDO_MILAN_1506",
        titulo: "Leonardo vuelve a Milán, pero el retrato viaja con él",
        texto: "Leonardo regresa a un Milán controlado por Francia y encuentra un nuevo protector en Charles II d'Amboise. La Gioconda no queda atrás como un encargo entregado y cerrado: Leonardo conserva la pintura y continúa trabajando en ella durante años. El cuadro empieza a convertirse en una obra personal del artista."
      },
      {
        anio: 1513,
        persona: "GIULIANOMEDICI",
        personas: ["LEONARDODAVINCI", "GIULIANOMEDICI", "PAPA_LEON10"],
        eventoId: "LEONARDO_ROMA_1513",
        titulo: "Roma: una última pista italiana",
        texto: "Leonardo se instala en Roma bajo la protección de Giuliano de' Medici, hermano de León X. Un testimonio posterior hablará de un retrato de una dama florentina realizado a petición de Giuliano. La noticia ha alimentado debates sobre la identidad del cuadro, pero el Louvre la considera compatible con un problema de identificación de las obras vistas por el testigo, no una razón suficiente para desplazar a Lisa."
      },
      {
        anio: 1516,
        persona: "FRAN1FRA",
        personas: ["LEONARDODAVINCI", "FRAN1FRA", "FRANCESCOMELZI"],
        eventoId: "LEONARDO_FRANCIA_1516",
        titulo: "Francia: el cuadro abandona Italia con Leonardo",
        texto: "Francisco I llama a Leonardo a Francia. El artista cruza los Alpes acompañado por Francesco Melzi y lleva consigo varias pinturas en las que todavía trabaja. Entre ellas está la Gioconda. Su último mecenas ya no encarga el retrato: hereda la presencia del artista y, después, la obra que Leonardo nunca quiso dejar atrás."
      },
      {
        anio: 1519,
        persona: "LEONARDODAVINCI",
        personas: ["LEONARDODAVINCI", "LISAGHERARDINI", "CECIGALL", "ISABELLAESTE", "FRAN1FRA"],
        eventoId: "LEONARDO_MUERTE_1519",
        titulo: "Final de la búsqueda: una mujer y toda una vida de Leonardo",
        texto: "Leonardo muere en Francia en 1519. El viaje nos ha dejado retratos seguros como Cecilia Gallerani, modelos realmente dibujadas como Isabella d'Este y una constelación de candidatas nacida de las cortes que recorrió. Pero cuando todas las pistas se ordenan, el punto de llegada es claro: el Louvre identifica la Gioconda como el retrato de Lisa Gherardini, esposa de Francesco del Giocondo. El verdadero misterio ya no es tanto quién es, sino por qué Leonardo siguió transformando su retrato durante tantos años."
      }
    ]
  },
  {
    id: "revolucion-protestante",
    titulo: "La Revolución Protestante",
    subtitulo: "Humanismo, Reforma, política imperial y la respuesta de Trento",
    disponible: true,
    descripcion: "Un viaje por la ruptura religiosa del siglo XVI: Erasmo y el regreso a las fuentes, Lutero y los príncipes alemanes, Zuinglio y Calvino, la separación inglesa y una Iglesia católica que responde con nuevas órdenes y el Concilio de Trento.",
    pasos: [
      {
        anio: 1516,
        persona: "ERASMOROT",
        personas: ["ERASMOROT"],
        eventoId: "ERASMO_1516",
        titulo: "Antes de Lutero: reformar mediante el saber",
        texto: "Erasmo de Róterdam quiere una Iglesia más culta, moral y próxima a las fuentes cristianas. Su edición del Nuevo Testamento en griego y latín simboliza el programa humanista: leer mejor antes de discutir mejor. Erasmo no será protestante, pero el mundo intelectual que ayuda a crear hará mucho más difícil aceptar la autoridad sin examen."
      },
      {
        anio: 1517,
        persona: "LUTERO",
        personas: ["LUTERO", "TETZEL", "PAPA_LEON10", "FRED3SAX"],
        eventoId: "LUTERO_1517",
        titulo: "1517: una controversia local encuentra una imprenta",
        texto: "La predicación de indulgencias asociada a Johann Tetzel provoca la protesta académica de Martín Lutero. Lo que podría haber sido una disputa universitaria circula con extraordinaria rapidez. León X ve un problema de obediencia; Lutero empieza pensando en un problema de penitencia y acaba cuestionando la forma misma en que se define la autoridad cristiana."
      },
      {
        anio: 1519,
        persona: "JOHANNECK",
        personas: ["JOHANNECK", "LUTERO", "MELANCHTHON"],
        eventoId: "LEIPZIG_1519",
        titulo: "Leipzig: la discusión ya no trata solo de indulgencias",
        texto: "Johann Eck obliga a Lutero a llevar sus argumentos hasta el fondo. Si papas y concilios pueden equivocarse, ¿dónde descansa la autoridad final? La respuesta de Lutero se desplaza hacia la Escritura. Alrededor de él, jóvenes humanistas como Felipe Melanchthon convierten la protesta en un programa intelectual cada vez más coherente."
      },
      {
        anio: 1521,
        persona: "CARLOS5",
        personas: ["CARLOS5", "LUTERO", "FRED3SAX"],
        eventoId: "WORMS_1521",
        titulo: "Worms: el teólogo se convierte en problema imperial",
        texto: "Carlos V, recién elegido emperador, no puede tratar a Lutero como si Alemania fuera un reino centralizado. Lutero se niega a retractarse y Federico el Sabio lo protege en Wartburg. Aquí se cruzan doctrina y constitución: sin la fragmentación política del Imperio, la historia de la Reforma habría sido muy distinta."
      },
      {
        anio: 1523,
        persona: "ZWINGLI",
        personas: ["ZWINGLI", "LUTERO"],
        eventoId: "ZURICH_1523",
        titulo: "No existe una sola Reforma",
        texto: "En Zúrich, Ulrico Zuinglio desarrolla un programa reformador independiente. Coincide con Lutero en romper con numerosos elementos de la tradición medieval, pero discrepa en cuestiones centrales como la Eucaristía. Desde muy pronto, 'protestante' no significa una única doctrina."
      },
      {
        anio: 1529,
        persona: "JUANSAX",
        personas: ["JUANSAX", "FELIPEHESSE", "CARLOS5"],
        eventoId: "SPEYER_1529",
        titulo: "De una protesta política nace un nombre",
        texto: "Cuando la Dieta de Espira intenta limitar la expansión de la Reforma, varios príncipes y ciudades protestan formalmente. Juan de Sajonia y Felipe de Hesse representan una realidad decisiva: las nuevas confesiones sobreviven porque existen poderes territoriales dispuestos a protegerlas."
      },
      {
        anio: 1530,
        persona: "MELANCHTHON",
        personas: ["MELANCHTHON", "CARLOS5", "JUANSAX", "FELIPEHESSE"],
        eventoId: "CONFESION_AUGSBURGO_1530",
        titulo: "Augsburgo: la Reforma escribe quién es",
        texto: "Melanchthon presenta la Confesión de Augsburgo ante Carlos V. El documento intenta explicar la fe luterana de manera sistemática y todavía busca mostrar cuánto comparte con la tradición cristiana común. Pero el mero hecho de que príncipes y ciudades presenten una confesión propia demuestra que la ruptura ya tiene instituciones."
      },
      {
        anio: 1534,
        persona: "ENRIQ8ING",
        personas: ["ENRIQ8ING", "CATARAG", "ANABOLENA", "THOMASCROMWELL", "THOMASCRANMER", "TOMASMORO"],
        eventoId: "SUPREMACIA_1534",
        titulo: "Inglaterra: una Reforma que empieza por la corona",
        texto: "El problema matrimonial de Enrique VIII con Catalina de Aragón desemboca en una ruptura jurisdiccional con Roma. Thomas Cromwell y Thomas Cranmer construyen el nuevo orden; Tomás Moro se niega a reconocer la supremacía religiosa del rey y es ejecutado. Inglaterra entra en la Reforma por una puerta distinta a Wittenberg."
      },
      {
        anio: 1536,
        persona: "CALVINO",
        personas: ["CALVINO", "ZWINGLI", "LUTERO"],
        eventoId: "CALVINO_1536",
        titulo: "Calvino: la segunda generación organiza una revolución",
        texto: "Juan Calvino publica la primera edición de la Institución de la religión cristiana. Su obra sistematiza una tradición reformada que no es luterana y que acabará proyectándose desde Ginebra hacia Francia, los Países Bajos, Escocia y otros territorios."
      },
      {
        anio: 1540,
        persona: "IGNACIOLOYOLA",
        personas: ["IGNACIOLOYOLA", "DIEGOLAIN", "PAPA_PAULO3"],
        eventoId: "JESUITAS_1540",
        titulo: "La Iglesia católica también está cambiando",
        texto: "Paulo III aprueba la Compañía de Jesús, fundada por Ignacio de Loyola y sus compañeros. No todo lo que llamamos 'Contrarreforma' es reacción a Lutero: existe también una poderosa corriente interna de reforma católica, educación, disciplina y renovación espiritual."
      },
      {
        anio: 1545,
        persona: "PAPA_PAULO3",
        personas: ["PAPA_PAULO3", "SERIPANDO", "DOMINGOSOTO", "DIEGOLAIN", "ALFONSOSALMERON"],
        eventoId: "TRENTO_1545",
        titulo: "Trento: responder, reformar y definir",
        texto: "El Concilio de Trento se abre bajo Paulo III. Girolamo Seripando, Domingo de Soto, Diego Laínez, Alfonso Salmerón y muchos otros discuten cuestiones que la Reforma ha vuelto imposibles de aplazar: justificación, sacramentos, autoridad, formación del clero y disciplina eclesiástica."
      },
      {
        anio: 1547,
        persona: "JUANFED1SAX",
        personas: ["CARLOS5", "JUANFED1SAX", "FELIPEHESSE"],
        eventoId: "MUHLBERG_1547",
        titulo: "Mühlberg: Carlos V gana una batalla y pierde la solución",
        texto: "El emperador derrota militarmente a la Liga de Esmalcalda y captura a Juan Federico de Sajonia y Felipe de Hesse. Parece el momento de restaurar la unidad. No sucede. La victoria demuestra que un ejército puede derrotar una coalición protestante; no demuestra que pueda borrar veinte años de iglesias, príncipes, universidades y convicciones nuevas."
      },
      {
        anio: 1555,
        persona: "FERN1EMP",
        personas: ["CARLOS5", "FERN1EMP", "JUANFED1SAX", "FELIPEHESSE"],
        eventoId: "AUGSBURGO_1555",
        titulo: "Augsburgo: el Imperio admite que la ruptura es real",
        texto: "Fernando negocia en nombre de su hermano Carlos una paz que reconoce legalmente el luteranismo junto al catolicismo en el marco imperial. Es una solución incompleta y no incluye todas las nuevas confesiones, pero supone el fracaso definitivo del proyecto de una sola religión impuesta por el emperador."
      },
      {
        anio: 1559,
        persona: "ISABEL1ING",
        personas: ["ENRIQ8ING", "EDUARDO6ING", "MARIA1ING", "ISABEL1ING", "THOMASCRANMER"],
        eventoId: "ELIZABETH_SETTLEMENT_1559",
        titulo: "Inglaterra después de tres cambios de rumbo",
        texto: "Tras Enrique VIII, el protestantismo avanza con Eduardo VI y retrocede bajo María I. Isabel I establece en 1559 un nuevo equilibrio eclesiástico separado de Roma. La Reforma inglesa deja de ser únicamente la decisión matrimonial de Enrique y se convierte en una identidad confesional duradera."
      },
      {
        anio: 1563,
        persona: "GIOVANNIMORONE",
        personas: ["PAPA_PIO4", "GIOVANNIMORONE", "SERIPANDO", "DIEGOLAIN", "ALFONSOSALMERON"],
        eventoId: "TRENTO_CIERRE_1563",
        titulo: "Trento termina, la revolución no",
        texto: "En la fase final, Giovanni Morone ayuda a sacar al concilio de una grave crisis y Pío IV confirma sus decretos. La Iglesia católica sale de Trento más definida doctrinalmente y con un programa de reforma institucional. Europa ya no volverá a la unidad religiosa de 1500: del conflicto han nacido varias Europas cristianas que seguirán compitiendo durante generaciones."
      }
    ]
  },
  {
    id: "favoritos-maquiavelo",
    titulo: "Los favoritos de Maquiavelo",
    subtitulo: "Modelos, contraejemplos y lecciones de poder en El príncipe",
    disponible: true,
    descripcion: "Un viaje por los gobernantes y contemporáneos que Maquiavelo convirtió en lecciones políticas: cómo conquistar, conservar, perder, aparentar, arriesgar y construir reputación en la Italia de su tiempo.",
    pasos: [
      {
        anio: 1450,
        persona: "FRAN1SFOR",
        personas: ["NICCOLOMACHIAVELLI", "FRAN1SFOR", "BLANMARVISC"],
        eventoId: "SFORZA_DUQUE_1450",
        titulo: "Francesco Sforza: hacerse príncipe con armas propias",
        texto: "Maquiavelo necesita ejemplos de hombres que hayan llegado al poder sin heredarlo. Francesco Sforza le ofrece uno excepcional: un condotiero que convierte capacidad militar, alianzas y matrimonio en un ducado. En El príncipe aparece como contraste con quienes deben su ascenso sobre todo a la fortuna ajena."
      },
      {
        anio: 1492,
        persona: "RODRIGOBORJA",
        personas: ["NICCOLOMACHIAVELLI", "RODRIGOBORJA", "CESARBORJA"],
        eventoId: "ALEJANDRO6_1492",
        titulo: "Alejandro VI: promesas, apariencia y oportunidad",
        texto: "Rodrigo Borja llega al papado como Alejandro VI y convierte la política familiar en política territorial. Maquiavelo lo usa como un contemporáneo capaz de prometer, negociar y cambiar de posición sin quedar atrapado por sus palabras: no como modelo moral, sino como observación de cómo funciona el poder cuando reputación y engaño se mezclan."
      },
      {
        anio: 1498,
        persona: "NICCOLOMACHIAVELLI",
        personas: ["NICCOLOMACHIAVELLI", "PIEROSODERINI"],
        titulo: "Maquiavelo entra en el laboratorio del poder",
        texto: "En 1498 Nicolás Maquiavelo entra al servicio de la república de Florencia. Durante los años siguientes viaja, negocia y observa de cerca a reyes, papas, capitanes y señores italianos. El príncipe nacerá después de esa experiencia: sus personajes no son figuras abstractas, sino gobernantes a los que Maquiavelo vio actuar o estudió como problemas políticos concretos."
      },
      {
        anio: 1499,
        persona: "CATASFOR",
        personas: ["NICCOLOMACHIAVELLI", "CATASFOR", "CESARBORJA"],
        eventoId: "MACHIAVELLI_FORLI_1499",
        titulo: "Caterina Sforza: una fortaleza no basta",
        texto: "Maquiavelo negocia personalmente con Caterina Sforza en Forlì. Poco después César Borja conquista sus dominios. Años más tarde, al discutir si un príncipe debe confiar en fortalezas, Maquiavelo recuerda la experiencia de Forlì: una roca formidable puede ser útil, pero no sustituye la relación política con quienes viven fuera de sus muros."
      },
      {
        anio: 1500,
        persona: "LUIS12FRA",
        personas: ["NICCOLOMACHIAVELLI", "LUIS12FRA", "LUDOVSFOR"],
        titulo: "Luis XII: un manual de cómo perder Italia",
        texto: "El rey de Francia conquista Milán, interviene en Nápoles y parece dominar el tablero italiano. Para Maquiavelo, precisamente por eso resulta tan útil como contraejemplo: sus alianzas y decisiones muestran cómo un conquistador puede debilitar a sus apoyos, fortalecer a rivales y crear las condiciones de su propia expulsión."
      },
      {
        anio: 1502,
        persona: "CESARBORJA",
        personas: ["NICCOLOMACHIAVELLI", "CESARBORJA", "RODRIGOBORJA", "VITELLOZZO"],
        eventoId: "SENIGALLIA_1502",
        titulo: "César Borja: el príncipe que casi lo consiguió",
        texto: "César Borja es el gran caso práctico de la obra. Maquiavelo lo observa durante su expansión por Romaña y presencia el desenlace de Senigallia, donde el duque atrae y elimina a capitanes rebeldes. Borja parece construir orden, armas propias y obediencia; su derrumbe tras la muerte de Alejandro VI sirve, al mismo tiempo, para estudiar cuánto puede hacer la virtù frente a una fortuna adversa."
      },
      {
        anio: 1506,
        persona: "PAPA_JULIO2",
        personas: ["NICCOLOMACHIAVELLI", "PAPA_JULIO2", "CESARBORJA"],
        eventoId: "JULIO2_1503",
        titulo: "Julio II: cuando la audacia coincide con los tiempos",
        texto: "Julio II actúa con una impetuosidad que a menudo desconcierta a aliados y enemigos. Maquiavelo lo utiliza para explicar una de sus ideas más famosas: un temperamento político funciona mientras encaja con las circunstancias. La audacia de Julio triunfa porque su tiempo la favorece; en otro contexto, la misma conducta podría haberlo destruido."
      },
      {
        anio: 1512,
        persona: "FERN2ARAG",
        personas: ["NICCOLOMACHIAVELLI", "FERN2ARAG", "ISAB1CAST"],
        titulo: "Fernando el Católico: fabricar una reputación",
        texto: "Granada, el Mediterráneo, Italia y Navarra permiten a Fernando encadenar empresas que mantienen a sus súbditos y rivales pendientes de la siguiente iniciativa. En El príncipe es el ejemplo contemporáneo de cómo las grandes acciones, la continuidad de los proyectos y una imagen cuidadosamente construida pueden convertir la reputación en un instrumento de gobierno."
      },
      {
        anio: 1516,
        persona: "LORENZO2MEDICI",
        personas: ["NICCOLOMACHIAVELLI", "GIULIANOMEDICI", "LORENZO2MEDICI", "CATAMEDICI", "PIEROLORENZOMEDICI"],
        eventoId: "PRINCIPE_DEDICACION_1516",
        titulo: "Lorenzo de’ Medici: el destinatario, no el héroe",
        texto: "El recorrido termina con una ironía. El tratado había sido pensado inicialmente para Giuliano de’ Medici, pero tras su muerte la dedicatoria pasó a Lorenzo II, el Joven. Lorenzo no es uno de los grandes ejemplos del libro: es su destinatario final. Maquiavelo le ofrece una colección de lecciones extraídas de Sforza, los Borgia, Francia, el papado y Fernando. El libro sobrevivirá mucho más que la oportunidad política para la que fue escrito."
      }
    ]
  },
  {
    id: "republica-nobles",
    titulo: "La República de los nobles",
    subtitulo: "Cómo Polonia convirtió una monarquía hereditaria en una corona elegida.",
    disponible: true,
    descripcion: "Un recorrido por la transformación de Polonia-Lituania en una monarquía donde el rey debía ser elegido, negociar y gobernar con una nobleza extraordinariamente poderosa: de los últimos Jagellón a las elecciones internacionales, los Vasa, Sobieski, los Wettin y el intento final de reforma de 1791.",
    pasos: [
      {
        anio: 1506,
        persona: "SEGIS1JAG",
        personas: ["SEGIS1JAG", "ALEJANDRO1POL", "CASI4"],
        titulo: "Una monarquía hereditaria... que ya necesita negociar",
        texto: "Cuando Segismundo el Viejo sucede a su hermano Alejandro, la corona permanece dentro de los Jagellón, pero no funciona como una herencia automática. Reyes y nobleza llevan generaciones intercambiando reconocimiento dinástico por privilegios. La futura república nobiliaria no aparecerá de la nada: crece dentro de la propia monarquía."
      },
      {
        anio: 1569,
        persona: "SEGIS2JAG",
        personas: ["SEGIS2JAG", "ANAJAG", "CATALINAJAG"],
        eventoId: "LUBLIN_1569",
        titulo: "Lublin: la unión deja de depender de una familia",
        texto: "Segismundo II Augusto no tiene hijos. La Unión de Lublin convierte la relación entre Polonia y Lituania en una comunidad política más estrecha justo cuando la dinastía Jagellón se acerca a su final. La gran pregunta ya no es qué hijo heredará: es cómo elegirán juntos al siguiente rey."
      },
      {
        anio: 1573,
        persona: "ENRIQ3FRA",
        personas: ["ENRIQ3FRA", "ANAJAG"],
        eventoId: "ELECCION_1573",
        titulo: "Cualquiera puede aspirar a la corona",
        texto: "La primera elección libre lleva al trono a Enrique de Valois, hermano del rey de Francia. Para aceptar la corona debe jurar reglas que limitan permanentemente al monarca. La paradoja es inmediata: un príncipe extranjero consigue una de las grandes coronas de Europa, pero esa corona pertenece políticamente a quienes lo han elegido."
      },
      {
        anio: 1576,
        persona: "ESTEBANBATHORY",
        personas: ["ANAJAG", "ESTEBANBATHORY", "ENRIQ3FRA"],
        eventoId: "BATHORY_1576",
        titulo: "Una reina Jagellón y un príncipe de Transilvania",
        texto: "Enrique abandona Polonia para convertirse en rey de Francia. La respuesta no es restaurar una sucesión hereditaria: Ana Jagellón es elegida y Esteban Báthory, príncipe de Transilvania, gobierna junto a ella. Sangre dinástica y elección popular nobiliaria se combinan de una manera que casi ninguna otra gran monarquía europea puede imitar."
      },
      {
        anio: 1587,
        persona: "SEGIS3VASA",
        personas: ["SEGIS3VASA", "CATALINAJAG", "JUAN3SUECIA"],
        eventoId: "VASA_POLONIA_1587",
        titulo: "La elección vuelve a fabricar una dinastía",
        texto: "Segismundo III Vasa es nieto de Segismundo el Viejo por su madre Catalina Jagellón y heredero del trono sueco por su padre. Su elección parece reconciliar continuidad y libertad. Durante tres generaciones los Vasa serán elegidos uno tras otro, demostrando que una monarquía electiva puede comportarse durante décadas como si fuera dinástica sin dejar de ser electiva."
      },
      {
        anio: 1632,
        persona: "WLAD4VASA",
        personas: ["SEGIS3VASA", "WLAD4VASA", "JUAN2CASIVASA"],
        titulo: "Ladislao IV: una sucesión que parece hereditaria",
        texto: "A la muerte de Segismundo III, la nobleza elige a su hijo Ladislao IV. Nadie ha abolido la elección, pero la continuidad familiar funciona. Ésta es una de las claves del sistema: la República puede escoger al heredero natural cuando le conviene y recordarle, al mismo tiempo, que no reina simplemente por haber nacido."
      },
      {
        anio: 1668,
        persona: "JUAN2CASIVASA",
        personas: ["JUAN2CASIVASA", "MIGUELKORYBUT", "LUISAMARIAGONZAGA"],
        eventoId: "ABDICACION_1668",
        titulo: "La dinastía Vasa se rompe por una abdicación",
        texto: "Juan II Casimiro, hermano de Ladislao, soporta rebeliones, invasiones suecas y una larga crisis política antes de abdicar. Sin un heredero dinástico inevitable, la elección de 1669 escoge a Miguel Korybut Wiśniowiecki, un candidato de la propia nobleza. La corona demuestra que puede abandonar de golpe a una gran casa europea."
      },
      {
        anio: 1683,
        persona: "JUAN3SOBIESKI",
        personas: ["JUAN3SOBIESKI", "MARIAKAZIMIERA", "MIGUELKORYBUT"],
        eventoId: "VIENA_1683",
        titulo: "Sobieski: un rey elegido que salva Viena",
        texto: "Juan Sobieski llega al trono por elección y no por pertenecer a una dinastía reinante. En 1683 conduce al ejército de socorro de Viena y se convierte en uno de los monarcas más célebres de Europa. La República de los nobles puede producir un rey de enorme prestigio; lo que no puede garantizar es que sus hijos hereden la corona."
      },
      {
        anio: 1697,
        persona: "AUGUST2SAXPOL",
        personas: ["AUGUST2SAXPOL", "CHRISTIANEEBERHARDINE", "JUAN3SOBIESKI"],
        eventoId: "WETTIN_POLONIA_1697",
        titulo: "Un elector sajón compra, negocia y conquista una elección",
        texto: "Federico Augusto de Sajonia se convierte al catolicismo y es elegido como Augusto II. El resultado une personalmente Sajonia y la Mancomunidad. La corona polaca vuelve a ser un premio de primer orden para las casas europeas, pero también una puerta por la que las potencias vecinas pueden intervenir en la política interna."
      },
      {
        anio: 1733,
        persona: "STAN1LESZ",
        personas: ["STAN1LESZ", "AUGUST3SAXPOL", "AUGUST2SAXPOL", "MARIALESZCZ"],
        eventoId: "DOBLE_ELECCION_1733",
        titulo: "Dos reyes elegidos, una guerra europea",
        texto: "A la muerte de Augusto II, Estanislao Leszczyński y Augusto III reciben apoyos rivales. Francia favorece al primero; Rusia y Austria sostienen al segundo. La elección que debía expresar la libertad política de la nobleza se convierte en una competición internacional respaldada por ejércitos."
      },
      {
        anio: 1764,
        persona: "STAN2PONIAT",
        personas: ["STAN2PONIAT", "CATHERINE2RUS", "FREDWIL2PRU"],
        eventoId: "PONIATOWSKI_1764",
        titulo: "El último rey intenta reformar la República",
        texto: "Estanislao Augusto Poniatowski es elegido en un sistema cuya libertad formal convive ya con una enorme presión rusa. Lejos de limitarse a aceptar el declive, el rey y una parte de las élites intentarán reconstruir el Estado. La gran pregunta del siglo XVIII es si la libertad nobiliaria puede transformarse antes de convertirse en parálisis."
      },
      {
        anio: 1791,
        persona: "STAN2PONIAT",
        personas: ["STAN2PONIAT", "FREDAUGUST3SAX"],
        eventoId: "CONSTITUCION_1791",
        titulo: "La República intenta abolir la corona electiva",
        texto: "La Constitución del 3 de Mayo elimina el liberum veto y sustituye la elección de cada nuevo rey por una sucesión hereditaria prevista en la casa de Sajonia. Después de más de dos siglos, los propios reformadores de la República concluyen que el mecanismo que había protegido la libertad política también podía impedir la supervivencia del Estado."
      },
      {
        anio: 1795,
        persona: "STAN2PONIAT",
        personas: ["STAN2PONIAT", "CATHERINE2RUS", "FREDWIL2PRU"],
        eventoId: "FIN_POLONIA_1795",
        titulo: "El final: ya no queda una corona que elegir",
        texto: "La tercera partición extingue la Mancomunidad y Estanislao Augusto abdica. El recorrido que comenzó con una dinastía negociando privilegios termina con Rusia, Prusia y Austria repartiéndose el territorio. La República de los nobles fue una anomalía extraordinariamente duradera: una monarquía que convirtió la elección del rey en parte central de su idea de libertad."
      }
    ]
  },

  {
    id: "corona-dos-credos",
    titulo: "Una corona entre dos credos",
    subtitulo: "Catalina de Médici, los hugonotes y la Liga Católica",
    disponible: true,
    descripcion: "Francia pasa de una sucesión aparentemente segura a cuatro décadas de guerras civiles religiosas. Catalina de Médici intenta conservar la monarquía entre Borbones hugonotes y Guisa católicos hasta que la extinción de los Valois entrega la corona al protestante Enrique de Navarra.",
    pasos: [
      {
        anio: 1559,
        persona: "CATAMEDICI",
        personas: ["ENRIQ2FRA", "FRANC2FRA", "CATAMEDICI", "FRAN1GUISA"],
        eventoId: "MUERTE_ENRIQUE2_1559",
        titulo: "Una muerte cambia el equilibrio de Francia",
        texto: "Enrique II muere después de un accidente en un torneo. Su hijo Francisco II es joven, está casado con María Estuardo y depende políticamente de los Guisa, tíos de la reina. Catalina de Médici pasa de esposa del rey a madre de una dinastía vulnerable."
      },
      {
        anio: 1560,
        persona: "CATAMEDICI",
        personas: ["CATAMEDICI", "CARLOS9FRA", "LUIS1CONDE", "FRAN1GUISA"],
        eventoId: "REGENCIA_CATALINA_1560",
        titulo: "Catalina intenta gobernar entre dos partidos",
        texto: "Francisco II muere sin hijos y su hermano Carlos IX sube al trono siendo un niño. Catalina controla el gobierno, pero no puede ignorar ni a los Guisa, jefes de la reacción católica, ni a los príncipes de sangre Borbón que dan protección política a los reformados."
      },
      {
        anio: 1562,
        persona: "LUIS1CONDE",
        personas: ["FRAN1GUISA", "LUIS1CONDE", "CATAMEDICI"],
        eventoId: "WASSY_1562",
        titulo: "Wassy convierte la tensión en guerra civil",
        texto: "La violencia en Wassy, protagonizada por hombres de Francisco de Guisa contra una congregación protestante, destruye el frágil equilibrio. Luis de Condé organiza un ejército hugonote. Francia ya no discute únicamente sobre tolerancia religiosa: dos redes aristocráticas levantan tropas contra sus compatriotas."
      },
      {
        anio: 1569,
        persona: "GASPARD2COLIGNY",
        personas: ["LUIS1CONDE", "GASPARD2COLIGNY", "ENRIQ3FRA"],
        eventoId: "JARNAC_1569",
        titulo: "Muere Condé; Coligny hereda la causa hugonota",
        texto: "Condé muere en Jarnac y Gaspar de Coligny queda como el gran jefe militar de los protestantes. En el bando real, el joven duque de Anjou, futuro Enrique III, gana prestigio. Las guerras empiezan a producir la generación que decidirá la sucesión francesa veinte años después."
      },
      {
        anio: 1572,
        persona: "GASPARD2COLIGNY",
        personas: ["CATAMEDICI", "CARLOS9FRA", "GASPARD2COLIGNY", "ENRIQ4FRA", "MARGVALOIS"],
        eventoId: "SAN_BARTOLOME_1572",
        titulo: "Una boda dinástica termina en matanza",
        texto: "Catalina casa a su hija Margarita con Enrique de Navarra, uno de los grandes príncipes hugonotes, para reforzar la paz. Días después, el atentado contra Coligny y la matanza de San Bartolomé destruyen esa estrategia. Coligny muere y Enrique de Navarra sobrevive en la corte bajo enorme presión."
      },
      {
        anio: 1574,
        persona: "ENRIQ3FRA",
        personas: ["ENRIQ3FRA", "CATAMEDICI", "ENRIQ4FRA", "FRANCISCOANJOU"],
        titulo: "Enrique III vuelve de Polonia a una Francia rota",
        texto: "Carlos IX muere y su hermano Enrique abandona la corona polaca para convertirse en Enrique III de Francia. La dinastía Valois conserva el trono, pero el nuevo rey no tiene hijos y su hermano Francisco de Anjou es el último heredero masculino de la familia."
      },
      {
        anio: 1585,
        persona: "HENRI1GUISE",
        personas: ["ENRIQ3FRA", "HENRI1GUISE", "ENRIQ4FRA", "FEL2ESP", "CHARLESMAYENNE"],
        eventoId: "LIGA_CATOLICA_1585",
        titulo: "La muerte de un príncipe convierte la religión en sucesión",
        texto: "Francisco de Anjou muere en 1584. Según la sucesión dinástica, el siguiente heredero es Enrique de Navarra: un Borbón y protestante. Enrique de Guisa reorganiza la Liga Católica para impedirlo y obtiene apoyo de Felipe II. Empieza la Guerra de los Tres Enriques."
      },
      {
        anio: 1588,
        persona: "HENRI1GUISE",
        personas: ["ENRIQ3FRA", "HENRI1GUISE", "CHARLESMAYENNE"],
        eventoId: "ASESINATO_GUISA_1588",
        titulo: "El rey mata al hombre que dominaba París",
        texto: "Después de que la Jornada de las Barricadas obligue al rey a huir de París, Enrique III concluye que Guisa se ha convertido en un poder rival. Lo hace asesinar en Blois. El golpe elimina al jefe de la Liga, pero no a la Liga: su hermano Carlos de Mayenne toma el mando."
      },
      {
        anio: 1589,
        persona: "ENRIQ4FRA",
        personas: ["ENRIQ3FRA", "ENRIQ4FRA", "CHARLESMAYENNE"],
        eventoId: "ASESINATO_ENRIQUE3_1589",
        titulo: "El último Valois entrega la sucesión a un Borbón",
        texto: "Enrique III se alía finalmente con Enrique de Navarra contra los ligueurs, pero es asesinado por el fraile Jacques Clément. En su lecho de muerte reconoce a Navarra como sucesor. Enrique IV es rey por derecho dinástico, aunque todavía debe conquistar políticamente su propio reino."
      },
      {
        anio: 1593,
        persona: "ENRIQ4FRA",
        personas: ["ENRIQ4FRA", "CHARLESMAYENNE", "MARGVALOIS"],
        eventoId: "CONVERSION_ENRIQUE4_1593",
        titulo: "Para ganar Francia, Enrique cambia de confesión",
        texto: "Tras años de guerra, Enrique IV abraza el catolicismo. El gesto permite que amplios sectores católicos acepten a un Borbón que hasta entonces consideraban inadmisible. La Liga pierde la principal razón con la que justificaba una sucesión alternativa."
      },
      {
        anio: 1598,
        persona: "ENRIQ4FRA",
        personas: ["ENRIQ4FRA", "CATAMEDICI", "HENRI1GUISE", "GASPARD2COLIGNY"],
        eventoId: "EDICTO_NANTES_1598",
        titulo: "La monarquía sobrevive a la guerra religiosa",
        texto: "El Edicto de Nantes establece una convivencia limitada con los protestantes y cierra la fase principal de las guerras. Catalina, Condé, Coligny y Guisa ya han muerto; el superviviente es Enrique IV. La solución no consiste en que un partido conquiste Francia, sino en reconstruir una corona capaz de gobernar sobre ambos."
      }
    ]
  },
  {
    id: "reino-partido-dos",
    titulo: "El reino partido en dos",
    subtitulo: "Hohenstaufen, Anjou y Aragón por Sicilia y Nápoles",
    disponible: true,
    descripcion: "La herencia de Federico II pasa de los Hohenstaufen a los Anjou, provoca la rebelión de las Vísperas y termina creando dos coronas rivales: Nápoles en el continente y Trinacria en la isla. Dos siglos después, Aragón vuelve a reunirlas bajo un mismo monarca.",
    pasos: [
      {
        anio: 1250,
        persona: "FED2HOH",
        personas: ["FED2HOH", "CONRADO4HOH", "MANFSIC"],
        eventoId: "MUERTE_FED2_SICILIA_1250",
        titulo: "Federico II deja una herencia que el papado no quiere tolerar",
        texto: "Federico II había unido la dignidad imperial con el reino de Sicilia, rodeando geográficamente a los Estados Pontificios. A su muerte, Conrado IV hereda la corona siciliana y Manfredo mantiene el poder familiar en el sur. El problema no es sólo quién hereda: es si los Hohenstaufen seguirán dominando Italia."
      },
      {
        anio: 1266,
        persona: "CARLOS1ANJ",
        personas: ["MANFSIC", "CARLOS1ANJ", "PAPA_CLEMENTE4"],
        eventoId: "BENEVENTO_1266",
        titulo: "El papa encuentra un rey contra los Hohenstaufen",
        texto: "El papado ofrece la corona a Carlos de Anjou, hermano de Luis IX de Francia. Carlos derrota a Manfredo en Benevento y ocupa el reino. Una guerra entre papa y emperador acaba instalando una nueva dinastía francesa en el Mediterráneo central."
      },
      {
        anio: 1268,
        persona: "CONRADINOHOH",
        personas: ["CONRADINOHOH", "CARLOS1ANJ"],
        eventoId: "TAGLIACOZZO_1268",
        titulo: "Conradino pierde la corona y la vida",
        texto: "El joven Conradino intenta recuperar la herencia de su padre Conrado IV, pero Carlos lo derrota en Tagliacozzo. Su ejecución en Nápoles elimina al último pretendiente masculino directo de la línea Hohenstaufen y deja a los Anjou aparentemente sin rival."
      },
      {
        anio: 1282,
        persona: "BEATCONST",
        personas: ["CARLOS1ANJ", "PEDRO3AR", "BEATCONST"],
        eventoId: "VISPERAS_SICILIANAS",
        titulo: "Las Vísperas convierten una rebelión en cuestión dinástica",
        texto: "La rebelión de Palermo expulsa el poder angevino de buena parte de la isla. Los sicilianos recurren a Pedro III de Aragón, casado con Constanza, hija de Manfredo. Los derechos Hohenstaufen que parecían extinguidos regresan a la política a través de una mujer y de la Casa de Barcelona."
      },
      {
        anio: 1296,
        persona: "FEDERICO2SIC",
        personas: ["FEDERICO2SIC", "PEDRO3AR", "BEATCONST", "CARLOS2NAP"],
        eventoId: "FEDERICO_SICILIA_1296",
        titulo: "La isla elige su propia rama aragonesa",
        texto: "Federico, hijo de Pedro III y Constanza, es reconocido como rey en Sicilia. Mientras Carlos II de Anjou mantiene el continente, la familia de Aragón crea en la isla una línea propia. La división deja de ser una ocupación provisional y empieza a convertirse en sistema."
      },
      {
        anio: 1302,
        persona: "FEDERICO2SIC",
        personas: ["FEDERICO2SIC", "CARLOS2NAP"],
        eventoId: "CALTABELLOTTA_1302",
        titulo: "Una paz reconoce el reino partido",
        texto: "Caltabellotta acepta de hecho dos monarquías: los Anjou conservan la parte continental y Federico gobierna la isla, llamada cada vez más Trinacria para distinguirla del reino angevino. El nombre de Sicilia sobrevive en ambos lados del estrecho."
      },
      {
        anio: 1442,
        persona: "ALF5ARAG",
        personas: ["ALF5ARAG", "RENATOANJOU"],
        eventoId: "ALFONSO_NAPOLES_1442",
        titulo: "Alfonso V cruza el estrecho en sentido contrario",
        texto: "Más de siglo y medio después, Alfonso V de Aragón conquista Nápoles frente a Renato de Anjou. El rey ya gobierna Aragón y Trinacria: la victoria reúne bajo su persona las dos mitades de la antigua monarquía de Federico II."
      },
      {
        anio: 1458,
        persona: "FERN1NAP",
        personas: ["ALF5ARAG", "FERN1NAP", "JUAN2ARAG"],
        eventoId: "SUCESION_NAPOLES_1458",
        titulo: "Alfonso muere y las coronas vuelven a tomar caminos distintos",
        texto: "Alfonso no transmite todos sus dominios al mismo heredero. Su hermano Juan II recibe Aragón y Trinacria; Nápoles pasa a su hijo Fernando. La política dinástica demuestra otra vez que compartir soberano no significa fusionar reinos."
      },
      {
        anio: 1494,
        persona: "CARLOS8FRA",
        personas: ["CARLOS8FRA", "FERN1NAP", "ALF5ARAG"],
        eventoId: "GUERRAS_ITALIA",
        titulo: "Carlos VIII convierte la sucesión napolitana en una guerra europea",
        texto: "Carlos VIII de Francia reivindica la herencia angevina de Nápoles y entra en Italia con un gran ejército. La facilidad inicial de su avance rompe el equilibrio de la península y abre las Guerras Italianas, donde Francia y Aragón volverán a disputar el mismo reino."
      },
      {
        anio: 1500,
        persona: "FED1NAP",
        personas: ["FED1NAP", "LUIS12FRA", "FERN2ARAG"],
        eventoId: "TRATADO_GRANADA_1500",
        titulo: "Dos reyes deciden repartirse la corona de un tercero",
        texto: "Luis XII y Fernando el Católico pactan la partición del reino de Federico I de Nápoles. Francia y Aragón cooperan para expulsar al rey existente, pero el acuerdo deja zonas y derechos mal definidos. La alianza contiene desde el principio la siguiente guerra."
      },
      {
        anio: 1503,
        persona: "GRANCAPITAN",
        personas: ["GRANCAPITAN", "FERN2ARAG", "LUIS12FRA"],
        eventoId: "CERIGNOLA_1503",
        titulo: "El Gran Capitán decide la disputa en el campo de batalla",
        texto: "Gonzalo Fernández de Córdoba derrota a los franceses en Cerignola y, meses después, vuelve a vencer en el Garigliano. La disputa jurídica y dinástica de Nápoles se resuelve con una transformación militar: la infantería española demuestra una nueva capacidad para dominar el campo de batalla."
      },
      {
        anio: 1504,
        persona: "FERN2ARAG",
        personas: ["FERN2ARAG", "GRANCAPITAN", "LUIS12FRA"],
        eventoId: "NAPOLES_FERNANDO_1504",
        titulo: "Fernando vuelve a reunir las dos mitades",
        texto: "Fernando el Católico queda como rey de Nápoles y ya era rey de Trinacria. Después de Hohenstaufen, Anjou y dos siglos de guerras, las dos partes de la antigua Sicilia comparten otra vez soberano. Pero no desaparecen como coronas separadas: Nápoles y Trinacria seguirán teniendo historias administrativas propias."
      }
    ]
  },
  {
    id: "lepanto-alianza",
    titulo: "Lepanto: la alianza imposible",
    subtitulo: "Cómo Roma, España y Venecia reunieron una flota contra el Imperio otomano",
    disponible: true,
    descripcion: "La conquista otomana de Chipre obliga a potencias católicas con intereses rivales a coordinarse. Pío V construye la Liga Santa, Felipe II aporta el principal poder monárquico y don Juan de Austria recibe una flota en la que venecianos, pontificios, genoveses y españoles deben aprender a combatir juntos. La historia entra después en la propia batalla: las líneas, el choque de las capitanas, la lucha en las alas, Cervantes y la rápida recuperación naval otomana.",
    pasos: [
      {
        anio: 1520,
        persona: "SULEIMAN1OSM",
        personas: ["SULEIMAN1OSM"],
        eventoId: "SOLIMAN_1520",
        titulo: "El Mediterráneo ya tiene una superpotencia",
        texto: "Solimán el Magnífico hereda un Imperio otomano en expansión y lo lleva a su apogeo. Durante décadas, los Habsburgo, Venecia y otros estados cristianos combaten al mismo rival, pero sus propios intereses impiden que formen una alianza permanente."
      },
      {
        anio: 1566,
        persona: "SELIM2OSM",
        personas: ["SULEIMAN1OSM", "SELIM2OSM"],
        eventoId: "SELIM2_1566",
        titulo: "Selim II hereda la presión sobre el Mediterráneo",
        texto: "La muerte de Solimán no termina la expansión otomana. Selim II mantiene una política ofensiva y pronto concentra su atención en Chipre, una posesión veneciana estratégicamente situada en el Mediterráneo oriental."
      },
      {
        anio: 1570,
        persona: "SEBASTIANOVENIER",
        personas: ["SELIM2OSM", "SEBASTIANOVENIER", "ALIPASHALEPANTO"],
        eventoId: "CHIPRE_1570",
        titulo: "Chipre convierte el problema veneciano en una crisis europea",
        texto: "La invasión otomana de Chipre obliga a Venecia a pedir ayuda. La república marítima necesita a la Monarquía Hispánica, pero Felipe II también debe proteger España, Italia y el norte de África. Crear la alianza exige decidir quién paga, quién manda y dónde se combatirá."
      },
      {
        anio: 1571,
        persona: "PAPA_PIO5",
        personas: ["PAPA_PIO5", "FEL2ESP", "DONJUANAUST", "MARCANTONIO2COL", "SEBASTIANOVENIER"],
        eventoId: "LIGA_SANTA_1571",
        titulo: "Pío V consigue lo que parecía imposible",
        texto: "El papa Pío V actúa como mediador y consigue que la Monarquía Hispánica, Venecia y los Estados Pontificios acepten una Liga Santa. Felipe II respalda el proyecto y don Juan de Austria, hijo de Carlos V y hermanastro del rey, recibe el mando supremo."
      },
      {
        anio: 1571,
        persona: "PAPA_PIO5",
        personas: ["PAPA_PIO5", "DONJUANAUST"],
        eventoId: "PIOV_ROGATIVAS_1571",
        titulo: "Mientras la flota navega, Roma reza",
        texto: "Pío V no se limita a negociar la coalición: ordena rogativas públicas, bendice la expedición y envía un estandarte pontificio a don Juan. La memoria católica vinculará después la victoria a las oraciones y al Rosario. La célebre escena en la que el papa habría conocido milagrosamente el resultado antes de recibir la noticia pertenece a la tradición devocional y aquí se presenta como tal, no como un hecho verificable."
      },
      {
        anio: 1571,
        persona: "DONJUANAUST",
        personas: ["DONJUANAUST", "SEBASTIANOVENIER", "MARCANTONIO2COL", "GIANANDREADORIA", "AGOSTINOBARBARIGO", "ALVAROBAZAN"],
        eventoId: "MESINA_1571",
        titulo: "Mesina: conocer a los hombres de la Liga",
        texto: "La coalición no es un ejército nacional. Venier representa el enorme peso veneciano; Marcantonio Colonna manda el contingente pontificio; Gianandrea Doria dirige las galeras genovesas al servicio de España; Agostino Barbarigo y Álvaro de Bazán ocupan mandos tácticos decisivos. Don Juan debe convertir esa suma de jurisdicciones, rivalidades y tradiciones navales en una sola armada."
      },
      {
        anio: 1571,
        persona: "DONJUANAUST",
        personas: ["DONJUANAUST", "MARCANTONIO2COL", "AGOSTINOBARBARIGO", "GIANANDREADORIA", "ALVAROBAZAN", "ALIPASHALEPANTO", "ULUCALI"],
        eventoId: "FORMACION_LEPANTO_1571",
        titulo: "7 de octubre: dos líneas de galeras se buscan",
        texto: "La Liga forma tres grandes cuerpos y una reserva: Barbarigo queda a la izquierda, don Juan y Colonna en el centro, Doria a la derecha y Bazán detrás para intervenir donde haga falta. Alí Bajá manda el centro otomano; Uluç Alí se enfrenta a Doria en el ala opuesta. La batalla dependerá tanto del choque frontal como de quién consiga envolver o reforzar los extremos."
      },
      {
        anio: 1571,
        persona: "DONJUANAUST",
        personas: ["DONJUANAUST", "ALIPASHALEPANTO", "MARCANTONIO2COL", "SEBASTIANOVENIER"],
        eventoId: "CENTRO_LEPANTO_1571",
        titulo: "La Real y la Sultana quedan trabadas",
        texto: "En el centro, las capitanas de don Juan y Alí Bajá se convierten en el corazón del combate. Arcabuceros, jenízaros y tropas de abordaje luchan sobre cubiertas unidas por espolones y pasarelas improvisadas. Nuevos hombres entran una y otra vez en la pelea hasta que Alí Bajá muere y la Sultana es tomada. El centro otomano empieza a deshacerse."
      },
      {
        anio: 1571,
        persona: "ULUCALI",
        personas: ["ULUCALI", "GIANANDREADORIA", "ALVAROBAZAN", "AGOSTINOBARBARIGO"],
        eventoId: "ALAS_LEPANTO_1571",
        titulo: "En las alas, la victoria todavía no está decidida",
        texto: "Barbarigo resulta mortalmente herido mientras su ala contiene el extremo otomano. Al otro lado, Uluç Alí aprovecha el espacio que se abre durante la maniobra de Doria y golpea varias galeras cristianas. Álvaro de Bazán emplea la reserva para cerrar la brecha. Uluç Alí comprende que el centro está perdido y consigue retirarse con una parte de sus barcos: será el gran superviviente otomano de la jornada."
      },
      {
        anio: 1571,
        persona: "CERVANTES",
        personas: ["CERVANTES", "DONJUANAUST"],
        eventoId: "CERVANTES_LEPANTO_1571",
        titulo: "Entre los soldados está Miguel de Cervantes",
        texto: "Miguel de Cervantes combate a bordo de la Marquesa. Sale de Lepanto herido y pierde el uso de la mano izquierda, pero conservará toda su vida el orgullo de haber participado en aquella jornada. Para el futuro autor del Quijote, Lepanto no será una nota biográfica menor sino una experiencia que él mismo convirtió en memoria personal y literaria."
      },
      {
        anio: 1571,
        persona: "DONJUANAUST",
        personas: ["DONJUANAUST", "ALIPASHALEPANTO", "ULUCALI", "PAPA_PIO5", "FEL2ESP", "CERVANTES"],
        eventoId: "LEPANTO",
        titulo: "La Liga gana la batalla",
        texto: "Tras horas de combate, gran parte de la flota otomana ha sido capturada, hundida o abandonada y Alí Bajá ha muerto. Don Juan obtiene una victoria que causa una impresión enorme en Europa. Lepanto demuestra que una coalición de potencias rivales puede derrotar a la principal armada otomana cuando consigue actuar de forma coordinada."
      },
      {
        anio: 1572,
        persona: "ULUCALI",
        personas: ["ULUCALI", "SELIM2OSM"],
        eventoId: "RECONSTRUCCION_OTOMANA_1572",
        titulo: "El superviviente de Lepanto reconstruye la flota",
        texto: "Uluç Alí es elevado al principal mando naval otomano. Durante el invierno, los arsenales reconstruyen con extraordinaria rapidez una gran armada. La derrota ha sido enorme, pero no ha destruido la capacidad marítima del Imperio otomano ni ha convertido el Mediterráneo en un mar controlado por la Liga."
      },
      {
        anio: 1573,
        persona: "SEBASTIANOVENIER",
        personas: ["SELIM2OSM", "ULUCALI", "SEBASTIANOVENIER", "FEL2ESP"],
        eventoId: "PAZ_VENECIA_1573",
        titulo: "Lepanto vence una batalla, no conquista el Mediterráneo",
        texto: "Venecia termina negociando la paz y acepta la pérdida de Chipre. La Liga se disuelve y la armada otomana vuelve al mar. Lepanto conserva una enorme importancia militar, política y simbólica, pero su historia es más interesante precisamente cuando se evita el mito de que una sola batalla expulsó a los otomanos del Mediterráneo."
      }
    ]
  },
  {
    id: "puertas-viena",
    titulo: "A las puertas de Viena",
    subtitulo: "La alianza que convirtió un sitio otomano en una contraofensiva europea",
    disponible: true,
    descripcion: "En 1683 una rebelión húngara, la ofensiva de Kara Mustafa y la vulnerabilidad de Viena obligan a Leopoldo I a buscar ayuda. La alianza con Juan III Sobieski y los príncipes del Imperio salva la capital y cambia el sentido de la guerra en Europa central.",
    pasos: [
      {
        anio: 1648,
        persona: "MEHMED4OSM",
        personas: ["IBRAHIM1OSM", "MEHMED4OSM"],
        titulo: "Un sultán niño hereda un imperio que vuelve a avanzar",
        texto: "Mehmed IV llega al trono con sólo seis años. Durante su largo reinado, la familia de grandes visires Köprülü reconstruye la capacidad militar y administrativa otomana. Cuando la crisis de Hungría se agrave, Constantinopla volverá a mirar hacia Viena."
      },
      {
        anio: 1658,
        persona: "LEOP1HRE",
        personas: ["LEOP1HRE", "MEHMED4OSM"],
        titulo: "Leopoldo I gobierna la frontera más peligrosa del Imperio",
        texto: "Leopoldo I es elegido emperador mientras los Habsburgo intentan consolidar Austria, Bohemia y Hungría. Su monarquía limita directamente con el mundo otomano y además debe enfrentarse a conflictos religiosos y políticos dentro de la propia Hungría."
      },
      {
        anio: 1682,
        persona: "IMRETHOKOLY",
        personas: ["IMRETHOKOLY", "LEOP1HRE", "MEHMED4OSM", "KARAMUSTAFA"],
        eventoId: "THOKOLY_1682",
        titulo: "La guerra exterior nace también de una rebelión interior",
        texto: "Imre Thököly encabeza a los kuruc contrarios a los Habsburgo y acepta apoyo otomano. Kara Mustafa puede presentar la intervención como protección de un aliado húngaro, mientras Leopoldo ve cómo una revuelta interna se transforma en una amenaza estratégica sobre Viena."
      },
      {
        anio: 1683,
        persona: "JUAN3SOBIESKI",
        personas: ["LEOP1HRE", "JUAN3SOBIESKI", "PAPA_INOCENCIO11"],
        eventoId: "ALIANZA_VIENA_1683",
        titulo: "Leopoldo y Sobieski prometen acudir el uno al otro",
        texto: "Con mediación de Inocencio XI, el emperador y el rey electo de Polonia pactan una alianza defensiva. Ninguno de los dos puede garantizar por sí solo la seguridad de la frontera: Viena necesitará al ejército polaco y Polonia necesita que Austria siga conteniendo la presión otomana."
      },
      {
        anio: 1683,
        persona: "STARHEMBERG",
        personas: ["KARAMUSTAFA", "MEHMED4OSM", "LEOP1HRE", "STARHEMBERG"],
        eventoId: "SITIO_VIENA_1683",
        titulo: "Kara Mustafa llega antes que los aliados",
        texto: "El ejército otomano alcanza Viena en julio. Leopoldo evacua la ciudad y Starhemberg queda al frente de la guarnición. El tiempo pasa a ser el elemento decisivo: los defensores sólo tienen que resistir hasta que una coalición que todavía está reuniéndose consiga llegar."
      },
      {
        anio: 1683,
        persona: "CHARLES5LOR",
        personas: ["JUAN3SOBIESKI", "CHARLES5LOR", "MAX2EMANBAV", "JOHANNGEORG3SAX", "LEOP1HRE"],
        eventoId: "EJERCITO_SOCORRO_1683",
        titulo: "Un ejército del Imperio se encuentra con el ejército polaco",
        texto: "Carlos V de Lorena coordina las tropas imperiales mientras Baviera, Sajonia y otros príncipes aportan contingentes. Sobieski atraviesa los Cárpatos con los polacos. La operación de socorro reúne monarquía Habsburgo, Mancomunidad y Sacro Imperio en una fuerza común."
      },
      {
        anio: 1683,
        persona: "JUAN3SOBIESKI",
        personas: ["JUAN3SOBIESKI", "LEOP1HRE", "CHARLES5LOR", "STARHEMBERG", "KARAMUSTAFA", "MEHMED4OSM"],
        eventoId: "VIENA_1683",
        titulo: "12 de septiembre: el sitio se rompe desde fuera y desde dentro",
        texto: "El ejército aliado ataca desde las alturas al oeste de Viena mientras Starhemberg mantiene la defensa de la ciudad. Sobieski dirige el conjunto y la carga final de la caballería polaca acelera el colapso de las posiciones de Kara Mustafa. Viena queda liberada y el ejército otomano se retira."
      },
      {
        anio: 1684,
        persona: "LEOP1HRE",
        personas: ["LEOP1HRE", "JUAN3SOBIESKI", "PAPA_INOCENCIO11", "CHARLES5LOR"],
        eventoId: "LIGA_SANTA_1684",
        titulo: "La alianza deja de ser un socorro de emergencia",
        texto: "La victoria permite crear una nueva Liga Santa. Austria, Polonia y Venecia pasan a la ofensiva con apoyo papal. La cuestión ya no es impedir que Viena caiga, sino recuperar territorios de Hungría que llevaban generaciones bajo dominio otomano."
      },
      {
        anio: 1686,
        persona: "CHARLES5LOR",
        personas: ["LEOP1HRE", "CHARLES5LOR", "MAX2EMANBAV", "MEHMED4OSM"],
        eventoId: "BUDA_1686",
        titulo: "Buda demuestra que Viena fue un punto de inflexión",
        texto: "Tres años después, las fuerzas de la coalición conquistan Buda. El avance no terminará allí: la Gran Guerra Turca desplazará la frontera hacia el sudeste y reforzará decisivamente a los Habsburgo. La alianza que se reunió para salvar una capital acaba transformando el mapa de Europa central."
      }
    ]
  },
  {
    id: "ochenta-anos",
    titulo: "De Flandes a la República",
    subtitulo: "La revuelta que quebró el dominio de los Habsburgo en los Países Bajos",
    disponible: false
  },
  {
    id: "guerras-italianas",
    titulo: "El tablero de Italia",
    subtitulo: "Valois, Aragón, Habsburgo y papas por el dominio de la península",
    disponible: false
  },
  {
    id: "corona-demasiado-grande",
    titulo: "Una corona demasiado grande",
    subtitulo: "Los Vasa entre Suecia, Polonia y la guerra de religión",
    disponible: false
  },
  {
    id: "brandeburgo-prusia",
    titulo: "De Brandemburgo a Prusia",
    subtitulo: "Cómo un electorado del Imperio se convirtió en una gran potencia europea",
    disponible: false
  },
  {
    id: "ultimo-austria",
    titulo: "El último Austria",
    subtitulo: "Carlos II, la herencia imposible y la crisis que cambió Europa",
    disponible: false
  },
  {
    id: "estuardo-hannover",
    titulo: "De Estuardo a Hannover",
    subtitulo: "Revolución, religión y una corona que cambia de dinastía",
    disponible: false
  },
  {
    id: "leonor-aquitania",
    titulo: "Leonor de Aquitania: dos coronas y una dinastía",
    subtitulo: "Francia, Inglaterra y la red familiar que creó el mundo Plantagenet",
    disponible: false
  },
  {
    id: "visconti-sforza",
    titulo: "Los Visconti y los Sforza",
    subtitulo: "Milán entre herencia ducal, condotieros y matrimonios",
    disponible: false
  }
];
