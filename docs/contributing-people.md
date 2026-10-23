# Añadir o corregir una persona

## Fuente y relaciones

Edita el array JSON compatible `PERSONAS` en `src/data/personas.js`. El módulo no
importa dependencias ni añade propiedades al cargarlo. Antes de crear un ID,
busca nombre, aliases y parentescos para evitar duplicados. Mantén los IDs y
slugs de las fichas existentes aunque corrijas su nombre.

Sigue el [criterio de nombres en español e inglés](person-names.md): nombre
historiográfico, ordinal y territorio cuando proceda, titulatura en los cargos
y sobrenombre separado. Conserva el nombre anterior como alias y el enlace
publicado. `npm run audit:names` comprueba estas reglas antes del build.

Cada registro requiere `id`, `nombre`, `titulo` y `reinos[]`. Esta última lista
contiene asociaciones territoriales de claves de `TERRITORIOS`; no otorga
posesión ni pinta por sí sola el mapa. Si no hay asociación justificada, usa
`[]`. `padre`, `madre`, `conyuges[]` y `amantes[]` apuntan a IDs existentes y
no pueden incluir a la propia persona. No inventes parejas, fechas ni padres
para completar una estructura. La ausencia documental puede permanecer ausente.

Consulta el [contrato completo](data-model.md) para vocabulario, identidad sin
nombre, fechas aproximadas y notas. Los cónyuges se declaran siempre en listas;
`conyuge` y `conyuge2` ya no son campos admitidos. La reciprocidad se resuelve en
el índice familiar; no se añade automáticamente a la fuente.

## Autoridad, evidencia y superficie

Registra cada mandato conocido en `gobiernos[]`, con `territorio`, `titulo`,
`clase`, `condicion`, `desde` y `hasta`. Usa el cargo real y su intervalo,
no el título resumido de la persona. Un gobernador delegado puede indicar
`soberano`; titularidad y pretensión no equivalen a posesión. Las disputas
usan `controlDisputado[]`, incluso para un solo período. No escribas
`reinados`, `reinado` ni `gobernante`.

Por ejemplo, el registro revisado de Luis de Requesens contiene:

```js
gobiernos: [{
  territorio: "Países Bajos", titulo: "Gobernador", clase: "gobierno",
  condicion: "gobierno delegado", soberano: "FEL2ESP",
  desde: 1573, hasta: 1576
}]
```

La evidencia del cargo se asocia a la clave
`person:LUISREQUESENS:government:Países Bajos:1573:1576:Gobernador`,
registrada en `src/evidence/netherlandsGovernorReviews.js`. Sigue ese patrón:
una fuente, URL y pasaje que respalden esa afirmación concreta, con certeza,
precisión y límites explícitos. La [V5.5](versiones/V5.5.md) explica el alcance provincial
y por qué el cargo no demuestra control de todas las celdas neerlandesas.

Una persona nueva con mandato no exige una capa nueva si ya existe la entidad
y su geometría fechada. Para ampliar una superficie, revisa las celdas reales,
fronteras históricas, períodos y fuentes territoriales; una etiqueta urbana
no prueba adscripción. Los archivos cartográficos revisados son fuentes
versionadas, según el [catálogo](artifacts.md). No edites los metadatos públicos
ni los catálogos generados para cambiar historia.

## Comprobar y entregar

```sh
npm run audit:data-contract
npm test
npm run build
```

El build regenera y audita el sitio y compara las relaciones, afirmaciones,
rutas y mapas de cada año en 1200–1800. Si un cambio histórico legítimo altera
la base, revisa primero las diferencias y sigue el
[procedimiento intencionado](v5-regression.md#cambios-intencionados): explica
personas, fechas, territorios y fuentes en la PR. No actualices la base para
ocultar un cambio sin explicación. CI comprueba además seguridad, cartografía
e hidratación real de las fichas. Entrega mediante PR y enlaza su informe de versión.
