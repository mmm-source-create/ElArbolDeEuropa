// Contexto de las casas representadas; los protagonistas son registros reales
// del Atlas. Una sucesión patrimonial no implica una misma línea masculina.
const T = slug => `https://www.treccani.it/enciclopedia/${slug}`;
export const CASAS_AMPLIACION_EDITORIAL = {
  Toulouse: {
    resumen:'La casa condal de Tolosa articuló un gran poder en Occitania y proyectó una rama hacia Trípoli. La cruzada albigense y la sucesión de 1271 transformaron sus dominios.',
    origen:'La dinastía raimundina se consolidó en el ámbito de Tolosa y Rouergue durante la Edad Media. Su patrimonio creció mediante herencias, alianzas y derechos señoriales de distinta naturaleza.',
    trayectoria:'Raimundo VI y Raimundo VII afrontaron la cruzada albigense y la intervención de la monarquía francesa. La paz de 1229 redujo el poder del segundo y dispuso el matrimonio de su hija Juana con Alfonso de Poitiers, hermano de Luis IX. En el Mediterráneo oriental, Raimundo III de Trípoli representa otra trayectoria de la casa.',
    legado:'Juana heredó Tolosa en 1249. Su muerte y la de Alfonso sin descendencia en 1271 permitieron la incorporación del condado al dominio real francés. La cruz occitana siguió identificando a Tolosa y al Languedoc, más allá del fin de esta línea condal.',
    territorios:['Toulouse','Trípoli'],protagonistas:['RAMON6TOLOSA','RAMON7TOLOSA','RAYMOND3TRIPOLI'],
    fuentes:['https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-tolosa','https://www.enciclopedia.cat/gran-enciclopedia-catalana/comtat-de-tripoli'],
  },
  Butler: {
    resumen:'De un oficio hereditario al servicio del señor de Irlanda nació una de las principales casas angloirlandesas, vinculada al condado de Ormond y al castillo de Kilkenny.',
    origen:'Theobald Walter recibió el oficio de chief butler de Irlanda a finales del siglo XII. Sus descendientes adoptaron el nombre Butler y construyeron una extensa red de posesiones y matrimonios.',
    trayectoria:'El título de conde de Ormond fue concedido en 1328. Kilkenny se convirtió en centro de la familia a finales del siglo XIV. Los miembros registrados permiten seguir su continuidad en los siglos XVI y XVII, incluidas las disputas por el patrimonio tras Thomas, décimo conde, y el ascenso de la rama de Kilcash.',
    legado:'James, primer duque de Ormond, defendió a los Estuardo durante las guerras del siglo XVII y volvió a ejercer responsabilidades en Irlanda tras la Restauración. Los títulos, las propiedades y las opciones religiosas de sus miembros siguieron caminos distintos; su historia combina servicio regio y poder nobiliario local.',
    territorios:['Irlanda','Ormond'],protagonistas:['JAMES9ORMOND','THOMAS10ORMOND','WALTER11ORMOND','THOMASTHURLES','JAMES1DUKEORMOND','ELIZABETHBUTLERPRESTON'],
    fuentes:['https://www.kilkennycastle.ie/about/characters-of-kilkenny-castle/','https://www.dib.ie/biography/butler-james-a1259'],
  },
  Babenberg: {
    resumen:'La casa que gobernó la marca austríaca desde 976 convirtió su patrimonio en un ducado y reunió Austria con Estiria antes de la crisis sucesoria de 1246.',
    origen:'Los Babenberg procedían de la alta nobleza bávara. Su relación con los antiguos condes de Bamberg es discutida: la semejanza del nombre no permite reconstruir una filiación segura. Su gobierno austríaco comenzó con Leopoldo I en 976.',
    trayectoria:'La familia reforzó su posición mediante vínculos con los Salios, los Hohenstaufen, Hungría y Bizancio. Leopoldo VI reunió Austria y Estiria, sostuvo fundaciones religiosas y participó en la política imperial. Su hija Constanza enlazó con los Wettin de Misnia; su hijo Federico II heredó los ducados en 1230.',
    legado:'La muerte de Federico en 1246 puso fin a la línea ducal masculina, pero no a la descendencia familiar ni a los derechos de sus parientas. La disputa por esa herencia precedió al dominio de Otakar II y, después, al establecimiento de los Habsburgo en Austria.',
    territorios:['Austria','Ducado de Estiria','Meißen'],protagonistas:['LEOP6BAB','FRED2BAB','CONSTANZAAUSMEISSEN'],
    fuentes:['https://www.aeiou.at/aeiou.encyclop.b/b002118_ge.htm','https://www.deutsche-biographie.de/sfz57435.html','https://www.deutsche-biographie.de/sfz69833.html'],
  },
  Barberini: {
    resumen:'Una familia toscana que alcanzó el centro del poder pontificio con Urbano VIII y dejó una extensa huella artística y bibliográfica en la Roma del siglo XVII.',
    origen:'Los Barberini se establecieron en Florencia y después en Roma, donde acumularon recursos y cargos curiales. La elección de Maffeo como Urbano VIII en 1623 transformó su posición.',
    trayectoria:'Los sobrinos del papa siguieron carreras complementarias: Francesco y Antonio recibieron el capelo cardenalicio, mientras Taddeo se casó con Anna Colonna y fue príncipe de Palestrina. El palacio, las colecciones, la biblioteca y los encargos artísticos acompañaron la concentración de cargos y patrimonio. Hubo además otro cardenal Antonio, hermano del pontífice, distinto del sobrino homónimo.',
    legado:'La guerra de Castro y la muerte de Urbano VIII en 1644 dieron paso a una crisis bajo Inocencio X. Los sobrinos buscaron refugio en Francia; la familia recuperó después parte de su posición. Sus bibliotecas y colecciones prolongaron una influencia que no dependía únicamente del favor pontificio.',
    territorios:['Florencia','Roma'],protagonistas:['PAPA_URBANO8','FRANCESCOBARBERINI','TADDEOBARBERINI','ANTONIOBARBERINI'],
    fuentes:[T('barberini_(Enciclopedia-Italiana)'),T('francesco-barberini'),T('taddeo-barberini'),T('antonio-barberini_(Dizionario-Biografico)')],
  },
  Carafa: {
    resumen:'Una casa de la nobleza napolitana con numerosas ramas, cuyo poder territorial, militar y eclesiástico alcanzó especial relieve durante el pontificado de Paulo IV.',
    origen:'Los Carafa se separaron de los Caracciolo en la Edad Media. La familia se extendió en múltiples líneas, entre ellas las conocidas como della Spina y della Stadera.',
    trayectoria:'Desde el siglo XIV sus miembros participaron en la política del reino de Nápoles y ampliaron sus posesiones mediante servicios y matrimonios. Gian Pietro Carafa, elegido papa como Paulo IV en 1555, dio a la casa una posición excepcional en Roma. Esa influencia convivió con los intereses de sus diferentes ramas napolitanas.',
    legado:'La muerte de Paulo IV en 1559 abrió una grave crisis para sus parientes más próximos. La familia mantuvo, sin embargo, otras líneas nobiliarias y carreras eclesiásticas y militares. El apellido compartido reúne una casa extensa; los vínculos concretos entre sus ramas se deben seguir mediante las filiaciones documentadas.',
    territorios:['Nápoles','Roma'],protagonistas:['PAPA_PAULO4','PORZIA_CARAFA','FABRIZIO_CARAFA_PORZIA','BEATRICE_CARAFA_NOJA'],
    fuentes:[T('carafa')],
  },
  Piccolomini: {
    resumen:'Mercaderes, banqueros y propietarios sieneses que se distribuyeron en varias ramas y alcanzaron el papado con Pío II y Pío III.',
    origen:'Documentada en Siena durante la Edad Media, la familia desarrolló actividades comerciales y financieras antes de consolidar un amplio patrimonio territorial. Sus distintas ramas conservaron vínculos y una identidad compartida.',
    trayectoria:'Eneas Silvio Piccolomini fue elegido Pío II en 1458 y favoreció la posición de sus parientes. Su hermana Laudomia se casó con Nanni Todeschini: los hijos de esta unión adoptaron el apellido materno al elevarse su tío al pontificado. Uno de ellos, Francesco, fue papa como Pío III en 1503.',
    legado:'La continuidad del nombre Piccolomini incluye, por tanto, una transmisión materna expresamente documentada. La familia mantuvo otras ramas y alianzas además de la pontificia. Su historia enlaza el humanismo de Pío II, el poder curial y las estrategias patrimoniales de la nobleza sienesa.',
    territorios:['Siena','Roma'],protagonistas:['SILVIOPICCOLOMINI','PAPA_PIO2','LAUDOMIAPICCOLOMINI','PAPA_PIO3'],
    fuentes:[T('piccolomini_(Enciclopedia-Italiana)'),T('antonio-piccolomini_(Dizionario-Biografico)')],
  },
  Colleoni: {
    resumen:'Una familia de la pequeña nobleza bergamasca que alcanzó notoriedad por la carrera militar y el patrimonio de Bartolomeo Colleoni.',
    origen:'La familia está documentada desde comienzos del siglo XII en el ámbito de Bérgamo. Sus posesiones y redes locales proporcionaron a Bartolomeo una base de recursos y reclutamiento.',
    trayectoria:'La conquista familiar del castillo de Trezzo en 1404 tuvo un éxito pasajero ante la recuperación de los Visconti. Bartolomeo construyó después su fortuna como condotiero, sirviendo a distintos poderes italianos hasta afianzar su posición al servicio de Venecia. En 1454 recibió el mando como capitán general de la república.',
    legado:'Las fundaciones religiosas y asistenciales y el patronazgo artístico prolongaron su memoria. La capilla Colleoni de Bérgamo y el monumento ecuestre de Venecia testimonian esa proyección. El poder de la casa se apoyó en tierras y servicios militares, dentro del marco de estados más amplios.',
    territorios:['Comuna de Bergamo','Venecia'],protagonistas:['BARTCOLLEONI'],fuentes:[T('bartolomeo-colleoni_(Dizionario-Biografico)')],
  },
  Artois: {
    resumen:'Una rama capeta nacida del infantazgo de Roberto I que conectó Navarra, Borgoña y varias líneas nobiliarias francesas.',
    origen:'Luis IX concedió en 1237 el condado de Artois a su hermano Roberto I, hijo de Luis VIII. La casa condal quedó vinculada por esa ascendencia a los Capeto.',
    trayectoria:'Roberto II murió en Courtrai en 1302. Su hija Matilde, esposa de Otón IV de Borgoña, heredó el condado frente a las pretensiones de su sobrino Roberto III. Blanca de Artois, hermana de Roberto II, fue reina y regente de Navarra y, por su segundo matrimonio, condesa de Lancaster.',
    legado:'El condado pasó por las herederas de Matilde a otras casas y acabó integrado en el conjunto borgoñón. Los descendientes de la rama masculina siguieron trayectorias propias. La transmisión de Artois permite distinguir la historia de un territorio de la continuidad de la casa que le dio nombre.',
    territorios:['Artois','Navarra','Borgoña'],protagonistas:['ROB2ART','MATIART','ROB3ART','BLANART','MARGARTOIS'],
    fuentes:[T('artois_(Enciclopedia-Italiana)'),'https://aunamendi.eusko-ikaskuntza.eus/eu/blanca-de-artois/ar-22015/'],
  },
};
