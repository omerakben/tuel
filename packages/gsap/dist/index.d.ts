export { gsap } from 'gsap';
export { MotionPathPlugin } from 'gsap/MotionPathPlugin';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
export { SplitText } from 'gsap/SplitText';
export { TextPlugin } from 'gsap/TextPlugin';

declare const registerGSAPPlugins: () => void;
declare const createTimeline: (options?: gsap.TimelineVars) => any;

export { createTimeline, registerGSAPPlugins };
