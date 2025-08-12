import React$1 from 'react';

interface ReducedMotionOptions {
    /** Force reduced motion regardless of system preference */
    forceReduced?: boolean;
    /** Callback when reduced motion preference changes */
    onPreferenceChange?: (reducedMotion: boolean) => void;
    /** Fallback value when media query is not supported */
    fallback?: boolean;
}
interface ReducedMotionState {
    reducedMotion: boolean;
    isSupported: boolean;
    preference: "reduce" | "no-preference" | "unknown";
}
/**
 * Hook to detect and respond to reduced motion preferences
 * Provides accessibility-first animation controls based on user preferences
 */
declare function useReducedMotion(options?: ReducedMotionOptions): ReducedMotionState;
/**
 * Hook to get safe animation duration based on reduced motion preference
 */
declare function useSafeDuration(duration: number, reducedDuration?: number): number;
/**
 * Hook to get safe animation values based on reduced motion preference
 */
declare function useSafeAnimation<T>(normalValue: T, reducedValue: T): T;
/**
 * Higher-order function to create reduced motion aware animations
 */
declare function withReducedMotion<T extends Record<string, any>>(normalAnimation: T, reducedAnimation: Partial<T>): (reducedMotion: boolean) => T;
/**
 * Utility to check if reduced motion is preferred (synchronous)
 */
declare function isReducedMotionPreferred(): boolean;
/**
 * Component wrapper that respects reduced motion preferences
 */
interface ReducedMotionWrapperProps {
    children: React$1.ReactNode;
    fallback?: React$1.ReactNode;
    className?: string;
}
declare function ReducedMotionWrapper({ children, fallback, className, }: ReducedMotionWrapperProps): React$1.DetailedReactHTMLElement<{
    className: string | undefined;
}, HTMLElement>;

interface FrameControlOptions {
    /** Target FPS (frames per second) */
    targetFPS?: number;
    /** Enable adaptive FPS based on performance */
    adaptive?: boolean;
    /** Minimum FPS when adaptive */
    minFPS?: number;
    /** Maximum FPS when adaptive */
    maxFPS?: number;
    /** Callback when FPS changes */
    onFPSChange?: (fps: number) => void;
}
interface FrameStats {
    currentFPS: number;
    averageFPS: number;
    frameTime: number;
    dropped: number;
    total: number;
}
/**
 * Advanced frame control and monitoring hook
 * Provides precise animation frame timing and performance monitoring
 */
declare function useFrameControl(options?: FrameControlOptions): {
    stats: FrameStats;
    start: () => void;
    stop: () => void;
    reset: () => void;
    addCallback: (callback: (deltaTime: number) => void) => () => void;
    setTargetFPS: (fps: number) => void;
    isRunning: boolean;
};
/**
 * Hook for throttled animation frames
 */
declare function useThrottledFrame(callback: (deltaTime: number) => void, fps?: number): {
    start: () => void;
    stop: () => void;
    isRunning: boolean;
};

interface PerformanceMetrics {
    renderTime: number;
    memoryUsage: number;
    frameRate: number;
    timestamp: number;
}
interface OptimizationOptions {
    /** Enable memory monitoring */
    trackMemory?: boolean;
    /** Enable render time tracking */
    trackRenderTime?: boolean;
    /** Enable frame rate monitoring */
    trackFrameRate?: boolean;
    /** Sample rate for metrics collection (0-1) */
    sampleRate?: number;
    /** Maximum number of metrics to store */
    maxSamples?: number;
}
/**
 * Performance monitoring and optimization utilities
 */
declare function usePerformanceMonitor(options?: OptimizationOptions): {
    startRenderTracking: () => void;
    endRenderTracking: () => PerformanceMetrics | undefined;
    getAverageMetrics: () => {
        renderTime: number;
        memoryUsage: number;
        frameRate: number;
        sampleCount: number;
    } | null;
    getLatestMetrics: () => PerformanceMetrics;
    clearMetrics: () => void;
    metrics: PerformanceMetrics[];
    getMemoryUsage: () => number;
};
/**
 * Memoization helper with performance tracking
 */
declare function useOptimizedMemo<T>(factory: () => T, deps: React.DependencyList, debugLabel?: string): T;
/**
 * Debounced callback with performance optimization
 */
declare function useOptimizedCallback<T extends (...args: any[]) => any>(callback: T, delay?: number, deps?: React.DependencyList): T;
/**
 * Intersection observer with performance optimization
 */
declare function useOptimizedIntersection(threshold?: number, rootMargin?: string): {
    observe: (element: Element, callback: (isIntersecting: boolean) => void) => () => void;
    disconnect: () => void;
};

export { type FrameControlOptions, type FrameStats, type OptimizationOptions, type PerformanceMetrics, type ReducedMotionOptions, type ReducedMotionState, ReducedMotionWrapper, type ReducedMotionWrapperProps, isReducedMotionPreferred, useFrameControl, useOptimizedCallback, useOptimizedIntersection, useOptimizedMemo, usePerformanceMonitor, useReducedMotion, useSafeAnimation, useSafeDuration, useThrottledFrame, withReducedMotion };
