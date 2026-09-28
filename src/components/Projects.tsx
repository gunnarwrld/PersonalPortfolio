import { useState, useRef, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/projects";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@/data/projects";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const SIDE_COUNT = 2;
const TOTAL = projects.length;
// Minimum horizontal drag distance (px) to register as a swipe
const SWIPE_THRESHOLD = 40;

function wrap(index: number) {
  return ((index % TOTAL) + TOTAL) % TOTAL;
}

function getSlot(index: number, active: number): number {
  let slot = index - active;
  if (slot > TOTAL / 2) slot -= TOTAL;
  if (slot < -TOTAL / 2) slot += TOTAL;
  return slot;
}

const cardVariants: Variants = {
  enter: { opacity: 0, scale: 0.82 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.82 },
};

const Projects = () => {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Track whether the pointer moved enough to be a swipe (not a click)
  const dragDeltaRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const prev = useCallback(() => setActive((a) => wrap(a - 1)), []);
  const next = useCallback(() => setActive((a) => wrap(a + 1)), []);

  // Global keyboard listener — active whenever the section is in the viewport
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Only hijack arrow keys when the projects section is roughly visible
      const section = sectionRef.current;
      if (!section) return;
      const { top, bottom } = section.getBoundingClientRect();
      const inView = top < window.innerHeight && bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prev, next]);

  // Drag / swipe handlers on the stage div
  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
      const dx = info.offset.x;
      dragDeltaRef.current = Math.abs(dx);
      if (dx < -SWIPE_THRESHOLD) next();
      else if (dx > SWIPE_THRESHOLD) prev();
    },
    [prev, next],
  );

  return (
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden mb-12">
          <motion.div style={{ x: headingX, opacity: headingOpacity }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-3">
              03 &#8212; Work
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Featured Projects
            </h2>
          </motion.div>
        </div>

        {/* Carousel stage — draggable */}
        <motion.div
          ref={stageRef}
          className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: "1200px", height: "420px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={handleDragEnd}
          // Prevent text selection while dragging
          onDragStart={() => { dragDeltaRef.current = 0; }}
        >
          {projects.map((project, i) => {
            const slot = getSlot(i, active);
            const absSlot = Math.abs(slot);

            if (absSlot > SIDE_COUNT) return null;

            const isActive = slot === 0;
            const xOffset = slot * 300;
            const zOffset = -absSlot * 120;
            const rotateY = slot * -18;
            const scale = isActive ? 1 : 1 - absSlot * 0.1;
            const opacity = isActive ? 1 : 1 - absSlot * 0.35;
            const zIndex = SIDE_COUNT - absSlot;

            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                initial="enter"
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY,
                  scale,
                  opacity,
                  transition: { duration: 0.55, ease },
                }}
                style={{ zIndex, position: "absolute", transformStyle: "preserve-3d" }}
                className="w-[320px] sm:w-[380px]"
                // Distinguish tap from drag: only open/focus if the drag delta was small
                onClick={() => {
                  if (dragDeltaRef.current > SWIPE_THRESHOLD) return;
                  if (isActive) setSelected(project);
                  else setActive(i);
                }}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`${isActive ? "View details for" : "Focus"} ${project.title}`}
                onKeyDown={(e) => {
                  if (isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setSelected(project);
                  }
                }}
              >
                <div
                  className={`glass rounded-xl overflow-hidden transition-all duration-500 ${
                    isActive
                      ? "border-foreground/20 shadow-2xl"
                      : "border-transparent"
                  }`}
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {project.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono">
                          {project.subtitle}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono shrink-0 ml-2">
                        {project.timeline}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.slice(0, 5).map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-[10px] px-2 py-0"
                        >
                          {t}
                        </Badge>
                      ))}
                      {project.tech.length > 5 && (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          +{project.tech.length - 5}
                        </Badge>
                      )}
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25 }}
                          className="flex gap-3"
                        >
                          {project.github && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
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
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={prev}
            aria-label="Previous project"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 h-2 bg-foreground"
                    : "w-2 h-2 bg-foreground/25 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            onClick={next}
            aria-label="Next project"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Projects;
