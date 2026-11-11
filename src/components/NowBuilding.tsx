import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { githubSync } from "@/data/githubSyncData";
import { NOW_BUILDING } from "@/data/watchedRepos";
import { isNowBuildingFresh, type NowBuilding } from "@/lib/githubSync";
import { cn } from "@/lib/utils";

interface NowBuildingBubbleProps {
  /** The pick from the GitHub sync. Defaults to the committed sync file. */
  now?: NowBuilding | null;
  /** The visitor's date, for the freshness check. Tests pass a fixed one. */
  today?: Date;
  className?: string;
  style?: CSSProperties;
}

/**
 * The mascot in the nav bar says what Gunnar is building right now: the public
 * repo with no project card yet that the sync found the most work on. It links
 * to the repository, and hides itself once that repo has gone quiet.
 */
export function NowBuildingBubble({ now = githubSync.now, today = new Date(), className, style }: NowBuildingBubbleProps) {
  if (!isNowBuildingFresh(now, today, NOW_BUILDING.freshDays)) return null;

  return (
    <a
      href={now.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-tail="left"
      data-now-building=""
      className={cn("bubble bubble-nav group", className)}
      style={style}
    >
      {/* Two lines on a phone, one line from tablet width up. */}
      <span className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
        <span className="typed text-[0.72rem] font-bold leading-none text-russet sm:text-[0.78rem] sm:after:content-[':']">
          Now building
        </span>
        <span className="max-w-[9.5rem] truncate font-bold leading-tight decoration-2 underline-offset-2 group-hover:underline min-[400px]:max-w-[12rem] sm:max-w-[15rem]">
          {now.label}
        </span>
      </span>
      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span className="sr-only">, repository on GitHub</span>
    </a>
  );
}
