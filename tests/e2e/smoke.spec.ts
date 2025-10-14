import { test, expect } from "@playwright/test";

/**
 * Smoke Tests - Quick validation that critical functionality works
 *
 * These tests should run fast and catch major breakages.
 */

test.describe("Smoke Tests", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");

    // Check page loaded
    await expect(page).toHaveTitle(/TUEL/i);

    // Check no console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any delayed errors
    await page.waitForTimeout(1000);

    expect(errors.length).toBe(0);
  });

  test("all critical packages load without errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/");

    // Wait for page to stabilize
    await page.waitForLoadState("networkidle");

    // No critical errors should occur
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes("Not implemented") && // Ignore jsdom warnings
        !err.includes("Canvas") // Ignore canvas warnings in test
    );

    expect(criticalErrors.length).toBe(0);
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");

    // Check if there are any navigation links
    const links = await page.locator("a[href]").count();

    // Should have some links
    expect(links).toBeGreaterThan(0);
  });

  test("no broken images", async ({ page }) => {
    await page.goto("/");

    // Wait for images to load
    await page.waitForLoadState("networkidle");

    // Check all images
    const images = await page.locator("img").all();

    for (const img of images) {
      const src = await img.getAttribute("src");
      if (src && !src.startsWith("data:")) {
        // Check if image has natural dimensions (loaded successfully)
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test("no accessibility violations on homepage", async ({ page }) => {
    await page.goto("/");

    // Basic accessibility checks
    // Check for proper heading hierarchy
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check all buttons have accessible names
    const buttons = await page.locator("button").all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute("aria-label");
      const text = await button.textContent();

      // Button should have either text or aria-label
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  });
});
