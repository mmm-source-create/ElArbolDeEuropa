import fronteras from "./fronteras-v272.js";
import r0 from "./iberia.js";
import r1 from "./francia.js";
import r2 from "./imperio.js";
import r3 from "./italia.js";
import r4 from "./europa-oriental.js";
import r5 from "./islas-norte.js";
export const HISTORIA_TERRITORIOS = Object.freeze({...r0,...r1,...r2,...r3,...r4,...r5,...fronteras});

export const FUENTES_TERRITORIOS = {
  Georgia: [{titulo: "Encyclopaedia Iranica: relaciones entre Georgia e Irán", url: "https://www.iranicaonline.org/articles/georgia-ii-history/"}],
  "Kartli-Kajetia": [{titulo: "Encyclopaedia Iranica: Heraclio II", url: "https://www.iranicaonline.org/articles/erekle-ii/"}],
  Kartli: [{titulo: "Encyclopaedia Iranica: Kartli", url: "https://www.iranicaonline.org/articles/kartli/"}],
  Irlanda: [{titulo: "Dictionary of Irish Biography: Ruaidrí Ua Conchobair", url: "https://www.dib.ie/biography/ua-conchobair-ruaidri-a8725"}, {titulo: "Dictionary of Irish Biography: Hugh O’Neill", url: "https://www.dib.ie/index.php/biography/oneill-hugh-a6962"}],
  Leinster: [{titulo: "Dictionary of Irish Biography: Diarmait Mac Murchada", url: "https://www.dib.ie/biography/mac-murchada-diarmait-macmurrough-dermot-a5075"}],
  Trinacria: [{titulo: "Treccani: Federico de Aragón, rey de Sicilia", url: "https://www.treccani.it/enciclopedia/federico-iii-d-aragona-re-di-sicilia_(Dizionario-Biografico)/"}],
  Transilvania: [{titulo: "Leibniz-Institut: Gábor Bethlen", url: "https://www.biolex.ios-regensburg.de/BioLexViewview.php?start=186"}],
  Castilla: [{titulo:"Ministerio de Cultura: Corona de Castilla",url:"https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html"}],
  León: [{titulo:"Ministerio de Cultura: Corona de Castilla",url:"https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html"}],
  "Corona de Castilla": [{titulo:"Ministerio de Cultura: Corona de Castilla",url:"https://tesauros.cultura.gob.es/tesauros/contextosculturales/1172659.html"}],
  Carintia: [{titulo:"Treccani: Enrico, conte del Tirolo e duca di Carinzia",url:"https://www.treccani.it/enciclopedia/enrico-conte-del-tirolo-e-duca-di-carinzia_(Enciclopedia-Italiana)/"}],
  Sajonia: [{titulo:"British Museum: Maurice, Elector of Saxony",url:"https://www.britishmuseum.org/collection/term/BIOG152590"}],
};
