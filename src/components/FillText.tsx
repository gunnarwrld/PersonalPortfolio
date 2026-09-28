import { useEffect, useState } from "react";

interface FillTextProps {
  text: string;
  /** Tailwind class forwarded to the wrapping element for font sizing */
  className?: string;
  /** Delay in ms before the fill sweep begins */
  delay?: number;
  /** Duration in ms for the sweep */
  duration?: number;
}

/**
 * Renders `text` as an SVG <text> element.
 * On mount (after `delay` ms) a clipPath sweeps left-to-right, revealing
 * a solid-fill copy of the text beneath the outlined stroke version.
 * No external dependencies — pure SVG + CSS transition.
 */
const FillText = ({
  text,
  className = "",
  delay = 1000,
  duration = 1100,
}: FillTextProps) => {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  // We need a unique id so multiple instances don't share the same clipPath
  const clipId = `fill-clip-${text.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <span
      className={`inline-block relative select-none ${className}`}
      aria-label={text}
      style={{ lineHeight: 1 }}
    >
      {/*
       * The SVG dimensions are set via em units so the element behaves like
       * inline text and inherits the parent font-size perfectly.
       * viewBox height 1.1em gives comfortable descender room.
       */}
      <svg
        aria-hidden="true"
        overflow="visible"
        style={{
          display: "block",
          width: "100%",
          height: "1em",
          overflow: "visible",
        }}
        viewBox={`0 0 100 100`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id={clipId}>
            {/* This rect grows from 0% width to 100% width */}
            <rect
              x="0"
              y="-20"
              width={filled ? "100%" : "0%"}
              height="140%"
              style={{
                transition: filled
                  ? `width ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`
                  : "none",
              }}
            />
          </clipPath>
        </defs>

        {/* Outlined (stroke) layer — always visible */}
        <text
          x="50%"
          y="80%"
          textAnchor="middle"
          dominantBaseline="auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            fontSize: "inherit",
            fontFamily: "inherit",
            fontWeight: "inherit",
            letterSpacing: "inherit",
          }}
        >
          {text}
        </text>

        {/* Solid fill layer — revealed by the sweeping clipPath */}
        <text
          x="50%"
          y="80%"
          textAnchor="middle"
          dominantBaseline="auto"
          fill="currentColor"
          clipPath={`url(#${clipId})`}
          style={{
            fontSize: "inherit",
            fontFamily: "inherit",
            fontWeight: "inherit",
            letterSpacing: "inherit",
          }}
        >
          {text}
        </text>
      </svg>
    </span>
  );
};

export default FillText;
