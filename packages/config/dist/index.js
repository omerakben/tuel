"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  TuelConfigProvider: () => TuelConfigProvider,
  animationPresets: () => animationPresets,
  createTheme: () => createTheme,
  defaultThemes: () => defaultThemes,
  useTheme: () => useTheme,
  useThemeAnimation: () => useThemeAnimation,
  useTuelConfig: () => useTuelConfig
});
module.exports = __toCommonJS(index_exports);

// src/animationPresets.ts
var animationPresets = {
  // Entrance animations
  fadeIn: {
    name: "fadeIn",
    description: "Gentle fade in animation",
    duration: 600,
    ease: "easeOut",
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    }
  },
  slideInUp: {
    name: "slideInUp",
    description: "Slide in from bottom",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 }
    }
  },
  slideInDown: {
    name: "slideInDown",
    description: "Slide in from top",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 }
    }
  },
  slideInLeft: {
    name: "slideInLeft",
    description: "Slide in from left",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 }
    }
  },
  slideInRight: {
    name: "slideInRight",
    description: "Slide in from right",
    duration: 500,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 }
    }
  },
  scaleIn: {
    name: "scaleIn",
    description: "Scale in animation",
    duration: 400,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    }
  },
  rotateIn: {
    name: "rotateIn",
    description: "Rotate in animation",
    duration: 600,
    ease: [0.25, 0.46, 0.45, 0.94],
    variants: {
      initial: { rotate: -180, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: 180, opacity: 0 }
    }
  },
  bounceIn: {
    name: "bounceIn",
    description: "Bounce in animation",
    duration: 1e3,
    ease: [0.68, -0.55, 0.265, 1.55],
    variants: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 }
    }
  },
  // Exit animations
  fadeOut: {
    name: "fadeOut",
    description: "Gentle fade out animation",
    duration: 400,
    ease: "easeIn",
    variants: {
      initial: { opacity: 1 },
      animate: { opacity: 0 }
    }
  },
  slideOutUp: {
    name: "slideOutUp",
    description: "Slide out to top",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { y: 0, opacity: 1 },
      animate: { y: -50, opacity: 0 }
    }
  },
  slideOutDown: {
    name: "slideOutDown",
    description: "Slide out to bottom",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { y: 0, opacity: 1 },
      animate: { y: 50, opacity: 0 }
    }
  },
  slideOutLeft: {
    name: "slideOutLeft",
    description: "Slide out to left",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { x: 0, opacity: 1 },
      animate: { x: -50, opacity: 0 }
    }
  },
  slideOutRight: {
    name: "slideOutRight",
    description: "Slide out to right",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { x: 0, opacity: 1 },
      animate: { x: 50, opacity: 0 }
    }
  },
  scaleOut: {
    name: "scaleOut",
    description: "Scale out animation",
    duration: 300,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0.8, opacity: 0 }
    }
  },
  rotateOut: {
    name: "rotateOut",
    description: "Rotate out animation",
    duration: 400,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { rotate: 0, opacity: 1 },
      animate: { rotate: 180, opacity: 0 }
    }
  },
  bounceOut: {
    name: "bounceOut",
    description: "Bounce out animation",
    duration: 600,
    ease: [0.55, 0.055, 0.675, 0.19],
    variants: {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 0, opacity: 0 }
    }
  },
  // Attention animations
  pulse: {
    name: "pulse",
    description: "Pulsing animation",
    duration: 1e3,
    ease: "easeInOut",
    variants: {
      animate: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
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
          ease: "easeInOut"
        }
      }
    }
  },
  wobble: {
    name: "wobble",
    description: "Wobbling animation",
    duration: 1e3,
    ease: "easeInOut",
    variants: {
      animate: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
          duration: 1,
          ease: "easeInOut"
        }
      }
    }
  },
  flash: {
    name: "flash",
    description: "Flashing animation",
    duration: 1e3,
    ease: "easeInOut",
    variants: {
      animate: {
        opacity: [1, 0, 1, 0, 1],
        transition: {
          duration: 1,
          ease: "easeInOut"
        }
      }
    }
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
        transition: { duration: 0.2, ease: "easeOut" }
      }
    }
  },
  grow: {
    name: "grow",
    description: "Grow on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
      }
    }
  },
  shrink: {
    name: "shrink",
    description: "Shrink on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeOut" }
      }
    }
  },
  tilt: {
    name: "tilt",
    description: "Tilt on hover",
    duration: 200,
    ease: "easeOut",
    variants: {
      hover: {
        rotate: 2,
        transition: { duration: 0.2, ease: "easeOut" }
      }
    }
  }
};

// src/configProvider.ts
var import_react = __toESM(require("react"));
var defaultConfig = {
  globalDuration: 300,
  globalEase: "easeInOut",
  reducedMotion: false,
  enableFrameControl: true,
  targetFPS: 60,
  enableOptimizations: true,
  theme: "auto",
  colorScheme: {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#8b5cf6",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b"
  },
  enableDebug: false,
  showPerformanceMetrics: false,
  logAnimations: false,
  custom: {}
};
var TuelConfigContext = (0, import_react.createContext)(
  void 0
);
function TuelConfigProvider({
  children,
  initialConfig = {},
  persistConfig = true,
  storageKey = "tuel-config"
}) {
  const [config, setConfig] = (0, import_react.useState)(() => {
    const merged = __spreadValues(__spreadValues({}, defaultConfig), initialConfig);
    if (persistConfig && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedConfig = JSON.parse(stored);
          return __spreadValues(__spreadValues({}, merged), parsedConfig);
        }
      } catch (error) {
        console.warn("Failed to load TUEL config from localStorage:", error);
      }
    }
    return merged;
  });
  const updateConfig = (0, import_react.useCallback)(
    (updates) => {
      setConfig((prevConfig) => {
        const newConfig = __spreadValues(__spreadValues({}, prevConfig), updates);
        if (persistConfig && typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, JSON.stringify(newConfig));
          } catch (error) {
            console.warn("Failed to save TUEL config to localStorage:", error);
          }
        }
        return newConfig;
      });
    },
    [persistConfig, storageKey]
  );
  const resetConfig = (0, import_react.useCallback)(() => {
    const merged = __spreadValues(__spreadValues({}, defaultConfig), initialConfig);
    setConfig(merged);
    if (persistConfig && typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn("Failed to clear TUEL config from localStorage:", error);
      }
    }
  }, [initialConfig, persistConfig, storageKey]);
  const getConfigValue = (0, import_react.useCallback)(
    (key) => {
      return config[key];
    },
    [config]
  );
  const setConfigValue = (0, import_react.useCallback)(
    (key, value) => {
      updateConfig({ [key]: value });
    },
    [updateConfig]
  );
  (0, import_react.useEffect)(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = (event) => {
      updateConfig({ reducedMotion: event.matches });
    };
    if (mediaQuery.matches !== config.reducedMotion) {
      updateConfig({ reducedMotion: mediaQuery.matches });
    }
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, [config.reducedMotion, updateConfig]);
  (0, import_react.useEffect)(() => {
    if (typeof window === "undefined" || config.theme !== "auto") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      const isDark = mediaQuery.matches;
      updateConfig({
        colorScheme: __spreadProps(__spreadValues({}, config.colorScheme), {
          background: isDark ? "#0f172a" : "#ffffff",
          surface: isDark ? "#1e293b" : "#f8fafc",
          text: isDark ? "#f1f5f9" : "#1e293b"
        })
      });
    };
    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [config.theme, config.colorScheme, updateConfig]);
  const contextValue = {
    config,
    updateConfig,
    resetConfig,
    getConfigValue,
    setConfigValue
  };
  return import_react.default.createElement(
    TuelConfigContext.Provider,
    { value: contextValue },
    children
  );
}
function useTuelConfig() {
  const context = (0, import_react.useContext)(TuelConfigContext);
  if (!context) {
    throw new Error("useTuelConfig must be used within a TuelConfigProvider");
  }
  return context;
}

// src/themeConfig.ts
var import_react2 = require("react");
var defaultThemes = {
  modern: {
    light: {
      name: "Modern Light",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#8b5cf6",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444"
      },
      animations: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 750
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.25, 0.46, 0.45, 0.94],
          bounce: [0.68, -0.55, 0.265, 1.55]
        },
        timing: {
          stagger: 50,
          delay: 100
        }
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 48,
        "3xl": 64
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
      }
    },
    dark: {
      name: "Modern Dark",
      colors: {
        primary: "#60a5fa",
        secondary: "#94a3b8",
        accent: "#a78bfa",
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        border: "#334155",
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171"
      },
      animations: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500,
          slower: 750
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.25, 0.46, 0.45, 0.94],
          bounce: [0.68, -0.55, 0.265, 1.55]
        },
        timing: {
          stagger: 50,
          delay: 100
        }
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        "2xl": 48,
        "3xl": 64
      },
      borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.25)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.3)"
      }
    }
  },
  minimal: {
    light: {
      name: "Minimal Light",
      colors: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#333333",
        background: "#ffffff",
        surface: "#fafafa",
        text: "#000000",
        textSecondary: "#666666",
        border: "#e0e0e0",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336"
      },
      animations: {
        duration: {
          fast: 100,
          normal: 200,
          slow: 300,
          slower: 400
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.4, 0, 0.2, 1],
          bounce: [0.25, 0.46, 0.45, 0.94]
        },
        timing: {
          stagger: 25,
          delay: 50
        }
      },
      spacing: {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        "2xl": 32,
        "3xl": 48
      },
      borderRadius: {
        none: 0,
        sm: 2,
        md: 4,
        lg: 6,
        xl: 8,
        full: 9999
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 2px 4px 0 rgb(0 0 0 / 0.1)",
        lg: "0 4px 8px 0 rgb(0 0 0 / 0.1)",
        xl: "0 8px 16px 0 rgb(0 0 0 / 0.1)"
      }
    },
    dark: {
      name: "Minimal Dark",
      colors: {
        primary: "#ffffff",
        secondary: "#999999",
        accent: "#cccccc",
        background: "#000000",
        surface: "#111111",
        text: "#ffffff",
        textSecondary: "#999999",
        border: "#333333",
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336"
      },
      animations: {
        duration: {
          fast: 100,
          normal: 200,
          slow: 300,
          slower: 400
        },
        easing: {
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          spring: [0.4, 0, 0.2, 1],
          bounce: [0.25, 0.46, 0.45, 0.94]
        },
        timing: {
          stagger: 25,
          delay: 50
        }
      },
      spacing: {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        "2xl": 32,
        "3xl": 48
      },
      borderRadius: {
        none: 0,
        sm: 2,
        md: 4,
        lg: 6,
        xl: 8,
        full: 9999
      },
      shadows: {
        sm: "0 1px 2px 0 rgb(255 255 255 / 0.05)",
        md: "0 2px 4px 0 rgb(255 255 255 / 0.1)",
        lg: "0 4px 8px 0 rgb(255 255 255 / 0.1)",
        xl: "0 8px 16px 0 rgb(255 255 255 / 0.1)"
      }
    }
  }
};
function useTheme(themeName = "modern", colorScheme = "light") {
  return (0, import_react2.useMemo)(() => {
    const theme = defaultThemes[themeName];
    if (!theme) {
      console.warn(`Theme "${themeName}" not found, falling back to "modern"`);
      return defaultThemes.modern[colorScheme];
    }
    return theme[colorScheme];
  }, [themeName, colorScheme]);
}
function useThemeAnimation(theme) {
  return (0, import_react2.useMemo)(() => {
    return {
      duration: (key = "normal") => theme.animations.duration[key],
      easing: (key = "easeInOut") => theme.animations.easing[key],
      timing: (key = "delay") => theme.animations.timing[key],
      color: (key) => theme.colors[key],
      spacing: (key) => theme.spacing[key],
      radius: (key) => theme.borderRadius[key],
      shadow: (key) => theme.shadows[key]
    };
  }, [theme]);
}
function createTheme(baseTheme, customizations) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const base = defaultThemes[baseTheme];
  return {
    light: __spreadProps(__spreadValues(__spreadValues({}, base.light), customizations.light), {
      colors: __spreadValues(__spreadValues({}, base.light.colors), (_a = customizations.light) == null ? void 0 : _a.colors),
      animations: __spreadProps(__spreadValues(__spreadValues({}, base.light.animations), (_b = customizations.light) == null ? void 0 : _b.animations), {
        duration: __spreadValues(__spreadValues({}, base.light.animations.duration), (_d = (_c = customizations.light) == null ? void 0 : _c.animations) == null ? void 0 : _d.duration),
        easing: __spreadValues(__spreadValues({}, base.light.animations.easing), (_f = (_e = customizations.light) == null ? void 0 : _e.animations) == null ? void 0 : _f.easing)
      })
    }),
    dark: __spreadProps(__spreadValues(__spreadValues({}, base.dark), customizations.dark), {
      colors: __spreadValues(__spreadValues({}, base.dark.colors), (_g = customizations.dark) == null ? void 0 : _g.colors),
      animations: __spreadProps(__spreadValues(__spreadValues({}, base.dark.animations), (_h = customizations.dark) == null ? void 0 : _h.animations), {
        duration: __spreadValues(__spreadValues({}, base.dark.animations.duration), (_j = (_i = customizations.dark) == null ? void 0 : _i.animations) == null ? void 0 : _j.duration),
        easing: __spreadValues(__spreadValues({}, base.dark.animations.easing), (_l = (_k = customizations.dark) == null ? void 0 : _k.animations) == null ? void 0 : _l.easing)
      })
    })
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TuelConfigProvider,
  animationPresets,
  createTheme,
  defaultThemes,
  useTheme,
  useThemeAnimation,
  useTuelConfig
});
