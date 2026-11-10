import { Fragment } from "react";
import { StarGlyph } from "@/components/StarGlyph";

interface RibbonProps {
  items: readonly string[];
}

/**
 * A printed ribbon of the stack. It never moves by itself; where the browser
 * supports scroll-driven animation it slides as the page scrolls past.
 * Decorative: the Skills section lists everything properly.
 */
const Ribbon = ({ items }: RibbonProps) => {
  // Repeated so the band is always wider than the screen, whatever its width.
  const run = [...items, ...items, ...items];
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon-track">
        {run.map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span>{item}</span>
            <StarGlyph />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Ribbon;
