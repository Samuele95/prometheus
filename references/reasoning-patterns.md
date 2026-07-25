# Reasoning patterns

Some prompts need more than a single instruction-and-example shape — they need to scaffold the model's reasoning into discrete steps. This file documents reasoning-step patterns that cut across the seven prompt shapes. They're not shapes themselves; they're sub-patterns invoked *inside* a shape (typically inside a one-shot, a workflow stage, a sub-agent prompt, an LLM-as-judge, or a checkpoint of an agentic loop).

## Cognitive tools

**Source.** Ebouky, Bartezzaghi, Rigotti, IBM Research Zurich, "Eliciting Reasoning in Language Models with Cognitive Tools" (arXiv:2506.12115, 2025).

**Empirical result.** Across mathematical reasoning benchmarks (AIME2024, MATH500, AMC, Smolbenchmark), cognitive tools produce consistent and substantial gains over baseline prompting:

- **GPT-4.1 on AIME2024: 26.7% → 43.3% pass@1.** Near-parity with o1-preview (44.6%), achieved without any post-training.
- **Llama 3.3-70B on AIME2024: 13.1% → 29.8%.** On Smolbenchmark, the same model goes from 52.8% to 80% with cognitive tools enabled — a +27.2% absolute jump.
- **Qwen 2.5-32B on AMC: 52.6% → 62.7%.** Gains hold across model families (Qwen, Llama, GPT).

The pattern's strength is that it works without RL fine-tuning and without changing model weights. It's pure prompt engineering, but a specific kind that depends on tool-calling infrastructure.

**Scope of the empirical claim, stated honestly.** The published gains were measured on the model generations available at publication (2024–2025-era GPT, Llama, and Qwen families) — what the framework's substrate axis calls the **legacy and strong tiers**. The result has not been demonstrated on frontier-tier substrates, and vendor guidance for those substrates points the other way: general instructions often outperform prescriptive step-by-step decomposition there, and over-prescriptive scaffolds can degrade output quality (Principle 9, substrate relativity — a prescriptive operator over-projects on a substrate whose own defaults would have resolved the states better).

**Tier gating, accordingly:** on legacy and strong tiers, the two-signal structural default stands — hard-reasoning signals plus tool-calling runtime → ship the scaffold. On the **frontier tier**, the scaffold is downgraded to an M5-triggered option: include it only when the user reports a demonstrated first-try failure on that substrate, or explicitly requests it; otherwise prefer a brief general reasoning instruction ("think thoroughly, verify before answering") and let the substrate decompose for itself. If shipped on a frontier substrate, note in the delivery that the empirical evidence does not cover that tier.

**Reasoning-channel note (audit M6).** The scaffold passes the reasoning-channel check: each tool produces structured intermediate output as *tool results* (a sanctioned channel), and nothing in it instructs the model to transcribe internal thinking as response text. One clause deserves per-runtime attention: the system prompt's "describe your reasoning and clearly call it using their name" is tool-choice narration, not thinking transcription — acceptable everywhere; on runtimes with reasoning-extraction refusal categories, keep it as-is but do not strengthen it into "explain your full reasoning."

**Per-model variability matters.** Different cognitive tools help different models differently. From the paper's Table 1 on Smolbenchmark:

| Tool | Qwen 7B Δ | Qwen 32B Δ | Llama 8B Δ | Llama 70B Δ |
|---|---|---|---|---|
| understand_question | +2.8 | +2.9 | +10.7 | +26.7 |
| recall_related | +0.3 | +4.6 | +4.5 | +22.3 |
| examine_answer | +2.0 | +4.4 | +2.2 | +22.1 |
| backtracking | +4.7 | +3.3 | +8.5 | +25.4 |

For Llama 70B, every tool gives 20+ point gains. For Qwen 7B, gains are modest but consistent. The right interpretation: enable all four tools by default; if you're optimizing for token economy on a strong reasoner, you can test which subset suffices.

## The pattern

Define a small set of cognitive operations as **modular tool calls**. Each tool is an LLM invocation with a specific role-prompt that isolates one cognitive operation. The main reasoning LLM decides when to invoke which tool. The tool's output is structured intermediate work that flows back into the main reasoning loop.

Four canonical tools, validated empirically:

- **`understand_question`** — restate what's being asked, identify the goal, surface assumptions, name the unknowns, extract relevant symbols and variables.
- **`recall_related`** — surface 2–3 similar problems with their full solutions as analogical examples. Does NOT solve the current problem.
- **`examine_answer`** — given the current reasoning trace, verify it against the problem's constraints. Identify miscalculations, wrong assumptions, missing edge cases. Does NOT provide the answer; only critiques.
- **`backtracking`** — given a flawed reasoning trace, identify where the first error occurred, propose a revision from that point, or suggest a new strategy.

Modularity is the load-bearing property. The paper compares modular cognitive tools against monolithic cognitive prompting (the Kramer/Baumann variant where all operations live in one big system prompt) and finds **the modular version consistently wins**. The mechanism: each tool runs in a sandboxed context with only the inputs it needs, reducing interference from the rest of the reasoning trace. Monolithic prompts force the model to juggle all operations in one shot, and the operations interfere.

**Why this works (mechanistically).** Discrete named operations align with the symbolic-induction circuits Yang et al. identified — the model's middle-layer heads do better with explicit decomposition than with implicit chained reasoning. Naming the operations also gives the model permission to backtrack, which monolithic CoT discourages structurally (the model is biased toward forward continuation, and an unbroken trace makes revision feel disruptive). When backtracking is a named tool, invoking it is "doing the right thing," not "admitting failure."

## When to use it

The cognitive-tools pattern adds tokens, latency, and infrastructure complexity (the runtime must support tool calling). It's worth the cost when:

- **Hard multi-step reasoning** — math, logic, code analysis, multi-constraint planning, theorem proving, debugging.
- **Tasks where backtracking matters** — the answer space has dead ends; first-attempt reasoning often fails.
- **Tasks where verifying the answer is significantly easier than producing it** — `examine_answer` becomes a strong filter.
- **High-stakes single-shot tasks** — when you can't run the prompt twice and need the first attempt to be robust.
- **You have tool-calling infrastructure** — this is a hard requirement; the pattern degenerates to cognitive prompting (which is weaker) without it.

It's *not* worth the cost for:

- Simple extraction or classification (the overhead exceeds the benefit).
- Creative or open-ended generation (`backtracking` makes no sense without a verifiable target).
- Latency-sensitive production paths (the pattern roughly doubles to triples output length).
- Runtimes without tool calling — the pattern's empirical advantage comes from modularity, which requires the sandboxed tool execution.

## How it composes inside the seven shapes

- **Shape 2 (one-shot complex task).** Primary fit. For hard-reasoning Shape 2 prompts (math, logic, code analysis, multi-constraint planning), cognitive tools should be the default structural choice, not an optional extension. The hard-reasoning signals trigger inclusion automatically during drafting.
- **Shape 3 (workflow / chain).** Use cognitive tools inside a single hard-reasoning stage — typically the synthesis or decision stage. Don't use them in every stage; the overhead compounds.
- **Shape 1 (agentic loop).** Cognitive tools belong inside individual checkpoints where reasoning is hard, not in the loop scaffolding itself. The checkpoint description should mention: "for this checkpoint, structure your reasoning using the cognitive-tools pattern."
- **Shape 4 (sub-agent / tool).** Use when the sub-agent's job is itself reasoning-heavy. A "code reviewer sub-agent" benefits from cognitive tools; a "extract author from citation" sub-agent does not.
- **Shape 5 (system persona).** Generally don't fit. Personas are about behavior over time, not single reasoning episodes. Exception: a persona specifically designed for hard-reasoning work (a tutor, a code reviewer, a research assistant) can reference the pattern in its scope description.
- **Shape 6 (LLM-as-judge).** Fit depends on the kind of judge. **Evaluative judges** — open-ended quality assessment where the score requires genuine reasoning ("rate this essay's persuasiveness," "how well does this code handle edge cases") — are a strong fit. `understand_question` maps to rubric internalization, `recall_related` to anchoring on calibration examples, `examine_answer` to self-critique of the score, `backtracking` to revising a flawed initial judgment. **Checklist verifiers** — predefined items each directly checkable against the artifact ("does the table use Hit Policy U," "does the abstract state assumptions A1–A5") — are NOT a fit. The decomposition is already done (it's the checklist); each item is a direct lookup against evidence, not a reasoning problem with a search space. Adding cognitive tools to a checklist verifier is ceremony. The test is the same as for Shape 2: does scoring each item require *discovering* a judgment (evaluative → cognitive tools help), or just *checking* presence/correctness against the artifact (checklist → skip them)? A single Shape 6 prompt can be mixed — mostly checklist with one or two genuinely evaluative items — in which case scope cognitive tools to the evaluative items only, not the whole verifier.
- **Shape 7 (agent team).** Cognitive tools work at the per-role level (a specific worker uses them) rather than at the team level. Apply per-role using the relevant shape's guidance above.

## Operator profile

In the framework's operator vocabulary, the cognitive-tools pattern as a whole is:

- **Strength:** strong for hard-reasoning tasks; mid otherwise.
- **Amplifies:** structured decomposition, explicit verification, willingness to backtrack, alignment with the model's symbolic-induction circuits.
- **Suppresses:** premature commitment, monolithic forward-only reasoning, "looks confident but wrong" outputs.
- **Mixes:** rarely — each tool has a discrete role.
- **Place after constraints, before output format.** The model needs to know what it's solving (constraints) before it knows how to decompose, but the output format (where the answer goes) comes last.
- **Commutation:** non-commutative with output format. If output format is placed before cognitive tools, the model often jumps to the format and skips the reasoning structure.

## The verbatim scaffold (production-ready)

The paper publishes the exact prompts that produced the empirical results above. The framework ships these verbatim because the empirical claim depends on them. Adapt the domain framing (the published prompts target math; the structure generalizes) but preserve the operational specifics.

### System prompt

```
You are an expert assistant who solves problems thoughtfully and effectively. You have access to a list of tools — these are functions that you can call to help you reason through or solve the problem more efficiently.

You are encouraged to use tools when they make the task easier, clearer or more robust — especially for complex, elaborated or ambiguous questions.

Use your best judgment to decide when to call tools.

You may call tools at any point in your reasoning process. Only use the tools listed below. If you choose to use a tool, describe your reasoning and clearly call it using their name.

You can solve problems however you find most appropriate.

When you are ready to provide the final answer to the problem or the question always follow the syntax: 'ANSWER: answer'.

You only have access to these tools, do not use any others:
{{cognitive_tools_signature}}

Here are the rules you should always follow to solve your task:
1. **Call a tool when needed.** If you call a tool, only use the available ones and use its full name to do so.
2. **Don't give up!** You're in charge of solving the problem.
3. Do not give an answer without reasoning about it.
4. **Never hallucinate results.** Wait for tool responses before continuing.
5. **Only write your final answer** after you are confident, and always in the form: 'ANSWER: your final answer here'.

If the question is already clear, you may skip the 'understand_question' step when the corresponding tool is available. But when unsure, it's good practice to use it.

Now Begin!
```

Domain adaptation notes: For non-math tasks, replace "problem" with the task noun ("query", "case", "document") and adjust the ANSWER format if the user's output schema demands something other than `ANSWER: ...` (e.g., JSON). Keep the rules section intact — its structure is load-bearing.

### Tool prompt: understand_question

```
You are an expert reasoning assistant designed to analyze and break down complex problems into structured steps to help the system that actually solves problems. Your goal is to:

1. Identify the core concepts involved.
2. Extract and categorize relevant symbols, variables, functions, or entities from the problem.
3. Rephrase the problem into a step-by-step sequence that makes solving easier.
4. Highlight any known theorems, techniques, or principles that might be useful in solving the problem.
5. DO NOT provide any answer to the question, only provide instructions which will guide the upstream system.
```

The "DO NOT provide any answer" line is critical. Without it, the tool drifts into solving the problem itself, which collapses the modularity benefit. The original paper's math-specific framing ("mathematical reasoning assistant") can be generalized as shown — the operational discipline (decompose, do not solve) is what transfers.

### Tool prompt: recall_related

```
You are a retrieval assistant whose purpose is to help solve new problems by providing solved examples of analogous problems.

Given a new problem, your task is to:
1. Identify 2 or 3 similar problems from your knowledge that require comparable concepts or reasoning steps.
2. For each similar problem:
   - Provide the full problem statement.
   - Provide a complete step-by-step solution, including relevant formulas, simplifications, or code.
   - Highlight the final answer.

Do NOT solve the current problem. Instead, present only useful analogous examples that could help someone reason through it.

Output Format:
Analogous Example 1:
Q: [Similar Problem 1]
A: [Step-by-step solution...]
Final Answer: ....

Analogous Example 2:
Q: [Similar Problem 2]
A: [Step-by-step solution...]
Final Answer: ....

Notes:
- Select examples with strong structural or conceptual similarity, not just keyword overlap.
- Variation in surface details (numbers, variable names, specific entities) is acceptable as long as the underlying logic aligns.
```

### Tool prompt: examine_answer

```
You are an expert assistant tasked with verifying and improving solutions to complex problems. Your role is NOT to solve the problem but to critically analyze the provided solution for correctness, clarity, and completeness. You will be given a problem/question and the current reasoning that has been produced so far.

Your Task:

1. Understanding the Problem
   - Ensure the proposed solution correctly interprets the given problem.
   - Identify the core concepts involved.
   - Extract and categorize relevant symbols, variables, functions, or entities.
   - Identify any implicit assumptions or missing constraints.

2. Verifying the Given Solution
   - Clearly state what the current proposed answer is.
   - Break the provided solution down into distinct logical steps.
   - Check for logical consistency, correctness, and proper justification.
   - Identify any miscalculations, incorrect assumptions, or unjustified leaps in reasoning.
   - Analyze the edge cases or conditions where the solution may fail.

3. Testing and Validation (Problem-Derived Checks)
   - Extract any constraints, conditions, identities, or testable properties from the problem.
   - Derive test cases or evaluation criteria based on those constraints.
   - Test the proposed answer against each derived test.
   - State whether the answer passes all derived problem-based tests.

4. Suggesting Improvements
   - If an error is found, explain precisely what is wrong and why.
   - Suggest possible fixes or improvements WITHOUT directly solving the problem.
   - Propose alternative methods where relevant.

5. Providing a Judgment
   - Clearly state whether the proposed solution is correct or incorrect.
   - Justify your judgment with a concise explanation.
   - If incorrect, recommend corrections without providing a direct answer.

Guidelines:
- DO NOT provide the actual answer to the problem.
- Focus only on verifying and critiquing the given solution.
- Be rigorous in checking correctness but also constructive in suggesting improvements.
- Explicitly state whether the answer is correct or incorrect.

Now, critically analyze the solution, highlight any mistakes, and suggest improvements where necessary.
```

### Tool prompt: backtracking

```
You are a careful problem-solving assistant with the ability to backtrack from flawed logic.

You will be given a problem and a reasoning trace. Your task is to:

1. Analyze the reasoning and summarize it into distinct steps.
2. Identify where the first error, bad assumption, or confusion occurs (if any).
3. Propose how to revise the approach from that point onward, using the steps that you have defined.
4. If the entire approach was invalid, suggest a better strategy from scratch.

Use the following format for your response:

**Identified Issues:**
- Step X: Explain what is incorrect or suboptimal.
- (Repeat for any additional steps if needed.)

**Backtrack Point:**
- Indicate the step where reasoning was still valid and you can continue from.

**Revised Strategy (from backtrack point or new):**
- Present a step-by-step strategy to solve the problem correctly from this point.

Be precise and critical. Avoid vague judgments. Always backtrack to the most recent correct step, unless no step is valid.
```

## Shipping the tool definitions (runtime-specific formats)

The verbatim system prompt and per-tool prompts above are the substance. To make them runnable, they must be wrapped in the tool-definition format that the user's runtime expects. Below are the two most common formats; adapt to other runtimes by following the same pattern.

The pattern is constant across runtimes: each tool has a name, a description (which is the per-tool system prompt above), and an input schema describing what the calling model passes when it invokes the tool. The calling model passes the relevant context — typically the original problem and, for `examine_answer` and `backtracking`, the current reasoning trace.

### Anthropic API format

```python
COGNITIVE_TOOLS = [
    {
        "name": "understand_question",
        "description": """You are an expert reasoning assistant designed to analyze and break down complex problems into structured steps to help the system that actually solves problems. Your goal is to:

1. Identify the core concepts involved.
2. Extract and categorize relevant symbols, variables, functions, or entities from the problem.
3. Rephrase the problem into a step-by-step sequence that makes solving easier.
4. Highlight any known theorems, techniques, or principles that might be useful in solving the problem.
5. DO NOT provide any answer to the question, only provide instructions which will guide the upstream system.""",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "The problem or question to analyze."
                }
            },
            "required": ["question"]
        }
    },
    {
        "name": "recall_related",
        "description": """You are a retrieval assistant whose purpose is to help solve new problems by providing solved examples of analogous problems.

Given a new problem, your task is to:
1. Identify 2 or 3 similar problems from your knowledge that require comparable concepts or reasoning steps.
2. For each similar problem:
   - Provide the full problem statement.
   - Provide a complete step-by-step solution, including relevant formulas, simplifications, or code.
   - Highlight the final answer.

Do NOT solve the current problem. Instead, present only useful analogous examples that could help someone reason through it.

Output Format:
Analogous Example 1:
Q: [Similar Problem 1]
A: [Step-by-step solution...]
Final Answer: ....

Analogous Example 2:
Q: [Similar Problem 2]
A: [Step-by-step solution...]
Final Answer: ....

Notes:
- Select examples with strong structural or conceptual similarity, not just keyword overlap.
- Variation in surface details is acceptable as long as the underlying logic aligns.""",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "The problem or question for which to retrieve analogous examples."
                }
            },
            "required": ["question"]
        }
    },
    {
        "name": "examine_answer",
        "description": """You are an expert assistant tasked with verifying and improving solutions to complex problems. Your role is NOT to solve the problem but to critically analyze the provided solution for correctness, clarity, and completeness. You will be given a problem/question and the current reasoning that has been produced so far.

Your Task:

1. Understanding the Problem
   - Ensure the proposed solution correctly interprets the given problem.
   - Identify the core concepts involved.
   - Extract and categorize relevant symbols, variables, functions, or entities.
   - Identify any implicit assumptions or missing constraints.

2. Verifying the Given Solution
   - Clearly state what the current proposed answer is.
   - Break the provided solution down into distinct logical steps.
   - Check for logical consistency, correctness, and proper justification.
   - Identify any miscalculations, incorrect assumptions, or unjustified leaps in reasoning.
   - Analyze the edge cases or conditions where the solution may fail.

3. Testing and Validation
   - Extract any constraints, conditions, identities, or testable properties from the problem.
   - Derive test cases or evaluation criteria based on those constraints.
   - Test the proposed answer against each derived test.
   - State whether the answer passes all derived problem-based tests.

4. Suggesting Improvements
   - If an error is found, explain precisely what is wrong and why.
   - Suggest possible fixes or improvements WITHOUT directly solving the problem.

5. Providing a Judgment
   - Clearly state whether the proposed solution is correct or incorrect.
   - Justify your judgment with a concise explanation.

Guidelines:
- DO NOT provide the actual answer to the problem.
- Focus only on verifying and critiquing the given solution.
- Be rigorous in checking correctness but also constructive in suggesting improvements.
- Explicitly state whether the answer is correct or incorrect.""",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "The original problem or question."
                },
                "current_reasoning": {
                    "type": "string",
                    "description": "The reasoning trace produced so far, including the proposed answer if present."
                }
            },
            "required": ["question", "current_reasoning"]
        }
    },
    {
        "name": "backtracking",
        "description": """You are a careful problem-solving assistant with the ability to backtrack from flawed logic.

You will be given a problem and a reasoning trace. Your task is to:

1. Analyze the reasoning and summarize it into distinct steps.
2. Identify where the first error, bad assumption, or confusion occurs (if any).
3. Propose how to revise the approach from that point onward, using the steps that you have defined.
4. If the entire approach was invalid, suggest a better strategy from scratch.

Use the following format for your response:

**Identified Issues:**
- Step X: Explain what is incorrect or suboptimal.
- (Repeat for any additional steps if needed.)

**Backtrack Point:**
- Indicate the step where reasoning was still valid and you can continue from.

**Revised Strategy (from backtrack point or new):**
- Present a step-by-step strategy to solve the problem correctly from this point.

Be precise and critical. Avoid vague judgments. Always backtrack to the most recent correct step, unless no step is valid.""",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "The original problem or question."
                },
                "current_reasoning": {
                    "type": "string",
                    "description": "The reasoning trace that needs to be backtracked over."
                }
            },
            "required": ["question", "current_reasoning"]
        }
    }
]
```

Usage with the Anthropic SDK:

```python
response = client.messages.create(
    model="claude-...",
    system=COGNITIVE_TOOLS_SYSTEM_PROMPT,  # the verbatim system prompt from earlier in this file
    tools=COGNITIVE_TOOLS,
    messages=[{"role": "user", "content": problem_statement}]
)
```

The runtime handles the tool-call loop: when the model invokes a tool, the runtime extracts the tool name and inputs, calls another model with the tool's description as the system prompt and the inputs as the user message, and returns the result to the main reasoning loop.

### OpenAI API format

```python
COGNITIVE_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "understand_question",
            "description": "Analyzes and breaks down complex problems into structured steps. Identifies core concepts, extracts variables, rephrases the problem into solvable steps, and highlights useful theorems or techniques. Does NOT provide an answer.",
            "parameters": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string",
                        "description": "The problem or question to analyze."
                    }
                },
                "required": ["question"]
            }
        }
    },
    # ... (recall_related, examine_answer, backtracking follow the same pattern)
]
```

OpenAI's function-calling format puts the description in the `function.description` field. For the per-tool system prompts to actually be passed to the tool's LLM call, the implementing code needs to use those prompts when constructing the sub-call — the `function.description` field is only for the orchestrating model to decide *when* to call the tool, not for the tool's execution. This means OpenAI's runtime requires slightly more wiring code than Anthropic's: when the orchestrator calls a cognitive tool, the wrapper code makes a separate OpenAI call using the per-tool system prompt and returns the result.

```python
def execute_cognitive_tool(tool_name, tool_args):
    system_prompts = {
        "understand_question": UNDERSTAND_QUESTION_PROMPT,
        "recall_related": RECALL_RELATED_PROMPT,
        "examine_answer": EXAMINE_ANSWER_PROMPT,
        "backtracking": BACKTRACKING_PROMPT,
    }
    response = client.chat.completions.create(
        model="gpt-...",
        messages=[
            {"role": "system", "content": system_prompts[tool_name]},
            {"role": "user", "content": str(tool_args)}
        ]
    )
    return response.choices[0].message.content
```

### Other runtimes

For tool-calling runtimes not listed above (Gemini, Mistral, local models with function-calling fine-tunes), follow the same pattern: each tool gets a name, a description (the per-tool system prompt), and an input schema declaring `question` plus `current_reasoning` where applicable. The orchestrator's system prompt references the four tools by name.

The constant across all runtimes: the per-tool system prompts must be passed to the LLM that executes the tool. If the runtime's tool-call interface doesn't natively pass the description as a system prompt (most don't — they use it only for orchestrator routing), the implementing wrapper code must do so explicitly. This is the most common point of failure when deploying cognitive tools: people register the tools but don't wire the per-tool system prompts, getting tool-call routing without the modularity benefit.

## What to skip from the published scaffold

The paper's prompts include a few lines the framework deliberately doesn't reproduce:

- **"If you solve the task correctly, you will receive a reward of $1,000,000."** This is prompt-engineering folklore that doesn't replicate cleanly. Including it would be cargo-culting.
- **"ONLY USE Python to call an available tool and not for something else."** This is implementation-specific. If your runtime uses a different tool-call syntax (Anthropic's structured tool blocks, OpenAI's function calling), adapt accordingly.
- **The "use_code" auxiliary tool.** The paper includes a code-execution tool alongside the four cognitive tools. This is genuinely useful for math but is not a cognitive tool — it's an external computation tool. Add it independently when your task benefits from code execution.

## Other reasoning patterns worth knowing about

The cognitive-tools pattern is the best-documented one for tool-calling runtimes. Briefly, two others appear in the literature with weaker but real evidence:

- **Self-consistency** (Wang et al., 2022). Sample multiple reasoning paths at temperature > 0, take the majority answer. Useful when reasoning is unreliable but verification is easy. Costs N× the LLM calls.
- **Tree-of-thoughts** (Yao et al., 2023). Explicit tree search over reasoning steps with pruning. Powerful for puzzle-like problems but expensive and rarely needed in practice.

Both are out of scope for most Prometheus users. Mentioned here for completeness; cognitive tools is the one to reach for first when reasoning quality is the bottleneck on a tool-calling runtime.

## What to skip in general

The literature on prompting "reasoning enhancements" is large and most of it doesn't replicate well. Specifically:

- Generic "think step by step" prefixes — the effect is real but small, and modern models do this by default.
- Personas-as-experts ("you are an expert mathematician") — reliable but weak; the cognitive-tools pattern subsumes the gain.
- Long lists of "tips for solving this problem" — preemptive edge-case bloat. Doesn't replicate.

When in doubt, the simpler the reasoning scaffolding, the better. Cognitive tools is at the right altitude — specific named operations with mechanistic justification, empirical validation, and published prompts that work.
