# Dogfood audit — the inner MAPE operator prompts

Per the framework closure requirement (I9 — the managing system is itself made of prompts) and the skill's own
"eat your own dogfood" rule, the two shipped operator prompts were run through
the framework's own audit checklist and three-axis rubric, then revised via
refactor **Mode B** (targeted). Both are Shape 2, agent-consumable (their output
is the dominant operator on the consuming phase), so Check C and the
examples-as-operators discipline apply with full force.

## Findings (pre-revision)

| # | Check | Artifact | Finding | Severity |
|---|-------|----------|---------|----------|
| F1 | C / examples-as-operators | both | Output format given as a placeholder template with **no worked example**. For an agent-consumed format, the filled example is load-bearing, not optional. | blocking-for-exemplar |
| F2 | examples-as-operators (silent judgment call) | Monitor | `var=<low\|mid\|high>` had **no bucketing rule** — the model reverse-engineers the threshold. | non-blocking |
| F3 | examples-as-operators (silent judgment call) | Analyze | anti-oscillation "equivalent option" **undefined in the prompt** (the definition lived only in workflow D3). | non-blocking |

Not flagged (checked, passed): M5 scaffold restraint — the worked example is
trigger-traceable (Check C mandates it; agent-consumability makes format the
dominant operator), so adding it is not shelf-reaching. M6 reasoning-channel —
neither prompt asks the model to reveal internal thinking; `finding:` is
task-mandated justification, which is fine. E ordering — role → input → task →
output → rules(failure modes near end); correct operator-strength order.

## Resolutions (Mode B diffs)

- **Monitor:** added a variance-bucket rule (low `<0.1` range / mid / high
  `>0.3`; binary observable → low) and a filled worked example (6 runs, one goal)
  inside the shipped prompt. The example is consistent with the Analyze example
  (same billing-vs-account scenario — Check C cross-example consistency).
- **Analyze:** added the equivalence definition (same trigger + same section +
  same operator intent, not diff identity — D3) and a filled Prompt-A worked
  example with the weight sum shown (`0.60 + 0.25 + 0.15 = 1.0`).
- **Verifiers extended:** each artifact's inline I9 verifier gained
  `worked-example` + (`variance-bucketed` / `equivalence-defined`) checks; the
  executable `manage-verify.py` enforces them (Monitor 10 checks, Analyze 11).
  Negative control: stripping the worked example → GATE FAIL, so the check is
  load-bearing.

## Scores (honest, sunk-cost-adjusted)

| Axis | Monitor before → after | Analyze before → after |
|------|------------------------|------------------------|
| Token economy | 8 → 8 (the example costs real tokens; justified) | 8 → 8 |
| Task fit | 7 → 9 (agent-consumed format now fully specified) | 7 → 9 |
| Operator coherence | 8 → 9 (silent judgment calls resolved) | 8 → 9 |

**Overall.** Both are ready to ship and now meet the exemplar bar the closure
requirement (I9) demands of the framework's self-referential operators. Token
economy stays at 8, not 9 — the worked examples are a real, deliberate cost paid
for format reliability on the consuming phase, not free.

## Standing instruction logged (Stages 4–6)

Per the operator directive, the remaining workflow prompts are produced *through
the skill's procedure*, not hand-written:

- **Stage 4 replay verifier** — a script, not a prompt (no shape applies);
  designed conventionally.
- **Stage 5 manage-mode static verifier** — a **Shape 6 (LLM-as-judge)** prompt:
  run shape inference → operator-design drafting → audit (bias controls,
  calibration anchors, reasoning-before-scoring per Check N) → three-axis eval →
  ship its own static verifier. Dogfooded like the two above.
- **Stage 6 dogfood agent** — a real managed agent's prompt, produced by
  from-scratch mode and shipped as a managed package.
