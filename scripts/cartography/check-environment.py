"""Verify the locked environment and reproduce geometry in disposable copies.

This never rewrites the map accepted by the Atlas. Numerical comparison allows
two units in the seventh decimal (the precision of the stored SVG measures).
"""
import importlib.metadata
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from project_paths import PROJECT_ROOT

TOOLS = Path(__file__).resolve().parent
ACCEPTED = PROJECT_ROOT / "prototypes/euv-locations"


def compare(expected, actual, location="root"):
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or expected.keys() != actual.keys():
            raise AssertionError(f"{location}: keys differ")
        for key in expected:
            compare(expected[key], actual[key], f"{location}.{key}")
    elif isinstance(expected, list):
        if not isinstance(actual, list) or len(expected) != len(actual):
            raise AssertionError(f"{location}: list length differs")
        for index, (before, after) in enumerate(zip(expected, actual)):
            compare(before, after, f"{location}[{index}]")
    elif isinstance(expected, float):
        if not isinstance(actual, (int, float)) or not math.isclose(
                expected, actual, rel_tol=0, abs_tol=2e-7):
            raise AssertionError(f"{location}: {expected} != {actual}")
    elif type(expected) is not type(actual) or expected != actual:
        raise AssertionError(f"{location}: {expected!r} != {actual!r}")


def main():
    required = (PROJECT_ROOT / ".python-version").read_text().strip()
    actual = ".".join(map(str, sys.version_info[:3]))
    if actual != required:
        raise RuntimeError(f"Python {required} required; found {actual}")
    versions = dict(re.findall(r"^([\w-]+)==([\w.]+)",
        (TOOLS / "requirements.lock").read_text(), flags=re.MULTILINE))
    if not versions:
        raise RuntimeError("Empty dependency lock")
    for package, required_version in versions.items():
        installed = importlib.metadata.version(package)
        if installed != required_version:
            raise RuntimeError(f"{package}: {required_version} required; found {installed}")
    import shapely
    print(f"Python {actual}; GEOS {shapely.geos_version_string}", flush=True)
    print("; ".join(f"{name} {value}" for name, value in versions.items()), flush=True)
    with tempfile.TemporaryDirectory(prefix="eade-cartography-") as directory:
        scratch = Path(directory)
        for path in ACCEPTED.iterdir():
            if path.suffix in (".json", ".svg"):
                shutil.copyfile(path, scratch / path.name)
        environment = {**os.environ, "EADE_MAP_DATA_DIR": str(scratch)}
        subprocess.run([sys.executable, str(TOOLS / 'apply-coastal-subdivisions.py'), '--check'],
            cwd=scratch, env=environment, check=True)
        for script, artifact in [
            ("build-location-inventory.py", "location-inventory.json"),
            ("build-regional-extent-cells.py", "regional-extent-cells.json"),
            ("build-balkans-geography.py", "balkans-geographic-cells.json"),
        ]:
            # A different cwd catches accidental relative filesystem access.
            subprocess.run([sys.executable, str(TOOLS / script)],
                cwd=scratch, env=environment, check=True)
            expected = json.loads((ACCEPTED / artifact).read_text())
            regenerated = json.loads((scratch / artifact).read_text())
            compare(expected, regenerated, artifact)
            print(f"{artifact}: {len(expected['cells'])} cells reproduced", flush=True)
        artifact = 'iberia-italy-geographic-cells.json'
        subprocess.run([sys.executable, str(TOOLS / 'build-geographic-inventory.py'),
            'iberia-italy-geography.json', artifact], cwd=scratch, env=environment, check=True)
        expected = json.loads((ACCEPTED / artifact).read_text())
        compare(expected, json.loads((scratch / artifact).read_text()), artifact)
        print(f"{artifact}: {len(expected['cells'])} cells reproduced", flush=True)
    print("Accepted geometry reproduced; source and reviewed files untouched.")


if __name__ == "__main__":
    main()
