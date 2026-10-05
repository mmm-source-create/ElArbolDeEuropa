// A source attached to a biography is contextual. It does not verify every fact
// on that biography; claim-level sources must be entered explicitly below.
import {RELEVOS} from '../content/sucesiones/index.js';
import {ACCESOS_CORONAS} from '../content/coronas/index.js';
import {CLAIM_REVIEWS, EDITORIAL_HISTORY, PILOT_PERSON_IDS} from './reviewRecords.js';
export {CLAIM_REVIEWS, EDITORIAL_HISTORY, PILOT_PERSON_IDS};
export const CERTAINTY = Object.freeze({
  documented: 'Documentado', approximate: 'Aproximado', disputed: 'Discutido',
  inferred: 'Inferido', pending: 'Pendiente de revisión',
});


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
      interval:{...time,precision:review.precision || 'year'}, certainty, sources:review.sources || [],
      exactDate:review.exactDate || null,timeLabel:review.timeLabel || null,
      alternatives:review.alternatives || [],
      note:review.note || fallbackNote || documentaryNote?.texto || '',
      reviewedAt:review.reviewedAt || null, editor:review.editor || null});
  };
  if (year(person.nac) !== null) add('birth','Nacimiento',person.nac,interval(person.nac),person.documentacion?.fechas?.nac?.nota);
  if (year(person.muer) !== null) add('death','Fallecimiento',person.muer,interval(person.muer),person.documentacion?.fechas?.muer?.nota);
  if (person.padre || person.padres?.[0]?.id) add('father','Padre',person.padre || person.padres[0].id);
  if (person.madre || person.padres?.[1]?.id) add('mother','Madre',person.madre || person.padres[1].id);
  const spouseIds = person.conyugesIds || [person.conyuge,...(person.conyuges || [])].map(value => typeof value === 'string' ? value : value?.id);
  for (const id of [...new Set(spouseIds.filter(Boolean))]) add(`spouse:${id}`,'Matrimonio o vínculo conyugal',id);
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

// This filter describes people with at least one individually sourced,
// documented claim. It does not certify their entire biography.
export function hasDocumentedClaim(person) {
  return personClaims(person).some(claim => claim.certainty === 'documented' && claim.sources.length > 0);
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

export function citationText(claim, personName, locale = 'es', personNameById = () => null) {
  const english = locale === 'en';
  const subject = personName || claim.subject.id;
  const value = typeof claim.value === 'object'
    ? `${claim.field === 'Sucesión' ? (english ? 'Succession' : 'Sucesión') : claim.value.titulo || (english ? 'Government' : 'Gobierno')} ${english ? 'in' : 'en'} ${claim.value.territorio}, ${claim.interval.from ?? '?'}${claim.interval.to !== claim.interval.from ? `–${claim.interval.to ?? '?'}` : ''}`
    : ['Padre','Madre','Matrimonio o vínculo conyugal'].includes(claim.field)
      ? personNameById(claim.value) || String(claim.value) : claim.timeLabel || String(claim.value);
  const field = english ? ({Nacimiento:'birth',Fallecimiento:'death',Padre:'father',Madre:'mother','Matrimonio o vínculo conyugal':'marriage or partnership',Gobierno:'government',Sucesión:'succession'}[claim.field] || claim.field.toLowerCase()) : claim.field.toLowerCase();
  const located = claim.sources.length ? claim.sources.map(source=>`${source.title}${source.locator ? `, ${source.locator}` : ''} (${source.url})`).join('; ')+'.' : english ? 'No claim-specific source; pending review.' : 'Sin fuente específica; pendiente de revisión.';
  const alternatives=claim.alternatives.length ? ` ${english ? 'Recorded alternatives' : 'Alternativas registradas'}: ${claim.alternatives.join('; ')}.` : '';
  return `${subject}, ${field}: ${value}${claim.exactDate ? ` (${claim.exactDate})` : ''}. El Árbol de Europa, ${english ? 'claim' : 'afirmación'} ${claim.id}. ${located}${alternatives}`;
}

export function formatClaimDate(claim,locale='es') {
  if (claim?.timeLabel) return claim.timeLabel;
  if (claim?.exactDate) return new Intl.DateTimeFormat(locale==='en'?'en-GB':'es-ES',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${claim.exactDate}T00:00:00Z`));
  return claim?.value ?? '';
}

// These are triage leads, not automatically diagnosed historical mistakes.
export function coverageTasks(people, limit = 60, territories = {}) {
  const byId = new Map(people.map(person => [person.id,person]));
  const tasks = [];
  const pilot = new Set(PILOT_PERSON_IDS);
  for (const person of people) {
    const priority = pilot.has(person.id) ? 0 : 1;
    if (!person.padre && !person.madre) tasks.push({id:`parents:${person.id}`,personId:person.id,personName:person.nombre,kind:'parents',status:person.documentacion?.ausencias?.padres==='unknown'?'unknown':'not_researched',priority});
    if (!year(person.nac) || !year(person.muer)) tasks.push({id:`dates:${person.id}`,personId:person.id,personName:person.nombre,kind:'dates',status:person.documentacion?.ausencias?.fechas==='unknown'?'unknown':'not_researched',priority});
    for (const claim of personClaims(person)) {
      if (claim.certainty==='disputed') tasks.push({id:`conflict:${claim.id}`,personId:person.id,personName:person.nombre,kind:'conflict',status:'possible_error',priority:-2,detail:`${claim.field}: ${claim.alternatives.join(' · ') || claim.note}`});
      if (claim.field === 'Gobierno' && !claim.sources.length)
        tasks.push({id:claim.id,personId:person.id,personName:person.nombre,kind:'government',status:'not_researched',priority,detail:`${claim.value.titulo} · ${claim.value.territorio} (${claim.interval.from ?? '?'}–${claim.interval.to ?? '?'})`});
    }
    if (year(person.nac) !== null && year(person.muer) !== null && person.nac > person.muer ||
        ['padre','madre'].some(field => {const parent=byId.get(person[field]);return parent && year(person.nac)!==null && year(parent.nac)!==null && person.nac-parent.nac<12;}))
      tasks.push({id:`chronology:${person.id}`,personId:person.id,personName:person.nombre,kind:'chronology',status:'possible_error',priority:-1});
  }
  const byTerritory=new Map();
  for (const person of people) for (const government of person.gobiernos || []) {
    if (!Number.isInteger(government.desde)||!Number.isInteger(government.hasta)) continue;
    const list=byTerritory.get(government.territorio)||[];
    list.push(government);byTerritory.set(government.territorio,list);
  }
  for (const [territory,list] of byTerritory) {
    if (!territories[territory]||territories[territory].naturaleza==='agrupacion') continue;
    const ordered=list.sort((a,b)=>a.desde-b.desde);
    let end=ordered[0]?.hasta;
    for (const government of ordered.slice(1)) {
      if (government.desde-end>50) tasks.push({id:`gap:${territory}:${end}:${government.desde}`,territory,personName:territory,kind:'territory_gap',status:'not_researched',priority:2,detail:`${end}–${government.desde}`});
      end=Math.max(end,government.hasta);
    }
  }
  return tasks.sort((a,b)=>a.priority-b.priority || a.personName.localeCompare(b.personName,'es') || a.id.localeCompare(b.id)).slice(0,limit);
}
