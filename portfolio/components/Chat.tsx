"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterPills = [
  "What stack does Neel use?",
  "Tell me about NeuroFin",
  "Is Neel open to internships?",
  "What's his strongest skill?",
];

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const newMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMsg] }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No body in response");

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
             role: "assistant", 
             content: updated[lastIndex].content + chunk
          };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Error connecting to systems. Try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <button
         onClick={() => setIsOpen(true)}
         className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${isOpen ? "opacity-0 pointer-events-none" : "bg-ink text-cream hover:bg-electric hover:text-ink shadow-lg"}`}
      >
         <span className="flex items-center gap-2">
            ASK NEEL <span className="text-current font-serif italic text-sm">↗</span>
         </span>
         <span className="animate-pulse w-1.5 h-3.5 bg-current ml-1" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
         {isOpen && (
            <motion.div
               initial={{ opacity: 0, y: "100%" }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: "100%" }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               className="fixed bottom-0 right-0 z-50 flex h-[80vh] w-full flex-col bg-ink md:bottom-6 md:right-6 md:h-[600px] md:w-[400px] md:border md:border-ink-light"
            >
               {/* Header */}
               <div className="flex items-center justify-between border-b border-ink-light px-4 py-4 font-mono text-[11px] text-stone">
                  <span>{"// SYSTEM INTERFACE"}</span>
                  <button onClick={() => setIsOpen(false)} className="hover:text-cream text-xl leading-none">
                     &times;
                  </button>
               </div>

               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                  {messages.length === 0 ? (
                     <div className="flex h-full flex-col justify-end">
                        <span className="mb-4 text-xs text-stone">SUGGESTED QUERIES_</span>
                        <div className="flex flex-col gap-2">
                           {starterPills.map((pill, i) => (
                              <button 
                                key={i}
                                onClick={() => handleSubmit(pill)}
                                className="w-fit text-left border border-ink-light px-3 py-2 text-xs text-cream hover:border-electric hover:text-electric transition-colors"
                              >
                                {pill}
                              </button>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col gap-6">
                        {messages.map((msg, i) => (
                           <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                              <span className="mb-1 text-[10px] text-stone">
                                 {msg.role === "user" ? "USER_" : "SYS_"}
                              </span>
                              <div className={`w-fit max-w-[85%] whitespace-pre-wrap ${msg.role === "user" ? "bg-cream text-ink px-3 py-2" : "text-cream"}`}>
                                 {msg.content}
                              </div>
                           </div>
                        ))}
                        {isLoading && (
                           <div className="flex flex-col items-start">
                              <span className="mb-1 text-[10px] text-stone">SYS_</span>
                              <span className="animate-pulse text-electric">Generating...</span>
                           </div>
                        )}
                        <div ref={messagesEndRef} />
                     </div>
                  )}
               </div>

               {/* Input Area */}
               <div className="border-t border-ink-light p-4">
                  <form 
                     onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }}
                     className="flex items-center gap-2"
                  >
                     <span className="text-electric">&gt;</span>
                     <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Query system..."
                        className="w-full bg-transparent font-mono text-xs text-cream outline-none placeholder:text-stone"
                        spellCheck={false}
                     />
                  </form>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </>
  );
}
