/** GitHub account whose public project repos feed the portfolio sync. */
export const GITHUB_OWNER = "gunnarwrld";

/**
 * Public, non-fork repositories the daily sweep refreshes.
 * A repository stays off the site until a project in `projects.ts` sets `repo`.
 * Names are case-sensitive and match GitHub's canonical `name` field.
 */
export const WATCHED_REPOS = [
  "futbol_data_aggregator_api",
  "ledger-api",
  "clicky-recurring-runs",
  "personal-finance-web-app",
  "smart-home-gitops",
  "matchday-hub",
  "forge-wallet-android",
  "ledger-sentinel-ai",
  "fair-football-fee",
  "cf_ai_study_assistant",
  "PostHub-DynamicWebsite",
  "lab01_fullstack",
] as const;

export type WatchedRepo = (typeof WATCHED_REPOS)[number];

export interface NowBuildingConfig {
  /** Days of commits counted when ranking repos by how much they are being worked on. */
  activityDays: number;
  /** A repo stops being a candidate, and the bubble hides, after this many days without a push. */
  freshDays: number;
  /** Set to a repo name to always show it, whatever the ranking says. */
  pin: string | null;
  /** Repos the bubble never shows. Forks, archived repos and the profile README are always left out. */
  exclude: readonly string[];
  /** Display names for repos whose GitHub name reads badly in the bubble. */
  labels: Readonly<Record<string, string>>;
}

/**
 * The "Now building" bubble in the nav bar. The sync picks the public repo with
 * no project card yet that had commits on the most days in the last two weeks
 * (then the most commits, then the latest push), so it follows what is really
 * being worked on, not a one-off push. When every active repo already has a
 * card, it picks the most active one of those and the bubble links to its card.
 */
export const NOW_BUILDING: NowBuildingConfig = {
  activityDays: 14,
  freshDays: 30,
  pin: null,
  // The site itself (the sync commits to it every day), plus course labs and early
  // exercises: real work, but not what the bubble should advertise.
  exclude: ["PersonalPortfolio", "CalculatorProyect1", "lab01_fullstack"],
  labels: {
    "forge-wallet-android": "Forge Wallet",
  },
};
