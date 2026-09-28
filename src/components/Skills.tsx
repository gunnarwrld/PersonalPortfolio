import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { skillGroups } from "@/data/skills";
import { useRef } from "react";

const COLS = 3;

// Manhattan distance from centre cell index in a COLS-wide grid
function rippleDelay(index: number, total: number, baseMs: number): number {
  const rows = Math.ceil(total / COLS);
  const centerRow = (rows - 1) / 2;
  const centerCol = (COLS - 1) / 2;
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  return dist * baseMs;
}

const badgeReveal: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={sectionRef} className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <motion.div style={{ x: headingX, opacity: headingOpacity }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-3">
              02 &#8212; Skills
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-12">
              Skills &amp; Tech
            </h2>
          </motion.div>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, scale: 0.88, y: 28 }}
              animate={
                gridInView
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.88, y: 28 }
              }
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: rippleDelay(i, skillGroups.length, 90) / 1000,
              }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="glass rounded-xl p-6 hover:border-foreground/20 transition-colors duration-300"
            >
              <h3 className="text-xs font-semibold text-muted-foreground font-mono uppercase tracking-wider mb-4">
                {group.category}
              </h3>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.04 } },
                }}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
