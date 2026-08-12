import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

export function WeatherRain() {
  const weather = useSceneStore((state) => state.weather);
  const rainRef = useRef<THREE.Points>(null);

  const count = weather === "storm" ? 4000 : weather === "rain" ? 1800 : 0;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 300;
      pos[i * 3 + 1] = Math.random() * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!rainRef.current || weather === "clear") return;
    const geom = rainRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const fallSpeed = weather === "storm" ? 140 : 80;
    const windX = weather === "storm" ? 25 : 5;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= fallSpeed * delta;
      array[i * 3] += windX * delta;

      // Reset rain drop to sky top when hitting ocean level
      if (array[i * 3 + 1] < -2) {
        array[i * 3 + 1] = 120;
        array[i * 3] = (Math.random() - 0.5) * 300;
        array[i * 3 + 2] = (Math.random() - 0.5) * 300;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (weather === "clear" || count === 0) return null;

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        color="#a5f3fc"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}
