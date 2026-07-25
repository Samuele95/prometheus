---
name: prometheus
description: Build-time meta-prompting framework that designs, audits, and refactors prompts for tool-calling LLM agents. Use whenever the user wants to write, design, build, improve, refactor, or audit any prompt — a system prompt, agentic-loop seed brief, one-shot task, workflow chain, sub-agent or tool description, system persona, LLM-as-judge or grader rubric, or multi-agent team. Trigger on requests like "write a prompt for X", "I need a system prompt", "design a grader", "build an agent", "set up a Claude Code prompt", "fix/improve/refactor my prompt", or when the user invokes /prometheus — and even when the user never says "prompt" but is clearly trying to get a model to behave a certain way. Produces the prompt in the right structural shape, audits and scores it honestly, and ships a runnable verifier plus cognitive-tool scaffolds for hard-reasoning tasks. Not for simple Q&A or when the user wants a direct answer rather than a reusable prompt.
license: MIT
---

# Prometheus

A general meta-prompting framework for crafting prompts for LLM agents. Works with any agentic CLI (Claude Code, Gemini CLI, Cursor, others) and for non-CLI use. Covers all seven prompt shapes: agentic loops, one-shot tasks, workflow chains, sub-agent prompts, system personas, LLM-as-judge graders, and agent teams.

The framework is built on classical context engineering (Anthropic's "right altitude," "smallest viable token set," "examples over rules") and on quantum semantic principles (prompts are operators, not key-finding; ordering is structural; ambiguity is a feature; combination is non-additive).

## When to use this skill

Trigger when the user is starting any prompt-design work for an LLM agent. Common phrasings:

- "Help me write a prompt for [task]"
- "I need a system prompt for [purpose]"
- "Set me up with a [Claude Code / Gemini CLI / etc.] prompt for [project]"
- "Design an LLM-as-judge prompt for [evaluation]"
- "I'm building a sub-agent that does [X], help me write its instructions"
- "Bootstrap an agentic loop for [task]"

Don't trigger for: simple Q&A, code completion requests, or tasks where the user wants the answer, not a prompt to get the answer later.

## Core stance: prompts are operators

The deepest reframing this framework rests on, from the quantum semantic literature: **a prompt does not "extract" the right answer from a model. A prompt is an operator that constructs an answer through transformation of the model's semantic state.** Each section of a prompt is a matrix that amplifies certain interpretations, suppresses others, mixes basis states to produce novel readings.

This is not metaphor. It changes design practice:

- We don't "find the right keywords" — we design transformations.
- Ordering is structural — operators don't commute.
- Combining sections produces interference, not addition.
- Each instruction destroys information; design accordingly.
- Ambiguity in user intent is a superposition, not a defect to flush out.

The skill applies these principles concretely, not as flavor. See `references/quantum-principles.md` for the operational mapping and `operators/` for the section-as-operator catalog.

## Three modes of operation

The framework operates in one of three modes depending on what the user brings:

**From-scratch mode (default).** The user describes a task; the framework produces a prompt. Six phases: shape inference → adaptive interview → operator-design drafting → audit → honest evaluation → delivery.

**Refactor mode.** The user has an existing prompt and wants to audit, fix, or rewrite it. Six phases (1R through 6R): receive and parse → intent recovery interview → mode selection (audit / targeted refactor / wholesale rewrite) → apply the mode → honest evaluation → delivery. Full procedure documented in `references/refactor-mode.md`.

**Manage mode.** The user points at an existing managed-agent package and wants to run it across its lifetime — monitor its runs, analyze a goal violation, adapt it, stop and restart it with the same inner state. This is the framework as an agent *manager*, not just a designer: a MAPE-K loop (Monitor / Analyze / Plan / Execute) over the agent's prompt, expressed through the operator algebra. Full procedure in `references/manage-mode.md`; package layout, lifecycle, and ledger in `references/agent-state.md`.

**Mode detection.** Auto-detect refactor mode when the user's opening message includes a pasted prompt followed by a request to audit, improve, fix, or refactor. Direct invocations like "refactor this prompt," "audit this prompt," "what's wrong with this prompt" trigger refactor mode immediately. Auto-detect **manage mode** when the user points at an existing agent package path or invokes a lifecycle verb against one — "manage this agent," "run an adaptation cycle," "why did my agent regress," "restart my agent." When detection is ambiguous (a prompt is pasted but the request is unclear), ask once: "I see a prompt — do you want me to refactor it, or were you using it as context for a different task?" Default to from-scratch mode unless refactor or manage signals are clear.

The three modes share infrastructure (the shape catalog, the operator catalog, the audit checklist, the verifier specifications) but run different procedures. Manage mode in particular *reuses* from-scratch and refactor machinery as subroutines (the audit checklist, the refactor sub-modes, the cross-run verifier) rather than adding new analytical machinery. The from-scratch procedure follows; refactor procedure is in `references/refactor-mode.md`; manage procedure is in `references/manage-mode.md`.

## From-scratch procedure (six phases)

### Phase 1 — Shape inference, not routing

The user's task description arrives as a semantic state in superposition. **Do not ask a routing question.** Infer the shape from the signals already present, in the spirit of §2.4 Bayesian sampling.

1. Read the user's request carefully. Extract signals: verbs (build / draft / classify / grade / evaluate / extract / summarize), nouns (system / document / pipeline / loop / agent / persona / judge), scale markers (one-shot vs ongoing, multi-turn vs single-call), and tool mentions (Claude Code, Gemini CLI, etc.).

2. Generate an internal posterior distribution over plausible shapes. The shape catalog is in `templates/shape-catalog.md`. Don't commit yet — keep weights.

3. Pick the shape with highest posterior mass *only if* the second-place shape is clearly behind. If two or more shapes are within ~30% of each other, the inference is ambiguous and you should disambiguate via one targeted clarification question. Phrase it as a forced choice between the top two shapes, not as an open routing question.

4. Domain (engineering / research / writing / ops / generic) is a **secondary axis**, orthogonal to shape. Infer it the same way. A one-shot writing prompt and an agentic engineering prompt both apply this framework, just with different section content.

5. **Detect hard-reasoning signals** during the same pass. Mathematical / logical tasks, multi-step planning, code analysis or debugging, multi-constraint problems, or any task where the user mentions the model failing on first try are signals that the cognitive-tools scaffold (per `references/reasoning-patterns.md`) should be a structural default in drafting, not an optional extension. Two or more signals + tool-calling runtime → include the scaffold **on legacy and strong tiers**, where the cited empirical result applies. On the frontier tier, the scaffold is an M5-triggered option, not a default — see `references/reasoning-patterns.md` §tier gating.

6. **Infer the substrate capability tier** — a third axis, orthogonal to shape and domain, read from the runtime answer: **frontier** (the runtime's newest high-instruction-following models), **strong** (current mainstream models), **legacy** (older or smaller models). Unknown → assume strong. Tier conditions: default operator strength in Phase 3 (Principle 9 in `references/quantum-principles.md` — prescriptive operators over-project on high-instruction-following substrates), scaffold-triggering thresholds (point 5 above), prefill availability, and reasoning-control parameter guidance in Phase 6.

### Phase 2 — Adaptive interview (operator-aware)

The interview is itself a sequence of operators applied to the user's intent. Per §5.6, every question collapses ambiguity irreversibly. Don't collapse too fast.

Conduct rules:

- **Cap at 6 flat questions total**, including any disambiguation question from Phase 1 (3 universal — deployment-context skippable when obvious — plus 2–3 shape-specific). Hard cap. Co-authoring passes (Shapes 3, 6, 7) are exempt per `templates/interview-branches.md` conduct rules.
- **One question per turn.** Multi-question turns produce shallower answers.
- **Skip questions whose answers are already in the user's request.** Re-asking is information-destroying repetition.
- **Question ordering matters** (§2.3, §5.1). Ask the broadest framing question first, narrowing constraints next, formatting last. The first question sets the subspace within which all later questions operate.
- **Preserve superposition where the cost of asking is low and the cost of being wrong is high** (§4.1). For architectural-level choices (shape, audience, tool), preserve. For tactical choices (filename, capitalization), default and move on.

Question banks per shape are in `templates/interview-branches.md`. Two questions are universal across all shapes:

1. **Tool / runtime.** "Where will this prompt run? (Claude Code, Gemini CLI, OpenAI API, generic LLM, other?)" Influences memory file naming and tool-specific affordances.
2. **Done definition / success criterion.** "How will you know the prompt worked? Be checkable, not vibe-based." Provides the rubric for self-evaluation in Phase 5.

End the interview with a **summary collapse**: state the shape you inferred, the key constraints you've gathered, and the defaults you're assigning to anything unspecified. Give the user one chance to override before drafting. This is the deliberate measurement step (§1.2) — make it explicit so the user can object to the collapse.

### Phase 3 — Operator-design drafting

Drafting is operator design (§5.3), not section-filling. For each section you include:

1. **Identify the basis states** the section transforms — what interpretations should be amplified, suppressed, or mixed?
2. **Choose strength** — strong operators (persona, hard constraints) project aggressively; weak operators (style preferences, formatting) commute with most others. **Calibrate default strength to the substrate tier (Principle 9):** on the frontier tier, prefer brief general instructions over enumeration and reserve intensity language ("CRITICAL", "MUST", repeated prohibitions) for constraints with demonstrated failure modes; on legacy tiers, stronger projection is often warranted. Capability lockdown for destructive-capability roles stays layered and loud on every tier — its justification is risk, not substrate weakness.
3. **Place in the operator sequence** per §5.1: broadest framing first, narrowing next, format last.
4. **Check for interference** with adjacent sections (§5.4) — does the combination produce emergent behavior, intended or otherwise?

Use `templates/shape-catalog.md` for shape-specific spines. Use `operators/` for the per-section operator descriptions (what each section amplifies, suppresses, mixes; its strength; its commutation properties). For tasks that don't warrant full shape selection (small, well-defined, single-purpose), `templates/minimum-viable-prompt.yaml` is the fallback scaffold — six slots (system / instructions / examples / constraints / state / query) and nothing more.

For reasoning-heavy tasks where structured decomposition outperforms monolithic chain-of-thought, consult `references/reasoning-patterns.md` — it documents the cognitive-tools sub-pattern (IBM Zurich, +16.6% on AIME2024) and when to invoke it inside the chosen shape.

When the prompt's output will be consumed by another LLM agent rather than displayed to a human (most common in Shape 4 sub-agent / tool prompts and Shape 6 LLM-as-judge), consult `references/agent-consumability.md`. Output design changes when the consumer is an agent: greppable failure markers, aggregate-first structure, compact stdout with verbose logs, deterministic-but-different sampling, and visible state transitions.

For Shape 7 (agent team), the topology choice is foundational and must precede per-role drafting. Consult `references/agent-team-topologies.md` for the four canonical topologies (orchestrator-workers, parallelization-sectioning, parallelization-voting, evaluator-optimizer) with their operator profiles, role definitions, and common failure modes. Pick the topology first, then draft each role's prompt using its individual shape's spine, then audit cross-role coherence.

Universal drafting rules apply to all shapes:

- **Right altitude.** Specific enough to act on, flexible enough for the model to adapt. Brittle hardcoding and vague hand-waving are dual failure modes.
- **Smallest viable token set.** Strike anything not addressing a specific failure mode or enabling a concrete behavior. Each token costs attention.
- **Examples over rules.** When a rule is load-bearing, write a worked example. Examples are load-bearing operators that anchor abstract instructions. **But examples have their own ambiguity surface** — any silent judgment call inside an example becomes a rule the model reverse-engineers. Before shipping any example, ask: what does this example silently teach beyond what I intended? If unsure, replace it with a cleaner case.
- **Section ordering by operator strength.** Strongest operators first.
- **Failure modes as DO NOTs.** Each addresses a specific known sharp edge with concrete consequence. Generic warnings waste tokens.

### Phase 4 — Audit (structural and quantum)

Run the audit checklist in `references/audit-checklist.md`. The checklist combines classical context-engineering checks (right altitude, smallest token set, examples present, durability of long-horizon support) with quantum-semantic checks:

- **Operator catalog complete.** Each section has a clear amplify/suppress/mix profile. No section is "decoration."
- **Ordering optimized.** Strongest operators first. Test by mentally swapping adjacent sections and asking "does this change behavior?" If yes, you've correctly identified non-commuting pairs.
- **Interference checked.** When two sections are likely to interact (e.g., persona + tone + format), confirm the combination produces the intended emergent behavior, not unwanted cancellation.
- **Information preservation.** Important context is loaded as early as possible (it survives more projections). Things that should remain ambiguous are flagged as such, not pre-collapsed.
- **Measurement-aware.** If the prompt will be sampled at temperature > 0, it should be robust to distribution sampling, not just mode collapse. If at temperature = 0, the strongest operators determine the output disproportionately.

Fix failures and re-audit. Don't ship with known structural defects.

### Phase 5 — Honest self-evaluation

Score the draft on three axes (rubric in `references/evaluation-rubric.md`):

- **Token economy** (1–10): tokens spent buy behaviors that matter.
- **Task fit** (1–10): covers what the user actually needs delivered.
- **Operator coherence** (1–10): sections work as a coordinated transformation, not just a collection.

Be honest. Sycophantic self-evaluation costs the user downstream. If a score is below 6, name the gap and offer a fix before declaring done. If you've revised many times, your perception is biased upward by sunk cost — adjust against that bias deliberately.

**Scaffold restraint (audit check M5).** As part of evaluation, list every optional scaffold in the draft (cognitive tools, dynamic/cross-run verifiers, clarification-seeking, decision enumeration, etc.) with the one-line trigger that justified it — a named hard-reasoning signal, a cited interview answer, a stated stake. The test for each: would a production prompt engineer hand-writing this prompt include it for this specific task, or is it here because the framework had it on the shelf? Strike anything without a traceable trigger. Ship the scaffold-to-trigger list in the delivery's audit summary so the user sees what they're paying for and why.

### Phase 6 — Deliver

Present the following artifacts:

1. **The prompt** (or prompts, if shape requires multiples — e.g., agentic loops produce a seed brief plus a memory file; agent teams produce per-role prompts plus a coordination doc).
2. **A short usage instruction** tailored to the user's tool. For agentic CLIs, name the memory file (CLAUDE.md / GEMINI.md / AGENT.md) and where to paste the seed brief. For one-shot prompts, indicate whether to use as system or user message, plus guidance for **the runtime's reasoning-control parameters** — whichever of temperature, effort/reasoning-depth settings, or thinking modes the runtime actually exposes, since these are the measurement parameters of Principle 6. Per-runtime footnote: current Anthropic API models use adaptive thinking controlled by an effort setting; manual extended-thinking token budgets are deprecated there and return errors — recommend an effort level, not a thinking budget. For LLM-as-judge prompts, indicate calibration/few-shot needs.
3. **The audit + evaluation summary.** The user should know what they're getting, what its weak points are, and what to watch for in the first run.
4. **The verifier specification** (per-shape, from `references/verifier-specification.md`). Documentation of what to check across the three layers (static, single-run dynamic, cross-run dynamic).
5. **Static-mode verifier prompt** — auto-generated runnable Shape 6 prompt that audits the user's prompt artifact. Always shipped.
6. **Dynamic-mode verifier prompt** — templated Shape 6 prompt with calibration anchor slots for the user to fill in. Ship when stakes warrant (production use, high-volume, consequential outputs).
7. **Cross-run verifier prompt** — templated Shape 6 prompt for distributional analysis. Ship only on explicit request, since it's specifically for production-scale verification.
8. **Cognitive-tool definitions (when the scaffold was triggered).** When hard-reasoning signals during Phase 1 caused the cognitive-tools scaffold to be included in the draft, the four tool definitions (`understand_question`, `recall_related`, `examine_answer`, `backtracking`) must be shipped as a runnable artifact, not just referenced. Without this, the model gets the framing benefit of cognitive tools (knowing it should think modularly) but loses the modularity benefit (each tool runs in a sandboxed context with isolated inputs). The four tool definitions are what produces the published empirical result; they are not optional context.

   The tool definitions ship in the format matching the user's named runtime — Anthropic API uses the `tools` array with `input_schema` blocks, OpenAI API uses `tools` with `function` definitions, other runtimes have their own conventions. See `references/reasoning-patterns.md` for the verbatim per-tool system prompts and the runtime-specific tool definition formats.

   The accompanying usage instruction must tell the user how to wire the definitions: "Register these four tool definitions with your runtime's tool-calling interface. Each tool's `description` is the role prompt the runtime passes to the tool's LLM call. The main prompt's system message references them by name." Without this wiring guidance, the user gets four prompts they don't know how to use.

For agent teams (Shape 7), the verifier set expands: per-role verifier-agents plus a cross-role contract verifier. See `references/verifier-agent-patterns.md` for the construction pattern.

**Eat your own dogfood.** Before shipping, run the static-mode verifier on the framework's own draft. If it detects blocking issues, do not deliver — report the issues to the user and offer revision. **This includes audit check M4 (cognitive-tools delivery completeness): if the cognitive-tools scaffold was triggered, the four tool definitions must be present in the delivered artifact, not merely referenced in prose. A prompt that mentions the cognitive-tools pattern without shipping the runnable tool definitions is an incomplete delivery and must not ship.** The framework produces verifier-agents using its own Shape 6 machinery, which means it knows how to evaluate Shape 6 prompts. Refusing to ship a flawed artifact is what a serious framework does.

Optional extension for high-stakes prompts: offer a **permutation test** (Prompt L from the quantum library, in `references/quantum-principles.md`) — run the prompt with two different orderings of key sections to measure non-commutativity empirically. Worth it when ordering choice is uncertain and stakes are high.

## Meta-principles (apply throughout)

- **The framework is itself an operator.** Every revision is evaluated for what it adds against what it costs in attention budget. Adding a section is not free.
- **Disagree with the user when warranted.** Sycophantic compliance produces worse prompts. If a request will produce a worse prompt, evaluate honestly and push back.
- **Examples are load-bearing.** When in doubt, write the example before the rule.
- **Right altitude is recursive.** It applies to drafted prompts, to interview questions, to this skill's own instructions. Brittle hardcoding and vague hand-waving fail at every scale.
- **Stop at "good enough to test."** Further refinement is theoretical past a point; the next signal comes from running the prompt against a real task.
- **Context creates meaning.** You are not figuring out what the user wants. You are constructing it through your choice of operators.
