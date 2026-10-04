// The new geometry is an opt-in research layer. These aliases describe
// political jurisdictions, not every territory or title held by one person.
export function pilotJurisdictionsFor(territory, year) {
  if (territory === 'Inglaterra') return ['Inglaterra', 'Plaza inglesa de Calais', 'Plazas inglesas de Guyena'];
  if (territory === 'Irlanda') return ['Núcleo inglés en Irlanda'];
  if (territory === 'Polonia') return ['Corona de Polonia', 'Prusia Real'];
  if (territory === 'Lituania') return ['Gran Ducado de Lituania'];
  if (territory === 'Mazovia') return ['Ducado de Mazovia'];
  if (territory === 'Prusia') return [year < 1525 ? 'Prusia de la Orden' : 'Prusia ducal'];
  return [territory];
}

export function pilotVersionFor(entry, year) {
  if (!entry || !Number.isInteger(year)) return null;
  return [...entry.versions].reverse().find(version => version.from <= year) || null;
}

export function pilotLocationsFor(data, territory, year) {
  if (!data || !Number.isInteger(year) || year < data.from || year > data.through) return [];
  const byName = new Map(data.territories.map(entry => [entry.name, entry]));
  return [...new Set(pilotJurisdictionsFor(territory, year).flatMap(name =>
    pilotVersionFor(byName.get(name), year)?.ids || []))];
}

export function pilotBurgundianGovernmentsFor(data, personId, year) {
  if (!data?.burgundy || !personId || !Number.isInteger(year)) return [];
  const person = data.burgundy.people.find(item => item.id === personId);
  if (!person) return [];
  return person.governments.flatMap(government => {
    if (year < government.from || year > government.through) return [];
    const version = pilotVersionFor(government, year);
    return version?.ids.length ? [{ territory: government.territory,
      condition: government.condition, ids: version.ids }] : [];
  });
}

export function pilotLocationContext(data, id, year, personId = null) {
  if (!data || !id || !Number.isInteger(year) || year < data.from || year > data.through) return [];
  const corridor = data.territories.flatMap(entry => {
    const version = pilotVersionFor(entry, year);
    if (!version?.ids.includes(id)) return [];
    return [{
      name: entry.name,
      corridor: entry.corridor,
      note: entry.note,
      correction: data.overrides.find(item => item.territory === entry.name && item.id === id
        && item.from <= year && year <= item.through) || null,
    }];
  });
  const burgundian = pilotBurgundianGovernmentsFor(data, personId, year)
    .filter(government => government.ids.includes(id))
    .filter(government => !corridor.some(entry => entry.name === government.territory))
    .map(government => ({
      name: government.territory,
      corridor: 'Sucesión borgoñona',
      note: 'Atribución del ensayo fechado para la persona seleccionada; los señoríos suplementarios todavía no figuran en su biografía del Atlas.',
      correction: data.burgundy.overrides.find(item => item.territory === government.territory
        && item.id === id && item.action === 'add'
        && item.from <= year && year <= item.through) || null,
    }));
  return [...corridor, ...burgundian];
}
