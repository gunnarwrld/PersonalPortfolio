import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { skillGroups } from "@/data/skills";
import { useRef, useEffect } from "react";
import { animate, stagger } from "animejs";

const badgeReveal: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Center-outward stagger ripple via Anime.js when grid enters viewport
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".skill-card"));
    cards.forEach((c) => {
      c.style.opacity = "0";
      c.style.transform = "scale(0.88) translateY(28px)";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          // Named export animate(), stagger() - v4 API (no default export)
          animate(cards, {
            opacity: [0, 1],
            translateY: [28, 0],
            scale: [0.88, 1],
            duration: 600,
            ease: "outExpo",
            delay: stagger(80, {
              grid: [3, Math.ceil(cards.length / 3)],
              from: "center",
            }),
          });
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <motion.div style={{ x: headingX, opacity: headingOpacity }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-3">02 - Skills</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-12">
              Skills &amp; Tech
            </h2>
          </motion.div>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="skill-card glass rounded-xl p-6 hover:border-foreground/20 transition-colors duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xs font-semibold text-muted-foreground font-mono uppercase tracking-wider mb-4">
                {group.category}
              </h3>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                className="flex flex-wrap gap-2"
              >
                {group.skills.map((skill) => (
                  <motion.div key={skill} variants={badgeReveal}>
                    <Badge
                      variant="secondary"
                      className="text-xs hover:bg-foreground/10 transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
