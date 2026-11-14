"use client";

import { useEffect, useRef, useState } from "react";

export interface Telemetry {
  hr: number;
  sys: number;
  dia: number;
  map: number;
  temp: number;
  hydration: number;
  fuel: number;
  cognition: number;
  stress: number;
  steps: number;
  microG: number;
  kcal: number;
  delay: number;
  spo2: number;
  lactate: number;
  theta: number;
  neuralLatency: number;
  stroke: number;
  radiation: number;
  co2: number;
  cardioReserve: number;
  circadian: number;
  neuroVestibular: number;
  readiness: number;
  sleepScore: number;
  sync: number;
}

const BASE: Telemetry = {
  hr: 73, sys: 118, dia: 76, map: 90, temp: 36.8,
  hydration: 82, fuel: 91, cognition: 96, stress: 14,
  steps: 8420, microG: 1.4, kcal: 2750, delay: 14.2,
  spo2: 99.2, lactate: 1.1, theta: 94, neuralLatency: 12, stroke: 78,
  radiation: 0.42, co2: 0.08,
  cardioReserve: 96, circadian: 91, neuroVestibular: 97, readiness: 94,
  sleepScore: 86, sync: 94.2,
};

const jitter = (v: number, amt: number, min: number, max: number, dp = 0) => {
  const next = v + (Math.random() - 0.5) * 2 * amt;
  return Number(Math.min(max, Math.max(min, next)).toFixed(dp));
};

export function useTelemetry(offline: boolean) {
  const [t, setT] = useState<Telemetry>(BASE);
  const [now, setNow] = useState<Date | null>(null);
  const offRef = useRef(offline);
  offRef.current = offline;

  useEffect(() => {
    setNow(new Date());
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (offRef.current) return;
      setT((p) => {
        const hr = jitter(p.hr, 1.4, 68, 78);
        const sys = jitter(p.sys, 1.2, 114, 122);
        const dia = jitter(p.dia, 1, 72, 80);
        const steps = p.steps + Math.floor(Math.random() * 4);
        return {
          ...p,
          hr, sys, dia,
          map: Math.round((sys + 2 * dia) / 3),
          temp: jitter(p.temp, 0.03, 36.6, 37.0, 1),
          hydration: jitter(p.hydration, 0.3, 80, 84, 0),
          fuel: jitter(p.fuel, 0.2, 90, 92, 0),
          cognition: jitter(p.cognition, 0.4, 94, 98, 0),
          stress: jitter(p.stress, 0.8, 11, 17, 0),
          steps,
          kcal: 2750 + Math.floor((steps - 8420) * 0.32),
          delay: jitter(p.delay, 1.1, 11.5, 18.5, 1),
          spo2: jitter(p.spo2, 0.1, 98.6, 99.6, 1),
          lactate: jitter(p.lactate, 0.05, 0.9, 1.3, 1),
          theta: jitter(p.theta, 0.5, 92, 96, 0),
          neuralLatency: jitter(p.neuralLatency, 1, 9, 15, 0),
          stroke: jitter(p.stroke, 1, 75, 81, 0),
          radiation: jitter(p.radiation, 0.01, 0.38, 0.46, 2),
          co2: jitter(p.co2, 0.005, 0.06, 0.1, 2),
          cardioReserve: jitter(p.cardioReserve, 0.3, 95, 97, 0),
          circadian: jitter(p.circadian, 0.3, 90, 92, 0),
          neuroVestibular: jitter(p.neuroVestibular, 0.3, 96, 98, 0),
          readiness: jitter(p.readiness, 0.2, 93, 95, 0),
          sleepScore: jitter(p.sleepScore, 0.2, 85, 87, 0),
          sync: jitter(p.sync, 0.1, 93.8, 94.6, 1),
        };
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return { t, now };
}

export interface AlertItem {
  id: string;
  sev: "warn" | "info" | "crit";
  title: string;
  body: string;
  time: string;
  ack: boolean;
}

export const SEED_ALERTS: AlertItem[] = [
  {
    id: "a1", sev: "warn", time: "14:31 UTC",
    title: "Circadian phase drift detected",
    body: "Melatonin onset shifted +22 min against Sol 127 light schedule. Recommend 40 lux blue-enriched exposure at 06:00 ship time.",
    ack: false,
  },
  {
    id: "a2", sev: "info", time: "13:58 UTC",
    title: "T2 ergometer session scheduled",
    body: "Resistive exercise block begins in 45 min. Calf muscle tone protocol loaded — target 78% 1RM, 4 sets.",
    ack: false,
  },
  {
    id: "a3", sev: "warn", time: "12:44 UTC",
    title: "Hydration flux trending low",
    body: "Osmolar intake 6% below target over last 8 h. Dispense 250 mL electrolyte bolus at next meal window.",
    ack: false,
  },
  {
    id: "a4", sev: "info", time: "11:02 UTC",
    title: "CDRA scrubber cycle complete",
    body: "Cabin CO₂ partial pressure held at 0.6 mmHg through regeneration cycle. Scrub rate nominal at 99.8%.",
    ack: true,
  },
];

export const MISSION_OBJECTIVES = [
  { k: "Deep-space EVA qualification", v: 92 },
  { k: "Bone-density resistance protocol", v: 78 },
  { k: "Circadian entrainment study", v: 84 },
  { k: "Cardiac atrophy countermeasures", v: 96 },
  { k: "Radiation dosimetry mapping", v: 67 },
];

export const fmtUTC = (d: Date | null) =>
  d
    ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")} UTC`
    : "--:--:-- UTC";