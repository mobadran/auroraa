"use client";

interface P {
  size?: number;
  strokeWidth?: number;
}

const base = (size = 18, strokeWidth = 1.8) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconCompass = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
);
export const IconActivity = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M3 12h4l2.5-7 4 14 2.5-7h5" /></svg>
);
export const IconChecklist = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="4" y="3" width="16" height="18" rx="2.5" /><path d="m8.5 12 2.3 2.3 4.7-4.8" /><path d="M8.5 7.5h7" /></svg>
);
export const IconTrend = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M3 17l5.5-5.5 3.5 3.5L21 6" /><path d="M15 6h6v6" /></svg>
);
export const IconAlertSun = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" /></svg>
);
export const IconThermo = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M10 13.6V4a2 2 0 0 1 4 0v9.6a4.5 4.5 0 1 1-4 0z" /><circle cx="12" cy="17.5" r="1.6" fill="currentColor" stroke="none" /></svg>
);
export const IconBadge = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 2.8 14.4 5h3.4v3.4L20.2 11l-2.4 2.6v3.4h-3.4L12 19.4 9.6 17H6.2v-3.4L3.8 11l2.4-2.6V5h3.4z" /><path d="m9.3 11.2 1.9 1.9 3.6-3.7" /></svg>
);
export const IconWifiOff = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M2 2l20 20" /><path d="M8.5 16.4a5 5 0 0 1 5.4-1M5 12.9a9.5 9.5 0 0 1 3.2-2.1M12 4.5c3.9 0 7.4 1.6 9.9 4.2M2.1 8.7A14 14 0 0 1 6 5.9" /><circle cx="12" cy="19.5" r="1.1" fill="currentColor" stroke="none" /></svg>
);
export const IconClock = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></svg>
);
export const IconBell = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9z" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></svg>
);
export const IconUser = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></svg>
);
export const IconVolume = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M11 5 6.5 9H3v6h3.5L11 19z" /><path d="M15 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></svg>
);
export const IconVolumeX = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M11 5 6.5 9H3v6h3.5L11 19z" /><path d="m16 9.5 5 5M21 9.5l-5 5" /></svg>
);
export const IconDroplet = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 3s6.5 6.6 6.5 11a6.5 6.5 0 0 1-13 0C5.5 9.6 12 3 12 3z" /><path d="M9.5 14a2.6 2.6 0 0 0 2.5 2.7" /></svg>
);
export const IconBrain = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M9.5 3.5A2.8 2.8 0 0 0 6.7 6.3 3.1 3.1 0 0 0 4.5 9.3c0 .6.1 1.1.4 1.6A3.4 3.4 0 0 0 4 13.6a3.3 3.3 0 0 0 2.6 3.2A3 3 0 0 0 9.5 20c1 0 1.8-.4 2.5-1.1V6.4a2.9 2.9 0 0 0-2.5-2.9z" /><path d="M14.5 3.5a2.8 2.8 0 0 1 2.8 2.8 3.1 3.1 0 0 1 2.2 3c0 .6-.1 1.1-.4 1.6.6.7.9 1.6.9 2.7a3.3 3.3 0 0 1-2.6 3.2A3 3 0 0 1 14.5 20c-1 0-1.8-.4-2.5-1.1" /><path d="M12 6.5v12" /></svg>
);
export const IconRunner = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="14.5" cy="4.5" r="1.9" /><path d="M13 8.5 9.5 10l-1 4" /><path d="M13 8.5c1.5 1 2.6 2.4 3 4l3 1.5" /><path d="M12.5 13.5 10 17l-3.5 4" /><path d="M12.5 13.5c1.2 1.4 2 3 2.3 5l.7 3" /></svg>
);
export const IconMoon = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5z" /></svg>
);
export const IconShield = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 2.8 19.5 6v5.5c0 4.8-3.2 8.3-7.5 9.7-4.3-1.4-7.5-4.9-7.5-9.7V6z" /></svg>
);
export const IconStar = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="m12 3 2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7z" /></svg>
);
export const IconChart = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M4 4v16h16" /><path d="m7 14 3.5-4 3 2.5L18 7" /></svg>
);
export const IconMed = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="3.5" y="7" width="17" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /><path d="M12 11v5M9.5 13.5h5" /></svg>
);
export const IconX = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconCheck = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="m4.5 12.5 5 5 10-11" /></svg>
);
export const IconSync = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M20 12a8 8 0 0 1-14.2 5M4 12a8 8 0 0 1 14.2-5" /><path d="M18.5 3v4h-4M5.5 21v-4h4" /></svg>
);
export const IconMenu = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconWarn = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 3.5 22 20H2z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" /></svg>
);
export const IconInfo = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" /></svg>
);
export const IconSend = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M21 3 10.5 13.5" /><path d="M21 3 14 21l-3.5-7.5L3 10z" /></svg>
);
export const IconWind = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h16a3 3 0 1 1-3 3" /><path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5" /></svg>
);
export const IconSun = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" /></svg>
);
export const IconGlobe = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>
);
export const IconRadiation = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" /><path d="M12 10.2 9.2 5.4M12 10.2l2.8-4.8M10.4 13l-5.2 1.6M13.6 13l5.2 1.6M12 13.8V19" /></svg>
);
export const IconFlask = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7.5 15h9" /></svg>
);
export const IconSatellite = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="m9 7 4-4 4 4-4 4z" /><path d="m5 11 4-4M13 15l4-4" /><path d="m3 13 4-4 4 4-4 4z" /><path d="m13 17 4-4 4 4-4 4z" /><path d="M11 13l2 2" /></svg>
);
export const IconSunset = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M3 18h18M6 14a6 6 0 0 1 12 0" /><path d="M12 3v4M4.9 7.9l1.4 1.4M19.1 7.9l-1.4 1.4M2 21h20" /></svg>
);
export const IconSwirl = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 12a2 2 0 0 1 2 2 3 3 0 0 1-3 3 4.5 4.5 0 0 1-4.5-4.5A6 6 0 0 1 12.5 6 7.5 7.5 0 0 1 20 13.5" /><path d="M12 12a2 2 0 0 0-2-2" /></svg>
);
export const IconPressure = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="M12 12l4-3" /><path d="M7 16a6 6 0 0 1 10-8" /></svg>
);
export const IconSlidersV = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M7 4v16M17 4v16M12 4v16" /><rect x="5" y="8" width="4" height="4" rx="1" /><rect x="15" y="12" width="4" height="4" rx="1" /><rect x="10" y="6" width="4" height="4" rx="1" /></svg>
);
export const IconFrown = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="M8.7 15.5a4.4 4.4 0 0 1 6.6 0" /><path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.4} /></svg>
);
export const IconScales = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 4v16M8 20h8M4 7h16" /><path d="M6 7l-2.6 5.4a3 3 0 0 0 5.2 0L6 7zM18 7l-2.6 5.4a3 3 0 0 0 5.2 0L18 7z" /></svg>
);
export const IconSmile = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4.4 4.4 0 0 0 7 0" /><path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.4} /></svg>
);
export const IconSparkles = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8z" /><path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" /></svg>
);
export const IconPower = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 3v8" /><path d="M6.3 6.5a8 8 0 1 0 11.4 0" /></svg>
);
export const IconDots = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" /><circle cx="14" cy="6.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="17.5" cy="11" r="1.4" fill="currentColor" stroke="none" /><circle cx="10.5" cy="12.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="6.5" cy="14.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="14.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="9.5" cy="18" r="1.4" fill="currentColor" stroke="none" /></svg>
);
export const IconSprout = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 21v-8" /><path d="M12 13c0-4 3-7 7-7 0 4-3 7-7 7zM12 11C12 8 9.5 5.5 6 5.5c0 3.5 2.5 6 6 5.5z" /></svg>
);
export const IconLotus = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="6" r="2.2" /><path d="M12 10v5" /><path d="M5 13c2 2.4 4.4 3.6 7 3.6s5-1.2 7-3.6" /><path d="M4 17.5c2.5 1.6 5.2 2.4 8 2.4s5.5-.8 8-2.4" /><path d="M8.5 12.5 6 10.5M15.5 12.5 18 10.5" /></svg>
);
export const IconBattery0 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="8" y="5" width="8" height="16" rx="2" /><path d="M10.5 2.5h3" /><path d="M10.5 17.5h3" strokeWidth={2.2} /></svg>
);
export const IconBattery1 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="8" y="5" width="8" height="16" rx="2" /><path d="M10.5 2.5h3" /><rect x="10.2" y="14.5" width="3.6" height="4" rx="0.8" fill="currentColor" stroke="none" /></svg>
);
export const IconBattery2 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="8" y="5" width="8" height="16" rx="2" /><path d="M10.5 2.5h3" /><rect x="10.2" y="11" width="3.6" height="7.5" rx="0.8" fill="currentColor" stroke="none" /></svg>
);
export const IconBattery3 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="8" y="5" width="8" height="16" rx="2" /><path d="M10.5 2.5h3" /><rect x="10.2" y="7.5" width="3.6" height="11" rx="0.8" fill="currentColor" stroke="none" /></svg>
);
export const IconBolt = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M13 2.5 5.5 13.5H11L9.5 21.5 18.5 10H13z" /></svg>
);
export const IconSignal1 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 19v-4" strokeWidth={2.6} /></svg>
);
export const IconUsers2 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="16.5" cy="9.5" r="2.4" /><path d="M15.5 14.6a4.6 4.6 0 0 1 5 4.4" /></svg>
);
export const IconUsers3 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="7.5" r="2.6" /><circle cx="5.5" cy="9.5" r="2.1" /><circle cx="18.5" cy="9.5" r="2.1" /><path d="M8.5 18a3.5 3.5 0 0 1 7 0" /><path d="M2.5 16.5a3 3 0 0 1 4.4-2.6M21.5 16.5a3 3 0 0 0-4.4-2.6" /></svg>
);
export const IconMesh = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="5" r="1.8" /><circle cx="5" cy="10" r="1.8" /><circle cx="19" cy="10" r="1.8" /><circle cx="8" cy="18" r="1.8" /><circle cx="16" cy="18" r="1.8" /><path d="M12 6.8 6.4 9M12 6.8 17.6 9M6 11.6l1.4 4.6M18 11.6l-1.4 4.6M9.8 18h4.4M6.8 10.8l7.4 6M17.2 10.8l-7.4 6" /></svg>
);
export const IconFog = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="6" cy="6" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="6" r="1.1" fill="currentColor" stroke="none" /><circle cx="18" cy="6" r="1.1" fill="currentColor" stroke="none" /><circle cx="6" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="6" cy="18" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="18" r="1.1" fill="currentColor" stroke="none" /><circle cx="18" cy="18" r="1.1" fill="currentColor" stroke="none" /></svg>
);
export const IconCircleDash = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 3a9 9 0 0 1 9 9M21 12a9 9 0 0 1-9 9M12 21a9 9 0 0 1-9-9M3 12a9 9 0 0 1 9-9" strokeWidth={2.2} /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg>
);
export const IconFocus1 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><circle cx="12" cy="12" r="1.7" /></svg>
);
export const IconFocus2 = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" /><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></svg>
);
export const IconRecord = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></svg>
);
export const IconMind = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M13.5 3.5c-3.6 0-6.3 2.6-6.3 6 0 1.2.3 2.2.9 3.1-.8.6-1.6 1.5-1.6 2.4 0 .5.4.9.9.9h.8v1.6c0 1.6 1.3 2.9 2.9 2.9h1.4" /><path d="M13.5 3.5c3.4 0 6 2.5 6 5.8 0 2.1-1 3.9-2.6 5v3.2" /><circle cx="11.5" cy="9" r="1.1" fill="currentColor" stroke="none" /><circle cx="15.5" cy="11.5" r="1.1" fill="currentColor" stroke="none" /><path d="M12.4 9.7l2.2 1.2" /></svg>
);
export const IconBulb = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 1 3.3 11c-.6.5-1 1.2-1 2v1h-4.6v-1c0-.8-.4-1.5-1-2A6 6 0 0 1 12 3z" /></svg>
);
export const IconChat = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.8-.3-4-.9L3 20l1-5.3a8.5 8.5 0 1 1 17-3.2z" /><path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01" /></svg>
);
export const IconLock = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none" /></svg>
);
export const IconPlay = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2c.6-.4.6-1.4 0-1.8l-11-7.2c-.7-.4-1.6.1-1.6.9z" fill="currentColor" stroke="none" /></svg>
);
export const IconPause = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" /><rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" /></svg>
);
export const IconArrowR = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);
export const IconHeart = ({ size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)}><path d="M12 20.2s-7.4-4.6-7.4-9.4A4.3 4.3 0 0 1 12 8.1a4.3 4.3 0 0 1 7.4 2.7c0 4.8-7.4 9.4-7.4 9.4z" /><path d="M4.6 12.7h2.9l1.4-2.2 1.9 4.2 1.5-2h6.1" /></svg>
);
