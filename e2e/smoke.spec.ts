import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

/**
 * Smoke tests: fast, broad coverage of the home page.
 * If any of these break, something fundamental shipped wrong.
 */

test.describe("home page smoke", () => {
  test("loads with the expected title and meta", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok(), "homepage should respond 2xx").toBeTruthy();

    await expect(page).toHaveTitle(/Gunnar.*Full-Stack Developer/i);

    // Open Graph + Twitter cards must be present so social previews work.
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage, "og:image must be set").toBeTruthy();
    expect(ogImage).toMatch(/\/api\/og/);

    const twitterCard = await page
      .locator('meta[name="twitter:card"]')
      .getAttribute("content");
    expect(twitterCard).toBe("summary_large_image");
  });

  test("renders the hero name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Gunnar/i }).first()).toBeVisible();
  });

  test("has exactly one top-level heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("navigates to every section via the navbar", async ({ page }) => {
    await page.goto("/");
    for (const section of ["about", "skills", "projects", "contact"]) {
      const link = page.locator(`a[href="#${section}"]`).first();
      if (await link.count()) {
        await link.click();
        await expect(page.locator(`#${section}`)).toBeVisible();
      }
    }
  });

  test("contact form validates required fields", async ({ page }) => {
    await page.goto("/#contact");
    const send = page.getByRole("button", { name: /send message/i });
    await send.click();
    // Zod errors should appear without ever reaching the API.
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });
});

test.describe("projects", () => {
  test("a card opens its details and gives focus back when they close", async ({ page }) => {
    await page.goto("/#projects");

    const details = page.getByRole("button", { name: "View details for Ledger Forge" });
    await details.click();

    const dialog = page.getByRole("dialog", { name: "Ledger Forge" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "View Code" })).toHaveAttribute(
      "href",
      /github\.com\/gunnarwrld\/ledger-api/,
    );

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(details).toBeFocused();
  });

  test("arrow keys stay with the text field while typing in the contact form", async ({ page }) => {
    // The old carousel swallowed the arrow keys for the whole page.
    await page.goto("/#contact");
    const name = page.getByPlaceholder("Your name");
    await name.fill("Ada");
    await name.press("ArrowLeft");
    await name.pressSequentially("d");
    await expect(name).toHaveValue("Adda");
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the first screen holds the name and both hero buttons", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("#top");
    await expect(hero.getByRole("heading", { name: /Gunnar Arias/i })).toBeInViewport({ ratio: 1 });
    await expect(hero.getByRole("link", { name: /view projects/i })).toBeInViewport({ ratio: 1 });
    await expect(hero.getByRole("link", { name: /github/i })).toBeInViewport({ ratio: 1 });
  });

  test("the bar shows every section without a menu, and each one fits", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const section of ["About", "Skills", "Projects", "Contact"]) {
      await expect(nav.getByRole("link", { name: section })).toBeInViewport({ ratio: 1 });
    }

    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page.locator("#projects")).toBeInViewport();
  });

  test("the page never scrolls sideways", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#contact form")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("with reduced motion", () => {
  test("nothing is left hidden waiting for an animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#contact form")).toBeVisible();

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>(".reveal")].filter((el) => {
          const style = getComputedStyle(el);
          return style.opacity !== "1" || style.clipPath !== "none";
        }).length,
    );
    expect(hidden).toBe(0);

    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    expect(running).toBe(0);
  });
});

test.describe("accessibility", () => {
  test("the home page has no serious or critical axe violations", async ({ page }) => {
    // Reduced motion puts every panel on the page at once, so the whole page is scanned.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#contact form")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const summary = blocking.map((v) => ({ rule: v.id, help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")) }));
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });

  test("an open project dialog has no serious or critical axe violations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#projects");
    await page.getByRole("button", { name: "View details for Fútbol Data Aggregator" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const summary = blocking.map((v) => ({ rule: v.id, help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")) }));
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
});
