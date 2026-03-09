import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
}

const Marquee = ({ items, speed = 25 }: MarqueeProps) => {
  const duplicated = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden py-8 border-y border-border/30">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-sm font-mono tracking-widest uppercase text-muted-foreground/40 select-none flex items-center gap-12"
          >
            {item}
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
