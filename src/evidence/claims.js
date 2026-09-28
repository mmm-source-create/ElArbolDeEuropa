// A source attached to a biography is contextual. It does not verify every fact
// on that biography; claim-level sources must be entered explicitly below.
import {RELEVOS} from '../content/sucesiones/index.js';
import {ACCESOS_CORONAS} from '../content/coronas/index.js';
export const CERTAINTY = Object.freeze({
  documented: 'Documentado', approximate: 'Aproximado', disputed: 'Discutido',
  inferred: 'Inferido', pending: 'Pendiente de revisión',
});

// Keyed by stable assertion ID. A review must name the exact source and editor.
// Empty on migration: the legacy bibliography does not identify which passage
// supports each date, relationship or mandate.
const DIB_GERALD = {title:'Dictionary of Irish Biography · Gerald FitzGerald (Gearóid Mór)',url:'https://www.dib.ie/index.php/biography/fitzgerald-gerald-gearoid-mor-a3148'};
export const CLAIM_REVIEWS = Object.freeze({
  'person:GERALD8KILDARE:birth':{certainty:'approximate',sources:[DIB_GERALD],note:'El repertorio fecha el nacimiento en 1456 o 1457; el año del Atlas es orientativo.',reviewedAt:'2026-09-28',editor:'El Árbol de Europa'},
  'person:GERALD8KILDARE:death':{certainty:'documented',sources:[DIB_GERALD],note:'El repertorio registra el fallecimiento el 3 de septiembre de 1513.',reviewedAt:'2026-09-28',editor:'El Árbol de Europa'},
  'person:GERALD8KILDARE:father':{certainty:'documented',sources:[DIB_GERALD],note:'Identificado como hijo de Thomas FitzGerald, VII conde de Kildare.',reviewedAt:'2026-09-28',editor:'El Árbol de Europa'},
});
export const EDITORIAL_HISTORY = Object.freeze([
  {id:'v4-evidence-schema',scope:'all',date:'2026-09-28',editor:'El Árbol de Europa',change:'Registro de afirmaciones añadido; datos históricos existentes conservados.',reason:'Hacer visible qué afirmaciones aún necesitan una fuente específica.'},
  {id:'v4-gerald-review',scope:'GERALD8KILDARE',date:'2026-09-28',editor:'El Árbol de Europa',change:'Se añadió una referencia específica a nacimiento, muerte y filiación paterna.',reason:'La entrada biográfica precisa esos datos y aclara que el nacimiento es aproximado.'},
]);

const year = value => Number.isInteger(value) ? value : null;
const interval = (from, to = from) => ({from: year(from), to: year(to)});

export function personClaims(person, reviews = CLAIM_REVIEWS) {
  if (!person?.id) return [];
  const claims = [];
  const notes = person.documentacion?.notas || [];
  const add = (suffix, field, value, time = interval(null), fallbackNote = '') => {
    const id = `person:${person.id}:${suffix}`;
    const review = reviews[id] || {};
    const documentaryNote = notes.find(note => note.campo?.toLowerCase() === field.toLowerCase() || field === 'Gobierno' && note.campo?.toLowerCase() === 'gobiernos');
    const certainty = review.certainty && CERTAINTY[review.certainty]
      ? review.certainty : documentaryNote?.estado === 'discutida' ? 'disputed'
      : field === 'Nacimiento' && (person.nacAprox || person.documentacion?.fechas?.nac?.tipo === 'aproximada') ? 'approximate'
      : field === 'Fallecimiento' && (person.muerAprox || person.documentacion?.fechas?.muer?.tipo === 'aproximada') ? 'approximate'
      : 'pending';
    claims.push({id, subject:{kind:'person', id:person.id}, field, value,
      interval:time, certainty, sources:review.sources || [],
      note:review.note || fallbackNote || documentaryNote?.texto || '',
      reviewedAt:review.reviewedAt || null, editor:review.editor || null});
  };
  if (year(person.nac) !== null) add('birth','Nacimiento',person.nac,interval(person.nac),person.documentacion?.fechas?.nac?.nota);
  if (year(person.muer) !== null) add('death','Fallecimiento',person.muer,interval(person.muer),person.documentacion?.fechas?.muer?.nota);
  if (person.padre) add('father','Padre',person.padre);
  if (person.madre) add('mother','Madre',person.madre);
  for (const id of [...new Set([person.conyuge,...(person.conyuges || [])].filter(Boolean))]) add(`spouse:${id}`,'Matrimonio o vínculo conyugal',id);
  for (const government of person.gobiernos || person.reinados || []) {
    const key = [government.territorio, government.desde, government.hasta, government.titulo].join(':');
    add(`government:${key}`,'Gobierno',government,interval(government.desde,government.hasta));
  }
  for (const succession of RELEVOS.filter(item => item.sucesor?.persona === person.id)) {
    add(`succession:${succession.id}`,'Sucesión',succession,interval(succession.sucesor.desde),succession.explicacion);
  }
  for (const accession of ACCESOS_CORONAS.filter(item => item.persona === person.id && !claims.some(claim => claim.field === 'Sucesión' && claim.value.territorio === item.territorio && claim.interval.from === item.desde))) {
    add(`accession:${accession.territorio}:${accession.desde}`,'Sucesión',{
      territorio:accession.territorio,sucesor:{persona:person.id,desde:accession.desde},
      explicacion:accession.explicacion,motivos:accession.motivos,
    },interval(accession.desde),accession.explicacion);
  }
  return claims;
}

export function coverageReport(people, territories = {}, stories = []) {
  const claims = people.flatMap(person => personClaims(person));
  const byId = new Map(people.map(person => [person.id,person]));
  const totals = Object.fromEntries(Object.keys(CERTAINTY).map(key => [key,0]));
  const byField = {};
  for (const claim of claims) {
    totals[claim.certainty] += 1;
    const group = byField[claim.field] ||= {total:0,sourced:0,pending:0};
    group.total += 1;
    if (claim.sources.length) group.sourced += 1;
    if (claim.certainty === 'pending') group.pending += 1;
  }
  const possibleContradictions = people.filter(person =>
    year(person.nac) !== null && year(person.muer) !== null && person.nac > person.muer ||
    ['padre','madre'].some(field => {
      const parent = byId.get(person[field]);
      return parent && year(person.nac) !== null && year(parent.nac) !== null && person.nac - parent.nac < 12;
    })
  ).length;
  const byTerritory = new Map();
  for (const person of people) for (const government of person.gobiernos || []) {
    if (Number.isInteger(government.desde) && Number.isInteger(government.hasta)) {
      const list=byTerritory.get(government.territorio) || [];
      list.push(government);byTerritory.set(government.territorio,list);
    }
  }
  let territoryGaps = 0;
  for (const [name,governments] of byTerritory) {
    if (!territories[name] || territories[name].naturaleza === 'agrupacion') continue;
    const sorted = governments.sort((a,b)=>a.desde-b.desde);
    let end = sorted[0]?.hasta;
    for (const government of sorted.slice(1)) {
      if (government.desde - end > 50) territoryGaps++;
      end = Math.max(end,government.hasta);
    }
  }
  const storiesToReview = stories.filter(story => story.disponible && story.pasos?.some(step =>
    (step.personas || [step.persona]).some(id => byId.has(id) && personClaims(byId.get(id)).some(claim => claim.certainty === 'pending'))
  )).length;
  return {total:claims.length,sourced:claims.filter(claim => claim.sources.length).length,totals,byField,
    withoutParents:people.filter(person => !person.padre && !person.madre).length,
    incompleteDates:people.filter(person => !year(person.nac) || !year(person.muer)).length,
    governmentsWithoutSource:claims.filter(claim => claim.field === 'Gobierno' && !claim.sources.length).length,
    possibleContradictions,territoryGaps,storiesToReview};
}

export function citationText(claim, personName, locale = 'es') {
  const english = locale === 'en';
  const source = claim.sources[0];
  const subject = personName || claim.subject.id;
  const value = typeof claim.value === 'object'
    ? `${claim.field === 'Sucesión' ? (english ? 'Succession' : 'Sucesión') : claim.value.titulo || (english ? 'Government' : 'Gobierno')} ${english ? 'in' : 'en'} ${claim.value.territorio}, ${claim.interval.from ?? '?'}${claim.interval.to !== claim.interval.from ? `–${claim.interval.to ?? '?'}` : ''}`
    : String(claim.value);
  const field = english ? ({Nacimiento:'birth',Fallecimiento:'death',Padre:'father',Madre:'mother','Matrimonio o vínculo conyugal':'marriage or partnership',Gobierno:'government',Sucesión:'succession'}[claim.field] || claim.field.toLowerCase()) : claim.field.toLowerCase();
  return `${subject}, ${field}: ${value}. El Árbol de Europa, ${english ? 'claim' : 'afirmación'} ${claim.id}. ${source ? `${source.title} (${source.url}).` : english ? 'No claim-specific source; pending review.' : 'Sin fuente específica; pendiente de revisión.'}`;
}
