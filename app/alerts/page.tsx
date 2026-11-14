"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { sfx } from "@/lib/sound";
import { MessageModal } from "@/components/mind";
import { IconArrowR, IconHeart } from "@/components/icons";

export default function SmartAlerts() {
  const { offline } = useApp();
  const [message, setMessage] = useState(false);

  return (
    <div className="sa">
      <header className="sa-head">
        <span className="sa-live"><i />Predictive monitoring active // Sol 127</span>
        <h1>Smart Alerts</h1>
        <p>Early signals. Timely support.</p>
      </header>

      <article className="sa-card">
        <div className="sa-card-top">
          <span className="sa-early"><i />Early Signal</span>
          <span className="sa-core">Autonomous health core</span>
        </div>

        <div className="sa-card-body">
          <span className="sa-ic"><IconHeart size={26} /></span>
          <div className="sa-copy">
            <h2>Recovery needs attention</h2>
            <p>
              Your HRV and sleep quality have rested gently below your baseline profile for three consecutive days.
              Consider prioritizing rest and gentle cognitive offloading today.
            </p>
          </div>
          <button className="sa-link" onClick={() => { setMessage(true); sfx.open(); }}>
            <IconArrowR size={14} /> View Recovery Protocol
          </button>
        </div>
      </article>

      <p className="sa-foot">Autonomous care engine · Nominal operation mode · Mission day 127</p>

      {message && (
        <MessageModal
          onClose={() => { setMessage(false); sfx.close(); }}
          offline={offline}
          kicker="Related via EVA health camera"
          title="A message from home"
          sub="A little support from the people you miss."
        />
      )}
    </div>
  );
}
