"""Regional surfaces, rather than isolated town cells, for the extended Atlas.

The old-to-new crosswalk supplies candidates. Explicit dated selections below
are reviewed against the IGN atlas, GHDI maps, and institutional histories.
Keep the original city-core research independently reproducible. No extrapolation
of the last 1650 boundary and no import of the supplied demonstration's masks.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = json.loads((HERE / 'corridor-locations.json').read_text())
LAYERS = {t['name']: t for t in BASE['territories'] + BASE['additionalTerritories']}
CW = BASE['locationCrosswalk']['newIdsByOldId']
OUT = {'reviewedAt': '2026-10-07', 'replacements': [], 'territories': [], 'overrides': []}
SOURCES = {
    'gibraltar': {'title': 'Gibraltar Ministry for Heritage · Timelines', 'url': 'https://www.ministryforheritage.gi/explore-our-heritage/timelines', 'locator': 'Castilla 1309–1332; meriníes 1333–1373; Granada 1374–1461; conquista castellana de 1462.'},
    'algeciras': {'title': 'Ayuntamiento de Algeciras · Historia', 'url': 'https://www.algeciras.es/es/ciudad/historia/', 'locator': 'Conquista castellana de 1344; recuperación nazarí en 1369 y destrucción posterior. Un título de rey de Algeciras no acredita control de la plaza.'},
    'milanBorders': {'title': 'Regione Lombardia · Stato di Milano, 1535–1749', 'url': 'https://www.lombardiabeniculturali.it/istituzioni/schede/8000356/', 'locator': 'Nueve provincias; cesiones occidentales tras las guerras de sucesión. Aquisgrán confirma Ossola, la ribera occidental del Lago Maggiore, Vigevano y el Oltrepò.'},
    'worms1743': {'title': 'Regione Lombardia · Provincia d’Oltrepo e Siccomario', 'url': 'https://www.lombardiabeniculturali.it/archivi/soggetti-produttori/ente/MIDB001830/', 'locator': 'Tratado de Worms, 13 septiembre 1743: Vigevanasco, Siccomario y Oltrepò; confirmado en 1748.'},
    'sicilianArchive': {'title': 'Ministero della Cultura · SIAS: Regno di Sicilia', 'url': 'https://sias-archivi.cultura.gov.it/cgi-bin/pagina.pl?Chiave=28&TipoPag=contesto', 'locator': 'Regnum insular y continental antes de 1282; Vísperas y separación confirmada en Caltabellotta (1302). La superficie regional procede de los contornos insulares y continentales ya revisados.'},
    'ign': {'title': 'IGN · Atlas Nacional de España: Historia', 'url': 'https://www.ign.es/web/resources/acercaDe/libDigPub/06_Referencias_historicas_2020_20230601.pdf', 'locator': 'pp. 21–22: reinos, expansión y fronteras medievales; pp. 29–30: monarquía hispánica y tratados. Comparación de superficies, no solo ciudades.'},
    'ghdi': {'title': 'German Historical Institute · Growth of the Habsburg Empire, 1282–1918', 'url': 'https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/the-growth-of-the-habsburg-empire', 'locator': 'Mapa de adquisiciones: Austria y Estiria 1282, Carintia 1335, Tirol 1363, Bohemia y Silesia 1526, Hungría 1699 y Banato 1718. El cargo imperial no equivale al dominio de todos sus estados.'},
    'ghdi1780': {'title': 'German Historical Institute · Administrative Divisions, 1780', 'url': 'https://germanhistorydocs.org/en/the-holy-roman-empire-1648-1815/administrative-divisions-of-the-habsburg-empire-1780', 'locator': 'Superficies de las provincias hereditarias, Hungría y remanente austríaco de Silesia.'},
    'silesia': {'title': 'Homann · Ducatus Silesiae, 1716 · David Rumsey Collection', 'url': 'https://www.davidrumsey.com/luna/servlet/detail/RUMSEY~8~1~305907~90076292:Ducatus-Silesiae-', 'locator': 'Mapa regional de Alta y Baja Silesia y sus ducados. Se distingue la soberanía de la Corona del gobierno local de cada príncipe.'},
    'opava': {'title': 'Municipio de Opava · Historia de la ciudad', 'url': 'https://www.opava-city.cz/cz/mesto-urad/o-meste/aktuality/historie-mesta.html', 'locator': 'Partición de 1742: Opava, capital de la Silesia austríaca. Los contornos de Opava, Krnov y Jeseník/Fryvaldov aproximan las partes meridionales conservadas, no la frontera fluvial exacta.'},
    'wschowa': {'title': 'Municipio de Wschowa · Historia', 'url': 'https://ambasador.wschowa.pl/page/historia', 'locator': 'Wschowa pasa a Polonia en 1343. No se copia su atribución habsbúrgica del ejemplo adjunto.'},
    'atam': {'title': 'Atatürk Research Center · Türkiye Cumhuriyeti Tarihi I', 'url': 'https://atam.gov.tr/wp-content/uploads/2023/10/TURKIYE-CUMHURIYETI-TARIHI-1a.pdf', 'locator': 'Harita 1 y 2 (pp. PDF 1489–1490): expansión 1299–1683, territorios directos, tributarios y pérdidas. Las incursiones no se consideran anexiones.'},
    'karlowitz': {'title': 'TDV İslâm Ansiklopedisi · Karlofça', 'url': 'https://islamansiklopedisi.org.tr/karlofca', 'locator': 'Tratado de 26 enero 1699: Hungría y Transilvania, Morea y Podolia; Banato conservado por los otomanos.'},
    'passarowitz': {'title': 'TDV İslâm Ansiklopedisi · Pasarofça Antlaşması', 'url': 'https://islamansiklopedisi.org.tr/pasarofca-antlasmasi', 'locator': 'Tratado de 21 julio 1718: Banato, Belgrado/norte de Serbia y Oltenia; Morea otomana.'},
}


def ids(text):
    return sorted(set(text.split()))


def union(*groups):
    return sorted(set().union(*map(set, groups)))


def regional(*old_ids):
    return union(*(CW[id]['ids'] for id in old_ids))


def base(name, year=1400):
    return next(v['ids'] for v in reversed(LAYERS[name]['versions']) if v['from'] <= year)


def v(year, cells, event):
    return {'from': year, 'ids': sorted(set(cells)), 'oldIds': [], 'borderline': [], 'event': event}


def replace(name, versions, keys, note, period=None):
    OUT['replacements'].append({'name': name, 'periods': period or [{'from': 1200, 'through': 1399}, {'from': 1651, 'through': 1800}],
        'precision': 'regional_approximation', 'limitedCore': False, 'versions': versions,
        'note': note + ' Selección regional contrastada con la cartografía citada; no equivalen a un deslinde municipal exacto.',
        'sources': [SOURCES[k] if isinstance(k, str) else k for k in keys]})


def layer(name, start, end, versions, keys, note, color='#86715D', supersedes=()):
    OUT['territories'].append({'name': name, 'corridor': 'Revisión de superficies regionales', 'color': color,
        'coverage': {'from': start, 'through': end}, 'active': {'from': start, 'through': end},
        'precision': 'regional_approximation', 'limitedCore': False, 'versions': versions,
        'sources': [SOURCES[k] if isinstance(k, str) else k for k in keys], 'note': note,
        'supersedes': list(supersedes)})


# Iberia: the stable medieval surfaces are established independently of the
# later acquisitions. Murcia/Orihuela, Granada and overseas islands stay dated.
cast1200 = regional('Burgos', 'Palencia', 'Lerma', 'Soria', 'Valladolid', 'Avila', 'Segovia', 'Guadalajara', 'Cuenca', 'Toledo', 'Madrid')
cast1300 = [x for x in base('Castilla', 1400) if x not in ['Tarifa', 'Algeciras']]
castlate = base('Castilla', 1650)
replace('Castilla', [v(1200, cast1200, 'Castilla anterior a las conquistas meridionales.'),
    v(1236, union(cast1200, ['Cordoba']), 'Córdoba: la conquista de la ciudad no anticipa todo su entorno.'),
    v(1246, union(cast1200, regional('Cordoba'), ['Jaen']), 'Córdoba regional; incorporación de Jaén.'),
    v(1248, union(cast1200, regional('Cordoba', 'Jaen'), ['Sevilla']), 'Sevilla: expansión todavía diferenciada.'),
    v(1266, cast1300, 'Superficie posterior a las conquistas andaluzas y murcianas, sin reino nazarí.'),
    v(1292, union(cast1300, ['Tarifa']), 'Conquista de Tarifa; no se anticipa Algeciras.'),
    v(1309, union(cast1300, ['Tarifa', 'Gibraltar']), 'Primera conquista de Gibraltar.'),
    v(1333, union(cast1300, ['Tarifa']), 'Gibraltar pasa al dominio meriní, separado de Granada hasta 1374.'),
    v(1344, union(cast1300, ['Tarifa', 'Algeciras']), 'Conquista de Algeciras.'),
    v(1369, union(cast1300, ['Tarifa']), 'Algeciras vuelve al dominio nazarí; no prolongar la conquista de 1344.'),
    v(1651, castlate, 'Superficie castellana completa, incluida Granada incorporada en 1492.'),
    v(1704, [x for x in castlate if x != 'Gibraltar'], 'Ocupación británica de la plaza de Gibraltar.'),
    v(1713, [x for x in castlate if x != 'Gibraltar'], 'Cesión legal de Gibraltar; no de toda su comarca.')], ['ign', 'algeciras'],
    'Jurisdicción castellana de la monarquía compuesta, no todos los dominios de su rey. El reino nazarí se mantiene separado hasta 1492.')
leon1200 = regional('Coruna', 'Santiago', 'Lugo', 'Ourense', 'Astorga', 'Benavente', 'Leon', 'West_Asturias', 'East_Asturias', 'Zamora', 'Ciudad_Rodrigo', 'Salamanca')
leonlate = [x for x in base('León') if x != 'Olivenza']
replace('León', [v(1200, leon1200, 'León antes de la conquista extremeña.'), v(1229, union(leon1200, regional('Caceres')), 'Cáceres y su entorno.'), v(1230, leonlate, 'Mérida y Badajoz; unión personal con Castilla.'), v(1651, leonlate, 'Jurisdicción leonesa, sin atribuir Olivenza española antes de 1801.')], ['ign'], 'La unión personal no borra la jurisdicción leonesa. Olivenza sigue en Portugal hasta 1801.')
port1200 = regional('Minho', 'Tras_Os_Montes', 'Beira_Alta', 'Beira_Litoral', 'Beira_Baixa', 'Ribatejo', 'Estremadura')
portlate = base('Portugal', 1400)
replace('Portugal', [v(1200, port1200, 'Superficie septentrional anterior al Algarve.'), v(1249, [x for x in portlate if x != 'Olivenza'], 'Conquista del Algarve: superficie peninsular, sin colonias anticipadas.'), v(1297, portlate, 'Alcañices: Olivenza portuguesa.'), v(1651, base('Portugal', 1650), 'Portugal restaurado; se conservan Madeira y las Azores, incorporadas en sus fechas anteriores.')], ['ign'], 'Se conservan superficies de Portugal, no solo sus ciudades. La serie de 1200 necesita todavía precisar las sucesivas pérdidas y recuperaciones de Alentejo.')
aragon = base('Aragón')
replace('Aragón', [v(1200, [x for x in aragon if x != 'Albarracin'], 'Reino aragonés sin Albarracín independiente.'), v(1284, aragon, 'Incorporación de Albarracín.'), v(1651, aragon, 'Superficie aragonesa, incluida la cordillera y los valles.')], ['ign'], 'Aragón se mantiene separado de Valencia y Cataluña, aunque compartan soberano.')
catalan = [x for x in base('Condado de Barcelona') if x not in ['Andorra_la_Vella', 'Perpignan', 'Prades', 'Puigcerda']]
catalanlate = [x for x in base('Condado de Barcelona', 1650) if x != 'Andorra_la_Vella']
replace('Condado de Barcelona', [v(1200, union(catalan, ['Perpignan', 'Prades', 'Puigcerda']), 'Superficie catalana y condados septentrionales antes de la división mallorquina.'),
    v(1276, catalan, 'Rosellón y Cerdaña se separan con la rama mallorquina.'),
    v(1344, union(catalan, ['Perpignan', 'Prades', 'Puigcerda']), 'Reincorporación de los condados septentrionales.'),
    v(1651, [], 'Guerra dels Segadors: no se atribuye un control español uniforme.'),
    v(1652, catalanlate, 'Recuperación de Barcelona; Rosellón aún no cedido.'),
    v(1659, [x for x in catalanlate if x not in ['Perpignan', 'Prades']], 'Rosellón cedido; Puigcerdà y Pirineo meridional permanecen hispánicos.')], ['ign'], 'Las celdas aproximan la jurisdicción catalana. Andorra tiene coprincipado propio; no se absorbe por el nombre de Urgell.')
valencia = base('Valencia')
valencianorth = [x for x in valencia if x not in ['Orihuela', 'Elche', 'Alicante', 'Ayora']]
replace('Valencia', [v(1200, [], 'No se anticipa el reino cristiano de Valencia.'), v(1238, ['Valencia', 'Lliria', 'Castellon_de_la_Plana', 'Morella', 'Peniscola'], 'Conquista septentrional; no se anticipa todo el sur.'), v(1245, valencianorth, 'Expansión hasta los límites pactados de Almizra.'), v(1281, union(valencianorth, ['Ayora']), 'Incorporación de Ayora.'), v(1305, valencia, 'Torrellas y Elche: incorporación de Alicante, Elche y Orihuela.'), v(1651, valencia, 'Superficie valenciana completa.')], ['ign'], 'Los límites meridionales cambian en 1304–1305; Murcia conserva su jurisdicción castellana.')
islands = base('Mallorca')
replace('Mallorca', [v(1200, [], 'No anticipar la conquista cristiana.'), v(1229, ['Palma'], 'Conquista de Palma; persisten resistencias insulares.'), v(1232, ['Palma', 'Pollensa', 'Manacor'], 'Control de la isla principal.'), v(1235, ['Palma', 'Pollensa', 'Manacor', 'Ibiza'], 'Ibiza incorporada.'), v(1287, islands, 'Conquista de Menorca.'), v(1651, islands, 'Islas bajo la monarquía española.'), v(1708, [x for x in islands if x != 'Ciudadela_de_Menorca'], 'Menorca ocupada por Gran Bretaña.'), v(1782, islands, 'Recuperación española de Menorca.'), v(1798, [x for x in islands if x != 'Ciudadela_de_Menorca'], 'Nueva ocupación británica.')], ['ign'], 'Mallorca y Menorca son superficies insulares completas; el mandato de cada potencia sigue separado.')
replace('Granada', [v(1200, [], 'No se anticipa la formación nazarí.'), v(1238, ['Granada'], 'Núcleo de la formación inicial.'), v(1246, base('Granada'), 'Superficie nazarí después del pacto de Jaén.'), v(1651, [], 'Sin soberanía nazarí después de 1492.')], ['ign'], 'La Sierra Nevada y los relieves pertenecientes al reino no se excluyen por tener un nombre físico.')

layer('Gibraltar meriní', 1333, 1373, [v(1333, ['Gibraltar'], 'Plaza meriní después del sitio de 1333; dominio nazarí desde 1374.')], ['gibraltar'], 'Plaza fronteriza de soberanía meriní, distinta del reino nazarí. No colorea todo el Campo de Gibraltar ni añade un mandato personal por inferencia.', '#739489')

# Southern Italy: regnum Siciliae includes island AND mainland before 1282.
naples = base('Nápoles')
sicily = base('Trinacria')
sicilylate = base('Trinacria', 1650)
layer('Reino de Sicilia antes de 1282', 1200, 1281, [v(1200, union(naples, sicily), 'Reino insular y continental; división de las Vísperas desde 1282.')], ['sicilianArchive'], 'Soberanía del reino de Sicilia: no solo Palermo y nueve ciudades continentales. Contorno regional aproximado; no un mapa de los feudos internos.', '#B08A48', ['Sicilia'])
replace('Nápoles', [v(1200, [], 'El reino continental se representa en Sicilia antes de 1282.'), v(1282, naples, 'Reino continental tras las Vísperas.'), v(1651, naples, 'Superficie completa, incluidos Apeninos y Calabria.'), v(1799, [], 'Episodio republicano y restauración: control no uniforme dentro del año.'), v(1800, naples, 'Restauración de la superficie del reino.')], ['sicilianArchive'], 'La sucesión española, austríaca y borbónica corresponde a los gobiernos fechados; no cambia el contorno por cada dinastía.')
replace('Trinacria', [v(1200, [], 'Antes de 1282 se integra en el reino de Sicilia.'), v(1282, sicily, 'Reino insular separado.'), v(1651, sicilylate, 'Superficie insular; Malta está separada desde 1530.')], ['sicilianArchive'], 'Incluye el interior de la isla y Etna. Malta no se recupera mediante una expansión geométrica.')

# Austrian duchies: surfaces of provinces, not of the Holy Roman Empire.
danube = union(base('Austria'), ['Linz', 'St_Georgen'])
replace('Austria', [v(1200, danube, 'Ducado sobre y bajo el Enns; Estiria se representa por separado.'), v(1651, danube, 'Superficie danubiana hereditaria.'), v(1779, union(danube, ['Braunau', 'Ried', 'Scharding']), 'Innviertel adquirido por la paz de Teschen.')], ['ghdi', 'ghdi1780'], 'Austria sobre y bajo el Enns, sin Salzburgo ni Baviera. Pitten y Wiener Neustadt corresponden históricamente a Estiria en estas series.')
styrian = regional('Eastern_Styria', 'Upper_Styria', 'Middle_Styria', 'Lower_Styria')
carinthia = regional('Upper_Carinthia', 'Lower_Carinthia')
carniola = regional('Upper_Carniola', 'Lower_Carniola')
layer('Ducado de Estiria', 1200, 1378, [v(1200, styrian, 'Estiria como ducado propio, incorporada por los Babenberg en 1192.')], ['ghdi'], 'La superficie ducal mantiene su identidad antes de Austria Interior. Sus gobernantes tienen un mandato estirio separado, no un título imperial.', '#B28964')
layer('Carintia habsbúrgica antes de Neuberg', 1335, 1378, [v(1335, carinthia, 'Concesión de Carintia a Alberto II y Otón en 1335.')], ['ghdi'], 'Carintia secular adquirida en 1335; no toda la región alpina ni los obispados vecinos.', '#AB785C')
layer('Carniola habsbúrgica antes de Neuberg', 1335, 1378, [v(1335, carniola, 'Dominios carniolanos anteriores a la agrupación de 1379.')], ['ghdi'], 'Carniola como jurisdicción histórica; el litoral veneciano se mantiene separado.', '#B79A66')
inner = union(styrian, carinthia, carniola)
innerlate = base('Austria Interior', 1650)
replace('Austria Interior', [v(1200, [], 'Antes de 1379 se consultan los ducados por separado.'), v(1379, inner, 'Partición de Neuberg: Estiria, Carintia y Carniola.'), v(1382, union(inner, ['Trieste']), 'Trieste se incorpora.'), v(1651, innerlate, 'Superficies interiores y litoral, incluidas adquisiciones de 1500.')], ['ghdi', 'ghdi1780'], 'Agrupación dinástica con provincias propias; no se inventa Austria Interior antes de 1379.')
tyrol = base('Tirol')
replace('Tirol', [v(1200, [], 'La primera geometría del condado continúa pendiente.'), v(1300, tyrol, 'Superficie secular anterior a la cesión habsbúrgica.'), v(1363, tyrol, 'Cesión del condado a los Habsburgo.'), v(1651, base('Tirol', 1650), 'Superficie secular, incluida Lienz y adquisiciones de 1504/1505.')], ['ghdi', 'ghdi1780'], 'Trento, Brixen y Salzburgo conservan sus gobiernos episcopales; no se anticipa la secularización de 1803.')

# Silesia: superior sovereignty must not disappear because feudal dukes exist.
# Visually excluded: Wschowa/Rawicz/Ostrzeszow (Greater Poland), Zary (Lusatia),
# Klodzko (Bohemian county before the 1742 cession), and Siewierz (Krakow).
silesia = ids('Zielona_Gora Zagan Glogow Gora Kozuchow Szprotawa Boleslawiec Zlotoryja Legnica Wolow Milicz Trzebnica Sycow Olesnica Namyslow Wroclaw Sroda_Slaska Jawor Kamienna_Gora Swidnica Rychbach Niemcza Ziebice Olawa Brzeg Grodkow Nysa Niemodlin Opole Kluczbork Olesno Lubliniec Strzelce_Opolskie Prudnik Kozle Bytom Toszek Raciborz Pszczyna Glubczyce Hlucin Opava Krnov Fryvaldov Tesin Bielsko')
early = [x for x in silesia if x not in ['Swidnica', 'Jawor', 'Kamienna_Gora', 'Rychbach', 'Niemcza']]
layer('Silesia · soberanía de la Corona', 1335, 1740, [v(1335, early, 'Ducados feudatarios; Schweidnitz-Jauer aún separado.'), v(1392, silesia, 'Incorporación definitiva de Schweidnitz-Jauer; soberanía superior de la Corona.')], ['silesia', 'ghdi', 'wschowa'], 'Soberanía superior de la Corona bohemia y, desde 1526, de los Habsburgo. No afirma que el rey gobernase directamente todos los ducados: sus príncipes y el obispado de Nysa conservan jurisdicciones propias. Glatz se conserva en Bohemia; no se absorben la Gran Polonia ni Lusacia.', '#98765E', ['Silesia real (Wrocław y Środa)', 'Silesia real (Głogów)'])
austrian = ids('Opava Krnov Fryvaldov Tesin Bielsko')
prussian = union([x for x in silesia if x not in austrian], ['Klodzko'])
layer('Silesia · ocupación prusiana', 1741, 1741, [v(1741, [x for x in prussian if x not in ['Klodzko', 'Opole', 'Kluczbork', 'Olesno', 'Lubliniec', 'Strzelce_Opolskie', 'Prudnik', 'Kozle', 'Bytom', 'Toszek', 'Raciborz', 'Pszczyna', 'Glubczyce', 'Hlucin', 'Nysa', 'Grodkow', 'Niemodlin']], 'Ocupación anterior a la cesión de 1742; avance aproximado al cierre del año.')], ['opava', 'ghdi'], 'Núcleo regional de la Baja Silesia ocupada en 1741, sin anticipar toda la Alta Silesia ni la cesión de Glatz; la soberanía jurídica se distingue desde 1742. Las celdas de frontera son aproximaciones regionales.', '#65778A', ['Silesia (ocupación prusiana de 1741)'])
OUT['territories'][-1]['authorityCondition'] = 'control disputado'
layer('Silesia · parte prusiana', 1742, 1800, [v(1742, prussian, 'Partición de 1742: mayor parte de Silesia y condado de Glatz.')], ['opava', 'ghdi1780'], 'Silesia prusiana con el condado bohemio de Glatz cedido en el mismo tratado. No incluye Teschen/Bielsko ni los entornos austríacos de Opava, Krnov y Jeseník. Frontera de celdas aproximada, no trazado exacto de los ríos.', '#65778A', ['Silesia prusiana (núcleos)'])
layer('Silesia · remanente austríaco', 1742, 1800, [v(1742, austrian, 'Remanente meridional después de la cesión a Prusia.')], ['opava', 'ghdi1780'], 'Teschen y Bielsko; partes meridionales de Troppau/Opava, Jägerndorf/Krnov y Nysa/Jeseník. Las celdas Opava, Krnov y Fryvaldov cruzan el deslinde histórico: asignación regional aproximada al lado austríaco, sin afirmar que todo su contorno quedara allí.', '#9A7780', ['Silesia austríaca (núcleo de Teschen)'])
OUT['territories'][-1]['borderlineIds'] = ['Opava', 'Krnov', 'Fryvaldov']

# Restore complete southern-Balkan surfaces beyond 1650, keeping treaty changes.
# These are territorial jurisdictions; autonomous tributary principalities do
# not become directly governed Ottoman provinces.
southern = union(base('Balcanes meridionales otomanos', 1650), [o['id'] for o in BASE['overrides'] if o['territory'] == 'Balcanes meridionales otomanos' and o['action'] == 'add' and o['from'] <= 1650 <= o['through']])
morea = regional('Morea') if 'Morea' in CW else ids('Andravida Andritsaina Argos Astros Corinth Kalamata Kalavryta Karytaina Kyparissia Leuktron Monemvasia Mystras Oitylo Patras Tripolitsa Veligosti Vostitsa Xylokastro Chalandritsa Ermioni Nafplio Peloponnesian_Mountains1 Peloponnesian_Mountains2 Pontikokastro')
northserbia = ids('Belgrad Smederevo Valjevo Rudnik Jagodina Sabac')
northserbia = [x for x in northserbia if x in set(southern) or x == 'Sabac']
replace('Balcanes meridionales otomanos', [v(1651, southern, 'Superficie regional, sin perder Bulgaria, Serbia ni los relieves al ampliar el tiempo.'), v(1699, [x for x in southern if x not in morea], 'Morea cedida a Venecia por Karlowitz.'), v(1715, southern, 'Morea recuperada por los otomanos.'), v(1718, [x for x in southern if x not in northserbia], 'Norte de Serbia cedido a Austria.'), v(1739, southern, 'Belgrado y norte de Serbia recuperados.')], ['atam', 'karlowitz', 'passarowitz'], 'Balcanes de administración otomana directa. Valaquia, Moldavia y Transilvania tributarias conservan sus superficies y autoridad propia.', [{'from': 1651, 'through': 1800}])
bosnia = union(base('Bosnia y Herzegovina otomanas', 1650), [o['id'] for o in BASE['overrides'] if o['territory'] == 'Bosnia y Herzegovina otomanas' and o['action'] == 'add' and o['from'] <= 1650 <= o['through']])
replace('Bosnia y Herzegovina otomanas', [v(1651, bosnia, 'Superficie bosnia y herzegovina al inicio del período tardío.'), v(1699, [x for x in bosnia if x not in ['Knin', 'Sinj', 'Makarska']], 'Frontera dálmata tras Karlowitz: plazas venecianas excluidas.')], ['atam', 'karlowitz'], 'Bosnia y Herzegovina siguen bajo gobierno otomano; el litoral y las adquisiciones de Venecia no se absorben por proximidad.', [{'from': 1651, 'through': 1800}])
wallachia = base('Principado de Valaquia', 1650)
oltenia = ids('Calafat Caracal Craiova Cozia Dragasani Plenita Ramnicu_Valcea Slatina Stramba Strehaia Targu_Bengai Targu_Jiu')
replace('Principado de Valaquia', [v(1651, wallachia, 'Principado tributario con autoridad propia.'), v(1718, [x for x in wallachia if x not in oltenia], 'Oltenia bajo administración habsbúrgica.'), v(1739, wallachia, 'Restitución de Oltenia a Valaquia.')], ['atam', 'passarowitz'], 'El tributo al sultán no convierte el principado en provincia otomana ni borra a su príncipe.', [{'from': 1651, 'through': 1800}])
replace('Principado de Moldavia', [v(1651, base('Principado de Moldavia', 1650), 'Principado tributario sin puertos otomanos ya separados.'), v(1775, [x for x in base('Principado de Moldavia', 1650) if x not in ['Suceava', 'Siret', 'Putna', 'Campulung_Moldovenesc']], 'Bucovina pasa a Austria.')], ['atam', 'ghdi'], 'Moldavia conserva su autoridad principesca; Chilia, Cetatea Alba y Tighina no regresan por ampliar la cronología.', [{'from': 1651, 'through': 1800}])
banat = regional('East_Banat', 'West_Banat')
royal1651 = union(base('Hungría real', 1650), [o['id'] for o in BASE['overrides'] if o['territory'] == 'Hungría real' and o['action'] == 'add' and o['from'] <= 1650 <= o['through']])
ottoman1651 = union(base('Hungría otomana', 1650), [o['id'] for o in BASE['overrides'] if o['territory'] == 'Hungría otomana' and o['action'] == 'add' and o['from'] <= 1650 <= o['through']])
restored = union(royal1651, [x for x in ottoman1651 if x not in banat])
replace('Hungría real', [v(1651, royal1651, 'Hungría real anterior a la reconquista.'), v(1699, restored, 'Karlowitz: superficie recuperada sin Banato.'), v(1718, union(restored, banat), 'Passarowitz: Banato incorporado; administración provincial propia.')], ['ghdi', 'karlowitz', 'passarowitz'], 'Superficie de la Corona húngara bajo los Habsburgo, distinta de Bohemia, Austria y Transilvania. Las conquistas de la guerra se aproximan en los cortes de tratados; no se datan todos los sitios de fortalezas.', [{'from': 1651, 'through': 1800}])
replace('Hungría otomana', [v(1651, ottoman1651, 'Superficie otomana húngara.'), v(1699, banat, 'Solo el Banato después de Karlowitz.'), v(1716, [], 'Conquista habsbúrgica de Temesvár, antes de la cesión legal de 1718.')], ['atam', 'karlowitz', 'passarowitz'], 'No conserva Buda ni toda Hungría otomana después de 1699; el Banato se diferencia de la Hungría real.', [{'from': 1651, 'through': 1800}])
replace('Transilvania', [v(1651, base('Transilvania', 1650), 'Principado de autoridad propia, bajo dependencia otomana.'), v(1699, [], 'Transilvania habsbúrgica por separado, sin mantener al príncipe tributario anterior.')], ['atam', 'karlowitz'], 'La transición habsbúrgica no prolonga el gobierno de un antiguo príncipe otomano.', [{'from': 1651, 'through': 1800}])
layer('Transilvania habsbúrgica', 1699, 1800, [v(1699, base('Transilvania', 1650), 'Soberanía habsbúrgica reconocida en Karlowitz; provincia con administración propia.')], ['ghdi', 'karlowitz'], 'Provincia transilvana bajo soberanía habsbúrgica, distinta de la integración administrativa de Hungría de 1867.', '#867D5A')
layer('Norte de Serbia habsbúrgico', 1718, 1738, [v(1718, northserbia, 'Provincia de Serbia del tratado de Passarowitz.')], ['passarowitz', 'atam'], 'Norte de Serbia y Belgrado, 1718–1739. La precisión anual coloca la restitución en la serie otomana de 1739.', '#AD886A')
layer('Oltenia habsbúrgica', 1718, 1738, [v(1718, oltenia, 'Valaquia occidental bajo administración habsbúrgica.')], ['passarowitz', 'atam'], 'Oltenia occidental, conservada como provincia separada y restituida en 1739.', '#AB805B')


# Late Italian jurisdictions: rebuild regional surfaces and keep the reviewed
# occupation/annexation cuts of the documentary chronology, not city placeholders.
EARLIER = {t['name']: t for t in json.loads((HERE / 'extended-corridors-locations.json').read_text())['temporalExtensions']}
late_period = [{'from': 1651, 'through': 1800}]
def dated_surface(name, versions, note):
    replace(name, versions, EARLIER[name]['sources'] + ([SOURCES['milanBorders'], SOURCES['worms1743']] if name in ['Milán', 'Piamonte'] else []), note, late_period)

milanlate = base('Milán', 1650)
milan1713 = [x for x in milanlate if x not in ['Alessandria', 'Novi', 'Lomello', 'Varallo']]
milan1738 = [x for x in milan1713 if x not in ['Novara', 'Tortona']]
dated_surface('Milán', [v(1651, milanlate, 'Jurisdicción milanesa española: superficie, no ocho ciudades.'), v(1713, milan1713, 'Cesiones occidentales saboyanas: Alessandrino, Monferrato y territorios relacionados.'), v(1738, milan1738, 'Novarese y Tortonese cedidos a Saboya; aproximación por regiones.'), v(1743, [x for x in milan1738 if x not in ['Voghera', 'Rovegno', 'Arona', 'Domodossola']], 'Cesiones de Worms, confirmadas por Aquisgrán en 1748.'), v(1796, [], 'Fin del dominio ducal efectivo; repúblicas y ocupaciones conservan capas propias.')], 'Lombardía española y austríaca. Las cesiones saboyanas se excluyen por comarcas; la celda montañosa Rhaetian_Alps5 conserva la revisión de frontera anterior.')
dated_surface('Toscana', [v(1651, base('Toscana', 1650), 'Gran ducado con Siena y su contado; Lucca y Estado de los Presidios separados.'), v(1799, [], 'Ocupación francesa y expulsión temporal del gran duque: no prolongar gobierno efectivo.')], 'Superficie del gran ducado, no seis capitales. El cambio de dinastía de 1737 no reduce la jurisdicción a ciudades.')
venice1651 = base('Venecia', 1650)
creta = ids('Candia Chania Elounda Gergeri Hagios_Pavlos Rethymno Siteia Viannos')
venice1669 = [x for x in venice1651 if x not in creta]
dated_surface('Venecia', [v(1651, venice1651, 'Terraferma, Istria, Dalmacia e islas que siguen bajo Venecia.'), v(1669, venice1669, 'Pérdida de Candia; los enclaves de fortalezas no se aíslan con estas celdas.'), v(1797, [], 'Fin de la República: el título del dogo no pinta posesión posterior.'), v(1798, [x for x in venice1669 if x not in ['Bergamo', 'Brescia', 'Chiari', 'Crema', 'Iseo', 'Lonato', 'Orzinuovi', 'Romano', 'Rovato', 'Salo', 'Treviglio']], 'Administración austríaca tras Campo Formio; territorios occidentales cisalpinos excluidos.')], 'Se conservan las superficies continentales y montañosas. La evolución de fortalezas de Creta y Dalmacia sigue necesitando un trazado de fronteras más fino.')
dated_surface('Estados Pontificios', [v(1651, base('Estados Pontificios', 1650), 'Patrimonio, Umbría, Marcas y legaciones adquiridas de Bologna, Ferrara y Urbino.'), v(1798, [], 'República Romana: sin gobierno pontificio efectivo.'), v(1800, base('Estados Pontificios', 1650), 'Restauración jurisdiccional pontificia; el control militar de cada plaza no se considera uniforme.')], 'Soberanía territorial pontificia con instituciones locales y feudos propios; no jurisdicción espiritual universal. Restauración de 1800 aproximada en escala anual.')
piemonte = [x for x in base('Piamonte', 1650) if x != 'Pinerolo']
dated_surface('Piamonte', [v(1651, piemonte, 'Principado saboyano sin Pinerolo, todavía francesa.'), v(1696, union(piemonte, ['Pinerolo']), 'Restitución de Pinerolo.'), v(1713, union(piemonte, ['Pinerolo', 'Alessandria', 'Novi', 'Lomello', 'Varallo']), 'Adquisiciones del Alessandrino tras Utrecht.'), v(1738, union(piemonte, ['Pinerolo', 'Alessandria', 'Novi', 'Lomello', 'Varallo', 'Novara', 'Tortona']), 'Adquisiciones occidentales milanesas.'), v(1743, union(piemonte, ['Pinerolo', 'Alessandria', 'Novi', 'Lomello', 'Varallo', 'Novara', 'Tortona', 'Voghera', 'Rovegno', 'Arona', 'Domodossola']), 'Cesiones de Worms de 1743, confirmadas en Aquisgrán en 1748; celdas de valles aproximadas.'), v(1798, [], 'Ocupaciones francesas: cesa la autoridad saboyana continental efectiva.')], 'Piamonte regional separado de Saboya y de Cerdeña. No se anticipa la autoridad saboyana sobre las comunas medievales.')
savoy = [x for x in base('Saboya', 1650) if x != 'Barcelonnette']
dated_surface('Saboya', [v(1651, base('Saboya', 1650), 'Superficie alpina saboyana después de la cesión de Bresse en 1601.'), v(1713, savoy, 'Valle de Barcelonnette francés tras Utrecht.'), v(1792, [], 'Anexión a Francia; no gobierno efectivo de la casa de Saboya.')], 'Saboya alpina y condado de Nice: superficies documentadas, sin Bresse, Gex ni Bugey después de 1601.')
# Duchy and county of Burgundy remain separate. The county loses its Spanish
# government in the conquest cuts; Dijon is never returned to a titular duke.
burgundy = base('Borgoña', 1450)
replace('Borgoña', [v(1200, burgundy, 'Ducado capeto: extensión regional, no sólo Dijon y tres ciudades.'), v(1651, [], 'Ducado incorporado a Francia; los duques titulares no lo gobiernan.')], EARLIER['Borgoña']['sources'], 'Ducado de Borgoña centrado en Dijon, separado del condado y de los Países Bajos. Los señoríos de Nevers, Rethel y Auxerre mantienen sus propias jurisdicciones.')
county = base('Condado de Borgoña', 1500)
dated_surface('Condado de Borgoña', [v(1651, county, 'Condado español: superficie regional completa.'), v(1668, [], 'Conquista francesa; la restitución se refleja en el año siguiente.'), v(1669, county, 'Restitución de Aquisgrán.'), v(1674, [], 'Segunda conquista francesa; soberanía cedida en 1678.')], 'Franco Condado separado de la Borgoña ducal. La cesión jurídica de 1678 no retrasa hasta ese año la pérdida militar de 1674.')
layer('Morea veneciana · superficie regional', 1699, 1714, [v(1699, morea, 'Provincia veneciana reconocida por Karlowitz; recuperada por los otomanos en 1715.')], ['karlowitz', 'atam'], 'Superficie del Peloponeso, incluidos sus relieves; las seis ciudades de la primera revisión dejan de sustituir a toda la provincia.', '#AA806B', ['Morea veneciana (núcleos)'])


# Anatolia: explicit regional cell lists reviewed in the labelled geometry
# against ATAM Harita 1. The supplied HTML is a comparison, never a mask import.
def tdv(key, title, locator):
    SOURCES[key] = {'title': 'TDV İslâm Ansiklopedisi · ' + title, 'url': 'https://islamansiklopedisi.org.tr/' + key, 'locator': locator}
tdv('karesiogullari', 'Karesioğulları', 'Balıkesir, Bergama y Edremit: incorporación en 1345 o inmediatamente después; describe el territorio y sus costas.')
tdv('ankara', 'Ankara', 'Incorporación de 1354; inscripción de Murad I de 1362–1363. Se distingue la ciudad de toda la Anatolia central.')
tdv('saruhanogullari', 'Saruhanoğulları', 'Primer dominio de 1390, restitución tras Ankara y control consolidado en 1416; resistencias hasta 1426.')
tdv('aydinogullari', 'Aydınoğulları', 'Primera anexión de 1390, restitución de 1402 y caída definitiva de Cüneyd en 1425–1426.')
tdv('menteseogullari', 'Menteşeoğulları', 'Primera incorporación en 1390; restauración por Timur en 1402; dominio definitivo desde 1424.')
tdv('germiyanogullari', 'Germiyanoğulları', 'Cesiones matrimoniales desde 1381 y legado de Yakub II en 1429. La capa no adelanta todo el beylicato a la primera cesión.')
tdv('candarogullari', 'Candaroğulları', 'Sinop y Kastamonu: incorporación final de 1461. No se adelanta toda la costa a los períodos de sometimiento parcial.')
tdv('karamanogullari', 'Karamanoğulları', 'Konya conquistada en 1468; Niğde, Develi, montañas del Taurus y costas de İç İl sometidas en 1474.')
tdv('erzurum', 'Erzurum', 'TD 387 sitúa Erzurum dentro del dominio otomano en los registros de 1520–1530; la fecha de incorporación se estima en 1518–1519. La provincia se organiza en 1534. No se pinta Erzurum como otomana en 1481.')
bitinia1299 = ids('Bilecik Sogut Eynegol Domanic Inonu Sultanonu Bozan')
bitinia1337 = union(bitinia1299, ids('Bursa Iznik Izmit Akyazi Goynuk Mudurnu Adranos Mihalic Uskudar Atpazari Silli Akcasehir Konrapa'))
karasi = ids('Bandirma Gonen Manyas Balya Susurluk Dursunbey Balikesir Bigadic Soma Bergama Edremit Ayvacik Bayramic Can Canakkale Lapseki Biga')
ankara = ids('Ankara Cubuk Kalecik Beypazari Polatli Haymana Karakecili Mihaliccik Nalli')
saruhan = ids('Manisa Menemen Foca Akhisar Gordes Demirci Kula Alasehir')
aydin = ids('Cesme Urla Ayasuluk Tire Birgi Guzelhisar Nazilli Balat Cine')
# Spellings are checked against the actual SVG below; no geographic ID invented.
mentese = ids('Mugla Milas Bodrum Marmaris Gokabat Tavas Yuksekkum')
germiyan = ids('Kutahya Tavsanli Emet Simav Gediz Usak Banaz Seyitgazi Altintas Aslanapa Harmancik Sultan_Mountains_3')
hamid = ids('Burdur Isparta Egirdir Golhisar Stefani Dinar Uluborlu Sandikli Suhut Karahisar_I_Sahib Honaz Lazkiye Bolvadin Sivrihisar Kaymaz Emirdag Celtik Seyhli Yalvac Sarkikaraagac Sandikli_Mountains Erenler_Mountains Istanoz')
teke = ids('Antalya Elmali Finike Kas Megri West_Taurus_1 West_Taurus_4 Karahisar_I_Teke')
western1390 = union(saruhan, aydin, mentese, germiyan, hamid, teke)
western1429 = union(western1390, ['Smyrna'])
westernbase = union(bitinia1337, karasi, ankara)
layer('Anatolia otomana · Bitinia y expansión occidental', 1299, 1800, [v(1299, bitinia1299, 'Beylicato inicial: no toda Bitinia.'), v(1337, bitinia1337, 'Bursa, Nicea y Nicomedia: región bitinia revisada.'), v(1345, union(bitinia1337, karasi), 'Karesi incorporada: costa y espacios interiores.'), v(1354, westernbase, 'Ankara se incorpora; el corte no absorbe Karaman ni Candar.'), v(1390, union(westernbase, western1390), 'Primera incorporación de beylicatos occidentales.'), v(1402, union(bitinia1337, karasi), 'Ankara y restauración de los beylicatos; no mantener el mapa de Bayezid I.'), v(1416, union(westernbase, saruhan), 'Restablecimiento del dominio en Saruhan; regiones todavía en disputa se reservan.'), v(1426, union(westernbase, saruhan, aydin, mentese, hamid, teke), 'Aydin y Menteşe reincorporadas; Germiyan aún separado.'), v(1429, union(westernbase, western1429), 'Legado de Germiyan: superficie occidental, incluidos relieves y costas.')], ['atam', 'karesiogullari', 'ankara', 'saruhanogullari', 'aydinogullari', 'menteseogullari', 'germiyanogullari'], 'Superficies regionales de administración otomana directa. La derrota de 1402 rompe la continuidad: no se conservan los beylicatos recuperados por Timur. Los cortes de campañas son aproximaciones anuales y la serie de cesiones parciales de Hamid/Teke requiere más detalle.', '#8C8A4A')
candar = ids('Eregli Bartin Ulus Amasra Inebolu Devrekani Kastamonu Taskopru Boyabat Sinop Gerze Bafra Gerede Bolu Kibrus Kizilca Mengen Yenicepazari Safranbolu Arac Cerkes Kursunlu Cankiri Sabanozu Tosya Ilgaz_Mountains Koroglu_Mountains_1 Koroglu_Mountains_2')
pontus = ids('Trebizond Rize Surmene Gorele Giresun Bayramlu Unye Terme Samsun East_Pontus_Mountains_1 East_Pontus_Mountains_2 East_Pontus_Mountains_3')
layer('Anatolia otomana · Candar y costa póntica', 1461, 1800, [v(1461, union(candar, pontus), 'Candar y Trebisonda conquistados; se incorporan las superficies de costa y cordilleras.')], ['atam', 'candarogullari'], 'Franja póntica de soberanía directa. La fecha común de 1461 resume la unión regional final; algunas plazas occidentales eran otomanas antes. Erzurum, Oltu, Tortum, Ardahan y Georgia quedan fuera de esta conquista.', '#96934B')
karaman = ids('Konya Larende Cumra Karapinar Eregli_Kar Bor_Tur Nigde Aksaray Eskil Obruk Altinekin Ladik Ilgin Aksehir Beysehir Seydisehir Hatunsaray Pirloganda Manavgat Alaiye Ermenek Mut Anamur Selinti Silifke Corycus Middle_Taurus_1 Middle_Taurus_2 Middle_Taurus_3 West_Taurus_2 West_Taurus_3 West_Taurus_5 Sultan_Mountains_1 Sultan_Mountains_2 Melendiz_Mountains')
layer('Anatolia otomana · Karaman', 1468, 1800, [v(1468, ids('Konya Cumra Hatunsaray'), 'Conquista de Konya; no anticipa todo Taurus e İç İl.'), v(1474, karaman, 'Campaña final: interior, montañas y costas de İç İl.')], ['atam', 'karamanogullari'], 'Provincia regional de Karaman. Las resistencias locales posteriores se distinguen de la conquista de la jurisdicción, sin atribuirla al sultán por una mera vecindad.', '#96934B')
rum = ids('Amasya Corum Iskilip Gumus Merzifon Gadegara Ladik_Pontus West_Pontus_Mountains_1 Zile Niksar Tokat Koyulhisar Sivas Hafik Zara Sarkisla Sorgun Candir Divrigi Gemerek Bogazliyan Kayseri Urgup Nevsehir Kirsehir Hacibektas Huseyinabad Bozok Baliseyh Dinek_Keskin Aydincik Sulusaray Suluklu Turgut Kulu_Turkey Kochisar Insuyu Sariyahsi Deliktash Mesudiye Middle_Taurus_5 Middle_Taurus_6 Middle_Taurus_7 Middle_Taurus_4 Middle_Taurus_8 Ak_Mountains Akdagmadeni Akkus Sonisa Kose_Mountains_1 Bekarlar Dasmenda Develi Enguzud Gurun Hodul_Mountains Tomarza Yahyali')
eastern1515 = ids('Malatya Darende Elbistan Afsin Marash Ayntab Kilis Besni Samsat Kahta Siverek Diyarbekir Ergani Harput Palu Egil Heni Bingol Cermik East_Taurus_1 East_Taurus_2 East_Taurus_3 East_Taurus_4 East_Taurus_5 East_Taurus_6 Arapgir Arguvan Birecik Egin Gerger Karacadag Kaysun Urfa Suruc Sivrice Hasankeyf Hazro Kozluk Kulp Mayyafariqin Mardin Midyat Nusaybin Savur Cizre Siirt Mus Genc Sason')
erzurum = ids('Erzurum Erzincan Bayburt Kelkit Ispir Tercan Kemah Tekman Hinis Kuzucan Pertek West_Pontus_Mountains_2 East_Taurus_7 East_Taurus_8 Hasankale Mescit_Mountains Kose_Mountains_2 Mercan_Mountains_1 Mercan_Mountains_2 Otlukbeli_Mountains Gumushane Sebinkarahisar Siran Ilic Cemisgezek Keban East_Taurus_9 Adakli Varto')
cilicia = ids('Adana Tarsus Sis Molevon Caxud Comana_Cil Anavarza Candir_Cil Dluk Ayas Nur_Mountains_2 Iskenderun Antioch Arsuz Kars_Armenia Goksun Kapan')
layer('Anatolia otomana · provincias orientales', 1515, 1800, [v(1515, union(rum, eastern1515), 'Provincias interiores y orientales después de Çaldıran y la incorporación de Dulkadir.'), v(1516, union(rum, eastern1515, cilicia), 'Cilicia y costa de Alejandreta tras la campaña contra los mamelucos; Kars_Armenia es la celda cilicia, no la Kars del Cáucaso.'), v(1519, union(rum, eastern1515, cilicia, ['Erzurum']), 'Incorporación de Erzurum estimada por la fuente en 1518–1519; la provincia completa se activa en 1534.'), v(1534, union(rum, eastern1515, cilicia, erzurum), 'Provincia de Erzurum organizada: no se adelanta su superficie a 1481 ni a 1514.')], ['atam', 'erzurum'], 'Superficies provinciales revisadas, no toda Armenia, Georgia ni las incursiones orientales. Rum tenía antecedentes otomanos anteriores a 1515 cuya sucesión del interregno aún debe precisarse. Van y Kars se resuelven en series separadas. Las jurisdicciones hereditarias orientales no equivalen a administración provincial uniforme; no se importan las atribuciones de Yerevan del ejemplo.', '#91914D')
tdv('van', 'Van', 'Presencia temporal en 1534–1535; regreso safávida en 1536. Conquista de 1548; Ahlat y Erciş perdidos en 1552 y reconocidos otomanos por Amasya en 1555.')
tdv('kars', 'Kars', 'Incorporación cierta en 1537; cesión a Persia en 1565 y regreso antes de 1576; destrucción safávida de 1604 y reconstrucción otomana de 1616. Provincia propia desde 1580.')
van = ids('Van Ahlat Tatvan Ercis Bitlis Hizan Malazgirt Tutak Suphan_Mountains Hosap Baskale Catak Bargiri')
layer('Anatolia otomana · Van', 1534, 1800, [v(1534, ids('Van Ahlat Ercis'), 'Presencia temporal durante la campaña de Irakeyn.'), v(1536, [], 'Restablecimiento safávida: no prolongar una incursión hasta la conquista definitiva.'), v(1548, van, 'Provincia de Van después de la conquista de la plaza.'), v(1552, [x for x in van if x not in ['Ahlat', 'Ercis']], 'Ahlat y Erciş capturados por los safávidas; Van conserva su defensa.'), v(1555, van, 'Amasya reconoce Van y su entorno bajo soberanía otomana.')], ['atam', 'van'], 'Soberanía regional de frontera, con sancak de administración ordinaria y señoríos hereditarios de autonomía local. No equivale a gobierno directo uniforme. Vastan y Adilcevaz carecen de celda individual; no se inventan IDs ni se incorpora la Persia vecina.', '#91914D')
kars = ids('Kars Ardahan Oltu Tortum Kagizman Yalnizcam_Mountains Kars_Mountains_1 Kars_Mountains_2 Kars_Mountains_3')
kars_initial = ids('Kars Oltu')
layer('Anatolia otomana · frontera de Kars', 1537, 1800, [v(1537, kars_initial, 'Kars incorporada con certeza; Oltu ya en la frontera otomana; no se anticipa Tortum.'), v(1565, ids('Oltu'), 'Kars cedida a Persia: la jurisdicción de Erzurum no acredita posesión de la plaza.'), v(1576, kars_initial, 'Regreso de Kars antes de 1576; corte anual conservador.'), v(1578, kars, 'Superficie regional de la frontera nororiental; no Yerevan ni Surmali.'), v(1604, [x for x in kars if x != 'Kars'], 'La plaza de Kars tomada y destruida por Shah Abbas; no se extiende esa captura a cada celda vecina.'), v(1616, kars, 'Reconstrucción otomana de la plaza; frontera estabilizada en 1639.')], ['atam', 'kars'], 'Superficie de frontera diferenciada de conquistas temporales en Persia y Georgia. Las celdas de cordillera aproximan la provincia y no sus pasos exactos. La fecha de recuperación anterior a 1576 y los cambios locales después de 1604 requieren precisión inferior a un año.', '#91914D')
layer('Islas egeas otomanas', 1462, 1800, [v(1462, ids('Molyvos Mitilene'), 'Lesbos incorporada en 1462, no en 1362.'), v(1522, ids('Molyvos Mitilene Rodos'), 'Rodas conquistada.'), v(1566, ids('Molyvos Mitilene Rodos Chios'), 'Quíos incorporada.'), v(1669, union(ids('Molyvos Mitilene Rodos Chios'), creta), 'Candia conquistada; fortalezas venecianas supervivientes requieren división de celdas.')], ['atam'], 'Islas separadas de las conquistas continentales. Las celdas de Chania y Elounda no permiten aislar Souda y Spinalonga, venecianas hasta 1715: el color regional no acredita posesión otomana de esas fortalezas antes de esa fecha.', '#91914D')

# Independent corrections: prevent a broad legacy crosswalk from absorbing
# subordinate jurisdictions or neighbouring countries into the wrong layer.
for territory, cells, start, end, key, reason in [
    ('Granada', ['Gibraltar'], 1309, 1373, 'gibraltar', 'Castellana hasta 1332 y meriní desde 1333; el dominio nazarí comienza en 1374.'),
    ('Castilla', ['Algeciras'], 1400, 1461, 'algeciras', 'La ciudad vuelve al dominio nazarí en 1369; el título castellano no acredita su control. La frontera de la bahía queda vinculada a la conquista de Gibraltar de 1462.'),
    ('Granada', ['Algeciras'], 1344, 1368, 'algeciras', 'Plaza castellana desde 1344 hasta la recuperación nazarí de 1369.'),
    ('Condado de Barcelona', ['Andorra_la_Vella'], 1200, 1800, 'ign', 'Andorra es un coprincipado; la celda de Urgell no la convierte en dominio español.'),
    ('Bohemia', ['Opava', 'Krnov', 'Fryvaldov', 'Glubczyce', 'Hlucin'], 1335, 1800, 'silesia', 'Estas superficies se resuelven por la jurisdicción silesiana, con su partición de 1742, no por una Bohemia genérica.'),
    ('Bohemia', ['Klodzko'], 1742, 1800, 'opava', 'Glatz se cede a Prusia en 1742; no continúa como posesión efectiva habsbúrgica.'),
]:
    for cell in cells:
        OUT['overrides'].append({'territory': territory, 'id': cell, 'from': start, 'through': end, 'action': 'remove', 'source': SOURCES[key]['url'], 'reason': reason})

OUT['overrides'].append({'territory': 'Granada', 'id': 'Algeciras', 'from': 1369, 'through': 1461, 'action': 'add', 'source': SOURCES['algeciras']['url'], 'reason': 'Recuperación nazarí en 1369; el color representa soberanía del entorno y no una ciudad habitada tras su destrucción.'})

OUT['limitations'] = [
    'Las superficies regionales son aproximaciones de celdas SVG. Una fuente sobre soberanía no certifica cada segmento de frontera.',
    'Las particiones internas de Silesia no desaparecen: el color de la Corona representa soberanía superior, no propiedad ducal directa.',
    'Anatolia incorpora superficies occidentales, costa póntica, Karaman y provincias orientales. Van y Kars tienen series propias; el detalle de cada fortaleza y los beylicatos durante el interregno sigue pendiente; no se copian las máscaras del HTML adjunto.',
    'Los cortes de 1699 y 1718 resumen tratados; el detalle de los cambios militares de 1683–1698 sigue pendiente.',
]
(HERE / 'regional-extent-review.json').write_text(json.dumps(OUT, ensure_ascii=False, indent=2) + '\n')
print(f"{len(OUT['replacements'])} series regionales; {len(OUT['territories'])} capas; {len(OUT['overrides'])} exclusiones verificadas")
