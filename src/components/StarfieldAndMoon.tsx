import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

export function StarfieldAndMoon() {
  const timeOfDay = useSceneStore((state) => state.timeOfDay);
  const starsRef = useRef<THREE.Points>(null);
  const moonRef = useRef<THREE.Group>(null);

  // Generate random 3D star positions in sphere shell
  const { positions, opacities } = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const opac = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2200 + Math.random() * 200;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 100; // Upper hemisphere
      pos[i * 3 + 2] = r * Math.cos(phi);

      opac[i] = 0.3 + Math.random() * 0.7;
    }

    return { positions: pos, opacities: opac };
  }, []);

  useFrame(() => {
    // Stars visibility: strongest at night (t around 0.0 or 1.0), zero at midday (t = 0.5)
    const nightIntensity = Math.max(0, Math.cos(timeOfDay * Math.PI * 2));
    if (starsRef.current) {
      const mat = starsRef.current.material as THREE.PointsMaterial;
      mat.opacity = nightIntensity * 0.85;
    }

    // Moon position tracks opposite to sun
    if (moonRef.current) {
      const angle = (timeOfDay - 0.5) * Math.PI * 2;
      const dist = 1800;
      moonRef.current.position.set(
        Math.sin(angle) * dist * 0.8,
        Math.sin(angle + Math.PI) * dist * 0.7,
        -Math.cos(angle) * dist
      );
      moonRef.current.visible = nightIntensity > 0.1;
    }
  });

  return (
    <>
      {/* Night Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3.5}
          color="#ffffff"
          transparent
          opacity={0}
          sizeAttenuation
        />
      </points>

      {/* Glowing Moon Mesh */}
      <group ref={moonRef}>
        <mesh>
          <sphereGeometry args={[45, 32, 32]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
        {/* Soft Moon Halo */}
        <mesh>
          <sphereGeometry args={[65, 32, 32]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.15} />
        </mesh>
        <directionalLight color="#a5b4fc" intensity={0.5} />
      </group>
    </>
  );
}
