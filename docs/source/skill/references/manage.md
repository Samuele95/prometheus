# Manage mode — the MAPE-K loop over a managed agent

**Manage mode runs an agent across its lifetime** — monitor, analyze, plan, execute at the lifecycle seam, remember — by *scheduling* the audit checklist, the refactor sub-modes and the cross-run verifier as subroutines of four phases; no new machinery. It is the one place the framework executes anything beyond a static audit, and it executes only the managed agent and its own operators over that agent's runs (SKILL.md, Build-time only). Monitor, Analyze, the package grader and the replay script ship in `assets/manage/`.

## Indice

1. Frame and invariants
2. The package (K-store)
3. The loop — four phases
4. Escalation and autonomy
5. Input-interpretation operator
6. Lifecycle contract
7. Adaptation ledger
8. Ship gate and shipped artifacts
9. Templates

## Frame and invariants

MAPE-K through the operator calculus: the managed prompt is an operator Ô_v (P1); a run is one sample of its distribution; adaptation produces Ô_v+1; the ledger is the composition history and its order is the state (P2). Three timescales: *component control* (within a run — the manager doesn't touch the agent), *change management* (between runs — the operator adapts at the seam), *goal management* (escalation when the goals are wrong); the min-N gate separates the first two — never adapt on a within-run sample (P7). A MAPE term without its operator-calculus expression is a defect, and the shipped artifacts' static checks include `anchors-present` (I1).

Invariants: **I1** every concept carries its principle reference · **I2** seam — the prompt is immutable outside ADAPTING, the agent is steered without knowing it, `memory/` its only in-run mutable state · **I3** persistence — the package *is* the agent's identity; restart from it alone · **I4** ledger — (a) write-ahead, (b) anti-oscillation, (c) replay · **I5** every goal pins observable, observer, aggregation · **I6** Execute human-gated unless a bounded envelope is declared · **I7** runtime as capability — no vendor / model names or hard-coded sampling parameters in normative fields · **I9** closure — the managing system is made of framework-designed prompts.

## The package (K-store)

One directory per agent, no state elsewhere (I3):

```
agents/<agent-id>/
  manifest.yaml  # identity, shape, domain, tier, runtime, deployment, lifecycle state, prompt version, min-N, autonomy
  prompt/current/prompt.md  # the live operator Ô_v; snapshot, patch and replay all address this path (I4c)
  prompt/history/vNNN/prompt.md  # immutable snapshot per Execute; its line delta beside it: prompt/history/vNNN.patch.json
  tools/manifest.yaml  # tool definitions + versions (effector-editable)
  knowledge/managed-system.yaml  # semantic-state model of Ô_v
  knowledge/environment.yaml  # aggregated run facts, written by Monitor
  knowledge/goals.yaml  # observable + observer + aggregation per goal
  knowledge/working/  # candidate superposition, pending plan, monitor cursor
  memory/  # agent-owned episodic memory (data plane)
  runs/  # raw probe data: transcripts, verifier reports
  ledger.md  # adaptation ledger, write-ahead
```

**Four kinds of K** — phases communicate only through them; no phase calls another. `managed-system.yaml` — the operator calculus of the current prompt: the per-section **operator catalog** (amplifies / suppresses / mixes, strength — P1), the **interference pairs with their intended emergent behavior** (P4), the **collapse map** — ambiguities collapsed or preserved at design time, each with its collapse condition (P3); Analyze reasons over *this*, never raw prompt text. `environment.yaml` — per-goal-observable distributions (cluster probability and variance) and failure-taxonomy counts; a diffuse cluster is unresolved operator ambiguity, not noise (P7). `goals.yaml` — the done definition as a runtime object: observable, observer (which verifier or rubric, at which version), aggregation over a window, threshold, direction (I5; success is transcript × observer, P8); vibe or observer-less goals are rejected at configure; changing the observer is a ledger-recorded adaptation. `working/` — the candidate superposition, the pending plan, the cursor (P3).

**Control vs data plane (I2).** `prompt/`, `tools/`, `knowledge/` are manager-owned. `memory/` is agent-owned and the sole in-run mutable state: the manager *reads* it as a probe and may adapt its *schema* (an effector change to the memory conventions) but never hand-edits its content.

**The `ambiguities` record** — agent-owned, in `memory/`, written by the input-interpretation operator (below); schema in Templates. Monitor ingests it; recurrences are first-class Analyze evidence, and the natural adaptation is a collapse-map edit or a goal refinement (P3).

## The loop — four phases

```
runs/  --[1 Monitor]-->  environment.yaml
environment.yaml + goals.yaml + ledger.md + managed-system.yaml  --[2 Analyze]-->  working/  (weighted candidates)
working/  --[3 Plan]-->  working/  (collapsed plan + interference re-check list)
working/  --[4 Execute]-->  prompt/ + history/ + ledger.md + managed-system.yaml + manifest.yaml
```

Checkable: a dry run shows every hand-off as a K read/write pair, no phase naming another as callee.

**1 · Monitor — tomography of Ô_v (P6, P7).** Reconstructs the distribution, never reacts to one sample. Reads `runs/` since the cursor, `goals.yaml`, `manifest.yaml`, the `ambiguities` record; writes `environment.yaml` (the Monitor operator's marker lines map one-to-one onto its fields), advances the cursor, backfills the pending ledger outcome; invokes `assets/manage/monitor.md` and, when stakes warrant, the cross-run verifier. **Min-N gate:** no Analyze until N runs against the current version (default 5, `manifest.yaml`). Profile: Shape 2, mid — distributional structure and variance-as-signal; suppresses single-run reactivity and recommendations. Failure: cleaning a diffuse cluster into a point estimate.

**2 · Analyze — Bayesian update over candidate adaptations (P3, P8).** A weighted option distribution each Monitor batch updates; nothing pruned until Plan. Reads `environment.yaml`, `goals.yaml`, `ledger.md` (the **prior**), `managed-system.yaml`; writes `working/`: per option — weight, motivating finding, expected effect, class (`collapse_map_edit | targeted_diff | wholesale_rewrite | goal_or_observer_refinement`) — weights summing to 1.0 including a residual "none-qualify" mass; invokes the checklist in Mode A against the model, *conditioned on the failure taxonomy*, and `assets/manage/analyze.md`; diffuse clusters favor a collapse-map edit. **Ledger as prior (I4b):** backfilled outcomes re-weight before new evidence; an option equivalent to one that regressed against the same trigger gets weight ≈ 0 unless the human overrides — equivalence = same trigger + section + operator intent, not diff identity. **Tier-conditioned (P9):** a strengthening edit right on legacy over-projects on frontier. Residual mass dominant → escalate; no violation → the loop ends. Profile: Shape 2, mid. Failure: collapsing to one option (Plan's job), or new evidence outrunning the prior into oscillation.

**3 · Plan — the deliberate collapse (P2, P3, P4).** Collapses to one option, explicit like the interview's collapse block: refactor mode, rescheduled. Reads `working/`, `managed-system.yaml`, `manifest.yaml`; writes `working/`: the option, the ordered edit sequence, the **interference re-check list** (neighbors of every touched section, P4) and, on reordering, a **permutation test v2** requirement on the orderings touched (`references/quantum-principles.md`, Measurement protocols), the chosen ordering recorded in the ledger with its evidence; invokes refactor **Mode B** for localized findings, **Mode C** only on goal-management escalation. Profile: strong — one actionable plan. Failure: Mode C for a localized finding.

**4 · Execute — thin, gated, write-ahead (I4a, I6).** The edit is not invertible: snapshot first, write-ahead. *Reads* `working/` (the plan) and `manifest.yaml` (the autonomy gate); writes, in order: (1) draft the `ledger.md` entry; (2) present diff + entry for authorization unless an envelope covers it; (3) snapshot `prompt/current/` to `history/vNNN/`; (4) apply the diffs, persist `history/vNNN.patch.json` (I4c); (5) re-audit — checklist plus package verifier (Ship gate); (6) bump `prompt_version`; (7) **last:** update `managed-system.yaml` — the model after the system it models. Pass → `reaudit_pass`; fail → `reaudit_rollback`. Profile: Shape 6 verifier + effector, strong. Failure: a diff before the ledger entry or without a snapshot.

## Escalation and autonomy

**Envelope exceeded → goal management.** When Analyze finds no qualifying option (residual mass dominates, P8) or the goals are wrong: (1) halt, no Execute; (2) report the violated goals, the candidates and why each fell short, the residual mass; (3) hand off to refactor Mode C or a fresh from-scratch pass with `ledger.md` and `environment.yaml` as input. Humans extend the envelope; the loop resumes at `activate`.

**Autonomy (I6).** Only Execute writes an irreversible change, so it alone carries the gate: human-gated by default; Monitor, Analyze, Plan always run — they measure and propose. Full-autonomy Execute is opt-in via a bounded envelope; any envelope field null while `execute: enveloped` is a configure-time rejection.

```yaml
autonomy:
  execute: enveloped
  envelope:
    goals: [G2]  # which goal triggers may auto-execute
    option_classes: [targeted_diff]  # Mode B only, never Mode C
    max_diff_lines: 15  # blast-radius bound
    max_versions_since_human_review: 3  # periodic human checkpoint
```

## Input-interpretation operator

Without an operator preventing **accidental collapse**, the first streamed tokens project an input onto whichever reading dominates and discard what the manager later needs (P3). Every managed prompt ships it, **first or right after persona / domain, before the task definition** (P2). Four points: (1) **decompose before acting** — for task-defining inputs enumerate the weighted readings and the collapse map internally; (2) **collapse deliberately** — a reading clearly ahead (~30% margin, the shape-inference rule) → proceed, stating the assumption, no `ambiguities` entry; near-degenerate readings with architectural consequence → one collapse question only where `manifest.yaml` declares `deployment: interactive_clarify` (M3b), otherwise proceed on the most probable reading **and write the state vector + collapse condition to `ambiguities`**; (3) **evidence is partial measurement** — tool results update the weights (P8); a mid-run re-collapse is recorded — a strong Monitor signal; (4) **measurement-parameter awareness** (P6, P9) — where the runtime exposes sampling control and the decision is interpretation-critical, multi-sample self-consistency samples the distribution, not its mode; one runtime-conditioned sentence, no hard-coded parameters (I7). Profile: strong framing; frontier tier: brief, let native priors resolve the residual (P9). **Scope (M5):** task-defining inputs only — the brief, requirement changes, conflicting instructions — never routine tool output.

## Lifecycle contract

An explicit state machine gives adaptation a legal **seam** (I2): stop / restart and adaptation share INACTIVE — an agent that can be cleanly stopped is one that can be adapted. Effectors (prompt / tool diffs, P1) fire **only inside ADAPTING**.

```yaml
# lifecycle-machine — single source of truth; a gate checker parses this block and asserts closure + the I2/I3 predicates
initial: UNCONFIGURED
terminal: [FINALIZED]
states: [UNCONFIGURED, CONFIGURED, ACTIVE, INACTIVE, ADAPTING, FINALIZED]
transitions:
  - {name: configure, from: UNCONFIGURED, to: CONFIGURED, initializes_prompt: true,  mutates_prompt: false}
  - {name: activate_cold, from: CONFIGURED, to: ACTIVE, initializes_prompt: false, mutates_prompt: false, reads_only_package: true}
  - {name: activate_resume, from: INACTIVE, to: ACTIVE, initializes_prompt: false, mutates_prompt: false, reads_only_package: true}
  - {name: deactivate, from: ACTIVE, to: INACTIVE, initializes_prompt: false, mutates_prompt: false}
  - {name: adapt, from: INACTIVE, to: ADAPTING, initializes_prompt: false, mutates_prompt: false}
  - {name: reaudit_pass, from: ADAPTING, to: CONFIGURED, initializes_prompt: false, mutates_prompt: true}
  - {name: reaudit_rollback, from: ADAPTING, to: CONFIGURED, initializes_prompt: false, mutates_prompt: true}
  - {name: shutdown, from: INACTIVE, to: FINALIZED, initializes_prompt: false, mutates_prompt: false}
```

- **configure** — pre: a from-scratch or refactor delivery complete, and the **collapse block gate** (SKILL.md, Phase 2) passed over the package's own decisions — deployment, tier, min-N, autonomy, each goal's observable / observer / aggregation — posted and confirmed by the user before any file is written; post: K populated, `goals.yaml` validated (I5), `prompt/current/` written and snapshotted to `history/v001/`, `prompt_version = v001`. The sole prompt *initialization*.
- **activate** (cold or resume) — runtime rehydrated **from the package alone** (`manifest.yaml`, `prompt/current/`, `memory/`); restart-with-same-state *is* this transition (I3); an external resume dependency is a gate failure.
- **deactivate** — runtime stopped, transcript flushed to `runs/`, a Monitor pass updates `environment.yaml` and backfills the pending outcome; no prompt edits.
- **adapt** — pre: a qualifying option and Execute authorized (I6) or enveloped; the only state where effectors fire.
- **reaudit_pass** / **reaudit_rollback** — pre: effectors applied per the plan, the write-ahead entry drafted, the prior version snapshotted; the audit passes (version bumped, model updated last, CONFIGURED on the **new** version) or fails (prior snapshot restored, never an inverse diff, a ledger entry records it, CONFIGURED on the **prior** version); ADAPTING is never a dead end.
- **shutdown** — `manifest.yaml` marked FINALIZED; a read-only archive.

**Postconditions.** *I2:* any transition with neither end in ADAPTING leaves `sha256(prompt/current/**)` and `prompt_version` unchanged; only ADAPTING-involving transitions carry `mutates_prompt`, only `configure` carries `initializes_prompt`. *I3:* `activate`'s read-set ⊆ the package; ACTIVE → INACTIVE → ACTIVE preserves prompt sha + version while `memory/` carries across.

## Adaptation ledger

`ledger.md`: one entry per Execute, **write-ahead**; order is load-bearing (P2). `Key: value` fields parsed by the replay verifier; `Kind:` and `Version:` mandatory.

```
## vNNN — YYYY-MM-DD
Kind: adapt
Version: vNNN
Trigger: <goal id | section — observed aggregate vs threshold over window (prev version)>
Evidence: <runs range; failure-taxonomy counts>
Options: <A/B/... weighted; chosen marked; rejected-by-anti-oscillation noted>
Diff: prompt/history/vPREV -> vNNN  (patch: prompt/history/vNNN.patch.json)
Interference re-check: <neighbor sections checked (P4)>
Outcome: PENDING -> [backfilled by the next Monitor pass: improvement | regression | flat]

## vNNN — YYYY-MM-DD
Kind: rollback
Version: vNNN                 # the new pointer
Restore: vK                   # the snapshot restored — no Diff, no patch
Trigger: <goal id | section   (vPREV regressed against this trigger)>
Outcome: n/a
```

(I4a) No Execute without a drafted entry; every `adapt` `Outcome` is backfilled by the next Monitor pass over the same goal metric, and a `PENDING` older than one activation cycle blocks the next Analyze. (I4b) Anti-oscillation as defined in Analyze — the ledger is the prior. (I4c) `history/v001` + the ordered diffs reproduce `prompt/current/` **byte-identically** (`adapt` applies its patch, `rollback` restores the named snapshot), verified by `assets/manage/replay-verifier.py`; rollback restores snapshot vK and writes a `rollback` entry recording its trigger, never applies the reverse edit — an inverse diff is one more operator, not a return (P2).

## Ship gate and shipped artifacts

Two static layers check the *package*, invoked by Execute's re-audit and as the `reaudit_pass` precondition. **Mechanical** — `assets/manage/replay-verifier.py <package-dir> [--anti-osc '<trigger>|<section>|<intent>']`: replay and rollback-by-snapshot, byte-exact, printing `REPLAY PASS|FAIL`; `ANTI-OSC BLOCK` iff a prior regressed `adapt` shares the proposed trigger and section (intent is the grader's call). **Judged** — `assets/manage/package-verifier.md`, a Shape 6 prompt: I2, I3, I4a; I4b/c from the replay report, **UNVERIFIED** when absent. **Ship gate:** `REPLAY PASS` and `VERDICT: SHIP`; UNVERIFIED blocks. **Shipped artifacts (I9):** Monitor, Analyze and the grader are framework-designed operators with a declared shape and operator profile, agent-consumable (`references/agent-output.md`), each with an inline `CHECK` block that must pass and a filled worked example (the same scenario across Monitor and Analyze, no silent judgment call in the format). They are produced through the skill's own procedure, not hand-written — the grader as a Shape 6 prompt with full audit and dogfood, running its own checks against itself before shipping; only the replay verifier is a conventional script.

## Templates

A package hand-instantiated from these templates alone must require no improvisation. Every field required unless marked optional; no vendor / model names in normative fields (I7).

```yaml
# manifest.yaml
agent_id: ""  # stable slug; must equal the directory name (I3)
shape: ""  # one of the seven shapes
domain: ""  # engineering | research | writing | ops | generic
tier: strong  # frontier | strong | legacy  (unknown -> strong, P9)
runtime: ""  # capability descriptor of the substrate, not a product bet
deployment: unattended  # unattended | interactive_clarify | interactive_flag — the deployment-context answer (references/shapes.md)
lifecycle_state: UNCONFIGURED
prompt_version: v001  # current Ô_v; matches prompt/current + a history/ snapshot
min_n: 5  # runs required before Analyze may fire (P7)
autonomy:   # I6
  execute: gated          # gated | enveloped
  envelope: null          # if enveloped: {goals, option_classes, max_diff_lines, max_versions_since_human_review}
```

```yaml
# goals.yaml — each goal pins its observer (I5, P8); a goal missing observer, or stated as a vibe, is rejected at configure.
goals:
  - id: ""  # stable handle, e.g. G1
    observable: ""  # what is read from a run (e.g. task_completion_score)
    observer:  # the measurement operator — never omitted
      kind: ""  # verifier_prompt | rubric | metric
      ref: ""  # artifact path or rubric id
      version: ""  # changing it is a ledger-recorded adaptation
    aggregation: ""  # mean | median | pass_rate | p90 ...  over the window
    window: 5  # runs combined by aggregation (>= min_n to fire)
    threshold: 0.0  # scalar the aggregate is compared against
    direction: ">="  # >= | <= | ==
```

```yaml
# ambiguities record — agent-owned, in memory/; the manager reads it, never hand-edits it (I2).
ambiguities:
  - id: ""  # stable handle for recurrence detection across runs
    input_ref: ""  # which task-defining input raised it
    interpretations:  # the weighted state vector (sums ~1.0)
      - reading: ""
        weight: 0.0
    collapsed_to: ""  # the reading the agent proceeded on
    collapse_condition: ""# what evidence/answer would have resolved it
    recollapse_events: [] # mid-run flips under evidence — [{run_step, from, to}]
```
