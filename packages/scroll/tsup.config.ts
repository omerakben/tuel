import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "gsap", "three", "lenis"],
  injectStyle: true,
  loader: {
    ".css": "local-css",
  },
});
