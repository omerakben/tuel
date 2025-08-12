"use client";

export interface AnimationPreset {
  name: string;
  description?: string;
  duration: number;
  ease: string | number[];
  delay?: number;
  variants?: Record<string, any>;
  options?: Record<string, any>;
}

export interface AnimationPresets {
  // Entrance animations
  fadeIn: AnimationPreset;
  slideInUp: AnimationPreset;
  slideInDown: AnimationPreset;
  slideInLeft: AnimationPreset;
  slideInRight: AnimationPreset;
  scaleIn: AnimationPreset;
  rotateIn: AnimationPreset;
  bounceIn: AnimationPreset;

  // Exit animations
  fadeOut: AnimationPreset;
  slideOutUp: AnimationPreset;
  slideOutDown: AnimationPreset;
  slideOutLeft: AnimationPreset;
  slideOutRight: AnimationPreset;
  scaleOut: AnimationPreset;
  rotateOut: AnimationPreset;
  bounceOut: AnimationPreset;

  // Attention animations
  pulse: AnimationPreset;
  shake: AnimationPreset;
  wobble: AnimationPreset;
  flash: AnimationPreset;

  // Hover animations
  lift: AnimationPreset;
  grow: AnimationPreset;
  shrink: AnimationPreset;
  tilt: AnimationPreset;
}

/**
 * Comprehensive animation presets based on Motion.dev patterns
 */
export const animationPresets: AnimationPresets = {
  // Entrance animations
  fadeIn: {
    name: "fadeIn",
    description: "Gentle fade in animation",
    duration: 600,
    ease: "easeOut",
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },

  slideInUp: {
    name: "slideInUp",
    description: "Slide in from bottom",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
    },
  },

  slideInDown: {
    name: "slideInDown",
    description: "Slide in from top",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 },
    },
  },

  slideInLeft: {
    name: "slideInLeft",
    description: "Slide in from left",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 },
    },
  },

  slideInRight: {
    name: "slideInRight",
    description: "Slide in from right",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 },
    },
  },

  scaleIn: {
    name: "scaleIn",
    description: "Scale in animation",
    duration: 400,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    },
  },

  rotateIn: {
    name: "rotateIn",
    description: "Rotate in animation",
    duration: 600,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { rotate: -180, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: 180, opacity: 0 },
    },
  },

  bounceIn: {
    name: "bounceIn",
    description: "Bounce in animation",
    duration: 1000,
    ease: [0.68, -0.55, 0.265, 1.55],
    variants: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    },
  },

  // Exit animations
  fadeOut: {
    name: "fadeOut",
    description: "Gentle fade out animation",
    duration: 400,
    ease: "easeIn",
    variants: {
      initial: { opacity: 1 },
      animate: { opacity: 0 },
    },
  },

  slideOutUp: {
    name: "slideOutUp",
    description: "Slide out to top",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -50, opacity: 0 },
    },
  },

  slideOutDown: {
    name: "slideOutDown",
    description: "Slide out to bottom",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { y: 0, opacity: 1 },
      animate: { y: 50, opacity: 0 },
    },
  },

  slideOutLeft: {
    name: "slideOutLeft",
    description: "Slide out to left",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -50, opacity: 0 },
    },
  },

  slideOutRight: {
    name: "slideOutRight",
    description: "Slide out to right",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { x: 0, opacity: 1 },
      animate: { x: 50, opacity: 0 },
    },
  },

  scaleOut: {
    name: "scaleOut",
    description: "Scale out animation",
    duration: 300,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0.8, opacity: 0 },
    },
  },

  rotateOut: {
    name: "rotateOut",
    description: "Rotate out animation",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { rotate: 0, opacity: 1 },
      animate: { rotate: 180, opacity: 0 },
    },
  },

  bounceOut: {
    name: "bounceOut",
    description: "Bounce out animation",
    duration: 600,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0 },
    },
  },

  // Attention animations
  pulse: {
    name: "pulse",
    description: "Pulsing animation",
    duration: 1000,
    ease: "easeInOut",
    variants: {
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  },

  shake: {
    name: "shake",
    description: "Shaking animation",
    duration: 600,
    ease: "easeInOut",
    variants: {
      animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
  },

  wobble: {
    name: "wobble",
    description: "Wobbling animation",
    duration: 1000,
    ease: "easeInOut",
    variants: {
      animate: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
          duration: 1,
          ease: "easeInOut",
        },
      },
    },
  },

  flash: {
    name: "flash",
    description: "Flashing animation",
    duration: 1000,
    ease: "easeInOut",
    variants: {
      animate: {
        opacity: [1, 0, 1, 0, 1],
        transition: {
          duration: 1,
          ease: "easeInOut",
        },
      },
    },
  },

  // Hover animations
  lift: {
    name: "lift",
    description: "Lift up on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" },
      },
    },
  },

  grow: {
    name: "grow",
    description: "Grow on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" },
      },
    },
  },

  shrink: {
    name: "shrink",
    description: "Shrink on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeOut" },
      },
    },
  },

  tilt: {
    name: "tilt",
    description: "Tilt on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        rotate: 2,
        transition: { duration: 0.2, ease: "easeOut" },
      },
    },
  },
};

/**
 * Get a specific animation preset
 */
export function getPreset(name: keyof AnimationPresets): AnimationPreset {
  return animationPresets[name];
}

/**
 * Get multiple presets by category
 */
export function getPresetsByCategory(
  category: "entrance" | "exit" | "attention" | "hover"
): AnimationPreset[] {
  const categoryMap = {
    entrance: [
      "fadeIn",
      "slideInUp",
      "slideInDown",
      "slideInLeft",
      "slideInRight",
      "scaleIn",
      "rotateIn",
      "bounceIn",
    ],
    exit: [
      "fadeOut",
      "slideOutUp",
      "slideOutDown",
      "slideOutLeft",
      "slideOutRight",
      "scaleOut",
      "rotateOut",
      "bounceOut",
    ],
    attention: ["pulse", "shake", "wobble", "flash"],
    hover: ["lift", "grow", "shrink", "tilt"],
  };

  return categoryMap[category].map(
    (name) => animationPresets[name as keyof AnimationPresets]
  );
}

/**
 * Create a custom preset with modifications
 */
export function createCustomPreset(
  basePreset: keyof AnimationPresets,
  modifications: Partial<AnimationPreset>
): AnimationPreset {
  const base = animationPresets[basePreset];
  return {
    ...base,
    ...modifications,
    variants: {
      ...base.variants,
      ...modifications.variants,
    },
  };
}
