import {CONFIRMED_PEOPLE_CONTENT} from './incorporaciones-confirmadas.js';
import {BELTRANEJA_CONTENT} from './beltraneja.js';
import {BARBARROJA_CONTENT} from './barbarroja.js';
import {CASTIGLIONE_CONTENT} from './castiglione.js';
import {AMPLIACION_EDITORIAL} from './ampliacion-editorial.js';
import {LITUANIA_V526} from './lituania-v526.js';
import {ASCANIA_CONTENT} from './ascania.js';
import {ADRIATICO_V214} from "./adriatico-v214.js";
import { ALPES_V213 } from "./alpes-v213.js";
import { ESCANDINAVIA_V212 } from "./escandinavia-v212.js";
import { PAISES_BAJOS_V211 } from "./paises-bajos-v211.js";
import { CASAS_V210 } from "./casas-v210.js";
import { FRONTERAS_V28 } from "./fronteras-v28.js";
import { FRONTERAS_V272 } from "./fronteras-v272.js";
import { SUCESIONES_V27 } from "./sucesiones-v27.js";
import { MONARCAS_MEDIEVALES } from "./monarcas-medievales.js";
import { MONARCAS_MODERNOS } from "./monarcas-modernos.js";
import { PAPAS_RELIGION } from "./papas-religion.js";
import { MILITARES_POLITICOS } from "./militares-politicos.js";
import { CULTURA_PENSAMIENTO } from "./cultura-pensamiento.js";
import { FRONTERAS_ORIENTALES } from "./fronteras-orientales.js";
import { PRINCIPADOS_DUCADOS } from "./principados-ducados.js";
import { VENECIA_PIGNATELLI_V45 } from "./venecia-pignatelli-v45.js";
import { TIROL_V47 } from './tirol-v47.js';
import { CORRIDORS_V48 } from './corridors-v48.js';
import { GOBERNADORES_V55 } from './gobernadores-v55.js';
import { MINIBIOGRAFIAS_V518 } from './minibiografias-v518.js';
import { MINIBIOGRAFIAS_V523 } from './minibiografias-v523.js';
import { MINIBIOGRAFIAS_V524 } from './minibiografias-v524.js';
import { MINIBIOGRAFIAS_V534 } from './minibiografias-v534.js';
import { PERSONAS_V525 } from './personas-v525.js';
import { PERSONAS_V529 } from './personas-v529.js';
import { PERSONAS_V531 } from './personas-v531.js';

export const PERSONA_CONTENT = Object.freeze({
  ...CONFIRMED_PEOPLE_CONTENT,
  ...BELTRANEJA_CONTENT,
  ...BARBARROJA_CONTENT,
  ...LITUANIA_V526,
  ...MONARCAS_MEDIEVALES,
  ...MONARCAS_MODERNOS,
  ...PAPAS_RELIGION,
  ...MILITARES_POLITICOS,
  ...CULTURA_PENSAMIENTO,
  ...FRONTERAS_ORIENTALES,
  ...PRINCIPADOS_DUCADOS,
  ...SUCESIONES_V27,
  ...FRONTERAS_V272,
  ...FRONTERAS_V28,
  ...CASAS_V210,
  ...PAISES_BAJOS_V211,
  ...ESCANDINAVIA_V212,
  ...ALPES_V213,
  ...ADRIATICO_V214,
  ...VENECIA_PIGNATELLI_V45,
  ...TIROL_V47,
  ...CORRIDORS_V48,
  ...GOBERNADORES_V55,
  ...MINIBIOGRAFIAS_V518,
  ...MINIBIOGRAFIAS_V523,
  ...MINIBIOGRAFIAS_V524,
  ...MINIBIOGRAFIAS_V534,
  ...PERSONAS_V525,
  ...PERSONAS_V529,
  ...PERSONAS_V531,
  ...ASCANIA_CONTENT,
  ...AMPLIACION_EDITORIAL,
  ...CASTIGLIONE_CONTENT,
});

export function contenidoPersona(personaOId) {
  const id = typeof personaOId === "string" ? personaOId : personaOId?.id;
  return id ? PERSONA_CONTENT[id] || null : null;
}

export function tieneContenidoEditorial(personaOId) {
  const contenido = contenidoPersona(personaOId);
  return Boolean(contenido?.resumen || contenido?.biografia);
}
