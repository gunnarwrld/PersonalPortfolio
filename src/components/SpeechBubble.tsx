import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
  children: ReactNode;
  /** Where the tail points: at a speaker on the left, above, or the hero layout (above on phones, left on desktop). */
  tail?: "left" | "up" | "hero";
  className?: string;
  style?: CSSProperties;
}

/** The mascot's line. Sentence case, one thought. */
export function SpeechBubble({ children, tail = "left", className, style }: SpeechBubbleProps) {
  return (
    <p className={cn("bubble", className)} data-tail={tail} style={style}>
      {children}
    </p>
  );
}
