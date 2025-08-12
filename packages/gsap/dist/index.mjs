var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
var registerGSAPPlugins = () => {
  if (typeof window !== "undefined") {
    const {
      gsap: gsap2,
      ScrollTrigger: ScrollTrigger2,
      MotionPathPlugin: MotionPathPlugin2,
      TextPlugin: TextPlugin2
    } = __require("gsap/all");
    gsap2.registerPlugin(ScrollTrigger2, MotionPathPlugin2, TextPlugin2);
  }
};
var createTimeline = (options) => {
  const { gsap: gsap2 } = __require("gsap");
  return gsap2.timeline(options);
};
export {
  MotionPathPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
  createTimeline,
  gsap,
  registerGSAPPlugins
};
