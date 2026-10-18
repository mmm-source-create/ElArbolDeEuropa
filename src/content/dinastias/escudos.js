// Arms of the principal houses, drawn by DynastyArms from these layers.
// Each blazon gives the best-known form; arms changed over time and branches
// added differences, which the note states when the drawing simplifies them.
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
  'Estuardo': {blason: 'De oro, un león rampante de gules dentro de un doble trechor de gules.', capas: [['campo', 'oro'], ['trechor', 'gules'], ['figura', 'leon', 'gules']],
    nota: 'Armas de Escocia; el trechor se dibuja sin flores de lis.'},
  'Valois-Borgoña': {blason: 'Cuartelado: 1.º y 4.º, de azur, tres flores de lis de oro, bordura componada de plata y gules; 2.º y 3.º, bandado de oro y azur, bordura de gules.',
    capas: [['cuartelado', [[...FRANCIA_MODERNA, ['bordura-componada', 'plata', 'gules']], BORGONA_ANTIGUA, BORGONA_ANTIGUA, [...FRANCIA_MODERNA, ['bordura-componada', 'plata', 'gules']]]]],
    nota: 'Versión simplificada: se omiten Brabante, Limburgo y el escusón de Flandes de las armas plenas.'},
  'Ivrea-Borgoña': CASTILLA_LEON,
  'Trastámara': CASTILLA_LEON,
  'Barcelona': {blason: 'De oro, cuatro palos de gules.', capas: [['palado', 'oro', 'gules', 9]]},
  'Foix': {blason: 'De oro, tres palos de gules.', capas: [['palado', 'oro', 'gules', 7]]},
  'Avís': {blason: 'De plata, cinco escudetes de azur puestos en cruz, cargados de bezantes de plata; bordura de gules con castillos de oro.', capas: PORTUGAL},
  'Braganza': {blason: 'De plata, cinco escudetes de azur puestos en cruz, cargados de bezantes de plata; bordura de gules con castillos de oro.', capas: PORTUGAL,
    nota: 'Las armas reales de Portugal, que la casa llevó desde 1640.'},
  'Habsburgo': {blason: 'De oro, un león rampante de gules.', capas: [['campo', 'oro'], ['figura', 'leon', 'gules']],
    nota: 'Armas originarias de la casa. Como archiduques usaron además la faja de plata sobre gules de Austria.'},
  'Luxemburgo': {blason: 'Burelado de plata y azur, un león rampante de gules.', capas: [['fajado', 'plata', 'azur', 10], ['figura', 'leon', 'gules']]},
  'Wittelsbach': {blason: 'Fusado en banda de plata y azur.', capas: [['fusado', 'plata', 'azur']],
    nota: 'Los rombos de Baviera. La rama palatina añadió el león de oro del Palatinado.'},
  'Hohenzollern': {blason: 'Cuartelado de plata y sable.', capas: [['cuartelado-liso', 'plata', 'sable']]},
  'Wettin': {blason: 'Burelado de sable y oro, con un crancelín de sinople en banda.', capas: [['fajado', 'sable', 'oro', 10], ['crancelin', 'sinople']]},
  'Hohenstaufen': {blason: 'De oro, tres leones pasantes de sable.', capas: [['campo', 'oro'], ['figura', 'leopardo', 'sable', 'tres-palo']],
    nota: 'Armas del ducado de Suabia asociadas a la casa.'},
  'Welf': {blason: 'De gules, dos leopardos de oro.', capas: [['campo', 'gules'], ['figura', 'leopardo', 'oro', 'dos-palo']],
    nota: 'Armas de Brunswick, la rama ducal de la casa.'},
  'Hesse': {blason: 'De azur, un león rampante burelado de plata y gules.', capas: [['campo', 'azur'], ['figura', 'leon', 'plata']],
    nota: 'El burelado del león se omite en el dibujo.'},
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
  'Přemysl': {blason: 'De gules, un león rampante de plata.', capas: [['campo', 'gules'], ['figura', 'leon', 'plata']],
    nota: 'El león de Bohemia, de cola doble y coronado de oro, se dibuja simplificado.'},
  'Piast': {blason: 'De gules, un águila de plata.', capas: [['campo', 'gules'], ['figura', 'aguila', 'plata']],
    nota: 'El águila blanca de Polonia, coronada de oro desde Przemysł II.'},
  'Lusignan': {blason: 'Burelado de plata y azur.', capas: [['fajado', 'plata', 'azur', 10]],
    nota: 'Armas de la casa en Poitou; los reyes de Chipre añadieron un león de gules.'},
  'Oldemburgo': {blason: 'De oro, dos fajas de gules.', capas: [['fajado', 'oro', 'gules', 5]],
    nota: 'Armas del condado de Oldemburgo. Los reyes de Dinamarca llevaron las armas del reino.'},
  'Estridsen': {blason: 'De oro, sembrado de corazones de gules, tres leones pasantes de azur.', capas: [['campo', 'oro'], ['sembrado', 'corazon', 'gules', .11, 15], ['figura', 'leopardo', 'azur', 'tres-palo']],
    nota: 'Las armas de Dinamarca, documentadas desde Canuto VI.'},
});

export const escudoDe = dinastia => ESCUDOS[dinastia] || null;
