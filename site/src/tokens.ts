// generated from site-design/tokens.json; do not edit
export const tokens = {
  "meta": {
    "name": "Astrolabe of Fire",
    "version": 1
  },
  "color": {
    "void": "#05040b",
    "ink": "#0e0b1c",
    "ink-2": "#17122b",
    "bone": "#ece5d8",
    "muted": "#a39bb0",
    "brass": "#c9a35b",
    "brass-dim": "#6b5733",
    "ember": "#ff6b1f",
    "ember-deep": "#8c2b08",
    "holo": {
      "type": "gradient",
      "angle": 120,
      "stops": [
        "#7af0ff",
        "#b99bff",
        "#ffcf7a"
      ]
    }
  },
  "font": {
    "display": {
      "family": "Bodoni Moda Variable",
      "file": "fonts/bodoni-moda-latin-opsz-normal.woff2",
      "file-italic": "fonts/bodoni-moda-latin-opsz-italic.woff2",
      "weight-range": [
        400,
        900
      ],
      "opsz-range": [
        6,
        96
      ],
      "license": "OFL-1.1",
      "source": "@fontsource-variable/bodoni-moda@5.3.0"
    },
    "mono": {
      "family": "Geist Mono Variable",
      "file": "fonts/geist-mono-latin-wght-normal.woff2",
      "weight-range": [
        100,
        900
      ],
      "license": "OFL-1.1",
      "source": "@fontsource-variable/geist-mono@5.3.0"
    },
    "math": {
      "family": "STIX Two Math",
      "file": "fonts/stix-two-math-latin-400-normal.woff2",
      "license": "OFL-1.1",
      "source": "@fontsource/stix-two-math@5.3.0"
    },
    "text": {
      "family": "STIX Two Text Variable",
      "file": "fonts/stix-two-text-latin-wght-normal.woff2",
      "file-italic": "fonts/stix-two-text-latin-wght-italic.woff2",
      "weight-range": [
        400,
        700
      ],
      "license": "OFL-1.1",
      "source": "@fontsource-variable/stix-two-text@5.3.0"
    }
  },
  "type": {
    "scale": {
      "display-xl": "clamp(3.5rem, 10vw, 10rem)",
      "display": "clamp(2.5rem, 5.6vw, 5.25rem)",
      "display-s": "clamp(1.75rem, 3vw, 2.75rem)",
      "lead": "clamp(1.25rem, 1.8vw, 1.6rem)",
      "body": "1.125rem",
      "small": "0.9375rem",
      "label": "0.75rem"
    },
    "leading": {
      "display": "1.02",
      "body": "1.6",
      "mono": "1.4"
    },
    "tracking": {
      "label": "0.22em",
      "display": "-0.02em"
    },
    "opsz": {
      "display": "96",
      "body": "11"
    },
    "weight": {
      "display": 440,
      "reading": 430
    }
  },
  "space": {
    "unit-px": 8,
    "section-y": "clamp(6rem, 18vh, 14rem)",
    "gutter": "clamp(1rem, 4vw, 4rem)",
    "measure": "62ch",
    "measure-docs": "68ch",
    "measure-display": "18ch"
  },
  "radius": {
    "card": "2px",
    "button": "999px"
  },
  "motion": {
    "ease": {
      "out": "cubic-bezier(0.16, 1, 0.3, 1)",
      "inout": "cubic-bezier(0.83, 0, 0.17, 1)"
    },
    "duration": {
      "short": 180,
      "medium": 520,
      "long": 1200,
      "collapse": 1800,
      "intro": 2400
    },
    "scroll": {
      "hero-pin-vh": 220,
      "ring-turn-per-page": 0.18,
      "reveal-start": "top 75%"
    },
    "pointer": {
      "cloud-orbit-deg": 6
    }
  },
  "effects": {
    "point-cloud": {
      "points-desktop": 150000,
      "points-mobile": 40000,
      "dpr-cap": 2,
      "dpr-cap-mobile": 1.6,
      "size-px": 1.15,
      "holo-share": 0.05,
      "flicker": 0.02
    },
    "grain": {
      "opacity": 0.07,
      "opacity-docs": 0.035
    },
    "vignette": {
      "strength": 0.6
    },
    "arcana": {
      "tilt-deg": 8,
      "flip-ms": 700
    },
    "rings": {
      "count-desktop": 5,
      "count-mobile": 3,
      "opacity": 0.26
    },
    "film": {
      "transition-ms": 1600,
      "caption-ms": 700,
      "step-lock-ms": 1250,
      "bloom-strength": 0.32,
      "bloom-radius": 0.35,
      "bloom-threshold": 0.78,
      "aberration": 0,
      "shock": 0.011,
      "grain": 0.016,
      "vignette": 0.5,
      "fov-deg": 40,
      "orbit-radius": 9.5,
      "rite-radius": 7,
      "cursor-lerp": 0.22,
      "msaa": 4,
      "chapter-ms": 2800
    }
  },
  "breakpoints": {
    "sm": 640,
    "md": 900,
    "lg": 1280
  }
} as const;
