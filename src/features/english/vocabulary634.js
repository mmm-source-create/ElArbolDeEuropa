// 6.3.4 · Crown titles, Angevin Provence, the French occupation of Savoy and
// new dependencies (English parity).
const ALTA_NOTA = 'Bautzen desde 1319 y Görlitz desde 1329. Los estamentos y las Seis Ciudades conservan su autonomía. Cedida al elector de Sajonia en la paz de Praga de 1635.';
const ALTA_EN = 'Bautzen from 1319 and Görlitz from 1329. The estates and the Six Towns kept their autonomy. Ceded to the elector of Saxony at the Peace of Prague in 1635.';
const BAJA_NOTA = 'Comprado por Carlos IV en 1367 e incorporado a la Corona. Los empeños y los señoríos brandeburgueses (Cottbus) se fechan aparte. Cedido al elector de Sajonia en la paz de Praga de 1635.';
const BAJA_EN = 'Bought by Charles IV in 1367 and incorporated into the Crown. Pledges and the Brandenburg lordships (Cottbus) are dated separately. Ceded to the elector of Saxony at the Peace of Prague in 1635.';
const SAXON = ' Ocupada por el elector de Sajonia desde 1620 y empeñada a él en 1623.';
const SAXON_EN = ' Occupied by the elector of Saxony from 1620 and pledged to him in 1623.';

export const LABELS_634 = {
  'Reino de Tremecén · vasallo de la Monarquía Hispánica': 'Kingdom of Tlemcen · vassal of the Spanish Monarchy',
  'Piombino · feudo de la Monarquía Hispánica': 'Piombino · fief of the Spanish Monarchy',
};

export const NOTES_634 = {
  'Rey de la corona croato-húngara, de la que forma parte Eslavonia, desde su coronación de 1385, con oposición de los partidarios de María.':
    'King of the Croatian-Hungarian crown, which includes Slavonia, from his coronation in 1385, opposed by the supporters of Mary.',
  [ALTA_NOTA]: ALTA_EN,
  [BAJA_NOTA]: BAJA_EN,
  [ALTA_NOTA + SAXON]: ALTA_EN + SAXON_EN,
  [BAJA_NOTA + SAXON]: BAJA_EN + SAXON_EN,
  'Las Lusacias se suman a la Confederación bohemia de 1619 que lo elige rey; ocupadas por el elector de Sajonia en 1620.':
    'The Lusatias joined the Bohemian Confederation of 1619 that elected him king; occupied by the elector of Saxony in 1620.',
  'Reino de Eslavonia, unido a Croacia bajo los banes dentro de la Corona húngara; banes y duques se registran aparte.':
    'Kingdom of Slavonia, joined to Croatia under the bans within the Hungarian Crown; bans and dukes are recorded separately.',
  'Heredera de Ramón Berenguer IV, con Forcalquier.': 'Heiress of Raymond Berengar IV, with Forcalquier.',
  'Conde de Provenza y Forcalquier por su matrimonio con Beatriz.': 'Count of Provence and Forcalquier through his marriage to Beatrice.',
  'Conserva Provenza y Forcalquier tras la muerte de Beatriz (1267).': 'Kept Provence and Forcalquier after Beatrice’s death (1267).',
  'Ocupación francesa de Saboya, Bresse y Bugey desde 1536 hasta la paz de Cateau-Cambrésis (1559). Carlos III conserva el título ducal; Manuel Filiberto recupera sus Estados.':
    'French occupation of Savoy, Bresse and Bugey from 1536 until the Peace of Cateau-Cambrésis (1559). Charles III kept the ducal title; Emmanuel Philibert recovered his states.',
  'El Instrumento de Gobierno de 1653 lo nombra Lord Protector de la Mancomunidad de Inglaterra, Escocia e Irlanda.':
    'The Instrument of Government of 1653 named him Lord Protector of the Commonwealth of England, Scotland and Ireland.',
};
