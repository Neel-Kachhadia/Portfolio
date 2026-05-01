"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMotionPreference } from "@/components/useMotionPreference";

type Rail = {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  height?: number;
};

type Plate = {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
};

const INK = "#1A1612";
const PAPER = "#EDE8DE";
const CREAM = "#F5F0E8";
const ELECTRIC = "#4AFF91";
const BLUEPRINT = "#2E5E4E";
const CLAY = "#B65B3A";

const rails: Rail[] = [
  { id: "intake-a", from: [-4.2, -1.6, 0.08], to: [-2.45, -1.6, 0.08] },
  { id: "gate-up", from: [-2.45, -1.6, 0.08], to: [-2.45, 0.35, 0.08] },
  { id: "memory-a", from: [-2.45, 0.35, 0.08], to: [-0.8, 0.35, 0.08] },
  { id: "switch-a", from: [-0.8, 0.35, 0.08], to: [-0.8, -0.9, 0.08] },
  { id: "model-a", from: [-0.8, -0.9, 0.08], to: [1.25, -0.9, 0.08] },
  { id: "decision-a", from: [1.25, -0.9, 0.08], to: [1.25, 0.95, 0.08] },
  { id: "dispatch-a", from: [1.25, 0.95, 0.08], to: [4.05, 0.95, 0.08] },
  { id: "lower-return", from: [0.18, -1.85, 0.06], to: [3.4, -1.85, 0.06], color: BLUEPRINT },
  { id: "lower-up", from: [3.4, -1.85, 0.06], to: [3.4, 0.18, 0.06], color: BLUEPRINT },
  { id: "human-lane", from: [-3.85, 1.5, 0.07], to: [0.1, 1.5, 0.07], color: CLAY },
  { id: "human-drop", from: [0.1, 1.5, 0.07], to: [0.1, 0.35, 0.07], color: CLAY },
  { id: "cross-cut", from: [-3.25, -0.45, 0.05], to: [2.65, -0.45, 0.05], color: INK },
];

const plates: Plate[] = [
  { id: "raw", position: [-3.7, -1.6, 0.12], size: [0.9, 0.46, 0.08], color: CREAM },
  { id: "gate", position: [-2.45, -0.45, 0.16], size: [0.42, 1.25, 0.1], color: PAPER },
  { id: "memory", position: [-1.18, 0.35, 0.15], size: [1.16, 0.58, 0.1], color: CREAM },
  { id: "model", position: [0.28, -0.9, 0.18], size: [1.9, 0.72, 0.12], color: PAPER },
  { id: "decision", position: [1.25, 0.28, 0.2], size: [0.68, 1.38, 0.12], color: CREAM },
  { id: "dispatch", position: [3.42, 0.95, 0.14], size: [1.16, 0.5, 0.09], color: PAPER },
  { id: "archive", position: [2.1, -1.85, 0.11], size: [2.2, 0.42, 0.08], color: CREAM },
  { id: "human", position: [-1.95, 1.5, 0.13], size: [1.74, 0.44, 0.08], color: "#F4E7D8" },
];

function useInView(ref: React.RefObject<HTMLElement>) {
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

function MachineBase() {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: CREAM,
        transparent: true,
        opacity: 0.72,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <group>
      <mesh position={[0, 0, -0.08]} rotation={[0, 0, -0.018]}>
        <boxGeometry args={[9.2, 4.6, 0.05]} />
        <primitive attach="material" object={material} />
      </mesh>
      <gridHelper
        args={[9.2, 18, "rgba(26,22,18,0.18)", "rgba(26,22,18,0.07)"]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -0.045]}
      />
    </group>
  );
}

function RailBar({ rail, active }: { rail: Rail; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const start = new THREE.Vector3(...rail.from);
  const end = new THREE.Vector3(...rail.to);
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const length = start.distanceTo(end);
  const isVertical = Math.abs(start.x - end.x) < 0.01;
  const color = rail.color ?? INK;

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const signal = active ? 0.35 + Math.sin(state.clock.elapsedTime * 5.2) * 0.18 : 0;
    materialRef.current.opacity = color === ELECTRIC ? 0.78 : 0.38 + signal;
    meshRef.current.position.z =
      midpoint.z + (active ? Math.sin(state.clock.elapsedTime * 2.8) * 0.018 : 0);
  });

  return (
    <mesh
      ref={meshRef}
      position={midpoint}
      rotation={[0, 0, isVertical ? Math.PI / 2 : 0]}
    >
      <boxGeometry args={[length, rail.height ?? 0.035, 0.035]} />
      <meshBasicMaterial
        ref={materialRef}
        color={active ? ELECTRIC : color}
        transparent
        opacity={0.42}
      />
    </mesh>
  );
}

function PlateBlock({ plate, index }: { plate: Plate; index: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.z =
      plate.position[2] + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.018;
  });

  return (
    <group ref={groupRef} position={plate.position}>
      <mesh>
        <boxGeometry args={plate.size} />
        <meshBasicMaterial color={plate.color} transparent opacity={0.9} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...plate.size)]} />
        <lineBasicMaterial color={INK} transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

function GateTeeth({ opened }: { opened: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.7) * 0.025;
  });

  return (
    <group ref={groupRef} position={[1.25, 0.28, 0.36]}>
      {[-0.42, -0.14, 0.14, 0.42].map((y, index) => (
        <mesh
          key={y}
          position={[opened ? (index % 2 ? 0.2 : -0.2) : 0, y, 0]}
          rotation={[0, 0, index % 2 ? 0.8 : -0.8]}
        >
          <boxGeometry args={[0.48, 0.035, 0.035]} />
          <meshBasicMaterial color={opened ? ELECTRIC : INK} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function Signal({ activation }: { activation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const route = useMemo(() => {
    const points = rails.slice(0, 7).flatMap((rail, index) =>
      index === 0 ? [rail.from, rail.to] : [rail.to],
    );
    return points.map((point) => new THREE.Vector3(...point));
  }, []);
  const activationRef = useRef(activation);
  const startedAt = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    if (activationRef.current !== activation) {
      activationRef.current = activation;
      startedAt.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startedAt.current;
    const total = route.length - 1;
    const raw = (elapsed * 1.45) % total;
    const index = Math.floor(raw);
    const progress = raw - index;
    const from = route[index];
    const to = route[Math.min(index + 1, route.length - 1)];

    meshRef.current.position.lerpVectors(from, to, progress);
    meshRef.current.scale.setScalar(1.1 + Math.sin(elapsed * 10) * 0.28);
    materialRef.current.opacity = 0.86;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.065, 20, 20]} />
      <meshBasicMaterial ref={materialRef} color={ELECTRIC} transparent opacity={0.88} />
    </mesh>
  );
}

function MachineScene({
  activation,
  opened,
}: {
  activation: number;
  opened: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.72 + state.pointer.y * 0.08,
      0.045,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -0.02 + state.pointer.x * 0.035,
      0.045,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      opened ? 0 : -0.28,
      0.04,
    );
  });

  return (
    <group ref={groupRef} scale={[1.04, 1.04, 1]}>
      <MachineBase />
      {rails.map((rail, index) => (
        <RailBar
          key={rail.id}
          rail={rail}
          active={opened && index <= (activation % rails.length) + 2}
        />
      ))}
      {plates.map((plate, index) => (
        <PlateBlock key={plate.id} plate={plate} index={index} />
      ))}
      <GateTeeth opened={opened} />
      <Signal activation={activation} />
    </group>
  );
}

function StaticMachine() {
  return (
    <svg viewBox="0 0 900 460" className="h-full w-full" role="img" aria-label="Machine under paper">
      <rect x="24" y="34" width="852" height="390" fill={CREAM} opacity="0.75" />
      <g fill="none" strokeLinecap="square" strokeWidth="4">
        <path d="M70 330 H250 V170 H405 V260 H610 V112 H830" stroke={ELECTRIC} />
        <path d="M260 86 H520 V330 H740" stroke={BLUEPRINT} opacity="0.7" />
        <path d="M90 128 H376 V86 H700" stroke={CLAY} opacity="0.62" />
      </g>
      <g fill={PAPER} stroke={INK} strokeOpacity="0.24">
        <rect x="72" y="306" width="110" height="48" />
        <rect x="344" y="236" width="136" height="62" />
        <rect x="578" y="86" width="142" height="52" />
        <rect x="246" y="70" width="120" height="46" />
      </g>
    </svg>
  );
}

export default function IntelligenceCore({
  activation,
  opened,
}: {
  activation: number;
  opened: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const { isMotionEnabled } = useMotionPreference();

  return (
    <div ref={containerRef} className="relative h-full w-full" aria-label="Spatial reasoning machine">
      {!isMotionEnabled ? (
        <StaticMachine />
      ) : (
        <Canvas
          aria-hidden="true"
          orthographic
          camera={{ position: [0, 0, 7], zoom: 76 }}
          dpr={[1, 1.35]}
          frameloop={isInView ? "always" : "demand"}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <MachineScene activation={activation} opened={opened} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
