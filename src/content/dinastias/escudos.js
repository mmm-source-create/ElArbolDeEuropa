import {ESCUDOS_COMMONS} from './escudosCommons.js';
import {canonicalDynasty} from '../../data/dynastyAliases.js';
// Arms of the principal houses. Every house shows a reviewed Commons or supplied
// image with its credit; the layers remain only as a fallback drawing for a
// house added without one. Arms changed over time and branches added
// differences, which the note states when the image simplifies them.
const FRANCIA_ANTIGUA = [['campo', 'azur'], ['sembrado', 'lis', 'oro']];
const FRANCIA_MODERNA = [['campo', 'azur'], ['figura', 'lis', 'oro', 'tres']];
const INGLATERRA = [['campo', 'gules'], ['figura', 'leopardo', 'oro', 'tres-palo']];
const CASTILLA = [['campo', 'gules'], ['figura', 'castillo', 'oro']];
const LEON = [['campo', 'plata'], ['figura', 'leon', 'purpura']];
const BORGONA_ANTIGUA = [['bandado', 'oro', 'azur'], ['bordura', 'gules']];
const PORTUGAL = [['campo', 'plata'], ['escusones-portugal'], ['bordura', 'gules'], ['castillos-bordura']];
const REAL_INGLESA = {blason: 'Cuartelado: 1.º y 4.º, de azur, tres flores de lis de oro (Francia); 2.º y 3.º, de gules, tres leopardos de oro (Inglaterra).',
  capas: [['cuartelado', [FRANCIA_MODERNA, INGLATERRA, INGLATERRA, FRANCIA_MODERNA]]],
  nota: 'Armas reales desde Enrique IV; las ramas de Lancaster y York añadieron lambeles y bordura antes de reinar.'};
const CASTILLA_LEON = {blason: 'Cuartelado de Castilla y León: 1.º y 4.º, de gules, un castillo de oro; 2.º y 3.º, de plata, un león de púrpura.',
  capas: [['cuartelado', [CASTILLA, LEON, LEON, CASTILLA]]]};

export const ESCUDOS = Object.freeze({

  "Tarnowski": {
    "blason": "De azur, un creciente de oro acompañado en jefe de una estrella de seis puntas del mismo metal.",
    "capas": [
      [
        "campo",
        "azur"
      ]
    ],
    "nota": "Armas Leliwa empleadas por los Tarnowski. La lámina incluye timbre y ornamentos exteriores.",
    "en": {
      "blazon": "Azure, a crescent or beneath a six-pointed star of the same.",
      "note": "Leliwa arms used by the Tarnowski. The image includes the crest and exterior ornaments."
    }
  },
  "Sanguszko": {
    "blason": "De gules, un jinete armado sobre caballo de plata, con espada alzada y escudo de azur cargado con doble cruz de oro; al lado diestro, un castillo de plata, todo sobre una terraza de sinople.",
    "capas": [
      [
        "campo",
        "gules"
      ]
    ],
    "nota": "Variante de la Pogoń de los príncipes Sanguszko, con sus detalles de escusón, manto y corona. Las ramas emplearon variantes.",
    "en": {
      "blazon": "Gules, an armed rider on a horse argent, brandishing a sword and bearing an azure shield with a double cross or; in dexter base a castle argent, all on a base vert.",
      "note": "Variant of the Pogoń of the Sanguszko princes, including its shield details, mantle and crown. Branches used variants."
    }
  },
  "Czartoryski": {
    "blason": "De gules, un jinete armado sobre caballo de plata, con espada alzada y escudo de azur cargado con doble cruz de oro; en la punta diestra, un castillo de plata.",
    "capas": [
      [
        "campo",
        "gules"
      ]
    ],
    "nota": "Pogoń de los príncipes Czartoryski, representada con manto y corona. Se conserva la variante de la fuente.",
    "en": {
      "blazon": "Gules, an armed rider on a horse argent, brandishing a sword and bearing an azure shield with a double cross or; in dexter base a castle argent.",
      "note": "Pogoń of the Czartoryski princes, shown with mantle and crown. The source variant is retained."
    }
  },
  "Chigi": {
    "blason": "De gules, un monte de seis cimas de oro, sumado de una estrella del mismo metal.",
    "capas": [
      [
        "campo",
        "gules"
      ]
    ],
    "nota": "Armas sencillas de Chigi. Los Chigi della Rovere emplearon además composiciones cuarteladas.",
    "en": {
      "blazon": "Gules, a mount of six peaks or surmounted by a star of the same.",
      "note": "Plain Chigi arms. The Chigi della Rovere also used quartered compositions."
    }
  },
  "Savelli": {
    "blason": "Bandado de oro y gules; jefe de plata con rosa de gules entre dos leones afrontados del mismo color.",
    "capas": [
      [
        "campo",
        "gules"
      ]
    ],
    "nota": "Composición de Savelli con el jefe de la rosa y los dos leones; se conserva el dibujo de la fuente.",
    "en": {
      "blazon": "Bendy or and gules; on a chief argent a rose gules between two lions combatant of the same.",
      "note": "Savelli composition with a chief bearing the rose and two lions; the source drawing is preserved."
    }
  }
,

  "Beaufort": {
    "blason": "Cuartelado de Francia antigua e Inglaterra, con bordura componada de plata y azur.",
    "capas": [
      [
        "campo",
        "plata"
      ]
    ],
    "nota": "Armas de Juan Beaufort, primer conde de Somerset. El cuartel francés conserva el sembrado de flores de lis; otras generaciones emplearon variantes.",
    "en": {
      "blazon": "Quarterly France ancient and England, within a bordure compony argent and azure.",
      "note": "Arms of John Beaufort, first Earl of Somerset. The French quarters retain the semy of fleurs-de-lis; other generations used variants."
    }
  },
  "Neville": {
    "blason": "De gules, un sotuer de plata.",
    "capas": [
      [
        "campo",
        "gules"
      ]
    ],
    "nota": "Armas sencillas de Neville, asociadas a Raby y Westmorland. Las ramas de Salisbury y Warwick usaron diferencias.",
    "en": {
      "blazon": "Gules, a saltire argent.",
      "note": "The plain Neville arms associated with Raby and Westmorland. The Salisbury and Warwick branches used differences."
    }
  },
  "O’Neill": {
    "blason": "De plata, una mano diestra de gules entre dos leones afrontados del mismo color; tres estrellas en jefe y, en punta, azur con un salmón de plata.",
    "capas": [
      [
        "campo",
        "plata"
      ]
    ],
    "nota": "Composición de los O’Neill con la mano roja, leones, estrellas y salmón. Las ramas del linaje emplearon variantes.",
    "en": {
      "blazon": "Argent, a dexter hand gules between two lions combatant gules, three stars in chief and a salmon argent on azure in base.",
      "note": "O’Neill composition with the red hand, lions, stars and salmon. Branches of the lineage used variants."
    }
  },
  "Castro": {
    "blason": "De plata, seis roeles de azur puestos en dos palos.",
    "capas": [
      [
        "campo",
        "plata"
      ]
    ],
    "nota": "Armas de seis roeles de la rama gallega de Castro, vinculada a Lemos. Otras ramas emplearon variantes.",
    "en": {
      "blazon": "Argent, six roundels azure in two pales.",
      "note": "The six-roundel arms of the Galician Castro branch associated with Lemos. Other branches used variants."
    }
  },
  "Shishman": {
    "blason": "Emblema circular de oro con tres leones pasantes de gules dispuestos en palo.",
    "capas": [
      [
        "campo",
        "oro"
      ]
    ],
    "nota": "Emblema atribuido al zar Iván Shishman según una miniatura vinculada a un viajero árabe del siglo XIV. Se usa como signo representativo de la casa; la reconstrucción conserva el marco circular de la fuente.",
    "en": {
      "blazon": "A circular gold emblem with three lions passant gules in pale.",
      "note": "Emblem attributed to Tsar Ivan Shishman after a miniature associated with a fourteenth-century Arab traveller. Used as a representative sign for the house; the reconstruction retains the source’s circular frame."
    },
    "tipo": "emblema"
  }
,
"Aleramici":{"blason":"De plata, un jefe de gules.","capas":[["campo","plata"]],"nota":"Dibujo aportado por Manuel Muriel Cagigal y creado con Heraldicon."},
"Lorena-Guisa":{"blason":"Cortado y partido de tres: Hungría, Anjou-Sicilia, Jerusalén, Aragón, Anjou, Güeldres, Jülich y Bar; sobre el todo, Lorena; brisado de un lambel de gules.","capas":[],"nota":"Modelo de las armas de Carlos de Lorena, cuarto duque de Guisa, según el archivo de origen. La composición recoge las pretensiones y herencias de la casa."},
"Ibelin":{"blason":"De oro, una cruz patada de gules.","capas":[["campo","oro"]],"nota":"Armas sencillas de Ibelin según el dibujo de WappenWiki. La rama chipriota incorporó variantes."},
"Asen":{"blason":"Fajado de diez piezas de oro y gules.","capas":[],"nota":"Armas atribuidas al «roi de Blanq(u)e», n.º 1307 del armorial Wijnbergen, del siglo XIII. Se emplean como representación de referencia para Asen, siguiendo la asociación de WappenWiki; su identificación se estudia en la bibliografía heráldica.","fuentes":[{"titulo":"N.-Ș. Tanașoca · Stema regelui Vlahiei din armorialul Wijnbergen (1987)","url":"https://biblioteca-digitala.ro/reviste/xenopol-anuar/024_anuarul-institului-istorie-arheologie_iasi_xenopol_tom-XXIV_vol-1_an_1987.pdf"}]},
"Poitiers":{"blason":"De plata, un león de gules.","capas":[["campo","plata"],["figura","leon","gules"]],"nota":"Armas sencillas de la casa de Poitiers. El león se adapta del dibujo de Sodacan."},
"Armagnac":{"blason":"De plata, un león de gules.","capas":[["campo","plata"],["figura","leon","gules"]],"nota":"Armas sencillas de Armagnac. Las composiciones de sus ramas incorporaron otros cuarteles."},
"Poitiers-Antioquía":{"blason":"Cuartelado: primero y cuarto, de gules; segundo y tercero, de azur sembrado de flores de lis de oro.","capas":[],"nota":"Modelo cuartelado para identificar la rama de Poitiers-Antioquía. Adaptado del dibujo de Baux-Berre: se retiran las dos estrellas y se conservan los cuarteles sembrados de flores de lis."},
"Šubić":{"blason":"De oro, un ala de águila de sable.","capas":[["campo","oro"]],"nota":"Armas antiguas de la casa de Šubić según WappenWiki. El ala de plata sobre gules del archivo Pal Subic identifica las armas personales de Pavao I; aquí se mantiene el modelo general de la casa."},
"Movilă":{"blason":"De gules, dos sables de plata guarnecidos de oro, puestos en aspa, con las puntas hacia abajo.","capas":[["campo","gules"]],"nota":"Armas antiguas de los Movilă (Mohyla) según el dibujo de WappenWiki. Las ramas posteriores usaron otras composiciones."},
"Aldobrandini":{"blason":"De azur, una banda doblemente almenada de oro acompañada de seis estrellas de ocho puntas de oro, tres a cada lado.","capas":[["campo","azur"]],"nota":"Armas familiares de los Aldobrandini, conservando el dibujo propuesto de Wikimedia Commons."},
"Jülich":{"blason":"De oro, un león de sable, armado y lampasado de gules.","capas":[["campo","oro"],["figura","leon","sable"]],"nota":"Armas sencillas de Jülich-Hengebach. Las uniones de Jülich, Berg y Cléveris incorporaron otros cuarteles."},
"Almohade":{"tipo":"emblema","blason":"Estandarte de gules con un tablero jaquelado de plata y sable en el centro.","capas":[],"nota":"Emblema atribuido a partir de la representación de Marrakech en el Libro del Conoscimiento, del siglo XIV: tablero blanco y negro sobre rojo. Se conserva la distinción entre esta tradición armorial tardía y las enseñas documentadas del califato."},
  'Malatesta': {blason:'De plata, dos bandas jaqueladas de oro y gules; bordura dentada de oro y sable.',capas:[['campo','plata']],nota:'Armas familiares de los Malatesta según el dibujo aportado de Wikimedia Commons.'},
  'Moncada': {blason:'De gules, ocho bezantes de oro puestos en dos palos.',capas:[['campo','gules']],nota:'Armas sencillas de la casa de Moncada o Montcada. Sus distintas ramas usaron también composiciones cuarteladas.'},
  'Zähringen-Baden': {blason:'De oro, una banda de gules.',capas:[['campo','oro'],['banda','gules']],nota:'Armas sencillas de Baden. Dibujo de Manuel Muriel Cagigal creado con Heraldicon.'},
  'Gedimínida': {blason:'De gules, las columnas de los Gedimínidas de oro.',capas:[['campo','gules']],nota:'Signo documentado en la época de Vitautas, asociado después al conjunto de la dinastía. Se representa en oro sobre rojo; no se atribuye su uso personal a Gediminas.',fuentes:[{titulo:'Parlamento de Lituania · Gediminaičių stulpai',url:'https://www.lrs.lt/sip/portal.show?p_k=1&p_kade_id=9&p_r=38114&printVersion=1'}]},
  'Frankopan': {blason:'Cortado: primero, de gules, una estrella de seis puntas de oro; segundo, de oro.',capas:[['campo','oro']],nota:'Armas antiguas de los condes de Krk, empleadas hasta alrededor de 1430. Las ramas posteriores de los Frankopan usaron también los leones con el pan.'},
  'Rákóczi': {blason:'Cortado: de gules, un águila de sable coronada de oro; de azur, una rueda de plata sobre un monte de tres cimas de sinople.',capas:[['campo','gules']],nota:'Armas familiares según el dibujo de WappenWiki aportado. Las composiciones de los príncipes de Transilvania incorporaron también otros cuarteles.'},
  'Kotromanić': {blason:'De azur, una banda de plata acompañada de seis flores de lis de oro, tres a cada lado; bordura de oro.',capas:[['campo','azur'],['banda','plata'],['bordura','oro']],nota:'Modelo de las armas reales bosnias de los Kotromanić. Dibujo de Manuel Muriel Cagigal creado con Heraldicon.'},
  'Nemanjić': {blason:'De gules, un águila bicéfala de plata.',capas:[['campo','gules']],nota:'Representación heráldica del águila bicéfala asociada a los Nemanjić, según el dibujo de WappenWiki.'},
  'Branković': {blason:'De plata, un león de gules entre dos cuernos de azur, con adornos de oro.',capas:[['campo','plata'],['figura','leon','gules']],nota:'Adaptación del motivo del estandarte aportado a un escudo de plata. Se conserva el dibujo y la proporción de las figuras; el contorno del escudo es una adaptación del Atlas.'},
  'Gran Comneno': {tipo:'estandarte',alt:{es:'Estandarte de Trebisonda con águila bicéfala de oro sobre rojo',en:'Banner of Trebizond with a gold double-headed eagle on red'},blason:'Estandarte rojo con águila bicéfala de oro.',capas:[],nota:'Reconstrucción del estandarte de Trebisonda descrito en el Libro del conocimiento y representado en la cartografía del siglo XIV. Se emplea como emblema de su corte imperial.',fuentes:[{titulo:'Bibliothèque nationale de France · Atlas catalán, hacia 1375',url:'https://gallica.bnf.fr/ark:/12148/btv1b55002481n'},{titulo:'Libro del conocimiento de todos los reinos · Trebisonda',url:'https://archive.org/details/LibroDelConocimientoDeTodosLosReinos/page/n47'}]},
  "Basarab": {"blason": "Partido: primero, fajado de ocho piezas de gules y plata; segundo, de azur.", "capas": [["cuartelado", [[["fajado", "gules", "plata", 4]], [["campo", "azur"]], [["fajado", "gules", "plata", 4]], [["campo", "azur"]]]]], "nota": "Armas atribuidas a Basarab I hacia 1330, empleadas como representación de la casa. Los distintos príncipes usaron variantes. Dibujo de Manuel Muriel Cagigal creado con Heraldicon."},
  "Bagrationi": {"blason": "Armas cuarteladas con símbolos bíblicos y San Jorge, cruz de plata y escusón de la túnica.", "capas": [["campo", "gules"]], "nota": "Variante de Mukhrani, presentada solo con el escudo. Las ramas y los soberanos georgianos emplearon otras composiciones a lo largo del tiempo."},
  "Bogdan-Mușat": {"blason": "Cuartelado de cruz doble de oro en azur, fajado de sinople y oro, tres rosas de oro en sinople y flor de lis de oro en azur, con un sol de oro sobre el centro.", "capas": [["campo", "azur"]], "nota": "Armas personales atribuidas a Esteban III de Moldavia en WappenWiki, según el archivo aportado. Se emplean como representación de Bogdan-Mușat; otros príncipes de la casa usaron variantes diferentes.", "fuentes": [{"titulo": "WappenWiki · House of Mușat", "url": "https://wappenwiki.org/index.php/House_of_Mu%C8%99at"}]},
  "Rurikida": {"tipo": "signo", "blason": "Bidente en el dibujo de un sello del siglo X atribuido a Sviatoslav Ígorevich.", "capas": [], "nota": "Los primeros príncipes ruríkidas marcaron sellos y otros objetos con signos personales. Se muestra el de Sviatoslav como ejemplo temprano documentado; no se conoce un signo seguro de Rúrik. Las ramas y los soberanos variaron sus signos, entre ellos los tridentes de Vladímir y sus descendientes. Esta imagen identifica la dinastía en el Atlas y no representa un escudo común a todos sus miembros.", "fuentes": [{"titulo": "Roman K. Kovalev · Grand Princess Olga of Rus’ Shows the Bird (Russian History, 2012)", "url": "https://www.falconryheritage.org/uploads/itemUploads/7224/Grand_Princess_Olga_of_Rus_Shows_the_Bi%281%29.pdf"}]},

  "Báthory": {"blason": "De gules, tres dientes de plata, curvados y unidos a una mandíbula en el flanco siniestro.", "capas": [["campo", "gules"]], "nota": "Armas familiares de Báthory según el archivo aportado de WappenWiki. Los soberanos emplearon también composiciones con las armas de sus estados."},
  "Osmanlí": {"tipo": "tughra", "blason": "Monograma caligráfico de Orhan, segundo soberano de la dinastía.", "capas": [], "nota": "Se utiliza la tuğra de Orhan, la primera otomana conservada; no se conoce una de Osman I. Es una firma soberana, no un escudo familiar. En el mundo otomano de este período no existía una tradición de escudos de armas dinásticos como la heráldica europea; las armas imperiales otomanas del siglo XIX quedan fuera de los años 1200–1800 del Atlas.", "fuentes": [{"titulo": "Library of Congress · The Sultan’s Tughra", "url": "https://blogs.loc.gov/international-collections/2021/07/the-sultans-tughra/"}]},

  'Barcelona-Urgel': {blason:'Partido: de oro, dos palos de gules; jaquelado de oro y sable.',capas:[['campo','oro']],nota:'Armas de Pedro II de Urgel según el Armorial de Gelre. Identifica la rama Barcelona-Urgel; las armas personales variaron.'},
  'Della Scala': {blason:'De gules, una escalera de plata puesta en palo.',capas:[['campo','gules']],nota:'Armas parlantes de los señores de Verona, sin ornamentos exteriores.'},
  'Paleólogo': {tipo:'emblema',alt:{es:'Águila bicéfala con el monograma de los Paleólogo',en:'Double-headed eagle with the Palaiologos monogram'},blason:'Águila bicéfala de oro con el monograma de los Paleólogo en el pecho.',capas:[],nota:'Recreación moderna de dos motivos documentados en el arte y los objetos de época paleóloga: el águila bicéfala y el monograma familiar o sympílēma. Se presenta como emblema dinástico. La cruz tetragramática se conserva en las armas de la rama de Monferrato.',fuentes:[{titulo:'Museo de Cultura Bizantina · monogramas y águilas paleólogas',url:'https://www.mbp.gr/wp-content/uploads/2022/09/MBP_12.pdf'}]},
  "Nazarí": {blason:"De gules, una banda de plata cargada con la divisa árabe «No hay vencedor sino Dios», en sable.",capas:[["campo","gules"]],nota:"Armas atribuidas a la dinastía nazarí de Granada (1232–1492). El modelo presenta una banda de plata; otras representaciones la dan de oro."},
  "Zúñiga": {"blason": "De plata, una banda de sable; cadena de oro de ocho eslabones en orla.", "capas": [["campo", "azur"]], "nota": "Armas del linaje, sin la corona ducal exterior."},
  "Bohun": {"blason": "De azur, una banda de plata acostada de dos cotizas de oro, entre seis leones de oro.", "capas": [["campo", "azur"]], "nota": "Armas de la casa de Bohun."},
  "Anjou-Gâtinais": {"blason": "De azur, seis leones de oro, puestos tres, dos y uno.", "capas": [["campo", "azur"]], "nota": "Modelo asociado a Godofredo de Anjou, empleado como representación de la primera casa angevina. Las armas de sus descendientes variaron."},
  "Valois-Anjou": {"blason": "De azur, sembrado de flores de lis de oro, bordura de gules.", "capas": [["campo", "azur"]], "nota": "Armas antiguas de la rama de Luis I, hijo de Juan II de Francia. Se distinguen del lambel de los Anjou capetos y de los cuarteles de sus pretensiones napolitanas y jerosolimitanas."},
  "Anjou-Hungría": {"blason": "Partido: fajado de ocho piezas de gules y plata; de azur sembrado de flores de lis de oro, con lambel de gules.", "capas": [["campo", "azur"]], "nota": "Armas de Carlos Roberto que combinan Hungría y Anjou; sus sucesores emplearon otras combinaciones."},
  "Valois-Alençon": {"blason": "De azur, sembrado de flores de lis de oro, bordura de gules cargada de ocho besantes de plata.", "capas": [["campo", "azur"]], "nota": "Modelo antiguo compartido por Pedro de Alençon y la posterior rama Valois-Alençon. También se empleó una variante con tres flores de lis."},
  "Valois-Orleans": {"blason": "De azur, tres flores de lis de oro, lambel de plata.", "capas": [["campo", "azur"]], "nota": "Armas ducales de Orleans. Se reutiliza el mismo dibujo que en las creaciones borbónicas; sus genealogías permanecen separadas."},
  "Borbón-Orleans-Gastón": {"blason": "De azur, tres flores de lis de oro, lambel de plata.", "capas": [["campo", "azur"]], "nota": "Creación de Orleans para Gastón, hermano de Luis XIII. El mismo emblema se reutiliza en la casa de Felipe I, creada en 1661; esta no desciende de Gastón."},
  "Borbón-Condé": {"blason": "De azur, tres flores de lis de oro; bastón de gules recortado en banda.", "capas": [["campo", "azur"]], "nota": "Modelo familiar de Condé, distinto de las armas plenas de los reyes Borbones. Las brisuras personales y de Soissons variaron."},
  "Borbón-Parma": {"blason": "De azur, tres flores de lis de oro, bordura de gules.", "capas": [["campo", "azur"]], "nota": "Escudo dinástico de Borbón-Anjou empleado por la rama de Parma. Los duques incorporaron después sus distintos patrimonios en armas compuestas."},

  'Toulouse': {blason:'De gules, una cruz de Tolosa de oro, vacía y pometeada de doce piezas.',capas:[['campo','gules']],nota:'La cruz de los condes de Tolosa, empleada también como emblema del Languedoc.'},
  'Butler': {blason:'De gules, tres copas cubiertas de oro, puestas dos y una.',capas:[['campo','gules']]},
  'Barberini': {blason:'De azur, tres abejas de oro, puestas dos y una.',capas:[['campo','azur']]},
  'Loyola': {blason:'De plata, dos lobos de sable afrontados a una caldera de sable suspendida de una cadena.',capas:[['campo','plata']],nota:'Armas del solar de Loyola, sin el cuartel de Oñaz de otras variantes.'},
  'Borgoña': {blason:'Bandado de oro y azur, con bordura de gules.',capas:[['bandado','oro','azur'],['bordura','gules']],nota:'Armas antiguas de la casa ducal capeta de Borgoña.'},
  'Artois': {blason:'De azur, sembrado de flores de lis de oro; lambel de gules cargado de castillos de oro.',capas:[...FRANCIA_ANTIGUA,['lambel','gules']],nota:'Modelo de las armas de Roberto de Artois.'},
  'Bjälbo': {blason:'De azur, un león de oro brochante sobre tres franjas diagonales de plata, con corazones de gules.',capas:[['campo','azur'],['figura','leon','oro']],nota:'Modelo atribuido a Birger jarl; las ramas reales emplearon otras variantes.'},
  'Châtillon': {blason:'De gules, tres palos de veros y jefe de oro.',capas:[['campo','gules']],nota:'Armas de los Châtillon-sur-Marne; un topónimo compartido no prueba una filiación común.'},
  'Grailly': {blason:'De oro, una cruz de sable cargada de cinco veneras de plata.',capas:[['campo','oro'],['cruz','sable']],nota:'Modelo de las armas de Juan III de Grailly.'},
  'Piccolomini': {blason:'De plata, una cruz de azur cargada de cinco crecientes de oro.',capas:[['campo','plata'],['cruz','azur']]},
  'Colleoni': {blason:'Cortado de gules y plata, tres testículos puestos dos y uno, del uno en el otro.',capas:[['fajado','gules','plata',2]],nota:'Armas parlantes de los Colleoni.'},
  'Borgoña-Portugal': {blason:'De plata, cinco escudetes de azur puestos en cruz y cargados de besantes de plata; bordura de gules con castillos de oro.',capas:[['campo','plata'],['escusones-portugal'],['bordura','gules'],['castillos-bordura']],nota:'Variante del siglo XIII, identificada como 1247 en el archivo de origen; las armas de la primera dinastía variaron durante su historia.'},
  'Montfort-Bretaña': {blason:'De armiño.',capas:[['campo','plata']],nota:'Armas ducales de Bretaña utilizadas por la rama de Dreux-Montfort, distintas de las del antiguo linaje de Montfort-l’Amaury.'},
  'Zrinski': {blason:'De gules, dos alas de sable unidas.',capas:[['campo','gules']],nota:'Modelo de la casa de Zrinski de WappenWiki.'},
  'Saluzzo': {blason:'De plata, jefe de azur.',capas:[['campo','plata'],['jefe','azur']],nota:'Dibujo de Manuel Muriel Cagigal creado con Heraldicon y aportado por su autor.'},
  'Kosača': {blason:'Bandado de plata y gules.',capas:[['bandado','plata','gules']],nota:'Dibujo de Manuel Muriel Cagigal creado con Heraldicon y aportado por su autor.'},
  'Carafa': {blason:'De gules, tres fajas de plata.',capas:[['fajado','gules','plata',7]],nota:'Dibujo de Manuel Muriel Cagigal creado con Heraldicon y aportado por su autor.'},
  'Babenberg': {blason:'De gules, una faja de plata.',capas:[['campo','gules'],['faja','plata']],nota:'El escudo de Austria, empleado bajo los últimos Babenberg. Dibujo de Manuel Muriel Cagigal creado con Heraldicon.'},
  'Saboya-Carignano': {blason:'Armas compuestas de Saboya-Carignano, con escusón de Saboya diferenciado por una bordura dentada de plata.',capas:[['campo','gules'],['cruz','plata']],nota:'Representación de la rama de Carignano; el escudo reúne cuarteles territoriales y no corresponde a cada miembro en todas las épocas.'},
  'Pallars': {blason:'De oro, un águila bicéfala de sable, cargada de un escusón de gules con tres pajas de oro en banda.',capas:[['campo','oro'],['figura','aguila','sable']],nota:'Se conserva el escudo de los condes de Pallars y se retira únicamente la corona exterior de la imagen propuesta.'},
  'Baux': {blason:'De gules, una estrella de dieciséis rayos de plata.',capas:[['campo','gules']]},
  'Avesnes': {blason:'Bandado de oro y gules.',capas:[['bandado','oro','gules']],nota:'Dibujo propio de Manuel Muriel Cagigal, aportado por su autor para el Atlas.'},
  'FitzGerald': {blason:'De plata, un sotuer de gules.',capas:[['campo','plata']],nota:'Escudo de la línea de Kildare, después duques de Leinster. La rama de Desmond usó un sotuer de armiños; no son armas idénticas de todas las ramas.'},
  'Bruce': {blason:'De oro, un sotuer y un jefe de gules.',capas:[['campo','oro']],nota:'Armas familiares de Bruce, distintas del león real que llevaron como reyes de Escocia.'},
  'Ascania': {blason:'Burelado de sable y oro de diez piezas.',capas:[['fajado','sable','oro',10]],nota:'Armas antiguas de Ballenstedt asociadas al linaje. Las ramas de Sajonia, Brandeburgo y Anhalt añadieron o combinaron otros emblemas; este escudo no se atribuye como armas personales idénticas a todos sus miembros.'},
  'Capeto': {blason: 'De azur, sembrado de flores de lis de oro.', capas: FRANCIA_ANTIGUA,
    nota: 'Las armas de Francia «antigua», usadas por los reyes hasta Carlos V.'},
  'Valois': {blason: 'De azur, tres flores de lis de oro.', capas: FRANCIA_MODERNA,
    nota: 'Francia «moderna»: Carlos V redujo el sembrado a tres lises.'},
  'Valois-Angulema': {blason: 'De azur, tres flores de lis de oro.', capas: FRANCIA_MODERNA, nota:'Modelo real de la rama desde Francisco I. Los condes anteriores utilizaron diferencias y cuarteles propios; estas armas plenas no se atribuyen a cada miembro en todas las etapas de su vida.'},
  'Borbón': {blason: 'De azur, sembrado de flores de lis de oro, una banda de gules.', capas: [...FRANCIA_ANTIGUA, ['banda','gules']], nota: 'Armas de Roberto de Clermont, origen capeto de la casa de Borbón. Los reyes de Francia llevaron después las armas reales sin esta diferencia; las ramas incorporaron sus propias brisuras.'},
  'Anjou': {blason: 'De azur, sembrado de flores de lis de oro, con un lambel de gules.', capas: [...FRANCIA_ANTIGUA, ['lambel', 'gules']],
    nota: 'Armas de Carlos I de Anjou, hermano de Luis IX. Las de Nápoles y Hungría combinaron después otros cuarteles.'},
  'Dreux': {blason: 'Jaquelado de oro y azur, bordura de gules.', capas: [['jaquelado', 'oro', 'azur'], ['bordura', 'gules']]},
  'Plantagenet': {blason: 'De gules, tres leopardos de oro.', capas: INGLATERRA,
    nota: 'Los tres leones pasantes de Inglaterra, fijados con Ricardo I.'},
  'Plantagenet-Lancaster': REAL_INGLESA,
  'Plantagenet-York': REAL_INGLESA,
  'Estuardo': {blason: 'De oro, un león rampante de gules dentro de un doble trechor flordelisado y contraflordelisado de gules.', capas: [['campo', 'oro'], ['trechor', 'gules'], ['figura', 'leon', 'gules']],
    nota: 'Las armas reales de Escocia.'},
  'Valois-Borgoña': {blason: 'Cuartelado: 1.º y 4.º, Borgoña moderna (de azur, tres flores de lis de oro, bordura componada de plata y gules); 2.º, partido de Borgoña antigua y Brabante; 3.º, partido de Borgoña antigua y Limburgo; sobre el todo, Flandes.',
    capas: [['cuartelado', [[...FRANCIA_MODERNA, ['bordura-componada', 'plata', 'gules']], BORGONA_ANTIGUA, BORGONA_ANTIGUA, [...FRANCIA_MODERNA, ['bordura-componada', 'plata', 'gules']]]]],
    nota: 'Armas plenas desde 1430, con Brabante, Limburgo y el escusón de Flandes.'},
  'Ivrea-Borgoña': {...CASTILLA_LEON, blason: 'Cuartelado de Castilla y León: 1.º y 4.º, de gules, un castillo de oro; 2.º y 3.º, de plata, un león de púrpura coronado de oro.',
    nota: 'Las armas reales de Castilla entre Sancho IV y Juan I (1284–1390).'},
  'Trastámara': {blason: 'Cuartelado: 1.º y 4.º, cuartelado de Castilla y León; 2.º y 3.º, partido de Aragón (de oro, cuatro palos de gules) y de Aragón-Sicilia (flanqueado de Aragón y de plata con un águila de sable).',
    capas: [['cuartelado', [[['cuartelado', [CASTILLA, LEON, LEON, CASTILLA]]], [['palado', 'oro', 'gules', 9]], [['palado', 'oro', 'gules', 9]], [['cuartelado', [CASTILLA, LEON, LEON, CASTILLA]]]]]],
    nota: 'Armas de los Reyes Católicos antes de la conquista de Granada (1474–1492), que reúnen las dos ramas de la casa. Los reyes Trastámara de Castilla, de Enrique II a Isabel, llevaron el cuartelado de Castilla y León; los de Aragón, desde Fernando I, las armas de Aragón.'},
  'Barcelona': {blason: 'De oro, cuatro palos de gules.', capas: [['palado', 'oro', 'gules', 9]]},
  'Foix': {blason: 'De oro, tres palos de gules.', capas: [['palado', 'oro', 'gules', 7]]},
  'Avís': {blason: 'De plata, cinco escudetes de azur puestos en cruz, cargados de bezantes de plata; bordura de gules con castillos de oro y, brochantes, las puntas flordelisadas de sinople de la cruz de Avís.', capas: PORTUGAL,
    nota: 'Las armas de Portugal desde Juan I (1385). Juan II retiró la cruz de Avís en 1485.'},
  'Braganza': {blason: 'De plata, un sotuer de gules cargado de cinco escudetes de Portugal.', capas: PORTUGAL,
    nota: 'Armas de los duques de Braganza. Como reyes, desde 1640, llevaron las armas de Portugal.'},
  'Habsburgo': {blason: 'De oro, un león rampante de gules, coronado de azur.', capas: [['campo', 'oro'], ['figura', 'leon', 'gules']],
    nota: 'Armas originarias de los condes de Habsburgo. Como archiduques usaron además la faja de plata sobre gules de Austria.'},
  'Luxemburgo': {blason: 'Burelado de plata y azur, un león rampante de gules, coronado de oro.', capas: [['fajado', 'plata', 'azur', 10], ['figura', 'leon', 'gules']]},
  'Wittelsbach': {blason: 'Fusado en banda de plata y azur.', capas: [['fusado', 'plata', 'azur']],
    nota: 'Los rombos de Baviera. La rama palatina añadió el león de oro del Palatinado.'},
  'Hohenzollern': {blason: 'Cuartelado de plata y sable.', capas: [['cuartelado-liso', 'plata', 'sable']]},
  'Wettin': {blason: 'Burelado de sable y oro, con un crancelín de sinople en banda.', capas: [['fajado', 'sable', 'oro', 10], ['crancelin', 'sinople']]},
  'Hohenstaufen': {blason: 'De oro, tres leones pasantes de sable.', capas: [['campo', 'oro'], ['figura', 'leopardo', 'sable', 'tres-palo']],
    nota: 'Armas del ducado de Suabia asociadas a la casa.'},
  'Welf': {blason: 'Partido: 1.º, de gules, dos leopardos de oro (Brunswick); 2.º, de oro, sembrado de corazones de gules, un león rampante de azur (Luneburgo).',
    capas: [['campo', 'oro'], ['sembrado', 'corazon', 'gules', .11, 15], ['figura', 'leon', 'azur']],
    nota: 'Armas de los duques de Brunswick-Luneburgo, la rama de la casa que reinó en Hannover y, desde 1714, en Gran Bretaña. El león azul de Luneburgo es el de las armas antiguas de los Welf.'},
  'Hesse': {blason: 'De azur, un león rampante burelado de plata y gules, coronado de oro.', capas: [['campo', 'azur'], ['figura', 'leon', 'plata']],
    nota: 'Armas de los landgraves entre 1200 y 1450, antes de sumar los cuarteles de Katzenelnbogen, Ziegenhain y Nidda.'},
  'Brabante': {blason: 'De sable, un león rampante de oro.', capas: [['campo', 'sable'], ['figura', 'leon', 'oro']]},
  'Dampierre': {blason: 'De oro, un león rampante de sable.', capas: [['campo', 'oro'], ['figura', 'leon', 'sable']],
    nota: 'Las armas de Flandes.'},
  'Nassau': {blason: 'De azur, sembrado de billetes de oro, un león rampante de oro coronado del mismo, armado y linguado de gules.', capas: [['campo', 'azur'], ['sembrado', 'billete', 'oro', .1, 14], ['figura', 'leon', 'oro']],nota:'Al león del modelo Wapen Nassauw se añade la corona del modelo de Nassau-Saarbrücken.'},
  'La Marck': {blason: 'De oro, una faja jaquelada de plata y gules.', capas: [['campo', 'oro'], ['faja-jaquelada', 'plata', 'gules']]},
  'Saboya': {blason: 'De gules, una cruz de plata.', capas: [['campo', 'gules'], ['cruz', 'plata']]},
  'Médici': {blason: 'De oro, cinco roeles de gules y, en jefe, uno mayor de azur cargado de tres flores de lis de oro.', capas: [['campo', 'oro'], ['medici']],
    nota: 'El roel de Francia fue una concesión de Luis XI en 1465.'},
  'Este': {blason: 'De azur, un águila de plata.', capas: [['campo', 'azur'], ['figura', 'aguila', 'plata']]},
  'Árpád': {blason: 'Fajado de gules y plata de ocho piezas.', capas: [['fajado', 'gules', 'plata', 8]],
    nota: 'Las fajas de Hungría, las armas antiguas del reino bajo los Árpád.'},
  'Přemysl': {blason: 'De plata, un águila de sable con llamas de gules.', capas: [['campo', 'plata'], ['figura', 'aguila', 'sable']],
    nota: 'El águila flamígera de san Wenceslao, emblema de los Přemyslidas. El reino de Bohemia llevó después el león de plata sobre gules.'},
  'Piast': {blason: 'De gules, un águila de plata coronada, picada y armada de oro.', capas: [['campo', 'gules'], ['figura', 'aguila', 'plata']],
    nota: 'Se conserva el águila coronada del modelo polaco y se retira la gran corona exterior del escudo.'},
  'Lusignan': {blason: 'Burelado de plata y azur.', capas: [['fajado', 'plata', 'azur', 10]],
    nota: 'Armas de la casa en Poitou; los reyes de Chipre añadieron un león de gules.'},
  'Oldemburgo': {blason: 'De oro, dos fajas de gules.', capas: [['fajado', 'oro', 'gules', 5]],
    nota: 'Armas del condado de Oldemburgo. Los reyes de Dinamarca llevaron las armas del reino.'},
  'Estridsen': {blason: 'De oro, sembrado de corazones de gules, tres leones pasantes de azur coronados de oro.', capas: [['campo', 'oro'], ['sembrado', 'corazon', 'gules', .11, 15], ['figura', 'leopardo', 'azur', 'tres-palo']],
    nota: 'Las armas de Dinamarca, documentadas desde Canuto VI, en la forma del armorial de Gelre (siglo XIV).'},
  'Visconti': {blason: 'De plata, una bisa ondeante en palo de azur que engola a una figura humana de gules.', capas: [['campo', 'plata']],
    nota: 'El biscione de los Visconti, en la forma que la casa usó desde que Ottone Visconti se hizo con Milán en 1277. Los duques lo cuartelaron después con el águila imperial.'},
  'Álvarez de Toledo': {blason: 'Jaquelado de quince piezas de plata y azur.', capas: [['jaquelado', 'plata', 'azur']],
    nota: 'Las armas de los Álvarez de Toledo, condes y después duques de Alba.'},
  // V5.33 · Casas con escudo de Commons propuesto en la revisión de escudos.
  'Borbón-Orleans': {blason: 'De azur, tres flores de lis de oro y un lambel de plata.', capas: [...FRANCIA_MODERNA, ['lambel', 'plata']],
    nota: 'Armas de los duques de Orleans desde Felipe, hermano de Luis XIV, con el lambel de los segundones de Francia.'},
  'Évreux': {blason: 'De azur, sembrado de flores de lis de oro, una banda componada de plata y gules.', capas: [...FRANCIA_ANTIGUA, ['banda', 'plata']],
    nota: 'Armas de Luis de Évreux, hijo de Felipe III. Sus descendientes, reyes de Navarra, las cuartelaron con las cadenas navarras.'},
  'Anjou-Tarento': {blason: 'De azur, sembrado de flores de lis de oro, un lambel de gules y una banda de plata.', capas: [...FRANCIA_ANTIGUA, ['lambel', 'gules'], ['banda', 'plata']],
    nota: 'Armas de Felipe de Tarento antes de 1313: las de Anjou-Nápoles con la banda de su rama.'},
  'Courtenay': {blason: 'De oro, tres roeles de gules.', capas: [['campo', 'oro'], ['figura', 'roel', 'gules', 'tres']],
    nota: 'Armas plenas de la casa; sus ramas las diferenciaron con lambeles y borduras.'},
  'Champaña': {blason: 'De azur, una banda de plata acostada de dos cotizas de oro.', capas: [['campo', 'azur'], ['banda', 'plata']],
    nota: 'Forma primitiva de las armas de los condes de Champaña; después las cotizas se dibujaron potenzadas. Los reyes de Navarra de la casa las partieron con las cadenas de Navarra.'},
  'Albret': {blason: 'Cuartelado: 1.º y 4.º, de azur, tres flores de lis de oro (Francia); 2.º y 3.º, de gules pleno (Albret).',
    capas: [['cuartelado', [FRANCIA_MODERNA, [['campo', 'gules']], [['campo', 'gules']], FRANCIA_MODERNA]]],
    nota: 'Armas de Carlos de Albret, condestable de Francia, y de sus sucesores: el gules pleno de la casa cuartelado con Francia.'},
  'Tudor': {...REAL_INGLESA,
    nota: 'Las armas reales de Inglaterra desde Enrique IV, que los Tudor heredaron de los Lancaster y llevaron hasta Isabel I. Los dragones y galgos de sus soportes no forman parte del escudo.'},
  'Jimena': {blason: 'De oro, un águila de sable.', capas: [['campo', 'oro'], ['figura', 'aguila', 'sable']],
    nota: 'El águila que se asocia a los últimos reyes de la casa, como Sancho VII el Fuerte, antes de que las cadenas se fijaran como armas de Navarra.'},
  'Casa de Aragón': {blason: 'De oro, cuatro palos de gules y, brochante, una banda de azur.', capas: [['palado', 'oro', 'gules', 9], ['banda', 'azur']],
    nota: 'Armas de los reyes de Mallorca, rama del casal de Barcelona, que diferenciaban con la banda las armas reales de Aragón. No se usaron antes de Jaime II de Mallorca.'},
  'Barcelona-Sicilia': {blason: 'Flanqueado: en palo, de oro, cuatro palos de gules (Aragón); en los flancos, de plata, un águila de sable (Hohenstaufen).',
    capas: [['palado', 'oro', 'gules', 9]],
    nota: 'Armas de los reyes aragoneses de Sicilia: los palos de Aragón y el águila de los Hohenstaufen, la herencia de la reina Constanza.'},
  'Habsburgo-Lorena': {blason: 'Tercio en palo: 1.º, de oro, un león de gules coronado de azur (Habsburgo); 2.º, de gules, una faja de plata (Austria); 3.º, de oro, una banda de gules cargada de tres aleriones de plata (Lorena).',
    capas: [['campo', 'gules'], ['faja', 'plata']],
    nota: 'Armas genealógicas de la casa desde el 6 de agosto de 1806, con las tres casas de las que procede.'},
  'Lorena': {blason: 'De oro, una banda de gules cargada de tres aleriones de plata.', capas: [['campo', 'oro'], ['banda', 'gules']],
    nota: 'Armas de los duques de Lorena.'},
  'Württemberg': {blason: 'De oro, tres cuernas de ciervo de sable puestas en faja.', capas: [['campo', 'oro']]},
  'Mecklemburgo': {blason: 'De oro, una cabeza de búfalo de sable con cuernos y anilla de plata, coronada y linguada de gules.', capas: [['campo', 'oro']],
    nota: 'Armas del ducado de Mecklemburgo.'},
  'Hannover': {blason: 'Partido y entado en punta: 1.º, de gules, dos leopardos de oro (Brunswick); 2.º, de oro, sembrado de corazones de gules, un león de azur (Luneburgo); en punta, de gules, un caballo corriente de plata (Westfalia); sobre el todo, de gules, la corona de Carlomagno de oro.',
    capas: [['campo', 'gules'], ['figura', 'leopardo', 'oro', 'dos-palo']],
    nota: 'Escudo del electorado y reino de Hannover, que los reyes británicos de la casa llevaron sobre las armas reales desde 1714. La corona de Carlomagno señala el cargo de architesorero del Imperio.'},
  'Romanov': {blason: 'De plata, un grifo de gules que sostiene una espada y una rodela de oro, rematada por un aguilucho de sable; bordura de sable con ocho cabezas de león arrancadas, cuatro de oro y cuatro de plata.',
    capas: [['campo', 'plata'], ['bordura', 'sable']],
    nota: 'Armas de los Romanov como linaje boyardo. Como zares llevaron las armas del Estado ruso.'},
  'Paleólogo-Monferrato': {blason: 'Cuartelado: 1.º y 4.º, de gules, una cruz de oro acantonada de cuatro eslabones de oro (Paleólogo); 2.º y 3.º, de plata, un jefe de gules (Monferrato).',
    capas: [['cuartelado', [[['campo', 'gules'], ['cruz', 'oro']], [['campo', 'plata']], [['campo', 'plata']], [['campo', 'gules'], ['cruz', 'oro']]]]],
    nota: 'Armas de los marqueses de Monferrato de la casa Paleólogo antes de 1494: la cruz imperial bizantina y el jefe de Monferrato.'},
  'Sforza': {blason: 'De azur, un león rampante de oro que sostiene un membrillo de oro con hojas de sinople.', capas: [['campo', 'azur'], ['figura', 'leon', 'oro']],
    nota: 'Armas parlantes antiguas de los Sforza, condes de Cotignola: el membrillo («cotogna»). Los duques de Milán usaron el águila imperial y la bisa de los Visconti; las ramas no milanesas conservaron estas.'},
  'Gonzaga': {blason: 'Fajado de oro y sable de seis piezas.', capas: [['fajado', 'oro', 'sable', 6]],
    nota: 'Armas antiguas de la casa, anteriores a la cruz con cuatro águilas que concedió el emperador Segismundo en 1433.'},
  'Farnesio': {blason: 'De oro, seis flores de lis de azur, puestas tres, dos y una.', capas: [['campo', 'oro'], ['figura', 'lis', 'azur', 'tres']],
    nota: 'Armas de la casa; los duques de Parma las cuartelaron después con las de su herencia.'},
  'Della Rovere': {blason: 'De azur, un roble arrancado de oro con las ramas pasadas en doble sotuer.', capas: [['campo', 'azur']],
    nota: 'Armas parlantes (rovere, «roble») de la casa de Sixto IV y Julio II.'},
  'Orsini': {blason: 'Bandado de plata y gules; jefe de plata cargado de una rosa de gules y sostenido de oro.', capas: [['bandado', 'plata', 'gules']],
    nota: 'Forma de los Orsini de Pitigliano. Otras ramas cargaron de una anguila la divisa de oro.'},
  'Colonna': {blason: 'De gules, una columna de plata con basa y capitel de oro, coronada de oro.', capas: [['campo', 'gules']],
    nota: 'Armas parlantes de la casa.'},
  'Borghese': {blason: 'Cortado: 1.º, de oro, un águila de sable coronada de oro; 2.º, de azur, un dragón de oro.', capas: [['campo', 'azur']],
    nota: 'Armas de la casa de Paulo V.'},
  'Borja': {blason: 'De oro, un buey de gules sobre una terraza de sinople; bordura de oro con ocho matas de sinople.', capas: [['campo', 'oro'], ['bordura', 'oro']],
    nota: 'Armas de la casa de Calixto III y Alejandro VI. Otras representaciones dan la bordura de gules con haces de oro.'},
  // V5.34
  'Gorizia': {blason: 'Tronchado: 1.º, de azur, un león de oro; 2.º, bandado de plata y gules.', capas: [['campo', 'azur'], ['figura', 'leon', 'oro']],
    nota: 'Armas de los condes de Gorizia, la casa de los Meinhardinos, que gobernó también el Tirol y Carintia.'},
  'Ludovingios': {blason: 'De azur, un león rampante burelado de plata y gules, coronado de oro.', capas: [['campo', 'azur'], ['figura', 'leon', 'plata']],
    nota: 'El león listado de los landgraves de Turingia. Sofía, hija de Luis IV, lo llevó a Hesse, cuyos landgraves lo conservaron; la imagen es la de las armas de Hesse.'},
  'Anjou-Durazzo': {blason: 'De azur, sembrado de flores de lis de oro, lambel de gules y bordura componada de plata y gules.', capas: [...FRANCIA_ANTIGUA, ['lambel', 'gules'], ['bordura-componada', 'plata', 'gules']], nota: 'Armas de Juan de Anjou, duque de Durazzo.'},
  'Jagellón': {blason: 'De azur, una cruz patriarcal de oro.', capas: [['campo', 'azur']], nota: 'La doble cruz dinástica de los Jagellón.'},
  'Hetúmida': {blason: 'De oro, un león rampante de gules.', capas: [['campo', 'oro'], ['figura', 'leon', 'gules']], nota: 'Representación simplificada del león de la Armenia cilicia: se reutiliza el dibujo de Habsburgo, que añade corona azul y no representa la cruz de algunas variantes armenias.'},
  'Holstein-Gottorp': {blason: 'Armas compuestas de Noruega, Schleswig, Holstein, Stormarn y Dithmarschen, con escusón de Oldemburgo y Delmenhorst.', capas: [['campo', 'gules']], nota: 'Escudo compuesto de los duques de Holstein-Gottorp. La casa gobernó su parte de los ducados junto a otros titulares de Schleswig y Holstein.'},
  'Vasa': {blason: 'De azur, plata y gules, una gavilla de oro brochante.', capas: [['campo', 'azur']], nota: 'La gavilla de la casa Vasa.'},
  'Grifo': {blason: 'De plata, un grifo rampante de gules, armado de oro.', capas: [['campo', 'plata']], nota: 'Armas de la casa de Pomerania, conservadas en el escudo de Pomerania Occidental.'},
  'Dunkeld': {blason: 'De oro, un león rampante de gules dentro de un doble trechor flordelisado y contraflordelisado de gules.', capas: [['campo', 'oro'], ['trechor', 'gules'], ['figura', 'leon', 'gules']], nota: 'Armas reales de Escocia, compartidas con los Estuardo.'},
});

const conImagen = new Map(Object.entries(ESCUDOS).map(([dinastia, escudo]) =>
  [dinastia, ESCUDOS_COMMONS[dinastia] ? {...escudo, imagen: ESCUDOS_COMMONS[dinastia]} : escudo]));
export const escudoDe = dinastia => conImagen.get(canonicalDynasty(dinastia)) || null;
// Credits for the licences page, one per house.
export const CREDITOS_ESCUDOS = Object.entries(ESCUDOS_COMMONS).map(([dinastia, imagen]) => ({dinastia, ...imagen, ...(ESCUDOS[dinastia]?.tipo ? {tipo:ESCUDOS[dinastia].tipo} : {})}));

// Labels for historical signs that are displayed alongside heraldic arms.
const EMBLEM_LABELS = {tughra:['Tuğra','Tuğra'],signo:['Signo principesco','Princely sign'],emblema:['Emblema dinástico','Dynastic emblem'],estandarte:['Estandarte','Banner']};
export const nombreEmblema = (escudo, locale = 'es') => EMBLEM_LABELS[escudo?.tipo]?.[locale === 'en' ? 1 : 0] || (locale === 'en' ? 'Arms' : 'Escudo');
export const esEmblemaNoHeraldico = escudo => Boolean(EMBLEM_LABELS[escudo?.tipo]);
