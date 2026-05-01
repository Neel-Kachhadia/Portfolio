"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MoveRight, Unlock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionPreference } from "@/components/useMotionPreference";

const ArtifactScene = dynamic(() => import("@/components/ArtifactScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_45%,rgba(245,240,232,0.16),transparent_32rem)]" />
  ),
});

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [activation, setActivation] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!isMotionEnabled) return;

    const ctx = gsap.context(() => {
      gsap.set(titleRefs.current, { yPercent: 115, rotate: 1.8 });
      gsap.set([metaRef.current, copyRef.current, ctaRef.current], {
        opacity: 0,
        y: 18,
      });
      gsap.set(sceneRef.current, { opacity: 0, scale: 0.92, y: 34 });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.48 }, 0.08)
        .to(
          titleRefs.current,
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.04,
            stagger: 0.11,
          },
          0.2,
        )
        .to(
          sceneRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.18,
            ease: "expo.out",
          },
          0.48,
        )
        .to(
          [copyRef.current, ctaRef.current],
          { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 },
          0.96,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionEnabled]);

  const openArtifact = useCallback(() => {
    setIsOpen(true);
    setActivation((value) => value + 1);
  }, []);

  useEffect(() => {
    const button = openButtonRef.current;
    if (!button) return;

    button.addEventListener("click", openArtifact);
    button.addEventListener("pointerenter", openArtifact);
    button.addEventListener("focus", openArtifact);

    return () => {
      button.removeEventListener("click", openArtifact);
      button.removeEventListener("pointerenter", openArtifact);
      button.removeEventListener("focus", openArtifact);
    };
  }, [openArtifact]);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink px-4 pb-24 pt-20 text-cream sm:px-6 sm:pb-16 md:px-8 md:pb-12 md:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_28%,rgba(245,240,232,0.14),transparent_30rem),radial-gradient(circle_at_50%_72%,rgba(74,255,145,0.07),transparent_22rem),linear-gradient(180deg,#1A1612_0%,#0F0D0B_58%,#1A1612_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[48svh] bg-[radial-gradient(ellipse_at_center,rgba(245,240,232,0.16),transparent_62%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.045] [background-image:linear-gradient(rgba(245,240,232,0.38)_1px,transparent_1px)] [background-size:100%_9px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-[1560px] flex-col">
        <div
          ref={metaRef}
          className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase text-cream/58 sm:text-[11px]"
        >
          <span>AI Systems Engineer</span>
          <span>Mumbai, India — 2026</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-7 sm:py-8">
          <h1
            id="hero-title"
            aria-label="Neel Kachhadia"
            className="pointer-events-none absolute inset-x-[-0.5rem] top-[7svh] z-10 select-none font-mono text-[clamp(4.4rem,15.5vw,17.8rem)] font-black uppercase leading-[0.72] tracking-normal text-cream/92 sm:top-[4svh]"
          >
            {["NEEL", "KACHHADIA"].map((line, index) => (
              <span
                key={line}
                className={`block overflow-hidden pb-3 ${
                  index === 1
                    ? "translate-y-[31svh] text-right text-cream/86 sm:translate-y-[35svh]"
                    : ""
                }`}
              >
                <span
                  ref={(node) => {
                    if (node) titleRefs.current[index] = node;
                  }}
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div
            ref={sceneRef}
            className="relative z-20 h-[56svh] min-h-[420px] w-full max-w-[980px] sm:h-[70svh] sm:min-h-[540px]"
          >
            <ArtifactScene opened={isOpen} activation={activation} />
          </div>
        </div>

        <div className="relative z-30 grid gap-5 pb-6 sm:grid-cols-[minmax(0,38rem)_auto] sm:items-end sm:pb-8">
          <div ref={copyRef} className="max-w-[42rem]">
            <p className="font-serif text-[clamp(1.55rem,3.4vw,3.8rem)] italic leading-[0.96] text-cream">
              Building agentic financial systems, semantic matching engines,
              and product-grade interfaces.
            </p>
          </div>

          <div ref={ctaRef} className="grid gap-3 sm:justify-items-end">
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="font-mono text-[10px] uppercase tracking-normal text-electric"
                >
                  ARTIFACT OPEN
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                ref={openButtonRef}
                type="button"
                aria-pressed={isOpen}
                onClick={openArtifact}
                onPointerEnter={openArtifact}
                whileHover={{ y: isMotionEnabled ? -2 : 0 }}
                whileTap={{ scale: isMotionEnabled ? 0.97 : 1 }}
                className="inline-flex min-h-12 items-center gap-3 border border-cream bg-cream px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric hover:bg-electric focus-visible:outline-electric"
              >
                OPEN ARTIFACT
                <Unlock className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              <motion.a
                href="#work"
                onMouseEnter={openArtifact}
                onFocus={openArtifact}
                whileHover={{ x: isMotionEnabled ? 3 : 0 }}
                whileTap={{ scale: isMotionEnabled ? 0.97 : 1 }}
                className="inline-flex min-h-12 items-center gap-3 border border-cream/24 bg-cream/5 px-5 py-3 font-mono text-xs uppercase text-cream backdrop-blur-sm transition-colors hover:border-electric"
              >
                VIEW WORK
                <MoveRight className="h-4 w-4 text-electric" aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
