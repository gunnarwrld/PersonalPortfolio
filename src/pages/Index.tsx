import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Marquee from "@/components/Marquee";
import SectionDivider from "@/components/SectionDivider";
import { Toaster } from "@/components/ui/toaster";

// Lazy-load below-fold sections to reduce initial JS bundle.
// These components won't be parsed/executed until they scroll into view.
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const Projects = lazy(() => import("@/components/Projects"));
const Contact = lazy(() => import("@/components/Contact"));

const techItems = [
  "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL",
  "Python", "Docker", "AWS", "Supabase", "Git", "REST APIs", "AI/ML",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomCursor />
      <Navbar />
      <main>
      <Hero />
      <Marquee items={techItems} speed={30} />
      <Suspense fallback={null}>
        <About />
      </Suspense>
      <SectionDivider />
      <Suspense fallback={null}>
        <Skills />
      </Suspense>
      <SectionDivider />
      <Suspense fallback={null}>
        <Projects />
      </Suspense>
      <SectionDivider />
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
