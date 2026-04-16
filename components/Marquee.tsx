"use client";

export default function Marquee() {
  const content =
    "EQUITY RESEARCH PLATFORM · NEUROFIN · MENTORA · LANGRAPH · FASTAPI · AWS LAMBDA · MUMBAI HACKS · GOOGLE HACK2SKILL · ";

  return (
    <div className="flex w-full overflow-hidden bg-paper py-3 border-y border-ink/5">
      <div
        className="flex whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-stone"
        style={{ animation: "marquee 25s linear infinite" }}
      >
        <span className="pr-4">{content}</span>
        <span className="pr-4">{content}</span>
      </div>
    </div>
  );
}