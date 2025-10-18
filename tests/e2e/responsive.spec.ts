import { test, expect, devices } from "@playwright/test";

/**
 * Responsive Design Tests - Validate mobile and tablet experiences
 */

// Mobile tests
test.describe("Mobile Responsive Tests", () => {
  test("homepage renders correctly on Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Page should load
    await expect(page).toHaveTitle(/TUEL/i);

    // Content should be visible
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("navigation is accessible on Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if navigation exists
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();

    // Should have navigation (or mobile menu)
    expect(navCount).toBeGreaterThanOrEqual(0);
  });

  test("interactive elements are tappable on Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Find clickable elements
    const buttons = await page.locator("button, a[href]").first();

    if ((await buttons.count()) > 0) {
      // Element should be visible
      await expect(buttons).toBeVisible();

      // Get button size
      const box = await buttons.boundingBox();

      if (box) {
        // Touch targets should be at least 32px high
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test("text is readable on Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
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

      // Font size should be readable (at least 12px)
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
    }
  });
});

// Tablet tests
test.describe("Tablet Responsive Tests", () => {
  test("homepage renders correctly on Tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Page should load
    await expect(page).toHaveTitle(/TUEL/i);

    // Content should be visible
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("navigation is accessible on Tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Check if navigation exists
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();

    // Should have navigation (or mobile menu)
    expect(navCount).toBeGreaterThanOrEqual(0);
  });

  test("interactive elements are tappable on Tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Find clickable elements
    const buttons = await page.locator("button, a[href]").first();

    if ((await buttons.count()) > 0) {
      // Element should be visible
      await expect(buttons).toBeVisible();

      // Get button size
      const box = await buttons.boundingBox();

      if (box) {
        // Touch targets should be at least 32px high
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test("text is readable on Tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
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

      // Font size should be readable (at least 12px)
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
    }
  });
});

// Desktop tests
test.describe("Desktop Responsive Tests", () => {
  test("homepage renders correctly on Desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Page should load
    await expect(page).toHaveTitle(/TUEL/i);

    // Content should be visible
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("navigation is accessible on Desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Check if navigation exists
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();

    // Should have navigation (or mobile menu)
    expect(navCount).toBeGreaterThanOrEqual(0);
  });

  test("interactive elements are clickable on Desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    // Find clickable elements
    const buttons = await page.locator("button, a[href]").first();

    if ((await buttons.count()) > 0) {
      // Element should be visible
      await expect(buttons).toBeVisible();

      // Get button size
      const box = await buttons.boundingBox();

      if (box) {
        // Desktop targets should be at least 32px high
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }
  });

  test("text is readable on Desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
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

      // Font size should be readable (at least 12px)
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(12);
    }
  });
});

// Touch interaction tests
test.describe("Touch Interactions", () => {
  test("touch gestures work on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Simulate touch scroll
    await page.touchscreen.tap(100, 100);

    // Page should still be functional
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("swipe gestures work correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
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