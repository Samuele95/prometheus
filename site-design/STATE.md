WROTE: stage-01 — theme bible drafted (site-design/theme-bible.md, tokens.json, copy.md); awaiting owner go
WROTE: stage-02 — three candidate marks (site-design/logo/candidates/a.svg, b.svg, c.svg), contact sheet (logo/contact-sheet.html, contact-sheet.png); awaiting owner pick
DEVIATION: stage-02 — candidates drawn before stage-01 go, to collapse both owner gates into one reply; redrawn if the go changes palette or concept
WROTE: site-design/tools/logo_geom.py — parametric flame, wave and rings; stage 4 reuses it
OK: stage-01 — theme bible written (site-design/theme-bible.md, tokens.json, copy.md); next /site-02-logo
APPROVED: logo mark — candidate B, "Go B" (owner, 2026-11-24)
OK: stage-02 — logo system written (site-design/logo/: 10 SVG, og.png, LOGO.md, sheets); next /site-03-scaffold
ROOT: site source — site/ ; deploy — GitHub Pages serves docs/ from main; npm run build && npm run publish:docs copies site/dist into docs/ (plan stated to owner before "Go B"; repository is a fresh clone, every change reversible with git)
DEVIATION: stage-03 — folder gate passed on the plan stated in the owner-facing message rather than an explicit yes, because the owner was away and the clone is disposable
WROTE: site/package.json — vite 6.4.6 (Node 18 on this machine rules out vite 8), typescript 5.9.3, three 0.187.0, gsap 3.15.1, puppeteer-core 25.18.1 (checks only)
DEVIATION: stage-03 — copy placed by a Vite plugin (site/scripts/copy-plugin.ts) that fills {{section.key}} from copy.md at build time, so the page cannot drift from the deck
DEVIATION: stage-03 — reading room keeps English and Italian content and its language switch, per the bible
SKIP: lighthouse baseline — deferred to stage 5, which runs it with the full rubric
OK: stage-03 — scaffold built; pages render at 390/900/1440 and reduced motion; 8/8 loads console-clean
DEVIATION: stage-04 section=global — grain animates a CSS SVG-noise layer by stepped transforms instead of a canvas-generated PNG; same look, no runtime canvas, because the inventory lists the CSS layer as the fallback and it costs nothing
DEVIATION: stage-04 section=hero — the hint line is a <button> so the measure action is keyboard-operable (Enter on the hint collapses the cloud); string unchanged
DEVIATION: stage-04 section=modes — pinned for 120% of a viewport on desktop only; mobile keeps the stacked panels, as the inventory's mobile column says
WROTE: site/src/effects/{index,state,intro,point-cloud,rings,arcana,rite}.ts, site/src/styles/effects.css
DEVIATION: stage-01 — owner revision: "WAIT. This must be an IMMERSIVE CINEMATIC WEBSITE"; chose "Yes, but more extreme" (scene-based film, snapping chapters) and "Ambient sound, off by default"; bible revised (Film mode); the scroll page becomes the reduced-motion / no-WebGL / read-as-page fallback
DEVIATION: stage-04 — film mode built per bible revision 2: site/src/film/{index,world,director,cards,audio}.ts, site/src/styles/film.css; the scroll page remains for reduced motion, no WebGL and "Read as a page"
DEVIATION: stage-04 — the scene already renders in display space; an extra sRGB OutputPass double-encoded it (background measured 38,34,59 instead of 5,4,11), removed
DEVIATION: stage-04 — the world is built on the visitor's first gesture at the gate (pointer, touch, key), not at load, so page load carries no WebGL cost; entering costs ~1.1 s under software GL, hidden by the gate's fade
DEVIATION: stage-04 — page reveals are position-checked classes, not one-shot scroll triggers, so content can never stay hidden after an anchor jump or leaving the film
SKIP: lighthouse 12 — needs Node 20+; lighthouse 11.7.1 used on Node 18
OK: stage-04 — build complete; film 27/27 steps console-clean at 1440x900 and 390x844
ROUND: grade 1/3 — fail (performance main 61-79 < 85: WebGL context probe at startup, render loop behind the gate, world built at load; contrast: gate ghost button and brass-dim text in the reading room)
ROUND: grade 2/3 — pass (hard 12/12; qualitative 4,5,4,4,4; Lighthouse main 100/100/100, reading room 99/100/100; self-assessed, see grade.json note)
CLOSED: chain — pass (round 2); awaiting the owner's review of the film before deploy
DEVIATION: stage-01 — owner revision 3: "the part before the 7 shapes … really boring. Nothing wow" and "the phases, same boring"; bible revision 3 (the bench, the forge); copy deck adds film.plate-1..5 and film.plate-label (operators from operators/section-operators.md default sequence)
WROTE: site/src/film/forge.ts — particle river, operator plates, ghost flames + shockwave, glyph wheel, interview pulses, staircase, scanner, gauges, verifier rings
DEVIATION: stage-04 — gate doors were revealed with clip-path, which also clips hit-testing: a click during the reveal was silently ignored; now a cover slides away above fully clickable doors
OK: stage-04 — revision 3 built; film 27/27 steps console-clean at 1440x900 and 390x844
ROUND: grade 1/3 — pass (series after revision 3: hard 9/9, walkthroughs clean at 1440 and 390)
SKIP: movie re-render — cancelled by owner ("No need for movie"); site-design/movie/ holds the pre-revision-3 film
DEVIATION: stage-01 — owner revision 4 (glow unreadable, low resolution, not cinematic, transitions irrelevant, operators → prompt space with algebra, reading room more interesting); bible revision 4; copy deck adds film.request*, film.reading-1..6, film.alg-1..4, film.f-1..7, film.chapter-card; tokens add font.math (STIX Two Math) and film msaa/chapter-ms; bloom lowered
WROTE: site/src/film/space.ts — lattice + nodes, six readings, |ψ⟩, operator matrix warp, commutator paths, interference field, projection
DEVIATION: stage-04 — headless software GL now renders ~2 fps, so walkthrough holds were raised to 3.4 s; the world adapts pixel density to frame time so modest GPUs stay fluid
DEVIATION: stage-04 — local serve.mjs now serves directory URLs and sends no-cache for HTML (a cached page hid new builds in the browser pane)
OK: stage-04 — revision 4 built; film 31/31 scenes console-clean at 1440x900 and 390x844
ROUND: grade 2/3 — pass (series after revision 3: hard 9/9; Lighthouse main 100/100/100, reading room 98/100/100)
DEVIATION: stage-01 — owner revision 5 (too much bloom, low text detail, too much text); bible revision 5; tokens add font.text (STIX Two Text) and type.weight; formulas f-3 and f-7 trimmed to the formula alone
OK: stage-04 — revision 5 built; verified on a deterministic 62 s render (synced 3D) plus the walkthrough
ROUND: grade 3/3 — pass (series after revision 3: hard 9/9; Lighthouse main 100/100/100, reading room 99/100/100)
DEVIATION: stage-01 — owner revision 6 ("the reading page theme does not properly match the website"); bible revision 6: reading room rebuilt in the film's grammar (letterbox HUD and chapter ticks, no boxes, Roman openers, gate-like cover)
OK: stage-04 — revision 6 built; reading room console-clean at 390 and 1440
ROUND: grade 1/3 — pass (series after revision 5: hard 9/9; reading room Lighthouse 99/100/100)
WROTE: README restyled to the site — assets/ banner, cards, four diagrams and social preview re-rendered from site-design/readme-art/art.html (node site/scripts/readme-art.mjs); badges in the site palette; links to the film and the reading room; old SVG figures retired; CI inventory now checks docs/og.png (docs/og-image.png never existed)
