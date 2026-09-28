import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;   // depth 0 (back) → 1 (front)
  vx: number;
  vy: number;
  r: number;
}

const STAR_COUNT = 120;
const REPEL_RADIUS = 120;   // px — mouse repulsion field
const REPEL_FORCE = 0.45;
const MAX_SPEED = 0.6;

function makeStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const z = Math.random();
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      z,
      vx: (Math.random() - 0.5) * 0.3 * (0.3 + z * 0.7),
      vy: (Math.random() - 0.5) * 0.3 * (0.3 + z * 0.7),
      r: 0.6 + z * 1.8,
    };
  });
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      starsRef.current = makeStars(canvas.offsetWidth, canvas.offsetHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = null;
    };
    canvas.parentElement?.addEventListener("mousemove", onMouseMove);
    canvas.parentElement?.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;

      for (const s of starsRef.current) {
        // Mouse repulsion
        if (mouse) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
        }

        // Dampen & clamp velocity
        s.vx *= 0.97;
        s.vy *= 0.97;
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (speed > MAX_SPEED) {
          s.vx = (s.vx / speed) * MAX_SPEED;
          s.vy = (s.vy / speed) * MAX_SPEED;
        }

        s.x += s.vx;
        s.y += s.vy;

        // Wrap around edges
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        // Opacity scales with depth
        const alpha = 0.15 + s.z * 0.55;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default StarField;
