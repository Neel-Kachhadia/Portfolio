"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCommandPalette = () => {
    // We'll dispatch a custom event that the CommandPalette component will listen to
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 font-mono text-sm uppercase transition-all duration-300 ${
        scrolled ? "backdrop-blur-md" : ""
      }`}
      style={{ background: scrolled ? 'rgba(245,240,232,0.95)' : 'rgba(245,240,232,0.7)' }}
    >
      <div className="flex items-center space-x-2 text-ink">
        <span className="font-semibold">NK</span>
        <span className="text-stone">/</span>
        <span className="text-stone">PORTFOLIO</span>
      </div>

      <div className="flex items-center space-x-6">
        <a
          href="#work"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          WORK
        </a>
        <a
          href="#about"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          ABOUT
        </a>
        <a
          href="#contact"
          className="hidden text-stone transition-colors hover:text-ink md:block"
        >
          CONTACT
        </a>
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-ink transition-colors hover:border-ink/30"
          aria-label="Open Command Palette"
        >
          <span className="text-xs">⌘K</span>
        </button>
      </div>
    </nav>
  );
}
