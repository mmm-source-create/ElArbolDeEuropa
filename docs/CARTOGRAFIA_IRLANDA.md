# Cartografía de Irlanda: correspondencias y cautelas

La V4.2 hace visibles en el Atlas las entidades irlandesas ya registradas. Usa regiones del SVG existente para situar señoríos y condados; **no** presenta esas regiones como fronteras políticas exactas de cada año. La cartografía de la isla entre los siglos XII y XVII incluye jurisdicciones superpuestas, poderes locales y límites móviles. El título inglés de rey de Irlanda desde 1542 no equivale a un dominio efectivo de toda la isla en esa fecha.

| Entidad de la base | Zona representada en el SVG | Interpretación |
| --- | --- | --- |
| Tír Eoghain / condado de Tyrone | Tyrone | Aproximación al núcleo O’Neill; el condado y el señorío gaélico conservan fichas distintas. |
| Tír Chonaill / condado de Tyrconnell | Donegal | Aproximación al núcleo O’Donnell, sin identificarlo con el condado moderno. |
| Thomond / condado de Thomond | Clare | Zona central de los O’Brien; 1543 introduce una dignidad distinta. |
| Desmond / condado de Clancare | Desmond | Aproximación del poder MacCarthy; no equivale al condado Fitzgerald. |
| Condado de Desmond | Limerick | Muestra solo una zona de la influencia Fitzgerald; no traza el conjunto de sus posesiones. |
| Connacht, Leinster, Ulster y otros condados | Regiones del mismo nombre o cercanas | Lectura orientativa: ninguno de los títulos prueba control uniforme de toda una provincia. |
| Reino de Irlanda, 1542–1602 | Dublin, Meath y Kildare | Representación deliberadamente conservadora del núcleo de gobierno inglés anterior a la conquista del resto de la isla. Omite extensiones y enclaves dispersos. |
| Reino de Irlanda, desde 1603 | Isla completa | Esquema de la nueva autoridad regia sobre la isla tras la conquista Tudor, no mapa de control local continuo ni de las rebeliones posteriores. |

El visor colorea solamente los gobiernos marcados como efectivos y vigentes en el año elegido. Una pretensión, un título jacobita o una dignidad puramente nominal no pinta una región. Las unidades cartográficas no son polígonos nuevos dibujados a partir de condados actuales; son los `id` del mapa histórico ya utilizado por el proyecto. Para una publicación académica se necesitarían nuevas geometrías por periodo y fuentes locales comparables para cada señorío.

## Fuentes y trabajo pendiente

- [Cambridge University Press, mapa de Irlanda hacia 1530](https://assets.cambridge.org/97805210/89272/frontmatter/9780521089272_frontmatter.pdf): diferencia el Pale, señoríos gaélicos y señoríos angloirlandeses. Se usa como guía de localización, no como geometría reutilizada.
- [National Archives, mapas irlandeses c. 1558–1610](https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/irish-maps-c1558-c1610/): corpus de mapas de época y advertencia sobre su interpretación.
- [University College Cork, *The Desmond Survey*](https://celt.ucc.ie/published/E580000-001.html): evidencia de la complejidad territorial de Desmond y de la distinción entre los MacCarthy y los Fitzgerald.
- [*History Ireland*, sobre la implantación de condados y el gobierno efectivo después de 1603](https://historyireland.com/geographical-loyalty-counties-palatinates-boroughs-and-ridings/): contexto para el corte temporal usado en la vista general de la Corona.

Pendiente: desglosar el Pale y los enclaves regios fuera de él por decenios; cotejar dominios concretos de las ramas Burke, Butler y Fitzgerald; revisar las sucesiones durante las rebeliones de los siglos XVI–XVII; y sustituir las aproximaciones regionales por fronteras digitalizadas con fecha y procedencia verificables. Hasta entonces la interfaz muestra un aviso de precisión junto al mapa al seleccionar una persona vinculada con Irlanda.
