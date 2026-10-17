# Fuentes, resultados revisados y temporales

| Clase | Ubicación | Tratamiento |
| --- | --- | --- |
| Fuentes históricas y editoriales | `src/personas.jsx`, `src/content/`, `src/evidence/`, `src/data/`, `src/Territorios.jsx` | Se editan y revisan con evidencia; los cambios históricos siguen el procedimiento V5 |
| Fuentes cartográficas y selecciones | `scripts/cartography/`, anclas, overrides y revisiones en `prototypes/euv-locations/` | Contienen decisiones y citas; una herramienta geométrica no sustituye su revisión |
| Cartografía e inventarios aceptados | JSON y SVG en `prototypes/euv-locations/`, `src/MapChart_Map.svg` | Versionados; el Atlas consume estas superficies. Regeneración en una copia y adopción explícita mediante PR |
| Bases de validación | `tests/baselines/`, `audit-baseline.json` | Expectativas revisadas; solo se actualizan con una justificación concreta |
| Resultados de auditoría revisados | `docs/reports/reviewed/`, `docs/atlas-continuity-audit.json` y `.md` | Instantáneas conservadas; no se sobrescriben durante el build |
| Diagnósticos de la ejecución actual | `.cache/audits/` | Regenerables e ignorados por Git; no son decisiones históricas aceptadas |
| Trabajo cartográfico temporal | `.cache/cartography/` | Copias y ensayos; no se publica ni se importa desde el Atlas |
| Entorno local | `.venv-cartography/`, `node_modules/`, `__pycache__/` | Regenerable e ignorado |
| Catálogos y sitio compilado | `src/generated/`, metadatos y catálogos de `public/`, sitemaps, `public/map-audit/`, `dist/` | Derivados del build; no editar como fuente |
| Evidencias visuales locales | `outputs/` | Revisión temporal; no se publica automáticamente |
| Laboratorios y capturas documentales | HTML y PNG versionados en `prototypes/euv-locations/` | Material conservado: `territorial-corridors.html` se publica como `/es/mapa-completo`. Desde V5.28 los módulos del mosaico que también usa el Atlas están en `src/data/atlasMosaic.js` y `src/data/locationMosaic.js` |
| Historial | `docs/V*.md`, `docs/archive/manifests/` | Describe cada entrega; se conservan cifras, rutas antiguas y checksums históricos |

El [catálogo cartográfico](artifact-catalog.json) clasifica individualmente
cada archivo de datos o laboratorio conservado y las auditorías revisadas.
`npm run audit:artifacts` detecta archivos cartográficos nuevos sin clasificar
y entradas ausentes. Esta clasificación indica cómo mantener el archivo;
no certifica todas sus afirmaciones históricas ni la exactitud de sus límites.

## Adoptar un resultado nuevo

1. Ejecuta el generador o auditoría. Su resultado temporal no se convierte en fuente por existir.
2. Contrasta cambios y fuentes; para geometría, inspecciona los polígonos y los cortes anuales.
3. Copia únicamente el resultado aceptado a su ubicación versionada y explica la revisión en la PR.
4. Repite contratos, pruebas y regresiones. Actualiza las bases solo cuando el cambio sea intencionado y justificado.

Las auditorías normales escriben exclusivamente en `.cache/audits/`. La
publicación del inventario de celdas pendientes sigue generando
`public/map-audit/`; es un derivado necesario del laboratorio, no una fuente
histórica. La opción `--output` de esa auditoría permite una ruta expresamente
elegida. `audit-personas --write-baseline` conserva su operación explícita de
aceptación de la base; el build normal nunca la ejecuta.

Las referencias HTML aportadas por el usuario en Downloads quedan fuera del
repositorio. Sirven para detectar preguntas y huecos; sus colores no se
importan como prueba de autoridad. Los archivos, capturas y revisiones
conservados no se eliminan en esta reorganización.
