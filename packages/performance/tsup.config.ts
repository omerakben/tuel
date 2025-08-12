import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  clean: true,
  external: ["react", "react-dom", "framer-motion"],
  banner: {
    js: '"use client";',
  },
});
