import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas context for jsdom
// @ts-ignore
HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === '2d') {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      canvas: this,
    };
  }
  if (contextId === 'webgl' || contextId === 'webgl2') {
    return {
      canvas: this,
      drawingBufferWidth: 300,
      drawingBufferHeight: 150,
    };
  }
  return null;
};

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
  return setTimeout(callback, 0) as any;
}) as any;

global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
  clearTimeout(id);
}) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Setup performance mock
global.performance = {
  ...global.performance,
  now: vi.fn(() => Date.now()),
} as any;

// Suppress console warnings and errors during tests (except explicit expects)
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args: any[]) => {
  // Allow through if it's a test expectation
  const message = args[0]?.toString() || '';
  if (!message.includes('TUEL:') && !message.includes('Browser not fully supported')) {
    originalWarn.apply(console, args);
  }
};

console.error = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  if (!message.includes('Not implemented: HTMLCanvasElement')) {
    originalError.apply(console, args);
  }
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});