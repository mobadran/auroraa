"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { sfx } from "@/lib/sound";
import {
  IconArrowR, IconChecklist, IconClock, IconDroplet, IconLock, IconMed,
  IconMind, IconMoon, IconSatellite, IconSync, IconWarn,
} from "@/components/icons";

const GATES = [
  {
    icon: <IconMed size={20} />,
    title: ["Recovery", "Status"],
    state: "Below Baseline",
    tone: "crit",
    copy: "HRV has remained 18% below personal baseline for 3 consecutive flight days.",
    readout: "RMSSD Readout",
    value: "28 ms",
    pct: 38,
    left: "Nominal: 46 ms",
    right: "Parasympathetic Lag",
  },
  {
    icon: <IconMoon size={20} />,
    title: ["Sleep", "Quality"],
    state: "Insufficient Recovery",
    tone: "crit",
    copy: "Sleep quality has remained 22% below personal baseline due to habitat environmental variance.",
    readout: "REM Shortfall",
    value: "-2.4 h",
    pct: 46,
    left: "Acoustic Spike: 64 dB",
    right: "Quarters Reg 03",
  },
  {
    icon: <IconMind size={20} />,
    title: ["Mental", "Wellbeing"],
    state: "Assessment Required",
    tone: "violet",
    copy: "A recent mental wellbeing check-in is needed before eligibility can be reassessed by automated agents.",
    readout: "Sync Telemetry",
    value: "Pending",
    pct: 0,
    left: "Sol 127 Evening Sync",
    right: "Voice Biomarkers 7",
  },
];

const STEPS = [
  { n: "01", k: "Neuro-Cardiac Reset", t: "Complete the personalized recovery protocol", tone: "mint" },
  { n: "02", k: "Cognitive Sync", t: "Complete mental wellbeing check-in", tone: "violet" },
  { n: "03", k: "Hardware Sensors", t: "Collect updated sensor telemetry", tone: "dim" },
  { n: "04", k: "Sortie Gate Review", t: "Repeat EVA health eligibility assessment", tone: "dim" },
];

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

export default function EvaOverview() {
  const router = useRouter();
  const { pushToast, offline } = useApp();
  const [left, setLeft] = useState(12 * 3600 - 13);

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = left / 3600;
  const mm = (left % 3600) / 60;
  const ss = left % 60;

  return (
    <div className="ev">
      <section className="ev-banner" aria-label="EVA eligibility status">
        <div className="ev-lock">
          <IconLock size={34} strokeWidth={1.6} />
        </div>
        <div className="ev-banner-txt">
          <div className="ev-tags">
            <span className="ev-restricted">Restricted Disposition</span>
            <span className="ev-interlock">Sortie Interlock Active</span>
          </div>
          <h1>Not Eligible for EVA</h1>
          <p>
            Your current physiological status does not meet the established sortie readiness envelope.
            Egress airlock lockouts are armed pending clinical remediation.
          </p>
        </div>
      </section>

      <div className="ev-sechead">
        <span className="ev-secicon"><IconChecklist size={17} /></span>
        <h2>Clinical Gate Diagnostics</h2>
        <span className="ev-deltas">3 Active Critical Deltas</span>
      </div>

      <div className="ev-gates">
        {GATES.map((g, i) => (
          <article className="ev-gate" key={g.state} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="ev-gate-head">
              <span className={`ev-gate-ic ${g.tone}`}>{g.icon}</span>
              <h3>{g.title.map((l) => <span key={l}>{l}</span>)}</h3>
              <span className={`ev-state ${g.tone}`}>{g.state}</span>
            </div>
            <p>{g.copy}</p>
            <div className="ev-readout">
              <span className="k">{g.readout}</span>
              <span className={`v ${g.tone}`}>{g.value}</span>
            </div>
            <div className={`ev-bar ${g.tone}`} role="img" aria-label={`${g.readout} ${g.value}`}>
              <i style={{ width: `${g.pct}%` }} />
            </div>
            <div className="ev-barcaps">
              <span>{g.left}</span>
              <span>{g.right}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="ev-lower">
        <section className="ev-rem" aria-label="Remediation flight path">
          <div className="ev-rem-head">
            <span className="ev-secicon"><IconSync size={17} /></span>
            <h2>What Happens Next? // Remediation Flightpath</h2>
            <span className="ev-opt">Remedial Path Optimized</span>
          </div>

          <div className="ev-steps">
            <div className="ev-step">
              <div className="ev-step-top">
                <span className="ev-num mint">{STEPS[0].n}</span>
                <span className="ev-step-k">{STEPS[0].k}</span>
              </div>
              <h4>{STEPS[0].t}</h4>
              <button
                className="ev-act mint"
                onClick={() => { sfx.nav(); pushToast("Recovery protocol loaded — 40 min neuro-cardiac block"); router.push("/mental-health"); }}
              >
                Open 40-min protocol <IconArrowR size={15} />
              </button>
            </div>

            <div className="ev-step">
              <div className="ev-step-top">
                <span className="ev-num violet">{STEPS[1].n}</span>
                <span className="ev-step-k">{STEPS[1].k}</span>
              </div>
              <h4>{STEPS[1].t}</h4>
              <button className="ev-act blue" onClick={() => { sfx.nav(); router.push("/checkin"); }}>
                Begin Sol 127 check-in <IconDroplet size={15} />
              </button>
            </div>

            <div className="ev-step">
              <div className="ev-step-top">
                <span className="ev-num">{STEPS[2].n}</span>
                <span className="ev-step-k">{STEPS[2].k}</span>
              </div>
              <h4>{STEPS[2].t}</h4>
              <div className="ev-rowstat">
                <span className="ev-live"><i />Bio-sync continuous</span>
                <b>99.8% RX</b>
              </div>
            </div>

            <div className="ev-step">
              <div className="ev-step-top">
                <span className="ev-num">{STEPS[3].n}</span>
                <span className="ev-step-k">{STEPS[3].k}</span>
              </div>
              <h4>{STEPS[3].t}</h4>
              <div className="ev-rowstat">
                <span className="ev-sched">Scheduled post-sync</span>
                <IconClock size={15} />
              </div>
            </div>
          </div>
        </section>

        <aside className="ev-reeval" aria-label="Re-evaluation gate">
          <div className="ev-reeval-head">
            <h3>Re-evaluation Gate</h3>
            <IconClock size={18} />
          </div>
          <h2>Next Review: In 12 Hours</h2>

          <div className="ev-tminus">
            <div className="ev-tminus-head">
              <span>Sortie re-computation T-minus</span>
              <span className="ev-tval">T - {pad(hh)}:{pad(mm)}:{pad(ss)}</span>
            </div>
            <div className="ev-clock">
              <div><b>{pad(hh)}</b><span>Hours</span></div>
              <div><b>{pad(mm)}</b><span>Mins</span></div>
              <div><b className="mint">{pad(ss)}</b><span>Secs</span></div>
            </div>
            <div className="ev-target">
              <span>Target timestamp</span>
              <b>Sol 128 / 02:30:00 UTC</b>
            </div>
          </div>

          <div className="ev-reeval-foot">
            <span className="ev-armed"><i />Auto-computation armed</span>
            <button
              className="ev-override"
              onClick={() => pushToast(offline ? "Override request cached — transmits on next uplink" : "Override request sent to flight surgeon", offline ? "warn" : undefined)}
            >
              Override request
            </button>
          </div>
        </aside>
      </div>

      <p className="ev-disclaim">
        <IconWarn size={13} /> Gate status is generated by the autonomous care core and reviewed by dr. Mohamed Wael before any sortie release.
        <span className="ev-sat"><IconSatellite size={12} /> Deep space delay 12m 44s</span>
      </p>
    </div>
  );
}
