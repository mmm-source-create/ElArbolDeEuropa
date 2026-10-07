"""Reproduce the spatial inventory of every cell in the regional review.

Uses the same SVG curve sampling as the existing spatial audit. Areas are in
SVG coordinate units, never kilometres or claims of exact historical borders.
Requires the existing geometry environment (Shapely and svgpathtools).
"""
import json
from pathlib import Path
from map_geometry import paths, geometry

HERE = Path(__file__).resolve().parent
review = json.loads((HERE / 'regional-extent-review.json').read_text())
used = {cell for layer in review['replacements'] + review['territories']
        for version in layer['versions'] for cell in version['ids']}
used.update(item['id'] for item in review['overrides'])
source = paths(HERE / 'euv-locations-crop.svg')
cells = []
for cell in sorted(used):
    if cell not in source:
        raise ValueError('Unknown SVG cell: ' + cell)
    shape = geometry(source[cell])
    if shape is None or shape.is_empty:
        raise ValueError('Unmeasurable SVG cell: ' + cell)
    cells.append({'id': cell, 'area': round(shape.area, 7),
                  'bounds': [round(value, 7) for value in shape.bounds],
                  'centroid': [round(value, 7) for value in shape.centroid.coords[0]]})
(HERE / 'regional-extent-cells.json').write_text(json.dumps({
    'source': 'euv-locations-crop.svg', 'units': 'SVG coordinate units squared',
    'method': 'map_geometry.geometry: sampled SVG curves; per-cell area, not geographic area',
    'cells': cells,
}, ensure_ascii=False, indent=2) + '\n')
print(f'{len(cells)} regional cells measured from the actual SVG')
