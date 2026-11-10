import type { Project } from "@/data/projects";

/** Rolling branch the sync workflow updates. Never the default branch. */
export const SYNC_BRANCH = "github-sync";

export const SYNC_BASE_BRANCH = "main";

export const SYNC_EVENT_TYPE = "project-updated";

const REPO_PART = /^[A-Za-z0-9._-]+$/;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export interface LanguageShare {
  name: string;
  /** Tenths of a percent. Shares for one repo sum to 100. */
  percentage: number;
}

export interface GithubRepoFacts {
  name: string;
  fullName: string;
  description: string | null;
  topics: string[];
  primaryLanguage: string | null;
  languages: LanguageShare[];
  homepage: string | null;
  defaultBranch: string;
  pushedAt: string;
  archived: boolean;
  stars: number;
  fork: boolean;
  htmlUrl: string;
  onSite: boolean;
}

export interface GithubSyncFile {
  generatedAt: string;
  owner: string;
  repos: Record<string, GithubRepoFacts>;
}

export interface GithubRepositoryApi {
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  default_branch: string;
  pushed_at: string;
  archived: boolean;
  stargazers_count: number;
  fork: boolean;
  topics?: string[];
  language: string | null;
  html_url: string;
  private?: boolean;
}

export interface ResolvedProject extends Project {
  languages: LanguageShare[];
  lastUpdated: string | null;
  lastUpdatedLabel: string | null;
  archived: boolean;
  stars: number | null;
  topics: string[];
  synced: boolean;
  /** Card chips: GitHub languages when linguist reported any, otherwise the hand-written stack. */
  stack: string[];
}

export interface RepoChange {
  fullName: string;
  onSite: boolean;
  fork: boolean;
  kind: "added" | "updated" | "removed";
  changes: string[];
}

export interface SyncReport {
  changed: boolean;
  generatedAt: string;
  title: string;
  updated: RepoChange[];
  removed: RepoChange[];
  /** Public non-fork repos in this diff that have no project card. */
  notOnSite: string[];
}

export interface SyncPlanInput {
  previous: GithubSyncFile | null;
  owner: string;
  /** Repo names (not full names) refreshed on a full sweep. */
  watchList: readonly string[];
  /** Full names (`owner/name`) of projects that already have cards. */
  siteRepos: readonly string[];
  /**
   * Full names to refresh. An empty list refreshes the watch list and
   * drops repositories that are no longer on it.
   */
  requestedFullNames: readonly string[];
  fetched: readonly GithubRepoFacts[];
  now: string;
}

export function compareNames(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function parseRepository(
  input: string,
  defaultOwner: string,
): { owner: string; name: string; fullName: string } {
  const trimmed = input.trim();
  if (!trimmed || /[\s\\]/.test(trimmed) || trimmed.includes("..")) {
    throw new Error(`Invalid repository: ${input}`);
  }
  const parts = trimmed.split("/");
  const owner = parts.length === 1 ? defaultOwner : parts[0];
  const name = parts.length === 1 ? parts[0] : parts[1];
  if (
    parts.length > 2 ||
    !owner ||
    !name ||
    !REPO_PART.test(owner) ||
    !REPO_PART.test(name) ||
    owner.startsWith(".") ||
    name.startsWith(".")
  ) {
    throw new Error(`Invalid repository: ${input}`);
  }
  return { owner, name, fullName: `${owner}/${name}` };
}

export function repoNamesOnSite(projects: readonly Pick<Project, "repo">[]): string[] {
  const names = projects.flatMap((project) => (project.repo ? [project.repo] : []));
  return [...new Set(names)].sort(compareNames);
}

/** Largest-remainder rounding to one decimal so the shares sum to 100. */
export function languageBreakdown(bytes: Record<string, number>): LanguageShare[] {
  const entries = Object.entries(bytes).filter(
    ([, value]) => typeof value === "number" && Number.isFinite(value) && value > 0,
  );
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  if (total <= 0) return [];

  const shares = entries.map(([name, value]) => {
    const tenths = (value * 1000) / total;
    const floored = Math.floor(tenths + 1e-8);
    return { name, value, floored, frac: tenths - floored };
  });

  let remainder = 1000 - shares.reduce((sum, share) => sum + share.floored, 0);
  const byRemainder = [...shares].sort(
    (a, b) => b.frac - a.frac || b.value - a.value || compareNames(a.name, b.name),
  );
  for (const share of byRemainder) {
    if (remainder <= 0) break;
    share.floored += 1;
    remainder -= 1;
  }

  return shares
    .map((share) => ({ name: share.name, percentage: share.floored / 10 }))
    .sort((a, b) => b.percentage - a.percentage || compareNames(a.name, b.name));
}

function blankToNull(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function toRepoFacts(
  repository: GithubRepositoryApi,
  languageBytes: Record<string, number>,
  onSite: boolean,
): GithubRepoFacts {
  if (repository.private) {
    throw new Error(`Refusing to record private repository ${repository.full_name}`);
  }
  if (!repository.full_name || !repository.name || !repository.html_url) {
    throw new Error("GitHub repository payload is missing name or html_url");
  }
  if (typeof repository.default_branch !== "string" || typeof repository.pushed_at !== "string") {
    throw new Error(`GitHub repository payload for ${repository.full_name} is missing branch or push time`);
  }
  if (typeof repository.stargazers_count !== "number") {
    throw new Error(`GitHub repository payload for ${repository.full_name} is missing star count`);
  }
  const topics = [...new Set((repository.topics ?? []).filter((topic) => topic.trim()))].sort(
    compareNames,
  );
  return {
    name: repository.name,
    fullName: repository.full_name,
    description: blankToNull(repository.description),
    topics,
    primaryLanguage: blankToNull(repository.language),
    languages: languageBreakdown(languageBytes),
    homepage: blankToNull(repository.homepage),
    defaultBranch: repository.default_branch,
    pushedAt: repository.pushed_at,
    archived: Boolean(repository.archived),
    stars: repository.stargazers_count,
    fork: Boolean(repository.fork),
    htmlUrl: repository.html_url,
    onSite,
  };
}

function orderFacts(facts: GithubRepoFacts): GithubRepoFacts {
  return {
    name: facts.name,
    fullName: facts.fullName,
    description: facts.description,
    topics: facts.topics,
    primaryLanguage: facts.primaryLanguage,
    languages: facts.languages,
    homepage: facts.homepage,
    defaultBranch: facts.defaultBranch,
    pushedAt: facts.pushedAt,
    archived: facts.archived,
    stars: facts.stars,
    fork: facts.fork,
    htmlUrl: facts.htmlUrl,
    onSite: facts.onSite,
  };
}

export function stableSnapshot(file: GithubSyncFile): string {
  const repos = Object.fromEntries(
    Object.keys(file.repos)
      .sort(compareNames)
      .map((key) => [key, orderFacts(file.repos[key])]),
  );
  return JSON.stringify({ owner: file.owner, repos });
}

export function serializeSyncFile(file: GithubSyncFile): string {
  const repos = Object.fromEntries(
    Object.keys(file.repos)
      .sort(compareNames)
      .map((key) => [key, orderFacts(file.repos[key])]),
  );
  return `${JSON.stringify({ generatedAt: file.generatedAt, owner: file.owner, repos }, null, 2)}\n`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFacts(value: unknown, key: string): GithubRepoFacts {
  if (!isRecord(value)) throw new Error(`github-sync repo ${key} is not an object`);
  const languages = Array.isArray(value.languages)
    ? value.languages.map((language) => {
        if (!isRecord(language) || typeof language.name !== "string") {
          throw new Error(`github-sync repo ${key} has a bad language entry`);
        }
        return {
          name: language.name,
          percentage: Number(language.percentage),
        };
      })
    : [];
  if (typeof value.fullName !== "string" || typeof value.htmlUrl !== "string") {
    throw new Error(`github-sync repo ${key} is missing fullName or htmlUrl`);
  }
  return orderFacts({
    name: String(value.name ?? key),
    fullName: value.fullName,
    description: typeof value.description === "string" ? value.description : null,
    topics: Array.isArray(value.topics) ? value.topics.filter((topic) => typeof topic === "string") : [],
    primaryLanguage: typeof value.primaryLanguage === "string" ? value.primaryLanguage : null,
    languages,
    homepage: typeof value.homepage === "string" ? value.homepage : null,
    defaultBranch: typeof value.defaultBranch === "string" ? value.defaultBranch : "main",
    pushedAt: typeof value.pushedAt === "string" ? value.pushedAt : "",
    archived: Boolean(value.archived),
    stars: typeof value.stars === "number" ? value.stars : 0,
    fork: Boolean(value.fork),
    htmlUrl: value.htmlUrl,
    onSite: Boolean(value.onSite),
  });
}

export function parseSyncFile(value: unknown): GithubSyncFile {
  if (!isRecord(value) || !isRecord(value.repos) || typeof value.owner !== "string") {
    throw new Error("github-sync.json is missing owner or repos");
  }
  const repos: Record<string, GithubRepoFacts> = {};
  for (const key of Object.keys(value.repos).sort(compareNames)) {
    repos[key] = readFacts(value.repos[key], key);
  }
  return {
    generatedAt: typeof value.generatedAt === "string" ? value.generatedAt : "",
    owner: value.owner,
    repos,
  };
}

function withOnSite(facts: GithubRepoFacts, siteRepos: ReadonlySet<string>): GithubRepoFacts {
  const onSite = siteRepos.has(facts.fullName);
  return facts.onSite === onSite ? facts : { ...facts, onSite };
}

function describeChanges(previous: GithubRepoFacts | undefined, next: GithubRepoFacts): string[] {
  if (!previous) return ["added to the sync file"];
  const changes: string[] = [];
  if (previous.description !== next.description) {
    changes.push("description");
  }
  if (JSON.stringify(previous.topics) !== JSON.stringify(next.topics)) {
    changes.push(`topics ${previous.topics.join(", ") || "∅"} → ${next.topics.join(", ") || "∅"}`);
  }
  if (JSON.stringify(previous.languages) !== JSON.stringify(next.languages)) {
    const format = (languages: LanguageShare[]) =>
      languages.map((language) => `${language.name} ${language.percentage}%`).join(", ") || "∅";
    changes.push(`languages ${format(previous.languages)} → ${format(next.languages)}`);
  }
  if (previous.primaryLanguage !== next.primaryLanguage) {
    changes.push(`primary language ${previous.primaryLanguage ?? "∅"} → ${next.primaryLanguage ?? "∅"}`);
  }
  if (previous.homepage !== next.homepage) {
    changes.push(`homepage ${previous.homepage ?? "∅"} → ${next.homepage ?? "∅"}`);
  }
  if (previous.defaultBranch !== next.defaultBranch) {
    changes.push(`default branch ${previous.defaultBranch} → ${next.defaultBranch}`);
  }
  if (previous.pushedAt !== next.pushedAt) {
    changes.push(`last push ${previous.pushedAt} → ${next.pushedAt}`);
  }
  if (previous.archived !== next.archived) {
    changes.push(`archived ${previous.archived} → ${next.archived}`);
  }
  if (previous.stars !== next.stars) {
    changes.push(`stars ${previous.stars} → ${next.stars}`);
  }
  if (previous.fork !== next.fork) {
    changes.push(`fork ${previous.fork} → ${next.fork}`);
  }
  if (previous.htmlUrl !== next.htmlUrl) {
    changes.push(`repo url ${previous.htmlUrl} → ${next.htmlUrl}`);
  }
  if (previous.onSite !== next.onSite) {
    changes.push(`on the site ${previous.onSite} → ${next.onSite}`);
  }
  return changes;
}

export function syncPullRequestTitle(updated: RepoChange[], removed: RepoChange[]): string {
  const changes = [...updated, ...removed];
  if (changes.length === 1) return `chore(data): refresh ${changes[0].fullName}`;
  return "chore(data): refresh GitHub project facts";
}

export function planSync(input: SyncPlanInput): { next: GithubSyncFile; report: SyncReport } {
  const siteRepos = new Set(input.siteRepos);
  const fullSweep = input.requestedFullNames.length === 0;
  const targets = fullSweep
    ? input.watchList.map((name) => `${input.owner}/${name}`)
    : [...input.requestedFullNames];

  const fetchedByName = new Map(input.fetched.map((facts) => [facts.fullName, facts]));
  for (const target of targets) {
    if (!fetchedByName.has(target)) {
      throw new Error(`Missing GitHub facts for ${target}`);
    }
  }

  const repos: Record<string, GithubRepoFacts> = {};
  if (!fullSweep && input.previous) {
    for (const [key, facts] of Object.entries(input.previous.repos)) {
      repos[key] = withOnSite(facts, siteRepos);
    }
  }
  for (const target of targets) {
    const facts = fetchedByName.get(target);
    if (!facts) continue;
    repos[facts.fullName] = withOnSite(facts, siteRepos);
  }

  const next: GithubSyncFile = {
    generatedAt: input.now,
    owner: input.owner,
    repos,
  };
  const previousRepos = input.previous?.repos ?? {};
  const updated: RepoChange[] = [];
  for (const fullName of Object.keys(repos).sort(compareNames)) {
    const changes = describeChanges(previousRepos[fullName], repos[fullName]);
    if (changes.length === 0) continue;
    updated.push({
      fullName,
      onSite: repos[fullName].onSite,
      fork: repos[fullName].fork,
      kind: previousRepos[fullName] ? "updated" : "added",
      changes,
    });
  }
  const removed: RepoChange[] = [];
  for (const fullName of Object.keys(previousRepos).sort(compareNames)) {
    if (repos[fullName]) continue;
    removed.push({
      fullName,
      onSite: previousRepos[fullName].onSite,
      fork: previousRepos[fullName].fork,
      kind: "removed",
      changes: ["removed from the sync file"],
    });
  }

  const changed =
    input.previous === null || stableSnapshot(input.previous) !== stableSnapshot(next);
  const interesting = [...updated, ...removed];
  const notOnSite = interesting
    .filter((change) => !change.onSite && !change.fork && change.kind !== "removed")
    .map((change) => change.fullName);

  return {
    next,
    report: {
      changed,
      generatedAt: input.now,
      title: syncPullRequestTitle(updated, removed),
      updated,
      removed,
      notOnSite,
    },
  };
}

export function renderSyncReport(report: SyncReport): string {
  const lines = [
    "## GitHub project sync",
    "",
    "Refreshed GitHub-derived facts: description, topics, language breakdown, homepage, default branch, last push, archived status, and stars.",
    "Hand-written blurbs, screenshots, and the order of project cards are unchanged.",
    "",
    "No project card was created.",
    "",
  ];

  const writeChange = (change: RepoChange) => {
    const where = change.onSite ? "on the site" : "not on the site";
    lines.push(`- **${change.fullName}** (${where}): ${change.changes.join("; ")}`);
  };

  if (report.updated.length === 0 && report.removed.length === 0) {
    lines.push("No repository facts changed.");
  } else {
    lines.push("### Changed", "");
    for (const change of report.updated) writeChange(change);
    for (const change of report.removed) writeChange(change);
    lines.push("");
  }

  if (report.notOnSite.length > 0) {
    lines.push(
      "### Not on the site yet",
      "",
      "These repos are public and not forks, and no project card maps to them. Add a card by hand in `src/data/projects.ts` (`repo` set to the full name) if you want one. This workflow will not create it.",
      "",
    );
    for (const fullName of report.notOnSite) {
      lines.push(`- \`${fullName}\``);
    }
    lines.push("");
  }

  lines.push(
    "Review the diff, then merge to publish. Nothing in this workflow pushes to `main`.",
    "",
  );
  return lines.join("\n");
}

export function formatUpdated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function httpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

function sameUrl(a: string, b: string): boolean {
  return a.replace(/\/$/, "") === b.replace(/\/$/, "");
}

/** Homepage wins when it is an http(s) URL and not the repository page itself. */
export function resolveLiveUrl(
  facts: GithubRepoFacts | undefined,
  manual: string | undefined,
): string | undefined {
  const homepage = httpUrl(facts?.homepage);
  if (!homepage) return manual;
  if (facts && sameUrl(homepage, facts.htmlUrl)) return manual;
  return homepage;
}

export function resolveProject(
  project: Project,
  sync: GithubSyncFile | null | undefined,
): ResolvedProject {
  const facts = project.repo ? sync?.repos?.[project.repo] : undefined;
  const languages = facts?.languages ?? [];
  return {
    ...project,
    github: facts?.htmlUrl || project.github,
    live: resolveLiveUrl(facts, project.live),
    languages,
    lastUpdated: facts?.pushedAt ?? null,
    lastUpdatedLabel: facts?.pushedAt ? formatUpdated(facts.pushedAt) : null,
    archived: facts?.archived ?? false,
    stars: facts ? facts.stars : null,
    topics: facts?.topics ?? [],
    synced: Boolean(facts),
    stack: languages.length > 0 ? languages.map((language) => language.name) : [...project.tech],
  };
}

export function resolveProjects(
  projects: readonly Project[],
  sync: GithubSyncFile | null | undefined,
): ResolvedProject[] {
  return projects.map((project) => resolveProject(project, sync));
}
