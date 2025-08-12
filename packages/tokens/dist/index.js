"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  animations: () => animations,
  breakpoints: () => breakpoints,
  zIndex: () => zIndex
});
module.exports = __toCommonJS(index_exports);
var animations = {
  duration: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1e3
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
      easeInOutExpo: "cubic-bezier(1, 0, 0, 1)"
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
      easeInOutExpo: [1, 0, 0, 1]
    }
  },
  spring: {
    gentle: { type: "spring", stiffness: 100, damping: 15 },
    wobbly: { type: "spring", stiffness: 180, damping: 12 },
    stiff: { type: "spring", stiffness: 300, damping: 20 },
    slow: { type: "spring", stiffness: 40, damping: 20 }
  }
};
var breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
var zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  animations,
  breakpoints,
  zIndex
});
