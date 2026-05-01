"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { useMotionPreference } from "@/components/useMotionPreference";

type Route = {
  id: string;
  points: [number, number, number][];
  color: string;
  lane: "logic" | "memory" | "surface" | "human";
};

type Chamber = {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
  size: [number, number];
  color: string;
};

const ROUTES: Route[] = [
  {
    id: "signal-intake",
    lane: "logic",
    color: "#4AFF91",
    points: [
      [-3.1, -1.24, 0.06],
      [-2.12, -1.24, 0.08],
      [-2.12, -0.18, 0.1],
      [-0.88, -0.18, 0.13],
      [-0.88, 0.72, 0.1],
      [0.36, 0.72, 0.11],
      [0.36, -0.08, 0.1],
      [1.78, -0.08, 0.12],
      [1.78, 0.72, 0.1],
      [3.12, 0.72, 0.08],
    ],
  },
  {
    id: "critique-loop",
    lane: "memory",
    color: "#2E5E4E",
    points: [
      [-0.88, -0.18, 0.11],
      [-0.1, -0.18, 0.14],
      [-0.1, -1.02, 0.13],
      [1.04, -1.02, 0.12],
      [1.04, -0.08, 0.11],
    ],
  },
  {
    id: "human-pass",
    lane: "human",
    color: "#B65B3A",
    points: [
      [-2.48, 1.02, 0.09],
      [-1.52, 1.02, 0.11],
      [-1.52, 0.26, 0.13],
      [-0.1, 0.26, 0.12],
      [-0.1, 1.32, 0.1],
      [1.38, 1.32, 0.11],
    ],
  },
  {
    id: "surface-route",
    lane: "surface",
    color: "#1A1612",
    points: [
      [0.38, -0.08, 0.1],
      [0.38, 0.42, 0.12],
      [2.32, 0.42, 0.11],
      [2.32, -1.16, 0.1],
      [3.12, -1.16, 0.08],
    ],
  },
];

const CHAMBERS: Chamber[] = [
  {
    id: "intake",
    label: "intake",
    detail: "raw signal",
    position: [-2.72, -1.24, 0.12],
    size: [0.72, 0.36],
    color: "#F5F0E8",
  },
  {
    id: "reason",
    label: "reason",
    detail: "branch / judge",
    position: [-0.88, -0.18, 0.18],
    size: [0.94, 0.62],
    color: "#F5F0E8",
  },
  {
    id: "memory",
    label: "memory",
    detail: "case archive",
    position: [0.52, -1.02, 0.16],
    size: [1.08, 0.44],
    color: "#EEE6DA",
  },
  {
    id: "compose",
    label: "compose",
    detail: "interface",
    position: [1.78, -0.08, 0.18],
    size: [0.98, 0.72],
    color: "#F5F0E8",
  },
  {
    id: "human",
    label: "human",
    detail: "taste layer",
    position: [-2.48, 1.02, 0.16],
    size: [0.86, 0.44],
    color: "#F5F0E8",
  },
  {
    id: "dispatch",
    label: "dispatch",
    detail: "live route",
    position: [3.12, 0.72, 0.16],
    size: [0.72, 0.42],
    color: "#EDE8DE",
  },
];

function makeGeometry(points: [number, number, number][]) {
  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints(points.map((point) => new THREE.Vector3(...point)));
  return geometry;
}

function interpolateRoute(points: THREE.Vector3[], progress: number) {
  const lengths: number[] = [];
  let total = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const length = points[index].distanceTo(points[index + 1]);
    lengths.push(length);
    total += length;
  }

  let target = (progress % 1) * total;

  for (let index = 0; index < lengths.length; index += 1) {
    if (target <= lengths[index]) {
      const segmentProgress = target / lengths[index];
      return new THREE.Vector3().lerpVectors(
        points[index],
        points[index + 1],
        segmentProgress,
      );
    }
    target -= lengths[index];
  }

  return points[points.length - 1].clone();
}

function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "220px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

function PaperSkin() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uInk: { value: new THREE.Color("#1A1612") },
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
            vec2 grid = abs(fract(vUv * vec2(18.0, 12.0)) - 0.5);
            float route = smoothstep(0.492, 0.5, max(grid.x, grid.y));
            float grain = hash(floor(vUv * 180.0 + uTime * 3.0));
            float glow = smoothstep(0.42, 0.0, distance(vUv, vec2(0.64, 0.46)));
            vec3 color = mix(uInk, uSignal, glow * 0.36);
            float alpha = route * 0.055 + grain * 0.026 + glow * 0.06;
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
    <mesh position={[0, 0, -0.08]} rotation={[0, 0, -0.03]} scale={[7.2, 4.2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
}

function ChamberPlate({ chamber }: { chamber: Chamber }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.position.z =
      chamber.position[2] + Math.sin(time * 0.55 + chamber.position[0]) * 0.018;
  });

  const halfW = chamber.size[0] / 2;
  const halfH = chamber.size[1] / 2;
  const outline = useMemo(
    () =>
      makeGeometry([
        [-halfW, -halfH, 0.01],
        [halfW, -halfH, 0.01],
        [halfW, halfH, 0.01],
        [-halfW, halfH, 0.01],
        [-halfW, -halfH, 0.01],
      ]),
    [halfH, halfW],
  );
  const outlineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#1A1612",
        transparent: true,
        opacity: 0.22,
      }),
    [],
  );
  const outlineLine = useMemo(
    () => new THREE.Line(outline, outlineMaterial),
    [outline, outlineMaterial],
  );

  useEffect(
    () => () => {
      outline.dispose();
      outlineMaterial.dispose();
    },
    [outline, outlineMaterial],
  );

  return (
    <group ref={groupRef} position={chamber.position}>
      <mesh>
        <planeGeometry args={chamber.size} />
        <meshBasicMaterial color={chamber.color} transparent opacity={0.78} />
      </mesh>
      <primitive object={outlineLine} />
      <Billboard position={[0, 0, 0.08]}>
        <Text
          color="#1A1612"
          fontSize={0.1}
          anchorX="center"
          anchorY="middle"
          maxWidth={chamber.size[0] * 0.85}
        >
          {chamber.label}
        </Text>
        <Text
          position={[0, -0.15, 0]}
          color="#8C8480"
          fontSize={0.055}
          anchorX="center"
          anchorY="middle"
          maxWidth={chamber.size[0] * 0.88}
        >
          {chamber.detail}
        </Text>
      </Billboard>
    </group>
  );
}

function RouteLine({
  route,
  active,
}: {
  route: Route;
  active: boolean;
}) {
  const geometry = useMemo(() => makeGeometry(route.points), [route.points]);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: route.color,
        transparent: true,
        opacity: 0.2,
      }),
    [route.color],
  );
  const line = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  useFrame((state) => {
    const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    material.opacity = active ? pulse : 0.18;
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

function SignalPacket({
  route,
  index,
  burst,
}: {
  route: Route;
  index: number;
  burst: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const vectors = useMemo(
    () => route.points.map((point) => new THREE.Vector3(...point)),
    [route.points],
  );
  const burstRef = useRef(burst);
  const burstStart = useRef(0);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    if (burstRef.current !== burst) {
      burstRef.current = burst;
      burstStart.current = state.clock.elapsedTime;
    }

    const baseProgress = state.clock.elapsedTime * (0.08 + index * 0.012);
    const burstProgress = (state.clock.elapsedTime - burstStart.current) * 0.82;
    const useBurst = burstProgress > 0 && burstProgress < 1.18;
    const progress = useBurst
      ? burstProgress - index * 0.055
      : baseProgress + index * 0.19;

    const point = interpolateRoute(vectors, progress);
    meshRef.current.position.copy(point);

    const burstScale = useBurst ? 1 + Math.sin(Math.max(0, progress) * Math.PI) : 1;
    meshRef.current.scale.setScalar(0.78 + burstScale * 0.62);
    materialRef.current.opacity = useBurst ? 0.9 : 0.42;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.035, 16, 16]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#4AFF91"
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function MachineScene({ pulse }: { pulse: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeRoute, setActiveRoute] = useState("signal-intake");

  useEffect(() => {
    if (pulse === 0) return;
    setActiveRoute(ROUTES[pulse % ROUTES.length].id);
  }, [pulse]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.18 + state.pointer.y * 0.06,
      0.04,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      0.28 + state.pointer.x * 0.1,
      0.04,
    );
    groupRef.current.rotation.z = Math.sin(time * 0.13) * 0.012 - 0.035;
  });

  return (
    <group ref={groupRef} scale={[1.02, 1.02, 1]}>
      <PaperSkin />
      {ROUTES.map((route) => (
        <RouteLine
          key={route.id}
          route={route}
          active={route.id === activeRoute}
        />
      ))}
      {CHAMBERS.map((chamber) => (
        <ChamberPlate key={chamber.id} chamber={chamber} />
      ))}
      {ROUTES.map((route, index) => (
        <SignalPacket key={route.id} route={route} index={index} burst={pulse} />
      ))}
      <mesh position={[0.28, 0.16, 0.3]} scale={[0.42, 0.42, 0.42]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#4AFF91" transparent opacity={0.48} />
      </mesh>
    </group>
  );
}

function StaticMachine() {
  return (
    <svg
      viewBox="0 0 760 500"
      className="h-full w-full"
      role="img"
      aria-label="Static routed reasoning field"
    >
      <rect x="24" y="34" width="712" height="420" fill="#F5F0E8" opacity="0.6" />
      <g fill="none" strokeLinecap="square">
        <path
          d="M70 342 H218 V236 H352 V160 H505 V235 H690"
          stroke="#4AFF91"
          strokeWidth="3"
          opacity="0.72"
        />
        <path
          d="M352 236 H440 V336 H562 V235"
          stroke="#2E5E4E"
          strokeWidth="2"
          opacity="0.45"
        />
        <path
          d="M138 120 H270 V210 H440 V96 H612"
          stroke="#B65B3A"
          strokeWidth="2"
          opacity="0.42"
        />
      </g>
      {[
        ["intake", 70, 342],
        ["reason", 352, 236],
        ["memory", 440, 336],
        ["compose", 562, 235],
        ["human", 138, 120],
        ["dispatch", 690, 235],
      ].map(([label, x, y]) => (
        <g key={label}>
          <rect
            x={(x as number) - 48}
            y={(y as number) - 22}
            width="96"
            height="44"
            fill="#F5F0E8"
            stroke="#1A1612"
            strokeOpacity="0.28"
          />
          <text
            x={x as number}
            y={(y as number) + 4}
            textAnchor="middle"
            fill="#1A1612"
            fontFamily="monospace"
            fontSize="13"
          >
            {label}
          </text>
        </g>
      ))}
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
      aria-label="Interactive routed reasoning field"
    >
      {!isMotionEnabled ? (
        <StaticMachine />
      ) : (
        <Canvas
          aria-hidden="true"
          orthographic
          camera={{ position: [0, 0, 7], zoom: 72 }}
          dpr={[1, 1.45]}
          frameloop={isInView ? "always" : "demand"}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <MachineScene pulse={pulse} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
