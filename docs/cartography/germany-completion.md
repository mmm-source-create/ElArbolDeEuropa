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
