import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { projects, type Project } from "@/data/projects";
import { GITHUB_OWNER, NOW_BUILDING, WATCHED_REPOS, type NowBuildingConfig } from "@/data/watchedRepos";
import {
  cardIdsByRepo,
  isNowBuildingFresh,
  nowBuildingCandidates,
  nowBuildingNeedsUpdate,
  pickNowBuilding,
  prettyRepoName,
  reposShownOnSite,
  summarizeCommits,
  syncPullRequestTitle,
  type NowBuilding,
  type RepoActivity,
  languageBreakdown,
  parseRepository,
  parseSyncFile,
  compareNames,
  planSync,
  renderSyncReport,
  repoNamesOnSite,
  resolveLiveUrl,
  resolveProject,
  resolveProjects,
  serializeSyncFile,
  stableSnapshot,
  toRepoFacts,
  type GithubRepoFacts,
  type GithubRepositoryApi,
  type GithubSyncFile,
} from "./githubSync";

function api(overrides: Partial<GithubRepositoryApi> = {}): GithubRepositoryApi {
  return {
    name: "ledger-api",
    full_name: "gunnarwrld/ledger-api",
    description: "A ledger",
    homepage: "https://ledger.example",
    default_branch: "master",
    pushed_at: "2026-11-01T12:00:00Z",
    archived: false,
    stargazers_count: 2,
    fork: false,
    topics: ["kotlin", "ledger"],
    language: "Kotlin",
    html_url: "https://github.com/gunnarwrld/ledger-api",
    private: false,
    ...overrides,
  };
}

function facts(overrides: Partial<GithubRepoFacts> = {}): GithubRepoFacts {
  const { onSite, ...rest } = overrides;
  return { ...toRepoFacts(api(), { Kotlin: 90, Python: 10 }, onSite ?? true), ...rest };
}

function file(repos: Record<string, GithubRepoFacts>, generatedAt = "2026-11-01T00:00:00.000Z"): GithubSyncFile {
  return { generatedAt, owner: GITHUB_OWNER, repos };
}

const manual: Project = {
  id: "ledger-api",
  title: "Ledger Forge",
  subtitle: "Double-Entry Wallet API",
  description: "Hand-written blurb that must stay.",
  longDescription: "A longer hand-written blurb.",
  tech: ["Kotlin", "Spring Boot"],
  features: ["Idempotent transfers"],
  github: "https://github.com/gunnarwrld/ledger-api",
  role: "Solo Developer",
  timeline: "2026",
  status: "Local demo",
  repo: "gunnarwrld/ledger-api",
};

describe("languageBreakdown", () => {
  it("returns nothing when the repo has no detected languages", () => {
    expect(languageBreakdown({})).toEqual([]);
    expect(languageBreakdown({ TypeScript: 0 })).toEqual([]);
  });

  it("reports a single language as 100", () => {
    expect(languageBreakdown({ Python: 10 })).toEqual([{ name: "Python", percentage: 100 }]);
  });

  it("uses largest remainder so tenths sum to 100", () => {
    expect(languageBreakdown({ TypeScript: 2, JavaScript: 1 })).toEqual([
      { name: "TypeScript", percentage: 66.7 },
      { name: "JavaScript", percentage: 33.3 },
    ]);
    const futbol = languageBreakdown({ TypeScript: 117371, JavaScript: 5525 });
    expect(futbol).toEqual([
      { name: "TypeScript", percentage: 95.5 },
      { name: "JavaScript", percentage: 4.5 },
    ]);
    expect(futbol.reduce((sum, language) => sum + language.percentage, 0)).toBeCloseTo(100, 5);
  });
});

describe("parseRepository", () => {
  it("defaults the owner and accepts a full name", () => {
    expect(parseRepository("ledger-api", GITHUB_OWNER)).toEqual({
      owner: GITHUB_OWNER,
      name: "ledger-api",
      fullName: "gunnarwrld/ledger-api",
    });
    expect(parseRepository("jasminerezai/hkif-web", GITHUB_OWNER).fullName).toBe(
      "jasminerezai/hkif-web",
    );
  });

  it("rejects path tricks and extra segments", () => {
    for (const input of ["", " ", "../secrets", "owner/name/extra", "owner/name with space", ".hidden", "owner/.git"]) {
      expect(() => parseRepository(input, GITHUB_OWNER)).toThrow(/Invalid repository/);
    }
  });
});

describe("toRepoFacts", () => {
  it("normalizes topics, languages, and blank text", () => {
    const normalized = toRepoFacts(
      api({ description: "  ", homepage: "", topics: ["kotlin", "kotlin", "api"] }),
      { Kotlin: 1 },
      false,
    );
    expect(normalized.description).toBeNull();
    expect(normalized.homepage).toBeNull();
    expect(normalized.topics).toEqual(["api", "kotlin"]);
    expect(normalized.onSite).toBe(false);
    expect(normalized.languages).toEqual([{ name: "Kotlin", percentage: 100 }]);
  });

  it("refuses a private repository", () => {
    expect(() => toRepoFacts(api({ private: true }), {}, false)).toThrow(/private/);
  });
});

describe("resolveProject", () => {
  const sync = file({
    "gunnarwrld/ledger-api": facts(),
  });

  it("overlays GitHub fields and leaves hand-written copy in place", () => {
    const snapshot = structuredClone(manual);
    const resolved = resolveProject(manual, sync);

    expect(manual).toEqual(snapshot);
    expect(resolved.description).toBe(manual.description);
    expect(resolved.longDescription).toBe(manual.longDescription);
    expect(resolved.features).toEqual(manual.features);
    expect(resolved.tech).toEqual(["Kotlin", "Spring Boot"]);
    expect(resolved.title).toBe("Ledger Forge");
    expect(resolved.stack).toEqual(["Kotlin", "Python"]);
    expect(resolved.github).toBe("https://github.com/gunnarwrld/ledger-api");
    expect(resolved.live).toBe("https://ledger.example");
    expect(resolved.lastUpdated).toBe("2026-11-01T12:00:00Z");
    expect(resolved.lastUpdatedLabel).toBe("Nov 1, 2026");
    expect(resolved.archived).toBe(false);
    expect(resolved.stars).toBe(2);
    expect(resolved.synced).toBe(true);
  });

  it("keeps the manual live URL when GitHub has no usable homepage", () => {
    const withLive = { ...manual, live: "https://pages.example/app" };
    expect(resolveLiveUrl(facts({ homepage: null }), withLive.live)).toBe("https://pages.example/app");
    expect(resolveLiveUrl(facts({ homepage: "   " }), withLive.live)).toBe("https://pages.example/app");
    expect(resolveLiveUrl(facts({ homepage: "javascript:alert(1)" }), withLive.live)).toBe(
      "https://pages.example/app",
    );
    expect(
      resolveLiveUrl(
        facts({ homepage: "https://github.com/gunnarwrld/ledger-api" }),
        withLive.live,
      ),
    ).toBe("https://pages.example/app");
    expect(resolveProject(withLive, file({
      "gunnarwrld/ledger-api": facts({ homepage: null }),
    })).live).toBe("https://pages.example/app");
  });

  it("falls back to the hand-written stack when the repo has no languages", () => {
    const resolved = resolveProject(
      manual,
      file({ "gunnarwrld/ledger-api": facts({ languages: [], archived: true }) }),
    );
    expect(resolved.stack).toEqual(["Kotlin", "Spring Boot"]);
    expect(resolved.archived).toBe(true);
  });

  it("leaves a project alone when it has no repo mapping", () => {
    const { repo: _repo, ...unmapped } = manual;
    const resolved = resolveProject(unmapped, sync);
    expect(resolved.synced).toBe(false);
    expect(resolved.github).toBe(manual.github);
    expect(resolved.stack).toEqual(manual.tech);
    expect(resolved.archived).toBe(false);
    expect(resolved.lastUpdated).toBeNull();
  });

  it("preserves project order", () => {
    const second: Project = { ...manual, id: "other", title: "Other", repo: undefined };
    expect(resolveProjects([manual, second], sync).map((project) => project.id)).toEqual([
      "ledger-api",
      "other",
    ]);
  });
});

describe("planSync", () => {
  const siteRepos = ["gunnarwrld/ledger-api"];
  const watchList = ["ledger-api", "matchday-hub"];

  function hub(onSite = false): GithubRepoFacts {
    return toRepoFacts(
      api({
        name: "matchday-hub",
        full_name: "gunnarwrld/matchday-hub",
        description: "Matchday",
        homepage: null,
        html_url: "https://github.com/gunnarwrld/matchday-hub",
        language: null,
        topics: [],
        stargazers_count: 0,
        pushed_at: "2026-10-30T00:00:00Z",
      }),
      {},
      onSite,
    );
  }

  it("does not treat a fresh timestamp as a change", () => {
    const previous = file({
      "gunnarwrld/ledger-api": facts(),
      "gunnarwrld/matchday-hub": hub(),
    });
    const plan = planSync({
      previous,
      owner: GITHUB_OWNER,
      watchList,
      siteRepos,
      requestedFullNames: [],
      fetched: [facts(), hub()],
      now: "2026-11-06T00:00:00.000Z",
    });
    expect(plan.report.changed).toBe(false);
    expect(plan.report.updated).toEqual([]);
    expect(plan.report.notOnSite).toEqual([]);
    expect(stableSnapshot(plan.next)).toBe(stableSnapshot(previous));
  });

  it("reports a star change and lists a public non-fork that is not on the site", () => {
    const previous = file({
      "gunnarwrld/ledger-api": facts(),
      "gunnarwrld/matchday-hub": hub(),
    });
    const pushed = hub();
    pushed.stars = 4;
    pushed.pushedAt = "2026-11-06T01:00:00Z";
    const plan = planSync({
      previous,
      owner: GITHUB_OWNER,
      watchList,
      siteRepos,
      requestedFullNames: ["gunnarwrld/matchday-hub"],
      fetched: [pushed],
      now: "2026-11-06T02:00:00.000Z",
    });

    expect(plan.report.changed).toBe(true);
    expect(plan.report.title).toBe("chore(data): refresh gunnarwrld/matchday-hub");
    expect(plan.report.notOnSite).toEqual(["gunnarwrld/matchday-hub"]);
    expect(plan.next.repos["gunnarwrld/ledger-api"]).toEqual(facts());
    expect(plan.next.repos["gunnarwrld/matchday-hub"].stars).toBe(4);
    const markdown = renderSyncReport(plan.report);
    expect(markdown).toContain("### Not on the site yet");
    expect(markdown).toContain("`gunnarwrld/matchday-hub`");
    expect(markdown).toContain("No project card was created.");
    expect(markdown).toContain("stars 0 → 4");
    expect(markdown).not.toMatch(/auto-?creat(e|ed) a card/i);
  });

  it("does not call a fork a missing card", () => {
    const forked = hub();
    forked.fork = true;
    const plan = planSync({
      previous: file({ "gunnarwrld/ledger-api": facts() }),
      owner: GITHUB_OWNER,
      watchList,
      siteRepos,
      requestedFullNames: ["gunnarwrld/matchday-hub"],
      fetched: [forked],
      now: "2026-11-06T02:00:00.000Z",
    });
    expect(plan.report.notOnSite).toEqual([]);
    expect(renderSyncReport(plan.report)).not.toContain("### Not on the site yet");
  });

  it("replaces the file with the watch list on a full sweep", () => {
    const extra = facts({ fullName: "gunnarwrld/extra", name: "extra", onSite: false });
    const plan = planSync({
      previous: file({
        "gunnarwrld/extra": extra,
        "gunnarwrld/ledger-api": facts({ stars: 1 }),
      }),
      owner: GITHUB_OWNER,
      watchList,
      siteRepos,
      requestedFullNames: [],
      fetched: [facts(), hub()],
      now: "2026-11-06T02:00:00.000Z",
    });
    expect(Object.keys(plan.next.repos).sort()).toEqual([
      "gunnarwrld/ledger-api",
      "gunnarwrld/matchday-hub",
    ]);
    expect(plan.report.removed.map((change) => change.fullName)).toEqual(["gunnarwrld/extra"]);
    expect(plan.report.notOnSite).toEqual(["gunnarwrld/matchday-hub"]);
  });

  it("throws when a requested repo was not fetched", () => {
    expect(() =>
      planSync({
        previous: null,
        owner: GITHUB_OWNER,
        watchList,
        siteRepos,
        requestedFullNames: [],
        fetched: [facts()],
        now: "2026-11-06T02:00:00.000Z",
      }),
    ).toThrow(/matchday-hub/);
  });

  it("serializes repos in a stable order with a trailing newline", () => {
    const text = serializeSyncFile(
      file({
        "gunnarwrld/matchday-hub": hub(),
        "gunnarwrld/ledger-api": facts(),
      }),
    );
    expect(text.endsWith("\n")).toBe(true);
    expect(text.indexOf("gunnarwrld/ledger-api")).toBeLessThan(text.indexOf("gunnarwrld/matchday-hub"));
    expect(parseSyncFile(JSON.parse(text)).repos["gunnarwrld/ledger-api"].primaryLanguage).toBe(
      "Kotlin",
    );
  });
});

describe("portfolio mapping", () => {
  it("maps site projects onto the watched gunnarwrld repos and nowhere else", () => {
    expect(repoNamesOnSite(projects)).toEqual([
      "gunnarwrld/PostHub-DynamicWebsite",
      "gunnarwrld/cf_ai_study_assistant",
      "gunnarwrld/clicky-recurring-runs",
      "gunnarwrld/fair-football-fee",
      "gunnarwrld/forge-wallet-android",
      "gunnarwrld/futbol_data_aggregator_api",
      "gunnarwrld/ledger-api",
      "gunnarwrld/ledger-sentinel-ai",
      "gunnarwrld/matchday-hub",
      "gunnarwrld/personal-finance-web-app",
      "gunnarwrld/smart-home-gitops",
    ]);

    const watched = WATCHED_REPOS.map((name) => `${GITHUB_OWNER}/${name}`);
    for (const fullName of repoNamesOnSite(projects)) {
      expect(watched).toContain(fullName);
    }

    const onSite = new Set(repoNamesOnSite(projects));
    expect(watched.filter((fullName) => !onSite.has(fullName))).toEqual([
      "gunnarwrld/lab01_fullstack",
    ]);

    expect(projects.find((project) => project.id === "hkif-web")?.repo).toBeUndefined();
    expect(projects.find((project) => project.id === "portfolio")?.repo).toBeUndefined();
    expect(projects.map((project) => project.id)).toEqual([
      "hkif-web",
      "futbol-data-aggregator",
      "ledger-api",
      "clicky-recurring-runs",
      "financetracker",
      "ai-study-assistant",
      "portfolio",
      "smart-home-gitops",
      "posthub",
      "matchday-hub",
      "forge-wallet",
      "ledger-sentinel",
      "fair-football-fee",
    ]);
  });
});

describe("sync workflow safety", () => {
  const workflow = readFileSync(".github/workflows/sync-github-projects.yml", "utf8");
  const notifier = readFileSync("templates/notify-portfolio.yml", "utf8");
  const reusable = readFileSync(".github/workflows/portfolio-dispatch.yml", "utf8");

  it("refreshes from dispatch, a manual run, and a daily schedule without pushing main", () => {
    expect(workflow).toContain("repository_dispatch");
    expect(workflow).toContain("project-updated");
    expect(workflow).toContain("workflow_dispatch");
    expect(workflow).toContain("schedule");
    expect(workflow).toContain("github-sync");
    expect(workflow).toContain("PORTFOLIO_DISPATCH_TOKEN");

    const pushLines = workflow
      .split("\n")
      .filter((line) => /^\s*git\b/.test(line) && /\bpush\b/.test(line));
    expect(pushLines.length).toBeGreaterThan(0);
    for (const line of pushLines) {
      expect(line).not.toMatch(/\bmain\b|\bmaster\b/);
      expect(line).toContain("BRANCH");
    }
  });

  it("checks every two hours, and only publishes when the Now building repo changed", () => {
    expect(workflow).toContain('cron: "41 */2 * * *"');
    expect(workflow).toContain("github.event.schedule == '41 */2 * * *'");
    expect(workflow).toContain("--only-if-now-changed");
    expect(workflow).toContain('cron: "17 6 * * *"');
  });

  it("reads the open pull request's pick only while one is open, and closes it once it is out of date", () => {
    const nowCheck = workflow.slice(workflow.indexOf('if [ "$NOW_CHECK" = "true" ]'), workflow.indexOf("--only-if-now-changed"));
    expect(nowCheck).toContain("--state open");
    expect(nowCheck).toContain('[ "$open_prs" != "0" ]');
    expect(workflow).toContain("steps.sync.outputs.main_up_to_date == 'true'");
    const emptyDiff = workflow.slice(workflow.indexOf("if git diff --cached --quiet"), workflow.indexOf('git commit -m "$TITLE"'));
    expect(emptyDiff).toContain("gh pr close");
    expect(emptyDiff).toContain("exit 0");
  });

  it("merges only a green sync pull request from this repo that changes nothing but the data file", () => {
    const autoMerge = readFileSync(".github/workflows/sync-auto-merge.yml", "utf8");
    // The trigger names the CI workflow, so that name must not drift.
    expect(readFileSync(".github/workflows/ci.yml", "utf8")).toMatch(/^name: CI$/m);
    expect(autoMerge).toContain("workflow_run:");
    expect(autoMerge).toContain("workflows: [CI]");
    expect(autoMerge).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(autoMerge).toContain("github.event.workflow_run.event == 'pull_request'");
    expect(autoMerge).toContain("github.event.workflow_run.head_branch == 'github-sync'");
    expect(autoMerge).toContain("github.event.workflow_run.head_repository.full_name == github.repository");
    expect(autoMerge).toContain("vars.SYNC_AUTO_MERGE != 'off'");
    expect(autoMerge).toContain("--match-head-commit");
    expect(autoMerge).toContain("DATA_FILE: src/data/github-sync.json");
    expect(autoMerge).toContain("permissions: {}");
    // It never checks out or runs code from the pull request, and never pushes.
    expect(autoMerge).not.toMatch(/actions\/checkout|npm |\bgit\s+push\b/);
  });

  it("notifies PersonalPortfolio with the dispatch secret and the default branch", () => {
    expect(reusable).toContain("workflow_call");
    expect(reusable).toContain("PORTFOLIO_DISPATCH_TOKEN");
    expect(reusable).toContain("project-updated");
    expect(reusable).toContain("https://api.github.com/repos/gunnarwrld/PersonalPortfolio/dispatches");
    expect(notifier).toContain("PORTFOLIO_DISPATCH_TOKEN");
    expect(notifier).toContain("github.event.repository.default_branch");
    expect(notifier).toContain(
      "gunnarwrld/PersonalPortfolio/.github/workflows/portfolio-dispatch.yml@main",
    );
  });
});

describe("committed github-sync.json", () => {
  const sync = parseSyncFile(JSON.parse(readFileSync("src/data/github-sync.json", "utf8")));

  it("covers the watch list and marks only mapped projects as on the site", () => {
    const watched = WATCHED_REPOS.map((name) => `${GITHUB_OWNER}/${name}`).sort(compareNames);
    expect(Object.keys(sync.repos).sort(compareNames)).toEqual(watched);
    expect(sync.owner).toBe(GITHUB_OWNER);

    const onSite = new Set(repoNamesOnSite(projects));
    for (const [fullName, repo] of Object.entries(sync.repos)) {
      expect(repo.fullName).toBe(fullName);
      expect(repo.htmlUrl).toBe(`https://github.com/${fullName}`);
      expect(repo.fork).toBe(false);
      expect(repo.onSite).toBe(onSite.has(fullName));
      expect(repo.defaultBranch.length).toBeGreaterThan(0);
      expect(repo.pushedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      if (repo.languages.length > 0) {
        const total = repo.languages.reduce((sum, language) => sum + language.percentage, 0);
        expect(total).toBeCloseTo(100, 5);
      }
    }
  });

  it("points the Now building bubble at a GitHub repository that is not excluded", () => {
    // Whether the pick has a card is checked when the page renders (NowBuildingBubble),
    // because a card can be added before the next sync refreshes this file.
    if (!sync.now) return;
    expect(sync.now.htmlUrl).toBe(`https://github.com/${sync.now.fullName}`);
    expect(NOW_BUILDING.exclude.map((name) => name.toLowerCase())).not.toContain(sync.now.name.toLowerCase());
  });
});

describe("now building", () => {
  const RUN = "2026-11-11T12:00:00Z";
  const config: NowBuildingConfig = {
    activityDays: 14,
    freshDays: 30,
    pin: null,
    exclude: ["lab01_fullstack"],
    labels: { "forge-wallet-android": "Forge Wallet" },
  };
  const repo = (name: string, overrides: Partial<GithubRepositoryApi> = {}) =>
    api({
      name,
      full_name: `gunnarwrld/${name}`,
      html_url: `https://github.com/gunnarwrld/${name}`,
      pushed_at: "2026-11-10T10:00:00Z",
      ...overrides,
    });
  // The pick logic is tested against a fixed card list, not the live projects.ts:
  // cards get added all the time, and that must not change these tests.
  const shownOnSite = new Set(["gunnarwrld/ledger-api", "gunnarwrld/personalportfolio"]);
  const input = (repositories: GithubRepositoryApi[], overrides: Partial<NowBuildingConfig> = {}) => ({
    owner: GITHUB_OWNER,
    repositories,
    shownOnSite,
    config: { ...config, ...overrides },
    now: RUN,
  });
  const activity = (entries: Record<string, RepoActivity>) =>
    new Map(Object.entries(entries).map(([name, value]) => [`gunnarwrld/${name}`, value]));
  const pick = (overrides: Partial<NowBuilding> = {}): NowBuilding => ({
    fullName: "gunnarwrld/forge-wallet-android",
    name: "forge-wallet-android",
    label: "Forge Wallet",
    htmlUrl: "https://github.com/gunnarwrld/forge-wallet-android",
    primaryLanguage: "Kotlin",
    pushedAt: "2026-11-10T11:09:16Z",
    ...overrides,
  });

  it("counts the portfolio's own repo as shown, through the card's GitHub link", () => {
    const live = reposShownOnSite(projects);
    expect(live.has("gunnarwrld/personalportfolio")).toBe(true);
    expect(live.has("gunnarwrld/ledger-api")).toBe(true);
    expect(live.has("jasminerezai/hkif-web")).toBe(true);

    const cards = reposShownOnSite([
      { repo: "gunnarwrld/mapped-repo" },
      { github: "https://github.com/gunnarwrld/Linked-Only/" },
      { github: "https://example.com/not-github" },
    ]);
    expect([...cards].sort()).toEqual(["gunnarwrld/linked-only", "gunnarwrld/mapped-repo"]);
  });

  it("only offers repos that have no card yet and are not forks, archived, excluded or the profile README", () => {
    const names = nowBuildingCandidates(
      input([
        repo("forge-wallet-android"),
        repo("ledger-api"),
        repo("PersonalPortfolio"),
        repo("gunnarwrld"),
        repo("lab01_fullstack"),
        repo("old-fork", { fork: true }),
        repo("old-archive", { archived: true }),
        repo("secret", { private: true }),
        repo("someone-else", { full_name: "octocat/someone-else" }),
        repo("long-quiet", { pushed_at: "2026-09-01T00:00:00Z" }),
      ]),
    ).map((candidate) => candidate.name);
    expect(names).toEqual(["forge-wallet-android"]);
  });

  it("picks the repo with the most active days, then commits, then the latest push", () => {
    const repositories = [
      repo("fair-football-fee", { pushed_at: "2026-11-11T09:00:00Z" }),
      repo("forge-wallet-android", { pushed_at: "2026-11-10T11:09:16Z" }),
      repo("matchday-hub", { pushed_at: "2026-11-10T11:03:04Z" }),
    ];
    const chosen = pickNowBuilding({
      ...input(repositories),
      activity: activity({
        "fair-football-fee": { commits: 11, activeDays: 3 },
        "forge-wallet-android": { commits: 29, activeDays: 4 },
        "matchday-hub": { commits: 40, activeDays: 2 },
      }),
    });
    expect(chosen).toEqual(pick({ pushedAt: "2026-11-10T11:09:16Z" }));

    // A one-off push does not take over from steady work.
    const typoFix = pickNowBuilding({
      ...input([...repositories, repo("ledger-sentinel-ai", { pushed_at: "2026-11-11T11:59:00Z" })]),
      activity: activity({
        "forge-wallet-android": { commits: 29, activeDays: 4 },
        "ledger-sentinel-ai": { commits: 1, activeDays: 1 },
      }),
    });
    expect(typoFix?.name).toBe("forge-wallet-android");

    // With no commits counted anywhere, the latest push decides.
    expect(pickNowBuilding({ ...input(repositories), activity: new Map() })?.name).toBe("fair-football-fee");
  });

  it("falls back to the most active repo with a card when every active repo has one", () => {
    const chosen = pickNowBuilding({
      ...input([
        repo("ledger-api", { pushed_at: "2026-11-11T09:00:00Z" }),
        repo("PersonalPortfolio", { pushed_at: "2026-11-11T11:00:00Z" }),
        repo("lab01_fullstack", { pushed_at: "2026-11-11T11:30:00Z" }),
      ], { exclude: ["PersonalPortfolio", "lab01_fullstack"] }),
      activity: activity({
        "ledger-api": { commits: 9, activeDays: 3 },
        PersonalPortfolio: { commits: 80, activeDays: 10 },
        lab01_fullstack: { commits: 40, activeDays: 6 },
      }),
    });
    expect(chosen?.name).toBe("ledger-api");

    // A repo without a card still wins over a busier one that has a card.
    const fresh = pickNowBuilding({
      ...input([repo("ledger-api"), repo("weekend-experiment")]),
      activity: activity({
        "ledger-api": { commits: 30, activeDays: 8 },
        "weekend-experiment": { commits: 2, activeDays: 1 },
      }),
    });
    expect(fresh?.name).toBe("weekend-experiment");
  });

  it("maps repos to the id of the card that shows them", () => {
    const ids = cardIdsByRepo([
      { id: "ledger", repo: "gunnarwrld/ledger-api" },
      { id: "portfolio", github: "https://github.com/gunnarwrld/PersonalPortfolio" },
    ]);
    expect(ids.get("gunnarwrld/ledger-api")).toBe("ledger");
    expect(ids.get("gunnarwrld/personalportfolio")).toBe("portfolio");
  });

  it("follows a pin and labels repos readably", () => {
    const chosen = pickNowBuilding({
      ...input([repo("forge-wallet-android"), repo("ledger-sentinel-ai")], { pin: "ledger-sentinel-ai" }),
      activity: activity({ "forge-wallet-android": { commits: 29, activeDays: 4 } }),
    });
    expect(chosen?.label).toBe("Ledger Sentinel AI");
    expect(prettyRepoName("PostHub-DynamicWebsite")).toBe("Post Hub Dynamic Website");
    expect(prettyRepoName("matchday-hub")).toBe("Matchday Hub");
    expect(pickNowBuilding({ ...input([]), activity: new Map() })).toBeNull();
  });

  it("counts commits and active days without bots", () => {
    const commit = (date: string, login = "gunnarwrld", type = "User") => ({
      author: { login, type },
      commit: { committer: { date } },
    });
    expect(
      summarizeCommits([
        commit("2026-11-10T11:00:00Z"),
        commit("2026-11-10T09:00:00Z"),
        commit("2026-11-08T09:00:00Z"),
        commit("2026-11-09T09:00:00Z", "dependabot[bot]", "Bot"),
      ]),
    ).toEqual({ commits: 3, activeDays: 2 });
  });

  it("stores the pick in the sync file and treats a new pick as a change", () => {
    const previous = file({ "gunnarwrld/ledger-api": facts() });
    const plan = planSync({
      previous,
      owner: GITHUB_OWNER,
      watchList: ["ledger-api"],
      siteRepos: ["gunnarwrld/ledger-api"],
      requestedFullNames: [],
      fetched: [facts()],
      now: RUN,
      nowBuilding: pick(),
      nowActivity: { commits: 29, activeDays: 4 },
    });
    expect(plan.report.changed).toBe(true);
    expect(plan.report.nowBuilding.changed).toBe(true);
    expect(plan.report.title).toBe("chore(data): now building Forge Wallet");
    expect(renderSyncReport(plan.report)).toContain("**Now building: Forge Wallet**");

    const roundTrip = parseSyncFile(JSON.parse(serializeSyncFile(plan.next)));
    expect(roundTrip.now).toEqual(pick());

    // Leaving the pick out keeps the previous one.
    const kept = planSync({
      previous: roundTrip,
      owner: GITHUB_OWNER,
      watchList: ["ledger-api"],
      siteRepos: ["gunnarwrld/ledger-api"],
      requestedFullNames: [],
      fetched: [facts()],
      now: RUN,
    });
    expect(kept.report.changed).toBe(false);
    expect(kept.next.now).toEqual(pick());
  });

  it("refuses a pick that does not link to a GitHub repository", () => {
    const parsed = parseSyncFile({
      owner: GITHUB_OWNER,
      repos: {},
      now: pick({ htmlUrl: "https://example.com/phish" }),
    });
    expect(parsed.now).toBeNull();
  });

  it("titles a pull request that only hides the bubble", () => {
    expect(syncPullRequestTitle([], [], null)).toBe("chore(data): hide the Now building bubble");
  });

  it("lets the two-hour check publish only when the bubble would show another repo", () => {
    const forge = pick();
    const hub = pick({ fullName: "gunnarwrld/matchday-hub", name: "matchday-hub", label: "Matchday Hub" });
    // No sync pull request open: compare with main.
    expect(nowBuildingNeedsUpdate(forge, forge, undefined)).toBe(false);
    expect(nowBuildingNeedsUpdate(forge, null, undefined)).toBe(true);
    expect(nowBuildingNeedsUpdate(null, forge, undefined)).toBe(true);
    // A sync pull request is open: compare with what it proposes.
    expect(nowBuildingNeedsUpdate(forge, null, forge)).toBe(false);
    expect(nowBuildingNeedsUpdate(forge, hub, hub)).toBe(true);
    expect(nowBuildingNeedsUpdate(hub, forge, hub)).toBe(false);
  });

  it("refreshes an open pull request whose pick went stale, even when main already matches", () => {
    // The pick moved to Matchday Hub, a pull request proposed it, then the pick went back
    // to Forge Wallet, which main shows. The open pull request must not stay on Matchday Hub.
    const forge = pick();
    const hub = pick({ fullName: "gunnarwrld/matchday-hub", name: "matchday-hub", label: "Matchday Hub" });
    expect(nowBuildingNeedsUpdate(forge, forge, hub)).toBe(true);
  });

  it("hides the bubble once the repo has gone a month without a push", () => {
    const forge = pick({ pushedAt: "2026-11-10T11:09:16Z" });
    expect(isNowBuildingFresh(forge, new Date("2026-11-20T00:00:00Z"), 30)).toBe(true);
    expect(isNowBuildingFresh(forge, new Date("2026-12-11T00:00:00Z"), 30)).toBe(false);
    expect(isNowBuildingFresh(null, new Date(RUN), 30)).toBe(false);
  });
});
