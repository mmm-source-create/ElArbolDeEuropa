# Índice territorial / Territory index

## Consulta

El índice de `/es/territorios` y `/en/territories` comparte la organización y
los controles. La vista por regiones ofrece seis entradas seleccionadas por
región. «Ver todos» abre sus resultados, ordenados por nombre. A–Z cambia la
presentación de las tarjetas; el índice completo al final permite acceder a
las 1.041 fichas mediante enlaces presentes en el HTML inicial, incluso antes
de cargar la lista ampliada o sin ejecutar JavaScript.

La búsqueda admite nombres, variantes y las personas destacadas de cada ficha.
Los filtros de región, naturaleza, tipo, año y resumen desarrollado se
combinan. «Quitar filtros» los limpia, incluida la búsqueda. Las listas de
resultados se amplían en grupos de 60 tarjetas.

El año consulta intervalos de **gobiernos registrados**. Los extremos de la
serie y sus huecos describen su cobertura; no son fechas de fundación o fin
de un Estado. Las fechas `desde` y `hasta` de una capa cartográfica no se
utilizan para deducir existencia histórica. En agrupaciones y entidades compuestas, la cobertura reúne los mandatos del
conjunto y sus componentes. Las tarjetas lo indican expresamente.
Los gobiernos nominales,
disputados o compartidos mantienen su clasificación en la ficha detallada.
El tipo de la tarjeta procede de la clasificación general de la entidad;
sus cambios de rango se consultan en la ficha.

## Clasificación y mantenimiento

- Identidad y naturaleza: `src/data/territorios.js`. Las claves canónicas se
  conservan en ambos idiomas; los rótulos y rutas ingleses son independientes.
- Geografía: `src/content/territoryRegions.json`. Cada clave tiene una región
  principal y puede tener regiones adicionales. Es una organización para
  explorar. Las pertenencias políticas fechadas siguen en el modelo territorial.
- Entradas destacadas, rótulos, filtros y orden: `src/features/public/territoryCatalog.js`.
- Datos de las tarjetas: `scripts/generate/territory-catalog.mjs`. Reutiliza
  las personas, sus gobiernos y los resúmenes editoriales. Las personas
  vinculadas y los titulares con mandato se cuentan por separado.
- Variantes: el generador conserva los alias de la entidad y las variantes
  editoriales del catálogo. El inglés incorpora también la clave española
  para permitir búsquedas cruzadas sin traducir los identificadores.
- Presentación y espaciado: `TerritoryCatalog.jsx` y `territoryCatalog.css`.
  Hay tres columnas en escritorio, dos en tableta y una en móvil. Los
  controles tienen anchos acotados, etiquetas que pueden ocupar varias líneas
  y separaciones propias entre filtros, regiones, tarjetas e índice.

Al añadir una entidad, asigna su región y comprueba sus rótulos en ambos
idiomas. Los registros transregionales pueden aparecer en más de una sección;
el total del índice cuenta entidades únicas. Las pruebas detectan entradas
sin región, claves obsoletas, traducciones de categorías ausentes e incoherencias
entre los dos catálogos.

## Carga inicial

Se conservan 120 tarjetas repartidas entre regiones, los recuentos completos
y un directorio compacto de nombres y enlaces. La lista ampliada se carga
una vez montada la página. Si falla, se muestra un aviso con reintento y el
directorio completo sigue disponible. Los filtros indican si sus resultados
corresponden todavía a la selección inicial. Las rutas de las fichas existentes
se conservan.

## English

Both language editions share geographic navigation, entity kinds, types,
combined filters and a complete A–Z directory. Each region starts with six
selected records; filtered results are alphabetical and expand in groups of
60. Regions can overlap: the total counts unique entities.

The year filter searches recorded government intervals. These are coverage
of the database, not the full lifespan of a polity. General entity types
are shown on cards; rank changes and dated political affiliations remain in
the detailed records. Related people and people with recorded government
are counted separately.

Canonical keys are language-independent. New territories need an explicit
geographic assignment and complete labels in both editions. The first HTML
contains 120 regionally balanced cards, complete facet counts and plain links
to every territory in the compact A–Z directory. A failed full-list request
can be retried without losing those links.
