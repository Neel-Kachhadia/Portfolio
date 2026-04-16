"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "01",
    name: "Equity Research Platform",
    system_type: "Stateful Agentic Pipeline",
    architecture: "Live market data → LangGraph multi-step reasoning → FastAPI stateless pipeline → React dashboard",
    stack: "React · FastAPI · LangGraph · Python · Tailwind · AWS EC2/S3",
    feature: "Context-aware LLM investment recommendations · high-throughput stateless pipeline",
    latency: null,
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/Equity-Research-Platform",
    slug: "equity",
  },
  {
    id: "02",
    name: "NeuroFin — AI Financial Assistant",
    system_type: "12-Agent Ensemble Financial Intelligence Platform",
    architecture: "12 specialist Python microservices → Amazon Nova via Bedrock → explainable personalized recommendations",
    stack: "React · MERN · Python · LangGraph · Amazon Bedrock · EC2 · DocumentDB · Redis · S3 · SNS",
    feature: "Proactive financial intelligence — anomaly detection (Isolation Forest, 3000+ tx), 30-day cash flow forecasting, tax optimization, Family Hub",
    latency: "Redis-cached pipeline · parallel agent execution · deterministic routing (zero LLM overhead)",
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/NeuroFin",
    slug: "neurofin",
  },
  {
    id: "03",
    name: "Mentora — AI Mentor-Mentee Platform",
    system_type: "Semantic Matching Engine",
    architecture: "OpenAI embeddings → semantic mentor-mentee matching → Firebase real-time chat",
    stack: "React · Node.js · Express · Firebase · OpenAI API",
    feature: "LLM-generated personalised learning paths · embedding-based compatibility matching",
    latency: null,
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/Mentore-Mentee-Platform",
    slug: "mentora",
  },
];

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="work" className="w-full px-6 py-32 md:py-48">
      <div className="mb-16 flex items-start">
        <h2 className="text-6xl font-black tracking-tighter text-ink md:text-8xl">
          WORK
        </h2>
        <span className="mt-2 text-sm font-semibold text-stone md:mt-4 md:text-base">
          (03)
        </span>
      </div>

      <div className="flex w-full flex-col border-t border-ink/10">
        {projects.map((proj) => {
          const isExpanded = expandedId === proj.id;

          return (
            <div
              id={`project-${proj.slug}`}
              key={proj.id}
              className={`group flex w-full flex-col border-b border-ink/10 transition-colors duration-300 ${isExpanded ? "bg-paper" : "hover:bg-paper/50"
                }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleExpand(proj.id)}
                className="flex w-full items-center justify-between px-2 py-6 text-left md:px-4 md:py-8"
              >
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="font-mono text-xs text-stone md:text-sm">
                    {proj.id}
                  </span>
                  <div className="relative">
                    <span
                      className="text-xl font-black tracking-tighter text-ink md:text-4xl"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                    >
                      {proj.name}
                    </span>
                    <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-ink transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden font-mono text-xs text-stone md:block">
                    {proj.stack.split(" · ").slice(0, 3).join(" · ")}...
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 text-ink transition-all duration-300 ${isExpanded ? "rotate-90" : "group-hover:translate-x-2"
                      }`}
                  />
                </div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-12 px-2 pb-12 pt-4 md:flex-row md:px-4 md:pt-8 md:pb-16">

                      {/* Left: System Spec */}
                      <div className="flex w-full flex-col font-mono text-xs md:w-[45%] md:text-sm">

                        <div className="mb-4 grid grid-cols-[130px_1fr] items-start gap-4">
                          <span className="text-stone flex-shrink-0">SYSTEM TYPE</span>
                          <span className="text-ink">{proj.system_type}</span>
                        </div>

                        <div className="mb-4 grid grid-cols-[130px_1fr] items-start gap-4">
                          <span className="text-stone flex-shrink-0">ARCHITECTURE</span>
                          <span className="text-ink">{proj.architecture}</span>
                        </div>

                        <div className="mb-4 grid grid-cols-[130px_1fr] items-start gap-4">
                          <span className="text-stone flex-shrink-0">STACK</span>
                          <span className="text-ink break-words">{proj.stack}</span>
                        </div>

                        {proj.latency && (
                          <div className="mb-4 grid grid-cols-[130px_1fr] items-start gap-4">
                            <span className="text-stone flex-shrink-0">PERFORMANCE</span>
                            <span className="text-ink">{proj.latency}</span>
                          </div>
                        )}

                        <div className="mb-4 grid grid-cols-[130px_1fr] items-start gap-4">
                          <span className="text-stone flex-shrink-0">FEATURE</span>
                          <span className="text-ink">{proj.feature}</span>
                        </div>

                        <div className="mb-12 grid grid-cols-[130px_1fr] items-start gap-4">
                          <span className="text-stone flex-shrink-0">STATUS</span>
                          <span className="flex items-center gap-2 text-ink">
                            <div className="h-2 w-2 rounded-full bg-electric animate-pulse" />
                            {proj.status}
                          </span>
                        </div>

                        <a href={`https://${proj.source}`} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 border-b border-ink pb-1 font-mono text-[13px] uppercase tracking-wide text-ink transition-colors hover:text-electric hover:border-electric">[ <ArrowUpRight className="h-3 w-3" /> Source ]</a>
                      </div>

                      {/* Right: SVG Diagram */}
                      <div className="flex w-full items-center justify-center border border-ink/5 bg-cream/30 p-8 md:w-[55%] min-h-[300px]">
                        {proj.slug === "equity" && <EquityDiagram />}
                        {proj.slug === "neurofin" && <NeurofinDiagram />}
                        {proj.slug === "mentora" && <MentoraDiagram />}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section >
  );
}

// SVG Diagrams

function EquityDiagram() {
  return (
    <svg viewBox="0 0 420 160" className="w-full max-w-md h-auto font-mono text-[10px]">
      <defs>
        <marker id="arrow-eq" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#1A1612" fillOpacity="0.4" />
        </marker>
      </defs>
      <g fill="none">
        {/* Connecting lines */}
        <line x1="85" y1="80" x2="118" y2="80" stroke="#4AFF91" strokeOpacity="0.4" strokeWidth="1" markerEnd="url(#arrow-eq)" />
        <line x1="195" y1="80" x2="228" y2="80" stroke="#4AFF91" strokeOpacity="0.4" strokeWidth="1" markerEnd="url(#arrow-eq)" />
        <line x1="305" y1="80" x2="338" y2="80" stroke="#4AFF91" strokeOpacity="0.4" strokeWidth="1" markerEnd="url(#arrow-eq)" />

        {/* Traveling dots */}
        <circle r="3" fill="#4AFF91">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 45 80 L 375 80" />
        </circle>
        <circle r="3" fill="#4AFF91">
          <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M 45 80 L 375 80" />
        </circle>
        <circle r="3" fill="#4AFF91">
          <animateMotion dur="3s" begin="2s" repeatCount="indefinite" path="M 45 80 L 375 80" />
        </circle>

        {/* Node 1 */}
        <rect x="5" y="60" width="80" height="40" rx="4" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="45" y="76" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">Market</text>
        <text x="45" y="88" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">Data</text>

        {/* Node 2 */}
        <rect x="118" y="60" width="80" height="40" rx="4" fill="#EDE8DE" stroke="#4AFF91" strokeOpacity="0.4" strokeWidth="0.8" />
        <text x="158" y="76" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">LangGraph</text>
        <text x="158" y="88" fill="#8C8480" textAnchor="middle" fontSize="8" fontFamily="monospace">reasoning</text>

        {/* Node 3 */}
        <rect x="228" y="60" width="80" height="40" rx="4" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="268" y="76" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">FastAPI</text>
        <text x="268" y="88" fill="#8C8480" textAnchor="middle" fontSize="8" fontFamily="monospace">pipeline</text>

        {/* Node 4 */}
        <rect x="338" y="60" width="75" height="40" rx="4" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="375" y="76" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">React</text>
        <text x="375" y="88" fill="#8C8480" textAnchor="middle" fontSize="8" fontFamily="monospace">dashboard</text>
      </g>
    </svg>
  );
}

function NeurofinDiagram() {
  return (
    <svg viewBox="0 0 380 280" className="w-full max-w-md h-auto font-mono text-[10px]">
      <g fill="none">
        {/* Outer ring connections */}
        <circle cx="190" cy="140" r="90" stroke="#4AFF91" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 3" />

        {/* Connection lines between agents */}
        <line x1="190" y1="55" x2="275" y2="108" stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="275" y1="108" x2="275" y2="172" stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="275" y1="172" x2="190" y2="225" stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="190" y1="225" x2="105" y2="172" stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="105" y1="172" x2="105" y2="108" stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8" />
        <line x1="105" y1="108" x2="190" y2="55" stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8" />

        {/* Center node — Amazon Nova */}
        <circle cx="190" cy="140" r="28" fill="#EDE8DE" stroke="#4AFF91" strokeOpacity="0.5" strokeWidth="1" />
        <text x="190" y="136" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">Amazon</text>
        <text x="190" y="147" fill="#4AFF91" textAnchor="middle" fontSize="8" fontFamily="monospace">Nova</text>

        {/* Orbiting dot */}
        <circle r="3.5" fill="#4AFF91">
          <animateMotion dur="5s" repeatCount="indefinite"
            path="M 190 50 C 280 50 330 140 280 220 C 230 300 150 300 100 220 C 50 140 100 50 190 50" />
        </circle>
        <circle r="3.5" fill="#4AFF91" opacity="0.5">
          <animateMotion dur="5s" begin="2.5s" repeatCount="indefinite"
            path="M 190 50 C 280 50 330 140 280 220 C 230 300 150 300 100 220 C 50 140 100 50 190 50" />
        </circle>

        {/* Agent nodes */}
        {/* Top */}
        <rect x="152" y="30" width="76" height="28" rx="3" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="190" y="42" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">analyst</text>
        <text x="190" y="52" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">800+ tx</text>

        {/* Top right */}
        <rect x="252" y="90" width="76" height="28" rx="3" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="290" y="102" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">forecast</text>
        <text x="290" y="112" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">30-day</text>

        {/* Bottom right */}
        <rect x="252" y="158" width="76" height="28" rx="3" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="290" y="170" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">risk</text>
        <text x="290" y="180" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">0-100 score</text>

        {/* Bottom */}
        <rect x="152" y="218" width="76" height="28" rx="3" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="190" y="230" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">advisor</text>
        <text x="190" y="240" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">personalized</text>

        {/* Bottom left */}
        <rect x="52" y="158" width="76" height="28" rx="3" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="90" y="170" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">savings</text>
        <text x="90" y="180" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">health score</text>

        {/* Top left */}
        <rect x="52" y="90" width="76" height="28" rx="3" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="90" y="102" fill="#1A1612" textAnchor="middle" fontSize="8" fontFamily="monospace">classifier</text>
        <text x="90" y="112" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">tx tagging</text>
      </g>
    </svg>
  );
}

function MentoraDiagram() {
  return (
    <svg viewBox="0 0 400 160" className="w-full max-w-md h-auto font-mono text-[10px]">
      <g fill="none">
        {/* Pulsing connection line */}
        <line x1="105" y1="80" x2="295" y2="80" stroke="#4AFF91" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="strokeOpacity" values="0.15;0.6;0.15" dur="2.5s" repeatCount="indefinite" />
        </line>

        {/* Traveling dot */}
        <circle r="3" fill="#4AFF91">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 105 80 L 295 80" />
        </circle>
        <circle r="3" fill="#4AFF91" opacity="0.5">
          <animateMotion dur="2.5s" begin="1.25s" repeatCount="indefinite" path="M 295 80 L 105 80" />
        </circle>

        {/* Arrow markers */}
        <path d="M 115 73 L 105 80 L 115 87" stroke="#4AFF91" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M 285 73 L 295 80 L 285 87" stroke="#4AFF91" strokeOpacity="0.5" strokeWidth="1" />

        {/* Mentee node */}
        <circle cx="70" cy="80" r="34" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="70" y="76" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">Mentee</text>
        <text x="70" y="88" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">goals + level</text>

        {/* Mentor node */}
        <circle cx="330" cy="80" r="34" fill="#EDE8DE" stroke="#1A1612" strokeOpacity="0.2" strokeWidth="0.8" />
        <text x="330" y="76" fill="#1A1612" textAnchor="middle" fontSize="9" fontFamily="monospace">Mentor</text>
        <text x="330" y="88" fill="#8C8480" textAnchor="middle" fontSize="7" fontFamily="monospace">skills + exp</text>

        {/* Center embedding label */}
        <rect x="158" y="62" width="84" height="36" rx="3" fill="#F5F0E8" stroke="#4AFF91" strokeOpacity="0.3" strokeWidth="0.8" />
        <text x="200" y="76" fill="#4AFF91" textAnchor="middle" fontSize="8" fontFamily="monospace">OpenAI</text>
        <text x="200" y="88" fill="#4AFF91" textAnchor="middle" fontSize="8" fontFamily="monospace">embeddings</text>
      </g>
    </svg>
  );
}