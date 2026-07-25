# Verifier specification

When the framework delivers a prompt, it also delivers a verifier specification — a description of how to check that the prompt is behaving correctly. The verifier spec is the language-of-record for what counts as success for this prompt, separate from the prompt itself.

The spec is consumed in two ways:

1. **By a human or harness writing tests.** The spec is documentation: here's what to check on each output, here's what to look for across runs.
2. **By a Claude verifier-agent at runtime.** The spec is converted into a Shape 6 LLM-as-judge prompt that runs against the prompt's actual outputs. See `references/verifier-agent-patterns.md` for that conversion.

Both consumptions use the same spec. The spec is shape-specific, because different shapes have different correctness criteria.

## Three layers of verification

Every spec covers three layers, even when some layers are minimal:

**Static layer.** Properties of the prompt artifact itself, evaluable without running it. Section presence, schema validity, structural coherence with the shape spine. Most of this duplicates the audit checklist; the spec exposes it as a runnable check the user can re-run when modifying the prompt.

**Single-run dynamic layer.** Properties of the output on a single input. Schema compliance, constraint satisfaction, presence of required elements, absence of forbidden elements, named-failure-mode coverage.

**Cross-run dynamic layer.** Properties that emerge across many inputs. Calibration drift, distributional bias, edge-case coverage, consistency on identical inputs (the regression case).

For low-stakes prompts, the cross-run layer is often empty. For production prompts, it's often the most important.

## Per-shape specs

### Shape 1: Agentic loop

**Static.** Memory file structure present (standing rules + project state). Re-read trigger specified. Suggested-next-message contract has both modes (routine + boundary). Loop completeness — answers exist for "what does the agent do at start of turn / when context fills / when decision surfaces / what stops the loop."

**Single-run dynamic.** Each turn ends with a status update + suggested next message. Boundary handoffs include role refresher, state pointer, objective + why-now, acceptance criteria, resolutions, closing instruction. Memory file is updated at checkpoints. Decisions log entries are present for non-trivial decisions.

**Cross-run dynamic.** Across N sessions, memory file mirror stays consistent with the seed brief (no drift). Suggested-next-message tier (routine vs boundary) is applied appropriately — boundaries trigger boundary handoffs, mid-checkpoint turns produce routine continuations. The "never delegate understanding" rule holds — handoffs include specific context, not vague delegation.

### Shape 2: One-shot complex task

**Static.** Output format specified concretely (schema, examples, or structural template). Constraints addressed each named failure mode from the interview. Few-shot examples present for non-trivial tasks. Examples-as-operators audit passed (no silent judgment calls in examples).

**Single-run dynamic.** Output validates against the specified format (JSON schema, structural template, length bounds). Each named constraint is satisfied. No banned tokens or patterns appear. Edge cases the user described are handled correctly when they appear in input.

**Cross-run dynamic.** On N representative inputs, output reliability is high (% schema-valid, % constraint-satisfying). On adversarial inputs, the prompt fails gracefully rather than producing confident-but-wrong output. On inputs near the user's named failure modes, the prompt handles them correctly more often than chance.

### Shape 3: Workflow / chain

**Static.** Each stage has its own input contract and output schema. Schemas align — stage N's output schema matches what stage N+1 expects. Failure handling is specified per stage. Gates between stages have defined pass/fail criteria.

**Single-run dynamic.** Each stage's output validates against its schema. Gates correctly route on success/failure. Failure-handling protocol triggers when expected. End-to-end output meets the workflow's stated done criteria.

**Cross-run dynamic.** Stage-level reliability across N inputs. Cumulative reliability (does the chain compound errors?). Information preservation across stages — does information needed by stage N actually survive stages 1 through N-1?

### Shape 4: Sub-agent / tool prompt

**Static.** Single-line purpose distinct from sibling tools. Parameters typed and exemplified. Side effects stated. Error modes documented. Output format suitable for agent consumption (greppable, aggregate-first, structured) per `agent-consumability.md`.

**Single-run dynamic.** Output is parseable in the documented format. Side effects match what's stated. Error cases produce the documented error format. The tool's output enables the parent agent to make its next decision without needing to re-derive aggregates.

**Cross-run dynamic.** Across N invocations, the tool's behavior is consistent. State changes reported in output match actual state changes (visible state transitions principle). The tool's purpose remains distinct from sibling tools — the parent agent doesn't develop ambiguity about which tool to use.

### Shape 5: System persona

**Static.** Identity stable. Refusal patterns explicit. Drift resistance designed in. For category-based personas, threshold definitions concrete and precedence rules for collisions explicit. For personas with destructive capability, layered lockdown present (structural + prose, repetition, explanation).

**Single-run dynamic.** Persona presents consistently within a single conversation. Refusal patterns trigger correctly under user pressure. Category boundaries hold (strict-category items get strict treatment; lenient-category items get lenient). Capability lockdown holds (read-only roles don't write, even via loophole tools).

**Cross-run dynamic.** Across N conversations, persona stability holds — same role, same tone, same boundaries. Drift resistance works under sustained pressure (long conversations don't degrade the persona). Refusal patterns hold against adversarial inputs (jailbreak resistance).

### Shape 6: LLM-as-judge

**Static.** Bias controls present (length, position, persona). Calibration anchors at each score level — or fewer with explicit interpolation guidance. Reasoning forced before scoring. Rubric specified concretely; per-score-level descriptions distinguishable from each other.

**Single-run dynamic.** Output is structured (parseable scores + reasoning per dimension). Reasoning fields are non-empty and reference the rubric. Scores are within the specified range. Reasoning aligns with scores — high scores have positive reasoning, low scores have specific named flaws.

**Cross-run dynamic.** Calibration holds — known-good outputs score high, known-bad outputs score low, calibration anchors land at their target scores. Bias controls work — length-controlled pairs of similar-quality outputs score similarly regardless of length. Inter-run consistency at temperature 0 is high (same input → same score). Drift over time is detectable and addressable.

This is the shape where cross-run verification matters most — the judge IS the verifier for upstream agents, and Goodhart applies if the judge drifts.

### Shape 7: Agent team

**Static.** Topology fits the task. Per-role static checks (each role's prompt audited per its individual shape). Interface contracts align (worker output schemas match orchestrator's expectations). Capability lockdown consistent across roles. Failure handling specified.

**Single-run dynamic, per role.** Each role's individual shape's single-run dynamic checks apply to its prompt's outputs. Plus: orchestrator delegates with specific context (the never-delegate-understanding rule). Workers respect scope lockdown. Interface contracts hold (orchestrator can parse worker outputs).

**Single-run dynamic, cross-role.** End-to-end team output meets the team's done criteria. State transitions are visible across role boundaries. Failure handling triggers correctly when individual roles fail.

**Cross-run dynamic.** Topology choice was correct — does the team behave coherently across N inputs, or does it degenerate? Worker scope leakage detection (do workers stay in scope across runs?). Synthesis quality (does the orchestrator/synthesizer produce coherent integration, or does synthesis collapse occur?). For evaluator-optimizer sub-topologies: convergence rate, regression rate, Goodhart detection.

This is the shape where cross-run verification is most expensive but most valuable — multi-agent teams have the most failure modes, and many of them only show up across runs.

## Manage-mode: package verifier

Manage mode (`references/manage-mode.md`) adds one verifier class that checks a **managed-agent package** rather than a single prompt. It is the ship gate for an adaptation and is invoked by Execute's re-audit and as the `reaudit_pass` precondition. Two layers:

**Static (mechanical, `manage/replay-verifier.py`).** I4c replay: `history/v001` + the ordered ledger diffs reproduce `prompt/current/` byte-identically. I4b anti-oscillation: no proposed option equals one whose backfilled outcome was regression against the same trigger (equivalence = trigger + section + intent, not diff identity). Rollback restores a snapshot, never an inverse diff. Byte-exact, deterministic — a judgment-free check.

**Static (judged, `manage/manage-mode-verifier.md`, Shape 6).** I2 seam: the managed prompt contains no self-modification instructions and names `memory/` as its only in-run mutable state. I3 persistence: `activate` is satisfiable from the package alone — no out-of-package resume dependency. I4a write-ahead: every adapt entry precedes its diff, every `history/` snapshot has a ledger entry. The grader delegates the mechanical checks above to the replay verifier and marks I4bc UNVERIFIED (blocking) if the replay report is absent. Evidence precedes every verdict (Check N); output is greppable and aggregate-first for the manager to consume.

A package ships an adaptation only when the mechanical layer is `REPLAY PASS` and the judged layer returns `VERDICT: SHIP`.

## What the verifier spec does NOT cover

Three things explicitly out of scope:

- **The substantive correctness of the underlying task.** The verifier checks that the empathy score is within range, has reasoning, and aligns with the rubric. It does not check whether the rubric is the right one for empathy — that's a question for the user, not the framework.
- **Runtime infrastructure.** How tests are actually executed (pytest, custom harness, manual review) is the user's choice. The spec describes what to check, not how to run the checks.
- **Statistical guarantees.** The spec describes properties to verify; it does not promise statistical bounds on those properties holding. Empirical verification is the user's responsibility.

## Verifier spec as a cross-check on prompt design

A useful diagnostic: if you're drafting a prompt and the verifier spec for it looks sparse — fewer than 5 single-run checks, no cross-run checks worth running — that's a signal the prompt may be under-specified. Either the prompt is genuinely simple (fine) or the user hasn't named enough about what "correct behavior" looks like (a gap to surface during the interview, not at delivery time).

The reverse is also useful: if the verifier spec is so dense that running it would cost more than the prompt itself, the prompt may be over-engineered. Match verifier weight to the stakes of the prompt.
