import { cn } from "@/lib/utils";

/** A small spiky star in the current text colour: the mascot's shape, used as a separator and bullet. */
export function StarGlyph({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("inline-block h-[0.7em] w-[0.7em] shrink-0", className)}>
      <path
        fill="currentColor"
        d="M12 0l2.3 7.2L20.5 3.5l-3.7 6.2L24 12l-7.2 2.3 3.7 6.2-6.2-3.7L12 24l-2.3-7.2-6.2 3.7 3.7-6.2L0 12l7.2-2.3L3.5 3.5l6.2 3.7z"
      />
    </svg>
  );
}
