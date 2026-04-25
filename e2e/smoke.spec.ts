import { test, expect } from "@playwright/test";

/**
 * Smoke tests — fast, broad coverage of the home page.
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
