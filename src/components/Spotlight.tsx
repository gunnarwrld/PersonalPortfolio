/**
 * The amber light the star stands in. Hard-edged, like a cut block: a beam from
 * above, a solid pool on the floor, and the star's shadow in it. The pool is
 * what lets the black cap and sneakers read against the dark stage.
 *
 * The drawing is twice as tall as the mascot box; the lower half lines up with it.
 */
export function Spotlight() {
  return (
    <svg className="spotlight" viewBox="0 0 480 1186" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="beam-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.7" fill="rgb(var(--amber))" />
        </pattern>
      </defs>
      <g className="beam">
        <polygon points="196,0 284,0 500,1168 -20,1168" fill="rgb(var(--amber))" fillOpacity="0.2" />
        <polygon points="196,0 284,0 500,1168 -20,1168" fill="url(#beam-dots)" fillOpacity="0.5" />
        <path d="M196 0 L-20 1168 M284 0 L500 1168" stroke="rgb(var(--amber))" strokeWidth="3" fill="none" />
      </g>
      <ellipse className="pool" cx="240" cy="1168" rx="262" ry="34" fill="rgb(var(--amber))" />
      <ellipse cx="262" cy="1171" rx="150" ry="13" fill="rgb(var(--espresso))" fillOpacity="0.9" />
    </svg>
  );
}
