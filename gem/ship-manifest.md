# ship-manifest.md — Prometheus Gem package v2 (EN)

Generated 2026-07-16T12:43:32Z; hashes for 6 files regenerated 2026-08-17 after the frontier-source pass II sync (see the changelog inside `knowledge/provenance.txt`). Languages: `[en]`. IT = declared follow-on run.
Gem name: **Prometheus**. Framework carried: **prompt-architect v2** (the corpus
names it that way verbatim; see the naming note in the setup guide).

## Package layout

```
en/
  gem-instructions.md    -> paste into the Gem instructions field (19,825 chars)
  setup-guide.md         -> assembly steps + naming note
  smoke-tests.md         -> 5 tests, run before real use
  dogfood-audit.md       -> the framework's own checklist, run on itself
knowledge/               -> shared across languages; upload all 8, do NOT rename
```

## SHA-256 — shipped artifacts

| File | Bytes | SHA-256 |
|---|---|---|
| `en/gem-instructions.md` | 19,968 | `322082c9dc54659d44aa38e807e6d3dc4d35e96e5703481110b9c28acf0e5361` |
| `en/setup-guide.md` | 3,374 | `f0a9b87e01064d6bcc82216ad8148c03ada370953e2b7337b7ae1ab337f341fd` |
| `en/smoke-tests.md` | 5,444 | `d069338d514bb0b905a3e231633cf300a14a95b3334ad69de51fa9cde1f0808d` |
| `en/dogfood-audit.md` | 5,867 | `b60c46eda2d28ab3d39368c001628356a2da7c562333a5397c727e5b08b3dd7c` |
| `knowledge/manage-agent-design.txt` | 30,688 | `360a199078e4eed758462f0897d051a0c0d60fa4dc97e6fe98c3a644f1cf70e3` |
| `knowledge/manage-core.txt` | 35,172 | `10fe5fbd50116e004e9f569bd96b4a22f7bdcf9e974a979f93a51f19929258a5` |
| `knowledge/manage-operators.txt` | 28,129 | `1e9e38af5e2644388fd686535d96c6e260cbd903fb2a89adb164adf47085366b` |
| `knowledge/provenance.txt` | 46,489 | `365185347acce37ecee3403cc5b53d96155f6e1dd1fb1b144b591a34015882d4` |
| `knowledge/quantum-core.txt` | 67,829 | `ae6ab185a0b1f04dd882a1f0600f3680fb40daddd9521d87de4b1c3db89e5453` |
| `knowledge/refactor-mode.txt` | 15,842 | `fe95ae3f2c513a90e0a5bdcede54a024aa9b05c47e0faf493142e166442d437c` |
| `knowledge/shapes-and-build.txt` | 50,913 | `1c2933b1075b4f02d9b96e2ec5557f08501698fd688d5ba573c775f08a0f8873` |
| `knowledge/verifier-and-audit.txt` | 63,258 | `ad75186737ada52d9e40b43bcbaab84887a6470240ef6663151a73f69e669b49` |

## Gate summary

| Stage | Gate | Failures |
|---|---|---|
| Pre-flight | SHIP (S1–S11 all PASS) | 0 |
| 1 Inventory | PASS | 0 |
| 2 Constraints | PASS (working_cap signed off) | 0 |
| 3 Consolidation | PASS (24 rows -> 8 files + instructions) | 0 |
| 4 Synthesis | PASS (19,249 / 30,000 chars) | 0 |
| 5 Transform | PASS (span-level byte-diff; re-verified post-rename) | 0 artifact (1 verifier fix, D3) |
| 6 Verification | PASS (C1–C4; re-run post-rename) | 1 (C4, fixed via loop-back, D4) |
| 7 Packaging | PASS (5 smoke tests, dogfood clean) | 0 |

Deviations: **D1** (B4 dangling `manage-verify.py` carried verbatim), **D2**
(runtime allowlist built from the declared layout), **D3** (verifier char->span
fix), **D4** (C4 port-introduced platform name, repaired via loop-back),
**D5** (operator-directed Gem rename to Prometheus; scoped to port-authored
surfaces, 9 verbatim body occurrences carried per I1).

## Upstream-fix candidate

`manage/dogfood-audit.md:36` cites `manage-verify.py`, which does not exist in
the source corpus (nearest: `manage/replay-verifier.py`). Carried verbatim per
I1 (a port must not repair its source); fix upstream in the skill repo, then
re-port.

## Totals

- Source corpus: 24 files / 316,137 bytes
- Shipped knowledge: 8 files / 299,776 bytes (<=10 cap; 2 slots free; max file 61,518 B, far under the 100 MB per-file limit)
- Instructions: 19,249 chars (64% of the 30,000 working cap)
