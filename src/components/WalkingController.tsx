import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

const _moveDir = new THREE.Vector3();
const _velocity = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, "YXZ");

export function WalkingController() {
  const { camera, gl } = useThree();
  const setIsPointerLocked = useSceneStore((state) => state.setIsPointerLocked);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);
  const playerPos = useRef(new THREE.Vector3(0, 2.2, 16));
  const headBobTimer = useRef(0);

  // Setup Keydown / Keyup handlers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = true;
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
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
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.sprint = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // PointerLock API mouse look handlers
  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      isLocked.current = locked;
      setIsPointerLocked(locked);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;
      const sensitivity = 0.0022;
      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;
      pitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch.current));
    };

    const onClickCanvas = () => {
      if (!isLocked.current) {
        canvas.requestPointerLock();
      }
    };

    canvas.addEventListener("click", onClickCanvas);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("click", onClickCanvas);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [gl, setIsPointerLocked]);

  // Frame animation loop for motion physics
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    _moveDir.set(0, 0, 0);
    if (keys.current.forward) _moveDir.z -= 1;
    if (keys.current.backward) _moveDir.z += 1;
    if (keys.current.left) _moveDir.x -= 1;
    if (keys.current.right) _moveDir.x += 1;

    const isMoving = _moveDir.lengthSq() > 0;
    if (isMoving) _moveDir.normalize();

    const speed = keys.current.sprint ? 14 : 7;
    _velocity.x = THREE.MathUtils.lerp(_velocity.x, _moveDir.x * speed, dt * 10);
    _velocity.z = THREE.MathUtils.lerp(_velocity.z, _moveDir.z * speed, dt * 10);

    // Rotate movement vector by camera yaw
    const forwardX = -Math.sin(yaw.current);
    const forwardZ = -Math.cos(yaw.current);
    const rightX = Math.cos(yaw.current);
    const rightZ = -Math.sin(yaw.current);

    const moveX = _velocity.x * rightX + _velocity.z * forwardX;
    const moveZ = _velocity.x * rightZ + _velocity.z * forwardZ;

    playerPos.current.x += moveX * dt;
    playerPos.current.z += moveZ * dt;

    // Keep player within bounds around pier
    playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -7.2, 7.2);
    playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -38, 18);

    // Head bobbing effect
    let bobY = 0;
    if (isMoving) {
      headBobTimer.current += dt * (keys.current.sprint ? 14 : 9);
      bobY = Math.sin(headBobTimer.current) * 0.08;
    }

    camera.position.set(playerPos.current.x, 2.2 + bobY, playerPos.current.z);

    // Apply orientation
    _euler.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(_euler);
  });

  return null;
}
