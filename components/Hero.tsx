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
      <div className="relative mt-16 flex w-full items-center justify-center md:mt-0 md:h-full md:w-[45%]">
        <NodeGraph />

        {/* Mobile Fallback SVG */}
        <div className="block w-full max-w-sm md:hidden text-ink/20">
          <svg viewBox="0 0 400 400" className="w-full h-auto">
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <circle cx="100" cy="100" r="40" strokeDasharray="4 4" />
              <circle cx="300" cy="150" r="60" />
              <circle cx="200" cy="300" r="50" />
              <path d="M100 100 L 300 150 L 200 300 Z" strokeOpacity="0.2" />
              <circle cx="200" cy="200" r="4" fill="currentColor" />
              <circle cx="250" cy="225" r="4" fill="#4AFF91" />
            </g>
          </svg>
        </div>
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

    const nodes = labels.map((label) => ({
      label,
      x: Math.random() * width * 0.7 + width * 0.15,
      y: Math.random() * height * 0.7 + height * 0.15,
      baseX: 0, baseY: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0008 + Math.random() * 0.001,
      amplitude: 12 + Math.random() * 15,
      vx: 0, vy: 0,
    }));
    nodes.forEach(n => { n.baseX = n.x; n.baseY = n.y; });

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    const connections: { from: number; to: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      connections.push({ from: i, to: (i + 1) % nodes.length });
      if (i % 3 === 0) connections.push({ from: i, to: (i + 4) % nodes.length });
    }

    const dots = Array.from({ length: 12 }).map(() => ({
      connectionIdx: Math.floor(Math.random() * connections.length),
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
    }));

    let animationFrameId: number;
    let lastTime = 0;
    const FPS = 60;
    const interval = 1000 / FPS;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);
      const delta = timestamp - lastTime;
      if (delta < interval) return; // FPS cap
      lastTime = timestamp - (delta % interval);

      const time = timestamp * 0.001; // seconds, smooth

      ctx.clearRect(0, 0, width, height);

      nodes.forEach(node => {
        const waveX = Math.sin(time * node.speed * 60 + node.phase) * node.amplitude;
        const waveY = Math.cos(time * node.speed * 48 + node.phase) * node.amplitude;
        let targetX = node.baseX + waveX;
        let targetY = node.baseY + waveY;
        const dx = mouseX - targetX;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          targetX += dx * force * 0.08;
          targetY += dy * force * 0.08;
        }
        node.x += (targetX - node.x) * 0.08;
        node.y += (targetY - node.y) * 0.08;
      });

      // Draw connections
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(74, 255, 145, 0.25)";
      connections.forEach(conn => {
        const p1 = nodes[conn.from];
        const p2 = nodes[conn.to];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw dots
      ctx.fillStyle = "#4AFF91";
      dots.forEach(dot => {
        dot.progress += dot.speed;
        if (dot.progress > 1) {
          dot.progress = 0;
          dot.connectionIdx = Math.floor(Math.random() * connections.length);
        }
        const conn = connections[dot.connectionIdx];
        const p1 = nodes[conn.from];
        const p2 = nodes[conn.to];
        ctx.beginPath();
        ctx.arc(
          p1.x + (p2.x - p1.x) * dot.progress,
          p1.y + (p2.y - p1.y) * dot.progress,
          2, 0, Math.PI * 2
        );
        ctx.fill();
      });

      // Draw nodes
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      nodes.forEach(node => {
        ctx.fillStyle = "#EDE8DE";
        ctx.strokeStyle = "rgba(26,22,18,0.4)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#3D3530";
        ctx.fillText(node.label, node.x, node.y - 14);
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
      className="hidden h-[600px] w-full md:block"
      style={{ touchAction: "none" }}
    />
  );
}
