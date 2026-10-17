# Cartografía aceptada

Inventarios, revisiones y geometría que consume el Atlas:

- celdas de EU V Locations (`euv-locations-crop.svg`, `location-inventory.json`);
- superficies anuales (`corridor-locations.json` y las revisiones regionales `*-review.json`);
- el SVG antiguo `MapChart_Map.svg`, que se conserva como referencia geométrica.

Se regeneran con `scripts/cartography/` en una copia (`EADE_MAP_DATA_DIR`; véase
[python-cartography](../../docs/python-cartography.md)). Solo se adopta un resultado
revisado. Cada archivo está clasificado en el [catálogo](../../docs/artifact-catalog.json).

Los visores de revisión y la procedencia de cada capa están en
[labs/cartografía](../../labs/cartography/README.md).
