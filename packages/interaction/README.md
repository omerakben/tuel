# @tuel/interaction

Advanced mouse interaction systems, cursor tracking, and gesture control components for React.

[![npm version](https://img.shields.io/npm/v/@tuel/interaction.svg)](https://www.npmjs.com/package/@tuel/interaction)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🖱️ **Cursor Tracking** - Smooth cursor following animations
- 👆 **Gesture Control** - Drag, swipe, and pinch gestures
- 🎯 **Mouse Effects** - Parallax, magnetic, and custom effects
- 🎨 **Custom Cursors** - Animated custom cursor components
- 🚀 **High Performance** - Optimized for 60fps interactions
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/interaction

# Peer dependencies
pnpm add react react-dom framer-motion gsap
```

## Quick Start

```tsx
import { MouseTracker } from '@tuel/interaction';

function App() {
  return (
    <MouseTracker>
      {(position) => (
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          Custom cursor
        </div>
      )}
    </MouseTracker>
  );
}
```

## Components

### MouseTracker

Track mouse position with smooth interpolation.

```tsx
<MouseTracker smoothing={0.15}>
  {(position) => (
    <div style={{ left: position.x, top: position.y }}>
      Cursor
    </div>
  )}
</MouseTracker>
```

### DragContainer

Enable drag interactions with constraints.

```tsx
<DragContainer
  constraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  onDragEnd={(info) => console.log('Dragged:', info)}
>
  <div>Drag me!</div>
</DragContainer>
```

### ParallaxContainer

Create parallax effects based on mouse movement.

```tsx
<ParallaxContainer depth={0.5}>
  <div>Parallax content</div>
</ParallaxContainer>
```

### MagneticButton

Button with magnetic hover effect.

```tsx
<MagneticButton strength={0.5}>
  <button>Hover me</button>
</MagneticButton>
```

## Usage Examples

### Custom Cursor

```tsx
import { MouseTracker, CustomCursor } from '@tuel/interaction';

function CustomCursorExample() {
  return (
    <>
      <CustomCursor size={20} color="#0070f3" />
      <div>Your content here</div>
    </>
  );
}
```

### Draggable Card

```tsx
import { DragContainer } from '@tuel/interaction';

function DraggableCard() {
  return (
    <DragContainer
      constraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      snapBack={true}
    >
      <div className="card">
        Drag me around
      </div>
    </DragContainer>
  );
}
```

### Mouse Parallax

```tsx
import { ParallaxContainer } from '@tuel/interaction';

function ParallaxHero() {
  return (
    <div className="hero">
      <ParallaxContainer depth={0.3}>
        <img src="/bg-layer-1.jpg" alt="Background" />
      </ParallaxContainer>
      <ParallaxContainer depth={0.6}>
        <img src="/bg-layer-2.jpg" alt="Foreground" />
      </ParallaxContainer>
    </div>
  );
}
```

### Magnetic Navigation

```tsx
import { MagneticButton } from '@tuel/interaction';

function Navigation() {
  return (
    <nav>
      {['Home', 'About', 'Contact'].map((item) => (
        <MagneticButton key={item} strength={0.3}>
          <a href={`/${item.toLowerCase()}`}>{item}</a>
        </MagneticButton>
      ))}
    </nav>
  );
}
```

## Hooks

### useMousePosition

Track mouse position in a component.

```tsx
import { useMousePosition } from '@tuel/interaction';

function Component() {
  const { x, y } = useMousePosition();
  return <div>Mouse: {x}, {y}</div>;
}
```

### useGesture

Handle complex gestures.

```tsx
import { useGesture } from '@tuel/interaction';

function Component() {
  const bind = useGesture({
    onDrag: ({ movement: [x, y] }) => {
      console.log('Dragging:', x, y);
    },
    onPinch: ({ offset: [scale] }) => {
      console.log('Pinch scale:', scale);
    },
  });

  return <div {...bind()}>Gesture area</div>;
}
```

## Performance

- Throttled event listeners
- RequestAnimationFrame for smooth animations
- Automatic cleanup on unmount
- Optimized for 60fps

## Accessibility

- Keyboard alternatives for drag interactions
- Respects reduced motion preferences
- Focus management
- Touch device support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Touch devices (iOS, Android)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/interaction)
- [Examples](https://tuel.ai/examples/interaction)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/interaction)
