import React from "react";
import { OceanScene } from "./components/OceanScene";
import { DevEnvSettingsController } from "./components/DevEnvSettingsController";
import { useSceneStore } from "./store/useSceneStore";
import { Footprints, MousePointerClick, Navigation, LogOut } from "lucide-react";

export default function App() {
  const cameraMode = useSceneStore((state) => state.cameraMode);
  const setCameraMode = useSceneStore((state) => state.setCameraMode);
  const isPointerLocked = useSceneStore((state) => state.isPointerLocked);
  const isNearBoat = useSceneStore((state) => state.isNearBoat);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 3D Scene */}
      <OceanScene />

      {/* Bottom Right Environment Controls Toggle Panel */}
      <DevEnvSettingsController />

      {/* Walk Mode Proximity Boat Enter Prompt */}
      {cameraMode === "walk" && isNearBoat && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto">
          <button
            type="button"
            onClick={() => setCameraMode("boat")}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm border-2 border-white transition-all transform hover:scale-110 animate-bounce"
          >
            <Navigation className="w-5 h-5" />
            <span>Press [E] to Enter Speedboat 🚤</span>
          </button>
        </div>
      )}

      {/* Walk Mode Controls Banner */}
      {cameraMode === "walk" && (
        <div className="fixed bottom-6 left-6 z-30 pointer-events-none">
          <div className="bg-zinc-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs shadow-xl border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <Footprints className="w-4 h-4 text-zinc-400" />
              <span>Walk:</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">W</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">A</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">S</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">D</kbd>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">Space</kbd>
              <span className="text-zinc-500">Jump</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">Shift</kbd>
              <span className="text-zinc-500">Run</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">Q</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">E</kbd>
              <span className="text-zinc-500">Turn</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MousePointerClick className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isPointerLocked ? "Locked (Esc exit)" : "Click canvas"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Boat Driving Mode Controls Banner */}
      {cameraMode === "boat" && (
        <div className="fixed bottom-6 left-6 z-30 pointer-events-auto flex items-center gap-3">
          <div className="bg-zinc-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs shadow-xl border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300 font-medium">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Boat Controls:</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">W</kbd>
              <span className="text-zinc-500">Accel</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">S</kbd>
              <span className="text-zinc-500">Reverse</span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">A</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">D</kbd>
              <span className="text-zinc-500">Steer</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCameraMode("walk")}
            className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-cyan-400 hover:text-cyan-300 px-4 py-2.5 rounded-2xl text-xs font-medium flex items-center gap-2 shadow-xl backdrop-blur-md transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Boat [E]</span>
          </button>
        </div>
      )}

      {/* Subtle Vignette */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent 30%), radial-gradient(ellipse 130% 100% at 50% 40%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      />
    </main>
  );
}
