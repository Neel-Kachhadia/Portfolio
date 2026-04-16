import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CommandPalette from "@/components/CommandPalette";
import Chat from "@/components/Chat";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <CommandPalette />
      
      <main className="flex min-h-screen flex-col items-center w-full max-w-[1400px] mx-auto overflow-hidden">
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Contact />
      </main>
      
      <Chat />
    </>
  );
}
