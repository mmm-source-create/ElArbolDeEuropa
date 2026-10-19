import {EASTERN_EUROPE_DEPENDENCIES} from './easternEuropeDependencies.js';
// Dependencies are relationships between existing polities, never fabricated
// government records of the overlord. Regional geometry keeps its own identity.
import {gobiernosDe} from '../domain/genealogy/personAccessors.js';
import {gobiernoEfectivo} from '../data/territorios.js';
import {territorialIdentity, territorialLabel} from './territorialIdentity.js';
import {reviewedMapLayers, reviewedLayerLocations, reviewedLayerEvidence} from './locationMapPilot.js';
import {tributaryColor} from './mapColors.js';

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
  serbia: source('Mehmet Hacısalihoğlu · TDV · Sırbistan (Tarih)', 'https://islamansiklopedisi.org.tr/sirbistan', 'Tras las derrotas de 1371 y de Kosovo (1389) los serbios aceptan pagar tributo y envían tropas auxiliares; Stefan Lazarević es el vasallo más fiel de Bayezid I; el despotado desaparece con la toma de Smederevo en 1459.'),
  prussia: source('Gran Enciclopèdia Catalana · Prússia', 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/prussia', 'Tras el segundo tratado de Toruń (1466) la Orden presta vasallaje al rey polaco por la Prusia oriental; el ducado laico de 1525 conserva el carácter de feudo polaco hasta el tratado de Wehlau (1657) y la paz de Oliva (1660).'),
  teutonicRefusal: source('Kurt Forstreuter · Neue Deutsche Biographie 5 (1961), p. 526 · Friedrich, Herzog von Sachsen', 'https://www.deutsche-biographie.de/sfz27778.html', 'Elegido gran maestre el 29 de septiembre de 1498, rehúsa reconocer la paz de Toruń de 1466.'),
  brittany: source('Larousse · Bretagne', 'https://www.larousse.fr/encyclopedie/autre-region/Bretagne/110138', 'Enrique II se convierte en guardián de Bretaña y casa a su hijo Godofredo con Constanza; afirma su autoridad tras la muerte de Godofredo (1186); Felipe Augusto libra a Bretaña de la tutela inglesa.'),
  brittanyAngevin: source('J. A. Everard · Brittany and the Angevins: Province and Empire 1158–1203 (Cambridge University Press, 2000)', 'https://www.cambridge.org/core/books/brittany-and-the-angevins/introduction/A954BB7431A06D787E909EBE351F0037', 'Enrique II incorpora el ducado al «imperio angevino» y lo concede a su hijo Godofredo; capítulos sobre el gobierno de Enrique II, el duque Godofredo (1166–1186) y el final de la Bretaña angevina (1186–1203).'),
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
  {id: 'serbia-ottoman', subject: 'Serbia', overlord: 'Imperio otomano',
    periods: [[1390, 1402]], sources: [sources.serbia],
    note: 'Desde Kosovo (1389) la princesa Milica y su hijo Stefan Lazarević pagan tributo y envían tropas al sultán, como en Nicópolis (1396) y Ankara (1402). Después de Ankara el despotado se apoya en Hungría; las fases posteriores de tributo no se marcan porque falta una cronología anual revisada.'},
  // Fiefs keep their own prince and owe homage; the map marks the dependency
  // only while the overlord's superiority was recognised.
  {id: 'prussia-order-poland', subject: 'Prusia de la Orden', overlord: 'Polonia', type: 'feudo',
    periods: [[1467, 1497]], sources: [sources.prussia, sources.teutonicRefusal],
    note: 'La segunda paz de Toruń (octubre de 1466) obliga a la Orden a prestar vasallaje al rey de Polonia por la Prusia oriental; el gran maestre conserva el gobierno. Desde la elección de Federico de Sajonia (1498) los maestres rehúsan reconocer la paz y el mapa deja de marcar la dependencia.'},
  {id: 'prussia-poland', subject: 'Prusia', overlord: 'Polonia', type: 'feudo',
    periods: [[1525, 1656]], sources: [sources.prussia],
    note: 'Ducado laico y hereditario de los Hohenzollern, feudo de la Corona polaca desde el homenaje de Alberto en Cracovia (1525). Conserva sus instituciones; la unión con Brandeburgo (1618) no cambia el vínculo, que termina con el tratado de Wehlau (septiembre de 1657).'},
  {id: 'brittany-angevin', subject: 'Bretaña', overlord: 'Normandía', overlordLabel: 'los reyes angevinos de Inglaterra', type: 'feudo',
    periods: [[1166, 1195], [1200, 1201]], sources: [sources.brittany, sources.brittanyAngevin],
    note: 'El ducado entra en el «imperio angevino»: Enrique II lo gobierna como guardián de la duquesa Constanza desde 1166 y lo concede a su hijo Godofredo. Sigue dentro del reino de Francia. Se excluyen 1196–1199, cuando Constanza y Arturo se apoyan en Felipe II frente a Ricardo, y desde 1202, cuando Arturo rinde homenaje directamente al rey de Francia.'},
  {id: 'menorca-mallorca-capdepera', subject: 'Emirato de Menorca', overlord: 'Mallorca',
    periods: [[1231, 1286]], sources: [sources.menorca],
    note: 'Vínculo tributario establecido por Jaime I en Capdepera, dentro de la monarquía mallorquina y sus sucesores efectivos. Menorca conserva gobierno musulmán; la conquista de 1287 pone fin a esta relación. El tributo no acredita una administración cristiana directa.'},
]);

// The relation in force for a reviewed regional phase, decided by its
// territorial identity. The panorama paints the subject in a tint of its
// overlord with the dependency pattern.
export function tributaryLayerRelation(name, year, relations = TRIBUTARY_RELATIONS) {
  const subject = territorialIdentity(name);
  for (const relation of relations) {
    if (relation.subject !== subject) continue;
    const period = relation.periods.find(([from, through]) => from <= year && year <= through);
    if (period) return {...relation, from: period[0], through: period[1]};
  }
  return null;
}

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
      colorTerritory: relation.overlord, kind: relation.type === 'feudo' ? 'fief' : 'tributary', paint: true, ids,
      // A fief takes the same tint of its overlord as in the panorama.
      ...(relation.type === 'feudo' ? {color: tributaryColor({...relation}, year)} : {}),
      relationship: {...relation, from: period[0], through: period[1],
        subjectLabel: territorialLabel(relation.subject, year), overlordOffice: office},
      mapSources: relation.sources, mapNote: relation.note,
      mapScopes: layers.map(layer => ({ids: reviewedLayerLocations(data, layer, year), ...reviewedLayerEvidence(layer, year)}))}];
  });
}
