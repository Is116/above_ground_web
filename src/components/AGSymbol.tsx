"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function SymbolMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const lightRefs = useRef<THREE.Light[]>([]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.15;
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.15 + clock.getElapsedTime() * 0.15;
    }

    // Animate light colors cycling through cyan, magenta, yellow
    const t = clock.getElapsedTime() * 0.8;
    const colors = ["#00ffcc", "#ff00aa", "#ffe600"];
    const colorIndex = Math.floor(t) % colors.length;
    const nextIndex = (colorIndex + 1) % colors.length;
    const blend = t % 1;

    if (lightRefs.current.length > 0) {
      lightRefs.current.forEach((light, i) => {
        const col = new THREE.Color(colors[i % 3]);
        col.lerp(new THREE.Color(colors[(i + 1) % 3]), Math.sin(t * Math.PI) * 0.5 + 0.5);
        (light as THREE.Light & { color?: THREE.Color }).color = col;
      });
    }
  });

  const wingGeom = useMemo(() => new THREE.BoxGeometry(0.15, 1.0, 0.12), []);
  const verticalGeom = useMemo(() => new THREE.BoxGeometry(0.15, 2.4, 0.12), []);
  const horizontalGeom = useMemo(() => new THREE.BoxGeometry(0.9, 0.15, 0.12), []);

  return (
    <group ref={groupRef} position={[-0.3, 0.7, 0]}>
      {/* Core cyan material */}
      {/* Left arrow wing */}
      <mesh geometry={wingGeom} position={[-0.3, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshPhongMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          shininess={100}
        />
      </mesh>
      {/* Right arrow wing */}
      <mesh geometry={wingGeom} position={[0.3, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshPhongMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          shininess={100}
        />
      </mesh>
      {/* Vertical bar */}
      <mesh geometry={verticalGeom} position={[0, -0.3, 0]}>
        <meshPhongMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          shininess={100}
        />
      </mesh>
      {/* Horizontal bar */}
      <mesh geometry={horizontalGeom} position={[0, -0.4, 0]}>
        <meshPhongMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          shininess={100}
        />
      </mesh>

      {/* Colored edge lighting */}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <SymbolMesh />
    </>
  );
}

export default function AGSymbol() {
  return (
    <div style={{ position: "relative", width: "100%", height: "450px" }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.2 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
