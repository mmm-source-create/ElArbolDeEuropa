"""Locate accepted map data independently of the shell's current directory."""
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = (PROJECT_ROOT / os.environ.get(
    "EADE_MAP_DATA_DIR", "prototypes/euv-locations")).resolve()
