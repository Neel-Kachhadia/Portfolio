"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { MessageSquareText, Send, Terminal, X } from "lucide-react";
import { useMotionPreference } from "@/components/useMotionPreference";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterPills = [
  "What stack does Neel use?",
  "Tell me about NeuroFin",
  "Is Neel open to internships?",
  "What makes this portfolio different?",
];

function localResponse(input: string) {
  const prompt = input.toLowerCase();

  if (/(hello|hi|hey|online|start)/.test(prompt)) {
    return "System online. Ask me about Neel's stack, projects, or availability.";
  }

  if (prompt.includes("neurofin")) {
    return "NeuroFin is Neel's 12-agent financial intelligence platform: deterministic routing, specialist Python agents, Redis memory, Amazon Nova through Bedrock, anomaly detection, cash-flow forecasting, and explainable personal finance actions.";
  }

  if (prompt.includes("equity") || prompt.includes("research")) {
    return "The Equity Research Platform routes live market context through LangGraph, serves it through FastAPI, and turns the output into a React dashboard for explainable investment recommendations.";
  }

  if (prompt.includes("mentora") || prompt.includes("mentor")) {
    return "Mentora uses OpenAI embeddings to match mentors and mentees by goals, level, and semantic compatibility, then connects them through Firebase realtime chat.";
  }

  if (prompt.includes("stack") || prompt.includes("tools") || prompt.includes("skills")) {
    return "Neel's stack centers on Python, TypeScript, React, FastAPI, Node.js, LangGraph, OpenAI APIs, Amazon Bedrock, Redis, Firebase, and AWS services across EC2, S3, Lambda, SNS, Cognito, and DocumentDB.";
  }

  if (prompt.includes("intern") || prompt.includes("available") || prompt.includes("hire")) {
    return "Availability signal: open to AI engineering internships, systems work, and collaborations that need both engineering depth and interface taste. Contact: neel1234kachhadia@gmail.com.";
  }

  if (prompt.includes("different") || prompt.includes("portfolio") || prompt.includes("design")) {
    return "This portfolio is built like a personal operating system: a routed reasoning field, archive-style project dossiers, a live proof map, command navigation, and a final transmission interaction.";
  }

  if (prompt.includes("contact") || prompt.includes("email")) {
    return "Contact route: neel1234kachhadia@gmail.com. GitHub: github.com/Neel-Kachhadia. LinkedIn: linkedin.com/in/neelkachhadia.";
  }

  return "Local cache has data on Neel's projects, stack, availability, and contact routes. Ask about NeuroFin, Equity Research, Mentora, or his AI systems work.";
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { isMotionEnabled } = useMotionPreference();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-ask-neel", handleOpen);
    return () => window.removeEventListener("open-ask-neel", handleOpen);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: isMotionEnabled ? "smooth" : "auto",
    });
  }, [messages, isLoading, isMotionEnabled]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Remote intelligence unavailable");
      }

      let received = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        received += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            role: "assistant",
            content: updated[lastIndex].content + chunk,
          };
          return updated;
        });
      }

      if (!received.trim()) {
        throw new Error("Empty remote response");
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;

      toast.message("ASK NEEL switched to local cache");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: localResponse(userMessage.content) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 border border-ink bg-ink px-4 py-3 font-mono text-[11px] font-bold uppercase text-cream shadow-[0_18px_50px_rgba(26,22,18,0.22)] transition-colors hover:bg-electric hover:text-ink ${
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-label="Open ASK NEEL terminal"
      >
        <MessageSquareText className="h-4 w-4" aria-hidden="true" />
        ASK NEEL
        <span className="h-3.5 w-1 animate-pulse bg-current" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="ASK NEEL terminal intelligence layer"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={
              isMotionEnabled
                ? { type: "spring", stiffness: 320, damping: 34 }
                : { duration: 0 }
            }
            className="fixed inset-x-0 bottom-0 z-50 flex h-[82vh] flex-col border-t border-cream/15 bg-ink text-cream shadow-[0_-24px_80px_rgba(26,22,18,0.32)] md:inset-auto md:bottom-6 md:right-6 md:h-[620px] md:w-[420px] md:border"
          >
            <div className="flex items-center justify-between border-b border-cream/10 px-4 py-4 font-mono text-[11px] uppercase text-stone">
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-electric" aria-hidden="true" />
                ASK_NEEL / LOCAL+REMOTE
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-stone transition-colors hover:text-cream"
                aria-label="Close ASK NEEL"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-cream/10 px-4 py-2 font-mono text-[10px] uppercase text-stone">
              <span>STATUS: ONLINE</span>
              <span>FALLBACK: LOCAL CACHE</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col justify-end">
                  <p className="mb-5 max-w-[18rem] text-xs leading-relaxed text-stone">
                    Terminal layer for Neel&apos;s projects, stack, availability,
                    and system architecture.
                  </p>
                  <span className="mb-3 text-[10px] uppercase text-stone">
                    Suggested queries
                  </span>
                  <div className="flex flex-col gap-2">
                    {starterPills.map((pill) => (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => handleSubmit(pill)}
                        className="w-fit border border-cream/15 px-3 py-2 text-left text-xs text-cream transition-colors hover:border-electric hover:text-electric"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex flex-col ${
                        message.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="mb-1 text-[10px] uppercase text-stone">
                        {message.role === "user" ? "USER" : "NEEL.OS"}
                      </span>
                      <div
                        className={`w-fit max-w-[88%] whitespace-pre-wrap leading-relaxed ${
                          message.role === "user"
                            ? "bg-cream px-3 py-2 text-ink"
                            : "text-cream"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex flex-col items-start">
                      <span className="mb-1 text-[10px] uppercase text-stone">
                        NEEL.OS
                      </span>
                      <span className="animate-pulse text-electric">
                        resolving signal...
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(input);
              }}
              className="flex items-center gap-3 border-t border-cream/10 p-4"
            >
              <span className="text-electric">&gt;</span>
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Query system..."
                className="w-full bg-transparent font-mono text-xs text-cream outline-none placeholder:text-stone"
                spellCheck={false}
                aria-label="Ask Neel a question"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="text-stone transition-colors hover:text-electric disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
