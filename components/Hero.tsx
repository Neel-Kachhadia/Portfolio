"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, Command, CornerDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMotionPreference } from "@/components/useMotionPreference";

const IntelligenceCore = dynamic(
  () => import("@/components/IntelligenceCore"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase text-stone">
        machine bed loading
      </div>
    ),
  },
);

export default function Hero() {
  const [opened, setOpened] = useState(false);
  const [activation, setActivation] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const leftPaperRef = useRef<HTMLDivElement>(null);
  const rightPaperRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { isMotionEnabled } = useMotionPreference();

  const openSurface = useCallback(
    (scrollAfter = false) => {
      setOpened(true);
      setActivation((value) => value + 1);

      if (scrollAfter) {
        window.setTimeout(() => {
          document
            .querySelector("#work")
            ?.scrollIntoView({ behavior: isMotionEnabled ? "smooth" : "auto" });
        }, isMotionEnabled ? 900 : 0);
      }
    },
    [isMotionEnabled],
  );

  useEffect(() => {
    if (!isMotionEnabled) {
      setOpened(true);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(titleRefs.current, { yPercent: 118, rotate: 2 });
      gsap.set([subtitleRef.current, ctaRef.current], { opacity: 0, y: 18 });
      gsap.set(machineRef.current, { opacity: 0, scale: 0.96, rotateX: 8 });
      gsap.set(seamRef.current, { scaleX: 0, transformOrigin: "center" });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(seamRef.current, { scaleX: 1, duration: 0.46 }, 0.12)
        .to(
          titleRefs.current,
          { yPercent: 0, rotate: 0, duration: 1, stagger: 0.08 },
          0.25,
        )
        .to(
          [subtitleRef.current, ctaRef.current],
          { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 },
          0.78,
        )
        .to(
          machineRef.current,
          { opacity: 1, scale: 1, rotateX: 0, duration: 1.05 },
          0.92,
        );
    }, sectionRef);

    const timer = window.setTimeout(() => openSurface(false), 1050);

    return () => {
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, [isMotionEnabled, openSurface]);

  useEffect(() => {
    if (!isMotionEnabled) return;

    const ctx = gsap.context(() => {
      if (!opened) return;

      gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(
          leftPaperRef.current,
          {
            clipPath: "polygon(0 0, 41% 0, 28% 100%, 0 100%)",
            xPercent: -7,
            rotateY: -18,
            rotateZ: -1.2,
            duration: 1.15,
          },
          0,
        )
        .to(
          rightPaperRef.current,
          {
            clipPath: "polygon(62% 0, 100% 0, 100% 100%, 74% 100%)",
            xPercent: 7,
            rotateY: 18,
            rotateZ: 1.2,
            duration: 1.15,
          },
          0,
        )
        .to(
          seamRef.current,
          {
            opacity: 0.9,
            boxShadow: "0 0 44px rgba(74,255,145,0.38)",
            duration: 0.28,
            yoyo: true,
            repeat: 1,
          },
          0.12,
        )
        .fromTo(
          ".hero-aperture-word",
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.72, stagger: 0.06 },
          0.28,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [opened, isMotionEnabled]);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[105svh] w-full overflow-hidden px-5 pb-16 pt-24 md:px-8 md:pb-10 md:pt-24"
    >
      <div className="absolute inset-0 -z-20 bg-cream" />
      <div className="absolute inset-0 -z-10 opacity-[0.055] [background-image:linear-gradient(90deg,#1A1612_1px,transparent_1px)] [background-size:24vw_100%]" />

      <div
        ref={machineRef}
        className="absolute inset-x-[-22vw] top-[22svh] z-0 h-[56svh] opacity-95 md:inset-x-[6vw] md:top-[14svh] md:h-[76svh]"
      >
        <IntelligenceCore activation={activation} opened={opened} />
      </div>

      <div
        ref={leftPaperRef}
        className="paper-fold pointer-events-none absolute inset-0 z-10 bg-cream"
      />
      <div
        ref={rightPaperRef}
        className="paper-fold pointer-events-none absolute inset-0 z-10 bg-paper"
      />
      <div
        ref={seamRef}
        className="pointer-events-none absolute left-1/2 top-[12svh] z-20 h-[78svh] w-px -translate-x-1/2 bg-electric opacity-70"
      />

      <div className="relative z-30 mx-auto grid min-h-[calc(105svh-8rem)] w-full max-w-[1500px] content-between">
        <div className="grid gap-10">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase text-stone md:text-[11px]">
            <span>paper surface / machine underneath</span>
            <span className="hidden text-ink md:block">
              {opened ? "surface open" : "surface sealed"}
            </span>
          </div>

          <h1
            id="hero-title"
            className="max-w-[12ch] font-mono text-[4.2rem] font-black uppercase leading-[0.75] text-ink sm:text-[7rem] md:text-[10.5rem] lg:text-[13.6rem]"
          >
            {["NEEL", "KACHHADIA", "OS"].map((line, index) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span
                  ref={(node) => {
                    if (node) titleRefs.current[index] = node;
                  }}
                  className={`block ${
                    index === 1
                      ? "ml-[11vw] font-serif font-normal italic text-stone md:ml-36"
                      : ""
                  } ${index === 2 ? "hero-aperture-word ml-[38vw] text-electric md:ml-[34rem]" : ""}`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="mb-1 mt-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <p
            ref={subtitleRef}
            className="max-w-3xl font-serif text-3xl italic leading-[1.02] text-stone sm:text-4xl md:text-5xl"
          >
            Calm paper. Ink identity. Then a reasoning machine opens under the
            typography and starts routing proof.
          </p>

          <div ref={ctaRef} className="grid gap-5 md:justify-self-end md:text-right">
            <p className="max-w-xl font-mono text-sm leading-relaxed text-ink-light md:text-base">
              Neel builds AI finance systems, semantic matching engines, and
              interfaces where machinery becomes legible.
            </p>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <motion.button
                type="button"
                onClick={() => openSurface(true)}
                whileHover={isMotionEnabled ? { y: -2 } : undefined}
                whileTap={isMotionEnabled ? { scale: 0.97 } : undefined}
                className="group inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink"
              >
                Enter System
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-command-palette"))
                }
                whileHover={isMotionEnabled ? { y: -2 } : undefined}
                whileTap={isMotionEnabled ? { scale: 0.97 } : undefined}
                className="inline-flex items-center gap-3 border border-ink/15 bg-paper/80 px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric"
              >
                <Command className="h-4 w-4 text-stone" aria-hidden="true" />
                Command
              </motion.button>
            </div>

            <a
              href="#work"
              className="inline-flex items-center gap-2 justify-self-start font-mono text-[11px] uppercase text-stone transition-colors hover:text-ink md:justify-self-end"
            >
              <CornerDownRight className="h-3.5 w-3.5 text-electric" />
              Pull first dossier
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
