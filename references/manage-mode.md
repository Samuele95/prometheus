# Manage mode — the MAPE loop over a managed agent

The third mode. Where from-scratch designs an agent and refactor reshapes a
prompt, **manage mode runs an agent across its lifetime**: it monitors runs,
analyzes goal violations, plans an adaptation, and executes it at the lifecycle
seam — then remembers what it did so it does not repeat a mistake. Throughout,
the agent's prompt is an operator Ô_v and adaptation is the manager producing
Ô_v+1 (P1; grounding per phase in the Frame section). It adds almost no new
analytical machinery; it *schedules* existing machinery (audit checklist,
refactor modes, cross-run verifier) into four canonical phases.

Package layout, K-store contents, lifecycle, and ledger are in
`references/agent-state.md`. This file is the procedure.

## Frame (I1)

MAPE-K through the operator algebra. A run is a Born-rule sample of the
distribution Ô_v induces; Monitor reconstructs the distribution, Analyze keeps
candidate operators in superposition, Plan is the deliberate collapse, Execute
is the irreversible measurement that writes Ô_v+1. Every phase below names its
quantum grounding with `§` anchors (P1–P9, `references/quantum-principles.md`).

The loop is layered by timescale (Kramer & Magee's three-layer decomposition):
*component control* (within a run — the agent acts; the manager does not touch
it) sits below *change management* (between runs — the MAPE loop adapts the
operator at the seam), which sits below *goal management* (the escalation to
Stage IV when the goals themselves are wrong). The min-N gate is exactly the
boundary between the first two layers: never adapt on a within-run sample.

## K is the bloodstream (no stage-to-stage calls)

The four phases **never call each other**. Each reads from K and writes to K;
the next phase reads what the previous one wrote. This is Wave I discipline, and
it follows from the algebra: each pass is an irreversible measurement (§5.6 ·
P5), so nothing survives a phase except what it persists to K. It is checkable: a
dry-run of the loop must show every hand-off as a K read/write pair, with no
phase naming another phase as a callee. The data-flow contract:

```
runs/  --[1M Monitor]-->  environment.yaml
environment.yaml + goals.yaml + ledger.md + managed-system.yaml
       --[2M Analyze]-->  working/  (weighted candidate superposition)
working/  --[3M Plan]-->  working/  (collapsed plan + interference re-check list)
working/  --[4M Execute]-->  prompt/ + history/ + ledger.md + managed-system.yaml + manifest.yaml
```

## Phase 1M — Monitor · [§2.4, §4.2 · P6]

**State tomography of the operator Ô_v.** Each run is one Born-rule sample;
Monitor's job is to reconstruct the distribution, never to react to a single
sample (§5.5 · P6).

- **Reads from K:** `runs/` since `working/` monitor cursor; `goals.yaml` (which
  observables to cluster on); `manifest.yaml` (`min_n`, `prompt_version`).
- **Writes to K:** `environment.yaml` (per-observable cluster probability =
  |cᵢ|², cluster variance = collapse sharpness, failure-taxonomy counts —
  Table 8 statistics; the Monitor operator's greppable marker lines map one-to-one
  onto these fields, which the phase serializes into the YAML); advances the
  monitor cursor in `working/`; backfills the pending `ledger.md` outcome for the
  current version.
- **Invokes:** the **cross-run verifier** (`references/verifier-specification.md`,
  cross-run layer) as the distributional probe when stakes warrant; the
  Monitor operator artifact (`manage/monitor-operator.md`) for the clustering
  pass. Ingests the agent's `memory/` `ambiguities` record as a probe.
- **Min-N gate:** no Analyze until N runs have accumulated against the current
  version (default N=5, `manifest.yaml`). Rationale §5.5: at T>0 a single run
  samples the distribution; adapting on it is reacting to measurement noise.
- **Operator profile:** Shape 2 (one-shot classification/extraction). *Amplifies:*
  distributional structure, variance as signal. *Suppresses:* single-run
  reactivity, narrative. *Strength:* mid. *Failure mode:* treating a diffuse
  cluster as noise rather than as unresolved operator ambiguity (§4.2
  territory) — a diffuse cluster is diagnostic on its own and may call for a
  superposition-collapsing edit, not a behavior-steering one.

## Phase 2M — Analyze · [§2.4, §1.2 Bayesian collapse · §5.2 preserved superposition · P3, P8]

**Program 5 (Bayesian_Collapse).** Maintain a weighted candidate-option
distribution; each Monitor evidence batch is a partial measurement that updates
it (§2.4, §1.2). Superposition is preserved here — options are not pruned until
Plan (§5.2 · P3).

- **Reads from K:** `environment.yaml` (the evidence batch); `goals.yaml` (which
  observables are in violation, and their pinned observers); `ledger.md` (the
  **prior** — I4b); `managed-system.yaml` (the semantic-state model Analyze
  reasons over, **not** raw prompt text).
- **Writes to K:** `working/` — the weighted candidate-option superposition
  (Prompt A shape: option, weight, motivating finding, expected effect on the
  goal observable), weights summing to 1.0 with a residual "other/none-qualify"
  mass.
- **Invokes:** the **audit checklist** (`references/audit-checklist.md`, Phase 4
  / Mode A) against the current prompt *conditioned on the observed failure
  taxonomy*, to generate candidate adaptation options; the Analyze operator
  artifact (`manage/analyze-operator.md`).
- **Ledger as prior (I4b, anti-oscillation):** backfilled outcomes re-weight
  *before* new evidence does. An option equivalent to one whose recorded outcome
  was regression against the same trigger gets weight ≈ 0. Option strength is
  tier-conditioned (P9): a strengthening edit right on a legacy substrate
  over-projects on frontier.
- **Envelope check:** if residual "none-qualify" mass dominates (no option
  plausibly reaches the goals), declare **envelope exceeded** and escalate (see
  below). If no violation at all: the loop ends and the agent may reactivate
  unchanged.
- **Operator profile:** Shape 2 with the Prompt A output contract. *Amplifies:*
  option diversity with honest weights, ledger-informed pruning. *Suppresses:*
  premature single-option commitment, re-proposing known regressions.
  *Strength:* mid. *Failure mode:* collapsing to one option here — that is
  Plan's job, not Analyze's.

## Phase 3M — Plan · [§1.2 deliberate collapse · §5.4 interference · §2.3 fidelity · P4, P7]

**The deliberate measurement step.** Collapse the candidate superposition to one
option — made explicit exactly like the Phase-2 summary collapse (§1.2). This is
refactor mode, rescheduled.

- **Reads from K:** `working/` (the candidate superposition); `managed-system.yaml`
  (interference pairs, to build the re-check list); `manifest.yaml` (autonomy
  envelope, to know whether Execute will be gated).
- **Writes to K:** `working/` — the collapsed plan: the chosen option, the
  ordered edit sequence, the **interference re-check list** (neighbors of every
  touched section, §5.4 · P4), and — if the option reorders sections — the
  **fidelity-test** requirement (Prompt D/L, §2.3): run both orderings, compare;
  F = |⟨ψ_AB|ψ_BA⟩|² < 0.99 confirms the pair does not commute and the ordering
  choice must be recorded in the ledger with its evidence.
- **Invokes:** **refactor mode** (`references/refactor-mode.md`) — **Mode B**
  (targeted diff) for localized findings; **Mode C** (wholesale rewrite) only on
  goal-management-level escalation. Blast radius picks the sub-mode.
- **Operator profile:** the existing refactor-mode procedure (already
  framework-shaped). *Amplifies:* single actionable plan, interference
  awareness. *Suppresses:* multi-option ambiguity (deliberately — this is where
  collapse belongs). *Strength:* strong. *Failure mode:* choosing Mode C for a
  localized finding — over-projection; a wholesale rewrite where a targeted diff
  was warranted.

## Phase 4M — Execute · [§5.6 irreversibility · P5]

**New, thin, gated.** Every interpretation step destroys information (§5.6); the
edit is not invertible, so the protocol is snapshot-first and write-ahead.

- **Reads from K:** `working/` (the collapsed plan); `manifest.yaml` (autonomy
  gate).
- **Writes to K, in order:** draft the **write-ahead** `ledger.md` entry (I4a) →
  present diff + ledger entry for authorization (I6) unless a bounded envelope
  covers it → snapshot `prompt/current/` to `history/vNNN/` → apply diffs →
  **persist the diff as `history/vNNN.patch.json`** (the line-delta the replay
  verifier composes, I4c) → re-audit (Phase 4 machinery + the manage-mode static
  verifier) → bump `prompt_version` in `manifest.yaml` → **last act: update
  `managed-system.yaml`**
  (canonical MAPE discipline: the runtime model is updated after the system it
  models). Agent returns to CONFIGURED via the lifecycle `reaudit_pass`
  transition; a failed re-audit takes `reaudit_rollback` (restore snapshot, P5).
- **Invokes:** Phase-4 audit checklist; the manage-mode static verifier
  (`references/verifier-specification.md`); the lifecycle transitions in
  `agent-state.md`.
- **Operator profile:** Shape 6 verifier + effector application. *Amplifies:*
  auditability (write-ahead ledger), reversibility-by-snapshot. *Suppresses:*
  unlogged edits, inverse-diff rollback. *Strength:* strong. *Failure mode:*
  applying a diff before the ledger entry exists (I4a violation) or without a
  snapshot (loses the only legal rollback path, §5.6).

## Escalation protocol (envelope exceeded → Stage IV)

Weyns' four-stage life cycle: manage mode handles *anticipated* change within
the option space the goals and audit checklist span (Stage III). When Analyze
finds no qualifying option — the residual "none-qualify" mass dominates, i.e. no
interpretation the manager can reach projects onto the goal subspace (§1.2 · P8)
— or the goals themselves are wrong, the envelope is exceeded (Stage IV):

1. Manage mode **halts** — no Execute.
2. Reports: the goal(s) in violation, the candidate options and why each fell
   below threshold, the residual mass.
3. Hands off to **refactor Mode C** or a fresh **from-scratch** pass, *with the
   ledger and `environment.yaml` as input context*. Humans extend the envelope
   (add goals, revise the observer, redesign the operator); the loop resumes at
   `activate`.

## Autonomy envelope declaration (I6)

Execute is human-gated by default. Only Execute writes an irreversible operator
change (§5.6 · P5), so it is the phase that carries the gate; Monitor, Analyze,
and Plan run autonomously because they only measure and propose. Full-autonomy
Execute is opt-in per agent via an explicit bounded envelope in `manifest.yaml`:

```yaml
autonomy:
  execute: enveloped
  envelope:
    goals: [G2]                         # which goal triggers may auto-execute
    option_classes: [targeted_diff]     # Mode B only, never Mode C
    max_diff_lines: 15                  # blast-radius bound
    max_versions_since_human_review: 3  # force a human checkpoint periodically
```

Declaring autonomy without bounds (any field null while `execute: enveloped`) is
a configure-time rejection. Monitor/Analyze/Plan always run autonomously; only
Execute is gated — the internal principle scoped honestly.
