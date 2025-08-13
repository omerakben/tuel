# @tuel/scroll

Advanced scroll-triggered animations and effects for React applications.

[![npm version](https://img.shields.io/npm/v/@tuel/scroll.svg)](https://www.npmjs.com/package/@tuel/scroll)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **High Performance** - Optimized animations with automatic RAF management
- 🎯 **SSR Safe** - Server-side rendering compatible with lazy loading
- ♿ **Accessible** - Respects `prefers-reduced-motion` settings
- 📱 **Responsive** - Mobile-first design with touch support
- 🎨 **Customizable** - Flexible API with extensive configuration options
- 🔧 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/scroll

# Optional peer dependencies (install as needed)
pnpm add gsap three lenis
```

## Quick Start

### React Example

```tsx
import { HorizontalScroll, ParallaxScroll } from '@tuel/scroll';

function App() {
  return (
    <>
      {/* Horizontal scrolling section */}
      <HorizontalScroll speed={1.2} pin={true}>
        <div className="slide">Slide 1</div>
        <div className="slide">Slide 2</div>
        <div className="slide">Slide 3</div>
      </HorizontalScroll>

      {/* Parallax effect */}
      <ParallaxScroll speed={0.5}>
        <img src="background.jpg" alt="Parallax background" />
      </ParallaxScroll>
    </>
  );
}
```

### Vanilla TypeScript Example

```typescript
import { createHorizontalScroll } from '@tuel/scroll/vanilla';

const container = document.querySelector('.scroll-container');
const scroll = createHorizontalScroll(container, {
  speed: 1.2,
  pin: true,
  onUpdate: (progress) => {
    console.log(`Scroll progress: ${progress * 100}%`);
  }
});

// Clean up when needed
scroll.destroy();
```

## API Reference

### HorizontalScroll

Enables horizontal scrolling triggered by vertical scroll.

```tsx
interface HorizontalScrollProps {
  children: ReactNode;
  speed?: number;        // Animation speed multiplier (default: 1)
  pin?: boolean;         // Pin container during scroll (default: true)
  direction?: 'left' | 'right'; // Scroll direction (default: 'left')
  start?: string;        // ScrollTrigger start position (default: 'top top')
  end?: string;          // ScrollTrigger end position (default: 'bottom top')
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}
```

### ParallaxScroll

Creates parallax scrolling effects with customizable speed.

```tsx
interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number;        // Parallax speed (0-1 for slower, >1 for faster)
  offset?: number;       // Initial offset in pixels
  fadeIn?: boolean;      // Enable fade-in effect
  scale?: boolean;       // Enable scale effect
}
```

### ScrollReveal

Reveals elements as they enter the viewport.

```tsx
interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'rotate';
  duration?: number;     // Animation duration in seconds
  delay?: number;        // Animation delay in seconds
  threshold?: number;    // Visibility threshold (0-1)
  once?: boolean;        // Animate only once
}
```

## Performance Optimization

All components automatically:
- Respect `prefers-reduced-motion` user preferences
- Pause animations when tab is not visible
- Use passive event listeners for scroll events
- Implement throttling for scroll handlers
- Lazy-load heavy dependencies (GSAP, Three.js)

## Accessibility

The library is built with accessibility in mind:

```tsx
// Components automatically detect and respect reduced motion
<HorizontalScroll>
  {/* Animation disabled when prefers-reduced-motion is set */}
  <Content />
</HorizontalScroll>
```

## Advanced Usage

### Custom Scroll Triggers

```tsx
import { useScrollTrigger } from '@tuel/scroll';

function CustomComponent() {
  const { progress, isInView } = useScrollTrigger({
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  });

  return (
    <div style={{ opacity: progress }}>
      {isInView && <AnimatedContent />}
    </div>
  );
}
```

### Combining Effects

```tsx
<ParallaxScroll speed={0.5}>
  <HorizontalScroll>
    <ScrollReveal animation="fade" delay={0.2}>
      <Card />
    </ScrollReveal>
  </HorizontalScroll>
</ParallaxScroll>
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/scroll)
- [Examples](https://tuel.ai/examples/scroll)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/scroll)