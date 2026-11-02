# Verification report — Prometheus v3.3 Gem package

What was checked, how, and — the part that matters more — what was not.

## Checked mechanically

| # | Check | Method | Result |
|---|---|---|---|
| V1 | Coverage: every source file lands in a shipped file | inventory built from the source tree, each entry hashed and mapped | **PASS** — 15/15 skill files + `CITATIONS.md` + `LICENSE`; `SKILL.md` ported, the rest carried |
| V2 | Knowledge-file cap | count | **PASS** — exactly 10 |
| V3 | Instruction working cap (30,000 chars) | character count | **PASS** — 14,266 (48%) |
| V4 | Wiring table ↔ corpus consistency | every `` `*.txt` `` named in each instruction file set-compared against the corpus directory | **PASS** — 10 named, 10 present, 0 named-but-missing, 0 present-but-unnamed |
| V5 | Byte fidelity of carried text | line-count equality plus per-line normalization, all 20 carried sections | **PASS** — 1,929 lines, 79 changed, **0 unexplained** (`transform-diff.md`) |
| V6 | Cross-reference rewriting resolves | every rewrite target checked against the shipped file set | **PASS** — 100 rewrites, all resolving |
| V7 | No dangling source paths in normative files | regex sweep of the nine normative knowledge files | **PASS** — the only surviving `references/…` strings are the `SOURCE:` banners, which are provenance labels, plus the `CHANGELOG` section exempt by D3 |
| V8 | The v2 upstream defect is gone | search for `manage-verify.py` across sources and corpus | **PASS** — 0 occurrences in both |
| V9 | Hashes recorded for every shipped artifact | SHA-256 over the shipped bytes | **PASS** — 18 artifacts in `../ship-manifest.md` |

## Checked by reading, not mechanically

| # | Check | Result |
|---|---|---|
| V10 | The dogfood audit — the framework's own checklist run on `gem-instructions.md` | 0 blocking, 3 partial (check C: no inline worked example; B3: one deliberate ~900-char duplication; N5: refusal patterns implied rather than stated). Each named with a fix candidate and its character cost, in `../en/dogfood-audit.md` |
| V11 | Every v3 behavior change reaches the instructions | build-time-only ✓; the collapse block as a hard gate ✓; the nine-item Phase 6 order with complete installable files ✓; (P1)–(P11) cited never re-explained ✓; check labels A–O, Ib, M3b, N6b, N7m reachable ✓; the self-report as advisory not clearance ✓; doubt operators keyed to deployment ✓ |
| V12 | No parity claim anywhere | ✓ — stated as a section of the instructions, and repeated in README, setup guide and GEM-DESCRIPTION |

## NOT run — and why that is the correct outcome

| # | Gate | Status |
|---|---|---|
| V13 | **The static-mode verifier on `gem-instructions.md` in a fresh context** | **NOT RUN.** P8 requires an external observer, and the session that drafted this package is not one. Run it in a new empty chat before real use. |
| V14 | **The seven smoke tests** | **NOT RUN.** They require an assembled Gem, and assembling one means running it. Run them after upload. |
| V15 | Any measurement of the ported framework's behavior | **NOT TAKEN.** Prometheus v3 is build-time only, and this run honored that: no prompt, verifier or test in this package was executed here, and no figure in `run-evidence/` comes from an execution. |

A manifest reporting a passed smoke test would be precisely the failure Smoke 4a exists to catch. The honest state of this package is: **mechanically verified as a faithful port, behaviorally unverified.**

## Advisory readiness (P8) — not a clearance

The port is complete and internally consistent; every departure from the source is declared in `deviations.md` with its cost; three checks are partial, all named, none silent. What remains before real use is V13 and V14, and both are yours to run.
