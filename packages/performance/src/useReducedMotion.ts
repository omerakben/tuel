"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface ReducedMotionOptions {
  /** Force reduced motion regardless of system preference */
  forceReduced?: boolean;
  /** Callback when reduced motion preference changes */
  onPreferenceChange?: (reducedMotion: boolean) => void;
  /** Fallback value when media query is not supported */
  fallback?: boolean;
}

export interface ReducedMotionState {
  reducedMotion: boolean;
  isSupported: boolean;
  preference: "reduce" | "no-preference" | "unknown";
}

/**
 * Hook to detect and respond to reduced motion preferences
 * Provides accessibility-first animation controls based on user preferences
 */
export function useReducedMotion(
  options: ReducedMotionOptions = {}
): ReducedMotionState {
  const {
    forceReduced = false,
    onPreferenceChange,
    fallback = false,
  } = options;

  const [state, setState] = useState<ReducedMotionState>({
    reducedMotion: fallback,
    isSupported: false,
    preference: "unknown",
  });

  const callbackRef = useRef(onPreferenceChange);
  callbackRef.current = onPreferenceChange;

  const updatePreference = useCallback(
    (matches: boolean) => {
      const newState: ReducedMotionState = {
        reducedMotion: forceReduced || matches,
        isSupported: true,
        preference: matches ? "reduce" : "no-preference",
      };

      setState((prevState) => {
        if (prevState.reducedMotion !== newState.reducedMotion) {
          callbackRef.current?.(newState.reducedMotion);
        }
        return newState;
      });
    },
    [forceReduced]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial state
    updatePreference(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      updatePreference(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [updatePreference]);

  return state;
}

/**
 * Hook to get safe animation duration based on reduced motion preference
 */
export function useSafeDuration(
  duration: number,
  reducedDuration: number = 0
): number {
  const { reducedMotion } = useReducedMotion();
  return reducedMotion ? reducedDuration : duration;
}

/**
 * Hook to get safe animation values based on reduced motion preference
 */
export function useSafeAnimation<T>(normalValue: T, reducedValue: T): T {
  const { reducedMotion } = useReducedMotion();
  return reducedMotion ? reducedValue : normalValue;
}

/**
 * Higher-order function to create reduced motion aware animations
 */
export function withReducedMotion<T extends Record<string, any>>(
  normalAnimation: T,
  reducedAnimation: Partial<T>
): (reducedMotion: boolean) => T {
  return (reducedMotion: boolean) => {
    if (reducedMotion) {
      return { ...normalAnimation, ...reducedAnimation } as T;
    }
    return normalAnimation;
  };
}

/**
 * Utility to check if reduced motion is preferred (synchronous)
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined") return false;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
}

/**
 * Component wrapper that respects reduced motion preferences
 */
export interface ReducedMotionWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function ReducedMotionWrapper({
  children,
  fallback = null,
  className,
}: ReducedMotionWrapperProps) {
  const { reducedMotion } = useReducedMotion();

  if (reducedMotion && fallback) {
    return React.createElement("div", { className }, fallback);
  }

  return React.createElement("div", { className }, children);
}
