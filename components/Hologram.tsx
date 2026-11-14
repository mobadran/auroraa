"use client";

import type { Telemetry } from "@/lib/telemetry";
import { IconSync } from "./icons";

export function Hologram({ t, offline }: { t: Telemetry; offline: boolean }) {
  return (
    <section className="card holo" aria-label="Biometric holographic projection">
      <div className="holo-top">
        <span className="avatar-chip">AVATAR: MORGAN_A</span>
        <span className="holo-scale">Scale 1:1 Holo-Projection</span>
        <span className={`live-sync ${offline ? "cached" : ""}`}>
          <IconSync size={13} strokeWidth={2.2} />
          {offline ? "CACHED" : "LIVE SYNC"}
        </span>
      </div>

      <div className="holo-stage">
        <div className="holo-frame">
        <svg className="figure" viewBox="0 0 600 620" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(46,242,174,0.16)" />
              <stop offset="55%" stopColor="rgba(46,242,174,0.07)" />
              <stop offset="100%" stopColor="rgba(76,195,255,0.1)" />
            </linearGradient>
            <radialGradient id="poolGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="rgba(46,242,174,0.4)" />
              <stop offset="100%" stopColor="rgba(46,242,174,0)" />
            </radialGradient>
            <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* bounding frame */}
          <rect x="168" y="34" width="264" height="506" fill="none" stroke="#1c3a55" strokeWidth="1" strokeDasharray="5 7" opacity="0.55" />

          {/* projection platform */}
          <g>
            <ellipse cx="300" cy="562" rx="176" ry="33" fill="none" stroke="#1d4a66" strokeWidth="1.2" strokeDasharray="10 8" className="ring-rot" />
            <ellipse cx="300" cy="562" rx="132" ry="24" fill="none" stroke="#2a5f7a" strokeWidth="1" strokeDasharray="3 6" className="ring-rot-rev" />
            <ellipse cx="300" cy="562" rx="92" ry="16" fill="none" stroke="rgba(46,242,174,0.55)" strokeWidth="1.4" />
            <ellipse cx="300" cy="562" rx="66" ry="12" fill="url(#poolGlow)" />
          </g>

          {/* connector lines */}
          <g stroke="#2c4a6e" strokeWidth="1.1" fill="none" opacity="0.9">
            <path d="M318 66 L372 58 L404 58" />
            <path d="M286 190 L226 196 L198 196" />
            <path d="M240 306 L214 314 L198 314" />
            <path d="M314 428 L376 416 L404 416" />
          </g>
          <g fill="#4cc3ff">
            <circle cx="318" cy="66" r="2.4" />
            <circle cx="286" cy="190" r="2.4" />
            <circle cx="240" cy="306" r="2.4" />
            <circle cx="314" cy="428" r="2.4" />
          </g>

          {/* figure */}
          <g className="holo-float" filter="url(#softGlow)">
            {/* head */}
            <ellipse cx="300" cy="78" rx="27" ry="33" fill="url(#bodyFill)" stroke="#3df2c0" strokeWidth="1.6" />
            {/* body outline */}
            <path
              d="M287 122
                 C268 126 250 132 240 142 C232 150 228 164 227 180
                 L221 246 C219 268 218 290 221 308 C222 318 228 324 234 321
                 C240 318 241 308 241 298 L245 240 L250 190
                 C251 214 253 240 258 262 C261 278 260 292 256 304 L262 318
                 C260 348 262 376 266 398 L271 478 C272 490 270 500 265 507
                 L289 507 C293 499 293 490 292 480 L295 400 C297 376 299 352 300 336
                 C301 352 303 376 305 400 L308 480 C307 490 307 499 311 507
                 L335 507 C330 500 328 490 329 478 L334 398 C338 376 340 348 338 318
                 L344 304 C340 292 339 278 342 262 C347 240 349 214 350 190
                 L355 240 L359 298 C359 308 360 318 366 321 C372 324 378 318 379 308
                 C382 290 381 268 379 246 L373 180 C372 164 368 150 360 142
                 C350 132 332 126 313 122 Z"
              fill="url(#bodyFill)"
              stroke="#3df2c0"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* clavicle + ribs + pelvis */}
            <g stroke="rgba(61,242,192,0.4)" strokeWidth="1" fill="none">
              <path d="M262 142 Q300 156 338 142" />
              <path d="M268 172 Q300 186 332 172" />
              <path d="M270 190 Q300 203 330 190" />
              <path d="M272 208 Q300 220 328 208" />
              <path d="M270 300 Q300 316 330 300" />
            </g>
            {/* spine */}
            <path d="M300 122 L300 332" stroke="rgba(182,164,247,0.65)" strokeWidth="1.3" strokeDasharray="3 5" fill="none" />
            {/* circulatory path */}
            <path
              d="M300 96 L300 186 C296 220 303 250 298 286 C296 312 301 332 298 352 L294 470 M298 352 C302 380 305 420 307 470"
              stroke="rgba(255,93,143,0.85)" strokeWidth="1.4" fill="none" strokeLinecap="round"
            />
            {/* neural node */}
            <g className="node-violet">
              <circle cx="300" cy="78" r="15" fill="none" stroke="rgba(182,164,247,0.7)" strokeWidth="1" strokeDasharray="3 4" className="ring-rot" />
              <circle cx="300" cy="78" r="9.5" fill="rgba(182,164,247,0.18)" stroke="#b6a4f7" strokeWidth="1.4" />
              <circle cx="300" cy="75.5" r="2.6" fill="none" stroke="#d9ceff" strokeWidth="1.2" />
              <path d="M295.5 83 a4.5 4.5 0 0 1 9 0" fill="none" stroke="#d9ceff" strokeWidth="1.2" />
            </g>
            {/* heart */}
            <g className="heart-node">
              <circle cx="293" cy="190" r="11" fill="none" stroke="rgba(255,140,90,0.5)" strokeWidth="1" />
              <circle cx="293" cy="190" r="6" fill="#ff8c5a" />
            </g>
            {/* spine / plexus nodes */}
            <g fill="#3df2c0">
              <circle cx="300" cy="238" r="2.6" />
              <circle cx="300" cy="268" r="2.6" />
              <circle cx="300" cy="298" r="2.6" />
            </g>
            <circle cx="300" cy="232" r="4.6" fill="none" stroke="#3df2c0" strokeWidth="1.3" />
            {/* knee node */}
            <circle cx="307" cy="400" r="5.4" fill="rgba(46,242,174,0.15)" stroke="#3df2c0" strokeWidth="1.4" />
            {/* hand nodes */}
            <circle cx="234" cy="314" r="3" fill="none" stroke="rgba(76,195,255,0.8)" strokeWidth="1.2" />
            <circle cx="366" cy="314" r="3" fill="none" stroke="rgba(76,195,255,0.8)" strokeWidth="1.2" />
          </g>
        </svg>

        <div className="scanline" aria-hidden="true" />

        <div className="callout co-neural">
          <div className="t"><i style={{ background: "#b6a4f7", boxShadow: "0 0 7px #b6a4f7" }} />Neural Biomarker</div>
          <div className="b">Theta Coherence <b>{t.theta}%</b> | Latency <b>{t.neuralLatency}ms</b></div>
        </div>
        <div className="callout co-cardiac">
          <div className="t"><i style={{ background: "#ff8c5a", boxShadow: "0 0 7px #ff8c5a" }} />Cardiac Vector</div>
          <div className="b"><b>{t.hr} BPM</b> | Stroke <b>{t.stroke}mL</b> | 0 Ectopic</div>
        </div>
        <div className="callout co-blood">
          <div className="t"><i style={{ background: "#4cc3ff", boxShadow: "0 0 7px #4cc3ff" }} />Blood O₂ &amp; Lactate</div>
          <div className="b">SpO₂ <b>{t.spo2}%</b> | Lac <b>{t.lactate} mmol/L</b></div>
        </div>
        <div className="callout co-calf">
          <div className="t"><i style={{ background: "#2ef2ae", boxShadow: "0 0 7px #2ef2ae" }} />Calf Muscle Tone</div>
          <div className="b">Density <b>0.0% loss</b> | T2 Ergometer in <b>45m</b></div>
        </div>
        </div>
      </div>
    </section>
  );
}