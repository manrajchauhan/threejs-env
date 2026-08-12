import React from "react";
import { useSceneStore } from "../store/useSceneStore";
import { getInterpolatedPalette } from "../data/timeOfDayPalettes";
import { Sliders, Sun, Waves, Eye, EyeOff, RotateCw, Layers } from "lucide-react";

export function DevEnvSettingsController() {
  const timeOfDay = useSceneStore((state) => state.timeOfDay);
  const setTimeOfDay = useSceneStore((state) => state.setTimeOfDay);
  const seaState = useSceneStore((state) => state.seaState);
  const setSeaState = useSceneStore((state) => state.setSeaState);
  const oceanY = useSceneStore((state) => state.oceanY);
  const setOceanY = useSceneStore((state) => state.setOceanY);
  const oceanVisible = useSceneStore((state) => state.oceanVisible);
  const setOceanVisible = useSceneStore((state) => state.setOceanVisible);
  const autoRotate = useSceneStore((state) => state.autoRotate);
  const setAutoRotate = useSceneStore((state) => state.setAutoRotate);

  const palette = getInterpolatedPalette(timeOfDay);

  const getSeaStateLabel = (val: number) => {
    if (val < 0.3) return "Calm / Flat";
    if (val < 0.6) return "Gentle Swell";
    if (val < 1.0) return "Moderate Waves";
    return "Heavy Choppy";
  };

  return (
    <div className="fixed top-6 left-6 z-30 pointer-events-auto">
      <div className="glass-panel p-5 rounded-2xl w-80 shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Environment Controls</h2>
              <p className="text-[11px] text-zinc-400">Gerstner Ocean & Spectral Sky</p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            {palette.name}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Time of Day */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Time of Day
              </span>
              <span className="font-mono text-cyan-400">{(timeOfDay * 24).toFixed(1)}h</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
            />
          </div>

          {/* Sea State */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Waves className="w-3.5 h-3.5 text-cyan-400" /> Sea Turbulence
              </span>
              <span className="font-mono text-cyan-400">{getSeaStateLabel(seaState)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={seaState}
              onChange={(e) => setSeaState(parseFloat(e.target.value))}
            />
          </div>

          {/* Ocean Level Y */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Layers className="w-3.5 h-3.5 text-zinc-400" /> Ocean Level (Y)
              </span>
              <span className="font-mono text-cyan-400">{oceanY.toFixed(1)}m</span>
            </div>
            <input
              type="range"
              min={-10}
              max={5}
              step={0.5}
              value={oceanY}
              onChange={(e) => setOceanY(parseFloat(e.target.value))}
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setOceanVisible(!oceanVisible)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                oceanVisible
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {oceanVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              Ocean Mesh
            </button>

            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                autoRotate
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
              Auto Orbit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
