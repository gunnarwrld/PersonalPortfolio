import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ribbon from "@/components/Ribbon";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import { marqueeItems } from "@/data/skills";

// The contact form brings the form and validation libraries with it, so it
// loads as its own chunk. The placeholder keeps the #contact anchor working
// and holds the space until it arrives.
const Contact = lazy(() => import("@/components/Contact"));

const Index = () => {
  return (
    <div className="relative overflow-x-clip">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Ribbon items={marqueeItems} />
        <About />
        <Skills />
        <Projects />
        <Suspense fallback={<section id="contact" aria-label="Contact" className="min-h-[52rem]" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
