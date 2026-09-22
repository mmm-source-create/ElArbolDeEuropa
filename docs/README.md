# Documentación

- [Uso del Atlas y desafíos](ATLAS.md)
- [Criterios de contenido](#criterios-de-contenido)
- [Política de seguridad](../SECURITY.md)
- [Fuentes y metodología](https://www.treeofeurope.eu/es/fuentes)

## Versiones

Los informes describen el estado validado de cada entrega. Sus cifras y listas de archivos son históricas; la instalación vigente está en el [README](../README.md).

| Versión | Contenido |
| --- | --- |
| [2.19](V2.19.md) | Exportación, impresión, material educativo e inserciones |
| [2.18](V2.18.md) | Europa completa, comparación temporal y reproducción |
| [2.17](V2.17.md) | Atlas gradual, búsqueda global y expansión reversible |
| [2.16](V2.16.md) | Historias con entrada propia, capítulos y progreso |
| [2.15.2](V2.15.2.md) | Seguridad, validación y limpieza |
| [2.15](V2.15.md) | Aprender con el Atlas |
| [2.14](V2.14.md) | Del Adriático al mar Negro |
| [2.13](V2.13.md) | Conexiones familiares y casas alpinas |
| [2.12.2](V2.12.2.md) | Fichas estáticas e hidratación |
| [2.12](V2.12.md) | Coronas y uniones |
| [2.11](V2.11.md) | Sucesiones explicadas |

## Criterios de contenido

`personas.jsx` y `historiaData.jsx` son módulos de datos sin imports: los generadores los leen directamente con Node. Mantén sus identificadores estables. `persona.titulo` es un resumen; cada entrada de `gobiernos` debe indicar `territorio`, `titulo`, `clase`, `condicion`, `desde` y `hasta`. `reinados` conserva compatibilidad de lectura y no es otra base independiente.

Las alianzas matrimoniales tienen una categoría propia: una boda no demuestra transferencia de territorio ni origen de una rama masculina. El nombramiento de un cargo y la toma de posesión pueden llevar fechas distintas.

Una agrupación geográfica no es una soberanía. Una pretensión no equivale a gobierno efectivo. Los relevos explicados identifican mandatos concretos; nunca se generan simplemente ordenando nombres por fecha. Cada crisis documenta las reclamaciones y las filiaciones usadas para explicarlas.

Las publicaciones se incorporan una sola vez a la bibliografía general. Sus asociaciones con personajes y territorios se mantienen en el mismo registro. Una referencia contextual no prueba todos los datos de una ficha. Los retratos nuevos los aporta el responsable del proyecto: no se descargan ni sustituyen automáticamente.
