import React from 'react';

interface AnimationPreset {
    name: string;
    description?: string;
    duration: number;
    ease: string | number[];
    delay?: number;
    variants?: Record<string, any>;
    options?: Record<string, any>;
}
interface AnimationPresets {
    fadeIn: AnimationPreset;
    slideInUp: AnimationPreset;
    slideInDown: AnimationPreset;
    slideInLeft: AnimationPreset;
    slideInRight: AnimationPreset;
    scaleIn: AnimationPreset;
    rotateIn: AnimationPreset;
    bounceIn: AnimationPreset;
    fadeOut: AnimationPreset;
    slideOutUp: AnimationPreset;
    slideOutDown: AnimationPreset;
    slideOutLeft: AnimationPreset;
    slideOutRight: AnimationPreset;
    scaleOut: AnimationPreset;
    rotateOut: AnimationPreset;
    bounceOut: AnimationPreset;
    pulse: AnimationPreset;
    shake: AnimationPreset;
    wobble: AnimationPreset;
    flash: AnimationPreset;
    lift: AnimationPreset;
    grow: AnimationPreset;
    shrink: AnimationPreset;
    tilt: AnimationPreset;
}
/**
 * Comprehensive animation presets based on Motion.dev patterns
 */
declare const animationPresets: AnimationPresets;

interface TuelConfig {
    globalDuration: number;
    globalEase: string | number[];
    reducedMotion: boolean;
    enableFrameControl: boolean;
    targetFPS: number;
    enableOptimizations: boolean;
    theme: "light" | "dark" | "auto";
    colorScheme: Record<string, string>;
    enableDebug: boolean;
    showPerformanceMetrics: boolean;
    logAnimations: boolean;
    custom: Record<string, any>;
}
interface TuelConfigContextValue {
    config: TuelConfig;
    updateConfig: (updates: Partial<TuelConfig>) => void;
    resetConfig: () => void;
    getConfigValue: <K extends keyof TuelConfig>(key: K) => TuelConfig[K];
    setConfigValue: <K extends keyof TuelConfig>(key: K, value: TuelConfig[K]) => void;
}
interface TuelConfigProviderProps {
    children: React.ReactNode;
    initialConfig?: Partial<TuelConfig>;
    persistConfig?: boolean;
    storageKey?: string;
}
/**
 * Configuration provider for TUEL animation system
 */
declare function TuelConfigProvider({ children, initialConfig, persistConfig, storageKey, }: TuelConfigProviderProps): React.FunctionComponentElement<React.ProviderProps<TuelConfigContextValue | undefined>>;
/**
 * Hook to access TUEL configuration
 */
declare function useTuelConfig(): TuelConfigContextValue;

interface ThemeConfig {
    name: string;
    colors: Record<string, string>;
    animations: {
        duration: Record<string, number>;
        easing: Record<string, string | number[]>;
        timing: Record<string, number>;
    };
    spacing: Record<string, number>;
    borderRadius: Record<string, number>;
    shadows: Record<string, string>;
}
interface ThemeVariant {
    light: ThemeConfig;
    dark: ThemeConfig;
}
/**
 * Default theme configurations
 */
declare const defaultThemes: Record<string, ThemeVariant>;
/**
 * Hook to get current theme configuration
 */
declare function useTheme(themeName?: keyof typeof defaultThemes, colorScheme?: "light" | "dark"): ThemeConfig;
/**
 * Hook to get theme-aware animation values
 */
declare function useThemeAnimation(theme: ThemeConfig): {
    duration: (key?: keyof typeof theme.animations.duration) => number;
    easing: (key?: keyof typeof theme.animations.easing) => string | number[];
    timing: (key?: keyof typeof theme.animations.timing) => number;
    color: (key: keyof typeof theme.colors) => string;
    spacing: (key: keyof typeof theme.spacing) => number;
    radius: (key: keyof typeof theme.borderRadius) => number;
    shadow: (key: keyof typeof theme.shadows) => string;
};
/**
 * Create a custom theme configuration
 */
declare function createTheme(baseTheme: keyof typeof defaultThemes, customizations: {
    light?: Partial<ThemeConfig>;
    dark?: Partial<ThemeConfig>;
}): ThemeVariant;

export { type AnimationPreset, type AnimationPresets, type ThemeConfig, type ThemeVariant, type TuelConfig, type TuelConfigContextValue, TuelConfigProvider, type TuelConfigProviderProps, animationPresets, createTheme, defaultThemes, useTheme, useThemeAnimation, useTuelConfig };
