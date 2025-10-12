import { render, screen, waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  TuelConfigProvider,
  useTuelConfig,
  useConfigValue,
  useAnimationConfig,
  withTuelConfig,
} from "../configProvider";
import React from "react";

describe("TuelConfigProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should provide default configuration", () => {
    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider>{children}</TuelConfigProvider>
      ),
    });

    expect(result.current.config.globalDuration).toBe(300);
    expect(result.current.config.globalEase).toBe("easeInOut");
    expect(result.current.config.theme).toBe("auto");
  });

  it("should merge initial config with defaults", () => {
    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider
          initialConfig={{
            globalDuration: 500,
            theme: "dark",
          }}
        >
          {children}
        </TuelConfigProvider>
      ),
    });

    expect(result.current.config.globalDuration).toBe(500);
    expect(result.current.config.theme).toBe("dark");
    expect(result.current.config.enableFrameControl).toBe(true); // default value
  });

  it("should update configuration", () => {
    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider>{children}</TuelConfigProvider>
      ),
    });

    act(() => {
      result.current.updateConfig({
        globalDuration: 600,
        enableDebug: true,
      });
    });

    expect(result.current.config.globalDuration).toBe(600);
    expect(result.current.config.enableDebug).toBe(true);
  });

  it("should reset configuration to defaults", () => {
    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider
          initialConfig={{
            globalDuration: 500,
          }}
        >
          {children}
        </TuelConfigProvider>
      ),
    });

    act(() => {
      result.current.updateConfig({ globalDuration: 800 });
    });

    expect(result.current.config.globalDuration).toBe(800);

    act(() => {
      result.current.resetConfig();
    });

    expect(result.current.config.globalDuration).toBe(500); // initial config value
  });

  it("should get and set config values", () => {
    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider>{children}</TuelConfigProvider>
      ),
    });

    const duration = result.current.getConfigValue("globalDuration");
    expect(duration).toBe(300);

    act(() => {
      result.current.setConfigValue("globalDuration", 700);
    });

    expect(result.current.config.globalDuration).toBe(700);
  });

  it("should persist config to localStorage when enabled", () => {
    const storageKey = "test-tuel-config";

    renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider persistConfig={true} storageKey={storageKey}>
          {children}
        </TuelConfigProvider>
      ),
    });

    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider persistConfig={true} storageKey={storageKey}>
          {children}
        </TuelConfigProvider>
      ),
    });

    act(() => {
      result.current.updateConfig({ globalDuration: 999 });
    });

    const stored = localStorage.getItem(storageKey);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.globalDuration).toBe(999);
  });

  it("should load config from localStorage on mount", () => {
    const storageKey = "test-tuel-config-load";
    const savedConfig = {
      globalDuration: 888,
      theme: "dark",
    };

    localStorage.setItem(storageKey, JSON.stringify(savedConfig));

    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider persistConfig={true} storageKey={storageKey}>
          {children}
        </TuelConfigProvider>
      ),
    });

    expect(result.current.config.globalDuration).toBe(888);
    expect(result.current.config.theme).toBe("dark");
  });

  it("should not persist when persistConfig is false", () => {
    const storageKey = "test-no-persist";

    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider persistConfig={false} storageKey={storageKey}>
          {children}
        </TuelConfigProvider>
      ),
    });

    act(() => {
      result.current.updateConfig({ globalDuration: 777 });
    });

    const stored = localStorage.getItem(storageKey);
    expect(stored).toBeNull();
  });

  it("should throw error when useTuelConfig is used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTuelConfig());
    }).toThrow("useTuelConfig must be used within a TuelConfigProvider");

    consoleSpy.mockRestore();
  });

  it("should handle localStorage errors gracefully", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    // Mock localStorage.setItem to throw
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage full");
    });

    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider persistConfig={true}>
          {children}
        </TuelConfigProvider>
      ),
    });

    act(() => {
      result.current.updateConfig({ globalDuration: 666 });
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to save TUEL config"),
      expect.any(Error)
    );

    setItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});

describe("useConfigValue", () => {
  it("should return specific config value", () => {
    const { result } = renderHook(() => useConfigValue("globalDuration"), {
      wrapper: ({ children }) => (
        <TuelConfigProvider>{children}</TuelConfigProvider>
      ),
    });

    expect(result.current).toBe(300);
  });

  it("should return updated value after config change", () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <TuelConfigProvider>{children}</TuelConfigProvider>
    );

    const { result: configResult } = renderHook(() => useTuelConfig(), {
      wrapper: Wrapper,
    });

    const { result: valueResult } = renderHook(
      () => useConfigValue("globalDuration"),
      { wrapper: Wrapper }
    );

    expect(valueResult.current).toBe(300);

    act(() => {
      configResult.current.updateConfig({ globalDuration: 555 });
    });

    expect(valueResult.current).toBe(555);
  });
});

describe("useAnimationConfig", () => {
  it("should return animation config with defaults", () => {
    const { result } = renderHook(() => useAnimationConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider>{children}</TuelConfigProvider>
      ),
    });

    expect(result.current.duration).toBe(300);
    expect(result.current.ease).toBe("easeInOut");
    expect(result.current.reducedMotion).toBe(false);
    expect(result.current.shouldAnimate).toBe(true);
  });

  it("should return zero duration when reducedMotion is true", () => {
    const { result } = renderHook(() => useAnimationConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider
          initialConfig={{
            reducedMotion: true,
          }}
        >
          {children}
        </TuelConfigProvider>
      ),
    });

    expect(result.current.duration).toBe(0);
    expect(result.current.shouldAnimate).toBe(false);
  });

  it("should update when config changes", () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <TuelConfigProvider>{children}</TuelConfigProvider>
    );

    const { result: configResult } = renderHook(() => useTuelConfig(), {
      wrapper: Wrapper,
    });

    const { result: animResult } = renderHook(() => useAnimationConfig(), {
      wrapper: Wrapper,
    });

    act(() => {
      configResult.current.updateConfig({
        globalDuration: 450,
        globalEase: "linear",
      });
    });

    expect(animResult.current.duration).toBe(450);
    expect(animResult.current.ease).toBe("linear");
  });
});

describe("withTuelConfig HOC", () => {
  it("should inject animation config as props", () => {
    interface TestComponentProps {
      duration: number;
      ease: string | number[];
      reducedMotion: boolean;
      shouldAnimate: boolean;
    }

    const TestComponent: React.FC<TestComponentProps> = ({
      duration,
      ease,
      reducedMotion,
      shouldAnimate,
    }) => (
      <div>
        <span data-testid="duration">{duration}</span>
        <span data-testid="ease">{JSON.stringify(ease)}</span>
        <span data-testid="reduced">{String(reducedMotion)}</span>
        <span data-testid="animate">{String(shouldAnimate)}</span>
      </div>
    );

    const WrappedComponent = withTuelConfig(TestComponent);

    render(
      <TuelConfigProvider
        initialConfig={{
          globalDuration: 400,
          globalEase: "linear",
        }}
      >
        <WrappedComponent />
      </TuelConfigProvider>
    );

    expect(screen.getByTestId("duration").textContent).toBe("400");
    expect(screen.getByTestId("ease").textContent).toBe('"linear"');
    expect(screen.getByTestId("reduced").textContent).toBe("false");
    expect(screen.getByTestId("animate").textContent).toBe("true");
  });
});

describe("SSR Safety", () => {
  it("should handle missing window gracefully", () => {
    const originalWindow = global.window;
    
    // @ts-ignore - intentionally delete window for SSR simulation
    delete global.window;

    const { result } = renderHook(() => useTuelConfig(), {
      wrapper: ({ children }) => (
        <TuelConfigProvider persistConfig={true}>
          {children}
        </TuelConfigProvider>
      ),
    });

    // Should not crash and should have default values
    expect(result.current.config.globalDuration).toBe(300);

    // Restore window
    global.window = originalWindow;
  });
});
