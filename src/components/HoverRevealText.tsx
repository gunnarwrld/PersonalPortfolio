import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * HoverRevealText
 * ---------------
 * Inspired by opos.buzzworthystudio.com/directors (referenced by Skiper UI skiper6).
 *
 * Each character slides up (default state) and back down (hovered state) with a
 * staggered delay, creating the classic letter-cascade reveal.
 * A circular cursor follower tracks the mouse within the element.
 *
 * No external deps beyond Framer Motion.
 */

const SPRING = { stiffness: 500, damping: 35, mass: 0.5 };

interface HoverRevealTextProps {
  text: string;
  className?: string;
  /** Framer Motion variant class applied to non-space chars */
  as?: "h1" | "h2" | "span";
  /** Delay increment between letters (ms). Default 22 */
  staggerMs?: number;
}

const HoverRevealText = ({
  text,
  className = "",
  as: Tag = "h1",
  staggerMs = 22,
}: HoverRevealTextProps) => {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // Cursor follower
  const cx = useSpring(-80, SPRING);
  const cy = useSpring(-80, SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    cx.set(e.clientX - rect.left);
    cy.set(e.clientY - rect.top);
  };

  const chars = text.split("");

  return (
    <Tag
      // @ts-expect-error — polymorphic ref
      ref={containerRef}
      className={`relative inline-block overflow-hidden select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      aria-label={text}
    >
      {/* Cursor follower dot */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full z-10"
        style={{
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
          top: 0,
          left: 0,
          x: cx,
          y: cy,
          backgroundColor: "hsl(var(--foreground))",
          opacity: hovered ? 0.55 : 0,
          transition: "opacity 0.2s",
          mixBlendMode: "difference",
        }}
      />

      {/* Letter layers — two stacked copies: resting (top) and revealed (bottom) */}
      <span aria-hidden="true" className="relative flex">
        {chars.map((char, i) => {
          const delay = i * staggerMs;
          return (
            <span key={i} className="relative inline-block overflow-hidden">
              {/* Top copy — slides up and fades on hover */}
              <motion.span
                className="block"
                animate={{
                  y: hovered ? "-110%" : "0%",
                  opacity: hovered ? 0 : 1,
                }}
                transition={{
                  duration: 0.38,
                  delay: delay / 1000,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{ whiteSpace: "pre" }}
              >
                {char}
              </motion.span>

              {/* Bottom copy — slides up into view on hover */}
              <motion.span
                className="absolute inset-0 block"
                animate={{
                  y: hovered ? "0%" : "110%",
                  opacity: hovered ? 1 : 0,
                }}
                transition={{
                  duration: 0.38,
                  delay: delay / 1000,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{
                  whiteSpace: "pre",
                  // Revealed copy gets the gradient
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary, 210 100% 60%)) 100%)",
                  backgroundClip: "text",
                }}
              >
                {char}
              </motion.span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
};

export default HoverRevealText;
