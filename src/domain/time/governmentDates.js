// ISO-shaped historical dates, in the stated calendar; never converted by Date.
export function validGovernmentDate(value, calendar) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  if (!['juliano', 'gregoriano'].includes(calendar)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const leap = year % 4 === 0 && (calendar === 'juliano' || year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1];
}

export function formatGovernmentDate(value, locale = 'es') {
  const [year, month, day] = value.split('-').map(Number);
  const name = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'es-ES', {month: 'long', timeZone: 'UTC'})
    .format(new Date(Date.UTC(2000, month - 1, 1)));
  return locale === 'en' ? `${day} ${name} ${year}` : `${day} de ${name} de ${year}`;
}

export function governmentDateRange(government, locale = 'es') {
  if (!government.desdeFecha && !government.hastaFecha) return `${government.desde ?? '?'}–${government.hasta ?? '?'}`;
  const bound = (field, year) => validGovernmentDate(government[field], government.calendarioFechas)
    ? formatGovernmentDate(government[field], locale) : government[year] ?? '?';
  return `${bound('desdeFecha', 'desde')} – ${bound('hastaFecha', 'hasta')}`;
}

export function governmentCalendarLabel(government, locale = 'es') {
  if (!government.desdeFecha && !government.hastaFecha) return '';
  return locale === 'en' ? (government.calendarioFechas === 'juliano' ? 'Julian calendar' : 'Gregorian calendar')
    : (government.calendarioFechas === 'juliano' ? 'Calendario juliano' : 'Calendario gregoriano');
}
