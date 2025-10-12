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

**Visual Reference:**

| Duration | Value | Use Case |
|----------|-------|----------|
| `instant` | 0ms | Immediate state changes, no animation |
| `fast` | 200ms | Micro-interactions, hover effects |
| `normal` | 300ms | Standard transitions, default choice |
| `slow` | 500ms | Complex animations, page transitions |
| `slower` | 800ms | Emphasized animations, attention-grabbing |
| `slowest` | 1000ms | Dramatic effects, hero animations |

#### Easing Functions

Available in both CSS and Framer Motion formats:

```typescript
import { animations } from '@tuel/tokens';

// For CSS animations
animations.easing.css.linear        // "linear"
animations.easing.css.easeIn        // "cubic-bezier(0.4, 0, 1, 1)"
animations.easing.css.easeOut       // "cubic-bezier(0, 0, 0.2, 1)"
animations.easing.css.easeInOut     // "cubic-bezier(0.4, 0, 0.2, 1)"
animations.easing.css.easeInQuad    // "cubic-bezier(0.55, 0.085, 0.68, 0.53)"
animations.easing.css.easeOutQuad   // "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
animations.easing.css.easeInOutQuad // "cubic-bezier(0.455, 0.03, 0.515, 0.955)"
animations.easing.css.easeInExpo    // "cubic-bezier(0.95, 0.05, 0.795, 0.035)"
animations.easing.css.easeOutExpo   // "cubic-bezier(0.19, 1, 0.22, 1)"
animations.easing.css.easeInOutExpo // "cubic-bezier(1, 0, 0, 1)"

// For Framer Motion
animations.easing.motion.linear        // "linear"
animations.easing.motion.easeIn        // [0.4, 0, 1, 1]
animations.easing.motion.easeOut       // [0, 0, 0.2, 1]
animations.easing.motion.easeInOut     // [0.4, 0, 0.2, 1]
animations.easing.motion.easeInQuad    // [0.55, 0.085, 0.68, 0.53]
animations.easing.motion.easeOutQuad   // [0.25, 0.46, 0.45, 0.94]
animations.easing.motion.easeInOutQuad // [0.455, 0.03, 0.515, 0.955]
animations.easing.motion.easeInExpo    // [0.95, 0.05, 0.795, 0.035]
animations.easing.motion.easeOutExpo   // [0.19, 1, 0.22, 1]
animations.easing.motion.easeInOutExpo // [1, 0, 0, 1]
```

**Easing Behavior Guide:**

| Easing | Behavior | Best For |
|--------|----------|----------|
| `linear` | Constant speed | Loading indicators, progress bars |
| `easeIn` | Slow start, fast end | Elements leaving viewport |
| `easeOut` | Fast start, slow end | Elements entering viewport (most common) |
| `easeInOut` | Slow start/end | Continuous loops, reversible animations |
| `easeInQuad` | Gentle acceleration | Subtle entrances |
| `easeOutQuad` | Gentle deceleration | Subtle exits |
| `easeInOutQuad` | Gentle both ends | Smooth bidirectional |
| `easeInExpo` | Dramatic acceleration | Powerful entrances |
| `easeOutExpo` | Dramatic deceleration | Powerful exits |
| `easeInOutExpo` | Dramatic both ends | High-impact effects |

#### Spring Presets

Spring animation configurations for Framer Motion:

```typescript
import { animations } from '@tuel/tokens';

animations.spring.gentle  // { type: "spring", stiffness: 100, damping: 15 }
animations.spring.wobbly  // { type: "spring", stiffness: 180, damping: 12 }
animations.spring.stiff   // { type: "spring", stiffness: 300, damping: 20 }
animations.spring.slow    // { type: "spring", stiffness: 40, damping: 20 }
```

**Spring Characteristics:**

| Spring | Stiffness | Damping | Behavior | Use Case |
|--------|-----------|---------|----------|----------|
| `gentle` | 100 | 15 | Soft, smooth | Modal entrances, overlays |
| `wobbly` | 180 | 12 | Bouncy, playful | Buttons, interactive elements |
| `stiff` | 300 | 20 | Quick, snappy | Drawers, dropdowns |
| `slow` | 40 | 20 | Gradual, elastic | Large components, page transitions |

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

**Breakpoint Scale:**

| Name | Value | Target Devices |
|------|-------|----------------|
| `xs` | 375px | Small phones (iPhone SE) |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets (iPad portrait) |
| `lg` | 1024px | Tablets landscape, small laptops |
| `xl` | 1280px | Laptops, desktops |
| `2xl` | 1536px | Large desktops, 4K displays |

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

**Layer Hierarchy:**

| Layer | Value | Purpose |
|-------|-------|---------|
| `base` | 0 | Default stacking, regular content |
| `dropdown` | 10 | Dropdown menus, select options |
| `sticky` | 20 | Sticky headers, fixed navigation |
| `overlay` | 30 | Modal backdrops, overlays |
| `modal` | 40 | Modal dialogs, lightboxes |
| `popover` | 50 | Popovers, context menus |
| `tooltip` | 60 | Tooltips, hints |
| `toast` | 70 | Toast notifications (highest) |

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
