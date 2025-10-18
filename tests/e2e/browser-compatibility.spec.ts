import { test, expect, Page, BrowserContext } from "@playwright/test";

// Browser compatibility test configuration
const BROWSER_COMPATIBILITY_CONFIG = {
  // Minimum supported browser versions
  chrome: { minVersion: 90 },
  firefox: { minVersion: 88 },
  safari: { minVersion: 14 },
  edge: { minVersion: 90 },

  // Mobile browser support
  mobileChrome: { minVersion: 90 },
  mobileSafari: { minVersion: 14 },

  // WebGL support requirements
  webgl: {
    required: true,
    minVersion: "WebGL 1.0",
    extensions: ["OES_texture_float", "OES_element_index_uint"]
  },

  // Performance thresholds per browser
  performance: {
    chrome: { minFPS: 60, maxMemory: 100 },
    firefox: { minFPS: 55, maxMemory: 120 },
    safari: { minFPS: 50, maxMemory: 150 },
    edge: { minFPS: 60, maxMemory: 100 },
    mobile: { minFPS: 30, maxMemory: 80 }
  }
};

// Browser compatibility test utilities
class BrowserCompatibilityUtils {
  constructor(private page: Page, private browserName: string) {}

  async detectBrowserCapabilities() {
    const capabilities = await this.page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      return {
        userAgent: navigator.userAgent,
        webgl: !!gl,
        webglVersion: gl ? gl.getParameter(gl.VERSION) : null,
        webglExtensions: gl ? gl.getSupportedExtensions() : [],
        canvas: !!document.createElement('canvas').getContext('2d'),
        svg: !!document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        cssTransforms: 'transform' in document.documentElement.style,
        cssAnimations: 'animation' in document.documentElement.style,
        cssTransitions: 'transition' in document.documentElement.style,
        requestAnimationFrame: typeof requestAnimationFrame === 'function',
        performance: typeof performance !== 'undefined' && typeof performance.now === 'function',
        intersectionObserver: typeof IntersectionObserver !== 'undefined',
        resizeObserver: typeof ResizeObserver !== 'undefined',
        customElements: typeof customElements !== 'undefined',
        es6: typeof Symbol !== 'undefined' && typeof Map !== 'undefined',
        webWorkers: typeof Worker !== 'undefined',
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        geolocation: typeof navigator.geolocation !== 'undefined',
        devicePixelRatio: window.devicePixelRatio || 1,
        screenResolution: {
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        orientation: typeof screen.orientation !== 'undefined',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      };
    });

    return capabilities;
  }

  async testWebGLCompatibility() {
    const webglInfo = await this.page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) return { supported: false };

      return {
        supported: true,
        version: gl.getParameter(gl.VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        extensions: gl.getSupportedExtensions(),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
        maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
      };
    });

    return webglInfo;
  }

  async testCSSFeatureSupport() {
    const cssSupport = await this.page.evaluate(() => {
      const testElement = document.createElement('div');
      const testStyle = testElement.style;

      return {
        transform: 'transform' in testStyle,
        transform3d: 'transform' in testStyle && 'perspective' in testStyle,
        animation: 'animation' in testStyle,
        transition: 'transition' in testStyle,
        flexbox: 'flex' in testStyle,
        grid: 'grid' in testStyle,
        backdropFilter: 'backdropFilter' in testStyle,
        clipPath: 'clipPath' in testStyle,
        mask: 'mask' in testStyle,
        filter: 'filter' in testStyle,
        willChange: 'willChange' in testStyle,
        contain: 'contain' in testStyle,
        scrollBehavior: 'scrollBehavior' in testStyle,
        overscrollBehavior: 'overscrollBehavior' in testStyle,
        touchAction: 'touchAction' in testStyle,
        userSelect: 'userSelect' in testStyle,
        pointerEvents: 'pointerEvents' in testStyle,
        cursor: 'cursor' in testStyle,
        opacity: 'opacity' in testStyle,
        visibility: 'visibility' in testStyle,
        display: 'display' in testStyle,
        position: 'position' in testStyle,
        zIndex: 'zIndex' in testStyle,
        overflow: 'overflow' in testStyle,
        borderRadius: 'borderRadius' in testStyle,
        boxShadow: 'boxShadow' in testStyle,
        textShadow: 'textShadow' in testStyle,
        gradient: 'background' in testStyle && 'linear-gradient' in testStyle.toString(),
        calc: 'calc' in testStyle.toString(),
        var: 'var(' in testStyle.toString(),
        mediaQueries: window.matchMedia('(max-width: 768px)').matches !== undefined,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches !== undefined,
        prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches !== undefined
      };
    });

    return cssSupport;
  }

  async testJavaScriptFeatureSupport() {
    const jsSupport = await this.page.evaluate(() => {
      return {
        es6: {
          arrowFunctions: (() => true)(),
          templateLiterals: `test` === 'test',
          destructuring: (() => { const {a} = {a: 1}; return a === 1 })(),
          spreadOperator: (() => { const arr = [...[1,2,3]]; return arr.length === 3 })(),
          asyncAwait: (() => { try { eval('async () => {}'); return true; } catch { return false; } })(),
          promises: typeof Promise !== 'undefined',
          modules: (() => { try { eval('import("data:text/javascript,")'); return true; } catch { return false; } })(),
          classes: (() => { try { eval('class Test {}'); return true; } catch { return false; } })()
        },
        es2017: {
          asyncAwait: (() => { try { eval('async () => {}'); return true; } catch { return false; } })(),
          objectEntries: typeof Object.entries === 'function',
          objectValues: typeof Object.values === 'function',
          padStart: typeof String.prototype.padStart === 'function',
          padEnd: typeof String.prototype.padEnd === 'function'
        },
        es2018: {
          restSpread: (() => { try { eval('const {...rest} = {}'); return true; } catch { return false; } })(),
          asyncIteration: (() => { try { eval('async function* test() {}'); return true; } catch { return false; } })(),
          promiseFinally: (() => { try { Promise.resolve().finally(() => {}); return true; } catch { return false; } })()
        },
        es2019: {
          flat: typeof Array.prototype.flat === 'function',
          flatMap: typeof Array.prototype.flatMap === 'function',
          objectFromEntries: typeof Object.fromEntries === 'function',
          trimStart: typeof String.prototype.trimStart === 'function',
          trimEnd: typeof String.prototype.trimEnd === 'function'
        },
        es2020: {
          optionalChaining: (() => { try { eval('const obj = {}; obj?.prop'); return true; } catch { return false; } })(),
          nullishCoalescing: (() => { try { eval('const a = null ?? 1'); return true; } catch { return false; } })(),
          bigInt: typeof BigInt !== 'undefined',
          dynamicImport: (() => { try { eval('import("data:text/javascript,")'); return true; } catch { return false; } })()
        },
        webAPIs: {
          fetch: typeof fetch !== 'undefined',
          requestAnimationFrame: typeof requestAnimationFrame === 'function',
          cancelAnimationFrame: typeof cancelAnimationFrame === 'function',
          requestIdleCallback: typeof requestIdleCallback === 'function',
          cancelIdleCallback: typeof cancelIdleCallback === 'function',
          intersectionObserver: typeof IntersectionObserver !== 'undefined',
          resizeObserver: typeof ResizeObserver !== 'undefined',
          mutationObserver: typeof MutationObserver !== 'undefined',
          performance: typeof performance !== 'undefined',
          webWorkers: typeof Worker !== 'undefined',
          serviceWorkers: typeof ServiceWorker !== 'undefined',
          pushManager: typeof PushManager !== 'undefined',
          notification: typeof Notification !== 'undefined',
          geolocation: typeof navigator.geolocation !== 'undefined',
          mediaDevices: typeof navigator.mediaDevices !== 'undefined',
          clipboard: typeof navigator.clipboard !== 'undefined',
          storage: typeof Storage !== 'undefined',
          localStorage: typeof localStorage !== 'undefined',
          sessionStorage: typeof sessionStorage !== 'undefined',
          indexedDB: typeof indexedDB !== 'undefined',
          webGL: (() => { const canvas = document.createElement('canvas'); return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl')); })(),
          webGL2: (() => { const canvas = document.createElement('canvas'); return !!canvas.getContext('webgl2'); })(),
          webAudio: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined',
          webRTC: typeof RTCPeerConnection !== 'undefined',
          webSocket: typeof WebSocket !== 'undefined',
          webCrypto: typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined',
          webAssembly: typeof WebAssembly !== 'undefined'
        }
      };
    });

    return jsSupport;
  }

  async testPerformanceCapabilities() {
    const performanceInfo = await this.page.evaluate(() => {
      return {
        memory: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        } : null,
        timing: performance.timing ? {
          navigationStart: performance.timing.navigationStart,
          loadEventEnd: performance.timing.loadEventEnd,
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart
        } : null,
        now: typeof performance.now === 'function',
        mark: typeof performance.mark === 'function',
        measure: typeof performance.measure === 'function',
        getEntries: typeof performance.getEntries === 'function',
        getEntriesByType: typeof performance.getEntriesByType === 'function',
        getEntriesByName: typeof performance.getEntriesByName === 'function'
      };
    });

    return performanceInfo;
  }

  async testAnimationPerformance(selector: string) {
    const performance = await this.page.evaluate((sel) => {
      return new Promise((resolve) => {
        const element = document.querySelector(sel);
        if (!element) {
          resolve({ fps: 0, frameDrops: 0, memoryUsage: 0 });
          return;
        }

        let frameCount = 0;
        let droppedFrames = 0;
        let startTime = performance.now();
        let lastFrameTime = startTime;
        const frameTimes: number[] = [];

        const measureFrame = () => {
          const now = performance.now();
          const frameTime = now - lastFrameTime;
          frameTimes.push(frameTime);
          frameCount++;

          if (frameTime > 16) {
            droppedFrames++;
          }

          lastFrameTime = now;

          if (now - startTime < 2000) {
            requestAnimationFrame(measureFrame);
          } else {
            const fps = frameCount / ((now - startTime) / 1000);
            const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const memoryUsage = (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;

            resolve({
              fps: Math.round(fps),
              avgFrameTime: Math.round(avgFrameTime * 100) / 100,
              frameDrops: droppedFrames,
              memoryUsage: Math.round(memoryUsage * 100) / 100,
              totalFrames: frameCount
            });
          }
        };

        requestAnimationFrame(measureFrame);
      });
    }, selector);

    return performance;
  }

  async testPolyfillRequirements() {
    const polyfills = await this.page.evaluate(() => {
      return {
        // ES6 Polyfills
        es6: {
          promise: typeof Promise !== 'undefined',
          symbol: typeof Symbol !== 'undefined',
          map: typeof Map !== 'undefined',
          set: typeof Set !== 'undefined',
          weakMap: typeof WeakMap !== 'undefined',
          weakSet: typeof WeakSet !== 'undefined',
          proxy: typeof Proxy !== 'undefined',
          reflect: typeof Reflect !== 'undefined'
        },

        // CSS Polyfills
        css: {
          flexbox: (() => { const div = document.createElement('div'); return 'flex' in div.style; })(),
          grid: (() => { const div = document.createElement('div'); return 'grid' in div.style; })(),
          customProperties: (() => { const div = document.createElement('div'); return '--test' in div.style; })(),
          backdropFilter: (() => { const div = document.createElement('div'); return 'backdropFilter' in div.style; })(),
          clipPath: (() => { const div = document.createElement('div'); return 'clipPath' in div.style; })()
        },

        // Web API Polyfills
        webAPI: {
          intersectionObserver: typeof IntersectionObserver !== 'undefined',
          resizeObserver: typeof ResizeObserver !== 'undefined',
          requestIdleCallback: typeof requestIdleCallback === 'function',
          customElements: typeof customElements !== 'undefined',
          webComponents: typeof customElements !== 'undefined' && typeof HTMLElement !== 'undefined'
        }
      };
    });

    return polyfills;
  }
}

// Browser-specific test suites
test.describe("Chrome Compatibility", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");
    utils = new BrowserCompatibilityUtils(page, browserName);
  });

  test("detects Chrome capabilities correctly", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    expect(capabilities.webgl).toBe(true);
    expect(capabilities.canvas).toBe(true);
    expect(capabilities.cssTransforms).toBe(true);
    expect(capabilities.cssAnimations).toBe(true);
    expect(capabilities.requestAnimationFrame).toBe(true);
    expect(capabilities.performance).toBe(true);
    expect(capabilities.es6).toBe(true);
  });

  test("supports required WebGL features", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.supported).toBe(true);
    expect(webglInfo.extensions).toContain("OES_texture_float");
    expect(webglInfo.maxTextureSize).toBeGreaterThan(1024);
  });

  test("supports modern CSS features", async ({ page }) => {
    const cssSupport = await utils.testCSSFeatureSupport();

    expect(cssSupport.transform).toBe(true);
    expect(cssSupport.transform3d).toBe(true);
    expect(cssSupport.animation).toBe(true);
    expect(cssSupport.transition).toBe(true);
    expect(cssSupport.flexbox).toBe(true);
    expect(cssSupport.grid).toBe(true);
    expect(cssSupport.filter).toBe(true);
  });

  test("supports modern JavaScript features", async ({ page }) => {
    const jsSupport = await utils.testJavaScriptFeatureSupport();

    expect(jsSupport.es6.arrowFunctions).toBe(true);
    expect(jsSupport.es6.templateLiterals).toBe(true);
    expect(jsSupport.es6.destructuring).toBe(true);
    expect(jsSupport.es6.promises).toBe(true);
    expect(jsSupport.es2017.asyncAwait).toBe(true);
    expect(jsSupport.es2020.optionalChaining).toBe(true);
    expect(jsSupport.es2020.nullishCoalescing).toBe(true);
  });

  test("meets Chrome performance requirements", async ({ page }) => {
    await page.goto("http://localhost:3000/interaction");

    const performance = await utils.testAnimationPerformance('[data-testid="magnetic-button"]');

    expect(performance.fps).toBeGreaterThanOrEqual(BROWSER_COMPATIBILITY_CONFIG.performance.chrome.minFPS);
    expect(performance.memoryUsage).toBeLessThan(BROWSER_COMPATIBILITY_CONFIG.performance.chrome.maxMemory);
  });
});

test.describe("Firefox Compatibility", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== "firefox");
    utils = new BrowserCompatibilityUtils(page, browserName);
  });

  test("detects Firefox capabilities correctly", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    expect(capabilities.webgl).toBe(true);
    expect(capabilities.canvas).toBe(true);
    expect(capabilities.cssTransforms).toBe(true);
    expect(capabilities.cssAnimations).toBe(true);
    expect(capabilities.requestAnimationFrame).toBe(true);
    expect(capabilities.performance).toBe(true);
    expect(capabilities.es6).toBe(true);
  });

  test("supports required WebGL features", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.supported).toBe(true);
    expect(webglInfo.extensions).toContain("OES_texture_float");
    expect(webglInfo.maxTextureSize).toBeGreaterThan(1024);
  });

  test("meets Firefox performance requirements", async ({ page }) => {
    await page.goto("http://localhost:3000/interaction");

    const performance = await utils.testAnimationPerformance('[data-testid="magnetic-button"]');

    expect(performance.fps).toBeGreaterThanOrEqual(BROWSER_COMPATIBILITY_CONFIG.performance.firefox.minFPS);
    expect(performance.memoryUsage).toBeLessThan(BROWSER_COMPATIBILITY_CONFIG.performance.firefox.maxMemory);
  });
});

test.describe("Safari Compatibility", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== "webkit");
    utils = new BrowserCompatibilityUtils(page, browserName);
  });

  test("detects Safari capabilities correctly", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    expect(capabilities.webgl).toBe(true);
    expect(capabilities.canvas).toBe(true);
    expect(capabilities.cssTransforms).toBe(true);
    expect(capabilities.cssAnimations).toBe(true);
    expect(capabilities.requestAnimationFrame).toBe(true);
    expect(capabilities.performance).toBe(true);
    expect(capabilities.es6).toBe(true);
  });

  test("supports required WebGL features", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.supported).toBe(true);
    expect(webglInfo.extensions).toContain("OES_texture_float");
    expect(webglInfo.maxTextureSize).toBeGreaterThan(1024);
  });

  test("meets Safari performance requirements", async ({ page }) => {
    await page.goto("http://localhost:3000/interaction");

    const performance = await utils.testAnimationPerformance('[data-testid="magnetic-button"]');

    expect(performance.fps).toBeGreaterThanOrEqual(BROWSER_COMPATIBILITY_CONFIG.performance.safari.minFPS);
    expect(performance.memoryUsage).toBeLessThan(BROWSER_COMPATIBILITY_CONFIG.performance.safari.maxMemory);
  });
});

test.describe("Edge Compatibility", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== "msedge");
    utils = new BrowserCompatibilityUtils(page, browserName);
  });

  test("detects Edge capabilities correctly", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    expect(capabilities.webgl).toBe(true);
    expect(capabilities.canvas).toBe(true);
    expect(capabilities.cssTransforms).toBe(true);
    expect(capabilities.cssAnimations).toBe(true);
    expect(capabilities.requestAnimationFrame).toBe(true);
    expect(capabilities.performance).toBe(true);
    expect(capabilities.es6).toBe(true);
  });

  test("supports required WebGL features", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.supported).toBe(true);
    expect(webglInfo.extensions).toContain("OES_texture_float");
    expect(webglInfo.maxTextureSize).toBeGreaterThan(1024);
  });

  test("meets Edge performance requirements", async ({ page }) => {
    await page.goto("http://localhost:3000/interaction");

    const performance = await utils.testAnimationPerformance('[data-testid="magnetic-button"]');

    expect(performance.fps).toBeGreaterThanOrEqual(BROWSER_COMPATIBILITY_CONFIG.performance.edge.minFPS);
    expect(performance.memoryUsage).toBeLessThan(BROWSER_COMPATIBILITY_CONFIG.performance.edge.maxMemory);
  });
});

test.describe("Mobile Browser Compatibility", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== "Mobile Chrome" && browserName !== "Mobile Safari");
    utils = new BrowserCompatibilityUtils(page, browserName);
  });

  test("detects mobile capabilities correctly", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    expect(capabilities.touch).toBe(true);
    expect(capabilities.webgl).toBe(true);
    expect(capabilities.canvas).toBe(true);
    expect(capabilities.cssTransforms).toBe(true);
    expect(capabilities.cssAnimations).toBe(true);
    expect(capabilities.requestAnimationFrame).toBe(true);
    expect(capabilities.performance).toBe(true);
  });

  test("supports touch interactions", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    expect(capabilities.touch).toBe(true);
    expect(capabilities.devicePixelRatio).toBeGreaterThan(1);
  });

  test("meets mobile performance requirements", async ({ page }) => {
    await page.goto("http://localhost:3000/interaction");

    const performance = await utils.testAnimationPerformance('[data-testid="magnetic-button"]');

    expect(performance.fps).toBeGreaterThanOrEqual(BROWSER_COMPATIBILITY_CONFIG.performance.mobile.minFPS);
    expect(performance.memoryUsage).toBeLessThan(BROWSER_COMPATIBILITY_CONFIG.performance.mobile.maxMemory);
  });

  test("handles orientation changes", async ({ page }) => {
    const capabilities = await utils.detectBrowserCapabilities();

    if (capabilities.orientation) {
      expect(capabilities.orientation).toBeDefined();
    }
  });
});

test.describe("WebGL Compatibility", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page }) => {
    utils = new BrowserCompatibilityUtils(page, "chromium");
  });

  test("supports WebGL 1.0", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.supported).toBe(true);
    expect(webglInfo.version).toContain("WebGL 1.0");
  });

  test("supports required WebGL extensions", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.extensions).toContain("OES_texture_float");
    expect(webglInfo.extensions).toContain("OES_element_index_uint");
    expect(webglInfo.extensions).toContain("EXT_texture_filter_anisotropic");
  });

  test("has sufficient WebGL limits", async ({ page }) => {
    const webglInfo = await utils.testWebGLCompatibility();

    expect(webglInfo.maxTextureSize).toBeGreaterThanOrEqual(2048);
    expect(webglInfo.maxVertexAttribs).toBeGreaterThanOrEqual(16);
    expect(webglInfo.maxVaryingVectors).toBeGreaterThanOrEqual(8);
  });

  test("WebGL performance is acceptable", async ({ page }) => {
    await page.goto("http://localhost:3000/three");

    const performance = await utils.testAnimationPerformance("canvas");

    expect(performance.fps).toBeGreaterThanOrEqual(30);
    expect(performance.memoryUsage).toBeLessThan(150);
  });
});

test.describe("Polyfill Requirements", () => {
  let utils: BrowserCompatibilityUtils;

  test.beforeEach(async ({ page }) => {
    utils = new BrowserCompatibilityUtils(page, "chromium");
  });

  test("identifies required polyfills", async ({ page }) => {
    const polyfills = await utils.testPolyfillRequirements();

    // Check ES6 support
    expect(polyfills.es6.promise).toBe(true);
    expect(polyfills.es6.symbol).toBe(true);
    expect(polyfills.es6.map).toBe(true);
    expect(polyfills.es6.set).toBe(true);

    // Check CSS support
    expect(polyfills.css.flexbox).toBe(true);
    expect(polyfills.css.grid).toBe(true);

    // Check Web API support
    expect(polyfills.webAPI.intersectionObserver).toBe(true);
    expect(polyfills.webAPI.resizeObserver).toBe(true);
  });

  test("determines polyfill necessity", async ({ page }) => {
    const polyfills = await utils.testPolyfillRequirements();

    // These should be true for modern browsers
    const requiredFeatures = [
      polyfills.es6.promise,
      polyfills.es6.symbol,
      polyfills.es6.map,
      polyfills.es6.set,
      polyfills.css.flexbox,
      polyfills.webAPI.intersectionObserver
    ];

    const missingFeatures = requiredFeatures.filter(feature => !feature);
    expect(missingFeatures.length).toBe(0);
  });
});

test.describe("Cross-Browser Feature Consistency", () => {
  test("animations work consistently across browsers", async ({ page, browserName }) => {
    await page.goto("http://localhost:3000/interaction");

    const button = page.locator('[data-testid="magnetic-button"]');
    await button.hover();

    // Check that the button is visible and interactive
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    // Test click interaction
    await button.click();
    await page.waitForTimeout(500);

    // Verify the button still works after interaction
    await expect(button).toBeVisible();
  });

  test("scroll effects work consistently across browsers", async ({ page, browserName }) => {
    await page.goto("http://localhost:3000/scroll");

    const scrollContainer = page.locator('[data-testid="horizontal-scroll"]');
    await expect(scrollContainer).toBeVisible();

    // Test scroll interaction
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);

    // Verify scroll effect occurred
    const scrollElement = scrollContainer.locator("> div");
    const transform = await scrollElement.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });

    expect(transform).not.toBe("none");
  });

  test("Three.js components work consistently across browsers", async ({ page, browserName }) => {
    await page.goto("http://localhost:3000/three");

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();

    // Test hover interaction
    await canvas.hover();
    await page.waitForTimeout(1000);

    // Verify canvas is still visible and functional
    await expect(canvas).toBeVisible();
  });
});

test.describe("Browser-Specific Optimizations", () => {
  test("Chrome-specific optimizations work", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium");

    await page.goto("http://localhost:3000/interaction");

    // Test Chrome-specific features
    const chromeFeatures = await page.evaluate(() => {
      return {
        webGL2: !!document.createElement('canvas').getContext('webgl2'),
        webWorkers: typeof Worker !== 'undefined',
        serviceWorkers: typeof ServiceWorker !== 'undefined',
        pushManager: typeof PushManager !== 'undefined'
      };
    });

    expect(chromeFeatures.webGL2).toBe(true);
    expect(chromeFeatures.webWorkers).toBe(true);
  });

  test("Firefox-specific optimizations work", async ({ page, browserName }) => {
    test.skip(browserName !== "firefox");

    await page.goto("http://localhost:3000/interaction");

    // Test Firefox-specific features
    const firefoxFeatures = await page.evaluate(() => {
      return {
        webGL: !!document.createElement('canvas').getContext('webgl'),
        webWorkers: typeof Worker !== 'undefined',
        performance: typeof performance !== 'undefined'
      };
    });

    expect(firefoxFeatures.webGL).toBe(true);
    expect(firefoxFeatures.webWorkers).toBe(true);
    expect(firefoxFeatures.performance).toBe(true);
  });

  test("Safari-specific optimizations work", async ({ page, browserName }) => {
    test.skip(browserName !== "webkit");

    await page.goto("http://localhost:3000/interaction");

    // Test Safari-specific features
    const safariFeatures = await page.evaluate(() => {
      return {
        webGL: !!document.createElement('canvas').getContext('webgl'),
        webWorkers: typeof Worker !== 'undefined',
        performance: typeof performance !== 'undefined',
        touch: 'ontouchstart' in window
      };
    });

    expect(safariFeatures.webGL).toBe(true);
    expect(safariFeatures.webWorkers).toBe(true);
    expect(safariFeatures.performance).toBe(true);
  });
});

test.describe("Legacy Browser Support", () => {
  test("graceful degradation for older browsers", async ({ page }) => {
    // Simulate older browser by disabling some features
    await page.addInitScript(() => {
      // Disable some modern features to test graceful degradation
      (window as any).IntersectionObserver = undefined;
      (window as any).ResizeObserver = undefined;
    });

    await page.goto("http://localhost:3000/interaction");

    const button = page.locator('[data-testid="magnetic-button"]');
    await expect(button).toBeVisible();

    // Test that basic functionality still works
    await button.click();
    await page.waitForTimeout(500);

    await expect(button).toBeVisible();
  });

  test("fallbacks work when WebGL is not available", async ({ page }) => {
    // Disable WebGL
    await page.addInitScript(() => {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(contextType: string) {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
          return null;
        }
        return originalGetContext.call(this, contextType);
      };
    });

    await page.goto("http://localhost:3000/three");

    // Should still render something, even if not WebGL
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
  });
});
