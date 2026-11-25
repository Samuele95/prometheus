// film-audio: synthesized, never autoplayed. A drone, a swell on each cut, an ignition on collapse and dive.
const KEY = 'prometheus:sound';

export class FilmAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  enabled = false;

  static preferred(): boolean { try { return localStorage.getItem(KEY) === 'on'; } catch { return false; } }

  /** Must be called from a user gesture. */
  setEnabled(on: boolean): void {
    this.enabled = on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* private mode */ }
    if (on && !this.ctx) this.boot();
    if (!this.ctx || !this.master) return;
    if (on) void this.ctx.resume();
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(on ? 0.8 : 0, t, on ? 0.6 : 0.15);
  }

  private boot(): void {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = (this.ctx = new Ctx());
    this.master = ctx.createGain(); this.master.gain.value = 0; this.master.connect(ctx.destination);
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noise = buf;
    // drone: detuned saws and a sub through a slowly breathing lowpass
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 320; filter.Q.value = 5;
    const lfo = ctx.createOscillator(), lfoGain = ctx.createGain(); lfo.frequency.value = 0.06; lfoGain.gain.value = 150;
    lfo.connect(lfoGain).connect(filter.frequency); lfo.start();
    const drone = ctx.createGain(); drone.gain.value = 0.05;
    for (const [type, f] of [['sawtooth', 55], ['sawtooth', 55.4], ['sine', 27.5], ['triangle', 82.4]] as const) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.connect(filter); o.start();
    }
    filter.connect(drone).connect(this.master);
    const air = ctx.createBufferSource(); air.buffer = buf; air.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.7;
    const airGain = ctx.createGain(); airGain.gain.value = 0.008;
    air.connect(bp).connect(airGain).connect(this.master); air.start();
  }

  swell(): void {
    if (!this.enabled || !this.ctx || !this.master || !this.noise) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(260, t); bp.frequency.exponentialRampToValueAtTime(2200, t + 0.9);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    src.connect(bp).connect(g).connect(this.master); src.start(t); src.stop(t + 1.4);
  }

  ignite(): void {
    if (!this.enabled || !this.ctx || !this.master || !this.noise) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(96, t); o.frequency.exponentialRampToValueAtTime(34, t + 1.8);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 2.3);
    const src = ctx.createBufferSource(); src.buffer = this.noise;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(200, t + 1.2);
    const ng = ctx.createGain(); ng.gain.setValueAtTime(0.16, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    src.connect(lp).connect(ng).connect(this.master); src.start(t); src.stop(t + 1.5);
  }

  dispose(): void { void this.ctx?.close(); this.ctx = null; }
}
