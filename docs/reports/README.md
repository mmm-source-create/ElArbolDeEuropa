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
