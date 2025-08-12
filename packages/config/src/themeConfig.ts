"use client";

import { useMemo } from "react";

export interface ThemeConfig {
  name: string;
  colors: Record<string, string>;
  animations: {
    duration: Record<string, number>;
    easing: Record<string, string | number[]>;
    timing: Record<string, number>;
  };
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  shadows: Record<string, string>;
}

export interface ThemeVariant {
  light: ThemeConfig;
  dark: ThemeConfig;
}

/**
 * Default theme configurations
 */
export const defaultThemes: Record<string, ThemeVariant> = {
  modern: {
    light: {
      name: "Modern Light",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#8b5cf6",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      animations: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 750,
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.25, 0.46, 0.45, 0.94],
          bounce: [0.68, -0.55, 0.265, 1.55],
        },
        timing: {
          stagger: 50,
          delay: 100,
        },
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 48,
        "3xl": 64,
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      },
    },
    dark: {
      name: "Modern Dark",
      colors: {
        primary: "#60a5fa",
        secondary: "#94a3b8",
        accent: "#a78bfa",
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        border: "#334155",
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171",
      },
      animations: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 750,
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.25, 0.46, 0.45, 0.94],
          bounce: [0.68, -0.55, 0.265, 1.55],
        },
        timing: {
          stagger: 50,
          delay: 100,
        },
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 48,
        "3xl": 64,
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.25)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.3)",
      },
    },
  },

  minimal: {
    light: {
      name: "Minimal Light",
      colors: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#333333",
        background: "#ffffff",
        surface: "#fafafa",
        text: "#000000",
        textSecondary: "#666666",
        border: "#e0e0e0",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
      },
      animations: {
        duration: {
          fast: 100,
          normal: 200,
          slow: 300,
          slower: 400,
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.4, 0, 0.2, 1],
          bounce: [0.25, 0.46, 0.45, 0.94],
        },
        timing: {
          stagger: 25,
          delay: 50,
        },
      },
      spacing: {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        "2xl": 32,
        "3xl": 48,
      },
      borderRadius: {
        none: 0,
        sm: 2,
        md: 4,
        lg: 6,
        xl: 8,
        full: 9999,
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 2px 4px 0 rgb(0 0 0 / 0.1)",
        lg: "0 4px 8px 0 rgb(0 0 0 / 0.1)",
        xl: "0 8px 16px 0 rgb(0 0 0 / 0.1)",
      },
    },
    dark: {
      name: "Minimal Dark",
      colors: {
        primary: "#ffffff",
        secondary: "#999999",
        accent: "#cccccc",
        background: "#000000",
        surface: "#111111",
        text: "#ffffff",
        textSecondary: "#999999",
        border: "#333333",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
      },
      animations: {
        duration: {
          fast: 100,
          normal: 200,
          slow: 300,
          slower: 400,
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.4, 0, 0.2, 1],
          bounce: [0.25, 0.46, 0.45, 0.94],
        },
        timing: {
          stagger: 25,
          delay: 50,
        },
      },
      spacing: {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        "2xl": 32,
        "3xl": 48,
      },
      borderRadius: {
        none: 0,
        sm: 2,
        md: 4,
        lg: 6,
        xl: 8,
        full: 9999,
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(255 255 255 / 0.05)",
        md: "0 2px 4px 0 rgb(255 255 255 / 0.1)",
        lg: "0 4px 8px 0 rgb(255 255 255 / 0.1)",
        xl: "0 8px 16px 0 rgb(255 255 255 / 0.1)",
      },
    },
  },
};

/**
 * Hook to get current theme configuration
 */
export function useTheme(
  themeName: keyof typeof defaultThemes = "modern",
  colorScheme: "light" | "dark" = "light"
): ThemeConfig {
  return useMemo(() => {
    const theme = defaultThemes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found, falling back to "modern"`);
      return defaultThemes.modern[colorScheme];
    }
    return theme[colorScheme];
  }, [themeName, colorScheme]);
}

/**
 * Hook to get theme-aware animation values
 */
export function useThemeAnimation(theme: ThemeConfig) {
  return useMemo(() => {
    return {
      duration: (key: keyof typeof theme.animations.duration = "normal") =>
        theme.animations.duration[key],

      easing: (key: keyof typeof theme.animations.easing = "easeInOut") =>
        theme.animations.easing[key],

      timing: (key: keyof typeof theme.animations.timing = "delay") =>
        theme.animations.timing[key],

      color: (key: keyof typeof theme.colors) => theme.colors[key],

      spacing: (key: keyof typeof theme.spacing) => theme.spacing[key],

      radius: (key: keyof typeof theme.borderRadius) => theme.borderRadius[key],

      shadow: (key: keyof typeof theme.shadows) => theme.shadows[key],
    };
  }, [theme]);
}

/**
 * Create a custom theme configuration
 */
export function createTheme(
  baseTheme: keyof typeof defaultThemes,
  customizations: {
    light?: Partial<ThemeConfig>;
    dark?: Partial<ThemeConfig>;
  }
): ThemeVariant {
  const base = defaultThemes[baseTheme];

  return {
    light: {
      ...base.light,
      ...customizations.light,
      colors: {
        ...base.light.colors,
        ...customizations.light?.colors,
      },
      animations: {
        ...base.light.animations,
        ...customizations.light?.animations,
        duration: {
          ...base.light.animations.duration,
          ...customizations.light?.animations?.duration,
        },
        easing: {
          ...base.light.animations.easing,
          ...customizations.light?.animations?.easing,
        },
      },
    },
    dark: {
      ...base.dark,
      ...customizations.dark,
      colors: {
        ...base.dark.colors,
        ...customizations.dark?.colors,
      },
      animations: {
        ...base.dark.animations,
        ...customizations.dark?.animations,
        duration: {
          ...base.dark.animations.duration,
          ...customizations.dark?.animations?.duration,
        },
        easing: {
          ...base.dark.animations.easing,
          ...customizations.dark?.animations?.easing,
        },
      },
    },
  };
}
