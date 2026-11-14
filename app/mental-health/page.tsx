"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { sfx } from "@/lib/sound";
import { Card } from "@/components/panels";
import { BreathingModal, MessageModal, NeuralSilhouette, PingModal, TrajectoryChart } from "@/components/mind";
import {
  IconArrowR, IconBulb, IconChat, IconInfo, IconLock, IconMind, IconPlay,
  IconSatellite, IconShield, IconUser, IconWind,
} from "@/components/icons";

type Scores = { mood: number; stress: number; energy: number; social: number };
const DEFAULT_SCORES: Scores = { mood: 4, stress: 2, energy: 3, social: 3 };
const STORE_KEY = "aurora.checkin.v1";

const DESC: Record<keyof Scores, string[]> = {
  mood: ["Heavy / Gloomy", "Subdued", "Equilibrium", "Receptive & Steady", "Peak Resonance"],
  stress: ["Deep Zen Calm", "Controlled & Mild", "Manageable", "High Friction", "Overload Alert"],
  energy: ["Depleted", "Sluggish Phase", "Moderate / Recharging", "Vigorous Output", "Peak Electrical"],
  social: ["Isolated Orbit", "Distant Sync", "Isolated Orbit Baseline", "High Synergy", "Interlocking Mesh"],
};
const METRICS: { key: keyof Scores; label: string; color: string }[] = [
  { key: "mood", label: "Mood", color: "#4cc3ff" },
  { key: "stress", label: "Stress", color: "#b6a4f7" },
  { key: "energy", label: "Energy", color: "#2ef2ae" },
  { key: "social", label: "Social Connection", color: "#7dd8ff" },
];

function readScores(): { scores: Scores; synced: boolean } {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const a = (JSON.parse(raw) as { answers?: (number | null)[] }).answers;
      if (Array.isArray(a) && a.length === 5 && a.every((v) => typeof v === "number" && v >= 1 && v <= 5)) {
        return { scores: { mood: a[0]!, stress: 6 - a[1]!, energy: a[2]!, social: a[3]! }, synced: true };
      }
    }
  } catch {}
  return { scores: DEFAULT_SCORES, synced: false };
}

function classify(s: Scores) {
  const w = s.mood + (6 - s.stress) + s.energy + s.social;
  if (w >= 13) return { label: "STABLE", chip: "HOMEOSTASIS", color: "#2ef2ae" };
  if (w >= 9) return { label: "WATCHFUL", chip: "REBALANCING", color: "#ffb454" };
  return { label: "SUPPORT", chip: "PRIORITY CARE", color: "#ff5d6c" };
}

type Modal = null | "breath" | "message" | "ping";

export default function MentalHealth() {
  const { t, offline, pushToast } = useApp();
  const router = useRouter();
  const [{ scores, synced }, setScores] = useState<{ scores: Scores; synced: boolean }>({ scores: DEFAULT_SCORES, synced: false });
  const [modal, setModal] = useState<Modal>(null);

  useEffect(() => {
    const update = () => setScores(readScores());
    update();
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("focus", update); window.removeEventListener("storage", update); };
  }, []);

  const cls = classify(scores);
  const open = (m: Modal) => { setModal(m); sfx.open(); };
  const close = useCallback(() => { setModal(null); sfx.close(); }, []);

  return (
    <div className="mh">
      <div className="mh-hero">
        <div className="mh-hero-l">
          <span className="mh-pill"><i />Wellbeing synthesis active // Sol 127 // Autonomous care core</span>
          <h1>YOUR MIND <em>MATTERS</em></h1>
          <p>Your emotional wellbeing is part of your mission health.</p>
        </div>
        <div className="mh-hero-r">
          <span className="mh-delay"><IconSatellite size={16} />Deep space delay: <b>12m 44s</b></span>
          <span className="mh-hab">Orbital habitat pod 03 • ambient pressure nominal</span>
        </div>
      </div>

      <div className="mh-top">
        <Card icon={<IconMind size={18} />} title="Cognitive Harmony Silhouette" badge="Axial projection" tone="gray" className="mh-silcard" delay={60}>
          <NeuralSilhouette offline={offline} />
          <div className="mh-silfoot">
            <span className="mh-coh"><i />Neural coherence: <b>{t.cognition.toFixed(1)}%</b></span>
            <span className="mh-dmn">Autonomous DMN equilibrium active</span>
          </div>
        </Card>

        <Card title="State Synthesis" className="mh-state" delay={120}
          right={<span className="mh-freq">Check-in frequency</span>}>
          <div className="mh-statusrow">
            <span className="mh-status" style={{ color: cls.color }}>
              <i style={{ background: cls.color, boxShadow: `0 0 12px ${cls.color}` }} />{cls.label}
            </span>
            <span className="mh-homeo" style={{ color: cls.color, borderColor: `${cls.color}55`, background: `${cls.color}14` }}>{cls.chip}</span>
            <span className="mh-sol">Sol 127 •<br />morning rotation</span>
          </div>

          <div className="mh-metrics">
            {METRICS.map((m) => (
              <div className="mh-metric" key={m.key}>
                <div className="mh-mrow">
                  <span className="mh-mlabel" style={{ color: m.color }}>{m.label}</span>
                  <span className="mh-mdesc">· {DESC[m.key][scores[m.key] - 1]}</span>
                  <span className="mh-mval"><b>{scores[m.key]}</b> / 5</span>
                </div>
                <div className="mh-segs" role="img" aria-label={`${m.label} ${scores[m.key]} of 5`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className={i <= scores[m.key] ? "fill" : ""}
                      style={i <= scores[m.key] ? { background: m.color, boxShadow: `0 0 8px ${m.color}66` } : undefined} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mh-statefoot">
            <span className="mh-sim"><IconShield size={14} />{synced ? "Synced from your Sol 127 check-in" : "Simulated self-reported metrics • updated 08:30 UTC"}</span>
            <button className="btn sm" onClick={() => { sfx.nav(); router.push("/checkin"); }}>
              Log check-in <IconArrowR size={13} />
            </button>
          </div>
        </Card>
      </div>

      <section className="card mh-traj" style={{ animationDelay: "180ms" }} aria-label="Understanding your patterns">
        <div className="mh-trajhead">
          <div>
            <span className="mh-k">Temporal trajectory</span>
            <h2>Understanding Your Patterns</h2>
          </div>
          <div className="mh-trajkeys">
            <span className="mh-key"><i className="solid" />Self-reported check-ins</span>
            <span className="mh-key"><i className="dashed" />Passive biometric correlates / sensor-derived indicators</span>
          </div>
        </div>
        <TrajectoryChart />
        <div className="mh-note">
          <span className="mh-note-ic"><IconBulb size={18} /></span>
          <div>
            <h4>Trajectory Pattern Note</h4>
            <p>Your energy and social connection have gradually decreased over the past few days. This is completely standard following heavy EVA orbital maintenance rotations.</p>
          </div>
          <button className="btn sm" onClick={() => { sfx.nav(); router.push("/#drift-card"); }}>View detailed drift</button>
        </div>
        <p className="mh-disclaim"><IconInfo size={13} />This observation reflects gradual telemetry and check-in trends, not a psychological diagnosis or clinical assessment.</p>
      </section>

      <section className="card mh-support" style={{ animationDelay: "240ms" }} aria-label="You are not alone">
        <h2>You Are Not Alone</h2>
        <p className="mh-support-sub">Even across 225 million kilometers, personal connection remains your strongest tether.</p>
        <div className="mh-support-grid">
          <div className="mh-video">
            <button className="mh-vstage" onClick={() => open("message")} aria-label="Play message from Elena and Leo, 45 seconds">
              <img src="/houston-message.jpg" alt="Elena and Leo holding tomato seedlings in their sunlit kitchen" />
              <span className="mh-vshade" aria-hidden="true" />
              <span className="mh-vchip tl"><i />Houston ground sync • arrived Sol 127</span>
              <span className="mh-vchip tr">00:45</span>
              <span className="mh-vplay"><IconPlay size={22} /></span>
            </button>
            <div className="mh-vinfo">
              <div>
                <h4>Elena &amp; Leo — Houston Ground Sync</h4>
                <p>Leo recorded a quick update on your greenhouse seedlings.</p>
              </div>
              <button className="btn primary sm" onClick={() => open("message")}>
                <IconPlay size={13} /> Play message (00:45)
              </button>
            </div>
          </div>

          <div className="mh-support-col">
            <div className="mh-spanel">
              <span className="mh-sicon"><IconWind size={20} /></span>
              <h3>Take a 5-minute breathing break</h3>
              <p>Autonomous 4-7-8 parasympathetic resonance protocol designed to lower microgravity heart-rate variance drift.</p>
              <div className="mh-sfoot">
                <span>Guided audio &amp; haptic pacing</span>
                <button className="btn sm" onClick={() => open("breath")}>Begin exercise <IconArrowR size={13} /></button>
              </div>
            </div>
            <div className="mh-spanel">
              <span className="mh-sicon blue"><IconChat size={20} /></span>
              <h3>Connect with a crew member</h3>
              <p>Send an informal, unmonitored ping to Flight Specialist Dr. Maya Chen in Hab Module B for coffee or a quiet orbital walk.</p>
              <div className="mh-sfoot">
                <span className="mh-crewmini"><IconUser size={14} />Maya Chen · Hab B</span>
                <button className="btn sm" onClick={() => open("ping")}>Send a ping <IconArrowR size={13} /></button>
              </div>
            </div>
          </div>
        </div>
        <p className="mh-lock"><IconLock size={13} />All support options are 100% voluntary, confidential, and encrypted in your local orbital locker.</p>
      </section>

      {modal === "breath" && <BreathingModal onClose={close} />}
      {modal === "message" && <MessageModal onClose={close} offline={offline} />}
      {modal === "ping" && <PingModal onClose={close} offline={offline} pushToast={pushToast} />}
    </div>
  );
}