# Verification and evaluation

Two instruments ship with every delivered prompt: the **verifier specification** — what counts as success, separate from the prompt: per shape, what to check on the artifact (static), on one output (single run), across many (cross-run) — and the **verifier-agents** that turn it into runnable Shape 6 judge prompts, one template, three modes. The **self-report** scores the draft before delivery (Phase 5). Everything here is *produced* for the user to run; the framework runs only the static-mode verifier on its own draft, in a fresh context (SKILL.md, Build-time only; P8).

## Verifier specification

Consumed by a human or harness writing tests and by a verifier-agent (template below). Per shape, the **static** layer is the shape's checks in `references/audit.md`; **single-run** and **cross-run** are its **Verify** lines there. Every spec covers all three even when one is minimal. The managed-agent package has no shape: `references/manage.md`. Out of scope: the task's substantive correctness (is this the right rubric? — the user's question), infrastructure, statistical guarantees. Diagnostic: fewer than 5 single-run checks and nothing worth running cross-run → a simple prompt, or an interview that never learned what "correct" looks like; a spec costlier than the prompt → over-engineering.

## Verifier-agents — modes and template

A verifier-agent is a Shape 6 prompt and inherits everything Shape 6 has — anchors, bias controls, reasoning before scoring, the Goodhart framing (`references/shapes.md`; N6; P8): a misspecified verifier produces sharply optimized wrong outputs.

- **Static** — takes the prompt artifact, audits its structure against the shape's static criteria. Mechanical: auto-generated from the spec, shipped for every prompt, and the pre-delivery gate (What ships).
- **Dynamic** — takes a (prompt, input, output) triple, judges one output against the single-run criteria and the interview's named failure modes. The framework supplies 1–2 starter anchors per criterion; the user calibrates. Its `actionable_feedback` field is what self-correction loops feed back.
- **Cross-run** — takes N (input, output) pairs, detects distributional patterns one output can't show: calibration drift, distributional bias, edge-case failure rates, consistency on identical inputs under the runtime's most deterministic setting, Goodhart indicators (surface-form optimization).

**Template** — one prompt, the mode-specific slots filled from the spec:

```
You are a [static|dynamic|cross-run]-mode verifier for a [shape-name] prompt produced by the Prometheus framework.
[static]    You inspect the prompt's text; you never run it.
[dynamic]   You judge whether one output meets the prompt's stated criteria.
[cross-run] You receive N (input, output) pairs and detect patterns a single-output judge would miss.

## What you receive
[static]    The prompt artifact and its shape (1–7).
[dynamic]   The original prompt, the input it was run on, the output it produced.
[cross-run] The prompt and N (input, output) pairs.

## Rubric — reasoning before any verdict; every verdict cites the specific element it rests on
[static]    <the shape's static criteria, each pass/fail; any failure means the prompt should not ship>
[dynamic]   <the shape's single-run criteria, anchored; one criterion per interview-named failure mode>
            Calibration anchors: <clear-pass, borderline, clear-fail per criterion — starter anchors, user completes>
[cross-run] <the shape's cross-run criteria> plus: calibration drift, distributional bias, edge-case failure rate
            near named failure modes, consistency on identical inputs, Goodhart indicators.

## Bias controls
Audit each criterion independently. Length is not quality; sophistication is not compliance; when comparing,
randomize order and which side is the reference; do not reward outputs that merely sound like the prompt's role. Be specific: "role binding unclear"
is useless, "spans three sentences and names no competence" is actionable.

## Output — JSON
[static]    {"shape": "<1-7>", "criteria": [{"name", "passed": true|false, "reasoning"}],
             "overall": "pass|fail|fail-with-warnings", "blocking_issues": [], "warnings": []}
[dynamic]   {"criteria": [{"name", "reasoning", "score": <1-5>|"pass"|"fail", "evidence": "<quote>"}],
             "overall": "pass|fail|borderline", "actionable_feedback": "<what would need to change>"}
[cross-run] {"patterns_detected": [{"pattern_type", "evidence", "severity": "low|medium|high", "recommended_action"}],
             "overall_health": "good|concerning|broken", "summary": "<one paragraph>"}

## Material
{prompt_text} [dynamic: + {input}, {output}] [cross-run: + {pairs}]
```

## Self-correction loops, bounded recursion

A verifier whose output feeds the next iteration is a self-correction loop: **feeding the designer** — findings go to whoever maintains the prompt (a human, or a later Prometheus session in refactor mode); **feeding the runtime** — in loops and evaluator-optimizer topologies it runs after each turn or iteration: for Shape 1 it runs after each checkpoint completes and its output enters the next handoff's "what verification flagged" section, so the next iteration starts with both the seed brief and the previous result — correction is structural; for evaluator-optimizer the verifier *is* the evaluator (`references/agent-teams.md`). Recursion is bounded: layer 1 (the prompt's verifier) for production; layer 2 (a meta-verifier) only when the verifier itself scores thousands of outputs; layer 3+ rarely earns its cost. Layer 2 disagreeing with layer 1 → revise layer 1's anchors, don't stack.

## What ships

Delivery order: SKILL.md, Phase 6. Gating: **verifier specification** and **static-mode verifier** always — auto-generated, so gating saves no attention (P5), and the static one is the pre-delivery gate; **dynamic-mode** when stakes warrant — production scale, silent failures that are expensive, behavior only LLM judgment can verify (Shape 6 in production almost always; low-volume Shape 2 extraction often not; never where code validation suffices, a misspecified verifier would mislead more than help, or the verifier would cost more than the prompt is worth); **cross-run** on request; **Shape 7** expands to per-role verifiers plus a cross-role contract verifier. Every optional verifier names its trigger (M5).

**Eat your own dogfood.** Before shipping, run the static-mode verifier on the draft in a fresh context (P8): blocking issues → report and offer revision, don't deliver. The one execution outside manage mode, and it inspects text only; the user gets a prompt that already passed the audit. The package gate is in `references/manage.md`.

## Self-report — three axes, 1–10

After the audit, the drafting session scores the draft on three axes the audit doesn't cover — a self-report (P8): it discloses and asks for revision, never clears the delivery. **Honest, not generous** — a 7 with a named gap helps; an inflated 9 costs downstream sessions. Revision thresholds: SKILL.md, Phase 5. The rules the deductions name are owned elsewhere (`references/operators.md`, `references/audit.md`, `references/shapes.md`, `references/loops.md`, `references/agent-teams.md`); this section fixes only their weight.

The axes anchor at 10 / 5 / 1 and interpolate: 7–8 = solid with one or two tightenable spots; 3–4 = the failure the 1-anchor names, present but not dominant (N6b). **Axis 1 — Token economy.** 10: every section buys a named behavior, examples load-bearing, no ritual. 5: thematic overlap, untiered ceremony. 1: noise. Deductions: two sections on one theme −1; failure modes without a sharp edge −1; no worked example for a load-bearing rule −1; more than 10 failure-mode bullets −0.5; style rules describing model defaults −0.5. Credits: visible operator profiling +0.5; examples per mode +0.5; ordering by strength +0.5.

**Axis 2 — Task fit.** 10: the task and its downstream needs (reviewer audience, audit trail, calibration data). 5: the build only, downstream silent. 1: misaligned. Deductions — loop: no design-rationale log −1, no reviewer awareness when academic −1, no run metrics −0.5; one-shot: no few-shot on a non-trivial task −1, format vague −1.5, described edge cases unhandled −1; chain: schemas missing −1, no failure handling −0.5; tool: overlaps a sibling −1, side effects unstated −0.5; persona: no refusals −1, no drift resistance −0.5; judge: anchors short of N6b −1.5, no bias controls −1, score before reasoning −1; team: topology heavier than the task −1, delegated understanding −1, contracts missing −1.5, no scope lockdown −1, destructive role without layered lockdown −1.5, no failure handling in production −0.5. Credits: an unnamed but needed downstream deliverable +1; session vs project success distinguished +0.5; checkable acceptance criteria +0.5.

**Axis 3 — Operator coherence** (P1, P2, P4). 10: ordering reflects strength, interference examined, every section profiled. 5: ordering by tradition, interference unexamined. 1: sections work against each other. Deductions: strong operators late −1; unexamined multiple personas −1; format first when not dominant −0.5; failure modes scattered −0.5; destructive constraint stacking −1.5. Credits: visible operator reasoning +1; adjacent pairs checked +0.5; a reasoned departure from the default order +0.5.

**Report** (this is the delivery's audit + evaluation summary):

> **Token economy: X/10.** [what's strong; if <8, what moves it to 9]
> **Task fit: X/10.** [what's strong; if <8, what's missing and how it bites]
> **Operator coherence: X/10.** [what's strong; if <8, which pairs interfere or are mis-ordered]
> **Overall.** [two sentences: advisory readiness — never a clearance (P8) — what to watch in the first run, what needs the user's eyes]

**Sycophancy resistance.** After 5+ revisions adjust down for sunk cost; user satisfaction is not prompt quality; tempted to write 9, ask what 10 looks like — if concrete and reachable, it's not 9.

**Empirical extension** (high-stakes only; shipped as a spec, run by the user — check O): where ordering is in question, the permutation test v2 (`references/quantum-principles.md`, Measurement protocols); where the runtime exposes sampling knobs, the prompt at three settings with variance inspected — excess at low → operator weakness, at high → mode-collapse risk; where it doesn't, the levers it does expose (P6). Worth it for prompts that run thousands of times; skip for one-offs.
