"""Eukaryotic Eucharist — immune incursion DomainSpec.

Tutorial world for the hive: graph = belief manifold. Vocabulary lives here, not
in umwelt/src. Outputs stay shadow. Viruses are ignored (fog).

Validate (Umwelt on PYTHONPATH, do not start a second umweltd):

    python -m umwelt.spec.validate immune_incursion.spec:EE_SPEC
"""
from __future__ import annotations

from umwelt.spec.schema import (
    BindingSpec,
    BridgeSpec,
    DomainSpec,
    DriverSpec,
    NodeSpec,
    OutputSpec,
)

TICK_S = 30.0  # incursion cadence, not a solar day
GAMMA_DISS = (0.08, 0.02, 0.001, 0.4)


def immune_spec() -> DomainSpec:
    nodes = [
        NodeSpec(
            "tissue_bed", parent=None, kind="root",
            roles=("integrity", "inflammation"),
            role_modes={"integrity": "dissipative", "inflammation": "dissipative"},
            params={"gamma_diss": GAMMA_DISS},
        ),
        NodeSpec(
            "breach", parent="tissue_bed", kind="region",
            roles=("open",),
            role_modes={"open": "unitary"},
        ),
        NodeSpec(
            "bacteria", parent="tissue_bed", kind="entity",
            roles=("mass", "virulence"),
            role_modes={"mass": "dissipative", "virulence": "dissipative"},
            params={"gamma_diss": GAMMA_DISS},
        ),
        NodeSpec(
            "eukaryote", parent="tissue_bed", kind="entity",
            roles=("mass", "virulence"),
            role_modes={"mass": "dissipative", "virulence": "dissipative"},
            params={"gamma_diss": GAMMA_DISS},
        ),
        NodeSpec(
            "immune", parent="tissue_bed", kind="component",
            roles=("deploy",),
            role_modes={"deploy": "unitary"},
        ),
        NodeSpec(
            "memory", parent="tissue_bed", kind="component",
            roles=("repertoire",),
            role_modes={"repertoire": "dissipative"},
            params={"gamma_diss": GAMMA_DISS},
        ),
    ]
    bridges = (
        BridgeSpec("breach", "bacteria", shared_roles=(), kind="open"),
        BridgeSpec("breach", "eukaryote", shared_roles=(), kind="open"),
        BridgeSpec("immune", "bacteria", shared_roles=(), kind="gated"),
        BridgeSpec("immune", "eukaryote", shared_roles=(), kind="gated"),
        BridgeSpec("immune", "tissue_bed", shared_roles=("inflammation",), kind="open"),
        BridgeSpec("memory", "immune", shared_roles=(), kind="gated"),
    )
    bindings = (
        BindingSpec(
            "breach_open", zone="breach", role="open",
            normalizer="binary", force_observe=True, efficiency=1.0, strength=0.5,
            description="Incursion breach event. Unitary; not a continuous drive.",
        ),
        BindingSpec(
            "tissue_integrity", zone="tissue_bed", role="integrity",
            normalizer={"type": "range", "lo": 0.0, "hi": 1.0},
        ),
        BindingSpec(
            "tissue_inflammation", zone="tissue_bed", role="inflammation",
            normalizer={"type": "range", "lo": 0.0, "hi": 1.0},
        ),
        BindingSpec(
            "bacteria_mass", zone="bacteria", role="mass",
            normalizer={"type": "range", "lo": 0.0, "hi": 1.0},
        ),
        BindingSpec(
            "bacteria_virulence", zone="bacteria", role="virulence",
            normalizer={"type": "range", "lo": 0.0, "hi": 1.0},
        ),
        BindingSpec(
            "eukaryote_mass", zone="eukaryote", role="mass",
            normalizer={"type": "range", "lo": 0.0, "hi": 1.0},
        ),
        BindingSpec(
            "immune_deploy", zone="immune", role="deploy",
            normalizer="binary", force_observe=True, efficiency=1.0, strength=0.35,
        ),
        BindingSpec(
            "memory_repertoire", zone="memory", role="repertoire",
            normalizer={"type": "range", "lo": 0.0, "hi": 1.0},
        ),
    )
    outputs = (
        OutputSpec(
            "deploy_toxin", node="immune", role="deploy", kind="binary",
            decode="sticky", gates={"rate_limit_s": 0.0},
            dispatch={"actuator_id": "toxin_cloud"}, shadow=True,
        ),
        OutputSpec(
            "deploy_phagosome", node="immune", role="deploy", kind="binary",
            decode="sticky", gates={"rate_limit_s": 0.0},
            dispatch={"actuator_id": "phagosome"}, shadow=True,
        ),
    )
    return DomainSpec(
        name="eukaryotic-eucharist-immune",
        nodes=tuple(nodes),
        bridges=bridges,
        bindings=bindings,
        outputs=outputs,
        drivers=(DriverSpec("incursion", node="_clock", role="phase",
                            type="harmonic", period_s=TICK_S),),
        ignored=(
            ("virus_*", "fog until a sitting names viruses"),
        ),
        anchors={},
    )


EE_SPEC = immune_spec()
