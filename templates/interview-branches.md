# Interview branches

The flat interview is capped at 6 questions total, including any disambiguation question from Phase 1. Three questions are universal across all shapes (tool/runtime, done definition, deployment context — the last skippable when the context is unambiguous); the remaining 2–3 are shape-specific. Co-authoring passes (Shapes 3, 6, 7) are exempt from the cap per the conduct rules at the end of this file.

Question ordering is operator ordering (§5.1). Ask broadest-framing first, narrowing constraints next, formatting last.

## Universal questions (every shape)

These run regardless of inferred shape, generally as the last two questions:

**Tool / runtime.**
> Where will this prompt run? (Claude Code, Gemini CLI, OpenAI API, Anthropic API, generic LLM, or other?)

Influences memory file naming for agentic loops, message structure (system vs user) for one-shot, and tool-specific affordances. Skip if the user's request already named the tool.

**Done definition.**
> How will you know the prompt worked? Make it checkable, not vibe-based. 2–4 items is usually right.

Provides the rubric the prompt's evaluation will be scored against. Skip only if the user already gave checkable success criteria.

**Deployment context (interactivity).** Ask when the behavior-under-doubt matters — which is most prompts that take real-world input:
> When this runs and the agent hits a genuine ambiguity it can't resolve from the input, is there a user present who can answer a follow-up question? Or does it run unattended (pipeline, batch, called by another agent)? And if a user is present — do you want the agent to ask for clarification on material forks, or to make its best call and flag uncertainty?

This is the one piece of information the framework cannot infer and the runtime agent cannot reliably judge for itself: whether a human is actually present to answer. The generating user knows; capture it here.

- **Unattended / non-interactive** → the generated prompt uses **abstention** under doubt (flag, return null/inconclusive, proceed with best reading and note the gap). Never instruct the agent to ask a user who isn't there.
- **Interactive + user wants clarification** → layer **clarification-seeking** on top of the abstention floor: ask one calibrated question on material forks, with the bounded sufficiency self-check (see `operators/section-operators.md`).
- **Interactive + user wants best-call-and-flag** → abstention floor only, even though a user is present. Some interactive contexts still prefer the agent not to interrupt.

Abstention is always baked in regardless of the answer — it's the safe default that works in every context. Clarification-seeking is the opt-in upgrade, authorized only by an explicit interactive answer here. If the user's answer to this question contradicts their runtime answer (e.g., asks for clarification-seeking but named a batch pipeline), flag it rather than silently choosing: "you asked for clarification-seeking, but this runs unattended per your runtime answer — the agent will have no one to ask. Abstention instead, or is there a review step I'm missing?"

Skip this question only when the deployment context is unambiguous from the request (a Shape 6 batch grader is obviously unattended; a conversational tutor is obviously interactive) — and even then, state the assumption in the summary collapse.

## Shape 1: Agentic loop questions

Ask 2–3 of these, broadest first:

1. **Project scope and length.** "Roughly how long is this project — hours, days, weeks? Will it span multiple sessions?"
2. **Domain and stack.** "What's the domain (engineering / research / writing / ops / something else) and the key materials or stack?"
3. **Heterogeneity / pre-decided architecture.** "Are there architectural decisions already made you want to lock in, or is the agent free to propose?"
4. **Audience for the output.** "Who else reads this work — graders, teammates, reviewers, only you? Affects what gets logged inline."
5. **Time budget / hard deadline.** "Hard deadline or open-ended? If hard, when?"

## Shape 2: One-shot complex task questions

Ask 2–3 of these:

1. **Input variability.** "What does the input look like — fixed format, varied natural language, structured data, mix? How variable is it?"
2. **Output format.** "What does the output need to be — JSON schema, free text, structured list, single label, ranked items?"
3. **Edge cases the user has seen.** "What cases have you seen the LLM get wrong on this task before, if any? I'd rather build for real failures than imagined ones."
4. **Reasoning visibility.** "Should the model show its reasoning before the answer, or output only the answer? (Chain-of-thought trades latency for accuracy on hard tasks.)"
5. **Scale.** "Will this run once, occasionally, or at high volume? Affects whether token-cost optimization is worth pursuing."

## Shape 3: Workflow / chain questions

Shape 3 differs from other shapes: the *decomposition* into stages is the highest-leverage decision and depends heavily on user expertise about the task. Use a co-authoring pass rather than a flat question list.

**Step 1 — Propose a candidate decomposition.** Based on the user's task description, draft a proposed stage breakdown (typically 2–5 stages). Present it concretely:

> Based on what you've described, I'd propose this chain:
> 1. [Stage name] — [one-sentence purpose]
> 2. [Stage name] — [one-sentence purpose]
> 3. [Stage name] — [one-sentence purpose]
>
> Does this match what you had in mind, or would you prefer different stages? Feel free to add, remove, rename, or reorder.

Don't propose more than 5 stages on the first pass — chains longer than that often indicate the task wants a different shape (orchestrator-workers in Shape 7) or the decomposition is too fine-grained.

**Step 2 — Confirm or revise the decomposition.** The user accepts, modifies, or replaces the proposal. Iterate once if needed; don't iterate more than twice (decomposition-by-committee produces shallow chains).

**Step 3 — One targeted question per stage.** For each agreed stage, ask the single most uncertain thing about it. Pick from these depending on what the stage does:

- **For extraction/transformation stages**: "What's the output schema for this stage? The next stage needs to parse it."
- **For decision/gate stages**: "What's the pass criterion? When does the chain proceed vs. fall back vs. abort?"
- **For synthesis stages**: "What does 'good output' look like at this stage — give me one example or one description."
- **For validation stages**: "What specifically gets validated, and what happens if validation fails?"

Don't ask the same question type for every stage. Pick the stage's actual uncertainty.

**Step 4 — Universal closers.** Tool/runtime and done definition apply at the chain level, not per stage. Ask once at the end.

If the user prefers a flat question style, fall back to:
1. **Stage count and purpose.** "Walk me through the stages. What does each one do, in one sentence?"
2. **Inter-stage data flow.** "What flows between stages — natural language, structured data, classifications? Any stages where the output schema is critical?"
3. **Failure handling.** "When a stage fails — retry, fallback, abort? Different stages may have different policies."

The co-authoring pass is preferred for non-trivial chains (3+ stages, structured inter-stage data, production deployment). The flat fallback is acceptable for simple chains the user has clearly already designed.

## Shape 4: Sub-agent / tool prompt questions

Ask 2–3 of these:

1. **Role in the larger system.** "Who calls this — a parent agent, a specific tool-use loop, something else? What does it call this for?"
2. **Tool overlap.** "What other tools does the parent agent have? I want to make sure this one's purpose is unambiguous against the others."
3. **Side effects.** "Does this tool modify state (files, APIs, databases) or just read? Affects how cautiously the parent agent should invoke it."
4. **Common failure modes.** "Have you seen the parent agent misuse this tool or another one like it? What did it do wrong?"

## Shape 5: System persona / assistant prompt questions

Ask 2–3 of these:

1. **Identity and competence.** "Who is this assistant — what role, what background, what level of expertise? In one or two sentences."
2. **Tone and register.** "Tone and register — formal / conversational / academic / dry / warm / something specific? Any example of a voice you'd want to mirror?"
3. **Refusal and boundary patterns.** "What should it never do, even when users push? And how should it refuse — direct, redirect to alternatives, escalate?"
4. **Scope of conversation.** "Is this for narrow tasks (e.g., billing support) or open-ended (e.g., a tutor)? Affects how much off-topic flexibility the persona needs."

## Shape 6: LLM-as-judge / grader questions

For LLM-as-judge prompts, calibration anchors are the highest-leverage decision and depend on tacit user knowledge that's hard to elicit with a single question. Use a co-authoring pass for the calibration step specifically.

**First two questions (flat):**

1. **What's being judged.** "What artifacts get scored — model outputs, code, written content, dialogues? And what's the input to the grader?"
2. **Rubric structure.** "Single score, multiple dimensions, ranked comparison, qualitative? If multiple dimensions, what are they?"

**Calibration co-authoring pass:** For each scoring dimension, walk through anchors collaboratively rather than asking "do you have examples?"

For each dimension, ask in this order:

- **Clear-pass anchor.** "For [dimension], what does a clear-pass output look like? One example or one descriptive sentence is fine. If you don't have an example handy, describe what 'this is unambiguously good' means for [dimension]."
- **Clear-fail anchor.** "And what does a clear-fail look like? Same thing — one example or one description of 'this is unambiguously bad' for [dimension]."
- **Borderline (optional).** Borderline anchors are the hardest for users to articulate. After receiving the pass and fail anchors, *propose* a borderline anchor and ask for confirmation: "Based on those, here's what I'd guess a borderline case looks like: [proposed anchor]. Does that match your intuition, or would you describe the borderline differently?"

This converts a yes/no question ("do you have examples?") into a structured surfacing of tacit knowledge. The user almost always has implicit calibration; the pass makes it explicit.

**Final question (flat):**

3. **Bias concerns.** "Any known biases to control for — length, position (when comparing pairs), persona? Especially relevant for production graders."

**Conduct rules for the co-authoring pass:**

- If the user has many dimensions (more than 3), don't run the full co-authoring pass for every one. Run it for the first 2 dimensions; for the rest, ask for clear-pass and clear-fail in a single combined turn.
- If the user is clearly experienced with grading and produces complete anchors quickly, accept them and move on. The pass is for surfacing tacit knowledge, not for forcing structure on users who already have it.
- If the user struggles to articulate anchors for a dimension, that's a real signal — the dimension may be ill-defined, and the rubric will inherit that. Surface this honestly: "It sounds like this dimension doesn't have a clear anchor yet. Want to redefine the dimension before we draft, or accept that anchors will be approximate?"

## Shape 7: Agent team questions

For agent teams, two decisions dominate everything else: topology choice and role roster. Both benefit from co-authoring rather than flat questioning.

**Step 1 — Topology selection (flat).** This stays as a single question because the four canonical topologies are a discrete choice:

> How do the agents coordinate? Pick one or describe a hybrid:
> (a) Orchestrator dispatches dynamic subtasks to workers, synthesizes results — useful when you can't predict the subtasks in advance.
> (b) Multiple workers in parallel, each handling a different *aspect* of the input — useful when the task has independent sub-considerations.
> (c) Multiple workers in parallel doing the *same* task, results aggregated by voting/consensus — useful for high-stakes confidence.
> (d) Generator produces output, evaluator critiques it, generator revises — useful when revision genuinely improves output.

If the user is unsure, propose the most likely fit based on their task description and explain why.

**Step 2 — Role roster co-authoring.** Don't ask the user to enumerate roles cold. Propose a candidate roster based on the topology + task:

> For [topology] applied to [task], I'd propose this roster:
> - **[Role name]**: [scope, one sentence] · capability: [read-only / writes / shell / etc.]
> - **[Role name]**: [scope, one sentence] · capability: [...]
> - **[Role name]**: [scope, one sentence] · capability: [...]
>
> Does this roster match what you had in mind, or would you prefer different roles? Add, remove, rename, or change capabilities as needed.

For orchestrator-workers, the roster typically includes one orchestrator + 2–4 workers + optionally a synthesizer. For parallelization-sectioning, one worker per aspect + an aggregator. For evaluator-optimizer, one generator + one evaluator. Match the roster shape to the topology shape; don't propose more roles than the topology supports.

**Step 3 — One targeted question per role.** For each agreed role, ask the single most uncertain thing:

- **For the orchestrator**: "What's the orchestrator's synthesis model — does it combine worker outputs, prioritize one over others, or resolve conflicts? One sentence."
- **For workers**: "What's this worker's output schema? The orchestrator needs to parse it." (Or, if obvious from the task: "What's the one thing this worker should NEVER do, even when prompted to?")
- **For evaluators**: "What does the evaluator approve vs. reject? The convergence criterion." (Calibration anchors come from Shape 6's co-authoring pass if the user wants depth.)
- **For synthesizers/aggregators**: "Is this mechanical (concatenation) or interpretive (re-judging)? Affects whether it's an LLM call or code."

Don't ask the same question type for every role. Match the question to the role's actual uncertainty.

**Step 4 — Capability boundaries (flat, only if applicable).**

> Any roles that have destructive capability (write access, shell access, modifies production state)? If so, what should they absolutely never do, even when the user pushes? This drives the lockdown design per role.

Skip if no roles have destructive capability based on Step 2's roster.

**Step 5 — Failure handling (flat, only for production teams).**

> When a worker fails — returns garbage, times out, hits an error — what's the right behavior? Retry, fall back to a different agent, abort the whole team, return partial results?

Skip for one-off team designs; ask for production-bound teams.

**Conduct rules for the co-authoring pass:**

- The proposed roster is the framework's first attempt; treat it as disposable. If the user replaces it entirely, that's fine.
- Don't iterate the roster more than twice. Roster-by-committee produces fragmented teams.
- If the user has clearly designed the team already and just wants the prompts drafted, skip Steps 2–3 and go straight to per-role drafting using the user's spec.

## Disambiguation question (only if Phase 1 was ambiguous)

If shape inference produced two top candidates within ~30%, ask one forced-choice question:

> Quick check before I draft: this looks like it could be either a [Shape A] or a [Shape B]. To be sure — [the question that disambiguates].

Examples:

- "Either a one-shot extraction prompt or a workflow with multiple stages?" → Disambiguator: "Will this run as one LLM call, or multiple coordinated calls?"
- "Either a system persona or a sub-agent tool prompt?" → Disambiguator: "Will users talk to this directly, or will another agent call it as a tool?"
- "Either an agentic loop or a workflow chain?" → Disambiguator: "Does the agent decide what to do next on its own, or are the steps pre-defined?"

The disambiguation question counts toward the 5-question cap.

## Unknowns triage (Phase 2 cross-cutting note)

The interview resolves the user's *known unknowns* — the questions they know they haven't answered. Two other ambiguity types need different discovery operators, and misrouting them wastes the interview:

| Ambiguity type | Signal | Discovery operator |
|---|---|---|
| Known unknowns | User asks questions, flags open decisions | The interview itself (already covered) |
| Unknown knowns | "I'll recognize it when I see it"; taste/quality criteria the user can't verbalize | Recommend **cheap measurement outside the prompt**: a quick brainstorm of variants or a throwaway prototype for the user to react to, *before* drafting — reacting to concrete candidates is cheaper than discovering the criterion mid-implementation |
| Unknown unknowns | User signals unfamiliarity with the domain, codebase, or what "good" looks like | Recommend a **blind-spot pass** first: enumerate the basis states the user hasn't articulated — the questions they don't know to ask — before any collapse toward a draft |

Two conditions on the triage:

- **It requires knowing the user's starting point.** When familiarity is unstated and the task is non-trivial, fold a starting-point elicitation into an existing interview question rather than adding one — e.g., extend the done-definition question with "…and what's your experience with this domain / codebase, so I know which assumptions to spell out?"
- **Escalation rule.** If the user cannot evaluate the variants a cheap-measurement pass produces, the ambiguity was in the *measurement basis*, not the state — they don't yet know what dimension "good" varies along. Escalate from the unknown-knowns pattern to the blind-spot/teaching pattern before producing more variants.

**The reference operator.** When the user cannot verbalize a requirement, a reference artifact is the densest available operator — it transfers basis states prose cannot. Source code is the strongest reference of all, even in another language ("this library implements the exact behavior I want — match its semantics"); designs, documents, and examples of prior output also work. When the can't-verbalize signal appears, the interview should ask for a reference before asking the user to try harder with words.

## Conduct rules

- **6 flat questions max** (3 universal, of which deployment-context is skippable when obvious; 2–3 shape-specific; disambiguation counts). If you find yourself wanting a 7th flat question, default it and state your assumption in the summary.
- **Co-authoring passes (Shapes 3, 6, 7) don't count against the cap directly.** A co-authoring pass replaces 1–2 flat questions with a structured back-and-forth at one specific decision point. Total interview length should still be reasonable — if the co-authoring pass is producing more than 4 turns of back-and-forth on its own, the decomposition (or roster, or rubric) is too contested and you should propose a default with confidence rather than continuing to elicit.
- **One question per turn for flat questions.** Multi-question turns destroy depth.
- **Co-authoring proposes first, asks second.** When running a co-authoring pass, always propose a candidate (decomposition, roster, anchor) before asking the user to specify. Cold elicitation produces shallower answers than reaction to a concrete proposal.
- **Skip the obvious.** If the user already specified something, asking about it is information-destroying repetition (§5.6). This applies to both direct mentions and clear inferences. Common inferences worth honoring:
  - "Production pipeline" or "called from Python" → no reasoning visibility needed (low latency, parseable output).
  - "Custom GPT" or "system prompt" → ongoing conversational use, scope of conversation can usually be inferred.
  - "Grader" or "scoring" or "1-N scale" → LLM-as-judge shape, output is a structured judgment.
  - "Multi-stage" or "after that, then" → workflow chain, intermediate output formats matter.
  - Named tool/runtime + named domain → scale and audience often follow.
  
  When you skip a question because of inference, name the assumption in your summary collapse so the user can override.
- **Order: broadest first, narrowest last.** Persona and scope before format and edge cases (§5.1).
- **End with a summary collapse.** Before drafting, state the inferred shape, the constraints gathered, and the defaults assigned. Give the user one chance to override. This makes the measurement step (§1.2) explicit.
