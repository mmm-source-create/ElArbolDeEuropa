#!/usr/bin/env python3
"""Create a geographically trimmed EU V Locations SVG without changing the Atlas map.

Usage: python3 crop_svg.py /path/to/MapChart_Map.svg
The source is a MapChart EU V Locations export. Only paths intersecting the
European/Mediterranean frame are retained; the SVG viewBox clips boundary paths.
"""

from __future__ import annotations

import argparse
import re
import xml.etree.ElementTree as ET
from pathlib import Path

SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
ET.register_namespace("cc", "http://creativecommons.org/ns#")
ET.register_namespace("dc", "http://purl.org/dc/elements/1.1/")
ET.register_namespace("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")

# Tested against Keflavik/Isafjordur, Hammerfest/Kirkenes, Urals/Pervouralsk,
# Agadir/Dakhla, Cairo/Jerusalem/Baghdad and Isfahan. Coordinates are in the
# source's world viewBox. The frame preserves the full relevant coastlines.
FRAME = (475.0, 15.0, 790.0, 255.0)
TOKEN = re.compile(r"[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[Ee][-+]?\d+)?")
ARGC = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7}


def bounds(path: str) -> tuple[float, float, float, float]:
    """Conservative path bounds, including Bézier handles and arc radii."""
    tokens = TOKEN.findall(path)
    i = 0
    command = ""
    x = y = sx = sy = 0.0
    xmin = ymin = float("inf")
    xmax = ymax = float("-inf")

    def add(px: float, py: float) -> None:
        nonlocal xmin, ymin, xmax, ymax
        xmin, ymin = min(xmin, px), min(ymin, py)
        xmax, ymax = max(xmax, px), max(ymax, py)

    while i < len(tokens):
        if tokens[i].isalpha():
            command = tokens[i]
            i += 1
            if command.upper() == "Z":
                x, y = sx, sy
                add(x, y)
                command = ""
                continue
        if not command:
            raise ValueError("SVG path lacks a command")
        upper = command.upper()
        n = ARGC[upper]
        if i + n > len(tokens) or any(t.isalpha() for t in tokens[i:i+n]):
            raise ValueError(f"Incomplete {command} in SVG path")
        a = [float(t) for t in tokens[i:i+n]]
        i += n
        ox, oy = x, y
        rel = command.islower()
        if upper in ("M", "L", "T"):
            x, y = a[0] + (ox if rel else 0), a[1] + (oy if rel else 0)
            if upper == "M":
                sx, sy = x, y
                command = "l" if rel else "L"
        elif upper == "H":
            x = a[0] + (ox if rel else 0)
        elif upper == "V":
            y = a[0] + (oy if rel else 0)
        elif upper in ("C", "S", "Q"):
            for j in range(0, n, 2):
                px = a[j] + (ox if rel else 0)
                py = a[j+1] + (oy if rel else 0)
                add(px, py)
            x = a[-2] + (ox if rel else 0)
            y = a[-1] + (oy if rel else 0)
        elif upper == "A":
            x = a[5] + (ox if rel else 0)
            y = a[6] + (oy if rel else 0)
            # Arc extrema can lie beyond endpoints; keeping extra paths is safe.
            rx, ry = abs(a[0]), abs(a[1])
            for px, py in ((ox-rx, oy-ry), (ox+rx, oy+ry), (x-rx, y-ry), (x+rx, y+ry)):
                add(px, py)
        add(x, y)
    return xmin, ymin, xmax, ymax


def intersects(a: tuple[float, float, float, float], b: tuple[float, float, float, float]) -> bool:
    return a[0] <= b[2] and a[2] >= b[0] and a[1] <= b[3] and a[3] >= b[1]


def crop(source: Path, output: Path) -> tuple[int, int]:
    tree = ET.parse(source)
    root = tree.getroot()
    map_svg = root.find(f"./{{{SVG}}}g[@id='map-group']/{{{SVG}}}svg[@id='map']")
    if map_svg is None:
        raise ValueError("Expected a MapChart SVG with map-group/map")
    paths = list(map_svg.findall(f"{{{SVG}}}path"))
    if len(paths) < 20000:
        raise ValueError(f"Expected EU V Locations geometry; found only {len(paths)} paths")
    keep = 0
    for element in paths:
        if intersects(bounds(element.attrib["d"]), FRAME):
            keep += 1
            # The MapChart export uses black borders for every small location.
            # Keep the base map quiet; the prototype applies political colour
            # only to selected locations and never draws feudal outlines.
            element.set("fill", "#d8d6ce")
            element.set("stroke", "#d8d6ce")
            element.set("stroke-width", "0.08")
            element.set("style", "fill:#d8d6ce;stroke:#d8d6ce;stroke-width:0.08")
        else:
            map_svg.remove(element)
    x0, y0, x1, y1 = FRAME
    root.set("viewBox", f"{x0:g} {y0:g} {x1-x0:g} {y1-y0:g}")
    root.set("width", "1260")
    root.set("height", "960")
    root.set("style", "background-color:#faf7ef")
    background = root.find(f"{{{SVG}}}rect[@id='svg-background']")
    if background is not None:
        background.set("x", str(x0))
        background.set("y", str(y0))
        background.set("width", str(x1-x0))
        background.set("height", str(y1-y0))
        background.set("fill", "#faf7ef")
    credit = root.find(f"{{{SVG}}}text[@id='credit-text-svg']/{{{SVG}}}tspan")
    if credit is not None:
        credit.set("x", str(x1-3))
        credit.set("y", str(y1-2))
        credit.set("text-anchor", "end")
        credit.set("font-size", "2.3")
    output.parent.mkdir(parents=True, exist_ok=True)
    tree.write(output, encoding="utf-8", xml_declaration=True)
    return len(paths), keep


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, default=Path(__file__).with_name("euv-locations-crop.svg"))
    args = parser.parse_args()
    total, kept = crop(args.source, args.output)
    print(f"Retained {kept:,}/{total:,} location paths ({kept/total:.1%}); {args.output.stat().st_size:,} bytes")
