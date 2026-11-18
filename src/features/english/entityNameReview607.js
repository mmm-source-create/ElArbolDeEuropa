// 6.0.7: English display names of the most frequent houses and territories,
// checked against English-language historiography. Keys, IDs and published
// URLs are unchanged; only the visible name is corrected.
export const DYNASTY_NAMES_607 = Object.freeze({
  'Saboya':'Savoy',
  'Estuardo':'Stuart',
  'Rurikida':'Rurikid',
  'Jagellón':'Jagiellon',
  'Hetúmida':'Hethumid',
  'Bogdan-Mușat':'Bogdan-Mușat',
  'Borja':'Borgia',
  'Borgoña-Portugal':'Portuguese House of Burgundy',
  'Valois-Angulema':'Valois-Angoulême',
  'Farnesio':'Farnese',
  'Gedimínida':'Gediminid',
  'Hannover':'Hanover',
  'Valois-Orleans':'Valois-Orléans',
  'Montfort-Bretaña':'Montfort of Brittany',
  'Gran Comneno':'Grand Komnenos',
  'O’Neill':'O’Neill',
  'Paleólogo-Monferrato':'Palaiologos-Montferrat',
});
export const TERRITORY_NAMES_607 = Object.freeze({
  'Moldavia':'Moldavia',
  'Países Bajos':'Low Countries',
  'Palatinado':'Palatinate',
  'Holanda':'Holland',
  'Bearne':'Béarn',
  'Meißen':'Meissen',
  'Austria Interior':'Inner Austria',
  'Pallars Sobirà':'Pallars Sobirà',
});
// Labels shown in the Atlas, filters and government lists.
export const ENTITY_LABELS_607 = Object.freeze({
  ...Object.fromEntries(Object.entries(DYNASTY_NAMES_607)),
  ...Object.fromEntries(Object.entries(TERRITORY_NAMES_607)),
  'Plantagenet-Lancaster':'Lancaster',
  'Plantagenet-York':'York',
});
export const reviewDynastyName=entity=>DYNASTY_NAMES_607[entity.key]?{...entity,name:DYNASTY_NAMES_607[entity.key]}:entity;
export const reviewTerritoryName=entity=>TERRITORY_NAMES_607[entity.key]?{...entity,name:TERRITORY_NAMES_607[entity.key]}:entity;
