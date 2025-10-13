import { chromium, FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Cleaning up TUEL E2E Test Suite");

  // Launch browser for cleanup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    const baseURL = config.projects[0].use?.baseURL || "http://localhost:3000";

    // Navigate to the application
    await page.goto(baseURL);

    // Clear test data
    await page.evaluate(() => {
      localStorage.removeItem("tuel-test-data");
      localStorage.removeItem("tuel-errors");

      // Clear any test-related cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    });

    // Generate test summary
    const testSummary = await page.evaluate(() => {
      const errors = JSON.parse(localStorage.getItem("tuel-errors") || "[]");
      const testData = JSON.parse(
        localStorage.getItem("tuel-test-data") || "{}"
      );

      return {
        errorsFound: errors.length,
        testDuration: Date.now() - (testData.timestamp || Date.now()),
        performanceMetrics: (performance as any).memory || null,
      };
    });

    console.log("📊 Test Summary:", testSummary);

    if (testSummary.errorsFound > 0) {
      console.log(
        `⚠️  ${testSummary.errorsFound} errors were logged during testing`
      );
    }

    console.log("✅ Global teardown completed");
  } catch (error) {
    console.error("❌ Global teardown failed:", error);
    // Don't throw error in teardown to avoid masking test failures
  } finally {
    await browser.close();
  }
}

export default globalTeardown;
