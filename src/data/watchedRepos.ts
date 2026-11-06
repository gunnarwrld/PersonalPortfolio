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
