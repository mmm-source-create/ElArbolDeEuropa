# Documentación

La guía vigente está separada de las notas históricas. Para instalar y
compilar, empieza por el [README del proyecto](../README.md).

## Uso y mantenimiento

- [Uso del Atlas, historias y desafíos](ATLAS.md).
- [Contrato de personas, mandatos y cartografía](data-model.md).
- [Añadir o corregir una persona](contributing-people.md).
- [Comprobar regresiones y revisar cambios intencionados](v5-regression.md).
- [Herramientas y comandos actuales](../scripts/README.md).
- [Entorno Python reproducible](python-cartography.md).
- [Política de seguridad](../SECURITY.md).

## Metodología y procedencia

- [Fuentes, evidencia y límites](https://www.treeofeurope.eu/es/fuentes).
- Bibliografía compartida: [`src/content/sources.js`](../src/content/sources.js).
  Revisiones por afirmación: [`src/evidence/`](../src/evidence/).
- [Clasificación de fuentes, resultados revisados y temporales](artifacts.md)
  y [catálogo de archivos](artifact-catalog.json).
- [Laboratorio cartográfico y procedencia de sus capas](../prototypes/euv-locations/README.md).
- [Capetos](CAPETOS.md), [Irlanda](CARTOGRAFIA_IRLANDA.md),
  [Borgoña](CARTOGRAFIA_BORGONA.md), [Iberia e Italia](CARTOGRAFIA_IBERIA_ITALIA.md)
  y [Sacro Imperio y tierras austríacas](CARTOGRAFIA_SACRO_IMPERIO.md).

## Resultados de revisión

Los [informes aceptados](reports/README.md) son instantáneas de una revisión,
no auditorías ejecutadas hoy. Los nuevos diagnósticos se guardan en
`.cache/audits/`. La [continuidad](atlas-continuity-audit.md),
las [fronteras](atlas-frontier-review.md) y el [inventario territorial](atlas-unrepresented-inventory.md)
conservan el contexto y los límites de sus entregas. Sus cifras deben
interpretarse con la fecha y versión del documento.

## Versiones

- [V5.11: Balcanes y continuidad otomana](V5.11.md).
- [V5.12: Iberia, Italia y estados tributarios](V5.12.md).
- [Índice cronológico completo y GitHub Releases](releases.md).
- [V5.10: Kozara–Glaž, costa ragusea y Ko-fi](V5.10.md).
- [V5.9: Bosnia, Hum y continuidad regional](V5.9.md).
- [V5.8: continuidad balcánica medieval](V5.8.md).
- [V5.7: modelo canónico y cierre documental](V5.7.md).
- [V5.6: herramientas reproducibles](V5.6.md).
- [V5.5: gobernaciones documentadas](V5.5.md).
- [Manifiestos de antiguos ZIP](archive/manifests/README.md).

Los documentos `V*.md` se conservan como historial. Las decisiones metodológicas
vigentes están en las guías anteriores; las notas de cada versión describen
el estado que se verificó entonces.

## Criterios de contenido

`personas.jsx` y `historiaData.jsx` son datos sin imports. Conserva IDs y slugs
estables. `persona.titulo` resume la ficha; cada mandato de `gobiernos[]`
tiene su territorio, título real, clase, condición e intervalo. Desde V5.7
ni la fuente ni las fichas públicas crean `reinados` como segunda propiedad.

Una asociación geográfica no acredita soberanía. Una boda no demuestra
transferencia territorial ni origen de una rama masculina. Nombramiento,
toma de posesión y control efectivo pueden tener fechas distintas. Las
sucesiones se documentan mediante mandatos concretos, no ordenando nombres.

Una referencia contextual no verifica toda una ficha. Cada dato citado necesita
su afirmación y pasaje propios; la incertidumbre no se elimina al validar
estructuras. La bibliografía se registra una sola vez y conserva las asociaciones
con personas y territorios. Los retratos nuevos los aporta el responsable del
proyecto: no se descargan ni sustituyen automáticamente.

La [cartografía subregional propuesta](V4.8_PROPUESTAS.md) y la investigación
de huecos e identidades siguen como trabajo histórico independiente del
cierre de la serie V5.

- [V5.13: Francia, Borgoña y Países Bajos](V5.13.md).
