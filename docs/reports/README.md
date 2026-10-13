# Resultados revisados

`reviewed/` conserva, sin modificar su contenido, tres informes existentes:

- `audit-atlas-coverage-report.json`: estado de cobertura aceptado con V5.5.
- `audit-regional-extents-report.json`: instantánea de las revisiones de superficies.
- `crosswalk-report.json`: candidatos por coincidencia de IDs; no acredita fronteras ni autoridad.

La continuidad territorial revisada sigue en
[`atlas-continuity-audit.json`](../atlas-continuity-audit.json) y
[su lectura](../atlas-continuity-audit.md). Son instantáneas históricas, no
indicadores de la última ejecución. Las auditorías actuales escriben en
`.cache/audits/` y el build deja estos documentos intactos.

Para adoptar una instantánea nueva, compara el informe temporal, documenta
su fecha y alcance en la PR y copia el resultado explícitamente. No renombres
una ejecución sin revisar como «revisada».

La [instantánea de V5.8](reviewed/v5.8-medieval-balkans.json) conserva las
comprobaciones medievales de Bosnia, Valaquia y Moldavia y las 40 entidades
aún sin representación efectiva. Los informes anteriores no se sobrescriben.

La [instantánea de V5.11](reviewed/v5.11-balkans.json) conserva 675.524
combinaciones de superficie/año, evidencia local, atribuciones múltiples
explicadas y comparación con el árbol anterior. Incluye el inventario
geográfico completo; no certifica fronteras municipales exactas.

La [instantánea de V5.12](reviewed/v5.12-iberia-italy.json) recoge la comprobación
de las 931 superficies de Iberia e Italia, sus 559.531 combinaciones anuales y
la comparación contra `main` 025f8a1. Los diagnósticos nuevos se escriben en
`.cache/audits/`; no se sustituyen automáticamente las instantáneas aceptadas.

La [instantánea de V5.13](reviewed/v5.13-france-low-countries.json) conserva las
640 superficies de Francia y Países Bajos, sus intervalos anteriores sin color,
la comprobación anual final y las huellas de las fuentes aceptadas.
