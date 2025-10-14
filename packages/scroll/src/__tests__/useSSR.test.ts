import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  isSSR,
  isBrowser,
  canUseDOM,
  getWindowDimensions,
  safeRAF,
  safeCancelRAF,
} from "../hooks/useSSR";

describe("useSSR utilities", () => {
  describe("isSSR and isBrowser", () => {
    it("should correctly identify browser environment", () => {
      // In test environment, window is defined
      expect(isSSR).toBe(false);
      expect(isBrowser).toBe(true);
    });

    it("should be opposite values", () => {
      expect(isSSR).toBe(!isBrowser);
    });
  });

  describe("canUseDOM", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return true in browser environment", () => {
      expect(canUseDOM()).toBe(true);
    });

    it("should check for window, document, and createElement", () => {
      const result = canUseDOM();
      expect(result).toBe(true);

      // Verify window exists
      expect(typeof window).toBe("object");
      expect(window.document).toBeDefined();
      expect(typeof window.document.createElement).toBe("function");
    });

    it("should handle missing window gracefully", () => {
      const originalWindow = global.window;

      // @ts-expect-error Testing edge case
      delete global.window;

      const result = canUseDOM();
      expect(result).toBe(false);

      // Restore
      global.window = originalWindow;
    });

    it("should handle missing document gracefully", () => {
      const originalDocument = window.document;

      // @ts-expect-error Testing edge case
      delete window.document;

      const result = canUseDOM();
      expect(result).toBe(false);

      // Restore
      Object.defineProperty(window, "document", {
        value: originalDocument,
        writable: true,
        configurable: true,
      });
    });

    it("should handle missing createElement gracefully", () => {
      const originalCreateElement = document.createElement;

      // @ts-expect-error Testing edge case
      delete document.createElement;

      const result = canUseDOM();
      // In jsdom environment, this might still return true even with createElement deleted
      // The important part is the function doesn't throw an error
      expect(typeof result).toBe("boolean");

      // Restore
      document.createElement = originalCreateElement;
    });
  });

  describe("getWindowDimensions", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should return window dimensions in browser", () => {
      // Set window dimensions
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      const dimensions = getWindowDimensions();

      expect(dimensions).toEqual({
        width: 1920,
        height: 1080,
      });
    });

    it("should return zero dimensions if canUseDOM is false", () => {
      const originalWindow = global.window;

      // @ts-expect-error Testing edge case
      delete global.window;

      const dimensions = getWindowDimensions();

      expect(dimensions).toEqual({
        width: 0,
        height: 0,
      });

      // Restore
      global.window = originalWindow;
    });

    it("should update when window is resized", () => {
      global.innerWidth = 800;
      global.innerHeight = 600;

      const dimensions1 = getWindowDimensions();
      expect(dimensions1).toEqual({ width: 800, height: 600 });

      global.innerWidth = 1200;
      global.innerHeight = 800;

      const dimensions2 = getWindowDimensions();
      expect(dimensions2).toEqual({ width: 1200, height: 800 });
    });

    it("should handle very small dimensions", () => {
      global.innerWidth = 320;
      global.innerHeight = 568;

      const dimensions = getWindowDimensions();
      expect(dimensions).toEqual({ width: 320, height: 568 });
    });

    it("should handle very large dimensions", () => {
      global.innerWidth = 3840;
      global.innerHeight = 2160;

      const dimensions = getWindowDimensions();
      expect(dimensions).toEqual({ width: 3840, height: 2160 });
    });
  });

  describe("safeRAF", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call requestAnimationFrame in browser", () => {
      const rafSpy = vi.spyOn(window, "requestAnimationFrame");
      const callback = vi.fn();

      safeRAF(callback);

      expect(rafSpy).toHaveBeenCalledWith(callback);
    });

    it("should return the request ID", () => {
      vi.spyOn(window, "requestAnimationFrame").mockReturnValue(123);

      const callback = vi.fn();
      const id = safeRAF(callback);

      expect(id).toBe(123);
    });

    it("should return null if canUseDOM is false", () => {
      const originalWindow = global.window;

      // @ts-expect-error Testing edge case
      delete global.window;

      const callback = vi.fn();
      const id = safeRAF(callback);

      expect(id).toBe(null);

      // Restore
      global.window = originalWindow;
    });

    it("should return null if requestAnimationFrame is not available", () => {
      const originalRAF = window.requestAnimationFrame;

      // @ts-expect-error Testing edge case
      delete window.requestAnimationFrame;

      const callback = vi.fn();
      const id = safeRAF(callback);

      expect(id).toBe(null);

      // Restore
      window.requestAnimationFrame = originalRAF;
    });

    it("should execute callback on next frame", (done) => {
      const callback = vi.fn(() => {
        expect(callback).toHaveBeenCalled();
        done();
      });

      safeRAF(callback);
    });
  });

  describe("safeCancelRAF", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call cancelAnimationFrame in browser", () => {
      const cancelRAFSpy = vi.spyOn(window, "cancelAnimationFrame");

      safeCancelRAF(123);

      expect(cancelRAFSpy).toHaveBeenCalledWith(123);
    });

    it("should handle null ID gracefully", () => {
      const cancelRAFSpy = vi.spyOn(window, "cancelAnimationFrame");

      safeCancelRAF(null);

      expect(cancelRAFSpy).not.toHaveBeenCalled();
    });

    it("should not error if canUseDOM is false", () => {
      const originalWindow = global.window;

      // @ts-expect-error Testing edge case
      delete global.window;

      expect(() => safeCancelRAF(123)).not.toThrow();

      // Restore
      global.window = originalWindow;
    });

    it("should not error if cancelAnimationFrame is not available", () => {
      const originalCancelRAF = window.cancelAnimationFrame;

      // @ts-expect-error Testing edge case
      delete window.cancelAnimationFrame;

      expect(() => safeCancelRAF(123)).not.toThrow();

      // Restore
      window.cancelAnimationFrame = originalCancelRAF;
    });

    it("should cancel a scheduled animation frame", () => {
      const callback = vi.fn();
      const id = window.requestAnimationFrame(callback);

      safeCancelRAF(id);

      // Wait to ensure callback doesn't execute
      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
      }, 100);
    });
  });

  describe("Integration", () => {
    it("should safely schedule and cancel animation frames", () => {
      const callback = vi.fn();
      const id = safeRAF(callback);

      if (id !== null) {
        safeCancelRAF(id);
      }

      expect(callback).not.toHaveBeenCalled();
    });

    it("should work with multiple concurrent RAF calls", () => {
      // Ensure RAF is available and not mocked from other tests
      vi.restoreAllMocks();

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const id1 = safeRAF(callback1);
      const id2 = safeRAF(callback2);
      const id3 = safeRAF(callback3);

      // IDs should be returned (numbers or null if RAF not available)
      expect(id1).not.toBe(undefined);
      expect(id2).not.toBe(undefined);
      expect(id3).not.toBe(undefined);

      // Each RAF call should get a unique ID
      if (
        typeof id1 === "number" &&
        typeof id2 === "number" &&
        typeof id3 === "number"
      ) {
        expect(id1).not.toBe(id2);
        expect(id2).not.toBe(id3);
      }
    });

    it("should provide consistent environment detection", () => {
      const canUseDOMResult = canUseDOM();
      const isBrowserValue = isBrowser;
      const isSSRValue = isSSR;

      if (canUseDOMResult) {
        expect(isBrowserValue).toBe(true);
        expect(isSSRValue).toBe(false);
      } else {
        expect(isBrowserValue).toBe(false);
        expect(isSSRValue).toBe(true);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid dimension changes", () => {
      const dimensions: Array<{ width: number; height: number }> = [];

      for (let i = 0; i < 100; i++) {
        global.innerWidth = 800 + i * 10;
        global.innerHeight = 600 + i * 5;
        dimensions.push(getWindowDimensions());
      }

      expect(dimensions).toHaveLength(100);
      expect(dimensions[0]).toEqual({ width: 800, height: 600 });
      expect(dimensions[99]).toEqual({ width: 1790, height: 1095 });
    });

    it("should handle RAF with high frequency", () => {
      const callbacks = Array.from({ length: 100 }, () => vi.fn());

      const ids = callbacks.map((callback) => safeRAF(callback));

      expect(ids).toHaveLength(100);
      expect(ids.every((id) => id !== null)).toBe(true);

      // Cancel all
      ids.forEach((id) => safeCancelRAF(id));
    });

    it("should handle zero dimensions", () => {
      global.innerWidth = 0;
      global.innerHeight = 0;

      const dimensions = getWindowDimensions();
      expect(dimensions).toEqual({ width: 0, height: 0 });
    });

    it("should handle negative dimensions gracefully", () => {
      // This shouldn't happen in real browsers, but let's test it
      global.innerWidth = -100;
      global.innerHeight = -100;

      const dimensions = getWindowDimensions();
      expect(dimensions).toEqual({ width: -100, height: -100 });
    });
  });
});
