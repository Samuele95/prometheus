# Audit checklist

Run every draft through this checklist after drafting: fix any failure, re-audit; ship clean, or per Failure handling with the gap surfaced. Checks are structural and behavioral, never stylistic; one line each, cited by label — a letter, sub-checks a suffix (Ib, M3b, N7m); `I1`…`I9` are manage-mode invariants (`references/manage.md`), never a check. **[trigger: …]** marks a check that runs only when the trigger holds. Each shape section ends with its **Verify** lines — what a verifier looks at on one output and across many; with the shape's checks as the static layer they are the verifier specification `references/evals.md` ships.

## Indice

- Trust by mode
- Universal checks
- Shapes 1–7 (checks + Verify lines)
- Domain checks
- Gated checks
- Failure handling

## Trust by mode

On a from-scratch draft every section is deliberate and failures block until fixed or surfaced (Failure handling). On a user-supplied prompt (`references/refactor.md`) the framework can't tell deliberate from accidental, or weakness from load-bearing: same checks, findings reported as *candidates for the user's review*.

## Universal checks (every prompt)

- **A. Right altitude.** Each directive is too brittle (hardcoded branching, exhaustive edge cases, exact scripts — the model sticks when reality differs), too vague (goals without concrete signals — the model picks something obvious) or right (specific enough to act on, flexible enough to adapt); move the first two, asking the user when context is missing.
- **A2. Delegation rung.** Per directive, delegate the *approach* (material and outcome), the *procedure* (the model sequences it) or the *timing* (the model schedules it) — never default to maximum specification; frontier one rung higher than legacy (P9).
- **A3. Context over constraint.** At every rung say who the work is for, when it is needed and what it accomplishes — context lets the model decide where the author didn't anticipate; a rule list only says what not to do.
- **B. Smallest viable token set.** Every section names the failure mode it addresses or the behavior it buys; unclear → strike (P5).
- **B2. Common waste.** Strike preemptive edge cases (imagined, never observed), generic warnings the model already follows, unchecked stylistic preferences, redundancy with other sections.
- **B3. One layer owns each thing.** The prompt is one layer of a context assembly (system prompt, tool descriptions, memory files, skills): say each thing once in the layer that owns it (tool usage in the tool description, repo gotchas in the memory file), the others point.
- **B4. Progressive disclosure.** Where the runtime loads context selectively, only-sometimes-needed detail lives in an on-demand artifact; the always-loaded core stays light and names where the detail lives — smallest-viable applies *at each moment* (P5).
- **C. Examples where rules are load-bearing.** Every rule central to the behavior has a worked example; when in doubt, write the example before the rule.
- **C2. Required coverage.** Output format → one full example; few-shot → 2–5 examples spanning the difficulty range; loops → one worked example per mode (routine, boundary); judges → N6b.
- **C3. Examples are operators.** All example-shaped material (worked examples, anchors, anti-examples, inline illustrations, schema examples) amplifies what it demonstrates, silent judgment calls included: ask what each teaches beyond the intent — unexplained judgment calls (an optional field silently left empty; an anchor naming a quality the model can't tell from its near-neighbors), unstated reasoning (show it, or pick a less ambiguous case), coverage of the named failure modes, consistency (two examples deciding similar cases differently confuse the model — one convention throughout).
- **C4. Named failure modes covered.** Every failure mode the user named appears in rules, examples, anchors or anti-examples — walk each.
- **C5. Clean cases only.** An example or anchor with a silent judgment call you can't or won't explain is replaced by a less ambiguous case — examples that teach wrong patterns are worse than none; the model trusts them.
- **D. Operator profile complete.** Per section: what it amplifies, suppresses, mixes, and its strength; no profile → decoration, strike; same profile twice → merge (P1; `references/operators.md`).
- **E. Ordering.** Default sequence of `references/operators.md`: strongest first (identity, persona, domain), mid next (task, constraints, contracts), weak last (format, style), failure modes near the end, done definition / start instruction last (P2).
- **E2. Swap test.** Swap adjacent sections mentally: if behavior changes, the pair doesn't commute and the current order must be the deliberately better one.
- **E3. Structure is mechanistic.** Headers, named sections, consistent ordering — structured input is what the three-stage attention circuit exploits (symbol abstraction → symbolic induction → retrieval; Yang et al., ICML 2025), and arbitrary ordering makes the model recover the structure itself.
- **F. Interference.** For every adjacent pair likely to interact (multiple personas, persona + tone, "concise" + "show your reasoning", "concise" + "thorough", refusal + warm tone, persona + format, multi-domain) confirm the intended emergent behavior, not cancellation or mode collapse; unexamined → examine; destructive → restructure or merge (P4; `references/operators.md`).
- **G. Information preservation.** Critical context loaded early so it survives projections; what should stay ambiguous is flagged ("two readings are plausible — resolve at runtime"), not pre-collapsed; in chains each stage's output keeps what downstream needs (P3, P5).
- **L. Tool / runtime consistency.** Memory file named per tool (CLAUDE.md, GEMINI.md, …; generic → AGENT.md plus a rename note); tool-specific features only where relevant; the output filename instruction at delivery matches the tool, and the usage instruction matches the runtime (CLI: memory file and where the brief goes; one-shot: system or user message; judge: calibration and few-shot needs).
- **M. Measurement-aware.** On whichever parameters the runtime exposes (P6): where sampling knobs exist, above 0 the prompt must be robust to sampling, not only the mode; where 0 is recommended (production extraction, judges) the strongest operators do the work, ideation typically > 0; other levers, same questions. Dependence on the parameter is examined and documented.
- **M3. Abstention present.** Factual or judgmental output (Shapes 2, 4, 6) carries explicit, concrete permission to abstain ("return null", "return 'inconclusive' with reasoning"); "be honest" does not count (`references/operators.md`).
- **M3b. Clarification matches the deployment.** Unattended (pipeline, batch, called by another agent; a package's `deployment` field) → FAIL if the prompt tells the agent to ask a user — a question into a non-interactive context is malformed output; interactive + clarification requested → the operator present with the bounded self-check; interactive + best-call-and-flag → abstention only (P3).
- **M3c. Self-check complete.** [trigger: clarification-seeking present] After each answer the agent judges the fork resolved (→ proceed, no redundant confirmation) or not (→ one targeted follow-up); a bound of about two rounds, then abstention; the fallback is wired — FAIL without the bound (interrogation) or the fallback (stalling).
- **M6. Reasoning-channel separation.** Instructions to echo, transcribe or reveal internal reasoning as response text ("show your thinking", "explain what you were thinking when…") are a defect — a refusal category on some runtimes, an unreliable conflation of channels on all; replace with a task-mandated justification field (a judge's `reasoning` before the score, a reviewer arguing findings, an abstention stating why) or the runtime's sanctioned channel (thinking blocks, tool inputs, a send-to-user tool). Extra force on Shape 1 briefs, Shape 5 personas and every user prompt in refactor mode.

## Shape 1 — agentic loop

- **H. Long-horizon support.** Memory file named per tool (L) with its structure (standing rules + project state); re-read trigger (start of every checkpoint + a circuit breaker after N tool calls); todo usage (parent per checkpoint, sub-todos per step); tool-output disposal (summarize and discard) — anything missing means no resistance to context rot.
- **I. Loop completeness.** Trace the loop; the prompt answers: what the agent does at the start of a turn, what survives compaction, what it does when context fills mid-checkpoint, when a hard decision surfaces, what stops the loop.
- **Ib. Deterministic stop.** Goal-seeking loops carry a checkable success condition (quantitative where possible; "improve X" never terminates) and an iteration cap; scheduled or event loops poll no faster than the watched input changes (`references/loops.md`).
- **J. Tiered ceremony.** The suggested-next-message contract has routine continuation for mid-checkpoint turns and boundary handoff for checkpoint boundaries and decision-resolved turns, with the picking test ("would I send this fresh tomorrow expecting it to steer the next iteration on its own?"); without tiering the loop taxes every turn equally.
- **K. Self-similar handoffs (homoiconicity).** The brief tells the agent to treat itself as the template for boundary handoffs ("treat this brief as the template — boundary-handoff messages share its spine at iteration scale"); without it handoffs drift structurally.
- Also: M3b/M3c, M6 (extra force), M5 per long-horizon operator.
- **Verify.** *Single run:* each turn ends with status + suggested next message; boundary handoffs carry role refresher, state pointer, objective + why-now, acceptance criteria, resolutions, closing instruction; memory updated at checkpoints; decisions logged. *Cross-run:* memory consistent with the brief; tiers applied correctly; handoffs carry specific context.

## Shape 2 — one-shot task

- M3 (critical on extraction and judgment), C2 (full output example; few-shot for non-trivial tasks), E (format may lead when dominant; phrasing per runtime in `references/shapes.md`, Structured output and prefill), M4 when the scaffold was triggered.
- **Verify.** *Single run:* output validates; constraints satisfied; no banned patterns; described edge cases handled. *Cross-run:* % valid on N inputs; graceful failure on adversarial inputs; above-chance handling near the named failure modes.

## Shape 3 — workflow / chain

- G acutely: information lost at stage 1 cannot be recovered at stage 5 (P5); per-stage schemas, gate criteria and failure handling per the spine in `references/shapes.md`.
- **Verify.** *Single run:* each stage validates; gates route correctly; failure handling triggers; end-to-end output meets the done criteria. *Cross-run:* per-stage and cumulative reliability; information needed by stage N survives 1…N−1.

## Shape 4 — sub-agent / tool

- **N4. Tool discipline.** Single-line purpose distinct from siblings; parameters typed and exemplified; side effects and error modes stated; output agent-consumable (`references/agent-output.md`); M3 present — a silently guessing tool corrupts the parent's decisions.
- **Verify.** *Single run:* output parseable as documented; side effects and errors as documented; the parent decides next without re-deriving aggregates. *Cross-run:* consistent behavior; reported state changes match actual; purpose distinct from siblings.

## Shape 5 — system persona

- **N5. Persona stability.** Identity stable; refusal patterns explicit; drift resistance designed in (`references/shapes.md`, Shape 5); M3b/M3c apply, M6 with extra force.
- **N5b. Layered lockdown.** [trigger: destructive capability] All four layers of `references/shapes.md`, Shape 5, present on every tier (P9, P11).
- **Verify.** *Single run:* persona consistent; refusals hold under pressure; category precedence holds; lockdown holds, loophole tools included. *Cross-run:* stability across N conversations and sustained pressure; refusals hold against adversarial inputs.

## Shape 6 — LLM-as-judge

- **N6. Bias controls** present: length, position, persona.
- **N6b. Calibration anchors** at each score level — or fewer (typically endpoints and midpoint on a 1–5 scale) with explicit interpolation guidance, defensible for token economy on continuous-feeling dimensions; anchor-at-every-level is the conservative default.
- **N6c. Reasoning before scoring**, never after.
- **N6d. The rubric is the optimization target.** Upstream agents optimize toward it: a misspecified rubric yields sharply optimized wrong outputs, not noisy scores — anchors and bias controls are load-bearing, not polish; with a known-good reference, structure it as differential comparison ("compare against the reference, flag deviations, score severity"), more reliable than absolute anchor calibration.
- Also: M3 (the judge abstains with reasoning when the input can't be scored).
- **Verify.** *Single run:* structured output (score + reasoning per dimension); reasoning rubric-referenced; scores in range, aligned with the reasoning. *Cross-run:* known-good high, known-bad low, anchors at target; length-controlled pairs alike; consistency on identical inputs at the most deterministic setting; drift detectable. Cross-run matters most here: the judge is the verifier for upstream agents.

## Shape 7 — agent team

- **N7. Topology fits** — the simplest that fits, never the one that sounds sophisticated (`references/agent-teams.md`).
- **N7a. Specific delegation.** Every dispatch carries the *what specifically* (paths, exact criteria, expected output), never "based on your findings"; the orchestrator synthesizes, not the worker.
- **N7b. No destructive overlap.** Two workers plausibly handling the same input → the decomposition or topology is wrong.
- **N7c. Scope lockdown.** Each worker says "you do not work on X; that is another agent's responsibility".
- **N7d. Destructive roles** pass N5b, per role.
- **N7e. Contracts align.** Every schema field the orchestrator references is one the worker produces.
- **N7f. Agent-consumable output** from workers (`references/agent-output.md`).
- **N7g. Lockdown consistent.** What the orchestrator believes about a worker's capability, the worker's prompt enforces.
- **N7h. Failure handling specified** — retry, fallback, partial results — in the orchestrator's prompt.
- **N7i. Context differentiation.** Agents meant to diverge don't share near-identical prompts; the differentiating angle, role or seed is *in the prompts*.
- **N7j. Unique-information elicitation.** Where evidence is distributed, agents surface what others don't have and the synthesizer or discussion protocol elicits unshared evidence and standing dissent before converging.
- **N7k. Independence isolation.** Voters and independent judges cannot see each other's outputs, scores or prices before committing.
- **N7l. Epistemic vigilance.** Agents consuming peer reports carry a verification norm (discount unverifiable *or interested* testimony) or an arbiter / referee role.
- **N7m. Mutual awareness.** Co-tenants know the others exist, what each owns and how conflicts resolve (`references/agent-teams.md`).
- **Verify.** *Single run, per role:* its shape's lines, plus specific dispatches, scope respected, contracts parse. *Cross-role:* team output meets the done criteria; state transitions visible; failure handling triggers. *Cross-run:* coherence across N inputs; scope leakage; synthesis quality; for evaluator-optimizer sub-topologies convergence, regression and Goodhart rates. Verifiers expand per role plus a cross-role contract verifier (`references/evals.md`).

## Domain checks (orthogonal to shape; `references/shapes.md`, Domain axis)

- **Engineering.** Stack versions concrete; stack-specific failure modes; contracts revisable.
- **Research.** Source-quality rules; citation format; synthesis target concrete.
- **Writing.** Voice / register concrete with one exemplar; outline initialized; length anchor.
- **Ops.** Safety boundaries explicit; destructive actions require approval; audit trail specified.

## Gated checks (production, scaffolds, high stakes)

- **M2. Verifier-readiness.** [trigger: production use; soft otherwise] Parseable output (structured, schema-validated or consistently structured prose — freeform makes the verifier extract claims itself); each named failure mode checkable from the output; externally checkable constraints ("do not fabricate citations", not "be helpful"); visible state transitions for loops and teams — weak hooks flagged so the user ships knowing verification will be expensive.
- **M4. Cognitive-tools delivery complete — BLOCKING.** [trigger: the scaffold fired in Phase 1] Everything the Delivery bullet of `references/cognitive-tools.md` requires is present and wired as its Wiring bullet prescribes for the runtime (`assets/cognitive-tools.json`); missing → don't ship: complete it, or, if the scaffold fired in error (compliance, not hard reasoning), remove the framing so the prompt never references tools it doesn't ship.
- **M5. Scaffold restraint.** [trigger: any optional scaffold; runs at Phase 5] Each optional scaffold names its trigger, citing the interview answer that fired it — cognitive tools → the two-or-more signals (on frontier, the reported failure or request); dynamic / cross-run verifiers → stated stakes, scale or an explicit request; clarification + self-check → the confirmed interactive deployment; enumeration, trace structure, identity reinforcement, lockdown layers → the stated risk or shape requirement. Test: "would an engineer hand-writing this include it — or is it here because the framework offers it?" ("it might help" and "best practice" are not triggers, they are preemptive complexity with better branding). Both directions: no untriggered scaffolds, no stripped essentials — the discipline is trigger-traceability, not smallness. The list ships in the audit summary.
- **O. Empirical tests — shipped, never run here.** [trigger: high-stakes or production prompt] A spec with a run instruction: the interference test (section pairs separately and combined, confirm the intended emergent behavior, P4) and, where ordering is in question, the permutation test v2 as `references/quantum-principles.md`, Measurement protocols, defines it (P2, P7). The user runs them (SKILL.md, Build-time only).

## Failure handling

Fixable without user input → fix and re-audit; needs user input → one specific question; significant rework → fix, re-audit the affected sections. Never ship with a known failed check — fix it, or surface the gap so the user ships with eyes open.
