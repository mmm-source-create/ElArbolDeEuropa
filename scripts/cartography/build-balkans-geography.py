"""Inventory every land cell intersecting independently declared geographic windows.

Selection is independent of layers, titles and whether a cell has ever been
painted. Touching a window selects the complete cell, including every island
subpath; the window and its area never assign historical ownership.
"""
import json
from shapely.geometry import Polygon, box
from shapely.ops import unary_union
from map_geometry import paths, geometry
from project_paths import DATA_DIR

definition = json.loads((DATA_DIR / 'balkans-geography.json').read_text())
shapes = {name: Polygon(points) for name, points in definition['outlines'].items()}
if any(not shape.is_valid for shape in shapes.values()):
    raise ValueError('Invalid geographic window')
mask = unary_union(list(shapes.values()))
frame = box(475, 15, 790, 255)
cells = []
for name, d in sorted(paths(DATA_DIR / 'euv-locations-crop.svg').items()):
    shape = geometry(d)
    if shape is None or shape.is_empty or not shape.intersects(mask):
        continue
    visible = shape.intersection(frame)
    area = visible.intersection(mask).area
    if area <= 1e-7:
        continue
    cells.append({'id': name, 'area': round(visible.area, 7),
                  'bounds': [round(v, 7) for v in visible.bounds],
                  'centroid': [round(v, 7) for v in visible.centroid.coords[0]],
                  'scopeAreas': {key: round(visible.intersection(window).area, 7)
                                 for key, window in shapes.items()
                                 if visible.intersection(window).area > 1e-7}})
result = {'schema': 1, 'source': 'euv-locations-crop.svg',
          'definition': 'balkans-geography.json',
          'method': 'All visible SVG land intersecting the declared windows, including physical relief and every island subpath. Curves sampled by map_geometry.geometry; SVG units squared, not geographic area.',
          'cells': cells}
(DATA_DIR / 'balkans-geographic-cells.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'cells': len(cells), 'windows': {key: sum(key in c['scopeAreas'] for c in cells) for key in shapes}}))
