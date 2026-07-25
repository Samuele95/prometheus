# Agent-consumable output

When a prompt's output will be consumed by another LLM agent rather than displayed to a human, the output is itself an operator on the consuming agent's context. This file covers how to design that output for agent consumption.

Most relevant for **Shape 4 (sub-agent / tool prompts)** and **Shape 6 (LLM-as-judge)**, where the output feeds back into another model. Less relevant for Shape 2 (one-shot, output displayed to user) or Shape 5 (system persona, output is conversation).

## The root constraint

In autonomous agent setups, each agent often has limited or no persistent context across iterations. When that's true, the artifacts an agent writes (and the artifacts another agent reads back) must carry the state. Logs, structured outputs, status files, error markers — all instances of one pattern: **disk is the memory**.

Even when persistent context exists, an output that travels into another model's context window costs that model attention budget. Design accordingly.

## Concrete guidelines

### Greppable failure signals

If the output reports failures, mark each failure with a parseable token on the same line as the cause:

```
ERROR: parse_if_statement failed — unexpected token at line 42
ERROR: codegen_loop emitted invalid jump target
```

Not:

```
There were several issues encountered during this run.
First, the parser had trouble with...
```

Greppable form lets a downstream agent locate failures with a single pass and avoids forcing the agent to read narrative text to extract structured information.

Standard markers worth using consistently: `ERROR:`, `WARN:`, `OK:`, `SKIP:`. Pick a convention and stick to it across all outputs in a system.

### Aggregate before details

If the output contains many items, lead with a summary line and put details after:

```
SUMMARY: 142 tests passed, 8 failed, 3 skipped (out of 153)
FAILURES:
  ERROR: test_parse_recursive — stack overflow at depth 1024
  ERROR: test_codegen_float — incorrect rounding
  ...
```

The summary lets a consuming agent decide whether to dig into details. Without it, the agent has to count or otherwise reduce the raw output to determine what happened.

### Compact stdout, verbose to logs

When a tool produces large output, default the agent-facing surface to compact (a few lines) and write the verbose output to a log file. Reference the log path in the compact output:

```
SUMMARY: 142/153 tests passed
Full output: ./logs/test_run_2026_04_27_142.log
```

This keeps context window pollution low while preserving everything an agent might need to inspect on demand.

### Deterministic-but-different sampling

When an agent processes a slice or sample of a larger input (a 1% test sample, a random subset of files, a paginated dataset), the sampling should be:

- **Deterministic per agent.** The same agent re-running the same task gets the same slice. This lets the agent verify a fix.
- **Different across agents.** Agents in a swarm cover different slices. The collective coverage is high; the per-agent feedback loop is fast.

The right primitive is a per-agent seed: each agent has a stable seed identifier, and the slice is `hash(seed, task) % N`. Without per-agent determinism, agents can't reproduce regressions and the fast-sample technique loses its value.

### Make every state transition visible

If a tool changes state — writes a file, updates a counter, releases a lock — that change should appear in the output. Silent state changes break the consuming agent's mental model because the agent has no way to learn the change happened.

```
LOCK: acquired current_tasks/parse_if_statement.txt
WROTE: src/parser/if_statement.rs (147 lines)
LOCK: released current_tasks/parse_if_statement.txt
```

Not: "Task complete." (Which leaves the consuming agent guessing what files changed and what locks remain.)

### Pre-compute what the agent would otherwise compute

If a downstream agent will need a derived value (a count, a percentage, a max, a status flag), compute it in the producing tool and emit it. Forcing the consuming agent to derive values from raw data wastes its tokens and is a frequent source of arithmetic errors.

## Operator profile

Agent-consumable outputs, treated as operators on the consuming agent:

- **Amplifies:** the consuming agent's ability to act on the output without re-reading it. Speed and accuracy of downstream decisions.
- **Suppresses:** narrative interpretation, ambiguity about what happened, the need for the consuming agent to compute aggregates.
- **Strength:** high. The output format is the dominant operator on the consuming agent for this turn.
- **Failure mode:** human-targeted output (narrative prose, rich formatting, implicit aggregates) consumed by an agent. The agent works harder than necessary, makes more mistakes, and the system feels brittle.

## When to apply this

Apply when designing:
- **Tool descriptions** that include expected output format (Shape 4).
- **LLM-as-judge prompts** whose output feeds an upstream agent's training signal or feedback loop (Shape 6).
- Any prompt whose output will be parsed by code or read by another LLM rather than rendered to a human.

Skip when:
- Output is for human display.
- Output is conversational (Shape 5).
- Output is a creative or open-ended generation (parts of Shape 2).

## Source

The framing here draws from Carlini's "Building a C compiler with a team of parallel Claudes" (Anthropic, 2026), specifically the "put yourself in Claude's shoes" section. The empty-context root constraint is the design root: when agents have no persistent context across iterations, the artifacts they exchange must carry all state. Most of the concrete guidelines (greppable errors, aggregate-first, compact stdout, deterministic-different sampling) are direct ports.
