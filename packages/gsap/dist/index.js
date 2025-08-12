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
  MotionPathPlugin: () => import_MotionPathPlugin.MotionPathPlugin,
  ScrollTrigger: () => import_ScrollTrigger.ScrollTrigger,
  SplitText: () => import_SplitText.SplitText,
  TextPlugin: () => import_TextPlugin.TextPlugin,
  createTimeline: () => createTimeline,
  gsap: () => import_gsap.gsap,
  registerGSAPPlugins: () => registerGSAPPlugins
});
module.exports = __toCommonJS(index_exports);
var import_gsap = require("gsap");
var import_MotionPathPlugin = require("gsap/MotionPathPlugin");
var import_ScrollTrigger = require("gsap/ScrollTrigger");
var import_SplitText = require("gsap/SplitText");
var import_TextPlugin = require("gsap/TextPlugin");
var registerGSAPPlugins = () => {
  if (typeof window !== "undefined") {
    const {
      gsap: gsap2,
      ScrollTrigger: ScrollTrigger2,
      MotionPathPlugin: MotionPathPlugin2,
      TextPlugin: TextPlugin2
    } = require("gsap/all");
    gsap2.registerPlugin(ScrollTrigger2, MotionPathPlugin2, TextPlugin2);
  }
};
var createTimeline = (options) => {
  const { gsap: gsap2 } = require("gsap");
  return gsap2.timeline(options);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MotionPathPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
  createTimeline,
  gsap,
  registerGSAPPlugins
});
