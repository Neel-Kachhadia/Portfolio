"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center px-6 pt-24 md:flex-row md:items-center md:pt-0">
      {/* Left Column (55%) */}
      <div className="flex w-full flex-col justify-center md:w-[55%]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <h1 className="leading-[0.85] tracking-tighter text-ink" style={{ fontSize: "clamp(56px, 12vw, 140px)", fontWeight: 900 }}>
            NEEL <br />
            KACHHADIA
          </h1>

          <p className="mt-6 font-serif text-xl italic text-stone md:text-2xl">
            AI Systems Engineer · Mumbai, India — 2024
          </p>

          {/* Metrics row */}
          <div className="mt-12 flex flex-wrap gap-8 font-mono text-sm text-ink-light md:gap-12 md:text-base">
            <div className="flex flex-col">
              <span className="font-semibold text-ink">&lt; 200ms</span>
              <span className="text-stone">Lambda latency</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-ink">×3</span>
              <span className="text-stone">Systems shipped</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-ink">2024 &rarr;</span>
              <span className="text-stone">Active</span>
            </div>
          </div>

          <div className="mt-16">
            <a
              href="#work"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-ink px-6 py-3 font-mono text-sm uppercase transition-colors hover:bg-electric hover:text-ink"
            >
              [ View work &darr; ]
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Column (45%) */}
      <div className="relative mt-16 flex w-full h-[400px] items-center justify-center md:mt-0 md:h-[600px] md:w-[45%]">
        <NodeGraph />
      </div>
    </section>
  );
}

// Node Graph Canvas Component
const labels = [
  "LangGraph", "FastAPI", "React", "AWS Lambda",
  "Firebase", "OpenAI API", "Python", "TypeScript",
  "Node.js", "Pandas", "AWS S3", "Tailwind"
];

function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    // Fixed positions — no random clustering
    const nodeData = [
      { label: "LangGraph", px: 0.2, py: 0.2 },
      { label: "FastAPI", px: 0.5, py: 0.15 },
      { label: "React", px: 0.8, py: 0.2 },
      { label: "AWS Lambda", px: 0.15, py: 0.45 },
      { label: "Firebase", px: 0.45, py: 0.4 },
      { label: "OpenAI API", px: 0.78, py: 0.45 },
      { label: "Python", px: 0.25, py: 0.7 },
      { label: "TypeScript", px: 0.55, py: 0.65 },
      { label: "Node.js", px: 0.82, py: 0.68 },
      { label: "Pandas", px: 0.15, py: 0.88 },
      { label: "AWS S3", px: 0.5, py: 0.85 },
      { label: "Tailwind", px: 0.82, py: 0.88 },
    ];

    const nodes = nodeData.map(n => ({
      ...n,
      x: n.px * width,
      y: n.py * height,
      baseX: n.px * width,
      baseY: n.py * height,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0004,
      amplitude: 8 + Math.random() * 10,
    }));

    let mouseX = -999;
    let mouseY = -999;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Clean connections — no self-loops
    const connections = [
      [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
      [3, 6], [4, 7], [5, 8], [6, 9], [7, 10],
      [8, 11], [0, 4], [2, 7], [4, 8], [1, 7],
    ];

    const dots = Array.from({ length: 10 }).map(() => ({
      connIdx: Math.floor(Math.random() * connections.length),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.002,
    }));

    let animationFrameId: number;
    let lastTimestamp = 0;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      // Cap at ~50fps to reduce CPU load
      if (timestamp - lastTimestamp < 20) return;
      lastTimestamp = timestamp;

      const t = timestamp * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Update node positions
      nodes.forEach(node => {
        const waveX = Math.sin(t * node.speed * 60 + node.phase) * node.amplitude;
        const waveY = Math.cos(t * node.speed * 48 + node.phase) * node.amplitude;
        let targetX = node.baseX + waveX;
        let targetY = node.baseY + waveY;

        const dx = mouseX - targetX;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          targetX += dx * force * 0.06;
          targetY += dy * force * 0.06;
        }

        node.x += (targetX - node.x) * 0.06;
        node.y += (targetY - node.y) * 0.06;
      });

      // Draw connections
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(74,255,145,0.2)";
      connections.forEach(([from, to]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[from].x, nodes[from].y);
        ctx.lineTo(nodes[to].x, nodes[to].y);
        ctx.stroke();
      });

      // Draw traveling dots
      ctx.fillStyle = "#4AFF91";
      dots.forEach(dot => {
        dot.progress += dot.speed;
        if (dot.progress > 1) {
          dot.progress = 0;
          dot.connIdx = Math.floor(Math.random() * connections.length);
        }
        const [from, to] = connections[dot.connIdx];
        const p1 = nodes[from];
        const p2 = nodes[to];
        ctx.beginPath();
        ctx.arc(
          p1.x + (p2.x - p1.x) * dot.progress,
          p1.y + (p2.y - p1.y) * dot.progress,
          2, 0, Math.PI * 2
        );
        ctx.fill();
      });

      // Draw nodes + labels
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      nodes.forEach(node => {
        // Node dot
        ctx.fillStyle = "#EDE8DE";
        ctx.strokeStyle = "rgba(26,22,18,0.35)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.font = "11px 'Geist Mono', monospace";
        ctx.fillStyle = "rgba(26,22,18,0.6)";
        ctx.fillText(node.label, node.x, node.y - 16);
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ touchAction: "none" }}
    />
  );
}
