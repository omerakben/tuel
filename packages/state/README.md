# @tuel/state

Complex animation state management, sequencing, and lifecycle controls for React animations.

[![npm version](https://img.shields.io/npm/v/@tuel/state.svg)](https://www.npmjs.com/package/@tuel/state)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎬 **Animation Sequencing** - Chain and coordinate multiple animations
- 📊 **State Management** - Track animation states and progress
- ⏱️ **Lifecycle Hooks** - Control animation start, pause, and completion
- 🔄 **Variants System** - Define reusable animation variants
- 🎯 **Timeline Control** - Precise timing and synchronization
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/state

# Peer dependencies
pnpm add react react-dom framer-motion
```

## Quick Start

```tsx
import { useAnimationSequence } from '@tuel/state';

function SequencedAnimation() {
  const { start, state } = useAnimationSequence([
    { target: '#element1', animation: 'fadeIn', duration: 500 },
    { target: '#element2', animation: 'slideUp', duration: 500, delay: 200 },
    { target: '#element3', animation: 'scale', duration: 300 },
  ]);

  return (
    <div>
      <button onClick={start}>Start Sequence</button>
      <div>State: {state}</div>
    </div>
  );
}
```

## API Reference

### useAnimationSequence

Coordinate multiple animations in sequence.

```tsx
const { start, pause, reset, state, progress } = useAnimationSequence(steps, options);
```

### useAnimationState

Track and manage animation state.

```tsx
const { isAnimating, isPaused, isComplete } = useAnimationState();
```

### useAnimationVariants

Create and manage animation variants.

```tsx
const variants = useAnimationVariants({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
});
```

## Usage Examples

### Simple Sequence

```tsx
import { useAnimationSequence } from '@tuel/state';

function AnimatedSteps() {
  const { start } = useAnimationSequence([
    { animation: 'fadeIn', duration: 500 },
    { animation: 'slideUp', duration: 500 },
    { animation: 'bounce', duration: 600 },
  ]);

  return <button onClick={start}>Animate</button>;
}
```

### With Callbacks

```tsx
function CallbackExample() {
  const { start } = useAnimationSequence(
    [
      { animation: 'fadeIn', duration: 500 },
      { animation: 'scale', duration: 300 },
    ],
    {
      onComplete: () => console.log('Sequence complete!'),
      onStep: (index) => console.log(`Step ${index} complete`),
    }
  );

  return <button onClick={start}>Start</button>;
}
```

### State Management

```tsx
import { useAnimationState } from '@tuel/state';

function StateTracking() {
  const { isAnimating, progress, state } = useAnimationState();

  return (
    <div>
      <div>Status: {state}</div>
      <div>Progress: {progress}%</div>
      <div>Animating: {isAnimating ? 'Yes' : 'No'}</div>
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support:

```typescript
import type {
  AnimationSequence,
  AnimationState,
  AnimationVariants,
} from '@tuel/state';
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/state)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/state)
