export const OTRAS_DINASTIAS = "Otras dinastías";

// Solo agrupamos ramas cuya pertenencia dinástica es clara. Las casas no
// incluidas aquí permanecen como filtros independientes o dentro de
// "Otras dinastías"; no se fuerzan parentescos históricos dudosos.
export const GRUPOS_DINASTICOS_GENEALOGICOS = {
  Capeto: [
    "Capeto", "Anjou", "Anjou-Durazzo", "Anjou-Hungría", "Anjou-Tarento",
    "Artois", "Borbón", "Borbón-Condé", "Borbón-Parma", "Borbón-Orleans", "Borgoña", "Capeto-Évreux",
    "Clermont", "Courtenay", "Dreux", "Montfort-Bretaña", "Borgoña-Portugal", "Évreux", "Valois",
    "Valois-Alençon", "Valois-Angulema", "Valois-Borgoña", "Valois-Orleans",
  ],
  Habsburgo: ["Habsburgo", "Habsburgo-Lorena"],
  Ivrea: ["Ivrea-Borgoña", "La Cerda", "Trastámara"],
  Barcelona: ["Barcelona", "Casa de Aragón", "Barcelona-Sicilia", "Barcelona-Urgel", "Fadrique de Aragón"],
  Plantagenet: ["Plantagenet", "Plantagenet-Lancaster", "Plantagenet-York"],
  Tudor: ["Tudor"],
  Avís: ["Avís", "Avís-Beja", "Avís-Coímbra"],
  Paleólogo: ["Paleólogo", "Paleólogo-Monferrato"],
  Přemysl: ["Přemysl", "Přemysl-Opava"],
  Lorena: ["Lorena", "Lorena-Guisa"],
};

// Los grupos regionales no afirman que todas sus casas pertenezcan a una
// misma línea de sangre: son carpetas de navegación para evitar un bloque
// inmanejable de más de cien apellidos menores.
export const GRUPOS_DINASTICOS_REGIONALES = {
  "Casas italianas": [
    "Aquino", "Borri", "Cattanei", "Cornaro", "Della Scala", "Doria",
    "Falangola", "Gazela", "Lancia", "Morosini", "Pirovano", "Sanseverino",
    "Da Vinci", "Del Giocondo", "Gherardini", "Melzi", "Orsini", "Soderini",
  ],
  "Casas ibéricas": [
    "Cabrera", "Castro", "Ávalos", "Enríquez", "Entenza",
    "Fernández de Córdoba", "Figueroa", "Fortiá", "Gurrea", "Guzmán",
    "Ivorra", "Lara", "Luna", "Manrique de Lara", "Manuel", "Mataplana",
    "Medina Sidonia", "Meneses", "Moncada", "Noroña", "Padilla", "Pallars", "Pereira",
    "Pimentel", "Ponce de León", "Quiñones", "Sandoval", "Velasco", "Zúñiga",
  ],
  "Casas francesas": [
    "Albret", "Amboise", "Armagnac", "Auvernia", "Bar", "Beauvau", "Chambly",
    "Avaugour", "Boulogne", "Brienne", "Châtillon", "Comminges", "Dammartín", "Estrées", "Gabarret",
    "Grailly", "Guilhem", "Laval", "Montoire", "Poitiers",
    "Rohan", "Sabran", "Taillefer", "Talleyrand-Périgord", "Thouars", "Toulouse", "Trencavel",
  ],
  "Casas germánicas": [
    "Andechs", "Celje", "Gorizia", "Hohenberg", "Isenburg", "Katzenelnbogen",
    "Kyburg", "La Marck", "Ludovingios", "Schwarzburgo",
    "Avesnes", "Casa de Flandes", "Gerulfinga",
  ],
  "Casas británicas": [
    "Bohun", "Bolena", "Brandon", "Douglas", "Grey", "Holland", "Mortimer",
    "Neville", "Seymour", "Woodville", "Clare", "Marshal", "MacDonald",
  ],
  "Casas irlandesas": ["Ua Conchobair", "Mac Murchada", "O’Neill", "O’Donnell", "O’Brien", "MacCarthy", "Burgh", "Bourke", "FitzGerald", "Butler", "O’Malley", "Preston", "Talbot", "Sarsfield"],
  "Casas escandinavas": ["Estridsen"],
  "Casas orientales": [
    "Ángelo", "Báthory", "Cumanos", "Halshany", "Hunyadi", "Láscaris",
    "Poitiers-Antioquía", "Zápolya", "Jakeli", "Alania", "Gran Comneno",
    "Hetúmida", "Rubénida", "Lusignan", "Bethlen", "Bocskai", "Apafi", "Rákóczi", "Drăculești",
  ],
  "Sin casa identificada": ["Desconocida", "Familias menores"],
};

export const GRUPOS_DINASTICOS = {
  ...GRUPOS_DINASTICOS_GENEALOGICOS,
  Borbón:["Borbón","Borbón-Condé","Borbón-Orleans","Borbón-Parma"],
  Valois:["Valois","Valois-Alençon","Valois-Angulema","Valois-Borgoña","Valois-Orleans"],
  Anjou:["Anjou","Anjou-Durazzo","Anjou-Hungría","Anjou-Tarento"],
  Dreux:["Dreux","Montfort-Bretaña"],
  "Borgoña":["Borgoña","Borgoña-Portugal"],
  ...GRUPOS_DINASTICOS_REGIONALES,
};

export const DINASTIAS_DESTACADAS = [
  "Capeto", "Habsburgo", "Ivrea", "Barcelona", "Plantagenet", "Tudor", "Estuardo",
  "Avís", "Braganza", "Borgoña-Portugal", "Árpád", "Piast", "Jagellón", "Vasa",
  "Bagrationi", "Rurikida", "Přemysl", "Hohenstaufen", "Wittelsbach", "Luxemburgo",
  "Hohenzollern", "Nassau", "Welf", "Wettin", "Oldemburgo", "Paleólogo", "Saboya",
  "Lorena", "Brabante", "Champaña", "Foix", "Dampierre", "Baux",
  "Visconti", "Sforza", "Este", "Gonzaga", "Médici", "Farnesio", "Borja",
  "Álvarez de Toledo", "Jimena", "Nemanjić", "Asen", "Shishman", "Basarab", "Bogdan-Mușat", "Kotromanić", "Nazarí", "Württemberg", "Grifo", "Zähringen-Baden",
  "Casas italianas", "Casas ibéricas", "Casas francesas", "Casas germánicas",
  "Casas británicas", "Casas irlandesas", "Casas escandinavas",
  "Casas orientales", "Sin casa identificada",
];

const RAMA_A_PRINCIPAL_COLOR = Object.fromEntries(
  Object.entries(GRUPOS_DINASTICOS_GENEALOGICOS).flatMap(([principal, ramas]) =>
    ramas.filter((rama) => rama !== principal).map((rama) => [rama, principal])
  )
);

export const getCategoriaDinastía = (dinastia) => RAMA_A_PRINCIPAL_COLOR[dinastia] || dinastia || OTRAS_DINASTIAS;
