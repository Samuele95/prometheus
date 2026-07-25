# Prometheus — Gem description

Copy-paste text and reference notes for publishing Prometheus as a **Gemini Gem**.
For setup steps see [`en/setup-guide.md`](en/setup-guide.md); for the standing
instruction see [`en/gem-instructions.md`](en/gem-instructions.md).

---

## Short description (paste into the Gem's description field)

> Prometheus designs, audits, and verifies prompts — and whole agents. Describe
> what you need and it drafts it as ordered "operators," audits it against known
> failure modes, scores it honestly, and delivers it with a verifier. Not
> prompt-only: it also builds agents, agentic workflows, and graders, and can
> manage a deployed agent across its lifetime.

**One-liner (if the field is short):**

> Turns a one-sentence task into a structured, audited prompt — or a full agent —
> shipped with a verifier. Treats prompts as operators, not magic words.

---

## Suggested opening message (optional, for the Gem's first turn)

> I'm Prometheus. Tell me the prompt, agent, or workflow you need — in a sentence
> is fine. I'll infer its shape, ask only what I must, draft it as ordered
> operators, audit and score it, and hand it back with a verifier so you can
> check it does what it claims. Say "refactor" with an existing prompt, or
> "manage" to adapt a deployed agent.

---

## What this Gem does

- **From-scratch design** — six phases: infer the shape (7 structural shapes) →
  short interview → draft as ordered operators → audit → honest score → deliver
  with a verifier spec.
- **More than prompts** — the same operator model builds **agents** (persona, tool
  contracts, memory discipline), **agentic workflows** (ordered stages, hand-offs,
  stop conditions), **cognitive-tool scaffolds**, and **graders/evaluators**.
- **Refactor mode** — audit-only, a surgical diff for a named symptom, or a
  wholesale rewrite with a trade-off analysis.
- **Manage mode (MAPE-K)** — adapts a deployed agent between runs from its run
  evidence, with a control-plane / data-plane split.
- **Always a verifier** — every deliverable ships with a verification spec across
  static / single-run / cross-run layers.

## Porting details (how the framework fits Gemini's constraints)

Gemini Gems have **no filesystem** and cap the knowledge base at **10 files**, so
Prometheus is **ported, not copied**:

- The **24 source files** of the full skill are consolidated into **1 standing
  instruction + 8 knowledge files**.
- The standing instruction (`en/gem-instructions.md`, ~19 KB / ~19,250 chars) sits
  inside Gemini's working instruction cap and carries the core stance, the three
  modes, the from-scratch procedure, and a **wiring table**.
- The **wiring table** names each of the 8 knowledge files and the exact moment to
  pull it. Gem retrieval is **selective**, not a directory walk — so the filenames
  are load-bearing.
- The 8 knowledge uploads (ship as `.txt`, the format the knowledge base accepts):
  `quantum-core.txt`, `shapes-and-build.txt`, `verifier-and-audit.txt`,
  `manage-core.txt`, `manage-operators.txt`, `manage-agent-design.txt`,
  `refactor-mode.txt`, `provenance.txt`.

## Limitations (honest, vs the full skill)

- **Consolidated corpus** — 8 files instead of 24; some depth is summarized rather
  than carried verbatim.
- **No filesystem** — the Gem emits artifacts as chat blocks; it cannot write files
  or run the bundled `replay-verifier.py`. The verifier is delivered as a **spec**
  you run elsewhere, not executed in-Gem.
- **Rename = unreachable** — retrieval is selective and keyed by the wiring table's
  filenames. Upload a renamed file (or a 9th file) and it silently never surfaces,
  with no error.
- **Instruction-size ceiling** — the router must stay lean to fit the working cap,
  so it is terser than the skill's `SKILL.md`.
- **Naming** — the Gem is *Prometheus*; the framework it carries names itself
  *Prompt Architect v2*, so the corpus refers to itself by that name.

For the uncompressed framework (all 24 files, runnable verifier), install the
skill in an agentic runtime instead — see the repository README.
