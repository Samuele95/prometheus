# Shapes — catalog, interview branches and per-shape rules

A shape is the structural archetype of a prompt: its spine, its dominant operators, what the interview must learn, how it fails. Shape 1: `references/loops.md`. Operators: `references/operators.md`. Checks and Verify lines: `references/audit.md`.

## Indice

1. Shape inference
2. Interview frame — cap and conduct · universal questions · unknowns triage
3. Shapes 2–7
4. Structured output and prefill
5. Hybrids · Domain axis · Minimum-viable scaffold

## Shape inference

Infer, never route: from the request's signals (verbs, nouns, scale markers, tool mentions) hold a posterior over the seven shapes (P3). Pick the leader only if the runner-up is clearly behind; top two within ~30% → one forced-choice question ("either a [Shape A] or a [Shape B] — [the disambiguating question]"), never an open routing question; it counts toward the cap. Disambiguators: one-shot vs chain → one call or several?; persona vs tool → do users talk to it or does an agent call it?; loop vs chain → does the agent choose the next step or are steps pre-defined? Same pass: the **domain** and, for Shape 2 and reasoning-heavy components, the **hard-reasoning signals**; the tier comes from the runtime answer (P9).

## Interview frame

### Cap and conduct

- **Six flat questions max**, disambiguation included: three universal plus 2–3 shape-specific; a seventh → default it, state the assumption in the collapse block.
- **Broadest first, narrowest last** — question order is operator order (P2). **One flat question per turn.**
- **Skip the obvious.** What the user specified, by mention or clear inference, is not re-asked — that re-measures a collapsed state (P5): "production pipeline" → no reasoning visibility; "custom GPT" → conversational; "grader" / "1-N scale" → judge, structured output; "multi-stage" → chain. Every skipped question's assumption goes in the collapse block.
- **Co-authoring passes (Shapes 3, 6, 7) don't count against the cap**: each replaces 1–2 flat questions with a structured exchange at one decision point and **proposes first, asks second** — a candidate (decomposition, roster, anchor) precedes any request to specify. Past ~4 turns, propose a default with confidence.
- **The collapse block closes the phase and gates drafting** — its contents and the gate are in SKILL.md, Phase 2.

### Universal questions (every shape, generally last)

**Tool / runtime** — "Where will this run? (Claude Code, Gemini CLI, OpenAI API, Anthropic API, generic, other?)" Sets the memory-file name, message structure, affordances, the tier. Skip if named.

**Done definition** — "How will you know it worked? Checkable, not vibe-based; 2–4 items." Becomes the rubric the draft is evaluated against; when familiarity is unstated and the task non-trivial, extend it ("…and your experience with this domain, so I know which assumptions to spell out?") rather than adding a question. Skip only if the user already gave checkable criteria.

**Deployment context** — whenever behavior under doubt matters: "When the agent hits an ambiguity it can't resolve from the input, is a user present to answer, or does it run unattended (pipeline, batch, called by another agent)? If present — ask on material forks, or best call and flag?" The one fact the framework can't infer and the runtime agent can't judge; the answer selects the doubt operators (`references/operators.md`; M3b). A contradiction with the runtime answer (clarification for a batch pipeline) is flagged, not silently resolved. Skip only when unambiguous (a batch grader, a tutor) — and still state the assumption.

### Unknowns triage

The interview resolves *known unknowns*. **Unknown knowns** ("I'll recognize it when I see it") → recommend the user run cheap measurement outside the prompt — variants or a throwaway prototype to react to — *before* drafting; a user who can't evaluate the variants doesn't yet know which dimension "good" varies along → escalate to the blind-spot pass. **Unknown unknowns** (unfamiliar domain, codebase, or notion of "good") → a **blind-spot pass** first: enumerate the questions the user doesn't know to ask. The triage needs the user's starting point (folded into the done-definition question).

**The reference operator.** When the user can't verbalize a requirement, a reference artifact is the densest operator available — source code strongest, even in another language; designs, documents, prior outputs also. Ask for a reference before asking the user to try harder with words. References beat prose as verification too: a test suite, a mockup or a rubric specifies "done" at higher fidelity than a paragraph — wire it into the done definition.

## Shape 2 — One-shot complex task

**Signals.** "A prompt that classifies / extracts / summarizes / transforms [X]"; one deliverable from one call. **Produces.** One prompt (system + user, or one block).

**Spine.** 1 Role binding (optional — context can replace it) · 2 Task · 3 Input format · 4 Output format (often the most important — schema, examples) · 5 Constraints · 6 Edge cases (only those that occur) · 7 Few-shot examples (load-bearing when non-trivial) · 8 Anti-examples (subtle failures) · 9 Cognitive-tools scaffold (on signals). **Profile.** Output format dominant, may lead (the exception to format-last) — but with the scaffold present the format follows it (P2; `references/cognitive-tools.md`); few-shot second; role weak.

**Hard-reasoning signals** (during shape inference): mathematical or logical tasks ("solve", "prove", "derive"); multi-step planning with dependencies or trade-offs; code analysis or debugging (dead ends); multi-constraint *satisfaction* — a space the model must search *through* — as opposed to *compliance*, a checklist against a specified solution (NOT a signal: must the model *discover* how to satisfy the constraints, or just *check* that it did?); a user-named symptom ("often wrong first try"); verification easier than production. Extraction, classification, summarization, transformation → no scaffold. Gating by tier, evidence, composition, shipping the four definitions (`assets/cognitive-tools.json`): `references/cognitive-tools.md`.

**Interview** (2–3). Input variability — fixed, natural language, structured, mixed? · Output format — schema, free text, list, label, ranking? · Edge cases seen — what has the model gotten wrong before? · Reasoning visibility — reasoning before the answer, or answer only? · Scale — once, occasionally, high volume?

**Checks.** Edge-case bloat (B); Structured output and prefill below.

## Shape 3 — Workflow / chain

**Signals.** "A chain that [generate → check → refine]"; several coordinated calls, gates, validators. **Produces.** One prompt per stage plus a workflow doc.

**Spine — per stage:** role · input (previous output) · transformation · output format parseable by the next stage · pass/fail criteria for gates. **Workflow doc:** stages with one-line purpose · data flow · failure handling (retry, fallback, abort). **Profile.** Each stage a complete operator; information lost early is unrecoverable (P5; G).

**Interview — co-authoring pass** (the decomposition is the highest-leverage decision): (1) propose 2–5 stages with a one-line purpose each — never more on the first pass (longer chains want Shape 7, or are too fine) — "add, remove, rename, reorder?"; (2) iterate at most twice; (3) one targeted question per stage matched to its uncertainty, never the same for every stage — extraction: the schema the next stage parses; gate: the pass criterion and proceed / fallback / abort; synthesis: one example of good output; validation: what is validated and what happens on failure; (4) universal closers once, at chain level. Flat fallback for chains the user already designed: stages, inter-stage data, failure handling. Co-authoring is the default for 3+ stages, structured data, or production.

**Checks.** Stage coupling via implicit output formats → schemas at every stage.

## Shape 4 — Sub-agent / tool prompt

**Signals.** "A sub-agent that [X]", "describe this tool to my agent", "tool docstring"; prompts inside a larger system. **Produces.** A prompt or docstring consumed by another LLM or a tool-use mechanism.

**Spine.** 1 Single-line purpose (the most-attended part) · 2 When to use — and when NOT · 3 Parameters (types, examples, edge cases) · 4 Output format with examples · 5 Side effects · 6 Error modes. **Profile.** Purpose line dominant (the parent reads it first); parameters second.

**Interface as operator.** Expressive names and typed enumerations (`status: [pending, in_progress, completed]`) constrain the parent at near-zero cost without the ambiguity surface of examples (C3): frontier tier → design the interface first (names, types, enums, required vs optional), examples only where it can't express the convention; legacy → examples keep more value. Output the parent parses: `references/agent-output.md`.

**Interview** (2–3). Who calls it, for what? · What other tools does the parent have? · Writes state or reads only? · Observed misuse?

**Checks.** N4; the description stays minimal — bloat overlapping sibling tools creates ambiguity about which to call.

## Shape 5 — System persona / assistant prompt

**Signals.** "An assistant that [X]", "system prompt for [persona]", "Custom GPT"; conversational use where stability matters. **Produces.** A system prompt shaping behavior across unknowable inputs.

**Spine.** 1 Identity · 2 Domain and competence boundaries · 3 Tone / register · 4 Behavior rules · 5 Format defaults · 6 Escalation / refusal patterns · 7 Few-shot ideal interactions. **Profile.** Identity dominant; behavior rules mid; format weak.

**Interview** (2–3). Identity and competence · Tone — a voice to mirror? · Refusals — what it must never do even when pushed, and how it refuses (direct, redirect, escalate) · Scope — narrow or open-ended?

**Checks.** N5, N5b; and:
- *Persona collapse under pressure* → explicit "if asked to deviate from X, do Y" rules plus identity refresh.
- *Category-based personas* ("strict on security, lenient on style") make the model classify before applying a threshold: define it concretely ("major if it requires the author to think, not just apply") and precedence for collisions ("strict wins").
- *Destructive capability — the layered lockdown.* Write, shell, financial or irreversible actions: structural restriction alone is insufficient on any tier (P9 — the justification is risk). Four layers: (1) **structural** — tool whitelists, `disallowedTools`; (2) **prose** — a top banner, repeated prohibitions, loophole tools named — shell redirection and network calls (a "read-only" persona with a shell can still `echo "x" > file`); (3) **forceful negative phrasing** at start and end — "you cannot and must not" (P11: what named prohibitions are for); (4) **the reason** (P10) — "because another agent owns those files and concurrent edits corrupt them". Shape 7 applies it per role (N7d, N7g).

## Shape 6 — LLM-as-judge / grader prompt

**Signals.** "Score [X]", "LLM-as-judge", "grader", "rubric". **Produces.** A prompt returning a judgment (score, ranking, qualitative) on candidate outputs.

**Spine.** 1 Role ("expert [domain] grader") · 2 What is judged · 3 Rubric (criteria, weights, thresholds) · 4 Calibration examples (N6b) · 5 Output format, parseable · 6 Bias controls (length, position, persona). **Profile.** Rubric dominant; anchors second; bias controls subtle, high-leverage.

**Interview.** Two flat questions — what is judged and what the grader receives; rubric structure (single score, dimensions, ranking, qualitative) — then a **calibration pass** per dimension: clear-pass anchor (one example or one sentence), clear-fail anchor, borderline *proposed* for confirmation; then bias concerns. Conduct: more than 3 dimensions → full pass for two, pass/fail anchors for the rest in one turn; complete anchors given quickly → accept; a dimension the user can't anchor is ill-defined and the rubric inherits it — say so: "redefine it before we draft, or accept approximate anchors?"

**Checks.** N6–N6d; rubric vagueness → mode collapse (everything a 7) → per-level descriptions with anchors, reasoning forced *before* the score. Verifier-agents are Shape 6 prompts (`references/evals.md`).

## Shape 7 — Agent team

**Signals.** "Agent team", "orchestrator and workers", "multi-agent"; several coordinated roles. **Produces.** An orchestrator prompt, worker prompts, optionally a synthesizer or evaluator, and the coordination doc (contracts, capability boundaries, failure handling) — one file per role.

**Spine.** 1 Topology (`references/agent-teams.md`) · 2 Roster — per role: name, scope (does / doesn't), capabilities, its prompt's shape (orchestrator usually 5, workers 4, evaluators 6) · 3 Interface contracts — input and output schema per worker, with tool-description rigor (typed schema, examples, what the orchestrator does with each field; `references/agent-output.md`); broken contracts fail silently · 4 Lockdown per role (Shape 5's layers) · 5 Coordination — where shared state lives, how conflicts resolve, what the synthesizer does when workers fail or time out; on production teams the orchestrator's prompt states the policy explicitly (retry, fallback, abort, partial results) · 6 Per-role prompts on their own spines · 7 Cross-role audit (N7e–N7m). **Profile.** Topology dominant; orchestrator second; workers mid but high-leverage — their scope lockdown decides coherent vs chaotic.

**Interview** (topology and roster co-authored). (1) *Topology*, flat: "(a) orchestrator dispatching dynamic subtasks; (b) parallel workers on different *aspects*; (c) parallel workers on the *same* task, aggregated by vote; (d) generator + evaluator in a loop; (e) peers on one open objective through a shared forum with validators" — each with its one-line *when*; unsure → propose the fit. (2) *Roster*, proposed from topology + task ("**[Role]** — [scope] · capability: [read-only / writes / shell]"), never more roles than the topology supports (orchestrator + 2–4 workers + optional synthesizer; one worker per aspect + aggregator; generator + evaluator); iterate at most twice. (3) *One targeted question per role*, never the same for every role — orchestrator: synthesis model; worker: output schema, or the one thing it must never do; evaluator: convergence criterion; aggregator: code or LLM? (4) *Capability boundaries*, only with destructive roles. (5) *Failure handling*, production only: on garbage, timeout or error — retry, fall back to another agent, abort, or return partial results? A user who already designed the team → skip (2)–(3).

**Checks.** N7–N7m; cures in `references/agent-teams.md`; verifiers per role plus a cross-role contract verifier in `references/evals.md`.

## Structured output and prefill (Shapes 2 and 6)

Machine-parseable output → the default is an **explicit format operator**: state the format positively ("Output only valid JSON with no preamble. Begin your response with `{`"), optionally a result tag, and match the prompt's own formatting to the output style; judges put the reasoning field first. **Prefilling** the assistant turn (`{`, or `{\n  "reasoning":` for a judge) is the legacy path: only where the runtime is known to accept last-turn prefill — unknown → the default path; runtimes that dropped it reject the turn. Condition on the named runtime (P8); never ship prefill advice unconditionally. Current Anthropic API generations reject it; older ones accept it.

## Hybrid shapes

A loop whose checkpoints use one-shot extraction prompts; a workflow ending in a judge gate. Identify the **outer shape**, draft its spine first, then each inner shape on its own, then knit; audit adjacent pairs for interference (P4, check F).

## Domain axis (orthogonal to shape)

Domain modifies section *content*, not which sections exist. **Engineering**: concrete stack, revisable contracts, tooling failure modes. **Research**: source-quality rules, citations, methodology. **Writing**: voice / register / audience, exemplars, length anchors. **Ops**: safety boundaries, audit trails, rollback. **Generic**: minimal. Checks in `references/audit.md`.

## Minimum-viable scaffold

`assets/minimum-viable-prompt.yaml` — six slots in fixed order: **system, state, instructions, constraints, examples, query** — the default sequence (P2) reduced to six, `query` last as terminal projection; reorder only for a stated reason. **Use** for small, well-defined, single-purpose tasks; fill what's needed. **Don't use** for loops, chains, personas, judges or anything whose structure is load-bearing — adding slots means the task wants a real shape. Constraints five or fewer (P4); examples optional, 2–5, input plus expected output; instructions at right altitude (A).
