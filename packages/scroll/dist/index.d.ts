import * as react_jsx_runtime from 'react/jsx-runtime';
import React$1, { ReactNode } from 'react';

interface WodniackWorkScrollProps {
    /** Array of letters to animate */
    letters?: string[];
    /** Array of image URLs for the card textures */
    images?: string[];
    /** Intro text */
    introText?: string;
    /** Outro text */
    outroText?: string;
    /** Primary color for animations */
    primaryColor?: string;
    /** Background color */
    backgroundColor?: string;
    /** Grid dot size */
    dotSize?: number;
    /** Grid spacing */
    gridSpacing?: number;
    /** Number of letter instances per character */
    letterInstanceCount?: number;
    /** Line speed multipliers for letter animations */
    lineSpeedMultipliers?: number[];
    /** Animation lerp factor */
    lerpFactor?: number;
    /** Enable smooth scrolling with Lenis */
    enableSmoothScroll?: boolean;
    /** Custom className for the container */
    className?: string;
    /** Lenis options for smooth scrolling */
    lenisOptions?: {
        lerp?: number;
        smoothWheel?: boolean;
        duration?: number;
    };
}
declare function WodniackWorkScroll({ letters, images, introText, outroText, primaryColor, backgroundColor, dotSize, gridSpacing, letterInstanceCount, lineSpeedMultipliers, lerpFactor, enableSmoothScroll, className, lenisOptions, }: WodniackWorkScrollProps): react_jsx_runtime.JSX.Element;

interface HorizontalScrollProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    speed?: number;
    scrub?: boolean | number;
    pin?: boolean;
    snap?: boolean | number | "labels" | "labelsDirectional";
    direction?: "left" | "right";
    triggerElement?: string;
    start?: string;
    end?: string;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
}
declare function HorizontalScroll({ children, className, containerClassName, speed, scrub, pin, snap, direction, triggerElement, start, end, onUpdate, onComplete, }: HorizontalScrollProps): react_jsx_runtime.JSX.Element;
interface HorizontalScrollItemProps {
    children: ReactNode;
    className?: string;
    width?: string | number;
}
declare function HorizontalScrollItem({ children, className, width, }: HorizontalScrollItemProps): react_jsx_runtime.JSX.Element;

interface OrchestraCubesProps {
    className?: string;
    header1?: string;
    header2?: string;
    subtitle?: string;
    images?: string[];
    stickyHeight?: number;
    backgroundColor?: string;
    textColor?: string;
}
declare function OrchestraCubes({ className, header1, header2, subtitle, images, stickyHeight, backgroundColor, textColor, }: OrchestraCubesProps): react_jsx_runtime.JSX.Element;

interface OrkenWorldScrollProps {
    className?: string;
}
declare function OrkenWorldScroll({ className }: OrkenWorldScrollProps): react_jsx_runtime.JSX.Element;

interface ParallaxScrollProps {
    children: ReactNode;
    className?: string;
    speed?: number;
    offset?: [string, string];
    direction?: "vertical" | "horizontal";
    fadeIn?: boolean;
    scaleOnScroll?: boolean;
    rotateOnScroll?: boolean;
}
declare function ParallaxScroll({ children, className, speed, offset, direction, fadeIn, scaleOnScroll, rotateOnScroll, }: ParallaxScrollProps): react_jsx_runtime.JSX.Element;
interface ParallaxLayerProps {
    children: ReactNode;
    speed: number;
    className?: string;
    offset?: [string, string] | number;
    direction?: "vertical" | "horizontal";
    fadeIn?: boolean;
    scaleOnScroll?: boolean;
    rotateOnScroll?: boolean;
}
declare function ParallaxLayer({ children, speed, className, offset, direction, fadeIn, scaleOnScroll, rotateOnScroll, }: ParallaxLayerProps): react_jsx_runtime.JSX.Element;
interface ParallaxContainerProps {
    children: ReactNode;
    className?: string;
}
declare function ParallaxContainer({ children, className, }: ParallaxContainerProps): react_jsx_runtime.JSX.Element;

interface RadgaHorizontalScrollSlide {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
}
interface RadgaHorizontalScrollProps {
    slides: RadgaHorizontalScrollSlide[];
    stickyHeight?: number;
    backgroundColor?: string;
    outroTitle?: string;
    outroBackgroundColor?: string;
    className?: string;
    style?: React$1.CSSProperties;
}
declare function RadgaHorizontalScroll({ slides, stickyHeight, backgroundColor, outroTitle, outroBackgroundColor, className, style, }: RadgaHorizontalScrollProps): react_jsx_runtime.JSX.Element;

interface ScrollFrameAnimationProps {
    frameCount: number;
    framePath: (index: number) => string;
    className?: string;
    scrollSpeed?: number;
    pinContainer?: boolean;
    startTrigger?: string;
    endTrigger?: string;
    onProgress?: (progress: number) => void;
    children?: ReactNode;
    fallback?: ReactNode;
    preloadFrames?: boolean;
}
declare function ScrollFrameAnimation({ frameCount, framePath, className, scrollSpeed, pinContainer, startTrigger, endTrigger, onProgress, children, fallback, preloadFrames, }: ScrollFrameAnimationProps): react_jsx_runtime.JSX.Element;

interface ScrollMinimapProps {
    images: string[];
    activeOpacity?: number;
    lerpFactor?: number;
    clickLerpFactor?: number;
    breakpoint?: number;
    className?: string;
    onImageChange?: (index: number) => void;
}
declare function ScrollMinimap({ images, activeOpacity, lerpFactor, clickLerpFactor, breakpoint, className, onImageChange, }: ScrollMinimapProps): react_jsx_runtime.JSX.Element;

interface SofiHealthScrollProps {
    modelUrl: string;
    className?: string;
    headerTexts?: {
        header1: string;
        header2: string;
    };
    tooltips?: Array<{
        icon: string;
        title: string;
        description: string;
        trigger: number;
    }>;
    animationDuration?: number;
    staggerDelay?: number;
    pinHeight?: number;
    modelSettings?: {
        metalness?: number;
        roughness?: number;
        cameraDistance?: {
            mobile: number;
            desktop: number;
        };
        rotation?: {
            desktop: number;
        };
        position?: {
            mobile: [number, number, number];
            desktop: [number, number, number];
        };
    };
}
declare function SofiHealthScroll({ modelUrl, className, headerTexts, tooltips, animationDuration, staggerDelay, pinHeight, modelSettings, }: SofiHealthScrollProps): react_jsx_runtime.JSX.Element;

interface TheFirstTheLastScrollProps {
    cards: Array<{
        id: string;
        content: React.ReactNode;
        rotation?: number;
    }>;
    className?: string;
    pinHeight?: number;
    distanceMultiplier?: number;
    exitDistance?: {
        x: number;
        y: number;
    };
}
declare function TheFirstTheLastScroll({ cards, className, pinHeight, distanceMultiplier, exitDistance, }: TheFirstTheLastScrollProps): react_jsx_runtime.JSX.Element;

export { HorizontalScroll, HorizontalScrollItem, type HorizontalScrollItemProps, type HorizontalScrollProps, OrchestraCubes, type OrchestraCubesProps, OrkenWorldScroll, type OrkenWorldScrollProps, ParallaxContainer, type ParallaxContainerProps, ParallaxLayer, type ParallaxLayerProps, ParallaxScroll, type ParallaxScrollProps, RadgaHorizontalScroll, type RadgaHorizontalScrollProps, type RadgaHorizontalScrollSlide, ScrollFrameAnimation, type ScrollFrameAnimationProps, ScrollMinimap, type ScrollMinimapProps, SofiHealthScroll, type SofiHealthScrollProps, TheFirstTheLastScroll, type TheFirstTheLastScrollProps, WodniackWorkScroll, type WodniackWorkScrollProps };
