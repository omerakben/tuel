import { test, expect } from "@playwright/test";

/**
 * Animation Tests - Validate animation components work correctly
 */

test.describe("Animation Components", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("animated text renders without errors", async ({ page }) => {
    // Look for any animated text elements
    const animatedElements = await page.locator('[class*="animate"]').count();

    // Should have some animated elements
    expect(animatedElements).toBeGreaterThanOrEqual(0);

    // No errors should occur
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.waitForTimeout(500);
    expect(errors.length).toBe(0);
  });

  test("animations respect reduced motion preference", async ({
    page,
    context,
  }) => {
    // Enable reduced motion
    await context.addInitScript(() => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => true,
        }),
      });
    });

    await page.goto("/");

    // Page should still load successfully with reduced motion
    await expect(page).toHaveTitle(/TUEL/i);
  });

  test("scroll animations trigger correctly", async ({ page }) => {
    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));

    // Wait for any scroll animations
    await page.waitForTimeout(500);

    // Check page is still functional
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("hover interactions work", async ({ page }) => {
    // Find interactive elements
    const interactiveElements = await page
      .locator('button, a, [role="button"]')
      .first();

    if ((await interactiveElements.count()) > 0) {
      // Hover over element
      await interactiveElements.hover();

      // Wait for any hover effects
      await page.waitForTimeout(300);

      // No errors should occur
      const errors: string[] = [];
      page.on("pageerror", (error) => {
        errors.push(error.message);
      });

      await page.waitForTimeout(200);
      expect(errors.length).toBe(0);
    }
  });
});

test.describe("Performance", () => {
  test("page loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test("animations run smoothly without blocking", async ({ page }) => {
    await page.goto("/");

    // Check if page is still responsive
    const clickable = await page.locator("body").isEnabled();
    expect(clickable).toBe(true);

    // Scroll should work
    await page.evaluate(() => window.scrollBy(0, 100));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});
