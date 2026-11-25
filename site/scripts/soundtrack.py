"""Offline soundtrack for the film video: the same synthesis as src/film/audio.ts, timed to the render's cues.
Usage: python3 scripts/soundtrack.py <cues.json> <out.wav>"""
import json, sys, wave
import numpy as np
from scipy.signal import butter, sosfilt, sosfilt_zi

SR = 48000
cues = json.load(open(sys.argv[1]))
N = int(cues['duration'] * SR) + SR
t = np.arange(N) / SR
rng = np.random.default_rng(7)

def saw(f, phase=0.0): x = (t * f + phase) % 1.0; return 2 * x - 1
def tri(f): return 2 * np.abs(saw(f)) - 1

def timevarying(x, kind, freqs, q_bw=None, block=256):
    """Filter x with a cutoff that changes per block (freqs sampled per sample)."""
    y = np.zeros_like(x); zi = None
    for s in range(0, len(x), block):
        f = float(np.clip(freqs[min(s, len(freqs) - 1)], 30, SR / 2 - 200))
        if kind == 'band':
            lo, hi = max(20, f / q_bw), min(SR / 2 - 100, f * q_bw)
            sos = butter(2, [lo, hi], btype='band', fs=SR, output='sos')
        else:
            sos = butter(2, f, btype='low', fs=SR, output='sos')
        if zi is None or zi.shape != sosfilt_zi(sos).shape: zi = sosfilt_zi(sos) * 0
        y[s:s + block], zi = sosfilt(sos, x[s:s + block], zi=zi)
    return y

enter = next(c['t'] for c in cues['cues'] if c['kind'] == 'enter')
# master: off until the visitor chooses sound, then rises with a 0.6 s time constant, fades out at the end
master = np.where(t < enter, 0.0, 0.8 * (1 - np.exp(-(t - enter) / 0.6)))
fade = np.clip((cues['duration'] - t) / 2.5, 0, 1); master *= fade

# drone: detuned saws, a sub and a triangle through a slowly breathing lowpass (LFO 0.06 Hz, +-150 Hz around 320)
src = saw(55) + saw(55.4, 0.3) + np.sin(2 * np.pi * 27.5 * t) + tri(82.4)
cut = 320 + 150 * np.sin(2 * np.pi * 0.06 * t)
drone = timevarying(src, 'low', cut) * 0.05 * 1.6  # resonance (Q 5) of the live filter approximated by a small gain lift

# air bed: bandpassed noise around 900 Hz
noise = rng.standard_normal(N)
air = sosfilt(butter(1, [600, 1350], btype='band', fs=SR, output='sos'), noise) * 0.008 * 3

def env_swell(t0):
    e = np.zeros(N); i0 = int(t0 * SR); n1, n2 = int(0.35 * SR), int(0.95 * SR)
    seg = np.concatenate([np.linspace(0, 0.11, n1), 0.11 * np.exp(np.log(0.0001 / 0.11) * np.linspace(0, 1, n2))])
    e[i0:i0 + len(seg)] = seg[:max(0, N - i0)]; return e

fx = np.zeros(N)
for c in cues['cues']:
    if c['kind'] == 'cut':
        i0 = int(c['t'] * SR); L = int(1.4 * SR)
        seg_t = np.arange(L) / SR
        sweep = 260 * (2200 / 260) ** np.clip(seg_t / 0.9, 0, 1)
        n = rng.standard_normal(L)
        y = timevarying(n, "band", sweep, q_bw=1.5) * 4.5
        fx[i0:i0 + L] += (y * env_swell(0)[:L])[:max(0, N - i0)]
    if c['kind'] == 'ignite':
        i0 = int(c['t'] * SR); L = int(2.3 * SR); st = np.arange(L) / SR
        f = 96 * (34 / 96) ** np.clip(st / 1.8, 0, 1)
        ph = 2 * np.pi * np.cumsum(f) / SR
        g = np.where(st < 0.05, st / 0.05 * 0.32, 0.32 * np.exp(np.log(0.0001 / 0.32) * np.clip((st - 0.05) / 2.15, 0, 1)))
        boom = np.sin(ph) * g
        n = rng.standard_normal(L)
        lp = timevarying(n, 'low', 3000 * (200 / 3000) ** np.clip(st / 1.2, 0, 1))
        ng = 0.16 * np.exp(np.log(0.0001 / 0.16) * np.clip(st / 1.4, 0, 1))
        seg = boom + lp * ng * 1.5
        fx[i0:i0 + L] += seg[:max(0, N - i0)]

mono = (drone + air + fx) * master
# a little width: the air and swells arrive 11 ms later on the right
d = int(0.011 * SR)
right = mono.copy(); right[d:] = (drone[d:] + air[:-d] + fx[:-d]) * master[d:]
st = np.stack([mono, right], axis=1)
peak = np.max(np.abs(st)); st = st / max(peak, 1e-9) * 0.89
pcm = (st * 32767).astype('<i2')
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f'WROTE: {sys.argv[2]} ({cues["duration"]:.1f} s, peak normalized from {peak:.3f})')
