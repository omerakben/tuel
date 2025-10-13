# TUEL Best Practices Guide

This guide covers best practices for using TUEL Animation Library effectively, including performance optimization, accessibility, and maintainability.

## Table of Contents

1. [Performance Best Practices](#performance-best-practices)
2. [Accessibility Best Practices](#accessibility-best-practices)
3. [Code Organization](#code-organization)
4. [Error Handling](#error-handling)
5. [Testing Best Practices](#testing-best-practices)
6. [Bundle Optimization](#bundle-optimization)
7. [Animation Design Principles](#animation-design-principles)
8. [Component Composition](#component-composition)
9. [TypeScript Best Practices](#typescript-best-practices)
10. [Production Deployment](#production-deployment)

---

## Performance Best Practices

### 1. Use Performance Monitoring

Always monitor performance in production to ensure smooth animations.

```tsx
import { usePerformanceMonitor } from "@tuel/performance";

export function MonitoredComponent() {
  const { fps, memoryUsage, renderTime } = usePerformanceMonitor();

  // Log performance issues
  useEffect(() => {
    if (fps < 30) {
      console.warn(`Low FPS detected: ${fps}`);
    }

    if (memoryUsage > 100) {
      console.warn(`High memory usage: ${memoryUsage}MB`);
    }
  }, [fps, memoryUsage]);

  return <YourAnimatedComponent />;
}
```

### 2. Optimize Animation Performance

Use `useAnimationPerformance` for expensive animations.

```tsx
import { useAnimationPerformance } from "@tuel/performance";

export function OptimizedAnimation() {
  const { startAnimation, recordFrame, endAnimation } = useAnimationPerformance("optimized");

  const handleExpensiveAnimation = () => {
    startAnimation();

    // Use requestAnimationFrame for smooth animations
    const animate = () => {
      recordFrame();
      // Animation logic here
      requestAnimationFrame(animate);
    };

    animate();
    endAnimation();
  };

  return <div onClick={handleExpensiveAnimation}>Optimized Animation</div>;
}
```

### 3. Implement Performance Budgets

Set and enforce performance budgets.

```tsx
import { PerformanceBudget } from "@tuel/performance";

const budget = new PerformanceBudget({
  maxFPS: 30,
  maxMemoryUsage: 100, // MB
  maxRenderTime: 16, // ms
  maxBundleSize: 50000 // bytes
});

export function BudgetedComponent() {
  const { fps, memoryUsage, renderTime } = usePerformanceMonitor();

  useEffect(() => {
    if (!budget.checkPerformance({ fps, memoryUsage, renderTime })) {
      console.error("Performance budget exceeded");
    }
  }, [fps, memoryUsage, renderTime]);

  return <YourComponent />;
}
```

### 4. Use Proper Cleanup

Always clean up resources to prevent memory leaks.

```tsx
import { useEffect, useRef } from "react";
import { usePerformanceMonitor } from "@tuel/performance";

export function CleanupComponent() {
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
    if (memoryUsage > 100) {
      console.warn("High memory usage detected");
    }
  }, [memoryUsage]);

  return <YourComponent />;
}
```

---

## Accessibility Best Practices

### 1. Respect User Preferences

Always respect user accessibility preferences.

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

### 2. Provide Screen Reader Support

Use screen reader announcements for dynamic content.

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
        Activate Feature
      </button>
    </div>
  );
}
```

### 3. Implement Keyboard Navigation

Ensure all interactive elements are keyboard accessible.

```tsx
import { useKeyboardNavigation } from "@tuel/utils";

export function KeyboardAccessible() {
  const { handleKeyDown } = useKeyboardNavigation();

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label="Interactive element"
    >
      Keyboard Accessible Element
    </div>
  );
}
```

### 4. Use Proper ARIA Attributes

Add appropriate ARIA attributes for better accessibility.

```tsx
import { Carousel } from "@tuel/ui";

export function AccessibleCarousel() {
  return (
    <Carousel
      slides={slides}
      aria-label="Product image gallery"
      aria-describedby="carousel-description"
      role="region"
    />
  );
}
```

---

## Code Organization

### 1. Component Structure

Organize components with clear separation of concerns.

```tsx
// ✅ Good: Clear component structure
export function AnimatedHero() {
  // Hooks
  const { prefersReducedMotion } = useAccessibilityPreferences();
  const { fps } = usePerformanceMonitor();

  // Event handlers
  const handleClick = () => {
    console.log("Hero clicked");
  };

  // Render
  return (
    <section className="hero">
      <AnimatedText
        text="Welcome"
        variant="fade"
        duration={prefersReducedMotion ? 0 : 1000}
      />
      <MagneticButton onClick={handleClick}>
        Get Started
      </MagneticButton>
    </section>
  );
}

// ❌ Avoid: Mixed concerns
export function MessyComponent() {
  // Hooks mixed with logic
  const [state, setState] = useState();
  const { fps } = usePerformanceMonitor();

  // Complex logic in render
  return (
    <div>
      {fps < 30 && <div>Low FPS</div>}
      <AnimatedText text="Hello" />
      {state && <div>State content</div>}
    </div>
  );
}
```

### 2. Custom Hooks

Extract reusable logic into custom hooks.

```tsx
// ✅ Good: Custom hook for animation logic
function useAnimatedCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);
  const { startAnimation, endAnimation } = useAnimationPerformance("counter");

  const increment = useCallback(() => {
    startAnimation();
    setCount(prev => prev + 1);
    endAnimation();
  }, [startAnimation, endAnimation]);

  return { count, increment };
}

export function CounterComponent() {
  const { count, increment } = useAnimatedCounter(0);

  return (
    <div>
      <AnimatedText text={count.toString()} variant="fade" />
      <MagneticButton onClick={increment}>
        Increment
      </MagneticButton>
    </div>
  );
}
```

### 3. Component Composition

Compose components for better reusability.

```tsx
// ✅ Good: Composed components
export function AnimatedCard({ title, content, onClick }: CardProps) {
  return (
    <div className="card">
      <AnimatedText text={title} variant="fade" />
      <AnimatedText text={content} variant="slide" />
      <MagneticButton onClick={onClick}>
        Action
      </MagneticButton>
    </div>
  );
}

export function CardGrid({ cards }: { cards: CardData[] }) {
  return (
    <div className="grid">
      {cards.map(card => (
        <AnimatedCard
          key={card.id}
          title={card.title}
          content={card.content}
          onClick={() => handleCardClick(card.id)}
        />
      ))}
    </div>
  );
}
```

---

## Error Handling

### 1. Use Error Boundaries

Wrap components with error boundaries for graceful error handling.

```tsx
import { TuelErrorBoundary } from "@tuel/utils";

export function App() {
  return (
    <TuelErrorBoundary
      animationType="app"
      onError={(error, errorInfo, errorId) => {
        console.error("Animation error:", error);
        // Send to error reporting service
        reportError(error, errorInfo, errorId);
      }}
    >
      <YourAnimatedComponents />
    </TuelErrorBoundary>
  );
}
```

### 2. Handle Animation Errors

Implement proper error handling for animations.

```tsx
import { useState } from "react";
import { AnimatedText } from "@tuel/text-effects";

export function ErrorHandledComponent() {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error("Animation error:", error);
    setHasError(true);
  };

  if (hasError) {
    return <div>Animation failed to load</div>;
  }

  return (
    <AnimatedText
      text="Hello World"
      variant="fade"
      onError={handleError}
    />
  );
}
```

### 3. Fallback Components

Provide fallbacks for failed animations.

```tsx
import { Suspense } from "react";
import { AnimatedText } from "@tuel/text-effects";

export function FallbackComponent() {
  return (
    <Suspense fallback={<div>Loading animation...</div>}>
      <AnimatedText
        text="Hello World"
        variant="fade"
      />
    </Suspense>
  );
}
```

---

## Testing Best Practices

### 1. Test Animation Behavior

Test that animations work as expected.

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AnimatedText } from "@tuel/text-effects";

test("animated text renders correctly", () => {
  render(<AnimatedText text="Hello" variant="fade" />);

  expect(screen.getByText("Hello")).toBeInTheDocument();
});

test("animation triggers on interaction", () => {
  const handleClick = jest.fn();
  render(
    <MagneticButton onClick={handleClick}>
      Click Me
    </MagneticButton>
  );

  fireEvent.click(screen.getByText("Click Me"));
  expect(handleClick).toHaveBeenCalled();
});
```

### 2. Test Accessibility

Ensure components are accessible.

```tsx
import { render } from "@testing-library/react";
import { Carousel } from "@tuel/ui";

test("carousel has proper accessibility attributes", () => {
  render(<Carousel slides={slides} />);

  const carousel = screen.getByRole("region");
  expect(carousel).toHaveAttribute("aria-label");
});
```

### 3. Test Performance

Monitor performance in tests.

```tsx
import { render } from "@testing-library/react";
import { usePerformanceMonitor } from "@tuel/performance";

test("component meets performance requirements", () => {
  const TestComponent = () => {
    const { fps } = usePerformanceMonitor();
    return <div>FPS: {fps}</div>;
  };

  render(<TestComponent />);

  // Test that FPS is above threshold
  expect(screen.getByText(/FPS:/)).toBeInTheDocument();
});
```

---

## Bundle Optimization

### 1. Tree Shaking

Import only what you need.

```tsx
// ✅ Good: Specific imports
import { AnimatedText } from "@tuel/text-effects";
import { MagneticButton } from "@tuel/interaction";

// ❌ Avoid: Wildcard imports
import * as Tuel from "@tuel/ui";
```

### 2. Dynamic Imports

Use dynamic imports for large components.

```tsx
import { lazy, Suspense } from "react";

const MorphingShapes = lazy(() => import("@tuel/three").then(module => ({
  default: module.MorphingShapes
})));

export function LazyComponent() {
  return (
    <Suspense fallback={<div>Loading 3D component...</div>}>
      <MorphingShapes />
    </Suspense>
  );
}
```

### 3. Bundle Analysis

Analyze bundle size regularly.

```bash
# Analyze bundle size
npm run build
npx bundle-analyzer dist/

# Check for unused dependencies
npx depcheck
```

---

## Animation Design Principles

### 1. Purposeful Animations

Every animation should have a purpose.

```tsx
// ✅ Good: Purposeful animation
export function PurposefulAnimation() {
  return (
    <AnimatedText
      text="Welcome to our app"
      variant="fade"
      duration={1000}
      // Purpose: Draw attention to welcome message
    />
  );
}

// ❌ Avoid: Unnecessary animation
export function UnnecessaryAnimation() {
  return (
    <AnimatedText
      text="Static content"
      variant="explode"
      duration={2000}
      // Purpose: None, just decorative
    />
  );
}
```

### 2. Consistent Timing

Use consistent timing across your app.

```tsx
// ✅ Good: Consistent timing
const ANIMATION_TIMING = {
  fast: 200,
  normal: 500,
  slow: 1000
};

export function ConsistentAnimations() {
  return (
    <div>
      <AnimatedText text="Fast" duration={ANIMATION_TIMING.fast} />
      <AnimatedText text="Normal" duration={ANIMATION_TIMING.normal} />
      <AnimatedText text="Slow" duration={ANIMATION_TIMING.slow} />
    </div>
  );
}
```

### 3. Performance-First Design

Design animations with performance in mind.

```tsx
// ✅ Good: Performance-first design
export function PerformanceFirst() {
  const { prefersReducedMotion } = useAccessibilityPreferences();

  return (
    <AnimatedText
      text="Performance optimized"
      variant="fade"
      duration={prefersReducedMotion ? 0 : 300} // Short duration
    />
  );
}
```

---

## Component Composition

### 1. Single Responsibility

Each component should have a single responsibility.

```tsx
// ✅ Good: Single responsibility
export function AnimatedButton({ children, onClick }: ButtonProps) {
  return (
    <MagneticButton onClick={onClick}>
      {children}
    </MagneticButton>
  );
}

// ❌ Avoid: Multiple responsibilities
export function ComplexComponent({ data, onSave, onDelete }: ComplexProps) {
  return (
    <div>
      <AnimatedText text={data.title} />
      <MagneticButton onClick={onSave}>Save</MagneticButton>
      <MagneticButton onClick={onDelete}>Delete</MagneticButton>
      <Carousel slides={data.images} />
    </div>
  );
}
```

### 2. Composition over Inheritance

Use composition to build complex components.

```tsx
// ✅ Good: Composition
export function AnimatedCard({ title, content, actions }: CardProps) {
  return (
    <div className="card">
      <AnimatedText text={title} variant="fade" />
      <AnimatedText text={content} variant="slide" />
      <div className="actions">
        {actions.map(action => (
          <MagneticButton key={action.id} onClick={action.onClick}>
            {action.label}
          </MagneticButton>
        ))}
      </div>
    </div>
  );
}
```

### 3. Reusable Patterns

Create reusable animation patterns.

```tsx
// ✅ Good: Reusable pattern
export function FadeInSequence({ children }: { children: React.ReactNode[] }) {
  return (
    <div>
      {children.map((child, index) => (
        <AnimatedText
          key={index}
          text={child}
          variant="fade"
          delay={index * 100}
        />
      ))}
    </div>
  );
}
```

---

## TypeScript Best Practices

### 1. Strict Typing

Use strict TypeScript configuration.

```tsx
// ✅ Good: Strict typing
interface AnimatedButtonProps {
  text: string;
  variant: TextVariant;
  duration: number;
  onClick: () => void;
}

export function AnimatedButton({ text, variant, duration, onClick }: AnimatedButtonProps) {
  return (
    <MagneticButton onClick={onClick}>
      <AnimatedText text={text} variant={variant} duration={duration} />
    </MagneticButton>
  );
}

// ❌ Avoid: Any types
export function UntypedButton(props: any) {
  return <MagneticButton {...props} />;
}
```

### 2. Generic Components

Use generics for reusable components.

```tsx
// ✅ Good: Generic component
interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  variant: TextVariant;
}

export function AnimatedList<T>({ items, renderItem, variant }: AnimatedListProps<T>) {
  return (
    <div>
      {items.map((item, index) => (
        <AnimatedText
          key={index}
          text={renderItem(item)}
          variant={variant}
          delay={index * 100}
        />
      ))}
    </div>
  );
}
```

### 3. Type Guards

Use type guards for runtime type checking.

```tsx
// ✅ Good: Type guards
function isTextVariant(value: string): value is TextVariant {
  return ['fade', 'slide', 'typewriter', 'wave'].includes(value);
}

export function SafeAnimatedText({ variant, ...props }: AnimatedTextProps) {
  const safeVariant = isTextVariant(variant) ? variant : 'fade';

  return <AnimatedText {...props} variant={safeVariant} />;
}
```

---

## Production Deployment

### 1. Environment Configuration

Configure different settings for different environments.

```tsx
// ✅ Good: Environment configuration
const config = {
  development: {
    enablePerformanceMonitoring: true,
    logLevel: 'debug',
    enableErrorBoundaries: true
  },
  production: {
    enablePerformanceMonitoring: false,
    logLevel: 'error',
    enableErrorBoundaries: true
  }
};

export function App() {
  const env = process.env.NODE_ENV;
  const currentConfig = config[env];

  return (
    <TuelErrorBoundary
      animationType="app"
      onError={currentConfig.enableErrorBoundaries ? handleError : undefined}
    >
      <YourComponents />
    </TuelErrorBoundary>
  );
}
```

### 2. Performance Monitoring

Monitor performance in production.

```tsx
// ✅ Good: Production monitoring
export function ProductionApp() {
  const { fps, memoryUsage } = usePerformanceMonitor();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Send performance data to analytics
      analytics.track('performance', {
        fps,
        memoryUsage,
        timestamp: Date.now()
      });
    }
  }, [fps, memoryUsage]);

  return <YourComponents />;
}
```

### 3. Error Reporting

Implement proper error reporting.

```tsx
// ✅ Good: Error reporting
export function ProductionApp() {
  const handleError = (error: Error, errorInfo: any, errorId: string) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      errorReporting.captureException(error, {
        extra: errorInfo,
        tags: { errorId }
      });
    }
  };

  return (
    <TuelErrorBoundary
      animationType="app"
      onError={handleError}
    >
      <YourComponents />
    </TuelErrorBoundary>
  );
}
```

---

## Summary

Following these best practices will help you:

- **Improve Performance**: Optimize animations and monitor performance
- **Enhance Accessibility**: Make components accessible to all users
- **Maintain Code Quality**: Organize code for better maintainability
- **Handle Errors Gracefully**: Implement proper error handling
- **Test Effectively**: Write comprehensive tests
- **Optimize Bundles**: Reduce bundle size and improve loading
- **Design Better Animations**: Create purposeful, consistent animations
- **Compose Components**: Build reusable, composable components
- **Use TypeScript Effectively**: Leverage TypeScript for better development
- **Deploy Successfully**: Configure for production deployment

For more information, visit the [API Documentation](./api/README.md) and [Usage Guides](./usage-guides.md).

---

*This best practices guide is part of the TUEL Animation Library documentation. For more information, visit the [main documentation](./README.md).*
