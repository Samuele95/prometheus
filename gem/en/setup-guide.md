# Setup guide — Prometheus (Gem, EN)

Assembling this package in a Gem. Filenames are load-bearing: the instructions'
wiring table names each knowledge file exactly, and selective retrieval means a
renamed file is an unreachable file.

## 1. Create the Gem

Create a new Gem named **Prometheus**.

### A note on naming

The Gem is **Prometheus**. The framework it carries is **prompt-architect v2**,
and the knowledge corpus names it that way throughout — `provenance.txt` even
contains a "How to cite Prompt Architect" section. That is expected, not an
error: those files are carried verbatim from the source, and a port must not
rewrite its source. Read "Prometheus" as the Gem, "Prompt Architect" as the
framework inside it.

## 2. Paste the instructions

Copy the entire contents of `gem-instructions.md` into the Gem's instructions
field. It is 19,249 characters and fits the verified working cap (30,000) with
headroom.

Paste it as-is. The markdown structure is functional, not decorative — the
section ordering is an operator sequence (strongest first), and the wiring table
is what makes the knowledge files reachable at all.

## 3. Upload the eight knowledge files

Upload all eight `.txt` files from `knowledge/`, **without renaming them**:

| File | Bytes |
|---|---|
| `quantum-core.txt` | 61,511 |
| `verifier-and-audit.txt` | 58,520 |
| `shapes-and-build.txt` | 46,646 |
| `manage-core.txt` | 35,165 |
| `provenance.txt` | 32,512 |
| `manage-operators.txt` | 28,122 |
| `manage-agent-design.txt` | 21,349 |
| `refactor-mode.txt` | 15,835 |

Eight files against a ten-file cap leaves two slots free. Every file is far
under the 100 MB per-file limit.

**Why `.txt`.** The Gem knowledge upload accepts DOC, DOCX, PDF, RTF, DOT, DOTX,
HWP, HWPX, TXT, and Google Docs — not `.md` or `.yaml`. The corpus is markdown
and YAML, so it ships as `.txt` with the markdown structure preserved as literal
text. Do not convert to PDF: it would break the byte-level fidelity this package
was verified against.

## 4. Run the smoke tests

Run `smoke-tests.md` (five tests) before real use. They cover the five surfaces
where a port like this fails silently rather than loudly.

## What this package is, and is not

**Is:** the full prompt-architect v2 framework — the quantum-semantic operator
frame, seven shapes, three modes (from-scratch / refactor / manage), the audit
checklist, evaluation rubric, and verifier specifications — carried verbatim.

**Is not:** a filesystem-capable runtime. Manage mode ports as documented
procedure with an explicit degradation note: the user is the filesystem, and
replay verification runs outside. This is stated in the instructions and is
normative, not an apology. See the degradation note before running manage mode.

**No parity claim.** The same prompt on a different substrate is a different
measurement. Empirical results cited in the corpus were measured on other
runtimes; this package does not reproduce them by construction.

## Known upstream defect (carried, not repaired)

`manage-operators.txt` contains a reference to `manage-verify.py`, an artifact
that does not exist in the source corpus (nearest: the replay verifier shipped
in the same file). This is a **pre-existing source defect**, carried verbatim
because a port must not silently repair its source. Fix it upstream in the skill
repo, then re-port.
