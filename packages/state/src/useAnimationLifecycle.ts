"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TimingOptions {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  repeat?: number;
  repeatType?: "loop" | "reverse" | "mirror";
  repeatDelay?: number;
}

export interface AnimationLifecycleEvents {
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  onRepeat?: (repeatCount: number) => void;
  onReverse?: () => void;
  onCancel?: () => void;
}

export interface LifecycleState {
  phase: "idle" | "starting" | "running" | "paused" | "completed" | "cancelled";
  progress: number;
  duration: number;
  elapsed: number;
  remaining: number;
  repeatCount: number;
  isReversed: boolean;
}

/**
 * Animation lifecycle management hook
 * Provides comprehensive timing controls and lifecycle event handling
 */
export function useAnimationLifecycle(
  timing: TimingOptions = {},
  events: AnimationLifecycleEvents = {}
) {
  const {
    duration = 1000,
    delay = 0,
    ease = "easeInOut",
    repeat = 0,
    repeatType = "loop",
    repeatDelay = 0,
  } = timing;

  const { onStart, onUpdate, onComplete, onRepeat, onReverse, onCancel } =
    events;

  const [lifecycleState, setLifecycleState] = useState<LifecycleState>({
    phase: "idle",
    progress: 0,
    duration,
    elapsed: 0,
    remaining: duration,
    repeatCount: 0,
    isReversed: false,
  });

  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const pausedTimeRef = useRef<number>(0);

  const updateState = useCallback((updates: Partial<LifecycleState>) => {
    setLifecycleState((prev) => ({ ...prev, ...updates }));
  }, []);

  const easeFunction = useCallback(
    (t: number): number => {
      if (typeof ease === "string") {
        switch (ease) {
          case "linear":
            return t;
          case "easeIn":
            return t * t;
          case "easeOut":
            return 1 - (1 - t) * (1 - t);
          case "easeInOut":
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          default:
            return t;
        }
      } else if (Array.isArray(ease)) {
        // Cubic bezier implementation would go here
        return t;
      }
      return t;
    },
    [ease]
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        updateState({ phase: "running" });
        onStart?.();
      }

      const elapsed = timestamp - startTimeRef.current - pausedTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFunction(rawProgress);

      const remaining = Math.max(duration - elapsed, 0);

      updateState({
        progress: easedProgress,
        elapsed,
        remaining,
      });

      onUpdate?.(easedProgress);

      if (rawProgress >= 1) {
        if (lifecycleState.repeatCount < repeat) {
          const newCount = lifecycleState.repeatCount + 1;
          updateState({ repeatCount: newCount });
          onRepeat?.(newCount);

          if (repeatType === "reverse") {
            updateState({ isReversed: !lifecycleState.isReversed });
            onReverse?.();
          }

          // Reset for next iteration
          startTimeRef.current = undefined;
          pausedTimeRef.current = 0;

          if (repeatDelay > 0) {
            setTimeout(() => {
              animationRef.current = requestAnimationFrame(animate);
            }, repeatDelay);
          } else {
            animationRef.current = requestAnimationFrame(animate);
          }
        } else {
          updateState({ phase: "completed" });
          onComplete?.();
        }
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [
      duration,
      easeFunction,
      onStart,
      onUpdate,
      onComplete,
      onRepeat,
      onReverse,
      repeat,
      repeatType,
      repeatDelay,
      lifecycleState.repeatCount,
      lifecycleState.isReversed,
      updateState,
    ]
  );

  const start = useCallback(() => {
    if (lifecycleState.phase === "running") return;

    updateState({ phase: "starting" });

    if (delay > 0) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [lifecycleState.phase, delay, animate, updateState]);

  const pause = useCallback(() => {
    if (lifecycleState.phase !== "running") return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    pausedTimeRef.current += Date.now() - (startTimeRef.current || Date.now());
    updateState({ phase: "paused" });
  }, [lifecycleState.phase, updateState]);

  const resume = useCallback(() => {
    if (lifecycleState.phase !== "paused") return;

    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);
    updateState({ phase: "running" });
  }, [lifecycleState.phase, animate, updateState]);

  const cancel = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = undefined;
    pausedTimeRef.current = 0;

    updateState({
      phase: "cancelled",
      progress: 0,
      elapsed: 0,
      remaining: duration,
      repeatCount: 0,
      isReversed: false,
    });

    onCancel?.();
  }, [duration, onCancel, updateState]);

  const reset = useCallback(() => {
    cancel();
    updateState({ phase: "idle" });
  }, [cancel, updateState]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    // State
    ...lifecycleState,

    // Controls
    start,
    pause,
    resume,
    cancel,
    reset,

    // Utils
    isActive: lifecycleState.phase === "running",
    isPaused: lifecycleState.phase === "paused",
    isComplete: lifecycleState.phase === "completed",
    isCancelled: lifecycleState.phase === "cancelled",
    canStart: ["idle", "completed", "cancelled"].includes(lifecycleState.phase),
    canPause: lifecycleState.phase === "running",
    canResume: lifecycleState.phase === "paused",
  };
}
