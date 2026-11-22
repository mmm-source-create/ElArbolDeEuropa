# Revisión documental y transporte de 6.0.20

`curate.mjs` enumera únicamente las afirmaciones contrastadas con los pasajes indicados. Comprueba que existen, que estaban pendientes y que la relación coincide con la persona registrada. Produce `reviews620.json`, sus valores de control y las asociaciones bibliográficas. Las bodas inversas se aprueban por separado cuando seguían pendientes. No se incorporan afirmaciones por coincidencia automática de un nombre ni por compartir una corona.

Los artículos institucionales se consultaron el 22 de noviembre de 2026. Las URL y huellas de su HTML están en `docs/reports/6.0.20-source-checks.json`; las exclusiones se explican en `docs/reports/6.0.20-documentacion.md`. `fetch.mjs` descarga una lista explícita de URL con identificación del proyecto y pausa entre consultas; `batch.mjs` acepta un archivo JSON con URL. Los textos completos quedan en `.cache/research620/`, fuera del repositorio.

```sh
node scripts/research/v620/curate.mjs
```

Tras generar y compilar la web completa, la medición comprueba igualdad de los registros, reconstruye cada documento con JSON ordinario y compara su gzip con el HTML publicado. Incluye Carlos V y una ficha de cada cien en orden alfabético; separa la compactación candidata del formato elegido. Guarda `outputs/6.0.20/transport.json`.

```sh
node scripts/research/v620/measure-transport.mjs public
```

Un segundo directorio opcional permite comparar también el catálogo generado por 6.0.19. La comparación exige que todas las tarjetas sean idénticas salvo el resumen retirado:

```sh
node scripts/research/v620/measure-transport.mjs public /ruta/a/6.0.19/public
```

Las medidas aceptadas de la entrega se conservan en `docs/releases/6.0.20-performance.json`. Los valores negativos de un candidato no significan que se publique: la compilación compara ambos HTML completos y mantiene el que tenga menor gzip.
