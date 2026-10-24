const source = locator => ({title:'Hermann Heimpel · Friedrich I. Barbarossa, Neue Deutsche Biographie 5 (1961)',url:'https://www.deutsche-biographie.de/sfz69823.html',locator});
const review = (locator, extra = {}) => ({certainty:'documented',sources:[source(locator)],reviewedAt:'2026-10-24',editor:'El Árbol de Europa',...extra});
export const BARBAROSSA_REVIEWS = {
  'person:FED1BARBARROJA:birth':review('Cabecera y biografía: nacimiento probablemente en 1122.',{certainty:'approximate'}),
  'person:FED1BARBARROJA:death':review('Cabecera: ahogado el 10 de junio de 1190 en el Saleph.',{exactDate:'1190-06-10'}),
  'person:FED1BARBARROJA:government:Alemania:1152:1190:Rey de Romanos':review('Elección en Fráncfort el 5 de marzo de 1152 y coronación en Aquisgrán el 9 de marzo; muerte en 1190.'),
  'person:FED1BARBARROJA:government:Sacro Imperio:1155:1190:Emperador':review('Coronación imperial en Roma en 1155; muerte durante la Tercera Cruzada en 1190.'),
  'person:FELIPESUABIA:father':review('Genealogía: Felipe de Suabia figura entre los hijos de Federico I y Beatriz de Borgoña.'),
};
