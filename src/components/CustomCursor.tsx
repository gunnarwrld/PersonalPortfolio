import { useEffect, useRef, useState } from "react";

/**
 * Awwwards-style custom cursor:
 *   • Small dot (4 px) — follows pointer exactly, no lag
 *   • Larger ring (36 px) — trails with spring easing via rAF lerp
 *   • On hover over [data-cursor="pointer"] or any a/button/[role=button]:
 *       ring grows to 64 px, opacity drops, mix-blend-mode difference
 *       creates the classic "highlight engulf" effect
 *   • Hides native cursor site-wide via global CSS injected once
 *   • Fully pointer-events: none — never blocks clicks
 *   • Tears down cleanly in useEffect return
 */

const RING_LERP = 0.12;          // 0-1, lower = more lag
const RING_DEFAULT = 36;
const RING_HOVER = 64;
const RING_LINK = 48;

type CursorState = "default" | "hover" | "link";

// Interactive selectors that trigger the hover morph
const HOVER_SELECTORS = [
  "a",
  "button",
  "[role=\"button\"]",
  "[data-cursor=\"pointer\"]",
  "input",
  "textarea",
  "label",
  "select",
].join(",");

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const state = useRef<CursorState>("default");
  const rafRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hide the native cursor globally
    const style = document.createElement("style");
    style.id = "custom-cursor-hide";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Detect hover state
      const target = e.target as Element;
      const isInteractive = !!target.closest(HOVER_SELECTORS);
      const isLink = !!target.closest("a");
      const next: CursorState = isInteractive
        ? isLink
          ? "link"
          : "hover"
        : "default";
      state.current = next;
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // rAF loop — lerp ring toward dot position
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * RING_LERP;
      ring.current.y += (pos.current.y - ring.current.y) * RING_LERP;

      const dot = dotRef.current;
      const ringEl = ringRef.current;

      if (dot) {
        dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      if (ringEl) {
        const s = state.current;
        const targetSize =
          s === "hover" ? RING_HOVER : s === "link" ? RING_LINK : RING_DEFAULT;
        const half = targetSize / 2;

        ringEl.style.transform = `translate(${ring.current.x - half}px, ${ring.current.y - half}px)`;
        ringEl.style.width = `${targetSize}px`;
        ringEl.style.height = `${targetSize}px`;
        ringEl.style.opacity = s === "hover" ? "0.55" : "0.75";
        ringEl.style.mixBlendMode = s !== "default" ? "difference" : "normal";
        ringEl.style.borderColor =
          s === "link"
            ? "hsl(var(--primary, 210 100% 56%))"
            : "hsl(var(--foreground)";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.getElementById("custom-cursor-hide")?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Never render on touch devices — they have no mouse
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "hsl(var(--foreground))",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s",
          transform: "translate(-200px,-200px)",
          // Centre on hotspot
          marginLeft: -3,
          marginTop: -3,
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_DEFAULT,
          height: RING_DEFAULT,
          borderRadius: "50%",
          border: "1.5px solid hsl(var(--foreground))",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: visible ? 0.75 : 0,
          transition:
            "opacity 0.2s, width 0.25s cubic-bezier(0.25,0.46,0.45,0.94), height 0.25s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.2s",
          transform: "translate(-200px,-200px)",
          willChange: "transform, width, height",
        }}
      />
    </>
  );
};

export default CustomCursor;
