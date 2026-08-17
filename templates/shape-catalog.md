# Shape catalog

A "shape" is the structural archetype of the prompt. Each shape has a different anatomy, different sections that apply, different evaluation criteria. The framework supports seven shapes; most prompts fit cleanly into one, some are hybrids.

Shape inference is Bayesian (§2.4): from the user's request, build a posterior over shapes and pick the dominant one if it's clearly ahead. Disambiguate only if two shapes are within ~30%.

## Shape 1: Agentic loop (long-horizon)

**Signal patterns:** "Help me start a project," "I'm building [system]," "Set me up for [multi-day work]," explicit mention of Claude Code / Gemini CLI for a non-trivial task, mentions of "session," "checkpoint," "memory."

**What it produces:** Two paired artifacts.
1. A **seed brief** — opening message for the agentic CLI.
2. A **memory file** (CLAUDE.md / GEMINI.md / AGENT.md) with two halves: standing rules + project state.

**Spine sections:**
1. Role binding
2. Project context
3. Loop description (human-in-the-loop, suggested-next-message contract)
4. Stack / materials
5. What to build
6. Initial contracts (revisable)
7. Procedure as checkpoints (order the plan by decision volatility: lead with the decisions the user is most likely to revise — data models, interfaces, UX flows — and bury mechanical, low-uncertainty work; volatile decisions surface early where review is cheap)
8. Working memory (memory file structure, re-read trigger)
9. Loading context as you go (just-in-time retrieval, sub-agents)
10. Style rules (drop if generic)
11. Failure modes
12. How to talk to me
13. Suggested-next-message contract (routine vs boundary modes)
14. Worked example (one per mode)
15. Done definition
16. Start here
17. Long-horizon operators, when the run warrants them (see `operators/section-operators.md` §Long-horizon operators): progress-claim grounding with the status contract; checkpoint policy + anti-early-stopping as one pause contract; memory-file conventions + deviations log in the memory specification; send-to-user pattern only if the harness defines the tool; lead-with-outcome on the final human-facing summary; persistence / capability-prior correction only on open-ended discovery runs with strong verification. Each must trace to a real long-run trigger (M5) — a short loop gets none of them.

**Trigger and stop taxonomy.** A loop is defined as much by what starts and stops it as by what it does. Establish both during the interview and encode them explicitly; each row changes the seed brief's contract sections:

| Loop type | Trigger | Stop condition | Design consequences |
|---|---|---|---|
| Turn-based | A user message | Agent judges the turn's work done, or needs input | The default Shape 1 contract (checkpoints, suggested-next-message). Specific prompts and self-verification reduce iterations |
| Goal-based | A stated goal | **Deterministic success condition + iteration cap** | The done definition must be checkable, quantitative where possible ("all tests pass," "score ≥ threshold"), never "improve X"; the cap ("stop after N attempts") bounds the run when the goal isn't reached |
| Scheduled | A time interval | User cancels, or the run's work completes | Match the interval to how often the watched input actually changes — polling faster than the input moves burns budget on nothing. Each firing needs a standalone-complete prompt (no conversation to lean on) |
| Proactive / event-driven | An external event or standing routine | Per-task goal conditions; the routine runs until disabled | Composes the other rows: a schedule checks for new inputs, a goal condition defines per-item completion, verification is encoded as checks the agent runs itself |

Two cross-cutting rules from the same source guidance: encode verification as *quantitative checks the agent can execute* (run the tests, measure the score, screenshot and inspect) rather than qualitative self-assessment — "never report changes complete based on edit success alone"; and use scripts for deterministic sub-work instead of having the agent re-reason through mechanical steps each iteration — reasoning tokens are for the parts that need judgment.

**Operator profile.** Role and project context are strongest operators (set the subspace). Procedure and contracts are mid-strength (define the projection sequence). Style and formatting are weak (commute with most content).

**Failure mode unique to this shape:** Loop ceremony tax — full structural ritual on every turn, regardless of stakes. Mitigated by the routine/boundary tier in the suggested-next-message contract.

## Shape 2: One-shot complex task

**Signal patterns:** "Write a prompt that classifies / extracts / summarizes / transforms [X]," request for a single deliverable from a single LLM call, no mention of multi-turn.

**What it produces:** A single prompt (system + user message structure, or one combined block).

**Spine sections:**
1. Role binding (often optional — context can replace it for narrow tasks)
2. Task definition
3. Input format
4. Output format (often the most important section — schema, examples)
5. Constraints / rules
6. Edge case handling (only for cases that genuinely occur)
7. Few-shot examples (load-bearing for non-trivial tasks)
8. Anti-examples (when failure modes are subtle)
9. **Cognitive tools scaffold (when hard-reasoning signals are present)** — see "Hard-reasoning detection" below.

**Operator profile.** Output format is dominant — it shapes everything the model produces. Few-shot examples are second; they encode behavior more reliably than rules. Role binding is often weak for one-shot tasks; let the task speak for itself.

**Hard-reasoning detection.** During shape inference, detect signals that the task is reasoning-heavy and bias the draft toward including the cognitive-tools scaffold (per `references/reasoning-patterns.md`) as a structural default rather than an optional extension. Hard-reasoning signals include:

- **Mathematical or logical tasks** — "solve," "prove," "compute," "derive," equations or constraints in the input.
- **Multi-step planning** — "plan," "design," tasks requiring consideration of dependencies or trade-offs across multiple decisions.
- **Code analysis or debugging** — "find the bug," "explain why this fails," tasks where the answer space has dead ends.
- **Multi-constraint *satisfaction* problems** — tasks where the constraints define a search space the model must reason *through* to find a solution (scheduling under competing constraints, design under trade-offs, optimization). This is a hard-reasoning signal. **Distinguish from multi-constraint *compliance* tasks** — where many constraints exist but the solution is already specified and the work is to satisfy a checklist (reproduce this spec honoring these 8 rules, transcribe this with these requirements). Compliance tasks are NOT a hard-reasoning signal; the constraints are a checklist, not a search space, and cognitive tools add ceremony without benefit. The test: does the model have to *discover* how to satisfy the constraints (satisfaction → cognitive tools help), or just *check* that it did (compliance → skip them)?
- **User-named symptom: "the model often gets it wrong on first try"** — direct evidence that single-pass reasoning is insufficient.
- **Verification is easier than production** — tasks where the user can check an answer faster than they can produce one (e.g., does this proof go through, does this code pass the tests).

When two or more hard-reasoning signals are present and the runtime supports tool calling, include the cognitive-tools scaffold in the draft by default **on legacy and strong substrate tiers** — the tiers the published empirical evidence covers (large gains on the 2024–2025-era model families tested, e.g. 26.7% → 43.3% on AIME2024 for one of them). On the **frontier tier**, the scaffold is an M5-triggered option instead: general instructions often outperform prescriptive decomposition there, so include it only on demonstrated first-try failure or explicit request (see `references/reasoning-patterns.md` §tier gating). For hard-reasoning Shape 2 work on the covered tiers, the scaffold pays back the tokens it costs.

**Critical: the cognitive-tools scaffold means shipping the four tool definitions as part of the delivery, not just referencing the pattern.** The main prompt's system message defines how the model should use the tools (the verbatim system prompt from `references/reasoning-patterns.md`), and four separate tool definitions (`understand_question`, `recall_related`, `examine_answer`, `backtracking`) ship as artifacts the user registers with their runtime's tool-calling interface. Each tool definition includes the per-tool system prompt as its description. Without shipping the four tool definitions, the user gets cognitive-style framing but not cognitive *tools* — the modularity benefit (which is the empirical advantage over monolithic cognitive prompting) requires actual tool registration. See Phase 6 delivery for the artifact format per runtime.

If hard-reasoning signals are absent (extraction, classification, summarization, transformation tasks), skip cognitive tools — the overhead exceeds the benefit. The framework should not default to including the scaffold for every Shape 2 prompt; that would be over-engineering.

**Failure mode unique to this shape:** Edge case bloat. Engineers list every imagined failure case, producing brittle prompts. Cure: include only failure modes you've actually seen or can predict with confidence.

**Delivery-time guidance.** When the output is structured (JSON, XML, or another machine-parseable format), the default path is an **explicit format operator**: state the format positively ("Output only valid JSON with no preamble. Begin your response with `{`"), optionally use an XML format indicator ("write the result in a `<result>` tag"), and match the prompt's own formatting style to the desired output style — the prompt's form is itself a weak operator on output form. **Prefilling the assistant's response** (starting the last assistant turn with `{`) is a legacy-path technique: recommend it only when Phase 1 established that the runtime still supports last-turn prefill. On runtimes that have dropped it, a prefilled final assistant turn is rejected with an error, and the substrate's instruction-following makes the explicit-instruction path sufficient. Condition the delivery guidance on the runtime; never ship prefill advice unconditionally. Per-runtime footnote: current Anthropic API model generations reject last-assistant-turn prefills; older generations still accept them.

## Shape 3: Workflow / chain

**Signal patterns:** "I need a chain of prompts that [generate → check → refine]," explicit mention of multiple LLM calls coordinated, prompt chaining, gates, validators.

**What it produces:** Multiple prompts (one per stage), plus a coordination description.

**Spine for each stage:**
- Role binding
- Stage's specific input (from previous stage's output)
- Stage's specific transformation
- Output format (often must be parseable by the next stage)
- Pass/fail criteria (for gates between stages)

**Spine for the workflow doc:**
- Stage list with one-line purpose each
- Data flow between stages
- Failure handling (retry, fallback, abort)

**Operator profile.** Each stage's prompt is itself a complete operator. The coordination is a sequence of measurements. §5.6 applies acutely: information lost at stage 1 cannot be recovered at stage 5. Design accordingly — preserve as much as possible early.

**Failure mode unique to this shape:** Stage coupling via implicit output formats. Stage 2 assumes a format stage 1 doesn't guarantee. Cure: output schemas at every stage, validated.

## Shape 4: Sub-agent / tool prompt

**Signal patterns:** "I'm building a sub-agent that [X]," "How should I describe this tool to my agent," "Write a tool docstring," prompts that exist *inside* a larger system rather than facing a user.

**What it produces:** A focused prompt or docstring intended to be consumed by another LLM (or by an agent's tool-use mechanism).

**Spine sections:**
1. Single-line purpose (this is the most-attended part of any tool description)
2. When to use this tool (and when NOT to)
3. Input parameters (with types, examples, edge cases)
4. Output format (with examples)
5. Side effects (if any)
6. Error modes

**Operator profile.** Purpose-line is dominant — it's what the parent agent reads first when deciding to use the tool. Parameter descriptions are second. Anything beyond is supporting detail.

**Interface design as operator.** The parameter space itself teaches usage: an expressive parameter name and a typed enumeration (`status: [pending, in_progress, completed]`) are operators that constrain how the parent agent uses the tool, at near-zero token cost and without the ambiguity surface examples carry (audit §C — every example teaches its silent judgment calls). On frontier-tier substrates, prefer designing the interface — names, types, enums, required-vs-optional — over adding usage examples; add examples only where the interface genuinely can't express the convention. On legacy tiers, examples retain more of their value.

**Failure mode unique to this shape:** Bloated tool descriptions that overlap with other tools, creating ambiguity about which to call. Cure: minimal viable description focused on the tool's unique role.

## Shape 5: System persona / assistant prompt

**Signal patterns:** "I'm building an assistant that [X]," "Write a system prompt for [persona]," "Custom GPT for [purpose]," ongoing conversational use, persona stability matters.

**What it produces:** A system prompt designed to shape behavior across unknowable future inputs.

**Spine sections:**
1. Identity / persona (who the assistant is)
2. Domain and competence boundaries
3. Tone / register / voice
4. Behavior rules (what to always do, never do)
5. Format defaults (when not overridden by user)
6. Escalation / refusal patterns
7. Few-shot examples of ideal interactions

**Operator profile.** Identity is dominant — it sets the subspace for all interactions. Behavior rules are mid-strength. Format defaults are weak (commute with content).

**Failure mode unique to this shape:** Persona collapse under user pressure. Without explicit refusal patterns and identity reinforcement, persona drifts over long conversations. Cure: explicit "if asked to deviate from X, do Y" rules, plus periodic identity refresh patterns.

**Second failure mode for category-based personas.** When the persona uses category labels to shape behavior (e.g., "strict on security, lenient on style, ask before refactors"), the model has to classify each input into a category before applying the corresponding threshold. Two ambiguities follow: (a) what counts as the boundary of each category — when is something "major" enough to ask first? — and (b) which category wins when an input genuinely spans two (a security issue that requires a major refactor)? Address both explicitly: define the threshold concretely ("a change is major if it requires the author to think, not just apply your suggestion") and state precedence rules for collisions ("strict wins; flag the security issue, then the refactor scope is a separate question for the author"). Without this, the model picks idiosyncratically and the persona feels inconsistent.

**Third failure mode for personas with destructive capability.** When a persona has access to write actions, shell access, financial actions, or anything irreversible, structural restrictions alone are insufficient — the model must be told explicitly what it cannot do, and told repeatedly. Production agent systems use a layered lockdown pattern:

1. **Structural restriction first.** If the runtime supports it (tool whitelists, `disallowedTools`), use it. Block at the infrastructure layer what shouldn't be possible at the prompt layer.
2. **Prose reinforcement.** Even with structural restrictions, the prompt must reinforce them — high-attention banner at the top, repeated prohibitions, explicit handling of loophole tools (shell redirection, network calls, etc.) that could subvert the structural restriction. A "read-only" persona with shell access can still write files via `echo "x" > file.txt` unless the prose explicitly forbids it.
3. **Forceful negative phrasing.** "You cannot and must not" is louder than "please don't." Repetition matters; the same prohibition at the start and end of the prompt outperforms a single mid-prompt mention.
4. **Explanation, not just rule.** Tell the persona *why* — "you cannot modify files because another agent is responsible for that and concurrent modification will corrupt the work." The model applies rules with reasons more reliably than rules without.

(Source: Claude Code's Explore agent READ-ONLY MODE banner, BashTool's repeated security prohibitions.)

## Shape 6: LLM-as-judge / grader prompt

**Signal patterns:** "Build a prompt that scores [X]," "LLM-as-judge for [Y]," "Grader prompt," "Evaluation rubric for [Z]," explicit mention of scoring or rubrics.

**What it produces:** A prompt that takes one or more candidate outputs and produces a judgment (score, ranking, or qualitative evaluation).

**Spine sections:**
1. Role binding (often "you are an expert [domain] grader")
2. What is being judged (the artifact type)
3. Rubric (specific criteria, weights, thresholds)
4. Calibration examples (anchored examples at each score level)
5. Output format (structured, parseable)
6. Bias controls (length bias, position bias, persona effects)

**Operator profile.** Rubric is dominant — it defines the projection. Calibration examples are second; they anchor the rubric concretely. Bias controls are subtle but high-leverage operators.

**Failure mode unique to this shape:** Rubric vagueness leading to mode collapse on a few common scores (everything gets a 7). Cure: explicit per-score-level descriptions with calibration examples; force qualitative reasoning before the score, not after.

**Delivery-time guidance.** Like Shape 2, structured judge output needs format enforcement — and the reasoning-before-scoring ordering needs structural support. The default path: specify the output schema with the reasoning field first, instruct "Begin your response with `{`. Output only the JSON, no preamble", and rely on the schema's field order plus the rubric's explicit reasoning-first rule. **Prefilling** the opening of the JSON object (e.g., `{\n  "reasoning":`) is the legacy path — it structurally guarantees reasoning-before-scoring, but only recommend it when Phase 1 established the runtime still supports last-turn prefill; on runtimes that have dropped it, prefilled final turns are rejected with an error. Same per-runtime footnote as Shape 2.

## Shape 7: Agent team (multi-agent system)

**Signal patterns:** "I'm building an agent team," "I need an orchestrator and workers," "Multi-agent system," explicit mention of multiple coordinated LLM roles, mentions of delegation / dispatch / specialist agents, descriptions involving multiple specialized roles (planner, reviewer, executor, critic, etc.).

**What it produces:** A coordinated *set* of prompts plus a coordination contract. Unlike the other six shapes which produce one artifact (or one artifact + one memory file), Shape 7 produces:
- One **orchestrator prompt** (or generator prompt for evaluator-optimizer topologies)
- One or more **worker / specialist prompts**
- Optionally a **synthesizer or evaluator prompt**
- A **coordination doc** specifying interface contracts between roles, capability boundaries per role, and failure-handling policies

**Spine sections:**

1. **Topology selection.** Which of the five canonical topologies (orchestrator-workers, parallelization-sectioning, parallelization-voting, evaluator-optimizer, swarm/shared-forum) or hybrid combination fits the task. See `references/agent-team-topologies.md` for the full catalog.
2. **Role roster.** For each role: name, scope (what it does and doesn't do), capability boundaries (what tools/actions it has access to), and which existing shape (1–6) its individual prompt will use. The orchestrator is usually a system persona (Shape 5); workers are usually sub-agent / tool prompts (Shape 4); evaluators are usually LLM-as-judge (Shape 6).
3. **Interface contracts.** What the orchestrator passes to each worker (input schema), what each worker returns (output schema). These contracts are load-bearing — when broken, the system fails silently. Use the agent-consumability principles for output design (`references/agent-consumability.md`): structured output, greppable failure markers, explicit state transitions.
4. **Capability lockdown per role.** For each role with destructive capability (write access, shell access, financial actions, anything irreversible), apply the layered lockdown pattern from Shape 5 — structural restrictions plus prose reinforcement, with attention to loophole tools (shell redirection can write files even in "read-only" roles). See Shape 5's third failure mode for the full pattern.
5. **Coordination pattern.** How state flows between agents. Where shared state lives (filesystem? memory file? message bus?). How conflicts resolve when multiple agents touch the same resource. What the synthesizer/aggregator does if some workers fail or time out.
6. **Per-role prompts.** Each role's individual prompt, drafted using its own shape's spine. The agent-team shape isn't replacing those shapes — it's adding a coordination layer above them.
7. **Cross-role audit.** A check that interface contracts align (worker output schemas match what orchestrator expects), scopes don't overlap destructively, and the topology actually produces the desired behavior.

**Operator profile.** The topology choice is the dominant operator at the team level — it sets the structural subspace the entire system operates in, just as identity sets it for a system persona. The orchestrator's prompt is the second-strongest operator; it defines how work is decomposed and synthesized. Worker prompts are mid-strength but high-leverage; their scope-lockdown determines whether the team behaves coherently or chaotically.

**Failure modes unique to this shape:**

*Synthesis collapse.* Workers return rich output; the orchestrator (or synthesizer) reduces it to a generic summary, losing the specificity that justified the multi-agent decomposition. Cure: orchestrator's prompt must specify what synthesis means (combine, prioritize, contradict-resolve), not just "summarize the worker outputs."

*Scope leakage.* Workers expand beyond their assigned scope, producing output that overlaps or contradicts other workers. The team's value comes from focused attention; without strict scope-lockdown per worker, the topology degenerates. Cure: per-worker prompts include explicit "you do not work on X, that's another agent's responsibility" language.

*Stale delegation (the "never delegate understanding" failure).* The orchestrator dispatches workers with vague prompts ("based on your findings, fix this") instead of specific context (file paths, line numbers, the exact change to make). The worker has no way to synthesize from nothing and produces shallow output. Cure: the orchestrator's prompt must require it to include specific context in every worker dispatch — the parent agent has to do the synthesis itself before delegating, not push it onto the child. (Source: Anthropic's Claude Code AgentTool prompt, "Never delegate understanding.")

*Interface drift.* Worker output formats drift from what the orchestrator expects, breaking the parsing layer silently. Output looks reasonable in isolation but the orchestrator can't act on it. Cure: every worker prompt specifies its output format with the rigor of a tool description (typed schema, examples, what the orchestrator will do with each field).

*Capability lockdown failure.* A "read-only" worker uses shell redirection or another loophole to write files. Cure: layered lockdown (structural + prose), explicit handling of loophole tools, repeated prohibitions at top and bottom of the worker's prompt.

*Empirically documented multi-agent failure modes* — conformity collapse under identical contexts, hidden-profile information loss, missing epistemic vigilance, convergence-driven collusion, and turf wars between mutually unaware co-tenants — are catalogued with cures in `references/agent-team-topologies.md` §Empirical failure modes, and audited via the agent-team checks in `references/audit-checklist.md` §N.

## Hybrid shapes

Some requests are genuinely hybrid: an agentic loop whose individual checkpoints use one-shot extraction prompts, a workflow whose final stage is an LLM-as-judge gate. Handle as follows:

1. Identify the **outer shape** (the structure that contains everything else).
2. Note the **inner shapes** as components.
3. Draft the outer shape's spine first, then draft each inner shape per its own spine, then knit together.

Hybrids increase the risk of interference effects (§5.4) — emergent behavior from combining shapes. Audit accordingly.

## Domain axis (orthogonal to shape)

Domain modifies *content* of sections, not which sections appear. The same shape adapts:

- **Engineering**: stack details concrete, contracts revisable, failure modes specific to tooling.
- **Research**: source quality rules, citation conventions, methodology constraints.
- **Writing**: voice / register / audience, exemplars, length anchors.
- **Ops**: explicit safety boundaries, audit trails, rollback for irreversible actions.
- **Generic**: minimal content; lets the user fill in.

Shape × domain produces 30 combinations. The framework handles all of them with the same procedure; the spine flexes per shape, and content flexes per domain.
