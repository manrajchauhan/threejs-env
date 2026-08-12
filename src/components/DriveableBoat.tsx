import React, { useEffect, useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

const _camTargetPos = new THREE.Vector3();
const _camLookTarget = new THREE.Vector3();

export function DriveableBoat() {
  const { camera } = useThree();
  const cameraMode = useSceneStore((state) => state.cameraMode);
  const setCameraMode = useSceneStore((state) => state.setCameraMode);
  const seaState = useSceneStore((state) => state.seaState);
  const oceanY = useSceneStore((state) => state.oceanY);

  const boatGroup = useRef<THREE.Group>(null);
  const wakeParticlesRef = useRef<THREE.Points>(null);

  // Initial docked position next to the pier deck
  const boatPos = useRef(new THREE.Vector3(8, oceanY + 0.35, 10));
  const boatHeading = useRef(0);
  const boatSpeed = useRef(0);
  const rudderAngle = useRef(0);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Setup Keyboard Listeners for Driving & Exit (E / F key)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (cameraMode === "boat") {
        if (e.code === "KeyE" || e.code === "KeyF") {
          // Exit boat back to walk mode on pier
          setCameraMode("walk");
          if (document.pointerLockElement) {
            document.exitPointerLock();
          }
          return;
        }

        switch (e.code) {
          case "KeyW":
          case "ArrowUp":
            keys.current.forward = true;
            break;
          case "KeyS":
          case "ArrowDown":
            keys.current.backward = true;
            break;
          case "KeyA":
          case "ArrowLeft":
            keys.current.left = true;
            break;
          case "KeyD":
          case "ArrowRight":
            keys.current.right = true;
            break;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (cameraMode === "boat") {
        switch (e.code) {
          case "KeyW":
          case "ArrowUp":
            keys.current.forward = false;
            break;
          case "KeyS":
          case "ArrowDown":
            keys.current.backward = false;
            break;
          case "KeyA":
          case "ArrowLeft":
            keys.current.left = false;
            break;
          case "KeyD":
          case "ArrowRight":
            keys.current.right = false;
            break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [cameraMode, setCameraMode]);

  // Water Wake Particle System
  const wakeParticleCount = 150;
  const wakePositions = useMemo(() => new Float32Array(wakeParticleCount * 3), []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = clock.getElapsedTime();

    if (!boatGroup.current) return;

    // Driving Controls Physics if in Boat Mode
    if (cameraMode === "boat") {
      const maxForwardSpeed = 26;
      const maxReverseSpeed = -8;
      const accel = 18;
      const friction = 3.5;

      if (keys.current.forward) {
        boatSpeed.current = Math.min(maxForwardSpeed, boatSpeed.current + accel * dt);
      } else if (keys.current.backward) {
        boatSpeed.current = Math.max(maxReverseSpeed, boatSpeed.current - accel * dt);
      } else {
        boatSpeed.current = THREE.MathUtils.lerp(boatSpeed.current, 0, friction * dt);
      }

      // Steering
      const steerSpeed = 1.4;
      if (keys.current.left) {
        rudderAngle.current = THREE.MathUtils.lerp(rudderAngle.current, 1, dt * 6);
      } else if (keys.current.right) {
        rudderAngle.current = THREE.MathUtils.lerp(rudderAngle.current, -1, dt * 6);
      } else {
        rudderAngle.current = THREE.MathUtils.lerp(rudderAngle.current, 0, dt * 6);
      }

      const effectiveTurn = rudderAngle.current * steerSpeed * (boatSpeed.current / maxForwardSpeed);
      boatHeading.current += effectiveTurn * dt;

      const forwardX = Math.sin(boatHeading.current);
      const forwardZ = Math.cos(boatHeading.current);
      boatPos.current.x += forwardX * boatSpeed.current * dt;
      boatPos.current.z += forwardZ * boatSpeed.current * dt;

      boatPos.current.x = THREE.MathUtils.clamp(boatPos.current.x, -500, 500);
      boatPos.current.z = THREE.MathUtils.clamp(boatPos.current.z, -500, 500);
    } else {
      boatSpeed.current = THREE.MathUtils.lerp(boatSpeed.current, 0, dt * 5);
    }

    // Wave buoyancy & Banking turn roll
    const waveBob = Math.sin(t * 2.0 + boatPos.current.x * 0.1) * (0.2 + seaState * 0.3);
    const bankRoll = -rudderAngle.current * (boatSpeed.current / 26) * 0.25;
    const pitch = (boatSpeed.current / 26) * 0.1 + Math.sin(t * 2.5) * 0.04;

    boatGroup.current.position.set(boatPos.current.x, oceanY + 0.35 + waveBob, boatPos.current.z);
    boatGroup.current.rotation.set(pitch, boatHeading.current, bankRoll, "YXZ");

    // Camera Chase Behavior in Boat Mode
    if (cameraMode === "boat") {
      const camDistance = 18;
      const camHeight = 6.5;

      const backX = -Math.sin(boatHeading.current) * camDistance;
      const backZ = -Math.cos(boatHeading.current) * camDistance;

      _camTargetPos.set(
        boatPos.current.x + backX,
        oceanY + camHeight + waveBob * 0.5,
        boatPos.current.z + backZ
      );

      _camLookTarget.set(
        boatPos.current.x,
        oceanY + 1.8,
        boatPos.current.z
      );

      camera.position.lerp(_camTargetPos, dt * 4);
      camera.lookAt(_camLookTarget);
    }

    // Water Wake Foam Particles when moving
    if (wakeParticlesRef.current) {
      const posAttr = wakeParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const isMoving = Math.abs(boatSpeed.current) > 1;

      for (let i = 0; i < wakeParticleCount; i++) {
        if (isMoving && Math.random() < 0.3) {
          const spread = (Math.random() - 0.5) * 2;
          array[i * 3] = boatPos.current.x - Math.sin(boatHeading.current) * 4 + spread;
          array[i * 3 + 1] = oceanY + 0.1;
          array[i * 3 + 2] = boatPos.current.z - Math.cos(boatHeading.current) * 4 + spread;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={boatGroup}>
        {/* Speedboat Hull */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[3.2, 1.0, 9]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Sharp V-Bow */}
        <mesh position={[0, 0.5, 5]} rotation={[Math.PI / 6, 0, 0]}>
          <coneGeometry args={[1.7, 3, 4]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* White Trim Deck */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[3.0, 0.1, 8.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* Tinted Windshield */}
        <mesh position={[0, 1.4, 1.2]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[2.6, 0.8, 0.1]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.1} />
        </mesh>

        {/* Leather Seats */}
        <mesh position={[0, 1.1, -0.5]}>
          <boxGeometry args={[2.2, 0.4, 1.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>

        {/* Outboard Engine Motor */}
        <mesh position={[0, 0.6, -4.7]}>
          <boxGeometry args={[1.0, 1.4, 1.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Trailing Water Wake Foam */}
      <points ref={wakeParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[wakePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={1.4} color="#e0f2fe" transparent opacity={0.7} depthWrite={false} />
      </points>
    </>
  );
}
