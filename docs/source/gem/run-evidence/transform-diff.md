# Transform diff — what actually changed in the carried text

The claim this file backs: **outside the declared cross-reference rewrites (D1, D2), no carried byte changed.** Not "no meaning changed" — no byte.

## Method

For every source file, the shipped `.txt` section between its `SOURCE:` banner and the next banner was extracted and compared line by line against the source. Two assertions were checked mechanically:

1. **Line counts are equal.** A merge, a reflow, a dropped paragraph or an inserted heading all break this immediately. It holds for all 20 carried sections.
2. **Every differing line differs only by a path substitution.** Each changed line was normalized twice — source paths in the original, shipped `.txt` names in the port — and the two normalizations compared. A line that changed for any other reason survives normalization and is reported.

## Result

| Knowledge file | Source | Lines | Lines changed |
|---|---|---|---|
| `quantum-principles.txt` | `references/quantum-principles.md` | 70 | 1 |
| `operators.txt` | `references/operators.md` | 73 | 7 |
| `shapes.txt` | `references/shapes.md` | 122 | 10 |
| `shapes.txt` | `references/loops.md` | 33 | 4 |
| `shapes.txt` | `assets/minimum-viable-prompt.yaml` | 31 | 1 |
| `audit.txt` | `references/audit.md` | 119 | 19 |
| `evals.txt` | `references/evals.md` | 83 | 6 |
| `cognitive-tools.txt` | `references/cognitive-tools.md` | 36 | 2 |
| `cognitive-tools.txt` | `assets/cognitive-tools.json` | 137 | **0** |
| `agent-teams.txt` | `references/agent-teams.md` | 27 | 3 |
| `agent-teams.txt` | `references/agent-output.md` | 16 | 1 |
| `refactor.txt` | `references/refactor.md` | 55 | 3 |
| `manage.txt` | `references/manage.md` | 191 | 7 |
| `manage.txt` | `assets/manage/monitor.md` | 85 | 1 |
| `manage.txt` | `assets/manage/analyze.md` | 96 | 1 |
| `manage.txt` | `assets/manage/package-verifier.md` | 81 | 2 |
| `manage.txt` | `assets/manage/replay-verifier.py` | 145 | 2 |
| `provenance.txt` | `CITATIONS.md` | 441 | 9 |
| `provenance.txt` | `CHANGELOG.md` | 57 | **0** |
| `provenance.txt` | `LICENSE` | 21 | **0** |

**Totals: 1,929 lines carried, 79 changed, 0 unexplained.**

Three sources are byte-identical to their originals: `assets/cognitive-tools.json` (the shipped tool definitions — the artifact users paste into a runtime, so a single changed byte would be a defect), `LICENSE`, and `CHANGELOG.md` (exempt by D3).

`references/quantum-principles.md` changed on one line only. That file is the canonical one the skill itself keeps under a no-edit contract; one rewritten pointer is the whole delta.

`audit.txt` has the highest change count (19 of 119 lines) for the obvious reason: the audit checklist is the densest cross-referencing surface in the framework, since almost every check points at the file that owns its rule.

## Added, not changed

Each knowledge file gains a header of 6–8 comment lines (what it is, what it holds, the one transformation, do not rename) and a `SOURCE:` banner per carried file. These are additions around the carried text, never inside it, and they are what makes the merge boundaries visible to a reader and to the check above.

Corpus totals: 234,066 bytes shipped, of which the headers and banners are roughly 3,900.

## What this check does not prove

It proves byte fidelity, not behavior. Whether the ported instruction actually drives the framework correctly is what the external static-verifier pass and the seven smoke tests are for, and neither was run here — see `verification-report.md`.
