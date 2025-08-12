"use client";

import { MotionValue, motion, useMotionValue, useSpring } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";

export interface CursorFollowerOptions {
  damping?: number;
  stiffness?: number;
  mass?: number;
  trackVelocity?: boolean;
  idleSize?: number;
  hoverSize?: number;
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  blendMode?: string;
  zIndex?: number;
}

export interface CursorState {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  isHovering: boolean;
  velocity: { x: number; y: number };
}

export function useCursorFollower(
  options: CursorFollowerOptions = {}
): CursorState {
  const {
    damping = 30,
    stiffness = 400,
    mass = 1,
    trackVelocity = true,
    idleSize = 20,
    hoverSize = 40,
  } = options;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping, stiffness, mass });
  const cursorY = useSpring(mouseY, { damping, stiffness, mass });
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);

  const isHovering = useRef(false);
  const velocity = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      opacity.set(1);
    },
    [mouseX, mouseY, opacity]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return {
    x: cursorX,
    y: cursorY,
    scale,
    opacity,
    isHovering: isHovering.current,
    velocity: velocity.current,
  };
}

export interface CursorFollowerProps extends CursorFollowerOptions {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CursorFollower: React.FC<CursorFollowerProps> = (props) => {
  const { children, className = "", style = {}, ...options } = props;
  const cursor = useCursorFollower(options);

  return React.createElement(
    motion.div,
    {
      className: `cursor-follower ${className}`,
      style: {
        position: "fixed",
        pointerEvents: "none",
        x: cursor.x,
        y: cursor.y,
        scale: cursor.scale,
        opacity: cursor.opacity,
        ...style,
      },
    },
    children
  );
};
