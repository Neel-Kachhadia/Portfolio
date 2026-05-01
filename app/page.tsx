import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import IdentityReveal from "@/components/IdentityReveal";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Capabilities from "@/components/Capabilities";
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

      <main className="flex w-full flex-col">
        <Hero />
        <IdentityReveal />
        <Marquee />
        <Projects />
        <Capabilities />
        <About />
        <Contact />
      </main>

      <Chat />
    </>
  );
}
