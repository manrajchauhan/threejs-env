import React from "react";
import { OceanScene } from "./components/OceanScene";
import { DevEnvSettingsController } from "./components/DevEnvSettingsController";

export default function App() {
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
