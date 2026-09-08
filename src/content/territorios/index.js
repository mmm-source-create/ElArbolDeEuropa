import r0 from "./iberia.js";
import r1 from "./francia.js";
import r2 from "./imperio.js";
import r3 from "./italia.js";
import r4 from "./europa-oriental.js";
import r5 from "./islas-norte.js";
export const HISTORIA_TERRITORIOS = Object.freeze({...r0,...r1,...r2,...r3,...r4,...r5});

export const FUENTES_TERRITORIOS = {
  Castilla: [{titulo:"Ministerio de Cultura: Corona de Castilla",url:"https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html"}],
  León: [{titulo:"Ministerio de Cultura: Corona de Castilla",url:"https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html"}],
  "Corona de Castilla": [{titulo:"Ministerio de Cultura: Corona de Castilla",url:"https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html"}],
  Carintia: [{titulo:"Treccani: Enrico, conte del Tirolo e duca di Carinzia",url:"https://www.treccani.it/enciclopedia/enrico-conte-del-tirolo-e-duca-di-carinzia_(Enciclopedia-Italiana)/"}],
  Sajonia: [{titulo:"British Museum: Maurice, Elector of Saxony",url:"https://www.britishmuseum.org/collection/term/BIOG152590"}],
};
