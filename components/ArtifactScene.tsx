"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { useMotionPreference } from "@/components/useMotionPreference";

type ArtifactSceneProps = {
  opened: boolean;
  activation: number;
};

type Transform = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const SIGNAL_POINTS = [
  new THREE.Vector3(-0.52, -1.55, 0.54),
  new THREE.Vector3(-0.52, -0.52, 0.54),
  new THREE.Vector3(0.42, -0.52, 0.54),
  new THREE.Vector3(0.42, 0.74, 0.54),
  new THREE.Vector3(-0.18, 0.74, 0.54),
  new THREE.Vector3(-0.18, 1.52, 0.54),
];

function pointOnPolyline(points: THREE.Vector3[], progress: number) {
  let total = 0;
  const lengths = points.slice(0, -1).map((point, index) => {
    const length = point.distanceTo(points[index + 1]);
    total += length;
    return length;
  });

  let cursor = THREE.MathUtils.clamp(progress, 0, 1) * total;

  for (let index = 0; index < lengths.length; index += 1) {
    if (cursor <= lengths[index]) {
      return new THREE.Vector3().lerpVectors(
        points[index],
        points[index + 1],
        cursor / lengths[index],
      );
    }
    cursor -= lengths[index];
  }

  return points[points.length - 1].clone();
}

function applyTransform(
  object: THREE.Object3D | null,
  closed: Transform,
  open: Transform,
  progress: number,
) {
  if (!object) return;

  object.position.set(
    THREE.MathUtils.lerp(closed.position[0], open.position[0], progress),
    THREE.MathUtils.lerp(closed.position[1], open.position[1], progress),
    THREE.MathUtils.lerp(closed.position[2], open.position[2], progress),
  );
  object.rotation.set(
    THREE.MathUtils.lerp(closed.rotation[0], open.rotation[0], progress),
    THREE.MathUtils.lerp(closed.rotation[1], open.rotation[1], progress),
    THREE.MathUtils.lerp(closed.rotation[2], open.rotation[2], progress),
  );
}

function CeramicPanel({
  meshRef,
  size,
}: {
  meshRef: RefObject<THREE.Mesh>;
  size: [number, number, number];
}) {
  return (
    <RoundedBox
      ref={meshRef}
      args={size}
      radius={0.055}
      smoothness={5}
    >
      <meshStandardMaterial
        color="#EDE6D7"
        roughness={0.72}
        metalness={0.06}
        envMapIntensity={0.48}
      />
    </RoundedBox>
  );
}

function ChamberRibs({
  progress,
}: {
  progress: MutableRefObject<{ value: number }>;
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#13110F",
        roughness: 0.58,
        metalness: 0.42,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <group>
      {[-1.3, -0.86, -0.42, 0.42, 0.86, 1.3].map((y) => (
        <mesh
          key={y}
          position={[0, y, 0.36]}
          scale={[1, 1, 1]}
        >
          <boxGeometry args={[1.28 + Math.abs(y) * 0.2, 0.035, 0.18]} />
          <primitive attach="material" object={material} />
        </mesh>
      ))}
      {[-0.68, 0.68].map((x) => (
        <mesh key={x} position={[x, 0, 0.34]}>
          <boxGeometry args={[0.04, 3.22, 0.2]} />
          <primitive attach="material" object={material} />
        </mesh>
      ))}
      <PulsePlate progress={progress} />
    </group>
  );
}

function PulsePlate({
  progress,
}: {
  progress: MutableRefObject<{ value: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const open = progress.current.value;
    meshRef.current.scale.setScalar(0.85 + open * 0.18);
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.04;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.08, 0.42]}>
      <boxGeometry args={[0.52, 0.52, 0.08]} />
      <meshStandardMaterial
        color="#201C18"
        emissive="#4AFF91"
        emissiveIntensity={0.16}
        roughness={0.34}
        metalness={0.54}
      />
    </mesh>
  );
}

function SignalPath({
  progress,
  signal,
}: {
  progress: MutableRefObject<{ value: number }>;
  signal: MutableRefObject<{ value: number }>;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4AFF91",
        emissive: "#4AFF91",
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0,
        roughness: 0.22,
      }),
    [],
  );

  useFrame((state) => {
    const open = progress.current.value;
    const pulse = Math.sin(state.clock.elapsedTime * 7) * 0.08;
    material.opacity = open * (0.52 + pulse);
    material.emissiveIntensity = 1.1 + open * 1.7;

    if (!orbRef.current) return;
    const point = pointOnPolyline(SIGNAL_POINTS, signal.current.value);
    orbRef.current.position.copy(point);
    orbRef.current.scale.setScalar(0.55 + open * 0.7);
    orbRef.current.visible = open > 0.05;
  });

  useEffect(() => () => material.dispose(), [material]);

  return (
    <group>
      <mesh position={[-0.52, -1.03, 0.54]}>
        <boxGeometry args={[0.045, 1.06, 0.045]} />
        <primitive attach="material" object={material} />
      </mesh>
      <mesh position={[-0.05, -0.52, 0.54]}>
        <boxGeometry args={[0.98, 0.045, 0.045]} />
        <primitive attach="material" object={material} />
      </mesh>
      <mesh position={[0.42, 0.11, 0.54]}>
        <boxGeometry args={[0.045, 1.3, 0.045]} />
        <primitive attach="material" object={material} />
      </mesh>
      <mesh position={[0.12, 0.74, 0.54]}>
        <boxGeometry args={[0.64, 0.045, 0.045]} />
        <primitive attach="material" object={material} />
      </mesh>
      <mesh position={[-0.18, 1.13, 0.54]}>
        <boxGeometry args={[0.045, 0.82, 0.045]} />
        <primitive attach="material" object={material} />
      </mesh>
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.055, 18, 18]} />
        <primitive attach="material" object={material} />
      </mesh>
    </group>
  );
}

function ArtifactAssembly({
  opened,
  activation,
}: {
  opened: boolean;
  activation: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const bottomRef = useRef<THREE.Mesh>(null);
  const faceRef = useRef<THREE.Mesh>(null);
  const progress = useRef({ value: 0 });
  const signal = useRef({ value: 0 });
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!isMotionEnabled) {
      progress.current.value = opened ? 1 : 0;
      signal.current.value = opened ? 1 : 0;
      return;
    }

    const timeline = gsap.timeline();
    timeline.to(progress.current, {
      value: opened ? 1 : 0,
      duration: opened ? 1.45 : 0.72,
      ease: "power3.inOut",
    });

    if (opened) {
      timeline.fromTo(
        signal.current,
        { value: 0 },
        { value: 1, duration: 1.08, ease: "power2.inOut" },
        0.46,
      );
    }

    return () => {
      timeline.kill();
    };
  }, [activation, opened, isMotionEnabled]);

  useFrame((state) => {
    const open = progress.current.value;
    const idle = isMotionEnabled ? Math.sin(state.clock.elapsedTime * 0.52) : 0;

    if (groupRef.current) {
      groupRef.current.position.y = idle * 0.08;
      groupRef.current.rotation.x = -0.18 + state.pointer.y * 0.035;
      groupRef.current.rotation.y = 0.32 + state.pointer.x * 0.055;
      groupRef.current.rotation.z = -0.04 + open * 0.018;
    }

    applyTransform(
      leftRef.current,
      { position: [-1.16, 0, 0.16], rotation: [0, 0, 0] },
      { position: [-1.78, 0.12, 0.62], rotation: [0.02, -0.38, -0.07] },
      open,
    );
    applyTransform(
      rightRef.current,
      { position: [1.16, 0, 0.16], rotation: [0, 0, 0] },
      { position: [1.78, -0.08, 0.62], rotation: [-0.02, 0.38, 0.07] },
      open,
    );
    applyTransform(
      topRef.current,
      { position: [0, 1.82, 0.18], rotation: [0, 0, 0] },
      { position: [0.05, 2.45, 0.58], rotation: [0.34, 0.02, 0.04] },
      open,
    );
    applyTransform(
      bottomRef.current,
      { position: [0, -1.82, 0.18], rotation: [0, 0, 0] },
      { position: [-0.04, -2.43, 0.58], rotation: [-0.34, -0.02, -0.04] },
      open,
    );
    applyTransform(
      faceRef.current,
      { position: [0, 0, 0.4], rotation: [0, 0, 0] },
      { position: [0, 0, 1.06], rotation: [0.06, 0, 0] },
      open,
    );
  });

  return (
    <group ref={groupRef} scale={[0.82, 0.82, 0.82]}>
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[2.16, 3.38, 0.32]} />
        <meshStandardMaterial
          color="#0D0C0B"
          roughness={0.46}
          metalness={0.38}
        />
      </mesh>

      <ChamberRibs progress={progress} />
      <SignalPath progress={progress} signal={signal} />

      <CeramicPanel meshRef={leftRef} size={[1.48, 4.82, 0.44]} />
      <CeramicPanel meshRef={rightRef} size={[1.48, 4.82, 0.44]} />
      <CeramicPanel meshRef={topRef} size={[3.72, 0.96, 0.46]} />
      <CeramicPanel meshRef={bottomRef} size={[3.72, 0.96, 0.46]} />

      <RoundedBox
        ref={faceRef}
        args={[1.08, 2.74, 0.22]}
        radius={0.04}
        smoothness={4}
      >
        <meshStandardMaterial
          color="#F4EBDD"
          roughness={0.64}
          metalness={0.08}
        />
      </RoundedBox>

      <mesh position={[0, -2.65, -0.38]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#080706" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function StaticArtifact({ opened }: { opened: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={`relative h-[76%] w-[48%] min-w-[240px] max-w-[420px] transition-transform duration-700 ${
          opened ? "scale-105" : ""
        }`}
      >
        <div className="absolute inset-0 rounded-[18px] bg-[#0D0C0B]" />
        <div
          className={`absolute left-[8%] top-[4%] h-[92%] w-[39%] rounded-[14px] bg-[#EDE6D7] transition-transform duration-700 ${
            opened ? "-translate-x-[24%] translate-y-[2%]" : ""
          }`}
        />
        <div
          className={`absolute right-[8%] top-[4%] h-[92%] w-[39%] rounded-[14px] bg-[#EDE6D7] transition-transform duration-700 ${
            opened ? "translate-x-[24%] -translate-y-[2%]" : ""
          }`}
        />
        <div className="absolute left-[44%] top-[24%] h-[52%] w-[12%] bg-[#F4EBDD]" />
        {opened && (
          <div className="absolute left-[48%] top-[25%] h-[50%] w-[2px] bg-electric shadow-[0_0_22px_rgba(74,255,145,0.9)]" />
        )}
      </div>
    </div>
  );
}

export default function ArtifactScene({
  opened,
  activation,
}: ArtifactSceneProps) {
  const { isMotionEnabled } = useMotionPreference();

  if (!isMotionEnabled) {
    return <StaticArtifact opened={opened} />;
  }

  return (
    <Canvas
      dpr={[1, 1.45]}
      camera={{ position: [0, 0.12, 10.8], fov: 42, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <fog attach="fog" args={["#1A1612", 8, 18]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 3.2, 5]} intensity={1.4} />
      <pointLight position={[2.4, -1.8, 2.2]} color="#4AFF91" intensity={opened ? 2.8 : 0.15} />
      <spotLight
        position={[0, 5.2, 4.2]}
        angle={0.34}
        penumbra={0.72}
        intensity={3.2}
      />
      <Suspense fallback={null}>
        <ArtifactAssembly opened={opened} activation={activation} />
      </Suspense>
    </Canvas>
  );
}
