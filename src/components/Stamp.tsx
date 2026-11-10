import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StampProps {
  children: ReactNode;
  /** "solid" is an inked block (used for Live); "line" is an outlined stamp. */
  tone?: "solid" | "line";
  className?: string;
}

/** A rubber stamp for a project's status. */
export function Stamp({ children, tone = "line", className }: StampProps) {
  return (
    <span className={cn("stamp", className)} data-tone={tone}>
      {children}
    </span>
  );
}
