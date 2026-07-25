# Quantum semantic principles — operational mapping

This document distills the quantum semantic framework into the operational principles the architect uses during drafting and audit. Each principle is paired with concrete actions.

## Principle 1: Prompts are operators, not keys

**Source:** §5.3 — "Context creates meaning—it does not reveal it."

**Implication:** You are not extracting answers from a model. You are constructing them by transforming the model's semantic state. The operator framing changes design from "find the right words" to "design the right transformation."

**Operational actions:**
- For every section, ask: what does this amplify, suppress, mix? (See `section-operators.md`.)
- When a prompt isn't working, don't ask "what keyword am I missing?" Ask "what's the wrong projection in my operator sequence?"
- Treat sections as matrices. Their order matters; their combination produces interference.

## Principle 2: Ordering is structural, not cosmetic

**Source:** §5.1, §2.3 — "Prompt operations don't commute. [A,B] ≠ 0."

**Implication:** "You are X, do Y" ≠ "Do Y, you are X." First operators dominate; they set the subspace within which later operators act.

**Operational actions:**
- Always order: broadest framing first (persona, domain), narrowing next (constraints), format last.
- For high-stakes prompts, run the **commutativity test** (Prompt D from the library): apply key sections in two orders, compare outputs. Fidelity < 0.99 ⇒ ordering matters; pick the better one.
- When debugging a prompt, try swapping section order before adding more content.

## Principle 3: Ambiguity is a feature, not a bug

**Source:** §5.2, §1.1 — Expressions are in superposition until measurement.

**Implication:** Premature collapse to a single interpretation destroys information. For ambiguous user requirements, enumerate interpretations with weights before defaulting.

**Operational actions:**
- During the interview, preserve superposition where the cost of asking is low and the cost of being wrong is high.
- For architectural decisions in drafted prompts, use the boundary-handoff enumeration pattern: list 2–3 plausible readings with weights, name the collapse condition, propose a default. (See Prompt I from the library.)
- For one-shot prompts where input is ambiguous, design output formats that preserve ambiguity (multiple weighted interpretations) rather than forcing a single answer.

## Principle 4: Combination is non-additive (interference)

**Source:** §5.4, §2.1 — "Combining contexts produces interference, not addition."

**Implication:** Two sections combined don't produce the sum of their effects. Constructive interference creates emergent behavior; destructive interference cancels behavior that either section alone would produce.

**Operational actions:**
- When stacking multiple personas, multiple tones, or constraint pairs, check for interference. (See `section-operators.md` for known pairs.)
- For multi-domain prompts, expect emergent behavior — don't assume "expert A + expert B = both perspectives."
- The audit checklist includes an interference check: for every adjacent pair of sections, is the combination producing the intended emergent behavior?

## Principle 5: Every interpretation step destroys information

**Source:** §5.6, §3.2 — Projection is irreversible. Information orthogonal to the context is lost.

**Implication:** Each prompt section, each interview question, each agent action is a measurement. Information lost early can't be recovered later.

**Operational actions:**
- Load critical context as early as possible — it survives more projections.
- Don't ask interview questions whose answers are already in the user's request — that's an information-destroying repetition.
- In agentic loops, design the suggested-next-message contract to preserve state across turns (memory file, structured handoffs).
- In workflow chains, design intermediate output formats to preserve information that downstream stages need.

## Principle 6: Sample, don't always pick the mode

**Source:** §5.5, §2.4 — Temperature is a measurement parameter. Mode vs distribution.

**Implication:** When the goal is exploration or discovery (auditing, testing, brainstorming), sampling at temperature > 0 reveals the full distribution. When the goal is determinism (production, single-shot extraction), temperature = 0 collapses to the most probable interpretation.

**Operational actions:**
- For shape inference during the interview, mentally sample multiple plausible shapes from the user's request before collapsing to one.
- For LLM-as-judge prompts that score a single artifact, recommend temperature = 0 to the user.
- For ideation prompts, recommend temperature > 0 and possibly multiple samples.
- For audit and testing of any prompt, recommend running at higher temperature and inspecting variance.

## Principle 7: Prompt engineering is empirical, not metaphysical

**Source:** §5.7 — Three measurable quantities: fidelity, interference, CHSH.

**Implication:** Prompt design has measurable structural properties. Don't rely on intuition when data is cheap.

**Operational actions for high-stakes prompts:**
- **Fidelity test** (Prompt D): swap section order, measure output similarity. If fidelity < 0.99, ordering matters.
- **Interference test** (Prompt F): apply two sections separately and combined, check whether combination produces emergent or cancelled behavior.
- For ambiguous cases, recommend the user run permutation tests (Prompt L) before committing to a final ordering.

## Principle 8: Observer-dependent meaning

**Source:** §1.2, Prompt N — Same expression, different observers, different meanings.

**Implication:** The same prompt produces different behavior in different LLMs (the LLM itself is part of the operator). The same memory file works differently for Claude Code vs Gemini CLI.

**Operational actions:**
- During the interview, ask which tool / runtime the prompt will run in. This shapes operator design.
- For prompts that may run in multiple runtimes, design for the lowest-common-denominator capabilities, then add tool-specific extensions.
- For LLM-as-judge prompts, account for the judge model's biases as part of the operator. Two different judge substrates score the same rubric differently — the rubric-plus-judge pair, not the rubric alone, is the measurement apparatus.

## Principle 9: Operator strength is substrate-relative

Operator strength is not intrinsic to a section; it is relative to the substrate it acts on. On a high-instruction-following substrate, a prescriptive operator over-projects — it collapses states the model's own defaults would have resolved better than the prescription. The same enumerated behavior list that corrected a weaker model's drift becomes, on a stronger model, an information-destroying constraint on a state that no longer needed collapsing.

Operationally: calibrate default operator strength *down* as substrate capability rises. Intensity language ("CRITICAL", "MUST", repeated prohibitions) and exhaustive enumeration are strong projections justified only when the substrate demonstrably fails without them. On stronger substrates, prefer brief general instructions and let the substrate's own priors resolve the residual superposition. (Primary evidence: Anthropic's cross-model best practices document that instructions written to correct under-triggering on older models cause over-triggering on newer ones, and that general instructions often outperform prescriptive step-by-step plans there. Scope: measured on that vendor's model families; adopted here as a design principle because it follows directly from Principles 1 and 5.)

The framework infers a **substrate capability tier** (frontier / strong / legacy; unknown → assume strong) from the runtime answer in Phase 1, and conditions default operator strength, scaffold-triggering thresholds, and delivery guidance on it.

## Selected library prompts (for reference)

These prompts from the source library are directly useful when designing or auditing meta-prompts:

- **Prompt A — Ambiguity Preservation.** YAML output with weighted interpretations. Use when an ambiguous user requirement should not be collapsed yet.
- **Prompt D — Commutativity Test.** Apply two contexts in opposite orders, compare. Use during the audit step for high-stakes prompts.
- **Prompt G — Bayesian Interpretation Audit.** Generate diverse interpretations, cluster, report distribution. Use when the user's task description is itself ambiguous.
- **Prompt I — Superposition Requirement Analysis.** Decompose vague requirements into weighted basis states with collapse criteria. Use during interview Phase 1 if the user's task description is unusually ambiguous.
- **Prompt L — System Prompt Ordering Optimizer.** Test multiple orderings, self-evaluate. Use as the optional permutation test in Phase 6.
- **Prompt N — Observer-Aware Communication Drafting.** Same message, multiple observers, controlled collapse. Use when designing prompts whose outputs will be read by multiple audiences.

Full text of these prompts is in the source paper's Appendix B.1. The framework's audit and evaluation steps incorporate their logic; users running the framework don't need to invoke them directly unless designing especially high-stakes prompts.

## Summary table

| Principle | Action in framework |
|---|---|
| Prompts are operators | Design sections by amplify/suppress/mix profile |
| Ordering matters | Strongest operators first, format last |
| Ambiguity is a feature | Preserve in interview; enumerate in handoffs |
| Combination is non-additive | Audit adjacent section pairs for interference |
| Steps destroy information | Load critical context early; preserve across stages |
| Temperature is measurement | Recommend per use case; sample for exploration |
| Empirical, not metaphysical | Optional permutation tests for high stakes |
| Observer-dependent | Account for tool/runtime as part of operator design |
