#!/usr/bin/env python3
"""Transfer the selected territorial series to EU V Locations.

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


def burgundian_jurisdictions(first_year, last_year):
    """Reuse the dated succession audit, keeping each lordship separate."""
    mapped = json.loads((HERE / "burgundian-locations.json").read_text())
    source = json.loads((HERE / "burgundian-source.json").read_text())
    if [person["id"] for person in mapped["people"]] != [person["id"] for person in source["people"]]:
        raise ValueError("Burgundian source and geometry have different people")
    for mapped_person, source_person in zip(mapped["people"], source["people"]):
        if [government["territory"] for government in mapped_person["governments"]] != [
                government["territory"] for government in source_person["governments"]]:
            raise ValueError(f"Burgundian governments differ for {mapped_person['id']}")
    names = sorted({government["territory"] for person in mapped["people"]
                    for government in person["governments"]})
    territories = []
    for name in names:
        versions = []
        nonempty_years = []
        for year in range(first_year, last_year + 1):
            ids, old_ids, borderline = set(), set(), set()
            for mapped_person, source_person in zip(mapped["people"], source["people"]):
                if not mapped_person["from"] <= year <= mapped_person["through"]:
                    continue
                for government, raw in zip(mapped_person["governments"], source_person["governments"]):
                    if government["territory"] != name or not government["from"] <= year <= government["through"]:
                        continue
                    version = next(v for v in reversed(government["versions"]) if v["from"] <= year)
                    raw_version = next(v for v in reversed(raw["versions"]) if v["from"] <= year)
                    ids.update(version["ids"])
                    old_ids.update(raw_version["oldIds"])
                    borderline.update(version["borderline"])
            if ids:
                nonempty_years.append(year)
            selected = sorted(ids)
            if not versions or selected != versions[-1]["ids"]:
                versions.append({"from": year, "oldIds": sorted(old_ids), "ids": selected,
                                 "borderline": sorted(borderline)})
        if not nonempty_years:
            continue
        note = ("Sucesión borgoñona auditada por señorío, no un único Estado. "
                "Los vacíos representan disputa, pérdida o falta de atribución; "
                "el título personal por sí solo no colorea este territorio.")
        if name == "Borgoña":
            note += " El ducado francés no se confunde con el Condado imperial de Borgoña."
        territories.append({"corridor": "Borgoña e Imperio", "name": name,
                            "color": "#8b245f", "active": {"from": nonempty_years[0],
                                "through": nonempty_years[-1], "reason": "Fuera de la etapa territorial documentada para la sucesión borgoñona en este ensayo."},
                            "note": note, "versions": versions})
    return territories, mapped["overrides"]


def main():
    source = json.loads((HERE / "corridor-source.json").read_text())
    corrections = json.loads((HERE / "corridor-overrides.json").read_text())
    corrections.extend(source.get("corrections", []))
    old_paths = paths(ROOT / "src/MapChart_Map.svg")
    new_paths = paths(HERE / "euv-locations-crop.svg")
    territories = {t["name"] for t in source["territories"]}
    corridor_old_ids = {old_id for territory in source["territories"]
                         for version in territory["versions"] for old_id in version["oldIds"]}
    missing = corridor_old_ids - old_paths.keys()
    if missing:
        raise ValueError(f"Missing old polygons: {sorted(missing)}")
    map_region_ids = set(source.get("mapRegionIds", []))
    old_ids = corridor_old_ids | (map_region_ids & old_paths.keys())
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
        output_territories.append({key: territory[key] for key in ("corridor", "name", "color", "active", "note")}
                                  | {"versions": versions})

    burgundy, burgundian_corrections = burgundian_jurisdictions(source["from"], source["through"])
    output_territories.extend(burgundy)
    hungary_balkans = json.loads((HERE / "hungary-balkans-locations.json").read_text())
    if [territory["name"] for territory in hungary_balkans["territories"]] != [
        "Núcleo oriental de Zápolya", "Hungría real", "Croacia habsbúrgica",
        "Transilvania", "Ocupación habsbúrgica de Transilvania",
        "Hungría otomana", "Bosnia y Herzegovina otomanas",
        "Balcanes meridionales otomanos", "República de Ragusa",
        "Despotado de Serbia", "Reino de Bosnia",
        "Principado de Valaquia", "Principado de Moldavia"]:
        raise ValueError("Unexpected Hungary/Balkans layers")
    additional_territories = hungary_balkans["territories"]
    balkan_corrections = [
        {"territory": evidence["territory"], "id": location_id, "action": "add",
         "from": evidence["from"], "through": evidence["through"],
         "reason": evidence["reason"], "source": evidence["source"]}
        for evidence in hungary_balkans["evidence"] for location_id in evidence["ids"]
    ]
    location_crosswalk = {
        old_id: {
            "ids": sorted(location_id for location_id, fraction in overlaps[old_id].items()
                           if fraction >= THRESHOLD),
            "borderline": sorted(location_id for location_id, fraction in overlaps[old_id].items()
                                  if .25 <= fraction < THRESHOLD),
        }
        for old_id in sorted(old_ids)
    }
    corridor_unmapped = sorted(old_id for old_id in corridor_old_ids
                               if not overlaps.get(old_id))
    crosswalk_unmapped = sorted(old_id for old_id, match in location_crosswalk.items()
                                if not match["ids"])
    missing_source_map_ids = sorted(map_region_ids - old_paths.keys())
    out = {
        "from": source["from"], "through": source["through"],
        "method": "Atlas territorial versions; >=55% of each new location inside the old territory polygon, with sourced corrections",
        "locationCrosswalk": {
            "method": "Each new location is assigned to an Atlas regional polygon when at least 55% of its area lies inside it; 25–55% matches remain review candidates.",
            "threshold": THRESHOLD,
            "newIdsByOldId": location_crosswalk,
            "unmappedOldIds": crosswalk_unmapped,
            "legacyIdsWithoutSvgPath": missing_source_map_ids,
        },
        "territories": output_territories,
        "additionalTerritories": additional_territories,
        "overrides": corrections + burgundian_corrections + balkan_corrections,
        "audit": {"oldIds": len(corridor_old_ids),
                  "crosswalkOldIds": len(old_shapes),
                  "newPathsConsidered": looked,
                  "newPathsTotal": len(new_paths),
                  "oldWithNoCandidate": corridor_unmapped,
                  "crosswalkOldWithNoCandidate": crosswalk_unmapped,
                  "legacyIdsWithoutSvgPath": missing_source_map_ids,
                  "exactNameOldIds": sum(1 for i in corridor_old_ids if i in new_paths),
                  "burgundianJurisdictionsReused": len(burgundy),
                  "hungaryBalkansJurisdictions": len(hungary_balkans["territories"]),
                  "borderlineIds": sorted({i for t in output_territories + additional_territories for v in t["versions"] for i in v["borderline"]}),
                  "sourceCaveat": "Geometric candidate coverage is not a historical border or ownership claim."}
    }
    output = HERE / "corridor-locations.json"
    output.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {output}: {len(output_territories)} territories, {len(old_shapes)} old polygons, {looked} candidate locations")
    for territory in output_territories:
        print(f"{territory['corridor']} / {territory['name']}: {len(territory['versions'])} versions, {len(territory['versions'][0]['ids'])} initial locations")


if __name__ == "__main__":
    main()
