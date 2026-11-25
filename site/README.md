# Prometheus site — source

The cinematic site served from `../docs` by GitHub Pages. Design system, copy and ledger: `../site-design/` (start with `WORKFLOW.md`, then `theme-bible.md`).

```bash
npm install
npm run dev            # http://localhost:5173 (the reading room's source browser needs the published docs/source; use the server below)
npm run build          # tokens -> CSS, typecheck, build to dist/
npm run publish:docs   # copy dist/ into ../docs (keeps docs/source, the redirect pages, robots.txt)
node scripts/serve.mjs # serve ../docs at http://localhost:4173/prometheus/ like Pages does
```

Checks (Chrome at /usr/bin/google-chrome; run `scripts/serve.mjs` first for grade.mjs):

```bash
node scripts/film-check.mjs ../site-design/checks/film 1440 900   # walk all 27 film steps, screenshot each
node scripts/grade.mjs ../site-design/checks/grade                # done-definition hard checks
node scripts/audio-check.mjs                                      # sound only after a gesture; toggle persists
node scripts/enter-latency.mjs                                    # gate click to first film frame
```

Where things live: `src/film/` the film (world, director, cards, audio), `src/effects/` the scroll page, `src/styles/` tokens-driven CSS, `index.html` the page markup whose text the film captions clone, `docs.html` the reading room content.
