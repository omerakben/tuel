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
