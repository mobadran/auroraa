"use client";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) ensure();
}

export function blip(freq = 880, dur = 0.07, type: OscillatorType = "sine", gain = 1) {
  if (!enabled) return;
  const c = ensure();
  if (!c || !master) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.5 * gain, c.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(master);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

export const sfx = {
  nav: () => blip(720, 0.06, "sine", 0.7),
  open: () => { blip(520, 0.07, "sine", 0.6); setTimeout(() => blip(780, 0.08, "sine", 0.6), 60); },
  close: () => blip(420, 0.07, "sine", 0.5),
  success: () => { blip(660, 0.09, "sine", 0.7); setTimeout(() => blip(990, 0.12, "sine", 0.7), 90); },
  warn: () => { blip(300, 0.12, "triangle", 0.8); setTimeout(() => blip(240, 0.14, "triangle", 0.8), 120); },
  toggle: () => blip(900, 0.05, "square", 0.35),
};