"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/app-context";
import { Bar, BrainWave, Ecg, RingGauge, Sparkline } from "@/components/charts";
import { Hologram } from "@/components/Hologram";
import { Card } from "@/components/panels";
import {
  IconBrain, IconChart, IconDroplet, IconMoon, IconRunner, IconShield, IconStar, IconThermo,
} from "@/components/icons";

export default function Dashboard() {
  const { t, offline } = useApp();
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    const handle = () => {
      const id = window.location.hash.replace("#", "");
      if (id === "drift-card" || id === "eva-card" || id === "life-card") {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlight(id);
          setTimeout(() => setHighlight((h) => (h === id ? null : h)), 1700);
        }, 150);
      }
    };
    handle();
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);

  return (
    <>
      <h1 className="page-title">Your Health,BeyondEarth.</h1>

      <div className="grid-top">
        {/* left column */}
        <div className="col">
          <Card icon={<span className="dot" />} title="Cardiovascular" badge="Nominal" delay={60}>
            <div className="cv-row">
              <div>
                <span className="lbl">Heart Rate</span>
                <div className="big">{t.hr}<span className="unit">BPM</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="lbl">Arterial BP</span>
                <div className="big bp">{t.sys}/{t.dia}</div>
                <div className="cv-sub">mmHg (MAP {t.map})</div>
              </div>
            </div>
            <div className="ecg-wrap"><Ecg hr={t.hr} offline={offline} /></div>
          </Card>

          <Card icon={<IconThermo size={18} />} title="Core Thermal" badge="Stable" tone="blue" delay={120}>
            <div className="thermal-row">
              <div>
                <span className="big">{t.temp.toFixed(1)}</span>
                <span className="deg">°C</span>
                <span className="f">({(t.temp * 9 / 5 + 32).toFixed(2)}°F)</span>
              </div>
              <div className="delta">Δ -0.04°<br />/ SOL</div>
            </div>
            <div className="t-track">
              <span className="t-knob" style={{ left: `${((t.temp - 35.5) / (38.2 - 35.5)) * 100}%` }} />
            </div>
            <div className="t-labels">
              <span><b>35.5°</b>Hypo</span>
              <span className="target"><b>36.8°</b>Target</span>
              <span><b>38.2°</b>Hyper</span>
            </div>
          </Card>

          <Card icon={<IconMoon size={18} />} title="Circadian Rhythm" badge={`${t.sync.toFixed(1)}% Sync`} tone="violet" delay={180}>
            <div className="circ-row">
              <RingGauge size={96} stroke={8} value={t.sleepScore} color="#b6a4f7">
                <span className="v">{Math.round(t.sleepScore)}</span>
                <span className="k">Score</span>
              </RingGauge>
              <div className="stat-rows">
                <div className="stat-row"><span className="k">Last Sleep</span><span className="v">7h 42m</span></div>
                <div className="stat-row"><span className="k">Deep / REM</span><span className="v mint">1h 54m / 2h 10m</span></div>
                <div className="stat-row"><span className="k">Sleep Latency</span><span className="v mint">9 mins</span></div>
              </div>
            </div>
          </Card>
        </div>

        {/* center hologram */}
        <Hologram t={t} offline={offline} />

        {/* right column */}
        <div className="col">
          <Card icon={<IconDroplet size={18} />} title="Hydration Flux" badge="Osmolar OK" tone="blue" delay={90}>
            <div className="hyd-row">
              <div><span className="big">{t.hydration}</span><span className="pct">%</span></div>
              <div className="hyd-fuel">
                <span className="lbl">Metabolic Fuel</span>
                <div className="v">{t.fuel}%</div>
              </div>
            </div>
            <Bar value={t.hydration} />
          </Card>

          <Card icon={<IconBrain size={18} />} title="Cognitive Focus" badge="Optimal" delay={150}>
            <div className="cog-row">
              <div>
                <span className="big">{t.cognition}%</span>
                <div className="sub">Cognitive Agility</div>
              </div>
              <div className="stress">
                <span className="lbl">Stress Index</span>
                <div className="v">{t.stress}<small> /100</small></div>
              </div>
            </div>
            <div className="brain-wrap"><BrainWave offline={offline} /></div>
            <div className="cog-foot">
              <span>Mood Coherence: <b style={{ color: "var(--ink)" }}>Stable</b></span>
              <b>Delta/Theta Nom</b>
            </div>
          </Card>

          <Card icon={<IconRunner size={18} />} title="Ergometer & EVA" badge="Target Met" delay={210}>
            <div className="erg-row">
              <div>
                <span className="big">{t.steps.toLocaleString("en-US")}</span>
                <div className="sub">Steps-Eq</div>
              </div>
              <div className="erg-work">
                <div className="v">{t.microG.toFixed(1)}h</div>
                <div className="k">Micro-G Work</div>
              </div>
            </div>
            <div className="erg-cal"><span>Caloric Burn:</span><b>{t.kcal.toLocaleString("en-US")} kcal</b></div>
            <Bar value={90} />
          </Card>
        </div>
      </div>

      <div className="grid-bottom">
        <Card
          icon={<IconChart size={18} />} title="Health Drift Baseline" badge="SOL 1 vs SOL 127" tone="gray"
          id="drift-card" highlight={highlight === "drift-card"} delay={240}
        >
          <div className="drift-tiles">
            <div className="tile"><span className="lbl">Net Drift</span><div className="v mint">+3.2%</div><div className="s">Well-adapted</div></div>
            <div className="tile"><span className="lbl">Bone Mineral</span><div className="v mint">-0.02%</div><div className="s mint">In Resistance Nom</div></div>
            <div className="tile"><span className="lbl">Neuro-Vascular</span><div className="v">100%</div><div className="s">0 ICP Spikes</div></div>
          </div>
          <div className="spark-head"><span className="k">7-Day Heart Rate Rest Baseline</span><span className="v">Mean: 68.4 BPM</span></div>
          <div className="spark"><Sparkline data={[67.1, 68.0, 67.5, 68.6, 68.1, 69.0, 68.4]} /></div>
        </Card>

        <Card
          icon={<IconShield size={18} />} title="Life Support" id="life-card"
          highlight={highlight === "life-card"} delay={280} right={<span className="ls-dot" />}
        >
          <div className="ls-row">
            <div className="ls-line"><span className="k">Deep Space Radiation</span><span className="v">{t.radiation.toFixed(2)} mSv / 24h</span></div>
            <Bar value={8} />
            <div className="ls-note">Storm Shelter Shielding: 99.4% Nominal</div>
          </div>
          <div className="ls-row">
            <div className="ls-line"><span className="k">Cabin CO₂ Index</span><span className="v mint">{t.co2.toFixed(2)}% (0.6 mmHg)</span></div>
            <Bar value={12} tone="blue" />
            <div className="ls-note">CDRA Scrubber Scrub Rate: 99.8%</div>
          </div>
        </Card>

        <Card
          icon={<IconStar size={18} />} title="EVA Mission Readiness" badge="Level 1 OK"
          id="eva-card" highlight={highlight === "eva-card"} delay={320}
        >
          <div className="eva-row">
            <RingGauge size={112} stroke={9} value={t.readiness} color="#9fb2cc">
              <span className="v" style={{ fontSize: 30 }}>{Math.round(t.readiness)}</span>
              <span className="k" style={{ color: "var(--mint)" }}>Readiness</span>
            </RingGauge>
            <div className="eva-bars">
              <div className="eva-bar">
                <div className="ls-line"><span className="k">Cardio Reserve</span><span className="v">{t.cardioReserve}%</span></div>
                <Bar value={t.cardioReserve} />
              </div>
              <div className="eva-bar">
                <div className="ls-line"><span className="k">Circadian Rhythm</span><span className="v">{t.circadian}%</span></div>
                <Bar value={t.circadian} tone="blue" />
              </div>
              <div className="eva-bar">
                <div className="ls-line"><span className="k">Neuro-Vestibular</span><span className="v">{t.neuroVestibular}%</span></div>
                <Bar value={t.neuroVestibular} tone="violet" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}