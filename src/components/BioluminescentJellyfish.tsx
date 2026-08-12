import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

export function BioluminescentJellyfish() {
  const groupRef = useRef<THREE.Group>(null);
  const timeOfDay = useSceneStore((state) => state.timeOfDay);
  const oceanY = useSceneStore((state) => state.oceanY);

  const jellyfish = [
    { pos: [-12, oceanY - 2.5, -5], color: "#38bdf8" },
    { pos: [10, oceanY - 3.8, 8], color: "#a855f7" },
    { pos: [-6, oceanY - 4.2, 18], color: "#34d399" },
    { pos: [14, oceanY - 3.0, -18], color: "#f43f5e" },
  ];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const jelly = child as THREE.Group;
      const pulse = Math.sin(t * 2 + i) * 0.15;
      jelly.position.y = jellyfish[i].pos[1] + Math.sin(t * 0.8 + i) * 0.8;
      jelly.scale.set(1 + pulse, 1 - pulse * 0.5, 1 + pulse);
    });

    // Fade glow based on night intensity
    const nightIntensity = Math.max(0.2, Math.cos(timeOfDay * Math.PI * 2));
    groupRef.current.visible = nightIntensity > 0.1;
  });

  return (
    <group ref={groupRef}>
      {jellyfish.map((j, i) => (
        <group key={`jelly-${i}`} position={j.pos as [number, number, number]}>
          {/* Glowing Umbrella Dome */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial
              color={j.color}
              emissive={j.color}
              emissiveIntensity={2.5}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Bioluminescent Light Source */}
          <pointLight color={j.color} intensity={2.0} distance={8} />
        </group>
      ))}
    </group>
  );
}
