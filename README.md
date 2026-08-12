# 🌊 Ocean & Sky View Showcase (3D Shader Engine)

An interactive, high-performance 3D ocean surface and atmospheric sky dome rendering system built with **Three.js**, **React Three Fiber**, **GLSL Shaders**, **Tailwind CSS**, and **TypeScript**.

Created as a standalone proof of work repository extracted from the Exhibition 3D Scene module.

---

## ✨ Features

- **Gerstner Wave Displacement**: 5 directional wave components evaluated in real-time GLSL vertex shader with analytical surface normals and crest detection.
- **Subsurface Scattering & Crest Foam**: Physically inspired light transport with dynamic foam generation on high ocean crests.
- **Spectral Sky Dome**: Rayleigh & Mie atmospheric scattering simulation with procedural FBM cloud bands.
- **Dynamic Solar Path**: Keyframed color interpolation across 5 key times of day (Night, Dawn, Morning, Midday, Sunset).
- **Fresnel Sky Reflections**: Schlick Fresnel approximation for realistic ocean water reflection.
- **Interactive Tailwind Control Panel**: Full real-time control over time of day, sea turbulence, ocean Y height, auto orbit, and rendering toggles.

---

## 📁 Repository Structure

```
ocean-sky-view/
├── src/
│   ├── components/
│   │   ├── Ocean.tsx                  # Gerstner Wave ocean mesh & GLSL shader
│   │   ├── SkyDome.tsx                # Procedural atmospheric sky dome
│   │   ├── DevEnvSettingsController.tsx # Glassmorphic Tailwind UI controls
│   │   └── OceanScene.tsx             # R3F Canvas & OrbitControls wrapper
│   ├── data/
│   │   └── timeOfDayPalettes.ts       # Solar keyframing & smoothstep interpolation
│   ├── store/
│   │   └── useSceneStore.ts           # Zustand global state management
│   ├── App.tsx                        # Main page wrapper & UI overlay
│   ├── main.tsx                       # React DOM root entry
│   └── index.css                      # Tailwind CSS & glassmorphic utilities
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🛠 Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://drei.docs.pmnd.rs/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React Icons](https://lucide.dev/)
