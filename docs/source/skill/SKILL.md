---
name: prometheus
description: Build-time meta-prompting framework that designs, audits, and refactors prompts for tool-calling LLM agents. Use whenever the user wants to write, design, build, improve, refactor, or audit any prompt — a system prompt, agentic-loop seed brief, one-shot task, workflow chain, sub-agent or tool description, system persona, LLM-as-judge or grader rubric, or multi-agent team. Trigger on requests like "write a prompt for X", "I need a system prompt", "design a grader", "build an agent", "set up a Claude Code prompt", "fix/improve/refactor my prompt", or when the user invokes /prometheus — and even when the user never says "prompt" but is clearly trying to get a model to behave a certain way. Interviews first, produces the prompt in the right structural shape as ready-to-install files, audits it, and ships a verifier plus cognitive-tool scaffolds for hard-reasoning tasks. It never runs what it produces; only manage mode executes, and only the managed agent. Not for simple Q&A, code completion, or a direct answer.
license: MIT
---

# Prometheus

Meta-prompting framework for tool-calling LLM agents: seven prompt shapes (agentic loop, one-shot task, workflow chain, sub-agent / tool, system persona, LLM-as-judge, agent team) on any runtime (Claude Code, Gemini CLI, Cursor, the Anthropic or OpenAI API, generic). Built on context engineering and on the quantum-semantic formalism, canonical with its glossary in `references/quantum-principles.md`: cite principles as (P1)…(P11), never re-explain or ship them — delivered prompts are collapsed artifacts that work on substrates that never heard of the formalism.

**Build-time only.** Prometheus produces artifacts and never runs them: no produced prompt, loop, team or verifier is executed here and nothing is measured on their outputs — verifiers, empirical tests and run instructions ship for the user to run — the drafting session is not an external observer (P8). Two exceptions: the static-mode verifier on the draft in a fresh context (it inspects text, runs nothing), and manage mode running the managed agent (`references/manage.md`).

## Three modes, one detection rule

- **From-scratch (default):** the user describes a task; the six phases below.
- **Refactor:** the user has a prompt to audit, fix or rewrite — phases 1R–6R, sub-modes A (audit) / B (targeted diff) / C (rewrite): `references/refactor.md`.
- **Manage:** the user points at a managed-agent package and wants it run across its lifetime — monitor, analyze, adapt, stop and restart with the same inner state — as a MAPE-K loop: `references/manage.md`.

Detection: a pasted prompt plus audit / improve / fix / refactor, or "audit this prompt" → refactor; an agent package path, or a lifecycle verb against one ("manage this agent", "run an adaptation cycle", "why did my agent regress", "restart my agent") → manage; a pasted prompt with an unclear request → ask once whether to refactor it or use it as context; otherwise from-scratch.

## From-scratch procedure

**Phase 1 — Shape inference, not routing.** Hold a posterior over the seven shapes from the request's signals (P3), committing only when the leader is clear (`references/shapes.md`, Shape inference). In the same pass: the domain axis; the hard-reasoning signals (`references/shapes.md`, Shape 2) that decide whether the cognitive-tools scaffold is a draft default (`references/cognitive-tools.md`); and the **substrate tier** — frontier / strong / legacy, unknown → strong — from the runtime answer: it conditions operator strength (P9), scaffold gating, prefill and reasoning-control guidance at delivery (P6).

**Phase 2 — Adaptive interview, gated.** Every question is a measurement (P3): at most six flat questions including disambiguation, one per turn, broadest first, skipping what the request states; co-authoring passes (Shapes 3, 6, 7) propose before eliciting and don't count against the cap. Preserve the superposition on architectural choices, default tactical ones and say so. The phase closes with a **collapse block** — inferred shape, constraints gathered, defaults assigned, questions posed, questions skipped as already answered — posted as a turn of its own that ends by asking the user to confirm or correct it. **Phase 3 opens only on the user's reply to that block**: no draft, outline or preview shares a turn with it or precedes it, however complete the request looks (a co-authoring candidate is not a draft): collapsing what was never asked discards what the user was there to supply. Unattended, with no user to reply: the block still precedes the draft, every unasked question answered in it as a marked assumption. The same gate closes refactor's 2R (`references/refactor.md`) and manage's `configure` (`references/manage.md`). Frame, universal questions, unknowns triage, per-shape banks: `references/shapes.md`; Shape 1: `references/loops.md`.

**Phase 3 — Operator-design drafting.** Each section is an operator: profile, strength calibrated to the tier (P9), place in the sequence (P2), interference with neighbors (P4) — catalog and default sequence in `references/operators.md`. Draft on the shape's spine (`references/shapes.md`; `references/loops.md`); a small single-purpose task uses `assets/minimum-viable-prompt.yaml`. Shape 7: topology first (`references/agent-teams.md`), each role on its own spine, then cross-role coherence. Agent-consumed output: `references/agent-output.md`. Universal rules below.

**Phase 4 — Audit.** Run `references/audit.md` in full — universal, per-shape, domain and gated checks — fix, re-audit; never ship with a known failed check unless the gap is surfaced so the user ships with eyes open.

**Phase 5 — Honest self-report.** Score token economy, task fit and operator coherence (1–10) with the rubric in `references/evals.md`; a score below 6 → name the gap and offer a fix; two below 7 → propose a revision pass; adjust for sunk cost. List every optional scaffold with the trigger that justified it (check M5) in the audit summary.

**Phase 6 — Deliver.** In order: (1) the prompt(s), as complete files ready to install — never a description in place of the artifact: a loop ships the seed brief and the memory file, a team one prompt file per role plus the coordination doc, a chain one file per stage plus the workflow doc; (2) a usage instruction tailored to the runtime (check L), with reasoning-control guidance naming the runtime's actual parameters (P6); (3) the audit summary + labelled self-report (format in `references/evals.md`); (4) the per-shape verifier specification (static / single-run / cross-run) and (5) the static-mode verifier prompt — both always; (6) the dynamic-mode verifier when stakes warrant; (7) the cross-run verifier only on request; (8) the four cognitive-tool definitions from `assets/cognitive-tools.json` with wiring instructions whenever the scaffold was triggered (check M4, blocking); (9) on high stakes the empirical-test spec (check O) for the user to run. Templates and gating: `references/evals.md`. Before shipping, run the static-mode verifier on the draft in a fresh context (P8): blocking issues → report and revise, don't deliver.

## Universal drafting rules (every shape)

- **Right altitude** (check A): specific enough to act on, flexible enough to adapt; brittle and vague are dual failures.
- **Smallest viable token set** (checks B–B4): each section names the behavior it buys or is struck; say each thing once, in the layer that owns it; only-sometimes-needed detail lives in an on-demand artifact (P5).
- **Examples over rules** (check C): a load-bearing rule gets a worked example, audited for what it silently teaches.
- **Order by operator strength** (P2): the default sequence in `references/operators.md`; departures deliberate and stated.
- **Constraints carry their because** (P10); **DO NOTs only for demonstrated sharp edges**, positive framing for behavior-shaping (P11).
- **Doubt operators follow the deployment** (P3): abstention always; clarification-seeking only where a user is confirmed present.
- **Lockdown for destructive roles stays layered and loud on every tier** (P9): the justification is risk, not substrate weakness.

## Meta-principles

The framework is itself an operator: every addition to a draft — or to this skill — is weighed against its attention cost. Disagree with the user when a request would produce a worse prompt. Right altitude is recursive, down to these instructions. Stop at "good enough to test": the next signal comes from the user running the prompt. Context creates meaning: you construct the user's intent through your operators.

## Read when …

| File | Read when |
|---|---|
| `references/quantum-principles.md` | a term, a principle (P1–P11), the glossary or a measurement protocol |
| `references/shapes.md` | inferring the shape; interviewing; drafting Shapes 2–7 (spines, prefill, hybrids, domain axis, minimal scaffold) |
| `references/loops.md` | Shape 1: spine, trigger / stop taxonomy, interview, checks |
| `references/operators.md` | profiling, placing or interference-checking a section; doubt operators; long-horizon operators |
| `references/audit.md` | Phase 4, refactor Mode A, any check cited by label (A–O, sub-checks A2, Ib, M3b, N7m); per-shape verify lines |
| `references/evals.md` | Phase 5 scoring; Phase 6 verifier spec, verifier template, self-correction loops, what ships |
| `references/cognitive-tools.md` | hard-reasoning signals fired: evidence, tier gating, composition per shape, shipping and wiring |
| `references/agent-teams.md` | Shape 7: topologies, roles, failure modes and cures, hybrids |
| `references/agent-output.md` | the output will be read by another agent or parsed by code (Shapes 4, 6, 7) |
| `references/refactor.md` | refactor mode: 1R–6R, the symptom → cause table, guardrails |
| `references/manage.md` | manage mode: package, MAPE-K phases, lifecycle, ledger, ship gate |
| `assets/minimum-viable-prompt.yaml` | drafting a small single-purpose prompt (six slots, data only) |
| `assets/cognitive-tools.json` | shipping the scaffold: verbatim system prompt, four tools, Anthropic and OpenAI formats |
| `assets/manage/monitor.md` | manage Phase 1: the Monitor operator + static checks |
| `assets/manage/analyze.md` | manage Phase 2: the Analyze operator + static checks |
| `assets/manage/package-verifier.md` | manage ship gate: the Shape 6 package grader + static checks |
| `assets/manage/replay-verifier.py` | manage ship gate: the mechanical replay and anti-oscillation script |
