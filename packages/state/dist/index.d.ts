import * as framer_motion from 'framer-motion';

interface AnimationState {
    current: string;
    previous: string | null;
    isAnimating: boolean;
    progress: number;
    duration: number;
}
interface AnimationSequenceStep {
    name: string;
    duration?: number;
    delay?: number;
    ease?: string;
    onStart?: () => void;
    onComplete?: () => void;
    variants?: Record<string, any>;
}
interface AnimationSequenceOptions {
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
declare function useAnimationSequence(steps: AnimationSequenceStep[], options?: AnimationSequenceOptions): {
    currentStep: AnimationSequenceStep;
    currentStepIndex: number;
    animationState: AnimationState;
    isRunning: boolean;
    progress: framer_motion.MotionValue<number>;
    controls: framer_motion.LegacyAnimationControls;
    play: () => Promise<void>;
    pause: () => void;
    reset: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    goToStep: (index: number) => Promise<void>;
    jumpTo: (stepName: string) => Promise<void>;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
};

type AnimationVariant = Record<string, any>;
interface VariantDefinition {
    [key: string]: AnimationVariant | VariantDefinition;
}
interface VariantState {
    current: string;
    previous: string | null;
    isTransitioning: boolean;
    history: string[];
}
interface VariantOptions {
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
declare function useVariants(variants: VariantDefinition, options?: VariantOptions): {
    current: string;
    previous: string | null;
    isTransitioning: boolean;
    history: string[];
    transitionProgress: framer_motion.MotionValue<number>;
    currentVariant: AnimationVariant | VariantDefinition;
    availableVariants: string[];
    setVariant: (variantName: string) => Promise<boolean>;
    toggle: (variantA: string, variantB: string) => Promise<boolean>;
    cycle: (variantNames: string[]) => Promise<boolean>;
    revert: () => Promise<boolean>;
    goToHistory: (index: number) => Promise<boolean>;
    reset: () => Promise<boolean>;
    hasVariant: (name: string) => boolean;
    isCurrentVariant: (name: string) => boolean;
    canRevert: boolean;
};

interface TimingOptions {
    duration?: number;
    delay?: number;
    ease?: string | number[];
    repeat?: number;
    repeatType?: "loop" | "reverse" | "mirror";
    repeatDelay?: number;
}
interface AnimationLifecycleEvents {
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
    onRepeat?: (repeatCount: number) => void;
    onReverse?: () => void;
    onCancel?: () => void;
}
interface LifecycleState {
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
declare function useAnimationLifecycle(timing?: TimingOptions, events?: AnimationLifecycleEvents): {
    start: () => void;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
    reset: () => void;
    isActive: boolean;
    isPaused: boolean;
    isComplete: boolean;
    isCancelled: boolean;
    canStart: boolean;
    canPause: boolean;
    canResume: boolean;
    phase: "idle" | "starting" | "running" | "paused" | "completed" | "cancelled";
    progress: number;
    duration: number;
    elapsed: number;
    remaining: number;
    repeatCount: number;
    isReversed: boolean;
};

export { type AnimationLifecycleEvents, type AnimationSequenceOptions, type AnimationSequenceStep, type AnimationState, type AnimationVariant, type LifecycleState, type TimingOptions, type VariantDefinition, type VariantOptions, type VariantState, useAnimationLifecycle, useAnimationSequence, useVariants };
