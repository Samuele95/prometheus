# Prometheus — Gemini Gem package (v2, EN)

A port of the **prompt-architect v2** framework (three modes: from-scratch /
refactor / manage) to a Gemini Gem. Everything needed to assemble the Gem is in
`en/` and `knowledge/`.

**Start here:** `en/setup-guide.md`.

## Contents

```
en/
  gem-instructions.md   paste into the Gem instructions field (19,825 chars)
  setup-guide.md        assembly steps + the naming note — read first
  smoke-tests.md        5 tests covering the 5 silent-failure surfaces
  dogfood-audit.md      the framework's own audit checklist, run on itself
knowledge/              upload all 8 .txt files; do NOT rename them
ship-manifest.md        SHA-256 of every shipped artifact + gate summary
run-evidence/           the audit trail (see below)
```

## Three things to know before you assemble it

**1. Filenames are load-bearing.** Retrieval is selective and the Gem cannot
list its own knowledge directory, so the instructions' wiring table names each
file exactly. A renamed file is an unreachable file.

**2. `.txt` is deliberate.** Gem knowledge upload accepts DOC, DOCX, PDF, RTF,
DOT, DOTX, HWP, HWPX, TXT, and Google Docs — not `.md` or `.yaml`. The corpus
ships as `.txt` with markdown structure preserved as literal text. Converting to
PDF would break the byte-level fidelity this package was verified against.

**3. The name split is intentional.** The Gem is **Prometheus**; the framework
inside it is **prompt-architect v2**, and the knowledge corpus says so
throughout — `provenance.txt` even contains a "How to cite Prompt Architect"
section. Those files are carried verbatim from source; a port must not rewrite
its source. The setup guide explains this to the Gem's user.

## Known upstream defect (carried, not repaired)

`manage-operators.txt` references `manage-verify.py`, which does not exist in
the source corpus (nearest artifact: the replay verifier shipped in that same
file). This is a **pre-existing source defect**, carried verbatim because a port
must not silently repair its source. Fix it upstream in the skill repo, then
re-port.

## What this package does not claim

Manage mode's native premise is a file-backed knowledge store and a runnable
replay verifier. A Gem has no filesystem, so manage mode ports as documented
procedure with an explicit degradation note: the user is the filesystem, and
replay verification runs externally. What is lost (mechanical gates,
byte-identical replay) and what survives (the MAPE procedure, ledger discipline,
operator algebra) are both stated in the instructions.

**No parity claim.** The same prompt on a different substrate is a different
measurement. Empirical results cited in the corpus were measured on other
runtimes; this package does not reproduce them by construction.

## run-evidence/

The full audit trail, kept with the package so the fidelity claims are checkable
rather than asserted:

| File | What it holds |
|---|---|
| `preflight-verdict.md` | Static verifier S1–S11 verdict on the workflow + brief |
| `census.md` | SHA-256 manifest of all 24 source files |
| `inventory.json` | 167 classified cross-reference edges, runtime allowlist rule |
| `constraints.md` | Platform limits verified with source + date |
| `coverage-matrix.md` | All 24 source files → dispositions and destinations |
| `transform-diff.md` | Span-level byte-diff proof of verbatim fidelity |
| `verification-report.md` | Stage 6 checks C1–C4, script output |
| `deviations.md` | D1–D5: every departure from the procedure, with rationale |
