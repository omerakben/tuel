import { test, expect, Page } from "@playwright/test";

// Visual regression test configuration
const VISUAL_THRESHOLD = 0.2; // 20% difference threshold
const ANIMATION_WAIT_TIME = 2000; // Wait for animations to complete

// Test utilities for visual regression
class VisualTestUtils {
  constructor(private page: Page) {}

  async waitForAnimation(selector: string) {
    await this.page.waitForSelector(selector, { state: "visible" });
    await this.page.waitForTimeout(ANIMATION_WAIT_TIME);
  }

  async captureElementScreenshot(selector: string, name: string) {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();

    // Wait for any animations to complete
    await this.page.waitForTimeout(1000);

    await expect(element).toHaveScreenshot(`${name}.png`, {
      threshold: VISUAL_THRESHOLD,
      animations: "disabled", // Disable animations for consistent screenshots
    });
  }

  async captureFullPageScreenshot(name: string) {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);

    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      threshold: VISUAL_THRESHOLD,
      animations: "disabled",
      fullPage: true,
    });
  }

  async testResponsiveDesign(selector: string, name: string) {
    const viewports = [
      { width: 320, height: 568, name: "mobile" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 1024, height: 768, name: "desktop" },
      { width: 1920, height: 1080, name: "large-desktop" },
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await this.page.waitForTimeout(500); // Wait for layout to adjust

      await this.captureElementScreenshot(selector, `${name}-${viewport.name}`);
    }
  }

  async testDarkMode(selector: string, name: string) {
    // Test light mode
    await this.page.emulateMedia({ colorScheme: "light" });
    await this.page.waitForTimeout(500);
    await this.captureElementScreenshot(selector, `${name}-light`);

    // Test dark mode
    await this.page.emulateMedia({ colorScheme: "dark" });
    await this.page.waitForTimeout(500);
    await this.captureElementScreenshot(selector, `${name}-dark`);
  }

  async testReducedMotion(selector: string, name: string) {
    // Test normal motion
    await this.page.emulateMedia({ reducedMotion: "no-preference" });
    await this.page.waitForTimeout(500);
    await this.captureElementScreenshot(selector, `${name}-normal-motion`);

    // Test reduced motion
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.page.waitForTimeout(500);
    await this.captureElementScreenshot(selector, `${name}-reduced-motion`);
  }
}

// Visual regression tests for AnimatedText component
test.describe("AnimatedText Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/text-effects");
  });

  test("fade animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-fade"
    );
  });

  test("slide animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-slide"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-slide"
    );
  });

  test("typewriter animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-typewriter"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-typewriter"
    );
  });

  test("wave animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-wave"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-wave"
    );
  });

  test("split animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-split"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-split"
    );
  });

  test("explode animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-explode"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-explode"
    );
  });

  test("scramble animation visual state", async ({ page }) => {
    await page.click('[data-testid="variant-scramble"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animated-text-scramble"
    );
  });

  test("responsive design for animated text", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.testResponsiveDesign(
      '[data-testid="animated-text"]',
      "animated-text-responsive"
    );
  });

  test("dark mode support for animated text", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.testDarkMode(
      '[data-testid="animated-text"]',
      "animated-text-theme"
    );
  });

  test("reduced motion support for animated text", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.testReducedMotion(
      '[data-testid="animated-text"]',
      "animated-text-motion"
    );
  });

  test("error boundary visual state", async ({ page }) => {
    // Trigger an error
    await page.evaluate(() => {
      const element = document.querySelector('[data-testid="animated-text"]');
      if (element) {
        element.addEventListener("animationstart", () => {
          throw new Error("Visual test error");
        });
      }
    });

    await page.click('[data-testid="variant-fade"]');
    await page.waitForTimeout(1000);

    await utils.captureElementScreenshot(
      ".tuel-error-boundary",
      "error-boundary-visual"
    );
  });
});

// Visual regression tests for Scroll components
test.describe("Scroll Components Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/scroll");
  });

  test("horizontal scroll visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="horizontal-scroll"]');

    await utils.captureElementScreenshot(
      '[data-testid="horizontal-scroll"]',
      "horizontal-scroll"
    );
  });

  test("parallax scroll visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="parallax-scroll"]');

    await utils.captureElementScreenshot(
      '[data-testid="parallax-scroll"]',
      "parallax-scroll"
    );
  });

  test("scroll components responsive design", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="horizontal-scroll"]');

    await utils.testResponsiveDesign(
      '[data-testid="horizontal-scroll"]',
      "scroll-responsive"
    );
  });

  test("scroll components dark mode", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="horizontal-scroll"]');

    await utils.testDarkMode(
      '[data-testid="horizontal-scroll"]',
      "scroll-theme"
    );
  });
});

// Visual regression tests for Gallery components
test.describe("Gallery Components Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/gallery");
  });

  test("image gallery visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="image-gallery"]');

    await utils.captureElementScreenshot(
      '[data-testid="image-gallery"]',
      "image-gallery"
    );
  });

  test("gallery navigation visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="image-gallery"]');

    // Test navigation buttons
    await utils.captureElementScreenshot(
      '[data-testid="gallery-nav"]',
      "gallery-navigation"
    );
  });

  test("gallery responsive design", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="image-gallery"]');

    await utils.testResponsiveDesign(
      '[data-testid="image-gallery"]',
      "gallery-responsive"
    );
  });

  test("gallery dark mode", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="image-gallery"]');

    await utils.testDarkMode('[data-testid="image-gallery"]', "gallery-theme");
  });
});

// Visual regression tests for Three.js components
test.describe("Three.js Components Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/three");
  });

  test("3D scene visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="three-scene"]');

    await utils.captureElementScreenshot(
      '[data-testid="three-scene"]',
      "three-scene"
    );
  });

  test("3D scene responsive design", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="three-scene"]');

    await utils.testResponsiveDesign(
      '[data-testid="three-scene"]',
      "three-responsive"
    );
  });

  test("3D scene dark mode", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="three-scene"]');

    await utils.testDarkMode('[data-testid="three-scene"]', "three-theme");
  });
});

// Visual regression tests for UI components
test.describe("UI Components Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/ui");
  });

  test("button component visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="button-primary"]');

    await utils.captureElementScreenshot(
      '[data-testid="button-primary"]',
      "button-primary"
    );
    await utils.captureElementScreenshot(
      '[data-testid="button-secondary"]',
      "button-secondary"
    );
  });

  test("card component visual state", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="card"]');

    await utils.captureElementScreenshot(
      '[data-testid="card"]',
      "card-component"
    );
  });

  test("modal component visual state", async ({ page }) => {
    await page.click('[data-testid="open-modal"]');
    await utils.waitForAnimation('[data-testid="modal"]');

    await utils.captureElementScreenshot(
      '[data-testid="modal"]',
      "modal-component"
    );
  });

  test("tooltip component visual state", async ({ page }) => {
    await page.hover('[data-testid="tooltip-trigger"]');
    await utils.waitForAnimation('[data-testid="tooltip"]');

    await utils.captureElementScreenshot(
      '[data-testid="tooltip"]',
      "tooltip-component"
    );
  });

  test("UI components responsive design", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="button-primary"]');

    await utils.testResponsiveDesign(
      '[data-testid="ui-container"]',
      "ui-responsive"
    );
  });

  test("UI components dark mode", async ({ page }) => {
    await utils.waitForAnimation('[data-testid="button-primary"]');

    await utils.testDarkMode('[data-testid="ui-container"]', "ui-theme");
  });
});

// Visual regression tests for full pages
test.describe("Full Page Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
  });

  test("homepage visual state", async ({ page }) => {
    await page.goto("/");
    await utils.waitForAnimation("main");

    await utils.captureFullPageScreenshot("homepage");
  });

  test("text effects page visual state", async ({ page }) => {
    await page.goto("/text-effects");
    await utils.waitForAnimation("main");

    await utils.captureFullPageScreenshot("text-effects-page");
  });

  test("scroll page visual state", async ({ page }) => {
    await page.goto("/scroll");
    await utils.waitForAnimation("main");

    await utils.captureFullPageScreenshot("scroll-page");
  });

  test("gallery page visual state", async ({ page }) => {
    await page.goto("/gallery");
    await utils.waitForAnimation("main");

    await utils.captureFullPageScreenshot("gallery-page");
  });

  test("three page visual state", async ({ page }) => {
    await page.goto("/three");
    await utils.waitForAnimation("main");

    await utils.captureFullPageScreenshot("three-page");
  });

  test("ui page visual state", async ({ page }) => {
    await page.goto("/ui");
    await utils.waitForAnimation("main");

    await utils.captureFullPageScreenshot("ui-page");
  });

  test("full pages responsive design", async ({ page }) => {
    const pages = [
      "/",
      "/text-effects",
      "/scroll",
      "/gallery",
      "/three",
      "/ui",
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await utils.waitForAnimation("main");

      const pageName = pagePath === "/" ? "homepage" : pagePath.slice(1);
      await utils.testResponsiveDesign("main", `${pageName}-responsive`);
    }
  });

  test("full pages dark mode", async ({ page }) => {
    const pages = [
      "/",
      "/text-effects",
      "/scroll",
      "/gallery",
      "/three",
      "/ui",
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await utils.waitForAnimation("main");

      const pageName = pagePath === "/" ? "homepage" : pagePath.slice(1);
      await utils.testDarkMode("main", `${pageName}-theme`);
    }
  });
});

// Visual regression tests for cross-browser compatibility
test.describe("Cross-browser Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/text-effects");
  });

  test("Chrome visual consistency", async ({ page, browserName }) => {
    if (browserName !== "chromium") return;

    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "chrome-animated-text"
    );
  });

  test("Firefox visual consistency", async ({ page, browserName }) => {
    if (browserName !== "firefox") return;

    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "firefox-animated-text"
    );
  });

  test("Safari visual consistency", async ({ page, browserName }) => {
    if (browserName !== "webkit") return;

    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "safari-animated-text"
    );
  });
});

// Visual regression tests for animation states
test.describe("Animation State Visual Regression", () => {
  let utils: VisualTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new VisualTestUtils(page);
    await page.goto("/text-effects");
  });

  test("animation start state", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');

    // Capture immediately after click (start state)
    await page.waitForTimeout(100);
    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animation-start"
    );
  });

  test("animation middle state", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');

    // Capture in the middle of animation
    await page.waitForTimeout(500);
    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animation-middle"
    );
  });

  test("animation end state", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');

    // Capture after animation completes
    await utils.waitForAnimation('[data-testid="animated-text"]');
    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animation-end"
    );
  });

  test("animation hover state", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    // Test hover state
    await page.hover('[data-testid="animated-text"]');
    await page.waitForTimeout(500);
    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animation-hover"
    );
  });

  test("animation focus state", async ({ page }) => {
    await page.click('[data-testid="variant-fade"]');
    await utils.waitForAnimation('[data-testid="animated-text"]');

    // Test focus state
    await page.focus('[data-testid="animated-text"]');
    await page.waitForTimeout(500);
    await utils.captureElementScreenshot(
      '[data-testid="animated-text"]',
      "animation-focus"
    );
  });
});
