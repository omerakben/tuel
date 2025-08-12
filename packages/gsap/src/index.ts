// Re-export commonly used GSAP modules with proper typing
export { gsap } from "gsap";
export { MotionPathPlugin } from "gsap/MotionPathPlugin";
export { ScrollTrigger } from "gsap/ScrollTrigger";
export { SplitText } from "gsap/SplitText";
export { TextPlugin } from "gsap/TextPlugin";

// Helper functions for common GSAP operations
export const registerGSAPPlugins = () => {
  if (typeof window !== "undefined") {
    const {
      gsap,
      ScrollTrigger,
      MotionPathPlugin,
      TextPlugin,
    } = require("gsap/all");
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);
  }
};

export const createTimeline = (options?: gsap.TimelineVars) => {
  const { gsap } = require("gsap");
  return gsap.timeline(options);
};
