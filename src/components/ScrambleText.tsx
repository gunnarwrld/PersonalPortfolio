import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
const SCRAMBLE_DURATION = 600; // ms to fully resolve each character
const HOLD_MS = 2200;          // how long the resolved text sits before cycling

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface ScrambleTextProps {
  words: string[];
  className?: string;
}

const ScrambleText = ({ words, className = "" }: ScrambleTextProps) => {
  const [display, setDisplay] = useState(words[0]);
  const wordIndex = useRef(0);
  const rafRef = useRef<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const scrambleTo = (target: string) => {
      const start = performance.now();
      const charDelay = SCRAMBLE_DURATION / target.length;

      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - start;
        // How many chars have resolved so far
        const resolved = Math.min(
          Math.floor(elapsed / charDelay),
          target.length,
        );

        const chars = target
          .split("")
          .map((ch, i) => (i < resolved ? ch : randomChar()))
          .join("");

        setDisplay(chars);

        if (resolved < target.length) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          // Fully resolved — hold, then cycle
          holdTimer.current = setTimeout(() => {
            if (cancelled) return;
            wordIndex.current = (wordIndex.current + 1) % words.length;
            scrambleTo(words[wordIndex.current]);
          }, HOLD_MS);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    // Kick off after the hero text has finished revealing
    holdTimer.current = setTimeout(() => scrambleTo(words[0]), 1600);

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (holdTimer.current !== null) clearTimeout(holdTimer.current);
    };
  }, [words]);

  return <span className={className}>{display}</span>;
};

export default ScrambleText;
