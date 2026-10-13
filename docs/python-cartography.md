# Python reproducible para cartografía

El sitio se instala, valida y publica con Node 24. Python solo interviene en
las herramientas de `scripts/cartography/`; Vercel no instala este entorno ni
recalcula fronteras al publicar.

## Crear el entorno

Usa **CPython 3.12.14**, fijado en `.python-version`. Si utilizas pyenv, instala
esa versión antes del siguiente paso; también sirve otro instalador que
proporcione exactamente la misma versión. No uses el Python 3.9 de macOS.
Desde la raíz del repositorio:

```sh
python3 --version
python3 -m venv .venv-cartography
.venv-cartography/bin/python -m pip install --require-hashes --only-binary=:all: -r scripts/cartography/requirements.lock
.venv-cartography/bin/python -m pip check
npm run cartography:check
```

Comprueba que el primer comando indique 3.12.14. El lock fija Shapely,
svgpathtools y todas sus dependencias de ejecución (NumPy, SciPy y svgwrite),
con hashes de las ruedas publicadas en PyPI. `--only-binary` evita compilar
contra una biblioteca GEOS del sistema. No se reutilizan paquetes globales.
Las versiones y GEOS efectivos aparecen en la comprobación.

La comprobación regenera **location-inventory.json** y
**regional-extent-cells.json** en un directorio temporal, desde otro directorio
de trabajo, y compara IDs, visibilidad, áreas, centros y límites con los
inventarios aceptados. Exige la misma estructura y admite solo `2e-7` de
diferencia absoluta en medidas SVG, almacenadas a siete decimales. Esa
tolerancia numérica no permite cambiar territorios ni fronteras. GitHub ejecuta
la misma instalación y comprobación, además de las regresiones V5 del sitio.

## Regenerar sin sobrescribir la cartografía aceptada

```sh
mkdir -p .cache/cartography/work
cp prototypes/euv-locations/*.json prototypes/euv-locations/*.svg .cache/cartography/work/
export EADE_MAP_DATA_DIR="$PWD/.cache/cartography/work"
.venv-cartography/bin/python scripts/cartography/build-location-inventory.py
.venv-cartography/bin/python scripts/cartography/build-regional-extent-cells.py
node --import ./tests/jsx-loader.mjs scripts/cartography/audit-crosswalk.mjs
unset EADE_MAP_DATA_DIR
```

Python y JavaScript resuelven las entradas y salidas cartográficas respecto a
`EADE_MAP_DATA_DIR`; las fuentes del Atlas siguen leyéndose del repositorio.
Sin esa variable, los generadores escriben en `prototypes/euv-locations/`.
Por eso conviene utilizar siempre una copia durante una investigación. El
cruce auditado produce su diagnóstico en `.cache/audits/`.

## Dependencias y orden de generación

| Herramienta | Entradas principales | Resultado |
| --- | --- | --- |
| `crop_svg.py` | Exportación original **EU V Locations**, aportada por el usuario | `euv-locations-crop.svg` |
| `carlos-v-source.mjs` / `burgundian-source.mjs` | Mandatos del Atlas y versiones de las regiones antiguas | `carlos-v-source.json` / `burgundian-source.json` |
| `build-carlos-v-map.py` / `build-burgundian-map.py` | Exportaciones anteriores, SVG antiguo y recorte, correcciones | `carlos-v-locations.json` / `burgundian-locations.json` |
| `corridor-source.mjs` / `hungary-balkans-source.mjs` | Atlas y selecciones documentadas | `corridor-source.json` / `hungary-balkans-locations.json` |
| `build-corridor-map.py` | Esas exportaciones, capas borgoñonas, SVG y correcciones | Cruce general y ensamblado mediante `merge-map-expansions.mjs` |
| `extended-corridors-source.py`, `central-expansion-source.py`, `balkan-expansion-source.mjs` | Selecciones documentadas y datos aceptados | Series de ampliación cronológica y regional |
| `regional-extent-source.py`, `continuity-source.py`, `frontier-source.py`, `succession-source.py` | Selecciones documentadas, anclas y/o cruce aceptado | JSON de revisión regional, continuidad, frontera y sucesiones |
| `merge-map-expansions.mjs` / `sync-balkan-map.mjs` | JSON de revisión y capas aceptadas | `corridor-locations.json` ensamblado |
| `build-location-inventory.py`, `build-regional-extent-cells.py`, `balkan-spatial-source.py` | SVG y selecciones aceptadas | Inventarios geométricos |
| `render-carlos-v-svg.py` | Recorte y capa de Carlos V | SVG de comparación en la ruta solicitada |

Extrae primero los mandatos y después construye sus cruces; ensambla las
revisiones antes de medir sus celdas. Las selecciones históricas no son una
secuencia automática de publicación: algunos JSON incluyen decisiones
editoriales posteriores a sus generadores originales. Regenerarlos requiere
comparar el diff y conservar esas decisiones. Las anclas, overrides y
`reference-gap-review.json` se revisan como fuentes explícitas.

La exportación mundial original no forma parte del repositorio. Para repetir
el recorte hace falta obtener la misma exportación del usuario; usa
`crop_svg.py /ruta/al/original.svg --output /ruta/al/recorte.svg`. El recorte
aceptado y el SVG de provincias antiguo sí están versionados, por lo que las
mediciones comprobadas por CI no dependen de Downloads ni de archivos privados.
Conserva la atribución y licencia de MapChart. Un cruce geométrico propone
candidatos; la autoridad política necesita fuentes fechadas.

## Actualizar el entorno

Actualiza Python o las bibliotecas en una PR específica, incluyendo versiones
y hashes de PyPI, y repite la comprobación geométrica y las regresiones V5.
No actualices automáticamente la base para ocultar una diferencia. Las
dependencias de este lock corresponden a ruedas probadas en macOS ARM64 y
Linux x86_64 mediante CI; otras plataformas requieren su propia validación.


Desde V5.10, `check-environment.py` también comprueba las subdivisiones
costeras contra `coastal-subdivisions.json`: conserva las curvas originales,
hace explícito el cierre implícito del relleno SVG y exige equivalencia del
perímetro exterior y cero solapamiento de área. Esto evita comparar como si
fuera geometría exacta el muestreo antiguo que omitía el último extremo de
algunos trazados abiertos. Los inventarios siguen declarando su muestreo
aproximado; sus áreas no son kilómetros cuadrados ni fronteras históricas.

Desde V5.13, la reproducción incluye también `france-low-countries-geography.json`
y las 640 celdas completas de su inventario independiente. La selección mide
geometría; la revisión histórica separada decide atribuciones y fechas.
