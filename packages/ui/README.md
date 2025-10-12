# @tuel/ui

Pre-built animated UI components for React. Beautiful, accessible, and ready to use.

[![npm version](https://img.shields.io/npm/v/@tuel/ui.svg)](https://www.npmjs.com/package/@tuel/ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Pre-built Components** - Ready-to-use animated UI elements
- 🚀 **High Performance** - Optimized animations with GSAP and Framer Motion
- ♿ **Accessible** - WCAG compliant with keyboard navigation
- 📱 **Responsive** - Mobile-first design
- 🎭 **Customizable** - Flexible styling and configuration
- 🌳 **Tree-shakeable** - Import only what you need

## Installation

```bash
pnpm add @tuel/ui

# Peer dependencies
pnpm add react react-dom
```

## Components

### AnimatedMenu

Animated navigation menu with smooth transitions.

```tsx
import { AnimatedMenu } from '@tuel/ui';

const items = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function Navigation() {
  return (
    <AnimatedMenu
      items={items}
      variant="slide"
      animation="fadeIn"
    />
  );
}
```

### Carousel

Smooth sliding carousel component.

```tsx
import { Carousel } from '@tuel/ui';

const slides = [
  <div key="1">Slide 1</div>,
  <div key="2">Slide 2</div>,
  <div key="3">Slide 3</div>,
];

function ImageCarousel() {
  return (
    <Carousel
      slides={slides}
      autoplay={true}
      interval={5000}
    />
  );
}
```

### ImageGallery

Responsive image gallery with lightbox.

```tsx
import { ImageGallery } from '@tuel/ui';

const images = [
  { src: '/img1.jpg', alt: 'Image 1' },
  { src: '/img2.jpg', alt: 'Image 2' },
];

function Gallery() {
  return (
    <ImageGallery
      images={images}
      columns={3}
      gap={16}
    />
  );
}
```

### StickyCards

Cards that stick during scroll.

```tsx
import { StickyCards } from '@tuel/ui';

const cards = [
  { title: 'Card 1', content: 'Content 1' },
  { title: 'Card 2', content: 'Content 2' },
];

function CardStack() {
  return (
    <StickyCards
      cards={cards}
      gap={20}
      stickyOffset={100}
    />
  );
}
```

### AnimatedButton

Button with built-in hover and tap animations.

```tsx
import { AnimatedButton } from '@tuel/ui';

function CTA() {
  return (
    <AnimatedButton
      variant="primary"
      animation="scale"
      onClick={() => console.log('Clicked')}
    >
      Get Started
    </AnimatedButton>
  );
}
```

### Modal

Animated modal with backdrop.

```tsx
import { Modal } from '@tuel/ui';
import { useState } from 'react';

function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        animation="fadeIn"
      >
        <h2>Modal Content</h2>
        <p>This is a modal</p>
      </Modal>
    </>
  );
}
```

## Usage Examples

### Hero Section

```tsx
import { AnimatedText, AnimatedButton } from '@tuel/ui';

function Hero() {
  return (
    <section className="hero">
      <AnimatedText
        text="Welcome to TUEL"
        animation="fadeIn"
        delay={0.2}
      />
      <AnimatedButton
        variant="primary"
        animation="bounce"
      >
        Get Started
      </AnimatedButton>
    </section>
  );
}
```

### Navigation Menu

```tsx
import { AnimatedMenu } from '@tuel/ui';

function Header() {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header>
      <AnimatedMenu
        items={menuItems}
        variant="fade"
        orientation="horizontal"
      />
    </header>
  );
}
```

### Card Grid

```tsx
import { StickyCards } from '@tuel/ui';

function Features() {
  const features = [
    {
      title: 'Fast',
      content: 'Optimized performance',
      icon: '⚡',
    },
    {
      title: 'Beautiful',
      content: 'Stunning animations',
      icon: '✨',
    },
    {
      title: 'Accessible',
      content: 'WCAG compliant',
      icon: '♿',
    },
  ];

  return (
    <StickyCards
      cards={features}
      columns={3}
      gap={24}
    />
  );
}
```

### Image Gallery with Lightbox

```tsx
import { ImageGallery } from '@tuel/ui';

function PhotoGallery() {
  const photos = [
    { src: '/photo1.jpg', alt: 'Photo 1', title: 'Sunset' },
    { src: '/photo2.jpg', alt: 'Photo 2', title: 'Mountain' },
    { src: '/photo3.jpg', alt: 'Photo 3', title: 'Ocean' },
  ];

  return (
    <ImageGallery
      images={photos}
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap={20}
      lightbox={true}
    />
  );
}
```

## Styling

All components accept a `className` prop for custom styling:

```tsx
<AnimatedButton className="custom-button">
  Click me
</AnimatedButton>
```

## Accessibility

- Keyboard navigation (Tab, Enter, Esc)
- ARIA labels and roles
- Focus management
- Screen reader support
- Reduced motion support

## TypeScript Support

Full TypeScript support:

```typescript
import type {
  AnimatedMenuProps,
  CarouselProps,
  ImageGalleryProps,
} from '@tuel/ui';
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © [Omer Akben](https://github.com/omerakben)

## Links

- [Documentation](https://tuel.ai/docs/ui)
- [Examples](https://tuel.ai/examples/ui)
- [GitHub](https://github.com/omerakben/tuel)
- [npm](https://www.npmjs.com/package/@tuel/ui)
