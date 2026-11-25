# Prometheus logo system

Approved mark: candidate B ("Go B", owner, 2026-11-24). Source of truth: `site-design/tools/logo_geom.py` (geometry) and `build_logo.py` (files). Edit the scripts and rebuild; never hand-edit the generated SVGs.

## Construction
- 64-unit grid. Ring centre (32, 36). Outer ring r 24, stroke 1.4; inner ring r 19.5, stroke 0.55; 60 ticks between r 22.4 and 24, every fifth tick long (to r 21.4), stroke 0.5. Two stroke weights only.
- Flame: one closed path `#flame`, base y 57, tip y 3, leaning right, widest near a quarter of its height. It breaks out of the ring at the top: the fire leaves the instrument.
- The wavefunction is cut out of the flame by a mask, never drawn on top: a wide oscillation at the base that narrows and stops, then one point (the collapse) at 69% of the flame's height. It reads as an eye's pupil at a glance.
- `site/src/flame-geometry.json` holds the flame path, the wave, the point and 4000 interior samples: the hero point cloud collapses into exactly this shape.

## Files
| File | Use |
|---|---|
| `mark.svg` | default mark: ember flame, brass rings, on void or bone |
| `mark-mono.svg` | one colour, `currentColor` |
| `mark-holo.svg` | the only variant with the holo gradient; reserved for measurement moments |
| `mark-small.svg`, `favicon.svg` | 16 and 32 px: one heavy ring, solid flame, no wave, no ticks |
| `wordmark.svg` | PROMETHEUS in Bodoni Moda (wght 620, opsz 24), outlined, tracking 0.2em |
| `lockup-horizontal.svg` | nav, reading-room header |
| `lockup-stacked.svg` | footer, intro end state |
| `og.svg`, `og.png` | 1200×630 social image |
| `intro.svg` | animated ignition, 2.3 s, ends in the stacked lockup's exact final state; static under reduced motion |

## Clear space and minimum sizes
- Clear space around the mark: the inner ring's radius scaled to the mark (19.5/64 of its height) on every side.
- Minimum: `mark.svg` 40 px; below 40 px use `mark-small.svg`. Horizontal lockup 28 px tall minimum. Wordmark 10 px cap height minimum.

## Colour per ground
- On void: ember flame, brass rings, bone wordmark.
- On bone: same mark; the wordmark in void (use `mark-mono` + a void wordmark, or recolour via the build script).
- Never on ember or brass grounds; never with a drop shadow or outer glow.

## Do not change
1. The wave stops and the point sits above it. That gap is the collapse; closing it turns the mark into a squiggle.
2. The flame's tip breaks out of the ring. Inside the ring it is a lamp; outside it is Prometheus.
