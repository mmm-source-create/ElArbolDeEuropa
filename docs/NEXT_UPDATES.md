# Próximas actualizaciones / Upcoming updates

## Familias y fechas · continuación de 6.3.6 / Family and date research

El [inventario completo](audits/6.3.6-family-gaps.es.md) ([English](audits/6.3.6-family-gaps.en.md)) enumera todos los candidatos originales, con instantáneas JSON anterior y posterior. La 6.3.6 revisa ocho unidades familiares y completa el segundo progenitor de nueve personas existentes. Quedan 309 progenitores sin cónyuge registrado, 431 personas con un solo progenitor y 345 personas sin padres registrados a las que falta alguna fecha vital. Las listas se solapan; no son 1.085 familias distintas. El último grupo crece al incorporar personas cuya cronología sigue sin conocerse.

Siguientes lotes: otras ramas Bagrationi e Imericia, después Armenia y el resto de las cadenas del inventario. En cada lote se revisarán conjuntamente progenitores, hijos, parejas y fechas. La filiación de los otros hijos de Levan de Kartli, el primer matrimonio de Heraclio II y los padres de Darejan requieren fuentes específicas. El matrimonio anulado de Sancha con Onorato Gaetani consta en su biografía; queda pendiente una ficha propia de Onorato. La ausencia de un matrimonio registrado no se resolverá inventándolo.

Retratos pendientes: Jerónimo de Ayanz, Alfonso de Aragón, Sancha de Aragón y las consortes georgianas sin efigie identificada. La recreación moderna de Ayanz inspirada en Servet y las identificaciones dudosas de Alfonso y Sancha quedan fuera. Martín Cortés lleva una ilustración de su tratado de 1556, identificada como tal.

The full inventory lists every original candidate, with before and after JSON snapshots. Release 6.3.6 reviews eight family units and supplies the missing parent of nine existing people. Remaining candidates: 309 parents without a recorded spouse, 431 people with one recorded parent, and 345 people without recorded parents and with a missing vital date. These groups overlap. The last group grows when newly added people have unknown dates.

Next batches will cover other Bagrationi and Imeretian branches, Armenia, then the other chains. Each batch will review parents, children, partners and dates together. Levan of Kartli’s other children, Heraclius II’s first marriage and Darejan’s parents need specific evidence. Sancha’s annulled marriage to Onorato Gaetani is covered in her biography; his own profile remains pending. No marriage will be inferred merely from recorded children. Reliable portraits remain pending for Ayanz, Alfonso of Aragon, Sancha and the Georgian consorts without identified likenesses. Cortés’s image is labelled as an illustration from his 1556 treatise.

## Previsto · 23 de noviembre de 2026

### Completado en 6.2.4 / Completed in 6.2.4 · SEO 1

Publicado en la 6.2.4 (ver `docs/releases/6.2.4.md`): redirecciones de los slugs
antiguos con un historial de URL comprobado en cada build, página 404 sin
canónica y JSON-LD de los catálogos. Quedan para el autor, en Search Console:
validar la corrección de los 4xx del 16–17 de noviembre, pedir la reindexación
de las cinco fichas con otra canónica y volver a enviar `/sitemap.xml`.

### Completado en 6.3.2 / Completed in 6.3.2 · Árbol y SEO 2

Publicado en la 6.3.2 (ver `docs/releases/6.3.2.md`): las selecciones del Atlas
calculan sus propias filas (hermanos juntos, hijos una fila por debajo, parejas
unidas entre filas cuando hace falta, espacios según el parentesco, aislados al
final y abanicos en dos líneas). Una ficha estática se hidrata con sus propios
datos: el código alcanzable baja de 7,3 MB a 0,7 MB. Queda medir el TBT en
PageSpeed tras el despliegue.

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
