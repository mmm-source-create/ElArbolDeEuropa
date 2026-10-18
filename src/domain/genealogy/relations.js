import {conyugesDe} from './personAccessors.js';
import {PERSONAS} from '../../data/personas.js';
import {listaReinados} from '../government/reigns.js';
import {documentaryLifeBounds} from '../time/documentaryDates.js';

export const BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p]));

export const CONYUGES_INVERSOS = PERSONAS.reduce((acc, persona) => {
  const declarados = conyugesDe(persona);
  declarados.forEach((id) => {
    if (!BY_ID[id]) return;
    (acc[id] ||= new Set()).add(persona.id);
  });
  return acc;
}, {});

export const HIJOS_POR_ID = PERSONAS.reduce((acc, persona) => {
  [persona.padre, persona.madre].filter(Boolean).forEach((progenitorId) => {
    (acc[progenitorId] ||= []).push(persona.id);
  });
  return acc;
}, {});



// Normaliza las relaciones sin alterar el formato de la base de datos.
// `conyuge` se conserva para una sola unión y `conyuges` para varias.
export function listaConyuges(persona) {
  if (!persona) return [];
  return [...new Set([
    ...conyugesDe(persona),
    ...[...(CONYUGES_INVERSOS[persona.id] || [])],
  ].filter(Boolean))];
}

export function listaAmantes(persona) {
  return [...new Set((persona?.amantes || []).filter(Boolean))];
}

export function siglosDePersona(persona) {
  const fechas = [
    persona?.nac,
    persona?.muer,
    ...listaReinados(persona).flatMap((r) => [r.desde, r.hasta]),
  ].filter(Number.isFinite);
  if (!fechas.length) return [];
  const primero = Math.ceil(Math.min(...fechas) / 100);
  const ultimo = Math.ceil(Math.max(...fechas) / 100);
  return Array.from({ length: ultimo - primero + 1 }, (_, i) => primero + i);
}

export function fechasIncompletas(persona) {
  return !Number.isFinite(persona?.nac) || !Number.isFinite(persona?.muer);
}

export function estaVivaEn(persona, año) {
  if (!Number.isFinite(año) || !persona) return true;
  const bounds = documentaryLifeBounds(persona, listaReinados(persona));
  if (!bounds) return false;
  const [inicio, fin] = bounds;
  return año >= inicio && año <= fin;
}

export function listaParejas(persona) {
  return [...new Set([...listaConyuges(persona), ...listaAmantes(persona)].filter(Boolean))];
}

export function clavePareja(a, b) {
  return [a, b].filter(Boolean).sort().join("|");
}

export function mediana(valores) {
  if (!valores.length) return null;
  const ordenados = valores.slice().sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  return ordenados.length % 2
    ? ordenados[mitad]
    : (ordenados[mitad - 1] + ordenados[mitad]) / 2;
}
