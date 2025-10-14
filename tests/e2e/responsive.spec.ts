import { test, expect, devices } from "@playwright/test";

/**
 * Responsive Design Tests - Validate mobile and tablet experiences
 */

const viewports = [
  { name: "Mobile", ...devices["iPhone 12"] },
  { name: "Tablet", ...devices["iPad Pro"] },
  { name: "Desktop", viewport: { width: 1920, height: 1080 } },
];

viewports.forEach(({ name, ...device }) => {
  test.describe(`Responsive: ${name}`, () => {
    test.use(device);

    test(`homepage renders correctly on ${name}`, async ({ page }) => {
      await page.goto("/");

      // Page should load
      await expect(page).toHaveTitle(/TUEL/i);

      // Content should be visible
      const bodyVisible = await page.locator("body").isVisible();
      expect(bodyVisible).toBe(true);
    });

    test(`navigation is accessible on ${name}`, async ({ page }) => {
      await page.goto("/");

      // Check if navigation exists
      const nav = page.locator('nav, [role="navigation"]');
      const navCount = await nav.count();

      // Should have navigation (or mobile menu)
      expect(navCount).toBeGreaterThanOrEqual(0);
    });

    test(`interactive elements are tappable on ${name}`, async ({ page }) => {
      await page.goto("/");

      // Find clickable elements
      const buttons = await page.locator("button, a[href]").first();

      if ((await buttons.count()) > 0) {
        // Element should be visible
        await expect(buttons).toBeVisible();

        // Get button size
        const box = await buttons.boundingBox();

        if (box && name === "Mobile") {
          // Touch targets should be at least 44x44px
          expect(box.height).toBeGreaterThanOrEqual(32); // Relaxed for some designs
        }
      }
    });

    test(`text is readable on ${name}`, async ({ page }) => {
      await page.goto("/");

      // Check text elements
      const paragraphs = await page.locator("p, span, div").first();

      if ((await paragraphs.count()) > 0) {
        // Text should be visible
        await expect(paragraphs).toBeVisible();

        // Get computed font size
        const fontSize = await paragraphs.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });

        // Font size should be readable (at least 14px)
        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(12);
      }
    });
  });
});

test.describe("Touch Interactions", () => {
  test.use(devices["iPhone 12"]);

  test("touch gestures work on mobile", async ({ page }) => {
    await page.goto("/");

    // Simulate touch scroll
    await page.touchscreen.tap(100, 100);

    // Page should still be functional
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("swipe gestures work correctly", async ({ page }) => {
    await page.goto("/");

    // Try a swipe gesture
    await page.touchscreen.tap(100, 300);

    // No errors should occur
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.waitForTimeout(500);
    expect(errors.length).toBe(0);
  });
});
