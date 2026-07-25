# constraints.md — Stage 2 constraint verification

Retrieval date: **2026-07-10**. Each limit verified against current sources
(I6 — priors are inputs, not facts). Priors from the workflow parameter block
are restated, then confirmed / corrected.

| Limit | Prior | Verified value (2026-07-10) | Status | Source |
|---|---|---|---|---|
| `max_knowledge_files` | 10 | **10 per Gem** | CONFIRMED | GEO Toolbox (2026, "per Google's documentation"); Fone.tips (2026-05); TechWiser (Google rollout) |
| `per_file_size` | ~100 MB | **100 MB per file** | CONFIRMED | same sources; non-binding at this 316 KB corpus |
| `accepted_formats` (knowledge upload) | GDocs/TXT/DOC(X)/PDF/RTF/DOT(X)/HWP(X) | **DOC, DOCX, PDF, RTF, DOT, DOTX, HWP, HWPX, TXT, Google Docs** | CONFIRMED | datastudios.org (Gemini app upload formats). **`.md` and `.yaml` are NOT knowledge-upload types** → ship `.txt` |
| `retrieval_mode` | RAG/selective | **RAG / selective** (knowledge files chunked → embedded → vector-searched per query; instructions load into context directly) | CONFIRMED | concret.io (2026-03, specifically on Gems) |
| `instructions_char_cap` | unknown (~30k community) | **No official figure for the Gem instructions field.** ~30k is the *chat-message* surface limit, community-reported, region/account-variable | UNKNOWN — official max still undocumented | Google AI dev forum; text-splitter.com (2026-01) |

## Notes bearing on later stages

- **Formats — two different surfaces, do not conflate.** Google's April-2026
  file-*generation* feature added Markdown (.md) as an **output/export** format,
  and the Gemini *API* File Search accepts `.md`/`.json`/`.py`. Neither is the
  consumer **Gem knowledge-upload** surface, whose accepted list has no
  `.md`/`.yaml`. Conservative call stands: deliver knowledge files as **`.txt`**;
  markdown structure survives as literal text (workflow Stage 5).

- **Retrieval mode makes the Stage 4 wiring table load-bearing (as workflow
  states).** Instructions are always in context; knowledge files surface only on
  a good query match. Practitioner-reported reinforcement (concret.io): line 1 of
  the instructions should force knowledge-file consultation. Carry into Stage 4
  as a synthesis input; do not act on it here.

- **`instructions_char_cap` → `working_cap` required (workflow Stage 2).** No
  official figure returned, so a later-stage dependency (Stage 4 gate) rests on
  an undocumented limit. The workflow mandates an explicit empirical
  `working_cap` **with operator sign-off**; exceeding it at synthesis is a
  boundary, not a silent compression license. Proposal + evidence below —
  **SIGNED OFF 2026-07-10 (working_cap=30000); Stage 2 gate CLOSED.**

## Proposed `working_cap` (needs operator sign-off)

```yaml
working_cap: 30000        # chars, empirical — NOT an official Google figure
  basis:
    - only grounded number available is the ~30k chat-message surface limit;
      used as a conservative proxy / lower bound for the instructions field
    - v1 datapoint: instructions field = 10,509 chars for TWO modes
    - v2 estimate: three modes + B3 degradation note at honest fidelity lands
      ~16,000–20,000 chars → comfortably under 30k with headroom
  re_trigger:
    - if Stage 4 synthesis exceeds working_cap, that is a boundary (compress
      mode 3 to a pointer + degradation note, or invoke B3's declined
      alternative) — never thin modes 1–2 silently
```

Resolved parameter block (priors updated by Stage 2):

```yaml
max_knowledge_files: 10                # CONFIRMED 2026-07-10
per_file_size:       100 MB            # CONFIRMED 2026-07-10 (non-binding here)
accepted_formats:    DOC/DOCX/PDF/RTF/DOT/DOTX/HWP/HWPX/TXT/GDocs  # .md/.yaml excluded → .txt
retrieval_mode:      RAG/selective     # CONFIRMED 2026-07-10 → wiring table load-bearing
instructions_char_cap: working_cap=30000  # SIGNED OFF 2026-07-10 (operator: Delta) — Stage 2 gate CLOSED
```
