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
    feature: "Context-aware LLM investment recommendations",
    latency: null,
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/equity",
    slug: "equity",
  },
  {
    id: "02",
    name: "NeuroFin — AI Financial Assistant",
    system_type: "Adaptive Forecasting Engine",
    architecture: "Conversational forecasting via LangGraph, behaviour-based recommendation engine",
    stack: "MERN · Python · LangGraph · AWS Lambda · S3",
    feature: "Adaptive feedback loop — self-corrects predictions, reduces drift",
    latency: "< 200ms",
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/neurofin",
    slug: "neurofin",
  },
  {
    id: "03",
    name: "Mentora — AI Mentor-Mentee Platform",
    system_type: "Semantic Matching Engine",
    architecture: "OpenAI embeddings → semantic mentor-mentee matching → Firebase real-time chat",
    stack: "React · Node.js · Express · Firebase · OpenAI API",
    feature: "AI-generated personalised learning paths",
    latency: null,
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/mentora",
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
              className={`group flex w-full flex-col border-b border-ink/10 transition-colors duration-300 ${
                isExpanded ? "bg-paper" : "hover:bg-paper/50"
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
                    <span className="text-xl font-bold tracking-tight text-ink md:text-4xl">
                      {proj.name}
                    </span>
                    {/* Hover underline effect */}
                    <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-ink transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="hidden font-mono text-xs text-stone md:block">
                     {proj.stack.split(" · ").slice(0, 3).join(" · ")}...
                   </div>
                   <ArrowRight className={`h-5 w-5 text-ink transition-all duration-300 ${isExpanded ? "rotate-90" : "group-hover:translate-x-2"}`} />
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
                        
                        <div className="mb-4 grid grid-cols-[120px_1fr] items-start gap-4">
                          <span className="text-stone">SYSTEM TYPE</span>
                          <span className="text-ink">{proj.system_type}</span>
                        </div>
                        
                        <div className="mb-4 grid grid-cols-[120px_1fr] items-start gap-4">
                          <span className="text-stone">ARCHITECTURE</span>
                          <span className="text-ink">{proj.architecture}</span>
                        </div>
                        
                        <div className="mb-4 grid grid-cols-[120px_1fr] items-start gap-4">
                          <span className="text-stone">STACK</span>
                          <span className="text-ink">{proj.stack}</span>
                        </div>
                        
                        {proj.latency && (
                          <div className="mb-4 grid grid-cols-[120px_1fr] items-start gap-4">
                            <span className="text-stone">LATENCY</span>
                            <span className="font-semibold text-ink">{proj.latency}</span>
                          </div>
                        )}
                        
                        <div className="mb-4 grid grid-cols-[120px_1fr] items-start gap-4">
                          <span className="text-stone">FEATURE</span>
                          <span className="text-ink">{proj.feature}</span>
                        </div>
                        
                        <div className="mb-12 grid grid-cols-[120px_1fr] items-start gap-4">
                          <span className="text-stone">STATUS</span>
                          <span className="flex items-center gap-2 text-ink">
                            <div className="h-2 w-2 rounded-full bg-electric" />
                            {proj.status}
                          </span>
                        </div>

                        <a
                          href={`https://${proj.source}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-fit items-center gap-2 border-b border-ink pb-1 font-mono text-[13px] uppercase tracking-wide text-ink transition-colors hover:text-electric hover:border-electric"
                        >
                          [ <ArrowUpRight className="h-3 w-3" /> Source ]
                        </a>
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
    </section>
  );
}

// ----------------------------------------------------------------------
// SVG Diagrams
// ----------------------------------------------------------------------

function EquityDiagram() {
  return (
    <svg viewBox="0 0 400 150" className="w-full max-w-md h-auto font-mono text-[10px]">
      <g stroke="#1A1612" strokeWidth="1" fill="none">
         {/* Base line */}
         <path d="M 50 75 L 350 75" />
         
         {/* Animated dots container - left to right */}
         <circle r="3" fill="#4AFF91" stroke="none">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 50 75 L 350 75" />
         </circle>
         <circle r="3" fill="#4AFF91" stroke="none">
            <animateMotion dur="2.5s" begin="0.8s" repeatCount="indefinite" path="M 50 75 L 350 75" />
         </circle>
         <circle r="3" fill="#4AFF91" stroke="none">
            <animateMotion dur="2.5s" begin="1.6s" repeatCount="indefinite" path="M 50 75 L 350 75" />
         </circle>

         {/* Nodes */}
         <rect x="30" y="60" width="40" height="30" fill="#EDE8DE" />
         <text x="50" y="78" fill="#1A1612" textAnchor="middle" stroke="none">MD</text>
         
         <circle cx="150" cy="75" r="25" fill="#EDE8DE" />
         <text x="150" y="78" fill="#1A1612" textAnchor="middle" stroke="none">LG</text>

         <rect x="230" y="55" width="40" height="40" rx="4" fill="#EDE8DE" />
         <text x="250" y="78" fill="#1A1612" textAnchor="middle" stroke="none">LLM</text>

         <path d="M 350 75 L 340 65 V 85 Z" fill="#1A1612" />
         <text x="350" y="55" fill="#1A1612" textAnchor="middle" stroke="none">Insights</text>
      </g>
    </svg>
  );
}

function NeurofinDiagram() {
  return (
     <svg viewBox="0 0 300 200" className="w-full max-w-sm h-auto font-mono text-[10px]">
      <g stroke="#1A1612" strokeWidth="1" fill="none">
         {/* Loop Path */}
         <path id="loopPath" d="M 150 50 A 50 50 0 1 1 149.9 50" />
         
         {/* Animated orbiting dot */}
         <circle r="4" fill="#4AFF91" stroke="none">
            <animateMotion dur="4s" repeatCount="indefinite" path="M 150 50 A 50 50 0 1 1 149.9 50" />
         </circle>

         {/* Nodes */}
         <circle cx="150" cy="50" r="18" fill="#EDE8DE" />
         <text x="150" y="53" fill="#1A1612" textAnchor="middle" stroke="none">USR</text>
         
         <circle cx="200" cy="100" r="18" fill="#EDE8DE" />
         <text x="200" y="103" fill="#1A1612" textAnchor="middle" stroke="none">MOD</text>

         <circle cx="150" cy="150" r="18" fill="#EDE8DE" />
         <text x="150" y="153" fill="#1A1612" textAnchor="middle" stroke="none">PRD</text>

         <circle cx="100" cy="100" r="18" fill="#EDE8DE" />
         <text x="100" y="103" fill="#1A1612" textAnchor="middle" stroke="none">FBK</text>
      </g>
    </svg>
  );
}

function MentoraDiagram() {
  return (
     <svg viewBox="0 0 400 150" className="w-full max-w-md h-auto font-mono text-[10px]">
      <g stroke="#1A1612" strokeWidth="1" fill="none">
         {/* Connection */}
         <path d="M 100 75 L 300 75" strokeDasharray="4 4">
            <animate attributeName="strokeOpacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
         </path>

         {/* Arrow markers */}
         <path d="M 110 70 L 100 75 L 110 80" />
         <path d="M 290 70 L 300 75 L 290 80" />

         {/* Nodes */}
         <circle cx="70" cy="75" r="30" fill="#EDE8DE" />
         <text x="70" y="78" fill="#1A1612" textAnchor="middle" stroke="none">Mentee</text>
         
         <circle cx="330" cy="75" r="30" fill="#EDE8DE" />
         <text x="330" y="78" fill="#1A1612" textAnchor="middle" stroke="none">Mentor</text>

         {/* Center label */}
         <rect x="170" y="65" width="60" height="20" fill="#F5F0E8" stroke="none" />
         <text x="200" y="78" fill="#4AFF91" stroke="#4AFF91" strokeWidth="0.2" textAnchor="middle">[Embed]</text>
      </g>
    </svg>
  );
}
