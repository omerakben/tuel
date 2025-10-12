/**
 * Animation tokens for TUEL components
 * @package @tuel/tokens
 */

export const animations = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1000,
  },
  easing: {
    // CSS cubic-bezier strings for CSS animations
    css: {
      linear: "linear",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
      easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
      easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
      easeInOutExpo: "cubic-bezier(1, 0, 0, 1)",
    },
    // Framer Motion compatible bezier arrays
    motion: {
      linear: "linear",
      easeIn: [0.4, 0, 1, 1],
      easeOut: [0, 0, 0.2, 1],
      easeInOut: [0.4, 0, 0.2, 1],
      easeInQuad: [0.55, 0.085, 0.68, 0.53],
      easeOutQuad: [0.25, 0.46, 0.45, 0.94],
      easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
      easeInExpo: [0.95, 0.05, 0.795, 0.035],
      easeOutExpo: [0.19, 1, 0.22, 1],
      easeInOutExpo: [1, 0, 0, 1],
    },
  },
  spring: {
    gentle: { type: "spring", stiffness: 100, damping: 15 },
    wobbly: { type: "spring", stiffness: 180, damping: 12 },
    stiff: { type: "spring", stiffness: 300, damping: 20 },
    slow: { type: "spring", stiffness: 40, damping: 20 },
  },
} as const;

/**
 * Responsive breakpoint values in pixels
 * @package @tuel/tokens
 */
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Z-index layering scale for UI components
 * @package @tuel/tokens
 */
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
} as const;

// Type exports for strict typing

/** Animation duration value in milliseconds */
export type AnimationDuration = typeof animations.duration[keyof typeof animations.duration];

/** Animation duration key */
export type AnimationDurationKey = keyof typeof animations.duration;

/** CSS easing function string (cubic-bezier) */
export type CSSEasing = typeof animations.easing.css[keyof typeof animations.easing.css];

/** CSS easing function key */
export type CSSEasingKey = keyof typeof animations.easing.css;

/** Framer Motion easing value (array or string) */
export type MotionEasing = typeof animations.easing.motion[keyof typeof animations.easing.motion];

/** Framer Motion easing key */
export type MotionEasingKey = keyof typeof animations.easing.motion;

/** Spring animation configuration */
export type SpringConfig = typeof animations.spring[keyof typeof animations.spring];

/** Spring animation preset key */
export type SpringKey = keyof typeof animations.spring;

/** Breakpoint value in pixels */
export type Breakpoint = typeof breakpoints[keyof typeof breakpoints];

/** Breakpoint key */
export type BreakpointKey = keyof typeof breakpoints;

/** Z-index layer value */
export type ZIndex = typeof zIndex[keyof typeof zIndex];

/** Z-index layer key */
export type ZIndexKey = keyof typeof zIndex;
