# @tuel/performance

Specialized performance utilities for animations, reduced motion support, and optimization controls.

[![npm version](https://img.shields.io/npm/v/@tuel/performance.svg)](https://www.npmjs.com/package/@tuel/performance)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ♿ **Accessibility First** - Automatic `prefers-reduced-motion` detection
- 🎯 **Frame Control** - RequestAnimationFrame management and throttling
- 📊 **Performance Monitoring** - Track FPS and animation performance
- 🔧 **Optimization Hooks** - Intersection Observer, memoization, and callbacks
- 🚀 **Zero Config** - Works out of the box with sensible defaults
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/performance

# Peer dependencies
pnpm add react react-dom framer-motion
```

## Quick Start

### Reduced Motion Support

```tsx
import { useReducedMotion, ReducedMotionWrapper } from '@tuel/performance';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div 
      style={{ 
        transition: shouldReduceMotion ? 'none' : 'all 0.3s ease' 
      }}
    >
      {/* Your content */}
    </div>
  );
}

// Or use the wrapper component
function App() {
  return (
    <ReducedMotionWrapper>
      {(prefersReducedMotion) => (
        <div>Motion reduced: {prefersReducedMotion ? 'Yes' : 'No'}</div>
      )}
    </ReducedMotionWrapper>
  );
}
```

## API Reference

### Reduced Motion Hooks

#### `useReducedMotion()`

Detects if user prefers reduced motion.

```tsx
const shouldReduceMotion = useReducedMotion();

if (shouldReduceMotion) {
  // Disable or simplify animations
}
```

#### `useSafeAnimation(duration, options)`

Returns safe animation duration based on reduced motion preference.

```tsx
const duration = useSafeAnimation(1000); // Returns 0 if reduced motion is preferred

<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: duration / 1000 }}
/>
```

#### `useSafeDuration(duration)`

Simplified version that returns 0 for reduced motion or original duration.

```tsx
const duration = useSafeDuration(500); // 500ms or 0ms
```

#### `isReducedMotionPreferred()`

Utility function to check reduced motion preference (non-hook).

```typescript
if (isReducedMotionPreferred()) {
  console.log('User prefers reduced motion');
}
```

#### `withReducedMotion(Component)`

HOC that passes reduced motion state to component.

```tsx
const SafeAnimatedComponent = withReducedMotion(MyComponent);

// MyComponent receives prefersReducedMotion prop
function MyComponent({ prefersReducedMotion }) {
  return <div>{/* ... */}</div>;
}
```

### Frame Control

#### `useFrameControl(options)`

Advanced RequestAnimationFrame management.

```tsx
import { useFrameControl } from '@tuel/performance';

function AnimationComponent() {
  const { start, stop, stats } = useFrameControl({
    fps: 60,
    onFrame: (timestamp, frameCount) => {
      console.log('Frame:', frameCount);
    },
    onFpsUpdate: (currentFps) => {
      console.log('FPS:', currentFps);
    }
  });

  return (
    <div>
      <button onClick={start}>Start Animation</button>
      <button onClick={stop}>Stop Animation</button>
      <div>FPS: {stats.fps}</div>
    </div>
  );
}
```

**Options:**
- `fps?: number` - Target frames per second (default: 60)
- `onFrame?: (timestamp: number, frameCount: number) => void`
- `onFpsUpdate?: (fps: number) => void`

**Returns:**
- `start: () => void` - Start the animation loop
- `stop: () => void` - Stop the animation loop
- `stats: FrameStats` - Current frame statistics

#### `useThrottledFrame(callback, fps)`

Throttled RAF callback at specific FPS.

```tsx
import { useThrottledFrame } from '@tuel/performance';

function ScrollAnimation() {
  useThrottledFrame((timestamp) => {
    // Called at most 30 times per second
    updateScrollAnimation(timestamp);
  }, 30);

  return <div>{/* ... */}</div>;
}
```

### Optimization Hooks

#### `useOptimizedIntersection(ref, options)`

Optimized Intersection Observer hook.

```tsx
import { useOptimizedIntersection } from '@tuel/performance';

function LazyComponent() {
  const ref = useRef(null);
  const isVisible = useOptimizedIntersection(ref, {
    threshold: 0.5,
    rootMargin: '100px',
  });

  return (
    <div ref={ref}>
      {isVisible && <ExpensiveComponent />}
    </div>
  );
}
```

#### `useOptimizedCallback(callback, deps)`

Memoized callback with performance optimization.

```tsx
import { useOptimizedCallback } from '@tuel/performance';

function Component() {
  const handleClick = useOptimizedCallback(() => {
    // Expensive operation
    processData();
  }, []);

  return <button onClick={handleClick}>Click</button>;
}
```

#### `useOptimizedMemo(factory, deps)`

Optimized memoization hook.

```tsx
import { useOptimizedMemo } from '@tuel/performance';

function DataComponent({ items }) {
  const processedData = useOptimizedMemo(
    () => expensiveCalculation(items),
    [items]
  );

  return <div>{processedData}</div>;
}
```

#### `usePerformanceMonitor(options)`

Monitor component rendering performance.

```tsx
import { usePerformanceMonitor } from '@tuel/performance';

function PerformanceSensitiveComponent() {
  const metrics = usePerformanceMonitor({
    component: 'MyComponent',
    logToConsole: true,
  });

  return (
    <div>
      <div>Render count: {metrics.renderCount}</div>
      <div>Avg render time: {metrics.avgRenderTime}ms</div>
    </div>
  );
}
```

## Usage Examples

### Complete Animation with Performance Controls

```tsx
import { 
  useReducedMotion, 
  useFrameControl, 
  useOptimizedIntersection 
} from '@tuel/performance';
import { useRef } from 'react';

function PerformantAnimation() {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isVisible = useOptimizedIntersection(ref, { threshold: 0.3 });
  
  const { start, stop } = useFrameControl({
    fps: shouldReduceMotion ? 0 : 60,
    onFrame: (timestamp) => {
      if (!isVisible) return;
      updateAnimation(timestamp);
    }
  });

  useEffect(() => {
    if (isVisible && !shouldReduceMotion) {
      start();
    } else {
      stop();
    }
  }, [isVisible, shouldReduceMotion]);

  return <div ref={ref}>{/* Animation content */}</div>;
}
```

### Framer Motion Integration

```tsx
import { motion } from 'framer-motion';
import { useSafeAnimation } from '@tuel/performance';

function SafeMotionComponent() {
  const duration = useSafeAnimation(1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: duration / 1000,
        ease: 'easeOut'
      }}
    >
      Content
    </motion.div>
  );
}
```

## TypeScript Support

All hooks and utilities are fully typed:

```typescript
import type { 
  ReducedMotionOptions,
  FrameControlOptions,
  PerformanceMetrics 
} from '@tuel/performance';
```

## Accessibility

This package helps ensure your animations are accessible:

- ✅ Automatic `prefers-reduced-motion` detection
- ✅ Zero animation durations when motion should be reduced
- ✅ Hooks work seamlessly with animation libraries
- ✅ No animations when user has motion sensitivity

## Performance Best Practices

1. **Use frame throttling** for non-critical animations (30fps instead of 60fps)
2. **Lazy load** animations using `useOptimizedIntersection`
3. **Monitor performance** in development with `usePerformanceMonitor`
4. **Respect user preferences** always check `useReducedMotion`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with `matchMedia` API support

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/performance)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/performance)
