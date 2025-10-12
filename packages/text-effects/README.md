# @tuel/text-effects

Advanced text animation effects for React. Create stunning typography with typewriter effects, text reveals, character animations, and dynamic effects.

[![npm version](https://img.shields.io/npm/v/@tuel/text-effects.svg)](https://www.npmjs.com/package/@tuel/text-effects)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ✨ **Rich Animations** - Fade, slide, bounce, wave, and more
- 🎯 **Character-level Control** - Animate individual letters, words, or lines
- 🚀 **High Performance** - GPU-accelerated animations with GSAP
- ♿ **Accessible** - Respects `prefers-reduced-motion`
- 🎨 **Customizable** - Extensive configuration options
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/text-effects

# Peer dependencies
pnpm add react react-dom gsap framer-motion
```

## Components

### AnimatedText

Main component for text animations with various effects.

```tsx
import { AnimatedText } from '@tuel/text-effects';

function Hero() {
  return (
    <AnimatedText
      text="Welcome to the future"
      animation="fadeIn"
      splitBy="char"
      stagger={0.05}
      duration={0.8}
    />
  );
}
```

**Props:**

```typescript
interface AnimatedTextProps {
  text: string;                    // Text to animate
  animation?: AnimationType;       // Animation style
  splitBy?: 'char' | 'word' | 'line'; // How to split text
  stagger?: number;                // Delay between elements (seconds)
  duration?: number;               // Animation duration (seconds)
  delay?: number;                  // Initial delay (seconds)
  easing?: string;                 // GSAP easing function
  className?: string;              // Custom CSS class
  as?: keyof JSX.IntrinsicElements; // HTML element type
  onComplete?: () => void;         // Callback when animation completes
}
```

**Animation Types:**
- `fadeIn` - Fade in characters
- `slideUp` - Slide up from below
- `slideDown` - Slide down from above
- `slideLeft` - Slide from right
- `slideRight` - Slide from left
- `bounce` - Bouncy entrance
- `wave` - Wave effect across text
- `scale` - Scale up from center
- `rotate` - Rotate in
- `blur` - Blur to clear

### ParticleText

Text that breaks into particles for dramatic effects.

```tsx
import { ParticleText } from '@tuel/text-effects';

function DramaticTitle() {
  return (
    <ParticleText
      text="IMPACT"
      particleCount={100}
      explosionRadius={200}
      colors={['#ff0080', '#7928ca', '#0070f3']}
    />
  );
}
```

**Props:**

```typescript
interface ParticleTextProps {
  text: string;
  particleCount?: number;          // Number of particles (default: 50)
  explosionRadius?: number;        // How far particles spread (default: 150)
  colors?: string[];               // Particle colors
  duration?: number;               // Animation duration
  className?: string;
}
```

### NavigateScrollAnimatedText

Text animation triggered by scroll position.

```tsx
import { NavigateScrollAnimatedText } from '@tuel/text-effects';

function ScrollSection() {
  return (
    <NavigateScrollAnimatedText
      text="Discover amazing features as you scroll"
      animation="slideUp"
      threshold={0.5}
      triggerOnce={false}
    />
  );
}
```

**Props:**

```typescript
interface NavigateScrollAnimatedTextProps {
  text: string;
  animation?: AnimationType;
  threshold?: number;              // Intersection threshold (0-1)
  triggerOnce?: boolean;          // Animate only once
  rootMargin?: string;            // Intersection root margin
  className?: string;
}
```

## Usage Examples

### Typewriter Effect

```tsx
import { AnimatedText } from '@tuel/text-effects';

function TypewriterDemo() {
  return (
    <AnimatedText
      text="Hello, World! This text appears character by character."
      animation="fadeIn"
      splitBy="char"
      stagger={0.05}
      duration={0.3}
    />
  );
}
```

### Hero Title Animation

```tsx
import { AnimatedText } from '@tuel/text-effects';

function HeroSection() {
  return (
    <div className="hero">
      <AnimatedText
        text="Build the Future"
        animation="slideUp"
        splitBy="word"
        stagger={0.1}
        duration={0.8}
        easing="power3.out"
        as="h1"
        className="text-6xl font-bold"
      />
    </div>
  );
}
```

### Wave Effect

```tsx
import { AnimatedText } from '@tuel/text-effects';

function WaveText() {
  return (
    <AnimatedText
      text="WAVE ANIMATION"
      animation="wave"
      splitBy="char"
      stagger={0.03}
      duration={0.5}
    />
  );
}
```

### Scroll-Triggered Reveal

```tsx
import { NavigateScrollAnimatedText } from '@tuel/text-effects';

function ScrollReveal() {
  return (
    <section className="h-screen">
      <NavigateScrollAnimatedText
        text="This text reveals as you scroll"
        animation="fadeIn"
        threshold={0.7}
        triggerOnce={true}
        as="h2"
      />
    </section>
  );
}
```

### Particle Explosion

```tsx
import { ParticleText } from '@tuel/text-effects';
import { useState } from 'react';

function ExplosiveButton() {
  const [explode, setExplode] = useState(false);

  return (
    <button onClick={() => setExplode(true)}>
      {explode ? (
        <ParticleText
          text="BOOM!"
          particleCount={150}
          explosionRadius={300}
          colors={['#ff0000', '#ff6600', '#ffaa00']}
        />
      ) : (
        'Click me!'
      )}
    </button>
  );
}
```

### Multiple Animations Sequence

```tsx
import { AnimatedText } from '@tuel/text-effects';

function SequencedText() {
  return (
    <div>
      <AnimatedText
        text="First Line"
        animation="slideUp"
        delay={0}
        splitBy="word"
      />
      <AnimatedText
        text="Second Line"
        animation="slideUp"
        delay={0.5}
        splitBy="word"
      />
      <AnimatedText
        text="Third Line"
        animation="slideUp"
        delay={1}
        splitBy="word"
      />
    </div>
  );
}
```

## Styling

All components accept `className` prop for custom styling:

```tsx
<AnimatedText
  text="Styled Text"
  className="text-4xl font-bold text-blue-600"
  animation="fadeIn"
/>
```

Default styles can be overridden with CSS:

```css
.animated-text-char {
  display: inline-block;
  /* Your custom styles */
}
```

## Performance

- Uses GSAP for GPU-accelerated animations
- Automatic cleanup on unmount
- Respects `prefers-reduced-motion`
- Optimized for 60fps animations
- Efficient DOM manipulation

## Accessibility

- Maintains semantic HTML structure
- Preserves text for screen readers
- Respects user motion preferences
- Keyboard navigation friendly
- ARIA attributes preserved

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  AnimatedTextProps,
  ParticleTextProps,
  NavigateScrollAnimatedTextProps,
  AnimationType
} from '@tuel/text-effects';
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with GSAP support

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/text-effects)
- [Examples](https://tuel.ai/examples/text-effects)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/text-effects)
