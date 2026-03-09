import { motion } from "framer-motion";

const SectionDivider = () => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="container mx-auto px-4"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent origin-left" />
    </motion.div>
  );
};

export default SectionDivider;
