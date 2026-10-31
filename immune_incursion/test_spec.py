"""Validate EE DomainSpec when Umwelt is importable. Skip if dark. No second umweltd."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
UMWELT_SRC = Path(r"C:\Users\Luke Spooner\ws-win\umwelt\src")
if UMWELT_SRC.is_dir() and str(UMWELT_SRC) not in sys.path:
    sys.path.insert(0, str(UMWELT_SRC))
parent = str(HERE.parent)
if parent not in sys.path:
    sys.path.insert(0, parent)


class TestImmuneSpec(unittest.TestCase):
    def test_spec_imports_or_skip(self):
        try:
            from immune_incursion.spec import EE_SPEC
        except ImportError as exc:
            self.skipTest(f"umwelt dark: {exc}")
        self.assertEqual(EE_SPEC.name, "eukaryotic-eucharist-immune")
        names = {n.name for n in EE_SPEC.nodes}
        self.assertIn("tissue_bed", names)
        self.assertIn("bacteria", names)
        self.assertIn("eukaryote", names)
        ignored = " ".join(p for p, _r in EE_SPEC.ignored)
        self.assertIn("virus_", ignored)
        for out in EE_SPEC.outputs:
            self.assertTrue(out.shadow)

    def test_validate_or_skip(self):
        try:
            from umwelt.spec.validate import validate_spec
            from immune_incursion.spec import EE_SPEC
        except ImportError as exc:
            self.skipTest(f"umwelt dark: {exc}")
        report = validate_spec(EE_SPEC)
        self.assertTrue(report.ok, getattr(report, "summary", lambda: report)())


if __name__ == "__main__":
    unittest.main()
