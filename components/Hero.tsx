"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, MoveRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionPreference } from "@/components/useMotionPreference";

const IntelligenceCore = dynamic(
  () => import("@/components/IntelligenceCore"),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-ink" />,
  },
);

const CLOSED_APERTURE =
  "polygon(0% 47%, 100% 36%, 100% 37.5%, 0% 48.5%)";
const OPEN_APERTURE =
  "polygon(0% 33%, 100% 17%, 100% 64%, 0% 83%)";
const ACTIVE_APERTURE =
  "polygon(0% 27%, 100% 10%, 100% 72%, 0% 90%)";

export default function Hero() {
  const [pulse, setPulse] = useState(0);
  const [status, setStatus] = useState<"quiet" | "opening" | "accepted">(
    "quiet",
  );
  const sectionRef = useRef<HTMLElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);
  const edgeTopRef = useRef<SVGPathElement>(null);
  const edgeBottomRef = useRef<SVGPathElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const routeSignalRef = useRef<SVGCircleElement>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!isMotionEnabled) {
      setStatus("accepted");
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(titleRefs.current, { yPercent: 112, rotate: 1.6 });
      gsap.set([metaRef.current, copyRef.current, ctaRef.current], {
        opacity: 0,
        y: 18,
      });
      gsap.set(apertureRef.current, {
        opacity: 0,
        clipPath: CLOSED_APERTURE,
        webkitClipPath: CLOSED_APERTURE,
      });
      gsap.set([edgeTopRef.current, edgeBottomRef.current], {
        strokeDasharray: 1600,
        strokeDashoffset: 1600,
        opacity: 0,
      });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(metaRef.current, { opacity: 1, y: 0, duration: 0.42 }, 0.04)
        .to(
          titleRefs.current,
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.86,
            stagger: 0.085,
          },
          0.16,
        )
        .to(
          apertureRef.current,
          {
            opacity: 1,
            clipPath: OPEN_APERTURE,
            webkitClipPath: OPEN_APERTURE,
            duration: 1.08,
            ease: "expo.inOut",
          },
          0.78,
        )
        .to(
          [edgeTopRef.current, edgeBottomRef.current],
          {
            opacity: 1,
            strokeDashoffset: 0,
            duration: 0.78,
            stagger: 0.04,
          },
          0.92,
        )
        .to(
          [copyRef.current, ctaRef.current],
          { opacity: 1, y: 0, duration: 0.56, stagger: 0.08 },
          1.22,
        )
        .call(() => {
          setPulse((value) => value + 1);
          drawRoute(false);
        });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMotionEnabled]);

  const drawRoute = (confirm = true) => {
    const path = routePathRef.current;
    const signal = routeSignalRef.current;

    if (!path || !signal) {
      if (confirm) setStatus("accepted");
      return;
    }

    const length = path.getTotalLength();
    const progress = { value: 0 };

    gsap.killTweensOf([path, signal]);
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    gsap.set(signal, { opacity: 1, attr: { r: 6 } });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: confirm ? 0.92 : 1.08,
      ease: "power3.inOut",
    });
    gsap.to(progress, {
      value: 1,
      duration: confirm ? 0.92 : 1.08,
      ease: "power3.inOut",
      onUpdate: () => {
        const point = path.getPointAtLength(progress.value * length);
        signal.setAttribute("cx", String(point.x));
        signal.setAttribute("cy", String(point.y));
      },
      onComplete: () => {
        if (confirm) setStatus("accepted");
        gsap.to(signal, {
          attr: { r: 3.5 },
          duration: 0.22,
          ease: "power2.out",
        });
      },
    });
  };

  const openSystem = (scrollAfter = false) => {
    setPulse((value) => value + 1);
    setStatus("opening");

    if (isMotionEnabled) {
      gsap
        .timeline({ defaults: { ease: "expo.inOut" } })
        .to(apertureRef.current, {
          clipPath: ACTIVE_APERTURE,
          webkitClipPath: ACTIVE_APERTURE,
          duration: 0.48,
        })
        .to(
          apertureRef.current,
          {
            clipPath: OPEN_APERTURE,
            webkitClipPath: OPEN_APERTURE,
            duration: 0.72,
          },
          "+=0.18",
        );
      gsap.fromTo(
        [edgeTopRef.current, edgeBottomRef.current],
        { y: 0 },
        { y: (_, target) => (target === edgeTopRef.current ? -10 : 10), duration: 0.34, yoyo: true, repeat: 1 },
      );
      drawRoute(true);
    } else {
      setStatus("accepted");
    }

    if (scrollAfter) {
      window.setTimeout(() => {
        document.querySelector("#identity")?.scrollIntoView({
          behavior: isMotionEnabled ? "smooth" : "auto",
          block: "start",
        });
      }, isMotionEnabled ? 760 : 0);
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-cream px-4 pb-40 pt-20 sm:px-6 sm:pb-8 md:px-8 md:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(26,22,18,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(26,22,18,0.014)_1px,transparent_1px)] bg-[size:92px_92px]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(26,22,18,0.45)_1px,transparent_0)] [background-size:18px_18px]" />

      <div
        ref={apertureRef}
        className="pointer-events-none absolute inset-x-[-10vw] top-[19svh] z-20 h-[52svh] overflow-hidden bg-ink shadow-[0_34px_90px_rgba(26,22,18,0.34)] sm:top-[5svh] sm:h-[84svh]"
        style={{
          clipPath: CLOSED_APERTURE,
          WebkitClipPath: CLOSED_APERTURE,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(74,255,145,0.16),transparent_28%),linear-gradient(120deg,rgba(245,240,232,0.08),transparent_22%,rgba(245,240,232,0.04)_60%,transparent)]" />
        <IntelligenceCore pulse={pulse} />
        <svg
          aria-hidden="true"
          viewBox="0 0 1400 760"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            ref={routePathRef}
            d="M 78 555 H 250 V 438 H 420 V 268 H 632 V 356 H 806 V 210 H 1128 V 300 H 1322"
            fill="none"
            stroke="#4AFF91"
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="3.2"
            opacity="0"
          />
          <circle
            ref={routeSignalRef}
            cx="78"
            cy="555"
            r="0"
            fill="#4AFF91"
            opacity="0"
          />
        </svg>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1400 760"
        className="pointer-events-none absolute inset-x-[-10vw] top-[19svh] z-30 h-[52svh] w-[120vw] sm:top-[5svh] sm:h-[84svh]"
        preserveAspectRatio="none"
      >
        <path
          ref={edgeTopRef}
          d="M -40 326 C 210 296 418 260 648 226 C 920 186 1112 140 1440 94"
          fill="none"
          stroke="#F5F0E8"
          strokeLinecap="square"
          strokeWidth="18"
        />
        <path
          d="M -40 326 C 210 296 418 260 648 226 C 920 186 1112 140 1440 94"
          fill="none"
          stroke="#1A1612"
          strokeOpacity="0.34"
          strokeWidth="1.4"
        />
        <path
          ref={edgeBottomRef}
          d="M -40 620 C 260 548 468 510 706 466 C 966 418 1168 390 1440 354"
          fill="none"
          stroke="#F5F0E8"
          strokeLinecap="square"
          strokeWidth="20"
        />
        <path
          d="M -40 620 C 260 548 468 510 706 466 C 966 418 1168 390 1440 354"
          fill="none"
          stroke="#1A1612"
          strokeOpacity="0.36"
          strokeWidth="1.4"
        />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-[1540px] flex-col justify-between">
        <div
          ref={metaRef}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-3 font-mono text-[10px] uppercase text-stone sm:text-[11px]"
        >
          <span>NEEL.OS / HERO SURFACE</span>
          <span>AI Systems Engineer · Mumbai, India — 2026</span>
        </div>

        <div className="relative py-8 sm:py-10 md:py-12">
          <h1
            id="hero-title"
            className="max-w-[11.2ch] font-mono text-[clamp(4.2rem,14vw,14.5rem)] font-black uppercase leading-[0.76] text-ink"
          >
            {["NEEL KACHHADIA", "BUILDS SYSTEMS", "THAT THINK."].map(
              (line, index) => (
                <span key={line} className="block overflow-hidden pb-2">
                  <span
                    ref={(node) => {
                      if (node) titleRefs.current[index] = node;
                    }}
                    className={`block ${
                      index === 2
                        ? "font-serif font-normal italic"
                        : index === 1
                          ? "pl-[12vw] sm:pl-[18vw]"
                          : ""
                    }`}
                  >
                    {line}
                  </span>
                </span>
              ),
            )}
          </h1>
        </div>

        <div className="relative z-40 grid gap-6 border-t border-ink/10 pt-5 md:grid-cols-[1fr_auto] md:items-end">
          <div ref={copyRef} className="grid max-w-3xl gap-3">
            <p className="font-serif text-[clamp(1.65rem,4.2vw,4.8rem)] italic leading-[0.96] text-ink-light">
              Agentic financial systems, semantic matching engines, and
              interfaces that make intelligence legible.
            </p>
          </div>

          <div ref={ctaRef} className="grid gap-3 md:justify-items-end">
            <AnimatePresence mode="wait">
              {status !== "quiet" && (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="font-mono text-[10px] uppercase text-ink"
                >
                  {status === "opening" ? "SURFACE OPENING" : "SIGNAL ACCEPTED"}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <motion.button
                type="button"
                onClick={() => openSystem(true)}
                onPointerEnter={() => openSystem(false)}
                whileHover={{ y: isMotionEnabled ? -2 : 0 }}
                whileTap={{ scale: isMotionEnabled ? 0.97 : 1 }}
                className="group inline-flex min-h-12 items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink"
              >
                Enter System
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              <motion.a
                href="#work"
                onMouseEnter={() => openSystem(false)}
                onFocus={() => openSystem(false)}
                whileHover={{ x: isMotionEnabled ? 3 : 0 }}
                whileTap={{ scale: isMotionEnabled ? 0.97 : 1 }}
                className="inline-flex min-h-12 items-center gap-3 border border-ink/20 bg-paper/80 px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric"
              >
                View Work
                <MoveRight className="h-4 w-4 text-electric" aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
