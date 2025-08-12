"use client";

import { useAnimation, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AnimationState {
  current: string;
  previous: string | null;
  isAnimating: boolean;
  progress: number;
  duration: number;
}

export interface AnimationSequenceStep {
  name: string;
  duration?: number;
  delay?: number;
  ease?: string;
  onStart?: () => void;
  onComplete?: () => void;
  variants?: Record<string, any>;
}

export interface AnimationSequenceOptions {
  loop?: boolean;
  autoStart?: boolean;
  onSequenceComplete?: () => void;
  onSequenceStart?: () => void;
  onStepChange?: (step: AnimationSequenceStep, index: number) => void;
}

/**
 * Advanced animation sequence management hook
 * Provides complex animation state management, sequencing, and lifecycle controls
 * Based on Motion.dev patterns for sophisticated animation orchestration
 */
export function useAnimationSequence(
  steps: AnimationSequenceStep[],
  options: AnimationSequenceOptions = {}
) {
  const {
    loop = false,
    autoStart = false,
    onSequenceComplete,
    onSequenceStart,
    onStepChange,
  } = options;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>({
    current: steps[0]?.name || "",
    previous: null,
    isAnimating: false,
    progress: 0,
    duration: 0,
  });

  const controls = useAnimation();
  const progress = useMotionValue(0);
  const isRunning = useRef(false);
  const currentStep = steps[currentStepIndex];

  const updateState = useCallback((updates: Partial<AnimationState>) => {
    setAnimationState((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback(
    async (index: number) => {
      if (index < 0 || index >= steps.length || isRunning.current) return;

      const step = steps[index];
      const previousStep = animationState.current;

      setCurrentStepIndex(index);
      updateState({
        current: step.name,
        previous: previousStep,
        isAnimating: true,
        duration: step.duration || 1000,
      });

      onStepChange?.(step, index);
      step.onStart?.();

      try {
        if (step.variants) {
          await controls.start(step.variants);
        }

        step.onComplete?.();
        updateState({ isAnimating: false, progress: 1 });
      } catch (error) {
        updateState({ isAnimating: false });
      }
    },
    [steps, animationState.current, controls, onStepChange, updateState]
  );

  const next = useCallback(async () => {
    const nextIndex = currentStepIndex + 1;

    if (nextIndex >= steps.length) {
      if (loop) {
        await goToStep(0);
      } else {
        updateState({ isAnimating: false });
        onSequenceComplete?.();
      }
    } else {
      await goToStep(nextIndex);
    }
  }, [
    currentStepIndex,
    steps.length,
    loop,
    goToStep,
    onSequenceComplete,
    updateState,
  ]);

  const previous = useCallback(async () => {
    const prevIndex = currentStepIndex - 1;

    if (prevIndex >= 0) {
      await goToStep(prevIndex);
    }
  }, [currentStepIndex, goToStep]);

  const play = useCallback(async () => {
    if (isRunning.current) return;

    isRunning.current = true;
    onSequenceStart?.();

    for (let i = currentStepIndex; i < steps.length; i++) {
      await goToStep(i);

      if (!isRunning.current) break;

      if (i < steps.length - 1) {
        const nextStep = steps[i + 1];
        if (nextStep.delay) {
          await new Promise((resolve) => setTimeout(resolve, nextStep.delay));
        }
      }
    }

    if (loop && isRunning.current) {
      setCurrentStepIndex(0);
      play();
    } else {
      isRunning.current = false;
      onSequenceComplete?.();
    }
  }, [
    currentStepIndex,
    steps,
    goToStep,
    loop,
    onSequenceStart,
    onSequenceComplete,
  ]);

  const pause = useCallback(() => {
    isRunning.current = false;
    controls.stop();
    updateState({ isAnimating: false });
  }, [controls, updateState]);

  const reset = useCallback(async () => {
    isRunning.current = false;
    controls.stop();
    setCurrentStepIndex(0);
    updateState({
      current: steps[0]?.name || "",
      previous: null,
      isAnimating: false,
      progress: 0,
      duration: 0,
    });
  }, [controls, steps, updateState]);

  const jumpTo = useCallback(
    async (stepName: string) => {
      const index = steps.findIndex((step) => step.name === stepName);
      if (index !== -1) {
        await goToStep(index);
      }
    },
    [steps, goToStep]
  );

  useEffect(() => {
    if (autoStart && steps.length > 0) {
      play();
    }
  }, [autoStart, steps.length, play]);

  return {
    // State
    currentStep,
    currentStepIndex,
    animationState,
    isRunning: isRunning.current,
    progress,

    // Controls
    controls,
    play,
    pause,
    reset,
    next,
    previous,
    goToStep,
    jumpTo,

    // Utils
    canGoNext: currentStepIndex < steps.length - 1,
    canGoPrevious: currentStepIndex > 0,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
