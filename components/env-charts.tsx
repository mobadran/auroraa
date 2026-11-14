"use client";

import { useMemo, useRef, useState } from "react";

/* ---------------- Diurnal temperature curve ---------------- */
export function DiurnalChart() {
  return (
    <div className="diurnal">
      <svg viewBox="0 0 320 104" preserveAspectRatio="none" aria-label="Diurnal surface temperature curve">
        <defs>
          <linearGradient id="diurnalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(76,195,255,0.3)" />
            <stop offset="100%" stopColor="rgba(76,195,255,0)" />
          </linearGradient>
        </defs>
        {[26, 50, 74].map((y) => (
          <line key={y} x1="8" x2="312" y1={y} y2={y} stroke="rgba(148,163,187,0.08)" strokeWidth="1" />
        ))}
        <path d="M10 80 C70 78 108 26 160 24 C212 26 250 78 310 80 L310 96 L10 96 Z" fill="url(#diurnalFill)" />
        <path d="M10 80 C70 78 108 26 160 24 C212 26 250 78 310 80" fill="none" stroke="#4cc3ff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="176" cy="25" r="3.6" fill="#c8ecff" stroke="#4cc3ff" strokeWidth="1.6">
          <animate attributeName="r" values="3.2;4.4;3.2" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="diurnal-x">
        <span>DAWN (05:00)</span><span>MIDDAY (13:00)</span><span>DUSK (19:00)</span>
      </div>
    </div>
  );
}

/* ---------------- 24h multi-series timeline ---------------- */
const W = 1000, H = 250, PADX = 14;
const N = 120;

const tempAt = (t: number) => {
  const hour = (14 + t * 24) % 24;
  return -55 + 35 * Math.cos(((hour - 13) / 24) * Math.PI * 2);
};
const radAt = (t: number) => 0.42 + 0.025 * Math.sin(t * 7) + 0.012 * Math.sin(t * 23);
const dustAt = (t: number) => 0.5 + 0.24 * t + 0.04 * Math.sin(t * 11);
const presAt = (t: number) => 610 + 11 * Math.sin(t * Math.PI * 4) + 4 * Math.sin(t * Math.PI * 9);

const yTemp = (v: number) => 150 - ((v + 90) / 70) * 78;
const yRad = (v: number) => 66 - ((v - 0.38) / 0.1) * 20;
const yDust = (v: number) => 178 - ((v - 0.45) / 0.35) * 46;
const yPres = (v: number) => 214 - ((v - 595) / 30) * 24;

function build(fn: (t: number) => number, y: (v: number) => number) {
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = PADX + t * (W - PADX * 2);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y(fn(t)).toFixed(1)} `;
  }
  return d;
}

const SERIES = [
  { key: "temp", label: "Temp", unit: "°C", color: "#4cc3ff", fn: tempAt, y: yTemp, fmt: (v: number) => v.toFixed(0) },
  { key: "rad", label: "Radiation", unit: "mSv", color: "#ff8d7a", fn: radAt, y: yRad, fmt: (v: number) => v.toFixed(2) },
  { key: "dust", label: "Dust", unit: "Tau", color: "#2ef2ae", fn: dustAt, y: yDust, fmt: (v: number) => v.toFixed(2) },
  { key: "pres", label: "Pressure", unit: "Pa", color: "#b6a4f7", fn: presAt, y: yPres, fmt: (v: number) => v.toFixed(0) },
];

const timeLabel = (t: number) => {
  const total = 14 + t * 24;
  const sol = total >= 24 ? 127 : 126;
  const h = Math.floor(total % 24);
  const m = Math.floor((total % 1) * 60);
  return `SOL ${sol} · ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} LMST`;
};

export function TimelineChart() {
  const paths = useMemo(() => SERIES.map((s) => build(s.fn, s.y)), []);
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setHover(t);
  };

  const hx = hover === null ? 0 : PADX + hover * (W - PADX * 2);
  const nowX = PADX + 0.965 * (W - PADX * 2);

  return (
    <div className="timeline">
      <div className="tl-legend">
        {SERIES.map((s) => (
          <span key={s.key}><i style={{ background: s.color }} />{s.label} ({s.unit})</span>
        ))}
      </div>
      <div className="tl-plot" ref={ref} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`tl-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.16" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line key={f} x1={PADX} x2={W - PADX} y1={H * f} y2={H * f} stroke="rgba(148,163,187,0.07)" strokeWidth="1" />
          ))}
          {SERIES.map((s, i) => (
            <g key={s.key}>
              <path d={`${paths[i]} L${W - PADX},${H} L${PADX},${H} Z`} fill={`url(#tl-${s.key})`} />
              <path d={paths[i]} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                strokeDasharray={s.key === "rad" ? "6 5" : undefined} />
            </g>
          ))}
          {/* NOW marker */}
          <line x1={nowX} x2={nowX} y1="20" y2={H - 24} stroke="#2ef2ae" strokeWidth="1.4" strokeDasharray="4 4" />
          <circle cx={nowX} cy="20" r="3" fill="#2ef2ae" />
          {/* hover crosshair */}
          {hover !== null && (
            <g>
              <line x1={hx} x2={hx} y1="16" y2={H - 24} stroke="rgba(238,244,255,0.5)" strokeWidth="1" />
              {SERIES.map((s) => (
                <circle key={s.key} cx={hx} cy={s.y(s.fn(hover))} r="4" fill={s.color} stroke="#0a1120" strokeWidth="1.5" />
              ))}
            </g>
          )}
        </svg>
        {hover !== null && (
          <div className="tl-tip" style={{ left: `clamp(100px, ${hover * 100}%, calc(100% - 100px))` }}>
            <div className="tl-tip-time">{timeLabel(hover)}</div>
            {SERIES.map((s) => (
              <div key={s.key}><i style={{ background: s.color }} /><span>{s.label}</span><b>{s.fmt(s.fn(hover))} {s.unit}</b></div>
            ))}
          </div>
        )}
      </div>
      <div className="tl-x">
        <span>SOL 126 14:00 LMST</span>
        <span>SOL 126 20:00 (NIGHT)</span>
        <span>SOL 127 02:00</span>
        <span>SOL 127 08:00 (DAWN)</span>
        <span className="mint">SOL 127 14:00 (NOW)</span>
      </div>
    </div>
  );
}