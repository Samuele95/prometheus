# Deviations — Prometheus v3.3 → Gem package

Every departure from "carry the source unchanged", stated with what it changes, why the substrate forces it, and what it costs. A port that does not list these is not honest about being a port.

Port invariants are labelled **PORT-1…PORT-5** (see `../en/dogfood-audit.md`), never `I1…I9`: that numeric namespace belongs to manage mode, and reusing it would recreate the exact collision the framework's own R8 unit repaired.

---

## D1 — Cross-references rewritten to shipped filenames

**What.** Every intra-corpus reference of the form `references/x.md` or `assets/y` becomes the shipped `.txt` name — `audit.txt`, `operators.txt` — with a section marker where several sources share a file: `shapes.txt (§ loops)`, `manage.txt (§ replay-verifier)`. 100 rewrites across the corpus.

**Why.** A Gem has no directory to resolve a path against, and retrieval is by filename. An unrewritten reference is a dead pointer: the Gem is told to consult a file it cannot name.

**Cost.** Source bytes change at 100 sites. Nothing else in any carried file changes — no reflow, no summarizing, no reordering, no heading edits. The § markers add ~1,200 bytes across the corpus.

**Check.** Every rewrite resolves to one of the ten shipped files; zero references survive that point outside the corpus. Verified mechanically, see `verification-report.md`.

---

## D2 — v2→v3 renames resolved inside `CITATIONS.md`

**What.** `CITATIONS.md` at the repository root still cites the v2 file layout. Four names were resolved to their v3 successors before D1's rewrite applied:

| In `CITATIONS.md` | v3 successor | Shipped as |
|---|---|---|
| `references/reasoning-patterns.md` | `references/cognitive-tools.md` | `cognitive-tools.txt` |
| `references/agent-team-topologies.md` | `references/agent-teams.md` | `agent-teams.txt` |
| `references/agent-consumability.md` | `references/agent-output.md` | `agent-teams.txt (§ agent-output)` |
| `operators/section-operators.md` | `references/operators.md` | `operators.txt` |

**Why.** Left alone these are dangling pointers in the shipped corpus — the same defect D1 exists to prevent, one layout generation older. Resolving them is the same transformation, with a rename lookup in front.

**Upstream-fix candidate.** `CITATIONS.md` in the repository root should be updated to the v3 layout. This package does not repair it there; it only resolves the names on the way in. Fix it upstream, then the next port needs no D2.

---

## D3 — `CHANGELOG.md` exempt from rewriting

**What.** The changelog section of `provenance.txt` is carried with **no** cross-reference rewriting at all.

**Why.** Its path mentions are a historical record of which source files a given unit edited — "R1b — `SKILL.md`, `references/shapes.md`, …". Rewriting them to `.txt` names would state that a 2026-09-05 edit touched a Gem knowledge file, which is false. D1 serves navigation; here navigation is not what the paths are for.

**Cost.** A reader of `provenance.txt` meets source paths in the changelog that do not exist in the corpus. The file's header says so in two lines.

---

## D4 — Substrate adaptations added beyond the source

Three blocks in `gem-instructions.md` have no counterpart in `SKILL.md`, because they answer facts about this substrate that the skill's runtime does not have.

| Addition | Substrate fact it answers |
|---|---|
| **Substrate**, points 1–3 | selective retrieval with no directory listing; no filesystem and no execution; no fresh context inside one conversation |
| the **degradation note** under Manage mode | manage mode natively assumes a file-backed K-store, a lifecycle seam and a runnable replay verifier; none exists here |
| the **output-length rule** in Phase 6 | a Gem turn can truncate a multi-file delivery, and the tempting repair — describing an artifact instead of shipping it — is exactly what Phase 6 item (1) forbids |

**Point 3 deserves its own note.** `SKILL.md` requires the pre-delivery static verifier to run "in a fresh context (P8)". In an agentic runtime that is a subagent. Here it is a *new empty chat*, because a later turn of the same conversation carries the draft's own operators and is therefore not an external observer. The instructions say so, and require an inline run to be labelled self-report rather than clearance. This is a strengthening of an existing rule to keep it true, not a new rule.

**What is *not* in this deviation.** No procedural rule, phase, check label, principle or delivery item was altered, softened or dropped. The wiring table replaces the "Read when…" table row-for-row.

---

## D5 — The Italian variant (not shipped here)

This is the **English-only** distribution, so D5 is recorded but not exercised.

In the bilingual package the Italian instruction file is a translation of the English one plus a port-authored **Lingua** section: query the corpus in English, keep the terms of art (shape names, check labels A–O and I1–I9, P1–P11, phase names, filenames) in English because they are retrieval keys, and write delivered artifacts in the language they will run in rather than the language of the conversation. It costs 2,340 characters over the English instruction, 55% of the working cap against 48%.

The corpus is not translated in either distribution and must not be: twenty files exceed the ten-file cap, and a translated corpus is no longer the source (PORT-1).

## Not a deviation: the retired naming note

The v2 package carried a note explaining that the Gem was *Prometheus* while the framework inside called itself *prompt-architect v2*. v3 renamed the framework, so the corpus and the Gem agree and the note is gone. Its removal restores fidelity rather than departing from it.

## Not a deviation: the retired upstream defect

The v2 package carried a dangling reference to `manage-verify.py` verbatim, per the rule that a port must not repair its source. That reference does not exist anywhere in the v3 source, and is verified absent from this corpus. Nothing was repaired; the defect was fixed upstream, which is where the v2 manifest said to fix it.
