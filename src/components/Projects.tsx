import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/projects";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@/data/projects";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <motion.div style={{ x: headingX, opacity: headingOpacity }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-3">03 — Work</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-12">
              Featured Projects
            </h2>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardReveal}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
              className="glass rounded-xl overflow-hidden group cursor-pointer hover:border-foreground/20 transition-all duration-500 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setSelected(project)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${project.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(project);
                }
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      {project.title}
                      <motion.span
                        className="inline-block text-muted-foreground"
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                      >
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                      </motion.span>
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {project.subtitle}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {project.timeline}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] px-2 py-0">
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3.5 w-3.5 mr-1.5" />
                        Code
                      </a>
                    </Button>
                  )}
                  {project.live && (
                    <Button
                      size="sm"
                      className="rounded-full"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Projects;
