import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { marqueeItems, skillGroups } from "./skills";

const projectText = JSON.stringify(projects);

describe("portfolio copy stays tied to the repos", () => {
  it("lists the backends that were missing from the site", () => {
    expect(projects.map((project) => project.id)).toEqual(
      expect.arrayContaining([
        "futbol-data-aggregator",
        "ledger-api",
        "clicky-recurring-runs",
      ]),
    );
  });

  it("keeps the finance and portfolio repository links", () => {
    const finance = projects.find((project) => project.id === "financetracker");
    const portfolio = projects.find((project) => project.id === "portfolio");
    expect(finance?.github).toBe(
      "https://github.com/gunnarwrld/personal-finance-web-app",
    );
    expect(portfolio?.github).toBe(
      "https://github.com/gunnarwrld/PersonalPortfolio",
    );
  });

  it("keeps the football API live URL while it is redeployed", () => {
    const futbol = projects.find((project) => project.id === "futbol-data-aggregator");
    expect(futbol?.live).toBe(
      "https://futboldataaggregatorapi-production.up.railway.app",
    );
  });

  it("describes the study assistant as JavaScript on Workers, without a CI claim", () => {
    const study = projects.find((project) => project.id === "ai-study-assistant");
    expect(study?.tech).toContain("JavaScript");
    expect(study?.tech).not.toContain("TypeScript");
    expect(study?.tech).not.toContain("React");
    expect(study?.features.join(" ")).toMatch(/no test suite and no CI workflow/);
  });

  it("does not credit FinanceTracker with Stripe edge functions or a load-time percentage", () => {
    const finance = projects.find((project) => project.id === "financetracker");
    expect(finance?.tech).not.toContain("Stripe");
    expect(finance?.features.join(" ")).not.toMatch(/Stripe|40%/);
    expect(finance?.longDescription).toMatch(/groq-proxy/);
    expect(finance?.longDescription).toMatch(/not in the repository/);
  });

  it("drops unverifiable metrics from project copy", () => {
    expect(projectText).not.toMatch(/99\.9%|sub-50ms|under 50ms|300\+|automated CI\/CD|40% faster|40% improvement|35%/i);
    expect(projectText).not.toMatch(/infinite scroll/i);
  });
});

describe("skills match code that exists in the repos", () => {
  const skills = skillGroups.flatMap((group) => group.skills);

  it("lists each skill once and keeps Next.js and MongoDB", () => {
    expect(skills.filter((skill) => skill === "TypeScript")).toHaveLength(1);
    expect(skills).toEqual(expect.arrayContaining(["Next.js", "MongoDB"]));
    expect(new Set(skills).size).toBe(skills.length);
  });

  it("adds the stacks from the football API, ledger, and Android app", () => {
    expect(skills).toEqual(
      expect.arrayContaining([
        "Kotlin",
        "Spring Boot",
        "Jetpack Compose",
        "Redis",
        "BullMQ",
        "Socket.io",
      ]),
    );
  });

  it("removes skills with no application code behind them", () => {
    for (const skill of ["MySQL", "Firebase", "LangChain", "OpenAI API", "Docker", "AWS"]) {
      expect(skills).not.toContain(skill);
    }
    expect(skills).toContain("Docker Compose");
  });

  it("does not put AWS or a bare Docker label in the marquee", () => {
    expect(marqueeItems).not.toContain("AWS");
    expect(marqueeItems).not.toContain("Docker");
    expect(marqueeItems).toContain("Docker Compose");
  });
});

describe("sitemap", () => {
  const xml = readFileSync(path.resolve("public/sitemap.xml"), "utf8");

  it("uses a current lastmod and no fragment URLs", () => {
    expect(xml).toContain("<lastmod>2026-10-28</lastmod>");
    expect(xml).not.toMatch(/#/);
    expect(xml).not.toContain("2026-04-25");
    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).toContain("<loc>https://gunnarwrld.com/</loc>");
  });
});
