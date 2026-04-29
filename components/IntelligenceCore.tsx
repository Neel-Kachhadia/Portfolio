"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Line, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useMotionPreference } from "@/components/useMotionPreference";

type CoreNode = {
  id: string;
  label: string;
  position: [number, number, number];
  tier: "model" | "agent" | "data" | "interface";
};

const CORE_NODES: CoreNode[] = [
  { id: "core", label: "reasoning core", position: [0, 0, 0], tier: "model" },
  { id: "langgraph", label: "LangGraph", position: [-0.82, 0.68, -0.12], tier: "agent" },
  { id: "fastapi", label: "FastAPI", position: [0.82, 0.62, 0.06], tier: "interface" },
  { id: "bedrock", label: "Bedrock", position: [0.28, 1.1, -0.28], tier: "model" },
  { id: "redis", label: "Redis cache", position: [-0.55, -0.86, 0.16], tier: "data" },
  { id: "s3", label: "S3 artifacts", position: [0.72, -0.84, -0.08], tier: "data" },
  { id: "react", label: "React UI", position: [0.92, -0.14, 0.22], tier: "interface" },
  { id: "agents", label: "12 agents", position: [-0.92, -0.12, 0.12], tier: "agent" },
  { id: "signals", label: "market signals", position: [-0.18, -1.2, -0.2], tier: "data" },
];

const CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 7],
  [2, 6],
  [4, 8],
  [5, 8],
  [1, 3],
  [2, 3],
];

const tierColor: Record<CoreNode["tier"], string> = {
  model: "#4AFF91",
  agent: "#1A1612",
  data: "#2E5E4E",
  interface: "#B65B3A",
};

function useElementInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "160px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

function CoreAura({ active }: { active: boolean }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#4AFF91") },
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
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            vec2 center = vUv - 0.5;
            float radius = length(center);
            float pulse = 0.55 + 0.45 * sin(uTime * 1.65);
            float ring = smoothstep(0.38, 0.18, radius) * 0.18;
            float edge = smoothstep(0.22 + pulse * 0.035, 0.21, abs(radius - 0.25));
            gl_FragColor = vec4(uColor, ring + edge * 0.12);
          }
        `,
      }),
    [],
  );

  useFrame((state) => {
    if (!active) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => () => material.dispose(), [material]);

  return (
    <Billboard position={[0, 0, -0.06]}>
      <mesh scale={[1.45, 1.45, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <primitive attach="material" object={material} />
      </mesh>
    </Billboard>
  );
}

function SignalPackets({
  active,
  pulse,
}: {
  active: boolean;
  pulse: number;
}) {
  const packetRefs = useRef<THREE.Mesh[]>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);
  const pulseToken = useRef(pulse);
  const pulseStartedAt = useRef(-100);
  const scratch = useMemo(
    () => ({
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      current: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state) => {
    if (!active) return;

    const time = state.clock.elapsedTime;

    packetRefs.current.forEach((packet, index) => {
      const [from, to] = CONNECTIONS[index % CONNECTIONS.length];
      scratch.start.fromArray(CORE_NODES[from].position);
      scratch.end.fromArray(CORE_NODES[to].position);
      const progress = (time * (0.08 + index * 0.004) + index * 0.137) % 1;

      scratch.current.lerpVectors(scratch.start, scratch.end, progress);
      packet.position.copy(scratch.current);
    });

    if (pulseToken.current !== pulse) {
      pulseToken.current = pulse;
      pulseStartedAt.current = time;
    }

    pulseRefs.current.forEach((packet, index) => {
      const progress = (time - pulseStartedAt.current) * 0.72 - index * 0.055;
      const visible = progress > 0 && progress < 1;

      packet.visible = visible;
      if (!visible) return;

      const [from, to] = CONNECTIONS[index];
      scratch.start.fromArray(CORE_NODES[from].position);
      scratch.end.fromArray(CORE_NODES[to].position);
      scratch.current.lerpVectors(scratch.start, scratch.end, progress);

      packet.position.copy(scratch.current);
      packet.scale.setScalar(1 + Math.sin(progress * Math.PI) * 1.35);

      const material = packet.material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(progress * Math.PI) * 0.9;
    });
  });

  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <mesh
          key={`packet-${index}`}
          ref={(mesh) => {
            if (mesh) packetRefs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial color="#4AFF91" transparent opacity={0.72} />
        </mesh>
      ))}

      {CONNECTIONS.map((_, index) => (
        <mesh
          key={`pulse-${index}`}
          visible={false}
          ref={(mesh) => {
            if (mesh) pulseRefs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[0.032, 18, 18]} />
          <meshBasicMaterial color="#4AFF91" transparent opacity={0} />
        </mesh>
      ))}
    </>
  );
}

function IntelligenceGraph({
  active,
  pulse,
}: {
  active: boolean;
  pulse: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!active || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    const targetX = -0.08 + state.pointer.y * 0.08;
    const targetY = state.pointer.x * 0.11 + Math.sin(time * 0.18) * 0.055;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.035,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.035,
    );

    nodeRefs.current.forEach((node, index) => {
      const base = CORE_NODES[index].position;
      node.position.y = base[1] + Math.sin(time * 0.75 + index * 0.83) * 0.025;
    });

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      Math.sin(time * 0.12) * 0.18 + state.pointer.x * 0.16,
      0.025,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.05 + state.pointer.y * 0.1,
      0.025,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <CoreAura active={active} />

      {CONNECTIONS.map(([from, to], index) => (
        <Line
          key={`${from}-${to}-${index}`}
          points={[CORE_NODES[from].position, CORE_NODES[to].position]}
          color="#4AFF91"
          lineWidth={0.7}
          transparent
          opacity={0.32}
        />
      ))}

      <SignalPackets active={active} pulse={pulse} />

      {CORE_NODES.map((node, index) => {
        const isCore = node.id === "core";

        return (
          <group key={node.id}>
            <mesh
              ref={(mesh) => {
                if (mesh) nodeRefs.current[index] = mesh;
              }}
              position={node.position}
            >
              <sphereGeometry args={[isCore ? 0.12 : 0.062, 32, 32]} />
              <meshStandardMaterial
                color={isCore ? "#4AFF91" : "#F5F0E8"}
                emissive={isCore ? "#4AFF91" : tierColor[node.tier]}
                emissiveIntensity={isCore ? 0.72 : 0.08}
                metalness={0.04}
                roughness={0.42}
              />
            </mesh>

            <Billboard
              position={[
                node.position[0],
                node.position[1] + (isCore ? 0.25 : 0.18),
                node.position[2],
              ]}
            >
              <Text
                color={isCore ? "#1A1612" : "#3D3530"}
                fontSize={isCore ? 0.095 : 0.074}
                anchorX="center"
                anchorY="middle"
                maxWidth={0.95}
              >
                {node.label}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

function StaticIntelligenceCore() {
  return (
    <svg
      viewBox="0 0 480 420"
      className="h-full w-full"
      role="img"
      aria-label="Static architecture map for Neel OS"
    >
      <g fill="none" stroke="#4AFF91" strokeOpacity="0.35" strokeWidth="1">
        <path d="M240 210 116 112" />
        <path d="M240 210 350 112" />
        <path d="M240 210 394 214" />
        <path d="M240 210 338 328" />
        <path d="M240 210 162 330" />
        <path d="M240 210 86 218" />
      </g>
      {[
        ["LangGraph", 116, 112],
        ["FastAPI", 350, 112],
        ["React UI", 394, 214],
        ["S3 artifacts", 338, 328],
        ["Redis cache", 162, 330],
        ["12 agents", 86, 218],
      ].map(([label, x, y]) => (
        <g key={label as string}>
          <circle
            cx={x as number}
            cy={y as number}
            r="8"
            fill="#F5F0E8"
            stroke="#1A1612"
            strokeOpacity="0.28"
          />
          <text
            x={x as number}
            y={(y as number) - 18}
            textAnchor="middle"
            fill="#3D3530"
            fontFamily="monospace"
            fontSize="12"
          >
            {label}
          </text>
        </g>
      ))}
      <circle cx="240" cy="210" r="20" fill="#4AFF91" fillOpacity="0.78" />
      <text
        x="240"
        y="250"
        textAnchor="middle"
        fill="#1A1612"
        fontFamily="monospace"
        fontSize="12"
      >
        reasoning core
      </text>
    </svg>
  );
}

export default function IntelligenceCore({ pulse }: { pulse: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useElementInView(containerRef);
  const { isMotionEnabled } = useMotionPreference();

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      aria-label="Interactive 3D intelligence core"
    >
      {!isMotionEnabled ? (
        <StaticIntelligenceCore />
      ) : (
        <Canvas
          aria-hidden="true"
          camera={{ position: [0, 0.08, 3.28], fov: 43 }}
          dpr={[1, 1.5]}
          frameloop={isInView ? "always" : "demand"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={1.1} />
            <directionalLight position={[2, 3, 3]} intensity={0.72} />
            <IntelligenceGraph active={isInView} pulse={pulse} />
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.16}
                luminanceThreshold={0.62}
                luminanceSmoothing={0.34}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
      <div className="pointer-events-none absolute bottom-5 left-5 hidden font-mono text-[10px] uppercase text-stone md:block">
        CORE_STATUS: ONLINE / SIGNAL: 2026
      </div>
    </div>
  );
}
