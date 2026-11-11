import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cv, site, socials } from "./site";

describe("site facts", () => {
  it("uses one LinkedIn address everywhere", () => {
    expect(site.linkedin).toBe("https://linkedin.com/in/gunnararias");
    expect(socials.find((social) => social.label === "LinkedIn")?.href).toBe(site.linkedin);
  });

  it("only offers a CV that is really in public/", () => {
    if (!cv) return;
    expect(cv.href).toMatch(/^\/[^/].*\.pdf$/);
    expect(existsSync(path.resolve("public", cv.href.slice(1))), `${cv.href} is missing from public/`).toBe(true);
    expect(cv.fileName).toMatch(/\.pdf$/);
  });
});
