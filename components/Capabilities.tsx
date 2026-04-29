"use client";

import { motion } from "motion/react";
import { Activity, Layers2 } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const capabilities = [
  {
    layer: "Reasoning Systems",
    signal: "agent orchestration, tool routing, evaluation loops",
    tools: "LangGraph · LangChain · OpenAI API · Amazon Bedrock",
    state: "ACTIVE",
  },
  {
    layer: "Backend Intelligence",
    signal: "stateless APIs, stateful ML workers, secure service boundaries",
    tools: "FastAPI · Node.js · Express · Redis · DocumentDB",
    state: "ACTIVE",
  },
  {
    layer: "Financial ML",
    signal: "forecasting, anomaly detection, scoring, explainable advice",
    tools: "Python · Pandas · NumPy · Isolation Forest · Regression",
    state: "FIELD-TESTED",
  },
  {
    layer: "Interface Systems",
    signal: "editorial UI, realtime dashboards, motion as feedback",
    tools: "React · TypeScript · Tailwind · Motion · GSAP",
    state: "ACTIVE",
  },
  {
    layer: "Cloud Surface",
    signal: "deployment, artifact storage, notifications, auth primitives",
    tools: "AWS EC2 · Lambda · S3 · SNS · Cognito · Firebase",
    state: "DEPLOYED",
  },
  {
    layer: "Product Sense",
    signal: "systems storytelling, interaction clarity, engineering taste",
    tools: "Architecture diagrams · command layers · terminal interfaces",
    state: "RARE",
  },
];

export default function Capabilities() {
  const { isMotionEnabled } = useMotionPreference();

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="w-full border-y border-ink/10 px-6 py-28 md:py-36"
    >
      <div className="mb-12 grid gap-6 md:grid-cols-[0.78fr_1fr] md:items-end">
        <div>
          <span className="font-mono text-[11px] uppercase text-stone">
            CAPABILITIES / INTELLIGENCE MAP
          </span>
          <h2
            id="capabilities-title"
            className="mt-3 font-mono text-5xl font-black leading-none text-ink md:text-7xl"
          >
            SYSTEM<br />MAP
          </h2>
        </div>
        <p className="max-w-2xl font-serif text-2xl italic leading-tight text-stone md:text-3xl">
          A working map of the places where Neel turns product intent into
          deployed AI systems.
        </p>
      </div>

      <div className="overflow-hidden border-t border-ink/10 font-mono text-xs md:text-sm">
        <div className="hidden grid-cols-[0.78fr_1.12fr_1.2fr_8rem] border-b border-ink/10 py-3 text-[11px] uppercase text-stone md:grid">
          <span>LAYER</span>
          <span>SIGNAL</span>
          <span>TOOLS</span>
          <span>STATE</span>
        </div>

        {capabilities.map((item, index) => (
          <motion.div
            key={item.layer}
            initial={isMotionEnabled ? { opacity: 0, y: 14 } : false}
            whileInView={isMotionEnabled ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.34, delay: index * 0.035 }}
            className="grid gap-3 border-b border-ink/10 py-5 md:grid-cols-[0.78fr_1.12fr_1.2fr_8rem] md:gap-6"
          >
            <div className="flex items-center gap-3 text-ink">
              {index % 2 === 0 ? (
                <Layers2 className="h-4 w-4 text-electric" aria-hidden="true" />
              ) : (
                <Activity className="h-4 w-4 text-blueprint" aria-hidden="true" />
              )}
              <span className="font-semibold">{item.layer}</span>
            </div>
            <div className="leading-relaxed text-ink-light">{item.signal}</div>
            <div className="leading-relaxed text-stone">{item.tools}</div>
            <div className="w-fit border border-ink/10 bg-paper px-2 py-1 text-[10px] uppercase text-ink md:self-start">
              {item.state}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
