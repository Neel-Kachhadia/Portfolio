"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  BrainCircuit,
  Cloud,
  Layers2,
  Network,
  Server,
  Sparkles,
} from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const capabilities = [
  {
    code: "M01",
    layer: "Reasoning Systems",
    signal: "agent orchestration, tool routing, evaluation loops",
    tools: "LangGraph · LangChain · OpenAI API · Amazon Bedrock",
    state: "ACTIVE",
    coordinate: "core / model",
  },
  {
    code: "B02",
    layer: "Backend Intelligence",
    signal: "stateless APIs, stateful ML workers, secure service boundaries",
    tools: "FastAPI · Node.js · Express · Redis · DocumentDB",
    state: "ACTIVE",
    coordinate: "service / memory",
  },
  {
    code: "F03",
    layer: "Financial ML",
    signal: "forecasting, anomaly detection, scoring, explainable advice",
    tools: "Python · Pandas · NumPy · Isolation Forest · Regression",
    state: "FIELD-TESTED",
    coordinate: "domain / signal",
  },
  {
    code: "I04",
    layer: "Interface Systems",
    signal: "editorial UI, realtime dashboards, motion as feedback",
    tools: "React · TypeScript · Tailwind · Motion · GSAP",
    state: "ACTIVE",
    coordinate: "surface / feedback",
  },
  {
    code: "C05",
    layer: "Cloud Surface",
    signal: "deployment, artifact storage, notifications, auth primitives",
    tools: "AWS EC2 · Lambda · S3 · SNS · Cognito · Firebase",
    state: "DEPLOYED",
    coordinate: "infra / deployment",
  },
  {
    code: "P06",
    layer: "Product Sense",
    signal: "systems storytelling, interaction clarity, engineering taste",
    tools: "Architecture diagrams · command layers · terminal interfaces",
    state: "RARE",
    coordinate: "human / judgment",
  },
];

const icons = [BrainCircuit, Server, Activity, Layers2, Cloud, Sparkles];

export default function Capabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMotionEnabled } = useMotionPreference();
  const active = capabilities[activeIndex];
  const ActiveIcon = icons[activeIndex];

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="w-full border-y border-ink/10 bg-paper/45 px-6 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-12 grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:items-end">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
              <Network className="h-4 w-4 text-electric" aria-hidden="true" />
              04 / INTELLIGENCE_MAP
            </span>
            <h2
              id="capabilities-title"
              className="mt-5 font-mono text-[4rem] font-black uppercase leading-[0.78] text-ink sm:text-[5.6rem] md:text-[8rem]"
            >
              MAP OF
              <span className="block font-serif font-normal italic text-stone">
                intelligence
              </span>
            </h2>
          </div>
          <p className="max-w-2xl font-serif text-3xl italic leading-[1.02] text-stone md:justify-self-end md:text-4xl">
            The portfolio reads as interface, but the deeper structure is a
            stack of reasoning, infrastructure, finance, and product judgment.
          </p>
        </div>

        <div className="grid overflow-hidden border-y border-ink/10 font-mono md:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            key={active.code}
            initial={
              isMotionEnabled ? { clipPath: "inset(0 100% 0 0)" } : false
            }
            animate={
              isMotionEnabled ? { clipPath: "inset(0 0% 0 0)" } : undefined
            }
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-[360px] border-b border-ink/10 p-6 md:border-b-0 md:border-r md:p-8"
          >
            <div className="mb-16 flex items-start justify-between gap-4 text-[10px] uppercase text-stone">
              <span>Active coordinate</span>
              <span>{active.coordinate}</span>
            </div>
            <ActiveIcon
              className="mb-6 h-8 w-8 text-electric"
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase text-stone">
              {active.code}
            </span>
            <h3 className="mt-3 max-w-xl font-mono text-4xl font-black uppercase leading-none text-ink md:text-6xl">
              {active.layer}
            </h3>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-light md:text-base">
              {active.signal}
            </p>
            <div className="mt-8 grid gap-3 border-t border-ink/10 pt-5 text-xs uppercase text-stone md:grid-cols-[6rem_1fr]">
              <span>Tools</span>
              <span className="leading-relaxed text-ink">{active.tools}</span>
              <span>State</span>
              <span className="w-fit border border-electric/70 bg-electric/20 px-2 py-1 text-[10px] text-ink">
                {active.state}
              </span>
            </div>
          </motion.div>

          <div className="relative grid md:grid-cols-2">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(26,22,18,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(26,22,18,0.045)_1px,transparent_1px)] bg-[size:34px_34px]" />
            {capabilities.map((item, index) => {
              const Icon = icons[index];
              const isActive = activeIndex === index;

              return (
                <motion.button
                  key={item.layer}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  initial={
                    isMotionEnabled ? { scaleX: 0.82, opacity: 0 } : false
                  }
                  whileInView={
                    isMotionEnabled ? { scaleX: 1, opacity: 1 } : undefined
                  }
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{
                    duration: 0.42,
                    delay: index * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative min-h-[170px] origin-left border-b border-ink/10 p-5 text-left transition-colors md:border-r ${
                    isActive ? "bg-cream text-ink" : "hover:bg-cream/60"
                  }`}
                >
                  <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase text-stone">
                    <span>{item.code}</span>
                    <span>{item.state}</span>
                  </div>
                  <Icon
                    className={`mb-4 h-5 w-5 ${
                      isActive ? "text-electric" : "text-blueprint"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="block font-mono text-lg font-black uppercase leading-none text-ink md:text-2xl">
                    {item.layer}
                  </span>
                  <span className="mt-4 block text-xs leading-relaxed text-stone">
                    {item.coordinate}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
