# Protección de comportamiento · V5

La base `tests/baselines/v5-regression.json` se creó con el resultado publicado tras la revisión de Islandia, Istria y Moldavia (`ef6b5cf`). V5.5 la actualiza tras la [revisión de autoridad y gobernaciones](versiones/V5.5.md): siete fichas fuente anteriores modificadas, una persona nueva, cuatro mandatos y dos rutas nuevas. Los mapas completos de los 601 años permanecen iguales; los personales cambian únicamente entre 1567 y 1592. Se revisan 80 páginas existentes y dos nuevas; la generación del árbol incorpora a Requesens. Los IDs, relaciones y mandatos anteriores, el registro territorial y la geometría se conservan. El campo `origin` mantiene el punto de partida y `reason` explica la revisión vigente. Contiene 2.532 personas, 2.509 gobiernos, 270 entidades del registro y 3.528 fichas estáticas. Es una referencia de comportamiento, no una afirmación de que toda la historia esté resuelta.

V5.7 actualiza únicamente el formato público: `reinados` pasa a `gobiernos`
y se retira el `conyuge` duplicado de las fichas. Cambian 2.537 huellas JSON
(2.532 personas españolas y cinco inglesas). Los 3.528 cuerpos HTML y los
3.549 metadatos, comparados tras esa transformación precisa, permanecen
idénticos. Los datos, mapas de los 601 años, rutas, disposición del árbol y
recuentos no cambian. Se conserva el comparador y se documenta el motivo en
la base; el esquema del HTML inicial pasa a 2 por separado.

## Qué se compara

- Cada persona: datos, relaciones declaradas, mandatos y afirmaciones con sus fuentes y certeza.
- Cada entidad del registro territorial.
- Los **601 años completos de 1200 a 1800**: identidades, etiquetas, superficies, colores, ámbitos, evidencia y prioridad de solapamientos del mosaico; mandatos, autoridades, tipo de control, fuentes y superficies de los mapas personales, incluidas las pretensiones consultables.
- El SVG real y su inventario medido, además del rango cartográfico.
- Las rutas realmente generadas, sus fichas JSON, relaciones expandidas, recuentos y disposición del árbol.

Se guardan huellas SHA-256 deterministas y las rutas públicas. El comparador identifica la persona, ficha o año que ha cambiado. Los recuentos acompañan las huellas; no las sustituyen. Así se detecta un cambio de soberano o fuente aunque el número de celdas sea idéntico.

Las propiedades de los objetos se ordenan para eliminar diferencias irrelevantes. Los intervalos de disputa se proyectan al mismo significado tanto si proceden del objeto antiguo como del array canónico; los cónyuges declarados se reúnen para comparar relaciones. Esta proyección se usa solo para comprobación y no cambia la carga de datos del producto.

Las marcas de generación `gen` y `buildVersion` quedan fuera de la comparación. Se conserva el orden que determina la prioridad de atribuciones solapadas.

## Validación habitual

```sh
npm test
npm run build
```

El build mantiene la auditoría estructural, todas las auditorías existentes, generación, compilación y auditoría del HTML. Después compara los datos y los mapas anuales con la base, y compara los archivos públicos recién generados. No se necesitan derivados antiguos para iniciar una copia limpia del repositorio.

También se puede ejecutar:

```sh
npm run audit:data-contract
npm run audit:regression
npm run audit:regression:public
```

La última comprobación requiere un build generado. La comparación anual utiliza el mismo motor cartográfico que el Atlas y el laboratorio; no un segundo algoritmo histórico.

## Cambios intencionados

Una refactorización mecánica debería pasar la comparación sin cambios de comportamiento. Una corrección histórica, nueva persona, ampliación territorial o mejora visible puede cambiarla legítimamente.

Primero se revisan los datos y sus fuentes. Después se ejecuta:

```sh
npm run baseline:regression -- --reason "Corrección documentada: describir territorio, fechas y motivo"
```

Este comando ejecuta los contratos y auditorías, regenera las páginas, compila y audita el HTML antes de escribir una nueva base. No acepta una actualización sin explicación. `build:artifacts` es el paso compartido de generación del artefacto; el build habitual añade después las comprobaciones de regresión.

La PR debe explicar qué diferencias son intencionadas, enlazar la documentación y las fuentes relevantes y revisar el diff de la base. A continuación se ejecuta el build habitual, que debe volver a pasar. La base nunca se actualiza automáticamente en CI ni para silenciar una regresión desconocida.

Las excepciones de formatos heredados se retiran por separado, cuando se migra cada caso. Una actualización de la base de comportamiento no amplía esas excepciones.

## Límites

Estas huellas detectan divergencias, pero no demuestran que una frontera sea históricamente correcta. Las pruebas regionales y la revisión documental siguen siendo necesarias. La comparación numérica no reemplaza la inspección visual de superficies y límites. Las interacciones, accesibilidad y adaptación de la interfaz siguen protegidas por sus pruebas existentes y por la verificación visual cuando se modifique la UI.
