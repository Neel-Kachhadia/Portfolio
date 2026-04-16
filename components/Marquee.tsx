"use client";

export default function Marquee() {
  const content =
    "EQUITY RESEARCH PLATFORM · NEUROFIN · MENTORA · LANGRAPH · FASTAPI · AWS LAMBDA · MUMBAI HACKS · GOOGLE HACK2SKILL · ";

  return (
    <div className="flex w-full overflow-hidden bg-paper py-3 border-y border-ink/5">
      <div className="flex w-fit animate-marquee whitespace-nowrap font-mono text-[11px] uppercase tracking-wider text-stone">
        {/* Repeat content enough times to ensure it covers the screen width to loop seamlessly */}
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
}
