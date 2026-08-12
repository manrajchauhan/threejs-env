import { create } from "zustand";

export type CameraMode = "orbit" | "walk";
export type WeatherType = "clear" | "rain" | "storm";

interface SceneState {
  timeOfDay: number; // 0 to 1
  seaState: number; // 0 to 1.5
  oceanY: number; // Y height offset
  oceanVisible: boolean;
  autoRotate: boolean;
  cameraMode: CameraMode;
  weather: WeatherType;
  isPointerLocked: boolean;
  setTimeOfDay: (v: number) => void;
  setSeaState: (v: number) => void;
  setOceanY: (v: number) => void;
  setOceanVisible: (v: boolean) => void;
  setAutoRotate: (v: boolean) => void;
  setCameraMode: (mode: CameraMode) => void;
  setWeather: (w: WeatherType) => void;
  setIsPointerLocked: (locked: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  timeOfDay: 0.6,
  seaState: 0.6,
  oceanY: -1.5,
  oceanVisible: true,
  autoRotate: true,
  cameraMode: "orbit",
  weather: "clear",
  isPointerLocked: false,
  setTimeOfDay: (v) => set({ timeOfDay: v }),
  setSeaState: (v) => set({ seaState: v }),
  setOceanY: (v) => set({ oceanY: v }),
  setOceanVisible: (v) => set({ oceanVisible: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setWeather: (w) => set({ weather: w }),
  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),
}));
