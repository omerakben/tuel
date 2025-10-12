# @tuel/utils

Essential utilities and helper functions for TUEL animation components.

[![npm version](https://img.shields.io/npm/v/@tuel/utils.svg)](https://www.npmjs.com/package/@tuel/utils)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Lightweight** - Only ~1.4 kB minified
- 🔧 **Type-safe** - Full TypeScript support
- 🌳 **Tree-shakeable** - Import only what you need
- 🚀 **Zero dependencies** - No external runtime dependencies
- 🔄 **SSR Safe** - Works on server and client

## Installation

```bash
pnpm add @tuel/utils
```

## API Reference

### `cn(...classes)`

Utility function for conditional className joining (similar to clsx/classnames).

```typescript
import { cn } from '@tuel/utils';

// Basic usage
cn('base', 'active'); // => 'base active'

// Conditional classes
cn('base', isActive && 'active', isDisabled && 'disabled');
// => 'base active' (when isActive is true)

// With undefined/null/false
cn('base', undefined, null, false, 'valid');
// => 'base valid'

// Practical example
<div className={cn(
  'button',
  isPrimary && 'button--primary',
  isDisabled && 'button--disabled'
)} />
```

### Environment Detection

```typescript
import { isServer, isClient } from '@tuel/utils';

// Server-side rendering check
if (isServer) {
  console.log('Running on server');
}

// Client-side check
if (isClient) {
  console.log('Running in browser');
  window.addEventListener('scroll', handleScroll);
}
```

**Constants:**
- `isServer: boolean` - True when running on server (Node.js)
- `isClient: boolean` - True when running in browser

### `debounce(func, wait)`

Creates a debounced function that delays invoking `func` until after `wait` milliseconds.

```typescript
import { debounce } from '@tuel/utils';

const handleResize = debounce(() => {
  console.log('Window resized');
}, 300);

window.addEventListener('resize', handleResize);
```

**Parameters:**
- `func: Function` - The function to debounce
- `wait: number` - Milliseconds to delay

### `throttle(func, limit)`

Creates a throttled function that only invokes `func` at most once per `limit` milliseconds.

```typescript
import { throttle } from '@tuel/utils';

const handleScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

window.addEventListener('scroll', handleScroll);
```

**Parameters:**
- `func: Function` - The function to throttle
- `limit: number` - Milliseconds to throttle invocations

### `clamp(value, min, max)`

Clamps a number between minimum and maximum values.

```typescript
import { clamp } from '@tuel/utils';

clamp(5, 0, 10);   // => 5
clamp(-5, 0, 10);  // => 0
clamp(15, 0, 10);  // => 10
```

**Parameters:**
- `value: number` - Number to clamp
- `min: number` - Minimum value
- `max: number` - Maximum value

### `lerp(start, end, t)`

Performs linear interpolation between two values.

```typescript
import { lerp } from '@tuel/utils';

lerp(0, 100, 0.5);   // => 50
lerp(0, 100, 0.25);  // => 25
lerp(10, 20, 0.75);  // => 17.5
```

**Parameters:**
- `start: number` - Start value
- `end: number` - End value
- `t: number` - Interpolation factor (typically 0-1)

### `range(start, end, step?)`

Creates an array of numbers from start to end (inclusive).

```typescript
import { range } from '@tuel/utils';

range(1, 5);       // => [1, 2, 3, 4, 5]
range(0, 10, 2);   // => [0, 2, 4, 6, 8, 10]
range(5, 1, -1);   // => [5, 4, 3, 2, 1]
```

**Parameters:**
- `start: number` - Start value
- `end: number` - End value (inclusive)
- `step?: number` - Step increment (default: 1)

## Usage Examples

### React Component with Conditional Classes

```tsx
import { cn } from '@tuel/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

function Button({ variant = 'primary', size = 'md', disabled, className }: ButtonProps) {
  return (
    <button
      className={cn(
        'button',
        `button--${variant}`,
        `button--${size}`,
        disabled && 'button--disabled',
        className
      )}
      disabled={disabled}
    >
      Click me
    </button>
  );
}
```

### SSR-Safe Component

```tsx
import { isClient } from '@tuel/utils';
import { useEffect, useState } from 'react';

function ScrollIndicator() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll position: {scrollY}px</div>;
}
```

## TypeScript Support

All utilities are fully typed and provide IntelliSense support:

```typescript
import type { ClassValue } from '@tuel/utils';

// ClassValue type definition
type ClassValue = string | undefined | null | false;

// Usage with custom utility
function myClassHelper(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
```

## Bundle Size

- **Minified**: ~0.3 kB
- **Gzipped**: ~0.2 kB

Perfect for size-conscious applications.

## Browser Support

- All modern browsers (ES2015+)
- Node.js 18+
- SSR frameworks (Next.js, Remix, etc.)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/utils)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/utils)
