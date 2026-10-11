# Contraste de superficies · 11 de octubre de 2026

El HTML «Imperios y reinos de Europa, 1200–1800.claude.14.html» se usa como
referencia visual para localizar huecos. Sus colores no prueban soberanía:
separan mal algunos dominios directos y tributarios y no conservan siempre
las mismas entidades históricas. Se han leído sus datos sin ejecutar su código.

El cruce inicial identifica **2.497 polígonos** que la referencia colorea en
algún corte y que nuestra auditoría anterior nunca coloreaba entre 1200 y
1800. Incluye superficies asiáticas y africanas de la extensión del SVG:
no equivale a 2.497 territorios políticos europeos ausentes. Tampoco demuestra
que el color de la referencia sea correcto. La lista es una cola de investigación.

## Primera incorporación: 31 polígonos

| Superficie | Polígonos | Período añadido | Autoridad y límites |
| --- | ---: | --- | --- |
| Islandia | 26 | 1264–1800 | Corona noruega y después monarquía danesa y noruega; incluye tierras altas y glaciares. No se representa como una anexión súbita en 1262. |
| Buzet | 1 | 1421–1800 | Venecia hasta 1796; Austria desde 1797. Pazin queda separado. |
| Sur de Moldavia | 4 | 1457–1800 | Adjud, Bârlad, Târgu Trotuș y Tutova conservan autoridad principesca moldava; tributo no equivale a provincia otomana. |

Islandia conserva identidad y color propios en el laboratorio aunque cambie
el titular de la monarquía. Sus 26 superficies se añaden también a los
gobiernos noruegos de los personajes existentes. La fecha convencional de 1264
sigue la presentación del [Alþingi](https://www.althingi.is/pdf/enska.pdf);
la investigación de [Sverrir Jakobsson](https://iris.hi.is/en/publications/all-the-kings-men-the-incorporation-of-iceland-into-the-norwegian/)
matiza la transición y sitúa su culminación jurídica en Jónsbók, en 1281.
El período de la comunidad islandesa anterior queda pendiente.

El polígono Buzet ocupa el norte de la península de Istria. Su adscripción
veneciana arranca en 1421 según la [enciclopedia croata](https://enciklopedija.hr/clanak/buzet).
La [historia de Istria](https://www.enciklopedija.hr/clanak/istra-poluotok)
respalda la separación del condado de Pazin y el relevo austríaco de 1797.
Nuestro ID «Novigrad» está en Dalmacia: no se añade a Istria por coincidencia de nombre.

Los cuatro polígonos moldavos se han comprobado sobre el SVG: ocupan el
corredor Trotuș–Adjud y la comarca Bârlad–Tutova. Se mantienen dentro del
Principado de Moldavia y comparten su color. Las menciones documentales de
1401, 1408 y 1433 respaldan la adscripción, **no son fechas de adquisición ni
de nacimiento territorial**. La ampliación se limita por ahora a 1457–1800;
la partición de 1435 necesita una selección meridional específica antes de
ampliar los cortes anteriores. Tutova se interpreta como comarca histórica,
no como la aldea moderna homónima. No se recuperan los puertos perdidos en
1484, Tighina en 1538 ni Bucovina en 1775.

Las fuentes moldavas son las historias oficiales de
[Bârlad](https://primariabarlad.ro/barlad/cultura/istoria-orasului/),
[Adjud](https://www.adjud.ro/municipiul-adjud/despre-adjud/monografia-localitatii/)
y [Târgu Trotuș](https://primariatgtrotus.ro/wp-content/uploads/2023/08/Memoriu-Targu-Trotus.pdf),
junto con *Acta Moldaviae Meridionalis* XLI (2020), p.44, para el distrito de Tutova.
Las citas, períodos y límites están disponibles en el inspector del mapa.

## Siguiente revisión

Quedan 2.466 candidatos del cruce inicial sin incorporar. Se priorizan las
superficies intermedias de Moldavia y Valaquia, los tramos carpáticos y
dináricos, Schleswig y el Báltico. Hangu, Vatra Dornei y varios polígonos de
cordillera atraviesan ámbitos donde cambian las fronteras: necesitan revisar
su forma completa y los acuerdos de 1718, 1739 y 1775. No se rellenan por
proximidad ni por el nombre de su cabecera.

## Reproducción y validación

La fuente editable es `prototypes/euv-locations/reference-gap-review.json`.
`merge-map-expansions.mjs` la integra sin sustituir las selecciones previas.
Las rutas de `referenceGapRoutes.js` abastecen el mapa personal y el
laboratorio, y `territorialIdentity.js` conserva colores e identidades.

Las nuevas mediciones se toman del inventario SVG completo, ya calculado
con el mismo muestreo de curvas y en las mismas unidades que la auditoría
regional. Las 31 celdas están enteramente dentro del encuadre. El generador
geométrico incluye estas capas al reconstruir el inventario regional.

La regresión comprueba autoridad personal, fuentes, límites temporales,
ausencia de soberanía otomana directa en esas cuatro celdas moldavas,
relevo veneciano/austríaco sin huecos y estabilidad de los datos regenerados.
