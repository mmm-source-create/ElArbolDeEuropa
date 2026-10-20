# Alemania: intervalos vacíos, 1200–1800

La revisión completa **226.635 celdas-año** en **528 celdas**. La ventana geográfica independiente contiene **1.002 celdas**, comprobadas en los **601 años** de 1200 a 1800 inclusive: 602.202 combinaciones. Antes del cambio había 474 celdas completas, 267 con huecos parciales y 261 sin ningún año coloreado.

Los límites son las extensiones de las celdas Cochem (oeste), Ragnit (este), Ribe (norte) y St_Johann (sur). Esta última es la celda de **Pongau**, al sur de Salzburgo. La selección incluye todas las superficies visibles del SVG que intersectan el rectángulo, también los bordes y las celdas de relieve. No pretende definir una frontera política o nacional de Alemania. Bohemia, Austria, Polonia y los demás territorios ya representados conservan sus atribuciones.

## Fuente aceptada y conservación

`germany-completion-review.json` contiene 762 fases con intervalos, identificadores explícitos, notas y referencias locales. Incorpora 241 fichas de entidades y agrupaciones, incluida la Confederación Suiza, con historia y bibliografía. Las agrupaciones no son estados con un soberano común: por ejemplo, las jurisdicciones de una ciudad y su abadía o una familia de ducados piastas. No se añaden personas ni mandatos supuestos.

Cada fase es la intersección de una cronología territorial con un intervalo que estaba vacío. La precedencia se aplica exclusivamente a ese intervalo y esas celdas; no sustituye una región durante los 601 años. Los 375.567 celdas-año ya coloreados dentro de la ventana permanecen iguales. Las atribuciones anteriores, incluidas sus simplificaciones y sus solapamientos, quedan fuera de esta corrección.

`germany-completion-baseline.json` conserva los huecos y las identidades del mapa anterior, en el commit `e696f9ba84d4a1837cc63e7c642a4a5dd14a66e4`. Sus 601 huellas SHA-256 representan **todo el mapa**, no solo Alemania. La auditoría descuenta del mapa nuevo exclusivamente los huecos documentados y exige que cada huella restante coincida. Por tanto, una atribución nueva fuera del ámbito o un cambio en un territorio existente hacen fallar la comprobación.

## Lectura histórica

Se distingue Suabia ducal de las jurisdicciones posteriores a 1268; Hesse Ludowinger, la sucesión de 1247–1264, el landgraviato y sus ramas desde 1567; las comunidades prusianas anteriores a la conquista; el estado de la Orden y la secularización de 1525; ciudades, temporales episcopales, estados abaciales y dominios seculares. Los pactos suizos no se convierten en un estado unitario; los señoríos anteriores a las adhesiones siguen sus propias fases. Los enclaves de Salzburgo no se atribuyen a Baviera por su situación en el mapa moderno.

Se contrastan las síntesis del IEG (1378, 1500, 1648 y 1792), los atlas históricos de Baden-Württemberg, Hesse y Mecklemburgo, repertorios de archivos regionales, el HLS, el OME-Lexikon y cronologías municipales. Los cortes de un atlas documentan una situación, pero no bastan por sí solos para fechar una adquisición. Las fases que reúnen derechos coexistentes o una transición no resuelta a la escala de la celda lo indican en su identidad y su nota. Las fechas regionales convencionales no se presentan como el año exacto de conquista de cada parcela.

**La cobertura anual es completa; la geometría sigue siendo una síntesis regional.** Una celda indivisible puede contener jurisdicciones distintas, y un cambio durante un año puede reunir más de una situación. Esta revisión no acredita límites feudales exactos, población en las montañas, ni una sucesión personal completa de todos los titulares.

## Comprobación y mantenimiento

- Inventario espacial: `.venv-cartography/bin/python scripts/cartography/build-geographic-inventory.py germany-completion-geography.json germany-completion-geographic-cells.json`.
- Incorporación de la selección aceptada: `node scripts/cartography/merge-map-expansions.mjs`.
- Cobertura y conservación anual: `npm run audit:germany-completion` (incluido en `audit:build`).
- Pruebas: `tests/germany-completion.test.mjs`, además de la suite existente.

La auditoría valida primero que la unión de las fases sea exactamente el conjunto de huecos registrado: rechaza huecos de un año, duplicados, ampliaciones de ámbito y sustituciones de datos existentes. Después comprueba el mosaico real del atlas para los 601 años, la evidencia local de cada relleno y la conservación de todo el mapa previo. Los resultados se escriben en el directorio de informes de auditoría de la caché, sin convertirlos en una fuente histórica.

## Atribución a gobernantes documentados, 20 de octubre de 2026

Las fases de esta revisión nombran su jurisdicción, pero no su gobernante (`governmentTerritories` vacío). Por eso, en años como 1789, celdas de la Prusia Occidental, Tecklenburg, Lingen, la Altmark, la Pomerania de Brandeburgo, Mark o Ribe mostraban «Jurisdicción territorial documentada · pendiente de documentar» aunque el Atlas registra al rey o al elector correspondiente. En el panorama, además, esas celdas tomaban el color propio de la identidad (Brandeburgo en rojo pardo) en lugar del de la monarquía prusiana.

`germanyCompletionRoutes.js` enlaza ahora cada fase con el mandato que gobierna esa misma jurisdicción, sin tocar los datos aceptados:

- Por identidad exacta: una fase «Prusia» va al mandato «Prusia»; «Brandeburgo», «Sajonia», «Dinamarca», «Polonia» o «Bohemia», igual.
- Por una tabla fechada para las identidades que nombran a su titular: Pomerania de Brandeburgo, Cottbus y las Lusacias bajo Brandeburgo; Mark y Ravensberg con Brandeburgo solo desde 1609; Prusia de la Orden con el mandato «Prusia» hasta 1524; las Lusacias bajo Sajonia; Pomerania sueca, la ocupación sueca, Wismar y los ducados de Bremen-Verden (1648–1711) con Suecia; la administración danesa de Bremen-Verden y Rostock bajo Dinamarca; Prusia Real con Polonia.
- Solo cuando gobierna una única línea soberana sin ámbito parcial. Las particiones (Baviera hasta 1503, Württemberg, Mecklemburgo, Sajonia albertina y ernestina, Austria en 1458–1492), las corregencias y las ramas con `ambito` no reciben estas celdas: siguen como jurisdicción pendiente, sin duplicarlas entre varios duques. En un año de relevo las reciben el saliente y el entrante, como en el resto del mapa.

Las fases enlazadas son un complemento: si el gobierno todavía se dibuja con la equivalencia geométrica aproximada (Baviera en 1651–1745, Berg), la conservan y solo suman las celdas que la revisión rellenó. Una fase enlazada nunca convierte ese gobierno en «revisado» ni le retira celdas.

Resultado: 36.814 celdas-año dejan de figurar como pendientes y pasan a su gobernante documentado, sin nuevos solapamientos entre soberanos salvo los años de cambio de los reyes rivales de Polonia (1704 y 1709). La auditoría de esta revisión no cambia (0 celdas-año alteradas): las fases, sus fechas y sus fuentes son las mismas.

Siguen pendientes, por falta de mandatos en la base genealógica, entre otros: los electores de Baviera desde 1746 y del Palatinado desde 1717, los duques de Württemberg desde 1734, los landgraves de Hesse-Kassel desde 1731 y de Hesse-Darmstadt desde 1662, Mecklemburgo desde 1729, Baden desde 1739, Holstein-Gottorp desde 1740 y numerosos condados, ciudades y temporales eclesiásticos. Corregirlos exige añadir personas con fuente, no reasignar celdas.

## Gobernantes del siglo XVIII añadidos, 20 de octubre de 2026

Los mandatos que faltaban se añaden con fuente individual en `src/evidence/germanPrincesReviews.js` (Neue y Allgemeine Deutsche Biographie, Hessische Biografie, Dansk Biografisk Leksikon y Lex). Cada fecha, filiación y mandato nuevo tiene su revisión; la cobertura los enlaza sin cambiar fases ni celdas.

- Baviera y Palatinado: Maximiliano III José (1745–1777), Carlos III Felipe (Palatinado, Jülich y Berg, 1716–1742), Carlos Teodoro (Palatinado, Jülich y Berg desde 1742, Baviera desde 1777) y Maximiliano IV José (desde 1799).
- Württemberg: Carlos Alejandro (1733), Carlos Eugenio (1737, con las regencias hasta 1744), Luis Eugenio (1793), Federico Eugenio (1795) y Federico II, después rey Federico I (1797).
- Hesse-Kassel: Federico I de Suecia como landgrave (1730–1751), con su hermano Guillermo VIII como lugarteniente y regente; Guillermo VIII (1751), Federico II (1760) y Guillermo IX (1785).
- Hesse-Darmstadt: Luis VI (1661), Luis VII (abril–agosto de 1678), Ernesto Luis (1678, con regencia materna hasta 1688), Luis VIII (1739), Luis IX (1768) y Luis X (1790).
- Mecklemburgo-Schwerin: Federico Guillermo (1692), la suspensión de Carlos Leopoldo en 1728 (conserva el título), Cristián Luis II como regente durante esa suspensión, administrador y comisario imperial (1728–1747), y duque (1747), Federico (1756) y Federico Francisco I (1785).
- Baden: Carlos Federico (1738, bajo tutela hasta 1746; Baden-Baden desde 1771).
- Holstein: Carlos Pedro Ulrico (Pedro III) y Pablo como duques de la parte gottorpiana (1739–1773), limitados al núcleo de Kiel como sus predecesores; Cristián VII de Dinamarca como duque de todo Holstein desde el canje de 1773.
- Felipe V como duque, conde o señor de las ocho provincias de los Países Bajos españoles (1700–1711). Las fases del mapa ya marcan el control disputado desde la conquista aliada; Maximiliano II Manuel recibe la soberanía en junio de 1711.

El enlace de la cobertura cambia en tres puntos, todos con el mismo criterio de una sola línea de gobierno:

- La identidad «Mecklemburgo-Schwerin» se enlaza con los mandatos «Mecklemburgo», que la base usa para los duques de Schwerin.
- Un regente o administrador recibe las celdas solo en los años sin ningún titular soberano (Mecklemburgo en 1729–1746).
- Quien sucede y muere en el mismo año cuenta como un eslabón más del relevo, no como línea rival: Luis VII de Hesse-Darmstadt en 1678 y, con la misma regla, Federico Cristián de Sajonia en 1763 y los reyes de Bohemia de 1306.

Siguen pendientes, entre otros: las partes reales y de Plön de Holstein antes de 1773 (la fase reúne celdas de varios titulares y no se atribuyen a la rama de Gottorp); los Países Bajos españoles en 1712–1713 (soberanía de Maximiliano II Manuel en Namur y Luxemburgo y condominio aliado en el resto); Mecklemburgo-Schwerin en 1629–1630 y 1659–1691, la sucesión de Güstrow (1695–1700) y Mecklemburgo-Strelitz; Hesse-Kassel en 1664–1669; Schleswig, y los condados, ciudades y temporales eclesiásticos.
