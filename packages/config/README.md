# @tuel/config

Advanced configuration patterns, animation presets, and settings management for TUEL animation library.

## Installation

```bash
npm install @tuel/config
# or
yarn add @tuel/config
# or
pnpm add @tuel/config
```

## Features

- 🎨 **Theme System** - Light/dark themes with customizable configurations
- ⚡ **Animation Presets** - 26+ pre-built animation patterns (entrance, exit, attention, hover)
- 🔧 **Configuration Provider** - Global settings management with React Context
- 💾 **Persistence** - Optional localStorage support for user preferences
- ♿ **Accessibility** - Automatic reduced motion detection
- 🌓 **Auto Theme Detection** - System preference detection for light/dark mode
- 📦 **SSR Safe** - Works seamlessly with server-side rendering

## Quick Start

### Configuration Provider

Wrap your app with `TuelConfigProvider` to enable global configuration:

```tsx
import { TuelConfigProvider } from '@tuel/config';

function App() {
  return (
    <TuelConfigProvider
      initialConfig={{
        globalDuration: 300,
        theme: 'auto',
        enableDebug: false,
      }}
      persistConfig={true}
    >
      <YourApp />
    </TuelConfigProvider>
  );
}
```

### Using Configuration

Access configuration values in any component:

```tsx
import { useTuelConfig, useAnimationConfig } from '@tuel/config';

function MyComponent() {
  const { config, updateConfig } = useTuelConfig();
  const animConfig = useAnimationConfig();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{
        duration: animConfig.duration / 1000,
        ease: animConfig.ease,
      }}
    >
      Content
    </motion.div>
  );
}
```

## API Reference

### TuelConfigProvider

Main configuration provider component.

**Props:**

```tsx
interface TuelConfigProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<TuelConfig>;
  persistConfig?: boolean; // Default: true
  storageKey?: string; // Default: 'tuel-config'
}
```

**Example:**

```tsx
<TuelConfigProvider
  initialConfig={{
    globalDuration: 500,
    globalEase: [0.25, 0.46, 0.45, 0.94],
    theme: 'dark',
    enableOptimizations: true,
  }}
  persistConfig={true}
  storageKey="my-app-tuel-config"
>
  <App />
</TuelConfigProvider>
```

### Configuration Options

```tsx
interface TuelConfig {
  // Animation settings
  globalDuration: number; // Default: 300ms
  globalEase: string | number[]; // Default: 'easeInOut'
  reducedMotion: boolean; // Auto-detected

  // Performance settings
  enableFrameControl: boolean; // Default: true
  targetFPS: number; // Default: 60
  enableOptimizations: boolean; // Default: true

  // Theme settings
  theme: 'light' | 'dark' | 'auto'; // Default: 'auto'
  colorScheme: Record<string, string>;

  // Debug settings
  enableDebug: boolean; // Default: false
  showPerformanceMetrics: boolean; // Default: false
  logAnimations: boolean; // Default: false

  // Custom settings
  custom: Record<string, any>;
}
```

### Hooks

#### `useTuelConfig()`

Access and modify configuration:

```tsx
const { config, updateConfig, resetConfig, getConfigValue, setConfigValue } = useTuelConfig();

// Update multiple values
updateConfig({
  globalDuration: 500,
  theme: 'dark',
});

// Update single value
setConfigValue('globalDuration', 400);

// Get single value
const duration = getConfigValue('globalDuration');

// Reset to defaults
resetConfig();
```

#### `useAnimationConfig()`

Get animation-specific configuration with reduced motion support:

```tsx
const { duration, ease, reducedMotion, shouldAnimate } = useAnimationConfig();

// Use in animations
<motion.div
  animate={{ x: shouldAnimate ? 100 : 0 }}
  transition={{ duration: duration / 1000, ease }}
/>
```

#### `useConfigValue<K>(key: K)`

Get a specific configuration value with type safety:

```tsx
const duration = useConfigValue('globalDuration'); // number
const theme = useConfigValue('theme'); // 'light' | 'dark' | 'auto'
```

## Theme System

### Using Built-in Themes

```tsx
import { useTheme, useThemeAnimation } from '@tuel/config';

function ThemedComponent() {
  // Get theme configuration
  const theme = useTheme('modern', 'dark');
  
  // Get theme animation helpers
  const anim = useThemeAnimation(theme);

  return (
    <motion.div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
      }}
      animate={{ opacity: 1 }}
      transition={{
        duration: anim.duration('normal') / 1000,
        ease: anim.easing('easeOut'),
      }}
    >
      Content
    </motion.div>
  );
}
```

### Built-in Themes

- **modern** - Contemporary design with vibrant colors
- **minimal** - Clean, minimal aesthetic with subtle animations

Each theme includes light and dark variants.

### Theme Configuration

```tsx
interface ThemeConfig {
  name: string;
  colors: Record<string, string>;
  animations: {
    duration: { fast: 150, normal: 300, slow: 500, slower: 750 };
    easing: Record<string, string | number[]>;
    timing: { stagger: number, delay: number };
  };
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  shadows: Record<string, string>;
}
```

### Creating Custom Themes

```tsx
import { createTheme } from '@tuel/config';

const customTheme = createTheme('modern', {
  light: {
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
    },
    animations: {
      duration: {
        fast: 100,
        normal: 250,
      },
    },
  },
  dark: {
    colors: {
      primary: '#ff8787',
      secondary: '#5fd9cf',
      accent: '#ffef9f',
    },
  },
});

// Use custom theme
const theme = customTheme.light;
```

## Animation Presets

### Available Presets

#### Entrance Animations (10)
- `fadeIn` - Gentle fade in
- `slideInUp` - Slide from bottom
- `slideInDown` - Slide from top
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right
- `scaleIn` - Scale up
- `rotateIn` - Rotate in
- `bounceIn` - Bounce in with elastic effect
- `zoomIn` - Zoom in with scale
- `flipIn` - 3D flip in

#### Exit Animations (10)
- `fadeOut` - Gentle fade out
- `slideOutUp` - Slide to top
- `slideOutDown` - Slide to bottom
- `slideOutLeft` - Slide to left
- `slideOutRight` - Slide to right
- `scaleOut` - Scale down
- `rotateOut` - Rotate out
- `bounceOut` - Bounce out
- `zoomOut` - Zoom out with scale
- `flipOut` - 3D flip out

#### Attention Animations (8)
- `pulse` - Pulsing scale effect
- `shake` - Horizontal shake
- `wobble` - Rotating wobble
- `flash` - Opacity flash
- `bounce` - Vertical bounce
- `swing` - Pendulum swing
- `rubberBand` - Elastic stretch
- `jello` - Jello-like wobble

#### Hover Animations (6)
- `lift` - Lift up on hover
- `grow` - Grow on hover
- `shrink` - Shrink on hover
- `tilt` - Slight tilt on hover
- `glow` - Glow effect on hover
- `float` - Continuous floating

### Using Animation Presets

```tsx
import { animationPresets, getPreset } from '@tuel/config';
import { motion } from 'framer-motion';

function AnimatedCard() {
  const fadeIn = getPreset('fadeIn');
  const lift = getPreset('lift');

  return (
    <motion.div
      initial={fadeIn.variants.initial}
      animate={fadeIn.variants.animate}
      exit={fadeIn.variants.exit}
      whileHover={lift.variants.hover}
      transition={{
        duration: fadeIn.duration / 1000,
        ease: fadeIn.ease,
      }}
    >
      Card Content
    </motion.div>
  );
}
```

### Getting Presets by Category

```tsx
import { getPresetsByCategory } from '@tuel/config';

// Get all entrance animations
const entranceAnimations = getPresetsByCategory('entrance');

// Get all hover effects
const hoverEffects = getPresetsByCategory('hover');
```

### Creating Custom Presets

```tsx
import { createCustomPreset, getPreset } from '@tuel/config';

const customFadeIn = createCustomPreset('fadeIn', {
  duration: 800,
  ease: [0.25, 0.46, 0.45, 0.94],
  variants: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
});
```

### Preset Structure

```tsx
interface AnimationPreset {
  name: string;
  description?: string;
  duration: number; // in milliseconds
  ease: string | number[]; // CSS easing or cubic bezier array
  delay?: number;
  variants?: Record<string, any>; // Framer Motion variants
  options?: Record<string, any>;
}
```

## Advanced Examples

### Responsive Animation Duration

```tsx
import { useTuelConfig } from '@tuel/config';

function ResponsiveAnimation() {
  const { config } = useTuelConfig();
  const isMobile = window.innerWidth < 768;

  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{
        duration: (config.globalDuration * (isMobile ? 0.7 : 1)) / 1000,
      }}
    />
  );
}
```

### Debug Mode

```tsx
import { useTuelConfig } from '@tuel/config';

function DebugPanel() {
  const { config, updateConfig } = useTuelConfig();

  return (
    <div>
      <button onClick={() => updateConfig({ enableDebug: !config.enableDebug })}>
        Toggle Debug: {config.enableDebug ? 'ON' : 'OFF'}
      </button>
      
      {config.enableDebug && (
        <pre>{JSON.stringify(config, null, 2)}</pre>
      )}
    </div>
  );
}
```

### Conditional Animation Based on Config

```tsx
import { useAnimationConfig } from '@tuel/config';

function ConditionalAnimation() {
  const { shouldAnimate, duration } = useAnimationConfig();

  return (
    <motion.div
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={{ duration: duration / 1000 }}
    >
      {shouldAnimate ? 'Animated!' : 'Static (reduced motion)'}
    </motion.div>
  );
}
```

### HOC for Config-Aware Components

```tsx
import { withTuelConfig } from '@tuel/config';

function MyComponent({ duration, ease, reducedMotion }) {
  return (
    <motion.div
      animate={{ scale: reducedMotion ? 1 : 1.2 }}
      transition={{ duration: duration / 1000, ease }}
    >
      Content
    </motion.div>
  );
}

export default withTuelConfig(MyComponent);
```

## TypeScript Support

Full TypeScript support with strict typing:

```tsx
import type {
  TuelConfig,
  TuelConfigContextValue,
  ThemeConfig,
  ThemeVariant,
  AnimationPreset,
  AnimationPresets,
} from '@tuel/config';

// Type-safe configuration
const config: Partial<TuelConfig> = {
  globalDuration: 300,
  theme: 'dark',
};

// Type-safe theme
const theme: ThemeConfig = useTheme('modern', 'light');

// Type-safe preset access
const preset: AnimationPreset = getPreset('fadeIn');
```

## SSR Considerations

The package is SSR-safe and handles server-side rendering gracefully:

- `window` and `localStorage` checks are built-in
- Media queries are only accessed on client-side
- Hydration mismatches are avoided
- All hooks have proper SSR guards

## Performance

- Minimal re-renders with React Context optimization
- Memoized theme configurations
- Efficient localStorage usage
- Optional persistence can be disabled for performance
- Lazy evaluation of animation presets

## Best Practices

1. **Wrap at Root Level**: Place `TuelConfigProvider` as high as possible in your component tree
2. **Use Presets**: Leverage built-in animation presets for consistency
3. **Respect Reduced Motion**: Always check `shouldAnimate` for accessibility
4. **Theme Consistency**: Use theme values instead of hardcoded colors/spacing
5. **Debug in Development**: Enable debug mode during development for insights
6. **Persist User Preferences**: Enable `persistConfig` for better UX

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/config)
- [GitHub](https://github.com/omerakben/tuel)
- [Issues](https://github.com/omerakben/tuel/issues)
