import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { projects } from "../src/data/projects.ts";
import { GITHUB_OWNER, WATCHED_REPOS } from "../src/data/watchedRepos.ts";
import {
  parseRepository,
  parseSyncFile,
  planSync,
  renderSyncReport,
  repoNamesOnSite,
  serializeSyncFile,
  toRepoFacts,
  type GithubRepositoryApi,
  type GithubSyncFile,
} from "../src/lib/githubSync.ts";
import { GITHUB_API, fetchGithubJson, pickGithubToken } from "../src/lib/githubFetch.ts";

const DEFAULT_OUTPUT = "src/data/github-sync.json";

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

async function main() {
  // Public reads. SYNC_TOKEN (optional) is a token that can read the other
  // repositories. Without it the Actions GITHUB_TOKEN is tried, and any repo it
  // cannot see is re-read anonymously (see src/lib/githubFetch.ts). Do not use
  // PORTFOLIO_DISPATCH_TOKEN here: it is scoped to PersonalPortfolio only.
  const token = pickGithubToken(process.env);
  const requestedInput = argValue("--repo") || process.env.SYNC_REPOSITORY || "";
  const reportPath = argValue("--report");
  const outputPath = argValue("--output") || DEFAULT_OUTPUT;
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
  const plan = planSync({
    previous: readPrevious(outputPath),
    owner: GITHUB_OWNER,
    watchList: WATCHED_REPOS,
    siteRepos,
    requestedFullNames: requested,
    fetched,
    now: new Date().toISOString(),
  });

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
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
