import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FirePit() {
  const lightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const count = 60;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 1] = Math.random() * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }, delta) => {
    // Dynamic warm flame light flicker
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.intensity = 3.5 + Math.sin(t * 12) * 0.8 + (Math.random() - 0.5) * 0.4;
    }

    // Ember particle drift
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 1] += delta * 1.6;
        if (array[i * 3 + 1] > 2.5) {
          array[i * 3 + 1] = 0.2;
          array[i * 3] = (Math.random() - 0.5) * 1.2;
          array[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0.7, -25]}>
      {/* Stone Brazier Basin */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.5, 1.2, 0.6, 16]} />
        <meshStandardMaterial color="#1e1e24" roughness={0.9} />
      </mesh>

      {/* Burning Ember Core */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial color="#ff5500" />
      </mesh>

      {/* Dynamic Flickering Warm Fire Light */}
      <pointLight ref={lightRef} color="#ff7700" intensity={4} distance={18} decay={1.8} position={[0, 1.2, 0]} />

      {/* Fire Ember Particles */}
      <points ref={particlesRef} position={[0, 0.4, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.35} color="#ffcc00" transparent opacity={0.9} depthWrite={false} />
      </points>
    </group>
  );
}
