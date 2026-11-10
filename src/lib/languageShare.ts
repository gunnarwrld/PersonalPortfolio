import type { LanguageShare } from "@/lib/githubSync";

/**
 * At most four parts: the three biggest languages keep their names and the
 * rest fold into "Other". (Exactly four languages are all shown.)
 */
export function summarizeLanguages(languages: readonly LanguageShare[], keep = 3): LanguageShare[] {
  const sorted = languages.filter((language) => language.percentage > 0).sort((a, b) => b.percentage - a.percentage);
  if (sorted.length <= keep + 1) return sorted;
  const rest = sorted.slice(keep).reduce((sum, language) => sum + language.percentage, 0);
  return [...sorted.slice(0, keep), { name: "Other", percentage: Math.round(rest * 10) / 10 }];
}

export const formatShare = (percentage: number) => `${Number.isInteger(percentage) ? percentage : percentage.toFixed(1)}%`;
