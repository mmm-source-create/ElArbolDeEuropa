# El Árbol de Europa

Atlas histórico y genealógico para explorar personas, dinastías, territorios y sus conexiones familiares.

- [Web](https://www.treeofeurope.eu/es/) · Versión del repositorio: **V4.8**
- [Cambios de V4.8](docs/V4.8.md) · [Documentación e historial](docs/README.md) · [Próximos pasos cartográficos](docs/V4.8_PROPUESTAS.md) · [Seguridad](SECURITY.md)

El [laboratorio paralelo EU V Locations](prototypes/euv-locations/README.md) compara el mapa actual de Provinces con una exportación recortada a Europa–Urales, norte de África y Oriente Próximo. Incluye un [ensayo fechado de los dominios de Carlos V](prototypes/euv-locations/carlos-v.html) y una [cronología interactiva de la sucesión borgoñona, 1419–1555](prototypes/euv-locations/burgundian-succession.html), con correspondencias geométricas, correcciones históricas documentadas y dudas explícitas. Son prototipos de investigación: el Atlas público conserva su cartografía y sus correspondencias territoriales mientras se revisan las nuevas.

La V4.8 revisa Baviera y sus particiones, completa la secuencia del Palatinado electoral y separa Pfalz-Neuburg. La herencia Jülich–Cléveris–Berg–Mark–Ravensberg muestra la unión de 1511/1521 y el reparto de 1614; el mapa usa solo los polígonos que puede atribuir prudentemente. Francia deja de absorber Artois y Flandes antes de tiempo. La [revisión y sus límites](docs/V4.8.md) explican por qué Mark, Ravensberg y varios tramos de Flandes no se colorean como si el SVG contuviera fronteras feudales exactas.

La V4.7 completa la sucesión de Tirol entre 1595 y 1665 separando autoridad familiar, gobierno delegado, regencia y titularidad. Pulsar una región del mapa abre un inspector con la entidad, su gobernante registrado para el año, el título, la fuente individual y el límite de precisión cartográfica. La nueva auditoría señala años sin autoridad, solapamientos inexplicados y gobiernos que colorean regiones sin fuente específica; [su informe](docs/V4.7.md) delimita el alcance de los hallazgos. Los filtros explican por qué territorio imperial, círculo imperial y gobierno Habsburgo son relaciones distintas.

La V4.6 abre el mapa directamente sobre Europa, compacta el filtro de evidencia y la biografía, y separa Austria danubiana, Austria Interior y Tirol con gobiernos fechados. Cuando se consulta a un emperador entre 1512 y 1792, un marco gris identifica una aproximación al ámbito jurídico del Sacro Imperio sin confundirlo con sus posesiones personales. El cambio de 1648 distingue los Países Bajos meridionales de la República neerlandesa y retira Suiza. La [revisión cartográfica del Imperio](docs/CARTOGRAFIA_SACRO_IMPERIO.md) documenta fuentes, exclusiones y zonas aún pendientes.

La V4.5 convirtió las pestañas de biografía en un índice de secciones siempre visibles, acercó personas coetáneas en el árbol y mejoró el borrado de filtros. Completó la secuencia de dogos venecianos entre 1400 y 1605, amplió dos ramas Pignatelli y añadió auditorías de cartografía y dogado. Su documentación de las [reformas de 1749](docs/V4.5.md) sigue vigente; los botones de encuadre mundial introducidos entonces se retiraron en V4.6.

La V4.4 revisa la coherencia territorial de Iberia e Italia: separa los reinos y condados de las coronas compuestas, fecha conquistas y cambios de posesión, y completa la sucesión italiana de 1700 a 1759. Esta revisión amplía las regiones documentadas de Venecia, Milán, Saboya, Piamonte y los Estados Pontificios, añade una muestra de dogos venecianos y hace que el color responda al conjunto político y al año, no a todos los títulos de un soberano. Los filtros muestran la jerarquía España → coronas → reinos, reúnen la herencia borgoñona y las incorporaciones neerlandesas del siglo XVI, y corrigen su contraste en oscuro. Prusia utiliza el azul de los Hohenzollern también en su filtro. La [auditoría de España, Portugal e Italia](docs/CARTOGRAFIA_IBERIA_ITALIA.md) explica las decisiones y los límites del mapa regional. La [secuencia de la herencia borgoñona](docs/CARTOGRAFIA_BORGONA.md) de V4.3 conserva sus delimitaciones y su color propio bajo Carlos V y Felipe II.

La [revisión cartográfica anterior](docs/REVISION_BORGONA.md) corrigió el error de `Zealand`: ese identificador pertenece a la isla danesa cercana a Copenhague, no a Zelanda neerlandesa. La nueva auditoría contrasta las cien etiquetas regionales propuestas; Utrecht, Zelanda y varias ciudades y enclaves permanecen sin color porque el SVG no los delimita. Las [fronteras irlandesas](docs/CARTOGRAFIA_IRLANDA.md) también siguen siendo aproximaciones regionales.

## Recorrer el proyecto

La [portada](https://www.treeofeurope.eu/es/) ofrece entradas al Atlas, las historias guiadas y las fichas. En el Atlas, busca una persona para ver su árbol, biografía, cronología y territorios vinculados; el año global limita el mapa a los gobiernos registrados entonces. Las fichas de [dinastías](https://www.treeofeurope.eu/es/dinastias) y [territorios](https://www.treeofeurope.eu/es/territorios) explican las conexiones históricas. La [guía de uso](docs/ATLAS.md) recoge las funciones y sus controles.

El panel de evidencia distingue afirmaciones documentadas, aproximadas, discutidas, inferidas y pendientes de revisión. El filtro **Con datos documentados** selecciona personas con *al menos una* afirmación individual citada; no certifica toda su ficha. La bibliografía de contexto tampoco demuestra por sí sola cada parentesco o fecha. Las correcciones pueden enviarse a [info@treeofeurope.eu](mailto:info@treeofeurope.eu) indicando el dato, la fuente y el pasaje correspondiente.

## Instalación y validación

Necesitas **Node.js 24** y npm. `.nvmrc` fija la versión principal; las dependencias directas tienen versiones exactas y `package-lock.json` fija el resto.

```sh
npm ci
npm test
npm run audit:security
npm run build
```

El build audita los datos, regenera los catálogos y sitemaps, compila con Vite y produce las fichas HTML. El resultado publicable queda en `dist/`. No edites los derivados para cambiar contenido: `src/generated/`, los metadatos públicos y ambos sitemaps se regeneran desde las fuentes.

Para trabajar en la interfaz, `npm run dev` prepara los datos automáticamente antes de iniciar Vite. `npm run preview` sirve una compilación ya creada. Las comprobaciones automáticas no inician un servidor.

Las variables opcionales se documentan en `env.example`. `VITE_SITE_URL` debe ser un origen HTTP(S), sin ruta ni parámetros; si está vacío se usa `https://www.treeofeurope.eu`. Las variables `VITE_*` se publican en el navegador y nunca deben contener secretos.

## Estructura

| Contenido o función | Ubicación |
| --- | --- |
| Personas, filiaciones y gobiernos | `src/personas.jsx` |
| Evidencia por afirmación y revisiones editoriales | `src/evidence/` |
| Minibiografías | `src/content/personas/` |
| Territorios y filtros | `src/data/territorios.js`, `src/Territorios.jsx` |
| Correspondencias de regiones del mapa | `src/Territorios.jsx`, `src/MapChart_Map.svg`, `docs/CARTOGRAFIA_IBERIA_ITALIA.md`, `docs/CARTOGRAFIA_BORGONA.md`, `docs/CARTOGRAFIA_IRLANDA.md` |
| Historias de casas y territorios | `src/content/dinastias/`, `src/content/territorios/` |
| Sucesiones y títulos explicados | `src/content/sucesiones/`, `src/content/coronas/` |
| Bibliografía compartida | `src/content/sources.js` |
| Nombre y dominio | `src/siteConfig.js` |
| Fichas públicas y rutas | `src/public/`, `src/routing.js` |
| Atlas, conexiones y exportación | `src/explorer/`, `src/connections/` |
| Desafíos | `src/desafio/` |
| Medición de rendimiento | `src/monitoring.js`, inicializada desde `src/main.jsx` |
| Generación y auditoría del HTML | `scripts/prerender-ssg.mjs`, `scripts/audit-ssg.mjs` |
| Seguridad y pruebas | `scripts/audit-security.mjs`, `tests/` |

Los [criterios de contenido](docs/README.md#criterios-de-contenido) explican títulos, agrupaciones, incertidumbre y fuentes. Mantén estables los identificadores, slugs y claves de almacenamiento de los visitantes.

## Publicación

Cada actualización se prepara en una rama y se entrega mediante **pull request hacia `main`**. La rama exige el check **Tests y build**, sin requerir un revisor adicional para el mantenimiento individual. GitHub Actions ejecuta auditoría de seguridad, pruebas, build e hidratación de una muestra de fichas. Los avisos de dependencias y la protección de secretos se gestionan también en GitHub.

Vercel compila con `npm run build`, Node 24 y directorio de salida `dist`. Las rutas y cabeceras están en `vercel.json`. La PR genera una vista previa; fusionarla actualiza la rama de producción según la integración existente.

El ZIP complementario contiene solo archivos añadidos o modificados. Si una actualización elimina o mueve archivos, su documento de versión indica las rutas afectadas. No subas `node_modules/`, `dist/` ni datos regenerables como código fuente.

## Indexación y derechos

Las historias, sus capítulos y las fichas individuales se publican con contenido y metadatos en el HTML inicial. El Atlas, los desafíos, los catálogos y las portadas conservan su arranque dinámico. `sitemap.xml` y `sitemap-full.xml` se generan con las mismas rutas y ambas URL siguen disponibles. La indexación se supervisa en Google Search Console.

El código y los contenidos originales conservan **todos los derechos reservados**: [COPYRIGHT.md](COPYRIGHT.md). Las imágenes, la cartografía y otros materiales de terceros conservan sus atribuciones y condiciones.
