// La cronología de los dogos describe un cargo público; no añade parentescos
// entre familias diferentes ni convierte el dominio veneciano en patrimonio.
const DOGES = [
  ['MICHELE_STENO_DOGE',1400,1413],['PASQUALE_MALIPIERO_DOGE',1457,1462],
  ['CRISTOFORO_MORO_DOGE',1462,1471],['NICOLO_TRON_DOGE',1471,1473],
  ['NICOLO_MARCELLO_DOGE',1473,1474],['PIETRO_MOCENIGO_DOGE',1474,1476],
  ['ANDREA_VENDRAMIN_DOGE',1476,1478],['GIOVANNI_MOCENIGO_DOGE',1478,1485],
  ['MARCO_BARBARIGO_DOGE',1485,1486],['ANTONIO_GRIMANI_DOGE',1521,1523],
  ['PIETRO_LANDO_DOGE',1539,1545],['FRANCESCO_DONA_DOGE',1545,1553],
  ['MARCANTONIO_TREVISAN_DOGE',1553,1554],['FRANCESCO_VENIER_DOGE',1554,1556],
  ['LORENZO_PRIULI_DOGE',1556,1559],['GIROLAMO_PRIULI_DOGE',1559,1567],
  ['PIETRO_LOREDAN_DOGE',1567,1570],['ALVISE_MOCENIGO_I_DOGE',1570,1577],
  ['NICOLO_DA_PONTE_DOGE',1578,1585],['PASQUALE_CICOGNA_DOGE',1585,1595],
];
export const VENECIA_PIGNATELLI_V45 = {
  ...Object.fromEntries(DOGES.map(([id,desde,hasta]) => [id, {
    resumen: `Dogo de la República de Venecia entre ${desde} y ${hasta}. La dignidad era electiva: su mandato permite seguir la continuidad institucional, pero no implica propiedad familiar de los territorios venecianos.`,
  }])),
  PAPA_INOCENCIO12: {
    resumen: 'Antonio Pignatelli, de la rama de Cerchiara, fue papa como Inocencio XII. Sus padres fueron Francesco Pignatelli de Spinazzola y Porzia Carafa; la carrera pontificia no debe confundirse con los señoríos familiares napolitanos.',
  },
  CARD_FRANCESCO_PIGN: {
    resumen: 'Cardenal teatino y arzobispo de Nápoles. Era pariente de Inocencio XII por una rama distinta de los Pignatelli, no sobrino directo del papa.',
  },
  NICOLA_PIGN_VICERE: {
    resumen: 'Hermano del cardenal Francesco Pignatelli. Ocupó virreinatos en Cerdeña y Sicilia; un virrey administraba en nombre de la monarquía y no era soberano de esos territorios.',
  },
};
