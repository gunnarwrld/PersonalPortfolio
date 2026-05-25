import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, GraduationCap, Rocket, Code2 } from "lucide-react";
import { useRef } from "react";

const stats = [
  { icon: Rocket, label: "Projects Shipped", value: "5+" },
  { icon: Code2, label: "Backend Focus", value: "Node / TS" },
  { icon: GraduationCap, label: "CS Student", value: "2nd Year" },
  { icon: MapPin, label: "Based in", value: "Sweden" },
];

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemReveal = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40, rotateY: -10 },
  visible: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.7, ease } },
};

const About = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingX = useTransform(scrollYProgress, [0, 0.3], [-80, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden">
          <motion.div style={{ x: headingX, opacity: headingOpacity }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground mb-3">01 — About</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-12">
              About Me
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-5"
          >
            {[
              "Backend-leaning full-stack developer and Computer Science student based in Kristianstad, Sweden. I build production-ready REST APIs, serverless systems, and AI-powered applications — five live projects shipped, each with real users, real deployments, and tested codebases.",
              "Most recently I led the backend for a sports union platform: architected a PostgreSQL schema with Prisma ORM, secured the API with a 4-tier JWT + RBAC system, and built the full Vitest + Supertest integration suite from zero before the first production deploy. I\'m as comfortable reasoning about a Prisma migration failure in a Railway CI pipeline as I am crafting a Framer Motion spring animation.",
              "Outside of coursework I follow edge computing and AI inference closely — the AI Study Assistant I shipped runs Llama 3.3 (70B) at sub-50ms latency across 300+ Cloudflare edge locations. If there\'s a new Workers primitive or a model I haven\'t run yet, I\'m already reading the docs.",
            ].map((text, i) => (
              <motion.p key={i} variants={itemReveal} className="text-muted-foreground leading-relaxed">
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid gap-4"
            style={{ perspective: "800px" }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={cardReveal}
                whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
                className="glass rounded-xl p-5 flex items-center gap-4 hover:border-foreground/20 transition-colors duration-300 cursor-default"
              >
                <motion.div
                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-foreground/5 text-foreground"
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="h-6 w-6" />
                </motion.div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
