"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PINE = "#0b2a20";
const LICHEN = "#a9bda0";
const FLAG = "#ff4f9a";

/** True while the element is on screen, so 3D scenes can stop drawing off screen. */
function useOnScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

function useReducedMotionOnce() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* Terrain: a live contour map. The ground rises under the pointer.    */
/* ------------------------------------------------------------------ */

const terrainVert = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
varying float vH;
varying float vBump;
varying vec2 vP;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}
void main(){
  vec3 p = position;
  float h = fbm(p.xy * 0.3 + vec2(uTime * 0.025, uTime * 0.015)) * 2.4;
  float d = distance(p.xy, uMouse);
  float bump = exp(-d * d * 0.3);
  h += bump * 1.5;
  p.z = h;
  vH = h; vBump = bump; vP = p.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const terrainFrag = /* glsl */ `
uniform vec3 uLine;
uniform vec3 uFlag;
varying float vH;
varying float vBump;
varying vec2 vP;
void main(){
  float f = vH * 6.0;
  float minor = 1.0 - smoothstep(0.0, 1.3, abs(fract(f - 0.5) - 0.5) / fwidth(f));
  float g = f / 5.0;
  float major = 1.0 - smoothstep(0.0, 2.0, abs(fract(g - 0.5) - 0.5) / fwidth(g));
  float a = max(minor * 0.42, major * 0.95);
  float edge = smoothstep(10.5, 4.0, length(vP * vec2(0.7, 1.0)));
  vec3 c = mix(uLine, uFlag, clamp(vBump * 1.3, 0.0, 1.0));
  gl_FragColor = vec4(c, a * edge);
}`;

function TerrainMesh({ still }: { still: boolean }) {
  const { camera, gl } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(3, 1) },
      uLine: { value: new THREE.Color(LICHEN) },
      uFlag: { value: new THREE.Color(FLAG) },
    }),
    [],
  );
  const ndc = useRef(new THREE.Vector2());
  const lastMove = useRef(-1e9);
  const tools = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
      hit: new THREE.Vector3(),
      target: new THREE.Vector2(3, 1),
    }),
    [],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      ndc.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -(((e.clientY - r.top) / r.height) * 2 - 1),
      );
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [gl]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (performance.now() - lastMove.current > 2500) {
      // Nobody is steering (or it's a phone): let the hill wander.
      tools.target.set(Math.sin(t * 0.31) * 4.5, Math.cos(t * 0.23) * 2.2);
    } else {
      tools.ray.setFromCamera(ndc.current, camera);
      if (tools.ray.ray.intersectPlane(tools.plane, tools.hit)) {
        tools.target.set(tools.hit.x, -tools.hit.z);
      }
    }
    uniforms.uMouse.value.lerp(tools.target, 0.07);
    uniforms.uTime.value = still ? 0 : t;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[26, 16, 260, 160]} />
      <shaderMaterial
        vertexShader={terrainVert}
        fragmentShader={terrainFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function Terrain() {
  const [ref, visible] = useOnScreen<HTMLDivElement>();
  const reduced = useReducedMotionOnce();
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 7.5, 8.5], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
      >
        <TerrainMesh still={reduced} />
      </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Globe: drag to spin. Pink pins mark places from content.ts.         */
/* ------------------------------------------------------------------ */

const R = 2;
const toXYZ = (lat: number, lon: number, r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
};

function graticule() {
  const pts: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let lon = -180; lon < 180; lon += 20)
    for (let lat = -90; lat < 90; lat += 5) push(toXYZ(lat, lon), toXYZ(lat + 5, lon));
  for (let lat = -60; lat <= 60; lat += 20)
    for (let lon = -180; lon < 180; lon += 5) push(toXYZ(lat, lon), toXYZ(lat, lon + 5));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

type Drag = { active: boolean; vx: number; vy: number };

function GlobeMesh({
  places,
  drag,
  still,
}: {
  places: { lat: number; lon: number }[];
  drag: React.RefObject<Drag>;
  still: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const lines = useMemo(graticule, []);
  useFrame((_, dt) => {
    const d = drag.current;
    if (!d.active) {
      d.vx *= 0.94;
      d.vy *= 0.9;
      if (!still) d.vx += (0.12 - d.vx) * 0.02; // settle into a slow idle spin
    }
    group.current.rotation.y += d.vx * dt;
    group.current.rotation.x = THREE.MathUtils.clamp(
      group.current.rotation.x + d.vy * dt,
      -0.9,
      0.9,
    );
  });
  return (
    <group ref={group} rotation={[0.45, 1.1, 0]}>
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 32]} />
        <meshBasicMaterial color={PINE} />
      </mesh>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={LICHEN} transparent opacity={0.55} />
      </lineSegments>
      {places.map((p, i) => {
        const base = toXYZ(p.lat, p.lon);
        const tip = toXYZ(p.lat, p.lon, R * 1.16);
        const stem = new THREE.BufferGeometry().setFromPoints([base, tip]);
        return (
          <group key={i}>
            <lineSegments geometry={stem}>
              <lineBasicMaterial color={FLAG} />
            </lineSegments>
            <mesh position={tip}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshBasicMaterial color={FLAG} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function Globe({ places }: { places: { lat: number; lon: number }[] }) {
  const [ref, visible] = useOnScreen<HTMLDivElement>();
  const reduced = useReducedMotionOnce();
  const drag = useRef<Drag>({ active: false, vx: 0.12, vy: 0 });
  const last = useRef({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      data-cursor="Drag"
      className="aspect-square w-full touch-pan-y select-none"
      role="img"
      aria-label="A wireframe globe with pins on Ireland, Canada, and the United States"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current.active = true;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return;
        drag.current.vx = (e.clientX - last.current.x) * 0.6;
        drag.current.vy = (e.clientY - last.current.y) * 0.4;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerCancel={() => (drag.current.active = false)}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={visible ? "always" : "never"}
      >
        <GlobeMesh places={places} drag={drag} still={reduced} />
      </Canvas>
    </div>
  );
}
