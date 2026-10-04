#!/usr/bin/env python3
"""Transfer Carlos V's dated Atlas jurisdictions to EU V Locations geometry.

Run the adjacent carlos-v-source.mjs first. Requires shapely and svgpathtools.
This is an overlap-derived *candidate* crosswalk, not a historical boundary
authority: the output records incomplete and split matches for review.
"""

from __future__ import annotations

import argparse
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

try:
    from shapely.geometry import Polygon
    from shapely.ops import unary_union
    from shapely.strtree import STRtree
    from svgpathtools import parse_path
except ImportError as exc:
    raise SystemExit("Install shapely and svgpathtools to regenerate the crosswalk") from exc

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))
from crop_svg import bounds, intersects  # noqa: E402


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
            # Curves need intermediate samples; MapChart's arcs are generally
            # short. This is geometrically approximate but finer than its SVG
            # strokes and is checked again on rendered maps.
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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tags", type=Path, help="Optional pasted user location-ID list to validate")
    args = parser.parse_args()
    source = json.loads((HERE / "carlos-v-source.json").read_text())
    overrides = json.loads((HERE / "carlos-v-overrides.json").read_text())
    old_paths = paths(ROOT / "src/MapChart_Map.svg")
    new_paths = paths(HERE / "euv-locations-crop.svg")
    known_territories = {reign["territory"] for reign in source["reigns"]}
    for item in overrides:
        if item["territory"] not in known_territories or item["id"] not in new_paths:
            raise ValueError(f"Invalid override: {item}")
    old_ids = {item for reign in source["reigns"] for version in reign["versions"] for item in version["oldIds"]}
    missing_old = sorted(old_ids - old_paths.keys())
    if missing_old:
        raise ValueError(f"Old map IDs missing: {missing_old}")
    old_shapes = {item: geometry(old_paths[item]) for item in sorted(old_ids)}
    old_shapes = {item: geom for item, geom in old_shapes.items() if geom is not None}
    old_boxes = {item: geom.bounds for item, geom in old_shapes.items()}
    tree_ids = list(old_shapes)
    tree = STRtree([old_shapes[item] for item in tree_ids])
    overlaps: dict[str, dict[str, float]] = {item: {} for item in old_shapes}
    split: list[dict] = []
    looked = 0
    for new_id, d in new_paths.items():
        box = bounds(d)
        if not any(intersects(box, old_boxes[item]) for item in old_shapes):
            continue
        shape = geometry(d)
        if shape is None or shape.area < 1e-7:
            continue
        looked += 1
        hits = []
        for index in tree.query(shape):
            old_id = tree_ids[int(index)]
            amount = shape.intersection(old_shapes[old_id]).area / shape.area
            if amount >= 0.03:
                overlaps[old_id][new_id] = round(min(1, amount), 4)
                hits.append((old_id, amount))
        if len(hits) > 1 and max(amount for _, amount in hits) < 0.75:
            split.append({"id": new_id, "old": [{"id": item, "fraction": round(amount, 3)} for item, amount in sorted(hits, key=lambda x: -x[1])]})
    coverage = []
    for reign in source["reigns"]:
        versions = []
        for year in range(reign["from"], min(reign["through"], 1555) + 1):
            version = next(item for item in reversed(reign["versions"]) if item["from"] <= year)
            aggregate: dict[str, float] = {}
            for old_id in version["oldIds"]:
                for new_id, fraction in overlaps.get(old_id, {}).items():
                    aggregate[new_id] = min(1, aggregate.get(new_id, 0) + fraction)
            selected = {new_id for new_id, fraction in aggregate.items() if fraction >= 0.55}
            for item in overrides:
                if item["territory"] != reign["territory"] or not item["from"] <= year <= item["through"]:
                    continue
                if item["action"] == "add":
                    selected.add(item["id"])
                elif item["action"] == "remove":
                    selected.discard(item["id"])
                else:
                    raise ValueError(f"Invalid override action: {item}")
            ids = sorted(selected)
            uncertain = sorted(new_id for new_id, fraction in aggregate.items() if 0.25 <= fraction < 0.55)
            if not versions or ids != versions[-1]["ids"]:
                versions.append({"from": year, "ids": ids, "borderline": uncertain})
        coverage.append({key: reign[key] for key in ("territory", "group", "from", "through", "condition", "scope")}
                        | {"versions": versions})
    conflicts = []
    for year in range(1506, 1556):
        assignments: dict[str, set[str]] = {}
        for reign in coverage:
            if not reign["from"] <= year <= reign["through"]:
                continue
            current = next(item for item in reversed(reign["versions"]) if item["from"] <= year)
            for new_id in current["ids"]:
                assignments.setdefault(new_id, set()).add(reign["group"])
        conflicts.extend({"year": year, "id": new_id, "groups": sorted(groups)}
                         for new_id, groups in assignments.items() if len(groups) > 1)
    tags_audit = None
    if args.tags:
        raw = args.tags.read_text().strip().strip(",")
        user_tags = set(json.loads("[" + raw + "]"))
        used = {new_id for reign in coverage for version in reign["versions"] for new_id in version["ids"]}
        tags_audit = {"supplied": len(user_tags), "presentInCrop": len(user_tags & new_paths.keys()),
                      "mappedNotInSuppliedList": sorted(used - user_tags)}
    output = {"person": source["person"], "personId": source["personId"],
              "method": "new location area overlapping old mapped provinces ≥55%; borderline 25–55% excluded",
              "territories": coverage,
              "overrides": overrides,
              "audit": {"oldIds": len(old_shapes), "newPathsConsidered": looked,
                        "newPathsTotal": len(new_paths), "splitCandidates": split[:200],
                        "oldWithNoMatch": sorted(item for item, hits in overlaps.items() if not hits),
                        "crossGroupConflicts": conflicts, "userTags": tags_audit}}
    file = HERE / "carlos-v-locations.json"
    file.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {file}: {len(coverage)} jurisdictions, {looked} candidate locations, {len(split)} split geometries, {len(conflicts)} cross-group conflicts")
    for reign in coverage:
        print(f"{reign['territory']}: {len(reign['versions'][0]['ids'])} locations at first dated state")


if __name__ == "__main__":
    main()
