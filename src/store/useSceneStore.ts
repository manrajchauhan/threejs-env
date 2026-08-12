import { create } from "zustand";

export type CameraMode = "orbit" | "walk";

interface SceneState {
  timeOfDay: number; // 0 to 1
  seaState: number; // 0 to 1.5
  oceanY: number; // Y height offset
  oceanVisible: boolean;
  autoRotate: boolean;
  cameraMode: CameraMode;
  isPointerLocked: boolean;
  setTimeOfDay: (v: number) => void;
  setSeaState: (v: number) => void;
  setOceanY: (v: number) => void;
  setOceanVisible: (v: boolean) => void;
  setAutoRotate: (v: boolean) => void;
  setCameraMode: (mode: CameraMode) => void;
  setIsPointerLocked: (locked: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  timeOfDay: 0.6,
  seaState: 0.6,
  oceanY: -1.5,
  oceanVisible: true,
  autoRotate: true,
  cameraMode: "orbit",
  isPointerLocked: false,
  setTimeOfDay: (v) => set({ timeOfDay: v }),
  setSeaState: (v) => set({ seaState: v }),
  setOceanY: (v) => set({ oceanY: v }),
  setOceanVisible: (v) => set({ oceanVisible: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),
}));
