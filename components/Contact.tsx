"use client";

import { useState } from "react";

const ScrambleLink = ({ href, text }: { href: string; text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const handleMouseEnter = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iterations = 0;
    const chars = "!<>-_\\\\/[]{}—=+*^?#_";
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
             // Let the original text resolve completely across the duration
             if (index < iterations) {
               return text[index];
             }
             return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
        setDisplayText(text); // Ensure final exact match just in case
        setIsScrambling(false);
      }

      iterations += 1/2; // Adjust for speed
    }, 30);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={handleMouseEnter}
      className="w-fit text-sm font-mono text-ink transition-colors hover:text-electric hover:bg-ink px-1 -ml-1 md:text-base"
    >
      {displayText}
    </a>
  );
};

export default function Contact() {
  return (
    <section id="contact" className="w-full px-6 pb-24 pt-32 md:pb-32 md:pt-48 border-t border-ink/10">
      <div className="flex flex-col">
        <h2 
           className="leading-[0.85] tracking-tighter text-ink font-black mb-16" 
           style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
        >
          LET&apos;S BUILD <br />
          SOMETHING.
        </h2>

        <div className="flex flex-col gap-4 mb-24">
          <ScrambleLink href="mailto:neel1234kachhadia@gmail.com" text="neel1234kachhadia@gmail.com" />
          <ScrambleLink href="https://github.com/Neel-Kachhadia" text="github.com/Neel-Kachhadia" />
          <ScrambleLink href="https://linkedin.com/in/neelkachhadia" text="linkedin.com/in/neelkachhadia" />
        </div>

        <div>
          <p className="font-serif italic text-xl md:text-2xl text-stone">
            &quot;Open to AI engineering internships and collaboration — Mumbai, 2026.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
