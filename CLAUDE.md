# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TUEL is a professional animation library for React developers built as a pnpm monorepo with 13 modular packages. The library provides high-performance animation components built on GSAP, Framer Motion, and Three.js.

**Current State**: v0.2.0 released (January 2025)
- Build configuration hardened (TypeScript/ESLint errors no longer ignored)
- Comprehensive test coverage expansion in progress (~5% → target 80%+)
- 9 critical security issues (XSS vulnerabilities) require attention
- See PROGRESS.md for detailed roadmap to v2.0.0

## Development Commands

### Essential Commands

```bash
# Install dependencies
pnpm install

# Build all packages (required before running demo)
pnpm build

# Run demo application (Next.js 15)
pnpm dev

# Run type checking across all packages
pnpm typecheck

# Lint code
pnpm lint

# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage report
pnpm test:coverage

# Run E2E tests with Playwright
pnpm test:e2e

# Clean build artifacts
pnpm clean
```

### Package-Specific Commands

```bash
# Build all packages (Turborepo orchestrates dependencies)
turbo build

# Build and watch packages for development
pnpm dev:packages

# Build demo app specifically
pnpm build:demo
```

### Testing Individual Packages

Tests are located in `packages/*/src/**/*.test.{ts,tsx}`. To test a specific package:

```bash
# Run tests for a specific package using Vitest filter
pnpm test packages/scroll

# Watch mode for specific package
pnpm test:watch packages/scroll
```

### Publishing

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version

# Build and publish to npm
pnpm release
```

## Architecture

### Monorepo Structure

```
packages/
├── utils/          # Core utilities (cn, isServer/isClient)
├── tokens/         # Design tokens & theme system
├── config/         # Configuration system & presets
├── performance/    # Performance optimization hooks
├── state/          # Animation state management
├── motion/         # Motion primitives (Framer Motion wrapper)
├── gsap/           # GSAP integration utilities
├── text-effects/   # Typography animations
├── interaction/    # Mouse, touch & gesture interactions
├── scroll/         # Scroll-triggered animations (HorizontalScroll, ParallaxScroll, etc.)
├── gallery/        # Interactive image & video galleries
├── three/          # Three.js 3D components (FloatingObjects, MorphingShapes, etc.)
└── ui/             # Pre-built UI animation components

src/                # Demo Next.js 15 application
test/               # Test setup and utilities
```

### Package Dependencies

**Dependency hierarchy** (packages depend on those below them):
1. Foundation: `utils`, `tokens`, `config`
2. Core: `performance`, `state`, `gsap`, `motion`
3. Features: `text-effects`, `interaction`, `scroll`, `gallery`, `three`, `ui`

Packages use local workspace dependencies via `@tuel/*` imports. The Vitest config provides path aliases for testing.

### Build System

- **Turborepo**: Orchestrates builds with dependency graph awareness
- **tsup**: Compiles TypeScript packages to ESM + CJS
  - Entry: `src/index.ts`
  - Output: `dist/` with both formats
  - Config pattern: `format: ["cjs", "esm"], dts: true, target: "es2017"`
  - Externalizes peer dependencies (React, animation libraries)
- **TypeScript**: Strict mode with isolated modules
- **Package exports**: Dual ESM/CJS via `exports` field in package.json
  - ESM: `dist/index.js`
  - CJS: `dist/index.cjs` (for packages with dual format)
  - Types: `dist/index.d.ts`

### Animation Libraries Integration

**GSAP**: Heavy scroll-based animations (WodniackWorkScroll, OrchestraCubes, etc.)
**Framer Motion**: UI component animations and transitions
**Three.js**: 3D components and WebGL effects

Peer dependencies are **optional** - packages work without installing all animation libraries.

### Component Patterns

**Scroll Components** (`packages/scroll`):
- Heavy use of GSAP ScrollTrigger
- Complex ref management for scroll containers
- Many showcase-specific components (SofiHealthScroll, OrkenWorldScroll, etc.)
- Export both component + TypeScript types from index.ts

**Three.js Components** (`packages/three`):
- Canvas setup with RAF loops
- Critical: Memory cleanup in useEffect returns
- Known issue: Multiple components have missing cleanup (see PROGRESS.md Phase 1.2)

**Text Effects** (`packages/text-effects`):
- Known security issue: Multiple XSS vulnerabilities via dangerouslySetInnerHTML
- Critical: Fix required in Phase 1 (AnimatedText.tsx has 5 instances)

## Key Technical Constraints

### Security Issues (CRITICAL - Phase 1)

**XSS Vulnerabilities** (9 total):
- `packages/text-effects/src/components/AnimatedText.tsx` (5 instances)
- `packages/scroll/src/components/SofiHealthScroll.tsx` (2 instances)
- `packages/scroll/src/components/WodniackWorkScroll.tsx` (1 instance)

**Action Required**: Use DOMPurify or switch to safe React rendering patterns

### Memory Management (CRITICAL - Phase 1)

Multiple Three.js components lack proper cleanup:
- `packages/three/src/components/FloatingObjects.tsx`
- `packages/three/src/components/MorphingShapes.tsx`
- `packages/three/src/components/ParticleField.tsx`
- `packages/three/src/components/Canvas.tsx`
- `packages/scroll/src/components/WodniackWorkScroll.tsx`

**Pattern**: Ensure `useEffect` cleanup disposes Three.js objects, removes event listeners, cancels RAF

### Build Configuration

**✅ RESOLVED (v0.2.0)**: Build configuration has been hardened:
```typescript
// next.config.ts - Production-ready settings
typescript: { ignoreBuildErrors: false }
eslint: { ignoreDuringBuilds: false }
```

All TypeScript and ESLint errors have been resolved. The codebase now builds cleanly with strict validation.

### Testing Requirements

**Current**: Expanded test coverage with multiple test suites across packages
**Target**: 80%+ coverage across all packages

Test setup:
- Framework: Vitest + React Testing Library
- Setup file: `test/setup.ts` (includes canvas, IntersectionObserver, RAF mocks)
- Test pattern: `packages/**/*.{test,spec}.{ts,tsx}`
- Coverage reports: text, lcov, html
- Coverage thresholds: 80% for branches, functions, lines, statements

**Excluded Tests** (vitest.config.ts):
Some edge-case test suites are temporarily excluded for v0.2.0 release and will be fixed in future releases:
- text-effects: components.test, security.test
- scroll: ParallaxScroll.test, ScrollMinimap.test, ScrollFrameAnimation.test, security.test, useSSR.test
- config: configProvider.test
- utils: errorBoundary.test, performance.test

Run tests with: `pnpm test` or filter by package: `pnpm test packages/scroll`

## Common Development Patterns

### Running Individual Package Tests

To run tests for a specific package while filtering out excluded tests:

```bash
# Test a specific package
pnpm test packages/scroll

# Watch mode for a package
pnpm test:watch packages/scroll

# Run a single test file (if not excluded)
pnpm test packages/utils/src/__tests__/cn.test.ts
```

Note: Some test files are excluded in vitest.config.ts - check the exclude array before debugging test execution issues.

### Adding a New Package

1. Copy structure from existing package (e.g., `packages/utils`)
2. Update `package.json`:
   - Set correct `@tuel/[name]` and version
   - Configure peer dependencies (React, animation libs) with `optional: true`
   - Set `publishConfig.access: "public"`
3. Create `tsup.config.ts` with standard config:
   ```typescript
   export default defineConfig({
     entry: ["src/index.ts"],
     format: ["cjs", "esm"],
     dts: true,
     clean: true,
     target: "es2017",
   });
   ```
4. Add package alias to `vitest.config.ts` resolve.alias
5. Export from `src/index.ts` following the pattern: `export { Component } from "./components/Component"`

### Workspace Dependencies

When one package depends on another TUEL package:
- Use `workspace:*` in package.json dependencies
- Version ranges are resolved at publish time via Changesets
- Local development uses the workspace version automatically

## Code Style Conventions

### TypeScript

- Strict mode enabled
- Export types alongside components
- Use `React.FC` or explicit prop typing
- Prefer named exports over default exports

### Component Exports

Standard pattern from `packages/*/src/index.ts`:
```typescript
export { Component } from "./components/Component";
export type { ComponentProps } from "./components/Component";
```

### Utilities

The `@tuel/utils` package provides:
- `cn()`: Conditional className joining (like clsx)
- `isServer`, `isClient`: Environment detection

Use these instead of adding new utility functions.

### Styling

- CSS Modules for component-specific styles
- Some components use plain CSS files (e.g., WodniackWorkScroll)
- Tailwind CSS in demo app (src/)

## CI/CD Pipeline

GitHub Actions workflows:
- **ci.yml**: Runs on PR/push to main/develop
  - Lint, typecheck, build, test on Node 18 & 20
  - E2E tests with Playwright (Chromium only)
  - Package size reporting
  - Coverage upload to Codecov
- **release.yml**: Changesets-based publishing

## Project Context

**Version Strategy**: v0.2.0 released (January 2025), following roadmap to v2.0.0

**Active Development Focus**:
1. Critical security fixes (XSS, memory leaks)
2. Test coverage expansion (5% → 80%+)
3. Build configuration hardening

**DO NOT**:
- Make breaking API changes without following the roadmap phases
- Publish packages manually (use changesets workflow)
- Disable TypeScript/ESLint errors in builds
- Add new features before Phase 1-2 completion

**DO**:
- Follow the roadmap phases in PROGRESS.md
- Write tests for all new code
- Fix security issues with priority
- Add proper TypeScript types
- Ensure proper cleanup in Three.js/animation components

## Additional Resources

- **Progress Tracking**: PROGRESS.md (detailed 10-phase roadmap)
- **Contributing**: CONTRIBUTING.md
- **Package Inventory**: INVENTORY.md
- **Operations Guide**: RUNBOOK.md
- **Package Documentation**: Each package has its own README (currently minimal)
