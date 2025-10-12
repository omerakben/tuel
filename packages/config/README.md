# @tuel/config

Advanced configuration system for TUEL animations. Manage animation presets, themes, and global settings across your application.

[![npm version](https://img.shields.io/npm/v/@tuel/config.svg)](https://www.npmjs.com/package/@tuel/config)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Animation Presets** - Pre-configured animation styles
- 🎭 **Theme System** - Light/dark themes with custom variants
- ⚙️ **Global Config** - Centralized settings management
- 🔧 **Type-safe** - Full TypeScript support
- 🎯 **Context API** - React context for easy config sharing
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/config

# Peer dependencies
pnpm add react react-dom framer-motion
```

## Quick Start

### Basic Setup

```tsx
import { TuelConfigProvider } from '@tuel/config';

function App() {
  return (
    <TuelConfigProvider
      config={{
        animationDuration: 'normal',
        reducedMotion: false,
        theme: 'dark',
      }}
    >
      <YourApp />
    </TuelConfigProvider>
  );
}
```

## API Reference

### TuelConfigProvider

Provides configuration context to all child components.

```tsx
import { TuelConfigProvider } from '@tuel/config';

<TuelConfigProvider
  config={{
    animationDuration: 'fast' | 'normal' | 'slow',
    reducedMotion: boolean,
    theme: 'light' | 'dark' | 'auto',
    customPresets: {},
  }}
>
  <App />
</TuelConfigProvider>
```

**Props:**

```typescript
interface TuelConfigProviderProps {
  config?: Partial<TuelConfig>;
  children: ReactNode;
}

interface TuelConfig {
  animationDuration?: 'fast' | 'normal' | 'slow';
  reducedMotion?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  customPresets?: Record<string, AnimationPreset>;
}
```

### useTuelConfig

Hook to access current configuration.

```tsx
import { useTuelConfig } from '@tuel/config';

function MyComponent() {
  const { config, updateConfig } = useTuelConfig();

  return (
    <div>
      <p>Current theme: {config.theme}</p>
      <button onClick={() => updateConfig({ theme: 'dark' })}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### Animation Presets

Pre-configured animation styles ready to use.

```tsx
import { animationPresets } from '@tuel/config';

// Available presets
const fadeIn = animationPresets.fadeIn;
const slideUp = animationPresets.slideUp;
const bounce = animationPresets.bounce;
const scale = animationPresets.scale;
```

**Available Presets:**

```typescript
interface AnimationPresets {
  fadeIn: AnimationPreset;
  fadeOut: AnimationPreset;
  slideUp: AnimationPreset;
  slideDown: AnimationPreset;
  slideLeft: AnimationPreset;
  slideRight: AnimationPreset;
  scale: AnimationPreset;
  rotate: AnimationPreset;
  bounce: AnimationPreset;
  elastic: AnimationPreset;
}

interface AnimationPreset {
  initial: Variant;
  animate: Variant;
  exit?: Variant;
  transition: Transition;
}
```

### Theme System

Create and manage themes for consistent styling.

```tsx
import { createTheme, useTheme } from '@tuel/config';

// Create custom theme
const myTheme = createTheme({
  colors: {
    primary: '#0070f3',
    secondary: '#7928ca',
    background: '#ffffff',
  },
  animations: {
    duration: 300,
    easing: 'easeInOut',
  },
});

// Use in component
function ThemedComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ backgroundColor: theme.colors.background }}>
      Themed content
    </div>
  );
}
```

**Theme Config:**

```typescript
interface ThemeConfig {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  animations?: {
    duration?: number;
    easing?: string;
  };
  spacing?: {
    unit?: number;
  };
}
```

### useThemeAnimation

Hook that combines theme and animation settings.

```tsx
import { useThemeAnimation } from '@tuel/config';
import { motion } from 'framer-motion';

function AnimatedCard() {
  const animation = useThemeAnimation('fadeIn');

  return (
    <motion.div {...animation}>
      Card content
    </motion.div>
  );
}
```

## Usage Examples

### Global Configuration

```tsx
import { TuelConfigProvider } from '@tuel/config';

function App() {
  return (
    <TuelConfigProvider
      config={{
        animationDuration: 'normal',
        reducedMotion: false,
        theme: 'dark',
      }}
    >
      <Router>
        <Routes />
      </Router>
    </TuelConfigProvider>
  );
}
```

### Using Presets with Framer Motion

```tsx
import { animationPresets } from '@tuel/config';
import { motion } from 'framer-motion';

function FadeInCard() {
  return (
    <motion.div
      initial={animationPresets.fadeIn.initial}
      animate={animationPresets.fadeIn.animate}
      transition={animationPresets.fadeIn.transition}
    >
      <h2>Hello World</h2>
    </motion.div>
  );
}
```

### Dynamic Theme Switching

```tsx
import { useTuelConfig } from '@tuel/config';

function ThemeToggle() {
  const { config, updateConfig } = useTuelConfig();

  const toggleTheme = () => {
    const newTheme = config.theme === 'light' ? 'dark' : 'light';
    updateConfig({ theme: newTheme });
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {config.theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
```

### Custom Animation Presets

```tsx
import { TuelConfigProvider, useTuelConfig } from '@tuel/config';

const customPresets = {
  wiggle: {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    },
  },
};

function App() {
  return (
    <TuelConfigProvider
      config={{
        customPresets,
      }}
    >
      <WiggleComponent />
    </TuelConfigProvider>
  );
}

function WiggleComponent() {
  const { config } = useTuelConfig();
  const wiggle = config.customPresets?.wiggle;

  return (
    <motion.div {...wiggle}>
      Wiggle!
    </motion.div>
  );
}
```

### Responsive Configuration

```tsx
import { useTuelConfig } from '@tuel/config';
import { useMediaQuery } from 'react-responsive';

function ResponsiveAnimation() {
  const { updateConfig } = useTuelConfig();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    updateConfig({
      animationDuration: isMobile ? 'fast' : 'normal',
    });
  }, [isMobile]);

  return <div>Animations adapt to screen size</div>;
}
```

### Respecting User Preferences

```tsx
import { TuelConfigProvider } from '@tuel/config';
import { useEffect, useState } from 'react';

function App() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <TuelConfigProvider
      config={{
        reducedMotion,
      }}
    >
      <YourApp />
    </TuelConfigProvider>
  );
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  TuelConfig,
  AnimationPreset,
  ThemeConfig,
  ThemeVariant,
} from '@tuel/config';
```

## Best Practices

1. **Wrap your app** with `TuelConfigProvider` at the root level
2. **Use presets** for consistent animations across components
3. **Respect user preferences** for reduced motion
4. **Theme consistently** using the theme system
5. **Type everything** leverage TypeScript for better DX

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with React 18+ support

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/config)
- [Examples](https://tuel.ai/examples/config)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/config)
