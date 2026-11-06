/**
 * Reads public GitHub REST data for the portfolio sync.
 *
 * The Actions GITHUB_TOKEN is an installation token for PersonalPortfolio
 * only. Sent to another repository it can come back 401, 403 or 404 even
 * though that repository is public. When that happens the request is
 * retried once without credentials, so public reads still succeed.
 * A personal token with read access to the other repos (SYNC_TOKEN) avoids
 * the fallback and the lower anonymous rate limit.
 */

export const GITHUB_API = "https://api.github.com";

type FetchLike = (url: string, init: { headers: Record<string, string> }) => Promise<Response>;

export interface GithubFetchOptions {
  token?: string;
  fetchImpl?: FetchLike;
  /** Waits between retries of 429 and 5xx answers. Tests pass a no-op. */
  sleep?: (ms: number) => Promise<void>;
}

const RETRYABLE = new Set([429, 502, 503, 504]);

function isRateLimited(response: Response): boolean {
  return response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0";
}

/** A token was sent and GitHub said it cannot see the resource. */
function tokenWasRefused(response: Response): boolean {
  if (response.status === 401 || response.status === 404) return true;
  return response.status === 403 && !isRateLimited(response);
}

/** Picks the sync token first, then the Actions token. Blank values count as unset. */
export function pickGithubToken(env: Record<string, string | undefined>): string | undefined {
  return env.SYNC_TOKEN?.trim() || env.GITHUB_TOKEN?.trim() || undefined;
}

export async function fetchGithubJson(url: string, options: GithubFetchOptions = {}): Promise<unknown> {
  const fetchImpl: FetchLike = options.fetchImpl ?? ((u, init) => fetch(u, init));
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const baseHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "gunnarwrld-portfolio-sync",
  };

  let token = options.token;
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const headers = token ? { ...baseHeaders, Authorization: `Bearer ${token}` } : baseHeaders;
    const response = await fetchImpl(url, { headers });
    if (response.ok) return response.json() as Promise<unknown>;

    const body = (await response.text()).slice(0, 200);
    lastError = new Error(`GitHub API ${response.status} for ${url}: ${body}`);

    if (token && tokenWasRefused(response)) {
      // The token cannot see this repository. Try once as an anonymous public read.
      token = undefined;
      continue;
    }
    if (RETRYABLE.has(response.status) && attempt < 2) {
      await sleep(1000 * (attempt + 1));
      continue;
    }
    throw lastError;
  }
  throw lastError ?? new Error(`GitHub API failed for ${url}`);
}
