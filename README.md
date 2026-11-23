# El Árbol de Europa

Atlas histórico y genealógico para explorar personas, dinastías, territorios y sus conexiones familiares.

- [Web](https://www.treeofeurope.eu/es/) · Versión del repositorio: **6.1.3**
- [Notas de 6.1.3](docs/releases/6.1.3.md) · [Documentación e historial](docs/README.md) · [Publicación en Cloudflare](docs/CLOUDFLARE.md) · [Seguridad](SECURITY.md)

La versión 6.1.3 amplía la base a 2 865 personas. Entran 51 figuras de la
cultura, la ciencia, la Escuela de Salamanca, las revoluciones y la
exploración, y se completan cinco que ya estaban. Todas tienen retrato
(salvo dos de las que no se conserva ninguno), ficha en español y en inglés,
biografía, minibiografía y fechas contrastadas con su ficha de autoridad.
Además, se publican seis historias nuevas, entre ellas la colección
«Compañías libres».
La web se publica en Cloudflare (Workers con Static Assets, plan gratuito).

El mapa utiliza EU V Locations con superficies fechadas y fuentes consultables
en el inspector. Distingue soberanía, gobierno delegado, titularidad y control
disputado. Las correspondencias geométricas aproximadas y los huecos pendientes
conservan sus límites documentales. El [laboratorio cartográfico](labs/cartography/README.md)
permite revisar todas las entidades registradas por año. La investigación
histórica continúa; cerrar la migración de V5 no certifica todas las fronteras.

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

El build valida los contratos, audita los datos, regenera los catálogos y sitemaps, compila con Vite y produce las fichas HTML. Después compara los datos, los mapas anuales y las páginas con la base revisada de V5. El resultado publicable queda en `dist/`. No edites los derivados para cambiar contenido: `src/generated/`, los metadatos públicos y ambos sitemaps se regeneran desde las fuentes. Los cambios históricos intencionados siguen el [procedimiento de actualización de la base](docs/v5-regression.md#cambios-intencionados).

Para trabajar en la interfaz, `npm run dev` prepara los datos automáticamente antes de iniciar Vite. `npm run preview` sirve una compilación ya creada. Las comprobaciones automáticas no inician un servidor.

La [guía de herramientas](scripts/README.md) recoge las rutas y comandos actuales. Python se usa únicamente para regenerar cartografía: su [entorno aislado](docs/python-cartography.md) fija versión, dependencias y hashes y compara inventarios sin sobrescribir el mapa. La [clasificación de archivos](docs/artifacts.md) indica cuáles son fuentes, resultados aceptados o temporales; los informes nuevos se guardan en `.cache/audits/`.

Las variables opcionales se documentan en `env.example`. `VITE_SITE_URL` debe ser un origen HTTP(S), sin ruta ni parámetros; si está vacío se usa `https://www.treeofeurope.eu`. Las variables `VITE_*` se publican en el navegador y nunca deben contener secretos.

## Estructura

| Contenido o función | Ubicación |
| --- | --- |
| Personas, filiaciones y gobiernos | `src/data/personas.js` |
| Evidencia por afirmación y revisiones editoriales | `src/evidence/` |
| Minibiografías | `src/content/personas/` |
| Territorios y filtros | `src/data/territorios.js`, `src/domain/government/reigns.js`, `src/domain/filters/` |
| Mapa EU V Locations, correspondencias y capas territoriales fechadas | `data/cartography/`, `src/cartography/` (`locationMapPilot.js`, `kingdomMaps.js`, `regions/`), `docs/CARTOGRAFIA_IBERIA_ITALIA.md`, `docs/CARTOGRAFIA_BORGONA.md`, `docs/CARTOGRAFIA_IRLANDA.md` |
| Historias de casas y territorios | `src/content/dinastias/`, `src/content/territorios/` |
| Sucesiones y títulos explicados | `src/content/sucesiones/`, `src/content/coronas/` |
| Bibliografía compartida | `src/content/sources.js` |
| Nombre y dominio | `src/app/siteConfig.js` |
| Lógica sin interfaz (genealogía, gobiernos, filtros, tiempo) | `src/domain/` |
| Fichas públicas y rutas | `src/features/public/`, `src/app/routing.js` |
| Atlas, conexiones y exportación | `src/features/atlas/` (vistas en `view/`), `src/features/connections/` |
| Desafíos | `src/features/desafio/` |
| Medición de rendimiento | `src/app/monitoring.js`, inicializada desde `src/app/main.jsx` |
| Generación y auditoría del HTML | `scripts/generate/prerender-ssg.mjs`, `scripts/audits/audit-ssg.mjs` |
| Seguridad y pruebas | `scripts/audits/audit-security.mjs`, `tests/` |
| Herramientas e instalación cartográfica | `scripts/`, `.python-version`, `scripts/cartography/requirements.lock` |
| Clasificación y resultados revisados | `docs/artifacts.md`, `docs/artifact-catalog.json`, `docs/reports/reviewed/` |

Los [criterios de contenido](docs/README.md#criterios-de-contenido) explican títulos, agrupaciones, incertidumbre y fuentes. Mantén estables los identificadores, slugs y claves de almacenamiento de los visitantes.

## Publicación

El [índice cronológico y procedimiento de Releases](docs/releases.md) enlaza
las entregas V5 y explica cómo fijar cada publicación a su commit validado.


Cada actualización se prepara en una rama y se entrega mediante **pull request hacia `main`**. La rama exige el check **Tests y build**, sin requerir un revisor adicional para el mantenimiento individual. GitHub Actions ejecuta auditoría de seguridad, pruebas, build e hidratación de una muestra de fichas. Los avisos de dependencias y la protección de secretos se gestionan también en GitHub.

La web se publica en **Cloudflare** (Workers con Static Assets), con los dominios `treeofeurope.eu` y `www.treeofeurope.eu`. `npm run build:cloudflare` compila, prerenderiza, audita y empaqueta el sitio en `.cloudflare/assets`; `npm run deploy:cloudflare:production` lo publica. Si el repositorio define la variable `CLOUDFLARE_DEPLOY=true` y los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`, el flujo `Despliegue en Cloudflare` lo hace al fusionar en `main`. Las redirecciones, reescrituras y cabeceras están en `routes.json`, que también lee el Worker. Los límites gratuitos, las comprobaciones y el estado del dominio están en [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md).

La audiencia se mide con Cloudflare Web Analytics, sin cookies ni identificadores; la [política de privacidad](https://www.treeofeurope.eu/es/privacidad) lo explica.

El ZIP complementario contiene solo archivos añadidos o modificados. Si una actualización elimina o mueve archivos, su documento de versión indica las rutas afectadas. No subas `node_modules/`, `dist/` ni datos regenerables como código fuente.

## Indexación y derechos

Las historias, sus capítulos y las fichas individuales se publican con contenido y metadatos en el HTML inicial. El Atlas, los desafíos, los catálogos y las portadas conservan su arranque dinámico; las fichas públicas prerenderizadas cargan módulos según su tipo. `sitemap.xml` y `sitemap-full.xml` se generan con las mismas rutas y ambas URL siguen disponibles. La indexación se supervisa en Google Search Console.

El código y los contenidos originales conservan **todos los derechos reservados**: [COPYRIGHT.md](COPYRIGHT.md). Las imágenes, la cartografía y otros materiales de terceros conservan sus atribuciones y condiciones.
