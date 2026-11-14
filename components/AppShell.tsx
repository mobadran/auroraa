"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "@/lib/app-context";
import { SEED_ALERTS, useTelemetry } from "@/lib/telemetry";
import { setSoundEnabled, sfx } from "@/lib/sound";
import { Header, Sidebar, type NavId } from "@/components/panels";
import { ProfilePopover, Toasts, type Toast } from "@/components/overlays";
import { IconWarn } from "@/components/icons";

const navFor = (p: string): NavId =>
  p === "/environment" ? "environment"
    : p === "/checkin" ? "checkin"
      : p === "/mental-health" ? "mind"
        : p === "/alerts" ? "alerts"
          : p === "/eva-overview" ? "overview"
            : "dashboard";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [offline, setOffline] = useState(false);
  const [active, setActive] = useState<NavId>(navFor(pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const { t, now } = useTelemetry(offline);
  const toastId = useRef(0);

  const unread = SEED_ALERTS.filter((a) => !a.ack).length;

  useEffect(() => { setSoundEnabled(true); }, []);
  useEffect(() => {
    setActive(navFor(pathname));
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const pushToast = useCallback((msg: string, tone?: "warn") => {
    const id = ++toastId.current;
    setToasts((p) => [...p, { id, msg, tone }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4200);
  }, []);

  const toggleOffline = useCallback(() => {
    setOffline((o) => {
      const next = !o;
      if (next) { sfx.warn(); pushToast("Offline mode — telemetry frozen at last cached frame", "warn"); }
      else { sfx.success(); pushToast("Uplink restored — live telemetry resumed"); }
      return next;
    });
  }, [pushToast]);

  const onNav = useCallback((id: NavId) => {
    sfx.nav();
    setMenuOpen(false);
    switch (id) {
      case "dashboard":
        setActive("dashboard");
        if (pathname !== "/") router.push("/");
        else window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "overview":
        setActive("overview");
        if (pathname !== "/eva-overview") router.push("/eva-overview");
        else window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "environment":
        setActive("environment");
        if (pathname !== "/environment") router.push("/environment");
        else window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "checkin":
        setActive("checkin");
        if (pathname !== "/checkin") router.push("/checkin");
        else window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "mind":
        setActive("mind");
        if (pathname !== "/mental-health") router.push("/mental-health");
        else window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "alerts":
        setActive("alerts");
        if (pathname !== "/alerts") router.push("/alerts");
        else window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "readiness":
        setActive("readiness");
        if (pathname !== "/") router.push("/#eva-card");
        else window.location.hash = "eva-card";
        break;
      case "offline": toggleOffline(); break;
      default: break;
    }
  }, [pathname, router, toggleOffline]);

  const onSound = useCallback(() => {
    setSoundOn((s) => {
      const next = !s;
      setSoundEnabled(next);
      if (next) sfx.toggle();
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ t, now, offline, pushToast }}>
      <div className="ambient" aria-hidden="true" />
      <Header
        now={now} t={t} offline={offline} unread={unread} soundOn={soundOn}
        onSound={onSound}
        onAlerts={() => { setActive("alerts"); router.push("/alerts"); sfx.open(); }}
        onProfile={() => { setProfileOpen(true); sfx.open(); }}
        onMenu={() => setMenuOpen((o) => !o)}
      />
      <Sidebar active={active} onNav={onNav} unread={unread} offline={offline} open={menuOpen} />
      {menuOpen && <div className="scrim" style={{ zIndex: 45 }} onClick={() => setMenuOpen(false)} />}

      <main className="main">
        {offline && (
          <div className="offline-banner" role="status">
            <IconWarn size={17} />
            OFFLINE MODE — DISPLAYING CACHED TELEMETRY · LAST SYNC 14:38:22 UTC
            <button onClick={toggleOffline}>Reconnect uplink</button>
          </div>
        )}
        {children}
      </main>

      {profileOpen && <ProfilePopover onClose={() => { setProfileOpen(false); sfx.close(); }} />}

      <Toasts items={toasts} />
    </AppContext.Provider>
  );
}
