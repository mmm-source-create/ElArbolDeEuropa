"""Reproducible inventory of visible SVG land intersecting a declared window.
Run with research/geometry-env/bin/python (Shapely and svgpathtools).
Geometry approximates SVG curves with four subdivisions per segment. Units are
SVG units, not km². The inventory is independent of layer membership.
"""
import json,sys
from pathlib import Path
from shapely.geometry import box
from map_geometry import paths,geometry
HERE=Path(__file__).resolve().parent
RESEARCH=HERE.parent.parent.parent/'research'
DEFINITIONS=[
    ('Ventana espacial amplia de Hungría y sureste europeo; incluye partes de Anatolia y Ucrania, no sólo los Balcanes.',[600,137,83,72]),
    ('Marco focal de Hungría, Croacia, Transilvania, Serbia, Bulgaria occidental y Grecia continental. Incluye una franja occidental de Anatolia y no representa sólo los Balcanes estrictos.',[609,150,48,56]),
]
windows=[{'scope':scope,'bbox':bbox,'method':'Todos los path terrestres de #map, independientes de las capas políticas. Curvas subdivididas en cuatro; área recortada con Shapely a la ventana, unidades SVG².','cells':[]} for scope,bbox in DEFINITIONS]
shapes=[box(b[0],b[1],b[0]+b[2],b[1]+b[3]) for _,b in DEFINITIONS]
for id,d in paths(HERE/'euv-locations-crop.svg').items():
    g=geometry(d)
    if g is None or g.is_empty:continue
    for window,shape in zip(windows,shapes):
        if not g.intersects(shape):continue
        visible=g.intersection(shape)
        if visible.area<0.0001:continue
        window['cells'].append({'id':id,'area':round(g.area,7),'centroid':[round(v,7) for v in g.centroid.coords[0]],'bounds':[round(v,7) for v in g.bounds],'visibleArea':round(visible.area,7),'physical':any(t in id.lower() for t in ['mountain','alps','carpathian']) or id.startswith('Mount_')})
result={**windows[0],'windows':windows}
(HERE/'balkan-spatial-cells.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps([{'scope':w['scope'],'cells':len(w['cells']),'physical':sum(c['physical'] for c in w['cells'])} for w in windows],ensure_ascii=False))
