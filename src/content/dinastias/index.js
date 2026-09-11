const MEDLANDS='https://fmg.ac/Projects/MedLands/index.htm';
const RAH='https://historia-hispanica.rah.es/';
const BRITANNICA='https://www.britannica.com/';

// A house history is editorial context. Branches and matrimonial transfers are distinct relations.
export const HISTORIA_DINASTIAS = {
  'Capeto': {
    resumen:'Una casa real que se prolongó en numerosas ramas: comprender a los Capeto permite conectar las coronas francesas con Dreux, Évreux, Valois y Borbón.',
    origen:'La dinastía toma su nombre de Hugo Capeto, elegido rey de los francos en 987. Durante los primeros siglos consolidó la continuidad hereditaria de la monarquía. Sus hijos menores recibieron patrimonios que dieron origen a casas propias; compartir ascendencia capeta no significa haber gobernado simultáneamente Francia.',
    trayectoria:'El matrimonio de Felipe IV con Juana I de Navarra vinculó a la línea principal con Navarra y Champaña. Sus hijos reunieron esas herencias, pero en 1328 Francia y Navarra siguieron soluciones sucesorias distintas: Felipe VI inauguró la realeza de los Valois y Juana II recuperó la corona navarra. Las ramas de Dreux y Évreux permiten seguir otros caminos desde la familia real.',
    legado:'La muerte de Carlos IV cerró en 1328 la línea masculina de los reyes capetos directos. La descendencia de la casa continuó en ramas como Valois y Borbón. El final de una línea reinante no equivale a la desaparición de toda su familia.',
    territorios:['Francia','Navarra','Champaña'], protagonistas:['LUIS6FRA','LUIS7FRA','FEL2FRA','LUIS9','FEL4FRA','JUANA2NAV'], fuentes:[MEDLANDS,BRITANNICA],
  },
  'Jimena': {
    resumen:'La línea navarra de los Jimena enlaza el reino pirenaico con la casa condal de Champaña a través de Blanca de Navarra.',
    origen:'La denominación Jimena identifica una extensa tradición dinástica de los reinos peninsulares medievales. Esta ficha se centra en la línea navarra representada en el Atlas, especialmente Sancho VI, Sancho VII y Blanca de Navarra, sin presentar como completa la genealogía anterior.',
    trayectoria:'Sancho VI y Sancho VII gobernaron un reino situado entre Castilla, Aragón y los poderes del norte de los Pirineos. El matrimonio de Blanca de Navarra con Teobaldo III de Champaña creó el vínculo por el que su hijo Teobaldo I accedió al trono navarro. El parentesco explica el derecho sucesorio; los territorios siguieron conservando identidades distintas.',
    legado:'La muerte de Sancho VII en 1234 dio paso a los condes de Champaña en Navarra. La transmisión se produjo por la descendencia de su hermana Blanca, de modo que hubo continuidad familiar aunque cambiara el nombre de la casa reinante.',
    territorios:['Navarra','Champaña'], protagonistas:['SANCHO6NAV','SANCHO7NAV','BLANCANAVCHAMP','TEOB1NAV'], fuentes:[MEDLANDS,RAH],
  },
  'Champaña': {
    resumen:'Una casa condal del norte de Francia que llevó sus conexiones a Navarra, Bretaña y el Mediterráneo oriental.',
    origen:'Los condes de Champaña pertenecían a la tradición familiar de Blois. La denominación territorial utilizada aquí permite seguir a sus miembros sin confundirlos con los Châtillon que gobernaron posteriormente Blois. El Atlas recoge tanto su línea navarra como los enlaces con Jerusalén y Chipre.',
    trayectoria:'Teobaldo III se casó con Blanca de Navarra. Su hijo Teobaldo I heredó Champaña y, en 1234, la corona navarra. Otra hija de Teobaldo I, Blanca de Champaña, se casó con Juan I de Bretaña. Por otra rama, Enrique II de Champaña y su hija Alicia enlazaron la casa con los reinos de Jerusalén y Chipre.',
    legado:'Juana I heredó Navarra y Champaña y se casó con Felipe IV de Francia. Sus hijos pertenecían por nacimiento a la casa capeta. La posterior separación sucesoria de Navarra respecto de Francia muestra por qué una herencia compartida no debe convertirse en una dinastía o territorio únicos.',
    territorios:['Champaña','Navarra','Bretaña','Jerusalén','Chipre'], protagonistas:['TEOB3CHAMP','BLANCANAVCHAMP','TEOB1NAV','BLANCHAMP','JUANA1NAV','ALICECHAMPJER'], fuentes:[MEDLANDS,RAH],
  },
  'Évreux': {
    resumen:'Una rama capeta que convirtió un patrimonio francés en el punto de partida de una prolongada historia regia en Navarra.',
    origen:'Luis de Évreux, hijo de Felipe III de Francia, inició la rama. Su matrimonio con Margarita de Artois la conectó con otra línea emparentada con los Capeto. Felipe de Évreux, hijo de ambos, se casó con Juana II, heredera navarra e hija de Luis X de Francia.',
    trayectoria:'Felipe y Juana gobernaron Navarra desde 1328. Carlos II mantuvo intereses a ambos lados de los Pirineos; Carlos III desarrolló la vida cortesana del reino y quedó vinculado a Olite. Las hijas de la casa extendieron su red: María hacia Aragón, Inés hacia Foix y Juana hacia Bretaña y después Inglaterra.',
    legado:'Blanca I heredó Navarra y se casó con Juan de Aragón. Sus hijos Carlos de Viana, Blanca y Leonor pertenecían a la casa de Trastámara. La herencia navarra pasó más tarde por Leonor a los Foix. La línea familiar continúa a través de mujeres aunque cambie la denominación de la casa.',
    territorios:['Évreux','Navarra','Foix','Bretaña'], protagonistas:['LUISEVREUX','FELIPEVREUX','JUANA2NAV','CARLOS2NAV','CARLOS3NAVAR','BLANCA1NAV'], fuentes:[MEDLANDS,RAH],
  },
  'Foix': {
    resumen:'Un patrimonio pirenaico que reunió condados y vizcondados, cambió de línea familiar y terminó conectado con la corona de Navarra.',
    origen:'La casa condal de Foix desarrolló una red de posesiones y matrimonios en los Pirineos. Roger Bernardo III se casó con Margarita, heredera de Bearne. El condado de Foix y el vizcondado de Bearne conservaron títulos y situaciones políticas propios bajo unos mismos titulares.',
    trayectoria:'Gastón Fébus es uno de sus representantes más conocidos. La muerte de su hijo dejó la continuidad en manos de la rama de Castellbó: primero Mateo y después su hermana Isabel. El matrimonio de Isabel con Archambaud de Grailly inició la continuidad Foix-Grailly. Su nieto Gastón IV se casó con Leonor de Navarra; Francisco Febo y Catalina heredaron posteriormente la corona navarra.',
    legado:'Catalina se casó con Juan de Albret. La herencia pasó a sus descendientes, entre ellos Enrique II y Juana III de Navarra. Otras hijas y ramas enlazaron Foix con Bretaña, Aragón y Hungría. El nombre Foix en el Atlas abarca continuidades patrimoniales que la sección de ramas distingue expresamente.',
    territorios:['Foix','Bearne','Castellbó','Navarra','Bretaña'], protagonistas:['ROGERBERNARD3FOIX','GASTON3FEBUS','ISABELLEFOIX','JOHN1FOIX','GASTON4FOIX','CATALINA1NAV'], fuentes:[MEDLANDS,RAH],
  },
  'Grailly': {
    resumen:'La familia de Archambaud de Grailly permite entender por qué la continuidad de Foix no fue siempre una sucesión dentro de la misma línea masculina.',
    origen:'Los Grailly pertenecían a las redes nobiliarias que conectaban el ámbito saboyano con el suroeste francés. Esta primera ficha se concentra en Archambaud y su enlace con Isabel de Foix-Castellbó, el punto por el que la casa se incorpora al conjunto desarrollado en el Atlas.',
    trayectoria:'Isabel sucedió a su hermano Mateo en 1398. Archambaud participó en el gobierno por su matrimonio, mientras el derecho hereditario procedía de ella. Su hijo Juan I continuó el linaje conocido como Foix-Grailly y lo conectó con los Albret mediante su matrimonio con Juana de Albret.',
    legado:'Los descendientes de esta unión aparecen bajo la denominación Foix por continuidad histórica del patrimonio. El vínculo se presenta como una transmisión matrimonial y patrimonial, no como prueba de que los Grailly fueran una rama masculina de los primeros condes de Foix.',
    territorios:['Foix','Bearne','Francia'], protagonistas:['ARCHAMBAUDGRAILLY','ISABELLEFOIX','JOHN1FOIX','JEANNEALBRETFOIX','GASTON4FOIX'], fuentes:[MEDLANDS],
  },
  'Albret': {
    resumen:'De un señorío del suroeste francés a Navarra: los Albret crecieron mediante servicio político, matrimonios y herencias.',
    origen:'El nombre Albret procede del patrimonio señorial de la casa en el suroeste de Francia. Su historia debe distinguirse de Navarra: gobernar el señorío de Albret no convertía a su titular en rey navarro. Arnaud-Amanieu y su hijo Carlos I representan la conexión entre patrimonio familiar y servicio a la monarquía francesa.',
    trayectoria:'Carlos I murió en Azincourt. Su hija Juana se casó con Juan I de Foix, mientras la continuidad señorial pasó por Carlos II y la descendencia de Juan de Tartas hasta Alain. Juan III, hijo de Alain, se casó con Catalina de Navarra. La conquista de 1512 alteró profundamente la posición de esa pareja, cuya descendencia conservó la monarquía al norte de los Pirineos.',
    legado:'Enrique II y Juana III enlazaron la casa con las transformaciones políticas y religiosas del siglo XVI. El matrimonio de Juana con Antonio de Borbón fue el origen de la posición navarra de su hijo Enrique, futuro Enrique IV de Francia. Carlota de Albret ofrece otra conexión, con los Borja.',
    territorios:['Albret','Navarra','Bearne','Foix','Francia'], protagonistas:['CHARLESDALBRET','CHARLES2ALBRET','ALAINALBRET','JUAN3ALBRET','ENRIQ2NAV','JUANA3NAV'], fuentes:[MEDLANDS,RAH,BRITANNICA],
  },
  'Dreux': {
    resumen:'Una rama capeta que se convirtió en casa ducal bretona y de la que surgieron dos caminos rivales hacia la sucesión de Bretaña.',
    origen:'Roberto I, hijo de Luis VI de Francia, recibió Dreux. Su nieto Pedro se casó con Alix de Thouars, heredera de Bretaña. El acceso bretón procedía de ese matrimonio, mientras la ascendencia masculina de Pedro enlazaba con la casa real francesa.',
    trayectoria:'Juan I y Juan II consolidaron la continuidad ducal. Sus matrimonios con Blanca de Champaña y Beatriz de Inglaterra conectaron Bretaña con Navarra y con los Plantagenet. Arturo II tuvo hijos de dos matrimonios. La descendencia de su hijo Guy de Penthièvre y la de Juan de Montfort quedaron enfrentadas cuando murió Juan III.',
    legado:'La disputa de 1341 abrió una larga guerra. Los Montfort constituyeron una rama de los Dreux y terminaron conservando el ducado, mientras Juana de Penthièvre transmitió su patrimonio por su matrimonio con Carlos de Blois. Las dos líneas deben seguirse por separado.',
    territorios:['Dreux','Bretaña','Penthièvre'], protagonistas:['ROBERT1DREUX','ROBERT2DREUX','PIERRE1BRET','JUAN1BRET','ARTHUR2BRET','JEANNEPENTHIEVRE'], fuentes:[MEDLANDS,BRITANNICA],
  },
  'Montfort': {
    resumen:'La rama bretona de los Montfort pasó de disputar el ducado a mantenerlo durante varias generaciones, hasta Ana de Bretaña.',
    origen:'Juan de Montfort era hijo de Arturo II de Bretaña y de Yolanda de Dreux. Su línea era una rama de los duques de la casa de Dreux. La denominación Montfort utilizada en esta ficha se refiere a esa rama bretona; no identifica automáticamente a todos los linajes que compartieron el topónimo.',
    trayectoria:'Juan reclamó el ducado en 1341. Su esposa Juana de Flandes defendió su causa y la de su hijo. Tras la victoria de Juan IV, la continuidad pasó a sus hijos y nietos. Los matrimonios de Juana de Navarra, Margarita de Orleans y Margarita de Foix conectan esta rama con tres de los principales conjuntos familiares de la actualización.',
    legado:'Francisco II dejó como heredera a Ana. Sus matrimonios con Carlos VIII y Luis XII vincularon el ducado a la monarquía francesa, pero conservaron una historia jurídica propia. Claudia, hija de Ana, prolongó la transmisión. La unión de 1532 es un hecho posterior a la muerte de Ana y no debe adelantarse a su primer matrimonio.',
    territorios:['Bretaña','Francia','Navarra'], protagonistas:['JOHNMONTPRET','JEANNEFLANDERSBRET','JOHN4BRET','JUAN6BRET','FRANCOIS2BRET','ANABRET'], fuentes:[MEDLANDS,BRITANNICA],
  },
  'Châtillon': {
    resumen:'Una casa con varias ramas cuya conexión bretona se explica por el matrimonio de Carlos de Blois con Juana de Penthièvre.',
    origen:'Châtillon designa una casa nobiliaria francesa con ramas y patrimonios distintos. Los titulares de Blois de esta familia no deben confundirse con los condes de la antigua casa de Blois-Champaña. La ficha se centra en los enlaces representados en la base y, especialmente, en el conjunto bretón.',
    trayectoria:'Carlos de Blois defendió los derechos de su esposa Juana al ducado de Bretaña. Su hija María se casó con Luis I de Anjou, creando un camino entre la disputa bretona y la expansión angevina. Más tarde, Françoise de Châtillon se casó con Alain de Albret y fue madre de Juan III de Navarra y Carlota de Albret.',
    legado:'Una misma denominación familiar reúne ramas cuya conexión intermedia puede no estar todavía incorporada al árbol. Las fichas muestran los parentescos registrados y evitan convertir esa coincidencia nominal en una cadena genealógica inventada.',
    territorios:['Bretaña','Penthièvre','Francia','Navarra'], protagonistas:['CHARLESBLOIS','JEANNEPENTHIEVRE','MARIEBLOIS','FRANCOISECHATILLON','JUAN3ALBRET'], fuentes:[MEDLANDS],
  },
  'Valois': {
    resumen:'Una rama capeta que gobernó Francia y cuyas alianzas conectan la realeza francesa con Bretaña, Foix y Navarra.',
    origen:'Carlos de Valois, hijo de Felipe III, dio nombre a la rama. Su hijo Felipe VI accedió a la corona francesa en 1328. Las líneas de Orleans, Angulema, Borgoña y otras derivaciones conservaron denominaciones propias que ayudan a seguir su evolución.',
    trayectoria:'La casa atravesó la Guerra de los Cien Años y las luchas entre sus ramas. Juana de Francia se casó con el duque de Bretaña; Magdalena de Francia fue madre de Francisco Febo y Catalina de Navarra. Las ramas de Orleans y Angulema reunieron después derechos que conectaban Francia, Bretaña e Italia.',
    legado:'La línea reinante de los Valois terminó con Enrique III en 1589. Enrique de Borbón, rey de Navarra, accedió entonces a la corona francesa. El parentesco remoto entre ambas casas debe distinguirse de los matrimonios más próximos que habían conectado sus cortes.',
    territorios:['Francia','Valois','Bretaña','Navarra'], protagonistas:['CARLOSVAL','FEL6FRA','CARLOS5FRA','JUANAFRABRET','MAGDALENAFRA','LUIS11FRA'], fuentes:[MEDLANDS,BRITANNICA],
  },
  'Borbón': {
    resumen:'Una rama capeta cuya conexión con los Albret convirtió al rey de Navarra en heredero de la corona francesa.',
    origen:'La casa capeta de Borbón procede de Roberto de Clermont, hijo de Luis IX, y de su matrimonio con Beatriz de Borbón. La denominación territorial también puede aparecer en miembros de la familia señorial anterior; no basta compartir el nombre para afirmar una misma filiación masculina.',
    trayectoria:'La descendencia se distribuyó entre varias ramas. La línea de Vendôme llevó a Antonio de Borbón, esposo de Juana III de Navarra. Su hijo Enrique heredó Navarra por su madre y alcanzó la corona francesa en 1589 por su posición en la sucesión capeta. El origen de cada derecho fue distinto.',
    legado:'Los Borbones prolongaron su presencia en varias monarquías europeas. Esta ficha se centra en el origen medieval y la conexión navarra; las personas de otras ramas siguen disponibles en el catálogo y en el árbol. No se presenta el fin de un reinado como la extinción de la casa.',
    territorios:['Borbón','Vendôme','Navarra','Francia'], protagonistas:['ROB1CLER','LUIS1BOR','PEDRO1BOR','CARLOSVENDOME','ANTONIOBORBON','ENRIQ4FRA'], fuentes:[MEDLANDS,RAH,BRITANNICA],
  },
};

export {DINASTIA_ALIASES} from '../../data/dynastyAliases.js';
export const TIPOS_RAMAS = {
  rama_cadete:'Rama cadete',
  establecimiento:'Establecimiento de una rama',
  continuidad_patrimonial:'Continuidad por matrimonio y herencia',
  acceso_corona:'Acceso a una corona',
};

export const RAMAS_DINASTICAS = [
  {id:'dreux-capeta',origen:'Capeto',destino:'Dreux',tipo:'rama_cadete',periodo:'1137',fundador:'ROBERT1DREUX',personas:['LUIS6FRA','LUIS7FRA','ROBERT1DREUX','ROBERT2DREUX','PIERRE1BRET'],texto:'Roberto I, hijo menor de Luis VI, recibió Dreux. La casa conserva una ascendencia capeta aunque sus titulares no fueran reyes de Francia.'},
  {id:'evreux-capeta',origen:'Capeto',destino:'Évreux',tipo:'rama_cadete',periodo:'Finales del siglo XIII',fundador:'LUISEVREUX',personas:['LUISEVREUX','FELIPEVREUX','CARLOS2NAV','CARLOS3NAVAR'],texto:'Luis, hijo de Felipe III, inicia la rama de Évreux. El matrimonio de su hijo Felipe con Juana II incorpora la conexión regia navarra.'},
  {id:'valois-capeta',origen:'Capeto',destino:'Valois',tipo:'rama_cadete',periodo:'Siglos XIII–XIV',fundador:'CARLOSVAL',personas:['CARLOSVAL','FEL6FRA','JUAN2FRA'],texto:'Carlos de Valois, hermano de Felipe IV, dio nombre a la rama. Su hijo Felipe VI accedió al trono en 1328.'},
  {id:'borbon-capeta',origen:'Capeto',destino:'Borbón',tipo:'rama_cadete',periodo:'Siglos XIII–XIV',fundador:'ROB1CLER',personas:['ROB1CLER','LUIS1BOR','PEDRO1BOR'],texto:'Roberto de Clermont, hijo de Luis IX, se casó con Beatriz de Borbón. La rama capeta tomó el nombre del patrimonio de ella.'},
  {id:'dreux-bretana',origen:'Dreux',destino:'Dreux',tipo:'establecimiento',periodo:'1213',fundador:'PIERRE1BRET',personas:['PIERRE1BRET','ALIXTHOUARS','JUAN1BRET','JUAN2BRET','ARTHUR2BRET'],texto:'Pedro de Dreux se casó con Alix de Thouars. El derecho al ducado procedía de Alix; la nueva línea ducal conservó la ascendencia masculina de Dreux.'},
  {id:'montfort-bretana',origen:'Dreux',destino:'Montfort',tipo:'rama_cadete',periodo:'Siglo XIV',fundador:'JOHNMONTPRET',personas:['JOHNMONTPRET','JOHN4BRET','JUAN6BRET','ARTURO3BRET','FRANCOIS2BRET','ANABRET'],texto:'Juan de Montfort fue hijo de Arturo II y de su segunda esposa, Yolanda de Dreux. Sus descendientes constituyeron la rama ducal de Montfort.'},
  {id:'chatillon-penthievre',origen:'Dreux',destino:'Châtillon',tipo:'continuidad_patrimonial',periodo:'1337',fundador:'CHARLESBLOIS',personas:['GUYPENTHIEVRE','JEANNEPENTHIEVRE','CHARLESBLOIS','MARIEBLOIS'],texto:'Juana, nieta de Arturo II por Guy de Penthièvre, se casó con Carlos de Blois. Los derechos bretones procedían de Juana; Carlos pertenecía a Châtillon.'},
  {id:'foix-castellbo',origen:'Foix',destino:'Foix',tipo:'rama_cadete',periodo:'Siglo XIV',fundador:'ROGERBERNARD1CASTEL',personas:['ROGERBERNARD1CASTEL','ROGERBERNARD2CASTEL','MATTHIEUFOIX','ISABELLEFOIX'],texto:'Roger Bernardo I de Castellbó, hijo de Gastón I, representa la línea colateral de la que procedían Mateo e Isabel. Esta rama heredó tras la muerte de Fébus.'},
  {id:'foix-grailly',origen:'Grailly',destino:'Foix',tipo:'continuidad_patrimonial',periodo:'1398',fundador:'ARCHAMBAUDGRAILLY',personas:['ISABELLEFOIX','ARCHAMBAUDGRAILLY','JOHN1FOIX','GASTON4FOIX'],texto:'Isabel de Foix-Castellbó heredó el patrimonio y lo transmitió a la descendencia de su matrimonio con Archambaud. Foix-Grailly describe esta continuidad; Grailly no se convierte por ello en una rama masculina de los antiguos Foix.'},
  {id:'foix-navarra',origen:'Foix',destino:'Foix',tipo:'acceso_corona',periodo:'1479',fundador:'FRANCISCOFEBONAV',personas:['GASTON4FOIX','LEONOR1NAV','GASTONVIANA','FRANCISCOFEBONAV','CATALINA1NAV'],texto:'El matrimonio de Gastón IV con Leonor de Navarra conectó ambas herencias. Francisco Febo sucedió a su abuela Leonor; su padre había muerto antes que ella.'},
  {id:'albret-navarra',origen:'Foix',destino:'Albret',tipo:'continuidad_patrimonial',periodo:'1484',fundador:'JUAN3ALBRET',personas:['CATALINA1NAV','JUAN3ALBRET','ENRIQ2NAV','JUANA3NAV'],texto:'Catalina era la heredera navarra y Juan pertenecía a Albret. Sus descendientes reunieron derechos de ambas familias, sin convertir Albret y Navarra en un único territorio.'},
  {id:'borbon-navarra',origen:'Albret',destino:'Borbón',tipo:'continuidad_patrimonial',periodo:'1548',fundador:'ANTONIOBORBON',personas:['JUANA3NAV','ANTONIOBORBON','ENRIQ4FRA'],texto:'El matrimonio de Juana de Albret con Antonio de Borbón explica la herencia navarra de Enrique IV. Sus derechos franceses procedían de su ascendencia capeta por otra vía.'},
].map(rama=>({...rama,fuentes:[MEDLANDS]}));
