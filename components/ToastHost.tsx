"use client";

import { Toaster } from "sonner";

export default function ToastHost() {
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-none !border !border-ink/10 !bg-paper !font-mono !text-xs !text-ink !shadow-[0_18px_60px_rgba(26,22,18,0.16)]",
          description: "!text-stone",
          actionButton: "!bg-ink !text-cream",
          cancelButton: "!bg-cream !text-ink",
        },
      }}
    />
  );
}
