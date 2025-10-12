# @tuel/tokens

Design tokens and theme system for TUEL components. Consistent spacing, colors, timing, and animation values across the library.

[![npm version](https://img.shields.io/npm/v/@tuel/tokens.svg)](https://www.npmjs.com/package/@tuel/tokens)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Design Tokens** - Standardized animation timings, easings, and breakpoints
- 🔧 **Type-safe** - Full TypeScript support with const assertions
- 🌳 **Tree-shakeable** - Import only what you need
- 🚀 **Zero dependencies** - No external runtime dependencies
- 🎭 **Multi-format** - CSS strings and Framer Motion arrays

## Installation

```bash
pnpm add @tuel/tokens
```

## API Reference

### Animation Tokens

#### Duration

Pre-defined animation durations in milliseconds:

```typescript
import { animations } from '@tuel/tokens';

animations.duration.instant  // 0ms
animations.duration.fast     // 200ms
animations.duration.normal   // 300ms
animations.duration.slow     // 500ms
animations.duration.slower   // 800ms
animations.duration.slowest  // 1000ms
```

#### Easing Functions

Available in both CSS and Framer Motion formats:

```typescript
import { animations } from '@tuel/tokens';

// For CSS animations
animations.easing.css.easeIn        // "cubic-bezier(0.4, 0, 1, 1)"
animations.easing.css.easeOut       // "cubic-bezier(0, 0, 0.2, 1)"
animations.easing.css.easeInOut     // "cubic-bezier(0.4, 0, 0.2, 1)"
animations.easing.css.easeInExpo    // "cubic-bezier(0.95, 0.05, 0.795, 0.035)"
animations.easing.css.easeOutExpo   // "cubic-bezier(0.19, 1, 0.22, 1)"

// For Framer Motion
animations.easing.motion.easeIn     // [0.4, 0, 1, 1]
animations.easing.motion.easeOut    // [0, 0, 0.2, 1]
animations.easing.motion.easeInOut  // [0.4, 0, 0.2, 1]
```

#### Spring Presets

Spring animation configurations for Framer Motion:

```typescript
import { animations } from '@tuel/tokens';

animations.spring.gentle  // { type: "spring", stiffness: 100, damping: 15 }
animations.spring.wobbly  // { type: "spring", stiffness: 180, damping: 12 }
animations.spring.stiff   // { type: "spring", stiffness: 300, damping: 20 }
animations.spring.slow    // { type: "spring", stiffness: 40, damping: 20 }
```

### Breakpoints

Responsive breakpoint values (in pixels):

```typescript
import { breakpoints } from '@tuel/tokens';

breakpoints.xs   // 375px
breakpoints.sm   // 640px
breakpoints.md   // 768px
breakpoints.lg   // 1024px
breakpoints.xl   // 1280px
breakpoints['2xl'] // 1536px
```

### Z-Index Scale

Standardized z-index values for layering:

```typescript
import { zIndex } from '@tuel/tokens';

zIndex.base      // 0
zIndex.dropdown  // 10
zIndex.sticky    // 20
zIndex.overlay   // 30
zIndex.modal     // 40
zIndex.popover   // 50
zIndex.tooltip   // 60
zIndex.toast     // 70
```

## Usage Examples

### CSS Animations

```tsx
import { animations } from '@tuel/tokens';

const styles = {
  transition: `opacity ${animations.duration.normal}ms ${animations.easing.css.easeInOut}`,
};

function FadeIn({ children }) {
  return <div style={styles}>{children}</div>;
}
```

### Framer Motion

```tsx
import { motion } from 'framer-motion';
import { animations } from '@tuel/tokens';

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animations.duration.normal / 1000, // Convert to seconds
        ease: animations.easing.motion.easeOut,
      }}
    >
      <h2>Hello World</h2>
    </motion.div>
  );
}
```

### Spring Animations

```tsx
import { motion } from 'framer-motion';
import { animations } from '@tuel/tokens';

function SpringButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={animations.spring.wobbly}
    >
      Click me!
    </motion.button>
  );
}
```

### Responsive Design

```tsx
import { breakpoints } from '@tuel/tokens';

const mediaQueries = {
  mobile: `(max-width: ${breakpoints.sm}px)`,
  tablet: `(min-width: ${breakpoints.md}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
};

// Use with CSS-in-JS
const styles = {
  fontSize: '16px',
  [`@media ${mediaQueries.desktop}`]: {
    fontSize: '18px',
  },
};
```

### Z-Index Management

```tsx
import { zIndex } from '@tuel/tokens';

const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: zIndex.overlay,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'fixed',
    zIndex: zIndex.modal,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};
```

## TypeScript Support

All tokens are typed with const assertions for type safety:

```typescript
import type { animations, breakpoints, zIndex } from '@tuel/tokens';

// Duration values are typed as literals
type Duration = typeof animations.duration.normal; // 300

// Breakpoint keys are typed
type BreakpointKey = keyof typeof breakpoints; // 'xs' | 'sm' | 'md' | ...
```

## Bundle Size

- **Minified**: ~1.5 kB
- **Gzipped**: ~0.6 kB

## Browser Support

- All modern browsers (ES2015+)
- Node.js 18+
- SSR frameworks (Next.js, Remix, etc.)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/tokens)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/tokens)
