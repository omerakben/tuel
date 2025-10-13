/**
 * Browser Compatibility and Polyfill Configuration
 *
 * This file defines polyfills and compatibility settings for older browsers
 * to ensure TUEL works across a wide range of browser versions.
 */

// Browser version requirements
export const BROWSER_REQUIREMENTS = {
  chrome: { min: 88, recommended: 90 },
  firefox: { min: 85, recommended: 88 },
  safari: { min: 14, recommended: 15 },
  edge: { min: 88, recommended: 90 },
  mobileChrome: { min: 88, recommended: 90 },
  mobileSafari: { min: 14, recommended: 15 },
} as const;

// Required WebGL features
export const WEBGL_REQUIREMENTS = {
  version: "WebGL 1.0",
  requiredExtensions: [
    "OES_texture_float",
    "OES_element_index_uint",
    "EXT_texture_filter_anisotropic",
  ],
  optionalExtensions: [
    "WEBGL_compressed_texture_s3tc",
    "WEBGL_compressed_texture_etc1",
    "WEBGL_compressed_texture_pvrtc",
  ],
  minLimits: {
    maxTextureSize: 2048,
    maxVertexAttribs: 16,
    maxVaryingVectors: 8,
    maxFragmentUniforms: 16,
    maxVertexUniforms: 16,
  },
} as const;

// Required CSS features
export const CSS_REQUIREMENTS = {
  required: [
    "transform",
    "transform3d",
    "animation",
    "transition",
    "flexbox",
    "opacity",
    "visibility",
    "position",
    "zIndex",
  ],
  recommended: [
    "grid",
    "backdropFilter",
    "clipPath",
    "mask",
    "filter",
    "willChange",
    "contain",
    "scrollBehavior",
    "overscrollBehavior",
  ],
} as const;

// Required JavaScript features
export const JS_REQUIREMENTS = {
  es6: [
    "arrowFunctions",
    "templateLiterals",
    "destructuring",
    "spreadOperator",
    "promises",
    "symbol",
    "map",
    "set",
    "weakMap",
    "weakSet",
  ],
  es2017: ["asyncAwait", "objectEntries", "objectValues", "padStart", "padEnd"],
  es2018: ["restSpread", "asyncIteration", "promiseFinally"],
  es2019: ["flat", "flatMap", "objectFromEntries", "trimStart", "trimEnd"],
  es2020: ["optionalChaining", "nullishCoalescing", "bigInt", "dynamicImport"],
  webAPIs: [
    "fetch",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    "intersectionObserver",
    "resizeObserver",
    "mutationObserver",
    "performance",
    "webWorkers",
    "localStorage",
    "sessionStorage",
    "webGL",
    "webAudio",
    "webSocket",
    "webCrypto",
  ],
} as const;

// Performance thresholds per browser
export const PERFORMANCE_THRESHOLDS = {
  chrome: { minFPS: 60, maxMemory: 100, maxLoadTime: 2000 },
  firefox: { minFPS: 55, maxMemory: 120, maxLoadTime: 2500 },
  safari: { minFPS: 50, maxMemory: 150, maxLoadTime: 3000 },
  edge: { minFPS: 60, maxMemory: 100, maxLoadTime: 2000 },
  mobile: { minFPS: 30, maxMemory: 80, maxLoadTime: 4000 },
  tablet: { minFPS: 45, maxMemory: 120, maxLoadTime: 3500 },
  lowEnd: { minFPS: 20, maxMemory: 60, maxLoadTime: 5000 },
} as const;

// Polyfill configuration
export const POLYFILL_CONFIG = {
  // Core polyfills for older browsers
  core: {
    // Promise polyfill for IE11
    promise: {
      condition: () => typeof Promise === "undefined",
      polyfill:
        "https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js",
    },

    // Fetch polyfill for older browsers
    fetch: {
      condition: () => typeof fetch === "undefined",
      polyfill:
        "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.js",
    },

    // IntersectionObserver polyfill
    intersectionObserver: {
      condition: () => typeof IntersectionObserver === "undefined",
      polyfill:
        "https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js",
    },

    // ResizeObserver polyfill
    resizeObserver: {
      condition: () => typeof ResizeObserver === "undefined",
      polyfill:
        "https://cdn.jsdelivr.net/npm/resize-observer-polyfill@1.5.1/dist/ResizeObserver.global.min.js",
    },

    // WebGL polyfill (fallback to Canvas 2D)
    webGL: {
      condition: () => {
        const canvas = document.createElement("canvas");
        return !(
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        );
      },
      polyfill: "webgl-fallback", // Custom fallback implementation
    },
  },

  // CSS polyfills
  css: {
    // CSS Grid polyfill for older browsers
    grid: {
      condition: () => {
        const div = document.createElement("div");
        return !("grid" in div.style);
      },
      polyfill:
        "https://cdn.jsdelivr.net/npm/css-grid-polyfill@1.0.0/dist/css-grid-polyfill.min.js",
    },

    // CSS Custom Properties polyfill
    customProperties: {
      condition: () => {
        const div = document.createElement("div");
        return !("--test" in div.style);
      },
      polyfill:
        "https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2.4.7/dist/css-vars-ponyfill.min.js",
    },
  },

  // Performance polyfills
  performance: {
    // Performance.now polyfill
    now: {
      condition: () =>
        typeof performance === "undefined" ||
        typeof performance.now !== "function",
      polyfill:
        "https://cdn.jsdelivr.net/npm/performance-now@2.1.0/lib/performance-now.min.js",
    },

    // RequestIdleCallback polyfill
    requestIdleCallback: {
      condition: () => typeof requestIdleCallback === "undefined",
      polyfill:
        "https://cdn.jsdelivr.net/npm/requestidlecallback@0.3.0/polyfill.min.js",
    },
  },
} as const;

// Browser detection utilities
export class BrowserDetector {
  private static instance: BrowserDetector;
  private userAgent: string;
  private capabilities: Record<string, boolean> = {};

  constructor() {
    this.userAgent = navigator.userAgent;
    this.detectCapabilities();
  }

  static getInstance(): BrowserDetector {
    if (!BrowserDetector.instance) {
      BrowserDetector.instance = new BrowserDetector();
    }
    return BrowserDetector.instance;
  }

  private detectCapabilities(): void {
    // WebGL detection
    const canvas = document.createElement("canvas");
    this.capabilities.webgl = !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
    this.capabilities.webgl2 = !!canvas.getContext("webgl2");

    // CSS feature detection
    const testDiv = document.createElement("div");
    this.capabilities.flexbox = "flex" in testDiv.style;
    this.capabilities.grid = "grid" in testDiv.style;
    this.capabilities.transform = "transform" in testDiv.style;
    this.capabilities.animation = "animation" in testDiv.style;
    this.capabilities.transition = "transition" in testDiv.style;

    // JavaScript feature detection
    this.capabilities.promise = typeof Promise !== "undefined";
    this.capabilities.fetch = typeof fetch !== "undefined";
    this.capabilities.intersectionObserver =
      typeof IntersectionObserver !== "undefined";
    this.capabilities.resizeObserver = typeof ResizeObserver !== "undefined";
    this.capabilities.performance =
      typeof performance !== "undefined" &&
      typeof performance.now === "function";

    // Touch detection
    this.capabilities.touch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // ES6 feature detection
    this.capabilities.arrowFunctions = (() => true)();
    this.capabilities.templateLiterals = `test` === "test";
    this.capabilities.destructuring = (() => {
      const { a } = { a: 1 };
      return a === 1;
    })();
    this.capabilities.spreadOperator = (() => {
      const arr = [...[1, 2, 3]];
      return arr.length === 3;
    })();
  }

  getBrowserInfo(): { name: string; version: number; isMobile: boolean } {
    const ua = this.userAgent;
    let name = "unknown";
    let version = 0;
    let isMobile = false;

    // Chrome detection
    if (ua.includes("Chrome") && !ua.includes("Edge")) {
      name = "chrome";
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    }
    // Firefox detection
    else if (ua.includes("Firefox")) {
      name = "firefox";
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    }
    // Safari detection
    else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      name = "safari";
      const match = ua.match(/Version\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    }
    // Edge detection
    else if (ua.includes("Edge")) {
      name = "edge";
      const match = ua.match(/Edge\/(\d+)/);
      version = match ? parseInt(match[1]) : 0;
    }

    // Mobile detection
    isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      ua
    );

    return { name, version, isMobile };
  }

  getCapabilities(): Record<string, boolean> {
    return { ...this.capabilities };
  }

  isSupported(): boolean {
    const browserInfo = this.getBrowserInfo();
    const requirements =
      BROWSER_REQUIREMENTS[
        browserInfo.name as keyof typeof BROWSER_REQUIREMENTS
      ];

    if (!requirements) return false;

    return browserInfo.version >= requirements.min;
  }

  getMissingFeatures(): string[] {
    const missing: string[] = [];
    const capabilities = this.getCapabilities();

    // Check required features
    if (!capabilities.webgl) missing.push("webgl");
    if (!capabilities.promise) missing.push("promise");
    if (!capabilities.fetch) missing.push("fetch");
    if (!capabilities.intersectionObserver)
      missing.push("intersectionObserver");
    if (!capabilities.resizeObserver) missing.push("resizeObserver");
    if (!capabilities.performance) missing.push("performance");
    if (!capabilities.flexbox) missing.push("flexbox");
    if (!capabilities.transform) missing.push("transform");
    if (!capabilities.animation) missing.push("animation");

    return missing;
  }

  getRequiredPolyfills(): string[] {
    const missing = this.getMissingFeatures();
    const polyfills: string[] = [];

    missing.forEach((feature) => {
      const polyfill =
        POLYFILL_CONFIG.core[feature as keyof typeof POLYFILL_CONFIG.core];
      if (polyfill) {
        polyfills.push(polyfill.polyfill);
      }
    });

    return polyfills;
  }
}

// Polyfill loader utility
export class PolyfillLoader {
  private static loadedPolyfills = new Set<string>();

  static async loadPolyfills(): Promise<void> {
    const detector = BrowserDetector.getInstance();
    const polyfills = detector.getRequiredPolyfills();

    const loadPromises = polyfills.map((polyfill) =>
      this.loadPolyfill(polyfill)
    );
    await Promise.all(loadPromises);
  }

  private static async loadPolyfill(url: string): Promise<void> {
    if (this.loadedPolyfills.has(url)) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = () => {
        this.loadedPolyfills.add(url);
        resolve();
      };
      script.onerror = () =>
        reject(new Error(`Failed to load polyfill: ${url}`));
      document.head.appendChild(script);
    });
  }

  static isPolyfillLoaded(url: string): boolean {
    return this.loadedPolyfills.has(url);
  }
}

// Performance monitoring for different browsers
export class BrowserPerformanceMonitor {
  private static instance: BrowserPerformanceMonitor;
  private metrics: Record<string, any> = {};

  static getInstance(): BrowserPerformanceMonitor {
    if (!BrowserPerformanceMonitor.instance) {
      BrowserPerformanceMonitor.instance = new BrowserPerformanceMonitor();
    }
    return BrowserPerformanceMonitor.instance;
  }

  measureAnimationPerformance(
    selector: string,
    duration = 2000
  ): Promise<{
    fps: number;
    avgFrameTime: number;
    frameDrops: number;
    memoryUsage: number;
    totalFrames: number;
  }> {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (!element) {
        resolve({
          fps: 0,
          frameDrops: 0,
          memoryUsage: 0,
          avgFrameTime: 0,
          totalFrames: 0,
        });
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

        if (now - startTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          const fps = frameCount / ((now - startTime) / 1000);
          const avgFrameTime =
            frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const memoryUsage =
            (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0;

          resolve({
            fps: Math.round(fps),
            avgFrameTime: Math.round(avgFrameTime * 100) / 100,
            frameDrops: droppedFrames,
            memoryUsage: Math.round(memoryUsage * 100) / 100,
            totalFrames: frameCount,
          });
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }

  getPerformanceThresholds(): (typeof PERFORMANCE_THRESHOLDS)[keyof typeof PERFORMANCE_THRESHOLDS] {
    const detector = BrowserDetector.getInstance();
    const browserInfo = detector.getBrowserInfo();

    if (browserInfo.isMobile) {
      return PERFORMANCE_THRESHOLDS.mobile;
    }

    return (
      PERFORMANCE_THRESHOLDS[
        browserInfo.name as keyof typeof PERFORMANCE_THRESHOLDS
      ] || PERFORMANCE_THRESHOLDS.chrome
    );
  }

  checkPerformanceBudget(metrics: {
    fps: number;
    memoryUsage: number;
    loadTime: number;
  }): { passed: boolean; issues: string[] } {
    const thresholds = this.getPerformanceThresholds();
    const issues: string[] = [];

    if (metrics.fps < thresholds.minFPS) {
      issues.push(`FPS too low: ${metrics.fps} < ${thresholds.minFPS}`);
    }

    if (metrics.memoryUsage > thresholds.maxMemory) {
      issues.push(
        `Memory usage too high: ${metrics.memoryUsage}MB > ${thresholds.maxMemory}MB`
      );
    }

    if (metrics.loadTime > thresholds.maxLoadTime) {
      issues.push(
        `Load time too slow: ${metrics.loadTime}ms > ${thresholds.maxLoadTime}ms`
      );
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }
}

// Export utilities for easy access
export const browserDetector = BrowserDetector.getInstance();
export const polyfillLoader = PolyfillLoader;
export const performanceMonitor = BrowserPerformanceMonitor.getInstance();

// Auto-initialize polyfills if needed
if (typeof window !== "undefined") {
  const detector = BrowserDetector.getInstance();
  if (!detector.isSupported()) {
    console.warn("TUEL: Browser not fully supported. Loading polyfills...");
    polyfillLoader.loadPolyfills().catch(console.error);
  }
}
