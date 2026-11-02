# Dogfood audit — Prometheus (Gem, EN)

The framework's own checklist (`audit.txt`, carried from `references/audit.md`) run on this package's own always-loaded artifact: `en/gem-instructions.md`. That artifact is a **Shape 5 — system persona**, so the universal checks plus the Shape 5 lines apply.

Two honesty notes about this document. First, per P8 it is a **self-report, not a clearance**: it was produced in the drafting session, which is not an external observer. The external gate is running the static-mode verifier on `gem-instructions.md` in a new empty chat — do that before trusting anything below. Second, port invariants are labelled **PORT-1…PORT-5** and never `I1…I9`: that numeric namespace belongs to manage mode in `manage.txt`, and reusing it is the exact collision the framework's own R8 unit repaired.

---

## Port invariants

| Id | Invariant | Held? |
|---|---|---|
| PORT-1 | A port does not rewrite its source. Source text carried verbatim. | HELD, with one declared transformation — see D1/D2 in `../run-evidence/deviations.md` |
| PORT-2 | Every source file reaches the shipped corpus. | HELD — 15 of 15 skill files, plus `CITATIONS.md` and `LICENSE`; see `../run-evidence/coverage-matrix.md` |
| PORT-3 | A port does not silently repair a source defect. | HELD — no source defect found to repair; the v2 package's dangling `manage-verify.py` no longer exists in v3, verified absent |
| PORT-4 | Substrate adaptations are declared, not smuggled. | HELD — the three Substrate points, the manage degradation note and the no-parity section each state what changes and why |
| PORT-5 | No parity claim, anywhere in the package. | HELD |

---

## Universal checks

| Check | Verdict | Evidence |
|---|---|---|
| **A. Right altitude** | PASS | Procedures name what to do and what decides it; none scripts an exchange turn by turn, none stops at "design good prompts". |
| **A2. Delegation rung** | PASS | Approach-level throughout — the shape spines, catalogs and banks live in the corpus and are pulled, not enumerated here. Correct for a frontier substrate (P9). |
| **A3. Context over constraint** | PASS | Each gate carries its because: the collapse block "collapsing what was never asked discards what the user was there to supply"; the wiring table "a renamed file is an unreachable file"; the fresh-context rule "it carries the draft's own operators". |
| **B. Smallest viable token set** | PASS | 14,266 characters, 48% of the 30,000 working cap. Every section names a behavior it buys. |
| **B2. Common waste** | PASS | No preemptive edge cases, no generic model warnings, no unchecked stylistic preferences. |
| **B3. One layer owns each thing** | PARTIAL | The "Holds" column of the wiring table restates each knowledge file's own header line. Kept deliberately: the header is only visible *after* a pull, and the routing decision happens before it. Cost measured at ~900 characters. |
| **B4. Progressive disclosure** | PASS | The always-loaded surface is instructions plus wiring table; every catalog, bank, spine and template is pulled on demand. This is the substrate's own mechanism, used as intended (P5). |
| **C. Examples where rules are load-bearing** | **PARTIAL — the package's weakest check** | The instructions carry no worked example. The corpus does, and pulls are cheap, but the collapse-block gate is the most load-bearing new rule in v3 and its worked example lives in `smoke-tests.md`, which the Gem never sees. Mitigation: the gate is stated three times (Phase 2, Phase 6 cross-reference, the modes section) with its because. Fix candidate for the next pass: one four-line collapse-block exemplar inline, ~600 characters, well inside the cap. |
| **C2. Required coverage** | N/A | No output format, few-shot set, loop or rubric is defined *by* this artifact. |
| **C3. Examples are operators** | N/A | No example-shaped material present — which is check C's finding, stated once there. |
| **D. Operator profile complete** | PASS | Identity + build-time-only (amplify: the constructive stance; suppress: execution and measurement claims; strong). Substrate (amplify: explicit pull, external observation; suppress: memory-based answering, fabricated persistence; strong). Modes + detection (mix; mid). Phases (amplify: the procedure; strong at Phase 2's gate, mid elsewhere). Drafting rules (mix; mid). Manage degradation + no parity (suppress: pretence; strong). Wiring table (amplify: retrieval; strong). Meta-principles (mix; weak). No section without a profile; no profile twice. |
| **E. Ordering** | PASS, with one declared departure | Identity and stance first, substrate second, then modes, procedure, rules, honesty operators, table, meta-principles last. **Departure:** the wiring table is a strong operator placed late (P2 would put it early). Reason: it is a lookup surface, not an instruction, and ten rows ahead of the procedure would push the procedure past the reader's and the model's attention peak; Substrate point 1 carries the *rule* to use it, at the top, where the strength belongs. |
| **E2. Swap test** | PASS | Substrate ↔ Modes changes behavior (retrieval discipline must precede any mode running), so the pair does not commute and the current order is the deliberate one. Rules ↔ Manage degradation commutes; order kept for reading flow. |
| **E3. Structure is mechanistic** | PASS | Headed sections, consistent ordering, one table. |
| **F. Interference** | PASS | Checked pairs: build-time-only × manage mode (the exception is named in both places, no cancellation); "no parity claim" × persona confidence (produces calibrated confidence, not hedging, because the no-parity claim is scoped to measurement); substrate point 3 × Phase 6 gate (reinforcing, not duplicating — point 3 defines the term, Phase 6 applies it). |
| **G. Information preservation** | PASS | The substrate facts load before every procedure that depends on them. What must stay ambiguous — the user's runtime tier — is explicitly flagged as *not this Gem*, twice, rather than pre-collapsed. |
| **L. Tool / runtime consistency** | PASS | Gem-specific throughout: knowledge upload, selective retrieval, instructions field, no filesystem, output-length behavior. No CLI feature is assumed; the runtime the drafted prompt targets is kept separate from the runtime this framework runs on. |
| **M. Measurement-aware** | PASS | A Gem exposes no sampling knobs, so the instructions carry no temperature prescription and delegate reasoning-control guidance to whatever the *user's* runtime exposes (P6). |
| **M3. Abstention** | PASS | Concrete and repeated: report `reaudit_pass` as unverified; label an inline gate as self-report; say plainly what cannot be read or run. |
| **M3b. Clarification matches deployment** | PASS | Deployment is interactive by construction — a Gem always has a user present — so the clarification operator is licensed, and the collapse-block gate depends on it. The unattended branch is still carried, verbatim from the source, for the case where the user hands over and leaves. |
| **M3c. Self-check complete** | PASS | Interview cap of six flat questions, one per turn; collapse block as the terminating measurement; assumptions marked when no reply comes. |
| **M6. Reasoning-channel separation** | PASS | Nothing instructs the model to echo, transcribe or reveal internal reasoning. Phase 5's self-report is a task-mandated justification field, which is the sanctioned form. |

## Shape 5 checks

| Check | Verdict | Evidence |
|---|---|---|
| **N5. Persona stability** | PARTIAL | Identity and drift resistance are strong: the frame is named canonical, the citation rule is absolute, the substrate facts are stated as facts. **Refusal patterns are thinner than the source's own Shape 5 guidance** — the artifact says what not to claim (a run it did not perform, parity, a clearance) but never states them as a refusal category with precedence. Smoke 4a, 5 and 6a exist because of this gap; they test behavior the instructions imply rather than state. Fix candidate: a three-line refusal block, ~400 characters. |
| **N5b. Layered lockdown** | N/A | Trigger is destructive capability. This Gem has no tools, no filesystem and no side effects; the layered lockdown belongs to *drafted* prompts, where the source carries it intact. |

## Gated checks

| Check | Verdict |
|---|---|
| **M2. Verifier-readiness** | PASS — every claim in the artifact is checkable from a transcript; the seven smoke tests are the extraction. |
| **M4. Cognitive-tools delivery** | N/A — the scaffold did not fire for this artifact. The *rule* about shipping it is carried verbatim for drafts the Gem produces. |
| **M5. Scaffold restraint** | PASS — optional scaffolds present: none. The only additions beyond the source are the three Substrate points, the manage degradation note, the no-parity section, the output-length rule and the wiring table, each traceable to a named substrate fact, not to shelf availability. |
| **O. Empirical tests** | Shipped, never run here. The seven smoke tests are the run instruction; the external static-verifier pass in a fresh chat is the gate. |

---

## Summary

Blocking: **none**. Partial: **three** — C (no inline worked example), B3 (one deliberate ~900-character duplication), N5 (refusal patterns implied rather than stated). All three are named above with a fix candidate and a character cost; none is a silent gap, and the cap has 15,700 characters of headroom if you want them closed.

**Advisory readiness, not a clearance (P8).** Run the static-mode verifier on `gem-instructions.md` in a new empty chat, then the seven smoke tests, before real use.
