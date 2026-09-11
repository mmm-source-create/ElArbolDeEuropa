import { PERSONAS } from "../personas.jsx";
import { listaReinados } from "../Territorios.jsx";
import { documentaryLife } from "../utils/documentaryDates.js";

export const siglo = (y) => Number.isFinite(y) ? Math.ceil(y / 100) : null;
export const nRomano = { 12:"XII",13:"XIII",14:"XIV",15:"XV",16:"XVI",17:"XVII",18:"XVIII",19:"XIX",20:"XX" };

export function anioInicioPersona(persona) {
  const candidatos = [
    persona?.nac,
    ...listaReinados(persona).map((r) => r.desde),
    persona?.muer,
  ].filter(Number.isFinite);
  return candidatos.length ? Math.min(...candidatos) : null;
}

export function anioFinPersona(persona) {
  const candidatos = [
    persona?.muer,
    ...listaReinados(persona).map((r) => r.hasta),
    persona?.nac,
  ].filter(Number.isFinite);
  return candidatos.length ? Math.max(...candidatos) : null;
}

export function formatoFechas(persona) {
  return documentaryLife(persona);
}

export function sobrenombreDePersona(persona) {
  if (!persona) return "";
  if (typeof persona.sobrenombre === "string" && persona.sobrenombre.trim()) return persona.sobrenombre.trim();
  const nombre = String(persona.nombre || "").trim();
  const cita = nombre.match(/[“\"]([^”\"]+)[”\"]/);
  if (cita) return cita[1].trim();
  const parentesis = nombre.match(/\(([^()]+)\)\s*$/);
  if (parentesis && /^(el|la|los|las)\s/i.test(parentesis[1].trim())) return parentesis[1].trim();
  return "";
}

export function nombrePrincipal(persona) {
  if (!persona) return "";
  let nombre = String(persona.nombre || "").trim();
  nombre = nombre.replace(/\s*[“\"][^”\"]+[”\"]\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  const parentesis = nombre.match(/\(([^()]+)\)\s*$/);
  if (parentesis && /^(el|la|los|las)\s/i.test(parentesis[1].trim())) {
    nombre = nombre.slice(0, parentesis.index).trim();
  }
  return nombre || String(persona.nombre || "").trim();
}

export const ANIOS_DATOS = PERSONAS.flatMap((persona) => [
  persona.nac,
  persona.muer,
  ...listaReinados(persona).flatMap((r) => [r.desde, r.hasta]),
]).filter(Number.isFinite);
export const TL_MIN = Math.floor((Math.min(...ANIOS_DATOS) - 1) / 25) * 25;
export const TL_MAX = Math.ceil((Math.max(...ANIOS_DATOS) + 1) / 25) * 25;
export const pct = (y) => Number.isFinite(y) ? Math.max(0, Math.min(100, ((y - TL_MIN) / (TL_MAX - TL_MIN)) * 100)) : null;
export const inicioEvento = (evento) => Number.isFinite(evento?.desde) ? evento.desde : evento?.anio;
export const finEvento = (evento) => Number.isFinite(evento?.hasta) ? evento.hasta : inicioEvento(evento);
export const etiquetaFechaEvento = (evento) => Number.isFinite(evento?.desde) && Number.isFinite(evento?.hasta)
  ? `${evento.desde}–${evento.hasta}`
  : String(evento?.anio ?? "");
export const nivelTimelineEvento = (evento) => ["principal", "secundario", "historia"].includes(evento?.timeline)
  ? evento.timeline
  : "secundario";
