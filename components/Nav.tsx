"use client";

import { useEffect, useState } from "react";
import { Command, Search } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 font-mono text-sm uppercase transition-all duration-300 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
      style={{
        background: scrolled
          ? "rgba(245,240,232,0.95)"
          : "rgba(245,240,232,0.7)",
      }}
    >
      <div className="flex items-center space-x-2 text-ink">
        <span className="font-semibold">NK</span>
        <span className="text-stone">/</span>
        <span className="text-stone">NEEL.OS</span>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <a
          href="#home"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          Start
        </a>
        <a
          href="#work"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          Work
        </a>
        <a
          href="#about"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          Record
        </a>
        <a
          href="#contact"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          Signal
        </a>
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2 border border-ink/10 bg-paper px-3 py-1.5 text-ink transition-colors hover:border-electric"
          aria-label="Open Command Palette"
        >
          <Search className="h-3.5 w-3.5 text-stone" aria-hidden="true" />
          <span className="text-xs">K</span>
          <Command className="h-3.5 w-3.5 text-stone" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
