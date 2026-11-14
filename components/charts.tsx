"use client";

import { useEffect, useRef } from "react";

/* ---------------- ECG ---------------- */
export function Ecg({ hr, offline }: { hr: number; offline: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hrRef = useRef(hr);
  const offRef = useRef(offline);
  hrRef.current = hr;
  offRef.current = offline;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let W = 0, H = 0, dpr = 1;
    const buf: number[] = [];
    let phase = 0;
    let last = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      while (buf.length < W) buf.unshift(0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const g = (p: number, c: number, w: number, a: number) => {
      const d = p - c;
      return a * Math.exp(-(d * d) / (2 * w * w));
    };
    const wave = (p: number) =>
      g(p, 0.16, 0.035, 0.14) +
      g(p, 0.3, 0.012, -0.1) +
      g(p, 0.335, 0.011, 1) +
      g(p, 0.375, 0.013, -0.24) +
      g(p, 0.58, 0.055, 0.26);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const speed = 130; // px per second
      const pxPerBeat = 150;
      const steps = Math.max(1, Math.round(speed * dt));
      if (!offRef.current) {
        for (let i = 0; i < steps; i++) {
          phase = (phase + 1 / pxPerBeat) % 1;
          buf.push(wave(phase));
          if (buf.length > W) buf.shift();
        }
      }
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(46,242,174,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0.5; x < W; x += 22) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0.5; y < H; y += 22) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      const mid = H * 0.58;
      const amp = H * 0.42;
      ctx.beginPath();
      for (let i = 0; i < buf.length; i++) {
        const x = i;
        const y = mid - buf[i] * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#2ef2ae";
      ctx.lineWidth = 1.8;
      ctx.shadowColor = "rgba(46,242,174,0.8)";
      ctx.shadowBlur = 7;
      ctx.stroke();
      ctx.shadowBlur = 0;
      const hx = buf.length - 1;
      const hy = mid - (buf[hx] ?? 0) * amp;
      ctx.beginPath();
      ctx.arc(hx, hy, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "#c8ffe9";
      ctx.shadowColor = "#2ef2ae";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} aria-label="Live electrocardiogram trace" />;
}

/* ---------------- Brain wave ---------------- */
export function BrainWave({ offline }: { offline: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const offRef = useRef(offline);
  offRef.current = offline;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0, W = 0, H = 0;
    let t = 0, last = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!offRef.current) t += dt;
      ctx.clearRect(0, 0, W, H);
      const mid = H / 2;
      const layers = [
        { f: 0.045, a: 0.3, s: 2.1, c: "rgba(182,164,247,0.4)", w: 1.1 },
        { f: 0.09, a: 0.2, s: 3.4, c: "rgba(76,195,255,0.45)", w: 1.1 },
      ];
      for (const L of layers) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = mid + Math.sin(x * L.f + t * L.s) * H * L.a * Math.sin(x * 0.008 + t * 0.7);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = L.c;
        ctx.lineWidth = L.w;
        ctx.stroke();
      }
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const env = 0.55 + 0.45 * Math.sin(x * 0.012 + t * 1.3);
        const y =
          mid +
          (Math.sin(x * 0.06 + t * 4.2) * 0.55 +
            Math.sin(x * 0.13 + t * 6.1) * 0.3 +
            Math.sin(x * 0.021 + t * 1.6) * 0.35) *
            H * 0.3 * env;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(238,244,255,0.92)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(182,164,247,0.7)";
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} aria-label="Live cognitive EEG waveform" />;
}

/* ---------------- Sparkline ---------------- */
export function Sparkline({ data }: { data: number[] }) {
  const W = 520, H = 74, pad = 8;
  const min = Math.min(...data) - 0.6;
  const max = Math.max(...data) + 0.6;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / (max - min)) * (H - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
  const lastP = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-label="7-day resting heart rate baseline">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(46,242,174,0.28)" />
          <stop offset="100%" stopColor="rgba(46,242,174,0)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(148,163,187,0.07)" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#sparkFill)" />
      <path d={line} fill="none" stroke="#2ef2ae" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastP[0]} cy={lastP[1]} r="3.4" fill="#c8ffe9" stroke="#2ef2ae" strokeWidth="1.6" />
    </svg>
  );
}

/* ---------------- Ring gauge ---------------- */
export function RingGauge({
  size, stroke, value, color, track = "#1a2942", children,
}: {
  size: number; stroke: number; value: number; color: string; track?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="ring-c">{children}</div>
    </div>
  );
}

/* ---------------- Bar ---------------- */
export function Bar({ value, tone = "" }: { value: number; tone?: "" | "blue" | "violet" | "gray" }) {
  return (
    <div className={`bar ${tone}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}