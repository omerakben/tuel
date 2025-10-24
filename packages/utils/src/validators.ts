/**
 * Input validation utilities for TUEL components
 * Provides runtime validation for component props with safe defaults
 */

export interface ValidationResult<T> {
  isValid: boolean;
  value: T;
  error?: string;
}

export interface ValidationOptions {
  min?: number;
  max?: number;
  defaultValue?: unknown;
  warnOnInvalid?: boolean;
}

/**
 * Validates duration values (0-10000ms)
 */
export function validateDuration(
  value: number | undefined,
  defaultValue: number = 300,
  options: ValidationOptions = {}
): ValidationResult<number> {
  const { min = 0, max = 10000, warnOnInvalid = true } = options;

  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "number" || isNaN(value)) {
    const error = `Invalid duration: ${value}, expected number`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}, using default ${defaultValue}ms`);
    }
    return { isValid: false, value: defaultValue, error };
  }

  const clampedValue = Math.max(min, Math.min(max, value));
  if (clampedValue !== value && warnOnInvalid) {
    console.warn(
      `[TUEL] Duration ${value}ms clamped to ${clampedValue}ms (range: ${min}-${max}ms)`
    );
  }

  return { isValid: true, value: clampedValue };
}

/**
 * Validates stagger delay values (0-1000ms)
 */
export function validateStaggerDelay(
  value: number | undefined,
  defaultValue: number = 0.03,
  options: ValidationOptions = {}
): ValidationResult<number> {
  const { min = 0, max = 1000, warnOnInvalid = true } = options;

  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "number" || isNaN(value)) {
    const error = `Invalid stagger delay: ${value}, expected number`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}, using default ${defaultValue}s`);
    }
    return { isValid: false, value: defaultValue, error };
  }

  const clampedValue = Math.max(min, Math.min(max, value));
  if (clampedValue !== value && warnOnInvalid) {
    console.warn(
      `[TUEL] Stagger delay ${value}s clamped to ${clampedValue}s (range: ${min}-${max}s)`
    );
  }

  return { isValid: true, value: clampedValue };
}

/**
 * Validates delay values (0-5000ms)
 */
export function validateDelay(
  value: number | undefined,
  defaultValue: number = 0,
  options: ValidationOptions = {}
): ValidationResult<number> {
  const { min = 0, max = 5000, warnOnInvalid = true } = options;

  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "number" || isNaN(value)) {
    const error = `Invalid delay: ${value}, expected number`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}, using default ${defaultValue}ms`);
    }
    return { isValid: false, value: defaultValue, error };
  }

  const clampedValue = Math.max(min, Math.min(max, value));
  if (clampedValue !== value && warnOnInvalid) {
    console.warn(
      `[TUEL] Delay ${value}ms clamped to ${clampedValue}ms (range: ${min}-${max}ms)`
    );
  }

  return { isValid: true, value: clampedValue };
}

/**
 * Validates array inputs (checks for empty/null)
 */
export function validateArray<T>(
  value: T[] | undefined | null,
  defaultValue: T[] = [],
  options: ValidationOptions = {}
): ValidationResult<T[]> {
  const { warnOnInvalid = true } = options;

  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (!Array.isArray(value)) {
    const error = `Invalid array: ${value}, expected array`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}, using default empty array`);
    }
    return { isValid: false, value: defaultValue, error };
  }

  return { isValid: true, value };
}

/**
 * Validates string inputs with length constraints
 */
export function validateString(
  value: string | undefined | null,
  defaultValue: string = "",
  options: ValidationOptions & { minLength?: number; maxLength?: number } = {}
): ValidationResult<string> {
  const { minLength = 0, maxLength = 1000, warnOnInvalid = true } = options;

  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "string") {
    const error = `Invalid string: ${value}, expected string`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}, using default "${defaultValue}"`);
    }
    return { isValid: false, value: defaultValue, error };
  }

  if (value.length < minLength || value.length > maxLength) {
    const error = `String length ${value.length} outside range ${minLength}-${maxLength}`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}`);
    }
    return { isValid: false, value, error };
  }

  return { isValid: true, value };
}

/**
 * Validates boolean inputs
 */
export function validateBoolean(
  value: boolean | undefined | null,
  defaultValue: boolean = false
): ValidationResult<boolean> {
  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "boolean") {
    console.warn(
      `[TUEL] Invalid boolean: ${value}, using default ${defaultValue}`
    );
    return { isValid: false, value: defaultValue };
  }

  return { isValid: true, value };
}

/**
 * Validates color values (hex, rgb, hsl, or CSS color names)
 */
export function validateColor(
  value: string | undefined | null,
  defaultValue: string = "#000000"
): ValidationResult<string> {
  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "string") {
    console.warn(
      `[TUEL] Invalid color: ${value}, using default ${defaultValue}`
    );
    return { isValid: false, value: defaultValue };
  }

  // Trim whitespace
  const trimmedValue = value.trim();

  // Validate various color formats
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(trimmedValue);
  const isValidRgb = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(trimmedValue);
  const isValidRgba = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(trimmedValue);
  const isValidHsl = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(trimmedValue);
  const isValidHsla = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i.test(trimmedValue);
  const isValidNamed = /^[a-zA-Z]+$/.test(trimmedValue) || ["transparent", "currentColor"].includes(trimmedValue);

  if (!isValidHex && !isValidRgb && !isValidRgba && !isValidHsl && !isValidHsla && !isValidNamed) {
    console.warn(
      `[TUEL] Invalid color format: ${value}, using default ${defaultValue}`
    );
    return { isValid: false, value: defaultValue };
  }

  return { isValid: true, value: trimmedValue };
}

/**
 * Validates numeric values with bounds checking
 */
export function validateNumber(
  value: number | undefined | null,
  defaultValue: number = 0,
  options: ValidationOptions = {}
): ValidationResult<number> {
  const { min = -Infinity, max = Infinity, warnOnInvalid = true } = options;

  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "number" || isNaN(value)) {
    const error = `Invalid number: ${value}, expected number`;
    if (warnOnInvalid) {
      console.warn(`[TUEL] ${error}, using default ${defaultValue}`);
    }
    return { isValid: false, value: defaultValue, error };
  }

  const clampedValue = Math.max(min, Math.min(max, value));
  if (clampedValue !== value && warnOnInvalid) {
    console.warn(
      `[TUEL] Number ${value} clamped to ${clampedValue} (range: ${min}-${max})`
    );
  }

  return { isValid: true, value: clampedValue };
}

/**
 * Validates animation variant strings
 */
export function validateAnimationVariant(
  value: string | undefined | null,
  validVariants: readonly string[],
  defaultValue: string
): ValidationResult<string> {
  if (value === undefined || value === null) {
    return { isValid: true, value: defaultValue };
  }

  if (typeof value !== "string") {
    console.warn(
      `[TUEL] Invalid variant: ${value}, using default ${defaultValue}`
    );
    return { isValid: false, value: defaultValue };
  }

  if (!validVariants.includes(value)) {
    console.warn(
      `[TUEL] Invalid variant: ${value}, valid options: ${validVariants.join(
        ", "
      )}, using default ${defaultValue}`
    );
    return { isValid: false, value: defaultValue };
  }

  return { isValid: true, value };
}

/**
 * Validates split type strings
 */
export function validateSplitType(
  value: string | undefined | null,
  defaultValue: string = "chars"
): ValidationResult<string> {
  const validSplitTypes = ["chars", "words", "lines"] as const;
  return validateAnimationVariant(value, validSplitTypes, defaultValue);
}

/**
 * Batch validation helper
 */
export function validateProps<T extends Record<string, unknown>>(
  props: T,
  validators: Partial<
    Record<keyof T, (value: unknown) => ValidationResult<unknown>>
  >
): T {
  const validatedProps = { ...props };

  for (const [key, validator] of Object.entries(validators)) {
    if (validator && key in validatedProps) {
      const result = validator(validatedProps[key]);
      validatedProps[key as keyof T] = result.value as T[keyof T];
    }
  }

  return validatedProps;
}
