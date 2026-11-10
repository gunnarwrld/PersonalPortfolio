import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Intrinsic size of the sticker files in public/mascot (estrella-480.*). */
const STICKER = { width: 480, height: 593 };

interface MascotProps {
  /** Describe the mascot where it is content (the hero); leave empty where it is decoration. */
  alt?: string;
  /** The hero image: load now, at high priority. */
  priority?: boolean;
  /** Rendered width, for the browser to pick the right file. */
  sizes?: string;
  className?: string;
}

/** The star, as an ivory-edged sticker. */
export function Mascot({ alt = "", priority = false, sizes = "(min-width: 1024px) 26rem, 62vw", className }: MascotProps) {
  return (
    <picture>
      <source type="image/avif" srcSet="/mascot/estrella-480.avif 480w, /mascot/estrella-960.avif 960w" sizes={sizes} />
      <source type="image/webp" srcSet="/mascot/estrella-480.webp 480w, /mascot/estrella-960.webp 960w" sizes={sizes} />
      <img
        src="/mascot/estrella-480.webp"
        alt={alt}
        width={STICKER.width}
        height={STICKER.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        draggable={false}
        className={cn("h-auto w-full select-none", className)}
        // React 18 does not know the camel-cased prop yet; the lowercase attribute passes straight through.
        {...(priority ? { fetchpriority: "high" } : {})}
      />
    </picture>
  );
}

interface MascotBadgeProps {
  /** Rendered size in CSS pixels. */
  size?: number;
  alt?: string;
  /** Above the fold (the nav logo): do not lazy-load. */
  eager?: boolean;
  className?: string;
}

/** The logo: the star's head in a disc of amber light. */
export function MascotBadge({ size = 44, alt = "", eager = false, className }: MascotBadgeProps) {
  return (
    <img
      src="/mascot/badge-96.webp"
      srcSet="/mascot/badge-96.webp 1x, /mascot/badge-192.webp 2x"
      alt={alt}
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={cn("shrink-0 select-none rounded-full", className)}
    />
  );
}

export type MascotMove = "idle" | "enter" | "hello" | "celebrate" | "oops";

/** One-shot moves and how long they run, from the movement library. */
const ONE_SHOT_MS: Partial<Record<MascotMove, number>> = { enter: 900, hello: 2000, celebrate: 2200, oops: 2600 };

interface MascotRigProps {
  /** Which move to play. The keyframes are in src/styles/mascot-moves.css. */
  move?: MascotMove;
  /** Called when a one-shot move (enter, hello, celebrate, oops) has finished. */
  onDone?: () => void;
  /** Seconds to wait before the "enter" move starts. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Plays a move on whatever it wraps: squash and stretch around the feet.
 * A tap or click adds a quick squish on top of the current move.
 */
export function MascotRig({ move = "idle", onDone, delay, className, children }: MascotRigProps) {
  const pokeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ms = ONE_SHOT_MS[move];
    if (!ms || !onDone) return;
    const wait = move === "enter" ? (delay ?? 0) * 1000 : 0;
    const id = window.setTimeout(onDone, wait + ms);
    return () => window.clearTimeout(id);
  }, [move, onDone, delay]);

  const poke = () => {
    const el = pokeRef.current;
    if (!el) return;
    // Restart the squish even if one is still playing.
    el.removeAttribute("data-poke");
    void el.offsetWidth;
    el.setAttribute("data-poke", "");
  };

  return (
    <span
      className={cn("mascot-rig", className)}
      data-move={move}
      style={delay ? ({ "--mascot-delay": `${delay}s` } as CSSProperties) : undefined}
      onPointerDown={poke}
    >
      <span ref={pokeRef} className="mascot-poke" onAnimationEnd={(event) => event.currentTarget.removeAttribute("data-poke")}>
        {children}
      </span>
    </span>
  );
}

const CONFETTI_COLOURS = ["bg-ivory", "bg-tangerine", "bg-amber", "bg-parchment"];

// Fixed pseudo-random spread, so every burst (and any future server render) is identical.
const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  return {
    x: side * (1.6 + ((i * 37) % 55) / 10),
    peak: -(3.4 + ((i * 53) % 42) / 10),
    fall: 2.2 + ((i * 29) % 40) / 10,
    spin: side * (200 + ((i * 71) % 400)),
    delay: ((i * 7) % 6) * 0.025,
    colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
  };
});

/** A burst of paper bits from the star. Mount it for a real win only (a message sent). */
export function Confetti() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {CONFETTI.map((bit, i) => (
        <span
          key={i}
          className={cn("confetti-bit", bit.colour)}
          style={
            {
              "--x": `${bit.x}rem`,
              "--peak": `${bit.peak}rem`,
              "--fall": `${bit.fall}rem`,
              "--spin": `${bit.spin}deg`,
              "--d": `${bit.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
