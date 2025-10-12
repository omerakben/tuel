import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  useTheme,
  useThemeAnimation,
  createTheme,
  defaultThemes,
} from "../themeConfig";

describe("useTheme", () => {
  it("should return modern light theme by default", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.name).toBe("Modern Light");
    expect(result.current.colors.primary).toBe("#3b82f6");
    expect(result.current.colors.background).toBe("#ffffff");
  });

  it("should return modern dark theme when specified", () => {
    const { result } = renderHook(() => useTheme("modern", "dark"));

    expect(result.current.name).toBe("Modern Dark");
    expect(result.current.colors.primary).toBe("#60a5fa");
    expect(result.current.colors.background).toBe("#0f172a");
  });

  it("should return minimal light theme", () => {
    const { result } = renderHook(() => useTheme("minimal", "light"));

    expect(result.current.name).toBe("Minimal Light");
    expect(result.current.colors.primary).toBe("#000000");
    expect(result.current.colors.background).toBe("#ffffff");
  });

  it("should return minimal dark theme", () => {
    const { result } = renderHook(() => useTheme("minimal", "dark"));

    expect(result.current.name).toBe("Minimal Dark");
    expect(result.current.colors.primary).toBe("#ffffff");
    expect(result.current.colors.background).toBe("#000000");
  });

  it("should fallback to modern theme for unknown theme name", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // @ts-ignore - testing invalid theme name
    const { result } = renderHook(() => useTheme("nonexistent", "light"));

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Theme "nonexistent" not found, falling back to "modern"'
    );

    expect(result.current.name).toBe("Modern Light");

    consoleWarnSpy.mockRestore();
  });

  it("should have all required theme properties", () => {
    const { result } = renderHook(() => useTheme("modern", "light"));

    expect(result.current).toHaveProperty("name");
    expect(result.current).toHaveProperty("colors");
    expect(result.current).toHaveProperty("animations");
    expect(result.current).toHaveProperty("spacing");
    expect(result.current).toHaveProperty("borderRadius");
    expect(result.current).toHaveProperty("shadows");
  });

  it("should have animation duration keys", () => {
    const { result } = renderHook(() => useTheme("modern", "light"));

    expect(result.current.animations.duration).toHaveProperty("fast");
    expect(result.current.animations.duration).toHaveProperty("normal");
    expect(result.current.animations.duration).toHaveProperty("slow");
    expect(result.current.animations.duration).toHaveProperty("slower");
  });

  it("should have animation easing keys", () => {
    const { result } = renderHook(() => useTheme("modern", "light"));

    expect(result.current.animations.easing).toHaveProperty("ease");
    expect(result.current.animations.easing).toHaveProperty("easeIn");
    expect(result.current.animations.easing).toHaveProperty("easeOut");
    expect(result.current.animations.easing).toHaveProperty("easeInOut");
    expect(result.current.animations.easing).toHaveProperty("spring");
    expect(result.current.animations.easing).toHaveProperty("bounce");
  });

  it("should memoize theme configuration", () => {
    const { result, rerender } = renderHook(
      ({ themeName, colorScheme }) => useTheme(themeName, colorScheme),
      {
        initialProps: { themeName: "modern" as const, colorScheme: "light" as const },
      }
    );

    const firstResult = result.current;

    // Rerender with same props
    rerender({ themeName: "modern", colorScheme: "light" });

    // Should return same object reference due to memoization
    expect(result.current).toBe(firstResult);
  });

  it("should return new theme when props change", () => {
    const { result, rerender } = renderHook(
      ({ themeName, colorScheme }) => useTheme(themeName, colorScheme),
      {
        initialProps: { themeName: "modern" as const, colorScheme: "light" as const },
      }
    );

    const firstResult = result.current;

    // Rerender with different props
    rerender({ themeName: "modern", colorScheme: "dark" });

    // Should return different object
    expect(result.current).not.toBe(firstResult);
    expect(result.current.name).toBe("Modern Dark");
  });
});

describe("useThemeAnimation", () => {
  it("should return animation helper functions", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current).toHaveProperty("duration");
    expect(result.current).toHaveProperty("easing");
    expect(result.current).toHaveProperty("timing");
    expect(result.current).toHaveProperty("color");
    expect(result.current).toHaveProperty("spacing");
    expect(result.current).toHaveProperty("radius");
    expect(result.current).toHaveProperty("shadow");
  });

  it("should get duration by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.duration("fast")).toBe(150);
    expect(result.current.duration("normal")).toBe(300);
    expect(result.current.duration("slow")).toBe(500);
    expect(result.current.duration("slower")).toBe(750);
  });

  it("should get easing by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.easing("ease")).toBe("ease");
    expect(result.current.easing("easeIn")).toBe("ease-in");
    expect(result.current.easing("spring")).toEqual([0.25, 0.46, 0.45, 0.94]);
  });

  it("should get timing by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.timing("stagger")).toBe(50);
    expect(result.current.timing("delay")).toBe(100);
  });

  it("should get color by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.color("primary")).toBe("#3b82f6");
    expect(result.current.color("background")).toBe("#ffffff");
  });

  it("should get spacing by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.spacing("xs")).toBe(4);
    expect(result.current.spacing("sm")).toBe(8);
    expect(result.current.spacing("md")).toBe(16);
  });

  it("should get border radius by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.radius("sm")).toBe(4);
    expect(result.current.radius("md")).toBe(8);
    expect(result.current.radius("full")).toBe(9999);
  });

  it("should get shadow by key", () => {
    const theme = defaultThemes.modern.light;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.shadow("sm")).toBe("0 1px 2px 0 rgb(0 0 0 / 0.05)");
    expect(result.current.shadow("md")).toBe("0 4px 6px -1px rgb(0 0 0 / 0.1)");
  });

  it("should memoize helper functions", () => {
    const theme = defaultThemes.modern.light;
    const { result, rerender } = renderHook(() => useThemeAnimation(theme));

    const firstResult = result.current;

    // Rerender with same theme
    rerender();

    // Should return same object reference
    expect(result.current).toBe(firstResult);
  });

  it("should work with minimal theme", () => {
    const theme = defaultThemes.minimal.dark;
    const { result } = renderHook(() => useThemeAnimation(theme));

    expect(result.current.duration("fast")).toBe(100);
    expect(result.current.color("primary")).toBe("#ffffff");
    expect(result.current.spacing("xs")).toBe(2);
  });
});

describe("createTheme", () => {
  it("should create custom theme based on modern", () => {
    const custom = createTheme("modern", {
      light: {
        colors: {
          primary: "#ff0000",
          secondary: "#00ff00",
        },
      },
      dark: {
        colors: {
          primary: "#ff5555",
          secondary: "#55ff55",
        },
      },
    });

    expect(custom.light.colors.primary).toBe("#ff0000");
    expect(custom.light.colors.secondary).toBe("#00ff00");
    expect(custom.dark.colors.primary).toBe("#ff5555");
    expect(custom.dark.colors.secondary).toBe("#55ff55");
  });

  it("should preserve base theme properties not overridden", () => {
    const custom = createTheme("modern", {
      light: {
        colors: {
          primary: "#ff0000",
        },
      },
    });

    // Custom color
    expect(custom.light.colors.primary).toBe("#ff0000");

    // Base theme colors preserved
    expect(custom.light.colors.secondary).toBe("#64748b");
    expect(custom.light.colors.background).toBe("#ffffff");

    // Base theme properties preserved
    expect(custom.light.spacing.md).toBe(16);
    expect(custom.light.borderRadius.md).toBe(8);
  });

  it("should create custom theme based on minimal", () => {
    const custom = createTheme("minimal", {
      light: {
        colors: {
          primary: "#333333",
        },
      },
    });

    expect(custom.light.colors.primary).toBe("#333333");
    expect(custom.light.colors.background).toBe("#ffffff"); // from base
  });

  it("should allow partial animation overrides", () => {
    const custom = createTheme("modern", {
      light: {
        animations: {
          duration: {
            fast: 50,
          },
        },
      },
    });

    // Custom duration
    expect(custom.light.animations.duration.fast).toBe(50);

    // Base durations preserved
    expect(custom.light.animations.duration.normal).toBe(300);
    expect(custom.light.animations.duration.slow).toBe(500);
  });

  it("should create theme with both variants customized", () => {
    const custom = createTheme("modern", {
      light: {
        colors: { primary: "#aaa" },
      },
      dark: {
        colors: { primary: "#bbb" },
      },
    });

    expect(custom.light.colors.primary).toBe("#aaa");
    expect(custom.dark.colors.primary).toBe("#bbb");
  });

  it("should handle empty customizations", () => {
    const custom = createTheme("modern", {});

    // Should be same as base theme
    expect(custom.light.colors.primary).toBe(defaultThemes.modern.light.colors.primary);
    expect(custom.dark.colors.primary).toBe(defaultThemes.modern.dark.colors.primary);
  });
});

describe("defaultThemes", () => {
  it("should have modern theme with both variants", () => {
    expect(defaultThemes).toHaveProperty("modern");
    expect(defaultThemes.modern).toHaveProperty("light");
    expect(defaultThemes.modern).toHaveProperty("dark");
  });

  it("should have minimal theme with both variants", () => {
    expect(defaultThemes).toHaveProperty("minimal");
    expect(defaultThemes.minimal).toHaveProperty("light");
    expect(defaultThemes.minimal).toHaveProperty("dark");
  });

  it("modern light theme should have correct structure", () => {
    const theme = defaultThemes.modern.light;

    expect(theme.name).toBe("Modern Light");
    expect(theme.colors).toBeDefined();
    expect(theme.animations).toBeDefined();
    expect(theme.spacing).toBeDefined();
    expect(theme.borderRadius).toBeDefined();
    expect(theme.shadows).toBeDefined();
  });

  it("modern dark theme should have darker colors", () => {
    const light = defaultThemes.modern.light;
    const dark = defaultThemes.modern.dark;

    expect(dark.colors.background).not.toBe(light.colors.background);
    expect(dark.colors.text).not.toBe(light.colors.text);
  });

  it("minimal theme should have simpler design tokens", () => {
    const modern = defaultThemes.modern.light;
    const minimal = defaultThemes.minimal.light;

    // Minimal has faster animations
    expect(minimal.animations.duration.fast).toBeLessThan(
      modern.animations.duration.fast
    );

    // Minimal has smaller spacing
    expect(minimal.spacing.xs).toBeLessThan(modern.spacing.xs);
  });
});
