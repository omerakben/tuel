import { describe, it, expect } from "vitest";
import { animations, breakpoints, zIndex } from "../index";

/**
 * These are example usage tests demonstrating how to use @tuel/tokens
 * in real-world scenarios with various animation libraries and frameworks.
 */
describe("@tuel/tokens - Usage Examples", () => {
  describe("CSS Animations Examples", () => {
    it("should create CSS transition with duration and easing", () => {
      const transition = `opacity ${animations.duration.normal}ms ${animations.easing.css.easeOut}`;
      expect(transition).toBe("opacity 300ms cubic-bezier(0, 0, 0.2, 1)");
    });

    it("should create multi-property CSS transition", () => {
      const transition = `all ${animations.duration.fast}ms ${animations.easing.css.easeInOut}`;
      expect(transition).toBe("all 200ms cubic-bezier(0.4, 0, 0.2, 1)");
    });

    it("should create CSS animation with linear timing", () => {
      const animation = `spin ${animations.duration.slowest}ms ${animations.easing.css.linear} infinite`;
      expect(animation).toBe("spin 1000ms linear infinite");
    });

    it("should create hover transition styles", () => {
      const styles = {
        transition: `transform ${animations.duration.fast}ms ${animations.easing.css.easeOut}`,
        "&:hover": {
          transform: "scale(1.05)",
        },
      };
      expect(styles.transition).toBe("transform 200ms cubic-bezier(0, 0, 0.2, 1)");
    });
  });

  describe("Framer Motion Examples", () => {
    it("should create Framer Motion transition config", () => {
      const transition = {
        duration: animations.duration.normal / 1000, // Convert to seconds
        ease: animations.easing.motion.easeOut,
      };
      expect(transition.duration).toBe(0.3);
      expect(transition.ease).toEqual([0, 0, 0.2, 1]);
    });

    it("should create fade-in animation config", () => {
      const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: {
          duration: animations.duration.normal / 1000,
          ease: animations.easing.motion.easeOut,
        },
      };
      expect(fadeIn.transition.duration).toBe(0.3);
      expect(fadeIn.initial.opacity).toBe(0);
      expect(fadeIn.animate.opacity).toBe(1);
    });

    it("should create slide-in animation config", () => {
      const slideIn = {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: {
          duration: animations.duration.slow / 1000,
          ease: animations.easing.motion.easeInOut,
        },
      };
      expect(slideIn.transition.duration).toBe(0.5);
      expect(slideIn.initial.x).toBe(-100);
      expect(slideIn.animate.x).toBe(0);
    });

    it("should create spring animation config", () => {
      const springConfig = {
        initial: { scale: 0.8 },
        animate: { scale: 1 },
        transition: animations.spring.gentle,
      };
      expect(springConfig.transition.type).toBe("spring");
      expect(springConfig.transition.stiffness).toBe(100);
      expect(springConfig.transition.damping).toBe(15);
    });

    it("should create wobbly button animation", () => {
      const buttonAnimation = {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: animations.spring.wobbly,
      };
      expect(buttonAnimation.transition.stiffness).toBe(180);
      expect(buttonAnimation.transition.damping).toBe(12);
    });

    it("should create staggered children animation", () => {
      const staggerConfig = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: animations.duration.normal / 1000,
          ease: animations.easing.motion.easeOut,
          staggerChildren: 0.1,
        },
      };
      expect(staggerConfig.transition.staggerChildren).toBe(0.1);
    });
  });

  describe("GSAP Examples", () => {
    it("should create GSAP tween config", () => {
      const tweenConfig = {
        duration: animations.duration.normal / 1000,
        ease: animations.easing.css.easeOut,
        opacity: 1,
      };
      expect(tweenConfig.duration).toBe(0.3);
      expect(tweenConfig.ease).toBe("cubic-bezier(0, 0, 0.2, 1)");
    });

    it("should create GSAP timeline with delays", () => {
      const timelineConfig = {
        defaults: {
          duration: animations.duration.fast / 1000,
          ease: animations.easing.css.easeInOut,
        },
      };
      expect(timelineConfig.defaults.duration).toBe(0.2);
    });

    it("should create GSAP scroll trigger config", () => {
      const scrollConfig = {
        scrub: true,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
      };
      expect(scrollConfig.scrub).toBe(true);
    });
  });

  describe("Responsive Design Examples", () => {
    it("should create mobile-first media query", () => {
      const mobileQuery = `(max-width: ${breakpoints.sm}px)`;
      expect(mobileQuery).toBe("(max-width: 640px)");
    });

    it("should create tablet media query", () => {
      const tabletQuery = `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`;
      expect(tabletQuery).toBe("(min-width: 768px) and (max-width: 1023px)");
    });

    it("should create desktop media query", () => {
      const desktopQuery = `(min-width: ${breakpoints.lg}px)`;
      expect(desktopQuery).toBe("(min-width: 1024px)");
    });

    it("should create responsive helper functions", () => {
      const isMobile = (width: number) => width < breakpoints.md;
      const isTablet = (width: number) => width >= breakpoints.md && width < breakpoints.lg;
      const isDesktop = (width: number) => width >= breakpoints.lg;

      expect(isMobile(320)).toBe(true);
      expect(isMobile(800)).toBe(false);
      expect(isTablet(800)).toBe(true);
      expect(isTablet(1280)).toBe(false);
      expect(isDesktop(1280)).toBe(true);
    });

    it("should create responsive container widths", () => {
      const containerWidths = {
        mobile: breakpoints.sm,
        tablet: breakpoints.md,
        desktop: breakpoints.lg,
        wide: breakpoints.xl,
      };
      expect(containerWidths.mobile).toBe(640);
      expect(containerWidths.desktop).toBe(1024);
    });
  });

  describe("Z-Index Management Examples", () => {
    it("should create modal overlay stack", () => {
      const modalStyles = {
        overlay: {
          position: "fixed" as const,
          inset: 0,
          zIndex: zIndex.overlay,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          position: "fixed" as const,
          zIndex: zIndex.modal,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      };
      expect(modalStyles.overlay.zIndex).toBe(30);
      expect(modalStyles.content.zIndex).toBe(40);
      expect(modalStyles.content.zIndex).toBeGreaterThan(modalStyles.overlay.zIndex);
    });

    it("should create dropdown menu z-index", () => {
      const dropdownStyle = {
        position: "absolute" as const,
        zIndex: zIndex.dropdown,
        top: "100%",
        left: 0,
      };
      expect(dropdownStyle.zIndex).toBe(10);
    });

    it("should create sticky header z-index", () => {
      const headerStyle = {
        position: "sticky" as const,
        top: 0,
        zIndex: zIndex.sticky,
      };
      expect(headerStyle.zIndex).toBe(20);
    });

    it("should create tooltip z-index", () => {
      const tooltipStyle = {
        position: "absolute" as const,
        zIndex: zIndex.tooltip,
      };
      expect(tooltipStyle.zIndex).toBe(60);
      expect(tooltipStyle.zIndex).toBeGreaterThan(zIndex.modal);
    });

    it("should create toast notification z-index", () => {
      const toastStyle = {
        position: "fixed" as const,
        zIndex: zIndex.toast,
        top: 20,
        right: 20,
      };
      expect(toastStyle.zIndex).toBe(70);
      expect(toastStyle.zIndex).toBeGreaterThan(zIndex.tooltip);
    });

    it("should verify z-index hierarchy", () => {
      const hierarchy = [
        zIndex.base,
        zIndex.dropdown,
        zIndex.sticky,
        zIndex.overlay,
        zIndex.modal,
        zIndex.popover,
        zIndex.tooltip,
        zIndex.toast,
      ];

      for (let i = 1; i < hierarchy.length; i++) {
        expect(hierarchy[i]).toBeGreaterThan(hierarchy[i - 1]);
      }
    });
  });

  describe("Complex Integration Examples", () => {
    it("should create animated modal with all tokens", () => {
      const animatedModal = {
        overlay: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: {
            duration: animations.duration.fast / 1000,
            ease: animations.easing.motion.easeOut,
          },
          style: {
            position: "fixed" as const,
            inset: 0,
            zIndex: zIndex.overlay,
          },
        },
        content: {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 },
          transition: animations.spring.gentle,
          style: {
            position: "fixed" as const,
            zIndex: zIndex.modal,
          },
        },
      };

      expect(animatedModal.overlay.style.zIndex).toBe(30);
      expect(animatedModal.content.style.zIndex).toBe(40);
      expect(animatedModal.content.transition.stiffness).toBe(100);
    });

    it("should create responsive animated card", () => {
      const responsiveCard = {
        animation: {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: animations.duration.normal / 1000,
            ease: animations.easing.motion.easeOut,
          },
        },
        hover: {
          scale: 1.02,
          transition: animations.spring.wobbly,
        },
        responsive: {
          mobile: `(max-width: ${breakpoints.md - 1}px)`,
          desktop: `(min-width: ${breakpoints.md}px)`,
        },
      };

      expect(responsiveCard.animation.transition.duration).toBe(0.3);
      expect(responsiveCard.hover.transition.stiffness).toBe(180);
      expect(responsiveCard.responsive.mobile).toBe("(max-width: 767px)");
    });

    it("should create navigation with sticky header and dropdown", () => {
      const navigation = {
        header: {
          position: "sticky" as const,
          top: 0,
          zIndex: zIndex.sticky,
          transition: `all ${animations.duration.fast}ms ${animations.easing.css.easeOut}`,
        },
        dropdown: {
          position: "absolute" as const,
          zIndex: zIndex.dropdown,
          animation: {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: {
              duration: animations.duration.fast / 1000,
              ease: animations.easing.motion.easeOut,
            },
          },
        },
      };

      expect(navigation.header.zIndex).toBe(20);
      expect(navigation.dropdown.zIndex).toBe(10);
      expect(navigation.header.transition).toBe("all 200ms cubic-bezier(0, 0, 0.2, 1)");
    });

    it("should create multi-step animation sequence", () => {
      const sequence = [
        {
          step: 1,
          duration: animations.duration.fast / 1000,
          ease: animations.easing.motion.easeOut,
        },
        {
          step: 2,
          duration: animations.duration.normal / 1000,
          ease: animations.easing.motion.easeInOut,
        },
        {
          step: 3,
          duration: animations.duration.slow / 1000,
          ease: animations.easing.motion.easeIn,
        },
      ];

      expect(sequence[0].duration).toBe(0.2);
      expect(sequence[1].duration).toBe(0.3);
      expect(sequence[2].duration).toBe(0.5);
      expect(sequence.reduce((sum, s) => sum + s.duration, 0)).toBe(1.0);
    });
  });

  describe("Best Practices Examples", () => {
    it("should use tokens instead of hard-coded values", () => {
      // ❌ Bad
      const badStyle = {
        transition: "all 300ms cubic-bezier(0, 0, 0.2, 1)",
      };

      // ✅ Good
      const goodStyle = {
        transition: `all ${animations.duration.normal}ms ${animations.easing.css.easeOut}`,
      };

      expect(goodStyle.transition).toBe(badStyle.transition);
    });

    it("should use appropriate easing for context", () => {
      // Entering viewport - use easeOut
      const entering = {
        ease: animations.easing.motion.easeOut,
        description: "Fast start, slow end - natural entrance",
      };

      // Leaving viewport - use easeIn
      const leaving = {
        ease: animations.easing.motion.easeIn,
        description: "Slow start, fast end - natural exit",
      };

      expect(entering.ease).toEqual([0, 0, 0.2, 1]);
      expect(leaving.ease).toEqual([0.4, 0, 1, 1]);
    });

    it("should match animation duration to complexity", () => {
      // Simple state change
      const simple = {
        duration: animations.duration.fast,
        use: "hover effects, toggles",
      };

      // Complex transition
      const complex = {
        duration: animations.duration.slow,
        use: "page transitions, large animations",
      };

      expect(simple.duration).toBe(200);
      expect(complex.duration).toBe(500);
      expect(complex.duration).toBeGreaterThan(simple.duration);
    });

    it("should use semantic z-index layers", () => {
      // ❌ Bad
      const badZIndex = 9999;

      // ✅ Good
      const goodZIndex = zIndex.tooltip;

      expect(goodZIndex).toBe(60);
      expect(goodZIndex).toBeLessThan(badZIndex);
      expect(goodZIndex).toBeGreaterThan(zIndex.modal);
    });
  });
});
