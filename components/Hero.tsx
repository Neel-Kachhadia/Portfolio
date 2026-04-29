"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowDown, Cpu } from "lucide-react";
import { motion } from "motion/react";

const IntelligenceCore = dynamic(() => import("@/components/IntelligenceCore"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase text-stone">
      Loading intelligence core...
    </div>
  ),
});

const telemetry = [
  ["MODE", "AI SYSTEMS ENGINEER"],
  ["BASE", "MUMBAI / INDIA"],
  ["YEAR", "2026 / ACTIVE"],
];

export default function Hero() {
  const [graphPulse, setGraphPulse] = useState(0);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-screen w-full flex-col justify-center px-6 pt-24 md:flex-row md:items-center md:pt-0"
    >
      <div className="flex w-full flex-col justify-center md:w-[56%]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <div className="mb-7 flex w-fit items-center gap-2 border-y border-ink/10 py-2 font-mono text-[11px] uppercase text-stone">
            <Cpu className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
            <span>SYSTEM_INIT / PERSONAL_OS / ONLINE</span>
          </div>

          <h1
            id="hero-title"
            className="font-mono text-[3.75rem] font-black leading-[0.86] text-ink sm:text-[5.6rem] md:text-[6.7rem] lg:text-[8.1rem] xl:text-[8.7rem]"
          >
            NEEL <br />
            KACHHADIA
          </h1>

          <p className="mt-7 max-w-2xl font-serif text-2xl italic leading-tight text-stone md:text-3xl">
            AI Systems Engineer · Mumbai, India — 2026
          </p>

          <p className="mt-5 max-w-xl font-mono text-sm leading-relaxed text-ink-light md:text-base">
            Building agentic financial systems, semantic matching engines, and
            infrastructure that feels precise enough to trust.
          </p>

          <dl className="mt-12 grid max-w-2xl grid-cols-1 gap-4 border-y border-ink/10 py-5 font-mono text-xs text-ink-light sm:grid-cols-3">
            {telemetry.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-stone">{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              onMouseEnter={() => setGraphPulse((pulse) => pulse + 1)}
              onFocus={() => setGraphPulse((pulse) => pulse + 1)}
              className="inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink"
            >
              View work
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onMouseEnter={() => setGraphPulse((pulse) => pulse + 1)}
              onFocus={() => setGraphPulse((pulse) => pulse + 1)}
              onClick={() => setGraphPulse((pulse) => pulse + 1)}
              className="inline-flex items-center gap-3 border border-ink/15 bg-paper px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric hover:text-blueprint"
              aria-label="Send pulse through the intelligence core"
            >
              Send signal
              <span className="h-2 w-2 bg-electric" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-16 h-[430px] w-full md:mt-0 md:h-[640px] md:w-[44%]">
        <div className="absolute inset-0 border border-ink/10 bg-cream/20" />
        <IntelligenceCore pulse={graphPulse} />
      </div>
    </section>
  );
}
