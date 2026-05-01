"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionPreference } from "@/components/useMotionPreference";

type Track = {
  id: string;
  points: [number, number, number][];
  signal?: boolean;
};

type Plate = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity: number;
};

const TRACKS: Track[] = [
  {
    id: "primary",
    signal: true,
    points: [
      [-4.6, -1.72, 0.12],
      [-3.42, -1.72, 0.12],
      [-3.42, -0.64, 0.18],
      [-1.42, -0.64, 0.18],
      [-1.42, 0.56, 0.2],
      [0.78, 0.56, 0.2],
      [0.78, -0.18, 0.24],
      [2.74, -0.18, 0.24],
      [2.74, 0.88, 0.2],
      [4.72, 0.88, 0.18],
    ],
  },
  {
    id: "memory",
    points: [
      [-1.42, -0.64, 0.15],
      [-0.52, -0.64, 0.15],
      [-0.52, -1.42, 0.16],
      [1.34, -1.42, 0.16],
      [1.34, -0.18, 0.18],
    ],
  },
  {
    id: "judgment",
    points: [
      [-3.92, 1.14, 0.14],
      [-2.44, 1.14, 0.14],
      [-2.44, 0.16, 0.16],
      [-0.16, 0.16, 0.16],
      [-0.16, 1.42, 0.15],
      [1.98, 1.42, 0.15],
    ],
  },
  {
    id: "return",
    points: [
      [0.82, 0.56, 0.16],
      [2.02, 0.56, 0.16],
      [2.02, -1.18, 0.16],
      [3.74, -1.18, 0.16],
      [3.74, 0.88, 0.16],
    ],
  },
];

const PLATES: Plate[] = [
  {
    id: "bed-left",
    position: [-3.42, -0.64, -0.02],
    size: [1.35, 1.96, 0.12],
    color: "#2A251F",
    opacity: 0.9,
  },
  {
    id: "gate-a",
    position: [-1.42, -0.64, 0.01],
    size: [1.58, 0.92, 0.16],
    color: "#EDE8DE",
    opacity: 0.16,
  },
  {
    id: "memory-bed",
    position: [0.48, -1.42, 0],
    size: [2.22, 0.72, 0.14],
    color: "#F5F0E8",
    opacity: 0.12,
  },
  {
    id: "gate-b",
    position: [0.78, 0.56, 0.04],
    size: [1.42, 1.04, 0.18],
    color: "#EDE8DE",
    opacity: 0.18,
  },
  {
    id: "dispatch",
    position: [2.74, -0.18, 0.03],
    size: [1.64, 1.18, 0.16],
    color: "#F5F0E8",
    opacity: 0.15,
  },
  {
    id: "right-rail",
    position: [3.74, 0.88, -0.01],
    size: [1.92, 0.58, 0.14],
    color: "#EDE8DE",
    opacity: 0.14,
  },
  {
    id: "human-slit",
    position: [-2.44, 1.14, 0],
    size: [1.72, 0.54, 0.12],
    color: "#B65B3A",
    opacity: 0.16,
  },
];

function makeRoute(points: [number, number, number][]) {
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(points.map((point) => new THREE.Vector3(...point)));
  return geometry;
}

function getPointOnRoute(points: THREE.Vector3[], progress: number) {
  const segmentLengths: number[] = [];
  let total = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const length = points[index].distanceTo(points[index + 1]);
    segmentLengths.push(length);
    total += length;
  }

  let cursor = (progress % 1) * total;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    if (cursor <= segmentLengths[index]) {
      return new THREE.Vector3().lerpVectors(
        points[index],
        points[index + 1],
        cursor / segmentLengths[index],
      );
    }
    cursor -= segmentLengths[index];
  }

  return points[points.length - 1].clone();
}

function useInView(ref: React.RefObject<HTMLDivElement>) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "180px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

function MachineSkin() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uInk: { value: new THREE.Color("#F5F0E8") },
          uSignal: { value: new THREE.Color("#4AFF91") },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uInk;
          uniform vec3 uSignal;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          void main() {
            vec2 cells = abs(fract(vUv * vec2(22.0, 12.0)) - 0.5);
            float grooves = smoothstep(0.486, 0.5, max(cells.x, cells.y));
            float grain = hash(floor(vUv * 220.0 + uTime * 2.0));
            float chamber = smoothstep(0.42, 0.04, distance(vUv, vec2(0.58, 0.48)));
            vec3 color = mix(uInk, uSignal, chamber * 0.34);
            float alpha = grooves * 0.07 + grain * 0.035 + chamber * 0.08;
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    [],
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh position={[0, 0, -0.18]} scale={[10.8, 5.8, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
}

function PlateBlock({ plate }: { plate: Plate }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.z =
      plate.position[2] + Math.sin(state.clock.elapsedTime * 0.42 + plate.size[0]) * 0.018;
  });

  return (
    <mesh ref={meshRef} position={plate.position}>
      <boxGeometry args={plate.size} />
      <meshBasicMaterial color={plate.color} transparent opacity={plate.opacity} />
    </mesh>
  );
}

function TrackLine({ track, pulse }: { track: Track; pulse: number }) {
  const geometry = useMemo(() => makeRoute(track.points), [track.points]);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: track.signal ? "#4AFF91" : "#F5F0E8",
        transparent: true,
        opacity: track.signal ? 0.54 : 0.18,
      }),
    [track.signal],
  );
  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);
  const pulseRef = useRef(pulse);

  useFrame((state) => {
    if (pulseRef.current !== pulse) pulseRef.current = pulse;
    const breathe = Math.sin(state.clock.elapsedTime * 1.4 + pulseRef.current) * 0.08;
    material.opacity = track.signal ? 0.54 + breathe : 0.15 + breathe * 0.24;
  });

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <primitive object={line} />;
}

function SignalPacket({ pulse }: { pulse: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const points = useMemo(
    () => TRACKS[0].points.map((point) => new THREE.Vector3(...point)),
    [],
  );
  const pulseRef = useRef(pulse);
  const startedAt = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    if (pulseRef.current !== pulse) {
      pulseRef.current = pulse;
      startedAt.current = state.clock.elapsedTime;
    }

    const burst = (state.clock.elapsedTime - startedAt.current) * 0.82;
    const progress = burst > 0 && burst < 1.22 ? burst : state.clock.elapsedTime * 0.07;
    const point = getPointOnRoute(points, progress);

    meshRef.current.position.copy(point);
    meshRef.current.scale.setScalar(burst > 0 && burst < 1.22 ? 1.55 : 0.9);
    materialRef.current.opacity = burst > 0 && burst < 1.22 ? 0.92 : 0.48;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 18, 18]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#4AFF91"
        transparent
        opacity={0.72}
      />
    </mesh>
  );
}

function ArchitecturalBed({ pulse }: { pulse: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.24 + state.pointer.y * 0.035,
      0.035,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      0.22 + state.pointer.x * 0.055,
      0.035,
    );
    groupRef.current.rotation.z = -0.045;
  });

  return (
    <group ref={groupRef} scale={[1.08, 1.08, 1]}>
      <MachineSkin />
      {PLATES.map((plate) => (
        <PlateBlock key={plate.id} plate={plate} />
      ))}
      {TRACKS.map((track) => (
        <TrackLine key={track.id} track={track} pulse={pulse} />
      ))}
      <SignalPacket pulse={pulse} />
    </group>
  );
}

function StaticMachine() {
  return (
    <svg
      viewBox="0 0 900 520"
      className="h-full w-full"
      role="img"
      aria-label="Architectural machine layer under paper"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="900" height="520" fill="#1A1612" />
      <g fill="#F5F0E8" opacity="0.12">
        <rect x="110" y="250" width="138" height="100" />
        <rect x="270" y="178" width="174" height="74" />
        <rect x="420" y="316" width="218" height="62" />
        <rect x="568" y="190" width="160" height="92" />
        <rect x="682" y="122" width="144" height="52" />
      </g>
      <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
        <path
          d="M60 374 H194 V278 H330 V208 H516 V260 H644 V150 H838"
          stroke="#4AFF91"
          strokeWidth="4"
        />
        <path
          d="M330 208 H430 V342 H596 V260"
          stroke="#F5F0E8"
          strokeOpacity="0.22"
          strokeWidth="2"
        />
        <path
          d="M120 140 H260 V232 H470 V118 H720"
          stroke="#F5F0E8"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export default function IntelligenceCore({ pulse }: { pulse: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const { isMotionEnabled } = useMotionPreference();

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      aria-label="Architectural machine layer under paper"
    >
      {!isMotionEnabled ? (
        <StaticMachine />
      ) : (
        <Canvas
          aria-hidden="true"
          orthographic
          camera={{ position: [0, 0, 7], zoom: 70 }}
          dpr={[1, 1.35]}
          frameloop={isInView ? "always" : "demand"}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
        >
          <Suspense fallback={null}>
            <ArchitecturalBed pulse={pulse} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
