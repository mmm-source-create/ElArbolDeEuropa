"""Measure all land touching independent geographic study windows.

The complete cell is selected, including disconnected islands. Windows never
assign historical ownership; curves use the existing locked geometry method.
"""
import argparse
import json
from shapely.geometry import Polygon, box
from shapely.ops import unary_union
from map_geometry import paths, geometry
from project_paths import DATA_DIR

parser = argparse.ArgumentParser()
parser.add_argument('definition')
parser.add_argument('output')
args = parser.parse_args()
definition = json.loads((DATA_DIR / args.definition).read_text())
shapes = {name: Polygon(points) for name, points in definition['outlines'].items()}
if definition['schema'] != 1 or any(not shape.is_valid for shape in shapes.values()):
    raise ValueError('Invalid independent geographic windows')
mask = unary_union(list(shapes.values()))
frame = box(475, 15, 790, 255)
cells = []
for name, d in sorted(paths(DATA_DIR / 'euv-locations-crop.svg').items()):
    shape = geometry(d)
    if shape is None or shape.is_empty or not shape.intersects(mask):
        continue
    visible = shape.intersection(frame)
    if visible.intersection(mask).area <= 1e-7:
        continue
    cells.append({'id': name, 'area': round(visible.area, 7),
                  'bounds': [round(v, 7) for v in visible.bounds],
                  'centroid': [round(v, 7) for v in visible.centroid.coords[0]],
                  'scopeAreas': {key: round(visible.intersection(window).area, 7)
                                 for key, window in shapes.items()
                                 if visible.intersection(window).area > 1e-7}})
result = {'schema': 1, 'source': 'euv-locations-crop.svg',
          'definition': args.definition,
          'method': 'All visible SVG land intersecting the declared independent windows, including physical relief and every island subpath. Curves sampled by map_geometry.geometry; SVG units squared, not geographic area.',
          'cells': cells}
(DATA_DIR / args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'cells': len(cells), 'windows': {key: sum(key in c['scopeAreas'] for c in cells) for key in shapes}}))
