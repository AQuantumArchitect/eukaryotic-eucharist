"""Headless incursion: graph-strict commands, goodness gate, tape rows."""
from __future__ import annotations

import unittest

try:
    from kernel import ORGANS, apply, create_world, goodness_gate, run, step
except ImportError:  # python -m unittest immune_incursion.test_kernel
    from immune_incursion.kernel import ORGANS, apply, create_world, goodness_gate, run, step


class TestIncursionKernel(unittest.TestCase):
    def test_unknown_command_is_noop(self):
        w = create_world(seed=1)
        before = (w.bacteria, w.integrity, w.inflammation)
        self.assertFalse(apply(w, "fun"))
        self.assertFalse(apply(w, "threat"))
        self.assertEqual((w.bacteria, w.integrity, w.inflammation), before)

    def test_command_requires_organ(self):
        w = create_world(seed=1)
        w.organs["toxin_cloud"] = 0
        self.assertFalse(apply(w, "toxin_cloud"))

    def test_organs_are_the_kit(self):
        self.assertIn("phagosome", ORGANS)
        self.assertNotIn("virus_capsid", ORGANS)

    def test_default_policy_clears_without_storm(self):
        w, tape = run(seed=11, steps=80)
        g = goodness_gate(w)
        self.assertTrue(g["ok"], g)
        self.assertFalse(w.storm)
        self.assertFalse(w.collapsed)
        self.assertGreaterEqual(w.clears, 1)
        self.assertGreaterEqual(len(tape), 80)
        row = tape[-1]
        for k in ("integrity", "inflammation", "bacteria", "memory"):
            self.assertIn(k, row)
            self.assertEqual(len(row[k]), 2)

    def test_toxin_spam_can_storm(self):
        w = create_world(seed=2)
        w.bacteria = 0.6
        w.integrity = 0.5
        for _ in range(12):
            step(w, 1.0, ("toxin_cloud",))
        self.assertTrue(w.storm or w.collapsed)

    def test_manufacturing_grafts_missing_organ(self):
        w = create_world(seed=3)
        self.assertEqual(w.organs["crystal_ward"], 0)
        self.assertTrue(apply(w, "organ_manufacturing"))
        self.assertEqual(w.organs["crystal_ward"], 1)


if __name__ == "__main__":
    unittest.main()
