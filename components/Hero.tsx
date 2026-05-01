"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown, Command, MoveRight, RadioTower } from "lucide-react";
import { motion } from "motion/react";
import { useMotionPreference } from "@/components/useMotionPreference";

const IntelligenceCore = dynamic(
  () => import("@/components/IntelligenceCore"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase text-stone">
        routing field loading
      </div>
    ),
  },
);

const chapters = [
  ["INIT", "#home"],
  ["IDENTITY", "#identity"],
  ["DOSSIERS", "#work"],
  ["MAP", "#capabilities"],
  ["HUMAN", "#about"],
  ["END", "#contact"],
];

export default function Hero() {
  const [pulse, setPulse] = useState(0);
  const [routeState, setRouteState] = useState<"idle" | "armed" | "sent">(
    "idle",
  );
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!isMotionEnabled) return;

    const ctx = gsap.context(() => {
      gsap.set(titleRefs.current, { yPercent: 115, rotate: 2 });
      gsap.set([copyRef.current, ctaRef.current], { opacity: 0, y: 18 });
      gsap.set(markRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(machineRef.current, { opacity: 0, x: 80, rotate: -2 });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(markRef.current, { scaleX: 1, duration: 0.42 }, 0.12)
        .to(
          titleRefs.current,
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.96,
            stagger: 0.095,
          },
          0.28,
        )
        .to(
          machineRef.current,
          { opacity: 1, x: 0, rotate: 0, duration: 1.15 },
          0.48,
        )
        .to(
          [copyRef.current, ctaRef.current],
          { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 },
          0.92,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionEnabled]);

  const fireRoute = (scrollAfter = false) => {
    setPulse((value) => value + 1);
    setRouteState("armed");

    if (routePathRef.current && isMotionEnabled) {
      const path = routePathRef.current;
      const length = path.getTotalLength();
      gsap.killTweensOf(path);
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.86,
        ease: "power3.inOut",
        onComplete: () => setRouteState("sent"),
      });
    } else {
      setRouteState("sent");
    }

    if (scrollAfter) {
      window.setTimeout(() => {
        document.querySelector("#identity")?.scrollIntoView({
          behavior: isMotionEnabled ? "smooth" : "auto",
          block: "start",
        });
      }, isMotionEnabled ? 620 : 0);
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative min-h-[104svh] w-full overflow-hidden px-5 pb-16 pt-24 md:px-8 md:pb-10 md:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_24%,rgba(74,255,145,0.18),transparent_28%),linear-gradient(90deg,rgba(26,22,18,0.05)_1px,transparent_1px)] bg-[size:auto,17vw_100%] opacity-70" />
      <div
        ref={markRef}
        className="pointer-events-none absolute left-5 top-20 z-20 h-px w-[min(48rem,70vw)] bg-electric md:left-8"
      />

      <svg
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
      >
        <path
          ref={routePathRef}
          d="M 60 560 C 260 470 370 420 520 448 S 780 565 980 420 S 1280 198 1460 242"
          fill="none"
          stroke="#4AFF91"
          strokeWidth="2"
          strokeLinecap="square"
          opacity="0"
        />
      </svg>

      <div
        ref={machineRef}
        className="absolute -right-[38vw] top-[10svh] z-0 h-[56svh] w-[112vw] opacity-90 sm:-right-[24vw] md:-right-[9vw] md:top-[8svh] md:h-[82svh] md:w-[72vw]"
        onPointerEnter={() => fireRoute(false)}
      >
        <IntelligenceCore pulse={pulse} />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(104svh-8rem)] w-full max-w-[1500px] content-between">
        <div className="grid gap-8 md:grid-cols-[0.72fr_0.28fr]">
          <div>
            <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase text-stone md:text-[11px]">
              <RadioTower className="h-4 w-4 text-electric" aria-hidden="true" />
              <span>system_init / authored surface</span>
              <span className="hidden h-px w-20 bg-ink/15 md:block" />
              <span className="hidden text-ink md:inline">
                {routeState === "idle"
                  ? "field quiet"
                  : routeState === "armed"
                    ? "route drawing"
                    : "route confirmed"}
              </span>
            </div>

            <h1
              id="hero-title"
              className="relative max-w-[9.8ch] font-mono text-[4.4rem] font-black uppercase leading-[0.76] text-ink sm:text-[6.9rem] md:text-[9.2rem] lg:text-[12.2rem]"
            >
              {["NEEL.OS", "BUILT", "TO REASON"].map((line, index) => (
                <span key={line} className="block overflow-hidden pb-2">
                  <span
                    ref={(node) => {
                      if (node) titleRefs.current[index] = node;
                    }}
                    className={`block ${
                      index === 1 ? "ml-[21vw] font-serif italic md:ml-40" : ""
                    }`}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="hidden self-start pt-24 font-mono text-[10px] uppercase leading-relaxed text-stone md:block">
            <div className="border-l border-ink/15 pl-4">
              <div>cream paper</div>
              <div>ink logic</div>
              <div>electric route</div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-[0.92fr_1.08fr] md:items-end">
          <p
            ref={copyRef}
            className="max-w-3xl font-serif text-3xl italic leading-[0.98] text-stone sm:text-4xl md:text-5xl"
          >
            An editorial artifact wrapped around a personal AI operating system:
            case files, reasoning routes, and human judgment under glass.
          </p>

          <div
            ref={ctaRef}
            className="grid gap-6 border-t border-ink/10 pt-6 md:justify-self-end md:text-right"
          >
            <p className="max-w-xl font-mono text-sm leading-relaxed text-ink-light md:text-base">
              Neel Kachhadia builds agentic finance systems, semantic matching
              engines, and interfaces that make intelligent machinery feel
              legible.
            </p>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <motion.button
                type="button"
                onClick={() => fireRoute(true)}
                onPointerEnter={() => fireRoute(false)}
                whileHover={{ x: isMotionEnabled ? -3 : 0 }}
                whileTap={{ scale: isMotionEnabled ? 0.97 : 1 }}
                className="group inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink"
              >
                Enter OS
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-command-palette"))
                }
                whileHover={{ x: isMotionEnabled ? 3 : 0 }}
                whileTap={{ scale: isMotionEnabled ? 0.97 : 1 }}
                className="inline-flex items-center gap-3 border border-ink/15 bg-paper/80 px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric"
              >
                <Command className="h-4 w-4 text-electric" aria-hidden="true" />
                Command
              </motion.button>
            </div>

            <nav
              aria-label="Chapter navigation"
              className="grid grid-cols-2 gap-x-5 gap-y-2 font-mono text-[10px] uppercase text-stone sm:grid-cols-3 md:justify-items-end"
            >
              {chapters.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onMouseEnter={() => fireRoute(false)}
                  onFocus={() => fireRoute(false)}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-ink"
                >
                  <span>{label}</span>
                  <MoveRight
                    className="h-3 w-3 text-electric opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
