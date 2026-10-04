#!/usr/bin/env python3
"""Export a dated Carlos V preview as SVG from the parallel locations map."""

import argparse
import json
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent
COLORS = {"spanish": "#bd9b45", "burgundian": "#8e295c", "austrian": "#9c4750"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("year", type=int)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    if not 1506 <= args.year <= 1555:
        parser.error("year must be between 1506 and 1555")
    data = json.loads((HERE / "carlos-v-locations.json").read_text())
    assigned = {}
    for territory in data["territories"]:
        if not territory["from"] <= args.year <= territory["through"]:
            continue
        version = next(item for item in reversed(territory["versions"]) if item["from"] <= args.year)
        for location in version["ids"]:
            group = territory["group"]
            if location in assigned and assigned[location] != group:
                raise ValueError(f"Cross-group conflict: {location}")
            assigned[location] = group
    tree = ET.parse(HERE / "euv-locations-crop.svg")
    for path in tree.findall(".//{*}svg[@id='map']/{*}path"):
        group = assigned.get(path.get("id"))
        if group:
            color = COLORS[group]
            path.set("fill", color)
            path.set("stroke", color)
            path.set("style", f"fill:{color};stroke:{color};stroke-width:0.08")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    tree.write(args.output, encoding="utf-8", xml_declaration=True)
    print(f"{args.year}: {len(assigned)} locations -> {args.output}")


if __name__ == "__main__":
    main()
