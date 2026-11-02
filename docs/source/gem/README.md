# Prometheus — Gemini Gem package (v3.3, EN)

A port of the **Prometheus** skill v3.3 — three modes (from-scratch / refactor / manage), seven prompt shapes — to a Gemini Gem. Everything needed to assemble the Gem is in `en/` and `knowledge/`.

**Start here:** `en/setup-guide.md`.

## Contents

```
en/
  gem-instructions.md   paste into the Gem instructions field (14,266 chars)
  setup-guide.md        assembly steps — read first
  smoke-tests.md        7 tests covering the 7 silent-failure surfaces
  dogfood-audit.md      the framework's own checklist, run on this package
knowledge/              upload all 10 .txt files; do NOT rename them
ship-manifest.md        SHA-256 of every shipped artifact + gate summary
run-evidence/           the audit trail for this port run
```

## Four things to know before you assemble it

**1. Filenames are load-bearing.** Retrieval is selective and a Gem cannot list its own knowledge directory, so the instructions' wiring table names each file exactly. A renamed file is an unreachable file, and nothing reports the error — the Gem simply answers from memory of the corpus instead of from the corpus.

**2. `.txt` is deliberate.** Gem knowledge upload accepts DOC, DOCX, PDF, RTF, DOT, DOTX, HWP, HWPX, TXT and Google Docs — not `.md`, `.yaml` or `.py`. The corpus ships as `.txt` with its structure preserved as literal text. Converting to PDF would break the byte-level fidelity this package was verified against.

**3. The corpus stays in the framework's own language.** The ten knowledge files are English because they are the source, carried verbatim; a port does not rewrite its source. An Italian instruction variant exists, built on this same corpus with an added rule set for cross-language retrieval — it ships in the bilingual distribution, not in this one.

**4. The name split is gone.** v3 renamed the framework to *Prometheus*, so the Gem and its contents now agree. Earlier packages had to explain that the corpus called itself *prompt-architect*; there is nothing left to explain.

## Upgrading from the v2 package

The corpus was re-cut: **ten** files with new names, mapped as close to one-source-per-file as the ten-file cap allowed. Delete all eight old uploads before adding the new ones — `quantum-core.txt`, `shapes-and-build.txt`, `verifier-and-audit.txt`, `manage-core.txt`, `manage-operators.txt`, `manage-agent-design.txt`, `refactor-mode.txt`, and the old `provenance.txt`, whose name is reused but whose content is not. Then replace the instructions field wholesale.

The behavior changes that matter most: the collapse block is now a **hard gate** (Phase 3 opens only on the user's reply), the framework is **build-time only**, delivery ships **complete installable files** rather than descriptions, and the self-report is explicitly **advisory, never a clearance**.

## What this package does not claim

Manage mode's native premise is a file-backed knowledge store and a runnable replay verifier. A Gem has no filesystem, so manage mode ports as documented procedure with an explicit degradation note: the user is the filesystem, and replay verification runs externally. What is lost (mechanical gates, byte-identical replay) and what survives (the MAPE procedure, ledger discipline, operator algebra, every static package check) are both stated in the instructions.

**No parity claim.** The same prompt on a different substrate is a different measurement. Empirical results cited in the corpus were measured on other runtimes; this package does not reproduce them by construction.

**The dogfood audit is a self-report, not a clearance (P8).** It names three partial checks with fix candidates and character costs. The external gate is running the static-mode verifier on `gem-instructions.md` in a new empty chat, then the seven smoke tests.

## run-evidence/

The audit trail for this port run: `inventory.json` (every source file and where it landed), `coverage-matrix.md` (15 of 15 source files accounted for), `transform-diff.md` (every byte changed, and why), `deviations.md` (the declared departures), `constraints.md` (the substrate limits this package was built against), `verification-report.md` (what was checked mechanically and what was not).
