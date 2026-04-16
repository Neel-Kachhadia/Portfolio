"use client";

export default function Marquee() {
  const content =
    "EQUITY RESEARCH PLATFORM · NEUROFIN · MENTORA · LANGRAPH · FASTAPI · AWS LAMBDA · MUMBAI HACKS · GOOGLE HACK2SKILL · ";

  return (
    <div className="w-full overflow-hidden bg-paper py-3 border-y border-ink/5">
      <div
        className="flex whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-stone"
        style={{
          width: "max-content",
          animation: "marquee 30s linear infinite",
        }}
      >
        <span style={{ paddingRight: "4rem" }}>{content}</span>
        <span style={{ paddingRight: "4rem" }}>{content}</span>
      </div>
    </div>
  );
}