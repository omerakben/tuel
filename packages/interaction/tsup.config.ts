import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
    tsconfig: "./tsconfig.json",
  },
  clean: true,
  external: ["react", "react-dom", "framer-motion", "gsap"],
  banner: {
    js: '"use client";',
  },
});
