import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getInterpolatedPalette } from "../data/timeOfDayPalettes";

interface SkyDomeProps {
  radius?: number;
  timeOfDay?: number;
}

const SkyVertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const SkyFragmentShader = `
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform vec3 uDeepColor;

varying vec3 vWorldPosition;

vec2 hash2(vec2 p) {
  vec2 h = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(h) * 43758.5453) * 2.0 - 1.0;
}

float gradNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float n00 = dot(hash2(i), f);
  float n10 = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float n01 = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float n11 = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

float fbm(vec2 p) {
  return gradNoise(p) +
         gradNoise(p * 2.04 + vec2(17.3, 9.1)) * 0.5 +
         gradNoise(p * 4.11 + vec2(42.7, 28.6)) * 0.25;
}

vec3 getSkyColor(vec3 dir) {
  vec3 normDir = normalize(dir);
  float up = clamp(normDir.y, -0.15, 1.0);
  vec3 sky = mix(uHorizonColor, uZenithColor, pow(max(up, 0.0), 0.42));

  vec3 hazeColor = uDeepColor * 1.4 + uHorizonColor * 0.25;
  sky = mix(sky, hazeColor, 1.0 - smoothstep(-0.15, 0.0, normDir.y));

  float s = max(dot(normDir, uSunDir), 0.0);
  sky += uSunColor * pow(s, 10.0) * 0.18;
  sky += uSunColor * smoothstep(0.9994, 0.9998, s) * 30.0;
  return sky;
}

void main() {
  vec3 dir = normalize(vWorldPosition);
  vec3 color = getSkyColor(dir);

  // Procedural horizon cloud band
  float band = smoothstep(0.03, 0.16, dir.y) * (1.0 - smoothstep(0.22, 0.6, dir.y));
  vec2 cloudUV = (dir.xz / (dir.y + 0.18)) * 0.55;
  vec2 cloudDrift = vec2(uTime * 0.006, uTime * 0.003);
  float cloudNoise = fbm(cloudUV + cloudDrift) * 0.5 + 0.5;
  float clouds = smoothstep(0.62, 0.95, cloudNoise) * band;
  vec3 cloudColor = mix(vec3(0.92, 0.9, 0.87), uSunColor, 0.25);
  color = mix(color, cloudColor, clamp(clouds * 0.6, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
`;

export function SkyDome({ radius = 2500, timeOfDay = 0.6 }: SkyDomeProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeOfDayRef = useRef(timeOfDay);

  useEffect(() => {
    timeOfDayRef.current = timeOfDay;
  }, [timeOfDay]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uSunColor: { value: new THREE.Color(1, 0.93, 0.8).multiplyScalar(1.6) },
      uHorizonColor: { value: new THREE.Color(0.52, 0.68, 0.82) },
      uZenithColor: { value: new THREE.Color(0.07, 0.2, 0.42) },
      uDeepColor: { value: new THREE.Color(0.015, 0.09, 0.11) },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value += delta;

    const palette = getInterpolatedPalette(timeOfDayRef.current);
    u.uSunDir.value.copy(palette.sunDir);
    u.uSunColor.value.copy(palette.sunColor);
    u.uHorizonColor.value.copy(palette.horizonColor);
    u.uZenithColor.value.copy(palette.zenithColor);
    u.uDeepColor.value.copy(palette.deepColor);
  });

  return (
    <mesh name="sky" frustumCulled={false}>
      <sphereGeometry args={[radius, 32, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={SkyVertexShader}
        fragmentShader={SkyFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
