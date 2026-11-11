import { Fragment, useEffect, useRef } from "react";
import { StarGlyph } from "@/components/StarGlyph";

interface RibbonProps {
  items: readonly string[];
}

/**
 * A printed ribbon of the stack that runs continuously, right to left.
 *
 * The track holds two identical groups and slides left by exactly one group,
 * so the loop has no seam. Only `transform` is animated (see .ribbon-track in
 * src/index.css), which the browser runs off the main thread. The animation
 * pauses while the ribbon is off screen, under the pointer, or when the
 * visitor prefers reduced motion.
 *
 * Decorative: the Skills section lists everything properly.
 */
const Ribbon = ({ items }: RibbonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Stop the animation while the ribbon is out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Each group lists the items twice, so one group alone is wider than any screen.
  const group = [...items, ...items];

  return (
    <div ref={ref} className="ribbon" aria-hidden="true">
      <div className="ribbon-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="ribbon-group">
            {group.map((item, i) => (
              <Fragment key={`${item}-${i}`}>
                <span>{item}</span>
                <StarGlyph />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ribbon;
