"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { sfx } from "@/lib/sound";
import { RingGauge } from "@/components/charts";
import { BreathSync, ReflexDot, SequenceRecall } from "@/components/games";
import {
  IconBattery0, IconBattery1, IconBattery2, IconBattery3, IconBolt, IconCircleDash,
  IconDots, IconFocus1, IconFocus2, IconFog, IconFrown, IconLotus, IconMesh, IconPower,
  IconRecord, IconScales, IconSignal1, IconSlidersV, IconSmile, IconSparkles,
  IconSprout, IconUsers2, IconUsers3, IconWarn, IconWifiOff,
} from "@/components/icons";

const STEPS = [
  { id: "reflex", label: "Reflex Dot", sub: "Reaction readiness" },
  { id: "pattern", label: "Pattern Recall", sub: "Working memory" },
  { id: "breath", label: "Breath Sync", sub: "Autonomic regulation" },
  { id: "triage", label: "Triage Form", sub: "Five-domain check-in" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

type Opt = { label: string; sub: string; icon: (p: { size?: number }) => React.ReactNode; tone?: string };
type Question = {
  domain: string; text: string; badge: "mint" | "blue" | "violet";
  acc: string; glow: string; tint: string; badges?: string[]; flag: string; opts: Opt[];
};

const QUESTIONS: Question[] = [
  {
    domain: "Mood", text: "How would you describe your overall mood today?",
    badge: "mint", acc: "#2ef2ae", glow: "rgba(46,242,174,0.28)", tint: "rgba(46,242,174,0.07)",
    flag: "Mood below baseline — schedule Earth-habitat sanctuary session and notify flight surgeon.",
    opts: [
      { label: "Very Low", sub: "Heavy / Gloomy", icon: (p) => <IconSlidersV {...p} /> },
      { label: "Low", sub: "Subdued", icon: (p) => <IconFrown {...p} /> },
      { label: "Neutral", sub: "Equilibrium", icon: (p) => <IconScales {...p} /> },
      { label: "Good", sub: "Optimum Drive", icon: (p) => <IconSmile {...p} /> },
      { label: "Excellent", sub: "Peak Resonance", icon: (p) => <IconSparkles {...p} /> },
    ],
  },
  {
    domain: "Stress Load", text: "How stressed or overwhelmed have you felt today?",
    badge: "blue", acc: "#4cc3ff", glow: "rgba(76,195,255,0.28)", tint: "rgba(76,195,255,0.07)",
    flag: "Elevated stress load — insert 20 min HRV biofeedback block before next EVA simulation.",
    opts: [
      { label: "Extremely Stressed", sub: "Overload Alert", icon: (p) => <IconPower {...p} />, tone: "#ff8d7a" },
      { label: "Very Stressed", sub: "High Friction", icon: (p) => <IconWarn {...p} /> },
      { label: "Moderately", sub: "Manageable", icon: (p) => <IconDots {...p} /> },
      { label: "Slightly Stressed", sub: "Mild Pressure", icon: (p) => <IconSprout {...p} /> },
      { label: "Not Stressed", sub: "Deep Zen Calm", icon: (p) => <IconLotus {...p} /> },
    ],
  },
  {
    domain: "Energy", text: "How would you rate your energy throughout the day?",
    badge: "violet", acc: "#eef4ff", glow: "rgba(238,244,255,0.26)", tint: "rgba(238,244,255,0.06)",
    badges: ["Depleted", "Low", "Moderate", "Good", "Peak"],
    flag: "Energy reserve low — review sleep hygiene, caloric intake and ARED load prescription.",
    opts: [
      { label: "Completely Drained", sub: "Depleted", icon: (p) => <IconBattery0 {...p} /> },
      { label: "Low Energy", sub: "Sluggish Phase", icon: (p) => <IconBattery1 {...p} /> },
      { label: "Moderate Energy", sub: "Sustaining Basal", icon: (p) => <IconBattery2 {...p} /> },
      { label: "Good Energy", sub: "Vigorous Output", icon: (p) => <IconBattery3 {...p} /> },
      { label: "Very Energetic", sub: "Peak Electrical", icon: (p) => <IconBolt {...p} /> },
    ],
  },
  {
    domain: "Crew Cohesion", text: "How connected have you felt with your crew today?",
    badge: "mint", acc: "#2ef2ae", glow: "rgba(46,242,174,0.28)", tint: "rgba(46,242,174,0.07)",
    flag: "Crew cohesion drifting — add shared meal block and joint comms window with Mission Control.",
    opts: [
      { label: "Disconnected", sub: "Isolated Orbit", icon: (p) => <IconWifiOff {...p} /> },
      { label: "Mostly Apart", sub: "Distant Sync", icon: (p) => <IconSignal1 {...p} /> },
      { label: "Somewhat", sub: "Nominal Comms", icon: (p) => <IconUsers2 {...p} /> },
      { label: "Connected", sub: "High Synergy", icon: (p) => <IconUsers3 {...p} /> },
      { label: "Very Connected", sub: "Interlocking Mesh", icon: (p) => <IconMesh {...p} /> },
    ],
  },
  {
    domain: "Focus", text: "How well have you been able to concentrate on your tasks?",
    badge: "blue", acc: "#4cc3ff", glow: "rgba(76,195,255,0.28)", tint: "rgba(76,195,255,0.07)",
    flag: "Attention fragmentation — reduce multitask load and protect 90 min deep-work corridors.",
    opts: [
      { label: "Very Difficult", sub: "Severe Fog", icon: (p) => <IconFog {...p} /> },
      { label: "Difficult", sub: "Attention Drift", icon: (p) => <IconCircleDash {...p} /> },
      { label: "Moderate", sub: "Nominal Span", icon: (p) => <IconFocus1 {...p} /> },
      { label: "Good", sub: "Clear Focus", icon: (p) => <IconFocus2 {...p} /> },
      { label: "Excellent", sub: "Laser Aperture", icon: (p) => <IconRecord {...p} /> },
    ],
  },
];

const SEED = [4, 4, 3, 4, 4];
const STORE_KEY = "aurora.checkin.v1";

type Report = { answers: number[]; total: number; at: string; cached: boolean };

function classify(total: number) {
  if (total >= 21) return { label: "Peak Resonance — Cleared for EVA", color: "#2ef2ae", copy: "Composite psychological telemetry sits in the upper band. Cognitive reserve, crew synergy and stress recovery all support full EVA tasking on Sol 131." };
  if (total >= 17) return { label: "Nominal — Cleared for EVA Prep", color: "#2ef2ae", copy: "Composite score within the Artemis IV nominal corridor. Minor fluctuations are expected under 0.38G adaptation; continue standard circadian and cohesion protocols." };
  if (total >= 12) return { label: "Monitor — Flight Surgeon Review", color: "#ffb454", copy: "One or more domains sit below the nominal corridor. dr. Mohamed Wael will review this triage within the hour; EVA qualification tasks remain paused pending review." };
  return { label: "Hold — Psych Support Priority", color: "#ff5d6c", copy: "Composite score below the safety corridor. Immediate private conference with the flight surgeon is scheduled; non-essential tasking is suspended for this sol." };
}

const domainTone = (v: number) => (v <= 2 ? "#ff5d6c" : v === 3 ? "#ffb454" : "#2ef2ae");

export default function CheckIn() {
  const { offline, pushToast } = useApp();
  const router = useRouter();
  const [answers, setAnswers] = (useState<(number | null)[]>(SEED));
  const [report, setReport] = useState<Report | null>(null);
  const [view, setView] = useState<"form" | "report">("form");
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [cleared, setCleared] = useState<Record<StepId, boolean>>({
    reflex: false, pattern: false, breath: false, triage: false,
  });

  const markCleared = (id: StepId) =>
    setCleared((c) => (c[id] ? c : { ...c, [id]: true }));

  const goStep = (i: number) => {
    setStep(i);
    sfx.nav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { answers?: (number | null)[]; report?: Report };
        if (Array.isArray(saved.answers) && saved.answers.length === 5) setAnswers(saved.answers);
        if (saved.report && Array.isArray(saved.report.answers)) setReport(saved.report);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ answers, report })); } catch {}
  }, [answers, report, loaded]);

  const complete = answers.every((a) => a !== null);
  const total = answers.reduce<number>((s, a) => s + (a ?? 0), 0);

  const select = (qi: number, v: number) => {
    setAnswers((p) => p.map((a, i) => (i === qi ? v : a)));
    sfx.toggle();
  };

  const onKeys = (qi: number) => (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const cur = answers[qi] ?? 3;
    const next = Math.min(5, Math.max(1, cur + delta));
    select(qi, next);
    const btns = e.currentTarget.querySelectorAll("button");
    btns[next - 1]?.focus();
  };

  const submit = () => {
    if (!complete) { sfx.warn(); pushToast("Answer all five domains before transmitting", "warn"); return; }
    const r: Report = { answers: answers as number[], total, at: new Date().toISOString(), cached: offline };
    setReport(r);
    setView("report");
    sfx.success();
    pushToast(offline ? "Triage cached locally — queued for next downlink pass" : "Sol 127 triage transmitted to NASA Medical", offline ? "warn" : undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retake = () => { setAnswers([null, null, null, null, null]); setView("form"); sfx.open(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const review = () => { setView("form"); sfx.open(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const exportJSON = () => {
    if (!report) return;
    const payload = {
      mission: "Artemis Deep Space Mission", sol: 127, crew: "CDR Morgan A. (AUR-01)",
      submittedAt: report.at, uplink: report.cached ? "cached-offline" : "live",
      composite: `${report.total}/25`, classification: classify(report.total).label,
      domains: QUESTIONS.map((q, i) => ({ domain: q.domain, score: report.answers[i], response: q.opts[report.answers[i] - 1].label })),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url; a.download = "aurora-sol127-mental-triage.json"; a.click();
    URL.revokeObjectURL(url);
    sfx.success(); pushToast("Triage report exported as JSON");
  };

  const cls = report ? classify(report.total) : null;
  const flagged = report ? QUESTIONS.map((q, i) => ({ q, v: report.answers[i] })).filter((x) => x.v <= 3) : [];

  return (
    <div className="ck">
      <div className="ck-titlebar">
        <div>
          <h1>Daily Mental Health Check-In</h1>
          <p>Take a moment to understand how you&apos;re feeling today. Standard Artemis IV psychological triage.</p>
        </div>
        <div className="ck-meta">
          <span className="ck-crew">CDR Morgan A. <i /> Sol 127</span>
          {report && view === "form" && (
            <button className="ck-last" onClick={() => { setView("report"); sfx.open(); }}>
              Last triage: {report.total}/25 · View report
            </button>
          )}
        </div>
      </div>

      {view === "form" ? (
        <>
          <nav className="ck-steps" aria-label="Pre-EVA checklist steps">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`ck-step ${i === step ? "on" : ""} ${cleared[s.id] ? "done" : ""}`}
                onClick={() => goStep(i)}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="n">{cleared[s.id] ? "✓" : String(i + 1).padStart(2, "0")}</span>
                <span className="txt">
                  <span className="t">{s.label}</span>
                  <span className="s">{s.sub}</span>
                </span>
              </button>
            ))}
          </nav>

          {step === 0 && <ReflexDot onComplete={() => markCleared("reflex")} />}
          {step === 1 && <SequenceRecall onComplete={() => markCleared("pattern")} />}
          {step === 2 && <BreathSync onComplete={() => markCleared("breath")} />}

          {step < 3 && (
            <div className="ck-nextrow">
              <button className="ck-next" onClick={() => goStep(step + 1)}>Next</button>
              <p className="ck-submitnote">
                {STEPS[step].label} · {cleared[STEPS[step].id] ? "activity logged" : "optional — you can continue without completing it"}
              </p>
            </div>
          )}
          {step === 3 && (
            <>
              {QUESTIONS.map((q, qi) => {
            const v = answers[qi];
            const badgeText = v === null ? null : (q.badges ?? q.opts.map((o) => o.label))[v - 1];
            return (
              <section
                key={q.domain}
                className="ck-q"
                style={{ "--acc": q.acc, "--glow": q.glow, "--tint": q.tint, animationDelay: `${qi * 70}ms` } as CSSProperties}
                aria-label={q.text}
              >
                <div className="ck-qhead">
                  <span className={`ck-qnum ${q.badge}`}>Q0{qi + 1}</span>
                  <h2>{q.text}</h2>
                  <span key={v ?? "none"} className={`ck-eval ${q.badge} ${v === null ? "idle" : ""}`}>
                    {v === null ? "Awaiting response" : `Evaluated: ${badgeText} (${v}/5)`}
                  </span>
                </div>
                <div className="ck-opts" role="radiogroup" aria-label={q.text} onKeyDown={onKeys(qi)}>
                  {q.opts.map((o, oi) => {
                    const on = v === oi + 1;
                    return (
                      <button
                        key={o.label}
                        role="radio"
                        aria-checked={on}
                        className={`ck-opt ${on ? "on" : ""}`}
                        onClick={() => select(qi, oi + 1)}
                      >
                        <span className="oi" style={!on && o.tone ? { color: o.tone } : undefined}>{o.icon({ size: 27 })}</span>
                        <span className="n">{oi + 1}. {o.label}</span>
                        <span className="s">{o.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <div className="ck-submitrow">
            <button className="ck-submit" disabled={!complete} onClick={submit}>Submit</button>
            <p className="ck-submitnote">
              {complete ? "Responses encrypt into the medical downlink frame on submit." : `${answers.filter((a) => a === null).length} domain(s) awaiting response.`}
            </p>
              </div>
            </>
          )}
        </>
      ) : report && cls ? (
        <section className="ck-report" aria-label="Psychological triage report">
          <div className="ck-rhead">
            <span className="ck-eval mint">Triage complete</span>
            <h2>Psychological Triage Report</h2>
            <span className="ck-rmeta">
              {new Date(report.at).toUTCString().slice(17, 25)} UTC · {report.cached ? "cached offline" : "live uplink"}
            </span>
          </div>

          <div className="ck-rgrid">
            <div className="ck-ringcard">
              <RingGauge size={168} stroke={11} value={(report.total / 25) * 100} color={cls.color}>
                <span className="v">{report.total}</span>
                <span className="k">/ 25 composite</span>
              </RingGauge>
              <p className="ck-pct">{Math.round((report.total / 25) * 100)}% psychological reserve</p>
            </div>
            <div className="ck-class">
              <h3 style={{ color: cls.color }}>{cls.label}</h3>
              <p>{cls.copy}</p>
              <div className="ck-chips">
                <span className={`ck-eval ${flagged.length ? "amber" : "mint"}`}>{flagged.length ? `${flagged.length} domain(s) flagged` : "All domains nominal"}</span>
                <span className="ck-eval blue">Reviewer: dr. Mohamed Wael</span>
              </div>
            </div>
          </div>

          <div className="ck-domains">
            {QUESTIONS.map((q, i) => {
              const v = report.answers[i];
              const tone = domainTone(v);
              return (
                <div className="ck-drow" key={q.domain}>
                  <span className={`ck-qnum ${q.badge}`}>Q0{i + 1}</span>
                  <span className="dk">{q.domain}</span>
                  <span className="dl">{q.opts[v - 1].label}</span>
                  <span className="ck-dbar"><i style={{ width: `${(v / 5) * 100}%`, background: tone, boxShadow: `0 0 10px ${tone}66` }} /></span>
                  <b style={{ color: tone }}>{v}/5</b>
                </div>
              );
            })}
          </div>

          <div className="ck-notes">
            <h4>Flight surgeon notes</h4>
            <ul>
              {flagged.length ? (
                flagged.map((x) => <li key={x.q.domain}><b style={{ color: domainTone(x.v) }}>{x.q.domain}:</b> {x.q.flag}</li>)
              ) : (
                <>
                  <li><b className="mint">Composite:</b> maintain current circadian lighting schedule and 19:30 Earth-sanctuary session.</li>
                  <li><b className="mint">Crew:</b> cohesion index supports paired EVA tasking on Sol 131 qualification run.</li>
                </>
              )}
            </ul>
          </div>

          <div className="ck-actions">
            <button className="btn" onClick={review}>Review answers</button>
            <button className="btn" onClick={retake}>Retake check-in</button>
            <button className="btn" onClick={exportJSON}>Export JSON</button>
            <button className="btn primary" onClick={() => { sfx.nav(); router.push("/"); }}>Return to dashboard</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
