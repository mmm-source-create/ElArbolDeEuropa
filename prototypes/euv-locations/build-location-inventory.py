"""Measure every retained location, including mountains and boundary slivers.

Clipped geometry describes visibility in this SVG, not historical jurisdiction.
Run with the project's research geometry environment (Shapely/svgpathtools).
"""
import json
from pathlib import Path
from shapely.geometry import box
from map_geometry import paths, geometry

HERE = Path(__file__).resolve().parent
frame = box(475, 15, 790, 255)
cells = []
for name, path in sorted(paths(HERE / 'euv-locations-crop.svg').items()):
    shape = geometry(path)
    visible = shape.intersection(frame) if shape is not None else None
    cell = {'id': name, 'visible': visible is not None and visible.area > 1e-7}
    if cell['visible']:
        cell.update(area=round(visible.area, 7),
                    bounds=[round(n, 7) for n in visible.bounds],
                    centroid=[round(n, 7) for n in visible.centroid.coords[0]])
    cells.append(cell)
(HERE / 'location-inventory.json').write_text(json.dumps({
    'source': 'euv-locations-crop.svg', 'frame': [475, 15, 790, 255],
    'units': 'SVG coordinate units squared; visible clipped area',
    'method': 'map_geometry.geometry; sampled curves; includes all retained paths',
    'cells': cells,
}, ensure_ascii=False, indent=2) + '\n')
print(f'{len(cells)} paths measured; {sum(c["visible"] for c in cells)} visible cells')
