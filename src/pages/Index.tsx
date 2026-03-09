import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Marquee from "@/components/Marquee";
import SectionDivider from "@/components/SectionDivider";
import { Toaster } from "@/components/ui/toaster";

const techItems = [
  "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL",
  "Python", "Docker", "AWS", "Supabase", "Git", "REST APIs", "AI/ML",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee items={techItems} speed={30} />
      <About />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Contact />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
