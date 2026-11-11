import { describe, expect, it, vi } from "vitest";
import { GithubApiError, fetchGithubJson, isEmptyRepositoryError, pickGithubToken } from "./githubFetch";

function reply(status: number, body: unknown = {}, headers: Record<string, string> = {}) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), { status, headers });
}

const URL = "https://api.github.com/repos/gunnarwrld/ledger-api";
const noSleep = () => Promise.resolve();

describe("fetchGithubJson", () => {
  it("sends the token when one is given", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(200, { name: "ledger-api" }));
    await expect(fetchGithubJson(URL, { token: "t", fetchImpl, sleep: noSleep })).resolves.toEqual({
      name: "ledger-api",
    });
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBe("Bearer t");
  });

  it.each([401, 403, 404])("re-reads anonymously when the token gets %i", async (status) => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply(status, "Not Found"))
      .mockResolvedValueOnce(reply(200, { name: "ledger-api" }));
    await expect(fetchGithubJson(URL, { token: "t", fetchImpl, sleep: noSleep })).resolves.toEqual({
      name: "ledger-api",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(fetchImpl.mock.calls[1][1].headers.Authorization).toBeUndefined();
  });

  it("does not drop the token on a rate-limit 403", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(403, "rate limited", { "x-ratelimit-remaining": "0" }));
    await expect(fetchGithubJson(URL, { token: "t", fetchImpl, sleep: noSleep })).rejects.toThrow("GitHub API 403");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("fails on a 404 without a token instead of looping", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(reply(404, "Not Found"));
    await expect(fetchGithubJson(URL, { fetchImpl, sleep: noSleep })).rejects.toThrow("GitHub API 404");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries a dropped connection, and gives up after three tries", async () => {
    const flaky = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(reply(200, { ok: true }));
    await expect(fetchGithubJson(URL, { fetchImpl: flaky, sleep: noSleep })).resolves.toEqual({ ok: true });

    const down = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    await expect(fetchGithubJson(URL, { fetchImpl: down, sleep: noSleep })).rejects.toThrow("fetch failed");
    expect(down).toHaveBeenCalledTimes(3);
  });

  it("retries a 502 and then succeeds", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(reply(502, "bad gateway"))
      .mockResolvedValueOnce(reply(200, { ok: true }));
    await expect(fetchGithubJson(URL, { fetchImpl, sleep: noSleep })).resolves.toEqual({ ok: true });
  });
});

describe("API errors", () => {
  it("keeps the status, so an empty repository can be told apart from an outage", async () => {
    const empty = vi.fn().mockResolvedValue(reply(409, "Git Repository is empty."));
    const emptyError = await fetchGithubJson(URL, { fetchImpl: empty, sleep: noSleep }).catch((error: unknown) => error);
    expect(emptyError).toBeInstanceOf(GithubApiError);
    expect((emptyError as GithubApiError).status).toBe(409);
    expect(isEmptyRepositoryError(emptyError)).toBe(true);

    const outage = vi.fn().mockResolvedValue(reply(503, "unavailable"));
    const outageError = await fetchGithubJson(URL, { fetchImpl: outage, sleep: noSleep }).catch((error: unknown) => error);
    expect(isEmptyRepositoryError(outageError)).toBe(false);
    expect(isEmptyRepositoryError(new Error("socket hang up"))).toBe(false);
  });
});

describe("pickGithubToken", () => {
  it("prefers SYNC_TOKEN, then GITHUB_TOKEN, and ignores blanks", () => {
    expect(pickGithubToken({ SYNC_TOKEN: "pat", GITHUB_TOKEN: "gh" })).toBe("pat");
    expect(pickGithubToken({ SYNC_TOKEN: "  ", GITHUB_TOKEN: "gh" })).toBe("gh");
    expect(pickGithubToken({})).toBeUndefined();
  });
});
