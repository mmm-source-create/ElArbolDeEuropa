# Herramientas del proyecto

Ejecuta los comandos npm desde la raíz del repositorio. Node 24 y
`package-lock.json` son el entorno del sitio; Python se necesita únicamente
para investigar o regenerar geometría.

| Carpeta | Función |
| --- | --- |
| `audits/` | Contratos, personas, territorios, cartografía, regresiones, seguridad y HTML; `audits/lib/` guarda la lógica que solo usan las auditorías y sus tests |
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

## Continuidad de una zona revisada

`npm run audit:regional-continuity` comprueba cada ID del ámbito de
`prototypes/euv-locations/bosnia-hum-review.json` y `posavina-ragusa-review.json` en cada año de 1200 a 1800.
Usa el mosaico real, verifica las fuentes de la celda y exige una explicación
para cada atribución múltiple. Forma parte de `audit:build` y escribe su
diagnóstico en `.cache/audits/audit-regional-continuity-report.json` y
`audit-posavina-ragusa-report.json`.

`audit:uncolored` detecta celdas sin color en ningún año; por sí solo no detecta
una región que desaparece durante algunos años. Las dos comprobaciones se
complementan. La fuente regional se ensambla mediante
`scripts/cartography/merge-map-expansions.mjs`; los informes históricos
aceptados se guardan aparte en `docs/reports/reviewed/`.


`apply-regional-review.mjs` ensambla ambas revisiones, sin duplicar el
validador. La última revisión activa prevalece en cada celda, también donde
los ámbitos se cruzan. `apply-coastal-subdivisions.py` reconstruye las cuatro
nuevas celdas a partir del archivo de originales `coastal-subdivisions.json`;
`--check` compara la geometría aceptada y exige contorno exterior equivalente
y ausencia de superficies duplicadas. La comprobación Python de CI lo ejecuta
en la copia temporal antes de regenerar los inventarios.

## Inventario completo de los Balcanes y su frontera

`npm run audit:balkans-continuity` comprueba 1.124 celdas durante los 601 años
de 1200–1800. El inventario procede de las ventanas geográficas de
`balkans-geography.json`, medidas mediante `build-balkans-geography.py`;
731 celdas intersectan el núcleo balcánico. No se seleccionan a partir de
los nombres de los titulares ni de la lista de celdas nunca coloreadas.
Se incluyen las celdas completas que atraviesan las ventanas.

`balkans-full-review.json` es la fuente de fases, notas, citas y ámbitos
personales. El ensamblador compartido comprueba que la precedencia proporciona
una sustitución completa en cada celda. `build-balkans-routes.mjs` produce
`src/data/balkansFullRouteData.json`, con los datos necesarios para las rutas
del cliente; el inspector conserva la evidencia completa en el mapa.

El informe actual se escribe en `.cache/audits/audit-balkans-continuity-report.json`.
La [instantánea revisada de V5.11](../docs/reports/reviewed/v5.11-balkans.json)
conserva el resultado anual y los límites del método.

## Iberia e Italia, 1200–1800

`npm run audit:iberia-italy-continuity` comprueba las 931 celdas de la selección
geográfica independiente durante los 601 años. Se ejecuta durante `audit:build`
y escribe `.cache/audits/audit-iberia-italy-continuity-report.json`. La instantánea
aceptada, con comparación anterior y huellas de las fuentes, se conserva en
`docs/reports/reviewed/v5.12-iberia-italy.json`.

La reproducción geométrica se ejecuta en el entorno Python bloqueado:

```sh
.venv-cartography/bin/python scripts/cartography/build-geographic-inventory.py iberia-italy-geography.json iberia-italy-geographic-cells.json
node scripts/cartography/build-iberia-italy-routes.mjs
node --import ./tests/jsx-loader.mjs scripts/cartography/merge-map-expansions.mjs
```

Las ventanas seleccionan superficies completas, incluidos todos sus subtrazados
insulares. `iberia-italy-full-review.json` contiene la atribución histórica,
sus citas y las composiciones; el inventario no decide soberanía. Las rutas
compactas del cliente se comparan con su fuente en las pruebas.

`src/data/tributaryRelations.js` conserva las relaciones tributarias fechadas.
Esas relaciones no se convierten en gobiernos personales ni alteran la
identidad del mosaico conjunto. La precedencia regional no borra el marco
legal imperial, que permanece separado de los dominios pintados.

## Francia y Países Bajos, 1200–1800

`npm run audit:france-low-countries-continuity` comprueba las 640 celdas de la
selección geográfica independiente en los 601 años, con evidencia local.
Forma parte de `audit:build`; resultados actuales en `.cache/audits/`,
instantánea aceptada en `docs/reports/reviewed/v5.13-france-low-countries.json`.

```sh
.venv-cartography/bin/python scripts/cartography/build-geographic-inventory.py france-low-countries-geography.json france-low-countries-geographic-cells.json
node scripts/cartography/build-france-low-countries-routes.mjs
node --import ./tests/jsx-loader.mjs scripts/cartography/merge-map-expansions.mjs
```

La revisión histórica es una fuente curada, no un resultado inferido por nombres.
El constructor sólo compila rutas; el ensamblador exige sustitución completa.
Los ámbitos delegados conservan sus celdas disputadas y citas. Las superficies
compartidas con Iberia/Italia siguen sujetas a ambas auditorías.

`audit-personal-atlas.mjs` verifica Navarra durante todos los mandatos habsbúrgicos españoles y registra diez casos personales; `--publish` actualiza la instantánea revisada V5.14.

## Polonia-Lituania y ampliación medieval (V5.17)

`build-central-europe-review.mjs` ensambla el registro de los tres repartos,
la continuidad del Báltico y las rutas de la frontera oriental. Las semillas
anteriores a la revisión se conservan como datos de entrada, de modo que la
regeneración no depende de una salida ya modificada. Las selecciones medieval
y oriental conservan sus fases, fuentes y reservas en los JSON aceptados.
`build-early-medieval-routes.mjs` compila las fases anteriores a 1200 y el
límite temporal compartido con Europa en este año. Después se ejecuta
`merge-map-expansions.mjs`.

`audit:poland-lithuania` recorre 482 celdas en cada año de 1200–1800 y exige
continuidad, evidencia y explicación de atribuciones múltiples.
`audit:early-map` comprueba cada año de los gobiernos efectivos anteriores a
1200. Ambos comandos escriben en `.cache/audits`; `--publish` se usa expresamente
para actualizar el informe revisado y los CSV de consulta, tras revisar el
resultado. La lista de personas conserva por separado mandatos anteriores,
mandatos posteriores y vínculos familiares.

### Europa oriental · V5.26

`node scripts/cartography/build-eastern-europe-routes.mjs` compila los inventarios geográficos, la cronología y las excepciones locales aceptadas en `prototypes/euv-locations/eastern-europe-*.json`. Después se ejecuta `node scripts/cartography/merge-map-expansions.mjs`. `npm run audit:eastern-europe` comprueba cada celda en cada año de 1200–1800; `-- --publish` actualiza el resultado revisado. Los límites de la auditoría no son fronteras políticas y las fuentes HTML externas solo sirven para localizar candidatos.
