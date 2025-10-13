# TUEL Migration Guide

This guide helps you migrate from popular animation libraries to TUEL. We'll cover common migration patterns and provide step-by-step instructions.

## Table of Contents

1. [From Framer Motion](#from-framer-motion)
2. [From React Spring](#from-react-spring)
3. [From Lottie](#from-lottie)
4. [From GSAP](#from-gsap)
5. [From React Transition Group](#from-react-transition-group)
6. [From AOS (Animate On Scroll)](#from-aos-animate-on-scroll)
7. [Migration Checklist](#migration-checklist)
8. [Common Issues](#common-issues)

---

## From Framer Motion

### Basic Animations

**Before (Framer Motion):**
```tsx
import { motion } from "framer-motion";

export function FadeInComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Hello World</h1>
    </motion.div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function FadeInComponent() {
  return (
    <AnimatedText
      text="Hello World"
      variant="fade"
      duration={500}
      className="text-4xl font-bold"
    />
  );
}
```

### Gesture Animations

**Before (Framer Motion):**
```tsx
import { motion } from "framer-motion";

export function DragComponent() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1 }}
      className="w-20 h-20 bg-blue-500 rounded-lg"
    />
  );
}
```

**After (TUEL):**
```tsx
import { MagneticButton } from "@tuel/interaction";

export function DragComponent() {
  return (
    <MagneticButton
      className="w-20 h-20 bg-blue-500 rounded-lg"
      onClick={() => console.log("Magnetic effect!")}
    >
      Drag Me
    </MagneticButton>
  );
}
```

### Layout Animations

**Before (Framer Motion):**
```tsx
import { motion, AnimatePresence } from "framer-motion";

export function ListComponent({ items }: { items: string[] }) {
  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {item}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function ListComponent({ items }: { items: string[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <AnimatedText
          key={item}
          text={item}
          variant="slide"
          duration={300}
          delay={index * 100}
        />
      ))}
    </div>
  );
}
```

### Scroll Animations

**Before (Framer Motion):**
```tsx
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollComponent() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div style={{ y }}>
      <h1>Scroll Animation</h1>
    </motion.div>
  );
}
```

**After (TUEL):**
```tsx
import { HorizontalScroll } from "@tuel/scroll";

export function ScrollComponent() {
  return (
    <HorizontalScroll speed={0.5}>
      <h1>Scroll Animation</h1>
    </HorizontalScroll>
  );
}
```

---

## From React Spring

### Basic Springs

**Before (React Spring):**
```tsx
import { useSpring, animated } from "react-spring";

export function SpringComponent() {
  const props = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.div style={props}>
      <h1>Spring Animation</h1>
    </animated.div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function SpringComponent() {
  return (
    <AnimatedText
      text="Spring Animation"
      variant="slide"
      duration={1000}
      className="text-4xl font-bold"
    />
  );
}
```

### Trail Animations

**Before (React Spring):**
```tsx
import { useTrail, animated } from "react-spring";

export function TrailComponent({ items }: { items: string[] }) {
  const trail = useTrail(items.length, {
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    config: { tension: 300, friction: 30 }
  });

  return (
    <div>
      {trail.map((props, index) => (
        <animated.div key={index} style={props}>
          {items[index]}
        </animated.div>
      ))}
    </div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function TrailComponent({ items }: { items: string[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <AnimatedText
          key={index}
          text={item}
          variant="slide"
          duration={1000}
          delay={index * 100}
        />
      ))}
    </div>
  );
}
```

### Physics-based Animations

**Before (React Spring):**
```tsx
import { useSpring, animated } from "react-spring";

export function PhysicsComponent() {
  const [props, set] = useSpring(() => ({
    from: { scale: 1 },
    to: { scale: 1.2 },
    config: { tension: 300, friction: 30 }
  }));

  return (
    <animated.div
      style={props}
      onMouseEnter={() => set({ scale: 1.2 })}
      onMouseLeave={() => set({ scale: 1 })}
    >
      <h1>Physics Animation</h1>
    </animated.div>
  );
}
```

**After (TUEL):**
```tsx
import { MagneticButton } from "@tuel/interaction";

export function PhysicsComponent() {
  return (
    <MagneticButton
      className="text-4xl font-bold"
      onClick={() => console.log("Physics effect!")}
    >
      Physics Animation
    </MagneticButton>
  );
}
```

---

## From Lottie

### Lottie Animations

**Before (Lottie):**
```tsx
import Lottie from "lottie-react";
import animationData from "./animation.json";

export function LottieComponent() {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 300, height: 300 }}
    />
  );
}
```

**After (TUEL):**
```tsx
import { MorphingShapes } from "@tuel/three";

export function LottieComponent() {
  return (
    <MorphingShapes
      morphSpeed={2}
      rotationSpeed={1}
      className="w-80 h-80"
    />
  );
}
```

### Interactive Lottie

**Before (Lottie):**
```tsx
import Lottie from "lottie-react";
import { useRef } from "react";

export function InteractiveLottie() {
  const lottieRef = useRef();

  const handleClick = () => {
    lottieRef.current.play();
  };

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      onClick={handleClick}
    />
  );
}
```

**After (TUEL):**
```tsx
import { FloatingObjects } from "@tuel/three";

export function InteractiveLottie() {
  return (
    <FloatingObjects
      objectCount={5}
      floatSpeed={1.5}
      className="w-80 h-80"
    />
  );
}
```

---

## From GSAP

### Basic GSAP Animations

**Before (GSAP):**
```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function GSAPComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }
  }, []);

  return (
    <div ref={elementRef}>
      <h1>GSAP Animation</h1>
    </div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function GSAPComponent() {
  return (
    <AnimatedText
      text="GSAP Animation"
      variant="fade"
      duration={1000}
      className="text-4xl font-bold"
    />
  );
}
```

### GSAP ScrollTrigger

**Before (GSAP):**
```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollTriggerComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: elementRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div ref={elementRef}>
      <h1>Scroll Trigger Animation</h1>
    </div>
  );
}
```

**After (TUEL):**
```tsx
import { HorizontalScroll } from "@tuel/scroll";

export function ScrollTriggerComponent() {
  return (
    <HorizontalScroll speed={0.5}>
      <h1>Scroll Trigger Animation</h1>
    </HorizontalScroll>
  );
}
```

### GSAP Timeline

**Before (GSAP):**
```tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function TimelineComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        elementRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5 }
      )
      .to(elementRef.current, { rotation: 360, duration: 1 }, "-=0.25");
    }
  }, []);

  return (
    <div ref={elementRef}>
      <h1>Timeline Animation</h1>
    </div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function TimelineComponent() {
  return (
    <AnimatedText
      text="Timeline Animation"
      variant="explode"
      duration={1500}
      className="text-4xl font-bold"
    />
  );
}
```

---

## From React Transition Group

### CSSTransition

**Before (React Transition Group):**
```tsx
import { CSSTransition } from "react-transition-group";

export function TransitionComponent({ show }: { show: boolean }) {
  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div>
        <h1>Transition Animation</h1>
      </div>
    </CSSTransition>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function TransitionComponent({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <AnimatedText
      text="Transition Animation"
      variant="fade"
      duration={300}
      className="text-4xl font-bold"
    />
  );
}
```

### TransitionGroup

**Before (React Transition Group):**
```tsx
import { TransitionGroup, CSSTransition } from "react-transition-group";

export function ListComponent({ items }: { items: string[] }) {
  return (
    <TransitionGroup>
      {items.map((item) => (
        <CSSTransition key={item} timeout={300} classNames="item">
          <div>{item}</div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function ListComponent({ items }: { items: string[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <AnimatedText
          key={item}
          text={item}
          variant="slide"
          duration={300}
          delay={index * 50}
        />
      ))}
    </div>
  );
}
```

---

## From AOS (Animate On Scroll)

### AOS Animations

**Before (AOS):**
```tsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AOSComponent() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div data-aos="fade-up" data-aos-duration="1000">
      <h1>AOS Animation</h1>
    </div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function AOSComponent() {
  return (
    <AnimatedText
      text="AOS Animation"
      variant="slide"
      duration={1000}
      className="text-4xl font-bold"
    />
  );
}
```

### Multiple AOS Elements

**Before (AOS):**
```tsx
export function MultipleAOS() {
  return (
    <div>
      <div data-aos="fade-up" data-aos-delay="100">
        <h1>First Element</h1>
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <h1>Second Element</h1>
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <h1>Third Element</h1>
      </div>
    </div>
  );
}
```

**After (TUEL):**
```tsx
import { AnimatedText } from "@tuel/text-effects";

export function MultipleAOS() {
  return (
    <div>
      <AnimatedText
        text="First Element"
        variant="slide"
        duration={1000}
        delay={100}
        className="text-4xl font-bold"
      />
      <AnimatedText
        text="Second Element"
        variant="slide"
        duration={1000}
        delay={200}
        className="text-4xl font-bold"
      />
      <AnimatedText
        text="Third Element"
        variant="slide"
        duration={1000}
        delay={300}
        className="text-4xl font-bold"
      />
    </div>
  );
}
```

---

## Migration Checklist

### Pre-Migration

- [ ] **Audit current animations**: List all animations in your app
- [ ] **Identify dependencies**: Check which animation libraries you're using
- [ ] **Performance baseline**: Measure current performance metrics
- [ ] **Accessibility audit**: Check current accessibility compliance
- [ ] **Bundle size analysis**: Measure current bundle size

### During Migration

- [ ] **Install TUEL packages**: Install required TUEL packages
- [ ] **Remove old dependencies**: Uninstall previous animation libraries
- [ ] **Update imports**: Replace imports with TUEL equivalents
- [ ] **Convert components**: Migrate components one by one
- [ ] **Test functionality**: Ensure animations work as expected
- [ ] **Check accessibility**: Verify accessibility features work
- [ ] **Performance testing**: Monitor performance during migration

### Post-Migration

- [ ] **Performance verification**: Confirm performance improvements
- [ ] **Accessibility testing**: Test with screen readers
- [ ] **Cross-browser testing**: Test on different browsers
- [ ] **Bundle size verification**: Confirm bundle size reduction
- [ ] **Documentation update**: Update documentation and examples
- [ ] **Team training**: Train team on new TUEL patterns

---

## Common Issues

### 1. Animation Timing Differences

**Issue**: Animations feel different after migration.

**Solution**: Adjust duration and easing values to match original feel.

```tsx
// Before: Framer Motion with custom easing
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
/>

// After: TUEL with equivalent timing
<AnimatedText
  text="Content"
  variant="slide"
  duration={500} // Match duration
/>
```

### 2. Missing Features

**Issue**: Some advanced features from previous library aren't available.

**Solution**: Use TUEL's performance monitoring and custom hooks.

```tsx
import { useAnimationPerformance } from "@tuel/performance";

export function CustomAnimation() {
  const { startAnimation, recordFrame, endAnimation } = useAnimationPerformance("custom");

  // Implement custom animation logic
  const customAnimation = () => {
    startAnimation();
    // Your custom animation code
    endAnimation();
  };

  return <div onClick={customAnimation}>Custom Animation</div>;
}
```

### 3. Performance Regression

**Issue**: Animations are slower after migration.

**Solution**: Use TUEL's performance monitoring to identify bottlenecks.

```tsx
import { usePerformanceMonitor } from "@tuel/performance";

export function PerformanceDebug() {
  const { fps, memoryUsage } = usePerformanceMonitor();

  if (fps < 30) {
    console.warn("Performance issue detected");
  }

  return <YourComponent />;
}
```

### 4. Accessibility Issues

**Issue**: Accessibility features are lost during migration.

**Solution**: Use TUEL's built-in accessibility features.

```tsx
import { useAccessibilityPreferences } from "@tuel/utils";

export function AccessibleComponent() {
  const { prefersReducedMotion } = useAccessibilityPreferences();

  return (
    <AnimatedText
      text="Accessible Animation"
      duration={prefersReducedMotion ? 0 : 1000}
    />
  );
}
```

### 5. Bundle Size Increase

**Issue**: Bundle size increased after migration.

**Solution**: Use tree shaking and import only what you need.

```tsx
// ❌ Don't import entire package
import * as Tuel from "@tuel/ui";

// ✅ Import only what you need
import { Carousel } from "@tuel/ui";
```

---

## Migration Tools

### Automated Migration Script

```bash
# Install migration tool
npm install -g @tuel/migrate

# Run migration
tuel-migrate --from framer-motion --to tuel --path ./src
```

### Manual Migration Helper

```tsx
// Migration helper component
import { useState, useEffect } from "react";
import { AnimatedText } from "@tuel/text-effects";

export function MigrationHelper({
  fromLibrary,
  originalProps
}: {
  fromLibrary: string;
  originalProps: any;
}) {
  const [migratedProps, setMigratedProps] = useState({});

  useEffect(() => {
    // Convert props based on source library
    const converted = convertProps(fromLibrary, originalProps);
    setMigratedProps(converted);
  }, [fromLibrary, originalProps]);

  return <AnimatedText {...migratedProps} />;
}

function convertProps(fromLibrary: string, props: any) {
  switch (fromLibrary) {
    case "framer-motion":
      return convertFromFramerMotion(props);
    case "react-spring":
      return convertFromReactSpring(props);
    case "lottie":
      return convertFromLottie(props);
    default:
      return props;
  }
}
```

---

## Support

If you encounter issues during migration:

1. **Check the documentation**: [API Documentation](./api/README.md)
2. **Visit the playground**: [Interactive Playground](./playground)
3. **Report issues**: [GitHub Issues](https://github.com/omerakben/tuel/issues)
4. **Join discussions**: [Community Discussions](https://github.com/omerakben/tuel/discussions)

---

*This migration guide is part of the TUEL Animation Library documentation. For more information, visit the [main documentation](./README.md).*
