// ---------------------------------------------------------------------------
// Jerarquía de territorios: qué territorios están "dentro" de otro más
// amplio (p. ej. Baviera, Austria o Bohemia formaban parte del Sacro
// Imperio; Artois o Bretaña eran feudos dentro de Francia). Se agrupan
// bajo su territorio "padre" y se despliegan como filtros propios dentro
// del filtro del territorio madre, exactamente igual que las ramas
// menores de las dinastías en App.jsx.
//
// Edítalo libremente: añade o quita entradas sin tocar el resto del
// código. Un territorio que no aparezca aquí como "hijo" se sigue
// mostrando como chip normal de primer nivel.
export const TERRITORIOS_DESTACADOS = [
  "Francia",
  "Austria",
  "Provincias Unidas",
  "Inglaterra",
  "Escocia",
  "Irlanda",
  "Georgia y Cáucaso",
  "España",
  "Portugal",
  "Sacro Imperio",
  "Borgoña y Países Bajos",
  "Estados Italianos",
  "Hungría",
  "Polonia-Lituania",
  "Bizancio y Oriente latino",
  "Balcanes",
  "Escandinavia",
];

// Jerarquía semántica usada por los filtros. Los grupos que no son nombres
// literales del campo `reinos` (por ejemplo «Corona de Castilla») funcionan como
// categorías de exploración; sus chips hijos siguen permitiendo elegir cada
// territorio concreto. Un territorio puede aparecer en varios grupos cuando
// su historia política o geográfica lo justifica (Borgoña, Silesia, Saboya…).
export const TERRITORIOS_SUB = {
  Francia: [
    "Albret", "Dreux", "Alençon", "Angulema", "Anjou", "Aquitania", "Artois", "Auxerre", "Auvernia",
    "Berry", "Borgoña", "Borbón", "Boulogne", "Bretaña", "Champaña",
    "Clermont", "Évreux", "Foix", "Armagnac", "Guisa", "La Marche", "Montpellier", "Nevers",
    "Orleans", "Poitou", "Toulouse", "Maine", "Normandía", "Ducado de Auvernia", "Ponthieu", "Provenza", "Rethel", "Saint-Pol", "Valois", "Vendôme", "Bearne",
  ],

  Bretaña: ["Penthièvre"],
  Foix: ["Castellbó"],
  Inglaterra: ["Gales", "Richmond", "Suffolk", "York", "Huntingdon", "Northumbria"],
  Escocia: ["Annandale", "Carrick", "Galloway"],
  Irlanda: ["Connacht","Leinster","Thomond","Desmond","Tír Eoghain","Tír Chonaill","Condado de Tyrone","Condado de Tyrconnell","Condado de Thomond","Condado de Desmond","Condado de Clancare","Condado de Ulster","Kildare","Ormond","Clanricarde","Vizcondado de Mayo","Lucan"],
  Armenia: ["Armenia cilicia"],
  "Georgia y Cáucaso": ["Georgia", "Imericia", "Samtsje", "Kartli", "Kajetia", "Kartli-Kajetia"],

  España: ["Corona de Castilla", "Corona de Aragón", "Navarra", "Granada"],
  "Corona de Castilla": ["Castilla", "León"],
  "Corona de Aragón": ["Aragón", "Condado de Barcelona", "Valencia", "Mallorca", "Cerdeña", "Trinacria", "Nápoles", "Gandía", "Urgel"],
  Portugal: ["Brasil"],
  Navarra: [],

  "Sacro Imperio": [
    "Alemania", "Austria", "Austria Interior", "Baviera", "Bohemia",
    "Condado de Borgoña", "Brabante", "Carintia", "Cléveris", "Flandes", "Habsburgo",
    "Henao", "Holanda", "Zelanda", "Limburgo", "Lorena", "Luxemburgo", "Milán",
    "Monferrato", "Saluzzo", "Moravia", "Nassau", "Países Bajos", "Palatinado", "Palatinado-Neoburgo", "Ravensberg",
    "Piamonte", "Saboya", "Sajonia", "Silesia", "Suabia", "Tirol",
    "Turingia", "Württemberg", "Pomerania", "Jülich", "Berg",
    "Hesse-Kassel", "Hesse-Darmstadt", "Baden", "Brunswick", "Mecklemburgo", "Oldemburgo", "Mark",
    "Ansbach", "Kulmbach", "Anhalt", "Brandeburgo", "Ginebra", "Güeldres",
    "Hannover", "Hesse", "Hohenberg", "Holstein", "Kyburg", "Meißen",
    "Montbéliard", "Namur", "Núremberg", "Pfirt", "Sajonia-Lauenburgo",
  ],
  Austria: ["Austria Interior", "Carintia", "Carniola", "Ducado de Estiria", "Austria Anterior", "Habsburgo", "Tirol"],
  "Austria Interior": ["Ducado de Estiria", "Carintia", "Carniola"],
  "Provincias Unidas": ["Estados de Holanda", "Holanda", "Zelanda", "Frisia", "Utrecht", "Overijssel", "Drente", "Groninga", "Güeldres", "Brabante de los Estados", "Flandes de los Estados"],
  Bohemia: ["Moravia", "Silesia"],
  Baviera: [],

  // Agrupación de navegación: no afirma que estos feudos formasen un Estado
  // unitario. Las incorporaciones de Carlos V se distinguen de la herencia.
  "Borgoña y Países Bajos": ["Borgoña y Franco Condado", "Países Bajos y Flandes", "Incorporaciones del siglo XVI"],
  "Borgoña y Franco Condado": ["Borgoña", "Condado de Borgoña", "Nevers", "Rethel", "Auxerre", "Ponthieu"],
  "Países Bajos y Flandes": ["Países Bajos", "Artois", "Flandes", "Brabante", "Limburgo", "Henao", "Holanda", "Zelanda", "Luxemburgo", "Namur"],
  "Incorporaciones del siglo XVI": ["Güeldres", "Frisia", "Utrecht", "Overijssel", "Drente", "Groninga"],

  "Estados Italianos": [
    "Estados Pontificios", "Venecia", "Génova", "Ferrara", "Florencia", "Forlì", "Gravina",
    "Mantua", "Módena", "Milán", "Monferrato", "Saluzzo", "Nápoles", "Parma", "Pesaro", "Urbino",
    "Piamonte", "Romaña", "Saboya", "Sicilia", "Tarento", "Toscana",
    "Trinacria", "Anagni", "Bisceglie", "Brescia", "Camerino", "Cerdeña",
    "Cervia", "Cesena", "Como", "Fano", "Imola", "Ischia", "Lacio",
    "Liguria", "Perugia", "Roma", "Rímini", "Siena", "Squillace",
  ],

  Hungría: ["Transilvania", "Transilvania habsbúrgica", "Banato de Temes", "Croacia", "Eslavonia", "Sirmia", "Condado de Temes", "Condado de Bihar"],
  "Polonia-Lituania": ["Lituania", "Polonia", "Silesia", "Curlandia", "Mazovia"],
  "Bizancio y Oriente latino": [
    "Bizancio", "Durazzo", "Imperio Latino", "Antioquía", "Armenia", "Chipre",
    "Edesa", "Epiro", "Ibelin", "Jerusalén", "Morea", "Nablus", "Torón",
    "Transjordania", "Trípoli", "Trebisonda",
  ],
  Balcanes: ["Imperio otomano", "Albania", "Dobruja", "Eslavonia", "Zeta", "Kosovo", "Prilep", "Bulgaria", "Serbia", "Bosnia", "Herzegovina", "Valaquia", "Moldavia", "Croacia", "Sirmia", "Epiro"],
  Escandinavia: ["Dinamarca", "Noruega", "Suecia", "Holstein", "Schleswig"],
  Rusia: ["Beloózero", "Moscú", "Pólotsk", "Rus de Kiev", "Vladímir"],
};

const SUBTERRITORIOS_CACHE = new Map();

export function subterritoriosDeFiltro(filtro) {
  if (SUBTERRITORIOS_CACHE.has(filtro)) return SUBTERRITORIOS_CACHE.get(filtro);
  const encontrados = new Set();
  const visitar = (actual) => {
    (TERRITORIOS_SUB[actual] || []).forEach((hijo) => {
      if (encontrados.has(hijo)) return;
      encontrados.add(hijo);
      visitar(hijo);
    });
  };
  visitar(filtro);
  const resultado = [...encontrados];
  SUBTERRITORIOS_CACHE.set(filtro, resultado);
  return resultado;
}

export function territorioCoincideConFiltro(territorio, filtro) {
  if (!territorio || !filtro) return false;
  return territorio === filtro || subterritoriosDeFiltro(filtro).includes(territorio);
}
