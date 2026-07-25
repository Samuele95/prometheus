# Contributing to Prometheus

Prometheus is a **prompt corpus**, not a codebase. Almost every change is an edit
to a Markdown file that an LLM will read at build time. That makes the review
bar different from a normal repo: a change is good when it makes the model
behave better, and the burden of proof is on the change.

## The one rule

**Every addition must name the failure mode it prevents.** The framework's own
audit check M5 (scaffold restraint) applies to the framework itself: if you
cannot state, in one line, the concrete failure a new section prevents, it does
not go in. Tokens are the scarce resource — a section that only "adds context"
is a regression.

## Ways to contribute

| Kind | What it looks like |
|---|---|
| **Corpus fix** | A reference file is wrong, stale, or contradicts `SKILL.md`. |
| **New failure mode** | You hit a case the audit checklist misses. Add the check *and* the example that motivated it. |
| **Shape / operator** | A genuinely new structural shape or section operator, with its interview branch and audit entries. |
| **Port** | Packaging the corpus for another runtime, the way `gem/` does for Gemini. |
| **Docs & site** | The `docs/` site, the README, the figures. |

## Before you open a PR

1. **Run the framework on your own change.** Prometheus ships a static-mode
   verifier; use it. A PR that fails the project's own audit will be asked to
   revise.
2. **Keep `SKILL.md` small.** It is always loaded. New material belongs in a
   companion file that is pulled only at the step that needs it. Growing the
   always-loaded router is the most expensive change you can make.
3. **If you touch the corpus, check the Gem port.** `gem/` consolidates the same
   material into nine files, and `gem/en/gem-instructions.md` contains a
   **wiring table** naming each knowledge file. A corpus change that does not
   propagate leaves the two runtimes disagreeing.
4. **Filenames in `gem/knowledge/` are load-bearing.** Retrieval there is
   selective, not a directory walk. Renaming a file makes it unreachable.
   Do not rename without updating the wiring table in the same commit.
5. **Cite your sources.** Techniques traceable to published work go in
   `CITATIONS.md` with a real reference, not a vibe.

## Commit and PR style

- Present tense, imperative: `add backtracking tool to reasoning scaffold`.
- One concern per PR. Corpus edits and site edits do not travel together.
- Fill in the PR template — the "failure mode addressed" field is not optional.

## Local checks

There is no build step and no dependencies. The CI workflow runs the same
checks you can run by hand:

```bash
python3 -m py_compile manage/replay-verifier.py
grep -R "REPLACE-ME" --include="*.md" --include="*.html" . && echo "placeholder left behind"
```

## Licence

By contributing you agree that your contribution is licensed under the MIT
Licence, as in `LICENSE`.
