# deviations.md — gem-port v2

One line per departure from the workflow's letter: what, why, which invariant/check
it was verified against.

## Stage 1

- **D1 (B4 · DANGLING, no silent repair).** `manage/dogfood-audit.md:36` cites
  executable `manage-verify.py`, which does not exist in the corpus (0 on disk;
  nearest artifact `manage/replay-verifier.py`). Carried **verbatim**, not
  repaired. Checked against I1 (porting must not repair source defects) and
  Stage 1 step 3 (DANGLING disposition). Flagged as an **upstream-fix
  candidate** for the delivery summary.

- **D2 (runtime allowlist built from the declared layout, not the 6 example
  names).** The workflow lists 6 "expected members" of RUNTIME-GENERATED
  ("...include manifest.yaml, ledger.md, goals.yaml, environment.yaml,
  managed-system.yaml, memory/"). Building the allowlist to *only* those 6
  false-classified 10 additional agent-workspace paths (`prompt/`,
  `prompt/current/`, `history/`, `history/v001/`, `history/vNNN/`,
  `history/vNNN.patch.json`, `tools/`, `knowledge/`, `working/`, `runs/`) as
  DANGLING. Those are declared runtime artifacts in the `agent-state.md:22-38`
  Package-layout block and in `manage-mode.md` phase I/O (e.g. the patch file at
  `manage-mode.md:143-144`). The workflow's word is "**include**" (non-exhaustive)
  and its instruction is to "build this list from **declarations** in
  agent-state.md and manage-mode.md." I therefore built the allowlist as a rule
  — 5 K-store files by basename + 7 workspace dir-roots by first path segment +
  `history/*.patch.json` — anchored to the layout block. Checked against B5 (this
  is the exact false-positive class B5 pre-empts; v1 spent a Stage-6 failure on
  it), Stage 1 step 3, and I3 (traceability: every target still carries a class
  with a declaration anchor). Departure is from the enumerated examples toward
  the stated intent; logged per discipline. Self-check: all 6 workflow-named
  members are covered by the rule.

## Stage 5

- **D3 (verifier-logic fix — char-level → span-level byte-diff; caught inline,
  not counted toward thrash-stop).** The first Stage 5 byte-diff verifier ran
  `difflib.SequenceMatcher` at CHARACTER granularity on (source-body vs
  ref-substituted body). It fragmented each reference substitution
  (`references/agent-state.md → manage-core.txt`) into incidental sub-opcodes
  (`'stat'→'cor'`, `'md'→'txt'`) that did not map to the classified (old→new)
  set, and its residual scan matched the non-backticked `SOURCE:` provenance
  headers. Both were **false alarms from the checker, not defects in the
  transform** — exactly the gate-checker blind-spot class that cost the v1 run
  a Stage-6 failure. Corrected to a SPAN-level verifier: a single non-overlapping
  substitution pass records each edit span; the gate proves (a) every non-edit
  byte is identical between source and shipped body, (b) every edit is a
  classified reference substitution, (c) each destination rebuilds exactly from
  `title + Σ(header + verbatim body)`, and (d) residual scan is scoped to the
  Stage-6 backtick grammar. Because the artifact was always correct and only the
  instrument was wrong, this is logged as a verifier fix, not an artifact gate
  failure; thrash-stop count for the Stage 5 artifact remains 0. Checked against
  I1 (byte-identity faithfulness) and S5/Stage-6 discipline (programmatic
  evidence, no narrated verification).

## Stage 6

- **D4 (C4 caught a port-introduced platform name; fixed by loop-back — Stage 6
  failure 1 of 2).** The C4 I4-sweep flagged 8 occurrences of "Gem" — one per
  knowledge file — in the port-authored title line ("See the Gem instructions
  wiring table"). This is a genuine I4 violation (platform names belong only in
  the setup wrapper, the instructions wiring table, and smoke tests, never in
  ported knowledge-file content), correctly caught by the checker rather than a
  false positive. Fixed at Stage 5 by rewording the title to "See the wiring
  table in the framework instructions" (no platform name); rebuilt and
  re-verified byte-diff (still PASS), then re-ran Stage 6 → C1–C4 all PASS.
  Two platform-name carries remain and are intentional: (i) the B2-mandated
  provenance header on the two non-md artifacts states "NOT executable inside
  the Gem" — operator-authorized by B2, classified as authorized carry, not a
  violation; (ii) pre-existing vendor/model references in the verbatim bodies
  (Claude, Anthropic, OpenAI, GPT, IBM, Gemini CLI, Claude Code) are accepted
  carry-forward under I1/I5 — honest empirical scope, source attribution, and
  multi-runtime format examples are protected content, never scrubbed.

## Post-run (operator-directed change)

- **D5 (Gem renamed to Prometheus; rename scoped by I1, not global).** Operator
  instruction: "rename Gem to prometheus". Applied to **port-authored surfaces
  only** (17 occurrences): the instructions identity line (`# Prompt Architect`
  → `# Prometheus`), the eight knowledge-file title lines, the setup-guide title
  and Gem-creation step, and the smoke-tests title. Rendered as `Prometheus`
  (capitalised proper noun) from the lowercase instruction.
  **Not applied to the 9 verbatim body occurrences** (`provenance.txt` ×7,
  including the "How to cite Prompt Architect" section; `verifier-and-audit.txt`
  ×2): those are source bytes, and I1 forbids rewriting them during a port — a
  global rename would have broken the byte-diff fidelity guarantee and falsified
  the citation section. Consequence handled, not hidden: a naming note was added
  to the setup guide (Prometheus = the Gem; Prompt Architect = the framework
  inside it) to pre-empt the identity-interference failure that an unexplained
  name split would otherwise cause (checklist F). Artifacts were touched, so per
  the Stage 7 gate the pipeline was re-verified: Stage 5 byte-diff re-run (PASS),
  Stage 6 C1–C4 re-run (PASS, instructions 19,249 ≤ 30,000), ship manifest
  regenerated (all SHA-256 values changed). Checked against I1 (verbatim
  fidelity), I4 (no platform name introduced — "Prometheus" is the Gem's name,
  not a vendor/platform reference), and the Stage 7 gate's re-run condition.
