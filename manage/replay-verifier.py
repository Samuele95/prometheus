#!/usr/bin/env python3
"""Replay verifier — I4c (replay), P5 (rollback-by-snapshot), I4b (anti-oscillation).

Reconstructs prompt/current from history/v001 + the ordered ledger diffs and
byte-compares. `adapt` entries apply their line-delta patch; `rollback` entries
restore the named snapshot (never an inverse diff). Also exposes the
anti-oscillation check the Analyze phase must consult.

Diffs are difflib line-opcode deltas serialized as JSON: equal spans are stored
as index ranges (not content), changed spans store only the new lines — a real
delta, stdlib-only (difflib + json + hashlib), byte-exact on reconstruction.

Usage:
  replay-verifier.py <package-dir>
  replay-verifier.py <package-dir> --anti-osc '<trigger>|<section>|<intent>'
"""
import sys, os, re, json, hashlib, difflib


# ---- canonical line-delta diff format (used by Execute and by replay) ----

def read_lines(path):
    with open(path, encoding="utf-8") as f:
        return f.readlines()

def sha(path):
    return hashlib.sha256(open(path, "rb").read()).hexdigest()

def make_patch(old_lines, new_lines):
    sm = difflib.SequenceMatcher(a=old_lines, b=new_lines, autojunk=False)
    delta = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            delta.append(["equal", i1, i2])
        else:  # replace / insert / delete
            delta.append([tag, i1, i2, new_lines[j1:j2]])
    return delta

def apply_patch(old_lines, delta):
    out = []
    for op in delta:
        if op[0] == "equal":
            out.extend(old_lines[op[1]:op[2]])
        else:
            out.extend(op[3])  # replace/insert content; delete -> [] 
    return out


# ---- ledger parsing ----

def parse_ledger(path):
    entries = []
    cur = None
    for line in read_lines(path):
        if line.startswith("## v"):
            if cur:
                entries.append(cur)
            cur = {"header": line.strip()}
        elif cur is not None:
            m = re.match(r"(Kind|Version|Restore|Trigger|Outcome|Diff):\s*(.*)", line.strip())
            if m:
                cur[m.group(1).lower()] = m.group(2).strip()
    if cur:
        entries.append(cur)
    return [e for e in entries if e.get("kind")]


# ---- replay ----

def replay(pkg):
    hist = os.path.join(pkg, "prompt/history")
    v001 = os.path.join(hist, "v001/prompt.md")
    if not os.path.exists(v001):
        return False, "missing history/v001"
    state = read_lines(v001)
    steps = []
    for e in parse_ledger(os.path.join(pkg, "ledger.md")):
        if e["kind"] == "adapt":
            ver = e["version"]
            patch_path = os.path.join(hist, f"{ver}.patch.json")
            if not os.path.exists(patch_path):
                return False, f"{ver}: missing patch {patch_path}"
            delta = json.load(open(patch_path))
            state = apply_patch(state, delta)
            snap = os.path.join(hist, f"{ver}/prompt.md")
            if os.path.exists(snap) and "".join(state) != "".join(read_lines(snap)):
                return False, f"{ver}: reconstruction != snapshot (integrity)"
            steps.append(f"adapt->{ver}")
        elif e["kind"] == "rollback":
            restore = e["restore"]
            snap = os.path.join(hist, f"{restore}/prompt.md")
            if not os.path.exists(snap):
                return False, f"rollback: missing snapshot {restore}"
            state = read_lines(snap)  # restore, never inverse diff (P5)
            steps.append(f"rollback->{restore}")
    cur = os.path.join(pkg, "prompt/current/prompt.md")
    ok = "".join(state) == "".join(read_lines(cur))
    return ok, (" ".join(steps) + f" | current-sha {sha(cur)[:12]}")


# ---- anti-oscillation (I4b) ----

def anti_oscillation(entries, trigger, section, intent):
    """Mechanical anti-oscillation PRE-FILTER (I4b).

    Full equivalence per D3 is (trigger, section, intent) — but `intent` is a
    judgment call, not mechanically decidable, so this deterministic check is a
    conservative filter on the mechanical part only: it BLOCKs iff a prior adapt
    with a 'regression' outcome shares (trigger, section). The Shape 6 grader
    (manage-mode-verifier.md) makes the final intent call on anything this flags;
    `intent` is accepted here so the caller's tuple is complete and logged, but a
    trigger+section match is sufficient to raise the flag."""
    for e in entries:
        if e.get("kind") != "adapt":
            continue
        if "regression" not in e.get("outcome", "").lower():
            continue
        etrig = e.get("trigger", "")
        if trigger in etrig and section in etrig:
            return "BLOCK", e["version"]
    return "ALLOW", None


def main():
    pkg = sys.argv[1]
    ok, detail = replay(pkg)
    print(f"REPLAY {'PASS' if ok else 'FAIL'}: {detail}")
    result = 0 if ok else 1

    if "--anti-osc" in sys.argv:
        spec = sys.argv[sys.argv.index("--anti-osc") + 1]
        trigger, section, intent = spec.split("|")
        entries = parse_ledger(os.path.join(pkg, "ledger.md"))
        verdict, ver = anti_oscillation(entries, trigger, section, intent)
        tag = f" (matches regressed {ver})" if ver else ""
        print(f"ANTI-OSC {verdict}: proposed [{spec}]{tag}")
    return result


if __name__ == "__main__":
    sys.exit(main())
