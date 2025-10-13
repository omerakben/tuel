/**
 * Error Reporting and Monitoring System
 *
 * This module provides comprehensive error tracking, performance monitoring,
 * user analytics, and crash reporting for TUEL components.
 */

// Error reporting configuration
export interface ErrorReportingConfig {
  enabled: boolean;
  dsn?: string; // Sentry DSN
  environment: string;
  release?: string;
  sampleRate: number; // 0-1, percentage of errors to report
  beforeSend?: (event: ErrorEvent) => ErrorEvent | null;
  beforeBreadcrumb?: (breadcrumb: Breadcrumb) => Breadcrumb | null;
  integrations: string[];
  tags: Record<string, string>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  context: Record<string, any>;
}

// Error event interface
export interface ErrorEvent {
  event_id: string;
  timestamp: number;
  level: "debug" | "info" | "warning" | "error" | "fatal";
  logger?: string;
  message: string;
  exception?: {
    type: string;
    value: string;
    stacktrace: {
      frames: Array<{
        filename?: string;
        function?: string;
        lineno?: number;
        colno?: number;
        in_app?: boolean;
        vars?: Record<string, any>;
      }>;
    };
  };
  breadcrumbs: Breadcrumb[];
  tags: Record<string, string>;
  extra: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  context: Record<string, any>;
  fingerprint?: string[];
  platform: string;
  sdk: {
    name: string;
    version: string;
  };
}

// Breadcrumb interface
export interface Breadcrumb {
  timestamp: number;
  type:
    | "debug"
    | "info"
    | "warning"
    | "error"
    | "fatal"
    | "navigation"
    | "http"
    | "user";
  category: string;
  message?: string;
  data?: Record<string, any>;
  level: "debug" | "info" | "warning" | "error" | "fatal";
}

// Performance monitoring configuration
export interface PerformanceMonitoringConfig {
  enabled: boolean;
  sampleRate: number; // 0-1, percentage of transactions to monitor
  tracesSampleRate: number; // 0-1, percentage of traces to sample
  maxBreadcrumbs: number;
  beforeSend?: (event: PerformanceEvent) => PerformanceEvent | null;
  integrations: string[];
  tags: Record<string, string>;
}

// Performance event interface
export interface PerformanceEvent {
  event_id: string;
  timestamp: number;
  type: "transaction" | "span";
  transaction?: string;
  spans?: Array<{
    op: string;
    description?: string;
    timestamp: number;
    duration: number;
    data?: Record<string, any>;
  }>;
  measurements?: Record<string, number>;
  tags: Record<string, string>;
  extra: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  context: Record<string, any>;
  platform: string;
  sdk: {
    name: string;
    version: string;
  };
}

// User analytics configuration
export interface UserAnalyticsConfig {
  enabled: boolean;
  trackingId?: string; // Google Analytics tracking ID
  anonymizeIp: boolean;
  sampleRate: number; // 0-1, percentage of users to track
  customDimensions: Record<string, string>;
  customMetrics: Record<string, number>;
  beforeSend?: (event: AnalyticsEvent) => AnalyticsEvent | null;
}

// Analytics event interface
export interface AnalyticsEvent {
  event_id: string;
  timestamp: number;
  type: "pageview" | "event" | "timing" | "exception";
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  customDimensions: Record<string, string>;
  customMetrics: Record<string, number>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  context: Record<string, any>;
}

// Default configurations
const DEFAULT_ERROR_CONFIG: ErrorReportingConfig = {
  enabled: true,
  environment: "production",
  sampleRate: 0.1, // 10% of errors
  integrations: ["console", "breadcrumbs", "context"],
  tags: {
    component: "tuel",
    version: "1.0.0",
  },
  context: {
    browser: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    platform: typeof navigator !== "undefined" ? navigator.platform : "unknown",
  },
};

const DEFAULT_PERFORMANCE_CONFIG: PerformanceMonitoringConfig = {
  enabled: true,
  sampleRate: 0.1, // 10% of transactions
  tracesSampleRate: 0.1, // 10% of traces
  maxBreadcrumbs: 100,
  integrations: ["performance", "breadcrumbs"],
  tags: {
    component: "tuel",
    version: "1.0.0",
  },
};

const DEFAULT_ANALYTICS_CONFIG: UserAnalyticsConfig = {
  enabled: true,
  anonymizeIp: true,
  sampleRate: 0.1, // 10% of users
  customDimensions: {},
  customMetrics: {},
};

// Error reporting class
export class ErrorReporter {
  private config: ErrorReportingConfig;
  private breadcrumbs: Breadcrumb[] = [];
  private isInitialized = false;

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = { ...DEFAULT_ERROR_CONFIG, ...config };
    this.initialize();
  }

  private initialize(): void {
    if (!this.config.enabled || typeof window === "undefined") return;

    // Initialize Sentry if DSN is provided
    if (this.config.dsn) {
      this.initializeSentry();
    }

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Set up unhandled promise rejection handler
    this.setupUnhandledRejectionHandler();

    this.isInitialized = true;
  }

  private initializeSentry(): void {
    // This would initialize Sentry SDK
    // For now, we'll implement a mock version
    console.log("Sentry initialized with DSN:", this.config.dsn);
  }

  private setupGlobalErrorHandlers(): void {
    // Global error handler
    window.addEventListener("error", (event) => {
      this.captureException(event.error, {
        tags: {
          type: "javascript",
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        extra: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.captureException(event.reason, {
        tags: {
          type: "promise",
        },
        extra: {
          reason: event.reason,
        },
      });
    });
  }

  private setupUnhandledRejectionHandler(): void {
    window.addEventListener("unhandledrejection", (event) => {
      this.captureException(event.reason, {
        tags: {
          type: "unhandledrejection",
        },
        extra: {
          reason: event.reason,
        },
      });
    });
  }

  // Capture an exception
  captureException(error: Error, context: Partial<ErrorEvent> = {}): void {
    if (!this.config.enabled || !this.isInitialized) return;

    // Apply sample rate
    if (Math.random() > this.config.sampleRate) return;

    const event: ErrorEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now(),
      level: "error",
      message: error.message,
      exception: {
        type: error.constructor.name,
        value: error.message,
        stacktrace: {
          frames: this.parseStackTrace(error.stack),
        },
      },
      breadcrumbs: [...this.breadcrumbs],
      tags: { ...this.config.tags, ...context.tags },
      extra: { ...this.config.context, ...context.extra },
      user: this.config.user,
      context: { ...this.config.context, ...context.context },
      platform: "javascript",
      sdk: {
        name: "tuel-error-reporter",
        version: "1.0.0",
      },
    };

    // Apply beforeSend filter
    if (this.config.beforeSend) {
      const filteredEvent = this.config.beforeSend(event);
      if (!filteredEvent) return;
    }

    // Send to Sentry or custom endpoint
    this.sendError(event);
  }

  // Capture a message
  captureMessage(
    message: string,
    level: ErrorEvent["level"] = "info",
    context: Partial<ErrorEvent> = {}
  ): void {
    if (!this.config.enabled || !this.isInitialized) return;

    const event: ErrorEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now(),
      level,
      message,
      breadcrumbs: [...this.breadcrumbs],
      tags: { ...this.config.tags, ...context.tags },
      extra: { ...this.config.context, ...context.extra },
      user: this.config.user,
      context: { ...this.config.context, ...context.context },
      platform: "javascript",
      sdk: {
        name: "tuel-error-reporter",
        version: "1.0.0",
      },
    };

    // Apply beforeSend filter
    if (this.config.beforeSend) {
      const filteredEvent = this.config.beforeSend(event);
      if (!filteredEvent) return;
    }

    this.sendError(event);
  }

  // Add breadcrumb
  addBreadcrumb(breadcrumb: Omit<Breadcrumb, "timestamp">): void {
    if (!this.config.enabled) return;

    const fullBreadcrumb: Breadcrumb = {
      ...breadcrumb,
      timestamp: Date.now(),
    };

    // Apply beforeBreadcrumb filter
    if (this.config.beforeBreadcrumb) {
      const filteredBreadcrumb = this.config.beforeBreadcrumb(fullBreadcrumb);
      if (!filteredBreadcrumb) return;
    }

    this.breadcrumbs.push(fullBreadcrumb);

    // Keep only the last maxBreadcrumbs
    if (this.breadcrumbs.length > 100) {
      this.breadcrumbs = this.breadcrumbs.slice(-100);
    }
  }

  // Set user context
  setUser(user: ErrorReportingConfig["user"]): void {
    this.config.user = user;
  }

  // Set tags
  setTags(tags: Record<string, string>): void {
    this.config.tags = { ...this.config.tags, ...tags };
  }

  // Set context
  setContext(key: string, value: any): void {
    this.config.context[key] = value;
  }

  // Send error to Sentry or custom endpoint
  private async sendError(event: ErrorEvent): Promise<void> {
    try {
      if (this.config.dsn) {
        // Send to Sentry
        await this.sendToSentry(event);
      } else {
        // Send to custom endpoint or log locally
        console.error("TUEL Error:", event);
      }
    } catch (error) {
      console.error("Failed to send error:", error);
    }
  }

  private async sendToSentry(event: ErrorEvent): Promise<void> {
    // This would send to Sentry API
    // For now, we'll just log it
    console.log("Sending to Sentry:", event);
  }

  private parseStackTrace(
    stack?: string
  ): ErrorEvent["exception"]["stacktrace"]["frames"] {
    if (!stack) return [];

    return stack.split("\n").map((line, index) => {
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        return {
          function: match[1],
          filename: match[2],
          lineno: parseInt(match[3]),
          colno: parseInt(match[4]),
          in_app: !match[2].includes("node_modules"),
        };
      }
      return {
        function: line.trim(),
        in_app: false,
      };
    });
  }

  private generateEventId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Performance monitoring class
export class PerformanceMonitor {
  private config: PerformanceMonitoringConfig;
  private transactions: Map<string, PerformanceEvent> = new Map();
  private spans: Map<string, PerformanceEvent> = new Map();

  constructor(config: Partial<PerformanceMonitoringConfig> = {}) {
    this.config = { ...DEFAULT_PERFORMANCE_CONFIG, ...config };
    this.initialize();
  }

  private initialize(): void {
    if (!this.config.enabled || typeof window === "undefined") return;

    // Set up performance observers
    this.setupPerformanceObservers();

    // Set up navigation timing
    this.setupNavigationTiming();
  }

  private setupPerformanceObservers(): void {
    if ("PerformanceObserver" in window) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handleNavigationEntry(entry);
        }
      });
      navObserver.observe({ entryTypes: ["navigation"] });

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handleResourceEntry(entry);
        }
      });
      resourceObserver.observe({ entryTypes: ["resource"] });

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePaintEntry(entry);
        }
      });
      paintObserver.observe({ entryTypes: ["paint"] });
    }
  }

  private setupNavigationTiming(): void {
    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.captureTransaction("page-load", {
          spans: [
            {
              op: "navigation",
              description: "Page navigation",
              timestamp: navigation.startTime,
              duration: navigation.loadEventEnd - navigation.startTime,
            },
            {
              op: "dom",
              description: "DOM content loaded",
              timestamp: navigation.domContentLoadedEventStart,
              duration:
                navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
            },
            {
              op: "load",
              description: "Page load complete",
              timestamp: navigation.loadEventStart,
              duration: navigation.loadEventEnd - navigation.loadEventStart,
            },
          ],
          measurements: {
            "navigation.load":
              navigation.loadEventEnd - navigation.loadEventStart,
            "navigation.dom":
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart,
            "navigation.first-paint":
              performance.getEntriesByName("first-paint")[0]?.startTime || 0,
            "navigation.first-contentful-paint":
              performance.getEntriesByName("first-contentful-paint")[0]
                ?.startTime || 0,
          },
        });
      }
    });
  }

  private handleNavigationEntry(entry: PerformanceEntry): void {
    // Handle navigation timing entries
  }

  private handleResourceEntry(entry: PerformanceEntry): void {
    // Handle resource timing entries
  }

  private handlePaintEntry(entry: PerformanceEntry): void {
    // Handle paint timing entries
  }

  // Start a transaction
  startTransaction(name: string, op: string = "navigation"): string {
    const transactionId = this.generateEventId();
    const transaction: PerformanceEvent = {
      event_id: transactionId,
      timestamp: Date.now(),
      type: "transaction",
      transaction: name,
      spans: [],
      measurements: {},
      tags: { ...this.config.tags },
      extra: {},
      context: {},
      platform: "javascript",
      sdk: {
        name: "tuel-performance-monitor",
        version: "1.0.0",
      },
    };

    this.transactions.set(transactionId, transaction);
    return transactionId;
  }

  // Finish a transaction
  finishTransaction(transactionId: string, status: string = "ok"): void {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) return;

    transaction.tags.status = status;
    this.sendPerformanceEvent(transaction);
    this.transactions.delete(transactionId);
  }

  // Start a span
  startSpan(transactionId: string, op: string, description?: string): string {
    const spanId = this.generateEventId();
    const span: PerformanceEvent = {
      event_id: spanId,
      timestamp: Date.now(),
      type: "span",
      transaction: transactionId,
      spans: [
        {
          op,
          description,
          timestamp: Date.now(),
          duration: 0,
        },
      ],
      tags: { ...this.config.tags },
      extra: {},
      context: {},
      platform: "javascript",
      sdk: {
        name: "tuel-performance-monitor",
        version: "1.0.0",
      },
    };

    this.spans.set(spanId, span);
    return spanId;
  }

  // Finish a span
  finishSpan(spanId: string): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    const duration = Date.now() - span.timestamp;
    if (span.spans && span.spans[0]) {
      span.spans[0].duration = duration;
    }

    this.sendPerformanceEvent(span);
    this.spans.delete(spanId);
  }

  // Capture a transaction
  captureTransaction(name: string, data: Partial<PerformanceEvent> = {}): void {
    if (!this.config.enabled) return;

    // Apply sample rate
    if (Math.random() > this.config.sampleRate) return;

    const event: PerformanceEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now(),
      type: "transaction",
      transaction: name,
      spans: data.spans || [],
      measurements: data.measurements || {},
      tags: { ...this.config.tags, ...data.tags },
      extra: { ...data.extra },
      context: { ...data.context },
      platform: "javascript",
      sdk: {
        name: "tuel-performance-monitor",
        version: "1.0.0",
      },
    };

    // Apply beforeSend filter
    if (this.config.beforeSend) {
      const filteredEvent = this.config.beforeSend(event);
      if (!filteredEvent) return;
    }

    this.sendPerformanceEvent(event);
  }

  // Send performance event
  private async sendPerformanceEvent(event: PerformanceEvent): Promise<void> {
    try {
      // Send to Sentry or custom endpoint
      console.log("TUEL Performance:", event);
    } catch (error) {
      console.error("Failed to send performance event:", error);
    }
  }

  private generateEventId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// User analytics class
export class UserAnalytics {
  private config: UserAnalyticsConfig;
  private sessionId: string;
  private userId?: string;

  constructor(config: Partial<UserAnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_ANALYTICS_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private initialize(): void {
    if (!this.config.enabled || typeof window === "undefined") return;

    // Initialize Google Analytics if tracking ID is provided
    if (this.config.trackingId) {
      this.initializeGoogleAnalytics();
    }

    // Track page view
    this.trackPageView();
  }

  private initializeGoogleAnalytics(): void {
    // This would initialize Google Analytics
    console.log(
      "Google Analytics initialized with tracking ID:",
      this.config.trackingId
    );
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Track page view
  trackPageView(page?: string): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now(),
      type: "pageview",
      category: "page",
      action: "view",
      label: page || window.location.pathname,
      customDimensions: { ...this.config.customDimensions },
      customMetrics: { ...this.config.customMetrics },
      user: this.userId ? { id: this.userId } : undefined,
      context: {
        sessionId: this.sessionId,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };

    this.sendAnalyticsEvent(event);
  }

  // Track custom event
  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now(),
      type: "event",
      category,
      action,
      label,
      value,
      customDimensions: { ...this.config.customDimensions },
      customMetrics: { ...this.config.customMetrics },
      user: this.userId ? { id: this.userId } : undefined,
      context: {
        sessionId: this.sessionId,
        url: window.location.href,
      },
    };

    this.sendAnalyticsEvent(event);
  }

  // Track timing
  trackTiming(
    category: string,
    variable: string,
    time: number,
    label?: string
  ): void {
    if (!this.config.enabled) return;

    const event: AnalyticsEvent = {
      event_id: this.generateEventId(),
      timestamp: Date.now(),
      type: "timing",
      category,
      action: variable,
      label,
      value: time,
      customDimensions: { ...this.config.customDimensions },
      customMetrics: { ...this.config.customMetrics },
      user: this.userId ? { id: this.userId } : undefined,
      context: {
        sessionId: this.sessionId,
        url: window.location.href,
      },
    };

    this.sendAnalyticsEvent(event);
  }

  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Set custom dimension
  setCustomDimension(index: number, value: string): void {
    this.config.customDimensions[`dimension${index}`] = value;
  }

  // Set custom metric
  setCustomMetric(index: number, value: number): void {
    this.config.customMetrics[`metric${index}`] = value;
  }

  // Send analytics event
  private async sendAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Apply beforeSend filter
      if (this.config.beforeSend) {
        const filteredEvent = this.config.beforeSend(event);
        if (!filteredEvent) return;
      }

      // Send to Google Analytics or custom endpoint
      console.log("TUEL Analytics:", event);
    } catch (error) {
      console.error("Failed to send analytics event:", error);
    }
  }

  private generateEventId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Monitoring dashboard class
export class MonitoringDashboard {
  private errorReporter: ErrorReporter;
  private performanceMonitor: PerformanceMonitor;
  private userAnalytics: UserAnalytics;

  constructor(
    errorConfig: Partial<ErrorReportingConfig> = {},
    performanceConfig: Partial<PerformanceMonitoringConfig> = {},
    analyticsConfig: Partial<UserAnalyticsConfig> = {}
  ) {
    this.errorReporter = new ErrorReporter(errorConfig);
    this.performanceMonitor = new PerformanceMonitor(performanceConfig);
    this.userAnalytics = new UserAnalytics(analyticsConfig);
  }

  // Get error statistics
  getErrorStats(): Promise<{
    total: number;
    byLevel: Record<string, number>;
    byType: Record<string, number>;
    recent: ErrorEvent[];
  }> {
    // This would fetch from Sentry or custom API
    return Promise.resolve({
      total: 0,
      byLevel: {},
      byType: {},
      recent: [],
    });
  }

  // Get performance statistics
  getPerformanceStats(): Promise<{
    avgLoadTime: number;
    avgFPS: number;
    memoryUsage: number;
    transactions: PerformanceEvent[];
  }> {
    // This would fetch from Sentry or custom API
    return Promise.resolve({
      avgLoadTime: 0,
      avgFPS: 0,
      memoryUsage: 0,
      transactions: [],
    });
  }

  // Get user analytics
  getAnalyticsStats(): Promise<{
    pageViews: number;
    uniqueUsers: number;
    events: Record<string, number>;
    topPages: Array<{ page: string; views: number }>;
  }> {
    // This would fetch from Google Analytics or custom API
    return Promise.resolve({
      pageViews: 0,
      uniqueUsers: 0,
      events: {},
      topPages: [],
    });
  }

  // Get all monitoring instances
  getErrorReporter(): ErrorReporter {
    return this.errorReporter;
  }

  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }

  getUserAnalytics(): UserAnalytics {
    return this.userAnalytics;
  }
}

// Export default instances
export const errorReporter = new ErrorReporter();
export const performanceMonitor = new PerformanceMonitor();
export const userAnalytics = new UserAnalytics();
export const monitoringDashboard = new MonitoringDashboard();

// Auto-initialize monitoring
if (typeof window !== "undefined") {
  // Add breadcrumb for page load
  errorReporter.addBreadcrumb({
    type: "navigation",
    category: "page",
    message: "Page loaded",
    level: "info",
  });

  // Track page view
  userAnalytics.trackPageView();
}
