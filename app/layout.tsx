import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import ToastHost from "@/components/ToastHost";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neel Kachhadia - AI Systems Engineer",
  description: "AI Systems Engineer · Mumbai, India. Building systems that reason, adapt, and scale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased selection:bg-electric selection:text-ink"
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <ToastHost />
      </body>
    </html>
  );
}
