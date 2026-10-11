# Herramientas del proyecto

Ejecuta los comandos npm desde la raíz del repositorio. Node 24 y
`package-lock.json` son el entorno del sitio; Python se necesita únicamente
para investigar o regenerar geometría.

| Carpeta | Función |
| --- | --- |
| `audits/` | Contratos, personas, territorios, cartografía, regresiones, seguridad y HTML |
| `generate/` | Catálogos, árbol, sitemaps, traducciones y prerenderizado |
| `cartography/` | Extracción de mandatos, selecciones documentadas, cruces y mediciones SVG |
| `schema/` | Lectura y comparación de los contratos y bases V5 |
| `lib/` | Utilidades compartidas de rutas, HTML y seguridad |

`npm run prebuild` ejecuta `audit:build` y después `generate`, en el orden
original. `npm run build` añade compilación, HTML y comparaciones V5.
`npm run generate` permite regenerar solo los catálogos. Los nombres de las
auditorías npm anteriores se conservan; sus entradas ahora están en `audits/`.

Los scripts cartográficos se ejecutan expresamente y quedan fuera del build
del sitio. Consulta el [entorno Python y sus pasos](../docs/python-cartography.md).
Los ensambladores JavaScript aceptan `EADE_MAP_DATA_DIR`, igual que Python,
para usar una copia de los datos en lugar del directorio aceptado.

Los JSON, SVG y visores de `prototypes/euv-locations/` son datos revisados y
laboratorios utilizados por el Atlas. El nombre histórico de esa carpeta no
los convierte en temporales. Su [clasificación](../docs/artifacts.md) distingue
fuentes, resultados aceptados y diagnósticos desechables.

Los informes de versiones anteriores y los manifiestos archivados conservan
los nombres que existían cuando se entregaron. Para ejecutar una herramienta
usa sus comandos npm o las rutas actuales de esta guía.
