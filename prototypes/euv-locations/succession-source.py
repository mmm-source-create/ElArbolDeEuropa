"""Reviewed area selections, not an import of the reference HTML.

The units are indivisible SVG areas. A duke's regional jurisdiction is not
ownership of each manor. Independent towns and bishoprics remain separate.
"""
import json
from pathlib import Path
H = Path(__file__).resolve().parent
D = json.loads((H/'corridor-locations.json').read_text())
F = json.loads((H/'frontier-review.json').read_text())
R = {'reviewedAt':'2026-10-08','replacements':[],'territories':[],'overrides':[],
     'limitations':['Selecciones regionales aproximadas; el SVG no permite separar todos los enclaves, señoríos ni derechos compartidos.', 'Las transiciones de Dobruja de 1388–1391 y 1417–1419 no tienen una fecha de conquista indiscutida.', 'Weilburg, Idstein y Beilstein no tienen celdas separables: no se sustituyen por ciudades vecinas. Las sucesiones ernestinas menores y las dos ramas de Siegen requieren aún desagregación.']}
def source(title,url,locator):return {'title':title,'url':url,'locator':locator}
def ids(text):return text.split()
def v(year,cells,event):return {'from':year,'ids':sorted(set(cells)),'oldIds':[],'borderline':[],'event':event}
def layer(name,start,end,versions,sources,note,condition=None):
 e={'name':name,'corridor':'Fronteras y dominios europeos','coverage':{'from':start,'through':end},'active':{'from':start,'through':end},'versions':versions,'sources':sources,'note':note,'precision':'regional_approximation','limitedCore':False,'color':'#86715d'}
 if condition:e['authorityCondition']=condition
 R['territories'].append(e)
def replace(entry,versions,sources,note,end=None):
 R['replacements'].append({'name':entry['name'],'coverage':{'from':entry.get('coverage',{}).get('from',versions[0]['from']),'through':end or entry.get('coverage',{}).get('through',1800)},'versions':versions,'sources':sources,'note':note,'precision':'regional_approximation','limitedCore':False})
def old(name):return next(e for e in D['territories']+D['additionalTerritories'] if e['name']==name)
def correct(territory,cells,start,end,action,src,reason):
 R['overrides'].extend({'territory':territory,'id':cell,'from':start,'through':end,'action':action,'source':src['url'],'reason':reason} for cell in cells)
ANTOV=source('Nikolay Antov · Dobrudja, Radovi ZHP 51 (2019)','https://hrcak.srce.hr/file/342790','pp.63–68: Balik y su hermano Dobrotitsa; Ivanko, tratado de 1387 y transición de 1388–1391; conquista otomana escalonada. No acredita un frente uniforme.')
KARPAT=source('Kemal Karpat · TDV · Dobruca','https://islamansiklopedisi.org.tr/dobruca','Expansión de 1359, dominios de Mircea y conquista final situada en 1419; otras reconstrucciones dan 1417. Se conserva explícitamente la incertidumbre.')
dob=next(e for e in F['territories'] if e['name']=='Despotado de Dobruja')
# Constanta is an actual coastal area between Pangalia and the northern delta.
replace(dob,[{**version,'ids':sorted(set(version['ids'])|({'Constanta'} if version['from']>=1359 else set()))} for version in dob['versions']],[ANTOV,KARPAT],dob['note']+' Se integra la celda costera de Constanța. Hasta 1385 se mantiene la superficie aproximada anterior; después se distingue la contracción de Ivanko.',end=1390)
R['replacements'][-1]['versions'] += [v(1388,ids('Karvuna Kaliakra Kladentsi Pangalia Varna Constanta'),'Núcleo costero de Ivanko después de la campaña de 1388; fin incierto hacia 1390–1391.')]
danube=ids('Cernavoda Harsova Babadag Enisala Tulcea Isaccea Drastar')
layer('Dobruja · dominios de Valaquia',1389,1418,[v(1389,danube,'Expansión danubiana de Mircea, mientras Ivanko conserva un núcleo costero.'),v(1391,danube+ids('Karvuna Kaliakra Kladentsi Pangalia Constanta'),'Titulatura de Mircea sobre tierras de Dobrotitsa y Silistra; transición aproximada.'),v(1395,[],'Pérdida durante la guerra con Bayezid; no prolongar el color por la titulatura.'),v(1402,danube+ids('Karvuna Kaliakra Kladentsi Pangalia Constanta'),'Recuperación después de Ankara.'),v(1417,danube+ids('Karvuna Kaliakra Constanta'),'Retirada aproximada: 1417–1419 discutido.')],[ANTOV,KARPAT],'Dominio valaco en Dobruja, distinto del principado costero. Fechas y contornos regionales inciertos; no incluye Varna automáticamente.',condition='control disputado')
layer('Dobruja otomana',1395,1800,[v(1395,danube+ids('Karvuna Kaliakra Kladentsi Pangalia Varna Constanta'),'Conquista de Bayezid, con fronteras de campaña aproximadas.'),v(1402,['Varna'],'Ankara: separar la recuperación valaca.'),v(1417,ids('Varna Kladentsi Pangalia'),'Inicio aproximado de la conquista final.'),v(1419,danube+ids('Karvuna Kaliakra Kladentsi Pangalia Varna Constanta'),'Corte conservador al completar la conquista otomana.')],[ANTOV,KARPAT],'Dobruja bajo administración otomana; no identifica la provincia con la totalidad del zarato ni anticipa su conquista final.')
for e in ['Balcanes meridionales otomanos','Núcleos de Dobruja bajo Mircea']:
 correct(e,danube+ids('Karvuna Kaliakra Kladentsi Pangalia Varna Constanta'),1200,1800,'remove',ANTOV,'Dobruja se resuelve en series propias con recuperación valaca y conquista escalonada.')

DAL=source('Instituto Lexicográfico Miroslav Krleža · Dalmacija','https://www.enciklopedija.hr/clanak/dalmacija','Ciudades, dominios venecianos, Zadar y sus interrupciones; paz de 1358, venta de 1409, Split y Brač en 1420; Makarska en 1452 y conquista otomana de 1498.')
KRK=source('Instituto Lexicográfico Miroslav Krleža · Krk','https://www.enciklopedija.hr/clanak/krk-otok','Soberanía veneciana anterior a 1358, señores Frankopan; Corona húngaro-croata 1358–1480; dominio veneciano 1480–1797.')
RAG=source('Instituto Lexicográfico Miroslav Krleža · Dubrovačka Republika','https://www.enciklopedija.hr/clanak/dubrovacka-republika','Lastovo adquirido antes de 1272; Pelješac 1333 y Slano 1399. La república tributaria conserva su gobierno propio.')
LIKA=source('Milan Kruhek · Fortificaciones otomanas en Lika y Krbava','https://hrcak.srce.hr/129805','Senjski zbornik 40 (2013), pp.471–507: ámbito de Lika y Krbava 1527–1689. La costa de Senj y Gacka no se incorporan por contigüidad.')
croat=next(e for e in F['territories'] if e['name']=='Croacia medieval')
replace(croat,[{**version,'ids':sorted(set(version['ids'])|{'Crikvenica','Dinaric_Alps9'})} for version in croat['versions']],[*croat['sources'],DAL,LIKA],croat['note']+' Se añaden Vinodol/Crikvenica y el relieve de Lika; Krk, Pag y las ciudades dálmatas siguen autoridades y fechas propias.')
hab=old('Croacia habsbúrgica')
replace(hab,[{**version,'ids':sorted(set(version['ids'])|{'Crikvenica'})} for version in hab['versions'] if version['from']>=1527]+[v(1689,ids('Karlovac Koprivnica Otocac Senj Sisak Slunj Varazdin Zagreb Crikvenica Dinaric_Alps9 Kaseg Srb'),'Recuperación de Lika y Krbava, bajo administración fronteriza diferenciada.')],[*hab.get('sources',[]),LIKA,DAL],'Reino de Croacia y territorios fronterizos bajo la Corona. Lika no pertenece a la Corona durante la ocupación otomana; su administración militar posterior no implica restitución de cada señorío.',end=1800)
R['replacements'][-1]['coverage']['from']=1527
layer('Lika otomana',1527,1688,[v(1527,ids('Dinaric_Alps9 Kaseg Srb'),'Lika y Krbava conquistadas; excluidas Senj, Otočac y Vinodol.')],[LIKA],'Sancados y fortificaciones de Lika/Krbava, superficie aproximada; incluir la cordillera no supone dominio de toda la costa.')
coast=ids('Zadar Sibenik Split Brac Makarska Pag Krk')
layer('Dalmacia bajo la Corona croata',1200,1479,[v(1200,coast[:-1],'Marco costero croata, con Zadar hasta 1203.'),v(1203,[x for x in coast if x not in ['Zadar','Krk']],'Zadar veneciana.'),v(1242,[x for x in coast if x!='Krk'],'Recuperación temporal de Zadar.'),v(1244,[x for x in coast if x not in ['Zadar','Krk']],'Restauración veneciana.'),v(1311,[x for x in coast if x!='Krk'],'Nueva rebelión de Zadar.'),v(1314,[x for x in coast if x not in ['Zadar','Krk']],'Fin de la rebelión.'),v(1322,['Makarska','Pag'],'Expansión veneciana en las ciudades; contornos de campaña aproximados.'),v(1358,coast,'Paz de Zadar; incluir Krk bajo la Corona, con gobierno Frankopan.'),v(1409,ids('Sibenik Split Brac Makarska Krk'),'Venta de Zadar y Pag; otras ciudades no se ceden de inmediato.'),v(1412,ids('Split Brac Makarska Krk'),'Šibenik pasa a Venecia.'),v(1420,ids('Makarska Krk'),'Split y Brač venecianas.'),v(1452,['Krk'],'Makarska bajo Venecia.')],[DAL,KRK],'Autoridad superior de la Corona croata en áreas costeras; no propiedad directa de todas las comunas o señores. Los intervalos breves se resumen por años.')
venVersions=[v(1200,['Krk'],'Soberanía veneciana con señorío Frankopan.'),v(1203,ids('Krk Zadar'),'Zadar veneciana.'),v(1242,['Krk'],'Zadar fuera durante la rebelión.'),v(1244,ids('Krk Zadar'),'Restauración.'),v(1311,['Krk'],'Nueva rebelión.'),v(1314,ids('Krk Zadar'),'Restauración.'),v(1322,ids('Krk Zadar Sibenik Split Brac'),'Expansión costera; escala regional aproximada.'),v(1358,[],'Retirada veneciana después de la paz de Zadar.'),v(1409,ids('Zadar Pag'),'Adquisición inicial de 1409.'),v(1412,ids('Zadar Pag Sibenik'),'Conquista de Šibenik.'),v(1420,ids('Zadar Pag Sibenik Split Brac'),'Dominio de Split y Brač.'),v(1452,ids('Zadar Pag Sibenik Split Brac Makarska'),'Makarska.'),v(1480,coast,'Krk bajo administración veneciana.'),v(1498,[x for x in coast if x!='Makarska'],'Pérdida de Makarska.'),v(1684,coast,'Recuperaciones en la guerra de Morea; corte regional de campaña.')]
layer('Dalmacia veneciana',1200,1796,venVersions,[DAL,KRK],'Dominio veneciano costero fechado; no ocupa Dubrovnik, Senj o Vinodol. El intervalo 1322–1358 reúne cambios locales pendientes de mayor resolución.')
layer('Makarska otomana',1498,1683,[v(1498,['Makarska'],'Dominio otomano hasta las reconquistas de la guerra de Morea.')],[DAL],'Celda costera de Makarska, sin atribuir automáticamente toda Dalmacia.')
layer('Dalmacia austríaca',1797,1800,[v(1797,coast,'Fin de Venecia y cesión a Austria.')],[DAL],'Dalmacia administrada como provincia austríaca, distinta de una reunificación inmediata con Croacia.')
rag=old('República de Ragusa')
replace(rag,[v(1200,['Dubrovnik'],'Comuna de Dubrovnik, con instituciones propias.'),v(1205,['Dubrovnik'],'Comienza la dependencia veneciana; se conserva la identidad comunal.'),v(1272,ids('Dubrovnik Lastovo_Island_Wasteland'),'Lastovo acreditado antes de los estatutos de 1272; este corte conservador no fija su fecha exacta de adquisición.'),v(1358,ids('Dubrovnik Lastovo_Island_Wasteland'),'Fin de la dependencia veneciana; reconocimiento de la Corona húngaro-croata con autonomía propia.'),v(1399,ids('Dubrovnik Lastovo_Island_Wasteland Slano'),'Adquisición de Slano.')],[RAG],'Comuna y República de Ragusa: gobiernos e instituciones propios. La dependencia veneciana de 1205 a 1358 y el tributo posterior no borran su autonomía. Lastovo es una isla, aunque el SVG la denomine wasteland.',end=1800)
R['replacements'][-1]['coverage']['from']=1200
for name in ['Venecia','Venecia (continuidad tardía)','República de Venecia']:
 if any(e['name']==name for e in D['territories']+D['additionalTerritories']):correct(name,coast,1200,1800,'remove',DAL,'La costa se fecha por ciudad e isla en Dalmacia veneciana; no anticipar las adquisiciones por una selección regional antigua.')

WET=source('Comisión Histórica de Baviera · Wettiner, NDB 27 (2020)','https://www.deutsche-biographie.de/downloadPDF?url=sfz135137.pdf','Sucesión de Meißen/Turingia, crisis de 1288–1307, gobierno conjunto, partición de 1379/1382 y Leipzig 1485. No confundir Lausitz, obispados y Vogtland con toda Sajonia.')
WIL=source('ISGV · Guillermo I de Meißen','https://saebi.isgv.de/biografie/Wilhelm_I._%28der_Ein%C3%A4ugige%29%2C_Markgraf_von_Mei%C3%9Fen_%281343-1407%29','Distritos del margraviato, adquisición de Dohna en 1402 y gobierno conjunto de Freiberg; 1382 separa Turingia y Osterland.')
SAX=source('Gobierno de Sajonia · Sachsen im Mittelalter','https://www.geschichte.sachsen.de/sachsen-im-mittelalter-6764.html','Mapas y explicación de Leipzig 1485; título electoral desde 1423. Las posesiones ernestinas y albertinas no son una superficie intercambiable.')
THUR=source('Landesarchiv Thüringen · Recesos y particiones ernestinas','https://www.archive-in-thueringen.de/de/findbuch/view/bestand/24151/vorwort/1/systematik/55875','4-99-006, signaturas 27,31,33,39: particiones de 1572/1603 y estructura ernestina hasta 1796. El inventario acredita los ámbitos administrativos, no cada límite de la celda.')
meissen=ids('Meissen Dresden Chemnitz Freiberg Grimma Rochlitz Zwickau Oschatz Grossenhain Radeberg Dobeln Mittweida Tharandt Sayda')
svgIds={c['id'] for c in json.loads((H/'location-inventory.json').read_text())['cells']}
meissen=[x for x in meissen if x in svgIds]
oster=ids('Leipzig Altenburg Delitzsch Torgau')
layer('Margraviato de Meißen',1200,1484,[v(1200,meissen+oster,'Margraviato regional; Wurzen episcopal y Pirna/Dohna quedan fuera.'),v(1285,meissen,'Landsberg/Osterland separado bajo Federico Tuta.'),v(1288,[x for x in meissen if x not in ['Dresden','Radeberg','Tharandt']],'Sucesión y división: Dresden de Federico Clem, no toda Meißen de Tuta.'),v(1289,meissen,'Compra del ámbito de Dresden.'),v(1294,[],'Campañas regias: las fortalezas documentadas se representan aparte, no una frontera uniforme.'),v(1298,meissen,'Recuperación parcial Wettin; superficie regional disputada.'),v(1299,[],'Nuevo conflicto con Alberto I, sin adjudicar todo el territorio por la reclamación.'),v(1307,meissen+oster,'Consolidación tras Lucka.'),v(1382,meissen,'Partición de Chemnitz; Osterland separado.'),v(1402,meissen+['Pirna'],'Fin de la contienda de Dohna.'),v(1407,meissen+oster+['Pirna'],'Herencia de Guillermo I, inicialmente compartida.' )],[WET,WIL,SAX],'Margraviato feudal de Meißen. La identidad persiste al recibir los Wettin el electorado; las superficies cambian con particiones, compras y conflictos. No incluye Wurzen, Erfurt, Magdeburgo o Lusacia por vecindad.')
layer('Meißen · administración regia',1294,1306,[v(1294,ids('Meissen Freiberg'),'Fortalezas ocupadas durante la campaña de Adolfo.'),v(1298,[],'Recuperación Wettin.'),v(1299,ids('Meissen Freiberg'),'Continuación del conflicto regio; núcleo documentado conservador.')],[source('Deutsche Biographie · Federico I de Meißen','https://www.deutsche-biographie.de/gnd118535706.html','Campañas de Adolfo y Alberto I, toma de Meißen y Freiberg y batalla de Lucka de 1307.')],'Núcleo de ocupación regia, sin convertir una pretensión imperial en dominio sobre todas las tierras Wettin.',condition='control disputado')
layer('Osterland',1285,1406,[v(1285,oster,'Landsberg/Osterland bajo Federico Tuta.'),v(1294,[],'Conflicto regio.'),v(1307,[],'Reunión del ámbito al margraviato.'),v(1382,oster,'Partición de Chemnitz: hermanos Federico y Guillermo.')],[WET,WIL],'Ámbito de Osterland en las particiones Wettin; sus límites feudales no coinciden exactamente con cuatro celdas. Desde 1407 se reúne con Meißen.')
thur=ids('Eisenach Gotha Ohrdruf Weimar Apolda Eisenberg Langensalza')
layer('Landgraviato de Turingia',1200,1484,[v(1200,[x for x in thur if x not in ['Weimar','Apolda','Eisenberg']],'Marco ludovingio: señoríos orientales no anticipados.'),v(1247,[x for x in thur if x not in ['Weimar','Apolda','Eisenberg']],'Extinción masculina ludovingia y guerra de sucesión; Hesse separado.'),v(1265,[x for x in thur if x not in ['Weimar','Apolda','Eisenberg']],'Partición Wettin bajo Alberto II.'),v(1342,thur,'Compras de Weimar-Orlamünde: contornos orientales aproximados.'),v(1382,thur,'Turingia de Baltasar.'),v(1440,thur,'Extinción de Federico IV y herencia de la rama electoral.'),v(1445,thur+['Saalfeld'],'Partición de Altenburg: Guillermo III recibe Turingia y posesiones occidentales.'),v(1482,thur+['Saalfeld'],'Extinción de Guillermo III y reunión con sus sobrinos.')],[WET,THUR,source('Deutsche Biographie · Federico II de Meißen','https://www.deutsche-biographie.de/downloadPDF?url=sfz69829.pdf','Compra de derechos de Weimar-Orlamünde en1342; no anticipar Weimar bajo los Ludovingios.')],'Landgraviato de Turingia; los cambios de dinastía no lo convierten en territorio + persona. Hesse, Erfurt y los señoríos independientes no se incorporan por un nombre regional.')
layer('Turingia ernestina',1485,1571,[v(1485,thur+['Saalfeld'],'Leipzig: ámbito ernestino.'),v(1547,thur+['Saalfeld'],'Pérdida del electorado; subsiste el ducado ernestino.')],[SAX,THUR],'Ámbito territorial de los duques ernestinos de Sajonia, con jurisdicciones compartidas; la pérdida de la dignidad electoral no vacía Turingia.')
layer('Ducado de Sajonia-Weimar',1572,1800,[v(1572,ids('Weimar Apolda Eisenberg Langensalza Saalfeld'),'Partición de Erfurt: núcleo de Weimar.'),v(1603,ids('Weimar Apolda Langensalza Saalfeld'),'Partición de Altenburg; Eisenberg en la rama de Altenburg.'),v(1741,ids('Weimar Apolda Langensalza Saalfeld Eisenach'),'Extinción de Eisenach y unión personal; no anticipar la unión constitucional de 1809.')],[THUR],'Selección administrativa de Weimar. Las adquisiciones y particiones menores de Saalfeld siguen pendientes; no es un perímetro exacto de todos los ducados ernestinos.')
layer('Ducados de Sajonia-Coburgo y Sajonia-Eisenach',1572,1639,[v(1572,ids('Eisenach Gotha Ohrdruf'),'Partición de 1572; núcleo occidental compartido.'),v(1596,ids('Eisenach Gotha Ohrdruf'),'División Coburgo/Eisenach no completamente separable en este SVG.'),v(1638,[],'Extinción de Juan Ernesto; herencia en Weimar y Altenburg.')],[THUR],'Resumen de las ramas occidentales: se documenta la partición, sin fingir que el SVG separa todos los exclaves.')
layer('Ducado de Sajonia-Gotha',1640,1800,[v(1640,ids('Gotha Ohrdruf'),'Partición de 1640 bajo Ernesto I.'),v(1672,ids('Gotha Ohrdruf Eisenberg'),'Herencia de Altenburg; nueva identidad compuesta y posteriores particiones.' )],[THUR],'Desde 1672 Sajonia-Gotha-Altenburg. Eisenberg se separa 1680–1707: se resuelve en una capa propia.')
layer('Ducado de Sajonia-Eisenach',1640,1740,[v(1640,['Eisenach'],'Rama de Alberto.'),v(1644,[],'Extinción y retorno a Weimar.'),v(1662,['Eisenach'],'Nueva partición.'),v(1741,[],'Extinción de la rama y herencia de Weimar.')],[THUR],'Ducado territorial distinto de Weimar antes de su unión personal de 1741.')
layer('Ducado de Sajonia-Eisenberg',1680,1706,[v(1680,['Eisenberg'],'Partición de Gotha bajo Cristián.')],[THUR],'Extinción en 1707 y reversión a Gotha-Altenburg.')
correct('Ducado de Sajonia-Gotha',['Eisenberg'],1680,1706,'remove',THUR,'Partición independiente de Sajonia-Eisenberg.')
albert=old('Sajonia albertina');elect=old('Sajonia electoral')
for entry in [albert,elect]:
 versions=[]
 for version in entry['versions']:
  cells=set(version['ids'])
  if entry['name']=='Sajonia albertina' and version['from']>=1485 or version['from']>=1547:cells.update(meissen+oster+['Pirna'])
  versions.append({**version,'ids':sorted(cells)})
 replace(entry,versions,[*entry.get('sources',[]),SAX,WIL],entry.get('note','')+' Completar el ámbito meißniano sin incorporar Turingia ernestina ni Wurzen episcopal.')

SWAB=source('Landesbildungsserver Baden-Württemberg · Los Staufen en el suroeste','https://www.schule-bw.de/faecher-und-schularten/gesellschaftswissenschaftliche-und-philosophische-faecher/landeskunde-landesgeschichte/module/epochen/mittelalter/staufer/staufer_suedwest/3landesgeschichte.htm','Enrique VII, Conrado IV duque desde 1235 y fin del poder Staufen; creciente independencia de los príncipes y ciudades. El ducado es una jurisdicción regional, no propiedad uniforme.')
swab=ids('Ulm Balingen Heidenheim Helfenstein Hohenberg Riedlingen Sigmaringen Biberach Ravensburg Saulgau Waldburg Waldsee Memmingen')
layer('Ducado de Suabia',1200,1268,[v(1200,swab,'Jurisdicción ducal regional Staufen; excluidos obispados y abadías independientes.'),v(1209,[],'Vacancia ducal: no prolongar a Felipe después de su muerte.'),v(1212,swab,'Federico II.'),v(1217,swab,'Enrique VII.'),v(1235,swab,'Conrado IV.'),v(1254,swab,'Conradino; poder regional fragmentado.')],[SWAB,source('Universidad de Friburgo · Stälin, Wirtembergische Geschichte II','https://dl.ub.uni-freiburg.de/diglit/staelin1847-2/0006/ocr','Cronología ducal: Federico II 1212–1216, Enrique 1217–1235, Conrado IV 1235–1254, Conradino 1254–1268.')],'Jurisdicción ducal aproximada, compatible con señoríos y derechos urbanos propios. El mapa no afirma propiedad ducal de cada lugar. Tras 1268 desaparece el marco Staufen efectivo; los títulos posteriores no recrean su superficie.')

NAS=source('Hessisches Hauptstaatsarchiv · Nassau-Dillenburg y ramas','https://arcinsys.hessen.de/arcinsys/showFondsDetails?fondsId=2004','HHStAW170III: división de 1255 al norte de la Lahn, Hadamar 1303–1394, Beilstein 1343 y extinción 1561, partición 1607; extinciones de Hadamar1711, Siegen1734/1743 y Dillenburg1739, reunión en Dietz1743.')
WAL=source('Hessisches Hauptstaatsarchiv · Nassau-Weilburg','https://arcinsys.hessen.de/arcinsys/showFondsDetails?fondsId=1981','HHStAW150: línea walramiana, separación de Weilburg, herencia de Saarbrücken1381, extinción de Idstein1605 y reunión hasta1629. Weilburg no tiene celda separable.')
allNas=ids('Siegen Dillenburg Hadamar Usingen Wiesbaden')
layer('Condado de Nassau',1200,1254,[v(1200,allNas,'Condado antes de la partición de 1255; Diez conserva otra casa.')],[NAS,WAL],'Jurisdicción regional conjunta; no equivale a toda la provincia de Nassau del siglo XIX.')
layer('Nassau · rama otoniana',1255,1302,[v(1255,ids('Siegen Dillenburg Hadamar'),'Tierras septentrionales de la división de 1255.')],[NAS],'Gobierno otoniano antes de la partición de 1303; no incluye Nassau-Wiesbaden.')
layer('Nassau · rama walramiana',1255,1360,[v(1255,ids('Usingen Wiesbaden'),'Tierras al sur de la Lahn; Weilburg/Idstein no separables.')],[WAL],'Gobierno walramiano, seguido por la partición de Weilburg e Idstein. La celda Usingen no sustituye a Weilburg.')
layer('Condado de Nassau-Wiesbaden-Idstein',1361,1604,[v(1361,ids('Usingen Wiesbaden'),'Rama de Wiesbaden-Idstein; límites regionales aproximados.')],[WAL],'No se adjudica a los Nassau otonianos. Extinción en1605; las celdas no separan todas las divisiones internas de Idstein.')
layer('Nassau-Weilburg · herencia de Idstein',1605,1628,[v(1605,ids('Usingen Wiesbaden'),'Extinción de Idstein y reunión de tierras walramianas.')],[WAL],'Herencia de Idstein: Weilburg y Saarbrücken se conservan como identidades distintas. No se sustituye Weilburg por Wetzlar.')
layer('Nassau-Idstein y Nassau-Usingen',1629,1800,[v(1629,ids('Usingen Wiesbaden'),'Nueva división walramiana.'),v(1721,ids('Usingen Wiesbaden'),'Extinción de Idstein y sucesión en Usingen.')],[WAL,source('Deutsche Biographie · Casa de Nassau','https://www.deutsche-biographie.de/gnd118738038.html','Ramas walramianas, particiones y extinciones; título principesco no equivale a reunión de todos los condados.')],'Ámbitos walramianos no separables completamente en este SVG; no trasladar sus tierras a Dietz ni Orange por compartir casa.')
layer('Nassau-Siegen',1303,1742,[v(1303,['Siegen'],'Partición de1303.'),v(1328,ids('Siegen Dillenburg'),'Extinción de la primera rama Dillenburg.'),v(1607,['Siegen'],'Partición de1607; ramas católica y reformada todavía sin polígonos separables.')],[NAS],'Territorio de Siegen; desde1607 se limita a su celda, no a la totalidad del patrimonio otoniano.')
layer('Nassau-Dillenburg',1303,1738,[v(1303,['Dillenburg'],'Primera rama.'),v(1328,[],'Herencia en Siegen.'),v(1607,['Dillenburg'],'Nueva partición.'),v(1739,[],'Extinción y herencia en Dietz/Orange.')],[NAS],'El título de Nassau-Dillenburg no colorea automáticamente las ramas de Hadamar o Dietz después de1607.')
layer('Nassau-Hadamar',1303,1710,[v(1303,['Hadamar'],'Primera rama.'),v(1394,[],'Extinción; patrimonio repartido con Katzenelnbogen.'),v(1607,['Hadamar'],'Nueva rama de la partición.'),v(1711,[],'Extinción; herencia compartida, no reunión instantánea de todo Nassau.')],[NAS],'Celda regional de Hadamar; la distribución parcial después de1394 y1711 exige mayor resolución que este SVG.')
layer('Nassau-Dietz',1386,1800,[v(1386,['Diez'],'Adquisición parcial del condado de Diez, con derechos compartidos.'),v(1607,['Diez'],'Rama propia de Dietz.'),v(1739,ids('Diez Dillenburg'),'Extinción de Dillenburg.'),v(1743,ids('Diez Dillenburg Siegen Hadamar'),'Reunión final de tierras otonianas bajo Dietz/Orange.')],[NAS],'Nassau-Dietz/Diez; la celda medieval mezcla derechos de Nassau y otros señores. Desde1654 principado, y desde1743 territorios otonianos reunidos; nunca todos los territorios walramianos.')
layer('Condado de Diez',1200,1385,[v(1200,['Diez'],'Casa propia de Diez, anterior a las adquisiciones Nassau.')],[NAS],'Condado independiente de la sucesión Nassau temprana; no anticipar una herencia del siglo XIV.')

layer('Bulgaria · Chaka en Tarnovo',1299,1300,[v(1299,['Tarnovo','Lyaskovets'],'Gobierno breve de Chaka; ámbito capitalino conservador.')],[source('CEU · Eszter Tarjan (2017)','https://www.etd.ceu.edu/2017/tarjan_eszter.pdf','p.57: Chaka1299–1300. La titulatura y extensión efectiva se discuten.')],'Control capitalino de Chaka; no se colorea toda Bulgaria por el título.',condition='control disputado')

# City histories refine the broad regional chronologies before publication.
SPLIT=source('Instituto Lexicográfico Miroslav Krleža · Split','https://enciklopedija.hr/clanak/split','Venecia1327–1357; disputa dinástica desde1390, Hrvoje1403 y restauración de Segismundo1413; Venecia1420–1797.')
MAK=source('Instituto Lexicográfico Miroslav Krleža · Makarska','https://enciklopedija.hr/clanak/makarska','Bosnia1324; Venecia1452; conquista otomana incierta en los1490; cambios1572/1573,1646,1671/1684. No prolongar un dominio uniforme desde1498.')
SAAL=source('Archivo eclesiástico de Eisenach · Superintendentur Saalfeld','https://www.archive-in-thueringen.de/de/findbuch/view/bestand/25859/vorwort/1','Weimar1572, Altenburg1603, Gotha1673; ducadoSaalfeld1680–1745, despuésCoburgo-Saalfeld.')
def entry(name):return next(e for e in R['territories']+R['replacements'] if e['name']==name)
def cut(name,year,add=(),remove=(),event='Cambio territorial documentado.'):
 e=entry(name);prior=next(x for x in reversed(sorted(e['versions'],key=lambda x:x['from'])) if x['from']<=year)
 e['versions']=[x for x in e['versions'] if x['from']!=year]+[v(year,(set(prior['ids'])|set(add))-set(remove),event)]
 e['versions'].sort(key=lambda x:x['from'])
# Split's Venetian government starts in1327, not at the start of the regional
#1322–1328 expansion. The Crown's title does not erase the dynastic conflict.
for e in [entry('Dalmacia bajo la Corona croata'),entry('Dalmacia veneciana')]:
 for version in e['versions']:
  if 1322<=version['from']<1327:
   if e['name']=='Dalmacia bajo la Corona croata':version['ids']=sorted(set(version['ids'])|{'Split'})
   else:version['ids']=[x for x in version['ids'] if x!='Split']
 e['sources'].append(SPLIT)
cut('Dalmacia bajo la Corona croata',1327,remove=['Split'],event='Split pasa a Venecia en1327.')
cut('Dalmacia veneciana',1327,add=['Split'],event='Split bajo Venecia1327–1357.')
for name in ['Dalmacia bajo la Corona croata','Dalmacia veneciana']:
 cut(name,1345,add=['Zadar'] if name=='Dalmacia bajo la Corona croata' else [],remove=['Zadar'] if name=='Dalmacia veneciana' else [],event='Rebelión de Zadar1345–1346.')
 cut(name,1347,remove=['Zadar'] if name=='Dalmacia bajo la Corona croata' else [],add=['Zadar'] if name=='Dalmacia veneciana' else [],event='Restauración veneciana después de la rebelión.')
for version in entry('Dalmacia bajo la Corona croata')['versions']:
 if version['from']>=1324:version['ids']=[x for x in version['ids'] if x!='Makarska']
cut('Dalmacia bajo la Corona croata',1324,remove=['Makarska'],event='Makarska reconoce a los Kotromanić desde1324.')
layer('Makarska bajo Bosnia y Hum',1324,1451,[v(1324,['Makarska'],'Soberanía bosnia y posteriores señoríos de Hum.')],[MAK],'Autoridad regional bosnia y de los señores de Hum; las relaciones señoriales cambian. No se atribuye a los reyes croatas solo por su antigua pertenencia.')
layer('Split · control dinástico disputado',1390,1412,[v(1390,['Split'],'Tvrtko/Dabiša, Segismundo y posteriormente Ladislao/Hrvoje; sucesión regional disputada.')],[SPLIT],'La soberanía croata reclamada y la administración local divergen. Se marca la disputa, sin asignar cada celda a una corona uniforme.',condition='control disputado')
correct('Dalmacia bajo la Corona croata',['Split'],1390,1412,'remove',SPLIT,'Resolver el gobierno local rival en su propia serie; restauración de Segismundo1413.')
# City evidence gives intervals omitted by a province-wide chronology.
for year,add,remove,event in [(1572,['Makarska'],[],'Ocupación veneciana1572.'),(1573,[],['Makarska'],'Restitución otomana1573.'),(1646,['Makarska'],[],'Ocupación veneciana en la guerra de Candía.'),(1671,[],['Makarska'],'Restauración otomana1671.')]:
 cut('Dalmacia veneciana',year,add,remove,event)
for year,add,remove,event in [(1572,[],['Makarska'],'Ocupación veneciana.'),(1573,['Makarska'],[],'Restitución otomana.'),(1646,[],['Makarska'],'Ocupación veneciana.'),(1671,['Makarska'],[],'Restauración otomana.')]:cut('Makarska otomana',year,add,remove,event)
entry('Makarska otomana')['sources'].append(MAK)
entry('Makarska otomana')['note']+=' La fecha1498 es un corte regional aproximado: la fuente municipal sitúa la conquista en los1490 sin año cierto.'
entry('Dalmacia veneciana')['note']='Dominio veneciano costero fechado por ciudad e isla: Brač desde 1278, Šibenik desde 1322, Split desde 1327, con retiradas y reconquistas separadas. No ocupa Dubrovnik, Senj o Vinodol; las interrupciones menores aún requieren investigación.'
# Keep constitutional partitions separate from modern geographic Thuringia.
for e in [entry('Sajonia albertina'),entry('Sajonia electoral')]:
 for version in e['versions']:
  if version['from']>=1485:version['ids']=[x for x in version['ids'] if x!='Altenburg']
  if e['name']=='Sajonia albertina' and 1485<=version['from']<1547:version['ids']=[x for x in version['ids'] if x!='Torgau']
cut('Turingia ernestina',1485,add=['Altenburg'],event='Leipzig: Altenburg permanece en la rama ernestina.')
for e in [entry('Ducado de Sajonia-Weimar')]:
 for version in e['versions']:
  if version['from']>=1603:version['ids']=[x for x in version['ids'] if x!='Saalfeld']
 e['sources'].append(SAAL)
layer('Ducado de Sajonia-Altenburg',1603,1671,[v(1603,ids('Altenburg Eisenberg Saalfeld'),'Partición de1603 y administración separada.')],[THUR,SAAL],'Primera casa de Sajonia-Altenburg; extinción en1672. Los contornos son ámbitos administrativos aproximados.')
cut('Ducado de Sajonia-Gotha',1672,add=['Altenburg'],event='Extinción de la primera rama Altenburg; herencia de Gotha-Altenburg.')
cut('Ducado de Sajonia-Gotha',1673,add=['Saalfeld'],event='Saalfeld bajo Gotha.')
cut('Ducado de Sajonia-Gotha',1680,remove=['Saalfeld','Eisenberg'],event='Particiones de Saalfeld y Eisenberg.')
cut('Ducado de Sajonia-Gotha',1707,add=['Eisenberg'],event='Extinción y reversión de Eisenberg.')
layer('Ducado de Sajonia-Saalfeld',1680,1744,[v(1680,['Saalfeld'],'Partición de1680.')],[SAAL],'Ducado de Sajonia-Saalfeld; desde1745 Coburgo-Saalfeld. No prolongar su pertenencia a Weimar.')
layer('Ducado de Sajonia-Coburgo-Saalfeld',1745,1800,[v(1745,['Saalfeld'],'Nuevo ámbito dinástico de Coburgo-Saalfeld.')],[SAAL],'Se representa el ámbito de Saalfeld; la superficie completa de Coburgo necesita ampliación independiente.')

BRAC=source('Instituto Lexicográfico Miroslav Krleža · Brač','https://enciklopedija.hr/clanak/brac-otok','Autoridades: Venecia con interrupciones1278–1358; Corona1358–1390; Tvrtko1390–1391, Hrvoje1403–1416 y Venecia1420–1797.')
for name in ['Dalmacia bajo la Corona croata','Dalmacia veneciana']:
 for version in entry(name)['versions']:
  if 1278<=version['from']<1358:
   if name=='Dalmacia veneciana':version['ids']=sorted(set(version['ids'])|{'Brac'})
   else:version['ids']=[x for x in version['ids'] if x!='Brac']
 entry(name)['sources'].append(BRAC)
cut('Dalmacia veneciana',1278,add=['Brac'],event='Dominio veneciano de Brač, con interrupciones aún pendientes de mayor resolución.')
cut('Dalmacia bajo la Corona croata',1278,remove=['Brac'],event='Brač veneciana.')
layer('Brač · gobierno dinástico disputado',1390,1416,[v(1390,['Brac'],'Tvrtko, Corona croata y posterior gobierno de Hrvoje; marco disputado.')],[BRAC],'Brač durante los cambios dinásticos1390–1416; no se acredita un único soberano uniforme para todo el intervalo.',condition='control disputado')
correct('Dalmacia bajo la Corona croata',['Brac'],1390,1416,'remove',BRAC,'Separar los cambios dinásticos de Brač y el gobierno de Hrvoje de una soberanía croata uniforme.')
for version in entry('Turingia ernestina')['versions']:version['ids']=sorted(set(version['ids'])|{'Altenburg'})
for version in entry('Ducado de Sajonia-Weimar')['versions']:
 if version['from']<1603:version['ids']=sorted(set(version['ids'])|{'Altenburg'})
# The1596 partition splits Coburg and Eisenach;1633/1638 are extinctions,
# not spontaneous new territories at1640.
combined=entry('Ducados de Sajonia-Coburgo y Sajonia-Eisenach')
combined['coverage']['through']=combined['active']['through']=1595
combined['versions']=[x for x in combined['versions'] if x['from']<1596]
layer('Ducado de Sajonia-Coburgo',1596,1632,[v(1596,ids('Gotha Ohrdruf'),'Parte occidental de Juan Casimiro; Coburgo propiamente dicho requiere superficie separada.')],[THUR],'Ámbitos de Gotha/Ohrdruf de la rama de Coburgo, no todo el territorio de Turingia; extinción1633.')
eis=entry('Ducado de Sajonia-Eisenach');eis['coverage']['from']=eis['active']['from']=1596
eis['versions']=[v(1596,['Eisenach'],'Partición bajo Juan Ernesto.'),v(1633,ids('Eisenach Gotha Ohrdruf'),'Extinción de Coburgo y herencia.'),v(1638,[],'Extinción de Juan Ernesto y reparto entre Weimar y Altenburg.')]+eis['versions']
cut('Ducado de Sajonia-Weimar',1638,add=ids('Eisenach Gotha Ohrdruf'),event='Herencia de la rama occidental extinta; ámbitos inspeccionados, sin todo el territorio de Coburgo.')
cut('Ducado de Sajonia-Weimar',1640,remove=ids('Eisenach Gotha Ohrdruf'),event='Nuevas ramas de Gotha y Eisenach.')
cut('Ducado de Sajonia-Weimar',1644,add=['Eisenach'],event='Extinción de Alberto y retorno de Eisenach.')
cut('Ducado de Sajonia-Weimar',1662,remove=['Eisenach'],event='Nueva rama de Eisenach.')

for entry in R['replacements']+R['territories']:
 for version in entry['versions']:
  missing=set(version['ids'])-svgIds
  if missing:raise ValueError((entry['name'],missing))
(H/'succession-review.json').write_text(json.dumps(R,ensure_ascii=False,indent=2)+'\n')
print(len(R['replacements']), 'replacements,',len(R['territories']),'new area series')
