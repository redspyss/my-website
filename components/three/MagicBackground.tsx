"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function FloatingMotes({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      speeds[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions, speeds };
  }, [count]);

  const texture = useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, "rgba(255,245,200,1)");
    grad.addColorStop(0.3, "rgba(212,175,55,0.8)");
    grad.addColorStop(1, "rgba(212,175,55,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 0.4;
      arr[i * 3] += Math.sin(state.clock.elapsedTime * 0.2 + i) * delta * 0.05;
      if (arr[i * 3 + 1] > 9) arr[i * 3 + 1] = -9;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </points>
  );
}

function ParallaxRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (typeof window === "undefined") return;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  useMemo(() => {
    if (typeof window === "undefined") return;
    const handler = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2.4;
      target.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.6;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return null;
}

// Tüm deneyimin arkasında akan büyülü 3B parçacık atmosferi.
export default function MagicBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#04060f", 10, 24]} />
        <FloatingMotes />
        <ParallaxRig />
      </Canvas>
    </div>
  );
}
