"use client";

import { useMotionValue } from "framer-motion";
import { useCallback, useRef, useState } from "react";

export type AnimationVariant = Record<string, any>;

export interface VariantDefinition {
  [key: string]: AnimationVariant | VariantDefinition;
}

export interface VariantState {
  current: string;
  previous: string | null;
  isTransitioning: boolean;
  history: string[];
}

export interface VariantOptions {
  initial?: string;
  maxHistory?: number;
  onVariantChange?: (current: string, previous: string | null) => void;
  onTransitionStart?: (from: string, to: string) => void;
  onTransitionComplete?: (variant: string) => void;
}

/**
 * Advanced variant system hook
 * Manages complex animation variants with state tracking and transitions
 * Based on Motion.dev patterns for sophisticated variant management
 */
export function useVariants(
  variants: VariantDefinition,
  options: VariantOptions = {}
) {
  const {
    initial = Object.keys(variants)[0] || "",
    maxHistory = 10,
    onVariantChange,
    onTransitionStart,
    onTransitionComplete,
  } = options;

  const [variantState, setVariantState] = useState<VariantState>({
    current: initial,
    previous: null,
    isTransitioning: false,
    history: [initial],
  });

  const transitionProgress = useMotionValue(0);
  const isTransitioning = useRef(false);

  const updateHistory = useCallback(
    (variant: string, history: string[]) => {
      const newHistory = [variant, ...history.filter((v) => v !== variant)];
      return newHistory.slice(0, maxHistory);
    },
    [maxHistory]
  );

  const setVariant = useCallback(
    async (variantName: string) => {
      if (
        !variants[variantName] ||
        variantName === variantState.current ||
        isTransitioning.current
      ) {
        return false;
      }

      const previousVariant = variantState.current;
      isTransitioning.current = true;

      setVariantState((prev) => ({
        ...prev,
        previous: prev.current,
        current: variantName,
        isTransitioning: true,
        history: updateHistory(variantName, prev.history),
      }));

      onTransitionStart?.(previousVariant, variantName);
      onVariantChange?.(variantName, previousVariant);

      // Simulate transition completion
      transitionProgress.set(0);

      return new Promise<boolean>((resolve) => {
        // Animation would happen here in real implementation
        const duration = 300; // Default duration
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          transitionProgress.set(progress);

          if (progress >= 1) {
            isTransitioning.current = false;
            setVariantState((prev) => ({ ...prev, isTransitioning: false }));
            onTransitionComplete?.(variantName);
            resolve(true);
          } else {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    },
    [
      variants,
      variantState.current,
      updateHistory,
      onTransitionStart,
      onVariantChange,
      onTransitionComplete,
      transitionProgress,
    ]
  );

  const toggle = useCallback(
    async (variantA: string, variantB: string) => {
      const target = variantState.current === variantA ? variantB : variantA;
      return await setVariant(target);
    },
    [variantState.current, setVariant]
  );

  const cycle = useCallback(
    async (variantNames: string[]) => {
      const currentIndex = variantNames.indexOf(variantState.current);
      const nextIndex = (currentIndex + 1) % variantNames.length;
      return await setVariant(variantNames[nextIndex]);
    },
    [variantState.current, setVariant]
  );

  const revert = useCallback(async () => {
    if (variantState.previous) {
      return await setVariant(variantState.previous);
    }
    return false;
  }, [variantState.previous, setVariant]);

  const goToHistory = useCallback(
    async (index: number) => {
      const targetVariant = variantState.history[index];
      if (targetVariant && targetVariant !== variantState.current) {
        return await setVariant(targetVariant);
      }
      return false;
    },
    [variantState.history, variantState.current, setVariant]
  );

  const reset = useCallback(async () => {
    if (initial !== variantState.current) {
      return await setVariant(initial);
    }
    return false;
  }, [initial, variantState.current, setVariant]);

  return {
    // State
    current: variantState.current,
    previous: variantState.previous,
    isTransitioning: variantState.isTransitioning,
    history: variantState.history,
    transitionProgress,

    // Getters
    currentVariant: variants[variantState.current],
    availableVariants: Object.keys(variants),

    // Actions
    setVariant,
    toggle,
    cycle,
    revert,
    goToHistory,
    reset,

    // Utils
    hasVariant: (name: string) => name in variants,
    isCurrentVariant: (name: string) => name === variantState.current,
    canRevert: !!variantState.previous,
  };
}
