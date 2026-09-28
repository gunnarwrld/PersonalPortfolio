import { motion, AnimatePresence, type Variants } from "framer-motion";

const STEPS = 5;

// animate must be a function (for `custom` stagger) — Variants accepts
// resolver functions per key as long as the whole object is typed Variants.
const stairVariants: Variants = {
  initial: { scaleY: 1 },
  animate: (i: number) => ({
    scaleY: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.07,
      ease: [0.76, 0, 0.24, 1] as number[],
    },
  }),
  exit: { scaleY: 0 },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as number[] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as number[] },
  },
};

interface PagePreloaderProps {
  isVisible: boolean;
}

const PagePreloader = ({ isVisible }: PagePreloaderProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        key="preloader"
        className="fixed inset-0 z-[9999] flex pointer-events-none"
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {Array.from({ length: STEPS }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={stairVariants}
            className="flex-1 bg-foreground origin-bottom"
          />
        ))}

        <motion.span
          variants={labelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-[0.3em] uppercase text-background select-none"
        >
          gunnarwrld.com
        </motion.span>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PagePreloader;
