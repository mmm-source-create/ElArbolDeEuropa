# El Árbol de Europa

Atlas histórico y genealógico para explorar personas, dinastías, territorios y sus conexiones familiares. Incluye fichas públicas, historias, cronología y desafíos.

- Web: [treeofeurope.eu](https://www.treeofeurope.eu/)
- Versión: **2.14 — Del Adriático al mar Negro**
- [Cambios y validación de esta versión](docs/V2.14.md)
- [Fuentes y metodología](https://www.treeofeurope.eu/es/fuentes)

## Empezar

Necesitas **Node.js 24** y npm. La versión principal de Node está en `.nvmrc`; las dependencias directas tienen versiones exactas y `package-lock.json` fija el resto.

```sh
npm ci
npm test
npm run build
```

`npm run build` ejecuta automáticamente `prebuild`: audita los datos y regenera índices, metadatos, fichas y sitemaps antes de compilar. Después de Vite, genera el HTML de las fichas individuales de personas, dinastías y territorios y audita sus metadatos, datos iniciales y estilos. El resultado publicable queda en `dist/`. No edites los archivos generados para cambiar contenido.

Si vas a trabajar en la interfaz, después de generar los datos puedes iniciar Vite con `npm run dev`. Para ver la compilación puedes usar `npm run preview`. Las revisiones visuales mediante un servidor local se hacen cuando se solicitan; no son un paso automático de cada actualización.

Las variables públicas opcionales están documentadas en `env.example`. La web usa su dominio habitual si `VITE_SITE_URL` está vacío. `VITE_*` se incluye en el navegador y nunca debe contener secretos.

## Dónde hacer cada cambio

| Contenido o función | Archivo o carpeta |
| --- | --- |
| Personas, filiaciones y gobiernos | `src/personas.jsx` |
| Minibiografías | `src/content/personas/` |
| Territorios y naturaleza de las entidades | `src/data/territorios.js` |
| Grupos de filtros territoriales | `src/Territorios.jsx` |
| Historias de territorios y dinastías | `src/content/territorios/`, `src/content/dinastias/` |
| Relevos explicados y reclamaciones | `src/content/sucesiones/index.js` |
| Accesos a títulos y uniones | `src/content/coronas/index.js` |
| Síntesis del año global | `src/data/europeYear.js`, `src/explorer/EuropeYearDialog.jsx` |
| Bibliografía compartida | `src/content/sources.js` |
| Fichas públicas y navegación inicial | `src/public/`, `src/routing.js` |
| Atlas y sucesión territorial | `src/explorer/` |
| Conexión entre 2–5 personas y exportación SVG/PNG | `src/connections/` |
| Selección familiar del origen de una rama | `src/data/dynastyBranchSelection.js` |
| Motor del desafío | `src/desafio/` |
| Generación estática de fichas | `scripts/prerender-ssg.mjs`, `src/public/ssg-entry.jsx` |
| Auditoría del HTML generado | `scripts/audit-ssg.mjs` |
| Pruebas automáticas | `tests/` |

`personas.jsx` y `historiaData.jsx` son módulos de datos sin imports: los generadores los leen directamente con Node. Mantén sus identificadores estables. `persona.titulo` es un resumen; cada entrada de `gobiernos` debe indicar `territorio`, `titulo`, `clase`, `condicion`, `desde` y `hasta`. `reinados` conserva compatibilidad de lectura y no es otra base independiente.

Las alianzas matrimoniales tienen una categoría propia: una boda no demuestra transferencia de territorio ni origen de una rama masculina. El nombramiento de un cargo y la toma de posesión pueden llevar fechas distintas.

Una agrupación geográfica no es una soberanía. Una pretensión no equivale a gobierno efectivo. Los relevos explicados identifican mandatos concretos; nunca se generan simplemente ordenando nombres por fecha. Cada crisis documenta las reclamaciones y las filiaciones usadas para explicarlas.

Las publicaciones se incorporan una sola vez a la bibliografía general. Sus asociaciones con personajes y territorios se mantienen en el mismo registro. Una referencia contextual no prueba todos los datos de una ficha. Los retratos nuevos los aporta el responsable del proyecto: no se descargan ni sustituyen automáticamente.

## Validación y publicación

```sh
npm test
npm run prebuild
npm run build
```

El último comando vuelve a ejecutar `prebuild`; durante el trabajo normal basta `npm test` seguido de `npm run build`. También puedes lanzar por separado `npm run audit:territorios`, `npm run audit:dinastias`, `npm run audit:sucesiones` y `npm run audit:coronas`.

Las pruebas usan `node:test`, React para renderizar componentes en memoria y el transformador incluido en Vite para leer JSX. `jsdom` permite comprobar también la hidratación y los controles de las fichas. Es una dependencia de desarrollo, no se incorpora al JavaScript publicado. Las pruebas no arrancan un servidor. Cubren rutas, persistencia, geometría, filtros, etapas de títulos, precisión del año global, render de sucesiones y generación de preguntas, además de los contratos de datos. No sustituyen una revisión visual cuando se modifica CSS.

La configuración de GitHub Actions en `.github/workflows/ci.yml` ejecuta instalación reproducible, pruebas, build y la hidratación de una muestra de 20 fichas reales en pull requests y cambios de `main`. Usa permisos de lectura y acciones fijadas por SHA. La V2.14 incorpora este archivo, que no había llegado a GitHub con las entregas anteriores. Para impedir una fusión con errores, configura una regla de protección de `main` que exija el check **Tests y build**; añadir el workflow por sí solo no impide saltarse ese control.

Vercel conserva el despliegue existente con `npm run build`, directorio `dist` y las rutas de `vercel.json`. Configura Node 24 también allí. Esta actualización no cambia ajustes remotos ni publica por sí sola.

Las actualizaciones se preparan en una rama de GitHub y se entregan mediante **pull request hacia `main`**, con el alcance y los resultados de validación. La fusión y el despliegue quedan separados de la preparación de la actualización. Como copia complementaria puede generarse un ZIP con solo los archivos añadidos o modificados respecto de la base de la pull request, incluidos los ocultos. No subas `node_modules/` ni `dist/` como código fuente.

## Conexiones y exportación

En el menú **Comparar**, elige **Conectar 3–5 personas**. Admite de dos a cinco nombres, con búsqueda por nombres alternativos. Puedes limitar la conexión a filiaciones o incluir matrimonios, quitar personas y copiar un enlace que conserva la selección y el criterio. El cálculo usa toda la base, aunque haya filtros de exploración activos; estos vuelven a aplicarse al salir. Si faltan vínculos registrados, los grupos se muestran separados.

Desde las ramas de una ficha dinástica, **Ver el origen de esta rama en el árbol** abre al fundador con sus padres y descendientes relevantes disponibles. El botón **Exportar** del árbol descarga la comparación, el foco, la familia de una persona o la vista actual en SVG o PNG. Incluye nombres completos, fechas, leyenda y referencia al proyecto. El PNG limita su tamaño para conservar legibilidad; las selecciones grandes pueden descargarse como SVG. No incluye retratos ni exportación PDF.

El árbol mínimo reduce el número de vínculos registrados necesarios para reunir a las personas. No establece parentescos que falten en la base, ni demuestra por sí mismo derechos sucesorios. Los enlaces con incertidumbre siguen requiriendo consultar sus fichas y fuentes.

## Indexación

Las 2999 fichas individuales de la base actual se publican con contenido y metadatos en el HTML inicial. React las hidrata con el mismo JSON incrustado, sin repetir su descarga. El Atlas (`?atlas=1`), las historias interactivas, los desafíos, los catálogos y las portadas conservan su arranque dinámico.

`npm run audit:ssg` comprueba `dist/` después del build. `npm run ssg:sample` genera 20 ejemplos en `.ssg-sample/`, sin modificar las fichas publicables. Consulta [el procedimiento de validación y las rutas de alojamiento](docs/V2.12.2.md).

El proyecto genera sitemaps y fichas enlazables. El acceso de un robot no garantiza la indexación ni la posición de una búsqueda. Para un diagnóstico real, usa Google Search Console con la propiedad del dominio:

1. Envía `https://www.treeofeurope.eu/sitemap-full.xml`.
2. Inspecciona la portada y una muestra de fichas de personas y territorios.
3. Revisa indexación, página canónica elegida y motivos de exclusión.
4. Comprueba enlaces entrantes y evolución de impresiones antes de cambiar más código SEO.

No se justifica reabrir la optimización de rendimiento únicamente por una búsqueda que no encuentre la web.

## Derechos

El código y los contenidos originales conservan **todos los derechos reservados**, tal como ya establece [COPYRIGHT.md](COPYRIGHT.md). `license: "UNLICENSED"` hace explícita esa decisión en los metadatos del paquete; no concede una licencia abierta ni altera derechos previos. Las imágenes, fuentes y materiales de terceros conservan sus respectivas condiciones y atribuciones.
