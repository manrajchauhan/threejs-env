import { create } from "zustand";

export type CameraMode = "orbit" | "walk" | "boat";
export type WeatherType = "clear" | "rain" | "storm";

interface SceneState {
  timeOfDay: number; // 0 to 1
  seaState: number; // 0 to 1.5
  oceanY: number; // Y height offset
  oceanVisible: boolean;
  autoRotate: boolean;
  cameraMode: CameraMode;
  weather: WeatherType;
  audioMuted: boolean;
  isPointerLocked: boolean;
  setTimeOfDay: (v: number) => void;
  setSeaState: (v: number) => void;
  setOceanY: (v: number) => void;
  setOceanVisible: (v: boolean) => void;
  setAutoRotate: (v: boolean) => void;
  setCameraMode: (mode: CameraMode) => void;
  setWeather: (w: WeatherType) => void;
  setAudioMuted: (muted: boolean) => void;
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
  audioMuted: true,
  isPointerLocked: false,
  setTimeOfDay: (v) => set({ timeOfDay: v }),
  setSeaState: (v) => set({ seaState: v }),
  setOceanY: (v) => set({ oceanY: v }),
  setOceanVisible: (v) => set({ oceanVisible: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setWeather: (w) => set({ weather: w }),
  setAudioMuted: (muted) => set({ audioMuted: muted }),
  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),
}));
