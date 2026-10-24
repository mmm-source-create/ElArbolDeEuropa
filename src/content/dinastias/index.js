import {TREINTA_CASAS} from './treinta-casas.js';
import {ANJOU_HUNGARY_HISTORY} from './anjou-hungria.js';
import {CONEXIONES_CASAS} from './conexiones-casas.js';
import {CASAS_ADRIATICO,CONEXIONES_ADRIATICO} from "./adriatico-v214.js";
import {CASAS_ALPINAS,RAMAS_ALPINAS} from "./alpes-v213.js";
import {CASAS_ESCANDINAVAS,CONEXIONES_ESCANDINAVAS} from "./escandinavia-v212.js";
import {CASAS_V521} from "./grandes-casas-v521.js";
import {CASAS_V523} from "./casas-v523.js";
import {CASAS_V534} from "./casas-v534.js";
import {CASAS_REVISION_CAPETA,RAMAS_REVISION_CAPETA} from './revision-capeta.js';
import {ASCANIA_HISTORY} from './ascania.js';
import {CASAS_AMPLIACION_EDITORIAL} from './ampliacion-editorial.js';
import {PORTUGAL_HOUSE_HISTORY,PORTUGAL_HOUSE_SOURCES,BRETON_HOUSE_SOURCE} from './heraldica-y-casas.js';
const MEDLANDS='https://fmg.ac/Projects/MedLands/index.htm';
const RAH='https://historia-hispanica.rah.es/';
const BRITANNICA='https://www.britannica.com/';

// A house history is editorial context. Branches and matrimonial transfers are distinct relations.
export const HISTORIA_DINASTIAS = {
  ...TREINTA_CASAS,
  'Anjou-Hungría':ANJOU_HUNGARY_HISTORY,
  ...CASAS_AMPLIACION_EDITORIAL,
  Ascania:ASCANIA_HISTORY,
  'Borgoña-Portugal':PORTUGAL_HOUSE_HISTORY,
  ...CASAS_ESCANDINAVAS,
  ...CASAS_ALPINAS,
  ...CASAS_ADRIATICO,
  ...CASAS_V521,
  ...CASAS_V523,
  ...CASAS_V534,
  ...CASAS_REVISION_CAPETA,
  'Capeto': {
    resumen:'De Hugo Capeto a Carlos IV, la línea real directa articuló la monarquía francesa; sus descendientes y ramas continuaron en Dreux, Évreux, Valois y Borbón.',
    origen:'Hugo Capeto fue elegido rey de los francos en 987. La continuidad de padre a hijo se consolidó gradualmente en un reino compuesto por numerosos principados con amplios poderes propios. Luis VI y Luis VII reforzaron la monarquía. Roberto, hijo de Luis VI, abrió la rama de Dreux.',
    trayectoria:'Felipe II amplió el dominio real y conquistó Normandía entre 1202 y 1204. Luis VIII sucedió en 1223 y su hijo Luis IX reinó desde 1226, primero bajo la regencia de Blanca de Castilla. Felipe III y Felipe IV prolongaron la línea. El matrimonio de Felipe IV con Juana I de Navarra reunió en sus descendientes las coronas de Francia y Navarra y el patrimonio de Champaña, que conservaron instituciones y derechos propios.',
    legado:'Luis X murió en 1316. Su hijo póstumo Juan I vivió pocos días. Después ocuparon la corona Felipe V y Carlos IV, hermanos de Luis X. Al morir Carlos IV en 1328 se extinguió la línea masculina de los reyes capetos directos: Felipe VI de Valois accedió a Francia y Juana II, hija de Luis X, a Navarra. Las ramas de Évreux, Valois y Borbón prolongaron la historia de la familia.',
    territorios:['Francia','Navarra','Champaña'], protagonistas:['LUIS6FRA','LUIS7FRA','FEL2FRA','LUIS8FRA','LUIS9','FEL3FRA','FEL4FRA','LUIS10FRA','FEL5FRA','CARLOS4FRA','JUANA2NAV'], fuentes:[MEDLANDS,'https://catalogue.bnf.fr/ark:/12148/cb11958988j','https://francearchives.gouv.fr/fr/facomponent/99021b3b7153c3d2ac6535e7392a4a520f017001',BRITANNICA],
  },
  'Jimena': {
    resumen:'La línea navarra de los Jimena enlaza el reino pirenaico con la casa condal de Champaña a través de Blanca de Navarra.',
    origen:'Los Jimena gobernaron varios reinos peninsulares durante la Edad Media. En Navarra, Sancho VI, Sancho VII y Blanca de Navarra protagonizaron las últimas generaciones antes de la sucesión de los condes de Champaña.',
    trayectoria:'Sancho VI y Sancho VII gobernaron un reino situado entre Castilla, Aragón y los poderes del norte de los Pirineos. El matrimonio de Blanca de Navarra con Teobaldo III de Champaña dio a su hijo Teobaldo I los derechos por los que accedió al trono navarro.',
    legado:'La muerte de Sancho VII en 1234 dio paso a los condes de Champaña en Navarra. La transmisión se produjo por la descendencia de su hermana Blanca, de modo que hubo continuidad familiar aunque cambiara el nombre de la casa reinante.',
    territorios:['Navarra','Champaña'], protagonistas:['SANCHO6NAV','SANCHO7NAV','BLANCANAVCHAMP','TEOB1NAV'], fuentes:[MEDLANDS,RAH],
  },
  'Champaña': {
    resumen:'Una casa condal del norte de Francia que llevó sus conexiones a Navarra, Bretaña y el Mediterráneo oriental.',
    origen:'Los condes de Champaña pertenecían a la casa de Blois. Sus matrimonios los conectaron con Navarra, Bretaña, Jerusalén y Chipre.',
    trayectoria:'Teobaldo III se casó con Blanca de Navarra. Su hijo Teobaldo I heredó Champaña y, en 1234, la corona navarra. Otra hija de Teobaldo I, Blanca de Champaña, se casó con Juan I de Bretaña. Por otra rama, Enrique II de Champaña y su hija Alicia enlazaron la casa con los reinos de Jerusalén y Chipre.',
    legado:'Juana I heredó Navarra y Champaña y se casó con Felipe IV de Francia. Sus hijos reunieron las coronas francesa y navarra. En 1328 Juana II heredó Navarra, mientras Felipe VI de Valois sucedió en Francia.',
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
    legado:'Catalina se casó con Juan de Albret. La herencia pasó a sus descendientes, entre ellos Enrique II y Juana III de Navarra. Otras hijas y ramas enlazaron Foix con Bretaña, Aragón y Hungría.',
    territorios:['Foix','Bearne','Castellbó','Navarra','Bretaña'], protagonistas:['ROGERBERNARD3FOIX','GASTON3FEBUS','ISABELLEFOIX','JOHN1FOIX','GASTON4FOIX','CATALINA1NAV'], fuentes:[MEDLANDS,RAH],
  },
  'Grailly': {
    resumen:'Una familia de origen saboyano cuya alianza con los Foix-Castellbó dio origen a la continuidad Foix-Grailly.',
    origen:'Los Grailly pertenecían a las redes nobiliarias que conectaban el ámbito saboyano con el suroeste francés. El matrimonio de Archambaud con Isabel de Foix-Castellbó vinculó la familia con los condados y vizcondados pirenaicos.',
    trayectoria:'Isabel sucedió a su hermano Mateo en 1398. Archambaud participó en el gobierno por su matrimonio, mientras el derecho hereditario procedía de ella. Su hijo Juan I continuó el linaje conocido como Foix-Grailly y lo conectó con los Albret mediante su matrimonio con Juana de Albret.',
    legado:'Isabel transmitió el patrimonio de Foix a sus hijos con Archambaud. La nueva línea, conocida como Foix-Grailly, conservó el nombre y los derechos de la casa materna y extendió sus enlaces hasta la corona de Navarra.',
    territorios:['Foix','Bearne','Francia'], protagonistas:['ARCHAMBAUDGRAILLY','ISABELLEFOIX','JOHN1FOIX','JEANNEALBRETFOIX','GASTON4FOIX'], fuentes:[MEDLANDS],
  },
  'Albret': {
    resumen:'De un señorío del suroeste francés a Navarra: los Albret crecieron mediante servicio político, matrimonios y herencias.',
    origen:'El nombre Albret procede del patrimonio señorial de la casa en el suroeste de Francia. Arnaud-Amanieu y su hijo Carlos I ampliaron la posición familiar mediante el servicio a la monarquía francesa. La conexión con la corona navarra llegó varias generaciones después.',
    trayectoria:'Carlos I murió en Azincourt. Su hija Juana se casó con Juan I de Foix, mientras la continuidad señorial pasó por Carlos II y la descendencia de Juan de Tartas hasta Alain. Juan III, hijo de Alain, se casó con Catalina de Navarra. La conquista de 1512 alteró profundamente la posición de esa pareja, cuya descendencia conservó la monarquía al norte de los Pirineos.',
    legado:'Enrique II y Juana III enlazaron la casa con las transformaciones políticas y religiosas del siglo XVI. El matrimonio de Juana con Antonio de Borbón fue el origen de la posición navarra de su hijo Enrique, futuro Enrique IV de Francia. Carlota de Albret ofrece otra conexión, con los Borja.',
    territorios:['Albret','Navarra','Bearne','Foix','Francia'], protagonistas:['CHARLESDALBRET','CHARLES2ALBRET','ALAINALBRET','JUAN3ALBRET','ENRIQ2NAV','JUANA3NAV'], fuentes:[MEDLANDS,RAH,BRITANNICA],
  },
  'Dreux': {
    resumen:'Una rama capeta que se convirtió en casa ducal bretona y de la que surgieron dos caminos rivales hacia la sucesión de Bretaña.',
    origen:'Roberto I, hijo de Luis VI de Francia, recibió Dreux. Su nieto Pedro se casó con Alix de Thouars, heredera de Bretaña. El acceso bretón procedía de ese matrimonio, mientras la ascendencia masculina de Pedro enlazaba con la casa real francesa.',
    trayectoria:'Juan I y Juan II consolidaron la continuidad ducal. Sus matrimonios con Blanca de Champaña y Beatriz de Inglaterra conectaron Bretaña con Navarra y con los Plantagenet. Arturo II tuvo hijos de dos matrimonios. La descendencia de su hijo Guy de Penthièvre y la de Juan de Montfort quedaron enfrentadas cuando murió Juan III.',
    legado:'La disputa de 1341 abrió una larga guerra. Los Montfort, rama de los Dreux, conservaron el ducado tras la victoria de Auray en 1364. Juana de Penthièvre transmitió su patrimonio a la descendencia de su matrimonio con Carlos de Blois.',
    territorios:['Dreux','Bretaña','Penthièvre'], protagonistas:['ROBERT1DREUX','ROBERT2DREUX','PIERRE1BRET','JUAN1BRET','ARTHUR2BRET','JEANNEPENTHIEVRE'], fuentes:[MEDLANDS,BRITANNICA],
  },
  'Montfort-Bretaña': {
    resumen:'La rama bretona de los Montfort pasó de disputar el ducado a mantenerlo durante varias generaciones, hasta Ana de Bretaña.',
    origen:'Juan de Montfort era hijo de Arturo II de Bretaña y de Yolanda de Dreux. Su línea formaba parte de los duques de la casa de Dreux, de ascendencia capeta, y recibió el nombre del condado de Montfort heredado de Yolanda.',
    trayectoria:'Juan reclamó el ducado en 1341. Su esposa Juana de Flandes defendió su causa y la de su hijo. Tras la victoria de Juan IV, la continuidad pasó a sus hijos y nietos. Los matrimonios con Juana de Navarra, Margarita de Orleans y Margarita de Foix ampliaron los vínculos de la corte bretona.',
    legado:'Francisco II dejó como heredera a Ana. Sus matrimonios con Carlos VIII y Luis XII vincularon el ducado a la monarquía francesa. Claudia, hija de Ana, prolongó la transmisión. Tras la muerte de ambas, la unión de 1532 incorporó Bretaña al reino de Francia con garantías para sus instituciones.',
    territorios:['Bretaña','Francia','Navarra'], protagonistas:['JOHNMONTPRET','JEANNEFLANDERSBRET','JOHN4BRET','JUAN6BRET','FRANCOIS2BRET','ANABRET'], fuentes:[MEDLANDS,BRETON_HOUSE_SOURCE],
  },
  'Châtillon': {
    resumen:'Una casa con varias ramas cuya conexión bretona se explica por el matrimonio de Carlos de Blois con Juana de Penthièvre.',
    origen:'Los Châtillon fueron una casa nobiliaria francesa con varias ramas. Una de ellas heredó el condado de Blois y se vinculó con la sucesión ducal de Bretaña a través de Carlos de Blois.',
    trayectoria:'Carlos de Blois defendió los derechos de su esposa Juana al ducado de Bretaña. Su hija María se casó con Luis I de Anjou, creando un camino entre la disputa bretona y la expansión angevina. Más tarde, Françoise de Châtillon se casó con Alain de Albret y fue madre de Juan III de Navarra y Carlota de Albret.',
    legado:'Los enlaces de los Châtillon-Penthièvre transmitieron patrimonios y derechos sucesorios hacia los Valois-Anjou y los Albret. La descendencia de Françoise llegó a reinar en Navarra y conservó intereses a ambos lados de los Pirineos.',
    territorios:['Bretaña','Penthièvre','Francia','Navarra'], protagonistas:['CHARLESBLOIS','JEANNEPENTHIEVRE','MARIEBLOIS','FRANCOISECHATILLON','JUAN3ALBRET'], fuentes:[MEDLANDS],
  },
  'Valois': {
    resumen:'Una rama capeta que gobernó Francia y cuyas alianzas conectan la realeza francesa con Bretaña, Foix y Navarra.',
    origen:'Carlos de Valois, hijo de Felipe III, dio nombre a la rama. Su hijo Felipe VI accedió a la corona francesa en 1328. Las líneas de Orleans, Angulema, Borgoña y otras derivaciones conservaron denominaciones propias que ayudan a seguir su evolución.',
    trayectoria:'La casa atravesó la Guerra de los Cien Años y las luchas entre sus ramas. Juana de Francia se casó con el duque de Bretaña; Magdalena de Francia fue madre de Francisco Febo y Catalina de Navarra. Las ramas de Orleans y Angulema reunieron después derechos que conectaban Francia, Bretaña e Italia.',
    legado:'La línea reinante de los Valois terminó con Enrique III en 1589. Enrique de Borbón, rey de Navarra y descendiente de Luis IX por la rama de Roberto de Clermont, accedió entonces a la corona francesa.',
    territorios:['Francia','Valois','Bretaña','Navarra'], protagonistas:['CARLOSVAL','FEL6FRA','CARLOS5FRA','JUANAFRABRET','MAGDALENAFRA','LUIS11FRA'], fuentes:[MEDLANDS,BRITANNICA],
  },
  'Borbón': {
    resumen:'Una rama capeta cuya conexión con los Albret convirtió al rey de Navarra en heredero de la corona francesa.',
    origen:'La casa capeta de Borbón procede de Roberto de Clermont, hijo de Luis IX, y de su matrimonio con Beatriz, heredera de Borbón. Sus descendientes recibieron el nombre del patrimonio de ella y extendieron sus ramas por Francia.',
    trayectoria:'La descendencia se distribuyó entre varias ramas. La línea de Vendôme llevó a Antonio de Borbón, esposo de Juana III de Navarra. Su hijo Enrique heredó Navarra por su madre y alcanzó la corona francesa en 1589 por su posición en la sucesión capeta.',
    legado:'Los Borbones prolongaron su presencia en varias monarquías europeas. La rama francesa dio origen a las líneas reinantes de España, Nápoles, Sicilia y Parma, mientras Condé y Orleans conservaron sus propios patrimonios y alianzas.',
    territorios:['Borbón','Vendôme','Navarra','Francia'], protagonistas:['ROB1CLER','LUIS1BOR','PEDRO1BOR','CARLOSVENDOME','ANTONIOBORBON','ENRIQ4FRA'], fuentes:[MEDLANDS,RAH,BRITANNICA],
  },
};

export {DINASTIA_ALIASES} from '../../data/dynastyAliases.js';
export const TIPOS_RAMAS = {
  alianza_matrimonial:'Alianza matrimonial',
  rama_cadete:'Rama cadete',
  establecimiento:'Establecimiento de una rama',
  continuidad_patrimonial:'Continuidad por matrimonio y herencia',
  acceso_corona:'Acceso a una corona',
};

export const RAMAS_DINASTICAS = [
  ...CONEXIONES_CASAS,
  ...RAMAS_REVISION_CAPETA,
  {id:'borgona-portugal-avis',origen:'Borgoña-Portugal',destino:'Avís',tipo:'rama_cadete',periodo:'1385',fundador:'JUAN1PORT',personas:['PED1PORT','JUAN1PORT','EDU1PORT'],texto:'Juan I de Avís era hijo natural de Pedro I de Portugal. Su elección en 1385 inauguró otra casa reinante dentro de la descendencia de la primera dinastía portuguesa.',fuentes:[PORTUGAL_HOUSE_SOURCES[3]]},
  ...CONEXIONES_ADRIATICO,
  {id:'dreux-capeta',origen:'Capeto',destino:'Dreux',tipo:'rama_cadete',periodo:'1137',fundador:'ROBERT1DREUX',personas:['LUIS6FRA','LUIS7FRA','ROBERT1DREUX','ROBERT2DREUX','PIERRE1BRET'],texto:'Roberto I, hijo menor de Luis VI, recibió Dreux. Sus descendientes formaron una rama de los Capeto; su nieto Pedro enlazó con la heredera de Bretaña.'},
  {id:'evreux-capeta',origen:'Capeto',destino:'Évreux',tipo:'rama_cadete',periodo:'Finales del siglo XIII',fundador:'LUISEVREUX',personas:['LUISEVREUX','FELIPEVREUX','CARLOS2NAV','CARLOS3NAVAR'],texto:'Luis, hijo de Felipe III, inicia la rama de Évreux. El matrimonio de su hijo Felipe con Juana II incorpora la conexión regia navarra.'},
  {id:'valois-capeta',origen:'Capeto',destino:'Valois',tipo:'rama_cadete',periodo:'Siglos XIII–XIV',fundador:'CARLOSVAL',personas:['CARLOSVAL','FEL6FRA','JUAN2FRA'],texto:'Carlos de Valois, hermano de Felipe IV, dio nombre a la rama. Su hijo Felipe VI accedió al trono en 1328.'},
  {id:'borbon-capeta',origen:'Capeto',destino:'Borbón',tipo:'rama_cadete',periodo:'Siglos XIII–XIV',fundador:'ROB1CLER',personas:['ROB1CLER','LUIS1BOR','PEDRO1BOR'],texto:'Roberto de Clermont, hijo de Luis IX, se casó con Beatriz de Borbón. La rama capeta tomó el nombre del patrimonio de ella.'},
  {id:'dreux-bretana',origen:'Dreux',destino:'Dreux',tipo:'establecimiento',periodo:'1213',fundador:'PIERRE1BRET',personas:['PIERRE1BRET','ALIXTHOUARS','JUAN1BRET','JUAN2BRET','ARTHUR2BRET'],texto:'Pedro de Dreux se casó con Alix de Thouars. El derecho al ducado procedía de Alix; la nueva línea ducal conservó la ascendencia masculina de Dreux.'},
  {id:'montfort-bretana',origen:'Dreux',destino:'Montfort-Bretaña',tipo:'rama_cadete',periodo:'Siglo XIV',fundador:'JOHNMONTPRET',personas:['JOHNMONTPRET','JOHN4BRET','JUAN6BRET','ARTURO3BRET','FRANCOIS2BRET','ANABRET'],texto:'Juan de Montfort fue hijo de Arturo II y de su segunda esposa, Yolanda de Dreux. Sus descendientes constituyeron la rama ducal de Montfort.'},
  {id:'chatillon-penthievre',origen:'Dreux',destino:'Châtillon',tipo:'continuidad_patrimonial',periodo:'1337',fundador:'CHARLESBLOIS',personas:['GUYPENTHIEVRE','JEANNEPENTHIEVRE','CHARLESBLOIS','MARIEBLOIS'],texto:'Juana, nieta de Arturo II por Guy de Penthièvre, se casó con Carlos de Blois. Los derechos bretones procedían de Juana; Carlos pertenecía a Châtillon.'},
  {id:'foix-castellbo',origen:'Foix',destino:'Foix',tipo:'rama_cadete',periodo:'Siglo XIV',fundador:'ROGERBERNARD1CASTEL',personas:['ROGERBERNARD1CASTEL','ROGERBERNARD2CASTEL','MATTHIEUFOIX','ISABELLEFOIX'],texto:'Roger Bernardo I de Castellbó, hijo de Gastón I, representa la línea colateral de la que procedían Mateo e Isabel. Esta rama heredó tras la muerte de Fébus.'},
  {id:'foix-grailly',origen:'Grailly',destino:'Foix',tipo:'continuidad_patrimonial',periodo:'1398',fundador:'ARCHAMBAUDGRAILLY',personas:['ISABELLEFOIX','ARCHAMBAUDGRAILLY','JOHN1FOIX','GASTON4FOIX'],texto:'Isabel de Foix-Castellbó heredó el patrimonio y lo transmitió a los hijos de su matrimonio con Archambaud de Grailly. Su hijo Juan I continuó la línea conocida como Foix-Grailly.'},
  {id:'foix-navarra',origen:'Foix',destino:'Foix',tipo:'acceso_corona',periodo:'1479',fundador:'FRANCISCOFEBONAV',personas:['GASTON4FOIX','LEONOR1NAV','GASTONVIANA','FRANCISCOFEBONAV','CATALINA1NAV'],texto:'El matrimonio de Gastón IV con Leonor de Navarra conectó ambas herencias. Francisco Febo sucedió a su abuela Leonor; su padre había muerto antes que ella.'},
  {id:'albret-navarra',origen:'Foix',destino:'Albret',tipo:'continuidad_patrimonial',periodo:'1484',fundador:'JUAN3ALBRET',personas:['CATALINA1NAV','JUAN3ALBRET','ENRIQ2NAV','JUANA3NAV'],texto:'Catalina, heredera de Navarra, se casó con Juan de Albret. Sus descendientes reunieron la corona navarra y los patrimonios de ambas familias.'},
  {id:'borbon-navarra',origen:'Albret',destino:'Borbón',tipo:'continuidad_patrimonial',periodo:'1548',fundador:'ANTONIOBORBON',personas:['JUANA3NAV','ANTONIOBORBON','ENRIQ4FRA'],texto:'El matrimonio de Juana de Albret con Antonio de Borbón explica la herencia navarra de Enrique IV. Sus derechos franceses procedían de su ascendencia capeta por otra vía.'},
].map(rama=>({...rama,fuentes:rama.fuentes||[MEDLANDS]})).concat(CONEXIONES_ESCANDINAVAS,RAMAS_ALPINAS);
