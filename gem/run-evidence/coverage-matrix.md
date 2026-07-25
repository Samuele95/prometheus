# coverage-matrix.md — Stage 3 consolidation plan (v2, recomputed from zero)

24 source rows → **8 knowledge files** (≤10 cap) + 1 compressed into instructions.
Grouped by consumption affinity (workflow Stage 3 rule 1). Merges = verbatim
concatenation under structural headers (I1). No silent drops (I3).

| # | Source | Disposition | Destination | Reason |
|---|---|---|---|---|
| 1 | `SKILL.md` | `compressed` | `gem-instructions.md` | 3-mode entry procedure -> instructions field; mode depth preserved verbatim in mode reference files |
| 2 | `references/agent-consumability.md` | `merged` | `manage-agent-design.txt` |  |
| 3 | `references/agent-team-topologies.md` | `merged` | `manage-agent-design.txt` |  |
| 4 | `references/manage-mode.md` | `merged` | `manage-core.txt` |  |
| 5 | `references/agent-state.md` | `merged` | `manage-core.txt` |  |
| 6 | `manage/monitor-operator.md` | `merged` | `manage-operators.txt` |  |
| 7 | `manage/analyze-operator.md` | `merged` | `manage-operators.txt` |  |
| 8 | `manage/manage-mode-verifier.md` | `merged` | `manage-operators.txt` |  |
| 9 | `manage/dogfood-audit.md` | `merged` | `manage-operators.txt` |  |
| 10 | `manage/replay-verifier.py` | `merged` | `manage-operators.txt` | non-md artifact: verbatim body + non-executable provenance header, TRAILING APPENDIX (not interleaved) |
| 11 | `CITATIONS.md` | `merged` | `provenance.txt` |  |
| 12 | `CHANGELOG.md` | `merged` | `provenance.txt` |  |
| 13 | `LICENSE` | `merged` | `provenance.txt` |  |
| 14 | `references/quantum-principles.md` | `merged` | `quantum-core.txt` |  |
| 15 | `operators/section-operators.md` | `merged` | `quantum-core.txt` |  |
| 16 | `references/reasoning-patterns.md` | `merged` | `quantum-core.txt` |  |
| 17 | `references/refactor-mode.md` | `verbatim` | `refactor-mode.txt` | sole member; shipped whole as its own knowledge file |
| 18 | `templates/shape-catalog.md` | `merged` | `shapes-and-build.txt` |  |
| 19 | `templates/interview-branches.md` | `merged` | `shapes-and-build.txt` |  |
| 20 | `templates/minimum-viable-prompt.yaml` | `merged` | `shapes-and-build.txt` | non-md artifact: verbatim body + non-executable provenance header, TRAILING APPENDIX (not interleaved) |
| 21 | `references/verifier-specification.md` | `merged` | `verifier-and-audit.txt` |  |
| 22 | `references/verifier-agent-patterns.md` | `merged` | `verifier-and-audit.txt` |  |
| 23 | `references/audit-checklist.md` | `merged` | `verifier-and-audit.txt` |  |
| 24 | `references/evaluation-rubric.md` | `merged` | `verifier-and-audit.txt` |  |

## Destination sizes (byte sum + per-member header estimate)

| Knowledge file | Members | Bytes | ~KB |
|---|---|---|---|
| `quantum-core.txt` | 3 | 61520 | 60.1 |
| `shapes-and-build.txt` | 3 | 46596 | 45.5 |
| `refactor-mode.txt` | 1 | 15707 | 15.3 |
| `manage-core.txt` | 2 | 35222 | 34.4 |
| `manage-operators.txt` | 5 | 28194 | 27.5 |
| `manage-agent-design.txt` | 2 | 21333 | 20.8 |
| `verifier-and-audit.txt` | 4 | 58684 | 57.3 |
| `provenance.txt` | 3 | 32770 | 32.0 |

Total knowledge bytes ≈ 300026 (all destinations ≪ 100 MB per-file cap).

## Non-md artifacts (workflow Stage 3 rule 2)

- `templates/minimum-viable-prompt.yaml` → trailing appendix of `shapes-and-build.txt`
- `manage/replay-verifier.py` → trailing appendix of `manage-operators.txt`

Both carry a mandated provenance header: *runnable/structured artifact, NOT executable inside the Gem; execute externally with a filesystem-capable runtime.* Never interleaved into prose.

## Instructions-field source (Stage 4)

- `SKILL.md` → `compressed` into `gem-instructions.md`. The three-mode routing and
  the quantum frame (I2) live in the always-in-context instructions; full mode
  depth is preserved verbatim in `refactor-mode.txt`, `manage-core.txt`,
  `shapes-and-build.txt`, and `quantum-core.txt`. Stage 4 fidelity check confirms
  no SKILL-unique normative content is dropped; if any is found it is a Stage 4
  boundary, not a silent loss.
