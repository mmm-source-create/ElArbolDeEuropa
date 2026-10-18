import {ESCUDOS_COMMONS} from './escudosCommons.js';
// Arms of the principal houses. A Wikimedia Commons image is shown with its
// credit when one was reviewed for the house; otherwise DynastyArms draws the
// blazon from these layers. Arms changed over time and branches added
// differences, which the note states when the image or drawing simplifies them.
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
  'Capeto': {blason: 'De azur, sembrado de flores de lis de oro.', capas: FRANCIA_ANTIGUA,
    nota: 'Las armas de Francia «antigua», usadas por los reyes hasta Carlos V.'},
  'Valois': {blason: 'De azur, tres flores de lis de oro.', capas: FRANCIA_MODERNA,
    nota: 'Francia «moderna»: Carlos V redujo el sembrado a tres lises.'},
  'Valois-Angulema': {blason: 'De azur, tres flores de lis de oro.', capas: FRANCIA_MODERNA},
  'Borbón': {blason: 'De azur, tres flores de lis de oro, con una cotiza de gules en banda.', capas: [...FRANCIA_MODERNA, ['cotiza', 'gules']],
    nota: 'Armas de los duques de Borbón. Desde Enrique IV, los reyes llevaron las de Francia y Navarra.'},
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
  'Ivrea-Borgoña': CASTILLA_LEON,
  'Trastámara': CASTILLA_LEON,
  'Barcelona': {blason: 'De oro, cuatro palos de gules.', capas: [['palado', 'oro', 'gules', 9]]},
  'Foix': {blason: 'De oro, tres palos de gules.', capas: [['palado', 'oro', 'gules', 7]]},
  'Avís': {blason: 'De plata, cinco escudetes de azur puestos en cruz, cargados de bezantes de plata; bordura de gules con castillos de oro.', capas: PORTUGAL},
  'Braganza': {blason: 'De plata, un sotuer de gules cargado de cinco escudetes de Portugal.', capas: PORTUGAL,
    nota: 'Armas de los duques de Braganza. Como reyes, desde 1640, llevaron las armas de Portugal.'},
  'Habsburgo': {blason: 'De oro, un león rampante de gules.', capas: [['campo', 'oro'], ['figura', 'leon', 'gules']],
    nota: 'Armas originarias de la casa, con su cimera. Como archiduques usaron además la faja de plata sobre gules de Austria.'},
  'Luxemburgo': {blason: 'Burelado de plata y azur, un león rampante de gules.', capas: [['fajado', 'plata', 'azur', 10], ['figura', 'leon', 'gules']]},
  'Wittelsbach': {blason: 'Fusado en banda de plata y azur.', capas: [['fusado', 'plata', 'azur']],
    nota: 'Los rombos de Baviera, con cimera. La rama palatina añadió el león de oro del Palatinado.'},
  'Hohenzollern': {blason: 'Cuartelado de plata y sable.', capas: [['cuartelado-liso', 'plata', 'sable']]},
  'Wettin': {blason: 'Burelado de sable y oro, con un crancelín de sinople en banda.', capas: [['fajado', 'sable', 'oro', 10], ['crancelin', 'sinople']]},
  'Hohenstaufen': {blason: 'De oro, tres leones pasantes de sable.', capas: [['campo', 'oro'], ['figura', 'leopardo', 'sable', 'tres-palo']],
    nota: 'Armas del ducado de Suabia asociadas a la casa.'},
  'Welf': {blason: 'De oro, un león rampante de azur.', capas: [['campo', 'oro'], ['figura', 'leon', 'azur']],
    nota: 'Armas antiguas de la casa. La rama de Brunswick llevó dos leopardos de oro sobre gules.'},
  'Hesse': {blason: 'De azur, un león rampante burelado de plata y gules.', capas: [['campo', 'azur'], ['figura', 'leon', 'plata']]},
  'Brabante': {blason: 'De sable, un león rampante de oro.', capas: [['campo', 'sable'], ['figura', 'leon', 'oro']]},
  'Dampierre': {blason: 'De oro, un león rampante de sable.', capas: [['campo', 'oro'], ['figura', 'leon', 'sable']],
    nota: 'Las armas de Flandes.'},
  'Nassau': {blason: 'De azur, sembrado de billetes de oro, un león rampante de oro.', capas: [['campo', 'azur'], ['sembrado', 'billete', 'oro', .1, 14], ['figura', 'leon', 'oro']]},
  'La Marck': {blason: 'De oro, una faja jaquelada de plata y gules.', capas: [['campo', 'oro'], ['faja-jaquelada', 'plata', 'gules']]},
  'Saboya': {blason: 'De gules, una cruz de plata.', capas: [['campo', 'gules'], ['cruz', 'plata']]},
  'Médici': {blason: 'De oro, cinco roeles de gules y, en jefe, uno mayor de azur cargado de tres flores de lis de oro.', capas: [['campo', 'oro'], ['medici']],
    nota: 'El roel de Francia fue una concesión de Luis XI en 1465.'},
  'Este': {blason: 'De azur, un águila de plata.', capas: [['campo', 'azur'], ['figura', 'aguila', 'plata']]},
  'Árpád': {blason: 'Fajado de gules y plata de ocho piezas.', capas: [['fajado', 'gules', 'plata', 8]]},
  'Přemysl': {blason: 'De plata, un águila de sable con llamas de gules.', capas: [['campo', 'plata'], ['figura', 'aguila', 'sable']],
    nota: 'El águila flamígera de san Wenceslao, emblema de los Přemyslidas. El reino de Bohemia llevó después el león de plata sobre gules.'},
  'Piast': {blason: 'De gules, un águila de plata.', capas: [['campo', 'gules'], ['figura', 'aguila', 'plata']],
    nota: 'El águila blanca de Polonia, coronada de oro desde Przemysł II.'},
  'Lusignan': {blason: 'Burelado de plata y azur.', capas: [['fajado', 'plata', 'azur', 10]],
    nota: 'Armas de la casa en Poitou; los reyes de Chipre añadieron un león de gules.'},
  'Oldemburgo': {blason: 'De oro, dos fajas de gules.', capas: [['fajado', 'oro', 'gules', 5]],
    nota: 'Armas del condado de Oldemburgo. Los reyes de Dinamarca llevaron las armas del reino.'},
  'Estridsen': {blason: 'De oro, sembrado de corazones de gules, tres leones pasantes de azur.', capas: [['campo', 'oro'], ['sembrado', 'corazon', 'gules', .11, 15], ['figura', 'leopardo', 'azur', 'tres-palo']],
    nota: 'Las armas de Dinamarca, documentadas desde Canuto VI.'},
});

const conImagen = new Map(Object.entries(ESCUDOS).map(([dinastia, escudo]) =>
  [dinastia, ESCUDOS_COMMONS[dinastia] ? {...escudo, imagen: ESCUDOS_COMMONS[dinastia]} : escudo]));
export const escudoDe = dinastia => conImagen.get(dinastia) || null;
// Credits for the licences page, one per house.
export const CREDITOS_ESCUDOS = Object.entries(ESCUDOS_COMMONS).map(([dinastia, imagen]) => ({dinastia, ...imagen}));
