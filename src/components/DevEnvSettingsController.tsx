import React, { useState } from "react";
import { useSceneStore, WeatherType } from "../store/useSceneStore";
import { getInterpolatedPalette } from "../data/timeOfDayPalettes";
import { audioEngine } from "../utils/audioEngine";
import { Sliders, Sun, Waves, Eye, EyeOff, RotateCw, Layers, Footprints, Camera, X, CloudRain, CloudLightning, Download, Volume2, VolumeX } from "lucide-react";

export function DevEnvSettingsController() {
  const [isOpen, setIsOpen] = useState(false);

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
  const cameraMode = useSceneStore((state) => state.cameraMode);
  const setCameraMode = useSceneStore((state) => state.setCameraMode);
  const weather = useSceneStore((state) => state.weather);
  const setWeather = useSceneStore((state) => state.setWeather);
  const audioMuted = useSceneStore((state) => state.audioMuted);
  const setAudioMuted = useSceneStore((state) => state.setAudioMuted);

  const palette = getInterpolatedPalette(timeOfDay);

  const getSeaStateLabel = (val: number) => {
    if (val < 0.3) return "Calm";
    if (val < 0.6) return "Gentle";
    if (val < 1.0) return "Moderate";
    return "Rough";
  };

  const handleSnapshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `ocean-sky-snapshot-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleWeatherChange = (mode: WeatherType) => {
    setWeather(mode);
    if (mode === "storm") {
      setSeaState(1.3);
    } else if (mode === "clear") {
      setSeaState(0.6);
    }
  };

  const toggleAudio = () => {
    const nextMuted = !audioMuted;
    audioEngine.setMuted(nextMuted);
    setAudioMuted(nextMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto flex flex-col items-end gap-3">
      {/* Settings Panel Modal */}
      {isOpen && (
        <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl w-80 shadow-2xl transition-all duration-200 text-zinc-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-medium text-white">Environment Controls</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {palette.name}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Mode */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Camera Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCameraMode("orbit")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  cameraMode === "orbit"
                    ? "bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold"
                    : "bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Orbit View
              </button>
              <button
                type="button"
                onClick={() => setCameraMode("walk")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  cameraMode === "walk"
                    ? "bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold"
                    : "bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Footprints className="w-3.5 h-3.5" /> Walk Mode
              </button>
            </div>
          </div>

          {/* Weather Preset Selector */}
          <div className="mb-4">
            <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Weather Preset
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleWeatherChange("clear")}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                  weather === "clear"
                    ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                    : "bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Sun className="w-3 h-3" /> Clear
              </button>
              <button
                type="button"
                onClick={() => handleWeatherChange("rain")}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                  weather === "rain"
                    ? "bg-cyan-400/20 border-cyan-400/50 text-cyan-300"
                    : "bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <CloudRain className="w-3 h-3" /> Rain
              </button>
              <button
                type="button"
                onClick={() => handleWeatherChange("storm")}
                className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
                  weather === "storm"
                    ? "bg-indigo-400/20 border-indigo-400/50 text-indigo-300"
                    : "bg-zinc-800/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <CloudLightning className="w-3 h-3" /> Storm
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 text-xs">
            {/* Time of Day */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Time of Day
                </span>
                <span className="font-mono text-zinc-300">{(timeOfDay * 24).toFixed(1)}h</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                className="w-full accent-zinc-200 bg-zinc-800"
              />
            </div>

            {/* Sea State */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Waves className="w-3.5 h-3.5 text-blue-400" /> Sea Turbulence
                </span>
                <span className="font-mono text-zinc-300">{getSeaStateLabel(seaState)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.5}
                step={0.05}
                value={seaState}
                onChange={(e) => setSeaState(parseFloat(e.target.value))}
                className="w-full accent-zinc-200 bg-zinc-800"
              />
            </div>

            {/* Ocean Level Y */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" /> Ocean Level (Y)
                </span>
                <span className="font-mono text-zinc-300">{oceanY.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min={-10}
                max={5}
                step={0.5}
                value={oceanY}
                onChange={(e) => setOceanY(parseFloat(e.target.value))}
                className="w-full accent-zinc-200 bg-zinc-800"
              />
            </div>

            {/* Audio & Snapshot & Toggles */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={toggleAudio}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl border text-xs font-medium transition-all ${
                  !audioMuted
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {!audioMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                Audio
              </button>

              <button
                type="button"
                onClick={() => setOceanVisible(!oceanVisible)}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl border text-xs font-medium transition-all ${
                  oceanVisible
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {oceanVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                Ocean
              </button>

              <button
                type="button"
                onClick={handleSnapshot}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Right Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium shadow-xl backdrop-blur-md transition-all hover:scale-105"
      >
        <Sliders className="w-4 h-4 text-zinc-300" />
        <span>Controls</span>
      </button>
    </div>
  );
}
