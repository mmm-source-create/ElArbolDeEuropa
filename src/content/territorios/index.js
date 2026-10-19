import germanSwiss from './german-swiss.js';
import germanyCompletion from './germany-completion.js';
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
import bosniaHum from './bosnia-hum.js';
const historiaAnterior = {...r0,...r1,...r2,...r3,...r4,...r5,...fronteras,...ampliacion,...casas,...paisesBajos,...escandinavia,...alpes};
// Conserva los hitos anteriores. Una revisión del mismo año sustituye solo ese hito.
const ampliacionAdriatica = Object.fromEntries(Object.entries({...TERRITORIOS_ADRIATICO,Transilvania:TRANSILVANIA_ADRIATICO}).map(([nombre,historia])=>{
  const hitos = new Map((historiaAnterior[nombre]?.evolucion || []).map(h=>[h.anio,h]));
  for(const h of historia.evolucion) hitos.set(h.anio,h);
  return [nombre,{...historia,evolucion:[...hitos.values()].sort((a,b)=>a.anio-b.anio)}];
}));
const previous = {...historiaAnterior,...ampliacionAdriatica,...bosniaHum};
const reviewedGermanSwiss = Object.fromEntries(Object.entries(germanSwiss).map(([name,entry]) => {
  const events = new Map((previous[name]?.evolucion || []).map(event => [event.anio,event]));
  for (const event of entry.evolucion) events.set(event.anio,event);
  return [name,{...previous[name],...entry,evolucion:[...events.values()].sort((a,b) => a.anio-b.anio)}];
}));
export const HISTORIA_TERRITORIOS = Object.freeze({...previous,...reviewedGermanSwiss,...germanyCompletion});

export { FUENTES_TERRITORIOS } from "../sources.js";
