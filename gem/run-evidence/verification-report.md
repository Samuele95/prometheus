# verification-report.md — Stage 6 programmatic verification

All evidence below is script output (model-narrated verification rejected).
This is the post-rename re-run (Gem renamed to Prometheus; artifacts touched,
so the Stage 7 gate mandated a Stage 6 re-run). See deviations D4, D5.

```
=== C1 — Dangling references ===
  refs extracted from shipped files: 142
    KNOWN-DANGLING(B4)    : 1
    OUT-OF-CORPUS         : 3
    RUNTIME-GENERATED     : 66
    SHIPPED               : 68
    SKILL-ALLOWLIST       : 4
  known-carried DANGLING (B4, expected): ['manage-operators.txt:403 manage-verify.py']
  new/unexplained dangling: []
  C1 PASS

=== C2 — Limits ===
  knowledge files 8 <= 10: True
  max file size 61518 B <= 104857600: True
  instructions 19249 chars <= 30000: True
  C2 PASS

=== C3 — Matrix closure ===
  matrix rows: 24; inventory files: 24
  inventory files absent from matrix: none
  matrix destinations: ['gem-instructions.md', 'manage-agent-design.txt', 'manage-core.txt', 'manage-operators.txt', 'provenance.txt', 'quantum-core.txt', 'refactor-mode.txt', 'shapes-and-build.txt', 'verifier-and-audit.txt']
  destinations missing on disk: none
  omitted files (must be genuinely absent): none
  C3 PASS

=== C4 — I4 platform-name sweep ===
  PORT-INTRODUCED platform names in title/SOURCE headers (must be 0): 0
  B2-mandated provenance 'Gem' (authorized, not a violation): 2 occurrences
  pre-existing vendor/model refs in bodies (ACCEPTED CARRY-FORWARD, I1/I5): {'Claude Code': 14, 'Claude': 28, 'OpenAI': 8, 'Anthropic': 38, 'GPT': 6, 'Cursor': 0, 'IBM': 5, 'Gemini CLI': 3}
  C4 PASS

=== STAGE 6 GATE ===
  C1: PASS
  C2: PASS
  C3: PASS
  C4: PASS
  STAGE-6 GATE: PASS
```
