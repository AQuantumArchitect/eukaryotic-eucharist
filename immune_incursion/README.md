# Eukaryotic Eucharist — immune incursions

Bacteria identity, split off Mecha Fish. Hive tutorial world (truth / goodness /
beauty). See `TUTORIAL.md`.

- Law: `DESIGN_CONSTITUTION.md`
- Belief manifold: `spec.py` (`EE_SPEC`)
- Headless kernel: `kernel.py` (no renderer, no Umwelt import)

```bash
python3 kernel.py
python3 test_kernel.py
# if Umwelt is on PYTHONPATH (do not start a second umweltd):
python -m umwelt.spec.validate immune_incursion.spec:EE_SPEC
```

Player face: `index.html`. Packed zip: `../deploy/itch/ee_immune.zip`.
Hive does not butler-push. Viruses stay fog.
