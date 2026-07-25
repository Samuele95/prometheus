<div align="center">

<img src="assets/banner.png" alt="Prometheus — prompts as operators" width="100%">

<h1>Prometheus</h1>

**A meta-prompting framework for agentic systems.**
It designs, audits, and *maintains* prompts, agents, and agentic workflows —
each shipped with a verifier that proves it works.

<p>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-ff7a2f?style=flat-square"></a>
  <a href="https://github.com/Samuele95/prometheus/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/Samuele95/prometheus?style=flat-square&color=ff7a2f&logo=github&label=release"></a>
  <a href="https://github.com/Samuele95/prometheus/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/Samuele95/prometheus?style=flat-square&color=4a4550&logo=github"></a>
  <img alt="Dependencies: none" src="https://img.shields.io/badge/dependencies-none-4a4550?style=flat-square">
  <img alt="Runs at build time" src="https://img.shields.io/badge/runs-build--time-4a4550?style=flat-square">
</p>

<p><sub><b>Works with</b></sub><br>
  <img alt="Claude Code" src="https://img.shields.io/badge/Claude_Code-3a3340?style=flat-square&logo=anthropic&logoColor=e8853f">
  <img alt="OpenAI Codex" src="https://img.shields.io/badge/Codex-3a3340?style=flat-square&logo=openai&logoColor=e8853f">
  <img alt="Cursor" src="https://img.shields.io/badge/Cursor-3a3340?style=flat-square&logo=cursor&logoColor=e8853f">
  <img alt="Gemini Gem" src="https://img.shields.io/badge/Gemini_Gem-3a3340?style=flat-square&logo=googlegemini&logoColor=e8853f">
</p>

<p>
  <a href="#-quick-start"><b>Quick start</b></a> &nbsp;·&nbsp;
  <a href="https://samuele95.github.io/prometheus/">Website</a> &nbsp;·&nbsp;
  <a href="https://samuele95.github.io/prometheus/documentation-forge.html">Documentation</a> &nbsp;·&nbsp;
  <a href="https://github.com/Samuele95/prometheus/releases/latest/download/prometheus-skill.zip">Download the skill</a>
</p>

</div>

> [!NOTE]
> **A prompt is an operator, not a key.** You don't *retrieve* the right answer by
> finding magic words — you *construct* it, section by justified section, the way you
> build a circuit. Agents and workflows are just the largest things you build that way.

## At a glance

Three pillars, each with its own section below — click a card to jump.

<table>
<tr>
<td width="33%" valign="top" align="center">
  <a href="#three-modes"><img src="assets/card-01.png" alt="Three modes: from-scratch, refactor, manage"></a>
  <br><b><a href="#three-modes">Three modes →</a></b>
  <br><sub>Build from scratch, refactor, or manage a live agent.</sub>
</td>
<td width="33%" valign="top" align="center">
  <a href="#the-fabrication-cycle"><img src="assets/card-02.png" alt="Six phases: shape, interview, draft, audit, score, deliver"></a>
  <br><b><a href="#the-fabrication-cycle">Six phases →</a></b>
  <br><sub>Shape → interview → draft → audit → score → deliver.</sub>
</td>
<td width="33%" valign="top" align="center">
  <a href="#verification"><img src="assets/card-03.png" alt="Always verified: static, single-run, cross-run"></a>
  <br><b><a href="#verification">Always verified →</a></b>
  <br><sub>Static, single-run, and cross-run checks on every artifact.</sub>
</td>
</tr>
</table>

<details>
<summary>Contents</summary>

- [⚡ Quick start](#-quick-start)
- [What it is](#what-it-is)
- [Core idea: prompts as operators](#core-idea-prompts-as-operators)
- [What it builds](#what-it-builds)
- [Three modes](#three-modes) · [Manage mode (MAPE-K)](#manage-mode--a-mape-k-loop-over-a-live-agent)
- [The Fabrication Cycle](#the-fabrication-cycle)
- [Verification](#verification)
- [Install](#install)
- [Repository layout](#repository-layout)
- [Documentation](#documentation)
- [License](#license)

</details>

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

**3. Describe what you need — a prompt, an agent, or a workflow.** No build step,
no dependencies. The host auto-routes to Prometheus the moment it sees the intent:

```text
build an agent that triages support tickets and files them with our tools
```

> [!TIP]
> Using Gemini instead? Prometheus ships a filesystem-free **Gem port** — jump to
> [Install → Gemini Gem](#gemini-gem).

## What it is

Prometheus is a portable **agent skill** and a build-time engine for **agentic
systems**. Give it an intent and it engineers the artifact end to end — a prompt, a
**full agent**, or a **multi-step workflow** — audits it, scores it, and ships it with
a verifier. It runs entirely at **build time**: it designs, audits, refactors, and
*maintains* the things your agents are made of; it never sits in your request path at
runtime.

It is deliberately **not prompt-only**: a system prompt is the smallest thing it
produces; a self-adaptive agent kept healthy across its lifetime is the largest. One
always-loaded `SKILL.md` router (~22&nbsp;KB) plus a companion corpus pulled into
context only at the step that needs it. No build step, no dependencies, MIT.

## Core idea: prompts as operators

Every section of a prompt is an **operator** acting on the task — it amplifies some
readings of the intent, suppresses others, and mixes the rest. Order is load-bearing:
a later operator's meaning depends on the reading an earlier one already selected. One
operator is set apart — **Collapse**, the measurement act, where the prompt commits to
a single interpretation. Agents and workflows are assembled from the same operators,
which is why the discipline scales from a one-line instruction to a lifecycle-managed
system.

<div align="center">
  <img src="assets/readme-operators.svg" width="82%" alt="A prompt drawn as a stack of operators acting on the raw task: Role & framing (amplify), Context operators (mix), Constraints (suppress), Reasoning scaffold (amplify), and Collapse (measure and commit to one reading). Order is load-bearing.">
</div>

## What it builds

The same operator model compiles into whatever the task needs. The six outputs stack
into three layers, the way a network stacks: raw instructions in, **agents in the
middle**, judgement on the way out.

<div align="center">
  <img src="assets/readme-layers.svg" width="100%" alt="Three layers. 01 Prompts: system prompts and single-call instructions, plus cognitive-tool scaffolds (a system prompt with ready-to-register tool definitions). 02 Agents & workflows: full agentic loops with persona, tool contracts and a memory discipline, plus multi-step agentic workflows with ordered stages, hand-offs and stop conditions. 03 Evaluators: LLM-as-judge graders, and a verifier shipped with every deliverable.">
</div>

## Three modes

<div align="center">
  <img src="assets/readme-modes.svg" width="100%" alt="Three modes. From-scratch: design a new prompt, agent, or workflow from a description. Refactor: improve an existing one via audit-only (A), surgical diff (B), or wholesale rewrite (C). Manage: a MAPE-K loop that keeps a deployed agent healthy over its lifetime.">
</div>

### Manage mode — a MAPE-K loop over a live agent

The mode that makes Prometheus more than a prompt tool. Point it at a managed-agent
package — a directory that *is* the agent's identity — and it runs a **Monitor →
Analyze → Plan → Execute** loop over it, always *between* runs, never driving it live:

| Step | What it does |
|---|---|
| **Monitor** | Reconstructs the behaviour the current prompt actually induces, from recent run evidence. |
| **Analyze** | Keeps candidate adaptations in weighted superposition and prunes the ones a ledger says already regressed. |
| **Plan** | Collapses to a single edit. |
| **Execute** | Applies it at a controlled lifecycle seam — write-ahead-logged and reversible by snapshot. |

> [!IMPORTANT]
> Strict **control-plane / data-plane split**: the prompt, tools, and knowledge files
> are manager-owned (the control plane it rewrites); the agent's own `memory/` is
> agent-owned (the data plane) and is read as a probe, **never** hand-edited. It reads
> run evidence and rewrites the agent — it never sits in the request path.

## The Fabrication Cycle

From-scratch design compiles a raw task into a delivered artifact across six ordered
phases. Data flows forward; a single feedback edge returns a failing audit from
Phase&nbsp;4 to Phase&nbsp;3 — the only loop in the pipeline.

<div align="center">
  <img src="assets/readme-pipeline.svg" width="100%" alt="The Fabrication Cycle: six phases — Shape, Interview, Draft, Audit, Score, Deliver — with a single feedback edge from Audit back to Draft.">
</div>

| # | Phase | What it does |
|:-:|-----------|-------------------------------------------------|
| 1 | **Shape** | Infer the structural shape and strength tier |
| 2 | **Interview** | Recover the runtime and the definition of done |
| 3 | **Draft** | Lay out the artifact as ordered operators |
| 4 | **Audit** | Check the draft against the failure-mode checklists |
| 5 | **Score** | Rate token economy, task fit, operator coherence |
| 6 | **Deliver** | Ship the artifact with a verifier |

## Verification

Every artifact — prompt, agent, or workflow — ships with a verifier defined across
three layers: **static** properties of the artifact, **single-run** properties of one
output or trajectory, and **cross-run** properties visible only across many. Cross-run
is where agent regressions hide. A scaffold-to-trigger list records which capability is
actually tested versus merely source-backed.

For hard multi-step reasoning on a tool-calling runtime, Prometheus can also emit a
cognitive-tools scaffold: a system prompt plus four tool definitions you register in
your own runtime.

## Install

Prometheus is one folder containing a `SKILL.md` with valid frontmatter. How you make
it discoverable depends on your runtime.

<details open>
<summary><b>Agentic runtimes</b> — Claude Code, OpenAI Codex, opencode, Cursor, …</summary>

<br>

Clone the repository and copy it onto your host's skill search path, keeping
`references/`, `operators/`, `templates/`, and `manage/` intact:

```bash
git clone https://github.com/Samuele95/prometheus.git
cp -a prometheus ~/.claude/skills/prometheus
```

`gem/`, `docs/`, and `.github/` are packaging, not corpus — the skill works with or
without them. There is no build step and no dependencies. The host reads the frontmatter
`description` and routes to the skill whenever it sees the intent — "write a prompt for
X", "build an agent", "design an agentic workflow", "grade these outputs", "fix my
prompt", or "manage this agent".

</details>

<details>
<summary><b>Gemini Gem</b> — filesystem-free port</summary>

<br>

Gemini has no filesystem and caps a Gem's knowledge base at ten files, so the framework
is **ported**, not copied: the twenty-four source files are consolidated into one
standing instruction plus eight knowledge files. See
[`gem/GEM-DESCRIPTION.md`](gem/GEM-DESCRIPTION.md) for port details, features, and
limitations, and [`gem/en/setup-guide.md`](gem/en/setup-guide.md) to install.

In short: create a Gem named **Prometheus**, paste `gem/en/gem-instructions.md` into its
instruction field, upload the eight `gem/knowledge/*.txt` files **without renaming them**
(retrieval is selective, so the wiring table's filenames are load-bearing), and start
describing your task.

</details>

## Repository layout

```text
SKILL.md         # always-loaded router: mode detection + from-scratch procedure
references/      # shared knowledge (quantum principles, shapes, reasoning, …)
operators/       # the operator catalog
templates/       # interview branches, output templates
manage/          # manage-mode MAPE-K loop, operators, and replay-verifier.py
gem/             # the Gemini Gem port (+ GEM-DESCRIPTION.md)
docs/            # the documentation site (GitHub Pages)
assets/          # figures, banner, social preview
CITATIONS.md     # every technique traced to a primary source
```

The only script, `manage/replay-verifier.py`, imports nothing outside the Python
standard library.

## Documentation

The full documentation — the operator model, the seven shapes, the three modes, the
manage-mode loop, the audit checklist, and per-runtime install guides — is published
from `docs/`:

<div align="center">

### [→ Read the documentation](https://samuele95.github.io/prometheus/documentation-forge.html)

</div>

It includes an interactive source browser that shows the exact corpus for the runtime
you pick, so you can read what the model will read before installing.

## License

[MIT](LICENSE). Every technique is traced to a primary source in
[CITATIONS.md](CITATIONS.md).

<div align="center"><sub>Built by Samuele Stronati · <a href="https://samuele95.github.io/prometheus/">samuele95.github.io/prometheus</a></sub></div>
