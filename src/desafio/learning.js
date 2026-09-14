import {RELEVOS} from '../content/sucesiones/index.js';
import {slugPublico} from '../utils/personLabels.js';

export const REVIEW_KEY = 'arbol-europa-repaso-v1';
const MAX_REVIEW = 100;
const hash = text => {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(36);
};
function rng(seed) {
  let state = parseInt(hash(seed), 36);
  return () => { state += 0x6d2b79f5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
const methods = r => [...r.motivos].sort().join(' + ');

// Only editorial records are eligible. Chronological adjacency does not prove a succession.
export function successionBank(people, records = RELEVOS) {
  const byId = new Map(people.map(p => [p.id, p]));
  const valid = records.filter(r => byId.has(r.predecesor.persona) && byId.has(r.sucesor.persona) && r.explicacion && r.fuentes?.length);
  const combinations = [...new Set(valid.map(methods))].sort();
  const pool = [...new Set(valid.flatMap(r => [r.predecesor.persona, r.sucesor.persona]))].sort();
  const bank = [];
  for (const r of [...valid].sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)) {
    const successor = byId.get(r.sucesor.persona), predecessor = byId.get(r.predecesor.persona);
    const base = {formato:'opciones', dificultad:2, etiqueta:'Resolver una sucesión', territorio:r.territorio,
      explicacion:r.explicacion, fuentes:r.fuentes, atlasPersonId:successor.id,
      atlasUrl:`/es/territorio/${slugPublico(r.territorio)}#sucesion`, relevoId:r.id};
    const correct = methods(r);
    bank.push({...base, id:`motivo:${r.id}`, firma:`motivo:${r.id}`, tipo:'fundamento',
      pregunta:`${r.territorio}, ${r.sucesor.desde}: ¿qué motivos explican el acceso de ${successor.nombre} al gobierno?`,
      correctaId:correct, opciones:[correct, ...combinations.filter(x => x !== correct).slice(0,3)].map(id=>({id,label:id}))});
    const sameTransition = valid.filter(x => x.territorio === r.territorio && x.predecesor.persona === predecessor.id && x.sucesor.desde === r.sucesor.desde);
    // A co-government can have several correct successors. Do not turn it into a single-choice question.
    if (new Set(sameTransition.map(x=>x.sucesor.persona)).size !== 1) continue;
    const local = valid.filter(x=>x.territorio===r.territorio).flatMap(x=>[x.predecesor.persona,x.sucesor.persona]);
    const seenNames = new Set([successor.nombre]);
    const distractors = [...new Set([...local, ...pool])].filter(id => {
      const p = byId.get(id);
      if (id===predecessor.id || id===successor.id || seenNames.has(p.nombre)) return false;
      seenNames.add(p.nombre); return true;
    }).slice(0,3);
    if (distractors.length === 3) bank.push({...base, id:`sucesor:${r.id}`, firma:`sucesor:${r.id}`, tipo:'sucesor-documentado',
      pregunta:`${r.territorio}, ${r.sucesor.desde}: ¿quién protagonizó el relevo de ${predecessor.nombre} que recoge el Atlas?`,
      correctaId:successor.id, opciones:[successor.id,...distractors].map(id=>({id,label:byId.get(id).nombre}))});
  }
  return bank;
}

export function bankVersion(bank) { return `s1-${hash(JSON.stringify(bank))}`; }
export function createChallenge(bank, seed, length = 5) {
  const random = rng(seed), used = new Set();
  return shuffle(bank, random).filter(q => {
    if (used.has(q.relevoId)) return false;
    used.add(q.relevoId); return true;
  }).slice(0, length).map(q=>({...q,opciones:shuffle(q.opciones,random)}));
}
export function challengeUrl(bank, seed) {
  const params = new URLSearchParams({reto:seed,banco:bankVersion(bank)});
  return `/es/desafio?${params}`;
}
export function readChallenge(search, bank) {
  const params = new URLSearchParams(search);
  if (!params.has('reto')) return null;
  const seed = params.get('reto');
  if (!/^[a-zA-Z0-9_-]{1,48}$/.test(seed || '') || params.getAll('reto').length !== 1 || params.getAll('banco').length !== 1)
    return {error:'El enlace de este desafío no es válido. Puedes crear otra partida desde los modos.'};
  if (params.get('banco') !== bankVersion(bank)) return {error:'Esta partida pertenece a otra edición de las preguntas. Crea un enlace nuevo para jugar todos con la misma selección.'};
  return {seed, preguntas:createChallenge(bank, seed)};
}

function validSource(url) { try { return typeof url==='string' && new URL(url).protocol==='https:'; } catch { return false; } }
export function validReviewQuestion(q, byId) {
  if (!q || typeof q.firma !== 'string' || q.firma.length > 4000 || typeof q.pregunta !== 'string' || typeof q.explicacion !== 'string' || q.explicacion.length > 10000) return false;
  if (!['opciones','pistas','orden','retrato'].includes(q.formato) || !Array.isArray(q.opciones) || q.opciones.length < 2 || q.opciones.length > 4) return false;
  if (q.opciones.some(o=>!o || typeof o.id!=='string' || typeof o.label!=='string') || new Set(q.opciones.map(o=>o.id)).size !== q.opciones.length) return false;
  if (q.formato==='orden') {
    if (!Array.isArray(q.ordenCorrecto) || q.ordenCorrecto.length !== q.opciones.length || new Set(q.ordenCorrecto).size !== q.opciones.length || q.ordenCorrecto.some(id=>!q.opciones.some(o=>o.id===id))) return false;
  } else if (!q.opciones.some(o=>o.id===q.correctaId)) return false;
  if (q.formato==='pistas' && (!Array.isArray(q.pistas) || q.pistas.some(p=>typeof p!=='string'))) return false;
  if (q.atlasPersonId && !byId[q.atlasPersonId]) return false;
  if (q.imagenId && !byId[q.imagenId]) return false;
  if (q.fuentes && (!Array.isArray(q.fuentes) || q.fuentes.some(url=>!validSource(url)))) return false;
  if (q.territorio && q.atlasUrl !== `/es/territorio/${slugPublico(q.territorio)}#sucesion`) return false;
  return true;
}
export function readReview(storage, byId, bank) {
  try {
    const data = JSON.parse(storage?.getItem(REVIEW_KEY) || '[]');
    if (!Array.isArray(data)) return [];
    const seen = new Set(), current = new Map(bank.map(q=>[q.firma,q]));
    return data.filter(q=>validReviewQuestion(q,byId)).map(q=>q.relevoId?current.get(q.firma):q).filter(q=>q && !seen.has(q.firma) && seen.add(q.firma)).slice(-MAX_REVIEW);
  } catch { return []; }
}
export function reviewQuestions(queue, random = Math.random) {
  return queue.map(q=>({...q, opciones:shuffle(q.opciones,random)}));
}
export function updateReview(queue, question, correct) {
  const remaining = queue.filter(q=>q.firma !== question.firma);
  return correct ? remaining : [...remaining, question].slice(-MAX_REVIEW);
}
export function saveReview(storage, queue) {
  try { storage?.setItem(REVIEW_KEY, JSON.stringify(queue)); return Boolean(storage); } catch { return false; }
}
