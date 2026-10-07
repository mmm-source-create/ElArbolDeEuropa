"""Dated continuity review. Province crosswalks are candidates, not proof.

Keep legal identity separate from a ruler, a survey's starting year and local
occupation. All selections are explicit regional contours; see the sources and
limitations in the generated review and the visual inventory.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
D = json.loads((HERE / 'corridor-locations.json').read_text())
E = {e['name']: e for e in json.loads((HERE / 'continuity-anchors.json').read_text())['territories']}
CW = D['locationCrosswalk']['newIdsByOldId']
R = {'reviewedAt': '2026-10-08', 'replacements': [], 'territories': [], 'overrides': []}

def source(title, url, locator):
    return {'title': title, 'url': url, 'locator': locator}

CZECH = source('Ministerio de Defensa checo · The Czech Republic', 'https://mocr.mo.gov.cz/images/id_7001_8000/7420/crapa-en.pdf', 'Historia: tierras diferenciadas de Bohemia, Moravia, Silesia y Lusacia; constitución de la Corona en 1348. No son una única provincia.')
CHEB = source('Municipio de Cheb · History of Cheb', 'https://tic.cheb.cz/en/about-cheb/history-of-cheb/', 'Cheb: dominios bohemios 1266–1276 y 1291–1304; incorporación permanente como prenda en 1322. No todo Chebsko moderno se anticipa a 1322.')
UNION = source('Parlamento británico · Act of Union: key dates', 'https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/act-of-union-1707/key-dates/', 'Inglaterra y Escocia permanecen como reinos separados después de 1603; reino de Gran Bretaña desde 1707. Irlanda no se integra en esa unión.')
WALES = source('Parlamento británico · Knights of the shire', 'https://www.parliament.uk/about/living-heritage/evolutionofparliament/originsofparliament/birthofparliament/overview/knights/', 'Doce condados galeses incorporados al Parlamento en 1536. La conquista medieval y la integración institucional posterior son hechos distintos.')
IRELAND = source('Trinity College Dublin · Down Survey of Ireland', 'https://www.tcd.ie/history/research/centres/early-modern/down-survey.php', 'Cartografía territorial de 1656–1658. La reconstrucción insular posterior no se retroproyecta sobre el Pale medieval ni equipara la soberanía de la Corona a la propiedad de todas las tierras.')
FRENCHMAP = source('BnF · Longnon: royaume de France, 1429–1430', 'https://gallica.bnf.fr/ark:/12148/btv1b8446192m', 'Comparación visual de las superficies francesas, inglesas y borgoñonas durante la misión de Juana de Arco; no son las fronteras de Francia moderna.')
NORMANDY = source('English Heritage · The Sieges of Dover', 'https://www.english-heritage.org.uk/sieges-of-dover', 'Pérdida de Normandía y Anjou por Juan en 1204; separar la identidad de los feudos del reino de Inglaterra.')
VERSAILLES = source('Château de Versailles · Versailles et l’Espagne', 'https://www.chateauversailles.fr/decouvrir/histoire/les-grandes-dates/versailles-espagne', 'Conquista de Franco Condado en 1674 y cesión en 1678; nuevas plazas de Flandes. Distinguir conquista efectiva y ratificación.')
PYRENEES = source('Archives diplomatiques · Limites / Espagne', 'https://archivesdiplomatiques.diplomatie.gouv.fr/ark:/14366/x5lcmwfsd78p', 'Tratado de los Pirineos, 1659, y delimitación posterior. Puigcerdà y los relieves meridionales de Cerdaña no se ceden con el Rosellón.')
LORRAINE = source('Archives départementales de Meurthe-et-Moselle · Lettres de noblesse de Stanislas, 1766', 'https://archives.meurthe-et-moselle.fr/content/lettres-de-noblesse-donn%C3%A9es-par-le-roi-stanislas-le-13-janvier-1766', 'Incorporación de Lorena y Bar a Francia tras la muerte de Estanislao en 1766, no desde el inicio de su gobierno.')
FRENCH1270 = source('BnF · Longnon: royaume de France, 1270', 'https://gallica.bnf.fr/ark:/12148/btv1b55010936b', 'Mapa histórico: dominio real, apanages y feudos diferenciados. El Delfinado queda fuera del reino francés.')
DAUPHINE = source('BnF · Franchises du Dauphiné, jurées par Charles en 1349', 'https://ccfr.bnf.fr/portailccfr/ark:/16871/004D13A15103', 'Fol. 72, con cartas y tratados de 1349: transmisión del Delfinado y conservación de sus franquicias. El relieve regional aproxima el territorio, sin incluir Saboya ni Barcelonnette.')
CORSICA = source('Musée de la Corse · La Citadelle', 'https://www.museudiacorsica.corsica/fr/la-citadelle/', 'Cesión genovesa de derechos en 1768; conquista francesa de Corte tras Ponte Novu en mayo de 1769. Reino anglocorso de 1794–1796: no soberanía francesa insular continua.')
ANGLOCORSICA = source('National Library of Scotland · Minto, private letters and dispatches, 1794–1796', 'https://manuscripts.nls.uk/repositories/2/archival_objects/51542', 'Correspondencia original del virrey de Córcega con el gobierno británico, 1794–1796. La escala anual reúne autoridades durante la recuperación francesa de 1796.')
NORDIC = source('Store norske leksikon · Sveriges historie', 'https://snl.no/Sveriges_historie', 'Reinos propios en Kalmar; Roskilde 1658 y Copenhague 1660: Escania, Halland, Blekinge y Bohus permanecen suecos, Trøndelag y Bornholm se restituyen.')
SCANIA = source('Nationalmuseet · Magnus Smek, moneda de Escania', 'https://samlinger.natmus.dk/kmm/object/298575', 'Autoridad de Magnus Eriksson en Escania, 1332–1360. Contornos regionales aproximados de las tierras prendadas; la fecha no extingue los reinos de Dinamarca o Suecia.')
NORWAY = source('Store norske leksikon · Norgesveldet', 'https://snl.no/Norgesveldet', 'Hébridas y Man: soberanía noruega hasta el tratado de Perth de 1266. Las islas no se colorean escocesas desde 1200.')
FAROE = source('Gobierno de las Islas Feroe · Historical timeline', 'https://www.faroeislands.fo/the-big-picture/history-of-the-faroe-islands/historical-timeline', 'Territorio noruego desde 1035, gobierno efectivo de la Corona consolidado a finales del siglo XII; monarquía danesa-noruega desde 1380. Administración feudal de los Gabel, 1655–1709, y administración danesa directa desde 1709. La separación de Noruega ocurre en 1814, fuera del intervalo revisado.')
FINLAND = source('Store norske leksikon · Finlands historie', 'https://snl.no/Finlands_historie', 'Expansión sueca del siglo XIII, Viipuri 1293, frontera de Nöteborg 1323; mapa de límites históricos y Blaeu 1662. Cesiones de 1721 y 1743; ocupación rusa 1713–1721 no es una anexión definitiva de toda Finlandia.')
POLAND = source('Library of Congress · Rizzi-Zannoni, Carte de la Pologne, 1772', 'https://www.loc.gov/resource/gdcwdl.wdl_11294/', 'Mapa provincial anterior a las particiones. Las superficies polaca y lituana se mantienen diferenciadas; no se sustituye Lituania por toda la geometría heredada.')
PARTITIONS = source('AGAD · Colección cartográfica, inventario 402', 'https://agad.gov.pl/inwentarze/402_all.xml', '43-46: frontera polaco-prusiana 1772–1775; 43-43: segundo reparto; 43-44 y 43-51: tercer reparto y atlas de las particiones. Se retira la soberanía de la Mancomunidad en 1795.')
MINDAUGAS = source('Parlamento de Lituania · State Day', 'https://www.lrs.lt/pls/inter/w5_show?p_k=2&p_r=8639', 'Coronación de Mindaugas en 1253: reino reconocido internacionalmente. La fuente acredita el cambio de título, no cada contorno de la selección regional.')
NEUBERG = source('Schönbrunn · Fraternal strife and territorial partitioning', 'https://www.habsburger.net/en/chapter/fraternal-strife-and-territorial-partitioning', 'Neuberg 1379: Estiria, Carintia y Carniola permanecen como tierras propias bajo Leopoldo. La partición dinástica no extingue sus identidades.')
PROVINCES = source('German Historical Institute · Administrative Divisions, 1780', 'https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/administrative-divisions-of-the-habsburg-empire-1780', 'Provincias diferenciadas de Estiria, Carintia y Carniola. Los contornos son aproximados; no se adjudican al monarca los patrimonios de cada señor local.')

def union(*groups):
    return sorted(set().union(*map(set, groups)))

def regional(*names):
    return union(*(CW[n]['ids'] for n in names))

def base(name, year=1400):
    return next(v['ids'] for v in reversed(E[name]['versions']) if v['from'] <= year)

def version(year, cells, event):
    return {'from': year, 'ids': sorted(set(cells)), 'oldIds': [], 'borderline': [], 'event': event}

def replace(name, versions, sources, note, start=1200, end=1800):
    R['replacements'].append({'name': name, 'coverage': {'from': start, 'through': end},
        'versions': versions, 'sources': sources, 'note': note,
        'precision': 'regional_approximation', 'limitedCore': False})

def layer(name, start, end, versions, sources, note, supersedes=(), condition=None):
    e = {'name': name, 'corridor': 'Continuidad e identidad territorial',
        'coverage': {'from': start, 'through': end}, 'active': {'from': start, 'through': end},
        'versions': versions, 'sources': sources, 'note': note,
        'precision': 'regional_approximation', 'limitedCore': False,
        'supersedes': list(supersedes), 'color': '#86715d'}
    if condition:
        e['authorityCondition'] = condition
    R['territories'].append(e)

# Neuberg divides the dynasty's governments, not the existence of provinces.
# Reuse the reviewed regional contours, with Lienz kept outside Carinthia.
P = {e['name']: e for e in json.loads((HERE / 'regional-extent-review.json').read_text())['territories']}
for old, name in [('Ducado de Estiria', 'Estiria'), ('Carintia habsbúrgica antes de Neuberg', 'Carintia'), ('Carniola habsbúrgica antes de Neuberg', 'Carniola')]:
    cells = [x for x in P[old]['versions'][0]['ids'] if x != 'Lienz']
    layer(name, 1200, 1800, [version(1200, cells, 'Provincia histórica; el marco temporal de la revisión no es una fecha de fundación.')],
          [NEUBERG, PROVINCES, *P[old]['sources']],
          'Provincia diferenciada antes y después de las particiones habsbúrgicas. Austria Interior es una agrupación de gobierno, no un territorio que sustituya estas provincias. Los contornos regionales no acreditan propiedad exclusiva ni reconstruyen todos los enclaves medievales.', [old])

# Bohemia is the kingdom, not a union of Moravian and Silesian town cells.
moravia = regional('Brnensko', 'Olomoucko', 'Hradistsko', 'Znojemsko')
bohemia = sorted(set(base('Bohemia')) - set(moravia) - set(regional('Opavsko')))
# Jachymov/Loket belong to Bohemia proper; a crosswalk named Chebsko must not
# remove them together with Cheb. Glatz remains Bohemian until the 1742 cession.
early_boh = [x for x in bohemia if x != 'Cheb']
replace('Bohemia', [version(1200, early_boh, 'Reino de Bohemia sin Cheb.'),
    version(1266, bohemia, 'Cheb bajo Otakar II.'), version(1277, early_boh, 'Retorno de Cheb al Imperio.'),
    version(1291, bohemia, 'Cheb bajo Wenceslao II.'), version(1305, early_boh, 'Retorno de Cheb al Imperio.'),
    version(1322, bohemia, 'Prenda permanente de Cheb a la Corona de Bohemia.'),
    version(1742, [x for x in bohemia if x != 'Klodzko'], 'Cesión de Glatz a Prusia; no desaparición del reino.')],
    [CZECH, CHEB], 'Reino de Bohemia estricto. Moravia, Silesia y Lusacia conservan identidades propias dentro de la Corona. Las celdas de contorno son aproximaciones regionales, no límites de municipios actuales.')
layer('Margraviato de Moravia', 1200, 1800, [version(1200, moravia, 'Margraviato diferenciado antes de 1400.'),
    version(1642, [x for x in moravia if x != 'Olomouc'], 'Olomouc ocupada por Suecia; el resto de Moravia conserva su autoridad.'),
    version(1651, moravia, 'Restitución de Olomouc.'), version(1741, [x for x in moravia if x != 'Olomouc'], 'Ocupación prusiana local de Olomouc.'),
    version(1743, moravia, 'Restitución de Olomouc.')], [CZECH],
    'Margraviato de Moravia. La falta de un mandato personal durante una minoría o interregno no extingue el territorio. Las ocupaciones locales de Olomouc se muestran aparte y no sustituyen todo el margraviato.',
    ['Moravia (núcleo de Brno)', 'Moravia (núcleo de Olomouc)'])

# British territorial continuity; the 1707 union is a real change of polity.
english = base('Inglaterra', 1650)
wales = regional('Gwynedd', 'Powys', 'Brecon', 'Deheubarth', 'Glamorgan')
replace('Inglaterra', [version(1200, [x for x in english if x not in wales], 'Inglaterra; no anticipar la conquista del principado galés.'),
    version(1283, english, 'Soberanía inglesa después de la conquista de Gales; no confundirla con la unión jurídica de 1536.'),
    version(1461, [x for x in english if x != 'Berwick'], 'Berwick cedida a Escocia.'), version(1482, english, 'Berwick vuelve al dominio inglés.')],
    [UNION, WALES], 'Reino de Inglaterra hasta 1706. Unión personal con Escocia desde 1603; reino de Gran Bretaña desde 1707. La representación regional no uniforma las instituciones galesas.', end=1706)
scotland = base('Escocia', 1650)
hebrides = regional('Outer_Hebrides')
norwegian_isles = [x for x in scotland if x in ['Orkney', 'Shetland']]
replace('Escocia', [version(1200, [x for x in scotland if x not in hebrides + norwegian_isles], 'Reino escocés sin islas noruegas.'),
    version(1266, [x for x in scotland if x not in norwegian_isles], 'Hébridas incorporadas por el tratado de Perth.'),
    version(1461, union([x for x in scotland if x not in norwegian_isles], ['Berwick']), 'Berwick cedida a Escocia.'),
    version(1469, scotland, 'Orcadas y Shetland prendadas a la Corona escocesa.')], [UNION, NORWAY], 'Reino propio hasta 1706; la unión dinástica de 1603 no lo borra del mapa.', end=1706)
# The acquisition of the islands did not undo the 1461 transfer of Berwick.
R['replacements'][-1]['versions'][-1]['ids'] = union(scotland, ['Berwick'])
R['replacements'][-1]['versions'].append(version(1482, scotland, 'Berwick vuelve a Inglaterra.'))
layer('Reino de Gran Bretaña', 1707, 1800, [version(1707, union(english, scotland), 'Unión de Inglaterra y Escocia; Irlanda permanece separada.')], [UNION],
    'Reino creado el 1 de mayo de 1707. No incluye Irlanda, que continúa como reino con el mismo soberano hasta 1800.', ['Inglaterra', 'Escocia'])
irish = regional('Donegal', 'Antrim', 'Derry', 'Tyrone', 'Down', 'Roscommon', 'Mayo', 'Meath', 'Galway', 'Dublin', 'Kildare', 'Tipperary', 'Kilkenny', 'Clare', 'Wexford', 'Limerick', 'Waterford', 'Cork', 'Desmond')
replace('Núcleo inglés en Irlanda', [version(1200, base('Núcleo inglés en Irlanda'), 'Ámbito del Pale representado; no toda la expansión anglonormanda.'),
    version(1651, irish, 'Reino de Irlanda: marco insular posterior a las conquistas Tudor y Estuardo.')], [IRELAND, UNION],
    'Antes de 1651 se mantiene la reconstrucción limitada del Pale, sin convertir el título de señor de Irlanda en control de toda la isla. Desde 1651, marco territorial del reino: la propiedad de los señores locales y las rebeliones se documentan aparte.')

# Scandinavia does not start in 1400 or end when the initial survey ends.
dk = base('Reino de Dinamarca')
gotland = regional('Gotland')
skane = regional('Gonge', 'Malmohus', 'Halland', 'Blekinge')
bornholm = ['Hammershus']
dk_main = [x for x in dk if x not in skane + gotland]
replace('Reino de Dinamarca', [version(1200, [x for x in dk if x not in gotland], 'Reino danés antes de la conquista de Gotland.'),
    version(1332, dk_main, 'Escania y territorios asociados prendados a Magnus Eriksson.'),
    version(1360, [x for x in dk if x not in gotland], 'Recuperación danesa de Escania.'),
    version(1361, dk, 'Conquista de Gotland.'), version(1394, [x for x in dk if x not in gotland], 'Control de Gotland fuera de la Corona danesa.'),
    version(1408, dk, 'Gotland vuelve a la Corona danesa.'), version(1645, base('Reino de Dinamarca', 1645), 'Cesiones de Brömsebro.'),
    version(1658, [x for x in dk_main if x not in bornholm], 'Roskilde: cesión de Escania, Blekinge y Bornholm.'),
    version(1660, dk_main, 'Copenhague: Bornholm se restituye a Dinamarca.')], [NORDIC],
    'Reino de Dinamarca separado de Noruega y de los ducados de Schleswig y Holstein; Kalmar y la monarquía compartida no extinguen sus identidades.')
no = base('Reino de Noruega')
no1645 = base('Reino de Noruega', 1645)
bohus = regional('Bohus')
trondelag = regional('Nor_Trondelag', 'Sor_Trondelag', 'Romsdalen')
replace('Reino de Noruega', [version(1200, union(no, hebrides), 'Reino noruego y Hébridas antes de Perth.'),
    version(1266, no, 'Hébridas cedidas a Escocia.'), version(1469, base('Reino de Noruega', 1469), 'Orcadas y Shetland pasan a Escocia.'),
    version(1645, no1645, 'Pérdida de Jämtland y Härjedalen.'), version(1658, [x for x in no1645 if x not in bohus + trondelag], 'Roskilde: cesión de Bohus y Trøndelag.'),
    version(1660, [x for x in no1645 if x not in bohus], 'Restitución de Trøndelag; Bohus continúa sueco.')], [NORDIC, NORWAY],
    'Reino diferenciado dentro de la monarquía danesa-noruega. En el extremo septentrional, el color aproxima espacios de tributación: no prueba una frontera exclusiva sobre los territorios sami.')
se = base('Reino de Suecia')
finland_names = ['Finland', 'Tavastland', 'Nyland', 'Savolax', 'Satakunta', 'Sodra_Osterbotten', 'Norra_Osterbotten']
finland = regional(*finland_names)
se_main = [x for x in se if x not in finland]
se1658 = union(base('Reino de Suecia', 1645), skane, bohus)
# These eastern cells are additions, not a blanket annexation of all Karelia.
east = ['Vyborg', 'Korela', 'Kurkijoki', 'Sortavala', 'Jaskis']
all_svg = set(__import__('xml.etree.ElementTree', fromlist=['ElementTree']).parse(HERE / 'euv-locations-crop.svg').getroot().iter())
svg_ids = {e.attrib.get('id') for e in all_svg}
east = [x for x in east if x in svg_ids]
late = union(se1658, east)
replace('Reino de Suecia', [version(1200, union(se_main, regional('Finland')), 'Suecia y el sudoeste de Finlandia; no retroproyectar toda Finlandia.'),
    version(1250, union(se_main, regional('Finland', 'Tavastland', 'Satakunta', 'Nyland')), 'Expansión del siglo XIII, fecha aproximada del control regional.'),
    version(1323, se, 'Frontera de Nöteborg: ámbitos occidentales finlandeses; límite septentrional aproximado.'),
    version(1332, union(se, skane), 'Tierras escanianas prendadas a Magnus Eriksson; Dinamarca conserva identidad propia.'),
    version(1360, se, 'Recuperación danesa de las tierras escanianas.'),
    version(1645, base('Reino de Suecia', 1645), 'Brömsebro: Halland, Gotland, Jämtland y Härjedalen.'),
    version(1658, union(late, trondelag, bornholm), 'Roskilde: nueva frontera escandinava.'),
    version(1660, late, 'Restitución de Trøndelag y Bornholm.'), version(1721, [x for x in late if x not in east], 'Nystad: cesión de Viipuri y Kexholm.'),
    version(1743, [x for x in late if x not in east + ['Fredrikshamn', 'Villmanstrand', 'Savonlinna', 'Savonranta']], 'Turku: nuevas cesiones orientales; no desaparece la Finlandia sueca.')], [NORDIC, FINLAND, SCANIA],
    'Reino de Suecia con etapas regionales finlandesas; 1250 es una aproximación del proceso, no una fecha de anexión municipal. No incluye automáticamente las provincias bálticas, ni convierte la ocupación rusa de Finlandia en soberanía permanente.', start=1200)

# France: reconstruct dated regional authority rather than erase the entire
# kingdom before Castillon. Appanages are not all independent sovereign states.
fra1453 = base('Francia', 1453)
norm = regional('Ebroicien', 'Caennais', 'Cotentin', 'Rouennais', 'Caux')
angevin = regional('Anjou', 'Lower_Maine', 'Upper_Maine', 'Touraine', 'Upper_Poitou', 'Lower_Poitou')
gascony = regional('Bordelais', 'Bazadais', 'Bayonne', 'Tursan', 'Saintonge', 'Perigord', 'Agenais', 'Angouleme', 'Quercy', 'Limousin')
languedoc = regional('Toulousain', 'Castres', 'Rouergue', 'Narbonnais', 'Razes', 'Nimois', 'Gevaudan', 'Vivarais')
champagne = regional('Champagne', 'Brie_Champenois', 'Remois', 'Perthois')
fra1200 = [x for x in fra1453 if x not in norm + angevin + gascony + languedoc + champagne]
fra1204 = union(fra1200, norm, regional('Anjou', 'Lower_Maine', 'Upper_Maine', 'Touraine'))
fra1224 = union(fra1204, regional('Upper_Poitou', 'Lower_Poitou'))
fra1271 = union(fra1224, languedoc)
fra1284 = union(fra1271, champagne)
# Whole contiguous Dauphinois contours reviewed on the labelled geometry;
# not just the eponymous town. The western edge retains the separate Comtat.
dauphine = ['Vienne', 'Romans', 'Valence', 'Die', 'Grenoble', 'Saint_Marceilin', 'Vercors_Massif', 'La_Mure', 'Briancon', 'Gap', 'Dauphine_Alps2']
fra1349 = union(fra1284, dauphine)
fra1375 = union([x for x in fra1453 if x not in regional('Bordelais', 'Bazadais', 'Bayonne', 'Tursan')], dauphine)
fra1419 = [x for x in fra1375 if x not in norm]
fra1422 = [x for x in fra1419 if x not in regional('Pays_France', 'Beauvaisis', 'Amienois', 'Vermandois', 'Soissonais')]
french_late = base('Francia', 1650)
alsace = [x for x in regional('Upper_Alsace') if x not in ['Mulhouse', 'Murbach']]
french_late = union(french_late, dauphine, alsace, ['Metz', 'Toul', 'Verdun'])
franche = union(*(v['ids'] for v in E['Condado de Borgoña']['versions']))
# Separate 1659 ceded cells from Puigcerdà and southern Pyrenean contours.
pyrenees = ['Perpignan', 'Prades', 'Fenouillet', 'North_Eastern_Pyrenees2']
artois = [x for x in regional('Lower_Artois', 'Upper_Artois') if x != 'Saint_Omer' and x != 'Cambrai']
late1659 = union(french_late, pyrenees, artois)
late1662 = union(late1659, ['Dunkirk'])
late1668 = union(late1662, ['Lille', 'Douai'])
late1674 = union(late1668, franche)
late1678 = union(late1674, ['Saint_Omer', 'Cambrai', 'Valenciennes', 'Maubeuge'])
late1681 = union(late1678, ['Strasbourg'])
lorraine = union(regional('Vosges'), ['Nancy', 'Luneville', 'Bar_le_Duc', 'Saint_Mihiel', 'Sarrebourg', 'Sarreguemines', 'Bitche', 'Saint_Avold', 'Morhange', 'Ligny', 'Neufchateau_des_Vosges', 'Mirecourt', 'Epinal'])
corsica = ['Bastia', 'Ajaccio', 'Corte', 'Bonifacio', 'Calvi', 'Vico', 'Sartene', 'Aleria', 'Corsican_Mountains']
late1766 = union(late1681, lorraine)
late1769 = union(late1766, corsica)
replace('Francia', [version(1200, fra1200, 'Superficie regia reconstruida antes de las conquistas de Felipe Augusto.'),
    version(1204, fra1204, 'Normandía, Anjou, Maine y Touraine.'), version(1224, fra1224, 'Incorporación regional de Poitou.'),
    version(1271, fra1271, 'Incorporación de Toulouse y Languedoc.'), version(1284, fra1284, 'Champagne vinculada a la Corona, antes de su integración institucional.'),
    version(1349, fra1349, 'Delfinado transmitido al delfín, conservando su estatuto propio.'),
    version(1360, [x for x in fra1349 if x not in gascony], 'Brétigny: control inglés ampliado en Aquitania.'),
    version(1375, fra1375, 'Reconquistas de Carlos V; Guyena costera permanece inglesa.'),
    version(1419, fra1419, 'Conquista inglesa de Normandía.'), version(1422, fra1422, 'Gobiernos rivales tras Troyes; no extinguir todo el reino francés.'),
    version(1436, fra1419, 'Recuperación de París.'), version(1450, fra1375, 'Reconquista de Normandía.'),
    *[dict(v, ids=union(v['ids'], dauphine)) for v in E['Francia']['versions'] if v['from'] >= 1453],
    version(1648, french_late, 'Westfalia: Tres Obispados y dominios habsbúrgicos alsacianos; no Mulhouse ni toda Alsacia.'),
    version(1659, late1659, 'Pirineos: Rosellón y parte de Artois. Puigcerdà permanece al sur de la frontera.'),
    version(1662, late1662, 'Compra de Dunkerque.'), version(1668, late1668, 'Lille y Douai ratificadas en Aquisgrán.'),
    version(1674, late1674, 'Conquista de Franco Condado; cesión jurídica en 1678.'),
    version(1678, late1678, 'Nimega: Franco Condado y plazas flamencas.'), version(1681, late1681, 'Estrasburgo incorporada.'),
    version(1766, late1766, 'Lorena y Bar integrados tras la muerte de Estanislao.'),
    version(1769, late1769, 'Conquista efectiva de Córcega, posterior a la cesión de derechos de 1768.'),
    version(1792, union(late1769, regional('Savoy')), 'Saboya integrada en la República francesa.'),
    version(1793, union(late1769, regional('Savoy', 'Nice')), 'Niza integrada; las ocupaciones del Rin no equivalen a anexión jurídica.')],
    [FRENCHMAP, FRENCH1270, DAUPHINE, NORMANDY, VERSAILLES, PYRENEES, LORRAINE, CORSICA],
    'Reino de Francia y, desde 1792, República francesa. Superficie regional de autoridad regia: no identifica cada señorío ni convierte todos los vasallos en propiedad real. La guerra de los Cien Años usa cortes documentados, no una reconstrucción diaria de frentes.')
france = R['replacements'][-1]
late1793 = france['versions'][-1]['ids']
france['versions'].extend([version(1794, [x for x in late1793 if x not in corsica], 'Reino anglocorso: no se mantiene el dominio francés de toda la isla.'),
    version(1796, late1793, 'Recuperación francesa de Córcega; el corte anual reúne el relevo de autoridades.')])
france['sources'].append(ANGLOCORSICA)
layer('Reino de Córcega', 1794, 1796, [version(1794, corsica, 'Reino anglocorso bajo autoridad británica.')], [ANGLOCORSICA, CORSICA],
      'Reino anglocorso de 1794–1796, con gobierno delegado británico. En 1796 se conserva el relevo anual con la recuperación francesa; no se afirma control simultáneo y uniforme de toda la isla durante todo el año.', condition='control disputado')
layer('Ducado de Normandía', 1200, 1203, [version(1200, norm, 'Feudo angevino antes de la conquista francesa.')], [NORMANDY], 'Ducado bajo Juan de Inglaterra; el título ducal y la dependencia feudal se distinguen del reino inglés.')
layer('Normandía · ocupación inglesa', 1419, 1449, [version(1419, norm, 'Conquista inglesa; recuperación francesa de 1449–1450.')], [FRENCHMAP], 'Control militar inglés durante la guerra de los Cien Años; no cambia la identidad de Normandía.', condition='ocupación')
# Existing separately sourced annexation cells supplement the French regional
# surface (Belgium 1795, Luxembourg 1684–1697). They share one identity/color.

# Polish and Lithuanian identities persist after the research cut-off. The
# following dated exclusions prevent projecting the Commonwealth beyond 1795.
poland = base('Corona de Polonia', 1650)
lithuania = base('Gran Ducado de Lituania', 1650)
pol1320 = regional('Krakow', 'Pilzno', 'Nowy_Sacz', 'Szczyrzyc', 'Sandomierz', 'Lublin', 'Radom', 'Checiny', 'Kalisz', 'Poznan', 'Gniezno', 'Pyzdry', 'Koscian', 'Naklo', 'Wielun', 'Sieradz', 'Znin', 'Konin', 'Leczyca', 'Kuyavia')
pol1349 = union(pol1320, regional('Lviv', 'Przemysl', 'Sanok', 'Drohobych', 'Zhydachiv', 'Pocutia', 'Halych'))
pol1667 = [x for x in poland if x not in regional('Kyiv', 'Cherkasy', 'Porossia')]
# Cherkasy and the right-bank Porossia are not ceded wholesale at Andrusovo.
pol1667 = [x for x in poland if x != 'Kyiv']
galicia = regional('Lviv', 'Przemysl', 'Sanok', 'Drohobych', 'Zhydachiv', 'Pocutia', 'Halych', 'Terebovlia', 'Western_Podolia', 'Pilzno', 'Nowy_Sacz', 'Szczyrzyc')
pol1772 = [x for x in pol1667 if x not in galicia + regional('Naklo', 'Znin')]
pol1793 = [x for x in pol1772 if x not in regional('Poznan', 'Gniezno', 'Pyzdry', 'Koscian', 'Kalisz', 'Konin', 'Wielun', 'Sieradz', 'Leczyca', 'Kuyavia', 'Dobrzyn', 'Lutsk', 'Rivne', 'Zviahel', 'Zhytomyr', 'Vinnytsia', 'Bratslav', 'Torgovytsia', 'Ovruch', 'Olevsk', 'Chornobyl', 'Eastern_Podolia')]
replace('Corona de Polonia', [version(1200, [], 'Polonia fragmentada en ducados; no anticipar la Corona reunificada.'),
    version(1320, pol1320, 'Reunificación regia: Polonia Mayor y Menor; Mazovia y Silesia siguen separadas.'),
    version(1349, pol1349, 'Expansión rutenia de Casimiro III; no toda Ucrania.'),
    *[dict(v) for v in E['Corona de Polonia']['versions']],
    version(1667, pol1667, 'Andrusovo: pérdidas orientales; delimitación aproximada mediante celdas regionales.'),
    version(1672, [x for x in pol1667 if x not in regional('Western_Podolia', 'Eastern_Podolia')], 'Podolia cedida a los otomanos.'),
    version(1699, pol1667, 'Restitución de Podolia.'), version(1772, pol1772, 'Primer reparto: Galicia y franja septentrional.'),
    version(1793, pol1793, 'Segundo reparto: pérdidas occidentales y ucranianas.'), version(1795, [], 'Tercer reparto: extinción de la soberanía polaco-lituana.')],
    [POLAND, PARTITIONS], 'Corona de Polonia, diferenciada del Gran Ducado de Lituania. Las particiones representan superficies regionales aproximadas; no límites exactos de 1772 y 1793. Antes de 1320 los ducados deben revisarse por separado.')
litcore = regional('Medininkai', 'Siauliai', 'Upyte', 'Vilnius', 'Vilkmerge', 'Raseiniai', 'Kaunas', 'Trakai', 'Grodno', 'Lida', 'Novogrudok')
lit1772 = [x for x in lithuania if x not in regional('Vitebsk', 'Mstsislaw', 'Mogilev', 'Orsha')]
lit1793 = [x for x in lit1772 if x not in regional('Minsk', 'Barysaw', 'Lahoysk', 'Slutsk', 'Kletsk', 'Pinsk', 'Mazyr', 'Turov', 'Rechytsa')]
replace('Gran Ducado de Lituania', [version(1200, [], 'No anticipar un Estado lituano unificado.'), version(1253, litcore, 'Reino de Mindaugas; núcleo regional aproximado.'),
    version(1263, litcore, 'Gran Ducado después de Mindaugas; no cambia la identidad territorial al cambiar de título.'),
    *[dict(v) for v in E['Gran Ducado de Lituania']['versions']],
    version(1651, lithuania, 'Gran Ducado propio dentro de la Mancomunidad; no desaparece al terminar la primera reconstrucción.'),
    version(1772, lit1772, 'Primer reparto: territorios orientales.'), version(1793, lit1793, 'Segundo reparto: Minsk y territorios meridionales.'),
    version(1795, [], 'Tercer reparto: extinción del Estado, no un simple cambio de nombre.')], [MINDAUGAS, POLAND, PARTITIONS],
    'Identidad lituana diferenciada. La etapa de 1253–1399 es un núcleo regional limitado, no una afirmación sobre todas las conquistas rutenias de Gediminas y Algirdas. Las fronteras de los repartos son aproximadas.')

replace('Islas Feroe bajo la Corona noruega', [
    version(1200, ['Torshavn'], 'Islas Feroe bajo la Corona noruega; Tórshavn es únicamente un punto de referencia.'),
    version(1380, ['Torshavn'], 'Dependencia noruega dentro de la monarquía danesa-noruega.'),
    version(1655, ['Torshavn'], 'Administración feudal de la familia Gabel; persiste la identidad de las islas.'),
    version(1709, ['Torshavn'], 'Administración danesa directa dentro de la monarquía danesa-noruega.')], [FAROE],
    'Islas Feroe: dependencia de la Corona noruega y, desde 1380, de la monarquía danesa-noruega. Los Gabel administran las islas entre 1655 y 1709; desde 1709 la administración es danesa directa. Estos cambios de administración no crean un territorio nuevo. Tórshavn es un punto de referencia: todavía no se representa el perímetro del archipiélago.')
R['replacements'][-1]['limitedCore'] = True
R['replacements'][-1]['precision'] = 'point_reference'

R['limitations'] = [
    'Las celdas modernas aproximan superficies históricas. Las curvas fronterizas exactas y los enclaves menores no están reconstruidos.',
    'El Pale irlandés medieval y el núcleo lituano temprano siguen siendo parciales; no se declara cobertura histórica completa de 1200–1400.',
    'Las ocupaciones temporales y la soberanía superior no convierten una región en un Estado nuevo.',
    'Faltan fases menores de la guerra de los Cien Años, la ocupación rusa de Finlandia y los repartos de la Mancomunidad; deben ampliarse como episodios de control, no duplicando las entidades.',
]
for entry in R['replacements']:
    if entry['name'] == 'Núcleo inglés en Irlanda': entry['limitedCorePeriods'] = [{'from': 1200, 'through': 1650}]
    if entry['name'] == 'Gran Ducado de Lituania': entry['limitedCorePeriods'] = [{'from': 1253, 'through': 1399}]
for entry in R['replacements'] + R['territories']:
    entry['versions'] = sorted({v['from']: v for v in entry['versions']}.values(), key=lambda v: v['from'])
    for v in entry['versions']:
        missing = set(v['ids']) - svg_ids
        if missing:
            raise ValueError((entry['name'], v['from'], sorted(missing)))
(HERE / 'continuity-review.json').write_text(json.dumps(R, ensure_ascii=False, indent=2) + '\n')
print('Continuity review:', len(R['replacements']), 'replaced series,', len(R['territories']), 'new regional layers')
