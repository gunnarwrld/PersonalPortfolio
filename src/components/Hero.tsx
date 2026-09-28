import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import FloatingOrbs from "@/components/FloatingOrbs";
import MotionPathOrb from "@/components/MotionPathOrb";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const textReveal: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1, delay: i * 0.15, ease },
  }),
};

// SVG stroke draw via CSS custom properties — no external deps, works in jsdom
const SvgSignature = () => {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDrawn(true), 900);
    return () => clearTimeout(id);
  }, []);

  return (
    <svg
      aria-hidden="true"
      className="absolute left-1/2 -translate-x-1/2 top-[58%] w-[420px] sm:w-[560px] lg:w-[680px] pointer-events-none select-none"
      viewBox="0 0 680 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 20 60 C 80 10, 140 70, 200 40 S 320 10, 380 50 S 500 80, 560 30 S 640 60, 660 45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/30"
        fill="none"
        style={{
          strokeDasharray: 1200,
          strokeDashoffset: drawn ? 0 : 1200,
          transition: drawn ? "stroke-dashoffset 1.6s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        }}
      />
    </svg>
  );
};

const Hero = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const titleY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -100]),
    { stiffness: 50, damping: 20 },
  );
  const subtitleY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -50]),
    { stiffness: 50, damping: 20 },
  );
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <FloatingOrbs />
      <MotionPathOrb rx={380} ry={130} cx={50} cy={48} duration={22} size={72} opacity="opacity-[0.06]" />

      <SvgSignature />

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
              Hi, I&#39;m
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
                  &#8594;
                </motion.span>
              </a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <a
                href="https://github.com/gunnarwrld"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
