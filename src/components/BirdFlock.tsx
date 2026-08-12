import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function BirdFlock() {
  const flockGroup = useRef<THREE.Group>(null);
  const count = 12;

  // Single bird low-poly geometry
  const birdGeom = useRef<THREE.BufferGeometry>(null!);
  if (!birdGeom.current) {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0.6,
      -1.4, 0.3, 0,
      0, 0, -0.4,

      0, 0, 0.6,
      1.4, 0.3, 0,
      0, 0, -0.4,
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    birdGeom.current = geom;
  }

  useFrame(({ clock }) => {
    if (!flockGroup.current) return;
    const t = clock.getElapsedTime();

    // Circle over pier & ocean
    flockGroup.current.children.forEach((child, i) => {
      const bird = child as THREE.Mesh;
      const radius = 65 + (i % 4) * 12;
      const speed = 0.3 + (i % 3) * 0.05;
      const angle = t * speed + (i * Math.PI * 2) / count;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 10;
      const y = 35 + Math.sin(t * 1.5 + i) * 4;

      bird.position.set(x, y, z);
      bird.rotation.y = -angle + Math.PI / 2;

      // Wing flapping scale
      const flap = Math.sin(t * 8 + i * 2) * 0.4;
      bird.rotation.z = flap;
    });
  });

  return (
    <group ref={flockGroup}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={`bird-${i}`} geometry={birdGeom.current}>
          <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
