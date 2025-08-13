import { cn } from "@tuel/utils";
import { useReducedMotion } from "@tuel/performance";
import { ReactNode, useEffect, useRef } from "react";
import { canUseDOM } from "../hooks/useSSR";

// Lazy load GSAP only in browser
let gsap: any;
let ScrollTrigger: any;

if (canUseDOM()) {
  import("gsap").then((mod) => {
    gsap = mod.gsap;
    import("gsap/ScrollTrigger").then((st) => {
      ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
    });
  });
}

export interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  speed?: number;
  scrub?: boolean | number;
  pin?: boolean;
  snap?: boolean | number | "labels" | "labelsDirectional";
  direction?: "left" | "right";
  triggerElement?: string;
  start?: string;
  end?: string;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export function HorizontalScroll({
  children,
  className,
  containerClassName,
  speed = 1,
  scrub = 1,
  pin = true,
  snap = false,
  direction = "left",
  triggerElement,
  start = "top top",
  end = "bottom top",
  onUpdate,
  onComplete,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip animations if SSR or user prefers reduced motion
    if (!canUseDOM() || prefersReducedMotion || !gsap || !ScrollTrigger) {
      return;
    }

    const container = containerRef.current;
    const scrollElement = scrollRef.current;

    if (!container || !scrollElement) return;

    // Calculate scroll distance
    const scrollWidth = scrollElement.scrollWidth;
    const containerWidth = container.offsetWidth;
    const scrollDistance = scrollWidth - containerWidth;

    const scrollDirection =
      direction === "left" ? -scrollDistance : scrollDistance;

    // Create the scroll animation
    const animation = gsap.to(scrollElement, {
      x: scrollDirection * speed,
      ease: "none",
      scrollTrigger: {
        trigger: triggerElement || container,
        start,
        end: end === "auto" ? `+=${scrollDistance}` : end,
        scrub,
        pin: pin ? container : false,
        snap: typeof snap === "boolean" ? undefined : snap,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self: any) => {
          if (onUpdate) {
            onUpdate(self.progress);
          }
        },
      },
    });

    return () => {
      animation.kill();
    };
  }, [
    speed,
    scrub,
    pin,
    snap,
    direction,
    triggerElement,
    start,
    end,
    onUpdate,
    onComplete,
    prefersReducedMotion,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", containerClassName)}
    >
      <div ref={scrollRef} className={cn("flex w-fit", className)}>
        {children}
      </div>
    </div>
  );
}

// Utility component for horizontal scroll items
export interface HorizontalScrollItemProps {
  children: ReactNode;
  className?: string;
  width?: string | number;
}

export function HorizontalScrollItem({
  children,
  className,
  width = "auto",
}: HorizontalScrollItemProps) {
  return (
    <div className={cn("flex-shrink-0", className)} data-width={width}>
      {children}
    </div>
  );
}
