import { cn } from "@tuel/utils";
import {
  TuelErrorBoundary,
  useRenderPerformance,
  useAnimationPerformance,
  useAccessibilityPreferences,
  useAccessibleAnimation,
  useKeyboardNavigation,
  useScreenReaderAnnouncements,
} from "@tuel/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  MouseEvent,
  ReactNode,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  distance?: number;
  ease?: "spring" | "tween";
  tilt?: boolean;
  ripple?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
}

/**
 * MagneticButton - A button that follows the cursor with smooth magnetic attraction
 *
 * Perfect for CTAs and interactive elements that need that "wow factor" ✨
 *
 * @example
 * ```tsx
 * <MagneticButton strength={0.5} tilt={true}>
 *   Hover me!
 * </MagneticButton>
 * ```
 */
export function MagneticButton({
  children,
  className,
  strength = 0.4,
  distance = 100,
  ease = "spring",
  tilt = false,
  ripple = true,
  onClick,
  disabled = false,
  springConfig = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  },
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  "aria-pressed": ariaPressed,
  "aria-expanded": ariaExpanded,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  // Performance monitoring
  const { startRender, endRender } = useRenderPerformance("MagneticButton");
  const { startAnimation, recordFrame, endAnimation } =
    useAnimationPerformance("magnetic-button");

  // Accessibility
  const accessibilityPrefs = useAccessibilityPreferences();
  const { announce } = useScreenReaderAnnouncements();
  const { getAnimationConfig } = useAccessibleAnimation(
    { duration: 300, easing: "ease-in-out" },
    accessibilityPrefs
  );

  // Generate accessible label
  const accessibleLabel =
    ariaLabel ||
    `Interactive button: ${
      typeof children === "string" ? children : "Magnetic button"
    }`;

  // Motion values for position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Motion values for tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Apply spring physics
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return;

    startAnimation();
    recordFrame();

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distanceFromCenter = Math.sqrt(
      distanceX * distanceX + distanceY * distanceY
    );

    // Only apply magnetic effect within distance threshold
    if (distanceFromCenter < distance) {
      // Apply magnetic pull
      x.set(distanceX * strength);
      y.set(distanceY * strength);

      // Apply tilt effect
      if (tilt) {
        const tiltStrength = 10;
        rotateX.set((distanceY / rect.height) * tiltStrength * -1);
        rotateY.set((distanceX / rect.width) * tiltStrength);
      }
    }

    endAnimation();
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovering(true);
    }
  };

  // Handle click with ripple effect
  const handleClick = (
    e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>
  ) => {
    if (disabled) return;

    startRender();

    // Announce to screen readers
    announce(`Button activated: ${accessibleLabel}`);

    // Create ripple
    if (ripple && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const clientX = "clientX" in e ? e.clientX : e.touches?.[0]?.clientX ?? 0;
      const clientY = "clientY" in e ? e.clientY : e.touches?.[0]?.clientY ?? 0;

      const rippleX = clientX - rect.left;
      const rippleY = clientY - rect.top;

      const newRipple = {
        x: rippleX,
        y: rippleY,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.();
    endRender();
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleClick(e as any);
        break;
      case "Escape":
        if (isHovering) {
          setIsHovering(false);
          x.set(0);
          y.set(0);
          rotateX.set(0);
          rotateY.set(0);
        }
        break;
    }
  };

  // Reset on unmount
  useEffect(() => {
    return () => {
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
    };
  }, [x, y, rotateX, rotateY]);

  return (
    <TuelErrorBoundary
      animationType="magnetic-button"
      onError={(error, errorInfo, errorId) => {
        console.warn(`[TUEL] MagneticButton error:`, error);
      }}
    >
      <motion.button
        ref={ref}
        className={cn(
          "relative overflow-hidden cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{
          x: ease === "spring" ? springX : x,
          y: ease === "spring" ? springY : y,
          rotateX: tilt ? (ease === "spring" ? springRotateX : rotateX) : 0,
          rotateY: tilt ? (ease === "spring" ? springRotateY : rotateY) : 0,
          transformStyle: tilt ? "preserve-3d" : undefined,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.1 }}
        aria-label={accessibleLabel}
        aria-describedby={ariaDescribedby}
        aria-pressed={ariaPressed}
        aria-expanded={ariaExpanded}
        aria-disabled={disabled}
        role="button"
        tabIndex={disabled ? -1 : 0}
        data-testid="magnetic-button"
      >
        {children}

        {/* Ripple effects */}
        {ripple &&
          ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full bg-white/30 pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{
                width: 400,
                height: 400,
                opacity: 0,
                x: -200,
                y: -200,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
      </motion.button>
    </TuelErrorBoundary>
  );
}
