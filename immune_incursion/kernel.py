"""Headless incursion kernel. Graph-strict: a command that names no organ is a no-op.

Frontend does not own truth. Umwelt is a witness, not imported here.
"""
from __future__ import annotations

from dataclasses import dataclass, field

# Existing organelle kit remapped. Do not add an organ until a sitting proves a missing verb.
ORGANS = (
    "phagosome", "rasping_lamella", "toxin_cloud", "crystal_ward",
    "lipid_repair_loom", "pheromone_gland", "lance_bristle", "cleavage_furrow",
    "organ_manufacturing",
)

PARAM_SPEC = (
    ("wave_budget", 18.0, 6.0, 40.0),
    ("bacteria_growth", 0.12, 0.02, 0.4),
    ("eukaryote_growth", 0.04, 0.0, 0.2),
    ("toxin_potency", 0.35, 0.05, 0.8),
    ("toxin_inflammation", 0.22, 0.05, 0.6),
    ("phagosome_rate", 0.18, 0.05, 0.5),
    ("repair_rate", 0.08, 0.01, 0.25),
    ("memory_retain", 0.35, 0.05, 0.8),
    ("storm_inflammation", 0.82, 0.6, 0.95),
)


def _clip(v: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return lo if v < lo else hi if v > hi else v


@dataclass
class World:
    seed: int = 11
    t: float = 0.0
    integrity: float = 1.0
    inflammation: float = 0.0
    bacteria: float = 0.0
    eukaryote: float = 0.0
    memory: float = 0.0
    wave_index: int = 0
    incoming: float = 0.0
    organs: dict = field(default_factory=lambda: {
        "phagosome": 1, "rasping_lamella": 1, "toxin_cloud": 1,
        "lipid_repair_loom": 1, "crystal_ward": 0, "pheromone_gland": 0,
        "lance_bristle": 0, "cleavage_furrow": 0, "organ_manufacturing": 1,
    })
    params: dict = field(default_factory=dict)
    storm: bool = False
    collapsed: bool = False
    clears: int = 0
    events: list = field(default_factory=list)

    def __post_init__(self) -> None:
        p = {n: d for n, d, _lo, _hi in PARAM_SPEC}
        p.update(self.params or {})
        self.params = p
        self.incoming = float(p["wave_budget"])


def create_world(seed: int = 11, params: dict | None = None) -> World:
    return World(seed=seed, params=dict(params or {}))


def has_org(world: World, organ: str) -> bool:
    return organ in ORGANS and int(world.organs.get(organ) or 0) > 0


def apply(world: World, command: str) -> bool:
    """Truth: command is an organ name, or it does nothing."""
    if world.collapsed or world.storm:
        return False
    if command not in ORGANS or not has_org(world, command):
        return False
    p = world.params
    if command == "toxin_cloud":
        dmg = p["toxin_potency"] * (0.7 + 0.3 * world.memory)
        world.bacteria = _clip(world.bacteria - dmg)
        world.eukaryote = _clip(world.eukaryote - dmg * 0.45)
        world.inflammation = _clip(world.inflammation + p["toxin_inflammation"])
        world.events.append({"type": "toxin", "t": world.t})
        return True
    if command == "phagosome":
        world.bacteria = _clip(world.bacteria - p["phagosome_rate"] * (1.0 + world.memory))
        world.events.append({"type": "phagosome", "t": world.t})
        return True
    if command == "rasping_lamella":
        world.bacteria = _clip(world.bacteria - p["phagosome_rate"] * 0.6)
        world.eukaryote = _clip(world.eukaryote - p["phagosome_rate"] * 0.8)
        return True
    if command == "lipid_repair_loom":
        world.integrity = _clip(world.integrity + p["repair_rate"])
        world.inflammation = _clip(world.inflammation - 0.04)
        return True
    if command == "crystal_ward":
        world.incoming = max(0.0, world.incoming - 2.0)
        return True
    if command == "lance_bristle":
        world.eukaryote = _clip(world.eukaryote - 0.22)
        return True
    if command == "pheromone_gland":
        world.incoming = max(0.0, world.incoming - 1.5)
        world.events.append({"type": "detect", "t": world.t})
        return True
    if command == "cleavage_furrow":
        n = int(world.organs.get("phagosome") or 0)
        world.organs["phagosome"] = min(3, n + 1)
        world.events.append({"type": "clone", "t": world.t})
        return True
    if command == "organ_manufacturing":
        for name in ("crystal_ward", "lance_bristle", "pheromone_gland", "cleavage_furrow"):
            if int(world.organs.get(name) or 0) <= 0:
                world.organs[name] = 1
                world.events.append({"type": "graft", "t": world.t, "organ": name})
                return True
        return False
    return False


def step(world: World, dt: float = 1.0, commands: tuple[str, ...] = ()) -> World:
    if world.collapsed or world.storm:
        world.t += dt
        return world
    p = world.params
    if world.incoming > 0:
        leak = min(world.incoming, 1.4 * dt)
        world.incoming -= leak
        world.bacteria = _clip(world.bacteria + leak / p["wave_budget"])
        if world.wave_index == 0:
            world.events.append({"type": "breach", "t": world.t})
            world.wave_index = 1
    world.bacteria = _clip(world.bacteria + p["bacteria_growth"] * world.bacteria * dt * 0.15)
    world.eukaryote = _clip(
        world.eukaryote + p["eukaryote_growth"] * dt * (0.02 + 0.04 * world.bacteria)
    )
    pressure = world.bacteria * 0.12 + world.eukaryote * 0.22
    world.integrity = _clip(world.integrity - pressure * dt)
    world.inflammation = _clip(world.inflammation * (1.0 - 0.08 * dt))
    for cmd in commands:
        apply(world, cmd)
    if world.inflammation >= p["storm_inflammation"] and world.integrity < 0.55:
        world.storm = True
        world.events.append({"type": "storm", "t": world.t})
    if world.integrity <= 0.0:
        world.collapsed = True
        world.events.append({"type": "collapse", "t": world.t})
    if (
        world.incoming <= 1e-6
        and world.bacteria <= 0.04
        and world.eukaryote <= 0.04
        and not world.collapsed
        and not world.storm
    ):
        if world.wave_index > 0 and world.clears == 0:
            world.clears = 1
            world.memory = _clip(world.memory + p["memory_retain"])
            world.events.append({"type": "clear", "t": world.t})
    world.t += dt
    return world


TICK_S = 30.0


def emit_row(world: World) -> dict:
    """Bloch-shaped rows for score_breathing: {key: [fill, phase]} in [0,1]."""
    phase = (world.t / TICK_S) % 1.0
    return {
        "integrity": [world.integrity, world.inflammation],
        "inflammation": [world.inflammation, phase],
        "bacteria": [world.bacteria, world.eukaryote],
        "memory": [world.memory, phase],
    }


def goodness_gate(world: World) -> dict:
    """Goodness is a gate, not mixed into beauty."""
    ok = (not world.storm) and (not world.collapsed) and world.clears >= 1
    return {
        "ok": ok,
        "storm": world.storm,
        "collapsed": world.collapsed,
        "clears": world.clears,
        "reject": None if ok else ("storm" if world.storm else "collapse" if world.collapsed else "no_clear"),
    }


def default_policy(world: World) -> tuple[str, ...]:
    """A boring competent host: eat, stitch, toxin only while inflammation is low."""
    cmds: list[str] = []
    if has_org(world, "phagosome") and world.bacteria > 0.02:
        cmds.append("phagosome")
    if has_org(world, "rasping_lamella") and world.eukaryote > 0.02:
        cmds.append("rasping_lamella")
    if has_org(world, "lipid_repair_loom") and world.integrity < 0.92:
        cmds.append("lipid_repair_loom")
    if has_org(world, "toxin_cloud") and world.bacteria > 0.25 and world.inflammation < 0.55:
        cmds.append("toxin_cloud")
    return tuple(cmds)


def run(seed: int = 11, steps: int = 80, params: dict | None = None) -> tuple[World, list[dict]]:
    world = create_world(seed=seed, params=params)
    tape = []
    for _ in range(steps):
        step(world, 1.0, default_policy(world))
        tape.append(emit_row(world))
    return world, tape


if __name__ == "__main__":
    w, tape = run()
    g = goodness_gate(w)
    print({
        "t": round(w.t, 2), "integrity": round(w.integrity, 3),
        "inflammation": round(w.inflammation, 3), "clears": w.clears,
        "goodness": g, "n": len(tape),
    })
