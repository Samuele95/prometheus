# Constraints — the substrate this package was built against

The limits that shaped every decision in this port, with what each one forced.

| Constraint | Value used | What it forced |
|---|---|---|
| Knowledge files per Gem | **10** | Seventeen one-source-per-file slots compressed to ten by four merges, each along a pairing the skill's own routing table already makes (`coverage-matrix.md`) |
| Knowledge file formats accepted | DOC, DOCX, PDF, RTF, DOT, DOTX, HWP, HWPX, TXT, Google Docs | Markdown, YAML and Python ship as `.txt` with structure preserved as literal text; PDF conversion rejected because it would destroy the byte fidelity `transform-diff.md` verifies |
| Instructions field, working cap | **30,000 characters** | 14,266 characters (48%). The cap is not the binding constraint here — the smallest-viable-token-set rule is, and it is what keeps both files at roughly half of it |
| Retrieval model | selective, keyed by content match; no directory listing | The wiring table, the explicit-pull rule, and the "filenames are load-bearing" warning repeated in the instructions, the setup guide and the README |
| Filesystem | **none** | Manage mode's degradation note; the replay verifier shipped as a runnable artifact for an external runtime; `reaudit_pass` reported unverified until that run happens |
| Code execution | **none** | Concordant with v3's build-time-only rule rather than in tension with it: the substrate enforces what the framework already required |
| Sub-agents / parallel contexts | **none** | "Fresh context" redefined as a new empty chat, and an inline verifier run labelled self-report rather than clearance (P8) |
| Sampling controls (temperature, top-p) | **not exposed** | No sampling prescription in the instructions; check M's guidance is delegated to whatever the *user's* runtime exposes (P6) |
| Turn output length | bounded, exact limit not published | The Phase 6 rule to split a multi-file delivery across consecutive turns rather than compress an artifact into a description |
| Persistence between turns | **none** | Every manage phase begins by asking for current state and ends by handing back the exact text to save; "the user is the filesystem" |

## Two constraints that are not the substrate's

**PORT-1, a port does not rewrite its source.** This is the package's own rule, and it is what keeps the corpus in the framework's own language, what makes `CHANGELOG.md` exempt from rewriting, and what stopped this run from "improving" anything it found in the source.

**Build-time only.** Prometheus v3 forbids running what it produces. This run honored it: nothing in this package was executed, no smoke test was run, no verifier was run, and no number anywhere in `run-evidence/` comes from an execution. Every figure is a count of bytes, lines or files.

## Version note

The source folder is named `prometheus-v3_1`; its `CHANGELOG.md` runs to **v3.3** (2026-09-06), which is the version this package is labelled with. If the folder name is the intended label rather than the changelog, the package label is what needs correcting — the corpus itself is whatever the changelog says it is.
