# Astrolabe of Fire — theme bible

Version 1, stage 1 of the site chain (`site-design/WORKFLOW.md`). Every value named here lives in `tokens.json` under the same name; every string lives in `copy.md`.

## Direction

The page is an instrument, not a poster. An astrolabe was the machine people built to make sense of a sky they could not touch; Prometheus is the instrument a builder uses to make sense of a model they cannot open. So the page is drawn the way old instruments were drawn: engraved rings, tick marks, numerals, fine brass lines on a night ground, and in the middle of it a fire that behaves like a measurement. Every ornament on the page is a scale, a dial or a reading, never a flourish.

The AI half of the theme is not chrome and circuitry. It is the framework's own vocabulary made visible: a cloud of possible readings held in superposition, an operator that projects it, a collapse into one answer. The hero shows exactly that: tens of thousands of points drifting in a volume until the visitor's first scroll measures them and they fall into the shape of the flame. One iridescent accent marks the three moments the page talks about measurement; everywhere else the palette is night, bone, brass and ember. The tone is a quiet, exact voice reading an engraving aloud: no hype, no exclamation marks, the sentences of someone who has built the thing.

## Palette

Ground is a near-black with a violet cast, layered in three steps so panels and cards separate without borders. Text is bone. Brass is the instrument: lines, rings, numerals, borders, labels. Ember is the fire: the flame, primary actions, the single highlighted word in a display line. Holo is reserved.

| Token | Value | Role | May appear | May not appear |
|---|---|---|---|---|
| `color.void` | `#05040b` | page ground | `body`, canvas clear color | — |
| `color.ink` | `#0e0b1c` | raised ground: cards, code blocks, nav when scrolled | panels | text |
| `color.ink-2` | `#17122b` | highest ground: card hover, focused code line | hover and focus states | text |
| `color.bone` | `#ece5d8` | all body text and display text | text everywhere | large fills |
| `color.muted` | `#a39bb0` | secondary text, captions, metadata | text at any size | display lines |
| `color.brass` | `#c9a35b` | rings, rules, tick marks, card borders, mono labels, roman numerals | lines, labels (mono, uppercase), numerals | body text, paragraphs |
| `color.brass-dim` | `#6b5733` | engraved detail at low emphasis: minor ticks, ring glyphs | SVG strokes | text |
| `color.ember` | `#ff6b1f` | the flame, primary call to action, one emphasized word per display line | display text, buttons, the flame | text smaller than `type.scale.display` except buttons |
| `color.ember-deep` | `#8c2b08` | the flame's base, ember glows and gradients | gradients, glows | text |
| `color.holo` | gradient `120deg #7af0ff → #b99bff → #ffcf7a` | measurement | exactly three places, below | anywhere else |

**The three holo places.** (1) The 5% of hero points that flicker during the collapse. (2) The word "measured" in the thesis section's third line. (3) The verifier rite station's ring segment, the sixth phase, where the framework checks its own work. An accent that recurs becomes a palette color and the measurement moments stop reading as special.

**Contrast of every allowed text-on-ground pair** (WCAG ratio): bone on void 16.3, on ink 15.5, on ink-2 14.5; muted on void 7.7, on ink 7.3, on ink-2 6.8; brass on void 8.6, on ink 8.2 (mono labels only); ember on void 7.2, on ink 6.8 (display and buttons only). Every pair passes AA at body size; brass and ember are restricted by role, not by contrast, so the page keeps one voice for reading and reserves the warm tones for the instrument and the fire.

## Typography

Two families, both OFL, self-hosted from the Fontsource variable packages (exact files under Font files).

- **Display and reading: Bodoni Moda** (variable, `wght` 400–900, `opsz` 6–96). A Didone: hairline thin strokes against heavy stems, the sharpest contrast available in an open serif, and it reads as an engraving. The optical-size axis lets the same family serve the 9rem hero and the 1.125rem paragraph: at display sizes `opsz` 96 gives needle-thin hairlines; at body sizes `opsz` 11 thickens them for reading. Display weight 400 (the contrast does the work; bold Didones turn heavy), body weight 400, emphasis italic, never bold.
- **Operational: Geist Mono** (variable, `wght` 100–900). Commands, labels, numerals in the HUD, card numbers, state lines. Always weight 400 for code, 500 uppercase with `type.tracking.label` for labels.

**Scale** (`type.scale`): `display-xl` clamp(3.5rem, 10vw, 10rem) for the hero title only · `display` clamp(2.5rem, 5.6vw, 5.25rem) section titles · `display-s` clamp(1.75rem, 3vw, 2.75rem) card names and subheads · `lead` clamp(1.25rem, 1.8vw, 1.6rem) the first paragraph of a section · `body` 1.125rem · `small` 0.9375rem · `label` 0.75rem mono uppercase.

**Line length** `space.measure` 62ch for reading text, 18ch for display lines (display breaks are deliberate: the copy deck marks second lines with `-2`). Line height 1.02 for display, 1.6 for body, 1.4 for mono.

**Shared lines.** A section opens with a mono label in brass (`I · THE PRINCIPLE`) above a Bodoni display line in bone; mono never appears inside a display line, and a display line never sits inside a mono block. Inline code inside body text uses Geist Mono at 0.92em on `color.ink`.

**Font files.** `@fontsource-variable/bodoni-moda` 5.3.0 (`files/bodoni-moda-latin-opsz-normal.woff2`, `…-opsz-italic.woff2`; source https://fontsource.org/fonts/bodoni-moda, OFL 1.1) and `@fontsource-variable/geist-mono` 5.3.0 (`files/geist-mono-latin-wght-normal.woff2`; source https://fontsource.org/fonts/geist-mono, OFL 1.1). Stage 3 copies the woff2 files into the project rather than importing the package CSS, so the `@font-face` rules carry the exact axes and `font-display: swap`.

## Motion language

Motion is either **caused by the visitor** or **slow enough to be ambient**; nothing moves fast on its own.

- **Easings** (`motion.ease`): `out` cubic-bezier(0.16, 1, 0.3, 1) for anything arriving; `inout` cubic-bezier(0.83, 0, 0.17, 1) for the collapse and card flips, the two transformations; `linear` only for scroll-scrubbed rotation.
- **Duration tiers** (`motion.duration`, ms): `short` 180 hover and focus · `medium` 520 reveals · `long` 1200 section transitions and the intro's parts · `collapse` 1800 the hero collapse when triggered by click.
- **Scroll drives** the hero collapse (scrubbed over the hero pin, `motion.scroll.hero-pin-vh` 220), ring rotation (`motion.scroll.ring-turn-per-page` 0.18 turns per viewport scrolled), the rite procession and section reveals (each fires once, at 75% viewport).
- **The pointer drives** the arcana tilt, a faint parallax of the point cloud before collapse (max 6° orbit), and nothing else.
- **Ambient** only: point drift in superposition, the flame's flicker after collapse (amplitude 2% of point positions), the grain.
- **Reduced motion:** every effect renders its final state immediately, as listed in the inventory's reduced-motion column. Reveals are shown, the hero is the collapsed flame, rings stand still at their rest angle, cards show front and meaning side by side. Nothing is revealed only by motion.

## Effect inventory

| id | section | layer | what it does | trigger | reduced motion | mobile (< 900px) | cost |
|---|---|---|---|---|---|---|---|
| `intro-ignition` | intro | SVG | `logo/intro.svg` plays: rings draw, points converge into the flame, wordmark settles; cross-fades to the page | first visit, page load | absent | same, scaled | ~6 KB SVG, CSS only |
| `hero-point-cloud` | hero | WebGL | 60k points in a drifting volume (superposition) lerp into points sampled from the logo's flame path; ember and brass, 5% holo flicker during the collapse | scroll scrubs `measure` 0→1 over the pin; click or Enter on the hero jumps to 1 over `collapse` | static `mark.svg` flame, large, centered | 14k points, DPR cap 1.25 | three.js ~150 KB gz, loaded after first paint |
| `hero-measure-hint` | hero | CSS | a mono "scroll to measure" line with a slow tick, fades as `measure` rises | scroll | hidden | same | trivial |
| `thesis-rings` | thesis, rite | SVG | three to five engraved concentric rings (opacity `effects.rings.opacity`, kept low so headlines stay clean) in a fixed layer behind the content, counter-rotating with scroll; ticks, numerals, a few glyphs | scroll progress | still at rest angle | three rings, no glyphs | compositor transforms only |
| `thesis-operator-lines` | thesis | CSS | the three thesis lines reveal one by one; the word "measured" takes the holo gradient as its line arrives | reveal at 75% viewport | all lines shown, holo word shown | same | trivial |
| `arcana-cards` | arcana | CSS + SVG | seven cards: pointer tilt up to `effects.arcana.tilt-deg`, a flip reveals the meaning, glyph inline SVG; focus mirrors hover, Enter flips, Escape restores | pointer, keyboard | front and meaning shown together, no tilt | horizontal scroll-snap row, tap flips, no tilt | trivial |
| `rite-procession` | rite | SVG + CSS | the six phases sit as stations on an arc of the rings; as the section scrolls, a brass marker travels the arc and each station lights in turn; station six carries the holo ring segment | scroll scrubbed | all six stations lit, marker at the end | vertical list with a straight rule instead of the arc | compositor transforms only |
| `modes-triptych` | modes | CSS | three panels; the active panel widens as it enters center, the others narrow to their numeral | scroll position | three equal panels | stacked panels | trivial |
| `ignite-command` | ignite | CSS | the install command types itself once, a caret blinks, a copy button copies it | reveal | full command shown | same | trivial |
| `grain` | global | CSS | animated film grain over everything, `effects.grain.opacity` | always | static grain | same | one 128px noise PNG generated by canvas at load, or a CSS gradient fallback |
| `vignette` | global | CSS | radial darkening at the viewport edges, `effects.vignette.strength` | always | same | lighter | trivial |
| `nav-state` | global | CSS | the nav is transparent over the hero and takes `color.ink` with a hairline brass rule after it | scroll past hero | same, no transition | same | trivial |

Stage 4 implements exactly these rows; stage 5 fails a missing row unless a `DEVIATION:` line explains it.

## Page outline

1. `intro` — overlay, not a landmark: the ignition. Under 2.5 s, skippable by any key or click, absent under reduced motion and on a return visit (sessionStorage). Its static state is absence.
2. `hero` — the point cloud; eyebrow, two-line title, one-line body, two calls to action; the measure hint.
3. `thesis` — the principle: a prompt is a sequence of operators; ordering is structural; ambiguity is a superposition until it is measured. Rings behind.
4. `arcana` — the seven prompt shapes as seven cards.
5. `rite` — the six phases of the fabrication cycle as stations on the rings, plus the verification line (static, single-run, cross-run).
6. `modes` — from scratch, refactor, manage.
7. `ignite` — install: three steps, the runtimes, the reading room link, the zip download.
8. `colophon` — footer: repository, license, the build-time line, the stacked lockup.

## The seven arcana

Roman numeral · name · plain shape name. Meaning: what the shape does for the builder. Glyph: simple geometry on a 64-unit grid, brass stroke 1.5.

- **I · The Loop** — agentic loop. Meaning: work that returns to itself until the condition is met; memory outlives the turn. Glyph: an open ring with one break, a dot where the next turn begins.
- **II · The Arrow** — one-shot task. Meaning: one call, one answer, the format fixed before the first word. Glyph: a straight vertical line crossing a small circle, ending in a chevron.
- **III · The Chain** — workflow chain. Meaning: stages that hand a file to the next; what is lost early cannot be recovered late. Glyph: three small circles on a vertical line, each joined to the next.
- **IV · The Hand** — sub-agent or tool. Meaning: a capability another agent reaches for; its first line is the whole of its name. Glyph: a small circle inside a larger arc open at the top, like a cupped palm.
- **V · The Mask** — system persona. Meaning: a voice that holds under pressure and knows what it refuses. Glyph: a vesica (two intersecting circles) with a horizontal line through the overlap.
- **VI · The Scales** — LLM-as-judge. Meaning: reasoning before the verdict, anchors at every level, and the honesty to say inconclusive. Glyph: a horizontal beam on a vertical post, two short arcs hanging from its ends.
- **VII · The Council** — agent team. Meaning: roles with walls between them, contracts on every door, one place where the state lives. Glyph: six dots evenly spaced on a circle around a seventh at the center.

## Logo brief

**Concept.** Nested astrolabe rings, and a flame drawn as one collapsing wavefunction line: a single continuous stroke that starts as a wide oscillation at the bottom and narrows upward into the tip of a flame. Read at a glance it is a fire; held a second longer it is an eye, the rings its iris and the flame its pupil. The flame is the hero's collapse target, so its silhouette must be strong when filled with points.

**Palette.** Base mark: ember flame, brass rings, on void or bone. Monochrome: `currentColor`. Holo: only `mark-holo.svg`, where the flame's stroke takes the holo gradient.

**Contexts it must survive.** 16px favicon (the small variant drops all but one ring and keeps the flame), monochrome, on bone and on void, the 1200×630 social image, the animated intro.

**The quality the owner cares most about.** Immediate presence: the owner asked for "a really WOW logo". It must be the first thing remembered after closing the tab, which means one bold idea drawn with precision, not many details.

## Reading-room restyle rules

`docs/docs.html` keeps its content, structure, anchors and both languages (its content is bilingual English and Italian; the language switch stays because it switches content, not chrome). It takes the new system:

- Ground `color.void`, text bone, headings in Bodoni Moda at `display-s` and `display` with `opsz` high, body Bodoni Moda `opsz` 11 at `body`, measure 68ch.
- Navigation chrome: a left rail on `color.ink` with mono uppercase section labels in muted, the current section in brass with a 1px brass rule; on mobile a top drawer.
- Code blocks in Geist Mono on `color.ink` with a 1px `brass-dim` left rule; inline code as on the main page.
- Callouts and tables: hairline `brass-dim` borders, no fills beyond ink.
- The horizontal lockup in the header linking back to the main page; the favicon.
- No WebGL, no scroll choreography, no grain animation (static grain allowed at half opacity), because the reading room is for reading.

## Voice

Short declarative sentences. The framework's own vocabulary, used precisely: operator, shape, measurement, collapse, verifier. Second person for the builder ("you describe", "you install"). No exclamation marks, no superlatives, no "revolutionary". Esoteric register only in names (the arcana, the rite, the colophon); the sentences under them stay plain, because a claim dressed as prophecy reads as marketing and the framework's claims are checkable.

## Film mode (revision 2)

Owner, after seeing the scroll page: "This must be an IMMERSIVE CINEMATIC WEBSITE"; chose "Yes, but more extreme" and ambient sound off by default.

The main page is a film, not a scrolling document. One persistent full-screen WebGL world; the visitor advances it in discrete steps (wheel, swipe, arrow keys, space, the HUD), each step a camera move and a change of state, like cuts in a film player. Text appears as sparse title cards over the world. The stage 3 scroll page stays as the fallback for reduced motion, for devices without WebGL, and for anyone who chooses "Read as a page".

**The world.** At its center the flame, made of points, in world space. Around it an armillary astrolabe: engraved brass rings at different inclinations plus one flat engraved dial with ticks and roman numerals, lit by the flame. A far starfield of bone and brass dust. Seven arcana cards orbit the flame. Six rite stations sit on the outer ring.

| Chapter | Steps | Camera and world |
|---|---|---|
| 0 Superposition | 2 | Start inside the cloud; the first advance is the measurement: the cloud collapses into the flame and the logo's rings |
| 1 The principle | 4 | Pull back; the armillary assembles and turns. Line 1 amplifies a band of the flame and dims the rest; line 2 swaps the order of two rings; line 3 sends the flame back toward superposition and re-collapses it, holo flicker on "measured" |
| 2 The seven shapes | 8 | Out to the orbit; seven cards circle the flame; each step brings the next card to the front, where it turns and flips to its meaning |
| 3 The rite | 7 | Along the outer ring; each step lights the next station; at the sixth a holo arc ignites: the verifier |
| 4 The three modes | 4 | I rings assemble from scattered; II rings snap into the logo's flat alignment; III rings turn as a continuous loop |
| 5 Ignite | 2 | Dive into the flame, points streaming past; pull back to the logo pose with the install command and the colophon |

**Film grammar.** Letterbox bars; a HUD with the lockup, chapter name and counter, step ticks, sound toggle, "Read as a page", reading-room link; a gate with the animated ignition and two doors (with sound, in silence). Transitions: `inout` over 1.6 s with an aberration shock and a bloom swell. Post: bloom, grain, vignette, slight chromatic aberration. Custom cursor: a brass reticle, ember over interactive elements.

**Sound.** Off by default, never autoplays, chosen at the gate or in the HUD, remembered. A generated drone (detuned saws through a slow lowpass), an air swell on each transition, a deep ignition on the collapse and the dive. Web Audio only, no files.

**Accessibility.** Captions are real text with headings; every step reachable by keyboard; "Read as a page" one Tab away; reduced motion never shows the film.

**Film inventory rows** (supersede the scroll rows on the film path; the scroll rows remain the no-WebGL path): `film-gate`, `film-world`, `film-director`, `film-post`, `film-hud`, `film-audio`, `film-cursor` — each absent under reduced motion; mobile uses fewer points, three rings, bloom at half resolution, swipe input, no cursor.

## Revision 3: the principle and the rite enact their ideas

Owner, after watching the film: the chapter before the seven shapes and the phases were "just text replacement … nothing wow". Both chapters now perform what their captions say.

- **The principle: the optical bench.** A river of particles (intent) flows from the dark through five engraved glass plates, the framework's own default operator sequence: Identity, Context, Task, Constraints, Format. It pours into the flame and builds it. Line 1: the camera faces the Constraints plate; particles that hit it either flare and burn out (suppressed) or leave brighter and tighter (amplified). Line 2: Task and Format swap places in mid-air and the same particles land as an inverted, cold brass flame. Line 3: the flame splits into five superposed ghost flames, then a holographic shockwave (the measurement) collapses them into one.
- **The rite: the forge.** Shape: a zodiac wheel of the seven arcana glyphs spins facing the viewer; one (The Loop) is chosen and rises to the crest. Interview: light pulses travel between the second station and the chosen shape, question and answer. Draft: the five plates from the bench fly in and form an upright staircase in operator order. Audit: an ember laser ring sweeps the staircase; Constraints flares red, then is repaired. Score: three brass dials fill behind the staircase (no numbers are shown: the dials depict scoring, they do not report a score). Deliver: the staircase merges into one tablet and three holographic verifier rings (static, single-run, cross-run) close around it.
- The plates carry real text from the copy deck (`film.plate-*`); the glyphs are drawn from the page's own SVGs.

## Revision 4: readable, sharp, cinematic; prompt space; an illuminated reading room

Owner: the glow made sections unreadable; the image looked low-resolution; the film was not cinematic or immersive and changes between sections felt irrelevant; the operator chapter should become an immersion in prompt space with algebraic visualizations; the reading room should be more interesting.

- **Readability.** Bloom is a multiplier on a lower token base (`effects.film.bloom-strength` 0.55, threshold 0.5); every caption sits on a dark radial scrim; flame intensity is a scene parameter so algebra can lead.
- **Resolution.** Multisampled half-float render target (`effects.film.msaa`), pixel-density cap 2 (1.6 mobile) with adaptive resolution that lowers density only when frames run slow, 150k flame points, lattice nodes, sharper textures.
- **Cinema.** Chapter changes are journeys: the letterbox closes, a chapter title card crosses warp streaks, the camera flies a curved path away from both subjects (`effects.film.chapter-ms`). Cuts inside a chapter arc instead of sliding; the camera always drifts; points out of the focal plane open into soft discs (depth of field).
- **Prompt space (The principle, 8 scenes).** From references/quantum-principles.md: a request is a state over readings (P3, |ψ⟩ = Σ c_k |k⟩); a section is a matrix that deforms the lattice, stretching amplified readings and flattening suppressed ones (P1); the same two sections in two orders land in two places, the gap being the commutator (P2); sections combine by interference, shown as two wave sources on a field (P4); measurement projects onto one reading, irreversibly (P5). The example request and its six readings are labelled illustrative. Formulas are set in STIX Two Math (OFL, self-hosted) because Bodoni Moda lacks the operators.
- **Reading room.** A cover with an animated astrolabe and a contents dial; each section opens with an outlined numeral over an engraved tick rule; drop caps; ornamented callouts and plate-framed figures; a reading-progress line; an astrolabe watermark that turns with reading progress. Still no WebGL.

## Revision 5: less bloom, real typographic detail, one idea per screen

Owner: still too much bloom; low detail, especially in text and font; too much text on screen at times.

- **Bloom** only on the brightest cores (`bloom-strength` 0.32, threshold 0.78); no constant chromatic aberration (only the cut's shock); grain halved; flame glow sprite and point alpha reduced.
- **Type.** Bodoni Moda stays for display (titles, names, numerals) with automatic optical sizing instead of a forced 96 (the forced optical size erased hairlines at caption sizes). Reading text moves to **STIX Two Text** (OFL, self-hosted), a sturdy text face that pairs with STIX Two Math. Caption halos removed; firmer reading weight (`type.weight.reading`).
- **3D text** (labels, plates, cards, glyphs) drawn at 2-3x resolution with 16x anisotropy; adaptive resolution never drops below native density; all shaders are compiled while the gate is up so no scene stutters on first appearance.
- **One idea per screen.** Each scene shows a heading and at most one sentence (or a formula and one sentence). Anything the 3D or the chapter card already shows (card meanings, the three verifier layers, section labels, the install steps, the coda) remains for screen readers only. The final screen shows the command, the runtimes and the two actions.

## Revision 6: the reading room speaks the film's language

Owner: the reading page theme did not match the website. The reading room had drifted into app UI (a boxed indigo rail, pill toggles, filled callouts, figures and tables, a warm ember wash), while the film speaks in letterbox chrome and inscriptions on the void.

- **Chrome.** The film's letterbox: a fixed HUD bar above (lockup, a live Roman chapter counter and the section's name, tools) and a bar of eleven chapter ticks below that fill with reading progress inside each section and jump on click. The thin progress line is retired.
- **No boxes.** The rail is engraved text behind a hairline rule; the runtime switch is a text toggle underlined in ember. Callouts are inscriptions with a left hairline (ember for "In short", dashed for notes). Figures sit between engraved tick rules. Tables lose their frame. Code keeps the film's terminal style. Pager, filter and source panels are hairline-ruled.
- **Ground.** Pure void with a sparse static starfield and the turning astrolabe watermark; the ember and indigo washes are removed.
- **Openers and cover.** Section openers use outlined Roman numerals like the film's chapter cards. The cover is composed like the film's gate: centred title inside the turning astrolabe, one line, one button; the contents strip (Roman numerals, section names) sits just below the fold.
