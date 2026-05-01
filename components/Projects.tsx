"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CircuitBoard,
  FileText,
  LockKeyhole,
  ScanLine,
} from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

type Project = {
  id: string;
  slug: string;
  name: string;
  systemType: string;
  role: string;
  architecture: string;
  flow: string[];
  stack: string[];
  impact: string;
  status: string;
  year: string;
  source: string;
};

const projects: Project[] = [
  {
    id: "01",
    slug: "equity",
    name: "Equity Research Platform",
    systemType: "Stateful agentic research pipeline",
    role: "Full-stack AI systems engineer",
    architecture:
      "Live market data -> LangGraph reasoning loop -> FastAPI stateless API -> React intelligence dashboard",
    flow: [
      "Market signal",
      "Context retrieval",
      "LangGraph loop",
      "API boundary",
      "Decision dashboard",
    ],
    stack: [
      "React",
      "FastAPI",
      "LangGraph",
      "Python",
      "Tailwind",
      "AWS EC2",
      "S3",
    ],
    impact:
      "Turns noisy market context into explainable investment recommendations through a horizontally scalable research flow.",
    status: "DEPLOYED",
    year: "2024-2026",
    source: "github.com/Neel-Kachhadia/Equity-Research-Platform",
  },
  {
    id: "02",
    slug: "neurofin",
    name: "NeuroFin",
    systemType: "12-agent financial intelligence operating layer",
    role: "Architecture, agent design, backend systems, product interface",
    architecture:
      "Deterministic router -> specialist Python agents -> Redis memory -> Amazon Nova via Bedrock -> explainable finance actions",
    flow: [
      "Bank data",
      "Deterministic router",
      "Specialist agents",
      "Memory layer",
      "Finance action",
    ],
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
    impact:
      "Scores risk, forecasts cash flow, detects anomalies across 3000+ transactions, and converts bank data into personal finance decisions.",
    status: "DEPLOYED",
    year: "2025-2026",
    source: "github.com/Neel-Kachhadia/NeuroFin",
  },
  {
    id: "03",
    slug: "mentora",
    name: "Mentora",
    systemType: "Semantic mentor-mentee matching engine",
    role: "Full-stack engineer, AI matching layer, realtime product flow",
    architecture:
      "OpenAI embeddings -> compatibility scoring -> Firebase realtime chat -> personalized learning paths",
    flow: [
      "Profile intent",
      "Embeddings",
      "Compatibility score",
      "Realtime chat",
      "Learning path",
    ],
    stack: ["React", "Node.js", "Express", "Firebase", "OpenAI API"],
    impact:
      "Moves matching away from profile browsing and toward intent, goals, level, and semantic compatibility.",
    status: "DEPLOYED",
    year: "2025-2026",
    source: "github.com/Neel-Kachhadia/Mentore-Mentee-Platform",
  },
];

const dossierRows: Array<[string, keyof Project]> = [
  ["ROLE", "role"],
  ["ARCHITECTURE", "architecture"],
  ["IMPACT", "impact"],
];

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>("02");
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    const handleOpenProject = (event: Event) => {
      const slug = (event as CustomEvent<{ slug?: string }>).detail?.slug;
      const project = projects.find((item) => item.slug === slug);
      if (project) setExpandedId(project.id);
    };

    window.addEventListener("open-project", handleOpenProject);
    return () => window.removeEventListener("open-project", handleOpenProject);
  }, []);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="w-full px-6 py-32 md:px-8 md:py-44"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-14 grid gap-8 border-b border-ink/10 pb-8 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <div>
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase text-stone">
              <LockKeyhole
                className="h-4 w-4 text-electric"
                aria-hidden="true"
              />
              03 / ACTIVE_SYSTEMS / DOSSIERS
            </span>
            <h2
              id="work-title"
              className="mt-5 font-mono text-[4rem] font-black uppercase leading-[0.78] text-ink sm:text-[5.8rem] md:text-[8.5rem]"
            >
              ACTIVE
              <span className="ml-[12vw] block font-serif font-normal italic text-stone md:ml-28">
                systems
              </span>
            </h2>
          </div>
          <p className="max-w-2xl font-serif text-3xl italic leading-[1.02] text-stone md:justify-self-end md:text-4xl">
            Each project opens as an engineering file: architecture, signal
            flow, impact, and the machine shape underneath.
          </p>
        </div>

        <div className="mb-3 hidden grid-cols-[4.5rem_1fr_9rem_13rem_2rem] gap-4 border-b border-ink/10 pb-3 font-mono text-[10px] uppercase text-stone md:grid">
          <span>File</span>
          <span>System</span>
          <span>Status</span>
          <span>Type</span>
          <span />
        </div>

        <div className="flex w-full flex-col border-t border-ink/10">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <article
                id={`project-${project.slug}`}
                key={project.id}
                className={`group relative flex w-full flex-col border-b border-ink/10 transition-colors duration-300 ${
                  isExpanded ? "bg-paper/70" : "hover:bg-paper/45"
                }`}
              >
                {isExpanded && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-electric" />
                )}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`project-panel-${project.slug}`}
                  className="grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 px-2 py-7 text-left md:grid-cols-[4.5rem_1fr_9rem_13rem_2rem] md:px-4 md:py-9"
                >
                  <span className="font-mono text-xs text-stone">
                    {project.id}
                  </span>
                  <span className="flex min-w-0 flex-col gap-2">
                    <span className="font-mono text-3xl font-black uppercase leading-none text-ink md:text-5xl">
                      {project.name}
                    </span>
                    <span className="font-mono text-[11px] uppercase leading-relaxed text-stone md:hidden">
                      {project.systemType}
                    </span>
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase text-ink md:flex md:flex-col md:gap-1">
                    <span>{project.status}</span>
                    <span className="text-stone">{project.year}</span>
                  </span>
                  <span className="hidden font-mono text-[11px] uppercase leading-relaxed text-stone md:block">
                    {project.systemType}
                  </span>
                  <ArrowRight
                    className={`h-5 w-5 justify-self-end text-ink transition-transform duration-300 ${
                      isExpanded
                        ? "rotate-90 text-electric"
                        : "group-hover:translate-x-1"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`project-panel-${project.slug}`}
                      initial={{
                        height: 0,
                        opacity: 0,
                        clipPath: "inset(0 0 100% 0)",
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        clipPath: "inset(0 0 0% 0)",
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        clipPath: "inset(0 0 100% 0)",
                      }}
                      transition={{
                        duration: isMotionEnabled ? 0.42 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-10 px-2 pb-12 pt-3 md:grid-cols-[0.95fr_1.05fr] md:px-4 md:pb-16 md:pt-6">
                        <div className="font-mono text-xs md:text-sm">
                          <div className="mb-7 flex items-center justify-between border-b border-ink/10 pb-3 text-[11px] uppercase text-stone">
                            <span className="flex items-center gap-3">
                              <FileText
                                className="h-4 w-4 text-electric"
                                aria-hidden="true"
                              />
                              Case file / {project.slug}
                            </span>
                            <span>{project.year}</span>
                          </div>

                          <dl className="flex flex-col">
                            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[9rem_1fr]">
                              <dt className="text-stone">TITLE</dt>
                              <dd className="leading-relaxed text-ink">
                                {project.name}
                              </dd>
                            </div>
                            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[9rem_1fr]">
                              <dt className="text-stone">SYSTEM TYPE</dt>
                              <dd className="leading-relaxed text-ink">
                                {project.systemType}
                              </dd>
                            </div>
                            {dossierRows.map(([label, key]) => (
                              <div
                                key={label}
                                className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[9rem_1fr]"
                              >
                                <dt className="text-stone">{label}</dt>
                                <dd className="leading-relaxed text-ink">
                                  {project[key]}
                                </dd>
                              </div>
                            ))}
                            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[9rem_1fr]">
                              <dt className="text-stone">SYSTEM FLOW</dt>
                              <dd>
                                <FlowTrace steps={project.flow} />
                              </dd>
                            </div>
                            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[9rem_1fr]">
                              <dt className="text-stone">STACK</dt>
                              <dd className="flex flex-wrap gap-x-3 gap-y-2 text-ink">
                                {project.stack.map((item) => (
                                  <span
                                    key={item}
                                    className="border-b border-ink/15"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </dd>
                            </div>
                            <div className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[9rem_1fr]">
                              <dt className="text-stone">STATE</dt>
                              <dd className="flex flex-wrap gap-3 text-ink">
                                <span className="border border-electric/70 bg-electric/20 px-2 py-1 text-[10px] uppercase">
                                  {project.status}
                                </span>
                                <span className="border border-ink/10 bg-cream px-2 py-1 text-[10px] uppercase">
                                  {project.year}
                                </span>
                              </dd>
                            </div>
                          </dl>

                          <a
                            href={`https://${project.source}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-[12px] uppercase text-ink transition-colors hover:border-electric hover:text-blueprint"
                          >
                            <ArrowUpRight
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Source file
                          </a>
                        </div>

                        <div className="relative min-h-[340px] border-y border-ink/10 py-6 md:border-y-0 md:border-l md:pl-10">
                          <div className="mb-5 flex items-center justify-between font-mono text-[11px] uppercase text-stone">
                            <span className="flex items-center gap-2">
                              <CircuitBoard
                                className="h-4 w-4 text-electric"
                                aria-hidden="true"
                              />
                              Interactive blueprint
                            </span>
                            <span className="flex items-center gap-2">
                              <ScanLine
                                className="h-4 w-4 text-blueprint"
                                aria-hidden="true"
                              />
                              {project.status}
                            </span>
                          </div>
                          <div className="relative overflow-hidden border border-ink/10 bg-cream/55">
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(26,22,18,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(26,22,18,0.045)_1px,transparent_1px)] bg-[size:28px_28px]" />
                            <div className="relative p-3 md:p-6">
                              {project.slug === "equity" && (
                                <EquityDiagram animate={isMotionEnabled} />
                              )}
                              {project.slug === "neurofin" && (
                                <NeurofinDiagram animate={isMotionEnabled} />
                              )}
                              {project.slug === "mentora" && (
                                <MentoraDiagram animate={isMotionEnabled} />
                              )}
                            </div>
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

function FlowTrace({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-2 md:grid-cols-5">
      {steps.map((step, index) => (
        <li key={step} className="relative min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center border border-ink/15 bg-cream text-[9px] text-stone">
              {index + 1}
            </span>
            <span className="min-w-0 text-[11px] uppercase leading-snug text-ink">
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span
              className="ml-2.5 hidden h-px bg-electric/60 md:absolute md:left-full md:top-2.5 md:block md:w-[calc(100%-1.25rem)]"
              aria-hidden="true"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function DiagramLabel({
  x,
  y,
  title,
  detail,
}: {
  x: number;
  y: number;
  title: string;
  detail: string;
}) {
  return (
    <g>
      <rect
        x={x - 48}
        y={y - 19}
        width="96"
        height="38"
        rx="3"
        fill="#F5F0E8"
        stroke="#1A1612"
        strokeOpacity="0.18"
      />
      <text x={x} y={y - 3} textAnchor="middle" fill="#1A1612" fontSize="9">
        {title}
      </text>
      <text x={x} y={y + 10} textAnchor="middle" fill="#8C8480" fontSize="7.5">
        {detail}
      </text>
    </g>
  );
}

function MotionPacket({
  animate,
  path,
  delay = "0s",
}: {
  animate: boolean;
  path: string;
  delay?: string;
}) {
  return (
    <circle r="3.2" fill="#4AFF91" opacity={animate ? 1 : 0.75}>
      {animate && (
        <animateMotion
          dur="3.4s"
          begin={delay}
          repeatCount="indefinite"
          path={path}
        />
      )}
    </circle>
  );
}

function EquityDiagram({ animate }: { animate: boolean }) {
  const path = "M 42 150 L 172 150 L 282 150 L 408 150";

  return (
    <svg
      viewBox="0 0 450 300"
      className="h-auto w-full font-mono"
      role="img"
      aria-label="Equity Research Platform architecture"
    >
      <defs>
        <marker
          id="arrow-equity"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L0,7 L7,3.5 z" fill="#4AFF91" fillOpacity="0.65" />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="#4AFF91"
        strokeWidth="1.1"
        strokeOpacity="0.42"
        markerEnd="url(#arrow-equity)"
      />
      <path
        d="M172 150 C172 88 236 88 236 130"
        fill="none"
        stroke="#4AFF91"
        strokeDasharray="4 7"
        strokeOpacity="0.28"
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-22"
            dur="2.4s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <MotionPacket animate={animate} path={path} />
      <MotionPacket animate={animate} path={path} delay="1.2s" />
      <DiagramLabel x={42} y={150} title="Market" detail="live data" />
      <DiagramLabel x={172} y={150} title="LangGraph" detail="research loop" />
      <DiagramLabel x={282} y={150} title="FastAPI" detail="stateless API" />
      <DiagramLabel x={408} y={150} title="React" detail="dashboard" />
      <text x="172" y="72" fill="#8C8480" fontSize="9">
        context retrieval + decision trace
      </text>
    </svg>
  );
}

function NeurofinDiagram({ animate }: { animate: boolean }) {
  const orbit =
    "M 225 58 C 320 58 372 138 346 215 C 320 294 230 322 150 278 C 68 232 78 132 142 82 C 166 64 194 58 225 58";

  const agents = [
    ["router", 225, 48],
    ["forecast", 340, 128],
    ["risk", 320, 254],
    ["advisor", 225, 298],
    ["savings", 104, 242],
    ["classifier", 102, 128],
  ] as const;

  return (
    <svg
      viewBox="0 0 450 340"
      className="h-auto w-full font-mono"
      role="img"
      aria-label="NeuroFin 12-agent architecture"
    >
      <path
        d={orbit}
        fill="none"
        stroke="#4AFF91"
        strokeDasharray="5 8"
        strokeOpacity="0.3"
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-26"
            dur="4.8s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <g stroke="#4AFF91" strokeOpacity="0.25" strokeWidth="0.8">
        {agents.map(([, x, y]) => (
          <line key={`${x}-${y}`} x1="225" y1="170" x2={x} y2={y} />
        ))}
      </g>
      <circle
        cx="225"
        cy="170"
        r="39"
        fill="#F5F0E8"
        stroke="#4AFF91"
        strokeOpacity="0.55"
      />
      <text x="225" y="164" textAnchor="middle" fill="#1A1612" fontSize="10">
        Amazon Nova
      </text>
      <text x="225" y="180" textAnchor="middle" fill="#2E5E4E" fontSize="8">
        reasoning layer
      </text>
      <MotionPacket animate={animate} path={orbit} />
      <MotionPacket animate={animate} path={orbit} delay="2s" />
      {agents.map(([label, x, y]) => (
        <DiagramLabel key={label} x={x} y={y} title={label} detail="agent" />
      ))}
      <text x="24" y="320" fill="#8C8480" fontSize="9">
        Redis memory + bank transactions + SNS alerts + tax intelligence
      </text>
    </svg>
  );
}

function MentoraDiagram({ animate }: { animate: boolean }) {
  const leftPath = "M 92 155 C 154 94 218 94 282 155";
  const rightPath = "M 282 155 C 218 216 154 216 92 155";

  return (
    <svg
      viewBox="0 0 450 300"
      className="h-auto w-full font-mono"
      role="img"
      aria-label="Mentora semantic matching architecture"
    >
      <circle
        cx="92"
        cy="155"
        r="46"
        fill="#F5F0E8"
        stroke="#1A1612"
        strokeOpacity="0.18"
      />
      <circle
        cx="358"
        cy="155"
        r="46"
        fill="#F5F0E8"
        stroke="#1A1612"
        strokeOpacity="0.18"
      />
      <rect
        x="172"
        y="123"
        width="106"
        height="64"
        rx="4"
        fill="#F5F0E8"
        stroke="#4AFF91"
        strokeOpacity="0.5"
      />
      <text x="92" y="152" textAnchor="middle" fill="#1A1612" fontSize="10">
        mentee
      </text>
      <text x="92" y="168" textAnchor="middle" fill="#8C8480" fontSize="8">
        goals + level
      </text>
      <text x="225" y="147" textAnchor="middle" fill="#1A1612" fontSize="10">
        embeddings
      </text>
      <text x="225" y="164" textAnchor="middle" fill="#2E5E4E" fontSize="8">
        compatibility
      </text>
      <text x="358" y="152" textAnchor="middle" fill="#1A1612" fontSize="10">
        mentor
      </text>
      <text x="358" y="168" textAnchor="middle" fill="#8C8480" fontSize="8">
        skills + exp
      </text>
      <path
        d={leftPath}
        fill="none"
        stroke="#4AFF91"
        strokeOpacity="0.42"
        strokeDasharray="5 7"
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <path
        d={rightPath}
        fill="none"
        stroke="#4AFF91"
        strokeOpacity="0.42"
        strokeDasharray="5 7"
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="24"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>
      <MotionPacket
        animate={animate}
        path="M 92 155 L 172 155 L 278 155 L 358 155"
      />
      <MotionPacket
        animate={animate}
        path="M 358 155 L 278 155 L 172 155 L 92 155"
        delay="1.4s"
      />
      <text x="24" y="270" fill="#8C8480" fontSize="9">
        semantic profile matching + realtime Firebase conversation layer
      </text>
    </svg>
  );
}
