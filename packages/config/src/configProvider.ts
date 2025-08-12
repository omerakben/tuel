"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface TuelConfig {
  // Global animation settings
  globalDuration: number;
  globalEase: string | number[];
  reducedMotion: boolean;

  // Performance settings
  enableFrameControl: boolean;
  targetFPS: number;
  enableOptimizations: boolean;

  // Theme settings
  theme: "light" | "dark" | "auto";
  colorScheme: Record<string, string>;

  // Debug settings
  enableDebug: boolean;
  showPerformanceMetrics: boolean;
  logAnimations: boolean;

  // Custom settings
  custom: Record<string, any>;
}

export interface TuelConfigContextValue {
  config: TuelConfig;
  updateConfig: (updates: Partial<TuelConfig>) => void;
  resetConfig: () => void;
  getConfigValue: <K extends keyof TuelConfig>(key: K) => TuelConfig[K];
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

export interface TuelConfigProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<TuelConfig>;
  persistConfig?: boolean;
  storageKey?: string;
}

/**
 * Configuration provider for TUEL animation system
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
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = (event: MediaQueryListEvent) => {
      updateConfig({ reducedMotion: event.matches });
    };

    // Set initial value
    if (mediaQuery.matches !== config.reducedMotion) {
      updateConfig({ reducedMotion: mediaQuery.matches });
    }

    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, [config.reducedMotion, updateConfig]);

  // Auto-detect theme preference
  useEffect(() => {
    if (typeof window === "undefined" || config.theme !== "auto") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      const isDark = mediaQuery.matches;
      updateConfig({
        colorScheme: {
          ...config.colorScheme,
          background: isDark ? "#0f172a" : "#ffffff",
          surface: isDark ? "#1e293b" : "#f8fafc",
          text: isDark ? "#f1f5f9" : "#1e293b",
        },
      });
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [config.theme, config.colorScheme, updateConfig]);

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
 */
export function useConfigValue<K extends keyof TuelConfig>(
  key: K
): TuelConfig[K] {
  const { getConfigValue } = useTuelConfig();
  return getConfigValue(key);
}

/**
 * Hook to get animation settings based on current config
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
