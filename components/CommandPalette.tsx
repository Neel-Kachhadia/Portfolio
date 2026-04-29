"use client";

import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Mail,
  MessagesSquare,
  Moon,
  Navigation,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

const email = "neel1234kachhadia@gmail.com";

type PaletteCommand = {
  id: string;
  label: string;
  detail: string;
  keywords: string[];
  icon: LucideIcon;
  action: () => void;
};

type CommandGroup = {
  heading: string;
  commands: PaletteCommand[];
};

function fuzzyScore(value: string, search: string) {
  if (!search) return 1;

  const target = value.toLowerCase();
  const query = search.toLowerCase();

  if (target.includes(query)) return 1;

  let targetIndex = 0;
  let score = 0;

  for (const char of query) {
    const foundAt = target.indexOf(char, targetIndex);
    if (foundAt === -1) return 0;
    score += foundAt === targetIndex ? 1 : 0.65;
    targetIndex = foundAt + 1;
  }

  return score / query.length;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMotionEnabled, toggleMotion } = useMotionPreference();

  const scrollTo = (selector: string, block: ScrollLogicalPosition = "start") => {
    const element = document.querySelector(selector);
    element?.scrollIntoView({
      behavior: isMotionEnabled ? "smooth" : "auto",
      block,
    });
    setIsOpen(false);
  };

  const openProject = (slug: string) => {
    window.dispatchEvent(new CustomEvent("open-project", { detail: { slug } }));
    scrollTo(`#project-${slug}`, "center");
  };

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-ask-neel"));
    setIsOpen(false);
  };

  const openExternal = (url: string, label: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`${label} opened`);
    setIsOpen(false);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied", { description: email });
    } catch {
      toast.error("Could not access clipboard", { description: email });
    }
    setIsOpen(false);
  };

  const commandGroups = useMemo<CommandGroup[]>(
    () => [
      {
        heading: "Navigation",
        commands: [
          {
            id: "work",
            label: "Open work dossiers",
            detail: "Jump to engineering systems",
            keywords: ["projects", "portfolio", "case studies"],
            icon: BriefcaseBusiness,
            action: () => scrollTo("#work"),
          },
          {
            id: "capabilities",
            label: "Open capabilities map",
            detail: "Skills and intelligence layers",
            keywords: ["skills", "stack", "tools"],
            icon: Sparkles,
            action: () => scrollTo("#capabilities"),
          },
          {
            id: "about",
            label: "Open about timeline",
            detail: "Human system log",
            keywords: ["timeline", "bio", "story"],
            icon: UserRound,
            action: () => scrollTo("#about"),
          },
          {
            id: "contact",
            label: "Open contact",
            detail: "Final transmission",
            keywords: ["email", "reach", "hire"],
            icon: Navigation,
            action: () => scrollTo("#contact"),
          },
        ],
      },
      {
        heading: "Projects",
        commands: [
          {
            id: "neurofin",
            label: "Open NeuroFin dossier",
            detail: "12-agent financial intelligence",
            keywords: ["finance", "bedrock", "agents", "aws"],
            icon: BriefcaseBusiness,
            action: () => openProject("neurofin"),
          },
          {
            id: "equity",
            label: "Open Equity Research dossier",
            detail: "LangGraph market research system",
            keywords: ["equity", "stock", "langgraph"],
            icon: BriefcaseBusiness,
            action: () => openProject("equity"),
          },
          {
            id: "mentora",
            label: "Open Mentora dossier",
            detail: "Semantic mentor matching",
            keywords: ["mentor", "firebase", "embeddings"],
            icon: BriefcaseBusiness,
            action: () => openProject("mentora"),
          },
        ],
      },
      {
        heading: "Connect",
        commands: [
          {
            id: "email",
            label: "Copy email",
            detail: email,
            keywords: ["contact", "mail", "copy"],
            icon: Mail,
            action: copyEmail,
          },
          {
            id: "github",
            label: "Open GitHub",
            detail: "github.com/Neel-Kachhadia",
            keywords: ["code", "repo", "source"],
            icon: Code2,
            action: () =>
              openExternal("https://github.com/Neel-Kachhadia", "GitHub"),
          },
          {
            id: "linkedin",
            label: "Open LinkedIn",
            detail: "linkedin.com/in/neelkachhadia",
            keywords: ["profile", "work", "connect"],
            icon: ExternalLink,
            action: () =>
              openExternal("https://linkedin.com/in/neelkachhadia", "LinkedIn"),
          },
          {
            id: "ask-neel",
            label: "Open ASK NEEL",
            detail: "Terminal intelligence layer",
            keywords: ["chat", "assistant", "terminal"],
            icon: MessagesSquare,
            action: openChat,
          },
        ],
      },
      {
        heading: "System",
        commands: [
          {
            id: "motion",
            label: isMotionEnabled ? "Disable motion" : "Enable motion",
            detail: "Toggle animation system",
            keywords: ["reduced motion", "animations", "accessibility"],
            icon: Moon,
            action: () => {
              const enabled = toggleMotion();
              toast.success(enabled ? "Motion enabled" : "Motion reduced");
              setIsOpen(false);
            },
          },
        ],
      },
    ],
    [isMotionEnabled],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      label="Command palette"
      loop
      filter={(value, search, keywords) =>
        fuzzyScore([value, ...(keywords ?? [])].join(" "), search)
      }
      className="fixed inset-0 z-[9999] font-mono"
    >
      <div
        className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative mx-auto mt-[18vh] w-[calc(100%-2rem)] max-w-2xl border border-electric/70 bg-ink text-cream shadow-[0_24px_90px_rgba(26,22,18,0.35)]">
        <div className="flex items-center border-b border-cream/10 px-4">
          <span className="mr-2 text-electric">/</span>
          <Command.Input
            autoFocus
            placeholder="Search NEEL.OS..."
            className="w-full bg-transparent py-4 text-sm text-cream outline-none placeholder:text-stone"
          />
        </div>

        <Command.List className="max-h-[420px] overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-stone">
            No matching command.
          </Command.Empty>

          {commandGroups.map((group) => (
            <Command.Group
              key={group.heading}
              heading={group.heading}
              className="pb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-stone"
            >
              {group.commands.map((item) => {
                const Icon = item.icon;

                return (
                  <Command.Item
                    key={item.id}
                    value={item.label}
                    keywords={item.keywords}
                    onSelect={item.action}
                    className="flex cursor-pointer items-center gap-3 border-l-2 border-transparent px-3 py-3 text-sm text-stone outline-none transition-colors data-[selected=true]:border-electric data-[selected=true]:bg-electric/10 data-[selected=true]:text-cream"
                  >
                    <Icon className="h-4 w-4 text-electric" aria-hidden="true" />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate text-cream">{item.label}</span>
                      <span className="truncate text-[11px] text-stone">
                        {item.detail}
                      </span>
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
