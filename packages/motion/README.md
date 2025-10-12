# @tuel/motion

Advanced motion and animation components for React. Physics-based animations, spring systems, and smooth transitions built on Motion One.

[![npm version](https://img.shields.io/npm/v/@tuel/motion.svg)](https://www.npmjs.com/package/@tuel/motion)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **High Performance** - Built on Motion One for optimal performance
- 🎯 **Physics-based** - Realistic spring and inertia animations
- 🔧 **Simple API** - Easy-to-use React components and hooks
- 📦 **Lightweight** - Minimal bundle size impact
- ♿ **Accessible** - Respects reduced motion preferences
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/motion

# Peer dependencies
pnpm add react react-dom motion
```

## Quick Start

```tsx
import { Motion } from '@tuel/motion';

function App() {
  return (
    <Motion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Hello Motion!</h1>
    </Motion>
  );
}
```

## API Reference

### Motion Component

Animate any element with declarative props.

```tsx
<Motion
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ 
    duration: 0.5,
    ease: 'easeOut'
  }}
>
  <div>Animated content</div>
</Motion>
```

### Spring Animations

```tsx
<Motion
  animate={{ x: 100 }}
  transition={{
    type: 'spring',
    stiffness: 100,
    damping: 15,
  }}
>
  <div>Spring animation</div>
</Motion>
```

### Inertia Animations

```tsx
<Motion
  animate={{ x: 100 }}
  transition={{
    type: 'inertia',
    velocity: 50,
  }}
>
  <div>Inertia animation</div>
</Motion>
```

## Usage Examples

### Fade In Animation

```tsx
import { Motion } from '@tuel/motion';

function FadeIn({ children }) {
  return (
    <Motion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </Motion>
  );
}
```

### Slide Up Animation

```tsx
function SlideUp({ children }) {
  return (
    <Motion
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </Motion>
  );
}
```

### Staggered List

```tsx
function StaggeredList({ items }) {
  return (
    <div>
      {items.map((item, i) => (
        <Motion
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div>{item.text}</div>
        </Motion>
      ))}
    </div>
  );
}
```

### Interactive Button

```tsx
function AnimatedButton() {
  return (
    <Motion
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <button>Click me</button>
    </Motion>
  );
}
```

## Performance

- GPU-accelerated animations
- Automatic will-change optimization
- Efficient DOM updates
- Respects reduced motion preferences

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/motion)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/motion)
