#!/usr/bin/env python3
"""Build a dated EU V Locations map of the Burgundian succession.

Run burgundian-source.mjs first. Geometry produces candidates; exclusions and
historic changes are kept explicit so an overlap never becomes proof of rule.
"""

from __future__ import annotations

import json
from pathlib import Path

from shapely.strtree import STRtree

from crop_svg import bounds, intersects
from map_geometry import paths, geometry

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def overrides():
    inherited = json.loads((HERE / "carlos-v-overrides.json").read_text())
    # Stable geographic corrections carry back to the previous rulers. The
    # change of political authority is still determined by their dated record.
    earlier = {"Holanda", "Flandes", "Brabante", "Artois", "Limburgo",
               "Zelanda", "Güeldres", "Señorío de Malinas",
               "Condado de Borgoña", "Luxemburgo"}
    result = []
    for item in inherited:
        if item["territory"] not in earlier | {"Utrecht", "Tournaisis", "Señorío de Cuijk"}:
            continue
        changed = dict(item)
        if item["territory"] in earlier:
            changed["from"] = 1419
            changed["reason"] += " Geographic correction reused for the Burgundian succession."
        result.append(changed)
    result.extend([
        {"territory": "Ponthieu", "id": "Calais", "action": "remove", "from": 1419, "through": 1555,
         "reason": "Calais was held by England from 1347 to 1558, not by the Burgundian count of Ponthieu.",
         "source": "https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/"},
        {"territory": "Ponthieu", "id": "Boulogne_Sur_Mer", "action": "remove", "from": 1419, "through": 1555,
         "reason": "Boulogne was a separate county; its union with this lordship cannot be assumed from an overlapping old polygon.",
         "source": "https://inventaire.hautsdefrance.fr/dossier/IA62005335"},
        *({"territory": "Auxerre", "id": location, "action": "remove", "from": 1419, "through": 1555,
           "reason": "The old Auxerrois polygon reaches a different Burgundian bailliage; retain only Auxerre until a local boundary is sourced.",
           "source": "https://ccfr.bnf.fr/portailccfr/ark:/16871/0011204294"}
          for location in ("Aignay", "Arnay", "Avallon", "Chatillon_Sur_Seine", "Semur_En_Auxois")),
        {"territory": "Borgoña", "id": "Macon", "action": "remove", "from": 1419, "through": 1476,
         "reason": "Mâcon was a separate county and entered the ducal set in 1435; it must not be painted in 1419.",
         "source": "https://www.macon.fr/fileadmin/medias/03_MACON_ET_VOUS/Urbanisme/PLU/Revision_PLU_2022/01-08_PROJET_ARRETE_DE_REVISION_DU_PLU/01_-_RAPPORT_DE_PRESENTATION/01a.Diagnostic_et_Projet_de_PLU.pdf"},
        {"territory": "Condado de Mâcon", "id": "Macon", "action": "add", "from": 1435, "through": 1476,
         "reason": "Municipal history dates incorporation of the Mâcon county into the Burgundian duchy to 1435.",
         "source": "https://www.macon.fr/fileadmin/medias/03_MACON_ET_VOUS/Urbanisme/PLU/Revision_PLU_2022/01-08_PROJET_ARRETE_DE_REVISION_DU_PLU/01_-_RAPPORT_DE_PRESENTATION/01a.Diagnostic_et_Projet_de_PLU.pdf"},
        {"territory": "Borgoña", "id": "Charolles", "action": "remove", "from": 1419, "through": 1476,
         "reason": "Charolais was a separate county within the Burgundian holdings.",
         "source": "https://essentiels.bnf.fr/fr/article/d22e6192-1011-4527-bf32-5ea610af1df2-heraldique-son-apogee-armoiries-devises-et-emblemes"},
        {"territory": "Condado de Charolais", "id": "Charolles", "action": "add", "from": 1419, "through": 1555,
         "reason": "Distinct county acquired in 1390, taken by France in 1477 and restored to the Habsburg line by Senlis in 1493; the dated person records determine the gap.",
         "source": "https://archives.cotedor.fr/v2/site/AD21/Apprendre/Atelier_du_chancelier_Rolin/Paleographie/Groupe_confirmes/Documents_etudies_en_2008-2009/Documents_1_a_3_-_Le_traite_de_Senlis_23_mai_1493_"},
    ])
    return result


def main():
    source = json.loads((HERE / "burgundian-source.json").read_text())
    corrections = overrides()
    old_paths = paths(ROOT / "src/MapChart_Map.svg")
    new_paths = paths(HERE / "euv-locations-crop.svg")
    old_ids = {old_id for person in source["people"]
               for government in person["governments"]
               for version in government["versions"]
               for old_id in version["oldIds"]}
    missing = old_ids - old_paths.keys()
    if missing:
        raise ValueError(f"Missing source polygons: {sorted(missing)}")
    for item in corrections:
        if item["id"] not in new_paths:
            raise ValueError(f"Missing override location: {item}")
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
            portion = shape.intersection(old_shapes[old_id]).area / shape.area
            if portion >= .03:
                overlaps[old_id][location_id] = round(min(1, portion), 4)

    territory_scores = {}
    for person in source["people"]:
        for government in person["governments"]:
            for version in government["versions"]:
                key = tuple(version["oldIds"])
                if key in territory_scores:
                    continue
                totals = {}
                for old_id in key:
                    for location_id, fraction in overlaps.get(old_id, {}).items():
                        totals[location_id] = min(1, totals.get(location_id, 0) + fraction)
                territory_scores[key] = totals

    people = []
    for person in source["people"]:
        governments = []
        for government in person["governments"]:
            versions = []
            for year in range(government["from"], government["through"] + 1):
                current = next(v for v in reversed(government["versions"]) if v["from"] <= year)
                scores = territory_scores[tuple(current["oldIds"])]
                selected = {location_id for location_id, fraction in scores.items() if fraction >= .55}
                for item in corrections:
                    if item["territory"] != government["territory"] or not item["from"] <= year <= item["through"]:
                        continue
                    if item["action"] == "add":
                        selected.add(item["id"])
                    elif item["action"] == "remove":
                        selected.discard(item["id"])
                ids = sorted(selected)
                if not versions or ids != versions[-1]["ids"]:
                    versions.append({"from": year, "ids": ids,
                                     "borderline": sorted(i for i, fraction in scores.items() if .25 <= fraction < .55)})
            governments.append({key: government[key] for key in ("territory", "from", "through", "condition")}
                               | {"versions": versions})
        people.append({key: person[key] for key in ("id", "name", "from", "through", "status")}
                      | {"governments": governments})

    # One owner per year is expected because this is a succession snapshot at
    # year end. Several titles belonging to that owner may share a polygon.
    ownership_conflicts = []
    for year in range(1419, 1556):
        active = [person for person in people if person["from"] <= year <= person["through"]]
        if len(active) != 1:
            ownership_conflicts.append({"year": year, "people": [p["id"] for p in active]})
    out = {
        "method": "Year-end snapshot; new location overlap with old polygons >=55%, then sourced overrides",
        "people": people,
        "overrides": corrections,
        "audit": {
            "oldIds": len(old_shapes), "newPathsConsidered": looked,
            "newPathsTotal": len(new_paths),
            "oldWithNoCandidate": sorted(i for i, hits in overlaps.items() if not hits),
            "yearOwnershipConflicts": ownership_conflicts,
            "sourceLimitations": [
                "Felipe I inherited in 1482 but did not govern personally until 1493/94; the Atlas currently marks 1482-1506 as efectivo.",
                "Disputed and titular claims (notably Artois and Franche-Comté in 1477-1493) are deliberately unpainted.",
                "The EU V Locations polygons are game geography, not independently sourced historical borders."
            ],
        },
    }
    file = HERE / "burgundian-locations.json"
    file.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {file}: {len(people)} people, {len(old_shapes)} old provinces, {looked} candidate locations")
    for person in people:
        start = person["from"]
        active = [government for government in person["governments"]
                  if government["from"] <= start <= government["through"]]
        first = {location for government in active
                 for version in government["versions"] if version["from"] <= start
                 for location in version["ids"]}
        print(f"{person['name']}: {person['from']}-{person['through']}; "
              f"{len(active)} jurisdictions and {len(first)} distinct polygons at start")


if __name__ == "__main__":
    main()
