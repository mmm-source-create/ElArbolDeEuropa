# Próximas actualizaciones / Upcoming updates

## Previsto · 23 de noviembre de 2026

### Completado en 6.2.4 / Completed in 6.2.4 · SEO 1

Publicado en la 6.2.4 (ver `docs/releases/6.2.4.md`): redirecciones de los slugs
antiguos con un historial de URL comprobado en cada build, página 404 sin
canónica y JSON-LD de los catálogos. Quedan para el autor, en Search Console:
validar la corrección de los 4xx del 16–17 de noviembre, pedir la reindexación
de las cinco fichas con otra canónica y volver a enviar `/sitemap.xml`.

### Árbol genealógico · propuesta / Family tree · proposal

**Pendiente de decisión.** Revisión de la 6.3.0 con familias reales. Medidas
sobre la distribución actual:

| Vista | Personas | Tamaño | Ocupación | Vínculos que saltan más de una fila | Grupos de hermanos partidos |
|---|---:|---|---:|---:|---:|
| Carlos V, 2 grados | 38 | 2 466 × 1 992 px | 37 % | 14 de 52 | 5 de 5 |
| Carlos V, 3 grados | 95 | 7 146 × 3 552 px | 18 % | 40 de 137 (hasta 9 filas) | 8 de 11 |
| Casa de Habsburgo | 100 | 3 982 × 6 412 px | 19 % | 26 de 109 (hasta 6) | 13 de 19 |
| Árbol completo | 2 904 | 101 658 × 9 904 px | 14 % | 717 de 3 261 (hasta 26) | 166 de 439 |

1. **Hermanos en la misma fila.** La pareja comparte fila de forma obligatoria;
   en familias con matrimonios cruzados, eso baja una fila a uno de los
   hermanos. Ejemplo: Manuel I de Portugal se casó con María de Aragón y después
   con Leonor, hermana de Carlos V; comparte fila con las dos, así que baja a la
   fila de Leonor, arrastra a su hija Isabel una fila más abajo y, con ella, a su
   marido Carlos V, que queda por debajo de sus hermanos. Propuesta: mover al
   cónyuge en lugar del hermano o permitir que la pareja se una entre filas
   contiguas.
2. **Generaciones compactas en las selecciones.** Las vistas parciales heredan
   las filas cronológicas del árbol completo; un hijo puede quedar varias filas
   por debajo de su padre (de Ernesto I de Austria a Federico III hay cuatro filas). Propuesta:
   recalcular las filas de la selección con padre + 1 y la cronología solo para
   desempatar.
3. **Hijos bajo sus padres.** El desplazamiento horizontal medio entre padres e
   hijos es de 300 a 650 px (de una caja y media a tres y media). Propuesta: una
   pasada de alineación que apile las cadenas de hijo único y centre cada grupo
   de hermanos bajo sus padres.
4. **Densidad.** Entre dos unidades siempre hay 112 px, sean hermanos o familias
   sin relación, y las filas quedan ocupadas al 14–37 %. Propuesta: menos espacio
   dentro de un grupo de hermanos, más entre familias y una compactación
   horizontal final.
5. **Personas aisladas.** Quien no tiene parientes visibles (5 en la vista de los
   Habsburgo, 410 en el árbol completo) se coloca entre familias ajenas.
   Propuesta: agruparlas en un extremo de su fila.
6. **Abanicos grandes.** Los 15 hijos de Fernando I ocupan una fila entera.
   Propuesta: partir los grupos muy grandes en dos líneas.

Reordenar las filas solo con las personas visibles se probó y no mejora de
forma consistente: unas familias ganan cruces y otras los pierden.

### SEO 2 · Pendiente / SEO 2 · Remaining

Publicado en la 6.3.0: retrato con prioridad alta, páginas estáticas sin
precarga de módulos e hidratación tras la carga. Queda reducir el código que
hidrata una ficha: hoy incluye el sistema de evidencias completo (2 MB) y la
base de personas V6.03 (2 MB); cada página debería llevar su evidencia en sus
propios datos.

### Completado en 6.2.0 / Completed in 6.2.0 · Espacio en Cloudflare / Cloudflare space

Publicado en la 6.2.0 (ver `docs/releases/6.2.0.md`): datos de las fichas en
español leídos de su página, una tarjeta para compartir rediseñada por idioma,
retratos sin variante de 96 px y el año de Europa guardado al pasar la pestaña
a segundo plano. Si vuelve a faltar margen, queda el plan Workers Paid (5 $ al
mes, 100 000 archivos).

### Completado en 6.1.3 / Completed in 6.1.3 · Más personas / More people

Publicado en la 6.1.3: 51 personas nuevas y 5 completadas (ver `docs/releases/6.1.3.md`). El criterio se mantiene para las próximas ampliaciones.

**Criterio.** Ampliar la base de personas. Cada persona nueva entra
completa:
- con retrato (cuadro de dominio público con su procedencia);
- con ficha en español y en inglés;
- con biografía y minibiografía;
- con fechas, padres, matrimonios y gobiernos contrastados con al menos una
  obra de referencia, citada con su pasaje.

La traducción y la documentación de las fichas existentes quedan en pausa
mientras tanto.

**Criterion.** Grow the people database. Every new person arrives complete:
a portrait (a public-domain painting with its provenance), Spanish and English
pages, a biography and a short summary, and dates, parents, marriages and
governments checked against at least one reference work and cited with its
passage. Translation and documentation of existing records pause meanwhile.

### Hoy en la Historia / Today in History

**Pendiente de implementación.** Módulo bilingüe en la portada con una selección
de acontecimientos, nacimientos y muertes que coincidan con el día y el mes.
Cada entrada enlazará a su ficha o al capítulo correspondiente, con año y
referencia documental. Se prevén tres o cuatro entradas y un selector de fecha.

Las fechas completas de nacimiento y muerte permiten iniciar la selección.
Batallas, matrimonios, coronaciones y otros acontecimientos requieren registrar
y verificar el día y el mes. El sistema distinguirá calendarios y fechas
aproximadas, y reunirá las menciones de un mismo acontecimiento para evitar
que una boda aparezca repetida por sus dos cónyuges. La selección se generará
como datos ligeros; las páginas independientes por día quedan para una fase
con contenido suficiente.

**Planned, not implemented.** A bilingual home-page feature with three or four
anniversaries of events, births and deaths, plus a date selector. Each entry
will include the year and documentary reference and link to the relevant
record or story chapter. Exact event dates must be checked before inclusion;
calendar conventions and approximate dates will remain explicit. References
to the same event will be combined. The feature will use lightweight generated
data; separate daily pages will follow only when they offer enough content.

### Completado en 6.1.1 / Completed in 6.1.1

Índice territorial organizado por regiones, con naturaleza y tipo visibles,
filtros y acceso completo A–Z en español e inglés. Véanse las
[notas de la entrega](releases/6.1.1.md).

The territory index now offers geographic regions, visible entity kinds and
types, filters and complete A–Z access in Spanish and English.

## Historial de entregas

La propuesta original se conserva en [archive/next-updates-v2.md](archive/next-updates-v2.md).
Implementadas sucesivamente en una rama de revisión:

- [V4.0](versiones/V4.0.md): afirmaciones y cobertura documental, identidades históricas separadas y Atlas más despejado y accesible.
- [V3.3](versiones/V3.3.md): edición inglesa más completa, corrección de retratos y contraste del tema oscuro.
- [V3.2](versiones/V3.2.md): ajustes de visualización, privacidad y navegación uniforme en fichas e historias.
- [V3.1](versiones/V3.1.md): lectura más cómoda dentro del Atlas, jerarquías visuales ajustadas, esqueletos fieles y 404 bilingüe propia.

- [V2.16](versiones/V2.16.md): entrada y capítulos propios de las 13 historias, progreso local, cronología y consulta de protagonistas; enlaces al Atlas y regreso.
- [V2.17](versiones/V2.17.md): entrada gradual al Atlas, búsqueda global, expansión contada y reversible, selección compartible y agrupación de papas sin familia registrada.
- [V2.18](versiones/V2.18.md): Europa completa o selección, regiones, comparación entre años, siguiente acontecimiento y separación de ritmo y salto anual.
- [V2.19](versiones/V2.19.md): vista previa de exportación, selección/rama/encuadre, SVG y PNG, impresión con orientación y márgenes, actividades y respuestas separadas, fichas y selecciones insertables.
- [V2.20](versiones/V2.20.md): portada con familia, historia y año como entradas, más recomendaciones editoriales.
- [V2.21](versiones/V2.21.md): edición inglesa acotada, con dos historias completas, cinco fichas breves, metodología, rutas equivalentes y disponibilidad explícita.

## Alcance y límites de las entregas históricas

«Mail limits» significa prevención futura de spam por correo. Se aplaza por indicación del usuario: todavía no hay una función de envío que requiera esos límites.

El PDF se obtiene mediante el diálogo de impresión del navegador («Guardar PDF»). La exportación avisa antes de procesar selecciones superiores a 300 personas; los materiales educativos admiten hasta 40 y las inserciones hasta 12. Las relaciones, fechas y coberturas conservan las limitaciones documentales del proyecto.

La edición inglesa traduce recorridos concretos; las fichas extensas y el Atlas completo permanecen en español, indicado antes de abrirlos. No se han añadido grandes ampliaciones históricas ni cambiado la cartografía.

La publicación está preparada en una propuesta de GitHub. La integración en `main` es la que activa el despliegue de producción según el flujo del repositorio.
