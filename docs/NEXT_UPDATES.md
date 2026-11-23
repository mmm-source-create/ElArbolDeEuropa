# Próximas actualizaciones / Upcoming updates

## Previsto · 23 de noviembre de 2026

### 6.1.3 · Más personas / More people

**Siguiente versión.** Ampliar la base de personas. Cada persona nueva entra
completa:
- con retrato (cuadro de dominio público con su procedencia);
- con ficha en español y en inglés;
- con biografía y minibiografía;
- con fechas, padres, matrimonios y gobiernos contrastados con al menos una
  obra de referencia, citada con su pasaje.

La traducción y la documentación de las fichas existentes quedan en pausa
mientras tanto.

**Next release.** Grow the people database. Every new person arrives complete:
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
