import React, { Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Ocean } from "./Ocean";
import { SkyDome } from "./SkyDome";
import { PierBoardwalk } from "./PierBoardwalk";
import { WalkingController } from "./WalkingController";
import { StarfieldAndMoon } from "./StarfieldAndMoon";
import { WeatherRain } from "./WeatherRain";
import { DriftingBoat } from "./DriftingBoat";
import { BirdFlock } from "./BirdFlock";
import { FirePit } from "./FirePit";
import { BioluminescentJellyfish } from "./BioluminescentJellyfish";
import { useSceneStore } from "../store/useSceneStore";

function UnderwaterEffectController() {
  const { camera, scene } = useThree();
  const oceanY = useSceneStore((state) => state.oceanY);

  useFrame(() => {
    const isUnderwater = camera.position.y < oceanY + 0.2;
    if (isUnderwater) {
      scene.fog = new THREE.FogExp2("#042f40", 0.025);
    } else {
      scene.fog = null;
    }
  });

  return null;
}

export function OceanScene() {
  const timeOfDay = useSceneStore((state) => state.timeOfDay);
  const seaState = useSceneStore((state) => state.seaState);
  const oceanY = useSceneStore((state) => state.oceanY);
  const oceanVisible = useSceneStore((state) => state.oceanVisible);
  const autoRotate = useSceneStore((state) => state.autoRotate);
  const cameraMode = useSceneStore((state) => state.cameraMode);

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 8, 40], fov: 60, near: 0.1, far: 5000 }}
        gl={{ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 40, 20]} intensity={1.2} />

        <Suspense fallback={null}>
          <SkyDome timeOfDay={timeOfDay} radius={2500} />
          <StarfieldAndMoon />
          <WeatherRain />

          {oceanVisible && (
            <Ocean
              position={[0, oceanY, 0]}
              size={1200}
              segments={250}
              seaState={seaState}
              timeOfDay={timeOfDay}
            />
          )}

          <DriftingBoat />
          <BirdFlock />
          <PierBoardwalk />
          <FirePit />
          <BioluminescentJellyfish />

          <UnderwaterEffectController />

          {cameraMode === "orbit" ? (
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={0.4}
              enableDamping
              dampingFactor={0.05}
              minDistance={3}
              maxDistance={200}
              maxPolarAngle={Math.PI * 0.495}
              target={[0, 2, 0]}
            />
          ) : (
            <WalkingController />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
