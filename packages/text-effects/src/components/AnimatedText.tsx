"use client";

import {
  cn,
  validateDuration,
  validateStaggerDelay,
  validateDelay,
  validateString,
  validateBoolean,
  validateAnimationVariant,
  validateSplitType,
  TuelErrorBoundary,
  useAccessibilityPreferences,
  useAccessibleAnimation,
  useRenderPerformance,
  useAnimationPerformance,
} from "@tuel/utils";
import { motion, useInView, Variants } from "framer-motion";
import gsap from "gsap";
import { ElementType, useEffect, useRef } from "react";

export interface AnimatedTextProps {
  children: string;
  className?: string;
  variant?:
    | "fade"
    | "slide"
    | "typewriter"
    | "scramble"
    | "split"
    | "explode"
    | "wave";
  splitType?: "chars" | "words" | "lines";
  staggerDelay?: number;
  duration?: number;
  triggerOnScroll?: boolean;
  delay?: number;
  as?: ElementType;
}

export function AnimatedText({
  children,
  className,
  variant = "fade",
  splitType = "chars",
  staggerDelay = 0.03,
  duration = 0.5,
  triggerOnScroll = true,
  delay = 0,
  as: Component = "div",
}: AnimatedTextProps) {
  // Accessibility preferences
  const accessibilityPrefs = useAccessibilityPreferences();

  // Performance monitoring
  const { startRender, endRender } = useRenderPerformance("AnimatedText");
  const { startAnimation, recordFrame, endAnimation } =
    useAnimationPerformance(variant);

  // Validate all inputs with safe defaults
  const validChildren = validateString(children, "", {
    maxLength: 10000,
  }).value;
  const validVariant = validateAnimationVariant(
    variant,
    [
      "fade",
      "slide",
      "typewriter",
      "scramble",
      "split",
      "explode",
      "wave",
    ] as const,
    "fade"
  ).value;
  const validSplitType = validateSplitType(splitType, "chars").value;
  const validStaggerDelay = validateStaggerDelay(staggerDelay, 0.03).value;
  const validDuration = validateDuration(duration * 1000, 500).value / 1000; // Convert back to seconds
  const validTriggerOnScroll = validateBoolean(triggerOnScroll, true).value;
  const validDelay = validateDelay(delay * 1000, 0).value / 1000; // Convert back to seconds;

  // Accessibility-aware animation
  const { getAnimationConfig } = useAccessibleAnimation(
    {
      duration: validDuration,
      delay: validDelay,
    },
    accessibilityPrefs
  );

  const animationConfig = getAnimationConfig();

  const textRef = useRef<HTMLElement>(null);
  const splitRef = useRef<gsap.core.Timeline | null>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.5 });

  // Framer Motion variants
  const getVariants = (): Variants => {
    switch (validVariant) {
      case "slide":
        return {
          hidden: {
            opacity: 0,
            y: 50,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: animationConfig.duration,
              delay: animationConfig.delay,
              staggerChildren: validStaggerDelay,
            },
          },
        };
      case "typewriter":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.05,
              delay: animationConfig.delay,
              staggerChildren: 0.05,
            },
          },
        };
      case "wave":
        return {
          hidden: {
            opacity: 0,
            y: 100,
            rotateZ: -10,
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateZ: 0,
            transition: {
              duration: animationConfig.duration,
              delay: animationConfig.delay,
              staggerChildren: validStaggerDelay,
              ease: [0.6, 0.01, -0.05, 0.95],
            },
          },
        };
      default: // fade
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: animationConfig.duration,
              delay: animationConfig.delay,
              staggerChildren: validStaggerDelay,
            },
          },
        };
    }
  };

  // GSAP animations for more complex effects
  useEffect(() => {
    if (typeof window === "undefined" || !textRef.current) return;

    if (
      validVariant === "split" ||
      validVariant === "explode" ||
      validVariant === "scramble"
    ) {
      // Create manual split for GSAP animations using React-safe methods
      const text = validChildren;
      const element = textRef.current;

      // Clear existing content safely
      element.textContent = "";

      if (validSplitType === "chars") {
        // Create spans safely using DOM methods
        text.split("").forEach((char) => {
          const span = document.createElement("span");
          span.className = "split-char";
          span.textContent = char === " " ? "\u00A0" : char;
          element.appendChild(span);
        });
      } else if (validSplitType === "words") {
        text.split(/\s+/).forEach((word) => {
          const span = document.createElement("span");
          span.className = "split-word";
          span.textContent = word;
          element.appendChild(span);
          // Add space between words
          if (word !== text.split(/\s+/).slice(-1)[0]) {
            element.appendChild(document.createTextNode(" "));
          }
        });
      } else if (validSplitType === "lines") {
        // For lines, we'll treat each word as a potential line break
        text.split(/\s+/).forEach((word) => {
          const span = document.createElement("span");
          span.className = "split-line";
          span.textContent = word;
          element.appendChild(span);
          // Add space between words
          if (word !== text.split(/\s+/).slice(-1)[0]) {
            element.appendChild(document.createTextNode(" "));
          }
        });
      }

      const elements = element.querySelectorAll(`.split-${validSplitType}`);

      if (validVariant === "split") {
        gsap.set(elements, { opacity: 0, y: 50, rotateX: -90 });

        const tl = gsap.timeline({
          delay: validDelay,
          onComplete: () => {
            // Restore original text safely after animation
            if (textRef.current) {
              textRef.current.textContent = validChildren;
            }
          },
        });

        tl.to(elements, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: validDuration,
          stagger: validStaggerDelay,
          ease: "back.out(1.7)",
        });

        if (validTriggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (validVariant === "explode") {
        gsap.set(elements, { opacity: 0, scale: 0 });

        const tl = gsap.timeline({ delay: validDelay });

        tl.to(elements, {
          opacity: 1,
          scale: 1,
          duration: validDuration,
          stagger: {
            amount: 0.5,
            from: "center",
            grid: "auto",
          },
          ease: "elastic.out(1, 0.5)",
        });

        if (validTriggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (validVariant === "scramble") {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

        elements.forEach((el, i: number) => {
          const element = el as HTMLElement;
          const originalChar = element.textContent || "";
          let scrambleCount = 0;
          const maxScrambles = 10;

          const scrambleInterval = setInterval(() => {
            if (scrambleCount < maxScrambles) {
              element.textContent =
                chars[Math.floor(Math.random() * chars.length)];
              scrambleCount++;
            } else {
              element.textContent = originalChar;
              clearInterval(scrambleInterval);
            }
          }, 50);
        });
      }
    }

    return () => {
      // Cleanup safely
      if (textRef.current) {
        textRef.current.textContent = validChildren;
      }
    };
  }, [
    validVariant,
    validSplitType,
    validDuration,
    validStaggerDelay,
    validDelay,
    isInView,
    validTriggerOnScroll,
    validChildren,
  ]);

  // Trigger animation on scroll
  useEffect(() => {
    if (validTriggerOnScroll && isInView && splitRef.current) {
      const tl = gsap.timeline();

      if (validVariant === "split" || validVariant === "explode") {
        tl.play();
      }
    }
  }, [isInView, validTriggerOnScroll, validVariant]);

  // For Framer Motion variants
  if (
    validVariant === "fade" ||
    validVariant === "slide" ||
    validVariant === "typewriter" ||
    validVariant === "wave"
  ) {
    const variants = getVariants();

    return (
      <TuelErrorBoundary
        animationType={validVariant}
        onError={(error, errorInfo, errorId) => {
          console.warn(`[TUEL] AnimatedText error (${validVariant}):`, error);
        }}
      >
        <motion.div
          ref={textRef as React.RefObject<HTMLDivElement>}
          initial="hidden"
          animate={
            validTriggerOnScroll ? (isInView ? "visible" : "hidden") : "visible"
          }
          variants={variants}
          className={cn("overflow-hidden", className)}
          aria-label={`Animated text: ${validChildren}`}
          role="text"
          onAnimationStart={() => {
            startAnimation();
            startRender();
          }}
          onAnimationComplete={() => {
            endAnimation();
            endRender();
          }}
        >
          {validVariant === "typewriter" ? (
            validChildren.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                onAnimationStart={() => recordFrame()}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))
          ) : (
            <Component>{validChildren}</Component>
          )}
        </motion.div>
      </TuelErrorBoundary>
    );
  }

  // For GSAP animations
  return (
    <TuelErrorBoundary
      animationType={validVariant}
      onError={(error, errorInfo, errorId) => {
        console.warn(`[TUEL] AnimatedText error (${validVariant}):`, error);
      }}
    >
      <Component
        ref={textRef as React.RefObject<HTMLElement>}
        className={cn("overflow-hidden", className)}
        aria-label={`Animated text: ${validChildren}`}
        role="text"
      >
        {validChildren}
      </Component>
    </TuelErrorBoundary>
  );
}
