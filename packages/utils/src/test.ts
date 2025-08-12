// Simple test export
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export const isClient = typeof window !== "undefined";
export const isServer = typeof window === "undefined";
