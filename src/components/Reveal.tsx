import { createElement, useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealTag = "div" | "section" | "article" | "header" | "li";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  /** Milliseconds to wait after the element scrolls into view. */
  delay?: number;
  children: ReactNode;
}

// One observer for every revealed element on the page.
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.inked = "";
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
  }
  return observer;
}

/**
 * "Prints" its content once, when it scrolls into view (the wipe is in
 * src/index.css, under .reveal). Without scripts, or with reduced motion,
 * the content is simply visible.
 */
export function Reveal({ as = "div", delay = 0, className, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    if (!io) {
      el.dataset.inked = "";
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const withDelay = delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style;
  return createElement(as, { ref, className: cn("reveal", className), style: withDelay, ...rest }, children);
}
