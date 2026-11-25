# Copy deck — Astrolabe of Fire

Every string on the main page, by section id. Sources: `SKILL.md`, `README.md`, the reading room. Keys are stable; a `-2` suffix is a deliberate second line of the same element.

## meta
title: Prometheus — a prompt is an operator
description: Prometheus is a build-time skill for coding agents. It interviews you, designs and audits your agent's prompt, and ships it as ready-to-install files with a verifier.
og-title: Prometheus — a prompt is an operator
og-description: Describe what your agent should do. Prometheus interviews you, designs the prompt section by section, audits it, and ships it with a verifier.
og-image-text: A prompt is an operator, not a key.

## nav
wordmark: PROMETHEUS
link-1: Principle
link-2: Shapes
link-3: Rite
link-4: Modes
link-5: Install
docs: Reading room
skip: Skip to content

## intro
skip: Press any key to skip

## hero
eyebrow: A meta-prompting framework for agentic systems
title: A prompt is not a key.
title-2: It is an operator.
body: Describe what your agent should do. Prometheus interviews you, designs the prompt section by section, audits it, and ships it as files you install, with a verifier.
cta-primary: Install the skill
cta-secondary: Enter the reading room
hint: Scroll to measure

## thesis
label: I · The principle
title: Meaning is not retrieved.
title-2: It is constructed.
line-1: Each section of a prompt is an operator. It amplifies some readings of your intent and suppresses others.
line-2: Operators do not commute. The same sections in another order are another prompt.
line-3: Ambiguity is not a defect. It is a superposition, held open until it is measured, and the interview is where you measure it.
coda: Prometheus designs that sequence deliberately, then checks it.

## arcana
label: II · The seven shapes
title: Seven shapes.
title-2: Every prompt is one of them.
intro: Prometheus infers the shape from what you ask for, then drafts on that shape's spine.
card-1-numeral: I
card-1-name: The Loop
card-1-shape: Agentic loop
card-1-meaning: Work that returns to itself until the condition is met. Memory outlives the turn.
card-2-numeral: II
card-2-name: The Arrow
card-2-shape: One-shot task
card-2-meaning: One call, one answer, the format fixed before the first word.
card-3-numeral: III
card-3-name: The Chain
card-3-shape: Workflow chain
card-3-meaning: Stages that hand a file to the next. What is lost early cannot be recovered late.
card-4-numeral: IV
card-4-name: The Hand
card-4-shape: Sub-agent or tool
card-4-meaning: A capability another agent reaches for. Its first line is the whole of its name.
card-5-numeral: V
card-5-name: The Mask
card-5-shape: System persona
card-5-meaning: A voice that holds under pressure and knows what it refuses.
card-6-numeral: VI
card-6-name: The Scales
card-6-shape: LLM-as-judge
card-6-meaning: Reasoning before the verdict, anchors at every level, and the honesty to say inconclusive.
card-7-numeral: VII
card-7-name: The Council
card-7-shape: Agent team
card-7-meaning: Roles with walls between them, contracts on every door, one place where the state lives.
hint: Turn a card

## rite
label: III · The rite
title: Six phases.
title-2: Nothing ships unaudited.
station-1-name: Shape
station-1-line: Infer which of the seven shapes you are asking for, without a routing question.
station-2-name: Interview
station-2-line: Ask only what the request leaves open, one question at a time, broadest first.
station-3-name: Draft
station-3-line: Write each section as an operator, ordered by strength, checked for interference.
station-4-name: Audit
station-4-line: Run the checklist. Fix what fails, or ship with the gap named.
station-5-name: Score
station-5-line: Score the draft honestly on token economy, task fit and coherence.
station-6-name: Deliver
station-6-line: Ship the files, the usage notes and the verifier, checked in a fresh context first.
verify-label: Every artifact ships with a verifier
verify-1: Static — properties of the artifact itself.
verify-2: Single-run — properties of one output.
verify-3: Cross-run — patterns visible only across many, where regressions hide.

## modes
label: IV · The three modes
title: Build it, fix it,
title-2: keep it alive.
mode-1-numeral: I
mode-1-name: From scratch
mode-1-line: You describe the task. Prometheus produces the prompt, the agent or the workflow.
mode-2-numeral: II
mode-2-name: Refactor
mode-2-line: You bring a prompt. Prometheus audits it, patches it, or rewrites it.
mode-3-numeral: III
mode-3-name: Manage
mode-3-line: You point at a running agent. Prometheus monitors, analyzes, adapts and restarts it, as a MAPE-K loop.

## ignite
label: V · Ignite
title: Install it once.
title-2: Describe what you need.
step-1: Clone the repository.
step-2: Copy it onto your agent's skill path.
step-3: Describe a prompt, an agent or a workflow. The host routes to Prometheus on its own.
command: git clone https://github.com/Samuele95/prometheus.git && cp -a prometheus ~/.claude/skills/prometheus
copy: Copy
copied: Copied
runtimes-label: Works with
runtime-1: Claude Code
runtime-2: OpenAI Codex
runtime-3: Cursor
runtime-4: opencode
runtime-5: Gemini Gem
gem-note: Gemini has no filesystem, so the framework ships as a Gem port: one instruction and eight knowledge files.
download: Download the skill
docs: Enter the reading room

## colophon
line: Prometheus runs at build time. What it produces, it never runs.
repo: Source on GitHub
license: MIT license
docs: Reading room
year: 2026

## film
enter-sound: Enter with sound
enter-silent: Enter in silence
read-page: Read as a page
watch-film: Watch the film
sound-on: Sound on
sound-off: Sound off
advance: Scroll, swipe or press the arrow keys
chapter-0: Superposition
chapter-1: The principle
chapter-2: The seven shapes
chapter-3: The rite
chapter-4: The three modes
chapter-5: Ignite
plate-1: Identity
plate-2: Context
plate-3: Task
plate-4: Constraints
plate-5: Format
plate-label: Operator
request-label: Example request · illustrative
request: summarise support tickets for the on-call engineer
reading-1: a one-shot digest
reading-2: a triage loop
reading-3: a ranked list
reading-4: an alert filter
reading-5: a shift handoff
reading-6: a trend report
alg-1: A request arrives in superposition: every reading it could carry, held at once.
alg-2: Each section is a matrix on that space. It stretches the readings it amplifies and flattens the ones it suppresses.
alg-3: Run the same two sections in both orders and the state lands in two places. The gap between them is the commutator.
alg-4: Sections combine by interference, not addition. Some readings reinforce each other, others cancel out.
f-1: |ψ⟩ = Σ_k c_k |k⟩
f-2: |ψ′⟩ = Ô |ψ⟩
f-3: Ô = diag(λ_1, …, λ_n)
f-4: ÂB̂ ≠ B̂Â
f-5: [Â, B̂] = ÂB̂ − B̂Â ≠ 0
f-6: |Âψ + B̂ψ|² ≠ |Âψ|² + |B̂ψ|²
f-7: P(k) = |⟨k|ψ⟩|²
chapter-card: Chapter
