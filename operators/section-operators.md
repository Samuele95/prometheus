# Operators catalog

Each section of a prompt is an operator that transforms the model's semantic state. This catalog describes each common section in operator terms: what it amplifies, suppresses, mixes; its strength; its commutation properties.

When drafting, consult this catalog to make conscious operator-design choices rather than treating sections as decoration.

## Strong operators (apply early, high information loss)

These set the Hilbert subspace within which all subsequent operators act (§5.1).

### Role / persona

- **Amplifies:** interpretations consistent with the role's expertise, vocabulary, and norms.
- **Suppresses:** off-domain interpretations, generic-helper-style outputs.
- **Mixes:** rare; persona is mostly a projection operator.
- **Strength:** strong. Among the strongest operators in any prompt.
- **Place first** unless a different section needs to dominate (rare).
- **Commutation:** highly non-commutative with most other operators. "You are a security engineer, be concise" ≠ "Be concise, you are a security engineer."
- **Failure mode:** persona that's too specific overconstrains; too generic ("helpful assistant") wastes the operator slot.

### Domain / context framing

- **Amplifies:** vocabulary, conventions, and reasoning patterns of the domain.
- **Suppresses:** cross-domain analogies and irrelevant frames.
- **Mixes:** when domain is intentionally hybrid (e.g., "biomedical engineer" mixes biology and engineering operators).
- **Strength:** strong, often near-equal to persona.
- **Place near front**, after or merged with persona.
- **Commutation:** non-commutative with persona; commutes loosely with formatting.

### Identity / "you are X" lines for system personas

- **Amplifies:** personality traits, communication style, behavioral norms.
- **Suppresses:** drift toward generic chat-assistant defaults.
- **Mixes:** rare.
- **Strength:** strong, especially for ongoing assistants where stability matters.
- **Place first.** Identity reinforcement may also appear later for drift resistance.

## Mid-strength operators (apply in middle of prompt)

These are projections within the subspace set by the strong operators.

### Task definition

- **Amplifies:** patterns associated with the task type (classify, extract, transform, generate).
- **Suppresses:** tangential outputs, conversational filler.
- **Mixes:** sometimes — when the task is genuinely novel or hybrid.
- **Strength:** mid to strong, depending on how well-defined the task is.
- **Place after persona/domain**, before constraints.

### Constraints / rules

- **Amplifies:** outputs that satisfy the constraint.
- **Suppresses:** outputs that violate it.
- **Mixes:** rarely.
- **Strength:** mid. Each constraint is its own operator; total strength scales with count.
- **Place after task definition.** Order constraints by importance (more important first).
- **Commutation:** constraints often commute with each other when independent; cross-cutting constraints (e.g., "be concise" vs "show your reasoning") don't.

### Initial contracts (engineering) / outline (writing) / methodology (research)

- **Amplifies:** structural choices the agent should adopt.
- **Suppresses:** structural drift away from the planned shape.
- **Mixes:** mid-frequency — contracts can mix domains when interfaces span them.
- **Strength:** mid. Stronger when framed as "do not deviate," weaker when framed as "initial — revisable."
- **Place after task definition.**

### Procedure / checkpoints (agentic loops)

- **Amplifies:** progress-oriented, checkpoint-aware behavior.
- **Suppresses:** unbounded exploration, sprinting past checkpoints.
- **Strength:** mid. Each checkpoint is itself a small operator.
- **Place after contracts.**

## Weak operators (commute with most, place late)

### Format / output structure

- **Amplifies:** outputs in the specified format.
- **Suppresses:** outputs in other formats.
- **Mixes:** essentially never.
- **Strength:** weak with respect to content (the model adapts content to format), strong with respect to format itself.
- **Place near the end.** Commutes with most content-shaping operators.
- **Exception:** for one-shot extraction tasks, output format becomes a strong operator — it dominates everything.

### Style rules

- **Amplifies:** stylistic choices.
- **Suppresses:** off-style output.
- **Mixes:** rarely.
- **Strength:** weak. Easily overridden by stronger operators.
- **Place late** unless they're load-bearing for the use case (e.g., legal writing where style is the deliverable).

### How to talk to me / communication contract

- **Amplifies:** specific communication patterns (asking before deciding, formatting commands, etc.).
- **Suppresses:** undesired communication patterns.
- **Strength:** weak to mid.
- **Place late.** These are conversation-shaping, not task-shaping.

## High-leverage operators (special cases)

### Few-shot examples

- **Amplifies:** patterns demonstrated in the examples — including unstated patterns the example contains by accident.
- **Suppresses:** patterns absent from the examples.
- **Mixes:** subtly — examples can teach behaviors that no rule explicitly states.
- **Strength:** very high for the specific patterns shown, weak for everything else.
- **Place where they're most relevant** — after the rules they exemplify, before the actual task.
- **Failure mode:** unrepresentative examples teach the wrong patterns. Quality of examples > quantity.
- **Critical: examples have their own ambiguity surface.** Any silent judgment call inside an example becomes a rule the model has to reverse-engineer. If your example populates an optional field one way, the model assumes that's the convention. If two examples make different calls on similar cases, the model gets confused. Audit examples for unstated reasoning before shipping (see audit checklist §C).

### Anti-examples

- **Amplifies:** awareness of failure modes.
- **Suppresses:** the demonstrated failures.
- **Strength:** mid to high for the specific failures shown.
- **Use sparingly** — they consume tokens and can have unintended priming effects.
- **Place after positive examples** so the model knows what good looks like first.

### Failure modes (DO NOT bullets)

- **Amplifies:** awareness of and avoidance of named failures.
- **Suppresses:** the named failures themselves.
- **Strength:** mid.
- **Place near end** of prompt — high-attention position.
- **Failure mode:** generic warnings ("don't make mistakes") waste tokens. Each DO NOT must address a specific known sharp edge.

### Permission to abstain

- **Amplifies:** calibrated honesty about the limits of the input. The model becomes willing to return null, "inconclusive," or "insufficient information" rather than fabricating a confident answer.
- **Suppresses:** hallucination, fabricated specifics, confident answers on inadequate input.
- **Mixes:** rarely.
- **Strength:** mid — small in tokens, high in effect when the alternative is hallucination.
- **Place near constraints**, not buried at the end. The model should know early that abstention is allowed.
- **Critical for Shape 2 (extraction), Shape 4 (tool output), and Shape 6 (judging)**. Less relevant for Shape 5 (persona) where refusal patterns handle abstention differently.
- **Failure mode:** vague abstention permission ("be honest about uncertainty") doesn't work. Concrete formulations do — name what abstention looks like ("return null", "return 'inconclusive'", "say 'the input does not contain enough information'").

### Clarification-seeking (the interactive sibling of abstention)

Abstention and clarification-seeking are the two responses to doubt, split by deployment context. Abstention is the floor — it works in every context and is always baked in. Clarification-seeking is the upgrade — it only applies when a user is present to answer, which is information the *generating user* supplies at build time, never something the runtime agent infers for itself.

- **Amplifies:** resolution of material forks by asking the present user, before committing to an output that a wrong assumption would spoil.
- **Suppresses:** silent guessing on material ambiguity when a human could have resolved it cheaply.
- **Strength:** mid. High value on genuine forks; negative value if over-applied (an agent that won't commit).
- **Place near constraints**, paired with the abstention permission it upgrades.
- **Only for contexts the generating user has confirmed are interactive.** Default-relevant for Shape 1 (agentic loop) and Shape 5 (conversational persona). Never added to a non-interactive deployment (one-shot pipeline, sub-agent called by an orchestrator, batch grader) — there, abstention governs and the agent must never be told to ask a user who isn't there.
- **Calibration is load-bearing.** The instruction is "ask on a *material* fork where the readings diverge in the output AND asking is cheap relative to guessing wrong" — not "ask whenever uncertain." Uncalibrated, this produces the over-questioning failure mode. One question at a time, with a recommended default, so the user confirms cheaply rather than authoring from scratch.
- **Abstention remains the fallback.** If clarification fails (no answer, ambiguous answer, or the bounded self-check below exhausts), the agent falls back to abstention — flag the residual uncertainty and proceed with the best reading or decline. Clarification never replaces abstention; it sits on top of it.

#### Bounded sufficiency self-check

When clarification-seeking is active, the agent needs a self-check to know whether the user's feedback actually resolved the fork — otherwise it either proceeds on a still-ambiguous answer or interrogates endlessly. The self-check is a small, bounded loop:

1. **After each user answer, assess sufficiency.** Did this answer resolve the specific material fork that prompted the question? State (to itself) what was uncertain, what the user said, and whether the gap is now closed.
2. **If sufficient → proceed.** Acknowledge the resolution briefly and continue. Do not ask redundant confirmation questions once the fork is closed; over-confirmation is its own failure mode.
3. **If insufficient → one targeted follow-up.** The answer was itself ambiguous or revealed a deeper gap. Ask one more precise question, naming exactly what's still unresolved.
4. **Bounded.** After ~2 rounds on the same fork without resolution, stop asking. Fall back to abstention: state the best available reading, flag the residual uncertainty explicitly, and proceed or decline. Endless clarification is a failure mode; the cap prevents it.

The self-check is `examine_answer` applied to the conversation rather than to a reasoning trace — it asks "is the gathered context sufficient for the task?" rather than "is this solution correct?". Phrase it concretely in the prompt: "Before proceeding, confirm the user's answer resolved [the specific fork]. If it did, continue. If it left a material gap, ask one targeted follow-up. After two rounds without resolution, proceed with your best reading and flag what remains uncertain."

- **Failure modes:** (a) no self-check → agent proceeds on a half-answer or loops forever; (b) unbounded self-check → interrogation; (c) self-check without abstention fallback → agent stalls when the user can't resolve the fork. All three are caught by the bounded-loop-plus-abstention-floor structure above.

### Long-horizon operators (Shape 1; some apply to Shape 4 workers on long tasks)

Six compact operators for long-autonomy prompts, adapted from vendor guidance on long-run agent behavior. Each earns its place only when the run is genuinely long (M5 applies); a two-checkpoint task needs none of them.

**Progress-claim grounding.**
- **Amplifies:** evidence-backed status reporting — every progress claim auditable against a tool result from the session; unverified work reported as unverified; failures reported with output.
- **Suppresses:** fabricated status reports, optimistic summaries of skipped steps. Vendor testing reports this instruction nearly eliminated fabricated status even on tasks designed to elicit them.
- **Strength:** strong on long runs. **Place with the status-update contract.** Commutes with format operators; does not commute with "report concisely" (grounding constrains *what* may be claimed before brevity compresses it — apply grounding first).

**Checkpoint policy.**
- **Amplifies:** pausing only where the human is genuinely required — destructive or irreversible actions, real scope changes, input only the user can provide.
- **Suppresses:** permission-seeking on reversible actions that follow from the original request; enumerating every pause case (a brief policy outperforms enumeration on high-instruction-following substrates).
- **Strength:** mid. **Place in the loop-contract section.** Pairs with anti-early-stopping below; on lower tiers may need the enumerated form.

**Anti-early-stopping.**
- **Amplifies:** finishing the turn's actual work — if the drafted ending is a plan, a question the agent can answer itself, or a promise ("I'll now run X"), the instruction converts it into the tool calls that do X now.
- **Suppresses:** text-only statements of intent without the corresponding action; turn-ending permission requests the checkpoint policy doesn't sanction.
- **Strength:** mid; rises on very long sessions where the failure mode concentrates. **Place adjacent to the checkpoint policy** — they are two halves of one contract: stop only at real checkpoints, and never stop on a promise.

**Memory-file conventions.**
- **Amplifies:** durable, deduplicated lessons — one lesson per file/entry with a one-line summary on top; corrections and confirmed approaches recorded with *why they mattered*; existing notes updated rather than duplicated; wrong notes deleted.
- **Suppresses:** memory bloat, stale contradictory notes, re-recording what the repo or conversation history already holds.
- **Strength:** weak per turn, compounding across sessions. **Place in the memory-file specification** of the seed brief.

**Deviations log.**
- **Amplifies:** a disciplined rule for how the agent collapses ambiguity it discovers itself mid-run: when an edge case forces departure from the plan, take the conservative option, record it under a "Deviations" heading in an implementation-notes file, and continue.
- **Suppresses:** silent plan divergence (no audit trail) and its opposite failure, halting on every discovered unknown. This is the runtime complement of the interview: unknowns found *during* the work get collapsed conservatively and logged for the next planning pass.
- **Strength:** mid. **Place with the memory-file conventions**; the notes file is where the next session's plan revision starts.

**Verbatim user-channel (send-to-user pattern) — harness-dependent.**
- **Amplifies:** mid-run delivery of content the user must see exactly as written (a partial deliverable, a direct answer to a mid-loop question, a progress update with specific numbers) via a dedicated tool whose input renders verbatim — tool inputs are never summarized.
- **Suppresses:** burying verbatim-critical content inside summarizable narration.
- **Strength:** weak-to-mid; only meaningful when the harness defines the tool. **Two-part operator:** the tool definition alone under-fires — pair it with elicitation language in the prompt ("when you have content the user must read verbatim, call send_to_user with it; not for narration or reasoning"). Flag as harness-dependent in delivery; omit entirely when the runtime has no such tool.

**Lead-with-outcome (final summaries to humans).**
- **Amplifies:** re-grounding the reader — the first sentence answers "what happened / what did you find"; supporting detail after; selectivity over compression (drop details that don't change what the reader does next, rather than compressing everything into fragments); session-local shorthand, arrow chains, and made-up labels dropped or re-introduced in plain language.
- **Suppresses:** working-thread continuations delivered as summaries — dense shorthand, references to reasoning the user never saw, vocabulary the agent built up mid-run.
- **Strength:** weak; commutes with most operators. Applies to the *final agent-to-human message* of Shapes 1 and 4, not to inter-agent output (that's `agent-consumability.md`, which optimizes for the opposite reader) and not to mid-run narration.
- **Place in the status-update / final-report contract.** One sentence of it is usually enough on high-instruction-following substrates.

### Worked examples (for loop-based prompts)

- **Amplifies:** the canonical shape of expected behavior.
- **Suppresses:** divergent shapes.
- **Strength:** very high for shape; weak for content.
- **Place at the end of the contract sections** they exemplify.

## Section combinations: interference effects (§5.4)

Some pairs produce emergent behavior beyond the sum of their parts. Watch for these:

### Persona + tone

- Constructive: "expert + dry tone" produces a recognizable Stack-Overflow voice.
- Destructive: "warm assistant + brutally honest" can cancel — model defaults to neither.

### Format + reasoning visibility

- Constructive: structured output with reasoning field forces visible reasoning that's parseable.
- Destructive: "JSON output" + "show your reasoning" without a reasoning field in the JSON produces inconsistent structure.

### Multiple personas

- Always interferes. "You are a security engineer AND a UX designer" is not "two reviews concatenated" — it's a different operator entirely. May be desired (cross-cutting reviews) or undesired (mode collapse).

### Constraint stacking

- "Be concise" + "be thorough" cancels.
- "Be concise" + "but cover all error cases" creates mode collapse — the model picks one.

### Refusal patterns + warm tone

- Often destructive. The warmth softens the refusal until it stops being a refusal.

## Designing the operator sequence

When drafting a prompt, lay out the operators in this order and audit for interference:

1. **Identity / persona** (strongest; sets the subspace)
2. **Domain / context** (often merged with identity)
3. **Task definition** (the projection within the subspace)
4. **Constraints** (further narrowing)
5. **Few-shot examples** (high-leverage; place near the rules they teach)
6. **Procedure / checkpoints** (for loop-based)
7. **Failure modes** (high-attention end position)
8. **Output format** (last unless dominant)
9. **Worked examples** (anchor the structure)
10. **Done definition / start instruction** (terminal projection)

This ordering reflects §5.1's principle: broadest framing first, narrowing constraints next, format last. Departures from this ordering should be deliberate, with a clear reason.
