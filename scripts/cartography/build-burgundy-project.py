"""Illustrative location map of the 1473 proposal; never an annual ownership map.

Run with .venv-cartography/bin/python. Background: the Atlas's MapChart source,
CC BY-SA 4.0. Locations follow the named principalities in Jongkees, pp. 326–327.
Symbols locate jurisdictions; they do not invent borders for an unrealised realm.
"""
from pathlib import Path
from html import escape
from map_geometry import paths, geometry
from crop_svg import bounds, intersects

ROOT=Path(__file__).resolve().parents[2]
polygons=paths(ROOT/'data/cartography/MapChart_Map.svg')
frame=(545,121,620,174)
background=''.join(f'<path d="{escape(d)}"/>' for d in polygons.values() if intersects(bounds(d),frame))
def centre(key):
    point=geometry(polygons[key]).centroid
    return point.x,point.y

# Stable anchor locations, with separate label columns and leaders.
locations=[
 ('core','North_Holland',0,0,'Países Bajos imperiales','Imperial Low Countries',561,125),
 ('core','Gelderland',0,0,'Güeldres','Guelders',596,127),
 ('vassal','South_Holland',1.3,-1.8,'Utrecht','Utrecht',561,130),
 ('vassal','Niederrhein',-.5,0,'Cléveris','Cleves',596,132),
 ('french','West_Flanders',0,0,'Flandes y Artois','Flanders and Artois',561,137),
 ('vassal','Liege',0,0,'Lieja','Liège',596,138),
 ('core','East_Luxembourg',0,0,'Luxemburgo','Luxembourg',561,143),
 ('meeting','Hunsruck',-.3,-.5,'Tréveris · negociación','Trier · negotiations',596,143),
 ('vassal','Verdunois',0,0,'Verdún','Verdun',561,148),
 ('vassal','Pays_Nancy',-.7,-.3,'Toul','Toul',596,148),
 ('vassal','Pays_Nancy',.4,.4,'Lorena','Lorraine',596,153),
 ('french','Dijonnais',0,0,'Ducado de Borgoña','Duchy of Burgundy',561,157),
 ('core','Amont',0,0,'Condado de Borgoña','County of Burgundy',596,160),
 ('vassal','Savoy',0,0,'Saboya','Savoy',596,168),
]
colors={'core':'#843e4a','french':'#af7c2e','vassal':'#32697d','meeting':'#34302d'}
out=ROOT/'public/historias';out.mkdir(exist_ok=True)
for locale in ('es','en'):
 title='Proyecto de reino de Borgoña · 1473' if locale=='es' else 'Proposed Kingdom of Burgundy · 1473'
 desc='Localización de dominios y principados mencionados en la negociación de Tréveris. Los símbolos no representan fronteras.' if locale=='es' else 'Locations of lands and principalities named in the Trier negotiations. Symbols do not represent borders.'
 symbols=[]
 for kind,key,dx,dy,es,en,lx,ly in locations:
  x,y=centre(key);x+=dx;y+=dy
  label=es if locale=='es' else en
  anchor='end' if lx<x else 'start'
  tip=lx+(.15 if anchor=='start' else -.15)
  symbols.append(f'<g><path d="M{x:.3f},{y:.3f} L{tip},{ly-.3}" stroke="{colors[kind]}" stroke-width=".08" fill="none"/><circle cx="{x:.3f}" cy="{y:.3f}" r=".46" fill="{colors[kind]}" stroke="#fffdf6" stroke-width=".12"/><text x="{lx}" y="{ly}" text-anchor="{anchor}">{escape(label)}</text></g>')
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="545 121 75 53" role="img" aria-labelledby="title desc"><title id="title">{title}</title><desc id="desc">{desc}</desc><metadata>MapChart.net, CC BY-SA 4.0. Adaptation: El Árbol de Europa. Historical proposal: A. G. Jongkees, Charles le Téméraire et la souveraineté, pp. 326–327. Location symbols only.</metadata><rect x="545" y="121" width="75" height="53" fill="#dbe9eb"/><g fill="#eee8db">{background}</g><g font-family="Georgia,serif" font-size="1.2" fill="#302b25" paint-order="stroke" stroke="#fffdf6" stroke-width=".15" stroke-linejoin="round">{''.join(symbols)}</g></svg>'''
 (out/f'borgona-proyecto-1473-{locale}.svg').write_text(svg)
print('Proyecto de 1473: mapas de localización ES/EN; sin cambios en la cartografía anual.')
