# transform-diff.md — Stage 5 span-level byte-diff evidence

Each knowledge file differs from concatenated source only by allowed classes:
frontmatter-strip, header-insertion, reference-substitution, extension-rename (.txt).
Verification is span-level: every non-edit byte is identical; every edit is a
classified (old→new) reference substitution.

| Destination | Member | frontmatter | ref-sub edits | gaps byte-identical | edits allowed |
|---|---|---|---|---|---|
| `quantum-core.txt` | `references/quantum-principles.md` | False | 2 | True | True |
| `quantum-core.txt` | `operators/section-operators.md` | False | 1 | True | True |
| `quantum-core.txt` | `references/reasoning-patterns.md` | False | 0 | True | True |
| `shapes-and-build.txt` | `templates/shape-catalog.md` | False | 6 | True | True |
| `shapes-and-build.txt` | `templates/interview-branches.md` | False | 1 | True | True |
| `shapes-and-build.txt` | `templates/minimum-viable-prompt.yaml` | False | 1 | True | True |
| `refactor-mode.txt` | `references/refactor-mode.md` | False | 2 | True | True |
| `manage-core.txt` | `references/manage-mode.md` | False | 9 | True | True |
| `manage-core.txt` | `references/agent-state.md` | False | 4 | True | True |
| `manage-operators.txt` | `manage/monitor-operator.md` | False | 1 | True | True |
| `manage-operators.txt` | `manage/analyze-operator.md` | False | 1 | True | True |
| `manage-operators.txt` | `manage/manage-mode-verifier.md` | False | 4 | True | True |
| `manage-operators.txt` | `manage/dogfood-audit.md` | False | 0 | True | True |
| `manage-operators.txt` | `manage/replay-verifier.py` | False | 0 | True | True |
| `manage-agent-design.txt` | `references/agent-consumability.md` | False | 0 | True | True |
| `manage-agent-design.txt` | `references/agent-team-topologies.md` | False | 1 | True | True |
| `verifier-and-audit.txt` | `references/verifier-specification.md` | False | 5 | True | True |
| `verifier-and-audit.txt` | `references/verifier-agent-patterns.md` | False | 5 | True | True |
| `verifier-and-audit.txt` | `references/audit-checklist.md` | False | 7 | True | True |
| `verifier-and-audit.txt` | `references/evaluation-rubric.md` | False | 0 | True | True |
| `provenance.txt` | `CITATIONS.md` | False | 8 | True | True |
| `provenance.txt` | `CHANGELOG.md` | False | 19 | True | True |
| `provenance.txt` | `LICENSE` | False | 0 | True | True |

## Destination reconstruction (headers = only inserted bytes)

- `quantum-core.txt`: exact rebuild = **True**
- `shapes-and-build.txt`: exact rebuild = **True**
- `refactor-mode.txt`: exact rebuild = **True**
- `manage-core.txt`: exact rebuild = **True**
- `manage-operators.txt`: exact rebuild = **True**
- `manage-agent-design.txt`: exact rebuild = **True**
- `verifier-and-audit.txt`: exact rebuild = **True**
- `provenance.txt`: exact rebuild = **True**

## Residual backticked in-corpus refs to shipped members: **0** (expect 0)

`SOURCE:` headers name original paths but are non-backticked; the Stage 6 backtick
grammar does not extract them (provenance labels, not cross-refs).

## Untouched classes (verbatim by design)
- RUNTIME-GENERATED (manifest.yaml, ledger.md, working/, prompt/current/, …)
- OUT-OF-CORPUS (DEPLOY.md, INSTALL-DESKTOP.md, docs/)
- DANGLING (`manage-verify.py` @ dogfood-audit — B4/D1, carried verbatim)
- `SKILL.md` refs (compressed to instructions; allowlisted for Stage 6)
