# Changelog

All notable changes to Prometheus. Format follows
[Keep a Changelog](https://keepachangelog.com/); this project versions by
capability milestone rather than semver, since it is a prompt framework rather
than a released binary.

Every change traces to a source claim or a real test finding — the framework's own
evidence rule applied to itself. Sources are catalogued in
[`CITATIONS.md`](CITATIONS.md).

Status legend: **validated** = stress-tested or exercised on a real task;
**source-backed** = grounded in a cited primary, not yet tested in this framework.

---

## [Unreleased] — renamed to Prometheus

### Changed
- **Renamed the framework from "Prompt Architect" to "Prometheus"** — skill
  directory, frontmatter `name`, document titles, citation block, and all prose
  references. Trigger text now names the `/prometheus` invocation explicitly,
  since the new name no longer self-describes the way the old one did.
- The frozen-core baseline was re-frozen after the rename: the rename necessarily
  touches two files (`references/reasoning-patterns.md`,
  `references/verifier-agent-patterns.md`) that the manage-mode extension held
  byte-frozen. The extension's I8 evidence stands against the pre-rename baseline;
  subsequent work is measured against the new one.
- No behavioural change. No normative rule, invariant, procedure, or operator was
  touched by the rename.

## [Unreleased] — agent-architect extension (manage mode)

Extends the framework from a build-time prompt designer into an agent *manager*:
a MAPE-K managing system over managed LLM agents, with stop/restart persistence
and adaptation memory. Ported selectively per honest wave accounting; MAPE-K
expressed *through* the operator algebra (invariant I1), never alongside it.
Status: **validated** on the dogfooded toy package (replay, rollback,
anti-oscillation, and the full MAPE dry-run were exercised programmatically);
**source-backed** for paths not yet run on a real managed agent (Stage 6).

### Added
- **Manage mode** as a third mode in `SKILL.md` alongside from-scratch and
  refactor, with lifecycle-verb / package-path detection signals. Reuses
  existing machinery (audit checklist, refactor sub-modes, cross-run verifier)
  as subroutines rather than adding analytical machinery. — *Weyns 2020;
  agent-architect-workflow*
- **`references/agent-state.md`** — the managed-agent package (K-store): package
  layout, the four Knowledge files, control/data-plane boundary, the lifecycle
  state machine, the adaptation-ledger protocol, and the input-interpretation
  operator every managed prompt carries (§2.1, §2.4). — *Weyns 2020; ROS 2 managed-node
  design; quantum §2.1/§2.4*
- **`references/manage-mode.md`** — the MAPE loop mapped to existing machinery:
  Monitor (tomography, §2.4/§4.2), Analyze (Bayesian_Collapse, §2.4/§1.2/§5.2),
  Plan (deliberate collapse + fidelity test, §1.2/§5.4/§2.3), Execute
  (irreversible, §5.6). Phases communicate only through K. — *Kephart & Chess
  2003; Kramer & Magee 2007; quantum framework*
- **Shipped MAPE operator artifacts** — `manage/monitor-operator.md` (Shape 2,
  tomography output) and `manage/analyze-operator.md` (Shape 2, Prompt A
  contract), each with an inline static verifier and a worked example. Quantum
  closure (I9): every executable loop artifact is a framework-designed operator.
  — *quantum §4.2/§2.4; framework closure (I9)*
- **`manage/manage-mode-verifier.md`** — the package ship-gate, designed as a
  Shape 6 grader (bias controls, per-invariant calibration anchors,
  reasoning-before-verdict per Check N); delegates byte-identity and
  anti-oscillation to the replay verifier. — *framework Shape 6; audit-checklist N*
- **`manage/replay-verifier.py`** — runnable, stdlib-only: reconstructs
  `prompt/current` from `history/v001` + ordered ledger diffs and byte-compares;
  handles rollback-by-snapshot and the anti-oscillation check. — *quantum P2
  (composition order is the state); P5 (irreversibility)*
- **Manage-mode package verifier class** in `references/verifier-specification.md`
  (checks I2/I3/I4 conditions on a package). — *agent-architect-workflow*
- **Four sources** in `CITATIONS.md`: Weyns 2020; Kephart & Chess 2003; Kramer &
  Magee 2007; ROS 2 managed-node design. — *manage-mode provenance*

### Notes
- Frozen-core discipline held (I8): only `SKILL.md`, `CHANGELOG.md`,
  `CITATIONS.md`, and `references/verifier-specification.md` differ from baseline;
  all other pre-existing files are byte-identical. `operators/section-operators.md`
  stays frozen — the input-interpretation operator profile lives in
  `agent-state.md` (decision D5).
- Model-agnostic invariant held (I7): no vendor/model names in new normative text.



Source-driven pass triggered by new Anthropic primary sources and one broken
operator (prefilling now errors on current runtimes). All items **source-backed,
untested in this framework**. Model-agnostic invariant held: model names appear
only in `CITATIONS.md` and per-runtime footnotes.

### Added
- **Substrate capability tier** as a third Phase 1 inference axis (frontier /
  strong / legacy; unknown → strong), orthogonal to shape and domain. Conditions
  default operator strength, scaffold thresholds, prefill availability, and
  reasoning-control guidance. — *best-practices; fable-5*
- **Principle 9 (operator strength is substrate-relative)** in
  `quantum-principles.md`: prescriptive operators over-project on
  high-instruction-following substrates; calibrate strength down as capability
  rises. Derived from Principles 1 and 5. — *best-practices*
- **Audit check M6 (reasoning-channel separation)**: instructions to echo or
  transcribe internal reasoning as response text are a defect; target the
  runtime's sanctioned channel instead. Distinguishes task-mandated justification
  (fine) from internal-reasoning transcription (defect). — *fable-5*
- **Six long-horizon operators** in the catalog + Shape 1 spine: progress-claim
  grounding, checkpoint policy, anti-early-stopping, memory-file conventions,
  deviations log, verbatim send-to-user (harness-dependent). — *fable-5; field guide*
- **Lead-with-outcome operator** for final human-facing summaries (Shapes 1, 4),
  scoped against agent-consumability. — *fable-5*
- **Unknowns-triage table** + starting-point elicitation + escalation rule +
  **reference operator** in the Phase 2 interview branches. — *field guide*
- **Subtractive-refactor row** in refactor mode's diagnostic table
  (over-specification → strike-and-test). — *fable-5*

### Changed
- **Prefilling demoted to a legacy path** (Shapes 2, 6), conditional on runtime
  support; explicit-format / XML-indicator / prompt-style-matching promoted to the
  default. Prefilled last-assistant turns now error on current generations. —
  *best-practices*
- **Cognitive-tools default gated by tier**: two-signal structural default on
  legacy/strong tiers, M5-triggered option on frontier; empirical citation scope
  narrowed to the measured model classes. — *best-practices*
- **Phase 6 usage** now recommends the runtime's reasoning-control parameters
  (adaptive thinking / effort settings) rather than temperature only; notes manual
  thinking budgets are deprecated on current Anthropic models. — *best-practices*

### Per-task source map

| # | Change | Source claim |
|---|---|---|
| Core | Principle 9 + substrate tier axis + Phase 3 strength calibration | best-practices: "CRITICAL: You MUST → Use… when"; general-over-prescriptive |
| 1 | Prefill → legacy path; substitutes default; per-runtime footnote | best-practices: "Migrating away from prefilled responses" |
| 2 | Audit check M6; scaffold + spines verified passing | fable-5: reasoning_extraction refusal; scaffolding changes |
| 3 | Cognitive-tools default gated by tier; scope narrowed | best-practices: prefer general instructions; honest-framing invariant |
| 4 | Six long-horizon operators + Shape 1 spine | fable-5: respective sections; field guide: implementation notes |
| 5 | Subtractive-refactor row | fable-5: "Refactor existing prompts and skills"; best-practices migration |
| 6 | Unknowns-triage + starting-point + escalation + reference operator | field guide: blind-spot pass; brainstorms/prototypes; references |
| 7 | Lead-with-outcome delivery operator | fable-5: "Readability when communicating with the user" |
| 8 | Phase 6 reasoning-control parameters | best-practices: thinking migration |
| 9 | CITATIONS.md: three sources, each stating the change it licenses | all three |

### Verification
Static cross-references resolve; M4/M5 intact; model-name grep clean in normative
text (one pre-existing example genericized); non-commutativity spot-check passed on
all insertions.

---

## [0.6] — Publication packaging

### Added
- Honest **README** with an explicit validated-vs-unproven status section.
- Complete **CITATIONS.md** — every source with disposition, verified against
  primaries. Corrected a citation error (quantum framework: "Kuznetsov" →
  **Agostino et al.**) and a paper title (cognitive prompting → *"Unlocking
  Structured Thinking in Language Models with Cognitive Prompting"*, Kramer &
  Baumann).
- **MIT LICENSE**, `DEPLOY.md`, and a designed **GitHub Pages site** (`docs/`).
- **Claude Desktop package**: `SKILL.md` given valid YAML frontmatter (name +
  triggering-tuned description), packaged as `.skill` and `.zip`, plus
  `INSTALL-DESKTOP.md`.

---

## [0.5] — Self-adaptive verification

### Added
- **Verifier specification** (per-shape, three layers: static, single-run dynamic,
  cross-run dynamic).
- **Verifier-agent patterns**: runnable verifiers built as recursive Shape 6
  prompts; static (auto-generated) and dynamic (templated) modes; cross-run
  distributional verifier; self-correction loop closure for agentic loops and
  evaluator-optimizer. — *Carlini (Goodhart-on-verifier)*
- **Eat-your-own-dogfood** delivery step: the framework runs its static-mode
  verifier on its own draft and refuses to ship blocking failures.
- Audit checks **M2 (verifier-readiness)**, **M4 (cognitive-tools delivery,
  BLOCKING)**, **M5 (scaffold restraint)**. — *Anthropic "add complexity only when
  it demonstrably improves outcomes"*

### Changed
- Phase 6 delivery expanded to ship the verifier artifacts alongside the prompt.

---

## [0.4] — Interactivity and refactor mode

### Added
- **Refactor mode**: six-phase procedure (1R–6R) for existing prompts, with three
  sub-modes — audit-only, targeted refactor (symptom-to-cause table), wholesale
  rewrite (guardrailed, original preserved).
- **Permission-to-abstain** operator + audit **M3**; **clarification-seeking**
  operator as its interactive sibling, with a bounded sufficiency self-check.
  Abstention is the always-on floor; clarification the opt-in upgrade gated on a
  build-time deployment answer. — *Anthropic best practices (abstention);
  fable-5 later refined channel handling*
- **Prefilling** delivery guidance for Shapes 2 and 6 (later demoted; see
  Unreleased). — *Anthropic best practices*
- **Co-authoring interview passes** for Shapes 3, 6, 7 (stage decomposition,
  calibration anchors, role roster) — propose-first, then ask.

---

## [0.3] — Reasoning and agent-consumability

### Added
- **Cognitive-tools** treatment: four verbatim IBM Zurich scaffolds, per-model
  variability, modularity-beats-monolithic; hard-reasoning detection; runtime-
  formatted tool definitions (Anthropic / OpenAI) shipped as a delivery artifact.
  — *Ebouky et al., arXiv:2506.12115; Kramer & Baumann, arXiv:2410.02953*
- **Agent-consumability** reference (greppable markers, aggregate-first,
  deterministic-but-different sampling, visible state transitions). — *Carlini*
- **Symbolic-mechanisms** justification for structured prompts. — *Yang et al.,
  arXiv:2502.20332*

---

## [0.2] — Multi-agent and the seventh shape

### Added
- **Shape 7 (agent team)** with four canonical topologies (orchestrator-workers,
  parallelization-sectioning, parallelization-voting, evaluator-optimizer),
  cross-role interface-contract audit, and per-role composition reusing Shapes
  4/5/6. — *Anthropic "Building Effective AI Agents"*
- **Capability lockdown** pattern (structural + prose, forceful-negative,
  explanation), sited in Shape 5 and referenced from Shape 7. — *Claude Code
  Explore agent, BashTool*
- **"Never delegate understanding"** rule in the orchestrator and audit. — *Claude
  Code AgentTool*

---

## [0.1] — Core framework

### Added
- Seven-shape architecture (six at first; agent team added in 0.2) with the
  domain axis orthogonal to shape.
- Six-phase from-scratch procedure: shape inference → adaptive interview →
  operator-design drafting → audit → honest three-axis evaluation → delivery.
- **Quantum-semantic core**: prompts as operators; ordering is structural;
  ambiguity is superposition; combination is non-additive; interpretation destroys
  information; temperature is measurement; meaning is observer-dependent. —
  *Agostino et al., arXiv:2506.10077*
- **Classical context-engineering** base: right altitude, smallest viable token
  set, examples over rules, long-horizon support. — *Anthropic "Effective context
  engineering"*
- Audit checklist, section-as-operator catalog, evaluation rubric, and the
  minimum-viable-prompt scaffold.
- Origin of the "context engineering" term acknowledged. — *Karpathy*

### Validated
- Three stress tests (one-shot extractor, LLM-as-judge email grader, code-review
  persona) → eleven findings, all patched and confirmed.
- Exercised on a real external DMN fraud-detection task, which surfaced two
  triggering gaps (compliance-vs-satisfaction, checklist-vs-evaluative) — both
  fixed.

---

## Validation ledger (current)

- **Validated**: from-scratch path for one-shot, system-persona, and LLM-as-judge
  shapes; internal consistency (cross-references resolve; shapes compose).
- **Source-backed, untested in this framework**: agent-team end-to-end, refactor
  mode, verifier infrastructure, clarification self-check, and the entire
  frontier-model extension pass above.

The framework's stop-rule applies to itself: remaining confidence comes from
real-world use, not from further design passes.
