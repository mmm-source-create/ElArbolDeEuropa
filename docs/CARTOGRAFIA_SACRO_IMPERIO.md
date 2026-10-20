# Sacro Imperio y tierras austríacas · criterio cartográfico

El Sacro Imperio **no era el patrimonio territorial del emperador**. El mapa usa dos lecturas simultáneas cuando se consulta a una persona que ostenta la dignidad imperial y se fija un año: un gris neutro para un **marco jurídico regional aproximado** del Imperio y los colores habituales para sus **gobiernos territoriales efectivos**. El gris no significa administración directa, mismo soberano en cada feudo ni fronteras exactas. No se dibujan contornos internos entre feudos.

## Marco imperial

El marco cubre **1106–1800**, todo el recorrido del mapa. El Imperio existió de 962 a 1806, pero el Atlas no dibuja años fuera de ese intervalo. El valor único está en `IMPERIAL_FRAME_RANGE` de `src/cartography/imperialFrame.js`; la interfaz y esta documentación deben leerlo de ahí. Los círculos imperiales **no incluían todo el Imperio**: Bohemia, sus tierras de la Corona, Suiza e Italia imperial eran excepciones destacadas. Por eso el modelo no identifica «círculo» con «pertenencia al Imperio», y antes de 1512 se apoya en los reinos de Alemania, Italia y Borgoña-Arlés y en la Corona de Bohemia.

El marco se calcula así:

1. **Bloques de regiones del SVG antiguo** con su intervalo: núcleo germánico y austríaco, Corona de Bohemia, Países Bajos, Confederación Suiza, Alsacia-Metz, Franco Condado y los feudos italianos de pertenencia imperial inequívoca, más los bloques medievales de Provenza, Parma-Piacenza, Verona, Vicenza, Padua, Brescia, Bergamo y Friuli.
2. **Traducción a celdas EU V** con el cruce geométrico auditado (`locationCrosswalk`).
3. **Ajustes por celda**, siempre fechados: celdas sin región antigua (Delfinado, Valentinois, Lyon) y enclaves de estatuto distinto dentro de una región mayor (Rügen, Lebus, Aviñón, Siewierz, cesiones a Francia…).

El marco **no depende de la precedencia política regional**: que una revisión regional asigne una celda a un príncipe concreto no la saca del ámbito jurídico del Imperio. Cada año refleja los actos jurídicos de ese mismo año, como Westfalia en 1648 y Nimega en 1678. La única excepción es 1792, que conserva la referencia del IEG al 1 de enero; Saboya sale en 1793. Se ha comprobado que todos los IDs antiguos existen en `MapChart_Map.svg` y todas las celdas añadidas o retiradas, en `euv-locations-crop.svg` (`tests/imperial-frame-range.test.mjs`). La lista de IDs facilitada por el usuario también contiene Dinamarca, Prusia ducal, Hungría, Polonia, Venecia y los Estados Pontificios: **su mera presencia en esa lista no los incorpora al Imperio**.

### Referencia cartográfica por periodo

`imperialFrameReference(año)` devuelve la fuente general del año; los cortes fechados citan además la suya.

| Años | Referencia |
| --- | --- |
| 1106–1250 | [UT Austin · Europa central, 1180 (Freeman/Bury)](https://maps.lib.utexas.edu/maps/historical/central_europe.html) |
| 1251–1449 | [IEG-MAPS · Alemania en 1378](https://www.ieg-maps.uni-mainz.de/mapsp/mapp378d.htm) |
| 1450–1511 | [IEG-MAPS · Alemania en 1500](https://www.ieg-maps.uni-mainz.de/mapsp/mapp500d.htm) |
| 1512–1647 | [GHDI · círculos imperiales hacia 1512](https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi%3Amap-2809) |
| 1648–1791 | [GHDI · Europa central en 1648](https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/central-europe-1648) |
| 1792–1800 | [IEG-MAPS · Alemania en 1792](https://www.ieg-maps.uni-mainz.de/mapsp/mapp792d.htm) |

### Cortes medievales (1106–1511)

| Años | Cambio | Fuente |
| --- | --- | --- |
| 1106–1180 | Sin las tierras eslavas al este del Elba: Wagria y Lübeck, Mecklemburgo, Pomerania, Uckermark, Prignitz, Mittelmark y Fläming. Las etapas de 1143, 1157 y 1167 se omiten por prudencia. | [Europa central, 1180](https://maps.lib.utexas.edu/maps/historical/central_europe.html) |
| 1181 | Entran al investir Federico I a Bogislao I con Pomerania; el mapa de 1180 ya muestra Brandeburgo, Mecklemburgo y Wagria bajo príncipes del Imperio. | [OME-Lexikon, Pommern](https://ome-lexikon.uni-oldenburg.de/regionen/pommern) |
| 1214–1226 | Salen Holstein, Lübeck, Lauenburgo-Ratzeburgo, Hamburgo, Mecklemburgo, Pomerania y Uckermark: la bula de oro de Federico II (Metz, diciembre de 1214) reconoce a Valdemar II las tierras al norte del Elba y del Elde. Lübeck vuelve en 1226 con su carta de libertad imperial; el resto, tras Bornhöved (1227). | [Lübeck, Reichsfreiheitsbrief](https://geschichte-s-h.de/aktuelles/luebeck-feiert-800-jahre-reichsfreiheitsbrief/), [Hertugdømmet Slesvig](https://danmarkshistorien.lex.dk/Hertugd%C3%B8mmet_Slesvig,_ca._1200-1867) |
| 1250 / 1260 | Nueva Marca y tierra de Lebus; Santok en 1260. Fechas regionales convencionales, como en la revisión alemana. | [IEG 1378](https://www.ieg-maps.uni-mainz.de/mapsp/mapp378d.htm), [OME, Schlesien](https://ome-lexikon.uni-oldenburg.de/regionen/schlesien) |
| hasta 1324 | Principado de Rügen (`Rugen`, `Stralsund`, `Grimmen`), feudo danés, fuera; entra con la herencia pomerana de 1325. | [OME, Pommern](https://ome-lexikon.uni-oldenburg.de/regionen/pommern) |
| 1300–1322 | Señorío de Rostock (`Rostock`, `Doberan`) bajo protectorado danés. | [Landesmuseum MV, atlas histórico](https://www.landesmuseum-mv.de/en/historic-atlas/) |
| 1312 | Sale Lyon: el tratado de 1312 confirma la anexión de 1307 y cede al rey el poder temporal del arzobispo. | [Treccani, Lione](https://www.treccani.it/enciclopedia/lione_(Enciclopedia-Italiana)/) |
| 1335 | Entra Silesia (paz de Trenčín). Los ducados de Świdnica-Jawor (`Swidnica`, `Jawor`, `Kamienna_Gora`, `Niemcza`, `Rychbach`) esperan a 1392. | [OME, Schlesien](https://ome-lexikon.uni-oldenburg.de/regionen/schlesien) |
| 1348 | Sale Aviñón, vendida al papa con renuncia imperial. | [Shepherd, Francia en 1328](https://maps.lib.utexas.edu/maps/historical/shepherd/france_1328.jpg) |
| 1349 | Salen el Delfinado y el Valentinois, cedidos al heredero francés; Faucigny les sigue hasta el intercambio con Saboya de 1355. | [Treccani, Delfinato](https://www.treccani.it/enciclopedia/delfinato/), [Académie de Savoie](https://www.academiesavoie.org/images/memoires/serie4/Memoires_Academie_de_Savoie_serie4-tome-2.pdf) |
| 1404–1428 | Pasan a Venecia Vicenza (1404), Verona y Padua (1405), el Friuli patriarcal con el alto Isonzo (1420), Brescia y Bergamo (paz de Ferrara, 1428). Pordenone sigue austríaca hasta 1508; Tolmin vuelve en 1509. | [Vicenza](https://www.treccani.it/enciclopedia/vicenza/), [Verona](https://www.treccani.it/enciclopedia/verona/), [Padova](https://www.treccani.it/enciclopedia/padova/), [Patria del Friuli](https://www.consiglio.regione.fvg.it/pagineinterne/Portale/comunicatiStampaDettaglio.aspx?ID=541304), [Brescia](https://www.treccani.it/enciclopedia/brescia/), [Bergamo](https://www.lombardiabeniculturali.it/archivi/soggetti-produttori/ente/MIDB000860/), [Venezia e l’entroterra](https://www.treccani.it/enciclopedia/venezia-e-l-entroterra_%28Storia-di-Venezia%29/) |
| 1443 | Sale el ducado de Siewierz, comprado por el obispo de Cracovia (Polonia lo incorpora en 1790). | [OME, Schlesien](https://ome-lexikon.uni-oldenburg.de/regionen/schlesien) |
| 1481 | Sale Provenza, con Apt, Forcalquier y Orange: herencia de Luis XI (unión de 1486). | [Treccani, Provenza](https://www.treccani.it/enciclopedia/provenza/) |
| 1499–1508 | Cremona y la Ghiara d’Adda, venecianas entre la paz de Blois y Agnadello. | [Shepherd, Italia hacia 1494](https://maps.lib.utexas.edu/maps/historical/shepherd/italy_1494_shepherd.jpg) |
| 1512 | Salen Parma y Piacenza, ocupadas por la Iglesia. | [Treccani, Parma](https://www.treccani.it/enciclopedia/parma/), [Piacenza](https://www.treccani.it/enciclopedia/piacenza_%28Enciclopedia-Italiana%29/) |

### Cortes de 1512–1792

En **1648** se retiran del marco las provincias de la República neerlandesa y la Confederación Suiza; se conservan los Países Bajos meridionales. La independencia neerlandesa y la autonomía suiza precedieron en la práctica a su reconocimiento formal, así que el gris anterior a 1648 expresa la relación jurídica, no obediencia real al emperador ([Westfalia](https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/peace-treaties-of-westphalia-october-14-24-1648)). Con ellas salen ahora Güeldres y la Meierij de Bolduque (`Gelderland`, `Kempenland`), Breda, Bergen op Zoom y Schaffhausen, que la versión anterior dejaba dentro por error. El **Franco Condado** (`Amont`, `Millieu`, `Aval`) sale en 1678 conforme al [Tratado de Nimega](https://documentsdedroitinternational.fr/1678-17-septembre-traite-de-nimegue/); el ducado francés de Borgoña queda fuera.

Las cesiones a Francia que caen dentro de regiones antiguas mayores se retiran celda a celda: Thionville y Montmédy (Pirineos, 1659), Sarrebourg (Vincennes, 1661), Valenciennes y Maubeuge (Nimega, 1678), Friburgo de Brisgovia entre Nimega (1679) y Ryswick (1697), Landau (reunión de 1680) y Bitche y Sarreguemines con Lorena (1766). Venlo pasa en 1713 al cuarto neerlandés de Güeldres. Fuentes: [Shepherd, fronteras de Francia 1601–1766](https://maps.lib.utexas.edu/maps/historical/shepherd/france_frontiers_1601_1766.jpg), [DHIALSACE, Lorraine](https://dhialsace.bnu.fr/wiki/Lorraine_%28duch%C3%A9s_et_%C3%A9v%C3%AAch%C3%A9s%29), [DHIALSACE, Décapole](https://dhialsace.bnu.fr/wiki/D%C3%A9capole), [Meurthe-et-Moselle, 1766](https://archives.meurthe-et-moselle.fr/content/lettres-de-noblesse-donn%C3%A9es-par-le-roi-stanislas-le-13-janvier-1766) y [Overkwartier de Güeldres](https://mijngelderland.nl/inhoud/verhalen/het-overkwartier-voormalig-gelders-gebied-in-limburg-en-duitsland).

### Guerras revolucionarias, 1793–1800

El criterio es la **anexión formal o la nueva república reconocida**, no la ocupación militar:

- **1793**: salen Saboya, reunida a Francia el 27 de noviembre de 1792 ([decreto](https://mjp.univ-perp.fr/france/d1792savoie.htm)), y el condado de Saarwerden.
- **1795**: salen los Países Bajos austríacos, Lieja y Luxemburgo, anexionados el 1 de octubre ([Archives de l’État](https://agatha.arch.be/fr/data/ead/BE-A0510_000273_808060/), [Luxemburgo](https://luxembourg.public.lu/fr/societe-et-culture/histoire/400-ans-souverains-etrangers.html)). Austria los cede en Campo Formio (1797).
- **1797**: salen Lombardía, Mantua, Módena y Reggio, integrados en la República Cisalpina (29 de junio) y reconocidos en Campo Formio ([Regione Lombardia](https://lombardiabeniculturali.it/istituzioni/storia/?unita=04.02)). La reocupación austríaca de 1799–1800 es militar y no los devuelve al marco ([Treccani, Mantova](https://www.treccani.it/enciclopedia/mantova/)).
- **Se mantienen hasta 1800** la margen izquierda del Rin, ocupada desde 1794 y organizada en departamentos en 1798, porque el Imperio no la cede hasta Lunéville, el 9 de febrero de 1801 ([HLB, fin del Antiguo Imperio](https://www.historisches-lexikon-bayerns.de/Lexikon/Ende_des_Alten_Reiches)), y el Piamonte, ocupado en 1798 y 1800 pero anexionado solo en 1802.

### Correcciones de 1512–1792

La ampliación corrige tres errores demostrables del intervalo anterior:

1. **1651–1792**: a partir de 1651 el marco se calculaba con la ruta genérica de gobiernos, que descarta las celdas reclamadas por una revisión política regional. Pasaba de 807 celdas en 1650 a 263 en 1651 y perdía Colonia, Fráncfort, Hamburgo, Núremberg, Bruselas, Milán, Turín, Innsbruck, Salzburgo o Maguncia sin ningún cambio histórico. Ahora el marco tiene unas 770–790 celdas y no pierde ninguna de las que pintaba.
2. **1648–1792**: Güeldres, Kempenland, Breda, Bergen op Zoom y Schaffhausen salen con la República neerlandesa y la Confederación; las cesiones a Francia de 1659–1766 y Venlo (1713) salen en sus fechas.
3. **1443–1792**: el ducado de Siewierz deja de pintarse como Silesia imperial.

La capa «Marco jurídico del Sacro Imperio» de `corridor-locations.json` sigue siendo la instantánea aceptada de 1512 y 1648, y `corridor-source.mjs` la reproduce sin cambios; ya no se usa para dibujar ni para el inspector. El inspector del mapa muestra el marco cuando la celda pertenece a él, con la referencia del periodo.

### Límites conocidos

- Faltan celdas sin región antigua equivalente: el ducado de Lorena y el Barrois, Toul y Verdún, el principado episcopal de Trento, Liguria, Lucca y el enclave de Montbéliard después de 1678.
- Se omiten por prudencia los polígonos de estatuto mixto o discutido: Flandes y Artois, Cambrai, Toscana, Romaña, Bolonia y Ferrara, Bresse, Bugey y Gex, Niza, el Vivarais y el Forez.
- Quedan dentro, como casos mixtos, Rovegno (valle genovés en la región de Alessandria), la vertiente veneciana de los Alpes Julianos, Bouillon después de 1678 y el condominio de Maastricht.
- Teltow y Barnim entran en 1181 con el resto de la Mittelmark; la frontera exacta de la Ostsiedlung no se reconstruye año a año.

## Austria, archiducado y ramas

«Austria» colorea ahora **Austria sobre y bajo el Enns**, representada por `Unter_dem_Manhartsberg`, `Ober_dem_Manhartsberg`, `Ober_dem_Wienerwald`, `Unter_dem_Wienerwald`, `Traungau` y `Muhlviertel`. `Salzburger_Land` ya no aparece como si fuera parte del archiducado. «Austria Interior» reúne los polígonos de Estiria, Carintia y Carniola; `Gorizia` entra desde 1500. «Tirol» se dibuja aparte con `Oberinntal`, `Unterinntal` y `South_Tirol`. Estos son **aproximaciones regionales**: la geometría no resuelve todas las jurisdicciones compartidas ni las posesiones dispersas.

El título de archiduque fue impulsado mediante el *Privilegium maius* de Rodolfo IV en 1358/59 y [confirmado por Federico III en 1453](https://www.habsburger.net/en/chapter/almost-crown-austrian-archducal-coronet); el cambio de rango no absorbió automáticamente otros ducados y condados. La [partición de Neuberg de 1379](https://www.habsburger.net/en/chapter/albrecht-iii-and-nascent-land-austria) separó Austria danubiana de Estiria, Carintia, Carniola, Tirol y los dominios occidentales. [Maximiliano recibió Tirol de Segismundo](https://www.habsburger.net/en/chapter/last-knight-maximilian-i). Carlos V heredó las tierras austríacas de Maximiliano y [cedió Austria y Austria Interior a Fernando en 1521, y Tirol en 1522](https://www.habsburger.net/en/chapter/ferdinand-i-overshadowed-his-elder-brother).

Tras la [partición de 1564](https://www.habsburger.net/en/chapter/tripartite-division-austrian-inheritance), Maximiliano II gobernó Austria danubiana, Fernando II de Tirol gobernó Tirol y Carlos II gobernó Austria Interior. La rama de Graz reunió Austria Interior con las tierras danubianas en 1619; Tirol siguió separado hasta 1665. El mapa agrupa en un mismo tono solo los gobiernos austríacos que **la persona consultada** ejercía simultáneamente. Bohemia y Hungría conservan sus propios colores; la administración austro-bohemia se identifica desde las reformas de 1749 y el título de emperador de Austria no aparece antes de 1804.

La [revisión V4.7](versiones/V4.7.md) completa la secuencia de Tirol entre 1595 y 1665. El inspector del mapa separa titular, gobernador y regente; los solapamientos de esos cargos no significan que hubiera varios soberanos independientes. El grupo «Sacro Imperio» de los filtros es una ayuda de navegación, no una prueba de pertenencia jurídica fechada. Los círculos imperiales y las tierras gobernadas por los Habsburgo son relaciones distintas.

## Trabajo cartográfico pendiente

La siguiente revisión debe añadir las celdas sin región antigua (Lorena, Trento, Liguria) con fuentes por feudo y contrastar las zonas mixtas de Flandes, Artois y los feudos italianos. También conviene sustituir la instantánea del corredor por `imperialFrameIds` cuando se regenere `corridor-locations.json`, y fechar por separado las etapas de 1143, 1157 y 1167 al este del Elba. No se deben rellenar lagunas con un nombre parecido del SVG: `Zealand` sigue siendo la isla danesa, no Zelanda neerlandesa.
