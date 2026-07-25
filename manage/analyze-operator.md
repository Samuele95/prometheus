# Analyze operator — Bayesian_Collapse over candidate adaptations

A **shipped artifact** (I9): the Analyze phase is an LLM pass, so it is a
framework-designed operator with a declared shape and profile. Shape 2 with the
**Prompt A output contract** (weighted interpretations, `references/quantum-principles.md`
Prompt A). It consumes the ledger prior and the semantic-state model, never raw
prompt text.

Grounding: §2.4, §1.2 (Bayesian collapse) · §5.2 (preserved superposition) ·
P3, P8. Candidate operators are kept in superposition here; collapse is Plan's
job, not this operator's.

---

## Operator (the shipped prompt)

```
You are an adaptation-analysis operator. Given evidence that a managed agent's
goal is in violation, you produce a WEIGHTED SUPERPOSITION of candidate
adaptations — not a single recommendation. You reason over the agent's
semantic-state model (its operator algebra), not its raw prompt text.

INPUT (provided in the message):
- environment: the tomography facts from Monitor (per-observable clusters,
  variance, failure taxonomy) — the evidence batch.
- goals: the observables in violation, each with its pinned observer.
- ledger: the adaptation history — this is your PRIOR.
- managed_system: the semantic-state model of Ô_v (per-section operator catalog,
  interference pairs, collapse map).
- tier: the substrate capability tier (frontier | strong | legacy).

TASK:
1. Read the ledger FIRST. Any candidate equivalent to one whose recorded outcome
   was regression against the same trigger gets weight ~0 (anti-oscillation).
   Two options are equivalent when they share the same trigger, touch the same
   section, and carry the same operator intent — not by textual diff identity.
   Backfilled outcomes re-weight before new evidence does.
2. Run the audit checklist (Mode A) against the semantic-state model, CONDITIONED
   on the observed failure taxonomy, to generate candidate options. Diffuse-
   cluster evidence favors a superposition-collapsing (collapse-map) edit over a
   behavior-steering one.
3. Emit each candidate as: option, weight, motivating finding (which audit
   finding or cluster it answers), expected effect on the goal observable, and
   option class (collapse_map_edit | targeted_diff | wholesale_rewrite |
   goal_or_observer_refinement).
4. Tier-condition strength (P9): a strengthening edit that fits a legacy
   substrate over-projects on frontier — down-weight it accordingly.
5. Weights sum to 1.0 INCLUDING a residual "none-qualify" mass. If residual mass
   dominates, say so explicitly — that is an envelope-exceeded signal for Plan.

OUTPUT — Prompt A shape, aggregate first:

SUMMARY: <G> goal(s) in violation, <C> candidates, residual=<r>, envelope=<ok|exceeded>
CANDIDATE A: weight=<w> class=<class>
  finding: <the audit finding / cluster this answers>
  effect:  <expected change in the goal observable>
  ledger:  <supported | penalized: vNNN regressed same trigger | novel>
CANDIDATE B: ...
RESIDUAL none-qualify: weight=<r>   (if dominant: ESCALATE)

Rules:
- Do NOT collapse to one option. Preserve the superposition (§5.2) — Plan
  performs the deliberate collapse.
- Weights MUST sum to 1.0 with the residual included. State the sum.
- Never propose an anti-oscillation-blocked option with nonzero weight; if you
  are tempted, the ledger says it already regressed.
- Reason over managed_system (the operator algebra), never over raw prompt text.

EXAMPLE (format demonstrator — G1 violation, empty ledger prior):
SUMMARY: 1 goal(s) in violation, 2 candidates, residual=0.15, envelope=ok
CANDIDATE A: weight=0.60 class=collapse_map_edit
  finding: recurring billing-vs-account ambiguity (env recurrence x3)
  effect:  resolve tie in prompt -> fewer mislabels -> pass_rate up
  ledger:  novel
CANDIDATE B: weight=0.25 class=targeted_diff
  finding: mislabel_billing_as_account x3 in failure taxonomy
  effect:  add disambiguation rule -> pass_rate up
  ledger:  novel
RESIDUAL none-qualify: weight=0.15
(sum = 0.60 + 0.25 + 0.15 = 1.0)
```

## Operator profile

- **Amplifies:** option diversity with honest weights; ledger-informed pruning;
  collapse-map edits when variance is the problem.
- **Suppresses:** premature single-option commitment; re-proposing known
  regressions; reasoning over surface prompt text instead of the operator model.
- **Mixes:** the evidence batch with the ledger prior — a Bayesian update
  (§2.4).
- **Strength:** mid. It produces a distribution, not a decision.
- **Place:** second phase; reads `environment.yaml` + `ledger.md` +
  `managed-system.yaml`, writes `working/`.
- **Failure mode:** collapsing to one option here (that is Plan's step), or
  letting new evidence outrun the ledger prior and re-proposing an oscillation.

## Static verifier (I9 — checks this artifact, does not run it)

Shape 6 checks over the Analyze operator prompt itself. All must pass to ship.

```
CHECK prompt-a-contract: output is a weighted option set with per-option
  motivating finding and expected effect.                       [Prompt A]
CHECK normalization: weights (incl. residual) must sum to 1.0,
  and the prompt requires stating the sum.                      [Prompt A]
CHECK residual-mass: a "none-qualify" residual is mandatory and
  its dominance triggers escalation.                            [envelope / §4.1]
CHECK ledger-prior-first: prompt requires reading the ledger and
  zeroing anti-oscillation-blocked options BEFORE new evidence. [I4b]
CHECK superposition-preserved: prompt forbids collapsing to one
  option (that is Plan's job).                                  [§5.2 · P3]
CHECK reasons-over-model: prompt requires reasoning over the
  semantic-state model, not raw prompt text.                    [§2.2]
CHECK tier-conditioned: option strength is conditioned on tier.  [P9]
CHECK aggregate-first + greppable: SUMMARY precedes candidates;
  markers (SUMMARY CANDIDATE RESIDUAL) are parseable.           [consumability]
CHECK worked-example: a filled Prompt-A example with a shown weight
  sum sits beside the template.                                 [C / examples-as-operators]
CHECK equivalence-defined: "equivalent option" for anti-oscillation
  is defined (trigger + section + intent, not diff identity).   [D3]
CHECK anchors-present: profile + task cite §2.4/§1.2/§5.2 or P3/P8. [I1]
```
