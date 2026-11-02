# Shape 1 — Agentic loop (long-horizon)

The shape for multi-session work driven by an agentic CLI. Interview frame: `references/shapes.md`.

**Signals.** "Help me start a project"; "I'm building [system]"; "set me up for [multi-day work]"; Claude Code / Gemini CLI for a non-trivial task; "session", "checkpoint", "memory". **Produces.** Two files: a **seed brief** (the opening message for the CLI) and a **memory file** (CLAUDE.md / GEMINI.md / AGENT.md, named per tool — check L) with standing rules + project state.

## Spine

1 Role binding · 2 Project context · 3 Loop description (human-in-the-loop, suggested-next-message contract) · 4 Stack / materials · 5 What to build · 6 Initial contracts, revisable · 7 Procedure as checkpoints, ordered by decision volatility — the decisions the user is likeliest to revise (data models, interfaces, UX flows) first, mechanical work buried · 8 Working memory (memory-file structure, re-read trigger — H) · 9 Loading context as you go (just-in-time retrieval, sub-agents) · 10 Style rules (drop if they describe model defaults) · 11 Failure modes · 12 How to talk to me · 13 Suggested-next-message contract (routine vs boundary — J) · 14 Worked example, one per mode · 15 Done definition · 16 Start here · 17 Long-horizon operators — only when the run warrants them, each traced to a real trigger (M5), placed per the Place / gate column of `references/operators.md`; a two-checkpoint task gets none.

**Profile.** Role and project context strongest (set the subspace); procedure and contracts mid; style and formatting weak.

## Trigger and stop taxonomy

Establish both in the interview (question 6) and encode them; each row changes the contract sections:

| Loop type | Trigger | Stop | Consequences |
|---|---|---|---|
| Turn-based | a user message | the agent judges the turn done, or needs input | the default contract (checkpoints, suggested next message) |
| Goal-based | a stated goal | **checkable success condition + iteration cap** | quantitative done ("all tests pass", "score ≥ t"), never "improve X"; the cap bounds the run when the goal isn't reached |
| Scheduled | a time interval | the user cancels, or the work completes | interval matched to how often the watched input changes; each firing needs a standalone-complete prompt |
| Proactive / event-driven | an external event or standing routine | per-task goal conditions; runs until disabled | composes the rows above: a schedule checks for inputs, a goal condition defines completion, verification is checks the agent runs itself |

Two cross-cutting rules: verification is *quantitative checks the agent can execute* (run the tests, measure, screenshot and inspect), never self-assessment — "never report changes complete on edit success alone"; deterministic sub-work goes to scripts.

## Interview

Ask 2–3, broadest first (universal questions in `references/shapes.md`): 1 Scope and length — hours, days, weeks; multiple sessions? · 2 Domain and stack · 3 Pre-decided architecture — decisions to lock in, or free to propose? · 4 Audience — graders, teammates, only you? (affects what is logged inline) · 5 Time budget — hard deadline? · 6 Trigger and stop — messages turn by turn, a goal condition (checkable condition and attempt cap?), a schedule (how often does the input change?), or an event? Ask whenever the request signals goal-seeking, scheduling or unattended recurrence.

## Shape-specific rules

- *Loop ceremony tax* — full ritual on every turn regardless of stakes; cured by the routine / boundary tiering (J).
- Checks H, I, Ib, J, K, L and the Verify lines: `references/audit.md`; cognitive tools per checkpoint: `references/cognitive-tools.md`; the verifier-after-each-checkpoint loop: `references/evals.md`.
