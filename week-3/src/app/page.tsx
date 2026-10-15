import Hero from "component/sections/Hero";
import About from "component/sections/About";
import Contact from "component/sections/Contact";

export default function Home() {
  return (
    <main id="konten" className="mx-auto max-w-6xl px-4 py-8 space-y-12">
      <Hero />
      <About />
      <Contact />
    </main>
  );
}
