# Audit checklist

Run the drafted prompt through this checklist before declaring done. Combines classical context-engineering checks with quantum-semantic checks. Fix any failure; re-audit; only ship clean.

The checklist is structural and behavioral, not stylistic.

**Trust difference between modes.** When auditing a from-scratch draft (the framework's own output), assume the framework's intent — every section was added deliberately and can be evaluated against the user's stated requirements. When auditing a user-supplied prompt in refactor mode (`references/refactor-mode.md`), the framework doesn't know which sections are deliberate vs. accidental, which constraints reflect external requirements vs. preferences, or which apparent weaknesses are actually load-bearing for reasons the framework can't see. Run the same checks, but treat findings as *candidates for the user's review* rather than blocking issues. The user knows things about their prompt the framework doesn't.

## A. Right altitude (every directive)

For every directive in the prompt, classify:

- **Too brittle.** Hardcoded if-else logic, exhaustive edge case enumeration, scripts the model must follow exactly. Failure: model gets stuck when reality differs.
- **Too vague.** Abstract goals without concrete signals. Failure: model picks something obvious that misses the intent.
- **Right altitude.** Specific enough to act on, flexible enough to adapt. Most directives should be here.

Move every too-brittle and too-vague directive toward right altitude. If you can't, ask the user for the missing context.

**The delegation ladder.** Altitude is chosen per directive, and vendor guidance names three usable rungs: delegate the *approach* (state the material and the outcome; the model selects methodology), delegate the *procedure* (reference an established procedure or skill; the model chooses sequencing and timing), delegate the *timing* (describe the recurring outcome; the model schedules the work). Pick the rung deliberately for each directive rather than defaulting to maximum specification; on frontier-tier substrates, default one rung higher than you would on legacy tiers (Principle 9). Context beats constraint at every rung: who the work is for, when it's needed, and what it accomplishes lets the model decide well in situations the directive's author didn't anticipate — a rule list alone only tells it what not to do.

## B. Smallest viable token set

For every section, ask: what specific failure mode does this address, or what specific behavior does this enable? If the answer is unclear, strike the section.

Common waste:
- Preemptive edge cases (you imagined them; no evidence they occur)
- Generic warnings the model already follows by default
- Stylistic preferences nobody will check
- Redundancy with other sections
- **Redundancy across context layers.** The prompt is one layer of a context assembly (system prompt, tool descriptions, memory files, skills, references). Guidance duplicated across layers is waste with a failure mode attached: the copies drift, and the model receives conflicting versions. Say each thing once, in the layer that owns it — tool-usage guidance in the tool's description, repo gotchas in the memory file, procedure detail in the skill — and let the other layers point rather than repeat.
- **Everything-upfront loading where progressive disclosure is available.** When the runtime supports selectively loaded context (skills, referenced files, deferred tool definitions, @-mentioned documents), detail that is only sometimes needed should live in a separately loaded artifact the model pulls on demand, not in the always-loaded prompt. The smallest-viable-token-set rule applies *at each moment*, not just to the artifact's total size: a lightweight always-on core naming where the detail lives outperforms a monolith. (Mechanistic support: the model's reasoning routes through a limited-capacity workspace — see Principle 5's note — so always-loaded bloat competes with the task for a scarce resource. Empirical support: a vendor removed the large majority of a production agent's system prompt for its frontier-tier models with no measured regression.)

## C. Examples present where rules are load-bearing

For every abstract rule that's central to the prompt's behavior, verify a concrete worked example exists. Examples teach behavior more reliably than abstract rules.

Especially check:
- Output format → at least one full example
- Few-shot prompts → 2–5 representative examples covering the difficulty range
- Loop-based prompts → worked example per mode (routine, boundary)
- LLM-as-judge → calibration example per score level

### Examples are themselves operators — audit them as such

Every example-shaped element in the prompt acts on the model just like a section-level operator. It amplifies the patterns it demonstrates and suppresses divergent patterns. Whatever judgment calls live inside the example silently teach the model how to make those calls — including any unstated reasoning the example contains.

This applies to **all example-shaped material**, not just worked input/output pairs. Specifically:

- **Worked examples** (few-shot input/output pairs)
- **Calibration anchors** in LLM-as-judge rubrics (the 1/3/5 descriptions are mini-examples of what each score looks like)
- **Anti-examples** (demonstrate what to avoid)
- **Inline illustrations** in rule descriptions ("e.g., names the specific situation, like 'I can see this delay has thrown off your launch timeline'")
- **Schema field examples** ("`owner: 'Alice'` — verbatim from transcript")

Apply the same audit to each:

- **Edge cases inside the example.** Does it contain any judgment call that isn't explained? In an extraction prompt, did you silently decide *not* to populate an optional field — and could the model interpret that omission either way? In a calibration anchor, does the description name a quality the model can't reliably distinguish from its near-neighbors (e.g., "performative warmth" vs. "genuine warmth")?
- **Unstated reasoning.** If the example or anchor required reasoning to produce, the model has to reverse-engineer that reasoning. Either show the reasoning explicitly or pick a less ambiguous case.
- **Coverage of failure modes.** Each failure mode the user named during the interview should appear somewhere — in rules, examples, anchors, or anti-examples. Walk through each named failure mode and verify it's addressed.
- **Consistency across examples.** If two examples make different judgment calls on similar cases, the model will be confused about which pattern to follow. Pick one convention and apply it consistently across all example-shaped material.

If an example or anchor contains a silent judgment call that you can't or don't want to explain, replace it with a less ambiguous case. Examples and anchors that teach incorrect patterns are worse than none — the model trusts them.

## D. Operator catalog complete (quantum-semantic)

For every section, articulate (silently or in a comment):

- What does it amplify?
- What does it suppress?
- Does it mix basis states?
- Strength: strong, mid, weak?

If a section is "decoration" (no clear amplify/suppress/mix profile), strike it. If two sections have the same profile, merge them.

## E. Operator ordering optimized (§5.1)

Confirm sections are ordered:

1. Strongest operators first (identity, persona, domain — they set the subspace)
2. Mid-strength next (task definition, constraints, contracts)
3. Weak operators last (formatting, style, communication)
4. Failure modes near the end (high-attention end position)
5. Done definition / start instruction at the very end (terminal projection)

Mentally swap adjacent sections. If the swap produces meaningfully different behavior, the pair is non-commuting; the current order should be the deliberately better one.

**Why structure matters mechanistically.** Yang et al. (Princeton/ICML 2025, "Emergent Symbolic Mechanisms in LLMs") show that LLMs develop a three-stage attention-head circuit — symbol abstraction in early layers, symbolic induction in middle layers, retrieval in late layers — that exploits structured input. Markdown headers, named sections, and consistent ordering aren't aesthetic choices; they align with circuits the model actually uses. Random or arbitrary ordering forces the model to do extra work to recover the structure.

## F. Interference check (§5.4)

For every pair of adjacent sections likely to interact (multiple personas, multiple tones, constraint stacks, persona + format), confirm the combination produces the intended emergent behavior, not unwanted cancellation or mode collapse.

Known interference pairs (from `operators/section-operators.md`):
- Multiple personas
- Persona + tone
- "Be concise" + "show reasoning"
- Refusal patterns + warm tone

If interference is unexamined, examine it. If destructive, restructure or merge sections.

## G. Information preservation (§5.6)

Confirm:
- Critical context is loaded as early as possible (it survives more projections).
- Things that should remain ambiguous are flagged as such (e.g., "two interpretations are plausible — we'll resolve at runtime") rather than pre-collapsed.
- For multi-stage prompts (workflows, agentic loops), output formats at each stage preserve information downstream stages need.

## H. Long-horizon support (loop shape only)

For agentic loops, confirm:
- Memory file is named (CLAUDE.md / GEMINI.md / AGENT.md per tool).
- Memory file structure is described: standing rules + project state.
- Re-read trigger is specified (start of every checkpoint + circuit breaker after N tool calls).
- Todo list usage is described (parent todos for checkpoints, sub-todos for steps).
- Tool-output disposal is addressed (summarize and discard, don't accumulate).

If any are missing, the prompt is not resistant to context rot.

## I. Loop completeness (loop shape only)

Trace through the loop. Each answer should be in the prompt or follow obviously:
- What does the agent do at the start of a turn?
- What survives compaction within a turn?
- What does the agent do when context fills mid-checkpoint?
- What does the agent do when a hard decision surfaces?
- What stops the loop?

Ambiguous answers indicate gaps.

**Stop conditions should be deterministic where the task allows.** "Improve performance" never terminates; "score ≥ the named threshold, stop after N attempts" does. For goal-seeking loops, confirm both halves are present: a checkable success condition (quantitative where possible — test counts, scores, validation passing) and an iteration cap that bounds the run when the goal isn't reached. A loop with a vague goal and no cap is the loop-shape version of the convergence failure documented for evaluator-optimizer topologies. For scheduled or event-triggered loops, also confirm the trigger cadence matches how often the watched input actually changes — a loop that polls faster than its input moves burns budget to rediscover that nothing happened (see the Shape 1 trigger/stop taxonomy in `templates/shape-catalog.md`).

## J. Tier the ceremony (loop shape only)

The suggested-next-message contract should have two modes:
- Routine continuation for mid-checkpoint turns.
- Boundary handoff for checkpoint boundaries and decision-resolved turns.

A picking-test should be present ("would I send this fresh tomorrow morning expecting it to steer the next iteration on its own?"). Without tiering, the loop taxes every turn equally.

## K. Self-similar handoffs / homoiconicity (loop shape only)

The seed brief should explicitly tell the agent to treat itself as the template for boundary-handoff messages. Phrasing along the lines of "treat this brief as the template — boundary-handoff messages share its spine at iteration scale."

Without this, handoffs are structurally inconsistent across the loop.

## L. Tool / runtime consistency

If the user named a tool, confirm:
- Memory file name matches (CLAUDE.md, GEMINI.md, etc.)
- Tool-specific features mentioned only if relevant
- Output filename instruction at delivery matches the tool

If "generic," use AGENT.md and note the user should rename per their tool.

## M. Measurement-aware (temperature considerations)

Confirm:
- If the prompt will run at temperature > 0, it's robust to distribution sampling, not just mode collapse.
- If temperature = 0 is recommended (production / single-shot extraction), the strongest operators do the work.
- For LLM-as-judge prompts, temperature recommendation matches use case (typically 0 for scoring).
- For ideation prompts, temperature recommendation matches use case (typically > 0).

If the prompt's behavior depends on temperature in an unexamined way, examine and document.

## M2. Verifier-readiness

The prompt should expose the hooks a verifier-agent needs to evaluate it. This is a soft check — not every prompt needs full verifier coverage — but for production prompts, verification readiness is part of fitness.

- **Output is parseable.** Structured output (JSON, schema-validated, or consistently structured prose) is verifiable; freeform output is not. If the prompt's output is freeform, the verifier-agent has to do extra work to extract verifiable claims.
- **Failure modes from the interview are addressable.** Each named failure mode can be checked by inspecting the output. If a user said "model invents owners on vague subjects," a verifier-agent can flag invented owners only if the prompt's output preserves enough structure to identify them.
- **Constraints are checkable.** Stated constraints in the prompt can be verified externally. "Be helpful" is unverifiable; "do not fabricate citations" can be verified by checking citation matches.
- **State transitions are visible.** For agent-team and agentic-loop shapes, state changes appear in output (per `agent-consumability.md`). A verifier can audit a trace; it can't audit silent state changes.

If the prompt is intended for production use and any of these are weak, flag during evaluation. The user can choose to ship anyway, but they should know verification will be expensive or unreliable.

## M3. Permission to abstain

For prompts that produce factual or judgmental output (extraction, classification, scoring, retrieval), the prompt should explicitly grant the model permission to abstain rather than guess when the input doesn't support a confident answer. This is the most cost-effective anti-hallucination technique available — it costs ~1 sentence and meaningfully reduces fabrication.

Most relevant for:
- **Shape 2 (one-shot)** when extracting facts, identifying entities, or making judgments about input data.
- **Shape 4 (sub-agent / tool)** when the tool reports findings or values — silent guessing corrupts the parent agent's downstream decisions.
- **Shape 6 (LLM-as-judge)** when the input doesn't contain enough information to score against the rubric. A judge that always produces a confident score on inadequate input is worse than a judge that flags inadequacy.

The permission needs to be explicit and concrete. "Be honest" is too vague to act on. Effective formulations:

- "If the data is insufficient to draw conclusions, say so rather than speculating."
- "If the input doesn't clearly contain [specific element], return null rather than guessing."
- "If you cannot confidently score this against the rubric, return 'inconclusive' with reasoning."

The framework's broader audit principle (the rubric is the optimization target) applies here in reverse: a prompt that *requires* an answer optimizes for confident answers, including wrong ones. Granting abstention permission shifts the optimization target toward calibrated honesty.

### Clarification-seeking context-appropriateness

Abstention is the floor and should be present whenever the prompt takes real-world input that can be ambiguous. Clarification-seeking is the upgrade and must match the deployment context the user stated:

- **If the prompt runs unattended** (pipeline, batch, called by another agent) → confirm it does NOT instruct the agent to ask a user. A clarifying question emitted into a non-interactive context is malformed output. Under doubt, the prompt must use abstention. FAIL if the prompt tells an unattended agent to "ask the user."
- **If the prompt is interactive AND the user requested clarification-seeking** → confirm the clarification operator is present, calibrated (asks on material forks, not on every uncertainty), and includes the bounded sufficiency self-check.
- **If the prompt is interactive but the user wanted best-call-and-flag** → confirm abstention governs and clarification-seeking is absent, even though a user is present.

When clarification-seeking is present, verify the **bounded sufficiency self-check** is included and complete:
- The agent assesses, after each user answer, whether the material fork is actually resolved.
- Resolution → proceed without redundant confirmation. Insufficiency → one targeted follow-up.
- A bound (~2 rounds) after which the agent falls back to abstention rather than interrogating.
- The abstention fallback is wired — if clarification exhausts, the agent flags and proceeds/declines, never stalls.

FAIL if clarification-seeking is present without the bound (produces interrogation) or without the abstention fallback (produces stalling).

Less relevant for:
- **Shape 5 (system persona)** — persona-level abstention is usually handled by refusal patterns, not abstention permission.
- **Shape 1 (agentic loop)** — the agent operates over many turns and has different mechanisms for handling uncertainty (raising open questions in handoffs).

## M4. Cognitive-tools delivery completeness (BLOCKING)

This is a blocking check: if it fails, the delivery is incomplete and must not ship.

If hard-reasoning signals triggered the cognitive-tools scaffold during Phase 1, confirm that the **four tool definitions are present in the delivered artifact**, not merely referenced. The most common framework failure mode is to mention the cognitive-tools pattern in the prompt's prose ("structure your reasoning using understand_question, recall_related...") without shipping the actual tool definitions the user registers with their runtime. That produces cognitive *framing* without cognitive *tools* — the weaker monolithic variant the empirical literature specifically found inferior.

Confirm all of:

- The four tool definitions (`understand_question`, `recall_related`, `examine_answer`, `backtracking`) are present in the delivery as a runnable artifact, formatted for the user's named runtime (Anthropic `tools` array, OpenAI `function` definitions, etc.). Source format in `references/reasoning-patterns.md`.
- Each tool definition carries its full per-tool system prompt as its description — not a one-line summary.
- The main prompt's system message includes the cognitive-tools orchestration prompt (the verbatim system prompt) that tells the model the tools exist and when to call them.
- The usage instruction tells the user how to wire the definitions into their runtime, including the common-failure-mode warning (registering tools without passing the per-tool system prompts to the tool execution).

If the scaffold was triggered but any of the above is missing, the delivery is incomplete. Either complete it (ship the definitions) or, if cognitive tools were triggered in error (the task is actually compliance/checklist, not hard-reasoning per the sharpened signals in `shape-catalog.md` and `reasoning-patterns.md`), remove the cognitive-tools framing entirely so the prompt doesn't reference tools it doesn't ship. A prompt that references the pattern without shipping the tools is the one outcome to never deliver.

## M5. Scaffold restraint (the Claude Code discipline)

The framework offers many optional scaffolds: cognitive tools, dynamic-mode and cross-run verifiers, clarification-seeking with the sufficiency self-check, prefill guidance, architectural-decision enumeration, trace structures. Each is individually justified by source evidence. **None of them is free**, and their cumulative weight is the framework's most likely failure mode: a prompt that carries every capability the framework had on the shelf rather than the smallest set the task demands.

Production prompt engineering (Claude Code's style guide) holds a harder line than "smallest viable token set" applied section-by-section: every scaffold exists because of a *specific, named* reason — a debugged failure, a stated user requirement, a measured risk. Apply that discipline to the framework's own outputs.

For **each optional scaffold present in the draft**, the audit must be able to name its trigger:

- **Cognitive tools** → which two-or-more hard-reasoning signals fired? Name them.
- **Dynamic-mode / cross-run verifiers** → did the user state production stakes / scale, or explicitly request them? Cite the interview answer.
- **Clarification-seeking + self-check** → did the user confirm an interactive deployment and request it? Cite the deployment-context answer.
- **Architectural-decision enumeration, trace structure, identity reinforcement, lockdown layers** → which stated risk or shape requirement demands it?

The test question for each: **"Would a Claude Code engineer hand-writing this prompt for this specific task include this scaffold — or is it here because the framework offers it?"** If the honest answer is the latter, strike the scaffold. A trigger of "it might help" or "it's best practice" is not a trigger; it's the preemptive-complexity failure mode with better branding.

Two directions, both checked:

- **No untriggered scaffolds.** Every optional scaffold traces to a named signal, a cited user answer, or a stakes statement. The audit summary lists each included scaffold with its one-line trigger, so the user can see what they're paying for and why.
- **No stripped essentials.** Restraint is not minimalism for its own sake. If the task genuinely fires the trigger (real hard-reasoning signals, stated production stakes, confirmed interactive deployment), the scaffold belongs — removing it to look lean is the opposite failure. The discipline is *trigger-traceability*, not smallness.

This check runs at Phase 5 evaluation time, and its output (the scaffold-to-trigger list) ships in the delivery's audit summary. A delivery whose scaffolds can't all be traced to triggers should be slimmed before shipping.

## M6. Reasoning-channel separation

Instructions that tell the model to **echo, transcribe, or reveal its internal reasoning as response text** ("show your thinking", "reproduce your chain of thought in the answer", "explain what you were thinking when...") are a defect. On some runtimes they trigger a refusal category and elevated fallbacks; on all runtimes they conflate two channels — the model's internal reasoning channel and its task-output channel — and the transcription is unreliable even when permitted. Reasoning visibility must target the runtime's sanctioned channel: structured thinking blocks, tool inputs (which arrive unsummarized), or a dedicated send-to-user tool for verbatim mid-run surfacing.

The distinction that keeps this check precise: **task-mandated justification is not reasoning transcription.** A judge prompt requiring a written `reasoning` field before the score, a reviewer required to argue its findings, an abstention that must state why — these ask the model to *produce* justification as deliberate task output, which is fine on every runtime. The defect is specifically instructing the model to *reveal or reproduce its internal thinking* as if the response were a window onto it.

Audit every draft (and, in refactor mode, every user prompt) for show-your-thinking instructions; replace them with either a task-mandated justification field or a pointer to the runtime's sanctioned reasoning channel. This check applies with extra force to Shape 1 seed briefs and Shape 5 personas, where "narrate your reasoning" instructions tend to accumulate.

## N. Branch-specific checks

**Engineering shapes.** Stack versions concrete; failure modes specific to the stack; contracts framed as revisable.

**Research shapes.** Source quality rules present; citation format specified; synthesis target concrete.

**Writing shapes.** Voice / register described concretely with at least one exemplar; outline initialized; length anchor present.

**Ops shapes.** Safety boundaries explicit; destructive actions require approval; audit trail requirements specified.

**LLM-as-judge.** Bias controls present (length, position, persona). Calibration anchors at each score level — OR fewer anchors (typically 3 for a 1–5 scale, at the endpoints and midpoint) with explicit interpolation guidance for the model. Three-anchor structures are defensible for token economy on continuous-feeling dimensions; binary "anchor at every level" is the conservative default. Reasoning forced before scoring, not after.

The rubric is the optimization target for any upstream agent that uses this judge for feedback. A misspecified rubric doesn't produce noisy scores — it produces sharply optimized wrong outputs. Calibration anchors and bias controls are load-bearing for this reason, not stylistic polish. If a known-good reference output exists for the input, structure the rubric as "compare candidate against reference; flag deviations and score severity" rather than absolute scoring; differential comparison is more reliable than rubric-anchor calibration when a reference is available.

**Sub-agent / tool.** Single-line purpose distinct from sibling tools. Parameters typed and exemplified. Side effects stated.

**System persona.** Identity stable. Refusal patterns explicit. Drift resistance designed in.

**Agent team.** Topology fits the task — orchestrator-workers for dynamic decomposition, parallelization-sectioning for independent aspects, parallelization-voting for high-stakes confidence, evaluator-optimizer for revision-driven tasks, swarm/shared-forum for open-ended discovery at scale. Don't pick a topology because it sounds sophisticated; pick the simplest one that fits.

Per-role checks:
- Orchestrator delegates with specific context, never with vague "based on your findings" language. Each worker dispatch includes the *what specifically* (file paths, exact criteria, concrete expected output) — the orchestrator does the synthesis, not the worker.
- Worker scopes don't overlap destructively. If two workers could plausibly handle the same input, the topology is wrong (this is orchestrator-workers with poor decomposition, or parallelization-sectioning with hidden dependencies).
- Each worker prompt has scope-lockdown language. "You do not work on X, that's another agent's responsibility" is louder than implicit boundaries.
- Roles with destructive capability have the layered lockdown pattern from Shape 5 (structural + prose, repetition, explicit handling of loophole tools). The audit's per-role check should walk through Shape 5's lockdown criteria for each such role.

Cross-role checks:
- Interface contracts align. Worker output schemas match what the orchestrator's prompt expects to parse. A schema field the orchestrator references should be a schema field the worker actually produces.
- Output formats are agent-consumable per `references/agent-consumability.md`: structured, greppable failure markers, aggregate-first, visible state transitions. Workers' outputs feed another agent; they're not for human display.
- Capability lockdown is consistent. If the orchestrator says "Worker A is read-only," Worker A's prompt enforces that. Inconsistency between orchestrator's belief and worker's actual capability is a fault line.
- Failure handling is specified. When a worker fails, what happens? Retry? Fallback? Partial results? The orchestrator's prompt addresses this explicitly rather than hoping it doesn't come up.

Empirical multi-agent checks (from published swarm experiments; see `references/agent-team-topologies.md` §Empirical failure modes):
- **Context differentiation.** Agents meant to produce diverse work don't share near-identical prompts and contexts. Identical contexts produce behavioral convergence — duplicate outputs, naming collisions, redundant work — not independent exploration. Differentiate by role, assigned angle, or seed material; confirm the differentiation is in the prompts, not assumed.
- **Unique-information elicitation.** Where evidence is distributed across agents, some prompt explicitly instructs agents to surface information *others don't have* and instructs the synthesizer/discussion to elicit unshared evidence and dissent before converging. Group discussion left to defaults converges on what everyone already knows.
- **Independence isolation.** For voting and independent-judgment topologies, confirm judges cannot see each other's outputs (or prices/scores) before committing. Visible peer signals produce convergence and even collusion-like coordination without any explicit agreement channel.
- **Epistemic vigilance.** Where agents act on other agents' reports, confirm either a verification norm (cross-check claims against observables, discount unverifiable or interested testimony) or an arbiter/referee role. Agents over-trust peer reports by default.
- **Mutual awareness and resource ownership.** Agents sharing an environment know the others exist, what each owns, and how conflicts resolve. Co-tenants discovering each other through side effects assume interference and escalate.

## O. Optional: empirical tests for high-stakes prompts

For prompts where behavior must be reliable and the cost of being wrong is high, run:

- **Fidelity test** (commutativity test): apply two key sections in opposite orders, compare outputs. Fidelity < 0.99 ⇒ ordering matters; current order should be the deliberately better one.
- **Interference test**: apply pairs of sections separately and combined, confirm intended emergent behavior.
- **Permutation test**: try 3 orderings of the strongest operators, score each, pick the best.

These tests cost LLM calls; reserve for production prompts.

## Failure handling

For any failed check:
- **Can fix without user input** → fix and re-audit.
- **Need user input** → ask one specific question, not a generic one.
- **Significant rework** → fix, re-audit affected sections.

Never ship a prompt with a known failed audit. Either fix it, or surface the gap honestly so the user ships with eyes open.
