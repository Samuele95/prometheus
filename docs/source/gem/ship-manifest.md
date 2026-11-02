# ship-manifest.md — Prometheus Gem package v3.3 (EN)

Generated 2026-09-08T12:29:23Z. Framework carried: **Prometheus v3.3** (the skill and the Gem now share
the name; the v2 package's `prompt-architect` naming note is retired). Languages: `[en]`.

## Package layout

```
en/
  gem-instructions.md    -> paste into the Gem instructions field (14,266 chars)
  setup-guide.md         -> assembly steps
  smoke-tests.md         -> 7 tests, run before real use
  dogfood-audit.md       -> the framework's own checklist, run on this package
knowledge/               -> upload all 10, do NOT rename
```

## SHA-256 — shipped artifacts

| File | Bytes | Chars | SHA-256 |
|---|---|---|---|
| `en/gem-instructions.md` | 14,386 | 14,266 | `2080ff20d77798df5d5efbc9fef758c8e8f8964103c971592c665f737b3ae6a3` |
| `en/setup-guide.md` | 5,142 | 5,124 | `f32bbe52c0a5033eba261318d087caf3bd4ff313884c5b089b649b8f2f8859a6` |
| `en/smoke-tests.md` | 9,183 | 9,101 | `22bfe89c2282c6cd6c71a740e9572a7f360ba07187e206fbeae7d335c1f1f826` |
| `en/dogfood-audit.md` | 9,712 | 9,661 | `b3da83a2bc93aed23695063361f70e1f25fd5273fe74d33bd3e2abdbff094fdb` |
| `knowledge/quantum-principles.txt` | 18,003 | 17,845 | `c42726a239a3c6c479c4a8a3864138e305ea8b149db3cd8ba7520a2f82708ffc` |
| `knowledge/operators.txt` | 11,815 | 11,741 | `56131884ded8a701e75805103f0bc1a27fcd9c4dc664ed2a21084162ac1d3167` |
| `knowledge/shapes.txt` | 22,809 | 22,482 | `19c29c1f78d062187f4b4799c63f452dea50b3c303d17fc9f17af965090f96fa` |
| `knowledge/audit.txt` | 19,404 | 19,250 | `b82f571fcd99c3233c5420473b387c655dc0fec8a5a3a13e3154b760d320acbd` |
| `knowledge/evals.txt` | 11,236 | 11,091 | `d42e8e60a44b419e50e23c60ea5eaf9f150f482351e0a2737272c8866e0831db` |
| `knowledge/cognitive-tools.txt` | 18,187 | 18,102 | `bb03b303ae87ed2dcd42dfa57aef25518de6c7844760632ab603c34341a4a6f6` |
| `knowledge/agent-teams.txt` | 12,874 | 12,710 | `abe64725ecd0eacbf61a94a15d32f13d9adea77c5fcb81e5d5d3cf72cd6cb732` |
| `knowledge/refactor.txt` | 7,649 | 7,559 | `156c784f8f4b664f195e70fdff7fa90fb73e5dac397ce38d8edfb7d3a545c437` |
| `knowledge/manage.txt` | 40,996 | 40,737 | `91b9bf8aec8a02342fe9d4343db1c56ba725de624fe3005a76cd53a91305061b` |
| `knowledge/provenance.txt` | 71,093 | 70,033 | `d55b556986294000558681f0b14fe2d8e467b9cb9e6d132fcc8049a7dd7b8fb2` |

## Source inventory

Every source file, its hash at port time, and the shipped file it landed in:
`run-evidence/inventory.json`. Coverage is 15 of 15 skill files plus `CITATIONS.md`
and `LICENSE` from the repository root; `SKILL.md` is the one source that is *ported*
rather than carried, becoming the instruction file.

## Gate summary

| Gate | Result | Failures |
|---|---|---|
| Coverage — every source file lands somewhere | PASS | 0 |
| Knowledge-file cap (≤10) | PASS — exactly 10 | 0 |
| Instruction working cap (30,000 chars) | PASS — EN 14,266 (48%) | 0 |
| Wiring table ↔ corpus consistency | PASS — 10 named, 10 present, 0 orphaned | 0 |
| Dangling cross-references in shipped corpus | PASS — 0 | 0 |
| Cross-reference rewriting (D1) | PASS — 100 rewrites, all resolving to a shipped file | 0 |
| Byte fidelity of carried source | PASS — no change outside the declared rewrites | 0 |
| Dogfood audit (self-report, P8) | 0 blocking, 3 partial | 0 blocking |
| External static-verifier pass in a fresh context | **NOT RUN** — must be run by the user | — |
| Smoke tests | **NOT RUN** — build-time only; run them after assembly | — |

Knowledge corpus: 10 files / 234,066 bytes, largest 71,093 B.

Deviations: **D1** (cross-references rewritten to shipped filenames), **D2** (v2→v3
renames resolved inside `CITATIONS.md` before that rewrite), **D3** (`CHANGELOG.md`
exempt from rewriting — it is a historical record, not a set of live pointers),
**D4** (three substrate adaptations added beyond the source: the Substrate section,
the manage degradation note, the output-length rule), **D5** (the Italian variant's
`Lingua` section, port-authored — recorded but not shipped in this English-only distribution). Full text in `run-evidence/deviations.md`.

## Two gates this package cannot close for you

Prometheus v3 is build-time only, and this run honored that: nothing here was executed
and nothing was measured on an execution. The static-mode verifier pass in a fresh
context (P8) and the seven smoke tests are shipped as instructions, not as results.
A manifest that claimed either would be exactly the failure Smoke 4a tests for.
