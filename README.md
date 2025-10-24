# 🎨 TUEL Animation Library

**The professional animation library for React developers**

[![NPM Packages](https://img.shields.io/badge/npm-13%20packages-brightgreen)](https://www.npmjs.com/search?q=%40tuel)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)
[![Demo](https://img.shields.io/badge/demo-live-success)](https://tuel-animation.vercel.app)
[![Status](https://img.shields.io/badge/status-alpha-yellow)](PROGRESS.md)

Transform your React applications with beautiful, performant animations. TUEL provides a comprehensive suite of animation components built on industry-standard libraries like GSAP, Framer Motion, and Three.js.

> ⚠️ **Development Notice**: TUEL is currently in early alpha development (v0.2.0). All 13 packages are functional but undergoing active improvements including security hardening, test coverage expansion (target: 80%+), and CI/CD optimizations. See [PROGRESS.md](PROGRESS.md) for detailed status and roadmap.

🚀 **[View Live Demo](https://tuel-animation.vercel.app)** | 📚 **[Documentation](https://tuel-lib.vercel.app)** | 📦 **[NPM Packages](https://www.npmjs.com/search?q=%40tuel)**

## ✨ Features

- 🚀 **High Performance** - GPU-accelerated animations at 60fps
- 📦 **13 Packages** - Modular architecture, install only what you need
- 🎨 **Beautiful Defaults** - Professional animations out of the box
- ♿ **Accessible** - Respects `prefers-reduced-motion` and WCAG guidelines
- 📱 **Responsive** - Mobile-first design with touch support
- 🔧 **TypeScript** - Fully typed for excellent DX
- 🌳 **Tree-shakeable** - Minimal bundle impact

## 📦 Quick Start

```bash
# Install core animation packages
npm install @tuel/scroll @tuel/text-effects @tuel/gallery

# Or with pnpm
pnpm add @tuel/scroll @tuel/text-effects @tuel/gallery

# Or with yarn
yarn add @tuel/scroll @tuel/text-effects @tuel/gallery
```

## 🎭 Simple Example

```tsx
import { HorizontalScroll } from '@tuel/scroll';
import { AnimatedText } from '@tuel/text-effects';
import { ImageGallery } from '@tuel/gallery';

function MyApp() {
  const images = [
    { src: '/img1.jpg', alt: 'Image 1' },
    { src: '/img2.jpg', alt: 'Image 2' },
  ];

  return (
    <div>
      <AnimatedText
        text="Beautiful typography animations"
        animation="fadeIn"
        splitBy="word"
        stagger={0.1}
      />

      <HorizontalScroll speed={1.2} pin={true}>
        <Card>Slide 1</Card>
        <Card>Slide 2</Card>
        <Card>Slide 3</Card>
      </HorizontalScroll>

      <ImageGallery
        images={images}
        columns={3}
        lightbox={true}
      />
    </div>
  );
}
```

## 📦 Complete Package Ecosystem

| Package              | Description                         | Size    | npm                                                                                                             |
| -------------------- | ----------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| [@tuel/motion]       | Motion primitives & animations      | 6.9 kB  | [![npm](https://img.shields.io/npm/v/@tuel/motion.svg)](https://www.npmjs.com/package/@tuel/motion)             |
| [@tuel/scroll]       | Scroll-triggered animations         | 37.7 kB | [![npm](https://img.shields.io/npm/v/@tuel/scroll.svg)](https://www.npmjs.com/package/@tuel/scroll)             |
| [@tuel/gallery]      | Interactive image & video galleries | 49.9 kB | [![npm](https://img.shields.io/npm/v/@tuel/gallery.svg)](https://www.npmjs.com/package/@tuel/gallery)           |
| [@tuel/text-effects] | Typography animations               | 7.2 kB  | [![npm](https://img.shields.io/npm/v/@tuel/text-effects.svg)](https://www.npmjs.com/package/@tuel/text-effects) |
| [@tuel/ui]           | Pre-built UI animation components   | 6.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/ui.svg)](https://www.npmjs.com/package/@tuel/ui)                     |
| [@tuel/interaction]  | Mouse, touch & gesture interactions | 6.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/interaction.svg)](https://www.npmjs.com/package/@tuel/interaction)   |
| [@tuel/gsap]         | GSAP integration utilities          | 1.8 kB  | [![npm](https://img.shields.io/npm/v/@tuel/gsap.svg)](https://www.npmjs.com/package/@tuel/gsap)                 |
| [@tuel/three]        | Three.js 3D components              | 4.5 kB  | [![npm](https://img.shields.io/npm/v/@tuel/three.svg)](https://www.npmjs.com/package/@tuel/three)               |
| [@tuel/performance]  | Performance optimization hooks      | 6.4 kB  | [![npm](https://img.shields.io/npm/v/@tuel/performance.svg)](https://www.npmjs.com/package/@tuel/performance)   |
| [@tuel/state]        | Animation state management          | 6.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/state.svg)](https://www.npmjs.com/package/@tuel/state)               |
| [@tuel/config]       | Configuration system & presets      | 2.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/config.svg)](https://www.npmjs.com/package/@tuel/config)             |
| [@tuel/tokens]       | Design tokens & theme system        | 4.8 kB  | [![npm](https://img.shields.io/npm/v/@tuel/tokens.svg)](https://www.npmjs.com/package/@tuel/tokens)             |
| [@tuel/utils]        | Core utilities                      | 1.4 kB  | [![npm](https://img.shields.io/npm/v/@tuel/utils.svg)](https://www.npmjs.com/package/@tuel/utils)               |

[@tuel/motion]: ./packages/motion
[@tuel/scroll]: ./packages/scroll
[@tuel/gallery]: ./packages/gallery
[@tuel/text-effects]: ./packages/text-effects
[@tuel/ui]: ./packages/ui
[@tuel/interaction]: ./packages/interaction
[@tuel/gsap]: ./packages/gsap
[@tuel/three]: ./packages/three
[@tuel/performance]: ./packages/performance
[@tuel/state]: ./packages/state
[@tuel/config]: ./packages/config
[@tuel/tokens]: ./packages/tokens
[@tuel/utils]: ./packages/utils

## 🛠 Development

This repository contains the complete TUEL animation library monorepo.

### Tech Stack

- **TypeScript 5** - Type-safe animation development
- **React 19** - Latest React features and optimizations
- **Next.js 16** - Framework for demo application
- **Turborepo 2.5** - High-performance build system
- **pnpm 10.14** - Fast, disk space efficient package manager
- **Vitest 2.x** - Unit testing with React Testing Library
- **Playwright 1.56** - Cross-browser E2E testing
- **ESLint 9** - Flat config linting (lenient mode for development)

### CI/CD Status

✅ **Optimized Pipeline** - Simplified to 5-minute builds for cost efficiency:

- **Type Checking**: Strict TypeScript validation (blocking)
- **Build**: All 13 packages compile successfully (blocking)
- **Linting**: 0 errors, 788 warnings (non-blocking, development-friendly)
- **Testing**: 204/224 tests passing (non-blocking, improvements ongoing)
- **Security Audit**: 1 low severity issue (non-blocking)

The CI/CD pipeline prioritizes fast feedback and cost efficiency. Only critical quality gates (typecheck + build) are blocking to enable rapid iteration.

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

# Run tests
pnpm test

# Run type checking
pnpm typecheck

# Lint code
pnpm lint
```

### Project Structure

```plaintext
tuel/
├── packages/           # 13 animation library packages
│   ├── motion/        # Motion primitives
│   ├── scroll/        # Scroll animations
│   ├── gallery/       # Gallery components
│   ├── text-effects/  # Text animations
│   ├── ui/            # UI components
│   ├── interaction/   # Interaction utilities
│   ├── gsap/          # GSAP integration
│   ├── three/         # Three.js components
│   ├── performance/   # Performance utilities
│   ├── state/         # State management
│   ├── config/        # Configuration system
│   ├── tokens/        # Design tokens
│   └── utils/         # Core utilities
├── src/               # Demo application (Next.js 16)
├── .github/           # CI/CD workflows
└── scripts/           # Build and automation scripts
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 📚 Documentation

Each package has comprehensive documentation in its README:

- **Getting Started** - Installation and quick start examples
- **API Reference** - Complete API documentation
- **Usage Examples** - Real-world use cases
- **TypeScript Support** - Type definitions and usage

Visit [tuel.ai/docs](https://tuel.ai/docs) for complete documentation.

## 🤝 Contributing

We welcome contributions! TUEL is in active alpha development and community input is valuable. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow (simplified CI/CD for faster iterations)
- Submitting pull requests
- Coding standards (lenient ESLint configuration)
- Testing requirements (non-blocking tests for easier contribution)

### Quick Contribution Guide

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tuel.git`
3. Install dependencies: `pnpm install`
4. Build packages: `pnpm build`
5. Make your changes
6. Run typecheck: `pnpm typecheck` (must pass)
7. Run build: `pnpm build` (must pass)
8. Submit a pull request

**Note**: Lint warnings and test failures won't block your PR. We prioritize contributor experience while maintaining core quality standards.

## 📊 Project Status

### Current (v0.2.0)

- ✅ 13 packages published to npm (all at v0.2.0)
- ✅ Full TypeScript support across all packages
- ✅ Optimized CI/CD pipeline (~5 minutes, cost-efficient)
- ✅ Core functionality working and production-ready
- ✅ Live demo application on Vercel
- ✅ Comprehensive package documentation
- 🔄 Security improvements in progress
- 🔄 Test coverage expansion (current: ~20%, target: 80%+)
- 🔄 Performance monitoring and optimization

### Roadmap to v1.0.0

- 🎯 Security hardening (XSS prevention, input sanitization)
- 🎯 Achieve 80%+ test coverage across all packages
- 🎯 Performance benchmarks and optimizations
- 🎯 Enhanced accessibility (WCAG 2.1 AA compliance)
- 🎯 Bundle size analysis and reduction
- 🎯 Improved API documentation with interactive examples
- 🎯 Community contribution guidelines
- 🎯 Storybook integration for component development

See [PROGRESS.md](PROGRESS.md) for detailed phase-by-phase status and weekly updates.

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/omerakben/tuel/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/omerakben/tuel/discussions)
- **Security**: See [SECURITY.md](SECURITY.md) for responsible disclosure

## 📄 License

MIT © [Omer Akben](https://github.com/omerakben)

See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

TUEL is built on the shoulders of giants:

- [GSAP](https://greensock.com/gsap/) - Professional-grade animation
- [Framer Motion](https://www.framer.com/motion/) - Motion library for React
- [Three.js](https://threejs.org/) - 3D graphics library
- [React](https://react.dev/) - UI library

## 🔗 Links

- **Website**: [tuel.ai](https://tuel.ai)
- **Documentation**: [tuel.ai/docs](https://tuel.ai/docs)
- **Demo**: [tuel-animation.vercel.app](https://tuel-animation.vercel.app)
- **npm**: [npmjs.com/search?q=@tuel](https://www.npmjs.com/search?q=%40tuel)
- **GitHub**: [github.com/omerakben/tuel](https://github.com/omerakben/tuel)

---

**Made with ❤️ by [Omer Akben](https://omerakben.com)**
