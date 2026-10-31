"use client";

/**
 * صحنه‌ی پرواز در «کانال داده» — three.js + @react-three/fiber
 *
 * یک لوله‌ی فلزی تیره با حلقه‌های درخشان کهربایی، نوار نور فیروزه‌ای مارپیچ و کابل‌های فرعی.
 * دوربین با اسکرول روی یک مسیر حرکت می‌کند (نمای دور ← ماکرو ← نمای دور ...).
 * جلوه‌ها: بازتاب فلز (Lightformer)، Bloom، عمق میدان، مه، Vignette، نویز.
 * هیچ فایل خارجی (مدل/تکسچر/HDR) لازم ندارد.
 *
 * فقط با next/dynamic و ssr:false لود شود (hero-3d.tsx این کار را می‌کند).
 */
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/** اگر عمق میدان روی سیستم شما عجیب دیده شد، این را false کنید */
const ENABLE_DOF = true;

const BG = "#040a18";
const AMBER = new THREE.Color("#ffa534").multiplyScalar(2.6);
const CYAN = new THREE.Color("#4cc9ff").multiplyScalar(2.4);

const MAIN_R = 0.55;
const FR = 600;

// مسیر اصلی لوله (در جهت -Z با پیچ و خم)
const CURVE_POINTS: [number, number, number][] = [
  [-10, -2, 4],
  [-6, 1.5, -4],
  [-1, -1, -11],
  [4, 3, -18],
  [8, 0, -26],
  [3, -3.5, -34],
  [-4, 0, -41],
  [-6, 3, -49],
  [-1, 0.5, -57],
  [4, -1, -65],
];

const RING_T = [0.06, 0.14, 0.23, 0.32, 0.41, 0.5, 0.59, 0.68, 0.77, 0.86, 0.94];
const BRANCH_T = [0.1, 0.27, 0.43, 0.56, 0.72, 0.88];

// ایستگاه‌های دوربین: s = پیشرفت اسکرول، d = فاصله از محور لوله، phi = زاویه دور لوله
const KEYS = [
  { s: 0.0, d: 7.5, phi: 0.7 },
  { s: 0.12, d: 5.0, phi: 1.3 },
  { s: 0.3, d: 1.9, phi: 2.3 },
  { s: 0.45, d: 4.2, phi: 3.4 },
  { s: 0.58, d: 2.2, phi: 4.3 },
  { s: 0.74, d: 1.9, phi: 5.4 },
  { s: 0.88, d: 4.5, phi: 6.2 },
  { s: 1.0, d: 8.0, phi: 6.9 },
];

function sampleKeys(s: number) {
  let i = 0;
  while (i < KEYS.length - 2 && s > KEYS[i + 1].s) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = THREE.MathUtils.clamp((s - a.s) / (b.s - a.s), 0, 1);
  const e = t * t * (3 - 2 * t);
  return { d: THREE.MathUtils.lerp(a.d, b.d, e), phi: THREE.MathUtils.lerp(a.phi, b.phi, e) };
}

type Ring = { pos: THREE.Vector3; quat: THREE.Quaternion };
type Branch = {
  geo: THREE.TubeGeometry;
  end: THREE.Vector3;
  endQuat: THREE.Quaternion;
  warm: boolean;
};

function buildConduit(lite: boolean) {
  const curve = new THREE.CatmullRomCurve3(
    CURVE_POINTS.map((p) => new THREE.Vector3(...p)),
    false,
    "catmullrom",
    0.5
  );
  const frames = curve.computeFrenetFrames(FR, false);
  const Z = new THREE.Vector3(0, 0, 1);

  const mainGeo = new THREE.TubeGeometry(curve, lite ? 240 : 520, MAIN_R, lite ? 12 : 28, false);

  // نوار نور مارپیچ دور لوله
  const SN = lite ? 260 : 460;
  const stripPts: THREE.Vector3[] = [];
  for (let i = 0; i <= SN; i++) {
    const t = i / SN;
    const fi = Math.min(FR, Math.round(t * FR));
    const a = t * Math.PI * 2 * 7;
    const p = curve.getPointAt(t);
    p.addScaledVector(frames.normals[fi], Math.cos(a) * (MAIN_R + 0.02));
    p.addScaledVector(frames.binormals[fi], Math.sin(a) * (MAIN_R + 0.02));
    stripPts.push(p);
  }
  const stripGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stripPts), SN * 2, 0.022, 5, false);

  const rings: Ring[] = RING_T.map((t) => ({
    pos: curve.getPointAt(t),
    quat: new THREE.Quaternion().setFromUnitVectors(Z, curve.getTangentAt(t).normalize()),
  }));

  const branches: Branch[] = BRANCH_T.map((t, i) => {
    const fi = Math.min(FR, Math.round(t * FR));
    const a = i * 2.1 + 0.5;
    const dir = new THREE.Vector3()
      .addScaledVector(frames.normals[fi], Math.cos(a))
      .addScaledVector(frames.binormals[fi], Math.sin(a))
      .normalize();
    const T = curve.getTangentAt(t).normalize();
    const side = new THREE.Vector3().crossVectors(dir, T).normalize();
    const s = curve.getPointAt(t);
    const pts = [
      s.clone().addScaledVector(dir, MAIN_R * 0.9),
      s.clone().addScaledVector(dir, 2.0).addScaledVector(T, 0.8),
      s.clone().addScaledVector(dir, 3.2).addScaledVector(T, 2.0).addScaledVector(side, 0.5),
      s.clone().addScaledVector(dir, 3.9).addScaledVector(T, 3.4).addScaledVector(side, 0.9),
    ];
    const bc = new THREE.CatmullRomCurve3(pts);
    return {
      geo: new THREE.TubeGeometry(bc, 40, 0.11, 8, false),
      end: pts[3].clone(),
      endQuat: new THREE.Quaternion().setFromUnitVectors(Z, bc.getTangentAt(1).normalize()),
      warm: i % 2 === 0,
    };
  });

  return { curve, frames, mainGeo, stripGeo, rings, branches };
}

function buildDust(curve: THREE.CatmullRomCurve3, count: number) {
  const arr = new Float32Array(count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const p = curve.getPointAt(Math.random());
    v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    p.addScaledVector(v, 1.6 + Math.random() * 8);
    arr[i * 3] = p.x;
    arr[i * 3 + 1] = p.y;
    arr[i * 3 + 2] = p.z;
  }
  return arr;
}

function Flight({ progress, lite }: { progress: MotionValue<number>; lite: boolean }) {
  const data = useMemo(() => buildConduit(lite), [lite]);
  const dust = useMemo(() => buildDust(data.curve, lite ? 260 : 800), [data, lite]);

  useEffect(
    () => () => {
      data.mainGeo.dispose();
      data.stripGeo.dispose();
      data.branches.forEach((b) => b.geo.dispose());
    },
    [data]
  );

  const smooth = useRef(0);
  const lamp = useRef<THREE.PointLight>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dof = useRef<any>(null);
  const tmp = useMemo(
    () => ({
      p: new THREE.Vector3(),
      n: new THREE.Vector3(),
      b: new THREE.Vector3(),
      look: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      focus: new THREE.Vector3(),
    }),
    []
  );

  useFrame((state, dt) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, progress.get(), 3.5, dt);
    const s = THREE.MathUtils.clamp(smooth.current, 0, 1);
    const u = 0.025 + s * 0.9;
    const { d, phi } = sampleKeys(s);

    const fi = u * FR;
    const i0 = Math.floor(fi);
    const i1 = Math.min(FR, i0 + 1);
    const f = fi - i0;
    tmp.n.copy(data.frames.normals[i0]).lerp(data.frames.normals[i1], f).normalize();
    tmp.b.copy(data.frames.binormals[i0]).lerp(data.frames.binormals[i1], f).normalize();
    data.curve.getPointAt(u, tmp.p);

    // پارالاکس ظریف موس
    const px = state.pointer.x * 0.25;
    const py = state.pointer.y * 0.18;
    tmp.pos
      .copy(tmp.p)
      .addScaledVector(tmp.n, d * Math.cos(phi) + py)
      .addScaledVector(tmp.b, d * Math.sin(phi) + px);
    state.camera.position.copy(tmp.pos);

    data.curve.getPointAt(Math.min(1, u + 0.04), tmp.look);
    state.camera.lookAt(tmp.look);

    // نقطه‌ی فوکوس: همان جایی که دوربین نگاه می‌کند، کمی نزدیک‌تر
    data.curve.getPointAt(Math.min(1, u + 0.014), tmp.focus);
    if (dof.current && dof.current.target !== tmp.focus) dof.current.target = tmp.focus;

    if (lamp.current) lamp.current.position.copy(tmp.pos);
  });

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 10, 46]} />
      <ambientLight intensity={0.12} />
      <pointLight ref={lamp} intensity={22} distance={16} decay={2} color="#ffb864" />

      {/* محیط بازتابی ساخته‌شده با کد: نور آبی از چپ، نارنجی از راست، سفید از بالا */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color="#4aa8ff" position={[-6, 2, -4]} scale={[9, 3, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={5} color="#ff9a3c" position={[6, -1, -6]} scale={[9, 2.5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 6, -2]} scale={4} rotation-x={Math.PI / 2} />
      </Environment>

      {/* لوله‌ی اصلی */}
      <mesh geometry={data.mainGeo}>
        <meshStandardMaterial color="#1b2540" metalness={1} roughness={0.3} envMapIntensity={1.3} />
      </mesh>
      {/* نوار نور مارپیچ */}
      <mesh geometry={data.stripGeo}>
        <meshBasicMaterial color={CYAN} toneMapped={false} />
      </mesh>

      {/* حلقه‌های درخشان */}
      {data.rings.map((r, i) => (
        <group key={`ring-${i}`} position={r.pos} quaternion={r.quat}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[MAIN_R + 0.08, MAIN_R + 0.08, 0.34, 32]} />
            <meshStandardMaterial color="#0e1525" metalness={1} roughness={0.25} envMapIntensity={1.2} />
          </mesh>
          <mesh>
            <torusGeometry args={[MAIN_R + 0.1, 0.05, 12, 64]} />
            <meshBasicMaterial color={AMBER} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.17]}>
            <torusGeometry args={[MAIN_R + 0.09, 0.018, 8, 64]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, -0.17]}>
            <torusGeometry args={[MAIN_R + 0.09, 0.018, 8, 64]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* کابل‌های فرعی با گره‌ی درخشان در انتها */}
      {data.branches.map((b, i) => (
        <group key={`branch-${i}`}>
          <mesh geometry={b.geo}>
            <meshStandardMaterial color="#1b2540" metalness={1} roughness={0.32} envMapIntensity={1.2} />
          </mesh>
          <group position={b.end} quaternion={b.endQuat}>
            <mesh>
              <torusGeometry args={[0.17, 0.03, 10, 32]} />
              <meshBasicMaterial color={AMBER} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0.14]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color={b.warm ? AMBER : CYAN} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ذرات معلق (با عمق میدان تبدیل به bokeh می‌شوند) */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#9fc4ff" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>

      <EffectComposer multisampling={lite ? 0 : 4}>
        <Bloom intensity={lite ? 0.9 : 1.3} luminanceThreshold={0.75} luminanceSmoothing={0.2} mipmapBlur />
        {ENABLE_DOF && !lite ? <DepthOfField ref={dof} worldFocusRange={3} bokehScale={4} /> : <></>}
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
        <Noise opacity={0.035} />
      </EffectComposer>
    </>
  );
}

export interface HeroSceneProps {
  /** پیشرفت اسکرول Hero (۰..۱) — MotionValue تا صفحه re-render نشود */
  progress: MotionValue<number>;
  /** وقتی false است رندر متوقف می‌شود (Hero خارج از دید) */
  active: boolean;
  /** موبایل/دستگاه ضعیف: جزئیات کمتر و بدون عمق میدان */
  lite: boolean;
  /** المانی که رویداد موس را می‌شنود */
  eventSource: RefObject<HTMLElement | null>;
}

export function HeroScene({ progress, active, lite, eventSource }: HeroSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0, 10] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
    >
      <Flight progress={progress} lite={lite} />
    </Canvas>
  );
}
