import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateDuration,
  validateStaggerDelay,
  validateDelay,
  validateArray,
  validateString,
  validateBoolean,
  validateColor,
  validateNumber,
  validateAnimationVariant,
  validateSplitType,
  validateProps,
} from "../validators";

describe("Input Validation Utilities", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("validateDuration", () => {
    it("should return default value for undefined input", () => {
      const result = validateDuration(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(300);
    });

    it("should clamp values within valid range", () => {
      const result = validateDuration(15000, 300, { min: 0, max: 10000 });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(10000);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Duration 15000ms clamped to 10000ms")
      );
    });

    it("should handle invalid types", () => {
      const result = validateDuration("invalid" as any, 300);
      expect(result.isValid).toBe(false);
      expect(result.value).toBe(300);
      expect(result.error).toContain("Invalid duration");
    });

    it("should handle NaN values", () => {
      const result = validateDuration(NaN, 300);
      expect(result.isValid).toBe(false);
      expect(result.value).toBe(300);
    });
  });

  describe("validateStaggerDelay", () => {
    it("should return default value for undefined input", () => {
      const result = validateStaggerDelay(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0.03);
    });

    it("should clamp values within valid range", () => {
      const result = validateStaggerDelay(2000, 0.03, { min: 0, max: 1000 });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(1000);
    });

    it("should handle invalid types", () => {
      const result = validateStaggerDelay("invalid" as any, 0.03);
      expect(result.isValid).toBe(false);
      expect(result.value).toBe(0.03);
    });
  });

  describe("validateDelay", () => {
    it("should return default value for undefined input", () => {
      const result = validateDelay(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });

    it("should clamp values within valid range", () => {
      const result = validateDelay(10000, 0, { min: 0, max: 5000 });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(5000);
    });
  });

  describe("validateArray", () => {
    it("should return default value for undefined input", () => {
      const result = validateArray(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual([]);
    });

    it("should handle invalid types", () => {
      const result = validateArray("not an array" as any);
      expect(result.isValid).toBe(false);
      expect(result.value).toEqual([]);
    });

    it("should accept valid arrays", () => {
      const result = validateArray([1, 2, 3]);
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual([1, 2, 3]);
    });
  });

  describe("validateString", () => {
    it("should return default value for undefined input", () => {
      const result = validateString(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("");
    });

    it("should handle invalid types", () => {
      const result = validateString(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.value).toBe("");
    });

    it("should validate string length", () => {
      const result = validateString("a".repeat(2000), "", { maxLength: 1000 });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("String length");
    });

    it("should accept valid strings", () => {
      const result = validateString("valid string");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("valid string");
    });
  });

  describe("validateBoolean", () => {
    it("should return default value for undefined input", () => {
      const result = validateBoolean(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(false);
    });

    it("should handle invalid types", () => {
      const result = validateBoolean("not boolean" as any);
      expect(result.isValid).toBe(false);
      expect(result.value).toBe(false);
    });

    it("should accept valid booleans", () => {
      const result = validateBoolean(true);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(true);
    });
  });

  describe("validateColor", () => {
    it("should return default value for undefined input", () => {
      const result = validateColor(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("#000000");
    });

    it("should handle invalid color formats", () => {
      const result = validateColor("invalid-color");
      expect(result.isValid).toBe(false);
      expect(result.value).toBe("#000000");
    });

    it("should accept valid hex colors", () => {
      const result = validateColor("#ff0000");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("#ff0000");
    });

    it("should accept valid rgb colors", () => {
      const result = validateColor("rgb(255, 0, 0)");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("rgb(255, 0, 0)");
    });

    it("should accept CSS color names", () => {
      const result = validateColor("red");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("red");
    });

    it("should trim whitespace", () => {
      const result = validateColor("  #ff0000  ");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("#ff0000");
    });
  });

  describe("validateNumber", () => {
    it("should return default value for undefined input", () => {
      const result = validateNumber(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(0);
    });

    it("should clamp values within bounds", () => {
      const result = validateNumber(15, 0, { min: 0, max: 10 });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(10);
    });

    it("should handle invalid types", () => {
      const result = validateNumber("not a number" as any);
      expect(result.isValid).toBe(false);
      expect(result.value).toBe(0);
    });
  });

  describe("validateAnimationVariant", () => {
    const validVariants = ["fade", "slide", "typewriter"] as const;

    it("should return default value for undefined input", () => {
      const result = validateAnimationVariant(undefined, validVariants, "fade");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("fade");
    });

    it("should handle invalid variants", () => {
      const result = validateAnimationVariant("invalid", validVariants, "fade");
      expect(result.isValid).toBe(false);
      expect(result.value).toBe("fade");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid variant: invalid")
      );
    });

    it("should accept valid variants", () => {
      const result = validateAnimationVariant("slide", validVariants, "fade");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("slide");
    });
  });

  describe("validateSplitType", () => {
    it("should return default value for undefined input", () => {
      const result = validateSplitType(undefined);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("chars");
    });

    it("should handle invalid split types", () => {
      const result = validateSplitType("invalid");
      expect(result.isValid).toBe(false);
      expect(result.value).toBe("chars");
    });

    it("should accept valid split types", () => {
      const result = validateSplitType("words");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("words");
    });
  });

  describe("validateProps", () => {
    it("should validate multiple props at once", () => {
      const props = {
        duration: 15000,
        delay: -100,
        text: "valid text",
        enabled: true,
      };

      const validators = {
        duration: (value: number) => validateDuration(value, 300),
        delay: (value: number) => validateDelay(value, 0),
        text: (value: string) => validateString(value, ""),
        enabled: (value: boolean) => validateBoolean(value, false),
      };

      const result = validateProps(props, validators);

      expect(result.duration).toBe(10000); // Clamped
      expect(result.delay).toBe(0); // Clamped
      expect(result.text).toBe("valid text");
      expect(result.enabled).toBe(true);
    });

    it("should handle missing validators gracefully", () => {
      const props = { duration: 500, unknown: "value" };
      const validators = {
        duration: (value: number) => validateDuration(value, 300),
      };

      const result = validateProps(props, validators);

      expect(result.duration).toBe(500);
      expect(result.unknown).toBe("value"); // Unchanged
    });
  });

  describe("Warning suppression", () => {
    it("should suppress warnings when warnOnInvalid is false", () => {
      const result = validateDuration(15000, 300, { warnOnInvalid: false });
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(10000);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
