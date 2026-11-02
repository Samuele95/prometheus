# Setup guide — Prometheus (Gem, EN)

Assembling this package as a Gem. Read this before anything else.

**Filenames are load-bearing.** The instructions' wiring table names each knowledge file exactly, retrieval is selective, and a Gem cannot list its own knowledge directory. A renamed file is an unreachable file, and the failure is silent: the Gem answers from memory of the corpus instead of from the corpus.

## 1. Create the Gem

Create a new Gem named **Prometheus**. The Gem and the framework it carries now have the same name — v3 renamed the framework, so the "Prometheus / prompt-architect" split that earlier versions of this package explained no longer exists anywhere in the corpus.

## 2. Paste the instructions

Copy the entire contents of `gem-instructions.md` into the Gem's instructions field, exactly as it is.

The markdown structure is functional, not decorative: the section ordering is an operator sequence (strongest first, P2), and the wiring table at the end is what makes the knowledge files reachable at all. Do not reflow, summarize or reorder it.

## 3. Upload the ten knowledge files

Upload all ten `.txt` files from `knowledge/`, **without renaming them**.

| File | Bytes | Carries |
|---|---|---|
| `provenance.txt` | 71,093 | `CITATIONS.md`, `CHANGELOG.md`, `LICENSE` |
| `manage.txt` | 40,996 | `references/manage.md` + the four `assets/manage/*` artifacts |
| `shapes.txt` | 22,809 | `references/shapes.md`, `references/loops.md`, `assets/minimum-viable-prompt.yaml` |
| `audit.txt` | 19,404 | `references/audit.md` |
| `cognitive-tools.txt` | 18,187 | `references/cognitive-tools.md`, `assets/cognitive-tools.json` |
| `quantum-principles.txt` | 18,003 | `references/quantum-principles.md` |
| `agent-teams.txt` | 12,874 | `references/agent-teams.md`, `references/agent-output.md` |
| `operators.txt` | 11,815 | `references/operators.md` |
| `evals.txt` | 11,236 | `references/evals.md` |
| `refactor.txt` | 7,649 | `references/refactor.md` |

Ten files against a ten-file cap: the corpus is full. Every file is far under the per-file size limit; the whole corpus is 234,066 bytes.

**Why `.txt`.** Gem knowledge upload accepts DOC, DOCX, PDF, RTF, DOT, DOTX, HWP, HWPX, TXT and Google Docs — not `.md`, `.yaml` or `.py`. The corpus is markdown, YAML and one Python file, so it ships as `.txt` with the structure preserved as literal text. Do not convert to PDF: it would break the byte-level fidelity this package was verified against.

## 4. Run the smoke tests

Run `smoke-tests.md` (seven tests) in a fresh chat before real use. They cover the seven surfaces where a port like this fails *silently* rather than loudly — three of them new in v3: the collapse-block gate, build-time-only, and the self-report that must not read as a clearance.

## What this package is, and is not

**Is:** the Prometheus v3.3 framework carried verbatim — the quantum-semantic operator frame (P1–P11), seven shapes, three modes, the audit checklist with its check labels intact, the self-report rubric, the verifier specifications, the manage-mode package machinery and its four operator prompts.

**Is not:** a filesystem-capable runtime, and not a place where anything runs. Build-time-only is native to v3 and this substrate enforces it. Manage mode ports as documented procedure with an explicit degradation note — the user is the filesystem, and replay verification runs outside. That note is normative, not an apology.

**Fresh context means a new chat.** v3 gates delivery on the static-mode verifier run by an external observer (P8). A later turn of the same conversation is not one. The instructions say so and tell the Gem to label an inline run as self-report rather than clearance; assembling the package does not relieve you of actually opening that second chat.

**No parity claim.** The same prompt on a different substrate is a different measurement. The empirical results the corpus cites were measured on other runtimes; this package does not reproduce them by construction.

## What changed since the v2 package

- **Ten knowledge files, new names, one source file per file where the cap allowed.** The wiring table is now close to 1:1 with the skill's own "Read when…" table. Nothing carries over from the eight old files: delete `quantum-core.txt`, `shapes-and-build.txt`, `refactor-mode.txt`, `manage-core.txt`, `manage-operators.txt`, `manage-agent-design.txt` and `verifier-and-audit.txt` from any Gem you are upgrading. `provenance.txt` keeps its name and is replaced too.
- **The collapse block is a hard gate.** Phase 2 ends with a confirmation turn of its own, and Phase 3 opens only on the user's reply. Earlier packages had a "summary collapse" the model could skip.
- **Build-time only,** with its two declared exceptions.
- **Delivery ships complete installable files,** never a description standing in for the artifact.
- **Principles are cited as (P1)–(P11), never re-explained** in a delivered prompt.
- **The old known-upstream-defect note is gone.** The dangling `manage-verify.py` reference no longer exists in the v3 source; verified absent from this corpus.
