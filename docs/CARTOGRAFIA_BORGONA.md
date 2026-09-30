# Borgoña: sucesión, geometría y límites del mapa

La V4.3 deja de tratar «Borgoña» como el dibujo de todo un Estado. El **ducado** francés se aproxima con `Dijonnais` y `Autunnais`; el **condado** imperial o Franco Condado se aproxima por separado con `Aval`, `Millieu` y `Amont`. Un mismo tono borgoña identifica los feudos de esta herencia al seleccionar a sus protagonistas, sin añadir contornos internos a las regiones coloreadas. El color no convierte esos feudos en un Estado unitario ni prueba soberanía plena. Fuera de esa secuencia, los territorios conservan su propia paleta. Milán, los reinos hispánicos y Austria de Carlos V no reciben el tono borgoñón.

## Secuencia que debe poder recorrerse

| Año | Personas y cambio | Qué debe aparecer |
| ---: | --- | --- |
| 1361–1363 | Margarita de Francia posee Artois y el Franco Condado; Felipe el Atrevido recibe el ducado de Dijon en 1363. | Entidades separadas, según la persona seleccionada. |
| 1382–1384 | Luis de Male reúne Artois y el Franco Condado con Flandes, Nevers y Rethel. Margarita III hereda los cinco títulos en 1384; Felipe gobierna en derecho de ella. | El ducado de Felipe no se expande retrospectivamente antes de 1384. |
| 1384–1406 | Nevers se asigna a Juan sin Miedo, y Rethel a Antonio en 1393. Al heredar el ducado en 1404, Juan cede Nevers a su hermano Felipe; este recibe también Rethel en 1406. | Los títulos que Margarita conserva no se confunden con el gobierno en apanage. Ninguno de ambos condados pasa por esta vía a Carlos el Temerario. |
| 1421/1429 | Juan III vende el derecho sucesorio de Namur en 1421, pero conserva el usufructo. Felipe el Bueno toma posesión en 1429. | Namur entra en 1429, no en 1421. |
| 1428/1433 | El acuerdo de Delft da a Felipe el Bueno un gobierno de regencia en Holanda, Henao y Zelanda; Jacoba renuncia definitivamente en 1433. | El panel distingue regencia de título condal; Zelanda carece de polígono propio. |
| 1430 | Muere Felipe de Saint-Pol, sucesor de Antonio y Juan IV en Brabante y Limburgo. | Los dos ducados pasan a Felipe el Bueno. |
| 1435 | Arrás cede Auxerre y Ponthieu a Felipe el Bueno. | Se colorean los condados regionales, no todas las ciudades del Somme. |
| 1441/1443 | Isabel de Görlitz vende derechos sobre Luxemburgo en 1441; Felipe toma la ciudad en 1443. | Luxemburgo se añade en 1443; algunas autoridades fechan la dignidad ducal en 1444. |
| 1473–1477 | Carlos el Temerario incorpora Güeldres en 1473 y muere en 1477. | Güeldres aparece solo en esos últimos años; Liège, Lorena y Alsacia no se incluyen como herencia estable. |
| 1477–1493 | Francia toma el ducado y disputa Artois y el Franco Condado; María mantiene otros territorios. Senlis restituye Artois y el Franco Condado a la casa de Austria en 1493. | María y Felipe el Hermoso no colorean el ducado francés por un título reclamado. |
| 1506–1555 | Carlos V hereda el patrimonio neerlandés y adquiere más provincias en distintas fechas. | Un tono compartido solo para los componentes borgoñones; sus otros gobiernos conservan colores propios. |

Las fechas anuales no expresan un cambio simultáneo el 1 de enero. En 1477, por ejemplo, la muerte del duque, las campañas francesas y las decisiones de las provincias no ocurrieron en un instante. El mapa omite reclamaciones y no reconstruye frentes militares día a día.

## Auditoría de las 100 etiquetas SVG proporcionadas

Todas las etiquetas de la lista recibida existen en `MapChart_Map.svg`. El Atlas usa estas asociaciones **solo cuando hay un gobierno individual fechado**:

| Entidad histórica | Etiquetas usadas | Decisión |
| --- | --- | --- |
| Ducado de Borgoña | `Dijonnais`, `Autunnais` | Núcleo ducal; no incluir Nevers, Auxerre ni el Franco Condado como si fueran el ducado. |
| Condado de Borgoña | `Aval`, `Millieu`, `Amont` | Feudo imperial distinto. |
| Flandes | `West_Flanders`, `East_Flanders`, `Roman_Flanders` | La última región representa una zona romance del condado; su deslinde es aproximado. |
| Artois | `Upper_Artois`, `Lower_Artois` | Condado propio, aunque vasallo de la Corona francesa. |
| Nevers y Rethel | `Nevernais`, `Rethelois` | Apanages de los hijos de Margarita y Felipe; después de 1404–1406, sucesión de la rama menor. |
| Auxerre y Ponthieu | `Auxerrois`, `Ponthieu` | Condados cedidos en 1435, recuperados por Francia tras 1477. |
| Namur y Luxemburgo | `Namur`; `West_Luxembourg`, `East_Luxembourg` | Adquisiciones distintas de 1429 y 1443. |
| Brabante y Limburgo | `Brabant`, `Antwerp`, `Kempenland`; `Limburg` | `Kempenland` se añade porque pertenecía a la Meierij de 's-Hertogenbosch de Brabante. La región de Limburgo del SVG no es un deslinde exacto del ducado medieval. |
| Holanda y Henao | `North_Holland`, `South_Holland`; `Hainaut` | Regencia de 1428 y sucesión titular de 1433 no son idénticas. |
| Incorporaciones posteriores | `Gelderland`, `Friesland`, `Overijssel`, `Drenthe`, `Ommelanden` | Solo a partir del acceso de cada gobernante. `Ommelanden` no representa toda Groninga. |

**No se colorean por la mera etiqueta «Borgoña»**: `Amienois`, `Vermandois` (la cesión afectó a ciudades concretas, no necesariamente a cada polígono entero); `Liege`, `Loon` (principado episcopal y su condado, fuera de la sucesión hereditaria); `Upper_Alsace` (prenda temporal), `Pays_Nancy`, `Pays_Messin`, `Verdunois`, `Barrois`, `Vosges` (campañas y ocupaciones de Lorena no son herencia); `Niederrhein`, `East_Friesland`, `Emsland`, `Munsterland`, `Ruhr`, `Julich`, `Koln_Bucht`, `Bergisches_Land` (otros poderes del Rin y el norte). Las ciudades del Somme, Malinas, Zelanda, Utrecht, Zutphen, Mâcon y Bar-sur-Seine no tienen aquí una geometría que las aísle de forma fiable.

Los restantes topónimos de la lista pertenecen a otras regiones francesas, imperiales, saboyanas o suizas; no se añaden por proximidad: `Caux`, `Thierache`, `Soissonais`, `Remois`, `Sarregueminois`, `Lower_Alsace`, `Rhine_Valley`, `Schwarzwald`, `Neckar`, `Kraichgau`, `Palatinate`, `Hunsruck`, `Eifel`, `Westerwald`, `Taunus`, `Untermain`, `Odenwald`, `Swabian_Alb`, `Hegau`, `Bassigny`, `Perthois`, `Senonais`, `Champagne`, `Brie_Champenois`, `Beauvaisis`, `Rouennais`, `Neuchatel`, `Vaud`, `Bresse`, `Beaujolais`, `Viennois`, `Lyonnais`, `Orleanais`, `Upper_Berry`, `Gatinais`, `Pays_France`, `Chartrain`, `Savoy`, `Gresivaudan`, `Dignois`, `Avignonnais`, `Dracenois`, `Aquisextain`, `Valentinois`, `Vivarais`, `Nimois`, `Gevaudan`, `Lower_Auvergne`, `Bourbon`, `Combraille`, `Upper_Auvergne`, `Turenne`, `Nice`.

El SVG regional no equivale a una cartografía histórica de límites exactos. La siguiente mejora cartográfica sustantiva exige geometrías fechadas y citadas por feudo, con tratamiento explícito de ciudades y enclaves; añadir más etiquetas del mapa actual crearía una falsa precisión.

## Fuentes de las decisiones

- [BnF, Margarita III y los cinco condados](https://catalogue.bnf.fr/ark:/12148/cb16161030k); [Biblissima/BnF, Luis de Male](https://portail.biblissima.fr/ark:/43093/pdata72015d9dbbe4171cc1369eb56e627ee49a8ef9de); [Metropolitan Museum, formación del dominio borgoñón](https://www.metmuseum.org/fr/essays/burgundian-netherlands-court-life-and-patronage).
- [Biblissima/BnF, títulos de Felipe el Bueno](https://portail.biblissima.fr/fr/ark:/43093/pdata71295e340f36a2c35285ffc09fff863e1dd66edb); [Connaître la Wallonie, posesión de Namur](https://connaitrelawallonie.wallonie.be/histoire/timeline/13-mars-1429-entree-de-philippe-de-bourgogne-namur); [Gobierno de Luxemburgo, venta y toma de la ciudad](https://luxembourg.public.lu/en/society-and-culture/history/helm-holy-roman-empire.html); [Canon van Nederland, Jacoba de Baviera](https://www.canonvannederland.nl/nl/page/439262/jacoba-van-beieren).
- [Cambridge University Press, Ponthieu y ciudades del Somme](https://www.cambridge.org/core/books/abs/war-and-government-in-the-french-provinces/return-to-allegiance-picardy-and-the-francoburgundian-wars-147093/C99410404ADED4EF0ABA86A39803BC3C); [BnF Gallica, Auxerre y Arrás](https://gallica.bnf.fr/ark:/12148/bpt6k947101.pdf); [Library of Congress, mapa histórico de Brabante](https://www.loc.gov/resource/gdcwdl.wdl_01102/); [Biblissima, Carlos de Nevers y Rethel](https://portail.biblissima.fr/fr/ark:/43093/pdata8ddd5493a80916491d6eb6a23bd52ecc916100d4).
- [Sigilla/IRHT, Juan sin Miedo como conde de Nevers](https://sigilla.irht.cnrs.fr/A.php/41813); [Sigilla/IRHT, Felipe de Nevers y Rethel](https://sigilla.irht.cnrs.fr/44802); [Université de Liège, Rethel concedido a Antonio en 1393](https://orbi.uliege.be/bitstream/2268/247248/1/Trulla%20et%20Cartae.pdf).
