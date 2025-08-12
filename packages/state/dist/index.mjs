"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/useAnimationSequence.ts
import { useAnimation, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
function useAnimationSequence(steps, options = {}) {
  var _a;
  const {
    loop = false,
    autoStart = false,
    onSequenceComplete,
    onSequenceStart,
    onStepChange
  } = options;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [animationState, setAnimationState] = useState({
    current: ((_a = steps[0]) == null ? void 0 : _a.name) || "",
    previous: null,
    isAnimating: false,
    progress: 0,
    duration: 0
  });
  const controls = useAnimation();
  const progress = useMotionValue(0);
  const isRunning = useRef(false);
  const currentStep = steps[currentStepIndex];
  const updateState = useCallback((updates) => {
    setAnimationState((prev) => __spreadValues(__spreadValues({}, prev), updates));
  }, []);
  const goToStep = useCallback(
    async (index) => {
      var _a2, _b;
      if (index < 0 || index >= steps.length || isRunning.current) return;
      const step = steps[index];
      const previousStep = animationState.current;
      setCurrentStepIndex(index);
      updateState({
        current: step.name,
        previous: previousStep,
        isAnimating: true,
        duration: step.duration || 1e3
      });
      onStepChange == null ? void 0 : onStepChange(step, index);
      (_a2 = step.onStart) == null ? void 0 : _a2.call(step);
      try {
        if (step.variants) {
          await controls.start(step.variants);
        }
        (_b = step.onComplete) == null ? void 0 : _b.call(step);
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
        onSequenceComplete == null ? void 0 : onSequenceComplete();
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
    updateState
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
    onSequenceStart == null ? void 0 : onSequenceStart();
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
      onSequenceComplete == null ? void 0 : onSequenceComplete();
    }
  }, [
    currentStepIndex,
    steps,
    goToStep,
    loop,
    onSequenceStart,
    onSequenceComplete
  ]);
  const pause = useCallback(() => {
    isRunning.current = false;
    controls.stop();
    updateState({ isAnimating: false });
  }, [controls, updateState]);
  const reset = useCallback(async () => {
    var _a2;
    isRunning.current = false;
    controls.stop();
    setCurrentStepIndex(0);
    updateState({
      current: ((_a2 = steps[0]) == null ? void 0 : _a2.name) || "",
      previous: null,
      isAnimating: false,
      progress: 0,
      duration: 0
    });
  }, [controls, steps, updateState]);
  const jumpTo = useCallback(
    async (stepName) => {
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
    isLastStep: currentStepIndex === steps.length - 1
  };
}

// src/useVariants.ts
import { useMotionValue as useMotionValue2 } from "framer-motion";
import { useCallback as useCallback2, useRef as useRef2, useState as useState2 } from "react";
function useVariants(variants, options = {}) {
  const {
    initial = Object.keys(variants)[0] || "",
    maxHistory = 10,
    onVariantChange,
    onTransitionStart,
    onTransitionComplete
  } = options;
  const [variantState, setVariantState] = useState2({
    current: initial,
    previous: null,
    isTransitioning: false,
    history: [initial]
  });
  const transitionProgress = useMotionValue2(0);
  const isTransitioning = useRef2(false);
  const updateHistory = useCallback2(
    (variant, history) => {
      const newHistory = [variant, ...history.filter((v) => v !== variant)];
      return newHistory.slice(0, maxHistory);
    },
    [maxHistory]
  );
  const setVariant = useCallback2(
    async (variantName) => {
      if (!variants[variantName] || variantName === variantState.current || isTransitioning.current) {
        return false;
      }
      const previousVariant = variantState.current;
      isTransitioning.current = true;
      setVariantState((prev) => __spreadProps(__spreadValues({}, prev), {
        previous: prev.current,
        current: variantName,
        isTransitioning: true,
        history: updateHistory(variantName, prev.history)
      }));
      onTransitionStart == null ? void 0 : onTransitionStart(previousVariant, variantName);
      onVariantChange == null ? void 0 : onVariantChange(variantName, previousVariant);
      transitionProgress.set(0);
      return new Promise((resolve) => {
        const duration = 300;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          transitionProgress.set(progress);
          if (progress >= 1) {
            isTransitioning.current = false;
            setVariantState((prev) => __spreadProps(__spreadValues({}, prev), { isTransitioning: false }));
            onTransitionComplete == null ? void 0 : onTransitionComplete(variantName);
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
      transitionProgress
    ]
  );
  const toggle = useCallback2(
    async (variantA, variantB) => {
      const target = variantState.current === variantA ? variantB : variantA;
      return await setVariant(target);
    },
    [variantState.current, setVariant]
  );
  const cycle = useCallback2(
    async (variantNames) => {
      const currentIndex = variantNames.indexOf(variantState.current);
      const nextIndex = (currentIndex + 1) % variantNames.length;
      return await setVariant(variantNames[nextIndex]);
    },
    [variantState.current, setVariant]
  );
  const revert = useCallback2(async () => {
    if (variantState.previous) {
      return await setVariant(variantState.previous);
    }
    return false;
  }, [variantState.previous, setVariant]);
  const goToHistory = useCallback2(
    async (index) => {
      const targetVariant = variantState.history[index];
      if (targetVariant && targetVariant !== variantState.current) {
        return await setVariant(targetVariant);
      }
      return false;
    },
    [variantState.history, variantState.current, setVariant]
  );
  const reset = useCallback2(async () => {
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
    hasVariant: (name) => name in variants,
    isCurrentVariant: (name) => name === variantState.current,
    canRevert: !!variantState.previous
  };
}

// src/useAnimationLifecycle.ts
import { useCallback as useCallback3, useEffect as useEffect2, useRef as useRef3, useState as useState3 } from "react";
function useAnimationLifecycle(timing = {}, events = {}) {
  const {
    duration = 1e3,
    delay = 0,
    ease = "easeInOut",
    repeat = 0,
    repeatType = "loop",
    repeatDelay = 0
  } = timing;
  const { onStart, onUpdate, onComplete, onRepeat, onReverse, onCancel } = events;
  const [lifecycleState, setLifecycleState] = useState3({
    phase: "idle",
    progress: 0,
    duration,
    elapsed: 0,
    remaining: duration,
    repeatCount: 0,
    isReversed: false
  });
  const animationRef = useRef3(void 0);
  const startTimeRef = useRef3(void 0);
  const pausedTimeRef = useRef3(0);
  const updateState = useCallback3((updates) => {
    setLifecycleState((prev) => __spreadValues(__spreadValues({}, prev), updates));
  }, []);
  const easeFunction = useCallback3(
    (t) => {
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
        return t;
      }
      return t;
    },
    [ease]
  );
  const animate = useCallback3(
    (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        updateState({ phase: "running" });
        onStart == null ? void 0 : onStart();
      }
      const elapsed = timestamp - startTimeRef.current - pausedTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFunction(rawProgress);
      const remaining = Math.max(duration - elapsed, 0);
      updateState({
        progress: easedProgress,
        elapsed,
        remaining
      });
      onUpdate == null ? void 0 : onUpdate(easedProgress);
      if (rawProgress >= 1) {
        if (lifecycleState.repeatCount < repeat) {
          const newCount = lifecycleState.repeatCount + 1;
          updateState({ repeatCount: newCount });
          onRepeat == null ? void 0 : onRepeat(newCount);
          if (repeatType === "reverse") {
            updateState({ isReversed: !lifecycleState.isReversed });
            onReverse == null ? void 0 : onReverse();
          }
          startTimeRef.current = void 0;
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
          onComplete == null ? void 0 : onComplete();
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
      updateState
    ]
  );
  const start = useCallback3(() => {
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
  const pause = useCallback3(() => {
    if (lifecycleState.phase !== "running") return;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    pausedTimeRef.current += Date.now() - (startTimeRef.current || Date.now());
    updateState({ phase: "paused" });
  }, [lifecycleState.phase, updateState]);
  const resume = useCallback3(() => {
    if (lifecycleState.phase !== "paused") return;
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);
    updateState({ phase: "running" });
  }, [lifecycleState.phase, animate, updateState]);
  const cancel = useCallback3(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    startTimeRef.current = void 0;
    pausedTimeRef.current = 0;
    updateState({
      phase: "cancelled",
      progress: 0,
      elapsed: 0,
      remaining: duration,
      repeatCount: 0,
      isReversed: false
    });
    onCancel == null ? void 0 : onCancel();
  }, [duration, onCancel, updateState]);
  const reset = useCallback3(() => {
    cancel();
    updateState({ phase: "idle" });
  }, [cancel, updateState]);
  useEffect2(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  return __spreadProps(__spreadValues({}, lifecycleState), {
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
    canResume: lifecycleState.phase === "paused"
  });
}
export {
  useAnimationLifecycle,
  useAnimationSequence,
  useVariants
};
