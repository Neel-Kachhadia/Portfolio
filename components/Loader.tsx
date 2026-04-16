"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const targetText = "NEEL_KACHHADIA · MUMBAI · AI_SYSTEMS";

  useEffect(() => {
    // Prevent scrolling while loader is active
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start: number;

    // Scramble Text
    let iterations = 0;
    const chars = "!<>-_\\\\/[]{}—=+*^?#_";
    const textInterval = setInterval(() => {
      setText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= targetText.length) {
        clearInterval(textInterval);
      }

      iterations += 1 / 3;
    }, 40);

    // Progress counter
    const animateParams = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsedTime = timestamp - start;
      const duration = 2500; // 2.5s duration
      const progressValue = Math.min((elapsedTime / duration) * 100, 100);

      setProgress(Math.floor(progressValue));

      if (progressValue < 100) {
        requestAnimationFrame(animateParams);
      } else {
        setIsVisible(false);
      }
    };

    requestAnimationFrame(animateParams);

    return () => {
      clearInterval(textInterval);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          // Hard cut at 100, no fade
          exit={{ display: "none" }}
          onClick={() => setIsVisible(false)}
          className="fixed inset-0 z-[10000] flex cursor-pointer flex-col justify-between bg-ink p-6 font-mono text-cream"
        >
          {/* Top Left: Counter */}
          <div className="flex w-full items-center gap-4">
            <span className="text-4xl leading-none">
              {progress.toString().padStart(3, "0")}
            </span>
            <div className="relative h-[2px] w-full max-w-[200px] bg-ink-light">
              <div
                className="absolute left-0 top-0 h-full bg-cream transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Right: Scramble Text */}
          <div className="self-end text-sm md:text-base">
            <span className="opacity-50">{"// SYSTEM_INIT"}</span> <br />
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
