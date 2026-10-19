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
