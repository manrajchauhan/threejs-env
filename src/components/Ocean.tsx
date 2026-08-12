import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getInterpolatedPalette } from "../data/timeOfDayPalettes";

interface OceanProps {
  position?: [number, number, number];
  size?: number;
  segments?: number;
  seaState?: number;
  timeOfDay?: number;
}

const OceanVertexShader = `
uniform float uTime;
uniform float uSeaState;

varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying float vCrest;

struct Wave {
  vec2 dir;
  float wavelength;
  float steepness;
};

const int NUM_WAVES = 5;
Wave WAVES[5] = Wave[5](
  Wave(vec2(1.0, 0.0), 60.0, 0.12),
  Wave(vec2(0.6, 0.8), 31.0, 0.12),
  Wave(vec2(-0.7, 0.7), 18.0, 0.09),
  Wave(vec2(0.3, -0.95), 9.5, 0.07),
  Wave(vec2(-0.35, -0.94), 5.0, 0.05)
);

const float PI = 3.14159265359;

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 xz = position.xy;

  vec3 displacedPos = vec3(xz.x, 0.0, xz.y);
  vec3 tangent = vec3(1.0, 0.0, 0.0);
  vec3 binormal = vec3(0.0, 0.0, 1.0);
  float crest = 0.0;

  for (int i = 0; i < NUM_WAVES; i++) {
    vec2 dir = normalize(WAVES[i].dir);
    float k = (2.0 * PI) / WAVES[i].wavelength;
    float c = sqrt(9.8 * k);
    float a = (WAVES[i].steepness * uSeaState) / k;
    float phase = k * (dot(dir, xz) - uTime * c);

    float s = sin(phase);
    float co = cos(phase);

    displacedPos.x += a * dir.x * co;
    displacedPos.y += a * s;
    displacedPos.z += a * dir.y * co;

    crest += a * s;

    float q = WAVES[i].steepness * uSeaState;
    tangent.x -= q * dir.x * dir.x * s;
    tangent.y += q * dir.x * co;
    tangent.z -= q * dir.x * dir.y * s;

    binormal.x -= q * dir.x * dir.y * s;
    binormal.y += q * dir.y * co;
    binormal.z -= q * dir.y * dir.y * s;
  }

  vCrest = crest;
  vec3 normal = normalize(cross(binormal, tangent));

  vec4 worldPosition = modelMatrix * vec4(displacedPos, 1.0);
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const OceanFragmentShader = `
uniform float uTime;
uniform float uSeaState;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform vec3 uDeepColor;
uniform vec3 uShallowColor;

varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vWorldNormal;
varying float vCrest;

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

float detailHeight(vec2 xz, float time) {
  vec2 driftA = vec2(time * 0.55, time * 0.32);
  vec2 driftB = vec2(time * -0.4, time * 0.5);
  return fbm(xz * 0.85 + driftA) + fbm(xz * 2.1 + driftB) * 0.45;
}

vec3 getSkyColor(vec3 dir, vec3 sunDir, vec3 sunColor, vec3 horizonColor, vec3 zenithColor, vec3 deepColor) {
  vec3 normDir = normalize(dir);
  float up = clamp(normDir.y, -0.15, 1.0);
  vec3 sky = mix(horizonColor, zenithColor, pow(max(up, 0.0), 0.42));

  vec3 hazeColor = deepColor * 1.4 + horizonColor * 0.25;
  sky = mix(sky, hazeColor, 1.0 - smoothstep(-0.15, 0.0, normDir.y));

  float s = max(dot(normDir, sunDir), 0.0);
  sky += sunColor * pow(s, 10.0) * 0.18;
  sky += sunColor * smoothstep(0.9994, 0.9998, s) * 30.0;
  return sky;
}

void main() {
  vec2 xz = vWorldPosition.xz;
  vec3 V = normalize(cameraPosition - vWorldPosition);

  float h0 = detailHeight(xz, uTime);
  float hx = detailHeight(xz + vec2(0.1, 0.0), uTime);
  float hz = detailHeight(xz + vec2(0.0, 0.1), uTime);
  vec3 detail = vec3(h0 - hx, 0.0, h0 - hz) * (1.5 * (uSeaState * 0.6 + 0.4));
  vec3 N = normalize(vWorldNormal + detail);

  float crest = vCrest;

  // Body color & Subsurface Scattering (SSS)
  vec3 body = mix(uDeepColor, uShallowColor, clamp(crest * 0.35 + 0.45, 0.0, 1.0));
  float sss = pow(max(dot(V, uSunDir), 0.0), 3.0) * max(crest, 0.0) * 0.18;
  body += mix(uShallowColor, uSunColor, 0.5) * sss;

  // Sky reflection
  vec3 R = reflect(-V, N);
  R.y = max(R.y, 0.04);
  R = normalize(R);

  // Schlick Fresnel
  float fresnel = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 sky = getSkyColor(R, uSunDir, uSunColor, uHorizonColor, uZenithColor, uDeepColor);
  vec3 color = mix(body, sky, fresnel);

  // Specular glitter
  vec3 H = normalize(uSunDir + V);
  float glitterNoise = fbm(xz * 2.1 + vec2(uTime * -0.4, uTime * 0.5)) * 0.5 + 0.5;
  float glitter = pow(max(dot(N, H), 0.0), 500.0) * mix(0.4, 3.4, glitterNoise);
  float sheen = pow(max(dot(N, H), 0.0), 48.0) * 0.12;
  color += uSunColor * (glitter + sheen);

  // Crest foam
  float foamNoise = fbm(xz * 1.1 + vec2(uTime * 0.22, uTime * 0.14)) * 0.5 + 0.5;
  float foam = smoothstep(0.5, 0.95, foamNoise) * smoothstep(0.8, 1.8, crest);
  color = mix(color, vec3(0.82, 0.88, 0.9), clamp(foam * 0.85, 0.0, 1.0));

  // Distance fog haze
  float camDist = distance(cameraPosition, vWorldPosition);
  color = mix(color, uHorizonColor, smoothstep(200.0, 600.0, camDist));

  gl_FragColor = vec4(color, 1.0);
}
`;

export function Ocean({
  position = [0, -1.5, 0],
  size = 1200,
  segments = 250,
  seaState = 0.6,
  timeOfDay = 0.6,
}: OceanProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const seaStateRef = useRef(seaState);
  const timeOfDayRef = useRef(timeOfDay);

  useEffect(() => { seaStateRef.current = seaState; }, [seaState]);
  useEffect(() => { timeOfDayRef.current = timeOfDay; }, [timeOfDay]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeaState: { value: seaState },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uSunColor: { value: new THREE.Color(1, 0.93, 0.8).multiplyScalar(1.6) },
      uHorizonColor: { value: new THREE.Color(0.52, 0.68, 0.82) },
      uZenithColor: { value: new THREE.Color(0.07, 0.2, 0.42) },
      uDeepColor: { value: new THREE.Color(0.015, 0.09, 0.11) },
      uShallowColor: { value: new THREE.Color(0.06, 0.32, 0.36) },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uTime.value += delta * 0.8;
    u.uSeaState.value = seaStateRef.current;

    const palette = getInterpolatedPalette(timeOfDayRef.current);
    u.uSunDir.value.copy(palette.sunDir);
    u.uSunColor.value.copy(palette.sunColor);
    u.uHorizonColor.value.copy(palette.horizonColor);
    u.uZenithColor.value.copy(palette.zenithColor);
    u.uDeepColor.value.copy(palette.deepColor);
    u.uShallowColor.value.copy(palette.shallowColor);
  });

  return (
    <mesh name="ocean" position={position} frustumCulled={false}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={OceanVertexShader}
        fragmentShader={OceanFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
