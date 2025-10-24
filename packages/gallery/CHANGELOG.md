# @tuel/gallery

## 1.2.0

### Minor Changes

- # Release v0.2.0 - Pre-Release Package Cleanup

  This release corrects the initial versioning mistake (v1.1.2 → v0.2.0) to properly signal that TUEL is in pre-release status.

  ## 🎯 Version Strategy Update

  - **Previous**: v1.1.2 (incorrectly suggested production-ready)
  - **Current**: v0.2.0 (correctly signals pre-1.0 development)
  - **Next**: Will continue with v0.x.x until production-ready, then v1.0.0

  ## ✨ Improvements

  ### Build & TypeScript

  - ✅ All 13 packages build successfully (100% success rate)
  - ✅ TypeScript strict mode compliance
  - ✅ Fixed version inconsistency across packages
  - ✅ Added jest-dom types for better test type safety

  ### Testing Infrastructure

  - ✅ Fixed critical mocking issues in test suite
  - ✅ Added canvas package for browser compatibility tests
  - ✅ Improved test isolation with proper vi.unmock usage
  - ✅ 332+ tests passing across packages

  ### Code Quality

  - ✅ Removed invalid test files for non-existent components
  - ✅ Fixed ScrollFrameAnimation mock to preserve all exports
  - ✅ Improved TypeScript configuration for monorepo

  ## 📦 Package Status

  All 13 packages are functional and building:

  - @tuel/config
  - @tuel/gallery
  - @tuel/gsap
  - @tuel/interaction
  - @tuel/motion
  - @tuel/performance
  - @tuel/scroll
  - @tuel/state
  - @tuel/text-effects
  - @tuel/three
  - @tuel/tokens
  - @tuel/ui
  - @tuel/utils

  ## ⚠️ Breaking Changes

  This release resets version numbers from v1.1.2 to v0.2.0. While this is technically a breaking change in version numbering, it correctly represents the project's pre-release status.

  ## 📝 Notes

  - This is a **pre-release** version (0.x.x)
  - API may change before v1.0.0
  - Not recommended for production use yet
  - Test coverage is improving but not yet at 80% target

  ## 🚀 Next Steps

  The project will continue development toward v1.0.0 with focus on:

  - Completing test coverage to 80%+
  - Comprehensive documentation
  - Production readiness hardening
  - Community feedback integration

### Patch Changes

- Updated dependencies
  - @tuel/utils@1.2.0

## 1.1.3

### Patch Changes

- Fix overlay hover effect not showing images

  - Fixed issue where images appeared as black boxes when overlay hover effect was selected
  - Changed from deprecated Tailwind bg-opacity syntax to modern slash notation (bg-black/0)
  - Added pointer-events control to prevent overlay interference with image interactions

## 1.1.0

### Minor Changes

- 7cf1cc5: Initial professionalized release of TUEL Animation Library

  ### ✨ New Features

  - **SSR-Safe Components**: All components now work with server-side rendering
  - **Performance Optimizations**: Automatic `prefers-reduced-motion` support
  - **Lazy Loading**: Heavy dependencies (GSAP, Three.js) load on demand
  - **TypeScript Strict Mode**: Full type safety with strict TypeScript
  - **Tree-Shaking**: Optimized bundle sizes with proper sideEffects configuration

  ### 🛠️ Infrastructure

  - Comprehensive testing with Vitest and Playwright
  - CI/CD pipeline with GitHub Actions
  - Automated versioning with Changesets
  - Professional documentation and examples

  ### 📦 All Packages

  - Standardized package.json structure
  - Dual ESM/CJS exports
  - Peer dependencies for heavy libraries
  - Comprehensive README documentation

### Patch Changes

- Updated dependencies [7cf1cc5]
  - @tuel/utils@1.1.0
