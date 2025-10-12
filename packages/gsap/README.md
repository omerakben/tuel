# @tuel/gsap

GSAP integration utilities and React-friendly wrappers for the GreenSock Animation Platform.

[![npm version](https://img.shields.io/npm/v/@tuel/gsap.svg)](https://www.npmjs.com/package/@tuel/gsap)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **GSAP Power** - Harness the full power of GSAP in React
- 🎬 **React Hooks** - Easy-to-use hooks for GSAP animations
- 📦 **Type-safe** - Full TypeScript support
- 🔧 **Auto Cleanup** - Automatic cleanup on unmount
- 🎯 **Plugin Support** - Works with GSAP plugins (ScrollTrigger, etc.)
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/gsap

# Peer dependency
pnpm add gsap
```

## Quick Start

```tsx
import { useGSAP } from '@tuel/gsap';
import { useRef } from 'react';

function AnimatedComponent() {
  const boxRef = useRef(null);

  useGSAP(() => {
    gsap.to(boxRef.current, {
      x: 100,
      duration: 1,
      ease: 'power2.out',
    });
  }, []);

  return <div ref={boxRef}>Animated Box</div>;
}
```

## API Reference

### useGSAP

Hook for GSAP animations with automatic cleanup.

```tsx
import { useGSAP } from '@tuel/gsap';
import gsap from 'gsap';

function Component() {
  const ref = useRef(null);

  useGSAP(() => {
    // Animation code here
    gsap.to(ref.current, { x: 100 });
  }, [dependencies]);

  return <div ref={ref}>Content</div>;
}
```

### useGSAPTimeline

Create and manage GSAP timelines.

```tsx
import { useGSAPTimeline } from '@tuel/gsap';

function TimelineComponent() {
  const { timeline, play, pause, reverse } = useGSAPTimeline();

  useEffect(() => {
    timeline
      .to('.box1', { x: 100, duration: 1 })
      .to('.box2', { y: 100, duration: 1 })
      .to('.box3', { rotation: 360, duration: 1 });
  }, []);

  return (
    <div>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reverse}>Reverse</button>
    </div>
  );
}
```

## Usage Examples

### Simple Animation

```tsx
import { useGSAP } from '@tuel/gsap';
import gsap from 'gsap';

function FadeIn() {
  const elementRef = useRef(null);

  useGSAP(() => {
    gsap.from(elementRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });
  }, []);

  return <div ref={elementRef}>Fade in content</div>;
}
```

### Stagger Animation

```tsx
function StaggeredList({ items }) {
  const listRef = useRef(null);

  useGSAP(() => {
    gsap.from(listRef.current.children, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [items]);

  return (
    <ul ref={listRef}>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
```

### ScrollTrigger Integration

```tsx
import { useGSAP } from '@tuel/gsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollAnimation() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(sectionRef.current, {
      opacity: 0,
      y: 100,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });
  }, []);

  return <section ref={sectionRef}>Scroll-triggered content</section>;
}
```

### Timeline Sequence

```tsx
import { useGSAPTimeline } from '@tuel/gsap';

function SequenceAnimation() {
  const { timeline } = useGSAPTimeline();

  useEffect(() => {
    timeline
      .from('.hero-title', { 
        opacity: 0, 
        y: 50, 
        duration: 1 
      })
      .from('.hero-subtitle', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8 
      }, '-=0.5')
      .from('.hero-cta', { 
        opacity: 0, 
        scale: 0.8, 
        duration: 0.6 
      }, '-=0.4');
  }, []);

  return (
    <div className="hero">
      <h1 className="hero-title">Welcome</h1>
      <p className="hero-subtitle">Subtitle</p>
      <button className="hero-cta">Get Started</button>
    </div>
  );
}
```

### Hover Animation

```tsx
function HoverCard() {
  const cardRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  }, []);

  return <div ref={cardRef} className="card">Hover me</div>;
}
```

## TypeScript Support

Full TypeScript support:

```typescript
import type { GSAPTimelineOptions } from '@tuel/gsap';
```

## Performance

- Automatic cleanup prevents memory leaks
- GSAP's optimized rendering engine
- GPU acceleration for transforms
- Efficient DOM manipulation

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All browsers supported by GSAP

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/gsap)
- [GSAP Docs](https://greensock.com/docs/)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/gsap)
