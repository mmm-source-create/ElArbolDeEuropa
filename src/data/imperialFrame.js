// Marco jurídico regional del Sacro Imperio, separado de los gobiernos
// efectivos de cada emperador. Los polígonos del SVG no son fronteras feudales.
// Véase docs/CARTOGRAFIA_SACRO_IMPERIO.md para fuentes y exclusiones.
const GERMAN_CORE = [
  'Emsland','Wesermarch','East_Friesland','Aller','Elbmarch','Luneburger_Heide',
  'Holstein','Vorpommern','Stettin','Seenplatte','Schwerin','Lubeck','Neumark',
  'Lower_Carniola','Upper_Carniola','Gorizia','Lower_Styria','Middle_Styria',
  'Lower_Carinthia','Upper_Carinthia','South_Tirol','Pongau','Upper_Styria',
  'Eastern_Styria','Ober_dem_Wienerwald','Traungau','Unter_dem_Wienerwald',
  'Salzburger_Land','Unterinntal','Oberinntal','Pinzgau','Schaunberg','Gauboden',
  'Bayerischer_Wald','Muhlviertel','Oberpfalzer_Wald','Vogtland','Thuringer_Becken',
  'Harz','Magdeburger_Borde','Hunsruck','Sarregueminois','Rhine_Valley',
  'Schwarzwald','Swabian_Alb','Eastern_Upper_Swabia','Munchner_Schotterebene',
  'Alpenvorland','Chiemgau','Allgau','Western_Upper_Swabia','Hegau',
  'Hohenloher_Ebene','Franconian_Alb','Erzgebirge','Leipziger_Bucht',
  'Frankische_Schweiz','Donau_Moos','Tauberfranken','Odenwald','Untermain',
  'Palatinate','Kraichgau','Neckar','Eifel','Koln_Bucht','Julich',
  'Bergisches_Land','Ruhr','Munsterland','Ostwestphalia','Hanover','Leine',
  'Middle_Weser','Lippe','Hessen_Bergland','Vogelsberg','Spessart',
  'Main_Franconia','Ries','Wetterau','Taunus','Sauerland','Westerwald',
  'Thuringer_Wald','Frankenwald','Elbtal','Niederlausitz','Oberlausitz',
  'Flaming','Mittelmark','Uckermark','Prignitz','Altmark','Saale','Brunswick',
  'Unter_dem_Manhartsberg','Ober_dem_Manhartsberg','Vorarlberg',
];

const BOHEMIAN_CROWN = [
  'Hradecko','Hradistsko','Brnensko','Znojemsko','Olomoucko','Chrudimsko',
  'Boleslavsko','Prague','Bechinsko','Prachensko','Zatecko','Litomericko',
  'Chebsko','Plzensko',
];

// Las tierras de la Corona de Bohemia no integraban un círculo imperial.
const SILESIA = ['Olesnica','Opole','Tesin','Opavsko','Wroclaw','Swidnica','Legnica','Glogow','Zagan'];
const BURGUNDIAN_CIRCLE = [
  'Brabant','Namur','Liege','Loon','Limburg','Niederrhein','Gelderland',
  'Kempenland','Antwerp','Hainaut','East_Luxembourg','West_Luxembourg',
];
const NORTHERN_NETHERLANDS = [
  'Ommelanden','Friesland','Overijssel','North_Holland','South_Holland','Drenthe',
];
const SWISS_CONFEDERATION = [
  'Thurgau','Aargau','Bern','Vaud','Neuchatel','Waldstatte','Graubunden',
  'Ticino','Oberwallis',
];
const IMPERIAL_ITALY = [
  'Milano','Monza','Pavia','Cremona','Novara','Alessandria','Mantua',
  'Modena','Reggioem','Monferrato','Savoy','Aosta','Torino','Mondovi',
];
const ALSACE_AND_METZ = [
  'Lower_Alsace','Upper_Alsace','Vosges','Pays_Messin',
];
// El Franco Condado siguió siendo un feudo imperial hasta su cesión a Francia
// en el tratado de Nimega de 1678; el ducado de Borgoña no se incluye.
const COUNTY_OF_BURGUNDY = ['Amont','Millieu','Aval'];

export const IMPERIAL_FRAME_SOURCES = Object.freeze([
  'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:map-2809',
  'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/central-europe-1648',
  'https://www.ieg-maps.uni-mainz.de/mapsp/mapp792d.htm',
  'https://documentsdedroitinternational.fr/1678-17-septembre-traite-de-nimegue/',
]);

// La capa es deliberadamente conservadora: omite lugares cuyo estatuto
// imperial no puede inferirse del nombre de una región moderna del SVG.
export function imperialFrameIds(year) {
  // No extrapolamos el mapa de círculos de 1512 a la Edad Media ni la
  // referencia de 1792 a las guerras revolucionarias y napoleónicas.
  if (!Number.isFinite(year) || year < 1512 || year > 1792) return [];
  const ids = [
    ...GERMAN_CORE,
    ...BOHEMIAN_CROWN,
    ...BURGUNDIAN_CIRCLE,
    ...IMPERIAL_ITALY,
  ];
  if (year >= 1335) ids.push(...SILESIA);
  if (year < 1648) ids.push(...NORTHERN_NETHERLANDS, ...SWISS_CONFEDERATION);
  if (year < 1648) ids.push(...ALSACE_AND_METZ);
  if (year < 1678) ids.push(...COUNTY_OF_BURGUNDY);
  return [...new Set(ids)];
}
