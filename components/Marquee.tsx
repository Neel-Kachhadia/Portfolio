"use client";

import { useMotionPreference } from "@/components/useMotionPreference";

export default function Marquee() {
  const { isMotionEnabled } = useMotionPreference();
  const content =
    "TELEMETRY · EQUITY RESEARCH PLATFORM · NEUROFIN · MENTORA · LANGGRAPH · FASTAPI · AWS LAMBDA · BEDROCK · REDIS · SYSTEMS THAT REASON · ";

  return (
    <div
      className="w-full overflow-hidden border-y border-ink/10 bg-paper py-3"
      aria-label="Live system telemetry"
    >
      <div
        className="flex whitespace-nowrap font-mono text-[11px] uppercase text-stone"
        style={{
          width: "max-content",
          animation: isMotionEnabled ? "marquee 32s linear infinite" : "none",
        }}
      >
        <span style={{ paddingRight: "4rem" }}>{content}</span>
        <span style={{ paddingRight: "4rem" }}>{content}</span>
      </div>
    </div>
  );
}
