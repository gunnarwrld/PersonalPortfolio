import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { projects } from "../src/data/projects.ts";
import { GITHUB_OWNER, NOW_BUILDING, WATCHED_REPOS } from "../src/data/watchedRepos.ts";
import {
  nowBuildingCandidates,
  nowBuildingNeedsUpdate,
  parseRepository,
  parseSyncFile,
  pickNowBuilding,
  planSync,
  renderSyncReport,
  repoNamesOnSite,
  reposShownOnSite,
  serializeSyncFile,
  summarizeCommits,
  toRepoFacts,
  type GithubCommitApi,
  type GithubRepositoryApi,
  type GithubSyncFile,
  type RepoActivity,
} from "../src/lib/githubSync.ts";
import { GITHUB_API, fetchGithubJson, pickGithubToken } from "../src/lib/githubFetch.ts";

const DEFAULT_OUTPUT = "src/data/github-sync.json";
/** Most candidates whose commits are counted per run (newest pushes first). */
const MAX_ACTIVITY_LOOKUPS = 10;

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} needs a value`);
  }
  return value;
}

function asRepository(value: unknown, fullName: string): GithubRepositoryApi {
  if (typeof value !== "object" || value === null) {
    throw new Error(`GitHub repository payload for ${fullName} was not an object`);
  }
  return value as GithubRepositoryApi;
}

function asLanguages(value: unknown, fullName: string): Record<string, number> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`GitHub languages payload for ${fullName} was not an object`);
  }
  const languages: Record<string, number> = {};
  for (const [name, bytes] of Object.entries(value)) {
    if (typeof bytes !== "number") {
      throw new Error(`GitHub languages payload for ${fullName} has a non-numeric count`);
    }
    languages[name] = bytes;
  }
  return languages;
}

async function fetchFacts(fullName: string, onSite: boolean, token: string | undefined) {
  const { owner, name } = parseRepository(fullName, GITHUB_OWNER);
  const encoded = `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
  const [repository, languages] = await Promise.all([
    fetchGithubJson(`${GITHUB_API}/repos/${encoded}`, { token }),
    fetchGithubJson(`${GITHUB_API}/repos/${encoded}/languages`, { token }),
  ]);
  return toRepoFacts(asRepository(repository, fullName), asLanguages(languages, fullName), onSite);
}

function asList<T>(value: unknown, what: string): T[] {
  if (!Array.isArray(value)) throw new Error(`GitHub ${what} payload was not a list`);
  return value as T[];
}

/** The owner's public repos, newest push first. One page is enough: only the newest matter here. */
async function fetchOwnerRepos(token: string | undefined): Promise<GithubRepositoryApi[]> {
  const url = `${GITHUB_API}/users/${encodeURIComponent(GITHUB_OWNER)}/repos?type=owner&sort=pushed&direction=desc&per_page=100`;
  return asList<GithubRepositoryApi>(await fetchGithubJson(url, { token }), "repository list");
}

async function fetchActivity(fullName: string, since: string, token: string | undefined): Promise<RepoActivity> {
  const { owner, name } = parseRepository(fullName, GITHUB_OWNER);
  const url = `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/commits?since=${encodeURIComponent(since)}&per_page=100`;
  try {
    return summarizeCommits(asList<GithubCommitApi>(await fetchGithubJson(url, { token }), "commit list"));
  } catch (error) {
    // An empty repository answers 409. Count it as no activity rather than failing the sync.
    process.stderr.write(`activity for ${fullName} skipped: ${error instanceof Error ? error.message : String(error)}\n`);
    return { commits: 0, activeDays: 0 };
  }
}

function readPrevious(path: string): GithubSyncFile | null {
  if (!existsSync(path)) return null;
  return parseSyncFile(JSON.parse(readFileSync(path, "utf8")) as unknown);
}

function writeGithubOutput(changed: boolean, title: string) {
  const output = process.env.GITHUB_OUTPUT;
  if (!output) return;
  const marker = `SYNC_${Date.now()}`;
  appendFileSync(output, `changed=${changed ? "true" : "false"}\n`);
  appendFileSync(output, `title<<${marker}\n${title}\n${marker}\n`);
}

function readOptional(path: string | undefined): GithubSyncFile | undefined {
  if (!path || !existsSync(path)) return undefined;
  try {
    return parseSyncFile(JSON.parse(readFileSync(path, "utf8")) as unknown);
  } catch {
    return undefined;
  }
}

async function main() {
  // Public reads. SYNC_TOKEN (optional) is a token that can read the other
  // repositories. Without it the Actions GITHUB_TOKEN is tried, and any repo it
  // cannot see is re-read anonymously (see src/lib/githubFetch.ts). Do not use
  // PORTFOLIO_DISPATCH_TOKEN here: it is scoped to PersonalPortfolio only.
  const token = pickGithubToken(process.env);
  const requestedInput = argValue("--repo") || process.env.SYNC_REPOSITORY || "";
  const reportPath = argValue("--report");
  const outputPath = argValue("--output") || DEFAULT_OUTPUT;
  // The frequent check: publish only when the "Now building" repo changed (see the workflow).
  const onlyIfNowChanged = process.argv.includes("--only-if-now-changed");
  const pendingPath = argValue("--pending");
  const siteRepos = repoNamesOnSite(projects);
  const site = new Set(siteRepos);
  const requested = requestedInput.trim()
    ? [parseRepository(requestedInput, GITHUB_OWNER).fullName]
    : [];
  const targets =
    requested.length > 0 ? requested : WATCHED_REPOS.map((name) => `${GITHUB_OWNER}/${name}`);

  const fetched = await Promise.all(
    targets.map((fullName) => fetchFacts(fullName, site.has(fullName), token)),
  );

  // "Now building": the repo without a card that is being worked on most.
  const now = new Date().toISOString();
  const nowInput = {
    owner: GITHUB_OWNER,
    repositories: await fetchOwnerRepos(token),
    shownOnSite: reposShownOnSite(projects),
    config: NOW_BUILDING,
    now,
  };
  const since = new Date(Date.parse(now) - NOW_BUILDING.activityDays * 24 * 60 * 60 * 1000).toISOString();
  const lookups = nowBuildingCandidates(nowInput).slice(0, MAX_ACTIVITY_LOOKUPS);
  const activity = new Map(
    await Promise.all(
      lookups.map(async (repo) => [repo.full_name, await fetchActivity(repo.full_name, since, token)] as const),
    ),
  );
  const nowBuilding = pickNowBuilding({ ...nowInput, activity });

  const previous = readPrevious(outputPath);
  const plan = planSync({
    previous,
    owner: GITHUB_OWNER,
    watchList: WATCHED_REPOS,
    siteRepos,
    requestedFullNames: requested,
    fetched,
    now,
    nowBuilding,
    nowActivity: nowBuilding ? (activity.get(nowBuilding.fullName) ?? null) : null,
  });

  if (onlyIfNowChanged && plan.report.changed) {
    const pending = readOptional(pendingPath);
    if (!nowBuildingNeedsUpdate(plan.next.now ?? null, previous?.now, pending ? (pending.now ?? null) : undefined)) {
      // Facts changed but the bubble did not: leave those to the daily refresh.
      plan.report.changed = false;
    }
  }

  if (plan.report.changed) {
    writeFileSync(outputPath, serializeSyncFile(plan.next));
  }

  const markdown = renderSyncReport(plan.report);
  if (reportPath) {
    writeFileSync(reportPath, `${JSON.stringify(plan.report, null, 2)}\n`);
    const markdownPath = reportPath.replace(/\.json$/i, "") + ".md";
    writeFileSync(markdownPath, markdown);
  }

  writeGithubOutput(plan.report.changed, plan.report.title);
  process.stdout.write(`${plan.report.changed ? "changed" : "unchanged"} ${plan.report.title}\n`);
  if (plan.report.notOnSite.length > 0) {
    process.stdout.write(`not on the site yet: ${plan.report.notOnSite.join(", ")}\n`);
  }
  const pick = plan.report.nowBuilding.next;
  process.stdout.write(
    `now building: ${pick ? `${pick.label} (${pick.fullName})` : "none"}${plan.report.nowBuilding.changed ? " [changed]" : ""}\n`,
  );
  for (const [fullName, entry] of activity) {
    process.stdout.write(`  ${fullName}: ${entry.commits} commits on ${entry.activeDays} days\n`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
