"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ArrowUpRight, Check, Copy, RadioTower, Terminal } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const email = "neel1234kachhadia@gmail.com";
const scrambleChars = "!<>-_\\/[]{}=+*^?#0123456789";

function ScrambleExternal({ href, text }: { href: string; text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(
    () => () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    },
    [],
  );

  const scramble = () => {
    if (!isMotionEnabled) return;
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    let iterations = 0;
    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            if (letter === "/" || letter === "." || letter === "@") return letter;
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join(""),
      );

      if (iterations >= text.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText(text);
      }

      iterations += 1;
    }, 24);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={scramble}
      onFocus={scramble}
      className="group flex w-fit items-center gap-3 py-1 font-mono text-sm text-ink transition-colors hover:text-blueprint md:text-base"
    >
      <span className="border-b border-ink/20 group-hover:border-electric">
        {displayText}
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 text-stone group-hover:text-electric"
        aria-hidden="true"
      />
    </a>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const { isMotionEnabled } = useMotionPreference();

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  const transmitEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Transmission copied", { description: email });
    } catch {
      toast.error("Clipboard blocked", { description: email });
    }

    setSent(false);

    if (pathRef.current && isMotionEnabled) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      gsap.killTweensOf(path);
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
      gsap
        .timeline({
          onComplete: () => setSent(true),
        })
        .to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power3.inOut",
        })
        .fromTo(
          blackoutRef.current,
          { opacity: 0 },
          { opacity: 0.16, duration: 0.08, yoyo: true, repeat: 1 },
          0.62,
        );
    } else {
      setSent(true);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative min-h-[92svh] w-full overflow-hidden border-t border-ink/10 px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-44"
    >
      <div
        ref={blackoutRef}
        className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0"
      />
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M 40 580 C 240 330 430 470 640 260 S 1060 230 1280 420 S 1440 560 1520 160"
          fill="none"
          stroke="#4AFF91"
          strokeWidth="2"
          strokeLinecap="square"
          opacity="0"
        />
      </svg>

      <div className="mx-auto flex min-h-[calc(92svh-12rem)] w-full max-w-[1500px] flex-col justify-between">
        <div>
          <span className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
            <RadioTower className="h-4 w-4 text-electric" aria-hidden="true" />
            transmission_end / final route
          </span>
          <h2
            id="contact-title"
            className="max-w-7xl font-mono text-[3.5rem] font-black uppercase leading-[0.82] text-ink sm:text-[5.2rem] md:text-[8.2rem] lg:text-[10.2rem]"
          >
            LET&apos;S BUILD
            <span className="ml-[10vw] block font-serif font-normal italic text-stone md:ml-28">
              something
            </span>
            UNREASONABLE.
          </h2>
        </div>

        <div className="mt-16 grid gap-10 border-y border-ink/10 py-8 md:grid-cols-[0.82fr_1.18fr] md:items-end">
          <p className="max-w-2xl font-serif text-3xl italic leading-[1.02] text-stone md:text-5xl">
            Available for AI systems, products, and ideas that should not look
            possible at first glance.
          </p>

          <div className="grid gap-6 md:justify-self-end md:text-right">
            <button
              type="button"
              onClick={transmitEmail}
              className="group inline-flex w-fit items-center gap-3 justify-self-start border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink md:justify-self-end"
            >
              {sent ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {email}
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={sent ? "sent" : "idle"}
                initial={isMotionEnabled ? { opacity: 0, y: 8 } : false}
                animate={isMotionEnabled ? { opacity: 1, y: 0 } : undefined}
                exit={isMotionEnabled ? { opacity: 0, y: -8 } : undefined}
                className="font-mono text-[10px] uppercase text-stone"
              >
                {sent ? "route confirmed / email copied" : "click email to send final route"}
              </motion.div>
            </AnimatePresence>

            <div className="grid gap-2 md:justify-items-end">
              <ScrambleExternal
                href="https://github.com/Neel-Kachhadia"
                text="github.com/Neel-Kachhadia"
              />
              <ScrambleExternal
                href="https://linkedin.com/in/neelkachhadia"
                text="linkedin.com/in/neelkachhadia"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCommandPalette}
          className="mt-10 inline-flex w-fit items-center gap-3 border border-ink/15 bg-paper px-5 py-3 font-mono text-xs uppercase text-ink transition-colors hover:border-electric"
        >
          <Terminal className="h-4 w-4 text-electric" aria-hidden="true" />
          open OS control
        </button>
      </div>
    </section>
  );
}
