# Refactor mode

The user has a prompt and wants it audited, fixed or rewritten. Six phases 1R–6R, not interchangeable with the from-scratch phases. Checklist: `references/audit.md` (findings on a user-supplied prompt are candidates for review). Scoring: `references/evals.md`. Manage mode reschedules this as its Plan phase (`references/manage.md`). Runs unchanged against the framework's own earlier outputs.

## Three sub-modes

**A — Audit:** findings with severity and remediation, three-axis scores, no edits; near-zero risk. **B — Targeted:** a named symptom localized to its operator-level cause, a small diff; low risk. **C — Rewrite:** intent recovered, a new version by the from-scratch procedure, both versions with diff and tradeoffs; real risk — every rewrite trades off things the user may not have wanted, and the framework optimizes against its own criteria. Default to the less invasive mode.

## 1R — Receive and parse

Diagnostic, not corrective: **apparent shape** (structural signals — multi-stage → 3; schema with examples → 2; "expert grader" → 6; ambiguous → disambiguate in 2R); **operators present** (per section, `references/operators.md`; which do work, which decorate); **operators absent** (what the spine should have — a judge without anchors, an extraction prompt without abstention); **ambiguities** (undefined terms, assumed conventions, formats without examples).

## 2R — Intent recovery (three questions, capped) and the gate

Most context is on paper. (1) **What is this prompt for?** — to check the framework's read. (2) **What symptom, if any?** — hallucinations, inconsistency, format violations, drift, or a general audit. (3) **What is off-limits?** — required voice, downstream parsers, compliance, chain integration: prompts carry constraints the text can't show, and a rewrite without them is worse than useless. Close with the **collapse block** (SKILL.md, Phase 2) — intent as read, symptom, off-limits, proposed mode — and wait for the user's reply before 3R.

## 3R — Mode selection

No symptom + audit request → **A**. A localizable symptom → **B**. An explicit rewrite request, or a symptom that can't be localized → **C**, after confirmation: "I can rewrite this to address [concerns], but rewrites carry real risk — the new version will make tradeoffs you may not want, and I optimize against my own criteria, not your constraints. A targeted fix is usually safer. Rewrite, or targeted first?"

## 4R — Apply the mode

**Mode A.** Run the checklist. Per finding: **what** (the check), **where**, **severity** — *blocking* (structural, will produce visible failures), *significant* (known soft spot), *minor* (not worth the user's time unless already iterating) — **why it matters** in production, **fix** (surgical). Group by severity, blocking first, minor last. Run M2; weak readiness on a production prompt is a separate concern. A report only; applying fixes is B or C.

**Mode B.** Localize with this table as the diagnostic spine; for unlisted symptoms fall back to first principles — which operator would the model have needed, and is it present, weak or missing?

| Symptom | Likely operator-level cause |
|---|---|
| Hallucinates specifics | missing abstention; weak constraints; confident-but-wrong examples |
| Inconsistent at the most deterministic setting | weak output format; ambiguous examples; competing constraints |
| Too long | redundant sections; preemptive edge cases; generic warnings; role binding longer than needed |
| Misses obvious cases | missing or unrepresentative examples; ordering buries context |
| Misclassifies edge cases | weak failure-mode bullets; examples don't cover them |
| Format violations | vague schema; format placed too early; format not conditioned on the runtime (`references/shapes.md`, Structured output and prefill) |
| Persona drifts | no identity reinforcement; weak refusals; identity at start only |
| Workers overlap (Shape 7) | weak scope lockdown; weak contracts; vague dispatches |
| Calibration collapse (Shape 6) | anchors missing at intermediate levels or too similar; reasoning after the score |
| Output contradicts stated rules | destructive constraint stacking; rule buried mid-prompt |
| Authored for a weaker model, now over-triggers tools, over-structures, ignores its own defaults | over-specification: operators that corrected a failure the substrate no longer has now over-project (P9) — treatment is **subtractive**: strike-and-test, starting with intensity language ("CRITICAL/MUST use…" → "Use… when…") and enumerated lists replaceable by one general instruction |

Per cause, one edit: **type** (add / modify / reorder / remove), **diff** (before and after), **rationale** (one sentence). Above ~20% of the prompt's length the framework has drifted into C — pause and ask.

**Mode C.** (1) Recover intent fully — at most 3 questions beyond 2R; not enough → too far from understanding to rewrite safely. (2) Draft with the from-scratch procedure, intent as task description. (3) Compare explicitly — what changed and why, what the original had that the rewrite drops, what couldn't be preserved. (4) Tradeoffs per significant change ("more concise, but drops the example for edge case X — if that case matters, this edit is wrong"). (5) Present both versions, never replace silently. A 2R constraint that can't be honored → stop and say so: "I can't preserve [constraint] — what you have works around it in a way I can't replicate without more context. Targeted refactor instead?"

## 5R — Honest evaluation

**A:** the findings are the evaluation. **B:** does the diff address the symptom (pass / partial / no); does it add interference or ordering issues (relevant checks on the patched prompt); is it minimal — touches only what is needed, and if more, narrowed? **C:** score original and rewrite on the three axes; a rewrite worse on any axis is surfaced prominently, never shipped silently.

## 6R — Deliver

**A:** the report, by severity. **B:** original, diff per section, rationale per edit, the evaluation; optionally a patched copy. **C:** both prompts side by side, tradeoff analysis, scores for both, an explicit "what the rewrite drops or changes" callout, and the full delivery treatment of a from-scratch prompt (verifier spec and static verifier). The original is always preserved in the output: the framework never deletes the user's work, it proposes changes alongside it.

## Guardrails

Never rewrite silently: asked for an audit, produce an audit, don't drift into rewriting. Never claim the rewrite is unambiguously better. Never refactor on preference disguised as principle — the checklist's criteria are findings, "I'd write this differently" is not. Refuse when intent recovery fails: "I'm not confident enough about what this prompt does to change it safely — one example of an input and its expected output?" Off-limits is a hard constraint: no edits there, even where the framework thinks it could improve it.
