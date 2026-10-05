// These aliases connect the Atlas government records to reviewed new-map
// jurisdictions, without treating every title held by one ruler as one state.
import {imperialFrameIds} from './imperialFrame.js';
import {authorityExtensionFor} from './atlasAuthorityExtensions.js';
import {applyMapBorderCorrections} from './mapBorderCorrections.js';

const layerIndexes = new WeakMap();
export function reviewedMapLayers(data) {
  if (!data) return [];
  if (!layerIndexes.has(data)) {
    const entries = [...(data.territories || []), ...(data.additionalTerritories || [])];
    layerIndexes.set(data, {entries, byName: new Map(entries.map(entry => [entry.name, entry]))});
  }
  return layerIndexes.get(data).entries;
}

function layerIndex(data) {
  reviewedMapLayers(data);
  return layerIndexes.get(data)?.byName || new Map();
}

export function pilotJurisdictionsFor(territory, year, personId = null) {
  if (territory === 'Sacro Imperio') return [];
  if (territory === 'Brandeburgo') return personId === 'JOHNALCHEMIST' ? [] : ['Núcleo de Brandeburgo'];
  if (territory === 'Sajonia') return ['ALBERTSAX','GEORGESAX','HENRYPIOUSSAX'].includes(personId)
    || personId === 'MORITZSAX' && year < 1547 ? ['Sajonia albertina'] : ['Sajonia electoral'];
  if (territory === 'Württemberg') {
    if (year >= 1442 && year < 1482) return personId === 'ULRICH5WURTT'
      ? ['Württemberg-Stuttgart'] : ['Württemberg-Urach'];
    return ['Núcleo de Württemberg'];
  }
  if (territory === 'Hesse') return ['Núcleo de Hesse'];
  if (territory === 'Hesse-Kassel') return ['Núcleo de Hesse-Kassel'];
  if (territory === 'Hesse-Darmstadt') return ['Núcleo de Hesse-Darmstadt'];
  if (territory === 'Países Bajos') return ['Flandes', 'Brabante', 'Limburgo', 'Holanda',
    'Henao', 'Zelanda', 'Artois', 'Namur', 'Luxemburgo', 'Frisia', 'Utrecht',
    'Overijssel', 'Drente', 'Groninga', 'Güeldres', 'Señorío de Malinas'];
  if (territory === 'Hungría') {
    if (personId === 'JUAN1ZAPOLYA') return ['Núcleo oriental de Zápolya'];
    if (personId === 'JUAN2SIGZAPOLYA') return year >= 1551 && year <= 1555 ? [] : ['Transilvania'];
    if (year <= 1525) return ['Hungría', 'Banato húngaro de Jajce'];
    return ['Hungría real', 'Banato húngaro de Jajce', ...(personId === 'FERN1EMP' && year >= 1551 && year <= 1555 ? ['Ocupación habsbúrgica de Transilvania'] : [])];
  }
  if (territory === 'Croacia') return year >= 1527 ? ['Croacia habsbúrgica'] : [];
  if (territory === 'Transilvania' && personId === 'FERN1EMP' && year >= 1551 && year <= 1555) {
    return ['Ocupación habsbúrgica de Transilvania'];
  }
  if (territory === 'Transilvania') return ['Transilvania'];
  if (territory === 'Serbia' && year >= 1402 && year <= 1458) return ['Despotado de Serbia'];
  if (territory === 'Bosnia') return year <= 1462 ? ['Reino de Bosnia'] : ['Bosnia y Herzegovina otomanas'];
  if (territory === 'Valaquia') return ['Principado de Valaquia'];
  if (territory === 'Moldavia') return ['Principado de Moldavia'];
  if (territory === 'Imperio otomano') return [
    'Hungría otomana', 'Bosnia y Herzegovina otomanas', 'Balcanes meridionales otomanos',
  ];
  if (territory === 'Inglaterra') return ['Inglaterra', 'Plaza inglesa de Calais', 'Plazas inglesas de Guyena'];
  if (territory === 'Irlanda') return ['Núcleo inglés en Irlanda'];
  if (territory === 'Polonia') return ['Corona de Polonia', 'Prusia Real'];
  if (territory === 'Lituania') return ['Gran Ducado de Lituania'];
  if (territory === 'Polonia-Lituania') return year >= 1569
    ? ['Corona de Polonia', 'Gran Ducado de Lituania', 'Prusia Real',
      ...(year <= 1628 ? ['Livonia del Commonwealth'] : [])]
    : [];
  if (territory === 'Mazovia') return ['Ducado de Mazovia'];
  if (territory === 'Prusia') return [year < 1525 ? 'Prusia de la Orden' : 'Prusia ducal'];
  if (territory === 'Dinamarca') return ['Reino de Dinamarca', 'Ösel bajo Dinamarca'];
  if (territory === 'Noruega') return ['Reino de Noruega', 'Islas Feroe bajo la Corona noruega'];
  if (territory === 'Feroe' || territory === 'Islas Feroe') return ['Islas Feroe bajo la Corona noruega'];
  if (territory === 'Suecia') return ['Reino de Suecia', 'Estonia sueca', 'Livonia sueca',
    'Riga bajo Suecia', 'Ösel bajo Suecia', 'Pomerania bajo ocupación sueca',
    'Pomerania sueca', 'Señorío sueco de Wismar'];
  if (territory === 'Escandinavia') return ['Reino de Dinamarca', 'Reino de Noruega', 'Reino de Suecia'];
  if (territory === 'Rusia') return ['Moscovia y Zarato de Rusia'];
  if (territory === 'Curlandia') return ['Ducado de Curlandia'];
  if (territory === 'Holstein') return ['Ducado de Holstein'];
  if (territory === 'Schleswig') return ['Ducado de Schleswig'];
  if (territory === 'Mecklemburgo') return ['Mecklemburgo'];
  if (territory === 'Pomerania') {
    if (year <= 1636) return ['Ducado de Pomerania'];
    if (year <= 1647) return ['Pomerania bajo ocupación sueca'];
    return ['Pomerania sueca', 'Pomerania de Brandeburgo'];
  }
  return [territory];
}

export function pilotImperialFrameFor(data, year) {
  if (!Number.isInteger(year)) return [];
  if (year >= (data?.from ?? 1400) && year <= (data?.through ?? 1650)) {
    return pilotLocationsFor(data, 'Marco jurídico del Sacro Imperio', year);
  }
  return mapLocationsForGovernment(data, {territorio:'Sacro Imperio'}, year, null, imperialFrameIds(year));
}

export function pilotVersionFor(entry, year) {
  if (!entry || !Number.isInteger(year)) return null;
  return [...entry.versions].reverse().find(version => version.from <= year) || null;
}

export function pilotLocationsFor(data, territory, year, personId = null) {
  if (!data || !Number.isInteger(year) || year < data.from || year > data.through) return [];
  const byName = layerIndex(data);
  return [...new Set(pilotJurisdictionsFor(territory, year, personId).flatMap(name =>
    reviewedLayerLocations(data, byName.get(name), year, personId)))];
}

function layerActiveInYear(entry, year, from = 1400, through = 1650) {
  if (entry?.periods) return entry.periods.some(period => period.from <= year
    && year <= (period.through ?? through));
  return !entry?.active || (entry.active.from ?? from) <= year
    && year <= (entry.active.through ?? through);
}

function applyLayerCorrections(data, entry, ids, year) {
  const corrected = new Set(ids);
  for (const correction of data?.overrides || []) {
    if (correction.territory !== entry.name || correction.from > year || correction.through < year) continue;
    if (correction.action === 'add') corrected.add(correction.id);
    if (correction.action === 'remove') corrected.delete(correction.id);
  }
  return [...corrected];
}

export function reviewedLayerLocations(data, entry, year, personId = null) {
  if (!entry || !Number.isInteger(year) || year < data.from || year > data.through) return [];
  const extension = authorityExtensionFor(entry.name, year, personId);
  if (extension) return applyLayerCorrections(data, entry,
    pilotVersionFor(entry, extension.referenceYear)?.ids || [], extension.referenceYear);
  if (!layerActiveInYear(entry, year, data.from, data.through)) return [];
  return applyLayerCorrections(data, entry, pilotVersionFor(entry, year)?.ids || [], year);
}

// Prefer a dated, named jurisdiction when the research layer has one. For
// territories not yet migrated, transform their legacy region IDs through
// the audited geometry crosswalk; unmappable/ambiguous regions stay unpainted.
export function mapLocationsForGovernment(data, government, year, personId = null, legacyIds = []) {
  if (!data || !government?.territorio || !Number.isInteger(year)) return [];
  const byName = layerIndex(data);
  const withinDatedLayerRange = year >= data.from && year <= data.through;
  const layers = (withinDatedLayerRange ? pilotJurisdictionsFor(government.territorio, year, personId) : [])
    .map(name => byName.get(name)).filter(Boolean);
  if (layers.length) {
    return applyMapBorderCorrections([...new Set(layers.flatMap(entry => reviewedLayerLocations(data, entry, year, personId)))], government.territorio, year);
  }
  const crosswalk = data.locationCrosswalk?.newIdsByOldId || {};
  return applyMapBorderCorrections([...new Set(legacyIds.flatMap(id => crosswalk[id]?.ids || []))], government.territorio, year);
}

export function pilotDisputedHungarianClaimsFor(data, personId, year) {
  if (!Number.isInteger(year)) return [];
  if (personId === 'JUAN1ZAPOLYA' && year >= 1527 && year <= 1540) {
    return [{ territory: 'Hungría oriental de Zápolya', color: '#756598',
      ids: pilotLocationsFor(data, 'Núcleo oriental de Zápolya', year) }];
  }
  if (personId === 'JUAN2SIGZAPOLYA'
      && ((year >= 1541 && year <= 1550) || (year >= 1556 && year <= 1569))) {
    return [{ territory: 'Transilvania bajo Zápolya', color: '#756598',
      ids: pilotLocationsFor(data, 'Transilvania', year) }];
  }
  return [];
}

export function pilotBurgundianGovernmentsFor(data, personId, year) {
  if (!data?.burgundy || !personId || !Number.isInteger(year)) return [];
  const person = data.burgundy.people.find(item => item.id === personId);
  if (!person) return [];
  return person.governments.flatMap(government => {
    if (year < government.from || year > government.through) return [];
    const version = pilotVersionFor(government, year);
    return version?.ids.length ? [{ territory: government.territory,
      condition: government.condition, from: government.from, through: government.through,
      ids: version.ids }] : [];
  });
}

export function pilotLocationContext(data, id, year, personId = null) {
  if (!data || !id || !Number.isInteger(year) || year < data.from || year > data.through) return [];
  const entries = reviewedMapLayers(data);
  const corridor = entries.flatMap(entry => {
    if (!reviewedLayerLocations(data, entry, year).includes(id)) return [];
    const extension = authorityExtensionFor(entry.name, year);
    return [{
      name: entry.name,
      corridor: entry.corridor,
      note: entry.note,
      source: extension?.source.url || entry.active?.source || null,
      activeReason: extension?.note || entry.active?.reason || null,
      correction: (data.overrides || []).find(item => item.territory === entry.name && item.id === id
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
