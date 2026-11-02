# Prometheus — Gem description

Copy-paste text for publishing Prometheus as a **Gemini Gem**. For setup steps see [`en/setup-guide.md`](en/setup-guide.md); the standing instruction is [`en/gem-instructions.md`](en/gem-instructions.md).

---

## Short description (paste into the Gem's description field)

> Prometheus designs, audits and verifies prompts — and whole agents. Describe what you need and it drafts it as ordered "operators", audits it against known failure modes, scores it honestly and delivers it with a verifier. Not prompt-only: it also builds agents, agentic workflows and graders, and can manage a deployed agent across its lifetime.

**One-liner (if the field is short):**

> Turns a one-sentence task into a structured, audited prompt — or a whole agent — shipped with a verifier. Treats prompts as operators, not magic words.

**Suggested opening message:**

> I'm Prometheus. Tell me the prompt, agent or workflow you need — one sentence is fine. I'll infer its shape, ask only what I must, show you what I've concluded before I draft anything, then draft it as ordered operators, audit and score it, and hand it back with a verifier. Say "refactor" with an existing prompt, or "manage" to adapt a deployed agent.

## IT — descrizione breve (da incollare nel campo descrizione del Gem)

> Prometheus progetta, audita e verifica prompt — e agenti interi. Descrivi che cosa ti serve: lo redige come «operatori» ordinati, lo audita contro i modi di fallimento noti, gli dà un punteggio onesto e te lo consegna con un verifier. Non solo prompt: costruisce anche agenti, workflow agentici e grader, e sa gestire un agente già in esercizio lungo tutta la sua vita.

**Riga singola (se il campo è corto):**

> Trasforma un compito di una riga in un prompt strutturato e auditato — o in un agente intero — spedito con il suo verifier. I prompt sono operatori, non parole magiche.

**Messaggio di apertura suggerito:**

> Sono Prometheus. Dimmi il prompt, l'agente o il workflow che ti serve: basta una frase. Inferisco la sua shape, chiedo solo lo stretto necessario, ti mostro che cosa ho concluso prima di redigere qualsiasi cosa, poi lo scrivo come operatori ordinati, lo audito, gli do un punteggio e te lo restituisco con un verifier. Scrivi «refactor» insieme a un prompt esistente, oppure «manage» per adattare un agente già in esercizio.

---

## What this Gem does

- **From-scratch design** — six phases: infer the shape (seven structural shapes) → short interview → **a collapse block you confirm before anything is drafted** → draft as ordered operators → audit → honest self-report → deliver with a verifier spec.
- **More than prompts** — the same operator model builds agents (persona, tool contracts, memory discipline), agentic workflows (ordered stages, hand-offs, stop conditions), cognitive-tool scaffolds, and graders / evaluators.
- **Refactor mode** — audit-only, a surgical diff for a named symptom, or a wholesale rewrite with a trade-off analysis.
- **Manage mode (MAPE-K)** — adapts a deployed agent between runs from its run evidence, with a write-ahead ledger and a package ship gate.
- **Always a verifier** — every deliverable ships with a verification spec across static / single-run / cross-run layers.
- **Build-time only** — it produces artifacts and never runs them, and never reports a measurement it did not take.

## Porting details (how the framework fits a Gem's constraints)

A Gem has **no filesystem** and caps the knowledge base at **10 files**, so Prometheus is **ported, not copied**:

- The **15 source files** of the skill, plus `CITATIONS.md` and `LICENSE`, are carried into **1 standing instruction + 10 knowledge files**, one source file per knowledge file wherever the cap allowed.
- The standing instruction (~14.3 KB) sits well inside the working instruction cap and carries the stance, the three modes, the six phases, the universal drafting rules and a **wiring table**.
- The **wiring table** names each knowledge file and the exact moment to pull it. Gem retrieval is **selective**, not a directory walk — so the filenames are load-bearing.
- The ten knowledge uploads (as `.txt`, the format the knowledge base accepts): `quantum-principles.txt`, `operators.txt`, `shapes.txt`, `audit.txt`, `evals.txt`, `cognitive-tools.txt`, `agent-teams.txt`, `refactor.txt`, `manage.txt`, `provenance.txt`.

## Limitations (honest, against the full skill)

- **No filesystem** — the Gem emits artifacts as chat blocks; it cannot write files or run the bundled `replay-verifier.py`. That verifier ships as a runnable artifact you execute elsewhere.
- **Rename = unreachable** — retrieval is selective and keyed by the wiring table's filenames. Upload a renamed file and it silently never surfaces, with no error.
- **The fresh-context gate needs a second chat** — the pre-delivery static verifier requires an external observer, and a later turn of the same conversation is not one.
- **Output length** — a multi-file delivery may need consecutive turns; the instruction says to split rather than compress an artifact into a description.
- **No parity claim** — the same prompt on a different substrate is a different measurement, and the empirical results the corpus cites were measured elsewhere.

Unlike the v2 package, nothing here is summarized: the corpus is carried verbatim, with cross-references rewritten to the shipped filenames as the single declared transformation.

For the framework in a runtime that has a filesystem and can run the verifier, install the skill instead — see the repository README.
