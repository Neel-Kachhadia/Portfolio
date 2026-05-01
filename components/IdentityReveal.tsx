"use client";

import { motion } from "motion/react";
import { Brackets, Fingerprint, RadioTower } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const identitySignals = [
  ["FORMAT", "personal AI operating system"],
  ["VOICE", "engineering precision with human contrast"],
  ["MATERIAL", "cream paper, black ink, electric signal"],
  ["METHOD", "systems thinking, product taste, deployed code"],
];

const calibration = [
  "Agentic finance systems",
  "Semantic matching engines",
  "Realtime intelligence surfaces",
  "Cloud-backed product infrastructure",
];

export default function IdentityReveal() {
  const { isMotionEnabled } = useMotionPreference();

  return (
    <section
      id="identity"
      aria-labelledby="identity-title"
      className="relative w-full overflow-hidden border-y border-ink/10 px-6 py-28 md:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute -right-8 top-6 font-mono text-[9rem] font-black leading-none text-ink/[0.035] md:text-[18rem]">
        02
      </div>

      <div className="mx-auto grid w-full max-w-[1500px] gap-14 md:grid-cols-[0.82fr_1.18fr] md:items-end">
        <div className="relative">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
            <Fingerprint className="h-4 w-4 text-electric" aria-hidden="true" />
            02 / IDENTITY_REVEAL
          </span>

          <h2
            id="identity-title"
            className="mt-8 font-mono text-[4rem] font-black uppercase leading-[0.78] text-ink sm:text-[6rem] md:text-[7.5rem]"
          >
            <motion.span
              className="block overflow-hidden pb-2"
              initial={
                isMotionEnabled ? { clipPath: "inset(0 100% 0 0)" } : false
              }
              whileInView={
                isMotionEnabled ? { clipPath: "inset(0 0% 0 0)" } : undefined
              }
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              IDENTITY
            </motion.span>
            <motion.span
              className="ml-[18vw] block overflow-hidden pb-2 font-serif font-normal italic leading-[0.82] text-stone md:ml-24"
              initial={
                isMotionEnabled ? { clipPath: "inset(0 100% 0 0)" } : false
              }
              whileInView={
                isMotionEnabled ? { clipPath: "inset(0 0% 0 0)" } : undefined
              }
              viewport={{ once: true, margin: "-20%" }}
              transition={{
                duration: 0.72,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              reveal
            </motion.span>
          </h2>

          <p className="mt-10 max-w-xl font-serif text-3xl italic leading-[1.02] text-stone md:text-4xl">
            The interface is restrained because the systems underneath are not.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-5 border-y border-ink/10 py-6 md:grid-cols-[0.82fr_1.18fr]">
            <div className="font-mono text-[11px] uppercase leading-relaxed text-stone">
              <Brackets
                className="mb-4 h-5 w-5 text-electric"
                aria-hidden="true"
              />
              NEEL KACHHADIA
              <br />
              AI systems engineer
              <br />
              Mumbai, India
            </div>
            <p className="font-mono text-sm leading-relaxed text-ink-light md:text-base">
              NEEL.OS is built as a personal control surface: part portfolio,
              part architecture map, part living case file. The work moves
              between model behavior, backend reliability, financial logic, and
              interface systems that make complexity visible.
            </p>
          </div>

          <div className="grid gap-4 font-mono text-xs md:grid-cols-2">
            {identitySignals.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={
                  isMotionEnabled
                    ? { x: index % 2 === 0 ? -28 : 28, opacity: 0.35 }
                    : false
                }
                whileInView={isMotionEnabled ? { x: 0, opacity: 1 } : undefined}
                viewport={{ once: true, margin: "-18%" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-ink/10 pt-4"
              >
                <span className="text-stone">{label}</span>
                <span className="text-ink">{value}</span>
              </motion.div>
            ))}
          </div>

          <div className="relative overflow-hidden border-y border-ink/10 py-5">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase text-stone">
              <span className="flex items-center gap-2">
                <RadioTower
                  className="h-4 w-4 text-electric"
                  aria-hidden="true"
                />
                Calibration loop
              </span>
              <span>4 active channels</span>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {calibration.map((item, index) => (
                <motion.div
                  key={item}
                  initial={
                    isMotionEnabled ? { scaleX: 0.2, opacity: 0 } : false
                  }
                  whileInView={
                    isMotionEnabled ? { scaleX: 1, opacity: 1 } : undefined
                  }
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{
                    duration: 0.42,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="origin-left border-l border-electric bg-paper/50 px-3 py-3 font-mono text-[11px] uppercase leading-relaxed text-ink"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
