"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { sfx } from "@/lib/sound";
import { Card } from "@/components/panels";
import { Bar } from "@/components/charts";
import { MarsGlobe } from "@/components/MarsGlobe";
import { DiurnalChart, TimelineChart } from "@/components/env-charts";
import {
  IconActivity, IconChart, IconFlask, IconGlobe, IconPressure, IconRadiation,
  IconSatellite, IconSun, IconSunset, IconSwirl, IconThermo, IconWind,
} from "@/components/icons";

const HAZARDS = [
  {
    n: "1", title: "Extreme Cold (-63°C)", tag: "Thermal Regulation",
    hazard: "Acute hypothermia, extremity frostbite within 90s of glove integrity loss, metabolic exhaustion.",
    stats: [["Core Body Temp", "36.8°C", "mint"], ["LCG", "1.2 L/min", "mint"]],
    note: "Glove resistance heating: Level 2 Active // Met load 180W",
  },
  {
    n: "2", title: "Near-Vacuum (610 Pa)", tag: "Pressure Integrity",
    hazard: "Body fluid ebullism at 37°C, immediate alveolar rupture, complete hypoxia within 15 seconds.",
    stats: [["Suit Pressure", "29.6 kPa", "mint"], ["Leak", "0.01 kPa/h", "mint"]],
    note: "Hyperoxic pure O₂ mix // Joint seal pressure delta: 29.0 kPa",
  },
  {
    n: "3", title: "Ionising Flux (0.42 mSv/d)", tag: "Cellular Defense",
    hazard: "Double-strand DNA breakage, radiation-induced cataracts, cumulative leukemia hazard.",
    stats: [["Dosimeter", "0.42 mSv/d", "blue"], ["Shelter", "450 m", "mint"]],
    note: "Emergency ingress transit time: 4.2 min to basalt trench",
  },
  {
    n: "4", title: "Regolith & Perchlorates", tag: "Respiratory Shield",
    hazard: "Toxic oxidant thyroid disruption from airborne perchlorates, acute silicosis from razor shards.",
    stats: [["Airlock Decon", "100% Pass", "mint"], ["HEPA", "0.01 µm", "mint"]],
    note: "Electrostatic suit repel cycle: Active // Zero cabin dust ingress",
  },
  {
    n: "5", title: "0.38G Gravity & 24.65h Sol", tag: "Musculoskeletal",
    hazard: "Trabecular bone mineral deconditioning (1% monthly), circadian desynchrony, neuro-vestibular ataxia.",
    stats: [["ARED Workout", "102%", "mint"], ["Melatonin", "0.5mg", "blue"]],
    note: "Bone resorption biomarker balance nominal // Sleep sync aligned",
  },
  {
    n: "6", title: "Sensory & Skylight Monotony", tag: "Neuro-Cognitive",
    hazard: "Cognitive drift, ‘Earth-Out-Of-View’ psychological depression, vigilance micro-slumps.",
    stats: [["Mood Index", "4.0 / 5.0", "mint"], ["Vigilance", "98%", "mint"]],
    note: "Audio-visual Earth habitat sanctuary session scheduled 19:30",
  },
];

function HazardCard({ h, delay }: { h: (typeof HAZARDS)[number]; delay: number }) {
  return (
    <article className="hazard" style={{ animationDelay: `${delay}ms` }}>
      <div className="hz-head">
        <h4>{h.n}. {h.title}</h4>
        <span>{h.tag}</span>
      </div>
      <p className="hz-body"><b>Physiological Hazard:</b> {h.hazard}</p>
      <div className="hz-stats">
        {h.stats.map(([k, v, tone]) => (
          <span key={k} className={tone}>{k}: <b>{v}</b></span>
        ))}
      </div>
      <p className="hz-note">{h.note}</p>
    </article>
  );
}

export default function Environment() {
  const { t, offline } = useApp();
  const [autorotate, setAutorotate] = useState(true);

  return (
    <div className="env">
      <div className="env-titlebar"><h1>Mars Environment</h1></div>

      <div className="env-facts">
        <span>Axial Tilt: <b>25.19°</b></span>
        <span>Sol Period: <b>24h 39m 35s</b></span>
        <span className="fact-chip blue"><i />Dist: <b>225.4M km (12.5m lag)</b></span>
        <button
          className={`fact-chip mint ${autorotate ? "on" : ""}`}
          onClick={() => { setAutorotate((a) => !a); sfx.toggle(); }}
          title="Toggle Mars autorotation"
        >
          <IconActivity size={12} />Autorotate: {autorotate ? "On" : "Off"}
        </button>
      </div>

      {/* ---------- Jezero hero ---------- */}
      <section className="card env-hero" aria-label="Jezero Crater orbital viewport">
        <div className="hero-col">
          <div className="hstat">
            <div className="hstat-t"><i className="dot-mint" />Jezero Crater <span className="badge">Primary Site</span></div>
            <p>Coordinates: <b>18.38° N, 77.58° E</b></p>
            <p>Datum Elevation: <b>-2,540 m (Basin Floor)</b></p>
          </div>
          <div className="hstat">
            <span className="lbl">Surface Temperature</span>
            <div className="hstat-v blue">-63<span>°C</span> <small>Peak: -20°C / Min: -90°C</small></div>
            <div className="hstat-rule blue" />
            <p className="dim">Thermal Lag Index: Low Inertia</p>
          </div>
          <div className="hstat">
            <span className="lbl">Ambient Atmospheric Pressure</span>
            <div className="hstat-v red">610<span>Pa</span> <small>(6.10 mbar)</small></div>
            <span className="badge red warn-badge">⚠ Armstrong Vacuum Regime</span>
          </div>
        </div>

        <div className="hero-globe">
          <MarsGlobe autorotate={autorotate} onAutorotate={setAutorotate} />
          <div className="hero-caption">Orbital Viewport // Mars Reconnaissance Orbiter Composite <i /></div>
        </div>

        <div className="hero-col">
          <div className="hstat right">
            <span className="lbl">Ionising Radiation Flux</span>
            <div className="hstat-v">{t.radiation.toFixed(2)}<span>mSv/24h</span></div>
            <p className="dim">GCR: 0.31 mSv | SPE: 0.11 mSv</p>
            <p className="blue-t"><i className="dot-blue" />Mission Cumulative: 53.4 mSv</p>
          </div>
          <div className="hstat right">
            <span className="lbl">Winds &amp; Dust Opacity</span>
            <div className="hstat-v mint">18<span>km/h</span> <small>Tau 0.62</small></div>
            <p className="dim">Vector: NNW // Gusts to 34 km/h</p>
            <p className="mint">◆ Moderate Regolith Dynamics</p>
          </div>
          <div className="hstat right">
            <span className="lbl">Habitat ECLSS Integrity</span>
            <div className="hstat-v mint">101.3<span>kPa</span></div>
            <p className="dim">Cabin Buffer: Delta-P 100.69 kPa</p>
            <p className="mint">Pressure Envelope 100% Nominal</p>
          </div>
        </div>
      </section>

      {/* ---------- planetary metrics ---------- */}
      <div className="env-section-head">
        <span className="sh-left"><IconActivity size={15} />Primary Planetary Metrics // Sol 127 Real-Time</span>
        <span className="sh-right blue-t">Jezero Weather Station MET-04</span>
      </div>

      <div className="env-metrics">
        <Card icon={<IconThermo size={18} />} title="Surface Temperature" badge="Diurnal Extremes" tone="gray" delay={40}>
          <div className="metric-top">
            <div>
              <div className="metric-v blue">-63<span>°C</span></div>
              <p className="metric-sub">Current Ambient Sensor Readout</p>
            </div>
            <div className="metric-side">
              <p className="mint">Sol High: -20°C<small>(13:15 LMST)</small></p>
              <p className="blue-t">Sol Low: -90°C<small>(05:20 LMST)</small></p>
            </div>
          </div>
          <DiurnalChart />
          <p className="metric-foot">Thermal inertia low; surface radiates heat rapidly after local twilight.</p>
        </Card>

        <Card icon={<IconPressure size={18} />} title="Atmospheric Pressure" badge="0.6% Terrestrial" tone="red" delay={80}>
          <div className="metric-top">
            <div>
              <div className="metric-v red">610<span>Pa</span></div>
              <p className="metric-sub">Surface Barometric Density: 0.015 kg/m³</p>
            </div>
            <div className="metric-side">
              <p className="dim">Earth Ref:<small>101,325 Pa</small></p>
              <p className="red-t">Delta:<small>-100,715 Pa</small></p>
            </div>
          </div>
          <div className="metric-thresh">
            <div className="mt-line"><span>Armstrong Threshold (6,300 Pa)</span><b className="red-t">Exceeded (Vacuum Risk)</b></div>
            <Bar value={9} tone="gray" />
          </div>
          <p className="metric-foot">Bodily fluids boil at normal body temperature (37°C). Zero EVA duration without pressurized suit.</p>
        </Card>

        <Card icon={<IconRadiation size={18} />} title="Radiation Dosimetry" badge="Elevated GCR" tone="gray" delay={120}>
          <div className="metric-top">
            <div>
              <div className="metric-v">{t.radiation.toFixed(2)}<span className="blue-t">mSv/d</span></div>
              <p className="metric-sub">Active Surface Dosimeter EXP-01</p>
            </div>
            <div className="metric-side">
              <p className="dim">Cumulative:<small>53.4 mSv</small></p>
              <p className="dim">Limit: 600 mSv<small>(8.9%)</small></p>
            </div>
          </div>
          <div className="metric-thresh">
            <div className="mt-line"><span>Galactic Cosmic Rays (GCR): 74%</span><span>Solar Particles (SPE): 26%</span></div>
            <div className="bar grad"><i style={{ width: "74%" }} /></div>
          </div>
          <p className="metric-foot">Magnetosphere absent. Regolith storm shelter ingress time benchmarked at 4.2 minutes.</p>
        </Card>

        <Card icon={<IconWind size={18} />} title="Dust Dynamics & Wind" badge="Storm Index: Low" delay={160}>
          <div className="metric-top">
            <div>
              <div className="metric-v mint">18<span>km/h</span></div>
              <p className="metric-sub">Bearing: NNW (330°) // Gusts: 34 km/h</p>
            </div>
            <div className="metric-side">
              <p className="mint">Tau: 0.62</p>
              <p className="dim">Visibility:<small>8.0 km</small></p>
            </div>
          </div>
          <div className="dust-devil">
            <div><span className="lbl">Local Dust Devil Probability</span><p>14% (Delta plain afternoon thermals)</p></div>
            <IconSwirl size={30} />
          </div>
        </Card>

        <Card icon={<IconFlask size={18} />} title="Atmospheric Composition" badge="Hypercapnia Risk" tone="gray" delay={200}>
          <div className="comp-tiles">
            <div className="comp red-t"><span>CO₂</span><b>95.3%</b></div>
            <div className="comp blue-t"><span>N₂</span><b>2.7%</b></div>
            <div className="comp"><span>Ar</span><b>1.6%</b></div>
          </div>
          <div className="comp-foot">
            <span>Trace: O₂ (0.13%) • CO (0.08%) • H₂O (0.03%)</span>
            <b className="mint">MOXIE: 8.2 g O₂/hr</b>
          </div>
        </Card>

        <Card icon={<IconSun size={18} />} title="Solar Flux & Diurnal Phase" badge="14:32 LMST" delay={240}>
          <div className="metric-top">
            <div>
              <div className="metric-v mint">590<span>W/m²</span></div>
              <p className="metric-sub">Insolation Peak Subsolar</p>
            </div>
            <div className="metric-side">
              <p className="mint">Array Eff: 78%</p>
              <p className="dim">Dust Obscuration:<small>4.2%</small></p>
            </div>
          </div>
          <div className="solar-foot">
            <span><IconSunset size={16} />Sunset Expected:<b>18:48 LMST</b></span>
            <span className="dim">Sol Duration:<b>24.65h</b></span>
          </div>
        </Card>
      </div>

      {/* ---------- physiological hazard analysis ---------- */}
      <div className="env-section-head">
        <span className="sh-left"><IconActivity size={15} />Human System Adaptation Module // Jezero Expedition</span>
      </div>

      <div className="hazard-intro">
        <div>
          <h2>How Mars Affects Your Body // Physiological Hazard Analysis</h2>
          <p>Direct cross-correlation between external planetary environment metrics and Commander Morgan A.&apos;s active biometric telemetry during Sol 127 EVA preparations.</p>
        </div>
        <span className="bio-chip"><i />CDR Morgan // Bio-Sync Nominal</span>
      </div>

      <div className="hazard-grid">
        <div className="hazard-col">
          {HAZARDS.slice(0, 3).map((h, i) => <HazardCard key={h.n} h={h} delay={i * 70} />)}
        </div>

        <div className="suit-stage">
          <div className="suit-glow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/eva-suit.png" alt="Commander Morgan A. in the Bio-Suit Mark V, Jezero configuration" className="suit-img" />
          <span className="suit-call sc-top"><i />HUD Retina Track: 100%</span>
          <span className="suit-call sc-left"><i />PLSS O₂: 7.8 hrs</span>
          <span className="suit-call sc-right"><i />Core Temp: {t.temp.toFixed(1)}°C</span>
          <span className="suit-call sc-bottom"><i />29.6 kPa Seal</span>
          <div className="suit-caption">CDR Morgan A. // Bio-Suit Mark V<small>(Jezero Config)</small></div>
        </div>

        <div className="hazard-col">
          {HAZARDS.slice(3).map((h, i) => <HazardCard key={h.n} h={h} delay={i * 70} />)}
        </div>
      </div>

      {/* ---------- timeline ---------- */}
      <section className="card env-timeline" aria-label="24-hour planetary telemetry timeline">
        <div className="card-head">
          <span className="ci"><IconChart size={18} /></span>
          <h3>24-Hour Planetary Telemetry Timeline</h3>
        </div>
        <p className="tl-sub">Continuous sensor feed across Sol 126 14:00 to Sol 127 14:00 LMST (Thermal, Radiation, Dust, and Barometric Tide).</p>
        <TimelineChart />
      </section>

      {/* ---------- footer ---------- */}
      <footer className="env-footer">
        <span className="ef-link"><IconSatellite size={18} /><span><b>Deep Space Network Link:</b> Goldstone 70m Dish Array // Mars Relay Orbiter</span></span>
        <span className="ef-latency"><i />Uplink Latency: <b>{offline ? "—" : "12m 34s"}</b></span>
        <span className="ef-credit">NASA Space Apps Challenge 2026 • AURORA Demo Engine • Simulated Data</span>
      </footer>
    </div>
  );
}