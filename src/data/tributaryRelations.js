import {EASTERN_EUROPE_DEPENDENCIES} from './easternEuropeDependencies.js';
// Dependencies are relationships between existing polities, never fabricated
// government records of the overlord. Regional geometry keeps its own identity.
import {gobiernosDe} from './personAccessors.js';
import {gobiernoEfectivo} from './territorios.js';
import {territorialIdentity, territorialLabel} from './territorialIdentity.js';
import {reviewedMapLayers, reviewedLayerLocations, reviewedLayerEvidence} from './locationMapPilot.js';

const source = (title, url, locator) => ({title, url, locator});
const sources = {
  ragusa: source('Hrvatska enciklopedija · Dubrovačka Republika', 'https://enciklopedija.hr/clanak/dubrovacka-republika', 'Tributo al sultán desde 1458; interrupción durante la guerra de la Liga Santa y pago de atrasos en 1695. La república conserva rector, consejos y diplomacia.'),
  wallachia: source('Kemal H. Karpat · TDV · Eflak', 'https://islamansiklopedisi.org.tr/eflak', 'Aceptación de la superioridad otomana en 1417; ruptura de Vlad, gobierno tributario de Radu, rebelión de Mihai y continuación de la dependencia en los siglos XVII y XVIII.'),
  moldavia: source('Abdülkadir Özcan · TDV · Boğdan', 'https://islamansiklopedisi.org.tr/bogdan', 'Tributo de Petru Aron en 1455–1456, ruptura de Stefan, restablecimiento posterior, rebeliones del siglo XVI y ruptura de Cantemir en 1711; autonomía respecto de las provincias otomanas.'),
  transylvania: source('Kemal H. Karpat · TDV · Erdel', 'https://islamansiklopedisi.org.tr/erdel', 'Voivodato tributario desde 1541; intervención habsbúrgica de 1551; guerras de 1593–1606 y avance habsbúrgico en la década de 1680. El reconocimiento jurídico de 1699 no prolonga el control tributario efectivo.'),
  naxos: source('Sándor Papp · TDV · Vasal', 'https://islamansiklopedisi.org.tr/vasal', 'Berat de Giacomo IV Crispo de 20 de diciembre de 1564: tributo y obligaciones; José Nasi sucede bajo Selim II. Distingue Estados dependientes y administración provincial directa.'),
  naxosChronology: source('Fundación del Mundo Helénico · List of rulers', 'https://www.ime.gr/chronos/projects/fragokratia/en/pagia_pages/igemones.html', 'Sucesiones y conquistas insulares: la dependencia de Naxos desde 1537 no absorbe Tinos ni las islas conquistadas directamente; final del ducado de Nasi en 1579.'),
  granada: source('José María Alcántara Valle · El régimen feudal en la frontera de Granada', 'https://dialnet.unirioja.es/descarga/articulo/7954788.pdf', 'e-Stratégica 3 (2019), pp. 44–45: pacto de Jaén de 1246, tributo, auxilio militar y ruptura de 1264. No se proyecta un pago continuo hasta 1492.'),
  murcia: source('José María Alcántara Valle · El régimen feudal en la frontera de Granada', 'https://dialnet.unirioja.es/descarga/articulo/7954788.pdf', 'e-Stratégica 3 (2019), p. 44 y nota 33: pacto de Alcaraz de 1243, privilegios de 1253 y final de la superioridad tributaria en primavera de 1264; no administración directa uniforme.'),
  menorca: source('Gran Enciclopèdia Catalana · Els musulmans a les Balears', 'https://www.enciclopedia.cat/historia.-politica-societat-i-cultura-dels-paisos-catalans/els-musulmans-a-les-balears', 'Tratado de vasallaje menorquín de 1231, monarquía mallorquina y conquista de Alfonso III en 1287; gobierno musulmán conservado hasta la conquista.'),
};

export const TRIBUTARY_RELATIONS = Object.freeze([
  ...EASTERN_EUROPE_DEPENDENCIES,
  {id: 'ragusa-ottoman', subject: 'República de Ragusa', overlord: 'Imperio otomano',
    periods: [[1458, 1683], [1695, 1800]], sources: [sources.ragusa],
    note: 'República tributaria con gobierno propio. El pago se interrumpe durante la guerra de la Liga Santa y se reanuda en 1695; no es una provincia del sultán.'},
  {id: 'wallachia-ottoman', subject: 'Principado de Valaquia', overlord: 'Imperio otomano',
    periods: [[1417, 1458], [1462, 1593], [1601, 1800]], sources: [sources.wallachia],
    note: 'Dependencia tributaria del voivodato, con interrupciones en las rebeliones de Vlad y Mihai. Los príncipes y las instituciones locales se conservan. La trama expresa la relación jurídica; no certifica cada pago ni elimina las ocupaciones militares.'},
  {id: 'moldavia-ottoman', subject: 'Principado de Moldavia', overlord: 'Imperio otomano',
    periods: [[1456, 1472], [1487, 1573], [1575, 1593], [1601, 1710], [1712, 1800]], sources: [sources.moldavia],
    note: 'Voivodato tributario con autonomía. Se excluyen las principales rupturas documentadas; 1456 y 1487 son cortes anuales conservadores. Las plazas conquistadas directamente y Bucovina cedida a Austria quedan fuera por su cronología territorial.'},
  {id: 'transylvania-ottoman', subject: 'Transilvania', overlord: 'Imperio otomano',
    periods: [[1541, 1550], [1556, 1594], [1606, 1686]], sources: [sources.transylvania],
    note: 'Voivodato y después principado tributario, con instituciones propias. Se interrumpe durante la administración habsbúrgica y la guerra larga; el avance habsbúrgico posterior no se pinta como dependencia efectiva hasta 1699.'},
  {id: 'archipelago-ottoman', subject: 'Ducado del Archipiélago', overlord: 'Imperio otomano',
    periods: [[1537, 1578]], sources: [sources.naxos, sources.naxosChronology],
    note: 'El ducado conserva un gobierno propio bajo tributo. Sólo se marcan las islas que pertenecen al ducado en este año; Tinos continúa veneciana y las conquistas directas se representan como provincias. Desde 1579 termina esta relación ducal.'},
  {id: 'granada-castile-jaen', subject: 'Granada', overlord: 'Castilla',
    periods: [[1246, 1263]], sources: [sources.granada],
    note: 'El pacto de Jaén impone vasallaje, tributo y auxilio militar a Muhammad I, conservando el emirato nazarí. La rebelión de 1264 interrumpe esta fase; no se confunde con la conquista de 1492.'},
  {id: 'murcia-castile-alcaraz', subject: 'Emirato de Murcia', overlord: 'Castilla',
    periods: [[1243, 1263]], sources: [sources.murcia],
    note: 'Protectorado de Alcaraz con pago de rentas y presencia castellana en fortalezas, conservando las autoridades musulmanas. Se excluyen las plazas conquistadas directamente y la ruptura de 1264; la incorporación de 1266 sigue su propia cronología.'},
  {id: 'menorca-mallorca-capdepera', subject: 'Emirato de Menorca', overlord: 'Mallorca',
    periods: [[1231, 1286]], sources: [sources.menorca],
    note: 'Vínculo tributario establecido por Jaime I en Capdepera, dentro de la monarquía mallorquina y sus sucesores efectivos. Menorca conserva gobierno musulmán; la conquista de 1287 pone fin a esta relación. El tributo no acredita una administración cristiana directa.'},
]);

export function tributaryEntriesFor(person, year, data, ownEntries = [], relations = TRIBUTARY_RELATIONS) {
  if (!person || !data || !Number.isInteger(year)) return [];
  const ownIds = new Set(ownEntries.filter(entry => entry.paint).flatMap(entry => entry.ids));
  return relations.flatMap(relation => {
    const period = relation.periods.find(([from, through]) => from <= year && year <= through);
    if (!period) return [];
    const office = gobiernosDe(person).find(g => g.territorio === relation.overlord
      && gobiernoEfectivo(g) && g.desde <= year && year <= g.hasta
      && !['regencia', 'gobierno delegado', 'rival', 'disputado', 'ocupación'].includes(g.condicion)
      && !g.ambito && (relation.overlord !== 'Imperio otomano' || g.titulo === 'Sultán'));
    if (!office) return [];
    const layers = reviewedMapLayers(data).filter(layer => territorialIdentity(layer.name) === relation.subject);
    const ids = [...new Set(layers.flatMap(layer => reviewedLayerLocations(data, layer, year)))].filter(id => !ownIds.has(id));
    if (!ids.length) return [];
    return [{person, government: null, claim: null, territory: relation.subject,
      colorTerritory: relation.overlord, kind: 'tributary', paint: true, ids,
      relationship: {...relation, from: period[0], through: period[1],
        subjectLabel: territorialLabel(relation.subject, year), overlordOffice: office},
      mapSources: relation.sources, mapNote: relation.note,
      mapScopes: layers.map(layer => ({ids: reviewedLayerLocations(data, layer, year), ...reviewedLayerEvidence(layer, year)}))}];
  });
}
