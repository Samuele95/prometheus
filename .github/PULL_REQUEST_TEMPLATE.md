## What this changes

<!-- One or two sentences. -->

## Failure mode addressed

<!-- REQUIRED. Name the concrete failure this prevents. "Adds helpful context"
     is not a failure mode. If you cannot name one, this PR will be closed. -->

## Token cost

- Lines added to always-loaded `SKILL.md`: <!-- number, ideally 0 -->
- Lines added to companion files: <!-- number -->

<!-- Anything added to SKILL.md is paid for on every single run. Justify it. -->

## Checklist

- [ ] I ran the framework's static-mode verifier on this change.
- [ ] `SKILL.md` did not grow, or its growth is justified above.
- [ ] If I touched the corpus, I propagated the change to `gem/` and its wiring table.
- [ ] I did not rename any file in `gem/knowledge/` (filenames are load-bearing).
- [ ] New techniques are cited in `CITATIONS.md`.
- [ ] No `REPLACE-ME` placeholders remain.
