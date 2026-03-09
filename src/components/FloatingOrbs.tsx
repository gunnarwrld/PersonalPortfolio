import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const FloatingOrbs = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), { stiffness: 50, damping: 20 });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -250]), { stiffness: 50, damping: 20 });
  const y3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), { stiffness: 50, damping: 20 });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large orb top-left */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
      >
        <div className="w-full h-full rounded-full bg-foreground/[0.02] blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </motion.div>

      {/* Medium orb right */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full"
      >
        <div className="w-full h-full rounded-full bg-foreground/[0.03] blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]" />
      </motion.div>

      {/* Small orb bottom center */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-20 left-1/3 w-[300px] h-[300px] rounded-full"
      >
        <div className="w-full h-full rounded-full bg-foreground/[0.02] blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]" />
      </motion.div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default FloatingOrbs;
