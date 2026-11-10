import type { LanguageShare } from "@/lib/githubSync";
import { formatShare, summarizeLanguages } from "@/lib/languageShare";

interface LanguageBarProps {
  languages: readonly LanguageShare[];
}

/**
 * A repo's language split from the GitHub sync: a thin segmented bar with the
 * figures printed beside it. One ink, so the parts differ by tone (solid, two
 * hatches, a flat mid tone) and each list row carries its own swatch.
 */
export function LanguageBar({ languages }: LanguageBarProps) {
  const parts = summarizeLanguages(languages);
  if (parts.length === 0) return null;

  return (
    <div>
      {/* The list below says everything the bar shows, so the bar is hidden from assistive tech. */}
      <div className="lang-bar" aria-hidden="true">
        {parts.map((part, slot) => (
          <span
            key={part.name}
            className="lang-seg"
            data-slot={slot}
            style={{ flexGrow: part.percentage, flexBasis: 0 }}
            title={`${part.name} ${formatShare(part.percentage)}`}
          />
        ))}
      </div>
      <ul className="typed mt-2.5 flex flex-wrap gap-x-4 gap-y-1" aria-label="Languages">
        {parts.map((part, slot) => (
          <li key={part.name} className="flex items-center gap-1.5">
            <span className="lang-swatch" data-slot={slot} aria-hidden="true" />
            <span>{part.name}</span>
            <span>{formatShare(part.percentage)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
