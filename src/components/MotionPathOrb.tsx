import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";

// Parametric elliptical path: returns {x, y} for t in [0, 1]
function evalPath(t: number, rx: number, ry: number, cx: number, cy: number) {
  const angle = t * 2 * Math.PI;
  return {
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
  };
}

interface MotionPathOrbProps {
  /** Horizontal radius of the ellipse in px */
  rx?: number;
  /** Vertical radius of the ellipse in px */
  ry?: number;
  /** Centre of the ellipse as % of container (0-100) */
  cx?: number;
  cy?: number;
  /** Duration of one full loop in seconds */
  duration?: number;
  /** Orb size in px */
  size?: number;
  /** Tailwind opacity class e.g. "opacity-30" */
  opacity?: string;
}

const MotionPathOrb = ({
  rx = 340,
  ry = 120,
  cx = 50,
  cy = 50,
  duration = 18,
  size = 80,
  opacity = "opacity-20",
}: MotionPathOrbProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Convert % centre to absolute px on first paint and on resize
  const cxPx = useRef(0);
  const cyPx = useRef(0);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current?.parentElement;
      if (!el) return;
      cxPx.current = (cx / 100) * el.clientWidth;
      cyPx.current = (cy / 100) * el.clientHeight;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [cx, cy]);

  useAnimationFrame((time) => {
    const progress = (time / 1000 / duration) % 1;
    t.set(progress);
    const pos = evalPath(progress, rx, ry, cxPx.current, cyPx.current);
    x.set(pos.x - size / 2);
    y.set(pos.y - size / 2);
  });

  // Subtle scale pulse synced to path position (peaks at top of ellipse)
  const scale = useTransform(t, [0, 0.25, 0.5, 0.75, 1], [1, 1.15, 1, 0.9, 1]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          x,
          y,
          scale,
          width: size,
          height: size,
        }}
        className={`rounded-full bg-foreground blur-2xl ${opacity}`}
      />
    </div>
  );
};

export default MotionPathOrb;
