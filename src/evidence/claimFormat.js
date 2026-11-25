// 6.3.2: presentación de las afirmaciones sin el sistema de evidencias.
// Una ficha pública ya trae sus afirmaciones en sus propios datos.
import {governmentDateRange, governmentCalendarLabel} from '../domain/time/governmentDates.js';

export const CERTAINTY = Object.freeze({
  documented: 'Documentado', approximate: 'Aproximado', disputed: 'Discutido',
  inferred: 'Inferido', pending: 'Pendiente de revisión',
});

export function citationText(claim, personName, locale = 'es', personNameById = () => null) {
  const english = locale === 'en';
  const subject = personName || claim.subject.id;
  const value = typeof claim.value === 'object'
    ? `${claim.field === 'Sucesión' ? (english ? 'Succession' : 'Sucesión') : claim.value.titulo || (english ? 'Government' : 'Gobierno')} ${english ? 'in' : 'en'} ${claim.value.territorio}, ${claim.field === 'Gobierno' ? governmentDateRange(claim.value,locale) : claim.interval.from ?? '?'}${claim.field === 'Gobierno' && governmentCalendarLabel(claim.value,locale) ? ` (${governmentCalendarLabel(claim.value,locale)})` : ''}`
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
