import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState, useCallback } from "react";
import StarField from "@/components/StarField";
import MotionPathOrb from "@/components/MotionPathOrb";
import ScrambleText from "@/components/ScrambleText";
import FillText from "@/components/FillText";

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

const ROLES = [
  "Full-Stack Developer",
  "Backend Engineer",
  "TypeScript Dev",
  "Open Source Builder",
];

// SVG stroke draw via CSS strokeDashoffset — no external deps, works in jsdom
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
          transition: drawn
            ? "stroke-dashoffset 1.6s cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
        }}
      />
    </svg>
  );
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Tilt state — updated on mousemove, reset on mouseleave
  const tiltX = useSpring(0, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 60, damping: 18 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Normalise cursor position to [-1, 1] relative to section centre
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      // rotateY: positive nx → tilt right; rotateX: positive ny → tilt down
      tiltY.set(nx * 10);
      tiltX.set(-ny * 6);
    },
    [tiltX, tiltY],
  );

  const handleMouseLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
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
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Background layer */}
      <StarField />
      <MotionPathOrb
        rx={380}
        ry={130}
        cx={50}
        cy={48}
        duration={22}
        size={72}
        opacity="opacity-[0.06]"
      />

      <SvgSignature />

      <motion.div style={{ opacity }} className="relative container mx-auto px-4 text-center">
        {/* Subtitle — scramble loop */}
        <motion.div style={{ y: subtitleY }}>
          <div className="overflow-hidden mb-6">
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textReveal}
              className="text-muted-foreground font-mono text-xs sm:text-sm tracking-[0.3em] uppercase"
            >
              <ScrambleText words={ROLES} />
            </motion.p>
          </div>
        </motion.div>

        {/* Title block — 3-D mouse tilt */}
        <motion.div
          style={{
            y: titleY,
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle light plane that shifts with tilt */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(var(--foreground)/0.04) 0%, transparent 70%)",
              rotateX: useTransform(tiltX, (v) => -v * 0.4),
              rotateY: useTransform(tiltY, (v) => -v * 0.4),
            }}
          />

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

          {/* SVG fill-sweep on name */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textReveal}
            className="mb-8"
          >
            <FillText
              text="Gunnar"
              delay={1200}
              duration={1100}
              className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9]"
            />
          </motion.div>
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
