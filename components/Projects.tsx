"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  FolderOpen,
  LockKeyhole,
} from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

type Project = {
  id: string;
  slug: string;
  name: string;
  short: string;
  systemType: string;
  role: string;
  architecture: string;
  impact: string;
  stack: string[];
  year: string;
  status: string;
  source: string;
  accent: string;
};

const projects: Project[] = [
  {
    id: "01",
    slug: "equity",
    name: "Equity Research Platform",
    short: "Market reasoning routes with ranked outputs.",
    systemType: "Stateful agentic research pipeline",
    role: "Full-stack AI systems engineer",
    architecture:
      "Market data intake -> LangGraph research loop -> FastAPI boundary -> React decision surface",
    impact:
      "Turns noisy market context into explainable investment recommendations through a scalable research flow.",
    stack: ["React", "FastAPI", "LangGraph", "Python", "Tailwind", "AWS EC2", "S3"],
    year: "2024-2026",
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/Equity-Research-Platform",
    accent: "#4AFF91",
  },
  {
    id: "02",
    slug: "neurofin",
    name: "NeuroFin",
    short: "Finance OS with agents, memory, forecasting.",
    systemType: "12-agent financial intelligence operating layer",
    role: "Architecture, agent design, backend systems, product interface",
    architecture:
      "Deterministic router -> specialist Python agents -> Redis memory -> Amazon Nova via Bedrock -> finance actions",
    impact:
      "Scores risk, forecasts cash flow, detects anomalies across 3000+ transactions, and converts bank data into decisions.",
    stack: [
      "React",
      "MERN",
      "Python",
      "LangGraph",
      "Bedrock",
      "DocumentDB",
      "Redis",
      "S3",
      "SNS",
    ],
    year: "2025-2026",
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/NeuroFin",
    accent: "#2E5E4E",
  },
  {
    id: "03",
    slug: "mentora",
    name: "Mentora",
    short: "Semantic human matching with warmer logic.",
    systemType: "Semantic mentor-mentee matching engine",
    role: "Full-stack engineer, AI matching layer, realtime product flow",
    architecture:
      "OpenAI embeddings -> compatibility scoring -> Firebase realtime chat -> personalized learning paths",
    impact:
      "Moves matching away from browsing and toward intent, goals, level, and semantic compatibility.",
    stack: ["React", "Node.js", "Express", "Firebase", "OpenAI API"],
    year: "2025-2026",
    status: "DEPLOYED",
    source: "github.com/Neel-Kachhadia/Mentore-Mentee-Platform",
    accent: "#B65B3A",
  },
  {
    id: "04",
    slug: "lab",
    name: "NEEL.OS Lab",
    short: "R&D surface for this portfolio system.",
    systemType: "Interactive portfolio operating layer",
    role: "Creative engineering, motion systems, systems storytelling",
    architecture:
      "GSAP scene control -> Motion interface state -> R3F reasoning field -> Next.js deployable shell",
    impact:
      "Reframes a portfolio as a working archive where interactions prove taste, code, and systems thinking at once.",
    stack: ["Next.js", "TypeScript", "GSAP", "Motion", "React Three Fiber", "Three.js"],
    year: "2026",
    status: "LIVE EXPERIMENT",
    source: "github.com/Neel-Kachhadia",
    accent: "#1A1612",
  },
];

const rows: Array<[string, keyof Project]> = [
  ["ROLE", "role"],
  ["TYPE", "systemType"],
  ["ARCH", "architecture"],
  ["IMPACT", "impact"],
];

export default function Projects() {
  const [expandedId, setExpandedId] = useState("02");
  const panelRef = useRef<HTMLDivElement>(null);
  const { isMotionEnabled } = useMotionPreference();
  const activeProject =
    projects.find((project) => project.id === expandedId) ?? projects[1];

  useEffect(() => {
    const handleOpenProject = (event: Event) => {
      const slug = (event as CustomEvent<{ slug?: string }>).detail?.slug;
      const project = projects.find((item) => item.slug === slug);
      if (project) setExpandedId(project.id);
    };

    window.addEventListener("open-project", handleOpenProject);
    return () => window.removeEventListener("open-project", handleOpenProject);
  }, []);

  useEffect(() => {
    if (!panelRef.current || !isMotionEnabled) return;

    const paths = Array.from(
      panelRef.current.querySelectorAll<SVGPathElement>(".blueprint-path"),
    );
    const rowsToReveal = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(".dossier-row"),
    );

    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(rowsToReveal, { opacity: 0, y: 12 });
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.07 }, 0)
      .to(rowsToReveal, { opacity: 1, y: 0, duration: 0.42, stagger: 0.045 }, 0.08);
  }, [expandedId, isMotionEnabled]);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative w-full overflow-hidden px-5 py-28 md:px-8 md:py-44"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-ink/10" />
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-14 grid gap-9 md:grid-cols-[0.84fr_1.16fr] md:items-end">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
              <LockKeyhole className="h-4 w-4 text-electric" aria-hidden="true" />
              active_systems / dossier archive
            </span>
            <h2
              id="work-title"
              className="mt-5 font-mono text-[3.8rem] font-black uppercase leading-[0.78] text-ink sm:text-[5.8rem] md:text-[9rem]"
            >
              CASE
              <span className="ml-[18vw] block font-serif font-normal italic text-stone md:ml-32">
                files
              </span>
            </h2>
          </div>
          <p className="max-w-3xl font-serif text-3xl italic leading-[1.02] text-stone md:justify-self-end md:text-5xl">
            Opening a project should feel like pulling a drawer from the archive
            and watching the blueprint spread across the table.
          </p>
        </div>

        <div
          className="mb-5 grid gap-4 border-y border-ink/10 py-4 font-mono text-[10px] uppercase text-stone md:grid-cols-[8rem_1fr_13rem_10rem]"
          style={{ borderColor: `${activeProject.accent}44` }}
        >
          <span>active file</span>
          <span className="text-ink">{activeProject.name}</span>
          <span>{activeProject.systemType}</span>
          <span>{activeProject.status}</span>
        </div>

        <div className="border-y border-ink/10">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <article
                id={`project-${project.slug}`}
                key={project.id}
                className={`relative border-b border-ink/10 last:border-b-0 ${
                  isExpanded ? "bg-paper/55" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(project.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`project-panel-${project.slug}`}
                  className="group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[6rem_1fr_14rem_12rem_2rem] md:px-2 md:py-9"
                >
                  <span className="font-mono text-xs text-stone">{project.id}</span>
                  <span className="grid gap-2">
                    <span className="font-mono text-2xl font-black uppercase leading-none text-ink sm:text-3xl md:text-5xl">
                      {project.name}
                    </span>
                    <span className="max-w-2xl font-serif text-xl italic leading-tight text-stone md:hidden">
                      {project.short}
                    </span>
                  </span>
                  <span className="hidden font-mono text-[11px] uppercase leading-relaxed text-stone md:block">
                    {project.short}
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase text-ink md:block">
                    {project.year}
                    <br />
                    <span className="text-stone">{project.status}</span>
                  </span>
                  <ArrowRight
                    className={`h-5 w-5 justify-self-end transition-transform ${
                      isExpanded ? "rotate-90 text-electric" : "text-ink group-hover:translate-x-1"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`project-panel-${project.slug}`}
                      ref={panelRef}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: isMotionEnabled ? 0.48 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-10 pb-12 md:grid-cols-[0.82fr_1.18fr] md:gap-14 md:pb-16">
                        <div className="relative border-t border-ink/10 pt-6 font-mono text-xs">
                          <div
                            className="absolute left-0 top-0 h-px w-24"
                            style={{ background: project.accent }}
                          />
                          <div className="mb-6 flex items-center justify-between text-[10px] uppercase text-stone">
                            <span className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-electric" aria-hidden="true" />
                              archive drawer / {project.slug}
                            </span>
                            <span>{project.status}</span>
                          </div>

                          <dl>
                            {rows.map(([label, key]) => (
                              <div
                                key={label}
                                className="dossier-row grid grid-cols-[5.2rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[7rem_1fr]"
                              >
                                <dt className="text-stone">{label}</dt>
                                <dd className="leading-relaxed text-ink">
                                  {project[key]}
                                </dd>
                              </div>
                            ))}
                            <div className="dossier-row grid grid-cols-[5.2rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[7rem_1fr]">
                              <dt className="text-stone">STACK</dt>
                              <dd className="flex flex-wrap gap-x-3 gap-y-2 text-ink">
                                {project.stack.map((item) => (
                                  <span key={item} className="border-b border-ink/15">
                                    {item}
                                  </span>
                                ))}
                              </dd>
                            </div>
                          </dl>

                          <a
                            href={`https://${project.source}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-[12px] uppercase text-ink transition-colors hover:border-electric hover:text-blueprint"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            source file
                          </a>
                        </div>

                        <div className="relative min-h-[380px] overflow-hidden border-y border-ink/10 py-6 md:border-y-0 md:border-l md:pl-10">
                          <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase text-stone">
                            <span className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-electric" aria-hidden="true" />
                              project-specific visual system
                            </span>
                            <span>{project.year}</span>
                          </div>
                          <div className="relative overflow-hidden bg-cream/55">
                            {project.slug === "equity" && <EquityBlueprint />}
                            {project.slug === "neurofin" && <NeurofinBlueprint />}
                            {project.slug === "mentora" && <MentoraBlueprint />}
                            {project.slug === "lab" && <LabBlueprint />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BlueprintShell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 720 430"
      className="h-auto w-full font-mono"
      role="img"
      aria-label={label}
    >
      <rect x="1" y="1" width="718" height="428" fill="#F5F0E8" opacity="0.82" />
      <path
        className="blueprint-path"
        d="M32 40 H688 M32 390 H688 M40 32 V398 M680 32 V398"
        pathLength="1"
        fill="none"
        stroke="#1A1612"
        strokeOpacity="0.16"
      />
      {children}
    </svg>
  );
}

function Node({
  x,
  y,
  title,
  detail,
  warm = false,
}: {
  x: number;
  y: number;
  title: string;
  detail: string;
  warm?: boolean;
}) {
  return (
    <g>
      <rect
        x={x - 56}
        y={y - 24}
        width="112"
        height="48"
        fill={warm ? "#F4E7D8" : "#F5F0E8"}
        stroke="#1A1612"
        strokeOpacity="0.22"
      />
      <text x={x} y={y - 3} textAnchor="middle" fill="#1A1612" fontSize="11">
        {title}
      </text>
      <text x={x} y={y + 13} textAnchor="middle" fill="#8C8480" fontSize="8">
        {detail}
      </text>
    </g>
  );
}

function EquityBlueprint() {
  const outputs = [
    ["BUY", 610, 102],
    ["HOLD", 610, 190],
    ["WATCH", 610, 278],
  ] as const;

  return (
    <BlueprintShell label="Equity Research Platform blueprint">
      <path
        className="blueprint-path"
        d="M88 216 H212 C260 216 258 112 322 112 H446 C500 112 506 102 554 102 M322 112 V216 H554 M322 216 V278 H554"
        pathLength="1"
        fill="none"
        stroke="#4AFF91"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
      <path
        className="blueprint-path"
        d="M212 216 C260 326 386 338 488 302"
        pathLength="1"
        fill="none"
        stroke="#2E5E4E"
        strokeDasharray="6 8"
        strokeOpacity="0.65"
      />
      <Node x={88} y={216} title="market" detail="price + news" />
      <Node x={212} y={216} title="context" detail="retrieval" />
      <Node x={322} y={112} title="research" detail="LangGraph" />
      <Node x={322} y={216} title="API" detail="FastAPI" />
      <Node x={488} y={302} title="explain" detail="trace" />
      {outputs.map(([title, x, y]) => (
        <Node key={title} x={x} y={y} title={title} detail="ranked" />
      ))}
      <text x="48" y="370" fill="#8C8480" fontSize="10">
        ranked signal outputs / inference flow / explainable recommendation path
      </text>
    </BlueprintShell>
  );
}

function NeurofinBlueprint() {
  const agents = [
    ["router", 360, 74],
    ["risk", 548, 142],
    ["forecast", 540, 286],
    ["tax", 360, 350],
    ["advisor", 174, 286],
    ["anomaly", 172, 142],
  ] as const;

  return (
    <BlueprintShell label="NeuroFin multi-agent blueprint">
      <path
        className="blueprint-path"
        d="M360 74 C542 84 628 236 540 286 C448 366 258 364 174 286 C82 202 164 78 360 74"
        pathLength="1"
        fill="none"
        stroke="#2E5E4E"
        strokeWidth="2"
        strokeDasharray="8 9"
      />
      <path
        className="blueprint-path"
        d="M360 210 L360 74 M360 210 L548 142 M360 210 L540 286 M360 210 L360 350 M360 210 L174 286 M360 210 L172 142"
        pathLength="1"
        fill="none"
        stroke="#4AFF91"
        strokeOpacity="0.72"
      />
      <circle cx="360" cy="210" r="54" fill="#F5F0E8" stroke="#1A1612" strokeOpacity="0.22" />
      <text x="360" y="205" textAnchor="middle" fill="#1A1612" fontSize="12">
        memory
      </text>
      <text x="360" y="224" textAnchor="middle" fill="#8C8480" fontSize="9">
        Redis + Nova
      </text>
      {agents.map(([title, x, y]) => (
        <Node key={title} x={x} y={y} title={title} detail="agent" />
      ))}
      <text x="48" y="370" fill="#8C8480" fontSize="10">
        deterministic route / specialist agents / bank data to finance action
      </text>
    </BlueprintShell>
  );
}

function MentoraBlueprint() {
  return (
    <BlueprintShell label="Mentora semantic matching blueprint">
      <path
        className="blueprint-path"
        d="M110 214 C210 96 326 96 360 214 C394 332 510 332 610 214"
        pathLength="1"
        fill="none"
        stroke="#B65B3A"
        strokeWidth="2.2"
      />
      <path
        className="blueprint-path"
        d="M110 214 C218 318 502 318 610 214 M222 214 H498"
        pathLength="1"
        fill="none"
        stroke="#4AFF91"
        strokeDasharray="7 8"
        strokeOpacity="0.62"
      />
      <circle cx="110" cy="214" r="58" fill="#F4E7D8" stroke="#1A1612" strokeOpacity="0.2" />
      <circle cx="610" cy="214" r="58" fill="#F4E7D8" stroke="#1A1612" strokeOpacity="0.2" />
      <Node x={110} y={214} title="mentee" detail="goals" warm />
      <Node x={360} y={214} title="semantic map" detail="embedding space" warm />
      <Node x={610} y={214} title="mentor" detail="skills" warm />
      <text x="48" y="370" fill="#8C8480" fontSize="10">
        human matching logic / compatibility score / realtime conversation layer
      </text>
    </BlueprintShell>
  );
}

function LabBlueprint() {
  return (
    <BlueprintShell label="NEEL.OS lab blueprint">
      <path
        className="blueprint-path"
        d="M84 330 V112 H232 V214 H372 V94 H566 V316 H446 V214 H232"
        pathLength="1"
        fill="none"
        stroke="#1A1612"
        strokeWidth="2"
        strokeOpacity="0.72"
      />
      <path
        className="blueprint-path"
        d="M84 330 C212 370 382 364 566 316"
        pathLength="1"
        fill="none"
        stroke="#4AFF91"
        strokeWidth="2.4"
      />
      <Node x={84} y={330} title="GSAP" detail="scene" />
      <Node x={232} y={214} title="Motion" detail="state" />
      <Node x={372} y={94} title="R3F" detail="machine" />
      <Node x={566} y={316} title="Next" detail="deploy" />
      <text x="48" y="370" fill="#8C8480" fontSize="10">
        portfolio as R&D artifact / motion as proof / interface as system
      </text>
    </BlueprintShell>
  );
}
