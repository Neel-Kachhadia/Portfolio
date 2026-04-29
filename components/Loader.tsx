"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import { useMotionPreference } from "@/components/useMotionPreference";

const targetText = "SYSTEM_INIT // NEEL.OS // MUMBAI // AI_SYSTEMS // 2026";
const chars = "!<>-_\\/[]{}=+*^?#0123456789";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = isMotionEnabled ? 2.25 : 0.35;
    const state = { value: 0 };
    let iterations = 0;

    intervalRef.current = window.setInterval(() => {
      setText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iterations) return targetText[index];
            if (letter === " " || letter === "/" || letter === ".") return letter;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );

      if (iterations >= targetText.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = null;
        setText(targetText);
      }

      iterations += isMotionEnabled ? 0.55 : 8;
    }, isMotionEnabled ? 28 : 10);

    tweenRef.current = gsap.to(state, {
      value: 100,
      duration,
      ease: "power3.out",
      onUpdate: () => setProgress(Math.round(state.value)),
      onComplete: () => setIsVisible(false),
    });

    return () => {
      tweenRef.current?.kill();
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isVisible, isMotionEnabled]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Booting NEEL OS"
          exit={{ opacity: 0 }}
          transition={{ duration: isMotionEnabled ? 0.16 : 0 }}
          onClick={() => setIsVisible(false)}
          className="fixed inset-0 z-[10000] flex cursor-pointer flex-col justify-between bg-ink p-6 font-mono text-cream"
        >
          <div className="flex w-full items-center gap-4">
            <span className="text-4xl leading-none">
              {progress.toString().padStart(3, "0")}
            </span>
            <div className="relative h-px w-full max-w-[240px] bg-cream/20">
              <div
                className="absolute left-0 top-0 h-full bg-electric"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="self-end text-right text-sm md:text-base">
            <span className="text-electric">{"// SYSTEM_INIT"}</span>
            <br />
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
