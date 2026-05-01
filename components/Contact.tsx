"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { toast } from "sonner";
import { useMotionPreference } from "@/components/useMotionPreference";

const email = "neel1234kachhadia@gmail.com";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const statusRefs = useRef<HTMLDivElement[]>([]);
  const { isMotionEnabled } = useMotionPreference();

  const transmitEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied", { description: email });
    } catch {
      toast.error("Clipboard blocked", { description: email });
    }

    setTransmitting(true);
    setSent(false);

    if (pathRef.current && isMotionEnabled) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      gsap.killTweensOf([path, flashRef.current, statusRefs.current]);
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
      gsap.set(statusRefs.current, { opacity: 0, y: 16 });

      gsap
        .timeline({
          onComplete: () => {
            setTransmitting(false);
            setSent(true);
          },
        })
        .to(path, { strokeDashoffset: 0, duration: 1.05, ease: "power3.inOut" })
        .fromTo(
          flashRef.current,
          { opacity: 0 },
          { opacity: 0.22, duration: 0.08, yoyo: true, repeat: 3 },
          0.72,
        )
        .to(statusRefs.current, { opacity: 1, y: 0, duration: 0.42, stagger: 0.08 }, 0.92)
        .to(path, { opacity: 0.34, duration: 0.5 }, 1.25);
    } else {
      setTransmitting(false);
      setSent(true);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative min-h-[100svh] w-full overflow-hidden border-t border-ink/10 px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-40"
    >
      <div ref={flashRef} className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
      <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
        <path
          ref={pathRef}
          d="M 80 690 C 220 506 350 576 494 410 S 740 176 930 306 S 1130 550 1290 378 S 1410 178 1530 124"
          fill="none"
          stroke="#4AFF91"
          strokeWidth="2.4"
          strokeLinecap="square"
          opacity="0"
        />
      </svg>

      <div className="mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-[1500px] flex-col justify-between">
        <div>
          <span className="mb-7 block font-mono text-[11px] uppercase text-stone">
            final transmission
          </span>
          <h2
            id="contact-title"
            className="max-w-7xl font-mono text-[3.6rem] font-black uppercase leading-[0.8] text-ink sm:text-[5.7rem] md:text-[9rem] lg:text-[11.4rem]"
          >
            SEND
            <span className="ml-[13vw] block font-serif font-normal italic text-stone md:ml-40">
              signal
            </span>
            BACK.
          </h2>
        </div>

        <div className="mt-16 grid gap-10 border-y border-ink/10 py-8 md:grid-cols-[0.82fr_1.18fr] md:items-end">
          <p className="max-w-2xl font-serif text-3xl italic leading-[1.02] text-stone md:text-5xl">
            For AI systems, finance products, and interfaces that need proof,
            taste, and a little physical impossibility.
          </p>

          <div className="grid gap-6 md:justify-self-end md:text-right">
            <button
              type="button"
              onClick={transmitEmail}
              className="group inline-flex w-fit items-center gap-3 justify-self-start border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink md:justify-self-end"
            >
              {sent ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : transmitting ? (
                <Send className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {transmitting ? "Routing signal" : email}
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={sent ? "sent" : transmitting ? "transmitting" : "idle"}
                initial={isMotionEnabled ? { opacity: 0, y: 10 } : false}
                animate={isMotionEnabled ? { opacity: 1, y: 0 } : undefined}
                exit={isMotionEnabled ? { opacity: 0, y: -10 } : undefined}
                className="grid gap-2 font-mono text-[10px] uppercase text-stone"
              >
                {sent ? (
                  <>
                    {["SIGNAL SENT", "NEEL.OS / ONLINE", "RESPONSE CHANNEL OPEN"].map(
                      (line, index) => (
                        <div
                          key={line}
                          ref={(node) => {
                            if (node) statusRefs.current[index] = node;
                          }}
                          className={index === 0 ? "text-ink" : ""}
                        >
                          {line}
                        </div>
                      ),
                    )}
                  </>
                ) : transmitting ? (
                  <div>signal crossing machine bed</div>
                ) : (
                  <div>click email / copy channel</div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="grid gap-2 md:justify-items-end">
              <a
                href="https://github.com/Neel-Kachhadia"
                target="_blank"
                rel="noreferrer"
                className="group flex w-fit items-center gap-3 py-1 font-mono text-sm text-ink transition-colors hover:text-blueprint md:text-base"
              >
                github.com/Neel-Kachhadia
                <ArrowUpRight className="h-3.5 w-3.5 text-stone group-hover:text-electric" />
              </a>
              <a
                href="https://linkedin.com/in/neelkachhadia"
                target="_blank"
                rel="noreferrer"
                className="group flex w-fit items-center gap-3 py-1 font-mono text-sm text-ink transition-colors hover:text-blueprint md:text-base"
              >
                linkedin.com/in/neelkachhadia
                <ArrowUpRight className="h-3.5 w-3.5 text-stone group-hover:text-electric" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
