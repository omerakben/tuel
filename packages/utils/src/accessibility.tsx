/**
 * Comprehensive accessibility utilities for TUEL components
 * Provides WCAG 2.1 AA compliance, keyboard navigation, and screen reader support
 */

import { useEffect, useRef, useState, useCallback } from "react";

export interface AccessibilityConfig {
  enableReducedMotion: boolean;
  enableHighContrast: boolean;
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  announceChanges: boolean;
  focusManagement: boolean;
}

export interface FocusTrapOptions {
  initialFocus?: HTMLElement;
  returnFocusOnDeactivate?: boolean;
  clickOutsideDeactivates?: boolean;
  escapeKeyDeactivates?: boolean;
}

export interface AnnouncementOptions {
  priority?: "polite" | "assertive";
  delay?: number;
}

const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  enableReducedMotion: true,
  enableHighContrast: true,
  enableKeyboardNavigation: true,
  enableScreenReader: true,
  announceChanges: true,
  focusManagement: true,
};

/**
 * Hook for detecting user preferences
 */
export function useAccessibilityPreferences(): {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersColorScheme: "light" | "dark" | "no-preference";
  screenReaderActive: boolean;
} {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersColorScheme: "no-preference" as const,
    screenReaderActive: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check reduced motion preference
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: reducedMotionQuery.matches,
        prefersHighContrast: highContrastQuery.matches,
        prefersColorScheme: colorSchemeQuery.matches ? "dark" : "light",
        screenReaderActive: detectScreenReader(),
      });
    };

    // Initial check
    updatePreferences();

    // Listen for changes
    reducedMotionQuery.addEventListener("change", updatePreferences);
    highContrastQuery.addEventListener("change", updatePreferences);
    colorSchemeQuery.addEventListener("change", updatePreferences);

    return () => {
      reducedMotionQuery.removeEventListener("change", updatePreferences);
      highContrastQuery.removeEventListener("change", updatePreferences);
      colorSchemeQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  return preferences;
}

/**
 * Detect if screen reader is active
 */
function detectScreenReader(): boolean {
  if (typeof window === "undefined") return false;

  // Check for common screen reader indicators
  const hasScreenReader =
    window.navigator.userAgent.includes("NVDA") ||
    window.navigator.userAgent.includes("JAWS") ||
    window.navigator.userAgent.includes("VoiceOver") ||
    window.navigator.userAgent.includes("TalkBack") ||
    // Check for accessibility API
    (window as any).speechSynthesis ||
    (window as any).webkitSpeechSynthesis;

  return hasScreenReader;
}

/**
 * Hook for managing focus
 */
export function useFocusManagement() {
  const focusHistoryRef = useRef<HTMLElement[]>([]);
  const currentFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback((element: HTMLElement) => {
    if (document.activeElement instanceof HTMLElement) {
      focusHistoryRef.current.push(document.activeElement);
    }
    currentFocusRef.current = element;
  }, []);

  const restoreFocus = useCallback(() => {
    const previousFocus = focusHistoryRef.current.pop();
    if (previousFocus) {
      previousFocus.focus();
      currentFocusRef.current = previousFocus;
    }
  }, []);

  const focusElement = useCallback((element: HTMLElement) => {
    element.focus();
    currentFocusRef.current = element;
  }, []);

  const trapFocus = useCallback(
    (container: HTMLElement, options: FocusTrapOptions = {}) => {
      const {
        initialFocus,
        returnFocusOnDeactivate = true,
        clickOutsideDeactivates = true,
        escapeKeyDeactivates = true,
      } = options;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Set initial focus
      if (initialFocus) {
        initialFocus.focus();
      } else if (firstElement) {
        firstElement.focus();
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        } else if (event.key === "Escape" && escapeKeyDeactivates) {
          // Handle escape key
          if (returnFocusOnDeactivate) {
            restoreFocus();
          }
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          clickOutsideDeactivates &&
          !container.contains(event.target as Node)
        ) {
          if (returnFocusOnDeactivate) {
            restoreFocus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClickOutside);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("click", handleClickOutside);
      };
    },
    [restoreFocus]
  );

  return {
    saveFocus,
    restoreFocus,
    focusElement,
    trapFocus,
    currentFocus: currentFocusRef.current,
  };
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReaderAnnouncements() {
  const announceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create live region for announcements
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.style.position = "absolute";
    liveRegion.style.left = "-10000px";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.overflow = "hidden";
    document.body.appendChild(liveRegion);

    announceRef.current = liveRegion;

    return () => {
      if (liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    };
  }, []);

  const announce = useCallback(
    (message: string, options: AnnouncementOptions = {}) => {
      const { priority = "polite", delay = 0 } = options;

      if (!announceRef.current) return;

      const announceElement = announceRef.current;
      announceElement.setAttribute("aria-live", priority);

      const announceMessage = () => {
        announceElement.textContent = message;
        // Clear after announcement
        setTimeout(() => {
          announceElement.textContent = "";
        }, 1000);
      };

      if (delay > 0) {
        setTimeout(announceMessage, delay);
      } else {
        announceMessage();
      }
    },
    []
  );

  return { announce };
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(
  onKeyDown?: (event: KeyboardEvent) => void,
  onKeyUp?: (event: KeyboardEvent) => void
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Common keyboard shortcuts
      switch (event.key) {
        case "Enter":
        case " ":
          // Handle activation
          break;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          // Handle navigation
          break;
        case "Escape":
          // Handle escape
          break;
        case "Home":
          // Handle home
          break;
        case "End":
          // Handle end
          break;
      }

      onKeyDown?.(event);
    },
    [onKeyDown]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      onKeyUp?.(event);
    },
    [onKeyUp]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { handleKeyDown, handleKeyUp };
}

/**
 * Utility for generating ARIA labels
 */
export function generateAriaLabel(
  component: string,
  props: Record<string, unknown>
): string {
  const labels: string[] = [];

  // Add component name
  labels.push(component);

  // Add relevant props
  if (props.variant) {
    labels.push(`${props.variant} variant`);
  }
  if (props.state) {
    labels.push(`${props.state} state`);
  }
  if (props.disabled) {
    labels.push("disabled");
  }
  if (props.loading) {
    labels.push("loading");
  }

  return labels.join(", ");
}

/**
 * Utility for checking color contrast
 */
export function checkColorContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  level: "AA" | "AAA" | "fail";
  largeText: boolean;
} {
  // Simplified contrast calculation
  // In a real implementation, you'd use a proper color contrast library

  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Apply gamma correction
    const toLinear = (c: number) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  let level: "AA" | "AAA" | "fail";
  if (ratio >= 7) {
    level = "AAA";
  } else if (ratio >= 4.5) {
    level = "AA";
  } else {
    level = "fail";
  }

  return {
    ratio,
    level,
    largeText: false, // Would need font size to determine
  };
}

/**
 * Accessibility-aware animation hook
 */
export function useAccessibleAnimation(
  animationConfig: {
    duration?: number;
    easing?: string;
    delay?: number;
  },
  preferences: ReturnType<typeof useAccessibilityPreferences>
) {
  const getAnimationConfig = useCallback(() => {
    if (preferences.prefersReducedMotion) {
      return {
        duration: 0,
        easing: "linear",
        delay: 0,
      };
    }

    return {
      duration: animationConfig.duration || 300,
      easing: animationConfig.easing || "ease-in-out",
      delay: animationConfig.delay || 0,
    };
  }, [animationConfig, preferences.prefersReducedMotion]);

  return { getAnimationConfig };
}

/**
 * Accessibility context provider
 */
export interface AccessibilityContextValue {
  config: AccessibilityConfig;
  preferences: ReturnType<typeof useAccessibilityPreferences>;
  announce: (message: string, options?: AnnouncementOptions) => void;
  focusManagement: ReturnType<typeof useFocusManagement>;
}

export const AccessibilityContext =
  React.createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({
  children,
  config = DEFAULT_ACCESSIBILITY_CONFIG,
}: {
  children: React.ReactNode;
  config?: Partial<AccessibilityConfig>;
}) {
  const finalConfig = { ...DEFAULT_ACCESSIBILITY_CONFIG, ...config };
  const preferences = useAccessibilityPreferences();
  const { announce } = useScreenReaderAnnouncements();
  const focusManagement = useFocusManagement();

  const contextValue: AccessibilityContextValue = {
    config: finalConfig,
    preferences,
    announce,
    focusManagement,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook to use accessibility context
 */
export function useAccessibility(): AccessibilityContextValue {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}

/**
 * Higher-order component for accessibility
 */
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>,
  accessibilityProps?: Partial<AccessibilityConfig>
) {
  const WrappedComponent = (props: P) => {
    const accessibility = useAccessibility();

    // Merge accessibility props
    const mergedProps = {
      ...props,
      ...accessibilityProps,
      "aria-label":
        (props as any)["aria-label"] ||
        generateAriaLabel(Component.name || "Component", props),
    };

    return <Component {...mergedProps} />;
  };

  WrappedComponent.displayName = `withAccessibility(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}
