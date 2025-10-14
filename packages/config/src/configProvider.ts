"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * Configuration options for the TUEL animation system
 * @interface TuelConfig
 */
export interface TuelConfig {
  /** Global animation duration in milliseconds (default: 300) */
  globalDuration: number;
  /** Global easing function - CSS easing name or cubic-bezier array (default: "easeInOut") */
  globalEase: string | number[];
  /** Whether to respect user's reduced motion preference (auto-detected) */
  reducedMotion: boolean;

  /** Enable frame rate control for animations (default: true) */
  enableFrameControl: boolean;
  /** Target frames per second for animations (default: 60) */
  targetFPS: number;
  /** Enable performance optimizations (default: true) */
  enableOptimizations: boolean;

  /** Theme mode: light, dark, or auto-detect (default: "auto") */
  theme: "light" | "dark" | "auto";
  /** Color scheme mapping for theme colors */
  colorScheme: Record<string, string>;

  /** Enable debug mode for development (default: false) */
  enableDebug: boolean;
  /** Show performance metrics overlay (default: false) */
  showPerformanceMetrics: boolean;
  /** Log animation events to console (default: false) */
  logAnimations: boolean;

  /** Custom configuration values for extensions */
  custom: Record<string, any>;
}

/**
 * Context value interface for TUEL configuration
 * @interface TuelConfigContextValue
 */
export interface TuelConfigContextValue {
  /** Current configuration object */
  config: TuelConfig;
  /** Update multiple configuration values at once */
  updateConfig: (updates: Partial<TuelConfig>) => void;
  /** Reset configuration to default values */
  resetConfig: () => void;
  /** Get a specific configuration value with type safety */
  getConfigValue: <K extends keyof TuelConfig>(key: K) => TuelConfig[K];
  /** Set a specific configuration value with type safety */
  setConfigValue: <K extends keyof TuelConfig>(
    key: K,
    value: TuelConfig[K]
  ) => void;
}

const defaultConfig: TuelConfig = {
  globalDuration: 300,
  globalEase: "easeInOut",
  reducedMotion: false,
  enableFrameControl: true,
  targetFPS: 60,
  enableOptimizations: true,
  theme: "auto",
  colorScheme: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#8b5cf6",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
  },
  enableDebug: false,
  showPerformanceMetrics: false,
  logAnimations: false,
  custom: {},
};

const TuelConfigContext = createContext<TuelConfigContextValue | undefined>(
  undefined
);

/**
 * Props for the TuelConfigProvider component
 * @interface TuelConfigProviderProps
 */
export interface TuelConfigProviderProps {
  /** Child components that will have access to the configuration */
  children: React.ReactNode;
  /** Initial configuration values to merge with defaults */
  initialConfig?: Partial<TuelConfig>;
  /** Whether to persist configuration to localStorage (default: true) */
  persistConfig?: boolean;
  /** localStorage key for persisting config (default: "tuel-config") */
  storageKey?: string;
}

/**
 * Configuration provider for TUEL animation system
 * 
 * Provides global configuration management with:
 * - Optional localStorage persistence
 * - Automatic reduced motion detection
 * - Auto theme detection (light/dark)
 * - SSR-safe implementation
 * 
 * @example
 * ```tsx
 * <TuelConfigProvider
 *   initialConfig={{ globalDuration: 500 }}
 *   persistConfig={true}
 * >
 *   <App />
 * </TuelConfigProvider>
 * ```
 * 
 * @param props - Configuration provider props
 * @returns Provider component wrapping children
 */
export function TuelConfigProvider({
  children,
  initialConfig = {},
  persistConfig = true,
  storageKey = "tuel-config",
}: TuelConfigProviderProps) {
  const [config, setConfig] = useState<TuelConfig>(() => {
    const merged = { ...defaultConfig, ...initialConfig };

    if (persistConfig && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedConfig = JSON.parse(stored);
          return { ...merged, ...parsedConfig };
        }
      } catch (error) {
        console.warn("Failed to load TUEL config from localStorage:", error);
      }
    }

    return merged;
  });

  const updateConfig = useCallback(
    (updates: Partial<TuelConfig>) => {
      setConfig((prevConfig) => {
        const newConfig = { ...prevConfig, ...updates };

        if (persistConfig && typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, JSON.stringify(newConfig));
          } catch (error) {
            console.warn("Failed to save TUEL config to localStorage:", error);
          }
        }

        return newConfig;
      });
    },
    [persistConfig, storageKey]
  );

  const resetConfig = useCallback(() => {
    const merged = { ...defaultConfig, ...initialConfig };
    setConfig(merged);

    if (persistConfig && typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn("Failed to clear TUEL config from localStorage:", error);
      }
    }
  }, [initialConfig, persistConfig, storageKey]);

  const getConfigValue = useCallback(
    <K extends keyof TuelConfig>(key: K): TuelConfig[K] => {
      return config[key];
    },
    [config]
  );

  const setConfigValue = useCallback(
    <K extends keyof TuelConfig>(key: K, value: TuelConfig[K]) => {
      updateConfig({ [key]: value } as Partial<TuelConfig>);
    },
    [updateConfig]
  );

  // Auto-detect reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return;

    const updateReducedMotion = (e?: MediaQueryListEvent) => {
      const matches = e ? e.matches : mediaQuery.matches;
      setConfig((prev) => ({ ...prev, reducedMotion: matches }));
    };

    // Set initial value
    updateReducedMotion();

    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []); // Empty deps - use setConfig directly to avoid listener accumulation

  // Auto-detect theme preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (!mediaQuery) return;
    const updateTheme = () => {
      setConfig((prev) => {
        // Only update if theme is set to "auto"
        if (prev.theme !== "auto") return prev;

        const isDark = mediaQuery.matches;
        return {
          ...prev,
          colorScheme: {
            ...prev.colorScheme,
            background: isDark ? "#0f172a" : "#ffffff",
            surface: isDark ? "#1e293b" : "#f8fafc",
            text: isDark ? "#f1f5f9" : "#1e293b",
          },
        };
      });
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []); // Empty deps - use setConfig directly to avoid listener accumulation

  const contextValue: TuelConfigContextValue = {
    config,
    updateConfig,
    resetConfig,
    getConfigValue,
    setConfigValue,
  };

  return React.createElement(
    TuelConfigContext.Provider,
    { value: contextValue },
    children
  );
}

/**
 * Hook to access TUEL configuration
 * 
 * Must be used within a TuelConfigProvider. Provides access to:
 * - Current configuration
 * - Configuration update methods
 * - Type-safe configuration getters/setters
 * 
 * @example
 * ```tsx
 * const { config, updateConfig } = useTuelConfig();
 * updateConfig({ globalDuration: 400 });
 * ```
 * 
 * @returns Configuration context value
 * @throws Error if used outside TuelConfigProvider
 */
export function useTuelConfig(): TuelConfigContextValue {
  const context = useContext(TuelConfigContext);

  if (!context) {
    throw new Error("useTuelConfig must be used within a TuelConfigProvider");
  }

  return context;
}

/**
 * Hook to get a specific config value with type safety
 * 
 * Convenience hook for accessing a single configuration value.
 * The return type is automatically inferred based on the key.
 * 
 * @example
 * ```tsx
 * const duration = useConfigValue('globalDuration'); // number
 * const theme = useConfigValue('theme'); // "light" | "dark" | "auto"
 * ```
 * 
 * @param key - Configuration key to retrieve
 * @returns The value for the specified configuration key
 * @template K - Key of TuelConfig
 */
export function useConfigValue<K extends keyof TuelConfig>(
  key: K
): TuelConfig[K] {
  const { getConfigValue } = useTuelConfig();
  return getConfigValue(key);
}

/**
 * Hook to get animation settings based on current config
 * 
 * Returns animation-specific configuration with reduced motion support.
 * When reduced motion is enabled, duration is set to 0.
 * 
 * @example
 * ```tsx
 * const { duration, ease, shouldAnimate } = useAnimationConfig();
 * 
 * <motion.div
 *   animate={{ opacity: shouldAnimate ? 1 : 1 }}
 *   transition={{ duration: duration / 1000, ease }}
 * />
 * ```
 * 
 * @returns Animation configuration object with:
 *   - duration: Animation duration (0 if reduced motion)
 *   - ease: Easing function
 *   - reducedMotion: Whether reduced motion is enabled
 *   - shouldAnimate: Whether animations should be enabled
 */
export function useAnimationConfig() {
  const { config } = useTuelConfig();

  return {
    duration: config.reducedMotion ? 0 : config.globalDuration,
    ease: config.globalEase,
    reducedMotion: config.reducedMotion,
    shouldAnimate: !config.reducedMotion,
  };
}

/**
 * Higher-order component to provide config-aware animations
 * 
 * Wraps a component and automatically injects animation configuration
 * as props (duration, ease, reducedMotion, shouldAnimate).
 * 
 * @example
 * ```tsx
 * function MyComponent({ duration, ease, shouldAnimate }) {
 *   return <motion.div transition={{ duration: duration / 1000, ease }} />;
 * }
 * 
 * export default withTuelConfig(MyComponent);
 * ```
 * 
 * @param Component - Component to wrap with configuration
 * @returns Wrapped component with injected animation config props
 * @template P - Component props type
 */
export function withTuelConfig<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ConfiguredComponent(props: P) {
    const config = useAnimationConfig();

    return React.createElement(Component, {
      ...props,
      ...config,
    });
  };
}
