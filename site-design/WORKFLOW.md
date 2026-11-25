# Prometheus site chain — workflow

A five-stage workflow for Claude Code that replaces the Prometheus website with a new cinematic site in the **Astrolabe of Fire** theme, draws its logo, restyles the reading room (`docs.html`) and grades the result before it ships. Each stage is a slash command; you run them in order, in the Prometheus repository, in one or several sessions. State lives on disk in `site-design/`, so a stage can be re-run or resumed.

## Install

1. Copy `.claude/commands/site-0*.md` into the repository's `.claude/commands/` (create the folder if missing).
2. Copy this file to `site-design/WORKFLOW.md` in the repository, because the stages cite it at runtime for the budget, the done definition and the failure routes.
3. Open Claude Code in the repository root: `claude`.
4. Run the stages in order. Each one tells you when it is done and what to run next.

| Command | Stage | Reads | Writes | Gate |
|---|---|---|---|---|
| `/site-01-bible` | Theme bible: palette, type, motion, effect inventory, page outline, the seven arcana, the copy deck | the skill's `SKILL.md` and `references/`, the current `docs.html` | `site-design/theme-bible.md`, `tokens.json`, `copy.md` | you approve three named decisions |
| `/site-02-logo` | Logo system: mark, wordmark, lockups, favicon, social image, animated intro | bible, tokens, copy (the thesis line for the social image) | `site-design/logo/*` | **you approve the mark** (up to two revision rounds) |
| `/site-03-scaffold` | New Vite project, tokens to CSS, fonts, semantic page with all copy in place, restyled docs, Pages deploy wiring | bible, tokens, copy, logo | the site source folder | milestone check: builds, both pages render, console clean |
| `/site-04-build [fix \| <section-id>]` | Cinematic build, one section at a time; `fix` consumes the grader's feedback | everything above, `grade.json` in fix mode | the site source, `STATE.md` | milestone check after each section |
| `/site-05-grade` | Grader: runs the wide checks and scores the site against the bible; routes failures back to stage 4 | the built site, bible, tokens, copy, `logo/LOGO.md`, `STATE.md` | `site-design/grade.json` | pass → ship; fail → `/site-04-build fix`, at most three rounds |

## Shared state: `site-design/`

Disk is the memory. Stages don't share a context window, so everything a later stage needs is a file:

- `theme-bible.md` — the design system in prose. Stage 5 grades against it.
- `tokens.json` — every color, font, size, duration and effect parameter. Stage 3 generates CSS from it; a value that exists only in prose never reaches the build.
- `copy.md` — every string on the page, by section id. Stage 3 places it; stage 5 diffs the page against it.
- `logo/` — SVG sources plus `LOGO.md` (construction, clear space, minimum sizes, which lockup goes where).
- `grade.json` — the grader's last verdict, with one actionable line per failure.
- `STATE.md` — the ledger. Every stage appends lines in this fixed convention, one fact per line, greppable:

```
OK: stage-01 — theme bible written (site-design/theme-bible.md, tokens.json, copy.md)
APPROVED: logo mark — candidate B, "the eye reads first" (owner, 2026-11-24)
ROOT: site source — site/ ; deploy — .github/workflows/pages.yml builds site/ to dist/ (owner confirmed, 2026-11-24)
WROTE: site/src/effects/point-cloud.ts (212 lines)
DEVIATION: stage-04 section=rite — procession built with CSS transforms instead of the inventory's WebGL layer because a second three.js scene pushed JS over 400 KB gz
SKIP: lighthouse — not installed and owner declined the devDependency; perf dimension reported as inconclusive
ERROR: stage-04 section=arcana — build failed: TS2322 in src/sections/arcana.ts:41; fixed before OK
ROUND: grade 2/3 — fail (performance 78 < 85, reduced-motion missing section=rite)
ROUND: grade 3/3 — fail (reduced-motion missing section=rite)
SERIES: grade — new series opened by owner after round 3; stage 4 re-run on sections=rite,arcana
ROUND: grade 1/3 — pass-with-unverified (performance inconclusive: lighthouse SKIP)
CLOSED: chain — shipped with gap: performance unverified (owner, 2026-11-26)
```

Round numbers count failed grades in the current series plus one; a series starts at the beginning of the ledger or at the last `SERIES:` line. `CLOSED:` records how the chain ended, pass or the owner's decision, so a later session knows.

The `ROOT:` line is written once, by stage 3 after you confirm the folder; stages 4 and 5 resolve every `src/` path against it, because the folder is your decision and a later session cannot re-derive it.

Every stage starts by reading `STATE.md` and resumes from the last line that concerns it. A stage never writes `OK:` for work whose check did not run; unverified work is logged as `WROTE:` only.

## Done definition

The chain is done when all of these hold; stage 5's hard dimensions are this list, and stages 3 and 4 build toward it:

- The production build passes and its output lands where the deploy mechanism in the `ROOT:` line expects it, folder and base path.
- Every section of the bible's outline exists, in order (the intro is an overlay, not a section, and its reduced-motion state is absence), and every effect-inventory row is implemented or has a logged deviation.
- The reduced-motion render is a complete page: every section's content and every effect's static state.
- No console errors on any page at 390, 900 and 1440 px.
- Lighthouse desktop: main page performance ≥ 85 and accessibility ≥ 95; reading room performance ≥ 90 and accessibility ≥ 95. Total JavaScript ≤ 400 KB gzipped. Keyboard reaches every interactive element, the arcana cards and the hero's measure action included.
- The rendered text matches `copy.md`; no literal colors or durations outside the generated `tokens.css`.
- The reading room renders every section in the new system with working navigation and anchors, nothing of the old site left.
- The logo is integrated as `LOGO.md` prescribes, and the ledger holds your `APPROVED: logo mark` line.

## Verification budget: milestones

Stated once here, read by every stage. **Wide checks run where a slice of work completes and before done, and nowhere else.** A slice is a stage, or one section of the page in stage 4. The wide check is: production build passes, both pages render in a headless browser, the console has no errors, the reduced-motion render is a complete page. No stage writes unit tests, and no step re-checks after each file change, because this is a frontier-tier runtime building a visual artifact whose failures show up in a render, not in a unit, and per-change checks would pay tokens at every iteration for findings the milestone render surfaces anyway. Stage 5 is the pre-done wide check with the full rubric.

## Failure handling

- **A milestone check fails** → the stage fixes it before writing `OK:`; it never proceeds on a red build.
- **A tool is missing** (Lighthouse, Playwright, an SVG renderer) → the stage asks you once whether to add it as a devDependency; declined → `SKIP:` line with the reason, and the grader reports that dimension as inconclusive rather than passing it.
- **You reject the logo mark twice** → stage 2 stops and reports; re-run `/site-01-bible` with your words about the logo so the brief changes, then `/site-02-logo` again.
- **The grader fails three rounds** → it stops, lists what still fails, and hands the decision to you: ship with the gap, or re-run stage 4 on the named sections. Three, because in practice fixes converge by the second round and a third fail means they have started trading one failure for another, which is a design decision, not a fix.
- **The grader returns pass-with-unverified** → a dimension could not be measured (a tool was missing). You decide: ship, or install the tool and re-run `/site-05-grade`; a re-grade with no change to the site does not consume a round. If you ship, the grader writes a `CLOSED:` line with your decision; a re-grade after installing the tool needs no line.
- **Context fills mid-stage** → nothing is lost that was written to `STATE.md`; re-run the same command and it resumes.
- **Owner absent mid-stage** → on a material fork a stage asks with a recommended default; if no answer comes, it proceeds on the default and logs `DEVIATION:`. The three hard gates are the exception and wait for you: stage 1's go, stage 2's mark approval, stage 3's folder confirmation.

## Running it in Claude Code

- Model: the strongest available. Stages 1, 2 and 5 are judgment-heavy; stages 3 and 4 are build-heavy.
- Effort: Claude Code exposes an effort level and extended thinking, not a temperature. Run stages 1, 2 and 5 at high effort; 3 and 4 at the default. Do not lower effort for stage 5, because it is the rubric upstream work optimizes toward and a careless grade is a wrong target.
- Permissions: stages 3 and 4 run `npm`, a build and a headless browser. Allow those in the project settings, or accept the prompts.
- Optional `CLAUDE.md` line for the repository, so unrelated sessions don't trip over the folder: `site-design/ is the design ledger of the website chain (WORKFLOW.md); read STATE.md before touching the site.`

## Assumptions baked in (change them in the stage files if wrong)

- English only; the old i18n layer is not carried over.
- No sound layer.
- Stack: Vite, TypeScript, Three.js, GSAP with ScrollTrigger, static output deployed to GitHub Pages by the mechanism the repository already uses.
- The reading room keeps its content and structure and is restyled; it gets no WebGL.
