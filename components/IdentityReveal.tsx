"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brackets, Fingerprint } from "lucide-react";
import { motion } from "motion/react";
import { useMotionPreference } from "@/components/useMotionPreference";

const fragments = [
  "LANGGRAPH.NODE",
  "FASTAPI.BOUNDARY",
  "REDIS.MEMORY",
  "EMBEDDING.MATCH",
  "FINANCE.SIGNAL",
  "REACT.SURFACE",
  "HUMAN.JUDGMENT",
  "SYSTEM.TASTE",
];

const principles = [
  ["not a theme", "a working surface for intelligent products"],
  ["not a demo", "deployed systems with reasoning traces"],
  ["not complexity", "clarity after the machinery has done its work"],
];

export default function IdentityReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const peelRef = useRef<HTMLDivElement>(null);
  const manifestoRefs = useRef<HTMLSpanElement[]>([]);
  const stripRefs = useRef<HTMLDivElement[]>([]);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!isMotionEnabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(peelRef.current, { clipPath: "inset(0 0 0 0)" });
      gsap.set(manifestoRefs.current, { yPercent: 110, rotate: 2 });
      gsap.set(stripRefs.current, { xPercent: -12, opacity: 0.42 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "center 42%",
            scrub: 0.7,
          },
        })
        .to(stripRefs.current, {
          xPercent: 0,
          opacity: 0.88,
          stagger: 0.04,
          ease: "none",
        })
        .to(
          peelRef.current,
          {
            clipPath: "inset(0 0 0 86%)",
            ease: "none",
          },
          0.12,
        )
        .to(
          manifestoRefs.current,
          {
            yPercent: 0,
            rotate: 0,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.2,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionEnabled]);

  return (
    <section
      id="identity"
      ref={sectionRef}
      aria-labelledby="identity-title"
      className="relative w-full overflow-hidden border-y border-ink/10 px-5 py-28 md:px-8 md:py-44"
    >
      <div className="mx-auto grid w-full max-w-[1500px] gap-12 md:grid-cols-[0.92fr_1.08fr] md:items-center">
        <div className="relative min-h-[390px] overflow-hidden border-y border-ink/10 py-6 md:min-h-[560px] md:border-y-0 md:py-0">
          <div
            ref={peelRef}
            className="absolute inset-0 z-10 bg-ink text-cream"
          >
            <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(245,240,232,0.12)_1px,transparent_1px)] [background-size:100%_40px]" />
            <div className="relative flex h-full flex-col justify-between p-5 font-mono text-[11px] uppercase leading-relaxed text-stone md:p-8">
              <div className="flex items-center gap-2 text-cream">
                <Brackets className="h-4 w-4 text-electric" aria-hidden="true" />
                system language
              </div>
              <div className="grid gap-3">
                {fragments.map((item, index) => (
                  <div
                    key={item}
                    ref={(node) => {
                      if (node) stripRefs.current[index] = node;
                    }}
                    className="flex items-center justify-between border-t border-cream/10 pt-3"
                  >
                    <span>{item}</span>
                    <span className="text-electric">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-0 flex min-h-[390px] flex-col justify-end md:min-h-[560px]">
            <span className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
              <Fingerprint className="h-4 w-4 text-electric" aria-hidden="true" />
              identity_reveal
            </span>
            <h2
              id="identity-title"
              className="font-mono text-[3.9rem] font-black uppercase leading-[0.78] text-ink sm:text-[6rem] md:text-[8.6rem]"
            >
              <span className="block overflow-hidden pb-2">
                <span
                  ref={(node) => {
                    if (node) manifestoRefs.current[0] = node;
                  }}
                  className="block"
                >
                  FROM
                </span>
              </span>
              <span className="ml-[18vw] block overflow-hidden pb-2 font-serif font-normal italic text-stone md:ml-28">
                <span
                  ref={(node) => {
                    if (node) manifestoRefs.current[1] = node;
                  }}
                  className="block"
                >
                  syntax
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span
                  ref={(node) => {
                    if (node) manifestoRefs.current[2] = node;
                  }}
                  className="block"
                >
                  TO SENSE
                </span>
              </span>
            </h2>
          </div>
        </div>

        <div className="grid gap-9">
          <motion.p
            initial={isMotionEnabled ? { opacity: 0, y: 18 } : false}
            whileInView={isMotionEnabled ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "-18%" }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-serif text-3xl italic leading-[1.02] text-stone md:text-5xl"
          >
            NEEL.OS is a case-file interface for someone who builds intelligent
            systems, then edits them until humans can feel the logic.
          </motion.p>

          <div className="grid gap-4 font-mono text-sm leading-relaxed text-ink-light md:text-base">
            <p>
              The site stops explaining itself as a concept and starts behaving
              like one: routes activate, files unfold, proofs attach to skills,
              and the final contact becomes a transmission.
            </p>
            <p>
              The voice stays premium and editorial, but the motion is
              functional: language peels back, machine layers recompose, and the
              human layer slows the operating system down.
            </p>
          </div>

          <div className="grid gap-3 border-y border-ink/10 py-5 font-mono text-xs md:grid-cols-3">
            {principles.map(([label, detail]) => (
              <div key={label} className="grid gap-3 border-ink/10 md:border-l md:pl-4">
                <span className="uppercase text-stone">{label}</span>
                <span className="leading-relaxed text-ink">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
