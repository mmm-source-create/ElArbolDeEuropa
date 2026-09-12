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
export const HISTORIA_TERRITORIOS = Object.freeze({...r0,...r1,...r2,...r3,...r4,...r5,...fronteras,...ampliacion,...casas,...paisesBajos});

export { FUENTES_TERRITORIOS } from "../sources.js";
