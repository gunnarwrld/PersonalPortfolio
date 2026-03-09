import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import FloatingOrbs from "@/components/FloatingOrbs";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const textReveal = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1, delay: i * 0.15, ease },
  }),
};

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), { stiffness: 50, damping: 20 });
  const subtitleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -50]), { stiffness: 50, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ perspective: "1000px" }}>
      <FloatingOrbs />

      <motion.div style={{ opacity }} className="relative container mx-auto px-4 text-center">
        <motion.div style={{ y: subtitleY }}>
          <div className="overflow-hidden">
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textReveal}
              className="text-muted-foreground font-mono text-xs sm:text-sm mb-6 tracking-[0.3em] uppercase"
            >
              Full-Stack Developer
            </motion.p>
          </div>
        </motion.div>

        <motion.div style={{ y: titleY }}>
          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textReveal}
              className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-2 leading-[0.9]"
            >
              Hi, I'm
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textReveal}
              className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-8 leading-[0.9] text-gradient"
            >
              Gunnar
            </motion.h1>
          </div>
        </motion.div>

        <motion.div style={{ y: subtitleY }}>
          <div className="overflow-hidden">
            <motion.p
              custom={3}
              initial="hidden"
              animate="visible"
              variants={textReveal}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
            >
              CS student based in Sweden, building modern web applications with
              React, TypeScript, and cloud technologies.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="rounded-full px-8 group" asChild>
              <a href="#projects">
                <span>View Projects</span>
                <motion.span
                  className="inline-block ml-1"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <a href="https://github.com/gunnarwrld" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
