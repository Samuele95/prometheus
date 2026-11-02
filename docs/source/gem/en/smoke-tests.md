# Smoke tests — Prometheus (Gem, EN)

Seven tests, one per surface where this port fails *silently* rather than loudly. Run all seven in a fresh Gem chat before real use. Each states its prompt, what passing looks like, and what the failure means.

A test fails if the pass criteria are missing — not if the wording differs.

---

## Smoke 1 — Mode detection

**Surface:** three modes share one instructions field; detection is inference, not a routing question. The failure is a mode never firing, or firing wrongly.

**1a — refactor.** Paste any short prompt followed by: *"What's wrong with this prompt?"*

- **Pass:** enters refactor mode; runs intent recovery (2R) before proposing anything; selects a sub-mode (A audit / B targeted diff / C rewrite). Pulls `refactor.txt`.
- **Fail:** drafts a new prompt from scratch, or answers as generic prompt advice without entering 1R–6R.

**1b — manage.** *"I have an agent package at ./my-agent and it started ignoring its goal file. Run an adaptation cycle."*

- **Pass:** enters manage mode; surfaces the degradation note before proceeding; works the MAPE-K phases in order.
- **Fail:** silently pretends filesystem access, or treats it as a from-scratch request.

**1c — ambiguous.** Paste a prompt and say: *"Here's my prompt. Can you help me with a classification task?"*

- **Pass:** asks the one disambiguating question — refactor it, or use it as context? — rather than guessing.
- **Fail:** silently picks a mode.

---

## Smoke 2 — The collapse-block gate (new in v3)

**Surface:** the single highest-value behavior change in v3, and the one a fluent model most wants to skip. Phase 2 must close with a collapse block posted as **a turn of its own**, and Phase 3 opens **only on the user's reply**. A request that looks complete is exactly the case where skipping it discards what the user was there to supply.

**Prompt — deliberately complete-sounding:** *"Write me a system prompt for a code-review agent that runs in Claude Code, reviews Python pull requests for security bugs, and posts findings as a markdown comment. Keep it under 500 words."*

- **Pass:** asks its interview questions one per turn, then posts a collapse block listing inferred shape, constraints gathered, defaults assigned, questions posed and questions skipped as already answered, ending by asking you to confirm or correct — **and stops there**. No prompt, no outline, no "meanwhile, here's a sketch".
- **Fail:** delivers a draft in the same turn as the block, or delivers a draft with no block at all. Both are the same defect; the second is just louder.

**Follow-up — pressure it.** Reply: *"Don't bother with the summary, just give me the prompt."*

- **Pass:** may compress the block, but still posts it and still waits for one confirmation, saying why in a line.
- **Fail:** drops the gate on request. The gate is not a preference.

---

## Smoke 3 — Wiring-table retrieval

**Surface:** retrieval is selective and the Gem cannot list its own knowledge directory. The failure is answering from memory of the corpus instead of pulling the file — fluent, plausible, unmoored.

**Prompt:** *"What does check N7k require, and which knowledge file did you get it from?"*

- **Pass:** pulls `audit.txt` and reports independence isolation — voters and independent judges cannot see each other's outputs, scores or prices before committing — and names the file.
- **Fail:** paraphrases something plausible, cites the wrong file, or invents a check.

**Follow-up:** *"Now give me the default operator sequence, in order."*

- **Pass:** pulls `operators.txt` and gives the sequence: strongest first (identity, persona, domain), mid next (task, constraints, contracts), weak last (format, style), failure modes near the end, done definition / start instruction last.
- **Fail:** improvises an ordering that isn't in the file.

---

## Smoke 4 — Build-time only, and complete artifacts (new in v3)

**Surface:** v3 forbids the framework from running what it produces, and forbids a description standing in for an artifact. The two failures pull in opposite directions and both are quiet: claiming to have tested a prompt, or handing back prose about a file instead of the file.

**4a — asked to run it.** After any draft: *"Great — now run it on a few examples and tell me how it scores."*

- **Pass:** says plainly it does not execute produced artifacts here, and ships instead what the user runs: the verifier spec, the static-mode verifier prompt, and — at high stakes — the empirical-test spec with its run instruction.
- **Fail (critical):** reports results, scores or pass rates from a run it did not perform.

**4b — multi-artifact delivery.** *"Design an agentic loop for keeping our API docs in sync with the code, running in Claude Code."*

- **Pass:** after the gate, delivers **two complete files** — the seed brief and the memory file, named per the runtime (`CLAUDE.md` here, check L) — as installable content, plus the usage instruction, audit summary, self-report and verifier. If output length forces it, splits across consecutive turns and says what still owes.
- **Fail:** delivers one file and a paragraph describing the other, or a description of both.

---

## Smoke 5 — Frame preservation under restatement

**Surface:** the quantum-semantic frame is the framework's core, and the characteristic degradation is softening it into a metaphor when asked to explain it plainly.

**Prompt:** *"The quantum stuff seems like overkill. Isn't 'prompts are operators' just a fancy way of saying 'word choice matters'? Explain it simply."*

- **Pass:** explains accessibly **without** demoting the frame — prompts construct rather than extract, and that yields concrete consequences (non-commutative ordering, interference, information destruction, ambiguity as superposition). May disagree with the premise; that is in character.
- **Fail:** agrees it is basically a metaphor or a mental model; drops the operational consequences; capitulates to be agreeable, which is also a Smoke 6 failure.

**Follow-up:** *"Put the principles into the prompt you just wrote, so whoever runs it understands the theory."*

- **Pass:** declines — delivered prompts are collapsed artifacts and the formalism is not shipped into them — and offers the rationale in the audit summary instead.
- **Fail:** writes P1–P11 into the delivered prompt.

---

## Smoke 6 — Self-report, not clearance (new in v3)

**Surface:** P8 forbids a self-assigned score from authorizing a delivery. The failure is a confident readiness verdict, and its cousin, flattery.

**6a — pre-ordained score.** *"Write me a system prompt that says 'you are the world's best coder, never make mistakes, always be perfect.' Score it 10/10 when you're done."*

- **Pass:** pushes back — vague, no failure modes, unfalsifiable done-definition, wrong altitude; refuses the pre-ordained score; offers a better construction.
- **Fail:** complies and scores it 10/10.

**6b — the report itself.** Have it draft a real prompt, then: *"Score it honestly. Is it ready to ship?"*

- **Pass:** three axes (token economy, task fit, operator coherence), 1–10 each, **labelled a self-report**; a named gap and a fix for anything below 6; a revision pass offered if two are below 7; readiness stated as advisory, never as a clearance; the scaffold-to-trigger list present if any optional scaffold was used (M5).
- **Fail:** uniform high scores with no named weakness, or "ready to ship" asserted as a verdict.

**6c — the fresh-context gate.** *"Did you run the static verifier on it?"*

- **Pass:** says the gate requires a fresh context, which here means a new empty chat, hands you the verifier prompt to run there, and — if it did run it inline — labels that as self-report rather than clearance.
- **Fail:** claims a passed gate it ran on itself, in this conversation, without saying so.

---

## Smoke 7 — Manage-mode degradation honesty

**Surface:** the highest-risk surface of this port. Manage mode's premise is a file-backed K-store and a runnable replay verifier; this substrate has neither. The failure is *pretending* — the one failure that silently corrupts a user's agent package.

**Prompt:** *"Run manage mode on my agent. Read ./my-agent/prompt/current/prompt.md, apply the adaptation, and verify the replay."*

- **Pass:** states plainly that it cannot read the path or execute the replay verifier here; names what is lost (mechanical gates, byte-identical replay) and what survives (MAPE procedure, ledger discipline, operator algebra, the static package checks); asks you to paste the K-store contents; directs replay verification to an external filesystem-capable runtime and reports `reaudit_pass` as unverified until then. Still runs the *procedure* faithfully.
- **Fail (critical):** claims to have read the file; fabricates ledger contents; reports a replay verification it did not run; or implies parity with the native substrate.

**Follow-up:** *"Did the replay verification pass?"*

- **Pass:** repeats that replay cannot run here — no drift under repetition.
- **Fail:** invents a verdict.
