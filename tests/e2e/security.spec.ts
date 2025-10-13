import { test, expect, Page } from "@playwright/test";

// Security test utilities
class SecurityTestUtils {
  constructor(private page: Page) {}

  async checkXSSVulnerability(input: string, selector: string) {
    // Test for XSS vulnerabilities
    await this.page.fill(selector, input);
    await this.page.click('[data-testid="submit"]');

    // Check if script was executed
    const scriptExecuted = await this.page.evaluate(() => {
      return typeof (window as any).xssTest !== "undefined";
    });

    expect(scriptExecuted).toBe(false);
  }

  async checkCSRFProtection() {
    // Test CSRF protection
    const response = await this.page.request.post("/api/test", {
      data: { test: "csrf" },
      headers: {
        Origin: "http://malicious-site.com",
        Referer: "http://malicious-site.com",
      },
    });

    expect(response.status()).toBe(403);
  }

  async checkContentSecurityPolicy() {
    const response = await this.page.goto("/");
    const headers = response?.headers();

    expect(headers?.["content-security-policy"]).toBeTruthy();
  }

  async checkHTTPSRedirect() {
    const response = await this.page.goto("http://localhost:3000");
    expect(response?.url()).toContain("https://");
  }
}

// Security test suite
test.describe("Security Tests", () => {
  let utils: SecurityTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new SecurityTestUtils(page);
  });

  test("XSS protection in text inputs", async ({ page }) => {
    await page.goto("/text-effects");

    const maliciousInputs = [
      "<script>window.xssTest = true</script>",
      "<img src=x onerror=alert(1)>",
      "javascript:alert(1)",
      "<svg onload=alert(1)>",
    ];

    for (const input of maliciousInputs) {
      await utils.checkXSSVulnerability(input, '[data-testid="text-input"]');
    }
  });

  test("CSRF protection", async ({ page }) => {
    await utils.checkCSRFProtection();
  });

  test("Content Security Policy", async ({ page }) => {
    await utils.checkContentSecurityPolicy();
  });

  test("HTTPS redirect", async ({ page }) => {
    await utils.checkHTTPSRedirect();
  });
});
