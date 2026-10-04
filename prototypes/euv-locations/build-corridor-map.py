#!/usr/bin/env python3
"""Transfer the existing Iberian and Italian territory series to EU V Locations.

The 55% location-area overlap identifies candidates. All old regions and
ambiguous location matches are retained for visual and historical review.
Requires shapely and svgpathtools in the generator environment.
"""

from __future__ import annotations

import json
from pathlib import Path

from shapely.strtree import STRtree

from crop_svg import bounds, intersects
from map_geometry import paths, geometry

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
THRESHOLD = .55


def main():
    source = json.loads((HERE / "corridor-source.json").read_text())
    corrections = json.loads((HERE / "corridor-overrides.json").read_text())
    old_paths = paths(ROOT / "src/MapChart_Map.svg")
    new_paths = paths(HERE / "euv-locations-crop.svg")
    territories = {t["name"] for t in source["territories"]}
    old_ids = {old_id for territory in source["territories"]
               for version in territory["versions"] for old_id in version["oldIds"]}
    missing = old_ids - old_paths.keys()
    if missing:
        raise ValueError(f"Missing old polygons: {sorted(missing)}")
    for item in corrections:
        if item["territory"] not in territories or item["id"] not in new_paths:
            raise ValueError(f"Invalid correction: {item}")
        if item["action"] not in {"add", "remove"} or not source["from"] <= item["from"] <= item["through"] <= source["through"]:
            raise ValueError(f"Invalid correction dates or action: {item}")
        if not item.get("reason") or not item.get("source"):
            raise ValueError(f"Unexplained correction: {item}")

    old_shapes = {old_id: geometry(old_paths[old_id]) for old_id in sorted(old_ids)}
    old_shapes = {old_id: shape for old_id, shape in old_shapes.items() if shape is not None}
    old_boxes = {old_id: shape.bounds for old_id, shape in old_shapes.items()}
    tree_ids = list(old_shapes)
    tree = STRtree([old_shapes[old_id] for old_id in tree_ids])
    overlaps: dict[str, dict[str, float]] = {old_id: {} for old_id in old_shapes}
    looked = 0
    for location_id, d in new_paths.items():
        box = bounds(d)
        if not any(intersects(box, old_boxes[old_id]) for old_id in old_shapes):
            continue
        shape = geometry(d)
        if shape is None or shape.area < 1e-7:
            continue
        looked += 1
        for index in tree.query(shape):
            old_id = tree_ids[int(index)]
            fraction = shape.intersection(old_shapes[old_id]).area / shape.area
            if fraction >= .03:
                overlaps[old_id][location_id] = round(min(1, fraction), 4)

    score_cache = {}
    for territory in source["territories"]:
        for version in territory["versions"]:
            old_key = tuple(version["oldIds"])
            if old_key in score_cache:
                continue
            scores = {}
            for old_id in old_key:
                for location_id, fraction in overlaps[old_id].items():
                    scores[location_id] = min(1, scores.get(location_id, 0) + fraction)
            score_cache[old_key] = scores

    output_territories = []
    for territory in source["territories"]:
        versions = []
        for year in range(source["from"], source["through"] + 1):
            old_version = next(v for v in reversed(territory["versions"]) if v["from"] <= year)
            scores = score_cache[tuple(old_version["oldIds"])]
            active = territory["active"]
            is_active = active is None or active.get("from", source["from"]) <= year <= active.get("through", source["through"])
            ids = {location_id for location_id, fraction in scores.items() if fraction >= THRESHOLD} if is_active else set()
            for item in corrections:
                if not is_active or item["territory"] != territory["name"] or not item["from"] <= year <= item["through"]:
                    continue
                if item["action"] == "add":
                    ids.add(item["id"])
                else:
                    ids.discard(item["id"])
            selected = sorted(ids)
            if not versions or selected != versions[-1]["ids"]:
                versions.append({"from": year, "oldIds": old_version["oldIds"],
                                 "ids": selected,
                                 "borderline": sorted(i for i, fraction in scores.items() if .25 <= fraction < THRESHOLD) if is_active else []})
        output_territories.append({key: territory[key] for key in ("corridor", "name", "color", "active")}
                                  | {"versions": versions})

    out = {
        "from": source["from"], "through": source["through"],
        "method": "Atlas territorial versions; >=55% of each new location inside the old territory polygon, with sourced corrections",
        "territories": output_territories, "overrides": corrections,
        "audit": {"oldIds": len(old_shapes), "newPathsConsidered": looked,
                  "newPathsTotal": len(new_paths),
                  "oldWithNoCandidate": sorted(i for i, hits in overlaps.items() if not hits),
                  "exactNameOldIds": sum(1 for i in old_shapes if i in new_paths),
                  "borderlineIds": sorted({i for t in output_territories for v in t["versions"] for i in v["borderline"]}),
                  "sourceCaveat": "Geometric candidate coverage is not a historical border or ownership claim."}
    }
    output = HERE / "corridor-locations.json"
    output.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {output}: {len(output_territories)} territories, {len(old_shapes)} old polygons, {looked} candidate locations")
    for territory in output_territories:
        print(f"{territory['corridor']} / {territory['name']}: {len(territory['versions'])} versions, {len(territory['versions'][0]['ids'])} initial locations")


if __name__ == "__main__":
    main()
