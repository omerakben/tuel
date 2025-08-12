declare const animations: {
    readonly duration: {
        readonly instant: 0;
        readonly fast: 200;
        readonly normal: 300;
        readonly slow: 500;
        readonly slower: 800;
        readonly slowest: 1000;
    };
    readonly easing: {
        readonly css: {
            readonly linear: "linear";
            readonly easeIn: "cubic-bezier(0.4, 0, 1, 1)";
            readonly easeOut: "cubic-bezier(0, 0, 0.2, 1)";
            readonly easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)";
            readonly easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            readonly easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)";
            readonly easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)";
            readonly easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)";
            readonly easeInOutExpo: "cubic-bezier(1, 0, 0, 1)";
        };
        readonly motion: {
            readonly linear: "linear";
            readonly easeIn: readonly [0.4, 0, 1, 1];
            readonly easeOut: readonly [0, 0, 0.2, 1];
            readonly easeInOut: readonly [0.4, 0, 0.2, 1];
            readonly easeInQuad: readonly [0.55, 0.085, 0.68, 0.53];
            readonly easeOutQuad: readonly [0.25, 0.46, 0.45, 0.94];
            readonly easeInOutQuad: readonly [0.455, 0.03, 0.515, 0.955];
            readonly easeInExpo: readonly [0.95, 0.05, 0.795, 0.035];
            readonly easeOutExpo: readonly [0.19, 1, 0.22, 1];
            readonly easeInOutExpo: readonly [1, 0, 0, 1];
        };
    };
    readonly spring: {
        readonly gentle: {
            readonly type: "spring";
            readonly stiffness: 100;
            readonly damping: 15;
        };
        readonly wobbly: {
            readonly type: "spring";
            readonly stiffness: 180;
            readonly damping: 12;
        };
        readonly stiff: {
            readonly type: "spring";
            readonly stiffness: 300;
            readonly damping: 20;
        };
        readonly slow: {
            readonly type: "spring";
            readonly stiffness: 40;
            readonly damping: 20;
        };
    };
};
declare const breakpoints: {
    readonly xs: 375;
    readonly sm: 640;
    readonly md: 768;
    readonly lg: 1024;
    readonly xl: 1280;
    readonly "2xl": 1536;
};
declare const zIndex: {
    readonly base: 0;
    readonly dropdown: 10;
    readonly sticky: 20;
    readonly overlay: 30;
    readonly modal: 40;
    readonly popover: 50;
    readonly tooltip: 60;
    readonly toast: 70;
};

export { animations, breakpoints, zIndex };
