import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Unmock @tuel/utils to test the actual implementation
vi.unmock("@tuel/utils");

import { cn, isServer, isClient, debounce, throttle, clamp, lerp, range } from "../index";

describe("cn", () => {
  it("joins multiple class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("filters out falsy values", () => {
    expect(cn("class1", undefined, null, false, "class2")).toBe("class1 class2");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const isDisabled = false;

    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active"
    );
  });

  it("returns empty string for all falsy values", () => {
    expect(cn(undefined, null, false)).toBe("");
  });

  it("handles single class name", () => {
    expect(cn("single")).toBe("single");
  });

  it("handles no arguments", () => {
    expect(cn()).toBe("");
  });
});

describe("isServer and isClient", () => {
  it("isServer is true when window is undefined", () => {
    // In test environment, window exists, so isServer should be false
    expect(isServer).toBe(false);
  });

  it("isClient is opposite of isServer", () => {
    expect(isClient).toBe(!isServer);
  });

  it("isClient is true in browser environment", () => {
    // In test environment with jsdom, window exists
    expect(isClient).toBe(true);
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delays function execution", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("resets timer on multiple calls", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc();
    vi.advanceTimersByTime(100);

    debouncedFunc();
    vi.advanceTimersByTime(100);

    debouncedFunc();
    vi.advanceTimersByTime(299);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to debounced function", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc("arg1", "arg2");
    vi.advanceTimersByTime(300);

    expect(func).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("has a cancel method", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    expect(typeof debouncedFunc.cancel).toBe("function");
  });

  it("cancels pending execution when cancel is called", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc();
    vi.advanceTimersByTime(100);
    
    debouncedFunc.cancel();
    vi.advanceTimersByTime(300);

    expect(func).not.toHaveBeenCalled();
  });

  it("prevents memory leaks by cancelling timeout", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    // Multiple calls followed by cancel
    for (let i = 0; i < 100; i++) {
      debouncedFunc();
    }
    debouncedFunc.cancel();
    
    vi.advanceTimersByTime(1000);
    expect(func).not.toHaveBeenCalled();
  });

  it("handles multiple argument types", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 300);

    debouncedFunc(123, { key: "value" }, [1, 2, 3]);
    vi.advanceTimersByTime(300);

    expect(func).toHaveBeenCalledWith(123, { key: "value" }, [1, 2, 3]);
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("executes immediately on first call", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it("ignores calls within throttle period", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it("allows execution after throttle period", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(2);
  });

  it("passes arguments to throttled function", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    throttledFunc("arg1", 42);
    expect(func).toHaveBeenCalledWith("arg1", 42);
  });

  it("handles rapid successive calls correctly", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    // First call executes immediately
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    // Calls within throttle period are ignored
    vi.advanceTimersByTime(50);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(49);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    // After throttle period, next call executes
    vi.advanceTimersByTime(1);
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(2);
  });

  it("has a cancel method", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    expect(typeof throttledFunc.cancel).toBe("function");
  });

  it("cancels pending throttle state when cancel is called", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    // First call executes
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);

    // Cancel the throttle state
    throttledFunc.cancel();

    // Should be able to call immediately after cancel
    throttledFunc();
    expect(func).toHaveBeenCalledTimes(2);
  });

  it("prevents memory leaks by cancelling timeout", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 300);

    throttledFunc();
    throttledFunc.cancel();
    
    vi.advanceTimersByTime(1000);
    // Function should have been called only once (before cancel)
    expect(func).toHaveBeenCalledTimes(1);
  });
});

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("returns min when value is below range", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(-100, 0, 10)).toBe(0);
  });

  it("returns max when value is above range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(100, 0, 10)).toBe(10);
  });

  it("works with negative ranges", () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(-15, -10, -1)).toBe(-10);
    expect(clamp(0, -10, -1)).toBe(-1);
  });

  it("works with decimal values", () => {
    expect(clamp(5.5, 0, 10)).toBe(5.5);
    expect(clamp(-0.5, 0, 10)).toBe(0);
    expect(clamp(10.5, 0, 10)).toBe(10);
  });

  it("throws on NaN value", () => {
    expect(() => clamp(NaN, 0, 10)).toThrow("clamp: value must be a finite number");
  });

  it("throws on NaN min", () => {
    expect(() => clamp(5, NaN, 10)).toThrow("clamp: min must be a finite number");
  });

  it("throws on NaN max", () => {
    expect(() => clamp(5, 0, NaN)).toThrow("clamp: max must be a finite number");
  });

  it("throws on Infinity value", () => {
    expect(() => clamp(Infinity, 0, 10)).toThrow("clamp: value must be a finite number");
  });

  it("throws on -Infinity value", () => {
    expect(() => clamp(-Infinity, 0, 10)).toThrow("clamp: value must be a finite number");
  });

  it("throws when min is greater than max", () => {
    expect(() => clamp(5, 10, 0)).toThrow("clamp: min (10) must be less than or equal to max (0)");
  });

  it("handles very large numbers", () => {
    expect(clamp(Number.MAX_SAFE_INTEGER, 0, 100)).toBe(100);
    expect(clamp(Number.MIN_SAFE_INTEGER, 0, 100)).toBe(0);
  });
});

describe("lerp", () => {
  it("returns start when t is 0", () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(10, 20, 0)).toBe(10);
  });

  it("returns end when t is 1", () => {
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("interpolates correctly at 0.5", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it("interpolates at various t values", () => {
    expect(lerp(0, 100, 0.25)).toBe(25);
    expect(lerp(0, 100, 0.75)).toBe(75);
    expect(lerp(10, 20, 0.75)).toBe(17.5);
  });

  it("works with negative values", () => {
    expect(lerp(-10, 10, 0.5)).toBe(0);
    expect(lerp(-100, 0, 0.25)).toBe(-75);
  });

  it("allows t values outside 0-1 for extrapolation", () => {
    expect(lerp(0, 100, 1.5)).toBe(150);
    expect(lerp(0, 100, -0.5)).toBe(-50);
  });

  it("works with decimal values", () => {
    expect(lerp(0.5, 1.5, 0.5)).toBe(1);
    expect(lerp(1.1, 2.2, 0.5)).toBeCloseTo(1.65, 10);
  });

  it("throws on NaN start", () => {
    expect(() => lerp(NaN, 100, 0.5)).toThrow("lerp: start must be a finite number");
  });

  it("throws on NaN end", () => {
    expect(() => lerp(0, NaN, 0.5)).toThrow("lerp: end must be a finite number");
  });

  it("throws on NaN t", () => {
    expect(() => lerp(0, 100, NaN)).toThrow("lerp: t must be a finite number");
  });

  it("throws on Infinity values", () => {
    expect(() => lerp(Infinity, 100, 0.5)).toThrow("lerp: start must be a finite number");
    expect(() => lerp(0, Infinity, 0.5)).toThrow("lerp: end must be a finite number");
    expect(() => lerp(0, 100, Infinity)).toThrow("lerp: t must be a finite number");
  });

  it("handles very large numbers", () => {
    const result = lerp(0, Number.MAX_SAFE_INTEGER, 0.5);
    expect(result).toBeCloseTo(Number.MAX_SAFE_INTEGER / 2, -10);
  });
});

describe("range", () => {
  it("creates range from 1 to 5", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("creates range from 0 to 10 with step 2", () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
  });

  it("creates descending range with negative step", () => {
    expect(range(5, 1, -1)).toEqual([5, 4, 3, 2, 1]);
  });

  it("handles single value range", () => {
    expect(range(5, 5)).toEqual([5]);
  });

  it("creates range with decimal step", () => {
    expect(range(0, 2, 0.5)).toEqual([0, 0.5, 1, 1.5, 2]);
  });

  it("handles negative ranges", () => {
    expect(range(-3, 3)).toEqual([-3, -2, -1, 0, 1, 2, 3]);
  });

  it("handles large step values", () => {
    expect(range(0, 100, 25)).toEqual([0, 25, 50, 75, 100]);
  });

  it("throws error for zero step", () => {
    expect(() => range(0, 10, 0)).toThrow("range: step cannot be zero");
  });

  it("throws on NaN start", () => {
    expect(() => range(NaN, 10)).toThrow("range: start must be a finite number");
  });

  it("throws on NaN end", () => {
    expect(() => range(0, NaN)).toThrow("range: end must be a finite number");
  });

  it("throws on NaN step", () => {
    expect(() => range(0, 10, NaN)).toThrow("range: step must be a finite number");
  });

  it("throws on Infinity values", () => {
    expect(() => range(Infinity, 10)).toThrow("range: start must be a finite number");
    expect(() => range(0, Infinity)).toThrow("range: end must be a finite number");
    expect(() => range(0, 10, Infinity)).toThrow("range: step must be a finite number");
  });

  it("throws when step direction doesn't match range direction (positive step, descending range)", () => {
    expect(() => range(10, 1, 1)).toThrow("range: step direction (1) doesn't match");
  });

  it("throws when step direction doesn't match range direction (negative step, ascending range)", () => {
    expect(() => range(1, 10, -1)).toThrow("range: step direction (-1) doesn't match");
  });

  it("prevents DoS with tiny positive step", () => {
    expect(() => range(0, 1000000, 0.0001)).toThrow("range: would generate");
    expect(() => range(0, 1000000, 0.0001)).toThrow("exceeds maximum of 1000000");
  });

  it("prevents DoS with tiny negative step", () => {
    expect(() => range(1000000, 0, -0.0001)).toThrow("range: would generate");
  });

  it("handles very large numbers within bounds", () => {
    const result = range(Number.MAX_SAFE_INTEGER - 5, Number.MAX_SAFE_INTEGER - 3);
    expect(result.length).toBe(3);
  });

  it("allows ranges up to 1 million elements", () => {
    const result = range(0, 999999);
    expect(result.length).toBe(1000000);
    expect(result[0]).toBe(0);
    expect(result[999999]).toBe(999999);
  });

  it("handles descending range with decimal negative step", () => {
    expect(range(2, 0, -0.5)).toEqual([2, 1.5, 1, 0.5, 0]);
  });
});
