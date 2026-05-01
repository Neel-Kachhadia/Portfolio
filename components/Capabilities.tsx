"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Network, RadioTower } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

type Capability = {
  id: string;
  label: string;
  short: string;
  position: [number, number];
  connects: string[];
  tools: string;
  proofs: Array<{ project: string; detail: string }>;
};

const capabilities: Capability[] = [
  {
    id: "reasoning",
    label: "AI systems",
    short: "agents, tool routes, evaluation loops",
    position: [48, 25],
    connects: ["finance", "backend", "interface"],
    tools: "LangGraph, LangChain, OpenAI API, Amazon Bedrock",
    proofs: [
      { project: "NeuroFin", detail: "12-agent finance operating layer" },
      { project: "Equity Research", detail: "LangGraph market research loop" },
    ],
  },
  {
    id: "backend",
    label: "Backend intelligence",
    short: "service boundaries, workers, state",
    position: [28, 54],
    connects: ["cloud", "reasoning", "finance"],
    tools: "FastAPI, Node.js, Express, Redis, DocumentDB",
    proofs: [
      { project: "Equity Research", detail: "stateless FastAPI boundary" },
      { project: "NeuroFin", detail: "Redis memory + deterministic router" },
    ],
  },
  {
    id: "finance",
    label: "Financial ML",
    short: "forecasting, anomaly, scores",
    position: [52, 76],
    connects: ["reasoning", "backend", "cloud"],
    tools: "Python, Pandas, NumPy, Isolation Forest, regression",
    proofs: [
      { project: "NeuroFin", detail: "risk, cash-flow, anomaly detection" },
      { project: "Equity Research", detail: "ranked investment outputs" },
    ],
  },
  {
    id: "interface",
    label: "Interface systems",
    short: "motion, dashboards, editorial UI",
    position: [76, 39],
    connects: ["reasoning", "product"],
    tools: "React, TypeScript, Tailwind, Motion, GSAP",
    proofs: [
      { project: "NEEL.OS", detail: "cinematic OS interaction layer" },
      { project: "Equity Research", detail: "decision dashboard surface" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud surface",
    short: "deploy, storage, notifications",
    position: [20, 78],
    connects: ["backend", "finance"],
    tools: "AWS EC2, S3, Lambda, SNS, Cognito, Firebase",
    proofs: [
      { project: "NeuroFin", detail: "S3, SNS, DocumentDB, Redis" },
      { project: "Mentora", detail: "Firebase realtime product flow" },
    ],
  },
  {
    id: "product",
    label: "Product thinking",
    short: "taste, clarity, systems narrative",
    position: [72, 68],
    connects: ["interface", "reasoning"],
    tools: "Architecture, command layers, UX, systems storytelling",
    proofs: [
      { project: "Mentora", detail: "intent-first semantic matching" },
      { project: "NEEL.OS", detail: "portfolio as authored operating surface" },
    ],
  },
];

const links = capabilities.flatMap((capability) =>
  capability.connects.map((target) => [capability.id, target] as const),
);

function getCapability(id: string) {
  const capability = capabilities.find((item) => item.id === id);
  if (!capability) throw new Error(`Missing capability ${id}`);
  return capability;
}

export default function Capabilities() {
  const [activeId, setActiveId] = useState("reasoning");
  const { isMotionEnabled } = useMotionPreference();
  const active = getCapability(activeId);
  const activeSet = useMemo(
    () => new Set([active.id, ...active.connects]),
    [active],
  );

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="w-full border-y border-ink/10 bg-paper/45 px-5 py-28 md:px-8 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.86fr_1.14fr] md:items-end">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
              <Network className="h-4 w-4 text-electric" aria-hidden="true" />
              intelligence_map / live proof routes
            </span>
            <h2
              id="capabilities-title"
              className="mt-5 font-mono text-[3.6rem] font-black uppercase leading-[0.78] text-ink sm:text-[5.6rem] md:text-[8.4rem]"
            >
              LIVING
              <span className="block font-serif font-normal italic text-stone">
                map
              </span>
            </h2>
          </div>
          <p className="max-w-3xl font-serif text-3xl italic leading-[1.02] text-stone md:justify-self-end md:text-5xl">
            This is not a skill list. Touch one capability and the archive
            reroutes around actual projects.
          </p>
        </div>

        <div className="grid gap-8 border-y border-ink/10 py-6 md:grid-cols-[1.12fr_0.88fr] md:py-8">
          <div className="relative min-h-[560px] overflow-hidden bg-cream/45">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {links.map(([fromId, toId]) => {
                const from = getCapability(fromId);
                const to = getCapability(toId);
                const highlighted =
                  activeSet.has(from.id) && activeSet.has(to.id);

                return (
                  <motion.line
                    key={`${fromId}-${toId}`}
                    x1={from.position[0]}
                    y1={from.position[1]}
                    x2={to.position[0]}
                    y2={to.position[1]}
                    stroke={highlighted ? "#4AFF91" : "#1A1612"}
                    strokeWidth={highlighted ? 0.44 : 0.13}
                    strokeOpacity={highlighted ? 0.78 : 0.13}
                    initial={false}
                    animate={{ pathLength: highlighted ? 1 : 0.72 }}
                    transition={{ duration: isMotionEnabled ? 0.42 : 0 }}
                  />
                );
              })}
            </svg>

            <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[10px] uppercase text-stone">
              <RadioTower className="h-4 w-4 text-electric" aria-hidden="true" />
              active route: {active.label}
            </div>

            {capabilities.map((capability) => {
              const isActive = capability.id === activeId;
              const isRelated = activeSet.has(capability.id);

              return (
                <motion.button
                  key={capability.id}
                  type="button"
                  onMouseEnter={() => setActiveId(capability.id)}
                  onFocus={() => setActiveId(capability.id)}
                  onClick={() => setActiveId(capability.id)}
                  className="absolute grid min-h-[92px] w-[11.5rem] place-items-start border border-ink/10 bg-cream/90 p-3 text-left font-mono shadow-[0_18px_45px_rgba(26,22,18,0.06)] transition-colors hover:border-electric md:w-[13.5rem]"
                  style={{
                    left: `${capability.position[0]}%`,
                    top: `${capability.position[1]}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={false}
                  animate={{
                    opacity: isRelated ? 1 : 0.36,
                    scale: isActive ? 1.06 : 1,
                  }}
                  transition={{ duration: isMotionEnabled ? 0.28 : 0 }}
                >
                  <span className="mb-4 flex w-full items-center justify-between text-[10px] uppercase text-stone">
                    <span>{capability.id}</span>
                    <span
                      className="h-2 w-2"
                      style={{
                        background: isActive ? "#4AFF91" : "rgba(26,22,18,0.18)",
                      }}
                    />
                  </span>
                  <span className="text-base font-black uppercase leading-none text-ink md:text-xl">
                    {capability.label}
                  </span>
                  <span className="mt-2 text-[10px] uppercase leading-relaxed text-stone">
                    {capability.short}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={isMotionEnabled ? { opacity: 0, y: 18 } : false}
              animate={isMotionEnabled ? { opacity: 1, y: 0 } : undefined}
              exit={isMotionEnabled ? { opacity: 0, y: -12 } : undefined}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="grid content-between gap-10 border-t border-ink/10 pt-6 font-mono md:border-l md:border-t-0 md:pl-8 md:pt-0"
            >
              <div>
                <span className="text-[10px] uppercase text-stone">
                  active capability
                </span>
                <h3 className="mt-4 max-w-xl text-4xl font-black uppercase leading-none text-ink md:text-6xl">
                  {active.label}
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-light md:text-base">
                  {active.short}
                </p>
                <div className="mt-8 grid gap-3 border-y border-ink/10 py-5 text-xs uppercase md:grid-cols-[5rem_1fr]">
                  <span className="text-stone">tools</span>
                  <span className="leading-relaxed text-ink">{active.tools}</span>
                  <span className="text-stone">links</span>
                  <span className="leading-relaxed text-ink">
                    {active.connects.map((id) => getCapability(id).label).join(" / ")}
                  </span>
                </div>
              </div>

              <div>
                <span className="mb-4 block text-[10px] uppercase text-stone">
                  proof attached
                </span>
                <div className="grid gap-3">
                  {active.proofs.map((proof) => (
                    <motion.div
                      key={`${active.id}-${proof.project}`}
                      initial={isMotionEnabled ? { x: 16, opacity: 0 } : false}
                      animate={isMotionEnabled ? { x: 0, opacity: 1 } : undefined}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="border-l-2 border-electric bg-cream/70 px-4 py-3"
                    >
                      <div className="text-xs uppercase text-ink">{proof.project}</div>
                      <div className="mt-1 text-xs leading-relaxed text-stone">
                        {proof.detail}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
