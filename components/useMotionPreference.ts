"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "neel.motion";
const MOTION_EVENT = "neel-motion-change";

function systemPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readMotionEnabled() {
  if (typeof window === "undefined") return true;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "off") return false;
  if (stored === "on") return true;

  return !systemPrefersReducedMotion();
}

function applyMotionPreference(enabled: boolean) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.motion = enabled ? "on" : "off";
  document.documentElement.classList.toggle("motion-reduced", !enabled);
}

export function setMotionPreference(enabled: boolean) {
  if (typeof window === "undefined") return enabled;

  window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  applyMotionPreference(enabled);
  window.dispatchEvent(
    new CustomEvent(MOTION_EVENT, { detail: { enabled } }),
  );

  return enabled;
}

export function useMotionPreference() {
  const [isMotionEnabled, setIsMotionEnabled] = useState(true);

  useEffect(() => {
    const syncPreference = () => {
      const enabled = readMotionEnabled();
      applyMotionPreference(enabled);
      setIsMotionEnabled(enabled);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleCustomEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ enabled?: boolean }>).detail;
      setIsMotionEnabled(detail?.enabled ?? readMotionEnabled());
    };

    syncPreference();
    motionQuery.addEventListener("change", syncPreference);
    window.addEventListener("storage", syncPreference);
    window.addEventListener(MOTION_EVENT, handleCustomEvent);

    return () => {
      motionQuery.removeEventListener("change", syncPreference);
      window.removeEventListener("storage", syncPreference);
      window.removeEventListener(MOTION_EVENT, handleCustomEvent);
    };
  }, []);

  const toggleMotion = useCallback(() => {
    const next = !readMotionEnabled();
    setIsMotionEnabled(setMotionPreference(next));
    return next;
  }, []);

  return { isMotionEnabled, toggleMotion };
}
