import {gobiernosDe} from './personAccessors.js';
import {idsDeReinoEnAño} from '../Territorios.jsx';
import {imperialFrameIds} from './imperialFrame.js';
import {mapLocationsForGovernment, pilotImperialFrameFor, reviewedMapLayers, reviewedLayerLocations, reviewedLayerEvidence, reviewedLayerActive} from './locationMapPilot.js';
import {territorialIdentity} from './territorialIdentity.js';
import {mapAuthoritiesForPerson} from './mapAuthorities.js';
import {CHRONOLOGY_COLLECTIVE_AUTHORITIES} from './atlasChronologyCollectives.js';

// Hay años en los que la autoridad no puede atribuirse honestamente a una
// sola persona. Estas entradas se muestran en el inspector, sin inventar un
// gobierno personal en la base genealógica.
export const COLLECTIVE_AUTHORITIES = Object.freeze([
  ...CHRONOLOGY_COLLECTIVE_AUTHORITIES,
  {
    territorio:'Provincias Unidas', desde:1588, hasta:1794,
    nombre:'Estados Generales y Estados provinciales', cargo:'Gobierno confederal y provincial',
    condicion:'colectiva', certeza:'documentado',
    nota:'República confederal de siete provincias y territorios de la Generalidad. El cargo de estatúder no sustituye la soberanía de sus Estados ni convierte las provincias meridionales en su dominio.',
    fuente:{title:'Nationaal Archief · Resoluties Staten-Generaal',url:'https://www.nationaalarchief.nl/onderzoeken/zoekhulpen/resoluties-van-de-staten-generaal-1576-1796',locator:'República 1588–1795: gobierno de los Estados Generales y competencias de los Estados de las siete provincias.'},
  },
  {
    territorio:'República Bátava', desde:1795, hasta:1800,
    nombre:'Instituciones de la República Bátava', cargo:'Gobierno republicano',
    condicion:'colectiva', certeza:'documentado',
    nota:'Revolución de 1795; estructura provincial hasta 1797 y centralización constitucional desde 1798. No se inventa un rey ni se limita la República a Holanda.',
    fuente:{title:'Canon van Nederland · Van republiek naar eenheidsstaat',url:'https://www.canonvannederland.nl/nl/page/385528/van-republiek-naar-eenheidsstaat---fan-republyk-nei-ienheidssteat',locator:'Revolución de 1795 y transición a Estado unitario en 1798.'},
  },
  {
    territorio:'Estados Belgas Unidos', desde:1790, hasta:1790,
    nombre:'Congreso de los Estados Belgas Unidos', cargo:'Gobierno federal revolucionario',
    condicion:'colectiva', certeza:'documentado',
    nota:'Federación revolucionaria de 1790, con restauración austríaca dentro del mismo año. Luxemburgo queda excluido.',
    fuente:{title:'Service public de Wallonie · États belgiques unis',url:'https://connaitrelawallonie.wallonie.be/histoire-et-symboles/histoire/atlas-historique/la-republique-des-etats-belgiques-unis-1790',locator:'Mapa de las nueve provincias insurgentes y excepción de Luxemburgo; restauración de finales de 1790.'},
  },
  {
    territorio: 'Comuna de Mljet', desde: 1345, hasta: 1409,
    nombre: 'Comuna de Mljet', cargo: 'Gobierno comunal',
    condicion: 'colectiva', certeza: 'documentado',
    nota: 'Autonomía estatutaria desde 1345 bajo el señorío monástico. La influencia de Ragusa no fija por sí sola el comienzo de su administración definitiva, fechado en 1410 por la entrada insular.',
    fuente: {title: 'Hrvatska enciklopedija · Mljet', url: 'https://enciklopedija.hr/clanak/mljet', locator: 'Estatuto y redención de prestaciones en 1345; incorporación definitiva en 1410.'},
  },
  {
    territorio: 'República de Ragusa', desde: 1200, hasta: 1357,
    nombre: 'Conde y consejo de la comuna de Ragusa', cargo: 'Gobierno comunal',
    condicion: 'colectiva', certeza: 'documentado',
    nota: 'Comuna bajo superioridad bizantina hasta 1205 y veneciana desde 1205; el conde veneciano no es un rey hereditario.',
    fuente: {title: 'Hrvatska enciklopedija · Dubrovačka Republika', url: 'https://enciklopedija.hr/clanak/dubrovacka-republika', locator: 'Gobierno comunal; conde y consejos; superioridad veneciana 1205–1358.'},
  },
  {
    territorio: 'República de Ragusa', desde: 1358, hasta: 1800,
    nombre: 'Rector y consejos de la República de Ragusa', cargo: 'Gobierno republicano',
    condicion: 'colectiva', certeza: 'documentado',
    nota: 'El rector presidía los consejos con un mandato mensual. El tributo al sultán, desde 1458, no eliminó el gobierno republicano ni hizo de Ragusa una provincia otomana.',
    fuente: {title: 'Hrvatska enciklopedija · Dubrovačka Republika', url: 'https://enciklopedija.hr/clanak/dubrovacka-republika', locator: 'Rector mensual, consejos republicanos, superioridad húngara y tributo otomano desde 1458.'},
  },
  {
    territorio: 'Tirol', desde: 1595, hasta: 1601,
    nombre: 'Comunidad de herederos Habsburgo', cargo: 'Administración de la casa',
    condicion: 'colectiva', certeza: 'inferido',
    nota: 'Tras Fernando II, Tirol volvió a la casa de Habsburgo. La fuente fecha el comienzo del gobierno delegado de Maximiliano III en 1602, pero no identifica aquí a un soberano personal exclusivo para 1595–1601.',
    fuente: {title:'Die Welt der Habsburger · Partición de la herencia austríaca',url:'https://www.habsburger.net/en/chapter/tripartite-division-austrian-inheritance'},
  },
]);

export const MAP_GEOMETRY_PRECISION = 'El mapa detallado usa celdas cartográficas como aproximaciones regionales; no reconstruye por sí solo la frontera exacta del feudo en este año.';

export function buildPoliticalMapIndex(personas, year, mapData = null, options = {}) {
  const regions = new Map();
  if (!Number.isInteger(year)) return regions;
  const push = (id, entry) => {
    if (!regions.has(id)) regions.set(id, []);
    regions.get(id).push(entry);
  };
  for (const person of personas) {
    if (!gobiernosDe(person).some(g => g.desde <= year && year <= g.hasta)) continue;
    for (const entry of mapAuthoritiesForPerson(person, year, mapData, options)) {
      for (const id of entry.ids) push(id, entry);
    }
  }
  for (const authority of COLLECTIVE_AUTHORITIES) {
    if (authority.desde > year || authority.hasta < year) continue;
    if (authority.periods && !authority.periods.some(period=>period.desde<=year&&year<=period.hasta)) continue;
    const legacyIds = idsDeReinoEnAño(authority.territorio, year);
    const ids = mapData
      ? mapLocationsForGovernment(mapData, authority, year, null, legacyIds)
      : legacyIds;
    for (const id of ids) {
      push(id, {person:null,government:null,claim:null,territory:authority.territorio,
        collective:authority,kind:authority.kind || 'collective',paint:true});
    }
  }
  // Regional evidence can establish a jurisdiction before an individual
  // mandate has been researched. Keep that evidence visible without
  // inventing a bishop, judge or six-century collective government.
  const regionalLayers = new Set([mapData?.iberiaItalyReview,mapData?.franceLowCountriesReview,mapData?.polandLithuaniaMedievalReview,mapData?.polandLithuaniaReview,mapData?.polandLithuaniaFrontierReview,mapData?.earlyMedievalReview,mapData?.easternEuropeReview].filter(Boolean).flatMap(review=>review.layerNames));
  for (const layer of reviewedMapLayers(mapData).filter(layer => regionalLayers.has(layer.name)&&reviewedLayerActive(mapData,layer,year))) {
    const evidence = reviewedLayerEvidence(layer, year);
    for (const id of reviewedLayerLocations(mapData, layer, year)) {
      if ((regions.get(id) || []).some(entry => entry.paint && !['regional', 'physical', 'tributary'].includes(entry.kind))) continue;
      const identity = territorialIdentity(layer.name);
      if ((regions.get(id) || []).some(entry => entry.regionalEvidence && entry.territory === identity)) continue;
      push(id, {person:null,government:null,claim:null,territory:identity,
        kind: layer.authorityCondition === 'sin poblamiento documentado' ? 'physical' : 'regional',
        paint:true, ids:[id], mapNote:evidence.note, mapSources:evidence.sources,
        regionalEvidence:true});
    }
  }
  return regions;
}

export function inspectMapRegion(regionId, year, index, mapData = null) {
  if (!regionId || !Number.isInteger(year)) return null;
  const allEntries = (index.get(regionId) || []).map(entry => {
    const local = entry.mapScopes?.filter(scope => scope.ids.includes(regionId)) || [];
    if (!local.length) return entry;
    const sources = [...(entry.relationship?.sources || []),...(entry.crownRelation?entry.mapSources||[]:[]), ...local.flatMap(scope => scope.sources || [])];
    return {...entry, mapSources: [...new Map(sources.map(source => [source.url, source])).values()],
      mapNote: [...new Set([entry.relationship?.note,entry.crownRelation?.note, ...local.map(scope => scope.note)].filter(Boolean))].join(' ')};
  }).sort((a,b) =>
    Number(Boolean(b.claim?.sources.length)) - Number(Boolean(a.claim?.sources.length)) ||
    a.territory.localeCompare(b.territory, 'es'));
  return {
    regionId, year, entries: allEntries.filter(e => e.paint !== false),
    claims: allEntries.filter(e => e.paint === false),
    imperialLegalFrame: (mapData
      ? pilotImperialFrameFor(mapData, year).includes(regionId)
      : imperialFrameIds(year).includes(regionId)),
    precision: MAP_GEOMETRY_PRECISION,
  };
}
