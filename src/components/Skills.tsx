import { motion, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { skillGroups } from "@/data/skills";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
};

const badgeReveal = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const Skills = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section id="skills" ref={sectionRef} className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <motion.div style={{ x: headingX, opacity: headingOpacity }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-3">02 — Skills</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-12">
              Skills & Tech
            </h2>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.category}
              variants={cardReveal}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
