/**
 * SSR-safe utilities for animation components
 */

export const isSSR = typeof window === 'undefined';
export const isBrowser = !isSSR;

/**
 * Check if code is running in browser environment
 */
export function canUseDOM(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

/**
 * Get window dimensions safely
 */
export function getWindowDimensions() {
  if (!canUseDOM()) {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Safe requestAnimationFrame wrapper
 */
export function safeRAF(callback: FrameRequestCallback): number | null {
  if (!canUseDOM() || !window.requestAnimationFrame) {
    return null;
  }
  return window.requestAnimationFrame(callback);
}

/**
 * Safe cancelAnimationFrame wrapper
 */
export function safeCancelRAF(id: number | null): void {
  if (!canUseDOM() || !window.cancelAnimationFrame || !id) {
    return;
  }
  window.cancelAnimationFrame(id);
}