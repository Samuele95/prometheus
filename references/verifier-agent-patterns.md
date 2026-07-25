# Verifier-agent patterns

The verifier specification (`verifier-specification.md`) describes what to check. This file describes how to turn that spec into a runnable verifier — a Claude agent that takes a prompt's outputs and judges them against the spec.

The core insight: **a verifier-agent is itself a Shape 6 LLM-as-judge prompt**. The framework already has machinery for building good Shape 6 prompts (calibration anchors, bias controls, reasoning-before-scoring, the Goodhart framing). Verifier-agents inherit all of that. We're not introducing a parallel abstraction — we're applying the framework recursively to its own outputs.

## Two modes of verifier-agent

**Static-mode verifier.** Takes the prompt artifact itself (the text the framework produced) and audits its structural properties. Schema validity, section presence, examples-as-operators check, ordering, branch-specific requirements. Most of this is mechanical enough to be auto-generated from the verifier spec — the framework can ship a static-mode verifier prompt as a deterministic delivery artifact.

**Dynamic-mode verifier.** Takes a (prompt, input, output) triple and judges whether the output meets the prompt's stated criteria. Schema compliance, constraint satisfaction, named-failure-mode coverage, reasoning quality. This requires user judgment about what "correct behavior" means for the specific task — auto-generation is a strong starting template, but the user calibrates.

Both modes are Shape 6 prompts. Both inherit the Goodhart warning from Shape 6's audit: a misspecified verifier produces sharply optimized wrong outputs, not noisy outputs.

## When to deploy a verifier-agent (and when not to)

Deploy when:

- The prompt runs at production scale (hundreds or thousands of times) and verification cost is amortized.
- The prompt has consequential outputs where silent failures are expensive.
- The prompt's behavior is hard to verify with code (requires LLM judgment).
- You need cross-run analysis (drift detection, calibration validation).

Don't deploy when:

- The prompt is one-off or low-stakes.
- Schema validation in code is sufficient.
- The task is simple enough that a misspecified verifier could mislead more than help.
- The verifier-agent's runtime cost would exceed the prompt's value.

The default for the framework is **verifier spec ships always; verifier-agent prompt ships when stakes warrant**. For Shape 6 (LLM-as-judge) prompts in production, almost always. For Shape 2 (one-shot) extraction in low-volume use, often not.

## Static-mode verifier-agent template

The static-mode verifier-agent is auto-generatable because the audit criteria are mechanical. The framework produces this as a delivery artifact for any prompt above a stakes threshold.

```
You are a static-mode verifier for prompts produced by the Prometheus framework. Your job is to audit a prompt artifact against its shape's verifier specification. You do not run the prompt; you only inspect its text.

## What you receive
A prompt artifact (the text of a prompt) and the shape it was designed for (Shape 1–7).

## Rubric

Audit the prompt against these criteria. Each criterion is pass/fail with reasoning. If any criterion fails, the prompt should not ship.

[Static-layer criteria from verifier-specification.md for this shape, inserted automatically]

## Output format

Return a JSON object:
{
  "shape": "<Shape 1-7>",
  "criteria": [
    {
      "name": "<criterion name>",
      "passed": true|false,
      "reasoning": "<one to three sentences citing the specific element of the prompt that does or does not satisfy this criterion>"
    }
  ],
  "overall": "pass" | "fail" | "fail-with-warnings",
  "blocking_issues": [],
  "warnings": []
}

## Bias controls

- Don't reward length — a longer prompt is not better-audited than a shorter one. Audit each criterion independently.
- Don't reward sophistication — fancy vocabulary is not a substitute for meeting criteria. If a section uses elaborate language but doesn't satisfy the criterion, mark it failed.
- Be specific in reasoning. "The role binding is unclear" is unhelpful; "The role binding spans three sentences but doesn't name a specific competence" is actionable.

## Prompt to audit
{prompt_text}

## Shape
{shape_number}
```

The framework substitutes the per-shape static criteria from `verifier-specification.md` into the rubric slot. The output is structured, parseable, and the blocking_issues list determines whether the prompt should ship as-is or needs revision.

## Dynamic-mode verifier-agent template

Dynamic-mode is more contextual — the user knows what "correct behavior" looks like for their task, and the framework provides a starting template that the user calibrates. The template:

```
You are a dynamic-mode verifier for outputs produced by a [shape-name] prompt. Your job is to judge whether a single output meets the prompt's stated criteria.

## What you receive
- The original prompt that produced the output.
- The input the prompt was run on.
- The output the prompt produced.

## Rubric

Score the output on the following criteria. Each criterion has anchored definitions; reasoning before scoring.

[Single-run dynamic criteria from verifier-specification.md for this shape, with placeholders for user calibration]

[For each named user-failure-mode from the interview: a criterion checking whether this output handled it correctly]

## Calibration anchors

[User fills in: examples of clear-pass, borderline, and clear-fail outputs for this prompt's specific task. The framework provides 1-2 starter anchors per criterion; the user adds task-specific ones.]

## Bias controls

- Length bias: short, correct outputs are not worse than long, correct outputs. Score on substance.
- Position bias: when comparing outputs, randomize order; if comparing to a reference, randomize which side is reference.
- Persona bias: don't reward outputs that sound like the prompt's role; reward outputs that satisfy the criteria.

## Output format

{
  "criteria": [
    {
      "name": "<criterion name>",
      "reasoning": "<one to three sentences locating the output against the anchors>",
      "score": <1-5> | <pass|fail>,
      "evidence": "<specific quote or reference from the output>"
    }
  ],
  "overall": "pass" | "fail" | "borderline",
  "actionable_feedback": "<if fail or borderline: what specifically would need to change>"
}

## The original prompt
{prompt_text}

## The input
{input}

## The output
{output}
```

The actionable_feedback field is what makes this verifier useful for self-correction loops — it's what gets fed back into the next iteration.

## Cross-run verifier-agent

For cross-run analysis, a separate verifier-agent takes N (input, output) pairs and looks for distributional issues. Different from dynamic-mode because the focus is on patterns across runs, not on individual outputs.

```
You are a cross-run verifier for a [shape-name] prompt. You receive N (input, output) pairs from running the prompt repeatedly. Your job is to detect patterns the dynamic-mode verifier (which sees one output at a time) would miss.

## What to look for

[Cross-run dynamic criteria from verifier-specification.md for this shape]

## Specific patterns

- **Calibration drift.** Are scores higher for one type of input than the rubric justifies?
- **Distributional bias.** Do outputs systematically differ on protected categories or input characteristics that shouldn't matter?
- **Edge-case failures.** On inputs near the named failure modes, is the prompt failing at a higher rate than on standard inputs?
- **Consistency on identical inputs.** At temperature 0, do identical inputs produce identical outputs?
- **Goodhart indicators.** Do outputs look like they're optimizing for the rubric's surface form rather than its intent?

## Output format

{
  "patterns_detected": [
    {
      "pattern_type": "<from the list above>",
      "evidence": "<specific examples from the N pairs>",
      "severity": "low" | "medium" | "high",
      "recommended_action": "<what to do about it>"
    }
  ],
  "overall_health": "good" | "concerning" | "broken",
  "summary": "<one paragraph>"
}

## The N (input, output) pairs
{pairs}
```

This verifier is most valuable for Shape 6 (LLM-as-judge) prompts in production, where calibration drift over time is the dominant failure mode.

## Self-correction loop pattern

When a verifier-agent's output feeds back into the prompt's next iteration, you have a self-correction loop. Two common architectures:

**Verifier feeds the prompt designer.** The verifier-agent runs after each batch of N outputs. Its findings go to whoever maintains the prompt — a human, or in agentic settings, the original Prometheus framework session. The prompt is revised based on findings. This is the standard production maintenance loop.

**Verifier feeds the runtime.** In agentic-loop and evaluator-optimizer settings, the verifier-agent runs after each turn or iteration, and its findings inform the next turn's prompt directly. This is the runtime self-correction loop.

For agentic loops (Shape 1):

- Verifier-agent runs after each checkpoint completes.
- Verifier output goes into the next handoff prompt's "what verification flagged from the previous checkpoint" section.
- The agent's next iteration starts with both the seed brief and the previous turn's verification result.
- Self-correction is structural: the agent has explicit feedback to act on, not just memory of what it did.

For evaluator-optimizer topologies (Shape 7 sub-pattern):

- The verifier-agent IS the evaluator in the topology.
- Generator produces output, verifier evaluates with actionable feedback, generator iterates.
- Convergence handling: max-iterations cap plus an evaluator instruction to approve once output meets the bar (perfectionism is itself a failure mode).
- Regression tracking: the evaluator maintains a list of "what was approved in prior iterations" so the generator's prompt can preserve those aspects across revisions.

## The recursive case — verifying judge prompts

Shape 6 (LLM-as-judge) prompts can themselves be verified by Shape 6 verifier-agents. This is recursive but bounded — verifying the verifier-of-the-verifier rarely earns its cost.

The pattern works because at each layer, the verifier inherits the Goodhart framing and bias controls. But each layer also adds noise — the verifier-of-the-verifier may itself be miscalibrated, and you have less ability to detect that miscalibration the further up the stack you go.

Practical guidance:
- Layer 0: the user's task prompt.
- Layer 1: the verifier-agent for the user's prompt. Worth building for production prompts.
- Layer 2: a meta-verifier checking the verifier-agent. Worth building only when the verifier-agent is itself a production artifact (e.g., a judge prompt used at scale to score thousands of outputs daily).
- Layer 3+: rarely justifiable. Diminishing returns set in fast.

When the layer-2 verifier disagrees with the layer-1 verifier, the right resolution is usually to revise the layer-1 verifier's calibration anchors, not to keep stacking layers.

## What this means for Phase 6 delivery

When Phase 6 (delivery) runs, the framework now produces:

1. **The user's prompt** — the original deliverable.
2. **Usage instruction** — where to paste, what temperature, etc.
3. **Audit summary + 3-axis evaluation** — qualitative quality assessment.
4. **Verifier specification** — the per-shape spec describing what to check.
5. **Static-mode verifier prompt** — auto-generated, runnable Shape 6 prompt that audits the user's prompt artifact. Always shipped.
6. **Dynamic-mode verifier prompt** — templated Shape 6 prompt that the user calibrates with task-specific anchors. Shipped when stakes warrant.
7. **Cross-run verifier prompt** — templated Shape 6 prompt for distributional analysis. Shipped only on explicit request, since it's only useful at scale.

For Shape 7 (agent team), the verifier set expands: per-role verifier-agents (each role's outputs verified per its individual shape's spec) plus a cross-role contract verifier (do worker outputs actually match what the orchestrator expects?).

## When the framework should refuse to ship

If the static-mode verifier — running on the framework's own draft — detects blocking issues, the framework should not deliver. It should report the blocking issues to the user and offer revision before shipping. This is the framework eating its own dogfood: the verifier-agent is a Shape 6 prompt, the framework knows how to evaluate Shape 6 prompts, and refusing to ship a flawed artifact is what a serious framework does.

This closes the loop: the framework produces prompts, verifies them with its own machinery, and only ships when the verification passes. The user gets a stronger guarantee than "here's your prompt, audit it yourself" — they get "here's your prompt, and it's already passed the audit."
