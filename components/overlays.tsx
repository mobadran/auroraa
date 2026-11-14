"use client";

import { IconCheck, IconUser, IconWarn } from "./icons";

/* ---------------- Profile ---------------- */
export function ProfilePopover({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="scrim" style={{ background: "transparent", backdropFilter: "none" }} onClick={onClose} />
      <div className="popover" role="dialog" aria-label="Crew profile">
        <div className="p-row">
          <span className="crew-ava"><IconUser size={21} strokeWidth={2} /></span>
          <span>
            <span className="n">CDR Morgan A.</span>
            <br />
            <span className="r">Mission Commander</span>
          </span>
        </div>
        <div className="p-stats">
          <div><span className="k">Crew ID</span><span className="v">AUR-01</span></div>
          <div><span className="k">Avatar</span><span className="v">MORGAN_A</span></div>
          <div><span className="k">Mission day</span><span className="v">SOL 127</span></div>
          <div><span className="k">Next check-in</span><span className="v">SOL 128 · 06:00</span></div>
          <div><span className="k">Flight surgeon</span><span className="v">dr. M. Wael</span></div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Toasts ---------------- */
export interface Toast { id: number; msg: string; tone?: "warn" }
export function Toasts({ items }: { items: Toast[] }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.tone ?? ""}`}>
          {t.tone === "warn" ? <IconWarn size={17} /> : <IconCheck size={17} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
