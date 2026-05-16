"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Particles
    const count = 2000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette: [number, number, number][] = [
      [0, 1, 0.8],    // cyan
      [1, 0, 0.47],   // magenta
      [1, 0.9, 0],    // yellow
      [1, 1, 1],      // white
      [1, 0.42, 0],   // orange
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({ size: 0.11, vertexColors: true, transparent: true, opacity: 1.0 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Perspective grid
    const gridLines: number[] = [];
    const gridSize = 50;
    const gridStep = 6;
    for (let i = -gridSize; i <= gridSize; i += gridStep) {
      gridLines.push(-gridSize, 0, i, gridSize, 0, i);
      gridLines.push(i, 0, -gridSize, i, 0, gridSize);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridLines, 3));
    const gridMat = new THREE.LineBasicMaterial({ color: 0x001a10, transparent: true, opacity: 0.5 });
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    grid.position.y = -18;
    grid.rotation.x = Math.PI * 0.18;
    scene.add(grid);

    // Mouse
    let mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    document.addEventListener("mousemove", onMouse);

    let t = 0;
    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);
      t += 0.0007;
      points.rotation.y = t * 0.25 + mouse.x * 0.35;
      points.rotation.x = mouse.y * 0.2 + Math.sin(t) * 0.04;
      grid.rotation.y = t * 0.08;
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.72,
      }}
    />
  );
}
