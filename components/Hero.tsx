"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowDown, Cpu, RadioTower, Send } from "lucide-react";
import { motion } from "motion/react";

const IntelligenceCore = dynamic(
  () => import("@/components/IntelligenceCore"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-[11px] uppercase text-stone">
        Loading intelligence core...
      </div>
    ),
  },
);

const telemetry = [
  ["OPERATOR", "NEEL KACHHADIA"],
  ["DISCIPLINE", "AI SYSTEMS / ENGINEERING"],
  ["SIGNAL", "MUMBAI / 2026"],
];

const chapters = [
  ["01", "SYSTEM_INIT", "#home"],
  ["02", "IDENTITY_REVEAL", "#identity"],
  ["03", "ACTIVE_SYSTEMS", "#work"],
  ["04", "INTELLIGENCE_MAP", "#capabilities"],
  ["05", "HUMAN_LAYER", "#about"],
  ["06", "TRANSMISSION_END", "#contact"],
];

export default function Hero() {
  const [graphPulse, setGraphPulse] = useState(0);

  const sendPulse = () => setGraphPulse((pulse) => pulse + 1);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] w-full overflow-hidden px-6 pt-24 md:px-8 md:pt-0"
    >
      <div className="pointer-events-none absolute left-6 top-24 hidden h-[calc(100%-7rem)] w-px bg-ink/10 md:block" />
      <div className="pointer-events-none absolute bottom-8 right-6 hidden font-mono text-[10px] uppercase text-stone md:block">
        CORE_BOOT: SEQUENTIAL / SIGNAL_PATH: ARMED
      </div>

      <div className="relative z-10 grid min-h-[calc(100svh-6rem)] w-full max-w-[1500px] grid-rows-[auto_auto] gap-10 md:mx-auto md:min-h-screen md:grid-cols-[0.58fr_0.42fr] md:grid-rows-1 md:items-center md:gap-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex min-w-0 flex-col justify-center md:pr-8"
        >
          <div className="mb-8 flex w-fit items-center gap-2 border-y border-ink/10 py-2 font-mono text-[11px] uppercase text-stone">
            <Cpu className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
            <span>01 / SYSTEM_INIT / PERSONAL_OS</span>
          </div>

          <h1
            id="hero-title"
            className="relative max-w-[11ch] font-mono text-[4.45rem] font-black uppercase leading-[0.78] text-ink sm:text-[6.6rem] md:text-[7.4rem] lg:text-[9.5rem] xl:text-[11rem]"
          >
            {["NEEL.OS", "BUILT", "TO REASON"].map((line, index) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "105%", rotate: index === 1 ? -2 : 0 }}
                  animate={{ y: "0%", rotate: index === 1 ? -2 : 0 }}
                  transition={{
                    duration: 0.82,
                    delay: 0.22 + index * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`block ${index === 1 ? "ml-[18vw] md:ml-28" : ""}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 0.82,
              delay: 0.78,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-8 max-w-3xl font-serif text-3xl italic leading-[0.95] text-stone sm:text-4xl md:text-5xl"
          >
            A calm editorial surface with a living intelligent machine
            underneath.
          </motion.p>

          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-ink-light md:text-base">
            Neel Kachhadia builds agentic financial systems, semantic matching
            engines, and AI infrastructure that feels precise enough to trust.
          </p>

          <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-4 border-y border-ink/10 py-5 font-mono text-xs text-ink-light sm:grid-cols-3">
            {telemetry.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-stone">{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#identity"
              onMouseEnter={sendPulse}
              onFocus={sendPulse}
              onClick={sendPulse}
              className="group inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink"
            >
              Enter system
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onMouseEnter={sendPulse}
              onFocus={sendPulse}
              onClick={sendPulse}
              className="inline-flex items-center gap-3 border border-ink/15 bg-paper px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric hover:text-blueprint"
              aria-label="Send pulse through the intelligence core"
            >
              Transmit pulse
              <Send className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Chapter navigation"
            className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-2 border-t border-ink/10 pt-5 font-mono text-[10px] uppercase text-stone sm:grid-cols-3"
          >
            {chapters.map(([code, label, href]) => (
              <a
                key={label}
                href={href}
                className="group flex items-center gap-2 transition-colors hover:text-ink"
                onMouseEnter={sendPulse}
                onFocus={sendPulse}
              >
                <span className="text-ink">{code}</span>
                <span className="h-px flex-1 bg-ink/10 group-hover:bg-electric" />
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 28 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[430px] w-full self-center md:h-[76vh] md:min-h-[600px]"
          onMouseEnter={sendPulse}
          onFocus={sendPulse}
        >
          <div className="absolute -left-8 top-10 z-10 hidden -rotate-90 items-center gap-2 font-mono text-[10px] uppercase text-stone md:flex">
            <RadioTower
              className="h-3.5 w-3.5 text-electric"
              aria-hidden="true"
            />
            Living machine embedded
          </div>
          <div className="absolute inset-x-8 top-0 h-px bg-ink/10 md:inset-x-0" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-ink/10" />
          <div className="absolute left-0 top-8 h-[calc(100%-4rem)] w-px bg-ink/10" />
          <div className="absolute right-0 top-8 h-[calc(100%-4rem)] w-px bg-ink/10" />
          <IntelligenceCore pulse={graphPulse} />
        </motion.div>
      </div>
    </section>
  );
}
