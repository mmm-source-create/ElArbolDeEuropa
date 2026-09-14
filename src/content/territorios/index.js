import {TERRITORIOS_ADRIATICO,TRANSILVANIA_ADRIATICO} from "./adriatico-v214.js";
import alpes from "./alpes-v213.js";
import escandinavia from "./escandinavia-v212.js";
import paisesBajos from "./paises-bajos-v211.js";
import ampliacion from "./fronteras-v28.js";
import casas from "./casas-v210.js";
import fronteras from "./fronteras-v272.js";
import r0 from "./iberia.js";
import r1 from "./francia.js";
import r2 from "./imperio.js";
import r3 from "./italia.js";
import r4 from "./europa-oriental.js";
import r5 from "./islas-norte.js";
const historiaAnterior = {...r0,...r1,...r2,...r3,...r4,...r5,...fronteras,...ampliacion,...casas,...paisesBajos,...escandinavia,...alpes};
// Conserva los hitos anteriores. Una revisión del mismo año sustituye solo ese hito.
const ampliacionAdriatica = Object.fromEntries(Object.entries({...TERRITORIOS_ADRIATICO,Transilvania:TRANSILVANIA_ADRIATICO}).map(([nombre,historia])=>{
  const hitos = new Map((historiaAnterior[nombre]?.evolucion || []).map(h=>[h.anio,h]));
  for(const h of historia.evolucion) hitos.set(h.anio,h);
  return [nombre,{...historia,evolucion:[...hitos.values()].sort((a,b)=>a.anio-b.anio)}];
}));
export const HISTORIA_TERRITORIOS = Object.freeze({...historiaAnterior,...ampliacionAdriatica});

export { FUENTES_TERRITORIOS } from "../sources.js";
