# Coverage matrix — Prometheus v3.3 → Gem package

Every source file, where it landed, and how. Machine-readable equivalent with hashes: `inventory.json`.

## Skill sources (15 files)

| Source | Bytes | Lands in | How |
|---|---|---|---|
| `SKILL.md` | 10,644 | `en/gem-instructions.md` | **ported** — the one file rewritten rather than carried |
| `references/quantum-principles.md` | 17,356 | `knowledge/quantum-principles.txt` | verbatim |
| `references/operators.md` | 11,238 | `knowledge/operators.txt` | verbatim |
| `references/shapes.md` | 17,127 | `knowledge/shapes.txt` | verbatim |
| `references/loops.md` | 3,803 | `knowledge/shapes.txt` | verbatim, § loops |
| `assets/minimum-viable-prompt.yaml` | 956 | `knowledge/shapes.txt` | verbatim, § minimum-viable-prompt |
| `references/audit.md` | 18,912 | `knowledge/audit.txt` | verbatim |
| `references/evals.md` | 10,706 | `knowledge/evals.txt` | verbatim |
| `references/cognitive-tools.md` | 6,358 | `knowledge/cognitive-tools.txt` | verbatim |
| `assets/cognitive-tools.json` | 10,949 | `knowledge/cognitive-tools.txt` | verbatim, § cognitive-tools.json |
| `references/agent-teams.md` | 9,581 | `knowledge/agent-teams.txt` | verbatim |
| `references/agent-output.md` | 2,458 | `knowledge/agent-teams.txt` | verbatim, § agent-output |
| `references/refactor.md` | 7,062 | `knowledge/refactor.txt` | verbatim |
| `references/manage.md` | 19,759 | `knowledge/manage.txt` | verbatim |
| `assets/manage/monitor.md` | 4,514 | `knowledge/manage.txt` | verbatim, § monitor |
| `assets/manage/analyze.md` | 5,332 | `knowledge/manage.txt` | verbatim, § analyze |
| `assets/manage/package-verifier.md` | 4,488 | `knowledge/manage.txt` | verbatim, § package-verifier |
| `assets/manage/replay-verifier.py` | 5,423 | `knowledge/manage.txt` | verbatim, § replay-verifier |
| `CHANGELOG.md` | 41,513 | `knowledge/provenance.txt` | verbatim, **no rewriting at all** (D3) |

That is 19 rows for 15 distinct files plus `SKILL.md` and `CHANGELOG.md`: the skill ships 11 files under `references/`, 2 under `assets/`, 4 under `assets/manage/`, plus `SKILL.md` and `CHANGELOG.md`. **Nothing was dropped and nothing was summarized.**

## Repository sources (2 files)

| Source | Bytes | Lands in | Why it is here |
|---|---|---|---|
| `CITATIONS.md` | 27,481 | `knowledge/provenance.txt` | the skill folder carries no citations file; provenance questions have to resolve somewhere |
| `LICENSE` | 1,066 | `knowledge/provenance.txt` | licence questions, same reason |

## The ten-file cap, and what it forced

The cap is ten knowledge files; the corpus needed seventeen slots at one-source-per-file. Four merges close the gap, each chosen because the skill's own "Read when…" table already routes the pair together:

| Merge | Rows in `SKILL.md` that route them together |
|---|---|
| `shapes.md` + `loops.md` + `minimum-viable-prompt.yaml` | Phase 3 cites all three in one sentence; Shape 1 is a shape |
| `cognitive-tools.md` + `cognitive-tools.json` | the `.md` owns the gating, the `.json` is the artifact it tells you to ship |
| `agent-teams.md` + `agent-output.md` | both are the multi-agent / agent-consumed surface, Shapes 4, 6, 7 |
| `manage.md` + the four `assets/manage/*` | manage mode is one procedure and its four shipped operators |

`provenance.txt` merges three non-normative files that are never consulted mid-procedure.

The result is ten files with the wiring table close to 1:1 against the skill's own routing table — which was the fidelity target, not the file count.

## What is *not* in the corpus

- `SKILL.md` itself, because it becomes the instructions field. Carrying it as knowledge too would put the always-loaded surface in the corpus twice and invite the model to answer from the copy.
- Nothing else.
