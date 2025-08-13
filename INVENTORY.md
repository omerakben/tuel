# TUEL Package Inventory & Triage

## Package Status Matrix

| Package | Purpose | Public API | Dependencies | README Status | Docs URL | Triage Status |
|---------|---------|------------|--------------|---------------|----------|---------------|
| @tuel/config | Configuration system for themes and animation presets | configProvider, themeConfig, animationPresets | None | Missing | <https://tuel.ai/docs/config> | Needs Refactor - Missing README, needs SSR guards |
| @tuel/gallery | Interactive image and video galleries | Carousel, ImageGallery, MediaGrid, VideoGallery | react (peer) | Missing | <https://tuel.ai/docs/gallery> | Needs Refactor - Missing README, needs performance optimization |
| @tuel/gsap | GSAP integration utilities | Core exports | gsap (peer) | Missing | <https://tuel.ai/docs/gsap> | Needs Refactor - Minimal implementation, needs expansion |
| @tuel/interaction | Interactive mouse and cursor effects | useCursorFollower, useImageTrail, useMouseTracking | react (peer) | Missing | <https://tuel.ai/docs/interaction> | Needs Refactor - Missing README, needs SSR safety |
| @tuel/motion | Core motion primitives and animations | Core exports | framer-motion (peer) | Missing | <https://tuel.ai/docs/motion> | Needs Refactor - Minimal implementation, needs expansion |
| @tuel/performance | Performance optimization utilities | useFrameControl, useOptimization, useReducedMotion | react (peer) | Missing | <https://tuel.ai/docs/performance> | Ready - Good foundation, needs README |
| @tuel/scroll | Advanced scroll-triggered animations | HorizontalScroll, ParallaxScroll, ScrollMinimap, etc. | gsap, three, lenis | Missing | <https://tuel.ai/docs/scroll> | Needs Refactor - Heavy deps not as peers, needs SSR guards |
| @tuel/state | Animation state management | useAnimationLifecycle, useAnimationSequence, useVariants | react (peer) | Missing | <https://tuel.ai/docs/state> | Ready - Good hooks, needs README |
| @tuel/text-effects | Typography animations | AnimatedText, NavigateScrollAnimatedText, ParticleText | react (peer) | Missing | <https://tuel.ai/docs/text-effects> | Needs Refactor - Needs SSR guards, README |
| @tuel/three | Three.js animation helpers | Canvas, FloatingObjects, MorphingShapes, ThreeOrbitScene | three (peer) | Missing | <https://tuel.ai/docs/three> | Needs Refactor - Missing tsconfig, needs SSR guards |
| @tuel/tokens | Design tokens for animations | Core exports | None | Missing | <https://tuel.ai/docs/tokens> | Ready - Simple exports, needs README |
| @tuel/ui | UI animation components | AnimatedMenu, Carousel, ImageGallery, StickyCards | react (peer) | Missing | <https://tuel.ai/docs/ui> | Needs Refactor - Missing tsconfig, needs optimization |
| @tuel/utils | Core utilities and helpers | cn, simple utilities | None | Missing | <https://tuel.ai/docs/utils> | Ready - Simple utils, needs README |

## Critical Issues to Address

1. **No README files** - All 13 packages missing documentation
2. **SSR Safety** - Direct DOM access without guards in most packages
3. **Heavy Dependencies** - gsap, three, lenis as direct deps instead of peers in @tuel/scroll
4. **Missing TypeScript Config** - @tuel/three and @tuel/ui missing tsconfig.json
5. **No Tests** - No test files in any package
6. **No CI/CD** - Missing GitHub Actions workflows
7. **No Changesets** - Version management not configured
8. **Performance Issues** - No prefers-reduced-motion checks, no RAF optimization

## Priority Order

1. Fix critical build issues (tsconfig, dependencies)
2. Add SSR guards to all packages
3. Standardize package.json structure
4. Create README files with examples
5. Implement performance optimizations
6. Add testing infrastructure
7. Set up CI/CD pipeline
