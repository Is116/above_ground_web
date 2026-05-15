"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Laser beam ─────────────────────────────────────────── */

interface LaserProps {
  x: number;
  hex: string;
  speed: number;
  phase: number;
  sweep: number;
  tilt: number;
}

function Laser({ x, hex, speed, phase, sweep, tilt }: LaserProps) {
  const ref = useRef<THREE.Group>(null!);
  const len = 22;

  useFrame(({ clock }) => {
    ref.current.rotation.z = tilt + Math.sin(clock.getElapsedTime() * speed + phase) * sweep;
  });

  return (
    <group ref={ref} position={[x, -5.5, 0.4]}>
      {/* core */}
      <mesh position={[0, len / 2, 0]}>
        <cylinderGeometry args={[0.013, 0.013, len, 6]} />
        <meshBasicMaterial color={hex} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* inner glow */}
      <mesh position={[0, len / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.032, len, 6]} />
        <meshBasicMaterial color={hex} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* outer halo */}
      <mesh position={[0, len / 2, 0]}>
        <cylinderGeometry args={[0.2, 0.07, len, 6]} />
        <meshBasicMaterial color={hex} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight color={hex} intensity={1.2} distance={6} decay={2} />
    </group>
  );
}

/* ─── Floating particles ─────────────────────────────────── */

function Particles({ count = 280 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { geo, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 12 - 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      spd[i]         = 0.003 + Math.random() * 0.009;
    }
    const g = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(pos, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", attr);
    return { geo: g, speeds: spd };
  }, [count]);

  useFrame(() => {
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -1.5;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.026} color="#00ffcc" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ─── Full scene ─────────────────────────────────────────── */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.07} />

      {/* left bank */}
      <Laser x={-2.9} hex="#00ffcc" speed={0.36} phase={0.0} sweep={0.52} tilt={0.12}  />
      <Laser x={-2.2} hex="#ff00aa" speed={0.54} phase={1.1} sweep={0.48} tilt={-0.08} />
      <Laser x={-1.5} hex="#ffe600" speed={0.46} phase={2.4} sweep={0.36} tilt={0.22}  />

      {/* right bank */}
      <Laser x={2.9}  hex="#00ffcc" speed={0.40} phase={0.7} sweep={0.52} tilt={-0.12} />
      <Laser x={2.2}  hex="#ff00aa" speed={0.57} phase={1.8} sweep={0.48} tilt={0.08}  />
      <Laser x={1.5}  hex="#ffe600" speed={0.50} phase={2.9} sweep={0.36} tilt={-0.22} />

      <Particles count={300} />
    </>
  );
}

/* ─── Export ─────────────────────────────────────────────── */

export default function DJScene() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
