"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionPreference } from "@/components/useMotionPreference";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    if (!isMotionEnabled) return;

    const lenis = new Lenis({
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frameId = 0;

    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [isMotionEnabled]);

  return <>{children}</>;
}
