import * as react_jsx_runtime from 'react/jsx-runtime';
import { ElementType } from 'react';

interface AnimatedTextProps {
    children: string;
    className?: string;
    variant?: "fade" | "slide" | "typewriter" | "scramble" | "split" | "explode" | "wave";
    splitType?: "chars" | "words" | "lines";
    staggerDelay?: number;
    duration?: number;
    triggerOnScroll?: boolean;
    delay?: number;
    as?: ElementType;
}
declare function AnimatedText({ children, className, variant, splitType, staggerDelay, duration, triggerOnScroll, delay, as: Component, }: AnimatedTextProps): react_jsx_runtime.JSX.Element;

interface NavigateScrollAnimatedTextProps {
    paragraphs: string[];
    keywords?: string[];
    className?: string;
    wordHighlightBgColor?: string;
    pinHeight?: number;
    overlapWords?: number;
    reverseOverlapWords?: number;
    onProgress?: (progress: number) => void;
}
declare function NavigateScrollAnimatedText({ paragraphs, keywords, className, wordHighlightBgColor, pinHeight, overlapWords, reverseOverlapWords, onProgress, }: NavigateScrollAnimatedTextProps): react_jsx_runtime.JSX.Element;

interface ParticleTextProps {
    text: string;
    className?: string;
    font?: string;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    particleSize?: number;
    particleGap?: number;
    mouseRadius?: number;
    mouseForce?: number;
    returnSpeed?: number;
    friction?: number;
    ease?: number;
    hover?: boolean;
    explode?: boolean;
    wave?: boolean;
    waveSpeed?: number;
    waveAmplitude?: number;
    interactive?: boolean;
    density?: number;
}
declare function ParticleText({ text, className, font, fontSize, color, backgroundColor, particleSize, particleGap, mouseRadius, mouseForce, returnSpeed, friction, ease, hover, explode, wave, waveSpeed, waveAmplitude, interactive, density, }: ParticleTextProps): react_jsx_runtime.JSX.Element;

export { AnimatedText, type AnimatedTextProps, NavigateScrollAnimatedText, type NavigateScrollAnimatedTextProps, ParticleText, type ParticleTextProps };
