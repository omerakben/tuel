import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting TUEL E2E Test Suite");

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Check if the application is running
    const baseURL = config.projects[0].use?.baseURL || "http://localhost:3000";
    console.log(`📡 Checking application at ${baseURL}`);

    await page.goto(baseURL, { timeout: 30000 });

    // Wait for the application to be ready
    await page.waitForLoadState("networkidle");

    // Check if TUEL components are loaded
    const tuelLoaded = await page.evaluate(() => {
      return (
        typeof window !== "undefined" &&
        document.querySelector('[data-testid="animated-text"]') !== null
      );
    });

    if (!tuelLoaded) {
      console.log(
        "⚠️  TUEL components not detected, but continuing with tests..."
      );
    } else {
      console.log("✅ TUEL components detected and ready");
    }

    // Set up test data
    await page.evaluate(() => {
      // Store test data in localStorage
      localStorage.setItem(
        "tuel-test-data",
        JSON.stringify({
          testMode: true,
          performanceMonitoring: true,
          accessibilityTesting: true,
          timestamp: Date.now(),
        })
      );
    });

    console.log("✅ Global setup completed");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
