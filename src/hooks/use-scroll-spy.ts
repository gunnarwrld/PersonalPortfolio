import { useEffect, useState } from "react";

interface ScrollSpy {
  /** The page has moved away from the very top. */
  scrolled: boolean;
  /** Id of the section currently under the reading line, if any. */
  active: string | null;
  /** The last section the reading line was in. Unlike `active`, it stays set in the gaps between sections. */
  last: string | null;
}

/**
 * Follows the scroll position for the nav bar. Sections are looked up by id on
 * every read, so it keeps working when a lazily loaded section mounts later.
 * `sectionIds` must be a stable array (a module constant).
 */
export function useScrollSpy(sectionIds: readonly string[]): ScrollSpy {
  const [state, setState] = useState<ScrollSpy>({ scrolled: false, active: null, last: null });

  useEffect(() => {
    let frame = 0;
    let last: string | null = null;

    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.38;
      let active: string | null = null;
      for (const id of sectionIds) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= line && rect.bottom > line) {
          active = id;
          break;
        }
      }
      if (active) last = active;
      const scrolled = window.scrollY > 24;
      setState((prev) =>
        prev.scrolled === scrolled && prev.active === active && prev.last === last ? prev : { scrolled, active, last },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionIds]);

  return state;
}
