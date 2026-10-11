"""Shared, approximate geometric crosswalk between MapChart SVG editions.

These functions locate candidate polygons. Historical ownership must be
checked separately against dated sources before publication.
"""

import xml.etree.ElementTree as ET
from pathlib import Path

from shapely.geometry import Polygon
from shapely.ops import unary_union
from svgpathtools import parse_path


def paths(file: Path) -> dict[str, str]:
    root = ET.parse(file).getroot()
    map_element = root.find(".//{*}svg[@id='map']")
    if map_element is None:
        raise ValueError(f"No MapChart #map in {file}")
    return {p.attrib["id"]: p.attrib["d"] for p in map_element.findall("{*}path") if "id" in p.attrib}


def geometry(d: str):
    polygons = []
    for subpath in parse_path(d).continuous_subpaths():
        coords = []
        for segment in subpath:
            # Short SVG curves are sampled for an overlap estimate, not a
            # replacement for historical boundary surveys.
            steps = 1 if segment.__class__.__name__ == "Line" else 4
            coords.extend((segment.point(i / steps).real, segment.point(i / steps).imag)
                          for i in range(steps))
        if len(coords) < 3:
            continue
        shape = Polygon(coords)
        if not shape.is_valid:
            shape = shape.buffer(0)
        if not shape.is_empty and shape.area > 1e-7:
            polygons.append(shape)
    return unary_union(polygons) if polygons else None
