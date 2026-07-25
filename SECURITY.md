# Security Policy

## What this project is

Prometheus is a corpus of Markdown instructions plus one dependency-free Python
script (`manage/replay-verifier.py`). There is no server, no network calls, and
no build step. The realistic attack surface is therefore narrow — but not empty.

## In scope

- **Prompt-injection carriers.** Corpus text that would cause a consuming agent
  to take an unsafe action (exfiltrate context, run destructive commands,
  disable its own guardrails).
- **Unsafe guidance.** Framework text that instructs an agent to weaken a
  capability lockdown, skip a verifier, or ship an artifact it flagged as unsafe.
- **`manage/replay-verifier.py`.** Path traversal, unsafe deserialisation, or
  arbitrary code execution when run against an untrusted agent package.
- **Supply chain.** Anything in `.github/workflows/` that could leak repository
  secrets.

## Out of scope

- Bad output quality from a prompt the framework designed. That is an issue, not
  a vulnerability — open a normal issue.
- The behaviour of third-party models or runtimes (Claude, Gemini, Codex, …).
- Anything in `docs/`, which is a static site with no backend.

## Reporting

Please **do not** open a public issue for a suspected vulnerability.

Use GitHub's **Report a vulnerability** button under the repository's Security
tab (private vulnerability reporting). Include the file, the sequence that
triggers the problem, and the impact you observed.

Expect an acknowledgement within 7 days and an assessment within 30. Fixes ship
in the next release; credit is given unless you ask otherwise.

## For users of this framework

`manage/replay-verifier.py` reads agent packages that may contain untrusted
content. Run it against packages you trust, or in a sandbox. The framework
itself never executes prompt content — but the agent you point it at can.
