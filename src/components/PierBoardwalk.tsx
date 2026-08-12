import React from "react";
import * as THREE from "three";

export function PierBoardwalk() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main Deck Platform */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[16, 0.4, 40]} />
        <meshStandardMaterial color="#2d2218" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Side Railings Left */}
      <mesh position={[-7.8, 1.2, 0]}>
        <boxGeometry args={[0.2, 1.0, 40]} />
        <meshStandardMaterial color="#1a140e" roughness={0.5} />
      </mesh>

      {/* Side Railings Right */}
      <mesh position={[7.8, 1.2, 0]}>
        <boxGeometry args={[0.2, 1.0, 40]} />
        <meshStandardMaterial color="#1a140e" roughness={0.5} />
      </mesh>

      {/* End Observation Pavilion Deck */}
      <mesh position={[0, 0.5, -25]}>
        <cylinderGeometry args={[14, 14, 0.4, 16]} />
        <meshStandardMaterial color="#2d2218" roughness={0.7} />
      </mesh>

      {/* Pier Pillars supporting the deck in ocean */}
      {[-6, 6].map((x) =>
        [-15, -5, 5, 15, -25].map((z) => (
          <mesh key={`pillar-${x}-${z}`} position={[x, -5, z]}>
            <cylinderGeometry args={[0.5, 0.6, 12, 12]} />
            <meshStandardMaterial color="#110d0a" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Decorative Lantern Posts */}
      {[-7.2, 7.2].map((x) =>
        [-15, 0, 15, -25].map((z) => (
          <group key={`lamp-${x}-${z}`} position={[x, 1.7, z]}>
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 1.6, 8]} />
              <meshStandardMaterial color="#0e0e12" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.7, 0]}>
              <boxGeometry args={[0.4, 0.5, 0.4]} />
              <meshStandardMaterial color="#ffbd59" emissive="#ff9900" emissiveIntensity={1.5} />
            </mesh>
            <pointLight position={[0, 1.7, 0]} color="#ffaa44" intensity={2.5} distance={12} />
          </group>
        ))
      )}
    </group>
  );
}
