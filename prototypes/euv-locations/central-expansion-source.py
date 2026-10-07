"""Conservative, documented central-Europe and Pontic regional cores.

This generates only central-expansion-locations.json. Routes and biography
proposals live in work/research/central-integration.json and are not applied here.
SVG cells were rendered and inspected in four labelled regional plates.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

HLB = "https://www.historisches-lexikon-bayerns.de/Lexikon/"
S = {
    "bavaria": ("Historisches Lexikon Bayerns · Gerhard Immler", HLB + "Territorialentwicklung_in_Altbayern", "Divisiones de 1255, 1349, 1353 y 1392; localidades de cada rama; reparto de Straubing en 1429; herencia de Ingolstadt en 1445 y acuerdo de 1450; cesiones de 1505."),
    "divisions": ("Historisches Lexikon Bayerns · Julian Holzapfl", HLB + "Artikel_45122", "Bayerische Teilungen: Ingolstadt, Neuburg, Friedberg y Chiemgau/Kufstein/Kitzbühel en la rama de 1392; fin de la línea en 1447."),
    "straubing": ("Historisches Lexikon Bayerns · Dorit-Maria Krenn", HLB + "Straubinger_Erbfall,_1425-1429", "Muerte de Juan III en 1425; administración de los estamentos hasta el laudo de 1429; Straubing, Kelheim y Regen a Múnich."),
    "burghausen": ("Historisches Lexikon Bayerns · Burghausen, Burg", HLB + "Burghausen,_Burg", "Residencia de Baja Baviera desde 1255 y segunda residencia de Baviera-Landshut, 1392–1503."),
    "neuburg": ("Historisches Lexikon Bayerns · Markus Nadler", HLB + "Artikel_45318", "Pfalz-Neuburg (Territorium): fundación en 1505; Neuburg en el Danubio y Burglengenfeld en el Nordgau. Dillingen no equivale a las posesiones de Lauingen/Höchstädt."),
    "neuburgPolitics": ("Historisches Lexikon Bayerns · Pfalz-Neuburg (Politische Geschichte)", HLB + "Artikel_45317", "Corregencia de Otón Enrique y Felipe desde 1522; reparto de 1535–1541; ocupación imperial de 1546; restitución por la Paz de Passau en 1552; sucesión hasta Carlos Teodoro."),
    "philipp": ("Haus der Bayerischen Geschichte · tapices de Pfalz-Neuburg", "https://archiv.hdbg.de/bildteppiche/bildteppiche_teppiche_pfalz-neuburg_liste.php", "Residencia de Felipe en Burglengenfeld durante el reparto de 1535; residencia de Otón Enrique en Neuburg. Las ramas no reciben automáticamente ambas celdas."),
    "knin": ("Hrvatska enciklopedija · Knin", "https://www.enciklopedija.hr/clanak/knin", "Centro del reino croata y del ban; dominio del reino bosnio de 1388 a 1392; conquista otomana el 29 de mayo de 1522."),
    "bihac": ("Hrvatska enciklopedija · Bihać (grad)", "https://enciklopedija.hr/clanak/bihac-grad", "Privilegio de ciudad real de Bela IV en 1262; cesiones y empeños feudales de 1412–1527; dependencia de la Corona croata, sin equipararla con posesión directa del monarca."),
    "senj": ("Hrvatska enciklopedija · Senjska kapetanija", "https://enciklopedija.hr/clanak/senjska-kapetanija", "Matías Corvino recupera Senj de los Frankopan en 1469 y crea la capitanía real; integración posterior en la Frontera Militar en 1527."),
    "slavonia": ("Hrvatska enciklopedija · Slavonija", "https://www.enciklopedija.hr/clanak/slavonija", "Reino medieval de Eslavonia; en 1527 sus estamentos y los croatas eligieron reyes diferentes. No se extiende una elección automáticamente al otro reino."),
    "varazdin": ("Hrvatska enciklopedija · Varaždin", "https://www.enciklopedija.hr/clanak/varazdin", "Privilegio real de Andrés II en 1209; confirmaciones de Luis I y Segismundo. Ciudad, castillo y jurisdicciones señoriales no son idénticos."),
    "zagreb": ("Hrvatska enciklopedija · Zagreb", "https://www.enciklopedija.hr/clanak/zagreb", "Gradec recibe el privilegio de ciudad real de Bela IV en 1242; Kaptol conserva jurisdicción episcopal. La celda representa un entorno mixto bajo soberanía de la Corona."),
    "koprivnica": ("Ciudad de Koprivnica · transcripción del privilegio de 1356", "https://koprivnica.hr/koprivnica/dan-grada-koprivnice/", "Carta de Luis I de 4 de noviembre de 1356: ciudad libre real. La soberanía no elimina posteriores señoríos o empeños."),
    "johnHenry": ("Encyklopedie dějin města Brna · Juan Enrique", "https://encyklopedie.brna.cz/home-mmb/?acc=profil_osobnosti&load=1780", "Juan Enrique, margrave de Moravia, 1349–1375; residencia en Brno/Špilberk; reparto de propiedades entre sus tres hijos."),
    "jobst": ("Encyklopedie dějin města Brna · Jobst", "https://encyklopedie.brna.cz/home-mmb/?acc=profil_osobnosti&load=225", "Jobst, margrave, 1375–1411; Brno como residencia. Sus hermanos conservaban propiedades: no se representa toda Moravia como dominio exclusivo suyo."),
    "wenceslasMoravia": ("Archivo municipal de Brno · privilegio de 17 de febrero de 1411", "https://encyklopedie.brna.cz/home-mmb/?acc=profil-udalosti&load=419", "Wenceslao IV remite impuestos de Brno tras la muerte de Jobst; referencia al original del Archivo de Brno, colección de cartas y mandatos."),
    "albrechtMoravia": ("Instituto de Historia de la Academia Checa · Jiří-Joseph Veselý", "https://biography.hiu.cas.cz/wiki/ALBRECHT_II._Habsbursk%C3%BD_1397%E2%80%931439", "Biografický slovník českých zemí 1 (2004), pp. 55–56: Segismundo concede Moravia como feudo a Alberto en octubre de 1423; sometimiento en 1424; no se espera a su realeza bohemia de 1438."),
    "moravianKings": ("Archivo de Brno · Brno v minulosti a dnes 4", "https://archiv.brno.cz/documents/3815428/6181739/BMD04.pdf/ba164c4e-3c6b-40e6-0a0b-e758256e7fef?t=1693828117412", "Fiscalidad de las ciudades reales moravas: Brno, Znojmo, Jihlava y Olomouc; interregno 1439–1453; Ladislao asume el gobierno en Brno en el verano de 1453; Matías ejerce autoridad desde la guerra de 1468/1469; reunificación con Vladislao en 1490."),
    "olomoucCharter": ("Archivo municipal de Olomouc · carta original de Jobst", "https://archivy.olomouc.eu/archivy/detail-archivalie/19594", "Archivo del distrito de Olomouc, fondo Archivo de la ciudad, Cartas, inventario 37: permiso del margrave Jobst de 1378 para construir ayuntamiento y casa mercantil."),
    "olomoucKings": ("Municipio de Olomouc · historia de la ciudad", "https://tourism.olomouc.eu/historie/", "Privilegio de Jobst en 1378; fidelidad a Segismundo; elección de Corvino en 1469 y acuerdo de 1479; Federico del Palatinado en 1620; ocupación sueca 1642–1650 y prusiana 1741–1742; confirmación regia de María Teresa en 1762."),
    "olomoucCorvinus": ("Municipio de Olomouc · Matías Corvino", "https://tourism.olomouc.eu/osobnosti/matyas-korvin/", "Elección en Olomouc de 1469; acuerdo de 1478/1479: Vladislao gobierna Bohemia y Matías conserva Moravia, Silesia y Lusacia."),
    "olomoucJagiellon": ("Municipio de Olomouc · restauración de los escudos de la casa consistorial", "https://www.olomouc.eu/media/tiskove-zpravy/25811", "Escudos de Vladislao de poco después de 1490: Hungría, Bohemia, margraviato de Moravia y ducado de Silesia, separados del escudo municipal."),
    "olomoucOccupation": ("Municipio de Olomouc · historia de la fortaleza", "https://www.olomouc.eu/aktualni-informace/aktuality/6124", "Ocupación sueca de 1642–1650; declaración como fortaleza por Fernando III el 15 de septiembre de 1655; capitulación ante Prusia negociada el 27 de diciembre de 1741. La historia municipal fecha la ocupación en 1741–1742."),
    "rize": ("Gobernación de Rize · historia de la región", "https://www.rize.gov.tr/rizenin-tarihcesi", "Rize queda dentro del imperio de los Comnenos establecido en 1204; incorporación otomana en 1461. No se deduce de ello control de toda Lazica o de todos los macizos del Cáucaso."),
    "franz": ("Schönbrunn · Die Welt der Habsburger · Francisco II/I", "https://www.habsburger.net/de/personen/habsburger-herrscher/franz-iii", "Sucesión de 1792 y gobierno habsbúrgico hasta su muerte en 1835. La limitación del mapa a 1800 no recorta el mandato biográfico."),
    "frederickWilliamIII": ("Landtag de Brandeburgo · antiguo palacio de Potsdam", "https://www.landtag.brandenburg.de/de/altes_potsdamer_stadtschloss/27760", "Reinado de Federico Guillermo III: 1797–1840. La cronología del soberano se combina con la incorporación silesiana documentada de 1742."),
    "kufsteinOccupation": ("Archivo del Tirol · fuente 18: Kufstein 1504", "https://www.tirol.gv.at/kunst-kultur/landesarchiv/archiv-quelle/18/", "Maximiliano toma Kufstein el 17 de octubre de 1504 durante la guerra sucesoria. La ocupación de 1504 se distingue de las cesiones fijadas por el arbitraje de 1505."),
    "matthiasMoravia": ("Český sněm · edición de documentos parlamentarios de 1611", "https://public.psp.cz/eknih/snemy/v15a/1611/uvod01.htm", "Tratado de Libeň de 1608: Rodolfo cede Hungría, Austria y Moravia a Matías, mientras conserva Bohemia. La geografía morava no sigue la sucesión bohemia hasta 1611."),
    "ferdinandSuccessor": ("Archivo municipal de Brno · Zdeněk Šimeček", "https://archiv.brno.cz/documents/3815428/6181739/BMD23.pdf/3d7a7195-625d-e497-d3a8-cd05ab04ebc8?t=1775565870711", "Brno v minulosti a dnes23(2010), p.63: investigación de prensa de1617, noticia deBrno7septiembre y aceptación deFernando como margrave. La designación sucesoria se distingue de la administración efectiva que Matías conserva hasta1619."),
    "matthiasEnd": ("Museo del Dinero del Banco Nacional de Hungría · tálero original de Matías", "https://www.penzmuzeum.hu/fedezd-fel/gyujtemeny/bankjegy-es-ermegyujtemeny/ii-matyas-1608-1619-taller/", "Tálero de1610 con el título de margrave deMoravia; ficha institucional del reinado deMatías1608–1619. Se combina con el Tratado deLibeň para fijar la autoridad morava antes de la sucesión de1619."),
    "ferdinand": ("Instituto de Historia de la Academia Checa · Jaroslav Pánek", "https://biography.hiu.cas.cz/wiki/FERDINAND_I._1503%E2%80%931564", "Biografický slovník českých zemí 16 (2013), pp. 119–122: aceptación hereditaria separada de Moravia y Silesia en 1526; no son una mera proyección del título bohemio."),
    "trebizond": ("Ministerio turco de Cultura · historia de Trabzon", "https://trabzon.ktb.gov.tr/TR-212974/tarihcesi.html", "Fundación del imperio de los Comnenos en 1204; conquista y rendición a Mehmed II en 1461. La capa termina en 1460 por la escala anual."),
    "surmene": ("Ministerio turco de Cultura · Sürmene", "https://trabzon.ktb.gov.tr/TR-57625/surmene.html", "Sürmene dentro de la autoridad de los Comnenos de Trabzon entre 1204 y 1461. Se excluyen los entornos occidentales de control turcomano cambiante."),
    "wroclaw": ("Municipio de Wrocław · historia", "https://www.wroclaw.pl/dla-mieszkanca/historia-wroclawia-najwazniejsze-fakty", "Ducado de Wrocław incorporado a la Corona de Bohemia en 1335 tras la muerte de Enrique VI; Habsburgo en 1526; conquista prusiana en 1741."),
    "sroda": ("Powiat Średzki · historia institucional", "https://powiat-sredzki.pl/historia/", "Środa Śląska dentro del ducado real de Wrocław tras 1335; etapa habsbúrgica desde 1526 y cambio prusiano de 1742."),
    "georgeWroclaw": ("Universidad de Opole · Bogusław Czechowicz, investigación original", "https://repo.uni.opole.pl/info/book/UO837c49b0a5a647cbaf6138d9f7575bb7", "Idea i państwo, tomo 2: Wrocław rechaza la elección de Jorge en 1458; homenaje provisional en 1460, con plazo de tres años. Se conserva como control disputado, no autoridad uniforme."),
    "matthiasWroclaw": ("Archiwa Państwowe · carta real original de 1469", "https://www.szukajwarchiwach.gov.pl/jednostka/-/jednostka/36351512", "Matías Corvino confirma en 1469 los privilegios de Wrocław y Środa Śląska concedidos por Juan y Wenceslao. Autoridad regional efectiva pese a su título rival en Bohemia."),
    "glogow": ("Powiat Głogowski · historia institucional", "https://powiat.glogow.pl/powiat-glogowski-dawniej/", "Feudo de la Corona desde 1329–1331; territorio hereditario de la Corona de facto en 1488 y formalmente en 1508; Habsburgo en 1526; Prusia desde 1742. Se inicia en 1508 para excluir los gobiernos principescos jagellones anteriores."),
    "frederickBohemia": ("Portal gubernamental ZPE · impreso de homenaje de 1620", "https://zpe.gov.pl/kronika/756505", "Thomas Sagittarius, Porta pacis, 1620: entrada de Federico, rey de Bohemia, en Wrocław en febrero de 1620. Su reconocimiento no se sustituye por la pretensión rival de Fernando II."),
    "prussia": ("Geheimes Staatsarchiv Preußischer Kulturbesitz · documentos de homenaje de 1741", "https://archivdatenbank.gsta.spk-berlin.de/midosasearch-gsta/MidosaSEARCH/i_ha_gr_rep_46_b/xml/inhalt/GStA_i_ha_gr_rep_46_b_15_2.htm", "I. HA GR Rep. 46 B, Nr. 94–98: homenaje de Baja Silesia a Federico II en octubre y noviembre de 1741. Ocupación en 1741; cesión jurídica territorial en 1742."),
    "treaty": ("Municipio de Opava · historia de la ciudad", "https://www.opava-city.cz/cz/mesto-urad/o-meste/aktuality/vyznamne-udalosti.html", "Tratado de Wrocław de 11 de junio de 1742: división de Silesia entre Prusia y Austria. El río Opava separa jurisdicciones; no se atribuyen celdas enteras de Opava, Hlučín o Krnov al remanente austríaco."),
    "teschen": ("Archivo/municipio de Cieszyn · investigación de los duques de Teschen", "https://www.archiwum.cieszyn.pl/?iCategory=2473&p=categoriesShow", "Feudo de la Corona bohemia desde 1327; soberanía habsbúrgica desde 1526; Piastas hasta 1653. Ducado habsbúrgico 1653–1722; Lorena 1722–1765; José II 1765–1766; María Cristina y Alberto de Sajonia desde 1766. Permanece en el lado austríaco tras 1742."),
    "brzeg": ("Universidad Nicolás Copérnico · Atlas histórico de Brzeg", "https://atlasmiast.umk.pl/pliki/brzeg/AHMP_Brzeg_opis.pdf", "Atlas histórico de ciudades polacas: Jorge II gobierna Brzeg en 1547–1586; Joaquín Federico 1586–1602; Juan Cristián 1609–1639; administración imperial desde 1635. No equivale al dominio directo del rey sobre todos los ducados piastas."),
}


def source(key):
    title, url, locator = S[key]
    return {"title": title, "url": url, "locator": locator}


def layer(name, corridor, color, start, end, versions, keys, note, periods=None):
    result = {
        "corridor": corridor, "name": name, "color": color, "precision": "documented_core",
        "coverage": {"from": start, "through": end},
        "active": {"from": start, "through": end, "reason": note, "source": S[keys[0]][1]},
        "note": note,
        "versions": [{"from": year, "oldIds": [], "ids": ids, "borderline": []} for year, ids in versions],
        "sources": [source(key) for key in keys],
    }
    if periods:
        result["periods"] = [{"from": a, "through": b} for a, b in periods]
    if "(ocupación " in name.lower():
        result["authorityCondition"] = "control disputado"
    return result


IMPERIAL = "Borgoña e Imperio"
BALKANS = "Hungría y Balcanes"
T = []

# Earlier Bavarian divisions are separate small ducal cores, not the later
# kingdom's extent. Person routes must also respect the 1310–1313 partition.
T.append(layer("Baviera indivisa (núcleos)", IMPERIAL, "#B68B3E", 1200, 1391,
    [(1200, ["Munich", "Burghausen"]), (1204, ["Munich", "Landshut", "Burghausen"]),
     (1340, ["Munich", "Landshut", "Burghausen", "Ingolstadt"])], ["bavaria", "burghausen"],
    "Núcleos ducales de Múnich, Landshut y Burghausen, con Ingolstadt en las reunificaciones posteriores. Solo se activa antes del reparto de 1255, en 1340–1348 y en 1363–1391. Straubing permanece separado desde 1353; los obispados, ciudades imperiales y posesiones palatinas se excluyen. Son entornos regionales aproximados.",
    [(1200, 1254), (1340, 1348), (1363, 1391)]))
T.append(layer("Alta Baviera (Múnich)", IMPERIAL, "#BA9850", 1255, 1362,
    [(1255, ["Munich"])], ["bavaria"],
    "Celda del núcleo de Múnich en Alta Baviera. Se mantiene separada de Ingolstadt para poder documentar el reparto entre Rodolfo y Luis de 1310–1313. La autoridad de cada persona depende de su rama, no del título genérico de duque de Baviera.", [(1255, 1339), (1349, 1362)]))
T.append(layer("Alta Baviera (Ingolstadt)", IMPERIAL, "#AE843E", 1255, 1362,
    [(1255, ["Ingolstadt"])], ["bavaria"],
    "Núcleo de Ingolstadt en Alta Baviera, separado del de Múnich en el reparto de 1310–1313. La celda no representa todo el ducado ni incluye jurisdicciones episcopales.", [(1255, 1339), (1349, 1362)]))
T.append(layer("Baja Baviera (Landshut)", IMPERIAL, "#B17A3D", 1255, 1362,
    [(1255, ["Landshut"])], ["bavaria"],
    "Núcleo de la residencia de Landshut en Baja Baviera. Se separa de Burghausen para reflejar los repartos del primer tercio del siglo XIV. No se adjudica a Enrique XV, cuya rama principal se encontraba en Deggendorf.", [(1255, 1339), (1349, 1362)]))
T.append(layer("Baja Baviera (Burghausen)", IMPERIAL, "#B77F47", 1255, 1362,
    [(1255, ["Burghausen"])], ["bavaria", "burghausen"],
    "Núcleo de la residencia de Burghausen en Baja Baviera. En el reparto de 1310 corresponde a Otón IV; no se atribuye automáticamente a la rama de Landshut o a la de Deggendorf.", [(1255, 1339), (1349, 1362)]))
T.append(layer("Baviera-Múnich (núcleos)", IMPERIAL, "#A78647", 1392, 1504,
    [(1392, ["Munich", "Pfaffenhofen"]), (1429, ["Munich", "Pfaffenhofen", "Straubing", "Kelheim", "Bavaria_Regen"])],
    ["bavaria", "straubing"],
    "Múnich y Pfaffenhofen desde el reparto de 1392; Straubing, Kelheim y Regen se añaden tras el laudo de 1429. No se adjudican Landshut, Ingolstadt ni las sedes episcopales a esta rama. Sigismundo abandona el gobierno en 1467 y sus usufructos posteriores no autorizan colorear todo el núcleo."))
T.append(layer("Baviera-Landshut (núcleos)", IMPERIAL, "#BC874B", 1392, 1503,
    [(1392, ["Landshut", "Burghausen"]), (1429, ["Landshut", "Burghausen", "Landau"]),
     (1446, ["Landshut", "Burghausen", "Landau", "Ingolstadt", "Neuburg_an_der_Donau", "Friedberg", "Wasserburg", "Kufstein", "Kitzbuhel"])],
    ["bavaria", "divisions", "burghausen"],
    "Landshut y Burghausen; Landau tras el reparto de Straubing de 1429. Las celdas de Ingolstadt se añaden en 1446, primer año completo después de la toma de Enrique XVI de 1445, cuya sucesión se acuerda jurídicamente en 1450. La capa termina en 1503 antes de la guerra sucesoria; Kufstein y Kitzbühel no son Tirol hasta 1505."))
T.append(layer("Baviera-Ingolstadt (núcleos)", IMPERIAL, "#A47748", 1392, 1445,
    [(1392, ["Ingolstadt", "Neuburg_an_der_Donau", "Friedberg", "Wasserburg", "Kufstein", "Kitzbuhel"])],
    ["divisions", "bavaria"],
    "Núcleos de Ingolstadt, Neuburg y Friedberg y posesiones separadas del Inn/Chiemgau desde 1392. Se conservan hasta el año de la muerte de Luis VIII y la toma de Enrique XVI en 1445; el fallecimiento de Luis VII en 1447 no prolonga su gobierno efectivo. Se excluyen las tierras de Múnich y Landshut."))
T.append(layer("Baviera-Straubing (núcleos)", IMPERIAL, "#A8945A", 1353, 1425,
    [(1353, ["Straubing", "Kelheim", "Bavaria_Regen"])], ["bavaria", "straubing"],
    "Núcleos de Straubing, Kelheim y Regen de la rama Straubing-Holland, desde el reparto de 1353 hasta la muerte de Juan III en 1425. No se atribuyen a los otros duques durante la administración de los estamentos de 1426–1428; Múnich los recibe en 1429."))

T.append(layer("Palatinado-Neoburgo (Danubio)", IMPERIAL, "#AE6F65", 1505, 1800,
    [(1505, ["Neuburg_an_der_Donau"])], ["neuburg", "neuburgPolitics", "philipp"],
    "Núcleo de Neuburg an der Donau del principado creado en 1505. En el reparto de 1535–1541 corresponde a Otón Enrique. Se interrumpe la autoridad de los príncipes entre la ocupación imperial de 1546 y la restitución de 1552. Lauingen/Höchstädt carecen de celdas propias: no se incorpora por ello toda la celda episcopal de Dillingen.", [(1505, 1545), (1552, 1800)]))
T.append(layer("Palatinado-Neoburgo (Burglengenfeld)", IMPERIAL, "#A87868", 1505, 1800,
    [(1505, ["Burglengenfeld"])], ["neuburg", "neuburgPolitics", "philipp"],
    "Núcleo de Burglengenfeld, principal oficina del Nordgau de Pfalz-Neuburg desde 1505. En el reparto de 1535–1541 corresponde a Felipe. No pertenece al electorado palatino ni se transfiere a Baviera por la cesión del Alto Palatinado de 1628. Interrupción de la autoridad principesca durante la ocupación imperial de 1546–1551.", [(1505, 1545), (1552, 1800)]))
T.append(layer("Neoburgo (ocupación imperial)", IMPERIAL, "#927BA3", 1546, 1551,
    [(1546, ["Neuburg_an_der_Donau", "Burglengenfeld"])], ["neuburgPolitics"],
    "Ocupación imperial tras la Guerra de Esmalcalda: Otón Enrique se exilia en 1546 y recupera su principado por la Paz de Passau en 1552. Debe mostrarse como ocupación de Carlos V, no como gobierno territorial permanente ni como autoridad efectiva de los príncipes exiliados."))

T.append(layer("Croacia anterior a 1527 (Knin)", BALKANS, "#A17153", 1200, 1521,
    [(1200, ["Knin"])], ["knin"],
    "Núcleo interior de Knin del reino croata, con señoríos y administración del ban bajo el monarca de la Corona húngaro-croata. Se retira durante el dominio bosnio de 1388–1392 y desde la conquista otomana de mayo de 1522. No incluye las ciudades costeras de Venecia ni convierte soberanía en propiedad directa.", [(1200, 1387), (1393, 1521)]))
T.append(layer("Croacia anterior a 1527 (Bihać)", BALKANS, "#A78359", 1262, 1526,
    [(1262, ["Bihac"])], ["bihac"],
    "Entorno de la ciudad real de Bihać desde el privilegio de Bela IV de 1262. Los empeños y señoríos de Hrvoje y los Frankopan se reconocen documentalmente y no borran la soberanía de la Corona croata. La capa termina antes de la elección de Fernando en 1527 y deja la etapa habsbúrgica a su capa existente."))
T.append(layer("Croacia anterior a 1527 (Senj)", BALKANS, "#A37B4E", 1469, 1526,
    [(1469, ["Senj"])], ["senj"],
    "Núcleo de la capitanía real de Senj recuperado por Matías Corvino de los Frankopan en 1469. No se asignan Rijeka, las islas o las plazas venecianas de Dalmacia. La celda regional contiene el entorno de Senj y no reconstruye cada jurisdicción local."))
T.append(layer("Eslavonia anterior a 1527 (núcleos)", BALKANS, "#A69454", 1209, 1526,
    [(1209, ["Varazdin"]), (1242, ["Varazdin", "Zagreb"]), (1356, ["Varazdin", "Zagreb", "Koprivnica"])],
    ["slavonia", "varazdin", "zagreb", "koprivnica"],
    "Núcleos de ciudades reales de Eslavonia: Varaždin desde 1209, Gradec/Zagreb desde 1242 y Koprivnica desde 1356. La soberanía de la Corona se distingue de jurisdicciones episcopales, castillos, señoríos y empeños dentro de estas celdas. Eslavonia y Croacia eligen reyes distintos en 1527; la capa no extrapola la elección croata al conjunto eslavón."))

T.append(layer("Moravia (núcleo de Brno)", IMPERIAL, "#8C8052", 1349, 1800,
    [(1349, ["Brno"])], ["johnHenry", "jobst", "wenceslasMoravia", "albrechtMoravia", "moravianKings", "matthiasMoravia", "ferdinand"],
    "Núcleo urbano y residencial de Brno, sin convertir el título del margrave en propiedad de toda Moravia. Juan Enrique y Jobst tienen mandatos propios; Alberto recibe Moravia en 1423; Matías Corvino ejerce autoridad regional desde 1469 y Vladislao desde 1490. La sucesión morava pasa de Rodolfo a Matías en 1608, tres años antes que Bohemia. No se atribuye autoridad personal durante el interregno de 1440–1452.", [(1349, 1439), (1453, 1800)]))

T.append(layer("Moravia (núcleo de Olomouc)", IMPERIAL, "#92875A", 1378, 1800,
    [(1378, ["Olomouc"])], ["olomoucCharter", "olomoucKings", "olomoucCorvinus", "olomoucJagiellon", "matthiasMoravia", "olomoucOccupation"],
    "Entorno de la ciudad real de Olomouc desde el privilegio original de Jobst de 1378. La autoridad regional del margrave no convierte la celda en propiedad exclusiva ni borra la jurisdicción episcopal. Se distingue de la realeza bohemia bajo Corvino y en 1608–1611. Las ocupaciones sueca de 1642–1650 y prusiana de 1741–1742 tienen capas propias; la escala anual incluye el año de capitulación de diciembre de 1741. El interregno de 1440–1452 queda fuera.", [(1378, 1439), (1453, 1641), (1651, 1740), (1743, 1800)]))
T.append(layer("Olomouc (ocupación sueca)", IMPERIAL, "#927BA3", 1642, 1650,
    [(1642, ["Olomouc"])], ["olomoucKings", "olomoucOccupation"],
    "Ocupación militar sueca de Olomouc desde su toma en 1642 hasta la retirada después del pago de la indemnización en 1650. No es una anexión de Moravia al reino sueco ni un título de margrave de Cristina."))
T.append(layer("Olomouc (ocupación prusiana)", IMPERIAL, "#927BA3", 1741, 1742,
    [(1741, ["Olomouc"])], ["olomoucOccupation", "olomoucKings"],
    "Ocupación prusiana de Olomouc: capitulación del 27 de diciembre de 1741 y evacuación en 1742 según la historia municipal. No se confunde con la cesión permanente de los núcleos de Baja Silesia a Prusia en 1742 ni se extiende a toda Moravia."))

T.append(layer("Trebisonda (núcleo de Trabzon, Sürmene y Rize)", BALKANS, "#78885B", 1204, 1460,
    [(1204, ["Trebizond", "Surmene", "Rize"])], ["trebizond", "surmene", "rize"],
    "Núcleo oriental de la costa póntica bajo los Comnenos de Trebisonda: Trabzon, Sürmene y Rize, con cronología regional documentada. Se excluyen Giresun/Ordu, de control turcomano cambiante, y los macizos o entornos lazios cuyo control no se ha delimitado. Termina en 1460: la conquista otomana de 1461 se resuelve con la cronología otomana y no con un imperio prolongado hasta 1800."))

T.append(layer("Silesia real (Wrocław y Środa)", IMPERIAL, "#8C6996", 1335, 1740,
    [(1335, ["Wroclaw", "Sroda_Slaska"])], ["wroclaw", "sroda", "georgeWroclaw", "matthiasWroclaw", "ferdinand", "frederickBohemia"],
    "Núcleo del ducado real de Wrocław, incorporado a la Corona bohemia en 1335. No incluye automáticamente los ducados de los Piastas ni Nysa episcopal. El rechazo local de Jorge de Poděbrady y el homenaje provisional de 1460 se documentan como disputa; Matías Corvino recibe autoridad regional en 1469. Federico del Palatinado es reconocido en Wrocław en 1620. La capa termina antes de la conquista prusiana de 1741.", [(1335, 1439), (1453, 1457), (1460, 1463), (1469, 1740)]))
T.append(layer("Silesia real (Głogów)", IMPERIAL, "#92759A", 1508, 1740,
    [(1508, ["Glogow"])], ["glogow", "ferdinand"],
    "Núcleo de Głogów desde su incorporación formal al patrimonio hereditario de la Corona en 1508. Los gobiernos principescos jagellones y la transición de 1488–1508 quedan fuera. No se asimila a todos los ducados silesianos; la soberanía bohemia y después habsbúrgica termina antes de la ocupación prusiana de 1741."))
T.append(layer("Silesia (ocupación prusiana de 1741)", IMPERIAL, "#927BA3", 1741, 1741,
    [(1741, ["Wroclaw", "Sroda_Slaska", "Glogow"])], ["prussia", "wroclaw", "glogow"],
    "Núcleos ocupados por Federico II en la campaña de 1741. Se representan como ocupación: los homenajes de octubre/noviembre de 1741 preceden a la cesión pactada en 1742. La escala anual no reconstruye movimientos diarios ni equipara ocupación y soberanía reconocida."))
T.append(layer("Silesia prusiana (núcleos)", IMPERIAL, "#65778A", 1742, 1800,
    [(1742, ["Wroclaw", "Sroda_Slaska", "Glogow"])], ["treaty", "prussia", "glogow"],
    "Núcleos de Wrocław, Środa Śląska y Głogów bajo soberanía prusiana desde el tratado de 1742. No se afirma que estos tres entornos agoten toda la Silesia prusiana. Teschen queda en el remanente de la Corona habsbúrgica y no se colorea como prusiano."))
T.append(layer("Silesia austríaca (núcleo de Teschen)", IMPERIAL, "#9A7780", 1742, 1800,
    [(1742, ["Tesin"])], ["teschen", "treaty"],
    "Núcleo de Teschen/Cieszyn en la Silesia que permanece bajo soberanía de la Corona habsbúrgica tras 1742. Los duques de Lorena y después Sajonia-Teschen ejercen el señorío delegado del feudo; María Teresa no se convierte por ello en duquesa propietaria. Opava, Hlučín y Krnov se omiten porque la nueva frontera fluvial divide sus entornos regionales."))
T.append(layer("Ducado de Brzeg (núcleo piasta)", IMPERIAL, "#AD7959", 1547, 1586,
    [(1547, ["Brzeg"])], ["brzeg"],
    "Núcleo ducal de Brzeg durante el gobierno de Jorge II, 1547–1586. Autoridad territorial de un príncipe feudatario de la Corona bohemia, distinta del dominio directo del rey. Se omiten otros ducados y las posteriores administraciones hasta completar sus mandatos."))

E = [
    {"territory": "Palatinado", "from": 1505, "through": 1800, "ids": ["Burglengenfeld"], "action": "remove", "source": S["neuburg"][1], "reason": "Burglengenfeld pertenece a Pfalz-Neuburg desde 1505, no al electorado palatino. Los posibles empeños palatinos anteriores requieren una cronología independiente.", "supportingSources": [source("neuburg"), source("neuburgPolitics")]},
    {"territory": "Baviera", "from": 1505, "through": 1800, "ids": ["Burglengenfeld"], "action": "remove", "source": S["neuburg"][1], "reason": "Burglengenfeld queda en Pfalz-Neuburg; la cesión del Alto Palatinado a Baviera en 1628 no lo transfiere. La unión personal de 1777/1778 tampoco elimina retrospectivamente el principado.", "supportingSources": [source("neuburg"), source("neuburgPolitics")]},
    {"territory": "Tirol", "from": 1200, "through": 1503, "ids": ["Kufstein", "Kitzbuhel"], "action": "remove", "source": S["bavaria"][1], "reason": "Estos núcleos de las ramas bávaras no pertenecen al Tirol anterior a la guerra sucesoria. Se conserva por separado la ocupación de 1504 y el arreglo jurídico de 1505.", "supportingSources": [source("bavaria"), source("kufsteinOccupation")]},
    {"territory": "Tirol", "from": 1504, "through": 1504, "ids": ["Kufstein", "Kitzbuhel"], "action": "add", "authorityCondition": "control disputado", "source": S["kufsteinOccupation"][1], "reason": "Control adquirido en la guerra sucesoria de 1504, con toma de Kufstein el 17 de octubre. Se muestra como ocupación/control disputado antes del arbitraje y la cesión de 1505.", "supportingSources": [source("kufsteinOccupation"), source("bavaria")]},
    {"territory": "Bohemia", "from": 1349, "through": 1800, "ids": ["Brno"], "action": "remove", "source": S["johnHenry"][1], "reason": "Brno se resuelve por sus mandatos moravos propios desde Juan Enrique: no hereda automáticamente la cronología del rey de Bohemia, especialmente bajo Alberto desde 1423, Corvino en 1469–1490 y Matías en 1608–1611.", "supportingSources": [source("johnHenry"), source("jobst"), source("albrechtMoravia"), source("matthiasMoravia")]},
    {"territory": "Bohemia", "from": 1378, "through": 1800, "ids": ["Olomouc"], "action": "remove", "source": S["olomoucCharter"][1], "reason": "El privilegio original de Jobst y la cronología municipal permiten separar el núcleo moravo de Olomouc, incluidas sus ocupaciones temporales, de la sucesión bohemia genérica.", "supportingSources": [source("olomoucCharter"), source("olomoucKings"), source("olomoucCorvinus")]},
]
result = {
    "from": 1200, "through": 1800,
    "scope": "Núcleos centrales, croatas y pónticos revisados visualmente en el SVG. Cada capa limita su cobertura y distingue la soberanía de jurisdicciones locales; no son reconstrucciones de fronteras completas.",
    "territories": T,
    "evidence": E,
}
(ROOT / "central-expansion-locations.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(f"{len(T)} capas; {len({cell for territory in T for version in territory['versions'] for cell in version['ids']})} celdas únicas")
