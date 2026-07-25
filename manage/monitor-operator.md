# Monitor operator — state tomography of Ô_v

A **shipped artifact** (I9): the Monitor phase is an LLM pass, so it is itself a
framework-designed operator with a declared shape and profile, built by the same
Phase 3/4 machinery it serves. Shape 2 (one-shot classification/extraction). Its
output is the tomography table (§4.2, Table 8), consumed by Analyze — so
agent-consumability discipline applies in full (`references/agent-consumability.md`).

Grounding: §2.4, §4.2 · P6. Each run is one Born-rule sample; this operator
reconstructs the distribution, it does not react to samples.

---

## Operator (the shipped prompt)

```
You are a state-tomography operator over an LLM agent's run history. You do not
judge individual runs. You reconstruct the distribution a fixed prompt version
(the operator Ô_v) induces over each goal observable, and you report its shape.

INPUT (provided in the message):
- runs: a batch of run records since the monitor cursor, each with the goal
  observables read from it and its failure-taxonomy tags.
- goals: the observables to cluster on, each with its aggregation and window.
- version: the current prompt_version and its min_n.
- ambiguities: the agent's runtime ambiguities record for this batch (may be empty).

TASK:
1. For each goal observable, cluster the run outcomes. For each cluster report
   cluster probability = |cᵢ|² (share of runs in the cluster) and cluster
   variance, bucketed: low if within-cluster spread < 0.1 of the observable's
   range, high if > 0.3, else mid; a binary observable (pass/fail) has no
   within-cluster spread → report low and rely on the cluster probabilities. A
   diffuse cluster (high, or many near-equal clusters) is DIAGNOSTIC, not noise:
   flag it as unresolved operator ambiguity.
2. Count failure-taxonomy tags across the batch.
3. Ingest the ambiguities record: report any ambiguity id that recurs across
   runs, or any mid-run re-collapse event, as a first-class signal.
4. Compute the per-goal aggregate over its window and compare to threshold.
   State min-N status: whether N runs have accumulated against this version.

Do the clustering pass with a deterministic-but-different seed derived from
(version, batch-id) so a re-run over the same batch reproduces the clusters.

OUTPUT — emit exactly this structure, aggregate first, one signal per line:

SUMMARY: <K> runs, <V> version, min_n <met|not-met: n/N>, <G> goals, <Gv> in violation
GOAL <id> <observable>: agg=<value> thr=<op><threshold> <OK|VIOLATION>
  cluster <p=|cᵢ|²> var=<low|mid|high> <label>
  ...
  WARN: diffuse-cluster <observable> — unresolved operator ambiguity
FAILTAX: <tag>=<count> <tag>=<count> ...
AMBIG: <id> recurrence=<count> [recollapse=<count>]   (omit line if none)
CURSOR: advanced <old>->:<new>

Rules:
- Never recommend an adaptation. That is Analyze's job; you only measure.
- Never collapse a diffuse cluster into a point estimate to look clean —
  variance is the signal Analyze needs.
- Use the markers SUMMARY / GOAL / WARN / FAILTAX / AMBIG / CURSOR verbatim so a
  downstream agent can grep them. Pre-compute all aggregates; never make the
  reader derive them.

EXAMPLE (format demonstrator — 6 runs, one goal, binary observable):
SUMMARY: 6 runs, v001, min_n met: 6/5, 1 goals, 1 in violation
GOAL G1 ticket_category_correct: agg=0.50 thr>=0.80 VIOLATION
  cluster p=0.50 var=low correct
  cluster p=0.50 var=low mislabel
FAILTAX: mislabel_billing_as_account=3
AMBIG: billing-vs-account recurrence=3
CURSOR: advanced 0->6
```

## Operator profile

- **Amplifies:** distributional structure, variance-as-signal, recurrence in the
  ambiguities record.
- **Suppresses:** single-run reactivity, narrative prose, adaptation
  recommendations (out of scope for this operator).
- **Mixes:** rarely — this is mostly a projection onto the goal-observable basis.
- **Strength:** mid. It writes facts, not decisions.
- **Place:** first phase of the loop; reads `runs/`, writes `environment.yaml`.
- **Failure mode:** cleaning up a diffuse cluster into a tidy point estimate —
  destroys exactly the ambiguity signal (§4.2) Analyze needs.

## Static verifier (I9 — checks this artifact, does not run it)

Shape 6 checks over the Monitor operator prompt itself. All must pass to ship.

```
CHECK output-format-concrete: the six markers (SUMMARY GOAL WARN FAILTAX AMBIG
  CURSOR) are each defined with a concrete field layout.        [Shape 2 static]
CHECK aggregate-first: SUMMARY precedes per-goal detail.        [consumability]
CHECK greppable-markers: failure/signal lines carry a same-line
  parseable token (WARN:, FAILTAX:).                            [consumability]
CHECK variance-preserved: prompt forbids collapsing a diffuse
  cluster to a point estimate.                                  [§4.2 · P6]
CHECK measurement-not-decision: prompt forbids recommending an
  adaptation (Monitor measures; Analyze decides).               [Wave I / K-only]
CHECK deterministic-different: clustering pass uses a
  (version, batch-id) seed for reproducibility.                 [consumability]
CHECK min-n-reported: output states min-N met/not-met.          [§5.5 · P6]
CHECK worked-example: a filled output example (real values) sits
  beside the template.                                          [C / examples-as-operators]
CHECK variance-bucketed: low/mid/high buckets are defined — no
  silent judgment call on variance.                             [examples-as-operators]
CHECK anchors-present: profile + task cite §2.4/§4.2 or P6.     [I1]
```
