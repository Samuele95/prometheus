# Agent-consumable output

When a prompt's output is consumed by another agent or parsed by code rather than read by a human, the output is itself an operator on the consuming agent's context (P1) and spends its attention budget (P5). Applies to tool output formats (Shape 4), judge output feeding an upstream loop (Shape 6), worker outputs (Shape 7, spine item 3). Not for human display, conversation (Shape 5) or open-ended generation; the final agent-to-human message is the opposite reader — lead-with-outcome, `references/operators.md`.

**Root constraint: disk is the memory.** Agents often have no persistent context across iterations, so the artifacts one writes and another reads back must carry the state; even with context, output that enters another model's window costs attention.

- **Greppable failure signals** — one parseable marker per failure, on the same line as the cause (`ERROR: parse_if_statement failed — unexpected token at line 42`), never narrative ("several issues were encountered…"); a fixed convention across the system: `ERROR:`, `WARN:`, `OK:`, `SKIP:`.
- **Aggregate before details** — `SUMMARY: 142 passed, 8 failed, 3 skipped (of 153)` then `FAILURES:` lines; the consumer decides whether to dig without counting.
- **Compact stdout, verbose to logs** — a few lines plus a log path (`Full output: ./logs/test_run_142.log`); everything inspectable on demand, nothing polluting the window.
- **Deterministic-but-different sampling** — an agent working a slice gets the same slice on re-run (it can verify a fix) and a different slice from its peers (coverage): slice = `hash(seed, task) % N` with a stable per-agent seed.
- **Visible state transitions** — every write, counter, lock appears in the output (`WROTE: src/parser/if_statement.rs (147 lines)`, `LOCK: released …`), never "Task complete."
- **Pre-compute derived values** — counts, percentages, status flags emitted by the producer; making the consumer derive them wastes tokens and breeds arithmetic errors.

**Profile.** Amplifies the consumer's ability to act without re-reading; suppresses narrative interpretation and recomputation; strength high — the dominant operator on the consuming agent for that turn. Failure mode: human-targeted prose consumed by an agent — brittle, slow, error-prone.

Source: Carlini, "Building a C compiler with a team of parallel Claudes" (Anthropic, 2026), the "put yourself in Claude's shoes" section.
