"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const timelineEvents = [
  { date: "Aug 2024", text: "Enrolled DJSCE · B.Tech E&TC · Honours VLSI" },
  { date: "Oct 2024", text: "Mumbai Hacks — full-stack AI in 24hrs" },
  { date: "Nov 2024", text: "Built Equity Research Platform" },
  { date: "Feb 2025", text: "Google Hack2Skill — LLM integration" },
  { date: "Mar 2025", text: "NeuroFin deployed · sub-200ms Lambda" },
  { date: "Jun 2025", text: "Mentora — semantic embedding matching" },
  { date: "2026+", text: "Scaling distributed AI architectures" },
];

const skills = [
  { domain: "AI / LLM Systems", tools: "LangGraph · OpenAI API · LangChain" },
  { domain: "Backend", tools: "FastAPI · Node.js · Express" },
  { domain: "Frontend", tools: "React · Tailwind · Framer Motion" },
  { domain: "Cloud", tools: "AWS EC2 · Lambda · S3 · Firebase · GCP" },
  { domain: "Languages", tools: "Python · TypeScript · JavaScript · C++" },
  { domain: "Data", tools: "Pandas · NumPy" },
];

export default function About() {
  const lineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the timeline is scrolled
      // Start drawing when top of container hits middle of screen
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.2;
      
      const rawProgress = (start - rect.top) / (start - end + rect.height);
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
      
      setScrollProgress(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about" className="w-full px-6 py-32 md:py-48" ref={containerRef}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full">
        
        {/* Left Column: Timeline */}
        <div className="w-full relative mb-24 md:mb-0 md:w-[45%] font-mono text-sm leading-relaxed">
           <div className="absolute left-[11px] top-4 bottom-4 w-px z-[-1]">
             {/* Using SVG for the animated stroke */}
             <svg className="w-2 h-full overflow-visible" preserveAspectRatio="none">
                <path 
                  ref={lineRef}
                  d={`M 1 0 V ${timelineEvents.length * 80 + 20}`}
                  stroke="#4AFF91" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="1"
                  strokeDashoffset={1 - scrollProgress}
                  pathLength="1"
                />
                
                {/* Background path that is always visible but faint */}
                <path 
                  d={`M 1 0 V ${timelineEvents.length * 80 + 20}`}
                  stroke="rgba(26,22,18,0.1)" 
                  strokeWidth="1" 
                  fill="none" 
                />
             </svg>
           </div>
           
           <div className="flex flex-col gap-12">
             {timelineEvents.map((ev, i) => (
                <div key={i} className="flex items-start gap-6 relative">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cream border border-ink/20 flex flex-col items-center justify-center relative z-10 mt-[-2px]">
                      {/* Active dot */}
                      <div 
                        className="w-2 h-2 rounded-full bg-electric transition-opacity duration-300" 
                        style={{ opacity: scrollProgress > (i / timelineEvents.length) ? 1 : 0 }} 
                      />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-stone font-semibold">{ev.date}</span>
                      <span className="text-ink">{ev.text}</span>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Right Column: Skills */}
        <div className="w-full md:w-[50%] flex flex-col font-mono text-xs md:text-sm">
           <div className="pb-4 mb-4 border-b border-ink flex">
              <span className="w-[180px] text-stone">DOMAIN</span>
              <span className="text-stone">TOOLS</span>
           </div>

           <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             variants={{
               visible: {
                 transition: { staggerChildren: 0.06 }
               }
             }}
           >
             {skills.map((skill, i) => (
               <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex py-3 border-b border-ink/5"
               >
                  <span className="w-[180px] text-ink font-semibold flex-shrink-0">{skill.domain}</span>
                  <span className="text-ink-light">{skill.tools}</span>
               </motion.div>
             ))}
           </motion.div>

           <div className="mt-16">
              <p className="font-serif italic text-2xl text-stone">
                 &quot;Building systems that reason, adapt, and scale — from Mumbai.&quot;
              </p>
           </div>
        </div>

      </div>
    </section>
  );
}
