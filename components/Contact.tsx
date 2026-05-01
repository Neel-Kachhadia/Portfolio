"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Copy, RadioTower, Terminal } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const email = "neel1234kachhadia@gmail.com";
const scrambleChars = "!<>-_\\/[]{}=+*^?#0123456789";

function ScrambleLink({
  href,
  text,
  copyValue,
}: {
  href: string;
  text: string;
  copyValue?: string;
}) {
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
            if (letter === "/" || letter === "." || letter === "@")
              return letter;
            return scrambleChars[
              Math.floor(Math.random() * scrambleChars.length)
            ];
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

  const handleClick = async () => {
    if (!copyValue) return;

    try {
      await navigator.clipboard.writeText(copyValue);
      toast.success("Email copied", { description: copyValue });
    } catch {
      toast.error("Could not copy email", { description: copyValue });
    }
  };

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      onMouseEnter={scramble}
      onFocus={scramble}
      onClick={handleClick}
      className="group flex w-fit items-center gap-3 py-1 font-mono text-sm text-ink transition-colors hover:text-blueprint md:text-base"
    >
      <span className="border-b border-ink/20 group-hover:border-electric">
        {displayText}
      </span>
      {copyValue ? (
        <Copy
          className="h-3.5 w-3.5 text-stone group-hover:text-electric"
          aria-hidden="true"
        />
      ) : (
        <ArrowUpRight
          className="h-3.5 w-3.5 text-stone group-hover:text-electric"
          aria-hidden="true"
        />
      )}
    </a>
  );
}

export default function Contact() {
  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative w-full overflow-hidden border-t border-ink/10 px-6 pb-24 pt-32 md:px-8 md:pb-32 md:pt-44"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-electric/70" />
      <div className="pointer-events-none absolute -right-10 bottom-4 font-mono text-[8rem] font-black leading-none text-ink/[0.035] md:text-[16rem]">
        END
      </div>

      <div className="mx-auto flex w-full max-w-[1500px] flex-col">
        <span className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
          <RadioTower className="h-4 w-4 text-electric" aria-hidden="true" />
          06 / TRANSMISSION_END
        </span>
        <h2
          id="contact-title"
          className="mb-14 max-w-6xl font-mono text-[3.7rem] font-black uppercase leading-[0.86] text-ink sm:text-[5.4rem] md:text-[7.2rem] lg:text-[9.4rem]"
        >
          SEND THE
          <span className="ml-[14vw] block font-serif font-normal italic text-stone md:ml-32">
            signal.
          </span>
        </h2>

        <div className="mb-20 grid gap-10 border-y border-ink/10 py-8 md:grid-cols-[0.78fr_1.22fr]">
          <p className="max-w-xl font-serif text-3xl italic leading-[1.02] text-stone md:text-4xl">
            Available for AI systems, products, and ideas that should not look
            possible at first glance.
          </p>

          <div className="flex flex-col gap-3 md:justify-self-end md:text-right">
            <ScrambleLink
              href={`mailto:${email}`}
              text={email}
              copyValue={email}
            />
            <ScrambleLink
              href="https://github.com/Neel-Kachhadia"
              text="github.com/Neel-Kachhadia"
            />
            <ScrambleLink
              href="https://linkedin.com/in/neelkachhadia"
              text="linkedin.com/in/neelkachhadia"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={openCommandPalette}
          className="inline-flex w-fit items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase text-cream transition-colors hover:bg-electric hover:text-ink"
        >
          <Terminal className="h-4 w-4" aria-hidden="true" />
          Open OS control
        </button>
      </div>
    </section>
  );
}
