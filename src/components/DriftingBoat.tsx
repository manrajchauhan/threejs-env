import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

export function DriftingBoat() {
  const boatGroup = useRef<THREE.Group>(null);
  const seaState = useSceneStore((state) => state.seaState);
  const oceanY = useSceneStore((state) => state.oceanY);

  useFrame(({ clock }) => {
    if (!boatGroup.current) return;
    const t = clock.getElapsedTime();

    // Wave buoyancy & pitch/roll motion
    const bobY = Math.sin(t * 1.4) * (0.3 + seaState * 0.4);
    const pitch = Math.sin(t * 1.8) * (0.05 + seaState * 0.08);
    const roll = Math.cos(t * 1.2) * (0.08 + seaState * 0.12);

    boatGroup.current.position.y = oceanY + 0.3 + bobY;
    boatGroup.current.rotation.x = pitch;
    boatGroup.current.rotation.z = roll;
    boatGroup.current.rotation.y = Math.sin(t * 0.1) * 0.1 - 0.4;
  });

  return (
    <group ref={boatGroup} position={[45, 0, -80]}>
      {/* Wooden Boat Hull */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[4, 1.2, 12]} />
        <meshStandardMaterial color="#4a2e18" roughness={0.6} />
      </mesh>

      {/* Pointy Bow */}
      <mesh position={[0, 0.7, -7]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[2.2, 3, 4]} />
        <meshStandardMaterial color="#362010" roughness={0.6} />
      </mesh>

      {/* Main Mast */}
      <mesh position={[0, 7, -1]}>
        <cylinderGeometry args={[0.12, 0.18, 13, 8]} />
        <meshStandardMaterial color="#1f150c" roughness={0.4} />
      </mesh>

      {/* Sail */}
      <mesh position={[0, 7.5, 1.2]} rotation={[0, Math.PI / 12, 0]}>
        <planeGeometry args={[7, 10]} />
        <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} roughness={0.3} />
      </mesh>
    </group>
  );
}
