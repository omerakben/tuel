import * as React from 'react';
import React__default from 'react';
import { MotionValue } from 'framer-motion';

interface MouseTrackingOptions {
    /** Enable smooth interpolation between mouse positions */
    smooth?: boolean;
    /** Smoothing factor (0-1, higher = smoother but more lag) */
    smoothFactor?: number;
    /** Threshold distance for movement detection */
    threshold?: number;
    /** Enable velocity tracking */
    trackVelocity?: boolean;
}
interface MousePosition {
    x: number;
    y: number;
}
interface MouseTracking {
    /** Current mouse position */
    position: MousePosition;
    /** Previous mouse position */
    previousPosition: MousePosition;
    /** Interpolated/smooth position */
    smoothPosition: MousePosition;
    /** Mouse velocity */
    velocity: MousePosition;
    /** Distance moved since last frame */
    distance: number;
    /** Whether mouse is moving */
    isMoving: boolean;
}
/**
 * Advanced mouse tracking hook with smooth interpolation and velocity
 * Based on Motion.dev patterns for high-performance cursor interactions
 */
declare function useMouseTracking(options?: MouseTrackingOptions): MouseTracking;

interface TrailImageOptions {
    /** Images to use in the trail */
    images: string[];
    /** Lifespan of each trail image in milliseconds */
    imageLifespan?: number;
    /** Mouse movement threshold to trigger new trail image */
    mouseThreshold?: number;
    /** Animation duration for image entrance */
    inDuration?: number;
    /** Animation duration for image exit */
    outDuration?: number;
    /** Stagger delay for entrance animation */
    staggerIn?: number;
    /** Stagger delay for exit animation */
    staggerOut?: number;
    /** Slide animation duration */
    slideDuration?: number;
    /** Custom easing function */
    easing?: string;
    /** Number of mask layers for reveal effect */
    maskLayers?: number;
}
interface TrailImageComponent {
    element: HTMLDivElement;
    removeTime: number;
    maskLayers: HTMLDivElement[];
    imageLayers: HTMLDivElement[];
}
/**
 * Advanced image trail effect component
 * Creates trailing images that follow mouse movement with sophisticated animations
 * Based on the TrailContainer pattern from CodeGrid projects
 */
declare function useImageTrail(options: TrailImageOptions): {
    containerRef: React.RefObject<HTMLDivElement>;
    startAnimation: () => void;
    stopAnimation: () => void;
    trailCount: number;
};

interface CursorFollowerOptions {
    damping?: number;
    stiffness?: number;
    mass?: number;
    trackVelocity?: boolean;
    idleSize?: number;
    hoverSize?: number;
    color?: string;
    borderWidth?: number;
    borderColor?: string;
    blendMode?: string;
    zIndex?: number;
}
interface CursorState {
    x: MotionValue<number>;
    y: MotionValue<number>;
    scale: MotionValue<number>;
    opacity: MotionValue<number>;
    isHovering: boolean;
    velocity: {
        x: number;
        y: number;
    };
}
declare function useCursorFollower(options?: CursorFollowerOptions): CursorState;
interface CursorFollowerProps extends CursorFollowerOptions {
    children?: React__default.ReactNode;
    className?: string;
    style?: React__default.CSSProperties;
}
declare const CursorFollower: React__default.FC<CursorFollowerProps>;

export { CursorFollower, type CursorFollowerOptions, type CursorFollowerProps, type CursorState, type MouseTracking, type MouseTrackingOptions, type TrailImageComponent, type TrailImageOptions, useCursorFollower, useImageTrail, useMouseTracking };
