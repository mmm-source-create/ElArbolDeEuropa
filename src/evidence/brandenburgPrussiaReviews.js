// V5.34 · Brandeburgo-Prusia: la Prusia ducal de Federico I antes de 1701 y
// Cléveris en manos de los reyes de Prusia.
const SOURCES = Object.freeze({
 "ndbFried1": {
  "title": "Neue Deutsche Biographie · Friedrich I., König in Preußen",
  "url": "https://www.deutsche-biographie.de/pnd118535730.html",
  "locator": "Königsberg, 11.7.1657 – Berlín, 25.2.1713; elector Federico III de Brandeburgo; busca un título regio para la Prusia soberana, fuera del Imperio; coronación en Königsberg el 18.1.1701."
 },
 "treccaniPrussia": {
  "title": "Treccani · Enciclopedia Italiana · Prussia",
  "url": "https://www.treccani.it/enciclopedia/prussia/",
  "locator": "Ravensberg, Mark y Cléveris figuran entre los territorios de Brandeburgo-Prusia."
 },
 "treccaniGermania": {
  "title": "Treccani · Enciclopedia Italiana · Germania",
  "url": "https://www.treccani.it/enciclopedia/germania_(Enciclopedia-Italiana)/",
  "locator": "El acuerdo de 1614 da Cléveris y Mark a Brandeburgo."
 }
});
const review = (keys, note) => ({certainty: 'documented', sources: keys.map(key => SOURCES[key]), note, reviewedAt: '2026-10-19', editor: 'El Árbol de Europa'});
export const BRANDENBURG_PRUSSIA_REVIEWS = Object.freeze({
  "person:FRED1PRUSSIA:government:Prusia:1688:1700:Duque": review(["ndbFried1"], "Duque soberano de Prusia desde 1688; rey en Prusia desde enero de 1701."),
  "person:FREDWIL1PRU:government:Cléveris:1713:1740:Duque": review(["treccaniGermania", "treccaniPrussia"], "Cléveris, de los Hohenzollern desde 1614, sigue en manos del rey de Prusia."),
  "person:FRED2PRUSSIA:government:Cléveris:1740:1786:Duque": review(["treccaniGermania", "treccaniPrussia"], "Cléveris, de los Hohenzollern desde 1614, sigue en manos del rey de Prusia."),
  "person:FREDWIL2PRU:government:Cléveris:1786:1794:Duque": review(["treccaniGermania", "treccaniPrussia"], "Cléveris sigue en manos del rey de Prusia hasta la cesión de la orilla izquierda del Rin a Francia (1795)."),
});
