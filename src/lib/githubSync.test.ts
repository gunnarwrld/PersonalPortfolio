import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { projects, type Project } from "@/data/projects";
import { GITHUB_OWNER, WATCHED_REPOS } from "@/data/watchedRepos";
import {
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
      "gunnarwrld/futbol_data_aggregator_api",
      "gunnarwrld/ledger-api",
      "gunnarwrld/personal-finance-web-app",
      "gunnarwrld/smart-home-gitops",
    ]);

    const watched = WATCHED_REPOS.map((name) => `${GITHUB_OWNER}/${name}`);
    for (const fullName of repoNamesOnSite(projects)) {
      expect(watched).toContain(fullName);
    }

    const onSite = new Set(repoNamesOnSite(projects));
    expect(watched.filter((fullName) => !onSite.has(fullName))).toEqual([
      "gunnarwrld/matchday-hub",
      "gunnarwrld/forge-wallet-android",
      "gunnarwrld/ledger-sentinel-ai",
      "gunnarwrld/fair-football-fee",
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
});
