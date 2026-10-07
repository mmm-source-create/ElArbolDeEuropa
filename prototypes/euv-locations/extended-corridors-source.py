"""Build independently reviewed cores outside the established 1400–1650 map.

Run from anywhere with Python 3. No network, timestamps or third-party modules.
City polygons remain approximations: this file does not reconstruct feudal borders.
"""
import json
from pathlib import Path
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
BASE = json.loads((HERE / 'corridor-locations.json').read_text())
CW = BASE['locationCrosswalk']['newIdsByOldId']
PATH_IDS = {p.get('id') for p in ET.parse(HERE / 'euv-locations-crop.svg').iter() if p.tag.endswith('path')}


def cities(*ids):
    return sorted(set(ids))


def regions(*ids):
    # Crosswalk supplies geometrical candidates only; each call below is a
    # deliberately selected, dated historical core, not a copy of a 1650 layer.
    return sorted({new for old in ids for new in CW[old]['ids']})


def join(*groups):
    return sorted(set().union(*map(set, groups)))


SOURCES = {
    'ign': ['IGN, Atlas Nacional de España: referencias históricas', 'https://www.ign.es/web/resources/docs/IGNCnig/ANE/Capitulos/06_Referenciashistoricas.pdf', 'Mapas de expansión peninsular y pactos de ocupación: 1230, 1243, 1244, 1246, 1258, 1297. La unidad SVG no equivale a la frontera dibujada en el atlas.'],
    'fernando': ['Catedral de Sevilla: San Fernando', 'https://www.catedraldesevilla.es/30-de-mayo-dia-de-san-fernando-patron-de-sevilla/', 'Unión dinástica 1230; Córdoba 1236, Jaén 1246, Sevilla 1248.'],
    'portugal': ['RTP Ensina: formación del reino de Portugal', 'https://ensina.rtp.pt/explicador/a-ascensao-de-d-afonso-henriques-e-a-transformacao-do-condado-em-reino-h26/', 'Final de la conquista del Algarve en 1249 y fijación fronteriza de Alcañices en 1297.'],
    'mallorca': ['MNAC: pinturas murales de la conquista de Mallorca', 'https://www.museunacional.cat/ca/colleccio/pintures-murals-de-la-conquesta-de-mallorca/mestre-de-la-conquesta-de-mallorca/071447-cjt', 'Conquista de Mallorca en 1229; núcleo insular sin anticipar Menorca.'],
    'aragon': ['Museu d’Història de Catalunya: hegemonía catalana en el Mediterráneo', 'https://www.mhcat.cat/exposicions/la_memoria_d_un_pais/la_mar_nostra/l_hegemonia_catalana_a_la_mediterrania', 'Jaime I y Valencia 1238; herencia de Jaime II de Mallorca, incluido Rosellón y Cerdaña.'],
    'pirineos': ['Museu d’Història de Catalunya: Tratado de los Pirineos', 'https://www.mhcat.cat/esmhc/exposiciones/la_memoria_de_un_pais/en_la_periferia_del_imperio/un_rincon_del_imperio/cronologia/tratado_de_los_pirineos', 'Cesión de Rosellón y parte de Cerdaña en 1659; no de toda Cerdaña.'],
    'catalunya': ['Generalitat de Catalunya: Diputació del General', 'https://web.gencat.cat/ca/generalitat/qui-som/historia-generalitat/diputacio-general', 'Recuperación real de Barcelona en 1652 y cesión septentrional en 1659. El año 1651 no se representa como control español pacífico.'],
    'puigcerda': ['Biblioteca de Puigcerdà: El tractat dels Pirineus', 'https://bibgirona.cat/biblioteca/puigcerda/biblio/1-el-tractat-dels-pirineus', 'Tratado y delimitación de la Cerdaña: Puigcerdà no se cede como dominio francés permanente.'],
    'navarra': ['Gobierno de Navarra: historia de Navarra', 'https://www.educacion.navarra.es/documents/713364/714655/histnav.pdf/924ba97d-b8b1-48cc-ba01-ce6b6002e793', 'Reino medieval y conquista de la Alta Navarra en 1512. Los núcleos seleccionados son únicamente de Alta Navarra.'],
    'granada': ['Universidad de Granada: cronología de la ciudad', 'https://www.ugr.es/universidad/historia/cronologia', 'Reino nazarí y conquista de Granada en 1492. No se mantiene una capa nazarí efectiva después de esa fecha.'],
    'utrecht': ['Archivo de la Corona de Aragón: Tratado de Utrecht', 'https://www.cultura.gob.es/archivos-aca/actividades/documentos-para-la-historia-de-europa/utrecht.html', 'Tratados 1713–1715: separación de Milán, Nápoles, Sicilia y los Países Bajos de la monarquía española; Gibraltar y Menorca.'],
    'gibraltar': ['Ministerio de Asuntos Exteriores: Gibraltar', 'https://exteriores.gob.es/es/PoliticaExterior/Paginas/Gibraltar.aspx', 'Ocupación británica de 1704 y cesión de la plaza en 1713. No se cede todo el entorno del Campo de Gibraltar.'],
    'menorca': ['Museo Militar de Menorca: Paz de Amiens', 'https://www.consorciomilitarmenorca.com/es/sala-dedicada-a-la-paz-de-amiens-en-el-museo-militar-de-menorca/', 'Dominación británica 1708–1756, 1763–1782 y 1798–1802; francesa 1756–1763; española 1782–1798.'],
    'menorca1782': ['Museo del Ejército: toma de Menorca', 'https://ejercito.defensa.gob.es/museo/HECHOS_HISTORICOS/HECHOS_HISTORICOS/02.05_FEBRERO._LA_TOMA_DE_MENORCA.html', 'Ocupación de 1708 y recuperación española en febrero de 1782.'],
    'babenberg': ['Ciudad de Wiener Neustadt: los Babenberg', 'https://www.wiener-neustadt.at/index.php/de/stadt/aktuelles-detail/neue-namen-fuer-zwei-plaetze', 'Fundación de Wiener Neustadt 1192–1194; gobierno de Leopoldo VI y extinción Babenberg en 1246.'],
    'austria1282': ['Die Welt der Habsburger: Das Erbe der Babenberger', 'https://www.habsburger.net/de/epochen/das-erbe-der-babenberger', 'Transición de los Babenberg y Otakar II a la investidura Habsburgo de Austria en 1282.'],
    'neuberg': ['Schönbrunn/Die Welt der Habsburger: territorial partitioning', 'https://www.habsburger.net/en/chapter/fraternal-strife-and-territorial-partitioning', 'Partición de Neuberg 1379: Austria danubiana separada de Estiria, Carintia, Carniola y Tirol; división leopoldina posterior en 1406.'],
    'tirol1363': ['Cancillería Federal de Austria: 1363', 'https://www.bundeskanzleramt.gv.at/bundeskanzleramt/besuchen-sie-uns/gang-der-geschichte/1363.html', 'Carintia 1335; cesión de Tirol por Margarita en 1363. No incluye los principados episcopales de Trento o Brixen.'],
    'tirol1665': ['Schönbrunn/Die Welt der Habsburger: Sigismund Franz', 'https://www.habsburger.net/de/personen/habsburger/sigismund-franz', 'Gobierno tirolés 1662–1665 y extinción de la rama: regreso a la línea principal Habsburgo. Se usa la versión alemana; la traducción inglesa de otra página contiene una errata 1655.'],
    'pragmatica': ['Cancillería Federal de Austria: 1713', 'https://www.bundeskanzleramt.gv.at/bundeskanzleramt/besuchen-sie-uns/gang-der-geschichte/1713.html', 'Indivisibilidad de los territorios hereditarios; no dominio personal de todos los estados del Sacro Imperio.'],
    'hofburg': ['Presidencia de Austria: historia de la Hofburg', 'https://www.bundespraesident.at/aktuelles/detail/die-geschichte-der-wiener-hofburg', 'Residencia y gobierno hereditario de Leopoldo I y María Teresa; continuidad del núcleo vienés.'],
    'bourgogne': ['Archives départementales de la Côte-d’Or: fondos conservados', 'https://archives.cotedor.fr/v2/site/AD21/les_archives_departementales/Fonds_conserves', 'Tesoro creado bajo Eudes III (1193–1218); el ducado pasa a dominio real francés en 1477 y continúa como provincia hasta la Revolución.'],
    'comte': ['Centre de musique baroque de Versailles: Doubs', 'https://philidor.cmbv.fr/Publications/Bases-prosopographiques/MUSEFREM-Base-de-donnees-prosopographique-des-musiciens-d-Eglise-en-1790/Doubs', 'Conquista francesa de 1674 y reunión legal de Franco Condado en 1678; ducado y condado son entidades distintas.'],
    'lille': ['Ciudad de Lille: historia de la ciudadela', 'https://parcdelacitadelle.lille.fr/en/vauban-heritage/heritage', 'Conquista de Lille en 1667, ratificada en Aix-la-Chapelle en 1668.'],
    'stomer': ['Bibliothèque d’agglomération de Saint-Omer: capitulación original', 'https://bibliotheque-numerique.bibliotheque-agglo-stomer.fr/notices/item/22154-capitulation-de-la-ville-de-saint-omer-22-avril-1677?offset=4', 'Documento original de capitulación de 22 abril 1677; final del dominio español en la ciudad.'],
    'luxembourg': ['Gobierno de Luxemburgo: 400 ans de souverains étrangers', 'https://luxembourg.public.lu/fr/societe-et-culture/histoire/400-ans-souverains-etrangers.html', 'Control francés 1684–1697; devolución a los Habsburgo; anexión francesa en 1795.'],
    'luxfort': ['Institut national pour le patrimoine architectural: Gibraltar du Nord', 'https://inpa.public.lu/fr/patrimoine/feodal_fortifie/forteresse_luxembourg/historique/gibraltar_nord.html', 'Fortaleza española 1555–1684, francesa 1684–1697, austríaca 1715–1795.'],
    'belgium1795': ['Archives de l’État en Belgique: fondo de la época francesa', 'https://agatha.arch.be/fr/data/ead/BE-A0510_000273_808060/', 'Anexión de las regiones belgas a la República francesa el 1 octubre 1795. Se distingue de la ocupación militar de 1794.'],
    'holland': ['Nationaal Archief: Wetgevende Colleges, 1796–1810', 'https://nationaalarchief.nl/onderzoeken/archief/2.01.01.01?page=1', 'República de las Provincias Unidas sustituida por la República Bátava en enero de 1795; las instituciones y autoridades se deben cambiar aunque el núcleo holandés continúe.'],
    'visconti': ['Archivio di Stato di Milano: Visconti', 'https://archiviodistatomilano.cultura.gov.it/fileadmin/risorse/Patrimonio_archivistico/Soggetti_produttori/Visconti__sec._XII_-_sec._XV_.pdf', 'Comuna medieval; Matteo y vicariato de 1294; exilio Visconti 1302–1310; expansión desde 1310; ducado desde 1395.'],
    'milan': ['Regione Lombardia: administración austríaca de Milán', 'https://lombardiabeniculturali.it/istituzioni/storia/?unita=03.06', 'Transferencia de dominios occidentales a Saboya y organización de la administración austríaca hasta mayo de 1796. Los núcleos occidentales litigiosos se excluyen de las versiones posteriores.'],
    'cisalpina': ['Archivio di Stato di Milano: Albinaggio', 'https://archiviodistatomilano.cultura.gov.it/fileadmin/risorse/Patrimonio_archivistico/Fondi_e_Inventari/Atti_di_Governo/Albinaggio_parte_antica_AG_5.pdf', 'Administración lombarda 1796–1797 y República Cisalpina 1797–1802; no prolongar el mandato efectivo del duque Habsburgo hasta 1800.'],
    'venice': ['Archivio di Stato di Venezia: 1600 anni', 'https://1600anni.archiviodistatovenezia.it/mostra-documentaria/introduzione-mostra.html', 'Comuna de Venecia inicialmente lagunar; final de la República en 1797. El núcleo 1200 no anticipa la futura Terraferma.'],
    'candia': ['Ministero della Cultura: Morosini, Candia y Morea', 'https://cultura.gov.it/comunicato/presentazione-alla-stampa-delle-celebrazioni-per-i-400-anni-dalla-nascita-di-francesco-morosini-e-della-mostra-francesco-morosini-in-guerra-a-candia-e-in-morea-al-via-dal-prossimo-12-luglio-presso-la-sede-della-gdf-a-venezia', 'Pérdida de Candia/Creta en 1669; conquista de Morea en la campaña 1684–1699 y pérdida en la guerra 1714–1718. En 1651 solo se conserva el núcleo de Candia, no toda Creta.'],
    'venice1797': ['Sistema Archivistico Nazionale: Dominazione francese', 'https://inventari-san.cultura.gov.it/inventari/533/ca/1093823', 'Municipalidades de 1797 y transferencia de Venecia a Austria en Campoformio; instalación austríaca enero de 1798.'],
    'florence': ['Archivio di Stato di Firenze: guía institucional', 'https://archiviodistatofirenze.cultura.gov.it/asfi/fileadmin/risorse/allegati_pubblicazioni_online/guida_on_line/guida_siasfi.pdf', 'República florentina desde el siglo XII hasta 1532; reformas del Popolo en 1250 y priorato de las artes 1282. No se extiende a Siena o Pisa en 1200.'],
    'toscana': ['Archivio di Stato di Firenze: primer período lorenés', 'https://archiviodistatofirenze.cultura.gov.it/asfi/index.php?id=225', 'Cambio dinástico en 1737; regencia por Francesco Stefano y gobierno de Pietro Leopoldo; separación de Toscana en favor de Ferdinando III en 1790.'],
    'toscana1799': ['Archivio di Stato di Firenze: Segreteria delle Finanze', 'https://archiviodistatofirenze.cultura.gov.it/inventari/s/segre_finanze/intro/introduzione.html', 'Ferdinando III sale el 25 marzo 1799; Senado, regencia y ocupación francesa se suceden hasta el triunvirato de noviembre de 1800. Precisión anual insuficiente para resolver los cambios internos.'],
    'sicilia': ['Assemblea Regionale Siciliana: historia del Palazzo dei Normanni', 'https://www.ars.sicilia.it/la-storia', 'Reino de Federico II y ruptura de las Vísperas Sicilianas de 1282. Antes de 1282, Sicilia incluye núcleos de la isla y del sur continental.'],
    'sicilia1713': ['Sistema Informativo Archivi di Stato: Viceregia di Sicilia', 'https://sias-archivi.cultura.gov.it/cgi-bin/pagina.pl?Chiave=978&TipoPag=profist', 'Sicilia española hasta 1713; Saboya 1713–1720; Habsburgo 1720–1734; Borbón desde 1734, con coronación 1735. Se conservan autoridades insulares separadas de Nápoles.'],
    'piemonte': ['Archivio di Stato di Torino: administración francesa', 'https://archiviodistatotorino.cultura.gov.it/fondi/?id=270090', 'Gobierno francés del territorio continental desde 1798; el soberano saboyano no controla efectivamente Turín en 1800.'],
    'piemonte1798': ['Archivio di Stato di Torino: historia de las instituciones', 'https://archiviodistatotorino.cultura.gov.it/wp-content/uploads/2025/02/Storia_delle_istituzioni_per_archivisti_piemontesi_Marco_Carassi.pdf', 'Ocupación continental y salida del rey diciembre de 1798; reconquista napoleónica en 1800. Se evita reproducir el nombre equivocado del rey en un párrafo de este estudio.'],
    'rome': ['Archivio di Stato di Roma: Tre volte Repubblica', 'https://archiviodistatoroma.cultura.gov.it/2026/05/08/mostra-tre-volte-repubblica-roma-1798-1849-1946-sala-alessandrina-13-maggio-3-giugno-2026/', 'República Romana 1798–1799; no se representa la ocupación republicana como gobierno pontificio efectivo.'],
}


def version(year, ids, keys, event):
    unknown = set(ids) - PATH_IDS
    if unknown:
        raise ValueError(f'Unknown SVG ids at {year}: {sorted(unknown)}')
    return {'from': year, 'ids': sorted(set(ids)), 'oldIds': [], 'borderline': [],
            'sourceKeys': keys, 'event': event}


LAYERS = []


def layer(corridor, name, entries, keys, note, coverage='núcleo conservador'):
    versions = [version(*e) for e in entries]
    if [v['from'] for v in versions] != sorted({v['from'] for v in versions}):
        raise ValueError(f'Duplicate or unordered version: {name}')
    LAYERS.append({'corridor': corridor, 'name': name,
                   'periods': [{'from': 1200, 'through': 1399}, {'from': 1651, 'through': 1800}],
                   'limitedCore': True, 'coverage': coverage, 'versions': versions,
                   'note': note,
                   'sources': [{'key': key, 'title': SOURCES[key][0], 'url': SOURCES[key][1], 'locator': SOURCES[key][2]} for key in keys]})


# Iberia: independently selected north/central cores; dated southern additions.
cast1200 = regions('Burgos', 'Palencia', 'Lerma', 'Soria', 'Valladolid', 'Avila', 'Segovia', 'Guadalajara', 'Cuenca', 'Toledo', 'Madrid')
cast1300 = join(cast1200, cities('Cordoba', 'Jaen', 'Sevilla', 'Murcia', 'Cartagena', 'Lorca'))
cast1651 = join(cast1300, cities('Cadiz', 'Huelva', 'Albacete', 'Granada', 'Malaga', 'Almeria', 'Gibraltar'))
cast1704 = [i for i in cast1651 if i != 'Gibraltar']
layer('Iberia', 'Castilla', [(1200,cast1200,['ign'],'Núcleo castellano anterior a las conquistas andaluzas.'),(1236,join(cast1200,cities('Cordoba')),['fernando'],'Córdoba.'),(1246,join(cast1200,cities('Cordoba','Jaen')),['fernando'],'Jaén.'),(1248,join(cast1200,cities('Cordoba','Jaen','Sevilla')),['fernando'],'Sevilla.'),(1266,cast1300,['ign'],'Núcleos murcianos después de la rebelión y conquista, sin proyectar el protectorado de 1243.'),(1300,cast1300,['ign'],'Revisión propia del núcleo en 1300.'),(1651,cast1651,['ign','granada'],'Núcleos peninsulares de la Corona después de Granada; Gibraltar aún español.'),(1700,cast1651,['utrecht'],'Anclaje anterior a la guerra de Sucesión.'),(1704,cast1704,['gibraltar'],'Ocupación británica de Gibraltar.'),(1713,cast1704,['utrecht','gibraltar'],'Cesión de la plaza; no de toda la comarca.'),(1800,cast1704,['gibraltar','menorca'],'Núcleo castellano revisado; Gibraltar excluido.')],['ign','fernando','granada','gibraltar','utrecht'], 'Se muestra el núcleo central y las ciudades de conquista comprobadas, no una frontera exhaustiva. León conserva su capa propia aunque haya un mismo rey. Las antiguas celdas se usaron como candidatos espaciales revisados; el puerto de Gibraltar es una aproximación indivisible.')
leon = regions('Coruna','Santiago','Lugo','Ourense','Astorga','Benavente','Leon','West_Asturias','East_Asturias','Zamora','Ciudad_Rodrigo','Salamanca')
leon1230 = join(leon, cities('Caceres','Merida','Badajoz'))
layer('Iberia','León',[(1200,leon,['ign'],'Reino separado de Castilla.'),(1229,join(leon,cities('Caceres')),['ign'],'Conquista de Cáceres.'),(1230,leon1230,['ign','fernando'],'Mérida y Badajoz; unión personal con Castilla.'),(1300,leon1230,['ign'],'Núcleo leonés bajo el mismo rey castellano.'),(1651,leon1230,['ign'],'Jurisdicción histórica leonesa, no nueva soberanía independiente.'),(1700,leon1230,['ign'],'Anclaje propio de los núcleos leoneses.'),(1800,leon1230,['ign'],'Jurisdicción histórica bajo la monarquía española.')],['ign','fernando'],'Se distingue una jurisdicción histórica de la independencia del soberano. El núcleo extremeño se incorpora solo después de la conquista.')
port = regions('Minho','Tras_Os_Montes','Beira_Alta','Beira_Litoral','Beira_Baixa','Ribatejo','Estremadura')
port1249 = join(port,cities('Evora','Beja','Faro','Silves','Tavira','Lagos'))
layer('Iberia','Portugal',[(1200,port,['ign','portugal'],'Núcleo septentrional y Lisboa; se excluye el Algarve.'),(1249,port1249,['portugal'],'Final de la conquista del Algarve.'),(1297,port1249,['ign','portugal'],'Alcañices; solo núcleos comprobados, no todos los enclaves fronterizos.'),(1300,port1249,['ign'],'Revisión de los núcleos en 1300.'),(1651,port1249,['portugal'],'Gobierno portugués restaurado, en guerra con España.'),(1700,port1249,['portugal'],'Portugal independiente: núcleos peninsulares.'),(1800,port1249,['portugal'],'No se anticipa la pérdida de Olivenza de 1801.')],['ign','portugal'],'Sin Algarve en 1200; sin Azores/Madeira anticipadas. Esta entrega conserva únicamente núcleos peninsulares, no un perímetro nacional ni enclaves litigiosos.')
aragon = cities('Zaragoza','Huesca','Teruel','Calatayud','Daroca','Jaca','Barbastro')
layer('Iberia','Aragón',[(1200,aragon,['ign'],'Núcleos aragoneses; no se incluyen futuros Valencia o Mallorca.'),(1300,aragon,['ign'],'Reino y jurisdicción separados de Valencia.'),(1651,aragon,['ign'],'Jurisdicción aragonesa en la monarquía compuesta.'),(1700,aragon,['ign'],'Núcleo anterior a la Nueva Planta.'),(1800,aragon,['ign'],'Referencia geográfica del reino histórico; los títulos no bastan para pintar otros dominios.')],['ign'],'Núcleos conservadores comprobados; no incluye el señorío de Albarracín en 1200 ni toda la Corona de Aragón.')
catalan = cities('Barcelona','Girona','Lleida','Tarragona','Tortosa','Cervera','Manresa','Vic','Puigcerda','Ripoll')
catalan1652 = join(catalan,cities('Perpignan','Prades','South_Eastern_Pyrenees'))
layer('Iberia','Condado de Barcelona',[(1200,catalan,['ign'],'Núcleos catalanes, sin proyectar señoríos de Urgel/Andorra.'),(1300,catalan,['aragon'],'Rosellón y territorios mallorquines septentrionales no se incorporan a este núcleo en 1300.'),(1651,[],['catalunya'],'Barcelona todavía bajo la autoridad francesa de la guerra dels Segadors: no pintar Felipe IV como dueño pacífico del núcleo completo.'),(1652,catalan1652,['catalunya'],'Recuperación de Barcelona; Rosellón aún no cedido por tratado.'),(1659,join(catalan,cities('South_Eastern_Pyrenees')),['pirineos','puigcerda'],'Se excluyen Perpignan y Prades; Puigcerdà se conserva.'),(1700,join(catalan,cities('South_Eastern_Pyrenees')),['pirineos','puigcerda'],'Anclaje propio de la frontera tras 1659.'),(1800,join(catalan,cities('South_Eastern_Pyrenees')),['pirineos','puigcerda'],'Puigcerdà continúa en el lado español; Andorra excluida.')],['ign','aragon','catalunya','pirineos','puigcerda'],'Núcleo limitado, no toda Cataluña. La celda South_Eastern_Pyrenees contiene terreno español comprobado en la revisión geométrica, pero su borde SVG no es un deslinde parcelario. La ocupación de 1651 exige un mandato francés de control temporal o una geometría más granular, no extender el soberano español automáticamente.')
valencia = cities('Valencia','Jativa','Alcoy','Gandia','Castellon_de_la_Plana','Morella')
valenciaLate = join(valencia,cities('Alicante','Orihuela','Elche','Denia'))
layer('Iberia','Valencia',[(1200,[],['aragon'],'No existe todavía el reino cristiano de Valencia.'),(1238,valencia,['aragon'],'Conquista de Valencia; selección de núcleos al norte de la frontera de Almizra.'),(1300,valencia,['ign'],'No se anticipa la incorporación de Alicante/Orihuela al reino valenciano.'),(1651,valenciaLate,['ign'],'Núcleos valencianos después de los deslindes medievales.'),(1700,valenciaLate,['ign'],'Revisión previa a la Nueva Planta.'),(1800,valenciaLate,['ign'],'Referencia geográfica histórica en la monarquía española.')],['aragon','ign'],'Los núcleos del sur no se asignan a Valencia en 1300; queda pendiente representar con detalle Torrellas/Elche 1304–1305.')
mallorca = cities('Palma','Pollensa','Manacor')
mallorca1300 = join(mallorca,cities('Ibiza','Ciudadela_de_Menorca'))
mallorca1708 = [i for i in mallorca1300 if i != 'Ciudadela_de_Menorca']
layer('Iberia','Mallorca',[(1200,[],['mallorca'],'No se anticipa el reino conquistado por Jaime I.'),(1229,mallorca,['mallorca'],'Conquista de Mallorca: solo la isla principal.'),(1300,mallorca1300,['aragon'],'Núcleos insulares del reino, sin sus condados continentales.'),(1651,mallorca1300,['menorca'],'Islas bajo gobierno español anterior a las dominaciones británicas.'),(1700,mallorca1300,['menorca'],'Menorca todavía española antes de 1708.'),(1708,mallorca1708,['menorca','menorca1782'],'Menorca queda fuera de la autoridad española efectiva.'),(1713,mallorca1708,['utrecht'],'Cesión formal de Menorca.'),(1782,mallorca1300,['menorca1782'],'Recuperación española de Menorca.'),(1798,mallorca1708,['menorca'],'Nueva dominación británica.'),(1800,mallorca1708,['menorca'],'Menorca sigue británica; no se anticipa Amiens 1802.')],['mallorca','aragon','utrecht','menorca','menorca1782'],'Solo núcleos insulares. No se dibuja el Rosellón mallorquín de 1276 como parte de toda Cataluña ni se pinta Menorca española en 1800.')
navarra = cities('Pamplona','Estella','Olite','Tudela','Sanguesa','Viana','Roncesvalles','Elizondo')
layer('Iberia','Navarra',[(1200,navarra,['navarra'],'Alta Navarra del reino independiente.'),(1300,navarra,['navarra'],'Alta Navarra bajo Juana I y Felipe IV jure uxoris.'),(1651,navarra,['navarra'],'Alta Navarra española; no incorpora Baja Navarra.'),(1700,navarra,['navarra'],'Alta Navarra, rama española.'),(1800,navarra,['navarra'],'Jurisdicción foral en la monarquía española.')],['navarra'],'Esta geometría no pinta Baja Navarra: debe requerir ámbito Alta Navarra para los mandatos posteriores a 1512.')
nasrid = cities('Granada','Malaga','Almeria','Guadix','Baza')
layer('Iberia','Granada',[(1200,[],['granada'],'No se anticipa la dinastía nazarí.'),(1238,cities('Granada'),['granada'],'Núcleo inicial de Granada; los otros núcleos no se dan por conquistados en ese año.'),(1246,nasrid,['ign'],'Núcleos de Granada tras el pacto de Jaén.'),(1300,nasrid,['ign'],'Reino nazarí tributario, no territorio de control directo de Castilla.'),(1651,[],['granada'],'El reino nazarí dejó de existir en 1492.'),(1700,[],['granada'],'Vacío explícito para la autoridad nazarí.'),(1800,[],['granada'],'Los antiguos núcleos aparecen en Castilla; no persiste la soberanía nazarí.')],['granada','ign'],'El vasallaje/tributo no transfiere el color territorial al rey de Castilla. Esta capa identifica la autoridad nazarí solamente.')

# Austria: Danubian duchy, divided lands and Tyrolean collateral line are distinct.
danube = cities('Vienna','Wiener_Neustadt','Krems','Melk','St_Polten','Linz','Wels')
layer('Austria','Austria',[(1200,danube,['babenberg'],'Núcleo danubiano Babenberg.'),(1246,danube,['babenberg','austria1282'],'Extinción dinástica: el núcleo no se convierte en vacío geográfico, pero necesita autoridad sucesoria.'),(1251,danube,['austria1282'],'Gobierno de Otakar II.'),(1282,danube,['austria1282'],'Investidura Habsburgo.'),(1300,danube,['austria1282'],'Austria bajo Alberto I y corregencia de Rodolfo III.'),(1379,danube,['neuberg'],'Rama albertina: se conserva Austria danubiana separada de Interior/Tirol.'),(1651,danube,['hofburg'],'Núcleo hereditario bajo Fernando III.'),(1700,danube,['hofburg','pragmatica'],'Austria hereditaria bajo Leopoldo I; no todo el Imperio.'),(1800,danube,['pragmatica','hofburg'],'Núcleo hereditario bajo Francisco II.')],['babenberg','austria1282','neuberg','hofburg','pragmatica'],'No representa todos los territorios de un emperador. La continuidad geométrica exige mandatos ducales/archiducales propios, no el cargo imperial.')
inner = cities('Graz','Judenburg','Klagenfurt','Ljubljana','Celje','Kranj')
innerLate = join(inner,cities('Trieste','Gorizia'))
layer('Austria','Austria Interior',[(1200,[],['neuberg'],'No anticipar la agrupación dinástica de 1379.'),(1300,[],['neuberg'],'Estiria, Carintia y Carniola requieren sus jurisdicciones medievales, no una Austria Interior prematura.'),(1379,inner,['neuberg'],'Agrupación leopoldina: núcleos de Estiria, Carintia y Carniola.'),(1651,innerLate,['neuberg','hofburg'],'Núcleos interiores y litoral bajo la rama imperial hereditaria.'),(1700,innerLate,['pragmatica'],'Anclaje propio del núcleo interior, separado del cargo imperial.'),(1800,innerLate,['pragmatica'],'Provincias hereditarias; no se anticipan adquisiciones episcopales de 1803.')],['neuberg','hofburg','pragmatica'],'Se conservan provincias bajo soberano común sin inventar un estado de Austria Interior en 1200. Trieste y Gorizia solo se usan en los anclajes tardíos comprobados; pendiente una secuencia propia de su adquisición medieval.')
tirol1300 = cities('Innsbruck','Merano','Silandro','Landeck','Imst')
tirolLate = join(tirol1300,cities('Lienz','Kufstein','Kitzbuhel'))
layer('Austria','Tirol',[(1200,[],['tirol1363'],'El núcleo temprano del condado no se certifica con una frontera del siglo XIV; vacío deliberado pendiente de revisar los condes anteriores a Meinhard.'),(1300,tirol1300,['tirol1363'],'Núcleo secular del condado anterior a la cesión Habsburgo.'),(1363,tirol1300,['tirol1363'],'Cesión de Margarita a los Habsburgo.'),(1651,tirolLate,['tirol1665'],'Rama tirolesa de Fernando Carlos; núcleos tardíos, no obispados vecinos.'),(1662,tirolLate,['tirol1665'],'Sigismund Franz sucede a Fernando Carlos.'),(1665,tirolLate,['tirol1665'],'Extinción de la rama y retorno a Leopoldo I.'),(1700,tirolLate,['tirol1665','pragmatica'],'Condado unido a la línea principal; conserva su jurisdicción.'),(1800,tirolLate,['pragmatica'],'Tirol secular antes de 1803/1805; Brixen, Trento y Salzburgo excluidos.')],['tirol1363','tirol1665','pragmatica'],'Núcleo secular. No se anticipa la incorporación de Brixen y Trento ni la cesión a Baviera en 1805. El vacío de 1200 es una limitación documental, no evidencia de tierra sin autoridad.')

# Burgundy and the Low Countries: no uniform northern/southern sovereignty.
duchy = cities('Dijon','Beaune','Autun','Chalon_Sur_Saone')
layer('Borgoña y Países Bajos','Borgoña',[(1200,duchy,['bourgogne'],'Núcleo del ducado capeto bajo Eudes III.'),(1300,duchy,['bourgogne'],'Ducado bajo Roberto II, separado del condado.'),(1651,[],['bourgogne'],'Ducado francés desde 1477: el título Habsburgo no pinta el ducado.'),(1700,[],['bourgogne'],'Vacío para la autoridad ducal Habsburgo.'),(1800,[],['bourgogne'],'No se confunde ducado histórico y dominio del rey de España.')],['bourgogne'],'Solo el ducado; los núcleos tardíos franceses se proponen para la capa de Francia, no para un titular borgoñón.')
comte = cities('Dole','Gray','Salins_les_Bains','Luxeuil','Pontarlier')
layer('Borgoña y Países Bajos','Condado de Borgoña',[(1200,cities('Dole','Salins_les_Bains'),['bourgogne'],'Núcleos del condado imperial, separado de Dijon; alcance limitado.'),(1300,comte,['bourgogne'],'Núcleos del condado palatino bajo Otón IV; no el ducado francés.'),(1651,comte,['comte'],'Franco Condado español: anclaje anterior a las conquistas francesas.'),(1668,[],['comte'],'Primera ocupación francesa; el detalle mensual requiere un control disputado.'),(1669,comte,['comte'],'Restitución tras Aix-la-Chapelle.'),(1674,[],['comte'],'Conquista francesa efectiva.'),(1678,[],['comte'],'Cesión ratificada en Nimega.'),(1700,[],['comte'],'Núcleos ya franceses; no pintar al titular español.'),(1800,[],['comte'],'Vacío explícito de la autoridad palatina española.')],['bourgogne','comte'],'Ducado y condado tienen historias distintas. El núcleo 1200/1300 queda limitado a las ciudades centrales; el año 1668 no se puede resolver como soberanía uniforme con precisión anual.')
flandersEarly = cities('Ghent','Bruges','Ypres')
flanders1651 = join(flandersEarly,cities('Lille','Douai'))
flanders1667 = [i for i in flanders1651 if i not in ['Lille','Douai']]
flanders1678 = [i for i in flanders1667 if i != 'Ypres']
layer('Borgoña y Países Bajos','Flandes',[(1200,flandersEarly,['bourgogne'],'Núcleos flamencos; no se equipara dependencia feudal con dominio directo del rey francés.'),(1300,flandersEarly,['bourgogne'],'Núcleo conservador; excluye Lille durante las campañas y ocupación de Felipe IV.'),(1651,flanders1651,['lille','utrecht'],'Núcleos del Flandes español, sin Zelanda/Flandes de los Estados.'),(1667,flanders1667,['lille'],'Lille y Douai ocupadas por Francia.'),(1678,flanders1678,['lille','utrecht'],'Núcleo flamenco meridional que continúa Habsburgo; Ypres excluida de la revisión tardía.'),(1700,flanders1678,['utrecht'],'Sur español; Holanda no se incluye.'),(1715,flanders1678,['utrecht','luxfort'],'Núcleo austríaco tras el arreglo de la sucesión.'),(1794,[],['belgium1795'],'Conquista francesa: no prolongar control Habsburgo.'),(1795,[],['belgium1795'],'Anexión a la República francesa.'),(1800,[],['belgium1795'],'Los núcleos antiguos deben enlazarse a Francia, no al conde titular.')],['lille','utrecht','luxfort','belgium1795'],'Núcleos meridionales revisados, sin un Países Bajos uniforme. La autoridad efectiva en 1300 necesita anotar la ocupación francesa del condado; el núcleo no certifica la frontera de cada campaña.')
brabant = cities('Brussels','Leuven','Antwerp')
layer('Borgoña y Países Bajos','Brabante',[(1200,cities('Brussels','Leuven'),['bourgogne'],'Núcleos ducales medievales; sin proyectar todas las adquisiciones posteriores.'),(1300,brabant,['bourgogne'],'Brabante medieval: núcleos urbanos.'),(1651,brabant,['utrecht'],'Brabante meridional; Breda/Den Bosch y Brabante de los Estados excluidos.'),(1700,brabant,['utrecht'],'Sur español, separado de las Provincias Unidas.'),(1715,brabant,['utrecht'],'Núcleos austríacos tras los tratados de sucesión.'),(1794,[],['belgium1795'],'Conquista francesa.'),(1795,[],['belgium1795'],'Anexión francesa.'),(1800,[],['belgium1795'],'No pintar al duque Habsburgo sin control efectivo.')],['utrecht','belgium1795'],'Solo el núcleo meridional; los mandatos españoles/austríacos deben exigir dicho ámbito. No representa todo el ducado medieval cuando está dividido.')
holland = cities('Amsterdam','The_Hague','Leiden','Dordrecht','Rotterdam')
layer('Borgoña y Países Bajos','Holanda',[(1200,cities('Leiden','Dordrecht'),['holland'],'Núcleos conservadores del condado; no toda la futura República.'),(1300,holland,['holland'],'Núcleos del condado bajo los Avesnes.'),(1651,holland,['holland'],'Autoridad de los Estados de Holanda, no el rey de España ni un estatúder como monarca absoluto.'),(1700,holland,['holland'],'Estados provinciales dentro de las Provincias Unidas.'),(1795,holland,['holland'],'Nuevo gobierno de la República Bátava; se conserva referencia regional.'),(1800,holland,['holland'],'Núcleo bátavo; requiere autoridad colectiva contemporánea y explicación de reorganización departamental.')],['holland'],'La continuidad de ciudades no implica continuidad de soberanos ni instituciones. Requiere cambiar el gobierno efectivo de los Estados a la República Bátava en 1795.')
layer('Borgoña y Países Bajos','Luxemburgo',[(1200,cities('Luxembourg'),['luxembourg'],'Núcleo del condado, no el perímetro moderno.'),(1300,cities('Luxembourg'),['luxembourg'],'Condado bajo Enrique VII.'),(1651,cities('Luxembourg'),['luxfort'],'Fortaleza bajo la monarquía española.'),(1684,[],['luxfort'],'Conquista francesa.'),(1697,cities('Luxembourg'),['luxembourg'],'Devolución a los Habsburgo españoles.'),(1700,cities('Luxembourg'),['luxfort'],'Núcleo español tras Ryswick.'),(1715,cities('Luxembourg'),['luxfort'],'Gobierno Habsburgo austríaco.'),(1795,[],['luxembourg'],'Anexión francesa tras capitulación de la fortaleza.'),(1800,[],['luxembourg'],'No prolongar el ducado efectivo Habsburgo.')],['luxembourg','luxfort'],'Una única celda de la ciudad y su entorno: no anticipa las particiones del siglo XIX.')
layer('Borgoña y Países Bajos','Artois',[(1200,[],['stomer'],'No se certifica como condado independiente antes de su creación.'),(1300,cities('Arras','Saint_Omer'),['stomer'],'Núcleos medievales del condado, no toda Flandes.'),(1651,cities('Saint_Omer'),['stomer'],'Artois reservado aún español; Arras ya queda excluida.'),(1659,cities('Saint_Omer'),['stomer'],'Saint-Omer no se convierte en francesa por una cesión uniforme de todo Artois.'),(1677,[],['stomer'],'Capitulación de Saint-Omer.'),(1700,[],['stomer'],'Núcleo ya francés.'),(1800,[],['stomer'],'El título del conde no pinta territorio perdido.')],['stomer'],'Núcleo limitado de Saint-Omer para resolver Artois reservado sin colorear todo el condado como español después de 1659.')
for name, cid in [('Namur','Namur'),('Henao','Mons')]:
    layer('Borgoña y Países Bajos',name,[(1200,cities(cid),['bourgogne'],'Núcleo condal medieval, con autoridad propia.'),(1300,cities(cid),['bourgogne'],'Núcleo del condado, no toda la futura unión borgoñona.'),(1651,cities(cid),['utrecht'],'Núcleo meridional español.'),(1700,cities(cid),['utrecht'],'Núcleo español antes de la transferencia dinástica.'),(1715,cities(cid),['utrecht'],'Núcleo bajo los Habsburgo austríacos.'),(1794,[],['belgium1795'],'Conquista francesa.'),(1795,[],['belgium1795'],'Anexión francesa.'),(1800,[],['belgium1795'],'Sin control Habsburgo efectivo.')],['utrecht','belgium1795'],'Únicamente núcleo urbano; requiere revisar las autoridades medievales del condado, no inferirlas del soberano borgoñón futuro.')

# Italy: early communal cores and the pre-1282 kingdom stay separate.
milanLate = cities('Milano','Monza','Como','Lodi','Pavia','Cremona','Novara','Alessandria')
milan1713 = [i for i in milanLate if i != 'Alessandria']
milan1738 = [i for i in milan1713 if i != 'Novara']
layer('Italia','Milán',[(1200,cities('Milano'),['visconti'],'Comuna de Milán: solo la celda de Milán, no el ducado futuro.'),(1300,cities('Milano'),['visconti'],'Vicariato Visconti; no se anticipa la expansión posterior a 1310.'),(1302,[],['visconti'],'Exilio de los Visconti: necesita autoridad comunal/Della Torre, no prolongar el mismo señor.'),(1310,cities('Milano'),['visconti'],'Restablecimiento del núcleo Visconti.'),(1395,cities('Milano'),['visconti'],'Ducado; núcleo limitado antes de la cobertura central ya existente.'),(1651,milanLate,['utrecht','milan'],'Ducado español con núcleos occidentales.'),(1700,milanLate,['utrecht','milan'],'Ducado español antes de la campaña austríaca.'),(1706,milanLate,['milan'],'Ocupación austríaca; la cesión legal posterior requiere distinguir ocupación/soberanía.'),(1713,milan1713,['utrecht','milan'],'Alessandria fuera del núcleo milanés revisado.'),(1738,milan1738,['milan'],'Novara fuera del núcleo milanés revisado.'),(1796,[],['cisalpina'],'Fin de la administración ducal efectiva; nueva administración lombarda.'),(1800,[],['cisalpina'],'Milán cisalpina: no prolongar el título Habsburgo.')],['visconti','utrecht','milan','cisalpina'],'Antes de 1395 es un núcleo comunal/señorial. Los mandatos y condiciones deben cambiar en 1302 y 1796; las nuevas autoridades se proponen aparte. No se pinta todo el futuro ducado en 1200.')
veniceLagoon = cities('Venice','Chioggia')
veniceMain = join(veniceLagoon,cities('Padova','Vicenza','Verona','Treviso','Udine','Belluno','Rovigo','Bergamo','Brescia'))
veniceAustria = [i for i in veniceMain if i not in ['Bergamo','Brescia']]
layer('Italia','Venecia',[(1200,veniceLagoon,['venice'],'Núcleo lagunar, sin Terraferma anticipada.'),(1300,join(veniceLagoon,cities('Candia')),['venice','candia'],'Núcleo lagunar y Candia; no toda la costa del Mediterráneo.'),(1651,join(veniceMain,cities('Candia')),['venice','candia'],'Terraferma y ciudad de Candia; no toda Creta durante la guerra.'),(1669,veniceMain,['candia'],'Pérdida de Candia.'),(1700,veniceMain,['venice','candia'],'Anclaje continental propio; Morea se mantiene como capa separada existente.'),(1797,[],['venice1797'],'Ruptura de la República; año de municipalidades y transferencia a Austria.'),(1798,veniceAustria,['venice1797'],'Provincia veneciana bajo Austria; Bergamo y Brescia cisalpinas excluidas.'),(1800,veniceAustria,['venice1797'],'Núcleos venecianos austríacos; no se anticipa la ocupación francesa de Verona de enero 1801.')],['venice','candia','venice1797'],'El dux no es dueño privado de la República. Los núcleos de 1798/1800 requieren un nuevo mandato territorial de Francisco II; sin ese enlace deben permanecer sin autoridad, nunca bajo un dogo fallecido.')
layer('Italia','Florencia',[(1200,cities('Florence'),['florence'],'Comuna/república florentina; núcleo independiente de Siena y Pisa.'),(1250,cities('Florence'),['florence'],'Reforma del Popolo.'),(1282,cities('Florence'),['florence'],'Priorato de las artes.'),(1300,cities('Florence'),['florence'],'República: no señorío del futuro gran duque.'),(1651,[],['toscana'],'Núcleo incluido en Toscana; sin duplicar autoridad florentina independiente.'),(1700,[],['toscana'],'Sin república independiente.'),(1800,[],['toscana1799'],'Núcleo toscano con gobiernos contemporáneos.')],['florence','toscana','toscana1799'],'Necesita una autoridad colectiva comunal en 1200/1300; no basta atribuir Florencia a un Medici futuro.')
tuscany = cities('Florence','Arezzo','Pisa','Siena','Livorno','Grosseto')
layer('Italia','Toscana',[(1200,[],['florence'],'No se anticipa el gran ducado de Toscana.'),(1300,[],['florence'],'Ciudades y comunas separadas; Florencia tiene su propia capa.'),(1651,tuscany,['toscana'],'Núcleos granducales mediceos; excluye Piombino y el Estado de los Presidios.'),(1700,tuscany,['toscana'],'Gran ducado bajo Cosme III.'),(1737,tuscany,['toscana'],'Cambio Medici → Lorena; mismos núcleos, nuevo mandato.'),(1790,tuscany,['toscana'],'Toscana pasa a Fernando III, separada del soberano austríaco.'),(1799,[],['toscana1799'],'Salida del gran duque y sucesión de controles durante el año.'),(1800,[],['toscana1799'],'Cambios de regencia, ocupación y triunvirato: no prolongar gobierno efectivo del gran duque.')],['florence','toscana','toscana1799'],'El vacío 1799/1800 evita resolver gobiernos que cambian dentro del año como un soberano efectivo uniforme. Una futura capa de ocupación debe describir el control de esos años, no declarar que no había autoridad.')
sicIsland = cities('Palermo','Messina','Catania','Syracuse','Girgenti','Noto','Modica')
naples = cities('Naples','Salerno','Bari','Taranto','Reggiocal','Catanzaro','Cosenza','Foggia','Aquila')
layer('Italia','Sicilia',[(1200,join(sicIsland,naples),['sicilia'],'Reino previo a las Vísperas: isla y sur continental bajo Federico II.'),(1282,[],['sicilia'],'División; las autoridades efectivas se registran en Nápoles y Trinacria.'),(1300,[],['sicilia'],'No pintar la isla a partir de una reclamación angevina al reino íntegro.'),(1651,[],['sicilia1713'],'Los gobiernos españoles separados usan Nápoles y Trinacria.'),(1700,[],['sicilia1713'],'Sin duplicar el reino anterior a 1282.'),(1800,[],['sicilia1713'],'Unión personal borbónica, sin anticipar el estado de las Dos Sicilias de 1816.')],['sicilia','sicilia1713'],'Sicilia 1200 integra continente e isla solo para un gobierno de dicho reino anterior a 1282. En 1300 los reyes rivales requieren ámbitos propios; no modificar fechas originales ni interpretar el mismo título como soberanía sobre ambos.')
layer('Italia','Nápoles',[(1200,[],['sicilia'],'No existe todavía el reino continental separado; véase Sicilia.'),(1282,naples,['sicilia'],'Separación continental tras las Vísperas.'),(1300,naples,['sicilia'],'Núcleos continentales angevinos: Carlos II.'),(1651,naples,['utrecht'],'Virreinato español; autoridad real y gobierno delegado deben distinguirse.'),(1700,naples,['utrecht'],'Núcleo español antes de la conquista austríaca.'),(1707,naples,['utrecht'],'Control austríaco continental.'),(1734,naples,['sicilia1713'],'Conquista borbónica: nuevo soberano, no extensión de la autoridad austríaca.'),(1799,[],['rome'],'Año de la República Partenopea y restauración: requiere una capa de control disputado con fuente propia.'),(1800,naples,['sicilia1713'],'Restauración borbónica continental; Fernando IV.')],['sicilia','utrecht','sicilia1713'],'Núcleos, no todas las baronías. En 1200 FED2HOH debe pintar Sicilia, no inventar un rey de Nápoles independiente. El vacío de 1799 declara límite anual y requiere documentar la República Partenopea antes de colorearla.')
layer('Italia','Trinacria',[(1200,[],['sicilia'],'La isla pertenece al reino íntegro de Sicilia, no a una corona separada.'),(1282,sicIsland,['sicilia'],'Autoridad aragonesa en la isla tras las Vísperas.'),(1300,sicIsland,['sicilia'],'Federico de Sicilia: autoridad insular, separada de Carlos II de Nápoles.'),(1651,sicIsland,['sicilia1713'],'Sicilia española insular.'),(1700,sicIsland,['sicilia1713'],'Núcleos insulares bajo Carlos II; sucesión española.'),(1713,sicIsland,['sicilia1713'],'Isla cedida a Víctor Amadeo II de Saboya.'),(1720,sicIsland,['sicilia1713'],'Intercambio con Cerdeña: Sicilia austríaca.'),(1734,sicIsland,['sicilia1713'],'Conquista borbónica; coronación insular 1735.'),(1800,sicIsland,['sicilia1713'],'Fernando III de Sicilia/Fernando IV de Nápoles, con gobiernos e instituciones distintos.')],['sicilia','sicilia1713'],'Se conserva el nombre de capa del Atlas para la jurisdicción insular. No se trasladan a Sicilia las fechas continentales de Nápoles.')
layer('Italia','Saboya',[(1200,cities('Aosta','Susa'),['piemonte1798'],'Núcleos alpinos del condado; no se anticipa la compra de Chambéry.'),(1232,cities('Aosta','Susa','Chambery'),['piemonte1798'],'Adquisición de Chambéry: fecha pendiente de fuente documental específica antes de ampliación regional.'),(1300,cities('Aosta','Susa','Chambery'),['piemonte1798'],'Núcleo alpino saboyano; no Piamonte íntegro.'),(1651,cities('Chambery'),['piemonte'],'Núcleo de Saboya propiamente dicha, separado del Piamonte.'),(1700,cities('Chambery'),['piemonte'],'Núcleo del ducado; el reino de Sicilia aún no ha sido concedido.'),(1792,[],['piemonte1798'],'Anexión francesa de Saboya; no prolongar control del duque exiliado.'),(1800,[],['piemonte'],'Sin gobierno saboyano efectivo en Chambéry.')],['piemonte','piemonte1798'],'Selección alpina mínima. Los datos de 1200/1232 y la cesión de 1792 necesitan confirmar las fuentes de adquisición territorial: no se certifica una frontera general con la historia archivística napoleónica.')
layer('Italia','Piamonte',[(1200,[],['piemonte'],'No se anticipa la autoridad saboyana sobre la comuna de Turín.'),(1300,[],['piemonte'],'Pendiente de documentar por separado el señorío de los Saboya-Acaya; no proyectar el futuro principado.'),(1651,cities('Turin','Aosta','Susa','Mondovi'),['piemonte'],'Núcleos saboyanos; Pinerolo francesa excluida.'),(1700,cities('Turin','Aosta','Susa','Mondovi','Pinerolo'),['piemonte'],'Núcleo después de la recuperación de Pinerolo; aún sin adquisiciones occidentales milanesas.'),(1713,cities('Turin','Aosta','Susa','Mondovi','Pinerolo','Alessandria'),['utrecht','milan'],'Alessandria cedida al soberano saboyano.'),(1738,cities('Turin','Aosta','Susa','Mondovi','Pinerolo','Alessandria','Novara'),['milan'],'Novara añadida; no permanece en Milán.'),(1798,[],['piemonte','piemonte1798'],'Control continental francés y salida de Carlos Manuel IV.'),(1800,[],['piemonte1798'],'Gobierno continental francés; la monarquía conserva Cerdeña, no Turín.')],['piemonte','piemonte1798','utrecht','milan'],'Núcleo continental tardío; los datos medievales requieren autoridades comunales o de la rama Acaya antes de pintar Turín. Los intervalos de ocupación francesa no se transforman en dominio saboyano por título.')
papalEarly = cities('Rome','Viterbo','Anagni')
papalLate = join(papalEarly,cities('Perugia','Ancona','Bologna','Ferrara','Urbino'))
layer('Italia','Estados Pontificios',[(1200,papalEarly,['rome'],'Núcleos patrimoniales de Inocencio III; el Papado no equivale a control de toda Italia.'),(1300,papalEarly,['rome'],'Núcleos papales, con autonomía urbana; no se anticipa la adquisición de Avignon.'),(1651,papalLate,['rome'],'Núcleos papales tardíos; requieren documentar cada incorporación de legaciones antes de ampliar la frontera.'),(1700,papalLate,['rome'],'Núcleo territorial separado de la autoridad espiritual.'),(1798,[],['rome'],'República Romana: Pío VI no gobierna efectivamente Roma.'),(1800,papalEarly,['rome'],'Restauración pontificia y nuevo pontificado; núcleo conservador, sin certificar cada legación durante las guerras.')],['rome'],'Núcleo limitado: la jurisdicción espiritual universal no pinta territorios. Los núcleos urbanos conservan autonomías y cambios de control que deben documentarse en sus mandatos.')


# Resolve the six documentary review blocks before any geometry is activated.
# These sources address the particular acquisition/administration, rather than
# using an unrelated late inventory to justify medieval possession.
SOURCES.update({
    'portugal1668': ['Arquivo Nacional da Torre do Tombo: tratado de paz de 1668', 'https://antt.dglab.gov.pt/exposicoes-virtuais-2/tratado-de-paz-de-1668-entre-portugal-e-espanha/', 'Tratado original, Manuscritos da Livraria 2542(7): restauración de 1640, reconocimiento español de independencia en 1668; devolución de plazas ocupadas salvo Ceuta.'],
    'chambery1232': ['Département de la Savoie: Moyen Âge', 'https://patrimoines.savoie.fr/web/psp_23012/moyen-age', '1232: compra de la ciudad de Chambéry por los condes de Saboya. No sirve como fecha de incorporación de todo Piamonte.'],
    'susa1046': ['Turismo Torino e Provincia / Comune di Susa: I Savoia a Susa', 'https://turismotorino.org/it/visita/eventi/i-savoia-a-susa-due-matrimoni-una-citta/', 'Matrimonio de Adelaide de Susa y Oddone de Saboya hacia 1046: vínculo territorial con Susa anterior a 1200. Núcleo, no toda la marca.'],
    'savoie1792': ['Université de Perpignan: decreto de reunión de Saboya, 27 noviembre 1792', 'https://mjp.univ-perp.fr/france/d1792savoie.htm', 'Texto primario de la Convención nacional: Saboya se incorpora a la República francesa y forma el departamento del Mont-Blanc.'],
    'trieste1382': ['Diocesi di Trieste: historia diocesana', 'https://www.diocesi.trieste.it/storia-della-diocesi-di-trieste/', 'Dedicación territorial a Austria acordada en Graz el 30 septiembre 1382. La subordinación territorial no elimina las instituciones de la ciudad.'],
    'gorizia1500': ['Regione Friuli Venezia Giulia: Archivio Storico Provinciale di Gorizia', 'https://archiviostoricogorizia.regione.fvg.it/', 'Documentación provincial desde el paso a los Habsburgo en 1500, reorganización bajo María Teresa en 1754 y autonomía provincial.'],
    'papalMedieval': ['Sandro Carocci / Università Tor Vergata: Vassalli del papa', 'https://art.torvergata.it/bitstream/2108/89191/1/PapalState%20bozza%202.pdf', 'Investigación con documentación pontificia original, capítulos sobre territorio, fidelidad bajo Inocencio III y Roma bajo Bonifacio VIII. Jurisdicción papal con autonomías y poderes comunales, no gobierno directo uniforme.'],
    'papalTuscia': ['Università di Siena: Istituzioni e governo del territorio nello Stato Pontificio', 'https://usiena-air.unisi.it/handle/11365/1064636', 'Investigación del Patrimonium en Tuscia y parlamento celebrado en Viterbo en 1207; sustenta el núcleo jurisdiccional, no la totalidad de Italia central.'],
    'bologna1506': ['Comune di Bologna: Giulio II e Bologna', 'https://nonocentenario.comune.bologna.it/giulio-ii-e-bologna/', 'Entrada de Julio II en Bologna el 11 noviembre 1506 y salida de los Bentivoglio. La autonomía municipal posterior se distingue de soberanía independiente.'],
    'ferrara1598': ['Ministero della Cultura / Archivio di Stato di Modena: devolución de Ferrara', 'https://cultura.gov.it/comunicato/la-cultura-non-si-ferma-l-addio-degli-estensi-a-ferrara-nei-preziosi-documenti-dell-archivio-di-stato-di-modena', 'Bula original de Clemente VIII y Convenzioni Faentine de 1598: transferencia de Ferrara a la Santa Sede; Modena continúa bajo los Este.'],
    'urbino1631': ['Archivio di Stato di Urbino: documentos del ducado', 'https://asurbino.cultura.gov.it/en/news-list/news-article?cHash=17aea118590c3d5267ad6073d2342d68&tx_news_pi1%5Baction%5D=detail&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Bnews%5D=46', 'Devolución del ducado de Urbino al Estado Pontificio en 1631 y transferencia del archivo.'],
    'ancona1532': ['SIAS / Archivio di Stato di Ancona: Governatore di Ancona', 'https://sias-archivi.cultura.gov.it/cgi-bin/pagina.pl?Chiave=66880&RicProgetto=as-ancona&TipoPag=prodente', 'Gobierno pontificio de Ancona 1532–1808: ciudad, suburbio y castillos. No se anticipa como dominio directo en 1200.'],
    'perugia1540': ['Sistema Archivistico Nazionale: Comune di Fratta', 'https://inventari-san.cultura.gov.it/inventari/244/sp/919', 'Guerra del sale de 1540, inicio de plena dominación pontificia sobre Perugia.'],
    'naples1799': ['Archivio di Stato di Salerno: La Repubblica Partenopea ed il Decennio Francese', 'https://archiviodistatosalerno.cultura.gov.it/fileadmin/risorse/pdf_pubblicazioni/dallarepubblicapartenopea.pdf', 'Proclamación republicana de 22 enero 1799, ocupación francesa de Napoli y reacción borbónica; el núcleo de la ciudad se marca como episodio disputado anual.'],
    'cisalpinaChronology': ['Regione Lombardia: La Repubblica cisalpina', 'https://lombardiabeniculturali.it/istituzioni/storia/?unita=04.02', 'Fechas explícitas 29 junio 1797–26 abril 1799 y 17 junio 1800–26 enero 1802; ocupación austríaca intermedia. Mantova no vuelve a Cisalpina hasta 1801, por eso se excluye en 1800.'],
    'piemonteControl': ['Archivio di Stato di Torino: administraciones militares', 'https://archiviodistatotorino.cultura.gov.it/fondi_groupby/?sel=tmi', 'Fondos independientes de la administración francesa (1798–1799;1800–1814) y de la comisión militar austro-rusa (1799–1800). No supone incorporación jurídica de Piamonte a Francia en 1800.'],
    'neubergSpecific': ['Schönbrunn/Die Welt der Habsburger: Leopold III, founder of the Leopoldine line', 'https://www.habsburger.net/en/chapter/leopold-iii-founder-leopoldine-line', 'Partición de 25 septiembre 1379: Estiria incluye Pitten y Wiener Neustadt. La autoridad interior no incorpora por ello el condado independiente de Celje, heredado en 1456.'],
    'artoisMedieval': ['Archives départementales du Pas-de-Calais: Trésor des chartes d’Artois', 'https://www.archivespasdecalais.fr/Chercher/Fonds-et-collections/Archives-anciennes/Serie-A', 'Fondos originales 1102–1468: creación del condado en 1237, Robert II 1250–1302 y Mahaut 1302–1329; núcleo del condado, no todo Flandes.'],
    'artoisCharters': ['Bibliothèque nationale de France: cartas de Saint-Omer', 'https://ccfr.bnf.fr/portailccfr/jsp/index_view_direct_anonymous.jsp?record=eadcgm%3AEADC%3Ab79404667', 'Ms. 873: cartas impresas de Saint Louis de junio 1237 y del conde Robert de Artois de mayo 1248 y marzo 1269; jurisdicción del conde sobre la ciudad, con privilegios municipales.'],
    'lux1244': ['Ville de Luxembourg: historia de la ciudad', 'https://www.vdl.lu/en/city/a-glance/history', 'Carta de la condesa Ermesinde otorgada a los habitantes en 1244; núcleo urbano, no el perímetro moderno de Luxemburgo.'],
    'lux1300': ['Gobierno de Luxemburgo: At the helm of the Holy Roman Empire', 'https://luxembourg.public.lu/en/society-and-culture/history/helm-holy-roman-empire.html', 'Los condes de Luxemburgo gobiernan su territorio al inicio del XIV; Henri VII elegido rey de Romanos en 1308. La jurisdicción condal no se deriva de su cargo imperial.'],
})

BY_NAME = {entry['name']:entry for entry in LAYERS}
DEFERRED = []

def attach_sources(entry, keys):
    present = {source['key'] for source in entry['sources']}
    entry['sources'] += [{'key':key,'title':SOURCES[key][0],'url':SOURCES[key][1],'locator':SOURCES[key][2]} for key in keys if key not in present]

# Medieval Low Countries: late annexation sources cannot verify medieval cores.
# Keep the unreviewed intervals explicitly empty rather than marking them reviewed.
for name in ['Condado de Borgoña','Flandes','Brabante','Namur','Henao','Holanda']:
    entry=BY_NAME[name]
    for v in entry['versions']:
        if v['from']<1400:
            v['ids']=[]
            v['event']='Núcleo medieval todavía sin delimitación territorial documentada para este mapa; no se activa con fuentes de anexiones posteriores.'
            v['sourceKeys']=[]
    entry['note'] += ' Las versiones anteriores a 1400 permanecen vacías por revisión documental pendiente; el vacío no afirma ausencia de gobierno.'
    DEFERRED.append({'layer':name,'from':1200,'through':1399,'issue':'Núcleos medievales retenidos hasta disponer de fuente territorial específica; no hay polígonos activados como revisados.'})

entry=BY_NAME['Portugal']; attach_sources(entry,['portugal1668'])
for v in entry['versions']:
    if v['from']>=1651: v['sourceKeys']=sorted(set(v['sourceKeys']+['portugal1668']))
entry['versions'].insert(next(i for i,v in enumerate(entry['versions']) if v['from']==1700),version(1668,port1249,['portugal1668'],'Reconocimiento español de la independencia portuguesa; sin Ceuta, que queda española.'))
entry['note']+=' El tratado de 1668 confirma restauración desde 1640 e independencia; la continuidad peninsular no elimina regencias o cambios de monarca.'

entry=BY_NAME['Saboya']; attach_sources(entry,['chambery1232','susa1046','savoie1792'])
for v in entry['versions']:
    if v['from']==1200: v.update(ids=cities('Susa'),sourceKeys=['susa1046'],event='Solo núcleo de Susa; Aosta se retiene hasta una fuente territorial medieval específica.')
    elif v['from']<1400: v.update(ids=cities('Susa','Chambery'),sourceKeys=['susa1046','chambery1232'],event='Núcleos de Susa y Chambéry después de la compra de 1232; sin atribuir todo Piamonte al conde.')
    elif v['from']>=1792: v['sourceKeys']=['savoie1792']
entry['note']='Núcleo alpino conservador de Susa; Chambéry se incorpora desde la compra documentada de 1232. Aosta medieval retenida. Saboya propiamente dicha deja de pintarse como dominio saboyano desde la reunión francesa de noviembre de 1792; Piamonte tiene su propia historia.'

entry=BY_NAME['Austria Interior']; attach_sources(entry,['trieste1382','gorizia1500'])
entry['versions'].insert(next(i for i,v in enumerate(entry['versions']) if v['from']==1651),version(1382,join(inner,cities('Trieste')),['neuberg','trieste1382'],'Dedicación de Trieste a Leopoldo III; Gorizia no se anticipa a 1500.'))
for v in entry['versions']:
    if v['from']>=1651: v['sourceKeys']+=['trieste1382','gorizia1500']
entry['note']='Núcleos de las provincias hereditarias interiores. La agrupación de 1379 no se anticipa a 1200: Estiria, Carintia y Carniola medievales requieren sus propias jurisdicciones. Trieste entra en 1382; Gorizia solo figura en los anclajes posteriores a su herencia Habsburgo de 1500. Las autonomías provinciales subsisten bajo un soberano común.'

# Neuberg includes Wiener Neustadt in Styria, while Celje stays independent
# until the extinction of its comital dynasty in 1456.
entry=BY_NAME['Austria Interior']; attach_sources(entry,['neubergSpecific'])
for v in entry['versions']:
    if 1379 <= v['from'] < 1400:
        v['ids']=join([i for i in v['ids'] if i!='Celje'],cities('Wiener_Neustadt'))
        v['sourceKeys']+=['neubergSpecific']
entry['note']+=' En 1379/1382 se incluye Wiener Neustadt en Estiria y se excluye Celje, todavía condado independiente.'
entry=BY_NAME['Austria']; attach_sources(entry,['neubergSpecific'])
for v in entry['versions']:
    if 1379 <= v['from'] < 1400:
        v['ids']=[i for i in v['ids'] if i!='Wiener_Neustadt']
        v['sourceKeys']+=['neubergSpecific']

entry=BY_NAME['Artois']; attach_sources(entry,['artoisMedieval','artoisCharters'])
for v in entry['versions']:
    if v['from']==1300:
        v['sourceKeys']=['artoisMedieval','artoisCharters']
entry['versions'].insert(1,version(1237,cities('Arras','Saint_Omer'),['artoisMedieval','artoisCharters'],'Condado creado en 1237; núcleo de Arras y Saint-Omer con cartas y privilegios propios.'))

entry=BY_NAME['Luxemburgo']; attach_sources(entry,['lux1244','lux1300'])
for v in entry['versions']:
    if v['from']==1200:
        v.update(ids=[],sourceKeys=[],event='Sin activación del núcleo de 1200: falta una fuente urbana territorial específica para este anclaje; no se infiere del gobierno extranjero posterior a 1443.')
    elif v['from']==1300:
        v['sourceKeys']=['lux1244','lux1300']
entry['versions'].insert(1,version(1244,cities('Luxembourg'),['lux1244'],'Carta urbana de Ermesinde de 1244; se activa únicamente el núcleo de la ciudad.'))
DEFERRED.append({'layer':'Luxemburgo','from':1200,'through':1243,'issue':'Anclaje urbano temprano retenido; activación propia desde la carta de 1244, sin proyectar fuentes tardías a 1200.'})

entry=BY_NAME['Estados Pontificios']; attach_sources(entry,['papalMedieval','papalTuscia','bologna1506','ferrara1598','urbino1631','ancona1532','perugia1540'])
for v in entry['versions']:
    if v['from']<1400:
        v['ids']=cities('Rome','Viterbo')
        v['sourceKeys']=['papalMedieval','papalTuscia']
        v['event']='Núcleo jurisdiccional pontificio de Roma y Tuscia, con gobiernos comunales y poderes locales: no dominio directo uniforme.'
    elif v['from']<1798:
        v['ids']=join(cities('Rome','Viterbo','Anagni'),cities('Bologna','Ferrara','Urbino','Ancona','Perugia'))
        v['sourceKeys']=['papalMedieval','bologna1506','ferrara1598','urbino1631','ancona1532','perugia1540']
    elif v['from']==1800:
        v['ids']=cities('Rome','Viterbo')
entry['versions'].insert(next(i for i,v in enumerate(entry['versions']) if v['from']==1798),version(1797,cities('Rome','Viterbo','Anagni','Urbino','Ancona','Perugia'),['cisalpinaChronology'],'Bologna y Ferrara fuera del núcleo papal tras incorporarse a la Cisalpina; no esperar a la República Romana de 1798.'))
entry['note']='Núcleo jurisdiccional, con autonomía comunal medieval y poderes señoriales documentados. Bologna, Ancona, Perugia, Ferrara y Urbino figuran en los anclajes tardíos después de sus incorporaciones respectivas; Ferrara y Bologna se retiran desde 1797. En 1800 solo se certifica el núcleo romano/tuscio restaurado, no todas las legaciones en guerra.'

entry=BY_NAME['Nápoles']; attach_sources(entry,['naples1799'])
for v in entry['versions']:
    if v['from']==1799: v['sourceKeys']=['naples1799'];v['event']='República de enero–junio y restauración borbónica durante el año: la autoridad anual no se modela como soberanía uniforme; episodio separado de control disputado en Napoli.'
entry['note']='Núcleos continentales separados de Sicilia. En 1799 la capa del reino queda vacía y Napoli se documenta en una capa de episodio republicano y restauración; no se prolonga Felipe/Fernando como soberano pacífico de toda la ciudad durante ese año.'

# Each independently dated extension is explicitly a limited core.
for entry in LAYERS:
    entry['precision']='documented_core'
    attach_sources(entry,sorted({key for v in entry['versions'] for key in v['sourceKeys']}))

# New jurisdictions have their own chronology, separate from any base-period layer.
TERRITORIES=[]
def territory(name,corridor,coverage,entries,keys,note,color,periods=None):
    start,end=coverage
    vs=[version(*e) for e in entries]
    item={'name':name,'corridor':corridor,'coverage':{'from':start,'through':end},'precision':'documented_core','limitedCore':True,'color':color,'versions':vs,'note':note,'sources':[{'key':k,'title':SOURCES[k][0],'url':SOURCES[k][1],'locator':SOURCES[k][2]} for k in keys]}
    if periods:item['periods']=[{'from':a,'through':b} for a,b in periods]
    TERRITORIES.append(item)
    return item

# Sicilia is not a base map layer: it belongs in new territories, not extensions.
sic_entry=BY_NAME['Sicilia']; LAYERS.remove(sic_entry)
territory('Sicilia','Italia',(1200,1281),[(1200,join(sicIsland,naples),['sicilia'],'Reino de Sicilia insular y continental anterior a las Vísperas de 1282.')],['sicilia'],'Núcleo previo a 1282 del reino de Sicilia, con continente e isla. No equivale al estado de las Dos Sicilias fundado en 1816. Los gobiernos posteriores usan Nápoles y Trinacria.','#8d5c27')

cis1797=cities('Milano','Monza','Como','Lodi','Pavia','Cremona','Bergamo','Brescia','Mantova','Modena','Reggioem','Bologna','Ferrara','Rimini')
cis1800=[i for i in cis1797 if i!='Mantova']
territory('Núcleos de la República Cisalpina','Italia',(1797,1800),[(1797,cis1797,['cisalpinaChronology'],'Núcleos incorporados a la República Cisalpina de 1797; no toda Italia septentrional.'),(1799,[],['cisalpinaChronology'],'Ocupación austro-rusa; no prolongar autoridad republicana.'),(1800,cis1800,['cisalpinaChronology'],'República reconstruida desde 17 junio: núcleo de fin de año; Mantova sigue ocupada y se excluye hasta 1801.')],['cisalpinaChronology'],'La Cisalpina es autoridad republicana, no un ducado de Milán. El año 1800 representa el núcleo tras la restauración de junio; la ocupación anterior permanece documentada en episodio separado. Mantova queda fuera.','#267c53',periods=[(1797,1798),(1800,1800)])
territory('Ocupación austro-rusa de Lombardía','Italia',(1799,1800),[(1799,cities('Milano','Como','Lodi','Pavia','Cremona','Bergamo','Brescia','Mantova'),['cisalpinaChronology'],'Ocupación austríaca de abril 1799 a mayo 1800; el marcador anual resume una parte del año.'),(1800,cities('Mantova'),['cisalpinaChronology'],'Mantova continúa bajo ocupación durante todo el año; resto retirado para la Cisalpina restaurada de junio.')],['cisalpinaChronology'],'Episodio de ocupación, no restitución del derecho ducal sobre todas las incorporaciones republicanas. En 1800 solo Mantova mantiene esta capa; la ficha explica la ocupación de Milano hasta mayo.','#8464ad')
piemFrench=cities('Turin','Aosta','Susa','Mondovi','Pinerolo','Alessandria','Novara')
territory('Administración francesa de Piamonte','Italia',(1798,1800),[(1798,piemFrench,['piemonte','piemonte1798','piemonteControl'],'Gobierno continental francés desde diciembre; monarca saboyano retira su control a Cerdeña.'),(1799,[],['piemonteControl'],'Ocupación militar austro-rusa y restitución formal, sin gobierno regio efectivo uniforme.'),(1800,piemFrench,['piemonte1798','piemonteControl'],'Administración francesa restablecida tras Marengo; núcleo de fin de año, sin anticipar anexión jurídica de 1802.')],['piemonte','piemonte1798','piemonteControl'],'Administración/ocupación continental dependiente de Francia; no se confunde con anexión de 1802 ni con control del rey de Cerdeña. 1798 y 1800 son cambios internos del año.','#3b72a2',periods=[(1798,1798),(1800,1800)])
territory('Episodio republicano de Nápoles','Italia',(1799,1799),[(1799,cities('Naples'),['naples1799'],'República de enero–junio de 1799 y restauración borbónica: control disputado a escala anual.')],['naples1799'],'Solo la celda de Napoli: gobierno republicano apoyado por Francia durante parte del año, seguido de restauración; no se interpreta como autoridad uniforme sobre toda la Italia meridional.','#a66a9c')
frBurg=duchy
fr1674=join(frBurg,comte,cities('Lille','Douai'))
fr1677=join(fr1674,cities('Saint_Omer'))
fr1697=fr1677
fr1795=join(fr1697,cities('Ghent','Bruges','Ypres','Brussels','Leuven','Antwerp','Namur','Mons','Luxembourg','Chambery'))
territory('Núcleos borgoñones y anexiones bajo Francia','Borgoña y Países Bajos',(1651,1800),[(1651,frBurg,['bourgogne'],'Ducado de Borgoña en la Corona francesa desde 1477, sin atribuirlo al rey español titular.'),(1667,join(frBurg,cities('Lille','Douai')),['lille'],'Conquista francesa de Lille y Douai.'),(1674,fr1674,['comte','lille'],'Conquista efectiva de Franco Condado, ratificada en 1678.'),(1677,fr1677,['stomer','comte'],'Saint-Omer pasa a dominio francés.'),(1684,join(fr1677,cities('Luxembourg')),['luxfort'],'Fortaleza de Luxemburgo ocupada por Francia.'),(1697,fr1697,['luxembourg'],'Luxemburgo devuelta; se retira hasta1795.'),(1700,fr1697,['bourgogne','comte','stomer'],'Núcleos franceses comprobados; no todo el perímetro de Francia.'),(1792,join(fr1697,cities('Chambery')),['savoie1792'],'Saboya incorporada en noviembre de1792.'),(1795,fr1795,['belgium1795','luxembourg','savoie1792'],'Anexión jurídica de Bélgica y Luxemburgo a la República francesa.'),(1800,fr1795,['belgium1795','luxembourg','savoie1792'],'Núcleos anexados bajo la República francesa; sin proyectar el Imperio napoleónico.')],['bourgogne','comte','lille','stomer','luxfort','luxembourg','belgium1795','savoie1792'],'Capa parcial de dominios franceses que resuelve las pérdidas de Borgoña/Franco Condado y anexiones meridionales. No es el mapa nacional completo de Francia. Los núcleos antiguos perdidos no se dejan bajo una autoridad titular española.','#295D8E')

RESULT = {'from':1200,'through':1800,'schemaVersion':1,
          'method':'Anclajes independientes y núcleos conservadores fuera de 1400–1650; las fechas originales de personas y catálogo no se modifican. Cada versión enumera rutas existentes del SVG EUV, nunca nombres inferidos de un vecino.',
          'integration':'Aplicar temporalExtensions únicamente para año < 1400 o año > 1650. Resolver la última versión desde <= año dentro de periods, incluso cuando ids es vacío. Dentro de 1400–1650 usar la geometría publicada y no estas extensiones. Un núcleo con geometría no genera por sí solo un mandato efectivo.',
          'limitations':['No son fronteras exhaustivas; se distinguen núcleos conservadores y pérdidas documentadas.',
                         'Una versión vacía puede significar pérdida, inexistencia de la entidad o revisión todavía incompleta; event y note distinguen la causa.',
                         'El selector anual no puede representar todos los cambios internos de 1668, 1797, 1799 y 1800. No se certifica soberanía uniforme por un título.',
                         'Las fuentes de historia administrativa tardía no bastan para certificar ciudades medievales: se señalan los intervalos vacíos pendientes en deferredReview.'],
          'temporalExtensions':LAYERS,
          'corrections':[],
          'scope':{'from':1200,'through':1800},
          'territories':TERRITORIES,
          'reviewRequired':[],
          'deferredReview':DEFERRED,
          'reviewResolutions':[
              {'issue':'Saboya','resolution':'Fuentes territoriales de Susa, compra Chambéry1232 y decreto1792; Aosta medieval retenida.'},
              {'issue':'Países Bajos medievales','resolution':'Seis núcleos medievales sin fuente específica quedan vacíos; revisión diferida explícita y sin activación.'},
              {'issue':'Estados Pontificios','resolution':'Investigación territorial medieval y fuentes específicas de Bologna1506, Ancona1532, Perugia1540, Ferrara1598 y Urbino1631; retiro cisalpino1797.'},
              {'issue':'Nápoles1799','resolution':'Fuente propia del Archivio di Stato di Salerno y episodio separado de control republicano/restauración.'},
              {'issue':'Austria Interior','resolution':'Neuberg1379 documenta la agrupación; Trieste1382 y Gorizia1500 con fuentes institucionales. No se activa agrupación prematura1200/1300.'},
              {'issue':'Portugal tardío','resolution':'Tratado original de1668 verifica restauración1640 y reconocimiento deindependencia; sin extenderPortugal aCeuta.'}
          ]}

(HERE/'extended-corridors-locations.json').write_text(json.dumps(RESULT,ensure_ascii=False,indent=2)+'\n')
print(f'Wrote {len(LAYERS)} temporal layers, {sum(len(l["versions"]) for l in LAYERS)} dated versions.')
