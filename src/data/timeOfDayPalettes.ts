import * as THREE from "three";

export interface TimeOfDayPalette {
  name: string;
  sunColor: THREE.Color;
  horizonColor: THREE.Color;
  zenithColor: THREE.Color;
  deepColor: THREE.Color;
  shallowColor: THREE.Color;
  sunElevation: number;
  sunAzimuth: number;
}

const PALETTES = [
  {
    t: 0.00, // Midnight
    name: "Night",
    sunColor: new THREE.Color("#1a2b4c").multiplyScalar(0.4),
    horizonColor: new THREE.Color("#050c1e"),
    zenithColor: new THREE.Color("#010511"),
    deepColor: new THREE.Color("#010814"),
    shallowColor: new THREE.Color("#041528"),
    elevation: -0.4,
    azimuth: -2.2,
  },
  {
    t: 0.20, // Dawn
    name: "Dawn",
    sunColor: new THREE.Color("#ffaa66").multiplyScalar(1.5),
    horizonColor: new THREE.Color("#e67e5a"),
    zenithColor: new THREE.Color("#1a2b56"),
    deepColor: new THREE.Color("#031326"),
    shallowColor: new THREE.Color("#0c354a"),
    elevation: 0.05,
    azimuth: -1.4,
  },
  {
    t: 0.40, // Morning
    name: "Morning",
    sunColor: new THREE.Color("#fff0c2").multiplyScalar(1.8),
    horizonColor: new THREE.Color("#85c1e9"),
    zenithColor: new THREE.Color("#1b4f72"),
    deepColor: new THREE.Color("#021a2e"),
    shallowColor: new THREE.Color("#0b5369"),
    elevation: 0.35,
    azimuth: -0.6,
  },
  {
    t: 0.60, // Midday
    name: "Midday",
    sunColor: new THREE.Color("#ffffff").multiplyScalar(2.0),
    horizonColor: new THREE.Color("#85b0d1"),
    zenithColor: new THREE.Color("#123456"),
    deepColor: new THREE.Color("#02121e"),
    shallowColor: new THREE.Color("#084c61"),
    elevation: 0.65,
    azimuth: 0.2,
  },
  {
    t: 0.80, // Sunset
    name: "Sunset",
    sunColor: new THREE.Color("#ff5522").multiplyScalar(2.4),
    horizonColor: new THREE.Color("#d35400"),
    zenithColor: new THREE.Color("#1f1435"),
    deepColor: new THREE.Color("#050f1a"),
    shallowColor: new THREE.Color("#1c2833"),
    elevation: 0.08,
    azimuth: 1.2,
  },
  {
    t: 1.00, // Midnight
    name: "Night",
    sunColor: new THREE.Color("#1a2b4c").multiplyScalar(0.4),
    horizonColor: new THREE.Color("#050c1e"),
    zenithColor: new THREE.Color("#010511"),
    deepColor: new THREE.Color("#010814"),
    shallowColor: new THREE.Color("#041528"),
    elevation: -0.4,
    azimuth: 2.2,
  },
];

export function getInterpolatedPalette(t: number) {
  const normT = Math.max(0, Math.min(1, t));

  let idx = 0;
  for (let i = 0; i < PALETTES.length - 1; i++) {
    if (normT >= PALETTES[i].t && normT <= PALETTES[i + 1].t) {
      idx = i;
      break;
    }
  }

  const p1 = PALETTES[idx];
  const p2 = PALETTES[idx + 1];
  const range = p2.t - p1.t;
  const localT = range > 0 ? (normT - p1.t) / range : 0;

  const smoothT = localT * localT * (3 - 2 * localT);

  const sunColor = new THREE.Color().lerpColors(p1.sunColor, p2.sunColor, smoothT);
  const horizonColor = new THREE.Color().lerpColors(p1.horizonColor, p2.horizonColor, smoothT);
  const zenithColor = new THREE.Color().lerpColors(p1.zenithColor, p2.zenithColor, smoothT);
  const deepColor = new THREE.Color().lerpColors(p1.deepColor, p2.deepColor, smoothT);
  const shallowColor = new THREE.Color().lerpColors(p1.shallowColor, p2.shallowColor, smoothT);

  const elevation = p1.elevation + (p2.elevation - p1.elevation) * smoothT;
  const azimuth = p1.azimuth + (p2.azimuth - p1.azimuth) * smoothT;

  const ce = Math.cos(elevation);
  const sunDir = new THREE.Vector3(
    ce * Math.sin(azimuth),
    Math.sin(elevation),
    -ce * Math.cos(azimuth)
  ).normalize();

  const name = localT < 0.5 ? p1.name : p2.name;

  return {
    name,
    sunColor,
    horizonColor,
    zenithColor,
    deepColor,
    shallowColor,
    sunDir,
  };
}
