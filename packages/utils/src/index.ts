// Utility function for conditional className joining (similar to clsx)
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

// Environment detection
export const isServer = typeof window === "undefined";
export const isClient = !isServer;
