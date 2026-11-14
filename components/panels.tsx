"use client";

import { fmtUTC, type Telemetry } from "@/lib/telemetry";
import {
  IconActivity, IconAlertSun, IconBadge, IconBell, IconChecklist, IconClock,
  IconCompass, IconMed, IconMenu, IconMind, IconThermo, IconUser,
  IconVolume, IconVolumeX,
} from "./icons";

export type NavId =
  | "overview" | "dashboard" | "checkin" | "drift"
  | "alerts" | "environment" | "readiness" | "mind" | "offline";

export const NAV: { id: NavId; label: string; icon: (p: { size?: number }) => React.ReactNode }[] = [
  { id: "overview", label: "EVA Overview", icon: (p) => <IconCompass {...p} /> },
  { id: "dashboard", label: "My Dashboard", icon: (p) => <IconActivity {...p} /> },
  { id: "checkin", label: "Pre - EVA Checklist", icon: (p) => <IconChecklist {...p} /> },
  { id: "alerts", label: "Smart Alerts", icon: (p) => <IconAlertSun {...p} /> },
  { id: "environment", label: "Environment", icon: (p) => <IconThermo {...p} /> },
  { id: "readiness", label: "Mission Readiness", icon: (p) => <IconBadge {...p} /> },
  { id: "mind", label: "Mental Health", icon: (p) => <IconMind {...p} /> },
];

export function Header({
  now, t, offline, unread, soundOn, onSound, onAlerts, onProfile, onMenu,
}: {
  now: Date | null; t: Telemetry; offline: boolean; unread: number; soundOn: boolean;
  onSound: () => void; onAlerts: () => void; onProfile: () => void; onMenu: () => void;
}) {
  return (
    <header className="header">
      <button className="icon-btn hamburger" onClick={onMenu} aria-label="Open navigation">
        <IconMenu size={20} />
      </button>
      <div className="brand">
        <h1>AURORA</h1>
        <span>Astronaut Health Intelligence</span>
      </div>
      <div className="mission">
        <span className="m-top">Artemis Deep Space Mission</span>
        <span className="m-day">MISSION DAY: <b>SOL 127</b></span>
      </div>
      <div className="vdiv" />
      <div className="clock">
        <IconClock size={17} />
        <time dateTime={now?.toISOString()}>{fmtUTC(now)}</time>
      </div>
      <div className="header-right">
        {offline ? (
          <span className="pill cached"><span className="dot" />Cached</span>
        ) : (
          <span className="pill"><span className="dot" />Online</span>
        )}
        <span className="pill delay">Delay: <b>{offline ? "—" : `${t.delay.toFixed(1)} MS`}</b></span>
        <span className="pill med"><IconMed size={14} />Med: Nominal</span>
        <button className="icon-btn" onClick={onSound} aria-label={soundOn ? "Mute interface sound" : "Enable interface sound"} title={soundOn ? "Mute sound" : "Enable sound"}>
          {soundOn ? <IconVolume size={18} /> : <IconVolumeX size={18} />}
        </button>
        <button className="icon-btn" onClick={onAlerts} aria-label={`Open smart alerts, ${unread} unread`}>
          <IconBell size={18} />
          {unread > 0 && <span className="count">{unread}</span>}
        </button>
        <button className="avatar-btn" onClick={onProfile} aria-label="Open crew profile">
          <IconUser size={20} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

export function Sidebar({
  active, onNav, unread, offline, open,
}: {
  active: NavId; onNav: (id: NavId) => void; unread: number; offline: boolean; open: boolean;
}) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="nav-label">Telemetry Navigation</div>
      <nav className="nav" aria-label="Telemetry navigation">
        {NAV.map((n) => {
          const isActive = n.id === "offline" ? offline : active === n.id && !offline;
          return (
            <button
              key={n.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => onNav(n.id)}
              aria-current={isActive ? "page" : undefined}
              title={n.label}
            >
              {n.icon({ size: 19 })}
              <span>{n.label}</span>
              {n.id === "alerts" && unread > 0 && <span className="nav-badge">{unread}</span>}
            </button>
          );
        })}
      </nav>
      <div className="crew-card">
        <div className="cc-top">
          <span>Medical Team at NASA</span>
          <span className="online-tag"><i />Online</span>
        </div>
        <div className="crew-row">
          <span className="crew-ava"><IconUser size={21} strokeWidth={2} /></span>
          <span className="meta">
            <span className="n">dr. Mohamed Wael</span>
            <br />
            <span className="r">Your health monitor</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

export function Card({
  icon, title, badge, tone = "", id, highlight, className = "", children, delay = 0, right,
}: {
  icon?: React.ReactNode; title: string; badge?: string; tone?: "" | "blue" | "violet" | "red" | "gray";
  id?: string; highlight?: boolean; className?: string; children: React.ReactNode; delay?: number; right?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`card ${className} ${highlight ? "highlight" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-label={title}
    >
      <div className="card-head">
        {icon && <span className="ci">{icon}</span>}
        <h3>{title}</h3>
        {badge && <span className={`badge ${tone}`}>{badge}</span>}
        {right && <span style={{ marginLeft: "auto", display: "flex" }}>{right}</span>}
      </div>
      {children}
    </section>
  );
}
