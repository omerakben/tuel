export {
  ReducedMotionWrapper,
  isReducedMotionPreferred,
  useReducedMotion,
  useSafeAnimation,
  useSafeDuration,
  withReducedMotion,
} from "./useReducedMotion";
export type {
  ReducedMotionOptions,
  ReducedMotionState,
  ReducedMotionWrapperProps,
} from "./useReducedMotion";

export { useFrameControl, useThrottledFrame } from "./useFrameControl";
export type { FrameControlOptions, FrameStats } from "./useFrameControl";

export {
  useOptimizedCallback,
  useOptimizedIntersection,
  useOptimizedMemo,
  usePerformanceMonitor,
} from "./useOptimization";
export type {
  OptimizationOptions,
  PerformanceMetrics,
} from "./useOptimization";
