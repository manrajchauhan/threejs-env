import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "../store/useSceneStore";

const _euler = new THREE.Euler(0, 0, 0, "YXZ");
const _moveDir = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();

export function WalkingController() {
  const { camera, gl } = useThree();
  const setIsPointerLocked = useSceneStore((state) => state.setIsPointerLocked);

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
    sprint: false,
  });

  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);
  const playerPos = useRef(new THREE.Vector3(0, 2.2, 12));
  const headBobTimer = useRef(0);

  // Setup Keyboard Listeners
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
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
        case "KeyQ":
        case "ArrowLeft":
          keys.current.turnLeft = true;
          break;
        case "KeyE":
        case "ArrowRight":
          keys.current.turnRight = true;
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
          keys.current.left = false;
          break;
        case "KeyD":
          keys.current.right = false;
          break;
        case "KeyQ":
        case "ArrowLeft":
          keys.current.turnLeft = false;
          break;
        case "KeyE":
        case "ArrowRight":
          keys.current.turnRight = false;
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

  // Frame animation loop for movement & rotation
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // Keyboard rotation if mouse not locked
    if (!isLocked.current) {
      const turnSpeed = 1.8;
      if (keys.current.turnLeft) yaw.current += turnSpeed * dt;
      if (keys.current.turnRight) yaw.current -= turnSpeed * dt;
    }

    // Directional vectors relative to current yaw
    _forward.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    _right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    _moveDir.set(0, 0, 0);
    if (keys.current.forward) _moveDir.add(_forward);
    if (keys.current.backward) _moveDir.sub(_forward);
    if (keys.current.right) _moveDir.add(_right);
    if (keys.current.left) _moveDir.sub(_right);

    const isMoving = _moveDir.lengthSq() > 0;
    if (isMoving) _moveDir.normalize();

    const speed = keys.current.sprint ? 12 : 6;
    playerPos.current.x += _moveDir.x * speed * dt;
    playerPos.current.z += _moveDir.z * speed * dt;

    // Clamp player within pier deck
    playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -7.2, 7.2);
    playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -38, 18);

    // Head bobbing effect
    let bobY = 0;
    if (isMoving) {
      headBobTimer.current += dt * (keys.current.sprint ? 14 : 9);
      bobY = Math.sin(headBobTimer.current) * 0.06;
    }

    camera.position.set(playerPos.current.x, 2.2 + bobY, playerPos.current.z);

    _euler.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(_euler);
  });

  return null;
}
