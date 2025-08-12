export * from 'motion';

declare const createMotionVariants: {
    fadeIn: {
        hidden: {
            opacity: number;
        };
        visible: {
            opacity: number;
        };
    };
    slideUp: {
        hidden: {
            y: number;
            opacity: number;
        };
        visible: {
            y: number;
            opacity: number;
        };
    };
    slideDown: {
        hidden: {
            y: number;
            opacity: number;
        };
        visible: {
            y: number;
            opacity: number;
        };
    };
    scaleIn: {
        hidden: {
            scale: number;
            opacity: number;
        };
        visible: {
            scale: number;
            opacity: number;
        };
    };
};

export { createMotionVariants };
