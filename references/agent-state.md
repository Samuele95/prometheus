# Agent state — the managed-agent package (K-store)

The runtime object of **manage mode**. One directory per agent; the agent's
identity **is** this directory — no state survives anywhere else (invariant I3).
This reference defines the package layout, the four knowledge files, the
control/data-plane boundary, the input-interpretation operator every managed
prompt carries, the lifecycle contract, and the adaptation-ledger protocol.

## Frame (I1)

This is MAPE-K expressed **through the framework's operator algebra**, not
alongside it. The one identification everything below rests on: a managed
agent's prompt is an operator Ô_v; a run is a measurement of the distribution
Ô_v induces; adaptation is the manager producing Ô_v+1; the ledger is the
operator-composition history. Every normative concept in this file therefore
carries a `§` anchor into the quantum-semantics document or a Principle number
(P1–P9, `references/quantum-principles.md`). A MAPE/SAS term without its
operator-algebra expression is a defect, not shorthand.

## Package layout

```
agents/<agent-id>/
  manifest.yaml          # identity, shape, domain, tier, runtime,
                         # lifecycle state, current prompt version, min-N,
                         # autonomy envelope
  prompt/
    current/             # live prompt artifact(s) — the operator Ô_v
    history/vNNN/        # immutable snapshots, one per Execute
  tools/manifest.yaml    # tool definitions + versions (effector-editable)
  knowledge/
    managed-system.yaml  # semantic-state model of Ô_v (§2.2)
    environment.yaml     # Environment Model: aggregated run facts
    goals.yaml           # Adaptation Goals Model: observable+observer+aggregation
    working/             # MAPE Working Models: candidate superposition, cursor
  memory/                # agent-owned episodic memory (data plane)
  runs/                  # raw probe data: transcripts, verifier reports
  ledger.md              # adaptation ledger (write-ahead)
```

## The four knowledge files (the four kinds of K)

Stages communicate only through K (Wave I discipline — K is the bloodstream)
because each MAPE pass is an irreversible measurement (§5.6 · P5): nothing
survives a phase except what it writes to K. No stage calls another. Each file is
one canonical kind of Knowledge — the file-backed runtime model of Ô_v (§2.2) —
and each carries its own § grounding in its subsection.

### `managed-system.yaml` — semantic-state model of Ô_v · [§2.2, §5.3, §5.4 · P1, P4]

**Not a file inventory — the operator algebra of the current prompt.** It
persists what Phase 3/4 already computes at design time and today discards
after delivery:

- the per-section **operator catalog** (what each section amplifies /
  suppresses / mixes, its strength, its commutation notes — §5.3, P1);
- the known **interference pairs** with their intended emergent behavior
  (§5.4, P4);
- the **collapse map** (Prompt I / Program 1 output): which ambiguities were
  deliberately collapsed at design time, which were deliberately preserved,
  each preserved one with its collapse condition (§5.2, P3).

Analyze reasons over *this*, not over raw prompt text: an adaptation is a
transformation of this model first, a text diff second. This is Wave III's
"runtime model, first-class," made quantum-native.

### `environment.yaml` — Environment Model · [§2.4, §4.2 · P6]

Aggregated run facts written by Monitor: per-goal-observable **goal-metric
distributions** (cluster probability = |cᵢ|², cluster variance = collapse
sharpness — Table 8 statistics) and failure-taxonomy counts. Variance is
first-class: a diffuse cluster signals unresolved ambiguity in the operator,
not merely noisy runs.

### `goals.yaml` — Adaptation Goals Model · [§1.2 · P8]

The Phase-2 interview discipline ("done definition — checkable, not vibe")
promoted to a runtime object. **Meaning actualization is observer-dependent**
(|ψ_interpreted⟩ = Ô|ψ⟩/‖Ô|ψ⟩‖, Eq. 2): "the agent succeeded" is a property of
transcript × measurement operator, never the transcript alone. Every entry
therefore declares three fields (invariant I5):

- **observable** — what is read from the run;
- **observer** — which verifier prompt or rubric, at which version (the
  measurement operator Ô);
- **aggregation** — how per-run measurements combine over the window.

Vibe goals and observer-less goals are rejected at configure time. Changing the
observer is itself an adaptation and gets a ledger entry — otherwise metric
drift masquerades as agent drift.

### `working/` — MAPE Working Models · [§5.2 · P3]

The weighted candidate-option superposition (Prompt A shape), the pending plan,
and the monitor cursor. Superposition is preserved here until Plan performs the
deliberate collapse — options are not pruned early (§5.2, P3).

## Control plane vs data plane · [I2; memory-as-probe: §5.5, §2.4 · P6]

`prompt/`, `tools/`, `knowledge/` are **manager-owned** (control plane).
`memory/` is **agent-owned** (data plane): the agent writes it during runs; the
manager *reads* it as a probe and may adapt its *schema* (an effector change to
the prompt's memory-file conventions) but never hand-edits its *content*. This
boundary keeps the internal principle intact — the agent stays ignorant of the
managing layer — while still giving the agent persistent memory across runs.
`memory/` is the sole in-run mutable state.

## Runtime superposition: the `ambiguities` record · [§5.2, §5.6 · P3, P5]

A managed agent preserves superposition **at runtime**, not just in its design
documents. Its memory-file conventions (drafted into the prompt at configure
time) include an `ambiguities` section in the Prompt A/I schema: when the agent
hits genuine input ambiguity mid-run, it records the weighted interpretations,
the default it collapsed to, and the collapse condition that would have resolved
it — instead of collapsing silently (§5.6: silent collapse destroys exactly the
information the manager needs to diagnose "the agent misunderstood the task").

Monitor ingests this as a probe. Recurring entries against the same ambiguity
are first-class Analyze evidence, and the natural adaptation is a collapse-map
edit (resolve it in the prompt) or a goal refinement — cheaper and
better-targeted than behavior-steering edits.

## Input-interpretation operator (§2.1, §2.4)

The managed agent's inputs are semantic states in superposition, and the
substrate interpreting them is empirically non-classical (§1.3: CHSH violations
of 2.3–2.8 in LLMs rule out semantic hidden variables). The agent does not need
machinery to *simulate* quantum interpretation — the model already holds
|ψ_input⟩ natively. It needs an operator that prevents **accidental collapse**:
without one, the first tokens the agent streams project the input onto whatever
interpretation happened to dominate, silently and irreversibly (§5.6), and the
destroyed alternatives are exactly what the manager later needs.

Every managed prompt therefore ships this operator, placed **early in the
spine** (broadest framing — it sets the subspace all later operators act
within, §5.1, P2).

### Operator profile · [D5 — hosted here; `operators/section-operators.md` stays frozen]

- **Amplifies:** faithful multi-interpretation reading of task-defining inputs;
  explicit collapse conditions; recorded residual ambiguity.
- **Suppresses:** premature single-reading commitment; silent default-taking on
  architecturally consequential ambiguity.
- **Mixes:** interpretation weights with incoming evidence (tool results as
  partial measurement, §2.4).
- **Strength:** strong — it is a framing operator, among the first applied.
  Tier-conditioned per P9: on frontier substrates keep it brief and let native
  priors resolve residual superposition; it over-projects if enumerated heavily.
- **Place:** first, or immediately after persona/domain. Non-commutative with
  the task-definition operator — decomposing *after* the task frame has already
  collapsed the reading defeats the purpose (§5.1, P2).
- **Commutation:** non-commutative with any operator that fixes an
  interpretation (task definition, output format). Commutes loosely with tone.
- **Failure mode:** running full decomposition on *routine* tool output — burns
  attention budget on ritual. Its trigger is bounded to task-defining inputs
  (see scope clause).

### Operator section text (the four points)

1. **Decompose before acting** (Program 1, superposition_decompose). For
   task-defining inputs, internally enumerate the weighted interpretation vector
   and the collapse map — which ambiguous term, which question or evidence would
   resolve it (Prompt I discipline, §5.2 · P3).
2. **Collapse deliberately, by the framework's own rule.** Dominant
   interpretation clearly ahead (~30% margin, reused from Phase-1 shape
   inference) → collapse and proceed, nothing recorded. Near-degenerate weights
   with architectural consequence → ask one targeted collapse question if a
   caller channel exists; otherwise proceed on the most probable eigenstate
   **and write the full state vector + collapse condition to the `ambiguities`
   record** (§5.2, §5.6 · P3, P5).
3. **Evidence is partial measurement** (Program 5, Bayesian_Collapse; §2.4,
   §1.2 · P6, P8). Tool results and intermediate outcomes update interpretation
   weights during the run. A mid-run re-collapse — the dominant interpretation
   flipping under evidence — is a recordable event in `ambiguities` and a strong
   Monitor signal that the design-time collapse map missed a live ambiguity.
4. **Measurement-parameter awareness** (§5.5 · P6, tier-conditioned per P9).
   Where the runtime exposes sampling control and the decision is
   interpretation-critical, multi-sample self-consistency approximates Bayesian
   interpretation sampling — the distribution, not the mode. One sentence in the
   operator, runtime-conditioned; never hard-coded parameters (I7).

**Scope clause (M5 restraint).** Full decomposition applies to task-defining
inputs only — the initial brief, requirement changes, conflicting instructions
— never to routine tool output. The operator ships by default in managed
packages (it is what makes the agent quantum rather than merely
quantum-designed), but its per-input activation is gated by its own text.

The loop this closes: design-time collapse map (`managed-system.yaml`) declares
what was resolved and what was left open → runtime `ambiguities` record captures
what reality forced open → Monitor ingests both → Analyze proposes collapse-map
edits when the same ambiguity recurs. Input interpretation, agent state, and
adaptation are one circuit in the same algebra.

## Lifecycle contract (stop/restart semantics)

The ROS 2 managed-node insight, ported: give the agent an explicit state machine
so adaptation has a legal **seam**, and the agent can be steered without knowing
it is steered (internal principle, I2). Stop/restart and adaptation share one
mechanism — the INACTIVE seam — which is deliberate: an agent that can be cleanly
stopped is *by construction* an agent that can be adapted.

```
UNCONFIGURED --configure--> CONFIGURED --activate--> ACTIVE
                                ^                      |
                                | (re-audit)        deactivate
                                |                      |
                                |                      v
                             ADAPTING <--adapt----- INACTIVE --activate--> ACTIVE
                                                       |
                                                    shutdown
                                                       v
                                                   FINALIZED
```

Six states, one initial (UNCONFIGURED), one terminal (FINALIZED, an archive).
Effectors (prompt/tool diffs — operator re-design, §5.3 · P1) fire **only inside
ADAPTING**; the prompt is immutable in every other state (I2).

### Transitions (pre/postconditions)

- **configure** · UNCONFIGURED → CONFIGURED. *Pre:* from-scratch or refactor
  delivery complete. *Post:* package initialized — K populated, `goals.yaml`
  validated checkable (I5), `prompt/current/` written and snapshotted to
  `history/v001/`, `prompt_version = v001`. This is the sole prompt
  *initialization* (birth of Ô_v001), distinct from effector *mutation*.
- **activate** · CONFIGURED → ACTIVE, and INACTIVE → ACTIVE. *Pre:* package
  present. *Post:* runtime rehydrated **from the package alone** — read
  `manifest.yaml`, load `prompt/current/` into the runtime, hand the agent its
  `memory/` per its memory-file conventions. Restart-with-same-state *is* this
  transition (I3). Any resume dependency outside the package is a gate failure.
  Prompt unchanged (I2).
- **deactivate** · ACTIVE → INACTIVE. *Pre:* runtime running. *Post:* runtime
  stopped; the run's transcript flushed to `runs/`; a Monitor pass updates
  `environment.yaml` and backfills the pending ledger outcome. **No prompt
  edits** (I2). Every interpretation the run collapsed silently is now either in
  the transcript or lost (§5.6 · P5) — the `ambiguities` record is what the
  agent preserved on purpose.
- **adapt** · INACTIVE → ADAPTING. *Pre:* Analyze produced a qualifying option
  and Execute is authorized (I6) — or an autonomy envelope covers it. *Post:*
  entered the only state where effectors may fire.
- **re-audit (pass)** · ADAPTING → CONFIGURED. *Pre:* effectors applied per the
  Plan; write-ahead ledger entry drafted (I4a); prior version snapshotted. *Post:*
  Phase-4 audit passes on the new operator; `prompt_version` bumped;
  `managed-system.yaml` updated last (canonical MAPE discipline). Agent CONFIGURED
  on the new version.
- **re-audit (fail → rollback)** · ADAPTING → CONFIGURED. *Pre:* Phase-4 audit
  fails on the edited operator. *Post:* snapshot of the prior version restored
  (never an inverse diff — §5.6 · P5); a ledger entry records the rollback and
  its trigger. Agent CONFIGURED on the **prior** version. This keeps ADAPTING
  from being a dead end.
- **shutdown** · INACTIVE → FINALIZED. *Post:* `manifest.yaml` marked FINALIZED;
  package becomes a read-only archive. Terminal.

### Checkable postconditions

- **I2 (prompt immutability outside ADAPTING).** For any transition whose source
  and target are both ≠ ADAPTING, the postcondition includes
  `sha256(prompt/current/**)` unchanged **and** `prompt_version` unchanged. Only
  ADAPTING-involving transitions carry `mutates_prompt`; only `configure` carries
  `initializes_prompt`. Encoded in the machine table below and checked mechanically.
- **I3 (stop/restart round-trip in package terms).** `activate`'s read-set is a
  subset of the package (`manifest.yaml`, `prompt/current/`, `memory/`); nothing
  external. The round-trip ACTIVE → deactivate → INACTIVE → activate → ACTIVE
  contains no ADAPTING state, so by the I2 rule it preserves prompt sha +
  version, while `memory/` written during the first ACTIVE is carried into the
  second — the "same inner state" claim, made checkable.

### Lifecycle machine (canonical, machine-readable)

The single source of truth for the state machine. The Stage-2 gate checker
parses *this block* and asserts closure + the I2/I3 predicates — the spec is
verified, not a separate copy.

```yaml
# lifecycle-machine
initial: UNCONFIGURED
terminal: [FINALIZED]
states: [UNCONFIGURED, CONFIGURED, ACTIVE, INACTIVE, ADAPTING, FINALIZED]
transitions:
  - {name: configure,        from: UNCONFIGURED, to: CONFIGURED, initializes_prompt: true,  mutates_prompt: false}
  - {name: activate_cold,    from: CONFIGURED,   to: ACTIVE,     initializes_prompt: false, mutates_prompt: false, reads_only_package: true}
  - {name: activate_resume,  from: INACTIVE,     to: ACTIVE,     initializes_prompt: false, mutates_prompt: false, reads_only_package: true}
  - {name: deactivate,       from: ACTIVE,       to: INACTIVE,   initializes_prompt: false, mutates_prompt: false}
  - {name: adapt,            from: INACTIVE,     to: ADAPTING,   initializes_prompt: false, mutates_prompt: false}
  - {name: reaudit_pass,     from: ADAPTING,     to: CONFIGURED, initializes_prompt: false, mutates_prompt: true}
  - {name: reaudit_rollback, from: ADAPTING,     to: CONFIGURED, initializes_prompt: false, mutates_prompt: true}
  - {name: shutdown,         from: INACTIVE,     to: FINALIZED,  initializes_prompt: false, mutates_prompt: false}
```

## Adaptation ledger protocol

`ledger.md`, Keep-a-Changelog-derived, one entry per Execute, **write-ahead**:
the entry exists before the diff is applied. The composition order is the state
(P2), so the ledger is the operator-composition history and its order is
load-bearing.

### Entry schema (machine-parseable)

Each entry carries structured `Key: value` fields the replay verifier parses
deterministically, plus prose. Two `Kind`s: `adapt` and `rollback`.

```
## v003 — 2026-07-12
Kind:      adapt
Version:   v003
Trigger:   G1 | premature-stop
Evidence:  runs/0031-0036; failure taxonomy: premature-stop x4
Options:   A. add anti-early-stopping operator (audit L3)   <- chosen
           B. strengthen done-definition (rejected: equivalent to v-prev regressed)
Diff:      prompt/history/v002 -> v003  (patch: prompt/history/v003.patch)
Interference re-check: checkpoint-policy ok
Outcome:   PENDING -> [backfilled: regression]

## v004 — 2026-07-12
Kind:      rollback
Version:   v004
Restore:   v002
Trigger:   G1 | premature-stop   (v003 regressed against this trigger)
Outcome:   n/a (rollback restores a snapshot, never an inverse diff)
```

- `Kind: adapt` entries carry `Version`, `Trigger`, `Diff` (with a `patch:`
  reference), and a backfillable `Outcome`.
- `Kind: rollback` entries carry `Version` (the new pointer) and `Restore` (the
  snapshot version restored). No patch; the current prompt is *set to* the
  restored snapshot (P5 — restore, never inverse diff).

### Rules with teeth

1. **Write-ahead (I4a).** No Execute without a drafted entry. An unlogged
   adaptation is a defect, not a shortcut.
2. **Backfill.** Every `adapt` `Outcome` is backfilled by the next Monitor pass
   over the same goal metric (`PENDING -> improvement | regression | flat`). A
   `PENDING` older than one activation cycle blocks the next Analyze.
3. **Anti-oscillation (I4b).** Analyze may not propose an option equivalent to
   one whose backfilled outcome was `regression` against the same trigger,
   unless the human overrides. Equivalence = same trigger + same section + same
   operator intent (D3), not textual diff identity. This is the ledger
   functioning as the Bayesian prior (§2.4).
4. **Replay property (I4c).** `history/v001` + the ordered ledger diffs must
   reproduce `prompt/current/` **byte-identically** (P2). `adapt` steps apply
   their patch; `rollback` steps restore the named snapshot. Verified
   programmatically by `manage/replay-verifier.py`.
5. **Rollback = restore snapshot vK** + a `rollback` ledger entry recording the
   trigger. Never "apply the reverse edit" (P5 — projection is irreversible; an
   inverse diff is not a return to the prior state).

## Templates

Canonical templates for hand-instantiating a package. A package built from
these alone must require no improvisation (Stage 1 gate).

### `manifest.yaml`

```yaml
# Managed-agent manifest — identity + control state.
# Every field REQUIRED unless marked optional. No vendor/model names in
# normative fields (I7); runtime is a capability descriptor, not a product bet.
agent_id: ""              # stable slug; must equal the directory name (I3)
shape: ""                 # one of the seven shapes (see shape-catalog.md)
domain: ""                # engineering | research | writing | ops | generic
tier: strong              # frontier | strong | legacy  (unknown -> strong, P9)
runtime: ""               # capability descriptor of the execution substrate
lifecycle_state: UNCONFIGURED   # set by lifecycle transitions (Stage 2)
prompt_version: v001      # current Ô_v; matches prompt/current + a history/ snapshot
min_n: 5                  # runs required before Analyze may fire (D2 default; §5.5)
autonomy:                 # I6 — Execute is human-gated unless a bounded envelope is declared
  execute: gated          # gated | enveloped
  envelope: null          # if enveloped: {goals: [...], option_classes: [...],
                          #   max_diff_lines: N, max_versions_since_human_review: N}
```

### `goals.yaml`

```yaml
# Adaptation Goals Model. Each goal pins its observer (I5, §1.2 · P8).
# REQUIRED per entry: observable, observer, aggregation, threshold, direction.
# A goal missing observer, or stated as a vibe, is rejected at configure time.
goals:
  - id: ""                # stable handle, e.g. G1
    observable: ""        # what is read from a run (e.g. task_completion_score)
    observer:             # the measurement operator Ô — never omitted
      kind: ""            # verifier_prompt | rubric | metric
      ref: ""             # artifact path or rubric id
      version: ""         # observer version; changing it is a ledger-recorded adaptation
    aggregation: ""       # mean | median | pass_rate | p90 ...  over the window
    window: 5             # runs combined by aggregation (>= min_n to fire)
    threshold: 0.0        # scalar the aggregate is compared against
    direction: ">="       # >= | <= | ==  (predicate over observable data, I5)
```

### `ambiguities` record schema (agent-owned, in `memory/`)

```yaml
# Written by the managed agent at runtime when it hits genuine input ambiguity.
# The manager READS this (probe); it never hand-edits content (I2, data plane).
ambiguities:
  - id: ""                # stable handle for recurrence detection across runs
    input_ref: ""         # which task-defining input raised it
    interpretations:      # the weighted state vector (Prompt A shape, sums ~1.0)
      - reading: ""
        weight: 0.0
    collapsed_to: ""      # the eigenstate the agent proceeded on
    collapse_condition: ""# what evidence/answer would have resolved it
    recollapse_events: [] # mid-run flips under evidence (§2.4) — [{run_step, from, to}]
```

### ledger entry skeleton

> Full schema and rules in the **Adaptation ledger protocol** section (Stage 4).
> Skeleton shown here for template completeness:

```
## vNNN — YYYY-MM-DD
Kind:      adapt
Version:   vNNN
Trigger:   <goal id | section — observed aggregate vs threshold over window (prev version)>
Evidence:  <runs range; failure taxonomy counts>
Options:   <A/B/... weighted; chosen marked; rejected-by-anti-oscillation noted>
Diff:      prompt/history/vPREV -> vNNN  (patch: prompt/history/vNNN.patch.json)
Interference re-check: <neighbor sections checked, §5.4 · P4>
Outcome:   PENDING -> [backfilled by next Monitor pass over the same metric]
```

The `Kind:` and `Version:` fields are mandatory — the replay verifier parses
them (a `rollback` entry carries `Kind: rollback` + `Restore: vK` instead of a
Diff). Full schema in the **Adaptation ledger protocol** section.
