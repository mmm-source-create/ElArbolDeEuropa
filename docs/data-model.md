# Contrato de datos · V5

Este documento describe la fuente publicada y el contrato ejecutable de `scripts/schema/data-contract.mjs`. V5.0 introdujo validación y protección del comportamiento; V5.1 comparte la lectura entre consumidores, V5.2 exige listas para las disputas y V5.3 para los cónyuges en la fuente. V5.4 traslada la incertidumbre parental a las afirmaciones documentadas; V5.5 retira `gobernante` y exige intervalos de vida coherentes y referencias sin autorrelaciones. La compatibilidad restante se retirará en entregas posteriores de la serie V5.

## Fuentes y derivados

| Contenido | Fuente |
| --- | --- |
| Personas, relaciones y mandatos | `src/personas.jsx`, array `PERSONAS` |
| Registro territorial, naturaleza y etapas | `src/data/territorios.js`, `TERRITORIOS` |
| Afirmaciones y evidencia individual | `src/evidence/claims.js`, `reviewRecords.js` y revisiones asociadas |
| Superficies, versiones y fuentes del mapa | Revisiones en `prototypes/euv-locations/`; ensamblado mediante `merge-map-expansions.mjs` |
| Dato cartográfico consumido por la aplicación | `prototypes/euv-locations/corridor-locations.json` |
| Identidades y etiquetas territoriales | `src/data/territorialIdentity.js` |
| Correspondencia entre mandatos y capas | `src/data/locationMapPilot.js` y sus rutas fechadas |

Los generadores producen el árbol base, los catálogos, los metadatos públicos y los sitemaps. No se editan esos derivados para corregir historia. Algunas revisiones JSON y el SVG son entradas revisadas del producto y permanecen versionadas aunque procedan de herramientas de generación.

## Personas

Campos obligatorios: `id`, `nombre`, `titulo` y `reinos`. Los tres primeros son textos no vacíos; `id` es único y estable. `reinos` es una lista sin duplicados de claves del registro territorial. Un nombre corregido no justifica cambiar el identificador.

Campos opcionales:

- Presentación: `sobrenombre`, `dinastia`, `aliases[]`, `slug`.
- Cronología: `nac`, `muer`, `nacAprox`, `muerAprox`, `documentacion`.
- Familia: `padre`, `madre`, `conyuges[]`, `amantes[]`.
- Autoridad: `gobiernos[]`, con intervalo, clase y condición propios.
- Identidad: `identidadDesconocida`, cuando se haya revisado un caso concreto.

Las referencias familiares y el soberano de un mandato deben existir. Las auditorías genealógicas vigentes comprueban además ciclos, autorreferencias y contradicciones cronológicas. La reciprocidad conyugal se revisa; no se inventa un parentesco para satisfacer una comprobación.

Desde V5.3, cada ficha con cónyuges declarados utiliza `conyuges[]`, incluso si solo hay uno. Las 1.432 fichas con `conyuge` se migraron conservando cada referencia y el orden de lectura. Las 263 listas ya existentes permanecen iguales; las fichas sin relación registrada no reciben una lista nueva. `conyuge` y `conyuge2` se rechazan como campos de fuente incluso con una excepción antigua. Cada ID de la lista debe existir y ser único. La migración no añade reciprocidad, no transforma amantes en cónyuges ni cambia certeza, fechas o fuentes.

`reinos` significa **territorios asociados a la persona**: puede incluir vínculos familiares, consortes y títulos. No prueba gobierno ni posesión. `gobiernos` registra mandatos fechados. En el contrato actual, el territorio de cada mandato debe estar también asociado en `reinos` y existir en `TERRITORIOS`; no se fusionan ambos campos.

Ausencia de fechas o relaciones significa que no están registradas. Una lista vacía no demuestra que una persona no tuviera cónyuges, hijos o antecesores. Desconocer el nombre de una persona no implica desconocer su cronología. No se eliminan fechas justificadas solamente por marcar `identidadDesconocida`.

### Fechas e incertidumbre

`nac` y `muer` son años enteros, sin convertir textos ni decimales. Los indicadores `nacAprox` y `muerAprox` son booleanos. Se conserva este formato durante V5.0.

`documentacion.fechas.nac` y `.muer` permiten expresar:

| `tipo` | Límites necesarios |
| --- | --- |
| `aproximada` | `valor` y `nota` |
| `intervalo` | `desde`, `hasta` y `nota` |
| `antes` | `hasta` y `nota` |
| `despues` | `desde` y `nota` |

Las notas explican el testimonio y su límite; una última constancia no se transforma automáticamente en fecha de muerte. Los intervalos no pueden estar invertidos. `documentacion.notas[]` tiene `campo`, `estado` y `texto`; los estados actuales son `variantes`, `aclaracion` y `discutida`.

Desde V5.4, `madreAprox` y `padreAprox` se rechazan como campos de fuente, incluso con una excepción antigua. Los tres casos revisados utilizan las afirmaciones existentes `person:ID:mother` o `person:ID:father`: maternidad probable como `inferred`, paternidad biológica discutida como `disputed`, con pasaje y nota individual. Los IDs y relaciones declaradas permanecen estables.

Una persona con `identidadDesconocida: true` puede conservar fechas conocidas. Cada año registrado en `nac` o `muer` requiere una revisión de su propia afirmación de nacimiento o muerte, con certeza revisada, nota y al menos una fuente HTTP(S) con título y localizador. Una nota genérica, una aproximación sin fuente o la biografía de un pariente no cumplen esa regla. El auditor consulta `CLAIM_REVIEWS`, el mismo registro que utiliza la ficha; no existe otra base de evidencia. Las tres madres sin nombre revisadas conservan los vínculos pendientes y explican por qué se retiran sus años sin respaldo.

### Slugs y excepciones

`slug` es un override opcional. La política pública se implementa en `src/utils/personLabels.js`; los generadores resuelven colisiones con el ID. El contrato de regresión comprueba las rutas realmente generadas, también las inglesas y los capítulos.

Desde V5.5, el filtro de gobernantes depende de mandatos efectivos y fechados. Las cuatro excepciones `gobernante` se retiraron después de comprobar que su selección era idéntica sin ellas. El contrato rechaza el campo retirado. El título resumido y `reinos[]` no acreditan autoridad ni conceden polígonos. Un gobernador conserva su mandato delegado y referencia al soberano; el mapa puede representar solo una parte de su jurisdicción y señalar control disputado.

## Mandatos

Cada elemento de `gobiernos` tiene `territorio`, `desde`, `hasta`, `titulo`, `clase` y `condicion`. Puede añadir `ambito`, `nota`, `soberano` y `controlDisputado[]`.

`titulo` describe el cargo real; `persona.titulo` es solamente un resumen. `clase` utiliza el vocabulario declarado en `GOVERNMENT_CLASSES`. Dos mandatos no pueden compartir la misma clave de afirmación: persona, territorio, inicio, final y título.

Los años de inicio y final son inclusivos. Dos autoridades pueden coincidir en un año de relevo: la escala anual no acredita control exclusivo durante sus doce meses. No se introduce una regla universal que prohíba todo solapamiento.

| `condicion` | Lectura |
| --- | --- |
| `efectivo`, `rama`, `corregente`, `jure uxoris` | Mandato territorial registrado, con los límites de su ámbito y evidencia |
| `regencia`, `gobierno delegado` | Administración o representación; puede conservar `soberano` |
| `rival`, `disputado`, `ocupación` | Autoridad o control en conflicto |
| `titular`, `pretensión` | Título o reclamación; no acredita control efectivo |

Formato canónico de disputa:

```js
controlDisputado: [{ desde: 1619, hasta: 1620 }]
```

Cada intervalo debe ser válido y quedar dentro del mandato. Desde V5.2, la fuente exige un array incluso cuando hay un único intervalo: los 33 objetos individuales publicados se migraron mecánicamente y sus excepciones se retiraron. Un objeto individual falla la validación estructural incluso si figura en un registro de compatibilidad antiguo. La lista conserva el orden documental y no se ordena ni se fusiona al validar.

`reinados` se añade actualmente como alias de `gobiernos` al cargar `PERSONAS`. No es una fuente independiente y no se escribe dentro del literal. El auditor lee el literal antes de esa operación. Su retirada pertenece a la migración de consumidores posterior.

## Lectura compartida desde V5.1

Los consumidores de personas utilizan [`src/data/personAccessors.js`](../src/data/personAccessors.js), un módulo puro sin dependencias de React, del dataset ni del navegador. La normalización se realiza al leer cada relación; no se crea una segunda colección de personas o mandatos. Los campos, tipos, fechas, booleanos y referencias de la fuente siguen validándose antes con el contrato.

| Accesor | Resultado y compatibilidad |
| --- | --- |
| `conyugesDe(persona)` | IDs únicos en orden de registro. Mantiene la lectura de `conyuge` y `conyuge2` para datos anteriores; desde V5.3 la fuente usa `conyuges[]`. También entiende tarjetas públicas con `id`. Si una ficha pública contiene `conyugesIds` no vacío, usa esos IDs declarados en lugar de sus relaciones expandidas. |
| `gobiernosDe(persona)` | La lista original de `gobiernos`; solo usa `reinados` si aquella falta. Una lista canónica vacía prevalece sobre el alias. No clona ni filtra mandatos, ni inventa intervalos. |
| `territoriosDe(persona)` | La lista original de asociaciones `reinos`, sin convertirla en gobiernos ni añadir territorios de otros campos. |
| `intervalosDisputadosDe(gobierno)` | Lista de intervalos; conserva los mismos objetos de período y su orden. Mantiene la lectura de objetos heredados para datos públicos anteriores; desde V5.2 esos objetos se rechazan en la fuente. |

Los arrays opcionales ausentes producen `[]` como comodidad de lectura; no escriben un campo nuevo ni afirman que una ausencia documental sea una negativa histórica. Los contenedores mal tipados producen un error. El contrato comprueba además los valores y límites de sus elementos: un accesor no sustituye la validación ni acredita un hecho.

Los arrays devueltos de gobiernos, asociaciones y disputas son de **solo lectura por convenio**. Si un consumidor necesita ordenarlos o ampliarlos, debe copiar el array primero. Las conexiones del mapa y sus afirmaciones siguen usando el mismo objeto de gobierno, por lo que no debe clonarse para una lectura interna. La serialización de fichas puede copiarlo al construir el documento público.

La reciprocidad conyugal se resuelve en los índices familiares; el accesor no busca parejas en otras fichas ni mezcla amantes. Las tarjetas de la ficha pública conservan su forma enriquecida y sus enlaces. Se mantiene el fallback publicado de `personClaims()` cuando `conyugesIds` está vacío. V5.3 migra el formato original conservando estas políticas y la evidencia declarada; las revisiones de certeza o reciprocidad requieren su propia revisión documental.

El modelo de ficha pública conserva temporalmente `conyuge` como alias cuando hay exactamente un ID declarado en `conyugesIds`; si hay varios o ninguno, usa `null`. Desde V5.3 el generador calcula ambos desde el lector común; no lee un campo singular de la fuente. Un alias nulo no implica ausencia de cónyuges: siempre se consulta la lista completa. El alias no añade reciprocidad y no sustituye `conyugesIds` ni las tarjetas enriquecidas. La fuente canónica continúa rechazándolo.

Los adaptadores de `reinado: [desde, hasta]` siguen en `listaReinados()` y en el serializador histórico. No hay registros actuales de ese formato y no se admite en nuevas fuentes. Los lectores de campos parentales, fechas documentales y slugs conservan sus funciones existentes; sus criterios no cambian en esta entrega.

Las comprobaciones estructurales leen deliberadamente el literal original y sus campos heredados. Así pueden detectar un formato indebido antes de que el acceso compatible lo oculte. En cambio, los cálculos de cobertura y continuidad cartográfica consumen los mismos lectores que el mapa. Los arrays de gobiernos de una ficha territorial, una dinastía o un resultado anual son modelos derivados distintos, y no se pasan a un accesor de personas.

## Evidencia

Una fuente contextual de una biografía no verifica todos sus datos. `personClaims()` identifica por separado nacimiento, fallecimiento, parentesco, matrimonio, gobierno y sucesión. La identidad de un mandato tiene la forma:

```text
person:ID:government:territorio:desde:hasta:titulo
```

El vocabulario de certeza vigente es `documented`, `approximate`, `disputed`, `inferred` y `pending`. La revisión conserva fuentes, pasajes, alternativas, precisión y nota. Un dato pendiente sigue pendiente: pasar el contrato estructural no lo convierte en documentado.

El mapa relaciona mandatos y afirmaciones usando actualmente los mismos objetos de gobierno. Un futuro adaptador debe conservar ese vínculo o sustituirlo expresamente por una clave estable y comprobada. Clonar los mandatos independientemente en distintos consumidores puede dejar un color sin su cita.

## Identidad y naturaleza territoriales

`TERRITORIOS` distingue `entidad`, `agrupacion` y `compuesta`. Cada entrada tiene `clase`, `naturaleza` y `componentes[]`; puede incluir fechas, `etapas`, `pertenencias`, títulos y nota. Componentes y pertenencias deben referirse a entidades registradas. La primera etapa puede tener `desde: null` cuando describe un estado inicial sin fecha fijada; las posteriores necesitan un año entero.

Un cambio de gobernante no crea necesariamente una entidad nueva ni altera su naturaleza. Un cambio de rango se fecha mediante una etapa. Las alias cartográficas se resuelven con `territorialIdentity()` y las etiquetas con `territorialLabel()`. Una provincia, corona compuesta, ámbito imperial y posesión personal no son intercambiables.

## Superficies del mapa

El contrato valida capas y extensiones temporales: nombres, listas de IDs, tipos, fuentes, cobertura, períodos, condiciones y versiones. El rango del ensamblado debe abarcar 1200–1800. Los metadatos de generación y las correcciones específicas siguen sujetos a las auditorías cartográficas existentes y a la comparación de resultados.

- `versions[].from` inicia una selección de superficie; `ids[]` debe existir en el inventario del SVG real, incluyendo cordilleras e islas. Las versiones deben estar en orden cronológico estricto.
- `coverage` y `periods` delimitan cuándo esa selección es válida. Una versión antigua no autoriza prolongar una capa fuera de su cobertura.
- `active` puede contener un corte y su explicación. `temporalExtensions[]` conserva sus períodos, versiones, precisión y fuentes propias.
- `sources[]` requiere título o etiqueta, URL HTTP(S) y pasaje (`locator`). `sourceKeys[]` debe resolver una fuente de la capa correspondiente.
- `authorityCondition` admite actualmente `control disputado`, `ocupación`, `gobierno delegado` y `autonomía tributaria`. La relación tributaria no convierte por sí sola un principado en provincia del poder receptor.
- `precision` y `limitedCore` explican la delimitación disponible. Una celda moderna es una aproximación a superficie histórica; su nombre urbano no prueba por sí solo su adscripción.

Las capas originales sin fuentes propias se conservan mediante una huella exacta registrada. Una capa nueva o una ampliación de aquellas necesita fuentes territoriales con pasaje. La existencia de una capa directa, o `approximate: false` en el mosaico, no certifica todas sus afirmaciones: hay que consultar evidencia y precisión.

La secuencia heredada de Croacia contiene cinco versiones de 1689. V5.0 registra exactamente esa deuda para proteger el resultado mientras se revisa su ensamblado; no permite introducir repeticiones nuevas.

## Compatibilidad y validación

`tests/baselines/v5-legacy-formats.json` contiene casos concretos y motivos: indicadores parentales, versiones repetidas y capas sin fuente propia. El grupo de disputas individuales queda vacío desde V5.2 y el conyugal desde V5.3. No es una lista de errores históricos aceptados. No hay un comando que añada automáticamente nuevas excepciones. Al migrar un caso, se retira su entrada; las entradas ya retiradas del dato no bloquean la validación. La compatibilidad de lectura no amplía los formatos admitidos por el contrato de fuente.

`npm run audit:data-contract` comprueba estas reglas antes de la generación. Se ejecuta también al principio de CI. Las auditorías previas siguen comprobando cronología, continuidad, superficies, sucesiones y páginas.

La protección de comportamiento y el procedimiento de actualización se describen en [v5-regression.md](v5-regression.md).
