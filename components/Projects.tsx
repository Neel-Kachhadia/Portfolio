"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Layers3 } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

type Project = {
  id: string;
  slug: "equity" | "neurofin" | "mentora";
  name: string;
  short: string;
  role: string;
  architecture: string;
  impact: string;
  stack: string[];
  year: string;
  source: string;
  accent: string;
  tone: string;
};

const projects: Project[] = [
  {
    id: "01",
    slug: "equity",
    name: "Equity Research Platform",
    short: "Market signals enter fragmented. Recommendations leave ranked.",
    role: "Full-stack AI systems engineer",
    architecture:
      "Market intake -> LangGraph research loop -> FastAPI boundary -> React decision surface",
    impact:
      "Turns noisy market context into explainable investment recommendations through a scalable research flow.",
    stack: ["React", "FastAPI", "LangGraph", "Python", "Tailwind", "AWS EC2", "S3"],
    year: "2024-2026",
    source: "github.com/Neel-Kachhadia/Equity-Research-Platform",
    accent: "#4AFF91",
    tone: "market signal routing",
  },
  {
    id: "02",
    slug: "neurofin",
    name: "NeuroFin",
    short: "A 12-agent finance machine around memory and model rails.",
    role: "Architecture, agent design, backend systems, product interface",
    architecture:
      "Deterministic router -> specialist Python agents -> Redis memory -> Amazon Nova via Bedrock",
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
    source: "github.com/Neel-Kachhadia/NeuroFin",
    accent: "#2E5E4E",
    tone: "multi-agent finance machine",
  },
  {
    id: "03",
    slug: "mentora",
    name: "Mentora",
    short: "Human intent becomes vectors. Compatibility becomes path.",
    role: "Full-stack engineer, AI matching layer, realtime product flow",
    architecture:
      "OpenAI embeddings -> compatibility scoring -> Firebase realtime chat -> personalized learning paths",
    impact:
      "Moves matching away from browsing and toward intent, goals, level, and semantic compatibility.",
    stack: ["React", "Node.js", "Express", "Firebase", "OpenAI API"],
    year: "2025-2026",
    source: "github.com/Neel-Kachhadia/Mentore-Mentee-Platform",
    accent: "#B65B3A",
    tone: "warm semantic matching",
  },
];

const specRows: Array<[string, keyof Project]> = [
  ["ROLE", "role"],
  ["SYSTEM", "architecture"],
  ["PROOF", "impact"],
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
    const layers = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(".dossier-layer"),
    );
    const rows = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(".spec-row"),
    );

    gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(layers, { opacity: 0, y: 28, rotateX: -24, transformOrigin: "50% 100%" });
    gsap.set(rows, { opacity: 0, x: -18 });

    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .to(layers, { opacity: 1, y: 0, rotateX: 0, duration: 0.72, stagger: 0.08 }, 0)
      .to(paths, { strokeDashoffset: 0, duration: 1, stagger: 0.065 }, 0.18)
      .to(rows, { opacity: 1, x: 0, duration: 0.42, stagger: 0.045 }, 0.26);
  }, [expandedId, isMotionEnabled]);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative w-full overflow-hidden px-5 py-28 md:px-8 md:py-44"
      style={{ ["--project-accent" as string]: activeProject.accent }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-ink/10" />
      <div className="pointer-events-none absolute right-[-18vw] top-24 h-[45rem] w-[45rem] rounded-full border border-ink/[0.04]" />

      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-14 grid gap-9 md:grid-cols-[0.82fr_1.18fr] md:items-end">
          <div>
            <span className="font-mono text-[11px] uppercase text-stone">
              project dossiers
            </span>
            <h2
              id="work-title"
              className="mt-5 max-w-[8ch] font-mono text-[4rem] font-black uppercase leading-[0.76] text-ink sm:text-[6rem] md:text-[9.5rem]"
            >
              PULL
              <span className="ml-[18vw] block font-serif font-normal italic text-stone md:ml-36">
                file
              </span>
              OPEN
            </h2>
          </div>
          <p className="max-w-3xl font-serif text-3xl italic leading-[1.02] text-stone md:justify-self-end md:text-5xl">
            Each row becomes a physical engineering archive: layers lift, routes
            draw, and project proof lands with mechanical precision.
          </p>
        </div>

        <div className="border-y border-ink/10">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <article
                id={`project-${project.slug}`}
                key={project.id}
                className="relative border-b border-ink/10 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(project.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`project-panel-${project.slug}`}
                  className="group grid w-full grid-cols-[2.8rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[5rem_1fr_15rem_10rem_2rem] md:px-2 md:py-9"
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
                    {project.tone}
                  </span>
                  <span className="hidden font-mono text-[10px] uppercase text-ink md:block">
                    {project.year}
                  </span>
                  <ArrowRight
                    className={`h-5 w-5 justify-self-end transition-transform ${
                      isExpanded ? "rotate-90" : "group-hover:translate-x-1"
                    }`}
                    style={{ color: isExpanded ? project.accent : "#1A1612" }}
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
                        duration: isMotionEnabled ? 0.56 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-10 pb-14 md:grid-cols-[0.78fr_1.22fr] md:gap-14 md:pb-20">
                        <div className="border-t border-ink/10 pt-6 font-mono text-xs">
                          <div className="mb-6 flex items-center justify-between text-[10px] uppercase text-stone">
                            <span className="inline-flex items-center gap-2">
                              <Layers3 className="h-4 w-4" style={{ color: project.accent }} />
                              dossier lifted
                            </span>
                            <span>{project.slug}</span>
                          </div>

                          <dl>
                            {specRows.map(([label, key]) => (
                              <div
                                key={label}
                                className="spec-row grid grid-cols-[5.2rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[7rem_1fr]"
                              >
                                <dt className="text-stone">{label}</dt>
                                <dd className="leading-relaxed text-ink">
                                  {project[key]}
                                </dd>
                              </div>
                            ))}
                            <div className="spec-row grid grid-cols-[5.2rem_1fr] gap-4 border-b border-ink/10 py-4 md:grid-cols-[7rem_1fr]">
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
                            className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono text-[12px] uppercase text-ink transition-colors hover:border-[var(--project-accent)]"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            source
                          </a>
                        </div>

                        <div className="relative min-h-[420px] overflow-visible py-6 md:min-h-[540px] md:pl-8">
                          <DossierSpread project={project} />
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

function DossierSpread({ project }: { project: Project }) {
  return (
    <div className="relative h-[420px] [perspective:1200px] md:h-[540px]">
      <div className="dossier-layer absolute inset-x-0 top-0 h-[82%] origin-bottom border border-ink/10 bg-paper shadow-[0_28px_70px_rgba(26,22,18,0.08)] md:inset-x-8" />
      <div className="dossier-layer absolute left-2 right-8 top-8 h-[82%] origin-bottom border border-ink/10 bg-cream shadow-[0_22px_60px_rgba(26,22,18,0.08)] md:left-0 md:right-16">
        <ProjectBlueprint project={project} />
      </div>
      <div
        className="dossier-layer absolute bottom-0 right-0 w-[72%] border border-ink/10 bg-cream/95 p-4 font-mono text-[10px] uppercase leading-relaxed text-stone shadow-[0_24px_60px_rgba(26,22,18,0.09)] md:p-6"
        style={{ borderTopColor: project.accent }}
      >
        <div className="mb-5 text-ink">{project.short}</div>
        <div className="grid gap-2 sm:grid-cols-3">
          <span>intake</span>
          <span>route</span>
          <span>resolve</span>
        </div>
      </div>
    </div>
  );
}

function ProjectBlueprint({ project }: { project: Project }) {
  if (project.slug === "equity") return <EquityBlueprint accent={project.accent} />;
  if (project.slug === "neurofin") return <NeurofinBlueprint accent={project.accent} />;
  return <MentoraBlueprint accent={project.accent} />;
}

function Shell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <svg viewBox="0 0 760 480" className="h-full w-full font-mono" role="img" aria-label={label}>
      <rect x="1" y="1" width="758" height="478" fill="#F5F0E8" opacity="0.88" />
      <path
        className="blueprint-path"
        d="M34 44 H726 M34 436 H726 M48 34 V446 M712 34 V446"
        pathLength="1"
        fill="none"
        stroke="#1A1612"
        strokeOpacity="0.15"
      />
      {children}
    </svg>
  );
}

function Module({
  x,
  y,
  w,
  h,
  title,
  fill = "#F5F0E8",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  fill?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke="#1A1612" strokeOpacity="0.24" />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill="#1A1612" fontSize="12">
        {title}
      </text>
    </g>
  );
}

function EquityBlueprint({ accent }: { accent: string }) {
  return (
    <Shell label="Equity Research Platform routing blueprint">
      <g fill="none" strokeLinecap="square">
        <path
          className="blueprint-path"
          d="M80 250 C138 198 168 302 226 250 C280 202 312 198 360 228 H498 C560 228 570 122 638 122"
          pathLength="1"
          stroke={accent}
          strokeWidth="3"
        />
        <path
          className="blueprint-path"
          d="M360 228 V340 H638 M498 228 V250 H638"
          pathLength="1"
          stroke="#2E5E4E"
          strokeWidth="2"
          strokeOpacity="0.7"
        />
        <path
          className="blueprint-path"
          d="M80 192 H184 M94 312 H210 M104 138 H194"
          pathLength="1"
          stroke="#1A1612"
          strokeOpacity="0.32"
        />
      </g>
      <Module x={54} y={222} w={112} h={56} title="market" />
      <Module x={214} y={222} w={118} h={56} title="fragment" />
      <Module x={350} y={196} w={148} h={64} title="research" />
      <Module x={604} y={96} w={92} h={52} title="BUY" />
      <Module x={604} y={224} w={92} h={52} title="HOLD" />
      <Module x={604} y={314} w={92} h={52} title="WATCH" />
    </Shell>
  );
}

function NeurofinBlueprint({ accent }: { accent: string }) {
  const agents = [
    ["risk", 550, 126],
    ["forecast", 550, 230],
    ["anomaly", 550, 334],
    ["budget", 74, 126],
    ["tax", 74, 230],
    ["advisor", 74, 334],
  ] as const;

  return (
    <Shell label="NeuroFin multi-agent blueprint">
      <g fill="none" strokeLinecap="square">
        <path
          className="blueprint-path"
          d="M214 240 H548 M382 92 V390 M214 150 H382 M214 330 H382"
          pathLength="1"
          stroke={accent}
          strokeWidth="3"
        />
        <path
          className="blueprint-path"
          d="M382 150 C470 146 498 126 550 126 M382 240 C462 240 496 230 550 230 M382 330 C470 334 500 334 550 334 M214 150 C164 148 134 126 74 126 M214 240 C158 240 130 230 74 230 M214 330 C162 332 132 334 74 334"
          pathLength="1"
          stroke="#4AFF91"
          strokeWidth="1.8"
          strokeOpacity="0.78"
        />
      </g>
      <Module x={308} y={198} w={148} h={84} title="memory / model" fill="#EEE6DA" />
      {agents.map(([label, x, y]) => (
        <Module key={label} x={x} y={y - 24} w={112} h={48} title={label} />
      ))}
    </Shell>
  );
}

function MentoraBlueprint({ accent }: { accent: string }) {
  return (
    <Shell label="Mentora semantic matching blueprint">
      <g fill="none" strokeLinecap="square">
        <path
          className="blueprint-path"
          d="M118 250 C218 82 338 82 382 250 C426 418 542 418 642 250"
          pathLength="1"
          stroke={accent}
          strokeWidth="3"
        />
        <path
          className="blueprint-path"
          d="M118 250 C250 348 510 348 642 250 M230 250 H532"
          pathLength="1"
          stroke="#4AFF91"
          strokeWidth="2"
          strokeOpacity="0.72"
        />
      </g>
      <circle cx="118" cy="250" r="62" fill="#F4E7D8" stroke="#1A1612" strokeOpacity="0.22" />
      <circle cx="642" cy="250" r="62" fill="#F4E7D8" stroke="#1A1612" strokeOpacity="0.22" />
      <Module x={72} y={226} w={92} h={48} title="mentee" fill="#F4E7D8" />
      <Module x={300} y={218} w={164} h={64} title="embedding" fill="#F5F0E8" />
      <Module x={596} y={226} w={92} h={48} title="mentor" fill="#F4E7D8" />
    </Shell>
  );
}
