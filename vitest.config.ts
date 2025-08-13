import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.ts',
        '**/*.d.ts',
        '**/dist/**',
        '**/types/**',
      ],
    },
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.turbo'],
  },
  resolve: {
    alias: {
      '@tuel/config': resolve(__dirname, './packages/config/src'),
      '@tuel/gallery': resolve(__dirname, './packages/gallery/src'),
      '@tuel/gsap': resolve(__dirname, './packages/gsap/src'),
      '@tuel/interaction': resolve(__dirname, './packages/interaction/src'),
      '@tuel/motion': resolve(__dirname, './packages/motion/src'),
      '@tuel/performance': resolve(__dirname, './packages/performance/src'),
      '@tuel/scroll': resolve(__dirname, './packages/scroll/src'),
      '@tuel/state': resolve(__dirname, './packages/state/src'),
      '@tuel/text-effects': resolve(__dirname, './packages/text-effects/src'),
      '@tuel/three': resolve(__dirname, './packages/three/src'),
      '@tuel/tokens': resolve(__dirname, './packages/tokens/src'),
      '@tuel/ui': resolve(__dirname, './packages/ui/src'),
      '@tuel/utils': resolve(__dirname, './packages/utils/src'),
    },
  },
});