# Citations & Attribution

Prometheus is a synthesis. Its architecture is original, but nearly every
technique in it was absorbed from, adapted from, or sharpened against published
work. This file lists **every source used**, what was taken from it, and how it
was treated — absorbed, adapted, evaluated-and-partially-used, or
evaluated-and-rejected. Where a source was rejected, the reason is stated, because
the rejections are as load-bearing as the adoptions: the framework's discipline is
to use only techniques with measurable consequences.

arXiv identifiers and titles below were verified against primary sources. Author
lists are reproduced as published.

---

## Source index (quick reference)

Full annotated entries follow in sections A–E. Disposition legend: **absorbed** =
incorporated; **partial** = evaluated, some elements used; **evaluated** =
considered, not ported; **rejected** = examined and declined.

| Source | Kind | Primary anchor | Disposition |
|---|---|---|---|
| Effective context engineering for AI agents | Anthropic | anthropic.com | absorbed |
| Building Effective AI Agents | Anthropic | anthropic.com | absorbed |
| Best practices for prompt engineering | Anthropic | claude.com/blog | absorbed |
| Building a C compiler with parallel Claudes | Anthropic Eng. (Carlini) | anthropic.com/engineering | absorbed |
| Claude prompting best practices | Anthropic docs | platform.claude.com/docs | partial |
| Prompting Claude Fable 5 | Anthropic docs | platform.claude.com/docs | partial |
| A field guide to Claude Fable 5: Finding your unknowns | Anthropic (Shihipar) | claude.com/blog | partial |
| The new rules of context engineering for Claude 5-generation models | Anthropic | claude.com/blog | partial |
| Getting started with loops | Anthropic | claude.com/blog | partial |
| Working with Claude Fable 5 in Claude Cowork | Anthropic | claude.com/blog | partial |
| Teaching Claude why | Anthropic research | anthropic.com/research | adapted |
| A global workspace in language models | Anthropic research | anthropic.com/research | adapted |
| Claude and the Riemann hypothesis (zeta research) | Anthropic research | anthropic.com/research | partial |
| Multiagent systems research | Anthropic research | anthropic.com/research | absorbed |
| Claude Code internal architecture | source analysis | handbook | absorbed |
| Eliciting Reasoning with Cognitive Tools | paper (IBM Zurich) | arXiv:2506.12115 | absorbed · central |
| A quantum semantic framework for NLP | paper (Agostino et al.) | arXiv:2506.10077 | absorbed · metaphor |
| Emergent Symbolic Mechanisms… | paper (Yang et al., ICML'25) | arXiv:2502.20332 | absorbed |
| Unlocking Structured Thinking w/ Cognitive Prompting | paper (Kramer, Baumann) | arXiv:2410.02953 | partial |
| A Survey of Context Engineering for LLMs | paper (Mei et al.) | arXiv:2507.13334 | evaluated |
| Multi-Agent Design: Optimizing Agents with Better Prompts and Topologies | paper (Zhou et al., ICLR'26) | arXiv:2502.02533 | partial |
| Self-Consistency… | paper (Wang et al.) | arXiv:2203.11171 | mentioned |
| Tree of Thoughts | paper (Yao et al.) | arXiv:2305.10601 | mentioned |
| Chain-of-Thought Prompting… | paper (Wei et al.) | arXiv:2201.11903 | background |
| davidkimai/Context-Engineering | GitHub repo | github.com | evaluated · partial |
| Samuele95/neos | GitHub repo | github.com | rejected |
| Karpathy — "context engineering" coinage | X/Twitter | status/1937902205765607626 | term origin |

---

## A. Anthropic publications

**"Effective context engineering for AI agents"** — Anthropic.
Absorbed as foundational. Source of: *right altitude* (directives neither too
brittle nor too vague), *smallest viable token set*, *examples over rules*, and
*long-horizon support* (memory/state for multi-session work). These run through
`SKILL.md`, the audit checklist (sections A, B, C, H), and the agentic-loop shape.

**"Building Effective AI Agents"** — Anthropic.
Absorbed. Source of the four canonical multi-agent topologies —
orchestrator-workers, parallelization-sectioning, parallelization-voting,
evaluator-optimizer — that form `references/agent-team-topologies.md` and Shape 7.
Also the closing discipline "add complexity only when it demonstrably improves
outcomes," which underwrites audit check M5 (scaffold restraint).

**"Best practices for prompt engineering"** — Anthropic (claude.com/blog).
Absorbed in part. Source of: *permission to abstain* (the most cost-effective
anti-hallucination technique), *prefilling* the assistant response to force
structured output, and confirmation of the framework's existing stances on
examples and clarity. Drove the permission-to-abstain operator, the prefill
delivery guidance in Shapes 2 and 6, and audit check M3.

**"Building a C compiler with a team of parallel Claudes"** — Nicholas Carlini,
Anthropic Engineering.
Absorbed. Source of: *agent-consumability* (greppable failure markers,
aggregate-first output, compact-stdout-verbose-logs, deterministic-but-different
sampling, visible state transitions) in `references/agent-consumability.md`; the
*Goodhart-on-the-verifier* framing used throughout the verifier infrastructure and
Shape 6; the *GCC-as-oracle* differential-testing pattern noted in Shape 6; and
*specialist agent roles*. The empty-context root constraint ("the test harness is
the agent's environment") shaped the agent-consumability principle.

**"Claude prompting best practices"** — Anthropic, Claude Platform documentation
(platform.claude.com/docs, prompt-engineering section; retrieved July 2026).
Absorbed in part. Licenses: the **prefill deprecation fix** (last-assistant-turn
prefills rejected with errors on current model generations; substitutes — explicit
format instruction, XML format indicators, prompt-style matching — promoted to the
default path in Shapes 2 and 6); the **reasoning-control update** in Phase 6
delivery (adaptive thinking + effort settings; manual thinking token budgets
deprecated); and, jointly with the model-specific guide below, the
**substrate-relativity principle** (Principle 9) — instructions written to correct
under-triggering on older models over-trigger on newer ones ("CRITICAL: You MUST
use…" → "Use… when…"), and general instructions often outperform prescriptive
step-by-step plans — which grounds the substrate capability tier axis and the
frontier-tier gating of the cognitive-tools default. Empirical scope: measured on
Anthropic's model families; adopted as a design principle per Principles 1 and 5.

**"Prompting Claude Fable 5"** — Anthropic, Claude Platform documentation
(model-specific prompting guide; retrieved July 2026).
Absorbed in part, expressed model-agnostically as substrate-tier properties.
Licenses: the **reasoning-channel audit check M6** (instructions to echo or
transcribe internal reasoning as response text trigger a reasoning-extraction
refusal category on that vendor's frontier models and conflate channels on all
runtimes; sanctioned channels are thinking blocks, tool inputs, send-to-user
tools); the **six long-horizon operators** in `operators/section-operators.md`
(progress-claim grounding — vendor testing reports it nearly eliminated fabricated
status reports; checkpoint policy; anti-early-stopping; memory-file conventions;
deviations-log complement drawn jointly from the field guide; verbatim
send-to-user pattern with elicitation language, flagged harness-dependent); the
**lead-with-outcome operator** for final human-facing summaries (Shapes 1 and 4);
and the **subtractive-refactor row** in refactor mode's diagnostic table ("skills
developed for prior models are often too prescriptive… and can degrade output
quality"). Model names appear only here and in per-runtime footnotes, per the
framework's model-agnostic invariant.

**"A field guide to Claude Fable 5: Finding your unknowns"** — Thariq Shihipar,
Anthropic (claude.com/blog; retrieved July 2026).
Absorbed in part. Licenses: the **unknowns-triage table** in the Phase 2 interview
branches (known unknowns → the interview; unknown knowns / "I'll recognize it when
I see it" → cheap measurement outside the prompt — brainstorm variants, throwaway
prototypes — before drafting; unknown unknowns / unfamiliarity signals →
blind-spot pass enumerating unarticulated basis states before any collapse); the
**starting-point elicitation** folded into an existing interview question ("give
Claude context about your starting point"); the **escalation rule** (if the user
cannot evaluate produced variants, the ambiguity was in the measurement basis —
escalate to the teaching/blind-spot pattern, per the guide's color-grading
account); the **reference operator** ("the absolute best reference is source
code," even in another language — the densest operator when the user cannot
verbalize a requirement); and the **deviations-log operator** jointly with the
model guide above (conservative option, log under "Deviations," continue); and,
from the August 2026 pass, the **plan-ordering-by-decision-volatility** note in
Shape 1's spine ("highlight decisions I'm most likely to tweak… bury mechanical
refactoring" — volatile decisions lead, where review is cheap).

**"The new rules of context engineering for Claude 5-generation models"** —
Anthropic (claude.com/blog; retrieved August 2026).
Absorbed in part. Much of it was already in the framework via the earlier
best-practices pass (reduce overconstraining, rules→judgment, subtractive
refactoring — Principle 9 and the subtractive-refactor row). Newly licenses: the
**cross-layer redundancy** and **progressive-disclosure** items in audit §B and
the drafting rules (say each thing once in the layer that owns it; selectively
loaded detail over monolith — empirical anchor: the vendor removed the large
majority of a production agent's system prompt on its newest models with no
measured regression); the **interface-design-as-operator** paragraph in Shape 4
(expressive parameters and enums teach tool usage more cheaply and less
ambiguously than examples on frontier tiers); and the strengthened
**rich-references** note (test suites, mockups, rubrics as higher-fidelity
specifications than prose plans) folded into the reference operator. The
auto-memory and /doctor product features were noted but not ported — they are
runtime capabilities, not prompt design.

**"Getting started with loops"** — Anthropic (claude.com/blog; retrieved
August 2026).
Absorbed in part. Licenses the **trigger/stop taxonomy** in Shape 1 (turn-based /
goal-based / scheduled / proactive-event rows, each with design consequences),
the **deterministic stop-condition + iteration-cap** rule (checkable, quantitative
goals; "stop after N attempts"), the **interval-matching** rule for scheduled
loops (don't poll faster than the input changes), the **quantitative
self-verification** rule ("never report changes complete based on edit success
alone" — verify end-to-end with checks the agent executes), and the
**scripts-for-deterministic-work** rule. The audit's loop-completeness check (§I)
gained the deterministic-stop confirmation. Product-specific mechanics (/goal,
/loop, /schedule, /usage) were not ported; their design content was.

**"Working with Claude Fable 5 in Claude Cowork"** — Anthropic (claude.com/blog;
retrieved August 2026).
Absorbed in part, expressed model-agnostically. Much was already present
(interview-before-executing, checkable done definitions, effort-based
reasoning-control guidance, the stale-corrections/subtractive-refactor row).
Newly licenses: the **delegation ladder** in audit §A (delegate the approach /
the procedure / the timing; pick the rung per directive, default one rung higher
on frontier tiers) and the **context-over-constraints** phrasing folded into the
same note (who the work is for, when it's needed, what it accomplishes — context
enables decisions in unanticipated situations; constraints only forbid).
Graduated delegation (start with quickly-verifiable work, escalate as results
prove reliable) was evaluated and left as user workflow rather than prompt
content. The classifier-fallback and sidebar-visibility material is product
behavior; not ported.

## A2. Anthropic research (adapted across the training/inference boundary)

These are training-time or interpretability results, not prompting guides. The
framework adapts them the way it already adapts the symbolic-mechanisms paper:
as *mechanistic support* and *design principles licensed by analogy*, with the
boundary-crossing stated rather than hidden.

**"Teaching Claude why"** — Anthropic research (anthropic.com/research; retrieved
August 2026).
Adapted. Training on *explanations of values* generalized far out-of-distribution
where demonstrations did not (28× data efficiency in the cited experiments), and
teaching underlying principles beat demonstrations alone; diverse training
contexts improved generalization even when the diversity was functionally inert.
Licenses **Principle 10 (rationale extends the operator's reach)** — load-bearing
constraints carry their one-line *because*; principle-plus-rationale over
enumeration; vary example surface contexts. Scope caveat carried into the
principle text: evidence is training-time; adopted as a prompt-design principle
because the asymmetry follows from Principle 1 and generalizes the framework's
existing Shape 5 "explanation, not just rule" practice.

**"A global workspace in language models"** — Anthropic research
(anthropic.com/research; retrieved August 2026).
Adapted as mechanistic support, in the same role as Yang et al. Licenses:
the **workspace-capacity note** under Principle 5 and audit §B (multi-step
reasoning routes through a limited-capacity, write-once/read-many workspace —
why compact early-loaded context and progressive disclosure work), and
**Principle 11 (suppression names — and naming partially amplifies)** — the
finding that "don't think about X" still activates X's internal representation,
grounding the positive-framing default, the sharp-edges-only rule for DO-NOT
lists, and the existing anti-example priming caution. The J-lens monitoring and
intervention techniques are interpretability infrastructure, not promptable;
not ported.

**Riemann zeta research run** — Anthropic research (anthropic.com/research;
retrieved August 2026).
Partial. An account of a frontier-discovery run, mined for orchestration
patterns rather than mathematics. Licenses: the **persistence /
capability-prior correction** long-horizon operator (the primary human
intervention was variants of "keep going"; initial self-skepticism from trained
priors about famous open problems, not capability, was the binding constraint;
hundreds of discarded ideas preceded the result) — gated on strong verification
and an open-ended-discovery trigger; and the **validator-heavy roster** guidance
in the swarm topology (the run's roster weighted validators heavily: independent
re-derivation, cross-refereeing, formal/numerical checks, originality sweeps,
external review). The encouragement anecdote is adopted as an operator with an
explicit gate, not as general advice — persistence without verification
amplifies confident wrong output.

**Multiagent systems research** — Anthropic research (anthropic.com/research;
retrieved August 2026).
Absorbed. The largest single source of this pass. Licenses: **Topology 5
(swarm / shared-forum collective)** — forum-coordinated swarm vs. isolated
parallel agents (an order of magnitude more verified findings on comparable
token budget, minimal overlap between methods), emergent specialization, forum
as designed artifact ("use something like a central forum in which agents can
agree on best practices and protocols"), arbiter/validator roles, and the
poor-taste / declining-merge-rate counter-indication for convergent production
work; and the **empirical failure-modes catalog** with its five audit checks —
conformity collapse (identical contexts → duplicate branches, titles, projects;
polling floods), hidden-profile information loss (unshared decisive facts never
volunteered once consensus forms), missing epistemic vigilance (accuracy
collapses as unreliable reports rise; no reputation to lose; supply courts /
peer review / verification norms by design), convergence-driven collusion
(price-matching through public signals alone → isolate independent judges until
commitment), and turf wars between mutually unaware co-tenants (sabotage
assumptions, lockouts, kill loops → mutual awareness, resource ownership,
negotiated resolution protocols). Model-comparison results were not ported
(model-agnostic invariant); the design lessons were.

---

## B. Claude Code source analysis

**Claude Code internal architecture** — analyzed via a context-engineering
handbook treating the system's published/observable prompting patterns.
Absorbed. Source of: the *sub-agent/tool* shape (AgentTool, the Explore and Plan
agents), *capability lockdown* (the READ-ONLY banner and BashTool's layered
prohibitions) now living in Shape 5; *"never delegate understanding"* (the
orchestrator must supply specific context, not vague handoffs) in Shape 7 and the
audit; and the Claude Code *prompting style discipline* (imperative voice,
concrete over abstract, every line earns its place) that audit check M5 enforces
on the framework's own outputs.

---

## C. Academic papers

**"Eliciting Reasoning in Language Models with Cognitive Tools"** — Brown Ebouky,
Andrea Bartezzaghi, Mattia Rigotti. IBM Research Zurich. arXiv:2506.12115 (2025).
Absorbed, central. Source of the entire cognitive-tools treatment in
`references/reasoning-patterns.md`: the four tools (`understand_question`,
`recall_related`, `examine_answer`, `backtracking`), the verbatim system and
per-tool scaffolds, the per-model variability data, and the
modularity-beats-monolithic finding. Drove the hard-reasoning detection in Shape 2
and Phase 1, and the M4 blocking check ensuring tool definitions actually ship.
Empirical anchor: GPT-4.1 26.7% → 43.3% on AIME2024, approaching o1-preview
without post-training.

**"A quantum semantic framework for natural language processing"** —
Christopher J. Agostino, Quan Le Thien, Molly Apsel, Denizhan Pak, Elina Lesyk,
Ashabari Majumdar. arXiv:2506.10077 (2025).
Absorbed as the framework's organizing metaphor, with discipline. Source of the
operator framing — prompts as operators that *amplify / suppress / mix* a model's
semantic state; *non-commutativity* (section ordering matters); *superposition*,
*interference*, and *projection*; *temperature as measurement*; and
*observer-dependence*. Lives in `references/quantum-principles.md` and
`operators/section-operators.md`. **Adopted only because the paper's claims have
measurable consequences** (e.g., CHSH-style measurements) — the framework treats
the vocabulary as operational, not decorative, and rejects uses that aren't (see
section E).

**"Unlocking Structured Thinking in Language Models with Cognitive Prompting"** —
Oliver Kramer, Jill Baumann. Carl von Ossietzky Universität Oldenburg.
arXiv:2410.02953 (2024).
Evaluated and partially used. Source of the deterministic / self-adaptive / hybrid
cognitive-prompting variants and the modular-vs-monolithic distinction that
clarifies *why* the IBM Zurich cognitive tools win. The variants themselves were
**largely not ported**, because Prometheus targets tool-calling runtimes
exclusively, where modular cognitive tools dominate the monolithic
cognitive-prompting variants this paper describes.

**"Emergent Symbolic Mechanisms Support Abstract Reasoning in Large Language
Models"** — Yukang Yang, Declan Campbell, Kaixuan Huang, Mengdi Wang,
Jonathan Cohen, Taylor Webb. Princeton University / Microsoft Research.
arXiv:2502.20332 (2025), ICML 2025 Spotlight.
Absorbed as mechanistic justification. The three-stage circuit — symbol
abstraction heads → symbolic induction heads → retrieval heads — is *why*
structured prompts (named sections, schemas, consistent ordering) outperform
unstructured ones. Cited in `references/reasoning-patterns.md` and underpins the
structure-related audit checks.

**"Multi-Agent Design: Optimizing Agents with Better Prompts and Topologies"** —
Han Zhou, Xingchen Wan, Ruoxi Sun, Hamid Palangi, Shariq Iqbal, Ivan Vulić,
Anna Korhonen, Sercan Ö. Arık. arXiv:2502.02533 (2025; v2 2026), ICLR 2026.
Evaluated and partially used — findings absorbed as design rules, machinery not
ported. The MASS framework searches prompts and topologies jointly in three
stages (block-level prompt optimization → influence-pruned topology search →
workflow-level joint prompt re-tune). Licenses the **topology optimization
ordering** section in `references/agent-team-topologies.md` and its three rules:
the *single-agent baseline* (prompt-optimizing one agent is more token-effective
than scaling agent count with default prompts; weakly-prompted scaling saturates
early), *topology blocks must earn their place* (beneficial topologies are "a
small fraction of the full design space"; some blocks actively degrade), and the
*compose-then-retune pass* now closing Shape 7's spine (their Stage 3 — prompts
tuned in isolation need re-tuning under composition interference, consistent
with Principle 4). Also licenses the **voting + debate rounds** hybrid, with the
commitment-before-exchange sequencing this framework adds to reconcile debate
with its independence-isolation rule. The automated search machinery (APO,
influence-weighted softmax pruning, budget-constrained sampling) was **not
ported** — Prometheus is a build-time design framework without eval-set access;
the delivery guidance instead recommends a MASS-style staged search when the
user has an eval set and production stakes.

**"A Survey of Context Engineering for Large Language Models"** — Lingrui Mei,
Jiayu Yao, Yuyao Ge, Yiwei Wang, Baolong Bi, Yujun Cai, Jiazhi Liu, Mingyu Li,
Zhong-Zhi Li, Duzhen Zhang, Chenlin Zhou, Jiayi Mao, Tianze Xia, Jiafeng Guo,
Shenghua Liu (15 authors). arXiv:2507.13334 (2025).
Evaluated, not adopted. Its taxonomy (context retrieval/generation, processing,
management) was considered as a porting target and declined: it operates at the
runtime-context layer, while Prometheus is a build-time prompt compiler. The
survey's framing of a build-vs-generate asymmetry informed the framework's stance
but no component was ported.

**"Self-Consistency Improves Chain of Thought Reasoning in Language Models"** —
Xuezhi Wang, Jason Wei, Dale Schuurmans, Quoc Le, Ed H. Chi, Sharan Narang,
Aakanksha Chowdhery, Denny Zhou. arXiv:2203.11171 (2022).
Mentioned for completeness in `references/reasoning-patterns.md` as a sampling-time
reasoning enhancement; not deeply used, since the framework's user base rarely
needs majority-vote sampling.

**"Tree of Thoughts: Deliberate Problem Solving with Large Language Models"** —
Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Thomas L. Griffiths, Yuan Cao,
Karthik Narasimhan. arXiv:2305.10601 (2023).
Mentioned for completeness; noted as powerful but rarely needed in practice. Not
ported.

**"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"** —
Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Ed H. Chi, Quoc Le,
Denny Zhou. arXiv:2201.11903 (2022).
Background. The baseline reasoning technique the framework's reasoning patterns
build beyond; referenced as the thing cognitive tools improve upon.

### Self-adaptive systems (manage mode)

**"An Introduction to Self-Adaptive Systems: A Contemporary Software Engineering
Perspective"** — Danny Weyns. Wiley/IEEE Press (2020).
Source of the manage-mode architecture. The MAPE-K loop, the two definitional
principles (external + internal), the seven waves, and the four-stage integrated
life cycle are ported here — but selectively, per the honest wave accounting in
`agent-architect-workflow`: Waves I (MAPE-K), II (Kramer-Magee timescales), III
(runtime models), and VII (learning, ledger-lite) are ported; Waves IV–VI and
proactive adaptation are declined with named re-trigger conditions. Every ported
concept is expressed through the operator algebra (invariant I1), not alongside it.

**"The Vision of Autonomic Computing"** — Jeffrey O. Kephart, David M. Chess.
IEEE Computer 36(1) (2003).
Origin of the MAPE-K loop (Monitor / Analyze / Plan / Execute over a shared
Knowledge store) that manage mode instantiates. Ported as the discipline that
the four phases communicate only through K, never by direct call.

**"Self-Managed Systems: an Architectural Challenge"** — Jeff Kramer, Jeff Magee.
Future of Software Engineering (FOSE) at ICSE (2007).
Source of the three-layer timescale decomposition (component control / change
management / goal management) mapped in manage mode to within-run / between-run /
redesign — a mapping, not new machinery.

**ROS 2 managed-node lifecycle design** — the configure / activate / deactivate /
adapt / shutdown lifecycle contract (as distilled in project reference material).
Source of the stop/restart seam: an explicit agent state machine gives adaptation
a legal seam (the INACTIVE state) and lets the agent be steered without knowing
it is steered (the internal principle). The insight ported is that a cleanly
stoppable agent is, by construction, an adaptable one.

---

## D. Repositories and external works evaluated

**davidkimai/Context-Engineering** (GitHub).
Evaluated deeply; layered complementarity, not wholesale adoption. Confirmed the
value of pointing at cognitive tools and symbolic mechanisms, and informed the
minimum-viable-prompt scaffold idea. Its protocol-shell DSL was considered and
declined (the framework's YAML scaffold + shape catalog already do that work). Its
`00_COURSE` material was found to be largely stub/scaffolding and not relied upon.
Its MIT-license, public-skill structure is a precedent for this release.

**Samuele95/neos** (GitHub).
Evaluated and **rejected**. The "LLM-as-OS / neural-field" specification uses
vocabulary that mirrors the quantum-semantic framing (non-commutativity, collapse,
coherence) but **without measurable consequence** — the "field dynamics" and
coherence numbers (e.g. "0.993 coherence") are LLM-generated narration of a
role-play, not measurements of anything. It is the precise failure mode Prompt
Architect's audit is designed to catch: vocabulary without operational substance.
Nothing was ported. Documented here because the rejection clarifies the
framework's standard for what counts as a real technique.

---

## E. Term origin

**Andrej Karpathy** — popularized "context engineering."
X/Twitter, status/1937902205765607626 (2025): "context engineering is the delicate
art and science of filling the context window with just the right information for
the next step." Acknowledged as the origin of the term the framework operates
under, though the framework's scope (build-time prompt construction) is narrower
than the full runtime-context discipline the term now covers.

---

## How to cite Prometheus

If you use or build on this framework, a citation of the form below is appreciated:

```
Prometheus: a build-time meta-prompting framework for tool-calling LLM agents.
[Author], 2026. https://github.com/[user]/prometheus
```

Prometheus stands on the work above. Any errors of synthesis are the
framework's own, not its sources'.
