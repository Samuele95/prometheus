# Cognitive tools — the reasoning scaffold

A reasoning sub-pattern invoked *inside* a shape — never a shape. Four cognitive operations become **modular tool calls**, each an LLM invocation with its own role prompt isolating one operation; the main model decides when to call which and the intermediate work flows back. Needs tool calling. Source: Ebouky, Bartezzaghi, Rigotti (IBM Research Zurich), arXiv:2506.12115 (2025). Verbatim prompts, schemas, runtime formats: `assets/cognitive-tools.json`.

- `understand_question` — restate the goal, surface assumptions, name unknowns, extract symbols.
- `recall_related` — 2–3 similar problems with full solutions as analogies; never solves the current one.
- `examine_answer` — verify the trace against the constraints (miscalculations, wrong assumptions, missed edge cases); critiques only.
- `backtracking` — locate the first error in a flawed trace, revise from there or propose a new strategy.

## Evidence

No fine-tuning: GPT-4.1 on AIME2024 26.7% → 43.3% pass@1; Llama 3.3-70B 13.1% → 29.8%; Qwen 2.5-32B on AMC 52.6% → 62.7%. **Modularity is load-bearing:** modular tools beat monolithic cognitive prompting because each runs sandboxed with only its inputs, and a named `backtracking` tool makes revision "doing the right thing". **Enable all four by default**; test subsets only when optimizing token economy on a strong reasoner. **Scope:** measured on 2024–25 GPT, Llama and Qwen — legacy and strong tiers; not demonstrated on frontier, where general instructions often beat prescriptive decomposition (P9).

## Gating

- Signals and the satisfaction-vs-compliance test: `references/shapes.md`, Shape 2; the tier: the runtime answer (SKILL.md, Phase 1).
- **Legacy and strong:** two or more signals plus a tool-calling runtime → the scaffold is the draft's structural default. **Frontier:** an M5-gated option — only on a reported first-try failure or explicit request; otherwise a brief general reasoning instruction ("think thoroughly, verify before answering"); if shipped on frontier, say the evidence doesn't cover that tier.
- Worth its cost (2–3× output length, infrastructure) where answer spaces have dead ends, verifying is much easier than producing, and single-shot tasks must be robust first time. Skip for extraction, classification, summarization, transformation; creative generation (`backtracking` needs a verifiable target); latency-sensitive paths; runtimes without tool calling (degenerates to weaker cognitive prompting); checklist verifiers. Skip also "think step by step" prefixes, experts-as-personas and "tips" lists — small effects the scaffold subsumes.

## Composition inside the shapes

Shape 2 — primary fit. Shape 3 — one hard-reasoning stage, never every stage. Shape 1 — individual hard checkpoints ("for this checkpoint, structure your reasoning using the cognitive-tools pattern"), never the loop scaffolding. Shape 4 — only a reasoning-heavy sub-agent (code reviewer yes, citation extractor no). Shape 5 — generally not; a hard-reasoning persona (tutor, reviewer) may reference the pattern in its scope. Shape 6 — **evaluative judges** only, where the score must be *discovered* (`understand_question` → rubric internalization, `recall_related` → anchors, `examine_answer` → self-critique, `backtracking` → revising a flawed judgment); **checklist verifiers** are lookups — tools are ceremony; a mixed verifier scopes them to its evaluative items. Shape 7 — per role, never team level.

**Profile.** Strong for hard reasoning, mid otherwise; amplifies decomposition, explicit verification, willingness to backtrack; suppresses premature commitment and confident-but-wrong output; mixes rarely. **Place after the constraints and before the output format** (P2): the model must know what it solves before decomposing, and a format placed first makes it skip the reasoning structure.

## Shipping and wiring

- **Verbatim.** The paper's prompts produced the results, so they ship as-is — `system_prompt` (with its `{{cognitive_tools_signature}}` slot) and `tools[]`. Adapt only the domain framing (replace "problem" with the task noun; the `ANSWER:` syntax when the schema demands JSON); keep the numbered rules section and every "DO NOT provide any answer" line — without it a tool drifts into solving and modularity collapses.
- **Reasoning channel** (check M6): each tool returns intermediate work as a *tool result*; the system prompt's "describe your reasoning and call it by name" is tool-choice narration — keep it as is, never strengthen it to "explain your full reasoning".
- **Delivery.** When triggered, ship the four definitions as a runnable artifact in the runtime's format — schema `question` plus `current_reasoning` where applicable — with the orchestration system prompt in the main prompt and the wiring instruction below; prose that mentions the pattern without the definitions ships framing, not tools. Completeness is check M4 (blocking).
- **Wiring is where deployments fail.** Runtimes hand the description to the *orchestrator* for routing, not as the system prompt of the model that *executes* the tool — the wrapper must. Anthropic (`anthropic_format`, resolve its `$ref`s into `tools[]`): the loop extracts name and inputs, calls another model with the tool's description as system prompt and the inputs as user message, returns the result. OpenAI (`openai_format`, showing `understand_question`): `function.description` is only a routing summary, so `execute_cognitive_tool` makes the separate call with the per-tool prompt. Other runtimes: same pattern. Registering without wiring the per-tool prompts is the common failure — routing without modularity.
- **Not reproduced:** the "$1,000,000 reward" line (folklore); "ONLY USE Python to call a tool"; the `use_code` tool (external computation — add independently).

## Other patterns

**Self-consistency** (Wang et al., 2022): several reasoning paths — at temperature > 0 where the runtime exposes it, else by prompt-level diversification (P6) — majority answer; useful when reasoning is unreliable but verification easy; N× cost. **Tree-of-thoughts** (Yao et al., 2023): explicit search with pruning; puzzle-like problems, expensive, rarely needed. On a tool-calling runtime reach for cognitive tools first.
