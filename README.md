# 🎨 TUEL Animation Library

> **The professional animation library for React developers**

[![NPM Packages](https://img.shields.io/badge/npm-13%20packages-brightgreen)](https://www.npmjs.com/search?q=%40tuel)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)
[![Demo](https://img.shields.io/badge/demo-live-success)](https://tuel-animation.vercel.app)

**Transform your React applications with beautiful, performant animations**

🚀 **[View Live Demo](https://tuel-animation.vercel.app)** | 📚 **[Documentation](https://tuel-lib.vercel.app)** | 📦 **[NPM Packages](https://www.npmjs.com/search?q=%40tuel)**

## ✨ Quick Start

```bash
# Install core animation packages
npm install @tuel/motion @tuel/scroll @tuel/gallery

# Or install specific packages you need
npm install @tuel/text-effects @tuel/ui @tuel/interaction
npm install @tuel/gsap @tuel/three @tuel/performance
```

## 🎭 Simple, Powerful Animations

```tsx
import { HorizontalScroll } from '@tuel/scroll';
import { TextReveal } from '@tuel/text-effects';
import { InteractiveGallery } from '@tuel/gallery';

function MyApp() {
  return (
    <div>
      <TextReveal effect="splitWords" stagger={0.1}>
        Beautiful typography animations
      </TextReveal>

      <HorizontalScroll speed={1.2} pin={true}>
        <Card>Slide 1</Card>
        <Card>Slide 2</Card>
        <Card>Slide 3</Card>
      </HorizontalScroll>

      <InteractiveGallery
        images={images}
        layout="masonry"
        hover="zoom"
      />
    </div>
  );
}
```

## 📦 Complete Package Ecosystem

| Package              | Description                      | Size    |
| -------------------- | -------------------------------- | ------- |
| `@tuel/motion`       | Motion primitives and animations | 6.9 kB  |
| `@tuel/scroll`       | Scroll-triggered animations      | 37.7 kB |
| `@tuel/gallery`      | Interactive image galleries      | 49.9 kB |
| `@tuel/text-effects` | Typography animations            | 7.2 kB  |
| `@tuel/ui`           | UI animation components          | 6.0 kB  |
| `@tuel/interaction`  | Interactive elements             | 6.0 kB  |
| `@tuel/gsap`         | GSAP integration utilities       | 1.8 kB  |
| `@tuel/three`        | Three.js animation helpers       | 4.5 kB  |
| `@tuel/performance`  | Performance optimization         | 6.4 kB  |
| `@tuel/state`        | Animation state management       | 6.0 kB  |
| `@tuel/config`       | Configuration system             | 2.0 kB  |
| `@tuel/tokens`       | Design tokens                    | 4.8 kB  |
| `@tuel/utils`        | Core utilities                   | 1.4 kB  |

## 🛠 Development

This repository contains the complete TUEL animation library monorepo built with:

- **TypeScript 5** - Type-safe animation development
- **React 19** - Latest React features and optimizations
- **Turborepo** - High-performance build system
- **Next.js 15** - Demo application framework

### Local Development

```bash
# Clone the repository
git clone https://github.com/omerakben/tuel.git
cd tuel

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the demo application
pnpm dev
```
