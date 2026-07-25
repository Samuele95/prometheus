<p align="center">
  <img src="assets/banner.png" alt="Prometheus — prompts as operators" width="100%">
</p>

<h1 align="center">Prometheus</h1>

<p align="center">
  <a href="LICENSE"><img alt="Licence: MIT" src="https://img.shields.io/badge/licence-MIT-ff7a2f?style=flat-square"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-ff7a2f?style=flat-square">
  <img alt="Runs at build time" src="https://img.shields.io/badge/runs-at%20build%20time-4a4550?style=flat-square">
  <img alt="Prompt shapes: 7" src="https://img.shields.io/badge/prompt%20shapes-7-4a4550?style=flat-square">
  <img alt="Modes: 3" src="https://img.shields.io/badge/modes-3-4a4550?style=flat-square">
</p>

<p align="center">
  <b>A meta-prompting framework for agentic systems.</b><br>
  Describe the prompt you need in one sentence — Prometheus designs a structured,
  audited prompt and ships it with a verifier that proves it works.
</p>

<p align="center">
  <a href="#-quick-start">Quick start</a> &nbsp;·&nbsp;
  <a href="https://samuele95.github.io/prometheus/">Website</a> &nbsp;·&nbsp;
  <a href="https://samuele95.github.io/prometheus/documentation-forge.html">Documentation</a> &nbsp;·&nbsp;
  <a href="https://github.com/Samuele95/prometheus/releases/latest/download/prometheus-skill.zip">Download the skill</a>
</p>

> **A prompt is an operator, not a key.** You don't *retrieve* the right answer by
> finding magic words — you *construct* it, section by justified section, the way
> you build a circuit.

<p align="center">
  <img src="assets/card-01.png" width="32%" alt="Three modes: from-scratch, refactor, manage">
  <img src="assets/card-02.png" width="32%" alt="Six phases: shape, interview, draft, audit, score, deliver">
  <img src="assets/card-03.png" width="32%" alt="Always verified: static, single-run, cross-run">
</p>

---

## Contents

- [Quick start](#-quick-start)
- [What it is](#what-it-is)
- [Core idea: prompts as operators](#core-idea-prompts-as-operators)
- [What you get](#what-you-get)
- [The Fabrication Cycle](#the-fabrication-cycle)
- [Three modes](#three-modes)
- [Verification](#verification)
- [Install](#install)
- [Repository layout](#repository-layout)
- [Documentation](#documentation)
- [License](#license)

---

## ⚡ Quick start

**1. Get the skill** — [download the zip](https://github.com/Samuele95/prometheus/releases/latest/download/prometheus-skill.zip), or clone:

```bash
git clone https://github.com/Samuele95/prometheus.git
```

**2. Drop it on your agent's skill search path** (Claude Code shown; keep
`references/`, `operators/`, `templates/`, `manage/` intact):

```bash
cp -a prometheus ~/.claude/skills/prometheus
```

**3. Just describe what you need.** No build step, no dependencies. The host
auto-routes to Prometheus the moment it sees a prompt-design intent:

```text
design a prompt for a customer-support triage agent
```

> Using Gemini instead? Prometheus ships a filesystem-free **Gem port** — see
> [Install → Gemini Gem](#gemini-gem).

---

## What it is

Prometheus is a portable **agent skill**: a single always-loaded `SKILL.md`
router (~22&nbsp;KB) plus a corpus of companion knowledge files pulled into
context only at the step that needs them. It runs entirely at **build time** — it
designs, audits, and refactors prompts. It does not orchestrate your agent at
runtime.

Give it a task and it:

1. classifies the task into a **structural shape** and a **capability tier**,
2. runs a short, capped **interview** to recover the runtime and a definition of done,
3. **drafts** the prompt as an ordered sequence of operators,
4. **audits** the draft against known failure modes,
5. **scores** it honestly on three axes, and
6. **delivers** the prompt plus a verifier specification.

## Core idea: prompts as operators

Every section of a prompt is an **operator** acting on the task — it amplifies
some readings of the intent, suppresses others, and mixes the rest. Order is
load-bearing: a later operator's meaning depends on the reading an earlier one
already selected. One operator is set apart — **Collapse**, the measurement act,
where the prompt commits to a single interpretation.

<p align="center">
  <img src="assets/readme-operators.svg" alt="A prompt as a stack of operators" width="82%">
</p>

## What you get

Prometheus does not just write a prompt and stop. The same operator model
compiles into whatever the task needs — and it was built from the start to give
life to real **agents** and **agentic workflows**, not only single-shot
instructions. The six outputs stack into three layers, the way a network stacks:
raw instructions in, agents in the middle, judgement on the way out.

<p align="center">
  <img src="assets/readme-layers.svg" alt="What Prometheus produces, as three stacked layers: prompts, generic agents, evaluators" width="100%">
</p>

<table>
<tr><th align="left">Layer</th><th align="left">Output</th><th align="left">What it is</th></tr>
<tr><td rowspan="2"><b>01 · Prompts</b></td><td><b>Prompts</b></td><td>System prompts and single-call instructions, drafted as ordered operators and scored before delivery.</td></tr>
<tr><td><b>Cognitive-tool scaffolds</b></td><td>For hard multi-step reasoning: a system prompt plus ready-to-register tool definitions for your tool-calling runtime.</td></tr>
<tr><td rowspan="2"><b>02 · Generic agents</b></td><td><b>Agents</b></td><td>Full agentic loops — persona, tool contracts, and a memory discipline — designed to run over many turns against real tools.</td></tr>
<tr><td><b>Agentic workflows</b></td><td>Multi-step pipelines and orchestration blueprints — ordered stages, hand-offs, and stop conditions — wiring several prompts into one system.</td></tr>
<tr><td rowspan="2"><b>03 · Evaluators</b></td><td><b>Graders &amp; evaluators</b></td><td>LLM-as-judge rubrics with explicit, checkable criteria — for when the task is to score, not to generate.</td></tr>
<tr><td><b>Verifiers</b></td><td>Every deliverable ships with a verifier spec across three layers, so you can prove the artifact does what it claims.</td></tr>
</table>

## The Fabrication Cycle

From-scratch design compiles a raw task into a delivered prompt across six
ordered phases. Data flows forward; a single feedback edge returns a failing
audit from Phase&nbsp;4 to Phase&nbsp;3 for revision — the only loop in the pipeline.

<p align="center">
  <img src="assets/readme-pipeline.svg" alt="The Fabrication Cycle: six phases with one audit-to-draft feedback edge" width="100%">
</p>

| # | Phase | What it does |
|---|-----------|-------------------------------------------------|
| 1 | Shape     | Infer the structural shape and strength tier |
| 2 | Interview | Recover the runtime and the definition of done |
| 3 | Draft     | Lay out the prompt as ordered operators |
| 4 | Audit     | Check the draft against the failure-mode checklists |
| 5 | Score     | Rate token economy, task fit, operator coherence |
| 6 | Deliver   | Ship the prompt with a verifier |

## Three modes

<p align="center">
  <img src="assets/readme-modes.svg" alt="Three modes: from-scratch, refactor, manage" width="100%">
</p>

| Mode | Use it to |
|---|---|
| **From-scratch** | Design a new prompt from a task description. |
| **Refactor** | Improve an existing prompt — audit-only (A), surgical diff (B), or wholesale rewrite (C). |
| **Manage** | Run a Monitor–Analyze–Plan–Execute (MAPE-K) loop over an agent across its lifetime, always *between* runs, never driving it live. |

In **Manage** mode the prompt, tools, and knowledge files are manager-owned (the
control plane); the agent's own `memory/` is agent-owned (the data plane) and is
read as a probe, never hand-edited.

## Verification

Every prompt ships with a verifier defined across three layers — **static**
properties of the artifact, **single-run** properties of one output, and
**cross-run** properties visible only across many. A scaffold-to-trigger list
records which capability is actually tested versus merely source-backed.

For hard multi-step reasoning on a tool-calling runtime, Prometheus can emit a
cognitive-tools scaffold: a system prompt plus four tool definitions you register
in your own runtime.

## Install

Prometheus is one folder containing a `SKILL.md` with valid frontmatter. How you
make it discoverable depends on your runtime.

### Agentic runtimes (Claude Code, OpenAI Codex, opencode, Cursor, …)

Clone the repository and copy it onto your host's skill search path, keeping
`references/`, `operators/`, `templates/`, and `manage/` intact:

```bash
git clone https://github.com/Samuele95/prometheus.git
cp -a prometheus ~/.claude/skills/prometheus
```

`gem/`, `docs/`, and `.github/` are packaging, not corpus — the skill works with
or without them. There is no build step and no dependencies. The host reads the
frontmatter `description` and routes to the skill whenever it sees a prompt-design
intent — "write a prompt for X", "design a grader", "build an agent", "fix my prompt".

### Gemini Gem

Gemini has no filesystem and caps a Gem's knowledge base at ten files, so the
framework is **ported**, not copied: the twenty-four source files are consolidated
into one standing instruction plus eight knowledge files.

1. Create a new Gem named **Prometheus**.
2. Paste the whole of `gem/en/gem-instructions.md` (~19&nbsp;KB, inside the verified
   30,000-character working cap) into the Gem's instruction field. It carries the
   core stance, the three modes, the from-scratch procedure, and the **wiring
   table** that names each knowledge file and the moment to pull it.
3. Upload all eight `gem/knowledge/*.txt` files **without renaming them**. Retrieval
   is selective rather than a directory walk, so the wiring table's filenames are
   load-bearing — a renamed file is an unreachable file. They ship as `.txt`
   because the knowledge upload accepts text, not `.md`.
4. Save and start by describing your prompt-design task.

The Gem is *Prometheus*; the framework it carries is *Prompt Architect v2*, so the
corpus refers to itself by that name.

## Repository layout

```
SKILL.md            # always-loaded router: mode detection + from-scratch procedure
references/         # shared knowledge (quantum principles, shapes, reasoning, …)
operators/          # the operator catalog
templates/          # interview branches, output templates
manage/             # manage-mode loop, operators, and replay-verifier.py
gem/                # the Gemini Gem port (generated tree, 8 knowledge uploads)
docs/               # the documentation site (GitHub Pages)
assets/             # figures, banner, social preview
CITATIONS.md        # every technique traced to a primary source
```

The only script, `manage/replay-verifier.py`, imports nothing outside the Python
standard library. There is no build step and nothing to install.

## Documentation

The full documentation — the operator model, the seven shapes, the three modes,
the audit checklist, and per-runtime install guides — is published from `docs/`:

**→ [Read the documentation](https://samuele95.github.io/prometheus/documentation-forge.html)**

It includes an interactive source browser that shows the exact corpus for the
runtime you pick, so you can read what the model will read before installing.

## License

[MIT](LICENSE). Every technique is traced to a primary source in
[CITATIONS.md](CITATIONS.md).
