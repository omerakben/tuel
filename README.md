<div align="center">

# 🎨 TUEL Animation Library

**The professional animation library for React developers**

<p align="center">
  <a href="https://www.npmjs.com/search?q=%40tuel"><img src="https://img.shields.io/badge/npm-13%20packages-brightgreen" alt="NPM Packages"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript"></a>
  <a href="https://tuel-animation.vercel.app"><img src="https://img.shields.io/badge/demo-live-success" alt="Demo"></a>
  <a href="PROGRESS.md"><img src="https://img.shields.io/badge/status-alpha-yellow" alt="Status"></a>
</p>

<p align="center">
  Transform your React applications with beautiful, performant animations.<br/>
  TUEL provides a comprehensive suite of animation components built on industry-standard libraries like GSAP, Framer Motion, and Three.js.
</p>

<p align="center">
  <strong>
    <a href="https://tuel-animation.vercel.app">🚀 View Live Demo</a> •
    <a href="https://tuel-lib.vercel.app">📚 Documentation</a> •
    <a href="https://www.npmjs.com/search?q=%40tuel">📦 NPM Packages</a>
  </strong>
</p>

</div>

<br/>

> [!WARNING]
> **Development Notice**: TUEL is currently in early alpha development (v0.2.0). All 13 packages are functional but undergoing active improvements including security hardening, test coverage expansion (target: 80%+), and CI/CD optimizations. See [PROGRESS.md](PROGRESS.md) for detailed status and roadmap.

<br/>

---

## � Table of Contents

- [🎨 TUEL Animation Library](#-tuel-animation-library)
  - [� Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [📦 Quick Start](#-quick-start)
  - [🎭 Simple Example](#-simple-example)
  - [📦 Complete Package Ecosystem](#-complete-package-ecosystem)
  - [🛠 Development](#-development)
    - [🔧 Tech Stack](#-tech-stack)
    - [⚡ CI/CD Status](#-cicd-status)
    - [📦 Local Development](#-local-development)
    - [📁 Project Structure](#-project-structure)
  - [🧪 Testing](#-testing)
  - [📚 Documentation](#-documentation)
  - [🤝 Contributing](#-contributing)
    - [Getting Started](#getting-started)
    - [💡 Contribution Philosophy](#-contribution-philosophy)
    - [📚 Full Guidelines](#-full-guidelines)
  - [📊 Project Status](#-project-status)
    - [Current Release: v0.2.0 (Alpha)](#current-release-v020-alpha)
  - [🐛 Issues \& Support](#-issues--support)
  - [📄 License](#-license)
  - [🙏 Acknowledgments](#-acknowledgments)
  - [🔗 Links](#-links)

---

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

<details open>
<summary><strong>📚 Click to view all 13 packages</strong></summary>

<br/>

| Package                  | Description                         | Size    | Version                                                                                                         |
| ------------------------ | ----------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| **[@tuel/motion]**       | Motion primitives & animations      | 6.9 kB  | [![npm](https://img.shields.io/npm/v/@tuel/motion.svg)](https://www.npmjs.com/package/@tuel/motion)             |
| **[@tuel/scroll]**       | Scroll-triggered animations         | 37.7 kB | [![npm](https://img.shields.io/npm/v/@tuel/scroll.svg)](https://www.npmjs.com/package/@tuel/scroll)             |
| **[@tuel/gallery]**      | Interactive image & video galleries | 49.9 kB | [![npm](https://img.shields.io/npm/v/@tuel/gallery.svg)](https://www.npmjs.com/package/@tuel/gallery)           |
| **[@tuel/text-effects]** | Typography animations               | 7.2 kB  | [![npm](https://img.shields.io/npm/v/@tuel/text-effects.svg)](https://www.npmjs.com/package/@tuel/text-effects) |
| **[@tuel/ui]**           | Pre-built UI animation components   | 6.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/ui.svg)](https://www.npmjs.com/package/@tuel/ui)                     |
| **[@tuel/interaction]**  | Mouse, touch & gesture interactions | 6.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/interaction.svg)](https://www.npmjs.com/package/@tuel/interaction)   |
| **[@tuel/gsap]**         | GSAP integration utilities          | 1.8 kB  | [![npm](https://img.shields.io/npm/v/@tuel/gsap.svg)](https://www.npmjs.com/package/@tuel/gsap)                 |
| **[@tuel/three]**        | Three.js 3D components              | 4.5 kB  | [![npm](https://img.shields.io/npm/v/@tuel/three.svg)](https://www.npmjs.com/package/@tuel/three)               |
| **[@tuel/performance]**  | Performance optimization hooks      | 6.4 kB  | [![npm](https://img.shields.io/npm/v/@tuel/performance.svg)](https://www.npmjs.com/package/@tuel/performance)   |
| **[@tuel/state]**        | Animation state management          | 6.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/state.svg)](https://www.npmjs.com/package/@tuel/state)               |
| **[@tuel/config]**       | Configuration system & presets      | 2.0 kB  | [![npm](https://img.shields.io/npm/v/@tuel/config.svg)](https://www.npmjs.com/package/@tuel/config)             |
| **[@tuel/tokens]**       | Design tokens & theme system        | 4.8 kB  | [![npm](https://img.shields.io/npm/v/@tuel/tokens.svg)](https://www.npmjs.com/package/@tuel/tokens)             |
| **[@tuel/utils]**        | Core utilities                      | 1.4 kB  | [![npm](https://img.shields.io/npm/v/@tuel/utils.svg)](https://www.npmjs.com/package/@tuel/utils)               |

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

</details>

<br/>

---

---

## 🛠 Development

<div align="center">
  <strong>This repository contains the complete TUEL animation library monorepo.</strong>
</div>

<br/>

### 🔧 Tech Stack

<table>
<tr>
<td width="50%">

**Core Technologies**

- 💎 **TypeScript 5** - Type-safe development
- ⚛️ **React 19** - Latest React features
- 🚀 **Next.js 16** - Demo framework
- 📦 **pnpm 10.14** - Package manager

</td>
<td width="50%">

**Development Tools**

- 🏗️ **Turborepo 2.5** - Build system
- 🧪 **Vitest 2.x** - Unit testing
- 🎭 **Playwright 1.56** - E2E testing
- 🔍 **ESLint 9** - Linting (lenient mode)

</td>
</tr>
</table>

### ⚡ CI/CD Status

<details>
<summary><strong>✅ Optimized Pipeline - Simplified to 5-minute builds for cost efficiency</strong></summary>

<br/>

| Quality Gate       | Status         | Details                                       |
| ------------------ | -------------- | --------------------------------------------- |
| **Type Checking**  | 🟢 Blocking     | Strict TypeScript validation                  |
| **Build**          | 🟢 Blocking     | All 13 packages compile successfully          |
| **Linting**        | 🟡 Non-blocking | 0 errors, 788 warnings (development-friendly) |
| **Testing**        | 🟡 Non-blocking | 204/224 tests passing (improvements ongoing)  |
| **Security Audit** | 🟡 Non-blocking | 1 low severity issue                          |

> **Philosophy**: The CI/CD pipeline prioritizes fast feedback and cost efficiency. Only critical quality gates (typecheck + build) are blocking to enable rapid iteration.

</details>

<br/>

### 📦 Local Development

<details>
<summary><strong>💻 Setup Instructions</strong></summary>

<br/>

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

</details>

### 📁 Project Structure

<details>
<summary><strong>🗂️ Repository Layout</strong></summary>

<br/>

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

</details>

<br/>

---

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

---

## 🤝 Contributing

<div align="center">

**We welcome contributions!** TUEL is in active alpha development and community input is valuable.

[![Contributors](https://img.shields.io/github/contributors/omerakben/tuel?style=for-the-badge)](https://github.com/omerakben/tuel/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

</div>

<br/>

<details>
<summary><strong>📋 Quick Contribution Guide</strong></summary>

<br/>

### Getting Started

1. **Fork the repository**
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/tuel.git
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

4. **Build packages**:

   ```bash
   pnpm build
   ```

5. **Make your changes**
6. **Run typecheck** (must pass):

   ```bash
   pnpm typecheck
   ```

7. **Run build** (must pass):

   ```bash
   pnpm build
   ```

8. **Submit a pull request**

### 💡 Contribution Philosophy

> **Note**: Lint warnings and test failures won't block your PR. We prioritize contributor experience while maintaining core quality standards.

### 📚 Full Guidelines

For detailed information, see [CONTRIBUTING.md](CONTRIBUTING.md):

- Code of Conduct
- Development workflow (simplified CI/CD for faster iterations)
- Submitting pull requests
- Coding standards (lenient ESLint configuration)
- Testing requirements (non-blocking tests for easier contribution)

</details>

<br/>

---

---

## 📊 Project Status

<div align="center">

### Current Release: v0.2.0 (Alpha)

![Progress](https://img.shields.io/badge/Progress-Active%20Development-yellow?style=for-the-badge)
![Test Coverage](https://img.shields.io/badge/Coverage-~20%25-orange?style=for-the-badge)
![Packages](https://img.shields.io/badge/Packages-13-brightgreen?style=for-the-badge)

</div>

<br/>

<details open>
<summary><strong>✅ Current Achievements (v0.2.0)</strong></summary>

<br/>

- ✅ **13 packages published to npm** (all at v0.2.0)
- ✅ **Full TypeScript support** across all packages
- ✅ **Optimized CI/CD pipeline** (~5 minutes, cost-efficient)
- ✅ **Core functionality working** and production-ready
- ✅ **Live demo application** on Vercel
- ✅ **Comprehensive package documentation**
- 🔄 **Security improvements** in progress
- 🔄 **Test coverage expansion** (current: ~20%, target: 80%+)
- 🔄 **Performance monitoring** and optimization

</details>

<details>
<summary><strong>🎯 Roadmap to v1.0.0</strong></summary>

<br/>

| Feature                                                 | Status        | Priority |
| ------------------------------------------------------- | ------------- | -------- |
| Security hardening (XSS prevention, input sanitization) | 🔄 In Progress | 🔴 High   |
| 80%+ test coverage across all packages                  | 🔄 In Progress | 🔴 High   |
| Performance benchmarks and optimizations                | 📋 Planned     | 🟡 Medium |
| Enhanced accessibility (WCAG 2.1 AA compliance)         | 📋 Planned     | 🟡 Medium |
| Bundle size analysis and reduction                      | 📋 Planned     | 🟡 Medium |
| Improved API documentation with interactive examples    | 📋 Planned     | 🟢 Low    |
| Community contribution guidelines                       | 📋 Planned     | 🟢 Low    |
| Storybook integration for component development         | 📋 Planned     | 🟢 Low    |

</details>

<br/>

> **📈 Detailed Status**: See [PROGRESS.md](PROGRESS.md) for detailed phase-by-phase status and weekly updates.

<br/>

---

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

---

## 🔗 Links

<div align="center">

| Resource            | Link                                                               |
| ------------------- | ------------------------------------------------------------------ |
| 🌐 **Website**       | [tuel.ai](https://tuel.ai)                                         |
| 📚 **Documentation** | [tuel.ai/docs](https://tuel.ai/docs)                               |
| 🚀 **Demo**          | [tuel-animation.vercel.app](https://tuel-animation.vercel.app)     |
| 📦 **npm**           | [npmjs.com/search?q=@tuel](https://www.npmjs.com/search?q=%40tuel) |
| 💻 **GitHub**        | [github.com/omerakben/tuel](https://github.com/omerakben/tuel)     |

</div>

<br/>

---

<div align="center">

**Made with ❤️ by [Omer Akben](https://omerakben.com)**

<br/>

<sub>If you find TUEL useful, consider giving it a ⭐️ on GitHub!</sub>

</div>
