# Evaluation rubric

After audit catches structural failures, evaluation scores the prompt on three axes that the audit doesn't cover. Goal: give the user calibrated information about what they're getting.

**Hard rule: be honest, not generous.** Inflated scores hurt the user. A 7/10 with a named gap helps them decide whether to iterate or ship.

## Axis 1: Token economy (1–10)

Are the tokens spent buying behaviors that matter?

### Scoring

- **9–10.** Every section addresses a specific failure mode or enables a concrete behavior. Examples are load-bearing. No preemptive edge cases. No ritual structure.
- **7–8.** Solid mostly, with 1–2 sections that could be tightened or merged.
- **5–6.** Several sections have thematic overlap or unnecessary duplication. Loop ceremony (if applicable) taxes every turn equally without tiering.
- **3–4.** Significant redundancy. Generic warnings. Sections without clear purpose.
- **1–2.** Mostly noise. Brittle or vague directives dominate.

### Common deductions

- Two sections covering the same theme: -1
- Failure modes that don't address specific sharp edges: -1
- No worked examples for load-bearing rules: -1
- More than 10 failure mode bullets (likely over-warning): -0.5
- Style rules describing model defaults: -0.5

### Common credits

- Operator profiling visible in section design: +0.5
- Examples per mode in tiered contracts: +0.5
- Section ordering reflects operator strength: +0.5

## Axis 2: Task fit (1–10)

Does the prompt cover what the user actually needs delivered?

### Scoring

- **9–10.** Captures both the immediate task and downstream needs (reviewer audience, audit trail, calibration data, etc.). Audience and time budget acknowledged where relevant.
- **7–8.** Captures the build well; one or two downstream deliverables possibly missing.
- **5–6.** Captures the build only. Downstream needs silent. Audience assumed.
- **3–4.** Build coverage partial or off-spec.
- **1–2.** Significant misalignment.

### Common deductions per shape

**Agentic loop.**
- No design-rationale log alongside state log: -1
- No grader/reviewer audience awareness if academic: -1
- No metrics capture for runs: -0.5

**One-shot.**
- No few-shot examples on a non-trivial task: -1
- Output format unspecified or vague: -1.5
- No edge-case handling for cases the user described: -1

**Workflow.**
- Inter-stage output schemas missing: -1
- No failure handling between stages: -0.5

**Sub-agent / tool.**
- Tool description overlaps ambiguously with sibling tools: -1
- Side effects not stated: -0.5

**System persona.**
- No refusal patterns: -1
- No drift resistance for long conversations: -0.5

**LLM-as-judge.**
- No calibration examples per score level: -1.5
- No bias controls (length, position): -1
- Score-before-reasoning ordering: -1

**Agent team.**
- Topology more complex than the task demands (e.g., orchestrator-workers where sectioning suffices): -1
- Orchestrator delegates understanding — vague worker dispatches without specific context: -1
- Interface contracts missing or unverified between roles (worker output schema vs. orchestrator expectation): -1.5
- Worker scope-lockdown language absent: -1
- Roles with destructive capability lacking the Shape 5 layered lockdown: -1.5
- No failure handling for worker failure, on a production-bound team: -0.5

### Common credits

- Captures a downstream deliverable the user didn't mention but obviously needs: +1
- Distinguishes session-level from project-level success: +0.5
- Acceptance criteria are checkable: +0.5

## Axis 3: Operator coherence (1–10) [quantum-semantic]

Do the sections work as a coordinated transformation, or are they a loose collection?

### Scoring

- **9–10.** Section ordering reflects operator strength. Interference pairs examined and resolved. Each section has a clear amplify/suppress/mix profile. No "decoration" sections.
- **7–8.** Mostly coherent; one or two ordering choices feel arbitrary or one section's role is unclear.
- **5–6.** Sections present without operator awareness. Ordering is by tradition rather than design. Some interference effects unexamined.
- **3–4.** Sections appear randomly ordered. Multiple personas or constraint pairs likely producing destructive interference.
- **1–2.** Fundamentally incoherent — sections work against each other.

### Common deductions

- Strong operators placed late: -1
- Multiple unexamined personas: -1
- Output format placed first when it's not the dominant operator: -0.5
- Failure modes scattered through prompt instead of grouped: -0.5
- Constraints stacking destructively (concise + thorough, etc.): -1.5

### Common credits

- Visible operator-design reasoning in choice of structure: +1
- Interference checked for adjacent pairs: +0.5
- Ordering deliberately deviates from default with clear rationale: +0.5

## Reporting format

After scoring, report:

> **Token economy: X/10.** [One sentence: what's strong.] [If <8: one sentence on what would move it to 9.]
>
> **Task fit: X/10.** [One sentence: what's strong.] [If <8: one sentence on what's missing and how it'll bite if not addressed.]
>
> **Operator coherence: X/10.** [One sentence: what's strong.] [If <8: which section pairs are likely interfering or mis-ordered.]
>
> **Overall.** [Two sentences max — is the prompt ready to use, what to watch in the first run, anything that needs the user's eyes before shipping.]

## When to refuse to ship

If any score is below 6, name the gap and offer a fix before declaring done.

If two or more scores are below 7, propose a brief revision pass before delivering. The user can decline, but they should see the recommendation.

If all scores are 6+, deliver the prompt with the evaluation attached. Let the user decide whether to iterate.

## Sycophancy resistance

The temptation to award high scores grows with effort spent. Resist deliberately:

- After 5+ revisions, your perception is upward-biased by sunk cost. Adjust down.
- User satisfaction during drafting doesn't change the prompt's quality. Score the artifact, not the mood.
- When tempted to write 9, ask: "what would 10 look like?" If the answer is concrete and reachable, you're not at 9 yet.

The user benefits from accurate calibration. Sycophancy costs them downstream sessions.

## Empirical extension (optional, high-stakes only)

For production prompts where the cost of being wrong is high, offer the user a measured score in addition to the heuristic one:

- Run the prompt twice with two key-section orderings; compute output fidelity. Low fidelity → ordering matters → audit confirmed.
- Run the prompt at three temperatures (0, 0.5, 1.0) and inspect variance. Excess variance at low temperature → operator weakness; excess at high → mode-collapse risk.

This costs LLM calls. Worth it for prompts that will run thousands of times. Skip for one-off tasks.
