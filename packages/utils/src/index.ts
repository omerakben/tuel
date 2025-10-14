/**
 * Utility function for conditional className joining (similar to clsx/classnames).
 * Filters out falsy values and joins the remaining strings with spaces.
 *
 * @param classes - Variable number of class names or conditional values
 * @returns Combined class string with falsy values filtered out
 *
 * @example
 * ```ts
 * cn('base', 'active'); // => 'base active'
 * cn('base', isActive && 'active', isDisabled && 'disabled');
 * cn('base', undefined, null, false, 'valid'); // => 'base valid'
 * ```
 */
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Detects if code is running on the server (Node.js environment).
 * Useful for SSR-safe conditional logic.
 *
 * @example
 * ```ts
 * if (isServer) {
 *   console.log('Running on server');
 * }
 * ```
 */
export const isServer = typeof window === "undefined";

/**
 * Detects if code is running on the client (browser environment).
 * Useful for browser-specific code execution.
 *
 * @example
 * ```ts
 * if (isClient) {
 *   window.addEventListener('scroll', handleScroll);
 * }
 * ```
 */
export const isClient = !isServer;

/**
 * Creates a debounced function that delays invoking the provided function
 * until after `wait` milliseconds have elapsed since the last time it was invoked.
 *
 * The returned function includes a `cancel()` method to clear any pending execution.
 *
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced version of the function with a cancel method
 *
 * @example
 * ```ts
 * const handleResize = debounce(() => {
 *   console.log('Window resized');
 * }, 300);
 *
 * window.addEventListener('resize', handleResize);
 *
 * // Cleanup when component unmounts
 * useEffect(() => {
 *   return () => {
 *     handleResize.cancel();
 *   };
 * }, []);
 * ```
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debouncedFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFn;
};

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every `limit` milliseconds.
 *
 * The returned function includes a `cancel()` method to clear any pending execution.
 *
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to throttle invocations to
 * @returns Throttled version of the function with a cancel method
 *
 * @example
 * ```ts
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 100);
 *
 * window.addEventListener('scroll', handleScroll);
 *
 * // Cleanup when component unmounts
 * useEffect(() => {
 *   return () => {
 *     handleScroll.cancel();
 *   };
 * }, []);
 * ```
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} => {
  let inThrottle = false;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const throttledFn = (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      timeout = setTimeout(() => {
        inThrottle = false;
        timeout = null;
      }, limit);
    }
  };

  throttledFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      inThrottle = false;
    }
  };

  return throttledFn;
};

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 * @throws {Error} If any parameter is NaN or Infinity
 * @throws {Error} If min is greater than max
 *
 * @example
 * ```ts
 * clamp(5, 0, 10);   // => 5
 * clamp(-5, 0, 10);  // => 0
 * clamp(15, 0, 10);  // => 10
 * ```
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) {
    throw new Error(`clamp: value must be a finite number, got ${value}`);
  }
  if (!Number.isFinite(min)) {
    throw new Error(`clamp: min must be a finite number, got ${min}`);
  }
  if (!Number.isFinite(max)) {
    throw new Error(`clamp: max must be a finite number, got ${max}`);
  }
  if (min > max) {
    throw new Error(`clamp: min (${min}) must be less than or equal to max (${max})`);
  }

  return Math.min(Math.max(value, min), max);
};

/**
 * Performs linear interpolation between two values.
 *
 * @param start - The start value
 * @param end - The end value
 * @param t - The interpolation factor (0-1)
 * @returns The interpolated value
 * @throws {Error} If any parameter is NaN or Infinity
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5);   // => 50
 * lerp(0, 100, 0.25);  // => 25
 * lerp(10, 20, 0.75);  // => 17.5
 * ```
 */
export const lerp = (start: number, end: number, t: number): number => {
  if (!Number.isFinite(start)) {
    throw new Error(`lerp: start must be a finite number, got ${start}`);
  }
  if (!Number.isFinite(end)) {
    throw new Error(`lerp: end must be a finite number, got ${end}`);
  }
  if (!Number.isFinite(t)) {
    throw new Error(`lerp: t must be a finite number, got ${t}`);
  }

  return start + (end - start) * t;
};

/**
 * Creates an array of numbers from start to end (inclusive) with an optional step.
 *
 * @param start - The start value
 * @param end - The end value (inclusive)
 * @param step - The step increment (default: 1)
 * @returns Array of numbers in the range
 * @throws {Error} If any parameter is NaN or Infinity
 * @throws {Error} If step is zero
 * @throws {Error} If step direction doesn't match start/end direction
 * @throws {Error} If range would generate more than 1 million elements (DoS prevention)
 *
 * @example
 * ```ts
 * range(1, 5);       // => [1, 2, 3, 4, 5]
 * range(0, 10, 2);   // => [0, 2, 4, 6, 8, 10]
 * range(5, 1, -1);   // => [5, 4, 3, 2, 1]
 * ```
 */
export const range = (
  start: number,
  end: number,
  step: number = 1
): number[] => {
  if (!Number.isFinite(start)) {
    throw new Error(`range: start must be a finite number, got ${start}`);
  }
  if (!Number.isFinite(end)) {
    throw new Error(`range: end must be a finite number, got ${end}`);
  }
  if (!Number.isFinite(step)) {
    throw new Error(`range: step must be a finite number, got ${step}`);
  }

  if (step === 0) {
    throw new Error("range: step cannot be zero");
  }

  // Check for wrong step direction
  if ((end > start && step < 0) || (end < start && step > 0)) {
    throw new Error(
      `range: step direction (${step}) doesn't match start (${start}) to end (${end}) direction`
    );
  }

  // DoS prevention: calculate expected array length and reject if too large
  const expectedLength = Math.abs(Math.floor((end - start) / step)) + 1;
  const MAX_RANGE_LENGTH = 1_000_000;
  
  if (expectedLength > MAX_RANGE_LENGTH) {
    throw new Error(
      `range: would generate ${expectedLength} elements, exceeds maximum of ${MAX_RANGE_LENGTH}. Use a larger step value.`
    );
  }

  const result: number[] = [];

  if (step > 0) {
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i >= end; i += step) {
      result.push(i);
    }
  }

  return result;
};

// Export validation utilities
export * from "./validators";

// Export error handling utilities
export {
  TuelErrorBoundary,
  DefaultErrorFallback,
  useErrorBoundary,
  withErrorBoundary,
  AnimationErrorBoundary,
} from "./errorBoundary";

export type {
  ErrorBoundaryState,
  ErrorBoundaryProps,
  ErrorFallbackProps,
} from "./errorBoundary";

// Export performance monitoring utilities
export {
  usePerformanceMonitor,
  PerformanceBudget,
  performanceBudget,
  PerformanceDashboard,
} from "./performance";

export type {
  PerformanceConfig as PerformanceConfigType,
  PerformanceMetrics as PerformanceMetricsType,
  PerformanceAlert,
  PerformanceReport,
} from "./performance";

export { useRenderPerformance, useAnimationPerformance } from "./performance";

// Export accessibility utilities
export {
  useAccessibilityPreferences,
  useAccessibleAnimation,
  useFocusManagement,
  useScreenReaderAnnouncements,
  useKeyboardNavigation,
  generateAriaLabel,
  checkColorContrast,
  AccessibilityProvider,
  useAccessibility,
  withAccessibility,
} from "./accessibility";

// Export browser compatibility utilities
export {
  BROWSER_REQUIREMENTS,
  WEBGL_REQUIREMENTS,
  CSS_REQUIREMENTS,
  JS_REQUIREMENTS,
  PERFORMANCE_THRESHOLDS,
  POLYFILL_CONFIG,
  BrowserDetector,
  PolyfillLoader,
  BrowserPerformanceMonitor,
  browserDetector,
  polyfillLoader,
  performanceMonitor as browserPerformanceMonitor,
} from "./browser-compatibility";

// Export performance benchmarking utilities
export {
  PerformanceMonitor as BenchmarkMonitor,
  performanceMonitor as benchmarkMonitor,
} from "./performance-benchmark";

export type {
  PerformanceConfig as BenchmarkConfig,
  PerformanceMetrics as BenchmarkMetrics,
} from "./performance-benchmark";

// Export CI/CD configuration utilities
export * from "./ci-cd-config";

// Export error reporting and monitoring utilities
export {
  PerformanceMonitor as ErrorReportingMonitor,
  performanceMonitor as errorReportingMonitor,
} from "./error-reporting";

export type { PerformanceMonitoringConfig } from "./error-reporting";
