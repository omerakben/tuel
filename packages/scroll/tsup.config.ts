import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  target: "es2020",
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false, // Minification handled by consumer's bundler
  external: ["react", "react-dom", "gsap", "three", "lenis", "framer-motion", "@tuel/*"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  injectStyle: true,
  loader: {
    ".css": "local-css",
  },
});
