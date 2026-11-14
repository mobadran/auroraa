"use client";

import { useEffect, useRef, useState } from "react";
import { blip, sfx } from "@/lib/sound";
import {
  IconArrowR, IconChat, IconCheck, IconLock, IconPause, IconPlay, IconSend, IconWind, IconX,
} from "./icons";

/* ================= Neural silhouette ================= */

const NODES: [number, number][] = [
  [178, 92], [214, 76], [246, 100], [196, 122], [232, 138], [162, 132], [206, 162], [244, 172],
];
const EDGES: [number, number, string][] = [
  [5, 0, "#2ef2ae"], [0, 1, "#2ef2ae"], [1, 2, "#b6a4f7"],
  [5, 3, "#4cc3ff"], [3, 4, "#2ef2ae"], [4, 7, "#b6a4f7"],
  [0, 3, "#b6a4f7"], [1, 4, "#4cc3ff"], [3, 6, "#2ef2ae"], [6, 7, "#4cc3ff"],
];

function edgePath(a: [number, number], b: [number, number]) {
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18;
  const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18;
  return `M${a[0]},${a[1]} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0]},${b[1]}`;
}

export function NeuralSilhouette({ offline }: { offline: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (offline) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [offline]);

  return (
    <div className={`mh-sil ${offline ? "frozen" : ""}`}>
      <div className="mh-sil-glow" aria-hidden="true" />
      <svg ref={ref} viewBox="0 0 400 340" role="img" aria-label="Cognitive harmony silhouette with live neural coherence pathways">
        <defs>
          <radialGradient id="mhHeadFill" cx="52%" cy="42%" r="65%">
            <stop offset="0%" stopColor="rgba(46,242,174,0.10)" />
            <stop offset="55%" stopColor="rgba(76,195,255,0.05)" />
            <stop offset="100%" stopColor="rgba(76,195,255,0)" />
          </radialGradient>
        </defs>
        <g className="mh-rings" aria-hidden="true">
          <circle cx="200" cy="162" r="132" fill="none" stroke="rgba(148,163,187,0.12)" strokeWidth="1" strokeDasharray="3 9" />
          <circle cx="200" cy="162" r="158" fill="none" stroke="rgba(148,163,187,0.07)" strokeWidth="1" strokeDasharray="2 12" />
        </g>
        <path
          className="mh-head"
          d="M205 318 C202 292 200 272 196 254 C178 246 160 238 150 224 C142 214 140 206 142 198 C136 194 132 190 134 184 C130 180 130 176 134 172 C128 166 124 160 126 152 C118 144 112 134 116 124 C120 114 128 108 132 100 C136 84 142 70 156 60 C176 44 206 40 230 50 C258 62 276 88 280 120 C284 152 280 184 268 210 C258 232 252 252 254 276 C255 292 256 306 258 318"
          fill="url(#mhHeadFill)" stroke="rgba(148,163,187,0.35)" strokeWidth="1.4" strokeLinecap="round"
        />
        <g aria-hidden="true">
          {EDGES.map(([a, b, c], i) => (
            <path key={`e${i}`} d={edgePath(NODES[a], NODES[b])} fill="none" stroke={c} strokeWidth="1.1" opacity="0.4" />
          ))}
          {EDGES.slice(0, 6).map(([a, b, c], i) => (
            <circle key={`s${i}`} r="2.4" fill={c} opacity="0.95">
              <animateMotion dur={`${3 + i * 0.7}s`} repeatCount="indefinite" path={edgePath(NODES[a], NODES[b])} />
            </circle>
          ))}
          {NODES.map(([x, y], i) => (
            <g key={`n${i}`}>
              <circle className="mh-node-halo" cx={x} cy={y} r="7" fill={i % 3 === 0 ? "#2ef2ae" : i % 3 === 1 ? "#b6a4f7" : "#4cc3ff"} style={{ animationDelay: `${i * 0.45}s` }} />
              <circle cx={x} cy={y} r="3.1" fill={i % 3 === 0 ? "#2ef2ae" : i % 3 === 1 ? "#b6a4f7" : "#4cc3ff"} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ================= Trajectory chart ================= */

const DAYS = [121, 122, 123, 124, 125, 126, 127];
const DAY_TAGS = ["CHECK-IN", "CHECK-IN", "EVA SORTIE", "CHECK-IN", "CHECK-IN", "CHECK-IN", "TODAY"];
const SERIES = [
  { id: "mood", label: "Mood", color: "#4cc3ff", data: [4, 4, 4, 4, 4, 4, 4] },
  { id: "stress", label: "Stress", color: "#b6a4f7", data: [2, 2, 2, 2, 2, 2, 2] },
  { id: "energy", label: "Energy", color: "#2ef2ae", data: [4, 4, 4, 3, 3, 3, 3] },
  { id: "social", label: "Social Connection", color: "#7dd8ff", data: [4, 4, 3, 3, 3, 3, 3] },
  { id: "focus", label: "Focus", color: "#35e0c8", data: [4, 4, 4, 4, 4, 4, 4] },
];
const PASSIVE = [4.2, 4.0, 3.7, 3.4, 3.1, 2.9, 2.8];

const CW = 1000, CH = 300, PL = 34, PR = 34, PT = 26, PB = 34;
const cx = (i: number) => PL + (i / 6) * (CW - PL - PR);
const cy = (v: number) => PT + ((5 - v) / 4) * (CH - PT - PB);

function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function TrajectoryChart() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = (id: string) => {
    sfx.toggle();
    setHidden((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const onMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width) * CW;
    const idx = Math.round((x - PL) / ((CW - PL - PR) / 6));
    setHover(Math.min(6, Math.max(0, idx)));
  };

  const visible = SERIES.filter((s) => !hidden.has(s.id));

  return (
    <div className="mh-chart">
      <div className="mh-legend" role="group" aria-label="Toggle chart series">
        {SERIES.map((s) => (
          <button
            key={s.id}
            className={`mh-leg ${hidden.has(s.id) ? "off" : ""}`}
            onClick={() => toggle(s.id)}
            aria-pressed={!hidden.has(s.id)}
            title={`${hidden.has(s.id) ? "Show" : "Hide"} ${s.label}`}
          >
            <i style={{ background: s.color, boxShadow: `0 0 7px ${s.color}` }} />
            {s.label}
          </button>
        ))}
      </div>

      <div
        className="mh-plot"
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" aria-label="Seven-day wellbeing trajectory chart">
          {[1, 2, 3, 4, 5].map((v) => (
            <line key={v} x1={PL} x2={CW - PR} y1={cy(v)} y2={cy(v)} stroke="rgba(148,163,187,0.08)" strokeWidth="1" />
          ))}
          {hover !== null && (
            <line x1={cx(hover)} x2={cx(hover)} y1={PT - 8} y2={CH - PB + 8} stroke="rgba(238,244,255,0.25)" strokeWidth="1" strokeDasharray="3 4" />
          )}
          <path
            d={smooth(PASSIVE.map((v, i) => [cx(i), cy(v)]))}
            fill="none" stroke="#c7d5ee" strokeWidth="1.6" strokeDasharray="7 6" opacity={drawn ? 0.75 : 0}
            style={{ transition: "opacity 1s ease 0.5s" }}
          />
          {visible.map((s) => (
            <g key={s.id}>
              <path
                key="line"
                d={smooth(s.data.map((v, i) => [cx(i), cy(v)]))}
                fill="none" stroke={s.color} strokeWidth={s.id === "focus" ? 4.5 : 2.2}
                strokeLinecap="round" opacity={s.id === "focus" ? 0.4 : 0.95}
                pathLength={1} strokeDasharray={1} strokeDashoffset={drawn ? 0 : 1}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 5px ${s.color}55)` }}
              />
              {s.data.map((v, i) => (
                <circle
                  key={`pt-${i}`} cx={cx(i)} cy={cy(v)} r={hover === i ? 5 : s.id === "focus" ? 4.2 : 3.2}
                  fill="#0a1220" stroke={s.color} strokeWidth="2" opacity={s.id === "focus" ? 0.55 : 1}
                  style={{ transition: "r 0.15s" }}
                />
              ))}
            </g>
          ))}
        </svg>
        {hover !== null && (
          <div className="mh-tip" style={{ left: `clamp(120px, ${(cx(hover) / CW) * 100}%, calc(100% - 120px))` }}>
            <b>Mission day {DAYS[hover]} · {DAY_TAGS[hover]}</b>
            {visible.map((s) => (
              <span key={s.id}><i style={{ background: s.color }} />{s.label}<em>{s.data[hover]}/5</em></span>
            ))}
            <span className="passive"><i />Biometric correlate<em>{PASSIVE[hover].toFixed(1)}</em></span>
          </div>
        )}
      </div>

      <div className="mh-x">
        {DAYS.map((d, i) => (
          <button key={d} className={`mh-xd ${i === 6 ? "today" : ""} ${hover === i ? "hot" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <b>mission day {d}</b>
            <span>{DAY_TAGS[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= Breathing protocol ================= */

const IN = 4, HOLD = 7, OUT = 8, CYCLE = IN + HOLD + OUT, CYCLES = 15, TOTAL = CYCLE * CYCLES;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function BreathingModal({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const phaseRef = useRef("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => {
      setElapsed((e) => {
        const n = Math.min(TOTAL, e + 0.1);
        if (n >= TOTAL) { setRunning(false); setDone(true); sfx.success(); }
        return n;
      });
    }, 100);
    return () => clearInterval(id);
  }, [running, done]);

  const t = elapsed % CYCLE;
  const phase = t < IN ? "inhale" : t < IN + HOLD ? "hold" : "exhale";
  const phaseT = phase === "inhale" ? t : phase === "hold" ? t - IN : t - IN - HOLD;
  const phaseDur = phase === "inhale" ? IN : phase === "hold" ? HOLD : OUT;
  const remain = Math.max(1, Math.ceil(phaseDur - phaseT));
  const scale = phase === "inhale" ? 0.62 + 0.38 * (t / IN) : phase === "hold" ? 1 : 1 - 0.38 * ((t - IN - HOLD) / OUT);
  const cycle = Math.min(CYCLES, Math.floor(elapsed / CYCLE) + 1);
  const ringR = 118, ringC = 2 * Math.PI * ringR;

  useEffect(() => {
    if (!running || done || phaseRef.current === phase) return;
    phaseRef.current = phase;
    blip(phase === "inhale" ? 440 : phase === "hold" ? 520 : 330, 0.18, "sine", 0.5);
    try { navigator.vibrate?.(25); } catch {}
  }, [phase, running, done]);

  const reset = () => { setRunning(false); setElapsed(0); setDone(false); phaseRef.current = ""; sfx.close(); };

  return (
    <>
      <div className="scrim mh-scrim" onClick={onClose} />
      <div className="mh-modal breathe" role="dialog" aria-label="4-7-8 breathing protocol">
        <div className="mh-mhead">
          <div>
            <span className="mh-k">Parasympathetic resonance</span>
            <h3>4-7-8 Breathing Protocol</h3>
          </div>
          <button className="icon-btn x" onClick={onClose} aria-label="Close breathing exercise"><IconX size={18} /></button>
        </div>

        {done ? (
          <div className="mh-bdone">
            <span className="mh-bdone-ring"><IconCheck size={34} /></span>
            <h4>Protocol complete</h4>
            <p>15 resonance cycles logged. Heart-rate variance drift is trending back toward your baseline — nice work, Commander.</p>
            <button className="btn primary" onClick={onClose}>Return to synthesis</button>
          </div>
        ) : (
          <>
            <div className={`mh-orb-zone ${phase} ${running ? "live" : ""}`}>
              <svg className="mh-bring" viewBox="0 0 250 250" aria-hidden="true">
                <circle cx="125" cy="125" r={ringR} fill="none" stroke="#152238" strokeWidth="4" />
                <circle
                  cx="125" cy="125" r={ringR} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={ringC} strokeDashoffset={ringC * (1 - phaseT / phaseDur)}
                  transform="rotate(-90 125 125)"
                />
              </svg>
              <div className="mh-orb" style={{ transform: `scale(${scale.toFixed(3)})` }} aria-hidden="true" />
              <div className="mh-orb-c">
                <b>{running ? phase.toUpperCase() : elapsed > 0 ? "PAUSED" : "READY"}</b>
                <span>{running ? `${remain}s` : "4 · 7 · 8"}</span>
              </div>
            </div>
            <div className="mh-bmeta">
              <span>Cycle <b>{cycle} / {CYCLES}</b></span>
              <span className="mh-bdots" aria-hidden="true">
                {Array.from({ length: CYCLES }, (_, i) => <i key={i} className={i < cycle - 1 || done ? "fill" : i === cycle - 1 && running ? "now" : ""} />)}
              </span>
              <span><b>{fmt(Math.max(0, TOTAL - elapsed))}</b> remaining</span>
            </div>
            <div className="mh-bctl">
              <button className="btn primary" onClick={() => { setRunning((r) => !r); sfx.toggle(); }}>
                {running ? <><IconPause size={14} /> Pause</> : elapsed > 0 ? <><IconPlay size={14} /> Resume</> : <><IconWind size={15} /> Begin protocol</>}
              </button>
              <button className="btn" onClick={reset} disabled={elapsed === 0 && !running}>Reset</button>
            </div>
            <p className="mh-bnote">Inhale 4s · hold 7s · exhale 8s. Audio tones and haptic pacing mark each phase — follow the orb.</p>
          </>
        )}
      </div>
    </>
  );
}

/* ================= Ground sync message ================= */

const DUR = 45;
const CAPTIONS = [
  { at: 0, who: "Elena", text: "Hey you — the kitchen window is full of green again." },
  { at: 7, who: "Leo", text: "Dad! The tomato seedlings grew TWO new leaves!" },
  { at: 14, who: "Leo", text: "I measured them — 4.2 centimeters. Taller than my thumb!" },
  { at: 22, who: "Elena", text: "He waters them every morning before school. Your little greenhouse lives on." },
  { at: 31, who: "Leo", text: "We're saving the first tomato for when you come home. Promise?" },
  { at: 39, who: "Elena", text: "We miss you. The stars look the same from here. Come back safe." },
];
const tfmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;

export function MessageModal({ onClose, offline, kicker, title, sub }: {
  onClose: () => void; offline: boolean; kicker?: string; title?: string; sub?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [session, setSession] = useState(0);
  const ended = t >= DUR;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setT((p) => {
        const n = Math.min(DUR, p + 0.25);
        if (n >= DUR) { setPlaying(false); blip(660, 0.15, "sine", 0.5); }
        return n;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing]);

  const cap = [...CAPTIONS].reverse().find((c) => t >= c.at) ?? CAPTIONS[0];
  const togglePlay = () => {
    if (ended) { setT(0); setSession((s) => s + 1); setPlaying(true); sfx.open(); return; }
    setPlaying((p) => !p);
    if (!playing) sfx.open(); else sfx.close();
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(Math.min(DUR, Math.max(0, ((e.clientX - r.left) / r.width) * DUR)));
  };

  return (
    <>
      <div className="scrim mh-scrim" onClick={onClose} />
      <div className="mh-modal message" role="dialog" aria-label="Houston ground sync message player">
        <div className="mh-mhead">
          <div>
            <span className="mh-k">{kicker ?? (offline ? "Local cached copy · Sol 127" : "Houston ground sync · arrived Sol 127")}</span>
            <h3>{title ?? "Elena & Leo — Greenhouse Update"}</h3>
            {sub && <p className="mh-msub">{sub}</p>}
          </div>
          <button className="icon-btn x" onClick={onClose} aria-label="Close message"><IconX size={18} /></button>
        </div>

        <div className={`mh-stage ${playing ? "playing" : ""}`}>
          <img key={session} src="/houston-message.jpg" alt="Elena and Leo holding a pot of tomato seedlings in their sunlit kitchen" />
          <div className="mh-stage-shade" aria-hidden="true" />
          <button className="mh-bigplay" onClick={togglePlay} aria-label={playing ? "Pause message" : ended ? "Replay message" : "Play message"}>
            {playing ? <IconPause size={26} /> : <IconPlay size={26} />}
          </button>
          <div className="mh-cap" key={cap.at}>
            <b>{cap.who}:</b> {cap.text}
          </div>
          {ended && <span className="mh-ended">Message complete · replay anytime</span>}
        </div>

        <div className="mh-wave" aria-hidden="true">
          {Array.from({ length: 32 }, (_, i) => (
            <i key={i} className={playing ? "on" : ""} style={{ animationDelay: `${(i % 9) * 0.09}s`, height: `${8 + ((i * 37) % 17)}px` }} />
          ))}
        </div>

        <div className="mh-pbar" onClick={seek} role="slider" aria-label="Seek message" aria-valuemin={0} aria-valuemax={DUR} aria-valuenow={Math.floor(t)} tabIndex={0}
          onKeyDown={(e) => { if (e.key === "ArrowRight") setT((v) => Math.min(DUR, v + 5)); if (e.key === "ArrowLeft") setT((v) => Math.max(0, v - 5)); }}>
          <i style={{ width: `${(t / DUR) * 100}%` }} />
        </div>
        <div className="mh-ptimes">
          <span>{tfmt(t)}</span>
          <button className="btn sm" onClick={togglePlay}>
            {playing ? <><IconPause size={12} /> Pause</> : ended ? <><IconPlay size={12} /> Replay</> : <><IconPlay size={12} /> Play</>}
          </button>
          <span>{tfmt(DUR)}</span>
        </div>
        <p className="mh-mnote"><IconLock size={12} /> Personal message · decrypted locally · never part of the medical record.</p>
      </div>
    </>
  );
}

/* ================= Crew ping ================= */

const QUICK = ["Coffee in Hab B?", "Quiet orbital walk?", "Movie night — your pick."];

export function PingModal({ onClose, offline, pushToast }: {
  onClose: () => void; offline: boolean; pushToast: (msg: string, tone?: "warn") => void;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(onClose, 1900);
    return () => clearTimeout(id);
  }, [sent, onClose]);

  const send = () => {
    if (!text.trim() || sent) return;
    setSent(true);
    sfx.success();
    pushToast(offline ? "Ping cached in orbital locker — sends on next uplink" : "Ping queued for Dr. Maya Chen — next comms window", offline ? "warn" : undefined);
  };

  return (
    <>
      <div className="scrim mh-scrim" onClick={onClose} />
      <div className="mh-modal ping" role="dialog" aria-label="Send a ping to Dr. Maya Chen">
        <div className="mh-mhead">
          <div>
            <span className="mh-k">Crew comms · unmonitored channel</span>
            <h3>Ping Dr. Maya Chen</h3>
          </div>
          <button className="icon-btn x" onClick={onClose} aria-label="Close crew ping"><IconX size={18} /></button>
        </div>

        {sent ? (
          <div className="mh-bdone">
            <span className="mh-bdone-ring"><IconCheck size={34} /></span>
            <h4>{offline ? "Cached for uplink" : "Ping queued"}</h4>
            <p>{offline ? "Your note is sealed in the local orbital locker and will transmit on the next comms pass." : "Delivering to Hab Module B on the next comms window. No log, no record — just crew."}</p>
          </div>
        ) : (
          <>
            <p className="mh-ping-copy">Flight Specialist · Hab Module B. Informal, encrypted, and off the medical record.</p>
            <div className="mh-quick">
              {QUICK.map((q) => (
                <button key={q} className={text === q ? "on" : ""} onClick={() => { setText(q); sfx.toggle(); }}>{q}</button>
              ))}
            </div>
            <textarea
              value={text} maxLength={240} rows={3}
              placeholder="Write a short, human note…"
              onChange={(e) => setText(e.target.value)}
              aria-label="Ping message"
            />
            <div className="mh-ping-foot">
              <span>{text.length}/240</span>
              <button className="btn primary" onClick={send} disabled={!text.trim()}>
                <IconSend size={14} /> {offline ? "Cache ping" : "Send ping"} <IconArrowR size={14} />
              </button>
            </div>
            <p className="mh-mnote"><IconChat size={12} /> Maya usually replies within one orbital sunset.</p>
          </>
        )}
      </div>
    </>
  );
}
