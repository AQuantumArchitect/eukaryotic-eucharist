#!/usr/bin/env python3
"""Persistent umwelt breath-scoring server for the tuner.

Reads newline-delimited JSON requests {"id": int, "rows": [...]} from stdin and writes one
newline-delimited JSON response {"id", "breathing", "golden", "multiplicity", "flatness",
"return_count"} per request to stdout. One long-lived process → the numpy import + interpreter
startup is paid once, not per candidate, so the tuner can optimise umwelt's OWN verdict directly
(the authoritative belief engine as the objective, connected richly).

Run with PYTHONPATH pointing at the umwelt src (the breath-return-scorer worktree).
"""
import sys, json
from umwelt.clocks.breath_scorer import score_breathing

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    try:
        req = json.loads(line)
        rep = score_breathing(req["rows"])
        d = rep.as_dict()
        out = {"id": req.get("id"), "breathing": d["breathing_score"], "golden": d["golden_ratio_score"],
               "multiplicity": d["multiplicity"], "flatness": d["flatness"], "return_count": d["return_count"]}
    except Exception as e:  # never let one bad request kill the server
        out = {"id": (req.get("id") if 'req' in dir() else None), "error": str(e), "breathing": 0.0}
    sys.stdout.write(json.dumps(out) + "\n")
    sys.stdout.flush()
