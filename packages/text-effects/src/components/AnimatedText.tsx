"use client";

import { cn } from "@tuel/utils";
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
  const textRef = useRef<HTMLElement>(null);
  const splitRef = useRef<any>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.5 });

  // Framer Motion variants
  const getVariants = (): Variants => {
    switch (variant) {
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
              duration,
              delay,
              staggerChildren: staggerDelay,
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
              delay,
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
              duration,
              delay,
              staggerChildren: staggerDelay,
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
              duration,
              delay,
              staggerChildren: staggerDelay,
            },
          },
        };
    }
  };

  // GSAP animations for more complex effects
  useEffect(() => {
    if (typeof window === "undefined" || !textRef.current) return;

    if (
      variant === "split" ||
      variant === "explode" ||
      variant === "scramble"
    ) {
      // Create manual split for GSAP animations
      const text = children;
      const element = textRef.current;

      if (splitType === "chars") {
        element.innerHTML = text
          .split("")
          .map(
            (char) =>
              `<span class="split-char">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
      } else if (splitType === "words") {
        element.innerHTML = text
          .split(/\s+/)
          .map((word) => `<span class="split-word">${word}</span>`)
          .join(" ");
      } else if (splitType === "lines") {
        // For lines, we'll treat each word as a potential line break
        element.innerHTML = text
          .split(/\s+/)
          .map((word) => `<span class="split-line">${word}</span>`)
          .join(" ");
      }

      const elements = element.querySelectorAll(`.split-${splitType}`);

      if (variant === "split") {
        gsap.set(elements, { opacity: 0, y: 50, rotateX: -90 });

        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            // Restore original text after animation
            if (textRef.current) {
              textRef.current.innerHTML = children;
            }
          },
        });

        tl.to(elements, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration,
          stagger: staggerDelay,
          ease: "back.out(1.7)",
        });

        if (triggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (variant === "explode") {
        gsap.set(elements, { opacity: 0, scale: 0 });

        const tl = gsap.timeline({ delay });

        tl.to(elements, {
          opacity: 1,
          scale: 1,
          duration,
          stagger: {
            amount: 0.5,
            from: "center",
            grid: "auto",
          },
          ease: "elastic.out(1, 0.5)",
        });

        if (triggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (variant === "scramble") {
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
      // Cleanup
      if (textRef.current) {
        textRef.current.innerHTML = children;
      }
    };
  }, [
    variant,
    splitType,
    duration,
    staggerDelay,
    delay,
    isInView,
    triggerOnScroll,
    children,
  ]);

  // Trigger animation on scroll
  useEffect(() => {
    if (triggerOnScroll && isInView && splitRef.current) {
      const tl = gsap.timeline();

      if (variant === "split" || variant === "explode") {
        tl.play();
      }
    }
  }, [isInView, triggerOnScroll, variant]);

  // For Framer Motion variants
  if (
    variant === "fade" ||
    variant === "slide" ||
    variant === "typewriter" ||
    variant === "wave"
  ) {
    const variants = getVariants();

    return (
      <motion.div
        ref={textRef as any}
        initial="hidden"
        animate={
          triggerOnScroll ? (isInView ? "visible" : "hidden") : "visible"
        }
        variants={variants}
        className={cn("overflow-hidden", className)}
      >
        {variant === "typewriter" ? (
          children.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))
        ) : (
          <Component>{children}</Component>
        )}
      </motion.div>
    );
  }

  // For GSAP animations
  return (
    <Component
      ref={textRef as any}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </Component>
  );
}
