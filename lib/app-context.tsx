"use client";

import { createContext, useContext } from "react";
import type { Telemetry } from "./telemetry";

export interface AppState {
  t: Telemetry;
  now: Date | null;
  offline: boolean;
  pushToast: (msg: string, tone?: "warn") => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppShell");
  return ctx;
}