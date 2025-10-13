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

  async checkInputSanitization(selector: string, maliciousInput: string) {
    // Test input sanitization
    await this.page.fill(selector, maliciousInput);

    // Check if malicious content was sanitized
    const content = await this.page.locator(selector).textContent();
    expect(content).not.toContain("<script>");
    expect(content).not.toContain("javascript:");
    expect(content).not.toContain("onload=");
  }

  async checkDependencyVulnerabilities() {
    // Check for known vulnerable dependencies
    const vulnerabilities = await this.page.evaluate(() => {
      // This would typically check package.json or run npm audit
      // For now, we'll check if certain vulnerable libraries are present
      const scripts = Array.from(document.scripts);
      const vulnerablePatterns = [/jquery.*1\./, /lodash.*4\./, /moment\.js/];

      return scripts.some((script) =>
        vulnerablePatterns.some((pattern) => pattern.test(script.src))
      );
    });

    expect(vulnerabilities).toBe(false);
  }

  async checkSecureHeaders() {
    const response = await this.page.goto("/");
    const headers = response?.headers();

    // Check for security headers
    expect(headers?.["x-frame-options"]).toBeTruthy();
    expect(headers?.["x-content-type-options"]).toBeTruthy();
    expect(headers?.["x-xss-protection"]).toBeTruthy();
    expect(headers?.["strict-transport-security"]).toBeTruthy();
  }

  async checkDataLeakage() {
    // Check for sensitive data in console logs
    const consoleLogs: string[] = [];
    this.page.on("console", (msg) => {
      consoleLogs.push(msg.text());
    });

    await this.page.goto("/");
    await this.page.waitForTimeout(2000);

    // Check for sensitive data patterns
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /api_key/i,
    ];

    const hasSensitiveData = consoleLogs.some((log) =>
      sensitivePatterns.some((pattern) => pattern.test(log))
    );

    expect(hasSensitiveData).toBe(false);
  }

  async checkAnimationSecurity() {
    // Test animation components for security issues
    const components = [
      '[data-testid="magnetic-button"]',
      '[data-testid="carousel"]',
      '[data-testid="horizontal-scroll"]',
      '[data-testid="animated-text"]',
    ];

    for (const component of components) {
      const element = this.page.locator(component);
      if (await element.isVisible()) {
        // Test for potential XSS in animation props
        const innerHTML = await element.innerHTML();
        expect(innerHTML).not.toContain("<script>");
        expect(innerHTML).not.toContain("javascript:");

        // Test for unsafe style attributes
        const style = await element.getAttribute("style");
        if (style) {
          expect(style).not.toContain("javascript:");
          expect(style).not.toContain("expression(");
        }
      }
    }
  }

  async checkErrorBoundarySecurity() {
    // Test error boundaries don't leak sensitive information
    await this.page.evaluate(() => {
      // Trigger an error
      throw new Error("Test error");
    });

    await this.page.waitForTimeout(1000);

    // Check if error boundary is displayed
    const errorBoundary = this.page.locator(".tuel-error-boundary");
    await expect(errorBoundary).toBeVisible();

    // Check that error details are not exposed in production
    const errorText = await errorBoundary.textContent();
    expect(errorText).not.toContain("Test error");
    expect(errorText).not.toContain("stack trace");
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

  test("secure headers", async ({ page }) => {
    await utils.checkSecureHeaders();
  });

  test("data leakage prevention", async ({ page }) => {
    await utils.checkDataLeakage();
  });

  test("dependency vulnerabilities", async ({ page }) => {
    await utils.checkDependencyVulnerabilities();
  });

  test("animation components security", async ({ page }) => {
    await page.goto("/interaction");
    await utils.checkAnimationSecurity();
  });

  test("error boundary security", async ({ page }) => {
    await utils.checkErrorBoundarySecurity();
  });
});

// Animation-specific security tests
test.describe("Animation Security Tests", () => {
  let utils: SecurityTestUtils;

  test.beforeEach(async ({ page }) => {
    utils = new SecurityTestUtils(page);
  });

  test("magnetic button XSS protection", async ({ page }) => {
    await page.goto("/interaction");

    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();

    // Test for XSS in button content
    const innerHTML = await button.innerHTML();
    expect(innerHTML).not.toContain("<script>");
    expect(innerHTML).not.toContain("javascript:");
    expect(innerHTML).not.toContain("onload=");
  });

  test("carousel XSS protection", async ({ page }) => {
    await page.goto("/ui");

    const carousel = page.locator('[data-testid="carousel"]');
    await expect(carousel).toBeVisible();

    // Test for XSS in carousel content
    const innerHTML = await carousel.innerHTML();
    expect(innerHTML).not.toContain("<script>");
    expect(innerHTML).not.toContain("javascript:");
    expect(innerHTML).not.toContain("onload=");
  });

  test("horizontal scroll XSS protection", async ({ page }) => {
    await page.goto("/scroll");

    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');
    await expect(scrollContainer).toBeVisible();

    // Test for XSS in scroll content
    const innerHTML = await scrollContainer.innerHTML();
    expect(innerHTML).not.toContain("<script>");
    expect(innerHTML).not.toContain("javascript:");
    expect(innerHTML).not.toContain("onload=");
  });

  test("animated text XSS protection", async ({ page }) => {
    await page.goto("/text-effects");

    const animatedText = page.locator('[data-testid="animated-text"]');
    await expect(animatedText).toBeVisible();

    // Test for XSS in animated text content
    const innerHTML = await animatedText.innerHTML();
    expect(innerHTML).not.toContain("<script>");
    expect(innerHTML).not.toContain("javascript:");
    expect(innerHTML).not.toContain("onload=");
  });

  test("three.js canvas security", async ({ page }) => {
    await page.goto("/three");

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();

    // Test for XSS in canvas content
    const innerHTML = await canvas.innerHTML();
    expect(innerHTML).not.toContain("<script>");
    expect(innerHTML).not.toContain("javascript:");
    expect(innerHTML).not.toContain("onload=");
  });

  test("performance monitoring security", async ({ page }) => {
    await page.goto("/interaction");

    // Check that performance monitoring doesn't expose sensitive data
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      consoleLogs.push(msg.text());
    });

    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();
    await button.click();

    await page.waitForTimeout(1000);

    // Check for sensitive data in performance logs
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /api_key/i,
    ];

    const hasSensitiveData = consoleLogs.some((log) =>
      sensitivePatterns.some((pattern) => pattern.test(log))
    );

    expect(hasSensitiveData).toBe(false);
  });

  test("accessibility features security", async ({ page }) => {
    await page.goto("/ui");

    const carousel = page.locator('[data-testid="carousel"]');
    await expect(carousel).toBeVisible();

    // Test that ARIA attributes don't contain malicious content
    const ariaLabel = await carousel.getAttribute("aria-label");
    if (ariaLabel) {
      expect(ariaLabel).not.toContain("<script>");
      expect(ariaLabel).not.toContain("javascript:");
      expect(ariaLabel).not.toContain("onload=");
    }

    const ariaDescribedby = await carousel.getAttribute("aria-describedby");
    if (ariaDescribedby) {
      expect(ariaDescribedby).not.toContain("<script>");
      expect(ariaDescribedby).not.toContain("javascript:");
      expect(ariaDescribedby).not.toContain("onload=");
    }
  });

  test("error boundary information disclosure", async ({ page }) => {
    await page.goto("/interaction");

    // Trigger an error in a component
    await page.evaluate(() => {
      const element = document.querySelector('[data-testid="magnetic-button"]');
      if (element) {
        element.addEventListener("click", () => {
          throw new Error("Sensitive error information");
        });
      }
    });

    const button = page.locator('[data-testid="magnetic-button"]');
    await button.click();

    await page.waitForTimeout(1000);

    // Check that error boundary doesn't expose sensitive information
    const errorBoundary = page.locator(".tuel-error-boundary");
    await expect(errorBoundary).toBeVisible();

    const errorText = await errorBoundary.textContent();
    expect(errorText).not.toContain("Sensitive error information");
    expect(errorText).not.toContain("stack trace");
    expect(errorText).not.toContain("Error:");
  });
});
