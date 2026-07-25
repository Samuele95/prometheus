# Pre-flight verdict — gem-port-static-verifier-v2 (S1–S11)

Audited pair: `gem-port-workflow-v2.md` (procedure-of-record) +
`gem-port-v2-brief.md` (execution brief). Static-mode audit; every verdict
quotes the artifact under audit. Shipped as the first gate evidence of the run.

```
VERDICT: SHIP

S1  PASS — WF:20 "Invariants (read first; these bind every stage)" precedes the Stage map (WF:103); WF:23–24 "When a stage instruction and an invariant conflict, the invariant wins."
S2  PASS — every stage carries consumes/transform/output/gate; gates checkable, e.g. WF Stage 3 "matrix rows = Stage 1 inventory count; resulting knowledge-file count ≤ verified cap; every destination ≤ verified per-file size." No vibe gate found.
S3  PASS — consumed outputs are format-specified: WF "coverage-matrix.md — one row per source file: source path, disposition, destination knowledge file, one-line reason"; Stage 1 → "inventory.json (file census + classified edge list)."
S4  PASS — I1 has a mechanical enforcement point at WF Stage 5 gate: "a programmatic byte-diff verifier (difflib opcode classification or equivalent) proves every change belongs to an allowed class."
S5  PASS — WF Stage 6: "All evidence is script output; model-narrated verification is rejected."
S6  PASS — WF params "priors: # updated by Stage 2, never trusted as-is"; "instructions_char_cap: unknown … VERIFY"; I6 "Last-verified values are provided as priors, not facts."
S7  PASS — I3 "Repo metadata (LICENSE, CHANGELOG, CITATIONS) gets a disposition like everything else."; WF Stage 3 gate "matrix rows = Stage 1 inventory count"; Stage 6 C3 "Zero inventory files absent from the matrix."
S8  PASS — WF "Two consecutive failures of the same gate → stop and report to the operator instead of thrashing."
S9  PASS — stop rule present (S8); declined-with-re-trigger present, BRIEF B3 "Alternative disposition, declined with re-trigger: omit manage mode entirely; re-trigger if the instructions char budget cannot absorb three modes after compression."
S10 PASS — WF Stage 7 "re-run the size gate on localized instructions independently (translations run longer)"; param localize_knowledge_files "If true, Stage 7 gains a back-translation spot-check gate."
S11 PASS — WF Stage 1 grammar covers path-prefixed + "bare backtick-quoted filenames without a directory prefix" + "bare directory references"; four-way class {IN-CORPUS/RUNTIME-GENERATED/OUT-OF-CORPUS/DANGLING}; Stage 6 C1 allowlists RUNTIME-GENERATED. Corpus demonstration attached below.

BLOCKING: none
NOTES:
  1. S11 is blocking-eligible for this corpus (bare-filename + runtime-generated both present) and PASSES; corpus demonstration was run at pre-flight rather than deferred to the Stage 1 gate (grep evidence below), strengthening the verdict.
  2. BRIEF B6 lists agent-state.md among bare-filename instances; on-disk it shows 2 backticked occurrences (bare-vs-prefixed split is a Stage 1 classification job, not a pre-flight discrepancy). Illustrative list, not a byte-exact count — no repair needed.
  3. The four always-blocking checks (S2, S4, S5, S7) all PASS.
```

## S11 corpus demonstration (run at pre-flight, not deferred)

Bare-filename convention fires (backticked, no directory prefix), counts on disk:
`agent-consumability.md` ×3, `section-operators.md` ×2, `verifier-specification.md` ×2,
`agent-state.md` ×2, `shape-catalog.md` ×1, `reasoning-patterns.md` ×1,
`quantum-principles.md` ×1, `audit-checklist.md` ×1.

Runtime-generated convention present: `manifest.yaml` (3 files), `ledger.md` (5),
`goals.yaml` (2), `environment.yaml` (4), `managed-system.yaml` (3).

DANGLING instance confirmed: `manage/dogfood-audit.md:36` →
"executable `manage-verify.py` enforces them" — 0 matches on disk; nearest
existing artifact `manage/replay-verifier.py`.
