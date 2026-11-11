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

  it("keeps the football API live URL", () => {
    const futbol = projects.find((project) => project.id === "futbol-data-aggregator");
    expect(futbol?.live).toBe(
      "https://futboldataaggregatorapi-production.up.railway.app",
    );
  });

  it("describes the study assistant as JavaScript on Workers, without a CI claim or a dead live link", () => {
    const study = projects.find((project) => project.id === "ai-study-assistant");
    expect(study?.tech).toContain("JavaScript");
    expect(study?.tech).not.toContain("TypeScript");
    expect(study?.tech).not.toContain("React");
    expect(study?.limits).toMatch(/No automated test suite and no CI workflow/);
    expect(study?.live).toBeUndefined();
    expect(JSON.stringify(study)).not.toMatch(/pages\.dev/);
  });

  it("describes the football API tests, Docker, and CI as present", () => {
    const futbol = projects.find((project) => project.id === "futbol-data-aggregator");
    const text = JSON.stringify(futbol);
    expect(text).not.toMatch(/open pull request/i);
    expect(text).not.toMatch(/AppError and the response envelope/);
    expect(futbol?.tech).toEqual(expect.arrayContaining(["Docker Compose", "GitHub Actions", "Supertest"]));
    expect(futbol?.longDescription).toMatch(/GitHub Actions/);
    expect(futbol?.features.join(" ")).toMatch(/Supertest integration tests/);
  });

  it("maps the four pinned repos without a live demo or an Azure deploy claim", () => {
    const cards = ["matchday-hub", "forge-wallet", "ledger-sentinel", "fair-football-fee"].map((id) => {
      const project = projects.find((item) => item.id === id);
      expect(project?.repo).toMatch(/^gunnarwrld\//);
      expect(project?.live).toBeUndefined();
      expect(project?.status).not.toBe("Live");
      return project;
    });

    const matchday = JSON.stringify(cards[0]);
    expect(matchday).toMatch(/in-process channel/);
    expect(matchday).not.toMatch(/deployed on Azure|Azure Service Bus/i);

    const forge = cards[1];
    expect(forge?.repo).toBe("gunnarwrld/forge-wallet-android");
    expect(JSON.stringify(forge)).toMatch(/emulator/);

    const sentinel = JSON.stringify(cards[2]);
    expect(sentinel).toMatch(/no machine-learning code/i);
    expect(sentinel).not.toMatch(/fraud screen is live|model is trained/i);

    const fee = cards[3];
    expect(fee?.tech).not.toContain("Next.js");
    expect(fee?.tech).not.toContain("FastAPI");
    expect(fee?.description).toMatch(/Transfermarkt/);
    expect(fee?.longDescription).toMatch(/Transfermarkt/);
    expect(fee?.longDescription).toMatch(/point-in-time/);
    expect(fee?.longDescription).toMatch(/450/);
    expect(fee?.limits).toMatch(/open pull requests/);
    expect(fee?.limits).toMatch(/no Dockerfile/);
  });

  it("does not credit FinanceTracker with Stripe edge functions or a load-time percentage", () => {
    const finance = projects.find((project) => project.id === "financetracker");
    expect(finance?.tech).not.toContain("Stripe");
    expect(finance?.features.join(" ")).not.toMatch(/Stripe|40%/);
    expect(finance?.longDescription).toMatch(/groq-proxy/);
    expect(finance?.limits).toMatch(/not in the repository/);
    expect(finance?.limits).toMatch(/Payments are not enabled/);
  });

  it("leads with the three projects that best show backend work", () => {
    expect(projects.slice(0, 3).map((project) => project.id)).toEqual([
      "hkif-web",
      "futbol-data-aggregator",
      "ledger-api",
    ]);
  });

  it("gives every project a status", () => {
    for (const project of projects) {
      expect(["Live", "Local demo", "Coursework", "Learning project"]).toContain(project.status);
    }
  });

  it("describes Smart Home GitOps as a rule-based coursework prototype", () => {
    const smartHome = projects.find((project) => project.id === "smart-home-gitops");
    const text = JSON.stringify(smartHome);
    expect(smartHome?.status).toBe("Coursework");
    expect(text).not.toMatch(/adversarial AI attacks|in real time|atomic coroutine|zero hardcoded secrets|research/i);
    expect(text).toMatch(/not an atomic merge/);
    expect(smartHome?.limits).toMatch(/extract it/);
  });

  it("keeps HKIF claims to work shown in the team's pull requests", () => {
    const hkif = projects.find((project) => project.id === "hkif-web");
    expect(JSON.stringify(hkif)).not.toMatch(/entire backend from zero|full endpoint coverage|Backend Lead/i);
    expect(hkif?.role).toMatch(/student team/);
  });

  it("keeps Ledger Forge in step with the repo's Docker and PostgreSQL tests", () => {
    const ledger = projects.find((project) => project.id === "ledger-api");
    expect(ledger?.longDescription).not.toMatch(/no Dockerfile|H2/);
    expect(ledger?.tech).toContain("Testcontainers");
  });

  it("does not call PostHub's contact form functional", () => {
    const posthub = projects.find((project) => project.id === "posthub");
    expect(posthub?.timeline).toBe("2025");
    expect(posthub?.limits).toMatch(/UI-only/);
    expect(JSON.stringify(posthub)).not.toMatch(/validated contact form/);
  });

  it("keeps internal notes out of the copy", () => {
    expect(projectText).not.toMatch(/while the service is redeployed|does not measure|No measured/i);
  });

  it("drops unverifiable metrics from project copy", () => {
    expect(projectText).not.toMatch(/99\.9%|sub-50ms|under 50ms|300\+|automated CI\/CD|40% faster|40% improvement|35%/i);
    expect(projectText).not.toMatch(/infinite scroll/i);
  });
});

describe("skills match code that exists in the repos", () => {
  const skills = skillGroups.flatMap((group) => group.skills);

  it("lists each skill once and leaves out Next.js and MongoDB", () => {
    expect(skills.filter((skill) => skill === "TypeScript")).toHaveLength(1);
    expect(skills).not.toContain("Next.js");
    expect(skills).not.toContain("MongoDB");
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
    expect(xml).toContain("<lastmod>2026-11-10</lastmod>");
    expect(xml).not.toMatch(/#/);
    expect(xml).not.toContain("2026-04-25");
    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).toContain("<loc>https://gunnarwrld.com/</loc>");
  });
});
