"""Geometry for the Prometheus mark: flame silhouette + collapsing wavefunction line + rings.
All coordinates on a 64-unit grid. Run: python3 site-design/tools/logo_geom.py"""
import math

def f(v): return f"{v:.2f}".rstrip('0').rstrip('.')

def flame_outline(cx, y_base, y_tip, half_w, lean=2.2, n=48):
    """Closed path: rounded base, widest at ~28% height, tapering to a leaning tip."""
    H = y_base - y_tip
    # widest near 24% height, long tapering body, needle tip
    def raw(s): return max(s, 0) ** 0.55 * (1 - s) ** 1.75
    peak = max(raw(i / 400) for i in range(401))
    K = half_w / peak
    def h(s): return K * raw(s)
    def c(s): return cx + lean * (math.sin(math.pi * s * 0.75) * s ** 1.4 - 0.25 * math.sin(2.2 * math.pi * s) * s)
    right, left = [], []
    for i in range(n + 1):
        s = i / n
        y = y_base - s * H
        # slight tongue on the right edge, gives the flame life without breaking the silhouette
        tongue = 1 + 0.16 * math.sin(math.pi * min(1, s * 1.3)) * math.sin(2.6 * math.pi * s + 0.4)
        right.append((c(s) + h(s) * tongue, y))
        left.append((c(s) - h(s) * (2 - tongue) * 0.96, y))
    pts = right + left[::-1][1:]
    # Catmull-Rom to cubic Bezier for a smooth closed path
    d = [f"M{f(pts[0][0])} {f(pts[0][1])}"]
    m = len(pts)
    for i in range(m - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < m else pts[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}")
    d.append("Z")
    return " ".join(d), h, c

def wave_line(cx, y_base, y_tip, h, c, s0=0.05, s1=0.56, n=140, amp=0.74):
    """The collapsing wavefunction: wide oscillation at the base, amplitude -> 0 toward the tip."""
    H = y_base - y_tip
    pts = []
    for i in range(n + 1):
        s = s0 + (s1 - s0) * i / n
        A = h(s) * amp * (1 - (s - s0) / (s1 - s0)) ** 1.25
        phase = 2 * math.pi * (2.0 * s + 4.6 * s * s)
        pts.append((c(s) + A * math.sin(phase), y_base - s * H))
    return "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts)

def collapse_point(y_base, y_tip, c, s=0.69):
    """Where the wavefunction lands: one point, the measured reading, the pupil of the eye."""
    return c(s), y_base - s * (y_base - y_tip)

def ticks(cx, cy, r_out, r_in, count, major_every=0, r_major=None, cls=""):
    out = []
    for k in range(count):
        a = 2 * math.pi * k / count - math.pi / 2
        ri = r_major if (major_every and k % major_every == 0 and r_major) else r_in
        out.append(f"M{f(cx + r_out*math.cos(a))} {f(cy + r_out*math.sin(a))}L{f(cx + ri*math.cos(a))} {f(cy + ri*math.sin(a))}")
    return f'<path class="{cls}" d="{" ".join(out)}"/>'

STYLE = """<style>
  .rg{fill:none;stroke:#c9a35b}
  .tk{fill:none;stroke:#c9a35b;stroke-width:.5}
  .fl{fill:#ff6b1f}
</style>"""

def cut_mask(mid, wave_d, w, dot, r):
    return (f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">'
            f'<rect width="64" height="64" fill="#fff"/>'
            f'<path d="{wave_d}" fill="none" stroke="#000" stroke-width="{w}" stroke-linecap="round"/>'
            f'<circle cx="{f(dot[0])}" cy="{f(dot[1])}" r="{r}" fill="#000"/></mask>')

def candidate_a():
    """Eye-forward: vesica eyelids, iris rings, flame as pupil."""
    d, h, c = flame_outline(32, 44, 16, 6.6, lean=1.4)
    w = wave_line(32, 44, 16, h, c); dot = collapse_point(44, 16, c)
    lids = "M3 32 Q32 6 61 32 Q32 58 3 32 Z"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{STYLE}
<defs>{cut_mask("cutA", w, 1.1, dot, 1.25)}</defs>
<path class="rg" stroke-width="1.4" d="{lids}"/>
<g id="rings">
  <circle class="rg" cx="32" cy="32" r="15" stroke-width="1.1"/>
  <circle class="rg" cx="32" cy="32" r="11.5" stroke-width=".5"/>
</g>
{ticks(32,32,15,13.6,48,cls="tk")}
<path id="flame" class="fl" mask="url(#cutA)" d="{d}"/>
</svg>'''

def candidate_b():
    """Flame-forward: a large flame breaking out of two rings, the wavefunction carved through it."""
    d, h, c = flame_outline(32, 57, 3, 13, lean=3.2)
    w = wave_line(32, 57, 3, h, c); dot = collapse_point(57, 3, c)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{STYLE}
<defs>{cut_mask("cutB", w, 1.6, dot, 2.1)}</defs>
<g id="rings">
  <circle class="rg" cx="32" cy="36" r="24" stroke-width="1.4"/>
  <circle class="rg" cx="32" cy="36" r="19.5" stroke-width=".55"/>
</g>
{ticks(32,36,24,22.4,60,5,21.4,cls="tk")}
<path id="flame" class="fl" mask="url(#cutB)" d="{d}"/>
</svg>'''

def candidate_c():
    """Rings-forward: an astrolabe with an offset ecliptic ring; the flame is the rete's pointer."""
    d, h, c = flame_outline(32, 45, 13, 7.4, lean=1.8)
    w = wave_line(32, 45, 13, h, c); dot = collapse_point(45, 13, c)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{STYLE}
<defs>{cut_mask("cutC", w, 1.15, dot, 1.35)}</defs>
<g id="rings">
  <circle class="rg" cx="32" cy="32" r="29.5" stroke-width="1.3"/>
  <circle class="rg" cx="32" cy="32" r="25" stroke-width=".55"/>
  <circle class="rg" cx="32" cy="28.5" r="16.5" stroke-width=".8"/>
  <circle class="rg" cx="32" cy="32" r="3.2" stroke-width=".55"/>
</g>
{ticks(32,32,29.5,27.6,72,6,26.4,cls="tk")}
<path class="tk" d="M32 2.5V7.5M32 56.5V61.5M2.5 32H7.5M56.5 32H61.5"/>
<path id="flame" class="fl" mask="url(#cutC)" d="{d}"/>
</svg>'''

if __name__ == "__main__":
    import pathlib
    out = pathlib.Path(__file__).resolve().parent.parent / "logo" / "candidates"
    for name, fn in (("a", candidate_a), ("b", candidate_b), ("c", candidate_c)):
        (out / f"{name}.svg").write_text(fn())
    print("candidates written")
