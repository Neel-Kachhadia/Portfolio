import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
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

      <main className="flex w-full flex-col">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>

      <Chat />
    </>
  );
}
