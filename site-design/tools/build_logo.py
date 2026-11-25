"""Build the Prometheus logo system from the approved mark (candidate B).
Run from the repo root: python3 site-design/tools/build_logo.py"""
import math, random, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from logo_geom import flame_outline, wave_line, collapse_point, ticks, f
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "site-design" / "logo"
FONTS = ROOT / "site" / "public" / "fonts"
VOID, BONE, BRASS, EMBER = "#05040b", "#ece5d8", "#c9a35b", "#ff6b1f"
HOLO = ("#7af0ff", "#b99bff", "#ffcf7a")

# ---- mark geometry (candidate B, approved) ----
FL = dict(cx=32, y_base=57, y_tip=3, half_w=13, lean=3.2)
FLAME_D, H, C = flame_outline(FL["cx"], FL["y_base"], FL["y_tip"], FL["half_w"], lean=FL["lean"])
WAVE_D = wave_line(FL["cx"], FL["y_base"], FL["y_tip"], H, C)
DOT = collapse_point(FL["y_base"], FL["y_tip"], C)
RING_C = (32, 36)

def flame_polygon(n=200):
    pts_r, pts_l = [], []
    for i in range(n + 1):
        s = i / n; y = FL["y_base"] - s * (FL["y_base"] - FL["y_tip"])
        tongue = 1 + 0.16 * math.sin(math.pi * min(1, s * 1.3)) * math.sin(2.6 * math.pi * s + 0.4)
        pts_r.append((C(s) + H(s) * tongue, y)); pts_l.append((C(s) - H(s) * (2 - tongue) * 0.96, y))
    return pts_r + pts_l[::-1]

def inside(poly, x, y):
    c = False; j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]; xj, yj = poly[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi: c = not c
        j = i
    return c

def mask(mid, wave_w=1.6, dot_r=2.1, x=0, y=0, w=64, h=64):
    return (f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="{x}" y="{y}" width="{w}" height="{h}">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#fff"/>'
            f'<path d="{WAVE_D}" fill="none" stroke="#000" stroke-width="{wave_w}" stroke-linecap="round"/>'
            f'<circle cx="{f(DOT[0])}" cy="{f(DOT[1])}" r="{dot_r}" fill="#000"/></mask>')

def rings_group(stroke, tick_stroke=None):
    ts = tick_stroke or stroke
    return (f'<g id="rings" fill="none" stroke="{stroke}">'
            f'<circle cx="32" cy="36" r="24" stroke-width="1.4"/>'
            f'<circle cx="32" cy="36" r="19.5" stroke-width=".55"/></g>'
            + ticks(32, 36, 24, 22.4, 60, 5, 21.4, cls="tk").replace('class="tk"', f'fill="none" stroke="{ts}" stroke-width=".5"'))

def mark_body(mid, ring=BRASS, flame=EMBER):
    return (f'<defs>{mask(mid)}</defs>{rings_group(ring)}'
            f'<path id="flame" d="{FLAME_D}" fill="{flame}" mask="url(#{mid})"/>')

def svg(vb, body, w=None, h=None, title="Prometheus"):
    size = f' width="{w}" height="{h}"' if w else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size} role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')

# ---- wordmark: outlined Bodoni Moda caps ----
def outline_text(text, path, wght, opsz, size, tracking_em):
    font = TTFont(path)
    inst = instantiateVariableFont(font, {"wght": wght, "opsz": opsz}, inplace=False)
    gs, cmap = inst.getGlyphSet(), inst.getBestCmap()
    upm = inst["head"].unitsPerEm; scale = size / upm
    hmtx = inst["hmtx"]; x = 0; parts = []
    for ch in text:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
        parts.append(pen.getCommands())
        x += hmtx[g][0] * scale + tracking_em * size
    width = x - tracking_em * size
    cap = inst["OS/2"].sCapHeight * scale
    return " ".join(parts), width, cap

BODONI = FONTS / "bodoni-moda-latin-opsz-normal.woff2"
WM_D, WM_W, WM_CAP = outline_text("PROMETHEUS", BODONI, 620, 24, 40, 0.2)  # lower opsz keeps the H crossbar visible

def wordmark_at(x, baseline, fill):
    return f'<path transform="translate({f(x)} {f(baseline)})" fill="{fill}" d="{WM_D}"/>'

def write(name, content):
    (OUT / name).write_text(content); print("WROTE:", f"site-design/logo/{name}")

def main():
    # marks
    write("mark.svg", svg("0 0 64 64", mark_body("m")))
    write("mark-mono.svg", svg("0 0 64 64",
        f'<defs>{mask("mm")}</defs><g color="currentColor">{rings_group("currentColor")}'
        f'<path id="flame" d="{FLAME_D}" fill="currentColor" mask="url(#mm)"/></g>'))
    grad = (f'<linearGradient id="holo" x1="0" y1="1" x2="1" y2="0">'
            f'<stop offset="0" stop-color="{HOLO[0]}"/><stop offset=".5" stop-color="{HOLO[1]}"/>'
            f'<stop offset="1" stop-color="{HOLO[2]}"/></linearGradient>')
    write("mark-holo.svg", svg("0 0 64 64",
        f'<defs>{grad}{mask("mh")}</defs>{rings_group(BRASS)}'
        f'<path id="flame" d="{FLAME_D}" fill="url(#holo)" mask="url(#mh)"/>'))
    # small: one heavy ring, solid flame, no wave, no ticks: detail dropped, not shrunk
    small = (f'<circle cx="32" cy="36" r="23" fill="none" stroke="{BRASS}" stroke-width="4.5"/>'
             f'<path id="flame" d="{FLAME_D}" fill="{EMBER}" stroke="{VOID}" stroke-width="2.5" paint-order="stroke"/>')
    write("mark-small.svg", svg("0 0 64 64", small))
    write("favicon.svg", svg("0 0 64 64", small))

    # wordmark
    pad = 2
    write("wordmark.svg", svg(f"0 {f(-WM_CAP - pad)} {f(WM_W)} {f(WM_CAP + 2*pad)}",
                              wordmark_at(0, 0, BONE), title="PROMETHEUS"))
    # horizontal lockup: mark 64 tall, wordmark cap height centred on the ring centre
    gap = 18; wm_x = 64 + gap; base = 36 + WM_CAP / 2
    write("lockup-horizontal.svg", svg(f"0 0 {f(wm_x + WM_W)} 64",
        mark_body("lh") + wordmark_at(wm_x, base, BONE)))
    # stacked lockup
    MS = 2.6; mh = 64 * MS
    sw = max(WM_W, mh); mx = (sw - mh) / 2; wm_base = mh + 26 + WM_CAP; sh = wm_base + 4
    stacked_body = (f'<g transform="translate({f(mx)} 0) scale({MS})">{mark_body("ls")}</g>'
                    + wordmark_at((sw - WM_W) / 2, wm_base, BONE))
    write("lockup-stacked.svg", svg(f"0 0 {f(sw)} {f(sh)}", stacked_body))

    # social image 1200x630
    _, w46, _ = outline_text("A prompt is an operator, not a key.", ROOT / "site/public/fonts/bodoni-moda-latin-opsz-italic.woff2", 400, 36, 46, 0)
    tag_size = 46 * 560 / w46
    tag_d, tag_w, tag_cap = outline_text("A prompt is an operator, not a key.", ROOT / "site/public/fonts/bodoni-moda-latin-opsz-italic.woff2", 400, 36, tag_size, 0)
    wm_scale = 560 / WM_W
    big_rings = "".join(f'<circle cx="300" cy="330" r="{r}" fill="none" stroke="{BRASS}" stroke-opacity="{o}" stroke-width="1"/>'
                        for r, o in ((250, .35), (330, .22), (420, .14), (520, .08)))
    og = (f'<rect width="1200" height="630" fill="{VOID}"/>{big_rings}'
          f'<g transform="translate(150 105) scale(5.6)">{mark_body("og")}</g>'
          f'<g transform="translate(570 300) scale({f(wm_scale)})">{wordmark_at(0, 0, BONE)}</g>'
          f'<path transform="translate(570 372)" fill="{BRASS}" d="{tag_d}"/>'
          f'<rect x="570" y="410" width="64" height="2" fill="{EMBER}"/>')
    write("og.svg", svg("0 0 1200 630", og, 1200, 630, title="Prometheus — a prompt is an operator, not a key"))

    # animated intro, ends exactly in the stacked lockup's final state
    random.seed(7)
    poly = flame_polygon()
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    targets = []
    while len(targets) < 90:
        x = random.uniform(min(xs), max(xs)); y = random.uniform(min(ys), max(ys))
        if inside(poly, x, y): targets.append((x, y))
    dots = []
    for i, (x, y) in enumerate(targets):
        a = random.uniform(0, 2 * math.pi); r = random.uniform(26, 60)
        dx, dy = r * math.cos(a), r * math.sin(a)
        dots.append(f'<circle class="pt" cx="{f(x)}" cy="{f(y)}" r=".55" style="--dx:{f(dx)}px;--dy:{f(dy)}px;animation-delay:{f(0.35 + random.uniform(0, .35))}s"/>')
    ring_len = [2 * math.pi * 24, 2 * math.pi * 19.5]
    css = f"""<style>
.r1{{stroke-dasharray:{f(ring_len[0])};stroke-dashoffset:{f(ring_len[0])};animation:draw .9s cubic-bezier(.16,1,.3,1) .05s forwards}}
.r2{{stroke-dasharray:{f(ring_len[1])};stroke-dashoffset:{f(ring_len[1])};animation:draw .9s cubic-bezier(.16,1,.3,1) .2s forwards}}
.tks{{opacity:0;animation:fade .5s ease-out .7s forwards}}
.pt{{fill:{EMBER};opacity:0;transform:translate(var(--dx),var(--dy));animation:converge 1s cubic-bezier(.83,0,.17,1) forwards}}
.fl{{opacity:0;animation:fade .45s ease-out 1.3s forwards}}
.pts{{animation:fadeout .4s ease-in 1.55s forwards}}
.wm{{opacity:0;transform:translateY(6px);animation:rise .7s cubic-bezier(.16,1,.3,1) 1.6s forwards}}
@keyframes draw{{to{{stroke-dashoffset:0}}}}
@keyframes fade{{to{{opacity:1}}}}
@keyframes fadeout{{to{{opacity:0}}}}
@keyframes converge{{0%{{opacity:0}}20%{{opacity:1}}100%{{opacity:1;transform:translate(0,0)}}}}
@keyframes rise{{to{{opacity:1;transform:none}}}}
@media (prefers-reduced-motion:reduce){{.r1,.r2,.tks,.fl,.wm{{animation:none;opacity:1;stroke-dashoffset:0;transform:none}}.pts{{display:none}}}}
</style>"""
    tk = ticks(32, 36, 24, 22.4, 60, 5, 21.4, cls="tk").replace('class="tk"', f'class="tks" fill="none" stroke="{BRASS}" stroke-width=".5"')
    intro_mark = (f'<defs>{mask("in")}</defs>'
                  f'<g id="rings" fill="none" stroke="{BRASS}"><circle class="r1" cx="32" cy="36" r="24" stroke-width="1.4" transform="rotate(-90 32 36)"/>'
                  f'<circle class="r2" cx="32" cy="36" r="19.5" stroke-width=".55" transform="rotate(-90 32 36)"/></g>{tk}'
                  f'<g class="pts">{"".join(dots)}</g>'
                  f'<path id="flame" class="fl" d="{FLAME_D}" fill="{EMBER}" mask="url(#in)"/>')
    intro = (css + f'<g transform="translate({f(mx)} 0) scale({MS})">{intro_mark}</g>'
             + f'<g class="wm">{wordmark_at((sw - WM_W) / 2, wm_base, BONE)}</g>')
    write("intro.svg", svg(f"0 0 {f(sw)} {f(sh)}", intro))

    # flame target points for the hero, in mark units (x, y), y down
    import json
    random.seed(11); pts = []
    while len(pts) < 4000:
        x = random.uniform(min(xs), max(xs)); y = random.uniform(min(ys), max(ys))
        if inside(poly, x, y) and math.hypot(x - DOT[0], y - DOT[1]) > 2.1: pts.append([round(x, 3), round(y, 3)])
    (ROOT / "site" / "src").mkdir(parents=True, exist_ok=True)
    (ROOT / "site" / "src" / "flame-geometry.json").write_text(json.dumps({
        "viewBox": [0, 0, 64, 64], "flame": FLAME_D, "wave": WAVE_D, "dot": [round(DOT[0], 3), round(DOT[1], 3)],
        "ringCenter": RING_C, "rings": [24, 19.5], "samples": pts}))
    print("WROTE: site/src/flame-geometry.json (4000 samples)")

if __name__ == "__main__":
    main()
