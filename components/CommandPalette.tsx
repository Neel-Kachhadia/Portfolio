"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Command = {
  id: string;
  label: string;
  action: () => void;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: "projects", label: "projects", action: () => scrollTo("#work") },
    { id: "about", label: "about", action: () => scrollTo("#about") },
    { id: "contact", label: "contact", action: () => scrollTo("#contact") },
    { id: "neurofin", label: "neurofin", action: () => scrollToAndHighlight("#project-neurofin") },
    { id: "equity", label: "equity", action: () => scrollToAndHighlight("#project-equity") },
    { id: "mentora", label: "mentora", action: () => scrollToAndHighlight("#project-mentora") },
    { id: "github", label: "github", action: () => window.open("https://github.com/Neel-Kachhadia", "_blank") },
    { id: "linkedin", label: "linkedin", action: () => window.open("https://linkedin.com/in/neelkachhadia", "_blank") },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.includes(query.toLowerCase())
  );

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const scrollToAndHighlight = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const button = el.querySelector("button");
      if (button) {
         // Optionally trigger the click if we want to expand it
         // button.click();
         el.classList.add("bg-paper");
         setTimeout(() => {
           el.classList.remove("bg-paper");
         }, 1500);
      }
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    
    const handleCustomOpen = () => {
       setIsOpen(true);
    };

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", handleCustomOpen);
    
    return () => {
       document.removeEventListener("keydown", down);
       window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]">
           {/* Backdrop */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setIsOpen(false)}
             className="absolute inset-0 bg-ink/40 backdrop-blur-sm" 
           />

           {/* Palette */}
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 0.15 }}
             className="relative w-full max-w-lg overflow-hidden border border-electric bg-ink shadow-[0_0_40px_rgba(74,255,145,0.12)] font-mono md:w-[600px]"
             style={{ width: 'calc(100% - 32px)' }}
           >
             <div className="flex items-center border-b border-white/10 px-4">
                <span className="text-electric mr-2">/</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent py-4 text-cream outline-none placeholder:text-stone"
                  spellCheck={false}
                />
             </div>
             
             <div className="max-h-[300px] overflow-y-auto px-2 py-2">
               {filteredCommands.length === 0 && (
                 <div className="px-4 py-6 text-center text-stone text-sm">
                   No commands found.
                 </div>
               )}
               {filteredCommands.map((cmd, i) => {
                 const isActive = i === selectedIndex;
                 return (
                   <div
                     key={cmd.id}
                     onMouseEnter={() => setSelectedIndex(i)}
                     onClick={() => cmd.action()}
                     className={`flex cursor-pointer items-center justify-between px-4 py-3 text-sm transition-colors ${
                       isActive ? "bg-electric/10 text-electric border-l-2 border-electric" : "text-stone border-l-2 border-transparent hover:text-cream"
                     }`}
                   >
                     <span>{cmd.label}</span>
                     {isActive && <span className="text-xs opacity-50">&crarr;</span>}
                   </div>
                 );
               })}
             </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
