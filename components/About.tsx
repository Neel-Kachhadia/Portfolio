"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserRound } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const timelineEvents = [
  {
    date: "AUG 2024",
    title: "DJSCE / E&TC",
    detail:
      "Started from electronics and communication, where systems are physical before they become abstract.",
  },
  {
    date: "OCT 2024",
    title: "MUMBAI HACKS",
    detail:
      "A 24-hour sprint made architecture feel less academic and more like survival.",
  },
  {
    date: "NOV 2024",
    title: "EQUITY RESEARCH PLATFORM",
    detail:
      "Built a LangGraph-backed research system around financial data, explainability, and clean API boundaries.",
  },
  {
    date: "MAR 2025",
    title: "NEUROFIN",
    detail:
      "Moved from single-agent flows into a finance OS with memory, forecasting, risk, and advisory layers.",
  },
  {
    date: "JUN 2025",
    title: "MENTORA",
    detail:
      "Used embeddings to make matching feel less like browsing and more like recognition.",
  },
  {
    date: "2026",
    title: "PERSONAL OS",
    detail:
      "Current direction: useful systems with enough strangeness, warmth, and engineering taste to feel inevitable.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!lineRef.current) return;

    if (!isMotionEnabled) {
      lineRef.current.style.strokeDashoffset = "0";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });

      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 72%",
          end: "bottom 48%",
          scrub: true,
        },
      });

      itemRefs.current.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.42, y: 16 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 78%",
              end: "top 52%",
              scrub: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionEnabled]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
      className="w-full px-6 py-32 md:px-8 md:py-44"
    >
      <div className="mx-auto grid w-full max-w-[1500px] gap-16 md:grid-cols-[0.86fr_1.14fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
            <UserRound className="h-4 w-4 text-electric" aria-hidden="true" />
            human record
          </span>
          <h2
            id="about-title"
            className="mt-5 font-mono text-[4rem] font-black uppercase leading-[0.78] text-ink sm:text-[5.4rem] md:text-[7.8rem]"
          >
            HUMAN
            <span className="block font-serif font-normal italic text-stone">
              layer
            </span>
          </h2>
          <p className="mt-10 max-w-xl font-serif text-3xl italic leading-[1.02] text-stone md:text-4xl">
            After the machinery, the record slows down: a student learning how
            to make intelligent systems feel honest, useful, and alive.
          </p>
          <p className="mt-7 max-w-xl font-mono text-sm leading-relaxed text-ink-light">
            Neel is a second-year E&TC student at DJSCE Mumbai, working across
            AI agents, financial systems, cloud infrastructure, and interfaces
            that make technical complexity feel legible.
          </p>
        </div>

        <div ref={timelineRef} className="relative pl-10 font-mono">
          <svg
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-3 overflow-visible"
            viewBox="0 0 8 680"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M4 0 V680"
              stroke="rgba(26,22,18,0.12)"
              strokeWidth="1"
              fill="none"
            />
            <path
              ref={lineRef}
              d="M4 0 V680"
              stroke="#4AFF91"
              strokeWidth="2"
              fill="none"
              pathLength="1"
            />
          </svg>

          <ol className="flex flex-col gap-12">
            {timelineEvents.map((event, index) => (
              <li
                key={event.title}
                ref={(node) => {
                  if (node) itemRefs.current[index] = node;
                }}
                className="relative grid gap-3 border-b border-ink/10 pb-9 md:grid-cols-[8rem_1fr]"
              >
                <span className="absolute -left-[2.05rem] top-1.5 h-5 w-5 border border-ink/20 bg-cream">
                  <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-electric" />
                </span>
                <time className="text-xs uppercase text-stone">
                  log / {event.date}
                </time>
                <div>
                  <h3 className="text-sm font-semibold uppercase text-ink">
                    {event.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-light">
                    {event.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
