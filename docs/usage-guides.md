# TUEL Animation Library - Comprehensive Usage Guides

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation Guide](#installation-guide)
3. [Quick Start Tutorial](#quick-start-tutorial)
4. [Component Guides](#component-guides)
5. [Advanced Patterns](#advanced-patterns)
6. [Performance Optimization](#performance-optimization)
7. [Accessibility Guide](#accessibility-guide)
8. [Migration Guide](#migration-guide)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Getting Started

TUEL (TypeScript Universal Enhancement Library) is a modern animation library built specifically for React applications. It provides high-performance, accessible, and customizable animation components.

### What is TUEL?

TUEL is a comprehensive animation library that includes:

- **Scroll Effects**: Parallax scrolling, reveal animations, and scroll-triggered effects
- **Text Effects**: Dynamic text animations, typewriter effects, and character reveals
- **3D Components**: Three.js powered 3D scenes and interactive experiences
- **UI Components**: Beautiful, accessible UI components with built-in animations
- **Interactions**: Magnetic buttons, hover effects, and interactive elements
- **Performance Tools**: Monitoring, optimization, and debugging utilities

### Key Features

- ✅ **TypeScript First**: Full TypeScript support with strict type checking
- ✅ **Accessibility**: WCAG 2.1 AA compliant components
- ✅ **Performance**: Optimized for 60fps animations
- ✅ **Tree Shaking**: Only import what you need
- ✅ **Error Boundaries**: Built-in error handling and recovery
- ✅ **Cross-browser**: Works on all modern browsers
- ✅ **Mobile Optimized**: Touch-friendly interactions

---

## Installation Guide

### Prerequisites

- Node.js 18+
- React 18+
- TypeScript 4.9+

### Package Installation

Install individual packages based on your needs:

```bash
# Core animation packages
npm install @tuel/scroll @tuel/text-effects @tuel/interaction

# UI components
npm install @tuel/ui @tuel/gallery

# 3D components (requires Three.js)
npm install @tuel/three

# Performance monitoring
npm install @tuel/performance

# Utilities
npm install @tuel/utils @tuel/tokens
```

### Complete Installation

For a full installation with all packages:

```bash
npm install @tuel/scroll @tuel/gallery @tuel/text-effects @tuel/three @tuel/ui @tuel/motion @tuel/state @tuel/interaction @tuel/performance @tuel/tokens @tuel/config @tuel/utils @tuel/gsap
```

### Peer Dependencies

Some packages require peer dependencies:

```bash
# For @tuel/three
npm install three @react-three/fiber @react-three/drei

# For @tuel/gsap
npm install gsap

# For animations
npm install framer-motion
```

---

## Quick Start Tutorial

### 1. Basic Text Animation

```tsx
import { AnimatedText } from "@tuel/text-effects";

export function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedText
        text="Welcome to TUEL"
        variant="fade"
        duration={1000}
        className="text-4xl font-bold text-blue-600"
      />
    </div>
  );
}
```

### 2. Interactive Button

```tsx
import { MagneticButton } from "@tuel/interaction";

export function ActionButton() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <MagneticButton
      onClick={handleClick}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold"
    >
      Get Started
    </MagneticButton>
  );
}
```

### 3. Scroll Effects

```tsx
import { HorizontalScroll } from "@tuel/scroll";

export function ScrollSection() {
  return (
    <HorizontalScroll speed={0.5} className="h-64">
      <div className="flex space-x-4">
        <div className="w-64 h-64 bg-blue-500 rounded-lg"></div>
        <div className="w-64 h-64 bg-green-500 rounded-lg"></div>
        <div className="w-64 h-64 bg-purple-500 rounded-lg"></div>
      </div>
    </HorizontalScroll>
  );
}
```

### 4. Image Carousel

```tsx
import { Carousel } from "@tuel/ui";

const slides = [
  { src: "/image1.jpg", alt: "Image 1", title: "First Slide" },
  { src: "/image2.jpg", alt: "Image 2", title: "Second Slide" },
  { src: "/image3.jpg", alt: "Image 3", title: "Third Slide" }
];

export function ImageGallery() {
  return (
    <Carousel
      slides={slides}
      variant="fade"
      autoPlay={true}
      className="w-full h-64"
    />
  );
}
```

---

## Component Guides

### Text Effects

The `@tuel/text-effects` package provides various text animation effects.

#### Available Variants

- `fade`: Smooth fade-in effect
- `slide`: Slide-in from different directions
- `typewriter`: Character-by-character reveal
- `wave`: Wave-like animation across characters
- `split`: Split text animation
- `explode`: Explosive reveal effect
- `scramble`: Scrambled text reveal

#### Example Usage

```tsx
import { AnimatedText } from "@tuel/text-effects";

export function TextShowcase() {
  return (
    <div className="space-y-8">
      <AnimatedText
        text="Fade Effect"
        variant="fade"
        duration={1000}
        className="text-2xl"
      />

      <AnimatedText
        text="Typewriter Effect"
        variant="typewriter"
        speed={100}
        className="text-2xl"
      />

      <AnimatedText
        text="Wave Effect"
        variant="wave"
        duration={1500}
        className="text-2xl"
      />
    </div>
  );
}
```

#### Props Reference

| Prop        | Type          | Default  | Description                   |
| ----------- | ------------- | -------- | ----------------------------- |
| `text`      | `string`      | -        | Text content to animate       |
| `variant`   | `TextVariant` | `"fade"` | Animation variant             |
| `duration`  | `number`      | `1000`   | Animation duration in ms      |
| `delay`     | `number`      | `0`      | Delay before animation starts |
| `speed`     | `number`      | `50`     | Speed for typewriter effect   |
| `className` | `string`      | -        | Additional CSS classes        |

### Scroll Effects

The `@tuel/scroll` package provides scroll-triggered animations.

#### Horizontal Scroll

```tsx
import { HorizontalScroll } from "@tuel/scroll";

export function HorizontalGallery() {
  return (
    <HorizontalScroll speed={0.5} className="h-96">
      <div className="flex space-x-8">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl"
          />
        ))}
      </div>
    </HorizontalScroll>
  );
}
```

#### Parallax Scroll

```tsx
import { ParallaxScroll } from "@tuel/scroll";

export function ParallaxSection() {
  return (
    <ParallaxScroll speed={0.3} className="h-screen">
      <div className="bg-gradient-to-b from-blue-500 to-purple-600 h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Parallax Effect</h1>
      </div>
    </ParallaxScroll>
  );
}
```

### Interaction Components

The `@tuel/interaction` package provides interactive elements.

#### Magnetic Button

```tsx
import { MagneticButton } from "@tuel/interaction";

export function InteractiveButton() {
  return (
    <MagneticButton
      onClick={() => console.log("Magnetic effect!")}
      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold"
    >
      Hover Me
    </MagneticButton>
  );
}
```

### 3D Components

The `@tuel/three` package provides Three.js powered 3D components.

#### Morphing Shapes

```tsx
import { MorphingShapes } from "@tuel/three";

export function ThreeDScene() {
  return (
    <div className="w-full h-96">
      <MorphingShapes
        morphSpeed={2}
        rotationSpeed={1}
        className="w-full h-full"
      />
    </div>
  );
}
```

#### Floating Objects

```tsx
import { FloatingObjects } from "@tuel/three";

export function FloatingScene() {
  return (
    <div className="w-full h-96">
      <FloatingObjects
        objectCount={8}
        floatSpeed={1.5}
        className="w-full h-full"
      />
    </div>
  );
}
```

---

## Advanced Patterns

### Custom Animation Hooks

```tsx
import { useAnimation } from "@tuel/motion";
import { useRenderPerformance } from "@tuel/performance";

export function CustomAnimatedComponent() {
  const { startAnimation, endAnimation } = useAnimation();
  const { startRender, endRender } = useRenderPerformance("CustomComponent");

  const handleInteraction = () => {
    startAnimation();
    startRender();

    // Your animation logic here

    endAnimation();
    endRender();
  };

  return (
    <div onClick={handleInteraction}>
      Custom Animation
    </div>
  );
}
```

### Performance Monitoring

```tsx
import { usePerformanceMonitor } from "@tuel/performance";

export function MonitoredComponent() {
  const { fps, memoryUsage, renderTime } = usePerformanceMonitor();

  return (
    <div>
      <div>FPS: {fps}</div>
      <div>Memory: {memoryUsage}MB</div>
      <div>Render Time: {renderTime}ms</div>
    </div>
  );
}
```

### Error Boundaries

```tsx
import { TuelErrorBoundary } from "@tuel/utils";

export function App() {
  return (
    <TuelErrorBoundary
      animationType="app"
      onError={(error, errorInfo, errorId) => {
        console.error("Animation error:", error);
        // Send to error reporting service
      }}
    >
      <YourAnimatedComponents />
    </TuelErrorBoundary>
  );
}
```

### Accessibility Integration

```tsx
import { useAccessibilityPreferences } from "@tuel/utils";

export function AccessibleComponent() {
  const { prefersReducedMotion, prefersHighContrast } = useAccessibilityPreferences();

  const animationConfig = {
    duration: prefersReducedMotion ? 0 : 1000,
    contrast: prefersHighContrast ? "high" : "normal"
  };

  return (
    <AnimatedText
      text="Accessible Animation"
      duration={animationConfig.duration}
      className={animationConfig.contrast === "high" ? "high-contrast" : ""}
    />
  );
}
```

---

## Performance Optimization

### Bundle Size Optimization

```tsx
// ❌ Don't import entire package
import * as Tuel from "@tuel/ui";

// ✅ Import only what you need
import { Carousel } from "@tuel/ui";
```

### Animation Performance

```tsx
import { useAnimationPerformance } from "@tuel/performance";

export function OptimizedComponent() {
  const { startAnimation, recordFrame, endAnimation } = useAnimationPerformance("optimized-component");

  const handleAnimation = () => {
    startAnimation();

    // Use requestAnimationFrame for smooth animations
    const animate = () => {
      recordFrame();
      // Animation logic
      requestAnimationFrame(animate);
    };

    animate();
    endAnimation();
  };

  return <div onClick={handleAnimation}>Optimized Animation</div>;
}
```

### Memory Management

```tsx
import { useEffect, useRef } from "react";
import { usePerformanceMonitor } from "@tuel/performance";

export function MemoryOptimizedComponent() {
  const { memoryUsage } = usePerformanceMonitor();
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Register cleanup functions
    const cleanup = () => {
      cleanupRef.current.forEach(fn => fn());
      cleanupRef.current = [];
    };

    return cleanup;
  }, []);

  // Monitor memory usage
  useEffect(() => {
    if (memoryUsage > 100) { // 100MB threshold
      console.warn("High memory usage detected");
    }
  }, [memoryUsage]);

  return <div>Memory Optimized Component</div>;
}
```

---

## Accessibility Guide

### ARIA Labels and Roles

```tsx
import { Carousel } from "@tuel/ui";

export function AccessibleCarousel() {
  return (
    <Carousel
      slides={slides}
      aria-label="Product image gallery"
      aria-describedby="carousel-description"
    />
  );
}
```

### Keyboard Navigation

```tsx
import { MagneticButton } from "@tuel/interaction";

export function KeyboardAccessibleButton() {
  return (
    <MagneticButton
      onClick={handleClick}
      aria-label="Submit form"
      aria-describedby="button-help"
    >
      Submit
    </MagneticButton>
  );
}
```

### Screen Reader Support

```tsx
import { useScreenReaderAnnouncements } from "@tuel/utils";

export function ScreenReaderFriendly() {
  const { announce } = useScreenReaderAnnouncements();

  const handleStateChange = (newState: string) => {
    announce(`State changed to: ${newState}`);
  };

  return (
    <div>
      <button onClick={() => handleStateChange("active")}>
        Activate
      </button>
    </div>
  );
}
```

### Reduced Motion Support

```tsx
import { useAccessibilityPreferences } from "@tuel/utils";

export function MotionAwareComponent() {
  const { prefersReducedMotion } = useAccessibilityPreferences();

  return (
    <AnimatedText
      text="Respects user preferences"
      duration={prefersReducedMotion ? 0 : 1000}
    />
  );
}
```

---

## Migration Guide

### From Framer Motion

```tsx
// Before (Framer Motion)
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// After (TUEL)
import { AnimatedText } from "@tuel/text-effects";

<AnimatedText
  text="Content"
  variant="fade"
  duration={500}
/>
```

### From React Spring

```tsx
// Before (React Spring)
import { useSpring, animated } from "react-spring";

const props = useSpring({ opacity: 1, from: { opacity: 0 } });

<animated.div style={props}>Content</animated.div>

// After (TUEL)
import { AnimatedText } from "@tuel/text-effects";

<AnimatedText
  text="Content"
  variant="fade"
  duration={1000}
/>
```

### From Lottie

```tsx
// Before (Lottie)
import Lottie from "lottie-react";

<Lottie animationData={animationData} />

// After (TUEL)
import { MorphingShapes } from "@tuel/three";

<MorphingShapes
  morphSpeed={2}
  rotationSpeed={1}
/>
```

---

## Best Practices

### 1. Component Composition

```tsx
// ✅ Good: Compose components
export function HeroSection() {
  return (
    <section className="hero">
      <AnimatedText text="Welcome" variant="fade" />
      <MagneticButton>Get Started</MagneticButton>
    </section>
  );
}

// ❌ Avoid: Monolithic components
export function EverythingComponent() {
  // Too much responsibility
}
```

### 2. Performance Considerations

```tsx
// ✅ Good: Use performance monitoring
import { useRenderPerformance } from "@tuel/performance";

export function OptimizedComponent() {
  const { startRender, endRender } = useRenderPerformance("OptimizedComponent");

  useEffect(() => {
    startRender();
    // Expensive operation
    endRender();
  }, []);
}

// ❌ Avoid: Unmonitored expensive operations
export function UnoptimizedComponent() {
  useEffect(() => {
    // Expensive operation without monitoring
  }, []);
}
```

### 3. Error Handling

```tsx
// ✅ Good: Use error boundaries
import { TuelErrorBoundary } from "@tuel/utils";

export function App() {
  return (
    <TuelErrorBoundary
      animationType="app"
      onError={(error) => console.error(error)}
    >
      <YourComponents />
    </TuelErrorBoundary>
  );
}

// ❌ Avoid: Unhandled errors
export function App() {
  return <YourComponents />; // No error handling
}
```

### 4. Accessibility

```tsx
// ✅ Good: Accessible components
export function AccessibleComponent() {
  return (
    <MagneticButton
      onClick={handleClick}
      aria-label="Submit form"
      aria-describedby="help-text"
    >
      Submit
    </MagneticButton>
  );
}

// ❌ Avoid: Missing accessibility attributes
export function InaccessibleComponent() {
  return (
    <MagneticButton onClick={handleClick}>
      Submit
    </MagneticButton>
  );
}
```

### 5. TypeScript Usage

```tsx
// ✅ Good: Proper typing
interface ComponentProps {
  text: string;
  variant: TextVariant;
  duration?: number;
}

export function TypedComponent({ text, variant, duration = 1000 }: ComponentProps) {
  return <AnimatedText text={text} variant={variant} duration={duration} />;
}

// ❌ Avoid: Any types
export function UntypedComponent(props: any) {
  return <AnimatedText {...props} />;
}
```

---

## Troubleshooting

### Common Issues

#### 1. Animation Not Working

**Problem**: Animations don't play or are choppy.

**Solutions**:
- Check if `prefers-reduced-motion` is enabled
- Verify performance monitoring shows good FPS
- Ensure proper error boundary setup

```tsx
import { useAccessibilityPreferences } from "@tuel/utils";

export function DebugComponent() {
  const { prefersReducedMotion } = useAccessibilityPreferences();

  if (prefersReducedMotion) {
    console.log("Reduced motion is enabled");
  }

  return <YourComponent />;
}
```

#### 2. TypeScript Errors

**Problem**: TypeScript compilation errors.

**Solutions**:
- Ensure proper type imports
- Check for missing peer dependencies
- Verify TypeScript version compatibility

```tsx
// Check imports
import { AnimatedText, type TextVariant } from "@tuel/text-effects";

// Use proper types
const variant: TextVariant = "fade";
```

#### 3. Performance Issues

**Problem**: Slow animations or high memory usage.

**Solutions**:
- Use performance monitoring
- Implement proper cleanup
- Optimize bundle size

```tsx
import { usePerformanceMonitor } from "@tuel/performance";

export function PerformanceDebug() {
  const { fps, memoryUsage } = usePerformanceMonitor();

  if (fps < 30) {
    console.warn("Low FPS detected:", fps);
  }

  if (memoryUsage > 100) {
    console.warn("High memory usage:", memoryUsage);
  }

  return <YourComponent />;
}
```

#### 4. Accessibility Issues

**Problem**: Components not accessible to screen readers.

**Solutions**:
- Add proper ARIA attributes
- Implement keyboard navigation
- Test with screen readers

```tsx
import { useScreenReaderAnnouncements } from "@tuel/utils";

export function AccessibleComponent() {
  const { announce } = useScreenReaderAnnouncements();

  const handleStateChange = (state: string) => {
    announce(`State changed to: ${state}`);
  };

  return (
    <button
      onClick={() => handleStateChange("active")}
      aria-label="Activate feature"
    >
      Activate
    </button>
  );
}
```

### Debug Tools

#### Performance Debugging

```tsx
import { usePerformanceMonitor } from "@tuel/performance";

export function DebugPanel() {
  const { fps, memoryUsage, renderTime } = usePerformanceMonitor();

  return (
    <div className="debug-panel">
      <div>FPS: {fps}</div>
      <div>Memory: {memoryUsage}MB</div>
      <div>Render Time: {renderTime}ms</div>
    </div>
  );
}
```

#### Error Debugging

```tsx
import { TuelErrorBoundary } from "@tuel/utils";

export function DebugApp() {
  return (
    <TuelErrorBoundary
      animationType="debug-app"
      onError={(error, errorInfo, errorId) => {
        console.error("Error ID:", errorId);
        console.error("Error:", error);
        console.error("Error Info:", errorInfo);
      }}
    >
      <YourComponents />
    </TuelErrorBoundary>
  );
}
```

### Getting Help

- **Documentation**: Check the [API documentation](./api/README.md)
- **Examples**: Visit the [playground](./playground)
- **Issues**: Report bugs on [GitHub](https://github.com/omerakben/tuel/issues)
- **Discussions**: Join the [community discussions](https://github.com/omerakben/tuel/discussions)

---

*This guide is part of the TUEL Animation Library documentation. For more information, visit the [main documentation](./README.md).*
