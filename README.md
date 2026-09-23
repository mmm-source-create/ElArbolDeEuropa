# El Árbol de Europa

Atlas histórico y genealógico para explorar personas, dinastías, territorios y sus conexiones familiares.

- [Web](https://www.treeofeurope.eu/es/) · **V3.0**
- [Cambios de esta versión](docs/V3.0.md) · [Documentación e historial](docs/README.md) · [Seguridad](SECURITY.md)

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
| Minibiografías | `src/content/personas/` |
| Territorios y filtros | `src/data/territorios.js`, `src/Territorios.jsx` |
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
