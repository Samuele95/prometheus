# ship-manifest.md — Prometheus Gem package v2 (EN)

Generated 2026-07-16T12:43:32Z. Languages: `[en]`. IT = declared follow-on run.
Gem name: **Prometheus**. Framework carried: **prompt-architect v2** (the corpus
names it that way verbatim; see the naming note in the setup guide).

## Package layout

```
en/
  gem-instructions.md    -> paste into the Gem instructions field (19,249 chars)
  setup-guide.md         -> assembly steps + naming note
  smoke-tests.md         -> 5 tests, run before real use
  dogfood-audit.md       -> the framework's own checklist, run on itself
knowledge/               -> shared across languages; upload all 8, do NOT rename
```

## SHA-256 — shipped artifacts

| File | Bytes | SHA-256 |
|---|---|---|
| `en/gem-instructions.md` | 19,388 | `32c7632672cf5fe12920bafb81c07b786cf7b65c20c54bdfff3f10fece7e2ce9` |
| `en/setup-guide.md` | 3,374 | `f0a9b87e01064d6bcc82216ad8148c03ada370953e2b7337b7ae1ab337f341fd` |
| `en/smoke-tests.md` | 5,444 | `d069338d514bb0b905a3e231633cf300a14a95b3334ad69de51fa9cde1f0808d` |
| `en/dogfood-audit.md` | 5,867 | `b60c46eda2d28ab3d39368c001628356a2da7c562333a5397c727e5b08b3dd7c` |
| `knowledge/manage-agent-design.txt` | 21,416 | `52ba9db75b610ec9f21d1ed38049044940ae2362fb60b0f4184cb01e3e064d0a` |
| `knowledge/manage-core.txt` | 35,172 | `10fe5fbd50116e004e9f569bd96b4a22f7bdcf9e974a979f93a51f19929258a5` |
| `knowledge/manage-operators.txt` | 28,129 | `1e9e38af5e2644388fd686535d96c6e260cbd903fb2a89adb164adf47085366b` |
| `knowledge/provenance.txt` | 32,519 | `809c3b94c155b38317a48b0a9a4cfc68a83da9bc11cb725b1bd268c19629b169` |
| `knowledge/quantum-core.txt` | 61,518 | `0f928290e5882fd2220f6c2f5cb20b732ab944bee9f7de8de055a0df2f15a093` |
| `knowledge/refactor-mode.txt` | 15,842 | `fe95ae3f2c513a90e0a5bdcede54a024aa9b05c47e0faf493142e166442d437c` |
| `knowledge/shapes-and-build.txt` | 46,653 | `dbe7da41791f983dc83766ba4f723c4e17697ea94200114f3936a3b9b85693b3` |
| `knowledge/verifier-and-audit.txt` | 58,527 | `61f196f894e23002acd2a8c279d8cfdfe593827b588740839e9890f0bf4cfe69` |

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
