# dogfood-audit.md — the framework's audit checklist, run on its own instructions

Artifact under audit: `gem-instructions.md` (19,249 chars). Checklist source:
`references/audit-checklist.md` (shipped as part of `verifier-and-audit.txt`).
Shape: system persona / instructions field — loop-only sections (H, I, J, K) are
marked N/A rather than faked.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A | Right altitude | **PASS** | Directives are specific-but-adaptive ("Cap at 6 flat questions", "commit only if second place is clearly behind"). Brittle-marker scan: `if-else` 0, `exhaustive` 0, `exactly as written` 0. Tier guidance conditions strength rather than hardcoding it. |
| B | Smallest viable token set | **PASS** | 19,249 chars = 64% of cap across 7 sections; every section addresses a named failure mode (mode misfire, retrieval miss, frame softening, sycophancy, substrate pretense). Depth pushed to knowledge files rather than duplicated. |
| C | Examples where rules are load-bearing | **PASS (noted)** | Load-bearing rules carry concrete form: mode detection ships verbatim trigger phrasings and the exact disambiguating question; the interview ships its two universal questions. Worked per-shape examples live in `shapes-and-build.txt` by design (retrieval, not duplication). Non-blocking: an inline worked example is deliberately absent to protect B — the shape spines carry them. |
| D | Operator catalog complete | **PASS** | 7 sections, each with a distinct profile: stance (strong; amplifies constructive framing, suppresses keyword-hunting), modes (strong; routing), procedure (mid), refactor/manage (mid; pointers + degradation), wiring table (mid; enables retrieval), meta-principles (weak-mid; terminal). No decoration; no duplicate profiles. |
| E | Ordering optimized | **PASS** | Stance → modes → procedure → mode pointers → wiring → meta-principles. Strongest (identity/frame) first sets the subspace; wiring precedes meta so retrieval is known before closing; meta-principles occupy the high-attention terminal position. Swap test: stance-after-procedure would make the phases read as generic prompt advice — non-commuting, current order deliberate. |
| F | Interference check | **PASS** | Adjacent-pair risk examined: "explain accessibly" (setup/meta) vs "frame is not metaphor" (stance) could cancel into softening — resolved by making non-softening explicit in the stance and testing it in Smoke 3. "Disagree when warranted" vs warm/helpful register — resolved: honesty named as a cost to the user, not a tone. |
| G | Information preservation | **PASS** | Frame loaded first (survives most projections). Superposition preserved deliberately: shape inference holds a posterior; the interview defers architectural collapse; Plan's collapse in manage mode is the deliberate measurement. Nothing pre-collapsed that the source held open. |
| H | Long-horizon support | **N/A** | Loop shape only. |
| I | Loop completeness | **N/A** | Loop shape only. |
| J | Tier the ceremony | **N/A** | Loop shape only. |
| K | Self-similar handoffs | **N/A** | Loop shape only. |
| L | Tool / runtime consistency | **PASS** | Programmatic: wiring-table filenames == shipped filenames, exact match on all 8 (script output, Stage 7). Retrieval reality (selective, no directory listing) is stated in setup and re-stated at the table. |
| M | Measurement-aware | **PASS** | Reasoning-control guidance is substrate-relative ("whichever of temperature, effort, or thinking modes it exposes; recommend a setting, not a fixed budget"). Strongest operators front-loaded to dominate at temperature 0. |
| M2 | Verifier-readiness | **PASS** | Delivery enumerates the verifier set (static always; dynamic on stakes; cross-run on request) and points to `verifier-and-audit.txt`. Done-definition demanded as checkable, not vibe-based. |
| M3 | Permission to abstain | **PASS** | Degradation note licenses refusal of impossible operations (no filesystem); "disagree when warranted" licenses pushback; the one-question disambiguation licenses asking over guessing. |
| M4 | Cognitive-tools delivery completeness | **PASS (BLOCKING check)** | Programmatic: all four tool names present (`understand_question`, `recall_related`, `examine_answer`, `backtracking`); shipped "as a runnable artifact in the user's runtime format, not merely referenced"; wiring instruction present (each tool's `description` is the role prompt); verbatim prompts routed to `quantum-core.txt`. |
| M5 | Scaffold restraint | **PASS** | Named as a check with a demanded scaffold-to-trigger list and the production-engineer test; strike rule for untraceable scaffolds. Applied reflexively: no scaffold added to these instructions without a trigger. |
| M6 | Reasoning-channel separation | **PASS** | Phase 1's posterior is explicitly internal ("hold an internal posterior"); Phase 2's summary collapse is the surfaced output. Internal deliberation and user-visible output kept distinct. |
| N | Branch-specific checks | **PASS** | Persona/instructions branch: identity established first, scope bounded, retrieval contract explicit, degradation honest. |
| O | Optional empirical tests | **PASS** | Permutation test offered as an option for high-stakes ordering uncertainty (Prompt L), not defaulted — consistent with M5. |

## Verdict

**DOGFOOD PASS — no blocking issues.** M4 (the only BLOCKING check) passes on
programmatic evidence. Nothing repaired at this stage, so **no Stage 6 re-run is
required** (the gate's condition is "green if anything was touched"; nothing was).

One non-blocking note (C): inline worked examples are intentionally absent from
the instructions field and carried in `shapes-and-build.txt` instead — a
deliberate B/retrieval trade, re-triggerable if smoke testing shows shape
drafting degrading without an in-context example.
