import React from "react";
import { OceanScene } from "./components/OceanScene";
import { DevEnvSettingsController } from "./components/DevEnvSettingsController";
import { useSceneStore } from "./store/useSceneStore";
import { Footprints, MousePointerClick } from "lucide-react";

export default function App() {
  const cameraMode = useSceneStore((state) => state.cameraMode);
  const isPointerLocked = useSceneStore((state) => state.isPointerLocked);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 3D R3F Environment */}
      <OceanScene />

      {/* Glassmorphic UI Controller Overlay */}
      <DevEnvSettingsController />

      {/* Top Right POW Badge */}
      <div className="fixed top-6 right-6 z-30 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-xl text-right">
          <h1 className="text-sm font-semibold text-white tracking-tight">Open Sea & Sky Showcase</h1>
          <p className="text-[11px] text-cyan-400 font-mono">Proof of Work Project &middot; 3D Shader Engine</p>
        </div>
      </div>

      {/* Walk Mode Controls Banner */}
      {cameraMode === "walk" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="glass-panel px-5 py-2.5 rounded-2xl flex items-center gap-4 text-xs shadow-2xl border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300 font-medium">
              <Footprints className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Walk Controls:</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">W</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">A</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">S</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">D</kbd>
              <span className="text-zinc-500">to move</span>
            </div>
            <span className="text-zinc-600">|</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono">Shift</kbd>
              <span className="text-zinc-500">to sprint</span>
            </div>
            <span className="text-zinc-600">|</span>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{isPointerLocked ? "Locked (Esc to exit)" : "Click canvas to look around"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Vignette */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(3, 5, 8, 0.4), transparent 30%), radial-gradient(ellipse 130% 100% at 50% 40%, transparent 50%, rgba(3, 5, 8, 0.6) 100%)",
        }}
      />
    </main>
  );
}
