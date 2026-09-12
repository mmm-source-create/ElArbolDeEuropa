# El Árbol de Europa

Atlas histórico y genealógico para explorar personas, dinastías, territorios y sus conexiones familiares. Incluye fichas públicas, historias, cronología y desafíos.

- Web: [treeofeurope.eu](https://www.treeofeurope.eu/)
- Versión: **2.11 — Sucesiones explicadas**
- [Cambios, validación y revisión del repositorio](docs/V2.11.md)
- [Fuentes y metodología](https://www.treeofeurope.eu/es/fuentes)

## Empezar

Necesitas **Node.js 24** y npm. La versión principal de Node está en `.nvmrc`; las dependencias directas tienen versiones exactas y `package-lock.json` fija el resto.

```sh
npm ci
npm test
npm run build
```

`npm run build` ejecuta automáticamente `prebuild`: audita los datos y regenera índices, metadatos, fichas y sitemaps antes de compilar. El resultado publicable queda en `dist/`. No edites los archivos generados para cambiar contenido.

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
| Bibliografía compartida | `src/content/sources.js` |
| Fichas públicas y navegación inicial | `src/public/`, `src/routing.js` |
| Atlas y sucesión territorial | `src/explorer/` |
| Motor del desafío | `src/desafio/` |
| Pruebas automáticas | `tests/` |

`personas.jsx` y `historiaData.jsx` son módulos de datos sin imports: los generadores los leen directamente con Node. Mantén sus identificadores estables. `persona.titulo` es un resumen; cada entrada de `gobiernos` debe indicar `territorio`, `titulo`, `clase`, `condicion`, `desde` y `hasta`. `reinados` conserva compatibilidad de lectura y no es otra base independiente.

Una agrupación geográfica no es una soberanía. Una pretensión no equivale a gobierno efectivo. Los relevos explicados identifican mandatos concretos; nunca se generan simplemente ordenando nombres por fecha. Cada crisis documenta las reclamaciones y las filiaciones usadas para explicarlas.

Las publicaciones se incorporan una sola vez a la bibliografía general. Sus asociaciones con personajes y territorios se mantienen en el mismo registro. Una referencia contextual no prueba todos los datos de una ficha. Los retratos nuevos los aporta el responsable del proyecto: no se descargan ni sustituyen automáticamente.

## Validación y publicación

```sh
npm test
npm run prebuild
npm run build
```

El último comando vuelve a ejecutar `prebuild`; durante el trabajo normal basta `npm test` seguido de `npm run build`. También puedes lanzar por separado `npm run audit:territorios`, `npm run audit:dinastias` y `npm run audit:sucesiones`.

Las pruebas usan `node:test`, React para renderizar componentes en memoria y el transformador incluido en Vite para leer JSX. No arrancan un servidor. Cubren rutas, persistencia, geometría, filtros, render de sucesiones y generación de preguntas, además de los contratos de datos. No sustituyen una revisión visual cuando se modifica CSS.

La configuración de GitHub Actions en `.github/workflows/ci.yml` ejecuta instalación reproducible, pruebas y build en pull requests y cambios de `main`. Usa permisos de lectura y acciones fijadas por SHA. **Se activará al incorporar el archivo al repositorio.** Para impedir una fusión con errores, configura una regla de protección de `main` que exija el check **Tests y build**; añadir el workflow por sí solo no impide saltarse ese control.

Vercel conserva el despliegue existente con `npm run build`, directorio `dist` y las rutas de `vercel.json`. Configura Node 24 también allí. Esta actualización no cambia ajustes remotos ni publica por sí sola.

Las actualizaciones se entregan en un ZIP con **solo archivos añadidos o modificados**. Extrae su contenido en la raíz de la versión anterior, respetando las carpetas y los archivos ocultos como `.github/`. No subas `node_modules/` ni `dist/` como código fuente.

## Indexación

El proyecto genera sitemaps y fichas enlazables. El acceso de un robot no garantiza la indexación ni la posición de una búsqueda. Para un diagnóstico real, usa Google Search Console con la propiedad del dominio:

1. Envía `https://www.treeofeurope.eu/sitemap-full.xml`.
2. Inspecciona la portada y una muestra de fichas de personas y territorios.
3. Revisa indexación, página canónica elegida y motivos de exclusión.
4. Comprueba enlaces entrantes y evolución de impresiones antes de cambiar más código SEO.

No se justifica reabrir la optimización de rendimiento únicamente por una búsqueda que no encuentre la web.

## Derechos

El código y los contenidos originales conservan **todos los derechos reservados**, tal como ya establece [COPYRIGHT.md](COPYRIGHT.md). `license: "UNLICENSED"` hace explícita esa decisión en los metadatos del paquete; no concede una licencia abierta ni altera derechos previos. Las imágenes, fuentes y materiales de terceros conservan sus respectivas condiciones y atribuciones.
