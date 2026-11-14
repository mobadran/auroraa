"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useApp } from "@/lib/app-context";
import { sfx } from "@/lib/sound";
import { IconSync } from "./icons";

interface Params {
  autorotate: boolean;
  speed: number;
  dist: number;
  tilt: number;
  glow: number;
  sun: number;
  grid: boolean;
}
const DEFAULTS: Params = { autorotate: true, speed: 0.6, dist: 3.1, tilt: 25.19, glow: 1, sun: 38, grid: false };
const SEG: Record<string, number> = { low: 32, med: 64, high: 96 };

export function MarsGlobe({ autorotate, onAutorotate }: { autorotate: boolean; onAutorotate: (v: boolean) => void }) {
  const { pushToast } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);
  const params = useRef<Params>({ ...DEFAULTS });
  const api = useRef<{
    setQuality: (q: string) => void;
    exportPNG: () => void;
    setDist: (d: number) => void;
  } | null>(null);

  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [zoom, setZoom] = useState(DEFAULTS.dist);
  const [tilt, setTilt] = useState(DEFAULTS.tilt);
  const [glow, setGlow] = useState(DEFAULTS.glow);
  const [sun, setSun] = useState(DEFAULTS.sun);
  const [grid, setGrid] = useState(DEFAULTS.grid);
  const [quality, setQuality] = useState("high");
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  const set = useCallback(<K extends keyof Params>(key: K, val: Params[K]) => {
    params.current[key] = val;
  }, []);

  useEffect(() => { params.current.autorotate = autorotate; }, [autorotate]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 0, params.current.dist);

    // lights — warm key, cool rim, low ambient for drama
    const ambient = new THREE.AmbientLight(0x334455, 0.5);
    const sunLight = new THREE.DirectionalLight(0xfff2e0, 2.6);
    const rim = new THREE.DirectionalLight(0x4cc3ff, 0.7);
    rim.position.set(-4, -1, -3);
    scene.add(ambient, sunLight, rim);

    // planet hierarchy: view (spin/pitch) > planet (axial tilt) > mesh
    const view = new THREE.Group();
    const planet = new THREE.Group();
    view.add(planet);
    scene.add(view);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/mars-texture.png", () => setReady(true));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    let marsGeo = new THREE.SphereGeometry(1, SEG.high, SEG.high);
    const marsMat = new THREE.MeshStandardMaterial({
      map: texture, bumpMap: texture, bumpScale: 0.018, roughness: 0.96, metalness: 0.0,
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    planet.add(mars);

    // atmosphere fresnel glow
    const atmoGeo = new THREE.SphereGeometry(1.075, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xff7a45) },
        coeff: { value: 0.62 },
        power: { value: 3.6 },
        intensity: { value: params.current.glow },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 glowColor; uniform float coeff; uniform float power; uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float rim = pow(max(0.0, coeff - dot(vNormal, vec3(0.0, 0.0, 1.0))), power);
          gl_FragColor = vec4(glowColor, rim * intensity);
        }`,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    planet.add(atmo);

    // graticule grid overlay
    const gridGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(1.004, 24, 16));
    const gridMat = new THREE.LineBasicMaterial({ color: 0x2ef2ae, transparent: true, opacity: 0.16 });
    const gridMesh = new THREE.LineSegments(gridGeo, gridMat);
    gridMesh.visible = params.current.grid;
    planet.add(gridMesh);

    // starfield
    const starCount = 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 28 + Math.random() * 34;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaec6ff, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0.85 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // interaction state
    let spin = 0.4, pitch = 0.12, velY = 0, velX = 0;
    let dragging = false, lastX = 0, lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      try { renderer.domElement.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      velY = dx * 0.0045; velX = dy * 0.0035;
      spin += velY; pitch += velX;
      pitch = Math.max(-0.6, Math.min(0.6, pitch));
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try { renderer.domElement.releasePointerCapture(e.pointerId); } catch {}
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.max(2.1, Math.min(5.5, params.current.dist + e.deltaY * 0.0016));
      params.current.dist = d;
      setZoom(d);
    };
    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    api.current = {
      setQuality: (q: string) => {
        const seg = SEG[q] ?? SEG.high;
        const old = mars.geometry;
        mars.geometry = new THREE.SphereGeometry(1, seg, seg);
        old.dispose();
      },
      setDist: (d: number) => { params.current.dist = d; },
      exportPNG: () => {
        renderer.render(scene, camera);
        const url = renderer.domElement.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "aurora-mars-viewport.png";
        a.click();
        pushToast("Mars viewport exported as PNG");
        sfx.success();
      },
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = params.current;

      if (!dragging) {
        if (p.autorotate) spin += p.speed * dt * 0.5;
        spin += velY; pitch += velX;
        velY *= 0.93; velX *= 0.93;
        pitch = Math.max(-0.6, Math.min(0.6, pitch));
      }
      view.rotation.y = spin;
      view.rotation.x = pitch;
      planet.rotation.z = THREE.MathUtils.degToRad(p.tilt);
      stars.rotation.y += dt * 0.006;

      const a = THREE.MathUtils.degToRad(p.sun);
      sunLight.position.set(Math.cos(a) * 5, 1.6, Math.sin(a) * 5);
      atmoMat.uniforms.intensity.value = p.glow;
      gridMesh.visible = p.grid;

      camera.position.z += (p.dist - camera.position.z) * 0.12;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      marsGeo.dispose(); marsMat.dispose(); texture.dispose();
      atmoGeo.dispose(); atmoMat.dispose();
      gridGeo.dispose(); gridMat.dispose();
      starGeo.dispose(); starMat.dispose();
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
      api.current = null;
    };
  }, [pushToast]);

  const reset = () => {
    params.current = { ...DEFAULTS };
    onAutorotate(DEFAULTS.autorotate); setSpeed(DEFAULTS.speed); setZoom(DEFAULTS.dist);
    setTilt(DEFAULTS.tilt); setGlow(DEFAULTS.glow); setSun(DEFAULTS.sun); setGrid(DEFAULTS.grid);
    setQuality("high"); api.current?.setQuality("high");
    sfx.toggle(); pushToast("Viewport parameters reset");
  };
  const randomize = () => {
    const r = (min: number, max: number, dp = 2) => Number((min + Math.random() * (max - min)).toFixed(dp));
    const sunV = r(0, 360, 0), tiltV = r(5, 45, 1), speedV = r(0.2, 2.4, 1), glowV = r(0.4, 1.8, 1);
    set("sun", sunV); set("tilt", tiltV); set("speed", speedV); set("glow", glowV);
    setSun(sunV); setTilt(tiltV); setSpeed(speedV); setGlow(glowV);
    sfx.toggle(); pushToast("Randomized illumination & rotation");
  };

  if (fallback) {
    return (
      <div className="globe-fallback">
        <div className="globe-fallback-ball" style={{ backgroundImage: "url(/mars-texture.png)" }} />
        <p>3D acceleration unavailable — showing orbital composite still.</p>
      </div>
    );
  }

  return (
    <div className="globe-wrap">
      <div className="globe-canvas" ref={mountRef}>
        {!ready && <div className="globe-loader"><IconSync size={20} /><span>ACQUIRING ORBITAL COMPOSITE…</span></div>}
        <div className="globe-hint">DRAG TO ROTATE · SCROLL TO ZOOM</div>
      </div>

      <div className="globe-controls" aria-label="Mars viewport controls">
        <div className="gc-head">
          <span className="lbl">Viewport Controls</span>
          <button className={`gc-toggle ${autorotate ? "on" : ""}`} onClick={() => { onAutorotate(!autorotate); sfx.toggle(); }}>
            <i />Autorotate {autorotate ? "On" : "Off"}
          </button>
        </div>

        <div className="gc-grid">
          <label className="gc-row">
            <span>Spin speed <b>{speed.toFixed(1)}×</b></span>
            <input type="range" min={0} max={3} step={0.1} value={speed} onChange={(e) => { const v = Number(e.target.value); setSpeed(v); set("speed", v); }} />
          </label>
          <label className="gc-row">
            <span>Zoom <b>{zoom.toFixed(1)}</b></span>
            <input type="range" min={2.1} max={5.5} step={0.1} value={zoom} onChange={(e) => { const v = Number(e.target.value); setZoom(v); set("dist", v); api.current?.setDist(v); }} />
          </label>
          <label className="gc-row">
            <span>Axial tilt <b>{tilt.toFixed(1)}°</b></span>
            <input type="range" min={0} max={45} step={0.1} value={tilt} onChange={(e) => { const v = Number(e.target.value); setTilt(v); set("tilt", v); }} />
          </label>
          <label className="gc-row">
            <span>Atmosphere <b>{glow.toFixed(1)}</b></span>
            <input type="range" min={0} max={2} step={0.1} value={glow} onChange={(e) => { const v = Number(e.target.value); setGlow(v); set("glow", v); }} />
          </label>
          <label className="gc-row">
            <span>Sun azimuth <b>{Math.round(sun)}°</b></span>
            <input type="range" min={0} max={360} step={1} value={sun} onChange={(e) => { const v = Number(e.target.value); setSun(v); set("sun", v); }} />
          </label>
          <label className="gc-row">
            <span>Render quality</span>
            <select value={quality} onChange={(e) => { const v = e.target.value; setQuality(v); api.current?.setQuality(v); sfx.toggle(); }}>
              <option value="low">Low · 32 seg</option>
              <option value="med">Medium · 64 seg</option>
              <option value="high">High · 96 seg</option>
            </select>
          </label>
        </div>

        <div className="gc-actions">
          <button className={`gc-toggle ${grid ? "on" : ""}`} onClick={() => { const v = !grid; setGrid(v); set("grid", v); sfx.toggle(); }}>
            <i />Graticule
          </button>
          <button className="gc-btn" onClick={randomize}>Randomize</button>
          <button className="gc-btn" onClick={reset}>Reset</button>
          <button className="gc-btn primary" onClick={() => api.current?.exportPNG()}>Export PNG</button>
        </div>
      </div>
    </div>
  );
}