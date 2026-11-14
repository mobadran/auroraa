"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { blip, setSoundEnabled, sfx } from "@/lib/sound";
import {
  IconBolt, IconCheck, IconPause, IconPlay, IconSync, IconVolume, IconVolumeX,
} from "@/components/icons";

/* ============================================================
   Shared chrome
   ============================================================ */

function Shell({
  title, icon, right, children,
}: {
  title: string; icon: ReactNode; right?: ReactNode; children: ReactNode;
}) {
  return (
    <section className="gx" aria-label={title}>
      <div className="gx-head">
        <span className="gx-badge">{icon}</span>
        <h3>{title}</h3>
        {right && <div className="gx-headr">{right}</div>}
      </div>
      {children}
    </section>
  );
}

function SoundToggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      className="gx-sound"
      onClick={() => {
        const next = !on;
        setOn(next);
        setSoundEnabled(next);
        if (next) sfx.toggle();
      }}
      aria-pressed={on}
      aria-label={on ? "Mute activity sound" : "Enable activity sound"}
    >
      {on ? <IconVolume size={15} /> : <IconVolumeX size={15} />} Sound
    </button>
  );
}

/* ============================================================
   1 — Reflex Dot Challenge
   ============================================================ */

const REFLEX = [
  { target: 8, secs: 15 },
  { target: 12, secs: 15 },
  { target: 16, secs: 15 },
  { target: 20, secs: 15 },
  { target: 24, secs: 18 },
];

const randPos = () => ({
  x: 10 + Math.random() * 80,
  y: 12 + Math.random() * 76,
});

type ReflexPhase = "idle" | "play" | "over" | "done";

export function ReflexDot({ onComplete }: { onComplete?: () => void }) {
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [ms, setMs] = useState(REFLEX[0].secs * 1000);
  const [phase, setPhase] = useState<ReflexPhase>("idle");
  const [dot, setDot] = useState({ x: 50, y: 50 });
  const [pop, setPop] = useState(0);
  const cfg = REFLEX[stage];

  const start = useCallback((s = 0) => {
    setStage(s);
    setScore(0);
    setLives(3);
    setMs(REFLEX[s].secs * 1000);
    setDot(randPos());
    setPhase("play");
    sfx.open();
  }, []);

  useEffect(() => {
    if (phase !== "play") return;
    const id = window.setInterval(() => setMs((m) => Math.max(0, m - 100)), 100);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play" || ms > 0) return;
    const left = lives - 1;
    setLives(left);
    if (left <= 0) {
      setPhase("over");
      sfx.warn();
      return;
    }
    sfx.warn();
    setScore(0);
    setMs(REFLEX[stage].secs * 1000);
    setDot(randPos());
  }, [ms, phase, lives, stage]);

  const hit = () => {
    if (phase !== "play") return;
    const next = score + 1;
    setPop((p) => p + 1);
    if (next >= cfg.target) {
      if (stage >= REFLEX.length - 1) {
        setScore(next);
        setPhase("done");
        sfx.success();
        onComplete?.();
        return;
      }
      setStage(stage + 1);
      setScore(0);
      setMs(REFLEX[stage + 1].secs * 1000);
      setDot(randPos());
      sfx.success();
      return;
    }
    setScore(next);
    setDot(randPos());
    sfx.toggle();
  };

  const timePct = (ms / (cfg.secs * 1000)) * 100;

  return (
    <Shell
      title="Reflex Dot Challenge"
      icon={<IconBolt size={17} />}
      right={
        <>
          <span className="gx-lives">
            Lives: {Array.from({ length: 3 }, (_, i) => (
              <b key={i} className={i < lives ? "" : "off"}>♥</b>
            ))}
          </span>
          <SoundToggle />
        </>
      }
    >
      <div className="gx-stages">
        {REFLEX.map((_, i) => (
          <span
            key={i}
            className={`gx-stage ${i < stage || phase === "done" ? "done" : ""} ${i === stage && phase !== "done" ? "on" : ""}`}
          >
            {(i < stage || phase === "done") ? "✓ " : ""}Stage {i + 1}
          </span>
        ))}
      </div>

      <div className="gx-scorebar">
        <span>Current Score: <b className="blue">{score}</b></span>
        <span>Target Score: <b className="amber">{cfg.target}</b></span>
      </div>

      <div className="gx-prompt">
        <span>Stage {stage + 1} of {REFLEX.length} — Score {cfg.target} points in {cfg.secs}s!</span>
        <b>{(ms / 1000).toFixed(2)}s</b>
      </div>
      <div className="gx-timebar" role="progressbar" aria-label="Stage time remaining" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(timePct)}>
        <i style={{ width: `${timePct}%` }} />
      </div>

      <div className="gx-arena">
        {phase === "play" && (
          <button
            key={pop}
            className="gx-dot"
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            onClick={hit}
            aria-label="Hit the reflex dot"
          >
            <i />
          </button>
        )}

        {phase === "idle" && (
          <div className="gx-overlay">
            <span className="gx-okey">01</span>
            <h4>Reaction readiness</h4>
            <p>Hit the glowing dot as fast as you can. Clear five stages to finish the reflex block — you have three lives.</p>
            <button className="btn primary" onClick={() => start(0)}><IconPlay size={13} /> Start challenge</button>
          </div>
        )}
        {phase === "over" && (
          <div className="gx-overlay bad">
            <span className="gx-okey">✕</span>
            <h4>Lives exhausted</h4>
            <p>Reaction block closed at stage {stage + 1}. Reset and run the challenge again to log a full reflex score.</p>
            <button className="btn primary" onClick={() => start(0)}><IconPlay size={13} /> Retry challenge</button>
          </div>
        )}
        {phase === "done" && (
          <div className="gx-overlay good">
            <span className="gx-okey"><IconCheck size={22} /></span>
            <h4>Reflex block complete</h4>
            <p>All five stages cleared with {lives} {lives === 1 ? "life" : "lives"} remaining. Reaction telemetry logged to Sol 127.</p>
            <button className="btn" onClick={() => start(0)}>Run again</button>
          </div>
        )}
      </div>
    </Shell>
  );
}

/* ============================================================
   2 — Pattern Recall
   ============================================================ */

const TILES = [
  "#e5484d", "#2fd67f", "#3b82f6",
  "#f0a12b", "#8b5cf6", "#12b3a6",
  "#e8618c", "#d8c25c", "#5f7df5",
];
const ROUNDS = [3, 4, 5];

type SeqPhase = "idle" | "show" | "input" | "fail" | "done";

export function SequenceRecall({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<SeqPhase>("idle");
  const [round, setRound] = useState(0);
  const [seq, setSeq] = useState<number[]>([]);
  const [cursor, setCursor] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [taps, setTaps] = useState(0);

  const beginRound = useCallback((r: number) => {
    const len = ROUNDS[r];
    setSeq(Array.from({ length: len }, () => Math.floor(Math.random() * TILES.length)));
    setRound(r);
    setCursor(0);
    setPhase("show");
    sfx.open();
  }, []);

  useEffect(() => {
    if (phase !== "show") return;
    const timers: number[] = [];
    let i = 0;
    const step = () => {
      if (i >= seq.length) {
        timers.push(window.setTimeout(() => { setActive(null); setCursor(0); setPhase("input"); }, 340));
        return;
      }
      const tile = seq[i];
      setActive(tile);
      blip(430 + tile * 38, 0.13, "sine", 0.5);
      timers.push(window.setTimeout(() => {
        setActive(null);
        i += 1;
        timers.push(window.setTimeout(step, 165));
      }, 380));
    };
    step();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, seq]);

  useEffect(() => {
    if (phase !== "fail") return;
    const id = window.setTimeout(() => beginRound(round), 1250);
    return () => window.clearTimeout(id);
  }, [phase, round, beginRound]);

  const tap = (i: number) => {
    if (phase !== "input") return;
    if (seq[cursor] !== i) {
      sfx.warn();
      setPhase("fail");
      return;
    }
    blip(520 + i * 36, 0.1, "sine", 0.55);
    setActive(i);
    window.setTimeout(() => setActive(null), 160);
    const next = cursor + 1;
    setCursor(next);
    setTaps((t) => t + 1);
    if (next >= seq.length) {
      if (round >= ROUNDS.length - 1) {
        setPhase("done");
        sfx.success();
        onComplete?.();
      } else {
        setRound(round + 1);
        setPhase("show");
        window.setTimeout(() => beginRound(round + 1), 60);
      }
    }
  };

  const status =
    phase === "idle" ? "Press start, then repeat the colour pattern in order."
      : phase === "show" ? "Watch the sequence…"
        : phase === "input" ? `Your turn — repeat ${seq.length} tiles (${cursor}/${seq.length})`
          : phase === "fail" ? "Sequence broke — replaying the same round"
            : "Pattern locked — all rounds cleared";

  return (
    <Shell
      title="Pattern Recall"
      icon={<IconSync size={17} />}
      right={<span className="gx-chip">Round {Math.min(round + 1, ROUNDS.length)} / {ROUNDS.length}</span>}
    >
      <div className="gx-stages">
        {ROUNDS.map((n, i) => (
          <span
            key={n}
            className={`gx-stage ${i < round || phase === "done" ? "done" : ""} ${i === round && phase !== "done" ? "on" : ""}`}
          >
            {(i < round || phase === "done") ? "✓ " : ""}Round {i + 1} · {n} tiles
          </span>
        ))}
      </div>

      <div className="gx-scorebar">
        <span>Correct Taps: <b className="blue">{taps}</b></span>
        <span>Sequence Length: <b className="amber">{seq.length || ROUNDS[0]}</b></span>
      </div>

      <div className={`gx-prompt ${phase === "fail" ? "bad" : ""}`}>
        <span>{status}</span>
        <b>{phase === "show" ? "MEMORISE" : phase === "input" ? "RECALL" : phase === "done" ? "CLEAR" : "READY"}</b>
      </div>
      <div className="gx-timebar"><i style={{ width: phase === "idle" ? "0%" : `${(cursor / Math.max(1, seq.length)) * 100}%` }} /></div>

      <div className="gx-arena pattern">
        <div className="gx-grid9" role="grid" aria-label="Pattern recall grid">
          {TILES.map((c, i) => (
            <button
              key={i}
              role="gridcell"
              className={`gx-tile ${active === i ? "lit" : ""} ${phase === "input" ? "live" : ""}`}
              style={{ "--c": c } as React.CSSProperties}
              onClick={() => tap(i)}
              disabled={phase !== "input"}
              aria-label={`Colour tile ${i + 1}`}
            />
          ))}
        </div>

        {phase === "idle" && (
          <div className="gx-overlay">
            <span className="gx-okey">02</span>
            <h4>Working-memory sweep</h4>
            <p>Nine colour tiles flash a short sequence. Repeat it in order — three rounds, growing by one tile each time.</p>
            <button className="btn primary" onClick={() => beginRound(0)}><IconPlay size={13} /> Start pattern</button>
          </div>
        )}
        {phase === "done" && (
          <div className="gx-overlay good">
            <span className="gx-okey"><IconCheck size={22} /></span>
            <h4>Pattern complete</h4>
            <p>All three rounds recalled — {taps} correct taps logged to the cognitive sync channel.</p>
            <button className="btn" onClick={() => { setTaps(0); beginRound(0); }}>Run again</button>
          </div>
        )}
      </div>
    </Shell>
  );
}

/* ============================================================
   3 — Breath Sync
   ============================================================ */

const BOX = [
  { key: "in", label: "Inhale", secs: 4 },
  { key: "h1", label: "Hold", secs: 4 },
  { key: "out", label: "Exhale", secs: 4 },
  { key: "h2", label: "Hold", secs: 4 },
] as const;
const CYCLE = 16;
const GOAL = 180;

const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function BreathSync({ onComplete }: { onComplete?: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [holding, setHolding] = useState(false);
  const [harmony, setHarmony] = useState(0);
  const doneRef = useRef(false);

  const cycles = Math.floor(elapsed / CYCLE);
  const phaseIdx = Math.floor((elapsed % CYCLE) / 4);
  const phase = BOX[phaseIdx];
  const progress = Math.min(1, elapsed / GOAL);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 0.1;
        if (next >= GOAL) {
          setRunning(false);
          if (!doneRef.current) {
            doneRef.current = true;
            sfx.success();
            onComplete?.();
          }
          return GOAL;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [running, onComplete]);

  useEffect(() => {
    if (!running || !holding || phase.key !== "in") return;
    const id = window.setInterval(() => setHarmony((h) => Math.min(100, h + 1)), 220);
    return () => window.clearInterval(id);
  }, [running, holding, phase.key]);

  useEffect(() => {
    if (!running) return;
    if (phaseIdx === 0) blip(520, 0.1, "sine", 0.4);
    if (phaseIdx === 2) blip(360, 0.12, "sine", 0.4);
  }, [phaseIdx, running]);

  const scale = (() => {
    const local = elapsed % 4;
    if (phase.key === "in") return 0.72 + (local / 4) * 0.28;
    if (phase.key === "h1") return 1;
    if (phase.key === "out") return 1 - (local / 4) * 0.28;
    return 0.72;
  })();

  const calm = Math.min(100, Math.round(cycles * 7 + harmony * 0.35));
  const reset = () => {
    setElapsed(0); setRunning(false); setHolding(false); setHarmony(0); doneRef.current = false;
    sfx.close();
  };

  return (
    <Shell
      title="Breath Sync"
      icon={<IconSync size={17} />}
      right={<span className="gx-chip">Session goal · 3 minutes</span>}
    >
      <div className="gx-bsession">
        <div className="gx-bsession-top">
          <span>Session Goal: 3 Minutes</span>
          <b>{Math.round(progress * 100)}%</b>
        </div>
        <div className="gx-timebar"><i style={{ width: `${progress * 100}%` }} /></div>
      </div>

      <div className="gx-bstage">
        <div className="gx-rings" aria-hidden="true">
          <i className="r1" /><i className="r2" /><i className="r3" />
        </div>
        <div className={`gx-orb ${running ? "live" : ""}`} style={{ transform: `scale(${running ? scale : 0.86})` }}>
          <b>{running ? phase.label : elapsed >= GOAL ? "Complete" : "Ready"}</b>
          <span>{running ? `${Math.max(0, Math.ceil(4 - (elapsed % 4)))}s` : "— —"}</span>
          <em>{running ? "Stay with the orb" : "Press start to begin"}</em>
        </div>
        <p className="gx-bhint">
          <b>Boost your Calm &amp; Sync Index:</b> Press &amp; hold the orb (or Spacebar) while Inhaling, and release while Exhaling!
        </p>
        <div className="gx-bctl">
          <button className="btn primary" onClick={() => { setRunning((r) => !r); sfx.open(); }}>
            {running ? <><IconPause size={13} /> Pause</> : <><IconPlay size={13} /> Start</>}
          </button>
          <button
            className={`btn ${holding ? "on" : ""}`}
            onPointerDown={() => { setHolding(true); sfx.toggle(); }}
            onPointerUp={() => setHolding(false)}
            onPointerLeave={() => setHolding(false)}
            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setHolding(true); }}
            onKeyUp={() => setHolding(false)}
            aria-pressed={holding}
          >
            <IconSync size={13} /> Hold to Sync
          </button>
          <button className="btn" onClick={reset} disabled={elapsed === 0}>Reset Session</button>
        </div>
      </div>

      <div className="gx-readings">
        <div className="gx-readings-head">
          <span className="gx-dotmini" /> Your Live Readings
          <button className="gx-link" onClick={reset} disabled={elapsed === 0}>Reset Readings</button>
        </div>
        <div className="gx-readings-grid">
          <div>
            <span className="k">Completed Cycles</span>
            <b>{cycles}<em>cycles</em></b>
          </div>
          <div>
            <span className="k">Practice Time</span>
            <b className="mono">{mmss(elapsed)}</b>
          </div>
          <div>
            <span className="k">Breathing Rate</span>
            <b className="violet">3.8<em>breaths / min</em></b>
          </div>
          <div>
            <span className="k">Calm &amp; Sync Index</span>
            <b className="mint">{calm}%<em>{calm === 0 ? "Starting" : calm > 70 ? "Harmonised" : "Building"}</em></b>
          </div>
        </div>
        <div className="gx-readings-foot">
          <span>Active Pattern: <b>Box Breathing (4s Inhale · 4s Hold · 4s Exhale · 4s Hold)</b></span>
          <span>Sync Harmony Score: <b className="blue">{harmony} pts</b></span>
        </div>
      </div>
    </Shell>
  );
}
