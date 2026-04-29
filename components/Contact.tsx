"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Copy } from "lucide-react";
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
        <Copy className="h-3.5 w-3.5 text-stone group-hover:text-electric" aria-hidden="true" />
      ) : (
        <ArrowUpRight className="h-3.5 w-3.5 text-stone group-hover:text-electric" aria-hidden="true" />
      )}
    </a>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="w-full border-t border-ink/10 px-6 pb-24 pt-32 md:pb-32 md:pt-44"
    >
      <div className="flex flex-col">
        <span className="mb-6 font-mono text-[11px] uppercase text-stone">
          CONTACT / FINAL TRANSMISSION
        </span>
        <h2
          id="contact-title"
          className="mb-14 max-w-6xl font-mono text-[3.7rem] font-black leading-[0.9] text-ink sm:text-[5.2rem] md:text-[7rem] lg:text-[8.5rem]"
        >
          LET&apos;S BUILD SOMETHING UNREASONABLE.
        </h2>

        <div className="mb-20 flex flex-col gap-3">
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

        <p className="max-w-3xl font-serif text-2xl italic leading-tight text-stone md:text-3xl">
          Available for systems, products, and ideas that should not look possible.
        </p>
      </div>
    </section>
  );
}
